# khe-design-tokens

Find the .design file or DESIGN.md and thread its tokens through the UI.

```bash
npx skills add HKTITAN/skills --skill khe-design-tokens
```

## What it does

- Finds the nearest `.design` or DESIGN.md and resolves which one wins.
- Maps each token onto CSS variables, a Tailwind theme or component props, and applies it.
- Reports the token map, the edits, and every literal left in place with its reason.
- Writes design-system docs with closed variant sets, then tests them by prompting.

## When to use it

Use it when a project ships a `.design` file or a DESIGN.md and generated UI should follow it, when an agent keeps hardcoding colours or inventing variants, or when a project wants a contract and has none. With no contract it says so, scans the code for the system already in use, and offers to bootstrap one.

## Invoke with

`/khe-design-tokens [target]`

Or describe the problem in your own words. The skill's description carries the triggers, so no special wording is needed.

## Before and after

Before: `.plan-card { background: #5b5bd6; border-radius: 6px; padding: 14px; }`

After: `.plan-card { background: var(--surface); border-radius: var(--radius-lg); padding: var(--space-4); }`

## Example prompts

- We have a DESIGN.md in the repo but the new settings page ignores it. Make it follow our tokens.
- The agent keeps inventing button variants that don't exist. Fix our design docs so it stops.
- Has our CSS drifted from the .design file? Tell me what changed before fixing anything.

## Verify

```bash
node scripts/token-check.mjs <contract folder> --gate
node scripts/token-check.mjs --self-test
```

The gate reads the contract (a `.design` file, YAML or JSON, or a DESIGN.md with token front matter) and the `.css`, `.html`, `.jsx`, `.tsx` and doc-page `.md` files under it, and prints each drift as a named line with its file and line number. It ends `token-check passed` only when every never-intentional line is at 0.

- It proves: no color or font the contract lacks, no literal typed beside a token of the same value, no `var()` or variant nothing defines, no custom property that drifted from the contract, a contract that passes its own required fields, and doc pages with closed variant sets and no hedge words.
- It does not prove: that a token sits on the right role, that the screen looks right, contrast, dark mode, utility classes resolved through a theme, or values built at runtime. Those are the checklist in [verify](references/verify.md) and the fresh-eye review in [review](references/review.md).
- With no contract it says `inconclusive` and exits 2. That is never a pass.

Zero dependencies, Node 20 or later. `--self-test` runs the gate against `examples/` and `teaching/`.

## Pairs with

- `khe-ui`: the contract is silent on a scale, a contrast pair, dark mode or motion, and that gap needs its rules; and when the tokens are right and the screen still feels unfinished.
- `khe-auto`: runs this skill first whenever a project has a contract.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow with its exits, the rules.
- `references/`: 3 references on the two contract formats and on writing docs, plus [verify](references/verify.md) (the last pass and the handover template), [review](references/review.md) (the fresh-eye brief) and [teaching](references/teaching.md) (the index of pairs). `gotchas.md` and `pov.md` are yours to edit.
- `examples/`: 4 gold folders (a `.design` threaded through CSS, a DESIGN.md threaded through CSS, a Tailwind theme, a doc page) and a finished `TOKENS.md`. The bar, and the place to start from.
- `teaching/`: 14 bad/good pairs, one fault each, named for the gate line they raise. For diagnosis, never for copying.
- `scripts/token-check.mjs`: the gate.
- [LICENSE](LICENSE): MIT.
