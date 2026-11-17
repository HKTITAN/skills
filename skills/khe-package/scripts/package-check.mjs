#!/usr/bin/env node
// package-check: the gate for khe-package.
//
// Reads a package plan (a markdown file that starts "# Package: <the work>", Key: value lines, see
// references/plan.md) and, with --video, the rendered file through ffprobe. Names every fault it can
// prove as a line.
//
//   node scripts/package-check.mjs <PACKAGE.md...> [--video out/name-7s.mp4] [--gate] [--strict] [--self-test] [--help]
//
// Zero dependencies; --video needs ffprobe on PATH. Node 20 or newer.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const SKILL_DIR = join(HERE, '..')
const GATE_NAME = 'package-check'

export const FORMATS = {
  explainer: { min: 20, max: 26 },
  'click-through': { min: 6, max: 9 },
  'hover-reel': { min: 4, max: 40 },
  stageshow: { min: 4, max: 30 },
  'recording-page': null,
  'touch-cursor': null,
}
const SHORT_MIN = 2000
const LONG_MAX = 4096
const IDEAS_MIN = 3
const MARGIN = { 'hover-reel': [40, 40], 'click-through': [40, 60] }
const FIRST_LINE_ABOUT_ME = /^(i|we)\s+(made|built|shipped|launched|created|released|just)\b|^(introducing|excited|proud|thrilled|happy to|announcing|today we|new:)/i

export const LINES = {
  'no-format': ['never', `No "Format:" line, or one that is not ${Object.keys(FORMATS).join(', ')}`],
  'no-ideas': ['never', `Fewer than ${IDEAS_MIN} ideas under "Ideas:" before anything was rendered`],
  'no-stills': ['never', 'The chosen idea has no still that was shown before the full render ("Stills:" with a path, and "Approved:")'],
  'real-time': ['never', 'Capture in real time: a screen recording, Playwright recordVideo or real-time playback for a rendered format'],
  'low-res': ['never', `The short side of the frame is under ${SHORT_MIN} device pixels`],
  'long-side': ['never', `The long side of the frame is over ${LONG_MAX} device pixels, past what H.264 level 5.2 plays well`],
  'wrong-fps': ['never', 'A rendered format at anything other than 60 fps'],
  'bad-margin': ['never', 'A live format whose margin around the component is outside 40 px (reel) or 40 to 60 px (click-through)'],
  'bad-length': ['never', 'A length outside the format\'s range: explainer 20 to 26 s, click-through 6 to 9 s'],
  'drawn-cursor': ['never', 'A drawn or SVG cursor; the cursor is the system\'s own image'],
  'about-me': ['never', 'The post\'s first line is about the maker ("I made", "Introducing", "Excited to") instead of what is in it for a stranger'],
  'no-unverified': ['never', 'The last line is not "Not verified: <what nobody checked>"'],
  'video-mismatch': ['never', 'The rendered file\'s size, frame rate or length disagrees with the plan (--video)'],
  'no-hook': ['candidate', 'No "Hook:" line saying what the first second shows'],
  'not-square': ['candidate', 'An explainer that is not 1:1; 16:9 reads too wide in a phone timeline unless the content is one row'],
}

const KEY = /^([A-Z][A-Za-z ]+):\s*(.*)$/

function parse(text) {
  const fields = {}
  const bullets = {}
  let key = null
  for (const line of text.replace(/\r\n/g, '\n').split('\n')) {
    if (/^#/.test(line)) { key = null; continue }
    const k = line.match(KEY)
    if (k) { key = k[1].trim().toLowerCase(); fields[key] = k[2].trim(); bullets[key] = []; continue }
    const b = line.match(/^\s*-\s+(.*)$/)
    if (b && key) bullets[key].push(b[1].trim())
  }
  return { fields, bullets }
}

// "1080x1080 at DSF 2" or "3120x2004" -> device pixels.
function frameOf(s) {
  const m = (s || '').match(/(\d+)\s*[x×]\s*(\d+)(?:[^\d]+(?:dsf|@)\s*([\d.]+))?/i)
  if (!m) return null
  const d = Number(m[3] || 1)
  return { w: Math.round(Number(m[1]) * d), h: Math.round(Number(m[2]) * d) }
}

export function checkPlan(text, video) {
  const out = []
  const add = (line, detail) => out.push({ line, detail })
  const { fields: f, bullets: b } = parse(text)
  const format = (f.format || '').toLowerCase().split(/[\s,(]/)[0]
  if (!(format in FORMATS)) { add('no-format', f.format ? `"${f.format}"` : 'missing'); return out }
  const rendered = FORMATS[format] !== null
  const ideas = (b.ideas || []).length
  if (ideas < IDEAS_MIN) add('no-ideas', `${ideas} under Ideas:`)
  if (rendered) {
    if (!/\.(png|jpe?g|webp)\b/i.test(f.stills || '') || !/\S/.test(f.approved || '')) add('no-stills', `Stills: ${f.stills || 'missing'}; Approved: ${f.approved || 'missing'}`)
    if (/real[- ]?time|recordvideo|screen ?record|obs\b|quicktime/i.test(f.capture || '') && !/frame[- ]by[- ]frame/i.test(f.capture || '')) add('real-time', `Capture: ${f.capture}`)
    const fr = frameOf(f.frame)
    if (fr) {
      if (Math.min(fr.w, fr.h) < SHORT_MIN) add('low-res', `${fr.w}x${fr.h}`)
      if (Math.max(fr.w, fr.h) > LONG_MAX) add('long-side', `${fr.w}x${fr.h}`)
      if (format === 'explainer' && fr.w !== fr.h) add('not-square', `${fr.w}x${fr.h}`)
    } else add('low-res', `Frame: ${f.frame || 'missing'}`)
    const fps = Number((f.fps || '').match(/\d+/)?.[0])
    if (fps !== 60) add('wrong-fps', `Fps: ${f.fps || 'missing'}`)
    const len = Number((f.length || '').match(/[\d.]+/)?.[0])
    const r = FORMATS[format]
    if (!(len >= r.min && len <= r.max)) add('bad-length', `Length: ${f.length || 'missing'} (${format} ${r.min} to ${r.max} s)`)
    if (MARGIN[format]) {
      const m = Number((f.margin || '').match(/\d+/)?.[0])
      const [lo, hi] = MARGIN[format]
      if (!(m >= lo && m <= hi)) add('bad-margin', `Margin: ${f.margin || 'missing'}`)
    }
    if (f.cursor && /\b(drawn|svg|css|custom|fake)\b/i.test(f.cursor) && !/system|\.cur\b|nscursor/i.test(f.cursor)) add('drawn-cursor', `Cursor: ${f.cursor}`)
    if (!f.hook) add('no-hook', 'missing')
    if (video) {
      const p = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate:format=duration', '-of', 'json', video], { encoding: 'utf8' })
      if (p.status !== 0) add('video-mismatch', `ffprobe could not read ${video}`)
      else {
        const j = JSON.parse(p.stdout)
        const s = j.streams?.[0] || {}
        const [n, d] = String(s.r_frame_rate || '0/1').split('/').map(Number)
        const vf = n / (d || 1)
        const dur = Number(j.format?.duration)
        if (fr && (s.width !== fr.w || s.height !== fr.h)) add('video-mismatch', `file is ${s.width}x${s.height}, plan says ${fr.w}x${fr.h}`)
        if (Math.round(vf) !== 60) add('video-mismatch', `file is ${vf.toFixed(2)} fps`)
        if (len && Math.abs(dur - len) > 0.5) add('video-mismatch', `file is ${dur.toFixed(2)} s, plan says ${len} s`)
      }
    }
  }
  const first = (f['first line'] || '').replace(/^["“]|["”]$/g, '')
  if (first && FIRST_LINE_ABOUT_ME.test(first)) add('about-me', `"${first.slice(0, 70)}"`)
  const last = text.replace(/\r\n/g, '\n').trimEnd().split('\n').pop() || ''
  if (!/^Not verified:\s*\S/.test(last)) add('no-unverified', `last line: "${last.slice(0, 60)}"`)
  return out
}

function collect(paths) {
  const files = []
  const walk = (p) => {
    if (!existsSync(p)) { files.push({ path: p, missing: true }); return }
    if (statSync(p).isDirectory()) for (const f of readdirSync(p).sort()) walk(join(p, f))
    else if (/\.md$/i.test(p) && /^# Package:/m.test(readFileSync(p, 'utf8'))) files.push({ path: p })
  }
  paths.forEach(walk)
  return files
}

function run(paths, opt) {
  const files = collect(paths)
  let never = 0
  let cand = 0
  let missing = 0
  for (const file of files) {
    const name = relative(process.cwd(), file.path) || file.path
    if (file.missing) { console.log(`${name}: not found`); missing++; continue }
    for (const x of checkPlan(readFileSync(file.path, 'utf8'), opt.video)) {
      if (LINES[x.line][0] === 'never') never++; else cand++
      console.log(`${x.line}: ${name}: ${x.detail}`)
    }
  }
  if (!files.length) missing++
  const failing = never + (opt.strict ? cand : 0)
  const status = failing ? 'failed' : missing ? 'inconclusive' : 'passed'
  if (opt.gate || opt.strict) console.log(status === 'passed' ? `${GATE_NAME} passed${cand ? ` (${cand} candidate line${cand === 1 ? '' : 's'})` : ''}` : status === 'inconclusive' ? `${GATE_NAME} inconclusive: no package plan found` : `${GATE_NAME} failed: ${never} never line${never === 1 ? '' : 's'}`)
  return status === 'inconclusive' ? 2 : status === 'failed' && (opt.gate || opt.strict) ? 1 : 0
}

function selfTest() {
  let failed = 0
  const say = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failed++ }
  const nevers = (t) => checkPlan(t).filter((x) => LINES[x.line][0] === 'never').map((x) => x.line)
  const gold = collect([join(SKILL_DIR, 'examples')])
  say(gold.length >= 3, `examples/ holds ${gold.length} gold plans`)
  for (const g of gold) { const l = nevers(readFileSync(g.path, 'utf8')); say(!l.length, `gold ${relative(SKILL_DIR, g.path)} raises no never line${l.length ? ` (got ${l.join(', ')})` : ''}`) }
  const teach = join(SKILL_DIR, 'teaching')
  const pairs = existsSync(teach) ? readdirSync(teach).filter((d) => statSync(join(teach, d)).isDirectory()).sort() : []
  say(pairs.length >= 8, `teaching/ holds ${pairs.length} pairs`)
  for (const p of pairs) {
    say(p in LINES, `teaching/${p} is named for a gate line`)
    const bad = nevers(readFileSync(join(teach, p, 'bad.md'), 'utf8'))
    const good = nevers(readFileSync(join(teach, p, 'good.md'), 'utf8'))
    say(bad.includes(p) && bad.every((l) => l === p), `teaching/${p}/bad.md raises ${p} and nothing else${bad.length ? ` (got ${bad.join(', ')})` : ''}`)
    say(!good.length, `teaching/${p}/good.md raises no never line${good.length ? ` (got ${good.join(', ')})` : ''}`)
  }
  const fixtures = {
    'no-format': '# Package: x\n\nFormat: slideshow\n\nNot verified: x\n',
    'video-mismatch': null,
  }
  for (const [k, [s]] of Object.entries(LINES)) {
    if (s !== 'never' || pairs.includes(k)) continue
    if (fixtures[k]) say(nevers(fixtures[k]).includes(k), `a broken plan raises ${k}`)
    else if (k === 'video-mismatch') say(true, 'video-mismatch is proved against a real render with --video (references/verify.md)')
    else say(false, `${k} has no teaching pair and no fixture`)
  }
  console.log(failed ? `\nself-test failed: ${failed}` : '\nself-test passed')
  return failed ? 1 : 0
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')))
  const vi = argv.indexOf('--video')
  const video = vi >= 0 ? argv[vi + 1] : null
  const paths = argv.filter((a, i) => !a.startsWith('--') && i !== vi + 1 || (vi < 0 && !a.startsWith('--')))
  if (flags.has('--self-test')) return selfTest()
  if (flags.has('--help') || !paths.length) {
    console.log(`package-check: the gate for khe-package\n\n  node scripts/package-check.mjs <PACKAGE.md...> [--video out.mp4] [--gate] [--strict] [--self-test]\n\nLines:\n${Object.entries(LINES).map(([k, [s, d]]) => `  ${k} (${s}): ${d}`).join('\n')}`)
    return 0
  }
  return run(paths.filter((p) => p !== video), { gate: flags.has('--gate'), strict: flags.has('--strict'), video })
}

if (process.argv[1] && basename(process.argv[1]) === basename(fileURLToPath(import.meta.url))) process.exitCode = main(process.argv.slice(2))
