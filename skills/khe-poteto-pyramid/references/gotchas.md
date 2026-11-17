---
title: gotchas
summary: Lived failures for this skill. Append a one-liner every time the agent gets a detail wrong.
tags: [gotchas, append-only]
---

# Gotchas

This file is **append-only**. Each time the agent (or you) gets a detail wrong in practice, add a one-line gotcha here. Do not edit an entry unless it is outright wrong.

A mistake agents make in one repo belongs in that repo: a placement in its `PYRAMID.md` and a check in its code. This file is for faults in how the skill itself works: a step that misleads, a tool option that changed, a gate line that fired wrongly.

## Format

```text
- [YYYY-MM-DD] One-line description of the gotcha. → the fix, and the reference that owns the rule
```

Keep each to one line. Taste calls go in [pov](pov.md), not here.

## Entries

- [2026-11-17] The rules-file lines are a heuristic over wording: "Prefer `x`" in a real judgment line raises `enforceable-prose`. → mark the line `(judgment)` after reading it; [prose](prose.md), Triage
