---
title: pov
summary: Your opinions and taste calls for this skill. They override its defaults.
tags: [pov, opinion, customizable]
---

# Point of view

This file is **meant to be edited by you**. The rest of the skill is canonical; this is your override layer. Read it before producing work with this skill, alongside [gotchas](gotchas.md).

## How to use this file

Add opinions that override or extend the defaults in the rest of the skill. Two types are useful:

1. **Hard overrides**: "I never use X." or "I always prefer Y over Z."
2. **Taste calls**: "When in doubt, lean toward A because B."

Be specific. "I like clean demos" gives the agent nothing. "Every README demo is a loop under 10 s, and the GIF is never wider than 720 px" does.

## Your POV

> The narrow, opinionated calls the defaults leave open. Examples:
>
> - My demos always open on ____ and never show ____.
> - The test account is always ____ from ____.
> - Skip ____, even if the rest of the skill recommends it. The reason is ____.

## Demos

Defaults a project can change here:

- **Default destination.** An unspecified "record a demo" is a README take: 1024 x 640 at scale 2, an mp4 and an 800 px GIF, 6 to 12 s.
- **Light scheme** unless the page the demo sits on is dark.
- **The mp4 is the deliverable and the GIF is the fallback.** Where a video autoplays, ship the video.
- **No push-in by default.** Choose the viewport so the text reads; push in only when one control is the whole story.
- **The clock reads 09:41 on a weekday,** so every take from every project looks like the same morning.
