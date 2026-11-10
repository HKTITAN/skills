---
title: motion
summary: Whether something animates at all, then its tool, curve, duration, property, entrance, exit, gesture physics, group order and reduced path.
---

# Motion

This lane decides whether an element moves, and if it does, every value of the move: tool, easing, duration, property, origin, exit, gesture physics, order within a group and the reduced-motion replacement. Open it before writing any `transition`, `@keyframes`, spring or gesture handler, and when a screen "feels slow", "janky" or "off". A project's `.design` file or DESIGN.md outranks every default here.

## Decide first

Walk this in order for every moving element. Stop at the first "no motion".

```text
1. Triggered from the keyboard, or met 100+ times a day?   -> no motion. Stop.
2. Is it data being read (chart, table, number)?           -> move only on a real change in value.
3. Name ONE purpose: feedback | spatial consistency | state indication |
   bridging a jarring change | explanation (marketing, onboarding only) |
   delight (rare or first-time only).
   Decoration, filling time, "the library is installed"    -> no motion. Stop.
4. Met tens of times a day?                                -> colour or opacity only, <= 150ms.
5. Does a finger drive it, or can it reverse mid-flight with velocity?
   yes -> spring (see Gestures).   no -> curve.
6. Tool: CSS transition -> @starting-style -> CSS animation -> WAAPI -> Motion.
   Whole component (toast, drawer, menu) -> a library (Sonner, Vaul, Radix).
7. Curve by job, then duration by element. Product UI stays under 300ms.
8. Property: transform and opacity. Never a layout property.
9. Entrance from scale >= 0.95 at the trigger's origin; exit with fewer
   properties in 60 to 80% of the time.
10. Write the reduced-motion path in the same change.
11. Verify at 25% speed and on a real mid-range phone.
```

## Gate and tool

| Frequency | Verdict |
|---|---|
| 100+ a day (shortcuts, command palette, tab switches) | No animation |
| Tens a day (hover, list navigation) | Near-imperceptible or nothing: `background-color 120ms ease`, nothing moves |
| Occasional (modal, drawer, toast) | Standard animation |
| Rare or first-time (onboarding, success) | The only tier with a delight budget |

- **Never animate a keyboard-triggered action.** At a 120ms key repeat a 300ms highlight trails several rows behind.
- **Cut any animation the UI does not feel broken without.** Hide each moving element in turn; if the screen reads clearer, delete it.
- **First paint is not an entrance.** Anything at rest when the page paints plays nothing (`initial={false}` on `AnimatePresence`), except a deliberate first-run hero.
- **Use transitions, never keyframes, on anything the user can interrupt.** A transition retargets from the current value; a keyframe restarts from frame 0.
- **Persistent elements travel, they never crossfade.** A tab underline slides, a reordered row moves by FLIP (`transform 250ms`, ends measured once at take-off and frozen, landing on the element itself, never its padded slot). A modal under a stacked modal recedes to `scale(0.96)` with `blur(4px)`.
- **Direction carries meaning.** Forward moves content left, Back moves it right; a surface leaves by the edge it entered.

When removing an animation, remove with it: the hidden start state (`opacity: 0`, `initial`, reveal class and observer), every `transitionend`, `onAnimationEnd` or duration-sized `setTimeout`, `onExitComplete` work (move it to the close), focus set in a callback, then orphaned keyframes and imports. Keep a layout animation that hides a jump. Reduce before deleting:

| Today | Reduce to |
|---|---|
| Hover with scale, lift or shadow growth | Colour or opacity only, <= 150ms, `ease` |
| Slide or scale entrance on a frequent surface | Opacity only, 150ms, ease-out |
| UI animation over 300ms | 200 to 250ms, same curve |
| Stagger over 80ms per item or 300ms total | 30ms per item, or fade the group as one |
| Infinite pulse, shimmer or glow | Play once, keep the static end state |

## Easing, duration and springs

Pick the curve by job: entering or exiting, ease-out; moving on screen, ease-in-out; hover and colour, `ease`; constant motion (progress, marquee, hold-to-confirm fill), `linear`; unsure, ease-out. **Never `ease-in` on product UI, exits included**: its slow start delays the frame the user is watching. Check every token: `y1 / x1` under 1 leaves rest slower than linear and never sits on a press or entrance.

```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);        /* hover, menus: the default */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);         /* taps, presses */
--ease-out-strong: cubic-bezier(0.23, 1, 0.32, 1);      /* dropdown, popover, toast, modal */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);          /* two-way travel */
--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);  /* A to B across screen, clip reveals */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);          /* edge sheet, 500ms */
--ease-drawer-float: cubic-bezier(0.165, 0.84, 0.44, 1);/* small floating drawer, 200ms */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);       /* overshoot: playful only, never a dialog */
```

Name each token by its job with its duration range beside it; tune curve and duration together.

| Element | Duration |
|---|---|
| Button press | 160ms |
| Hover state | 120 to 200ms (inputs faster, cards slower) |
| Tooltip | 125 to 200ms after a 400 to 700ms first delay; 0ms for siblings |
| Popover, dropdown | 150 to 250ms |
| Modal | 200 to 300ms |
| Tab content swap | 200 to 250ms |
| Toggle knob, segmented thumb, tab indicator | 250, 300, 350ms on `cubic-bezier(0.22, 1, 0.36, 1)` |
| Page transition | 250 to 400ms, the longest product duration |
| Skeleton to content | 150ms |
| Onboarding hero | 400 to 800ms |
| Confetti, celebration | 600 to 1200ms |

Smaller and more frequent means shorter. **When unsure, halve it.** Feedback starts on the input frame.

Springs are for motion a user drives; triggered motion (modal, toast, route) takes a curve.

| Spring | Values |
|---|---|
| Default settle (Motion) | `{ type: "spring", duration: 0.35, bounce: 0 }`, perceived 0.3 to 0.4s |
| Bounce | 0.1 to 0.3, never more, and only after a gesture with momentum |
| Drawer or sheet after a drag | `{ stiffness: 380, damping: 30, mass: 1 }` plus release velocity |
| Apple pairs (damping ratio / response) | move 1.0 / 0.4, rotation 0.8 / 0.4, sheet 0.8 / 0.3 |

- **Always set `duration` and `bounce`, or `stiffness` and `damping`.** Library defaults are slow and floaty; a release that feels wrong needs more `damping` first.
- **A retargeted spring keeps position and velocity.** Never reset velocity to 0; never start from the logical target, read the on-screen value.
- **Hand-written physics runs on time, never on frames.** Step in fixed 4ms steps or sample a closed form (`x0 * e^(-kt)`), cap catch-up at 300 steps (1.2s) then carry or snap, apply events at their timestamps, end when distance and velocity are both under 0.01. A per-frame lerp becomes `k = 1 - Math.pow(1 - 0.08, dt / (1000 / 60))` with `dt` capped at 100ms.

## Properties and performance

Budget: 16.7ms a frame at 60fps, 8ms at 120Hz. Design against 8.

| Tier | Properties | Swap |
|---|---|---|
| Composite | `transform`, `opacity`; also `filter`, `clip-path` | Use these |
| Paint | `box-shadow`, `border-radius`, `color` | `box-shadow` to `filter: drop-shadow()` or the opacity of a pre-shadowed layer |
| Layout | `width`, `height`, `padding`, `margin`, `top`, `left` | size to `scale()`, position to `translate()`, panel height to `grid-template-rows: 0fr` to `1fr` or a clip |

- **Name the transition properties.** `transition: all` and Tailwind's bare `transition` class animate every change; write `transition-transform` or `transition-[opacity,scale]`.
- **`translateY(100%)` for unknown sizes.** It is the element's own height.
- **`scale()` scales children.** Scale a `::before` that holds background and shadow and let text only fade; text that ends a scale snaps to the pixel grid and wobbles.
- **All translates before all rotates; a second `transform` rule replaces the first.** Full rotations are `1turn`; one time unit per codebase (`ms` here).
- **`will-change` only after a reproducible first-frame hitch**, on the animating element, never on every card and never `all`.
- **Never animate a CSS variable on a shared parent.** Every descendant recalculates; a drawer driven by `--swipe-amount` lagged at about 20 items.
- **Frames never pass through React state.** Write through refs or WAAPI, in one rAF loop that sleeps once settled.
- **Motion:** the `transform` string is accelerated in every version, the `x`, `y`, `scale` shorthands only from 14.2; `layout`, `onUpdate` and drag values stay on the main thread, so motion during navigation or hydration goes to CSS or WAAPI.
- **`clip-path: inset()` for reveals.** Both ends use the same shape function; round with `inset(0 round 9999px)`, never with `border-radius`. Moving text crosses a feathered `mask-image` (0.5em), never a hard clip.
- **Animated `blur()` stays under 20px**, and off surfaces over about 400px square.
- **Virtualize lists past 50 rows, pause off-screen loops, and mute transitions during a theme swap** (class on, swap, class off after a double `requestAnimationFrame`).

Diagnose jank in this order before changing code: (1) a layout or paint property animates, (2) it coincides with navigation, fetch or hydration, (3) React re-renders per frame, (4) it worsens as content grows, (5) a CSS variable animates, (6) `blur()` over 20px, (7) only then `will-change`.

## Entrances, exits and feedback

- **Never enter from `scale(0)`.** Start at `scale(0.95)` plus `opacity: 0` (popover surface 0.96, tooltip 0.97); 0.85 or 0.5 only on a rare moment with a spring. Cards, toasts and pills skip scale and arrive whole from 10px.
- **Set `transform-origin` to the trigger** (`var(--popover-origin, top right)`). Modals stay centred.
- **`@starting-style` for mount entrances** (Chrome 117+, Safari 17.5+), `transition-behavior: allow-discrete` for the exit; fall back to a `data-mounted` attribute set one frame after mount.
- **Exit in 60 to 80% of the enter, on a transition.** Panel: 250ms in, 180ms out. Dialog the user dismissed: 300ms in, 150ms out.
- **Compose on enter, subtract on exit.** Enter with up to 5 properties, exit with 3 (opacity, `blur(2px)`, scale to 0.96): no reversed bob, rotate or stroke draw. Subtract properties, never parts: surface and content leave as one object. Never skip the exit.
- **Cross-blur an imperfect crossfade.** Pair opacity with `filter: blur(2px)` (4px under 640px wide) on one timing. For an in-place word swap of 450ms the old copy leaves in 225ms and the new one waits out the first 30%. Never on text that travels, on hover, or on surfaces over 400px square.

Press and hover:

- **Every button responds on pointer-down.** `scale(0.97)` over 160ms on `--ease-out-expo`; 0.96 for an icon button, chip or toggle, because a small target needs a larger share of its size to show the press. Never deeper than 0.96: 0.95 is where an entrance starts, and on a press it reads as a collapse. Touch adds a 4% darker overlay. Inputs change border and background, never scale. Give Button a `still` opt-out for dense or 100+ a day controls.
- **A row under the pointer highlights at 0ms and leaves over 150ms `ease`.** Gate `:hover` behind `@media (hover: hover) and (pointer: fine)`; hover never changes font weight.
- **Hover-revealed surfaces follow one contract.** First open waits 400 to 700ms; while one is open its siblings open at 0ms with no entrance (`[data-instant] { transition-duration: 0ms }`, Radix `skipDelayDuration={300}`); closing waits about 150ms; keyboard focus reveals at once; touch is never delayed. Expose `delay` and `hideDelay` in ms.
- **Animated icons play on hover by default and expose `trigger()`** for touch and programmatic use.
- **Grouped hover falls off by distance.** `shift = lift * pow(falloff, distance)` with lift -8px, max scale 1.08, falloff 0.45 (keep 0.4 to 0.5): neighbours land at -3.6, -1.6, -0.7px. Lift 200ms on ease-out-quart, return 350ms on `--ease-spring`. Never in groups over 20.
- **Error shake: 280ms, five stops, on the wrapper.** `translateX` 0, -4px, 4px, -2px, 0 at 0%, 28.57%, 57.14%, 78.57%, 100% on `cubic-bezier(0.36, 0.07, 0.19, 0.97)`. Fire on submit or blur only; the message fades in over 200ms after 100ms.
- **Hold-to-confirm is asymmetric.** `clip-path` fill over 2s `linear` on press, 200ms ease-out back on release.

## Gestures

A gesture has two phases. **Track:** the element is the pointer, 1:1, no easing or spring. **Release:** a spring seeded with the release velocity finishes the move. For a drawer or bottom sheet use Vaul before writing one.

| Rule | Value |
|---|---|
| Tap slop; drag axis lock | about 10px each |
| Velocity sample | last 20 samples over the last 100ms, from `event.timeStamp`, in px/ms |
| Let go vs throw | 0.11 px/ms (110 px/s) |
| Sheet dismiss | offset past 40 to 50% of travel, or velocity over 500 px/s (Motion `info.velocity` is px/s) |
| Rubber band | `(x * d * 0.55) / (d + 0.55 * abs(x))`; Motion `dragElastic` about 0.2 |
| Projection | `current + (v / 1000) * d / (1 - d)`, `d = 0.998` (0.99 stops sooner) |
| Overshoot after a flick | damping ratio about 0.8; a slow release or programmatic move gets none |
| Sheet curves | `--ease-drawer` 500ms at the edge; `--ease-drawer-float` 0.2s for a small floating drawer and its overlay |

- **Capture the pointer and ignore secondary ones.** `setPointerCapture(e.pointerId)`; return when `e.isPrimary === false`.
- **Write `transform` on the dragged element, with `transition: none` while carried.** `touch-action: pan-x` for a vertical drag, `pan-y` for a horizontal one, `none` only when both axes are owned; `user-select: none` on the draggable.
- **Project, then pick, then hand over the velocity.** 1000 px/s projects about 500px, 200 px/s about 100px. Snap to the target nearest the projection and start the spring at release velocity; both halves or neither. Commit or reverse by the sign of the velocity, never by which half the element sits in.
- **One spring per axis in 2D; keep the grab offset.** A single spring on combined distance bends a diagonal throw.
- **With no spring, match the first slope.** `y1 = min(0.95, (0.25 * v * 300) / remaining)` in `cubic-bezier(0.25, y1, 0.35, 1)` over 300ms.
- **Keep it catchable and never lock input.** A closing sheet grabbed again follows the finger from where it is drawn.
- **Derive overlay opacity and page scale from the drag value** (`useTransform(y, [0, height], [1, 0])`), never a second animation.
- **Dismiss along the entry axis.** A toast that rises from the bottom swipes down.
- **Hit-test presses against destinations, drags against the drawn position.** Three presses 80ms apart on one spot dismiss three toasts. The released item stays above its neighbours until it settles; a touch-scrolled list selects on release.
- **Trays:** user-initiated, one purpose, title plus dismiss, over dimmed context; successive trays differ in height (320, 480, 240px) and are sized before their first frame.

## Groups and in-place change

Cast every element on the event before timing it: **lead** (starts first, travels furthest), **support** (shorter, smaller, after the lead), **decoration** (fades in place or nothing), **still** (does not animate; most elements). Then relate each pair: together, overlap (stagger), sequence (only when overlap looks broken), or carry (move the parent).

- **One entrance per container.** A panel that slides in never also staggers its children.
- **Stagger 30 to 80ms per item, whole cascade under 300ms.** Cap at 6 items in product UI (12 for a first-run list); later items share the last delay. Only on first appearance of 3+ items; sort and filter crossfade in place.
- **Never a uniform stagger.** Vary distance by role and shrink gaps down the group. In CSS use `animation-delay: calc(var(--step) * var(--i))` with `animation-fill-mode: both`.
- **Section entrances split into heading, copy and action** at 90 to 100ms apart (about 80ms per hero word), each with opacity, `translateY(8px)` and `blur(2px)`; a once-per-visit hero may use 100 to 150ms steps on 0.5 to 0.6s entrances.
- **Exits are simultaneous, shorter and never reverse-staggered**, and no control waits for a sequence. A leaving element gives up its space at once (`mode="popLayout"`).
- **Scale resize duration to distance:** `abs(deltaHeight) / 500` seconds, clamped to 0.15 to 0.27s. A step view slides about 110% of its width; in a small box use a quick fade with an 8px nudge.
- **Pin secondary motion to the lead's start, impact or settle**; accents land in the last fifth. An idle hint plays after 2.5s, then every 6s.
- **Dense view swap in a resizing container:** the old view is gone in 90ms, the new one starts just before.

In-place change:

- **Labels that share letters keep them still.** Diff by shared head and tail ("Continue" to "Confirm" holds "Con"); the slot eases to its new width over 0.4s. Labels of 1 to 3 words only.
- **Longer strings: align words first, characters only inside words sharing at least 40%.** Split with `Intl.Segmenter`, never `split('')`. Default 400ms on `cubic-bezier(0.19, 1, 0.22, 1)`; leaving fades in the first 25%, arriving fades over 50% starting at 25%, both from scale 0.95. A run of 6+ replaced characters shrinks to 0.8 as one shape.
- **Numbers roll by place value, keyed from the right.** Digits arrive from above, separators from below; outgoing fade 45%, incoming 25%. Screen readers get the plain value; fragments are `aria-hidden`.
- **Icons with shared geometry rotate.** Plus to close is one path turned 45 degrees over `0.45s cubic-bezier(0.22, 1, 0.36, 1)`; a morphing set of up to 20 stroke icons shares one line count (3), spare lines collapsed to a centre point.
- **Stock icon pairs swap deep:** scale 0.3 to 1, opacity 0 to 1, `blur(3px)` to 0, `{ type: "spring", duration: 0.35, bounce: 0 }`. A 0.8 to 0.9 scale reads as a glitch.
- **Live values lerp together.** Everything derived from one number approaches at the same rate (0.08 per 60Hz frame, about 200ms) in one loop; snap a range outward instantly when data exceeds it.

## Reduced motion

Under `prefers-reduced-motion: reduce` nothing travels, scales, resizes or springs. The reduced state is the finished state, never frame 0.

```css
@media (prefers-reduced-motion: reduce) {
  .modal { transform: none; transition: opacity 120ms; }
}
@media (prefers-reduced-motion: reduce) and (pointer: fine) {
  .modal { transition: none; }
}
```

| Context | Replacement |
|---|---|
| Coarse pointer, or started by a touch release | Opacity-only cross-fade, <= 200ms |
| Mouse, trackpad, keyboard | Immediate |
| In-place value, hover or selection colour | At once on every pointer |
| Drag tracking and thrown momentum | Unchanged: the user makes that motion |
| Parallax, autoplay, perpetual spinner | Off: static layout, a start control, a text label or progress bar |
| Stagger group | Appears together, opacity only |

- **Never `* { animation-duration: 0ms !important }`.** It strands entrances at `opacity: 0`.
- **Read the preference live**, with a `change` listener; nothing may loosen it.
- **Some motion harms with the setting off:** whole-viewport backgrounds, loops near 0.2 Hz (one cycle per 5s), hard brightness jumps. See [accessibility](accessibility.md).

## React Native and Expo

Stop at the first tool that fits: Reanimated CSS transition (press, toggle), Reanimated CSS animation (loop, mount), layout animations (`entering`, `exiting`, `itemLayoutAnimation`), shared value plus `Gesture` (a finger or scroll drives it), native stack, `formSheet`, `NativeTabs`, `headerLargeTitleEnabled`, `react-native-keyboard-controller`, Lottie (never UI state), Skia.

- **Reanimated and `Gesture.Pan()`, never core `Animated` or `PanResponder`.** Never `setState` in a gesture or scroll handler; `scheduleOnRN` only in `onEnd`.
- **Springs for anything a finger touched**, with `reduceMotion: ReduceMotion.System`: settle `{ duration: 400, dampingRatio: 1 }`, snap back `{ duration: 400, dampingRatio: 0.8, velocity }`, sheet `{ duration: 300, dampingRatio: 0.8, velocity }`, hard edge adds `overshootClamping: true`.
- **Press:** `scale: 0.97` over 160ms on press-in (0.96 for an icon button), the same values as the web, commit on press-out, `pressRetentionOffset` set, targets 44pt (48dp Android) via `hitSlop`. Pan axis `activeOffsetX: [-10, 10]`. Clamp every `interpolate`.
- **Navigation is configured, never built.** Push `animation: 'default'` (about 350ms on iOS); abandonable task `presentation: 'modal'`; brief interruption `formSheet` with `sheetAllowedDetents` (3 detents on Android, grabber iOS-only); tabs `animation: 'none'`; reduced `animation: 'fade'`. Any custom `animation` also sets `animationMatchesGesture: true`.
- **Translate first in the transform array.** Collapse a header by translating inside a fixed clipped container, never `height`. Never animate `elevation`; never `entering` on virtualized rows.
- **Toast:** `FadeInDown` 300ms, `FadeOutDown` 250ms, at `insets.bottom + 16`.
- **Haptics on the causal frame, once per action:** `selectionAsync`, `impactAsync(Light)`, `notificationAsync`.
- **Silent setup failures:** `npx expo install`, one `GestureHandlerRootView` and `KeyboardProvider` at the root, `CADisableMinimumFrameDurationOnPhone` for 120fps.

Touch targets and safe areas live in [mobile](mobile.md).

## Never ship

| Never | Instead |
|---|---|
| `transition: all 300ms ease-in` | Named properties, ease-out token, 150 to 250ms |
| Entrance from `scale(0)` | `scale(0.95)` plus opacity, origin at the trigger |
| Motion on Cmd+K, arrow keys, tab switches | Open on the frame the key lands |
| Exit that mirrors the entrance at equal length | 3 properties, 60 to 80% of the enter |
| Animating `height`, `margin`, `top`, `box-shadow` | `transform`, `opacity`, `grid-template-rows`, `drop-shadow()` |
| `@keyframes` on a toast, sheet or anything interruptible | A transition or a spring that retargets |
| Spring or transition while the pointer is down | 1:1 `transform` write, `transition: none` |
| Distance-only dismiss threshold | Offset past 40 to 50% or velocity over 500 px/s |
| Stagger of 150ms per item, or on every filter | 30 to 80ms, 6 items, under 300ms, first appearance only |
| `x += (target - x) * 0.08` per frame | Scale by elapsed time, `dt` capped at 100ms |
| Entrance that only runs under `no-preference` | Finished state under reduce; <= 200ms fade on touch |

## Check

- **25% speed** (DevTools Animations panel). No frame flashes the end state; no jitter from a wrong origin.
- **Frame stepping at 40 to 80ms.** The press differs on the first frame after `pointerdown`; a popover's first frame is a 96% surface at the trigger corner; no frame shows two words legible at once or a sliced glyph.
- **Release frame.** Displacement per frame neither drops nor jumps across the release; a re-grab mid-settle follows the finger from where it is drawn.
- **Performance recording on a mid-range phone over remote debugging**, never desktop throttling: no frame over 16ms, no layout or paint during the move, no rAF callbacks once settled.
- **60Hz and 120Hz.** Same input lands in the same place; two identical poses then a jump is a clock bug.
- **Gestures on hardware at 120fps**, reached over the dev server's LAN address. React Native on a release build on the slowest supported device.
- **Reduced motion on.** No element at rest is invisible; toggling the setting mid-playback strands nothing at `opacity: 0`.
- **Stress.** Five toasts 50ms apart with the third dismissed mid-enter; live data with reversals at 50 to 60ms and bursts at 40 to 80ms after 1 to 3s of silence.

## Where sources disagree

| Topic | Values | This file uses |
|---|---|---|
| Exit length | 60 to 80% of enter; 50% for a dismissed dialog (300/150); 0.15s against 0.32 to 0.37s for a label swap | 60 to 80%, 50% when the user dismissed |
| Press | 100 to 160ms with a 0.95 floor; 150ms; 180ms on `cubic-bezier(0.2, 0.8, 0.2, 1)` | `scale(0.97)` over 160ms, 0.96 for an icon button |
| Ease-in on exits | Never; popover out on `cubic-bezier(0.4, 0, 1, 1)`; mirrored curves on a long reversible move | Never in product UI |
| Tooltip start scale | 0.97; 0.94 | 0.97 |
| Blur on text | Never; 2px on short labels that change in place | 2px in place, none on travelling text |
| Toast | Under 300ms; Sonner about 400ms `ease` both ways; 0.6s demo rise | Sonner's 400ms as a named exception |
| Bounce without a gesture | Never; damping ratio 0.62 on a decorative cursor morph | Never |
| Fixed step and settle band | 4ms and 0.01; 16.7ms with interpolation and 0.05 | 4ms and 0.01 |
| Stagger | Cap 6 or 12; gap 30 to 80ms or 30 to 50ms | 6 and 30 to 80ms |
| Reduced motion | Keep a 120ms fade; disable everything; split by pointer | Split by pointer |
| Error shake | 280ms shake; no shake, ring and one line | Shake only on a blocking submit |

## Sources

- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT), plus Sonner (sonner.emilkowal.ski) and Vaul.
- Benji Taylor, benji.org (Family Values, Liveline, Morphing Icons with Claude) and Stageshow (github.com/benjitaylor/skills, MIT).
- Jakub Antalik, transitions.dev: cross-blur, enter and exit asymmetry, distance falloff, the 280ms shake.
- Cheng Lou, chenguini and handwired (MIT): hit testing, velocity sampling, fixed-step animation.
- Lochie Axon, torph (github.com/lochie/torph, MIT): text and number morph rules.
- Meta, Astryx (github.com/meta/astryx, MIT): hover-intent timing, reduced motion by pointer.
- Apple, Designing Fluid Interfaces (WWDC 2018) and the Human Interface Guidelines: springs, projection, rubber banding.
- Ben DC, frontend-guidelines (github.com/bendc/frontend-guidelines): unit conventions.
- Leonxlnx, taste-skill (MIT): the reduced-motion visibility check.
- lucide-animated.com: hover default with an imperative trigger.
- Radix UI, guidelines.sh, WCAG 2.1 (Animation from Interactions), MDN and web.dev references.
