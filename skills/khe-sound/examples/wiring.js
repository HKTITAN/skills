// Gold for web playback wiring. Learn the order: nothing audible exists until a gesture,
// sound is off until the user stores "on", every play is a fresh source node from a buffer
// decoded once, and the sound fires where the visual makes contact.
// Rules: references/sound-playback-web.md and references/sound-motion-sync.md.

const FILES = { tick: "/sfx/tick.mp3", send: "/sfx/send.mp3", error: "/sfx/error.mp3" };
const KEY = "sound";

let ctx = null; // created inside the first gesture, never at module load
const buffers = new Map();
let soundOn = localStorage.getItem(KEY) === "on"; // only a stored "on" turns sound on

// The first pointer or key event creates and resumes the context, then decodes every file
// once, so no later play waits on a fetch.
async function unlock() {
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  await Promise.all(
    Object.entries(FILES).map(async ([name, url]) => {
      if (buffers.has(name)) return;
      const data = await (await fetch(url)).arrayBuffer();
      buffers.set(name, await ctx.decodeAudioData(data));
    }),
  );
}
addEventListener("pointerdown", unlock, { once: true });
addEventListener("keydown", unlock, { once: true });

// One source node per play: it is the only web primitive with no start-up latency.
// A hidden tab stays silent.
export function play(name, { rate = 1, gain = 1 } = {}) {
  if (!soundOn || !ctx || ctx.state !== "running" || document.hidden) return;
  const buffer = buffers.get(name);
  if (!buffer) return;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = rate;
  const level = ctx.createGain();
  level.gain.value = gain;
  source.connect(level).connect(ctx.destination);
  source.start();
}

// The mute control: a real checkbox in settings, so it is reachable by keyboard. The choice
// is stored, and turning sound on confirms with the family's own tick.
export function setSound(on) {
  soundOn = on;
  localStorage.setItem(KEY, on ? "on" : "off");
  if (on) play("tick");
}
const toggle = document.querySelector("#sound-toggle");
toggle.checked = soundOn;
toggle.addEventListener("change", () => setSound(toggle.checked));

// A sound that confirms a landing fires when the tween ends, on the result, never on the
// key or the press that asked for it. The row's synced mark is the visual twin.
export function confirmSync(row) {
  row.classList.add("is-synced");
  row.addEventListener(
    "transitionend",
    (event) => {
      if (event.propertyName === "transform") play("send");
    },
    { once: true },
  );
}

// A rejected submit: the shake starts with the state change, so the sound starts with it.
export function rejectSubmit(field) {
  field.classList.add("is-invalid");
  play("error");
}
