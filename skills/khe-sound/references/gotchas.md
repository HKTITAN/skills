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

- [2026-09-05] Agent added a click sound to every button and a "whoosh" to every route change. Users muted the whole site within a day. → Sound only on daily and rare moments, off by default. See [sound-decision-framework](sound-decision-framework.md).
- [2026-09-05] Agent created `new AudioContext()` at module load; sounds silently dropped until the second click. → Create and resume inside the first user gesture. See [sound-playback-web](sound-playback-web.md).
- [2026-09-05] Agent shipped a generated "success" sound with 40ms of leading silence; it read as lagging behind the check animation. → Trim to the first sample above −60 dBFS; transient on the contact frame. See [sound-spec](sound-spec.md) and [sound-motion-sync](sound-motion-sync.md).
- [2026-09-05] Agent prompted ElevenLabs with "futuristic UI success sound" and got a stock jingle with reverb. → Describe a material and a stick, add "dry, no tail", request 0.5s and cut. See [sound-generation-elevenlabs](sound-generation-elevenlabs.md).
- [2026-09-05] Agent pulled five sounds from three CC0 packs; the product sounded like a browser toolbar. → One material per product; re-pitch a single family. See [sound-palette](sound-palette.md).
- [2026-09-05] Agent laid a music bed under a logo reveal to hide the sync work; the piece felt cheap. → Cut with no bed first; place hits on frames; add a bed at −24 LUFS or not at all. See [launch-video-sound](launch-video-sound.md).
- [2026-09-28] Agent mastered a 60 s walkthrough to −14 LUFS "because platforms normalize". → Loudness is a register choice (medians ≈ −18 LUFS; the four loudest acclaimed films all run 38 s or less, at −12 to −13); keep −1 dBTP. See [launch-video-sound](launch-video-sound.md).
- [2026-09-28] Agent laid a retrieved music bed from 0 s at a flat level; the drop landed on nothing. → Trim the head so the drop lands on the reveal; break down under reading. See [launch-video-music](launch-video-music.md).
- [2026-09-28] Agent placed a library click by its file start; 158 ms of baked lead-in landed it 4 frames late at 24 fps. → Onset = first sample above 5 % of peak; trim it and place it where the press bottoms out. See [sound-motion-sync](sound-motion-sync.md).
- [2026-09-28] Agent mixed the film's sound in an editor after render; the next re-render shipped silent. → Every audio clip lives in the composition, each `<audio>` with its own id (an id-less one renders silent). See [sound-from-motion](sound-from-motion.md).
- [2026-09-28] Correction to the 2026-09-05 bed entry: its −24 LUFS was never measured. → A reveal under 15 s takes no bed (register A); any other bed or track needs its structure on picture events, at a loudness written for the register (−1 dBTP is the only fixed number). See [launch-video-sound](launch-video-sound.md) and [launch-video-music](launch-video-music.md).
- [2026-10-19] This graph told agents a whoosh "peaks on the settle"; a moving thing is loudest at its fastest, so an entrance's whoosh peaked on its slowest frame. → Peak on the fastest frame (the cut for an exit, mid-travel for a cross); a decelerating entrance gets an early whoosh and a landing sound on the settle. See [sound-motion-sync](sound-motion-sync.md).
- [2026-10-19] Agent mastered a launch film to −14 LUFS because earshot's and cinetic's references say so. → Both corpora are mostly music-led; loudness is still a register choice. See [earshot-reconciliation](earshot-reconciliation.md).
- [2026-11-08] Agent fired a medium haptic on every button and when a modal opened; on a phone the app buzzed constantly. → Haptics for commits, outcomes, snaps and thresholds only, on the visual's frame (web-haptics `SKILL.md`, settled here). See [web-haptics-reconciliation](web-haptics-reconciliation.md).
