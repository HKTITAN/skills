---
title: teaching
summary: The index of the bad and good pairs in teaching/. Fourteen failures across the kinds, each shown as the same sticker twice with one thing wrong, grouped by drawing, kind, motion, set and pack.
tags: [sticker, teaching, pairs, diagnosis]
---

# Teaching pairs

`teaching/` holds bad and good pairs: the same sticker twice, with one thing wrong in `bad`. Each folder is named for the gate line its `bad` half raises, so the folder name is the word to search for when the gate prints that line.

Use a pair to diagnose a fault in your own sticker. Find the one that looks like your bug, open both halves side by side, and read why the good half works: the difference is one attribute, one group or one keyframe. Then make that one change in your file. The bad halves are never starting points; start from `examples/`. The pairs are drawn as plain blocks on purpose, so the one difference is the only thing to see. They are not the bar: the gold examples are.

The pairs are also the gate's tests. `node scripts/sticker-check.mjs --self-test` fails if any `bad` stops raising its line, raises another never-intentional line, or any `good` starts raising one.

## Drawing

| Failure | Look at | Correction |
| --- | --- | --- |
| No border (`teaching/missing-diecut/`) | The first child of the root: the art starts at once | A `data-layer="diecut"` group first: one closed white shape 12 units outside the art, with `stroke="none"` |
| A colour baked in (`teaching/hardcoded-color/`) | `fill="#2fcf8f"` on the badge's frame | `fill="var(--ok, #2fcf8f)"`. The role lets a brand map its own colour; the fallback keeps the file whole on its own |
| A grey side (`teaching/grey-fill/`) | `--white-side` with the fallback `#c8c8c8` | A pastel of the palette, `#c9d6f2`. Grey is the one colour that belongs to no palette |
| A soft shadow (`teaching/gradient-or-shadow/`) | The `<filter>` in `<defs>` and `filter=` on the art group | Remove both. Depth is a hard shape in a side shade, or nothing |
| The lean on the group (`teaching/skewed-outline/`) | `transform="matrix(...)"` on the base part | The same lean worked into the path's coordinates, so the 5-unit outline is 5 units on every edge |

## Kind

| Failure | Look at | Correction |
| --- | --- | --- |
| A word nobody can hear (`teaching/unspoken-text/`) | The root of the lettering sticker: no `data-text` | `data-text="HI"` on the root, and the same word in the `<title>` |
| A word that needs a font (`teaching/live-text/`) | The `<text>` element with `font-family="Impact"` | The letters as outlines, on one stroke weight |
| A face nothing can move (`teaching/no-face/`) | Eyes and mouth inside the `body` group | `data-part="eyes"` and `data-part="mouth"` as their own groups |
| One lump (`teaching/part-count/`) | One `data-part`, holding the base, the plate and the mark | Three parts, each with its own face and its own side |

## Motion

| Failure | Look at | Correction |
| --- | --- | --- |
| A ghost on the way in (`teaching/fade-pop/`) | `opacity: 0` to `opacity: 1` in the keyframes | Scale alone, from 0.2, fully opaque |
| Out of nowhere (`teaching/pop-from-zero/`) | `scale(0)` on the first keyframe | `scale(0.2)`: small, whole and already the sticker |
| Never at rest (`teaching/no-hold/`) | Keys at 0, 25, 50, 75 and 100%: something changes on every frame | One thump, over by frame 61, then 89 frames of nothing |

## Set and pack

| Failure | Look at | Correction |
| --- | --- | --- |
| Two hands in one set (`teaching/set-outline/`) | `stroke-width` on the two files of `bad/`: 5 and 4 | One weight on every file of the folder. Each weight is allowed alone; the set line only shows when the folder is checked together |
| A pack that cannot install (`teaching/manifest-gap/`) | `outputs` in `bad.json`: no `tray` | Every output listed, each with its path, its size and its limit |

## What a pair cannot show

A pair shows a fault in the markup. It does not show a fault that lives only in the render: a silhouette that reads as a blob, a sticker that sits low in its frame, a tilt that differs from its neighbours, an impact mark a frame late, a still that says nothing. Those are found by rendering the set and stepping the motion, with the questions in [verify](verify.md).
