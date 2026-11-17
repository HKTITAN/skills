---
title: sources
summary: Where the approach came from, and what was built fresh.
---

# Sources

The approach is Emil Kowalski's way of packaging work (the formats, stills before the render, frame-by-frame rendering on a paused clock, the crop and resolution rules, the real cursor that holds still, the timing numbers, and writing the post for a stranger), shared with Harshit Khemani and rewritten here in this collection's format. This skill is not written or endorsed by him, and it does not reproduce his skill's text or files.

Built fresh for this skill:

- `scripts/render.mjs`: the renderer. It seeks CSS and WAAPI animations to Playwright's fake clock on every frame instead of removing them, and it reads the cursor from the operating system at render time instead of shipping cursor images.
- `scripts/package-check.mjs`: the gate over the plan file and the rendered video.
- The gold plans, the explainer page, the live stage and the teaching pairs.

Not built yet: a script for the touch cursor on phone recordings ([formats](formats.md), Touch cursor).
