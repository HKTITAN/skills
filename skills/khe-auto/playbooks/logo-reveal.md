# Logo reveal or mascot

**You own this from the source file to an asset that ships.** A flat export that happens to move is not the job.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Check for a contract** with `khe-design-tokens`. If the project has a `.design` file or DESIGN.md, its colors and curves are the only ones the file may use. Exit: the contract's path, or "no contract" stated. Gate: `khe-design-tokens/scripts/token-check.mjs` when a contract exists.
2. **Make or clean the file** with `khe-svg`. Exit: one viewBox, named groups, token colors, no editor junk, and a file size you can state. Gate: `khe-svg/scripts/svg-check.mjs`.
3. **Decide the engine** with `khe-svg`, by where the file will live: inline on a page, used as an image, or inside an app. The engine follows the home, never the other way round. Exit: the engine, and the home that chose it. Gate: none, a decision.
4. **Animate it** with `khe-svg`. A clip that needs turning into vectors goes through its video-to-vector steps first. Exit: the reveal plays once, ends on the final mark, and has a reduced-motion state that is the finished logo. Gate: `khe-svg/scripts/svg-check.mjs`.
5. **Sound, only if it earns one** with `khe-sound`. A reveal seen once can carry a sound. A logo in a header that loads on every page cannot. Exit: a cue on its contact frame, or a stated no. Gate: `khe-sound/scripts/sound-check.mjs` when a sound was made.
6. **Check it where it lives** with `khe-svg`: at its real size, on its real background, in light and dark. Exit: a capture of each of the three, looked at. Gate: `khe-svg/scripts/svg-check.mjs` on the file that ships.

**Reply:** the file path and size, the engine and why, what the reduced-motion state shows, the last line of each gate, and what you did not test.
