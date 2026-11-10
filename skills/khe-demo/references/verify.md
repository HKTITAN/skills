---
title: verify
summary: The last pass on a demo. The gate's commands and lines, the yes/no questions answered from frames, the symptom-to-fix table and the DEMO.md handover.
tags: [demo, verify, gate, handover]
---

# Verify

The last pass. A script answer comes from the file the gate read. A picture answer comes from the delivery file watched at full speed and from its contact sheet, never from the script and never from memory. Fix the largest fault first, record or export again, return to the top, and repeat until every answer is yes.

## Gate

```bash
node scripts/demo-check.mjs demo.json --gate
node scripts/demo-check.mjs demo.json out/take.take.json out/demo.mp4 out/demo.gif --gate --report out/demo-check.json
node scripts/demo-check.mjs --self-test
```

- Does `--gate` on the script end `demo-check passed`?
- With the take report and every delivery file passed beside the script, does it still end `demo-check passed`, with one `recording:` line per file stating duration, size, frame rate and codec?
- Is the output free of `inconclusive`? Exit 2 means the gate did not look at something (no ffprobe, a file not found, a recording with no script). It is never a pass.
- Have you read every candidate line and written, for each one that stands, why it stands?

"Passed" means every never-intentional line is at 0 in the files the gate read. A recording is checked against the one script passed with it; in a folder, a file is matched to the script whose name it starts with. Passing is necessary, not sufficient: the gate reads a script, a report and a container, and no pixel.

## State (first, because a dirty take cannot be shipped at any quality)

- Is every name, email, avatar, number and message on screen from the seed? Read the frames, not the seed file. ([state](state.md))
- Is the account a test account, and is there no password, token, key or signed URL in any frame, including the address bar and any log panel?
- Is there no notification, update banner, cookie banner, dev badge, bookmarks bar, other window, wallpaper or taskbar in any frame?
- Does the take report say `repeatable`, with two or more takes ending on the same screen?
- Is the date on screen the fixed clock's, and the locale the one the audience uses?
- Is the app yours to record, or one you are authorised to demo, and is that written in `DEMO.md`?

## Story

- Cover the script: can a stranger say in one sentence what the product did, from the file alone? ([script](script.md))
- Does the first frame work as a still: complete, nothing loading, real content?
- Is the last frame the payoff, held long enough to read, with nothing mid-change in it?
- Does one thing happen? Name any beat that could be cut without the sentence changing; cut it.
- For a loop: is the last frame the first, and is the way back something the viewer saw happen?

## Pace

- Does every pointer move end in an action on what it moved to? Name each move's cause from the sheet.
- Does the pointer travel, with no jump between two frames, and does it stay off the words being read or typed?
- Is there any stretch where nothing changes for over 1500 ms before the payoff? Find it on the sheet: repeated identical frames.
- Is every real wait ramped to about half a second, with no pointer movement or typing inside the ramp?
- Can each typed word be read as it lands?

## Size and file

- At the size it will be shown, is the smallest needed text readable? Open the file at that width, not at full size. ([capture](capture.md))
- Is the action large enough in the frame, or does it need a push-in?
- Is the take sharp at 1:1: one crop of the file beside a screenshot at the same scale?
- Does each delivery file play in the place it is going: the README preview, the page, the feed's uploader?
- Is the poster a frame from inside the payoff hold?

## Lines that are never intentional

The gate fails on any of these. Clearing one by removing the thing it points at from the script while keeping it in the take is a bug.

| Line | What it means |
|---|---|
| `unreadable:` | The file does not parse, or is not a demo script |
| `no-surface:` | No surface, a driver that cannot drive it, or a desktop plan with no app, window or capture |
| `no-destination:` | No destination, so no length, size or reading distance to hold the take to |
| `no-viewport:` | No viewport width, height and scale |
| `no-fps:` | No frame rate, or one that is not 30 or 60 |
| `odd-size:` | A capture size with an odd number of pixels on a side |
| `tiny-ui:` | The smallest text lands under 9 px on the viewer's screen, or nobody measured it |
| `beat-count:` | Fewer than 2 beats or more than 5 |
| `no-payoff:` | No payoff beat, or one that is not the last beat |
| `payoff-hold:` | The payoff does not end on a hold of 1500 to 3000 ms |
| `no-reset:` | No reset steps |
| `unknown-step:` | A step or a reset step the runner does not know |
| `no-target:` | A pointer step with no target |
| `brittle-target:` | A target by position, generated class, coordinate or snapshot ref |
| `no-wait:` | A step that changes the screen and names no condition to wait for |
| `fixed-sleep:` | A wait with no condition, or a hold over 1500 ms outside the payoff |
| `teleport:` | A pointer move with no travel time |
| `loop-seam:` | A loop with no visible way back, or whose last frame is not its first |
| `secret-on-camera:` | Something shaped like a key, token, card number or credential in what the script types, loads or opens |
| `real-email:` | An email address outside the reserved example domains |
| `take-differs:` | Two takes of one script ended on different screens |
| `take-duration:` | The file runs shorter or longer than its destination allows |
| `take-resolution:` | The file's size is not viewport times scale, nor a declared output |
| `take-fps:` | The file's frame rate is not the declared one |
| `take-size:` | The file is over its destination's ceiling |
| `take-codec:` | An `.mp4` that is not H.264 in yuv420p |
| `gif-fps:` | A GIF at a rate its frame delay cannot hold |

## Candidate lines

Reported for judgment. Each one that stands goes into `DEMO.md` with its reason.

| Line | What it means | Stands when |
|---|---|---|
| `beat-edge:` | Two beats | The opening frame already shows where the viewer is |
| `no-what:` | A beat with no sentence | Never for long: write the sentence |
| `hold-no-why:` | A hold with no reason | Never for long: write the reason or cut the hold |
| `wander:` | A pointer move the next step does not use | The move is the story (a hover that reveals something) and says so in `why` |
| `text-target:` | A target found by its words | The app is not yours to add a test id to |
| `long-type:` | Over 60 characters typed in one step | The typing is the feature (an editor, a prompt box) |
| `type-speed:` | Typing outside 6 to 15 characters a second | A code or number that is recognised, not read |
| `password-step:` | A password, code or card field typed on camera | Sign-in is the story and the account is the seed file's |
| `production-url:` | A host that is not local and has no test label | It is your own demo tenant with seeded data, named with `--allow-host` |
| `no-clock:` | No fixed clock | No date or time appears in any frame |
| `scale-1:` | Captured at scale 1 | The destination is a GIF only and nothing is cropped |
| `small-ui:` | The smallest text lands between 9 and 11 px | It was read at the shown size by someone who had not seen it |
| `viewport-fit:` | A viewport outside the destination's table | The product's layout needs that size |
| `whole-desktop:` | The capture area is the whole display | The user said yes, in chat, to recording it |
| `one-take:` | One take recorded | Never for a handover: record two |
| `slow-wait:` | A wait over 1000 ms on camera, not marked for a ramp | It was ramped in post and the script now says so |
| `gif-size-edge:` | A GIF between 5 and 10 MB | The mp4 cannot be used where it is going |

## What you see, what you do

| You see | You do |
|---|---|
| A real name, address, avatar or message in a frame | Replace it in the seed and record again; never blur it |
| A notification, banner or badge slides in | Dismiss it in the reset or silence the machine; record again |
| Take two differs from take one (`take-differs:`) | Find what the first take left behind and add it to the reset |
| The second take fails on a step that passed in the first | The same: the state is not restored. Read the step's condition against the leftover state |
| A spinner sits for seconds | Mark the wait `"ramp": true`, ramp the span to 0.5 s; past 8x, speed up the backend and record again |
| Nothing happens for two seconds, with no spinner | A hold too long or a sleep: cut it to what is read (`fixed-sleep:`) |
| The pointer jumps (`teleport:`) | Restore `pace.move_ms` to 300 to 900 and remove `"instant"` |
| The pointer sits on the label it clicked, or on the text being typed | Set the step's `"at"` so it lands off the words |
| The pointer goes somewhere and nothing follows (`wander:`) | Delete the move |
| Text is too small at the shown size (`tiny-ui:`) | A smaller viewport first, then the app's compact layout, then a push-in |
| The take is soft | It was recorded at scale 1 or upscaled: check the first frame's size and record at scale 2 |
| The GIF plays too fast or too slow (`gif-fps:`) | Export at 20 fps |
| The GIF is banded or huge | Build it with `post.mjs gif`; narrow to 640 or ship the mp4 with a poster |
| The mp4 will not play in Safari (`take-codec:`) | Export with `post.mjs mp4`: H.264, yuv420p |
| The loop jumps at the seam (`loop-seam:`) | Add `loop.return` and trim the tail to its end |
| The first frame flashes a skeleton or unstyled text | Tighten `ready` to wait for the content, and trim the head |
| A step times out only when recording | The machine is starved or the condition was true by luck: wait on the real result |
| A gate line you think is intentional | Look at the frames again; if it stands, write it in `DEMO.md` with the frame's time |
| Five takes, gate green, nothing improving | Stop. Fresh eye ([review](review.md)) |

## Not checked by the gate

- Whether the story is the right one, and whether the payoff is worth watching.
- Any pixel: what is on screen, whether it is real data, a notification, a bookmarks bar or a name.
- That the pointer's path looks like a hand.
- Dead air inside the file: the gate reads the script's holds and the report's waits, never the frames.
- That post did what it claimed: trims, ramps and zooms are judged by eye.
- That the app is yours to record, and that the account on screen is a test account.
- Sharpness: an upscaled file has the right size.

## Hand over

Write `DEMO.md` beside the script.

```md
# Demo: <name>
One thing: <the sentence>
Surface: <web or desktop>, <driver>, <recorder>; <viewport> at <scale>, <fps> fps
App: <whose it is, and the authority to record it>; host <local or the test host>
State: account <which seed account>; seed <file or step>; reset <steps>; clock <time>
Gold: <the example copied> (what was kept, what was changed)
Beats: 1 ... 2 ... 3 ... payoff, <n> s
Takes: <n>, repeatable <yes or no>; waits ramped <spans>
Files: <file> <duration> <size in px> <MB>, one per line
Gate: <the last line of demo-check --gate on the script, the report and the files, pasted>
Candidates: <each line that stands> -> <frame time> -> <why it stands>
Review: <the reviewer's list> -> <your response>
Assumptions:
Unresolved:
Not checked:
```

- Is the gate's last line pasted, not retyped?
- Does `Not checked:` name what nobody watched: a delivery file, a browser, the page it will sit on, the phone?
