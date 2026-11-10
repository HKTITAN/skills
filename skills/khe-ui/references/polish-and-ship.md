---
title: polish-and-ship
summary: Runs the three closing passes in order: finish a screen that works, break it with realistic worst-case data, then sweep the whole app and fix it before production.
---

# Polish and ship

This lane decides what "finished" means once a screen works. It holds three passes, always in this order: the finishing pass on one screen, the break pass with hostile but realistic data, and the whole-app sweep before production. Open it when a screen "feels unfinished" with no single fault, before any review, and before any launch. A project's `.design` file or DESIGN.md outranks every default value here.

## Decide first

```text
1. Is the structure right (hierarchy, spacing, layout)?
   no  -> stop. Fix the layout first (see layout). Polish on the wrong structure is thrown away with it.
   yes -> PASS 1, the finishing pass, per component, after it works.
2. Does the component render anything it does not author
   (user input, API data, translations, a list, a prop-driven state)?
   yes -> PASS 2, the break pass: pick axes by cue, build the harness, fix what breaks, keep the fixture.
   no  -> container axis only (always applies).
3. Is the app going to production?
   yes -> PASS 3, the ship sweep: baseline first, then every lane, FIX the mechanical findings,
          report only decisions and devices.
4. Hand to review (see review) for the gate.
```

A review judges one diff against a craft bar and reports. The ship sweep judges the whole app against a ship bar and fixes: it asks what breaks in the first hour.

## Pass 1: finish the screen

No single item here is noticeable. Their absence is.

1. **Set antialiased smoothing once at the root, and subset fonts.** Per-component smoothing drifts.
2. **Never change font weight on hover, active or selected.** Weight reflows the text; hold weight and signal with colour.
3. **Put `tabular-nums` on every number that changes.** Counters, prices and timers jiggle without it.
4. **Give skeletons, placeholders and images the dimensions or `aspect-ratio` of the loaded state.** Dynamic content must never shift layout.
5. **Use real punctuation characters, and `text-wrap: balance` on headings.** See [typography](typography.md).
6. **Keep interaction states in place.** Hover transitions only the properties that change, about 150ms ease-out. Press is `scale(0.97)`, never below 0.95. Focus rings are neutral (grey, black, white) and never disappear. A styled `::selection` stays a legible tint. Use `will-change` only for transform, opacity or filter, and only after you observed a first-frame hitch.
7. **Use a fixed z-index scale, or avoid it.** `--z-dropdown: 100`, `--z-modal: 200`, `--z-tooltip: 300`, `--z-toast: 400`. DOM order first, then `isolation: isolate` so children cannot leak above unrelated UI, then one global file of layers.
8. **Make hit areas at least 44x44 on touch and 40x40 on desktop.** Extend with a pseudo-element; never let two areas overlap. See [mobile](mobile.md).
9. **Align by eye.** Trailing-icon padding is text-side padding minus 2px. Play triangles nudge 1 to 2px toward the point. Asymmetric SVGs are fixed in the viewBox.
10. **Keep the native scrollbar on the page.** Customise only small scrollers such as code blocks: 8px, translucent rounded thumb.
11. **Make empty states teach.** Headline, one line, primary action, sized to the filled state so completing the action does not shift the layout.
12. **Make decoration inert.** `pointer-events: none; user-select: none`.
13. **Set persisted state before first paint.** Never default-then-correct: that is the flash on refresh.
14. **Clear the sticky header and the home indicator.** `scroll-margin-top` on anchors; `env(safe-area-inset-bottom)` padding on fixed bottom chrome.

### Optical values

| Detail | Value |
|---|---|
| Label beside an icon, in a pill or disc | `text-box: trim-both cap alphabetic` |
| Words to any container edge | 12px; under 8px is a finding |
| Text to its neighbour | A fixed gap of 8 to 12px, never leftover `space-between` |
| Edges 1 to 3px apart | Align exactly, or part by 8px or more |
| Filled button hover | One step of its own colour: `color-mix(in srgb, var(--accent), #000 10%)` |
| Unread dot | Hangs 7px left of the lead, in the margin; the row never moves |

## Pass 2: choose the scenarios

A component looks finished with the mockup's copy, three rows and a 1280px container. Production sends an empty string, a German label, 400 rows and a 320px sidebar.

**Stress only what varies.** Keep an axis only when its cue matches. A static icon button with a fixed label gets container and state, never long text.

| Axis | Keep it when | Scenarios |
|---|---|---|
| Content length | It renders text it does not author (user input, CMS, API, translations) | Empty, one word, typical, several sentences, one unbreakable string (a long URL, `Donaudampfschiffahrtsgesellschaft`) |
| Content shape | Text can come from users or locales the team does not write in | Emoji alone and mixed, RTL, mixed direction, diacritics and tall scripts, figures that must align |
| Quantity | It repeats over items | Zero, one, the realistic count, ten times that |
| Container | Always | A 320px container, squeezed by a flex or grid sibling, very wide |
| State | It receives the state as a prop | Loading, error, disabled |

**Write the kept scenarios down first, one line each, and each dropped axis with its reason.** A wrong inference is then cheap to catch.

**Make every hostile value realistic, or the real limit.** A hyphenated accented surname, a 60-character corporate email, a two-letter first name, a workspace of 1,284, or the exact cap from the validation schema, the column type or `maxLength`. Random strings get dismissed as "never happens".

**Report missing and mismatched limits.** No limit anywhere is a finding ("unbounded"). So is a 50-character input saving to a 255-character column, because imports and the API will send the longer value.

**Spread failures across the first rows.** Real data does not stack every problem in row 1.

**Render product states from branches the code already has.**

| Kind | States |
|---|---|
| Data | Loading, empty, error, one item, a typical set, long enough to scroll or paginate, some resolved and some pending, stale while refetching |
| Account | Plan tier, role and permission checks, owner versus member |
| Feature | Flags, trials, limits reached, locked |

**Never add a branch to render a state.** A state the code cannot reach is not a state; list a designed-but-missing one as missing. Feed fixtures at the data boundary (the hook, the fetch, the store), never by editing the component. Show product states one at a time behind a switcher, not stacked.

## Worst-case values by field type

Names, emails and labels are the case everyone remembers. Add one row from every table that applies before lengthening anything. Emails and links use `example.com` or `.test` only, so a fixture never points at a real inbox.

| Field | Value | What it breaks |
|---|---|---|
| Name | `María-José Fernández-Castellanos`; a two-letter first name | Wrapping, initials from a naive `split(' ')[0][0]` |
| Email | `procurement.notifications@northwind-logistics.co.uk`; `rhea+invoices@example.com` | Overflow; validation that rejects `+`; truncation that hides the tag |
| Number | `0.1 + 0.2` stored as a total | Prints `0.30000000000000004` unless it goes through `Intl.NumberFormat` |
| Number | `-1820.4` in a ledger | The minus, the red rule, accounting parentheses `(1,820.40)` |
| Number | `117%` used, `-6%` change | Meters and progress bars drawn past their track |
| Number | A count of 1; a count of 1,284 | "1 members"; a raw `1284`; `NaN` on null |
| Time | `0` or `1970-01-01T00:00:00Z` | An unset timestamp shown as a real date |
| Time | `2026-03-31T23:40:00-07:00` | A different calendar day in UTC than for the user |
| Time | Created just now | "0 seconds ago" where "just now" belongs |
| Time | A renewal in 9 days | "-9 days ago" from a formatter that assumed the past |
| Time | `2,931` hours on a timer | A duration that never rolls into days |
| Collection | Exactly page size (25), then 26 | "Showing 25 of 25" off by one; an empty page two |
| Collection | Three projects all called `Q3 plan` | A list whose only distinguishing field is the name |
| Collection | One card ten times taller than its row | Grid and masonry rows stretched to the outlier |
| State | Every enum at once: `active`, `invited`, `paused`, `expired`, `deleted` | Badge widths that differ row to row |
| State | Half the optional fields filled | Misaligned rows, orphaned separators |
| State | The signed-in user inside the list | A missing "You", or "Remove" offered on yourself |
| Content | `<b>hi</b>`, `&lt;`, `**bold**` as a title | Must render as literal text, never as markup |
| Content | `North` + newline + `wing` in a one-line field | A doubled row, or the newline silently dropped |
| Content | A 2,000-character pasted note | Clamp, "show more", textarea growth |
| Media | An avatar URL that returns 404 | A broken-image icon instead of initials |
| Media | A 3600x180 panorama, a 180x3600 portrait | Distortion without `object-fit: cover`; a card blown tall |
| Media | A dark transparent logo in dark mode | Invisible on the surface |
| Media | A slow image with no `aspect-ratio` | Layout shift when it lands |

Format numbers, plurals and time through `Intl.NumberFormat`, `Intl.PluralRules`, `Intl.RelativeTimeFormat` and `Intl.DateTimeFormat`.

## The harness and what counts as a break

**Build a throwaway route with the scenarios side by side.** Each sits in a fixed container (a box on the page, never a resized viewport) at 320, 560 and 1100px, captioned with its break. The page is the report: build, look once, write what visibly broke.

**Caption every box with one named break and one cause, or the word "holds".** Example: `spills its slot: email past the 320 box`; `tight inset: badge 4px from the row edge`.

**Shoot the harness at the shipping width and again at 390.**

**Keep the harness outside the design system and never import it from product code.** Afterwards delete the route and its toggle in one step and grep for both.

**Keep the worst-case fixture beside the demo data.** It is the regression test for the next person who touches the component.

**Never simulate a viewing mode.** Dark mode, browser zoom, reduced motion and keyboard focus are the user's to toggle: name them in the report. Re-declaring dark tokens under a class observes a different component. Direction is content, so wrapping a scenario in `dir="rtl"` is fair.

**Stress in isolation, compare designs in context.** A bare harness answers "does it defend itself"; design variants belong on the real page.

| What you see | Cause | Fix |
|---|---|---|
| Avatar or icon squished into an oval | Flex child shrinking | `flex-shrink: 0` on fixed-size boxes |
| Text pushes past its box; trailing action off-screen | `min-width: auto` on the text column | `min-width: 0` (grid: `minmax(0, 1fr)`); `flex-shrink: 0` on the action |
| Email or URL runs off the edge | No break opportunity | `overflow-wrap: anywhere` |
| Badge wraps to two lines | Badge allowed to shrink | `white-space: nowrap; flex-shrink: 0`, and decide what yields |
| Avatar adrift beside a three-line name | `align-items: center` on wrapping rows | Top-align once text can wrap |
| Diacritics or tall scripts clipped | Tight `line-height` plus `overflow: hidden` | Looser leading, no clip on text boxes |
| An orphaned dash where an optional field was | Placeholder for missing data | Omit the line, or reserve its height on purpose |
| "1 members", `1284`, `NaN` | Hardcoded plural, raw number | `Intl.PluralRules`, `Intl.NumberFormat`, guard null |
| Broken-image icon, wrong initials | No `onError`, naive initials | A fallback chain, see [components](components.md) |
| 1,000 rows stutter | Every row rendered | Virtualize or paginate |

**A break is still open when it was cleared by deleting the hostile value from the fixture, or by clipping with no decision about what yields.**

## Pass 3: the ship sweep

Three ways to fail, worst first:

1. **Calling it ready from the desktop.** Sticky hover, input zoom, safe areas, the software keyboard, screen-reader order and dropped frames never reproduce in emulation on a fast laptop with a seeded account.
2. **A report where a diff belonged.** Almost every finding is one attribute, one declaration or one meta tag. Sixty rows of advice is not production prep.
3. **Redesigning in launch week.** Palette swaps, re-timed motion and new layouts are taste. Fix defects; taste goes on the human list with its owner.

| Lane | Hunts for | Owner |
|---|---|---|
| Accessibility | Unnamed icon buttons, div-buttons, removed rings, focus that escapes, colour-only errors | [accessibility](accessibility.md) |
| Performance | Unsized media, unpreloaded fonts, layout-property animation, per-frame state | [components](components.md), [motion](motion.md) |
| Mobile | Zoom disabled, inputs under 16px, `100vh` shells, ungated hover, no safe areas | [mobile](mobile.md) |
| Forms | Double submit, no `<form>`, a failed submit that clears fields | [components](components.md) |
| States | The four branches of every data view, flash on refresh, z-index strays | [components](components.md), [layout](layout.md) |
| Motion | `ease-in` entrances, `scale(0)`, over 300ms on product UI, animated keyboard actions | [motion](motion.md) |
| Theme | The theme nobody opened | [color-and-surface](color-and-surface.md) |
| Content and leftovers | Lorem, fake proof, dev tools, debug logs, secrets | [tells](tells.md) |
| Marketing | Titles, previews, crawl rules, the conversion path | [layout](layout.md) |

**Run the marketing lane only when marketing routes exist, and say so when it is skipped.**

**Theme sweep: decide first whether a second theme is reachable at all.** Reachable and half-built means finish it or make it unreachable, and that is a decision for the human list. Then hunt raw `bg-white`, `#fff` inside SVGs (use `currentColor`), shadows with no dark value (replace with one ring of about 8% white), and third-party embeds left on their default theme.

**Split what code proved from what needs hardware, and never claim the second kind.** Every "ready" names where it was seen. A lane with no evidence goes under "Not checked", never under clean: an empty or gapped capture is inconclusive, not a pass.

```md
# Ship check: <app> at <commit>
Fixed (diff): 14 (6 a11y blockers, 1 leak, baseline, 6 per-file)
Proved by code: typecheck, build, review checklist greps (counts pasted)
Seen on: desktop Chrome at 1440 and 390 wide (emulated, not touch)
Needs hardware: iOS Safari keyboard over the composer; VoiceOver order on /checkout
Human list: dark theme half-built (owner: design); hero re-timing (taste)
Skipped: marketing lane, no marketing routes
Not checked: Android Chrome, slow network
```

**Never manufacture findings.** "Already in good shape, small diff" is a valid result. A deliberate tradeoff recorded in a comment is noted, not "fixed".

## Severity and fix order

Walk top to bottom and stop at the first yes.

```text
1. Does it lock a group out (keyboard, screen reader, low vision, motion-sensitive, touch)?  -> Blocker
2. Will a typical user hit it in their first session?                                       -> Blocker
3. Does it leak secrets, debug output, dev tools or fake content?                           -> Blocker
4. Is it visible only on another device, theme, network or data state?                      -> Should fix
5. Otherwise                                                                                -> Polish
```

**Context overrides a lane's default.** A missing `alt` on the only product shot is a blocker; `100vh` on a desktop-only admin tool is nothing.

Fix in this order, which never masks a finding:

1. Accessibility blockers.
2. Leaks.
3. The baseline below. One change clears dozens of instances.
4. Per-file fixes, grouped by file.
5. Polish, while the diff is still reviewable in one sitting.

- **Never restructure markup unless the markup is the finding.**
- **Anything bigger than a few lines goes on the human list with its owner.** A hand-rolled modal that needs a focus trap, a list that needs virtualizing.
- **One root cause with forty instances is one row with a count, fixed at the root.**
- **Run typecheck and build afterwards.** A ship sweep that breaks the build is worth less than none.

## The baseline

**Merge, never append.** Most projects have half of it: add missing lines to the existing root rules, in the project's styling system and tokens. Never create a second viewport tag or a second global stylesheet.

**Read project values, never invent them.** Language, header colour, header height, origin and product name come from the project. If a value is not there, leave the line out and flag it.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
```

| Where | Line | Why |
|---|---|---|
| Head | `viewport-fit=cover` | Makes `env(safe-area-inset-*)` non-zero |
| Head | `interactive-widget=resizes-content` | Android's keyboard shrinks the layout viewport, so `100dvh` and bottom-pinned composers behave as on iOS |
| Head | Never `maximum-scale` or `user-scalable` | Fix the 16px input instead of locking zoom |
| Head | `<html lang>` set to the content's real language | Screen readers and hyphenation depend on it |
| Head | Only the designed `color-scheme`; one `theme-color` per `prefers-color-scheme`, matching the header background, not the brand colour | `light dark` on a light-only app renders dark native controls and canvas under a light UI |
| Head | Preload used `woff2` files with `crossorigin` | Without `crossorigin` the preload is fetched and discarded. Skip when the framework's font loader preloads |
| `html` | `-webkit-text-size-adjust: 100%` | Stops text inflation on rotate |
| `html` | `font-synthesis: none` | A weight that never loaded fails visibly instead of being faked |
| `html` | `-webkit-tap-highlight-color: transparent` | Obliges every control to have its own `:active` state |
| `html` | `overscroll-behavior: none`, app shells only | Stops pull-to-refresh hijacking the shell |
| Root | `:focus-visible` outline 2px in the strongest neutral, `outline-offset: 2px` | One visible ring everywhere |
| Root | `input, textarea, select` at 16px on touch; `touch-action: manipulation` on every control | No zoom on focus, no tap delay |
| Root | `user-select: none` on buttons and tabs, never on `body` | Long-press does not select labels; content stays selectable |
| Root | `h1, h2, h3 { text-wrap: balance }`, `p { text-wrap: pretty }` | Even headings, no orphans |
| Root | `[id] { scroll-margin-top }` equal to the sticky header's measured height | Anchors clear the header |
| Root | `scroll-behavior: smooth` only inside `prefers-reduced-motion: no-preference` | Respects the system setting |

**Move the two gates to token or config level.**

- Hover: every `:hover` sits behind `(hover: hover) and (pointer: fine)`. Tailwind v4's variant already does it; v3 needs `future.hoverOnlyWhenSupported: true`, one line that fixes every instance.
- Reduced motion: swap movement for opacity where the shared keyframes or duration tokens live, and set Motion's `MotionConfig reducedMotion="user"`, because its default ignores the OS.

```css
@media (prefers-reduced-motion: reduce) {
  :root { --enter-y: 0px; --enter-scale: 1; } /* the opacity fade is kept */
}
```

**Stop the theme flash and ripple.** With `next-themes`, `disableTransitionOnChange` stops every surface tweening at its own speed on toggle, and its blocking script stops the flash on refresh. Without it, add a `no-transitions` class for two frames around the switch.

**Mount dev tools only under the development build check, through a dynamic import.** The package then stays out of the production bundle.

## Never ship

| Never | Instead |
|---|---|
| Bold on hover or selected | Constant weight, colour signals state |
| `scale(0.9)` on press | `scale(0.97)`, floor 0.95 |
| A brand-coloured focus ring | A neutral 2px ring, `outline-offset: 2px` |
| `z-index: 9999` | The 100 / 200 / 300 / 400 scale, or `isolation: isolate` |
| A 20px icon with a 20px hit area | A pseudo-element out to 44px |
| A blank div for an empty list | Headline, one line, action, sized like the filled state |
| A fixture of `Ana Silva`, `ana@acme.com`, one 1280px screenshot | A hostile realistic fixture in 320, 560 and 1100px boxes |
| A break "fixed" by removing the hostile value | The fixture kept, the layout fixed |
| Dark tokens re-declared in the harness | Name the mode; the user toggles it |
| `maximum-scale=1` | 16px inputs |
| `color-scheme: light dark` on a light-only app | `color-scheme: light`, one `theme-color` equal to the header background |
| Every duration token set to `0ms` under reduced motion | Movement tokens zeroed, opacity fade kept |

## Check

- Pass 1: screenshot at 1:1. Measure every word to its container (12px or more) and every pair of near edges (0, or 8px or more).
- Pass 2: every harness box carries a named break or "holds", at 320, 560 and 1100px, shot at the shipping width and at 390.
- Pass 3: load the app fresh at 390 and at desktop width, once per declared scheme and once with reduced motion on. A light pass does not prove dark. Every frame is complete: no dark native control under a light UI, nothing stuck half-entered.
- `document.querySelectorAll('meta[name=viewport]').length` is 1.
- Typecheck and build pass after the sweep.
- Sticky hover, input zoom, safe areas, the software keyboard, screen-reader order and dropped frames are listed under "Needs hardware" until someone checks them on a real phone.

## Where sources disagree

- **Reduced motion scope.** App UI keeps the short opacity fade and drops only movement. A Stageshow demo still drops every transition, opacity included, and lands on its settled poster. This file uses the app rule for product UI.

## Sources

- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT): the finishing pass, the worst-case value kinds and failure signatures, the ship sweep, the baseline.
- Jakub Krehel, interfaces skills (github.com/jakubkrehel/skills, MIT): scenario axes and cues, product states behind a switcher, feeding fixtures at the data boundary.
- Benji Taylor, Stageshow 1.1.1 (github.com/benjitaylor/skills, MIT): inset and near-edge measurements, the hand-over template, shooting at 390, clearing by hiding counts as open.
- Benji Taylor, benji.org/liveline: stress-testing a component with worst-case data.
