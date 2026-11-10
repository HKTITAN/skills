---
title: review
summary: The brief for a fresh-eye reviewer of a launch film plan or render. What they get, what they never get, their first question, how they rank, and what "nothing" looks like.
tags: [launch-video, review, fresh-eye]
---

# Review

The brief for a fresh-eye review, run after the gate passes and [verify](verify.md) has been walked. The builder has watched the film too many times to see it. The reviewer has not.

## What to hand over

- The evidence: the render at its native frame rate, the contact sheets (one stepped every 2 frames across each seam, one across the whole film), the loudness readout, and the gate's JSON report.
- The plan file and the beat sheet, as the claims to be tested.
- [verify](verify.md) and the `examples/` folder.
- One line of brief: the product, whether its audience knows the brand, and the register named. For example: "60 s launch film for a deploy tool nobody has heard of, music only, UI motion."

## What never to hand over

- The builder's reasons for any decision.
- The builder's `FILM.md`.
- The list of gate lines the builder judged intentional.
- The storyboard notes, the chat that led to the plan, or any sentence that starts "we chose".

A reviewer who has read the reasons reviews the reasons. They are judging the film.

## The reviewer's brief

You are reviewing a launch film someone else planned and rendered. You have the render, its contact sheets, the plan, [verify](verify.md) and the gold examples. You do not have the builder's intent beyond the one-line brief, and you do not need it.

Your first question, before any checklist: **watch it once at speed with the sound on, then name the register you saw.** Write it down before you open the plan. If the register you saw is not the register the plan names, that is the first finding, and it outranks every other: each later number is being judged against the wrong row.

Your second question: cover the motion and look at two frames only, t = 0 and the held endcard frame. Does each one say what the product is, to someone who saw nothing else?

Then answer every question in [verify](verify.md) from a frame or a measurement. If the evidence you need does not exist (a contact sheet across one seam, the loudness of the final encode, the 9:16 cut), make it yourself or list it under what you could not check. A predicted fault is not a finding. A predicted pass is not a pass.

Put the plan beside the closest gold in `examples/` and say the one difference.

## Ranking

Return a ranked list in the film's own [review-format](review-format.md): one fault per row, Before, After, Why.

1. Register: the wrong row, two rows averaged, or a number judged against another register's median.
2. Structure: the hook, the name, the payoff, the endcard and its hold.
3. Seams and cuts: dead cuts, a foreign ground in a dissolve, a mismatched vector.
4. Words, the UI demo and motion inside a shot.
5. Sound and delivery.

Inside a rank, order by how much of the runtime the fault spoils, never by how easy the fix is. A dead cut at every scene change outranks a short endcard hold; a short endcard hold outranks one fast word.

## Rules of the review

- **The bar for a finding is evidence.** Each row quotes the second and the frame number at native fps, or says `whole film` for a measurement of the whole file.
- **Do not fix anything.** Do not edit the plan, the composition or the cut. Do not soften a finding because the film is nearly there.
- **A line the builder called intentional is judged again.** Open the gate's JSON report, read each candidate line, look at its frames, and decide for yourself.
- **Judge inside the register.** A still share of 49 % in a product-camera film is that register, not a fault. Say "that is a difference of register, not a flaw" when it is.
- **Never resample, and never trust a detector's cut count.** If the contact sheets were made from a resampled clip, send them back before reviewing.
- **A gate pass is not evidence the film was watched.** These are findings even when no gate line names them: a held UI card that breathes, a camera that sways on a spring, a cursor that fades out in place, a spinner looping through a hold, a sound bed laid from 0 s at one level with nothing withheld before the reveal.
- **Register conventions are not faults.** No display copy before the endcard in a product-camera film, thirty cuts a minute in a beat-cut sizzle and a founder film cut like an interview are the row doing what the row does.

## What "nothing" looks like

If nothing fails, say so in these words and list what you looked at:

```md
Nothing fails. Register seen: UI motion; the plan names UI motion.
Looked at: the render at 30 fps native, all 1,800 frames on the whole-film sheet, 6 seam sheets stepped every 2 frames, the ebur128 readout of the final encode.
Not checked: the 9:16 cut, a decode on the hardware decoder.
```

A review with no `Not checked:` line is not finished.
