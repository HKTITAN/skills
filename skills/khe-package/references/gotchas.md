---
title: gotchas
summary: Lived failures for this skill. Append a one-liner every time the agent gets a detail wrong.
tags: [gotchas, append-only]
---

# Gotchas

This file is **append-only**. Each time the agent (or you) gets a detail wrong in practice, add a one-line gotcha here. Do not edit an entry unless it is outright wrong.

This file is for faults in how the skill itself works: a step that misleads, a renderer quirk, a gate line that fired wrongly.

## Format

```text
- [YYYY-MM-DD] One-line description of the gotcha. → the fix, and the reference that owns the rule
```

Keep each to one line. Taste calls go in [pov](pov.md), not here.

## Entries

- [2026-11-17] A shot-list target matched by exact text never resolved when the control also held a number ("Signups 1,284"). → render.mjs now tries the role name, then loose text; [render](render.md)
