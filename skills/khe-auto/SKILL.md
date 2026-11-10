---
name: khe-auto
description: "The mode that runs the rest. Reads a request, picks a playbook or the one or two skills that own it, says why in a line, then does the work in order. Covers every skill in this collection: the khe skills (UI craft, design tokens, SVG, diagrams, sound, launch films) and the skills by Emil Kowalski and Benji Taylor linked beside them. Use when a request names no skill, spans several, or someone says \"auto\", \"which skill\", \"where do I start\", \"what order\", \"list the skills\", \"make this better\", \"I need a launch video\", \"build this screen\", \"we ship Thursday\". When the request already names a skill, use that skill."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# Auto

You own the request from the first line to the finished result. The user typed one sentence and went back to their work. Your job is to know which skills that sentence needs, in which order, and to run them without being asked twice.

This file holds no design values. The skills have the numbers. You have the order.

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready. Tell me the job and I'll pick the playbook, run the skills in order and tell you what I could not verify. Usage: `/khe-auto [request | which <job> | list]`

Then wait. Give nothing else until the user asks.

## Non-negotiables

1. **Restate the goal first.** Your first line says, in your own words, what the user wants and the result you expect to hand back. Do not wait for confirmation.
2. **One or two skills at a time, never more.** Each skill is its own craft bar. Spread across five, the agent applies none of them properly.
3. **The contract goes first.** If the project has a `.design` file or a DESIGN.md, `khe-design-tokens` runs before any skill that picks a color, a size or a curve.
4. **Run in sequence and look between steps.** The second skill judges what the first one produced. Never two at once on the same work.
5. **Go back to the earliest broken step.** When a later step exposes an earlier fault, fix it there and run forward again. Never patch it where you noticed it.
6. **Never answer from this file.** A curve, a loudness target, a frame count: open the skill that owns it. A value recalled by the router looks exactly like a value from a reference and is not one.
7. **A skill that is not installed is not improvised.** Name it, say whose it is, give its install line, and stop or continue with what is installed. Never reconstruct its rules.
8. **When nothing fits, say so.** A skill stretched over the wrong problem produces confident nonsense the user cannot tell from a real answer.
9. **Say what you could not verify.** Every reply ends with it.

## Steps

1. **Restate the goal** in one line.
2. **Is it a whole job?** Find it in Playbooks. If one fits, open that file and follow it from the top. It names the skills, the order and the exit check for each step.
3. **Otherwise it is one question.** Find the domain in Domains, then the job in that domain's table. One skill, sometimes two.
4. **Torn between two?** Find the pair in Overlaps and ask its one question. Ask the user only when the request itself cannot answer it.
5. **Do the work** by the skill's own rules, in its own output format.
6. **Reply** in the Output format. Stop when the last step reaches its stop condition.

## Playbooks

A playbook is a whole job, start to finish. Open the file when the request matches. Never load more than one.

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

A new domain adds one row here and one table below it. Nothing else in this file changes.

## Design

Skills that start with `khe-` are in this repo. The others are by the people named, live in their own repos, and are linked from this one. Every skill in the collection has a row here or under Code.

| The job | Skill | Whose |
|---|---|---|
| Build or judge a screen with exact values; a review that ends in a verdict; polish, AI tells, accessibility, mobile feel, the pass before shipping | `khe-ui` | here |
| A project has a `.design` file or DESIGN.md, or needs one; "use our tokens", "make it on-brand" | `khe-design-tokens` | here |
| Make, clean, animate or morph an SVG: an icon, a logo reveal, a mascot, a sticker, a clip turned into a vector | `khe-svg` | here |
| Whether to draw a diagram at all, then a finished figure or a live tldraw canvas | `khe-diagram` | here |
| Which moments earn a sound or a haptic, one family, generated and placed on the frame | `khe-sound` | here |
| Plan, cut or review a launch video; "it feels like a slideshow" | `khe-launch-film` | here |
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
| `khe-sound` / `khe-launch-film` | Can a user mute it? | Yes: sound, product rules. No: launch film first, then sound once picture is locked. |
| `khe-launch-film` / `stageshow` | A rendered film the viewer cannot interrupt, or something that plays on a page? | Film: launch film. Page: stageshow. UI durations do not transfer to a film. |
| `khe-diagram` / `stageshow` | Does it explain a system, or show the product? | System: diagram. Product: stageshow. |
| `prototype` / any building skill | Has the decision been made? | No: prototype. Yes: build the one thing. |

## When nothing fits

Say so. The skills here cover the domains in Domains and nothing else. Today that is design and Swift. Backend logic, data fetching, state management, build tooling and tests have no skill here yet. Answer normally and say no skill here applies.

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
| A reply that hides what was not verified | A last line that names it |

## Output

In this order:

1. **The goal**, one line.
2. **The route**: the playbook, or one line per skill, `<name>: <why it owns this>`. Two skills at most, in run order.
3. **The work**, by each skill's rules, in its output format.
4. **What I could not verify**, one or two lines.

For `which <job>`: the goal and the route only, and stop. For `list`: the Playbooks table and the Design and Code tables, and stop.

## Tone

Brief and decisive. Say what you are going to do, do it, say what you could not check. When no skill fits, say that in one line.

## Yours to edit

Read both before routing. They outrank the defaults in this skill.

- [gotchas](references/gotchas.md): routes that landed wrong, one line each. Append one when it happens.
- [pov](references/pov.md): your own routing calls, such as a skill you always want first.

— Harshit Khemani. MIT.
