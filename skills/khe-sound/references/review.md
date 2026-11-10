---
title: review
summary: The brief for a fresh-eye review of sound work. What the reviewer gets, what they never get, the first question, how findings are ranked, and what "nothing" looks like.
tags: [sound, review, fresh-eye, checklist]
---

# Review

The brief for a fresh-eye review, run after the gate passes and [verify](verify.md) has been walked. The reviewer is a new agent or a person who did not build the work.

## What to hand over

- This file and [verify](verify.md).
- The `examples/` folder, with the one gold named that the work started from.
- The evidence: the sound map or cue sheet, the `.wav` files, the playback file, the gate's full output, and for a film the render and the `sound-sheet.mjs --report` onset list.
- A one-line brief: the product or film, its surface, and for a film the register and the loudness target.

Never hand over the builder's plan, the reasons behind any choice, or `CUES.md`. A reviewer who has read why a sound exists stops asking whether it should.

## The first question

Before the checklist: **which of these sounds would this product miss if it were deleted?** Go through the map row by row and answer from the row's own evidence: how often it is heard, what the eye sees at the same moment, what the user was doing. A sound whose only answer is "it is satisfying" is the first finding, ranked above every spec fault, even when the gate is green. For a film the question is: does the sound's structure sit on picture events, or was a bed laid under the film and left?

Then start from the brief's own words. If it says "to-do app", a press sound is a finding before anything else. If it names register B, a whoosh is.

## The reviewer's brief

You are reviewing sound someone else built. You have the map or cue sheet, the files, the playback code, the gate's output, [verify](verify.md) and the gold examples. You have not seen the builder's reasons and you do not need them.

Run the gate yourself on everything you were given:

```sh
node scripts/sound-check.mjs <everything you were handed> --gate
```

Then answer every question in [verify](verify.md) from evidence: a gate line, a number from a command you ran, a frame you stepped to, a row in the map. If the evidence a question needs does not exist (the onset list, a loudness reading, the fresh-profile playback run), make it before answering. A predicted fault is not a finding, and neither is a predicted pass.

You cannot hear. Never write how a sound sounds. Write what its file measures, where its cue sits and what its row claims.

Put the work beside the gold example it is closest to and say the one difference: the gold map has four silent rows and three sounds; how many does this one have?

Return a ranked list, in this order:

1. Sounds that should not exist, and sounds that are the only signal.
2. Playback and access: on by default, no mute, a context that drops the first click.
3. Placement: a transient before its contact, a cue with no frame, a lead-in.
4. The files: length, peak, channels, tail, a member from another material.
5. For a film: the register and loudness, the missing gap before the reveal, a licence.

Each item names the row, file or line, the number or gate line that shows it, and the fix in one sentence. End with what you could not check. If there is nothing, say "nothing" and list what you read, ran and measured.

## Rules of the review

- The bar for a finding is evidence. Quote the gate line, the command and its number, or the row.
- Rank by how much of the product or film it spoils, never by how easy it is to fix. One sound on every keystroke outranks ten files 20 ms too long.
- A line the builder called intentional is judged again. Read the file and the number, and decide as if the note were not there.
- Do not fix anything. Do not soften a finding because the gate is green.
- A candidate line with no reason beside it is a finding.
- These are findings even when no gate line names them: a map with no silent rows, a sound whose row gives no count per day, a family whose prompts do not share a material phrase word for word, a film sheet whose bed starts at 0 s and never changes, a description of how the audio sounds with no number behind it.

## What stays

Conventions are not faults. A notification that is longer and louder than a tick, a film in register C with no click layer, a dry reveal with silence between hits, a product with no sound at all: these follow the references and stay. An empty sound map is a valid result; never send it back for being empty.

## What "nothing" looks like

```text
Nothing.
Read: sound-map.json (3 cues, 4 silent rows), family.json (5 sounds), src/sounds.js
Ran: sound-check.mjs on all of it, --gate: sound check passed, 0 candidates
Measured: 5 files, each lead 0.0 ms, peak -3.0 dBFS, lengths 70 to 454 ms
Could not check: the 100th-use test, a laptop speaker, a phone
```
