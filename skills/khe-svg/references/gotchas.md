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

- [2026-09-05] Agent rotated an SVG arm around (0,0); it orbited the corner. → `transform-box: fill-box` + explicit origin. See [svg-animation](svg-animation.md).
- [2026-09-05] Agent morphed a four-line rect into a four-arc circle with CSS `d`; Safari jumped. → same command count and type. See [svg-path-morphing](svg-path-morphing.md).
- [2026-10-08] supermemoryai `svg-animations`, a source this skill cites, lists `keySplines="0.34 1.56 0.64 1"` as a bounce. SMIL control points must stay within 0–1, so an agent that copies it gets an animation the browser rejects. → Make SMIL overshoot an extra keyframe in `values` / `keyTimes`, and keep every spline within 0–1. See [svg-animation](svg-animation.md).
