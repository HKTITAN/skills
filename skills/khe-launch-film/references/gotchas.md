---
title: gotchas
summary: Lived failures for this skill. Append a one-liner every time the agent gets a detail wrong.
tags: [gotchas, append-only]
---

# Gotchas

This file is **append-only**. Each time the agent (or you) gets a detail wrong in practice, add a one-line gotcha here. Do not edit an entry unless it is outright wrong. Negative examples are the highest-signal content in a skill over time: the instructions should change rarely and this file should grow steadily.

## Format

```text
- [YYYY-MM-DD] One-line description of the gotcha. → the fix, and the reference that owns the rule
```

Keep each to one line. Taste calls go in [pov](pov.md), not here.

## Entries

- [2026-09-28] Agent chained 60 s of morphs because "launch films don't cut"; it read as a screensaver. → Cut on a cause, a constant ground or the element being read; Skale's client films cut ~4/min, acclaimed in-house or uncredited films ~16/min. See [launch-video-cuts](launch-video-cuts.md).
- [2026-09-28] Agent crossfaded two opaque scenes on the same ground; the midpoint dimmed like a flash. → Hard-cut on a continuous ground, or fade the content to a bare surface identical to the next first frame, then cut. See [launch-video-cuts](launch-video-cuts.md).
- [2026-09-28] Agent answered a pull-back exit (scale → 0.8) with a grow-from-small entry (0.75 → 1); the seam stuttered. → Z direction is the sign of scale: 1.2 answers 0.75, 0.8 answers 1.25. See [launch-video-seams](launch-video-seams.md).
- [2026-09-28] Agent put a zeta-1/3 spring on every arrival in a brand film; it read as a toy. → Exponential settle by default; visible overshoot is a register (4 of 29 Skale films, 3 of 18 acclaimed). See [launch-video-motion](launch-video-motion.md).
- [2026-09-28] Agent added a breathe loop (`yoyo`, `repeat: -1`) to a held card to keep it alive. → Nothing decorative moves on a UI object; creep the camera on its entry vector or add story. See [launch-video-motion](launch-video-motion.md).
- [2026-09-28] Agent resampled a 24 fps reference to 30 fps and quoted a studio reel as house style; pulldown faked 4-frame moves, and the reel is 33 % still against 12 % for the client films. → Native fps, cuts recounted by eye, compare within a register. See [launch-video-review](launch-video-review.md).
- [2026-09-28] Agent typed a prompt the viewer must read at 50 characters a second. → ~15 c/s to be read, ~53 only to be recognised. See [launch-video-ui-demo](launch-video-ui-demo.md).
- [2026-09-28] Agent followed HyperFrames' distributed crossfade default and jitter loops inside a motion-doctrine project. → Where HyperFrames' layers disagree, motion-doctrine wins. See [hyperframes-reconciliation](hyperframes-reconciliation.md).
- [2026-10-19] Chromium render traps, from cinetic's forensics: `will-change` on a layer whose `blur()` animates flashes stale copies on random frames; CSS gradients band at 8 bits; a negative SVG `r`, `rx` or `width` is rejected and the old value sticks; `overflow: hidden` flattens `preserve-3d`. → Drop `will-change` where blur animates, ship dithered PNG gradients, clamp geometry at ≥ 0, paint 3D in z order yourself. See [cinetic-reconciliation](cinetic-reconciliation.md).
- [2026-10-19] Headless Chromium renders `blur()` in ~0.5 px steps (under ~0.75 px it is fully sharp) and snaps a text layer's vertical position to whole pixels. → Text that "pops sharp" or stair-steps at the end of a rise is the renderer, not the ease: clear entrance blur by ~60 % of the move and finish vertical text moves with a fast settle. See [launch-video-motion](launch-video-motion.md).
- [2026-10-19] Agent exported a loop as a 30 fps GIF; it played 11 % fast, because GIF delays are whole hundredths of a second. → 25 or 50 fps for GIF. See [launch-video-formats](launch-video-formats.md).
- [2026-10-30] Agent trusted a generated track's 172 BPM label and built the beat grid on it; a 0.15 % tempo error put the last hits of a 50 s film about 70 ms late. → Measure the track, give the tracker the intended tempo, fit only the stretch the film uses. See [film-as-function-of-time](film-as-function-of-time.md).
- [2026-10-30] Agent encoded a 4K master at a slower x264 preset without `-level`; it came out Level 6.0, played in ffmpeg and failed in QuickTime and on phones. → `-level 5.2` at 4K (4.2 at 1080p), and decode the file on the hardware decoder before handover. See [film-as-function-of-time](film-as-function-of-time.md).
- [2026-10-30] Agent applied scenario-kinetic-film's ≤ 40 % still gate to a product-camera film. → Its gates belong to the beat-cut register and count stillness differently; judge a film inside its own row. See [scenario-kinetic-reconciliation](scenario-kinetic-reconciliation.md).
