#!/usr/bin/env node
// post: the ffmpeg recipes a take goes through after it is recorded.
//
//   node scripts/post.mjs <command> <in> <out> [options]
//
// trim, ramp, zoom, crop, gif, mp4, webm, poster, sheet, probe. Every command writes a
// new file and never touches its input. Node 20+, needs ffmpeg and ffprobe on PATH.
// Exit 0 written, 1 ffmpeg failed, 2 it could not run. Recipes: references/post.md.

import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { extname } from "node:path";

const RAMP_TO = 0.5; // s a ramped wait lasts on screen: seen, never felt
const RAMP_MAX = 8; // past 8x a spinner is a flicker
const EASE = 0.5; // s a push-in takes to arrive and to leave
const ZOOM_MAX = 2; // a scale-2 take holds 2x before it shows less than one file pixel per screen pixel
const MASTER = ["-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an"];

const die = (code, msg) => { console.error(msg); process.exit(code); };
const has = (bin) => spawnSync(bin, ["-version"], { encoding: "utf8" }).status === 0;

function parse(argv) {
  const opts = { span: [] };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) { rest.push(a); continue; }
    const key = a.slice(2);
    if (key === "help") { opts.help = true; continue; }
    const value = argv[++i];
    if (key === "span") opts.span.push(value); else opts[key] = value;
  }
  return { opts, rest };
}

function probe(file) {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=codec_name,width,height,avg_frame_rate,pix_fmt:format=duration,size", "-of", "json", file], { encoding: "utf8" });
  if (r.status !== 0) die(1, `ffprobe failed on ${file}: ${(r.stderr || "").trim().split("\n")[0]}`);
  const j = JSON.parse(r.stdout);
  const st = j.streams[0];
  const [a, b] = String(st.avg_frame_rate).split("/").map(Number);
  return { codec: st.codec_name, width: st.width, height: st.height, fps: b ? a / b : a, pix_fmt: st.pix_fmt, duration: Number(j.format.duration), bytes: Number(j.format.size) };
}

function ffmpeg(args, out) {
  const r = spawnSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", ...args], { encoding: "utf8" });
  if (r.status !== 0) die(1, `ffmpeg failed: ${(r.stderr || "").trim().split("\n").slice(-3).join(" | ")}`);
  if (!existsSync(out) || statSync(out).size === 0) die(1, `ffmpeg wrote nothing to ${out}`);
  const p = /\.png$/i.test(out) ? null : probe(out);
  console.log(p ? `wrote ${out}: ${p.duration.toFixed(2)} s, ${p.width} x ${p.height}, ${p.fps.toFixed(2)} fps, ${(p.bytes / 1e6).toFixed(2)} MB` : `wrote ${out}`);
}

const even = (n) => Math.round(n / 2) * 2;
const rect = (text, what) => {
  const parts = String(text || "").split(",").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) die(2, `${what} needs --rect x,y,w,h in the file's own pixels`);
  return parts;
};
const fpsText = (fps) => (Math.abs(fps - Math.round(fps)) < 0.01 ? String(Math.round(fps)) : fps.toFixed(3));

const commands = {
  probe(input) {
    const p = probe(input);
    console.log(`${input}: ${p.duration.toFixed(2)} s, ${p.width} x ${p.height}, ${p.fps.toFixed(2)} fps, ${p.codec}/${p.pix_fmt}, ${(p.bytes / 1e6).toFixed(2)} MB`);
  },

  // Cut the handles off. Re-encodes, so the cut lands on the frame asked for.
  trim(input, out, o) {
    const from = Number(o.from ?? 0);
    const to = o.to === undefined ? probe(input).duration : Number(o.to);
    if (!(to > from)) die(2, "trim needs --from and --to in seconds, with to after from");
    ffmpeg(["-i", input, "-vf", `trim=start=${from}:end=${to},setpts=PTS-STARTPTS`, ...MASTER, out], out);
  },

  // Speed up the spans where the app made the viewer wait. --span 3.2-5.1 lands the wait on
  // 0.5 s; --span 3.2-5.1@4 plays it at 4x. Everything else keeps its real speed.
  ramp(input, out, o) {
    const p = probe(input);
    const spans = o.span.map((text) => {
      const m = String(text).match(/^([\d.]+)-([\d.]+)(?:@([\d.]+))?$/);
      if (!m) die(2, `--span ${text}: write it as start-end or start-end@speed, in seconds`);
      const start = Number(m[1]), end = Number(m[2]);
      if (!(end > start) || end > p.duration + 0.05) die(2, `--span ${text}: outside the file (${p.duration.toFixed(2)} s)`);
      const speed = m[3] ? Number(m[3]) : (end - start) / RAMP_TO;
      if (speed <= 1) die(2, `--span ${text}: ${(end - start).toFixed(2)} s is already under ${RAMP_TO} s; leave it`);
      if (speed > RAMP_MAX) console.log(`note: ${text} plays at ${speed.toFixed(1)}x; past ${RAMP_MAX}x a spinner reads as a flicker, so cut the span with trim or fix the wait in the app`);
      return { start, end, speed };
    }).sort((a, b) => a.start - b.start);
    if (!spans.length) die(2, "ramp needs at least one --span");
    const parts = [];
    let at = 0;
    for (const s of spans) {
      if (s.start < at) die(2, "--span values overlap");
      if (s.start > at) parts.push({ start: at, end: s.start, speed: 1 });
      parts.push(s);
      at = s.end;
    }
    if (at < p.duration) parts.push({ start: at, end: p.duration, speed: 1 });
    const split = `[0:v]split=${parts.length}${parts.map((_, i) => `[s${i}]`).join("")}`;
    const segs = parts.map((s, i) => `[s${i}]trim=start=${s.start}:end=${s.end},setpts=(PTS-STARTPTS)/${s.speed}[v${i}]`);
    const concat = `${parts.map((_, i) => `[v${i}]`).join("")}concat=n=${parts.length}:v=1:a=0,fps=${fpsText(p.fps)}[out]`;
    ffmpeg(["-i", input, "-filter_complex", [split, ...segs, concat].join(";"), "-map", "[out]", ...MASTER, out], out);
  },

  // Push in on the action between two times, eased in and out, then back to the whole frame.
  zoom(input, out, o) {
    const p = probe(input);
    const [x, y, w] = rect(o.rect, "zoom");
    const from = Number(o.from), to = Number(o.to);
    if (!(to > from)) die(2, "zoom needs --from and --to in seconds");
    const ease = Math.min(EASE, (to - from) / 2);
    const Z = p.width / w;
    if (Z <= 1) die(2, "the rect is as wide as the frame: nothing to zoom into");
    if (Z > ZOOM_MAX) console.log(`note: ${Z.toFixed(2)}x is past ${ZOOM_MAX}x; the push shows fewer file pixels than screen pixels and softens`);
    const h = w * (p.height / p.width);
    const rx = Math.max(0, Math.min(p.width - w, x));
    const ry = Math.max(0, Math.min(p.height - h, y));
    const ramp = `min(clip((it-${from})/${ease},0,1),clip((${to}-it)/${ease},0,1))`;
    const z = `1+(${Z.toFixed(5)}-1)*(${ramp})*(${ramp})*(3-2*(${ramp}))`;
    const share = `(1-1/zoom)/(1-1/${Z.toFixed(5)})`;
    const vf = `zoompan=z='${z}':x='${rx.toFixed(2)}*${share}':y='${ry.toFixed(2)}*${share}':d=1:s=${p.width}x${p.height}:fps=${fpsText(p.fps)}`;
    ffmpeg(["-i", input, "-vf", vf, ...MASTER, out], out);
  },

  // One fixed crop for the whole clip, scaled to --width when given.
  crop(input, out, o) {
    const [x, y, w, h] = rect(o.rect, "crop");
    const scale = o.width ? `,scale=${even(Number(o.width))}:-2:flags=lanczos` : "";
    ffmpeg(["-i", input, "-vf", `crop=${even(w)}:${even(h)}:${Math.round(x)}:${Math.round(y)}${scale}`, ...MASTER, out], out);
  },

  // A GIF from a palette built for this clip. 20 fps is a 5 centisecond delay, which a GIF can hold exactly.
  gif(input, out, o) {
    const width = even(Number(o.width ?? 800));
    const fps = Number(o.fps ?? 20);
    if (![10, 12.5, 20, 25, 50].includes(fps)) die(2, `--fps ${fps}: a GIF delay is whole centiseconds; use 10, 12.5, 20, 25 or 50`);
    const vf = `fps=${fps},scale=${width}:-2:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`;
    ffmpeg(["-i", input, "-filter_complex", vf, "-loop", "0", out], out);
  },

  // The delivery file: H.264, yuv420p, the index at the front so it plays before it finishes loading.
  mp4(input, out, o) {
    const scale = o.width ? ["-vf", `scale=${even(Number(o.width))}:-2:flags=lanczos`] : [];
    ffmpeg(["-i", input, ...scale, "-c:v", "libx264", "-preset", "slow", "-crf", String(o.crf ?? 20), "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out], out);
  },

  webm(input, out, o) {
    const scale = o.width ? ["-vf", `scale=${even(Number(o.width))}:-2:flags=lanczos`] : [];
    ffmpeg(["-i", input, ...scale, "-c:v", "libvpx-vp9", "-crf", String(o.crf ?? 32), "-b:v", "0", "-row-mt", "1", "-an", out], out);
  },

  // One frame as a PNG: the poster. Take it from inside the payoff hold, never mid-change.
  poster(input, out, o) {
    if (o.at === undefined) die(2, "poster needs --at in seconds, inside the payoff hold");
    ffmpeg(["-ss", String(o.at), "-i", input, "-frames:v", "1", "-update", "1", out], out);
  },

  // A contact sheet: one frame every --every seconds, in rows of five. The evidence a review reads.
  sheet(input, out, o) {
    const p = probe(input);
    const every = Number(o.every ?? 0.5);
    const cols = Number(o.cols ?? 5);
    const count = Math.max(1, Math.ceil(p.duration / every));
    const rows = Math.ceil(count / cols);
    const cell = even(Number(o.width ?? 480));
    ffmpeg(["-i", input, "-vf", `fps=1/${every},scale=${cell}:-2:flags=lanczos,tile=${cols}x${rows}:padding=4:color=white`, "-frames:v", "1", "-update", "1", out], out);
    console.log(`${count} frames, one every ${every} s, ${cols} to a row, read left to right`);
  },
};

function help() {
  console.log(`post: the ffmpeg recipes a take goes through after it is recorded

  node scripts/post.mjs <command> <in> <out> [options]

  trim   <in> <out> --from <s> --to <s>            cut the handles; frame-accurate
  ramp   <in> <out> --span <a-b[@speed]> ...       speed up waits; with no speed a span lands on ${RAMP_TO} s
  zoom   <in> <out> --rect x,y,w,h --from <s> --to <s>
                                                   push in on the action, ${EASE} s in and ${EASE} s out
  crop   <in> <out> --rect x,y,w,h [--width <px>]  one fixed crop for the whole clip
  gif    <in> <out.gif> [--width 800] [--fps 20]   palette built for this clip; 10, 12.5, 20, 25 or 50 fps
  mp4    <in> <out.mp4> [--width <px>] [--crf 20]  H.264, yuv420p, faststart
  webm   <in> <out.webm> [--width <px>] [--crf 32] VP9
  poster <in> <out.png> --at <s>                   one frame, from inside the payoff hold
  sheet  <in> <out.png> [--every 0.5] [--cols 5]   a contact sheet for the review
  probe  <in>                                      duration, size, frame rate, codec

Order: trim, then ramp, then zoom or crop, then the delivery files. Each step re-encodes
at CRF 16, so three steps cost no visible detail; the delivery encode is the only lossy one
a viewer can see. Rects are in the file's own pixels (a 1280 x 720 take at scale 2 is
2560 x 1440). No command adds captions, music or sound. Run demo-check on what you hand over.`);
}

const { opts, rest } = parse(process.argv.slice(2));
const [command, input, out] = rest;
if (opts.help || !command) { help(); process.exit(command || opts.help ? 0 : 2); }
if (!(command in commands)) die(2, `unknown command "${command}". Run with --help`);
if (!has("ffmpeg") || !has("ffprobe")) die(2, "inconclusive: ffmpeg and ffprobe must be on PATH; nothing was written");
if (!input || !existsSync(input)) die(2, `inconclusive: ${input || "the input file"} not found`);
if (command !== "probe") {
  if (!out) die(2, `${command} needs an output file`);
  if (out === input) die(2, "the output is the input; every command writes a new file");
  const want = { gif: [".gif"], mp4: [".mp4"], webm: [".webm"], poster: [".png"], sheet: [".png"] }[command] || [".mp4", ".mov", ".mkv"];
  if (!want.includes(extname(out).toLowerCase())) die(2, `${command} writes ${want.join(" or ")}`);
}
commands[command](input, out, opts);
