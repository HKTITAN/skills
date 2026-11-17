---
title: audit
summary: The ten questions, two per layer, answered from evidence; how to score each layer; and the order to start in.
---

# Audit

Two questions per layer. Answer each from the repo with the evidence named, never from the user's description: what people believe about their repo is the thing being audited.

| Layer | Question | Evidence |
|---|---|---|
| codebase | Could an agent tell where a new feature belongs from the folder names alone? | The top two levels of the source tree; whether boundaries (process, client and server, feature) are folders |
| codebase | Have the APIs agents keep misusing been removed or fenced into one place? | `git grep -c` for the API across product folders; whether a replacement exists |
| static | Did the last repeated correction become a lint, a type or a CI check? | The last two review comments that repeat; whether a check for each exists |
| static | Do the lint errors say what to use instead? | Read the messages of the custom rules in the lint config |
| verification | Can an agent launch the app and exercise a feature without a person? | A verification skill or script in the repo; run its doctor or launch command |
| verification | Do changes arrive with evidence: a video, screenshots or a test run? | The last ten merged PRs that change behavior |
| prose | Is the rules file mostly judgment calls, not rules a tool could enforce? | `node scripts/pyramid-check.mjs AGENTS.md` and its `enforceable-prose` count |
| prose | Are agents stopped from adding comments and markdown nobody asked for? | A comment lint; new `.md` files in the last month's agent PRs |
| review | When review catches the same thing twice, does it become a check? | Repeated review comments against the rule table; whether the gating rules live where the change cannot edit them |
| review | Does review time go to evidence and to what landed, not to reading every line? | How review comments split between diffs and evidence, and who merges agent PRs |

## Score

Per layer: 2 yes is solid, 1 is partial, 0 is missing. Report one line per layer, and name the lowest layer with a no from the top: that is where the work is, because the layers below lean on it.

Review the reviewers on what mattered: how many merged changes were reverted, how many a maintainer rejected before merge, and a size-matched set of changes that stayed clean as the control. Measure recall at each stage (raw findings, after verification, the final review) so a stage that drops bugs it had shows up, and stop tuning where the next gain would be fitting the eval instead of catching bugs.

## Where to start

In this order, from her closing advice:

1. **Correct by improving the codebase first.** Try the code before anywhere else.
2. **Start with a lint rule.** Stop new occurrences, then clean up the old.
3. **Make the verification story strong.** An agent that can run the app and prove the change.
4. **Then automate**, by the readiness check in [loop](loop.md). An inner loop that produces slop, automated, produces more slop.

Phrase each of the first three changes as a `place` job ("place: renderer imports main"), so the user can start one with a word.
