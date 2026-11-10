#!/usr/bin/env node
// film-check.mjs: the gate for khe-launch-film.
//
// Checks a film plan (JSON), a beat sheet (markdown), a render review
// (markdown) and, when ffprobe is on PATH, a rendered file against the plan.
// Every fault prints as one line:  <line-name>: <what and where> (<file>:<line>)
//
//   node scripts/film-check.mjs <files or folders...> [--gate] [--report out.json]
//        [--strict] [--self-test] [--help]
//
// Zero dependencies: Node 20+, node: imports only. Every number below is taken
// from this skill's references; the comment beside each one names the file.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const GATE = 'film check'
const HERE = dirname(fileURLToPath(import.meta.url))
const VIDEO = new Set(['.mp4', '.mov', '.m4v', '.webm', '.mkv', '.gif'])

// ---- The registers (references/launch-video-registers.md, the table) --------
// cuts are per minute, still is a share of frames. Brackets are the lowest and
// highest film of the row, except the UI-motion row, which prints quartiles
// (q). Its hard edge is the averaged row the same reference names as a film
// this register does not make: 9 cuts a minute at 29 % still.
const REGISTERS = {
  'ui-motion': { label: 'UI motion graphics', corpus: 'skale', cuts: { lo: 0, hi: 9, open: true, stated: true, q: [1.5, 5.7], med: 4.0 }, still: { lo: 0, hi: 0.29, open: true, stated: true, q: [0.067, 0.13], med: 0.091 }, lufs: [-18.9, -17.5], sound: ['B', 'C'] },
  'founder-hybrid': { label: 'Founder-led hybrid', corpus: 'skale', cuts: { lo: 0, hi: 13.5, gap: [3.6, 12.9] }, still: { lo: 0.058, hi: 0.289, med: 0.181 }, lufs: [-31.1, -17.1], sound: ['D'] },
  'live-action': { label: 'Live action', corpus: 'skale', cuts: { lo: 10, hi: 23.4 }, still: { lo: 0.115, hi: 0.483, med: 0.277 }, lufs: [-26.8, -22.3], sound: ['D'] },
  'product-camera': { label: 'Product camera', corpus: 'acclaimed', cuts: { lo: 9.8, hi: 17.5, med: 14.0 }, still: { lo: 0.343, hi: 0.588, med: 0.486 }, lufs: [-35.8, -16.9], sound: ['E'] },
  'keynote-cards': { label: 'Keynote cards + demo', corpus: 'acclaimed', cuts: { lo: 0, hi: 19.0, med: 12.0 }, still: { lo: 0.024, hi: 0.611, med: 0.368 }, lufs: [-32.6, -12.5], sound: ['C'] },
  'kinetic-type': { label: 'Kinetic type / collage', corpus: 'acclaimed', cuts: { lo: 0, hi: Infinity, med: 3.3 }, still: { lo: 0.097, hi: 0.552, med: 0.171 }, lufs: [-21.4, -17.2], sound: ['B', 'C'] },
  'beat-cut': { label: 'Beat-cut sizzle', corpus: 'acclaimed', cuts: { lo: 18.2, hi: 60.6, med: 30.7 }, still: { lo: 0.13, hi: 0.366, med: 0.285 }, lufs: [-20.9, -12.1], sound: ['C'], maxRuntime: 40 },
  'continuous-camera': { label: 'Continuous camera, material world', corpus: 'acclaimed', films: 2, cuts: { lo: 2.9, hi: 14.5 }, still: { lo: 0.165, hi: 0.188 }, lufs: [-22.3, -15.2], sound: null },
}
const ALIASES = {
  'ui-motion-graphics': 'ui-motion', 'ui': 'ui-motion', 'founder': 'founder-hybrid', 'founder-led-hybrid': 'founder-hybrid',
  'keynote': 'keynote-cards', 'keynote-cards-+-demo': 'keynote-cards', 'keynote-cards-and-demo': 'keynote-cards',
  'kinetic-type-/-collage': 'kinetic-type', 'kinetic': 'kinetic-type', 'beat-cut-sizzle': 'beat-cut', 'sizzle': 'beat-cut',
  'continuous-camera,-material-world': 'continuous-camera',
}

// ---- Thresholds, each with its reference -----------------------------------
const T = {
  nameModes: { early: [0, 0.11], 'problem-end': [0.06, 0.51], late: [0.40, 0.83] }, // launch-video-structure, The name
  nameQuiet: [0.22, 0.40],        // launch-video-structure, Gotcha: no acclaimed film names between 22 % and 40 %
  firstWord: 1.3, firstSeam: 3.6, // launch-video-review, rubric row 2
  endcard: [4.4, 6.3],            // launch-video-review, rubric row 8
  holdMin: { skale: 1.1, acclaimed: 1.5 }, // launch-video-structure, Endcard: the lower quartile of each corpus
  holdMax: 2.9,                   // launch-video-review, Dead time
  payoff: [0.1, 1.2],             // launch-video-structure, Payoff
  deadCut: 0.4,                   // launch-video-cuts, the dead cut
  staggerFloor: 0.065, staggerNote: 0.13, // launch-video-type, Cadence: fastest per-film median; the music range starts at 0.13
  holdFloor: 0.5, holdNote: 1.15, // launch-video-type, Cadence: the bottom of the hold range; the median
  readMax: 33, readNote: 21, recogniseMax: 150, // launch-video-ui-demo, Typed prompts
  truePeak: -1,                   // launch-video-sound: -1 dBTP, always
  stillTol: 0.03,                 // launch-video-review: pulldown alone adds about 3 points of still share
  seamTechniques: 3, seamPrimary: 0.6, // launch-video-seams, the budget
  stingMax: 15,                   // launch-video-sound, register A: reveals and stings under 15 s
}
// launch-video-formats (Vertical and square) and film-as-function-of-time (Delivery gates)
const FORMATS = { '16:9': [[1920, 1080], [3840, 2160]], '9:16': [[1080, 1920]], '1:1': [[1080, 1080]], '4:5': [[1080, 1350]] }
const LEVEL = { hd: 42, uhd: 52 }
const GB = 1024 ** 3
const OWNERS = /launch-video-[a-z-]+|film-as-function-of-time|[a-z-]+-reconciliation|sound-motion-sync|sound-from-motion|khe-sound/

// ---- The vocabulary --------------------------------------------------------
const NEVER = {
  'unreadable': 'the file does not parse',
  'no-register': 'no register named, so no number in the plan has a row to come from',
  'unknown-register': 'a register the references do not define, or two rows blended into one',
  'plan-incomplete': 'a decision the plan must settle is missing or is not a number',
  'plan-mismatch': 'two parts of the plan give different answers for the same thing',
  'beat-gap': 'time between two beats that no beat covers',
  'beat-overlap': 'a beat that starts before the beat above it ends',
  'beat-sum': 'the beats do not add up to the runtime',
  'name-window': 'the name lands outside the window of its mode, has no mode, or is held late for a product nobody knows',
  'endcard-hold': 'a final hold shorter than the register\'s minimum, or longer than the endcard',
  'cut-rate': 'cuts a minute outside the register\'s measured range',
  'still-share': 'still share outside the register\'s measured range',
  'seam-untyped': 'a seam row with no type: cut, match-cut or morph',
  'vector-mismatch': 'a cut whose exit and entry disagree on axis or direction',
  'dead-cut': 'a settled frame, then a scene that waits past 0.4 s',
  'crossfade-dip': 'a crossfade or dip with no ground both scenes share',
  'block-fade': 'a line of copy faded in as one block',
  'type-too-fast': 'type faster than it can be read',
  'sound-before-lock': 'cues or a track placed before picture is marked locked',
  'true-peak': 'a true peak above -1 dBTP',
  'cropped-vertical': 'a vertical or square cut cropped from, or letterboxed around, the master',
  'unsourced-beat': 'a beat-sheet row with an empty "taken from" cell',
  'missing-beat': 'a beat sheet without one of its required beats',
  'no-frame': 'a review row whose Before has no time and frame, no quoted source line and no "whole film"',
  'no-owner': 'a review row whose Why names no owning reference',
  'no-not-checked': 'a review with no "Not checked:" line',
  'render-duration': 'the file runs longer or shorter than the plan by more than one frame',
  'render-fps': 'the file\'s frame rate is not the plan\'s',
  'render-frames': 'the file\'s frame count is not runtime times fps',
  'render-resolution': 'the file\'s size is not one of the plan\'s formats',
  'render-level': 'H.264 level above 4.2 at 1080p or 5.2 at 4K',
  'render-size': 'a 4K file of 1 GB or more',
  'gif-fps': 'a GIF at a rate other than 25 or 50 fps',
}
const CANDIDATE = {
  'cut-rate-edge': 'one cut more or fewer changes the verdict, or the rate sits past a quartile or between two modes',
  'still-share-edge': 'still share within 0.03 of a range edge, or past a quartile',
  'thin-row': 'the register rests on two films',
  'name-edge': 'a name where no film in that corpus put one',
  'hook-late': 'first word after 1.3 s or first seam after 3.6 s',
  'endcard-length': 'an endcard outside 4.4 to 6.3 s',
  'endcard-hold-edge': 'a final hold past 2.9 s',
  'payoff-gap': 'the payoff is not 0.1 to 1.2 s before the endcard cut',
  'seam-budget': 'more than 3 seam techniques, or no technique carrying 60 % of the cuts',
  'no-carrier': 'a morph or match-cut row that names no carrier',
  'type-edge': 'type inside the measured range but faster than its median',
  'sound-fit': 'a sound register the references do not pair with this film register',
  'loudness-edge': 'a loudness target outside what the register\'s films measured',
  'register-length': 'a beat-cut film longer than 40 s',
  'engine-fit': 'an engine whose own gates belong to another register',
  'bare-url': 'a URL on the endcard with no verb',
  'format-size': 'a format whose size is not the one the references give for its aspect',
  'render-format': 'a file size the references do not list as a delivery format',
  'no-film-json': 'a review with no per-film JSON block',
}
const NOT_CHECKED = [
  'whether the film is worth watching, and whether its register was the right pick',
  'any pixel: dead cuts, foreign grounds and reversals are read from frames, never from a plan',
  'cut counts and still share on a render: recount by eye at native fps',
  'loudness, true peak and sync on a render (ffmpeg ebur128 and frames)',
  'motion inside a shot: floats, springs on a camera, cursor size',
  'that every rendered frame decodes, on the hardware decoder',
]

// ---- Small helpers ---------------------------------------------------------
const num = (x) => (Number.isFinite(x) ? String(Math.round(x * 1000) / 1000) : String(x))
const pc = (x) => `${num(x * 100)} %`
const isNum = (x) => typeof x === 'number' && Number.isFinite(x)
const show = (p) => { const r = relative(process.cwd(), p); return (r && !r.startsWith('..') ? r : p).replace(/\\/g, '/') }
const norm = (s) => String(s ?? '').trim().toLowerCase().replace(/[\s_]+/g, '-')

function registerKey(raw) {
  const s = norm(raw)
  if (REGISTERS[s]) return { key: s }
  if (ALIASES[s]) return { key: ALIASES[s] }
  const parts = String(raw).toLowerCase().split(/\s*(?:\+|\/|&|,|\band\b|\bx\b)\s*/).map(norm).filter(Boolean)
  const known = parts.map((p) => (REGISTERS[p] ? p : ALIASES[p])).filter(Boolean)
  if (parts.length > 1 && known.length > 1) return { key: null, why: `two rows named (${known.join(', ')}); pick one and take every number from it` }
  return { key: null, why: `"${raw}" is not a register; the rows are ${Object.keys(REGISTERS).join(', ')}` }
}

// JSON with line numbers: path -> line, so a finding can point at its key.
function parseJson(text) {
  let i = 0
  let line = 1
  const lines = new Map()
  const fail = (m) => { const e = new Error(m); e.line = line; throw e }
  const ws = () => { for (; i < text.length; i++) { const c = text[i]; if (c === '\n') line++; else if (c !== ' ' && c !== '\t' && c !== '\r') break } }
  const str = () => {
    const start = i++
    while (i < text.length && text[i] !== '"') { if (text[i] === '\\') i++; i++ }
    if (i >= text.length) fail('unterminated string')
    i++
    try { return JSON.parse(text.slice(start, i)) } catch { fail('bad string') }
  }
  const val = (path) => {
    ws()
    lines.set(path, line)
    const c = text[i]
    if (c === '{') {
      i++
      const o = {}
      ws()
      if (text[i] === '}') { i++; return o }
      for (;;) {
        ws()
        if (text[i] !== '"') fail('expected a key')
        const keyLine = line
        const k = str()
        ws()
        if (text[i] !== ':') fail('expected ":"')
        i++
        const p = path ? `${path}.${k}` : k
        o[k] = val(p)
        lines.set(p, keyLine)
        ws()
        if (text[i] === ',') { i++; continue }
        if (text[i] === '}') { i++; return o }
        fail('expected "," or "}"')
      }
    }
    if (c === '[') {
      i++
      const a = []
      ws()
      if (text[i] === ']') { i++; return a }
      for (;;) {
        a.push(val(`${path}[${a.length}]`))
        ws()
        if (text[i] === ',') { i++; continue }
        if (text[i] === ']') { i++; return a }
        fail('expected "," or "]"')
      }
    }
    if (c === '"') return str()
    const m = /^(?:-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/.exec(text.slice(i, i + 40))
    if (!m) fail(`unexpected ${c === undefined ? 'end of file' : `"${c}"`}`)
    i += m[0].length
    return JSON.parse(m[0])
  }
  const value = val('')
  ws()
  if (i < text.length) fail('content after the closing brace')
  return { value, lineOf: (p) => lines.get(p) ?? 1 }
}

// ---- Shared checks (a plan and a beat sheet answer the same questions) ------
function checkName({ at, mode, known, runtime, reg, line }, add) {
  const m = norm(mode)
  if (!T.nameModes[m]) { add('name-window', line, `the name has no mode (${mode === undefined || mode === null ? 'none given' : `"${mode}"`}); pick early, problem-end or late and commit`); return }
  const pct = at / runtime
  const [lo, hi] = T.nameModes[m]
  if (pct < lo - 1e-9 || pct > hi + 1e-9) add('name-window', line, `the name lands at ${num(at)} s, ${pc(pct)} of runtime; ${m} allows ${pc(lo)} to ${pc(hi)}`)
  else if (m === 'late' && known !== true) add('name-window', line, `the name is held to ${pc(pct)} of runtime for a product its audience does not know; the late mode is out, name it early (by 11 %) or where the problem act ends (median 29 %)`)
  else if (m === 'late' && reg?.corpus === 'skale') add('name-edge', line, `a late name (${pc(pct)}) in a ${reg.label} film; late names were seen only in the acclaimed films`)
  else if (reg?.corpus === 'acclaimed' && pct > T.nameQuiet[0] && pct < T.nameQuiet[1]) add('name-edge', line, `the name lands at ${pc(pct)}; no acclaimed film names between 22 % and 40 %`)
}

function checkEndcard({ start, hold, runtime, reg, line, holdLine }, add) {
  const length = runtime - start
  const min = reg ? T.holdMin[reg.corpus] : Math.min(T.holdMin.skale, T.holdMin.acclaimed)
  if (hold > length + 1e-9) add('endcard-hold', holdLine, `a final hold of ${num(hold)} s inside an endcard of ${num(length)} s`)
  else if (hold < min - 1e-9) add('endcard-hold', holdLine, `the endcard's final hold is ${num(hold)} s; the minimum${reg ? ` for ${reg.label}` : ''} is ${num(min)} s, and the target is about 2 s`)
  else if (hold > T.holdMax + 1e-9) add('endcard-hold-edge', holdLine, `the final hold is ${num(hold)} s; past ${T.holdMax} s it reads as dead time`)
  if (length < T.endcard[0] - 1e-9 || length > T.endcard[1] + 1e-9) add('endcard-length', line, `the endcard runs ${num(length)} s; the target is ${T.endcard[0]} to ${T.endcard[1]} s`)
}

function checkHook({ word, seam, key, line, seamLine }, add) {
  if (word === null && key !== 'product-camera') add('hook-late', line, 'no first readable word planned; only product-camera films run without display copy')
  if (isNum(word) && word > T.firstWord + 1e-9) add('hook-late', line, `the first readable word lands at ${num(word)} s; the target is by ${T.firstWord} s`)
  if (isNum(seam) && seam > T.firstSeam + 1e-9) add('hook-late', seamLine, `the first seam lands at ${num(seam)} s; the target is by ${T.firstSeam} s`)
}

function checkPayoff({ payoff, start, line }, add) {
  const d = start - payoff
  if (d < T.payoff[0] - 1e-9 || d > T.payoff[1] + 1e-9) add('payoff-gap', line, `the payoff lands ${num(d)} s before the endcard cut; the measured films land it ${T.payoff[0]} to ${T.payoff[1]} s before`)
}

// ---- A film plan (JSON) ----------------------------------------------------
function checkPlan(text, add) {
  let parsed
  try { parsed = parseJson(text) } catch (e) { add('unreadable', e.line ?? 1, `not valid JSON: ${e.message}`); return null }
  const plan = parsed.value
  const L = parsed.lineOf
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) { add('unreadable', 1, 'a film plan is one JSON object'); return null }
  const need = (path, ok, what) => { if (!ok) add('plan-incomplete', L(path.split('.')[0] in plan ? path : ''), what); return ok }

  // 1. The register: every later number is read from its row.
  let reg = null
  let key = null
  if (plan.register === undefined || plan.register === null || String(plan.register).trim() === '') add('no-register', L('register'), 'the plan names no register, so cuts a minute, still share and loudness have no row to come from')
  else {
    const r = registerKey(plan.register)
    if (r.key) { key = r.key; reg = REGISTERS[key] } else add('unknown-register', L('register'), r.why)
  }

  const runtime = plan.runtime
  const fps = plan.fps
  const okRuntime = need('runtime', isNum(runtime) && runtime > 0, 'runtime must be a number of seconds above 0')
  const okFps = need('fps', isNum(fps) && fps > 0, 'fps must be the native frame rate, a number above 0')
  const tol = okFps ? 0.5 / fps : 0.02

  // 2. Beats: contiguous from 0 to the runtime.
  let beatsOk = false
  if (need('beats', Array.isArray(plan.beats) && plan.beats.length > 0, 'beats must be a list with a start and an end for each')) {
    beatsOk = true
    plan.beats.forEach((b, i) => { if (!b || !isNum(b.start) || !isNum(b.end) || b.end <= b.start) { beatsOk = false; add('plan-incomplete', L(`beats[${i}]`), `beat ${i + 1}${b?.id ? ` "${b.id}"` : ''} needs a start and a later end, in seconds`) } })
    if (beatsOk) {
      const name = (b, i) => `"${b.id ?? `beat ${i + 1}`}"`
      let broken = false
      if (plan.beats[0].start > tol) { broken = true; add('beat-gap', L('beats[0]'), `the film opens with ${num(plan.beats[0].start)} s that no beat covers`) }
      for (let i = 1; i < plan.beats.length; i++) {
        const a = plan.beats[i - 1]
        const b = plan.beats[i]
        const d = b.start - a.end
        if (d > tol) { broken = true; add('beat-gap', L(`beats[${i}]`), `${num(d)} s uncovered between ${name(a, i - 1)} (ends ${num(a.end)} s) and ${name(b, i)} (starts ${num(b.start)} s)`) }
        else if (d < -tol) { broken = true; add('beat-overlap', L(`beats[${i}]`), `${name(b, i)} starts at ${num(b.start)} s, ${num(-d)} s before ${name(a, i - 1)} ends (${num(a.end)} s)`) }
      }
      const sum = plan.beats.reduce((s, b) => s + (b.end - b.start), 0)
      if (!broken && okRuntime && Math.abs(sum - runtime) > tol) add('beat-sum', L(`beats[${plan.beats.length - 1}]`), `the beats cover ${num(sum)} s; the runtime is ${num(runtime)} s`)
    }
  }

  // 3. The seam ledger.
  const seams = Array.isArray(plan.seams) ? plan.seams : null
  need('seams', seams !== null, 'seams must be a list, one row per scene change, written before the timeline')
  let nonMorph = 0
  if (seams) {
    const techniques = new Map()
    seams.forEach((s, i) => {
      const at = L(`seams[${i}]`)
      const label = `seam ${i + 1}${isNum(s?.at) ? ` at ${num(s.at)} s` : ''}`
      if (!s || !isNum(s.at) || (okRuntime && (s.at <= 0 || s.at >= runtime))) add('plan-incomplete', at, `${label} needs a time inside the film`)
      const type = norm(s?.type)
      if (!['cut', 'match-cut', 'morph'].includes(type)) add('seam-untyped', at, `${label} has ${s?.type ? `type "${s.type}"` : 'no type'}; type it cut, match-cut or morph`)
      if (type !== 'morph') {
        nonMorph++
        if (s?.technique) techniques.set(norm(s.technique), (techniques.get(norm(s.technique)) ?? 0) + 1)
      }
      if ((type === 'morph' || type === 'match-cut') && !s?.carrier) add('no-carrier', at, `${label} is a ${type} with no carrier; name what crosses the cut`)
      if (/cross-?fade|dissolve|\bdip\b/i.test(String(s?.technique ?? '')) && s?.shared_ground !== true) add('crossfade-dip', at, `${label} is a ${s.technique} with no ground both scenes share; hard-cut on the palette change, or dip through one painted ground`)
      if (type === 'cut' && s?.exit && s?.entry && (s.exit.axis !== s.entry.axis || s.exit.dir !== s.entry.dir)) add('vector-mismatch', at, `${label}: exit ${s.exit.axis} ${s.exit.dir} is answered by entry ${s.entry.axis} ${s.entry.dir}; same axis, same direction, on both sides`)
      if (type !== 'morph' && s?.exit_moving === false && isNum(s?.entry_acts_in) && s.entry_acts_in > T.deadCut + 1e-9) add('dead-cut', at, `${label}: the outgoing scene has settled and the incoming one first acts ${num(s.entry_acts_in)} s in; cut mid-motion, or act within 0.3 to 0.4 s`)
    })
    const counts = [...techniques.values()]
    const total = counts.reduce((a, b) => a + b, 0)
    if (techniques.size > T.seamTechniques) add('seam-budget', L('seams'), `${techniques.size} seam techniques across ${total} cuts; the budget is 2 to 3`)
    else if (total > 2 && Math.max(...counts) / total < T.seamPrimary - 1e-9) add('seam-budget', L('seams'), `no technique carries 60 % of the cuts (the largest carries ${pc(Math.max(...counts) / total)})`)
  }

  // 4. Cut rate and still share, inside the register's row.
  const cuts = plan.cuts
  const okCuts = need('cuts', Number.isInteger(cuts) && cuts >= 0, 'cuts must be a whole number of hard cuts')
  if (okCuts && seams && cuts !== nonMorph) add('plan-mismatch', L('cuts'), `cuts is ${cuts}, but the ledger types ${nonMorph} row${nonMorph === 1 ? '' : 's'} as a cut; one row per scene change`)
  if (okCuts && okRuntime && reg) {
    const c = reg.cuts
    const inside = (rate) => rate >= c.lo - 1e-9 && (c.open ? rate < c.hi - 1e-9 : rate <= c.hi + 1e-9)
    const rate = (n) => (n / runtime) * 60
    const now = rate(cuts)
    const v = inside(now)
    const flips = [cuts - 1, cuts + 1].filter((n) => n >= 0).some((n) => inside(rate(n)) !== v)
    const range = c.open ? `under ${num(c.hi)}` : `${num(c.lo)} to ${c.hi === Infinity ? '76 and above' : num(c.hi)}`
    if (!v && (c.stated || !flips)) add('cut-rate', L('cuts'), `${cuts} cuts in ${num(runtime)} s is ${num(now)} a minute; ${reg.label} runs ${range}${c.med ? ` (median ${num(c.med)})` : ''}${c.stated ? ', and 9 a minute is the average of two rows, a film neither makes' : ''}`)
    else if (!v) add('cut-rate-edge', L('cuts'), `${num(now)} cuts a minute is outside ${reg.label} (${range}), but one cut fewer or more is inside`)
    else if (flips) add('cut-rate-edge', L('cuts'), `${num(now)} cuts a minute is inside ${reg.label} (${range}), but one cut more or fewer leaves it`)
    else if (c.q && (now < c.q[0] - 1e-9 || now > c.q[1] + 1e-9)) add('cut-rate-edge', L('cuts'), `${num(now)} cuts a minute is past the ${reg.label} quartiles (${c.q[0]} to ${c.q[1]}): a note, not a miss`)
    else if (c.gap && now > c.gap[0] + 1e-9 && now < c.gap[1] - 1e-9) add('cut-rate-edge', L('cuts'), `${num(now)} cuts a minute sits between the two measured modes of ${reg.label} (0 to ${c.gap[0]}, or about 13)`)
  }
  const still = plan.still_share
  if (need('still_share', isNum(still) && still >= 0 && still <= 1, 'still_share must be a share from 0 to 1') && reg) {
    const s = reg.still
    const inside = still >= s.lo - 1e-9 && (s.open ? still < s.hi - 1e-9 : still <= s.hi + 1e-9)
    const dist = inside ? Math.min(still - s.lo, s.hi - still) : still < s.lo ? s.lo - still : still - s.hi
    const range = s.open ? `under ${num(s.hi)}` : `${num(s.lo)} to ${num(s.hi)}`
    if (!inside && (s.stated || dist > T.stillTol + 1e-9)) add('still-share', L('still_share'), `a still share of ${num(still)} is outside ${reg.label} (${range}${s.med ? `, median ${num(s.med)}` : ''}); compare still share only inside one register`)
    else if (!inside) add('still-share-edge', L('still_share'), `a still share of ${num(still)} is ${num(dist)} outside ${reg.label} (${range})`)
    else if (!s.stated && dist <= T.stillTol + 1e-9) add('still-share-edge', L('still_share'), `a still share of ${num(still)} is within ${T.stillTol} of the edge of ${reg.label} (${range})`)
    else if (s.q && (still < s.q[0] - 1e-9 || still > s.q[1] + 1e-9)) add('still-share-edge', L('still_share'), `a still share of ${num(still)} is past the ${reg.label} quartiles (${s.q[0]} to ${s.q[1]}): a note, not a miss`)
  }
  if (reg?.films === 2) add('thin-row', L('register'), `${reg.label} rests on two films; read its range as two points, not a tendency`)
  if (reg?.maxRuntime && okRuntime && runtime > reg.maxRuntime + 1e-9) add('register-length', L('runtime'), `a ${reg.label} of ${num(runtime)} s; all four measured ran 38.1 s or less`)
  if (key && key !== 'beat-cut' && /scenario/i.test(String(plan.engine ?? ''))) add('engine-fit', L('engine'), `scenario-kinetic-film's gates belong to the beat-cut register, not ${reg.label}`)

  // 5. The hook, the name, the payoff and the endcard.
  if (need('first_word', plan.first_word === null || (isNum(plan.first_word) && plan.first_word >= 0), 'first_word must be a time in seconds, or null when the film carries no display copy')) {
    const firstSeam = seams?.filter((s) => isNum(s?.at)).reduce((m, s) => Math.min(m, s.at), Infinity)
    if (isNum(plan.first_seam) && Number.isFinite(firstSeam) && Math.abs(plan.first_seam - firstSeam) > tol) add('plan-mismatch', L('first_seam'), `first_seam is ${num(plan.first_seam)} s, but the ledger's first row is at ${num(firstSeam)} s`)
    checkHook({ word: plan.first_word, seam: isNum(plan.first_seam) ? plan.first_seam : Number.isFinite(firstSeam) ? firstSeam : undefined, reg, key, line: L('first_word'), seamLine: L(isNum(plan.first_seam) ? 'first_seam' : 'seams') }, add)
  }
  if (need('name', plan.name && typeof plan.name === 'object' && isNum(plan.name.at), 'name must give the time the product is named: { "at": seconds, "mode": "early" | "problem-end" | "late" }') && okRuntime) {
    checkName({ at: plan.name.at, mode: plan.name.mode, known: plan.known_brand, runtime, reg, line: L('name') }, add)
  }
  const end = plan.endcard
  if (need('endcard', end && typeof end === 'object' && isNum(end.start) && isNum(end.hold) && (!okRuntime || (end.start > 0 && end.start < runtime)), 'endcard must give { "start": seconds, "hold": seconds } inside the film') && okRuntime) {
    checkEndcard({ start: end.start, hold: end.hold, runtime, reg, line: L('endcard'), holdLine: L('endcard') }, add)
    if (beatsOk && !plan.beats.some((b) => Math.abs(b.start - end.start) <= tol)) add('plan-mismatch', L('endcard'), `the endcard starts at ${num(end.start)} s, but no beat starts there`)
    if (isNum(plan.payoff)) checkPayoff({ payoff: plan.payoff, start: end.start, line: L('payoff') }, add)
    if (end.url && !end.verb) add('bare-url', L('endcard'), `the endcard shows ${end.url} with no verb; a URL only with a verb and somewhere to go`)
  }

  // 6. Type on screen.
  if (plan.type !== undefined && need('type', Array.isArray(plan.type), 'type must be a list of the lines the film carries')) {
    plan.type.forEach((t, i) => {
      const at = L(`type[${i}]`)
      const label = `"${String(t?.text ?? `line ${i + 1}`)}"`
      const build = norm(t?.build)
      if (build === 'block' || build === 'fade') add('block-fade', at, `${label} fades in as one block; build it per word about every 0.2 s`)
      if (isNum(t?.stagger) && build !== 'typed' && t?.card !== true) {
        if (t.stagger < T.staggerFloor - 1e-9) add('type-too-fast', at, `${label} steps its words ${num(t.stagger)} s apart; no measured film reads under ${T.staggerFloor} s, and the target is about 0.2 s`)
        else if (t.stagger < T.staggerNote - 1e-9) add('type-edge', at, `${label} steps its words ${num(t.stagger)} s apart; music films run 0.13 to 0.2 s`)
      }
      if (isNum(t?.hold)) {
        if (t.hold < T.holdFloor - 1e-9) add('type-too-fast', at, `${label} holds ${num(t.hold)} s after its last word; under ${T.holdFloor} s nobody reads it, and the target is 1.15 to 1.5 s`)
        else if (t.hold < T.holdNote - 1e-9) add('type-edge', at, `${label} holds ${num(t.hold)} s after its last word; the median is 1.15 s`)
      }
    })
  }
  if (plan.prompts !== undefined && need('prompts', Array.isArray(plan.prompts), 'prompts must be a list of the typed prompts the film shows')) {
    plan.prompts.forEach((p, i) => {
      const at = L(`prompts[${i}]`)
      const job = norm(p?.job).replace('recognize', 'recognise')
      if (!p || !isNum(p.chars) || !isNum(p.seconds) || p.seconds <= 0 || !['read', 'recognise'].includes(job)) { add('plan-incomplete', at, `prompt ${i + 1} needs chars, seconds and a job: read or recognise`); return }
      const cps = Math.round((p.chars / p.seconds) * 10) / 10
      if (job === 'read' && cps > T.readMax + 1e-9) add('type-too-fast', at, `a prompt the viewer must read types at ${num(cps)} characters a second (${p.chars} in ${num(p.seconds)} s); the measured range ends at ${T.readMax}, and the target is about 15`)
      else if (job === 'read' && cps > T.readNote + 1e-9) add('type-edge', at, `a prompt the viewer must read types at ${num(cps)} characters a second; the upper quartile is ${T.readNote}, the median 15`)
      else if (job === 'recognise' && cps > T.recogniseMax + 1e-9) add('type-edge', at, `a prompt types at ${num(cps)} characters a second; the fastest measured is ${T.recogniseMax}`)
    })
  }

  // 7. Sound: register and loudness in the plan, cues only after picture lock.
  need('picture_locked', typeof plan.picture_locked === 'boolean', 'picture_locked must be true or false')
  const snd = plan.sound
  if (need('sound', snd && typeof snd === 'object', 'sound must name its register and loudness: { "register": "A" to "E", "lufs": n, "true_peak": n }')) {
    const sr = String(snd.register ?? '').trim().toUpperCase()
    if (need('sound.register', /^[A-E]$/.test(sr), `sound.register must be A, B, C, D or E${snd.register ? `, not "${snd.register}"` : ''}`) && reg?.sound) {
      const sting = sr === 'A' && isNum(runtime) && runtime < T.stingMax
      if (!reg.sound.includes(sr) && !sting) add('sound-fit', L('sound'), `sound register ${sr} under a ${reg.label} film; the references pair that row with ${reg.sound.join(' or ')}`)
    }
    if (need('sound.lufs', isNum(snd.lufs), 'sound.lufs must state the integrated loudness target') && reg && (snd.lufs < reg.lufs[0] - 1e-9 || snd.lufs > reg.lufs[1] + 1e-9)) add('loudness-edge', L('sound'), `${num(snd.lufs)} LUFS is outside what ${reg.label} films measured (${reg.lufs[0]} to ${reg.lufs[1]}); loudness is a choice, so write the reason`)
    if (need('sound.true_peak', isNum(snd.true_peak), 'sound.true_peak must state the true-peak ceiling') && snd.true_peak > T.truePeak + 1e-9) add('true-peak', L('sound'), `a true peak of ${num(snd.true_peak)} dBTP; the ceiling is -1 dBTP in every register`)
    const placed = (Array.isArray(snd.cues) && snd.cues.length > 0) || Boolean(snd.track) || (Array.isArray(snd.stems) && snd.stems.length > 0)
    if (placed && plan.picture_locked !== true) add('sound-before-lock', L('sound'), 'cues or a track are placed while picture_locked is not true; name the register and loudness, lock picture, then place sound on frames')
  }

  // 8. Formats.
  if (plan.formats !== undefined && need('formats', Array.isArray(plan.formats), 'formats must be a list of { "aspect", "width", "height", "layout" }')) {
    plan.formats.forEach((f, i) => {
      const at = L(`formats[${i}]`)
      const layout = norm(f?.layout)
      if (/crop|letterbox|pillarbox|centred|centered/.test(layout)) add('cropped-vertical', at, `the ${f.aspect} cut is the master ${layout}; lay it out again as its own composition`)
      const sizes = FORMATS[f?.aspect]
      if (sizes && isNum(f.width) && isNum(f.height) && !sizes.some(([w, h]) => w === f.width && h === f.height)) add('format-size', at, `${f.aspect} at ${f.width} x ${f.height}; the references give ${sizes.map(([w, h]) => `${w} x ${h}`).join(' or ')}`)
    })
  }
  return plan
}

// ---- Markdown: a beat sheet and a review -----------------------------------
const cellsOf = (line) => line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
const isRule = (cells) => cells.every((c) => /^:?-+:?$/.test(c))
function tableAfter(lines, headerIndex) {
  const rows = []
  for (let i = headerIndex + 1; i < lines.length && lines[i].trim().startsWith('|'); i++) {
    const cells = cellsOf(lines[i])
    if (!isRule(cells)) rows.push({ cells, line: i + 1 })
  }
  return rows
}
function headerValue(lines, key, before) {
  const re = new RegExp(`^${key}\\s*:\\s*(.+)$`, 'i')
  for (let i = 0; i < before; i++) { const m = re.exec(lines[i].trim()); if (m) return { value: m[1].trim(), line: i + 1 } }
  return null
}
function registerLine(lines, before, add) {
  const r = headerValue(lines, 'register', before)
  if (!r) { add('no-register', 1, 'no "register:" line; write it before anything else'); return { reg: null, key: null } }
  const k = registerKey(r.value.split(',')[0])
  if (!k.key) { add('unknown-register', r.line, k.why); return { reg: null, key: null } }
  return { reg: REGISTERS[k.key], key: k.key }
}

function checkBeatSheet(text, add) {
  const lines = text.split('\n')
  const head = lines.findIndex((l) => /^\|\s*t\s*\|\s*beat\s*\|\s*taken from\s*\|/i.test(l.trim()))
  const { reg, key } = registerLine(lines, head, add)
  const rt = headerValue(lines, 'runtime', head)
  const runtime = rt ? parseFloat(rt.value) : NaN
  if (!isNum(runtime) || runtime <= 0) add('plan-incomplete', rt?.line ?? 1, 'no "runtime: <n> s" line above the table')
  const mode = headerValue(lines, 'name mode', head)
  const known = headerValue(lines, 'known brand', head)
  const rows = tableAfter(lines, head).map((r) => {
    const m = /^(\d+(?:\.\d+)?)(?:\s*(?:-|to)\s*(\d+(?:\.\d+)?))?\s*s\b/.exec(r.cells[0] ?? '')
    return { ...r, start: m ? parseFloat(m[1]) : NaN, end: m && m[2] ? parseFloat(m[2]) : NaN, beat: (r.cells[1] ?? '').toLowerCase(), from: r.cells[2] ?? '' }
  })
  let prev = -Infinity
  for (const r of rows) {
    if (!isNum(r.start)) { add('plan-incomplete', r.line, `the row "${r.cells[1] ?? ''}" has no time in seconds in its first cell`); continue }
    if (r.start < prev - 1e-9) add('beat-overlap', r.line, `the row at ${num(r.start)} s sits under a row at ${num(prev)} s; a beat sheet reads in time order`)
    prev = Math.max(prev, r.start)
    if (!r.from.trim()) add('unsourced-beat', r.line, `the beat at ${num(r.start)} s names no source in "taken from"; a number without its row is left out`)
  }
  // A row is found by the words its beat opens with, then by the words anywhere in it.
  const timed = rows.filter((r) => isNum(r.start))
  const find = (words) => timed.find((r) => new RegExp(`^(?:the )?${words}\\b`).test(r.beat)) ?? timed.find((r) => new RegExp(`\\b${words}\\b`).test(r.beat))
  const beats = { word: find('first (?:readable )?word'), seam: find('first seam'), name: find('name'), payoff: find('payoff'), endcard: find('endcard') }
  const labels = { word: 'the first readable word', seam: 'the first seam', name: 'the name', payoff: 'the payoff', endcard: 'the endcard and its hold' }
  for (const k of Object.keys(labels)) if (!beats[k]) add('missing-beat', head + 1, `the sheet has no row for ${labels[k]}`)
  if (!isNum(runtime) || runtime <= 0) return
  checkHook({ word: beats.word?.start, seam: beats.seam?.start, reg, key, line: beats.word?.line ?? head + 1, seamLine: beats.seam?.line ?? head + 1 }, add)
  if (beats.name) checkName({ at: beats.name.start, mode: mode?.value, known: known ? /^(yes|true)/i.test(known.value) : false, runtime, reg, line: beats.name.line }, add)
  if (beats.endcard) {
    const e = beats.endcard
    const hold = /hold\s+(\d+(?:\.\d+)?)\s*s/i.exec(e.cells[1]) ?? /last\s+(\d+(?:\.\d+)?)\s*s\s+hold/i.exec(e.cells[1])
    if (!isNum(e.end)) add('plan-incomplete', e.line, 'the endcard row needs a range, start to end, in seconds')
    else if (Math.abs(e.end - runtime) > 0.02) add('beat-sum', e.line, `the endcard ends at ${num(e.end)} s; the runtime is ${num(runtime)} s`)
    if (!hold) add('missing-beat', e.line, 'the endcard row states no final hold; write "hold <n> s"')
    else checkEndcard({ start: e.start, hold: parseFloat(hold[1]), runtime, reg, line: e.line, holdLine: e.line }, add)
    if (beats.payoff) checkPayoff({ payoff: beats.payoff.start, start: e.start, line: beats.payoff.line }, add)
  }
}

function checkReview(text, add) {
  const lines = text.split('\n')
  const head = lines.findIndex((l) => /^\|\s*Before\s*\|\s*After\s*\|\s*Why\s*\|/i.test(l.trim()))
  registerLine(lines, lines.length, add)
  if (head >= 0) {
    for (const r of tableAfter(lines, head)) {
      const [before = '', , why = ''] = r.cells
      const timed = /\d+(?:\.\d+)?\s*s\b/.test(before) && /\bf(?:rame)?\s*\d+/i.test(before)
      if (!timed && !/`[^`]+`/.test(before) && !/whole film/i.test(before)) add('no-frame', r.line, 'Before gives no time in seconds with its frame number, no quoted source line and no "whole film"; a finding is a measurement')
      if (!OWNERS.test(why)) add('no-owner', r.line, 'Why names no owning reference; end it with the reference that holds the rule')
    }
  }
  if (!lines.some((l) => /^Not checked\s*:\s*\S/i.test(l.trim()))) add('no-not-checked', lines.length, 'no "Not checked:" line; say which formats, looks and cases nobody watched')
  if (!/^```json\s*$/m.test(text)) add('no-film-json', 1, 'no per-film JSON block; the review carries the film\'s measured numbers')
}

// ---- A render, through ffprobe ---------------------------------------------
function probe(file, bin = process.env.FFPROBE || 'ffprobe') {
  const r = spawnSync(bin, ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=codec_name,width,height,avg_frame_rate,r_frame_rate,nb_frames,level:format=duration,size', '-of', 'json', file], { encoding: 'utf8' })
  if (r.error) return { missing: true }
  if (r.status !== 0) return { error: (r.stderr || '').trim().split('\n')[0] || `ffprobe exit ${r.status}` }
  let j
  try { j = JSON.parse(r.stdout) } catch { return { error: 'ffprobe printed no JSON' } }
  const s = j.streams?.[0]
  if (!s) return { error: 'no video stream' }
  const rate = (v) => { const [a, b] = String(v ?? '').split('/').map(Number); return b ? a / b : a }
  return { codec: s.codec_name, width: s.width, height: s.height, fps: rate(s.avg_frame_rate) || rate(s.r_frame_rate), frames: s.nb_frames ? Number(s.nb_frames) : null, level: isNum(s.level) ? s.level : null, duration: Number(j.format?.duration), size: Number(j.format?.size) }
}

function checkRender(file, f, plan, add, notChecked) {
  const ext = extname(file).toLowerCase()
  const uhd = f.width >= 3840 || f.height >= 3840
  if (ext === '.gif' && ![25, 50].some((r) => Math.abs(f.fps - r) < 0.01)) add('gif-fps', 1, `a GIF at ${num(f.fps)} fps; GIF delays are whole hundredths of a second, so only 25 and 50 fps play at speed`)
  if (f.codec === 'h264' && f.level !== null && f.level > (uhd ? LEVEL.uhd : LEVEL.hd)) add('render-level', 1, `H.264 level ${(f.level / 10).toFixed(1)} at ${f.width} x ${f.height}; the ceiling is ${uhd ? '5.2 at 4K' : '4.2 at 1080p'}, or it fails in QuickTime and on phones`)
  if (uhd && f.size >= GB) add('render-size', 1, `${num(f.size / GB)} GB at 4K; the ceiling is 1 GB`)
  const listed = Object.values(FORMATS).flat().some(([w, h]) => w === f.width && h === f.height)
  if (!plan) { if (!listed) add('render-format', 1, `${f.width} x ${f.height} is not a delivery size the references list`); return }
  if (isNum(plan.fps) && Math.abs(f.fps - plan.fps) > 0.01) add('render-fps', 1, `the file runs at ${num(f.fps)} fps; the plan says ${num(plan.fps)}. Measure at native fps and never resample`)
  const frame = isNum(plan.fps) && plan.fps > 0 ? 1 / plan.fps : 1 / 30
  if (isNum(plan.runtime) && Math.abs(f.duration - plan.runtime) > frame + 1e-6) add('render-duration', 1, `the file runs ${num(f.duration)} s; the plan's runtime is ${num(plan.runtime)} s`)
  if (isNum(plan.runtime) && isNum(plan.fps)) {
    if (f.frames === null) notChecked.push(`${show(file)}: frame count (the container does not state it)`)
    else if (f.frames !== Math.round(plan.runtime * plan.fps)) add('render-frames', 1, `${f.frames} frames in the file; ${num(plan.runtime)} s at ${num(plan.fps)} fps is ${Math.round(plan.runtime * plan.fps)}`)
  }
  const formats = Array.isArray(plan.formats) ? plan.formats.filter((x) => isNum(x?.width) && isNum(x?.height)) : []
  if (formats.length && !formats.some((x) => x.width === f.width && x.height === f.height)) add('render-resolution', 1, `${f.width} x ${f.height}; the plan's formats are ${formats.map((x) => `${x.width} x ${x.height}`).join(', ')}`)
  else if (!formats.length && !listed) add('render-format', 1, `${f.width} x ${f.height} is not a delivery size the references list`)
}

// ---- Run -------------------------------------------------------------------
function walk(p) {
  if (statSync(p).isDirectory()) return readdirSync(p).filter((f) => !f.startsWith('.') && f !== 'node_modules').sort().flatMap((f) => walk(join(p, f)))
  return [p]
}

function run(inputs, { ffprobe } = {}) {
  const findings = []
  const notChecked = []
  const inconclusive = []
  const facts = []
  const files = []
  const paths = []
  for (const input of inputs) {
    const p = resolve(input)
    if (!existsSync(p)) inconclusive.push(`${input} not found`)
    else paths.push(...walk(p))
  }
  const plans = []
  const videos = []
  for (const p of paths) {
    const ext = extname(p).toLowerCase()
    const add = (line, lineNumber, detail) => findings.push({ line, file: show(p), lineNumber, detail, class: NEVER[line] ? 'never-intentional' : 'candidate' })
    if (VIDEO.has(ext)) { videos.push(p); continue }
    if (ext !== '.json' && ext !== '.md') continue
    const text = readFileSync(p, 'utf8').replace(/\r\n/g, '\n')
    if (ext === '.json') {
      let looksLikePlan = true
      try { const v = JSON.parse(text); looksLikePlan = v && typeof v === 'object' && !Array.isArray(v) && ['register', 'beats', 'seams', 'runtime'].some((k) => k in v) } catch { /* reported below */ }
      if (!looksLikePlan) { notChecked.push(`${show(p)}: not a film plan`); continue }
      files.push(show(p))
      const plan = checkPlan(text, add)
      if (plan) plans.push({ path: p, plan })
    } else if (/^\|\s*t\s*\|\s*beat\s*\|\s*taken from\s*\|/im.test(text)) { files.push(show(p)); checkBeatSheet(text, add) }
    else if (/^\|\s*Before\s*\|\s*After\s*\|\s*Why\s*\|/im.test(text) || /^#\s+Review\b/m.test(text)) { files.push(show(p)); checkReview(text, add) }
    else notChecked.push(`${show(p)}: not a plan, a beat sheet or a review`)
  }
  for (const v of videos) {
    files.push(show(v))
    const stem = basename(v).split('.')[0]
    const plan = (plans.length === 1 ? plans[0] : plans.find((x) => basename(x.path).split('.')[0] === stem))?.plan ?? null
    const f = ffprobe ? ffprobe(v) : probe(v)
    if (f.missing) { inconclusive.push('ffprobe not found'); notChecked.push(`${show(v)}: duration, frame rate and resolution (ffprobe is not on PATH)`); continue }
    if (f.error) { inconclusive.push(`${show(v)}: ${f.error}`); continue }
    facts.push(`render: ${show(v)} ${num(f.duration)} s, ${num(f.fps)} fps, ${f.width} x ${f.height}, ${f.codec}${f.level !== null ? ` level ${(f.level / 10).toFixed(1)}` : ''}${f.frames !== null ? `, ${f.frames} frames` : ''}`)
    const add = (line, lineNumber, detail) => findings.push({ line, file: show(v), lineNumber, detail, class: NEVER[line] ? 'never-intentional' : 'candidate' })
    checkRender(v, f, plan, add, notChecked)
    if (!plan) inconclusive.push(`${show(v)}: no plan to hold it against`)
    notChecked.push(`${show(v)}: loudness, true peak, sync, cut count, still share, and every frame watched`)
  }
  if (!files.length) inconclusive.push('nothing to check')
  return { files, findings, notChecked, inconclusive: [...new Set(inconclusive)], facts }
}

function report(result, flags) {
  const never = result.findings.filter((f) => f.class === 'never-intentional')
  const candidates = result.findings.filter((f) => f.class === 'candidate')
  const out = []
  out.push(`film-check: ${result.files.length} file${result.files.length === 1 ? '' : 's'}`)
  for (const f of [...never, ...candidates]) out.push(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
  for (const f of result.facts) out.push(f)
  for (const n of result.notChecked) out.push(`not checked: ${n}`)
  for (const n of result.inconclusive) out.push(`inconclusive: ${n}`)
  const tally = (list) => { const m = new Map(); for (const f of list) m.set(f.line, (m.get(f.line) ?? 0) + 1); return [...m].map(([k, n]) => `${k} ${n}`).join(', ') }
  out.push(`never intentional: ${never.length}${never.length ? ` (${tally(never)})` : ''}; candidates: ${candidates.length}${candidates.length ? ` (${tally(candidates)})` : ''}`)
  out.push('passing is necessary, not sufficient')
  let status = 'passed'
  let exitCode = 0
  if (never.length) { status = 'failed'; exitCode = 1 } else if (result.inconclusive.length) { status = 'inconclusive'; exitCode = 2 }
  if (flags.gate) {
    if (status === 'passed') out.push(`${GATE} passed`)
    else if (status === 'failed') out.push(`${GATE} failed: ${never.length} never-intentional line${never.length === 1 ? '' : 's'} (${tally(never)})`)
    else out.push(`${GATE} inconclusive: ${result.inconclusive.join('; ')}`)
  } else if (status === 'failed') exitCode = flags.strict ? 1 : 0
  if (flags.strict && candidates.length && exitCode === 0) exitCode = 1
  if (flags.report) writeFileSync(flags.report, `${JSON.stringify({ status, exitCode, files: result.files, findings: result.findings, notChecked: [...result.notChecked, ...NOT_CHECKED] }, null, 2)}\n`)
  return { text: out.join('\n'), exitCode, status }
}

// ---- Self-test: the teaching pairs are the gate's tests ---------------------
function selfTest() {
  const root = join(HERE, '..')
  let failed = 0
  const say = (ok, what) => { if (!ok) failed++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`) }
  const neverOf = (r) => r.findings.filter((f) => f.class === 'never-intentional').map((f) => f.line)
  const examples = join(root, 'examples')
  const golds = existsSync(examples) ? walk(examples) : []
  say(golds.length >= 3, `examples/ holds ${golds.length} gold files`)
  for (const g of golds) {
    const r = run([g])
    const n = neverOf(r)
    say(r.files.length === 1 && n.length === 0, `examples/${basename(g)} passes${n.length ? ` (raised ${[...new Set(n)].join(', ')})` : r.files.length ? '' : ' (was not checked)'}`)
  }
  const teaching = join(root, 'teaching')
  const pairs = existsSync(teaching) ? readdirSync(teaching).filter((d) => statSync(join(teaching, d)).isDirectory()).sort() : []
  say(pairs.length >= 8, `teaching/ holds ${pairs.length} pairs`)
  for (const name of pairs) {
    const dir = join(teaching, name)
    const bad = readdirSync(dir).find((f) => f.startsWith('bad.'))
    const good = readdirSync(dir).find((f) => f.startsWith('good.'))
    if (!bad || !good) { say(false, `teaching/${name} has a bad and a good half`); continue }
    say(Boolean(NEVER[name]), `teaching/${name} is named for a never-intentional line`)
    const b = neverOf(run([join(dir, bad)]))
    say(b.includes(name) && b.every((l) => l === name), `teaching/${name}/${bad} raises ${name}: and nothing else${b.every((l) => l === name) ? '' : ` (raised ${[...new Set(b)].join(', ')})`}`)
    const g = neverOf(run([join(dir, good)]))
    say(g.length === 0, `teaching/${name}/${good} raises no never-intentional line${g.length ? ` (raised ${[...new Set(g)].join(', ')})` : ''}`)
  }

  // Lines with no pair of their own, proved on a plan built here.
  const base = () => ({
    register: 'ui-motion', runtime: 60, fps: 30, known_brand: false,
    beats: [{ id: 'hook', start: 0, end: 1.6 }, { id: 'problem', start: 1.6, end: 17.4 }, { id: 'body', start: 17.4, end: 55 }, { id: 'endcard', start: 55, end: 60 }],
    first_word: 0.2, name: { at: 17.4, mode: 'problem-end' }, endcard: { start: 55, hold: 2 }, cuts: 4, still_share: 0.09,
    seams: [1.6, 9.5, 17.4, 36].map((at) => ({ at, type: 'cut', technique: 'cut the curve', exit: { axis: 'x', dir: -1 }, entry: { axis: 'x', dir: -1 } })),
    picture_locked: false, sound: { register: 'C', lufs: -17.7, true_peak: -1 },
  })
  const planLines = (edit) => { const p = base(); edit(p); const lines = []; checkPlan(JSON.stringify(p, null, 2), (line) => lines.push(line)); return lines }
  say(planLines(() => {}).filter((l) => NEVER[l]).length === 0, 'the inline base plan raises no never-intentional line')
  const inline = [
    ['vector-mismatch', (p) => { p.seams[2].exit = { axis: 'z', dir: -1 }; p.seams[2].entry = { axis: 'z', dir: 1 } }],
    ['dead-cut', (p) => { p.seams[1].exit_moving = false; p.seams[1].entry_acts_in = 0.9 }],
    ['crossfade-dip', (p) => { p.seams[1].technique = 'crossfade' }],
    ['block-fade', (p) => { p.type = [{ text: 'Ship in days', build: 'block', hold: 1.15 }] }],
    ['true-peak', (p) => { p.sound.true_peak = 0 }],
    ['cropped-vertical', (p) => { p.formats = [{ aspect: '9:16', width: 1080, height: 1920, layout: 'crop' }] }],
    ['plan-mismatch', (p) => { p.cuts = 6 }],
    ['plan-incomplete', (p) => { delete p.still_share }],
    ['beat-overlap', (p) => { p.beats[2].start = 16 }],
  ]
  for (const [line, edit] of inline) say(planLines(edit).includes(line), `an inline plan raises ${line}:`)
  say(planLines((p) => { p.cuts = 5; p.seams.push({ ...p.seams[0], at: 44 }) }).every((l) => !NEVER[l]), 'a plan one cut past the median stays clear of never-intentional lines')
  say(planLines((p) => { p.cuts = 6; p.seams.push({ ...p.seams[0], at: 44 }, { ...p.seams[0], at: 50 }) }).includes('cut-rate-edge'), 'a UI-motion plan at 6 cuts a minute raises the candidate cut-rate-edge:')

  const reviewLines = (text) => { const lines = []; checkReview(text, (line) => lines.push(line)); return lines }
  const review = (row, tail = 'Not checked: the 9:16 cut.') => `# Review: x\n\nregister: ui-motion\n\n| Before | After | Why |\n|---|---|---|\n${row}\n\n${tail}\n`
  say(reviewLines(review('| the cut feels dead | tighter | dead cut, launch-video-cuts |')).includes('no-frame'), 'a review row with no time and frame raises no-frame:')
  say(reviewLines(review('| 12.43 s (f 746 at 60 fps): settled | moves by 12.80 s | it reads as two stills |')).includes('no-owner'), 'a review row with no owning reference raises no-owner:')
  say(reviewLines(review('| 12.43 s (f 746 at 60 fps): settled | moves by 12.80 s | dead cut, launch-video-cuts |', '')).includes('no-not-checked'), 'a review with no "Not checked:" line raises no-not-checked:')

  // The render checks, on facts a probe would return.
  const renderLines = (file, facts, plan) => { const lines = []; checkRender(file, facts, plan, (line) => lines.push(line), []); return lines }
  const hd = { codec: 'h264', width: 1920, height: 1080, fps: 30, frames: 1800, level: 42, duration: 60, size: 4e7 }
  const p = { ...base(), formats: [{ aspect: '16:9', width: 1920, height: 1080 }] }
  say(renderLines('a.mp4', hd, p).length === 0, 'a 60 s, 30 fps, 1920 x 1080, level 4.2 render matches its plan')
  say(renderLines('a.mp4', { ...hd, duration: 58.4, frames: 1752 }, p).includes('render-duration'), 'a short render raises render-duration:')
  say(renderLines('a.mp4', { ...hd, fps: 24 }, p).includes('render-fps'), 'a resampled render raises render-fps:')
  say(renderLines('a.mp4', { ...hd, frames: 1797 }, p).includes('render-frames'), 'dropped frames raise render-frames:')
  say(renderLines('a.mp4', { ...hd, width: 1280, height: 720 }, p).includes('render-resolution'), 'a 720p render raises render-resolution:')
  say(renderLines('a.mp4', { ...hd, level: 60 }, p).includes('render-level'), 'H.264 level 6.0 raises render-level:')
  say(renderLines('a.mp4', { ...hd, width: 3840, height: 2160, level: 52, size: 1.4 * GB }, null).includes('render-size'), 'a 1.4 GB 4K file raises render-size:')
  say(renderLines('a.gif', { ...hd, codec: 'gif', fps: 30, level: null }, null).includes('gif-fps'), 'a 30 fps GIF raises gif-fps:')
  const blind = report(run([join(examples, 'ui-motion.plan.json'), join(root, 'LICENSE.mp4')]), { gate: true })
  say(blind.exitCode === 2 && /inconclusive: .*not found/.test(blind.text), 'a render that is not there is inconclusive, exit 2, never a pass')
  say(probe('x.mp4', 'ffprobe-that-is-not-installed').missing === true, 'a missing ffprobe is reported, not guessed around')
  const empty = report(run([]), { gate: true })
  say(empty.exitCode === 2 && /inconclusive: nothing to check/.test(empty.text), 'no input is inconclusive, exit 2')
  const gold = report(run([examples]), { gate: true })
  say(gold.exitCode === 0 && gold.text.endsWith(`${GATE} passed`), `examples/ ends "${GATE} passed"`)

  console.log(failed ? `\n${failed} assertion${failed === 1 ? '' : 's'} failed` : '\nself-test passed')
  return failed ? 1 : 0
}

const HELP = `film-check: the gate for khe-launch-film

  node scripts/film-check.mjs <files or folders...> [--gate] [--report out.json]
       [--strict] [--self-test] [--help]

Reads
  *.json   a film plan (format in references/verify.md)
  *.md     a beat sheet (a "| t | beat | taken from |" table) or a review
           (a "| Before | After | Why |" table); other markdown is skipped
  video    .mp4 .mov .m4v .webm .mkv .gif, through ffprobe when it is on PATH:
           duration, frame rate, size, H.264 level and frame count against the
           plan passed with it. Without ffprobe it prints
           "inconclusive: ffprobe not found" and still checks the plan.

Each finding prints as  <line-name>: <what and where> (<file>:<line>)

  --gate       ends "${GATE} passed" and exits 0 only when every
               never-intentional line is at 0; otherwise prints the counts and
               exits 1. Exits 2 and says "inconclusive" when it could not look
               (nothing to check, a file not found, a render with no ffprobe).
  --report     write JSON: { status, exitCode, files, findings, notChecked }
  --strict     exit 1 on candidates too
  --self-test  every file in examples/ passes; every teaching/*/bad.* raises
               the line its folder is named for and its good.* does not

Never intentional (the gate fails on any)
${Object.entries(NEVER).map(([k, v]) => `  ${`${k}:`.padEnd(20)} ${v}`).join('\n')}

Candidates (reported for judgment)
${Object.entries(CANDIDATE).map(([k, v]) => `  ${`${k}:`.padEnd(20)} ${v}`).join('\n')}

Not checked by this script
${NOT_CHECKED.map((n) => `  ${n}`).join('\n')}

Passing is necessary, not sufficient.`

function main() {
  const argv = process.argv.slice(2)
  const flags = { gate: false, strict: false, report: null }
  const inputs = []
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--help' || a === '-h') { console.log(HELP); return 0 }
    if (a === '--self-test') return selfTest()
    if (a === '--gate') flags.gate = true
    else if (a === '--strict') flags.strict = true
    else if (a === '--report') flags.report = argv[++i]
    else if (a.startsWith('--')) { console.error(`unknown flag ${a}; see --help`); return 2 }
    else inputs.push(a)
  }
  const r = report(run(inputs), flags)
  console.log(r.text)
  return r.exitCode
}

process.exitCode = main()
