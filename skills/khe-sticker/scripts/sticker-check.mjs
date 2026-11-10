#!/usr/bin/env node
// sticker-check.mjs: the gate for khe-sticker. Reads sticker SVGs as text, and a built pack's
// output files by their headers, and names every fault as a line.
//
//   node scripts/sticker-check.mjs <files or folders...> [--pack <folder>] [--kind <kind>] [--gate]
//                                  [--strict] [--allow-grey] [--report out.json] [--self-test] [--help]
//
// Each finding prints as `<line-name>: <what and where> (<file>:<line>)`.
// Two classes of line: never intentional (the gate fails on any) and candidates (yours to judge).
// The rules behind each line are in references/verify.md. No dependencies; Node 20+.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync, inflateSync } from "node:zlib";

const GATE = "sticker check";
const NOTE = "passing is necessary, not sufficient";
const KINDS = ["flat", "lettering", "character", "badge", "isometric", "reaction"];

// Every number below comes from references/sticker-craft.md, sticker-kinds.md or sticker-pack.md.
const CANVAS = 500; // units, square
const CHECK_PX = 160; // the small check size
const OUTLINES = [5, 4]; // units: 5, or 4 for a small, busy set
const PARTS = [3, 6]; // isometric: parts per object
const OCCUPANCY = [0.5, 0.65]; // the subject's larger side as a share of the canvas
const SET_BAND = 10; // points: every sticker of one set sits inside one band this wide
const CENTRE = 15; // units: how far the subject's box may sit from the canvas centre
const BUDGET = 30_000; // bytes for one sticker SVG
const SHAPES = 15; // pov default: about 15 shapes
const ACCENTS = 2; // two accents and white
const LOOP_FRAMES = [123, 180]; // at 60 fps
const SHORTEST_HOLD = 20; // frames at 60 fps: the shortest hold in the ten-sticker pack this pipeline shipped
const PACK = {
  png: 512, margin: 16, tray: 96,
  waStatic: 100_000, waAnimated: 500_000, tgWebm: 256_000, // bytes, each a strict "under"
  tgSeconds: 3, fps: 30,
};
const ROLES = ["main", "deep", "tint", "gold", "ok", "hot", "white", "grey", "paper", "ink"];
const ACCENT_ROLES = ["main", "deep", "tint", "gold", "ok", "hot"];

const NEVER = {
  "kind-undeclared": "no data-kind on the root and no --kind, or a kind this skill does not have",
  "wrong-canvas": "the root is not viewBox=\"0 0 500 500\", or it carries a fixed width or height",
  "off-canvas": "a shape reaches the canvas edge or passes it",
  "no-accessible-name": "the root neither names itself nor hides itself",
  "unnamed-group": "a <g> with no id, class, data-part or data-layer",
  "leaky-style": "a rule in the file's <style> that does not start at the root id",
  "hardcoded-color": "a paint that is not a palette role written as var(--role, fallback)",
  "outline-ink": "an outline in a paint other than the ink role",
  "outline-weight": "the outline is not 5 units (or 4), or there is no outline",
  "lost-at-160": "a stroke that is under one pixel at the 160 px check size",
  "skewed-outline": "a stroke under a skew, a non-uniform scale or non-scaling-stroke, so its weight changes across the sticker",
  "gradient-or-shadow": "a gradient, a filter, a blur, a glow or a drop shadow",
  "grey-fill": "a grey fill inside the sticker",
  "live-text": "a <text> element, which needs a font where the sticker renders",
  "external-asset": "an image, a script, an import, a font file or a link out of the file",
  "missing-diecut": "a static sticker with no die-cut layer and no data-diecut=\"none\" on the root",
  "fixed-diecut": "a die-cut that stays put while the art above it moves",
  "no-reduced-motion": "motion with no prefers-reduced-motion block that stops it on the rested still",
  "fade-pop": "opacity eased between values, where a part must pop with scale or switch on in one frame",
  "pop-from-zero": "a scale that starts or ends at 0 on both axes",
  "no-hold": "a loop in which something is always moving",
  "corner-origin": "a rotation or scale with no transform-origin, so it pivots on the canvas corner",
  "smil-motion": "SMIL, which the frame renderer cannot seek",
  "unrested-end": "a story that plays once and does not end on the rested still",
  "set-outline": "two outline weights in one set",
  "set-ink": "two ink colours in one set",
  "set-joins": "two stroke-linejoin styles in one set",
  "set-palette": "one role with two fallbacks across the files of a set",
  "part-count": "isometric: fewer than three or more than six parts",
  "flat-part": "isometric: a part with a face and no side",
  "unspoken-text": "lettering: no data-text on the root, or a <title> that does not carry those words",
  "no-face": "character: no part named eyes or face",
  "no-frame": "badge: no part named frame",
  "still-reaction": "reaction: a file with no motion in it",
  "manifest-gap": "a pack manifest that is missing a field, a sticker entry or a required output",
  "missing-output": "a file the pack must contain is not on disk",
  "unreadable-output": "an output file whose header could not be read",
  "png-size": "a still PNG that is not 512 by 512",
  "png-margin": "ink inside the 16 px margin of a still PNG",
  "opaque-ground": "a still PNG with no transparent ground",
  "tray-size": "a tray icon that is not 96 by 96",
  "webp-size": "a WebP that is not 512 by 512",
  "webp-not-animated": "a file in whatsapp/animated that holds one frame, or one in whatsapp/static that holds several",
  "over-weight": "an output file at or over its size limit",
  "webm-size": "a video sticker that is not 512 by 512",
  "webm-duration": "a video sticker longer than 3 seconds",
  "webm-codec": "a video sticker that is not VP9",
  "webm-no-alpha": "a video sticker with no alpha channel",
  "webm-audio": "a video sticker with an audio stream",
};

const CANDIDATE = {
  "mixed-outline": "more than one stroke-width in one sticker",
  "accent-budget": "more than two accent roles in one sticker",
  "unknown-role": "a role name outside the palette roles",
  "fallback-drift": "one role with two different fallbacks in one file",
  "shape-budget": "more than 15 drawn shapes",
  "decoration": "a layer named sparkle, star, twinkle or glint",
  "long-decimal": "coordinates with more than 2 decimals",
  "loop-length": "a loop outside 123 to 180 frames at 60 fps",
  "mixed-loop": "animations of different lengths in one file, so the hold could not be measured",
  "short-hold": "a hold under 20 frames",
  "lockstep": "every moving part starts on the same frame",
  "dead-rule": "an animation rule that matches nothing in the file",
  "repaint-property": "motion on a property other than transform or opacity",
  "occupancy": "the subject's larger side is outside 50 to 65% of the canvas",
  "off-centre": "the subject's box sits more than 15 units from the canvas centre",
  "over-budget": "a sticker SVG over 30 KB",
  "set-occupancy": "the stickers of one set differ by more than 10 points of occupancy",
  "set-motion": "the moving stickers of one set run on different lengths",
  "set-marks": "some moving stickers of a set carry impact marks and some do not",
  "uneven-inset": "badge: the mark is not centred in its frame",
  "webp-loop": "an animated WebP that does not loop forever",
  "webm-fps": "a video sticker that is not 30 fps",
};

const NOT_CHECKED = [
  "whether the sticker is one idea, and whether a stranger names it in a second",
  "the silhouette filled black at 160 px, and the sticker on a light, a dark and a chat-bubble ground",
  "optical centring, near-tangents and even insets as the eye sees them (the gate measures boxes only)",
  "whether the palette roles match the project's contract, and whether a colour reads as a stock tell",
  "whether the motion has a cause, whether one part leads, and whether the still tells the story",
  "the pivot: the gate checks that a transform-origin exists, never that it is the hinge",
  "the seam of the loop, the frame an impact mark lands on, and the canvas edge on every frame of the motion",
  "whether lettering is readable and correctly spelled once it is outlines",
  "pixels of WebP and WebM frames: the moving die-cut, the margin and the look are checked by eye",
  "any platform rule not written in references/sticker-pack.md: confirm it against the platform's current rules",
];

const HELP = `${GATE}: the gate for khe-sticker

usage: node scripts/sticker-check.mjs <files or folders...> [options]

  --pack <folder>   also check a built pack's outputs: png/, whatsapp/static/, whatsapp/animated/,
                    whatsapp/tray.png, telegram/. Sticker names come from <folder>/pack.json, else from svg/
  --kind <kind>     the kind, for files whose root has no data-kind: ${KINDS.join(", ")}
  --gate            end with "${GATE} passed" and exit 0 only when every never-intentional line is at 0;
                    otherwise print the counts and exit 1
  --strict          candidates fail the gate too
  --allow-grey      for a project whose pov.md allows grey inside a sticker
  --report <file>   write the findings as JSON
  --self-test       prove the gate on this skill's examples/ and teaching/ pairs
  --help            this text

Reads .svg stickers and pack manifests (.json with a "stickers" list). A finding prints as
  <line-name>: <what and where> (<file>:<line>)

Conventions the gate reads:
  data-kind="<kind>"   on the root <svg>. Shared lines apply to every kind, kind lines only to their kind
  data-part="<name>"   a part of the object (isometric: three to six of them)
  data-layer="<name>"  everything else: diecut, art, burst, and each group that carries one motion
  data-text="<words>"  on the root of a lettering sticker
  data-diecut="none"   on the root of a borderless sticker made for one known ground
  a set                the sticker files that share one folder: they are held to one outline, ink and palette
  var(--role, #hex)    every paint; a side shade is its face's role plus -side

Never intentional (the gate fails on any):
${Object.entries(NEVER).map(([k, v]) => `  ${(k + ":").padEnd(22)}${v}`).join("\n")}

Candidates (reported for judgment):
${Object.entries(CANDIDATE).map(([k, v]) => `  ${(k + ":").padEnd(22)}${v}`).join("\n")}

Not checked by the gate (answer these from a rendered frame):
${NOT_CHECKED.map((s) => `  - ${s}`).join("\n")}

Video stickers are read with ffprobe. Without it the gate prints "inconclusive: ffprobe not found"
for each .webm and never claims a pass for them.

Exit codes: 0 passed or report only, 1 failed, 2 inconclusive (nothing to check, or something it could not read).
${NOTE}`;

// ---------------------------------------------------------------- parsing
const SHAPE = new Set(["path", "rect", "circle", "ellipse", "polygon", "polyline", "line", "use"]);
const SMIL = new Set(["animate", "animateTransform", "animateMotion", "set"]);
const SAFE_PAINT = /^(none|currentcolor|inherit|transparent)$/i;

function lineOf(text, index) {
  let n = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

function parseSvg(text) {
  const root = { name: "#doc", attrs: {}, children: [], line: 1, parent: null, text: "" };
  const stack = [root];
  const all = [];
  const re = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<!\[CDATA\[[\s\S]*?\]\]>|<![^>]*>|<\/([\w:-]+)\s*>|<([\w:-]+)((?:\s+[\w:.-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[1]) {
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].name === m[1]) { stack.length = i; break; }
      continue;
    }
    if (!m[2]) continue;
    const attrs = {};
    for (const a of (m[3] || "").matchAll(/([\w:.-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g)) attrs[a[1]] = a[2] ?? a[3] ?? "";
    const el = { name: m[2], attrs, children: [], line: lineOf(text, m.index), parent: stack[stack.length - 1], text: "" };
    el.parent.children.push(el);
    all.push(el);
    if (m[4]) continue;
    if (el.name === "style" || el.name === "title" || el.name === "script") {
      const close = text.indexOf(`</${el.name}`, re.lastIndex);
      const end = close < 0 ? text.length : close;
      el.text = text.slice(re.lastIndex, end).replace(/<!\[CDATA\[|\]\]>/g, "");
      el.textIndex = re.lastIndex;
      re.lastIndex = end;
    }
    stack.push(el);
  }
  return { all, svg: all.find((e) => e.name === "svg") };
}

function blocks(css) {
  // top-level `prelude { body }` pairs, brace-matched
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    let depth = 1, j = open + 1;
    while (j < css.length && depth) { if (css[j] === "{") depth++; else if (css[j] === "}") depth--; j++; }
    out.push({ prelude: css.slice(i, open).trim(), body: css.slice(open + 1, j - 1), index: i });
    i = j;
  }
  return out;
}

function decls(body) {
  const d = {};
  for (const part of body.split(";")) {
    const k = part.indexOf(":");
    if (k > 0) d[part.slice(0, k).trim().toLowerCase()] = part.slice(k + 1).trim();
  }
  return d;
}

function parseCss(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, (s) => " ".repeat(s.length));
  const sheet = { rules: [], reduced: [], keyframes: {}, imports: /@import|@font-face/i.test(css) };
  const walk = (text, into, base) => {
    for (const b of blocks(text)) {
      if (/^@(-webkit-)?keyframes/i.test(b.prelude)) {
        const name = b.prelude.replace(/^@(-webkit-)?keyframes\s+/i, "").trim();
        const stops = [];
        for (const s of blocks(b.body)) {
          for (const p of s.prelude.split(",")) {
            const t = p.trim().toLowerCase();
            const pct = t === "from" ? 0 : t === "to" ? 100 : parseFloat(t);
            if (!Number.isNaN(pct)) stops.push({ pct, d: decls(s.body) });
          }
        }
        sheet.keyframes[name] = stops.sort((a, b2) => a.pct - b2.pct);
      } else if (/^@media/i.test(b.prelude)) {
        walk(b.body, /prefers-reduced-motion/i.test(b.prelude) ? sheet.reduced : into, base + b.index);
      } else if (!b.prelude.startsWith("@")) {
        into.push({ selector: b.prelude.replace(/\s+/g, " "), d: decls(b.body), index: base + b.index });
      }
    }
  };
  walk(css, sheet.rules, 0);
  return sheet;
}

function seconds(tok) {
  const m = /^(-?[\d.]+)(ms|s)$/.exec(tok);
  return m ? parseFloat(m[1]) / (m[2] === "ms" ? 1000 : 1) : null;
}

function animationsOf(sheet) {
  const out = [];
  for (const r of sheet.rules) {
    const a = r.d.animation || "";
    const nameDecl = r.d["animation-name"];
    if (!a && !nameDecl) continue;
    for (const one of (a || nameDecl).split(/,(?![^(]*\))/)) {
      const toks = one.trim().split(/\s+(?![^(]*\))/);
      const name = toks.find((t) => sheet.keyframes[t]) || (nameDecl && sheet.keyframes[nameDecl] ? nameDecl : null);
      if (!name) continue;
      const times = toks.map(seconds).filter((t) => t !== null);
      out.push({
        rule: r, name, dur: times[0] ?? seconds(r.d["animation-duration"] || "") ?? 0, delay: times[1] ?? 0,
        infinite: /\binfinite\b/.test(one) || r.d["animation-iteration-count"] === "infinite",
        stepped: /steps\(|step-(start|end)/.test(one) || /steps\(|step-/.test(r.d["animation-timing-function"] || ""),
      });
    }
  }
  return out;
}

function matchCompound(el, compound) {
  let c = compound;
  const tag = /^[a-zA-Z][\w-]*/.exec(c);
  if (tag) { if (el.name !== tag[0]) return false; c = c.slice(tag[0].length); }
  c = c.replace(/^\*/, "");
  for (const m of c.matchAll(/#([\w-]+)|\.([\w-]+)|\[([\w:-]+)(?:\s*([~|^$*]?=)\s*["']?([^"'\]]*)["']?)?\]|:[\w-]+(\([^)]*\))?/g)) {
    if (m[1] !== undefined) { if (el.attrs.id !== m[1]) return false; }
    else if (m[2] !== undefined) { if (!(el.attrs.class || "").split(/\s+/).includes(m[2])) return false; }
    else if (m[3] !== undefined) {
      const v = el.attrs[m[3]];
      if (v === undefined) return false;
      if (m[4] === "=" && v !== m[5]) return false;
      if (m[4] === "^=" && !v.startsWith(m[5])) return false;
      if (m[4] === "$=" && !v.endsWith(m[5])) return false;
      if (m[4] === "*=" && !v.includes(m[5])) return false;
    }
  }
  return true;
}

function matched(doc, selector) {
  const out = [];
  for (const sel of selector.split(",")) {
    const last = sel.trim().split(/[\s>+~]+/).pop();
    if (!last) continue;
    for (const el of doc.all) if (el.name !== "style" && matchCompound(el, last)) out.push(el);
  }
  return out;
}

const within = (el, test) => { for (let p = el; p; p = p.parent) if (test(p)) return true; return false; };
const isDiecut = (el) => el.attrs && el.attrs["data-layer"] === "diecut";

function paint(value) {
  const v = value.trim();
  if (SAFE_PAINT.test(v)) return { safe: true };
  const m = /^var\(\s*--([\w-]+)\s*(?:,\s*([^)]+?)\s*)?\)$/.exec(v);
  if (m) return { role: m[1], fallback: m[2] };
  if (/^url\(/.test(v)) return { url: true };
  return { bad: v };
}

function rgb(hex) {
  let h = (hex || "").trim().toLowerCase();
  if (/^#[0-9a-f]{3}$/.test(h)) h = "#" + [...h.slice(1)].map((c) => c + c).join("");
  if (!/^#[0-9a-f]{6}$/.test(h)) return null;
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function boxOf(el) {
  // absolute M, L, H, V, Z paths and the basic shapes; null when the gate cannot measure it
  if (within(el, (p) => p.attrs && p.attrs.transform)) return null;
  const a = el.attrs, n = (k) => parseFloat(a[k] || "0");
  if (el.name === "circle") return [n("cx") - n("r"), n("cy") - n("r"), n("cx") + n("r"), n("cy") + n("r")];
  if (el.name === "ellipse") return [n("cx") - n("rx"), n("cy") - n("ry"), n("cx") + n("rx"), n("cy") + n("ry")];
  if (el.name === "rect") return [n("x"), n("y"), n("x") + n("width"), n("y") + n("height")];
  if (el.name === "line") return [Math.min(n("x1"), n("x2")), Math.min(n("y1"), n("y2")), Math.max(n("x1"), n("x2")), Math.max(n("y1"), n("y2"))];
  let xs = [], ys = [];
  if (el.name === "polygon" || el.name === "polyline") {
    const p = (a.points || "").trim().split(/[\s,]+/).map(Number);
    for (let i = 0; i + 1 < p.length; i += 2) { xs.push(p[i]); ys.push(p[i + 1]); }
  } else if (el.name === "path") {
    const d = a.d || "";
    if (/[a-zACSQT]/.test(d.replace(/[zZ]/g, ""))) return null;
    let x = 0, y = 0;
    for (const m of d.matchAll(/([MLHV])([^MLHVZz]*)/g)) {
      const nums = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/gi) || []).map(Number);
      if (m[1] === "H") for (const v of nums) { x = v; xs.push(x); ys.push(y); }
      else if (m[1] === "V") for (const v of nums) { y = v; xs.push(x); ys.push(y); }
      else for (let i = 0; i + 1 < nums.length; i += 2) { x = nums[i]; y = nums[i + 1]; xs.push(x); ys.push(y); }
    }
  } else return null;
  if (!xs.length) return null;
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function unionBox(els) {
  let u = null;
  for (const el of els) {
    const b = boxOf(el);
    if (!b) return null;
    u = u ? [Math.min(u[0], b[0]), Math.min(u[1], b[1]), Math.max(u[2], b[2]), Math.max(u[3], b[3])] : b;
  }
  return u;
}

// ---------------------------------------------------------------- the sticker checks
function checkSticker(file, text, opt, add) {
  const stats = { file, moving: false };
  opt.stats.push(stats);
  const doc = parseSvg(text);
  const svg = doc.svg;
  if (!svg) { add("unreadable-output", "no <svg> element in the file", file, 1); return; }
  const at = (el) => (el ? el.line : 1);
  const never = (line, detail, el) => add(line, detail, file, typeof el === "number" ? el : at(el));
  const a = svg.attrs;
  const id = a.id || "";
  const kind = a["data-kind"] || opt.kind || "";
  const styles = doc.all.filter((e) => e.name === "style");
  const css = styles.map((s) => s.text).join("\n");
  const sheet = parseCss(css);
  const anims = animationsOf(sheet);
  const smil = doc.all.filter((e) => SMIL.has(e.name));
  const hasTransition = [...sheet.rules, ...sheet.reduced].some((r) => r.d.transition && !/^none/.test(r.d.transition));
  const moving = anims.length > 0 || smil.length > 0 || hasTransition;
  const shapes = doc.all.filter((e) => SHAPE.has(e.name) && !within(e, (p) => p.name === "defs" || p.name === "clipPath" || p.name === "mask"));
  const art = shapes.filter((e) => !within(e, isDiecut));
  const parts = doc.all.filter((e) => e.attrs["data-part"] !== undefined);
  const diecut = doc.all.find(isDiecut);
  const isBurst = (el) => el.attrs && /^burst/.test(el.attrs["data-layer"] || "");
  stats.moving = moving; stats.joins = a["stroke-linejoin"] || "miter"; stats.marks = doc.all.some(isBurst);
  if (Buffer.byteLength(text) > BUDGET) add("over-budget", `${(Buffer.byteLength(text) / 1000).toFixed(1)} KB: a sticker SVG is under ${BUDGET / 1000} KB`, file, 1);

  // ---- root
  if (!KINDS.includes(kind)) never("kind-undeclared", kind ? `"${kind}" is not one of ${KINDS.join(", ")}` : "the root has no data-kind, so no kind lines were applied", svg);
  if ((a.viewBox || "").trim().replace(/[\s,]+/g, " ") !== `0 0 ${CANVAS} ${CANVAS}`) never("wrong-canvas", `viewBox is "${a.viewBox || ""}", the canvas is 0 0 ${CANVAS} ${CANVAS}`, svg);
  if (a.width !== undefined || a.height !== undefined) never("wrong-canvas", "a fixed width or height on the root: size comes from where it is placed", svg);
  const title = doc.all.find((e) => e.name === "title" && e.parent === svg);
  if (!title && !a["aria-label"] && !a["aria-labelledby"] && a["aria-hidden"] !== "true") never("no-accessible-name", "no <title>, no aria-label and no aria-hidden on the root", svg);

  // ---- structure
  for (const g of doc.all.filter((e) => e.name === "g")) {
    if (!g.attrs.id && !g.attrs.class && g.attrs["data-part"] === undefined && g.attrs["data-layer"] === undefined) never("unnamed-group", "a <g> nobody can address: give it data-part or data-layer", g);
  }
  for (const r of [...sheet.rules, ...sheet.reduced]) {
    for (const sel of r.selector.split(",")) {
      if (!id || !new RegExp(`^#${id}(?![\\w-])`).test(sel.trim())) { never("leaky-style", `"${sel.trim()}" does not start at ${id ? "#" + id : "a root id (the root has none)"}`, styleLine(styles, text, r)); break; }
    }
  }
  for (const e of doc.all) {
    if (e.name === "text" || e.name === "tspan" || e.name === "textPath") never("live-text", `<${e.name}>: draw the letters as outlines`, e);
    if (e.name === "image" || e.name === "script" || e.name === "foreignObject" || e.name === "iframe") never("external-asset", `<${e.name}> inside the sticker`, e);
    const href = e.attrs.href ?? e.attrs["xlink:href"];
    if (href !== undefined && !href.startsWith("#") && e.name !== "image") never("external-asset", `a link out of the file: ${href.slice(0, 40)}`, e);
    if (/Gradient$/.test(e.name) || e.name === "filter" || /^fe[A-Z]/.test(e.name) || e.name === "pattern") never("gradient-or-shadow", `<${e.name}>`, e);
    if (e.attrs.filter && e.attrs.filter !== "none") never("gradient-or-shadow", `filter="${e.attrs.filter}"`, e);
    if (e.attrs["vector-effect"] === "non-scaling-stroke") never("skewed-outline", "vector-effect=\"non-scaling-stroke\": the outline stops shrinking with the sticker", e);
    if (SMIL.has(e.name)) never("smil-motion", `<${e.name}>: write the motion as CSS keyframes on a named group`, e);
  }
  if (sheet.imports || /url\(\s*["']?(https?:|\/\/|data:)/i.test(css)) never("external-asset", "@import, @font-face or a url() that leaves the file", styles[0]);
  if (/drop-shadow\(|box-shadow|text-shadow|blur\(|gradient\(/i.test(css)) never("gradient-or-shadow", "a shadow, blur or gradient in the file's <style>", styles[0]);
  if (/non-scaling-stroke/.test(css)) never("skewed-outline", "vector-effect: non-scaling-stroke in the file's <style>", styles[0]);

  // ---- transforms written on elements
  for (const e of doc.all) {
    const t = e.attrs.transform;
    if (!t || within(e, isDiecut)) continue;
    let skew = /skew[XY]?\(/.test(t);
    for (const m of t.matchAll(/matrix\(([^)]*)\)/g)) {
      const [ma, mb, mc, md] = m[1].trim().split(/[\s,]+/).map(Number);
      const same = Math.abs(ma - md) < 0.001 && Math.abs(mb + mc) < 0.001;
      const flip = Math.abs(ma + md) < 0.001 && Math.abs(mb - mc) < 0.001;
      if (!same && !flip) skew = true;
    }
    for (const m of t.matchAll(/scale\(([^)]*)\)/g)) {
      const s = m[1].trim().split(/[\s,]+/).map(Number);
      if (s.length > 1 && Math.abs(Math.abs(s[0]) - Math.abs(s[1])) > 0.001) skew = true;
    }
    if (skew) never("skewed-outline", `transform="${t.slice(0, 48)}" leans the outline with the face: bake the lean into the path data`, e);
  }

  // ---- paint
  const paints = []; // { prop, value, el, line }
  for (const e of doc.all) {
    for (const prop of ["fill", "stroke", "stop-color", "color", "flood-color"]) if (e.attrs[prop] !== undefined) paints.push({ prop, value: e.attrs[prop], el: e, line: e.line });
    if (e.attrs.style) for (const [k, v] of Object.entries(decls(e.attrs.style))) if (["fill", "stroke", "color"].includes(k)) paints.push({ prop: k, value: v, el: e, line: e.line });
  }
  for (const r of [...sheet.rules, ...sheet.reduced]) for (const k of ["fill", "stroke", "color"]) if (r.d[k]) paints.push({ prop: k, value: r.d[k], el: null, line: styleLine(styles, text, r) });
  for (const k of Object.values(sheet.keyframes)) for (const s of k) for (const p of ["fill", "stroke", "color"]) if (s.d[p]) paints.push({ prop: p, value: s.d[p], el: null, line: at(styles[0]) });
  const roles = new Map();
  for (const p of paints) {
    const v = paint(p.value);
    if (v.safe || v.url) continue;
    if (v.bad !== undefined) { never("hardcoded-color", `${p.prop}="${v.bad}": write it as var(--role, ${/^#/.test(v.bad) ? v.bad : "#hex"})`, p.line); continue; }
    if (!v.fallback) { never("hardcoded-color", `${p.prop}="var(--${v.role})" has no fallback, so it paints black wherever the page does not set it`, p.line); continue; }
    const base = v.role.replace(/-side$/, "");
    if (!ROLES.includes(base)) add("unknown-role", `--${v.role} is not a palette role (${ROLES.join(", ")}, each with an optional -side)`, file, p.line);
    if (!roles.has(v.role)) roles.set(v.role, new Set());
    roles.get(v.role).add(v.fallback.toLowerCase());
    if (p.prop === "stroke" && v.role !== "ink" && !(p.el && within(p.el, isDiecut))) never("outline-ink", `stroke="var(--${v.role}, ...)": the outline is the ink role, on every part`, p.line);
    if (p.prop === "fill" && !opt.allowGrey && !(p.el && within(p.el, isDiecut))) {
      const c = rgb(v.fallback);
      const flat = c && Math.max(...c) - Math.min(...c) <= 10;
      const mid = c && (c[0] + c[1] + c[2]) / 3 < 245;
      if (base === "grey" || (flat && mid && base !== "ink")) never("grey-fill", `fill="var(--${v.role}, ${v.fallback})" is grey: use a pastel of the palette (a white part's side is --white-side)`, p.line);
    }
  }
  stats.roles = roles;
  for (const [role, set] of roles) if (set.size > 1) add("fallback-drift", `--${role} has ${set.size} fallbacks in this file: ${[...set].join(", ")}`, file, 1);
  const accents = ACCENT_ROLES.filter((r) => roles.has(r) || roles.has(r + "-side"));
  if (accents.length > ACCENTS) add("accent-budget", `${accents.length} accents (${accents.join(", ")}): the budget is ${ACCENTS} and white`, file, 1);

  // ---- outline
  const widths = [];
  for (const e of doc.all) if (e.attrs["stroke-width"] !== undefined) widths.push({ w: parseFloat(e.attrs["stroke-width"]), el: e, line: e.line });
  for (const r of sheet.rules) if (r.d["stroke-width"]) widths.push({ w: parseFloat(r.d["stroke-width"]), el: null, line: styleLine(styles, text, r) });
  const strokes = paints.filter((p) => p.prop === "stroke" && !/^(none|transparent)$/i.test(p.value.trim()));
  if (!strokes.length) never("outline-weight", "nothing in the file is stroked: every part takes the one ink outline", svg);
  else {
    const main = a["stroke-width"] !== undefined ? parseFloat(a["stroke-width"]) : widths.length ? mode(widths.map((w) => w.w)) : 1;
    stats.outline = main;
    if (!OUTLINES.includes(main)) never("outline-weight", `the outline is ${main} units: it is ${OUTLINES[0]}, or ${OUTLINES[1]} for a small, busy set`, svg);
    const live = widths.filter((w) => !(w.el && (w.el.attrs.stroke === "none" || within(w.el, isDiecut))));
    for (const w of live) if (w.w > 0 && (w.w * CHECK_PX) / CANVAS < 1) never("lost-at-160", `stroke-width ${w.w} is ${((w.w * CHECK_PX) / CANVAS).toFixed(2)} px at ${CHECK_PX} px`, w.line);
    const set = [...new Set([main, ...live.map((w) => w.w)])];
    if (set.length > 1) add("mixed-outline", `${set.length} stroke weights (${set.join(", ")})`, file, 1);
  }

  // ---- geometry the gate can measure
  if (art.length > 0) {
    const counted = art.filter((e) => !within(e, isBurst) && !/-side\s*,/.test(e.attrs.fill || ""));
    if (counted.length > SHAPES) add("shape-budget", `${counted.length} drawn shapes: the default is about ${SHAPES}`, file, 1);
  }
  for (const e of shapes) {
    const b = boxOf(e);
    if (b && (b[0] <= 0 || b[1] <= 0 || b[2] >= CANVAS || b[3] >= CANVAS)) { never("off-canvas", `a shape spans ${b.map((n) => Math.round(n)).join(" ")} on a ${CANVAS}-unit canvas`, e); break; }
  }
  const subject = art.filter((e) => !within(e, isBurst) && (e.attrs.stroke || "") !== "none" && e.attrs.fill !== "none");
  const u = subject.length ? unionBox(subject) : null;
  if (u) {
    const share = Math.max(u[2] - u[0], u[3] - u[1]) / CANVAS;
    stats.share = share;
    if (share < OCCUPANCY[0] - 0.005 || share > OCCUPANCY[1] + 0.005) add("occupancy", `the subject spans ${Math.round(share * 100)}% of the canvas: the range is ${OCCUPANCY[0] * 100} to ${OCCUPANCY[1] * 100}%`, file, 1);
    const dx = (u[0] + u[2]) / 2 - CANVAS / 2, dy = (u[1] + u[3]) / 2 - CANVAS / 2;
    if (Math.abs(dx) > CENTRE || Math.abs(dy) > CENTRE) add("off-centre", `the subject's box sits ${Math.round(dx)} across and ${Math.round(dy)} down from the centre: the tolerance is ${CENTRE} units`, file, 1);
  } else if (subject.length) opt.notChecked.push(`${file}: occupancy and centring (curves or transforms the gate does not measure)`);
  const longDec = shapes.find((e) => /\d\.\d{3,}/.test(e.attrs.d || e.attrs.points || ""));
  if (longDec) add("long-decimal", "coordinates with more than 2 decimals: draw on whole units", file, longDec.line);
  for (const e of doc.all) {
    const n = `${e.attrs.id || ""} ${e.attrs["data-layer"] || ""} ${e.attrs["data-part"] || ""} ${e.attrs.class || ""}`;
    if (/sparkle|twinkle|glint|\bstars?\b|-stars?\b/i.test(n)) { add("decoration", `"${n.trim()}": a sparkle or star is an impact mark on the beat, never ornament`, file, e.line); break; }
  }

  // ---- die-cut
  if (!moving && !diecut && kind !== "reaction" && a["data-diecut"] !== "none") never("missing-diecut", "a static sticker with no <g data-layer=\"diecut\">: the white border is the first layer", svg);

  // ---- kind lines
  if (kind === "isometric") {
    if (parts.length < PARTS[0] || parts.length > PARTS[1]) never("part-count", `${parts.length} part${parts.length === 1 ? "" : "s"} (data-part): an object is ${PARTS[0]} to ${PARTS[1]} parts, each with its own thickness`, svg);
    for (const p of parts) {
      const fills = p.children.filter((c) => SHAPE.has(c.name)).map((c) => c.attrs.fill || "");
      if (fills.length && !fills.some((f) => /-side\s*,/.test(f))) never("flat-part", `part "${p.attrs["data-part"]}" has a face and no side: every part is a slab`, p);
    }
  }
  if (kind === "lettering") {
    const words = (a["data-text"] || "").trim();
    if (!words) never("unspoken-text", "no data-text on the root: outlines cannot be read aloud, so the root says the words", svg);
    else if (!title || !title.text.toLowerCase().includes(words.toLowerCase())) never("unspoken-text", `the <title> does not contain "${words}"`, title || svg);
  }
  if (kind === "character" && !parts.some((p) => /^(eyes?|face)(-|$)/.test(p.attrs["data-part"]))) never("no-face", "no part named eyes or face: the emotion has nothing to move", svg);
  if (kind === "badge") {
    const frame = parts.find((p) => p.attrs["data-part"] === "frame");
    if (!frame) never("no-frame", "no part named frame: a badge is a closed shape that carries a mark", svg);
    const mark = parts.find((p) => /^(mark|word|label)$/.test(p.attrs["data-part"]));
    if (frame && mark) {
      const f = unionBox(frame.children.filter((c) => SHAPE.has(c.name))), m = unionBox(mark.children.filter((c) => SHAPE.has(c.name)));
      const slabbed = art.some((e) => /-side\s*,/.test(e.attrs.fill || ""));
      if (slabbed) opt.notChecked.push(`${file}: the mark's insets (a slab badge raises its mark off the plate, so its box is not its centre)`);
      else if (f && m) {
        const dx = Math.abs((m[0] - f[0]) - (f[2] - m[2])), dy = Math.abs((m[1] - f[1]) - (f[3] - m[3]));
        if (dx > 1 || dy > 1) add("uneven-inset", `the mark sits ${Math.round(dx)} units off centre across and ${Math.round(dy)} down`, file, mark.line);
      } else opt.notChecked.push(`${file}: the mark's insets (curves or transforms the gate does not measure)`);
    }
  }
  if (kind === "reaction" && !moving) never("still-reaction", "a reaction sticker is its motion: this file has none", svg);

  // ---- motion
  if (!moving) return;
  if (!sheet.reduced.some((r) => /^none/.test(r.d.animation || "") || r.d["animation-name"] === "none")) {
    if (anims.length || hasTransition) never("no-reduced-motion", sheet.reduced.length ? "the prefers-reduced-motion block never sets animation: none" : "no @media (prefers-reduced-motion: reduce) block in the file", styles[0] || svg);
  }
  for (const r of sheet.rules) if (r.d.transition && /opacity|all/.test(r.d.transition)) never("fade-pop", `transition: ${r.d.transition}`, styleLine(styles, text, r));
  const zero = /scale(3d)?\(\s*0*\.?0+\s*(,\s*0*\.?0+\s*)*\)/;
  const used = new Map();
  for (const an of anims) if (!used.has(an.name)) used.set(an.name, an);
  const movingSpans = [];
  const starts = [];
  for (const [name, an] of used) {
    const stops = sheet.keyframes[name];
    const line = styleLine(styles, text, an.rule);
    const props = new Set(stops.flatMap((s) => Object.keys(s.d).filter((k) => k !== "animation-timing-function")));
    for (const p of props) if (p !== "transform" && p !== "opacity") add("repaint-property", `@keyframes ${name} animates ${p}`, file, line);
    if (props.has("opacity")) {
      const values = new Set(stops.map((s) => s.d.opacity).filter((v) => v !== undefined));
      const everyStepped = stops.slice(0, -1).every((s) => /steps\(|step-/.test(s.d["animation-timing-function"] || ""));
      if (values.size > 1 && !an.stepped && !everyStepped) never("fade-pop", `@keyframes ${name} eases opacity: pop with scale, or switch it with steps(1, end)`, line);
    }
    if (stops.some((s) => zero.test(s.d.transform || ""))) never("pop-from-zero", `@keyframes ${name} reaches scale(0): a pop starts at 0.2`, line);
    if (stops.some((s) => /rotate|scale|skew/.test(s.d.transform || ""))) {
      const same = sheet.rules.filter((r) => r.selector === an.rule.selector);
      if (!same.some((r) => r.d["transform-origin"])) never("corner-origin", `"${an.rule.selector}" turns or scales with no transform-origin: set transform-box: fill-box and the hinge`, line);
    }
    if (!an.infinite && props.has("transform") && !/burst/.test(an.rule.selector)) {
      const last = stops[stops.length - 1].d.transform || "";
      const moved = [...last.matchAll(/([a-zA-Z0-9]+)\(([^)]*)\)/g)].some(([, fn, args]) => args.split(/[\s,]+/).filter(Boolean).some((n) => parseFloat(n) !== (/^scale/.test(fn) ? 1 : 0)));
      if (moved) never("unrested-end", `@keyframes ${name} ends on "${last}": a story that plays once ends on the rested still`, line);
    }
    if (!matched(doc, an.rule.selector).length) add("dead-rule", `"${an.rule.selector}" matches nothing in the file`, file, line);
    // spans of the loop in which this group changes
    let first = null;
    for (let i = 0; i + 1 < stops.length; i++) {
      const stepped = an.stepped || /steps\(|step-/.test(stops[i].d["animation-timing-function"] || "");
      const changed = ["transform", "opacity"].some((p) => norm(stops[i].d[p]) !== norm(stops[i + 1].d[p]));
      if (!changed) continue;
      if (first === null) first = stops[i].pct;
      if (!stepped) movingSpans.push([stops[i].pct, stops[i + 1].pct]);
    }
    if (first !== null && props.has("transform") && !/burst/.test(an.rule.selector)) starts.push(first);
  }
  if (sheet.rules.some((r) => zero.test(r.d.transform || ""))) never("pop-from-zero", "a rule rests a part at scale(0)", styles[0]);

  const loops = anims.filter((an) => an.infinite);
  stats.length = [...new Set(anims.map((an) => an.dur))].join("/");
  if (loops.length) {
    const durs = [...new Set(anims.map((an) => `${an.dur}|${an.delay}`))];
    for (const d of new Set(loops.map((an) => an.dur))) {
      const frames = Math.round(d * 60);
      if (frames < LOOP_FRAMES[0] || frames > LOOP_FRAMES[1]) add("loop-length", `a loop of ${frames} frames (${d}s): the range is ${LOOP_FRAMES[0]} to ${LOOP_FRAMES[1]} at 60 fps`, file, at(styles[0]));
    }
    if (durs.length > 1) add("mixed-loop", `${durs.length} different lengths or delays: put every group on one loop so the hold can be measured`, file, at(styles[0]));
    else {
      const hold = longestStill(movingSpans);
      const frames = Math.round((hold / 100) * loops[0].dur * 60);
      if (hold < 0.5) never("no-hold", "something moves on every frame of the loop: end the action, then hold the still", styles[0]);
      else if (frames < SHORTEST_HOLD) add("short-hold", `the longest still span is ${frames} frames: the shortest in the shipped pack is ${SHORTEST_HOLD}`, file, at(styles[0]));
    }
  }
  if (starts.length > 1 && new Set(starts).size === 1) add("lockstep", `${starts.length} groups all start moving at ${starts[0]}%: children follow 4 to 6 frames late`, file, at(styles[0]));
  if (diecut && anims.length) {
    const movers = new Set(anims.filter((an) => sheet.keyframes[an.name].some((s) => s.d.transform)).flatMap((an) => matched(doc, an.rule.selector)));
    const artMoves = art.some((e) => within(e, (p) => movers.has(p)));
    if (artMoves && !within(diecut, (p) => movers.has(p))) never("fixed-diecut", "the die-cut sits outside every moving group: put it inside the group that moves the whole sticker, or leave it to the render step", diecut);
  }
}

const norm = (v) => (v === undefined ? "" : v.replace(/\s+/g, ""));
const mode = (xs) => { const c = new Map(); for (const x of xs) c.set(x, (c.get(x) || 0) + 1); return [...c].sort((p, q) => q[1] - p[1])[0][0]; };

function styleLine(styles, text, rule) {
  const s = styles[0];
  if (!s || s.textIndex === undefined) return 1;
  return lineOf(text, s.textIndex + (rule.index || 0) + 1);
}

function longestStill(spans) {
  // spans: [from%, to%] in which something moves. Returns the longest gap, joining the end to the start.
  const s = spans.map(([p, q]) => [Math.min(p, q), Math.max(p, q)]).sort((p, q) => p[0] - q[0]);
  if (!s.length) return 100;
  const merged = [s[0].slice()];
  for (const [p, q] of s.slice(1)) { const last = merged[merged.length - 1]; if (p <= last[1]) last[1] = Math.max(last[1], q); else merged.push([p, q]); }
  let best = merged[0][0] + (100 - merged[merged.length - 1][1]);
  for (let i = 0; i + 1 < merged.length; i++) best = Math.max(best, merged[i + 1][0] - merged[i][1]);
  return best;
}

// ---------------------------------------------------------------- pack: manifest and output files
const OUTPUTS = {
  svg: (n) => join("svg", `${n}.svg`),
  animated: (n) => join("animated", `${n}.svg`),
  png: (n) => join("png", `${n}.png`),
  whatsappStatic: (n) => join("whatsapp", "static", `${n}.webp`),
  whatsappAnimated: (n) => join("whatsapp", "animated", `${n}.webp`),
  telegram: (n) => join("telegram", `${n}.webm`),
};
const MOVING_OUTPUTS = ["animated", "whatsappAnimated", "telegram"];
const MANIFEST_NUMBERS = {
  png: { size: PACK.png, margin: PACK.margin },
  whatsappStatic: { size: PACK.png, underBytes: PACK.waStatic },
  whatsappAnimated: { size: PACK.png, underBytes: PACK.waAnimated },
  tray: { size: PACK.tray },
  telegram: { size: PACK.png, underBytes: PACK.tgWebm, maxSeconds: PACK.tgSeconds, fps: PACK.fps },
};

function checkManifest(file, text, add) {
  let m;
  try { m = JSON.parse(text); } catch (e) { add("manifest-gap", `not valid JSON: ${e.message}`, file, 1); return null; }
  const where = (needle) => { const i = text.indexOf(needle); return i < 0 ? 1 : lineOf(text, i); };
  for (const k of ["name", "canvas", "stickers", "outputs"]) if (m[k] === undefined) add("manifest-gap", `no "${k}"`, file, 1);
  if (m.canvas !== undefined && m.canvas !== CANVAS) add("manifest-gap", `"canvas" is ${m.canvas}: stickers are drawn on ${CANVAS} units`, file, where('"canvas"'));
  const stickers = Array.isArray(m.stickers) ? m.stickers : [];
  if (!stickers.length) add("manifest-gap", "\"stickers\" is empty", file, where('"stickers"'));
  const seen = new Set();
  for (const s of stickers) {
    const line = where(`"${s.name}"`);
    if (!s.name || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s.name)) add("manifest-gap", `a sticker name must be lowercase words joined by hyphens: ${JSON.stringify(s.name)}`, file, line);
    if (seen.has(s.name)) add("manifest-gap", `"${s.name}" is listed twice`, file, line);
    seen.add(s.name);
    if (!KINDS.includes(s.kind)) add("manifest-gap", `"${s.name}" has no kind (${KINDS.join(", ")})`, file, line);
    if (!s.title) add("manifest-gap", `"${s.name}" has no title: it is what the sticker says, in words`, file, line);
    if (typeof s.animated !== "boolean") add("manifest-gap", `"${s.name}" does not say whether it is animated`, file, line);
    if (s.animated && !s.verb) add("manifest-gap", `"${s.name}" moves and names no verb`, file, line);
    if (s.kind === "reaction" && s.animated === false) add("manifest-gap", `"${s.name}" is a reaction and is marked as not animated`, file, line);
  }
  const outs = m.outputs || {};
  for (const k of [...Object.keys(OUTPUTS), "tray"]) {
    if (!outs[k]) { add("manifest-gap", `"outputs" has no "${k}"`, file, where('"outputs"')); continue; }
    if (!outs[k].path) add("manifest-gap", `outputs.${k} has no "path"`, file, where(`"${k}"`));
    for (const [field, want] of Object.entries(MANIFEST_NUMBERS[k] || {})) {
      if (outs[k][field] !== want) add("manifest-gap", `outputs.${k}.${field} is ${JSON.stringify(outs[k][field])}: the pack rule is ${want}`, file, where(`"${k}"`));
    }
  }
  return m;
}

function pngInfo(buf) {
  if (buf.length < 33 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  const info = { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), depth: buf[24], type: buf[25], interlace: buf[28], alpha: null };
  if ((info.type !== 6 && info.type !== 4) || info.depth !== 8 || info.interlace) return info;
  try {
    const idat = [];
    for (let p = 8; p + 8 <= buf.length;) {
      const len = buf.readUInt32BE(p), tag = buf.toString("latin1", p + 4, p + 8);
      if (tag === "IDAT") idat.push(buf.subarray(p + 8, p + 8 + len));
      p += 12 + len;
    }
    const raw = inflateSync(Buffer.concat(idat));
    const bpp = info.type === 6 ? 4 : 2, stride = info.width * bpp;
    const out = Buffer.alloc(info.height * stride);
    for (let y = 0; y < info.height; y++) {
      const f = raw[y * (stride + 1)], row = y * stride, src = y * (stride + 1) + 1;
      for (let x = 0; x < stride; x++) {
        const left = x >= bpp ? out[row + x - bpp] : 0, up = y ? out[row - stride + x] : 0, ul = y && x >= bpp ? out[row - stride + x - bpp] : 0;
        let v = raw[src + x];
        if (f === 1) v += left; else if (f === 2) v += up; else if (f === 3) v += (left + up) >> 1;
        else if (f === 4) { const p = left + up - ul, pa = Math.abs(p - left), pb = Math.abs(p - up), pc = Math.abs(p - ul); v += pa <= pb && pa <= pc ? left : pb <= pc ? up : ul; }
        out[row + x] = v & 255;
      }
    }
    info.alpha = (x, y) => out[y * stride + x * bpp + bpp - 1];
  } catch { info.alpha = null; }
  return info;
}

function webpInfo(buf) {
  if (buf.length < 30 || buf.toString("latin1", 0, 4) !== "RIFF" || buf.toString("latin1", 8, 12) !== "WEBP") return null;
  const info = { width: 0, height: 0, animated: false, frames: 0, ms: 0, loop: null };
  for (let p = 12; p + 8 <= buf.length;) {
    const tag = buf.toString("latin1", p, p + 4), len = buf.readUInt32LE(p + 4), d = p + 8;
    if (tag === "VP8X") { info.animated = (buf[d] & 2) !== 0; info.width = 1 + buf.readUIntLE(d + 4, 3); info.height = 1 + buf.readUIntLE(d + 7, 3); }
    else if (tag === "VP8 " && !info.width) { info.width = buf.readUInt16LE(d + 6) & 0x3fff; info.height = buf.readUInt16LE(d + 8) & 0x3fff; }
    else if (tag === "VP8L" && !info.width) { const b = buf.readUInt32LE(d + 1); info.width = 1 + (b & 0x3fff); info.height = 1 + ((b >> 14) & 0x3fff); }
    else if (tag === "ANIM") info.loop = buf.readUInt16LE(d + 4);
    else if (tag === "ANMF") { info.frames++; info.ms += buf.readUIntLE(d + 12, 3); }
    p = d + len + (len & 1);
  }
  return info.width ? info : null;
}

let ffprobeOk;
function ffprobe(file) {
  if (ffprobeOk === undefined) ffprobeOk = !process.env.STICKER_CHECK_NO_FFPROBE && spawnSync("ffprobe", ["-version"], { encoding: "utf8" }).status === 0;
  if (!ffprobeOk) return { missing: true };
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate,pix_fmt:stream_tags=alpha_mode:format=duration", "-of", "json", file], { encoding: "utf8" });
  if (r.status !== 0) return { error: (r.stderr || "").trim().split("\n")[0] || "ffprobe could not read it" };
  try { return { data: JSON.parse(r.stdout) }; } catch { return { error: "ffprobe returned no JSON" }; }
}

function checkPack(dir, opt, add, shown) {
  const rel = (p) => shown(join(dir, p));
  let stickers = null;
  const manifestPath = join(dir, "pack.json");
  if (existsSync(manifestPath)) {
    const m = checkManifest(shown(manifestPath), readFileSync(manifestPath, "utf8"), add);
    if (m && Array.isArray(m.stickers)) stickers = m.stickers.filter((s) => s && s.name).map((s) => ({ name: s.name, animated: s.animated !== false }));
    opt.files.push(shown(manifestPath));
  } else if (existsSync(join(dir, "svg"))) {
    stickers = readdirSync(join(dir, "svg")).filter((f) => f.endsWith(".svg")).map((f) => ({ name: f.slice(0, -4), animated: true }));
    opt.notChecked.push(`${shown(dir)}: no pack.json, so every sticker in svg/ was held to the animated outputs`);
  }
  if (!stickers || !stickers.length) { opt.inconclusive.push(`${shown(dir)}: no pack.json and no svg/ folder, so there is no list of stickers to check`); return; }
  const size = (p) => statSync(join(dir, p)).size;
  const need = (p) => { if (existsSync(join(dir, p))) { opt.files.push(rel(p)); return true; } add("missing-output", `the pack has no ${p.replace(/\\/g, "/")}`, rel(p), 0); return false; };

  const tray = join("whatsapp", "tray.png");
  if (need(tray)) {
    const i = pngInfo(readFileSync(join(dir, tray)));
    if (!i) add("unreadable-output", "not a PNG", rel(tray), 0);
    else if (i.width !== PACK.tray || i.height !== PACK.tray) add("tray-size", `${i.width} by ${i.height}: the tray icon is ${PACK.tray} by ${PACK.tray}`, rel(tray), 0);
  }
  for (const s of stickers) {
    for (const [kind, path] of Object.entries(OUTPUTS)) {
      if (!s.animated && MOVING_OUTPUTS.includes(kind)) continue;
      const p = path(s.name);
      if (!need(p)) continue;
      const buf = kind === "svg" || kind === "animated" || kind === "telegram" ? null : readFileSync(join(dir, p));
      if (kind === "png") {
        const i = pngInfo(buf);
        if (!i) { add("unreadable-output", "not a PNG", rel(p), 0); continue; }
        if (i.width !== PACK.png || i.height !== PACK.png) { add("png-size", `${i.width} by ${i.height}: a still is ${PACK.png} by ${PACK.png}`, rel(p), 0); continue; }
        if (i.type !== 6 && i.type !== 4) { add("opaque-ground", "the PNG has no alpha channel: render with a transparent ground", rel(p), 0); continue; }
        if (!i.alpha) { opt.notChecked.push(`${rel(p)}: pixels (the gate reads 8-bit, non-interlaced PNG only)`); continue; }
        if ([[0, 0], [PACK.png - 1, 0], [0, PACK.png - 1], [PACK.png - 1, PACK.png - 1]].some(([x, y]) => i.alpha(x, y) !== 0)) { add("opaque-ground", "a corner pixel is not transparent", rel(p), 0); continue; }
        let hit = null;
        for (let y = 0; y < PACK.png && !hit; y++) for (let x = 0; x < PACK.png; x++) {
          const inMargin = x < PACK.margin || y < PACK.margin || x >= PACK.png - PACK.margin || y >= PACK.png - PACK.margin;
          if (inMargin && i.alpha(x, y) !== 0) { hit = [x, y]; break; }
        }
        if (hit) add("png-margin", `a painted pixel at ${hit[0]}, ${hit[1]}: the art sits inside a ${PACK.margin} px margin`, rel(p), 0);
      } else if (kind === "whatsappStatic" || kind === "whatsappAnimated") {
        const limit = kind === "whatsappStatic" ? PACK.waStatic : PACK.waAnimated;
        if (buf.length >= limit) add("over-weight", `${buf.length} bytes: it must be under ${limit}`, rel(p), 0);
        const i = webpInfo(buf);
        if (!i) { add("unreadable-output", "not a WebP", rel(p), 0); continue; }
        if (i.width !== PACK.png || i.height !== PACK.png) add("webp-size", `${i.width} by ${i.height}: it is ${PACK.png} by ${PACK.png}`, rel(p), 0);
        const animated = i.animated && i.frames > 1;
        if (kind === "whatsappAnimated" && !animated) add("webp-not-animated", "one frame in whatsapp/animated", rel(p), 0);
        if (kind === "whatsappStatic" && animated) add("webp-not-animated", `${i.frames} frames in whatsapp/static`, rel(p), 0);
        if (kind === "whatsappAnimated" && animated && i.loop !== 0) add("webp-loop", `loop count ${i.loop}: 0 loops forever`, rel(p), 0);
      } else if (kind === "telegram") {
        const bytes = size(p);
        if (bytes >= PACK.tgWebm) add("over-weight", `${bytes} bytes: it must be under ${PACK.tgWebm}`, rel(p), 0);
        const r = ffprobe(join(dir, p));
        if (r.missing) { opt.inconclusive.push(`ffprobe not found (${rel(p)}): size, duration, codec and alpha were not read`); continue; }
        if (r.error) { add("unreadable-output", r.error.slice(0, 80), rel(p), 0); continue; }
        const streams = r.data.streams || [], v = streams.find((x) => x.codec_type === "video");
        if (!v) { add("unreadable-output", "no video stream", rel(p), 0); continue; }
        if (v.width !== PACK.png || v.height !== PACK.png) add("webm-size", `${v.width} by ${v.height}: it is ${PACK.png} by ${PACK.png}`, rel(p), 0);
        const dur = parseFloat(r.data.format?.duration ?? "NaN");
        if (Number.isNaN(dur)) opt.notChecked.push(`${rel(p)}: duration (the file does not state one)`);
        else if (dur > PACK.tgSeconds + 0.001) add("webm-duration", `${dur.toFixed(2)}s: at most ${PACK.tgSeconds}s`, rel(p), 0);
        if (v.codec_name !== "vp9") add("webm-codec", `${v.codec_name}: the codec is VP9`, rel(p), 0);
        if (!(v.tags && String(v.tags.alpha_mode) === "1") && !/^yuva|rgba|bgra|argb/.test(v.pix_fmt || "")) add("webm-no-alpha", `pix_fmt ${v.pix_fmt} and no alpha_mode tag: encode from frames with alpha as yuva420p`, rel(p), 0);
        if (streams.some((x) => x.codec_type === "audio")) add("webm-audio", "strip the audio stream", rel(p), 0);
        const [n, d] = String(v.r_frame_rate || "0/1").split("/").map(Number);
        if (d && Math.abs(n / d - PACK.fps) > 0.01) add("webm-fps", `${(n / d).toFixed(2)} fps: the pack renders at ${PACK.fps}`, rel(p), 0);
      }
    }
  }
}

// ---------------------------------------------------------------- a set: the stickers that share a folder
function checkSets(stats, add) {
  const sets = new Map();
  for (const s of stats) { const d = s.file.includes("/") ? s.file.slice(0, s.file.lastIndexOf("/")) : "."; if (!sets.has(d)) sets.set(d, []); sets.get(d).push(s); }
  for (const [dir, set] of sets) {
    if (set.length < 2) continue;
    const where = dir === "." ? set[0].file : dir;
    const tally = (pick) => { const m = new Map(); for (const s of set) { const v = pick(s); if (v === undefined) continue; if (!m.has(v)) m.set(v, []); m.get(v).push(s.file.slice(s.file.lastIndexOf("/") + 1)); } return m; };
    const say = (m) => [...m].map(([v, files]) => `${v} in ${files.length > 2 ? files.length + " files" : files.join(" and ")}`).join(", ");
    const outline = tally((s) => s.outline);
    if (outline.size > 1) add("set-outline", `the set has ${outline.size} outline weights: ${say(outline)}`, where, 0);
    const joins = tally((s) => s.joins);
    if (joins.size > 1) add("set-joins", `the set has ${joins.size} join styles: ${say(joins)}`, where, 0);
    const byRole = new Map();
    for (const s of set) for (const [role, vals] of s.roles || []) { if (!byRole.has(role)) byRole.set(role, new Set()); for (const v of vals) byRole.get(role).add(v); }
    for (const [role, vals] of byRole) if (vals.size > 1) add(role === "ink" ? "set-ink" : "set-palette", `--${role} is ${[...vals].join(" and ")} across the set: one role, one colour`, where, 0);
    const shares = set.filter((s) => s.share !== undefined).map((s) => Math.round(s.share * 100));
    if (shares.length > 1 && Math.max(...shares) - Math.min(...shares) > SET_BAND) add("set-occupancy", `subjects span ${Math.min(...shares)} to ${Math.max(...shares)}% of the canvas: one set sits inside one ${SET_BAND}-point band`, where, 0);
    const movers = set.filter((s) => s.moving);
    const lengths = new Set(movers.map((s) => s.length));
    if (lengths.size > 1) add("set-motion", `the moving stickers run ${[...lengths].join("s, ")}s: one set, one length`, where, 0);
    if (movers.some((s) => s.marks) && movers.some((s) => !s.marks)) add("set-marks", "some moving stickers carry impact marks and some do not: one rule for the whole set", where, 0);
  }
}

// ---------------------------------------------------------------- running
function collect(paths) {
  const files = [];
  const walk = (p) => {
    const st = statSync(p);
    if (st.isDirectory()) { for (const f of readdirSync(p).sort()) if (f !== "node_modules" && !f.startsWith(".")) walk(join(p, f)); }
    else if ([".svg", ".json"].includes(extname(p).toLowerCase())) files.push(p);
  };
  for (const p of paths) walk(p);
  return files;
}

function run(paths, flags, cwd = process.cwd()) {
  const findings = [];
  const opt = { kind: flags.kind, allowGrey: flags.allowGrey, notChecked: [], inconclusive: [], files: [], stats: [] };
  const shown = (p) => relative(cwd, resolve(p)).replace(/\\/g, "/") || basename(p);
  const add = (line, detail, file, lineNumber) => {
    const cls = NEVER[line] ? "never" : "candidate";
    if (!findings.some((f) => f.line === line && f.file === file && f.lineNumber === lineNumber && f.detail === detail)) findings.push({ line, file, lineNumber, detail, class: cls });
  };
  const missing = paths.filter((p) => !existsSync(p));
  for (const p of missing) opt.inconclusive.push(`${shown(p)}: no such file or folder`);
  for (const f of collect(paths.filter((p) => existsSync(p)))) {
    const text = readFileSync(f, "utf8").replace(/\r\n/g, "\n");
    if (f.toLowerCase().endsWith(".json")) {
      if (!/"stickers"\s*:/.test(text)) continue;
      checkManifest(shown(f), text, add);
    } else checkSticker(shown(f), text, opt, add);
    opt.files.push(shown(f));
  }
  checkSets(opt.stats, add);
  if (flags.pack) {
    if (!existsSync(flags.pack)) opt.inconclusive.push(`${shown(flags.pack)}: no such pack folder`);
    else checkPack(flags.pack, opt, add, shown);
  }
  const files = [...new Set(opt.files)];
  const never = findings.filter((f) => f.class === "never").length;
  const candidates = findings.length - never;
  let status = "passed", exitCode = 0;
  if (!files.length) { status = "inconclusive"; exitCode = 2; if (!opt.inconclusive.length) opt.inconclusive.push("nothing to check: no .svg sticker and no pack manifest in the paths given"); }
  if (opt.inconclusive.length) { status = "inconclusive"; exitCode = 2; }
  if (never || (flags.strict && candidates)) { status = "failed"; exitCode = 1; }
  return { status, exitCode, files, findings, notChecked: [...opt.notChecked, ...opt.inconclusive.map((s) => `inconclusive: ${s}`)], never, candidates, inconclusive: opt.inconclusive };
}

function print(result, flags) {
  const order = (f) => (f.class === "never" ? 0 : 1);
  for (const f of [...result.findings].sort((p, q) => order(p) - order(q) || p.file.localeCompare(q.file) || p.lineNumber - q.lineNumber)) {
    console.log(`${f.line}: ${f.detail} (${f.file}${f.lineNumber ? ":" + f.lineNumber : ""})`);
  }
  for (const n of result.notChecked) console.log(n.startsWith("inconclusive:") ? n : `not checked: ${n}`);
  console.log(`${result.files.length} file(s) checked. never intentional: ${result.never}. candidates: ${result.candidates}.`);
  console.log(NOTE);
  if (!flags.gate) return 0;
  if (result.status === "passed") console.log(`${GATE} passed`);
  else if (result.status === "failed") console.log(`${GATE} failed: ${result.never} never-intentional line(s)${flags.strict ? `, ${result.candidates} candidate(s) under --strict` : ""}`);
  else console.log(`${GATE} inconclusive`);
  return result.exitCode;
}

// ---------------------------------------------------------------- self-test
function selfTest() {
  const here = dirname(fileURLToPath(import.meta.url));
  const skill = resolve(here, "..");
  let ok = 0, fail = 0;
  const say = (pass, what) => { console.log(`${pass ? "ok  " : "FAIL"} ${what}`); pass ? ok++ : fail++; };
  const lines = (r, cls) => [...new Set(r.findings.filter((f) => !cls || f.class === cls).map((f) => f.line))];

  const examples = join(skill, "examples");
  const gold = existsSync(examples) ? readdirSync(examples).filter((f) => /\.(svg|json)$/.test(f)).sort() : [];
  say(gold.length > 0, `examples/ holds ${gold.length} gold file(s)`);
  for (const f of gold) {
    const r = run([join(examples, f)], {}, skill);
    say(r.never === 0 && r.files.length === 1, `examples/${f} raises no never-intentional line${r.never ? " (raised " + lines(r, "never").join(", ") + ")" : ""}`);
    say(r.candidates === 0, `examples/${f} raises no candidate${r.candidates ? " (raised " + lines(r, "candidate").join(", ") + ")" : ""}`);
  }
  if (gold.length) {
    const r = run([examples], {}, skill);
    say(r.never === 0 && r.candidates === 0, `examples/ passes as one set${r.findings.length ? " (raised " + lines(r).join(", ") + ")" : ""}`);
  }
  const teaching = join(skill, "teaching");
  const pairs = existsSync(teaching) ? readdirSync(teaching).filter((d) => statSync(join(teaching, d)).isDirectory()).sort() : [];
  say(pairs.length >= 8, `teaching/ holds ${pairs.length} pair(s)`);
  for (const d of pairs) {
    const files = readdirSync(join(teaching, d));
    const bad = files.find((f) => /^bad(\.|$)/.test(f)), good = files.find((f) => /^good(\.|$)/.test(f));
    if (!bad || !good) { say(false, `teaching/${d} has a bad and a good half`); continue; }
    const rb = run([join(teaching, d, bad)], {}, skill), rg = run([join(teaching, d, good)], {}, skill);
    say(lines(rb).includes(d), `teaching/${d}/${bad} raises ${d}:`);
    say(lines(rb, "never").filter((l) => l !== d).length === 0, `teaching/${d}/${bad} raises no other never-intentional line${lines(rb, "never").filter((l) => l !== d).length ? " (raised " + lines(rb, "never").join(", ") + ")" : ""}`);
    say(!lines(rg).includes(d) && rg.never === 0, `teaching/${d}/${good} does not${rg.never ? " (raised " + lines(rg, "never").join(", ") + ")" : ""}`);
  }

  // inline fixtures for the lines no pair is named for
  const tmp = mkdtempSync(join(tmpdir(), "sticker-check-"));
  try {
    const head = (kind, extra = "", id = "fx") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" id="${id}" data-kind="${kind}"${extra} role="img" aria-labelledby="${id}-t" stroke="var(--ink, #1c1f33)" stroke-width="5"><title id="${id}-t">Fixture</title>`;
    const cut = `<g data-layer="diecut"><path d="M90 90 L410 90 L410 410 L90 410 Z" fill="var(--white, #ffffff)" stroke="none"/></g>`;
    const sq = `<g data-part="tile"><path d="M110 110 L390 110 L390 390 L110 390 Z" fill="var(--main, #4f7cf7)"/></g>`;
    const motion = (css, body = sq) => `${head("flat")}<style>${css} @media (prefers-reduced-motion: reduce) { #fx [data-part] { animation: none; } }</style>${body}</svg>`;
    const still = "0% { transform: scale(1); } 20% { transform: scale(1.1); } 40% { transform: scale(1); } 100% { transform: scale(1); }";
    const fixtures = {
      "kind-undeclared": `${head("flat").replace(' data-kind="flat"', "")}${cut}${sq}</svg>`,
      "wrong-canvas": `${head("flat").replace("0 0 500 500", "0 0 512 512")}${cut}${sq}</svg>`,
      "off-canvas": `${head("flat")}${cut}<g data-part="tile"><path d="M0 110 L390 110 L390 390 L0 390 Z" fill="var(--main, #4f7cf7)"/></g></svg>`,
      "no-accessible-name": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" id="fx" data-kind="flat" stroke="var(--ink, #1c1f33)" stroke-width="5">${cut}${sq}</svg>`,
      "unnamed-group": `${head("flat")}${cut}<g><path d="M110 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"/></g></svg>`,
      "leaky-style": motion(`[data-part] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s infinite; } @keyframes fx-a { ${still} }`),
      "outline-weight": `${head("flat").replace('stroke-width="5"', 'stroke-width="8"')}${cut}${sq}</svg>`,
      "no-reduced-motion": `${head("flat")}<style>#fx [data-part] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s infinite; } @keyframes fx-a { ${still} }</style>${sq}</svg>`,
      "outline-ink": `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)" stroke="var(--deep, #27357e)"/></g></svg>`,
      "lost-at-160": `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"/><path d="M150 200 L300 200" fill="none" stroke-width="2"/></g></svg>`,
      "external-asset": `${head("flat")}${cut}${sq}<image href="logo.png" x="200" y="200" width="100" height="100"/></svg>`,
      "fixed-diecut": `${head("flat")}<style>#fx [data-part] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s infinite; } @keyframes fx-a { ${still} } @media (prefers-reduced-motion: reduce) { #fx [data-part] { animation: none; } }</style>${cut}${sq}</svg>`,
      "corner-origin": motion(`#fx [data-part] { animation: fx-a 2.5s infinite; } @keyframes fx-a { ${still} }`),
      "smil-motion": `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"><animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite"/></path></g></svg>`,
      "flat-part": `${head("isometric")}${cut}${["a", "b", "c"].map((n, i) => `<g data-part="${n}"><path d="M${120 + i * 20} 120 L380 120 L380 380 Z" fill="var(--main, #4f7cf7)"/></g>`).join("")}</svg>`,
      "no-frame": `${head("badge")}${cut}${sq}</svg>`,
      "still-reaction": `${head("reaction")}${cut}${sq}</svg>`,
      "mixed-outline": `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"/><path d="M150 200 L300 200" fill="none" stroke-width="4"/></g></svg>`,
      "accent-budget": `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"/><path d="M150 150 L200 150 L200 200 Z" fill="var(--gold, #ffc533)"/><path d="M250 250 L300 250 L300 300 Z" fill="var(--hot, #f2545b)"/></g></svg>`,
      "unknown-role": `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--brand-blue, #4f7cf7)"/></g></svg>`,
      "fallback-drift": `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"/><path d="M150 150 L200 150 L200 200 Z" fill="var(--main, #3355ff)"/></g></svg>`,
      "shape-budget": `${head("flat")}${cut}<g data-part="tile">${Array.from({ length: 16 }, (_, i) => `<path d="M${100 + i * 10} 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"/>`).join("")}</g></svg>`,
      "decoration": `${head("flat")}${cut}${sq}<g data-layer="sparkle"><path d="M400 100 L410 120 L390 120 Z" fill="var(--white, #ffffff)"/></g></svg>`,
      "long-decimal": `${head("flat")}${cut}<g data-part="tile"><path d="M110.12345 110 L390 110 L390 390 Z" fill="var(--main, #4f7cf7)"/></g></svg>`,
      "loop-length": motion(`#fx [data-part] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 6s infinite; } @keyframes fx-a { ${still} }`),
      "mixed-loop": motion(`#fx [data-part="tile"] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s infinite; } #fx [data-part="dot"] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2s infinite; } @keyframes fx-a { ${still} }`, `${sq}<g data-part="dot"><path d="M200 200 L260 200 L260 260 Z" fill="var(--white, #ffffff)"/></g>`),
      "short-hold": motion(`#fx [data-part] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s infinite; } @keyframes fx-a { 0% { transform: scale(1); } 45% { transform: scale(1.1); } 90% { transform: scale(1); } 100% { transform: scale(1); } }`),
      "lockstep": motion(`#fx [data-part="tile"] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s infinite; } #fx [data-part="dot"] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-b 2.5s infinite; } @keyframes fx-a { ${still} } @keyframes fx-b { ${still} }`, `${sq}<g data-part="dot"><path d="M200 200 L260 200 L260 260 Z" fill="var(--white, #ffffff)"/></g>`),
      "dead-rule": motion(`#fx [data-part="gone"] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s infinite; } @keyframes fx-a { ${still} }`),
      "repaint-property": motion(`#fx [data-part] { animation: fx-a 2.5s infinite; } @keyframes fx-a { 0% { stroke-width: 5; } 20% { stroke-width: 4; } 40% { stroke-width: 5; } 100% { stroke-width: 5; } }`),
      "occupancy": `${head("flat")}${cut}<g data-part="tile"><path d="M200 200 L300 200 L300 300 L200 300 Z" fill="var(--main, #4f7cf7)"/></g></svg>`,
      "off-centre": `${head("flat")}${cut}<g data-part="tile"><path d="M60 110 L340 110 L340 390 L60 390 Z" fill="var(--main, #4f7cf7)"/></g></svg>`,
      "unrested-end": motion(`#fx [data-part] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a 2.5s 1 both; } @keyframes fx-a { 0% { transform: scale(0.2); } 100% { transform: scale(1.1); } }`),
      "over-budget": `${head("flat")}${cut}${sq}<desc>${"x".repeat(30_000)}</desc></svg>`,
      "uneven-inset": `${head("badge")}${cut}<g data-part="frame"><path d="M110 110 L390 110 L390 390 L110 390 Z" fill="var(--main, #4f7cf7)"/></g><g data-part="mark"><path d="M150 200 L300 200 L300 300 L150 300 Z" fill="var(--white, #ffffff)"/></g></svg>`,
    };
    const tested = new Set(pairs);
    for (const [line, svg] of Object.entries(fixtures)) {
      const f = join(tmp, `${line}.svg`);
      writeFileSync(f, svg);
      say(lines(run([f], {}, tmp)).includes(line), `an inline fixture raises ${line}:`);
      tested.add(line);
    }
    // a set is the files of one folder
    const tile = (over = {}) => {
      const o = { width: "5", ink: "#1c1f33", join: "round", main: "#4f7cf7", d: "M110 110 L390 110 L390 390 L110 390 Z", style: "", ...over };
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" id="fx" data-kind="flat" role="img" aria-label="Fixture" stroke="var(--ink, ${o.ink})" stroke-width="${o.width}" stroke-linejoin="${o.join}">${o.style}${o.style ? "" : cut}<g data-part="tile"><path d="${o.d}" fill="var(--main, ${o.main})"/></g>${o.marks ? '<g data-layer="burst"><path d="M420 60 L440 60 L440 80 Z" fill="var(--white, #ffffff)"/></g>' : ""}</svg>`;
    };
    const loop = (sec) => `<style>#fx [data-part] { transform-box: fill-box; transform-origin: 50% 50%; animation: fx-a ${sec}s infinite; } @keyframes fx-a { ${still} } @media (prefers-reduced-motion: reduce) { #fx [data-part] { animation: none; } }</style>`;
    const sets = {
      "set-ink": [tile(), tile({ ink: "#000000" })],
      "set-joins": [tile(), tile({ join: "miter" })],
      "set-palette": [tile(), tile({ main: "#3355ff" })],
      "set-occupancy": [tile({ d: "M120 120 L380 120 L380 380 L120 380 Z" }), tile({ d: "M90 90 L410 90 L410 410 L90 410 Z" })],
      "set-motion": [tile({ style: loop(2.5) }), tile({ style: loop(3) })],
      "set-marks": [tile({ style: loop(2.5) }), tile({ style: loop(2.5), marks: true })],
    };
    for (const [line, files] of Object.entries(sets)) {
      const dir = join(tmp, line);
      mkdirSync(dir);
      files.forEach((svg, i) => writeFileSync(join(dir, `${"ab"[i]}.svg`), svg));
      const r = run([dir], {}, tmp);
      say(lines(r).includes(line) && lines(r).filter((l) => l.startsWith("set-")).length === 1, `a two-file set fixture raises ${line}: and no other set line`);
      tested.add(line);
    }
    const same = join(tmp, "set-same");
    mkdirSync(same);
    writeFileSync(join(same, "a.svg"), tile()); writeFileSync(join(same, "b.svg"), tile());
    say(run([same], {}, tmp).findings.length === 0, "a set of two matching files raises nothing");
    const plain = join(tmp, "plain.svg");
    writeFileSync(plain, `${head("flat")}${cut}${sq}</svg>`);
    say(run([plain], {}, tmp).findings.length === 0, "the plain inline fixture raises nothing");
    const greyAllowed = join(tmp, "grey.svg");
    writeFileSync(greyAllowed, `${head("flat")}${cut}<g data-part="tile"><path d="M110 110 L390 110 L390 390 Z" fill="var(--paper, #999999)"/></g></svg>`);
    say(lines(run([greyAllowed], {}, tmp)).includes("grey-fill") && !lines(run([greyAllowed], { allowGrey: true }, tmp)).includes("grey-fill"), "--allow-grey quiets grey-fill: and nothing else");
    say(run([join(tmp, "nothing-here")], {}, tmp).exitCode === 2 && run([], {}, tmp).exitCode === 2, "an empty or missing input is inconclusive, exit 2");

    // a pack built from headers: the gate reads sizes, never pixels of WebP
    const png = (w, h, paint) => {
      const row = Buffer.alloc(1 + w * 4), rows = [];
      for (let y = 0; y < h; y++) { const r = Buffer.from(row); if (paint) for (let x = 0; x < w; x++) if (paint(x, y)) r[1 + x * 4 + 3] = 255; rows.push(r); }
      const chunk = (tag, data) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(tag, 4, "latin1"); data.copy(b, 8); return b; };
      const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
      return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(Buffer.concat(rows))), chunk("IEND", Buffer.alloc(0))]);
    };
    const webp = (w, h, frames, pad = 0, loop = 0) => {
      const chunk = (tag, data) => { const b = Buffer.alloc(8 + data.length + (data.length & 1)); b.write(tag, 0, "latin1"); b.writeUInt32LE(data.length, 4); data.copy(b, 8); return b; };
      const x = Buffer.alloc(10); x[0] = frames > 1 ? 0x12 : 0x10; x.writeUIntLE(w - 1, 4, 3); x.writeUIntLE(h - 1, 7, 3);
      const parts = [chunk("VP8X", x)];
      if (frames > 1) {
        const anim = Buffer.alloc(6); anim.writeUInt16LE(loop, 4); parts.push(chunk("ANIM", anim));
        for (let i = 0; i < frames; i++) { const f = Buffer.alloc(16); f.writeUIntLE(33, 12, 3); parts.push(chunk("ANMF", f)); }
      }
      if (pad) parts.push(chunk("EXIF", Buffer.alloc(pad)));
      const body = Buffer.concat([Buffer.from("WEBP", "latin1"), ...parts]);
      const headBuf = Buffer.alloc(8); headBuf.write("RIFF", 0, "latin1"); headBuf.writeUInt32LE(body.length, 4);
      return Buffer.concat([headBuf, body]);
    };
    const manifest = (stickers) => JSON.stringify({
      name: "fixture", canvas: 500, stickers,
      outputs: {
        svg: { path: "svg/<name>.svg" }, animated: { path: "animated/<name>.svg" },
        png: { path: "png/<name>.png", size: 512, margin: 16 },
        whatsappStatic: { path: "whatsapp/static/<name>.webp", size: 512, underBytes: 100000 },
        whatsappAnimated: { path: "whatsapp/animated/<name>.webp", size: 512, underBytes: 500000 },
        tray: { path: "whatsapp/tray.png", size: 96 },
        telegram: { path: "telegram/<name>.webm", size: 512, underBytes: 256000, maxSeconds: 3, fps: 30 },
      },
    }, null, 2);
    const build = (name, files, stickers) => {
      const dir = join(tmp, name);
      for (const [p, data] of Object.entries(files)) { mkdirSync(dirname(join(dir, p)), { recursive: true }); writeFileSync(join(dir, p), data); }
      writeFileSync(join(dir, "pack.json"), manifest(stickers));
      return dir;
    };
    const one = [{ name: "tile", kind: "flat", title: "Tile", animated: false }];
    const art = (x, y) => x >= 100 && x < 400 && y >= 100 && y < 400;
    const goodPack = { "svg/tile.svg": "<svg/>", "png/tile.png": png(512, 512, art), "whatsapp/static/tile.webp": webp(512, 512, 1), "whatsapp/tray.png": png(96, 96) };
    const rGood = run([], { pack: build("pack-good", goodPack, one) }, tmp);
    say(rGood.findings.length === 0 && rGood.status === "passed", `a still-only pack with correct headers passes${rGood.findings.length ? " (raised " + lines(rGood).join(", ") + ")" : ""}`);
    const badPacks = {
      "png-size": { ...goodPack, "png/tile.png": png(500, 500, art) },
      "png-margin": { ...goodPack, "png/tile.png": png(512, 512, (x, y) => x >= 8 && x < 400 && y >= 100 && y < 400) },
      "opaque-ground": { ...goodPack, "png/tile.png": png(512, 512, () => true) },
      "tray-size": { ...goodPack, "whatsapp/tray.png": png(128, 128) },
      "webp-size": { ...goodPack, "whatsapp/static/tile.webp": webp(480, 480, 1) },
      "webp-not-animated": { ...goodPack, "whatsapp/static/tile.webp": webp(512, 512, 12) },
      "over-weight": { ...goodPack, "whatsapp/static/tile.webp": webp(512, 512, 1, 100_000) },
      "unreadable-output": { ...goodPack, "whatsapp/static/tile.webp": Buffer.from("not a webp, just some bytes in a file") },
    };
    for (const [line, files] of Object.entries(badPacks)) { say(lines(run([], { pack: build(`pack-${line}`, files, one) }, tmp)).includes(line), `a pack fixture raises ${line}:`); tested.add(line); }
    for (const l of ["missing-output", "webp-loop"]) tested.add(l);
    // the video lines need a real VP9 file and ffprobe: they are proven by hand against a built pack
    const byHand = ["webm-size", "webm-duration", "webm-codec", "webm-no-alpha", "webm-audio", "webm-fps"];
    const untested = [...Object.keys(NEVER), ...Object.keys(CANDIDATE)].filter((l) => !tested.has(l) && !byHand.includes(l));
    say(untested.length === 0, `every line but the ${byHand.length} video lines has a pair or a fixture${untested.length ? " (missing: " + untested.join(", ") + ")" : ""}`);
    const missing = { ...goodPack }; delete missing["whatsapp/tray.png"];
    say(lines(run([], { pack: build("pack-missing", missing, one) }, tmp)).includes("missing-output"), "a pack fixture raises missing-output:");
    const mover = [{ name: "tile", kind: "flat", title: "Tile", animated: true, verb: "pop" }];
    const movingPack = { ...goodPack, "animated/tile.svg": "<svg/>", "whatsapp/animated/tile.webp": webp(512, 512, 75, 0, 3), "telegram/tile.webm": Buffer.from("not a video") };
    process.env.STICKER_CHECK_NO_FFPROBE = "1"; ffprobeOk = undefined;
    const rNo = run([], { pack: build("pack-noprobe", movingPack, mover) }, tmp);
    say(rNo.exitCode === 2 && rNo.inconclusive.some((s) => s.startsWith("ffprobe not found")), "without ffprobe a .webm is inconclusive, exit 2, never a pass");
    say(lines(rNo).includes("webp-loop"), "a pack fixture raises webp-loop:");
    delete process.env.STICKER_CHECK_NO_FFPROBE; ffprobeOk = undefined;
    const rOver = run([], { pack: build("pack-big-webm", { ...movingPack, "telegram/tile.webm": Buffer.alloc(256_000) }, mover) }, tmp);
    say(lines(rOver).includes("over-weight"), "a pack fixture raises over-weight: for a .webm at 256000 bytes, with or without ffprobe");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  console.log(fail ? `self-test FAILED: ${fail} of ${ok + fail} assertions` : `self-test passed: ${ok} assertions`);
  return fail ? 1 : 0;
}

// ---------------------------------------------------------------- main
function main() {
  const argv = process.argv.slice(2);
  const flags = {}, paths = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--gate") flags.gate = true;
    else if (a === "--strict") flags.strict = true;
    else if (a === "--allow-grey") flags.allowGrey = true;
    else if (a === "--self-test") flags.selfTest = true;
    else if (a === "--help" || a === "-h") flags.help = true;
    else if (a === "--kind") flags.kind = argv[++i];
    else if (a === "--pack") flags.pack = argv[++i];
    else if (a === "--report") flags.report = argv[++i];
    else if (a.startsWith("--")) { console.error(`unknown option ${a}\n`); flags.help = true; flags.bad = true; }
    else paths.push(a);
  }
  if (flags.help) { console.log(HELP); process.exit(flags.bad ? 2 : 0); }
  if (flags.selfTest) process.exit(selfTest());
  const result = run(paths, flags);
  const code = print(result, flags);
  if (flags.report) {
    const { status, exitCode, files, findings, notChecked } = result;
    writeFileSync(flags.report, JSON.stringify({ status, exitCode: flags.gate ? exitCode : 0, files, findings, notChecked: [...notChecked, ...NOT_CHECKED] }, null, 2) + "\n");
  }
  process.exit(code);
}

main();
