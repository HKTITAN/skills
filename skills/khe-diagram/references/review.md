---
title: review
summary: The brief for a fresh-eye reviewer of a figure or a canvas. What to hand over, what to keep back, the first question, how to rank findings, the rules of the review and what "nothing" looks like.
tags: [diagram, review, fresh-eye]
---

# Review

A fresh-eye review comes after the gate ends `diagram check passed` and after the builder has walked [verify](verify.md). The reviewer has not seen the figure being made, so the reviewer reads it the way its reader will.

## What to hand the reviewer

- The figure file, and a render of it at the width it ships at.
- A render at 400% of every place two connectors meet a node.
- The gate's full output, or its `--report` JSON.
- This file and [verify](verify.md).
- The `examples/` folder, with the closest gold named.
- A one-line brief: what the figure is for and where it sits. For example: "Architecture figure for the checkout README, 720px column, white page."
- For a canvas: a copy of the board, and the comment threads.
- For a "no diagram" answer: the request in the asker's words, and the sentence or table that replaced the figure.

## What never to hand the reviewer

- The builder's plan, node list or deletion notes.
- The builder's reasons for any choice.
- `FIGURE.md`.
- The source the figure was redrawn from. The reviewer judges the figure, not its fidelity to a layout that was thrown away.

A reviewer who knows why a line is there stops seeing that it is not needed.

## The reviewer's brief

You are reviewing a figure someone else drew. You have the file, its renders, the gate output, `verify.md` and the gold examples. You do not have the builder's intent beyond the one-line brief, and you do not need it.

Your first question, before any checklist: **write the paragraph this figure replaces. Does the figure say anything the paragraph does not?** When the answer is no, that is the only finding, and it ranks above everything else. A figure that passes every check and loses to its own paragraph does not ship.

Your second question: what does the eye land on first, and is that the thing the one-line brief says the figure is for?

Then put the figure beside the closest gold and say the one difference: more crowded, flatter, more tangled, or nothing.

Then answer every question in `verify.md` from a render. When a render you need does not exist, such as the 400% view of one attach point or the figure on its page, make it before answering. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list, in this order:

1. Existence and surface: the figure should be a sentence, a table or a canvas.
2. Structure and budget: a node, connector or label that could go; a figure that is two figures.
3. Connectors and labels.
4. Signal: the accent, the treatments, the legend.
5. Type, grid and accessibility.

Each item says what you would point at, which render shows it, and the fix in one line. End with what you could not check.

## Rules of the review

- The bar for a finding is evidence. Name the render, or quote the gate line with its file and line number.
- Rank by how much of the figure's meaning the fault costs, never by how easy the fix is.
- A line the builder called intentional is judged again from the render.
- A candidate line the builder let stand is judged again from the render.
- Do not fix anything. Do not redraw. Do not soften a finding because the figure is nearly there.
- A figure a paragraph carries, identical boxes for different kinds of thing, an accent with no reason, a legend that explains a style nobody used: these are findings even when no gate line names them.
- The project's own skin is not a finding. A contract's paper, families and accent stay; send back a palette that leaked from somewhere else, never the brand.
- On a canvas, test by dragging on a copy. Never review a board from a screenshot.

## What "nothing" looks like

When there is nothing to send back, say "nothing", then list what you looked at: each render by file name, the gate's last line, the gold you compared against, and the paragraph you wrote for the first question. A bare "nothing" with no list is not a review.
