---
title: script
summary: The demo script file. The story in beats, the format, targets, condition waits, and the pointer and typing pace with the reason for each number.
tags: [demo, script, beats, waits, pointer, typing]
---

# The script

A demo is one JSON file, written before anything is recorded. The gate reads it, `record.mjs` runs it, and a desktop walk follows it. JSON, because a file a script can read without executing is a file a gate can check.

## The story

- **One thing happens.** Name it in a sentence that has the product as its subject: "A task is added and the count goes up." If the sentence needs "and then", it is two demos.
- **Two to five beats, the last one the payoff.** A beat is one sentence saying what the viewer sees. Two beats is a gesture and its answer; past five, nobody can say what was shown. The gate fails outside 2 to 5 (`beat-count:`) and reports exactly two (`beat-edge:`).
- **Open on a finished screen.** The first frame works as a still: real seeded content, nothing loading. Hold it 500 to 800 ms so it is read before anything moves.
- **The payoff is visible at the shown size** and holds 1500 to 3000 ms. 1500 ms is about six words read at 240 ms a word (250 words a minute); past 3000 ms the viewer has finished and the file is still. That frame is the poster: nothing mid-change in it.
- **No pointer move you cannot explain.** Every move goes to the next action. A move the next step does not use is `wander:`.
- **Leave sign-in, navigation and setup out.** They belong in the reset. The take opens where the story starts.
- **A loop returns by a cause.** For a GIF or an autoplaying loop, `loop.return` undoes what the demo added (Undo, untick, close) so the last frame is the first. A loop that jumps back is `loop-seam:`.

## Format

```json
{
  "//": "what this demo is for",
  "demo": "add-a-task",
  "surface": "web",
  "driver": "playwright",
  "url": "http://localhost:4173/",
  "destination": "site",
  "viewport": { "width": 1280, "height": 720, "scale": 2 },
  "fps": 30,
  "smallest_text": 15,
  "state": { "account": "seed: ana@example.com", "clock": "2026-03-02T09:41:00", "locale": "en-US", "timezone": "UTC", "scheme": "light" },
  "reset": [{ "do": "storage", "clear": true, "set": { "tasks.v1": [] } }],
  "ready": { "count": { "of": "[data-testid=list] li", "is": 5 } },
  "pace": { "cps": 12, "move_ms": [300, 900] },
  "beats": [
    { "id": "add", "what": "Add is pressed and the task saves.", "steps": [
      { "do": "click", "target": "[data-testid=add]", "until": { "visible": "[data-testid=saving]" } },
      { "do": "wait", "until": { "visible": "[data-testid=task-t6]", "ramp": true } }
    ] },
    { "id": "payoff", "payoff": true, "what": "The new row is in the list.", "steps": [
      { "do": "hold", "ms": 2000, "why": "the new row and the count are read" }
    ] }
  ]
}
```

| Key | Rule |
|---|---|
| `surface`, `driver` | `web` with `playwright` or `agent-browser`; `desktop` with `agent-desktop`, `agent-browser` (Electron) or `manual` |
| `url` | Web: where the take opens. `record.mjs --url` swaps the origin for a free local port |
| `app`, `window`, `capture` | Desktop: the app, its `width`, `height`, `scale` and position, and `capture.with` (`gdigrab`, `ddagrab`, `avfoundation`, `x11grab`) with `"area": "window"` |
| `destination` | `readme`, `site`, `social` or `film`. It sets length, size ceiling and reading distance ([capture](capture.md)) |
| `viewport` | `width`, `height` in CSS px and `scale`. Their product is the file's size. `"touch": true` for a phone |
| `fps` | 30, or 60 for a drag or a scroll |
| `smallest_text` | The smallest text the viewer must read, in CSS px. Measure it; `record.mjs` prints the smallest text on any target |
| `shown_width` | The CSS width the file is displayed at, when it is not the destination's default |
| `outputs` | Sizes of delivery files that differ from viewport times scale: `{ "file", "width", "height", "fps" }` |
| `state` | `account`, `clock`, `locale`, `timezone`, `scheme` ([state](state.md)) |
| `reset` | The steps that restore the seed. Never empty |
| `ready` | The condition that says the opening frame is complete |
| `pace` | `cps` and `move_ms`, only to move them from the defaults below |
| `beats` | 2 to 5, each with `id`, `what` and `steps`; the last has `"payoff": true` and ends on a `hold` |
| `loop` | `{ "return": [steps] }` when the file loops |
| `post` | `{ "zoom": 1.5 }` when post pushes in; the gate uses it for the reading size |

## Steps

| `do` | Needs | What happens |
|---|---|---|
| `click` | `target`, `until` | The pointer travels, rests, presses |
| `type` | `target`, `text` | Focuses the field when it is not focused, types at `pace.cps`, then checks the field holds the text |
| `press` | `key`, `until` | A key such as `Enter` or `Control+K` |
| `select` | `target`, `value`, `until` | Chooses an option |
| `drag` | `target`, `to`, `until` | Press on `target`, travel, release on `to` |
| `hover`, `move` | `target` | The pointer travels and stays. A `move` the next step does not use needs a `why` |
| `scroll` | `target` | Brings the target into view |
| `goto` | `url`, `until` | Navigation inside the story. Opening the app is not a step |
| `wait` | `until` | Waits for a condition and does nothing else |
| `hold` | `ms`, `why` | A pause for reading. At most 1500 ms outside the payoff |
| `mark` | `name` | Writes a named time into the take report, for cutting a poster or a zoom |

## Targets

A target is a Playwright selector on the web and a role with its name on the desktop.

| Use | Example | Why |
|---|---|---|
| A test id | `[data-testid=add]` | It survives a redesign, a reseed and a translation |
| A role and name | `role=button[name="Add"]` | It is what the accessibility tree and a desktop driver see |
| An id the app owns | `#new-task` | Stable when the app treats it as API |

Never: `:nth-child(2)` and other positions (one new row moves it), a generated class such as `.css-1x2y3z` (the next build renames it), an XPath, raw coordinates, or a snapshot ref such as `@e12` (it dies with its snapshot). Each is `brittle-target:`. A target by visible words (`text=Add`) is reported as `text-target:`: it breaks when the copy changes. Add a test id to the app when none exists; that is a one-line change the next demo also uses.

## Waits

Every step that changes the screen names the condition it waits for in `until`. The condition is the thing the viewer is waiting for.

| `until` | Passes when |
|---|---|
| `{ "visible": "<target>" }` | The element is visible |
| `{ "hidden": "<target>" }` | It is gone |
| `{ "text": "4 open", "in": "<target>" }` | The text is inside the target (the whole page without `in`) |
| `{ "url": "**/dashboard" }` | The page's URL matches |
| `{ "count": { "of": "<target>", "is": 6 } }` | Exactly that many elements match |
| `{ "value": { "of": "<target>", "is": "..." } }` | The field holds that value |
| `{ "fn": "window.appReady === true" }` | The expression is true in the page |

- **`timeout`** is 5000 ms unless the condition sets it. A condition that needs more is a wait the viewer will not sit through: fix the app or seed the result.
- **`"ramp": true`** marks a wait that takes real time and will be sped up in post. `record.mjs` writes every wait's length into the take report, and the gate reports any over 1000 ms that is not marked (`slow-wait:`). 1000 ms is where a pause stops reading as a response and starts reading as a stall.
- **Never a sleep.** A `wait` with no condition, or a hold over 1500 ms standing in for a load, is `fixed-sleep:`. It is dead air on a fast machine and a broken take on a slow one.
- **Never wait on network idle** for an app with polling, a socket or analytics: it never goes quiet.

## The pointer

`record.mjs` applies these to every pointer step. On another driver, set the same numbers by hand (`agent-browser mouse move <x> <y> --duration <ms>`).

| What | Value | Why |
|---|---|---|
| Travel time | `200 + 140 x log2(distance / target size + 1)` ms, held between 300 and 900 | Fitts's law: a hand takes longer for a far, small target. Under 300 ms the eye loses the pointer; over 900 ms the viewer is waiting for it |
| Floor the gate enforces | 150 ms | Under five frames at 30 fps there is no travel to see: `teleport:` |
| Speed along the path | Minimum jerk: slow out, fast middle, slow in | The measured shape of a human reach; constant speed looks like a machine |
| Path | A shallow arc, bent 6 % of its length | A hand pivots at the wrist and elbow; a ruler-straight path reads as scripted |
| Rest before a press | 120 ms | The pointer is seen to arrive before the button answers |
| Press | 90 ms down | A click that lasts one frame is invisible |
| After an action | 250 ms before the pointer leaves | The result registers while the cause is still on it |
| Where it lands | Inside the target and off its words: 85 % along a text field, the lower part of a button, the left quarter of a wide row | The pointer never covers what the viewer is reading or what is being typed. Set `"at": { "x": 0.5, "y": 0.6 }` on a step to choose |
| Between beats | It stays where the last action left it | A pointer that tidies itself away is a move with no cause |

On a phone viewport (`"touch": true`) there is no travel: a dot appears under each tap for the rest and the press, then leaves. A finger lifts between taps; a dot that slides across the screen is a mouse.

## Typing

| What | Value | Why |
|---|---|---|
| Speed | 12 characters a second (`pace.cps`) | About 140 words a minute: faster than a person types, slower than the 20 characters a second an adult reads, so each word is read as it lands |
| Range the gate accepts | 6 to 15 | Under 6 the viewer waits for letters; over 15 the text appears faster than it is read (`type-speed:`) |
| Rhythm | Each key within 25 % of its slot, from a fixed seed | Even spacing is a machine; a fixed seed keeps two takes identical |
| Length | At most 60 characters in one step | Five seconds of typing is the most a viewer follows. Seed longer text, or paste it in one step (`long-type:`) |
| Content | Invented, short, about the product | It is on camera and will be read |

## Holds

A hold is a fixed pause with a reason, for reading and nothing else.

- Size it to what is read: 240 ms a word (250 words a minute), never under 400 ms.
- Outside the payoff the cap is 1500 ms. More than that with nothing changing is dead air.
- The payoff hold is 1500 to 3000 ms and is the last step of the last beat.
- Every hold carries a `why`. A hold nobody can give a reason for is cut.

## Length

Add the beats before recording: opening hold, travel and press per action, typing at 12 a second, waits after the ramp at 0.5 s each, the payoff hold. A README loop lands at 6 to 12 s, a site demo at 8 to 20 s. Past the destination's ceiling in [capture](capture.md), cut a beat, never the holds.
