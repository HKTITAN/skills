---
title: verify
summary: The last pass on a routing reply or a playbook. The gate first, then yes/no questions answered from the reply and the gate output, never from memory of what was meant.
---

# Verify

The last pass. Every answer comes from the reply as it will be sent, the request as the user typed it, and gate output you ran after the last edit. Never answer from what you meant to write. Fix the largest fault first, run the gate again, and return to the top until every answer is yes. The rules are in SKILL.md (Non-negotiables, Overlaps, Never ship) and in [loop](loop.md).

## Gate

Save the reply as a `.txt` file and run, from the folder that holds the skills:

```sh
node khe-auto/scripts/route-check.mjs reply.txt --gate
node khe-auto/scripts/route-check.mjs khe-auto/playbooks --gate
node khe-auto/scripts/route-check.mjs --self-test
node khe-auto/scripts/gate-all.mjs
```

- The first command ends `route-check passed`? That means every never-intentional line is at 0 for that reply. It does not mean the route is right.
- After editing a playbook, the second command ends `route-check passed`?
- After editing the Design table, the Code table or the gate, the third command ends `self-test passed`?
- Every skill the reply used: did its own gate run on what that skill produced, after the last edit, and is its last line pasted in that skill's handover file?
- `gate-all.mjs` prints one line per skill. A `no gate` or `not installed` line beside a skill the reply used is named in the reply's last line?

Exit 0 is a pass. Exit 1 is a never-intentional line above zero. Exit 2 is `inconclusive`: the gate could not look, and nothing is verified.

## The route (first, because nothing after it matters if this is wrong)

- Read the user's request, then only the Goal line. Would the user say "yes, that is what I asked for"?
- Does the Goal line name the result that comes back, not just the topic?
- Is the request a whole job with a playbook? Then the route is that playbook and no other.
- For each skill in the route: open its row in its domain table. Does the job in that row describe this request?
- Were two skills close? Find the pair in Overlaps. Does the request answer that pair's question the way the route went?
- Does any skill in the route have to stretch to cover the request? Then the answer is "nothing fits".
- Two skills at most, and each one has a reason a stranger could disagree with?

## The order

- Does the project have a `.design` file or a DESIGN.md? Then `khe-design-tokens` is first.
- Did the second skill start only after you looked at what the first one produced?
- In a playbook: were the steps run in the file's order, and is every reopened step named as reopened?
- When a later step exposed an earlier fault: was it fixed at the earlier step, and did every later step run again?
- Sound on a film: was the picture locked before the first cue was placed?

## The evidence

- Every value in the Work section: can you name the reference file in the owning skill it came from?
- Every exit a playbook step names: what did you look at to call it met?
- Every gate named in the reply: did it run on the file that ships, and after the last edit?
- A skill that was not installed: is the reply free of any rule or value of that skill?
- A candidate line you left standing: is the reason written in `ROUTE.md`?

## The reply (last)

- Four parts in order: Goal, Route, Work, Not verified? For `which <job>`: Goal, Route, Not verified, and no work.
- Is the Not verified line specific enough that the user could go and check that one thing?
- Does the reply name every skill that is someone else's with its author?
- Is anything said twice, or said that the user did not ask about?

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. `--gate` ends `route-check passed` only when all are at 0. Clearing a line by deleting the sentence it points at, when the fault behind the sentence is still there, is a bug: a route with three skills does not become a route with two by leaving the third unnamed and using it anyway.

| Line | What it means |
|---|---|
| `no-goal:` | The first line is not `Goal:` followed by what the user wants and what comes back. |
| `no-route:` | There is no `Route:` line, or it names no skill, no playbook and not `none`. |
| `too-many-skills:` | More than two skills in a route that is not a playbook. |
| `unknown-skill:` | A skill named that has no row in its domain table. |
| `unknown-playbook:` | A playbook named that has no file in `playbooks/`. |
| `two-playbooks:` | More than one playbook loaded for one request. |
| `no-reason:` | A skill in the route with nothing after its name. |
| `router-value:` | A duration, a size, a loudness, a rate, a percentage or a curve written inside the route. |
| `contract-not-first:` | `khe-design-tokens` is in the route and another skill runs before it. |
| `sound-before-picture:` | `khe-sound` is ordered before `khe-launch-film`. |
| `no-install-line:` | A skill is called not installed and no `npx skills add <repo> --skill <name>` line follows, or the repo is the wrong author's. |
| `no-unverified:` | The last line is not `Not verified:` followed by what was not checked. |
| `no-ownership:` | A playbook whose first paragraph does not start with its bold "You own this" sentence. |
| `no-steps:` | A playbook with no numbered steps. |
| `step-no-skill:` | A step that names no skill from the tables. |
| `step-too-many:` | A step that names more than two skills. |
| `step-no-exit:` | A step with no `Exit:`. |
| `step-no-gate:` | A step with no `Gate:`, or a `Gate:` that names neither a gate script nor `none` with a reason. |
| `gate-mismatch:` | A step checked by the gate of a skill the step never names. |
| `unknown-gate:` | A `*-check.mjs` script named that is not one of the seven gates. |
| `no-reply:` | A playbook whose last paragraph is not its `**Reply:**`. |

## Candidate lines

Reported for judgment. Look at each one. If it stands, write why in `ROUTE.md`. `--strict` fails on these too.

| Line | What it means | When it stands |
|---|---|---|
| `goal-asks:` | The Goal line ends in a question mark. | Never for a request that can be started. Only when the request cannot be routed without the answer. |
| `no-owner:` | A route line for a linked skill that does not name its author. | When the author is named elsewhere in the same reply. |
| `no-gate-line:` | The reply has work from a skill that ships a gate, and no gate result. | When the reply says the gate is missing or inconclusive. |
| `verified-everything:` | The Not verified line claims nothing was left. | Almost never. A reply with no work has verified nothing. |
| `off-playbook:` | A skill in a playbook route that the playbook never names. | When the playbook's own prose sends the job there, and the reply says which sentence. |
| `gate-skipped:` | A step uses a skill that ships a gate and says `Gate: none`. | For a decision step: whether to draw, which register, which engine, which moments. |
| `reply-no-unverified:` | A playbook Reply that never asks for what was not verified. | Never in this skill's own playbooks. |
| `no-loop:` | A playbook that never points at `references/loop.md`. | Never in this skill's own playbooks. |

The nine playbooks shipped here raise `gate-skipped:` seven times. All seven are decision steps and stand.

## What you see, what you do

| You see | You do |
|---|---|
| The reply opens with "Sure" or a summary of the request (`no-goal:`) | Delete it. First line: `Goal:` with what the user wants and what you hand back |
| Three or four skills in the route (`too-many-skills:`) | Find the playbook that orders them. If none fits, keep the one or two that own the request and name the rest as a next request |
| A skill name you cannot find in the tables (`unknown-skill:`) | It does not exist here. Route to the skill whose row fits, or to `none` |
| A skill listed with no reason (`no-reason:`) | Write the reason from its table row. If you cannot, the skill does not own the request |
| "200ms", "ease-out", a loudness or a size in the route (`router-value:`) | Delete the value. Load the owning skill and take it from the reference, inside the work |
| The contract is second in the route (`contract-not-first:`) | Put `khe-design-tokens` first and run the other skill again on what it produced |
| Sound is routed before the film (`sound-before-picture:`) | Film first, to a locked picture. Then sound |
| "It is not installed" and nothing else (`no-install-line:`) | Add whose it is and the install line. Stop that step. Rebuild nothing |
| The reply ends "Done" (`no-unverified:`) | Last line: `Not verified:` and the one thing a person must still check |
| Two playbooks named (`two-playbooks:`) | Run the one the request is about. The other is a second request |
| A playbook step with no exit (`step-no-exit:`) | Write what can be looked at when the step is done. If nothing can, the step is part of its neighbor |
| A step checked by another skill's gate (`gate-mismatch:`) | Use the gate of the skill that did the step, from the table in [loop](loop.md) |
| A sibling gate prints `inconclusive` | Read its reason, give it what it needs, run again. Still inconclusive: the step is unverified, and the reply says so |
| `gate-all.mjs` prints `no gate` or `not installed` for a skill you used | No gate was run for that skill. Say so in `ROUTE.md` and in the Not verified line |
| The gate passes and the route still feels wrong | The gate never saw the request. Ask the first question in [review](review.md) |
| The same route landed wrong a second time | One line in [gotchas](gotchas.md). Then fix the table row or the overlap that sent it there |
| A gate line you think is intentional | Look again. If it is a never-intentional line, it is not. If it is a candidate, write why in `ROUTE.md` |
| Ten gate runs, gate green, nothing changing | Stop. Fresh eye, by [review](review.md) |

## Not checked by the gate

The gate reads text. It never sees the request, the work or the result.

- Whether the route is the right one for the request.
- Whether a skill was stretched over a problem it does not own.
- Whether the work followed the skill's rules. That is the skill's own gate.
- Whether a gate named in the reply was run, and what it printed.
- Whether a value in the Work section came from a reference or from memory.
- Whether an exit was checked from evidence.
- A `list` reply: it is three tables and has no route.

This skill's files agree with each other and with the gate: a reply is `Goal:`, `Route:`, `Work:` and `Not verified:`, and a `which <job>` reply is the same without `Work:`. To overrule a routing call, write it in [pov](pov.md).

## Hand over

Write `ROUTE.md` beside the work, after the last gate run. Each skill that ran also writes its own handover file from its own template.

```md
# Route: <the request, in the user's words>
Goal: <the Goal line, pasted>
Route: <the playbook, or the one or two skills, in run order>
Gold: <the example in examples/ this reply started from>
Gate: <the last line of route-check.mjs --gate on the reply, pasted>
Skill gates: <skill> → <its gate> → <its last line, pasted> (one per skill that ran)
Candidates: <each candidate line> → <why it stands, or the fix>
Reopened: <each step that was reopened, and the later steps run again>
Review: <the reviewer's list> → <your response>
Assumptions:
Unresolved:
Not checked:
```

- Is every skill that ran listed under Skill gates, with `no gate`, `not installed` or `inconclusive` written where that is the truth?
- Does Not checked say what the reply's last line says?
