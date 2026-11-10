#!/usr/bin/env node
// sound-check.mjs: the gate for khe-sound. It reads sound manifests, cue sheets, .wav files
// and web playback code, and names every fault as one line. Zero dependencies, Node 20+.
//
//   node scripts/sound-check.mjs <files or folders...> [--gate] [--report out.json] [--strict]
//                                                      [--film] [--self-test] [--help]
//
// Every threshold below comes from this skill's references; the comment beside each one
// names the file. A script cannot hear: it never judges feel, timbre or fit (see --help).

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const GATE = "sound check";
const HERE = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- thresholds
const T = {
  silenceDb: -60,        // sound-spec: trim to the first sample above -60 dBFS
  leadMs: 5,             // sound-spec: five milliseconds of pre-roll is a visible sync error
  onsetShare: 0.05,      // sound-motion-sync: the onset is the first sample above 5 % of peak
  peakProductDb: -3,     // sound-spec: peak every file at -3 dBFS
  peakFilmDb: -1,        // sound-spec, launch-video-sound: -1 dBTP for delivered video
  rate: 44100,           // sound-spec: 44.1 kHz
  bits: 16,              // sound-spec: 16-bit WAV as the source of truth
  tailDropDb: -36,       // sound-family.mjs: the tail is cut where a 5 ms RMS window stays 36 dB under its peak
  tailKeepMs: 20,        // sound-family.mjs: 20 ms kept after the last loud window
  windowMs: 5,           // sound-family.mjs: the RMS window
  echoLagS: 0.045,       // sound-motion-sync: past ~45 ms of lag a sharp contact reads as an echo
  lufsUi: [-18, -14],    // sound-spec: taps, ticks, toggles
  lufsNotify: -12,       // sound-spec: notifications, the one class allowed to be louder
  familyMax: 6,          // sound-palette: most products need four to six sounds
  typeEveryS: 0.1,       // sound-from-motion: keep typing ticks under ~10 a second
  productCapMs: 800,     // sound-palette: the longest product sound, the success figure
};

// Upper length per role in ms. The six family names take sound-palette's table (it names the
// sound); the other roles take sound-spec's category bands. Both files state the same split:
// tap 120 and receive 400 are the named rows, press 150 and notification 600 the category limits.
const ROLE_MAX_MS = {
  tick: 80, toggle: 80, snap: 80, select: 80,
  tap: 120, press: 150,
  send: 250, save: 250, confirm: 250, complete: 250,
  receive: 400, notification: 600, notify: 600,
  error: 200,
  success: 800,
};

// sound-decision-framework: every keystroke, scroll and hover is "never"; sound-playback-web:
// never on focus or focusin, never on page load; sound-spec: product UI never gets transitions.
const NEVER_TOKENS = new Set([
  "keydown", "keyup", "keypress", "keystroke", "keystrokes", "typing", "input", "beforeinput", "oninput",
  "scroll", "wheel", "touchmove",
  "hover", "mouseenter", "mouseover", "mousemove", "pointerenter", "pointerover", "pointermove",
  "focus", "focusin",
  "load", "pageload", "domcontentloaded", "autoplay",
  "routechange", "navigation", "navigate", "pagechange",
]);
const NEVER_PHRASES = /\b(page load|route change|page change|every key|key press)\b/i;
// sound-decision-framework: every primary action is "no, unless the product is explicitly tactile".
const PRESS_TOKENS = new Set(["click", "press", "tap", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend", "change", "toggle", "select"]);

const INPUT_EVENTS = new Set([
  "keydown", "keyup", "keypress", "input", "beforeinput", "scroll", "wheel", "touchmove",
  "mouseenter", "mouseover", "mousemove", "pointerenter", "pointerover", "pointermove",
  "focus", "focusin", "load", "domcontentloaded",
]);

// sound-licensing: NC, ND and SA fail a commercial, edited film; so does anything that is not a licence text.
const BAD_LICENCE = /\bNC\b|\bND\b|\bSA\b|non-?commercial|no-?deriv|share-?alike|personal use|royalty[- ]free|free with credit|aggregator|\bunknown\b|\btbd\b|\?/;
const THIRD_PARTY = /CC ?BY|CC0|creative commons|public domain|mixkit|pixabay|freesound/i;
const OWN_WORK = /own work|made in code|generated locally|rendered by|no third-party rights/i;

// ---------------------------------------------------------------- the lines
const NEVER = {
  "no-material": "A family or product sound map names no material",
  "mixed-material": "A sound carries a material, pack or source that differs from the family's",
  "no-time": "A cue has neither a time (t, in seconds) nor a frame (with an fps)",
  "forbidden-moment": "A product sound triggered by typing, scroll, hover, focus, page load or a route change",
  "no-mute": "A product sound map declares no mute control, or one that is not persisted or not reachable by keyboard",
  "on-by-default": "Product sound that starts on, in the map (defaultOn is not false) or in code",
  "no-twin": "A product cue with no visual twin, so the sound is the only signal",
  "too-long": "A sound longer than its role's limit, declared in a manifest or measured in a .wav",
  "hot-peak": "A peak over the ceiling: -3 dBFS for a product one-shot, -1 dBFS for a film stem",
  "sound-leads": "A negative lag: the transient arrives before its contact frame",
  "no-licence": "A file in the mix with no licence recorded",
  "bad-licence": "A licence that fails a commercial, edited film: NC, ND, SA, or text that is not a licence",
  "picture-not-locked": "A film cue sheet whose picture is not declared locked",
  "no-register": "A film cue sheet with no register A to E",
  "no-loudness": "A film cue sheet with no integrated loudness written beside its register",
  "true-peak": "A film true-peak ceiling missing or above -1 dBTP",
  "cue-past-end": "A cue placed after the film ends",
  "leading-silence": "5 ms or more before the first sample above -60 dBFS, or a file that never rises above it",
  "clipped": "Two or more consecutive samples at full scale",
  "stereo": "A product one-shot with more than one channel",
  "sample-rate": "A product one-shot that is not 44.1 kHz",
  "abrupt-end": "The last sample is above -60 dBFS, so the file ends on a click",
  "media-element": "new Audio(...) used for UI playback",
  "context-at-load": "new AudioContext() at module scope, outside any gesture",
  "sound-on-input": "A play call inside a typing, scroll, hover, focus or load handler",
};
const CANDIDATE = {
  "press-sound": "A sound on a plain press, tap, toggle or select in a product not declared tactile",
  "echo-lag": "A lag over 45 ms on a contact sound",
  "loudness-range": "A declared LUFS outside -18 to -14 (about -12 for a notification)",
  "family-size": "A family of more than six sounds",
  "prompt-not-dry": "A generation prompt whose material and prompt never say dry, no tail or no reverb",
  "style-material": "A material that describes a style, not a thing",
  "licence-no-page": "A third-party licence with no page URL or no date it was read",
  "lufs-habit": "A film target of exactly -14 LUFS",
  "whoosh-on-bed": "A whoosh in register B, where the bed carries every cut",
  "bed-in-dry": "A bed in register A, the dry reveal",
  "clicks-on-beat": "Clicks, ticks or pops laid over a beat track (register C)",
  "no-subtract": "A bed with no dropout before the reveal",
  "fast-type": "A typing run faster than 10 ticks a second",
  "late-onset": "5 ms or more before the first sample above 5 % of peak",
  "bit-depth": "A .wav that is not 16-bit",
  "quiet-tail": "More tail than the 20 ms the family script keeps after the sound has fallen 36 dB",
  "spring-end": "A play call inside an animationend handler",
};
const NOT_CHECKED = [
  "feel, timbre and whether a sound suits the product",
  "whether the family reads as one object struck several ways (play it back to back, in mono, on a laptop speaker)",
  "the 100th-use test",
  "sync against the rendered picture (the gate reads declared times, never frames)",
  "integrated loudness (LUFS) and true peak (dBTP): a .wav is measured for sample peak only",
  "compressed audio (.mp3, .ogg, .opus, .m4a): only .wav is parsed",
  "whether the mute control, the visual twin and the licence page exist outside the manifest that declares them",
  "handlers the gate cannot follow: imported functions, framework hooks, code inside a function body for context-at-load",
  "haptics on a real phone",
];

const HELP = `${GATE}: the gate for khe-sound

usage: node scripts/sound-check.mjs <files or folders...> [--gate] [--report out.json] [--strict] [--film] [--self-test] [--help]

  .json   a family manifest ({ material, sounds }), a product sound map ({ material, mute, defaultOn, cues })
          or a film cue sheet ({ surface: "film", locked, register, target, files, cues })
  .wav    read from the RIFF header and the PCM samples; the role comes from the file name (tick.wav, ui-send.wav)
  code    .js .mjs .ts .tsx .jsx .html: web playback wiring

  --gate       end with "${GATE} passed" and exit 0 only when every never-intentional line is at 0; else exit 1
  --strict     candidates fail too
  --film       treat every .wav as a film stem (ceiling -1 dBFS, stereo allowed, no length limit, no lead-in check)
  --report f   write { status, exitCode, files, findings, notChecked } as JSON
  --self-test  run the gate against examples/ and teaching/ beside this script
  exit 2       inconclusive: nothing to check, or audio it could not read

never intentional:
${Object.entries(NEVER).map(([k, v]) => `  ${(k + ":").padEnd(20)} ${v}`).join("\n")}

candidates, reported for judgment:
${Object.entries(CANDIDATE).map(([k, v]) => `  ${(k + ":").padEnd(20)} ${v}`).join("\n")}

not checked by the gate:
${NOT_CHECKED.map((s) => `  - ${s}`).join("\n")}

passing is necessary, not sufficient`;

// ---------------------------------------------------------------- helpers
const isNum = (v) => typeof v === "number" && Number.isFinite(v);
const str = (v) => (typeof v === "string" ? v.trim() : "");
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const tokens = (s) => String(s).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const db = (x) => (x > 0 ? 20 * Math.log10(x) : -Infinity);
const r1 = (x) => Math.round(x * 10) / 10;
const lineAt = (text, idx) => (idx < 0 ? 1 : text.slice(0, idx).split("\n").length);
function lineOf(text, ...patterns) {
  for (const p of patterns) {
    const m = (p instanceof RegExp ? p : new RegExp(esc(p))).exec(text);
    if (m) return lineAt(text, m.index);
  }
  return 1;
}
const keyLine = (text, key) => lineOf(text, new RegExp(`"${esc(key)}"\\s*:`));
function roleOf(...names) {
  for (const n of names) for (const t of tokens(n ?? "")) if (t in ROLE_MAX_MS) return t;
  return null;
}
function collector(file) {
  const findings = [];
  const add = (line, detail, lineNumber = 1) => {
    if (!(line in NEVER) && !(line in CANDIDATE)) throw new Error(`unknown line ${line}`);
    findings.push({ line, file, lineNumber, detail, class: line in NEVER ? "never-intentional" : "candidate" });
  };
  return { findings, add };
}

// ---------------------------------------------------------------- JSON: manifests and cue sheets
function checkLicence(add, entry, label, line) {
  const lic = str(entry.license ?? entry.licence);
  if (!lic) return add("no-licence", `${label} has no licence recorded`, line);
  if (BAD_LICENCE.test(lic)) return add("bad-licence", `${label} is recorded as "${lic}"`, line);
  if (THIRD_PARTY.test(lic) && !OWN_WORK.test(lic)) {
    const page = str(entry.page ?? entry.url);
    const read = str(entry.read ?? entry.readOn);
    if (!/^https?:\/\//.test(page) || !/^\d{4}-\d{2}-\d{2}$/.test(read)) add("licence-no-page", `${label} ("${lic}") needs the item's own page URL and the date it was read`, line);
  }
}

function forbidden(trigger) {
  const hit = tokens(trigger).find((t) => NEVER_TOKENS.has(t));
  if (hit) return hit;
  return NEVER_PHRASES.exec(trigger)?.[0] ?? null;
}

function recipeMs(synth) {
  if (!synth || typeof synth !== "object") return null;
  if (isNum(synth.seconds)) return synth.seconds * 1000;
  const type = synth.type ?? "tick";
  if (type === "chime") {
    // sound-family.mjs: the last note's onset plus 2.5 decays.
    const notes = Array.isArray(synth.notes) ? synth.notes.length : 2;
    return ((synth.stagger ?? 0.07) * (notes - 1) + (synth.decay ?? 0.18) * 2.5) * 1000;
  }
  const dflt = { tick: 0.07, tap: 0.12, thud: 0.16, pop: 0.06, whoosh: 0.4 }[type];
  return dflt ? dflt * 1000 : null;
}

function checkLength(add, ms, role, label, line) {
  if (!isNum(ms)) return;
  const max = role ? ROLE_MAX_MS[role] : T.productCapMs;
  if (ms > max + 0.5) add("too-long", `${label} is ${Math.round(ms)} ms; ${role ? `a ${role} stops by ${max} ms` : `no product sound runs past ${max} ms`}`, line);
}

// sound-palette: describe a thing, never a style.
const STYLE = /futuristic|sci-?fi|\bdigital\b|\bmodern\b|techy|cinematic|\bui (sound|blip)\b|\bblip\b/i;

function checkFamily(doc, text, add) {
  const material = str(doc.material);
  if (!material || Array.isArray(doc.material)) add("no-material", Array.isArray(doc.material) ? "material is a list; a family has one" : "the family names no material", keyLine(text, "sounds"));
  else if (STYLE.test(material)) add("style-material", `"${material}" names a style; name a thing and what strikes it`, keyLine(text, "material"));

  const entries = Array.isArray(doc.sounds)
    ? doc.sounds.map((s, i) => [str(s?.name) || `sounds[${i}]`, s])
    : Object.entries(doc.sounds);
  if (entries.length > T.familyMax) add("family-size", `${entries.length} sounds; most products need four to six`, keyLine(text, "sounds"));

  const packs = new Map();
  for (const [name, s] of entries) {
    if (!s || typeof s !== "object") continue;
    const line = lineOf(text, new RegExp(`"${esc(name)}"\\s*:\\s*\\{`), new RegExp(`"name"\\s*:\\s*"${esc(name)}"`));
    const own = str(s.material);
    if (own && own !== material) add("mixed-material", `${name} has its own material ("${own}"); regenerate the whole family from one`, line);
    const pack = str(s.pack ?? s.source);
    if (pack) packs.set(pack, [...(packs.get(pack) ?? []), name]);

    const role = roleOf(s.role, name);
    checkLength(add, isNum(s.ms) ? s.ms : recipeMs(s.synth), role, name, line);
    if (isNum(s.peakDb) && r1(s.peakDb) > T.peakProductDb) add("hot-peak", `${name} declares a peak of ${s.peakDb} dBFS; the ceiling is ${T.peakProductDb}`, line);
    if (s.file !== undefined) checkLicence(add, s, `${name} (${s.file})`, line);

    const trigger = str(s.trigger ?? s.on);
    if (trigger) {
      const hit = forbidden(trigger);
      if (hit) add("forbidden-moment", `${name} fires on "${trigger}" (${hit}); this moment never gets a sound`, line);
    }
    if (role === "tap" && doc.tactile !== true) add("press-sound", `${name} is a press sound; only a tactile product gets one (declare "tactile": true)`, line);
    const prompt = str(s.prompt);
    if (prompt && !/\bdry\b|no tail|no reverb/i.test(`${material} ${prompt}`)) add("prompt-not-dry", `${name}: neither the material nor the prompt says dry, no tail or no reverb`, line);
  }
  if (packs.size > 1) add("mixed-material", `sounds come from ${packs.size} packs or sources (${[...packs.keys()].join(", ")}); one family has one`, keyLine(text, "sounds"));
}

function cueTime(c, fps) {
  if (isNum(c.t)) return c.t;
  const f = isNum(c.fps) ? c.fps : fps;
  if (isNum(c.frame) && isNum(f) && f > 0) return c.frame / f;
  return null;
}

function checkProductCues(doc, text, add) {
  const cuesLine = keyLine(text, "cues");
  if (!str(doc.material)) add("no-material", "the sound map names no material", cuesLine);
  else if (STYLE.test(doc.material)) add("style-material", `"${str(doc.material)}" names a style; name a thing and what strikes it`, keyLine(text, "material"));

  const mute = doc.mute;
  if (!mute || typeof mute !== "object" || !str(mute.control)) add("no-mute", "no mute control is declared (mute.control)", mute ? keyLine(text, "mute") : cuesLine);
  else {
    if (!mute.persisted) add("no-mute", "the mute control is not persisted (mute.persisted)", keyLine(text, "mute"));
    if (mute.keyboard !== true) add("no-mute", "the mute control is not declared reachable by keyboard (mute.keyboard)", keyLine(text, "mute"));
  }
  if (doc.defaultOn !== false) add("on-by-default", doc.defaultOn === undefined ? "defaultOn is not declared; product sound ships off" : `defaultOn is ${JSON.stringify(doc.defaultOn)}; product sound ships off`, doc.defaultOn === undefined ? cuesLine : keyLine(text, "defaultOn"));

  doc.cues.forEach((c, i) => {
    if (!c || typeof c !== "object") return;
    const id = str(c.id) || `cues[${i}]`;
    const line = lineOf(text, new RegExp(`"id"\\s*:\\s*"${esc(id)}"`), /"cues"\s*:/);
    if (cueTime(c, doc.fps) === null) add("no-time", `${id} has no t (seconds from the trigger to the contact) and no frame`, line);
    const trigger = str(c.trigger ?? c.on);
    const hit = trigger && forbidden(trigger);
    if (hit) add("forbidden-moment", `${id} fires on "${trigger}" (${hit}); this moment never gets a sound`, line);
    else if (trigger && doc.tactile !== true && tokens(trigger).some((t) => PRESS_TOKENS.has(t))) add("press-sound", `${id} fires on "${trigger}"; a plain press is silent unless the product is tactile`, line);
    if (!str(c.twin)) add("no-twin", `${id} names no visual twin`, line);
    const role = roleOf(c.role, c.category, c.sound, id);
    checkLength(add, c.ms, role, id, line);
    if (isNum(c.peakDb) && r1(c.peakDb) > T.peakProductDb) add("hot-peak", `${id} declares a peak of ${c.peakDb} dBFS; the ceiling is ${T.peakProductDb}`, line);
    if (isNum(c.lufs)) {
      const notify = role === "receive" || role === "notification" || role === "notify";
      if (notify ? c.lufs > T.lufsNotify : c.lufs < T.lufsUi[0] || c.lufs > T.lufsUi[1]) add("loudness-range", `${id} declares ${c.lufs} LUFS; ${notify ? `a notification sits near ${T.lufsNotify}` : `interface sounds sit at ${T.lufsUi[0]} to ${T.lufsUi[1]}`}`, line);
    }
    if (isNum(c.lag) && c.lag < 0) add("sound-leads", `${id} has a lag of ${c.lag} s; audio never leads the picture`, line);
    if (isNum(c.lag) && c.lag > T.echoLagS) add("echo-lag", `${id} lags ${Math.round(c.lag * 1000)} ms; aim for 0 to 30`, line);
    if (c.file !== undefined) checkLicence(add, c, `${id} (${c.file})`, line);
  });
  if (Array.isArray(doc.files)) doc.files.forEach((f, i) => checkLicence(add, f ?? {}, str(f?.file) || `files[${i}]`, lineOf(text, new RegExp(`"file"\\s*:\\s*"${esc(str(f?.file))}"`), /"files"\s*:/)));
}

function checkFilmCues(doc, text, add) {
  const cuesLine = keyLine(text, "cues");
  if (doc.locked !== true) add("picture-not-locked", "locked is not true; cues are placed on frames, and frames that move invalidate them", doc.locked === undefined ? cuesLine : keyLine(text, "locked"));
  const register = /^[A-E]\b/i.exec(str(doc.register))?.[0]?.toUpperCase() ?? null;
  if (!register) add("no-register", "register is not one of A to E", doc.register === undefined ? cuesLine : keyLine(text, "register"));
  const target = doc.target && typeof doc.target === "object" ? doc.target : {};
  const targetLine = doc.target === undefined ? cuesLine : keyLine(text, "target");
  if (!isNum(target.lufs)) add("no-loudness", "target.lufs is missing; write the loudness beside the register", targetLine);
  else if (target.lufs === -14) add("lufs-habit", "target is -14 LUFS; that suits a muted-autoplay feed, and the measured medians are near -18", targetLine);
  if (!isNum(target.dbtp)) add("true-peak", "target.dbtp is missing; the ceiling is -1 dBTP", targetLine);
  else if (target.dbtp > T.peakFilmDb) add("true-peak", `target.dbtp is ${target.dbtp}; the ceiling is -1 dBTP`, targetLine);

  const fps = doc.fps;
  const duration = isNum(doc.duration) ? doc.duration : null;
  doc.cues.forEach((c, i) => {
    if (!c || typeof c !== "object") return;
    const id = str(c.id) || `cues[${i}]`;
    const line = lineOf(text, new RegExp(`"id"\\s*:\\s*"${esc(id)}"`), /"cues"\s*:/);
    const t = cueTime(c, fps);
    if (t === null) add("no-time", `${id} has no t and no frame`, line);
    else if (duration !== null && t + (isNum(c.dur) ? c.dur : 0) > duration + 1e-9) add("cue-past-end", `${id} reaches ${(t + (c.dur ?? 0)).toFixed(2)} s in a ${duration} s film`, line);
    if (isNum(c.lag) && c.lag < 0) add("sound-leads", `${id} has a lag of ${c.lag} s; audio never leads the picture`, line);
    if (isNum(c.lag) && c.lag > T.echoLagS) add("echo-lag", `${id} lags ${Math.round(c.lag * 1000)} ms; aim for 0 to 30`, line);
    if (register === "B" && c.kind === "whoosh") add("whoosh-on-bed", `${id} is a whoosh; in register B the bed carries every cut`, line);
    if (register === "C" && ["click", "tick", "pop", "type"].includes(c.kind)) add("clicks-on-beat", `${id} is a ${c.kind}; under a beat track the track carries the pops`, line);
    if (c.kind === "type" && isNum(c.every) && c.every < T.typeEveryS) add("fast-type", `${id} types ${Math.round(1 / c.every)} ticks a second; thin them or lay one typing bed`, line);
  });
  if (doc.bed && register === "A") add("bed-in-dry", "register A holds in true silence; omit the bed", keyLine(text, "bed"));
  if (doc.bed && register !== "A" && !(Array.isArray(doc.bed.dropouts) && doc.bed.dropouts.length)) add("no-subtract", "the bed has no dropout; take something away 0.1 to 0.9 s before the reveal", keyLine(text, "bed"));

  if (!Array.isArray(doc.files) || !doc.files.length) add("no-licence", "the sheet lists no files; every file the final mix decodes needs a licence row", cuesLine);
  else doc.files.forEach((f, i) => checkLicence(add, f ?? {}, str(f?.file) || `files[${i}]`, lineOf(text, new RegExp(`"file"\\s*:\\s*"${esc(str(f?.file))}"`), /"files"\s*:/)));
}

function checkJson(text, file) {
  const { findings, add } = collector(file);
  let doc;
  try { doc = JSON.parse(text); } catch (e) { return { findings, checked: false, unreadable: `not valid JSON (${e.message})` }; }
  if (!doc || typeof doc !== "object" || Array.isArray(doc)) return { findings, checked: false, skipped: "not a sound manifest or cue sheet" };
  const hasSounds = doc.sounds && typeof doc.sounds === "object";
  const hasCues = Array.isArray(doc.cues);
  if (!hasSounds && !hasCues) return { findings, checked: false, skipped: "not a sound manifest or cue sheet" };
  const film = doc.surface === "film" || (doc.surface === undefined && (doc.canvas !== undefined || doc.bed !== undefined || doc.register !== undefined));
  const kinds = [];
  if (hasSounds) { checkFamily(doc, text, add); kinds.push("family manifest"); }
  if (hasCues) {
    if (film) { checkFilmCues(doc, text, add); kinds.push("film cue sheet"); }
    else { checkProductCues(doc, text, add); kinds.push("product sound map"); }
  }
  return { findings, checked: true, info: kinds.join(" + ") };
}

// ---------------------------------------------------------------- WAV: RIFF header and PCM samples
function parseWav(buf) {
  if (buf.length < 12 || buf.toString("latin1", 0, 4) !== "RIFF" || buf.toString("latin1", 8, 12) !== "WAVE") return { error: "not a RIFF/WAVE file" };
  let pos = 12, fmt = null, data = null, comment = "";
  while (pos + 8 <= buf.length) {
    const id = buf.toString("latin1", pos, pos + 4);
    const size = buf.readUInt32LE(pos + 4);
    const body = pos + 8;
    if (id === "fmt " && body + 16 <= buf.length) {
      let tag = buf.readUInt16LE(body);
      if (tag === 0xfffe && size >= 26 && body + 26 <= buf.length) tag = buf.readUInt16LE(body + 24); // WAVE_FORMAT_EXTENSIBLE: the sub-format
      fmt = { tag, channels: buf.readUInt16LE(body + 2), rate: buf.readUInt32LE(body + 4), bits: buf.readUInt16LE(body + 14) };
    } else if (id === "data") {
      data = { offset: body, size: Math.min(size, buf.length - body) };
    } else if (id === "LIST" && buf.toString("latin1", body, body + 4) === "INFO") {
      let p = body + 4;
      const end = Math.min(body + size, buf.length);
      while (p + 8 <= end) {
        const sid = buf.toString("latin1", p, p + 4), ssize = buf.readUInt32LE(p + 4);
        if (sid === "ICMT") comment = buf.toString("utf8", p + 8, Math.min(p + 8 + ssize, end)).replace(/\0+$/, "");
        p += 8 + ssize + (ssize % 2);
      }
    }
    pos = body + size + (size % 2);
  }
  if (!fmt) return { error: "no fmt chunk" };
  if (!data) return { error: "no data chunk" };
  if (fmt.tag !== 1) return { error: `format tag ${fmt.tag} is not integer PCM` };
  if (![8, 16, 24, 32].includes(fmt.bits) || fmt.channels < 1 || fmt.rate < 1) return { error: `unsupported fmt (${fmt.bits}-bit, ${fmt.channels} channel(s), ${fmt.rate} Hz)` };
  const bytes = fmt.bits / 8;
  const frames = Math.floor(data.size / (bytes * fmt.channels));
  const full = 2 ** (fmt.bits - 1);
  const abs = new Float32Array(frames); // per frame, the loudest channel
  let clipRun = 0, clipAt = -1;
  const run = new Int32Array(fmt.channels);
  for (let i = 0; i < frames; i++) {
    let m = 0;
    for (let ch = 0; ch < fmt.channels; ch++) {
      const off = data.offset + (i * fmt.channels + ch) * bytes;
      const v = bytes === 1 ? buf.readUInt8(off) - 128 : bytes === 2 ? buf.readInt16LE(off) : bytes === 3 ? buf.readIntLE(off, 3) : buf.readInt32LE(off);
      const a = Math.abs(v);
      if (a >= full - 1) { if (++run[ch] > clipRun) { clipRun = run[ch]; if (clipAt < 0 && clipRun >= 2) clipAt = i - 1; } } else run[ch] = 0;
      if (a / full > m) m = a / full;
    }
    abs[i] = m;
  }
  return { ...fmt, frames, abs, clipRun, clipAt, comment };
}

function checkWav(buf, file, { film = false } = {}) {
  const { findings, add } = collector(file);
  const w = parseWav(buf);
  if (w.error) return { findings, checked: false, unreadable: w.error };
  const name = basename(file).replace(/\.wav$/i, "");
  const isFilm = film || tokens(name).some((t) => ["stem", "bed", "track", "master", "mix", "music", "film"].includes(t));
  const ms = (frames) => (frames / w.rate) * 1000;
  const durMs = ms(w.frames);
  let peak = 0;
  for (let i = 0; i < w.frames; i++) if (w.abs[i] > peak) peak = w.abs[i];
  const peakDb = db(peak);
  const floor = 10 ** (T.silenceDb / 20);
  let lead = 0;
  while (lead < w.frames && w.abs[lead] < floor) lead++;
  let onset = 0;
  while (onset < w.frames && w.abs[onset] < peak * T.onsetShare) onset++;
  const silent = lead >= w.frames;

  const ceiling = isFilm ? T.peakFilmDb : T.peakProductDb;
  if (w.clipRun >= 2) add("clipped", `${w.clipRun} consecutive samples at full scale from ${ms(w.clipAt).toFixed(1)} ms`);
  else if (!silent && r1(peakDb) > ceiling) add("hot-peak", `peak ${peakDb.toFixed(1)} dBFS; the ceiling is ${ceiling} dBFS${isFilm ? " (sample peak; true peak is not measured here)" : ""}`);
  if (!silent && w.abs[w.frames - 1] >= floor) add("abrupt-end", `the last sample sits at ${db(w.abs[w.frames - 1]).toFixed(1)} dBFS; fade the last 10 ms`);

  if (!isFilm) {
    if (silent) add("leading-silence", `no sample rises above ${T.silenceDb} dBFS`);
    else if (ms(lead) >= T.leadMs) add("leading-silence", `${ms(lead).toFixed(1)} ms before the first sample above ${T.silenceDb} dBFS; trim to 0`);
    else if (ms(onset) >= T.leadMs) add("late-onset", `${ms(onset).toFixed(1)} ms before the first sample above 5 % of peak; trim to just before it, or cue the file that much earlier`);
    if (w.channels !== 1) add("stereo", `${w.channels} channels; a product one-shot is mono`);
    if (w.rate !== T.rate) add("sample-rate", `${w.rate} Hz; the source is 44.1 kHz`);
    if (!silent) checkLength(add, ms(w.frames - lead), roleOf(name), basename(file), 1); // the sound's own length, lead-in excluded
    if (!silent) {
      // The same tail measure sound-family.mjs trims by.
      const win = Math.max(1, Math.floor((w.rate * T.windowMs) / 1000));
      const env = [];
      for (let i = lead; i + win <= w.frames; i += win) {
        let acc = 0;
        for (let j = i; j < i + win; j++) acc += w.abs[j] * w.abs[j];
        env.push(Math.sqrt(acc / win));
      }
      if (env.length) {
        const cut = Math.max(...env) * 10 ** (T.tailDropDb / 20);
        let last = env.length - 1;
        while (last > 0 && env[last] < cut) last--;
        const excess = w.frames - (lead + (last + 1) * win + Math.floor((w.rate * T.tailKeepMs) / 1000));
        if (excess > win) add("quiet-tail", `${ms(excess).toFixed(0)} ms of tail past the point the sound has fallen 36 dB; trim the tail before normalizing`);
      }
    }
  }
  if (w.bits !== T.bits) add("bit-depth", `${w.bits}-bit; the source is 16-bit`);

  const role = roleOf(name);
  const info = `${w.channels === 1 ? "mono" : `${w.channels} ch`} ${w.rate} Hz ${w.bits}-bit, ${durMs.toFixed(0)} ms, peak ${peakDb.toFixed(1)} dBFS${isFilm ? ", film stem" : `, lead ${ms(lead).toFixed(1)} ms, onset ${ms(onset).toFixed(1)} ms, role ${role ?? `none in the name (held to ${T.productCapMs} ms)`}`}`;
  return { findings, checked: true, info, film: isFilm };
}

// ---------------------------------------------------------------- code: web playback wiring
// Blanks comments (and, for `bare`, string contents) while keeping every index and newline.
function strip(text, html) {
  const keep = [...text], bare = [...text];
  const blank = (arr, a, b) => { for (let i = a; i < b; i++) if (arr[i] !== "\n") arr[i] = " "; };
  let i = 0;
  while (i < text.length) {
    const two = text.slice(i, i + 2);
    if (two === "//" && text[i - 1] !== ":") { let j = text.indexOf("\n", i); if (j < 0) j = text.length; blank(keep, i, j); blank(bare, i, j); i = j; continue; }
    if (two === "/*") { let j = text.indexOf("*/", i + 2); j = j < 0 ? text.length : j + 2; blank(keep, i, j); blank(bare, i, j); i = j; continue; }
    if (html && text.startsWith("<!--", i)) { let j = text.indexOf("-->", i + 4); j = j < 0 ? text.length : j + 3; blank(keep, i, j); blank(bare, i, j); i = j; continue; }
    const q = text[i];
    if (q === '"' || q === "'" || q === "`") {
      let j = i + 1;
      while (j < text.length && text[j] !== q && (q === "`" || text[j] !== "\n")) j += text[j] === "\\" ? 2 : 1;
      blank(bare, i + 1, Math.min(j, text.length));
      i = j + 1; continue;
    }
    i++;
  }
  return { keep: keep.join(""), bare: bare.join("") };
}
function closeOf(bare, open, o = "(", c = ")") {
  let depth = 0;
  for (let i = open; i < bare.length; i++) {
    if (bare[i] === o) depth++;
    else if (bare[i] === c && --depth === 0) return i;
  }
  return bare.length;
}
const PLAYS = /(?<![\w$.])play\w*\s*\(/;
function handlerPlays(keep, bare, body) {
  if (PLAYS.test(body)) return true;
  const ident = /^\s*([A-Za-z_$][\w$]*)\s*(?:[,)}]|$)/.exec(body)?.[1];
  if (!ident) return false;
  const def = new RegExp(`(?:function\\s+${esc(ident)}\\s*\\(|(?:const|let|var)\\s+${esc(ident)}\\s*=)`).exec(keep);
  if (!def) return false;
  const brace = bare.indexOf("{", def.index);
  if (brace < 0) return false;
  return PLAYS.test(keep.slice(brace, closeOf(bare, brace, "{", "}") + 1));
}

function checkCode(text, file) {
  const { findings, add } = collector(file);
  if (!/AudioContext|new\s+Audio\b|decodeAudioData|createBufferSource|(?<![\w$.])play\w*\s*\(/.test(text)) return { findings, checked: false, skipped: "no audio code" };
  const html = /\.html?$/i.test(file);
  const { keep, bare } = strip(text, html);
  const depth = new Int32Array(bare.length + 1);
  for (let i = 0; i < bare.length; i++) depth[i + 1] = depth[i] + (bare[i] === "{" ? 1 : bare[i] === "}" ? -1 : 0);

  const code = (m) => bare[m.index] === keep[m.index]; // false when the match starts inside a string
  for (const m of keep.matchAll(/new\s+Audio\s*\(/g)) if (code(m)) add("media-element", "new Audio() has start-up latency; decode once and play an AudioBufferSourceNode", lineAt(text, m.index));

  for (const m of keep.matchAll(/new\s+(?:window\s*\.\s*)?(?:webkit)?AudioContext\s*\(/g)) {
    if (!code(m) || depth[m.index] !== 0) continue;
    const lineStart = keep.lastIndexOf("\n", m.index) + 1;
    if (/=>|\bfunction\b/.test(keep.slice(lineStart, m.index))) continue; // a lazy getter on one line
    add("context-at-load", "the context is created at module scope and starts suspended; create and resume it inside the first gesture", lineAt(text, m.index));
  }

  const inputHit = (event, body, idx) => {
    const e = event.toLowerCase();
    if (e === "animationend") { if (handlerPlays(keep, bare, body)) add("spring-end", "a sound on animationend lands after a spring's whole tail; cue the first crossing of rest", lineAt(text, idx)); return; }
    if (INPUT_EVENTS.has(e) && handlerPlays(keep, bare, body)) add("sound-on-input", `a sound plays on ${event}; typing, scroll, hover, focus and load stay silent`, lineAt(text, idx));
  };
  for (const m of keep.matchAll(/addEventListener\s*\(\s*(["'`])([\w]+)\1\s*,/g)) {
    if (!code(m)) continue;
    const open = keep.indexOf("(", m.index);
    inputHit(m[2], keep.slice(m.index + m[0].length, closeOf(bare, open)), m.index);
  }
  for (const m of keep.matchAll(/\bon(KeyDown|KeyUp|KeyPress|Input|BeforeInput|Scroll|Wheel|TouchMove|MouseEnter|MouseOver|MouseMove|PointerEnter|PointerOver|PointerMove|Focus|Load|AnimationEnd)\s*=\s*\{/g)) {
    if (!code(m)) continue;
    const open = m.index + m[0].length - 1;
    inputHit(m[1], keep.slice(open + 1, closeOf(bare, open, "{", "}")), m.index);
  }
  for (const m of keep.matchAll(/\.on(keydown|keyup|keypress|input|scroll|wheel|mouseenter|mouseover|mousemove|focus|load|animationend)\s*=(?!=)/g)) {
    if (!code(m)) continue;
    let end = bare.indexOf(";", m.index);
    if (end < 0) end = bare.length;
    const brace = bare.indexOf("{", m.index);
    if (brace >= 0 && brace < end) end = closeOf(bare, brace, "{", "}");
    inputHit(m[1], keep.slice(m.index + m[0].length, end + 1), m.index);
  }

  for (const m of keep.matchAll(/getItem\s*\([^)]*\)\s*!==?\s*(["'])(off|false|0|muted)\1/g)) if (code(m)) add("on-by-default", "anything but a stored off counts as on, so a first visit has sound; test for a stored on", lineAt(text, m.index));
  for (const m of keep.matchAll(/getItem\s*\([^)]*\)\s*(?:\?\?|\|\|)\s*(["'])(on|true|1)\1/g)) if (code(m)) add("on-by-default", "the stored value falls back to on; a first visit has sound", lineAt(text, m.index));
  for (const m of keep.matchAll(/\b(?:let|var|const)\s+([A-Za-z_$][\w$]*)\s*=\s*(true|false)\b/g)) {
    if (!code(m)) continue;
    const n = m[1];
    const soundish = /sound|audio|sfx/i.test(n) || /^(enabled|isEnabled)$/.test(n);
    if (m[2] === "true" && soundish && !/mute/i.test(n)) add("on-by-default", `${n} starts true; product sound ships off`, lineAt(text, m.index));
    if (m[2] === "false" && /mute/i.test(n)) add("on-by-default", `${n} starts false, so sound starts on; product sound ships off`, lineAt(text, m.index));
  }
  return { findings, checked: true, info: "playback wiring" };
}

// ---------------------------------------------------------------- run
const CODE_EXT = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html", ".htm", ".vue", ".svelte"]);
const OTHER_AUDIO = new Set([".mp3", ".ogg", ".opus", ".m4a", ".aac", ".flac", ".aif", ".aiff", ".webm"]);

function walk(dir) {
  return readdirSync(dir).sort().flatMap((f) => {
    if (f.startsWith(".") || f === "node_modules") return [];
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

function checkFile(path, opts) {
  const ext = extname(path).toLowerCase();
  if (ext === ".json") return checkJson(readFileSync(path, "utf8"), path);
  if (ext === ".wav") return checkWav(readFileSync(path), path, opts);
  if (CODE_EXT.has(ext)) return checkCode(readFileSync(path, "utf8"), path);
  if (OTHER_AUDIO.has(ext)) return { findings: [], checked: false, skipped: "compressed audio is not parsed; check the .wav source" };
  return { findings: [], checked: false, skipped: null };
}

const show = (p) => { const rel = relative(process.cwd(), p); return (rel && !rel.startsWith("..") ? rel : p).replace(/\\/g, "/"); };
const printFinding = (f) => console.log(`${f.line}: ${f.detail} (${show(f.file)}:${f.lineNumber})`);
function tally(list) {
  const by = {};
  for (const f of list) by[f.line] = (by[f.line] ?? 0) + 1;
  return Object.entries(by).map(([k, v]) => `${k} ${v}`).join(", ");
}

function run(paths, opts) {
  const targets = [];
  const notChecked = [];
  for (const p of paths) {
    const abs = resolve(p);
    if (!existsSync(abs)) { notChecked.push(`${p}: does not exist`); opts.unreadable = true; continue; }
    if (statSync(abs).isDirectory()) for (const f of walk(abs)) targets.push({ path: f, explicit: false });
    else targets.push({ path: abs, explicit: true });
  }
  const files = [], findings = [];
  let unreadable = Boolean(opts.unreadable);
  for (const { path, explicit } of targets) {
    const r = checkFile(path, opts);
    if (r.checked) {
      files.push(show(path));
      if (!opts.quiet) console.log(`  read ${show(path)}: ${r.info}`);
      findings.push(...r.findings);
    } else if (r.unreadable) {
      notChecked.push(`${show(path)}: ${r.unreadable}`);
      if (explicit || extname(path).toLowerCase() === ".wav") unreadable = true;
    } else if (r.skipped) {
      notChecked.push(`${show(path)}: ${r.skipped}`);
      if (explicit) unreadable = true;
    } else if (explicit) {
      notChecked.push(`${show(path)}: not a .json, .wav or code file`);
      unreadable = true;
    }
  }
  const never = findings.filter((f) => f.class === "never-intentional");
  const cands = findings.filter((f) => f.class === "candidate");
  let status = "passed";
  if (never.length || (opts.strict && cands.length)) status = "failed";
  else if (!files.length || unreadable) status = "inconclusive";
  const exitCode = status === "failed" ? 1 : status === "inconclusive" ? 2 : 0;
  return { status, exitCode, files, findings, never, cands, notChecked };
}

function print(res, opts) {
  for (const f of res.never) printFinding(f);
  for (const f of res.cands) printFinding(f);
  console.log(`never intentional: ${res.never.length}${res.never.length ? ` (${tally(res.never)})` : ""}`);
  console.log(`candidates: ${res.cands.length}${res.cands.length ? ` (${tally(res.cands)})` : ""}`);
  for (const n of res.notChecked) console.log(`not checked: ${n}`);
  console.log(`not checked, ever: feel, timbre, fit, the 100th use, sync on the rendered picture, LUFS and true peak (see --help)`);
  console.log("passing is necessary, not sufficient");
  if (res.status === "inconclusive") console.log(`${GATE} inconclusive: ${res.files.length ? "something could not be read" : "no manifest, cue sheet, .wav or playback code to check"}`);
  else if (res.status === "failed") console.log(`${GATE} failed: ${res.never.length} never-intentional${opts.strict ? `, ${res.cands.length} candidate(s)` : ""}`);
  else if (opts.gate) console.log(`${GATE} passed`);
  else console.log(`${GATE}: nothing never-intentional in ${res.files.length} file(s); run with --gate for the verdict`);
}

// ---------------------------------------------------------------- self-test
function tone({ ms = 70, freq = 3200, peakDb = -3, leadMs = 0, channels = 1, rate = 44100, fade = true, clip = false }) {
  const n = Math.floor((rate * ms) / 1000), lead = Math.floor((rate * leadMs) / 1000);
  const s = new Float64Array(lead + n);
  for (let i = 0; i < n; i++) s[lead + i] = Math.cos((2 * Math.PI * freq * i) / rate) * Math.exp(-i / rate / 0.018);
  const f = Math.min(Math.floor(rate * 0.01), n);
  if (fade) for (let i = 0; i < f; i++) s[s.length - 1 - i] *= i / f;
  else for (let i = 0; i < n; i++) s[lead + i] = Math.cos((2 * Math.PI * freq * i) / rate);
  let peak = 0;
  for (const v of s) peak = Math.max(peak, Math.abs(v));
  const g = (clip ? 2 : 10 ** (peakDb / 20)) / peak;
  const buf = Buffer.alloc(44 + s.length * 2 * channels);
  buf.write("RIFF", 0); buf.writeUInt32LE(buf.length - 8, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(channels, 22);
  buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2 * channels, 28); buf.writeUInt16LE(2 * channels, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(s.length * 2 * channels, 40);
  for (let i = 0; i < s.length; i++) for (let ch = 0; ch < channels; ch++) buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s[i] * g)) * 32767), 44 + (i * channels + ch) * 2);
  return buf;
}

function selfTest() {
  const root = join(HERE, "..");
  const examples = join(root, "examples"), teaching = join(root, "teaching");
  let failed = 0, count = 0;
  const assert = (ok, what) => { count++; if (!ok) failed++; console.log(`${ok ? "ok  " : "FAIL"} ${what}`); };
  const neverOf = (r) => [...new Set(r.findings.filter((f) => f.class === "never-intentional").map((f) => f.line))];

  console.log("examples: every gold file is read and raises no never-intentional line");
  const gold = existsSync(examples) ? walk(examples) : [];
  assert(gold.length >= 3, `examples/ holds ${gold.length} file(s)`);
  for (const f of gold) {
    const r = checkFile(f, {});
    const lines = neverOf(r);
    assert(r.checked && !lines.length, `examples/${relative(examples, f).replace(/\\/g, "/")}${r.checked ? (lines.length ? ` raised ${lines.join(", ")}` : "") : ` was not read (${r.unreadable ?? r.skipped ?? "unknown type"})`}`);
  }

  console.log("teaching: each bad raises the line its folder is named for; its good raises nothing");
  const covered = new Set();
  const pairs = existsSync(teaching) ? readdirSync(teaching).sort().filter((d) => statSync(join(teaching, d)).isDirectory()) : [];
  assert(pairs.length >= 8, `teaching/ holds ${pairs.length} pair(s)`);
  for (const d of pairs) {
    const inside = readdirSync(join(teaching, d));
    const bad = inside.find((f) => f.startsWith("bad.")), good = inside.find((f) => f.startsWith("good."));
    if (!(d in NEVER)) { assert(false, `teaching/${d} is not a never-intentional line`); continue; }
    if (!bad || !good) { assert(false, `teaching/${d} needs bad.* and good.*`); continue; }
    covered.add(d);
    const rb = checkFile(join(teaching, d, bad), {}), rg = checkFile(join(teaching, d, good), {});
    assert(rb.checked && neverOf(rb).includes(d), `teaching/${d}/${bad} raises ${d}:${rb.checked ? ` (raised: ${neverOf(rb).join(", ") || "nothing"})` : " (was not read)"}`);
    assert(rg.checked && !neverOf(rg).length, `teaching/${d}/${good} raises nothing${rg.checked && neverOf(rg).length ? ` (raised: ${neverOf(rg).join(", ")})` : ""}`);
  }

  console.log("mutations: a gold example with one thing broken raises that line");
  const load = (name) => { const p = join(examples, name); return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null; };
  const family = load("family.json"), product = load("product-cues.json"), film = load("film-cues.json");
  const wiringPath = join(examples, "wiring.js");
  const wiring = existsSync(wiringPath) ? readFileSync(wiringPath, "utf8") : null;
  const json = (doc, edit) => { const d = structuredClone(doc); edit(d); return checkJson(JSON.stringify(d, null, 2), "mutation.json"); };
  const first = (doc) => Object.values(doc.sounds)[0];
  const cases = {
    "no-material": () => family && json(family, (d) => { delete d.material; }),
    "mixed-material": () => family && json(family, (d) => { first(d).material = "glass bell, long tail"; }),
    "too-long": () => family && json(family, (d) => { first(d).ms = 640; }),
    "hot-peak": () => checkWav(tone({ peakDb: -0.2 }), "tick.wav"),
    "no-licence": () => family && json(family, (d) => { delete first(d).license; delete first(d).licence; first(d).file ??= "tick.wav"; }),
    "bad-licence": () => family && json(family, (d) => { first(d).file ??= "tick.wav"; first(d).license = "CC BY-NC 4.0"; }),
    "no-time": () => product && json(product, (d) => { delete d.cues[0].t; delete d.cues[0].frame; }),
    "forbidden-moment": () => product && json(product, (d) => { d.cues[0].trigger = "keydown"; }),
    "no-mute": () => product && json(product, (d) => { delete d.mute; }),
    "on-by-default": () => product && json(product, (d) => { d.defaultOn = true; }),
    "no-twin": () => product && json(product, (d) => { delete d.cues[0].twin; }),
    "sound-leads": () => film && json(film, (d) => { d.cues[0].lag = -0.03; }),
    "picture-not-locked": () => film && json(film, (d) => { d.locked = false; }),
    "no-register": () => film && json(film, (d) => { delete d.register; }),
    "no-loudness": () => film && json(film, (d) => { delete d.target.lufs; }),
    "true-peak": () => film && json(film, (d) => { d.target.dbtp = -0.2; }),
    "cue-past-end": () => film && json(film, (d) => { d.cues[0].t = d.duration + 1; }),
    "leading-silence": () => checkWav(tone({ leadMs: 12 }), "tick.wav"),
    "clipped": () => checkWav(tone({ clip: true }), "tick.wav"),
    "stereo": () => checkWav(tone({ channels: 2 }), "tick.wav"),
    "sample-rate": () => checkWav(tone({ rate: 48000 }), "tick.wav"),
    "abrupt-end": () => checkWav(tone({ fade: false }), "tick.wav"),
    "media-element": () => wiring && checkCode(`${wiring}\nbutton.onclick = () => new Audio("/sfx/tick.mp3").play();\n`, "mutation.js"),
    "context-at-load": () => wiring && checkCode(`const eager = new AudioContext();\n${wiring}`, "mutation.js"),
    "sound-on-input": () => wiring && checkCode(`${wiring}\nfield.addEventListener("keydown", () => play("tick"));\n`, "mutation.js"),
  };
  for (const line of Object.keys(NEVER)) {
    const r = cases[line]?.();
    assert(Boolean(r) && r.checked && neverOf(r).includes(line), `${line}: is raised by its mutation${covered.has(line) ? " (and has a teaching pair)" : ""}${r ? "" : " (no case, or the gold it mutates is missing)"}`);
  }
  const clean = checkWav(tone({}), "tick.wav");
  assert(clean.checked && !clean.findings.length, `a clean 70 ms tick raises no line at all${clean.findings.length ? ` (raised: ${clean.findings.map((f) => f.line).join(", ")})` : ""}`);

  console.log(`${count - failed} of ${count} assertions hold`);
  console.log(failed ? "self-test FAILED" : "self-test ok");
  process.exit(failed ? 1 : 0);
}

// ---------------------------------------------------------------- CLI
const argv = process.argv.slice(2);
if (argv.includes("--help") || argv.includes("-h")) { console.log(HELP); process.exit(0); }
if (argv.includes("--self-test")) selfTest();
const opts = { gate: argv.includes("--gate"), strict: argv.includes("--strict"), film: argv.includes("--film") };
const reportAt = argv.indexOf("--report");
const reportPath = reportAt >= 0 ? argv[reportAt + 1] : null;
const paths = argv.filter((a, i) => !a.startsWith("--") && !(reportAt >= 0 && i === reportAt + 1));
const res = run(paths, opts);
print(res, opts);
// Without --gate this is a report: faults are listed and only --strict or an unreadable input changes the exit code.
const exitCode = opts.gate || opts.strict || res.status === "inconclusive" ? res.exitCode : 0;
if (reportPath) {
  writeFileSync(reportPath, JSON.stringify({
    gate: GATE, status: res.status, exitCode, files: res.files,
    findings: res.findings.map((f) => ({ line: f.line, file: show(f.file), lineNumber: f.lineNumber, detail: f.detail, class: f.class })),
    notChecked: [...res.notChecked, ...NOT_CHECKED],
  }, null, 2) + "\n");
}
process.exit(exitCode);
