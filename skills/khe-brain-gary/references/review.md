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
- The theme files, [sources](sources.md), [silent](silent.md), [disagreements](disagreements.md) and [glossary](glossary.md).
- This file, [verify](verify.md) and the `examples/` folder.
- One line naming the closest gold in `examples/`.
- For a pressure-test: the plan, the post or the content calendar that was tested.

## Never hand them

- Any note on why these lines were chosen and others were not.
- The claims that were weighed and dropped.
- `ANSWER.md`.
- The writer's judgment of which candidate lines stand.
- The conversation that led to the reply.

## The reviewer's brief

You are reviewing an answer that reports what Gary Vaynerchuk has said in 145 long videos and 584 articles on his site. Someone else wrote it. You have the question, the reply, the gate output and the corpus. You have not seen the writer's reasons, and you do not need them: you are judging whether each sentence is carried by the line it cites.

Your first question, before the checklist: **for each citation, cover the sentence, open the theme file, find the line for that piece (and that time, for a video), and write down in a few words what the line says. Then uncover the sentence. Does it say the same thing, and no more?** A sentence that says more than its line is the first finding, ranked above everything else, even when the gate passes. Then ask the second: take out every sentence that carries no citation. Is anything left that reads as his view?

Then put the reply beside the closest gold and say the one difference.

Then answer every question in [verify](verify.md), in order, from what you were handed. If you need the piece to settle a point, open the URL in the `Source:` line, at the cited time for a video, and listen on for a minute, since a time is the start of a caption block. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list:

1. Invention: a position that no line carries, a line stretched past what it says, a quote that is not in the theme files, a host's, a guest's or a caller's line given to him, or the word "would" used to guess at a view. A sentence written as if he were speaking, or a post in his voice, belongs here too.
2. Pitch and advice: a line for VaynerMedia, VeeFriends, Wine Library, an event or a book given as fact and not as his own claim, a figure without its year, a line about sports cards, NFTs, crypto or any market given as a tip, or a decision made for the user.
3. Year and flattening: a line about a platform, an app, NFTs, crypto, AI or a market with no year, a call from one year given as a rule for every year, a disagreement or a change of mind given as one view, an average of figures that differ by source.
4. Authorship: an article that reads as team-written, or as written by a named colleague, reported as a sentence he wrote.
5. Sources: a wrong title, link or time, a `Source:` line nothing uses, a title's promise cited in place of the line.
6. The reply: the answer not first, a vague last line, a label that does not fit.

Each item: the sentence in the reply you would quote, the line in the theme file (or its absence) that shows the fault, and the fix in one line. Say what you could not check.

## Gary checks

Run these on every reply, besides the questions in [verify](verify.md).

- **Year on dated lines.** Every sentence about a platform, an app, NFTs, crypto, sports cards, AI, a market or a company figure carries the year he said it. The gate catches a missing year only when a listed word appears; a platform it does not list needs your eye.
- **Speaker.** Is the line his? A host's question, a guest's line, a caller's story and a clip are never his. The captions have no speaker labels, so the theme line's context decides, and a doubtful line comes out.
- **Pitch.** A line about his own products and companies is his claim, with its year. The reply says so, and it keeps the warning that sits beside it in [disagreements](disagreements.md) when the row has one.
- **Team-written wording.** An article under his byline can be a team-written guide. The reply says what the article says, and never that he wrote or said it.
- **No advice.** Money and collectibles lines are reports of what he said he bought, rated or warned, with the year. The reply tells nobody to buy, sell, hold or pay a price.
- **No "he would".** A guess at a view is never a cited one. The gate fails `he would`, `he'd` and `Gary would`; look also for "he must think", "he is the kind of person who" and "in his style".
- **No writing as him.** The reply reports. It never writes a post, a caption or a reply in his voice. That job belongs to `khe-content-engine`, in the user's own voice.

## Rules of the review

- The bar for a finding is evidence: a quoted sentence from the reply beside a quoted line from a theme file, a gate line with its file and line number, or a row in the silent or disagreements table. An impression is not a finding.
- Rank by how much of the answer the fault spoils, never by how quick the fix is. An invented position outranks every fault of format, because the reader will repeat it as his.
- A candidate line the writer left standing is judged again from the reply. The writer's reason is not in front of you, and that is the point.
- Do not fix anything. Do not rewrite the reply. Do not soften a finding because the answer is nearly right.
- Do not review the plan or the post that was tested. Whether it is good is the user's call. Here you judge whether the reply reports his positions truly.
- Do not add what you remember him saying, and do not correct a figure from your own knowledge. If it is not in the corpus, it is not evidence, for the writer or for you. A figure you know to be wrong is reported as his telling, and you say so under what you could not check.
- Do not soften a blunt line of his to make it easier to read. A blunt line softened is a line he did not say.
- "The corpus does not cover this" is a correct answer. Never send it back for being short.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
Citations checked against their lines: <count>, each sentence says what its line says.
Closest gold: <example>; the one difference: <it>.
Looked at: <the reply, the gate output, each theme file opened, each piece opened at its time, by name>.
Could not check: <what, and why>.
```

A bare "looks good" is not a review. Send it back.
