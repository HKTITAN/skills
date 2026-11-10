---
title: review
summary: The brief for a fresh-eye review of an SVG. What the reviewer is handed and what is kept from them, the first question, how findings are ranked, the rules of the review, and what "nothing" looks like.
tags: [svg, review, fresh-eye]
---

# Review

The brief for a fresh-eye review, run after the gate passes and [verify](verify.md) has been walked. The builder has looked at this file too long to see it. The reviewer has never seen it, and that is the point.

## What to hand the reviewer

- The file or files, and the gate's report (`svg-check.json` from `--report`).
- The evidence the builder looked at: the render at its shipped size, on the light and the dark surface, beside two neighbours when it is an icon; the motion as stepped frames; the frame under reduced motion.
- This file, [verify](verify.md) and the `examples/` folder.
- A one-line brief that names the job, the home and the closest gold. For example: "Animated logo, loaded as an img on the landing page, closest gold `logo-draw.svg`."

## What never to hand them

- The builder's plan, or the reasons behind any choice.
- `SVG.md`. It tells the reviewer which lines the builder already excused, and an excuse read first is an excuse accepted.
- A summary of what was fixed. The reviewer judges the file as it is, never the distance it has travelled.

## The reviewer's brief

You are reviewing an SVG someone else built. You have the file, the gate's report, the builder's evidence, [verify](verify.md) and the gold examples. You have one line of brief and need no more: you are judging the file and its render.

Your first question, before the checklist: **could the next person change this file without redrawing it?** Open the markup and try three edits in your head: recolour it for a dark theme, double its size, move one part. If any of the three means rewriting paths or hunting through unnamed groups, that is the first finding, whatever the gate says.

Then start from the brief's own words. If it says "loaded as an img", a transition or a hover rule is the first thing on the list. If it names a set, a stroke weight or a size, hold the file to that before anything else.

Then put the file beside the closest gold and say the one difference in a sentence.

Then answer every question in [verify](verify.md) from evidence. If the evidence you need does not exist (the icon at 16px, the dark surface, the morph interrupted halfway, the reduced-motion frame), make it yourself before answering: render the file, step the motion, run `node scripts/svg-check.mjs <file> --gate`. A predicted fault is not a finding. A predicted pass is not a pass.

## Ranking

Return one ranked list. Rank by how much of the file's use a fault spoils, never by how easy it is to fix:

1. **It cannot be used.** It does not scale, recolour, render in its home, or name itself.
2. **It moves wrongly.** The wrong engine, a morph that jumps, a part orbiting the corner, motion with no cause, no reduced-motion state.
3. **It does not match.** Stroke weight, optical size or style against its set; palette against the contract.
4. **It is not clean.** Size, precision, leftovers, repeated definitions.

Each item is three things: what you would screenshot or quote, where it is (the file and line, or the frame), and the fix in one line. End with what you could not check.

## Rules of the review

- The bar for a finding is evidence. Quote the line of markup, the gate line, or the frame. No evidence, no finding.
- Do not fix anything. Do not soften a finding because the file is nearly there.
- A line the builder called intentional is judged again. Look at the render and decide for yourself.
- A candidate line with no answer is a finding.
- A green gate settles nothing the gate does not check. Read "Not checked by the gate" in [verify](verify.md) and look at each item that applies.
- These are findings even when no gate line names them: an icon drawn by hand to fill a gap in a set; a morph between unrelated icons; a line, its area and its dot arriving together; a loop on something seen all day.
- Conventions are not faults. A mask painted white and black, a sprite root with no `viewBox`, a parked line at opacity 0 in a morph family, a file with no motion at all: these are correct and stay.

## What "nothing" looks like

When there is nothing to send back, say "nothing", then list what you looked at so the claim can be checked: the sizes rendered, the surfaces, the frames stepped, the reduced-motion frame, the gate's last line. Then list what you could not check. A bare "looks good" is not a review.

Never invent a finding to fill the list. An empty list with its evidence is a complete review.
