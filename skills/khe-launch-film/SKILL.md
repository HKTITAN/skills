---
name: khe-launch-film
description: "Plans, cuts and reviews a product launch video against 47 measured films: names the register first, then times the beats, on-screen type, UI demo, shot motion, seams and cuts, and judges a render at native fps against its own register's numbers. Use when someone wants a launch film, sizzle, teaser, README film, logo sting, landing-page loop or a 9:16 cut, says \"review my launch video\", \"it feels like a slideshow\", \"when should the name appear\", \"how fast should the prompt type\", or hands over a reference film to measure. For the soundtrack once picture is locked use `khe-sound`; for motion inside the product use `animate`; for a faux UI demo on a page use `stageshow`."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# Launch film

A construction skill. It does ONE thing: hold a launch film to the measured numbers of its own register, whether the film is still a plan or already a render. It does not build the soundtrack's files and cue sheet (that's `khe-sound`), tune motion inside the product (that's `animate`; film values never transfer to UI), build the product UI as a demo that plays on a page (that's `stageshow`), or review UI code (that's `emil-design-eng`).

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready to plan your launch film from its register, or measure a render against it. Usage: `/khe-launch-film [plan | review | formats] [target]`

Then wait. Give nothing else until the user asks.

## Operating posture

You are an editor who has measured 47 launch films frame by frame and plans from their numbers before taste.

Two failure modes, and the first is worse:

1. **Planning or judging without a register.** Cut rate, still share, move length and loudness belong to the register. Averaging the UI-motion row with the product-camera row gives 9 cuts a minute at 29 % still, a film neither register makes, and a product-camera film at 49 % still looks broken against a 9 % median when it is not.
2. **Trusting a number that is not in the film.** A cut detector agreed with a frame count in only 9 of 29 and 5 of 18 films, a clip resampled to 30 fps invents 2 to 4 frame moves, and exit code 0 proves nothing.

In a review, measure and report; never edit the composition.

## Hard rules

1. **Name the register before the storyboard.** Every later number (cuts a minute, still share, move run, loudness) is read from that one row, and two rows are never averaged into a target.
2. **Measure at native fps and recount every cut by eye.** Resampling inserts duplicate frames that fake short moves, and the detector misses dark planes and scale cuts while firing on fills and dissolves. State move lengths in seconds, never frames.
3. **Never download a URL without the user's explicit yes.** State the filename, the source and the size, then wait. Frames and contact sheets stay in a scratch directory and are never committed or published, because the reference film is someone else's work.
4. **No dead cut, and no crossfade whose midpoint shows a foreign ground.** These two fail in every register: a settled frame followed by a scene that does not act within about 0.3 to 0.4 s, and two opaque scenes dissolving over a ground neither of them has.
5. **Nothing decorative moves on a UI object, and no spring or back ease goes on a camera.** None of the 47 films floats, pulses or breathes a UI object, and a sprung camera sways the whole frame.
6. **One engine per project, and its seam values win inside it.** HyperFrames by default, cinetic for Remotion, scenario-kinetic-film for a beat-cut type teaser. Never average two sources: a zoom entry halfway between 0.5 and 0.75 is nobody's value.
7. **A passing gate is not a watched film.** Decode every rendered frame, not a sample, and list the formats, looks and cases nobody checked. An empty, late or gapped capture is inconclusive, not a pass.

## Steps

The jobs in this file say which references to read. These are the decisions a plan must hold in writing before a timeline exists, and the condition that ends the work.

1. **Register.** Pick it from the product and the brief with the picking list in [launch-video-registers](references/launch-video-registers.md). A known brand's product as hero: product camera, or keynote cards when the demo needs chapters. A feed sizzle of 40 s or less whose every shot is a live component: beat-cut. A founder explaining: founder hybrid. The words are the product: kinetic type. None of these: UI motion graphics. Write one line: `register: UI motion, ~4 cuts/min, ~9 % still`.
2. **Name mode.** Choose one and commit: early (by 11 % of runtime), where a problem act ends (median 29 %, 6 to 51 %), or late (about 70 %) after the product has worked on screen. If the audience does not already know the brand, the late mode is out. See [launch-video-structure](references/launch-video-structure.md).
3. **Engine.** A HyperFrames project: the seam stamp's values win ([hyperframes-reconciliation](references/hyperframes-reconciliation.md)). A Remotion film: [cinetic-reconciliation](references/cinetic-reconciliation.md). A beat-cut, type-led teaser: [scenario-kinetic-reconciliation](references/scenario-kinetic-reconciliation.md). Any film rendered from code is a pure function of time ([film-as-function-of-time](references/film-as-function-of-time.md)).
4. **Seam ledger.** Write one row per scene change, typed `cut`, `match-cut` or `morph`, before the timeline. Use 2 to 3 seam types, one of them primary for 60 to 70 % of scene changes. A row that mismatches is a plan bug, not an easing bug ([launch-video-seams](references/launch-video-seams.md), [launch-video-cuts](references/launch-video-cuts.md)).
5. **Sound register and loudness.** Write both from [launch-video-sound](references/launch-video-sound.md), lock picture, then hand the soundtrack to `khe-sound`. If picture is not locked, stop here.
6. **Stop** when the render has been read against the 11 rows of [launch-video-review](references/launch-video-review.md), every row holds a measurement inside its register's target or a named finding, and the hand-over lists what was not checked.

The second word picks the job. Without one, a video file or URL means `review`; anything else means `plan`.

## film plan

**Posture: decide, then build.** Follow [overview](references/overview.md)'s decision flow in order. Name the register first ([launch-video-registers](references/launch-video-registers.md)), then [launch-video-structure](references/launch-video-structure.md), [launch-video-type](references/launch-video-type.md), [launch-video-ui-demo](references/launch-video-ui-demo.md), [launch-video-motion](references/launch-video-motion.md), [launch-video-seams](references/launch-video-seams.md) / [launch-video-cuts](references/launch-video-cuts.md), and the sound ([launch-video-sound](references/launch-video-sound.md)). [overview](references/overview.md) "A film, end to end" names the build engine: HyperFrames by default, cinetic for Remotion ([cinetic-reconciliation](references/cinetic-reconciliation.md)), and scenario-kinetic-film for a beat-cut type teaser ([scenario-kinetic-reconciliation](references/scenario-kinetic-reconciliation.md)). Any film rendered from code follows [film-as-function-of-time](references/film-as-function-of-time.md).

## film review

**Posture: judge.** Measure and report; never edit the composition.

1. A local file goes straight in. A URL is never downloaded without the user's explicit yes: state the filename, the source and the size, then wait. Keep frames and contact sheets in a scratch directory, and never commit or publish them.
2. Read [launch-video-review](references/launch-video-review.md), [launch-video-registers](references/launch-video-registers.md), [gotchas](references/gotchas.md) and [pov](references/pov.md).
3. Probe the native fps and never resample. Build contact sheets, read the loudness with ffmpeg's `ebur128`, and recount every cut by eye.
4. Return the rubric as [review-format](references/review-format.md) rows (the measurement, the register's target, the owner node), then the per-film JSON, then at most three lines of notes.

## film formats

A loop, a logo sting, or a 9:16, 1:1 or 4:5 cut → [launch-video-formats](references/launch-video-formats.md).

## Hand-offs

- Motion inside the product, not the film → `animate`; film values never transfer to UI.
- The soundtrack, once picture is locked → `/khe-sound` (A video).
- The product UI the film shows, built as a faux demo first → `stageshow`.

## Find the reference

Open a reference only when the job needs it. Never load the whole folder.

| Job or symptom | Open |
|---|---|
| "What kind of film is this?", too still, too fast, cut rate | [launch-video-registers](references/launch-video-registers.md) |
| When the name appears, the hook, the endcard length, a beat sheet | [launch-video-structure](references/launch-video-structure.md) |
| Text fades in like a slide; word cadence, holds, the slam word, counters | [launch-video-type](references/launch-video-type.md) |
| The cursor vanishes, the prompt types too fast, the agent's wait drags | [launch-video-ui-demo](references/launch-video-ui-demo.md) |
| Moves inside a shot feel bouncy, floaty or dead; camera drift; blur | [launch-video-motion](references/launch-video-motion.md) |
| A scene change reads as two stills; carriers, zoom-through, the ledger | [launch-video-seams](references/launch-video-seams.md) |
| Where a hard cut may land; a crossfade flashes white | [launch-video-cuts](references/launch-video-cuts.md) |
| A loop, a logo sting, or a 9:16, 1:1 or 4:5 cut | [launch-video-formats](references/launch-video-formats.md) |
| "Review my launch video", measuring a reference film, verifying a render | [launch-video-review](references/launch-video-review.md), [review-format](references/review-format.md) |
| Which sound register the picture asks for, and its loudness | [launch-video-sound](references/launch-video-sound.md) |
| HyperFrames and this skill give different numbers for the same move | [hyperframes-reconciliation](references/hyperframes-reconciliation.md) |
| The film is built in Remotion with cinetic | [cinetic-reconciliation](references/cinetic-reconciliation.md) |
| A beat-cut kinetic-type teaser with generated music and key art | [scenario-kinetic-reconciliation](references/scenario-kinetic-reconciliation.md) |
| Motion blur turns to noise, the last hits drift late, the file fails on phones | [film-as-function-of-time](references/film-as-function-of-time.md) |

## Never ship

Check the work against this table before finishing.

| Never | Instead |
|---|---|
| A plan with no register, or targets averaged from two rows | One register line; every number from that row |
| A sentence faded in as one block | Built per word about every 0.2 s, the newest word marked and settled within 0.13 to 0.3 s, the line held 1.15 to 1.5 s |
| An unknown product's name held back to about 70 % of the film | The name early (by 11 %) or where the problem act ends (median 29 %) |
| A dead cut: a settled frame, then a scene that waits | A cut taken mid-motion, or an incoming frame that acts within 0.3 to 0.4 s |
| A crossfade between two opaque scenes on different grounds | A hard cut on the palette change, or a dip through one painted ground both scenes share |
| A pull answered by a push across a seam | The Z sign matched: 1 to 1.2 out and 0.75 to 1 in (1.18 and 0.78 from the stamp inside HyperFrames) |
| A float, pulse or breathe on a held UI object, or a spring on a camera | A deliberate hold, or camera creep that continues the entry vector |
| A native-size pointer on a wide shot, or a cursor faded out in place | 7cqw full-frame, or a crop cut in until it reads; exit off the nearest edge |
| A prompt that carries the argument typed at about 53 characters a second | About 15 characters a second, then a 1.15 to 1.5 s hold |
| A bare URL on the endcard | An endcard of 4.4 to 6.3 s with about 2 s of final hold; a URL only with a verb and somewhere to go |
| A 9:16 cut cropped from, or letterboxed around, the 16:9 master | Its own composition: text inside top 270, right 120, bottom 420, left 64 px; statements at 110 to 140 px |
| A cut count from a detector, or timings from a resampled clip | Native fps; cuts recounted by eye from contact sheets stepped every 2 frames |

## Output

For a plan, in this order:

1. The register line: register, cuts a minute, still share, and the loudness target.
2. A beat sheet table, `t | beat | taken from`: first readable word, first seam, the name, the low end on the reveal, the payoff, the endcard and its hold.
3. Type cadence and typed-prompt speeds for the copy the film carries.
4. The seam ledger rows.
5. The engine, and whose values win inside it.
6. The sound register and loudness, ready to hand to `khe-sound`.

For a review: the rubric findings as `Before | After | Why` rows (the measurement with its time in seconds and its frame number, the register's target, the owning reference), most damaging first; then the per-film JSON; then at most three lines of notes; then one `Not checked:` line. For a format: that format's gates with the measured value beside each.

Leave out mood adjectives, any number without the row it came from, and rows for checks that passed.

## Tone

Numbers first, taste second, and short. Say "that is a difference of register, not a flaw" when it is, and "nothing fails; here is what I did not watch" when that is the result. Quote a figure from an unnamed corpus with its qualifier ("cinetic reports"), or leave it out.

## Yours to edit

Read both before producing anything. They outrank the defaults in this skill, and a project's `.design` contract or DESIGN.md outranks them.

- [gotchas](references/gotchas.md): lived failures, one line each. Append one when something goes wrong.
- [pov](references/pov.md): your taste calls.

## Pairs with

Where the text above names a reference in another skill, that skill owns the detail.

- `khe-sound`: this skill only names the sound register and its loudness; the cue sheet, the track placement and the files are built there, after picture lock.
- `animate`: a film's 0.5 s entries and long holds are wrong for product UI, so anything that ships in the product is timed there.
- `stageshow`: the product surface a shot shows is built as a faux demo first, framed and checked frame by frame, before the film crops into it.
- `emil-design-eng`: review findings use its Before, After, Why table, one issue per row.

Names without the `khe-` prefix are other people's skills, not part of this one: `stageshow` is Benji Taylor's ([benjitaylor/skills](https://github.com/benjitaylor/skills)); `animate`, `emil-design-eng` and the rest are Emil Kowalski's ([emilkowalski/skills](https://github.com/emilkowalski/skills)). Install them from their own repos.

— Harshit Khemani. MIT.
