---
title: loop
summary: The one loop every routed job runs, whichever skill owns it. Plan, start from gold, build, run the gate, fix the largest fault, walk verify, fresh-eye review, hand over.
---

# The loop

`khe-auto` owns the loop. Each skill owns its checks. The loop is the same for a screen, a vector, a figure, a sound and a film; what counts as a fault is different for each, so the gate, the gold examples, the teaching pairs, the verify list and the review brief all come from the skill in play.

A playbook step and a one-skill route both run this loop once per skill. Two skills means two runs, one after the other, never side by side.

## The eight steps

| Step | Do | Exit, checked from evidence |
|---|---|---|
| 1. Plan | Write the goal, the skill, where the result will live, and what is left out. Turn an open request into limits before any work: one thing, one place, one size. | The plan is written down, and a stranger could say what "done" looks like from it. |
| 2. Start from gold | Open the skill's `examples/` and pick the closest one. Keep its structure and replace its content. | You can name the gold you started from and say what you kept. |
| 3. Build | Do the work by the skill's own rules, with values from its references. | The thing exists and runs, renders or plays. |
| 4. Run the gate | Run the skill's gate with `--gate` on what you built. | The last line printed is the gate's passed line. Paste it. |
| 5. Fix the largest fault | Take the fault that spoils the most, fix its cause, and run the gate again. Repeat from step 4. | No never-intentional line is left, and every candidate line is judged, with the reason written down. |
| 6. Walk verify | Answer every question in the skill's `references/verify.md`, top to bottom. | Every answer is a yes, and each one names what you looked at. |
| 7. Fresh-eye review | Hand a reviewer the evidence and the gold by the skill's `references/review.md`. | The reviewer returns "nothing", or every finding is fixed and steps 4 to 6 ran again. |
| 8. Hand over | Write the skill's handover file from its template. | The file lists what was checked, the gate's last line, the assumptions, what is unresolved and what was not checked. |

Most of the result is decided in steps 1 and 2. A job that starts at step 3 gets fixed at step 5, where every fix costs more.

## A step is not done until its exit is checked from evidence

Evidence is something you looked at after the work was done: the gate's output, a rendered frame, a capture at the real width, a file's measured size, a played sound. These are not evidence:

- The code or the source file, read back.
- Your memory of what you wrote.
- A plan that says the step will pass.
- A gate result from before the last edit.
- A gate that ran on a different file from the one that ships.

When the exit cannot be checked, the step is not done. Say which exit, say why, and carry it into the reply's last line. Never write the exit as met.

## Pick the gate

The gate belongs to the skill that did the step. Run it from the folder that holds the skills, with `--gate`.

| Skill in play | Gate | Ends with |
|---|---|---|
| `khe-ui` | `khe-ui/scripts/ui-check.mjs` | its passed line |
| `khe-design-tokens` | `khe-design-tokens/scripts/token-check.mjs` | its passed line |
| `khe-svg` | `khe-svg/scripts/svg-check.mjs` | its passed line |
| `khe-sticker` | `khe-sticker/scripts/sticker-check.mjs` | its passed line |
| `khe-diagram` | `khe-diagram/scripts/diagram-check.mjs` | its passed line |
| `khe-sound` | `khe-sound/scripts/sound-check.mjs` | its passed line |
| `khe-launch-film` | `khe-launch-film/scripts/film-check.mjs` | its passed line |
| `khe-demo` | `khe-demo/scripts/demo-check.mjs` | `demo-check passed` |
| `khe-brain-emil` | `khe-brain-emil/scripts/brain-check.mjs` | its passed line |
| `khe-brain-benji` | `khe-brain-benji/scripts/brain-check.mjs` | its passed line |
| `khe-brain-varun` | `khe-brain-varun/scripts/brain-check.mjs` | its passed line |
| `khe-content-engine` | `khe-content-engine/scripts/content-check.mjs` | `content-check passed` |
| `khe-auto` | `khe-auto/scripts/route-check.mjs` | `route-check passed` |
| `stageshow` | its own rehearsal gate, described in its own files | its own passed line |
| Any other linked skill | none | nothing; the exit is checked from evidence alone |

Rules for picking:

1. One step, one skill, that skill's gate. A film step is never closed by the sound gate, and a screen is never closed by the token gate.
2. A step that used two skills runs both gates, each on what its skill produced.
3. A decision step (whether to draw, which register, which engine) has no gate. Its evidence is the decision, written down with its reason.
4. The reply itself is checked by `route-check.mjs`, and so is every playbook.
5. `node khe-auto/scripts/gate-all.mjs` runs every gate's `--self-test` and prints one line per skill. Run it when a gate's own result looks wrong, before trusting that gate on your work.

## When the gate is missing or says inconclusive

| The gate | What it means | Do |
|---|---|---|
| File not there, skill installed | The skill ships no gate yet. `gate-all.mjs` prints `no gate`. | Do steps 6 and 7 with more care, and write "no gate was run for this step" in the handover file and in the reply's last line. |
| Skill not installed | There is nothing to run and no rules to follow. `gate-all.mjs` prints `not installed`. | Name the skill, say whose it is, give its install line, and stop that step. Never rebuild its rules or its gate from memory. |
| Prints `inconclusive`, exit 2 | It could not look: an empty input, a missing tool, a file type it does not read. | Read the reason it printed, give it what it needs, and run it again. If that is not possible, the step is unverified; say so. |
| Fails, exit 1 | A never-intentional line is above zero. | Step 5. Fix the cause. Never clear a line by hiding or deleting the thing it points at. |
| Passes, and the work still looks wrong | The gate cannot judge it. Every gate lists what it does not check. | Trust the eye. The fault goes to step 5 as the largest one. |

A missing gate and an inconclusive gate are both "not verified". Neither is a pass, and neither is a failure of the work.

## Fix the largest fault first

1. Rank by how much of the result the fault spoils, never by how quick the fix is.
2. Fix it at the earliest step that caused it. A cut that lands off its beat is fixed in the cut, never covered with a louder sound. A color that fails contrast is fixed in the scale, never on the one button.
3. After a fix at an earlier step, every later step runs again, gate included.
4. One fix, one gate run. Several edits and one run hide which edit broke what.

## When to stop and call the fresh eye

Stop building and hand the work to a reviewer when any one of these is true:

- Ten gate runs, the gate is green, and nothing visible is changing between runs.
- The same line has come back after being fixed.
- You have started to argue that a line is intentional.
- Every question in verify is a yes and something still looks wrong.

The reviewer gets the evidence, the skill's verify list, its gold examples and a one-line brief. The reviewer never gets the plan, the reasons or the handover file. A reviewer who has read the builder's reasons returns the builder's opinion.

## Directing an agent

A step handed to another agent is still your step. The agent has only what the brief says, so the brief carries the whole loop.

1. **Give limits, not wishes.** One thing, one place, one size, and the gold to start from. An open request gets the most common answer, which is rarely the right one.
2. **Give the rule with its reason.** "Picture locks before sound, because a sound is placed on a frame" lets the agent handle a case the brief never named. A bare rule gets applied once and broken the next time.
3. **Give a default for every branch.** Where the agent would have to choose, the brief chooses, and says what to do when none of the branches fits.
4. **Ask for a fixed output:** what changed, the gate's last line, what was not checked. A reply in the agent's own shape cannot be compared with the last one.
5. **Plan for several passes.** Ask for the best attempt and expect to send it back. A brief that promises one pass gets a result defended instead of improved.
6. **Keep the judgment.** An agent builds what works and does not notice that it looks wrong. You look at the result, you name what is wrong, and you say why.
7. **When a re-prompt returns the same fault a second time, stop prompting.** Have the agent build a tool for that fault instead: a script that measures it, a page that shows the two versions side by side. Then use the tool.

## Point, do not describe

Feedback that names a place gets fixed. Feedback that names a feeling gets guessed at.

| Describing | Pointing |
|---|---|
| "The header feels cramped." | The file and line, the selector, the string on screen, and "the title sits closer to the divider than to the icon". |
| "The film drags in the middle." | The timestamp, the frame number and the beat it belongs to. |
| "The icon looks off." | The file, the group's name and a capture at the size it ships. |
| "The route was wrong." | The gate line, with its file and line number, pasted. |

1. Name the target by the thing that identifies it most exactly, so it can be searched for: a selector, a file and line, a frame, a string.
2. Paste the gate line whole. It already carries the line name, the detail and the place.
3. Start with the least context that explains the fault. Add computed values, neighboring code or more frames only when the first note did not produce the fix.
4. One note, one fault. A note with three faults gets one of them fixed.

## Fix the skill, not the output

When a skill produces the same wrong result twice, the output is not the bug.

1. Write the failure down in one line, in the skill's `references/gotchas.md`, with the fix and the reference that owns the rule.
2. If the rule is missing or unclear, change the rule in the skill and give its reason in the same sentence.
3. Run the job again from the start with a fresh agent that has not seen the failed attempt. A patched output proves nothing about the next run.
4. If the fault is one a script can see, add a line to the skill's gate and a pair to its `teaching/` folder. The pair is the gate's test.
5. Delete a rule the agent already follows without being told. A skill that only grows stops being read.

For `khe-auto` itself: a route that landed wrong goes into [gotchas](gotchas.md) as one line, and a routing call you always make goes into [pov](pov.md).

## Hand over

Each skill names its own handover file and gives the template in its `references/verify.md`. For a playbook, each skill's file is written when its steps end, and the reply names where every one of them is. The handover for the route itself is `ROUTE.md`; its template is in [verify](verify.md).
