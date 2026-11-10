---
title: review
summary: The brief for a fresh-eye review of a sticker, a set or a pack. What the reviewer is handed and what is kept from them, the first question, how findings are ranked, the rules of the review, and what "nothing" looks like.
tags: [sticker, review, fresh-eye]
---

# Review

The brief for a fresh-eye review, run after the gate passes and [verify](verify.md) has been walked. The builder has looked at these stickers too long to see them. The reviewer has never seen them, and that is the point.

## What to hand the reviewer

- The sticker files, and the gate's report (`sticker-check.json` from `--report`).
- The evidence the builder looked at: the whole set in one row at 400, 160 and 64 px, on white, near-black and a chat-bubble colour; the same row filled black; each motion as stepped frames; each still; the pack's files when there is a pack.
- This file, [verify](verify.md) and the `examples/` folder.
- A one-line brief that names what each sticker says, the home and the closest gold. For example: "Six chat stickers for a delivery app: sent, locked, done, ok, cheering, love it. Closest gold `isometric-lock.svg`."

## What never to hand them

- The builder's plan, or the reasons behind any choice.
- `STICKERS.md`. It tells the reviewer which lines the builder already excused, and an excuse read first is an excuse accepted.
- The names of the stickers on the sheet, for the first question. A label answers what the drawing was supposed to.

## The reviewer's brief

You are reviewing stickers someone else made. You have the files, the gate's report, the builder's evidence, [verify](verify.md) and the gold examples. You have one line of brief and need no more: you are judging the picture.

Your first question, before the checklist, with the names covered: **what does each sticker say, in two or three words, at 64 px?** Write your answer for each one, then uncover the brief. Every sticker where your words and the brief's differ is the first finding, whatever the gate says. A sticker you could not name is ranked above everything else.

Then look at the set as one picture, the way the most exacting designer you know would: the one who screenshots the single wrong thing and sends it back with "what is this?". Find that thing. In a set it is nearly always the one sticker that does not belong: the smaller one, the one sitting low, the one with the heavier line, the one tilted the other way, the only one with a base or a sparkle.

Then put the set beside the closest gold and say the one difference in a sentence.

Then answer every question in [verify](verify.md) from evidence. If the evidence you need does not exist (the row at 64 px, the silhouettes, a frame at the peak of the action, the reduced-motion still, the file played in a dark chat), make it yourself before answering: render the files, step the motion, run `node scripts/sticker-check.mjs <folder> --gate`. A predicted fault is not a finding. A predicted pass is not a pass.

## Ranking

Return one ranked list. Rank by how much of the sticker's use a fault spoils, never by how easy it is to fix:

1. **It does not read.** Nobody names it, the silhouette is a blob, it is two ideas, it dies at 64 px.
2. **It does not belong.** Outline, band, centre, tilt, palette or marks differ from the set.
3. **It moves wrongly.** No cause, no lead, a fade, a pop from nothing, a swap, a pivot on the corner, no hold, a still that says nothing.
4. **It does not ship.** A missing border, a file over its limit, a die-cut that leaves a part behind, an output the pack lacks, a platform rule nobody confirmed.
5. **It is not clean.** Grey, a gradient, a stock tell, a near-tangent, an uneven inset, live text, a bare hex.

Each item is three things: what you would screenshot, where it is (the file and the frame or size), and the fix in one line. End with what you could not check.

## Rules of the review

- The bar for a finding is evidence. Name the frame, the size and the ground, or quote the gate line. No evidence, no finding.
- Do not fix anything. Do not soften a finding because the set is nearly there.
- A line the builder called intentional is judged again. Look at the render and decide for yourself.
- A candidate line with no answer is a finding.
- A green gate settles nothing the gate does not check. Read "Not checked by the gate" in [verify](verify.md) and look at each item that applies.
- These are findings even when no gate line names them: a sticker that needs its caption; a set where one sticker is plainly smaller or off-centre; a sparkle, a star or a glow that marks nothing; purple standing in for cleverness; a letter in a coloured shape posing as a logo; an emoji used as an icon; two highlights; a still caught mid-action; a loop that never rests; several stickers looping in step in one view.
- Conventions are not faults. A sticker with no die-cut and `data-diecut="none"` on a page of one known ground, an animated file with no die-cut whose parts move apart, a reaction whose loop has no pop-out, a 4-unit mark beside 5-unit bodies: these are correct and stay.

## What "nothing" looks like

When there is nothing to send back, say "nothing", then list what you looked at so the claim can be checked: the sizes, the grounds, the silhouettes, the frames stepped, the stills, the reduced-motion state, the files played and where, the gate's last line. Then list what you could not check. A bare "looks good" is not a review.

Never invent a finding to fill the list. An empty list with its evidence is a complete review.
