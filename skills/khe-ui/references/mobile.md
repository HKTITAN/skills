---
title: mobile
summary: Decides the viewport, keyboard, scroll, touch and browser-chrome settings that make a web app feel installed on a phone, and what must be proven on a real device.
---

# Mobile

Most "feels like a website on my phone" reports are platform defaults, not design problems: the URL bar, the software keyboard, the notch, the rubber band, the stuck hover. Each is fixed by one declaration that applies only where its reason applies. Open this lane before the first component of any app that will run on a phone, and for every "works in Chrome, wrong on my phone" bug. A project's `.design` file or DESIGN.md outranks every default here.

## Decide first

```text
1. Baseline present? viewport meta (4 parts), two theme-color tags, the html
   rule. Missing -> add it before anything else.
2. Match the report to the symptom table. Apply the one-line fix.
3. Reach for a media query or meta tag before JavaScript.
4. Gate by capability (hover, pointer), never by user agent or width alone.
5. Is it an app or a document?
   app      -> 100dvh shell, overscroll-behavior: none on the root
   document -> normal flow, 100svh hero, pull-to-refresh left on
6. Does it ship as a PWA? -> add manifest colours and the iOS status bar meta.
7. Verify: code checks first, then a real phone. Emulation proves width only.
```

## Baseline

Ship this before the first component, because every later fix assumes it.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
```

```css
html { -webkit-tap-highlight-color: transparent; -webkit-text-size-adjust: 100%; overscroll-behavior: none; }
```

In Next.js these are the root layout's `viewport` export: `viewportFit`, `interactiveWidget`, `themeColor: [{ media, color }]`.

**Never add `user-scalable=no` or `maximum-scale=1`.** They block zoom for low-vision users; the zoom they were added to stop comes from a sub-16px input.

## Symptom table

| Symptom | Cause | One-line fix |
|---|---|---|
| Hover style stuck after a tap | Touch fires `:hover` on tap and holds it until the next tap elsewhere | Wrap hover rules in `@media (hover: hover) and (pointer: fine)` |
| Grey or blue flash on tap | WebKit's default tap highlight | `-webkit-tap-highlight-color: transparent` on `html` |
| Bottom of the layout hidden on load | `100vh` is the viewport with the URL bar collapsed | `100dvh` for app shells, `min-height: 100svh` for heroes |
| Hero jumps while scrolling | `dvh` re-lays-out as the URL bar collapses | `svh` on first screens, `dvh` only on shells |
| Page zooms when an input is focused | iOS zooms any input under 16px | Input, textarea and select font-size 16px or more |
| Tap feels laggy | Double-tap-zoom wait, and feedback bound to release | `touch-action: manipulation`, feedback on pointer-down |
| Tap misses a small icon | Hit box equals the 16 to 24px visual | Pseudo-element `inset: -10px` on a 24px icon for 44px, `flex: none`; see [accessibility](accessibility.md) |
| Pull-to-refresh or page bounce inside an app | Root overscroll chains to the browser | `overscroll-behavior: none` on `html`; leave it unset on a document, where readers expect pull-to-refresh |
| Inner list scroll drags the page | Scroll chaining | `overscroll-behavior: contain` on the inner scroller |
| Content under the notch or stops short of it | No `viewport-fit=cover`, or no inset padding | `viewport-fit=cover` plus `env(safe-area-inset-*)` |
| Button rests on the home indicator | No bottom inset | `calc(12px + env(safe-area-inset-bottom, 0px))` |
| Keyboard covers the composer (Android) | Android Chrome overlays the keyboard on the page | `interactive-widget=resizes-content` in the viewport tag |
| Fixed CTA hides the last field | CTA floats over the scroller | Pad the scroller by CTA height plus bottom inset |
| Keyboard opens the moment a sheet appears | Autofocus on touch | Gate autofocus on `matchMedia("(pointer: coarse)")` being false |
| Page scrolls behind an open sheet | iOS ignores `overflow: hidden` on `body` for touch scroll | Lock through a dialog primitive (Base UI, Radix, vaul) |
| Long-press selects button text or opens a callout | Default text selection on controls | `user-select: none` and `-webkit-touch-callout: none` on controls, never on `body` (it breaks copying) |
| Whole page pans sideways | One element overflows (`100vw`, a table, a long word) | Fix that element: `overflow-wrap`, a scroll wrapper on tables and `pre`, no `100vw`. `overflow-x: hidden` on `body` hides it and breaks sticky |
| Carousel swipe scrolls the page vertically | Browser owns both axes | Native `scroll-snap`; if JS drag, `touch-action: pan-y` on the surface |
| List item selects when the user meant to scroll | Selection bound to press; a scroll's press ends in `pointercancel` | Select on release, only when the press started in the list |
| Video refuses to autoplay or opens fullscreen | iOS inline-playback rules | `muted` and `playsinline`; under reduced motion a poster and play button |
| Status bar colour does not match the page | No per-scheme `theme-color` | Two `theme-color` tags matched to the header colour |
| Text grows in landscape | iOS text inflation | `-webkit-text-size-adjust: 100%` |
| Anchor lands under the sticky header | No scroll offset | `scroll-margin-top` equal to the header height |
| First letter of a username capitalised or auto-corrected | iOS defaults | `autocapitalize="none"` and `autocorrect="off"` |
| Right in Chrome, wrong on the phone | Emulation is not touch, chrome or keyboard | Test on real hardware over the LAN |

## Viewport height and safe areas

| Unit | Meaning | Use for |
|---|---|---|
| `100vh` | Viewport with chrome collapsed; overflows by the URL bar on load | Never |
| `100dvh` | Tracks the chrome live | App shells, bottom-pinned UI |
| `100svh` | Viewport with chrome showing; stable | Heroes and first screens, as `min-height` |
| `100lvh` | The old `vh` renamed | Never |

**Shells track the chrome, first screens do not.** `dvh` on a hero reproduces the jump it was meant to remove.
**Replace Tailwind `h-screen` with `h-dvh` or `min-h-svh`.** `h-screen` is `100vh` and carries the bug.
**Every `env()` inside `calc()` takes a fallback: `env(safe-area-inset-bottom, 0px)`.** Without `viewport-fit=cover` every inset is `0px`, and without a fallback an unsupported `env()` voids the whole declaration.
**Pad all four directions.** Headers take the top inset, tab bars and sheets the bottom, sidebars left and right in landscape.
**Nothing sits under the notch or island, and a sheet or its grabber starts below the status bar.**
**Cap sticky headers.** 80px is a quarter of a landscape phone.

```css
.shell { height: 100dvh; display: grid; grid-template-rows: auto 1fr auto; }
.header { padding-top: env(safe-area-inset-top, 0px); }
.form { overflow-y: auto; overscroll-behavior: contain; }
.pay { margin: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px)); }
```

## Keyboard and inputs

**iOS shrinks the visual viewport; Android Chrome overlays the keyboard.** `interactive-widget=resizes-content` makes Android resize too, so a composer at the bottom of a `100dvh` column rides above the keyboard with no script.
**Inputs, textareas and selects are 16px or larger on touch.** Under 16px iOS Safari zooms the page on focus; this is the only correct fix.
**Never autofocus on a coarse pointer.** It throws the keyboard over the screen; gate on `matchMedia("(pointer: coarse)")`, never on width.
**Ask for the exact keyboard.** The correct `type` and hints give the right keys, native validation and autofill for free.

| Field | Attributes |
|---|---|
| Email, phone, URL, search, password | `type="email"`, `tel`, `url`, `search`, `password` |
| Numeric code | `inputmode="numeric"` |
| Money amount | `inputmode="decimal"` |
| Verification code | `autocomplete="one-time-code"` |
| Return key label | `enterkeyhint="search"`, `"send"` or `"done"` |
| Username, handle, code, slug | `autocapitalize="none"`, `autocorrect="off"`, `spellcheck` off, `autocomplete` off |
| Login password / signup or change | `autocomplete="current-password"` / `"new-password"` |
| Identity, address, payment | `autocomplete` on |

**Do not auto-advance verification-code inputs unless Backspace moves back and selects.** Correcting one digit otherwise traps the user.
**Wrap inputs in a real `<form>`** so the keyboard's return key submits.

Label wiring, validation and submit states are in [components](components.md).

## Taps, hover and gestures

**Gate every hover style behind `@media (hover: hover) and (pointer: fine)`.** Touch has no hover; an ungated rule sticks after the tap. Nothing core is reachable by hover alone.
**Give any hover-triggered animation an imperative path.** An animated icon plays on `:hover` by default and also exposes `trigger()` (optionally `reset()`), with CSS answering both the gated `:hover` and `[data-animated="true"]`, so a tap or a discrete event fires the same animation. One tap on a phone must leave no hover state on.
**Press feedback fires on pointer-down.** `scale(0.97)` on `:active` through a 160ms transition (0.96 for an icon button); feedback on release reads as lag.
**`touch-action: manipulation` on buttons, links and inputs.** It removes the double-tap-zoom delay.
**`touch-action: none` only on surfaces that implement their own pan or drag.** Native gestures then stop fighting the code. The value names what the browser keeps: `pan-y` leaves vertical panning to the browser and horizontal to the code.
**Build carousels on native scroll first.** `scroll-snap-type: x mandatory` on the track and `scroll-snap-align: start` on each slide keep platform momentum and need no `touch-action`.
**Never `touchmove` plus `preventDefault()` to stop scrolling.** It blocks scroll and forces a non-passive listener.

## Type at phone width

**Raise body text to 16px on phones without inflating headings.** Lifting a 14px base to 16px at the same ratio turns a 79px display line into roughly 90px on a 390px screen. Pin one heading role to its desktop size and re-derive the ratio through both points.

```text
M      = max(B, 16)              mobile base (B = desktop base)
r_pin  = r * (B / M)^(1/a)       a = step of the pinned role
desktop(k) = round(B * r^k)
mobile(k)  = round(M * r_pin^k)  nearest px, halves round up
```

| Desktop ratio `r` | Pinned role | Step `a` |
|---|---|---|
| 1.25 or less | Display 1 | +6 |
| Between 1.25 and 1.414 | Heading 2 | +2 |
| 1.414 or more | Heading 3 | +1 |

Worked: `B = 14`, `r = 1.333` pins Heading 2, giving `M = 16`, `r_pin = 1.247`. Body goes 14 to 16, Heading 2 stays 25, Display 1 drops 79 to 60. Roles above the pin shrink, roles below grow.

**Activate on `(width < 1024px) and (pointer: coarse)`, both conditions.** Width alone shrinks headlines in a narrow desktop window and leaves a landscape iPad with 14px inputs.
**When `B` is 16 or more, change nothing.**
**A user-set text size replaces the base, and the pin no longer applies.**
**Never change the root font size to do this.** `rem` stays a fixed 16px reference for spacing. The scale itself is in [typography](typography.md).

## Status bar and installed mode

**One `theme-color` per colour scheme, matched to the top of the page (the header), not the brand colour.** The browser chrome then continues the page instead of ending at a white bar.
**Update the tag when a class-based theme toggle flips.** The media-scoped tags follow the OS only.
**Add `<meta name="color-scheme" content="light dark">` beside the two tags only when both schemes ship.** A light-only app declares `color-scheme: light`, or dark-OS users get dark native controls on a white page.
**An installed PWA sets three things together:** the manifest's `theme_color`, its `background_color`, and on iOS `apple-mobile-web-app-status-bar-style`.
**Standalone mode changes the viewport, the insets and the status bar.** Test installed if installation ships.

## Never ship

| Never | Instead |
|---|---|
| `height: 100vh` or Tailwind `h-screen` | `100dvh` shell, `min-height: 100svh` hero |
| `user-scalable=no` or `maximum-scale=1` | 16px inputs |
| Ungated `.card:hover { ... }` | `@media (hover: hover) and (pointer: fine)` |
| Hover as the only trigger for an animation or action | Gated hover plus `trigger()` on tap |
| `position: fixed; bottom: 0` with no inset | `calc(12px + env(safe-area-inset-bottom, 0px))` |
| `env(safe-area-inset-bottom)` bare inside `calc()` | `env(safe-area-inset-bottom, 0px)` |
| `overflow: hidden` on `body` as scroll lock | Dialog primitive (Base UI, Radix, vaul) |
| `touchmove` with `preventDefault()` | `overscroll-behavior`, `touch-action` |
| `autoFocus` in a sheet on touch | Gate on `(pointer: coarse)` |
| `theme-color` set to the brand colour | The header's background, one tag per scheme |
| Signing off from desktop device emulation | A real phone over the LAN |

## Check

Verifiable from code, by reading or grep:

| Check | Pass |
|---|---|
| Viewport meta | Has `width=device-width`, `initial-scale=1`, `viewport-fit=cover`, `interactive-widget=resizes-content`; no `user-scalable`, no `maximum-scale` |
| `100vh`, `h-screen`, `100vw`, `lvh` | Zero matches |
| `:hover` rules | Every one inside a `(hover: hover) and (pointer: fine)` gate |
| Input, textarea, select font-size | 16px or more under `(pointer: coarse)` |
| `env(safe-area-inset-` | Each has a `0px` fallback; top, bottom and both sides covered |
| `theme-color` | Two tags with `media`, values equal to the header colours |
| `overscroll-behavior` | `none` on root (apps), `contain` on inner scrollers |
| `touch-action` | `manipulation` on controls; `none` or `pan-y` only on gesture surfaces |
| Input attributes | `type`, `inputmode`, `enterkeyhint`, `autocomplete`, `autocapitalize` per the table |
| `autoFocus` | Gated on pointer |
| Mobile type scale | Computed sizes match the formula; root font size untouched |

Needs a real device, because emulation reproduces none of it:

| Check | How |
|---|---|
| URL bar collapse and expand | Load, scroll, watch the shell and the hero |
| Software keyboard | Focus the last field with the keyboard up: the CTA stays visible above it, no zoom |
| Safe areas | Portrait and once in landscape: nothing under the notch, island or home indicator |
| Rubber band, pull-to-refresh, scroll lock behind a sheet | Drag past both ends, open a sheet and drag the backdrop |
| Tap feel, stuck hover, tap highlight | Tap every control at its outer edge; one tap leaves no hover on |
| Status bar colour | Both colour schemes, and after an in-app theme toggle |
| PWA | Install it and repeat every row above |

Setup: serve the dev server on `0.0.0.0`, open it by LAN IP, debug with Safari, Develop, device on iOS and `chrome://inspect` on Android. Use a phone a few years old. The Xcode Simulator is better than desktop emulation for viewport and insets and still cannot show how touch feels. A narrow desktop window changes width, not touch. When a device is unavailable, say which rows were not verified; never report them as passing.

## Where sources disagree

- **Hover gate.** Two notes use `@media (hover: hover)` alone; one uses `@media (hover: hover) and (pointer: fine)`. This file uses the two-condition form, which also excludes hybrid devices whose primary pointer is a finger.
- **Dark `theme-color` example.** `#0a0a0a` in one note, `#18181b` in another. Both are placeholders; this file prints `#0a0a0a` and the rule is to match the header's actual colour.
- **Root overscroll selector.** `html` in one note, `html, body` in another. This file uses `html`; add `body` when the body is the scroller.
- **Reduced-motion fade.** A flat 120ms fade versus a touch-only cross-fade of 200ms or less. This file defers to [accessibility](accessibility.md), which fades on coarse pointers only.

## Sources

- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT): the mobile-native skill for viewport units, safe areas, keyboard, overscroll, scroll lock, status bar, input hints, native scroll snap and real-device testing.
- Meta, Astryx (github.com/meta/astryx, MIT): the mobile type pin formula and its activation rule.
- Benji Taylor, Stageshow (github.com/benjitaylor/skills, MIT): nothing under the island, sheets below the status bar, width is not touch, button press and hover values.
- lucide-animated.com (pqoqubbw/icons): hover by default with an imperative trigger for touch.
- guidelines.sh: hover gating and restrained hover states.
- Apple, Human Interface Guidelines: 44pt touch targets.
