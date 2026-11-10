---
title: pov
summary: Your opinions and taste calls for this skill. They override its defaults.
tags: [pov, opinion, customizable]
---

# Point of view

This file is **meant to be edited by you**. The rest of the skill is canonical; this is your override layer. Read it before producing work with this skill, alongside [gotchas](gotchas.md). A project's `.design` contract or DESIGN.md outranks both.

## How to use this file

Add opinions that override or extend the defaults in the rest of the skill. Two types are useful:

1. **Hard overrides**: "I never use X." or "I always prefer Y over Z."
2. **Taste calls**: "When in doubt, lean toward A because B."

Be specific. Vague taste statements ("I like clean UI") don't help the agent. Concrete taste statements ("I prefer 1px borders to 2px in all cases; if a border needs more visual weight, increase color contrast not width") do.

A taste call should *orient* a decision, not *amputate* a possibility. "Default to a restrained palette" trains better work than "never use color": the first sharpens judgment, the second narrows the design before the problem is even seen.

## Your POV

> The narrow, opinionated calls the defaults above deliberately leave open. Examples:
>
> - I always prefer ____ over ____.
> - In my products, ____ is non-negotiable.
> - Skip ____, even if the rest of the skill recommends it. The reason is ____.

## Launch films

The defaults above govern product UI. A rendered launch film follows these calls instead:

- **Default register.** An unspecified "make a launch video" gets Skale's UI-motion register ([launch-video-registers](launch-video-registers.md)): rebuilt UI on a light ground with one accent, type as the script, the newest word in the accent before it settles, holds that creep on their entry vector (still share near 10 %), and hard cuts hidden on a cause, a constant ground or inside a fill ([launch-video-cuts](launch-video-cuts.md)). HeyGen's bouncy sting (zeta 1/3) only when someone asks for bounce.
- **"Lively" and "crazy" mean density and causality, not bounce.** Camera creep under every hold, rhythm that accelerates into a snap, a click that starts its consequence on the same frame, a glyph the camera dives through ([launch-video-motion](launch-video-motion.md), [launch-video-seams](launch-video-seams.md)).
- **Sound is OpenAI's register B, derived from the motion:** a bed in one key, clicks on the stamps, thuds on the landings, something taken away just before the name ([launch-video-sound](launch-video-sound.md), `sound-from-motion` (`khe-sound` skill)). A licensed beat track only when its drop and breakdowns can be placed on picture events (`launch-video-music` (`khe-sound` skill)). Never library blips dropped on frames.
- **Every film ships with its numbers** (cuts a minute, still share, loudness), measured on the render before it goes out ([launch-video-review](launch-video-review.md)).
