#!/usr/bin/env node
// ui-check.mjs: the gate for khe-ui.
//
// Reads CSS, HTML, JSX and TSX as text (and a review written in Markdown) and
// names every fault it can prove from the source as one line:
//
//   <line-name>: <what and where> (<file>:<line>)
//
// Two classes of line. "never-intentional" lines fail the gate. "candidate"
// lines are reported for judgment. The tables are in references/verify.md.
// Zero dependencies: Node 20+, node: imports only.

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GATE = "ui-check";
const NEVER = "never-intentional";
const CANDIDATE = "candidate";
const NECESSARY = "passing is necessary, not sufficient";

// Every line the gate can print. The name is the vocabulary the skill's docs use.
const LINES = {
  "transition-all": [NEVER, "A transition that names no property, or names `all`"],
  "ease-in": [NEVER, "`ease-in`, or a cubic-bezier that starts slower than linear and never slows at the end"],
  "scale-from-zero": [NEVER, "`scale(0)` on an element"],
  "layout-animation": [NEVER, "A transition or keyframe on width, height, top, left, margin or padding"],
  "ungated-hover": [NEVER, "A `:hover` rule that moves the element outside `@media (hover: hover)`"],
  "no-reduced-motion": [NEVER, "Motion in a file set that has no `prefers-reduced-motion` branch"],
  "small-input": [NEVER, "An input, textarea or select under 16px with no phone override"],
  "unnamed-icon-button": [NEVER, "A button with an icon and no accessible name"],
  "outline-none": [NEVER, "A removed focus outline with no `:focus-visible` replacement"],
  "magic-z-index": [NEVER, "A z-index above 400, the top of the layer scale"],
  "zoom-locked": [NEVER, "`user-scalable=no` or `maximum-scale=1`"],
  "positive-tabindex": [NEVER, "A tabindex of 1 or more"],
  "weight-shift": [NEVER, "A font weight that changes on hover, press or selection"],
  "motion-kill-switch": [NEVER, "A universal selector zeroing every animation under reduced motion"],
  "review-verdict": [NEVER, "A review with no verdict line, or a verdict outside the three allowed"],
  "review-not-checked": [NEVER, "A review with no `Not checked:` line"],
  "review-no-why": [NEVER, "A review row with an empty Why"],
  "long-duration": [CANDIDATE, "A duration over 300ms"],
  "ungated-hover-paint": [CANDIDATE, "A `:hover` rule that changes paint outside the hover gate"],
  "hover-gate-pointer": [CANDIDATE, "A hover gate with no `(pointer: fine)` condition"],
  "tailwind-hover-motion": [CANDIDATE, "A Tailwind `hover:` utility that moves the element"],
  "bare-transition": [CANDIDATE, "Tailwind's bare `transition` class"],
  "z-index-literal": [CANDIDATE, "A raw z-index other than -1, 0, 1 or 2"],
  "default-shadow": [CANDIDATE, "A single-layer shadow above 6% opacity"],
  "pure-black": [CANDIDATE, "A pure black background"],
  "gradient-text": [CANDIDATE, "Text filled with a gradient"],
  "generated-purple": [CANDIDATE, "One of the stock indigo, violet or purple values"],
  "tracked-caps": [CANDIDATE, "Uppercase text with positive tracking"],
  "looping-attention": [CANDIDATE, "`animate-bounce`, `animate-ping` or `animate-pulse`"],
  "viewport-100vh": [CANDIDATE, "`100vh`, `100lvh` or `h-screen`"],
  "env-no-fallback": [CANDIDATE, "`env()` inside `calc()` with no fallback"],
  "disabled-opacity": [CANDIDATE, "A disabled state made by opacity"],
  "div-onclick": [CANDIDATE, "A div or span with a click handler and no role and key handler"],
  "mounted-live-region": [CANDIDATE, "A live region mounted together with its text"],
  "submit-disabled-until-valid": [CANDIDATE, "A submit button disabled until the form is valid"],
  "placeholder-data": [CANDIDATE, "Acme, John Doe, lorem ipsum or 123 Main St"],
  "review-paraphrase": [CANDIDATE, "A review row whose Before quotes no code"],
};

const NOT_CHECKED = [
  "feel: whether a duration, curve or spring feels right at 25% speed and at full speed",
  "taste: whether the screen could belong to any product, and whether an animation should exist at all",
  "rendered pixels: contrast ratios, insets, alignment, clipping, layout shift, dark theme",
  "missing states: a data view with no loading, empty or error branch",
  "keyboard reach: Tab order, focus return, Escape, a role with no key handler",
  "screen readers, real phones, the software keyboard, safe areas",
  "reduced-motion coverage: the gate proves a branch exists in the file set, never that it covers every animation",
  "computed cascade: styles from a framework, a preprocessor, CSS-in-JS objects or a Tailwind config",
  "layout properties the motion lane does not name (max-height, right, bottom, inset)",
  "whether a visible button label or a text glyph is a good accessible name",
];

const HELP = `${GATE}: the gate for khe-ui. It reads source as text and names every fault as a line.

Usage:
  node scripts/ui-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]

  <files or folders>  .css, .html, .htm, .jsx and .tsx are scanned. A .md file is checked
                      only as a review (a Before | After | Why table or a Verdict line).
                      Folders are walked; node_modules, .git, dist, build and .next are skipped.
                      Everything passed in one run is one file set.
  --gate        end with "${GATE} passed" and exit 0 only when every never-intentional
                line is at 0. Otherwise print the counts, end "${GATE} failed", exit 1.
                With nothing to scan, end "${GATE} inconclusive", exit 2.
  --strict      candidates fail too (exit 1).
  --report f    write JSON: { status, exitCode, files, findings, notChecked }.
  --self-test   prove the gate on the skill's own fixtures: every example passes clean,
                every teaching/<line>/bad.* raises <line> and its good.* does not.
  --help        this text.

Each finding prints as:
  <line-name>: <what and where> (<file>:<line>)

Never-intentional lines (the gate fails on any):
${Object.entries(LINES).filter(([, v]) => v[0] === NEVER).map(([k, v]) => `  ${(k + ":").padEnd(30)}${v[1]}`).join("\n")}

Candidate lines (reported for judgment):
${Object.entries(LINES).filter(([, v]) => v[0] === CANDIDATE).map(([k, v]) => `  ${(k + ":").padEnd(30)}${v[1]}`).join("\n")}

Not checked by the gate (a script cannot judge these; look at the screen):
${NOT_CHECKED.map((n) => `  - ${n}`).join("\n")}

Exit codes: 0 passed, 1 failed (only with --gate or --strict), 2 inconclusive.
Without --gate or --strict the run reports every line and exits 0.
${NECESSARY}.`;

// ---------------------------------------------------------------- text helpers

function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return (pos) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= pos) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
}

// Replace a span with spaces, keeping newlines, so positions still map to lines.
const blank = (s) => s.replace(/[^\n]/g, " ");

// Split on a separator at paren depth 0, outside quotes.
function splitTop(value, sep) {
  const out = [];
  let depth = 0, q = null, cur = "";
  for (let i = 0; i < value.length; i++) {
    const c = value[i];
    if (q) { cur += c; if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; cur += c; continue; }
    if (c === "(" || c === "[") depth++;
    else if (c === ")" || c === "]") depth = Math.max(0, depth - 1);
    if (depth === 0 && c === sep) { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim()).filter((s) => s !== "");
}

const toMs = (n, unit) => (unit === "s" ? Number(n) * 1000 : Number(n));
const timesIn = (s) => [...s.replace(/\([^()]*\)/g, "()").matchAll(/(?<![\w.-])(\d*\.?\d+)(ms|s)\b/g)].map((m) => toMs(m[1], m[2]));

// ---------------------------------------------------------------- CSS parser

// Returns flat rules: { selector, at: [at-rule preludes], keyframes, decls: [{ prop, value, line }], line }.
function parseCss(src, rootSelector = null) {
  const text = src.replace(/\/\*[\s\S]*?\*\//g, blank);
  const lineOf = lineIndex(text);
  const rules = [];
  let i = 0;

  const stopAt = (from) => {
    let depth = 0, q = null;
    for (let j = from; j < text.length; j++) {
      const c = text[j];
      if (q) { if (c === "\\") j++; else if (c === q) q = null; continue; }
      if (c === '"' || c === "'") { q = c; continue; }
      if (c === "(") depth++;
      else if (c === ")") depth = Math.max(0, depth - 1);
      else if (depth === 0 && (c === ";" || c === "{" || c === "}")) return j;
    }
    return text.length;
  };

  const nest = (parent, child) => {
    if (!parent) return child;
    return splitTop(child, ",").map((c) => (c.includes("&") ? c.replace(/&/g, parent) : `${parent} ${c}`)).join(", ");
  };

  const block = (ctx) => {
    const rule = { selector: ctx.selector, at: ctx.at, keyframes: ctx.keyframes, decls: [], line: ctx.line };
    rules.push(rule);
    while (i < text.length) {
      while (i < text.length && /\s/.test(text[i])) i++;
      if (i >= text.length) break;
      if (text[i] === "}") { i++; break; }
      if (text[i] === ";") { i++; continue; }
      const start = i;
      const end = stopAt(start);
      const chunk = text.slice(start, end).trim();
      if (text[end] === "{") {
        i = end + 1;
        const line = lineOf(start);
        if (chunk.startsWith("@")) {
          const name = (chunk.match(/^@([\w-]+)/) || [])[1]?.toLowerCase() || "";
          if (name.endsWith("keyframes")) block({ selector: null, at: ctx.at, keyframes: chunk.replace(/^@[\w-]+\s*/, "") || "anonymous", line });
          else if (["media", "supports", "container", "layer", "starting-style", "scope", "document"].includes(name)) block({ selector: ctx.selector, at: [...ctx.at, chunk], keyframes: ctx.keyframes, line });
          else block({ selector: chunk, at: ctx.at, keyframes: null, line });
        } else if (ctx.keyframes) {
          block({ selector: chunk, at: ctx.at, keyframes: ctx.keyframes, line });
        } else {
          block({ selector: nest(ctx.selector, chunk), at: ctx.at, keyframes: null, line });
        }
        continue;
      }
      const colon = chunk.indexOf(":");
      if (colon > 0) {
        rule.decls.push({ prop: chunk.slice(0, colon).trim().toLowerCase(), value: chunk.slice(colon + 1).trim().replace(/\s+/g, " "), line: lineOf(start) });
      }
      i = end;
      if (text[i] === ";") i++;
    }
  };

  block({ selector: rootSelector, at: [], keyframes: null, line: 1 });
  return rules.filter((r) => r.decls.length > 0);
}

// ---------------------------------------------------------------- CSS checks

const LAYOUT_PROP = /^(width|height|top|left|(margin|padding)(-(top|right|bottom|left|inline|block)(-(start|end))?)?)$/;
const MOVE_PROP = /^(transform|translate|scale|rotate)$/;
const EASING_WORD = /^(ease|linear|ease-in|ease-out|ease-in-out|step-start|step-end)$/;
const GLOBAL_WORD = /^(none|inherit|initial|unset|revert|revert-layer)$/;
const PURPLE_HEX = /#(6366f1|8b5cf6|7c3aed|a855f7|4f46e5|9333ea)\b/i;
const STATE_SELECTOR = /:hover|:active|\[aria-selected|\[aria-current|\.(is-)?(active|selected)(?![\w-])|\[data-state=["']?(active|on|open)|\[data-selected/;

// One comma segment of a transition shorthand: its property (or null) and its times.
function transitionSegment(seg) {
  const flat = seg.replace(/\([^()]*\)/g, "()").replace(/\([^()]*\)/g, "()");
  const hasVar = /\bvar\(\)/.test(flat);
  let prop = null;
  for (const tok of flat.split(/\s+/)) {
    if (!tok || /^-?\d*\.?\d+(ms|s)$/.test(tok) || EASING_WORD.test(tok) || /\(\)$/.test(tok) || tok === "allow-discrete" || tok === "normal") continue;
    prop = tok.toLowerCase();
    break;
  }
  return { prop, times: timesIn(seg), hasVar };
}

// A cubic-bezier that leaves rest slower than linear and never slows at the end is ease-in.
function easeInBezier(value) {
  for (const m of value.matchAll(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g)) {
    const [x1, y1, x2, y2] = m.slice(1, 5).map(Number);
    const startSlope = x1 === 0 ? (y1 === 0 ? 1 : Infinity) : y1 / x1;
    const endSlope = x2 === 1 ? (y2 === 1 ? 1 : Infinity) : (1 - y2) / (1 - x2);
    if (startSlope < 1 && endSlope >= 1) return m[0];
  }
  return null;
}

function alphaOf(layer) {
  let m = layer.match(/rgba?\(\s*[\d.]+%?\s*[, ]\s*[\d.]+%?\s*[, ]\s*[\d.]+%?\s*[,/]\s*([\d.]+)(%?)\s*\)/);
  if (m) return m[2] ? Number(m[1]) / 100 : Number(m[1]);
  m = layer.match(/(?:oklch|oklab|hsla?|color)\([^)]*\/\s*([\d.]+)(%?)\s*\)/);
  if (m) return m[2] ? Number(m[1]) / 100 : Number(m[1]);
  m = layer.match(/#([0-9a-f]{8})\b/i);
  if (m) return parseInt(m[1].slice(6), 16) / 255;
  m = layer.match(/#([0-9a-f]{4})\b/i);
  if (m) return parseInt(m[1][3] + m[1][3], 16) / 255;
  if (/var\(|color-mix\(|currentcolor/i.test(layer)) return null;
  return 1;
}

function fontSizePx(decl) {
  let v = null;
  if (decl.prop === "font-size") v = decl.value;
  else if (decl.prop === "font") v = (decl.value.match(/(?<![\w.-])\d*\.?\d+(px|rem)(?=\s*(\/|\s))/) || [])[0] || null;
  if (!v) return null;
  const m = v.match(/^(\d*\.?\d+)(px|rem)\b/);
  if (!m) return null;
  return m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1]);
}

const lastCompound = (sel) => sel.split(/[\s>+~]+/).filter(Boolean).pop() || "";
const targetsInput = (sel) => splitTop(sel, ",").some((part) => /(^|[^\w.#-])(input|textarea|select)(?![\w-])/.test(lastCompound(part)));
const focusBase = (part) => part.replace(/::?(focus-visible|focus-within|focus|active|hover)/g, "").trim();
const isGlobalBase = (b) => b === "" || b === "*" || /^(:root|html|body)$/.test(b) || /^[a-z][a-z0-9]*$/i.test(b) || /^:(where|is)\(/.test(b);

function checkCssRules(rules, file, add, state) {
  for (const rule of rules) {
    const sel = rule.selector || "";
    const inReduce = rule.at.some((a) => /prefers-reduced-motion/.test(a));
    if (inReduce) state.reducedBranch = true;
    const gated = rule.at.some((a) => /hover:\s*hover/.test(a));
    const pointerFine = rule.at.some((a) => /pointer:\s*fine/.test(a));
    const declared = (p) => rule.decls.find((d) => d.prop === p);

    // Hover rules.
    // A hover rule that only switches motion off (a reduced-motion reset) cannot stick.
    const onlyResets = rule.decls.every((d) => /^(transform|translate|scale|rotate|transition|animation)$/.test(d.prop) && d.value === "none");
    if (!rule.keyframes && /:hover/.test(sel) && !onlyResets) {
      const move = rule.decls.find((d) => MOVE_PROP.test(d.prop) && !GLOBAL_WORD.test(d.value));
      if (!gated && move) add("ungated-hover", file, move.line, `\`${sel}\` sets \`${move.prop}: ${move.value}\` outside \`@media (hover: hover) and (pointer: fine)\`; it sticks after a tap`);
      else if (!gated) add("ungated-hover-paint", file, rule.line, `\`${sel}\` is outside \`@media (hover: hover) and (pointer: fine)\``);
      else if (!pointerFine) add("hover-gate-pointer", file, rule.line, `\`${sel}\` is gated on \`(hover: hover)\` alone; add \`and (pointer: fine)\``);
    }

    // Reduced-motion kill switch.
    if (inReduce && !rule.keyframes && splitTop(sel, ",").some((p) => /^(\*|\*?::?(before|after))$/.test(p))) {
      const d = rule.decls.find((x) => /^(animation|transition)(-duration)?$/.test(x.prop));
      if (d) add("motion-kill-switch", file, d.line, `\`${sel} { ${d.prop}: ${d.value} }\` under reduced motion strands entrances at their start state`);
    }

    // Tracked caps.
    const upper = rule.decls.find((d) => d.prop === "text-transform" && d.value === "uppercase");
    const track = rule.decls.find((d) => d.prop === "letter-spacing" && /^\+?0*\.?\d*[1-9]\d*(em|px|rem)$/.test(d.value));
    if (upper && track) add("tracked-caps", file, upper.line, `\`${sel}\` is uppercase with \`letter-spacing: ${track.value}\``);

    // Disabled by opacity.
    if (/:disabled|\[disabled|\[aria-disabled/.test(sel)) {
      const d = rule.decls.find((x) => x.prop === "opacity" && Number(x.value) < 1);
      if (d) add("disabled-opacity", file, d.line, `\`${sel}\` uses \`opacity: ${d.value}\``);
    }

    for (const d of rule.decls) {
      const { prop, value, line } = d;

      // Keyframes on layout properties.
      if (rule.keyframes) {
        state.motion.push({ file, line: rule.line });
        if (LAYOUT_PROP.test(prop)) add("layout-animation", file, line, `@keyframes ${rule.keyframes} animates \`${prop}\``);
      }

      if (prop === "transition") {
        if (!GLOBAL_WORD.test(value)) {
          for (const seg of splitTop(value, ",")) {
            const t = transitionSegment(seg);
            if (t.prop === "all") add("transition-all", file, line, `\`transition: ${value}\` in \`${sel}\``);
            else if (!t.prop && t.times.length && !t.hasVar) {
              const later = declared("transition-property");
              if (!later || /\ball\b/.test(later.value)) add("transition-all", file, line, `\`transition: ${value}\` names no property, so it animates all, in \`${sel}\``);
            } else if (t.prop && LAYOUT_PROP.test(t.prop)) add("layout-animation", file, line, `\`transition\` on \`${t.prop}\` in \`${sel}\``);
            if (t.prop && (MOVE_PROP.test(t.prop) || t.prop === "all")) state.motion.push({ file, line });
            if (!t.prop && t.times.length && !t.hasVar) state.motion.push({ file, line });
            if (t.times.length && t.times[0] > 300) add("long-duration", file, line, `${t.times[0]}ms on \`${t.prop || "all"}\` in \`${sel}\``);
          }
        }
      }
      if (prop === "transition-property") {
        for (const p of splitTop(value, ",")) {
          if (p === "all") add("transition-all", file, line, `\`transition-property: all\` in \`${sel}\``);
          else if (LAYOUT_PROP.test(p)) add("layout-animation", file, line, `\`transition-property\` names \`${p}\` in \`${sel}\``);
          if (MOVE_PROP.test(p) || p === "all") state.motion.push({ file, line });
        }
      }
      if (prop === "transition-duration") {
        for (const t of timesIn(value)) if (t > 300) add("long-duration", file, line, `${t}ms in \`${sel}\``);
      }
      if (prop === "animation" || prop === "animation-name") {
        if (!GLOBAL_WORD.test(value)) state.motion.push({ file, line });
      }
      if (prop === "animation" && !/\binfinite\b/.test(value)) {
        for (const seg of splitTop(value, ",")) {
          const t = timesIn(seg);
          if (t.length && t[0] > 300) add("long-duration", file, line, `${t[0]}ms animation in \`${sel}\``);
        }
      }
      if (prop === "animation-duration" && !/\binfinite\b/.test(declared("animation-iteration-count")?.value || "")) {
        for (const t of timesIn(value)) if (t > 300) add("long-duration", file, line, `${t}ms animation in \`${sel}\``);
      }

      // Easing.
      const easingProp = /^(transition|animation)(-timing-function)?$/.test(prop) || (prop.startsWith("--") && /ease|curve|timing|transition|motion/.test(prop));
      if (easingProp) {
        if (/(^|[\s,])ease-in(?![\w-])/.test(value)) add("ease-in", file, line, `\`${prop}: ${value}\` in \`${sel || ":root"}\``);
        const bez = easeInBezier(value);
        if (bez) add("ease-in", file, line, `\`${bez}\` starts slower than linear and never slows at the end, in \`${sel || ":root"}\``);
      }

      // scale(0).
      if (/\bscale(3d)?\(\s*0\s*(,\s*0\s*)*\)/.test(value) || (prop === "scale" && /^0(\s+0)*$/.test(value))) {
        add("scale-from-zero", file, line, `\`${prop}: ${value}\` in \`${rule.keyframes ? `@keyframes ${rule.keyframes}` : sel}\``);
      }

      // Weight on state.
      if (prop === "font-weight" && !rule.keyframes && STATE_SELECTOR.test(sel)) {
        add("weight-shift", file, line, `\`${sel}\` sets \`font-weight: ${value}\`; the text reflows`);
      }

      // Focus outline removed: resolved after the whole set is read.
      if ((prop === "outline" && /^(none|0|0px)(\s|$)/.test(value)) || (prop === "outline-style" && value === "none") || (prop === "outline-width" && /^0(px)?$/.test(value))) {
        state.outlineOff.push({ rule, file, line, decl: `${prop}: ${value}` });
      }
      if (/:focus-visible/.test(sel) && ((prop === "outline" && !/^(none|0|0px)(\s|$)/.test(value)) || (prop === "box-shadow" && value !== "none"))) {
        for (const part of splitTop(sel, ",")) if (/:focus-visible/.test(part)) state.focusBases.push(focusBase(part));
      }

      // z-index.
      if (prop === "z-index" && /^-?\d+$/.test(value)) {
        const z = Number(value);
        if (z > 400) add("magic-z-index", file, line, `\`z-index: ${value}\` in \`${sel}\`; the layer scale stops at 400`);
        else if (![-1, 0, 1, 2].includes(z)) add("z-index-literal", file, line, `\`z-index: ${value}\` in \`${sel}\`; use a layer token, or 1 and 2 inside \`isolation: isolate\``);
      }

      // Inputs under 16px: resolved after the whole set is read.
      if (!rule.keyframes && targetsInput(sel)) {
        const px = fontSizePx(d);
        if (px !== null) state.inputSizes.push({ rule, file, line, px });
      }

      // Candidates on single declarations.
      if (prop === "box-shadow" && value !== "none") {
        const layers = splitTop(value, ",");
        if (layers.length === 1 && !/\binset\b/.test(layers[0])) {
          const lengths = [...layers[0].replace(/\([^()]*\)/g, "").matchAll(/(?<![\w.#-])-?\d*\.?\d+(px|rem|em)?(?![\w.%])/g)].map((m) => parseFloat(m[0]));
          const alpha = alphaOf(layers[0]);
          if (lengths.length >= 3 && lengths[2] > 0 && alpha !== null && alpha > 0.06) add("default-shadow", file, line, `\`box-shadow: ${value}\` is one layer at ${Math.round(alpha * 100)}% in \`${sel}\``);
        }
      }
      if (/^background(-color)?$/.test(prop) && /^(#000|#000000|black|rgb\(\s*0[ ,]+0[ ,]+0\s*\))$/i.test(value)) add("pure-black", file, line, `\`${prop}: ${value}\` in \`${sel}\``);
      if (/^(-webkit-)?background-clip$/.test(prop) && value === "text") add("gradient-text", file, line, `\`${prop}: text\` in \`${sel}\``);
      if (/^(min-|max-)?(height|block-size)$/.test(prop) && /(?<![\w.])100l?vh\b/.test(value)) add("viewport-100vh", file, line, `\`${prop}: ${value}\` in \`${sel}\``);
      if (/calc\(/.test(value) && /env\(\s*safe-area-inset-[a-z-]+\s*\)/.test(value)) add("env-no-fallback", file, line, `\`${prop}: ${value}\` in \`${sel}\``);
      if (PURPLE_HEX.test(value)) add("generated-purple", file, line, `\`${prop}: ${value}\` in \`${sel || ":root"}\``);
    }
  }
}

function resolveSetChecks(state, add) {
  // outline: none with no replacement.
  for (const o of state.outlineOff) {
    const sel = o.rule.selector || "";
    if (/:focus:not\(:focus-visible\)/.test(sel)) continue;
    const sameRule = /:focus/.test(sel) && o.rule.decls.some((d) => d.prop === "box-shadow" && d.value !== "none");
    if (sameRule) continue;
    const bases = splitTop(sel, ",").map(focusBase);
    const replaced = bases.every((b) => state.focusBases.some((f) => f === b || isGlobalBase(f)));
    if (!replaced) add("outline-none", o.file, o.line, `\`${sel} { ${o.decl} }\` has no \`:focus-visible\` outline or ring to replace it`);
  }

  // Inputs under 16px with no phone override.
  const phoneScope = (r) => r.at.some((a) => /pointer:\s*coarse|hover:\s*none|max-width|width\s*<=?/.test(a));
  const desktopScope = (r) => r.at.some((a) => /pointer:\s*fine|hover:\s*hover|min-width|width\s*>=?/.test(a));
  const override = state.inputSizes.some((s) => s.px >= 16 && phoneScope(s.rule));
  for (const s of state.inputSizes) {
    if (s.px >= 16 || desktopScope(s.rule) || override) continue;
    add("small-input", s.file, s.line, `\`${s.rule.selector}\` is ${s.px}px; iOS zooms the page on focus under 16px`);
  }

  // Motion with no reduced-motion branch anywhere in the set.
  if (!state.reducedBranch) {
    const seen = new Set();
    for (const m of state.motion) {
      if (seen.has(m.file)) continue;
      seen.add(m.file);
      add("no-reduced-motion", m.file, m.line, "this file moves something and no file in the set has a `prefers-reduced-motion` branch");
    }
  }
}

// ---------------------------------------------------------------- class tokens (Tailwind)

const TW_SIZE = { "text-xs": 12, "text-sm": 14, "text-base": 16, "text-lg": 18, "text-xl": 20 };
const TW_WEIGHT = /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/;

function splitVariants(token) {
  const parts = [];
  let depth = 0, cur = "";
  for (const c of token) {
    if (c === "[") depth++;
    if (c === "]") depth = Math.max(0, depth - 1);
    if (c === ":" && depth === 0) { parts.push(cur); cur = ""; continue; }
    cur += c;
  }
  parts.push(cur);
  return { base: parts.pop().replace(/^!/, ""), variants: parts };
}

function twSize(base) {
  if (base in TW_SIZE) return TW_SIZE[base];
  const m = base.match(/^text-\[(\d*\.?\d+)(px|rem)\]$/);
  return m ? (m[2] === "rem" ? Number(m[1]) * 16 : Number(m[1])) : null;
}

function checkTokens(tokens, file, line, add, state) {
  const parsed = tokens.map(splitVariants);
  const hasFocusVisible = parsed.some((t) => t.variants.includes("focus-visible") && /^(ring|outline|shadow|border)/.test(t.base) && t.base !== "outline-none");
  const utilityish = parsed.some((t) => /^(duration|ease|delay)-|^(bg|text|p[xytblr]?|m[xytblr]?|flex|grid|rounded|border)-/.test(t.base) || t.variants.length > 0);
  for (const { base, variants } of parsed) {
    const token = [...variants, base].join(":");
    if (variants.some((v) => v.startsWith("motion-reduce") || v.startsWith("motion-safe"))) state.reducedBranch = true;
    if (base === "transition-all") { add("transition-all", file, line, `Tailwind \`${token}\``); state.motion.push({ file, line }); }
    if (base === "transition-transform" || /^animate-(?!none$)/.test(base)) state.motion.push({ file, line });
    if (base === "ease-in") add("ease-in", file, line, `\`${token}\``);
    if (base === "scale-0") add("scale-from-zero", file, line, `Tailwind \`${token}\``);
    const tl = base.match(/^transition-\[(.+)\]$/);
    if (tl) {
      for (const p of tl[1].split(",")) {
        if (p === "all") add("transition-all", file, line, `Tailwind \`${token}\``);
        else if (LAYOUT_PROP.test(p)) add("layout-animation", file, line, `Tailwind \`${token}\` animates \`${p}\``);
      }
    }
    const stateVariant = variants.some((v) => /^(hover|active|aria-selected|aria-current|group-hover)$|^data-\[state=(active|on|open)\]$|^aria-\[(selected|current)/.test(v));
    if (stateVariant && TW_WEIGHT.test(base)) add("weight-shift", file, line, `Tailwind \`${token}\`; the text reflows`);
    if (base === "outline-none" && !hasFocusVisible) add("outline-none", file, line, `Tailwind \`${token}\` with no \`focus-visible:\` ring or outline beside it`);
    const z = base.match(/^z-\[(\d+)\]$/);
    if (z && Number(z[1]) > 400) add("magic-z-index", file, line, `Tailwind \`${token}\`; the layer scale stops at 400`);
    else if (z && ![0, 1, 2].includes(Number(z[1]))) add("z-index-literal", file, line, `Tailwind \`${token}\``);
    if (/^z-(10|20|30|40|50)$/.test(base)) add("z-index-literal", file, line, `Tailwind \`${token}\`; use a layer token, or 1 and 2 inside \`isolate\``);
    if (/^(min-)?h-screen$/.test(base)) add("viewport-100vh", file, line, `Tailwind \`${token}\` is 100vh`);
    if (base === "bg-clip-text") add("gradient-text", file, line, `Tailwind \`${token}\``);
    if (/^animate-(bounce|ping|pulse)$/.test(base)) add("looping-attention", file, line, `Tailwind \`${token}\``);
    if (variants.includes("hover") && /^-?(scale|translate|rotate)-/.test(base)) add("tailwind-hover-motion", file, line, `Tailwind \`${token}\`; gated only in v4, or in v3 with \`hoverOnlyWhenSupported\``);
    if (base === "transition" && utilityish) add("bare-transition", file, line, "Tailwind bare `transition`; name the properties");
    if (variants.includes("disabled") && /^opacity-\d+$/.test(base)) add("disabled-opacity", file, line, `Tailwind \`${token}\``);
    if (/^(bg|text|from|to|via|border|ring)-(purple|violet|indigo|fuchsia)-\d{2,3}$/.test(base)) add("generated-purple", file, line, `Tailwind \`${token}\``);
  }
  if (parsed.some((t) => t.base === "uppercase") && parsed.some((t) => /^tracking-(wide|wider|widest)$/.test(t.base))) add("tracked-caps", file, line, "Tailwind `uppercase` with `tracking-wide`");
}

// ---------------------------------------------------------------- markup checks

function* tagsIn(text) {
  const re = /<([A-Za-z][\w.-]*)/g;
  let m;
  while ((m = re.exec(text))) {
    const before = m.index > 0 ? text[m.index - 1] : "";
    if (/[\w)\]]/.test(before)) continue; // a generic or a comparison, not a tag
    let j = re.lastIndex, depth = 0, q = null, closed = false;
    for (; j < text.length; j++) {
      const c = text[j];
      if (q) { if (c === q) q = null; continue; }
      if (c === '"' || c === "'" || c === "`") { q = c; continue; }
      if (c === "{") depth++;
      else if (c === "}") depth = Math.max(0, depth - 1);
      else if (c === ">" && depth === 0 && text[j - 1] !== "=") { closed = true; break; }
    }
    if (!closed) continue;
    const attrs = text.slice(re.lastIndex, j);
    yield { name: m[1], attrs, start: m.index, end: j + 1, selfClosing: /\/\s*$/.test(attrs) };
    re.lastIndex = j + 1;
  }
}

function attr(attrs, name) {
  const m = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{([^}]*)\\})`, "i"));
  if (!m) return new RegExp(`(?:^|\\s)${name}(?=\\s|/|$)`, "i").test(attrs) ? "" : null;
  return m[1] ?? m[2] ?? m[3] ?? "";
}

const stringsIn = (s) => [...s.matchAll(/"([^"\n]*)"|'([^'\n]*)'|`([^`]*)`/g)].map((m) => ({ value: m[1] ?? m[2] ?? m[3] ?? "", index: m.index }));
const NO_TEXT_INPUT = /^(checkbox|radio|range|file|hidden|color|submit|button|image|reset)$/i;

function checkMarkup(text, file, add, state, isJsx) {
  const lineOf = lineIndex(text);

  for (const tag of tagsIn(text)) {
    const name = tag.name;
    const lower = name.toLowerCase();
    const line = lineOf(tag.start);

    // Class lists on this tag.
    const classAttr = isJsx ? attr(tag.attrs, "className") ?? attr(tag.attrs, "class") : attr(tag.attrs, "class");
    let tokens = [];
    if (classAttr !== null) {
      const raw = isJsx && /["'`]/.test(classAttr) ? stringsIn(classAttr).map((s) => s.value).join(" ") : classAttr;
      tokens = raw.split(/\s+/).filter(Boolean);
      if (!isJsx) checkTokens(tokens, file, line, add, state);
    }

    // Inline style.
    const style = !isJsx ? attr(tag.attrs, "style") : null;
    if (style) {
      const rules = parseCss(`${lower}{${style}}`).map((r) => ({ ...r, line, decls: r.decls.map((d) => ({ ...d, line })) }));
      checkCssRules(rules, file, add, state);
    }

    // Inputs under 16px by utility class.
    if (/^(input|textarea|select)$/.test(name) && !NO_TEXT_INPUT.test(attr(tag.attrs, "type") || "")) {
      const parsed = tokens.map(splitVariants);
      const base = parsed.filter((t) => t.variants.length === 0).map((t) => twSize(t.base)).find((n) => n !== null);
      const phone = parsed.some((t) => t.variants.some((v) => /^(max-|pointer-coarse)/.test(v)) && (twSize(t.base) ?? 0) >= 16);
      if (base !== undefined && base < 16 && !phone) add("small-input", file, line, `<${name}> is ${base}px by class; iOS zooms the page on focus under 16px`);
    }

    // Positive tabindex.
    const tab = attr(tag.attrs, "tabindex");
    if (tab !== null && /^\s*\d+\s*$/.test(tab) && Number(tab) >= 1) add("positive-tabindex", file, line, `<${name} tabindex="${tab.trim()}"> hijacks the tab order; only 0 and -1`);

    // Click handler on a div or span.
    if (/^(div|span)$/.test(name) && /(?:^|\s)onclick\s*=/i.test(tag.attrs) && !(/(?:^|\s)role\s*=/.test(tag.attrs) && /(?:^|\s)onkeydown\s*=/i.test(tag.attrs))) {
      add("div-onclick", file, line, `<${name}> has a click handler and no role with a key handler; use a <button>`);
    }

    // Buttons with no accessible name.
    if (name === "button" && !tag.selfClosing) {
      const close = text.slice(tag.end).search(/<\/button\s*>/i);
      if (close < 0) continue;
      if (/\{\s*\.\.\./.test(tag.attrs)) continue; // spread props may carry the name
      if (/(?:^|\s)(aria-label|aria-labelledby|title)\s*=/.test(tag.attrs)) continue;
      let inner = text.slice(tag.end, tag.end + close).replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "");
      if (/<svg\b[^>]*\baria-label(ledby)?\s*=|<title[\s>]/i.test(inner)) continue;
      if (/<img\b[^>]*\balt\s*=\s*["'][^"']+["']/i.test(inner)) continue;
      let icon = false, unknown = false;
      inner = inner.replace(/<svg\b[\s\S]*?<\/svg>/gi, () => { icon = true; return " "; });
      inner = inner.replace(/<img\b[^>]*>/gi, () => { icon = true; return " "; });
      inner = inner.replace(/<([A-Z][\w.]*)\b[^<>]*\/>/g, (_, n) => { if (/Icon$|^Icon|Svg$/.test(n)) icon = true; else unknown = true; return " "; });
      inner = inner.replace(/<i\b[^>]*>\s*<\/i>/gi, () => { icon = true; return " "; });
      inner = inner.replace(/<\/?[A-Za-z][^<>]*>/g, " ");
      if (unknown || (isJsx && /\{/.test(inner))) continue;
      if (inner.replace(/&nbsp;|\s/g, "") === "") {
        add("unnamed-icon-button", file, line, icon ? "<button> holds only an icon and has no `aria-label`" : "<button> has no text and no `aria-label`");
      }
    }
  }

  // Whole-text patterns.
  const each = (re, fn) => { for (const m of text.matchAll(re)) fn(m, lineOf(m.index)); };
  each(/user-scalable\s*=\s*(no|0)\b|maximum-scale\s*=\s*1(\.0+)?(?![\d.])/gi, (m, line) => add("zoom-locked", file, line, `\`${m[0]}\` blocks zoom; a 16px input is the fix for the iOS zoom`));
  each(/\b(Acme|John Doe|Jane Doe|lorem ipsum|123 Main St)\b/gi, (m, line) => add("placeholder-data", file, line, `"${m[0]}"`));
  if (/prefers-reduced-motion/.test(text)) state.reducedBranch = true;

  if (isJsx) {
    each(/\buserScalable:\s*false|\bmaximumScale:\s*1(?![\d.])/g, (m, line) => add("zoom-locked", file, line, `\`${m[0]}\` blocks zoom; a 16px input is the fix for the iOS zoom`));
    each(/\btransition:\s*["'`]\s*all\b[^"'`]*["'`]/g, (m, line) => add("transition-all", file, line, `\`${m[0]}\``));
    each(/\bease:\s*["'`](easeIn|ease-in)["'`]/g, (m, line) => add("ease-in", file, line, `\`${m[0]}\``));
    each(/\bscale:\s*0(?![\d.])/g, (m, line) => add("scale-from-zero", file, line, `\`${m[0]}\``));
    each(/\bzIndex:\s*(\d+)\b/g, (m, line) => {
      const z = Number(m[1]);
      if (z > 400) add("magic-z-index", file, line, `\`${m[0]}\`; the layer scale stops at 400`);
      else if (![0, 1, 2].includes(z)) add("z-index-literal", file, line, `\`${m[0]}\``);
    });
    each(/\bdisabled=\{\s*!\s*[\w.?]*[vV]alid\w*\s*\}/g, (m, line) => add("submit-disabled-until-valid", file, line, `\`${m[0]}\`; keep it enabled and let the click validate`));
    each(/&&\s*\(?\s*<[A-Za-z][\w.]*[^<>]*?\brole=["'](status|alert)["']/g, (m, line) => add("mounted-live-region", file, line, `a \`role="${m[1]}"\` region mounts with its text; render it empty first, then set the text`));
    each(/\b(initial|animate|exit|whileHover|whileTap)=\{/g, (m, line) => state.motion.push({ file, line }));
    if (/useReducedMotion|reducedMotion|ReduceMotion/.test(text)) state.reducedBranch = true;

    // Class lists and easing strings live in any string literal.
    for (const s of stringsIn(text)) {
      const tokens = s.value.split(/\s+/).filter(Boolean);
      if (tokens.length && tokens.length <= 80 && tokens.every((t) => /^[!\w:[\]().,/%#=&*>~+'-]+$/.test(t))) checkTokens(tokens, file, lineOf(s.index), add, state);
    }

    // CSS in tagged templates.
    for (const m of text.matchAll(/(?:\bcss|\bkeyframes|\bstyled(?:\.\w+|\([^)]*\)))\s*`([^`]*)`/g)) {
      const startLine = lineOf(m.index + m[0].indexOf("`"));
      const body = m[1].replace(/\$\{[^}]*\}/g, blank);
      const rules = parseCss(body, "&").map((r) => ({ ...r, line: r.line + startLine - 1, decls: r.decls.map((d) => ({ ...d, line: d.line + startLine - 1 })) }));
      checkCssRules(rules, file, add, state);
    }
  }
}

// ---------------------------------------------------------------- review format (Markdown)

// Returns true when the file was read as a review.
function checkReview(text, file, add) {
  const lines = text.split("\n");
  let fenced = false;
  const live = lines.map((l) => {
    if (/^\s*(```|~~~)/.test(l)) { fenced = !fenced; return ""; }
    return fenced ? "" : l;
  });
  const cells = (l) => l.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/).map((c) => c.trim());
  const headerAt = live.findIndex((l) => /^\s*\|/.test(l) && ["before", "after", "why"].every((h) => cells(l).some((c) => c.toLowerCase() === h)));
  const verdictAt = live.findIndex((l) => /^\s*Verdict\b/.test(l));
  if (headerAt < 0 && verdictAt < 0 && !/review/i.test(basename(file))) return false;

  if (verdictAt < 0) add("review-verdict", file, lines.length, "no `Verdict:` line; end on Blocked, Approve with changes or Ship it");
  else if (!/^\s*Verdict:\s*(Blocked|Approve with changes|Ship it)\b/.test(live[verdictAt])) add("review-verdict", file, verdictAt + 1, `\`${live[verdictAt].trim()}\` is not Blocked, Approve with changes or Ship it`);
  if (!live.some((l) => /^\s*Not checked:\s*\S/.test(l))) add("review-not-checked", file, lines.length, "no `Not checked:` line naming the themes, widths and devices the review did not see");

  if (headerAt >= 0) {
    const head = cells(live[headerAt]).map((c) => c.toLowerCase());
    const bi = head.indexOf("before"), wi = head.indexOf("why");
    for (let i = headerAt + 2; i < live.length && /^\s*\|/.test(live[i]); i++) {
      const row = cells(live[i]);
      if (!row[wi]) add("review-no-why", file, i + 1, "a row with no Why; one sentence, ending on the lane that owns the rule");
      if (row[bi] !== undefined && !/`[^`]+`/.test(row[bi])) add("review-paraphrase", file, i + 1, `Before \`${row[bi].slice(0, 60)}\` quotes no code; quote the real line`);
    }
  }
  return true;
}

// ---------------------------------------------------------------- scan a file set

const UI_EXT = new Set([".css", ".html", ".htm", ".jsx", ".tsx"]);
const SKIP_DIR = new Set(["node_modules", ".git", "dist", "build", ".next", "out", "coverage"]);

function scanSet(files) {
  const findings = [];
  const notChecked = [];
  const scanned = [];
  const state = { motion: [], reducedBranch: false, outlineOff: [], focusBases: [], inputSizes: [] };
  const seen = new Set();
  const add = (line, file, lineNumber, detail) => {
    const key = `${line}|${file}|${lineNumber}|${detail}`;
    if (seen.has(key)) return;
    seen.add(key);
    findings.push({ line, file, lineNumber, detail, class: LINES[line][0] });
  };

  for (const f of files) {
    const ext = extname(f.path).toLowerCase();
    const text = f.text.replace(/\r\n/g, "\n");
    if (ext === ".css") {
      checkCssRules(parseCss(text), f.path, add, state);
      scanned.push(f.path);
    } else if (ext === ".html" || ext === ".htm") {
      const noComments = text.replace(/<!--[\s\S]*?-->/g, blank);
      let css = "";
      let last = 0;
      const markup = noComments.replace(/(<style\b[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, open, body, close, offset) => {
        css += blank(noComments.slice(last, offset + open.length)) + body;
        last = offset + open.length + body.length;
        return open + blank(body) + close;
      }).replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (m, open, body, close) => open + blank(body) + close);
      if (css) checkCssRules(parseCss(css), f.path, add, state);
      checkMarkup(markup, f.path, add, state, false);
      scanned.push(f.path);
    } else if (ext === ".jsx" || ext === ".tsx") {
      const code = text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^[ \t]*\/\/.*$/gm, blank);
      checkMarkup(code, f.path, add, state, true);
      scanned.push(f.path);
    } else if (ext === ".md") {
      if (checkReview(text, f.path, add)) scanned.push(f.path);
      else notChecked.push(`${f.path}: no Before | After | Why table and no Verdict line, so it was not read as a review`);
    }
  }
  resolveSetChecks(state, add);

  findings.sort((a, b) => (a.class === b.class ? 0 : a.class === NEVER ? -1 : 1) || a.file.localeCompare(b.file) || a.lineNumber - b.lineNumber || a.line.localeCompare(b.line));
  return { findings, files: scanned, notChecked };
}

function collect(paths, cwd) {
  const out = [];
  const missing = [];
  const rel = (p) => relative(cwd, p).replace(/\\/g, "/") || basename(p);
  const walk = (p) => {
    const st = statSync(p);
    if (st.isDirectory()) {
      for (const name of readdirSync(p).sort()) if (!SKIP_DIR.has(name)) walk(join(p, name));
    } else if (UI_EXT.has(extname(p).toLowerCase()) || extname(p).toLowerCase() === ".md") {
      out.push({ path: rel(p), text: readFileSync(p, "utf8") });
    }
  };
  for (const p of paths) {
    const abs = resolve(cwd, p);
    if (!existsSync(abs)) { missing.push(p); continue; }
    walk(abs);
  }
  return { files: out, missing };
}

const counts = (findings, cls) => {
  const by = {};
  for (const f of findings) if (f.class === cls) by[f.line] = (by[f.line] || 0) + 1;
  return by;
};
const countText = (by) => {
  const total = Object.values(by).reduce((a, b) => a + b, 0);
  return total ? `${total} (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(", ")})` : "0";
};

// ---------------------------------------------------------------- self-test

function selfTest() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const rel = (p) => relative(root, p).replace(/\\/g, "/");
  let failed = 0;
  let total = 0;
  const tested = new Set();
  const check = (ok, what) => {
    total++;
    if (!ok) failed++;
    console.log(`${ok ? "ok  " : "FAIL"} ${what}`);
  };
  const read = (p) => collect([p], root).files;
  const names = (res, cls) => [...new Set(res.findings.filter((f) => !cls || f.class === cls).map((f) => f.line))];

  // 1. Every gold example passes with nothing to report.
  const examples = join(root, "examples");
  const exampleEntries = existsSync(examples) ? readdirSync(examples).sort() : [];
  check(exampleEntries.length >= 3, `examples/ holds at least 3 gold examples (${exampleEntries.length})`);
  for (const entry of exampleEntries) {
    const res = scanSet(read(join(examples, entry)));
    const never = res.findings.filter((f) => f.class === NEVER);
    const cand = res.findings.filter((f) => f.class === CANDIDATE);
    check(res.files.length > 0, `examples/${entry} was scanned (${res.files.length} file${res.files.length === 1 ? "" : "s"})`);
    check(never.length === 0, `examples/${entry} raises no never-intentional line${never.length ? `: ${never.map((f) => `${f.line} ${f.file}:${f.lineNumber}`).join("; ")}` : ""}`);
    check(cand.length === 0, `examples/${entry} raises no candidate line${cand.length ? `: ${cand.map((f) => `${f.line} ${f.file}:${f.lineNumber}`).join("; ")}` : ""}`);
  }

  // 2. Every teaching pair: bad raises the line its folder is named for, and only that one; good raises none.
  const teaching = join(root, "teaching");
  const pairs = existsSync(teaching) ? readdirSync(teaching).filter((d) => statSync(join(teaching, d)).isDirectory()).sort() : [];
  check(pairs.length >= 8, `teaching/ holds at least 8 pairs (${pairs.length})`);
  for (const name of pairs) {
    const dir = join(teaching, name);
    const bad = readdirSync(dir).find((f) => /^bad\./.test(f));
    const good = readdirSync(dir).find((f) => /^good\./.test(f));
    check(name in LINES, `teaching/${name} is named for a gate line`);
    check(Boolean(bad && good), `teaching/${name} has bad and good`);
    if (!bad || !good || !(name in LINES)) continue;
    tested.add(name);
    const b = scanSet(read(join(dir, bad)));
    const g = scanSet(read(join(dir, good)));
    check(names(b).includes(name), `teaching/${name}/${bad} raises ${name}:`);
    const otherNever = names(b, NEVER).filter((n) => n !== name);
    check(otherNever.length === 0, `teaching/${name}/${bad} has one thing wrong${otherNever.length ? ` (also raises ${otherNever.join(", ")})` : ""}`);
    check(!names(g).includes(name), `teaching/${name}/${good} does not raise ${name}:`);
    check(names(g, NEVER).length === 0, `teaching/${name}/${good} raises no never-intentional line${names(g, NEVER).length ? ` (${names(g, NEVER).join(", ")})` : ""}`);
    const first = readFileSync(join(dir, bad), "utf8").split("\n")[0];
    check(/^(\/\*|\/\/|<!--)/.test(first.trim()), `teaching/${name}/${bad} opens with a comment naming the failure`);
  }

  // 3. Lines with no pair: one failing and one passing snippet each.
  const reduce = "@media (prefers-reduced-motion: reduce) { .a { transition: none; } }";
  const inline = [
    ["positive-tabindex", "x.html", '<div tabindex="3">Row</div>', '<div tabindex="0">Row</div>'],
    ["motion-kill-switch", "x.css", "@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; } }", "@media (prefers-reduced-motion: reduce) { .modal { transform: none; transition: opacity 120ms; } }"],
    ["review-not-checked", "review.md", "| Before | After | Why |\n|---|---|---|\n| `a` | `b` | Because. |\n\nVerdict: Blocked\n", "| Before | After | Why |\n|---|---|---|\n| `a` | `b` | Because. |\n\nVerdict: Blocked\nNot checked: dark theme.\n"],
    ["review-no-why", "review.md", "| Before | After | Why |\n|---|---|---|\n| `a` | `b` | |\n\nVerdict: Blocked\nNot checked: 390px.\n", "| Before | After | Why |\n|---|---|---|\n| `a` | `b` | Because. |\n\nVerdict: Blocked\nNot checked: 390px.\n"],
    ["review-paraphrase", "review.md", "| Before | After | Why |\n|---|---|---|\n| the slow modal | `b` | Because. |\n\nVerdict: Ship it\nNot checked: 390px.\n", "| Before | After | Why |\n|---|---|---|\n| `a` | `b` | Because. |\n\nVerdict: Ship it\nNot checked: 390px.\n"],
    ["ungated-hover-paint", "x.css", ".row:hover { background: rgba(0,0,0,0.04); }", "@media (hover: hover) and (pointer: fine) { .row:hover { background: rgba(0,0,0,0.04); } }"],
    ["hover-gate-pointer", "x.css", "@media (hover: hover) { .row:hover { background: rgba(0,0,0,0.04); } }", "@media (hover: hover) and (pointer: fine) { .row:hover { background: rgba(0,0,0,0.04); } }"],
    ["tailwind-hover-motion", "x.tsx", 'export const A = () => <a className="block hover:scale-105" href="/x">Open</a>;', 'export const A = () => <a className="block hover:bg-black/5" href="/x">Open</a>;'],
    ["bare-transition", "x.tsx", 'export const A = () => <a className="transition duration-150 bg-white" href="/x">Open</a>;', 'export const A = () => <a className="transition-colors duration-150 bg-white" href="/x">Open</a>;'],
    ["z-index-literal", "x.css", ".menu { z-index: 50; }", ".menu { z-index: var(--z-dropdown); }"],
    ["default-shadow", "x.css", ".card { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }", ".card { box-shadow: 0 1px 1px rgba(17,17,17,.04), 0 2px 4px rgba(17,17,17,.04); }"],
    ["pure-black", "x.css", ".page { background: #000; }", ".page { background: #18181b; }"],
    ["gradient-text", "x.css", ".h { -webkit-background-clip: text; }", ".h { color: #262628; }"],
    ["generated-purple", "x.css", ".hero { background: #6366f1; }", ".hero { background: #f6f5f4; }"],
    ["tracked-caps", "x.css", ".eyebrow { text-transform: uppercase; letter-spacing: 0.12em; }", ".label { letter-spacing: 0; }"],
    ["looping-attention", "x.tsx", 'export const A = () => <span className="animate-bounce motion-reduce:animate-none">New</span>;', 'export const A = () => <span className="text-sm">New</span>;'],
    ["viewport-100vh", "x.css", ".shell { height: 100vh; }", ".shell { height: 100dvh; }"],
    ["env-no-fallback", "x.css", ".pay { padding-bottom: calc(12px + env(safe-area-inset-bottom)); }", ".pay { padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)); }"],
    ["disabled-opacity", "x.css", ".btn:disabled { opacity: 0.5; }", ".btn:disabled { color: var(--color-text-disabled); }"],
    ["div-onclick", "x.tsx", "export const A = () => <div onClick={save}>Save</div>;", 'export const A = () => <button type="button" onClick={save}>Save</button>;'],
    ["mounted-live-region", "x.tsx", 'export const A = ({ msg }) => <>{msg && <div role="status">{msg}</div>}</>;', 'export const A = ({ msg }) => <div role="status">{msg}</div>;'],
    ["submit-disabled-until-valid", "x.tsx", 'export const A = () => <button type="submit" disabled={!isValid}>Create account</button>;', 'export const A = () => <button type="submit">Create account</button>;'],
    ["placeholder-data", "x.html", "<p>John Doe</p>", "<p>Jon Park</p>"],
    ["ease-in", "bezier.css", `.a { transition: opacity 150ms cubic-bezier(0.4, 0, 1, 1); } ${reduce}`, `.a { transition: opacity 150ms cubic-bezier(0.23, 1, 0.32, 1); } ${reduce}`],
    ["scale-from-zero", "motion.tsx", "export const A = () => <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} />; useReducedMotion();", "export const A = () => <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} />; useReducedMotion();"],
    ["outline-none", "tw.tsx", 'export const A = () => <button type="button" className="outline-none px-3">Save</button>;', 'export const A = () => <button type="button" className="outline-none focus-visible:ring-2 px-3">Save</button>;'],
    ["small-input", "tw.html", '<input type="email" class="text-sm border">', '<input type="email" class="text-base md:text-sm border">'],
    ["magic-z-index", "tw.tsx", "export const A = () => <div style={{ zIndex: 9999 }} />;", "export const A = () => <div style={{ zIndex: 1 }} />;"],
  ];
  for (const [line, file, bad, good] of inline) {
    tested.add(line);
    const b = scanSet([{ path: file, text: bad }]);
    const g = scanSet([{ path: file, text: good }]);
    check(names(b).includes(line), `inline ${file}: the failing snippet raises ${line}:`);
    check(!names(g).includes(line), `inline ${file}: the passing snippet does not raise ${line}:`);
  }

  // 4. Every line the gate can print has a test, and the gate's own states hold.
  for (const line of Object.keys(LINES)) check(tested.has(line), `${line}: has a test`);
  check(scanSet([]).files.length === 0, "an empty file set scans nothing, so the gate says inconclusive");
  const set = scanSet([{ path: "a.css", text: ".a { transition: transform 200ms; }" }, { path: "b.css", text: reduce }]);
  check(!names(set).includes("no-reduced-motion"), "a reduced-motion branch anywhere in the set clears no-reduced-motion:");

  console.log(`\n${total - failed} of ${total} assertions passed.`);
  console.log(failed ? `${GATE} self-test FAILED` : `${GATE} self-test passed`);
  process.exit(failed ? 1 : 0);
}

// ---------------------------------------------------------------- main

function main() {
  const argv = process.argv.slice(2);
  const flags = { gate: false, strict: false, selfTest: false, help: false, report: null };
  const paths = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--gate") flags.gate = true;
    else if (a === "--strict") flags.strict = true;
    else if (a === "--self-test") flags.selfTest = true;
    else if (a === "--help" || a === "-h") flags.help = true;
    else if (a === "--report") flags.report = argv[++i] || null;
    else if (a.startsWith("--")) { console.error(`${GATE}: unknown flag ${a}. See --help.`); process.exit(2); }
    else paths.push(a);
  }
  if (flags.help) { console.log(HELP); return; }
  if (flags.selfTest) return selfTest();

  const cwd = process.cwd();
  const { files, missing } = collect(paths, cwd);
  const result = scanSet(files);
  const notChecked = [...missing.map((m) => `${m}: not found`), ...result.notChecked, ...NOT_CHECKED];

  for (const f of result.findings) console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`);
  if (result.findings.length) console.log("");

  const never = counts(result.findings, NEVER);
  const cand = counts(result.findings, CANDIDATE);
  const neverTotal = Object.values(never).reduce((a, b) => a + b, 0);
  const candTotal = Object.values(cand).reduce((a, b) => a + b, 0);

  let status, exitCode, reason = "";
  if (!paths.length) { status = "inconclusive"; exitCode = 2; reason = "no files or folders given"; }
  else if (missing.length) { status = "inconclusive"; exitCode = 2; reason = `not found: ${missing.join(", ")}`; }
  else if (!result.files.length) { status = "inconclusive"; exitCode = 2; reason = "nothing to scan: no .css, .html, .jsx or .tsx file and no review"; }
  else if (neverTotal > 0 && (flags.gate || flags.strict)) { status = "failed"; exitCode = 1; }
  else if (candTotal > 0 && flags.strict) { status = "failed"; exitCode = 1; }
  else if (neverTotal > 0) { status = "failed"; exitCode = 0; }
  else { status = "passed"; exitCode = 0; }

  console.log(`files scanned: ${result.files.length}`);
  console.log(`never-intentional: ${countText(never)}`);
  console.log(`candidates: ${countText(cand)}`);
  for (const n of [...missing.map((m) => `${m}: not found`), ...result.notChecked]) console.log(`not checked: ${n}`);
  console.log(`not checked by any run: feel, taste, rendered pixels, missing states, keyboard reach, devices (see --help)`);
  console.log(NECESSARY);

  if (flags.report) {
    const out = resolve(cwd, flags.report);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, `${JSON.stringify({ status, exitCode, files: result.files, findings: result.findings, notChecked }, null, 2)}\n`);
    console.log(`report: ${relative(cwd, out).replace(/\\/g, "/")}`);
  }

  if (flags.gate) {
    if (status === "inconclusive") console.log(`${GATE} inconclusive: ${reason}`);
    else console.log(status === "passed" ? `${GATE} passed` : `${GATE} failed`);
  } else if (status === "inconclusive") {
    console.log(`inconclusive: ${reason}`);
  }
  process.exit(exitCode);
}

main();
