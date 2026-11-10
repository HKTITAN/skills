#!/usr/bin/env node
// content-check: the gate for khe-content-engine.
//
// It reads two kinds of thing and names every fault it can prove as a line.
//
//   An engine   a folder of markdown nodes. Each node opens with frontmatter
//               that carries "node: <type>". Nodes point at each other with
//               double-bracket links.
//   A run       one markdown file that starts "# Run: <idea>", names its
//               engine, carries the brief, and holds one "## Draft: <platform>"
//               section per platform with the draft in a fenced block.
//
// The banned words and phrases are read from ../references/tells.md, so the
// list lives in one place.
//
//   node scripts/content-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]
//
// Zero dependencies. Node 20 or newer.

import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(HERE, '..')
const GATE_NAME = 'content-check'

const REQUIRED = ['index', 'voice', 'audience', 'hooks', 'repurpose', 'content-types', 'cadence']
const SAMPLES_MIN = 3 // sourced samples in the voice node
const SAMPLE_WORDS_MIN = 60 // words across all samples before the voice is called thin
const NEVER_SAY_MIN = 5 // entries in the voice node's never-say list
const SHARE_MAX = 0.2 // share of the shorter draft's sentences that two drafts may have in common
const SENTENCE_MIN = 4 // words before a sentence counts toward that share
const QUOTE_MIN = 3 // words in quotation marks before they are treated as a quotation
const STALE_DAYS = 180 // age of a "Facts checked:" date before it is reported
const BRIEF_WORDS_MIN = 40
const MARK = '[confirm]'
const DASH = String.fromCharCode(0x2014)

// Every line the gate can print. "never" lines fail the gate. "candidate"
// lines are reported for judgment and fail only under --strict.
export const LINES = {
  // an engine
  'missing-node': ['never', 'A required node is absent: index, voice, audience, hooks, repurpose, content-types, cadence, or at least one platform'],
  'untyped-node': ['never', 'A markdown file in the engine with no "node:" line in its frontmatter'],
  'broken-link': ['never', 'A double-bracket link that points at no node in the engine'],
  'orphan-node': ['never', 'A node that no other node links to'],
  'voice-no-samples': ['never', `The voice node has fewer than ${SAMPLES_MIN} quoted samples, or a sample with no Source: line`],
  'voice-no-never-say': ['never', `The voice node has no "Never say" list of at least ${NEVER_SAY_MIN} entries`],
  'audience-no-segment': ['never', 'The audience node has no "## Segment:" section'],
  'platform-no-limit': ['never', 'A platform node with no "Limit: <number> characters|words" line'],
  'platform-no-dated-facts': ['never', 'A platform node with no "Facts checked: YYYY-MM-DD" line'],
  placeholder: ['never', 'Template text left in a node: a bracketed blank, TODO, TBD or filler text'],
  // a run
  'no-engine': ['never', 'The run has no "Engine:" line'],
  'no-brief': ['never', 'The run has no "## Brief" section, so no number or quotation can be traced'],
  'unknown-platform': ['never', 'A platform the run asks for that has no platform node in the engine'],
  'missing-draft': ['never', 'A platform the run asks for with no "## Draft:" section, or a section with no fenced draft'],
  'no-treatment': ['never', 'A draft with no "Treatment:" line'],
  'same-treatment': ['never', 'Two drafts with the same Treatment line'],
  'draft-no-nodes': ['never', 'A draft with no "Nodes:" line, or one that leaves out the voice node or its own platform node'],
  'unknown-node': ['never', 'A draft that names a node the engine does not have'],
  'over-limit': ['never', "A draft, or one part of it, longer than its platform node's Limit, or with more parts than Max parts"],
  pasted: ['never', `Two drafts that share more than ${SHARE_MAX * 100}% of the shorter one's sentences`],
  'same-hook': ['never', 'Two drafts that open with the same first line'],
  tell: ['never', 'A word, phrase or pattern from references/tells.md in a draft'],
  'never-say': ['never', "A phrase from the voice node's Never say list in a draft"],
  'unmarked-number': ['never', `A number in a draft that is not in the brief and is not followed by ${MARK}`],
  'unmarked-quote': ['never', `Words in quotation marks that are not in the brief and are not followed by ${MARK}`],
  'no-unverified': ['never', 'The last line is not "Not verified: <what nobody checked>"'],
  // candidates
  'index-misses-node': ['candidate', 'A node the index does not link'],
  'repurpose-misses-platform': ['candidate', 'A platform node the repurpose node does not link'],
  'trait-no-sample': ['candidate', 'A trait in the voice node that points at no sample'],
  'thin-samples': ['candidate', `Fewer than ${SAMPLE_WORDS_MIN} words of samples in the voice node`],
  'stale-facts': ['candidate', `A "Facts checked:" date more than ${STALE_DAYS} days old`],
  'confirm-open': ['candidate', `A ${MARK} mark still in a draft; a person settles it before posting`],
  'skipped-platform': ['candidate', 'A platform the run asked for and skipped, with its reason'],
  'hook-not-in-node': ['candidate', 'A "Hook:" line that names no hook type in the hooks node'],
  'extra-draft': ['candidate', 'A draft for a platform the run did not ask for'],
  'thin-brief': ['candidate', `A brief under ${BRIEF_WORDS_MIN} words`],
}

// Patterns the gate bans beside the word list. Each is described in references/tells.md.
const PATTERNS = [
  ['an em dash', new RegExp(DASH)],
  ['the "not just X, but Y" turn', /\bnot (?:just|only|merely|simply)\b[^.!?\n]{0,80}?\b(?:but|it['\u2019]s|it is)\b/i],
  ['the "it is not X. It is Y." turn', /\b(?:it|this|that)(?:['\u2019]s not| is not| isn['\u2019]t| was not| wasn['\u2019]t)\b[^.!?\n]{1,60}[.!?,;]\s+(?:it|this|that)(?:['\u2019]s| is| was)\b/i],
  ['a question the writer answers at once', /\b(?:the|my|our|your) (?:result|best part|catch|kicker|problem|solution|truth|secret|lesson|takeaway|answer|reason|difference|twist)\?(?:\s|$)/i],
  ['the "No X. No Y. Just Z." run', /\bno [^.!?\n]{1,40}[.!?]\s+no [^.!?\n]{1,40}[.!?]\s+(?:no|just)\b/i],
]

const HELP = `content-check: the gate for khe-content-engine

Usage:
  node scripts/content-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--self-test] [--help]

What it reads:
  an engine   a folder with an index.md whose frontmatter says "node: index"
  a run       a .md file that starts "# Run:"; its "Engine:" line is a path from the run file to the engine
  a node      one .md file with "node:" in its frontmatter, checked alone (links are not resolved, so the result is inconclusive)
  A folder that is not an engine is walked. scripts/ and references/ are skipped.

Flags:
  --gate        end with "${GATE_NAME} passed" and exit 0 only when every never-intentional line is at 0;
                exit 1 with the counts otherwise; exit 2 with "inconclusive" when it could not look
  --strict      candidate lines fail too
  --report f    write { status, exitCode, files, findings, notChecked } as JSON
  --self-test   prove the gate on examples/, teaching/ and on broken copies of the gold engine
  --help        this text

Every finding prints as  <line-name>: <what and where> (<file>:<line>)

Never intentional (the gate fails on any):
${Object.entries(LINES).filter(([, v]) => v[0] === 'never').map(([k, v]) => `  ${(k + ':').padEnd(26)} ${v[1]}`).join('\n')}

Candidates (reported for judgment):
${Object.entries(LINES).filter(([, v]) => v[0] === 'candidate').map(([k, v]) => `  ${(k + ':').padEnd(26)} ${v[1]}`).join('\n')}

How length is counted:
  characters  Unicode code points of the draft, or of each part when the Limit says "per part"
  words       runs of non-space text
  parts       a line that holds only --- inside the fenced draft starts a new part

Not checked (a script cannot):
  whether a draft sounds like the samples, whether the hook is paid off by the body,
  whether two drafts differ in angle or only in wording, whether a number in the brief is true,
  whether a platform fact is still current, how a platform weights links, emoji or scripts when it counts,
  numbers written as words, and whether anything was posted. It never posts.

passing is necessary, not sufficient`

// ---------------------------------------------------------------- reading

const read = (p) => readFileSync(p, 'utf8').replace(/\r\n/g, '\n')
const show = (p) => (relative(process.cwd(), p) || p).replace(/\\/g, '/')
const isDir = (p) => existsSync(p) && statSync(p).isDirectory()
const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const words = (s) => s.split(/\s+/).filter(Boolean)
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)
  const fields = {}
  if (!m) return { fields, offset: 0 }
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (kv) fields[kv[1].toLowerCase()] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return { fields, offset: m[0].split('\n').length - 1 }
}

// Blank out fenced blocks and code spans, keeping every line in place.
function stripCode(text) {
  let fenced = false
  return text.split('\n').map((line) => {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; return '' }
    if (fenced) return ''
    return line.replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length))
  }).join('\n')
}

function wikilinks(text) {
  const out = []
  text.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/\[\[([^\]|#\n]+)(?:#[^\]|\n]*)?(?:\|[^\]\n]*)?\]\]/g)) {
      out.push({ target: basename(m[1].trim().replace(/\\/g, '/')).replace(/\.md$/i, '').toLowerCase(), lineNumber: i + 1 })
    }
  })
  return out
}

// The lines under a heading, up to the next heading at its level or above.
function section(text, titleRe) {
  const lines = text.split('\n')
  let fenced = false
  let level = 0
  const out = []
  let start = 0
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) fenced = !fenced
    const h = !fenced && lines[i].match(/^(#{1,6})\s+(.*?)\s*#*$/)
    if (h && level && h[1].length <= level) break
    if (h && !level && titleRe.test(h[2])) { level = h[1].length; start = i + 1; continue }
    if (level) out.push({ text: lines[i], lineNumber: i + 1 })
  }
  return level ? { lines: out, lineNumber: start } : null
}

function headings(text, level) {
  const out = []
  let fenced = false
  text.split('\n').forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    const h = !fenced && line.match(/^(#{1,6})\s+(.*?)\s*#*$/)
    if (h && h[1].length === level) out.push({ title: h[2], lineNumber: i + 1 })
  })
  return out
}

function walk(dir, skip = () => false) {
  return readdirSync(dir).sort().flatMap((f) => {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) return skip(f) ? [] : walk(p, skip)
    return [p]
  })
}

function readTells(notChecked) {
  const p = join(SKILL_DIR, 'references', 'tells.md')
  if (!existsSync(p)) { notChecked?.push('references/tells.md: not found, so no tell can be checked'); return null }
  const block = read(p).match(/## The gate's list[\s\S]*?```[a-z]*\n([\s\S]*?)\n```/)
  if (!block) { notChecked?.push("references/tells.md: no fenced list under \"The gate's list\", so no tell can be checked"); return null }
  return block[1].split('\n').map((l) => l.trim().toLowerCase()).filter(Boolean)
}

const phraseRe = (phrase) => new RegExp(`(?<![\\p{L}\\p{N}])${esc(phrase).replace(/ /g, '\\s+').replace(/'/g, "['\u2019]")}(?![\\p{L}\\p{N}])`, 'iu')

// ---------------------------------------------------------------- an engine

function loadEngine(dir) {
  const files = walk(dir, (d) => d === 'runs' || d === 'ideas' || d.startsWith('.')).filter((f) => extname(f).toLowerCase() === '.md')
  const nodes = files.map((path) => {
    const text = read(path)
    const { fields } = frontmatter(text)
    return { path, text, name: basename(path).replace(/\.md$/i, '').toLowerCase(), type: (fields.node || '').toLowerCase() }
  })
  return { dir, nodes, byName: new Map(nodes.map((n) => [n.name, n])) }
}

function isEngineDir(dir) {
  if (existsSync(join(dir, 'index.md'))) return true
  const types = new Set()
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (extname(f).toLowerCase() === '.md' && statSync(p).isFile()) {
      const t = frontmatter(read(p)).fields.node
      if (t) types.add(t.toLowerCase())
    }
  }
  return types.size >= 2
}

function neverSayList(voice) {
  const sec = section(voice.text, /^never say$/i)
  if (!sec) return []
  return sec.lines.filter((l) => /^\s*[-*]\s+\S/.test(l.text)).map((l) => {
    const item = l.text.replace(/^\s*[-*]\s+/, '')
    const marked = item.match(/^["\u201C`]([^"\u201D`]+)["\u201D`]/)
    return { phrase: (marked ? marked[1] : item.split(/\s*[:(]/)[0]).trim().toLowerCase(), lineNumber: l.lineNumber }
  }).filter((e) => e.phrase)
}

function platformSpec(node) {
  const limit = node.text.match(/^\s*(?:[-*]\s*)?Limit:\s*([\d,]+)\s*(characters|words)\b(.*)$/im)
  const maxParts = node.text.match(/^\s*(?:[-*]\s*)?Max parts:\s*(\d+)/im)
  const facts = node.text.match(/^\s*(?:[-*]\s*)?Facts checked:\s*(\d{4}-\d{2}-\d{2})\b/im)
  return {
    limit: limit ? Number(limit[1].replace(/,/g, '')) : null,
    unit: limit ? limit[2].toLowerCase() : null,
    perPart: limit ? /\bper part\b/i.test(limit[3]) : false,
    maxParts: maxParts ? Number(maxParts[1]) : null,
    facts: facts ? facts[1] : null,
  }
}

const PLACEHOLDERS = [/\[(?:your|my|the|a|an|insert|add|fill)\b[^\]\n]*\]/i, /\[[A-Z][A-Z0-9 /'&-]{4,}\]/, /\bTODO\b/, /\bTBD\b/, /lorem ipsum/i]

function checkNode(node, add) {
  const file = node.path
  const { offset } = frontmatter(node.text)
  stripCode(node.text).split('\n').forEach((line, i) => {
    if (i < offset) return
    const hit = PLACEHOLDERS.map((re) => line.match(re)).find(Boolean)
    if (hit) add('placeholder', file, i + 1, `"${hit[0]}" was never filled in`)
  })

  if (node.type === 'voice') {
    const sec = section(node.text, /^samples$/i)
    let samples = 0
    let sources = 0
    let sampleWords = 0
    let inQuote = false
    for (const l of sec ? sec.lines : []) {
      const quoted = /^\s*>/.test(l.text)
      if (quoted && !inQuote) samples++
      if (quoted) sampleWords += words(l.text.replace(/^\s*>\s?/, '')).length
      inQuote = quoted
      if (/^\s*(?:[-*]\s*)?Source:\s*\S/i.test(l.text)) sources++
    }
    const at = sec ? sec.lineNumber : 1
    if (samples < SAMPLES_MIN) add('voice-no-samples', file, at, `${samples} quoted sample${samples === 1 ? '' : 's'} under "Samples"; ${SAMPLES_MIN} are needed, each copied from something the person wrote`)
    else if (sources < samples) add('voice-no-samples', file, at, `${samples} samples and ${sources} Source: line${sources === 1 ? '' : 's'}; every sample says where it came from`)
    else if (sampleWords < SAMPLE_WORDS_MIN) add('thin-samples', file, at, `${sampleWords} words of samples; under ${SAMPLE_WORDS_MIN} is too little to hear a voice in`)
    const never = neverSayList(node)
    const neverSec = section(node.text, /^never say$/i)
    if (never.length < NEVER_SAY_MIN) add('voice-no-never-say', file, neverSec ? neverSec.lineNumber : 1, `${never.length} entr${never.length === 1 ? 'y' : 'ies'} under "Never say"; ${NEVER_SAY_MIN} are needed`)
    const traits = section(node.text, /^traits$/i)
    for (const l of traits ? traits.lines : []) {
      if (/^\s*[-*]\s+\S/.test(l.text) && !/\bsamples?\s+\d/i.test(l.text)) add('trait-no-sample', file, l.lineNumber, 'this trait points at no sample, so nobody can check it')
    }
  }

  if (node.type === 'platform') {
    const spec = platformSpec(node)
    if (spec.limit === null) add('platform-no-limit', file, 1, 'no "Limit: <number> characters" or "Limit: <number> words" line, so no draft can be measured')
    if (!spec.facts) add('platform-no-dated-facts', file, 1, 'no "Facts checked: YYYY-MM-DD" line, so nobody knows how old its facts are')
    else {
      const age = Math.floor((Date.now() - Date.parse(spec.facts)) / 86400000)
      if (age > STALE_DAYS) add('stale-facts', file, 1, `facts were checked on ${spec.facts}, ${age} days ago`)
    }
  }

  if (node.type === 'audience' && !headings(node.text, 2).some((h) => /^segment:\s*\S/i.test(h.title))) {
    add('audience-no-segment', file, 1, 'no "## Segment: <name>" section; an audience is at least one named group')
  }
}

function checkEngine(dir, add) {
  const engine = loadEngine(dir)
  const indexPath = join(dir, 'index.md')
  for (const n of engine.nodes) if (!n.type) add('untyped-node', n.path, 1, 'no "node:" line in the frontmatter, so nothing knows what this file is')
  for (const t of REQUIRED) if (!engine.nodes.some((n) => n.type === t)) add('missing-node', indexPath, 1, `no node of type "${t}"`)
  const platforms = engine.nodes.filter((n) => n.type === 'platform')
  if (!platforms.length) add('missing-node', indexPath, 1, 'no node of type "platform"; an engine writes for at least one')

  const inbound = new Map(engine.nodes.map((n) => [n.name, 0]))
  const linksOf = new Map()
  for (const n of engine.nodes) {
    const links = wikilinks(stripCode(n.text))
    linksOf.set(n.name, new Set(links.map((l) => l.target)))
    for (const l of links) {
      if (!engine.byName.has(l.target)) add('broken-link', n.path, l.lineNumber, `the link to "${l.target}" points at no node`)
      else if (l.target !== n.name) inbound.set(l.target, inbound.get(l.target) + 1)
    }
  }
  for (const n of engine.nodes) {
    if (n.type !== 'index' && inbound.get(n.name) === 0) add('orphan-node', n.path, 1, 'no other node links here, so a run that starts at the index never reads it')
    checkNode(n, add)
  }
  const index = engine.nodes.find((n) => n.type === 'index')
  const repurpose = engine.nodes.find((n) => n.type === 'repurpose')
  for (const n of engine.nodes) {
    if (index && n !== index && !linksOf.get(index.name).has(n.name)) add('index-misses-node', index.path, 1, `the index does not link "${n.name}"`)
  }
  for (const p of platforms) {
    if (repurpose && !linksOf.get(repurpose.name).has(p.name)) add('repurpose-misses-platform', repurpose.path, 1, `no treatment is written for "${p.name}"`)
  }
  return engine
}

// ---------------------------------------------------------------- a run

function parseRun(text) {
  const lines = text.split('\n')
  const run = { fields: {}, sections: [], lastLine: null }
  let fenced = false
  let current = null
  lines.forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced
    const h = !fenced && line.match(/^##\s+(.*?)\s*#*$/)
    if (h) { current = { title: h[1], lineNumber: i + 1, lines: [] }; run.sections.push(current); return }
    if (current) current.lines.push({ text: line, lineNumber: i + 1 })
    else {
      const f = line.match(/^\s*(?:[-*]\s*)?(Engine|Idea|Platforms|Skipped):\s*(.*)$/i)
      if (f) run.fields[f[1].toLowerCase()] = { value: f[2].trim(), lineNumber: i + 1 }
    }
    if (line.trim()) run.lastLine = { text: line.trim(), lineNumber: i + 1 }
  })
  return run
}

function parseDraft(sec) {
  const draft = { platform: sec.title.replace(/^draft:\s*/i, '').trim().toLowerCase(), lineNumber: sec.lineNumber, fields: {}, body: null }
  let fenced = false
  for (const l of sec.lines) {
    if (/^\s*(```|~~~)/.test(l.text)) {
      if (!fenced && draft.body) break
      fenced = !fenced
      if (fenced) draft.body = []
      continue
    }
    if (fenced) { draft.body.push(l); continue }
    const f = !draft.body && l.text.match(/^\s*(?:[-*]\s*)?(Treatment|Hook|Segment|Type|Nodes):\s*(.*)$/i)
    if (f) draft.fields[f[1].toLowerCase()] = { value: f[2].trim(), lineNumber: l.lineNumber }
  }
  return draft
}

function parts(body) {
  const out = [[]]
  for (const l of body) {
    if (l.text.trim() === '---') out.push([])
    else out[out.length - 1].push(l)
  }
  return out.filter((p) => p.some((l) => l.text.trim()))
}

function sentences(body) {
  const text = body.filter((l) => l.text.trim() !== '---').map((l) => l.text).join('\n')
  return new Set(text.split(/(?<=[.!?])\s+|\n+/).map(norm).filter((s) => words(s).length >= SENTENCE_MIN))
}

function checkRun(file, add, notChecked, tells) {
  const text = read(file)
  const run = parseRun(text)
  const last = run.lastLine
  if (!last || !/^Not verified:\s*\S/.test(last.text)) add('no-unverified', file, last ? last.lineNumber : 1, 'the last line must say what nobody checked')

  const briefSec = run.sections.find((s) => /^brief$/i.test(s.title))
  const briefText = briefSec ? [run.fields.idea?.value || '', ...briefSec.lines.map((l) => l.text)].join('\n') : ''
  if (!briefSec) add('no-brief', file, 1, 'there is nothing to trace a number or a quotation back to')
  else if (words(briefText).length < BRIEF_WORDS_MIN) add('thin-brief', file, briefSec.lineNumber, `${words(briefText).length} words; a brief this short gives a draft little that is true to say`)
  const briefNumbers = new Set([...briefText.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => m[0].replace(/,/g, '')))
  const briefNorm = ` ${norm(briefText)} `

  const drafts = run.sections.filter((s) => /^draft:/i.test(s.title)).map(parseDraft)
  const asked = (run.fields.platforms?.value || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const skipped = new Map([...(run.fields.skipped?.value || '').matchAll(/([a-z0-9-]+)\s*\(([^)]+)\)/gi)].map((m) => [m[1].toLowerCase(), m[2]]))
  if (!asked.length) add('missing-draft', file, 1, 'no "Platforms:" line, so nothing says which drafts were asked for')
  for (const p of asked) {
    if (skipped.has(p)) add('skipped-platform', file, run.fields.skipped.lineNumber, `${p} was skipped: ${skipped.get(p)}`)
    else if (!drafts.some((d) => d.platform === p)) add('missing-draft', file, run.fields.platforms.lineNumber, `${p} was asked for and has no "## Draft: ${p}" section`)
  }
  for (const d of drafts) if (asked.length && !asked.includes(d.platform)) add('extra-draft', file, d.lineNumber, `nobody asked for a ${d.platform} draft`)

  // The engine. Without it, limits, node names and the never-say list cannot be looked at.
  let engine = null
  if (!run.fields.engine || !run.fields.engine.value) add('no-engine', file, 1, 'no "Engine:" line, so the drafts point at no nodes')
  else {
    const dir = resolve(dirname(file), run.fields.engine.value)
    if (isDir(dir)) engine = loadEngine(dir)
    else notChecked.push(`${show(file)}: the engine at "${run.fields.engine.value}" was not found, so limits, node names and the never-say list were not checked`)
  }
  const voice = engine?.nodes.find((n) => n.type === 'voice')
  const hooks = engine?.nodes.find((n) => n.type === 'hooks')
  const neverSay = voice ? neverSayList(voice) : []
  const hookTypes = hooks ? headings(hooks.text, 2).map((h) => norm(h.title)) : []

  for (const d of drafts) {
    const who = `the ${d.platform} draft`
    const node = engine?.nodes.find((n) => n.type === 'platform' && n.name === d.platform)
    if (engine && !node) add('unknown-platform', file, d.lineNumber, `the engine has no platform node named "${d.platform}"`)
    if (!d.fields.treatment || !d.fields.treatment.value) add('no-treatment', file, d.lineNumber, `${who} does not say how it treats the idea`)

    if (!d.fields.nodes || !d.fields.nodes.value) add('draft-no-nodes', file, d.lineNumber, `${who} names no nodes, so a wrong line cannot be traced to its cause`)
    else {
      const named = wikilinks(d.fields.nodes.value).map((l) => l.target)
      if (!named.length) add('draft-no-nodes', file, d.fields.nodes.lineNumber, `${who} has a Nodes line with no links in it`)
      if (engine && named.length) {
        for (const n of named) if (!engine.byName.has(n)) add('unknown-node', file, d.fields.nodes.lineNumber, `${who} names "${n}", which the engine does not have`)
        if (voice && !named.includes(voice.name)) add('draft-no-nodes', file, d.fields.nodes.lineNumber, `${who} does not name the voice node`)
        if (node && !named.includes(node.name)) add('draft-no-nodes', file, d.fields.nodes.lineNumber, `${who} does not name its own platform node`)
      }
    }

    if (d.fields.hook && hooks) {
      const hook = norm(d.fields.hook.value.replace(/\(.*$/, ''))
      if (hook && !hookTypes.some((t) => t === hook || t.includes(hook) || hook.includes(t))) add('hook-not-in-node', file, d.fields.hook.lineNumber, `"${d.fields.hook.value}" is not a hook type in the hooks node`)
    }

    if (!d.body || !d.body.some((l) => l.text.trim())) { add('missing-draft', file, d.lineNumber, `${who} has no fenced draft under its heading`); continue }

    // Length, from the platform node.
    if (node) {
      const spec = platformSpec(node)
      const ps = parts(d.body)
      const measure = (ls) => {
        const t = ls.map((l) => l.text).join('\n').trim()
        return spec.unit === 'words' ? words(t).length : [...t].length
      }
      if (spec.limit !== null) {
        const units = spec.perPart ? ps : [d.body.filter((l) => l.text.trim() !== '---')]
        units.forEach((u, i) => {
          const n = measure(u)
          if (n > spec.limit) add('over-limit', file, u[0]?.lineNumber || d.lineNumber, `${who}${spec.perPart ? `, part ${i + 1},` : ''} is ${n} ${spec.unit}; the ${d.platform} node allows ${spec.limit}`)
        })
      }
      if (spec.maxParts !== null && ps.length > spec.maxParts) add('over-limit', file, d.lineNumber, `${who} has ${ps.length} parts; the ${d.platform} node allows ${spec.maxParts}`)
    }

    // Words, phrases and patterns, over the whole draft so a pattern can cross a line.
    const bodyText = d.body.map((l) => l.text).join('\n')
    const lineAt = (index) => d.body[bodyText.slice(0, index).split('\n').length - 1].lineNumber
    for (const [name, re] of PATTERNS) {
      const m = bodyText.match(re)
      if (m) add('tell', file, lineAt(m.index), `${name} in ${who}`)
    }
    for (const phrase of tells || []) {
      const m = bodyText.match(phraseRe(phrase))
      if (m) add('tell', file, lineAt(m.index), `"${phrase}" in ${who}`)
    }
    for (const e of neverSay) {
      const m = bodyText.match(phraseRe(e.phrase))
      if (m) add('never-say', file, lineAt(m.index), `"${e.phrase}" in ${who}; the voice node says this person never says it`)
    }

    // Numbers and quotations, line by line.
    for (const l of d.body) {
      const line = l.text.replace(/https?:\/\/\S+/g, (m) => ' '.repeat(m.length)).replace(/^(\s*)\d+(?:\/\d*|[.)])(?=\s|$)/, (m) => ' '.repeat(m.length))
      const markedAfter = (i) => line.indexOf(MARK, i) !== -1
      if (line.includes(MARK)) add('confirm-open', file, l.lineNumber, `${who} carries a ${MARK} mark; a person settles it before posting`)
      for (const m of line.matchAll(/\d[\d,]*(?:\.\d+)?/g)) {
        const n = m[0].replace(/,/g, '')
        if (briefSec && !briefNumbers.has(n) && !markedAfter(m.index)) add('unmarked-number', file, l.lineNumber, `${m[0]} in ${who} is not in the brief`)
      }
      for (const m of line.matchAll(/["\u201C]([^"\u201C\u201D\n]+)["\u201D]/g)) {
        if (words(m[1]).length < QUOTE_MIN) continue
        if (briefSec && !briefNorm.includes(` ${norm(m[1])} `) && !markedAfter(m.index)) add('unmarked-quote', file, l.lineNumber, `"${m[1].length > 48 ? m[1].slice(0, 45) + '...' : m[1]}" in ${who} is not in the brief`)
      }
    }
  }

  // Between drafts.
  const withBody = drafts.filter((d) => d.body && d.body.some((l) => l.text.trim()))
  for (let i = 0; i < drafts.length; i++) {
    for (let j = i + 1; j < drafts.length; j++) {
      const [a, b] = [drafts[i], drafts[j]]
      const [ta, tb] = [norm(a.fields.treatment?.value.replace(/\(.*$/, '') || ''), norm(b.fields.treatment?.value.replace(/\(.*$/, '') || '')]
      if (ta && ta === tb) add('same-treatment', file, b.fields.treatment.lineNumber, `the ${a.platform} and ${b.platform} drafts treat the idea the same way`)
    }
  }
  for (let i = 0; i < withBody.length; i++) {
    for (let j = i + 1; j < withBody.length; j++) {
      const [a, b] = [withBody[i], withBody[j]]
      const first = (d) => d.body.find((l) => l.text.trim())
      if (norm(first(a).text) && norm(first(a).text) === norm(first(b).text)) add('same-hook', file, first(b).lineNumber, `the ${a.platform} and ${b.platform} drafts open with the same line`)
      const [sa, sb] = [sentences(a.body), sentences(b.body)]
      const smaller = Math.min(sa.size, sb.size)
      const shared = [...sa].filter((s) => sb.has(s)).length
      if (smaller && shared / smaller > SHARE_MAX) add('pasted', file, b.lineNumber, `the ${a.platform} and ${b.platform} drafts share ${shared} of ${smaller} sentences (${Math.round((shared / smaller) * 100)}%); the most allowed is ${SHARE_MAX * 100}%`)
    }
  }
}

// ---------------------------------------------------------------- targets

const isRun = (text) => /^# Run:/m.test(stripCode(text))

function classify(path) {
  const text = read(path)
  if (isRun(text)) return 'run'
  if (frontmatter(text).fields.node) return 'node'
  return null
}

function collect(paths, notChecked) {
  const targets = []
  const visit = (dir) => {
    if (isEngineDir(dir)) { targets.push({ kind: 'engine', path: dir }); return }
    for (const f of readdirSync(dir).sort()) {
      const p = join(dir, f)
      if (statSync(p).isDirectory()) { if (!['scripts', 'references', 'node_modules'].includes(f) && !f.startsWith('.')) visit(p) } else if (extname(f).toLowerCase() === '.md') {
        const kind = classify(p)
        if (kind) targets.push({ kind, path: p })
      }
    }
  }
  for (const raw of paths) {
    const p = resolve(raw)
    if (!existsSync(p)) { notChecked.push(`${show(p)}: no such file or folder`); continue }
    if (statSync(p).isDirectory()) { visit(p); continue }
    const kind = extname(p).toLowerCase() === '.md' ? classify(p) : null
    if (kind) targets.push({ kind, path: p })
    else notChecked.push(`${show(p)}: neither a run (a .md that starts "# Run:") nor a node (a .md with "node:" in its frontmatter)`)
  }
  return targets
}

export function checkTarget(target, notChecked = [], tells = readTells()) {
  const findings = []
  const add = (line, file, lineNumber, detail) => findings.push({ line, file: show(file), lineNumber, detail, class: LINES[line][0] })
  if (target.kind === 'engine') checkEngine(target.path, add)
  else if (target.kind === 'run') checkRun(target.path, add, notChecked, tells)
  else {
    const text = read(target.path)
    checkNode({ path: target.path, text, name: basename(target.path).replace(/\.md$/i, '').toLowerCase(), type: (frontmatter(text).fields.node || '').toLowerCase() }, add)
    notChecked.push(`${show(target.path)}: one node checked alone; its links and its place in an engine were not looked at`)
  }
  return findings
}

const never = (fs) => fs.filter((f) => f.class === 'never')
const tally = (fs) => Object.entries(fs.reduce((a, f) => ({ ...a, [f.line]: (a[f.line] || 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(', ')

// ---------------------------------------------------------------- self-test

function selfTest() {
  let failed = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const lines = (fs) => [...new Set(never(fs).map((f) => f.line))].sort()
  const tells = readTells()
  say(Array.isArray(tells) && tells.length >= 20, `references/tells.md gives the gate a list (${tells ? tells.length : 0} entries)`)

  // 1. Every gold example passes.
  const examples = join(SKILL_DIR, 'examples')
  const gold = existsSync(examples) ? collect([examples], []) : []
  say(gold.some((t) => t.kind === 'engine'), 'examples/ holds a gold engine')
  say(gold.filter((t) => t.kind === 'run').length >= 3, `examples/ holds at least 3 gold runs (${gold.filter((t) => t.kind === 'run').length})`)
  for (const t of gold) {
    const nc = []
    const got = lines(checkTarget(t, nc, tells))
    say(got.length === 0 && nc.length === 0, `gold ${t.kind} ${show(t.path)} raises nothing${got.length ? `: ${got.join(', ')}` : ''}${nc.length ? `: ${nc.join('; ')}` : ''}`)
  }

  // 2. Every teaching pair: bad raises the line its folder is named for and no other; good raises none.
  const teaching = join(SKILL_DIR, 'teaching')
  const pairs = existsSync(teaching) ? readdirSync(teaching).filter((d) => isDir(join(teaching, d))).sort() : []
  say(pairs.length >= 8, `teaching/ holds at least 8 pairs (${pairs.length})`)
  for (const name of pairs) {
    say(name in LINES && LINES[name][0] === 'never', `teaching/${name} is named for a never-intentional line`)
    for (const half of ['bad', 'good']) {
      const p = join(teaching, name, `${half}.md`)
      if (!existsSync(p)) { say(false, `teaching/${name}/${half}.md exists`); continue }
      const kind = classify(p)
      if (!kind) { say(false, `teaching/${name}/${half}.md is a run or a node`); continue }
      const got = lines(checkTarget({ kind, path: p }, [], tells))
      if (half === 'bad') {
        say(got.length === 1 && got[0] === name, `teaching/${name}/bad.md raises ${name}: and nothing else${got.length === 1 && got[0] === name ? '' : ` (raised: ${got.join(', ') || 'nothing'})`}`)
        say(/^(?:---\n[\s\S]*?\n---\n)?\s*<!--\s*\S/.test(read(p)), `teaching/${name}/bad.md opens with a comment that names the fault`)
      } else say(got.length === 0, `teaching/${name}/good.md raises nothing${got.length ? ` (raised: ${got.join(', ')})` : ''}`)
    }
  }

  // 3. Lines with no pair, proven on broken copies of the gold engine and on the smallest run that raises each.
  const goldEngine = gold.find((t) => t.kind === 'engine')
  if (goldEngine) {
    const tmp = mkdtempSync(join(tmpdir(), 'content-check-'))
    try {
      const copy = (name) => { const d = join(tmp, name, 'engine'); mkdirSync(join(tmp, name), { recursive: true }); cpSync(goldEngine.path, d, { recursive: true }); return d }
      const raises = (dir, line) => lines(checkTarget({ kind: 'engine', path: dir }, [], tells)).includes(line)
      const edit = (p, fn) => writeFileSync(p, fn(read(p)))
      let d

      d = copy('missing'); rmSync(join(d, 'cadence.md'))
      say(raises(d, 'missing-node'), 'an engine with no cadence node raises missing-node:')
      d = copy('noplatform'); rmSync(join(d, 'platforms'), { recursive: true })
      say(raises(d, 'missing-node'), 'an engine with no platform node raises missing-node:')
      d = copy('untyped'); edit(join(d, 'hooks.md'), (t) => t.replace(/^---\n[\s\S]*?\n---\n/, ''))
      say(raises(d, 'untyped-node'), 'a node with no frontmatter raises untyped-node:')
      d = copy('broken'); edit(join(d, 'hooks.md'), (t) => `${t}\nSee [[nowhere]].\n`)
      say(raises(d, 'broken-link'), 'a link to a node that does not exist raises broken-link:')
      d = copy('codelink'); edit(join(d, 'hooks.md'), (t) => `${t}\nWrite a link as \`[[nowhere]]\`.\n`)
      say(!raises(d, 'broken-link'), 'a link inside a code span is not a link')
      d = copy('orphan'); writeFileSync(join(d, 'extra.md'), '---\nnode: note\n---\n\n# Extra\n\nNothing links here.\n')
      say(raises(d, 'orphan-node'), 'a node nothing links to raises orphan-node:')
      d = copy('nolimit'); for (const f of readdirSync(join(d, 'platforms'))) edit(join(d, 'platforms', f), (t) => t.replace(/^.*Limit:.*$/gm, ''))
      say(raises(d, 'platform-no-limit'), 'a platform node with no Limit line raises platform-no-limit:')
      d = copy('nosegment'); edit(join(d, 'audience.md'), (t) => t.replace(/^## Segment:/gm, '## Group'))
      say(raises(d, 'audience-no-segment'), 'an audience node with no Segment section raises audience-no-segment:')

      const engine = copy('runs')
      const runDir = join(tmp, 'runs')
      const platform = loadEngine(engine).nodes.find((n) => n.type === 'platform').name
      const brief = 'A brief that is long enough to stand as one: the owner moved one line on a form, watched what happened for a season, wrote down what changed and what did not, and asked for a short post that says so plainly without adding anything that was not observed.'
      const draft = (p, treatment, body, nodes = `[[voice]], [[${p}]]`) => `## Draft: ${p}\n\n- Treatment: ${treatment}\n- Nodes: ${nodes}\n\n\`\`\`text\n${body}\n\`\`\`\n`
      const runFile = (name, text) => { const p = join(runDir, `${name}.md`); writeFileSync(p, text); return p }
      const base = (o = {}) => `# Run: test\n\n${o.engine ?? 'Engine: engine'}\nIdea: one line moved on a form\nPlatforms: ${o.platforms ?? platform}\n\n${o.brief ?? `## Brief\n\n${brief}\n`}\n${o.drafts ?? draft(platform, 'the single claim', 'One line moved on the form and the season went better.')}\nNot verified: whether the owner agrees with the wording.\n`
      const runLines = (text, nc = []) => lines(checkTarget({ kind: 'run', path: runFile(`t${Math.random().toString(36).slice(2)}`, text) }, nc, tells))

      say(runLines(base()).length === 0, 'the smallest correct run raises nothing')
      say(runLines(base({ engine: '' })).includes('no-engine'), 'a run with no Engine line raises no-engine:')
      say(runLines(base({ brief: '' })).includes('no-brief'), 'a run with no Brief section raises no-brief:')
      say(runLines(base({ platforms: 'nowhere', drafts: draft('nowhere', 'the single claim', 'One line moved on the form.', '[[voice]]') })).includes('unknown-platform'), 'a draft for a platform the engine lacks raises unknown-platform:')
      say(runLines(base({ drafts: draft(platform, '', 'One line moved on the form.') })).includes('no-treatment'), 'a draft with an empty Treatment raises no-treatment:')
      say(runLines(base({ drafts: draft(platform, 'the single claim', 'One line moved on the form.', `[[voice]], [[${platform}]], [[nowhere]]`) })).includes('unknown-node'), 'a draft that names a node the engine lacks raises unknown-node:')
      const two = loadEngine(engine).nodes.filter((n) => n.type === 'platform').map((n) => n.name)
      if (two.length >= 2) {
        say(runLines(base({ platforms: two.slice(0, 2).join(', '), drafts: `${draft(two[0], 'the single claim', 'One line moved on the form.')}\n${draft(two[1], 'The single claim', 'The season went better after the form changed.')}` })).includes('same-treatment'), 'two drafts with one Treatment raise same-treatment:')
      } else say(false, 'the gold engine has two platform nodes to test same-treatment: with')
      const nc = []
      runLines(base({ engine: 'Engine: not-here' }), nc)
      say(nc.length === 1, 'a run whose engine folder is missing is inconclusive, never a pass')
      const ncNode = []
      checkTarget({ kind: 'node', path: join(engine, 'voice.md') }, ncNode, tells)
      say(ncNode.length === 1, 'a node checked alone is inconclusive, never a pass')
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
  }

  // 4. The skill's own files.
  const skill = existsSync(join(SKILL_DIR, 'SKILL.md')) ? read(join(SKILL_DIR, 'SKILL.md')) : ''
  const refs = existsSync(join(SKILL_DIR, 'references')) ? readdirSync(join(SKILL_DIR, 'references')).filter((f) => f.endsWith('.md')) : []
  for (const f of refs) say(skill.includes(`(references/${f})`), `SKILL.md links references/${f}`)
  const verify = existsSync(join(SKILL_DIR, 'references', 'verify.md')) ? read(join(SKILL_DIR, 'references', 'verify.md')) : ''
  for (const name of Object.keys(LINES)) say(verify.includes(`\`${name}:\``), `references/verify.md documents ${name}:`)

  // The X ranking reference: a statement with no file path behind it is folklore again.
  const xPath = join(SKILL_DIR, 'references', 'x-algorithm.md')
  if (existsSync(xPath)) {
    const claims = read(xPath).split('\n').filter((l) => /^- \*\*S\d+\.\*\*/.test(l))
    const bare = claims.filter((l) => !/`[\w.-]+(?:\/[\w.-]*)+`|`[\w.-]+\.(?:rs|md|py|json)`/.test(l))
    say(claims.length >= 10 && bare.length === 0, `every claim line in references/x-algorithm.md carries a file path (${claims.length} lines${bare.length ? `; without one: ${bare.map((l) => l.match(/S\d+/)[0]).join(', ')}` : ''})`)
    say(/Commit read: `[0-9a-f]{40}`/.test(read(xPath)), 'references/x-algorithm.md names the commit it was read at')
  }

  console.log(failed ? `\nself-test failed: ${failed}` : '\nself-test passed')
  return failed ? 1 : 0
}

// ---------------------------------------------------------------- main

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

  if (!paths.length) notChecked.push('no input: pass an engine folder or a run file')
  const targets = collect(paths, notChecked)
  if (paths.length && !targets.length) notChecked.push('no engine, run or node found in the input')
  const tells = targets.some((t) => t.kind === 'run') ? readTells(notChecked) : null
  for (const t of targets) findings.push(...checkTarget(t, notChecked, tells))

  for (const f of findings) console.log(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`)
  const hard = never(findings)
  const soft = findings.filter((f) => f.class === 'candidate')
  if (findings.length) console.log('')
  const count = (kind) => targets.filter((t) => t.kind === kind).length
  console.log(`checked ${count('engine')} engine${count('engine') === 1 ? '' : 's'}, ${count('run')} run${count('run') === 1 ? '' : 's'}, ${count('node')} lone node${count('node') === 1 ? '' : 's'}`)
  console.log(`never intentional: ${hard.length}${hard.length ? ` (${tally(hard)})` : ''}`)
  console.log(`candidates: ${soft.length}${soft.length ? ` (${tally(soft)})` : ''}`)
  for (const n of notChecked) console.log(`not checked: ${n}`)
  console.log('passing is necessary, not sufficient')

  const failing = hard.length + (strict ? soft.length : 0)
  const status = failing ? 'failed' : notChecked.length ? 'inconclusive' : 'passed'
  const exitCode = status === 'inconclusive' ? 2 : status === 'failed' && (gate || strict) ? 1 : 0
  if (reportPath) {
    writeFileSync(reportPath, JSON.stringify({ status, exitCode, files: targets.map((t) => show(t.path)), findings, notChecked }, null, 2) + '\n')
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
