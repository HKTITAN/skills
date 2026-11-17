# Package: an annotation toolbar shown as a product shot

Work: a toolbar that pins numbered notes on any page, shown as Stageshow's `hero-demo` scene because the real extension needs a signed-in browser to run
For: X, watched muted on a phone, and the project's README
Format: stageshow
Why this format: there is no clean live page to point at, and a framed product shot says "browser extension" faster than a real tab full of other tabs
Ideas:
- A: the toolbar drops two numbered notes on a dashboard, then copies them (`out/a-1.5s.png`)
- B: one note opened into a comment card with the page dimmed behind it (`out/b-2.0s.png`)
- C: the same two notes on a phone-width page (`out/c-1.5s.png`)
Chosen: A. The numbered pins read in the first second; B needs the comment text to be read, C halves the window on a phone
Stills: `out/a-0.5s.png`, `out/a-1.5s.png`, `out/a-2.5s.png`
Approved: yes, after one round: the scene's faux cursor now ends on the copy button, not on the close button
Capture: frame by frame on a paused clock through the playground's `?capture=hero-demo` route: `node scripts/render.mjs live shot.json video out/annotations-8s.mp4`
Frame: 600x300 at DSF 6.8 (4080x2040), on a stage given a narrower design so a 2:1 scene keeps its short side at 2000 without passing 4096 on the long side
Margin: 0px, Stageshow framed the scene
Fps: 60
Length: 8s
Hook: the first numbered pin lands at 0.5s
Cursor: Stageshow's own faux cursor; no system cursor is drawn over it
First line: "Pin numbered notes on any page and hand them to your agent as one list. The toolbar, frame by frame:"
Post: drafted by `khe-content-engine` from this plan; a person posts it

Gate: package-check passed
Not verified: that the faux UI matches the shipped extension pixel for pixel; it is an illustration, and the post says so.
