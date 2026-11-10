---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds fourteen pairs. Each folder is named for the gate line its `bad` file raises, and holds the same reply or the same playbook twice with one thing wrong in `bad`. The first line of every `bad` file is a comment that names the fault.

Use a pair to diagnose a fault in your own reply: find the folder whose name matches the gate line you got, or whose bad half reads like your reply, then read why the good half works. The bad halves are never starting points. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/route-check.mjs --self-test` checks that every `bad` raises the line its folder is named for and no other never-intentional line, and that every `good` raises none.

## Replies: the route

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-goal` | The first line, a pleasantry | Open with `Goal:`, what the user wants and what you hand back. The user reads one line and knows whether you understood. |
| `teaching/too-many-skills` | Four route lines for one logo | Keep the one skill that owns the request. Name the next job as its own request. Four craft bars at once means none is met. |
| `teaching/unknown-skill` | A skill name invented to fit a backend problem | `Route: none`. The tables are the whole collection. A name that sounds right is still not a skill. |
| `teaching/no-reason` | A skill with nothing after its name | `<name>: <why it owns this>`. A route with no reason cannot be checked against its table row. |
| `teaching/two-playbooks` | Two playbooks on one Route line | One playbook. The second job is a second request, started after the first is handed over. |

## Replies: the order

| Failure | Look at | Correction |
|---|---|---|
| `teaching/contract-not-first` | The contract listed second | `khe-design-tokens` first. A value chosen before the contract is read gets chosen again. |
| `teaching/sound-before-picture` | Sound listed before the film | Film first, to a locked picture. A cue is placed on a frame, and a frame that moves takes the cue with it. |

## Replies: the evidence

| Failure | Look at | Correction |
|---|---|---|
| `teaching/router-value` | A duration and a curve inside the route line | The route says why the skill owns the job. Values come from the skill's reference, inside the work. |
| `teaching/no-install-line` | "Not installed", then a shrug | Whose it is, the install line, and a stop. The reader can act on a command. |
| `teaching/no-unverified` | The last line, a claim of success | `Not verified:` and the one thing nobody looked at. A reply that hides it reads the same as one with nothing to hide. |

## Playbooks

| Failure | Look at | Correction |
|---|---|---|
| `teaching/step-no-exit` | Step 2, which ends without an exit | Say what can be looked at when the step is done. A step with no exit is never finished and never failed. |
| `teaching/step-no-gate` | Step 1, which makes a file and names no gate | `Gate:` and the script of the skill that did the step, or `none` and why. |
| `teaching/gate-mismatch` | Step 2, done by one skill and checked by another's gate | The gate of the skill named in the step. Another skill's gate checks for other faults and passes work it cannot read. |
| `teaching/no-reply` | The last paragraph | End with `**Reply:**` and what the reply must contain, the unverified part included. |

## Lines with no pair

`no-route:`, `unknown-playbook:`, `unknown-gate:`, `no-ownership:`, `no-steps:`, `step-no-skill:`, `step-too-many:` and every candidate line have no folder. The self-test proves each of them on the smallest text that raises it. Their meanings are in [verify](verify.md).
