#!/usr/bin/env node
// record: runs a demo script against the real web app and writes the take.
//
//   node scripts/record.mjs <demo.json> --out <take.mp4|take.webm> [options]
//
// It drives the user's own Chrome through playwright-core, resets the app's
// state before every take, moves a drawn pointer at hand speed, waits on
// conditions, captures the page's own frames over the DevTools screencast and
// encodes them with ffmpeg at the frame rate the script declares.
// Node 20+. Needs playwright-core (from your project, never bundled here) and
// ffmpeg on PATH. Exit 0 recorded, 1 the script or a step failed, 2 it could not run.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve } from "node:path";
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { ACTING_STEPS, HOLD_CAP, checkScript, hostKind } from "./demo-check.mjs";

// Pace. Every number is explained in references/script.md.
const MOVE = { a: 200, b: 140, min: 300, max: 900 }; // Fitts: ms = a + b * log2(distance / width + 1)
const BOW = 0.06; // the path bends by 6 % of its length
const DWELL = 120; // ms the pointer rests on a target before it presses
const PRESS = 90; // ms a button stays down
const AFTER = 250; // ms the result stays on screen before the pointer leaves
const CPS = 12; // characters a second
const JITTER = 0.25; // each key lands within 25 % of its slot
const HANDLE = 500; // ms of still frame before the first step and after the last
const SETTLE = 400; // ms before the closing frame is compared with the opening one
const TIMEOUT = 5000; // ms a condition may take unless the step says otherwise

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fail = (code, message) => { console.error(message); process.exit(code); };

function parseArgs(argv) {
  const opts = { takes: 1 };
  const rest = [];
  const valued = ["out", "url", "takes", "playwright", "allow-host", "report", "keep-frames", "channel"];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { rest.push(a); continue; }
    const key = a.slice(2);
    if (valued.includes(key)) opts[key] = argv[++i];
    else opts[key] = true;
  }
  opts.takes = Math.max(1, Number(opts.takes) || 1);
  return { opts, rest };
}

function help() {
  console.log(`record: run a demo script against the real web app and write the take

  node scripts/record.mjs <demo.json> --out <take.mp4|take.webm> [options]

  --out <file>          where the take goes; .mp4 is H.264, .webm is VP9
  --url <base>          run against this origin in place of the script's (a free local port)
  --takes <n>           record n takes in one browser profile; 2 proves the reset (default 1).
                        The last take is the one written to --out
  --dry-run             run every step at real pace and record nothing; prints each wait
  --report <file>       write the take report the gate reads (default <out>.take.json)
  --headed              show the browser window while it runs
  --channel <name>      the browser to launch (default chrome, the one already installed)
  --playwright <dir>    a project folder (or node_modules) that holds playwright-core
  --allow-host <host>   record a host that is not local. Only your own app, or one you are
                        authorised to demo; never a page with a real user's data on it
  --allow-commands      let "command" reset steps run a shell command from the script
  --keep-frames <dir>   keep the captured frames and the ffconcat list in this folder
  --force               record even though the gate's never-intentional lines are not at 0
  --help

It refuses to start when demo-check finds a never-intentional line in the script,
when the host is not local and was not named with --allow-host, and when ffmpeg or
playwright-core cannot be found (exit 2). It prints "recorded" only after ffmpeg
wrote the file. Run demo-check on the file afterwards: this script does not judge it.`);
}

async function loadPlaywright(hint) {
  const names = ["playwright-core", "playwright"];
  const roots = [hint && resolve(hint), process.env.PLAYWRIGHT_CORE && resolve(process.env.PLAYWRIGHT_CORE), process.cwd()].filter(Boolean);
  for (const root of roots) {
    for (const name of names) {
      const candidates = [];
      try { candidates.push(createRequire(join(root, "noop.js")).resolve(name)); } catch { /* not under this root */ }
      for (const dir of [join(root, name), join(root, "node_modules", name)]) if (existsSync(join(dir, "package.json"))) { try { candidates.push(createRequire(join(dir, "noop.js")).resolve(dir)); } catch { /* not a package */ } }
      for (const file of candidates) {
        const mod = await import(pathToFileURL(file).href);
        const chromium = mod.chromium ?? mod.default?.chromium;
        if (chromium) return chromium;
      }
    }
  }
  return null;
}

// The pixel size of a JPEG, read from its frame header.
function jpegSize(buf) {
  for (let i = 2; i < buf.length - 9; ) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return [0, 0];
}

// A small seeded generator, so two takes type with the same rhythm.
function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Runs in the page before its own scripts. Draws the pointer the screencast cannot see.
function overlay({ touch }) {
  if (window.__kheDemoPointer) return;
  let el = null;
  const NS = "http://www.w3.org/2000/svg";
  const make = () => {
    if (el || !document.documentElement) return el;
    el = document.createElement("div");
    el.id = "khe-demo-pointer";
    el.setAttribute("aria-hidden", "true");
    const s = el.style;
    s.position = "fixed"; s.left = "0"; s.top = "0"; s.zIndex = "2147483647"; s.pointerEvents = "none";
    s.transform = "translate(-200px,-200px)"; s.willChange = "transform"; s.transition = "opacity 120ms linear";
    if (touch) {
      const dot = document.createElement("div");
      const d = dot.style;
      d.width = "32px"; d.height = "32px"; d.margin = "-16px 0 0 -16px"; d.borderRadius = "50%";
      d.background = "rgba(17,17,17,0.3)"; d.boxShadow = "0 0 0 1.5px rgba(255,255,255,0.75)"; d.transition = "transform 90ms ease-out";
      el.appendChild(dot);
      s.opacity = "0";
    } else {
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("width", "22"); svg.setAttribute("height", "30"); svg.setAttribute("viewBox", "0 0 22 30");
      svg.style.display = "block"; svg.style.margin = "-2px 0 0 -2px"; svg.style.transformOrigin = "2px 2px"; svg.style.transition = "transform 90ms ease-out";
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", "M2 2v21.5l5.5-5.1 3.7 8.5 3.3-1.4-3.7-8.4H18.6z");
      path.setAttribute("fill", "#111"); path.setAttribute("stroke", "#fff"); path.setAttribute("stroke-width", "1.6"); path.setAttribute("stroke-linejoin", "round");
      svg.appendChild(path);
      el.appendChild(svg);
    }
    document.documentElement.appendChild(el);
    return el;
  };
  const api = {
    place(x, y) { const n = make(); if (n) n.style.transform = `translate(${x}px,${y}px)`; },
    press(down) { const n = make(); if (n?.firstChild) n.firstChild.style.transform = down ? "scale(0.86)" : ""; },
    show(on) { const n = make(); if (n) n.style.opacity = on ? "1" : "0"; },
    hide(on) { const n = make(); if (n) n.style.display = on ? "none" : ""; },
  };
  window.__kheDemoPointer = api;
  if (!touch) {
    document.addEventListener("mousemove", (e) => api.place(e.clientX, e.clientY), true);
    document.addEventListener("mousedown", () => api.press(true), true);
    document.addEventListener("mouseup", () => api.press(false), true);
  }
}

// Runs in the page before its own scripts. Time starts at the given instant and keeps flowing.
function fixedClock(startMs) {
  const Real = Date;
  const offset = startMs - Real.now();
  class Fixed extends Real {
    constructor(...args) { if (args.length) super(...args); else super(Real.now() + offset); }
    static now() { return Real.now() + offset; }
  }
  window.Date = Fixed;
}

async function main() {
  const { opts, rest } = parseArgs(process.argv.slice(2));
  if (opts.help || opts.h) { help(); return 0; }
  const file = rest[0];
  if (!file) { help(); return 2; }
  if (!existsSync(file)) fail(2, `inconclusive: ${file} not found`);
  const text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  let script;
  try { script = JSON.parse(text); } catch (e) { fail(1, `unreadable: ${file} is not JSON: ${e.message}`); }

  // The gate first. A script that fails it is not worth a take.
  const never = checkScript(script, text, file).filter((f) => f.class === "never");
  if (never.length && !opts.force) {
    for (const f of never) console.error(`${f.line}: ${f.detail} (${f.file}:${f.lineNumber})`);
    fail(1, `not recorded: ${never.length} never-intentional line${never.length === 1 ? "" : "s"} in the script. Fix them, or pass --force and say why in DEMO.md`);
  }
  if (script.surface !== "web") fail(2, `inconclusive: record.mjs records the web surface. A ${script.surface} demo is walked with its driver and captured with ffmpeg (references/surfaces.md)`);

  const base = opts.url ? new URL(opts.url) : new URL(script.url);
  const startUrl = opts.url ? new URL(new URL(script.url).pathname + new URL(script.url).search, base).href : script.url;
  const host = new URL(startUrl).hostname;
  if (hostKind(startUrl) !== "local" && opts["allow-host"] !== host) {
    fail(2, `not recorded: ${host} is not a local host. Record only your own app or one you are authorised to demo, never real users' data. If that holds, pass --allow-host ${host}`);
  }
  const dry = !!opts["dry-run"];
  if (!dry && !opts.out) fail(2, "inconclusive: no --out file");
  const out = opts.out ? resolve(opts.out) : null;
  if (out && ![".mp4", ".webm"].includes(extname(out).toLowerCase())) fail(2, "inconclusive: --out ends in .mp4 or .webm; make a GIF from it with post.mjs gif");
  if (!dry && spawnSync("ffmpeg", ["-version"], { encoding: "utf8" }).status !== 0) fail(2, "inconclusive: ffmpeg not found on PATH; nothing was recorded. Install ffmpeg, or pass --dry-run to rehearse without it");

  const chromium = await loadPlaywright(opts.playwright);
  if (!chromium) fail(2, "inconclusive: playwright-core not found. Install it in your project (npm i -D playwright-core) or pass --playwright <project folder>");

  const vp = script.viewport;
  const touch = vp.touch === true;
  const state = script.state || {};
  let browser;
  try {
    // The DevTools screencast delivers CSS pixels unless the browser itself runs at the scale.
    browser = await chromium.launch({ channel: opts.channel || "chrome", headless: !opts.headed, args: [`--force-device-scale-factor=${vp.scale}`] });
  } catch (e) {
    fail(2, `inconclusive: could not launch ${opts.channel || "chrome"}: ${String(e.message).split("\n")[0]}`);
  }
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.scale,
    isMobile: touch,
    hasTouch: touch,
    locale: state.locale || "en-US",
    timezoneId: state.timezone || "UTC",
    colorScheme: state.scheme === "dark" ? "dark" : "light",
  });
  if (state.clock && !Number.isNaN(Date.parse(state.clock))) await context.addInitScript(fixedClock, Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(state.clock) ? state.clock : `${state.clock}Z`));
  await context.addInitScript(overlay, { touch });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message)));

  const pace = { cps: CPS, ...(script.pace || {}) };
  const moveRange = Array.isArray(pace.move_ms) ? pace.move_ms : [MOVE.min, MOVE.max];
  const start = { x: Math.round(vp.width * 0.62), y: Math.round(vp.height * 0.58) };
  const pos = { ...start };
  const takes = [];
  const frameRoot = opts["keep-frames"] ? resolve(opts["keep-frames"]) : mkdtempSync(join(tmpdir(), "khe-demo-"));
  mkdirSync(frameRoot, { recursive: true });
  let smallest = Infinity;

  const until = async (cond, label, take) => {
    const t0 = performance.now();
    const timeout = cond.timeout ?? TIMEOUT;
    const poll = async (fn) => {
      for (;;) {
        let ok = false;
        try { ok = await fn(); } catch { ok = false; }
        if (ok) return;
        if (performance.now() - t0 > timeout) throw new Error(`timed out after ${timeout} ms waiting for ${JSON.stringify({ ...cond, timeout: undefined, ramp: undefined })}`);
        await sleep(50);
      }
    };
    if ("visible" in cond) await page.locator(cond.visible).first().waitFor({ state: "visible", timeout });
    else if ("hidden" in cond) await page.locator(cond.hidden).first().waitFor({ state: "hidden", timeout });
    else if ("text" in cond) await poll(async () => (await page.locator(cond.in || "body").first().innerText()).includes(cond.text));
    else if ("url" in cond) await page.waitForURL(cond.url, { timeout });
    else if ("count" in cond) await poll(async () => (await page.locator(cond.count.of).count()) === cond.count.is);
    else if ("value" in cond) await poll(async () => (await page.locator(cond.value.of).first().inputValue()) === cond.value.is);
    else if ("fn" in cond) await page.waitForFunction(cond.fn, null, { timeout });
    else throw new Error(`"until" names no condition`);
    const ms = performance.now() - t0;
    take.waits.push({ at: label, ms: Math.round(ms), ...(cond.ramp ? { ramp: true } : {}) });
    if (!touch) await page.mouse.move(pos.x, pos.y);
    return ms;
  };

  const point = async (step) => {
    const loc = page.locator(step.target).first();
    await loc.waitFor({ state: "visible", timeout: TIMEOUT });
    await loc.scrollIntoViewIfNeeded();
    const box = await loc.boundingBox();
    if (!box) throw new Error(`${step.target} has no box`);
    const size = await loc.evaluate((n) => parseFloat(getComputedStyle(n).fontSize)).catch(() => NaN);
    if (Number.isFinite(size)) smallest = Math.min(smallest, size);
    // Aim inside the target and off its words: past the text of a field, under the label of a button.
    const field = await loc.evaluate((n) => n.matches("input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, [contenteditable]")).catch(() => false);
    const wide = box.width > 200;
    const fx = step.at?.x ?? (field ? 0.85 : wide ? Math.min(0.25, 80 / box.width) : 0.5);
    const fy = step.at?.y ?? (field ? 0.6 : wide ? 0.55 : 0.62);
    return { x: box.x + box.width * fx, y: box.y + box.height * fy, w: Math.max(8, Math.min(box.width, box.height)) };
  };

  // A hand reaches along a shallow arc and spends most of the time in the middle of the path.
  const glide = async (to) => {
    if (touch) { pos.x = to.x; pos.y = to.y; return; }
    const dx = to.x - pos.x, dy = to.y - pos.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 2) return;
    const ms = Math.min(moveRange[1], Math.max(moveRange[0], MOVE.a + MOVE.b * Math.log2(dist / to.w + 1)));
    const side = dx >= 0 ? -1 : 1;
    const cx = pos.x + dx / 2 + (-dy / dist) * dist * BOW * side;
    const cy = pos.y + dy / 2 + (dx / dist) * dist * BOW * side;
    const from = { ...pos };
    const steps = Math.max(2, Math.round(ms / (1000 / 60)));
    const t0 = performance.now();
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const e = t * t * t * (10 - 15 * t + 6 * t * t); // minimum jerk
      const x = (1 - e) * (1 - e) * from.x + 2 * (1 - e) * e * cx + e * e * to.x;
      const y = (1 - e) * (1 - e) * from.y + 2 * (1 - e) * e * cy + e * e * to.y;
      await page.mouse.move(x, y);
      const due = t0 + ms * t - performance.now();
      if (due > 0) await sleep(due);
    }
    pos.x = to.x; pos.y = to.y;
  };

  const press = async () => {
    if (touch) {
      await page.evaluate(([x, y]) => { window.__kheDemoPointer?.place(x, y); window.__kheDemoPointer?.show(true); }, [pos.x, pos.y]);
      await sleep(DWELL);
      await page.evaluate(() => window.__kheDemoPointer?.press(true));
      await page.touchscreen.tap(pos.x, pos.y);
      await sleep(PRESS);
      await page.evaluate(() => { window.__kheDemoPointer?.press(false); window.__kheDemoPointer?.show(false); });
      return;
    }
    await sleep(DWELL);
    await page.mouse.down();
    await sleep(PRESS);
    await page.mouse.up();
  };

  const runStep = async (step, label, take, rand) => {
    switch (step.do) {
      case "goto": await page.goto(new URL(step.url, startUrl).href, { waitUntil: "domcontentloaded" }); break;
      case "move": case "hover": await glide(await point(step)); break;
      case "scroll": await page.locator(step.target).first().scrollIntoViewIfNeeded(); break;
      case "click": await glide(await point(step)); await press(); break;
      case "select": await glide(await point(step)); await sleep(DWELL); await page.locator(step.target).first().selectOption(step.value); break;
      case "drag": {
        await glide(await point(step));
        await sleep(DWELL);
        await page.mouse.down();
        await sleep(PRESS);
        await glide(await point({ ...step, target: step.to }));
        await sleep(DWELL);
        await page.mouse.up();
        break;
      }
      case "type": {
        const focused = await page.locator(step.target).first().evaluate((n) => n === document.activeElement);
        if (!focused) { await glide(await point(step)); await press(); }
        const slot = 1000 / pace.cps;
        for (const ch of String(step.text)) {
          await page.keyboard.type(ch);
          await sleep(slot * (1 - JITTER + rand() * 2 * JITTER));
        }
        const got = await page.locator(step.target).first().inputValue().catch(() => null);
        if (got !== null && !got.endsWith(String(step.text))) throw new Error(`typed ${JSON.stringify(step.text)} and the field holds ${JSON.stringify(got)}`);
        break;
      }
      case "press": await sleep(DWELL); await page.keyboard.press(step.key); break;
      case "wait": break;
      case "hold": await sleep(step.ms); return;
      case "mark": take.marks.push({ name: step.name, ms: Math.round(performance.now() - take.t0) }); return;
      default: throw new Error(`unknown step "${step.do}"`);
    }
    if (step.until) await until(step.until, label, take);
    if (ACTING_STEPS.includes(step.do) || step.do === "type") await sleep(AFTER);
  };

  const reset = async () => {
    await page.goto(startUrl, { waitUntil: "load" });
    for (const [i, step] of (script.reset || []).entries()) {
      if (step.do === "storage") {
        await page.evaluate(({ clear, set }) => {
          if (clear) { localStorage.clear(); sessionStorage.clear(); }
          for (const [k, v] of Object.entries(set || {})) localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
        }, { clear: step.clear === true, set: step.set || {} });
      } else if (step.do === "cookies") await context.clearCookies();
      else if (step.do === "eval") await page.evaluate(step.js);
      else if (step.do === "request") {
        const url = new URL(step.url, startUrl);
        if (url.host !== new URL(startUrl).host) throw new Error(`reset step ${i + 1} posts to ${url.host}; a reset only talks to the app under demo`);
        const res = await fetch(url, { method: step.method || "POST", headers: { "content-type": "application/json" }, body: step.body === undefined ? undefined : JSON.stringify(step.body) });
        if (!res.ok) throw new Error(`reset step ${i + 1}: ${url.pathname} answered ${res.status}`);
      } else if (step.do === "command") {
        if (!opts["allow-commands"]) throw new Error(`reset step ${i + 1} runs "${step.run}"; read it, then pass --allow-commands`);
        const r = spawnSync(step.run, { shell: true, stdio: "inherit" });
        if (r.status !== 0) throw new Error(`reset step ${i + 1}: "${step.run}" exited ${r.status}`);
      }
    }
    await page.goto(startUrl, { waitUntil: "load" });
  };

  const still = async () => {
    await page.evaluate(() => window.__kheDemoPointer?.hide(true));
    const shot = await page.screenshot({ caret: "hide" });
    await page.evaluate(() => window.__kheDemoPointer?.hide(false));
    return createHash("sha1").update(shot).digest("hex");
  };

  // One DevTools session for the whole run; each take points it at its own folder.
  let sink = null;
  const cdp = dry ? null : await context.newCDPSession(page);
  cdp?.on("Page.screencastFrame", (e) => {
    cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId }).catch(() => {});
    if (!sink) return;
    const name = `${String(sink.frames.length + 1).padStart(6, "0")}.jpg`;
    sink.frames.push({ name, ts: e.metadata.timestamp });
    const data = Buffer.from(e.data, "base64");
    sink.writes.push(writeFile(join(sink.dir, name), data));
  });

  let exit = 0;
  try {
    for (let n = 1; n <= opts.takes; n++) {
      const take = { n, waits: [], marks: [], t0: 0 };
      const rand = mulberry(0x9e3779b9 ^ (script.demo || "demo").length);
      await reset();
      pos.x = start.x; pos.y = start.y;
      if (!touch) await page.mouse.move(pos.x, pos.y);
      if (script.ready) await until(script.ready, "ready", { waits: [] });
      const opening = "loop" in script ? await still() : null;

      const dir = join(frameRoot, `take-${n}`);
      rmSync(dir, { recursive: true, force: true });
      mkdirSync(dir, { recursive: true });
      const frames = [];
      const writes = [];
      if (cdp) {
        sink = { frames, writes, dir };
        await cdp.send("Page.startScreencast", { format: "jpeg", quality: 95, everyNthFrame: 1 });
      }
      const wall0 = Date.now() / 1000;
      take.t0 = performance.now();
      await sleep(HANDLE);

      for (const [b, beat] of (script.beats || []).entries()) {
        const beatStart = performance.now();
        for (const [i, step] of (beat.steps || []).entries()) {
          const label = `beat "${beat.id ?? b + 1}", step ${i + 1}`;
          try { await runStep(step, label, take, rand); } catch (e) { throw new Error(`${label} (${step.do}${step.target ? ` ${step.target}` : ""}): ${String(e.message).split("\n")[0]}`); }
        }
        console.log(`take ${n}: beat ${b + 1} "${beat.id ?? ""}" ${((performance.now() - beatStart) / 1000).toFixed(2)} s`);
      }
      if ("loop" in script) {
        for (const [i, step] of (script.loop.return || []).entries()) await runStep(step, `loop.return, step ${i + 1}`, take, rand);
        if (!touch) await glide({ ...start, w: 40 });
        await sleep(SETTLE);
      }
      await sleep(HANDLE);
      const wall1 = Date.now() / 1000;
      if (cdp) { await cdp.send("Page.stopScreencast").catch(() => {}); sink = null; await Promise.all(writes); }
      // Compared after the capture stops: hiding the pointer for the still must never reach the file.
      if ("loop" in script) take.seam = (await still()) === opening ? "match" : "differs";

      take.seconds = Math.round((performance.now() - take.t0) / 10) / 100;
      take.end_state = createHash("sha1").update(await page.evaluate(() => `${location.pathname}\n${document.body.innerText}`)).digest("hex").slice(0, 16);
      take.frames = frames.length;
      delete take.t0;
      for (const w of take.waits) if (w.ms > 1000 && !w.ramp) console.log(`take ${n}: ${w.at} waited ${w.ms} ms on camera`);
      takes.push(take);

      if (!dry) {
        if (frames.length < 2) throw new Error(`take ${n}: the screencast delivered ${frames.length} frame(s); nothing to encode`);
        const size = jpegSize(readFileSync(join(dir, frames[0].name)));
        take.frame_size = size;
        const want = [Math.round(vp.width * vp.scale), Math.round(vp.height * vp.scale)];
        if (size[0] !== want[0] || size[1] !== want[1]) throw new Error(`take ${n}: frames arrived at ${size.join(" x ")}, not ${want.join(" x ")}. Nothing was encoded: an upscaled take is not a take at scale ${vp.scale}`);
        // A frame is on screen from its own timestamp to the next one's. The first frame the
        // screencast sends can be older than the take, so every time is held inside the take.
        const clamp = (t) => Math.min(wall1, Math.max(wall0, t));
        const lines = ["ffconcat version 1.0"];
        frames.forEach((f, i) => {
          const from = i === 0 ? wall0 : clamp(f.ts);
          const to = i + 1 < frames.length ? clamp(frames[i + 1].ts) : wall1;
          lines.push(`file '${f.name}'`, `duration ${Math.max(0.001, to - from).toFixed(4)}`);
        });
        // The concat demuxer drops the last duration unless the file is listed again, and some
        // builds then count it twice. List it again and cut the output to the take's own length.
        lines.push(`file '${frames.at(-1).name}'`);
        writeFileSync(join(dir, "frames.ffconcat"), lines.join("\n") + "\n");
        const length = (Math.round((wall1 - wall0) * script.fps) / script.fps).toFixed(4);
        if (n === opts.takes) {
          mkdirSync(dirname(out), { recursive: true });
          const codec = extname(out).toLowerCase() === ".webm"
            ? ["-c:v", "libvpx-vp9", "-crf", "30", "-b:v", "0", "-row-mt", "1"]
            : ["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-movflags", "+faststart"];
          const args = ["-y", "-hide_banner", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", "frames.ffconcat",
            "-vf", `fps=${script.fps},scale=in_range=full:out_range=tv,format=yuv420p`,
            "-t", length, ...codec, "-an", out];
          const r = spawnSync("ffmpeg", args, { cwd: dir, encoding: "utf8" });
          if (r.status !== 0) throw new Error(`ffmpeg failed: ${(r.stderr || "").trim().split("\n").slice(-2).join(" ")}`);
        }
      }
      console.log(`take ${n}: ${take.seconds} s, ${frames.length} frames captured${take.seam ? `, seam ${take.seam}` : ""}, end state ${take.end_state}`);
    }
  } catch (e) {
    console.error(`failed: ${e.message}`);
    exit = 1;
  } finally {
    await browser.close().catch(() => {});
    if (!opts["keep-frames"]) rmSync(frameRoot, { recursive: true, force: true });
  }

  const report = {
    script: file.replace(/\\/g, "/"),
    demo: script.demo ?? null,
    recorded: !dry && exit === 0 ? out.replace(/\\/g, "/") : null,
    dry_run: dry,
    viewport: { width: vp.width, height: vp.height, scale: vp.scale },
    fps: script.fps,
    measured: { smallest_target_text: Number.isFinite(smallest) ? smallest : null },
    page_errors: errors,
    takes,
  };
  const reportPath = opts.report ? resolve(opts.report) : out ? out.replace(/\.[^.]+$/, ".take.json") : null;
  if (reportPath) writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");

  if (Number.isFinite(smallest)) console.log(`smallest text on a target: ${smallest} px (the script says ${script.smallest_text})`);
  if (errors.length) console.log(`page errors: ${errors.length} (${errors[0]})`);
  if (takes.length > 1) console.log(new Set(takes.map((t) => t.end_state)).size === 1 ? `repeatable: ${takes.length} takes ended on the same screen` : `take-differs: ${takes.length} takes ended on different screens; the reset does not restore the state`);
  if (exit) return exit;
  if (dry) { console.log(`dry run finished: every step met its condition. Holds over ${HOLD_CAP} ms: ${(script.beats || []).flatMap((b) => b.steps || []).filter((s) => s.do === "hold" && s.ms > HOLD_CAP).length}. Nothing was recorded`); return 0; }
  console.log(`recorded ${out.replace(/\\/g, "/")}`);
  console.log(`next: node scripts/demo-check.mjs ${file.replace(/\\/g, "/")} ${reportPath.replace(/\\/g, "/")} ${out.replace(/\\/g, "/")} --gate`);
  return 0;
}

main().then((code) => process.exit(code), (e) => { console.error(e); process.exit(1); });
