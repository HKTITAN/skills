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

- `animate`: a transient needs a contact frame, so the move has to be settled before a sound can be placed on it.
- `khe-launch-film`: the film's register, reveal and cuts decide where the drop, the gaps and the breakdowns go, and picture must be locked there first.

## What is inside

- [SKILL.md](SKILL.md): the scope, the rules and the steps the agent follows.
- `references/`: 15 references the agent opens one at a time, plus `gotchas.md` and `pov.md`, which are yours to edit.
- `scripts/`: `sound-family.mjs`, `sound-sheet.mjs`.
- [LICENSE](LICENSE): MIT.
