#!/usr/bin/env node
// route-check: the gate for khe-auto.
//
// It reads two kinds of file and names every fault as a line:
//   .txt  a routing reply (Goal, Route, Work, Not verified)
//   .md   a playbook (ownership line, numbered steps, a required Reply)
//
// The skills it accepts as real are read from the domain tables in
// ../SKILL.md, and the playbooks from ../playbooks/. Nothing is listed twice.
//
//   node scripts/route-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]
//
// Zero dependencies. Node 20 or newer.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(HERE, '..')
const GATE_NAME = 'route-check'

// The seven gates of the collection, one per khe skill. gate-all.mjs imports
// this, and --self-test checks that references/loop.md lists every one.
export const GATES = {
  'khe-ui': 'khe-ui/scripts/ui-check.mjs',
  'khe-design-tokens': 'khe-design-tokens/scripts/token-check.mjs',
  'khe-svg': 'khe-svg/scripts/svg-check.mjs',
  'khe-sticker': 'khe-sticker/scripts/sticker-check.mjs',
  'khe-diagram': 'khe-diagram/scripts/diagram-check.mjs',
  'khe-sound': 'khe-sound/scripts/sound-check.mjs',
  'khe-launch-film': 'khe-launch-film/scripts/film-check.mjs',
  'khe-demo': 'khe-demo/scripts/demo-check.mjs',
  'khe-brain-emil': 'khe-brain-emil/scripts/brain-check.mjs',
  'khe-brain-benji': 'khe-brain-benji/scripts/brain-check.mjs',
  'khe-brain-isb': 'khe-brain-isb/scripts/brain-check.mjs',
  'khe-content-engine': 'khe-content-engine/scripts/content-check.mjs',
  'khe-auto': 'khe-auto/scripts/route-check.mjs',
}

// Every line the gate can print. "never" lines fail the gate. "candidate"
// lines are reported for judgment and fail only under --strict.
export const LINES = {
  // replies
  'no-goal': ['never', 'The reply does not open with a Goal: line'],
  'no-route': ['never', 'No Route: line, or a route that names no skill, no playbook and not "none"'],
  'too-many-skills': ['never', 'More than two skills in a route that is not a playbook'],
  'unknown-skill': ['never', 'A skill named that is not in a domain table'],
  'unknown-playbook': ['never', 'A playbook named that is not in playbooks/'],
  'two-playbooks': ['never', 'More than one playbook loaded for one request'],
  'no-reason': ['never', 'A skill in the route with no reason after its name'],
  'router-value': ['never', 'A design value (ms, px, dB, a curve) given inside the route'],
  'contract-not-first': ['never', 'khe-design-tokens in the route but not first'],
  'sound-before-picture': ['never', 'khe-sound ordered before khe-launch-film'],
  'no-install-line': ['never', 'A skill called not installed without its install line, or with the wrong repo'],
  'no-unverified': ['never', 'The last line is not a Not verified: line'],
  // playbooks
  'no-ownership': ['never', 'The playbook does not open with its bold "You own this" line'],
  'no-steps': ['never', 'The playbook has no numbered steps'],
  'step-no-skill': ['never', 'A step that names no skill from the tables'],
  'step-too-many': ['never', 'A step that names more than two skills'],
  'step-no-exit': ['never', 'A step with no Exit:'],
  'step-no-gate': ['never', 'A step with no Gate:, or a Gate: that names neither a gate script nor "none" with a reason'],
  'gate-mismatch': ['never', 'A step whose gate belongs to a skill the step does not name'],
  'no-reply': ['never', 'The playbook does not end with its **Reply:** paragraph'],
  // both
  'unknown-gate': ['never', 'A *-check.mjs script named that is not one of the seven gates'],
  // candidates
  'goal-asks': ['candidate', 'The goal line ends in a question mark'],
  'no-owner': ['candidate', 'A route line for a linked skill that does not say whose it is'],
  'no-gate-line': ['candidate', 'A reply with work from a skill that ships a gate, and no gate result in it'],
  'verified-everything': ['candidate', 'A Not verified: line that claims nothing was left unverified'],
  'off-playbook': ['candidate', 'A skill in a playbook route that the playbook itself never names'],
  'gate-skipped': ['candidate', 'A step that uses a skill with a gate and says Gate: none'],
  'reply-no-unverified': ['candidate', 'A playbook Reply that never asks for what was not verified'],
  'no-loop': ['candidate', 'A playbook that never points at references/loop.md'],
}

const HELP = `route-check: the gate for khe-auto

Usage:
  node scripts/route-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]

What it reads:
  *.txt   a routing reply: Goal:, Route:, optional Work:, and a last line Not verified:
  *.md    a playbook: a bold "You own this" line, numbered steps, a **Reply:** paragraph
  A folder is walked. SKILL.md, README.md, ROUTE.md, references/ and scripts/ are skipped.

Flags:
  --gate        end with "${GATE_NAME} passed" and exit 0 only when every never-intentional line is at 0;
                exit 1 with the counts otherwise; exit 2 with "inconclusive" when it could not check
  --strict      candidate lines fail too
  --report f    write { status, exitCode, files, findings, notChecked } as JSON
  --self-test   prove the gate on examples/, playbooks/ and teaching/
  --help        this text

Every finding prints as  <line-name>: <what and where> (<file>:<line>)

Never intentional (the gate fails on any):
${Object.entries(LINES).filter(([, v]) => v[0] === 'never').map(([k, v]) => `  ${(k + ':').padEnd(22)} ${v[1]}`).join('\n')}

Candidates (reported for judgment):
${Object.entries(LINES).filter(([, v]) => v[0] === 'candidate').map(([k, v]) => `  ${(k + ':').padEnd(22)} ${v[1]}`).join('\n')}

Not checked by this gate:
  - whether the route is the right one for the request; it never sees the request
  - whether a skill was stretched over a problem it does not own
  - whether the work followed the skill's rules; that is the skill's own gate
  - whether a gate named in a reply was run, or what it printed
  - whether a value in the Work section came from a reference or from memory
  - whether an exit was checked from evidence
  - a "list" reply, which is three tables and has no route

passing is necessary, not sufficient`

// ---- Reading the collection -------------------------------------------------

const norm = (s) => s.replace(/^﻿/, '').replace(/\r\n?/g, '\n')
const sectionOf = (text, heading) => {
  const at = text.indexOf(`\n## ${heading}\n`)
  if (at < 0) return ''
  const rest = text.slice(at + heading.length + 5)
  const end = rest.indexOf('\n## ')
  return end < 0 ? rest : rest.slice(0, end)
}

// The skills, their owners, the install repos and the playbooks, all from the
// skill's own files. Returns null when SKILL.md cannot be read.
export function readCollection(skillDir = SKILL_DIR) {
  const path = join(skillDir, 'SKILL.md')
  if (!existsSync(path)) return null
  const text = norm(readFileSync(path, 'utf8'))
  const skills = new Map()
  for (const heading of ['Design', 'Code', 'Brains', 'Content']) {
    for (const row of sectionOf(text, heading).split('\n')) {
      const cells = row.split('|').map((c) => c.trim())
      const m = cells.length >= 5 && cells[2].match(/^`([a-z0-9-]+)`$/)
      if (m) skills.set(m[1], cells[3])
    }
  }
  if (!skills.size) return null
  const self = text.match(/^name:\s*(.+)$/m)?.[1].trim()
  if (self) skills.set(self, 'here')
  const repos = {}
  const owners = [...new Set(skills.values())].filter((w) => w !== 'here')
  for (const line of sectionOf(text, 'How to run a skill').split('\n')) {
    const m = line.match(/npx skills add (\S+)/)
    if (!m) continue
    if (line.includes('`khe-`')) repos.here = m[1]
    for (const w of owners) if (line.includes(w.split(' ')[0])) repos[w] = m[1]
  }
  const listed = [...sectionOf(text, 'Playbooks').matchAll(/\]\(playbooks\/([a-z0-9-]+)\.md\)/g)].map((m) => m[1])
  const dir = join(skillDir, 'playbooks')
  const playbooks = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3)) : []
  const playbookText = Object.fromEntries(playbooks.map((p) => [p, norm(readFileSync(join(dir, `${p}.md`), 'utf8'))]))
  return { skills, repos, playbooks, listed, playbookText }
}

// ---- Shared helpers ---------------------------------------------------------

const ticks = (s) => [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1])
const NAME = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/
const GATE_PATHS = new Set(Object.values(GATES))
const isComment = (l) => /^<!--.*-->$/.test(l.trim())
// A token such as `khe-svg/scripts/svg-check.mjs --gate` names a gate script.
const gateToken = (t) => {
  const first = t.trim().replace(/^node\s+/, '').split(/\s+/)[0]
  return /-check\.mjs$/.test(first) ? first : null
}

function content(text) {
  // [lineNumber, text] for every line that is not blank and not a leading comment.
  const out = []
  let lead = true
  text.split('\n').forEach((l, i) => {
    if (lead && (l.trim() === '' || isComment(l))) return
    lead = false
    if (l.trim() !== '') out.push([i + 1, l])
  })
  return out
}

// ---- A routing reply --------------------------------------------------------

const VALUE = /\b\d+(?:\.\d+)?\s?(?:ms|px|dB|LUFS|fps|Hz|rem)\b|cubic-bezier\(|\b\d+(?:\.\d+)?%/

export function checkReply(text, file, col) {
  const out = []
  const add = (line, n, detail) => out.push({ line, file, lineNumber: n, detail, class: LINES[line][0] })
  const rows = content(text)
  if (!rows.length) return out
  const all = text.split('\n')

  const [gn, gl] = rows[0]
  if (!/^Goal:\s*\S/.test(gl)) add('no-goal', gn, 'the first line is not "Goal: <what the user wants and what comes back>"')
  else if (/\?\s*$/.test(gl)) add('goal-asks', gn, 'the goal ends in a question; state it and start')

  // The route block: the Route: line and the list lines under it.
  const ri = all.findIndex((l) => /^Route:/.test(l))
  let block = []
  if (ri < 0) add('no-route', rows[0][0], 'no line starts with "Route:"')
  else {
    block.push([ri + 1, all[ri]])
    for (let i = ri + 1; i < all.length; i++) {
      const l = all[i]
      if (l.trim() === '') continue
      if (/^(\s+|[-*]\s|\d+\.\s)/.test(l)) block.push([i + 1, l])
      else break
    }
  }

  const routeLine = ri < 0 ? '' : all[ri]
  const isNone = /^Route:\s*none\b/i.test(routeLine)
  const isPlaybook = /\bplaybooks?\b/i.test(routeLine)
  const order = []
  const playbooksNamed = []
  const hasWork = all.some((l) => /^Work:/.test(l))

  for (const [n, l] of block) {
    const head = l.replace(/^Route:\s*/, '').replace(/^\s*(?:[-*]|\d+\.)\s*/, '')
    const headTok = head.match(/^`([^`]+)`/)?.[1]
    for (const t of ticks(l)) {
      const bare = t.replace(/^playbooks\//, '').replace(/\.md$/, '')
      if (col.playbooks.includes(bare) && /\bplaybooks?\b/i.test(l)) { if (!playbooksNamed.includes(bare)) playbooksNamed.push(bare); continue }
      if (col.skills.has(t)) { if (!order.includes(t)) order.push(t); continue }
      if (/\bplaybooks?\b/i.test(l) && NAME.test(bare) && !bare.startsWith('khe-') && l === routeLine) { add('unknown-playbook', n, `\`${t}\` is not a file in playbooks/`); continue }
      if ((t.startsWith('khe-') && NAME.test(t)) || (t === headTok && NAME.test(t))) {
        add('unknown-skill', n, `\`${t}\` is not in a domain table`)
        if (!order.includes(t)) order.push(t)
      }
    }
    if (headTok && NAME.test(headTok) && !(isPlaybook && l === routeLine)) {
      const rest = head.slice(headTok.length + 2).replace(/^\s*:/, '')
      if (!/[A-Za-z]/.test(rest)) add('no-reason', n, `\`${headTok}\` has no reason after its name; write \`${headTok}\`: <why it owns this>`)
      const whose = col.skills.get(headTok)
      if (whose && whose !== 'here' && !l.includes(whose)) add('no-owner', n, `\`${headTok}\` is ${whose}'s and the line does not say so`)
    }
    if (VALUE.test(l)) add('router-value', n, `"${l.match(VALUE)[0]}" in the route; a value comes from the owning skill's reference, inside the work`)
  }

  if (ri >= 0) {
    if (isPlaybook) {
      if (!playbooksNamed.length && !out.some((f) => f.line === 'unknown-playbook')) add('unknown-playbook', ri + 1, 'the route says playbook and names none from playbooks/')
      if (playbooksNamed.length > 1) add('two-playbooks', ri + 1, `${playbooksNamed.map((p) => `\`${p}\``).join(' and ')}; one request loads one playbook`)
      if (playbooksNamed.length === 1) {
        const body = col.playbookText[playbooksNamed[0]] || ''
        for (const s of order) if (col.skills.has(s) && !body.includes(`\`${s}\``)) add('off-playbook', ri + 1, `\`${s}\` is in the route and \`${playbooksNamed[0]}\` never names it`)
      }
    } else if (!isNone) {
      if (!order.length) add('no-route', ri + 1, 'the route names no skill, no playbook and not "none"')
      if (order.length > 2) add('too-many-skills', ri + 1, `${order.length} skills (${order.map((s) => `\`${s}\``).join(', ')}); two at most, or a playbook that orders them`)
      const at = (s) => order.indexOf(s)
      if (at('khe-design-tokens') > 0) add('contract-not-first', ri + 1, `\`khe-design-tokens\` runs after \`${order[0]}\`; the contract goes first`)
      if (at('khe-sound') >= 0 && at('khe-launch-film') > at('khe-sound')) add('sound-before-picture', ri + 1, '`khe-sound` is ordered before `khe-launch-film`; picture locks before sound')
    }
  }

  // Everything outside the route block.
  const inBlock = new Set(block.map(([n]) => n))
  let installSeen = false
  let notInstalledAt = 0
  all.forEach((l, i) => {
    const n = i + 1
    if (/\bnot installed\b/i.test(l) && !notInstalledAt) notInstalledAt = n
    const inst = l.match(/npx skills add (\S+) --skill ([a-z0-9-]+)/)
    if (inst) {
      installSeen = true
      const whose = col.skills.get(inst[2])
      if (!whose) add('unknown-skill', n, `the install line names \`${inst[2]}\`, which is not in a domain table`)
      else if (col.repos[whose] && col.repos[whose] !== inst[1]) add('no-install-line', n, `\`${inst[2]}\` installs from ${col.repos[whose]}, not ${inst[1]}`)
    }
    for (const t of ticks(l)) {
      const g = gateToken(t)
      if (g && !GATE_PATHS.has(g)) add('unknown-gate', n, `\`${g}\` is not one of the seven gates`)
      if (!inBlock.has(n) && !g && t.startsWith('khe-') && NAME.test(t) && !col.skills.has(t)) add('unknown-skill', n, `\`${t}\` is not in a domain table`)
    }
  })
  if (notInstalledAt && !installSeen) add('no-install-line', notInstalledAt, 'a skill is called not installed and no "npx skills add <repo> --skill <name>" line follows')

  if (hasWork && !isPlaybook && !isNone) {
    for (const s of order) {
      const gate = GATES[s]
      if (!gate || s === 'khe-auto') continue
      if (!text.includes(basename(gate)) && !/\binconclusive\b|\bno gate\b|\bnot installed\b/i.test(text)) {
        add('no-gate-line', all.findIndex((l) => /^Work:/.test(l)) + 1, `work from \`${s}\` and no result from \`${gate}\``)
      }
    }
  }

  const [ln, ll] = rows[rows.length - 1]
  const nv = ll.match(/^Not verified:\s*(\S.*)$/)
  if (!nv) add('no-unverified', ln, 'the last line is not "Not verified: <what was not checked>"')
  else if (/^(nothing|none|n\/a|everything was verified)\.?$/i.test(nv[1].trim())) add('verified-everything', ln, 'nothing left unverified is a claim; name what was not looked at')

  return out
}

// ---- A playbook -------------------------------------------------------------

export function checkPlaybook(text, file, col) {
  const out = []
  const add = (line, n, detail) => out.push({ line, file, lineNumber: n, detail, class: LINES[line][0] })
  const rows = content(text)
  if (!rows.length) return out
  const all = text.split('\n')

  const afterTitle = rows.find(([, l]) => !/^#\s/.test(l))
  if (!afterTitle || !/^\*\*You own this\b/.test(afterTitle[1])) add('no-ownership', (afterTitle || rows[0])[0], 'the first paragraph does not start with **You own this ...**')

  // Steps: a numbered line and its indented continuation lines.
  const steps = []
  all.forEach((l, i) => {
    const m = l.match(/^(\d+)\.\s+(.*)$/)
    if (m) steps.push({ n: i + 1, num: m[1], text: m[2] })
    else if (steps.length && /^\s{2,}\S/.test(l) && all[i - 1].trim() !== '') steps[steps.length - 1].text += ' ' + l.trim()
  })
  if (!steps.length) add('no-steps', rows[0][0], 'no line starts with "1. "')

  const stepLines = new Set(steps.map((s) => s.n))
  for (const s of steps) {
    const toks = ticks(s.text)
    const skills = new Set(toks.filter((t) => col.skills.has(t)))
    const unknown = new Set()
    for (const t of toks) if (t.startsWith('khe-') && NAME.test(t) && !col.skills.has(t)) unknown.add(t)
    for (const m of s.text.matchAll(/\bwith `([^`]+)`/g)) if (NAME.test(m[1]) && !col.skills.has(m[1])) unknown.add(m[1])
    for (const t of unknown) add('unknown-skill', s.n, `step ${s.num} names \`${t}\`, which is not in a domain table`)
    if (!skills.size && !unknown.size) add('step-no-skill', s.n, `step ${s.num} names no skill; write "with \`<skill>\`"`)
    if (skills.size > 2) add('step-too-many', s.n, `step ${s.num} names ${skills.size} skills (${[...skills].map((t) => `\`${t}\``).join(', ')}); two at most`)
    if (!/\bExit:\s*\S/.test(s.text)) add('step-no-exit', s.n, `step ${s.num} has no "Exit:"; say what can be checked when it is done`)

    const gm = s.text.match(/\bGate:\s*(.*)$/)
    if (!gm) { add('step-no-gate', s.n, `step ${s.num} has no "Gate:"; name the gate script, or "none" and why`); continue }
    const gates = ticks(gm[1]).map(gateToken).filter(Boolean)
    if (!gates.length) {
      if (!/^none\b[,:;.]?\s*[A-Za-z`]/i.test(gm[1].trim())) add('step-no-gate', s.n, `step ${s.num}: "Gate:" names neither a gate script nor "none" with a reason`)
      else for (const k of skills) if (GATES[k] && k !== 'khe-auto') { add('gate-skipped', s.n, `step ${s.num} uses \`${k}\`, which ships \`${GATES[k]}\`, and says Gate: none`); break }
    }
    for (const g of gates) {
      if (!GATE_PATHS.has(g)) { add('unknown-gate', s.n, `step ${s.num}: \`${g}\` is not one of the seven gates`); continue }
      const owner = g.split('/')[0]
      if (!skills.has(owner)) add('gate-mismatch', s.n, `step ${s.num} runs \`${g}\` and never names \`${owner}\`; a step is checked by the gate of the skill that did it`)
    }
  }
  all.forEach((l, i) => {
    if (stepLines.has(i + 1)) return
    for (const t of ticks(l)) { const g = gateToken(t); if (g && !GATE_PATHS.has(g)) add('unknown-gate', i + 1, `\`${g}\` is not one of the seven gates`) }
  })

  const [ln, ll] = rows[rows.length - 1]
  if (!/^\*\*Reply:\*\*\s*\S/.test(ll)) add('no-reply', ln, 'the last paragraph is not "**Reply:** <what the reply must contain>"')
  else if (!/\bnot\b|\bneeds a\b|\bunverified\b/i.test(ll)) add('reply-no-unverified', ln, 'the Reply never asks for what was not verified')
  if (!/references\/loop\.md/.test(text)) add('no-loop', rows[0][0], 'the playbook never points at references/loop.md')

  return out
}

// ---- Files ------------------------------------------------------------------

const SKIP_DIRS = new Set(['scripts', 'references', 'node_modules', '.git'])
const SKIP_FILES = new Set(['SKILL.md', 'README.md', 'ROUTE.md', 'LICENSE'])
const show = (p) => (relative(process.cwd(), p) || p).replace(/\\/g, '/')

function collect(paths, notChecked) {
  const files = []
  const walk = (dir) => {
    for (const f of readdirSync(dir).sort()) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(f)) walk(p) }
      else if (!SKIP_FILES.has(f) && ['.txt', '.md'].includes(extname(f))) files.push(p)
    }
  }
  for (const raw of paths) {
    const p = resolve(raw)
    if (!existsSync(p)) { notChecked.push(`${show(p)}: no such file or folder`); continue }
    if (statSync(p).isDirectory()) walk(p)
    else if (['.txt', '.md'].includes(extname(p))) files.push(p)
    else notChecked.push(`${show(p)}: not a .txt reply or a .md playbook`)
  }
  return files
}

export function checkFile(path, col, notChecked = []) {
  const text = norm(readFileSync(path, 'utf8'))
  if (!content(text).length) { notChecked.push(`${show(path)}: empty`); return [] }
  return extname(path) === '.md' ? checkPlaybook(text, show(path), col) : checkReply(text, show(path), col)
}

const never = (fs) => fs.filter((f) => f.class === 'never')
const tally = (fs) => {
  const c = {}
  for (const f of fs) c[f.line] = (c[f.line] || 0) + 1
  return Object.entries(c).map(([k, v]) => `${k} ${v}`).join(', ')
}

// ---- Self-test --------------------------------------------------------------

function selfTest() {
  let failed = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const col = readCollection()
  say(!!col, 'SKILL.md has domain tables with skills in them')
  if (!col) { console.log('\nself-test failed: 1'); return 1 }

  say(Object.keys(GATES).every((s) => col.skills.has(s)), 'every skill with a gate is in the tables')
  say(col.listed.length > 0 && col.listed.every((p) => col.playbooks.includes(p)) && col.playbooks.every((p) => col.listed.includes(p)), 'the Playbooks table and playbooks/ list the same files')
  for (const k of ['here', ...new Set([...col.skills.values()].filter((w) => w !== 'here'))]) say(!!col.repos[k], `an install line exists for skills that are ${k === 'here' ? 'in this repo' : k + "'s"}`)
  const loop = join(SKILL_DIR, 'references', 'loop.md')
  const loopText = existsSync(loop) ? norm(readFileSync(loop, 'utf8')) : ''
  for (const g of GATE_PATHS) say(loopText.includes(`\`${g}\``), `references/loop.md lists ${g}`)

  const list = (dir, pred = () => true) => (existsSync(dir) ? readdirSync(dir).filter(pred).sort() : [])
  const examples = list(join(SKILL_DIR, 'examples'), (f) => /\.(txt|md)$/.test(f))
  say(examples.length >= 3, `examples/ holds ${examples.length} gold files (three at least)`)
  for (const f of examples) {
    const bad = never(checkFile(join(SKILL_DIR, 'examples', f), col))
    say(!bad.length, `examples/${f} raises no never-intentional line${bad.length ? ` (got ${tally(bad)})` : ''}`)
  }
  for (const p of col.playbooks) {
    const bad = never(checkFile(join(SKILL_DIR, 'playbooks', `${p}.md`), col))
    say(!bad.length, `playbooks/${p}.md raises no never-intentional line${bad.length ? ` (got ${tally(bad)})` : ''}`)
  }

  const tdir = join(SKILL_DIR, 'teaching')
  const pairs = list(tdir, (f) => statSync(join(tdir, f)).isDirectory())
  say(pairs.length >= 8, `teaching/ holds ${pairs.length} pairs (eight at least)`)
  for (const name of pairs) {
    const dir = join(tdir, name)
    const bad = list(dir, (f) => f.startsWith('bad.'))[0]
    const good = list(dir, (f) => f.startsWith('good.'))[0]
    if (!LINES[name]) { say(false, `teaching/${name} is named for a line the gate prints`); continue }
    if (!bad || !good) { say(false, `teaching/${name} has a bad and a good file`); continue }
    const first = norm(readFileSync(join(dir, bad), 'utf8')).split('\n')[0]
    say(isComment(first) && first.includes(name), `teaching/${name}/${bad} starts with a comment naming ${name}`)
    const b = never(checkFile(join(dir, bad), col)).map((f) => f.line)
    say(b.includes(name), `teaching/${name}/${bad} raises ${name}:`)
    say(new Set(b).size === 1 && b[0] === name, `teaching/${name}/${bad} has one thing wrong${b.length ? ` (raises ${[...new Set(b)].join(', ')})` : ''}`)
    const g = never(checkFile(join(dir, good), col))
    say(!g.length, `teaching/${name}/${good} raises no never-intentional line${g.length ? ` (got ${tally(g)})` : ''}`)
  }

  // Lines with no teaching pair are proven on the smallest text that raises them.
  const reply = (...l) => checkReply(l.join('\n'), 'inline', col).map((f) => f.line)
  const book = (...l) => checkPlaybook(l.join('\n'), 'inline', col).map((f) => f.line)
  const someSkill = [...col.skills.keys()].find((s) => !GATES[s])
  const P = ['# X', '', '**You own this from a to b.**', '', 'Run the loop in references/loop.md.', '']
  const R = ['', '**Reply:** the file, and what you could not verify.']
  const inline = [
    ['no-route', reply('Goal: a thing.', 'Work: done.', 'Not verified: the phone.')],
    ['no-route', reply('Goal: a thing.', 'Route: whatever fits.', 'Not verified: the phone.')],
    ['unknown-playbook', reply('Goal: a thing.', 'Route: playbook `ship-it`', 'Not verified: the phone.')],
    ['unknown-gate', reply('Goal: a thing.', 'Route: none. No skill here applies.', 'Ran `khe-ui/scripts/screen-check.mjs --gate`.', 'Not verified: the phone.')],
    ['verified-everything', reply('Goal: a thing.', 'Route: none. No skill here applies.', 'Not verified: nothing.')],
    ['goal-asks', reply('Goal: do you want a film?', 'Route: none. No skill here applies.', 'Not verified: the phone.')],
    ['no-owner', reply('Goal: a thing.', 'Route:', `- \`${someSkill}\`: it owns the job.`, 'Not verified: the phone.')],
    ['off-playbook', reply('Goal: a thing.', 'Route: playbook `explain-a-system`, with `khe-sound`', 'Not verified: the phone.')],
    ['no-gate-line', reply('Goal: a thing.', 'Route:', '- `khe-svg`: the file is the job.', 'Work: cleaned the paths.', 'Not verified: the phone.')],
    ['no-ownership', book('# X', '', 'A playbook.', '', '1. **Do** with `khe-svg`. Exit: a file. Gate: `khe-svg/scripts/svg-check.mjs`.', ...R)],
    ['no-steps', book(...P, 'Do the thing with `khe-svg`.', ...R)],
    ['step-no-skill', book(...P, '1. **Do** it. Exit: a file. Gate: none, a decision.', ...R)],
    ['step-too-many', book(...P, '1. **Do** with `khe-svg`, `khe-ui` and `khe-sound`. Exit: a file. Gate: `khe-svg/scripts/svg-check.mjs`.', ...R)],
    ['unknown-skill', book(...P, '1. **Do** with `motion-wizard`. Exit: a file. Gate: none, it ships no gate.', ...R)],
    ['unknown-gate', book(...P, '1. **Do** with `khe-svg`. Exit: a file. Gate: `khe-svg/scripts/vector-check.mjs`.', ...R)],
    ['gate-skipped', book(...P, '1. **Do** with `khe-svg`. Exit: a file. Gate: none, a decision.', ...R)],
    ['reply-no-unverified', book(...P, '1. **Do** with `khe-svg`. Exit: a file. Gate: `khe-svg/scripts/svg-check.mjs`.', '', '**Reply:** the file.')],
    ['no-loop', book('# X', '', '**You own this from a to b.**', '', '1. **Do** with `khe-svg`. Exit: a file. Gate: `khe-svg/scripts/svg-check.mjs`.', ...R)],
  ]
  for (const [line, got] of inline) say(got.includes(line), `an inline case raises ${line}:`)
  const clean = book(...P, '1. **Do** with `khe-svg`. Exit: a file. Gate: `khe-svg/scripts/svg-check.mjs`.', ...R)
  say(!clean.length, `the smallest correct playbook raises nothing${clean.length ? ` (got ${clean.join(', ')})` : ''}`)

  const covered = new Set([...pairs, ...inline.map(([l]) => l)])
  for (const l of Object.keys(LINES)) say(covered.has(l), `${l}: is proven by a pair or an inline case`)

  console.log(failed ? `\nself-test failed: ${failed}` : '\nself-test passed')
  return failed ? 1 : 0
}

// ---- Main -------------------------------------------------------------------

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')))
  if (flags.has('--help') || flags.has('-h')) { console.log(HELP); return 0 }
  if (flags.has('--self-test')) return selfTest()

  let reportPath = null
  const paths = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--report') reportPath = argv[++i]
    else if (!argv[i].startsWith('--')) paths.push(argv[i])
  }
  const gate = flags.has('--gate')
  const strict = flags.has('--strict')
  const notChecked = []
  const findings = []
  let files = []

  const col = readCollection()
  if (!col) notChecked.push('SKILL.md: the domain tables could not be read, so no skill name can be checked')
  else {
    if (!paths.length) notChecked.push('no input: pass a reply (.txt), a playbook (.md) or a folder')
    files = collect(paths, notChecked)
    if (paths.length && !files.length) notChecked.push('no .txt reply or .md playbook found in the input')
    for (const f of files) findings.push(...checkFile(f, col, notChecked))
  }

  for (const f of findings) console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
  const hard = never(findings)
  const soft = findings.filter((f) => f.class === 'candidate')
  const replies = files.filter((f) => extname(f) === '.txt').length
  if (findings.length) console.log('')
  console.log(`checked ${files.length} file${files.length === 1 ? '' : 's'}: ${replies} repl${replies === 1 ? 'y' : 'ies'}, ${files.length - replies} playbook${files.length - replies === 1 ? '' : 's'}`)
  console.log(`never intentional: ${hard.length}${hard.length ? ` (${tally(hard)})` : ''}`)
  console.log(`candidates: ${soft.length}${soft.length ? ` (${tally(soft)})` : ''}`)
  for (const n of notChecked) console.log(`not checked: ${n}`)
  console.log('passing is necessary, not sufficient')

  const failing = hard.length + (strict ? soft.length : 0)
  const status = failing ? 'failed' : notChecked.length ? 'inconclusive' : 'passed'
  const exitCode = status === 'inconclusive' ? 2 : status === 'failed' && (gate || strict) ? 1 : 0
  if (reportPath) {
    writeFileSync(reportPath, JSON.stringify({ status, exitCode, files: files.map(show), findings, notChecked }, null, 2) + '\n')
  }
  if (gate) {
    if (status === 'passed') console.log(`${GATE_NAME} passed`)
    else if (status === 'inconclusive') console.log(`${GATE_NAME} inconclusive: ${notChecked.length} thing${notChecked.length === 1 ? '' : 's'} not checked`)
    else console.log(`${GATE_NAME} failed: ${hard.length} never-intentional${strict ? `, ${soft.length} candidate` : ''}`)
  }
  return exitCode
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv.slice(2))
}
