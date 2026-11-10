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

## Your POV

> The narrow, opinionated calls the defaults above deliberately leave open. Examples:
>
> - I always prefer ____ over ____.
> - In my products, ____ is non-negotiable.
> - Skip ____, even if the rest of the skill recommends it. The reason is ____.

## Diagrams

The defaults above govern product UI. A diagram follows these calls instead. A project's `.design` or DESIGN.md still outranks all three ([diagram-design-reconciliation](diagram-design-reconciliation.md)).

- **The default skin is diagram-design's.** With no contract, a figure keeps diagram-design's shipped editorial skin: off-white paper, ink strokes, one tangerine accent, Instrument Serif titles, Geist names and Geist Mono labels. A fork's product palette, display type and button treatment never reach a figure. Answer diagram-design's first-run gate with "keep default", and offer the `profile: default` marker, writing it only with consent.
- **Ask who edits it next; with no answer, make a figure.** "Make a diagram" that names no reader or editor gets one question ([diagram-decision](diagram-decision.md)). If nobody can answer it, as in a run with no one to reply, draw a finished diagram-design figure and note the assumption beside it. Open a tldraw board only when someone names one or says the team will keep editing it ([tldraw-canvas](tldraw-canvas.md)).
- **Static by default; `step` when the order is the point.** A flow, a lifecycle or a policy trace whose meaning is the sequence gets diagram-design's `step` mode, where the reader clicks through. Everything else is static. No `reveal`, no `loop` and no autoplay unless someone asks. The launch-film "lively" taste does not carry over, because a figure is read, not watched (animation decision framework).
