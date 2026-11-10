---
title: teaching
summary: The index of bad and good pairs in teaching/, one fault each, with what to look at and the correction.
---

# Teaching pairs

`teaching/` holds fourteen pairs. Each folder is the same small artifact twice, `bad.*` and `good.*`, with one thing wrong in the bad half. The folder is named for the gate line the bad half raises, so the pairs are also the gate's tests: `node scripts/ui-check.mjs --self-test` fails when a bad half stops raising its line or a good half starts to.

**How to use a pair.** Find the one that looks like your fault, by the gate line or by the symptom. Open both halves side by side and find the one difference, then read why the good half works; the first line of each file says it. Copy the correction, never the file. A bad half is never a starting point, and neither half is a whole component: for that, start from the gold in `examples/`.

## Motion

Rules in [motion](motion.md) and [accessibility](accessibility.md), Reduced motion.

| Failure | Look at | Correction |
|---|---|---|
| Everything animates (`teaching/transition-all`) | A chip that changes padding, border and background when pressed, under `transition: all 160ms ease` | Name the properties: `background-color 160ms ease, transform 160ms cubic-bezier(0.16, 1, 0.3, 1)`. Padding and border change at once |
| A slow start (`teaching/ease-in`) | A dropdown opening on `ease-in`: its first frames barely move | An ease-out curve at the same 200ms, `cubic-bezier(0.23, 1, 0.32, 1)`. It reads as faster with no change in duration |
| Appears from nothing (`teaching/scale-from-zero`) | A popover whose closed state is `scale(0)` | Close at `scale(0.96)` with `opacity: 0`, origin at the trigger |
| Layout on every frame (`teaching/layout-animation`) | An accordion panel with a transition on `height` | A grid row from `0fr` to `1fr` with the content clipped. No height is written anywhere |
| Theatre (`teaching/long-duration`) | A menu at 600ms | 200ms, inside the 150 to 250ms band for a dropdown |
| Motion for everyone (`teaching/no-reduced-motion`) | A dialog that scales in, with no reduced branch in the file | The reduced path in the same change: `transform: none`, a 120ms fade on touch, nothing on a fine pointer |

## Pointer and phone

Rules in [mobile](mobile.md).

| Failure | Look at | Correction |
|---|---|---|
| Hover sticks (`teaching/ungated-hover`) | A card that lifts 1px on a bare `:hover` rule | The same rule inside `@media (hover: hover) and (pointer: fine)` |
| The page zooms (`teaching/small-input`) | A search input at 14px | 16px. It is the only correct fix |
| Zoom locked (`teaching/zoom-locked`) | A viewport tag with `maximum-scale=1, user-scalable=no` | The baseline tag: `width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content`, with the input at 16px |

## Focus, names and state

Rules in [accessibility](accessibility.md) and [typography](typography.md).

| Failure | Look at | Correction |
|---|---|---|
| Focus disappears (`teaching/outline-none`) | A field with `outline: none` on `:focus` and nothing in its place | A `:focus-visible` outline: 2px in the strongest neutral, `outline-offset: 2px` |
| A button with no name (`teaching/unnamed-icon-button`) | A toolbar button that holds only an `aria-hidden` icon | `aria-label="Search"`: the action, never the picture |
| Text reflows on select (`teaching/weight-shift`) | A tab whose selected state sets `font-weight: 600` | Hold the weight. Selection is a color and a 2px inset indicator line |

## Layers and review

Rules in [polish-and-ship](polish-and-ship.md) and [review](review.md).

| Failure | Look at | Correction |
|---|---|---|
| A layer by feel (`teaching/magic-z-index`) | A toast at `z-index: 9999` beside a scale that stops at 400 | `z-index: var(--z-toast)` |
| A review that trails off (`teaching/review-verdict`) | A review whose table is followed by a remark | `Verdict: Approve with changes (2 findings).` on its own line, then "Not checked" |

## What a pair cannot show

A pair holds one fault that a script can read. These need the running screen, and the gold examples are where to look:

- **A missing state.** `examples/list` has all four branches in one box.
- **Timing.** When an error may appear is a rule in five steps: `examples/field`.
- **The exit.** A pair shows one end state. Step `examples/popover` at 40 to 80ms to see the exit run shorter than the enter.
- **Feel.** Whether 160ms on the press is right is settled at 25% speed and at full speed, never by reading the file.

## Adding a pair

Change one thing. Same markup, same selectors, same values on both sides; only the fault differs. Start the bad half with a one-line comment that names the gate line and what the user feels. Name the folder for the gate line, then run `--self-test`: the bad half must raise that line and no other never-intentional line, and the good half must raise none.
