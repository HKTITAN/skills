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

## Pairs with

- `emil-design-eng`: the contract is silent on a scale, a contrast pair or dark mode, and that gap needs its rules.
- `emil-design-eng`: after tokens are threaded, its checklist confirms no stale literal survived.
- `emil-design-eng`: the tokens are right and the screen still feels unfinished.

## What is inside

- [SKILL.md](SKILL.md): the scope, the rules and the steps the agent follows.
- `references/`: 3 references the agent opens one at a time, plus `gotchas.md` and `pov.md`, which are yours to edit.
- [LICENSE](LICENSE): MIT.
