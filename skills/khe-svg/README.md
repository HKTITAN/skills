# khe-svg

Create, clean, animate and morph SVG, or turn a flat clip into an editable vector.

```bash
npx skills add HKTITAN/skills --skill khe-svg
```

## What it does

- Draws or refactors an SVG onto a whole-number grid with a `viewBox`, named groups, token colours and an accessible name.
- Decides whether the file should move, then picks the engine by where it renders: inline CSS or WAAPI, keyframes or SMIL inside the file, or a library for gestures.
- Handles stroke draw-ons, path morphs and the pipeline from a flat clip to a vector flipbook.
- Optimizes with SVGO and reports the size before and after.

## When to use it

Use it when you need an SVG made, cleaned up or set in motion: an icon that will not recolour, a logo that should draw itself in, a play and pause toggle, a mascot loop, or a flat character clip that has to become an editable vector. It works on the file. Timing for the rest of the page belongs to the motion skill. Stickers and sticker packs belong to `khe-sticker`.

## Invoke with

`/khe-svg [create | animate] [target]`

Or describe the problem in your own words. The skill's description carries the triggers, so no special wording is needed.

## Before and after

Before: a 200 KB export with fixed `width` and `height`, 11 hardcoded colours, unnamed groups and 48 traced frames at 24 fps.

After: a 20 to 60 KB file with a `viewBox`, 5 colours lifted to CSS variables, named layers, 24 frames at 12 fps with held frames collapsed, and a still frame under reduced motion.

## Example prompts

- This icon came out of a generator and it won't change colour with the theme. Can you clean it up?
- I want our logo to draw itself in on the landing page, and it's loaded as an img tag.
- I have a two second clip of our mascot waving. Can it be an SVG I can recolour?

## Pairs with

- `khe-ui`: once the question leaves the file (a page transition, a gesture, an icon family built to morph), its values and its spring rules take over.
- `khe-sticker`: stickers of any kind, their motion and their packs.
- `khe-sound`: a reveal that makes a sound is cued to the contact frame this skill produces.
- `khe-ui`: it owns which icon pack the product uses and at what size; this skill only draws to match it.
- `pick-ui-library`: a resampling or timeline library is a dependency call, taken only when the morph or the choreography is the product.

## Verify

```sh
node scripts/svg-check.mjs path/to/file.svg --gate
```

The gate reads `.svg` files, and every `<svg>` inlined in `.html`, `.jsx` and `.tsx`, and prints each fault as a named line with its file and line number. It ends `svg check passed` only when every never-intentional line is at 0: a missing `viewBox`, a hardcoded colour, an unnamed group, a duplicate id, an embedded raster, motion with no reduced-motion state, an engine the file's home cannot run, a morph whose two `d` strings do not match.

It proves the markup holds the rules. It does not prove the file looks right: it never renders anything, so feel, timing, optical size and whether the optimized file still matches its source are checked by eye with `references/verify.md`. Passing is necessary, not sufficient. `node scripts/svg-check.mjs --self-test` proves the gate against the skill's own examples and teaching pairs.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow with its exits, the rules and the reference table the agent follows.
- `references/`: 12 references the agent opens one at a time, including `verify.md` (the last pass), `review.md` (the fresh-eye brief) and `teaching.md` (the index of pairs), plus `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: 4 gold files that set the bar: a clean icon, an icon set on one grid, a logo reveal by stroke draw and a path morph.
- `teaching/`: 14 bad and good pairs, the same file twice with one thing wrong. They are also the gate's tests.
- `scripts/`: `svg-check.mjs`, the gate, and `svg-flipbook.mjs`, which assembles frames into one animated SVG.
- [LICENSE](LICENSE): MIT.
