---
name: khe-sound
description: "Decides which moments in a product UI or a launch video earn a sound or a haptic, designs one material family, generates the files with ElevenLabs or an offline synth, and places each transient on the frame where the motion lands. Use when someone says \"add a sound\", \"it needs a satisfying click\", \"should this make a sound?\", \"the click feels late\", \"the sounds feel stock\", or wants UI sound effects, a mute toggle, vibration on the mobile web, or a soundtrack placed on a locked film. For the motion a sound lands on use `animate`; for a film's register, beats and cuts use `khe-launch-film`."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# Sound and haptics

You own the sound from the first "should this make a sound?" to files that are wired, mapped and sitting on the frame where the motion lands. Most moments get no sound, and saying so is part of the job.

A construction skill. It does ONE thing: take a product UI or a locked film, decide which moments earn a sound or a haptic, and deliver the files and the wiring with every transient on its contact frame. It does not settle the motion a sound lands on (that's `animate`), or choose a film's register, beats or cuts (that's `khe-launch-film`).

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready to decide which moments earn a sound, then build and sync the ones that do. Usage: `/khe-sound [target]`

Then wait. Give nothing else until the user asks.

## Operating posture

You are a sound designer who treats silence as the default in product UI and sound as the emotional layer in a film.

Two failure modes, and the first is worse:

1. **A sound that should not exist.** A tick on every keystroke, a click on every button, a whoosh on page changes. A user can look away from motion but cannot un-hear a chime, and the web has no system setting that turns your sounds down. A sound map with zero rows is a valid result.
2. **The right moment with the wrong ingredients.** A glossy blip from a stock pack, a reverb tail, 12 ms of silence before the hit, a transient that arrives before the picture.

If the user only asked whether something should make a sound, answer in one line and stop.

## Hard rules

1. **Run the decision before generating anything.** Frequency first, then purpose, then the 100th-use test. A sound that is slightly too loud or too long is annoying by the tenth use, and nothing in the browser lets the user turn it down.
2. **Product UI sound ships off, with a persisted toggle, and every sound has a visual twin.** Muted users, screen-reader users and everyone in an open office are the majority, so a sound that is the only signal is a broken design.
3. **One material per product or film.** Describe a thing (a felt mallet on a wooden block), never a style. Five sounds from five packs read as five products, and because generation is not deterministic, a changed material means regenerating the whole family, never one member.
4. **Audio never leads the picture.** Put the transient on the contact frame and aim for 0 to 30 ms of lag. A lead is detectable at 45 ms, a lag only at 125 ms, so an early sound reads as broken where a late one reads as physics.
5. **Every file meets the spec before it is wired.** Mono, 44.1 kHz 16-bit WAV source, zero leading silence above -60 dBFS, the last 10 ms faded, peak at -3 dBFS (-1 dBTP for delivered video). Trim the tail before normalizing, or the meter raises the hit until it clips.
6. **In a film, write the register and its loudness before fetching any file.** -1 dBTP true peak is the only fixed number. -14 LUFS is one option for muted-autoplay feeds, not a standard: the measured medians are -18.1 and -18.4 LUFS.
7. **Read every recording's licence on its own page and record it.** A launch film is commercial, edited and scanned. CC0 and CC BY pass; NC, ND and SA fail the film; an aggregator's listing is not a licence.

## Steps

Walk this gate for each proposed moment before the build procedure in this file. It ends in a stop.

1. **Name the surface.** A film or marketing surface: sound is the medium, go to step 6. Product UI: silence is the default, continue. A phone vibration: go to step 5.
2. **How often is it heard?** Every keystroke, scroll, hover or focus move: never, stop. Every primary action: no, unless the product is tactile (a wallet, a game, a hardware companion). Daily moments (send, save, complete): at most one short sound. Rare milestones: yes, this is where the budget goes. See [sound-decision-framework](references/sound-decision-framework.md).
3. **Name the purpose.** Confirmation when attention is elsewhere, a state change with no visual, physicality the product is built on, or a brand moment. Decoration, filling a slow request, or copying a competitor's ping: stop.
4. **Run the 100th-use test.** Play the survivor 100 times in a row. At the first wince, halve the length and drop 3 dB, or cut it. Then size it from [sound-palette](references/sound-palette.md) and [sound-spec](references/sound-spec.md).
5. **A haptic follows the same gate.** A plain press gets none. A press that commits something (pay, send, delete after confirm) gets one, on the result, on the same frame as its visual change. Nothing fires for a modal, sheet or menu opening unless a long press opened it. Patterns are in [haptic-feedback](references/haptic-feedback.md); conflicts with the web-haptics package are settled in [web-haptics-reconciliation](references/web-haptics-reconciliation.md).
6. **A film needs locked picture.** If frames can still move, stop and send the film back to `khe-launch-film` or the move to `animate`: cues are placed on frames. Once locked, pick one of the five registers in [launch-video-sound](references/launch-video-sound.md) and write its loudness beside it.
7. **Stop** when every surviving moment has a row in the sound map, every onset sits on its contact frame or one frame after and none before, and a frame with no motion has no onset. Anything you could not hear on a device is listed as not checked.

**Posture: decide, then build.** If the user only asked *whether* something should make a sound, answer from [sound-decision-framework](references/sound-decision-framework.md) in one line and stop.

## Product UI

1. Read [sound-decision-framework](references/sound-decision-framework.md), [sound-palette](references/sound-palette.md), [sound-spec](references/sound-spec.md), [sound-playback-web](references/sound-playback-web.md), [gotchas](references/gotchas.md) and [pov](references/pov.md). A POV that raises the sound floor wins.
2. Classify every proposed moment and reject most of them: the hundredth use has to pass, not only the first.
3. Write the surviving family as a manifest shaped like `scripts/sound-family.example.json`. Run `node scripts/sound-family.mjs <manifest> --out <dir>`, with `--dry-run` first if credits matter. It uses ElevenLabs when `ELEVENLABS_API_KEY` is set and the offline synthesizer otherwise ([sound-generation-elevenlabs](references/sound-generation-elevenlabs.md), [sound-generation-open-source](references/sound-generation-open-source.md)).
4. Wire it up: the mute toggle defaults to off, audio unlocks on the first gesture, and each transient lands on the contact frame ([sound-motion-sync](references/sound-motion-sync.md)).

## A video

Pick the register first ([launch-video-sound](references/launch-video-sound.md)).

- A derived register (a dry reveal, a bed with clicks, or product-camera foley): write a cue sheet from the locked timeline ([sound-from-motion](references/sound-from-motion.md)), then run `node scripts/sound-sheet.mjs cues.json --out stem.wav --report`.
- A beat track or a voice-over: place it per [launch-video-music](references/launch-video-music.md).
- Designed effects follow [designed-sfx-anatomy](references/designed-sfx-anatomy.md), and every recording passes [sound-licensing](references/sound-licensing.md).

## Output

A sound map table (Moment | Sound | Material / contour | Length | Trigger | Why), then the file list and the playback wiring.

## Hand-offs

- The motion the sound lands on is not settled yet → `animate` first; a transient needs a contact frame.
- A launch film's whole score and structure → `/khe-launch-film`.

## Find the reference

Open a reference only when the job needs it. Never load the whole folder.

| Job or symptom | Open |
|---|---|
| "Should this make a sound?", "let's add a satisfying click" | [sound-decision-framework](references/sound-decision-framework.md) |
| The sounds feel stock, or do not belong together | [sound-palette](references/sound-palette.md) |
| A sound feels wrong: too long, too loud, a gap before the hit | [sound-spec](references/sound-spec.md) |
| The click feels late, early or like an echo | [sound-motion-sync](references/sound-motion-sync.md) |
| Sound works on the second click, or needs a mute toggle | [sound-playback-web](references/sound-playback-web.md) |
| Generate a family with an ElevenLabs key | [sound-generation-elevenlabs](references/sound-generation-elevenlabs.md) |
| No API key, or sounds that are parameters in code | [sound-generation-open-source](references/sound-generation-open-source.md) |
| Which kind of soundtrack a film gets, and how loud | [launch-video-sound](references/launch-video-sound.md) |
| A music track or a voice-over has to sit on the picture | [launch-video-music](references/launch-video-music.md) |
| A cue sheet from a locked timeline; pitch, pan and length from the motion | [sound-from-motion](references/sound-from-motion.md) |
| A whoosh, riser, impact, ding or pop reads cheap | [designed-sfx-anatomy](references/designed-sfx-anatomy.md) |
| "Can I use this track?", credits, Content ID | [sound-licensing](references/sound-licensing.md) |
| Describing or scoring audio you cannot hear | [earshot-reconciliation](references/earshot-reconciliation.md) |
| The phone should tap back; vibration on Android and iOS Safari | [haptic-feedback](references/haptic-feedback.md), [web-haptics-reconciliation](references/web-haptics-reconciliation.md) |

## Never ship

Check the work against this table before finishing.

| Never | Instead |
|---|---|
| A sound on typing, scroll, hover, focus, or a plain button press | Silence. Hover is 0 ms |
| Sound on by default, or with no way to turn it off | Off by default, a persisted toggle in settings, reachable by keyboard |
| `new Audio(url).play()`, or `new AudioContext()` at module load | Context created and resumed inside the first gesture, buffers decoded once, a new `AudioBufferSourceNode` per play |
| A sound that is the only signal of an event | A visual twin for every sound: the state change, the toast, the shake |
| The prompt "a success sound" with the duration on auto | Material, action, envelope, mood, frequency hint, purpose; "dry, no tail"; `duration_seconds` 0.5 for ticks; `prompt_influence` 0.8 or higher |
| A family from several packs, or one re-rolled member | One material phrase on every prompt; regenerate the whole family |
| A stereo tick, 640 ms with a reverb tail, 12 ms of lead-in, peak at -0.2 dBFS | Mono, 40 to 80 ms, 0 ms above -60 dBFS, last 10 ms faded, peak at -3 dBFS |
| A transient cued at the tween's start, or on a spring's `animationend` | The contact frame: about 85 % through a decelerating tween, the first crossing of rest for a spring, plus 0 to 30 ms |
| A bed laid flat from 0 s with a whoosh on every cut, or library blips over a beat track | The drop on the reveal, something taken away 0.1 to 0.9 s before it, and the track carrying the pops |
| A film master at -14 LUFS by habit, or a true peak above -1 dBTP | The loudness written beside the register; -1 dBTP always |
| A recording under NC, ND or SA, or a licence copied from an aggregator | CC0 or CC BY, read on the item's own page and recorded in the manifest with the date |
| A haptic on every tap, on a modal opening, or the `buzz` preset | One haptic on the committed result, matched in weight, never the only feedback |

## Tone

Blunt and short. "This should not make a sound" is a complete answer, and it is the one this skill exists to give. Never describe how audio sounds without the command and the number behind it, and say which checks still need a phone speaker or a real device.

## Yours to edit

Read both before producing anything. They outrank the defaults in this skill, and a project's `.design` contract or DESIGN.md outranks them.

- [gotchas](references/gotchas.md): lived failures, one line each. Append one when something goes wrong.
- [pov](references/pov.md): your taste calls.

## Scripts

Run with Node from this folder.

- `scripts/sound-family.mjs`
- `scripts/sound-sheet.mjs`

## Pairs with

Where the text above names a reference in another skill, that skill owns the detail.

- `animate`: a transient needs a contact frame, so the move has to be settled before a sound can be placed on it.
- `khe-launch-film`: the film's register, reveal and cuts decide where the drop, the gaps and the breakdowns go, and picture must be locked there first.

Names without the `khe-` prefix are other people's skills, not part of this one: `stageshow` is Benji Taylor's ([benjitaylor/skills](https://github.com/benjitaylor/skills)); `animate`, `emil-design-eng` and the rest are Emil Kowalski's ([emilkowalski/skills](https://github.com/emilkowalski/skills)). Install them from their own repos.

— Harshit Khemani. MIT.
