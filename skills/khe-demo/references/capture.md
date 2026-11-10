---
title: capture
summary: The size, scale, frame rate, codec and file-size ceiling of a take for each destination, with the reason for each number.
tags: [demo, capture, viewport, scale, fps, codec, gif]
---

# Capture

Decide these before recording and write them into the script. The gate checks the finished file against them.

## The destination decides

| Destination | Viewport (CSS px) | Scale | File | Length | Ceiling |
|---|---|---|---|---|---|
| `readme` | 1024 x 640 (or 960 x 600) | 2 | 2048 x 1280 mp4, plus an 800 px GIF | 4 to 20 s | 10 MB |
| `site` | 1280 x 720 (or 1280 x 800, 1024 x 640) | 2 | 2560 x 1440 mp4 and webm | 4 to 30 s | 4 MB |
| `social`, landscape | 960 x 540 | 2 | 1920 x 1080 mp4 | 4 to 45 s | 30 MB |
| `social`, vertical | 360 x 640, `"touch": true` | 3 | 1080 x 1920 mp4 | 4 to 45 s | 30 MB |
| `social`, square | 540 x 540 | 2 | 1080 x 1080 mp4 | 4 to 45 s | 30 MB |
| `film` (a shot for an edit) | 1280 x 720 | 2 or 3 | 2560 x 1440 or 3840 x 2160 mp4 | 4 to 30 s | none |
| A phone screen for any destination | 390 x 844 or 360 x 640, `"touch": true` | 3 | 1170 x 2532 or 1080 x 1920 | as above | as above |

Why these:

- **A small viewport, not a small file.** The viewport sets how large the UI is drawn; the scale sets how many pixels record it. A README column shows media about 830 px wide, so a 1024 px viewport shrinks to 81 % and 14 px text still lands above 11 px. A 1920 px window shrinks to 43 %, and the same text lands at 6 px.
- **Length.** The floor is 4 s: an opening frame, one gesture and a 1500 ms payoff hold add up to about that, so a shorter file is missing one of them. The README ceiling is 20 s because a loop is watched without controls; a page gives 30 s, a feed 45 s.
- **Ceilings.** 10 MB is the size GitHub accepts for an image or a free-plan video dropped into a README or an issue. 4 MB on a page is about 3 s of download at 10 Mbit/s before the demo plays. 30 MB leaves a feed's own re-encode plenty to work with.
- **Even sizes.** H.264 in yuv420p halves the colour planes, so both sides of the file must be even. 1281 px wide, or 1125 px from 375 at scale 3, is `odd-size:`. That is why the phone rows are 390 and 360 wide, never 375.

The gate reports a viewport outside this table as `viewport-fit:`. It stands when the product needs it; say why in `DEMO.md`.

## Reading size

The smallest text the viewer has to read must land at 9 px or more on their screen, and 11 px is comfortable.

```text
on-screen px = smallest_text x zoom x shown_width / viewport width
```

- `smallest_text` is the CSS size of the smallest text the story needs read. Measure it in the app; `record.mjs` prints the smallest text on any target.
- `shown_width` is the CSS width the file is displayed at: 830 for a README, the viewport's own width for a page that shows it 1:1, 600 for a landscape post in a desktop feed, and 390 for a vertical one on a phone. Set it in the script when yours differs.
- Under 9 px the body of a lowercase letter is four pixels tall and letters merge: `tiny-ui:`, never intentional. Between 9 and 11 px is `small-ui:`. 11 px is the smallest text size the large platforms use for captions.
- The fixes, in order: a smaller viewport, the app's own compact or zoomed layout, a push-in during the action ([post](post.md)), and only last a larger font in the app.

## Scale

- **Record at scale 2.** A 2x file shown at its CSS size has four file pixels for every screen pixel on a standard display and one for one on a high-density one, so text stays sharp there and a 2x push-in in post still shows one file pixel per screen pixel on a standard display.
- **Scale 3** for phone viewports (it is the density of the phones being shown) and for a film shot that will be cropped hard.
- **Scale 1** is reported as `scale-1:`. It leaves nothing to crop into and is soft on every high-density screen.
- **Check that the scale is real.** A browser's screencast delivers CSS-size frames unless the browser itself runs at the scale ([surfaces](surfaces.md), What the screencast gives). The gate compares the file with viewport times scale (`take-resolution:`), and `record.mjs` checks the first frame before it encodes. An upscaled file passes a size check, so compare a crop of the take with a screenshot at the same scale once per project.
- **Fractional scales** must give whole even sizes: 1280 x 720 at 1.5 is 1920 x 1080; 1024 x 640 at 1.5 is 1536 x 960.

## Frame rate

- **30 fps** for every flow. The product's own transitions run 150 to 300 ms, five to nine frames at 30, which reads as motion.
- **60 fps** only when the story is the motion: a drag, a scroll, a spring. It doubles the frames, and a GIF cannot use them.
- **Constant rate.** A screen capture or a screencast arrives at an uneven rate. Encode at the declared constant rate (`record.mjs` does; add `-vf fps=30` to an ffmpeg capture), because editors and some players drift on variable-rate files.
- The gate compares the file's rate with the script's (`take-fps:`).

## Codecs and files

| File | Encode | Use |
|---|---|---|
| The master | H.264, CRF 16, yuv420p | What `record.mjs` writes and every post step keeps. Visually lossless for UI; the file to keep |
| `.mp4` to deliver | H.264, CRF 20, yuv420p, `+faststart` | Plays everywhere. `+faststart` puts the index first, so it starts before it has loaded |
| `.webm` to deliver | VP9, CRF 32, constant quality | Smaller beside the mp4 on a page. Never the only file: Safari on older systems needs the mp4 |
| `.gif` | 800 px wide, 20 fps, a palette built for the clip | A README that must autoplay with no player |
| `.png` poster | One frame from inside the payoff hold | The `poster` of a `<video>`, the thumbnail, the reduced-motion fallback |

- **yuv420p, always.** Screen frames start as RGB, and ffmpeg will happily write yuv444p, which Safari, QuickTime and most hardware decoders refuse. An `.mp4` that is not H.264 in yuv420p is `take-codec:`.
- **UI compresses well.** Flat colour and still frames are cheap: a 10 s take at 2560 x 1440 is often under 1 MB at CRF 20. A file near the ceiling usually has a gradient, a video or a noisy background in it.
- **No audio track.** A demo take is silent; sound is added by another skill after the cut is locked.

## GIF

A GIF is the last choice: 256 colours, no seeking, and many times the mp4's size. Use it only where a video will not autoplay.

```bash
node scripts/post.mjs gif out/take.mp4 out/demo.gif --width 800 --fps 20
```

- **Frame rate: 10, 12.5, 20, 25 or 50.** A GIF stores each frame's delay in whole hundredths of a second. 20 fps is 5 hundredths exactly. 15 fps is 6.67, which a GIF cannot hold, so the encoder rounds and the loop runs at the wrong speed; 30 fps is 3.33. Either is `gif-fps:`.
- **800 px wide** fits a README column without the browser scaling it up, and is 39 % of a 2048 px master.
- **A palette per clip.** `post.mjs gif` builds the palette from this clip's own frames, weighted toward what changes, and dithers only the rectangle that changed in each frame. A generic palette bands every gradient.
- **Ceiling 10 MB; over 5 MB is reported** (`gif-size-edge:`). A README loads it on every visit. Narrow it to 640, cut a beat, or link the mp4 with a poster image.
- **A GIF loops.** Give it a seam: `loop.return` in the script ([script](script.md)).

## Before the take

- The viewport, scale and frame rate are in the script and the gate passes.
- The capture is of the page or the app's window, never the display.
- The first frame is complete: fonts loaded, images in, no skeleton. `ready` in the script waits for it.
- The machine is quiet: no other heavy process, laptop on power. A starved browser drops repaints, and the take stutters.
