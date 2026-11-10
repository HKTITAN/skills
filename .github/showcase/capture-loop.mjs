// Records one loop of a scripted Stageshow scene as numbered PNG frames.
// The scene installs Stageshow's virtual clock when its URL has ?record, so each
// frame is one exact step of that clock: no dropped frames, no timing jitter.
//
//   node capture-loop.mjs <url-with-?record> <outDir> [--selector ".ss-stage"] [--max 900]
//
// The scene's script must call a.mark('start') as its first line. Recording runs
// from one 'start' to the next, which is exactly one loop.
import { mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'
import { createRequire } from 'node:module'

const require = createRequire(`${process.env.STAGESHOW_DIR || join(homedir(), '.claude/skills/stageshow')}/package.json`)
const { chromium } = require('playwright-core')

const [url, outDir] = process.argv.slice(2)
const opt = (name, fallback) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : fallback }
const selector = opt('selector', '.ss-stage')
const max = Number(opt('max', 900))

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1280, height: 760 }, deviceScaleFactor: 1 })
page.on('pageerror', (e) => console.error('page error:', e.message))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForSelector(selector)
const fps = await page.evaluate(() => window.__stageshow?.clock?.fps)
if (!fps) { console.error('no virtual clock: the URL needs ?record and the scene must install it'); await browser.close(); process.exit(2) }

const step = () => page.evaluate(() => window.__stageshow.clock.step(1))
const mark = () => page.evaluate((sel) => document.querySelector(sel)?.dataset.mark || '', selector)
const stage = page.locator(selector).first()

// Run to the start of a loop. The mark is set once per run, so watch the frame it changes on.
let seen = ''
let guard = 0
while ((seen = await mark()) !== 'start' && guard++ < max) await step()
if (seen !== 'start') { console.error("the scene never reached a.mark('start')"); await browser.close(); process.exit(2) }

// The stage restarts its script after the last wait. Detect that by the cursor returning to rest
// and the mark being set again: clear it ourselves, then stop when the script sets it once more.
await page.evaluate((sel) => { delete document.querySelector(sel).dataset.mark }, selector)
let frames = 0
for (; frames < max; frames++) {
  await stage.screenshot({ path: join(outDir, `f${String(frames).padStart(4, '0')}.png`) })
  await step()
  if (frames > fps && (await mark()) === 'start') break
}
await browser.close()
console.log(`${frames + 1} frames at ${fps} fps -> ${outDir}`)
