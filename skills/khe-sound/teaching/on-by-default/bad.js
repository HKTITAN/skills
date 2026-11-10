// bad: on-by-default. Anything but a stored "off" counts as on, so every first visit has sound.
const FILES = { tick: "/sfx/tick.mp3", send: "/sfx/send.mp3" };
let ctx = null;
const buffers = new Map();
let soundOn = localStorage.getItem("sound") !== "off";

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
  if (!soundOn || !ctx || ctx.state !== "running") return;
  const buffer = buffers.get(name);
  if (!buffer) return;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.connect(ctx.destination);
  source.start();
}
