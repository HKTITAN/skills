---
title: review
summary: The brief for a fresh-eye reviewer of a recorded demo. What they get, what they never get, their first question, how they rank, and what "nothing" looks like.
tags: [demo, review, fresh-eye]
---

# Review

The brief for a fresh-eye review, run after the gate passes and [verify](verify.md) has been walked. The builder has watched the take thirty times and knows what it is meant to show. The reviewer watches it once, the way the audience will.

## What to hand over

- The delivery files, at the size and in the place they will be shown where that is possible (the README preview, the page).
- The contact sheet of each delivery file, one frame every 0.5 s (`node scripts/post.mjs sheet`).
- The gate's JSON report and the take report.
- [verify](verify.md) and the `examples/` folder.
- One line of brief: the product, the destination, and who watches. For example: "A task app, a GIF for the README, read by developers deciding whether to install it."

## What never to hand over

- The script's `what` sentences, or the sentence that says what the one thing is.
- The builder's `DEMO.md`.
- The builder's reasons for any hold, zoom or candidate line.
- The chat that led to the script.

A reviewer who has read what the demo is meant to show will see it shown. The first question exists to test exactly that.

## The reviewer's brief

You are reviewing a recording of a real product that someone else scripted and recorded. You have the files, their contact sheets, the reports, [verify](verify.md) and the gold examples. You do not know what the demo is meant to show, and you must not ask.

Your first question, before any checklist: **watch the file once at full speed, at the size it will be shown, then write one sentence saying what the product did.** Write it before you look at anything else. If you cannot write it, or the builder's script says something different, that is the first finding and it outranks every other: the story did not arrive.

Your second question: look only at the first frame and the last frame. Does the first say where you are? Does the last show the result, complete and readable?

Your third: go through the contact sheet one frame at a time and read everything in each frame that is not the product's own chrome. Every name, address, number, avatar, banner and badge. Anything that looks like it belongs to a real person or a real account is a finding, ranked first, even if you cannot prove it.

Then answer every question in [verify](verify.md) from a frame. If the evidence you need does not exist (a sheet at a finer step across one move, the file at its shown width, the GIF beside the mp4), make it yourself or list it under what you could not check. A predicted fault is not a finding. A predicted pass is not a pass.

Put the take beside the closest gold in `examples/`: record the gold against the sample app if you need to see it move. Say the one difference.

## Ranking

Return a ranked list, one fault per row: `Frame | What | Fix`.

1. State: anything real, secret or personal on screen; a take that does not repeat.
2. Story: the sentence did not arrive; a first or last frame that fails alone; a beat that could be cut.
3. Pace: dead air, a pointer that jumps, wanders or covers the words, typing too fast to read.
4. Size and file: text too small at the shown size, a soft take, a file that will not play where it is going.

Inside a rank, order by how much of the take the fault spoils, never by how easy the fix is. A name in every frame outranks a banner in one; three seconds of dead air outrank one fast word.

## Rules of the review

- **The bar for a finding is a frame.** Each row quotes the file and the time in seconds, or the sheet and the cell.
- **Do not fix anything.** Do not edit the script, re-record or re-export. Do not soften a finding because the take is nearly there.
- **A line the builder called intentional is judged again.** Open the gate's report, read each candidate, look at its frames and decide for yourself.
- **A gate pass is not evidence the take was watched.** These are findings even when no line names them: a pointer resting on the label it pressed, a caret blinking through a long hold, a tooltip left open, a scrollbar that jumps, a focus ring on the wrong control, a result that is on screen for less time than it takes to read.
- **Real product conventions are not faults.** The app's own loading state, its real empty state, its native controls and its actual speed after a ramp are the product. Send back a wait that was left at full length; never send back the spinner for existing.
- **You judge the recording, not the product.** A confusing screen in the product is worth one line under notes, outside the ranked list.

## What "nothing" looks like

If nothing fails, say so in these words and list what you looked at:

```md
Nothing fails. What I saw the product do: a task was added to the list and the open count went from 3 to 4.
Looked at: demo.mp4 once at full speed at 1280 wide, its 17-frame sheet, demo.gif in a README preview, the take report (2 takes, repeatable).
Not checked: the webm, Safari, the page it will sit on.
```

A review with no `Not checked:` line is not finished.
