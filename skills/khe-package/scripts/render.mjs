#!/usr/bin/env node
// render: frame-by-frame video renderer for khe-package.
//
// Two modes, both stepping time one frame at a time on a paused clock, never recording in real time:
//
//   explainer   a page that exports window.render(t) (seconds) and window.DURATION. Each frame calls
//               render(t) and captures the page. Nothing on the page may run on its own clock.
//   live        a real page in your app, cropped to one element (the stage) plus a margin, driven by a
//               shot list (hover, glide, click, hold) with a real system cursor drawn on top.
//
//   node scripts/render.mjs explainer <index.html|url> stills 0.4,3,9 [--out out] [--w 1080 --h 1080 --dsf 2]
//   node scripts/render.mjs explainer <index.html|url> video out/name-24s.mp4
//   node scripts/render.mjs live <shot.json> stills 0.4,2,5
//   node scripts/render.mjs live <shot.json> video out/name-7s.mp4
//
// Needs playwright-core (from your project, or --playwright <dir>), Google Chrome (or CHROME_PATH),
// and ffmpeg on PATH for video. Exit 0 rendered, 1 the page or a shot failed, 2 could not run.

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { platform } from 'node:os'

const LONG_MAX = 4096 // a longer side breaks H.264 level 5.2 playback on phones and in some players
const SHORT_MIN = 2000 // the short side, in device pixels, before the video reads as sharp on a phone

function fail(code, msg) { console.error(msg); process.exit(code) }

function args(argv) {
  const pos = []
  const opt = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { const k = argv[i].slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; opt[k] = v }
    else pos.push(argv[i])
  }
  return { pos, opt }
}

async function loadChromium(dir) {
  const tries = [dir, process.cwd()].filter(Boolean)
  for (const base of tries) {
    for (const name of ['playwright-core', 'playwright']) {
      try {
        const req = createRequire(join(resolve(base), 'noop.js'))
        const file = req.resolve(name)
        const mod = await import(pathToFileURL(file).href)
        return (mod.default || mod).chromium
      } catch {}
    }
  }
  return null
}

function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH
  const c = {
    win32: ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'],
    darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
    linux: ['/usr/bin/google-chrome', '/usr/bin/chromium'],
  }[platform()] || []
  return c.find((p) => existsSync(p))
}

// The cursor comes from the machine it renders on, never from this skill: the system's own arrow and
// hand, at their largest size. Windows keeps them in C:/Windows/Cursors as .cur files, which are ICO
// files with a hotspot; flipping the type byte makes Chrome decode them. On macOS, export NSCursor
// images once (references/cursor.md) and pass them with --cursor-arrow and --cursor-hand.
function cursorImage(kind, opt) {
  const given = opt[`cursor-${kind}`]
  if (given) {
    const [file, hx, hy] = String(given).split(',')
    const buf = readFileSync(file)
    return { src: `data:image/png;base64,${buf.toString('base64')}`, hx: Number(hx || 0), hy: Number(hy || 0), source: file }
  }
  if (platform() === 'win32') {
    const names = kind === 'hand' ? ['aero_link_xl.cur', 'aero_link_l.cur', 'aero_link.cur'] : ['aero_arrow_xl.cur', 'aero_arrow_l.cur', 'aero_arrow.cur']
    for (const n of names) {
      const file = join('C:/Windows/Cursors', n)
      if (!existsSync(file)) continue
      const buf = Buffer.from(readFileSync(file))
      const w = buf[6] || 256
      const hx = buf.readUInt16LE(10)
      const hy = buf.readUInt16LE(12)
      buf.writeUInt16LE(1, 2) // cursor (2) to icon (1)
      buf.writeUInt16LE(1, 10) // planes
      buf.writeUInt16LE(32, 12) // bit count
      return { src: `data:image/x-icon;base64,${buf.toString('base64')}`, hx, hy, w, source: file }
    }
  }
  return null
}

async function capture(cdp, file) {
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false })
  writeFileSync(file, Buffer.from(data, 'base64'))
}

// Pause every CSS transition, CSS animation and WAAPI animation, and seek each to the fake clock, so
// a transition triggered by a click plays at the same rate as the timers and rAF the clock drives.
const SEEK = () => {
  const now = performance.now()
  for (const a of document.getAnimations()) {
    if (a.__khe === undefined) { a.__khe = now; a.__base = a.currentTime || 0; a.pause() }
    a.currentTime = a.__base + (now - a.__khe)
  }
}

function encode(dir, fps, out) {
  mkdirSync(dirname(resolve(out)), { recursive: true })
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', join(dir, '%05d.png'),
    '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', resolve(out)], { encoding: 'utf8' })
  if (r.status !== 0) fail(1, `ffmpeg failed: ${(r.stderr || '').trim().split('\n').slice(-2).join(' ')}`)
}

function evenDsf(w, h, dsf) {
  // Both device sides must be even for yuv420p, and the long side at most LONG_MAX.
  let d = dsf
  while (Math.max(w, h) * d > LONG_MAX && d > 1) d -= 0.25
  for (let i = 0; i < 16 && (Math.round(w * d) % 2 || Math.round(h * d) % 2); i++) d += 0.0625
  return d
}

function dsfFor(w, h, wanted) {
  return evenDsf(w, h, wanted || Math.max(1, Math.ceil((SHORT_MIN / Math.min(w, h)) * 4) / 4))
}

async function explainer(chromium, target, mode, list, opt) {
  const W = Number(opt.w || 1080)
  const H = Number(opt.h || 1080)
  const dsf = dsfFor(W, H, opt.dsf ? Number(opt.dsf) : 2)
  const fps = Number(opt.fps || 60)
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: dsf, colorScheme: opt.scheme || 'light' })
  const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(resolve(target)).href
  await page.goto(url)
  await page.evaluate(() => document.fonts.ready)
  const info = await page.evaluate(() => ({ ok: typeof window.render === 'function', duration: Number(window.DURATION), fonts: [...document.fonts].map((f) => `${f.family} ${f.status}`) }))
  if (!info.ok || !info.duration) { await browser.close(); fail(1, 'the page has no window.render(t) or no window.DURATION') }
  const unloaded = info.fonts.filter((f) => !f.endsWith('loaded'))
  if (unloaded.length) console.log(`fonts not loaded: ${unloaded.join(', ')}`)
  const cdp = await page.context().newCDPSession(page)
  const out = opt.out || 'out'
  if (mode === 'stills') {
    mkdirSync(out, { recursive: true })
    for (const t of list) { await page.evaluate((x) => window.render(x), t); await capture(cdp, join(out, `still-${t}s.png`)); console.log(`still ${t}s -> ${join(out, `still-${t}s.png`)}`) }
  } else {
    const dir = `${list}.frames`
    rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true })
    const n = Math.round(info.duration * fps)
    for (let i = 0; i < n; i++) { await page.evaluate((x) => window.render(x), i / fps); await capture(cdp, join(dir, `${String(i).padStart(5, '0')}.png`)) }
    encode(dir, fps, list)
    if (!opt['keep-frames']) rmSync(dir, { recursive: true, force: true })
    console.log(`rendered ${list}: ${Math.round(W * dsf)}x${Math.round(H * dsf)}, ${fps}fps, ${info.duration}s, ${n} frames`)
  }
  await browser.close()
}

const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2) // ease-in-out cubic

// A glide is a quadratic Bezier whose control point sits off the straight line by `bow` of its length,
// so the path curves slightly the way a hand does.
function glidePoint(a, b, t, bow) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const c = { x: mx - dy * bow, y: my + dx * bow }
  const u = ease(t)
  return { x: (1 - u) ** 2 * a.x + 2 * (1 - u) * u * c.x + u * u * b.x, y: (1 - u) ** 2 * a.y + 2 * (1 - u) * u * c.y + u * u * b.y }
}

async function live(chromium, shotFile, mode, list, opt) {
  const shot = JSON.parse(readFileSync(shotFile, 'utf8'))
  const fps = Number(shot.fps || 60)
  const margin = Number(shot.margin ?? 60)
  const browser = await chromium.launch({ executablePath: chromePath(), headless: true })
  const probe = await browser.newPage({ viewport: { width: 1600, height: 1200 }, colorScheme: shot.scheme || 'light' })
  const url = /^https?:|^file:/.test(shot.url) ? shot.url : pathToFileURL(resolve(dirname(shotFile), shot.url)).href
  await probe.goto(url)
  const box = await probe.locator(shot.stage || '#stage').boundingBox()
  await probe.close()
  if (!box) { await browser.close(); fail(1, `the stage ${shot.stage || '#stage'} was not found or is not visible`) }
  const W = Math.ceil(box.width + margin * 2)
  const H = Math.ceil(box.height + margin * 2)
  const dsf = dsfFor(W, H, shot.dsf)
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: dsf, colorScheme: shot.scheme || 'light' })
  const page = await ctx.newPage()
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') })
  await page.goto(url)
  await page.waitForSelector(shot.stage || '#stage', { state: 'visible', timeout: 15000 })
  await page.evaluate(() => document.fonts.ready)
  // Move the stage into the frame: margin on every side, the page around it unchanged.
  await page.evaluate(({ sel, margin, x, y }) => {
    const el = document.querySelector(sel)
    window.scrollTo(0, 0)
    const r = el.getBoundingClientRect()
    document.documentElement.style.overflow = 'hidden'
    document.body.style.transform = `translate(${margin - r.left}px, ${margin - r.top}px)`
  }, { sel: shot.stage || '#stage', margin, x: box.x, y: box.y })
  await page.clock.pauseAt(new Date('2026-01-01T00:10:00Z'))
  const arrow = cursorImage('arrow', opt)
  const hand = cursorImage('hand', opt) || arrow
  if (!arrow) console.log('no system cursor found; pass --cursor-arrow file.png,hx,hy (references/cursor.md). Rendering without a cursor.')
  else console.log(`cursor: ${arrow.source}`)
  const size = Number(shot.cursorSize || 32) // CSS px; drawn at device resolution
  await page.evaluate(({ arrow, hand, size }) => {
    const img = document.createElement('img')
    img.id = '__khe_cursor'
    img.style.cssText = `position:fixed;left:0;top:0;width:${size}px;height:${size}px;pointer-events:none;z-index:2147483647;display:none;will-change:transform`
    document.documentElement.appendChild(img)
    window.__kheCursor = { arrow, hand, size }
  }, { arrow, hand, size })
  const setCursor = async (p) => page.evaluate(({ x, y }) => {
    const c = window.__kheCursor
    const img = document.getElementById('__khe_cursor')
    if (!c.arrow || x === null) { img.style.display = 'none'; return }
    const el = document.elementFromPoint(x, y)
    const clickable = el && (el.closest('a,button,[role=button],[role=tab],[role=switch],[data-clickable],label,summary,select') || getComputedStyle(el).cursor === 'pointer')
    const k = clickable ? c.hand : c.arrow
    const scale = c.size / (k.w || c.size)
    if (img.src !== k.src) img.src = k.src
    img.style.display = 'block'
    img.style.transform = `translate(${x - k.hx * scale}px, ${y - k.hy * scale}px)`
  }, p)

  const cdp = await ctx.newCDPSession(page)
  const frameMs = 1000 / fps
  let frame = 0
  let t = 0
  let pos = null
  const stills = mode === 'stills' ? list.map(Number) : null
  const dir = mode === 'video' ? `${list}.frames` : null
  if (dir) { rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true }) }
  const outDir = opt.out || 'out'
  if (stills) mkdirSync(outDir, { recursive: true })
  const tick = async () => {
    await page.clock.runFor(frameMs)
    await page.evaluate(SEEK)
    if (dir) await capture(cdp, join(dir, `${String(frame).padStart(5, '0')}.png`))
    else for (const s of stills) if (Math.abs(s - t) < frameMs / 2000) { await capture(cdp, join(outDir, `still-${s}s.png`)); console.log(`still ${s}s`) }
    frame++; t = frame / fps
  }
  const offFrame = (where) => ({
    'bottom-right': { x: W + 40, y: H + 40 }, 'bottom-left': { x: -40, y: H + 40 }, below: { x: W * 0.6, y: H + 60 }, right: { x: W + 60, y: H * 0.6 },
  }[where || 'bottom-right'])
  const pointOf = async (target, at) => {
    // A target is css=<selector>, or the visible name of a control: role name first, then any text.
    const esc = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const tries = target.startsWith('css=') ? [page.locator(target.slice(4))]
      : [page.getByRole('tab', { name: new RegExp(`^${esc}`) }), page.getByRole('button', { name: new RegExp(`^${esc}`) }), page.getByRole('link', { name: new RegExp(`^${esc}`) }), page.getByText(target)]
    let b = null
    for (const loc of tries) { if (await loc.count()) { b = await loc.first().boundingBox({ timeout: 3000 }); if (b) break } }
    if (!b) throw new Error(`target not found: ${target}`)
    const [fx, fy] = at || [0.62, 0.68] // low and right of centre, so the hand does not cover the label
    return { x: b.x + b.width * fx, y: b.y + b.height * fy }
  }
  try {
    for (const step of shot.shots) {
      if (step.enter) pos = offFrame(step.enter)
      if (step.hold !== undefined || step.wait !== undefined) {
        const n = Math.round((step.hold ?? step.wait) * fps)
        for (let i = 0; i < n; i++) { await setCursor(pos || { x: null, y: null }); await tick() }
      }
      if (step.glide || step.exit) {
        const to = step.exit ? offFrame(step.exit) : await pointOf(step.glide, step.at)
        const from = pos || offFrame('bottom-right')
        const n = Math.max(1, Math.round((step.seconds ?? 0.55) * fps))
        for (let i = 1; i <= n; i++) {
          const p = glidePoint(from, to, i / n, step.bow ?? 0.1)
          await page.mouse.move(p.x, p.y)
          await setCursor(p); await tick()
        }
        pos = to
        if (step.exit) pos = null
      }
      if (step.click) {
        await page.mouse.down(); await setCursor(pos); await tick()
        await page.mouse.up(); await setCursor(pos); await tick()
      }
      if (step.cut) { /* a hard cut is a scene boundary: nothing to render, the next shot starts on the next frame */ }
    }
  } catch (e) { await browser.close(); fail(1, e.message) }
  if (dir) {
    encode(dir, fps, list)
    if (!opt['keep-frames']) rmSync(dir, { recursive: true, force: true })
    console.log(`rendered ${list}: ${Math.round(W * dsf)}x${Math.round(H * dsf)}, ${fps}fps, ${(frame / fps).toFixed(2)}s, ${frame} frames, margin ${margin}px, dsf ${dsf}`)
  }
  await browser.close()
}

async function main() {
  const { pos, opt } = args(process.argv.slice(2))
  const [kind, target, mode, list] = pos
  if (!kind || opt.help || !['explainer', 'live'].includes(kind) || !['stills', 'video'].includes(mode) || !list) {
    console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.slice(3)).join('\n'))
    process.exit(kind ? 2 : 0)
  }
  if (!chromePath()) fail(2, 'inconclusive: Google Chrome not found; set CHROME_PATH')
  if (mode === 'video' && spawnSync('ffmpeg', ['-version']).status !== 0) fail(2, 'inconclusive: ffmpeg not on PATH; nothing was rendered')
  const chromium = await loadChromium(opt.playwright)
  if (!chromium) fail(2, 'inconclusive: playwright-core not found. npm i -D playwright-core in the video project, or pass --playwright <dir>')
  const parsed = mode === 'stills' ? String(list).split(',').map(Number) : list
  if (kind === 'explainer') await explainer(chromium, target, mode, parsed, opt)
  else await live(chromium, target, mode, parsed, opt)
}

main()
