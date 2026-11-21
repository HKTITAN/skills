#!/usr/bin/env node
// decision-check: the gate for khe-decision.
//
// It reads a saved council reply (a .txt or .md file) and names every fault it
// can prove as a line. A reply is a Decision: line, a Council: line, two or
// more "== Seat: <brain> (<name>) ==" blocks, each one a brain's own reply in
// its own format, and a "== Chair ==" block. Each seat block is judged by that
// brain's own scripts/brain-check.mjs, so a brain added later brings its own
// format. The chair block is judged here: every chair citation must occur in
// the seat it names, and the recommendation must carry khe-decision's label.
//
//   node scripts/decision-check.mjs <files or folders...> [--gate] [--strict] [--report out.json] [--brains <dir>]...
//   node scripts/decision-check.mjs --seats [--json] [--brains <dir>]...
//   node scripts/decision-check.mjs --self-test
//   node scripts/decision-check.mjs --help
//
// Zero dependencies. Node 20 or newer.

import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { delimiter, dirname, extname, join, relative, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(HERE, '..')
const GATE_NAME = 'decision-check'
const PREFIX = 'khe-brain-'
const LABEL = "Recommendation (khe-decision's synthesis, not the view of anyone cited):"
const READING = 'Nobody cited here wrote or endorsed it'

// Every line the gate can print. "never" lines fail the gate. "candidate"
// lines are reported for judgment and fail only under --strict.
export const LINES = {
  'no-decision': ['never', 'The first line that is not a comment is not Decision:'],
  'no-council-line': ['never', 'No Council: line, or it does not name every seat block as seated, or its count is not the number of seat blocks'],
  'too-few-seats': ['never', 'Fewer than two seat blocks, and the reply does not use the not-convened form'],
  'seat-format': ['never', "A seat block that fails its own brain's scripts/brain-check.mjs --gate"],
  'seat-uncited': ['never', 'A seat block with no Source: line, or with a line that carries no citation marker (Source:, Not in, Nearest:, Yours: and My reading: lines excepted)'],
  'no-chair': ['never', 'No == Chair == block'],
  'unlabelled-synthesis': ['never', `No line starting exactly "${LABEL}", or a Recommendation:/Verdict: line without it`],
  'no-rests-on': ['never', 'No Rests on: line with a chair citation, and the recommendation is not withheld'],
  'chair-citation': ['never', 'A chair citation [seat: text] naming a seat that is not in the reply, or text that is not in that seat\'s block'],
  'uncited-chair-claim': ['never', 'An Agree: or Disagree: line without citations from two different seats, or a Disagree: line with no Why:'],
  'ventriloquist': ['never', 'A position in a real person\'s mouth ("Varun would say", "the council recommends") outside the seat blocks'],
  'named-without-citation': ['never', 'A chair sentence that names a seated person or institution and carries no chair citation'],
  'no-would-change': ['never', 'No Would change it: line'],
  'no-not-verified': ['never', 'No Not verified: line'],
  'no-reading-line': ['never', `The last line does not say "${READING}"`],
  'not-convened-form': ['never', 'A "Council: not convened" reply that has a seat or chair block, a recommendation, or lacks Not covered:, Next: or Not verified:'],
  // candidates
  'seat-unchecked': ['candidate', "The seat's brain or its scripts/brain-check.mjs is not installed, so the block got only the generic check"],
  'hedge': ['candidate', 'maybe, perhaps, probably or arguably in the chair block'],
  'brain-unaccounted': ['candidate', 'An installed brain that the Council: line names neither as seated nor as left out'],
}

const HELP = `decision-check: the gate for khe-decision

Usage:
  node scripts/decision-check.mjs <files or folders...> [--gate] [--strict] [--report out.json] [--brains <dir>]...
  node scripts/decision-check.mjs --seats [--json] [--brains <dir>]...
  node scripts/decision-check.mjs --self-test
  node scripts/decision-check.mjs --help

What it reads:
  *.txt, *.md   a saved council reply: Decision:, Council:, one "== Seat: <brain folder> (<name>) ==" block per
                seat holding that brain's whole reply, then "== Chair ==" with Agree:, Disagree:, Not covered:,
                the labelled Recommendation, Rests on:, Would change it:, Not verified: and the reading line.
                A reply that does not convene uses the not-convened form: Decision:, "Council: not convened. ...",
                Not covered:, Next:, Not verified:.
  A folder is walked. SKILL.md, README.md, LICENSE, references/, scripts/ and teaching/ are skipped.
  A file named on the command line is always checked.

Where the brains are found (first folder name wins):
  1. the siblings of this skill's folder
  2. ~/.claude/skills
  3. each --brains <dir>, then each dir in the path list KHE_BRAINS_DIR
  A brain is a folder whose name starts with ${PREFIX} and that holds a SKILL.md.
  --no-default-roots drops roots 1 and 2; it exists for the self-test of the no-brains case.

Flags:
  --gate        end with "${GATE_NAME} passed" and exit 0 only when no never line is raised;
                exit 1 with "${GATE_NAME} failed: <n> fault(s)" otherwise; exit 2 with "inconclusive" when nothing was checked
  --strict      candidate lines fail too
  --report f    write { status, exitCode, files, findings, notChecked } as JSON
  --seats       list every installed brain: folder, name, path, whether it has a gate, what it answers
  --json        with --seats, print the same list as JSON
  --self-test   prove the gate on teaching/ and examples/, and check seat discovery
  --help        this text

Every finding prints as  <line-name>: <what and where> (<file>:<line>)
A seat-format finding is followed by the brain gate's own fault lines, indented.

Never intentional (the gate fails on any):
${Object.entries(LINES).filter(([, v]) => v[0] === 'never').map(([k, v]) => `  ${(k + ':').padEnd(24)} ${v[1]}`).join('\n')}

Candidates (reported for judgment):
${Object.entries(LINES).filter(([, v]) => v[0] === 'candidate').map(([k, v]) => `  ${(k + ':').padEnd(24)} ${v[1]}`).join('\n')}

Not checked by this gate:
  - whether a seat's cited line says what the seat claims; the brain's own gate matches titles, never meaning
  - whether the chair restates a seat's line faithfully; it checks that the cited text exists in that seat
  - whether the right brains were seated, beyond naming every installed brain on the Council: line
  - whether two seats that disagree were each cited truthfully
  - whether the recommendation follows from what the seats said
  - whether seats ran apart from each other; that is stated on the Not verified: line

passing is necessary, not sufficient`

// ---- Text helpers -----------------------------------------------------------

const CH = (...codes) => String.fromCharCode(...codes)
const EM_DASH = CH(0x2014)
const norm = (s) => s.replace(new RegExp('^' + CH(0xfeff)), '').replace(/\r\n?/g, '\n').replace(new RegExp('[' + CH(0x201c, 0x201d) + ']', 'g'), '"').replace(new RegExp('[' + CH(0x2018, 0x2019) + ']', 'g'), "'")
const isComment = (l) => /^<!--.*-->$/.test(l.trim())
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const flat = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim()
const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z"`(\[])/).map((x) => x.trim()).filter(Boolean)
const mkdirp = (p) => mkdirSync(p, { recursive: true })
const show = (p) => (relative(process.cwd(), p) || p).replace(/\\/g, '/')
const CITE = '\\[([a-z0-9][a-z0-9-]*):\\s*([^\\[\\]\\n]+?)\\s*\\]'
const citesOf = (s) => [...s.matchAll(new RegExp(CITE, 'gi'))].map((m) => ({ seat: m[1].toLowerCase(), text: m[2] }))
const NAME_STOP = new Set(['the', 'and', 'for', 'notes', 'note'])

// ---- Finding the brains -----------------------------------------------------

function frontDescription(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---/)
  if (!fm) return ''
  const lines = fm[1].split('\n')
  const at = lines.findIndex((l) => /^description:/.test(l))
  if (at < 0) return ''
  const rest = lines[at].replace(/^description:\s*/, '')
  const q = rest.match(/^"((?:[^"\\]|\\.)*)"/)
  if (q) return q[1].replace(/\\(["\\])/g, '$1')
  if (/^[>|][+-]?$/.test(rest)) {
    const body = []
    for (const l of lines.slice(at + 1)) { if (/^\S/.test(l)) break; body.push(l.trim()) }
    return body.join(' ').trim()
  }
  return rest.replace(/^'(.*)'$/, '$1').trim()
}

const firstSentence = (s) => s.split(/(?<=[a-z0-9)"'])\.\s+(?=[A-Z])/)[0].trim()

// Every folder in the roots whose name starts with khe-brain- and that holds a
// SKILL.md. The first root to hold a name wins.
export function discover(roots) {
  const found = new Map()
  for (const root of roots) {
    if (!existsSync(root) || !statSync(root).isDirectory()) continue
    for (const name of readdirSync(root).sort()) {
      if (!name.startsWith(PREFIX) || found.has(name)) continue
      const dir = join(root, name)
      const skill = join(dir, 'SKILL.md')
      if (!statSync(dir).isDirectory() || !existsSync(skill)) continue
      const text = norm(readFileSync(skill, 'utf8'))
      const h1 = text.match(/^#\s+Brain:\s*(.+?)\s*$/m)
      found.set(name, {
        name,
        person: h1 ? h1[1] : name.slice(PREFIX.length),
        path: dir,
        root,
        hasGate: existsSync(join(dir, 'scripts', 'brain-check.mjs')),
        description: firstSentence(frontDescription(text)),
      })
    }
  }
  return found
}

export function defaultRoots({ extra = [], noDefaults = false } = {}) {
  const roots = []
  if (!noDefaults) roots.push(resolve(SKILL_DIR, '..'), join(homedir(), '.claude', 'skills'))
  roots.push(...extra.map((d) => resolve(d)))
  roots.push(...(process.env.KHE_BRAINS_DIR || '').split(delimiter).filter(Boolean).map((d) => resolve(d)))
  return [...new Set(roots)]
}

function printSeats(brains, roots, json) {
  const list = [...brains.values()].sort((a, b) => a.name.localeCompare(b.name))
  if (json) { console.log(JSON.stringify(list.map(({ name, person, path, hasGate, description }) => ({ name, person, path, hasGate, description })), null, 2)); return }
  for (const b of list) console.log(`${b.name} | ${b.person} | gate: ${b.hasGate ? 'yes' : 'no'} | ${b.path} | ${b.description}`)
  console.log(`${list.length} installed brain${list.length === 1 ? '' : 's'}, found in ${roots.filter((r) => existsSync(r)).length} of ${roots.length} root${roots.length === 1 ? '' : 's'}`)
  for (const r of roots) console.log(`root: ${r}${existsSync(r) ? '' : ' (absent)'}`)
}

// ---- Parsing a reply --------------------------------------------------------

const SEAT_HEADER = /^==\s*Seat:\s*(.+?)\s*==\s*$/
const CHAIR_HEADER = /^==\s*Chair\s*==\s*$/i
const ANY_HEADER = /^==.*==\s*$/

function parseReply(text) {
  const raw = norm(text).split('\n')
  const rows = raw.map((t, i) => ({ n: i + 1, text: t }))
  const seats = []
  let chair = null
  const outside = [] // lines outside every seat block, comments and blanks removed
  let mode = 'head'
  let cur = null
  for (const r of rows) {
    const t = r.text.trim()
    const sh = t.match(SEAT_HEADER)
    if (sh) {
      const m = sh[1].match(/^(\S+)(?:\s*\((.*)\))?$/)
      const folder = m ? m[1] : sh[1]
      cur = { folder, short: folder.startsWith(PREFIX) ? folder.slice(PREFIX.length) : folder, person: m && m[2] ? m[2] : folder, headerLine: r.n, lines: [] }
      seats.push(cur); mode = 'seat'; continue
    }
    if (CHAIR_HEADER.test(t)) { chair = { headerLine: r.n, lines: [] }; mode = 'chair'; cur = null; continue }
    if (ANY_HEADER.test(t)) { mode = 'other'; cur = null; continue }
    if (mode === 'seat') cur.lines.push(r)
    else {
      if (t === '' || isComment(t)) continue
      outside.push(r)
      if (mode === 'chair') chair.lines.push(r)
    }
  }
  for (const s of seats) {
    const body = s.lines.map((r) => r.text)
    while (body.length && body[body.length - 1].trim() === '') body.pop()
    s.block = body.join('\n')
    s.flat = flat(body.join(' '))
  }
  return { rows, seats, chair, outside }
}

// ---- Running a seat's own gate ---------------------------------------------

const CHILD_NOISE = /^(?:never intentional|candidates|checked \d|passing is necessary|[a-z-]+ (?:passed|failed|inconclusive))/

function runBrainGate(brain, seat, file) {
  const dir = mkdtempSync(join(tmpdir(), 'khe-decision-'))
  try {
    const tmp = join(dir, `${seat.short}.txt`)
    writeFileSync(tmp, seat.block + '\n')
    const r = spawnSync(process.execPath, [join(brain.path, 'scripts', 'brain-check.mjs'), tmp, '--gate'], { cwd: dir, encoding: 'utf8', timeout: 30000 })
    if (r.error) return { ok: false, lines: [`could not run the gate: ${r.error.message}`] }
    const lines = (r.stdout || '').split('\n').map((l) => l.trimEnd()).filter((l) => l && !CHILD_NOISE.test(l))
    const mapped = lines.map((l) => l.replace(new RegExp(`\\((?:[^()]*[\\\\/])?${esc(seat.short)}\\.txt:(\\d+)\\)\\s*$`), (_, n) => `(${file}:${seat.headerLine + Number(n)})`))
    if (r.status !== 0 && !mapped.length && r.stderr) mapped.push(...r.stderr.trim().split('\n').slice(0, 3))
    return { ok: r.status === 0, status: r.status, lines: mapped }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

// ---- A reply ----------------------------------------------------------------

const SOURCE_LIKE = /^(?:Source|Not in\b[^:\n]*|Nearest|Yours|My reading):/
const SILENCE = /\b(?:has|have|had) not (?:written|published|said|covered|addressed)\b|\b(?:do|does) not (?:cover|say|address|mention)\b|\b(?:is|are) silent\b/i
const hasMarker = (s) => /\([^()]+\)/.test(s) || /\[\d+\]/.test(s)

export function checkReply(text, file, ctx = {}) {
  const brains = ctx.brains || new Map()
  const out = []
  const add = (line, n, detail, children) => out.push({ line, file, lineNumber: n, detail, class: LINES[line][0], ...(children ? { children } : {}) })
  const p = parseReply(text)
  const first = p.rows.find((r) => r.text.trim() && !isComment(r.text))
  if (!first) return out

  if (!/^Decision:\s*\S/.test(first.text)) add('no-decision', first.n, `the first line is "${first.text.trim().slice(0, 40)}"; the reply opens with Decision: <the decision as one question>`)

  const councilRow = p.outside.find((r) => /^Council:/.test(r.text))
  const notConvened = !!councilRow && /^Council:\s*not convened\b/i.test(councilRow.text)

  if (notConvened) {
    checkNotConvened(p, add, councilRow)
    return out
  }

  // The Council: line.
  const names = p.seats.map((s) => s.folder)
  if (!councilRow) add('no-council-line', first.n, 'no line starts with Council:; name how many of how many installed brains were seated, which, and which were left out')
  else {
    const t = councilRow.text
    const sm = t.match(/Seated:\s*(.*?)(?:\.?\s*Left out:|$)/i)
    const lo = t.match(/Left out:\s*(.*)$/i)
    const seated = new Set((sm ? sm[1] : '').match(/khe-brain-[a-z0-9-]+/g) || [])
    const left = new Set((lo ? lo[1] : '').match(/khe-brain-[a-z0-9-]+/g) || [])
    const missing = names.filter((n) => !seated.has(n))
    if (missing.length) add('no-council-line', councilRow.n, `${missing.join(', ')} ${missing.length === 1 ? 'has' : 'have'} a seat block and the Council: line does not list ${missing.length === 1 ? 'it' : 'them'} after "Seated:"`)
    const empty = [...seated].filter((n) => !names.includes(n))
    if (empty.length) add('no-council-line', councilRow.n, `${empty.join(', ')} ${empty.length === 1 ? 'is' : 'are'} listed as seated and ${empty.length === 1 ? 'has' : 'have'} no seat block`)
    const count = t.match(/^Council:\s*(\d+)\s+of\s+\d+/i)
    if (count && Number(count[1]) !== p.seats.length) add('no-council-line', councilRow.n, `the line says ${count[1]} seated and the reply has ${p.seats.length} seat block${p.seats.length === 1 ? '' : 's'}`)
    for (const b of brains.keys()) if (!seated.has(b) && !left.has(b)) add('brain-unaccounted', councilRow.n, `${b} is installed and the Council: line names it neither as seated nor as left out`)
  }

  if (p.seats.length < 2) add('too-few-seats', p.seats[0] ? p.seats[0].headerLine : first.n, `${p.seats.length} seat block${p.seats.length === 1 ? '' : 's'}; agreement and disagreement need two voices. With fewer, do not convene: use the not-convened form, or hand the question to the one brain that covers it`)

  // Each seat block.
  for (const seat of p.seats) {
    const body = seat.lines.filter((r) => r.text.trim() && !isComment(r.text))
    if (!body.some((r) => /^Source:/.test(r.text))) add('seat-uncited', seat.headerLine, `seat ${seat.short} has no Source: line; a seat cites its brain or says its brain is silent, and never answers from general knowledge`)
    for (const r of body) {
      if (SOURCE_LIKE.test(r.text.trim()) || hasMarker(r.text)) continue
      if (SILENCE.test(r.text)) continue
      add('seat-uncited', r.n, `seat ${seat.short}: "${r.text.trim().slice(0, 60)}${r.text.trim().length > 60 ? ' ...' : ''}" carries no citation marker`)
    }
    const brain = brains.get(seat.folder)
    if (!brain || !brain.hasGate) {
      add('seat-unchecked', seat.headerLine, `${seat.folder} ${brain ? 'has no scripts/brain-check.mjs' : 'is not installed'}, so seat ${seat.short} got only the generic check`)
    } else {
      const r = runBrainGate(brain, seat, file)
      if (!r.ok) add('seat-format', seat.headerLine, `seat ${seat.short} fails ${seat.folder}'s own gate (exit ${r.status}); its format is that brain's, not this skill's`, r.lines)
    }
  }

  // The chair.
  if (!p.chair) { add('no-chair', p.rows[p.rows.length - 1].n, 'no "== Chair ==" block; the agreement, the disagreement, what is not covered and the labelled recommendation live there') }
  const bySeat = new Map(p.seats.map((s) => [s.short, s]))
  if (p.chair) {
    const lines = p.chair.lines
    const lab = (r, re) => re.test(r.text)
    // Citations are checked on every chair line.
    for (const r of lines) {
      for (const c of citesOf(r.text)) {
        const seat = bySeat.get(c.seat)
        if (!seat) add('chair-citation', r.n, `[${c.seat}: ${c.text}] names a seat that is not in this reply (seats: ${[...bySeat.keys()].join(', ') || 'none'})`)
        else if (!seat.flat.includes(flat(c.text))) add('chair-citation', r.n, `"${c.text}" does not occur in seat ${c.seat}; the chair may cite only what a seat cited`)
      }
    }
    for (const r of lines) {
      const isAgree = /^Agree:/.test(r.text)
      const isDis = /^Disagree:/.test(r.text)
      if (!isAgree && !isDis) continue
      const cs = citesOf(r.text)
      const seatsCited = new Set(cs.map((c) => c.seat))
      if (!cs.length) add('uncited-chair-claim', r.n, `${isAgree ? 'Agree' : 'Disagree'}: carries no chair citation; write [seat: citation] for each side`)
      else if (seatsCited.size < 2) add('uncited-chair-claim', r.n, `${isAgree ? 'Agree' : 'Disagree'}: cites one seat (${[...seatsCited][0]}); ${isAgree ? 'agreement needs two seats' : 'a disagreement needs both sides cited'}`)
      if (isDis && !/\bWhy:/.test(r.text)) add('uncited-chair-claim', r.n, 'Disagree: has no Why:; name the reason (stage, audience, date, country) or write "the pieces do not say"')
    }

    // The recommendation and its label.
    const recs = lines.filter((r) => /^(?:Recommendation|Verdict)\b/.test(r.text))
    const good = recs.find((r) => r.text.startsWith(LABEL))
    for (const r of recs) if (!r.text.startsWith(LABEL)) add('unlabelled-synthesis', r.n, `"${r.text.slice(0, 40)}" is not labelled; start the line "${LABEL}"`)
    if (!recs.length) add('unlabelled-synthesis', p.chair.headerLine, `no Recommendation line; write "${LABEL} <the call>" or "... withheld <reason>"`)
    const withheld = !!good && /^withheld\b/i.test(good.text.slice(LABEL.length).trim())
    if (!withheld && !lines.some((r) => /^Rests on:/.test(r.text) && citesOf(r.text).length)) add('no-rests-on', p.chair.headerLine, 'no "Rests on:" line with a chair citation; a recommendation names the cited lines it stands on')

    if (!lines.some((r) => /^Would change it:\s*\S/.test(r.text))) add('no-would-change', p.chair.headerLine, 'no "Would change it:" line; name the fact that would flip the call')
    if (!lines.some((r) => /^Not verified:\s*\S/.test(r.text))) add('no-not-verified', p.chair.headerLine, 'no "Not verified:" line; say what was not checked')

    // Names the chair uses without a citation.
    const nameAlt = nameWords(p.seats)
    const nameRe = new RegExp(`\\b(?:${nameAlt.join('|')})\\b`, 'i')
    for (const r of lines) {
      if (!/^(?:Agree|Disagree|Recommendation)\b/.test(r.text)) continue
      const body = r.text.startsWith(LABEL) ? r.text.slice(LABEL.length) : r.text.replace(/^[A-Za-z ]+:\s*/, '')
      for (const s of sentences(body)) {
        if (nameRe.test(s.replace(new RegExp(CITE, 'gi'), ' ')) && !citesOf(s).length) add('named-without-citation', r.n, `"${s.slice(0, 70)}${s.length > 70 ? ' ...' : ''}" names a seated person or institution and carries no [seat: citation]`)
      }
    }

    for (const r of lines) {
      const stripped = r.text.replace(new RegExp(CITE, 'gi'), ' ')
      const m = stripped.match(/\b(maybe|perhaps|probably|arguably)\b/i)
      if (m) add('hedge', r.n, `"${m[1].toLowerCase()}"; the seats cite a line or they do not, so the chair states it or says it is not covered`)
    }
  }

  // The last line.
  const lastRow = [...p.rows].reverse().find((r) => r.text.trim() && !isComment(r.text))
  if (!lastRow || !lastRow.text.includes(READING)) add('no-reading-line', lastRow ? lastRow.n : first.n, `the last line does not say "${READING}"; end with "A reading by Harshit Khemani of public work. ${READING}."`)

  ventriloquist(p, add)
  return out
}

function nameWords(seats) {
  const alt = new Set()
  for (const s of seats) {
    alt.add(esc(s.short))
    if (s.person && s.person !== s.folder) {
      alt.add(esc(s.person))
      for (const w of s.person.split(/[^A-Za-z0-9']+/)) if (w.length >= 3 && !NAME_STOP.has(w.toLowerCase())) alt.add(esc(w))
    }
  }
  alt.add('the council')
  return [...alt].filter(Boolean).sort((a, b) => b.length - a.length)
}

function ventriloquist(p, add) {
  const alt = nameWords(p.seats).filter((x) => x !== 'the council').join('|')
  const who = alt ? `(?:${alt}|he|she|they)` : '(?:he|she|they)'
  const re = [
    new RegExp(`\\b${who}(?:\\s+(?:would|might|will)|'d)\\s+(?:say|tell|argue|advise|recommend|suggest|think|want|agree|disagree|push|pick|choose|do)\\b`, 'i'),
    new RegExp(`\\b${alt ? `(?:${alt})` : '(?:he|she)'}\\s+(?:says|thinks|believes|recommends|advises)\\s+(?:you|we|I)\\s+should\\b`, 'i'),
    /\bthe council\s+(?:recommends|says|thinks|agrees|decided)\b/i,
  ]
  for (const r of p.outside) {
    if (/^Decision:/.test(r.text)) continue // the question is the person's own
    for (const x of re) {
      const m = r.text.match(x)
      if (m) { add('ventriloquist', r.n, `"${m[0]}"; report what the seat's brain published, with its citation, and put the call under the khe-decision label`); break }
    }
  }
}

function checkNotConvened(p, add, councilRow) {
  const faults = []
  if (p.seats.length || p.chair) faults.push('it has a seat or chair block; a reply that does not convene has neither')
  const rec = p.outside.find((r) => /^(?:Recommendation|Verdict)\b/.test(r.text))
  if (rec) add('not-convened-form', rec.n, 'a reply that does not convene gives no recommendation; a synthesis over fewer than two corpora is one brain\'s answer with extra steps')
  if (!p.outside.some((r) => /^Not covered:\s*\S/.test(r.text))) faults.push('no "Not covered:" line')
  if (!p.outside.some((r) => /^Next:\s*\S/.test(r.text))) faults.push('no "Next:" line (ask the one brain that covers it, or say nothing here does)')
  if (!p.outside.some((r) => /^Not verified:\s*\S/.test(r.text))) faults.push('no "Not verified:" line')
  for (const f of faults) add('not-convened-form', councilRow.n, f)
  for (const r of p.outside) {
    if (/^Decision:/.test(r.text)) continue
    if (/\bthe council\s+(?:recommends|says|thinks|agrees|decided)\b/i.test(r.text)) add('ventriloquist', r.n, '"the council" never recommends; there was no council')
  }
}

// ---- Files ------------------------------------------------------------------

const SKIP_DIRS = new Set(['scripts', 'references', 'teaching', 'node_modules', '.git'])
const SKIP_FILES = new Set(['SKILL.md', 'README.md', 'ANSWER.md', 'LICENSE'])
const EXT = ['.txt', '.md']

function collect(paths, notChecked) {
  const files = []
  const walk = (dir) => {
    for (const f of readdirSync(dir).sort()) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(f)) walk(p) }
      else if (!SKIP_FILES.has(f) && EXT.includes(extname(f))) files.push(p)
    }
  }
  for (const raw of paths) {
    const p = resolve(raw)
    if (!existsSync(p)) { notChecked.push(`${show(p)}: no such file or folder`); continue }
    if (statSync(p).isDirectory()) walk(p)
    else if (EXT.includes(extname(p))) files.push(p)
    else notChecked.push(`${show(p)}: not a .txt or .md reply`)
  }
  return files
}

export function checkFile(path, ctx, notChecked = []) {
  const text = norm(readFileSync(path, 'utf8'))
  if (!text.trim()) { notChecked.push(`${show(path)}: empty`); return [] }
  return checkReply(text, show(path), ctx)
}

const never = (fs) => fs.filter((f) => f.class === 'never')
const tally = (fs) => {
  const c = {}
  for (const f of fs) c[f.line] = (c[f.line] || 0) + 1
  return Object.entries(c).map(([k, v]) => `${k} ${v}`).join(', ')
}

// ---- Self-test --------------------------------------------------------------

// Words this collection never prints. They are written in halves so this file
// passes its own check.
const HOUSE = ['dis' + 'tilled', 'taste' + 'ful', 'reason' + 'ably', 'where ' + 'appropriate', 'Agents' + 'ORG', 'design-' + 'engineering', 'son' + 'net', 'op' + 'us', 'hai' + 'ku', 'fa' + 'ble', EM_DASH]

function walkAll(dir) {
  return readdirSync(dir).sort().flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? (f === 'node_modules' || f === '.git' ? [] : walkAll(p)) : [p]
  })
}

// Teaching folders whose bad file may raise a second line besides its own.
const ALSO = {}
const ENV_LINES = new Set(['seat-unchecked', 'brain-unaccounted'])

function selfTest(opts) {
  let failed = 0
  let skipped = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const skip = (what) => { skipped++; console.log(`skip ${what}`) }
  const roots = defaultRoots(opts)
  const brains = discover(roots)
  const ctx = { brains }
  const list = (dir, pred = () => true) => (existsSync(dir) ? readdirSync(dir).filter(pred).sort() : [])

  // Seat discovery.
  const beside = list(resolve(SKILL_DIR, '..'), (f) => f.startsWith(PREFIX) && existsSync(join(SKILL_DIR, '..', f, 'SKILL.md')))
  if (opts.noDefaults) skip('--seats beside the skill: default roots are off')
  else say(beside.every((b) => brains.has(b)), `--seats finds the ${beside.length} brain${beside.length === 1 ? '' : 's'} that sit beside the skill${beside.length ? ` (${beside.join(', ')})` : ''}`)
  const tmpRoot = mkdtempSync(join(tmpdir(), 'khe-decision-seats-'))
  try {
    for (const [name, withGate] of [['khe-brain-zz', false], ['khe-brain-yy', true]]) {
      const d = join(tmpRoot, name)
      mkdirp(join(d, 'scripts'))
      writeFileSync(join(d, 'SKILL.md'), `---\nname: ${name}\ndescription: "Answers the questions of Test Person, with the piece named. A second sentence."\n---\n\n# Brain: Test Person\n`)
      if (withGate) writeFileSync(join(d, 'scripts', 'brain-check.mjs'), '// gate\n')
    }
    mkdirp(join(tmpRoot, 'not-a-brain'))
    mkdirp(join(tmpRoot, 'khe-brain-xx')) // no SKILL.md
    const found = discover([tmpRoot, tmpRoot])
    say([...found.keys()].join(',') === 'khe-brain-yy,khe-brain-zz', `discovery takes folders named ${PREFIX}* with a SKILL.md and skips the rest, once each (${[...found.keys()].join(', ')})`)
    const zz = found.get('khe-brain-zz')
    say(!!zz && zz.person === 'Test Person' && zz.hasGate === false && zz.description === 'Answers the questions of Test Person, with the piece named', 'discovery reads the H1 name, the gate flag and the first sentence of the description')
    say(found.get('khe-brain-yy').hasGate === true, 'discovery notices a brain with scripts/brain-check.mjs')
  } finally {
    rmSync(tmpRoot, { recursive: true, force: true })
  }

  // House rules on every text file in the skill.
  const house = []
  for (const p of walkAll(SKILL_DIR).filter((q) => /\.(md|txt|mjs)$/.test(q))) {
    const text = norm(readFileSync(p, 'utf8'))
    const rel = relative(SKILL_DIR, p).replace(/\\/g, '/')
    for (const w of HOUSE) if (text.toLowerCase().includes(w.toLowerCase())) house.push(`${rel}: "${w === EM_DASH ? 'em dash' : w}"`)
  }
  say(!house.length, `no file in the skill prints a word the collection bans${house.length ? ` (${house.slice(0, 4).join('; ')})` : ''}`)

  // The skill's .md files name only skills that exist.
  const siblings = resolve(SKILL_DIR, '..')
  const peers = list(siblings, (f) => statSync(join(siblings, f)).isDirectory())
  if (peers.length < 2) skip('.md files name only existing skills: there are no skills beside this folder')
  else {
    const bad = []
    for (const p of walkAll(SKILL_DIR).filter((q) => q.endsWith('.md'))) {
      for (const m of norm(readFileSync(p, 'utf8')).matchAll(/\bkhe-[a-z0-9]+(?:-[a-z0-9]+)*/g)) if (!peers.includes(m[0])) bad.push(`${relative(SKILL_DIR, p).replace(/\\/g, '/')}: ${m[0]}`)
    }
    say(!bad.length, `every khe- name in the skill's .md files is a folder in skills/${bad.length ? ` (${[...new Set(bad)].slice(0, 4).join('; ')})` : ''}`)
  }

  // Gold replies, when there are any.
  const exDir = join(SKILL_DIR, 'examples')
  const examples = list(exDir, (f) => /\.(txt|md)$/.test(f))
  if (!examples.length) say(true, 'examples/ is absent or empty: no gold council run to check yet')
  for (const f of examples) {
    const found = checkFile(join(exDir, f), ctx)
    const bad = never(found)
    say(!bad.length, `examples/${f} raises no never-intentional line${bad.length ? ` (got ${tally(bad)})` : ''}`)
    const soft = found.filter((x) => x.class === 'candidate' && !ENV_LINES.has(x.line))
    say(!soft.length, `examples/${f} raises no candidate line${soft.length ? ` (got ${tally(soft)})` : ''}`)
  }

  // Teaching pairs.
  const tdir = join(SKILL_DIR, 'teaching')
  const pairs = list(tdir, (f) => statSync(join(tdir, f)).isDirectory())
  say(pairs.length >= 8, `teaching/ holds ${pairs.length} pairs (eight at least)`)
  for (const name of pairs) {
    const dir = join(tdir, name)
    if (!LINES[name]) { say(false, `teaching/${name} is named for a line the gate prints`); continue }
    const bad = list(dir, (f) => f.startsWith('bad.'))[0]
    const good = list(dir, (f) => f.startsWith('good.'))[0]
    if (!bad || !good) { say(false, `teaching/${name} has a bad and a good file`); continue }
    const first = norm(readFileSync(join(dir, bad), 'utf8')).split('\n')[0]
    say(isComment(first) && first.includes(name), `teaching/${name}/${bad} starts with a comment naming ${name}`)
    const fb = checkFile(join(dir, bad), ctx)
    if (name === 'seat-format' && fb.some((f) => f.line === 'seat-unchecked')) {
      skip(`teaching/${name}: the brain that judges this seat is not installed, so its own gate cannot run (the good file is still checked)`)
    } else {
      const hit = fb.filter((f) => f.class === 'never').map((f) => f.line)
      say(hit.includes(name), `teaching/${name}/${bad} raises ${name}:`)
      const extra = [...new Set(hit)].filter((l) => l !== name && !(ALSO[name] || []).includes(l))
      say(!extra.length, `teaching/${name}/${bad} has one thing wrong${extra.length ? ` (also raises ${extra.join(', ')})` : ''}`)
    }
    const fg = checkFile(join(dir, good), ctx)
    const g = fg.filter((f) => f.class === 'never' || (f.class === 'candidate' && !ENV_LINES.has(f.line)))
    say(!g.length, `teaching/${name}/${good} raises nothing${g.length ? ` (got ${tally(g)})` : ''}`)
  }

  // Lines with no pair are proven on a reply cut from the canonical good one.
  const basePath = join(tdir, 'ventriloquist', 'good.txt')
  if (!existsSync(basePath)) skip('inline cases: teaching/ventriloquist/good.txt is the base text and it is absent')
  else {
    const base = norm(readFileSync(basePath, 'utf8'))
    const dropLine = (t, re) => t.split('\n').filter((l) => !re.test(l)).join('\n')
    const setLine = (t, re, to) => t.split('\n').map((l) => (re.test(l) ? to(l) : l)).join('\n')
    const bare = ctx
    const none = { brains: new Map() }
    const extraBrain = { brains: new Map([...brains, ['khe-brain-zz', { name: 'khe-brain-zz', person: 'Test Person', hasGate: false }]]) }
    const person = (base.match(/^==\s*Seat:\s*\S+\s*\((.+?)\)\s*==/m) || [])[1] || 'Someone'
    const cases = [
      ['no-decision', dropLine(base, /^Decision:/), bare],
      ['no-council-line', dropLine(base, /^Council:/), bare],
      ['no-chair', base.split('== Chair ==')[0], bare],
      ['no-would-change', dropLine(base, /^Would change it:/), bare],
      ['no-not-verified', dropLine(base, /^Not verified:/), bare],
      ['no-reading-line', dropLine(base, /Nobody cited here/), bare],
      ['unlabelled-synthesis', setLine(base, /^Recommendation \(/, (l) => 'Verdict:' + l.slice(l.indexOf('):') + 2)), bare],
      ['ventriloquist', setLine(base, /^Recommendation \(/, (l) => l + ' The council recommends it.'), bare],
      ['ventriloquist', setLine(base, /^Would change it:/, (l) => l + " He'd say otherwise."), bare],
      ['named-without-citation', setLine(base, /^Recommendation \(/, (l) => l + ` ${person} has built companies.`), bare],
      ['chair-citation', setLine(base, /^Rests on:/, (l) => l.replace(/\[([a-z0-9-]+):/, '[nobody:')), bare],
      ['uncited-chair-claim', setLine(base, /^Agree:/, (l) => l.replace(new RegExp(CITE, 'gi'), '')), bare],
      ['hedge', setLine(base, /^Not covered:/, (l) => l + ' It is maybe covered elsewhere.'), bare],
      ['seat-unchecked', base, none],
      ['brain-unaccounted', base, extraBrain],
    ]
    for (const [line, text, c] of cases) {
      const got = checkReply(text, 'inline', c).map((f) => f.line)
      say(got.includes(line), `an inline case raises ${line}:`)
    }
    // A "My reading:" line is the reader's own words, skipped like "Yours:"; an unlabelled uncited sentence is not.
    const seatHead = base.split('\n').findIndex((l) => /^==\s*Seat:/.test(l))
    const withLine = (line) => { const rows = base.split('\n'); rows.splice(seatHead + 1, 0, line); return rows.join('\n') }
    const uncitedOf = (t) => checkReply(t, 'inline', bare).filter((f) => f.line === 'seat-uncited')
    if (seatHead < 0) skip('My reading: cases: the base text has no seat block')
    else {
      say(!uncitedOf(withLine('My reading: the order matters more than the polish, so the first test comes first.')).length, 'a My reading: line with no citation marker raises no seat-uncited')
      say(uncitedOf(withLine('The order matters more than the polish, so the first test comes first.')).length === 1, 'an unlabelled uncited sentence in a seat block still raises seat-uncited')
    }
    const nc = 'Decision: Should we use a thing?\nCouncil: not convened. 3 installed brains; none covers it.\nNot covered: the thing.\nNext: nothing in this collection answers it.\nNot verified: the brains were read by name only.'
    say(!never(checkReply(nc, 'inline', bare)).length, 'a plain not-convened reply raises nothing')
    say(checkReply(nc.replace(/^Next:.*$/m, ''), 'inline', bare).some((f) => f.line === 'not-convened-form'), 'an inline case raises not-convened-form: (no Next:)')
    say(checkReply(nc + '\n== Chair ==\n', 'inline', bare).some((f) => f.line === 'not-convened-form'), 'an inline case raises not-convened-form: (a chair block)')
    const covered = new Set([...pairs, ...cases.map(([l]) => l)])
    for (const l of Object.keys(LINES)) say(covered.has(l), `${l}: is proven by a pair or an inline case`)
  }

  console.log('')
  if (failed) { console.log(`${GATE_NAME} self-test failed: ${failed}`); return 1 }
  console.log(skipped ? `${GATE_NAME} self-test passed (${skipped} skipped)` : `${GATE_NAME} self-test passed`)
  return 0
}

// ---- Main -------------------------------------------------------------------

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')))
  if (flags.has('--help') || flags.has('-h')) { console.log(HELP); return 0 }

  let reportPath = null
  const extra = []
  const paths = []
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--report') reportPath = argv[++i]
    else if (argv[i] === '--brains') { if (argv[i + 1]) extra.push(argv[++i]) }
    else if (!argv[i].startsWith('--')) paths.push(argv[i])
  }
  const opts = { extra, noDefaults: flags.has('--no-default-roots') }
  if (flags.has('--self-test')) return selfTest(opts)

  const roots = defaultRoots(opts)
  const brains = discover(roots)
  if (flags.has('--seats')) { printSeats(brains, roots, flags.has('--json')); return brains.size ? 0 : 2 }

  const gate = flags.has('--gate')
  const strict = flags.has('--strict')
  const notChecked = []
  const findings = []
  if (!paths.length) notChecked.push('no input: pass a saved council reply (.txt or .md) or a folder of them')
  const files = collect(paths, notChecked)
  if (paths.length && !files.length) notChecked.push('no .txt or .md reply found in the input')
  for (const f of files) findings.push(...checkFile(f, { brains }, notChecked))

  for (const f of findings) {
    console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
    for (const c of f.children || []) console.log(`    ${c}`)
  }
  const hard = never(findings)
  const soft = findings.filter((f) => f.class === 'candidate')
  if (findings.length) console.log('')
  console.log(`checked ${files.length} repl${files.length === 1 ? 'y' : 'ies'} with ${brains.size} installed brain${brains.size === 1 ? '' : 's'} to judge the seats`)
  console.log(`never intentional: ${hard.length}${hard.length ? ` (${tally(hard)})` : ''}`)
  console.log(`candidates: ${soft.length}${soft.length ? ` (${tally(soft)})` : ''}`)
  for (const n of notChecked) console.log(`not checked: ${n}`)
  console.log('passing is necessary, not sufficient')

  const failing = hard.length + (strict ? soft.length : 0)
  const status = failing ? 'failed' : notChecked.length ? 'inconclusive' : 'passed'
  const exitCode = status === 'inconclusive' ? 2 : status === 'failed' && (gate || strict) ? 1 : 0
  if (reportPath) writeFileSync(reportPath, JSON.stringify({ status, exitCode, files: files.map(show), findings, notChecked }, null, 2) + '\n')
  if (status === 'passed') console.log(`${GATE_NAME} passed`)
  else if (status === 'inconclusive') console.log(`${GATE_NAME} inconclusive: ${notChecked.length} thing${notChecked.length === 1 ? '' : 's'} not checked`)
  else console.log(`${GATE_NAME} failed: ${failing} fault${failing === 1 ? '' : 's'}`)
  return exitCode
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv.slice(2))
}
