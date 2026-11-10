---
title: gotchas
summary: Lived failures for this skill. Append a one-liner every time the agent gets a detail wrong.
tags: [gotchas, append-only]
---

# Gotchas

This file is **append-only**. Each time the agent (or you) gets a detail wrong in practice, add a one-line gotcha here. Do not edit an entry unless it is outright wrong. Negative examples are the highest-signal content in a skill over time: the instructions should change rarely and this file should grow steadily.

## Format

```text
- [YYYY-MM-DD] One-line description of the gotcha. -> the fix, and the reference that owns the rule
```

Keep each to one line. Taste calls go in [pov](pov.md), not here.

## Entries

- [2026-11-10] A 1280 x 720 page at device scale 2 came back from the DevTools screencast as 1280 x 720 frames, and an ffmpeg scale filter hid it. -> Launch the browser with `--force-device-scale-factor`, check the first frame's size, never upscale. See [surfaces](surfaces.md).
- [2026-11-10] The second take in one browser had a third of the frames and a jumping pointer, because each take opened a new DevTools session. -> One session for the run, start and stop the screencast per take. `record.mjs` does this.
- [2026-11-10] The encoded file ran 2.3 s longer than the take: ffmpeg's concat demuxer counted the last frame's duration twice. -> List the last frame again and cut the output to the take's length with `-t`. `record.mjs` does this.
- [2026-11-10] The first screencast frame of a take carried the previous take's timestamp, so the reset's seconds landed in the file. -> Hold every frame time inside the take's own start and end.
- [2026-11-10] The pointer clicked a text field at its left quarter and sat on the words being typed. -> Aim 85 % along a field. See [script](script.md), The pointer.
- [2026-11-10] A fresh browser profile per take made a script with no reset look repeatable. -> Record both takes in one profile; only the reset may restore the state. See [state](state.md).
