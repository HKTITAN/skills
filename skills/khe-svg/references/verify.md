---
title: verify
summary: The last pass for an SVG. The gate command and what its verdict means, yes or no questions answered from the rendered file, the lines that are never intentional, the candidate lines, a table from what you see to what you do, and the SVG.md handover template.
tags: [svg, verify, gate, checklist, handover]
---

# Verify

The last pass. Every answer comes from something you looked at: the gate's output, the file rendered at the size it ships, a motion stepped frame by frame. Never answer from the markup you remember writing. Fix the largest visible fault first, run the gate again, return to the top, and repeat until every answer is yes.

The rules behind the questions are in [svg-creation](svg-creation.md), [icon-systems](icon-systems.md), [svg-animation](svg-animation.md) and [svg-path-morphing](svg-path-morphing.md). A sticker is checked by `khe-sticker`, with its own gate.

## Gate

```sh
node scripts/svg-check.mjs <files or folders> --gate
node scripts/svg-check.mjs <files or folders> --gate --report svg-check.json
node scripts/svg-check.mjs --self-test
```

- Does `--gate` end with the line `svg check passed`? That line means every never-intentional line is at 0 in every file it read. It always prints `passing is necessary, not sufficient` first, and it means it.
- Did it read every file you are shipping? The summary line counts the files checked. A file it could not read is listed as `not checked:`. With nothing to read it says `inconclusive` and exits 2, which is never a pass.
- Is every candidate line answered: fixed, or kept with its reason written in `SVG.md`?
- Does a moving `.svg` say where it renders? The gate reads `data-home="img"` (an `<img>`, a background, email, a social upload) or `data-home="inline"` on the root, or `--home` on the command line. Without one it prints `home-undeclared:` and the engine was not checked. An `<svg>` inside `.html`, `.jsx` or `.tsx` is inline already.
- Does a SMIL file name its still? The gate looks for `data-still="<file>"` on the root, or a sibling `<name>-still.svg`, `.png` or `.webp`.

Exit codes: 0 for a pass, and for a plain report run without `--gate`; 1 when `--gate` fails; 2 when inconclusive. `--strict` makes candidates fail the gate too.

## The markup (first, because every later job starts here)

- Does the root carry a `viewBox` and no `width` or `height`? Resize the rendered file to 16px and to 400px: does it scale both ways with nothing clipped?
- Are the coordinates whole numbers on the grid (24 for an icon, 100 or 1000 for an illustration), with path precision at 1 or 2 decimals?
- Can you name every group aloud from its `id` or `data-layer`, and are the groups in back-to-front order?
- Is every repeat one definition in `<defs>` or a `<symbol>`, used with `<use>`?
- Is there no raster, no editor namespace, no `<metadata>`, no empty group left in the file?
- Did you diff the optimized render against the source render and see no difference? Did SVGO keep the `viewBox`, the ids and `data-*` the motion uses, and `<title>` and `<desc>`?
- Is the size inside its budget: about 2 KB for an icon, 10 to 30 KB for a hero mascot, 20 to 60 KB for a 24-frame flipbook?

## Colour and name

- Put the file on the project's light surface and its dark surface: does every part change with the theme, with no grey left behind?
- Is every colour `currentColor` or `var(--token, fallback)`, with the fallback equal to the token's value in the contract?
- Is an icon one opaque colour, quieted only by `opacity` on the `<svg>`?
- Does a graphic that carries meaning have `role="img"`, a `<title>` as its first child and `aria-labelledby` pointing at it? Does decoration have `aria-hidden="true"` and `focusable="false"`? Is it one or the other, never both and never neither?
- Inlined beside another SVG: are its ids prefixed, and does every selector in its `<style>` start at its root id?
- An icon: placed at its real size beside two neighbours from the same set, do stroke weight, optical size and baseline match? Stroke 1.5 beside a 400-weight font, 1.75 to 2 beside a 500-weight font. Below about 12px, is it the filled variant?

## Motion (only when the file moves)

- Can you say the cause of each motion in one phrase: feedback, a state change, where something came from, an explanation, or delight on a rare screen? Seen 100 or more times a day, or triggered from the keyboard: is it still?
- Is the engine one the home can run? Loaded as an image: keyframes inside the file, or SMIL, and nothing that waits for a pointer or a state. Inline and state-driven: CSS transitions or WAAPI.
- Step the motion at 40 to 80ms. Does anything rotate or scale about the canvas corner? Does a dependent mark (an end dot, an arrowhead, the area under a line) first show on the frame the stroke reaches it?
- A morph: do both `d` strings have the same commands in the same order, the same start point and the same winding? Interrupt it halfway and read the frames 80ms apart: does it restart from the outline on screen, with no point crossing another?
- Is this morph a morph? Two shapes that are the same shape turned get a rotation. Unrelated icons get a swap. Only a family drawn on one primitive budget morphs.
- Turn reduced motion on and reload: does the file land on a whole frame at once, and is it the frame where the graphic reads whole? A SMIL file: does the page serve the still?
- Does every curve come from [easing-curves](easing-curves.md) and every duration from [duration-table](duration-table.md), with no `ease-in` anywhere? Do paired parts share one duration and one curve?
- A loop: film one full loop and the start of the next. Does the last frame flow into the first, and does a held frame stay still instead of boiling?

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. Clearing a line by deleting, renaming or hiding the thing it points at is a bug: a `<title>` removed to quiet `loose-title:`, a `data-home` flipped to quiet `wrong-engine:`, a motion deleted to quiet `no-reduced-motion:` when the brief asked for the motion.

| Line | What it means |
| --- | --- |
| `missing-viewbox:` | The root `<svg>`, or a `<symbol>` in a sprite, has no `viewBox`. The coordinates have no frame and nothing scales |
| `fixed-size:` | A numeric `width` or `height` on the root. Size comes from CSS |
| `missing-xmlns:` | A standalone `.svg` without the SVG namespace. An `<img>` shows nothing |
| `hardcoded-color:` | A hex, `rgb()`, `hsl()` or named colour on `fill`, `stroke`, `stop-color` or `color`, in an attribute or in the file's `<style>`. Paint inside `<mask>` and `<clipPath>` is exempt |
| `var-no-fallback:` | `var(--token)` with no fallback, for a variable the file never defines. The file breaks wherever the page does not set it |
| `editor-leftover:` | `sodipodi:`, `inkscape:` or `sketch:` markup, `data-name`, `<metadata>`, or a generator comment |
| `empty-group:` | A `<g>` with nothing inside |
| `unnamed-group:` | A `<g>` with no `id`, `class` or `data-layer` |
| `duplicate-id:` | The same `id` twice in one file, including two inlined SVGs on one page |
| `no-accessible-name:` | The root has no `<title>`, no `aria-label`, no `aria-labelledby` and no `aria-hidden`. The choice was never made |
| `embedded-raster:` | A base64 PNG, JPEG, GIF or WebP, or an `<image>` that points at one |
| `leaky-style:` | A selector in the file's `<style>` that does not start at the root id. Inlined, it restyles the page |
| `no-reduced-motion:` | Keyframes, an animation or a transition with no `prefers-reduced-motion` block in the file |
| `smil-no-still:` | SMIL in a file with no static fallback beside it. SMIL cannot read the reduced-motion query |
| `wrong-engine:` | In a file whose home is `img`: a transition, a `:hover`, `:focus`, `:active` or `:checked` selector, an `@import`, or a `<script>` |
| `corner-origin:` | A CSS rotate, scale or skew with no `transform-origin` anywhere in the file, or a SMIL rotate or scale with no centre, on a `viewBox` that starts at 0 0 |
| `morph-mismatch:` | Two `d` strings of one morph whose command lists differ in count, order or type, case included |
| `spline-out-of-range:` | A SMIL `keySplines` control point below 0 or above 1. The browser rejects the animation |
| `ease-in:` | `ease-in` on a transition or an animation |

## Candidate lines

Reported for judgment. Each one is either fixed or written into `SVG.md` with the reason it stands. The reviewer judges each again.

| Line | What it means | When it stands |
| --- | --- | --- |
| `home-undeclared:` | A moving `.svg` with no `data-home` and no `--home`. The engine was not checked | Never at hand-over: declare the home |
| `over-budget:` | Larger, without comments, than 2 KB for an icon (a `viewBox` up to 32 by 32), 2 KB per symbol for a set, 60 KB for a flipbook, 30 KB for anything else | A hero illustration the brief sized on purpose |
| `long-decimal:` | Coordinates with more than 2 decimals | Never after SVGO |
| `mixed-stroke:` | More than one `stroke-width` in one file | A multi-part illustration. Never one icon or one set |
| `translucent-ink:` | `opacity`, `fill-opacity` or `stroke-opacity` between 0 and 1 on a part of an icon | Never on an icon. A parked line at 0 is not reported |
| `repaint-property:` | Motion on `r`, `stroke-width`, `filter`, `points`, `width`, `height` or `transition: all`, or `d` animating on more than one shape of a scene or in more than one SVG of a page | One small icon |
| `scale-from-zero:` | `scale(0)` on both axes in the motion | Never. A wipe on one axis (`scaleX(0)`) is not reported |
| `morph-not-normalised:` | A morph path with relative or shorthand commands (`l`, `s`, `H`, `A`) | Never when it must run in more than one browser |
| `morph-winding:` | Two closed morph paths wound in opposite directions | Never: the morph turns through itself |
| `duplicate-def:` | The same gradient defined more than once | Never |
| `loose-title:` | A `<title>` without `role="img"`, without `aria-labelledby` pointing at its id, or not the first child | A file used only as an `<img>` with its own `alt` |

## What you see, what you do

| You see | You do |
| --- | --- |
| The icon stays 24px, or clips when the box changes (`fixed-size:`, `missing-viewbox:`) | `viewBox="0 0 24 24"` on the root, no `width` or `height`, size from CSS |
| The icon stays grey in dark mode (`hardcoded-color:`) | `currentColor` for one ink; `var(--token, fallback)` for a multi-colour illustration |
| The graphic is black, or missing a part, on one page only (`var-no-fallback:`) | Write the fallback inside every `var()` |
| An arm, a hand or a spinner orbits the top-left corner (`corner-origin:`) | `transform-box: fill-box` and `transform-origin` at the hinge |
| The morph jumps, or runs in one browser and jumps in another (`morph-mismatch:`, `morph-not-normalised:`) | Draw both shapes on one command list in absolute commands; or resample both to the same N points from the same start; or swap |
| The morph folds through itself (`morph-winding:`) | Same start point and same direction round both shapes |
| An arrow warps on its way to another arrow | They are one shape turned: rotate the group, never interpolate the coordinates |
| A logo loaded as an image never animates (`wrong-engine:`) | Keyframes inside the file, or SMIL; nothing that waits for hover or a class |
| The animation plays for a user who asked for none (`no-reduced-motion:`, `smil-no-still:`) | A `prefers-reduced-motion` block inside the file that lands on a whole frame; for SMIL, a still asset the page serves |
| A SMIL bounce never runs (`spline-out-of-range:`) | Splines inside 0 to 1; the overshoot is an extra keyframe in `values` and `keyTimes` |
| Two inlined icons share a gradient, a marker or a title (`duplicate-id:`) | Prefix each file's ids (`prefixIds`) |
| A rule inside the SVG restyles the page (`leaky-style:`) | Give the root an id and start every selector with it |
| The line, its area and its end dot fade in together | The stroke draws; the dot's delay equals the stroke's duration |
| The icon looks heavier or lighter than its neighbours (`mixed-stroke:`) | One stroke weight per set, matched to the font weight; at another size, redraw it, never scale the stroke |
| Dark patches where an icon's strokes cross (`translucent-ink:`) | One opaque colour; a lighter icon takes a lighter opaque ink |
| An outline wobbles on a held frame | Copy the previous frame's paths for a hold; quantize and trace every frame at one size |
| The export is 200 KB (`over-budget:`, `long-decimal:`, `editor-leftover:`) | Quantize before tracing, 24 frames at 12 fps, SVGO at precision 1, speckle filter; then diff the render |
| A gate line you think is intentional | Look at the render again; if it still stands, write the line, the evidence and the reason in `SVG.md`. Never clear it by hiding the thing |
| Ten gate runs, gate green, the render unchanged | Stop. Hand it to a fresh eye by [review](review.md) |

## Not checked by the gate

The gate reads text. It never renders the file, so each of these is answered by looking:

- Whether the optimized file renders identically to its source.
- Whether the motion should exist, and whether its trigger is the right one.
- Feel: the curve against the duration, the stagger, the hold, whether a draw-on reads in order.
- Whether a dependent mark appears on the frame the stroke reaches it.
- Whether the frame shown under reduced motion is a whole frame, and the right one.
- The start point and the point-to-point travel of a morph, and any morph driven from script (a resampling library, a point array).
- Whether the target browsers run the engine the file uses. CSS `d` and SMIL are not available everywhere: test in the browsers the project supports.
- Whether an icon matches its set: optical size, stroke against font weight, one pack.
- Contrast, the wording of the accessible name, and whether a hidden graphic was decoration.
- `corner-origin:` is judged per file, never per element: one `transform-origin` anywhere quiets it. Step the motion to confirm every moving part has its own.
- Selectors and attributes built at run time in `.jsx` and `.tsx` (`{expression}` values, spread props).

## Settled values

The references, the gold examples and the gate state one value for each decision; to overrule one, write it in [pov](pov.md).

## Hand over

Write `SVG.md` beside the file. A template:

```md
# SVG: <file>
Job: <create | animate>, home: <img | inline>, engine: <none | CSS transition | keyframes in file | SMIL | library>
Gold: <example> (what you kept, what you changed)
Motion: <part> moves because <cause>, <duration>, <curve>; reduced motion lands on <frame>
Size: <before> KB to <after> KB, budget <n> KB
Looked at: <sizes rendered>, <light and dark>, <motion stepped at n ms>, <reduced motion>, <browsers>
Gate: <the last line of svg-check.mjs --gate, pasted>
Lines: <each candidate or disputed line> -> <the evidence> -> <fixed, or why it stands>
Review: <the reviewer's list> -> <your response>
Assumptions:
Unresolved:
Not checked:
```

- Is the gate's last line pasted, never retyped?
- Does `Not checked:` name every size, theme, browser and motion you did not look at?
