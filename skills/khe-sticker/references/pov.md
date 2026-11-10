---
title: pov
summary: Your opinions and taste calls for this skill. They override its defaults.
tags: [pov, opinion, customizable]
---

# Point of view

This file is **meant to be edited by you**. The rest of the skill is canonical; this is your override layer. Read it before producing work with this skill, alongside [gotchas](gotchas.md). A project's `.design` contract or DESIGN.md outranks both.

## How to use this file

Add opinions that override or extend the defaults in the rest of the skill. Two types are useful:

1. **Hard overrides** — "I never use X." or "I always prefer Y over Z."
2. **Taste calls** — "When in doubt, lean toward A because B."

Be specific. Vague taste statements ("I like clean stickers") don't help the agent. Concrete taste statements ("a white part's side is always the palette's palest blue, never a neutral") do.

A taste call should *orient* a decision, not *amputate* a possibility. "Default to one accent" trains better work than "never use a second colour" — the first sharpens judgment, the second narrows the design before the problem is even seen.

## Defaults

Starting points, not walls. They are this skill's own calls, and the rest of the skill cites them from here. Override any of them below.

- **Pointy shapes are off-brand.** Round joins, round caps and rounded corners on every part. A spike becomes a stray pixel at 64 px. The gate holds a set to one join style, whichever you choose.
- **No grey inside a sticker.** Every fill is a palette colour or white; a white part's side is a pastel, `--white-side`. If your palette has a real grey, run the gate with `--allow-grey`.
- **About 15 shapes.** Count the drawn shapes in one sticker; a face and its side count once, and impact marks are not counted. Past 15, something is detail that the 64 px check will remove anyway.
- **No sparkle or star as decoration.** An impact mark lands on a hit and leaves. It is never in the still.
- **Still first.** A sticker that does not work as a still does not get motion to rescue it. Per [sticker-craft](sticker-craft.md).

## Your POV

> The narrow, opinionated calls the defaults above deliberately leave open. Examples:
>
> - I always prefer ____ over ____.
> - In my stickers, ____ is non-negotiable.
> - Skip ____, even if the rest of the skill recommends it. The reason is ____.
