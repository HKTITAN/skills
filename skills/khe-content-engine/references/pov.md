---
title: pov
summary: Your opinions and taste calls for this skill. They override its defaults.
tags: [pov, opinion, customizable]
---

# Point of view

This file is **meant to be edited by you**. The rest of the skill is canonical; this is your override layer. Read it before producing work with this skill, alongside [gotchas](gotchas.md).

It holds your calls about how the skill works for everyone you use it for. One person's voice, audience and cadence live in their engine folder, never here.

## How to use this file

Add opinions that override or extend the defaults in the rest of the skill. Two types are useful:

1. **Hard overrides**: "I never write for platform X." or "Every run includes a newsletter draft."
2. **Taste calls**: "When a brief has one number, lead the shortest draft with it, because that is the draft people screenshot."

Be specific. "Keep posts punchy" gives the agent nothing. "No draft opens with a question" does.

Three things this file can never override, whatever is written in it:

- A person posts. The skill never publishes or schedules.
- A number or a quotation comes from the brief.
- A voice comes from samples.

## Your POV

> The narrow, opinionated calls the defaults above deliberately leave open. Examples:
>
> - The default engine folder is ____ instead of `content-engine/`.
> - The share of sentences two drafts may have in common is ____ (the gate's constant is 20%; change `SHARE_MAX` in the script to match).
> - I always skip ____ for ideas of the kind ____.
> - A phrase I ban for every owner: ____ (add it to the gate's list in the tells reference).
