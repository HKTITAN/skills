---
title: components
summary: Decides every state a control or data view owes (hover, press, pending, disabled, loading, empty, error), plus forms, toasts, destructive actions, copy, component APIs and live surfaces.
---

# Components

This lane decides what a component does in every state, not only the filled, happy one. Open it when building or reviewing a control, a form, a list, table or dashboard, a toast, a delete flow, a shared component's props, or a chat, agent or multiplayer surface. A project's `.design` file or DESIGN.md outranks every default here.

## Decide first

```text
1. List the states before styling one. A data view owes loading, empty, error, full.
   Then check: partial, offline, permission-denied, stale, over-quota, sync conflict.
   A missing branch is the finding. Framework default error and 404 pages count as missing.
2. Is the user waiting?
   < 150ms          show nothing (delay every indicator 150ms)
   by 400ms         content region: skeleton in the loaded shape
                    inside the control that started it: spinner + pending label
   3s to 15s        progress bar with percentage
   15s+             progress bar + time estimate + Cancel
3. Will the action succeed (toggle, complete, rename, reorder)?
   yes              update at once, reconcile later, roll back in place on failure
   server decides   (username free? payment, signup) wait and show pending
4. Does the action destroy something?
   reversible and frequent      act now, toast with Undo
   irreversible, one item       confirm
   irreversible, many items     confirm with the count
   affects other people         confirm and name them
   account/workspace/repo       type the name to confirm
5. Where does the answer show? On the thing pressed. A toast only when it carries
   an action (Undo) or the thing pressed is gone.
6. Reserve the room for every state from the first frame. Then write its copy.
```

## Hover, press, pending, disabled

| Element | Hover | Timing |
|---|---|---|
| Row, list item, table cell | `rgba(0,0,0,0.04)` fill, inset and rounded | 120ms |
| Menu row | `rgba(0,0,0,0.06)`, 6px radius, 8px side padding | in at once, out 150ms ease |
| Filled button | `color-mix(in srgb, var(--accent), #000 10%)` | 160ms |
| Ghost button | `rgba(0,0,0,0.06)` on transparent | 160ms |
| Card | `translateY(-1px)`; scale ceiling `1.02` | 150ms |
| Input | border one step stronger; accent on focus | 100ms |
| Icon button | inner icon `scale(1.05)`, not the button | 100ms |
| Link | colour or underline only, no surface | none |

- **Gate hover behind `@media (hover: hover) and (pointer: fine)`.** On touch, `:hover` sticks after a tap until the next tap elsewhere.
- **Animate only `transform`, `opacity`, `background-color`, `border-color`, `box-shadow`, never `transition: all`.** A hover that changes margin, padding or width shifts its neighbours.
- **A filled button darkens one step of its own colour, never swaps to gray.** A gray swap reads as disabled.
- **Put negative margins on the list, not the row.** The hover fill stays inset.
- **Paint the press on the part the hand moves.** Checkbox or radio: the indicator, not the label row. Switch: track and thumb. Slider: only the dragged thumb. Segmented control: an unselected item only. A darkened row reads as "selected".
- **Clear press paint on release or cancel, back to the exact resting pixels.** A press is never a persisting state, and an existing selection outranks it.
- **Press scale: `scale(0.97)` on `:active` over 160ms, `0.96` for an icon button.** Feedback starts in the frame after the input. The values are the ones in [motion](motion.md).
- **Disabled never answers.** Buttons and inputs alike take dedicated tokens (`--color-text-disabled` and a disabled background) with `cursor: not-allowed`, never `opacity: 0.5`: opacity lets the background through, so the control passes on one surface and fails on the next, and it washes out a complex element. Focusable to explain is not operable.
- **Pending keeps size and name.** Set `aria-busy`, fix width and height, spinner inside, accessible name unchanged, and style it differently from disabled.
- **No state changes the elevation tier.** Hover, press, focus, loading and disabled change paint only. A connected group that paints one surface owns one shadow.
- **Touch action groups act on the action the finger lifts on.** One action per gesture; the highlight follows the finger; nothing highlights over a disabled item or a gap; lifting outside, a second finger or a cancel does nothing.

## Loading, empty, error

- **Empty states do three jobs: say what belongs here, give the next action, optionally show an example.** "No projects yet" plus a Create button. Size it like the filled view so the first item moves nothing.
- **Empty and error look and read differently.** A generic "No data" hides whether the inbox is empty or broken.
- **An empty search names the query and offers to clear it. An error says what happened and gives one specific recovery** (a retry that refetches, a link that works).
- **Never auto-redirect from an empty state.** It reads as a crash.
- **Never use a centred spinner as a list or page loading state.** It collapses the page, then everything jumps.
- **Only the data loads.** Window, title, tabs and column heads are real from frame one; a skeleton over chrome reads as a page that never loaded.
- **Size skeleton rows from the loaded row** (48px because the real row is 48px). Bar and words share one grid cell (`grid-area: 1 / 1`) so nothing moves on swap.
- **Read persisted state before first paint.** Theme: a blocking head script. Sidebar or density: a cookie read on the server. Client-only: a lazy `useState` initializer. Late banners overlay the page.

Measured skeletons (when hand-drawn bars drift):

| Rule | Value |
|---|---|
| Text | one bar per rendered line, ascender to descender |
| Media, inputs | one block at the element's box |
| Shape source, best first | data on screen, data last shown under the same id, remembered shape, author's sample, children without data, generic lines |
| Hold before showing | 150ms |
| Loaded under 150ms, or user scrolled or typed in the last 400ms | reveal at once |
| Refetch over visible data | 120ms crossfade |
| Under 72px tall or 3 pieces or fewer | one crossfade |
| Larger | row by row across a 320ms spread, small text 60ms behind |
| Hand-staged rows | each row whole, top to bottom, 70ms apart |
| Wrong guessed height | eases to real height over 280ms |
| Shimmer | one page clock, 20 degree highlight, max 320px wide, 4s or 2s per 1280px |
| Pulse | 2.4s or 1.2s loop down to 45% opacity |
| Image | own block until decoded, 10s ceiling |

Loading regions are `aria-busy`; the skeleton is `inert` and hidden from assistive tech; all skeleton motion stops under `prefers-reduced-motion`. Remembered shapes keep layout, never content, and clear on sign-out.

## Forms

Validation timing:

1. **While typing: no errors.** Only a positive signal (a check when the field turns valid).
2. **On blur: validate and show the error.**
3. **After an error shows: re-validate on every change.** The message clears the moment the value is fixed.
4. **On submit: final pass, scroll to and focus the first invalid field.**
5. **Cross-field rules fire when the second field blurs.** The first cannot be wrong alone.

- **Reserve an 18px message lane under each field from frame one.** Hint and error crossfade in it (out 0.15s, in 0.25s ease-out after 0.07s). An error never moves the form.
- **Error display: 1px danger ring, optional `rgba(danger, 0.04)` tint, 13 to 14px message below the field, `aria-invalid` and `aria-describedby`.**
- **Error copy names the fix, not the fault.** "Add the domain, like name@company.com", never "Invalid input". No "Please".
- **Never disable submit until valid.** It explains nothing; let the click run validation.
- **Server errors land beside their field and never clear what was typed.**
- **Mark optional fields "Optional".** `required` on everything is noise.
- **Skip validation for search boxes and chat; inline edits validate on Enter, not blur.**

Behaviour:

- **Every input has a wired label, the right `type`, and font-size 16px or more on touch.** Under 16px iOS zooms the page.
- **Keep `autocomplete` on for identity, address, payment; turn it and `spellcheck` off for usernames, search, codes, slugs.** Codes: `inputmode="numeric"` and `autocomplete="one-time-code"`. Amounts: `inputmode="decimal"`. Handles: `autocapitalize="none"`, `autocorrect="off"`. Passwords: `current-password` on login, `new-password` on signup. Set `enterkeyhint`.
- **Prefix and suffix icons overlay the input with reserved padding.** A sibling icon is a dead click.
- **Autofocus the first input in a desktop modal only.** Gate on `matchMedia("(pointer: coarse)")`, not width.
- **Wrap inputs in a `<form>`.** Enter submits; textareas submit on Cmd/Ctrl+Enter.
- **Disable submit while in flight, change its label, fix its width, re-enable in `finally`.** Feedback inside 100ms, pending label by 400ms.
- **The button answers on itself.** "Create account", "Creating account", "Account created" crossfade as layers in one grid cell (opacity 0.25s ease, 0.08s delay). Never a second button or a banner.
- **A failed submit says so and keeps every value.** `fetch` does not throw on a 500, so check `ok`; never `reset()` before the response.
- **No dead zones.** Control, label and the gap between are one click target.
- **Prefill from the user and the link (`?email=`). Long forms warn on `beforeunload` or keep a draft in `sessionStorage`.**
- **Code inputs that auto-advance must move back and select on Backspace.**

## Toasts, destructive actions, optimistic updates

Sonner facts:

| Fact | Value |
|---|---|
| Defaults | `bottom-right`, 3 visible, 4000ms, 14px gap expanded, offset 32px (`mobileOffset` 16px under 600px) |
| `theme` | defaults to `'light'`, ignores the OS; pass `"system"` |
| Typed colours | grey until `richColors` is set |
| `expand`, `closeButton` | both off by default |
| `Alt+T` | focuses the toast region; keep it |
| Same `id` | updates that toast; `duration: Infinity` persists |
| Callbacks | `onDismiss` (close, swipe) and `onAutoClose` (timeout) are separate |
| Link in text | function title `toast(() => <a/>)`, not `toast.custom` |
| Buttons | `action: { label, onClick }`; `cancel` closes; `preventDefault()` keeps open |
| Outside React | `toast.getActiveToasts()`; inside, `useSonner()` |

- **Mount one `<Toaster />` at the root; call `toast()` only on the client.** Two Toasters or a StrictMode effect doubles toasts; a server call shows nothing.
- **Styling ladder: defaults, then `style`, then `classNames` (each needs `!important`), then headless `toast.custom` in your own helper.** More than a few `!important` classes means go headless.
- **Loading then success is one toast: `toast.promise`, or pass the loading `id`.** Otherwise the spinner stays under the success.
- **Behind a modal or clipped: mount at the document root. Unstyled in Astro: import `sonner/dist/styles.css`. Shadow DOM: copy the `[data-sonner-toaster]` style tag in.**

Destructive actions:

- **Confirmation title names action and object ("Delete 'Q3 report'?"), body names the loss with counts, buttons are verb plus object (`Delete report`, `Cancel`).** Never "Are you sure?", "Yes", "No", "OK" or `window.confirm()`.
- **Focus the safe button.** A reflexive Enter cancels.
- **Only destruction takes the danger fill, 15 degrees or more of OKLCH hue from the accent.** A red brand gives destruction an outlined, icon treatment.
- **The undo toast stays until dismissed, or 5s minimum, and pauses on hover and focus; `role="status"`, focus never jumps to it.** An undo that times out turns reversible into irreversible.
- **A menu "Delete" beside "Rename" needs undo, a confirm, or a separated danger group.** An unguarded destructive action is a top-severity finding.

Optimistic updates:

- **Keep the previous value, update at once, roll back in `catch` with a parallel message** ("Couldn't archive. Restored.").
- **Delete with Undo: remove now, toast for 5000ms, run the request behind it.**
- **A rollback is a designed change.** The row unfolds into its slot and carries its neighbours; the count returns in the same frame.
- **Server-made ids: use `temp_<uuid>` then swap.**
- **When the change shows on the thing itself, skip the toast.** An edited cell is its own confirmation.

## Copy and strings

- **Inventory existing strings first: one noun per object, one verb per action.** "Archive" in the menu is never "Move to storage" in the toast.
- **Build sentences whole in ICU; never concatenate, never `n === 1 ? "" : "s"`.** Word order and plural categories vary by language.
- **Format through `Intl` with the user's locale:** `NumberFormat` (currency, unit), `DateTimeFormat`, `RelativeTimeFormat`, `ListFormat`. A bare `toLocaleDateString()` is a finding.
- **Buttons start with a verb; links name their destination; toggles describe the ON state.** "Send read receipts", never "Don't send read receipts".
- **Active voice, second person, numerals for counts ("3 projects"), a non-breaking space before units, the single ellipsis character.**
- **Errors answer what went wrong, why, and what to do next. No jokes.** Write for the 10th encounter.
- **Feedback is specific.** "Sent to 47 recipients", not "Success!".
- **A placeholder is a format example (`name@example.com`), never the label.**

| State | Pattern |
|---|---|
| In progress | -ing verb + object: "Saving changes…" |
| Done | object + past tense, no "successfully": "Changes saved" |
| Failed | what did not happen, then the step: "Changes not saved. Check your connection and try again." |
| Unavailable | why, beside the control: "Add a payment method to publish" |
| Partial | both counts: "9 of 12 files uploaded. Retry 3 failed files" |

## Cards, icons, avatars

- **Never nest cards.** The inner one is a list row, a heading block, a badge, or a sunken tone with no shadow. One call-out card inside a parent is the limit.
- **One padding value on all four sides (12, 16 or 20px), spacing from `gap`, the ring drawn inset.** Inner radius is `max(4px, radius - padding)`. Media filling the top takes the card's top radius.
- **A screen that is all cards has no hierarchy.** Reading lists get rows, comparisons get a table.
- **One icon pack per product.** Lucide is the overused default; Phosphor, Tabler, Iconoir, Hugeicons or Heroicons differentiate. Check each set's licence.
- **Sizes: 16px inline, 20px toolbar, 20 to 24px nav, 32 to 48px empty state.** 6 to 8px between icon and label.
- **Stroke matches font weight at 24px: 1.5px for 400, 1.75 to 2px for 500.** Scale stroke with size; redraw heavier, never upscale.
- **Each icon is one opaque colour, round caps, on whole pixels.** Translucent ink darkens where strokes cross.
- **One icon, one meaning; toggling icons rotate or morph (chevron 180 degrees), never crossfade.**
- **Avatar order: photo, initials, generated.** `onError` drops down the chain; `flex-shrink: 0` and `object-fit: cover`.
- **Initials: first and last word, by `Intl.Segmenter`, suffixes (jr, sr, ii, iii, iv) removed, then the email's first character, then a person icon.** `name[0]` breaks on emoji, doubled spaces and CJK names.
- **Seed generated avatars (DiceBear 9.x) with the user id, self-host via `@dicebear/core`.** The public API rate-limits. `initials` for B2B, `bottts` for AI agents; use initials only in regulated contexts.
- **Facepile: 22px faces, 6px overlap, 2px gap cut by a mask, not a painted ring; fills picked from the id.** One colour per person everywhere, never the accent.

## Component API

- **Composition over configuration.** Children, not `header={{...}}` objects; compound parts share state through context. Fixed structure with 1 to 3 props stays a single component.
- **Customization order: variants, size, `className`, `asChild`.** Never raw style props.
- **Leave `className` off Button, Badge, Input.** A new look is a new variant; lint raw `<button>`, `<input>`, `<a>` outside `components/ui`.
- **Name like HTML: `disabled`, `open`, `onOpenChange`.** Positive booleans, enums over boolean soup, `icon` and `trailingIcon` slots.
- **Support controlled and uncontrolled** (`value !== undefined` decides); always call `onChange`.
- **Forward refs and spread remaining props.** Otherwise tooltips cannot position and `aria-*` is lost.
- **Default `type="button"`. Button sizes 24, 28, 32px, `flex: none`.**
- **Extract after 2 or 3 repeats.**

## Live and data surfaces

- **Presence has three states: arriving, here, half here (dashed outline), plus a leaving beat.** Announce joins and leaves in a live region; dashed versus solid needs a label.
- **The name rides the cursor, below and right of its tip; reactions store relative coordinates (10% x, 20% y).** Never animate your own presence.
- **Reorder from a handle; source and preview share one quiet, unraised treatment; an accent line marks the gap; neighbours hold still until drop; commit once.** Escape restores at once. Keyboard moves the same line and announces "Moved to position 3 of 7".
- **Streaming chat follows only while the reader is at the live edge.** Any scroll, selection, keypress, link or search stops it. A sent turn anchors near the top with a sliver of the previous one; off-screen content gets "Jump to latest"; saved threads reopen at the last meaningful turn.
- **Chat roles: viewport `role="region"`, `aria-label="Messages"`, `tabIndex={0}`; list `role="log"`, `aria-relevant="additions"`, `aria-busy` while streaming.** No `:last-child`, `:has()` or `:empty` in streamed layout; Copy stays disabled until the code fence closes.
- **Agent traces map the real tool state.** `input-streaming` and `input-available` are running, and an error once the stream stopped (a client-side tool awaiting output is waiting); `output-available` done; `output-error` error; `approval-requested` is a question outside the trace with Deny and Approve.
- **Reasoning is open while running, closed when done, and the user's toggle wins.** Plans update in place by stable id; sources dedupe by URL and come last; Copy shows a check for 2s.
- **Tables: numbers right-aligned with `tabular-nums`, text left, 1px dividers at `rgba(0,0,0,0.05)`, no zebra, sticky header, rows 28px compact or 44px comfortable.**
- **KPIs: 16 to 40px (median 26), never 48px; labels 12 to 16px above the value; no icon circles, no sparklines; 1 to 6 per row.** The one answer figure runs 30 to 36px and 1.3x its siblings.
- **Deltas: 10 to 15px, coloured good or bad, never up or down; zero or no comparison is grey.** Write "+4 (new)" from a zero base. A missing value is a grey dash.
- **Charts: 2 to 4 palette colours, labelled axes, animate on first render only.** Changed digits roll (700ms, 45ms stagger); a derived total moves 250ms after the commit.

## Never ship

| Never | Instead |
|---|---|
| Card hover lifting 4px or scaling 1.05 | `translateY(-1px)`, max `scale(1.02)`, 150ms |
| Centred spinner for a list or page | skeleton in the loaded shape by 400ms |
| Indicator flashing on a 100ms response | 150ms delay before any indicator |
| Skeleton over title and column heads | real chrome, only data loads |
| Error text that pushes the form down | 18px lane reserved from frame one |
| Errors on every keystroke | blur, then re-validate on change |
| Submit disabled until valid | click validates and focuses the first error |
| "Are you sure?" with Yes and No | "Delete 'Q3 report'?" with `Delete report`, `Cancel` |
| Undo toast that vanishes at 4000ms | 5s minimum, pause on hover and focus |
| "Success!" toast after a button press | label changes on the button itself |
| `"You have " + n + " messages"` | one ICU message with plural categories |
| Green "+100%" from a zero base | grey "+4 (new)" |
| Chat scrolling to bottom on every token | follow only at the live edge |

## Check

- Grep `useQuery`, `useFetch`, `useState`: each data view has loading, empty and error branches.
- Throttle the network, go offline, force a 500, log out mid-session. The form keeps every value and the idle label returns.
- Film each state change and step it at 40 to 80ms: no layout jump, no empty control, no two labels at full strength.
- Overlay the last skeleton frame on the first loaded frame: nothing moves a pixel.
- Screenshot each form clean and in error at 390px wide: only the ring and the lane's words differ.
- Render every string at 390px: nothing truncates or wraps, and no label changes a button's height.
- Measure card insets at 2x: four equal, inner radius never under 4px.
- Stream a reply three screens long while selecting text in its first block: the selection holds.
- Archive then Undo: the row returns to its slot and the count matches in the same frame.

## Where sources disagree

- **Press scale:** `0.96` consumer and `0.98` productivity, versus `0.97`. This file uses `0.97` over 160ms, and `0.96` only for an icon button.
- **Disabled:** `opacity: 0.5` on a button, versus dedicated tokens. This file uses tokens for every control.
- **Skeleton motion:** pulse only, versus a slow shimmer (1.6s sweep, or 4s per 1280px). This file allows either, one motion on one clock.
- **Card sections:** a 24px gap with no divider, versus 12px gaps with 1px edge-to-edge rules. This file uses `gap` and allows rules in flush cards.
- **Filled icons at small sizes:** switch at about 12px, versus 14px and under. This file uses 12px, the value the `khe-svg` skill sets for icons.
- **Button case:** Title Case for headings and buttons, versus sentence case everywhere. This file follows the product's existing strings, sentence case when new.
- **Pending button width:** fixed, versus easing so neighbours move with it. This file fixes full-width submits and eases inline buttons over 0.5s.
- **Timing as personality:** a deliberate 200ms on Delete, versus direct feedback never waits. This file never delays feedback.
- **Default variant:** `primary`, versus `secondary` with `primary` kept for the one main action. This file uses `secondary`.
- **Hover lift:** no lift beyond 1px, versus copying a real product's own hover. The 1px rule holds unless reproducing that product.

## Sources

- Emil Kowalski, public writing and open-source skills, including the Sonner guidance (github.com/emilkowalski/skills, MIT).
- Benji Taylor, Stageshow (github.com/benjitaylor/skills, MIT), and the essays at benji.org/honkish and benji.org/drawesome.
- Lochie Axon, skullet (github.com/lochie/skullet, MIT).
- Meta, Astryx design system docs (github.com/meta/astryx, MIT).
- shadcn/ui, Message Scroller and AI Elements docs (github.com/shadcn-ui/ui, MIT).
- Jakub Krehel, interfaces skills (github.com/jakubkrehel/skills, MIT).
- Leonxlnx, taste-skill, the 23-screen app study (MIT).
- guidelines.sh and the Vercel Web Interface Guidelines.
- DiceBear (dicebear.com, github.com/dicebear/dicebear).
- Unicode ICU MessageFormat and ECMA-402 `Intl`; Radix UI `Slot`.
- Edward Tufte, The Visual Display of Quantitative Information; Brad Frost on loading states.
