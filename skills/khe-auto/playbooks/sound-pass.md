# Sound in a product

**You own this from "should this make a sound?" to files that are wired and mapped.** Most moments get no sound, and that answer is part of the job.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Settle the motion first** with `animate`, when the motion a sound lands on is not final. A sound placed on motion that changes gets placed twice. Exit: you can say "this motion will not change". Gate: none, `animate` ships no gate; play the motion and watch it.
2. **Decide** with `khe-sound`: which moments earn one, by how often they happen and what they tell the user. Exit: a short list of moments, and a longer list of rejected ones. Gate: none, a decision; the two lists are the evidence.
3. **Design one family** with `khe-sound`. One material for the whole product. Exit: a written palette. Gate: none, a decision; the written palette is the evidence.
4. **Generate** with `khe-sound`, with ElevenLabs or offline. Exit: one file per kept moment, every one from the family in step 3. Gate: `khe-sound/scripts/sound-check.mjs`.
5. **Wire it** with `khe-sound`: created inside a user gesture, a mute control, haptics on a phone where they fit. Exit: the mute control silences every sound, checked by using it. Gate: `khe-sound/scripts/sound-check.mjs`.
6. **Sync it** with `khe-sound`. Exit: every transient sits on its contact frame. Gate: `khe-sound/scripts/sound-check.mjs`.

**Reply:** the sound map (moment, file, frame), the rejected moments, how to mute it, the last line of the gate, and what was not tested on a device.
