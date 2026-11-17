<!-- teaching: the last line claims everything was checked -->

# Package: the metrics card's tab switch

Work: `examples/live/stage.html`, a metrics card with two tabs whose bars regrow on a switch
For: X, watched muted on a phone
Format: click-through
Why this format: one component and two states; the change between them is the whole point
Ideas:
- A: switch Visitors, Signups, Visitors, Signups; the bars regrow each time (`out/a-1.2s.png`)
- B: hover both tabs, then one click (`out/b-0.8s.png`)
- C: light and dark cards side by side, one click each (`out/c-1.0s.png`)
Chosen: A. The bars moving is the thing to see; B spends a second on hovers, C halves the card on a phone
Stills: `out/a-0.4s.png`, `out/a-1.2s.png`, `out/a-1.7s.png`
Approved: yes, after one round: the hand moved low and right of the label so it stops covering "Signups"
Capture: frame by frame on a paused clock: `node scripts/render.mjs live examples/live/shot.json video out/metrics-7s.mp4`
Frame: 540x388 at DSF 5.5 (2970x2134)
Margin: 60px
Fps: 60
Length: 7s
Hook: the first click lands at 0.9s and every bar regrows on it
Cursor: the system arrow and hand, `C:/Windows/Cursors/aero_arrow_xl.cur` and `aero_link_xl.cur`, never drawn
First line: "Bars that regrow from the baseline read as new data, not a redraw. The whole trick is one transform-origin:"
Post: drafted by `khe-content-engine` from this plan; a person posts it

Gate: package-check passed
Everything checked, ready to post.
