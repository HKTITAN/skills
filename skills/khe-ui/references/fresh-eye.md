---
title: fresh-eye
summary: The brief for a reviewer who sees only the evidence and the gold, never the builder's plan, and returns a ranked list or "nothing".
---

# Fresh eye

The brief for a second reviewer, called at step 7 of the workflow, after the gate passes and [verify](verify.md) has been walked. The builder has looked at the screen through the whole build and now sees what they meant to make. The fresh eye sees what is there. This is a different job from [review](review.md), which sets how to review someone's UI code and what the table looks like; the fresh eye uses that format and adds one condition: it knows nothing about how the work was made.

## What to hand over

Give the reviewer exactly this:

- **The evidence.** The files, and what was captured from the running screen: shots at 390 and at the shown width, the Tab recording, the reduced-motion shot, the 25% speed recording, the worst-case fixture boxes. A URL or a run command when the screen can be run.
- **This file and [verify](verify.md).**
- **The gold.** The `examples/` folder, with the closest example named.
- **A one-line brief.** What the thing is and where it ships, in the user's words: "The invite dialog for the team settings page, desktop and phone."
- **The gate's raw output**, as printed.

## What never to hand over

- **The builder's plan.** A reviewer who knows the plan checks the plan.
- **The builder's reasons.** "The 600ms is on purpose" turns a finding into a debate before it is written down.
- **`UI-CHECK.md`.** It lists what the builder already believes is fine.
- **The conversation that led here.** A reviewer handed a conclusion tends to return it confirmed.

## The reviewer's brief

You are reviewing an interface someone else built. You have the files, the captured evidence, `verify.md` and the gold examples. You have not seen the plan and you do not need it: you are judging the screen.

**Your first question, before any checklist:** what does this screen do when it is not the screenshot? Name the three states the evidence does not show (a slow load, an empty account, a failed save, a long name, a keyboard, a phone). If you cannot find them in the evidence, that is your first finding, and it ranks above everything a checklist will give you.

Then:

1. Run `node scripts/ui-check.mjs <files> --gate` yourself. Never trust a pasted pass.
2. Walk every question in `verify.md` and answer each from evidence. When the evidence you need does not exist (no 390 shot, no Tab pass, no reduced-motion shot), make it yourself when you can run the screen. When you cannot, the question goes under "Not checked". A predicted failure is not a finding, and neither is a predicted pass.
3. Put the work beside the closest gold in `examples/` and say the one difference.
4. Read every candidate line the gate printed and judge it from the screen.

## How to rank

Rank by how much of the screen it spoils for how many people, never by how easy it is to fix. In this order:

1. **Locks someone out.** A keyboard, a screen reader, low vision, a motion setting or a phone cannot finish the task.
2. **A missing state.** A typical user meets it in the first session: no loading, empty or error branch, a form that loses its values.
3. **Breaks with real data.** A long name, zero items, ten times the count, a slow network.
4. **Wrong value.** A curve, a duration, a size or a layer that a lane contradicts.
5. **Polish.** Insets, alignment, optical details.

Return the list in the review format: one row per issue, `Before | After | Why`, the Before quoted from the code or naming the frame that shows it. Three to five rows. Then one line for what you could not check.

## Rules of the review

- **The bar for a finding is evidence.** A line you can grep, a frame you can name, a Tab press you made. "It probably breaks on a phone" is not a finding.
- **Do not fix anything.** Report. The builder fixes, then you look again.
- **A line the builder called intentional is judged again.** Look at the screen and decide for yourself. "Intentional" is a claim, not evidence.
- **A fault cleared by hiding the thing it pointed at is still open.** A deleted fixture row, a removed button, a renamed class.
- **Do not soften.** Nearly finished work gets the same list as rough work.
- **Do not invent.** With nothing wrong, write no rows.
- **Platform conventions are not faults.** The browser's own focus ring, a native `<dialog>`, a system font in product UI: leave them.
- **These are findings even when no gate line names them:** a data view with one branch, a control with no pressed or focused state, a value on screen that comes from no lane and no token, a hover that carries the only route to an action, a screen that could belong to any product.

## What "nothing" looks like

"Nothing" is an answer with its evidence, never a shrug:

```text
Nothing.
Gate: ui-check passed (4 files scanned, 0 candidates), run by me.
Looked at: shot-390.png, shot-1280.png, tab-pass.mov, reduced.png, slow-25.mov, the fixture at 320, 560 and 1100.
Beside the gold: examples/field. One difference: two fields share one message lane row on wide screens.
Not checked: VoiceOver, a real phone, the dark theme.
```

A "nothing" with an empty "Looked at" line is not a review. Send it back.
