---
title: teaching
summary: The index of the bad and good pairs in teaching/. Fourteen failures, each shown as the same file twice with one thing wrong, grouped by markup, colour and name, and motion.
tags: [svg, teaching, pairs, diagnosis]
---

# Teaching pairs

`teaching/` holds bad and good pairs: the same file twice, with one thing wrong in `bad`. Each folder is named for the gate line its `bad` half raises, so the folder name is the word to search for when the gate prints that line.

Use a pair to diagnose a fault in your own file. Find the one that looks like your bug, open both halves side by side, and read why the good half works: the difference is one attribute, one rule or one path. Then make that one change in your file. The bad halves are never starting points; start from `examples/`.

The pairs are also the gate's tests. `node scripts/svg-check.mjs --self-test` fails if any `bad` stops raising its line or any `good` starts raising one.

## Markup

| Failure | Look at | Correction |
| --- | --- | --- |
| No frame for the coordinates (`teaching/missing-viewbox/`) | The root tag of the download icon | `viewBox="0 0 24 24"` on the root. Without it the drawing has no coordinate system and clips instead of scaling |
| Size pinned in the file (`teaching/fixed-size/`) | `width="24" height="24"` beside the `viewBox` | Delete both. The `viewBox` scales to whatever size CSS gives the element |
| The editor's own data shipped (`teaching/editor-leftover/`) | The two extra namespaces, the `<metadata>` block, `data-name` on the path | Strip everything the browser does not draw. SVGO does it; check `viewBox`, the ids and the `<title>` survived |
| One id used twice on a page (`teaching/duplicate-id/`) | `aria-labelledby="title"` on both inlined icons | Prefix every id with its file's name. The second icon was being named by the first one's title |
| A picture inside the vector (`teaching/embedded-raster/`) | The `<image>` holding a base64 PNG | Redraw it as paths, or ship the PNG as a PNG. A raster in an SVG wrapper cannot recolour or animate |
| Groups nobody can address (`teaching/unnamed-group/`) | The three bare `<g>` tags of the mascot | `id` and `data-layer` on each, in back-to-front order. A rule can then reach the arm by name |

## Colour and name

| Failure | Look at | Correction |
| --- | --- | --- |
| A colour baked in (`teaching/hardcoded-color/`) | `stroke="#6b7280"` on the root | `stroke="currentColor"`. The icon takes the text colour around it; quiet it with `opacity` on the `<svg>` |
| Neither named nor hidden (`teaching/no-accessible-name/`) | The root of the check that means "Saved" | Make the choice. Meaning: `role="img"`, a `<title>` first, `aria-labelledby`. Decoration: `aria-hidden="true"` |
| A rule that leaks (`teaching/leaky-style/`) | The `.line` selector inside the file's `<style>` | `#spark .line`. A selector that starts at the root id stops at the file's edge when the file is inlined |

## Motion

| Failure | Look at | Correction |
| --- | --- | --- |
| Motion with no reduced state (`teaching/no-reduced-motion/`) | The end of the `<style>` block | A `prefers-reduced-motion` block inside the file that turns the animation off and sets the finished values, so it lands on the whole mark |
| An engine the home cannot run (`teaching/wrong-engine/`) | `data-home="img"` on the root, then the `transition` and the `:hover` rules | Keyframes inside the file. An image has no pointer and no state change, so a transition never starts |
| A part orbiting the corner (`teaching/corner-origin/`) | The `.arm` rule: a rotation and no origin | `transform-box: fill-box; transform-origin: 0% 100%`. The origin moves from the canvas corner to the shoulder |
| A morph that jumps (`teaching/morph-mismatch/`) | The square's `d`: `M` and three `L` against the circle's `M` and four `C` | Draw the square on the circle's command list, as four straight cubics. Every point then has a partner |
| A SMIL bounce that never runs (`teaching/spline-out-of-range/`) | `keySplines="0.34 1.56 0.64 1"` | Keep every control point inside 0 to 1 and add the overshoot as an extra keyframe in `values` and `keyTimes` |

## What a pair cannot show

A pair shows a fault in the markup. It does not show a fault that lives only in the render: a dot that arrives a frame early, an icon that looks heavier than its neighbours, a morph that passes through an awkward shape. Those are found by rendering the file and stepping it, with the questions in [verify](verify.md).
