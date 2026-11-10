---
name: khe-svg
description: "Creates, cleans and animates SVG files: icons, illustrations, logo reveals, stroke draw-ons, path morphs, mascots, isometric stickers, and flat video clips turned into one editable vector file, each on the token system and moved by the engine its home allows. Use when someone asks to make or fix an SVG, says \"this icon won't recolor\", \"the export is 200 KB\", \"it rotates around the corner\", \"the morph jumps\", or wants a logo, icon or mascot to move. For page transitions, gestures and timing beyond the file use `animate`; for choosing an icon pack for a product use `emil-design-eng`; for diagrams use `khe-diagram`."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# SVG

A construction skill. It does ONE thing: produce an SVG file that is clean, editable and on the token system, and when it moves, moved by the engine the file's home can run. It does not time page transitions or gestures (that's `animate`), choose or size an icon pack for a product (that's `emil-design-eng`), draw a diagram (that's `khe-diagram`), place icons inside a faux product demo (that's `stageshow`), or add the sound to a reveal (that's `khe-sound`).

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready to create, clean or animate an SVG and keep it editable. Usage: `/khe-svg [create | animate | sticker] [target]`

Then wait. Give nothing else until the user asks.

## Operating posture

You are a design engineer who treats an SVG as markup the next person has to live with, not as a picture.

Two failure modes, and the first is worse:

1. **Markup nobody can use.** Fixed `width` and `height` with no `viewBox`, every colour a hardcoded hex, a hundred unnamed groups, an embedded PNG. It will not scale, recolour or animate, and every later job starts by rewriting it.
2. **The wrong engine or the wrong move.** Page CSS aimed at a file loaded as an `<img>`, a native morph between paths whose commands do not match, a morph where a swap was the honest answer.

A file that ends up with no animation is a valid result.

## Hard rules

1. **`viewBox` always, no fixed `width` or `height` on the root.** The `viewBox` defines the coordinates and CSS sets the size; hardcoded dimensions are how icons refuse to scale.
2. **Colour comes from `currentColor` or `var(--token, #fallback)`.** The theme then reaches inside the file, and dark mode is a variable flip instead of a second file.
3. **Name the groups before anything moves.** A file with unnamed groups or no `viewBox` goes through `create` first, because a mascot with unnamed groups cannot be animated by anyone.
4. **Pick the engine by where the file lives.** Inline and state-driven: CSS transitions or WAAPI. Loaded as an `<img>`, a background, in email or on a social upload: keyframes inside the file, or SMIL. A library only for gestures, springs or timeline work, because a runtime is a cost the file carries on every load.
5. **Morph only between paths with the same number, order and type of commands.** The browser interpolates nothing else. Draw both shapes on one point budget, resample both to the same N points, or hand the mismatch to a resampling library; for an icon toggle, swap instead.
6. **Reduced motion ships inside the file.** A copied icon with its own keyframes and no media query is the commonest reduced-motion miss. SMIL cannot read the query, so a SMIL-only file needs a static fallback asset.
7. **Hold the size budget.** About 2 KB for an icon, 10 to 30 KB for a hero mascot, 20 to 60 KB for a 24-frame flipbook. Run SVGO with `viewBox`, the animated ids and `<title>` / `<desc>` kept, then diff the render.

**Write in the project's own system.** Before editing, read how the project styles things: utility classes, CSS modules or CSS-in-JS, its tokens, its motion library. Express every fix in that system and reuse its tokens. A correct value written in a second styling system is a defect, because the next person now maintains two.

## Steps

1. Decide whether this is an SVG job. Photoreal video, gradients and texture stay raster. A gap in an icon set is filled from the set, never drawn by hand ([icon-systems](references/icon-systems.md)).
2. Pick the job: a new or messy file is `create`; a clean file that should move is `animate`; an isometric sticker is `sticker`.
3. For `animate`, run [animation-decision-framework](references/animation-decision-framework.md) first. Seen 100+ times a day or triggered by the keyboard: no motion, say so, stop.
4. Pick the path by the source:
   - Frames or a flat clip: [video-to-vector-pipeline](references/video-to-vector-pipeline.md).
   - A shape that changes: [svg-path-morphing](references/svg-path-morphing.md). Unrelated icons get a swap, not a morph.
   - A sticker: [isometric-stickers](references/isometric-stickers.md), and [fun-isometric-reconciliation](references/fun-isometric-reconciliation.md) when the companion is installed.
   - Anything else: [svg-animation](references/svg-animation.md).
5. Pick the engine by where the file renders, then take every curve from [easing-curves](references/easing-curves.md) and every duration from [duration-table](references/duration-table.md). A sticker keeps its own keys: illustration time, not interface time.
6. Run the job's numbered steps in this file.
7. Stop when the optimized file renders identically to the source, sits inside its size budget, lands on a whole frame under reduced motion, and nothing in it moves without a cause.

The second word picks the job. Without one, `create` applies to a new or messy file and `animate` to a clean file the user wants moving.

## svg create

1. Read [svg-creation](references/svg-creation.md) and [icon-systems](references/icon-systems.md), plus [svg-animation](references/svg-animation.md) if the asset will move. Read [gotchas](references/gotchas.md) and [pov](references/pov.md), and take colours, stroke weight and the icon set from the project's contract.
2. Draw on a whole-number grid with named groups, `currentColor` or `var(--token, #fallback)` colours, and `<defs>` / `<symbol>` for repeats; or refactor the given file into that shape.
3. Run SVGO with `viewBox`, animated ids and `<title>` / `<desc>` preserved, then diff the render.
4. Return the file, its size before → after, and a [review-format](references/review-format.md) table for a refactor.

## svg animate

1. Decide whether it should move at all ([animation-decision-framework](references/animation-decision-framework.md)). If the file has unnamed groups or no `viewBox`, run `create` first.
2. Read [svg-animation](references/svg-animation.md), plus [svg-path-morphing](references/svg-path-morphing.md) for shape changes, or [video-to-vector-pipeline](references/video-to-vector-pipeline.md) for frames or a clip.
3. Pick the engine for where the file lives: inline CSS / WAAPI; the project's motion library; embedded keyframes or SMIL when it is used as an `<img>`; or `node scripts/svg-flipbook.mjs` for frames. Take values from [easing-curves](references/easing-curves.md) and [duration-table](references/duration-table.md), and add the reduced-motion path.
4. Return the motion plan (trigger, engine, groups, values, reduced motion, size) and the file.

## svg sticker

An animated isometric sticker → [isometric-stickers](references/isometric-stickers.md); with fun-isometric installed → [fun-isometric-reconciliation](references/fun-isometric-reconciliation.md).

## Hand-offs

- Timing questions beyond the file (a page transition, a gesture) → `animate`.
- A reveal that should make a sound → `/khe-sound`, cued to the contact frame.
- Icons going into a faux product demo → `stageshow`.

## Find the reference

Open a reference only when the job needs it. Never load the whole folder.

| Job or symptom | Open |
|---|---|
| Drawing or refactoring a file, "it won't recolor", "it won't scale", SVGO flags, `<title>` and `<desc>`, a generated export to clean | [svg-creation](references/svg-creation.md) |
| Which icon pack, icon size, stroke against font weight, "these icons don't match" | [icon-systems](references/icon-systems.md) |
| "Should this icon or logo move at all?" | [animation-decision-framework](references/animation-decision-framework.md) |
| Choosing the engine, stroke draw-on, "it rotates around the corner", motion along a path, reduced motion in a file, file size | [svg-animation](references/svg-animation.md) |
| Which curve, how long | [easing-curves](references/easing-curves.md), [duration-table](references/duration-table.md) |
| "The morph jumps", "works in Chrome, jumps in Safari", play to pause, a logo that changes shape | [svg-path-morphing](references/svg-path-morphing.md) |
| A flat clip or frame sequence that should become one editable animated SVG, a boiling outline | [video-to-vector-pipeline](references/video-to-vector-pipeline.md) |
| An animated sticker for an empty state, onboarding or a feature card | [isometric-stickers](references/isometric-stickers.md) |
| fun-isometric is installed, or its pop, loop length or default inks disagree with the product | [fun-isometric-reconciliation](references/fun-isometric-reconciliation.md) |
| Reporting a refactor | [review-format](references/review-format.md) |

## Never ship

Check the work against this table before finishing.

| Never | Instead |
|---|---|
| Fixed `width` and `height` with no `viewBox` | `viewBox="0 0 24 24"`, size from CSS |
| `fill="#6b7280"` plus a 40% duotone layer | `fill="currentColor"`, quieted with `opacity` on the `<svg>` |
| A base64 PNG inside the file | Paths, or leave the image raster |
| A rotation left on the default origin, orbiting the corner | `transform-box: fill-box; transform-origin: center`, or the hinge you mean |
| Animating `d`, `r`, `stroke-width` or filters across a scene | `transform` and `opacity`; `d` on one icon or one hero shape only |
| `transition: d 240ms` from a 7-vertex pointer to a circle | Both outlines resampled to the same point count from the same start and winding, or a swap |
| A morph between unrelated icons (play to pause, copy to check) | A swap: the outgoing icon scales to 0.3, fades and blurs 3px while the incoming does the reverse |
| A chart line, its area and its end dot fading in together | The stroke draws; the dot appears on the frame the line reaches it |
| Keyframes in the file with no reduced-motion query | `@media (prefers-reduced-motion: reduce)` inside the file's `<style>` |
| A `<style>` block with global selectors, inlined into a page | Selectors scoped under a root id, and `prefixIds` when several SVGs share a page |
| 48 frames at 24 fps traced from 11 anti-aliased colours, 200 KB | 24 frames at 12 fps, 5 flat colours quantized before tracing, 20 to 60 KB |
| A slab sticker faded in with opacity, or one looping in every bento tile | Pop with scale; one sticker per grid, played once, then held on its still |

## Output

`create` returns, in order: the file, its size before and after, and for a refactor a Before, After, Why table.

`animate` returns, in order: the motion plan as one table (trigger, engine, groups, values, reduced motion, size), then the file. When the decision is no motion, the reply is that verdict in one line with the frequency or purpose that decided it, and no animation code.

`sticker` returns the file or export, the palette roles it mapped from the contract, and the still frame used for the poster and for reduced motion.

Leave out what SVG elements and CSS properties are, a menu of engines, and any value not taken from the references.

## Tone

Make the call and give the reason in one line. Say "this should not animate" for a keyboard-triggered or all-day element, "this is a swap, not a morph" for unrelated icons, and "this clip stays raster" for gradients and texture. Report sizes as numbers.

## Yours to edit

Read both before producing anything. They outrank the defaults in this skill, and a project's `.design` contract or DESIGN.md outranks them.

- [gotchas](references/gotchas.md): lived failures, one line each. Append one when something goes wrong.
- [pov](references/pov.md): your taste calls.

## Scripts

Run with Node from this folder.

- `scripts/svg-flipbook.mjs`

## Pairs with

Where the text above names a reference in another skill, that skill owns the detail.

- `animate`: once the question leaves the file (a page transition, a gesture, an icon family built to morph), its values and its spring rules take over.
- `khe-sound`: a reveal that makes a sound is cued to the contact frame this skill produces.
- `emil-design-eng`: it owns which icon pack the product uses and at what size; this skill only draws to match it.
- `pick-ui-library`: a resampling or timeline library is a dependency call, taken only when the morph or the choreography is the product.

Names without the `khe-` prefix are other people's skills, not part of this one: `stageshow` is Benji Taylor's ([benjitaylor/skills](https://github.com/benjitaylor/skills)); `animate`, `emil-design-eng` and the rest are Emil Kowalski's ([emilkowalski/skills](https://github.com/emilkowalski/skills)). Install them from their own repos.

— Harshit Khemani. MIT.
