---
title: loop
summary: Why not to automate a bad loop, the three loops (low trust, high trust, factory), the readiness check before wiring a trigger, and the outer loop of triggers.
---

# Don't automate a bad loop

Improve the loop before automating it. The pyramid changes what goes around the loop; only then is a trigger worth wiring.

| Loop | Around it | Where it stalls |
|---|---|---|
| Low trust | The agent writes slop, a person verifies it, issues are found, repeat | Most teams stop here: the person is the verifier, so output is capped by attention |
| High trust | The agent writes good code, the agent verifies it, issues are found, repeat | After the pyramid: the codebase, checks and verification do the catching |
| Factory | An automated trigger starts the high-trust loop | Trust is what lets it scale; on a low-trust loop it scales slop and bills tokens for it |

## Readiness before a trigger

Answer each from the repo. Automate only when all five are yes.

1. Do most agent PRs in the last two weeks merge without a person asking for a change? Count them.
2. Can an agent launch the app, drive the feature it changed and attach evidence, with no person helping? Show the command.
3. Do the checks run the same command locally and in CI, and has each recent one failed on a real past mistake?
4. Is the revert rate flat or falling while volume rises? Show the numbers from `git log`.
5. Is there a stop: a budget, a cap on open PRs, a way to switch the trigger off?

A no names the one thing to fix first. Fix it, then ask again.

## The outer loop

Once the inner loop verifies itself, triggers can start it: feedback in a channel, a ticket created, a new message, a schedule, a monitoring alert. Her team's example, from a talk that was partly a pitch for her employer's product: on each release a bot starts agents that use the app like a user (fuzzing the build), and each bug found becomes a fix the agents merge themselves. She says automerging those fixes is reasonable only because the framework's limits and the verification tools already apply to the repair path, so the PRs are good by default. Running more copies of a loop that writes slop multiplies the tokens spent repairing it.

Wiring a trigger, a schedule or a bot is an outward-facing change: it runs without anyone watching. Describe it and get the user's yes before setting one up.
