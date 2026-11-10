#!/usr/bin/env node
// token-check: compares a design contract (a .design file or a DESIGN.md)
// with the source that consumes it and names every drift as a line.
//
//   node scripts/token-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]
//
// Zero dependencies. Node 20+. It reads text; it never renders anything.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GATE = 'token-check';

// Lines that are never intentional: the gate fails on any of them.
const NEVER = {
  'raw-color': 'a color literal in source that is not a token in the contract',
  'raw-font': 'a font family in source that the contract does not define',
  'literal-beside-token': 'a literal whose value an existing token already holds',
  'unknown-token': 'a var(--x) or {token.ref} that nothing defines',
  'unknown-variant': 'a variant used or documented that the contract does not list',
  'stale-mirror': 'a custom property named for a token and holding a different value',
  'contract-invalid': 'a contract missing a field it requires of itself',
  'two-contracts': 'two contracts side by side with no stated precedence',
  'in-file-changelog': 'proposed_changes or a changelog inside a .design',
  'open-variant-set': 'a documented variant list that is not closed',
  'hedge-word': 'a hedge word in a design-system doc page',
};

// Candidate lines: reported for judgment, each one answered in TOKENS.md.
const CANDIDATE = {
  'unused-token': 'a contract token no checked source uses',
  'off-scale': 'a literal of a kind the contract has a scale for, on no step of it',
  'local-token': 'a custom property declared in source that the contract does not define',
  'noted-literal': 'a literal left in place with a token-missing note, under invent_with_note',
  'contracts-differ': 'a DESIGN.md color the .design beside it does not hold',
  'no-default': 'a documented variant list that names no default',
  'no-example': 'a documented component with no Correct and Incorrect pair',
};

const NOT_CHECKED = [
  'whether a token is bound to the right role (a surface token on a border passes)',
  'utility classes resolved through a Tailwind theme, beyond arbitrary values in [brackets]',
  'values built at runtime or passed through props and variables',
  'themed overrides inside dark, light or data-theme blocks',
  'contrast, the rendered result, and whether the screen matches the product',
  'whether a locked path was edited, or version was bumped: that needs git',
  'voice, decisions and when / when_not rules in the contract',
  'whether a doc page is true to the code beyond its variant names',
  'files other than .css, .html, .htm, .jsx, .tsx and .md',
];

const HELP = `${GATE}: drift between a design contract and the source that consumes it.

Usage:
  node scripts/token-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]

It takes a contract (a .design or <name>.design file, YAML or JSON, or a DESIGN.md
with token front matter) and source files (.css, .html, .jsx, .tsx, and .md doc
pages). The contract for a file is the nearest one walking up from it; a DESIGN.md
is also found in docs/, design/ or .design/ at each level. A folder
that holds both bad.* and good.* is checked as two halves.

Each finding prints as  <line>: <what and where> (<file>:<line>)

Never intentional (the gate fails on any):
${Object.entries(NEVER).map(([k, v]) => `  ${`${k}:`.padEnd(22)} ${v}`).join('\n')}

Candidates (judge each one):
${Object.entries(CANDIDATE).map(([k, v]) => `  ${`${k}:`.padEnd(22)} ${v}`).join('\n')}

Flags:
  --gate       end with "${GATE} passed" and exit 0 only when every never-intentional
               line is at 0; otherwise print the counts and exit 1
  --strict     with the gate, candidates fail it too
  --report f   write { status, exitCode, files, findings, notChecked } as JSON
  --self-test  prove the gate on examples/ and teaching/ beside this script
  --help       this text

Exit codes: 0 passed, 1 failed, 2 inconclusive (no input, no contract, a contract
it could not read, a contract with no tokens, or no source beside the contract).

Not checked by the gate:
${NOT_CHECKED.map((s) => `  - ${s}`).join('\n')}

passing is necessary, not sufficient`;

// ---- Small helpers ----------------------------------------------------------

const read = (p) => readFileSync(p, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
const show = (p) => { const r = relative(process.cwd(), p); return (!r || r.startsWith('..') ? p : r).replace(/\\/g, '/'); };
const kebab = (s) => String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/[_\s.]+/g, '-').toLowerCase();
const lineAt = (text, offset) => {
  let n = 1;
  for (let i = 0; i < offset && i < text.length; i++) if (text[i] === '\n') n++;
  return n;
};
const round = (n) => Math.round(n * 1000) / 1000;
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---- YAML subset ------------------------------------------------------------
// Nested maps, block and flow lists, flow maps, quoted and plain scalars, block
// scalars and comments: what a .design file and DESIGN.md front matter use.
// Anchors, tags and multi-line flow values are refused, never guessed at.

function stripComment(s) {
  let q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === q && s[i - 1] !== '\\') q = null; continue; }
    if (c === '"' || c === "'") { q = c; continue; }
    if (c === '#' && (i === 0 || /\s/.test(s[i - 1]))) return s.slice(0, i);
  }
  return s;
}

function parseYaml(src, lineOffset = 0) {
  const L = src.split('\n');
  const locs = new Map();
  let i = 0;
  const fail = (msg) => { throw new Error(`${msg} (line ${i + 1 + lineOffset})`); };
  const blank = (s) => /^\s*(#.*)?$/.test(s);
  const ind = (s) => s.length - s.trimStart().length;
  const skip = () => { while (i < L.length && blank(L[i])) i++; };
  const isItem = (s) => /^\s*-(\s|$)/.test(s);

  function flow(t) {
    let p = 0;
    const ws = () => { while (p < t.length && /\s/.test(t[p])) p++; };
    const quoted = () => {
      const q = t[p];
      let e = p + 1;
      while (e < t.length && (t[e] !== q || t[e - 1] === '\\')) e++;
      if (e >= t.length) fail('unclosed quote');
      const s = t.slice(p, e + 1);
      p = e + 1;
      return scalar(s);
    };
    function val() {
      ws();
      if (t[p] === '[') {
        p++;
        const a = [];
        for (;;) {
          ws();
          if (t[p] === ']') { p++; return a; }
          a.push(val());
          ws();
          if (t[p] === ',') { p++; continue; }
          if (t[p] === ']') { p++; return a; }
          fail('a flow list that does not close on its own line');
        }
      }
      if (t[p] === '{') {
        p++;
        const o = {};
        for (;;) {
          ws();
          if (t[p] === '}') { p++; return o; }
          let k;
          if (t[p] === '"' || t[p] === "'") k = String(quoted());
          else { let e = p; while (e < t.length && t[e] !== ':') e++; k = t.slice(p, e).trim(); p = e; }
          ws();
          if (t[p] !== ':') fail('a flow map that does not close on its own line');
          p++;
          o[k] = val();
          ws();
          if (t[p] === ',') { p++; continue; }
          if (t[p] === '}') { p++; return o; }
          fail('a flow map that does not close on its own line');
        }
      }
      if (t[p] === '"' || t[p] === "'") return quoted();
      let e = p;
      let par = 0;
      while (e < t.length) {
        const c = t[e];
        if (c === '(') par++;
        else if (c === ')') par--;
        else if (par <= 0 && (c === ',' || c === ']' || c === '}')) break;
        e++;
      }
      const s = t.slice(p, e);
      p = e;
      return scalar(s);
    }
    const v = val();
    ws();
    if (p < t.length) fail('text after a flow value');
    return v;
  }

  function scalar(t) {
    t = t.trim();
    if (t === '' || t === '~' || t === 'null') return null;
    if (t[0] === '&' || t[0] === '*' || t[0] === '!') fail('anchors and tags are not read');
    if (t[0] === '"') { try { return JSON.parse(t); } catch { return t.slice(1, -1); } }
    if (t[0] === "'") return t.slice(1, -1).replace(/''/g, "'");
    if (t[0] === '[' || t[0] === '{') return flow(t);
    if (t === 'true') return true;
    if (t === 'false') return false;
    if (/^-?(\d+\.?\d*|\.\d+)$/.test(t)) return Number(t);
    return t;
  }

  function blockScalar(n, style) {
    const out = [];
    let own = null;
    while (i < L.length && (L[i].trim() === '' || ind(L[i]) > n)) {
      if (own === null && L[i].trim() !== '') own = ind(L[i]);
      out.push(L[i].trim() === '' ? '' : L[i].slice(own ?? 0));
      i++;
    }
    return out.join(style === '|' ? '\n' : ' ').trim();
  }

  function node(minInd, path) {
    skip();
    if (i >= L.length || ind(L[i]) < minInd) return null;
    return isItem(L[i]) ? seq(ind(L[i]), path) : map(ind(L[i]), path);
  }

  function map(n, path) {
    const o = {};
    for (;;) {
      skip();
      if (i >= L.length) break;
      const cur = ind(L[i]);
      if (cur < n) break;
      if (cur > n) fail('unexpected indent');
      if (/\t/.test(L[i].slice(0, cur + 1))) fail('tab indentation');
      const line = stripComment(L[i]).trimEnd().slice(n);
      const m = line.match(/^("(?:[^"\\]|\\.)*"|'[^']*'|[^\s:#'"-][^:]*?|-[^\s:][^:]*?)\s*:(?:\s+(.*))?$/);
      if (!m) fail('expected "key: value"');
      const k = String(/^["']/.test(m[1]) ? scalar(m[1]) : m[1]);
      const p = path ? `${path}.${k}` : k;
      locs.set(p, i + 1 + lineOffset);
      const rest = (m[2] ?? '').trim();
      i++;
      if (rest === '') {
        skip();
        if (i < L.length && ind(L[i]) === n && isItem(L[i])) o[k] = seq(n, p);
        else o[k] = node(n + 1, p);
      } else if (/^[|>][+-]?$/.test(rest)) o[k] = blockScalar(n, rest[0]);
      else o[k] = scalar(rest);
    }
    return o;
  }

  function seq(n, path) {
    const a = [];
    for (;;) {
      skip();
      if (i >= L.length) break;
      const cur = ind(L[i]);
      if (cur > n) fail('unexpected indent');
      if (cur < n || !isItem(L[i])) break;
      const after = stripComment(L[i]).trimEnd().slice(n + 1);
      const item = after.trim();
      const p = `${path}.${a.length}`;
      if (item === '') { i++; a.push(node(n + 1, p)); }
      else if (/^("[^"]*"|'[^']*'|[^\s:#'"[{][^:]*?)\s*:(\s|$)/.test(item)) {
        const pad = n + 1 + (after.length - after.trimStart().length);
        L[i] = ' '.repeat(pad) + item;
        a.push(map(pad, p));
      } else { i++; a.push(scalar(item)); }
    }
    return a;
  }

  skip();
  if (i < L.length && /^---\s*$/.test(L[i])) i++;
  const value = node(0, '');
  skip();
  if (i < L.length) fail('could not read past this line');
  if (!isObj(value)) throw new Error('the contract is not a map of fields');
  return { value, locs };
}

// ---- Values -----------------------------------------------------------------

const NAMED = new Map([['white', 'rgba(255,255,255,1)'], ['black', 'rgba(0,0,0,1)']]);
for (const n of ['red', 'green', 'blue', 'gray', 'grey', 'orange', 'yellow', 'purple', 'pink', 'silver', 'navy', 'teal', 'indigo', 'violet']) NAMED.set(n, `named:${n}`);

const COLOR_RE = /(?<![\w&])(?<!url\()#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\([^()]*\)|\bcolor\([^()]*\)/g;
const COLOR_PROP = /^(color|background|background-color|border|border-(top|right|bottom|left|block|inline)(-(start|end))?(-color)?|border-color|outline|outline-color|fill|stroke|box-shadow|text-shadow|caret-color|accent-color|text-decoration|text-decoration-color|column-rule|column-rule-color)$/;
const LENGTH_RE = /(?<![\w.#-])(\d*\.?\d+)(px|rem)\b/g;
const TIME_RE = /(?<![\w.#-])(\d*\.?\d+)(ms|s)\b/g;
const BEZIER_RE = /cubic-bezier\([^)]*\)/g;
const GENERIC_FONT = /^(inherit|initial|unset|revert|system-ui|sans-serif|serif|monospace|cursive|fantasy|ui-[a-z-]+|-apple-system|blinkmacsystemfont|emoji|math)$/;

function normColor(s) {
  s = String(s).trim().toLowerCase();
  let m;
  if ((m = s.match(/^#([0-9a-f]{3,8})$/))) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    if (h.length !== 6 && h.length !== 8) return null;
    const ch = [0, 2, 4].map((o) => parseInt(h.slice(o, o + 2), 16));
    const a = h.length === 8 ? parseInt(h.slice(6), 16) / 255 : 1;
    return `rgba(${ch.join(',')},${round(a)})`;
  }
  if ((m = s.match(/^rgba?\(([^)]*)\)$/))) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean);
    if (p.length < 3) return null;
    const ch = p.slice(0, 3).map((v) => (v.endsWith('%') ? Math.round(parseFloat(v) * 2.55) : Math.round(parseFloat(v))));
    const a = p[3] === undefined ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3]);
    if (ch.some(Number.isNaN) || Number.isNaN(a)) return null;
    return `rgba(${ch.join(',')},${round(a)})`;
  }
  if (/^(hsla?|oklch|oklab|lab|lch|hwb|color)\([^()]*\)$/.test(s)) return s.replace(/\s+/g, ' ').replace(/\s*([,/()])\s*/g, '$1');
  return NAMED.get(s) ?? null;
}
const toPx = (v) => {
  if (typeof v === 'number') return v;
  const m = String(v).trim().match(/^(-?\d*\.?\d+)(px|rem)?$/);
  return m ? round(parseFloat(m[1]) * (m[2] === 'rem' ? 16 : 1)) : null;
};
const toMs = (v) => {
  if (typeof v === 'number') return v;
  const m = String(v).trim().match(/^(\d*\.?\d+)(ms|s)$/);
  return m ? round(parseFloat(m[1]) * (m[2] === 's' ? 1000 : 1)) : null;
};
const firstFamily = (v) => {
  const s = Array.isArray(v) ? String(v[0] ?? '') : String(v).split(',')[0];
  return s.trim().replace(/^["']|["']$/g, '').toLowerCase();
};
const squash = (v) => String(Array.isArray(v) ? v.join(',') : v).replace(/["'\s]/g, '').toLowerCase();

// One comparable key for a contract token, by its kind.
function tokenKey(t) {
  const v = t.value;
  if (t.kind === 'color') { const c = normColor(v); return c ? `c:${c}` : `s:${squash(v)}`; }
  if (t.kind === 'radius' || t.kind === 'spacing' || t.kind === 'fontSize') { const p = toPx(v); return p === null ? `s:${squash(v)}` : `l:${p}`; }
  if (t.kind === 'duration') { const d = toMs(v); return d === null ? `s:${squash(v)}` : `t:${d}`; }
  if (t.kind === 'fontFamily') return `f:${firstFamily(v)}`;
  return `s:${squash(v)}`;
}
// The same key for a literal found in source, read the way that token is read.
function literalKey(value, kind) {
  const v = value.trim();
  if (kind === 'fontFamily') return `f:${firstFamily(v)}`;
  if (kind === 'duration' && toMs(v) !== null) return `t:${toMs(v)}`;
  if ((kind === 'radius' || kind === 'spacing' || kind === 'fontSize') && toPx(v) !== null) return `l:${toPx(v)}`;
  const c = normColor(v);
  if (c) return `c:${c}`;
  if (!kind && /^\d*\.?\d+(px|rem)$/.test(v)) return `l:${toPx(v)}`;
  if (!kind && /^\d*\.?\d+(ms|s)$/.test(v)) return `t:${toMs(v)}`;
  return `s:${squash(v)}`;
}

// ---- Contracts --------------------------------------------------------------

const TYPO_FIELDS = { fontFamily: ['font', 'font-family'], fontSize: ['text', 'font-size', 'size'], lineHeight: ['leading', 'line-height'], fontWeight: ['font-weight', 'weight'], letterSpacing: ['tracking', 'letter-spacing'] };
const SYNONYMS = [['color', 'colors', 'colour', 'colours'], ['radius', 'rounded', 'radii'], ['spacing', 'space'], ['elevation', 'shadow'], ['duration', 'durations', 'dur'], ['easing', 'ease']];
const synOf = (seg) => SYNONYMS.find((g) => g.includes(seg)) ?? [seg];

function kindOf(path, value) {
  const p = path.map((s) => s.toLowerCase());
  const leaf = path[path.length - 1];
  if (TYPO_FIELDS[leaf] && path.length >= 2) return leaf;
  if (/^colou?rs?$/.test(p[0])) return 'color';
  if (/^(radius|radii|rounded)$/.test(p[0])) return 'radius';
  if (/^(spacing|space)$/.test(p[0])) return 'spacing';
  if (p.some((s) => /^durations?$/.test(s))) return 'duration';
  if (p.some((s) => /^(easing|ease)$/.test(s))) return 'easing';
  if (typeof value === 'string') {
    if (normColor(value)) return 'color';
    if (/^\d*\.?\d+(ms|s)$/.test(value.trim())) return 'duration';
    if (/^cubic-bezier\(/.test(value.trim())) return 'easing';
  }
  return 'other';
}

// Every custom-property name that counts as this token.
function namesFor(path, kind) {
  const segs = path.map(kebab);
  const out = new Set([segs.join('-')]);
  if (TYPO_FIELDS[kind]) {
    const entry = segs.slice(1, -1).join('-') || segs[0];
    for (const pre of TYPO_FIELDS[kind]) { out.add(`${pre}-${entry}`); out.add(`${entry}-${pre}`); }
    out.add(`${entry}-${segs[segs.length - 1]}`);
    return out;
  }
  if (kind === 'duration' || kind === 'easing') {
    const at = segs.findIndex((s) => synOf(s).length > 1 && (synOf(s)[0] === 'duration' || synOf(s)[0] === 'easing'));
    const rest = at >= 0 ? segs.slice(at + 1) : segs.slice(1);
    for (const s of synOf(kind)) out.add([s, ...rest].join('-'));
    return out;
  }
  const rest = segs.slice(1);
  for (const s of synOf(segs[0])) out.add([s, ...rest].join('-'));
  if (kind === 'color' && rest.length) out.add(rest.join('-'));
  if (kind === 'other' && rest.length >= 2) out.add(rest.join('-'));
  return out;
}

function flatten(obj, path, locs, locPrefix, file, out) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const p = [...path, k];
    if (isObj(v)) { flatten(v, p, locs, locPrefix, file, out); continue; }
    if (v === null) continue;
    const kind = kindOf(p, v);
    const label = p.join('.');
    out.push({ path: p, label, value: v, kind, names: namesFor(p, kind), file, line: locs.get(locPrefix + label) ?? 1, group: TYPO_FIELDS[kind] ? p.slice(0, -1).join('.') : label });
  }
  return out;
}

const findKeyLine = (text, key) => {
  const at = text.search(new RegExp(`["']?${esc(key)}["']?\\s*:`));
  return at < 0 ? 1 : lineAt(text, at);
};

function loadDesign(file, seen = []) {
  const text = read(file);
  let value;
  let locs = new Map();
  if (/^\s*\{/.test(text)) {
    value = JSON.parse(text);
    const walk = (o, p) => { for (const [k, v] of Object.entries(o)) { const q = p ? `${p}.${k}` : k; locs.set(q, findKeyLine(text, k)); if (isObj(v)) walk(v, q); } };
    if (isObj(value)) walk(value, '');
  } else ({ value, locs } = parseYaml(text));
  const contract = { type: 'design', file, text, value, locs, fileOf: new Map(), problems: [] };
  const parents = value.extends ? [].concat(value.extends) : [];
  for (const rel of parents.reverse()) {
    const target = resolve(dirname(file), String(rel));
    if (!existsSync(target) || seen.includes(target) || seen.length > 8) {
      contract.problems.push({ detail: `extends ${rel}, which ${existsSync(target) ? 'loops back on itself' : 'does not exist'}`, line: locs.get('extends') ?? 1 });
      continue;
    }
    const parent = loadDesign(target, [...seen, file]);
    const merge = (a, b) => { const o = { ...a }; for (const [k, v] of Object.entries(b)) o[k] = isObj(v) && isObj(a[k]) ? merge(a[k], v) : v; return o; };
    contract.value = merge(parent.value, contract.value);
    for (const [k, v] of parent.locs) if (!contract.locs.has(k)) { contract.locs.set(k, v); contract.fileOf.set(k, parent.fileOf.get(k) ?? parent.file); }
  }
  return contract;
}

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
  return m ? { yaml: m[1], body: text.slice(m[0].length), bodyLine: lineAt(text, m[0].length) } : null;
}
const TOKEN_GROUPS = ['colors', 'typography', 'rounded', 'spacing', 'components'];
const looksLikeDesignMd = (text) => { const fm = frontMatter(text); return !!fm && TOKEN_GROUPS.some((g) => new RegExp(`^${g}:`, 'm').test(fm.yaml)); };

function loadDesignMd(file) {
  const text = read(file);
  const fm = frontMatter(text);
  if (!fm) return { type: 'design-md', file, text, value: {}, locs: new Map(), fileOf: new Map(), problems: [{ detail: 'no token front matter between --- lines', line: 1 }] };
  const { value, locs } = parseYaml(fm.yaml, 1);
  return { type: 'design-md', file, text, value, locs, fileOf: new Map(), problems: [] };
}

// Tokens, components and the contract's own required fields.
function readContract(c, add) {
  const v = c.value;
  const at = (k) => c.locs.get(k) ?? 1;
  const bad = (detail, line = 1) => add('contract-invalid', detail, c.file, line);
  for (const p of c.problems) bad(p.detail, p.line);
  let tokenRoot;
  let prefix;
  if (c.type === 'design') {
    if (v.schema !== 'design.v1') bad(v.schema === undefined ? 'no schema field; it must read design.v1' : `schema is ${v.schema}; it must read design.v1`, at('schema'));
    if (!v.name) bad('no name field', at('name'));
    if (v.version === undefined || v.version === null) bad('no version field; every edit bumps it', at('version'));
    if (!isObj(v.agent) || !String(v.agent.instructions ?? '').trim()) bad('no agent.instructions; the file must work where no skill is installed', at('agent'));
    for (const k of ['proposed_changes', 'changelog']) if (k in v) add('in-file-changelog', `${k} sits inside the contract; edit in place, bump version, git is the audit trail`, c.file, at(k));
    tokenRoot = isObj(v.tokens) ? v.tokens : {};
    prefix = 'tokens.';
  } else {
    if (!c.problems.length && (v.version === undefined || v.version === null)) bad('no version field in the front matter', 2);
    tokenRoot = {};
    for (const [k, val] of Object.entries(v)) if (isObj(val) && k !== 'components') tokenRoot[k] = val;
    prefix = '';
  }
  c.tokens = flatten(tokenRoot, [], c.locs, prefix, c.file, []);
  for (const t of c.tokens) t.file = c.fileOf.get(prefix + t.label) ?? c.file;
  c.tokenRoot = tokenRoot;
  // Components: a closed variant set per component.
  c.variants = new Map();
  const comps = isObj(v.components) ? v.components : {};
  if (c.type === 'design') {
    for (const [name, def] of Object.entries(comps)) if (isObj(def) && Array.isArray(def.variants)) c.variants.set(kebab(name), new Set(def.variants.map(String)));
  } else {
    c.componentKeys = Object.keys(comps).map(kebab);
  }
  // {refs} inside components must resolve.
  const resolves = (ref) => {
    const tryPath = (root, segs) => segs.reduce((o, s) => (isObj(o) && s in o ? o[s] : undefined), root) !== undefined;
    const segs = ref.split('.');
    return tryPath(v, segs) || tryPath(tokenRoot, segs);
  };
  const walk = (o, p) => {
    for (const [k, val] of Object.entries(o)) {
      const q = `${p}.${k}`;
      if (isObj(val)) walk(val, q);
      else for (const s of [].concat(val)) for (const m of String(s).matchAll(/\{([\w$-]+(?:\.[\w$-]+)+)\}/g)) {
        if (!resolves(m[1])) add('unknown-token', `{${m[1]}} in ${q} resolves to nothing in the contract`, c.file, at(q));
      }
    }
  };
  walk(comps, 'components');
}

const variantKnown = (c, comp, variant) => {
  if (c.type === 'design') { const set = c.variants.get(comp); return set ? set.has(variant) : null; }
  const keys = c.componentKeys ?? [];
  if (!keys.some((k) => k.startsWith(`${comp}-`))) return null;
  return keys.includes(`${comp}-${variant}`) || keys.some((k) => k.startsWith(`${comp}-${variant}-`));
};
const variantList = (c, comp) => (c.type === 'design'
  ? [...(c.variants.get(comp) ?? [])]
  : [...new Set((c.componentKeys ?? []).filter((k) => k.startsWith(`${comp}-`)).map((k) => k.slice(comp.length + 1)))]);

// ---- Source scanning --------------------------------------------------------

const keepLines = (s) => s.replace(/[^\n]/g, ' ');
function stripComments(text, ext) {
  let t = text.replace(/\/\*[\s\S]*?\*\//g, keepLines);
  if (ext === '.html' || ext === '.htm' || ext === '.md') t = t.replace(/<!--[\s\S]*?-->/g, keepLines);
  if (ext === '.jsx' || ext === '.tsx') t = t.replace(/(^|[\s;{}(,])\/\/[^\n]*/g, (m, pre) => pre + keepLines(m.slice(pre.length)));
  return t;
}

// Declarations with the block they sit in. Splits only outside parentheses and strings.
function cssDecls(text, base = 0) {
  const out = [];
  const stack = [];
  let buf = '';
  let start = 0;
  let depth = 0;
  let quote = null;
  for (let i = 0; i <= text.length; i++) {
    const ch = i < text.length ? text[i] : ';';
    if (quote) { buf += ch; if (ch === quote && text[i - 1] !== '\\') quote = null; continue; }
    if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (depth === 0 && ch === '{') { stack.push(buf.trim()); buf = ''; start = i + 1; continue; }
    if (depth === 0 && (ch === ';' || ch === '}')) {
      const m = buf.match(/^\s*(--[\w-]+|[a-zA-Z-]+)\s*:\s*([\s\S]+?)\s*$/);
      if (m && !/^\s*@/.test(buf)) {
        const lead = buf.length - buf.trimStart().length;
        out.push({ prop: m[1].startsWith('--') ? m[1] : m[1].toLowerCase(), value: m[2].replace(/\s+/g, ' '), offset: base + start + lead, context: stack.join(' | ') });
      }
      buf = '';
      start = i + 1;
      if (ch === '}') stack.pop();
      continue;
    }
    buf += ch;
  }
  return out;
}

const ARBITRARY = [
  [/^rounded/, 'border-radius'], [/^(duration|delay)$/, 'transition-duration'], [/^ease$/, 'transition-timing-function'],
  [/^(p[xytrbl]?|m[xytrbl]?|gap(-[xy])?|space-[xy])$/, 'padding'], [/^font$/, 'font-family'],
];

function scanSource(file) {
  const ext = extname(file).toLowerCase();
  const raw = read(file);
  const text = stripComments(raw, ext);
  const s = { file, ext, raw, rawLines: raw.split('\n'), text, decls: [], varRefs: [], declared: new Set(), variants: [] };
  const push = (prop, value, offset, context = '') => s.decls.push({ prop, value, line: lineAt(text, offset), context });
  if (ext === '.css') for (const d of cssDecls(text)) push(d.prop, d.value, d.offset, d.context);
  else {
    for (const m of text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) for (const d of cssDecls(m[1], m.index + m[0].indexOf('>') + 1)) push(d.prop, d.value, d.offset, d.context);
    for (const m of text.matchAll(/\bstyle=(["'])([\s\S]*?)\1/g)) for (const d of cssDecls(m[2], m.index + 7)) push(d.prop, d.value, d.offset, 'style attribute');
    if (ext === '.jsx' || ext === '.tsx') {
      for (const m of text.matchAll(/`([^`]*)`/g)) if (/:[^;`]*;/.test(m[1])) for (const d of cssDecls(m[1], m.index + 1)) push(d.prop, d.value, d.offset, d.context || 'template literal');
      for (const m of text.matchAll(/\bstyle=\{\{([\s\S]*?)\}\}/g)) {
        for (const d of m[1].matchAll(/(['"]?)([\w-]+)\1\s*:\s*(?:(['"`])([^'"`]*)\3|(-?\d*\.?\d+)(?![\w.]))/g)) {
          const prop = d[2].startsWith('--') ? d[2] : kebab(d[2]);
          if (prop.startsWith('--')) { s.declared.add(prop); continue; }
          push(prop, d[4] ?? `${d[5]}px`, m.index + 8 + d.index, 'style object');
        }
      }
      for (const m of text.matchAll(/<([A-Z]\w*)\b[^<>]*?\bvariant=(["'])([^"']+)\2/g)) s.variants.push({ comp: kebab(m[1]), variant: m[3], line: lineAt(text, m.index) });
      for (const m of text.matchAll(/setProperty\(\s*(["'])(--[\w-]+)\1/g)) s.declared.add(m[2]);
    }
    // A quoted string that is nothing but a color: a prop, an SVG fill, a config value.
    for (const m of text.matchAll(/(["'])\s*(#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\([^"'()]*\))\s*\1/g)) {
      const from = text.lastIndexOf('\n', m.index) + 1;
      const to = text.indexOf('\n', m.index);
      const line = lineAt(text, m.index);
      if (/<meta\b/.test(text.slice(from, to < 0 ? text.length : to)) || s.decls.some((d) => d.line === line && d.value.includes(m[2]))) continue;
      push('color', m[2], m.index, 'quoted string');
    }
    // Arbitrary values in utility classes: rounded-[6px], text-[14px], bg-[#5b5bd6].
    for (const m of text.matchAll(/(?<![\w-])([a-z][a-z-]*)-\[([^\]\s]+)\]/g)) {
      const value = m[2].replace(/_/g, ' ');
      const hit = ARBITRARY.find(([re]) => re.test(m[1]));
      const prop = hit ? hit[1] : m[1] === 'text' && /^\d*\.?\d+(px|rem)$/.test(value) ? 'font-size' : 'color';
      push(prop, value, m.index, 'utility class');
    }
  }
  for (const d of s.decls) if (d.prop.startsWith('--')) s.declared.add(d.prop);
  for (const m of text.matchAll(/var\(\s*(--[\w-]+)/g)) s.varRefs.push({ name: m[1], line: lineAt(text, m.index) });
  return s;
}

const propKind = (prop) => {
  if (/^border(-[a-z]+)*-radius$/.test(prop)) return 'radius';
  if (prop === 'font-size') return 'fontSize';
  if (prop === 'font-family') return 'fontFamily';
  if (/^(transition|animation)(-duration|-delay)?$/.test(prop)) return 'duration';
  if (/^(transition|animation)-timing-function$/.test(prop)) return 'easing';
  if (/^(padding|margin)(-(top|right|bottom|left|block|inline)(-(start|end))?)?$/.test(prop) || /^((row|column)-)?gap$/.test(prop)) return 'spacing';
  return null;
};
const KIND_WORD = { radius: 'radius', fontSize: 'font size', spacing: 'spacing', duration: 'duration', easing: 'easing', fontFamily: 'font family' };
const THEMED = /\bdark\b|\blight\b|data-theme|prefers-color-scheme|prefers-contrast|forced-colors/i;

// ---- One unit: a contract and the source under it ------------------------------

function checkUnit(unit, add, notChecked) {
  const c = unit.contract;
  const name = basename(c.file);
  const byName = new Map();
  const byKey = new Map();
  const byKindKey = new Map();
  const kinds = {};
  for (const t of c.tokens) {
    for (const n of t.names) { const k = `--${n}`; if (!byName.has(k)) byName.set(k, []); byName.get(k).push(t); }
    const key = tokenKey(t);
    if (!byKey.has(key)) byKey.set(key, t);
    if (!byKindKey.has(`${t.kind}|${key}`)) byKindKey.set(`${t.kind}|${key}`, t);
    (kinds[t.kind] ??= []).push(t);
  }
  const noteOk = c.type === 'design' && c.value.policy?.if_missing === 'invent_with_note';
  const sources = unit.sources.map(scanSource);
  const declared = new Set();
  const alias = new Map();
  const used = new Set();
  let themed = 0;
  for (const s of sources) for (const n of s.declared) declared.add(n);

  const scaleOf = (kind) => [...new Set(kinds[kind].map((t) => (typeof t.value === 'number' ? t.value : String(t.value))))].slice(0, 8).join(', ');
  const noted = (s, line) => noteOk && [s.rawLines[line - 1], s.rawLines[line - 2]].some((l) => l && /token-missing:/.test(l));
  const literal = (s, d, kind, text, key) => {
    const where = `${d.prop}: ${d.value}`;
    const tok = byKindKey.get(`${kind}|${key}`);
    if (tok) {
      add('literal-beside-token', `${text} in "${where}" is the value of ${tok.label}; bind the token`, s.file, d.line);
    } else if (kind === 'color') {
      if (noted(s, d.line)) add('noted-literal', `${text} in "${where}" carries a token-missing note; ${name} still has no token for it`, s.file, d.line);
      else add('raw-color', `${text} in "${where}" is not a token in ${name}`, s.file, d.line);
    } else if (kind === 'fontFamily') {
      if (noted(s, d.line)) add('noted-literal', `${text} in "${where}" carries a token-missing note; ${name} defines ${scaleOf('fontFamily')}`, s.file, d.line);
      else add('raw-font', `${text} in "${where}" is not a font family in ${name}, which defines ${scaleOf('fontFamily')}`, s.file, d.line);
    } else add('off-scale', `${text} in "${where}" is on no step of the ${KIND_WORD[kind]} scale (${scaleOf(kind)}); name the missing token`, s.file, d.line);
  };

  for (const s of sources) {
    for (const d of s.decls) {
      const hasVar = /var\(/.test(d.value);
      if (d.prop.startsWith('--')) {
        const toks = byName.get(d.prop);
        if (toks && THEMED.test(d.context)) { themed++; continue; }
        // A Tailwind @theme block turns each property into utilities, so declaring it there is a use.
        if (/@theme\b/.test(d.context)) for (const t of toks ?? []) used.add(t.group);
        if (toks && !hasVar) {
          const px = toPx(d.value);
          const match = toks.some((t) => literalKey(d.value, t.kind) === tokenKey(t) || squash(d.value) === squash(t.value) || (px !== null && !Array.isArray(t.value) && px === toPx(t.value)));
          if (!match) {
            const t = toks[0];
            add('stale-mirror', `${d.prop} is ${d.value} here; ${name} says ${t.label} is ${Array.isArray(t.value) ? t.value.join(', ') : t.value}`, s.file, d.line);
          }
          continue;
        }
        if (toks || hasVar) continue;
        const colors = d.value.match(COLOR_RE) ?? [];
        if (colors.length) {
          for (const col of colors) {
            const n = normColor(col);
            if (!n) continue;
            const tok = byKey.get(`c:${n}`);
            if (tok) alias.set(d.prop, tok);
            else if (THEMED.test(d.context)) themed++;
            else literal(s, d, 'color', col, `c:${n}`);
          }
          continue;
        }
        const key = literalKey(d.value);
        const tok = byKey.get(key) ?? byKey.get(`f:${firstFamily(d.value)}`);
        if (tok) { alias.set(d.prop, tok); if (/@theme\b/.test(d.context)) used.add(tok.group); }
        else if (/^[lt]:/.test(key)) add('local-token', `${d.prop}: ${d.value} is declared here and ${name} does not define it; bind a token or propose one`, s.file, d.line);
        continue;
      }
      if (/@font-face/.test(d.context)) continue;
      // Colors, on any property.
      for (const col of d.value.match(COLOR_RE) ?? []) { const n = normColor(col); if (n) literal(s, d, 'color', col, `c:${n}`); }
      if (COLOR_PROP.test(d.prop)) for (const w of d.value.split(/[\s,/]+/)) if (NAMED.has(w.toLowerCase())) literal(s, d, 'color', w, `c:${NAMED.get(w.toLowerCase())}`);
      // Sizes, times, curves and families, by the property they sit on.
      let kind = propKind(d.prop);
      let value = d.value;
      if (d.prop === 'font') {
        const m = value.match(/(\d*\.?\d+(?:px|rem))(?:\s*\/\s*[\d.]+[a-z%]*)?\s+(.+)$/);
        if (m) {
          if (kinds.fontSize) literal(s, d, 'fontSize', m[1], `l:${toPx(m[1])}`);
          kind = 'fontFamily';
          value = m[2];
        }
      }
      if (!kind || !kinds[kind === 'duration' ? 'duration' : kind]) {
        if (kind === 'duration' && kinds.easing) for (const b of value.match(BEZIER_RE) ?? []) literal(s, d, 'easing', b, `s:${squash(b)}`);
        continue;
      }
      if (kind === 'radius' || kind === 'spacing' || kind === 'fontSize') {
        for (const m of value.matchAll(LENGTH_RE)) { const px = toPx(m[0]); if (px) literal(s, d, kind, m[0], `l:${px}`); }
      } else if (kind === 'duration') {
        for (const m of value.matchAll(TIME_RE)) { const ms = toMs(m[0]); if (ms) literal(s, d, 'duration', m[0], `t:${ms}`); }
        if (kinds.easing) for (const b of value.match(BEZIER_RE) ?? []) literal(s, d, 'easing', b, `s:${squash(b)}`);
      } else if (kind === 'easing') {
        for (const b of value.match(BEZIER_RE) ?? []) literal(s, d, 'easing', b, `s:${squash(b)}`);
      } else if (kind === 'fontFamily' && !hasVar) {
        const fam = firstFamily(value);
        if (fam && !GENERIC_FONT.test(fam)) literal(s, d, 'fontFamily', value.split(',')[0].trim(), `f:${fam}`);
      }
    }
  }

  // A custom property that only forwards to another one passes its use along.
  for (const s of sources) for (const d of s.decls) if (d.prop.startsWith('--')) for (const m of d.value.matchAll(/var\(\s*(--[\w-]+)/g)) {
    for (const t of byName.get(m[1]) ?? []) if (!alias.has(d.prop)) alias.set(d.prop, t);
  }

  // var(--x) must be defined by the contract or declared in the checked source.
  for (const s of sources) {
    for (const r of s.varRefs) {
      const toks = byName.get(r.name) ?? (alias.has(r.name) ? [alias.get(r.name)] : null);
      if (toks) { for (const t of toks) used.add(t.group); continue; }
      if (!declared.has(r.name)) add('unknown-token', `var(${r.name}) is defined by neither ${name} nor the checked source`, s.file, r.line);
    }
    for (const v of s.variants) {
      if (variantKnown(c, v.comp, v.variant) === false) add('unknown-variant', `variant "${v.variant}" on ${v.comp} is not in ${name}, which lists ${variantList(c, v.comp).join(', ')}`, s.file, v.line);
    }
  }
  // Tokens nothing uses. A utility class ending in the token's name counts as a use.
  const classText = sources.filter((s) => s.ext !== '.css').map((s) => s.text).join('\n');
  const reported = new Set();
  for (const t of c.tokens) {
    if (!sources.length || used.has(t.group) || reported.has(t.group) || t.kind === 'other') continue;
    const leaf = TYPO_FIELDS[t.kind] ? kebab(t.path[t.path.length - 2]) : t.path.slice(1).map(kebab).join('-') || kebab(t.path[0]);
    if (new RegExp(`(?<![\\w-])[a-z]+(?:-[a-z]+)*-${esc(leaf)}(?![\\w-])`).test(classText)) continue;
    reported.add(t.group);
    add('unused-token', `${t.group} is defined and no checked source uses it`, t.file, t.line);
  }
  if (themed) notChecked.push(`${themed} themed override(s) under ${show(unit.dir)} (dark, light or data-theme blocks) were not compared with the contract`);

  for (const doc of unit.docs) checkDoc(doc, c, byName, declared, add);
}

// ---- Design-system doc pages ---------------------------------------------------

const HEDGES = ['sparingly', 'reasonably', 'tasteful', 'tastefully', 'where appropriate', 'try to', 'consider'];

function checkDoc(file, c, byName, declared, add) {
  const raw = read(file);
  const name = basename(c.file);
  const lines = stripComments(raw, '.md').split('\n');
  let section = null;
  let fenced = false;
  const sections = [];
  lines.forEach((line, i) => {
    const n = i + 1;
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return; }
    if (fenced) return;
    const h = line.match(/^#{2,3}\s+(.+?)\s*$/);
    if (h) { section = { name: h[1].replace(/`/g, ''), line: n, variants: null, correct: false, incorrect: false }; sections.push(section); return; }
    const incorrect = /^\s*[-*]?\s*\**Incorrect\b/i.test(line);
    if (section && incorrect) section.incorrect = true;
    if (section && /^\s*[-*]?\s*\**Correct\b/i.test(line)) section.correct = true;
    if (incorrect) return;
    for (const m of line.matchAll(/var\(\s*(--[\w-]+)|`(--[\w-]+)`/g)) {
      const v = m[1] ?? m[2];
      if (!byName.has(v) && !declared.has(v)) add('unknown-token', `${v} is named in the docs and defined by neither ${name} nor the checked source`, file, n);
    }
    const prose = line.replace(/`[^`]*`/g, ' ').replace(/"[^"]*"/g, ' ');
    for (const w of HEDGES) if (new RegExp(`\\b${w}\\b`, 'i').test(prose)) add('hedge-word', `"${w}" leaves the decision to a guess; give the number or the rule`, file, n);
    const v = line.match(/^\s*[-*]?\s*\**Variants\**\s*:\s*(.+)$/i);
    if (v && section) {
      section.variants = n;
      const comp = kebab(section.name);
      const listed = [...v[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
      if (!/nothing else exists/i.test(v[1])) add('open-variant-set', `the ${section.name} variant list is not closed; end it with "Nothing else exists."`, file, n);
      if (!/\(default\)/i.test(v[1])) add('no-default', `the ${section.name} variant list names no default`, file, n);
      for (const x of listed) if (variantKnown(c, comp, x) === false) add('unknown-variant', `the docs list variant "${x}" for ${section.name}; ${name} lists ${variantList(c, comp).join(', ')}`, file, n);
    }
  });
  for (const s of sections) if (s.variants && !(s.correct && s.incorrect)) add('no-example', `${s.name} has no Correct and Incorrect pair from real code`, file, s.variants);
}

// ---- Finding the contract for each file ---------------------------------------

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'out', '.next', 'coverage']);
const SOURCE_EXT = new Set(['.css', '.html', '.htm', '.jsx', '.tsx']);
const NOT_DOCS = new Set(['readme.md', 'tokens.md', 'changelog.md', 'license.md']);
const isDesignFile = (f) => basename(f) === '.design' || /\.design$/i.test(f);

function walk(p, out) {
  if (statSync(p).isDirectory()) {
    for (const f of readdirSync(p).sort()) if (!SKIP_DIRS.has(f)) walk(join(p, f), out);
  } else out.push(p);
  return out;
}

const contractCache = new Map();
function contractsIn(dir) {
  if (contractCache.has(dir)) return contractCache.get(dir);
  const found = { designs: [], mds: [] };
  let names = [];
  try { names = readdirSync(dir).sort(); } catch { /* unreadable: no contract here */ }
  for (const f of names) {
    const p = join(dir, f);
    if (!statSync(p).isFile()) continue;
    if (isDesignFile(f)) found.designs.push(p);
    else if (/\.md$/i.test(f) && (f.toLowerCase() === 'design.md' || looksLikeDesignMd(read(p)))) found.mds.push(p);
  }
  // A DESIGN.md also lives one folder down, in docs/, design/ or .design/.
  for (const sub of ['docs', 'design', '.design']) {
    const p = join(dir, sub, 'DESIGN.md');
    if (names.includes(sub) && existsSync(p) && statSync(p).isFile()) found.mds.push(p);
  }
  contractCache.set(dir, found);
  return found;
}
function nearestContractDir(dir) {
  for (let d = dir, n = 0; n < 40; n++) {
    const c = contractsIn(d);
    if (c.designs.length || c.mds.length) return d;
    if (existsSync(join(d, '.git'))) return null;
    const up = dirname(d);
    if (up === d) return null;
    d = up;
  }
  return null;
}

const stem = (f) => basename(f).replace(/\.[^.]+$/, '').toLowerCase();

function analyze(inputs) {
  const findings = [];
  const notChecked = [];
  const blocking = [];
  const files = [];
  for (const p of inputs) {
    const abs = resolve(p);
    if (!existsSync(abs)) { blocking.push(`${p} does not exist`); continue; }
    walk(abs, files);
  }
  const keepNew = (list) => { for (const x of list) if (!findings.some((y) => y.line === x.line && y.file === x.file && y.lineNumber === x.lineNumber && y.detail === x.detail)) findings.push(x); };
  const units = new Map();
  const orphans = [];
  const lone = [];
  for (const f of [...new Set(files)]) {
    const ext = extname(f).toLowerCase();
    const isContract = isDesignFile(f) || contractsIn(dirname(f)).mds.includes(f);
    if (!isContract && !SOURCE_EXT.has(ext) && ext !== '.md') continue;
    const dir = nearestContractDir(dirname(f));
    if (!dir) { if (SOURCE_EXT.has(ext)) orphans.push(f); continue; }
    if (isContract) { lone.push(f); continue; }
    if (!units.has(dir)) units.set(dir, { dir, sources: [], docs: [] });
    if (SOURCE_EXT.has(ext)) units.get(dir).sources.push(f);
    else if (!NOT_DOCS.has(basename(f).toLowerCase())) units.get(dir).docs.push(f);
  }
  // A contract no source led to is still read, so its own fields are checked.
  for (const f of lone) {
    const claimed = [...units.keys()].some((d) => { const c = contractsIn(d); return c.designs.includes(f) || c.mds.includes(f); });
    if (!claimed) units.set(dirname(f), { dir: dirname(f), sources: [], docs: [] });
  }
  if (!files.length && !blocking.length) blocking.push('no input files');
  if (orphans.length) blocking.push(`no contract found for ${orphans.length} source file(s), first ${show(orphans[0])}: say so and offer to bootstrap one`);
  else if (!units.size && !blocking.length) blocking.push('no contract and no source file among the inputs');

  const results = [];
  for (const unit of units.values()) {
    const all = contractsIn(unit.dir);
    const here = [...all.designs, ...all.mds, ...unit.sources, ...unit.docs].filter((f) => dirname(f) === unit.dir);
    const halves = here.some((f) => stem(f) === 'bad') && here.some((f) => stem(f) === 'good') ? ['bad', 'good'] : [null];
    for (const half of halves) {
      const other = half === 'bad' ? 'good' : 'bad';
      const keep = (f) => !half || dirname(f) !== unit.dir || stem(f) !== other;
      const tag = half ? `${show(unit.dir)} [${half}]` : show(unit.dir);
      const mine = [];
      const add = (line, detail, file, lineNumber) => {
        const cls = NEVER[line] ? 'never-intentional' : 'candidate';
        if (mine.some((x) => x.line === line && x.file === show(file) && x.lineNumber === lineNumber && x.detail === detail)) return;
        mine.push({ line, file: show(file), lineNumber, detail, class: cls });
      };
      const result = { dir: unit.dir, half, findings: mine, inconclusive: null };
      results.push(result);
      const stop = (why) => { result.inconclusive = why; blocking.push(`${tag}: ${why}`); keepNew(mine); };

      const designs = all.designs.filter(keep);
      const mds = all.mds.filter(keep);
      let chosen = designs.find((f) => basename(f) === '.design') ?? (designs.length === 1 ? designs[0] : null);
      if (!chosen && designs.length > 1) {
        add('two-contracts', `${designs.length} .design files here (${designs.map((f) => basename(f)).join(', ')}) and none is named .design; ask which system is the contract`, designs[0], 1);
        stop('more than one .design file, so nothing was compared');
        continue;
      }
      let rationale = null;
      if (!chosen) {
        chosen = mds.find((f) => basename(f).toLowerCase() === 'design.md') ?? (mds.length === 1 ? mds[0] : null);
        if (!chosen && mds.length > 1) {
          add('two-contracts', `${mds.length} DESIGN.md-format files here (${mds.map((f) => basename(f)).join(', ')}); ask which one is the contract`, mds[0], 1);
          stop('more than one DESIGN.md-format file, so nothing was compared');
          continue;
        }
      } else if (mds.length) rationale = mds[0];
      if (!chosen) { stop('no contract'); continue; }

      let contract;
      try {
        contract = isDesignFile(chosen) ? loadDesign(chosen) : loadDesignMd(chosen);
      } catch (e) {
        stop(`could not read ${show(chosen)}: ${e.message}`);
        continue;
      }
      readContract(contract, add);
      if (rationale) {
        const mdText = read(rationale);
        const stated = /\.design\b/i.test(mdText) || /design\.md/i.test(contract.text);
        if (!stated) add('two-contracts', `${basename(chosen)} and ${basename(rationale)} sit side by side and neither names the other; state that the .design is the contract and ${basename(rationale)} is rationale`, rationale, 1);
        try {
          const md = loadDesignMd(rationale);
          readContract(md, () => {});
          const have = new Set(contract.tokens.filter((t) => t.kind === 'color').map(tokenKey));
          for (const t of md.tokens) if (t.kind === 'color' && !have.has(tokenKey(t))) add('contracts-differ', `${t.label} is ${t.value} in ${basename(rationale)} and no color in ${basename(chosen)} holds that value`, rationale, t.line);
        } catch { notChecked.push(`${show(rationale)} could not be read, so it was not compared with ${basename(chosen)}`); }
      }
      if (!contract.tokens.length) { stop(`${show(chosen)} defines no tokens, so there is nothing to compare`); continue; }
      const u = { dir: unit.dir, contract, sources: unit.sources.filter(keep), docs: unit.docs.filter(keep) };
      if (!u.sources.length && !u.docs.length) { stop(`no source or doc page beside ${show(chosen)}, so drift was not checked`); continue; }
      checkUnit(u, add, notChecked);
      keepNew(mine);
    }
  }
  findings.sort((a, b) => a.file.localeCompare(b.file) || a.lineNumber - b.lineNumber || a.line.localeCompare(b.line));
  return { files: [...new Set(files)].map(show), findings, notChecked, blocking, results };
}

// ---- Output ----------------------------------------------------------------

const tally = (list) => {
  const n = {};
  for (const f of list) n[f.line] = (n[f.line] ?? 0) + 1;
  return Object.entries(n).map(([k, v]) => `${k} ${v}`).join(', ');
};

function main(argv) {
  const flags = new Set();
  const inputs = [];
  let report = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--report') report = argv[++i];
    else if (a.startsWith('--')) flags.add(a);
    else inputs.push(a);
  }
  if (flags.has('--help') || flags.has('-h')) { console.log(HELP); return 0; }
  if (flags.has('--self-test')) return selfTest();
  for (const f of flags) if (!['--gate', '--strict'].includes(f)) { console.error(`unknown flag ${f}; see --help`); return 2; }

  const strict = flags.has('--strict');
  const gate = flags.has('--gate') || strict;
  const r = inputs.length ? analyze(inputs) : { files: [], findings: [], notChecked: [], blocking: ['no input: pass files or folders'], results: [] };
  const never = r.findings.filter((f) => f.class === 'never-intentional');
  const candidates = r.findings.filter((f) => f.class === 'candidate');
  const failing = strict ? r.findings : never;
  const status = failing.length ? 'failed' : r.blocking.length ? 'inconclusive' : 'passed';
  const exitCode = status === 'failed' ? (gate ? 1 : 0) : status === 'inconclusive' ? 2 : 0;

  const print = (f) => console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`);
  never.forEach(print);
  if (candidates.length) { console.log('candidates, judge each one:'); candidates.forEach(print); }
  console.log(`checked ${r.files.length} file(s)`);
  console.log(`never intentional: ${never.length}${never.length ? ` (${tally(never)})` : ''}`);
  console.log(`candidates: ${candidates.length}${candidates.length ? ` (${tally(candidates)})` : ''}`);
  const notChecked = [...r.blocking, ...r.notChecked];
  for (const n of notChecked) console.log(`not checked: ${n}`);
  console.log('passing is necessary, not sufficient');
  if (report) writeFileSync(report, `${JSON.stringify({ status, exitCode, files: r.files, findings: r.findings, notChecked: [...notChecked, ...NOT_CHECKED] }, null, 2)}\n`);
  if (status === 'inconclusive') console.log(`${GATE} inconclusive: ${r.blocking[0]}`);
  else if (gate) console.log(status === 'passed' ? `${GATE} passed` : `${GATE} failed: ${never.length} never-intentional line(s)${strict ? `, ${candidates.length} candidate(s) under --strict` : ''}`);
  return exitCode;
}

// ---- Self-test: the examples pass, every teaching pair raises its own line -------

function selfTest() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const dirs = (p) => (existsSync(p) ? readdirSync(p).filter((d) => statSync(join(p, d)).isDirectory()).sort() : []);
  const lines = [...Object.keys(NEVER), ...Object.keys(CANDIDATE)].sort((a, b) => b.length - a.length);
  let failed = 0;
  let count = 0;
  const assert = (ok, what, extra = '') => { count++; if (!ok) failed++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}${!ok && extra ? `: ${extra}` : ''}`); };
  const neverOf = (res) => res.findings.filter((f) => f.class === 'never-intentional');
  const list = (fs) => fs.map((f) => `${f.line} (${f.file}:${f.lineNumber})`).join(', ');

  const examples = dirs(join(root, 'examples'));
  assert(examples.length >= 3, `examples/ holds ${examples.length} gold folders`);
  for (const d of examples) {
    const r = analyze([join(root, 'examples', d)]);
    assert(!r.blocking.length && r.results.length > 0, `examples/${d} was checked`, r.blocking.join('; '));
    assert(neverOf(r).length === 0, `examples/${d} has 0 never-intentional lines`, list(neverOf(r)));
  }
  const pairs = dirs(join(root, 'teaching'));
  assert(pairs.length >= 8, `teaching/ holds ${pairs.length} pairs`);
  const covered = new Set();
  for (const d of pairs) {
    const want = lines.find((l) => d === l || d.startsWith(`${l}-`));
    if (!want) { assert(false, `teaching/${d} is named for a line`, 'no gate line starts this folder name'); continue; }
    covered.add(want);
    const r = analyze([join(root, 'teaching', d)]);
    const bad = r.results.find((x) => x.half === 'bad');
    const good = r.results.find((x) => x.half === 'good');
    if (!bad || !good) { assert(false, `teaching/${d} has a bad and a good half`); continue; }
    assert(bad.findings.some((f) => f.line === want), `teaching/${d} bad raises ${want}:`, `it raised ${list(bad.findings) || 'nothing'}`);
    const others = neverOf(bad).filter((f) => f.line !== want);
    assert(others.length === 0, `teaching/${d} bad has one thing wrong`, list(others));
    assert(!good.findings.some((f) => f.line === want) && neverOf(good).length === 0, `teaching/${d} good is clean`, list(good.findings.filter((f) => f.line === want || f.class === 'never-intentional')));
  }
  for (const l of Object.keys(NEVER)) assert(covered.has(l), `a teaching pair covers ${l}:`);
  console.log(`${count - failed} of ${count} assertions passed`);
  console.log(failed ? `${GATE} self-test failed` : `${GATE} self-test passed`);
  return failed ? 1 : 0;
}

process.exitCode = main(process.argv.slice(2));
