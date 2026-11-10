---
title: performance
summary: What he published about frame rate, which properties to animate, CSS against JavaScript animation, and the two lag bugs he wrote up.
---

# Performance

He writes about animation performance only. Bundle budgets, Core Web Vitals and rendering strategy are in [silent](silent.md). The fix for a dropped frame belongs to his `animation-performance` skill; this file only says what the articles say.

## The frame rate

- An animation that does not hold 60fps makes every other principle worthless. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Not dropping frames while dragging is where a drawer starts. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)

## Which properties

- Animate `transform` and `opacity`: they trigger only the composite step. Padding and margin trigger layout and paint as well. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Not every CSS property is hardware-accelerated, so `transform` and `opacity` are the safe choice. (Great Animations, https://emilkowal.ski/ui/great-animations)
- `clip-path` reveals are hardware-accelerated and beat a width or height animation. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- Tuple's comparison uses width and could move to `clip-path` for performance. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- Shaky motion: add `will-change: transform`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Hover flicker: animate the child, never the hovered parent. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)

## CSS against JavaScript

- When the main thread is busy, use CSS animations or the Web Animations API; they are hardware-accelerated and stay smooth. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Framer Motion runs on `requestAnimationFrame`, which is not hardware-accelerated; in his demo it lags more as the page gets busier. (Great Animations, https://emilkowal.ski/ui/great-animations)
- On Vercel's dashboard a shared-layout highlight dropped frames while a new page loaded. Moving it to CSS fixed it. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Motion values update inline styles without a re-render. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- Framer Motion is heavy; a project that does not already use it gets Intersection Observer for a viewport trigger. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)

## The two bugs he wrote up

- Writing a CSS variable on every drag frame made Vaul lag past about 20 list items: variables are inherited, so every child recalculated its style. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- The fix was to set `transform: translateY()` directly on the element. It took him hours to find. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Animating Safari's theme color in 50 steps of 10ms beside the drawer drifted whenever frames dropped, so it was never shipped. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)

## Perceived speed

- A faster spinner makes loading feel shorter at the same real load time. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- Fast animation improves perceived performance and keeps the interface tied to the user's action. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
