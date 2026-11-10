// bad: media-element. Each play builds a media element, which adds tens of milliseconds before the first sample and lands the transient late.
const FILES = { tick: "/sfx/tick.mp3", send: "/sfx/send.mp3" };
let ctx = null;
const buffers = new Map();
let soundOn = localStorage.getItem("sound") === "on";

async function unlock() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  for (const [name, url] of Object.entries(FILES)) {
    if (buffers.has(name)) continue;
    const data = await (await fetch(url)).arrayBuffer();
    buffers.set(name, await ctx.decodeAudioData(data));
  }
}
addEventListener("pointerdown", unlock, { once: true });
addEventListener("keydown", unlock, { once: true });

export function play(name) {
  if (!soundOn) return;
  new Audio(FILES[name]).play();
}
