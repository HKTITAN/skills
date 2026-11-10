---
title: teaching
summary: The bad/good pairs in teaching/, one folder per failure. Each pair is the same artifact twice with one thing wrong; the table says where to look and what the correction is.
tags: [sound, teaching, pairs, diagnosis]
---

# Teaching pairs

`teaching/` holds 14 pairs. Each folder is named for the gate line its `bad` file raises, and holds the same artifact twice with one thing wrong in `bad`. The first line of every `bad` file names the failure: a `//` comment in code, a `"//"` key in JSON, an `ICMT` comment chunk in a `.wav` (the gate reads past it; `ffprobe` prints it).

Use a pair to diagnose a fault in your own work: find the one that matches your gate line or your symptom, diff `bad` against `good`, and read why the good half works. The bad halves are never starting points; start from `examples/`. The pairs are also the gate's tests: `node scripts/sound-check.mjs --self-test` proves that every `bad` raises its folder's line and every `good` raises none.

The `.wav` pairs are named `bad.tick.wav` and `good.tick.wav` because the gate reads a file's role from its name, and a length is only too long for a role.

## Whether the sound should exist

| Failure | Look at | Correction |
|---|---|---|
| `teaching/forbidden-moment/` | The first cue's `trigger`: `keydown:Enter` against `sync:resolved` | A sound belongs to the result, never to the key that asked for it. A key is heard on every attempt; a result is heard a few times a day ([sound-decision-framework](sound-decision-framework.md)) |
| `teaching/no-twin/` | The `twin` field of `sync-done` | Every sound names what the eye sees at the same moment. Without it the sound is the only signal, and muted users get nothing ([sound-playback-web](sound-playback-web.md)) |
| `teaching/no-mute/` | The top of the map, above `cues` | The mute control is declared before any cue: where it is, how it persists, that the keyboard reaches it ([sound-playback-web](sound-playback-web.md)) |

## Playback

| Failure | Look at | Correction |
|---|---|---|
| `teaching/on-by-default/` | The line that sets `soundOn` | Test for a stored `"on"`. Testing for anything but `"off"` turns sound on for every first visit ([sound-playback-web](sound-playback-web.md)) |
| `teaching/context-at-load/` | Where `new AudioContext()` sits | Inside `unlock`, which runs on the first gesture and resumes it. At module scope the context starts suspended and the first click is silent ([sound-playback-web](sound-playback-web.md)) |
| `teaching/media-element/` | The body of `play` | A new buffer source from a decoded buffer starts with no latency. A media element adds tens of milliseconds, which lands the transient late ([sound-playback-web](sound-playback-web.md)) |

## The family and its files

| Failure | Look at | Correction |
|---|---|---|
| `teaching/mixed-material/` | The `error` sound's own `material` | One material line for the family. A member that needs a different one means the whole family is regenerated ([sound-palette](sound-palette.md)) |
| `teaching/leading-silence/` | The gate's `lead` for each file: 12.0 ms against 0.0 ms | Trim to the first sample above -60 dBFS, so the cue and the transient are the same instant ([sound-spec](sound-spec.md)) |
| `teaching/clipped/` | The gate's `peak` and the flat tops in the first cycles | Peak at -3 dBFS. Trim the tail before normalizing, or the meter raises the hit until it clips ([sound-spec](sound-spec.md)) |
| `teaching/too-long/` | The gate's length: 300 ms against 70 ms | A tick stops by 80 ms. Cut to the role's limit and fade the last 10 ms ([sound-spec](sound-spec.md)) |

## A film

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-time/` | The `s3-wordmark` cue: `at` in words against `t` in seconds | A cue is a time or a frame, so it can be stepped to and checked ([sound-from-motion](sound-from-motion.md)) |
| `teaching/sound-leads/` | The `lag` of `s2-chip`: -0.03 against 0.01 | Audio never leads. A lead is detectable at 45 ms, a lag only at 125 ms; aim for 0 to 30 ms late ([sound-motion-sync](sound-motion-sync.md)) |
| `teaching/true-peak/` | `target.dbtp`: -0.2 against -1 | -1 dBTP is the one fixed number in every register. Loudness is the register's choice; the ceiling is not ([launch-video-sound](launch-video-sound.md)) |
| `teaching/bad-licence/` | The second row of `files`: CC BY-NC against CC BY | A launch film is commercial and edited. CC0 and CC BY pass; NC, ND and SA mean another recording ([sound-licensing](sound-licensing.md)) |

## What the pairs cannot show

No pair teaches feel. Two files can both pass every line and one of them can still be the wrong sound for the product. That call is made by playing the family back to back on a laptop speaker, by the 100th-use test, and by the fresh eye in [review](review.md).
