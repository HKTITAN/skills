#!/usr/bin/env node
// pyramid-check: the gate for khe-poteto-pyramid.
//
// It reads two kinds of markdown file and names every fault it can prove as a line.
//
//   A placement record   starts "# Placements: <scope>" and holds one "## Placement: <title>"
//                        section per mistake class, each with Key: value lines (see
//                        references/placing.md for the format). Its last line is "Not verified: ...".
//   A rules file         anything else: AGENTS.md, CLAUDE.md, .cursor/rules, a CONTRIBUTING page.
//                        Every bullet that a tool could enforce is reported, and every row of a
//                        rule table whose enforcer is empty.
//
//   node scripts/pyramid-check.mjs <files or folders...> [--gate] [--strict] [--self-test] [--help]
//
// Zero dependencies. Node 20 or newer.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(HERE, '..')
const GATE_NAME = 'pyramid-check'

// Top of the pyramid first. A placement's layer is the highest one it names.
export const LAYERS = ['codebase', 'static', 'verification', 'prose', 'review']
const ENFORCED = ['codebase', 'static', 'verification'] // layers that need an enforcer and a proof
const SEEN_MIN = 2 // a class counts once it has happened twice

// Every line the gate can print. "never" lines fail the gate. "candidate" lines are reported
// for judgment and fail only under --strict.
export const LINES = {
  // a placement record
  'no-layer': ['never', 'A placement with no "Layer:" line, or a layer that is not codebase, static, verification, prose or review'],
  once: ['never', `A placement with fewer than ${SEEN_MIN} occurrences under "Seen:"; a mistake seen once is fixed where it is, not given a layer`],
  'skipped-higher': ['never', 'A placement below the codebase layer with no "Not higher:" bullet for each layer above it'],
  'no-enforcer': ['never', 'A codebase, static or verification placement with no "Enforced by:" line naming a path or a command in backticks'],
  'prose-enforcer': ['never', 'A codebase, static or verification placement whose "Enforced by:" is a comment, a doc, a rule or an instruction file'],
  'mute-error': ['never', 'A static placement whose "Error:" is missing or names no file, type, function or command to use instead (nothing in backticks)'],
  'never-failed': ['never', 'A codebase, static or verification placement whose "Proof:" does not say the check failed on a named past case'],
  'belt-and-braces': ['never', 'A structural placement that also adds or keeps an instruction for the same mistake; the "Prose:" line must say deleted or none'],
  'left-to-review': ['never', 'A placement at the review layer: a person catching it every time is the low-trust loop'],
  'no-unverified': ['never', 'The record\'s last line is not "Not verified: <what nobody checked>"'],
  'prose-no-judgment': ['candidate', 'A prose placement whose "Change:" never says what judgment it asks for'],
  // a rules file
  'enforceable-prose': ['never', 'A bullet in a rules file that forbids or requires something a tool could check (a backticked name with never, don\'t, avoid, must not, always use...) and is not marked "(judgment)"'],
  'unenforced-rule': ['never', 'A row of a rule table whose enforcer cell is empty, a dash, "nothing", "none", "TODO" or a doc'],
  'no-rule-table': ['candidate', 'A rules file with no table that pairs each rule with what enforces it'],
  'run-me': ['candidate', 'A bullet that tells the agent to run or check something before calling work done; a verification skill can do it instead of being told'],
}

const KEY = /^([A-Z][A-Za-z ]+):\s*(.*)$/
// A bullet that opens as a command to forbid or require something, or says outright that a thing
// is banned. Mid-sentence "do not" in an explanation is not a rule.
const PROHIBIT = /^(\*\*)?\s*(never|don'?t|do not|avoid|stop using|no longer use|ban|only use|always use|use only|prefer)\b|\b(must not|mustn'?t|is banned|are banned|is forbidden|are forbidden|not allowed)\b/i
const RUN_ME = /^(\*\*)?\s*(always|before)\b.*\b(run|check|test|verify|screenshot|attach)\b/i
const DOCLIKE = /(AGENTS\.md|CLAUDE\.md|README|\bcomments?\b|\bdocs?\b|\binstructions?\b|\.cursor\/rules|CONTRIBUTING|\bwiki\b)/i
const EMPTY_CELL = /^\s*(|-|—|–|nothing|none|n\/a|todo|tbd|\?|agents\.md|docs?|comment)\s*$/i

// An enforcer is prose when every backticked thing in it is a document, or when the words around
// the backticks point at a document, a comment or an instruction.
function isProseEnforcer(enf) {
  const spans = [...enf.matchAll(/`([^`]+)`/g)].map((m) => m[1])
  const allDocs = spans.length > 0 && spans.every((s) => /\.(md|mdc|txt)$/i.test(s) || /^(AGENTS|CLAUDE)\.md$/i.test(s))
  const words = enf.replace(/`[^`]*`/g, ' ')
  return allDocs || DOCLIKE.test(words)
}

function layersOf(value) {
  const found = LAYERS.filter((l) => new RegExp(`\\b${l}\\b`, 'i').test(value || ''))
  return found
}

function parseSections(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const sections = []
  let cur = null
  let key = null
  for (const line of lines) {
    const h = line.match(/^## Placement:\s*(.+)$/)
    if (h) { cur = { title: h[1].trim(), fields: {}, bullets: {} }; sections.push(cur); key = null; continue }
    if (/^#{1,2} /.test(line)) { cur = null; key = null; continue }
    if (!cur) continue
    const k = line.match(KEY)
    if (k) { key = k[1].trim().toLowerCase(); cur.fields[key] = k[2].trim(); cur.bullets[key] = []; continue }
    const b = line.match(/^\s*-\s+(.*)$/)
    if (b && key) { cur.bullets[key].push(b[1].trim()); continue }
    if (line.trim() && key && !cur.bullets[key].length) cur.fields[key] += ' ' + line.trim()
  }
  return sections
}

function checkPlacement(text) {
  const out = []
  const add = (line, where, detail) => out.push({ line, where, detail })
  const sections = parseSections(text)
  if (!sections.length) add('no-layer', 'record', 'no "## Placement:" section')
  for (const s of sections) {
    const where = `placement "${s.title}"`
    const f = s.fields
    const named = layersOf(f.layer)
    if (!f.layer || !named.length) { add('no-layer', where, f.layer ? `"${f.layer}"` : 'missing'); continue }
    const top = named[0]
    const structural = ENFORCED.includes(top)
    const seen = (s.bullets.seen || []).length
    if (seen < SEEN_MIN) add('once', where, `${seen} under Seen:`)
    if (top === 'review') add('left-to-review', where, 'Layer: review')
    const above = LAYERS.slice(0, LAYERS.indexOf(top))
    const reasons = (s.bullets['not higher'] || []).join('\n')
    for (const l of above) if (!new RegExp(`^${l}\\b`, 'im').test(reasons)) add('skipped-higher', where, `no "- ${l}: ..." under Not higher:`)
    if (structural) {
      const enf = f['enforced by'] || ''
      if (!enf || !/`[^`]+`/.test(enf)) add('no-enforcer', where, enf ? `"${enf}"` : 'missing')
      else if (isProseEnforcer(enf)) add('prose-enforcer', where, `"${enf}"`)
      const proof = f.proof || ''
      if (!/\b(fail(s|ed)?|red|caught|rejected|errored)\b/i.test(proof) || !/(`[^`]+`|#\d+|\b[0-9a-f]{7,40}\b)/.test(proof)) add('never-failed', where, proof ? `"${proof.slice(0, 80)}"` : 'missing')
      const prose = (f.prose || '').toLowerCase()
      if (prose && !/^(deleted|removed|none|nothing)\b/.test(prose)) add('belt-and-braces', where, `Prose: ${f.prose}`)
    }
    if (named.includes('static')) {
      const err = f.error || ''
      if (!err || !/`[^`]+`/.test(err)) add('mute-error', where, err ? `"${err.slice(0, 80)}"` : 'missing')
    }
    if (top === 'prose' && !/judg/i.test(f.change || '')) add('prose-no-judgment', where, 'Change: names no judgment')
  }
  const last = text.replace(/\r\n/g, '\n').trimEnd().split('\n').pop() || ''
  if (!/^Not verified:\s*\S/.test(last)) add('no-unverified', 'record', `last line: "${last.slice(0, 60)}"`)
  return out
}

function checkRules(text) {
  const out = []
  const add = (line, where, detail) => out.push({ line, where, detail })
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  let fence = false
  let table = null // index of the enforcer column in the current rule table
  let sawTable = false
  lines.forEach((line, i) => {
    const where = `line ${i + 1}`
    if (/^\s*(```|~~~)/.test(line)) { fence = !fence; return }
    if (fence) return
    if (/^\s*\|/.test(line)) {
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      if (table === null) {
        const idx = cells.findIndex((c) => /enforc/i.test(c))
        table = idx >= 0 ? idx : -1
        if (idx >= 0) sawTable = true
        return
      }
      if (cells.every((c) => /^:?-+:?$/.test(c))) return
      if (table >= 0) {
        const cell = cells[table] || ''
        const isJudgment = /^judg/i.test(cell)
        if (!isJudgment && (EMPTY_CELL.test(cell) || (!/`[^`]+`/.test(cell) && DOCLIKE.test(cell)))) add('unenforced-rule', where, `"${cells[0]}" -> "${cell}"`)
      }
      return
    }
    table = null
    const b = line.match(/^\s*(?:[-*+]|\d+\.)\s+(.*)$/)
    if (!b) return
    const body = b[1]
    if (/\(judgment\)\s*$/i.test(body)) return
    if (PROHIBIT.test(body) && /`[^`]+`/.test(body)) add('enforceable-prose', where, `"${body.slice(0, 90)}"`)
    else if (RUN_ME.test(body)) add('run-me', where, `"${body.slice(0, 90)}"`)
  })
  if (!sawTable) add('no-rule-table', 'file', 'no table with an "Enforced by" column')
  return out
}

export function checkText(text) {
  const kind = /^# Placements:/m.test(text) ? 'placement' : 'rules'
  return { kind, findings: kind === 'placement' ? checkPlacement(text) : checkRules(text) }
}

function collect(paths) {
  const files = []
  const walk = (p) => {
    if (!existsSync(p)) { files.push({ path: p, missing: true }); return }
    if (statSync(p).isDirectory()) for (const f of readdirSync(p).sort()) walk(join(p, f))
    else if (/\.(md|mdc)$/i.test(p)) files.push({ path: p })
  }
  paths.forEach(walk)
  return files
}

function run(paths, { gate, strict }) {
  const files = collect(paths)
  let never = 0
  let cand = 0
  let notChecked = 0
  const counts = {}
  for (const file of files) {
    const name = relative(process.cwd(), file.path) || file.path
    if (file.missing) { console.log(`${name}: not found`); notChecked++; continue }
    const text = readFileSync(file.path, 'utf8')
    if (!text.trim()) { console.log(`${name}: empty`); notChecked++; continue }
    const { kind, findings } = checkText(text)
    for (const f of findings) {
      const [sev] = LINES[f.line]
      if (sev === 'never') never++
      else cand++
      counts[f.line] = (counts[f.line] || 0) + 1
      console.log(`${f.line}: ${name} (${kind}), ${f.where}: ${f.detail}`)
    }
  }
  if (!files.length) notChecked++
  const failing = never + (strict ? cand : 0)
  const status = failing ? 'failed' : notChecked ? 'inconclusive' : 'passed'
  if (gate || strict) {
    const summary = Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')
    if (status === 'passed') console.log(`${GATE_NAME} passed${cand ? ` (${cand} candidate line${cand === 1 ? '' : 's'} for judgment)` : ''}`)
    else if (status === 'inconclusive') console.log(`${GATE_NAME} inconclusive: ${notChecked} thing${notChecked === 1 ? '' : 's'} not checked`)
    else console.log(`${GATE_NAME} failed: ${summary}`)
  }
  return status === 'inconclusive' ? 2 : status === 'failed' && (gate || strict) ? 1 : 0
}

function selfTest() {
  let failed = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const nevers = (text) => checkText(text).findings.filter((f) => LINES[f.line][0] === 'never').map((f) => f.line)

  const gold = collect([join(SKILL_DIR, 'examples')])
  say(gold.length >= 6, `examples/ holds ${gold.length} gold files`)
  for (const g of gold) {
    const lines = nevers(readFileSync(g.path, 'utf8'))
    say(lines.length === 0, `gold ${relative(SKILL_DIR, g.path)} raises no never line${lines.length ? ` (got ${[...new Set(lines)].join(', ')})` : ''}`)
  }

  const teach = join(SKILL_DIR, 'teaching')
  const pairs = existsSync(teach) ? readdirSync(teach).filter((d) => statSync(join(teach, d)).isDirectory()).sort() : []
  say(pairs.length >= 8, `teaching/ holds ${pairs.length} pairs`)
  for (const p of pairs) {
    say(p in LINES, `teaching/${p} is named for a gate line`)
    const bad = nevers(readFileSync(join(teach, p, 'bad.md'), 'utf8'))
    const good = nevers(readFileSync(join(teach, p, 'good.md'), 'utf8'))
    say(bad.includes(p) && bad.every((l) => l === p), `teaching/${p}/bad.md raises ${p} and nothing else${bad.length ? ` (got ${[...new Set(bad)].join(', ')})` : ''}`)
    say(good.length === 0, `teaching/${p}/good.md raises no never line${good.length ? ` (got ${[...new Set(good)].join(', ')})` : ''}`)
  }

  const untaught = Object.entries(LINES).filter(([k, [s]]) => s === 'never' && !pairs.includes(k)).map(([k]) => k)
  for (const k of untaught) {
    const fixtures = {
      'no-layer': '# Placements: x\n\n## Placement: a\n\nCorrection: c\nSeen:\n- one\n- two\nLayer: somewhere\n\nNot verified: nothing\n',
    }
    if (fixtures[k]) say(nevers(fixtures[k]).includes(k), `a broken record raises ${k}`)
    else say(false, `${k} has no teaching pair and no fixture`)
  }
  say(collect([join(SKILL_DIR, 'nope')]).every((f) => f.missing), 'a missing path is reported, never a pass')
  console.log(failed ? `\nself-test failed: ${failed}` : '\nself-test passed')
  return failed ? 1 : 0
}

function help() {
  console.log(`pyramid-check: the gate for khe-poteto-pyramid

  node scripts/pyramid-check.mjs <files or folders...> [--gate] [--strict] [--self-test] [--help]

  A file that starts "# Placements:" is a placement record; any other .md or .mdc file is a rules file.

  --gate        end with "${GATE_NAME} passed" and exit 0 only when every never line is at 0;
                exit 1 with the counts otherwise; exit 2 with "inconclusive" when a path was missing or empty
  --strict      candidate lines fail too
  --self-test   prove the gate on examples/ and teaching/

Lines:
${Object.entries(LINES).map(([k, [s, d]]) => `  ${k} (${s}): ${d}`).join('\n')}`)
  return 0
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')))
  const paths = argv.filter((a) => !a.startsWith('--'))
  if (flags.has('--help')) return help()
  if (flags.has('--self-test')) return selfTest()
  if (!paths.length) return help()
  return run(paths, { gate: flags.has('--gate'), strict: flags.has('--strict') })
}

if (process.argv[1] && basename(process.argv[1]) === basename(fileURLToPath(import.meta.url))) process.exitCode = main(process.argv.slice(2))
