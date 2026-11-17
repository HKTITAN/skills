---
title: verify
summary: Probing the file, the frames to look at, the contact sheet, the gate lines, and the report.
---

# Verify

## Probe

```bash
ffprobe -v error -show_entries stream=width,height,r_frame_rate -show_entries format=duration out/name-7s.mp4
node scripts/package-check.mjs PACKAGE.md --video out/name-7s.mp4 --gate
```

The `--video` check compares the file's size, frame rate and length with the plan.

## Look at frames

Extract and look at three frames from the encoded file, not from the PNGs: an idle frame, a mid-animation frame, and the last frame. Then one contact sheet of the whole video:

```bash
ffmpeg -ss 1.2 -i out/name-7s.mp4 -frames:v 1 mid.png
ffmpeg -i out/name-7s.mp4 -vf "fps=30/7,scale=360:-1,tile=6x5" -frames:v 1 sheet.png
```

On each, check: the cursor is the hand over every clickable target and the arrow elsewhere; nothing is clipped; centres and edges line up; the first frame shows only the work; the last frame matches the first when it loops.

## Questions

1. Did the user pick an idea from stills before the render?
2. Is every frame from the paused clock, with no real-time capture?
3. Is the short side 2000 or more and the long side 4096 or less, at 60 fps?
4. Is the margin 40 (reel) or 40 to 60 (click-through), and the component at its real width?
5. Does the cursor come from the system, start and end off-frame, and hold still during motion?
6. Does the first action land 0.3 to 0.4 s in, with hard cuts between scenes?
7. Was the copy re-read from source before this render?
8. Does the first line pass the stranger test?

## Gate lines

| Line | Do |
|---|---|
| `no-format` | Name one of the five formats |
| `no-ideas` | Three ideas with a still each, before rendering |
| `no-stills` | Stills of the chosen look, and the user's approval |
| `real-time` | Render with `render.mjs` |
| `low-res` / `long-side` | Change the device scale |
| `wrong-fps` | 60 |
| `bad-margin` | 40 for a reel, 40 to 60 for a click-through |
| `bad-length` | Cut holds and repeats into the range |
| `drawn-cursor` | The system's cursor image |
| `about-me` | Rewrite the first line for a stranger |
| `video-mismatch` | Render again, or fix the plan to match what was rendered |
| `no-unverified` | End with what nobody checked |

The gate reads the plan and probes the file. It cannot see whether the first second reads, whether the cursor covers a word, or whether the post is any good.

## Report

Show the video inline where the client can, with its absolute path. Give resolution, fps, length and size, and which frames you looked at. Offer one next cut with its saving. Keep the previous render until the new one is approved.
