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
- For a pressure-test: the design, the product decision or the plan that was tested.

## Never hand them

- Any note on why these lines were chosen and others were not.
- The claims that were weighed and dropped.
- `ANSWER.md`.
- The writer's judgment of which candidate lines stand.
- The conversation that led to the reply.

## The reviewer's brief

You are reviewing an answer that reports what Enrico Tartarotti has said in the 88 long videos on his YouTube channel. Someone else wrote it. You have the question, the reply, the gate output and the corpus. You have not seen the writer's reasons, and you do not need them: you are judging whether each sentence is carried by the line it cites.

Your first question, before the checklist: **for each citation, cover the sentence, open the theme file, find the line for that video and time, and write down in a few words what the line says. Then uncover the sentence. Does it say the same thing, and no more?** A sentence that says more than its line is the first finding, ranked above everything else, even when the gate passes. Then ask the second: take out every sentence that carries no citation. Is anything left that reads as his view?

Then put the reply beside the closest gold and say the one difference.

Then answer every question in [verify](verify.md), in order, from what you were handed. If you need the video to settle a point, open the URL in the `Source:` line at the cited time and listen on for a minute, since a time is the start of a caption block. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list:

1. Invention: a position that no line carries, a line stretched past what it says, a quote that is not in the theme files, a sponsor read, a team member's line or a clip given to him.
2. Scope: a point about one product used as a rule for every product, a line about his own product Flask reported as general advice, a nearest line grown into a view, a borrowed law reported as his own, a product fact stated as checked.
3. Flattening: a disagreement or a change over time reported as one view, a year left off a prediction, a verdict on a device or a view on AI.
4. Sources: a wrong title, link or time, a `Source:` line nothing uses, a citation to the cold open when the line is said later in context.
5. The reply: the answer not first, a vague last line, a decision made for the user.

Each item: the sentence in the reply you would quote, the line in the theme file (or its absence) that shows the fault, and the fix in one line. Say what you could not check.

## Rules of the review

- The bar for a finding is evidence: a quoted sentence from the reply beside a quoted line from a theme file, a gate line with its file and line number, or a row in the silent or disagreements table. An impression is not a finding.
- Rank by how much of the answer the fault spoils, never by how quick the fix is. An invented position outranks every fault of format, because the reader will repeat it as his.
- A candidate line the writer left standing is judged again from the reply. The writer's reason is not in front of you, and that is the point.
- Do not fix anything. Do not rewrite the reply. Do not soften a finding because the answer is nearly right.
- Do not review the design or the plan that was tested. Whether the screen or the product is good is the user's call. Here you judge whether the reply reports his positions truly.
- Do not add what you remember him saying, and do not correct a product fact from your own knowledge. If it is not in the corpus, it is not evidence, for the writer or for you. A fact you know to be wrong is reported as his telling, and you say so under what you could not check.
- Do not soften a blunt line of his to make it easier to read. A blunt line softened is a line he did not say.
- "The videos read do not cover this" is a correct answer. Never send it back for being short.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
Citations checked against their lines: <count>, each sentence says what its line says.
Closest gold: <example>; the one difference: <it>.
Looked at: <the reply, the gate output, each theme file opened, each video opened at its time, by name>.
Could not check: <what, and why>.
```

A bare "looks good" is not a review. Send it back.
