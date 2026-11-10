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

Be specific. Vague taste statements ("I like clean UI") don't help the agent. Concrete taste statements ("I prefer 1px borders to 2px in all cases; if a border needs more visual weight, increase color contrast not width") do.

A taste call should *orient* a decision, not *amputate* a possibility. "Default to a restrained palette" trains better work than "never use color" — the first sharpens judgment, the second narrows the design before the problem is even seen.

## Defaults

Starting points, not walls. Override any of them below.

- **Default to no motion; make it earn its place.** Animate only for continuity, affordance, feedback, hierarchy, or spatial sense — never decoration. If the UI wouldn't feel broken without it, delete it. Per [animation-decision-framework](animation-decision-framework.md).

## Your POV

> The narrow, opinionated calls the defaults above deliberately leave open. Examples:
>
> - I always prefer ____ over ____.
> - In my products, ____ is non-negotiable.
> - Skip ____, even if the rest of the skill recommends it. The reason is ____.
