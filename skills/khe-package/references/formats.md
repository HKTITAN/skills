---
title: formats
summary: Which format to pick for what is being shown, and what each one produces.
---

# Formats

Pick by what the viewer has to see. One format per video.

| What it shows | Format | Source | Length |
|---|---|---|---|
| Several demos, a comparison of two versions, an easing curve, a before and after | `explainer` | A standalone `index.html` with `window.render(t)` | 20 to 26 s |
| One live component switched between a few states: tabs, a toggle, a before and after | `click-through` | A temporary stage route in the app and a shot list | 6 to 9 s |
| Many live items with the same interaction, hovered one after another: cards, icons, thumbnails | `hover-reel` | A temporary reel route, one item visible at a time | about 2.6 s per item |
| "Put it on a page so I can record it" | `recording-page` | A page in the app the user records themselves; nothing is rendered | the user's |
| Faux product UI: no live app to point at, a design not built yet, or a product shot reads better than the real page | `stageshow` | A Stageshow scene (Benji Taylor's skill) rendered through its `?capture=` route | 6 to 12 s, its own loop |
| A phone screen recording that needs a visible finger | `touch-cursor` | The user's own `.mov`, with taps worked out frame by frame | the source's |

Decide in this order:

1. Is it the user's own recording? `touch-cursor`, or `recording-page` when they want to record.
2. Is it a comparison or several separate demos? `explainer`.
3. One component, clicked? `click-through`.
4. Many items, hovered? `hover-reel`.
5. Nothing runnable to point at, or a cleaner picture than the real page? `stageshow`.
6. A whole product flow with several screens? Not this skill: `khe-demo`.

## Explainer

Composed, not captured: every component is copied from source into one page and scaled so the demo fills 60 to 80% of the frame (2 to 3 times its real size, up to 8 times for a tiny one). Scenes switch with a hard cut. The first scene is the hook and reads in under a second with no explanation.

## Click-through

The component alone in a stage at a fixed height equal to its tallest state, so the frame never has to grow. The cursor glides between the controls, clicks, and holds still while the result plays.

## Hover reel

One item visible at a time, every item the same size, in the order the user gives. Each item is its own cut: rest, glide in, hold, glide out, rest. The entry side and rest point vary slightly per item so the reel does not look mechanical.

## Stageshow

Build the scene with `stageshow` (Benji Taylor): its gold, its framing and its own rehearsal gate decide how the scene looks and moves, and it draws its own cursor. This skill then renders it: point a shot list at the playground's `?capture=<scene>` URL, crop to `#example` with no margin (Stageshow framed it), give it one `hold` the length of the loop, and leave out `enter`, `glide` and `click` so no system cursor is drawn over its own. The stills-first, resolution, 60 fps and first-line rules hold as for any rendered format. `examples/plans/stageshow-scene.md` is the gold.

## Recording page

One item at a time, centred on a plain page with the site header hidden. Space or the right arrow goes to the next item and back with shift or the left arrow, wrapping at both ends. Each demo remounts on arrival so it starts fresh. Every item lands on the same pixels, so nothing shifts between cuts. Hide the framework's dev badge, or record a production build.

## Touch cursor

A phone recording shows no finger. Work out each gesture from what changes on screen: a tap lands on the frame its pressed state appears, a scroll is a press that moves with the content and lets go while it keeps gliding. Draw a translucent grey disc of about 16 pt radius on those frames and keep the source's resolution, frame rate and audio. `render.mjs` does not do this yet; overlay the disc with ffmpeg from a list of positions per frame, and say in the reply that it was done by hand.
