---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder.
---

# Teaching pairs

`teaching/` holds eleven pairs. Each folder is named for the gate line its `bad.md` raises, and holds the metrics click-through plan twice with one thing wrong in `bad.md`, named in a comment at the top. `node scripts/package-check.mjs --self-test` checks that each bad half raises only its line and each good half raises none.

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-ideas` | One idea under `Ideas:` | Three ways to show it, each with a still |
| `teaching/no-stills` | No `Stills:` and no `Approved:` | Agree the look on stills before the render |
| `teaching/real-time` | `Capture:` a screen recording with `recordVideo` | `render.mjs` on a paused clock |
| `teaching/low-res` | 1080 by 776 | Device scale up until the short side is 2000 or more |
| `teaching/long-side` | 4860 on the long side | Device scale down until the long side is 4096 or less |
| `teaching/wrong-fps` | 30 fps | 60 |
| `teaching/bad-margin` | 0 px around the card | 60 px for a click-through |
| `teaching/bad-length` | 14 s for a click-through | 7 s: three switches, short holds |
| `teaching/drawn-cursor` | A drawn SVG arrow | The system cursor |
| `teaching/about-me` | "Excited to share the new metrics card I built" | What a stranger gets: the trick, in one line |
| `teaching/no-unverified` | "Everything checked, ready to post." | `Not verified:` and what nobody checked |
