---
title: teaching
summary: The bad/good pairs in teaching/, one row each. The same artifact twice with one thing wrong; used to diagnose a fault, never as a starting point.
tags: [teaching, pairs, diagnosis]
---

# Teaching pairs

`teaching/` holds fourteen folders. Each one is a small contract plus the same artifact twice, `bad.*` and `good.*`, with one thing wrong in the bad half. The folder is named for the gate line the bad half raises.

Use a pair to diagnose a fault in your own work: find the row that looks like your bug, open both halves side by side, and read why the good half works. Then fix yours the same way. The bad halves are never starting points; start from the closest gold in `examples/`. Run a pair through the gate to see its line: `node scripts/token-check.mjs teaching/raw-color` checks the two halves separately against the folder's contract.

The pairs are also the gate's tests. `node scripts/token-check.mjs --self-test` asserts that each bad half raises its folder's line and no other never-intentional line, and that each good half is clean.

## Literals in source

| Failure | Look at | Correction |
|---|---|---|
| A color the contract never defined (`teaching/raw-color`) | The note's `color` in `bad.css`: `#6b7280` | Bind the nearest role the contract has. A quieter gray is a proposal to the contract, never a hex in the component |
| A font the contract never defined (`teaching/raw-font`) | `font-family: Inter` on the card; the DESIGN.md defines Public Sans | The family comes from the typography token, so a change in the contract reaches the card |
| A radius typed beside its token (`teaching/literal-beside-token-radius`) | `border-radius: 8px` on the action; `radius.md` is 8 | Bind `radius.md`. The value lives in one place |
| A duration typed beside its token (`teaching/literal-beside-token-duration`) | `400ms` in the transition; `motion.duration.base` is 400ms | Bind the duration token. The contract's 400ms is used, and never repeated |
| A font size typed in a utility class (`teaching/literal-beside-token-font-size`) | `text-[16px]` in `bad.tsx`; `typography.body-md` is 16 | Use the theme's own utility for the token. A bracketed value is a literal in the project's own system |
| A radius between two steps (`teaching/off-scale`) | `border-radius: 6px`; the scale is 4, 8, 16 | Take the step the role gets. A 6px step is a proposal. This line is a candidate: the gate reports it and a person judges it |

## Names nothing defines

| Failure | Look at | Correction |
|---|---|---|
| A token that looks real (`teaching/unknown-token`) | `var(--radius-xl)` on the card; the scale stops at `lg` | Bind the last step the contract defines. Never declare the missing one locally |
| An invented variant (`teaching/unknown-variant`) | `variant="outline"` in `bad.tsx`; the contract lists three | Use the listed variant the `when` rule points at. A fourth is a contract change with approval |

## The mirror and the contract

| Failure | Look at | Correction |
|---|---|---|
| CSS that drifted from the contract (`teaching/stale-mirror`) | `--radius-lg: 12px` in `bad.css`; the contract says 16 | Report the drift, then refresh the CSS from the contract. Tokens outrank what `:root` held |
| A contract missing a required field (`teaching/contract-invalid`) | `bad.design` has no `agent.instructions` | Report it and propose the block. The file must work where no skill is installed |
| Two contracts and no order (`teaching/two-contracts`) | `bad.md` beside `tally.design`: neither names the other | One sentence in the DESIGN.md: it is rationale, the `.design` is the contract |
| History inside the contract (`teaching/in-file-changelog`) | The `proposed_changes` block at the foot of `bad.design` | Edit in place and bump `version`. Git is the audit trail |

## Design-system docs

| Failure | Look at | Correction |
|---|---|---|
| A variant list left open (`teaching/open-variant-set`) | The `Variants:` line in `bad.md` ends after the third name | End it with "Nothing else exists", so an invented variant reads as a bug |
| A hedge where a number belongs (`teaching/hedge-word`) | "Use the primary variant sparingly" in `bad.md` | The number and its reason: one `primary` per view, because two means the screen has no hierarchy |
