---
title: components
summary: What he published about building specific components (toast, drawer, tooltip, tabs, hold to delete) and about component API and documentation.
---

# Components and their API

Drag and swipe behavior is in [springs-and-gestures](springs-and-gestures.md). Curves and durations are in [easing-and-duration](easing-and-duration.md). To set up or fix Sonner, his `ask-sonner` skill owns the job.

## API and developer experience

- Developer experience is half of why Sonner won: people drop a component that is hard to use. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- One `<Toaster />` in the tree, then `toast()` from anywhere, with no hook and no context. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- State uses the observer pattern: the Toaster subscribes, and `toast()` notifies it. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- The promise API takes a promise and a message for loading, success and error. It is the part engineers praise. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- The API was inspired by react-hot-toast; the state management differs. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- He built a custom documentation site with live examples and snippets ready to copy. Good documentation lowers the barrier to use and is usually an afterthought. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- His own summary of why it worked: an API that takes one line, defaults that look good, and good animation. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Beauty is underused in software, so it is a way to stand out. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Vaul is built on Radix's Dialog primitive for accessibility and focus management, and its API mirrors Radix so it feels familiar. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)

## Toast

- Keyframes were replaced with transitions so toasts added quickly do not make older ones jump. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Enter without keyframes: a `useEffect` sets `mounted` after the first render, and the toast moves from `translateY(100%)` to `translateY(0)`. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- `@starting-style` can replace that mount trick once browser support allows. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- Stacking: toasts are `position: absolute`; each one behind the front lifts by the gap times its index and shrinks by `0.05` times its index (`scale(0.95)`, then `scale(0.9)`). (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Toasts of different heights break the stack, so in stacked mode every toast takes the height of the front one. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- On hover the stack expands: each toast's offset is the summed heights of the toasts before it plus the gaps. An `expand` prop keeps it open. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- A toast disappears after 4 seconds unless it is hovered. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- The timer also pauses while the tab is hidden. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- An `:after` pseudo-element fills the gaps between toasts so hover is not lost while the pointer crosses the stack. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- The whole stack is `translateY()` values computed from each toast's index. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- The stacking animation is what drove adoption, and his announcement videos showed that one interaction. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)

## Drawer

- On mobile he prefers a drawer to a modal because it feels more native. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- `scaleBackground` scales and rounds the page behind so it reads as another sheet. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Keyboard: he disables the browser's scroll-into-view and uses the Visual Viewport API, setting the drawer's height and bottom on each `resize`. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- The cost of that approach: a slight delay, because the new height arrives only once the keyboard is fully up. He still calls it the best he found. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- The goal is that users notice nothing, because it behaves as the native control would. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)

## Tooltip

- The first tooltip opens after a short delay, which prevents accidental triggers. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- Once one is open, its neighbors open with no delay and no animation. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Radix and Base UI handle the delay; Base UI marks the instant case with `data-instant`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same rule in his table for agents, as the fix for tooltips that feel slow in sequence. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)

## Tabs

- The duplicated, clipped tab list is hidden from assistive technology (`aria-hidden`) and from the tab order (`tabIndex={-1}`). For real accessibility he would use Radix Tabs. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- The technique is in use on Stripe's blog. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)

## Hold to delete

- Structure: a button, plus an absolutely positioned `aria-hidden` overlay holding a red copy of the same content. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
- A base transition and a different transition on `:active` give a slow press and a fast release. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
- Every button benefits from a slight scale down on press. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)

## Small targets

- A small button that is hard to tap gets a 44px minimum hit area through a pseudo-element. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
