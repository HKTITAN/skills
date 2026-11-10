---
title: review
summary: The brief for a fresh-eye reviewer of an engine or a run, and the format of the review job. What to hand them, what never to hand them, their first question, how to rank, and what "nothing" looks like.
---

# Review

Two uses. The fresh-eye review that ends `setup`, `run` and `tune`, and the `review` job, where someone hands over drafts written elsewhere and asks whether they hold up against the engine. The brief is the same; in the `review` job you are the reviewer.

A reviewer who knows why the builder chose a treatment will agree with the treatment. This file keeps that knowledge away from them.

## Hand them

- The owner's request, word for word.
- The run file, or the drafts exactly as they would be posted, and the brief.
- The engine folder. For a review of drafts, the voice node and the platform nodes at the least.
- The output of `content-check.mjs --gate`, whole.
- This file, [verify](verify.md), [tells](tells.md) and the `examples/` folder.
- One line naming the closest gold run.

## Never hand them

- The plan, or any note on why a treatment or a hook was chosen.
- Drafts that were written and dropped.
- `CONTENT.md`.
- The builder's judgment of which candidate lines stand.
- The conversation that led to the drafts.

## The reviewer's brief

You are reviewing drafts someone else wrote in an owner's name. You have the brief, the drafts, the engine, the gate output, the verify list and the gold runs. You have not seen the reasons behind the drafts, and you do not need them: you are judging whether these posts could go out under this person's name.

Your first question, before the checklist: **cover the drafts. Read only the brief and the samples in the voice node. Then uncover one draft and read it as the owner's follower would. Which sentence would make that follower think the owner did not write it?** Quote it. That is the first finding, ranked above everything but an invented fact.

Your second: read all the drafts in the run in one sitting, as someone who follows the owner everywhere. For each, name what it gave you that the others did not. A draft with no answer is a finding.

Then put the run beside the closest gold and say the one difference.

Then answer every question in [verify](verify.md), in order, from what you were handed. If something you need was not handed over, open the file or run the gate yourself before you answer. A predicted fault is not a finding, and neither is a predicted pass.

Return a ranked list:

1. Facts: a number, a quotation, a result or a named person that the brief does not support.
2. Voice: a sentence the samples say the owner would not write, with the sample or trait it breaks.
3. Treatment: two drafts doing the same job, a hook the body does not pay, a padded platform.
4. Trace: a line whose cause cannot be found from the draft's node lines; a node fault the draft exposes.
5. The reply: a missing mark, a vague last line, any suggestion that something was posted.

Each item: the sentence you would quote, the sample, node line, brief line or gate line that shows the fault, and the fix in one line. For a voice or treatment fault, name the node that caused it. Say what you could not check.

## Rules of the review

- The bar for a finding is evidence: a quoted sentence beside a sample, a brief line, a node line or a gate line with its file and line number. "It feels generic" is not a finding until you can quote the sentence and the sample it fails against.
- Rank by harm, never by how quick the fix is. An invented fact outranks everything, because it is published under a real person's name.
- A line the builder called intentional is judged again from the drafts. The builder's reason is not in front of you, and that is the point.
- Do not fix anything. Do not rewrite a draft. Do not soften a finding because the run is nearly done.
- Judge against the owner's samples, never against your own preference for how a post reads.
- A draft the gate passed can still fail here. The gate never heard the owner.
- A claim about reach in a node with no source is a finding even when it is probably true.

## The review job's output

When the request is to judge existing drafts, reply with:

1. A verdict in one sentence: ready for the owner to read, or not, and the largest reason.
2. A table, worst first, with the columns `Draft`, `Line`, `Fault`, `Evidence` and `Node to change`.
3. The gate's last line, when a run file exists. When the drafts are loose text, say that the gate was not run and why.
4. `Not verified:` and what you could not check.

Never return rewritten drafts from a review. If the owner wants them fixed, that is `tune` for the node faults and `run` for the drafts.

## What "nothing" looks like

"Nothing" is a result, and it has to be earned. It reads:

```text
Nothing.
The sentence nearest to not sounding like the owner: "<it>"; it holds because <the sample it matches>.
What each draft gave that the others did not: <platform>: <it>; <platform>: <it>.
Closest gold: <example>; the one difference: <it>.
Looked at: <the brief, each draft, the nodes, the gate output, by name>.
Could not check: <what, and why>.
```

A bare "looks good" is not a review. Send it back.
