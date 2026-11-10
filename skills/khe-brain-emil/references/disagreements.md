---
title: disagreements
summary: Where two of his articles give different answers, where his own components break his general rules, and what he says he changed his mind about.
---

# Disagreements

Open this file on every question, after the theme file. When a question lands on a row here, the reply carries a `Conflict:` line that cites both sides. Never pick one side and present it as his single view, and never average two numbers into a third he did not publish.

The "How to report it" line in each entry is this skill's reading. It is never attributed to him.

## Articles that give different answers

### The starting scale of an entrance

- Start from `scale(0.95)`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Start from about `0.9` or higher; the demo uses `0.93`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- A small initial scale such as `0.5`, paired with an opacity fade. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- All three agree on the rule behind the number: never `scale(0)`.
- How to report it: give the rule, then the three numbers with their articles. `0.5` is a toast that also fades in; `0.93` and `0.95` are popover-sized elements. He has not written a line that reconciles them.

### How long a tooltip takes

- Tooltips sit in the standard tier, 150 to 250ms. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- His reference tooltip CSS runs `0.125s`, which is the micro tier of the same table. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- How to report it: both values, both articles. The table is a rule for agents; the CSS is a working example.

### Built-in curves

- The built-in CSS curves are too weak and he almost never uses them. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The same statement. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- His flowchart for agents names only built-in keywords: `ease-out`, `ease-in-out`, `ease`, `linear`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- His reference tooltip CSS uses built-in `ease-out`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- The hold-to-delete release and press also use built-in `ease-out`. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
- How to report it: the flowchart picks the family of curve; the custom-curve advice is about its strength. He states the first and the second in different articles and never joins them.

### Does everything need motion, or does nothing

- Nothing in the physical world changes instantly, so an instant change on the web feels artificial. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Sometimes the best animation is none; keyboard actions and things seen hundreds of times a day get no motion. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- Instant change is sometimes better on the web, and functional data is better still. (Good vs Great Animations, https://emilkowal.ski/ui/good-vs-great-animations)
- How to report it: the frequency and purpose test comes first in every article that states it; the "feels natural" argument applies to what survives that test. Say that the ordering is a reading.

### Hover

- A hover change uses `ease`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Hover effects on elements used constantly are removed. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- The same removal, for anything seen tens or hundreds of times a day. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- How to report it: whether it animates is answered first; the curve applies only when it does.

### How much blur

- A little blur; the demo uses `2px`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Subtle blur, under 20px. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- How to report it: `2px` is the only value he demonstrates; 20px is a ceiling, never a target.

### Framer Motion

- He usually reaches for it, and uses it for the scroll and in-view demos. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- He calls it heavy and sends a project without it to Intersection Observer. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- It runs on `requestAnimationFrame` and drops frames when the main thread is busy; CSS or the Web Animations API hold up. (Great Animations, https://emilkowal.ski/ui/great-animations)
- How to report it: he uses the library and names its two costs. He has not published a rule for when to choose it.

## His own components against his general rules

### Under 300ms, and Sonner at 400ms

- Interface animation stays under 300ms. (You Don't Need Animations, https://emilkowal.ski/ui/you-dont-need-animations)
- Sonner's toast transitions over `400ms ease`. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- He explains it: slower and `ease` on purpose, to suit the library's look and name. (Great Animations, https://emilkowal.ski/ui/great-animations)
- How to report it: this one he reconciles himself. Cite the explanation.

### Modals and drawers 200 to 300ms, and Vaul at 500ms

- Modals and drawers: 200 to 300ms. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Vaul: `0.5s`, with the iOS sheet curve. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- His reason for Vaul's value is that it copies iOS. He never mentions the table beside it.
- How to report it: both values. A drawer that imitates the native sheet takes the native timing; that link is a reading.

### `ease-out` for anything entering, and Sonner on `ease`

- Entering and leaving use `ease-out`. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Sonner's toast enters on `ease`. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Explained by the same passage as the 400ms. (Great Animations, https://emilkowal.ski/ui/great-animations)

### Keyframes

- Keyframes cannot be interrupted, so Sonner dropped them. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- His image and theme reveals use a keyframe animation with `forwards`. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- How to report it: the objection is to keyframes on motion that can be retriggered. A reveal that runs once is a different case; he does not state the boundary.

## Agents: two moods

- Package taste into skills and agents carry more of the work. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Cheap building lowered the bar, and much agent-built work feels empty. (Friction as a Feature, https://emilkowal.ski/ui/friction-as-a-feature)
- How to report it: the two do not contradict. One is about what to hand an agent; the other is about what a person must still decide. Cite both when asked whether he is for or against building with agents.

## What he says he changed

- He once thought good animation was a gift you have or lack. He now teaches it as technique. (7 Practical Animation Tips, https://emilkowal.ski/ui/7-practical-animation-tips)
- Sonner started on keyframes and moved to transitions. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- Vaul started with a CSS variable for the drag position and moved to a direct transform. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)
- Sonner's mount trick is marked for replacement by `@starting-style`. (Building a Toast Component, https://emilkowal.ski/ui/building-a-toast-component)
- The same note, repeated later. (CSS Transforms, https://emilkowal.ski/ui/css-transforms)
- He teased a project in public once, calls it a mistake, and now commits through a presale. (Building an Animation Course, https://emilkowal.ski/ui/building-an-animation-course)
- He rewrote his theory material after learning to teach it better. (Building an Animation Course, https://emilkowal.ski/ui/building-an-animation-course)

No article carries a date, so "earlier" and "later" can be told only from what one article says about another. Never claim an order the text does not give.
