# kheSkills

[![skills.sh](https://skills.sh/b/HKTITAN/skills)](https://skills.sh/HKTITAN/skills)
[![CI](https://github.com/HKTITAN/skills/actions/workflows/ci.yml/badge.svg)](https://github.com/HKTITAN/skills/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/kheskills-dark.gif">
  <img src=".github/assets/kheskills.gif" alt="A cursor works through what the skills produce: it takes two fixes and ships a UI review, scrubs a launch film to the frame the name lands on, marks a sound on its contact frame, picks a token, pulls a bezier handle, links a diagram, and sends three stickers and clicks a lock shut">
</picture>

I'm [Harshit Khemani](https://www.khe.money). I've been building products for five years, and these days I build them with coding agents: the interface, the launch film, the demo, the stickers, the posts and the pictures that go in them.

Agents can build a screen that looks right in a screenshot. They cannot tell when it feels right. They reach for a spinner on a 200ms call, pick an easing because it looked familiar, lay a music bed under a logo reveal to hide the sync work, and call it done.

**kheSkills is how I fix that.** These are the skills I run every day. Each one owns a job from the first line to a result I would put my name on, gives numbers instead of adjectives, and says what it could not verify.

```sh
npx skills add HKTITAN/skills
```

## Start here

Type the job. `khe-auto` picks the playbook, runs the skills in order and looks at the result between steps.

```text
/khe-auto I need a launch video for Friday. 30 seconds, product-led.
```

```text
/khe-auto build the settings page. We have a .design file.
```

```text
/khe-auto we ship Thursday. What is broken?
```

It has nine playbooks: [launch film](skills/khe-auto/playbooks/launch-film.md), [logo reveal](skills/khe-auto/playbooks/logo-reveal.md), [landing page](skills/khe-auto/playbooks/landing-page.md), [new screen](skills/khe-auto/playbooks/new-screen.md), [feel better](skills/khe-auto/playbooks/feel-better.md), [sound pass](skills/khe-auto/playbooks/sound-pass.md), [design system](skills/khe-auto/playbooks/design-system.md), [launch week](skills/khe-auto/playbooks/launch-week.md) and [explain a system](skills/khe-auto/playbooks/explain-a-system.md). Each names the skills, the order and the exit check for every step.

If you already know the skill, call it directly.

## Skills

| Skill | Say | What you get |
|---|---|---|
| [khe-auto](skills/khe-auto/README.md) | "auto" | The job done in the right order. It picks the playbook and runs my skills and the ones I use from others. |
| [khe-ui](skills/khe-ui/README.md) | "review this", "make it feel right" | A screen built or judged against exact values across eleven areas, and a review that ends in Blocked, Approve with changes or Ship it. |
| [khe-design-tokens](skills/khe-design-tokens/README.md) | "use our tokens" | Your `.design` file or DESIGN.md threaded through the UI, so the agent stops inventing colors and sizes. |
| [khe-svg](skills/khe-svg/README.md) | "animate this logo" | A clean, token-aware SVG that moves, or a flat clip turned into one editable vector file. |
| [khe-sticker](skills/khe-sticker/README.md) | "make a sticker pack" | Any kind of sticker, built to pop once and hold still, and a pack in the formats WhatsApp and Telegram take. |
| [khe-diagram](skills/khe-diagram/README.md) | "diagram this" | A figure that reads as designed, a live tldraw board, or an honest "this does not need a diagram". |
| [khe-sound](skills/khe-sound/README.md) | "add sound" | One family of sounds, generated, wired, and placed on the exact frame the motion lands. Most moments get none. |
| [khe-launch-film](skills/khe-launch-film/README.md) | "launch film" | A launch video planned beat by beat and reviewed against 47 films I measured frame by frame. |
| [khe-demo](skills/khe-demo/README.md) | "record a demo" | The real app, driven through one planned flow on seeded data and recorded as a clean take: a video and a GIF. |
| [khe-brain-emil](skills/khe-brain-emil/README.md) | "what would Emil say" | An answer from Emil Kowalski's public writing with the article named, and a plain "he has not written about this" when he has not. |
| [khe-brain-benji](skills/khe-brain-benji/README.md) | "would Benji ship this" | An answer from Benji Taylor's public writing and skills with the source named, and a design pressure-tested against it. |
| [khe-brain-varun](skills/khe-brain-varun/README.md) | "what would Varun say" | An answer from 18 of Varun Mayya's public videos with the video and the minute named, and a plan pressure-tested against it. |
| [khe-content-engine](skills/khe-content-engine/README.md) | "build me a content engine" | Your voice, audience and platforms written down once, then one idea turned into a different draft for each platform. You post them. |

Install one at a time with `--skill`:

```sh
npx skills add HKTITAN/skills --skill khe-ui
```

Each skill works alone. Some call others:

- `khe-auto` uses all of them.
- `khe-ui` hands to `khe-design-tokens` first when the project has a contract.
- `khe-launch-film` hands to `khe-sound` once picture is locked.
- `khe-svg` hands to `khe-sound` when a reveal should make a sound.
- `khe-demo` hands its take to `khe-launch-film` when the recording is one shot in a film.

## What is in a skill

```text
skills/khe-ui/
  SKILL.md        what the agent reads: what it owns, the hard rules, the steps
  README.md       the page for people: what it does, a before and after, example prompts
  references/     the detail, opened one file at a time
  examples/       finished work that sets the bar, and the place to start from
  teaching/       the same thing done wrong and right, one fault each
  scripts/        the gate: it names every fault it can prove and ends "passed"
  LICENSE
```

The agent reads `SKILL.md` and opens a reference only when the job needs it, so a deep skill costs nothing until it is used.

## Cheatsheets

One table each: the problem as you would say it, and the value that fixes it.

[UI](cheatsheets/ui.md) · [Motion](cheatsheets/motion.md) · [SVG](cheatsheets/svg.md) · [Sticker](cheatsheets/sticker.md) · [Sound](cheatsheets/sound.md) · [Launch film](cheatsheets/film.md) · [Demo](cheatsheets/demo.md) · [Diagram](cheatsheets/diagram.md) · [Tokens](cheatsheets/tokens.md)

## From others

Skills by other people that I use next to mine. They are not copied here. Each one is linked in [`skills/`](skills) as a git submodule that follows its repo automatically, each link below goes to the original file, and `khe-auto` routes to all of them by name.

### Benji Taylor

```sh
npx skills add benjitaylor/skills --skill stageshow
```

| Skill | What I use it for |
|---|---|
| [stageshow](https://github.com/benjitaylor/skills/blob/main/stageshow/SKILL.md) | Faux product UI: product shots, cursor demos and bento grids. The image above is made with it. |

### Emil Kowalski

```sh
npx skills add emilkowalski/skills
```

| Skill | What I use it for |
|---|---|
| [emil-design-eng](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md) | General UI craft and reviews. |
| [animate](https://github.com/emilkowalski/skills/blob/main/skills/animate/SKILL.md) | Building one animation with the right ingredients. |
| [review-animations](https://github.com/emilkowalski/skills/blob/main/skills/review-animations/SKILL.md) | A strict review of motion before it merges. |
| [improve-animations](https://github.com/emilkowalski/skills/blob/main/skills/improve-animations/SKILL.md) | Auditing all the motion in a codebase into plans. |
| [find-animation-opportunities](https://github.com/emilkowalski/skills/blob/main/skills/find-animation-opportunities/SKILL.md) | Finding the few places that should move. |
| [remove-animations](https://github.com/emilkowalski/skills/blob/main/skills/remove-animations/SKILL.md) | Removing motion the app does not need. |
| [choreograph](https://github.com/emilkowalski/skills/blob/main/skills/choreograph/SKILL.md) | Several elements moving together. |
| [animation-performance](https://github.com/emilkowalski/skills/blob/main/skills/animation-performance/SKILL.md) | Animations that drop frames. |
| [gestures](https://github.com/emilkowalski/skills/blob/main/skills/gestures/SKILL.md) | Drag, swipe and sheet interactions. |
| [apple-design](https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md) | Fluid, physical motion. |
| [animation-vocabulary](https://github.com/emilkowalski/skills/blob/main/skills/animation-vocabulary/SKILL.md) | The exact word for a motion effect. |
| [mobile-native](https://github.com/emilkowalski/skills/blob/main/skills/mobile-native/SKILL.md) | Making a web app feel native on a phone. |
| [break-ui](https://github.com/emilkowalski/skills/blob/main/skills/break-ui/SKILL.md) | Breaking a UI with worst-case data. |
| [prototype](https://github.com/emilkowalski/skills/blob/main/skills/prototype/SKILL.md) | Several versions of a UI behind a picker. |
| [pick-ui-library](https://github.com/emilkowalski/skills/blob/main/skills/pick-ui-library/SKILL.md) | Choosing a library for a frontend task. |
| [animate-expo](https://github.com/emilkowalski/skills/blob/main/skills/animate-expo/SKILL.md) | Motion in React Native and Expo. |
| [ask-sonner](https://github.com/emilkowalski/skills/blob/main/skills/ask-sonner/SKILL.md) | Working with Sonner. |
| [write-swift](https://github.com/emilkowalski/skills/blob/main/skills/write-swift/SKILL.md) | Writing modern Swift. |

`npx skills add HKTITAN/skills` installs only my skills. Install theirs from their repos with the commands above.

## Make them yours

These are starting points. Every skill has two files that are yours to edit, and both outrank the skill's defaults:

- `references/pov.md`: your taste calls. "I always prefer X over Y."
- `references/gotchas.md`: one line each time the agent gets a detail wrong. Append only.

A project's `.design` file or DESIGN.md outranks both. Fork it, change it, make it yours.

Writing your own? [CONTRIBUTING.md](CONTRIBUTING.md) is how these are written, and how to tell whether something should be a skill at all.

## License

[MIT](LICENSE). Other people's skills keep their own licences in their own repos.
