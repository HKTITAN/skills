---
title: brief
summary: What the film must show, decided before the register. The five-line brief, the one moment and its beat, the source inventory and a method per kind of material, three different approaches, the Shot Map fields on each beat, and the plan review before any render.
tags: [launch-video, brief, sources, shot-map, planning]
---

# Brief

The register decides how fast a film moves. The brief decides what it must show, and no number in this skill catches a film that shows the wrong thing. Hiten Shah's first cut of the Beam film spent its time on the window picker and the Dock, and the result Beam exists for, a window from another Mac working here like a local one, was barely on screen. Every pacing number could have passed. Write the brief first, find the real file behind its moment, and only then name the register.

## The five lines

The brief is the `brief` object in the plan, one line each. Write it before any beat is timed.

| Key | It answers | Weak | Strong |
|---|---|---|---|
| `viewer` | Who is watching, in which situation, doing which job now; the current workaround when it explains the change | "developers" | "an engineer whose deploys sit in a shared queue for most of an afternoon" |
| `promise` | What they understand or believe when it ends | "Relay is fast" | "a fix reaches staging minutes after it is written" |
| `moment` | The one scene you would keep if the film were cut to half its runtime. `beat` names the beat id that shows it | "the dashboard" | `{ "beat": "result", "what": "the staging URL turns green with the fix live" }` |
| `evidence` | The real file that shows the moment | "screens from the app" | "capture/relay-deploy-staging.mov, a real deploy" |
| `next` | What the viewer does afterwards, and the test that says the film communicated | "sign up" | "start a deploy; a cold viewer can say what Relay removes after one muted watch" |

- **One moment.** Two moments are two films; give the second its own cut ([publish](publish.md)).
- **The moment is a result, never the route to it.** Picking, navigating and setting up are the route. Every second spent there is questioned, because the viewer came for what the product makes possible, not for how to reach it.
- **The moment's beat holds at least 1.5 s**, the time the acclaimed films give a card or a line ([launch-video-type](launch-video-type.md)), and in practice as long as a cold viewer needs to read it at the size it will be watched. The gate prints `moment-missing:` under 1.5 s.
- **One product can need two openings.** A viewer who already fights the problem sees the gain at once; one who has never met it needs a few seconds of the old way first. Keep one brief and compare openings against it ([structures](structures.md)), and write down which you chose and why.

## The source inventory

Before the plan, list every file you have: name, dimensions, duration, what it shows, and one class.

| Class | Meaning | Use |
|---|---|---|
| `evidence` | The real product doing the thing | The only class a claim may stand on |
| `reference` | A film or style you admire | Direction only: its footage, marks and branding are someone else's work |
| `missing` | A shot the brief needs that does not exist | Record it, or change the promise; never fill it |

Each kind of material has its own method and its own check:

| Material | Method | Check |
|---|---|---|
| A recording with speech (a talk, a session) | Select moments, approve the cuts with timestamps before editing, frame, caption | Every cut keeps the speaker's meaning and caveats |
| A capture of the real UI, or screenshots | Timed scenes; crops, camera and type rendered from code ([film-as-function-of-time](film-as-function-of-time.md)) | Every state shown is one the product reaches, in the order it reaches them |
| Rebuilt UI (the UI-motion register, a `stageshow` demo) | Redraw the real states cleanly | A redraw, never an invention: every state, label and number is one the product produces |
| A diagram or slide | Reveal its own parts in the order you would explain them | Labels and relations unchanged; motion that changes the argument needs the owner's yes |
| A shot nobody can capture (a metaphor) | One built or generated scene | It shows no product UI, implies no measurement, and reads as illustration |
| A comparison | Same task, same starting state, same playback speed | A clock or a number only from measured, comparable runs; otherwise it is labelled illustrative |

A convincing screen the product never showed is still false. When the moment's source is `missing`, the gate prints `moment-missing:`: capture the product doing it, or change the promise.

## Three approaches

Before you commit to a beat order, sketch three approaches that differ in their first 3 s and in the order of evidence. The default three:

1. **Outcome first.** Open on the result, then show the real route to it.
2. **Problem first.** The old way until the name lands, where the problem act ends ([launch-video-structure](launch-video-structure.md)).
3. **Guided task.** One task from its starting state to its finished state, inside the product.

For each, write the first 3 s, the beat order, the file behind each beat, the on-screen copy, and what a cold viewer could misread. Pick one with a reason tied to the brief's viewer, and write the two set aside into `FILM.md`. Three colour treatments of one beat order are one approach, not three. When the product's job fits none of these, take the structure from [structures](structures.md) instead.

## The Shot Map

The beats are the Shot Map. Beside `what` and `from`, each beat carries:

| Field | Holds |
|---|---|
| `question` | What the viewer is asking at this point: why care, what happens, what changes for me, what next |
| `source` | The file the beat is cut or rebuilt from, or `missing` |
| `claim` | What the beat says is true about the product |

Check each kind of beat where it sits: the opening states the promise with the sound off; the demonstration's interactions are true and legible at the destination size; the outcome is something a stranger can explain; the close has the right date, link and call to action. A beat whose question you cannot write is cut, or given a job.

## Review the plan before rendering

After the gate passes and before anything renders, put the plan in front of the user and wait for a yes. A plan change costs a minute; a render that answers the wrong question costs the whole render. Answer five questions from the plan file:

1. Is the moment on a beat that holds at least 1.5 s, at a size readable where the film will be watched?
2. Does the beat order describe a path the product really takes? Cutting dead time is editing; reordering steps, or implying a step that never ran, is a false claim.
3. Does every label, number and capability on screen trace to an `evidence` file?
4. Does every beat have a `question`?
5. Which beat would a cold viewer most likely misread, and what in the plan stops it?

Keep the source files unchanged after approval, so the render can be reviewed against the same plan and the same material.

## Gotcha

A first cut that looks finished is the dangerous one. The Beam cut was clean, paced and on-brand, and it showed how to find the app instead of what happens once it opens; it was a fault of editing judgment, not of rendering. When a cut looks ready, play only the moment's beat and ask whether it alone would explain the product. If the answer is no, the time is in the wrong place.

## Sources

- Hiten Shah, "The Product Launch Video Playbook" (2026-11-16), sections 00 to 05 and 07: the brief, the moment, the source inventory, three approaches, the Shot Map and the plan review. What was taken, and what was left out, is in [sources](sources.md).
- The 1.5 s hold: the acclaimed films' card hold in [launch-video-type](launch-video-type.md).
