# Launch film

**You own this from the brief to a reviewed render.** The user wants a film they can post, not a plan they have to chase.

Picture locks before sound. Sound is placed on frames, and it cannot be placed on frames that still move.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Name the register** with `khe-launch-film`. One register, written down, before any beat is timed. Exit: the register and the runtime are stated in one line. Gate: none, a decision; the written line is the evidence.
2. **Time the beats, the words and the product demo** with `khe-launch-film`. Exit: a beat sheet with a time for the first word, the name and the endcard. Gate: `khe-launch-film/scripts/film-check.mjs` on the beat sheet.
3. **Build it** with `khe-launch-film`, in the project's film engine. A product demo inside the film follows `khe-launch-film`; one that plays on a page is `stageshow` and belongs to the Landing page playbook. Exit: a render that plays from the first frame to the endcard at native frame rate. Gate: `khe-launch-film/scripts/film-check.mjs`.
4. **Lock picture** with `khe-launch-film`. Seams and cuts settled, nothing left to retime. Exit: you can say "no frame will move again". Gate: `khe-launch-film/scripts/film-check.mjs`, run again on the locked cut.
5. **Place the sound** with `khe-sound`. One family, every transient on its contact frame. Exit: a cue sheet with a frame number per sound. Gate: `khe-sound/scripts/sound-check.mjs`.
6. **Review the render** with `khe-launch-film`, at native frame rate, against its own register's numbers, and the placed sound once more with `khe-sound`. Exit: cuts per minute, still share and loudness, measured on the file. Gate: `khe-launch-film/scripts/film-check.mjs` and `khe-sound/scripts/sound-check.mjs`.

Go back to the earliest broken step when a later one exposes it. A cut that lands off the beat is fixed in step 4, never patched with a louder sound in step 5. Every step after the fix runs its gate again.

**Reply:** the register, the runtime, the measured numbers, the last line of each gate, where the file is, and what you could not measure.
