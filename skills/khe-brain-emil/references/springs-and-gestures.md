---
title: springs-and-gestures
summary: Springs, interruption, and what he published about drag, swipe, momentum and touch in Sonner and Vaul.
---

# Springs and gestures

He names the three spring parameters and publishes no values for them. Any stiffness, damping or mass number is not his: see [silent](silent.md).

## Springs

- Nothing in the physical world appears or changes instantly, which is why an instant change on the web feels artificial. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Springs give organic motion; a spring is set by stiffness, damping and mass. He shows a visualizer and gives no values. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Apple's Dynamic Island is his reference for motion that feels alive. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Natural motion is a main reason native mobile apps feel better than web apps. (Great Animations, https://emilkowal.ski/ui/great-animations)
- A visual driven straight from the pointer position feels artificial; passing the value through a spring (`useSpring` in Motion) fixes it. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- That spring treatment is for decoration only. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)

## Interruption

- A great animation can be reversed or redirected mid-flight and stays smooth. (Great Animations, https://emilkowal.ski/ui/great-animations)
- CSS transitions can be interrupted and retargeted before they finish; he offers them as the CSS route to interruptible motion. (Great Animations, https://emilkowal.ski/ui/great-animations)
- CSS keyframes cannot be interrupted: toasts added quickly made the older ones jump, so Sonner moved to transitions. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)

## Swipe and drag in Sonner

- Swipe to dismiss is momentum-based: a fast, short swipe still dismisses. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Velocity is the absolute drag distance divided by the elapsed time; a toast is dismissed past the distance threshold or above a velocity of `0.11`. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- The `0.11` came from trial and error. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- The toast captures the pointer during a drag, so the drag continues when the pointer leaves it. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Dragging the wrong way still moves the toast, with rising resistance, never a hard stop. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Enter and exit run along the same direction so the swipe makes sense. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)

## Drag in Vaul

- A flick closes the drawer without passing a distance threshold. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Dragging up past the top is damped: the further the pull, the less it moves. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Dragging is allowed only when the content is scrolled to the top, as on iOS. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- A fast scroll that reaches the top would close the drawer by its velocity, so dragging is blocked for 100ms after the top is reached. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Every touch after the first is ignored until release, so a second finger does not make the drawer jump. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Snap points are a fraction of the viewport or a fixed pixel value; pixels keep an input visible across devices. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Snapping is velocity-aware: a hard flick skips points or closes the drawer. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- While dragging, the background's scale and radius follow progress: dragged 40% down means 60% of the maximum radius. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)

## Testing touch

- Desktop dev tools do not reproduce a phone. He tests on a real phone by cable with Safari dev tools, or over the local network, or in Xcode Simulator. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
