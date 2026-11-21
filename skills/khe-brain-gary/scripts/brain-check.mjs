#!/usr/bin/env node
// brain-check: the gate for khe-brain-gary.
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
const LAST = 'Not in the corpus:' // the corpus is his videos and his articles
const MIN_TITLES = 700 // 145 videos and 584 articles, plus the lists they came from

// Platforms and products whose advice and predictions change by year. A line
// about one of them that carries no year reads as a standing rule.
const PLATFORMS = ['Snapchat', 'Vine', 'Meerkat', 'Periscope', 'Musical.ly', 'TikTok', 'Clubhouse', 'Facebook', 'Instagram', 'Twitter', 'X', 'LinkedIn', 'YouTube', 'Threads', 'NFT', 'NFTs', 'VeeFriends', 'crypto', 'Bitcoin', 'AI', 'ChatGPT', 'VR', 'metaverse']
// Short or common words are matched in the case they are listed in ("X", "AI",
// "Vine", "Threads"); the rest in any case.
const PLATFORMS_EXACT = new Set(['Vine', 'Threads', 'X', 'AI', 'VR', 'NFT', 'NFTs'])

// Every line the gate can print. "never" lines fail the gate. "candidate"
// lines are reported for judgment and fail only under --strict.
export const LINES = {
  'no-answer': ['never', 'The reply does not open with the answer; a label or a Source: line comes first'],
  'no-source': ['never', 'No Source: line anywhere in the reply'],
  'unknown-source': ['never', 'A Source: line whose title is not a piece in references/sources.md'],
  'wrong-url': ['never', 'A Source: line with no URL, or a URL that is not the one sources.md gives for that title'],
  'unlisted-source': ['never', 'A piece cited in the answer as (Title) with no Source: line for it'],
  'unsourced-claim': ['never', 'A sentence marked as his (he, his, Gary, Vaynerchuk, GaryVee, or a Holds:/Breaks: line) that cites no piece'],
  'unsourced-quote': ['never', `A quoted span of ${QUOTE_MIN} words or more in a sentence that cites no piece`],
  'long-quote': ['never', `A quoted span of ${QUOTE_LIMIT} words or more`],
  'hedge': ['never', 'A hedge word: the corpus says it or it does not'],
  'speculation': ['never', '"he would", "Gary would" or "he\'d": a guess at a position in place of a cited one'],
  'no-timestamp': ['never', 'A video cited as (Title) with no time; write (Title at 4:10) so the line can be found in the video. An article is cited as (Title)'],
  'undated-call': ['never', 'A sentence marked as his that names a platform or product (TikTok, NFTs, AI and the like) and carries no year from 2006 to 2029; his platform advice and predictions change by year, so a line without its year reads as a standing rule'],
  'no-silent-line': ['never', `The last line is not a ${LAST} line`],
  // candidates
  'long-answer': ['candidate', `The answer paragraph runs past ${ANSWER_SENTENCES} sentences`],
  'unused-source': ['candidate', 'A Source: line for a piece the answer never cites'],
  'too-many-quotes': ['candidate', 'More than two direct quotes in one reply'],
  'nothing-left-out': ['candidate', `A ${LAST} line that claims nothing was left out`],
  'silent-topic': ['candidate', 'A sentence marked as his, with a citation, about a topic references/silent.md lists as not covered'],
}

const HEDGES = ['probably', 'perhaps', 'maybe', 'presumably', 'arguably', 'likely', 'might', 'supposedly', 'apparently', 'seemingly', 'seems', 'seem', 'I think', 'I believe', 'I suspect', 'I imagine', 'I guess', 'in my opinion']
const LABELS = ['Holds', 'Breaks', 'Disagrees', 'Changed', 'Nearest', 'Also']

const HELP = `brain-check: the gate for khe-brain-gary

Usage:
  node scripts/brain-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]

What it reads:
  *.txt, *.md   a saved reply: the answer, optional ${LABELS.map((l) => l + ':').join(' ')} lines,
                one or more "Source: <Title>, <URL>" lines, and a last line "${LAST} ..."
                A "Yours:" line (the installer's own position, from references/pov.md) is skipped.
  A folder is walked. SKILL.md, README.md, ANSWER.md, references/, scripts/ and teaching/ are skipped.

How a reply cites:
  a video, inside a sentence
                      (Title at 41:10) or (Title at 1:02:30; Title at 12:05), the title exactly as
                      references/sources.md has it and the time the line is said. A video is a link
                      on youtube.com or youtu.be.
  an article          (Title), with no time; any other host in sources.md is an article
  under the answer    Source: Title, URL   (a video's URL may end in &t=<seconds>s)
  his words           as the captions or the article give them, in straight double quotes, fewer than ${QUOTE_LIMIT} words
  the user's words    in backticks, never in quotation marks
  Titles are matched against the list in sources.md, longest first, so a title may hold "at", digits,
  $, #, &, ' : or ? without being cut short.

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
Platforms and products that need a year: ${PLATFORMS.join(', ')}

Not checked by this gate:
  - whether a cited piece says what the sentence claims; it matches titles, never meaning
  - a position stated as fact with no "he", "his", "Gary", "Vaynerchuk" or "GaryVee" in the sentence
  - whether a quote is word for word what he said; the captions are mostly automatic and mishear
  - whether the line was said by him, or by a host, guest, caller or audience member, or in a sponsor read; the captions have no speaker labels
  - whether an article was written by him or by his team under his byline; the reply says what the article says
  - whether a line about one platform, or a prediction from one year, was stretched into a rule for every platform or a view he holds today; the gate only asks that a year be present
  - whether the year in a sentence is the right one
  - whether two pieces that disagree were merged into one view
  - whether the corpus is current; sources.md carries the date it was read
  - whether the answer is useful, or answers the question that was asked
  - a "he" that means someone other than Gary Vaynerchuk; write other people by name or role

passing is necessary, not sufficient`

// ---- Reading the corpus -----------------------------------------------------

const CH = (...codes) => String.fromCharCode(...codes)
const EM_DASH = CH(0x2014)
const norm = (s) => s.replace(new RegExp('^' + CH(0xfeff)), '').replace(/\r\n?/g, '\n').replace(new RegExp('[' + CH(0x201c, 0x201d) + ']', 'g'), '"').replace(new RegExp('[' + CH(0x2018, 0x2019) + ']', 'g'), "'")
// Video ids are case-sensitive, so a URL is compared as written.
const cleanUrl = (u) => u.replace(/[).,;]+$/, '').replace(/[?&]t=\d+s?$/, '').replace(/\/+$/, '')
// A video is a watch page on youtube.com or a youtu.be link. The channel page
// and every other host (the articles) are not videos.
const isVideo = (u) => {
  try {
    const x = new URL(u)
    const host = x.hostname.replace(/^(?:www|m)\./, '')
    return host === 'youtu.be' || (host === 'youtube.com' && x.pathname === '/watch')
  } catch { return false }
}
const seconds = (t) => t.split(':').reduce((a, n) => a * 60 + Number(n), 0)
const cells = (row) => row.split('|').slice(1, -1).map((c) => c.trim())

// A citation is a known title, or a known title, " at " and a time (m:ss or
// h:mm:ss). Titles hold "at", digits and symbols of their own, so the part is
// matched against the known titles, longest first, and never by a loose
// pattern. Returns [title, time or null], or null when no known title fits.
const TIME_RE = /^\d{1,2}(?::\d{2}){1,2}$/
const byLength = (titles) => [...titles].sort((a, b) => b.length - a.length || (a < b ? -1 : 1))
export function matchCite(part, order) {
  for (const t of order) {
    if (part === t) return [t, null]
    if (part.startsWith(t + ' at ') && TIME_RE.test(part.slice(t.length + 4))) return [t, part.slice(t.length + 4)]
  }
  return null
}

// The pieces and the silent topics, from the skill's own files. Returns null
// when sources.md cannot be read or lists nothing. Every table in sources.md is
// read by position: cell 0 is the title and cell 1 its URL, whatever follows.
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
  return { titles, order: byLength(titles.keys()), silent }
}

// ---- Shared helpers ---------------------------------------------------------

const isComment = (l) => /^<!--.*-->$/.test(l.trim())
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const wordCount = (s) => s.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length
const quotesIn = (s) => [...s.matchAll(/"([^"\n]+)"/g)].map((m) => m[1])
// Quoted spans and backticked spans are someone's exact words. They are not
// judged as the reply's own wording.
const bare = (s) => s.replace(/"[^"\n]*"/g, ' ').replace(/`[^`\n]*`/g, ' ')
// A sentence ends at . ! or ? before a capital, a quote, a backtick or a
// bracket, but never inside a citation: a title can hold a "?" or a ".".
const sentences = (s) => {
  const out = []
  let depth = 0
  let start = 0
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '(') depth++
    else if (ch === ')') depth = Math.max(0, depth - 1)
    else if (depth === 0 && (ch === '.' || ch === '!' || ch === '?')) {
      const m = s.slice(i + 1).match(/^\s+(?=[A-Z"`(\[])/)
      if (m) { out.push(s.slice(start, i + 1)); start = i + 1 + m[0].length; i = start - 1 }
    }
  }
  out.push(s.slice(start))
  return out.map((x) => x.trim()).filter(Boolean)
}
const HEDGE_RE = new RegExp(`\\b(${HEDGES.map(esc).join('|')})\\b`, 'gi')
const SPEC_RE = /\b(?:Gary|Vaynerchuk|GaryVee|[Hh]e)\s+(?:would|wouldn't|would not)\b|\b[Hh]e'd\b|\bGary'd\b/
const HIS_RE = /\bGary\b|\bVaynerchuk\b|\bGaryVee\b|\b[Hh]e\b|\b[Hh]is\b|\b[Hh]im\b/
const SILENT_RE = /\b(?:has|had|have) not (?:written|published|said|covered|addressed|described)\b|\b(?:never|nowhere) (?:wrote|written|published|writes|says|covers)\b|\bdoes not (?:cover|say|address|mention|write|describe|give)\b|\b(?:is|are|stays) silent\b|\bnot in (?:his videos|his articles|the corpus|the videos read|the articles read|the pieces read)\b|\bno (?:piece|article|video|line)(?: of his)? (?:covers|says|addresses|mentions|describes)\b/i
const TURN_RE = /\b(?:but|however|though|although|yet)\b/i
const LABEL_RE = new RegExp(`^(${LABELS.join('|')}):\\s*`)
const LAST_RE = new RegExp('^' + esc(LAST))
const YEAR_RE = /\b(?:200[6-9]|201\d|202\d)\b/
const PLATFORM_RES = PLATFORMS.map((p) => [p, new RegExp(`(?<![A-Za-z0-9])${esc(p)}(?![A-Za-z0-9])`, PLATFORMS_EXACT.has(p) ? '' : 'i')])
const platformIn = (s) => { const hit = PLATFORM_RES.find(([, re]) => re.test(s)); return hit ? hit[0] : null }

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

// The pieces a stretch of text cites: (Title) or (Title at 4:10; Title).
function citesIn(s, order, untimed) {
  const out = []
  for (const m of s.matchAll(/\(([^()]+)\)/g)) {
    for (const part of m[1].split(';').map((p) => p.trim())) {
      const hit = matchCite(part, order)
      if (!hit) continue
      out.push(hit[0])
      if (!hit[1] && untimed) untimed.push(hit[0])
    }
  }
  return out
}

// The text with its citations taken out. A title can name him, hold a hedge
// word or a platform or a year; none of that is the reply's own wording.
const stripCites = (s, order) => s.replace(/\(([^()]+)\)/g, (all, inner) => (inner.split(';').every((p) => matchCite(p.trim(), order)) ? ' ' : all))

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
  const order = byLength(new Set([...corpus.titles.keys(), ...sources.map((s) => s.title)]))

  const [fn, fl] = rows[0]
  // A Yours: line is the installer's own position from references/pov.md. It
  // is theirs, so it is never judged as a claim about him.
  const isBody = (l) => !/^Source:/.test(l) && !LAST_RE.test(l) && !/^Yours:/.test(l)
  const answer = []
  for (const [n, l] of rows) { if (!isBody(l) || LABEL_RE.test(l) || /^#/.test(l)) break; answer.push([n, l]) }
  if (!answer.length) add('no-answer', fn, `the reply opens with "${fl.slice(0, 40)}"; the answer comes first, in two or three sentences`)

  const [ln, ll] = rows[rows.length - 1]
  const last = ll.match(new RegExp(`^${esc(LAST)}\\s*(\\S.*)$`))
  const early = rows.find(([n, l]) => LAST_RE.test(l) && n !== ln)
  if (!last) add('no-silent-line', ln, early ? `"${LAST}" is on line ${early[0]} and is not the last line` : `the last line is not "${LAST} <what the corpus does not cover here>"`)
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
    const untimed = []
    const cs = citesIn(s, order, untimed)
    for (const t of cs) if (!cited.has(t)) cited.set(t, n)
    for (const t of new Set(untimed)) if (isVideo(corpus.titles.get(t))) add('no-timestamp', n, `(${t}) is a video and the citation gives no time; write (${t} at <m:ss>) from the theme file's line`)
    const outside = stripCites(s, order)
    const plain = bare(outside)
    const silentStmt = SILENT_RE.test(plain) && !TURN_RE.test(plain)
    const his = labelled || HIS_RE.test(plain)
    if (!cs.length) {
      if (qs.some((q) => wordCount(q) >= QUOTE_MIN)) add('unsourced-quote', n, `"${qs.find((q) => wordCount(q) >= QUOTE_MIN).split(/\s+/).slice(0, 5).join(' ')} ..." is quoted and the sentence names no piece; add (Title), or put the user's own words in backticks`)
      else if (his && !silentStmt && !absenceLine) add('unsourced-claim', n, `"${s.slice(0, 60)}${s.length > 60 ? ' ...' : ''}" is marked as his and cites no piece; add (Title), or move it to ${LAST}`)
    } else if (his && !silentStmt) {
      for (const t of corpus.silent) {
        const w = t.words.find((x) => new RegExp(`\\b${esc(x)}\\b`, 'i').test(plain))
        if (w) { add('silent-topic', n, `"${w}" is under "${t.topic}" in references/silent.md, and this sentence gives him a position on it; read the cited line again`); break }
      }
    }
    // His platform advice and predictions belong to a year. His quoted words
    // count here; the user's backticked words do not.
    if (his && !silentStmt && !absenceLine) {
      const named = platformIn(outside.replace(/`[^`\n]*`/g, ' '))
      if (named && !YEAR_RE.test(outside.replace(/`[^`\n]*`/g, ' '))) add('undated-call', n, `"${s.slice(0, 60)}${s.length > 60 ? ' ...' : ''}" names ${named} and gives no year; his platform advice and predictions change by year, so put the year in the sentence (in 2016, in a 2024 talk)`)
    }
  }

  for (const [n, l] of rows) {
    if (/^Source:/.test(l) || /^Yours:/.test(l)) continue
    const plain = bare(stripCites(l, order))
    const hedges = [...new Set([...plain.matchAll(HEDGE_RE)].map((m) => m[1].toLowerCase()))]
    if (hedges.length) add('hedge', n, `"${hedges.join('", "')}"; say what the piece says, or say it is not in the corpus`)
    if (SPEC_RE.test(plain)) add('speculation', n, `"${plain.match(SPEC_RE)[0]}"; report what he said or wrote and where, never what he would do`)
    if (LAST_RE.test(l)) {
      // The absence line states what is missing. It is judged as a claim only
      // when it turns ("pricing, but he prefers ...").
      const rest = l.replace(new RegExp(`^${esc(LAST)}\\s*`), '')
      if (TURN_RE.test(bare(stripCites(rest, order)))) for (const s of sentences(rest)) unit(n, s, false, false)
      else unit(n, rest, false, true)
      continue
    }
    if (/^#/.test(l)) continue
    const lab = l.match(LABEL_RE)
    if (lab) { unit(n, l.slice(lab[0].length), true, false); continue }
    for (const s of sentences(l.replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))) unit(n, s, false, false)
  }

  if (!sources.length) add('no-source', ln, 'no line starts with "Source:"; a silent answer still cites His channel or His site, the lists that show what was read')
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
        const hit = matchCite(pm[1].trim(), corpus.order)
        if (!hit) { faults.push(`line ${i + 1}: "${pm[1].trim()}" is not in sources.md`); continue }
        const [title, time] = hit
        if (cleanUrl(pm[2]) !== corpus.titles.get(title)) faults.push(`line ${i + 1}: "${title}" has the wrong URL`)
        if (isVideo(pm[2])) {
          const tm = pm[2].match(/[?&]t=(\d+)s?$/)
          if (!time || !tm) faults.push(`line ${i + 1}: "${title}" is a video cited with no time`)
          else if (seconds(time) !== Number(tm[1])) faults.push(`line ${i + 1}: "${title} at ${time}" links to second ${tm[1]}`)
        }
      }
    }
    cites += found
    if (everyBullet && /^- /.test(l) && !/^- How to report it:/.test(l) && !found) faults.push(`line ${i + 1}: a claim with no (Title, URL)`)
  })
  return { faults, cites }
}

const u0Check = (corpus) => [...corpus.titles.values()][0]

function selfTest() {
  let failed = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const corpus = readCorpus()
  say(!!corpus, 'references/sources.md has a table of pieces with URLs')
  if (!corpus) { console.log('\nself-test failed: 1'); return 1 }
  say(corpus.titles.size >= MIN_TITLES, `sources.md lists ${corpus.titles.size} pieces (${MIN_TITLES} at least)`)
  say(isVideo(u0Check(corpus)), 'the first row of sources.md is a video, so the inline cases test a timed citation')
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
  say(claims >= 600, `the theme files hold ${claims} citations`)

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
  if (!pairs.length) say(false, 'no teaching pairs yet: teaching/ holds no folder with a bad and a good file, and the gate is not proven until it does')
  else say(pairs.length >= 10, `teaching/ holds ${pairs.length} pairs (ten at least)`)
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
  const c0 = isVideo(u0) ? `${t0} at 1:00` : t0
  const src = `Source: ${t0}, ${u0}`
  const end = `${LAST} a number for this.`
  const topic = corpus.silent[0]?.words[0] || 'pricing'
  const inline = [
    ['long-answer', reply(`One thing is stated (${c0}). Two things are stated (${c0}). Three (${c0}). Four (${c0}).`, src, end)],
    ['unused-source', reply('The corpus has one line on this.', src, end)],
    ['too-many-quotes', reply(`The piece says "one two three four", then "five six seven eight", then "nine ten eleven twelve" (${c0}).`, src, end)],
    ['nothing-left-out', reply(`One thing is stated (${c0}).`, src, `${LAST} nothing.`)],
    ['silent-topic', reply(`His view of ${topic} is that it comes last (${c0}).`, src, end)],
    ['unsourced-claim', reply(`One thing is stated (${c0}).`, src, `${LAST} a number, but he prefers short ones.`)],
    ['wrong-url', reply(`One thing is stated (${c0}).`, `Source: ${t0}`, end)],
    ['no-silent-line', reply(`One thing is stated (${c0}).`, `${LAST} a number.`, src)],
    ['no-timestamp', reply(`One thing is stated (${t0}).`, src, end)],
    ['undated-call', reply(`He tells people to post on TikTok every day (${c0}).`, src, end)],
  ]
  for (const [line, got] of inline) say(got.includes(line), `an inline case raises ${line}:`)
  const clean = reply(`One thing is stated (${c0}).`, src, end)
  say(!clean.length, `the smallest correct reply raises nothing${clean.length ? ` (got ${clean.join(', ')})` : ''}`)
  const quiet = reply(`He has not written about ${topic}. The index lists the pieces he has published (${c0}).`, src, `${LAST} ${topic}.`)
  say(!quiet.length, `a plain statement of silence raises nothing${quiet.length ? ` (got ${quiet.join(', ')})` : ''}`)
  const dated = reply(`He started Wine Library TV on YouTube in 2006 (${c0}).`, src, end)
  say(!dated.length, `a platform named with its year raises nothing${dated.length ? ` (got ${dated.join(', ')})` : ''}`)

  // Titles are matched against the list: a title with "at", digits and symbols
  // is found whole, and a page that is not a video needs no time.
  const hard = [...corpus.titles.entries()].find(([t, u]) => isVideo(u) && / at /.test(t) && /\d/.test(t))
  if (hard) {
    const [t, u] = hard
    const ok = reply(`One thing is stated (${t} at 12:05).`, `Source: ${t}, ${u}`, end)
    say(!ok.length, `a video whose title holds " at " and digits is matched whole${ok.length ? ` (got ${ok.join(', ')})` : ''}`)
    const bad = reply(`One thing is stated (${t}).`, `Source: ${t}, ${u}`, end)
    say(bad.length === 1 && bad[0] === 'no-timestamp', `the same video cited with no time raises no-timestamp${bad.length ? ` (got ${bad.join(', ')})` : ''}`)
  } else say(false, 'sources.md holds a video whose title has " at " and a digit, to test the title match on')
  const symbols = [...corpus.titles.entries()].find(([t, u]) => isVideo(u) && /[$#&'?:]/.test(t))
  if (symbols) {
    const ok = reply(`One thing is stated (${symbols[0]} at 3:07).`, `Source: ${symbols[0]}, ${symbols[1]}`, end)
    say(!ok.length, `a video title with a symbol in it is matched whole${ok.length ? ` (got ${ok.join(', ')})` : ''}`)
  }
  const article = [...corpus.titles.entries()].find(([, u]) => !isVideo(u) && /^https?:\/\/(?:www\.)?garyvaynerchuk\.com\/./.test(u))
  if (article) {
    const ok = reply(`One thing is stated (${article[0]}).`, `Source: ${article[0]}, ${article[1]}`, end)
    say(!ok.length, `an article cited as (Title), with no time, raises nothing${ok.length ? ` (got ${ok.join(', ')})` : ''}`)
  } else say(false, 'sources.md holds an article on garyvaynerchuk.com to test an untimed citation on')

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
