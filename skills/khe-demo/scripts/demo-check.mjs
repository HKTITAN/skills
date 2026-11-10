#!/usr/bin/env node
// demo-check: the gate for khe-demo.
//
//   node scripts/demo-check.mjs <files or folders...> [--gate] [--report out.json]
//        [--strict] [--self-test] [--help]
//
// Reads a demo script (*.demo.json), a take report written by record.mjs
// (*.take.json) and, through ffprobe when it is on PATH, the recording itself.
// Node 20+, no dependencies. Exit 0 passed, 1 failed, 2 inconclusive.

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = join(HERE, "..");
const GATE = "demo-check";

// ---------------------------------------------------------------- the numbers
// Each one is explained in references/capture.md, script.md or state.md.

export const DEST = {
  // seconds: the length a finished file may run. mb: the file-size ceiling.
  // shown: the CSS width the file is displayed at when the script does not say.
  readme: { seconds: [4, 20], mb: 10, shown: 830 },
  site: { seconds: [4, 30], mb: 4, shown: null },
  social: { seconds: [4, 45], mb: 30, shown: 600 },
  film: { seconds: [4, 30], mb: null, shown: null },
};
export const GIF_MB = 10; // the size GitHub accepts for an attached image
export const GIF_FPS = [10, 12.5, 20, 25, 50]; // a GIF frame delay is whole centiseconds
export const BEATS = [2, 5];
export const HOLD_CAP = 1500; // ms a plain hold may last
export const PAYOFF_HOLD = [1500, 3000];
export const MOVE_FLOOR = 150; // ms; a pointer move shorter than this reads as a jump
export const CPS = [6, 15];
export const TYPE_MAX = 60; // characters typed on camera in one step
export const TEXT_FLOOR = 9; // px on the viewer's screen
export const TEXT_COMFORT = 11;
export const SLOW_WAIT = 1000; // ms of real waiting before it must be ramped

export const POINTER_STEPS = ["move", "hover", "click", "type", "select", "drag", "scroll"];
export const ACTING_STEPS = ["goto", "click", "press", "select", "drag"];
export const STEP_KINDS = [...new Set([...POINTER_STEPS, ...ACTING_STEPS, "wait", "hold", "mark"])];
export const RESET_KINDS = ["storage", "cookies", "eval", "request", "command", "launch"];
export const UNTIL_KEYS = ["visible", "hidden", "text", "url", "count", "value", "fn"];
const SURFACES = { web: ["playwright", "agent-browser"], desktop: ["agent-desktop", "agent-browser", "manual"] };
const CAPTURES = ["gdigrab", "ddagrab", "avfoundation", "x11grab"];
const VIDEO = [".mp4", ".mov", ".m4v", ".webm", ".mkv", ".gif"];

const LINES = {
  never: {
    "unreadable": "the file does not parse, or is not a demo script",
    "no-surface": "no surface, a driver that cannot drive it, or a desktop plan with no app, window or capture",
    "no-destination": "no destination, so no length, size or reading distance to hold the take to",
    "no-viewport": "no viewport width, height and scale",
    "no-fps": "no frame rate, or one that is not 30 or 60",
    "odd-size": "a capture size H.264 cannot hold: an odd number of pixels on a side",
    "tiny-ui": "the smallest text lands under 9 px on the viewer's screen, or nobody measured it",
    "beat-count": "fewer than 2 beats or more than 5",
    "no-payoff": "no payoff beat, or one that is not the last beat",
    "payoff-hold": "the payoff does not end on a hold of 1500 to 3000 ms",
    "no-reset": "no reset steps, so the second take starts from what the first one left",
    "unknown-step": "a step or a reset step the runner does not know",
    "no-target": "a pointer step with no target",
    "brittle-target": "a target by position, by generated class, by coordinate or by a snapshot ref",
    "no-wait": "a step that changes the screen and names no condition to wait for",
    "fixed-sleep": "a sleep where a condition belongs, or a hold over 1500 ms outside the payoff",
    "teleport": "a pointer move with no travel time",
    "loop-seam": "a loop with no visible way back to its first frame, or whose last frame is not its first",
    "secret-on-camera": "something shaped like a key, token, card number or credential in what the script types, loads or opens",
    "real-email": "an email address outside the reserved example domains",
    "take-differs": "two takes of one script ended on different screens",
    "take-duration": "the file runs shorter or longer than its destination allows",
    "take-resolution": "the file's size is not the declared viewport times scale, nor a declared output",
    "take-fps": "the file's frame rate is not the declared one",
    "take-size": "the file is over its destination's size ceiling",
    "take-codec": "an .mp4 that is not H.264 in yuv420p",
    "gif-fps": "a GIF at a rate its frame delay cannot hold",
  },
  candidate: {
    "beat-edge": "two beats: one gesture and its answer",
    "no-what": "a beat that does not say what the viewer sees happen",
    "hold-no-why": "a hold with no reason",
    "wander": "a pointer move that the next step does not use",
    "text-target": "a target found by its visible words",
    "long-type": "more than 60 characters typed on camera in one step",
    "type-speed": "typing outside 6 to 15 characters a second",
    "password-step": "a password, code or card field typed on camera",
    "production-url": "a host that is not local and is not marked as a test environment",
    "no-clock": "no fixed clock, so a date on screen changes between takes",
    "scale-1": "captured at scale 1, with no pixels to crop into",
    "small-ui": "the smallest text lands between 9 and 11 px on the viewer's screen",
    "viewport-fit": "a viewport that is not the one the references give for this destination",
    "whole-desktop": "a capture area that is the whole display",
    "one-take": "the script was recorded once, so nothing shows it runs twice",
    "slow-wait": "a wait that took over 1000 ms on camera and is not marked for a ramp",
    "gif-size-edge": "a GIF between 5 and 10 MB",
  },
};
const NOT_CHECKED = [
  "whether the story is the right one, and whether the payoff is worth watching",
  "any pixel: what is on screen, whether it is real data, a notification, a bookmarks bar or a name",
  "that the pointer's path looks like a hand: watch the take",
  "dead air inside the file: the gate reads the script's holds and the report's waits, never the frames",
  "that post-production did what it claimed: trims, ramps and zooms are judged by eye",
  "that the app is yours to record, and that the account on screen is a test account",
];

// ------------------------------------------------------------------- findings

const cls = (line) => (line in LINES.never ? "never" : "candidate");
const finding = (line, detail, file, lineNumber = 1) => ({ line, file, lineNumber, detail, class: cls(line) });

/** Every object that carries a "do" key, in document order, with where it sits. */
export function walkSteps(script) {
  const out = [];
  const push = (list, where) => {
    if (!Array.isArray(list)) return;
    list.forEach((step, index) => { if (step && typeof step === "object") out.push({ step, index, ...where }); });
  };
  for (const [key, value] of Object.entries(script || {})) {
    if (key === "reset") push(value, { part: "reset" });
    else if (key === "beats" && Array.isArray(value)) value.forEach((beat, b) => push(beat?.steps, { part: "beat", beat: b, beatId: beat?.id ?? String(b + 1) }));
    else if (key === "loop") push(value?.return, { part: "loop.return" });
  }
  return out;
}

function stepLines(text) {
  const lines = [];
  const re = /"do"\s*:/g;
  let m;
  while ((m = re.exec(text))) lines.push(text.slice(0, m.index).split("\n").length);
  return lines;
}
const keyLine = (text, key) => {
  const i = text.search(new RegExp(`"${key}"\\s*:`));
  return i < 0 ? 1 : text.slice(0, i).split("\n").length;
};

// ----------------------------------------------------------- secrets and hosts

const SECRET_SHAPES = [
  [/\bsk-[A-Za-z0-9_-]{16,}/, "an API key (sk-)"],
  [/\b(?:sk|pk|rk)_live_[A-Za-z0-9]{10,}/, "a live payment key"],
  [/\b(?:ghp|gho|ghu|ghs|github_pat)_[A-Za-z0-9_]{20,}/, "a GitHub token"],
  [/\bAKIA[0-9A-Z]{16}\b/, "an AWS access key id"],
  [/\bAIza[0-9A-Za-z_-]{30,}/, "a Google API key"],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}/, "a Slack token"],
  [/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./, "a JWT"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY/, "a private key"],
  [/\b[0-9a-f]{32,}\b/i, "32 or more hex characters"],
  [/:\/\/[^\s/:@]+:[^\s/@]+@/, "credentials inside a URL"],
  [/[?&](?:token|key|secret|password|passwd|apikey|api_key|access_token|auth)=[^&\s]{8,}/i, "a credential in a query string"],
];
const TEST_CARDS = ["4242424242424242", "4000056655665556", "5555555555554444", "2223003122003222", "5200828282828210", "378282246310005", "371449635398431", "6011111111111117", "4111111111111111"];
const luhn = (digits) => {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
};
const RESERVED = /(^|\.)(example\.(com|org|net)|example|test|invalid|localhost)$/i;

/** What in this string must never be on camera. Returns [{ line, what }]. */
export function findSecrets(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  const out = [];
  for (const [re, what] of SECRET_SHAPES) if (re.test(text)) out.push({ line: "secret-on-camera", what });
  if (/[A-Za-z0-9+/_-]{40,}/.test(text)) {
    const blob = text.match(/[A-Za-z0-9+/_-]{40,}/)[0];
    if (/[a-z]/.test(blob) && /[A-Z]/.test(blob) && /[0-9]/.test(blob) && !/^[0-9a-f]+$/i.test(blob)) out.push({ line: "secret-on-camera", what: "40 or more characters of mixed base64" });
  }
  for (const m of text.matchAll(/\b(?:\d[ -]?){13,19}\b/g)) {
    const digits = m[0].replace(/\D/g, "");
    if (digits.length >= 13 && luhn(digits) && !TEST_CARDS.includes(digits)) out.push({ line: "secret-on-camera", what: "a card number that is not a published test card" });
  }
  for (const m of text.matchAll(/[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*)/g)) {
    if (!RESERVED.test(m[1])) out.push({ line: "real-email", what: `${m[0]} (use example.com, example.org, example.net or a .test name)` });
  }
  const seen = new Set();
  return out.filter((f) => !seen.has(f.line + f.what) && seen.add(f.line + f.what));
}

/** local: a loopback or reserved development name. test: a label that marks a test environment. */
export function hostKind(url) {
  let host;
  try { host = new URL(url).hostname.replace(/^\[|\]$/g, ""); } catch { return "unknown"; }
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || /\.(localhost|test)$/i.test(host)) return "local";
  if (host.split(".").slice(0, -1).some((label) => /^(staging|stage|dev|test|qa|sandbox|preview|demo)(-|\d|$)|-(staging|dev|test|qa|sandbox|preview|demo)$/i.test(label))) return "test";
  return "other";
}

const BRITTLE = [
  [/:nth-(?:child|of-type|last-child)\(|>>\s*nth=|:nth\(/, "by position; a reseed or one new row moves it"],
  [/^(?:xpath=|\/\/|\/html|\()/, "an XPath; it encodes the page's structure"],
  [/^\s*\d+\s*,\s*\d+\s*$/, "raw coordinates; they point at a pixel, never at a control"],
  [/\.(?:css|sc|jsx|svelte|emotion)-[A-Za-z0-9]{4,}|\.[A-Za-z][\w-]*_[\w-]+__[A-Za-z0-9_-]{5}\b|\[class[*^$]?=/, "a generated class; the next build renames it"],
  [/^@(?:e\d+|s[a-z0-9]+:e\d+)$/, "a snapshot ref; it dies with the snapshot it came from"],
];
export function brittle(target) {
  if (target && typeof target === "object") return "x" in target || "y" in target ? "raw coordinates; they point at a pixel, never at a control" : null;
  if (typeof target !== "string") return null;
  for (const [re, why] of BRITTLE) if (re.test(target)) return why;
  if ((target.match(/\s>\s/g) || []).length > 3) return "a path four levels deep; it encodes the page's structure";
  return null;
}

// ------------------------------------------------------------ the demo script

const num = (v) => typeof v === "number" && Number.isFinite(v);
const hasUntil = (u) => !!u && typeof u === "object" && UNTIL_KEYS.some((k) => k in u);

export function kindOf(obj) {
  if (obj && typeof obj === "object" && Array.isArray(obj.takes) && "script" in obj) return "take";
  if (obj && typeof obj === "object" && ("beats" in obj || "surface" in obj || "reset" in obj)) return "script";
  return "other";
}

/** Everything a script can prove about a demo before it is recorded. */
export function checkScript(script, text = "", file = "demo.json") {
  const out = [];
  const add = (line, detail, lineNumber) => out.push(finding(line, detail, file, lineNumber ?? 1));
  const at = (key) => keyLine(text, key);
  const lines = stepLines(text);
  const steps = walkSteps(script);
  const withDo = steps.filter((s) => "do" in s.step);
  const lineOfStep = (step) => lines[withDo.findIndex((s) => s.step === step)] ?? keyLine(text, "beats");
  const where = (s) => (s.part === "beat" ? `beat "${s.beatId}", step ${s.index + 1}` : `${s.part}, step ${s.index + 1}`);

  // surface and driver
  const surface = script.surface;
  if (!(surface in SURFACES)) add("no-surface", `"surface" is ${JSON.stringify(surface)}; name "web" or "desktop"`, at("surface"));
  else if (!SURFACES[surface].includes(script.driver)) add("no-surface", `driver ${JSON.stringify(script.driver)} does not drive a ${surface} surface; use ${SURFACES[surface].join(" or ")}`, at("driver"));
  if (surface === "web" && typeof script.url !== "string") add("no-surface", `a web demo names the "url" it opens`, at("surface"));
  if (surface === "desktop") {
    if (!script.app) add("no-surface", `a desktop demo names its "app"`, at("surface"));
    if (!CAPTURES.includes(script.capture?.with)) add("no-surface", `a desktop demo names "capture.with": ${CAPTURES.join(", ")}; no driver records a desktop app`, at("capture"));
    else if (script.capture.area !== "window") add("whole-desktop", `capture.area is ${JSON.stringify(script.capture.area)}; ask the user before recording more than the app's window`, at("capture"));
  }

  // destination, viewport, fps
  const dest = DEST[script.destination];
  if (!dest) add("no-destination", `"destination" is ${JSON.stringify(script.destination)}; name ${Object.keys(DEST).join(", ")}`, at("destination"));
  const boxKey = surface === "desktop" ? "window" : "viewport";
  const box = script[boxKey];
  const boxOk = box && num(box.width) && num(box.height) && num(box.scale) && box.width > 0 && box.height > 0 && box.scale > 0;
  if (!boxOk) add("no-viewport", `"${boxKey}" needs width, height and scale as numbers; the capture size is their product`, at(boxKey));
  if (![30, 60].includes(script.fps)) add("no-fps", `"fps" is ${JSON.stringify(script.fps)}; record at 30, or 60 for a drag or a scroll`, at("fps"));
  if (boxOk) {
    const w = box.width * box.scale, h = box.height * box.scale;
    if (!Number.isInteger(w) || !Number.isInteger(h) || w % 2 || h % 2) add("odd-size", `${box.width} x ${box.height} at scale ${box.scale} is ${w} x ${h}; both sides must be even whole pixels`, at(boxKey));
    if (box.scale === 1) add("scale-1", `scale 1 leaves no pixels to crop into; capture at 2`, at(boxKey));
    const fit = dest && FIT[script.destination];
    if (fit && !fit.some(([fw, fh]) => fw === box.width && fh === box.height)) add("viewport-fit", `${box.width} x ${box.height} is not a ${script.destination} size (${fit.map((f) => f.join(" x ")).join(", ")})`, at(boxKey));
  }

  // reading size
  if (boxOk && dest) {
    if (!num(script.smallest_text)) add("tiny-ui", `"smallest_text" is missing: measure the smallest text the viewer has to read, in CSS px`, at("smallest_text"));
    else {
      const shown = Math.min(num(script.shown_width) ? script.shown_width : dest.shown ?? box.width, box.width * box.scale);
      const zoom = num(script.post?.zoom) ? script.post.zoom : 1;
      const capped = Math.round(((script.smallest_text * zoom * shown) / box.width) * 10) / 10;
      if (capped < TEXT_FLOOR) add("tiny-ui", `${script.smallest_text} px text in a ${box.width} px viewport shown ${shown} px wide${zoom !== 1 ? ` at zoom ${zoom}` : ""} lands at ${capped} px; the floor is ${TEXT_FLOOR}`, at("smallest_text"));
      else if (capped < TEXT_COMFORT) add("small-ui", `the smallest text lands at ${capped} px on the viewer's screen; ${TEXT_COMFORT} is comfortable`, at("smallest_text"));
    }
  }

  // state
  if (!Array.isArray(script.reset) || script.reset.length === 0) add("no-reset", `"reset" is empty: name the steps that put the app back to its seeded state before every take`, at("reset"));
  if (!script.state?.clock) add("no-clock", `"state.clock" is not set; freeze it so a date on screen does not date the take`, at("state"));
  for (const s of findSecrets(script.state?.account)) add(s.line, `state.account holds ${s.what}`, at("account"));
  if (typeof script.url === "string") {
    for (const s of findSecrets(script.url)) add(s.line, `the url holds ${s.what}`, at("url"));
    if (hostKind(script.url) === "other") add("production-url", `${new URL(script.url).hostname} is not local and carries no test label; real users' data may be on screen`, at("url"));
  }

  // pace
  const pace = script.pace || {};
  if (Array.isArray(pace.move_ms) && num(pace.move_ms[0]) && pace.move_ms[0] < MOVE_FLOOR) add("teleport", `pace.move_ms starts at ${pace.move_ms[0]} ms; under ${MOVE_FLOOR} ms the pointer reads as a jump`, at("move_ms"));
  if (num(pace.cps) && (pace.cps < CPS[0] || pace.cps > CPS[1])) add("type-speed", `pace.cps is ${pace.cps}; ${CPS[0]} to ${CPS[1]} characters a second is the range a viewer reads along with`, at("cps"));

  // beats
  const beats = Array.isArray(script.beats) ? script.beats : [];
  if (beats.length < BEATS[0] || beats.length > BEATS[1]) add("beat-count", `${beats.length} beats; a demo is ${BEATS[0]} to ${BEATS[1]}, and one thing happens`, at("beats"));
  else if (beats.length === 2) add("beat-edge", `two beats: confirm the opening frame already shows where the viewer is`, at("beats"));
  const payoffAt = beats.findIndex((b) => b?.payoff === true);
  if (beats.length && (payoffAt < 0 || payoffAt !== beats.length - 1 || beats.filter((b) => b?.payoff === true).length !== 1)) {
    add("no-payoff", payoffAt < 0 ? `no beat is marked "payoff": true` : `the payoff is beat ${payoffAt + 1} of ${beats.length}; it is the last thing that happens, once`, at("beats"));
  } else if (beats.length) {
    const last = (beats[payoffAt].steps || []).at(-1);
    if (last?.do !== "hold" || !num(last.ms) || last.ms < PAYOFF_HOLD[0] || last.ms > PAYOFF_HOLD[1]) {
      add("payoff-hold", last?.do === "hold" ? `the payoff holds ${last.ms} ms; hold it ${PAYOFF_HOLD[0]} to ${PAYOFF_HOLD[1]} ms so the result is read` : `the payoff beat does not end on a hold; end it on ${PAYOFF_HOLD[0]} to ${PAYOFF_HOLD[1]} ms`, last ? lineOfStep(last) : at("payoff"));
    }
  }
  beats.forEach((beat, b) => {
    if (!beat?.what) add("no-what", `beat ${b + 1} does not say what the viewer sees happen`, keyLine(text, "beats"));
  });

  // steps
  for (const s of steps) {
    const { step } = s;
    const line = lineOfStep(step);
    const kinds = s.part === "reset" ? RESET_KINDS : STEP_KINDS;
    if (!kinds.includes(step.do)) { add("unknown-step", `${where(s)}: "${step.do}" is not a ${s.part === "reset" ? "reset" : "step"} kind (${kinds.join(", ")})`, line); continue; }
    if (s.part === "reset") {
      for (const f of findSecrets({ ...step, do: undefined })) add(f.line, `${where(s)} loads ${f.what}`, line);
      continue;
    }
    if (POINTER_STEPS.includes(step.do)) {
      if (step.target === undefined || step.target === "") add("no-target", `${where(s)}: "${step.do}" names no target`, line);
      else {
        const why = brittle(step.target);
        if (why) add("brittle-target", `${where(s)}: ${JSON.stringify(step.target)} is ${why}`, line);
        else if (typeof step.target === "string" && /^text=|:has-text\(|:text\(|^"/.test(step.target)) add("text-target", `${where(s)}: ${step.target} finds the control by its words; a copy change breaks the script`, line);
      }
      if (step.instant === true || step.ms === 0) add("teleport", `${where(s)}: the pointer arrives with no travel`, line);
    }
    if (ACTING_STEPS.includes(step.do) && !hasUntil(step.until)) add("no-wait", `${where(s)}: "${step.do}" changes the screen and waits for nothing; add "until" (${UNTIL_KEYS.join(", ")})`, line);
    if (step.do === "wait" && !hasUntil(step.until)) add("fixed-sleep", `${where(s)}: a wait with no condition is a sleep; wait on what the viewer is waiting for`, line);
    if (step.do === "hold") {
      // With no payoff marked, the last beat's closing hold is judged as one: no-payoff already says so.
      const closing = payoffAt >= 0 ? payoffAt : beats.length - 1;
      const isPayoffEnd = s.part === "beat" && s.beat === closing && s.index === (beats[closing]?.steps || []).length - 1;
      if (!num(step.ms)) add("fixed-sleep", `${where(s)}: a hold with no "ms"`, line);
      else if (!isPayoffEnd && step.ms > HOLD_CAP) add("fixed-sleep", `${where(s)}: a ${step.ms} ms hold; outside the payoff the cap is ${HOLD_CAP} ms, and loading is waited for by condition`, line);
      if (!step.why) add("hold-no-why", `${where(s)}: a hold with no "why"; say what is being read`, line);
    }
    if (step.do === "type" || step.do === "select") {
      const typed = step.text ?? step.value ?? "";
      for (const f of findSecrets(typed)) add(f.line, `${where(s)} types ${f.what}`, line);
      if (typeof typed === "string" && typed.length > TYPE_MAX) add("long-type", `${where(s)}: ${typed.length} characters typed on camera; past ${TYPE_MAX} seed it or paste it`, line);
      if (typeof step.target === "string" && /passw|otp|one-time|cvc|cvv|card|secret|token/i.test(step.target)) add("password-step", `${where(s)}: ${step.target} is typed on camera; start the take signed in, or use the seed file's test account`, line);
    }
    if (step.do === "goto" && typeof step.url === "string") for (const f of findSecrets(step.url)) add(f.line, `${where(s)} opens ${f.what}`, line);
    if (step.do === "move" && !step.why) {
      const next = steps[steps.indexOf(s) + 1];
      if (!next || next.part !== s.part || next.step.target !== step.target) add("wander", `${where(s)}: the pointer goes to ${JSON.stringify(step.target)} and the next step does not use it`, line);
    }
  }

  // the loop
  if ("loop" in script) {
    const back = Array.isArray(script.loop?.return) ? script.loop.return : [];
    if (!back.some((st) => ACTING_STEPS.includes(st?.do) && hasUntil(st.until))) add("loop-seam", `"loop.return" has no step that undoes what the demo added; the last frame must be the first, by a cause the viewer sees`, at("loop"));
  }
  return out;
}

// Viewports the references give per destination (references/capture.md).
const FIT = {
  readme: [[1024, 640], [960, 600], [390, 844], [360, 640]],
  site: [[1280, 720], [1280, 800], [1024, 640], [390, 844], [360, 640]],
  social: [[960, 540], [540, 540], [360, 640], [390, 844]],
  film: [[1280, 720], [390, 844], [360, 640]],
};

// ----------------------------------------------------------- the take report

/** What record.mjs measured while it ran the script. */
export function checkTake(report, script, file = "take.json") {
  const out = [];
  const add = (line, detail) => out.push(finding(line, detail, file, 1));
  const takes = Array.isArray(report.takes) ? report.takes : [];
  if (takes.length < 2) add("one-take", `${takes.length} take recorded; run with --takes 2 to show the reset works`);
  const ends = new Set(takes.map((t) => t.end_state).filter(Boolean));
  if (ends.size > 1) add("take-differs", `${takes.length} takes ended on ${ends.size} different screens; the reset does not restore the state`);
  for (const [i, take] of takes.entries()) {
    for (const w of take.waits || []) {
      if (w.ms > SLOW_WAIT && !w.ramp) add("slow-wait", `take ${i + 1}, ${w.at}: waited ${Math.round(w.ms)} ms on camera; mark it "ramp": true and speed it up in post, or make the app answer sooner`);
    }
    if (script && "loop" in script && take.seam === "differs") add("loop-seam", `take ${i + 1}: the frame after loop.return is not the opening frame`);
  }
  return out;
}

// -------------------------------------------------------------- the recording

function ffprobePath() {
  if (process.env.KHE_DEMO_FFPROBE) return existsSync(process.env.KHE_DEMO_FFPROBE) ? process.env.KHE_DEMO_FFPROBE : null;
  const r = spawnSync("ffprobe", ["-version"], { encoding: "utf8" });
  return r.status === 0 ? "ffprobe" : null;
}
const ratio = (s) => {
  if (!s || s === "0/0") return null;
  const [a, b] = String(s).split("/").map(Number);
  return b ? a / b : a;
};
export function probe(file, bin = ffprobePath()) {
  if (!bin) return null;
  const r = spawnSync(bin, ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height,r_frame_rate,avg_frame_rate,pix_fmt:format=duration,size", "-of", "json", file], { encoding: "utf8" });
  if (r.status !== 0) return { error: (r.stderr || "ffprobe failed").trim().split("\n")[0] };
  const j = JSON.parse(r.stdout);
  const st = j.streams?.[0];
  if (!st) return { error: "no video stream" };
  return { codec: st.codec_name, width: st.width, height: st.height, fps: ratio(st.avg_frame_rate) ?? ratio(st.r_frame_rate), pix_fmt: st.pix_fmt, duration: Number(j.format?.duration), bytes: Number(j.format?.size) };
}

/** A probed file against the script it was recorded from. */
export function checkRecording(p, script, file) {
  const out = [];
  const add = (line, detail) => out.push(finding(line, detail, file, 1));
  const dest = DEST[script.destination];
  const box = script.surface === "desktop" ? script.window : script.viewport;
  const gif = extname(file).toLowerCase() === ".gif" || p.codec === "gif";
  if (dest && Number.isFinite(p.duration)) {
    const [lo, hi] = dest.seconds;
    if (p.duration < lo || p.duration > hi) add("take-duration", `${p.duration.toFixed(1)} s; a ${script.destination} file runs ${lo} to ${hi} s`);
  }
  if (box && num(box.width) && num(box.scale)) {
    const full = [Math.round(box.width * box.scale), Math.round(box.height * box.scale)];
    const allowed = [full, [box.width, box.height], ...(script.outputs || []).filter((o) => num(o.width) && num(o.height)).map((o) => [o.width, o.height])];
    const exact = allowed.some(([w, h]) => w === p.width && h === p.height);
    const sameShape = Math.abs(p.width / p.height - box.width / box.height) < 0.01 && p.width <= full[0];
    if (!exact && !(gif && sameShape)) add("take-resolution", `${p.width} x ${p.height}; the script declares ${box.width} x ${box.height} at scale ${box.scale} (${full.join(" x ")})${script.outputs ? " and its outputs" : ""}`);
  }
  if (gif) {
    if (p.fps && !GIF_FPS.some((f) => Math.abs(f - p.fps) < 0.3)) add("gif-fps", `${p.fps.toFixed(2)} fps; a GIF delay is whole centiseconds, so use ${GIF_FPS.join(", ")}`);
    const mb = p.bytes / 1e6;
    if (mb > GIF_MB) add("take-size", `${mb.toFixed(1)} MB; ${GIF_MB} MB is the ceiling for a GIF`);
    else if (mb > GIF_MB / 2) add("gif-size-edge", `${mb.toFixed(1)} MB; a README loads it on every visit, so narrow it, shorten it or ship the .mp4`);
  } else {
    if (p.fps && num(script.fps) && Math.abs(p.fps - script.fps) > 0.5) add("take-fps", `${p.fps.toFixed(2)} fps; the script declares ${script.fps}`);
    if (dest?.mb && p.bytes / 1e6 > dest.mb) add("take-size", `${(p.bytes / 1e6).toFixed(1)} MB; a ${script.destination} file stays under ${dest.mb} MB`);
    if (/\.(mp4|m4v|mov)$/i.test(file) && (p.codec !== "h264" || p.pix_fmt !== "yuv420p")) add("take-codec", `${p.codec} in ${p.pix_fmt}; an .mp4 is H.264 in yuv420p or Safari and hardware decoders refuse it`);
  }
  return out;
}

// --------------------------------------------------------------------- running

function collect(paths) {
  const files = [];
  const missing = [];
  const walk = (p) => {
    if (!existsSync(p)) { missing.push(p); return; }
    if (statSync(p).isDirectory()) {
      for (const f of readdirSync(p).sort()) {
        if (f === "node_modules" || f === "app" || f.startsWith(".")) continue;
        const q = join(p, f);
        if (statSync(q).isDirectory()) walk(q);
        else if (f.endsWith(".json") || VIDEO.includes(extname(f).toLowerCase())) files.push(q);
      }
    } else files.push(p);
  };
  paths.forEach(walk);
  return { files, missing };
}

/** Check a list of files. Returns { findings, files, notChecked, inconclusive }. */
export function run(paths, { ffprobe = ffprobePath() } = {}) {
  const { files, missing } = collect(paths);
  const findings = [];
  const notChecked = [];
  const inconclusive = missing.map((m) => `${m} not found`);
  const scripts = new Map();
  let lastScript = null;
  const parsed = [];
  for (const file of files) {
    if (!file.endsWith(".json")) { parsed.push({ file, kind: "video" }); continue; }
    const text = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    let obj;
    try { obj = JSON.parse(text); } catch (e) { findings.push(finding("unreadable", `not JSON: ${e.message}`, file)); continue; }
    const kind = kindOf(obj);
    if (kind === "other") { if (/\.demo\.json$|(^|[\\/])demo\.json$/.test(file)) findings.push(finding("unreadable", "no beats, surface or reset: not a demo script", file)); continue; }
    parsed.push({ file, kind, obj, text });
    if (kind === "script") scripts.set(file, obj);
  }
  const only = scripts.size === 1 ? [...scripts.values()][0] : null;
  const stem = (f) => basename(f).replace(/\.(demo|take)\.json$/, "").replace(/\.[^.]+$/, "");
  const scriptFor = (file) => {
    if (only) return only;
    const s = stem(file);
    for (const [f, obj] of scripts) if (dirname(f) === dirname(file) && (s === stem(f) || s.startsWith(stem(f) + ".") || s.startsWith(stem(f) + "-"))) return obj;
    return lastScript;
  };
  let checked = 0;
  for (const item of parsed) {
    if (item.kind === "script") { findings.push(...checkScript(item.obj, item.text, item.file)); lastScript = item.obj; checked++; continue; }
    const script = scriptFor(item.file);
    if (item.kind === "take") { findings.push(...checkTake(item.obj, script, item.file)); checked++; continue; }
    if (!script) { inconclusive.push(`${item.file}: no demo script to check it against`); continue; }
    if (!ffprobe) { inconclusive.push(`ffprobe not found; ${item.file} was not probed`); notChecked.push(`${item.file}: duration, size, frame rate and codec`); continue; }
    const p = probe(item.file, ffprobe);
    if (p.error) { findings.push(finding("unreadable", `ffprobe: ${p.error}`, item.file)); continue; }
    console.log(`recording: ${item.file}: ${p.duration.toFixed(2)} s, ${p.width} x ${p.height}, ${p.fps ? p.fps.toFixed(2) : "?"} fps, ${p.codec}/${p.pix_fmt}, ${(p.bytes / 1e6).toFixed(2)} MB`);
    findings.push(...checkRecording(p, script, item.file));
    checked++;
  }
  if (!checked && !findings.length && !inconclusive.length) inconclusive.push("nothing to check: pass a demo script, a take report or a recording");
  return { files, findings, notChecked, inconclusive, checked };
}

function summarize(result, { gate, strict, report }) {
  const short = (p) => { const r = relative(process.cwd(), p); return (r && !r.startsWith("..") ? r : p).replace(/\\/g, "/"); };
  for (const f of result.findings) console.log(`${f.line}: ${f.detail} (${short(f.file)}:${f.lineNumber})`);
  for (const line of result.inconclusive) console.log(`inconclusive: ${line}`);
  const never = result.findings.filter((f) => f.class === "never");
  const cand = result.findings.filter((f) => f.class === "candidate");
  let exitCode = 0;
  let status = "passed";
  if (never.length || (strict && cand.length)) { exitCode = 1; status = "failed"; }
  else if (result.inconclusive.length) { exitCode = 2; status = "inconclusive"; }
  console.log(`${GATE}: ${result.files.length} file${result.files.length === 1 ? "" : "s"}`);
  const tally = (list) => Object.entries(list.reduce((a, f) => ({ ...a, [f.line]: (a[f.line] || 0) + 1 }), {})).map(([k, v]) => `${k} ${v}`).join(", ");
  console.log(`never intentional: ${never.length}${never.length ? ` (${tally(never)})` : ""}; candidates: ${cand.length}${cand.length ? ` (${tally(cand)})` : ""}`);
  console.log("passing is necessary, not sufficient");
  if (report) writeFileSync(report, JSON.stringify({ status, exitCode, files: result.files, findings: result.findings, notChecked: [...result.notChecked, ...NOT_CHECKED] }, null, 2) + "\n");
  if (gate || strict) {
    if (status === "passed") console.log(`${GATE} passed`);
    else if (status === "inconclusive") console.log(`${GATE} inconclusive: it did not look at everything, so this is not a pass`);
    else console.log(`${GATE} failed`);
    return exitCode;
  }
  return never.some((f) => f.line === "unreadable") ? 1 : 0;
}

// ------------------------------------------------------------------- self-test

function selfTest() {
  let failed = 0;
  const say = (ok, what) => { console.log(`${ok ? "ok  " : "FAIL"} ${what}`); if (!ok) failed++; };
  const quiet = (fn) => { const log = console.log; console.log = () => {}; try { return fn(); } finally { console.log = log; } };
  const neverOf = (fs) => [...new Set(fs.filter((f) => f.class === "never").map((f) => f.line))];
  const readJson = (f) => { const text = readFileSync(f, "utf8").replace(/\r\n/g, "\n"); return { text, obj: JSON.parse(text) }; };

  const examples = join(SKILL, "examples");
  const golds = existsSync(examples) ? readdirSync(examples).filter((f) => f.endsWith(".demo.json")).sort() : [];
  say(golds.length >= 3, `examples/ holds ${golds.length} gold scripts (3 or more)`);
  for (const g of golds) {
    const { text, obj } = readJson(join(examples, g));
    const fs = checkScript(obj, text, g);
    const never = neverOf(fs);
    const cand = fs.filter((f) => f.class === "candidate").map((f) => f.line);
    say(never.length === 0, `examples/${g} raises no never-intentional line${never.length ? `: got ${never.join(", ")}` : ""}${cand.length ? ` (candidates: ${cand.join(", ")})` : ""}`);
  }

  const teaching = join(SKILL, "teaching");
  const pairs = existsSync(teaching) ? readdirSync(teaching).filter((d) => statSync(join(teaching, d)).isDirectory()).sort() : [];
  say(pairs.length >= 8, `teaching/ holds ${pairs.length} pairs (8 or more)`);
  for (const name of pairs) {
    const dir = join(teaching, name);
    const bad = readdirSync(dir).find((f) => f.startsWith("bad."));
    const good = readdirSync(dir).find((f) => f.startsWith("good."));
    if (!bad || !good) { say(false, `teaching/${name} has a bad and a good half`); continue; }
    say(name in LINES.never, `teaching/${name} is named for a never-intentional line`);
    const b = readJson(join(dir, bad));
    const badNever = neverOf(checkScript(b.obj, b.text, bad));
    say(badNever.length === 1 && badNever[0] === name, `teaching/${name}/${bad} raises ${name}: and no other${badNever.length === 1 && badNever[0] === name ? "" : `: got ${badNever.join(", ") || "nothing"}`}`);
    const g = readJson(join(dir, good));
    const goodNever = neverOf(checkScript(g.obj, g.text, good));
    say(goodNever.length === 0, `teaching/${name}/${good} raises none${goodNever.length ? `: got ${goodNever.join(", ")}` : ""}`);
  }

  // Lines that are one field wrong need no folder: proven on a gold with that field changed.
  const base = golds.length ? readJson(join(examples, golds.includes("web-flow.demo.json") ? "web-flow.demo.json" : golds[0])).obj : null;
  if (base) {
    const mutate = (fn) => { const copy = structuredClone(base); fn(copy); return neverOf(checkScript(copy, JSON.stringify(copy, null, 2), "mutated.json")); };
    const only = (lines, name) => lines.length === 1 && lines[0] === name;
    say(only(mutate((s) => { delete s.surface; }), "no-surface"), "a script with no surface raises no-surface:");
    say(only(mutate((s) => { s.driver = "agent-desktop"; }), "no-surface"), "a web surface with a desktop driver raises no-surface:");
    say(only(mutate((s) => { delete s.destination; }), "no-destination"), "a script with no destination raises no-destination:");
    say(only(mutate((s) => { s.fps = 24; }), "no-fps"), "24 fps raises no-fps:");
    say(only(mutate((s) => { s.viewport = { width: 1281, height: 720, scale: 1 }; s.smallest_text = 16; }), "odd-size"), "a 1281 px wide capture raises odd-size:");
    say(only(mutate((s) => { s.beats[0].steps.push({ do: "swipe", target: "#x" }); }), "unknown-step"), "a step kind the runner does not know raises unknown-step:");
    say(only(mutate((s) => { s.reset.push({ do: "storage", set: { session: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJkZW1vIn0.c2lnbmF0dXJl" } }); }), "secret-on-camera"), "a JWT in a reset step raises secret-on-camera:");
    say(only(mutate((s) => { s.beats[0].steps.unshift({ do: "type", target: "[data-testid=card]", text: "4539 1488 0343 6467" }); }), "secret-on-camera"), "a card number that is not a test card raises secret-on-camera:");
    say(mutate((s) => { s.beats[0].steps.unshift({ do: "type", target: "[data-testid=card]", text: "4242 4242 4242 4242" }); }).length === 0, "a published test card raises nothing");
    say(only(mutate((s) => { s.loop = { return: [{ do: "hold", ms: 400, why: "rest" }] }; }), "loop-seam"), "a loop with no way back raises loop-seam:");
    say(checkScript({ ...base, url: "https://app.acme.io/" }, "", "x").some((f) => f.line === "production-url"), "a host with no test label is reported as production-url:");

    // The take report.
    const two = { script: "x", takes: [{ end_state: "a", waits: [] }, { end_state: "b", waits: [] }] };
    say(neverOf(checkTake(two, base)).join() === "take-differs", "two takes that end on different screens raise take-differs:");
    say(checkTake({ script: "x", takes: [{ end_state: "a", waits: [{ at: "beat add, step 3", ms: 1900 }] }] }, base).map((f) => f.line).sort().join() === "one-take,slow-wait", "one take with a 1900 ms wait raises one-take: and slow-wait: as candidates");
    say(neverOf(checkTake({ script: "x", takes: [{ end_state: "a", seam: "differs" }, { end_state: "a", seam: "differs" }] }, { ...base, loop: { return: [] } })).join() === "loop-seam", "a loop whose last frame is not its first raises loop-seam:");

    // The recording, on probe results built here.
    const full = { codec: "h264", pix_fmt: "yuv420p", width: base.viewport.width * base.viewport.scale, height: base.viewport.height * base.viewport.scale, fps: base.fps, duration: 14, bytes: 2.1e6 };
    const rec = (over, file = "take.mp4") => neverOf(checkRecording({ ...full, ...over }, base, file));
    say(rec({}).length === 0, "a file at viewport times scale, in budget, raises nothing");
    say(rec({ duration: 48 }).join() === "take-duration", "a 48 s file raises take-duration:");
    say(rec({ width: 1920, height: 1080 }).join() === "take-resolution", "a 1920 x 1080 file from a 1280 x 720 at 2 script raises take-resolution:");
    say(rec({ fps: 25 }).join() === "take-fps", "a 25 fps file from a 30 fps script raises take-fps:");
    say(rec({ bytes: 9e6 }).join() === "take-size", "a 9 MB site file raises take-size:");
    say(rec({ pix_fmt: "yuv444p" }).join() === "take-codec", "an .mp4 in yuv444p raises take-codec:");
    say(rec({ codec: "gif", pix_fmt: "bgra", width: 800, height: 450, fps: 15 }, "take.gif").join() === "gif-fps", "a 15 fps GIF raises gif-fps:");
    say(rec({ codec: "gif", pix_fmt: "bgra", width: 800, height: 450, fps: 20, bytes: 12e6 }, "take.gif").join() === "take-size", "a 12 MB GIF raises take-size:");
  }

  // Never a pass for something it did not look at.
  const tmpGold = golds.length ? join(examples, golds[0]) : null;
  if (tmpGold) {
    const noProbe = quiet(() => run([tmpGold, join(examples, "missing-take.mp4")], { ffprobe: null }));
    say(noProbe.inconclusive.length === 1, "a recording that is not there is inconclusive, never a pass");
    const dir = mkdtempSync(join(tmpdir(), "demo-check-"));
    const clip = join(dir, "take.mp4");
    writeFileSync(clip, "");
    const r = quiet(() => summarize(run([tmpGold, clip], { ffprobe: null }), { gate: true }));
    rmSync(dir, { recursive: true, force: true });
    say(r === 2, "a recording with no ffprobe ends inconclusive, exit 2, and the script is still checked");
  }
  say(quiet(() => summarize(run([]), { gate: true })) === 2, "no input is inconclusive, exit 2");
  if (golds.length) say(quiet(() => summarize(run([examples]), { gate: true })) === 0, 'examples/ ends "demo-check passed"');
  say(findSecrets("ana@example.com dev@acme.test").length === 0 && findSecrets("ana@gmail.com")[0]?.line === "real-email", "reserved example domains pass; any other address raises real-email:");

  console.log(failed ? `\nself-test FAILED: ${failed}` : "\nself-test passed");
  return failed ? 1 : 0;
}

// ------------------------------------------------------------------------ main

function help() {
  const pad = (s) => (s + ":").padEnd(20);
  console.log(`${GATE}: the gate for khe-demo

  node scripts/demo-check.mjs <files or folders...> [--gate] [--report out.json]
       [--strict] [--self-test] [--help]

Reads
  *.demo.json  a demo script (format in references/script.md)
  *.take.json  the report record.mjs writes beside a recording
  video        ${VIDEO.join(" ")}, through ffprobe when it is on PATH:
               duration, size, frame rate, codec and file size against the
               script passed with it. Without ffprobe it prints
               "inconclusive: ffprobe not found" and still checks the script.

Each finding prints as  <line-name>: <what and where> (<file>:<line>)

  --gate       ends "${GATE} passed" and exits 0 only when every
               never-intentional line is at 0; otherwise prints the counts and
               exits 1. Exits 2 and says "inconclusive" when it could not look
               (nothing to check, a file not found, a recording with no ffprobe
               or no script).
  --report     write JSON: { status, exitCode, files, findings, notChecked }
  --strict     exit 1 on candidates too
  --self-test  every script in examples/ passes; every teaching/*/bad.* raises
               the line its folder is named for and its good.* does not

Never intentional (the gate fails on any)
${Object.entries(LINES.never).map(([k, v]) => `  ${pad(k)} ${v}`).join("\n")}

Candidates (reported for judgment)
${Object.entries(LINES.candidate).map(([k, v]) => `  ${pad(k)} ${v}`).join("\n")}

Not checked by this script
${NOT_CHECKED.map((n) => `  ${n}`).join("\n")}

Passing is necessary, not sufficient.`);
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const reportAt = argv.indexOf("--report");
  const report = reportAt >= 0 ? argv[reportAt + 1] : null;
  const paths = argv.filter((a, i) => !a.startsWith("--") && !(reportAt >= 0 && i === reportAt + 1));
  if (flags.has("--help") || flags.has("-h")) { help(); return 0; }
  if (flags.has("--self-test")) return selfTest();
  return summarize(run(paths.map((p) => resolve(p))), { gate: flags.has("--gate"), strict: flags.has("--strict"), report });
}

const invoked = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href.toLowerCase() : "";
if (invoked === import.meta.url.toLowerCase()) process.exit(main(process.argv.slice(2)));
