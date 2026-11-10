---
title: verify
summary: The last pass. The gate's commands and lines, yes/no questions answered from evidence, a symptom-to-fix table, what the gate cannot see, and the TOKENS.md handover template.
tags: [verify, gate, drift, handover]
---

# Verify

The last pass. Every answer comes from evidence you looked at: the gate's output, a grep, the contract open beside the file, a render. Never from the code you remember writing. Fix the largest fault first, run the gate again, return to the top, and repeat until every answer is yes. The rules behind the questions are in [using-design-file](using-design-file.md), [using-design-md](using-design-md.md) and [design-system-docs](design-system-docs.md).

## Gate

```bash
node scripts/token-check.mjs <contract folder or files> --gate
node scripts/token-check.mjs <path> --gate --report token-report.json
node scripts/token-check.mjs --self-test
```

- The gate takes a contract (a `.design` or `<name>.design` file, or a DESIGN.md with token front matter) and source (`.css`, `.html`, `.jsx`, `.tsx`, and `.md` doc pages). The contract for a file is the nearest one walking up from it; at each folder the gate also looks in `docs/`, `design/` and `.design/` for a DESIGN.md.
- "Passed" means the last line reads `token-check passed` and the exit code is 0: every never-intentional line is at 0 for the files it was given. It says nothing about files it was not given.
- Exit 1: at least one never-intentional line. Exit 2 and `inconclusive`: no input, no contract, a contract it could not read, a contract with no tokens, or no source beside the contract. Inconclusive is never a pass. With no contract, say so and offer to bootstrap one.
- `--strict` makes candidates fail the gate too. Use it once every candidate has an answer.
- Passing is necessary, not sufficient. The gate reads text. It does not know which role a token belongs to.

Run it on the contract folder, not on one file: an unused token and an undefined `var()` only show against the whole source.

## Contract (first, because nothing else is checkable without it)

- Did you find the contract by walking up from the edited file, and is it the nearest one?
- If a `.design` and a DESIGN.md both exist, does one of them say the `.design` is the contract? (`two-contracts:`)
- Does the contract pass its own required fields? (`contract-invalid:`)
- Did you read `agent.instructions`, `intent`, `constraints` and `policy` before `tokens`?
- Is the contract unchanged by you, or changed with a yes and `version` bumped? Answer from the diff.
- Is every path in `locked` untouched? Answer from the diff.

## Binding

- Does the gate print 0 for `raw-color:`, `raw-font:` and `literal-beside-token:`?
- Open three bound values at random beside the contract. Is each token the right role, and not only the right value? A card on the accent because the accent matched a mockup is a fail.
- Does the accent, or whatever `intent.signature` names, appear only where the contract allows it? Count the places.
- Is every `var(--x)` defined by the contract or by the mirror? (`unknown-token:`)
- Is every variant in the code in the contract's list? (`unknown-variant:`)
- For each `off-scale:` line, did you bind the nearest step or raise a proposal? A literal left in place has a reason in TOKENS.md.
- Is the fix written in the project's own styling system? A `style` attribute in a utility-class project is a fail even when the value is right.

## Mirror and drift

- Does every custom property named for a token hold the contract's value? (`stale-mirror:`)
- Did you report drift before fixing it, one line per token as `added`, `removed` or `modified`, with a `regression` flag?
- After a token edit, was the CSS refreshed from the contract, never the reverse?
- For each `unused-token:` line, is the token used in a file the gate was not given, or is it dead? Say which.
- Did you render once per color scheme the contract defines? A light pass does not prove dark.

## Docs (only when you wrote or repaired them)

- Does every name in the docs trace to a file and a line? Open two and check.
- Is every variant list closed, with its default named? (`open-variant-set:`, `no-default:`)
- Does every component have one correct and one incorrect example from real code? (`no-example:`)
- Does the gate print 0 for `hedge-word:`?
- Did you prompt one real screen against the docs and read the drift? If the screen drifted, did you fix the docs and not only the screen?

## Lines that are never intentional

The gate fails on any of these. None is a judgment call. Clearing one by deleting the comparison (removing the token from the contract, moving the value into a variable the gate cannot follow, taking the file out of the run) is a bug, not a fix.

| Line | What it means |
|---|---|
| `raw-color:` | A hex, `rgb()`, `hsl()`, `oklch()` or named color in source that is not a token in the contract |
| `raw-font:` | A font family in source that the contract does not define |
| `literal-beside-token:` | A color, radius, spacing, font size, duration or curve typed as a literal when a token holds that exact value |
| `unknown-token:` | A `var(--x)` that neither the contract nor the checked source defines, a `--x` a doc page names that nothing defines, or a `{token.ref}` in the contract's components that resolves to nothing |
| `unknown-variant:` | A `variant` in JSX, or a variant listed in a doc page, that the contract's component does not list |
| `stale-mirror:` | A custom property named for a token and holding a different value: the CSS drifted from the contract |
| `contract-invalid:` | A `.design` without `schema: design.v1`, `name`, `version` or `agent.instructions`; a DESIGN.md without front matter or `version`; an `extends` that points nowhere |
| `two-contracts:` | A `.design` and a DESIGN.md side by side where neither names the other, or several `.design` files and none named `.design` |
| `in-file-changelog:` | `proposed_changes` or `changelog` inside a `.design` |
| `open-variant-set:` | A `Variants:` line in a doc page that does not end the set with "Nothing else exists" |
| `hedge-word:` | "sparingly", "reasonably", "tasteful", "where appropriate", "try to" or "consider" in a doc page, outside quotes and code |

## Candidate lines

The gate reports these and does not fail on them. Each one gets a one-line answer in TOKENS.md: fixed, or why it stands.

| Line | What it means | The usual answer |
|---|---|---|
| `unused-token:` | A contract token no checked source uses | Used in a file outside the run: name it. Dead: report it, never delete it from the contract yourself |
| `off-scale:` | A literal of a kind the contract has a scale for, on no step of it (6px against 4 / 8 / 16) | Bind the nearest step, or propose the missing token |
| `local-token:` | A custom property declared in source with a length or time the contract does not define | Bind a token, or propose one; a layout constant stays and is named in TOKENS.md |
| `noted-literal:` | A literal with a `token-missing:` comment, in a project whose `policy.if_missing` is `invent_with_note` | It stands until the contract gains the token; list it under Unresolved |
| `contracts-differ:` | A color in the DESIGN.md that no color in the `.design` beside it holds | Offer to converge the two; the `.design` wins meanwhile |
| `no-default:` | A documented variant list with no `(default)` | Read the component's default prop and name it |
| `no-example:` | A documented component with no `Correct:` and `Incorrect:` pair | Take both from real call sites |

## What you see, what you do

| You see | You do |
|---|---|
| `raw-color:` on a gray the contract never defined | Bind the nearest role the contract has. If none fits, follow `policy.if_missing`; under DESIGN.md, write a proposal comment. Never keep the hex |
| `raw-color:` on a shadow's `rgba()` | Bind the elevation token. If the contract has no elevation group, report it as a missing token |
| `literal-beside-token:` on `8px` | Replace the literal with the token the line names |
| `literal-beside-token:` on a hex that equals the accent | Check the role first. If this is not the primary action, the right fix is a different token, not `var(--accent)` |
| `off-scale:` on `border-radius: 6px` | Bind the step for the role: card large, field and button middle, menu item small. Raise 6px as a proposal only if a role truly lacks a step |
| `unknown-token:` on `var(--radius-xl)` | The scale ends where the contract ends. Bind the last step, or propose the new one; never declare it locally |
| `unknown-variant:` on `variant="outline"` | Use the listed variant the `when` rule points at. A new variant is a contract change with approval |
| `stale-mirror:` on `--radius-lg` | Report it first as `tokens.radius  modified  lg 10px -> 12px in app/globals.css  regression: yes`. Then refresh the CSS from the contract; change the contract only when asked |
| `two-contracts:` | Add one sentence to the DESIGN.md: it is rationale, the `.design` is the contract. Offer to converge them |
| `contract-invalid:` on a missing `agent.instructions` | Stop. Report it. The contract is theirs: propose the block, never write it in silently |
| `in-file-changelog:` | Propose removing the block; the edit goes in place with `version` bumped, and git holds the history |
| `open-variant-set:` or an agent that invented a variant | Close the set in the docs with "Nothing else exists", and tighten the union type |
| `hedge-word:` on "use sparingly" | Replace it with the number and its reason: "One `primary` per view: two means the screen has no hierarchy" |
| `unused-token:` on half the contract | You ran the gate on one file. Run it on the folder |
| `token-check inconclusive: no contract found` | Say there is no contract. Scan the code for the system in use and offer to bootstrap one |
| The gate passes and one control still looks foreign | Read the contract and the control's real neighbor's computed styles again. Never nudge by eye |
| A gate line you think is intentional | Look again. If it still stands, say so in TOKENS.md with the file and line. Never clear it by hiding the value |
| Ten runs, gate green, nothing changing | Stop. Call the fresh-eye review in [review](review.md) |

## Not checked by the gate

- Whether a token is bound to the right role. A surface token on a border passes.
- Utility classes resolved through a Tailwind theme, beyond arbitrary values in `[brackets]`. A custom property declared in an `@theme` block counts as used.
- Values built at runtime, passed through props, or held in JS variables.
- Themed overrides inside dark, light or `data-theme` blocks. The gate counts them and says so.
- Contrast, the rendered result, and whether the screen matches the product's existing screens.
- Whether a `locked` path was edited or `version` was bumped. That needs the diff.
- `voice`, `decisions`, `when` and `when_not` in the contract.
- Whether a doc page is true to the code beyond its variant names.
- Any file that is not `.css`, `.html`, `.htm`, `.jsx`, `.tsx` or `.md`.
- The DESIGN.md linter's own rules (contrast, section order). Run `npx -y @google/design.md lint DESIGN.md` for those.

How the gate reads names: a custom property counts as a token when its name is the token's path joined with hyphens, with or without the group (`--color-accent` or `--accent` for `color.accent`, `--radius-lg` or `--rounded-lg` for the radius scale, `--text-body` and `--font-body` for a typography entry), or when it is declared with a token's exact value. A project with a different naming rule shows up as `local-token:` and `unused-token:` candidates, never as a silent pass.

How precedence counts as stated: either file names the other. The gate cannot read whether the sentence is true.

## Settled values

The references, the gold examples and the gate state one value for each decision; to overrule one, write it in [pov](pov.md).

## Hand over

Write `TOKENS.md` beside the contract. The gold one is `examples/design-file/TOKENS.md`.

```md
# Tokens: <target>

Contract: <file>, version <n>; <the other file, and that it is rationale, or "none">
Gold: <the example you started from> (what you kept, what you changed)
Checked: <the folders and files the gate was given>
Gate: <the last line of token-check.mjs --gate, pasted>

## Token map

| Token | Lands in | As |
|---|---|---|
| <path> | <file:line> | <var, utility or prop> |

## Drift

<one line per token: group  added|removed|modified  detail  regression: yes|no; or "none">

## Lines

<each gate line> -> <fixed, or why it stands with file:line>

## Literals left in place

<literal> at <file:line>: <the reason, and the missing token it stands for>

Review: <the reviewer's list> -> <your response>
Assumptions:
Unresolved:
Not checked:
```

Did you say what you did not check?
