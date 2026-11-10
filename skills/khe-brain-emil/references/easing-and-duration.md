---
title: easing-and-duration
summary: Which curve, how long, and the published values for specific components. Every number is exact as published.
---

# Easing and duration

Numbers here are his, copied exactly. A number that is not on this page is not his; say so. Several of his own components break his general rules on purpose: see [disagreements](disagreements.md).

## Choosing a curve

- Easing is the most important choice in an animation: it can make a weak one look strong and a strong one look weak. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same claim, in the same words. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- Anything entering or leaving uses `ease-out`: the fast start reads as responsive. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Something already on screen that moves from A to B uses `ease-in-out`, because it speeds up and slows down the way a car does. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- `ease-in` is the wrong way round for interface work: at the same 300ms it feels slower than `ease-out`, because it speeds up at the end. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- A shorter duration could rescue `ease-in`, and he still calls the curve unsuited to UI. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- `ease-out` is the default in most cases. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- The flowchart he gives agents: entering or leaving the viewport, `ease-out`; moving or morphing on screen, `ease-in-out`; a hover change, `ease`; constant motion, `linear`; anything else, `ease-out`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- The flowchart is strict on purpose, so the agent never has to make up a rule. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- The built-in CSS curves are usually too weak, so he almost never uses them and reaches for custom curves. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same claim, with a custom `ease-in-out` shown as livelier than the built-in one. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- The exception: built-in `ease` is fine for a simple hover such as a background color. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- Where he gets custom curves: easings.co. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- A second source he names: easing.dev. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- `linear` suits a progress indicator: the hold-to-delete reveal runs `2s linear` so it fills evenly. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)

## How long

- Interface animations stay under 300ms as a rule of thumb. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- The same ceiling. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same ceiling, worded as "usually". (Great Animations, https://emilkowal.ski/ui/great-animations)
- A 180ms dropdown feels more responsive than a 400ms one. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- A 180ms select feels more responsive than a 400ms one. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- His table for agents: micro-interactions 100 to 150ms; standard UI such as tooltips and dropdowns 150 to 250ms; modals and drawers 200 to 300ms. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Larger elements move slower than small ones. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- An exit can run about 20% faster than its entrance. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Longer travel gets a longer duration. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- A faster spinner makes loading feel shorter at the same real load time. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- A spinner that looks busier feels like it is working harder, at the same real time. (Great Animations, https://emilkowal.ski/ui/great-animations)

## Published values for specific things

- Tooltip: `transition: transform 0.125s ease-out, opacity 0.125s ease-out`, from `opacity: 0` and `scale(0.97)`, with `transform-origin: var(--transform-origin)`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Tooltip opened right after another: `[data-instant] { transition-duration: 0ms; }`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Press feedback: `transition: transform 160ms ease-out` to `transform: scale(0.97)` on `:active`. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
- Hold to confirm: the press reveals over `2s linear`; the release returns over `200ms ease-out`. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
- Slow in while the user decides, fast out when they cancel. One transition for both directions makes the release sluggish. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
- Sonner's toast: `transition: transform 400ms ease`. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Why Sonner is slower and uses `ease`: it suits the library's look and its name. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Vaul's drawer: `transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)`. The curve is the iOS sheet curve taken from Ionic, and 500ms matches iOS. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Image and theme reveals: `1s cubic-bezier(0.77, 0, 0.175, 1)`. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- Reduced-motion fade in his example: `0.2s`. (Great Animations, https://emilkowal.ski/ui/great-animations)

## When it still feels off

- After easing and duration have been tried, add a little `filter: blur()`; his demo uses `2px`. It bridges the two states so the eye reads one object changing. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same fix in his table for agents, with a ceiling: blur under 20px. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Look at an animation again the next day; faults show up with fresh eyes. (Great Animations, https://emilkowal.ski/ui/great-animations)
