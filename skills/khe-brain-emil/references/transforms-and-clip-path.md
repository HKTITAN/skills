---
title: transforms-and-clip-path
summary: The techniques he teaches: translate, scale, rotate, 3D, transform-origin, and clip-path as an animation tool.
---

# Transforms and clip-path

The starting scale of an entrance is given three different ways across three articles. Read [disagreements](disagreements.md) before answering "what scale should it start from".

## Translate

- `transform` underlies most web animation; Sonner uses transforms for every animation it has. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- A translate does not change the element's place in the document flow. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- He prefers `translateX()` and `translateY()` over the two-value form, for readability. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- A percentage in a translate is relative to the element's own size, so `translateY(100%)` moves it by exactly its own height. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- That is why Vaul hides a drawer of any height with `translateY(100%)`, where `300px` works only for a drawer 300px tall. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- He prefers percentages for most animations even when sizes are fixed, because they are less error-prone. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)

## Scale

- Scale also scales the children, text and icons included, which is what makes it right for press feedback. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- He does not scale X and Y by different amounts; it usually looks awkward. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- Press feedback is `scale(0.97)` on `:active`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same value in his table for agents. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Almost never animate from `scale(0)`. Pair a small initial scale, such as `0.5` in Clerk's toast, with an opacity fade. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- Start from about `0.9` or higher; the demo uses `0.93`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Start from `scale(0.95)`, never `scale(0)`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- The reason he gives: `scale(0)` reads as appearing from nowhere, and a deflated balloon still has a shape. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same reason, used as his example of a taste call that has a logic behind it. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)

## Rotate and 3D

- Rotate is used less than translate or scale; it gives thrown objects believable motion, as in his trash animation. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- `rotateX()` and `rotateY()` with `transform-style: preserve-3d` rotate around an axis. His mental model is a screw; at 180 degrees you see the back. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- Knowing 3D transforms opens up effects such as an orbit, a 3D loader and a coin flip. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- He learns animations by inspecting ones he admires and rebuilding them. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)

## Transform origin

- Every transform has an anchor, `transform-origin`, which defaults to the center. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- The default center is wrong for most popovers; a popover scales in from its trigger. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- A dropdown opened from a button grows out of that button, for example `transform-origin: bottom center`. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- Radix exposes the origin as a CSS variable (`--radix-popover-content-transform-origin`), and shadcn/ui already applies it. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- Base UI exposes it as `--transform-origin`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The fault shows most when both axes are off, such as a top-right placement. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)

## Clip-path

- `clip-path` hides everything outside a shape and, like `transform`, does not affect layout. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- `inset(top right bottom left)`: `inset(100%)` hides everything, `inset(0 50% 0 0)` hides the right half, and `round` adds a radius. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- A comparison slider is two stacked images with the top one clipped by an inset that follows the drag. It needs no wrapper element and performs better than changing a width under `overflow: hidden`. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- An image reveal animates `inset(0 0 100% 0)` to `inset(0 0 0 0)`. He prefers it to animating height: it is hardware-accelerated and causes no layout shift. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- A reveal fires when the image enters the viewport, once: `useInView` with `once: true` and a `-100px` margin. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- In a project that does not already use Framer Motion, use the Intersection Observer API, because the library is heavy. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- He runs the reveal with the Web Animations API. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- A line that draws on scroll is a clipped div. The value must stay a motion value; copied into a plain variable it stops updating. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- Tabs: animating the text color beside a moving highlight never lines up. Duplicate the tab list, style the copy as active, and clip it to the active tab, for example `inset(0px 75% 0px 0% round 17px)`. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- The same tabs fix, given as an example of knowing your tools. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- A theme switch can be revealed the same way over a copy of the page. He calls that hacky and names the View Transitions API as the route without duplication. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- Hold to delete hides a red copy of the button with `clip-path: inset(0px 100% 0px 0px)` and reveals it from the left while the button is pressed. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
