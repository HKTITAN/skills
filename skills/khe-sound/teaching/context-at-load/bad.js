// bad: context-at-load. The context is created when the module loads, starts suspended, and every play drops until something resumes it: sound works on the second click.
const FILES = { tick: "/sfx/tick.mp3", send: "/sfx/send.mp3" };
const ctx = new AudioContext();
const buffers = new Map();
let soundOn = localStorage.getItem("sound") === "on";

async function unlock() {
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
