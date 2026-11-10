---
title: gotchas
summary: Lived failures for this skill. Append a one-liner every time the agent gets a detail wrong.
tags: [gotchas, append-only]
---

# Gotchas

This file is **append-only**. Each time the agent (or you) gets a detail wrong in practice, add a one-line gotcha here. Do not edit an entry unless it is outright wrong. Negative examples are the highest-signal content in a skill over time: the instructions should change rarely and this file should grow steadily.

## Format

```text
- [YYYY-MM-DD] One-line description of the gotcha. → the fix, and the reference that owns the rule
```

Keep each to one line. Taste calls go in [pov](pov.md), not here.

## Entries

- [2026-10-28] A tall card on the house facing lost its portrait read and looked like a tile. → Give a tall object the shallower turn: 9 degrees, height times 0.9. See [sticker-kinds](sticker-kinds.md).
- [2026-10-28] White parts got a grey side and looked dirty beside the palette. → `--white-side` is a pastel of the palette. See [sticker-craft](sticker-craft.md).
- [2026-10-28] A sticker faded in and showed its stacked shapes through each other. → Pop with scale from 0.2; switch marks with `steps(1, end)`. See [sticker-craft](sticker-craft.md).
- [2026-10-28] A fixed die-cut under an animated sticker left its parts hanging outside the white. → Render frames with a die-cut built from each frame's alpha. See [sticker-pack](sticker-pack.md).
- [2026-10-28] Frames recorded in real time dropped and doubled. → Pause every animation and set its clock per frame. See [sticker-pack](sticker-pack.md).
- [2026-10-29] In a set of fourteen, two stickers sat 22 units off centre and one looked small; nobody saw it until they were in a grid. → Check occupancy and centre across the set, in one row. See [sticker-craft](sticker-craft.md).
- [2026-10-29] Sparkles on some stickers and not others, collapsing into crosses at small sizes. → One marks rule per set; short strokes by default. See [sticker-kinds](sticker-kinds.md).
- [2026-11-10] A gold sticker leaned with `matrix()` and kept its outline with `non-scaling-stroke`; at 160 px the outline was three times too heavy. → Bake the lean into the path data. See [sticker-craft](sticker-craft.md).
- [2026-11-10] A flat sticker drawn white and pale blue on its white die-cut read as a wireframe. → Give the main shape an accent and a darker tone of it. See [sticker-kinds](sticker-kinds.md).
- [2026-11-10] A character and a trophy on the house facing looked as if they were lying down. → Upright subjects take the tall-object facing: 9 degrees, height times 0.9. See [sticker-kinds](sticker-kinds.md).
- [2026-11-10] Impact marks placed beside a sticker ran off the canvas at their 1.35 peak. → Keep marks within 185 units of their group's centre, or put them above the object. See [sticker-craft](sticker-craft.md).
- [2026-11-10] A heart centred by its box looked high: its weight is in its lobes. → Centre by the painted pixels, then check the box is still within 15 units. See [verify](verify.md).
