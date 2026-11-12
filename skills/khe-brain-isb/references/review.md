---
title: review
summary: The brief for a fresh-eye reviewer of a sourced answer. What to hand them, what never to hand them, their first question, how to rank and what "nothing" looks like.
---

# Review

The brief for a fresh-eye review, after the gate passes and [verify](verify.md) is walked. A reviewer who knows what the writer meant will read that meaning into the citation. This file keeps the meaning away from them, so they check the sentence against the file and nothing else.

Use it for every pressure-test, and for any answer that will be published, quoted to someone else or used to settle a decision.

## Hand them

- The user's question, word for word. That is the one-line brief.
- The reply, exactly as it will be sent.
- The output of `brain-check.mjs --gate` on the reply, whole.
- The theme files, [sources](sources.md), [silent](silent.md) and [disagreements](disagreements.md).
- This file, [verify](verify.md) and the `examples/` folder.
- One line naming the closest gold in `examples/`.
- For a pressure-test: the plan, the numbers or the decision that was tested.

## Never hand them

- Any note on why these lines were chosen and others were not.
- The claims that were weighed and dropped.
- `ANSWER.md`.
- The writer's judgment of which candidate lines stand.
- The conversation that led to the reply.

## The reviewer's brief

You are reviewing an answer that reports what the isb-skills notes say. Someone else wrote it. You have the question, the reply, the gate output and the corpus. You have not seen the writer's reasons, and you do not need them: you are judging whether each sentence is carried by the file it cites.

Your first question, before the checklist: **for each citation, cover the sentence, open the URL on its `Source:` line, read the file, and write down in a few words what the file says. Then uncover the sentence. Does it say the same thing, and no more?** A sentence that says more than its file is the first finding, ranked above everything else, even when the gate passes. This corpus makes that fault easy: you already know the MBA frameworks the files summarise, and the files are short, so a correct sentence about Five Forces or WACC is often not what the file says. Then ask the second: take out every sentence that carries no citation. Is anything left that reads as the notes' view, or as ISB's?

Then put the reply beside the closest gold and say the one difference.

Then answer every question in [verify](verify.md), in order, from what you were handed. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list:

1. Fill-in: a claim that no file carries, a file stretched past what it says, a step or a factor added from general knowledge, a quote that is not in the file.
2. Promotion: the repository author's summary reported as ISB's teaching or a professor's view; a framework credited to an author the file does not name.
3. Figures: a number changed, a unit dropped, an example's numbers reported as a benchmark, a benchmark given with no note that the notes name no source, a figure moved to an industry or a year the file does not give it for.
4. Flattening: two files that give different numbers or steps reported as one.
5. Sources: a wrong title or link, a `Source:` line nothing uses.
6. The reply: the answer not first, a vague last line, advice or a build started that belongs elsewhere.

Each item: the sentence in the reply you would quote, the words in the file (or their absence) that show the fault, and the fix in one line. Say what you could not check.

## Rules of the review

- The bar for a finding is evidence: a quoted sentence from the reply beside quoted words from the file, a gate line with its file and line number, or a row in the silent or disagreements table. An impression is not a finding.
- Rank by how much of the answer the fault spoils, never by how quick the fix is. A filled-in claim outranks every fault of format, because the reader will repeat it as what the notes say.
- A true statement is still a finding when the file does not make it. You are checking the report, not the economics.
- A candidate line the writer left standing is judged again from the reply. The writer's reason is not in front of you, and that is the point.
- Do not fix anything. Do not rewrite the reply. Do not soften a finding because the answer is nearly right.
- Do not review the plan that was tested. Whether the business is sound belongs to the person who runs it. Here you judge whether the reply reports the notes truly.
- Do not add what you know about the subject. If it is not in the cited file, it is not evidence, for the writer or for you.
- "The notes do not cover this" is a correct answer. Never send it back for being short.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
Citations checked against their files: <count>, each sentence says what its file says.
Closest gold: <example>; the one difference: <it>.
Looked at: <the reply, the gate output, each file opened by URL, by name>.
Could not check: <what, and why>.
```

A bare "looks good" is not a review. Send it back.
