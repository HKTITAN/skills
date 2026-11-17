---
title: pov
summary: Your opinions and taste calls for this skill. They override its defaults.
tags: [pov, opinion, customizable]
---

# Point of view

This file is **meant to be edited by you**. The rest of the skill is canonical; this is your override layer. Read it before any job, alongside [gotchas](gotchas.md).

## How to use this file

Add calls that override or extend the defaults. Two kinds are useful:

1. **Hard overrides**: "Records go in `docs/pyramid.md`, not `PYRAMID.md`." or "This repo's lints are Biome, not ESLint."
2. **Taste calls**: "When a sweep finds more than five classes, place only the top one and list the rest."

Be specific. "Keep it clean" gives the agent nothing.

Three things this file can never override:

- A structural fix replaces the instruction (Hard rule 2).
- A check counts only after it fails on a real past mistake (Hard rule 3).
- No automation on a loop that does not verify itself (Hard rule 7).

## Your POV

> Examples to fill in:
>
> - Records go in ____ instead of `PYRAMID.md`.
> - The lint tool is ____; the dependency rule tool is ____.
> - A sweep reads the last ____ days of history.
> - I always want ____ (for example, every new check also added to the pre-commit hook).
