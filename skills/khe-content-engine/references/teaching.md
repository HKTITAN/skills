---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds fifteen pairs. Each folder is named for the gate line its `bad.md` raises, and holds the same run or the same node twice with one thing wrong in `bad.md`. Every `bad.md` opens with a comment that names the fault; in a node it follows the frontmatter.

Use a pair to diagnose a fault in your own work: find the folder whose name matches the gate line you got, or whose bad half reads like your draft, then read why the good half works. The bad halves are never starting points. Start from the gold in `examples/`.

The pairs are also the gate's tests. `node scripts/content-check.mjs --self-test` checks that every `bad.md` raises the line its folder is named for and no other never-intentional line, and that every `good.md` raises none. The run pairs use the gold engine in `examples/engine/`.

## Runs: the facts

| Failure | Look at | Correction |
|---|---|---|
| `teaching/unmarked-number` | "That is 37% faster", arithmetic the brief never did | State the two figures the brief gives. A derived figure is the owner's to approve, marked `[confirm]`, or it is cut. |
| `teaching/unmarked-quote` | A client quotation written to fit the post | Delete it. The brief has the one thing the client said; a quotation nobody said is a fabricated testimonial. |
| `teaching/no-unverified` | The last line, "ready to post" | `Not verified:` and what nobody checked. A claim of readiness reads the same with or without the checking. |

## Runs: the treatment

| Failure | Look at | Correction |
|---|---|---|
| `teaching/pasted` | The LinkedIn draft: the X post under a new first line | Write it from the brief on its own treatment: how the thing was found out, and what it does not prove. |
| `teaching/same-hook` | Both drafts open with the same sentence | A second hook type from the hooks node. The newsletter opens with the instruction. |
| `teaching/same-treatment` | Two `Treatment:` lines that say the same thing | One treatment per platform, from the repurpose node. Two drafts with one treatment are one draft at two lengths. |
| `teaching/over-limit` | The X post, with the caveat packed in | Cut to the single claim. The caveat belongs to the LinkedIn treatment. |
| `teaching/missing-draft` | `Platforms:` asks for two and one draft exists | Write the draft, or name the platform on a `Skipped:` line with its reason. Never drop it silently. |

## Runs: the voice and the trace

| Failure | Look at | Correction |
|---|---|---|
| `teaching/tell` | "Let that sink in" where the instruction was | Give the instruction. The phrase stood in for a sentence with something in it. |
| `teaching/never-say` | "Pro tip" in front of her own line | Cut the label. The voice node lists it, with her reason. |
| `teaching/draft-no-nodes` | The LinkedIn draft has no `Nodes:` line | Name the nodes the draft used. Without them a wrong line has no cause anyone can change. |

## Nodes

| Failure | Look at | Correction |
|---|---|---|
| `teaching/voice-no-samples` | The Samples section: adjectives about her, nothing she wrote | Three quoted samples, each with its `Source:`. Traits are read off the samples, never the other way round. |
| `teaching/voice-no-never-say` | "Avoid jargon. Keep it friendly." | At least five phrases in quotation marks, each with its reason. A wish cannot be matched against a draft. |
| `teaching/platform-no-dated-facts` | A real limit and reach folklore, side by side, undated | `Facts checked:` with the date, each fact with its source, and the folklore under `Confirm before relying on this`. |
| `teaching/placeholder` | A bracketed blank where the audience should be | Ask the owner who they write for and write the answer. A blank writes for nobody. |

## Lines with no pair

`missing-node:`, `untyped-node:`, `broken-link:`, `orphan-node:`, `audience-no-segment:`, `platform-no-limit:`, `no-engine:`, `no-brief:`, `unknown-platform:`, `no-treatment:`, `unknown-node:` and every candidate line have no folder. The self-test proves each of the never-intentional ones on a broken copy of the gold engine or on the smallest run that raises it. Their meanings are in [verify](verify.md).
