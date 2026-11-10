# khe-sticker

Design, animate and pack stickers of every kind, as one set.

```bash
npx skills add HKTITAN/skills --skill khe-sticker
```

## What it does

- Turns a brief into a kind, a verb, a palette and a size before anything is drawn: flat die-cut, lettering, character, badge, isometric slab or reaction.
- Draws each sticker on a 500-unit canvas with one ink outline, palette roles and a white die-cut, and holds the whole set to one outline, one tilt, one size band and one palette.
- Gives a sticker one motion with a cause: a pop from scale 0.2, children a few frames late, marks switched on the hit, then a still hold and a reduced-motion still inside the file.
- Builds the pack: static and animated SVG, 512 px PNG, WhatsApp static and animated WebP, the tray icon and Telegram WebM, each checked against its size and limit.

## When to use it

Use it when you need a sticker or a set of them: a chat pack, mascot or reaction stickers, lettering stickers, badges for a product, or isometric stickers for a page. It owns the sticker from the brief to the files. Icons, logos and general SVG belong to `khe-svg`.

## Invoke with

`/khe-sticker [design | animate | pack] [brief or folder]`

Or describe the problem in your own words. The skill's description carries the triggers, so no special wording is needed.

## Before and after

Before: six stickers drawn one at a time, each a different size in its frame, two outline weights, a grey shadow under one, sparkles on three, all of them looping forever with a fade on the way in.

After: one set at 55 to 65% of the frame, one 5-unit outline and one ink, flat palette roles, each sticker readable as a black silhouette at 64 px, one 2.5s motion that ends on a still, and a pack whose every file is under its limit.

## Example prompts

- Make a sticker pack for our delivery app: sent, delivered, late, thanks. WhatsApp and Telegram.
- Our mascot needs five reaction stickers that feel like one set.
- Animate this sticker so it pops once when the section scrolls into view, then sits still.

## Pairs with

- `khe-svg`: icons, logos, path morphs and general SVG cleanup.
- `khe-design-tokens`: the palette contract the sticker's roles are mapped from.
- `khe-sound`: a sound cued to the frame of a sticker's hit.
- `stageshow`: Benji Taylor's skill, for a sticker placed inside a faux product demo or a grid of tiles.

## Verify

```sh
node scripts/sticker-check.mjs path/to/set --gate
node scripts/sticker-check.mjs path/to/pack/svg path/to/pack/animated --pack path/to/pack --gate
```

The gate reads sticker SVGs as text and a built pack's files by their headers, and prints each fault as a named line with its file and line number. It ends `sticker check passed` only when every never-intentional line is at 0: an undeclared kind, a wrong canvas, a bare hex, a second outline weight in a set, a skewed outline, a gradient or shadow, a grey fill, live text, a missing die-cut, a fade or a pop from zero, a loop with no hold, no reduced-motion still, a PNG or WebP of the wrong size, a file over its limit. Video stickers are read with `ffprobe`; without it the gate says `inconclusive` and never passes them.

It proves the files hold the rules. It does not prove a sticker reads: it never renders anything, so the silhouette, legibility at 64 px, optical centring, the tilt across a set, whether a motion has a cause and whether the still tells the story are checked by eye with `references/verify.md`. Passing is necessary, not sufficient. `node scripts/sticker-check.mjs --self-test` proves the gate against the skill's own examples and teaching pairs.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow with its exits, the rules and the reference table the agent follows.
- `references/`: 8 references the agent opens one at a time: `sticker-craft.md` (the shared rules), `sticker-kinds.md` (a section per kind), `sticker-pack.md` (formats, sizes and the pipeline), `verify.md` (the last pass), `review.md` (the fresh-eye brief) and `teaching.md` (the index of pairs), plus `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: 14 gold files that set the bar: eight static stickers across five kinds, four animated ones that each play one story (a reaction among them), the idle a page adds, and a pack manifest.
- `teaching/`: 14 bad and good pairs across the kinds, the same sticker twice with one thing wrong. They are also the gate's tests.
- `scripts/`: `sticker-check.mjs`, the gate.
- [LICENSE](LICENSE): MIT.
