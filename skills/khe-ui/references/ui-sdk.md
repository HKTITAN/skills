---
title: ui-sdk
summary: Decides what this skill still owns on a screen built with Vercel's UI SDK (the look, the state paint, the entrance and exit values, the phone and the names), and which hooks to write each value on.
---

# UI SDK

This lane is for a project with an `@ui-sdk/*` package in `package.json`, or a page that loads `https://ui-sdk.dev/web.js`. UI SDK (github.com/vercel-labs/ui, ui-sdk.dev, Apache-2.0, in beta) is a library of behaviors: keyboard navigation, focus, selection, dismissal, popups, drag and drop and the ARIA they need, with more than 50 components built from them for React, Vue, Svelte, Solid and web components. The components render no styles of their own. So the split is clean: the library owns how a control behaves, and every value a person sees is still decided here. A project's `.design` file or DESIGN.md outranks every default here.

This file never teaches the library. Which component to pick, how its parts nest, how to build one it does not ship and how to test it belong to Vercel's own `ui-sdk` skill and to the docs installed with the package (`node_modules/@ui-sdk/<framework>/docs/llms.txt`), which match the installed version. Checked against `0.1.0-beta.2` on 2026-11-13; the API can change before 1.0, so when this file and the installed docs disagree, the installed docs win.

## Decide first

```text
1. Is the question which component, how the parts nest, a missing component,
   the agent bridge, or a test?
   yes -> Vercel's `ui-sdk` skill. Stop. Not installed: say so, give
          `npx skills add vercel-labs/ui --skill ui-sdk`, reconstruct nothing.
2. Is there a `role=` written by hand on a div (listbox, menu, dialog, tablist,
   switch, slider, radiogroup, toolbar, tree, separator)?
   yes -> a finding: the library ships that control. Hand it to `ui-sdk`.
3. Does the app import `@ui-sdk/core/web.css`?
   yes -> theme through its `--ui-*` tokens first, then walk "What web.css
          leaves to you" below.
   no  -> every state is unpainted until you paint it. List the states first.
4. Write each value on the hook the library exposes: `data-slot` for the part,
   a state attribute for the state, a CSS variable for a measured value.
5. Take the value itself from its own lane: [motion](motion.md),
   [components](components.md), [color-and-surface](color-and-surface.md),
   [accessibility](accessibility.md), [mobile](mobile.md).
6. Look at it running: Tab, a tap on a phone, reduced motion on, 25% speed.
```

## Who owns what

| The library decides | This skill decides |
|---|---|
| Keys, the one Tab stop, typeahead, where focus goes on open, close and removal | Whether the focus ring can be seen: 3:1 against what is around it |
| Roles, ARIA attributes, the announcement text | Whether every control has a name a person would recognize |
| When a popup mounts, is placed, and unmounts after its exit | The entrance and exit: properties, duration, curve, origin |
| Which state a part is in, exposed as an attribute | What each state looks like, and that no state moves the layout |
| Right to left, server rendering, the form value | Loading, empty, error and full for the data around the control |
| Keyboard height, safe areas and pointer kind, as numbers and CSS variables | What the layout does with them |

A screen can pass every behavior test the library ships and still fail this skill on a 1.3:1 focus ring, a hover that sticks or a popup that blinks out. That half is the job here.

## The hooks

- **Find a part by `data-slot`, never by a generated id or a class the library did not give you.** A root's slot is the component's name (`switch`); a part's is `<component>-<part>` (`select-trigger`). A few differ, such as a submenu's trigger, so read the slot from the rendered DOM before writing the selector. Ids can change between renders.
- **Paint state from the attribute: `data-open`, `data-pressed`, `data-checked`, `data-highlighted`, `data-selected`, `data-disabled`, or one with a value such as `data-side="top"`.** In Tailwind that is `data-pressed:bg-...`; in CSS, `[data-slot="select-trigger"][data-open]`. Never an inline style for a state: the attribute is there on the server's HTML and an inline style written in an effect is not.
- **Declare `@layer ui-sdk;` as the first line of the global stylesheet, above `@import "tailwindcss"`.** The library adds a little CSS of its own in that layer, and so does `web.css`. Declared first, any rule of yours outside a layer wins without `!important`. A CSS Module loads too late to declare it.
- **Change a part's element with `render`, never a wrapper and never an `as` prop.** The part carries the attributes, the handlers and the ref; a wrapper `div` styled as the control leaves them on the element inside it, so the ring and the hit area land on the wrong box. A custom component passed to `render` forwards its props and ref.
- **Sizes that follow the anchor come from the variables the popup sets:** `--anchor-width` for a menu as wide as its trigger, `--available-height` as the `max-height` of a scrolling list, `--transform-origin` for the entrance.

## Entrances and exits

Popup content gets `data-starting-style` on its first frame and `data-ending-style` while it leaves, and the library keeps it mounted until the exit's transition or animation finishes. Parts you build get the same two attributes from `animateIn` and `animateOut` in `@ui-sdk/core`.

- **Put the exit on `[data-ending-style]`, never on `[data-closed]`.** `data-closed` describes the state and does not keep the element in the page, so an exit written there never plays.
- **The values are this skill's, not the docs demo's.** The docs' popover demo runs 150ms in both directions; that shows the mechanism. Here the surface enters from `scale(0.96)` with `opacity: 0` over 200ms on `--ease-out-strong` and leaves in 150ms, as in `examples/popover/` and [motion](motion.md), Entrances, exits and feedback.
- **`transform-origin: var(--transform-origin)`** so the surface grows from its trigger. A centred modal keeps the default.
- **Transition `opacity` and `scale` (or `transform`) by name, never `transition: all`,** by [motion](motion.md), Properties and performance. The exit waits for every running transition on the element, so a stray one holds the popup in the page longer.
- **Write the reduced path yourself.** The library runs whatever CSS it finds: its own docs add the `prefers-reduced-motion` rule by hand in every example. Under reduce nothing scales or travels; with a mouse or keyboard the change is immediate, and on a coarse pointer an opacity-only fade of 120ms stays, by [accessibility](accessibility.md), Reduced motion.
- **A panel that opens in place (accordion, collapsible) is sized by the library** through `bindPanel`, which measures the height and sets it during the transition. Style the attributes it sets; never animate `height: auto` around it.
- **Leave `translate` free on an element bound with `bindAvoidKeyboard`,** and give it no transition: the helper moves it once a frame and a transition makes it trail the keyboard.

```css
[data-slot="popover-content"] {
  transform-origin: var(--transform-origin);
  transition: opacity 200ms var(--ease-out-strong), scale 200ms var(--ease-out-strong);
}
[data-slot="popover-content"][data-starting-style],
[data-slot="popover-content"][data-ending-style] { opacity: 0; scale: 0.96; }
[data-slot="popover-content"][data-ending-style] { transition-duration: 150ms; }
@media (prefers-reduced-motion: reduce) {
  [data-slot="popover-content"] { transition: none; }
  [data-slot="popover-content"]:is([data-starting-style], [data-ending-style]) { scale: 1; }
}
@media (prefers-reduced-motion: reduce) and (pointer: coarse) {
  [data-slot="popover-content"] { transition: opacity 120ms linear; }
}
```

## What web.css leaves to you

`@ui-sdk/core/web.css` is the optional default look. It is written with `light-dark()` under `color-scheme: light dark`, so it follows the system theme; a light-only product sets `color-scheme: light` on `:root`. Theme it through its tokens before restyling any part: `--ui-background`, `--ui-foreground`, `--ui-muted`, `--ui-muted-foreground`, `--ui-border`, `--ui-input`, `--ui-primary`, `--ui-primary-foreground`, `--ui-destructive`, `--ui-ring`, `--ui-ring-border`, `--ui-overlay`, `--ui-shadow`, `--ui-radius`, `--ui-spacing`, `--ui-font-size`, `--ui-line-height`, `--ui-font-sans`, `--ui-font-mono` and the `--ui-icon-*` masks.

Read from the file served at ui-sdk.dev/web.css on 2026-11-13. Re-read the installed copy (`node_modules/@ui-sdk/core/dist/web.css`) before quoting any row, since a beta stylesheet moves:

| It ships | Against this skill | Do |
|---|---|---|
| Focus ring `outline: 4px solid var(--ui-ring)`, `--ui-ring` at `oklch(0.913 0 0)` on a white ground | About 1.3:1 by calculation; a focus indicator needs 3:1 | Set `--ui-ring` to a value that measures 3:1 on `--ui-background` in both schemes, then press Tab and look |
| Disabled as `opacity: 0.5` on `[data-disabled]` | Disabled takes dedicated tokens, never `opacity` ([components](components.md)) | Outside the layer: `opacity: 1`, then the project's disabled text and fill tokens |
| `:hover` rules with no hover gate | Hover sits inside `@media (hover: hover) and (pointer: fine)` ([mobile](mobile.md)) | Tap each control on a phone; where the fill sticks, reset it under `@media (hover: none)` |
| No transition on any state, no entrance, no exit | Press, hover and popups each have a value in [motion](motion.md) | Add only the ones that pass that lane's "Decide first"; none is also a valid answer |
| `--ui-font-size: 0.8125rem` (13px) for control text, raised to `max(1rem, ...)` on inputs under `(pointer: coarse)` | Inputs are 16px on touch | Nothing for inputs. Check 13px labels against the type scale in [typography](typography.md) |
| `--ui-radius: 0` | One radius scale, nested radius = outer minus padding | Set `--ui-radius` from the contract; above 0 the switch and slider thumbs turn round |
| Control height `calc(var(--ui-spacing) * 8)`, 32px at the default `--ui-spacing: 0.25rem` | A 44px touch target | Keep the visual; extend the hit area with a pseudo-element under `(pointer: coarse)` |
| Icons drawn in `::before` or `::after` on triggers, indicators and step buttons | An icon system chosen on purpose | Render the product's own `<svg>` inside the part, or swap the `--ui-icon-*` token. A text glyph does not replace it, so you get two |

- **Never fight the layer with `!important`.** If a rule of yours loses, the `@layer ui-sdk;` line is missing or is not first.
- **Check these pairs when the tokens change:** `--ui-foreground` on `--ui-background`; `--ui-muted-foreground` on `--ui-background` and on `--ui-muted`; `--ui-primary-foreground` on `--ui-primary` at 4.5:1; `--ui-input`, `--ui-ring` and `--ui-ring-border` on `--ui-background` at 3:1.
- **A state must read on its own at 3:1 against what is around it:** a fill change, a full outline or a weight change. A faint tint alone does not, and Vercel's own skill warns against defaulting to a stripe down one edge.

## On a phone

The helpers come from `@ui-sdk/core` and report; the layout decisions stay in [mobile](mobile.md).

| The symptom | The helper | What it gives you |
|---|---|---|
| The keyboard covers a fixed bar or the button under a field | `bindAvoidKeyboard(el)` | Lifts the element by as much as the keyboard covers; `data-keyboard` while it is open, to drop the safe-area padding |
| The layout needs the keyboard's height | `bindViewport(el, { onChange })` | `--keyboard-inset`, `--visual-viewport-height`, `--visual-viewport-width`, `--visual-viewport-top` on the element |
| Content should differ for a finger and a mouse | `createPointerKind` | For behavior and content only. Style with the media queries, which are right from the first paint; the helper reads `"unknown"` on the server |
| The wrong keyboard opens | `inputHints` | `inputmode`, `enterkeyhint`, autofill and corrections for a kind of field |

Where the browser resizes the page for the keyboard (`interactive-widget=resizes-content`, the baseline in [mobile](mobile.md)), nothing is covered and `bindAvoidKeyboard` moves nothing. It earns its place on iOS, which pans the page instead. Both need a real phone to verify.

## Names, for people and for agents

An interface built from these components can be read and operated by an agent through `createAgent` and, in a browser that supports it, WebMCP. The bridge finds a control by its accessible name, so the naming rule in [accessibility](accessibility.md) now has a second reader.

- **Every control has a name from its label part (`FieldLabel`, `SelectLabel`, `DialogTitle`) or `aria-label`.** An unnamed control is one a screen reader user and an agent both cannot find.
- **A destructive button's text is not a substring of its trigger's.** "Delete forever" inside a dialog opened by "Delete project": a match on "Delete" alone finds the trigger. It is also the clearer label, by [components](components.md), Toasts, destructive actions, optimistic updates.
- **A plain `<button>` or bare `<input>` beside the library's components is invisible to the bridge.** In a review, list each one as a finding and hand the fix to `ui-sdk`.
- **`data-agent-confirm`, `data-agent-secret` and `data-agent-hidden` are product decisions, not styling.** Flag a delete, pay or send control that lacks `data-agent-confirm`; what the sentence says and the test that proves it belong to `ui-sdk`.

## Never ship

| Never | Instead |
|---|---|
| `[data-closed] { opacity: 0; transition: ... }` as an exit | The exit on `[data-ending-style]` |
| The docs demo's timing copied as the product's | The motion lane's values on the library's attributes |
| A selector on a generated id, or on a class you did not write | `[data-slot="..."]` read from the rendered DOM |
| `!important` to beat the library | `@layer ui-sdk;` as the first line of the global stylesheet |
| `opacity: 0.5` left as the disabled state | Disabled text and fill tokens |
| A hand-rolled `role="listbox"` beside an installed `@ui-sdk/*` package | The component, through `ui-sdk` |
| `web.css` shipped untouched as the product's look | The contract's tokens on `--ui-*`, then the table above |
| A component's behavior rebuilt from this file | Vercel's `ui-sdk` skill, or its install line |

## Check

Verifiable from code:

| Check | Pass |
|---|---|
| Global stylesheet, line 1 | `@layer ui-sdk;`, above any Tailwind import |
| `data-closed` | Never carries a transition or an animation |
| `data-starting-style`, `data-ending-style` | Each has a `prefers-reduced-motion` branch with no scale; the exit is 60 to 80% of the enter |
| `!important` on a `[data-slot]` rule | Zero |
| `role=` on a `div` or `span` | Zero for the ten roles in "Decide first" |
| `--ui-ring`, `--ui-radius`, `--ui-primary` | Set from the project's tokens, not left at the defaults |

Needs a look, because the gate reads text and cannot see an attribute the library sets at run time:

| Check | How |
|---|---|
| The exit plays | Close each popup at 25% speed; it fades and shrinks, never blinks out |
| The ring | Tab through every control on its real ground, both schemes |
| Sticky hover | Tap each control on a phone, then tap elsewhere |
| The keyboard | Focus the last field on an iPhone: the bar rises above the keyboard and does not trail on scroll |

`scripts/ui-check.mjs` has no line for any of this yet. Say so under "Not checked" when the screen is built on UI SDK.

## Not verified here

- The contrast figures are calculated from the OKLCH lightness in the stylesheet, not measured in a browser.
- No rule here was run on a device; the keyboard and pointer rows restate the library's docs.
- Vue, Svelte, Solid and web components follow the same attributes by the docs; only the React and core pages were read in full for this file.

## Sources

- Vercel Labs, UI SDK (github.com/vercel-labs/ui, Apache-2.0), read at commit `8ff6bcf` on 2026-11-13: `README.md`; the skill at `packages/core/skills/ui-sdk/` (`SKILL.md`, `references/styles.md`, `references/build-interface.md`, `references/agent-ready.md`).
- ui-sdk.dev/docs: Get Started; Core (Introduction, Style a Component, All Behaviors, Transitions and Gestures, Mobile); React (Installation, Styling and Animation); Agents (Built for Agents, Build with an Agent, Skills); the changelog post "Introducing UI SDK" (2026-11-12).
- ui-sdk.dev/web.css as served on 2026-11-13, for every row of "What web.css leaves to you".
- WCAG 2.2, 1.4.3 and 1.4.11, for the contrast floors.
