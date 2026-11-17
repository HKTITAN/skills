# Package: why menus should open with ease-out

Work: three scenes in one `index.html`; scene one is `examples/explainer/index.html` (linear and ease-out side by side)
For: X, watched muted on a phone
Format: explainer
Why this format: a comparison: two versions of one motion, mirrored, on the same frame
Ideas:
- A: three comparisons, linear vs ease-out, ease-in vs ease-out, 400 ms vs 200 ms (`out/a-0.55s.png`)
- B: one menu opening, with the curve drawn under it (`out/b-2.0s.png`)
- C: a real app's menu before and after the change (`out/c-1.0s.png`)
Chosen: A. The difference reads in under a second with two menus side by side; B explains a curve nobody asked about
Stills: `out/a-0.55s.png`, `out/a-4.6s.png`, `out/a-11.2s.png`
Approved: yes, after two rounds: the labels moved into mono and the slow-motion tag came forward
Capture: frame by frame from `window.render(t)`: `node scripts/render.mjs explainer index.html video out/ease-out-22s.mp4`
Frame: 1080x1080 at DSF 2 (2160x2160)
Margin: n/a, an explainer fills its frame
Fps: 60
Length: 22s
Hook: two menus open on the same frame at 0.4s and one is visibly ahead
Cursor: none; an explainer shows motion, not a pointer
First line: "Same menu, same 400 ms. Only the curve changed, and one feels twice as fast:"
Post: drafted by `khe-content-engine` from this plan; a person posts it

Gate: package-check passed
Not verified: the 4x slow-motion pass on a 60 Hz phone; whether the third scene's duration difference survives X's re-encode.
