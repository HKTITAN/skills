---
title: verify
summary: The last pass for sound. The gate command and what a pass means, yes/no questions answered from measurements and stepped frames, the gate's lines, a table from symptom to fix, what no script can check, and the CUES.md handover.
tags: [sound, verify, gate, checklist, handover]
---

# Verify

The last pass. Every answer comes from a number you measured, a frame you stepped to or a line the gate printed. Never answer from the code, and never from memory of how it sounded: an agent cannot hear what it made. Fix the largest fault first, run the gate again, return to the top, and repeat until every answer is yes. The rules are in the references each section names.

## Gate

```sh
node scripts/sound-check.mjs <manifest.json> <cues.json> <sfx folder> <playback file> --gate
node scripts/sound-check.mjs stem.wav --film --gate      # a film stem: ceiling -1 dBFS, stereo allowed
node scripts/sound-check.mjs public/sfx --gate --report shots/sound.json
node scripts/sound-check.mjs --self-test                 # the gate against examples/ and teaching/
```

- The last line is `sound check passed`? That means every never-intentional line is at 0 in the files it read, and nothing else.
- Every file you made is in the `read` list? A file listed under `not checked` has not passed.
- The run did not end `inconclusive` (exit 2)? With no manifest, no cue sheet, no `.wav` and no playback code, or with a `.wav` it could not parse, the gate claims nothing.
- Each candidate line was looked at and either fixed or written into `CUES.md` with its reason?

The gate reads three kinds of input. A `.json` file is a family manifest (`sounds`), a product sound map (`cues`, with `mute` and `defaultOn`) or a film cue sheet (`surface: "film"`, `locked`, `register`, `target`, `files`, `cues`). A `.wav` is read from its RIFF header and PCM samples, and its role comes from its name (`tick.wav`, `ui-send.wav`). A code file is read for playback wiring. Passing is necessary, not sufficient.

## Should it exist (first, because a perfect file on the wrong moment is still a fault)

Rules: [sound-decision-framework](sound-decision-framework.md), [haptic-feedback](haptic-feedback.md).

- Every sound in the map has a row that says how often a user hears it in a day?
- No row fires on typing, scroll, hover, focus, page load or a route change (`forbidden-moment:`)?
- No row fires on a plain press, tap, toggle or select, unless the product is tactile and the map says so (`press-sound:`)?
- Each survivor names one of the four purposes: confirmation when attention is elsewhere, a state change with no visual, physicality the product is built on, or a brand moment?
- Each survivor was played 100 times in a row, and the count is in `CUES.md`?
- The moments that stay silent are written down with the reason?
- Every haptic sits on a committed result, a snap or a threshold, and none on a plain tap or on a modal, sheet or menu opening?

## The files

Rules: [sound-spec](sound-spec.md), [sound-palette](sound-palette.md), [designed-sfx-anatomy](designed-sfx-anatomy.md).

- One material line, a thing and what strikes it, sits on every prompt and every recipe (`no-material:`, `mixed-material:`, `style-material:`)?
- The family holds four to six sounds (`family-size:`)?
- Each one-shot is mono, 44.1 kHz, 16-bit (`stereo:`, `sample-rate:`, `bit-depth:`)?
- The gate's `read` line for each `.wav` shows a lead of 0.0 ms, and no file has 5 ms or more before its first sample above -60 dBFS (`leading-silence:`, `late-onset:`)?
- Each length is inside its role's limit: tick 80 ms, tap 120, send 250, receive 400, error 200, success 800 (`too-long:`)?
- Peak at -3 dBFS, no flat tops, the last 10 ms faded (`hot-peak:`, `clipped:`, `abrupt-end:`)?
- The tail was trimmed before the file was normalized (`quiet-tail:`)?
- `send` rises, `receive` falls and sits lower, `error` falls and is the lowest, `tick` is the highest and shortest?
- The whole family was generated in one run, and no single member was re-rolled?

## Placement

Rules: [sound-motion-sync](sound-motion-sync.md), [sound-from-motion](sound-from-motion.md).

- Every cue has a time or a frame (`no-time:`), and no lag is negative (`sound-leads:`)?
- Each time is the contact: about 85 % through a decelerating tween, the first crossing of rest for a spring, the frame a press bottoms out?
- `sound-sheet.mjs --report` was run and the picture stepped to each listed frame: every onset on its contact frame or after it, none before?
- No onset sits in a hold, and every onset names a move the eye tracks?
- No lag is over 45 ms (`echo-lag:`), and no sound is cued from `animationend` on a spring (`spring-end:`)?
- A whoosh peaks on the fastest frame of its move, and a riser or zip ends on the hit?

## Playback and access (product UI)

Rules: [sound-playback-web](sound-playback-web.md), [web-haptics-reconciliation](web-haptics-reconciliation.md).

- A fresh private window is silent and the settings switch reads Off (`on-by-default:`)?
- The switch is in settings, reachable by keyboard and persisted (`no-mute:`)?
- The first click after a reload with sound on makes a sound, not the second (`context-at-load:`)?
- Every play is a new buffer source from a buffer decoded once (`media-element:`)?
- With the machine muted, every event still shows its visual twin on screen (`no-twin:`)?
- Tabbing through a list with a screen reader makes no sound (`sound-on-input:`), and a hidden tab makes none?
- Sound and haptics share one switch?

## A film

Rules: [launch-video-sound](launch-video-sound.md), [launch-video-music](launch-video-music.md), [sound-licensing](sound-licensing.md), [earshot-reconciliation](earshot-reconciliation.md).

- Picture is locked, and the sheet says so (`picture-not-locked:`)?
- The register A to E and its loudness are on the first lines of the sheet (`no-register:`, `no-loudness:`, `lufs-habit:`)?
- The render measures within 1 LU of that target and at or under -1 dBTP (`true-peak:`), with the command and the number in `CUES.md`?
- Something leaves 0.1 to 0.9 s before the reveal and the gap ends on the reveal frame (`no-subtract:`)?
- The 2 s before the reveal were played on a phone speaker, and the gap still reads?
- Every file the final render decodes has a licence row read on the item's own page, with the date (`no-licence:`, `bad-licence:`, `licence-no-page:`)?
- Every audio clip lives inside the composition, each with its own id?
- Every sentence in the handover that says how the audio sounds carries a command and the number it returned?

## Lines that are never intentional

Not candidates for judgment: fix the cause and run the gate again. `--gate` ends `sound check passed` only when all are at 0. Clearing a line by deleting the row, the cue or the field it points at, by renaming a `.wav` so it has no role, or by passing `--film` on a product one-shot is a bug, and the fresh eye judges every line you call intentional again.

| Line | What it means |
|---|---|
| `no-material:` | A family or a product sound map names no material |
| `mixed-material:` | A sound carries its own material, or the family draws on more than one pack or source |
| `no-time:` | A cue has neither `t` in seconds nor `frame` with an `fps` |
| `forbidden-moment:` | A product sound triggered by typing, scroll, hover, focus, page load or a route change |
| `no-mute:` | A product sound map with no mute control, or one that is not persisted or not reachable by keyboard |
| `on-by-default:` | Sound that starts on: `defaultOn` is not `false`, or the code treats anything but a stored off as on |
| `no-twin:` | A product cue with no visual twin |
| `too-long:` | A sound past its role's limit, declared in a manifest or measured in a `.wav` |
| `hot-peak:` | A peak over -3 dBFS on a product one-shot, or over -1 dBFS on a film stem |
| `sound-leads:` | A negative lag |
| `no-licence:` | A file in the mix with no licence recorded, or a film sheet with no file list |
| `bad-licence:` | NC, ND, SA, "personal use", "royalty free", or any text that is not a licence |
| `picture-not-locked:` | A film cue sheet whose `locked` is not `true` |
| `no-register:` | A film cue sheet with no register A to E |
| `no-loudness:` | A film cue sheet with no `target.lufs` |
| `true-peak:` | `target.dbtp` missing or above -1 |
| `cue-past-end:` | A cue placed after the film's `duration` |
| `leading-silence:` | 5 ms or more before the first sample above -60 dBFS, or a file that never rises above it |
| `clipped:` | Two or more consecutive samples at full scale |
| `stereo:` | A product one-shot with more than one channel |
| `sample-rate:` | A product one-shot that is not 44.1 kHz |
| `abrupt-end:` | The last sample is above -60 dBFS |
| `media-element:` | `new Audio(...)` used for UI playback |
| `context-at-load:` | `new AudioContext()` at module scope |
| `sound-on-input:` | A play call inside a typing, scroll, hover, focus or load handler |

## Candidate lines

Reported for judgment. Each one is either fixed or written into `CUES.md` with the reason it stands. `--strict` fails on them.

| Line | What it means | It stands when |
|---|---|---|
| `press-sound:` | A sound on a plain press, tap, toggle or select | The product is tactile (a wallet, a game, a hardware companion) and the map declares `"tactile": true` |
| `echo-lag:` | A lag over 45 ms | The sound is not a sharp contact: a whoosh, a bed, a swell |
| `loudness-range:` | A declared LUFS outside -18 to -14, or above -12 for a notification | Never for a tick or tap; integrated LUFS is unstable under 400 ms, so match those by ear against a -16 LUFS reference tick |
| `family-size:` | More than six sounds | The product has more than six earned moments, each with its own row |
| `prompt-not-dry:` | Neither the material nor the prompt says dry, no tail or no reverb | The path is the offline synth, which has no room |
| `style-material:` | The material names a style | Never; rewrite it as a thing and what strikes it |
| `licence-no-page:` | A third-party licence with no page URL or no read date | Never for a film |
| `lufs-habit:` | A film target of exactly -14 LUFS | The film ships to a muted-autoplay feed and the sheet says so |
| `whoosh-on-bed:` | A whoosh in register B | Never in a strict register B; the bed carries every cut |
| `bed-in-dry:` | A bed in register A | Never; pick register B or drop the bed |
| `clicks-on-beat:` | Clicks, ticks or pops in register C | Never under a beat track, where the track carries the pops. A film that needs derived clicks is register B or E, so change the register line |
| `no-subtract:` | A bed with no dropout | The film punctuates by adding: a bloom or a swell on the reveal |
| `fast-type:` | A typing run over 10 ticks a second | Never; thin the run or lay one typing bed |
| `late-onset:` | 5 ms or more before the first sample above 5 % of peak | The sound has a slow attack by design and is cued by its peak |
| `bit-depth:` | A `.wav` that is not 16-bit | The file is a film stem; the 16-bit rule is written for product one-shots |
| `quiet-tail:` | More than 20 ms of tail after the sound has fallen 36 dB | Never before normalizing; trim first |
| `spring-end:` | A play call inside an `animationend` handler | The animation is a keyframe tween with a clean end, not a spring |

## What you see, what you do

| You see | You do |
|---|---|
| A tick on every button, a whoosh on every route (`forbidden-moment:`, `press-sound:`) | Delete the rows. Keep daily and rare moments only |
| The click feels late | Read the gate's `lead` and `onset` for the file. Trim to the first sample above -60 dBFS, then cue the contact, not the tween's start |
| The click feels early, or like it fires before the press | Move the cue to where the press bottoms out and set a lag of 0 to 30 ms (`sound-leads:`) |
| Sound works on the second click (`context-at-load:`) | Create and resume the context inside the first gesture |
| The first sound after a click is late on every play (`media-element:`) | Decode once, play a new buffer source per play |
| A first visit makes a sound (`on-by-default:`) | Test for a stored on; anything else is off |
| One sound seems to belong to another product (`mixed-material:`) | Regenerate the whole family from one material line, never the one member |
| A sound gets louder and harsher after normalizing (`quiet-tail:`, `clipped:`) | Trim the tail first, then peak to -3 dBFS |
| A tick that rings (`too-long:`) | Cut to the role's limit and fade the last 10 ms; add "dry, no tail" to the material |
| A click at the end of a file (`abrupt-end:`) | Fade the last 10 ms |
| The sound is gone on a laptop speaker | Move the body into 500 Hz to 4 kHz and high-pass at 150 to 200 Hz; nothing under 200 Hz survives there |
| A success sound with a room tail from the generator (`prompt-not-dry:`) | Material, action, envelope, contour; "dry, no tail"; request 0.5 s and cut |
| A film bed flat from 0 s, a whoosh on every cut (`no-subtract:`, `whoosh-on-bed:`) | Write the register first; put the drop on the reveal and take the sub away 0.1 to 0.9 s before it |
| A film master at -14 LUFS (`lufs-habit:`) | Write the register's own loudness; keep -1 dBTP |
| A licence copied from a list (`licence-no-page:`, `bad-licence:`) | Open the item's own page, copy the licence as shown, record the URL and the date; NC, ND or SA means another recording |
| The phone buzzes all the time | Haptics on committed results, snaps and thresholds only; delete the rest |
| A gate line you think is intentional | Look again. If it still stands, write it in `CUES.md` with the file and the number; never clear it by deleting what it points at |
| Ten gate runs, gate green, nothing changing | Stop. Fresh eye ([review](review.md)) |

## Settled values

The references, the gold examples and the gate state one value for each decision; to overrule one, write it in [pov](pov.md).

## Not checked by the gate

- Feel, timbre, and whether a sound suits the product.
- Whether the family reads as one object struck several ways. Play it back to back, in mono, on a laptop speaker.
- The 100th-use test.
- Sync against the rendered picture. The gate reads declared times; you step the frames.
- Integrated loudness (LUFS) and true peak (dBTP). A `.wav` is measured for sample peak only; use `ffmpeg` (`ebur128=peak=true`) or earshot.
- Frequency content: the high-pass, the 3 to 6 kHz band, the body in the mid-range.
- Compressed audio. Only `.wav` is parsed, so check the source `.wav`, not the `.mp3`.
- Whether the mute control, the visual twin and the licence page exist outside the manifest that declares them.
- Handlers the gate cannot follow: imported functions, framework hooks, a context created inside a function that runs at load.
- Haptics. They need a real Android phone and a real iPhone, in a hand.

## Hand over

`CUES.md` is written beside the sound files or the cue sheet. A template:

```md
# Cues: <product or film>
Surface: <product UI | film, register <A to E>, target <n> LUFS, -1 dBTP>
Material: <the one line>
Gold: <the example you started from> (what you kept, what you changed)
Map: <n> moments proposed, <n> silent, <n> with a sound, <n> with a haptic
Files: <name, role, length, peak, lead> per file, from the gate's read lines
Gate: <the last line of sound-check.mjs --gate, pasted>
Lines: <each gate line> -> <file and number> -> <fix, or why it stands>
Measured: <command> -> <number>, for loudness, true peak and each onset frame
Licences: <file> -> <page read> -> <licence as shown> -> <date>
Review: <the reviewer's list> -> <your response>
Assumptions:
Unresolved:
Not checked: <not heard on a laptop speaker, not heard on a phone, haptics not on a device, 100th-use test not run>
```

- Does `CUES.md` say what you did not hear?
