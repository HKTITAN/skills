#!/usr/bin/env node
// decision-check: the gate for khe-decision.
//
// It reads a saved council reply (a .txt or .md file) and names every fault it
// can prove as a line. A reply is a Decision: line, a Council: line, two or
// more "== Seat: <brain> (<name>) ==" blocks, each one a brain's own reply in
// its own format, and a "== Chair ==" block. Each seat block is judged by that
// brain's own scripts/brain-check.mjs, so a brain added later brings its own
// format. The chair block is judged here: every chair citation must be one of
// the citations the seat it names carries, whole and never as a piece of one,
// every chair line must start with a known label, and the recommendation must
// carry khe-decision's label and name nobody.
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
  'no-council-line': ['never', 'No Council: line, or it does not name every seat block as seated, or "N of M" has N above M or N different from the number of distinct seat blocks'],
  'duplicate-seat': ['never', 'The same brain seated twice; a brain is one seat however many blocks carry its name'],
  'seat-name': ['never', "A seat header whose name in parentheses is not the installed brain's heading name (checked only when that brain is installed)"],
  'too-few-seats': ['never', 'Fewer than two seat blocks, and the reply does not use the not-convened form'],
  'seat-format': ['never', "A seat block that fails its own brain's scripts/brain-check.mjs --gate"],
  'seat-uncited': ['never', 'A seat block with no Source: line, or with a line that carries no citation matching one of its Source: lines (Source:, Not in, Nearest:, Yours: and My reading: lines excepted)'],
  'no-chair': ['never', 'No == Chair == block'],
  'unlabelled-synthesis': ['never', `No line starting exactly "${LABEL}", or a Recommendation:/Verdict: line without it`],
  'no-rests-on': ['never', 'No Rests on: line with a chair citation, and the recommendation is not withheld'],
  'chair-citation': ['never', 'A chair citation [seat: text] naming a seat that is not in the reply, or whose whole text is not one of the citations that seat carries: an item inside its parentheses, a [n] marker\'s title, or a Source: title'],
  'nearest-citation': ['never', 'A chair citation that the seat carries only on Nearest:, My reading: or Yours: lines, which are never a seat\'s position'],
  'recommendation-names': ['never', 'A Recommendation line that names a seated or left-out person or institution or a person a seat block quotes, or that carries a [seat: citation]; a citation never excuses a name there, and its citations live on Rests on:'],
  'unknown-chair-label': ['never', 'A line in the chair block that starts with none of Agree:, Disagree:, Not covered:, the Recommendation label, Rests on:, Would change it:, Not verified: or the reading line'],
  'uncited-chair-claim': ['never', 'An Agree: or Disagree: line without citations from two different seats, or a Disagree: line with no Why:'],
  'ventriloquist': ['never', 'A position in a real person\'s mouth outside the seat blocks. In a sentence that names a seated person or institution, a brain on the Council: line, a person a seat block quotes or "the council": would, wouldn\'t, might, could, couldn\'t, will, won\'t or \'d (allowed only in the reporting form with its chair citation, and not judged on Not verified:); "you should" or "we should" (never allowed, cited or not); "wants you", "tell you", "\'s answer", "both back", "signs off", "has no patience". In a later sentence of the same line: he or she directly before one of those modals. After any capitalised name: "would say", "would tell", "would pick" and the like, "wants you", "\'s answer". And "the council recommends"'],
  'named-without-citation': ['never', 'A sentence on any chair line but Rests on: and Not verified: that names a seated person or institution, or a person a seat block quotes, and carries no chair citation; a Why: clause may name a seat or person that its own Disagree: line cites before the Why:. A sentence on Agree:, Disagree: or Would change it: that names a left-out person or institution fails, cited or not, because a brain left out on the Council: line has no seat block to cite'],
  'no-would-change': ['never', 'No Would change it: line'],
  'no-not-verified': ['never', 'No Not verified: line'],
  'no-reading-line': ['never', `The last line does not say "${READING}"`],
  'not-convened-form': ['never', 'A "Council: not convened" reply that is not exactly Decision:, Council: not convened, Not covered:, Next: and Not verified:, once each, or that says Recommendation, Synthesis, Verdict or "My call" anywhere'],
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
  A folder is walked. SKILL.md, README.md, LICENSE, COUNCIL.md (this skill's handover note), ANSWER.md (a brain's),
  references/, scripts/ and teaching/ are skipped.
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
  --report f    write { status, exitCode, files, seats, findings, notChecked } as JSON
  --seats       list every installed brain: folder, name, path, whether it has a gate, what it answers
  --json        with --seats, print the same list as JSON
  --self-test   prove the gate on teaching/ and examples/, and check seat discovery
  --help        this text

Every finding prints as  <line-name>: <what and where> (<file>:<line>)
A seat-format finding is followed by the brain gate's own fault lines, indented.
The summary says "seats judged by their own brain's gate: <n> of <m>". A seat whose brain is not installed
here got only the generic check; it is the candidate seat-unchecked, and --strict fails on it.

Never intentional (the gate fails on any):
${Object.entries(LINES).filter(([, v]) => v[0] === 'never').map(([k, v]) => `  ${(k + ':').padEnd(24)} ${v[1]}`).join('\n')}

Candidates (reported for judgment):
${Object.entries(LINES).filter(([, v]) => v[0] === 'candidate').map(([k, v]) => `  ${(k + ':').padEnd(24)} ${v[1]}`).join('\n')}

Not checked by this gate:
  - whether a seat's cited line says what the seat claims; the brain's own gate matches titles, never meaning
  - whether the chair restates a seat's line faithfully; it checks that the citation is one that seat carries
  - whether a chair line borrows the words of a My reading: or Nearest: line and hangs a real citation on them
  - whether a Disagree: line quietly picks a side
  - whether the right brains were seated, beyond naming every installed brain on the Council: line
  - whether two seats that disagree were each cited truthfully
  - whether the recommendation follows from what the seats said
  - whether seats ran apart from each other; that is stated on the Not verified: line
  - what a Not verified: line says about a name, beyond the saying patterns; it is the run's log and may name a seat or a brain
  - a name a seat block mentions and never quotes; a person counts when a seat header names them, or when a seat sentence
    follows the name with a saying verb or a piece ("Kat Manalac said", "Paul Graham's 2013 essay")

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
const FOLDER = new RegExp('\\b' + PREFIX + '[a-z0-9-]+', 'gi')
const stripLabel = (t) => (t.startsWith(LABEL) ? t.slice(LABEL.length) : t.replace(/^[A-Za-z ]+:\s*/, ''))

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
    if (ANY_HEADER.test(t)) {
      if (mode === 'chair') { outside.push(r); chair.lines.push(r); continue } // judged as a chair line with no known label
      mode = 'other'; cur = null; continue
    }
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
const SOURCE_LINE = /^(?:[-*]\s+)?Source:/
const NOT_IN_LINE = /^(?:[-*]\s+)?Not in\b[^:\n]*:/
const SOFT_LINE = /^(?:[-*]\s+)?(?:Nearest|Yours|My reading):/
const body = (rows) => rows.filter((r) => r.text.trim() && !isComment(r.text))

// What a seat block cites. A citation is a Source: title, an item inside
// parentheses that starts with one of those titles ("Kata 12 at 5:44" under
// "Source: Kata 12, ..."), or a [n] marker that a "Source: [n] Title, URL" line
// resolves. Text on a "Not in ...:" line is never a citation. Each use is
// remembered as soft (a Nearest:, My reading: or Yours: line) or hard.
function citeModel(seat) {
  const rows = body(seat.lines)
  const titles = []
  const byN = new Map()
  for (const r of rows) {
    const m = r.text.trim().match(/^(?:[-*]\s+)?Source:\s*(?:\[(\d+)\]\s*)?(.*?)\s*$/)
    if (!m) continue
    const title = flat(m[2].replace(/,\s*(?:https?:\/\/|www\.)\S.*$/, ''))
    if (!title) continue
    titles.push(title)
    if (m[1]) byN.set(m[1], title)
  }
  titles.sort((a, b) => b.length - a.length)
  const titleOf = (item) => titles.find((t) => item === t || (item.startsWith(t) && !/[a-z0-9]/.test(item[t.length]))) || null
  const items = new Set(titles)
  const uses = new Map() // title -> ['hard' | 'soft', ...]
  const cited = new Set() // line numbers that carry a citation of this seat
  for (const r of rows) {
    const t = r.text.trim()
    if (SOURCE_LINE.test(t)) continue
    const notIn = NOT_IN_LINE.test(t)
    const kind = SOFT_LINE.test(t) ? 'soft' : 'hard'
    const use = (title) => { cited.add(r.n); if (!notIn) uses.set(title, [...(uses.get(title) || []), kind]) }
    for (const g of t.matchAll(/\(([^()]+)\)/g)) {
      for (const part of g[1].split(';')) {
        const item = flat(part)
        const title = titleOf(item)
        if (!title) continue
        if (!notIn) items.add(item)
        use(title)
      }
    }
    for (const g of t.matchAll(/\[(\d+)\]/g)) if (byN.has(g[1])) use(byN.get(g[1]))
  }
  return { titles, items, uses, titleOf, cited }
}

// People a seat block quotes: two or more capitalised words in a row, outside
// its citations and its Source: titles, directly followed by a saying verb
// ("Kat Manalac said") or by 's and a piece ("Paul Graham's 2013 essay"). "Paul
// Graham" inside the YC seat is a person the chair can put words in the mouth
// of, though no seat header carries the name. A capitalised run with no saying
// verb after it ("United States", "Startup School") is a place or a thing, and
// Source: and "Not in ...:" lines are never read for names.
const LEAD_WORDS = new Set(['The', 'A', 'An', 'In', 'On', 'At', 'By', 'For', 'From', 'With', 'And', 'But', 'If', 'When', 'While', 'Since', 'After', 'Before', 'He', 'She', 'They', 'It', 'His', 'Her', 'Their', 'This', 'That', 'These', 'Those', 'Not', 'No', 'Source', 'Nearest', 'Yours', 'My', 'Also', 'Breaks', 'Holds', 'Matches', 'Open', 'Conflict', 'Disagrees', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
const CAP_RUN = /(?<![\w'-])[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+(?!\w|'(?!s\b))/g
const SAYS_AFTER = /^(?:,[^.;:]{0,80}?,)?\s+(?:(?:also|once|then|later|often|still|again|first)\s+)?(?:says?|said|saying|wrote|writes?|written|writing|calls?|called|calling|answers?|answered|answering|describes?|described|describing|rates?|rated|rating|gives?|gave|given|giving|lists?|listed|listing|argues?|argued|arguing|reports?|reported|reporting|states?|stated|stating|tells?|told|telling|explains?|explained|explaining|recommends?|recommended|advises?|advised|warns?|warned|thinks?|believes?|defines?|defined|suggests?|suggested)\b/
const PIECE_AFTER = /^'s(?:\s+[\w-]+){0,3}?\s+(?:essays?|talks?|posts?|videos?|material|lines?|pieces?|articles?|writing|books?|interviews?|podcasts?|lectures?|sessions?|class(?:es)?|threads?|newsletters?)\b/

// name -> the short names of the seats whose blocks quote that person.
function blockPeople(seats) {
  const found = new Map()
  const titles = seats.flatMap((s) => s.cites.titles)
  for (const s of seats) {
    for (const r of body(s.lines)) {
      const line = r.text.trim()
      if (SOURCE_LINE.test(line) || NOT_IN_LINE.test(line)) continue
      const text = r.text.replace(/\([^()]*\)/g, ' ')
      for (const m of text.matchAll(CAP_RUN)) {
        const words = m[0].split(/\s+/)
        while (words.length && LEAD_WORDS.has(words[0])) words.shift()
        if (words.length < 2 || words.some((w) => LEAD_WORDS.has(w))) continue
        const name = words.join(' ')
        if (titles.some((t) => t.includes(flat(name)))) continue
        const after = text.slice(m.index + m[0].length)
        if (!SAYS_AFTER.test(after) && !PIECE_AFTER.test(after)) continue
        found.set(name, (found.get(name) || new Set()).add(s.short))
      }
    }
  }
  return found
}

// The names a reply can put words under: for each entry its short name, its
// full name, and every word of the name of three letters or more; then the
// people the seat blocks quote, and "the council".
function nameWords(list, people = []) {
  const alt = new Set()
  for (const s of list) {
    if (s.short) alt.add(esc(s.short))
    if (s.person && s.person !== s.folder) {
      alt.add(esc(s.person))
      for (const w of s.person.split(/[^A-Za-z0-9']+/)) if (w.length >= 3 && !NAME_STOP.has(w.toLowerCase())) alt.add(esc(w))
    }
  }
  for (const name of people) alt.add(esc(name))
  alt.add('the council')
  return [...alt].filter(Boolean).sort((a, b) => b.length - a.length)
}

// Who a reply can speak for: its seats, and every brain its Council: and Next:
// lines name. A name comes from the seat header, and from the brain's own
// heading when that brain is installed. A brain that is installed and that the
// reply never names is not on the list, so a reply is judged by the names it
// carries and never by what else happens to be installed.
function roster(rows, seats, brains) {
  const list = []
  for (const s of seats) {
    list.push(s)
    const b = brains.get(s.folder)
    if (b && flat(b.person) !== flat(s.person)) list.push({ short: s.short, person: b.person, folder: s.folder })
  }
  for (const r of rows) {
    for (const f of r.text.match(FOLDER) || []) {
      const folder = f.toLowerCase()
      if (list.some((x) => x.folder === folder)) continue
      const b = brains.get(folder)
      list.push({ short: folder.slice(PREFIX.length), person: b ? b.person : folder, folder })
    }
  }
  return list
}

// The brains a Council: line leaves out, as regex alternatives for the names a
// reply may not give a view to. A left-out brain has no seat block, so nothing
// can be cited for it. Its person or institution comes from discovery when the
// brain is installed; its short name counts only in the forms "{short} brain",
// "{short} seat", "the {short}'s" and its folder, because a short name can be an
// ordinary word.
function leftOutAlt(councilRow, seatedFolders, brains) {
  const lo = councilRow ? councilRow.text.match(/Left out:\s*(.*)$/i) : null
  const alt = new Set()
  for (const f of new Set(((lo ? lo[1] : '').match(/khe-brain-[a-z0-9-]+/g) || []).map((x) => x.toLowerCase()))) {
    if (seatedFolders.has(f)) continue
    const short = f.slice(PREFIX.length)
    alt.add(esc(f))
    alt.add(`${esc(short)}\\s+(?:brain|seat)`)
    alt.add(`the\\s+${esc(short)}'s`)
    const b = brains.get(f)
    if (b && b.person && b.person !== f) {
      alt.add(esc(b.person))
      for (const w of b.person.split(/[^A-Za-z0-9']+/)) if (w.length >= 3 && !NAME_STOP.has(w.toLowerCase())) alt.add(esc(w))
    }
  }
  return [...alt].sort((a, b) => b.length - a.length)
}

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
    checkNotConvened(p, add, councilRow, brains)
    return out
  }

  // One brain is one seat, however many blocks carry its name.
  const distinct = []
  for (const s of p.seats) {
    s.cites = citeModel(s)
    const firstBlock = distinct.find((d) => d.folder === s.folder)
    if (firstBlock) add('duplicate-seat', s.headerLine, `${s.folder} is seated twice (its first block starts at line ${firstBlock.headerLine}); a brain is one seat, and a second block adds no voice`)
    else distinct.push(s)
  }

  // The Council: line.
  const names = distinct.map((s) => s.folder)
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
    const count = t.match(/^Council:\s*(\d+)\s+of\s+(\d+)/i)
    if (count && Number(count[1]) !== distinct.length) add('no-council-line', councilRow.n, `the line says ${count[1]} seated and the reply has ${distinct.length} distinct seat block${distinct.length === 1 ? '' : 's'}`)
    if (count && Number(count[1]) > Number(count[2])) add('no-council-line', councilRow.n, `"${count[1]} of ${count[2]}": more brains seated than installed`)
    for (const b of brains.keys()) if (!seated.has(b) && !left.has(b)) add('brain-unaccounted', councilRow.n, `${b} is installed and the Council: line names it neither as seated nor as left out`)
  }

  if (distinct.length < 2) add('too-few-seats', p.seats[0] ? p.seats[0].headerLine : first.n, `${distinct.length} distinct seat block${distinct.length === 1 ? '' : 's'}; agreement and disagreement need two voices. With fewer, do not convene: use the not-convened form, or hand the question to the one brain that covers it`)

  // Each seat block.
  for (const seat of p.seats) {
    const rows = body(seat.lines)
    const hasSource = seat.cites.titles.length > 0
    if (!rows.some((r) => /^Source:/.test(r.text))) add('seat-uncited', seat.headerLine, `seat ${seat.short} has no Source: line; a seat cites its brain or says its brain is silent, and never answers from general knowledge`)
    for (const r of rows) {
      const t = r.text.trim()
      if (SOURCE_LIKE.test(t)) continue
      // With Source: lines to check against, a marker counts only when it matches one of them.
      if (hasSource ? seat.cites.cited.has(r.n) : hasMarker(r.text)) continue
      if (SILENCE.test(r.text)) continue
      add('seat-uncited', r.n, `seat ${seat.short}: "${t.slice(0, 60)}${t.length > 60 ? ' ...' : ''}" carries no citation${hasMarker(r.text) ? ' that matches one of its Source: lines' : ' marker'}`)
    }
    const brain = brains.get(seat.folder)
    if (brain && flat(seat.person) !== flat(brain.person)) add('seat-name', seat.headerLine, `the header names seat ${seat.short} "${seat.person === seat.folder ? 'nothing in parentheses' : seat.person}" and the installed brain's heading is "${brain.person}"; write == Seat: ${seat.folder} (${brain.person}) ==`)
    if (ctx.stats) ctx.stats.seats++
    if (!brain || !brain.hasGate) {
      add('seat-unchecked', seat.headerLine, `${seat.folder} ${brain ? 'has no scripts/brain-check.mjs' : 'is not installed'}, so seat ${seat.short} got only the generic check`)
    } else {
      if (ctx.stats) ctx.stats.judged++
      const r = runBrainGate(brain, seat, file)
      if (!r.ok) add('seat-format', seat.headerLine, `seat ${seat.short} fails ${seat.folder}'s own gate (exit ${r.status}); its format is that brain's, not this skill's`, r.lines)
    }
  }

  // The chair.
  if (!p.chair) { add('no-chair', p.rows[p.rows.length - 1].n, 'no "== Chair ==" block; the agreement, the disagreement, what is not covered and the labelled recommendation live there') }
  const bySeat = new Map(distinct.map((s) => [s.short, s]))
  const seatAlt = nameWords(distinct)
  const quoted = blockPeople(distinct)
  const people = [...quoted.keys()]
  if (p.chair) {
    const lines = p.chair.lines
    const isRec = (r) => /^(?:Recommendation|Verdict)\b/.test(r.text)
    const isReading = (r) => r.text.includes(READING) && !/^[A-Za-z][A-Za-z ]{0,30}:/.test(r.text)
    const KNOWN = /^(?:Agree|Disagree|Not covered|Rests on|Would change it|Not verified):/

    // Every chair line starts with a label this skill defines.
    for (const r of lines) {
      if (KNOWN.test(r.text) || isRec(r) || isReading(r)) continue
      add('unknown-chair-label', r.n, `"${r.text.trim().slice(0, 50)}${r.text.trim().length > 50 ? ' ...' : ''}" starts with no chair label; the chair block holds Agree:, Disagree:, Not covered:, the labelled Recommendation, Rests on:, Would change it:, Not verified: and the reading line, and nothing else`)
    }

    // Citations are checked on every chair line: the whole text, against what that seat cites.
    for (const r of lines) {
      for (const c of citesOf(r.text)) {
        const seat = bySeat.get(c.seat)
        if (!seat) { add('chair-citation', r.n, `[${c.seat}: ${c.text}] names a seat that is not in this reply (seats: ${[...bySeat.keys()].join(', ') || 'none'})`); continue }
        const item = flat(c.text)
        if (!seat.cites.items.has(item)) { add('chair-citation', r.n, `"${c.text}" is not a citation seat ${c.seat} carries; copy the whole citation from inside its parentheses, or a Source: title, character for character`); continue }
        const uses = seat.cites.uses.get(seat.cites.titleOf(item)) || []
        if (uses.length && uses.every((k) => k === 'soft')) add('nearest-citation', r.n, `[${c.seat}: ${c.text}] is carried in seat ${c.seat} only on Nearest:, My reading: or Yours: lines; the brain labels those as not answering the question or as someone else's words, so the chair builds nothing on them`)
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
    const recs = lines.filter(isRec)
    const good = recs.find((r) => r.text.startsWith(LABEL))
    for (const r of recs) if (!r.text.startsWith(LABEL)) add('unlabelled-synthesis', r.n, `"${r.text.slice(0, 40)}" is not labelled; start the line "${LABEL}"`)
    if (!recs.length) add('unlabelled-synthesis', p.chair.headerLine, `no Recommendation line; write "${LABEL} <the call>" or "... withheld <reason>"`)
    const withheld = !!good && /^withheld\b/i.test(good.text.slice(LABEL.length).trim())
    if (!withheld && !lines.some((r) => /^Rests on:/.test(r.text) && citesOf(r.text).length)) add('no-rests-on', p.chair.headerLine, 'no "Rests on:" line with a chair citation; a recommendation names the cited lines it stands on')

    if (!lines.some((r) => /^Would change it:\s*\S/.test(r.text))) add('no-would-change', p.chair.headerLine, 'no "Would change it:" line; name the fact that would flip the call')
    if (!lines.some((r) => /^Not verified:\s*\S/.test(r.text))) add('no-not-verified', p.chair.headerLine, 'no "Not verified:" line; say what was not checked')

    const nameRe = new RegExp(`\\b(?:${seatAlt.join('|')})\\b`, 'i')
    const peopleRe = people.length ? new RegExp(`(?<![\\w-])(?:${people.map(esc).join('|')})(?!\\w)`) : null
    const cite = new RegExp(CITE, 'gi')

    // The recommendation names nobody and carries no citation.
    const leftAlt = leftOutAlt(councilRow, new Set(distinct.map((s) => s.folder)), brains)
    const leftRe = leftAlt.length ? new RegExp(`\\b(?:${leftAlt.join('|')})\\b`, 'i') : null
    const recName = new RegExp(`\\b(?:${[...seatAlt.filter((x) => x !== 'the council'), ...leftAlt].join('|') || '(?!)'})\\b`, 'i')
    for (const r of recs) {
      const text = stripLabel(r.text)
      const bare = text.replace(cite, ' ')
      const why = []
      const n = bare.match(recName) || (peopleRe && bare.match(peopleRe))
      if (n) why.push(`names "${n[0]}"`)
      if (citesOf(text).length) why.push(`carries ${citesOf(text).length === 1 ? 'a chair citation' : 'chair citations'}`)
      if (why.length) add('recommendation-names', r.n, `the Recommendation line ${why.join(' and ')}; it is this skill's own call, so it names no person and no institution, and its citations live on Rests on:`)
    }

    // Names the chair uses without a citation, on every line but Rests on: and
    // Not verified:. Not verified: is the run's log, and it may say which seat's
    // gate was not run or which brain's pieces were not opened again.
    const seatOf = new Map() // a name, lower case -> the short names of the seats it belongs to
    const own = (k, short) => seatOf.set(k.toLowerCase(), (seatOf.get(k.toLowerCase()) || new Set()).add(short))
    for (const s of distinct) {
      own(s.short, s.short)
      if (s.person !== s.folder) { own(s.person, s.short); for (const w of s.person.split(/[^A-Za-z0-9']+/)) own(w, s.short) }
    }
    for (const [name, shorts] of quoted) for (const short of shorts) own(name, short)
    const anyName = new RegExp(`\\b(?:${seatAlt.join('|')})\\b${people.length ? `|(?<![\\w-])(?:${people.map(esc).join('|')})(?!\\w)` : ''}`, 'gi')
    for (const r of lines) {
      if (/^(?:Rests on|Not verified):/.test(r.text)) continue
      const wasCovered = /^(?:Agree|Disagree|Recommendation)\b/.test(r.text)
      const noLeftOut = /^(?:Agree|Disagree|Would change it):/.test(r.text)
      const text = isReading(r) ? r.text.replace(/A reading by [^.]*\./, ' ').replace(READING, ' ') : stripLabel(r.text)
      // A Why: clause stands on the citations its own Disagree: line carries before it.
      const whyAt = /^Disagree:/.test(r.text) ? r.text.search(/\bWhy:/) : -1
      const sides = new Set(whyAt < 0 ? [] : citesOf(r.text.slice(0, whyAt)).map((c) => c.seat))
      let inWhy = false
      for (const s of sentences(text.trim())) {
        if (whyAt >= 0 && /\bWhy:/.test(s)) inWhy = true
        const bare = s.replace(cite, ' ')
        const probe = wasCovered ? bare : bare.replace(FOLDER, ' ') // a folder name on a closing line is the run's roster, never a person
        const gone = noLeftOut && leftRe && probe.match(leftRe)
        if (gone) { add('named-without-citation', r.n, `"${s.slice(0, 70)}${s.length > 70 ? ' ...' : ''}" names "${gone[0]}", a brain the Council: line leaves out; a brain left out on the Council: line has no seat block, so nothing can be cited for it; seat it or drop the sentence`); continue }
        if (!(nameRe.test(probe) || (peopleRe && peopleRe.test(probe))) || citesOf(s).length) continue
        if (inWhy && [...probe.matchAll(anyName)].every((m) => [...(seatOf.get(m[0].toLowerCase()) || [])].some((short) => sides.has(short)))) continue
        add('named-without-citation', r.n, `"${s.slice(0, 70)}${s.length > 70 ? ' ...' : ''}" names a seated person or institution, or a person a seat block quotes, and carries no [seat: citation]${inWhy ? '; a Why: clause may name only a seat or person its own Disagree: line cites before it' : ''}`)
      }
    }

    for (const r of lines) {
      const stripped = r.text.replace(cite, ' ')
      const m = stripped.match(/\b(maybe|perhaps|probably|arguably)\b/i)
      if (m) add('hedge', r.n, `"${m[1].toLowerCase()}"; the seats cite a line or they do not, so the chair states it or says it is not covered`)
    }
  }

  // The last line.
  const lastRow = [...p.rows].reverse().find((r) => r.text.trim() && !isComment(r.text))
  if (!lastRow || !lastRow.text.includes(READING)) add('no-reading-line', lastRow ? lastRow.n : first.n, `the last line does not say "${READING}"; end with "A reading by Harshit Khemani of public work. ${READING}."`)

  ventriloquist(p.outside, nameWords(roster(councilRow ? [councilRow] : [], distinct, brains), people), add)
  return out
}

// ---- Words in a person's mouth ---------------------------------------------

const MODAL = "(?:would|wouldn't|might|could|couldn't|will|won't)"
const SHOULD = '(?:you|we) should'
const YOU = '(?:wants? you|tell(?:s|ing)? you|advises? you|expects? you)'
const STANCE = '(?:has no patience|answer would be|backs? (?:shipping|launching|this)|both back|signs? off)'
const ANY_NAME = "(?<![\\w'-])[A-Z][A-Za-z]*(?:\\s+[A-Z][A-Za-z]+)+"
// The saying patterns: what may never follow a capitalised name, seated or not.
// They are narrow on purpose. "A Figma case would flip the call" and "the Mac
// Spotlight launcher would be a fair comparison" hold a capitalised run and a
// modal and put words in nobody's mouth, so a bare modal is judged only beside
// a name the reply can speak for.
const SAID = '(?:say|said|tell|told|argue|argued|advise|advised|recommend|recommended|suggest|suggested|think|thought|agree|agreed|disagree|disagreed|pick|picked|choose|chosen|prefer|preferred|urge|urged|insist|insisted|answer|answered|back|backed)'
const SAYING = new RegExp(`${ANY_NAME}(?:(?:\\s+${MODAL}|'d)(?:\\s+(?:never|not|also|well|probably|still|then|have))?\\s+${SAID}\\b|\\s+(?:wants? you|(?:to\\s+|is\\s+|are\\s+)?tell(?:s|ing)? you|advises? you|expects? you|has no patience)\\b|'s\\s+(?:answer|advice|take|verdict)\\b|\\s+(?:says|thinks|believes|recommends|advises)\\s+(?:that\\s+)?(?:you|we)\\s+should\\b)`)

// The first thing in a line that puts a position in someone's mouth, as
// { hit, kind }, or null. alt is the name list as a regex alternation: the
// seats, the brains the Council: line names, the people the seat blocks quote
// and "the council". A sentence that names one of them may hold would, might,
// could or will only in the reporting form, "what {name} has published
// suggests ..." or "{name}'s material says ...", with a chair citation in the
// same sentence. It may never hold "you should": the reporting form says what
// the material says, and what the reader should do is the recommendation's.
// log is true on a Not verified: line, the run's log, where a name beside
// "could not be run" is a fact about the run: the bare modal is not judged
// there, and the saying patterns still are.
function puppet(text, alt, log = false) {
  const masked = stripLabel(text).replace(new RegExp(CITE, 'gi'), ' [#] ')
  const name = new RegExp(`\\b(?:${alt})\\b`, 'i')
  const reporting = new RegExp(`\\b(?:${alt})\\s+(?:has|have)\\s+published\\b|\\b(?:${alt})(?:'s)?\\s+(?:published\\s+)?(?:material|writing|videos|posts|notes|essays|pieces|work)\\b`, 'i')
  const modal = new RegExp(`\\b${MODAL}\\s+[a-z']+|\\b(?:${alt}|he|she|they)'d\\b`, 'i')
  const carried = new RegExp(`\\b(?:he|she)(?:\\s+${MODAL}\\s+[a-z']+|'d\\b)`, 'i')
  const should = new RegExp(`\\b${SHOULD}\\b`, 'i')
  const stance = new RegExp(`\\b${YOU}\\b|\\b${STANCE}\\b|\\b(?:${alt})'s\\s+(?:answer|advice|take|verdict)\\b|\\b(?:his|her|their)\\s+(?:answer|advice|verdict)\\b`, 'i')
  const youRe = new RegExp(`\\b(?:${YOU}|${SHOULD})\\b`, 'i')
  let named = false
  for (const s of sentences(masked.trim())) {
    const hasCite = s.includes('[#]')
    const t = s.replace(/\[#\]/g, ' ')
    const plain = t.replace(FOLDER, ' ')
    const n = plain.match(name)
    let m
    if (!log && n && (m = plain.match(modal)) && !(hasCite && reporting.test(plain))) return { hit: `${n[0]} ... ${m[0]}`, kind: 'guess' }
    // A pronoun carries a name forward only when it sits directly before the modal: "He would wait".
    // "Founders who wait find out late what they could have learned" holds a pronoun and a modal, and it is about founders.
    if (!log && !n && named && (m = plain.match(carried))) return { hit: m[0], kind: 'guess' }
    if (n && (m = plain.match(should))) return { hit: `${n[0]} ... ${m[0]}`, kind: 'advice' }
    if (n && (m = plain.match(stance))) return { hit: `${n[0]} ... ${m[0]}`, kind: 'guess' }
    if (t.search(FOLDER) >= 0 && (m = t.match(youRe))) return { hit: `a brain ... ${m[0]}`, kind: 'guess' }
    if ((m = plain.match(SAYING))) return { hit: m[0].slice(0, 60), kind: 'guess' }
    if (n) named = true
  }
  return null
}

const VENT_FIX = {
  guess: 'report what the seat\'s brain published ("what {name} has published suggests ...", with its [seat: citation] in the same sentence), and put the call under the khe-decision label',
  advice: 'a sentence that names someone and tells the reader "you should" puts advice in that person\'s mouth, with a citation or without one. The reporting form says what the material says, never what the reader should do; the "should" lives on the Recommendation line, which names no one',
}

function ventriloquist(rows, alt, add) {
  const names = alt.filter((x) => x !== 'the council').join('|')
  const who = names ? `(?:${names}|he|she|they)` : '(?:he|she|they)'
  const re = [
    new RegExp(`\\b${who}(?:\\s+(?:would|might|will)|'d)\\s+(?:say|tell|argue|advise|recommend|suggest|think|want|agree|disagree|push|pick|choose|do)\\b`, 'i'),
    new RegExp(`\\b${names ? `(?:${names})` : '(?:he|she)'}\\s+(?:says|thinks|believes|recommends|advises)\\s+(?:you|we|I)\\s+should\\b`, 'i'),
    /\bthe council\s+(?:recommends|says|thinks|agrees|decided)\b/i,
  ]
  for (const r of rows) {
    if (/^Decision:/.test(r.text)) continue // the question is the person's own
    let found = null
    for (const x of re) { const m = r.text.match(x); if (m) { found = { hit: m[0], kind: 'guess' }; break } }
    if (!found) found = puppet(r.text, alt.join('|'), /^Not verified:/.test(r.text))
    if (found) add('ventriloquist', r.n, `"${found.hit}"; ${VENT_FIX[found.kind]}`)
  }
}

// The not-convened form is five lines and no others.
const NC_LINES = [['Decision:', /^Decision:\s*\S/], ['Council: not convened', /^Council:\s*not convened\b/i], ['Not covered:', /^Not covered:\s*\S/], ['Next:', /^Next:\s*\S/], ['Not verified:', /^Not verified:\s*\S/]]
const NC_HINT = { 'Next:': ' (ask the one brain that covers it, or say nothing here does)' }

function checkNotConvened(p, add, councilRow, brains) {
  if (p.seats.length || p.chair) add('not-convened-form', councilRow.n, 'it has a seat or chair block; a reply that does not convene has neither')
  const seen = new Map()
  for (const r of p.outside) {
    const t = r.text.trim()
    const kind = NC_LINES.find(([, re]) => re.test(t))
    if (!kind) {
      add('not-convened-form', r.n, `"${t.slice(0, 50)}${t.length > 50 ? ' ...' : ''}" is not one of the five lines; a reply that does not convene is Decision:, Council: not convened, Not covered:, Next: and Not verified:, and no others`)
    } else if (seen.has(kind[0])) add('not-convened-form', r.n, `a second "${kind[0]}" line (the first is line ${seen.get(kind[0])}); each of the five lines appears once`)
    else seen.set(kind[0], r.n)
    if (/^Decision:/.test(t)) continue
    const call = t.includes(LABEL) ? LABEL : (t.match(/\b(?:Recommendation|Synthesis|Verdict|My call)\b/i) || [])[0]
    if (call) add('not-convened-form', r.n, `"${call}"; a reply that does not convene gives no recommendation under any name, because a synthesis over fewer than two corpora is one brain's answer with extra steps`)
  }
  for (const [label] of NC_LINES.slice(2)) if (!seen.has(label)) add('not-convened-form', councilRow.n, `no "${label}" line${NC_HINT[label] || ''}`)
  // No seat exists here, so the names are the brains this reply's Council: and Next: lines list.
  ventriloquist(p.outside, nameWords(roster(p.outside.filter((r) => /^(?:Council|Next):/.test(r.text)), [], brains)), add)
}

// ---- Files ------------------------------------------------------------------

const SKIP_DIRS = new Set(['scripts', 'references', 'teaching', 'node_modules', '.git'])
// COUNCIL.md is this skill's handover note and ANSWER.md is a brain's; neither is a reply.
const SKIP_FILES = new Set(['SKILL.md', 'README.md', 'COUNCIL.md', 'ANSWER.md', 'LICENSE'])
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
// Pairs only an installed brain can judge: its own gate, or its heading name.
const NEEDS_BRAIN = new Set(['seat-format', 'seat-name'])
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
  // The whole collection is beside the skill only inside the repo; an install of this skill and a few brains is not a fault.
  if (!peers.includes('khe-auto')) skip('every khe- name in the .md files is a folder beside the skill: khe-auto is not beside this folder, so this is an install and not the repo')
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
  say(pairs.length >= 15, `teaching/ holds ${pairs.length} pairs (fifteen at least)`)
  for (const name of pairs) {
    const dir = join(tdir, name)
    if (!LINES[name]) { say(false, `teaching/${name} is named for a line the gate prints`); continue }
    const bad = list(dir, (f) => f.startsWith('bad.'))[0]
    const good = list(dir, (f) => f.startsWith('good.'))[0]
    if (!bad || !good) { say(false, `teaching/${name} has a bad and a good file`); continue }
    const first = norm(readFileSync(join(dir, bad), 'utf8')).split('\n')[0]
    say(isComment(first) && first.includes(name), `teaching/${name}/${bad} starts with a comment naming ${name}`)
    const fb = checkFile(join(dir, bad), ctx)
    if (NEEDS_BRAIN.has(name) && !fb.some((f) => f.line === name) && fb.some((f) => f.line === 'seat-unchecked')) {
      skip(`teaching/${name}: a brain that judges this pair is not installed here, so the fault cannot be raised (the good file is still checked)`)
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

    // The cases below judge the chair and the form, so they keep every installed brain's name and skip the brains' own gates.
    const names = { brains: new Map([...brains].map(([k, b]) => [k, { ...b, hasGate: false }])) }
    const linesOf = (t, c = names) => checkReply(t, 'inline', c).map((f) => f.line)
    const raises = (line, t, what, c = names) => say(linesOf(t, c).includes(line), `${what} raises ${line}:`)
    const quiet = (line, t, what, c = names) => say(!linesOf(t, c).includes(line), `${what} raises no ${line}:`)

    // The not-convened form is five lines and no others.
    raises('not-convened-form', nc + '\nMy call: use the thing.', 'a sixth line on a not-convened reply')
    raises('not-convened-form', nc.replace('Not covered: the thing.', `Not covered: the thing. ${LABEL} use it.`), 'the recommendation label in the middle of a not-convened line')
    raises('not-convened-form', nc + '\nSynthesis: use the thing.', 'a Synthesis: line on a not-convened reply')
    raises('not-convened-form', nc + '\nNext: ask again later.', 'a second Next: line on a not-convened reply')
    raises('ventriloquist', nc.replace(/^Next:.*$/m, 'Next: use the thing, which is what Pat Example would tell you.'), 'a not-convened line with a name nobody installed and "would tell you"', none)
    raises('ventriloquist', nc + '\nSynthesis: the thing. Pat Example would pick it.', 'a not-convened line with "would pick" after a two-word name', none)

    // A chair citation is matched whole, against what the seat cites.
    const rests = base.split('\n').find((l) => /^Rests on:/.test(l)) || ''
    const c0 = citesOf(rests)[0]
    const seat0 = c0 && parseReply(base).seats.find((s) => s.short === c0.seat)
    if (!c0 || !seat0) skip('chair citation cases: the base text has no Rests on: citation')
    else {
      const whole = `[${c0.seat}: ${c0.text}]`
      const swap = (text) => setLine(base, /^Rests on:/, (l) => l.replace(whole, `[${c0.seat}: ${text}]`))
      const title = (seat0.lines.map((r) => r.text).find((l) => /^Source:/.test(l)) || '').replace(/^Source:\s*/, '').replace(/,\s*https?:.*$/, '')
      const notIn = (seat0.lines.map((r) => r.text).find((l) => /^Not in\b/.test(l)) || '').replace(/^[^:]*:\s*/, '').split(/\s+/).slice(0, 4).join(' ')
      raises('chair-citation', swap(c0.text.slice(0, -1)), `a chair citation cut one character short ("${c0.text.slice(0, -1)}")`)
      raises('chair-citation', swap(title.slice(0, -1)), `a chair citation that is a piece of a Source: title ("${title.slice(0, -1)}")`)
      raises('chair-citation', swap('a'), 'a chair citation of one letter')
      raises('chair-citation', swap(notIn), `a chair citation lifted from a "Not in" line ("${notIn}")`)
      quiet('chair-citation', swap(title), `a chair citation that is a whole Source: title ("${title}")`)

      // Words in a person's mouth, in every form a reviewer got past the first gate.
      const wc = (sentence) => setLine(base, /^Would change it:/, () => `Would change it: ${sentence}`)
      for (const sentence of [
        'Varun Mayya would never sign off on a year in private.',
        "Varun wouldn't wait a year.",
        'Enrico Tartarotti would answer that Figma is the exception.',
        'Varun Mayya would have said the same a year ago.',
        "Varun's answer would be to ship.",
        'Varun Mayya wants you to ship now.',
        'Expect Varun Mayya to tell you to ship.',
        'Varun Mayya is telling you to ship.',
        'Varun could well say otherwise.',
        `If asked, Varun Mayya would back the early launch ${whole}.`,
        'Varun Mayya and Y Combinator both back shipping now.',
        'Pat Example has no patience for long private builds.',
      ]) raises('ventriloquist', wc(sentence), `"${sentence.replace(whole, '[cite]')}"`)
      const reported = wc(`What ${person} has published suggests a build of two years before any test would be a very big risk ${whole}.`)
      quiet('ventriloquist', reported, 'the reporting form, "What {name} has published suggests ... would ..." with its chair citation,')
      quiet('named-without-citation', reported, 'the reporting form with its chair citation')

      // A name needs its citation on every chair line but Rests on: and Not verified:.
      for (const label of ['Not covered', 'Would change it']) raises('named-without-citation', setLine(base, new RegExp(`^${label}:`), (l) => `${l} ${person} has built companies.`), `a name with no citation on the ${label}: line`)
      raises('named-without-citation', setLine(base, /^Not covered:/, (l) => `${l} Paul Graham is right about this.`), 'a person a seat block names, with no citation, on the Not covered: line')
      raises('recommendation-names', setLine(base, /^Recommendation \(/, (l) => `${l} This is the first cited line ${whole}.`), 'a chair citation on the Recommendation line')
      raises('recommendation-names', setLine(base, /^Recommendation \(/, (l) => `${l} Paul Graham is right about this.`), 'a person a seat block names, on the Recommendation line')
      raises('unknown-chair-label', setLine(base, /^Rests on:/, (l) => `${l}\nBottom line: ship.`), 'a "Bottom line:" line in the chair block')
      raises('unknown-chair-label', base.replace('\nNot verified:', '\n== Notes ==\nNot verified:'), 'a "== Notes ==" header after the chair')
      raises('no-council-line', setLine(base, /^Council:/, (l) => l.replace(/(\d+) of \d+/, (_, n) => `${n} of ${Number(n) - 1}`)), 'a Council: line with more seated than installed')

      // Not verified: is the run's log. It may name a seat or a brain, and it may not put words in a mouth.
      const log = (more) => setLine(base, /^Not verified:/, (l) => `${l} ${more}`)
      quiet('named-without-citation', log(`The gate of the ${person.split(' ')[0]} brain was not run again.`), 'a seat named on the Not verified: line')
      raises('ventriloquist', log(`${person.split(' ')[0]} would say otherwise.`), 'a name and "would say" on the Not verified: line')
      raises('ventriloquist', log(`${person} wants you to ship.`), 'a name and "wants you" on the Not verified: line')

      // A person counts when a seat header names them or a seat sentence quotes them, never for two capital letters in a row.
      quiet('named-without-citation', setLine(base, /^Not covered:/, (l) => `${l} Nothing here is about Steve Jobs.`), 'a name a seat block mentions and never quotes ("Steve Jobs"), on the Not covered: line,')
      raises('named-without-citation', setLine(base, /^Not covered:/, (l) => `${l} Michael Seibel is right about this.`), 'a person a seat quotes after a clause ("Michael Seibel, in a talk ..., calls"), with no citation,')

      // A Why: clause stands on the citations of its own Disagree: line, and on no others.
      const why = (clause) => base.replace('Why: the Figma piece', `Why: ${clause}, and the Figma piece`)
      raises('named-without-citation', why('the varun seat cites one company'), 'a Why: clause that names a seat its Disagree: line does not cite')
      raises('ventriloquist', why('Enrico Tartarotti would call Figma the exception'), 'a Why: clause with a name and "would"')

      // A pronoun carries a name forward only when it sits directly before the modal.
      const twoSides = `What ${person} has published suggests founders test early ${whole}, and what Harshit Khemani has published suggests the same [harshit: 2026-05-14-best-startups-often-built].`
      const agree = (line) => { const rows = base.split('\n'); rows.splice(rows.findIndex((l) => /^Disagree:/.test(l)), 0, `Agree: ${line}`); return rows.join('\n') }
      raises('ventriloquist', agree(`${twoSides} He would not wait a year.`), '"He would not wait" in the sentence after a cited name')

      // The names are the reply's own: its seats and the brains its Council: line lists, whatever else is installed.
      raises('ventriloquist', setLine(base, /^Not covered:/, (l) => `${l} Emil Kowalski has no patience for long private builds.`), 'a brain the Council: line leaves out, named with "has no patience" where no brain is installed,', none)
      // A brain the Council: line leaves out has no seat block, so no chair line may give it a view.
      const addTo = (re, text) => setLine(base, re, (l) => `${l} ${text}`)
      const outCases = [
        [/^Recommendation \(/, "This is also where Emil Kowalski's articles and Benji Taylor's writing point.", 'a left-out person on the Recommendation line', 'recommendation-names'],
        [/^Recommendation \(/, 'The emil brain leans toward shipping early.', 'a left-out brain as "the emil brain" on the Recommendation line', 'recommendation-names'],
        [/^Recommendation \(/, 'The benji seat would agree.', 'a left-out brain as "the benji seat" on the Recommendation line', 'recommendation-names'],
        [/^Recommendation \(/, 'See khe-brain-emil for motion.', 'a left-out folder name on the Recommendation line', 'recommendation-names'],
        [/^Agree:/, "Emil Kowalski's articles point the same way.", 'a left-out person on the Agree: line', 'named-without-citation'],
        [/^Would change it:/, "Benji Taylor's writing favours the long private build.", 'a left-out person on the Would change it: line', 'named-without-citation'],
        [/^Would change it:/, 'The emil brain leans toward shipping early.', 'a left-out brain as "the emil brain" on the Would change it: line', 'named-without-citation'],
        [/^Disagree:/, "Why: Emil Kowalski's articles say otherwise.", 'a left-out person in a Why: clause', 'named-without-citation'],
      ]
      for (const [re, text, what, line] of outCases) {
        raises(line, addTo(re, text), what)
        if (/brain|seat/.test(text)) raises(line, addTo(re, text), `${what}, with no brain installed,`, none)
      }
      for (const text of ['The emil brain leans toward shipping early.', 'See khe-brain-emil for motion.']) raises('recommendation-names', addTo(/^Recommendation \(/, text), `"${text}" on the Recommendation line, with no brain installed,`, none)
      quiet('recommendation-names', base, 'the same reply without the left-out names')
      quiet('named-without-citation', base, 'the same reply without the left-out names')
      quiet('named-without-citation', addTo(/^Not covered:/, 'Nothing here covers motion; khe-brain-emil was left out for that reason.'), 'an honest Not covered: line that names a left-out brain by folder')
      quiet('named-without-citation', addTo(/^Not verified:/, 'The pieces of khe-brain-benji were not opened, since that brain is left out.'), 'an honest Not verified: line that names a left-out brain by folder')
      quiet('named-without-citation', addTo(/^Would change it:/, 'Seating khe-brain-emil, if the question turns to motion.'), 'a Would change it: line that names a left-out folder as a thing to seat')
      quiet('ventriloquist', wc('A test with one person could flip the call.'),'a sentence that shares a word with a brain the reply never names ("Test Person" installed, "one person could")', extraBrain)

      // Honest lines the gate once failed. Each one raises no never-intentional line.
      const gold = (f) => (existsSync(join(exDir, f)) ? norm(readFileSync(join(exDir, f), 'utf8')) : null)
      const launch = gold('audience-or-launch.txt')
      const silent = gold('most-seats-silent.txt')
      const more = (t, re, text) => setLine(t, re, (l) => `${l} ${text}`)
      const agreeIn = (t, line) => { const rows = t.split('\n'); rows.splice(rows.findIndex((l) => /^Disagree:/.test(l)), 0, `Agree: ${line}`); return rows.join('\n') }
      const honest = [
        ['a capitalised thing with "would" ("A Figma case would flip the call")', base, (t) => setLine(t, /^Would change it:/, () => 'Would change it: A Figma case would flip the call to a private build.')],
        ['the reporting form with "could" and "will", cited', base, (t) => agreeIn(t, 'What Varun Mayya has published suggests a two-year build could be completely off in direction, and what Harshit Khemani has published suggests the market will teach faster than a plan [varun: Kata 12 at 5:44] [harshit: 2026-05-14-best-startups-often-built]')],
        ['"they will wait", about a company\'s users, in a Why: clause', base, (t) => t.replace('Why: the Figma piece', 'Why: the first is about a company whose users were designers, and they will wait for a tool they need; the Figma piece')],
        ['"A year in private would delay" in the sentence after two cited names', base, (t) => agreeIn(t, 'What Varun Mayya has published suggests testing before a long build [varun: Kata 12 at 5:44], and what Y Combinator has published suggests the same [yc: How to build an MVP]. A year in private would delay the first test by twelve months.')],
        ['a person the seat quotes, named with the seat\'s citation', base, (t) => agreeIn(t, 'In the talk the seat cites, Michael Seibel calls the founder who wants a year to build a fake Steve Jobs [yc: How to build an MVP], and what Varun Mayya has published suggests a long build before a test is a very big risk [varun: Kata 12 at 5:44]')],
        ['a brain named on Not verified: ("The gate of the Varun brain could not be run again")', base, (t) => more(t, /^Not verified:/, 'The gate of the Varun brain could not be run again after the cross-check.')],
        ['an institution named on Not verified: ("No Y Combinator essay was opened again")', base, (t) => more(t, /^Not verified:/, 'No Y Combinator essay was opened again.')],
        ['a country from a seat\'s "Not in" line, on Not covered: ("the United States")', launch, (t) => more(t, /^Not covered:/, 'No cited line speaks to a founder outside the United States.')],
        ['a country from a seat\'s "Not in" line, on the Recommendation line', launch, (t) => more(t, /^Recommendation \(/, 'None of this depends on being in the United States.')],
        ['"the product will not work" on Would change it:', base, (t) => setLine(t, /^Would change it:/, () => 'Would change it: Evidence that the product will not work at all until it is finished, which would make an early test show nothing.')],
        ['"{name}\'s material says ... would be frustrating", cited', silent, (t) => agreeIn(t, "Emil Kowalski's material says a 500ms enter animation on every open would be frustrating [emil: Great Animations], and Enrico Tartarotti's material says such motion only makes people wait [enrico: The Ridiculous Engineering Of Animations at 8:15]")],
        ['"an open animation could teach" on Would change it:', silent, (t) => setLine(t, /^Would change it:/, () => 'Would change it: Usage data showing that most people open the menu only occasionally; then an open animation could teach where the menu lives.')],
        ['a product name with "would be" ("the Mac Spotlight launcher would be a fair comparison")', silent, (t) => more(t, /^Not covered:/, 'Whether the Mac Spotlight launcher would be a fair comparison for a web tool is also open.')],
        ['a Why: clause that names a seat its Disagree: line cites ("the enrico seat cites one company")', base, () => why('the enrico seat cites one company')],
        ['"what they could have learned", about founders, after a cited name', base, (t) => agreeIn(t, `${twoSides} Founders who wait find out late what they could have learned in a week.`)],
      ]
      for (const [what, from, make] of honest) {
        if (!from) { skip(`an honest line, ${what}: the gold reply it is cut from is absent`); continue }
        const text = make(from)
        const bad = never(checkReply(text, 'inline', names))
        say(text !== from && !bad.length, `an honest line, ${what}, raises nothing${bad.length ? ` (got ${tally(bad)})` : ''}`)
      }
      // The sixteenth stays a fault, and its message says why: advice to the reader, in a named sentence, is that person's advice.
      const advised = checkReply(agreeIn(base, "What Varun Mayya has published suggests you should stop building once one feature works [varun: Kata 11 at 21:38], and what Y Combinator has published suggests showing users something early [yc: Do Things that Don't Scale]"), 'inline', names).filter((f) => f.line === 'ventriloquist')
      say(advised.length === 1 && advised[0].detail.includes('never what the reader should do'), 'the reporting form with "you should", cited, raises ventriloquist: with the message about advice to the reader')
    }

    // A made-up council of two made-up brains, for the cases that need a [n] seat and a name to compare.
    const syn = [
      'Decision: Should the test thing ship?',
      'Council: 2 of 2 installed brains seated. Seated: khe-brain-zz, khe-brain-yy.',
      '',
      '== Seat: khe-brain-zz (Zed Zimmer) ==',
      'The first test piece covers the thing [1].',
      'Nearest: the second test piece is about something else [2].',
      'Source: [1] First Test Piece, https://example.com/one',
      'Source: [2] Second Test Piece, https://example.com/two',
      'Not in the test corpus: anything else.',
      '',
      '== Seat: khe-brain-yy (Yan Yarrow) ==',
      'The third test piece covers the thing (Third Test Piece at 1:00).',
      'Source: Third Test Piece, https://example.com/three',
      'Not in the test corpus: anything else.',
      '',
      '== Chair ==',
      'Agree: Both test corpora cover the thing. [zz: First Test Piece] [yy: Third Test Piece at 1:00]',
      'Not covered: everything else.',
      `${LABEL} Ship the test thing.`,
      'Rests on: [zz: First Test Piece] [yy: Third Test Piece at 1:00]',
      'Would change it: A fourth test piece.',
      'Not verified: this is a made-up fixture with no brain behind it.',
      `A reading by Harshit Khemani of public work. ${READING}.`,
    ].join('\n')
    const fake = (zz) => ({ brains: new Map([['khe-brain-zz', { name: 'khe-brain-zz', person: zz, hasGate: false }], ['khe-brain-yy', { name: 'khe-brain-yy', person: 'Yan Yarrow', hasGate: false }]]) })
    say(!never(checkReply(syn, 'inline', fake('Zed Zimmer'))).length, 'the made-up council raises no never-intentional line')
    raises('nearest-citation', syn.replace('Rests on: [zz: First Test Piece]', 'Rests on: [zz: Second Test Piece]'), 'a chair citation whose [n] marker sits only on a Nearest: line', fake('Zed Zimmer'))
    raises('chair-citation', syn.replace('Rests on: [zz: First Test Piece]', 'Rests on: [zz: First Test]'), 'a chair citation that is a piece of a [n] title', fake('Zed Zimmer'))
    raises('seat-uncited', syn.replace('covers the thing [1].', 'covers the thing (as everyone knows).'), 'a seat line whose only parenthesis matches no Source: line', fake('Zed Zimmer'))
    raises('seat-name', syn, 'a seat header that names someone other than the installed brain', fake('Someone Else'))
    quiet('seat-name', syn.replace('(Zed Zimmer)', '(zed zimmer)'), 'a seat header that differs from the brain only in case', fake('Zed Zimmer'))
    quiet('seat-name', syn, 'a seat header for a brain that is not installed', none)
    const twice = syn.replace('== Chair ==', '== Seat: khe-brain-zz (Zed Zimmer) ==\nThe first test piece covers the thing [1].\nSource: [1] First Test Piece, https://example.com/one\nNot in the test corpus: anything else.\n\n== Chair ==')
    raises('duplicate-seat', twice, 'the same brain seated twice', fake('Zed Zimmer'))
    quiet('no-council-line', twice, 'a brain seated twice, counted once against "2 of 2",', fake('Zed Zimmer'))
    raises('too-few-seats', twice.split('\n').filter((l, i, all) => !(i >= all.indexOf('== Seat: khe-brain-yy (Yan Yarrow) ==') && i < all.lastIndexOf('== Seat: khe-brain-zz (Zed Zimmer) =='))).join('\n'), 'one brain in two blocks', fake('Zed Zimmer'))
    raises('no-council-line', syn.replace('2 of 2', '3 of 3'), 'a Council: count that is not the number of seat blocks', fake('Zed Zimmer'))

    // The summary counts the seats a brain's own gate judged.
    const stats = { seats: 0, judged: 0 }
    checkReply(base, 'inline', { brains: new Map(), stats })
    say(stats.seats === parseReply(base).seats.length && stats.judged === 0, `with no brain installed the count is ${stats.judged} of ${stats.seats} seats judged by their own brain's gate`)

    // A folder that holds a reply and its handover note: the note is not a reply.
    const fdir = mkdtempSync(join(tmpdir(), 'khe-decision-folder-'))
    try {
      writeFileSync(join(fdir, 'reply.txt'), syn + '\n')
      writeFileSync(join(fdir, 'COUNCIL.md'), '# Council\n\nNotes for the person, not a reply.\n')
      const got = collect([fdir], [])
      say(got.length === 1 && got[0].endsWith('reply.txt'), 'a folder walk checks the reply and skips COUNCIL.md')
    } finally {
      rmSync(fdir, { recursive: true, force: true })
    }

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
  const stats = { seats: 0, judged: 0 }
  for (const f of files) findings.push(...checkFile(f, { brains, stats }, notChecked))

  for (const f of findings) {
    console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
    for (const c of f.children || []) console.log(`    ${c}`)
  }
  const hard = never(findings)
  const soft = findings.filter((f) => f.class === 'candidate')
  if (findings.length) console.log('')
  console.log(`checked ${files.length} repl${files.length === 1 ? 'y' : 'ies'} with ${brains.size} installed brain${brains.size === 1 ? '' : 's'} to judge the seats`)
  const unjudged = stats.seats - stats.judged
  console.log(`seats judged by their own brain's gate: ${stats.judged} of ${stats.seats}${unjudged ? ` (${unjudged} got only the generic check, because the brain or its gate is not installed here; --strict fails on these)` : ''}`)
  console.log(`never intentional: ${hard.length}${hard.length ? ` (${tally(hard)})` : ''}`)
  console.log(`candidates: ${soft.length}${soft.length ? ` (${tally(soft)})` : ''}`)
  for (const n of notChecked) console.log(`not checked: ${n}`)
  console.log('passing is necessary, not sufficient')

  const failing = hard.length + (strict ? soft.length : 0)
  const status = failing ? 'failed' : notChecked.length ? 'inconclusive' : 'passed'
  const exitCode = status === 'inconclusive' ? 2 : status === 'failed' && (gate || strict) ? 1 : 0
  if (reportPath) writeFileSync(reportPath, JSON.stringify({ status, exitCode, files: files.map(show), seats: stats, findings, notChecked }, null, 2) + '\n')
  if (status === 'passed') console.log(`${GATE_NAME} passed`)
  else if (status === 'inconclusive') console.log(`${GATE_NAME} inconclusive: ${notChecked.length} thing${notChecked.length === 1 ? '' : 's'} not checked`)
  else console.log(`${GATE_NAME} failed: ${failing} fault${failing === 1 ? '' : 's'}`)
  return exitCode
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = main(process.argv.slice(2))
}
