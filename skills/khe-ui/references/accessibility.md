---
title: accessibility
summary: Decides whether an interface works by keyboard, screen reader, low vision and reduced motion, and which failures are WCAG 2.2 A/AA findings versus recommendations.
---

# Accessibility

This lane is the floor every component passes before any visual judgment: keyboard reach, focus, names and roles, contrast, hit areas, announcements, reduced motion. Open it when building or reviewing anything interactive, and whenever a review must separate a blocking finding from a preference. A project's `.design` file or DESIGN.md outranks every default here, except the numbers marked as WCAG requirements, which no project file can lower.

## Decide first

```text
1. A native element or headless primitive (Radix, React Aria, Base UI) does this?
   yes -> use it, stop. Never hand-roll a select or combobox.
2. Mouse away: Tab reaches it -> ring visible -> Enter/Space activates
   -> Escape dismisses -> focus returns to the trigger.
3. Every control has a role (from its element) and a name.
4. Something changes without focus moving there? -> announcement ladder.
5. Measure every text and boundary pair on the surface it renders on,
   and every target's hit box.
6. Reduced motion on: the finished state shows, nothing travels.
7. 200% text, then 320px wide: nothing clipped, vertical scroll only.
8. Classify each failure:
   cites a WCAG 2.2 A/AA criterion, or a task an assistive-tech
   user cannot finish  -> finding (may block)
   anything else       -> recommendation (never top severity)
```

## Findings and recommendations

**A finding always cites a criterion number or an unfinishable task.** Without that evidence it is taste, and taste never blocks on accessibility grounds.

| WCAG 2.2 criterion | Requirement (A/AA) |
|---|---|
| 1.4.3 Contrast | Text 4.5:1. Large text (24px and up, or 18.67px and up bold) 3:1 |
| 1.4.11 Non-text contrast | Component boundaries, states and meaningful icons 3:1, including input borders and custom focus rings against every adjacent colour |
| 1.4.1 Use of colour | Status never by colour alone: add an icon, text or underline |
| 2.5.8 Target size | 24 by 24 CSS px, or a smaller target spaced so a 24px circle centred on it touches no other target. Links inside a sentence are exempt |
| 2.5.7 Dragging | Every drag has a single-pointer alternative: buttons or a menu reaching the same result |
| 2.4.7 / 2.4.11 Focus | A visible indicator; the focused element never fully hidden under sticky chrome |
| 1.4.4 Resize text | Everything survives 200% text |
| 1.4.10 Reflow | Works at 320px wide (400% zoom on 1280px), vertical scroll only. Tables, maps and code scroll in their own box |
| 2.2.2 Pause, stop, hide | Anything moving, blinking or self-updating for more than 5 s has a visible pause |
| 1.4.2 Audio control | Nothing autoplays with sound |
| 4.1.3 Status messages | Status changes reach assistive tech without a focus move |
| 1.1.1, 1.2.1, 1.2.2 | Text alternatives for images, captions for prerecorded video, a transcript for audio |

Inactive controls and logos are exempt from contrast.

Recommendations, never a WCAG A/AA failure: 44 by 44px touch targets (Apple HIG), 40px desktop targets, APCA Lc values, one `h1` per route with no skipped levels, AAA criteria, and ARIA Authoring Practices key maps (though a widget with no keyboard path at all is an unfinishable task, so a finding).

- **Never set `maximum-scale=1` or `user-scalable=no`.** It fails 1.4.4; the iOS input zoom is fixed by a 16px input, see [mobile](mobile.md).
- **Text boxes take `min-height`, never `height`.** A fixed height clips at 200% text.
- **Write media queries in `rem`.** A larger browser font size then reaches the narrow layout.
- **Auto-dismiss only low-stakes confirmations.** A toast with an action, an error or needed information stays until dismissed. One that must time out lasts 5 s or more, scales with its text at 200 to 250 words a minute (never a flat 2 s), and pauses on hover, on focus and while the tab is hidden (`visibilitychange`), resuming with the remaining time.

## Contrast

- **Measure the foreground against the surface it renders on, never the page background.** Report the pair, the value and the threshold missed; leave colours alone unless asked.
- **Design with APCA, report with WCAG 2, pass both.** APCA tracks perception; the WCAG 2 ratio is what a product is held to.

| Use | WCAG 2 (requirement) | APCA Lc (recommendation) |
|---|---|---|
| Body text | 4.5:1 | 75, 90 preferred |
| Other content text, UI labels | 4.5:1 | 60 |
| Large or heavy text | 3:1 | 45 |
| Icons, borders, focus rings | 3:1 | 30, a floor |
| Placeholder, disabled | exempt when inactive | 30, a floor |

APCA magnitudes apply to both polarities. Calibration pairs:

| Pair | Ratio | Verdict |
|---|---|---|
| `#262628` on `#fff` | 15.1:1 | Pass |
| `#767676` on `#fff` | 4.54:1 | Lightest grey passing body text |
| `#7a7a7d` on `#fff` / on `#f6f5f4` | 4.28:1 / 3.93:1 | Fails body text |
| `#9a9a9d` on `#fff` | 2.81:1 | Fails even 3:1 |
| `#ef4444` on `#fff` | 3.76:1 | Passes as a ring, fails as text |
| `#b91c1c` on `#fff` | 6.47:1 | Pass |

- **Split danger into two tokens.** One hue for rings (3:1), a darker one for words (4.5:1).
- **Repair a failing pair by moving lightness only.** Hue and chroma hold the brand; see [color-and-surface](color-and-surface.md).
- **Hover and pressed raise contrast; only disabled lowers it.** A filled button's hover is `color-mix(in srgb, var(--accent), #000 10%)`, never a swap to grey.
- **Disabled takes dedicated tokens, never `opacity`.** Opacity lets the background through, so one control passes on one surface and fails on the next.
- **Pair every colour signal with a second cue.** About 8% of men are colour-blind: errors get an icon and words, required fields an asterisk.
- **Declare only the colour schemes that were designed, on `:root`.** `color-scheme: light dark` on a light-only app gives dark-OS users dark native controls on a white page.

## Keyboard maps

- **`tabindex` is `0` or `-1`, nothing else.** `0` joins the natural order for a custom control; `-1` is script-focus only (a heading, a dialog container, a roving member). A positive value hijacks the whole page.
- **DOM order is visual order.** `order`, `row-reverse` and absolute positioning make Tab jump; reorder the markup.
- **A composite widget takes exactly one Tab stop.** With roving tabindex the active item is `0`, all others `-1`, and arrows move both focus and the `0`. A combobox keeps DOM focus in its input and points `aria-activedescendant` at the highlighted option's `id`.

| Widget | Keys it owes |
|---|---|
| Dialog | Tab and Shift+Tab cycle inside and wrap. Escape closes |
| Tabs | Arrows move and wrap. Home and End jump. Tab leaves to the panel. Automatic activation when panels render instantly, manual (Enter or Space) when switching is expensive |
| Menu button | Enter, Space or Down opens on the first item. Up opens on the last. Escape closes and refocuses the button |
| Disclosure, accordion | Header is `<button aria-expanded>`. Enter and Space toggle |
| Combobox | Down opens or moves in. Enter accepts. Escape closes back to the input. Typing filters |
| Listbox, radio group | Arrows move the selection. One Tab stop for the group |

- **Escape dismisses whatever opened last.** Tooltip, then menu, then dialog.
- **Enter submits a single-line input in a real `<form>`; Cmd or Ctrl+Enter submits a textarea.** The second exists only when wired by hand.
- **Show shortcuts in the user's OS.** Cmd on macOS, Ctrl elsewhere, bound to match.
- **Grep `role="button"`, `role="tab"`, `role="menuitem"` and check each for a key handler.** A role with no `onKeyDown` looks finished in every screenshot and is dead to the keyboard.

## Focus

- **Style `:focus-visible`, never bare `:focus`, never `outline: none` alone.** `:focus` rings on every mouse click; removing the outline strands keyboard users.
- **Default to the browser ring plus `outline-offset: 2px`.** It adapts to platform and forced colours. A custom ring (2px solid plus a 1px shadow, or a 1px inset line with a 3px soft halo) is allowed only as a verified token clearing 3:1 against every colour it crosses; if the halo cannot clear 3:1, thicken the inner line to 2px.
- **Draw custom rings with `box-shadow` over `border: 1px solid transparent`.** The shadow keeps text from shifting as focus lands; the border keeps an edge when Windows High Contrast drops every shadow. Never `forced-color-adjust: none` unchecked.
- **A ring means focus and nothing else.** Never ring a card to point at it.
- **Reserve room under sticky chrome.** `scroll-padding-block-start` equal to the header height, `-block-end` for a sticky footer or cookie bar.
- **Open dialogs with `<dialog>.showModal()`.** Inert background and Escape come free. A custom overlay needs `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `inert` on everything behind it.
- **On open, focus the first focusable element; in a destructive confirmation, the least destructive button.** A reflexive Enter then cancels.
- **On close, return focus to the trigger, or the nearest logical container if it is gone.** Deleting the focused row moves focus to the next row, else the previous, else the list heading.
- **Hidden content leaves the tab order.** `visibility: hidden`, `display: none` or `inert`, never `opacity: 0` or an off-screen transform. To keep an exit animation: `transition: visibility 0s 200ms`.
- **Focus never lands off-screen.** Call `scrollIntoView({ block: "nearest" })`.
- **On every client-side route change, set `document.title`, then focus the new `<h1 tabindex="-1">` or `<main>`.** A router swap resets neither. Restore scroll on back and forward; scroll to top on a new navigation.
- **Put a skip link first.** `<a href="#main">Skip to content</a>`, visually hidden until focused.

## Hit areas and pointer

| Surface | WCAG 2.5.8 requirement | Recommendation |
|---|---|---|
| Touch | 24 by 24px | 44 by 44px |
| Desktop | 24 by 24px | 40px; an established dense tool stays dense |

- **Keep the visual small and grow the hit box with a pseudo-element.** `inset: -10px` on a 24px icon gives 44px. Add `flex: none` so a flex row cannot squeeze it to 18px.
- **Hit areas never overlap.** Shrink to the largest non-colliding size.
- **Decorative layers get `pointer-events: none`.** A glow must never swallow the click beneath it.
- **Hover enhances, never enables.** Gate hover styles behind `@media (hover: hover) and (pointer: fine)`; errors and status never live only behind hover.
- **A trigger keeps its pressed look while its popover is open** (style on `data-open`), so the source of the open surface stays visible.
- **Tooltips wait 200ms, then go warm.** Once one is open, siblings open instantly with no entrance; the warm state clears 300ms after the last closes. A tooltip holds nothing interactive: a link inside is unreachable and belongs in a click-opened popover.
- **Submenus get a triangular safe area** (`clip-path` on a pseudo-element) so a diagonal pointer path does not close them.

## Names, roles and structure

- **HTML semantics first, ARIA second.** `<button type="button">` beats `<div role="button" tabindex="0">`.
- **Every icon-only button has an `aria-label` naming the action.** "Close dialog", never "icon". The icon inside is `aria-hidden="true"`.
- **Every input has a `<label>` wired by `for`/`id` or wrapping.** A placeholder is not a label.
- **Never put `aria-hidden="true"` on or above anything focusable.** Tab lands on a stop the reader says does not exist; hiding something interactive means `inert`.
- **Each route has one `<main>`, one `h1`, a set `<html lang>` and its own `document.title`.** Readers jump by landmark and heading. Heading level comes from the outline, size from the type scale.

| Image purpose | `alt` |
|---|---|
| Decorative, or repeats adjacent text | `alt=""`, present and empty |
| Informative | The meaning it adds: "Ticket QR code" |
| Functional (the image is the control) | The action: "Search", never "magnifying glass" |
| Image of text | The exact text; real text is better |
| Chart or diagram | A one-line summary, with the data as a table nearby |

A missing `alt` is worse than an empty one: readers fall back to the file name. Inline SVG: decorative takes `aria-hidden="true"`, meaningful takes `role="img"` plus `aria-label` (see `khe-svg`).

## Announcements

Walk the ladder and stop at the first match: the quietest mechanism that works is the correct one.

```text
1. Focus moves there anyway (opened dialog, first invalid field) -> add nothing
2. Tied to one control (field error, character count)            -> aria-describedby
3. Not urgent, no control (toast, "Saved", result count, loading) -> role="status"
4. Urgent, no control (form-level failure, session expiry)        -> role="alert"
```

`role="status"` is `aria-live="polite"` plus `aria-atomic="true"`; `role="alert"` is its assertive twin.

- **Render the live region empty on first paint, then change its text.** A region mounted with its content is announced inconsistently: `<div role="status" className="sr-only">{announce}</div>`.
- **Success is always polite.** `assertive` on "Saved" interrupts what the user was hearing; only a failure that blocks the task earns `role="alert"`.
- **Keep messages short and self-contained.** `aria-atomic` re-reads the whole region on every change.
- **Never move focus to a toast.** Announce it and leave focus where the user works.
- **Wrap loads in `aria-busy="true"`.** Say "Loading" politely, then the outcome: "Loaded, 12 results".
- **Insert the words on show, remove them on hide.** Text left in the tree at `opacity: 0` is still read.
- **Visually hidden text is a 1px box, never 0.** `position: absolute; width: 1px; height: 1px; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap`. Some readers skip zero-sized boxes; `nowrap` stops words running together.

## Reduced motion

5 to 15% of users set `prefers-reduced-motion: reduce`. **Ship the reduced path in the same change as the animation.**

- **Never `* { animation-duration: 0ms !important }`.** It strands entrances at their start state and deletes fades that carry meaning.
- **The reduced state is the finished state, not frame 0.** An entrance from `opacity: 0` that only runs under `no-preference` means the text never arrives. A first screen with two or more text blocks invisible under reduce fails.

| Motion | Under reduce |
|---|---|
| Large translations (panels, route transitions) | Remove |
| Scale changes (modal from 0.8 or 0.95 to 1) | Remove, `transform: none` |
| Parallax, springs, overshoot | Remove |
| Loading spinners | A "Loading" label or progress bar |
| Autoplaying video, carousels | Poster plus a play button |
| Confetti, hero animation | Static finished state |
| Colour and background transitions | Keep |
| In-place values (progress fill, meter, counter) | Apply at once |
| Hover, selection and press-onset colour | Apply at once |

What replaces removed motion depends on the pointer:

| Context | Replacement |
|---|---|
| `pointer: coarse`, or a transition started by a touch release | Opacity-only cross-fade, 200ms or less, element already in its final place |
| Mouse, trackpad, keyboard | Immediate, no animated property |
| A colour changing with a cross-fading part (switch track and thumb) | Follows that cross-fade |

- **Direct manipulation is not a transition.** Content under a finger keeps tracking and a throw keeps coasting; a move the component starts on release (snap, dismiss) cross-fades.
- **Overrides only tighten.** A theme may force the reduced path for everyone; nothing keeps travel or springs under reduce.
- **Read the preference live** with a `change` listener on `matchMedia('(prefers-reduced-motion: reduce)')`; toggling mid-playback strands nothing at `opacity: 0`.
- **Animated images follow the setting.** The animated `<source>` sits in a `<picture>` with `media="(prefers-reduced-motion: no-preference)"` over a static `<img>`. A looping CSS animation pauses on a representative frame (`animation-play-state: paused` plus a negative `animation-delay`).
- **Some motion harms with the setting off.** No whole-viewport moving background, no slow loop near 0.2 Hz (one cycle every 5 s), no hard brightness jump; ease a theme switch.

Full-motion timing is in [motion](motion.md).

## Never ship

| Never | Instead |
|---|---|
| `outline: none` with no replacement | `:focus-visible` ring clearing 3:1 |
| `tabindex="1"` or any positive value | Fix DOM order; only `0` and `-1` |
| `<div onClick>`, or `role="tab"` with no key handler | Native element or the full key map |
| Drawer hidden with `opacity: 0` or `translateX(100%)` | `visibility: hidden` or `inert`, flipped after 200ms |
| `{msg && <div role="status">{msg}</div>}` | Region in the DOM, empty, from first render |
| `aria-live="assertive"` on a success toast | `role="status"` |
| `#9a9a9d` or `#7a7a7d` body text on white | `#767676` or darker (4.54:1) |
| Disabled state by `opacity` | Dedicated disabled tokens |
| Error shown by red alone | Icon plus words in a 4.5:1 danger text token |
| 16px icon button with no padding | 24px hit box minimum, 44px on touch via `inset: -10px` |
| Drag as the only way to reorder | Move buttons or a menu |
| `user-scalable=no`, `maximum-scale=1` | 16px inputs, zoom left on |
| Undo toast that vanishes after 2 s | Stays, or 5 s and up, paused on hover and focus |
| Perpetual spinner under reduced motion | "Loading" text or a progress bar |

## Check

1. Mouse away, 390px wide, screen recorded: Tab reaches every control, exactly one ring per frame, no label moves a pixel as focus lands, no text under 10px, Escape returns focus to the trigger.
2. Every composite widget: one Tab stop, arrows wrap end to start, Home and End jump.
3. Tab with every drawer and menu closed: no stop lands on something hidden.
4. Every text token measured against every surface it renders on. Then view at 390px without zooming: a word that needs leaning in for fails whatever the ratio says.
5. Tap every icon button at its outer edge on a real phone or with touch emulation; a narrow window changes width, not touch.
6. VoiceOver or NVDA through one action and its undo: exactly one announcement per change, nothing from a hidden toast, focus never moved.
7. Reduced motion on: cover the animation and ask what happened; the still answers alone. Toggle the setting mid-playback and back.
8. 200% text, then 320px wide: no clipping, no horizontal page scroll. Windows forced colours: every control and ring keeps an edge.
9. Screen reader checks run on each browser and reader pair the product supports; inserted alerts vary by reader.

## Where sources disagree

- **Large-text cutoff.** About 24px, or bold from about 18.5px, versus 24px, or 18.67px bold. This file uses 18.67px.
- **Targets.** 24px pointer and 44px touch, versus 44px touch and 40px desktop. This file: 24px is the WCAG requirement, 44px and 40px are recommendations.
- **Focus ring.** A brand-accent custom ring versus the browser ring with `outline-offset: 2px`. This file defaults to the browser ring.
- **Reduced motion.** Keep a 120ms opacity fade everywhere; disable everything, fades included; or cross-fade 200ms or less on coarse pointers and switch instantly otherwise. This file uses the by-pointer rule.
- **Hover gate.** `(hover: hover)` alone versus `(hover: hover) and (pointer: fine)`. This file uses both conditions.

## Sources

- W3C, Web Content Accessibility Guidelines 2.2, and 2.1 Animation from Interactions.
- W3C, ARIA Authoring Practices Guide: dialog, tabs, menu button, disclosure, combobox, listbox.
- Jakub Krehel, interfaces skills (github.com/jakubkrehel/skills, MIT).
- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT).
- Benji Taylor, Stageshow (github.com/benjitaylor/skills, MIT).
- Meta, Astryx (github.com/meta/astryx, MIT): reduced motion by pointer.
- Andrew Somers, APCA documentation (git.apcacontrast.com).
- Vercel, Web Interface Guidelines.
- bendc/frontend-guidelines: never rely on colour alone.
- Apple, Human Interface Guidelines: 44pt touch targets.
- Leonxlnx, taste-skill (MIT): text hidden under reduced motion.
