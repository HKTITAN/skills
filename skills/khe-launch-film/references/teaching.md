---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. The same plan or beat sheet twice, with one thing wrong in the bad half.
tags: [launch-video, teaching, pairs]
---

# Teaching pairs

`teaching/` holds fourteen pairs. Each folder is named for the gate line its `bad` half raises. The `bad` and `good` halves are the same plan or the same beat sheet with one thing changed, and the first line of each file says what.

Use a pair to diagnose your own plan: find the folder whose line the gate printed, or whose description sounds like your film, and read why the good half works. Diff the two halves; the diff is the whole lesson. The bad halves are never starting points. Start from the closest gold in `examples/`.

The pairs are also the gate's tests. `node scripts/film-check.mjs --self-test` fails if any `bad` file stops raising its folder's line, raises a second never-intentional line, or if any `good` file raises one.

## The register

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-register/` | The plan has no `register` key. It still says 4 cuts and 9 % still, with no row to check them against | Name the register on the first key; every later number is read from that one row ([launch-video-registers](launch-video-registers.md)) |
| `teaching/unknown-register/` | `"register": "ui-motion + product-camera"` | Pick one row. The average of two rows, 9 cuts a minute at 29 % still, is a film neither makes |
| `teaching/cut-rate/` | Nine cut rows in a 60 s UI-motion film | 4 cuts a minute is this row's median; 9 belongs to no row. Change the cut count, never the register name |
| `teaching/still-share/` | A product-camera plan with `still_share: 0.09` | 0.09 is the UI-motion median. Product camera runs 0.343 to 0.588, median 0.486 |

## Beats and the name

| Failure | Look at | Correction |
|---|---|---|
| `teaching/beat-gap/` | The problem act ends at 17.4 s; the reveal starts at 18.0 s | Each beat starts on the frame the last one ends. 0.6 s nobody planned becomes a dead frame in the render |
| `teaching/beat-overlap/` | The demo starts at 19.0 s while the reveal runs to 20.0 s | Two beats cannot own the same second. Move one boundary |
| `teaching/beat-sum/` | The endcard beat ends at 58 s in a 60 s film | The last beat ends on the runtime, or the runtime is wrong |
| `teaching/name-window/` | The name at 42 s, 70 % of the film, with `known_brand: false` | The late mode is open only to a brand the audience knows. Name it by 11 %, or where the problem act ends, median 29 % ([launch-video-structure](launch-video-structure.md)) |
| `teaching/endcard-hold/` | A 5.0 s endcard whose final frame holds 0.5 s | Hold the final frame about 2 s; the gate's floor for this row is 1.1 s |

## Seams, type and sound

| Failure | Look at | Correction |
|---|---|---|
| `teaching/seam-untyped/` | The ledger row at 9.5 s has no `type` | Type every row `cut`, `match-cut` or `morph` before the timeline: a cut needs a vector on both sides, a morph needs a carrier ([launch-video-seams](launch-video-seams.md)) |
| `teaching/type-too-fast/` | A 33-character prompt with `job: read` typed in 0.62 s, 53 characters a second | 53 a second is the speed for a prompt the viewer only recognises. One that carries the argument types at 15 a second: 2.2 s ([launch-video-ui-demo](launch-video-ui-demo.md)) |
| `teaching/sound-before-lock/` | Two cues on frames while `picture_locked` is `false` | The plan names the sound register and its loudness. Cues wait for picture lock, because the next trim moves every one of them ([launch-video-sound](launch-video-sound.md)) |

## Beat sheets

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unsourced-beat/` | The name row at 17.4 s with an empty "taken from" cell | Every time names the row it came from. A number without its row is left out |
| `teaching/missing-beat/` | A sheet with the hook, the payoff and the endcard, and no row for the name | A beat sheet answers five questions: first word, first seam, the name, the payoff, the endcard and its hold |

## What a pair cannot show

A plan pair shows a decision. It cannot show a frame. These faults need the render and a contact sheet, never a pair:

- **A dead cut that the plan marked as moving.** The plan says `exit_moving: true`; only the frame before the cut says whether it was.
- **A dissolve over a ground neither scene has.** The midpoint frame shows it or does not.
- **A register that is right on paper and wrong on screen.** The fresh eye's first question in [review](review.md) exists for this.
- **Type that is built per word and still reads as a slide,** because the step ignores the track.

The gate proves `vector-mismatch:`, `dead-cut:`, `crossfade-dip:`, `block-fade:`, `true-peak:`, `cropped-vertical:`, `plan-mismatch:`, `plan-incomplete:` and the render lines on plans and probe results built inside its own self-test, because each is one field wrong and needs no folder.

## Making a pair

Change one thing. Copy a gold plan, break one decision, and name the folder for the line the gate prints. Run `--self-test`: the new `bad` file raises that line and no other never-intentional line, and its `good` file raises none. A pair that needs two changes to fail is two pairs.
