#!/usr/bin/env node
// brain-check: the gate for khe-brain-benji.
//
// It reads a saved reply (a .txt or .md file) and names every fault it can
// prove as a line. The pieces a reply may cite are read from the table in
// ../references/sources.md, and the topics the corpus does not cover from the
// table in ../references/silent.md. Nothing is listed twice.
//
//   node scripts/brain-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]
//
// Zero dependencies. Node 20 or newer.

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(HERE, '..')
const GATE_NAME = 'brain-check'
const QUOTE_LIMIT = 15 // a quote has fewer words than this
const QUOTE_MIN = 4 // a quoted span this long is treated as a quote of the source
const ANSWER_SENTENCES = 3

// Every line the gate can print. "never" lines fail the gate. "candidate"
// lines are reported for judgment and fail only under --strict.
export const LINES = {
  'no-answer': ['never', 'The reply does not open with the answer; a label or a Source: line comes first'],
  'no-source': ['never', 'No Source: line anywhere in the reply'],
  'unknown-source': ['never', 'A Source: line whose title is not a piece in references/sources.md'],
  'wrong-url': ['never', 'A Source: line with no URL, or a URL that is not the one sources.md gives for that title'],
  'unlisted-source': ['never', 'A piece cited in the answer as (Title) with no Source: line for it'],
  'unsourced-claim': ['never', 'A sentence marked as his (he, his, Benji, or a Holds:/Breaks: line) that cites no piece'],
  'unsourced-quote': ['never', `A quoted span of ${QUOTE_MIN} words or more in a sentence that cites no piece`],
  'long-quote': ['never', `A quoted span of ${QUOTE_LIMIT} words or more`],
  'hedge': ['never', 'A hedge word: the corpus says it or it does not'],
  'speculation': ['never', '"he would", "Benji would" or "he\'d": a guess at a position in place of a cited one'],
  'no-silent-line': ['never', 'The last line is not a Not in his writing: line'],
  // candidates
  'long-answer': ['candidate', `The answer paragraph runs past ${ANSWER_SENTENCES} sentences`],
  'unused-source': ['candidate', 'A Source: line for a piece the answer never cites'],
  'too-many-quotes': ['candidate', 'More than two direct quotes in one reply'],
  'nothing-left-out': ['candidate', 'A Not in his writing: line that claims nothing was left out'],
  'silent-topic': ['candidate', 'A sentence marked as his, with a citation, about a topic references/silent.md lists as not covered'],
}

const HEDGES = ['probably', 'perhaps', 'maybe', 'presumably', 'arguably', 'likely', 'might', 'supposedly', 'apparently', 'seemingly', 'seems', 'seem', 'I think', 'I believe', 'I suspect', 'I imagine', 'I guess', 'in my opinion']
const LABELS = ['Holds', 'Breaks', 'Disagrees', 'Changed', 'Nearest']

const HELP = `brain-check: the gate for khe-brain-benji

Usage:
  node scripts/brain-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]

What it reads:
  *.txt, *.md   a saved reply: the answer, optional ${LABELS.map((l) => l + ':').join(' ')} lines,
                one or more "Source: <Title>, <URL>" lines, and a last line "Not in his writing: ..."
                A "Yours:" line (the installer's own position, from references/pov.md) is skipped.
  A folder is walked. SKILL.md, README.md, ANSWER.md, references/, scripts/ and teaching/ are skipped.

How a reply cites:
  inside a sentence   (Title) or (Title; Title), the title exactly as references/sources.md has it
  under the answer    Source: Title, URL
  his words           in straight double quotes, fewer than ${QUOTE_LIMIT} words
  the user's words    in backticks, never in quotation marks

Flags:
  --gate        end with "${GATE_NAME} passed" and exit 0 only when every never-intentional line is at 0;
                exit 1 with the counts otherwise; exit 2 with "inconclusive" when it could not check
  --strict      candidate lines fail too
  --report f    write { status, exitCode, files, findings, notChecked } as JSON
  --self-test   prove the gate on examples/ and teaching/, and check the corpus against sources.md
  --help        this text

Every finding prints as  <line-name>: <what and where> (<file>:<line>)

Never intentional (the gate fails on any):
${Object.entries(LINES).filter(([, v]) => v[0] === 'never').map(([k, v]) => `  ${(k + ':').padEnd(20)} ${v[1]}`).join('\n')}

Candidates (reported for judgment):
${Object.entries(LINES).filter(([, v]) => v[0] === 'candidate').map(([k, v]) => `  ${(k + ':').padEnd(20)} ${v[1]}`).join('\n')}

Hedge words: ${HEDGES.join(', ')}

Not checked by this gate:
  - whether a cited piece says what the sentence claims; it matches titles, never meaning
  - a position stated as fact with no "he", "his" or "Benji" in the sentence
  - whether a quote is word for word what the piece says
  - whether a rule for faux product UI was stretched over a real product
  - whether two pieces that disagree were merged into one view
  - whether the corpus is current; sources.md carries the date it was read
  - whether the answer is useful, or answers the question that was asked
  - a "he" that means someone other than Benji Taylor; write other people by name or role

passing is necessary, not sufficient`

// ---- Reading the corpus -----------------------------------------------------

const CH = (...codes) => String.fromCharCode(...codes)
const EM_DASH = CH(0x2014)
const norm = (s) => s.replace(new RegExp('^' + CH(0xfeff)), '').replace(/\r\n?/g, '\n').replace(new RegExp('[' + CH(0x201c, 0x201d) + ']', 'g'), '"').replace(new RegExp('[' + CH(0x2018, 0x2019) + ']', 'g'), "'")
const cleanUrl = (u) => u.replace(/[).,;]+$/, '').replace(/\/+$/, '').toLowerCase()
const cells = (row) => row.split('|').slice(1, -1).map((c) => c.trim())

// The pieces and the silent topics, from the skill's own files. Returns null
// when sources.md cannot be read or lists nothing.
export function readCorpus(skillDir = SKILL_DIR) {
  const path = join(skillDir, 'references', 'sources.md')
  if (!existsSync(path)) return null
  const titles = new Map()
  for (const row of norm(readFileSync(path, 'utf8')).split('\n')) {
    if (!row.startsWith('|')) continue
    const c = cells(row)
    if (c.length >= 2 && /^https?:\/\/\S+$/.test(c[1])) titles.set(c[0], cleanUrl(c[1]))
  }
  if (!titles.size) return null
  const silent = []
  const sp = join(skillDir, 'references', 'silent.md')
  if (existsSync(sp)) {
    const text = norm(readFileSync(sp, 'utf8'))
    const at = text.indexOf('\n## Not covered\n')
    const rest = at < 0 ? '' : text.slice(at + 16)
    const end = rest.indexOf('\n## ')
    for (const row of (end < 0 ? rest : rest.slice(0, end)).split('\n')) {
      if (!row.startsWith('|')) continue
      const c = cells(row)
      if (c.length < 3 || /^-+$/.test(c[1].replace(/[\s:]/g, '')) || c[0] === 'Topic') continue
      const words = c[1].split(',').map((w) => w.trim()).filter(Boolean)
      if (words.length) silent.push({ topic: c[0], words })
    }
  }
  return { titles, silent }
}

// ---- Shared helpers ---------------------------------------------------------

const isComment = (l) => /^<!--.*-->$/.test(l.trim())
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const wordCount = (s) => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length
const quotesIn = (s) => [...s.matchAll(/"([^"\n]+)"/g)].map((m) => m[1])
// Quoted spans and backticked spans are someone's exact words. They are not
// judged as the reply's own wording.
const bare = (s) => s.replace(/"[^"\n]*"/g, ' ').replace(/`[^`\n]*`/g, ' ')
const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z"`(\[])/).map((x) => x.trim()).filter(Boolean)
const HEDGE_RE = new RegExp(`\\b(${HEDGES.map(esc).join('|')})\\b`, 'gi')
const SPEC_RE = /\b(?:Benji|Taylor|[Hh]e)\s+(?:would|wouldn't|would not)\b|\b[Hh]e'd\b|\bBenji'd\b/
const HIS_RE = /\b(?:Benji|Taylor)\b|\b[Hh]e\b|\b[Hh]is\b|\b[Hh]im\b/
const SILENT_RE = /\b(?:has|had|have) not (?:written|published|said|covered|addressed|described)\b|\b(?:never|nowhere) (?:wrote|written|published|writes|says|covers)\b|\bdoes not (?:cover|say|address|mention|write|describe|give)\b|\b(?:is|are|stays) silent\b|\bnot in (?:his writing|the corpus|the pieces read)\b|\bno (?:piece|article|line)(?: of his)? (?:covers|says|addresses|mentions|describes)\b/i
const TURN_RE = /\b(?:but|however|though|although|yet)\b/i
const LABEL_RE = new RegExp(`^(${LABELS.join('|')}):\\s*`)

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

// The pieces a stretch of text cites: (Title) or (Title; Title).
function citesIn(s, known) {
  const out = []
  for (const m of s.matchAll(/\(([^()]+)\)/g)) {
    for (const part of m[1].split(';').map((p) => p.trim())) if (known.has(part)) out.push(part)
  }
  return out
}

// ---- A reply ----------------------------------------------------------------

export function checkReply(text, file, corpus) {
  const out = []
  const add = (line, n, detail) => out.push({ line, file, lineNumber: n, detail, class: LINES[line][0] })
  const rows = content(text)
  if (!rows.length) return out

  // Source lines first: their titles count as citable even when unknown, so a
  // made-up piece raises unknown-source once and nothing else.
  const sources = []
  for (const [n, l] of rows) {
    if (!/^Source:/.test(l)) continue
    const m = l.match(/^Source:\s*(.+?),\s*(https?:\/\/\S+)(?:\s+.*)?$/)
    if (m) sources.push({ n, title: m[1].trim(), url: cleanUrl(m[2]) })
    else sources.push({ n, title: l.replace(/^Source:\s*/, '').replace(/,\s*$/, '').trim(), url: null })
  }
  const known = new Set([...corpus.titles.keys(), ...sources.map((s) => s.title)])

  const [fn, fl] = rows[0]
  // A Yours: line is the installer's own position from references/pov.md. It
  // is theirs, so it is never judged as a claim about him.
  const isBody = (l) => !/^Source:/.test(l) && !/^Not in his writing:/.test(l) && !/^Yours:/.test(l)
  const answer = []
  for (const [n, l] of rows) { if (!isBody(l) || LABEL_RE.test(l) || /^#/.test(l)) break; answer.push([n, l]) }
  if (!answer.length) add('no-answer', fn, `the reply opens with "${fl.slice(0, 40)}"; the answer comes first, in two or three sentences`)

  const [ln, ll] = rows[rows.length - 1]
  const last = ll.match(/^Not in his writing:\s*(\S.*)$/)
  const early = rows.find(([n, l]) => /^Not in his writing:/.test(l) && n !== ln)
  if (!last) add('no-silent-line', ln, early ? `"Not in his writing:" is on line ${early[0]} and is not the last line` : 'the last line is not "Not in his writing: <what the corpus does not cover here>"')
  else if (/^(nothing|none|n\/a|nothing was left out)\.?$/i.test(last[1].trim())) add('nothing-left-out', ln, 'nothing left out is a claim; name what the question asked for that no piece covers, or what was not read')

  const cited = new Map()
  let quoteCount = 0
  const unit = (n, s, labelled, absenceLine) => {
    const qs = quotesIn(s)
    for (const q of qs) {
      const w = wordCount(q)
      if (w >= QUOTE_LIMIT) add('long-quote', n, `a quote of ${w} words ("${q.split(/\s+/).slice(0, 5).join(' ')} ..."); quote fewer than ${QUOTE_LIMIT} and paraphrase the rest`)
      if (w >= QUOTE_MIN) quoteCount++
    }
    const cs = citesIn(s, known)
    for (const t of cs) if (!cited.has(t)) cited.set(t, n)
    const plain = bare(s)
    const silentStmt = SILENT_RE.test(plain) && !TURN_RE.test(plain)
    const his = labelled || HIS_RE.test(plain)
    if (!cs.length) {
      if (qs.some((q) => wordCount(q) >= QUOTE_MIN)) add('unsourced-quote', n, `"${qs.find((q) => wordCount(q) >= QUOTE_MIN).split(/\s+/).slice(0, 5).join(' ')} ..." is quoted and the sentence names no piece; add (Title), or put the user's own words in backticks`)
      else if (his && !silentStmt && !absenceLine) add('unsourced-claim', n, `"${s.slice(0, 60)}${s.length > 60 ? ' ...' : ''}" is marked as his and cites no piece; add (Title), or move it to Not in his writing:`)
    } else if (his && !silentStmt) {
      for (const t of corpus.silent) {
        const w = t.words.find((x) => new RegExp(`\\b${esc(x)}\\b`, 'i').test(plain))
        if (w) { add('silent-topic', n, `"${w}" is under "${t.topic}" in references/silent.md, and this sentence gives him a position on it; read the cited line again`); break }
      }
    }
  }

  for (const [n, l] of rows) {
    if (/^Source:/.test(l) || /^Yours:/.test(l)) continue
    const plain = bare(l)
    const hedges = [...new Set([...plain.matchAll(HEDGE_RE)].map((m) => m[1].toLowerCase()))]
    if (hedges.length) add('hedge', n, `"${hedges.join('", "')}"; say what the piece says, or say it is not in his writing`)
    if (SPEC_RE.test(plain)) add('speculation', n, `"${plain.match(SPEC_RE)[0]}"; report what he wrote and where, never what he would do`)
    if (/^Not in his writing:/.test(l)) {
      // The absence line states what is missing. It is judged as a claim only
      // when it turns ("pricing, but he prefers ...").
      const rest = l.replace(/^Not in his writing:\s*/, '')
      if (TURN_RE.test(bare(rest))) for (const s of sentences(rest)) unit(n, s, false, false)
      else unit(n, rest, false, true)
      continue
    }
    if (/^#/.test(l)) continue
    const lab = l.match(LABEL_RE)
    if (lab) { unit(n, l.slice(lab[0].length), true, false); continue }
    for (const s of sentences(l.replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))) unit(n, s, false, false)
  }

  if (!sources.length) add('no-source', ln, 'no line starts with "Source:"; a silent answer still cites benji.org, the index of what he has published')
  else {
    for (const s of sources) {
      if (!corpus.titles.has(s.title)) add('unknown-source', s.n, `"${s.title}" is not a title in references/sources.md; cite a piece that is, or say the piece was not read`)
      else if (!s.url) add('wrong-url', s.n, `the Source line for "${s.title}" has no URL; write "Source: ${s.title}, <URL>"`)
      else if (s.url !== corpus.titles.get(s.title)) add('wrong-url', s.n, `"${s.title}" is at ${corpus.titles.get(s.title)} in sources.md, not ${s.url}`)
      if (!cited.has(s.title)) add('unused-source', s.n, `"${s.title}" has a Source line and no sentence cites it as (${s.title})`)
    }
    const listed = new Set(sources.map((s) => s.title))
    for (const [t, n] of cited) if (!listed.has(t)) add('unlisted-source', n, `(${t}) is cited here and has no "Source: ${t}, <URL>" line`)
  }

  if (quoteCount > 2) add('too-many-quotes', fn, `${quoteCount} direct quotes; two at most, paraphrase the rest`)
  const answerSentences = answer.reduce((k, [, l]) => k + sentences(l).length, 0)
  if (answerSentences > ANSWER_SENTENCES) add('long-answer', fn, `the answer is ${answerSentences} sentences; two or three, then the labelled lines and the sources`)

  return out
}

// ---- Files ------------------------------------------------------------------

const SKIP_DIRS = new Set(['scripts', 'references', 'teaching', 'node_modules', '.git'])
const SKIP_FILES = new Set(['SKILL.md', 'README.md', 'ANSWER.md', 'LICENSE'])
const EXT = ['.txt', '.md']
const show = (p) => (relative(process.cwd(), p) || p).replace(/\\/g, '/')

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

export function checkFile(path, corpus, notChecked = []) {
  const text = norm(readFileSync(path, 'utf8'))
  if (!content(text).length) { notChecked.push(`${show(path)}: empty`); return [] }
  return checkReply(text, show(path), corpus)
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
const HOUSE = ['dis' + 'tilled', 'taste' + 'ful', 'reason' + 'ably', 'where ' + 'appropriate', 'Agents' + 'ORG', 'design-' + 'engineering', EM_DASH]
const NOT_CORPUS = new Set(['sources.md', 'verify.md', 'review.md', 'teaching.md', 'gotchas.md', 'pov.md'])

function walkAll(dir) {
  return readdirSync(dir).sort().flatMap((f) => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? (f === 'node_modules' || f === '.git' ? [] : walkAll(p)) : [p]
  })
}

// Every (Title, URL) group in a corpus file, with the faults in it.
function corpusFaults(text, corpus, everyBullet) {
  const faults = []
  let cites = 0
  text.split('\n').forEach((l, i) => {
    let found = 0
    for (const m of l.matchAll(/\(([^()]*https?:\/\/[^()]*)\)/g)) {
      for (const part of m[1].split(';').map((p) => p.trim())) {
        const pm = part.match(/^(.+?),\s*(https?:\/\/\S+)$/)
        if (!pm) { faults.push(`line ${i + 1}: "${part}" is not "Title, URL"`); continue }
        found++
        if (!corpus.titles.has(pm[1])) faults.push(`line ${i + 1}: "${pm[1]}" is not in sources.md`)
        else if (cleanUrl(pm[2]) !== corpus.titles.get(pm[1])) faults.push(`line ${i + 1}: "${pm[1]}" has the wrong URL`)
      }
    }
    cites += found
    if (everyBullet && /^- /.test(l) && !/^- How to report it:/.test(l) && !found) faults.push(`line ${i + 1}: a claim with no (Title, URL)`)
  })
  return { faults, cites }
}

function selfTest() {
  let failed = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const corpus = readCorpus()
  say(!!corpus, 'references/sources.md has a table of pieces with URLs')
  if (!corpus) { console.log('\nself-test failed: 1'); return 1 }
  say(corpus.titles.size >= 8, `sources.md lists ${corpus.titles.size} pieces (eight at least)`)
  say(corpus.silent.length >= 8, `silent.md lists ${corpus.silent.length} topics the corpus does not cover (eight at least)`)

  const list = (dir, pred = () => true) => (existsSync(dir) ? readdirSync(dir).filter(pred).sort() : [])
  const refs = list(join(SKILL_DIR, 'references'), (f) => f.endsWith('.md'))
  const skill = existsSync(join(SKILL_DIR, 'SKILL.md')) ? norm(readFileSync(join(SKILL_DIR, 'SKILL.md'), 'utf8')) : ''
  for (const f of refs) say(skill.includes(`(references/${f})`), `SKILL.md links references/${f}`)

  // The corpus: every claim names a piece that is in sources.md, with its URL.
  let claims = 0
  for (const f of refs.filter((f) => !NOT_CORPUS.has(f))) {
    const r = corpusFaults(norm(readFileSync(join(SKILL_DIR, 'references', f), 'utf8')), corpus, f !== 'silent.md')
    claims += r.cites
    say(!r.faults.length, `references/${f}: ${r.cites} citations, every one a piece in sources.md with its URL${r.faults.length ? ` (${r.faults.slice(0, 3).join('; ')}${r.faults.length > 3 ? `; and ${r.faults.length - 3} more` : ''})` : ''}`)
  }
  say(claims >= 100, `the theme files hold ${claims} citations`)

  // House rules, on every text file in the skill.
  const all = walkAll(SKILL_DIR).filter((p) => /\.(md|txt|mjs)$/.test(p))
  const house = []
  const longQuotes = []
  for (const p of all) {
    const text = norm(readFileSync(p, 'utf8'))
    const rel = relative(SKILL_DIR, p).replace(/\\/g, '/')
    for (const w of HOUSE) if (text.toLowerCase().includes(w.toLowerCase())) house.push(`${rel}: "${w === EM_DASH ? 'em dash' : w}"`)
    if (/\.(md|txt)$/.test(p) && rel !== 'teaching/long-quote/bad.txt') {
      // Frontmatter is YAML: its outer quotes wrap a whole description, not a quotation.
      for (const q of quotesIn(text.replace(/^---\n[\s\S]*?\n---\n/, ''))) if (wordCount(q) >= QUOTE_LIMIT) longQuotes.push(`${rel}: "${q.split(/\s+/).slice(0, 4).join(' ')} ..."`)
    }
  }
  say(!house.length, `no file in the skill prints a word the collection bans${house.length ? ` (${house.slice(0, 4).join('; ')})` : ''}`)
  say(!longQuotes.length, `no quote in the skill reaches ${QUOTE_LIMIT} words${longQuotes.length ? ` (${longQuotes.slice(0, 3).join('; ')})` : ''}`)

  const examples = list(join(SKILL_DIR, 'examples'), (f) => /\.(txt|md)$/.test(f))
  say(examples.length >= 4, `examples/ holds ${examples.length} gold replies (four at least)`)
  for (const f of examples) {
    const found = checkFile(join(SKILL_DIR, 'examples', f), corpus)
    const bad = never(found)
    say(!bad.length, `examples/${f} raises no never-intentional line${bad.length ? ` (got ${tally(bad)})` : ''}`)
    const soft = found.filter((x) => x.class === 'candidate')
    say(!soft.length, `examples/${f} raises no candidate line${soft.length ? ` (got ${tally(soft)})` : ''}`)
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
    const b = never(checkFile(join(dir, bad), corpus)).map((f) => f.line)
    say(b.includes(name), `teaching/${name}/${bad} raises ${name}:`)
    say(new Set(b).size === 1 && b[0] === name, `teaching/${name}/${bad} has one thing wrong${b.length ? ` (raises ${[...new Set(b)].join(', ')})` : ''}`)
    const g = never(checkFile(join(dir, good), corpus))
    say(!g.length, `teaching/${name}/${good} raises no never-intentional line${g.length ? ` (got ${tally(g)})` : ''}`)
  }

  // Lines with no teaching pair are proven on the smallest text that raises them.
  const reply = (...l) => checkReply(l.join('\n'), 'inline', corpus).map((f) => f.line)
  const [t0, u0] = [...corpus.titles.entries()][0]
  const src = `Source: ${t0}, ${u0}`
  const end = 'Not in his writing: a number for real product UI.'
  const topic = corpus.silent[0]?.words[0] || 'pricing'
  const inline = [
    ['long-answer', reply(`One thing is stated (${t0}). Two things are stated (${t0}). Three (${t0}). Four (${t0}).`, src, end)],
    ['unused-source', reply('The corpus has one line on this.', src, end)],
    ['too-many-quotes', reply(`The piece says "one two three four", then "five six seven eight", then "nine ten eleven twelve" (${t0}).`, src, end)],
    ['nothing-left-out', reply(`One thing is stated (${t0}).`, src, 'Not in his writing: nothing.')],
    ['silent-topic', reply(`His view of ${topic} is that it comes last (${t0}).`, src, end)],
    ['unsourced-claim', reply(`One thing is stated (${t0}).`, src, 'Not in his writing: a number, but he prefers short ones.')],
    ['wrong-url', reply(`One thing is stated (${t0}).`, `Source: ${t0}`, end)],
    ['no-silent-line', reply(`One thing is stated (${t0}).`, 'Not in his writing: a number.', src)],
  ]
  for (const [line, got] of inline) say(got.includes(line), `an inline case raises ${line}:`)
  const clean = reply(`One thing is stated (${t0}).`, src, end)
  say(!clean.length, `the smallest correct reply raises nothing${clean.length ? ` (got ${clean.join(', ')})` : ''}`)
  const quiet = reply(`He has not written about ${topic}. The index lists the pieces he has published (${t0}).`, src, `Not in his writing: ${topic}.`)
  say(!quiet.length, `a plain statement of silence raises nothing${quiet.length ? ` (got ${quiet.join(', ')})` : ''}`)

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

  const corpus = readCorpus()
  if (!corpus) notChecked.push('references/sources.md: the table of pieces could not be read, so no citation can be checked')
  else {
    if (!paths.length) notChecked.push('no input: pass a saved reply (.txt or .md) or a folder of them')
    files = collect(paths, notChecked)
    if (paths.length && !files.length) notChecked.push('no .txt or .md reply found in the input')
    for (const f of files) findings.push(...checkFile(f, corpus, notChecked))
  }

  for (const f of findings) console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
  const hard = never(findings)
  const soft = findings.filter((f) => f.class === 'candidate')
  if (findings.length) console.log('')
  console.log(`checked ${files.length} repl${files.length === 1 ? 'y' : 'ies'} against ${corpus ? corpus.titles.size : 0} pieces in sources.md`)
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
