#!/usr/bin/env node
// svg-check.mjs: the gate for khe-svg. Reads SVG as text and names every fault as a line.
//
//   node scripts/svg-check.mjs <files or folders...> [--gate] [--strict] [--home img|inline]
//                                                    [--report out.json] [--self-test] [--help]
//
// Reads .svg files, and every <svg> inlined in .html, .htm, .jsx and .tsx files.
// Each finding prints as `<line-name>: <what and where> (<file>:<line>)`.
// Two classes of line: never intentional (the gate fails on any) and candidates (yours to judge).
// The rules behind each line are in references/verify.md. No dependencies; Node 20+.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GATE = "svg check";
const NOTE = "passing is necessary, not sufficient";

const NEVER = {
  "missing-viewbox": "the root <svg> or a <symbol> has no viewBox",
  "fixed-size": "a fixed width or height on the root <svg>",
  "missing-xmlns": "a standalone .svg with no xmlns, which an <img> will not render",
  "hardcoded-color": "a colour that is not currentColor or var(--token, fallback)",
  "var-no-fallback": "var(--token) with no fallback and no definition in the file",
  "editor-leftover": "sodipodi, inkscape or sketch markup, data-name, <metadata>, a generator comment",
  "empty-group": "a <g> with nothing in it",
  "unnamed-group": "a <g> with no id, class or data-layer",
  "duplicate-id": "the same id twice in one file",
  "no-accessible-name": "the root neither names itself nor hides itself",
  "embedded-raster": "a raster image inside the SVG",
  "leaky-style": "a rule in the file's <style> that does not start at the root id",
  "no-reduced-motion": "CSS motion with no prefers-reduced-motion query in the file",
  "smil-no-still": "SMIL with no static fallback asset",
  "wrong-engine": "an engine the file's home cannot run",
  "corner-origin": "a rotation or scale left on the default origin",
  "morph-mismatch": "two d strings of one morph with different commands",
  "spline-out-of-range": "a SMIL keySplines value outside 0 to 1",
  "ease-in": "ease-in on a transition or animation",
};

const CANDIDATE = {
  "home-undeclared": "a moving .svg that does not say where it renders, so the engine was not checked",
  "over-budget": "the file is larger than the budget for its kind",
  "long-decimal": "coordinates with more than 2 decimals",
  "mixed-stroke": "more than one stroke-width in one file",
  "translucent-ink": "a see-through layer inside an icon",
  "repaint-property": "motion on a property that repaints every frame",
  "scale-from-zero": "a scale that starts or ends at 0",
  "morph-not-normalised": "a morph path with relative or shorthand commands",
  "morph-winding": "two closed morph paths wound in opposite directions",
  "duplicate-def": "the same gradient defined more than once",
  "loose-title": "a <title> the root does not point at",
};

const NOT_CHECKED = [
  "whether the optimized file renders identically to its source (diff the render)",
  "whether the motion should exist at all, and whether its trigger is the right one",
  "feel: easing against duration, stagger, the hold, whether a draw-on reads in order",
  "whether a dependent mark appears on the frame the stroke reaches it (film it and step 40 to 80ms)",
  "whether the still under reduced motion is a whole frame, and the right one",
  "start point and point-to-point travel of a morph, and any morph driven from script",
  "whether the target browsers run the engine the file uses (CSS d, SMIL)",
  "whether the icon matches its set: optical size, stroke against font weight, one pack",
  "stickers: their drawing, motion and pack rules are checked by khe-sticker and its own gate",
  "contrast, the accessible name's wording, and whether a hidden graphic was decoration",
];

const HELP = `${GATE}: the gate for khe-svg

usage: node scripts/svg-check.mjs <files or folders...> [options]

  --gate            end with "${GATE} passed" and exit 0 only when every never-intentional line is at 0;
                    otherwise print the counts and exit 1
  --strict          candidates fail the gate too
  --home <where>    where the files render, when the root has no data-home: img or inline
  --report <file>   write the findings as JSON
  --self-test       prove the gate on this skill's examples/ and teaching/ pairs
  --help            this text

Reads .svg, and <svg> inlined in .html, .htm, .jsx, .tsx. A finding prints as
  <line-name>: <what and where> (<file>:<line>)

Conventions the gate reads on the root <svg>:
  data-home="img"     loaded as an <img>, a background, in email or on a social upload
  data-home="inline"  inlined in a page (an <svg> inside .html, .jsx or .tsx is inline already)
  data-still="x.svg"  the static fallback of a SMIL file; a sibling <name>-still.svg|png|webp also counts

Never intentional (the gate fails on any):
${Object.entries(NEVER).map(([k, v]) => `  ${(k + ":").padEnd(22)}${v}`).join("\n")}

Candidates (reported for judgment):
${Object.entries(CANDIDATE).map(([k, v]) => `  ${(k + ":").padEnd(22)}${v}`).join("\n")}

Not checked by the gate (answer these from the rendered file):
${NOT_CHECKED.map((s) => `  - ${s}`).join("\n")}

Exit codes: 0 passed or report only, 1 failed, 2 inconclusive (nothing to check).
${NOTE}`;

// ---------------------------------------------------------------- small helpers
const SMIL = new Set(["animate", "animateTransform", "animateMotion", "set"]);
const COLOR_ATTRS = new Set(["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"]);
const SAFE_PAINT = /^(none|currentcolor|inherit|transparent|context-fill|context-stroke|initial|unset)$/i;
const NAMED = new Set(("black white red green blue yellow orange purple pink gray grey silver gold navy teal maroon olive lime aqua " +
  "cyan magenta fuchsia brown beige ivory indigo violet coral salmon khaki crimson tomato orchid plum tan turquoise lavender " +
  "dimgray dimgrey darkgray darkgrey lightgray lightgrey slategray slategrey gainsboro whitesmoke snow rebeccapurple " +
  "royalblue steelblue skyblue dodgerblue firebrick darkred darkblue darkgreen forestgreen seagreen hotpink deeppink").split(" "));
const JSX_NAMES = {
  className: "class", strokeWidth: "stroke-width", strokeLinecap: "stroke-linecap", strokeLinejoin: "stroke-linejoin",
  strokeDasharray: "stroke-dasharray", strokeDashoffset: "stroke-dashoffset", strokeOpacity: "stroke-opacity",
  fillOpacity: "fill-opacity", fillRule: "fill-rule", clipRule: "clip-rule", stopColor: "stop-color",
  stopOpacity: "stop-opacity", floodColor: "flood-color", xlinkHref: "xlink:href", vectorEffect: "vector-effect",
};
const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

const isHardColor = (value) => {
  const v = String(value).trim();
  if (!v || SAFE_PAINT.test(v) || /var\(/.test(v) || /^url\(/i.test(v)) return false;
  if (/^#[0-9a-f]{3,8}$/i.test(v)) return true;
  if (/^(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i.test(v)) return true;
  return NAMED.has(v.toLowerCase());
};

// "M4 4 L20 4 20 20 Z" -> ["M","L","L","Z"], case kept, implicit repeats expanded.
const commandsOf = (d) => {
  const out = [];
  for (const m of String(d).matchAll(/([MLHVCSQTAZ])([^MLHVCSQTAZ]*)/gi)) {
    const letter = m[1];
    const arity = ARITY[letter.toUpperCase()];
    const count = (m[2].match(/-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) || []).length;
    const times = arity === 0 ? 1 : Math.max(1, Math.round(count / arity));
    for (let i = 0; i < times; i++) {
      // After the first pair, M continues as L and m as l.
      out.push(i > 0 && letter === "M" ? "L" : i > 0 && letter === "m" ? "l" : letter);
    }
  }
  return out;
};

// Sign of the area a closed absolute M/L/C path encloses, from its on-curve points. 0 when it cannot say.
const windingOf = (d) => {
  if (!/z\s*$/i.test(String(d).trim()) || /[^MLCZ\s\d.,-]/.test(d)) return 0;
  const pts = [];
  for (const m of String(d).matchAll(/([MLC])([^MLCZ]*)/g)) {
    const n = (m[2].match(/-?(?:\d+\.?\d*|\.\d+)/g) || []).map(Number);
    const step = ARITY[m[1]];
    for (let i = 0; i + step <= n.length; i += step) pts.push([n[i + step - 2], n[i + step - 1]]);
  }
  if (pts.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    area += x1 * y2 - x2 * y1;
  }
  return Math.sign(area);
};

// ---------------------------------------------------------------- CSS
// Returns rules: { selector, decls: [{ prop, value, at }], at, media, keyframes, atRule }.
const parseCss = (css, base) => {
  const clean = css
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "))
    .replace(/<!\[CDATA\[|\]\]>/g, (c) => " ".repeat(c.length));
  const rules = [];
  const matchBrace = (open) => {
    let depth = 0;
    for (let i = open; i < clean.length; i++) {
      if (clean[i] === "{") depth++;
      else if (clean[i] === "}" && --depth === 0) return i;
    }
    return clean.length;
  };
  const decls = (from, to) => {
    const out = [];
    let start = from, paren = 0, quote = "";
    const push = (end) => {
      const raw = clean.slice(start, end);
      const colon = raw.indexOf(":");
      if (colon > 0) {
        const lead = raw.length - raw.trimStart().length;
        out.push({ prop: raw.slice(0, colon).trim().toLowerCase(), value: raw.slice(colon + 1).trim(), at: base + start + lead });
      }
      start = end + 1;
    };
    for (let i = from; i < to; i++) {
      const c = clean[i];
      if (quote) { if (c === quote) quote = ""; continue; }
      if (c === '"' || c === "'") quote = c;
      else if (c === "(") paren++;
      else if (c === ")") paren--;
      else if (c === ";" && paren <= 0) push(i);
    }
    push(to);
    return out;
  };
  const block = (from, to, ctx) => {
    let i = from;
    while (i < to) {
      const open = clean.indexOf("{", i);
      const semi = clean.indexOf(";", i);
      if (semi !== -1 && semi < to && (open === -1 || open >= to || semi < open)) {
        const stmt = clean.slice(i, semi).trim();
        if (stmt.startsWith("@")) rules.push({ selector: stmt, decls: [], at: base + clean.indexOf(stmt, i), atRule: true, ...ctx });
        i = semi + 1;
        continue;
      }
      if (open === -1 || open >= to) break;
      const prelude = clean.slice(i, open).trim();
      const at = base + i + (clean.slice(i, open).length - clean.slice(i, open).trimStart().length);
      const close = matchBrace(open);
      if (/^@(media|supports|layer|container)\b/i.test(prelude)) block(open + 1, close, { ...ctx, media: `${ctx.media || ""} ${prelude}`.trim() });
      else if (/^@(-webkit-)?keyframes\b/i.test(prelude)) block(open + 1, close, { ...ctx, keyframes: prelude.split(/\s+/)[1] || "" });
      else if (prelude.startsWith("@")) rules.push({ selector: prelude, decls: [], at, atRule: true, ...ctx });
      else rules.push({ selector: prelude, decls: decls(open + 1, close), at, ...ctx });
      i = close + 1;
    }
  };
  block(0, clean.length, {});
  return rules;
};

const splitSelectors = (selector) => {
  const out = [];
  let depth = 0, start = 0;
  for (let i = 0; i < selector.length; i++) {
    const c = selector[i];
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth--;
    else if (c === "," && depth === 0) { out.push(selector.slice(start, i).trim()); start = i + 1; }
  }
  out.push(selector.slice(start).trim());
  return out.filter(Boolean);
};

// ".a[data-x] > .shape:hover" -> ".shape": the thing the rule lands on, with its states stripped.
const subjectOf = (selector) => {
  const bare = selector.replace(/\[[^\]]*\]/g, "").replace(/::?[\w-]+(\([^)]*\))?/g, "");
  return bare.trim().split(/[\s>+~]+/).filter(Boolean).pop() || selector;
};

// ---------------------------------------------------------------- markup
const TAG = /<!--([\s\S]*?)-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<![A-Za-z][^>]*>|<(\/?)([A-Za-z][\w:.-]*)((?:"[^"]*"|'[^']*'|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}|[^>"'{])*)>/g;
const ATTR = /([A-Za-z_:@][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|(\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})))?/g;

const parseAttrs = (raw) => {
  const attrs = new Map();
  const spread = /\{\s*\.\.\./.test(raw);
  const body = raw.replace(/(^|\s)\{\s*\.\.\.(?:[^{}]|\{[^{}]*\})*\}/g, " ").replace(/\/\s*$/, "");
  for (const m of body.matchAll(ATTR)) {
    const name = JSX_NAMES[m[1]] || m[1];
    if (m[4] !== undefined) {
      const lit = /^\{\s*(?:(["'`])([^"'`$]*)\1|(-?[\d.]+)|(true|false))\s*\}$/.exec(m[4]);
      attrs.set(name, lit ? { value: lit[2] ?? lit[3] ?? lit[4], expr: false } : { value: m[4], expr: true });
    } else attrs.set(name, { value: m[2] ?? m[3] ?? "", expr: false, bare: m[2] === undefined && m[3] === undefined });
  }
  return { attrs, spread };
};

// Every <svg>...</svg> in the text, as [start, end) ranges. Nested <svg> stays inside its parent's range.
const regionsOf = (text) => {
  const out = [];
  const edge = /<svg\b|<\/svg\s*>/g;
  let depth = 0, start = -1, m;
  while ((m = edge.exec(text))) {
    if (m[0].startsWith("</")) {
      if (depth > 0 && --depth === 0) out.push([start, m.index + m[0].length]);
    } else if (depth++ === 0) start = m.index;
  }
  if (depth > 0 && start !== -1) out.push([start, text.length]);
  return out;
};

const parseRegion = (text, start, end) => {
  const els = [], stack = [];
  TAG.lastIndex = start;
  let m;
  while ((m = TAG.exec(text)) && m.index < end) {
    if (m[1] !== undefined) continue;
    if (!m[3]) continue;
    const name = m[3];
    if (m[2]) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === name) {
          stack[i].inner = text.slice(stack[i].openEnd, m.index);
          stack.length = i;
          break;
        }
      }
      continue;
    }
    const raw = m[4] || "";
    const { attrs, spread } = parseAttrs(raw);
    const el = { name, attrs, spread, at: m.index, parent: stack.at(-1) || null, kids: [], openEnd: TAG.lastIndex, inner: "", selfClosed: /\/\s*$/.test(raw) };
    if (el.parent) el.parent.kids.push(el);
    els.push(el);
    if (el.selfClosed) continue;
    if (name === "style" || name === "script" || name === "title" || name === "desc") {
      const close = text.indexOf(`</${name}`, TAG.lastIndex);
      el.inner = text.slice(TAG.lastIndex, close === -1 ? end : close);
      if (close !== -1) TAG.lastIndex = text.indexOf(">", close) + 1;
      continue;
    }
    stack.push(el);
  }
  return { els };
};

// ---------------------------------------------------------------- the checks
const HOMES = new Set(["img", "inline"]);

export const checkText = (file, source, opts = {}) => {
  const original = source.replace(/\r\n/g, "\n");
  // Comments are blanked in place, so markup quoted inside one is never read as markup and offsets still hold.
  const text = original.replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, " "));
  const fileComments = [...original.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => ({ text: m[1], at: m.index }));
  const ext = extname(file).toLowerCase();
  const isSvgFile = ext === ".svg";
  const findings = [];
  const notChecked = [];
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  const lineOf = (at) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (starts[mid] <= at) lo = mid; else hi = mid - 1; }
    return lo + 1;
  };
  const add = (line, at, detail) => findings.push({ line, file, lineNumber: lineOf(at), detail, class: line in NEVER ? "never" : "candidate" });
  const val = (el, name) => { const a = el.attrs.get(name); return a && !a.expr ? a.value : undefined; };

  const regions = regionsOf(text);
  if (!regions.length) {
    notChecked.push(`${file}: no <svg> found`);
    return { findings, notChecked, checked: false };
  }

  // Page CSS (outside any <svg>) only exists in .html files.
  const pageRules = [];
  if (!isSvgFile) {
    for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi)) {
      const at = m.index + m[0].indexOf(">") + 1;
      if (!regions.some(([s, e]) => at >= s && at < e)) pageRules.push(...parseCss(m[1], at));
    }
  }

  const parsed = regions.map(([s, e]) => ({ start: s, end: e, ...parseRegion(text, s, e) }));
  const allEls = parsed.flatMap((r) => r.els);
  const names = new Set();
  for (const el of allEls) {
    const id = val(el, "id");
    if (id) names.add(`#${id}`);
    for (const c of (val(el, "class") || "").split(/\s+/).filter(Boolean)) names.add(`.${c}`);
  }
  const reachesSvg = (selector) => {
    const tokens = selector.match(/[#.][\w-]+/g) || [];
    return tokens.some((t) => names.has(t)) || /(^|[\s>+~,(])(svg|path|g|circle|rect|line|polyline|polygon|ellipse|use)\b/.test(selector);
  };

  // ---- ids, once per file
  const seen = new Map();
  for (const el of allEls) {
    const id = val(el, "id");
    if (!id) continue;
    if (seen.has(id)) add("duplicate-id", el.at, `id="${id}" is also on line ${lineOf(seen.get(id))}; prefix the ids of each inlined SVG`);
    else seen.set(id, el.at);
  }

  let morphingRegions = 0;
  const definedVars = new Set();
  const regionCss = parsed.map((r) => r.els.filter((el) => el.name === "style").flatMap((el) => parseCss(el.inner, el.openEnd)));
  for (const rule of [...pageRules, ...regionCss.flat()]) for (const d of rule.decls) if (d.prop.startsWith("--")) definedVars.add(d.prop);

  parsed.forEach((region, index) => {
    const { els } = region;
    // An editor writes its comment above the root, so a standalone file is read from its first byte.
    const comments = fileComments.filter((c) => (isSvgFile && index === 0 ? c.at < region.end : c.at > region.start && c.at < region.end));
    const root = els[0];
    const innerRules = regionCss[index];
    const svgRules = [...innerRules, ...pageRules.filter((r) => !r.atRule && (r.keyframes !== undefined || reachesSvg(r.selector)))];
    const rootId = val(root, "id");
    const symbols = els.filter((el) => el.name === "symbol");
    const isSprite = symbols.length > 0 && root.kids.every((k) => ["symbol", "defs", "style", "title", "desc"].includes(k.name));
    const vb = (val(root, "viewBox") || "").trim().split(/[\s,]+/).map(Number);
    const hasVb = vb.length === 4 && vb.every(Number.isFinite);

    // ---- the root
    if (!root.attrs.has("viewBox") && !isSprite) add("missing-viewbox", root.at, "the root <svg> has no viewBox; add viewBox and size it from CSS");
    for (const s of symbols) if (!s.attrs.has("viewBox")) add("missing-viewbox", s.at, `<symbol${val(s, "id") ? ` id="${val(s, "id")}"` : ""}> has no viewBox`);
    if (!isSprite) {
      for (const dim of ["width", "height"]) {
        const v = val(root, dim);
        if (v !== undefined && /^\d*\.?\d+(px|pt|em|rem)?$/.test(v.trim())) add("fixed-size", root.at, `${dim}="${v}" on the root; remove it and size from CSS`);
      }
    }
    if (isSvgFile && !root.attrs.has("xmlns")) add("missing-xmlns", root.at, 'no xmlns="http://www.w3.org/2000/svg" on the root; the file will not render as an image');

    const titleEl = root.kids.find((k) => k.name === "title");
    const named = Boolean(titleEl) || root.attrs.has("aria-label") || root.attrs.has("aria-labelledby");
    const hide = root.attrs.get("aria-hidden");
    const hidden = Boolean(hide) && (hide.expr || hide.bare || hide.value === "true");
    if (root.spread) notChecked.push(`${file}:${lineOf(root.at)}: the root spreads props, so its accessible name was not checked`);
    else if (!named && !hidden) add("no-accessible-name", root.at, 'neither named nor hidden; add role="img" and a <title>, or aria-hidden="true"');
    if (titleEl) {
      const tid = val(titleEl, "id");
      const points = (val(root, "aria-labelledby") || "").split(/\s+/).includes(tid);
      const first = root.kids[0] === titleEl;
      if (val(root, "role") !== "img" || !tid || !points || !first) {
        add("loose-title", titleEl.at, 'a meaningful graphic takes role="img", <title> as the first child, and aria-labelledby pointing at its id');
      }
    }

    // ---- elements
    const strokes = new Map();
    const noteStroke = (v, at) => { const k = String(v).trim(); if (/^\d*\.?\d+(px)?$/.test(k) && !strokes.has(k)) strokes.set(k, at); };
    const iconSized = hasVb && vb[2] <= 32 && vb[3] <= 32;
    let decimals = 0, decimalAt = -1;
    const gradients = new Map();
    const inMask = (el) => { for (let p = el; p; p = p.parent) if (p.name === "mask" || p.name === "clipPath") return true; return false; };

    for (const c of comments) {
      if (/Generator:|Created with (Inkscape|Sketch|Figma)|Adobe Illustrator/i.test(c.text)) add("editor-leftover", c.at, "a generator comment; strip editor comments");
    }
    for (const el of els) {
      if (/^(sodipodi|inkscape|sketch):/.test(el.name) || el.name === "metadata") add("editor-leftover", el.at, `<${el.name}> is editor data; delete it`);
      for (const [name, a] of el.attrs) {
        if (/^(xmlns:)?(sodipodi|inkscape|sketch)\b/.test(name) || name === "data-name") add("editor-leftover", el.at, `${name} on <${el.name}> is editor data; delete it`);
        if (a.expr) continue;
        if (/^data:image\/(png|jpe?g|gif|webp|avif|bmp)/i.test(a.value.trim())) add("embedded-raster", el.at, `a base64 raster in ${name}; redraw it as paths, or leave the image raster`);
        else if (el.name === "image" && /^(href|xlink:href)$/.test(name) && /\.(png|jpe?g|gif|webp|avif|bmp)(\?|#|$)/i.test(a.value)) add("embedded-raster", el.at, `<image> points at a raster (${a.value})`);
        if (COLOR_ATTRS.has(name) && !inMask(el) && isHardColor(a.value)) add("hardcoded-color", el.at, `${name}="${a.value}" on <${el.name}>; use currentColor or var(--token, ${a.value})`);
        for (const v of a.value.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) if (!definedVars.has(v[1])) add("var-no-fallback", el.at, `${name}="${a.value}" has no fallback; write var(${v[1]}, <value>)`);
        if (name === "style") {
          for (const d of parseCss(`x{${a.value}}`, el.at)[0]?.decls || []) {
            if (COLOR_ATTRS.has(d.prop) && !inMask(el) && isHardColor(d.value)) add("hardcoded-color", el.at, `style="${d.prop}: ${d.value}" on <${el.name}>`);
          }
        }
        if (name === "stroke-width") noteStroke(a.value, el.at);
        if (iconSized && el !== root && /^(opacity|fill-opacity|stroke-opacity)$/.test(name)) {
          const o = Number(a.value);
          if (o > 0 && o < 1) add("translucent-ink", el.at, `${name}="${a.value}" on <${el.name}>; an icon is one opaque colour, quieted with opacity on the <svg>`);
        }
        if (/^(d|points|transform|x|y|x1|y1|x2|y2|cx|cy|r|rx|ry|width|height|values)$/.test(name)) {
          const n = (a.value.match(/\d*\.\d{3,}/g) || []).length;
          if (n) { decimals += n; if (decimalAt === -1) decimalAt = el.at; }
        }
        if (name === "keySplines") {
          const off = (a.value.match(/-?\d*\.?\d+/g) || []).map(Number).filter((n) => n < 0 || n > 1);
          if (off.length) add("spline-out-of-range", el.at, `keySplines has ${off.join(", ")}; keep every control point inside 0 to 1 and make the overshoot an extra keyframe`);
        }
      }
      if (el.name === "g") {
        const hollow = el.kids.length === 0 && (el.selfClosed || el.inner.replace(/<!--[\s\S]*?-->/g, "").trim() === "");
        if (hollow) add("empty-group", el.at, "an empty <g>; delete it");
        else if (!el.spread && !["id", "class", "data-layer"].some((n) => el.attrs.has(n))) add("unnamed-group", el.at, "a <g> with no id, class or data-layer; name it for what it holds");
      }
      if (el.name === "linearGradient" || el.name === "radialGradient") {
        const key = `${el.name}|${[...el.attrs].filter(([n]) => n !== "id").map(([n, a]) => `${n}=${a.value}`).sort().join("|")}|${el.inner.replace(/\s+/g, "")}`;
        if (gradients.has(key)) add("duplicate-def", el.at, `the same gradient as line ${lineOf(gradients.get(key))}; define it once in <defs>`);
        else gradients.set(key, el.at);
      }
      if (el.name === "script" && (val(root, "data-home") || opts.home) === "img") add("wrong-engine", el.at, "a <script> in a file loaded as an image never runs");
    }

    // ---- CSS inside the file
    const inRegion = (r) => r.at >= region.start && r.at < region.end;
    for (const rule of innerRules) {
      if (rule.atRule) continue;
      for (const d of rule.decls) {
        if (COLOR_ATTRS.has(d.prop) && isHardColor(d.value)) add("hardcoded-color", d.at, `${d.prop}: ${d.value} in <style>; use currentColor or var(--token, ${d.value})`);
        for (const v of d.value.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) if (!definedVars.has(v[1])) add("var-no-fallback", d.at, `${d.prop}: ${d.value} has no fallback; write var(${v[1]}, <value>)`);
        if (d.prop === "stroke-width") noteStroke(d.value, d.at);
      }
      if (rule.keyframes !== undefined) continue;
      for (const sel of splitSelectors(rule.selector)) {
        if (!rootId) add("leaky-style", rule.at, `"${sel}" is global because the root has no id; give the root an id and start every selector with it`);
        else if (!sel.startsWith(`#${rootId}`)) add("leaky-style", rule.at, `"${sel}" is global; start it with #${rootId}`);
      }
    }

    // ---- motion
    const used = new Set();
    const moving = [];
    for (const rule of svgRules) {
      if (rule.atRule || rule.keyframes !== undefined) continue;
      for (const d of rule.decls) {
        if (!/^(animation|animation-name|transition|transition-property)$/.test(d.prop) || /^(none|initial|unset)?$/.test(d.value)) continue;
        if (/reduce/.test(rule.media || "")) continue;
        moving.push({ rule, d });
        if (d.prop.startsWith("animation")) for (const w of d.value.split(/[\s,]+/)) used.add(w);
      }
    }
    const frames = svgRules.filter((r) => r.keyframes !== undefined && (used.has(r.keyframes) || inRegion(r)));
    const motionRules = [...svgRules.filter((r) => !r.atRule && r.keyframes === undefined), ...frames];
    const smil = els.filter((el) => SMIL.has(el.name));
    const hasCssMotion = moving.length > 0 || innerRules.some((r) => r.keyframes !== undefined);
    const reducedQuery = [...innerRules, ...pageRules].some((r) => /prefers-reduced-motion/.test(r.media || ""));

    if (hasCssMotion && !reducedQuery) {
      const first = moving[0]?.d.at ?? innerRules.find((r) => r.keyframes !== undefined).at;
      add("no-reduced-motion", first, "the file moves and has no @media (prefers-reduced-motion: reduce) block; add one that lands on a whole frame");
    }

    if (smil.length) {
      let still = false;
      if (isSvgFile) {
        const named = val(root, "data-still");
        const stem = join(dirname(file), basename(file, ext));
        still = (named && existsSync(join(dirname(file), named))) || ["svg", "png", "webp", "avif", "jpg"].some((e) => existsSync(`${stem}-still.${e}`));
      } else still = reducedQuery || /prefers-reduced-motion/.test(text);
      if (!still) add("smil-no-still", smil[0].at, isSvgFile
        ? `SMIL cannot read reduced motion; ship ${basename(file, ext)}-still.svg beside it, or name the fallback in data-still on the root`
        : "SMIL cannot read reduced motion; the page needs a prefers-reduced-motion branch that serves a still");
    }

    const declared = val(root, "data-home");
    const home = declared || (isSvgFile ? opts.home : "inline");
    if (declared && !HOMES.has(declared)) add("home-undeclared", root.at, `data-home="${declared}" is not img or inline, so the engine was not checked`);
    else if (!home && (hasCssMotion || smil.length)) add("home-undeclared", root.at, 'the file moves and does not say where it renders; add data-home="img" or data-home="inline", or pass --home');
    if (home === "img") {
      for (const rule of innerRules) {
        if (rule.atRule && /^@import/i.test(rule.selector)) add("wrong-engine", rule.at, "@import does not load in a file used as an image; keep the file self-contained");
        if (rule.atRule || rule.keyframes !== undefined) continue;
        if (/:(hover|focus|focus-visible|focus-within|active|checked)\b/.test(rule.selector)) add("wrong-engine", rule.at, `"${rule.selector}" never fires in a file loaded as an image; use keyframes inside the file`);
        for (const d of rule.decls) {
          if (/^transition(-property)?$/.test(d.prop) && !/^(none|initial|unset)?$/.test(d.value)) add("wrong-engine", d.at, "a transition needs a state change, and an image has none; use @keyframes inside the file, or SMIL");
        }
      }
    }

    // ---- easing, origin, repaint
    const originZero = !hasVb || (vb[0] === 0 && vb[1] === 0);
    let turns = null;
    let hasOrigin = false;
    const morphs = new Map();
    for (const rule of motionRules) {
      if (rule.atRule) continue;
      for (const d of rule.decls) {
        if (/^(transition|animation)(-timing-function)?$/.test(d.prop) && /\bease-in\b(?!-out)/.test(d.value)) add("ease-in", d.at, `${d.prop}: ${d.value}; ease-in starts slowest on the frame being watched, use an ease-out curve`);
        if (d.prop === "transform-origin") hasOrigin = true;
        const turning = (d.prop === "transform" && /\b(rotate|scale|skew)[XYZ]?\(/.test(d.value)) || ((d.prop === "rotate" || d.prop === "scale") && !/^(none|initial|unset)$/.test(d.value));
        if (turning && !turns) turns = d;
        if ((d.prop === "transform" && /\bscale\(\s*0(\.0+)?\s*(,\s*0(\.0+)?\s*)?\)/.test(d.value)) || (d.prop === "scale" && /^0(\.0+)?$/.test(d.value))) {
          add("scale-from-zero", d.at, `${d.prop}: ${d.value}; nothing real grows from nothing, so start near full size and add opacity`);
        }
        if (rule.keyframes !== undefined && /^(r|rx|ry|cx|cy|x|y|width|height|stroke-width|filter|points)$/.test(d.prop)) add("repaint-property", d.at, `@keyframes ${rule.keyframes} animates ${d.prop}, which repaints every frame; move transform and opacity`);
        if (/^transition(-property)?$/.test(d.prop)) {
          const hit = d.value.split(",").map((p) => p.trim().split(/\s+/)[0]).find((p) => /^(r|stroke-width|filter|width|height|all)$/.test(p));
          if (hit) add("repaint-property", d.at, `the transition animates ${hit}; name transform and opacity`);
        }
        if (d.prop === "d") {
          const p = /path\(\s*(["'])([\s\S]*?)\1\s*\)/.exec(d.value);
          if (!p) continue;
          const key = rule.keyframes !== undefined ? `@keyframes ${rule.keyframes}` : null;
          for (const k of key ? [key] : splitSelectors(rule.selector).map(subjectOf)) {
            if (!morphs.has(k)) morphs.set(k, []);
            morphs.get(k).push({ d: p[2], at: d.at });
          }
        }
      }
    }
    for (const el of smil) {
      const attr = val(el, "attributeName");
      if (el.name === "animateTransform") {
        const type = val(el, "type");
        const steps = [val(el, "values"), val(el, "from"), val(el, "to")].filter(Boolean).flatMap((v) => v.split(";"));
        const bare = type === "scale" || (type === "rotate" && steps.some((s) => (s.match(/-?\d*\.?\d+/g) || []).length < 3));
        if (bare && originZero) add("corner-origin", el.at, `a SMIL ${type} with no centre turns about (0,0); give rotate its cx cy, or wrap the part in a translated group`);
      }
      if (/^(r|stroke-width|points|filter|width|height)$/.test(attr || "")) add("repaint-property", el.at, `SMIL animates ${attr}, which repaints every frame`);
      if (el.name === "animate" && attr === "d") {
        const own = el.parent ? val(el.parent, "d") : undefined;
        const steps = val(el, "values") ? val(el, "values").split(";") : [val(el, "from") ?? own, val(el, "to")];
        morphs.set(`<animate> on line ${lineOf(el.at)}`, steps.filter((s) => s && s.trim()).map((d) => ({ d, at: el.at })));
      }
    }
    for (const el of els) {
      const a = el.attrs.get("d");
      if (!a || !a.expr) continue;
      const pair = /\?\s*(["'`])([^"'`]+)\1\s*:\s*(["'`])([^"'`]+)\3/.exec(a.value);
      if (pair) morphs.set(`d on line ${lineOf(el.at)}`, [{ d: pair[2], at: el.at }, { d: pair[4], at: el.at }]);
    }
    if (turns && !hasOrigin && originZero) {
      add("corner-origin", turns.at, `${turns.prop}: ${turns.value} with no transform-origin anywhere; set transform-box: fill-box and the origin you mean`);
    }

    let morphing = 0;
    for (const [key, list] of morphs) {
      if (list.length < 2) continue;
      morphing++;
      const sig = list.map((s) => commandsOf(s.d));
      const base = sig[0].join(" ");
      let mismatch = false;
      for (let i = 1; i < list.length; i++) {
        if (sig[i].join(" ") === base) continue;
        mismatch = true;
        add("morph-mismatch", list[i].at, `${key}: "${sig[i].join(" ")}" against "${base}" (${sig[i].length} commands against ${sig[0].length}); draw both on one command list, resample, or swap`);
      }
      const odd = [...new Set(sig.flat().filter((c) => !/^[MLCZ]$/.test(c)))];
      if (odd.length) add("morph-not-normalised", list[0].at, `${key} uses ${odd.join(" ")}; normalise both paths to absolute commands so every engine pairs them the same way`);
      if (!mismatch) {
        const winds = list.map((s) => windingOf(s.d)).filter(Boolean);
        if (new Set(winds).size > 1) add("morph-winding", list[0].at, `${key}: the shapes wind in opposite directions, so the morph turns through itself`);
      }
    }
    if (morphing) morphingRegions++;
    if (morphing > 1 && !iconSized) {
      const first = [...morphs.values()].find((l) => l.length > 1)[0];
      add("repaint-property", first.at, `d animates on ${morphing} elements of one scene; d repaints every frame, so keep it to one icon or one hero shape`);
    }
    if (morphing && morphingRegions === 2) add("repaint-property", root.at, "a second SVG in this file animates d; d repaints every frame, so never morph many at once");

    // ---- file-level candidates
    if (strokes.size > 1) add("mixed-stroke", [...strokes.values()][1], `stroke-width ${[...strokes.keys()].join(" and ")} in one file; one weight per icon and per set`);
    if (decimals) add("long-decimal", decimalAt, `${decimals} number(s) with more than 2 decimals; round path precision to 1 or 2`);
    const bytes = Buffer.byteLength(original.slice(region.start, region.end).replace(/<!--[\s\S]*?-->/g, ""));
    const flipbook = els.some((el) => el.attrs.has("data-frame"));
    const [kind, budget] = flipbook ? ["a flipbook", 60 * 1024]
      : isSprite ? [`a set of ${symbols.length} icons`, symbols.length * 2 * 1024]
        : iconSized ? ["an icon", 2 * 1024] : ["an illustration or mascot", 30 * 1024];
    if (bytes > budget) add("over-budget", root.at, `${(bytes / 1024).toFixed(1)} KB without comments, over the ${budget / 1024} KB budget for ${kind}`);
  });

  findings.sort((a, b) => a.lineNumber - b.lineNumber);
  return { findings, notChecked, checked: true };
};

// ---------------------------------------------------------------- files
const EXTS = new Set([".svg", ".html", ".htm", ".jsx", ".tsx"]);
const walk = (path) => {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return EXTS.has(extname(path).toLowerCase()) ? [path] : [];
  return readdirSync(path).sort().flatMap((f) => (f === "node_modules" || f.startsWith(".") ? [] : walk(join(path, f))));
};
const show = (file) => (relative(process.cwd(), file) || file).replace(/\\/g, "/");
const checkFile = (file, opts) => {
  const result = checkText(file, readFileSync(file, "utf8"), opts);
  for (const f of result.findings) f.file = show(file);
  result.notChecked = result.notChecked.map((n) => n.replace(file, show(file)));
  return result;
};
const print = (f) => console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`);
const tally = (findings, cls) => {
  const counts = {};
  for (const f of findings) if (f.class === cls) counts[f.line] = (counts[f.line] || 0) + 1;
  return counts;
};
const spell = (counts) => Object.entries(counts).map(([k, n]) => `${k} ${n}`).join(", ") || "0";

// ---------------------------------------------------------------- self-test
const selfTest = () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const examples = walk(join(root, "examples"));
  const teaching = join(root, "teaching");
  const pairs = existsSync(teaching) ? readdirSync(teaching).filter((d) => statSync(join(teaching, d)).isDirectory()).sort() : [];
  if (!examples.length || !pairs.length) {
    console.log(`inconclusive: ${examples.length} example(s) and ${pairs.length} teaching pair(s) found beside the script`);
    return 2;
  }
  let pass = 0, fail = 0;
  const assert = (ok, what) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); ok ? pass++ : fail++; };
  const never = (file) => checkFile(file, {}).findings.filter((f) => f.class === "never");

  for (const file of examples) {
    const lines = never(file);
    assert(lines.length === 0, `examples/${basename(file)} raises no never-intentional line${lines.length ? `: ${[...new Set(lines.map((f) => f.line))].join(", ")}` : ""}`);
  }
  for (const name of pairs) {
    const dir = join(teaching, name);
    const bad = readdirSync(dir).find((f) => /^bad\.[a-z]+$/.test(f));
    const good = readdirSync(dir).find((f) => /^good\.[a-z]+$/.test(f));
    if (!bad || !good) { assert(false, `teaching/${name} has a bad and a good file`); continue; }
    assert(name in NEVER || name in CANDIDATE, `teaching/${name} is named for a line the gate has`);
    assert(checkFile(join(dir, bad), {}).findings.some((f) => f.line === name), `teaching/${name}/${bad} raises ${name}:`);
    const clean = never(join(dir, good));
    assert(!checkFile(join(dir, good), {}).findings.some((f) => f.line === name), `teaching/${name}/${good} does not raise ${name}:`);
    assert(clean.length === 0, `teaching/${name}/${good} raises no never-intentional line${clean.length ? `: ${[...new Set(clean.map((f) => f.line))].join(", ")}` : ""}`);
  }

  // Lines with no pair on disk are proved on a string each.
  const ns = 'xmlns="http://www.w3.org/2000/svg"';
  const icon = (attrs, body) => `<svg ${ns} viewBox="0 0 24 24" aria-hidden="true" ${attrs}>${body}</svg>`;
  const inline = [
    ["missing-xmlns", "a.svg", '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12 L19 12" stroke="currentColor"/></svg>'],
    ["var-no-fallback", "a.svg", icon("", '<path d="M5 12 L19 12" stroke="var(--ink)"/>')],
    ["empty-group", "a.svg", icon("", '<g id="spare"></g><path d="M5 12 L19 12" stroke="currentColor"/>')],
    ["ease-in", "a.svg", icon('id="a" data-home="img"', "<style>#a path{animation:a-in 200ms ease-in}@keyframes a-in{from{opacity:0}}@media (prefers-reduced-motion: reduce){#a path{animation:none}}</style><path d=\"M5 12 L19 12\" stroke=\"currentColor\"/>")],
    ["smil-no-still", "a.svg", icon('id="a" data-home="img"', '<circle cx="12" cy="12" r="5" fill="currentColor"><animate attributeName="opacity" values="0;1" dur="400ms"/></circle>')],
    ["home-undeclared", "a.svg", icon('id="a"', "<style>#a path{animation:a-in 200ms ease}@keyframes a-in{from{opacity:0}}@media (prefers-reduced-motion: reduce){#a path{animation:none}}</style><path d=\"M5 12 L19 12\" stroke=\"currentColor\"/>")],
    ["mixed-stroke", "a.svg", icon("", '<path d="M5 12 L19 12" stroke="currentColor" stroke-width="1.5"/><path d="M5 17 L19 17" stroke="currentColor" stroke-width="2"/>')],
    ["long-decimal", "a.svg", icon("", '<path d="M5.12345 12 L19 12" stroke="currentColor"/>')],
    ["translucent-ink", "a.svg", icon("", '<path d="M5 12 L19 12" stroke="currentColor" opacity="0.4"/>')],
    ["morph-mismatch", "a.tsx", 'export const I = ({ on }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={on ? "M4 4 L20 4 L20 20 Z" : "M4 4 L20 4 L20 20 L4 20 Z"} fill="currentColor" /></svg>;'],
  ];
  for (const [line, name, text] of inline) {
    assert(checkText(join(root, "self-test", name), text, {}).findings.some((f) => f.line === line), `an inline fixture raises ${line}:`);
  }

  console.log(fail ? `self-test failed: ${fail} of ${pass + fail} assertions` : `self-test passed: ${pass} assertions`);
  return fail ? 1 : 0;
};

// ---------------------------------------------------------------- main
const main = () => {
  const argv = process.argv.slice(2);
  if (argv.includes("--help") || argv.includes("-h")) { console.log(HELP); return 0; }
  if (argv.includes("--self-test")) return selfTest();

  const take = (flag) => { const i = argv.indexOf(flag); if (i === -1) return undefined; const v = argv[i + 1]; argv.splice(i, 2); return v; };
  const report = take("--report");
  const home = take("--home");
  const gate = argv.includes("--gate");
  const strict = argv.includes("--strict");
  const inputs = argv.filter((a) => !a.startsWith("--"));
  const notChecked = [];
  if (home && !HOMES.has(home)) { console.log(`inconclusive: --home takes img or inline, not "${home}"`); return 2; }

  const files = [];
  for (const input of inputs) {
    const found = walk(resolve(input));
    if (!found.length) notChecked.push(`${input}: no .svg, .html, .htm, .jsx or .tsx file found`);
    files.push(...found);
  }

  const findings = [];
  let checked = 0;
  for (const file of [...new Set(files)]) {
    const result = checkFile(file, { home });
    findings.push(...result.findings);
    notChecked.push(...result.notChecked);
    if (result.checked) checked++;
  }

  for (const f of findings) print(f);
  const never = tally(findings, "never");
  const candidate = tally(findings, "candidate");
  const neverCount = findings.filter((f) => f.class === "never").length;
  const candidateCount = findings.length - neverCount;
  for (const n of notChecked) console.log(`not checked: ${n}`);

  let status, exitCode;
  if (!checked) { status = "inconclusive"; exitCode = 2; }
  else if (neverCount || (strict && candidateCount)) { status = "failed"; exitCode = gate ? 1 : 0; }
  else { status = "passed"; exitCode = 0; }

  if (report) {
    writeFileSync(resolve(report), `${JSON.stringify({ status, exitCode, files: [...new Set(files)].map(show), findings, notChecked }, null, 2)}\n`);
  }

  console.log(`${checked} file(s) checked. never intentional: ${spell(never)}. candidates: ${spell(candidate)}.`);
  console.log(NOTE);
  if (status === "inconclusive") console.log(`${GATE} inconclusive: nothing to check${inputs.length ? "" : "; pass files or folders"}`);
  else if (status === "failed") console.log(`${GATE} failed: ${neverCount} never-intentional line(s)${strict ? `, ${candidateCount} candidate(s) under --strict` : ""}`);
  else if (gate) console.log(`${GATE} passed`);
  else console.log(`${GATE}: no never-intentional line; run with --gate for the verdict`);
  return exitCode;
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(main());
