#!/usr/bin/env node
// diagram-check: reads a finished figure (an .svg, or SVG inline in .html) and
// names every fault as a line. Zero dependencies, Node 20+.
//
//   node scripts/diagram-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]
//
// It reads markup, not pixels. It cannot judge whether the figure should exist,
// whether the hierarchy is right, or how the figure looks once rendered.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// ---- Numbers, all from references/ -----------------------------------------

const BUDGET = { nodes: 9, connectors: 12, accents: 2, callouts: 2, faithfulNodes: 24 } // diagram-decision.md, The budget
const GRID = 4 // diagram-craft.md, Grid, type, legend
const ELBOW_RADII = [8, 6] // diagram-craft.md, connector rule 1
const NODE_RADIUS = 6 // diagram-craft.md, Signal
const TAG_RADIUS = 2
const ATTACH_GAP = 12 // connector rule 4
const ROUTE_OFFSET = 12 // connector rule 3
const LABEL_CHARS = 14 // connector rule 2
const LABEL_CLEAR = [6, 10] // connector rule 2
const TYPE = {
  // diagram-design-reconciliation.md, Small type
  doc: { name: 12, sub: 9, label: 8 },
  slide: { name: 16, sub: 12, label: 12 },
}
const SHIPPED_PALETTE = ['#f5f5f5', '#2d3142', '#eb6c36'] // diagram-design-reconciliation.md, Check

const NEVER = {
  'no-title': 'the root <svg> lacks role="img", a first-child <title>, a <desc>, or an aria-labelledby that names them',
  'bare-id': 'the <title> or <desc> id is a bare "title" or "desc" with no figure slug in front',
  'node-budget': `more than ${BUDGET.nodes} nodes in one figure (${BUDGET.faithfulNodes} when the root carries data-import="faithful")`,
  'connector-budget': `more than ${BUDGET.connectors} connectors in one figure`,
  'callout-budget': `more than ${BUDGET.callouts} callouts in one figure`,
  'accent-colors': `more than ${BUDGET.accents} chromatic hues in the figure`,
  'accent-spread': 'one accent hue on more than 2 nodes, connectors, zones or callouts',
  diagonal: 'a connector segment that is neither horizontal nor vertical, or a curved route',
  'sharp-elbow': `a right-angle turn with no rounding (r=${ELBOW_RADII[0]}, r=${ELBOW_RADII[1]} in a tight layout)`,
  'edge-over-node': 'a connector drawn after a node, so it paints on top of the boxes',
  'line-through-node': 'a connector passing through a box it does not end at',
  'shared-attach': `two connectors meeting one node edge less than ${ATTACH_GAP}px apart`,
  'stacked-strokes': `parallel connector runs less than ${ROUTE_OFFSET}px apart`,
  'two-headed': 'one connector with an arrowhead at both ends',
  'label-on-line': 'a connector label with no paper mask behind it, or a mask that sits on a stroke',
  'small-text': 'text below the type ramp (names 12, sublabels 9, arrow labels 8; 16, 12, 12 with data-preset="slide")',
  'off-grid': `a node or zone whose x, y, width or height does not divide by ${GRID}`,
  'node-radius': `a node whose corner radius is not ${NODE_RADIUS}, or a type tag whose radius is not ${TAG_RADIUS}`,
  shadow: 'a filter or shadow on the figure',
  'missing-legend': 'connectors differ by color or dash and the figure has no legend',
  'floating-legend': 'the legend starts above the bottom of the nodes instead of sitting in a strip under them',
  'mono-label': 'a monospace face on a node name or on plain words',
}

const CANDIDATE = {
  'sentence-figure': '3 nodes or fewer and 2 connectors or fewer: a sentence may carry this',
  'at-budget': `the figure sits exactly at ${BUDGET.nodes} nodes or ${BUDGET.connectors} connectors`,
  'long-label': `a connector label longer than ${LABEL_CHARS} characters`,
  'label-clearance': `a label mask closer than ${LABEL_CLEAR[0]}px to a stroke or further than ${LABEL_CLEAR[1]}px from every stroke`,
  'elbow-radius': `a rounded elbow whose radius is not ${ELBOW_RADII.join(' or ')}`,
  'geometry-desc': '<desc> runs past one sentence or describes boxes, arrows and positions',
  'shipped-palette': "diagram-design's shipped skin (#f5f5f5, #2d3142, #eb6c36) is in the file",
  'faithful-import': `data-import="faithful" raised the node budget to ${BUDGET.faithfulNodes}`,
}

const NOT_CHECKED = [
  'whether the figure should exist at all (the paragraph test and the table test)',
  'whether the surface is right for who touches it next',
  'whether the accent sits on the right one or two things',
  'whether a node, a connector or a label could be deleted',
  'text that overflows its box, and how the figure renders at its shown width',
  'the attach-point formula L*k/(N+1); only the 12px minimum is measured',
  'dark-mode overrides, @media rules, gradients, and transforms other than translate',
  'a live tldraw canvas, a .tldraw file, a Mermaid block or FigJam',
]

const HELP = `diagram-check: read a finished figure and name every fault as a line.

Usage:
  node scripts/diagram-check.mjs <files or folders...> [options]

Reads .svg files and SVG inline in .html. Folders are walked.

Options:
  --gate          print the verdict; ends "diagram check passed" (exit 0) only
                  when every never-intentional line is at 0
  --report <out>  write the findings as JSON
  --strict        candidate lines fail the run as well
  --self-test     prove the gate against examples/ and teaching/
  --help          this text

Exit codes: 0 passed, 1 failed, 2 inconclusive (nothing readable to check).

How it reads a figure:
  node       class="node" on a <g> or a <rect> (without any, every plain <rect>)
  connector  class="edge" on a <path>, <line> or <polyline>, or any of those with a marker
  label      <text class="label"> with a <rect class="mask"> drawn before it
  legend     class="legend"      callout  class="callout"
  zone       class="zone" or class="boundary"      type tag  class="tag"
  type role  class="name", class="sub", class="label" on <text>
  a connector to an HTTP or external call carries class="link"
  data-preset="slide" on the root switches the type ramp
  data-import="faithful" on the root raises the node budget to ${BUDGET.faithfulNodes}

Lines that are never intentional:
${Object.entries(NEVER).map(([k, v]) => `  ${(k + ':').padEnd(19)} ${v}`).join('\n')}

Candidate lines (reported for judgment):
${Object.entries(CANDIDATE).map(([k, v]) => `  ${(k + ':').padEnd(19)} ${v}`).join('\n')}

Not checked by the gate:
${NOT_CHECKED.map((s) => `  - ${s}`).join('\n')}

passing is necessary, not sufficient`

// ---- XML --------------------------------------------------------------------

function lineIndex(src) {
  const starts = [0]
  for (let i = 0; i < src.length; i++) if (src.charCodeAt(i) === 10) starts.push(i + 1)
  return (off) => {
    let lo = 0
    let hi = starts.length - 1
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (starts[mid] <= off) lo = mid
      else hi = mid - 1
    }
    return lo + 1
  }
}

function tagEnd(src, from) {
  let quote = null
  for (let i = from; i < src.length; i++) {
    const c = src[i]
    if (quote) {
      if (c === quote) quote = null
    } else if (c === '"' || c === "'") quote = c
    else if (c === '>') return i
  }
  return -1
}

function parseAttrs(s) {
  const attrs = {}
  const re = /([^\s=/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g
  let m
  while ((m = re.exec(s))) attrs[m[1]] = m[2] ?? m[3] ?? m[4] ?? ''
  return attrs
}

function parseXml(src, base, lineOf) {
  const root = { tag: '#root', attrs: {}, children: [], parent: null, line: lineOf(base), order: -1 }
  let cur = root
  let order = 0
  let i = 0
  const n = src.length
  const text = (value) => {
    if (value) cur.children.push({ tag: '#text', value, parent: cur })
  }
  while (i < n) {
    const lt = src.indexOf('<', i)
    if (lt < 0) {
      text(src.slice(i))
      break
    }
    if (lt > i) text(src.slice(i, lt))
    if (src.startsWith('<!--', lt)) {
      const e = src.indexOf('-->', lt + 4)
      i = e < 0 ? n : e + 3
      continue
    }
    if (src.startsWith('<![CDATA[', lt)) {
      const e = src.indexOf(']]>', lt)
      text(src.slice(lt + 9, e < 0 ? n : e))
      i = e < 0 ? n : e + 3
      continue
    }
    if (src[lt + 1] === '?' || src[lt + 1] === '!') {
      const e = src.indexOf('>', lt)
      i = e < 0 ? n : e + 1
      continue
    }
    const gt = tagEnd(src, lt + 1)
    if (gt < 0) break
    const raw = src.slice(lt + 1, gt)
    if (raw[0] === '/') {
      const name = raw.slice(1).trim()
      let p = cur
      while (p !== root && p.tag !== name) p = p.parent
      if (p !== root) cur = p.parent
      i = gt + 1
      continue
    }
    const selfClose = raw.endsWith('/')
    const m = (selfClose ? raw.slice(0, -1) : raw).match(/^([^\s/]+)([\s\S]*)$/)
    if (!m) {
      i = gt + 1
      continue
    }
    const el = { tag: m[1], attrs: parseAttrs(m[2]), children: [], parent: cur, line: lineOf(base + lt), order: order++ }
    cur.children.push(el)
    if (!selfClose) {
      if (el.tag === 'style' || el.tag === 'script') {
        const close = src.indexOf('</' + el.tag, gt + 1)
        const body = src.slice(gt + 1, close < 0 ? n : close).replace(/<!\[CDATA\[|\]\]>/g, '')
        el.children.push({ tag: '#text', value: body, parent: el })
        i = close < 0 ? n : src.indexOf('>', close) + 1
        continue
      }
      cur = el
    }
    i = gt + 1
  }
  return root
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (all, k) => {
    if (k[0] === '#') return String.fromCodePoint(k[1].toLowerCase() === 'x' ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10))
    return ENTITIES[k] ?? all
  })

function textOf(el) {
  let out = ''
  for (const c of el.children) out += c.tag === '#text' ? c.value : textOf(c)
  return decode(out).replace(/\s+/g, ' ').trim()
}

function walk(el, fn) {
  for (const c of el.children) {
    if (c.tag === '#text') continue
    fn(c)
    walk(c, fn)
  }
}

const classes = (el) => (el.attrs.class || '').split(/\s+/).filter(Boolean)
const hasClass = (el, name) => classes(el).includes(name)
function closest(el, test) {
  for (let e = el; e && e.tag !== '#root'; e = e.parent) if (test(e)) return e
  return null
}
const DEF_TAGS = new Set(['defs', 'marker', 'symbol', 'clipPath', 'mask', 'pattern', 'linearGradient', 'radialGradient', 'filter'])
const inDefs = (el) => !!closest(el, (e) => DEF_TAGS.has(e.tag))
const inClass = (el, name) => !!closest(el, (e) => hasClass(e, name))

// ---- CSS --------------------------------------------------------------------

function parseDecls(body) {
  const out = {}
  for (const part of body.split(';')) {
    const c = part.indexOf(':')
    if (c < 0) continue
    const name = part.slice(0, c).trim()
    const value = part.slice(c + 1).replace(/!important/i, '').trim()
    if (name) out[name.startsWith('--') ? name : name.toLowerCase()] = value
  }
  return out
}

function parseCompound(s) {
  if (s === ':root' || s === 'html' || s === 'body') return { rootish: true, spec: 10 }
  const m = /^([a-zA-Z*][\w-]*)?((?:[#.][\w-]+)*)$/.exec(s)
  if (!m || !s) return null
  const c = { tag: m[1] && m[1] !== '*' ? m[1] : null, id: null, classes: [] }
  for (const part of m[2].match(/[#.][\w-]+/g) || []) {
    if (part[0] === '#') c.id = part.slice(1)
    else c.classes.push(part.slice(1))
  }
  c.spec = (c.id ? 100 : 0) + c.classes.length * 10 + (c.tag ? 1 : 0)
  return c
}

function parseCss(text, sheet) {
  text = text.replace(/\/\*[\s\S]*?\*\//g, '')
  let i = 0
  while (i < text.length) {
    const open = text.indexOf('{', i)
    if (open < 0) break
    const prelude = text.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (j < text.length && depth) {
      if (text[j] === '{') depth++
      else if (text[j] === '}') depth--
      j++
    }
    const body = text.slice(open + 1, j - 1)
    i = j
    if (prelude.startsWith('@')) {
      sheet.skipped.add(prelude.split(/\s+/)[0])
      continue
    }
    const decls = parseDecls(body)
    for (const [k, v] of Object.entries(decls)) if (k.startsWith('--')) sheet.vars[k] = v
    for (const sel of prelude.split(',')) {
      const parts = sel.trim().replace(/\s*[>+~]\s*/g, ' ').split(/\s+/).map(parseCompound)
      if (!parts.length || parts.includes(null)) continue
      sheet.rules.push({ parts, decls, spec: parts.reduce((a, p) => a + p.spec, 0), order: sheet.rules.length })
    }
  }
}

function matchCompound(el, c, last) {
  if (c.rootish) return last ? el.tag === 'svg' && el.parent.tag === '#root' : true
  if (c.tag && c.tag !== el.tag) return false
  if (c.id && el.attrs.id !== c.id) return false
  const cl = classes(el)
  return c.classes.every((k) => cl.includes(k))
}

function matches(el, parts) {
  if (!matchCompound(el, parts[parts.length - 1], true)) return false
  let e = el.parent
  for (let k = parts.length - 2; k >= 0; k--) {
    if (parts[k].rootish) continue
    while (e && e.tag !== '#root' && !matchCompound(e, parts[k], false)) e = e.parent
    if (!e || e.tag === '#root') return false
    e = e.parent
  }
  return true
}

function styleContext(sheet) {
  const own = (el, prop) => {
    const inline = el.attrs.style ? parseDecls(el.attrs.style)[prop] : undefined
    if (inline != null) return inline
    let best = null
    for (const r of sheet.rules) {
      if (r.decls[prop] == null || !matches(el, r.parts)) continue
      if (!best || r.spec > best.spec || (r.spec === best.spec && r.order > best.order)) best = r
    }
    if (best) return best.decls[prop]
    return el.attrs[prop] ?? null
  }
  const resolveVar = (v, depth = 0) => {
    if (v == null || depth > 8 || !v.includes('var(')) return v
    return resolveVar(
      v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*((?:[^()]|\([^()]*\))*))?\)/g, (_, name, fb) => sheet.vars[name] ?? fb ?? 'unset'),
      depth + 1,
    )
  }
  const fromFont = (font, prop) => {
    const m = font && /(\d+(?:\.\d+)?)px(?:\/[\w.%]+)?\s+(.+)$/.exec(font)
    if (!m) return null
    return prop === 'font-size' ? m[1] + 'px' : prop === 'font-family' ? m[2] : null
  }
  const get = (el, prop, inherit = true) => {
    for (let e = el; e && e.tag !== '#root'; e = e.parent) {
      let v = own(e, prop)
      if (v == null && (prop === 'font-size' || prop === 'font-family')) v = fromFont(own(e, 'font'), prop)
      if (v != null && v !== 'inherit') return resolveVar(v)
      if (!inherit) break
    }
    return null
  }
  return { get, resolveVar }
}

// ---- Color ------------------------------------------------------------------

const NAMED = {
  black: [0, 0, 0], white: [255, 255, 255], gray: [128, 128, 128], grey: [128, 128, 128], silver: [192, 192, 192],
  red: [255, 0, 0], blue: [0, 0, 255], green: [0, 128, 0], orange: [255, 165, 0], violet: [238, 130, 238],
  purple: [128, 0, 128], yellow: [255, 255, 0], cyan: [0, 255, 255], magenta: [255, 0, 255], pink: [255, 192, 203],
  teal: [0, 128, 128], navy: [0, 0, 128], lime: [0, 255, 0], gold: [255, 215, 0], tomato: [255, 99, 71],
}

function splitTop(s) {
  const out = []
  let depth = 0
  let cur = ''
  for (const ch of s) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      out.push(cur.trim())
      cur = ''
    } else cur += ch
  }
  out.push(cur.trim())
  return out
}

// A color as { r, g, b, a }, { none: true } when it paints nothing, or null when unreadable.
function parseColor(input) {
  if (input == null) return null
  const s = input.trim().toLowerCase()
  if (s === 'none' || s === 'transparent') return { none: true }
  if (NAMED[s]) return { r: NAMED[s][0], g: NAMED[s][1], b: NAMED[s][2], a: 1 }
  let m = /^#([0-9a-f]{3,8})$/.exec(s)
  if (m) {
    let h = m[1]
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
    if (h.length !== 6 && h.length !== 8) return null
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1 }
  }
  m = /^rgba?\((.+)\)$/.exec(s)
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean)
    if (p.length < 3) return null
    const ch = (v) => (v.endsWith('%') ? (parseFloat(v) * 255) / 100 : parseFloat(v))
    const a = p[3] == null ? 1 : p[3].endsWith('%') ? parseFloat(p[3]) / 100 : parseFloat(p[3])
    return { r: ch(p[0]), g: ch(p[1]), b: ch(p[2]), a }
  }
  m = /^hsla?\((.+)\)$/.exec(s)
  if (m) {
    const p = m[1].split(/[\s,/]+/).filter(Boolean)
    if (p.length < 3) return null
    const h = ((parseFloat(p[0]) % 360) + 360) % 360
    const sat = parseFloat(p[1]) / 100
    const l = parseFloat(p[2]) / 100
    const c = (1 - Math.abs(2 * l - 1)) * sat
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x]
    const k = l - c / 2
    return { r: (r + k) * 255, g: (g + k) * 255, b: (b + k) * 255, a: p[3] == null ? 1 : parseFloat(p[3]) }
  }
  m = /^color-mix\(\s*in\s+srgb\s*,(.+)\)$/.exec(s)
  if (m) {
    const parts = splitTop(m[1])
    if (parts.length !== 2) return null
    const read = (part) => {
      const pm = /^(.*?)(?:\s+(\d+(?:\.\d+)?)%)?$/.exec(part)
      return { c: parseColor(pm[1]), p: pm[2] == null ? null : parseFloat(pm[2]) / 100 }
    }
    const a = read(parts[0])
    const b = read(parts[1])
    if (!a.c || !b.c || a.c.none || b.c.none) return null
    if (a.p == null && b.p == null) a.p = b.p = 0.5
    else if (a.p == null) a.p = 1 - b.p
    else if (b.p == null) b.p = 1 - a.p
    const t = a.p + b.p || 1
    const mix = (k) => (a.c[k] * a.p + b.c[k] * b.p) / t
    return { r: mix('r'), g: mix('g'), b: mix('b'), a: mix('a') }
  }
  return null
}

// A color is chromatic when its channels spread by more than 15% of the range.
// Ink, paper and the grays stay under that; an accent or a link color does not.
function hueOf(c) {
  const max = Math.max(c.r, c.g, c.b)
  const min = Math.min(c.r, c.g, c.b)
  if (max - min <= 0.15 * 255) return null
  const d = max - min
  let h = max === c.r ? ((c.g - c.b) / d) % 6 : max === c.g ? (c.b - c.r) / d + 2 : (c.r - c.g) / d + 4
  h *= 60
  return h < 0 ? h + 360 : h
}
const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b))

// ---- Geometry ---------------------------------------------------------------

const num = (v) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

function offsetOf(el, notes) {
  let x = 0
  let y = 0
  for (let e = el; e && e.tag !== '#root'; e = e.parent) {
    const t = e.attrs.transform
    if (!t) continue
    const rest = t.replace(/translate\(\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?\s*\)/g, (_, tx, ty) => {
      x += parseFloat(tx)
      y += ty == null ? 0 : parseFloat(ty)
      return ''
    })
    if (rest.trim()) notes.add('a transform other than translate; positions under it are not measured')
  }
  return { x, y }
}

function pathSegments(d) {
  const toks = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi) || []
  const segs = []
  let i = 0
  let cmd = null
  let x = 0
  let y = 0
  let sx = 0
  let sy = 0
  let sub = 0
  const next = () => parseFloat(toks[i++])
  const add = (kind, nx, ny) => {
    segs.push({ kind, x1: x, y1: y, x2: nx, y2: ny, sub })
    x = nx
    y = ny
  }
  while (i < toks.length) {
    const before = i
    if (/^[a-zA-Z]$/.test(toks[i])) cmd = toks[i++]
    if (cmd == null) break
    const rel = cmd === cmd.toLowerCase()
    const C = cmd.toUpperCase()
    const dx = rel ? x : 0
    const dy = rel ? y : 0
    if (C === 'Z') {
      if (x !== sx || y !== sy) add('line', sx, sy)
      cmd = null
      if (i === before) i++
      continue
    }
    const need = { M: 2, L: 2, H: 1, V: 1, Q: 4, T: 2, C: 6, S: 4, A: 7 }[C]
    if (!need || i + need > toks.length) break
    const a = []
    for (let k = 0; k < need; k++) a.push(next())
    if (a.some(Number.isNaN)) break
    if (C === 'M') {
      x = a[0] + dx
      y = a[1] + dy
      sx = x
      sy = y
      sub++
      cmd = rel ? 'l' : 'L'
    } else if (C === 'L') add('line', a[0] + dx, a[1] + dy)
    else if (C === 'H') add('line', a[0] + dx, y)
    else if (C === 'V') add('line', x, a[0] + dy)
    else add('curve', a[need - 2] + dx, a[need - 1] + dy)
  }
  return segs
}

function segmentsOf(el) {
  if (el.tag === 'path') return pathSegments(el.attrs.d || '')
  if (el.tag === 'line') return [{ kind: 'line', x1: num(el.attrs.x1), y1: num(el.attrs.y1), x2: num(el.attrs.x2), y2: num(el.attrs.y2), sub: 1 }]
  if (el.tag === 'polyline' || el.tag === 'polygon') {
    const p = (el.attrs.points || '').match(/-?(?:\d+\.?\d*|\.\d+)/g) || []
    const segs = []
    for (let k = 0; k + 3 < p.length; k += 2) segs.push({ kind: 'line', x1: +p[k], y1: +p[k + 1], x2: +p[k + 2], y2: +p[k + 3], sub: 1 })
    return segs
  }
  return []
}

const EPS = 0.01
const isH = (s) => Math.abs(s.y1 - s.y2) <= EPS && Math.abs(s.x1 - s.x2) > EPS
const isV = (s) => Math.abs(s.x1 - s.x2) <= EPS && Math.abs(s.y1 - s.y2) > EPS
const fmt = (n) => String(Math.round(n * 100) / 100)

// Does an axis-aligned segment pass through the inside of a rect, shrunk by `inset`?
function crosses(s, r, inset = 1) {
  const x0 = r.x + inset
  const x1 = r.x + r.w - inset
  const y0 = r.y + inset
  const y1 = r.y + r.h - inset
  if (x1 <= x0 || y1 <= y0) return false
  if (isH(s)) return s.y1 > y0 && s.y1 < y1 && Math.max(s.x1, s.x2) > x0 && Math.min(s.x1, s.x2) < x1
  if (isV(s)) return s.x1 > x0 && s.x1 < x1 && Math.max(s.y1, s.y2) > y0 && Math.min(s.y1, s.y2) < y1
  return false
}

// Shortest gap between an axis-aligned segment and a rect; 0 when they touch or cross.
function gapToRect(s, r) {
  const sx0 = Math.min(s.x1, s.x2)
  const sx1 = Math.max(s.x1, s.x2)
  const sy0 = Math.min(s.y1, s.y2)
  const sy1 = Math.max(s.y1, s.y2)
  const dx = Math.max(r.x - sx1, sx0 - (r.x + r.w), 0)
  const dy = Math.max(r.y - sy1, sy0 - (r.y + r.h), 0)
  return Math.hypot(dx, dy)
}

// ---- One figure -------------------------------------------------------------

const SHAPES = new Set(['rect', 'circle', 'ellipse', 'line', 'path', 'polyline', 'polygon'])
const MONO = /mono|courier|consolas|menlo|monaco/i

// Ports, commands, URLs, field types and status codes read as technical text.
function isTechnical(text) {
  if (/[0-9/:._()=<>[\]{}@#$%+*-]/.test(text)) return true
  if (/^[A-Z]{2,6}$/.test(text)) return true
  return /^[a-z]+$/.test(text)
}

function checkFigure(svg, sheet, file, notes) {
  const findings = []
  const add = (line, detail, el) =>
    findings.push({ line, file, lineNumber: el ? el.line : svg.line, detail, class: line in NEVER ? 'never' : 'candidate' })
  const css = styleContext(sheet)
  const all = []
  walk(svg, (el) => all.push(el))
  const drawn = all.filter((el) => !inDefs(el))
  const preset = svg.attrs['data-preset'] === 'slide' ? 'slide' : 'doc'
  const faithful = svg.attrs['data-import'] === 'faithful'
  const colorOf = (el, prop) => {
    let v = css.get(el, prop)
    if (v == null) return prop === 'fill' && el.tag !== 'line' ? { r: 0, g: 0, b: 0, a: 1 } : { none: true }
    if (/^currentcolor$/i.test(v.trim())) v = css.get(el, 'color') ?? 'black'
    const c = parseColor(v)
    if (!c) notes.add(`the color "${v}" could not be read`)
    return c
  }
  const rectOf = (el) => {
    const o = offsetOf(el, notes)
    return { x: num(el.attrs.x) + o.x, y: num(el.attrs.y) + o.y, w: num(el.attrs.width), h: num(el.attrs.height) }
  }
  const label = (el) => {
    const t = textOf(el)
    return t ? `"${t.length > 28 ? t.slice(0, 27) + '...' : t}"` : `<${el.tag}>`
  }

  // -- Accessible title
  const kids = svg.children.filter((c) => c.tag !== '#text')
  const title = kids.find((c) => c.tag === 'title')
  const desc = kids.find((c) => c.tag === 'desc')
  const labelled = (svg.attrs['aria-labelledby'] || '').split(/\s+/).filter(Boolean)
  const described = (svg.attrs['aria-describedby'] || '').split(/\s+/).filter(Boolean)
  if (svg.attrs.role !== 'img') add('no-title', 'the root <svg> has no role="img"', svg)
  if (!title || !textOf(title)) add('no-title', 'the root <svg> has no <title>', svg)
  else {
    if (kids[0] !== title) add('no-title', '<title> is not the first child of the root <svg>', title)
    if (!title.attrs.id || !labelled.includes(title.attrs.id)) add('no-title', 'aria-labelledby does not name the <title> id', svg)
    if (title.attrs.id === 'title') add('bare-id', 'the <title> id is a bare "title"; prefix it with the figure slug', title)
  }
  if (!desc || !textOf(desc)) add('no-title', 'the root <svg> has no <desc>', svg)
  else {
    if (!desc.attrs.id || !(labelled.includes(desc.attrs.id) || described.includes(desc.attrs.id))) add('no-title', 'aria-labelledby does not name the <desc> id', svg)
    if (desc.attrs.id === 'desc') add('bare-id', 'the <desc> id is a bare "desc"; prefix it with the figure slug', desc)
    const d = textOf(desc)
    const sentences = d.split(/[.!?](?:\s|$)/).filter((s) => s.trim()).length
    const geo = d.match(/\b(box|boxes|arrow|arrows|rectangle|rectangles|px|pixels|left|right|top|bottom|above|below|dashed)\b/i)
    if (sentences > 1) add('geometry-desc', `<desc> has ${sentences} sentences; it is one sentence about the content`, desc)
    else if (geo) add('geometry-desc', `<desc> says "${geo[0]}"; describe the content, not the geometry`, desc)
  }

  // -- What is in the figure
  const legendEls = drawn.filter((el) => hasClass(el, 'legend') && !inClass(el.parent, 'legend'))
  const inLegend = (el) => inClass(el, 'legend')
  const tagged = drawn.filter((el) => hasClass(el, 'node') && !inClass(el.parent, 'node') && !inLegend(el))
  const vb = (svg.attrs.viewBox || '').split(/[\s,]+/).map(Number)
  const SKIP = ['mask', 'paper', 'zone', 'boundary', 'tag', 'swatch', 'callout', 'legend']
  let nodeEls = tagged
  if (!tagged.length) {
    nodeEls = drawn.filter((el) => {
      if (el.tag !== 'rect' || SKIP.some((k) => inClass(el, k))) return false
      const r = rectOf(el)
      return !(vb.length === 4 && r.w * r.h >= 0.9 * vb[2] * vb[3])
    })
    if (nodeEls.length) notes.add('no class="node" in the figure; every plain <rect> was counted as a node')
  }
  const nodes = nodeEls.map((el) => {
    const shape = el.tag === 'rect' ? el : (() => {
      let found = null
      walk(el, (c) => {
        if (!found && c.tag === 'rect' && !hasClass(c, 'tag')) found = c
      })
      return found
    })()
    return { el, shape, rect: shape ? rectOf(shape) : null, name: label(el) }
  })
  const markerOf = (el, side) => {
    const v = css.get(el, `marker-${side}`)
    return v && v.trim() !== 'none' ? v : null
  }
  const edges = drawn
    .filter((el) => ['path', 'line', 'polyline'].includes(el.tag) && !inLegend(el) && (inClass(el, 'edge') || markerOf(el, 'end') || markerOf(el, 'start')))
    .map((el) => {
      const o = offsetOf(el, notes)
      const segs = segmentsOf(el).map((s) => ({ ...s, x1: s.x1 + o.x, y1: s.y1 + o.y, x2: s.x2 + o.x, y2: s.y2 + o.y }))
      return { el, segs, start: segs[0] && { x: segs[0].x1, y: segs[0].y1 }, end: segs.length ? { x: segs.at(-1).x2, y: segs.at(-1).y2 } : null }
    })
  const zones = drawn.filter((el) => (hasClass(el, 'zone') || hasClass(el, 'boundary')) && !inLegend(el))
  const callouts = drawn.filter((el) => hasClass(el, 'callout') && !inClass(el.parent, 'callout'))
  if (!nodes.length && !edges.length) return { findings, readable: false }

  // -- Budget
  const nodeLimit = faithful ? BUDGET.faithfulNodes : BUDGET.nodes
  if (faithful) add('faithful-import', `the node budget is ${BUDGET.faithfulNodes}, in zones; the connector budget was not applied`, svg)
  if (nodes.length > nodeLimit) add('node-budget', `${nodes.length} nodes, the budget is ${nodeLimit}; split into an overview and a detail`, svg)
  else if (nodes.length === nodeLimit) add('at-budget', `${nodes.length} nodes, exactly the budget; run the four deletion tests`, svg)
  if (!faithful) {
    if (edges.length > BUDGET.connectors) add('connector-budget', `${edges.length} connectors, the budget is ${BUDGET.connectors}`, svg)
    else if (edges.length === BUDGET.connectors) add('at-budget', `${edges.length} connectors, exactly the budget; cover each and ask what is lost`, svg)
  }
  if (callouts.length > BUDGET.callouts) add('callout-budget', `${callouts.length} callouts, the budget is ${BUDGET.callouts}`, callouts[BUDGET.callouts])
  if (nodes.length && nodes.length <= 3 && edges.length <= 2) add('sentence-figure', `${nodes.length} nodes and ${edges.length} connectors; write the sentence and ship it if nothing is lost`, svg)

  // -- Color
  const clusters = []
  const clusterOf = (h) => {
    let c = clusters.find((k) => hueGap(k.hue, h) <= 30)
    if (!c) clusters.push((c = { hue: h, sample: null, units: new Set(), first: null }))
    return c
  }
  const paints = (el) => {
    const out = []
    for (const prop of ['fill', 'stroke']) {
      const c = colorOf(el, prop)
      if (!c || c.none || c.a === 0) continue
      const h = hueOf(c)
      if (h != null) out.push({ h, raw: css.get(el, prop) })
    }
    return out
  }
  for (const el of drawn) {
    if (!SHAPES.has(el.tag) && el.tag !== 'text' && el.tag !== 'tspan') continue
    for (const p of paints(el)) {
      const c = clusterOf(p.h)
      c.sample ??= p.raw
      c.first ??= el
    }
  }
  if (clusters.length > BUDGET.accents) {
    add('accent-colors', `${clusters.length} chromatic hues (${clusters.map((c) => c.sample).join(', ')}); the budget is ${BUDGET.accents}`, clusters[BUDGET.accents].first)
  }
  const units = [
    ...nodes.map((n) => ({ el: n.el, what: `node ${n.name}` })),
    ...edges.map((e) => ({ el: e.el, what: `connector at line ${e.el.line}` })),
    ...zones.map((el) => ({ el, what: `zone at line ${el.line}` })),
    ...callouts.map((el) => ({ el, what: `callout ${label(el)}` })),
  ]
  for (const u of units) {
    if (inClass(u.el, 'link')) continue
    const parts = [u.el]
    walk(u.el, (c) => parts.push(c))
    for (const part of parts) {
      if (!SHAPES.has(part.tag) && part.tag !== 'text' && part.tag !== 'tspan') continue
      for (const p of paints(part)) clusterOf(p.h).units.add(u)
    }
  }
  for (const c of clusters) {
    if (c.units.size > 2) {
      const list = [...c.units]
      add('accent-spread', `${c.sample} is on ${list.length} elements (${list.slice(0, 5).map((u) => u.what).join(', ')}${list.length > 5 ? ', ...' : ''}); keep it on 1 or 2`, list[2].el)
    }
  }
  if (SHIPPED_PALETTE.some((hex) => sheet.source.toLowerCase().includes(hex))) {
    add('shipped-palette', "diagram-design's shipped skin is in the file; that is correct only when the project has no contract", svg)
  }

  // -- Connectors
  const firstNode = nodes.length ? Math.min(...nodes.map((n) => n.el.order)) : Infinity
  const straight = []
  for (const e of edges) {
    if (e.el.order > firstNode) add('edge-over-node', 'this connector is drawn after a node; draw every connector before the first node', e.el)
    if (markerOf(e.el, 'start') && markerOf(e.el, 'end')) add('two-headed', 'arrowheads at both ends; draw a solid request and a dashed return that starts at the recipient', e.el)
    for (let k = 0; k < e.segs.length; k++) {
      const s = e.segs[k]
      const dx = Math.abs(s.x2 - s.x1)
      const dy = Math.abs(s.y2 - s.y1)
      if (s.kind === 'line') {
        if (dx > EPS && dy > EPS) add('diagonal', `a segment runs from ${fmt(s.x1)},${fmt(s.y1)} to ${fmt(s.x2)},${fmt(s.y2)}; route it as a right-angle elbow`, e.el)
        else if (dx > EPS || dy > EPS) straight.push({ ...s, edge: e })
        const nx = e.segs[k + 1]
        if (nx && nx.kind === 'line' && nx.sub === s.sub && ((isH(s) && isV(nx)) || (isV(s) && isH(nx)))) {
          add('sharp-elbow', `a square turn at ${fmt(s.x2)},${fmt(s.y2)}; round it at r=${ELBOW_RADII[0]}`, e.el)
        }
      } else if (Math.abs(dx - dy) > EPS || dx <= EPS) {
        add('diagonal', `a curve from ${fmt(s.x1)},${fmt(s.y1)} to ${fmt(s.x2)},${fmt(s.y2)}; connectors are straight runs joined by rounded elbows`, e.el)
      } else if (!ELBOW_RADII.includes(Math.round(dx * 100) / 100)) {
        add('elbow-radius', `an elbow of radius ${fmt(dx)} at ${fmt(s.x2)},${fmt(s.y2)}; the radius is ${ELBOW_RADII.join(' or ')}`, e.el)
      }
    }
  }
  const boxes = nodes.filter((n) => n.rect && n.rect.w > 0 && n.rect.h > 0)
  const within = (p, r, pad) => p && p.x >= r.x - pad && p.x <= r.x + r.w + pad && p.y >= r.y - pad && p.y <= r.y + r.h + pad
  for (const e of edges) {
    for (const n of boxes) {
      if (within(e.start, n.rect, 1) || within(e.end, n.rect, 1)) continue
      if (e.segs.some((s) => s.kind === 'line' && crosses(s, n.rect))) add('line-through-node', `this connector passes through ${n.name}, where it does not end; reroute it`, e.el)
    }
  }
  for (const n of boxes) {
    const r = n.rect
    const sides = { top: [], bottom: [], left: [], right: [] }
    for (const e of edges) {
      for (const p of [e.start, e.end]) {
        if (!p || !within(p, r, 0.5)) continue
        if (Math.abs(p.y - r.y) <= 0.5) sides.top.push({ at: p.x, e })
        else if (Math.abs(p.y - (r.y + r.h)) <= 0.5) sides.bottom.push({ at: p.x, e })
        else if (Math.abs(p.x - r.x) <= 0.5) sides.left.push({ at: p.y, e })
        else if (Math.abs(p.x - (r.x + r.w)) <= 0.5) sides.right.push({ at: p.y, e })
      }
    }
    for (const [side, list] of Object.entries(sides)) {
      list.sort((a, b) => a.at - b.at)
      for (let k = 1; k < list.length; k++) {
        if (list[k].e !== list[k - 1].e && list[k].at - list[k - 1].at < ATTACH_GAP) {
          add('shared-attach', `two connectors meet the ${side} edge of ${n.name} ${fmt(list[k].at - list[k - 1].at)}px apart; give each its own point, ${ATTACH_GAP}px or more apart`, list[k].e.el)
        }
      }
    }
  }
  const stacked = new Set()
  for (let a = 0; a < straight.length; a++) {
    for (let b = a + 1; b < straight.length; b++) {
      const s = straight[a]
      const t = straight[b]
      if (s.edge === t.edge) continue
      const key = `${Math.min(s.edge.el.order, t.edge.el.order)}:${Math.max(s.edge.el.order, t.edge.el.order)}`
      if (stacked.has(key)) continue
      let off = null
      let overlap = 0
      if (isH(s) && isH(t)) {
        off = Math.abs(s.y1 - t.y1)
        overlap = Math.min(Math.max(s.x1, s.x2), Math.max(t.x1, t.x2)) - Math.max(Math.min(s.x1, s.x2), Math.min(t.x1, t.x2))
      } else if (isV(s) && isV(t)) {
        off = Math.abs(s.x1 - t.x1)
        overlap = Math.min(Math.max(s.y1, s.y2), Math.max(t.y1, t.y2)) - Math.max(Math.min(s.y1, s.y2), Math.min(t.y1, t.y2))
      }
      if (off != null && off < ROUTE_OFFSET && overlap > 1) {
        stacked.add(key)
        add('stacked-strokes', `this run and the connector at line ${s.edge.el.line} are ${fmt(off)}px apart for ${fmt(overlap)}px; offset parallel routes by ${ROUTE_OFFSET}px or more`, t.edge.el)
      }
    }
  }

  // -- Labels and masks
  const masks = drawn.filter((el) => el.tag === 'rect' && hasClass(el, 'mask')).map((el) => ({ el, rect: rectOf(el), used: false }))
  const texts = drawn.filter((el) => el.tag === 'text')
  const sizeOf = (el) => {
    const v = css.get(el, 'font-size')
    if (v == null) return 16
    const m = /^(-?[\d.]+)(px)?$/.exec(v.trim())
    if (!m) {
      notes.add(`the font-size "${v}" is not in px and was not measured`)
      return null
    }
    return parseFloat(m[1])
  }
  for (const t of texts.filter((el) => hasClass(el, 'label') && !inLegend(el))) {
    const o = offsetOf(t, notes)
    const size = sizeOf(t) ?? TYPE[preset].label
    const anchor = css.get(t, 'text-anchor') || 'start'
    const px = num(t.attrs.x) + o.x + (anchor === 'start' ? 1 : anchor === 'end' ? -1 : 0)
    const py = num(t.attrs.y) + o.y - size / 2
    const mask = masks.find((m) => m.el.order < t.order && px >= m.rect.x - 1 && px <= m.rect.x + m.rect.w + 1 && py >= m.rect.y - 1 && py <= m.rect.y + m.rect.h + 1)
    const text = textOf(t)
    if (text.length > LABEL_CHARS) add('long-label', `"${text}" is ${text.length} characters; a connector label holds ${LABEL_CHARS}`, t)
    if (!mask) {
      add('label-on-line', `the label "${text}" has no paper mask drawn behind it`, t)
      continue
    }
    mask.used = true
    let nearest = Infinity
    let on = null
    for (const s of straight) {
      if (crosses(s, mask.rect, 0)) on = s
      nearest = Math.min(nearest, gapToRect(s, mask.rect))
    }
    if (on) add('label-on-line', `the mask behind "${text}" sits on the connector at line ${on.edge.el.line}; move it ${LABEL_CLEAR[0]} to ${LABEL_CLEAR[1]}px clear of the stroke`, mask.el)
    else if (straight.length && (nearest < LABEL_CLEAR[0] || nearest > LABEL_CLEAR[1])) {
      add('label-clearance', `the mask behind "${text}" is ${fmt(nearest)}px from the nearest stroke; ${LABEL_CLEAR[0]} to ${LABEL_CLEAR[1]}px is the range`, mask.el)
    }
  }

  // -- Type
  for (const t of texts) {
    const parts = [t]
    walk(t, (c) => {
      if (c.tag === 'tspan' && (c.attrs.class || c.attrs.style || c.attrs['font-size'] || c.attrs['font-family'])) parts.push(c)
    })
    for (const part of parts) {
      const text = textOf(part)
      if (!text) continue
      const size = sizeOf(part)
      const role = ['name', 'sub', 'label'].find((k) => hasClass(part, k) || hasClass(t, k))
      const floor = role ? TYPE[preset][role] : Math.min(...Object.values(TYPE[preset]))
      if (size != null && size < floor) {
        add('small-text', `"${text}" is ${fmt(size)}px; ${role ? `a ${role === 'sub' ? 'sublabel' : role === 'label' ? 'connector label' : 'node name'} is ${floor}px` : `nothing in a figure goes under ${floor}px`}${preset === 'slide' ? ' on a slide' : ''}`, part)
      }
      const family = css.get(part, 'font-family')
      if (family && MONO.test(family.split(',')[0])) {
        if (role === 'name') add('mono-label', `the node name "${text}" is set in a monospace face; names go in a sans at 600`, part)
        else if (!isTechnical(text)) add('mono-label', `"${text}" is plain words in a monospace face; mono is for ports, commands, URLs and field types`, part)
      }
    }
  }

  // -- Grid, radius, shadow
  for (const n of nodes) {
    if (!n.shape) continue
    const raw = ['x', 'y', 'width', 'height'].map((k) => [k, num(n.shape.attrs[k])])
    const o = offsetOf(n.shape, notes)
    const bad = raw.filter(([, v]) => v % GRID !== 0).map(([k, v]) => `${k}=${fmt(v)}`)
    if (o.x % GRID !== 0 || o.y % GRID !== 0) bad.push(`translate ${fmt(o.x)},${fmt(o.y)}`)
    if (bad.length) add('off-grid', `${n.name} has ${bad.join(', ')}; node origins and sizes divide by ${GRID}`, n.shape)
    const rx = num(n.shape.attrs.rx ?? css.get(n.shape, 'rx', false) ?? 0)
    if (rx !== NODE_RADIUS) add('node-radius', `${n.name} has a corner radius of ${fmt(rx)}; nodes are ${NODE_RADIUS}, never a pill or a soft card`, n.shape)
  }
  for (const el of zones.filter((z) => z.tag === 'rect')) {
    const bad = ['x', 'y', 'width', 'height'].map((k) => [k, num(el.attrs[k])]).filter(([, v]) => v % GRID !== 0)
    if (bad.length) add('off-grid', `a zone has ${bad.map(([k, v]) => `${k}=${fmt(v)}`).join(', ')}; origins and sizes divide by ${GRID}`, el)
  }
  for (const el of drawn.filter((e) => e.tag === 'rect' && hasClass(e, 'tag'))) {
    const rx = num(el.attrs.rx ?? css.get(el, 'rx', false) ?? 0)
    if (rx !== TAG_RADIUS) add('node-radius', `a type tag has a corner radius of ${fmt(rx)}; tags are ${TAG_RADIUS}`, el)
  }
  for (const el of drawn) {
    const f = css.get(el, 'filter', false)
    if (f && f.trim() !== 'none') add('shadow', `filter: ${f}; a figure is print, borders and no shadow`, el)
  }

  // -- Legend
  const styles = new Set()
  const dashes = new Set()
  for (const e of edges) {
    const c = colorOf(e.el, 'stroke')
    if (c && !c.none) styles.add([c.r, c.g, c.b, c.a].map((v) => Math.round(v * 100) / 100).join(','))
    const d = (css.get(e.el, 'stroke-dasharray') || 'none').replace(/[\s,]+/g, ' ').trim()
    dashes.add(d === '0' ? 'none' : d)
  }
  if ((styles.size > 1 || dashes.size > 1) && !legendEls.length) {
    add('missing-legend', `connectors use ${styles.size} colors and ${dashes.size} dash styles and nothing says what they mean; add a legend strip under the figure`, svg)
  }
  if (legendEls.length) {
    let top = Infinity
    for (const lg of legendEls) {
      const parts = [lg]
      walk(lg, (c) => parts.push(c))
      for (const p of parts) {
        const o = offsetOf(p, notes)
        if (p.tag === 'rect') top = Math.min(top, num(p.attrs.y) + o.y)
        else if (p.tag === 'text') top = Math.min(top, num(p.attrs.y) + o.y - (sizeOf(p) ?? 0))
        else if (p.tag === 'circle') top = Math.min(top, num(p.attrs.cy) - num(p.attrs.r) + o.y)
        else for (const s of segmentsOf(p)) top = Math.min(top, s.y1 + o.y, s.y2 + o.y)
      }
    }
    let bottom = -Infinity
    for (const n of boxes) bottom = Math.max(bottom, n.rect.y + n.rect.h)
    for (const e of edges) for (const s of e.segs) bottom = Math.max(bottom, s.y1, s.y2)
    if (Number.isFinite(top) && top < bottom) add('floating-legend', `the legend starts at y=${fmt(top)} and the figure runs to y=${fmt(bottom)}; move it into a strip under the nodes`, legendEls[0])
  }

  return { findings, readable: true }
}

// ---- Files ------------------------------------------------------------------

// Check one source text. Returns { findings, figures, notes, readable }.
export function checkSource(src, file) {
  src = src.replace(/\r\n/g, '\n')
  const lineOf = lineIndex(src)
  const notes = new Set()
  const blocks = []
  const re = /<svg\b[\s\S]*?<\/svg\s*>/gi
  let m
  while ((m = re.exec(src))) blocks.push({ start: m.index, text: m[0] })
  const findings = []
  let figures = 0
  if (!blocks.length) return { findings, figures, notes: [`${file}: no <svg> found`], readable: false }
  const pageCss = []
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi
  while ((m = styleRe.exec(src))) {
    if (!blocks.some((b) => m.index >= b.start && m.index < b.start + b.text.length)) pageCss.push(m[1])
  }
  for (const b of blocks) {
    const root = parseXml(b.text, b.start, lineOf)
    const svg = root.children.find((c) => c.tag === 'svg')
    if (!svg) continue
    const sheet = { rules: [], vars: {}, skipped: new Set(), source: b.text }
    for (const text of pageCss) parseCss(text, sheet)
    walk(svg, (el) => {
      if (el.tag === 'style') parseCss(el.children.map((c) => c.value || '').join(''), sheet)
    })
    for (const el of [svg]) if (el.attrs.style) for (const [k, v] of Object.entries(parseDecls(el.attrs.style))) if (k.startsWith('--')) sheet.vars[k] = v
    const local = new Set()
    const res = checkFigure(svg, sheet, file, local)
    if (!res.readable) {
      notes.add(`${file}:${svg.line}: an <svg> with no nodes and no connectors was skipped`)
      continue
    }
    figures++
    findings.push(...res.findings)
    for (const s of sheet.skipped) local.add(`${s} rules were not resolved`)
    for (const n of local) notes.add(`${file}: ${n}`)
  }
  return { findings, figures, notes: [...notes], readable: figures > 0 }
}

const FIGURE_EXT = new Set(['.svg', '.html', '.htm'])
function collect(path, out, skipped) {
  if (!existsSync(path)) {
    skipped.push(`${path}: not found`)
    return
  }
  if (statSync(path).isDirectory()) {
    for (const f of readdirSync(path).sort()) if (f !== 'node_modules' && !f.startsWith('.')) collect(join(path, f), out, skipped)
    return
  }
  if (FIGURE_EXT.has(extname(path).toLowerCase())) out.push(path)
  else if (extname(path).toLowerCase() === '.md') skipped.push(`${show(path)}: prose, no figure to read; a no-diagram answer is judged by a person`)
}
const show = (p) => (relative(process.cwd(), p) || p).replace(/\\/g, '/')

function run(paths) {
  const files = []
  const notChecked = []
  for (const p of paths) collect(resolve(p), files, notChecked)
  const findings = []
  let figures = 0
  for (const f of files) {
    const res = checkSource(readFileSync(f, 'utf8'), show(f))
    findings.push(...res.findings)
    figures += res.figures
    notChecked.push(...res.notes)
  }
  return { files: files.map(show), figures, findings, notChecked }
}

function tally(findings, cls) {
  const counts = {}
  for (const f of findings) if (f.class === cls) counts[f.line] = (counts[f.line] || 0) + 1
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const list = Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')
  return { total, text: total ? `${total} (${list})` : '0' }
}

// ---- Self-test --------------------------------------------------------------

function selfTest() {
  const here = dirname(fileURLToPath(import.meta.url))
  const skill = join(here, '..')
  let failed = 0
  const say = (ok, what) => {
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`)
    if (!ok) failed++
  }
  const never = (res) => res.findings.filter((f) => f.class === 'never')
  const lines = (res) => [...new Set(res.findings.map((f) => f.line))]

  const exDir = join(skill, 'examples')
  const examples = existsSync(exDir) ? readdirSync(exDir).filter((f) => FIGURE_EXT.has(extname(f))).sort() : []
  say(examples.length > 0, `examples/ holds ${examples.length} figures`)
  const gold = {}
  for (const f of examples) {
    const src = readFileSync(join(exDir, f), 'utf8')
    const res = checkSource(src, `examples/${f}`)
    gold[f] = src
    const n = never(res)
    say(res.readable && n.length === 0, `examples/${f} has no never-intentional line${n.length ? ` (raises ${[...new Set(n.map((x) => x.line))].join(', ')})` : ''}`)
  }

  const tDir = join(skill, 'teaching')
  const pairs = existsSync(tDir) ? readdirSync(tDir).filter((d) => statSync(join(tDir, d)).isDirectory()).sort() : []
  say(pairs.length > 0, `teaching/ holds ${pairs.length} pairs`)
  for (const name of pairs) {
    const dir = join(tDir, name)
    const files = readdirSync(dir)
    const bad = files.find((f) => f.startsWith('bad.'))
    const good = files.find((f) => f.startsWith('good.'))
    if (!bad || !good) {
      say(false, `teaching/${name} has a bad and a good file`)
      continue
    }
    const known = name in NEVER || name in CANDIDATE
    say(known, `teaching/${name} is named for a gate line`)
    const badRes = checkSource(readFileSync(join(dir, bad), 'utf8'), `teaching/${name}/${bad}`)
    const others = [...new Set(never(badRes).map((f) => f.line))].filter((l) => l !== name)
    say(lines(badRes).includes(name), `teaching/${name}/${bad} raises ${name}:${others.length ? ` (also ${others.join(', ')})` : ''}`)
    if (FIGURE_EXT.has(extname(good))) {
      const goodRes = checkSource(readFileSync(join(dir, good), 'utf8'), `teaching/${name}/${good}`)
      const n = never(goodRes)
      say(goodRes.readable && !lines(goodRes).includes(name), `teaching/${name}/${good} does not raise ${name}:`)
      say(n.length === 0, `teaching/${name}/${good} has no never-intentional line${n.length ? ` (raises ${[...new Set(n.map((x) => x.line))].join(', ')})` : ''}`)
    } else {
      say(true, `teaching/${name}/${good} is prose that replaces the figure; nothing to raise`)
    }
  }

  // Lines with no teaching pair are proved by breaking a gold example in one place.
  const mutate = (file, line, from, to, all = false) => {
    const src = gold[file]
    if (!src) return say(false, `mutation ${line}: examples/${file} is missing`)
    const out = all ? src.replaceAll(from, to) : src.replace(from, to)
    if (out === src) return say(false, `mutation ${line}: the text to break was not found in examples/${file}`)
    const res = checkSource(out, `examples/${file} (broken)`)
    say(lines(res).includes(line), `examples/${file} with ${typeof from === 'string' ? `"${from}"` : from} changed raises ${line}:`)
  }
  const many = (n, make) => Array.from({ length: n }, (_, k) => make(k)).join('')
  const first = examples[0]
  if (first) {
    mutate(first, 'node-radius', 'rx="6"', 'rx="16"')
    mutate(first, 'shadow', '<g class="node', '<g filter="drop-shadow(0 4px 12px rgba(0,0,0,0.2))" class="node')
    mutate(first, 'bare-id', /id="[\w-]+-title"/, 'id="title"')
    mutate(first, 'floating-legend', /<g class="legend" transform="translate\(\d+ \d+\)"/, '<g class="legend" transform="translate(32 96)"')
    mutate(first, 'connector-budget', '<g class="nodes">', many(13, (k) => `<path class="edge" d="M0 ${400 + k * 16} H16"/>`) + '<g class="nodes">')
    mutate(first, 'callout-budget', '</svg>', many(3, (k) => `<text class="callout" x="32" y="${600 + k * 16}">note ${k}</text>`) + '</svg>')
    const html = `<!doctype html>\n<html><head><style>body { margin: 0 }</style></head><body>\n${gold[first]}\n</body></html>`
    const res = checkSource(html, `${first} inline in html`)
    say(res.readable && never(res).length === 0, `examples/${first} inline in an .html page reads the same`)
  }
  const probe = (line, body, expect = true, desc = 'A probe figure.') => {
    const src = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" role="img" aria-labelledby="p-title p-desc"><title id="p-title">Probe</title><desc id="p-desc">${desc}</desc>${body}</svg>`
    const res = checkSource(src, `probe ${line}`)
    say(lines(res).includes(line) === expect, `a probe figure ${expect ? 'raises' : 'does not raise'} ${line}:`)
  }
  const box = (x, y, name) => `<g class="node"><rect x="${x}" y="${y}" width="96" height="48" rx="6" fill="#fff" stroke="#262628"/><text class="name" x="${x + 12}" y="${y + 28}" font-size="12">${name}</text></g>`
  probe('line-through-node', `<path class="edge" d="M0 56 H400"/>${box(152, 32, 'Middle')}`)
  probe('shared-attach', `<path class="edge" d="M0 52 H152"/><path class="edge" d="M0 60 H152"/>${box(152, 32, 'Target')}`)
  probe('shared-attach', `<path class="edge" d="M0 48 H152"/><path class="edge" d="M0 64 H152"/>${box(152, 32, 'Target')}`, false)
  probe('stacked-strokes', `<path class="edge" d="M0 120 H300"/><path class="edge" d="M40 124 H260"/>${box(152, 32, 'Above')}`)
  probe('long-label', `<path class="edge" d="M0 120 H300"/><rect class="mask" x="100" y="96" width="120" height="16" fill="#fff"/><text class="label" x="104" y="107" font-size="8">a label well past fourteen</text>${box(152, 16, 'Above')}`)
  probe('label-clearance', `<path class="edge" d="M0 120 H300"/><rect class="mask" x="100" y="60" width="60" height="16" fill="#fff"/><text class="label" x="104" y="71" font-size="8">far</text>${box(200, 8, 'Above')}`)
  probe('at-budget', many(9, (k) => box(8 + (k % 3) * 104, 8 + Math.floor(k / 3) * 56, `N${k}`)))
  probe('elbow-radius', `<path class="edge" d="M0 120 H100 Q112 120 112 132 V180"/>${box(152, 16, 'Above')}`)
  probe('elbow-radius', `<path class="edge" d="M0 120 H104 Q112 120 112 128 V180"/>${box(152, 16, 'Above')}`, false)
  probe('geometry-desc', box(152, 32, 'One'), true, 'Three boxes joined by arrows.')
  const empty = checkSource('<p>no figure here</p>', 'probe empty')
  say(!empty.readable, 'a file with no <svg> is not readable, so the run is inconclusive')

  console.log(failed ? `self-test failed: ${failed} assertion(s)` : 'self-test passed')
  return failed ? 1 : 0
}

// ---- CLI --------------------------------------------------------------------

function main(argv) {
  const args = argv.slice(2)
  const flag = (name) => {
    const i = args.indexOf(name)
    if (i < 0) return false
    args.splice(i, 1)
    return true
  }
  if (flag('--help') || flag('-h')) {
    console.log(HELP)
    return 0
  }
  if (flag('--self-test')) return selfTest()
  const gate = flag('--gate')
  const strict = flag('--strict')
  let reportPath = null
  const ri = args.indexOf('--report')
  if (ri >= 0) {
    reportPath = args[ri + 1]
    args.splice(ri, 2)
  }
  const unknown = args.filter((a) => a.startsWith('--'))
  if (unknown.length) {
    console.error(`unknown option ${unknown.join(', ')}; see --help`)
    return 2
  }

  const res = args.length ? run(args) : { files: [], figures: 0, findings: [], notChecked: ['no files or folders were given'] }
  for (const f of res.findings) console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
  const never = tally(res.findings, 'never')
  const cand = tally(res.findings, 'candidate')
  let status = 'passed'
  let exitCode = 0
  if (never.total || (strict && cand.total)) {
    status = 'failed'
    exitCode = 1
  } else if (!res.figures) {
    status = 'inconclusive'
    exitCode = 2
  }
  if (reportPath) {
    writeFileSync(reportPath, JSON.stringify({ status, exitCode, files: res.files, findings: res.findings, notChecked: [...res.notChecked, ...NOT_CHECKED] }, null, 2) + '\n')
  }
  if (res.findings.length) console.log('')
  console.log(`checked ${res.figures} figure(s) in ${res.files.length} file(s)`)
  console.log(`never intentional: ${never.text}`)
  console.log(`candidates: ${cand.text}`)
  for (const n of res.notChecked) console.log(`not checked: ${n}`)
  console.log('not checked: whether the figure should exist, the surface, the hierarchy, the rendered pixels (see --help)')
  console.log('passing is necessary, not sufficient')
  if (gate || status !== 'passed') {
    if (status === 'passed') console.log('diagram check passed')
    else if (status === 'failed') console.log(`diagram check failed${never.total ? '' : ': --strict and candidate lines remain'}`)
    else console.log('diagram check inconclusive: no readable figure was given')
  }
  return exitCode
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) process.exit(main(process.argv))
