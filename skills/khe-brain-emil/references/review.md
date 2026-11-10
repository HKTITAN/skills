---
title: review
summary: The brief for a fresh-eye reviewer of an answer. What to hand them, what never to hand them, their first question, how to rank and what "nothing" looks like.
---

# Review

The brief for a fresh-eye review, after the gate passes and [verify](verify.md) is walked. A reviewer who knows which claim lines the builder picked will find those lines and agree. This file keeps that from them.

## Hand them

- The user's question, word for word. That is the one-line brief.
- The reply, exactly as it will be sent.
- The output of `brain-check.mjs --gate` on the reply, whole.
- The `references/` folder, this file, [verify](verify.md), SKILL.md and the `examples/` folder.
- One line naming the closest gold in `examples/`.
- Permission to open the live articles at the URLs in [sources](sources.md).

## Never hand them

- The claim lines the builder collected, or which theme file they opened.
- `ANSWER.md`.
- The builder's reasons for a `My reading:` sentence.
- The builder's judgment of which candidate lines stand.
- The conversation that led to the reply.

## The reviewer's brief

You are reviewing an answer someone else wrote in another person's name. You have the question, the reply, the gate output, the references and the gold replies. You have not seen how the builder found the claims, and you do not need to: you are judging whether a reader who trusts this reply would be misled about what Emil Kowalski has published.

Your first question, before the checklist: **take the first `[n]` sentence, open the article at its `Source:` URL, and find the passage that says it. Is it there, and does it say that much and no more?** Do the same for every marker. A sentence the article does not back is the first finding, ranked above everything else, even when the gate passes. If you cannot open the article, find the claim line in `references/` and say that the live page was not read.

Then the second: cover the reply, read only the question, and look in [disagreements](disagreements.md) and [silent](silent.md) yourself. Uncover the reply. Did it miss an entry you found?

Then put the reply beside the closest gold and say the one difference.

Then answer every question in [verify](verify.md), in order, from what you were handed. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list:

1. A claim in his name that no article backs, or that says more than the article does.
2. A disagreement left out, a side picked, two numbers averaged, or a silent topic answered.
3. A reading that is not marked, or a marked reading that does not follow from the cited line.
4. The source lines: a wrong title, a wrong URL, a quotation that is not word for word.
5. The reply: a missing part, a vague last line, a build job done instead of handed off.

Each item: the sentence in the reply you would quote, the passage or claim line that shows the fault, and the fix in one line. Say what you could not check.

## Rules of the review

- The bar for a finding is evidence: a sentence from the reply beside a passage from the article, a claim line, a row in a reference, or a gate line with its file and line number. An impression is not a finding.
- Rank by how badly the reader would be misled about him, never by how quick the fix is. An invented position outranks ten formatting faults.
- "It sounds like something he would say" is not evidence for a claim. It is the reason invented claims get through.
- A line the builder called intentional is judged again from the reply. The builder's reason is not in front of you, and that is the point.
- Do not fix anything. Do not rewrite the reply. Do not soften a finding because the answer is useful.
- Do not judge whether he is right. This review is about whether the reply reports him correctly.
- A reply that says "he has not written about this" is correct when the references have nothing. Never send it back for being unhelpful.
- A `My reading:` sentence is allowed to be wrong about design. It is a finding only when it is unmarked, or when it claims to follow from a line that does not support it.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
Markers checked: <each [n]> against <the article or the claim line>, each one backed.
Disagreements and silence: looked for <topic>; found <the entry, or none>; the reply agrees.
Closest gold: <example>; the one difference: <it>.
Looked at: <the reply, the gate output, each reference file and each article, by name>.
Could not check: <what, and why>.
```

A bare "looks good" is not a review. Send it back.
