# khe-ui

Interface craft with numbers, and a review that ends in a verdict.

```bash
npx skills add HKTITAN/skills --skill khe-ui
```

## What it does

- Builds or judges a screen against exact values: a duration, a curve, a contrast ratio, a pixel size.
- Covers eleven areas, one file each, opened only when the job needs it: motion, components, accessibility, mobile, typography, color and surface, layout, taste, AI tells, review, and the pass before shipping.
- Ends a review with Blocked, Approve with changes or Ship it, and says what it could not verify.
- Deletes before it adds. Most "feels off" is too much of something.

## When to use it

Use it when a screen works and something is still wrong, when you want a component or a pull request judged before it merges, or when you are building a screen and want it right the first time. It is one skill on purpose: you say what is wrong in your own words and it opens the one area that owns it.

## Invoke with

`/khe-ui [review | polish | build | tells | a11y | mobile | ship] [target]`

Or describe the problem in your own words.

## Before and after

Before: "Your modal animation could be smoother. The transition is a bit long and the scale starts too small."

After: `transition: all 0.6s ease-in` becomes `transition: transform 250ms cubic-bezier(0.23, 1, 0.32, 1), opacity 250ms`, `scale(0)` becomes `scale(0.95)`, each with a one-line reason, under a verdict of "Approve with changes".

## Example prompts

- Review this settings page before I merge it. Did I make anything worse?
- The dashboard works but it feels unfinished and I can't say why.
- This card breaks with long names. What else breaks?

## What is inside

- [SKILL.md](SKILL.md): the modes, the hard rules, the numbers that come up on every screen.
- `references/`: eleven lane files, plus `gotchas.md` and `pov.md`, which are yours to edit.
- [LICENSE](LICENSE): MIT.
