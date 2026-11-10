---
title: sticker-kinds
summary: The six kinds of sticker and the rules each adds to the shared craft. Flat die-cut, lettering, character, badge, isometric slab and reaction, each with what it is for, how it is built, what the gate reads and what only a rendered frame can show.
tags: [sticker, kinds, flat, lettering, character, badge, isometric, reaction]
---

# Sticker kinds

Choose the kind from the brief before drawing, and write it on the root: `data-kind="flat"`. The gate applies the shared lines to every sticker and each kind's lines only to that kind. The shared rules are in [sticker-craft](sticker-craft.md); nothing here repeats them.

## Choose the kind

```text
What is the sticker?
├── a word or short phrase ............................ lettering
├── a face, a pose, an emotion ........................ character
├── a seal, stamp, label or award with a mark on it ... badge
├── a feeling shown mostly by movement ................ reaction
├── an object, and the set is drawn as solid blocks ... isometric
└── an object or a mark, drawn flat ................... flat
```

A set may mix kinds. It never mixes outline weights, inks, tilts or bands.

Only the isometric kind has published numbers for its build. For the other kinds, where no number can be traced, the rule is a check on a rendered frame, and [verify](verify.md) lists each one.

## Flat

One object or mark as flat shapes under the outline, with the die-cut round it. Flat means no thickness. It never means pale.

- **The fewest shapes that still read carry it,** drawn back to front. The gold is five parts: flame, fins, hull, nose, window.
- **Two tones on the main shape:** its own colour, and a darker tone of the same hue (its `-side` shade) laid down its far side as an unstroked shape. One flat fill reads as an emoji.
- **A solid body in a palette colour.** A white or pale body on a white die-cut is a wireframe: give the main shape an accent and keep white for one small part.
- **Border:** always the die-cut. A flat sticker has no side to separate it from its ground.
- **The silhouette is the whole job.** A flat sticker has no thickness to fall back on, so it is redrawn until it reads filled black at 160 px.
- Kind lines: none. The shared lines are the test.
- Gold: `examples/flat-rocket.svg`.

## Lettering

A word or a short phrase is the object.

- **Nothing else is in the frame.** No icon beside the word, no underline, no burst behind it.
- **The letters are outlines, never a `<text>` element,** built on one stroke weight so they read as one hand. A font does not exist inside a chat app or a renderer.
- **Say the words in the file:** `data-text="OK!"` on the root, and the same words in the `<title>`. Outlines cannot be read aloud or searched.
- **The letters lean on the set's facing and stand on a hard block in the side shade,** never a blurred shadow.
- **Two hues at most:** one for the word, a second for the one mark that carries the feeling.
- **Border:** the die-cut. Letters have gaps between them, and the cut is what makes them one sticker.
- **Short.** The ten-sticker pack's lettering runs one or two words (two to eight letters), its smallest letters stand 42 units tall, and letters are spaced at 0.02 of their height. Longer than that, read it at 64 px before keeping it.
- **A lean of a few degrees gives it energy;** one lean for the whole word.
- Kind line: `unspoken-text:`.
- Needs eyes: spelling, letter spacing, readable at 64 px.
- Gold: `examples/lettering-ok.svg`.

## Character

A face, a pose, one emotion.

- **One emotion per sticker,** carried by the pose first and the face second. Fill it black: the pose alone says cheering, sleeping or sulking.
- **The face is its own parts:** `data-part="eyes"`, `data-part="mouth"`, each limb its own part. A face painted into the body cannot blink, squint or smile without a redraw.
- **Body and limbs are slabs on the tall-object facing** (9 degrees, height times 0.9), so the character stands up while its sides fall the way the set's do. On the house facing a character looks as if it is lying down.
- **Limbs sit behind the body,** so their joins never show and each can turn from its shoulder.
- **The face lies on the body's face as unstroked shapes,** each its own part.
- **An expression changes as the same shapes:** eyes squint with `scaleY`, a mouth opens by scaling from its top edge. Never swap in a second face.
- **The face is ink, the body one accent, and the warm accent is one small thing:** the cheeks. A character is the easiest sticker to over-colour.
- **Border:** the die-cut, covering every limb across its swing.
- **Simplify the detail, never the character:** remove fingers, toes and patterns before the one feature that makes it this character.
- Kind line: `no-face:`.
- Needs eyes: the emotion readable at 64 px, the pose in silhouette.
- Gold: `examples/character-buddy.svg`, `examples/character-buddy-jump.svg`.

## Badge

A seal, a stamp, a label or an award: a closed frame that carries one mark or one short word.

- **Three parts, each a slab on the set's facing:** `data-part="frame"`, a plate raised off it, and `data-part="mark"` (or `word`) raised off the plate.
- **Even insets.** The plate sits the same distance inside the frame all round, and the mark sits centred on the plate. When a frame and its plate are both rounded, the outer radius is the inner radius plus the inset.
- **Centre the mark by eye after centring it by box.** A tick or a triangle is heavier on one side; move it towards its point and write the move in the handover.
- **The frame's edge is the silhouette:** scalloped, notched or ribboned, so a badge filled black is still a badge and never a plain disc.
- **No invented logo and no real one.** A letter in a coloured shape is not a mark. Use the product's own mark from its assets, or a plain symbol.
- **Border:** the die-cut. A badge is put on photos and in chats.
- Kind lines: `no-frame:`, and the candidate `uneven-inset:` for a badge drawn flat. On a slab badge the raised mark's box is not its centre, so the gate lists the insets as not checked and they are judged by eye.
- Gold: `examples/badge-done.svg`, `examples/badge-done-stamp.svg`.

## Isometric

Every part is a slab: a flat face with a thick outline and a side that falls away from it.

- **Faces lean, they never just rotate.** A face is turned in its own plane, then leaned back, so rectangles become parallelograms and circles become ellipses. The house facing turns the face 18 degrees and leans it back 36 degrees (its height times 0.81), and the side falls down-left: 0.55 units left and 0.72 down for each unit of depth.
- **One facing for the whole set.** The other facings are the mirror (turned the other way, side falling down-right), front (no turn, no lean, side 0.5 left and 0.68 down) and lying flat (turned 14 degrees, height times 0.56, side straight down). A tall object that must keep its portrait read takes a shallower turn: 9 degrees, height times 0.9.
- **The side falls in canvas space,** the same way on every part, while the faces turn. That shared direction is the light.
- **Three to six parts, each with its own thickness.** A body 26 to 40 units deep, a raised plate or label 6 to 12. A child sits on its parent's face, raised by its own depth. Detail painted flat on one shape is the tell of a generated sticker.
- **Top face in the light tone, side in a darker tone of the same hue:** `--main` over `--main-side`.
- **A part can wrap:** a tape or ribbon deeper than the part it sits on carries its own side down that part's edge.
- **A faceted object is modelled as points in space and projected,** never leaned as one rectangle, so its proportions stay true.
- **An upright object is one silhouette on one leaned plane.** A face standing on a slab whose side drops straight down reads as a shadow.
- **Detail is sparse and ink:** one keyhole, a few lines.
- **Border:** borderless by default, with `data-diecut="none"` on the root, when the set sits on a page of one known ground: the dark side and the heavy outline already separate a slab from it. For a chat pack the same sticker takes the die-cut.
- **The subject fills 50 to 60% of the canvas** when it has a swing to make room for; a still set sits in its set's band.
- Kind lines: `part-count:`, `flat-part:`.
- Needs eyes: the tilt against the rest of the set, every face leaning, every part with thickness.
- Gold: `examples/isometric-lock.svg`, `examples/isometric-gift.svg`, `examples/isometric-chat.svg`, `examples/isometric-trophy.svg`, `examples/isometric-lock-clasp.svg`.

## Reaction

The motion is the message: a thump, a shake, a burst.

- **It always moves.** A reaction with no motion is a flat sticker with the wrong kind written on it.
- **One beat.** The action is a single hit and its settle, over inside the first half of the loop.
- **The still says the same thing as the motion.** A reaction's rested frame is the object whole, so the reduced-motion viewer and the picker row get the message too.
- **Marks belong here,** on the peak frame of the hit, radiating from the object, switched on and off. A few short marks (the gold uses five); each one clears the object by more than the outline.
- **A thump** presses to 0.84 with the accelerating curve, then settles at amplitude 0.8: 1.057, 0.971, 1.014, 0.993, rest. **A shake** turns from the base: 9 degrees one way, then 7, 4.5, 3, 1.5 and 0.6 on alternate sides, 10 frames apart.
- **A second small object may arrive on the beat** (a small heart from behind a big one). It starts at scale 0.2 where the main object hides it, and it stays for the still.
- **The die-cut rides inside the moving group;** a part with its own motion carries its own cut.
- Kind line: `still-reaction:`.
- Gold: `examples/reaction-heart.svg`.

## Marks, sparkles and stars

- **A mark has a cause or it goes.** An impact mark lands on the frame of a hit and leaves. It is never in the still, and never ornament.
- **Short ink-outlined strokes are the default mark.** A four-point sparkle is used only when the brief asks for it, and then on every hit in the set: at 64 px a sparkle collapses into a small cross.
- **No sparkle, wand or star to mean "smart" or "new".** Show what happened.
- A layer named `sparkle`, `star`, `twinkle` or `glint` raises the candidate `decoration:`.

## Sources

- The isometric slab technique draws on Kelvin Adithya's fun-isometric (MIT, github.com/kelvinkn17/skills).
- A ten-sticker chat pack and a fourteen-sticker page set by this skill's author: the facings and depths in use, the lettering sizes, the thump and shake keys.
- Benji Taylor, Stageshow (MIT, github.com/benjitaylor/skills): an object keeps its identity when it changes; no sparkle or star as shorthand; no invented logo; nested shapes pad evenly; centre a glyph by eye.
