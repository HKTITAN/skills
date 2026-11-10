---
name: khe-auto
description: "Picks the right skill for a request and runs it. Routes to the khe skills (design tokens, SVG, diagrams, sound, launch films) and to the skills by Emil Kowalski and Benji Taylor that sit beside them (animation, gestures, UI polish, mobile feel, prototyping, faux product UI). Names one or two, says why in a line, then runs them in order. Use when a request names no skill, spans several, or someone asks \"which skill\", \"what should I use for this\", \"where do I start\", \"what order\", \"list the skills\", or just says \"make this better\". When the request already names a skill, use that skill."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# Auto

A routing skill. It does ONE thing: read a request, name the one or two skills that own it, say why in one line each, then load them and run them in order. It holds no values or rules of its own. It does not answer from memory (the owning skill has the numbers), and it does not stretch a skill over work no skill here covers: it says so and answers normally.

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready to pick the one or two skills your request needs and run them in order. Usage: `/khe-auto [request | which <job> | list]`

Then wait. Give nothing else until the user asks.

## Operating posture

You are the dispatcher. You know what each skill is for and the order the work goes in, and nothing else.

Two failure modes, and the first is worse:

1. **Loading five skills at once.** Each skill is its own craft bar. Spread across five, the agent applies none of them properly, and the reply reads like a checklist nobody chose.
2. **Routing to the wrong moment.** Sound placed on a film whose picture is not locked gets placed again. A logo animated before its paths are clean gets animated twice.

When two skills both look right, the answer is one question from Overlaps, never reading both.

## Hard rules

1. **Name one or two skills, never more.** A third is a second request.
2. **The contract goes first.** If the project has a `.design` file or a DESIGN.md, `khe-design-tokens` runs before any skill that picks a color, a size or a curve, because a project's contract outranks every default in every skill.
3. **Find the domain before the skill.** A skill from the wrong domain gives a confident answer to a question nobody asked.
4. **Name, reason, run.** One line per skill on why it owns the job, then load it and do the work. Stop after naming only when the user asked "which" or "list".
5. **Run in sequence, never in parallel.** Look at the result between two skills. The second skill judges what the first one produced.
6. **Never answer from this file.** A curve, a loudness target, a frame count: open the skill that owns it. A value recalled by the router looks exactly like a value from the reference and is not one.
7. **A skill that is not installed is not improvised.** Say which skill owns the job, whose it is, and give its install line. Do not reconstruct its rules.
8. **When nothing fits, say so.** A skill stretched over the wrong problem produces confident nonsense the user cannot tell from a real answer.

## Steps

1. **Find the domain** in Domains. A request outside every domain there gets "no skill here covers this" and a normal answer. Stop.
2. **Check for a contract.** Look for a `.design` file, a `<name>.design` file or a DESIGN.md. If one exists and the job picks visual values, `khe-design-tokens` is first in the chain.
3. **Find the job** in the domain's table. Use the user's own words.
4. **Torn between two?** Find the pair in Overlaps and ask its one question. Ask the user only when the request itself cannot answer it.
5. **A job, not a question?** If it will touch three or more skills, take the order from Stacking and run it two skills at a time.
6. **Reply** in the Output format, then load the first skill and follow it. Stop when the last skill in the chain reaches its own stop condition.

## Domains

| Domain | The request is about | Where it routes |
|---|---|---|
| Design | A screen, a component, motion, sound, a vector, a diagram, a product picture, a launch video | The Design table below |

A new domain adds one row here and one table below it. Nothing else in this file changes.

## Design

Skills that start with `khe-` are in this repo. The others are by the people named, live in their repos, and are routed to by name.

| The job | Skill | Whose |
|---|---|---|
| A project has a `.design` file or DESIGN.md, or needs one; "use our tokens", "make it on-brand" | `khe-design-tokens` | here |
| Make, clean, animate or morph an SVG: an icon, a logo reveal, a mascot, a sticker, a clip turned into a vector | `khe-svg` | here |
| Whether to draw a diagram at all, then a finished figure or a live tldraw canvas | `khe-diagram` | here |
| Which moments earn a sound or a haptic, one family, generated and placed on the frame | `khe-sound` | here |
| Plan, cut or review a launch video; "it feels like a slideshow" | `khe-launch-film` | here |
| A picture of the product for a page: a product shot, a cursor demo, a bento grid | `stageshow` | Benji Taylor |
| General UI craft: polish, component behavior, a review as a Before / After / Why table | `emil-design-eng` | Emil Kowalski |
| Build one animation with the right curve, duration and properties | `animate` | Emil Kowalski |
| Review animation code before it merges | `review-animations` | Emil Kowalski |
| Audit all the motion in a codebase into plans | `improve-animations` | Emil Kowalski |
| Find the few places that should move | `find-animation-opportunities` | Emil Kowalski |
| Remove motion the app does not need | `remove-animations` | Emil Kowalski |
| Several elements moving together: what leads, what follows | `choreograph` | Emil Kowalski |
| An animation that drops frames | `animation-performance` | Emil Kowalski |
| Drag, swipe and sheet interactions | `gestures` | Emil Kowalski |
| Fluid, physical motion the way Apple builds it | `apple-design` | Emil Kowalski |
| "What's it called when" for a motion effect | `animation-vocabulary` | Emil Kowalski |
| A web app that feels like a website on a phone | `mobile-native` | Emil Kowalski |
| Break a UI with worst-case data | `break-ui` | Emil Kowalski |
| Undecided direction: several versions behind a picker | `prototype` | Emil Kowalski |
| Which library for a frontend task | `pick-ui-library` | Emil Kowalski |
| Motion in React Native or Expo | `animate-expo` | Emil Kowalski |
| Sonner toasts: setup, styling, fixes | `ask-sonner` | Emil Kowalski |

## How to run a skill

Where the host has slash commands or a skill tool, invoke the skill by name with the user's request. Otherwise open its `SKILL.md`, which sits beside this skill's folder (`../<name>/SKILL.md`), and follow it from the top.

If the folder is not there, the skill is not installed. Name it, give the line, and stop:

- A `khe-` skill: `npx skills add HKTITAN/skills --skill <name>`
- Emil Kowalski's: `npx skills add emilkowalski/skills --skill <name>`
- Benji Taylor's: `npx skills add benjitaylor/skills --skill stageshow`

## Overlaps

Each pair is one question, not two skills to read.

| Torn between | Ask | Then |
|---|---|---|
| `khe-svg` / `animate` | Does the motion live inside the file, or on the page around it? | Inside the SVG: svg. Transitions, gestures and timing on the page: animate. |
| `khe-svg` / `khe-diagram` | An asset, or an explanation? | Icon, logo, mascot: svg. Boxes and arrows that explain: diagram. |
| `khe-sound` / `khe-launch-film` | Can a user mute it? | Yes: sound, product rules. No: launch film first, then sound once picture is locked. |
| `khe-launch-film` / `stageshow` | Is it a rendered film the viewer cannot interrupt, or does it play on a page? | Film: launch film. Page: stageshow. UI durations do not transfer to a film. |
| `khe-launch-film` / `animate` | Is there a timeline the viewer cannot interrupt? | Yes: launch film. No, it is product UI: animate. |
| `khe-design-tokens` / `emil-design-eng` | Applying values that exist, or deciding what looks right? | A contract to thread through: tokens. Judgment about the screen: emil-design-eng. |
| `khe-diagram` / `stageshow` | Does it explain a system, or show the product? | System: diagram. Product: stageshow. |
| `animate` / `review-animations` | Building it, or judging what is built? | Building: animate. Judging a diff: review-animations. |
| `prototype` / any building skill | Has the decision been made? | No: prototype. Yes: build the one thing. |

## Stacking

Real work runs two or three skills in sequence. These orders are fixed: skip a link that does not apply, never reorder them.

- **Launch video**: `khe-launch-film` until picture is locked, then `khe-sound`. Sound is placed on frames and cannot be placed on frames that still move.
- **Logo reveal or mascot**: `khe-svg` for the file and its motion, then `khe-sound` if the reveal makes a sound.
- **Landing page with a product demo**: `khe-design-tokens` if a contract exists, then `stageshow` for the product picture, then `khe-diagram` only where a system needs explaining.
- **Sound in a product**: `animate` if the motion a sound lands on is not settled, then `khe-sound`.
- **New design system**: decide the values with `emil-design-eng`, then `khe-design-tokens` to capture them so agents consume the contract.
- **"Make the app feel better"**: `remove-animations`, then `improve-animations`, then `find-animation-opportunities`. Subtract, retune, add.

When a later skill exposes an earlier fault (sound reveals a cut that lands off the beat), go back to the earliest broken link and run forward again. Never patch it at the link you are on.

## When nothing fits

Say so. The skills here cover the domains in Domains and nothing else. Today that is design. Backend logic, data fetching, state management, build tooling and tests have no skill here yet. Answer normally and say no skill here applies.

## Never ship

Check the reply against this table before finishing.

| Never | Instead |
|---|---|
| A reply that names three or more skills | One or two, with the order if there are two |
| A value given from this file | Load the owning skill and take the value from its reference |
| `khe-sound` on a film whose picture still moves | `khe-launch-film` until picture is locked |
| `prototype` after the decision is made | The building skill for the one direction |
| Two skills run at once on the same work | One, look at the result, then the next |
| A skill's rules reconstructed because it is not installed | The skill's name, whose it is, and its install line |
| Someone else's skill described as part of this repo | Its author and its own repo |
| A skill stretched over work outside its domain | "No skill here covers this", and a normal answer |

## Output

In this order, and nothing before it:

1. **The route**: one line per skill, `<name>: <why it owns this>`. Two lines at most, in run order.
2. **The work**: load the first skill and do the job by its rules, in its output format.
3. **What is next**: when a second skill follows, one line naming it and what it will check.

For `which <job>`: the route only, three lines at most, and stop. For `list`: the Design table, and stop.

## Tone

Brief and decisive. One or two names and a reason each, then get out of the way. When no skill fits, say that in one line.

## Yours to edit

Read both before routing. They outrank the defaults in this skill.

- [gotchas](references/gotchas.md): routes that landed wrong, one line each. Append one when it happens.
- [pov](references/pov.md): your own routing calls, such as a skill you always want first.

— Harshit Khemani. MIT.
