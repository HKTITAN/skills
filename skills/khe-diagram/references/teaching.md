---
title: teaching
summary: The index of the bad and good pairs in teaching/. One row per folder, naming the failure, where to look and the correction.
tags: [diagram, teaching, pairs]
---

# Teaching pairs

`teaching/` holds 14 pairs. Each folder has the same figure twice, `bad.svg` with one thing wrong and `good.svg` with it right. Each folder is named for the gate line its bad half raises, and `node scripts/diagram-check.mjs --self-test` proves that on every run: the pairs are the gate's tests.

Use a pair to diagnose a fault in your own figure. Find the pair that looks like your bug, or the folder named for the line the gate printed, open both halves side by side, and read why the good half works. The bad halves are never starting points. Start from `examples/`.

Twelve pairs share one figure, an upload path with five nodes, so the only difference between any two files is the fault being taught.

## Whether to draw, and how much

| Failure | Look at | Correction |
|---|---|---|
| A figure a sentence carries: `teaching/sentence-figure` | Three boxes in a row, two arrows, nothing to compare | The sentence. `good.md` is the whole deliverable, with its verdict line |
| Too many nodes: `teaching/node-budget` | 14 services in three rows; the eye has no path through them | An overview of five zones at 5 nodes; the path inside one zone is a second figure at 8 nodes |

## Connectors

| Failure | Look at | Correction |
|---|---|---|
| A diagonal connector: `teaching/diagonal` | The line from the API to the object store, cutting across the figure | A vertical run, an elbow rounded at r=8, a horizontal run |
| A square turn: `teaching/sharp-elbow` | The corner at 336,168 | Stop the vertical run at 160, curve to 328,168, then run horizontally |
| Connectors over the boxes: `teaching/edge-over-node` | Where each stroke meets a node border, and the order of the groups in the file | Connectors first, labels second, nodes third; a line can only sit behind a box |
| One arrow for a request and its reply: `teaching/two-headed` | The arrow between the browser and the API | A solid request, and a dashed `5,4` reply 16px below it that starts at the API |
| A label on its line: `teaching/label-on-line` | "stream" on the vertical run | The label on an opaque paper mask beside the run, 8px clear of the stroke |

## Signal

| Failure | Look at | Correction |
|---|---|---|
| Too many hues: `teaching/accent-colors` | Blue, orange, green and violet borders | One accent; every other node is ink on paper |
| The accent everywhere: `teaching/accent-spread` | Five tinted nodes | The accent on the queue and the connector into it, 2 elements |
| No legend: `teaching/missing-legend` | Solid, dashed and accent lines with nothing to read them by | A strip under the figure naming every line style in use |

## Type, grid and accessibility

| Failure | Look at | Correction |
|---|---|---|
| Mono as a blanket font: `teaching/mono-label` | Every node name | Names in a sans at 600; mono on the port, the event name, the bucket URL, the request and the status code |
| Type under the ramp: `teaching/small-text` | The sublabels, at 6px | Names 12px, sublabels 9px, connector labels 8px |
| Off the 4px grid: `teaching/off-grid` | The Scanner node against its neighbors | x=512, y=144, 128 by 48: every origin and size divides by 4 |
| No accessible title: `teaching/no-title` | The first lines of the file | `role="img"`, `aria-labelledby`, a first-child `<title>` and a one-sentence `<desc>`, ids prefixed with the slug |

## Lines with no pair

Nine gate lines have no folder. The self-test proves each by breaking a gold example in one place or by a small probe figure: `bare-id:`, `connector-budget:`, `callout-budget:`, `line-through-node:`, `shared-attach:`, `stacked-strokes:`, `node-radius:`, `shadow:` and `floating-legend:`. Their corrections are in the "What you see, what you do" table in [verify](verify.md).

## Making a pair

Change one thing. Same nodes, same words, same layout on both sides; only the fault differs. Name the folder for the gate line, start `bad` with a one-line comment that names the failure, and run `--self-test`. A pair whose bad half raises a second never-intentional line teaches two things and needs another pass.

## What a pair cannot show

- Whether a figure should exist for your content. The sentence pair shows one case; the paragraph test in [diagram-decision](diagram-decision.md) decides the rest.
- Whether the accent is on the right element. The good halves all mark the same queue; your figure has its own focal element.
- A canvas. Bound arrows and frames show only when a card is dragged; see [tldraw-canvas](tldraw-canvas.md).
