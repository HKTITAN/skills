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
- Ships its own gate, gold examples and teaching pairs, so "done" is a pasted line and a list of what was seen.

## How it runs

![khe-ui's flow: khe-design-tokens hands in the contract and ui-sdk the rendered parts; khe-ui opens one lane, runs its gate, looks at the screen and ends on a verdict with what it did not check; a fault found by looking goes back to the build; motion inside an SVG goes to khe-svg and a sound to khe-sound](assets/flow.svg)

## Used

```text
/khe-ui review InviteDialog.css InviteDialog.tsx
```

The gold review in [examples/review.md](examples/review.md): the gate's lines on the two files, then its verdict.

```text
scale-from-zero: `transform: scale(0)` in `.invite` (InviteDialog.css:6)
transition-all: `transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1)` in `.invite` (InviteDialog.css:7)
outline-none: `.invite__email { outline: none }` has no `:focus-visible` outline or ring to replace it (InviteDialog.css:17)
unnamed-icon-button: <button> holds only an icon and has no `aria-label` (InviteDialog.tsx:5)

files scanned: 2
never-intentional: 4 (scale-from-zero 1, transition-all 1, outline-none 1, unnamed-icon-button 1)
candidates: 0
passing is necessary, not sufficient
ui-check failed

Verdict: Blocked (5 findings).
Not checked: the dark theme, 390px on a real phone, VoiceOver, the entrance at 25% speed, where focus lands when the dialog closes, and contrast (the colours are tokens defined outside these two files).
```

The fifth finding, `font-size: 14px` on the input, is one the gate did not see; the checklist sheet caught it. Each finding is a Before, After and Why row in the file.

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

## Verify

```bash
node scripts/ui-check.mjs src/components --gate
```

The gate reads CSS, HTML, JSX and TSX as text and names every fault it can prove as one line, such as `ease-in:` or `unnamed-icon-button:`, with the file and line. It ends `ui-check passed` only when every never-intentional line is at 0.

- **What it proves:** the source is free of the faults a script can name: `transition: all`, `ease-in`, `scale(0)`, animated layout properties, a hover that moves the element outside the hover gate, motion with no reduced-motion branch, an input under 16px, an icon button with no name, a removed focus ring, a z-index above 400, locked zoom, and a review with no verdict.
- **What it does not prove:** that the screen feels right, that every state exists, that a keyboard reaches it, that the contrast passes, or that it works on a phone. Those need a look. Passing is necessary, not sufficient.

`node scripts/ui-check.mjs --self-test` proves the gate against the examples and teaching pairs in this folder. `--help` lists every line.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the modes, the hard rules, the numbers that come up on every screen.
- `references/`: eleven lane files; [ui-sdk](references/ui-sdk.md), where each value goes on a screen built with Vercel's UI SDK; [verify](references/verify.md), the last pass and the gate's lines; [fresh-eye](references/fresh-eye.md), the brief for a second reviewer; [teaching](references/teaching.md), the index of the pairs; plus `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: five gold examples that set the bar: a button with every state, a popover entrance and exit, a form field with validation timing, a list with loading, empty and error branches, and a finished review.
- `teaching/`: fourteen bad and good pairs, one fault each. They are also the gate's tests.
- `scripts/ui-check.mjs`: the gate. Node 20 or later, no dependencies.
- [LICENSE](LICENSE): MIT.
