---
title: plan
summary: The PACKAGE.md format the gate reads, field by field.
---

# The plan

One `PACKAGE.md` beside the source, written as the work goes and read by `package-check.mjs`. `Key: value` lines; `Ideas:` holds bullets. The last line is `Not verified:`.

```text
# Package: <the work, in a few words>

Work: <what was built, with its path or route>
For: <where it goes and how it is watched>
Format: explainer | click-through | hover-reel | recording-page | touch-cursor
Why this format: <one clause>
Ideas:
- A: <one way to show it> (`<still path>`)
- B: <another> (`<still path>`)
- C: <another> (`<still path>`)
Chosen: <the letter, and why not the other two>
Stills: <the two to four stills of the chosen look>
Approved: <the user's answer, and what changed in the rounds>
Capture: frame by frame on a paused clock: `<the render command>`
Frame: <W>x<H> at DSF <n> (<device W>x<device H>)
Margin: <px>, or n/a for an explainer
Fps: 60
Length: <seconds>s
Hook: <what the first second shows>
Cursor: <where the image came from>, or none
First line: "<the post's first line>"
Post: <who writes the rest, and that a person posts it>

Gate: <the last line of package-check --gate>
Not verified: <what nobody checked>
```

`recording-page` and `touch-cursor` skip the render fields (`Stills`, `Capture`, `Frame`, `Margin`, `Fps`, `Length`); the gate checks only their ideas, first line and last line.
