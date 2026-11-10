---
title: verify
summary: The last pass on a launch film. The film plan format, the gate's commands and lines, the yes/no questions answered from frames, the symptom-to-fix table and the FILM.md handover.
tags: [launch-video, verify, gate, plan, handover]
---

# Verify

The last pass. A plan answer comes from the plan file the gate read. A render answer comes from a frame, a contact sheet or a measurement you made, never from the composition source and never from memory. Fix the largest fault first, run the gate again, return to the top, and repeat until every answer is yes. The rules behind each question live in the reference named beside it.

## The film plan

A plan is one JSON file, written before any timeline exists. It holds every decision the gate can check. Times are seconds from 0. The first key may be `"//"` with a one-line note.

```json
{
  "//": "what this plan is for",
  "register": "ui-motion",
  "engine": "hyperframes",
  "runtime": 60,
  "fps": 30,
  "known_brand": false,
  "formats": [{ "aspect": "16:9", "width": 1920, "height": 1080, "layout": "master" }],
  "beats": [{ "id": "hook", "start": 0, "end": 1.6, "what": "first word at 0.2 s", "from": "structure: first seam 1.6 s" }],
  "first_word": 0.2,
  "first_seam": 1.6,
  "name": { "at": 17.4, "mode": "problem-end" },
  "payoff": 54.4,
  "endcard": { "start": 55, "hold": 2, "url": "relay.example", "verb": "Deploy with" },
  "cuts": 4,
  "still_share": 0.09,
  "seams": [{ "at": 1.6, "type": "cut", "technique": "cut the curve", "exit": { "axis": "x", "dir": -1 }, "entry": { "axis": "x", "dir": -1 }, "exit_moving": true, "entry_acts_in": 0 }],
  "type": [{ "at": 0.2, "text": "Still waiting?", "build": "word", "stagger": 0.2, "hold": 1.15 }],
  "prompts": [{ "at": 22, "chars": 33, "seconds": 2.2, "job": "read" }],
  "picture_locked": false,
  "sound": { "register": "C", "lufs": -17.7, "true_peak": -1 }
}
```

| Key | Rule |
|---|---|
| `register` | One of `ui-motion`, `founder-hybrid`, `live-action`, `product-camera`, `keynote-cards`, `kinetic-type`, `beat-cut`, `continuous-camera`. The two single-film rows (the CG teaser, the character-led film) are not registers a plan can name |
| `runtime`, `fps` | Seconds, and the native frame rate |
| `beats` | Contiguous from 0 to `runtime`: each `start` equals the `end` above it, within half a frame |
| `first_word` | Seconds, or `null` when the film carries no display copy |
| `name` | `at` in seconds and a `mode`: `early`, `problem-end` or `late`. `late` needs `known_brand: true` |
| `endcard` | `start` on a beat boundary and the final `hold`; `url` only with a `verb` |
| `cuts`, `still_share` | The count of hard cuts, and the share of still frames from 0 to 1. `cuts` equals the ledger rows not typed `morph` |
| `seams` | One row per scene change, typed `cut`, `match-cut` or `morph`. A `morph` or `match-cut` names its `carrier`. A crossfade or dip says `"shared_ground": true` |
| `type` | Each line's `build` (`word`, `letter`, `typed`), `stagger` between words and `hold` after the last one. `"card": true` marks a short title card that may accelerate |
| `prompts` | `chars`, `seconds` and a `job`: `read` or `recognise` |
| `picture_locked`, `sound` | The sound `register` (A to E), `lufs` and `true_peak` are named in every plan. `cues`, `track` and `stems` appear only once `picture_locked` is `true` |
| `formats` | `layout` says `master` or describes its own composition. `crop` and `letterbox` fail |

A beat sheet is the same plan as a table a person reads: a `register:` line, a `runtime:` line, a `name mode:` line and a `known brand:` line, then `| t | beat | taken from |`. Its rows include the first readable word, the first seam, the name, the payoff, and an endcard row whose beat opens with `endcard`, gives a range and says `hold <n> s`.

## Gate

```bash
node scripts/film-check.mjs plan.json --gate
node scripts/film-check.mjs plan.json beat-sheet.md review.md --gate --report film-check.json
node scripts/film-check.mjs plan.json render.mp4 --gate
```

- Does `--gate` on the plan end `film check passed`?
- With the render passed beside the plan, does it still end `film check passed`, with a `render:` line that states duration, frame rate and size?
- Is the output free of `inconclusive`? Exit 2 means the gate did not look, and it is never a pass. Without ffprobe it prints `inconclusive: ffprobe not found` and still checks the plan.
- Have you read every candidate line and written, for each one that stands, why it stands?

"Passed" means every never-intentional line is at 0 in the files the gate read. Passing is necessary, not sufficient: the gate reads a plan and a container, and no pixel.

## Register (first, because every other number depends on it)

- Is one register named on line one, with its cuts a minute, still share and loudness beside it? ([launch-video-registers](launch-video-registers.md))
- Does every number in the plan trace to that row, with none borrowed from a second row?
- On the render: were cuts recounted by eye from contact sheets stepped every 2 frames, at native fps?
- On the render: is the measured cut rate inside the row, and still share too where it was measured?
- Is a difference from another register's median called a difference of register, and left alone?

## Beats and the name

- Cover the motion and look at two frames only, t = 0 and the held endcard frame. Does each say what the product is? ([launch-video-structure](launch-video-structure.md))
- Is a readable word on screen by 1.3 s and the first seam by 3.6 s, read off the render?
- Does the name land in its mode's window: by 11 %, at 6 to 51 % where a problem act ends, or at 40 to 83 % for a brand the audience knows?
- Does the payoff land 0.1 to 1.2 s before the endcard cut?
- Does the endcard run 4.4 to 6.3 s, and does its final frame hold about 2 s?
- Does a URL on the endcard carry a verb and somewhere to go?

## Seams and cuts

- Step each seam from 2 frames before the cut to 2 after. Does the moving surface or carrier change position on all five frames? ([launch-video-seams](launch-video-seams.md))
- Is every cut taken on a cause, a constant ground, the element being read, a fill, or mid-motion? ([launch-video-cuts](launch-video-cuts.md))
- After each cut, does the incoming frame act within 0.3 to 0.4 s, or was the outgoing one still moving?
- Is every crossfade's midpoint free of a ground neither scene has?
- Does one direction run through the ordinary seams, with the Z sign matched across each?
- Are there 2 to 3 seam techniques, one carrying 60 to 70 % of the scene changes?

## Words, the UI demo and motion

- Is display copy built per word about 0.2 s apart, the newest word settled within 0.13 to 0.3 s, each line held 1.15 to 1.5 s? ([launch-video-type](launch-video-type.md))
- Does a prompt that carries the argument type at about 15 characters a second? ([launch-video-ui-demo](launch-video-ui-demo.md))
- Does the cursor read at the shown size, enter from off-frame and leave off an edge?
- Pause on any held frame. Is something meaningful mid-flight, or is the frame a deliberate hold? ([launch-video-motion](launch-video-motion.md))
- Is every UI object free of float, pulse and breathe, and every camera move free of springs and back eases?

## Sound and delivery

- Was picture locked before any cue or track was placed? ([launch-video-sound](launch-video-sound.md))
- Is the true peak at or under -1 dBTP, and the integrated loudness within 1 LU of the target written beside the register?
- Is something taken away just before the reveal, ending on the reveal frame?
- Does every rendered frame decode, with none flat, frozen or black? ([launch-video-review](launch-video-review.md))
- Does each file pass the delivery gates: frame count, H.264 level, size, the hardware decoder? ([film-as-function-of-time](film-as-function-of-time.md))
- Is each vertical or square cut its own composition inside its safe zone? ([launch-video-formats](launch-video-formats.md))

## Lines that are never intentional

Not candidates for judgment. Fix the cause and run the gate again. Clearing a line by deleting the field it points at, or by renaming a register until the numbers fit, is a bug: a missing field raises `plan-incomplete:`.

| Line | What it means |
|---|---|
| `unreadable:` | The file does not parse |
| `no-register:` | No register is named, so no number has a row to come from |
| `unknown-register:` | A register the references do not define, or two rows blended into one |
| `plan-incomplete:` | A decision the plan must settle is missing or is not a number |
| `plan-mismatch:` | Two parts of the plan disagree: `cuts` against the ledger, `first_seam` against the first row, the endcard against the beats |
| `beat-gap:` | Time between two beats that no beat covers |
| `beat-overlap:` | A beat that starts before the beat above it ends |
| `beat-sum:` | The beats do not add up to the runtime |
| `name-window:` | The name lands outside its mode's window, has no mode, or is held late for a product its audience does not know |
| `endcard-hold:` | A final hold under 1.1 s (UI motion, founder, live action) or 1.5 s (every other register), or longer than the endcard |
| `cut-rate:` | Cuts a minute outside the register's measured range |
| `still-share:` | Still share outside the register's measured range |
| `seam-untyped:` | A seam row with no type |
| `vector-mismatch:` | A cut whose exit and entry disagree on axis or direction: a pull answered by a push |
| `dead-cut:` | The outgoing scene has settled and the incoming one first acts past 0.4 s |
| `crossfade-dip:` | A crossfade or dip with no ground both scenes share |
| `block-fade:` | A line of copy faded in as one block |
| `type-too-fast:` | A prompt to be read above 33 characters a second, words under 0.065 s apart, or a line held under 0.5 s |
| `sound-before-lock:` | Cues, a track or stems placed while `picture_locked` is not `true` |
| `true-peak:` | A true-peak ceiling above -1 dBTP |
| `cropped-vertical:` | A vertical or square cut cropped from, or letterboxed around, the master |
| `unsourced-beat:` | A beat-sheet row with an empty "taken from" cell |
| `missing-beat:` | A beat sheet without the first word, the first seam, the name, the payoff, or the endcard and its hold |
| `no-frame:` | A review row whose Before has no time and frame, no quoted source line and no "whole film" |
| `no-owner:` | A review row whose Why names no owning reference |
| `no-not-checked:` | A review with no `Not checked:` line |
| `render-duration:` | The file differs from the plan's runtime by more than one frame |
| `render-fps:` | The file's frame rate is not the plan's |
| `render-frames:` | The file's frame count is not runtime times fps |
| `render-resolution:` | The file's size is not one of the plan's formats |
| `render-level:` | H.264 level above 4.2 at 1080p or 5.2 at 4K |
| `render-size:` | A 4K file of 1 GB or more |
| `gif-fps:` | A GIF at a rate other than 25 or 50 fps |

## Candidate lines

Reported for judgment. Each one that stands is written into FILM.md with its reason. `--strict` fails on them.

| Line | What it means |
|---|---|
| `cut-rate-edge:` | One cut more or fewer changes the verdict, the rate is past a UI-motion quartile (1.5 to 5.7), or it sits between the founder row's two modes |
| `still-share-edge:` | Within 0.03 of a range edge, or past a UI-motion quartile (0.067 to 0.13) |
| `thin-row:` | The register rests on two films |
| `name-edge:` | A late name in a row measured on Skale films, or a name at 22 to 40 % in a row measured on the acclaimed films |
| `hook-late:` | First word after 1.3 s, first seam after 3.6 s, or no first word outside product camera |
| `endcard-length:` | An endcard outside 4.4 to 6.3 s |
| `endcard-hold-edge:` | A final hold past 2.9 s |
| `payoff-gap:` | The payoff is not 0.1 to 1.2 s before the endcard cut |
| `seam-budget:` | More than 3 seam techniques, or none carrying 60 % of the cuts |
| `no-carrier:` | A `morph` or `match-cut` row that names no carrier |
| `type-edge:` | A read prompt above 21 characters a second, words under 0.13 s apart, or a hold under 1.15 s |
| `sound-fit:` | A sound register the references do not pair with this film register |
| `loudness-edge:` | A loudness target outside what the register's films measured |
| `register-length:` | A beat-cut film longer than 40 s |
| `engine-fit:` | scenario-kinetic-film named for a film outside the beat-cut row |
| `bare-url:` | A URL on the endcard with no verb |
| `format-size:` | A format whose size is not the one given for its aspect |
| `render-format:` | A file size the references do not list |
| `no-film-json:` | A review with no per-film JSON block |

## Where the gate's numbers come from

Three places where the references print a spread instead of one limit, and the figure the gate takes from it. The references agree with each other; to overrule a value, write it in [pov](pov.md).

- **The UI-motion row prints quartiles, not a lowest and highest film.** Past a quartile is `cut-rate-edge:` or `still-share-edge:`, which the review rubric calls a note. The hard edge is the figure [launch-video-registers](launch-video-registers.md) names as a film this register does not make: 9 cuts a minute, 29 % still.
- **The endcard's final hold is printed as a median with quartiles, not a shortest film.** The gate takes the lower quartile of the corpus the register was measured in as the minimum: 1.1 s for Skale's rows, 1.5 s for the acclaimed rows ([launch-video-structure](launch-video-structure.md)).
- **The hook is planned from medians and flagged past upper quartiles.** [launch-video-structure](launch-video-structure.md) and [launch-video-review](launch-video-review.md) both state the pair: plan a word by 0.2 to 0.7 s and a seam by 1.6 to 2.3 s; late is past 1.3 s and 3.6 s. The gate prints `hook-late:` past the quartiles, as a candidate.

"Near an edge" has two meanings, both taken from measurement error the references report: one cut either way (the tolerance [launch-video-registers](launch-video-registers.md) uses when it compares two cut counts), and 0.03 of still share (pulldown alone adds about 3 points, per [launch-video-review](launch-video-review.md)).

## What you see, what you do

| You see | You do |
|---|---|
| A plan whose numbers fit no row (`cut-rate:`, `still-share:`) | Name the register the product and brief pick, then move the numbers to its row; never move the register to the numbers |
| Two registers joined with a plus (`unknown-register:`) | Pick the primary row; the second rides inside it as an act and gives no numbers |
| A second the plan does not cover (`beat-gap:`, `beat-sum:`) | Extend the beat before it or start the next one there; a hold is a beat too |
| The name at 70 % for a product nobody knows (`name-window:`) | Move it to 11 % or earlier, or to where the problem act ends, median 29 % |
| An endcard that leaves before it is read (`endcard-hold:`) | Run it 4.4 to 6.3 s and hold the final frame about 2 s |
| A seam row with no type (`seam-untyped:`) | Decide it now: a `cut` needs a vector on both sides, a `morph` a carrier |
| A pull answered by a push (`vector-mismatch:`) | Match the Z sign: 1 to 1.2 out and 0.75 to 1 in, or the stamp's 1.18 and 0.78 inside HyperFrames |
| Two stills with a cut between them (`dead-cut:`) | Cut while the exit is still travelling, or have the incoming frame act within 0.3 to 0.4 s |
| A flash at the middle of a dissolve (`crossfade-dip:`) | Hard-cut on the palette change, or dip through one painted ground both scenes share |
| A sentence that arrives whole (`block-fade:`) | Build it per word about 0.2 s apart, the newest word marked, then hold 1.15 to 1.5 s |
| A prompt nobody can read (`type-too-fast:`) | Characters divided by 15 is the typing time; then hold 1.15 s |
| Cues in a plan whose picture can still move (`sound-before-lock:`) | Keep the register and loudness, delete the cues, lock picture, then hand to `khe-sound` |
| A 9:16 file that is the master with bars or a centre crop (`cropped-vertical:`) | Lay it out again: text inside top 270, right 120, bottom 420, left 64 px |
| A render 2 s shorter than its plan (`render-duration:`, `render-frames:`) | Find the mux that dropped frames; never trim the plan to fit the file |
| A render at another frame rate (`render-fps:`) | Render at the plan's rate; a resampled file fakes short moves |
| `inconclusive: ffprobe not found` | Install ffmpeg or measure the file elsewhere; write the render under Not checked until then |
| A candidate line you judge intentional | Read it again beside the reference; if it stands, write the line and the reason into FILM.md |
| Ten gate runs, all green, and the film still feels like a slideshow | Stop. The fault is not one the gate reads: call the fresh eye ([review](review.md)) |

## Not checked by the gate

The script reads a plan and a container. It cannot check:

- Whether the film is worth watching, and whether the register was the right pick.
- Any pixel. A dead cut, a foreign ground at a dissolve's midpoint and a one-frame reversal are read from frames.
- Cut counts and still share on a render. Recount by eye at native fps.
- Loudness, true peak and sync on a render. Read them with ffmpeg's `ebur128` and from frames.
- Motion inside a shot: a float on a UI object, a spring on a camera, a cursor too small to read.
- That every rendered frame decodes, and that the file plays on the hardware decoder.
- That a `taken from` cell is true. It checks that the cell is filled.

## Hand over

Write `FILM.md` beside the plan. A template:

```md
# Film: <name>
Register: <row>, <cuts a minute>, <still share>, <LUFS>
Gold: <the example you started from> (what you kept, what you changed)
Beats: first word <t>, first seam <t>, name <t> (<% and mode>), payoff <t>, endcard <start to end>, hold <s>
Engine: <engine>, and whose values win inside it
Measured: <file>, <duration> at <native fps>, <size>; frames decoded <n of n>; cuts recounted by eye <n>
Gate: <the last line of film-check.mjs --gate, pasted>
Lines: <each line the gate printed> -> <fix, or why it stands>
Review: <the reviewer's list> -> <your response>
Assumptions:
Unresolved:
Not checked: <formats, looks and cases nobody watched>
```

- Is the gate's last line pasted, not retyped?
- Does `Not checked:` name every format and case nobody watched?
