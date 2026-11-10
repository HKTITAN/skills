# khe-sound

Which moments earn a sound or a haptic, one material family, generated and synced to motion.

```bash
npx skills add HKTITAN/skills --skill khe-sound
```

## What it does

- Decides, moment by moment, whether a sound or a haptic is earned, and rejects most of them.
- Designs one material family of four to six sounds and generates it with ElevenLabs or an offline synth.
- Wires playback for the web: off by default, unlocked on the first gesture, each transient on its contact frame.
- Places a film's sound on locked picture: the register, the cue sheet, the track's drop and the loudness.

## When to use it

Reach for it when a product or a launch video needs sound and you want fewer, better ones. It answers "should this make a sound?" in one line, builds a family that belongs to one object, and fixes sounds that feel stock, late or annoying. It also covers vibration on the mobile web and the licence check for any recording that goes into a film.

## Invoke with

`/khe-sound [target]`

Or describe the problem in your own words. The skill's description carries the triggers, so no special wording is needed.

## Before and after

Before: a click on every button and a whoosh on page changes; `tick.wav` is stereo, 640 ms, with 12 ms of silence before the hit; sound is on by default.

After: silent by default; one opt-in 180 ms two-note sync tone; `tick` is mono, 70 ms, peaked at -3 dBFS, and lands 0 to 30 ms after its contact frame.

## Example prompts

- Our to-do app feels flat. Should checking off a task make a sound?
- The click in my launch video lands a few frames after the cursor presses. Why does it feel late?
- I need a tick, a send and an error sound that belong together, and I don't have an ElevenLabs key.

## Pairs with

- `khe-ui`: a transient needs a contact frame, so the move has to be settled before a sound can be placed on it.
- `khe-launch-film`: the film's register, reveal and cuts decide where the drop, the gaps and the breakdowns go, and picture must be locked there first.

## Verify

```bash
node scripts/sound-check.mjs <sound-map.json> <family.json> <sfx folder> <playback file> --gate
node scripts/sound-check.mjs --self-test
```

The gate reads sound manifests, cue sheets, `.wav` files (from the RIFF header and the PCM samples) and web playback code, with no dependencies, and prints one named line per fault. `--gate` ends `sound check passed` only when every never-intentional line is at 0: no sound on typing, scroll, hover or focus, a declared mute that starts off, a visual twin per cue, one material, every cue on a time or a frame, no negative lag, lengths and peaks inside the spec, no lead-in of 5 ms or more, a licence per file, and for a film a locked picture, a register, a loudness and a -1 dBTP ceiling. With nothing to read it says `inconclusive` and exits 2.

What it proves: the numbers and the declarations. What it does not: feel, timbre, whether the sound suits the product, the 100th-use test, sync on the rendered picture, LUFS and true peak, and haptics on a real phone. Those are in `references/verify.md` under "Not checked by the gate". Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow with an exit per step, the rules.
- `references/`: 18 references the agent opens one at a time, including `verify.md` (the last pass and the `CUES.md` handover), `review.md` (the fresh-eye brief) and `teaching.md`, plus `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: the gold. A family manifest, a product sound map, a film cue sheet, web playback wiring and two finished `.wav` one-shots.
- `teaching/`: 14 bad/good pairs, one folder per gate line, each the same artifact with one thing wrong. They are also the gate's tests.
- `scripts/`: `sound-family.mjs` (a manifest to files), `sound-sheet.mjs` (a cue sheet to a stem), `sound-check.mjs` (the gate).
- [LICENSE](LICENSE): MIT.
