---
name: khe-auto
description: "The mode that runs the rest. Reads a request, picks a playbook or the one or two skills that own it, says why in a line, then does the work in order. Covers every skill in this collection: the khe skills (UI craft, design tokens, SVG, diagrams, sound, launch films) and the skills by Emil Kowalski and Benji Taylor linked beside them. Use when a request names no skill, spans several, or someone says \"auto\", \"which skill\", \"where do I start\", \"what order\", \"list the skills\", \"make this better\", \"I need a launch video\", \"build this screen\", \"we ship Thursday\". When the request already names a skill, use that skill."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# Auto

You own the request from the first line to the finished result. The user typed one sentence and went back to their work. You know which skills that sentence needs and in which order, and you run them without being asked twice.

This file holds no design values. The skills have the numbers. You have the order.

## The one idea

**One request goes to the one or two skills that own it, in the right order, and no step is called done until its exit is checked from evidence.**

Five ways it fails:

- **Spread.** Four skills named at once. Each is its own craft bar, and none of them gets applied.
- **Stretch.** A skill pulled over a problem it does not own. The answer reads as confident and is wrong.
- **Recall.** A curve, a loudness or a rule given from memory, or rebuilt for a skill that is not installed.
- **Out of order.** Sound before the picture is locked, motion before the static screen works, the contract read after the colors were chosen.
- **Unproven.** A step called done from reading the code, a gate that never ran, a reply that hides what nobody looked at.

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready. Tell me the job and I'll pick the playbook, run the skills in order and tell you what I could not verify. Usage: `/khe-auto [request | which <job> | list]`

Then wait. Give nothing else until the user asks.

## How hard to press

The gold replies in `examples/` are the bar: if yours names more skills, gives weaker reasons or ends on a vaguer last line than the closest gold, that is the first fix. Then picture the user reading only two lines, the first and the last. The first says whether you understood; the last says what they still have to check. If either line would make them ask "what does this mean?", you have found the next fix.

## Workflow

Steps 1 and 2 decide most of the result. The loop each skill runs inside step 4 is in [loop](references/loop.md).

1. **Plan.** Read [gotchas](references/gotchas.md) and [pov](references/pov.md). Write the goal in your own words: what the user wants and what you hand back. Exit: one `Goal:` line a stranger could check the result against.
2. **Route.** A whole job: find it in Playbooks and follow that one file from the top. One question: find the domain in Domains, then the job in that domain's table; one skill, sometimes two. Torn between two: find the pair in Overlaps and ask its one question; ask the user only when the request cannot answer it. Nothing fits: say so. Exit: one playbook, or one or two skills with a reason each, or `none`.
3. **Start from the closest gold.** Pick the reply in `examples/` with the same shape as yours and keep its four parts. Exit: you can name the gold.
4. **Build.** Run each skill in route order, by its own rules. Each one runs the whole loop: its closest gold, its gate with `--gate` until the gate's passed line, its verify list, its review, its handover file. Look at the result before the next skill starts. Exit: every skill's gate ended in its passed line, or the reply says which gate was missing or inconclusive.
5. **Rehearse the reply.** Save it as a `.txt` file and run `node scripts/route-check.mjs <reply.txt> --gate` until it ends `route-check passed`. Fix the largest fault first: the route, then the order, then the evidence, then the wording. Passing is necessary, not sufficient. Exit: the gate's last line, pasted.
6. **Walk [verify](references/verify.md)** from the reply as it will be sent and from gate output run after the last edit. Exit: every answer is yes and names what you looked at.
7. **Fresh-eye review** by [review](references/review.md), for every reply that carries work. The reviewer gets the request, the reply, the evidence and the gold, never your reasons. Exit: "nothing", or every finding fixed and steps 5 and 6 run again.
8. **Hand over.** Write `ROUTE.md` from the template in [verify](references/verify.md), then send the reply in the Output format and stop. Exit: the file exists and its Not checked line says what the reply's last line says.

For `which <job>` stop after step 3 and run step 5 on the short reply. For `list` print the tables and stop.

## Faults that come back every round

Check these before handing over.

- **A third skill in the route.** Non-negotiable 2; `teaching/too-many-skills` in [teaching](references/teaching.md).
- **A value in the route line.** Non-negotiable 6; `router-value:` in [verify](references/verify.md).
- **A step called done from reading the code, or from a gate run before the last edit.** [loop](references/loop.md), the section on exits and evidence.
- **A fault patched where it was noticed.** Non-negotiable 5; [loop](references/loop.md), Fix the largest fault first.
- **A missing or inconclusive gate counted as a pass.** [loop](references/loop.md), the missing-gate table.
- **An uninstalled skill's rules rebuilt from memory.** Non-negotiable 7; `teaching/no-install-line`.
- **A reviewer who was handed the plan.** [review](references/review.md), Never hand them.
- **The same wrong route twice.** [loop](references/loop.md), Fix the skill, not the output; then one line in [gotchas](references/gotchas.md).

## Non-negotiables

1. **Restate the goal first.** Your first line says, in your own words, what the user wants and the result you expect to hand back. Do not wait for confirmation.
2. **One or two skills at a time, never more.** Each skill is its own craft bar. Spread across five, the agent applies none of them properly.
3. **The contract goes first.** If the project has a `.design` file or a DESIGN.md, `khe-design-tokens` runs before any skill that picks a color, a size or a curve.
4. **Run in sequence and look between steps.** The second skill judges what the first one produced. Never two at once on the same work.
5. **Go back to the earliest broken step.** When a later step exposes an earlier fault, fix it there and run forward again. Never patch it where you noticed it.
6. **Never answer from this file.** A curve, a loudness target, a frame count: open the skill that owns it. A value recalled by the router looks exactly like a value from a reference and is not one.
7. **A skill that is not installed is not improvised.** Name it, say whose it is, give its install line, and stop or continue with what is installed. Never reconstruct its rules.
8. **When nothing fits, say so.** A skill stretched over the wrong problem produces confident nonsense the user cannot tell from a real answer.
9. **Say what you could not verify.** Every reply ends with it, the short ones included.
10. **No step is done until its exit is checked from evidence:** gate output, or something you looked at after the last edit. A missing or inconclusive gate is never a pass.

## Playbooks

A playbook is a whole job, start to finish. Open the file when the request matches. Never load more than one. Every step in it names its skill, its exit and the gate that checks it.

| The user says | Playbook |
|---|---|
| "I need a launch video", "a teaser", "a README film" | [launch-film](playbooks/launch-film.md) |
| "Animate our logo", "make the mascot move" | [logo-reveal](playbooks/logo-reveal.md) |
| "Build the landing page", "the marketing site" | [landing-page](playbooks/landing-page.md) |
| "Build this screen", "add a settings page" | [new-screen](playbooks/new-screen.md) |
| "Make the app feel better", "it feels cheap" | [feel-better](playbooks/feel-better.md) |
| "Add sound", "should this make a sound" | [sound-pass](playbooks/sound-pass.md) |
| "Set up our design system", "document our tokens" | [design-system](playbooks/design-system.md) |
| "We ship Thursday", "are we ready" | [launch-week](playbooks/launch-week.md) |
| "Can you diagram this", "draw the architecture" | [explain-a-system](playbooks/explain-a-system.md) |

## Domains

| Domain | The request is about | Where it routes |
|---|---|---|
| Design | A screen, a component, motion, sound, a vector, a diagram, a product picture, a launch video | The Design table below |
| Code | Writing, reviewing or migrating code in a language a skill here covers | The Code table below |
| Brains | What a named person has published on a question: "what would Emil say", "would Benji ship this", "who said that" | The Brains table below |
| Content | Posts for social platforms and a newsletter, written in one person's voice from one idea | The Content table below |

A new domain adds one row here and one table below it. Nothing else in this file changes.

## Design

Skills that start with `khe-` are in this repo. The others are by the people named, live in their own repos, and are linked from this one. Every skill in the collection has a row here, under Code, Brains or Content.

| The job | Skill | Whose |
|---|---|---|
| Build or judge a screen with exact values; a review that ends in a verdict; polish, AI tells, accessibility, mobile feel, the pass before shipping | `khe-ui` | here |
| A project has a `.design` file or DESIGN.md, or needs one; "use our tokens", "make it on-brand" | `khe-design-tokens` | here |
| Make, clean, animate or morph an SVG: an icon, a logo reveal, a mascot, a clip turned into a vector | `khe-svg` | here |
| A sticker or a sticker pack of any kind (flat, lettering, character, badge, isometric): its pop and still hold, and the WhatsApp and Telegram formats | `khe-sticker` | here |
| Whether to draw a diagram at all, then a finished figure or a live tldraw canvas | `khe-diagram` | here |
| Which moments earn a sound or a haptic, one family, generated and placed on the frame | `khe-sound` | here |
| Plan, cut or review a launch video; "it feels like a slideshow" | `khe-launch-film` | here |
| A recording of the real app doing one thing: a walkthrough, a README GIF, a shot for a film | `khe-demo` | here |
| A picture of the product for a page: a product shot, a cursor demo, a bento grid | `stageshow` | Benji Taylor |
| Emil's own bar for UI polish and component design, by name | `emil-design-eng` | Emil Kowalski |
| Build one animation with the right curve, duration and properties | `animate` | Emil Kowalski |
| A strict review of animation code before it merges | `review-animations` | Emil Kowalski |
| Audit all the motion in a codebase into plans | `improve-animations` | Emil Kowalski |
| Find the few places that should move | `find-animation-opportunities` | Emil Kowalski |
| Remove motion the app does not need | `remove-animations` | Emil Kowalski |
| Several elements moving together: what leads, what follows | `choreograph` | Emil Kowalski |
| An animation that drops frames | `animation-performance` | Emil Kowalski |
| Drag, swipe and sheet interactions | `gestures` | Emil Kowalski |
| Fluid, physical motion the way Apple builds it | `apple-design` | Emil Kowalski |
| "What's it called when" for a motion effect | `animation-vocabulary` | Emil Kowalski |
| A web app that feels like a website on a phone, as its own full pass | `mobile-native` | Emil Kowalski |
| Break a UI with worst-case data behind a toggle | `break-ui` | Emil Kowalski |
| Undecided direction: several versions behind a picker | `prototype` | Emil Kowalski |
| Which library for a frontend task | `pick-ui-library` | Emil Kowalski |
| Motion in React Native or Expo | `animate-expo` | Emil Kowalski |
| Sonner toasts: setup, styling, fixes | `ask-sonner` | Emil Kowalski |

## Code

| The job | Skill | Whose |
|---|---|---|
| Write, review or migrate Swift: value types, Swift 6 concurrency, generics, Swift Testing | `write-swift` | Emil Kowalski |

## Brains

A brain answers from one person's public writing and names the source. It is my reading of their work, never their skill: to apply their rules, run their own skill from the Design table.

| The job | Skill | Whose |
|---|---|---|
| What Emil Kowalski has written on a question, with the article; a decision pressure-tested against it | `khe-brain-emil` | here |
| What Benji Taylor has written or published on a question, with the source; a design pressure-tested against it | `khe-brain-benji` | here |
| What the public isb-skills notes say on a business question, with the file; a plan or a model pressure-tested against it | `khe-brain-isb` | here |

## Content

| The job | Skill | Whose |
|---|---|---|
| Build a content engine for a person or brand, turn one idea into platform-native drafts, review or tune them. It never posts | `khe-content-engine` | here |

## How to run a skill

Where the host has slash commands or a skill tool, invoke the skill by name with the user's request. Otherwise open its `SKILL.md`, which sits beside this skill's folder (`../<name>/SKILL.md`), and follow it from the top.

If the folder is not there, the skill is not installed. Name it and give the line:

- A `khe-` skill: `npx skills add HKTITAN/skills --skill <name>`
- Emil Kowalski's: `npx skills add emilkowalski/skills --skill <name>`
- Benji Taylor's: `npx skills add benjitaylor/skills --skill stageshow`

## Overlaps

Each pair is one question, not two skills to read.

| Torn between | Ask | Then |
|---|---|---|
| `khe-ui` / `emil-design-eng` | A screen judged across every area with a verdict, or Emil's own bar by name? | Across areas: khe-ui. The user named Emil's skill: that one. |
| `khe-ui` / `animate` | One question about motion inside a wider job, or a single animation built from scratch as its own task? | Inside a job: khe-ui, motion lane. Its own task: animate. |
| `khe-ui` / `khe-design-tokens` | Deciding what looks right, or applying values that exist? | Judgment: khe-ui. A contract to thread through: tokens. |
| `khe-ui` / `break-ui` | A list of what breaks, or a worst-case dataset wired behind a toggle? | A list inside a wider pass: khe-ui. The harness and toggle: break-ui. |
| `khe-svg` / `khe-ui` | Does the motion live inside the file, or on the page around it? | Inside the SVG: svg. On the page: khe-ui, motion lane. |
| `khe-svg` / `khe-diagram` | An asset, or an explanation? | Icon, logo, mascot: svg. Boxes and arrows that explain: diagram. |
| `khe-svg` / `khe-sticker` | An interface asset, or something sent in a chat? | Icon, logo, illustration on a page: svg. A die-cut sticker or a pack for a chat app: sticker. |
| `khe-sound` / `khe-launch-film` | Can a user mute it? | Yes: sound, product rules. No: launch film first, then sound once picture is locked. |
| `khe-launch-film` / `stageshow` | A rendered film the viewer cannot interrupt, or something that plays on a page? | Film: launch film. Page: stageshow. UI durations do not transfer to a film. |
| `khe-demo` / `stageshow` | Must it be the real product on screen, or a picture of it? | The real app, driven and recorded: demo. An authored illustration that never runs the product: stageshow. |
| `khe-demo` / `khe-launch-film` | One take of the product, or a film with cuts, type and sound? | One take: demo. A film: launch film, which can use a demo take as a shot. |
| `khe-diagram` / `stageshow` | Does it explain a system, or show the product? | System: diagram. Product: stageshow. |
| `khe-brain-emil` / `emil-design-eng` | His writing reported with sources, or his rules applied to code? | Reported: khe-brain-emil. Applied: emil-design-eng. |
| `khe-brain-benji` / `stageshow` | His published thinking reported with sources, or a product picture built? | Reported: khe-brain-benji. Built: stageshow. |
| `prototype` / any building skill | Has the decision been made? | No: prototype. Yes: build the one thing. |

## When nothing fits

Say so. The skills here cover design and Swift and nothing else. Backend logic, data fetching, state management, build tooling and tests have no skill here yet. Answer normally and say no skill here applies.

## Examples

| Need | Example | What to learn |
|---|---|---|
| One skill owns the request | `examples/one-skill.txt` | One reason, the gate named inside the work, a last line that names what nobody looked at |
| Two skills, in order | `examples/two-skills.txt` | The contract first, a look between the two, each skill closed by its own gate |
| A whole job | `examples/playbook.txt` | One playbook, its steps in order with the gate each ran, a reopened step named as reopened |
| No skill applies | `examples/nothing-fits.txt` | `Route: none`, a normal answer, no skill stretched |
| The owning skill is not installed | `examples/not-installed.txt` | Whose it is, the install line, a stop, nothing rebuilt |
| `which <job>` | `examples/which.txt` | Goal, route, last line, and no work |

The files in `playbooks/` are the gold for a playbook. `teaching/` holds bad/good pairs ([teaching](references/teaching.md)) for diagnosing a fault; the bad halves are never starting points.

## Find the reference

| You need | Open |
|---|---|
| The loop every skill runs, which gate to pick, a missing or inconclusive gate, when to stop, how to brief an agent, how to point at a fault, when to fix the skill instead of the output | [loop](references/loop.md) |
| The last pass, every gate line, the symptom table, the `ROUTE.md` template | [verify](references/verify.md) |
| The brief for a fresh-eye reviewer | [review](references/review.md) |
| Which teaching pair matches a fault | [teaching](references/teaching.md) |
| Routes that landed wrong before | [gotchas](references/gotchas.md) |
| Your own routing calls | [pov](references/pov.md) |

Scripts: `scripts/route-check.mjs` checks a reply or a playbook (`--help` lists its lines). `scripts/gate-all.mjs` runs every installed gate's `--self-test` and prints `ok`, `FAIL`, `no gate` or `not installed` per skill.

## Never ship

| Never | Instead |
|---|---|
| A reply that starts without the goal | One line: what the user wants and what you will hand back |
| Three or more skills named at once | One or two, or a playbook that orders them |
| A value given from this file | Load the owning skill and take the value from its reference |
| `khe-sound` on a film whose picture still moves | `khe-launch-film` until picture is locked |
| `prototype` after the decision is made | The building skill for the one direction |
| The launch-week playbook on a screen still being designed | The new-screen playbook |
| A skill's rules reconstructed because it is not installed | The skill's name, whose it is, and its install line |
| Someone else's skill described as part of this repo | Its author and its own repo |
| A step closed with no gate run and nothing looked at | The gate's last line, or the words "no gate was run" |
| A reply that hides what was not verified | A last line that names it |

## Output

Four labeled parts, in this order. The gate reads the labels.

1. `Goal:` one line. What the user wants and what you hand back.
2. `Route:` in one of three forms. A playbook: `Route: playbook` and its name in backticks. Skills: `Route:` and one list line per skill, the name in backticks, a colon, then why it owns this; two at most, in run order, with the author in brackets when the skill is not a `khe-` skill. Nothing fits: `Route: none` and why.
3. `Work:` by each skill's rules, in its output format, with the gate each skill ran.
4. `Not verified:` the last line. One or two things a person can go and check.

For `which <job>`: `Goal:`, `Route:` and `Not verified:`, no work, and stop. For `list`: the Playbooks table and the domain tables, and stop.

## Tone

Brief and decisive. Say what you will do, do it, say what you could not check.

## Yours to edit

Read both before routing. They outrank the defaults in this skill.

- [gotchas](references/gotchas.md): routes that landed wrong, one line each. Append one when it happens.
- [pov](references/pov.md): your own routing calls, such as a skill you always want first.

Harshit Khemani. MIT.
