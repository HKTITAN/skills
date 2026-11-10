---
title: gotchas
summary: Lived failures for this skill. Append a one-liner every time a claim is reported wrong.
tags: [gotchas, append-only]
---

# Gotchas

This file is **append-only**. Each time the agent (or you) reports him wrong in practice, add a one-line gotcha here: a claim he did not make, an article that changed, a disagreement that was missed. Do not edit an entry unless it is outright wrong.

## Format

```text
- [YYYY-MM-DD] One-line description of the gotcha. → the fix, and the reference that owns the claim
```

Keep each to one line. Your own calls on how to read him go in [pov](pov.md), not here.

## Entries

- [2026-11-10] The site prints three titles in sentence case ("Building a toast component") and the home page in title case. → Use the spelling in [sources](sources.md); the gate ignores case.
- [2026-11-10] The entrance scale is `0.95`, `0.93` or `0.5` depending on the article. → Never give one number; see [disagreements](disagreements.md).
- [2026-11-10] His index page links his skills at a repo name that differs from the one the skills CLI installs from. → Cite the page only for which skills exist; install lines belong to `khe-auto`.
