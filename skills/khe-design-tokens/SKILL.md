---
name: khe-design-tokens
description: "Finds a project's design contract (a `.design` file or DESIGN.md), resolves which one wins, and threads its tokens through the UI as CSS variables, a Tailwind theme or component props. Also writes design-system docs an agent can follow and checks the contract for drift. Use when a repo has a `.design` or DESIGN.md, or someone says \"use our tokens\", \"make it on-brand\", \"stop hardcoding colors\", \"the agent keeps inventing variants\" or \"document our design system\". To design the scales themselves use `emil-design-eng` or `emil-design-eng`; to check no stale literal survived use `emil-design-eng`; for a screen that still feels unfinished use `emil-design-eng`."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# Design tokens

You own the contract from finding it to a UI where every value resolves to a token. An agent that invents a color beside an existing token has failed the job.

A construction skill. It does ONE thing: make the UI obey the project's own design contract, and write the docs that keep an agent obeying it. It does not design a palette, a contrast pair or a type scale (that's `emil-design-eng` and `emil-design-eng`), review the result for stale literals (that's `emil-design-eng`), or finish a screen whose tokens are right and which still feels flat (that's `emil-design-eng`).

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready to find your design contract and thread its tokens through the UI. Usage: `/khe-design-tokens [target]`

Then wait. Give nothing else until the user asks.

## Operating posture

You are an implementer bound by someone else's contract: the tokens are theirs, and your job is to land them without drift.

Two failure modes, and the first is worse:

1. **An untracked system.** A raw hex beside a token, a 6px radius because it "looked like" the button, a documented variant that does not exist. Each one is a guess that looks exactly like a decision.
2. **Treating the contract as the whole job.** A contract that pins colours and radii says nothing about a flashing spinner or an exit duration. Silence is not permission to default.

When you disagree with the contract, raise it once in prose, then comply.

## Hard rules

1. **The contract outranks this skill.** The order is the user's prompt, the nearest `.design`, this skill, model defaults. If the contract sets a base duration of 400ms, use 400ms.
2. **`.design` beats DESIGN.md.** When both exist, the `.design` is the contract and DESIGN.md is rationale. Offer to converge them, because two sources drift apart.
3. **Bind by role, never by a value that looks close.** No raw hex, spacing or radius where a token exists. Grep the output for literals and name the missing token behind every survivor.
4. **Never edit a contract silently.** A DESIGN.md change is a proposal with human approval. A `.design` edit is made in place with `version` bumped, and any path in `locked` needs a yes first. Drift is reported before it is fixed.
5. **No contract: say so and offer to bootstrap.** Scan the code for the system it already uses. Never invent one without saying so.
6. **Write docs from an inventory of the code.** Every name in the docs traces to a file and a line. A documented variant that does not exist is worse than an undocumented one that does.

**Write in the project's own system.** Before editing, read how the project styles things: utility classes, CSS modules or CSS-in-JS, its tokens, its motion library. Express every fix in that system and reuse its tokens. A correct value written in a second styling system is a defect, because the next person now maintains two.

Aliases: `contract`, `apply-design-md`. **Posture: build.**

## Steps

1. **Find the contract, nearest first.** Walk up from the edited file for a `.design` / `*.design` and resolve `extends`. Then look for `DESIGN.md` at the root, in `docs/` or in `design/`. If both exist, the `.design` is the contract and DESIGN.md is rationale. In a video project the order is `frame.md` → `design.md` → `DESIGN.md`.
2. Read [using-design-file](references/using-design-file.md) (or [using-design-md](references/using-design-md.md)) and [pov](references/pov.md).
3. For a `.design`, read the normative core before generating anything: `agent.instructions` → `intent` → `constraints` → `policy` / `decisions` → `tokens` → `voice` → `components`.
4. Map the tokens onto the target (CSS variables, a Tailwind theme, or design-system props) and apply them. If `integrations.shadcn.enabled` is set, write `css_vars` into the declared CSS file; tokens outrank stale literals.
5. Precedence when sources disagree: the user's prompt → the contract → this skill → model defaults. Tokens and structured rules are normative; rationale and prose are context.

## No contract

Say so, scan the code for the system it already uses, and offer to bootstrap one: a starter from the [AgentsORG/DESIGN examples](https://github.com/AgentsORG/DESIGN/tree/main/examples), or a DESIGN.md scaffolded per [using-design-md](references/using-design-md.md). Never invent an untracked system silently.

## Output

The token map (token → where it lands), the edits, and any literal you left in place along with the reason.

## Hand-offs

- No contract and no settled look to bootstrap from → cmd small `options` first.
- Tokens threaded and the screen still feels unfinished → `emil-design-eng`.
- Check that no stale literal survived the change → `emil-design-eng`.

## Find the reference

Open a reference only when the job needs it. Never load the whole folder.

| Job or symptom | Open |
|---|---|
| A `.design` or `<name>.DESIGN` file exists; which contract wins; a drift check; shadcn `css_vars`; sound or video tokens | [using-design-file](references/using-design-file.md) |
| Only a DESIGN.md exists; linting it; proposing a missing token | [using-design-md](references/using-design-md.md) |
| Writing or repairing design-system docs; an agent keeps hardcoding colours, inventing variants or picking the wrong component | [design-system-docs](references/design-system-docs.md) |

## Never ship

Check the work against this table before finishing.

| Never | Instead |
|---|---|
| `border-radius: 6px` when the scale defines 4 / 8 / 16 | The scale token, such as `var(--rounded-lg)` |
| `font: 14px/1.5 Inter` when the file defines Public Sans 16/1.6 | The typography token |
| A raw hex where a token exists | A token reference; every surviving literal reported with its reason |
| A missing token filled with a literal | A proposal comment for DESIGN.md; `policy.if_missing` (`ask`, `nearest` or `invent_with_note`) for a `.design` |
| A silent rewrite of DESIGN.md | A proposal in a review or PR comment, applied after approval |
| `proposed_changes` or a changelog inside the `.design` | The YAML edited in place with `version` bumped; git is the audit trail |
| Stale `css_vars` literals trusted in `:root` | The CSS refreshed after token edits; tokens outrank them |
| A sound added when the contract has no `tokens.sound` | Silence; an absent group means silent |
| An unknown DESIGN.md field flagged as an error | The field passed through unchanged; the spec is `version: alpha` |
| Docs written from memory | An inventory of tokens, component unions and two or three real call sites |
| "Use small text sparingly" in the docs | "Body 16px, captions 14px, never below 12px" |
| An open variant list | "Variants: `primary`, `secondary`, `danger`. Nothing else exists." |

## Tone

Deferential to the contract and strict about literals. Say "there is no contract here" when there is none, and say "the contract sets 400ms; I would pick under 300ms; using 400ms" when the two disagree. Report every literal left in place with its reason.

## Yours to edit

Read both before producing anything. They outrank the defaults in this skill, and a project's `.design` contract or DESIGN.md outranks them.

- [gotchas](references/gotchas.md): lived failures, one line each. Append one when something goes wrong.
- [pov](references/pov.md): your taste calls.

## Pairs with

Where the text above names a reference in another skill, that skill owns the detail.

- `emil-design-eng`: the contract is silent on a scale, a contrast pair or dark mode, and that gap needs its rules.
- `emil-design-eng`: after tokens are threaded, its checklist confirms no stale literal survived.
- `emil-design-eng`: the tokens are right and the screen still feels unfinished.

Names without the `khe-` prefix are other people's skills, not part of this one: `stageshow` is Benji Taylor's ([benjitaylor/skills](https://github.com/benjitaylor/skills)); `animate`, `emil-design-eng` and the rest are Emil Kowalski's ([emilkowalski/skills](https://github.com/emilkowalski/skills)). Install them from their own repos.

— Harshit Khemani. MIT.
