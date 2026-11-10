#!/usr/bin/env node
// brain-check: the gate for khe-brain-emil.
//
// It reads a saved reply (.txt) and names every fault as a line. A reply is:
//
//   <the answer: sentences that each carry a [n] marker, start "My reading:",
//    or say that he has not written about the thing>
//   Conflict: <optional, one per disagreement, citing both sides>
//   Source: [n] <Title>, <URL>          (or "Source: none" for a silent topic)
//   Not in his writing: <what the corpus does not cover>
//
// The titles and URLs it accepts are read from ../references/sources.md and the
// quotations from ../references/quotes.md. Nothing is listed twice.
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
const CORPUS_HOST = 'emilkowal.ski'
const QUOTE_MAX = 15 // a quotation has fewer words than this
const ANSWER_MAX = 3 // sentences in the opening paragraph

// Every line the gate can print. "never" lines fail the gate. "candidate"
// lines are reported for judgment and fail only under --strict.
export const LINES = {
  'no-answer': ['never', 'Nothing comes before the first Conflict:, Source: or Not in his writing: line'],
  'no-source': ['never', 'The reply has no Source: line'],
  'bad-source-line': ['never', 'A Source: line that is neither "[n] Title, URL" nor "none"'],
  'unknown-source': ['never', 'A Source: line whose title is not in references/sources.md'],
  'wrong-url': ['never', 'A Source: line whose URL is not the one sources.md gives for that title'],
  'off-corpus-url': ['never', 'A URL that is not a page in references/sources.md'],
  'unsourced-claim': ['never', 'A sentence in the answer with no [n] marker that is not "My reading:" and does not state that he is silent'],
  'dangling-marker': ['never', 'A [n] marker with no Source: [n] line behind it'],
  'one-sided-conflict': ['never', 'A Conflict: line that cites fewer than two different sources'],
  'long-quote': ['never', `A quotation of ${QUOTE_MAX} words or more`],
  'unknown-quote': ['never', 'Words in double quotation marks that are not in references/quotes.md'],
  hedge: ['never', 'A hedge word; a claim is sourced, a reading, or absent'],
  'no-silence-line': ['never', 'The last line is not "Not in his writing: <what the corpus leaves out>"'],
  // candidates
  'unused-source': ['candidate', 'A Source: line that no [n] marker points at'],
  'long-answer': ['candidate', `More than ${ANSWER_MAX} sentences before the first list line`],
  'nothing-left-out': ['candidate', 'A Not in his writing: line that claims nothing was left out'],
  'many-quotes': ['candidate', 'More than one quotation in a reply'],
  'code-block': ['candidate', 'A fenced code block; this skill answers and another skill builds'],
}

// Hedges. Three of them are words this collection never writes in a document,
// so they are assembled here and appear nowhere as plain text.
const HOUSE = ['reason' + 'ably', 'taste' + 'ful', 'where ' + 'appropriate']
const HEDGES = ['probably', 'presumably', 'likely', 'perhaps', 'maybe', 'might', 'arguably', 'i think', 'i believe', 'i guess', 'i suspect', 'it seems', 'seems to', 'sort of', 'kind of', ...HOUSE]
const HEDGE_RE = new RegExp(`\\b(${HEDGES.map((h) => h.replace(/ /g, '\\s+')).join('|')})\\b`, 'i')

// Things a file in this skill never contains. Assembled for the same reason.
const DASH = String.fromCharCode(0x2014)
const NEVER_WRITTEN = [...HOUSE, 'dis' + 'tilled', 'Agents' + 'ORG', 'design-' + 'engineering']

const HELP = `brain-check: the gate for khe-brain-emil

Usage:
  node scripts/brain-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]

What it reads:
  *.txt   a saved reply: the answer, optional Conflict: lines, Source: lines, and a last line Not in his writing:
  A folder is walked. scripts/ and references/ are skipped.

A sentence in the answer is one of three kinds:
  sourced     it carries a [n] marker, and a "Source: [n] Title, URL" line exists
  a reading   it follows "My reading:" on the same line
  silence     it says he has not written about the thing

Flags:
  --gate        end with "${GATE_NAME} passed" and exit 0 only when every never-intentional line is at 0;
                exit 1 with the counts otherwise; exit 2 with "inconclusive" when it could not check
  --strict      candidate lines fail too
  --report f    write { status, exitCode, files, findings, notChecked } as JSON
  --self-test   prove the gate on references/, examples/ and teaching/
  --help        this text

Every finding prints as  <line-name>: <what and where> (<file>:<line>)

Never intentional (the gate fails on any):
${Object.entries(LINES).filter(([, v]) => v[0] === 'never').map(([k, v]) => `  ${(k + ':').padEnd(22)} ${v[1]}`).join('\n')}

Candidates (reported for judgment):
${Object.entries(LINES).filter(([, v]) => v[0] === 'candidate').map(([k, v]) => `  ${(k + ':').padEnd(22)} ${v[1]}`).join('\n')}

Not checked by this gate:
  - whether the cited article says what the sentence says; it reads titles, never the articles
  - whether a paraphrase is fair, or bends the claim
  - whether a sentence under "My reading:" is a sound inference
  - whether a topic called silent is silent; that is references/silent.md and the theme files
  - whether a disagreement in references/disagreements.md was left out of the reply
  - whether a number in the answer matches the number in the reference
  - whether the reply answers the question that was asked; it never sees the question
  - whether an article changed after the date in references/sources.md

passing is necessary, not sufficient`

// ---- Reading the corpus -----------------------------------------------------

// Built from code points so this file stays plain ASCII.
const ch = (...codes) => String.fromCharCode(...codes)
const BOM = ch(0xfeff)
const CURLY_SINGLE = new RegExp(`[${ch(0x2018, 0x2019)}]`, 'g')
const CURLY_DOUBLE = new RegExp(`[${ch(0x201c, 0x201d)}]`, 'g')
const norm = (s) => (s.startsWith(BOM) ? s.slice(1) : s).replace(/\r\n?/g, '\n')
const straight = (s) => s.replace(CURLY_SINGLE, "'").replace(CURLY_DOUBLE, '"')
const key = (s) => straight(s).toLowerCase().replace(/\s+/g, ' ').trim()
const bareUrl = (u) => u.replace(/#.*$/, '').replace(/[).,;]+$/, '').replace(/\/$/, '')
const words = (s) => s.trim().split(/\s+/).filter(Boolean)
const quoteKey = (s) => key(s).replace(/[^a-z0-9' ]/g, '').trim()

// The titles, URLs and quotations, all from the skill's own files. Returns
// null when sources.md cannot be read.
export function readCorpus(skillDir = SKILL_DIR) {
  const path = join(skillDir, 'references', 'sources.md')
  if (!existsSync(path)) return null
  const titles = new Map() // key(title) -> { title, url }
  const urls = new Set()
  for (const row of norm(readFileSync(path, 'utf8')).split('\n')) {
    const cells = row.split('|').map((c) => c.trim())
    if (cells.length < 5 || !/^\d+$/.test(cells[1]) || !/^https?:\/\//.test(cells[3])) continue
    titles.set(key(cells[2]), { title: cells[2], url: bareUrl(cells[3]) })
    urls.add(bareUrl(cells[3]))
  }
  if (!titles.size) return null
  const qpath = join(skillDir, 'references', 'quotes.md')
  let quotes = null
  if (existsSync(qpath)) {
    quotes = []
    for (const l of norm(readFileSync(qpath, 'utf8')).split('\n')) {
      const m = l.match(/^- "([^"]+)" \((.+), (https?:\/\/\S+)\)\s*$/)
      if (m) quotes.push({ text: m[1], title: m[2], url: bareUrl(m[3]) })
    }
  }
  return { titles, urls, quotes }
}

// ---- A reply ----------------------------------------------------------------

const isComment = (l) => /^<!--.*-->$/.test(l.trim())
const LABEL = /^(Conflict|Source|Not in his writing):/
const MARKER = /\[(\d+)\]/g
const URL_RE = /https?:\/\/[^\s)>\]]+/g
const SILENCE = /\b(has|have) not (written|published)\b|\b(does|do) not (cover|say|address)\b|\bnot in his (public )?writing\b|\b(is|are) silent\b|\bnothing (published|in (the|his) articles)\b|\bno article\b/i
const markersIn = (s) => [...s.matchAll(MARKER)].map((m) => m[1])
// Sentences end at a full stop, a question mark or an exclamation mark that is
// followed by a space and a capital, a backtick or a quotation mark.
const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z`"])/).map((t) => t.trim()).filter((t) => /[A-Za-z]/.test(t))

export function checkReply(text, file, corpus) {
  const out = []
  const add = (line, n, detail) => out.push({ line, file, lineNumber: n, detail, class: LINES[line][0] })
  const all = straight(text).split('\n')
  const rows = []
  let lead = true
  all.forEach((l, i) => {
    if (lead && (l.trim() === '' || isComment(l))) return
    lead = false
    if (l.trim() !== '') rows.push([i + 1, l])
  })
  if (!rows.length) return out

  // The answer is everything before the first labeled line.
  const firstLabel = rows.findIndex(([, l]) => LABEL.test(l))
  const answer = firstLabel < 0 ? rows : rows.slice(0, firstLabel)
  const labeled = firstLabel < 0 ? [] : rows.slice(firstLabel)
  if (!answer.length) add('no-answer', rows[0][0], 'the reply starts with a label; the answer comes first, in two or three sentences')

  // Source lines.
  const sources = new Map() // n -> line number
  let sourceLines = 0
  let sourceNone = false
  for (const [n, l] of rows) {
    if (!/^Source:/.test(l)) continue
    sourceLines++
    const body = l.replace(/^Source:\s*/, '').trim()
    if (/^none\.?$/i.test(body)) { sourceNone = true; continue }
    const m = body.match(/^\[(\d+)\]\s*(.+?),\s*(https?:\/\/\S+)$/)
    if (!m) { add('bad-source-line', n, `"${body.slice(0, 60)}" is not "[n] Title, URL"`); continue }
    const [, num, title, rawUrl] = m
    sources.set(num, n)
    const url = bareUrl(rawUrl)
    let host = ''
    try { host = new URL(url).hostname } catch { /* not a URL */ }
    if (host !== CORPUS_HOST) { add('off-corpus-url', n, `${url} is not a page on ${CORPUS_HOST}; a skill, a tweet or a talk is never a Source`); continue }
    const known = corpus.titles.get(key(title))
    if (!known) add('unknown-source', n, `"${title}" is not a title in references/sources.md`)
    else if (known.url !== url) add('wrong-url', n, `"${known.title}" is at ${known.url}, not ${url}`)
  }
  if (!sourceLines) add('no-source', rows[rows.length - 1][0], 'no line starts with "Source:"; cite the article, or write "Source: none" when he is silent')

  // The answer: every sentence is sourced, a reading, or a statement of silence.
  let opening = 0
  let inList = false
  for (const [n, raw] of answer) {
    if (/^```/.test(raw.trim())) continue
    if (/^\s*(?:[-*]|\d+\.)\s/.test(raw)) inList = true
    const l = raw.replace(/^\s*(?:[-*]|\d+\.)\s+/, '')
    const at = l.indexOf('My reading:')
    const claimed = at < 0 ? l : l.slice(0, at)
    const mine = at < 0 ? '' : l.slice(at)
    const parts = sentences(claimed)
    if (!inList) opening += parts.length + (mine ? sentences(mine).length : 0)
    for (const s of parts) {
      if (markersIn(s).length || SILENCE.test(s)) continue
      add('unsourced-claim', n, `"${s.length > 70 ? s.slice(0, 67) + '...' : s}" has no [n] marker and is not marked "My reading:"`)
    }
  }
  if (opening > ANSWER_MAX) add('long-answer', answer[0][0], `${opening} sentences before the first list line; the answer is two or three`)

  // Conflict lines cite both sides.
  for (const [n, l] of labeled) {
    if (!/^Conflict:/.test(l)) continue
    const cited = new Set(markersIn(l))
    if (cited.size < 2) add('one-sided-conflict', n, `the line cites ${cited.size} source${cited.size === 1 ? '' : 's'}; a disagreement names both articles`)
  }

  // Markers, URLs, quotations, hedges and fences, over every line that is not a Source line.
  const used = new Set()
  let quoteCount = 0
  let fence = false
  for (const [n, l] of rows) {
    if (/^Source:/.test(l)) continue
    if (/^```/.test(l.trim()) && !fence) { fence = true; add('code-block', n, 'a fenced block; name the skill that builds, and stop') }
    for (const num of markersIn(l)) {
      used.add(num)
      // With no Source line at all, no-source is the fault; one line names it.
      if (sourceLines && !sources.has(num)) add('dangling-marker', n, `[${num}] has no "Source: [${num}] ..." line`)
    }
    for (const u of l.match(URL_RE) || []) {
      if (!corpus.urls.has(bareUrl(u))) add('off-corpus-url', n, `${bareUrl(u)} is not a page in references/sources.md`)
    }
    for (const m of l.matchAll(/"([^"]+)"/g)) {
      const count = words(m[1]).length
      if (count >= QUOTE_MAX) { quoteCount++; add('long-quote', n, `${count} words in quotation marks; fewer than ${QUOTE_MAX}, or paraphrase`); continue }
      if (count < 3) continue
      quoteCount++
      const q = quoteKey(m[1])
      if (corpus.quotes && !corpus.quotes.some((k) => quoteKey(k.text).includes(q))) add('unknown-quote', n, `"${m[1].length > 50 ? m[1].slice(0, 47) + '...' : m[1]}" is not in references/quotes.md; paraphrase it`)
    }
    const h = l.match(HEDGE_RE)
    if (h) add('hedge', n, `"${h[0]}"; give the source, mark it "My reading:", or leave it out`)
  }
  if (quoteCount > 1) add('many-quotes', rows[0][0], `${quoteCount} quotations; one at most`)
  for (const [num, n] of sources) if (!used.has(num)) add('unused-source', n, `no sentence points at [${num}]`)

  // The last line.
  const [ln, ll] = rows[rows.length - 1]
  const nv = ll.match(/^Not in his writing:\s*(\S.*)$/)
  if (!nv) add('no-silence-line', ln, 'the last line is not "Not in his writing: <what the corpus does not cover>"')
  else if (/^(nothing|none|n\/a)\.?$/i.test(nv[1].trim())) add('nothing-left-out', ln, 'nothing left out is a claim; name what the articles do not cover')
  if (sourceNone && sources.size) add('bad-source-line', rows[0][0], '"Source: none" beside a cited source; a reply is silent or it is sourced')

  return out
}

// ---- Files ------------------------------------------------------------------

const SKIP_DIRS = new Set(['scripts', 'references', 'node_modules', '.git'])
const show = (p) => (relative(process.cwd(), p) || p).replace(/\\/g, '/')

function collect(paths, notChecked) {
  const files = []
  const walk = (dir) => {
    for (const f of readdirSync(dir).sort()) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) { if (!SKIP_DIRS.has(f)) walk(p) }
      else if (extname(f) === '.txt') files.push(p)
    }
  }
  for (const raw of paths) {
    const p = resolve(raw)
    if (!existsSync(p)) { notChecked.push(`${show(p)}: no such file or folder`); continue }
    if (statSync(p).isDirectory()) walk(p)
    else if (extname(p) === '.txt') files.push(p)
    else notChecked.push(`${show(p)}: not a .txt reply`)
  }
  return files
}

export function checkFile(path, corpus, notChecked = []) {
  const text = norm(readFileSync(path, 'utf8'))
  if (!text.split('\n').some((l) => l.trim() !== '' && !isComment(l))) { notChecked.push(`${show(path)}: empty`); return [] }
  return checkReply(text, show(path), corpus)
}

const never = (fs) => fs.filter((f) => f.class === 'never')
const tally = (fs) => {
  const c = {}
  for (const f of fs) c[f.line] = (c[f.line] || 0) + 1
  return Object.entries(c).map(([k, v]) => `${k} ${v}`).join(', ')
}
const walkAll = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  return statSync(p).isDirectory() ? walkAll(p) : [p]
})

// ---- Self-test --------------------------------------------------------------

function selfTest() {
  let failed = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const corpus = readCorpus()
  say(!!corpus, 'references/sources.md has a table of titles and URLs')
  if (!corpus) { console.log('\nself-test failed: 1'); return 1 }

  // The corpus itself.
  const entries = [...corpus.titles.values()]
  say(entries.length >= 13, `sources.md lists ${entries.length} pages (thirteen articles at least)`)
  say(entries.every((e) => { try { return new URL(e.url).hostname === CORPUS_HOST } catch { return false } }), `every page in sources.md is on ${CORPUS_HOST}`)
  say(Array.isArray(corpus.quotes) && corpus.quotes.length > 0 && corpus.quotes.length <= 6, `quotes.md holds ${corpus.quotes ? corpus.quotes.length : 0} quotations (six at most)`)
  for (const q of corpus.quotes || []) {
    const known = corpus.titles.get(key(q.title))
    say(words(q.text).length < QUOTE_MAX && !!known && known.url === q.url, `the quotation from ${q.title} is under ${QUOTE_MAX} words and names a page in sources.md`)
  }

  // Every claim in a reference names a page in sources.md, and every article is used.
  const refs = join(SKILL_DIR, 'references')
  const refFiles = readdirSync(refs).filter((f) => f.endsWith('.md')).sort()
  const cited = new Map()
  let claims = 0
  let broken = []
  for (const f of refFiles) {
    if (f === 'sources.md') continue
    const body = norm(readFileSync(join(refs, f), 'utf8'))
    for (const m of body.matchAll(/\(([^()]+?), (https?:\/\/[^\s()]+)\)/g)) {
      claims++
      const known = corpus.titles.get(key(m[1]))
      if (!known || known.url !== bareUrl(m[2])) broken.push(`${f}: (${m[1]}, ${m[2]})`)
      else cited.set(known.url, (cited.get(known.url) || 0) + 1)
    }
  }
  say(claims > 0 && !broken.length, `${claims} claim lines in references/ each name a page in sources.md${broken.length ? ` (not: ${broken.slice(0, 3).join('; ')})` : ''}`)
  const unusedPages = entries.filter((e) => !cited.has(e.url)).map((e) => e.title)
  say(!unusedPages.length, `every page in sources.md backs at least one claim${unusedPages.length ? ` (unused: ${unusedPages.join(', ')})` : ''}`)

  // The skill's own files.
  const skillMd = existsSync(join(SKILL_DIR, 'SKILL.md')) ? norm(readFileSync(join(SKILL_DIR, 'SKILL.md'), 'utf8')) : ''
  const unlinked = refFiles.filter((f) => !skillMd.includes(`(references/${f})`))
  say(!!skillMd && !unlinked.length, `SKILL.md links every file in references/${unlinked.length ? ` (missing: ${unlinked.join(', ')})` : ''}`)
  const prose = walkAll(SKILL_DIR).filter((p) => ['.md', '.txt'].includes(extname(p)))
  const dirty = []
  for (const p of prose) {
    const body = readFileSync(p, 'utf8')
    if (body.includes(DASH)) dirty.push(`${show(p)}: a long dash`)
    if (body.includes('{{')) dirty.push(`${show(p)}: an unfilled placeholder`)
    for (const w of NEVER_WRITTEN) if (body.toLowerCase().includes(w.toLowerCase())) dirty.push(`${show(p)}: a word this collection never writes`)
  }
  say(!dirty.length, `${prose.length} text files follow the writing rules${dirty.length ? ` (${dirty.slice(0, 4).join('; ')})` : ''}`)

  // Gold examples pass.
  const list = (dir, pred = () => true) => (existsSync(dir) ? readdirSync(dir).filter(pred).sort() : [])
  const examples = list(join(SKILL_DIR, 'examples'), (f) => f.endsWith('.txt'))
  say(examples.length >= 4 && examples.length <= 6, `examples/ holds ${examples.length} gold replies (four to six)`)
  for (const f of examples) {
    const first = norm(readFileSync(join(SKILL_DIR, 'examples', f), 'utf8')).split('\n')[0]
    say(isComment(first), `examples/${f} starts with a comment saying what it is the gold for`)
    const bad = never(checkFile(join(SKILL_DIR, 'examples', f), corpus))
    say(!bad.length, `examples/${f} raises no never-intentional line${bad.length ? ` (got ${tally(bad)})` : ''}`)
  }

  // Teaching pairs: each bad raises the line its folder is named for, and only that.
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
  const one = entries[0]
  const two = entries[1]
  const S1 = `Source: [1] ${one.title}, ${one.url}`
  const S2 = `Source: [2] ${two.title}, ${two.url}`
  const END = 'Not in his writing: a value for this exact case.'
  const reply = (...l) => checkReply(l.join('\n'), 'inline', corpus).map((f) => f.line)
  const inline = [
    ['no-answer', reply(S1, END)],
    ['bad-source-line', reply('It never animates [1].', `Source: ${one.title}`, END)],
    ['bad-source-line', reply('It never animates [1].', S1, 'Source: none', END)],
    ['unused-source', reply('It never animates [1].', S1, S2, END)],
    ['long-answer', reply('It never animates [1]. It is seen too often [1]. It is a keyboard action [1]. It stays still [1].', S1, END)],
    ['nothing-left-out', reply('It never animates [1].', S1, 'Not in his writing: nothing.')],
    ['many-quotes', reply(`He writes "${corpus.quotes[0].text}" [1] and "${corpus.quotes[1].text}" [2].`, S1, S2, END)],
    ['code-block', reply('It never animates [1].', '```css', '.x { transition: none; }', '```', S1, END)],
  ]
  for (const [line, got] of inline) say(got.includes(line), `an inline case raises ${line}:`)
  const clean = reply('It never animates [1]. My reading: the same holds for this menu.', S1, END)
  say(!clean.length, `the smallest correct reply raises nothing${clean.length ? ` (got ${clean.join(', ')})` : ''}`)
  const silent = reply('He has not written about interface sound.', 'Source: none', 'Not in his writing: sound, in any form.')
  say(!silent.length, `the smallest silent reply raises nothing${silent.length ? ` (got ${silent.join(', ')})` : ''}`)

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
  if (!corpus) notChecked.push('references/sources.md: the table of titles and URLs could not be read, so no source can be checked')
  else {
    if (!corpus.quotes) notChecked.push('references/quotes.md: not found, so no quotation can be checked')
    if (!paths.length) notChecked.push('no input: pass a saved reply (.txt) or a folder')
    files = collect(paths, notChecked)
    if (paths.length && !files.length) notChecked.push('no .txt reply found in the input')
    for (const f of files) findings.push(...checkFile(f, corpus, notChecked))
  }

  for (const f of findings) console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
  const hard = never(findings)
  const soft = findings.filter((f) => f.class === 'candidate')
  if (findings.length) console.log('')
  console.log(`checked ${files.length} repl${files.length === 1 ? 'y' : 'ies'}`)
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
