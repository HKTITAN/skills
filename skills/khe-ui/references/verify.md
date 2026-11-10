---
title: verify
summary: The last pass on any screen or review. The gate's commands and lines, the yes/no questions answered from evidence, the symptom-to-fix table, and the hand-over file.
---

# Verify

The last pass. Every answer comes from something you looked at: a screenshot, a recording, a Tab press, the gate's output. Never from the code you wrote and never from memory. Fix the largest visible fault first, re-run the gate, return to the top, and repeat until every answer is yes. The rules behind each question live in the lane named beside it.

## Gate

```bash
node scripts/ui-check.mjs <files or folders> --gate
node scripts/ui-check.mjs <files or folders> --gate --report ui-check.json
node scripts/ui-check.mjs --self-test
```

- The gate reads `.css`, `.html`, `.jsx` and `.tsx` as text, and a `.md` file only as a review. Everything passed in one run is one file set.
- Each fault prints as `<line-name>: <what and where> (<file>:<line>)`.
- `--gate` ends `ui-check passed` and exits 0 only when every never-intentional line is at 0. Otherwise it prints the counts, ends `ui-check failed` and exits 1. With nothing to scan it ends `ui-check inconclusive` and exits 2. An inconclusive run is never a pass.
- `--strict` fails on candidate lines too. `--report` writes `{ status, exitCode, files, findings, notChecked }`.
- `--self-test` proves the gate on this skill's own fixtures: every example passes clean, and every `teaching/<line>/bad.*` raises `<line>` while its `good.*` does not.
- Passing is necessary, not sufficient. The gate proves the source is free of the faults a script can name. It has not looked at the screen.

Ask before anything else:

- Did the gate end `ui-check passed` on every file you touched, in one run?
- Did it scan the files you think it scanned? Read the `files scanned` count.
- Is every candidate line either fixed or written into `UI-CHECK.md` with the evidence for why it stands?

## States and structure

First, because nothing else matters when a state is missing. Answer from the running screen, or from the worst-case fixture in 320, 560 and 1100px boxes ([polish-and-ship](polish-and-ship.md), Pass 2).

- Does every data view have a loading, an empty and an error branch that you saw, each one different from the others?
- Is the chrome real from the first frame, with only the data loading, and does the last skeleton frame overlay the first loaded frame with nothing moving?
- Does a response inside 150ms show no indicator, and does a slow one show one by 400ms?
- Does the longest real string (a 60-character email, a hyphenated surname, an unbreakable URL) stay inside its box, with the trailing action still on screen?
- Does an error appear without moving anything below it?
- With zero items, one item and ten times the usual count, does the layout hold?
- Does a failed submit keep every value the user typed?

## Keyboard, names and focus

Answer from a Tab pass with the mouse away ([accessibility](accessibility.md), Check).

- Does Tab reach every control, with exactly one visible ring on every stop?
- Does Enter or Space activate it, does Escape close what opened last, and does focus return to the trigger?
- Does every icon-only button have a name that says the action?
- Does every input have a label wired to it, and is status carried by more than color?
- Does body text measure 4.5:1 on the surface it sits on, and does every boundary and ring measure 3:1?
- Is the status region in the page and empty on first paint, with its text set afterwards?

## Phone

Answer from a real phone when one is at hand. A narrow desktop window proves width only ([mobile](mobile.md), Check).

- At 390 wide, is it a composition of its own, with no horizontal scroll and nothing under 10px?
- After one tap, is no hover style left on?
- Does focusing an input leave the page at its scale, with zoom still allowed?
- Is every touch target 44px, with no two hit areas overlapping?
- Is nothing under the notch or the home indicator, and does the last field stay above the keyboard?

## Motion

Answer from playback at 25% speed and from frames stepped at 40 to 80ms ([motion](motion.md), Check).

- Can you name the one purpose of every moving element, and does the screen read worse with it hidden?
- Does anything triggered from the keyboard, or met 100+ times a day, open with no animation?
- Does every entrance start from at least `scale(0.95)` at its trigger, and does every exit run in 60 to 80% of its enter?
- Does the press answer on the first frame after pointer-down?
- With reduced motion on, is every element at rest visible, with nothing travelling or scaling?
- Does interrupting a transition halfway retarget from where it is, with no restart?

## Finish and review

Last, once the rest holds ([polish-and-ship](polish-and-ship.md), Pass 1; [review](review.md), The required output).

- Are words 12px or more from every container edge, and is every pair of near edges either aligned or 8px apart?
- Does every number that updates hold its width?
- Cover the logo: could this screen belong to any product in its category? If yes, open [tells](tells.md).
- In a review: can you grep every Before in the code, does every row have a Why that ends on its lane, and are the last two lines the verdict and "Not checked"?
- Put yours beside the closest gold in `examples/`. Say the one difference. Is yours the one with fewer states or a value with no source?

## Lines that are never intentional

Not candidates for judgment: fix the cause and re-run. The gate fails on any of them. Clearing a line by deleting, hiding or renaming the thing it points at is a bug, and the fresh eye judges again every line you call intentional.

| Line | What it means | Rule |
|---|---|---|
| `transition-all:` | A transition names `all`, or names no property, or uses Tailwind `transition-all` | [motion](motion.md), Properties and performance |
| `ease-in:` | `ease-in` on a transition or animation, or a cubic-bezier that leaves rest slower than linear and never slows at the end | [motion](motion.md), Easing, duration and springs |
| `scale-from-zero:` | `scale(0)`, `scale: 0` or `scale-0` | [motion](motion.md), Entrances, exits and feedback |
| `layout-animation:` | A transition or keyframe on `width`, `height`, `top`, `left`, `margin` or `padding` | [motion](motion.md), Properties and performance |
| `ungated-hover:` | A `:hover` rule sets `transform`, `translate`, `scale` or `rotate` outside `@media (hover: hover)` | [mobile](mobile.md), Taps, hover and gestures |
| `no-reduced-motion:` | A file moves something and no file in the set has a `prefers-reduced-motion` branch | [accessibility](accessibility.md), Reduced motion |
| `small-input:` | An `input`, `textarea` or `select` under 16px with no phone override in the set | [mobile](mobile.md), Keyboard and inputs |
| `unnamed-icon-button:` | A `<button>` with no text and no `aria-label`, `aria-labelledby` or `title` | [accessibility](accessibility.md), Names, roles and structure |
| `outline-none:` | `outline: none` or `outline-none` with no `:focus-visible` outline or ring to replace it | [accessibility](accessibility.md), Focus |
| `magic-z-index:` | A `z-index` above 400, the top of the layer scale | [polish-and-ship](polish-and-ship.md), Pass 1, item 7 |
| `zoom-locked:` | `user-scalable=no` or `maximum-scale=1` | [mobile](mobile.md), Baseline |
| `positive-tabindex:` | A `tabindex` of 1 or more | [accessibility](accessibility.md), Keyboard maps |
| `weight-shift:` | `font-weight` set on a hover, active or selected state | [typography](typography.md), Scale and leading |
| `motion-kill-switch:` | A universal selector zeroing every animation or transition under reduced motion | [accessibility](accessibility.md), Reduced motion |
| `review-verdict:` | A review with no `Verdict:` line, or a verdict that is not Blocked, Approve with changes or Ship it | [review](review.md), The required output |
| `review-not-checked:` | A review with no `Not checked:` line | [review](review.md), The required output |
| `review-no-why:` | A review row with an empty Why | [review](review.md), The required output |

## Candidate lines

Reported for judgment. Each is right in some context and wrong in most. Fix it, or write the evidence for why it stands into `UI-CHECK.md`.

| Line | What it means | When it stands |
|---|---|---|
| `long-duration:` | A duration over 300ms | A page transition (250 to 400ms), an edge sheet (500ms), a first-run or rare moment |
| `ungated-hover-paint:` | A `:hover` rule that changes paint outside the hover gate | Never on a touch product; a desktop-only tool may keep it |
| `hover-gate-pointer:` | A hover gate with `(hover: hover)` and no `(pointer: fine)` | The project's own convention gates on one condition |
| `tailwind-hover-motion:` | `hover:scale-*`, `hover:translate-*` or `hover:rotate-*` | Tailwind v4, or v3 with `hoverOnlyWhenSupported`, gates it; the lift is 1px or `scale(1.02)` at most |
| `bare-transition:` | Tailwind's bare `transition` class | Never by intent; name the properties |
| `z-index-literal:` | A raw `z-index` other than -1, 0, 1 or 2, up to 400 | Inside the one global layer file |
| `default-shadow:` | One shadow layer above 6% opacity | A marketing-stage shadow token |
| `pure-black:` | A `#000` background | A photo backdrop, video chrome, an opt-in OLED theme |
| `gradient-text:` | `background-clip: text` | A brand contract that asks for it |
| `generated-purple:` | One of `#6366f1 #8b5cf6 #7c3aed #a855f7 #4f46e5 #9333ea`, or a Tailwind purple, violet, indigo or fuchsia step | The contract's accent is that color |
| `tracked-caps:` | Uppercase with positive tracking | A badge, table header or nav label at 10 to 12px; never an eyebrow over a heading |
| `looping-attention:` | `animate-bounce`, `animate-ping`, `animate-pulse` | A pulse on a live state |
| `viewport-100vh:` | `100vh`, `100lvh`, `h-screen` | A desktop-only tool |
| `env-no-fallback:` | `env(safe-area-inset-*)` inside `calc()` with no `0px` fallback | Never by intent |
| `disabled-opacity:` | A disabled state made by `opacity` | Never by this skill's defaults, which use dedicated tokens; only when the contract or [pov](pov.md) sets disabled by opacity |
| `div-onclick:` | A `div` or `span` with a click handler and no role with a key handler | A backdrop whose close is also on Escape |
| `mounted-live-region:` | `{msg && <div role="status">` | Never by intent; render it empty first |
| `submit-disabled-until-valid:` | `disabled={!isValid}` | Never by intent; let the click validate |
| `placeholder-data:` | Acme, John Doe, Jane Doe, lorem ipsum, 123 Main St | An internal tool or an early prototype |
| `review-paraphrase:` | A review row whose Before quotes no code | A visual finding that names its frame |

## What you see, what you do

| You see | You do |
|---|---|
| The page jumps when data arrives | Reserve the room: skeleton rows at the loaded row's height, real chrome from the first frame |
| A spinner flashes on a fast response | Hold every indicator 150ms; show one by 400ms |
| An error pushes the form down | An 18px message lane under the field from the first frame |
| A long name pushes the action off the row | `min-width: 0` on the text column, `flex-shrink: 0` on the action, `overflow-wrap: anywhere` |
| A number jiggles as it updates | `font-variant-numeric: tabular-nums` |
| Tabs shift when one is selected (`weight-shift:`) | Hold the weight; signal with color or an indicator line |
| Hover stays on after a tap (`ungated-hover:`) | Wrap it in `@media (hover: hover) and (pointer: fine)` |
| The page zooms when a field takes focus (`small-input:`) | 16px on the input; never lock zoom (`zoom-locked:`) |
| Tab lands and no ring shows (`outline-none:`) | Delete the `outline: none`; the browser ring with `outline-offset: 2px` |
| A screen reader says only "button" (`unnamed-icon-button:`) | An `aria-label` naming the action; the icon `aria-hidden` |
| A popover inflates from a point (`scale-from-zero:`) | Start at `scale(0.96)` with `opacity: 0`, origin at the trigger |
| A dropdown hesitates before it moves (`ease-in:`) | An ease-out token; `cubic-bezier(0.23, 1, 0.32, 1)` for overlays |
| A menu feels slow the tenth time (`long-duration:`) | Halve it; 150 to 250ms; the exit in 60 to 80% of the enter |
| An accordion stutters (`layout-animation:`) | `grid-template-rows: 0fr` to `1fr`, or a clip; never `height` |
| A dropdown sits under the header (`magic-z-index:`) | A layer token or `isolation: isolate`; never a bigger number |
| The screen is blank under reduced motion | The reduced state is the finished state; drop the travel, keep the element |
| The screen could be any product | Open [tells](tells.md): subtract first, then one chosen opinion |
| A gate line you think is intentional | Look at the screen again. If it still stands, say so in `UI-CHECK.md` with the evidence. Never clear it by hiding the thing |
| Three rounds, gate green, and it still feels off | Stop. Call the fresh eye ([fresh-eye](fresh-eye.md)) |

## Not checked by the gate

A script reads text. It cannot judge any of these, so each needs a look, and whatever nobody looked at goes under "Not checked" in the hand-over.

- **Feel.** Whether a duration, curve or spring feels right at full speed and at 25%.
- **Taste.** Whether an animation should exist at all, and whether the screen could belong to any product.
- **Rendered pixels.** Contrast ratios, insets, alignment, clipping, layout shift, the dark theme.
- **Missing states.** A data view with no loading, empty or error branch raises no line.
- **Keyboard reach.** Tab order, focus return, Escape, a `role` with no key handler.
- **Devices.** Screen readers, a real phone, the software keyboard, safe areas, dropped frames.
- **Reduced-motion coverage.** The gate proves a branch exists in the file set, never that it covers every animation.
- **The cascade.** Styles that arrive from a framework, a preprocessor, a style object or a Tailwind config. A class selector on an input (`.email { font-size: 14px }`) is invisible to `small-input:`.
- **Layout properties the motion lane does not name.** `max-height`, `right`, `bottom` and `inset` raise no line.
- **Good names.** A visible label or a text glyph counts as a name; whether it is a good one is yours to judge.

## Settled values

The lanes, the gold examples and the gate state one value for each decision; to overrule one, write it in [pov](pov.md).

## Hand over

Write `UI-CHECK.md` beside the work. In a judging mode it sits beside the review. A template:

```md
# UI check: <screen or component>

Mode: <review | polish | build | tells | a11y | mobile | ship>
Gold: <the example you started from> (what you kept, what you changed)
Lanes opened: <one or two>
States: <loading, empty, error, full, hover, press, focus, pending, disabled: seen, missing, or does not apply>
Seen at: <widths, themes, reduced motion, 25% speed, Tab pass, device>
Gate: <the last line of ui-check.mjs --gate, pasted, with the files scanned count>
Lines: <each gate line> -> <the fix, or the evidence for why it stands>
Fresh eye: <the reviewer's list> -> <your response to each>
Assumptions:
Unresolved:
Not checked:
```

- Did you paste the gate's last line, not retype it?
- Did you say what you did not look at?
