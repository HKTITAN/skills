---
title: review
summary: The brief for a fresh-eye reviewer of a sourced answer. What to hand them, what never to hand them, their first question, how to rank and what "nothing" looks like.
---

# Review

The brief for a fresh-eye review, after the gate passes and [verify](verify.md) is walked. A reviewer who knows what the writer meant will read that meaning into the citation. This file keeps the meaning away from them, so they check the sentence against the line and nothing else.

Use it for every pressure-test, and for any answer that will be published, quoted to someone else or used to settle a decision.

## Hand them

- The user's question, word for word. That is the one-line brief.
- The reply, exactly as it will be sent.
- The output of `brain-check.mjs --gate` on the reply, whole.
- The theme files, [sources](sources.md), [silent](silent.md) and [disagreements](disagreements.md).
- This file, [verify](verify.md) and the `examples/` folder.
- One line naming the closest gold in `examples/`.
- For a pressure-test: the plan, the deck outline or the decision that was tested.

## Never hand them

- Any note on why these lines were chosen and others were not.
- The claims that were weighed and dropped.
- `ANSWER.md`.
- The writer's judgment of which candidate lines stand.
- The conversation that led to the reply.

## The reviewer's brief

You are reviewing an answer that reports what named people at Y Combinator have published. Someone else wrote it. You have the question, the reply, the gate output and the corpus. You have not seen the writer's reasons, and you do not need them: you are judging whether each sentence is carried by the line it cites.

Your first question, before the checklist: **for each citation, cover the sentence, open the theme file, find the line for that piece, and write down in a few words what the line says and who it names. Then uncover the sentence. Does it say the same thing, about the same person, and no more?** A sentence that says more than its line is the first finding, ranked above everything else, even when the gate passes. Then ask the second: take out every sentence that carries no citation. Is anything left that reads as a partner's view, or as the view of YC as a whole?

Then put the reply beside the closest gold and say the one difference.

Then answer every question in [verify](verify.md), in order, from what you were handed. If you need the original page to settle a point, open the URL in the `Source:` line yourself and read it. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list:

1. Invention: a position that no line carries, a line stretched past what it says, a quote that is not in the theme files.
2. Attribution: the wrong person named, one partner's view given to YC as a whole, a guest founder's story reported as a partner's rule.
3. Scope: advice for one stage or kind of company used on another, a year-bound number given without its year, a nearest piece grown into a view.
4. Flattening: a disagreement or a change over time reported as one view, a winner picked that no piece picked.
5. Sources: a wrong title or link, a `Source:` line nothing uses, a library date reported as the year of writing.
6. The reply: the answer not first, a vague last line, advice of the writer's own added after the report.

Each item: the sentence in the reply you would quote, the line in the theme file (or its absence) that shows the fault, and the fix in one line. Say what you could not check.

## Rules of the review

- The bar for a finding is evidence: a quoted sentence from the reply beside a quoted line from a theme file, a gate line with its file and line number, or a row in the silent or disagreements table. An impression is not a finding.
- Rank by how much of the answer the fault spoils, never by how quick the fix is. An invented position outranks every fault of format, because the reader will repeat it as a partner's.
- A candidate line the writer left standing is judged again from the reply. The writer's reason is not in front of you, and that is the point.
- Do not fix anything. Do not rewrite the reply. Do not soften a finding because the answer is nearly right.
- Do not review the plan that was tested. Whether the startup is a good idea is not the question. Here you judge whether the reply reports the published positions truly.
- Do not add what you remember a partner saying. If it is not in the corpus, it is not evidence, for the writer or for you.
- "No piece read covers this" is a correct answer. Never send it back for being short.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
Citations checked against their lines: <count>, each sentence says what its line says, about the person its line names.
Closest gold: <example>; the one difference: <it>.
Looked at: <the reply, the gate output, each theme file opened, each URL opened, by name>.
Could not check: <what, and why>.
```

A bare "looks good" is not a review. Send it back.
