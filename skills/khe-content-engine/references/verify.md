---
title: verify
summary: The last pass on an engine or a run. The gate first, then yes/no questions answered from the files as they are and the brief open beside them, never from memory of what was meant.
---

# Verify

The last pass. Every answer comes from the files as they will be handed over, the brief, the owner's samples, and gate output you ran after the last edit. Never answer from what you meant to write. Fix the largest fault first, run the gate again, and return to the top until every answer is yes.

## Gate

Run from this skill's folder, with the path to the owner's engine or run:

```sh
node scripts/content-check.mjs path/to/content-engine --gate
node scripts/content-check.mjs path/to/content-engine/runs/2026-11-10-idea.md --gate
node scripts/content-check.mjs examples --gate
node scripts/content-check.mjs --self-test
```

- After `setup` or `tune`: the first command ends `content-check passed`? That means every required node exists, every link resolves, no node is orphaned, the voice node has sourced samples and a never-say list, and every platform node has a limit and a dated-facts line. It does not mean the voice is right.
- After `run`: the second command ends `content-check passed`? That means the drafts fit, differ, name their nodes, carry no banned phrase and state no number or quotation the brief lacks. It does not mean they are good.
- After editing an example, a pair, `tells.md` or the gate: the third command ends `content-check passed` and the fourth ends `self-test passed`?

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified. A run whose engine folder was not found is inconclusive, and so is a node checked on its own.

## Facts (first, because a made-up fact is the fault that harms someone)

- Open the brief beside each draft. Is every number in the draft in the brief, with the same unit and the same meaning?
- Is every quotation in the brief word for word, and does the brief say the person agreed?
- Is there a claim about a result, a customer or a competitor that the brief does not make?
- Is every `[confirm]` mark listed on the `Not verified:` line, for the owner to settle?
- Is any number written as a word hiding a fact the brief lacks? The gate reads digits only.
- Does any platform node state a reach or ranking fact with no source? For X, does it cite a statement in [x-algorithm](x-algorithm.md) by number?

## Voice

- Put each draft beside the three closest samples in the voice node. Could the draft be slipped among them without standing out?
- Read the draft aloud. Is there a sentence the owner would not say?
- Does every trait in the voice node hold in the draft: person, sentence length, how it opens, how it ends, punctuation?
- Walk "Tells the gate cannot see" in [tells](tells.md). Is each one absent?
- For `setup`: is every sample copied exactly, with a `Source:` line, and is every trait backed by sample numbers?

## Treatment

- Is the claim written in the brief as one sentence, and does every draft argue it?
- For each draft: name the one thing a reader gets from it and from no other draft in the run. Is there an answer for every draft?
- Does each draft open with a different hook type, and is that type a heading in the hooks node?
- Run the payoff test in [hooks](hooks.md) on each draft. Can you quote the line that pays the hook?
- Was each longer draft written from the brief, or is it the short one with more words?
- Was a platform padded when it had nothing? It is skipped with a reason instead.

## Trace

- Pick the weakest line in each draft. Do its `Treatment:`, `Hook:`, `Segment:`, `Type:` and `Nodes:` lines tell you which node to change to fix it?
- For `tune`: was a node changed, is the change dated under `## Changes` with the draft line that caused it, and was the run made again from the changed node?
- Does the index link every node, with a reason beside each link?

## The reply (last)

- Does the reply say that nothing was posted or scheduled?
- Does it list every `[confirm]` mark and every skipped platform?
- Is the last line `Not verified:` and does it name something real?

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `content-check passed` only when all are at 0. Clearing a line by hiding what it points at is a bug: writing "thirty-seven percent" clears `unmarked-number:` and leaves an invented figure in the post, and adding a fourth quotation of your own clears `voice-no-samples:` and leaves a voice nobody has.

| Line | What it means |
|---|---|
| `missing-node:` | A required node is absent: index, voice, audience, hooks, repurpose, content-types, cadence, or at least one platform. |
| `untyped-node:` | A file in the engine with no `node:` line in its frontmatter. |
| `broken-link:` | A link to a node that does not exist. |
| `orphan-node:` | A node no other node links to. A run never reads it. |
| `voice-no-samples:` | Fewer than 3 quoted samples, or a sample with no `Source:` line. |
| `voice-no-never-say:` | No `Never say` list of at least 5 entries. |
| `audience-no-segment:` | No `## Segment:` section in the audience node. |
| `platform-no-limit:` | A platform node with no `Limit:` line. |
| `platform-no-dated-facts:` | A platform node with no `Facts checked:` date. |
| `placeholder:` | Template text left in a node. |
| `no-engine:` | A run with no `Engine:` line. |
| `no-brief:` | A run with no `## Brief` section. |
| `unknown-platform:` | A draft for a platform the engine has no node for. |
| `missing-draft:` | A platform asked for with no draft and no `Skipped:` entry, or a draft section with no fenced draft. |
| `no-treatment:` | A draft with no `Treatment:` line. |
| `same-treatment:` | Two drafts with the same `Treatment:` line. |
| `draft-no-nodes:` | A draft with no `Nodes:` line, or one that leaves out the voice node or its own platform node. |
| `unknown-node:` | A draft that names a node the engine does not have. |
| `over-limit:` | A draft or a part longer than the platform node's `Limit:`, or more parts than `Max parts:`. |
| `pasted:` | Two drafts that share more than 20% of the shorter one's sentences of four words or more. |
| `same-hook:` | Two drafts with the same first line. |
| `tell:` | A phrase or pattern from [tells](tells.md) in a draft. |
| `never-say:` | A phrase from the voice node's `Never say` list in a draft. |
| `unmarked-number:` | A number in a draft that is not in the brief and has no `[confirm]` after it on its line. |
| `unmarked-quote:` | Three or more words in double quotation marks that are not in the brief and have no `[confirm]` after them. |
| `no-unverified:` | The last line is not `Not verified:` followed by what nobody checked. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `CONTENT.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `index-misses-node:` | A node the index does not link. | Never for long. Add the link with its reason. |
| `repurpose-misses-platform:` | A platform with no treatment in the repurpose node. | Never. Write its treatment. |
| `trait-no-sample:` | A trait with no sample numbers. | Never. Find the sample or cut the trait. |
| `thin-samples:` | Under 60 words of samples in all. | Only when the owner writes very short posts and there are more than five samples. |
| `stale-facts:` | A `Facts checked:` date more than 180 days old. | Never. Check the facts again and change the date. |
| `confirm-open:` | A `[confirm]` mark in a draft. | Until the owner settles it. It is listed in the reply. |
| `skipped-platform:` | A platform asked for and skipped. | When the reason is that the idea has nothing for it. |
| `hook-not-in-node:` | A `Hook:` line that names no type in the hooks node. | Never. Use a type the owner has, or tune the hooks node first. |
| `extra-draft:` | A draft nobody asked for. | Never. Remove it or ask. |
| `thin-brief:` | A brief under 40 words. | For an opinion with no figures, when the brief says so. |

## What you see, what you do

| You see | You do |
|---|---|
| The LinkedIn draft is the X post with more words (`pasted:`) | Go back to the brief and write it from there, on the treatment in the repurpose node. Never expand the short one |
| Two drafts open the same way (`same-hook:`) | Pick a second hook type the brief can fund. Rewrite the first line and check its payoff |
| A percentage you worked out yourself (`unmarked-number:`) | Remove it, or mark it `[confirm]` and list it for the owner. Never spell it as words |
| A quotation that fits the post too well (`unmarked-quote:`) | Delete it. A quotation comes from the brief or does not exist |
| "Let's dive in", an em dash, "not just X but Y" (`tell:`) | Find the fact the sentence stood in for and write that. Never swap in a synonym |
| A phrase the owner banned (`never-say:`) | Rewrite the sentence. If it keeps coming back, the cause is in a node: tune it |
| The draft runs past the limit (`over-limit:`) | Cut to the treatment. If the idea needs the room, it belongs on a platform with more |
| A draft with no `Nodes:` line (`draft-no-nodes:`) | Add the nodes it used. If you cannot say which, it was not written from the engine: write it again |
| A voice node full of adjectives (`voice-no-samples:`) | Ask for posts they wrote. Quote three. Derive traits from those, by [voice-sampling](voice-sampling.md) |
| A platform node that says "the algorithm prefers" with no source (`platform-no-dated-facts:`) | Move it under `Confirm before relying on this`. Add the dated facts from [platforms](platforms.md) |
| A node with a bracketed blank (`placeholder:`) | Ask the owner the question the blank stands for |
| A node nothing links to (`orphan-node:`) | Link it from the index with its reason, or delete it |
| The owner says "this does not sound like me" and the gate is green | The gate never heard their voice. Ask which line, add their rewrite as a sample, and tune the voice node |
| The hook promises a number the body never gives | Payoff test in [hooks](hooks.md). Rewrite the hook to promise what the body has |
| The same correction for the third run | One line in [gotchas](gotchas.md), then fix the node that keeps causing it |
| A request to post or schedule the drafts | Decline, say why, and hand over the file. A person posts |
| A request to "add a stat to make it stronger" | Ask for the figure and where it came from. Without one, the draft stays as it is |
| Ten gate runs, gate green, nothing changing | Stop. Fresh eye, by [review](review.md) |

## Not checked by the gate

The gate reads text. It never sees the owner, their readers or a platform.

- Whether a draft sounds like the samples.
- Whether the hook is paid off by the body.
- Whether two drafts differ in angle, or only in wording that slipped under 20%.
- Whether a number in the brief is true, or means in the draft what it meant in the brief.
- Numbers written as words, and quotations in single quotation marks.
- Whether a platform fact is still current. It checks only that a date exists and how old it is.
- How a platform weights links, emoji or scripts when it counts. The gate counts code points; on X a link counts as 23 and an emoji as 2.
- Whether a sample was written by the owner.
- Whether a person named or quoted agreed to it.
- Whether anything was posted. The skill never posts, and the gate cannot tell if someone did.

## Where sources differ

- **Links on X.** The method article says the ranking penalises a link in the main post and tells the writer to put it in a reply. The published code shows a positive default weight on a predicted link click and a link flag passed to the reranker whose effect was not traced, and it removes replies from For You for people who do not follow the author. The repository wins: no node states a link penalty as a fact, and where the link goes is the owner's choice. See [x-algorithm](x-algorithm.md), Claims this file overrules.
- **A reply window on X.** The article gives 30 minutes of replying after posting as an algorithm advantage. The files read name no such window. Not used.
- **Posting frequency and best hours.** The article gives counts and hours for every platform. The published X code names neither, and no source was given for the others. The cadence node holds the owner's own answer.
- **The one-quotation rule.** This skill quotes the article once, in [sources](sources.md). A draft may quote as many people as the brief supplies; the two rules are about different things.
- **SKILL.md says a draft is "ready for a person to publish".** A draft with a `confirm-open:` line is not ready until the owner settles the mark. This file is the more specific.

## Hand over

Write `CONTENT.md` beside the engine or the run, after the last gate run.

```md
# Content: <setup | run | review | tune>, <the engine or the idea>
Engine: <path>
Gold: <the example in examples/ this started from>
Samples: <how many, from where, supplied by whom>          (setup, tune)
Interview: <the questions asked and the answers, in the owner's words>          (setup)
Claim: <the one sentence>          (run)
Treatments: <platform> → <treatment> → <hook type>          (run)
Nodes changed: <node> → <what changed> → <the draft line that caused it>          (tune)
Gate: <the last line of content-check.mjs --gate, pasted>
Candidates: <each candidate line> → <why it stands, or the fix>
Open marks: <each [confirm], and who settles it>
Skipped: <platform> → <reason>
Platform facts: <each fact used> → <source> → <date checked>
Review: <the reviewer's list> → <your response>
Assumed: <what you took as given>
Not checked: <what the reply's last line says>
Posted: nothing. A person posts.
```

- Does `Gate:` hold the pasted last line from a run made after the last edit?
- Does `Not checked` say what the reply's last line says?
