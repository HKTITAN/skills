# Package: five pricing cards and their hover previews

Work: a temporary route `/dev-cards-reel` that shows one real card at a time, `[data-reel]` items
For: X, watched muted on a phone
Format: hover-reel
Why this format: many items with the same interaction, each worth one look
Ideas:
- A: hover each of the five cards, a hard cut between them (`out/a-1.1s.png`)
- B: all five in a grid, the cursor sweeping across (`out/b-2.0s.png`)
- C: only the two cards with the richest previews (`out/c-1.1s.png`)
Chosen: A. One card per cut fills the phone screen; in B each card is a fifth of the frame
Stills: `out/a-1.1s.png`, `out/a-3.7s.png`
Approved: yes, after one round: the entry side now varies between the right edge and below
Capture: frame by frame on a paused clock, one item per pass, items rendered in parallel batches
Frame: 320x248 at DSF 8.25 (2640x2046)
Margin: 40px
Fps: 60
Length: 13s
Hook: the first preview starts scrolling at 0.9s
Cursor: the system arrow and hand, `C:/Windows/Cursors/aero_arrow_xl.cur` and `aero_link_xl.cur`, never drawn
First line: "Hover previews that scroll the real page beat screenshots. Five of them, and how they load:"
Post: drafted by `khe-content-engine` from this plan; a person posts it

Gate: package-check passed
Not verified: the preview pages' content on the day it is posted; how the cut rhythm reads past the third card.
