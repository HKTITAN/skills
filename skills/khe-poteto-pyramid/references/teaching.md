---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. Each bad half has one fault and is named for the gate line it raises.
---

# Teaching pairs

`teaching/` holds eleven pairs. Each folder is named for the gate line its `bad.md` raises, and holds the same record (or rules file) twice with one thing wrong in `bad.md`, named in a comment at the top. Use a pair to diagnose a fault in your own record; start new work from the gold in `examples/`, never from a bad half.

The pairs are the gate's tests: `node scripts/pyramid-check.mjs --self-test` checks that every `bad.md` raises its folder's line and no other never line, and that every `good.md` raises none.

## Placement records

| Failure | Look at | Correction |
|---|---|---|
| `teaching/once` | One bullet under `Seen:` | Find a second occurrence, or fix the one case in place. A layer is for a class |
| `teaching/skipped-higher` | A prose placement with a reason only for verification | Ask the codebase and static questions too, and write why each cannot hold it |
| `teaching/no-enforcer` | `Enforced by: the new folder layout` | Name the command that fails: `npm run lint:deps` |
| `teaching/prose-enforcer` | `Enforced by: a new rule in AGENTS.md` | That is the prose layer. Build the dependency rule |
| `teaching/mute-error` | `Error: "Import not allowed."` | Name what to use instead: the IPC call and its file |
| `teaching/never-failed` | `Proof: the rule is configured and CI is green` | Replay PR #412's head and paste the failure |
| `teaching/belt-and-braces` | `Prose: kept AGENTS.md line 14 as a reminder` | Delete it. The instruction is the symptom |
| `teaching/left-to-review` | `Layer: review`, "reviewers watch for imports" | The boundary and the import ban, at codebase + static |
| `teaching/no-unverified` | The last line, "Everything checked. Ready to merge." | `Not verified:` and the real gap: dynamic imports |

## Rules files

| Failure | Look at | Correction |
|---|---|---|
| `teaching/enforceable-prose` | "Never call `setTimeout` in product code…" as a bullet | A lint row in the rule table, and the bullet deleted |
| `teaching/unenforced-rule` | A rule-table row whose enforcer is a dash | The lint command in the enforcer column |
