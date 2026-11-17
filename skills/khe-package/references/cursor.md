---
title: cursor
summary: Where the cursor image comes from, its path, where it rests, and holding still.
---

# Cursor

## The image

Use the real cursor of the machine that renders, at its largest size. A drawn arrow next to real UI looks fake. This skill ships no cursor images: they belong to the operating system.

- **Windows:** `render.mjs` reads `C:/Windows/Cursors/aero_arrow_xl.cur` and `aero_link_xl.cur` (falling back to the smaller sizes) and takes each hotspot from the file.
- **macOS:** export the arrow and the pointing hand once from `NSCursor` and pass them: `--cursor-arrow arrow.png,5,5 --cursor-hand hand.png,12,8` (the numbers are the hotspot, at the image's scale). A short Swift script does it: take `NSCursor.arrow.image` and `NSCursor.pointingHand.image`, ask each for its CGImage at 8 times, and write PNGs.
- **Anything else:** pass your own PNG with its hotspot the same way. With no cursor, the render runs without one and says so.

The arrow shows everywhere; the hand shows over anything clickable (a link, a button, a tab, a label, or an element whose computed cursor is `pointer`). `render.mjs` picks it from the element under the point on every frame.

## The path

- Start and end fully off-frame, so the first and last frames show only the work.
- Glide on a quadratic curve whose control point sits 6 to 16% of the distance off the straight line, with ease-in-out cubic. In a shot list: `"bow": 0.1`.
- Vary it a little across reel items: enter from the right edge or from below, leave toward the bottom right or bottom left, and move the rest point by up to 3%. Entries from the top or the left, or rests deep in the card, look random, not varied.

## Where it rests

On the component, clear of the part that animates. On a labelled control, low and to the right of the label's centre, so the hand does not cover the word. The shot list's default for a named target is 62% across and 68% down its box.

## Holding still

Stop dead while a hover or a click plays. A cursor that drifts during the animation pulls the eye off it. In a shot list, `hold` after `click` keeps the cursor where it is.
