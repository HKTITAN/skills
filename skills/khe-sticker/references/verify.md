---
title: verify
summary: The last pass for a sticker, a set or a pack. The gate command and what its verdict means, yes or no questions answered from rendered frames, the lines that are never intentional, the candidate lines, a table from what you see to what you do, what the gate cannot check, where the sources disagree, and the STICKERS.md handover template.
tags: [sticker, verify, gate, checklist, handover]
---

# Verify

The last pass. Every answer comes from something you looked at: the gate's output, the set rendered at 400, 160 and 64 px, the motion stepped frame by frame, the pack's files played in a chat. Never answer from the markup you remember writing. Fix the largest visible fault first, run the gate again, return to the top, and repeat until every answer is yes.

The rules behind the questions are in [sticker-craft](sticker-craft.md), [sticker-kinds](sticker-kinds.md) and [sticker-pack](sticker-pack.md).

## Gate

```sh
node scripts/sticker-check.mjs <files or folders> --gate
node scripts/sticker-check.mjs <pack>/svg <pack>/animated --pack <pack> --gate --report sticker-check.json
node scripts/sticker-check.mjs --self-test
```

- Does `--gate` end with the line `sticker check passed`? That line means every never-intentional line is at 0 in every file it read. It always prints `passing is necessary, not sufficient` first, and it means it.
- Did it read every file you are shipping? The summary counts the files checked. A file it could not measure is listed as `not checked:`. With nothing to read, or with a WebM and no `ffprobe`, it says `inconclusive` and exits 2, which is never a pass.
- Does every sticker's root carry `data-kind`? Without it the gate prints `kind-undeclared:` and no kind line was applied.
- Were the stickers of one set checked together, from one folder? The set lines compare the files of a folder. A sticker checked alone was never held to its set.
- Is every candidate line answered: fixed, or kept with its reason written in `STICKERS.md`?

Exit codes: 0 for a pass, and for a plain report run without `--gate`; 1 when `--gate` fails; 2 when inconclusive. `--strict` makes candidates fail the gate too. `--allow-grey` is for a project whose [pov](pov.md) allows grey.

## The idea and the silhouette (first, because nothing below matters if this is wrong)

- Can you say what the sticker says in two or three words, and does a person who has not seen the brief say the same words?
- Fill it black at 160 px. Does the shape alone say what it is?
- At 64 px, is it still that thing? Has any part become a dot, a cross or a smudge?
- Is there exactly one idea in the frame: no second object, no caption beside a picture, no ornament?
- Is the one feature that makes it this object still there after the simplifying: the keyhole, the fold, the smile?
- Put it beside the closest gold in `examples/`. Say the one difference. Is yours the busier, thinner or smaller one?

## The set (every sticker beside its neighbours)

- Rendered in one row at 160 px: is the outline one weight and one ink on every sticker?
- Does each subject fill 55 to 65% of its frame, and do all of them sit in one band 10 points wide?
- Is each one's optical centre within 15 units of the frame's centre? Paint the art black and average the painted pixels, or judge it in a grid: a sticker that sits low or to one side shows at once beside its neighbours.
- Do all slabs lean one way, with every side falling in one direction?
- Is each role one colour across every file, with two accents and white at most per sticker, one warm accent at most, and five hue families or more across the set?
- Does every sticker have a light face and a darker tone of the same hue, flat kinds included? Is any body pale on the white of its own die-cut?
- Is there one rule for impact marks, and one for bases or grounds: on every sticker, or on none?
- On white, on near-black and on a chat-bubble colour: does every sticker keep its edge?

## The drawing (per sticker)

- Is every paint a role with its fallback, and is the fallback the contract's value for that role?
- Is there no grey, no gradient, no blur, no shadow, no live text and nothing loaded from outside the file?
- Are there about 15 shapes or fewer, and no near-tangent: two edges that almost touch?
- Is a nested shape the same distance from its container on every side, and is a pointed mark centred by eye?
- Is the die-cut one closed white shape 12 units outside the art, or is `data-diecut="none"` a decision the brief made?
- Lettering: is the word spelled right, readable at 64 px, and written in `data-text` and the `<title>`?
- Character: does the pose alone, filled black, carry the emotion? Are the eyes, the mouth and each limb their own parts?
- Badge: does its edge make it a badge in silhouette? Is the mark a real mark or a plain symbol, never an invented logo?
- Isometric: three to six parts, every face leaning, every part with its own side, the light tone on top?

## The motion (only when it moves)

- Can you name the verb in one word, and the cause of every part that moves?
- Step it at 60 fps, frame by frame. Does one part lead, and does every other part follow 4 to 6 frames late?
- Does anything turn or scale about the canvas corner instead of its hinge?
- Does anything fade, appear from nothing, or get swapped for a second drawing while in view?
- Does a pop start small and whole at scale 0.2, and do the impact marks appear on the frame of the hit?
- After the action, is everything still? A chat loop: is the hold at least 20 frames, and does the last frame flow into the first? A page story: does the last frame equal the still?
- Is any frame of the motion cut by the canvas edge or by its die-cut?
- Cover the motion and look at the still alone. Does it say what happened? Is it the frame after the action, never mid-squash?
- Turn reduced motion on and reload. Is the whole sticker there, at rest, with no marks?
- On a page: does the idle start only after the story lands, do neighbours idle out of step, and do views of eight or more use stills?

## The pack (only when it ships as files)

- Does the gate, run with `--pack`, end `sticker check passed`, with every WebM read by `ffprobe`?
- Played in the chat app, on a light and a dark theme: does the die-cut follow every part on every frame, with no white fringe left behind and no part outside it?
- Is the tray icon recognisable at 96 px?
- Did the animated WebP or the WebM need the last quality step to fit? Then the sticker moves too much: simplify it at the source.
- Is every platform rule the brief relies on either in [sticker-pack](sticker-pack.md) or confirmed against the platform's current rules, with its source written in `STICKERS.md`?

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. Clearing a line by deleting, renaming or hiding the thing it points at is a bug: a kind changed to quiet `part-count:`, a `data-diecut="none"` added to quiet `missing-diecut:` on a chat sticker, a motion removed to quiet `no-hold:` when the brief asked for the motion.

### Every kind

| Line | What it means |
| --- | --- |
| `kind-undeclared:` | No `data-kind` on the root and no `--kind`, or a kind this skill does not have. No kind line was applied |
| `wrong-canvas:` | The root is not `viewBox="0 0 500 500"`, or it carries a fixed `width` or `height` |
| `off-canvas:` | A shape reaches the canvas edge or passes it |
| `no-accessible-name:` | The root has no `<title>`, no `aria-label` and no `aria-hidden` |
| `unnamed-group:` | A `<g>` with no `id`, `class`, `data-part` or `data-layer` |
| `leaky-style:` | A rule in the file's `<style>` that does not start at the root id. On a sheet of stickers it restyles the others |
| `hardcoded-color:` | A paint that is not `var(--role, fallback)`, or a `var()` with no fallback |
| `outline-ink:` | A stroke in a role other than `ink` |
| `outline-weight:` | The outline is not 5 units (or 4), or nothing in the file is stroked |
| `lost-at-160:` | A stroke under one pixel at 160 px: any `stroke-width` below 3.125 units |
| `skewed-outline:` | A `matrix()`, a `skew` or a non-uniform `scale` written on an element, or `non-scaling-stroke`. The outline no longer has one weight |
| `gradient-or-shadow:` | A gradient, a filter, a blur, a glow or a drop shadow, in the markup or the `<style>` |
| `grey-fill:` | A grey fill: a role named `grey`, or a fallback whose three channels sit within 10 of each other below white. `--ink` is exempt |
| `live-text:` | A `<text>` element |
| `external-asset:` | An `<image>`, a `<script>`, an `@import`, a font file or a link out of the file |
| `missing-diecut:` | A static sticker with no `data-layer="diecut"` and no `data-diecut="none"` |
| `fixed-diecut:` | A die-cut that stays put while the art above it moves |
| `no-reduced-motion:` | Motion with no `prefers-reduced-motion` block that sets `animation: none` |
| `fade-pop:` | Opacity eased between values, in keyframes or a transition. A part pops with scale or switches with `steps(1, end)` |
| `pop-from-zero:` | A `scale(0)` on both axes |
| `no-hold:` | A loop in which something moves on every frame |
| `unrested-end:` | A story that plays once and whose last keyframe is not the rested pose |
| `corner-origin:` | A rotation or scale on a rule with no `transform-origin` |
| `smil-motion:` | SMIL. The frame renderer seeks CSS animations only |
| `set-outline:` | Two outline weights across the files of one folder |
| `set-ink:` | Two ink colours across the set |
| `set-joins:` | Two `stroke-linejoin` styles across the set |
| `set-palette:` | One role with two fallbacks across the set |

### One kind

| Line | Kind | What it means |
| --- | --- | --- |
| `part-count:` | isometric | Fewer than three or more than six `data-part` groups |
| `flat-part:` | isometric | A part with a face and no `-side` shade |
| `unspoken-text:` | lettering | No `data-text` on the root, or a `<title>` that does not contain those words |
| `no-face:` | character | No part named `eyes` or `face` |
| `no-frame:` | badge | No part named `frame` |
| `still-reaction:` | reaction | A file with no motion |

Flat has no line of its own: the shared lines are its test.

### A pack

| Line | What it means |
| --- | --- |
| `manifest-gap:` | `pack.json` is missing a field, a sticker entry is incomplete, an output is not listed, or a number differs from [sticker-pack](sticker-pack.md) |
| `missing-output:` | A file the pack must contain is not on disk |
| `unreadable-output:` | A file whose header could not be read as its type |
| `png-size:` | A still PNG that is not 512 by 512 |
| `png-margin:` | A painted pixel inside the 16 px margin |
| `opaque-ground:` | A PNG with no alpha channel, or a corner pixel that is not transparent |
| `tray-size:` | A tray icon that is not 96 by 96 |
| `webp-size:` | A WebP that is not 512 by 512 |
| `webp-not-animated:` | One frame in `whatsapp/animated`, or several in `whatsapp/static` |
| `over-weight:` | A static WebP at 100 000 bytes or more, an animated WebP at 500 000 or more, a WebM at 256 000 or more |
| `webm-size:` | A video sticker that is not 512 by 512 |
| `webm-duration:` | A video sticker longer than 3 seconds |
| `webm-codec:` | A video sticker that is not VP9 |
| `webm-no-alpha:` | A video sticker with no alpha channel |
| `webm-audio:` | A video sticker with an audio stream |

## Candidate lines

Reported for judgment. Each one is either fixed or written into `STICKERS.md` with the reason it stands. The reviewer judges each again.

| Line | What it means | When it stands |
| --- | --- | --- |
| `mixed-outline:` | More than one `stroke-width` in one sticker | A 4-unit mark or detail beside 5-unit bodies |
| `accent-budget:` | More than two accent roles | A brief that names three colours |
| `unknown-role:` | A role outside the palette roles | The contract defines it; the mapping is in the handover |
| `fallback-drift:` | One role with two fallbacks in one file | Never |
| `shape-budget:` | More than 15 drawn shapes (side shades and impact marks are not counted) | Lettering of several letters, a board of tiles |
| `decoration:` | A layer named sparkle, star, twinkle or glint | The brief asked for it, and every hit in the set has one |
| `long-decimal:` | Coordinates with more than 2 decimals | Never after cleanup |
| `occupancy:` | The subject's box is outside 50 to 65% of the canvas | Never inside a set; a single sticker with a long swing |
| `off-centre:` | The subject's box sits more than 15 units from the centre | The optical centre is within 15 units and the box is not: a heart, a flag on a pole |
| `over-budget:` | An SVG over 30 KB | Long lettering as outlines |
| `loop-length:` | A loop outside 123 to 180 frames | Never over 180: a Telegram video sticker is 3s at most |
| `mixed-loop:` | Animations of different lengths or delays, so the hold was not measured | Never: put every group on one clock |
| `short-hold:` | A hold under 20 frames | Parts that arrive one at a time and fill the loop |
| `lockstep:` | Every moving group starts on the same frame | One rigid object with no children |
| `dead-rule:` | An animation rule that matches nothing | Never |
| `repaint-property:` | Motion on a property other than `transform` or `opacity` | Never in a pack: it costs every frame |
| `uneven-inset:` | A flat badge's mark is not centred in its frame by box. A slab badge is listed as not checked | A mark centred by eye, with the move written down |
| `set-occupancy:` | Subjects more than 10 points apart across a set | Never |
| `set-motion:` | Moving stickers of different lengths in one set | Never |
| `set-marks:` | Some moving stickers have impact marks and some do not | Stickers with no hit in them |
| `webp-loop:` | An animated WebP that does not loop forever | Never in a chat pack |
| `webm-fps:` | A video sticker that is not 30 fps | Never from this pipeline |

## What you see, what you do

| You see | You do |
| --- | --- |
| It needs a sentence to explain | Cut to one idea; the second idea is a second sticker |
| A blob when filled black | Redraw the outline shape: change the pose, the angle or the edge, before touching any detail |
| A dot or a cross at 64 px | Remove the part or make it one of the main shapes |
| One sticker looks thinner or heavier than its neighbours (`set-outline:`, `outline-weight:`) | One weight for the set, drawn at that weight, never scaled to it |
| One sticker looks small or sits low in the grid (`set-occupancy:`, `off-centre:`) | Scale it into the set's band; move it until its painted centre is within 15 units |
| One sticker's blue is not the others' blue (`set-palette:`) | One fallback per role, from the contract, in every file |
| An outline thick on one edge and thin on the next (`skewed-outline:`) | Bake the lean into the path data; remove the `matrix()` |
| The sticker loses its edge on a photo or in dark mode (`missing-diecut:`) | The white die-cut as the first layer, 12 units outside the art |
| A grey smudge under it at small sizes (`gradient-or-shadow:`, `grey-fill:`) | A hard shape in a `-side` shade of the palette, or nothing |
| The word changes shape on another machine (`live-text:`) | Outline the letters; keep the words in `data-text` and the `<title>` |
| It appears from nowhere, or as a ghost (`pop-from-zero:`, `fade-pop:`) | Start at scale 0.2, fully opaque; switch marks with `steps(1, end)` |
| A limb swings about the canvas corner (`corner-origin:`) | `transform-box: fill-box` and a `transform-origin` at the hinge |
| It never stops moving (`no-hold:`, `short-hold:`) | End the action in the first half; delete the idle; hold the still |
| Everything moves as one stamp (`lockstep:`) | Start the children 4 to 6 frames after the lead |
| The white border stays behind when a part moves (`fixed-diecut:`) | Put the cut inside the group that moves the whole sticker, or leave it to the render step |
| The still is mid-squash, or the motion ends off its pose (`unrested-end:`) | The last keyframe is the rested pose, and the poster is that frame |
| Reduced motion shows a small or half-built sticker | Make the base state of every group the rested pose; `animation: none` in the query |
| The WebP or WebM will not fit (`over-weight:`) | Step the quality down; if it still fails, shorten the action and flatten the fills |
| A gate line you think is intentional | Look at the render again; if it still stands, write the line, the evidence and the reason in `STICKERS.md`. Never clear it by hiding the thing |
| Ten gate runs, gate green, the render unchanged | Stop. Hand it to a fresh eye by [review](review.md) |

## Not checked by the gate

The gate reads text and file headers. It never renders a sticker, so each of these is answered by looking:

- Whether the sticker is one idea, and whether a stranger names it.
- The silhouette filled black, and legibility at 160 and 64 px.
- Occupancy and centring of any sticker drawn with curves or transforms: the gate measures straight-line paths and basic shapes only, and it measures the box, never the optical centre.
- The tilt and the light direction across a set.
- Near-tangents, even insets as the eye sees them, and whether a highlight or a mark is one too many.
- Whether the fallbacks match the project's contract, and whether a colour reads as a stock tell.
- Whether each motion has a cause and one part leads. The gate checks that a `transform-origin` exists, never that it is the hinge.
- The frame an impact mark lands on, the seam of a loop, and the canvas edge during the motion.
- Whether the still tells the story, and which frame a host uses as its poster.
- Spelling and letter spacing of outlined lettering.
- Pixels of WebP and WebM frames: the moving die-cut and the look in a chat.
- The page's idle: `examples/idle.css` is not read by the gate.
- Every platform rule listed under "Not written here" in [sticker-pack](sticker-pack.md).

These kinds have no sourced number for their build, so their rules are checks on a rendered frame and nothing more: flat (the silhouette), lettering (readable at 64 px), character (the emotion in silhouette), badge (a badge in silhouette), reaction (the still says what the motion says).

## Where the sources disagree

- **Occupancy.** The slab technique's source gives 50 to 60% of the canvas. The fourteen-sticker page set measures 55 to 65%. This skill uses one band 10 points wide per set, 55 to 65% by default, and the gate accepts 50 to 65% for one sticker.
- **Sparkles.** The slab technique lands a white sparkle on the beat. The page set carries sparkles on some stickers and not on others, and they collapse into crosses at 64 px. Stageshow's rule is no sparkle as decoration. This skill uses short impact marks on a hit, switched on the peak frame, never in the still, with one rule for the whole set.
- **How a mark appears.** The page set scales its sparkles from 0. The chat pack switches its marks on at scale 0.2. This skill follows the pack: nothing scales from 0.
- **Joins.** The slab technique's source uses miter joins and butt caps. The chat pack and [pov](pov.md) use round. This skill uses round.
- **The ending.** The chat pack loops and pops back out. The page set plays once, carries a three-turn idle inside each file, and the page adds another. This skill keeps the story in the file and the idle in the page, and picks the ending by the home.
- **The border.** The chat pack cuts a 12-unit white border. The page set is borderless on its own ground. This skill requires the cut unless the root says `data-diecut="none"`.
- **The canvas.** The page set is drawn on 512 units. The chat pack and the slab technique use 500, rendered to 512 px with a 16 px margin. This skill uses 500.
- **Squash.** A squash scales one axis, and the motion rule this collection follows for interfaces is never to scale the two axes differently. A sticker is illustration: a squash is allowed on a hit and nowhere else.
- **The SVG budget.** No sticker source states one. 30 KB is the top of the mascot budget `khe-svg` uses, and the gate reports it as a candidate. Three of the ten animated files in the chat pack are over it.
- **The video sticker's shape.** The pack's notes say "512 px" and its files are 512 by 512. The gate holds 512 by 512; any other shape must be confirmed against the platform's rules.

## Hand over

Write `STICKERS.md` beside the set. A template:

```md
# Stickers: <set or pack>
Brief: <the idea of each sticker in two or three words>
Kinds: <name: kind, verb or "still">
Set: outline <n> units, ink <role value>, facing <which>, band <n to n%>, marks <rule>, home <chat | page>
Palette: <role> = <contract token>, for every role in use
Gold: <example> (what you kept, what you changed)
Looked at: <400, 160, 64 px>, <grounds>, <silhouettes>, <frames stepped>, <reduced motion>, <chat app and theme>
Stills: <which frame is the still of each animated sticker>
Pack: <outputs built>, <the largest file of each kind and its limit>
Gate: <the last line of sticker-check.mjs --gate, pasted>
Lines: <each candidate or disputed line> -> <the evidence> -> <fixed, or why it stands>
Platform rules: <each rule relied on> -> <where it was confirmed>
Review: <the reviewer's list> -> <your response>
Assumptions:
Unresolved:
Not checked:
```

- Is the gate's last line pasted, never retyped?
- Does `Not checked:` name every size, ground, frame, app and platform rule you did not look at?
