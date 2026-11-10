---
title: teaching
summary: The bad/good pairs in teaching/, one row per folder. The same demo script twice, with one thing wrong in the bad half.
tags: [demo, teaching, pairs]
---

# Teaching pairs

`teaching/` holds fourteen pairs. Each folder is named for the gate line its `bad` half raises. Both halves are the same script, adding a task in the sample app, with one decision changed; the first key of each file says what.

Use a pair to diagnose your own script: find the folder whose line the gate printed, or whose description sounds like your take, and read why the good half works. Diff the two halves; the diff is the whole lesson. The bad halves are never starting points. Start from the closest gold in `examples/`.

The pairs are also the gate's tests. `node scripts/demo-check.mjs --self-test` fails if any `bad` file stops raising its folder's line, raises a second never-intentional line, or if any `good` file raises one.

## State

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-reset/` | `"reset": []`. Take one adds row `t6`; take two opens on six rows and adds `t7`, so the wait for `t6` passes at once and the take is wrong | One `storage` step that writes the five seeded tasks before every take ([state](state.md)) |
| `teaching/secret-on-camera/` | The typed task is a string shaped like an API key | Everything typed on camera is invented. The gate reads what the script types, loads and opens |
| `teaching/real-email/` | The typed task carries an address from a real directory | An address on `example.com`: the domain is reserved, so it is nobody's |

## Story

| Failure | Look at | Correction |
|---|---|---|
| `teaching/beat-count/` | Seven beats: add, tick, filter, clear the filter | Four beats and one thing. The other three are another demo ([script](script.md)) |
| `teaching/no-payoff/` | No beat is marked `"payoff": true` | The last beat is the payoff: the result, on screen, held |
| `teaching/payoff-hold/` | The payoff holds 300 ms | 2000 ms. The file ends after the count is read, and the poster is cut from this hold |
| `teaching/loop-seam/` | `loop.return` only rests, so the loop jumps from six rows back to five | `loop.return` presses Undo: the row leaves by a cause the viewer sees |

## Pace

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-wait/` | The click on Add has no `until` | It waits for the Saving row, the thing the viewer sees answer the press |
| `teaching/fixed-sleep/` | A 2500 ms hold stands in for the save | A `wait` on the new row, marked `"ramp": true`: as long as the app takes, then shortened in post |
| `teaching/teleport/` | `pace.move_ms` is `[0, 0]` | 300 to 900 ms, set by distance and target size |

## Targets and size

| Failure | Look at | Correction |
|---|---|---|
| `teaching/no-target/` | A click with no `target` | The field's test id |
| `teaching/brittle-target/` | `form > button:nth-child(2)` | `[data-testid=add]`. A position breaks when one control is added |
| `teaching/no-viewport/` | A viewport with no `scale` | Width, height and scale: 1280 x 720 at 2 is a 2560 x 1440 file the gate can check |
| `teaching/tiny-ui/` | A README take at 1920 x 1080: 15 px labels land at 6.5 px | 1024 x 640: the same labels land at 12.2 px ([capture](capture.md)) |

## What a pair cannot show

A script pair shows a decision. It cannot show a frame. These faults need the take and its contact sheet:

- **Real data that came from the database,** not from the script. The gate never sees it.
- **A notification, a banner or another window** in the capture.
- **A pointer that is technically moving and still looks wrong:** resting on a label, crossing the text being read.
- **Dead air the script did not plan:** a slow first paint, a font swap, a hold that is the right length for nothing.
- **A soft take.** An upscaled file has the right size.

The gate proves `no-surface:`, `no-destination:`, `no-fps:`, `odd-size:`, `unknown-step:`, `take-differs:` and every recording line (`take-duration:`, `take-resolution:`, `take-fps:`, `take-size:`, `take-codec:`, `gif-fps:`) on scripts, reports and probe results built inside its own self-test, because each is one field wrong and needs no folder.

## Making a pair

Change one thing. Copy `examples/web-flow.demo.json`, break one decision, and name the folder for the line the gate prints. Run `--self-test`: the new `bad` file raises that line and no other never-intentional line, and its `good` file raises none. A pair that needs two changes to fail is two pairs.
