# khe-auto

Picks the right skill for a request and runs it.

```bash
npx skills add HKTITAN/skills --skill khe-auto
```

## What it does

- Reads a request and names the one or two skills that own it, with a one-line reason each.
- Runs them in order, one at a time, looking at the result between them.
- Routes to the khe skills and to Emil Kowalski's and Benji Taylor's skills by name, and says whose each one is.
- Says so when no skill applies, instead of stretching one over the wrong problem.

## When to use it

Use it when you do not know which skill covers a problem, when two seem to overlap, when a job spans several, or when you just want the right thing to happen without choosing. If you already know the skill, call that skill directly: it is one step shorter.

## Invoke with

`/khe-auto [request | which <job> | list]`

Or describe the problem in your own words.

## Before and after

Before: "make the logo reveal better" loads four skills at once and returns a list that mixes path cleanup, easing, sound and export settings, none of it applied.

After: `khe-svg: the reveal lives inside the file`, then the svg pass with its changes made, then one line: "next, `khe-sound` if the reveal should make a sound".

## Example prompts

- I need a launch video for Friday. What do I run, and in what order?
- Which skill do I use for a hero demo of the app on the landing page?
- The drawer feels off when I let go of it. Where do I start?

## What is inside

- [SKILL.md](SKILL.md): the domains, the job table, the overlaps and the fixed orders.
- `references/`: `gotchas.md` and `pov.md`, which are yours to edit.
- [LICENSE](LICENSE): MIT.
