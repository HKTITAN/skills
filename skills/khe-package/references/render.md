---
title: render
summary: Setting up a video project and running render.mjs for explainers and live stages, with the shot-list format and how the paused clock works.
---

# Render

## Set up

Make a project folder next to the user's other projects (for example `metrics-video/`), never only in a temp folder: it gets cleared, and the user may want to edit the source. Copy `scripts/render.mjs` into it, run `npm i -D playwright-core`, and make sure Google Chrome (or `CHROME_PATH`) and ffmpeg are installed. `out/` lands in the folder you run from.

```bash
node scripts/render.mjs explainer index.html stills 0.4,4.6,11
node scripts/render.mjs explainer index.html video out/ease-out-22s.mp4
node scripts/render.mjs live shot.json stills 0.4,1.2,1.7
node scripts/render.mjs live shot.json video out/metrics-7s.mp4
```

Options: `--out <dir>` for stills, `--w`, `--h`, `--dsf` and `--scheme dark` for explainers, `--playwright <dir>` when `playwright-core` lives in another project, `--cursor-arrow` and `--cursor-hand` for your own cursor images, `--keep-frames` to keep the PNGs.

## Explainers

The page sets every style from `t` alone, in `window.render(t)`, and exports `window.DURATION` in seconds.

- No CSS transitions or animations, no timers, no `Date.now()`. Nothing may move on its own clock.
- Easing goes through a cubic-bezier solver in JS (the gold has one).
- Scenes switch with `display`.

`examples/explainer/index.html` is the gold: one comparison scene with the open-close-slowdown cycles and a press before each open.

## Live stages

1. Make a temporary route that renders only the component inside `#stage`, at a fixed height equal to its tallest state, on the site's own background. `examples/live/stage.html` is the shape.
2. Write the shot list. `examples/live/shot.json` is the gold.
3. Render stills, agree them, render the video, then delete the route.

The shot list:

| Key | Does |
|---|---|
| `url`, `stage`, `margin`, `scheme`, `fps`, `cursorSize`, `dsf` | Where, what to crop to, how much page around it, the theme, 60, the cursor's CSS size, an optional fixed scale |
| `{ "enter": "bottom-right" }` | Places the cursor off-frame: `bottom-right`, `bottom-left`, `below`, `right` |
| `{ "wait": 0.35 }` or `{ "hold": 0.6 }` | Renders that many seconds with the cursor still |
| `{ "glide": "Signups", "seconds": 0.55, "bow": 0.1, "at": [0.62, 0.68] }` | Glides to a control by its visible name (or `css=<selector>`), resting at that point of its box |
| `{ "click": true }` | Presses and releases where the cursor is |
| `{ "exit": "bottom-right", "seconds": 0.6 }` | Glides off-frame |

## Stageshow scenes

Start the playground (`npm run dev` in the stageshow folder, or vite on a fixed port), then render its `?capture=` route like a live stage:

```json
{ "url": "http://localhost:4719/?capture=hero-demo", "stage": "#example", "margin": 0, "fps": 60, "shots": [{ "hold": 8 }] }
```

The `?capture=` route keeps the browser's native timers, rAF and CSS clocks, which is what the paused clock below takes over. Use the scene's own loop length for the hold, so the video ends where it began.

## The paused clock

`render.mjs` never records in real time. For a live stage it installs Playwright's fake clock, pauses it, and for every frame advances it by one frame's length, which drives timers, `requestAnimationFrame` and `performance.now`. CSS transitions, CSS animations and WAAPI animations run on the browser's own clock, so on every frame it also pauses each one and seeks it to the fake clock. A spring library on rAF and a CSS transition triggered by the same click then move together. Frames are captured through the DevTools protocol and encoded with ffmpeg.

Check a mid-animation still before every video: when something still moves on its own clock, that still shows it frozen or jumping.

## Long reels

Render each item as its own pass with the same settings, in parallel when it is slow, and encode the passes in order with hard cuts. After any change to the source, the order, the timing or the resolution, render into a new, empty folder: old frames would end up in the video.
