---
title: review
summary: The brief for a fresh-eye reviewer of a council reply. What to hand them, what never to hand them, what to hunt in order of harm, how findings are tagged, and what "nothing" looks like.
---

# Review

The brief for a fresh-eye review, after the gate passes and [verify](verify.md) is walked. A reviewer who knows why a brain was seated, or which way the builder leans, reads that into the reply. This file keeps the reasons away from them, so they judge each line against the seat block it cites and nothing else.

Every council reply gets one, because a council reply exists to settle a decision.

## Hand them

- The decision, in the person's words.
- The reply, exactly as it will be sent.
- The output of `decision-check.mjs --gate --strict` on the reply, whole, and of `decision-check.mjs --seats`.
- The installed brains: their folders, so a cited line can be opened in its reference file and each brain's `silent.md` can be read.
- This file, [verify](verify.md), [chair](chair.md) and the `examples/` folder, with one line naming the closest gold.
- The findings of any earlier round, so this round builds on them.

## Never hand them

- Why each brain was seated or left out, beyond what the `Council:` line says.
- Which way you expected the council to come out, or which recommendation you prefer.
- The seats that were tried and dropped, the chair's first list of disagreements, `COUNCIL.md`.
- The conversation that led to the reply.

## The reviewer's brief

You are reviewing a council reply. It reports what several bodies of published work say about one decision, then gives one recommendation labelled as the skill's own. Someone else built it. You have the decision, the reply, the gate output and the installed brains. You have not seen the builder's reasons, and you do not need them.

Your first question, before anything else: **take every sentence outside the seat blocks that names a person or an institution. For each, find its chair citation, find that text inside the seat's block, and read the seat's sentence. Does the chair's sentence say the same thing, and no more?** A sentence that says more than the seat's line is the first finding, even when the gate passes.

Then hunt, in this order. The order is the order of harm: the faults at the top put words under a real person's name, and the reader will repeat them.

1. **Words in a person's mouth.** A conditional or a guess beside a name ("would say", "thinks you should"), in any wording the gate did not catch. A chair sentence stronger than the seat line it cites. A view built from a `Nearest:`, `My reading:` or `Yours:` line, none of which is a seat's position (the gate's `nearest-citation` catches a citation that lives only there, not a title shared with a cited line). An `Agree:` line that says "each seat" or "every seat" over a seat that pulls both ways or was silent. A `Disagree:` side built on a seat's `Holds:` or `Breaks:` label and not on its cited sentence.
2. **A seat speaking past its corpus.** For each seat block, open two of its cited lines in that brain's reference files: does each line say what the sentence says? Open the brain's `silent.md`: did the seat answer a subject listed there? Is any sentence in the block general knowledge with a citation hung on it?
3. **A smoothed disagreement.** Read the seat blocks side by side for the decision's main fork. Do two seats pull apart on a point that the chair reports as agreement, or leaves out? Does a `Disagree:` line end by ruling for one side? Is a `Why:` about a person's character and not about stage, audience, date or country?
4. **A verdict in a person's name.** Is the recommendation's label whole? Does any other line carry the call ("so the material says do it")? After reading the reply once, could the person believe a cited person told them what to do?
5. **A padded council.** For each seated brain, which sentence of its description covers the decision? For each left-out brain, is the reason true of its description? Was a council convened when fewer than two seats spoke, without withholding the recommendation?
6. **A leaking chair.** Any fact, figure, piece or person in the chair block that appears in no seat block. Any fact in the recommendation that is on no `Agree:` or `Disagree:` line.

Then put the reply beside the closest gold and say the one difference. Then run the gate yourself, with `--strict` where the brains are installed, and paste its last line.

## The reply

```text
Reviewed: {the reply file, and the commit or the time it was read}
Gate: {the last line of decision-check.mjs --gate --strict, run by the reviewer}
Verdict: holds | holds with nits | does not hold
Findings:
- [important | nit | pre-existing] {the sentence in the reply, quoted} | {the seat line or reference line beside it, quoted, or its absence} | {the fix, in one line}
Closest gold: {example}; the one difference: {it}
Not verified: {what the reviewer could not open or run}
```

- `important`: the reply cannot go out with it. Everything in hunts 1 to 4 is important.
- `nit`: wording, order or length; the reply is true without the fix.
- `pre-existing`: a fault inside a brain (a wrong time, a dead link, a stretched line in its reference file) that this reply inherited. Report it for that brain's `gotchas.md`; it is not fixed here, and the sentence that leans on it comes out of the chair block.

A verdict counts only for the reply file it names. After any edit, the review runs again with the earlier findings handed over.

## Rules of the review

- The bar for a finding is evidence: a quoted sentence from the reply beside a quoted seat line or reference line, a gate line, or a row of a `silent.md`. An impression is not a finding.
- Rank by how much harm the fault does to a named person and to the reader, never by how quick the fix is.
- Do not review the decision. Whether the person should raise, quit or ship is their call. You judge whether the reply reports the material truly and labels its own call.
- Do not add what you know about anyone cited. If it is not in a seat block, it is not evidence, for the builder or for you.
- Do not fix anything and do not rewrite the reply.
- A withheld recommendation and the not-convened form are correct results. Never send one back for being short.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
Chair citations checked against their seat lines: {count}, each sentence says what its seat line says.
Seat lines opened in the brains' reference files: {count}, by brain.
Seating checked: {count} seated, {count} left out, each against its description and silent.md.
Closest gold: {example}; the one difference: {it}.
Gate: {its last line}.
Could not check: {what, and why}.
```

A bare "looks good" is not a review. Send it back.
