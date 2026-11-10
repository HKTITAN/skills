---
title: motion with a cause
summary: Why something moves and how. Cause, continuity and morphing in shipped apps and icons; story, loops, pace, the cursor and the camera in faux product UI; shared easing in a live chart.
---

# Motion with a cause

One claim per line, each with its piece. Keep three contexts apart. Family Values and Honkish describe motion in shipped apps. The Stageshow lines are rules for storytelling motion in a demo, and its curves and durations are for that job only: the same file says real UI feedback stays as quick as the real product. Liveline describes a chart that redraws every frame.

## Cause

- The Stageshow standard ends on motion: "every motion has a cause". (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, https://benji.org/stageshow)
- A scripted change with no cursor looks automatic. Adding the cursor gives each change a cause. (Stageshow, https://benji.org/stageshow)
- In his walk-through the one change left without a cause is the one that reads as wrong: a person vanishes unexplained. (Stageshow, https://benji.org/stageshow)
- No cursor move you cannot explain goes in the story. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- Every animation has an architectural purpose: it shows the path from one place to the next and helps the user see where they are going. (Family Values, https://benji.org/family-values)
- A transition was added to Family only once the team understood why it made sense. (Family Values, https://benji.org/family-values)
- Any element may turn into another when the transition has a clear reason. (Family Values, https://benji.org/family-values)
- Cover each moving element in turn. If the story gets clearer without it, cut it. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- The camera needs a reason. Push in only when the payoff would be too small to read, once per story, and cut any zoom nobody would miss. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- With no cursor there is no stand-in: never walk a focus ring, a halo or a spotlight between controls. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)

## Continuity in a shipped app

- Tabs slide in the direction of the tab that was tapped. In his words: "We fly instead of teleport." (Family Values, https://benji.org/family-values)
- Motion explains where things went. The swap approval rises out of the swap screen, and after a send a spinner travels to the tab where the pending transaction lives. (Family Values, https://benji.org/family-values)
- Components that persist across screens stay put. Animating something that did not change is redundant motion. (Family Values, https://benji.org/family-values)
- Text that changes keeps what it shares: Continue becomes Confirm around its common letters, counts on a button update in place, and only the changing part of a sentence updates. (Family Values, https://benji.org/family-values)
- One transition does not make an interface fluid. He puts a fluid interface down to hundreds of small, deliberate decisions, and a margin note on the page corrects that to thousands. (Family Values, https://benji.org/family-values)
- Consistent motion tells the user the app understood their intent. A glitchy animation in a banking app made him doubt the app. (Family Values, https://benji.org/family-values)
- He built deliberately less fluid versions of the same screens, for comparison only, to show what the motion was doing. (Family Values, https://benji.org/family-values)
- In Honk a bubble grows as you type and shrinks when you pause, and when both people type the screen splits evenly. (Honkish, https://benji.org/honkish)
- Drawesome's toolbar changes shape between states instead of swapping panels, and its minimised disc still shows the tool in hand. (Drawesome, https://benji.org/drawesome)

## Morph, never swap

- Asked for an icon component with smooth transitions, the model produced a crossfade between two SVGs. He rejected it: fading one icon out and another in is not a transformation. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- His fix was a constraint: every icon is exactly three SVG lines, so any icon can morph into any other. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- An icon that needs fewer lines collapses the spares to an invisible zero-length point at the centre. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- Two icons that are the same shape turned are rotated, never interpolated: interpolating coordinates warps the lines. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- Rotation groups hold the arrows (90 degrees apart), the chevrons and plus and cross (45 degrees apart). Across groups the lines interpolate. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- He publishes the remaining defects: with hundreds of pairs some morphs pass through awkward shapes and some rotations overshoot. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- An object keeps its identity when it changes. A plus becoming a close rotates the same strokes; replacing the icon skips the relationship. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/teaching.md, https://github.com/benjitaylor/skills)
- Every change moves: a submenu slides, text rolls, a surface morphs. A number never jumps. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- Change only what changed. A rolling number moves the digits that differ and leaves the rest still. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, https://benji.org/stageshow)
- A button whose label changes changes on itself. It is never swapped for a second button. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- Nothing pops. Everything has an entrance and stays mounted until its exit finishes. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, https://benji.org/stageshow)
- Solid things do not fade through. Windows, phones and cards arrive by moving, opaque or nearly. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- A new row carries the rows below it, and a surface that resizes never stretches its text. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- Animate the relationship, never only the object: an insertion changes the arriving thing and the space of what was already there. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, references/teaching.md, https://github.com/benjitaylor/skills)
- One object makes one trip and ends in its final place. After motion nothing moves. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)

## Story

- Pick the story's shape from what the product is valued for: how it feels to use, a flow in an app, or what the system does. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- A story is three to five beats building to a payoff. One gesture and a response can be enough. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- A hero loop runs 10 to 16 seconds. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- Between a richer story and a calmer frame, choose the frame. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- Open on a finished screen that works as a still. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- The payoff is visible at the shown size and arrives full, never as a blank surface that fills in. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- The poster is the frame most people see. Choose the beat that tells the story on its own, after everything has landed. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- A notification is tapped to open its app and the reply happens in the app. A story told through long-press shortcuts reads as invented. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)

## Loops

- A loop ends where it began or resets with a visible cause. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- In his walk-through the cursor undoes the change on screen, so the loop has no seam. (Stageshow, https://benji.org/stageshow)
- Every reset has a cause or is invisible: a seen undo or clear first, then an exit around an anchor, then a snap while hidden. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- Data never rewinds in view. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- A loop never plays a navigation backwards. No product does that. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- The payoff holds for 2 seconds before the exit, and nothing on screen sits still for more than three. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- Within about a second of the exit ending, the next action has begun. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- A second scene earns its length by adding something new. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)

## Pace

- Demo motion is unhurried and runs on two curves: `cubic-bezier(0.45, 0, 0.1, 1)` for travel and `cubic-bezier(0.25, 0.8, 0.25, 1)` over 0.8 to 1 second for an arrival from nowhere. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- UI feedback stays as quick as the real product. Only storytelling motion slows down, and feedback starts on the input. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/choreography.md, https://github.com/benjitaylor/skills)
- Choose durations and easings together by job. One easing everywhere flattens the hierarchy. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/choreography.md, https://github.com/benjitaylor/skills)
- Related responses overlap: a changed setting leads its label, then its dependants, while the frame holds. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/choreography.md, https://github.com/benjitaylor/skills)
- Groups stagger in reading order 40 to 80ms apart inside a scene. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- A quiet frame gives the moving parts something to move against. Moving every layer at once takes that away. (Stageshow, references/choreography.md, https://github.com/benjitaylor/skills)
- Holding a result means stopping. A useful still needs no new pulse. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/choreography.md, https://github.com/benjitaylor/skills)
- A small expressive icon may overshoot while its card and text settle without bounce. Landings are soft. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/choreography.md, https://github.com/benjitaylor/skills)
- A colour change between distant hues takes about 200ms, because it passes through mud however it is done. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)

## The cursor and touch

- A cursor moves like a hand: shallow arcs, timed by distance, with a visible press. (Stageshow, https://benji.org/stageshow)
- One cursor style per site, or none. (Stageshow, https://benji.org/stageshow)
- The elements decide the cursor's kind: an I-beam over text, a hand on a button, an open hand that closes on a drag. (Stageshow, https://benji.org/stageshow; Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- The cursor never covers the words it clicks, and rests on empty surface between beats. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- Every cursor move travels to the next action, follows a held object or clears the way. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- The result follows the press: a small press and surface response comes before the state changes. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/teaching.md, https://github.com/benjitaylor/skills)
- A pointer drag is one motion and starts where the thing is. A carried card is held, lifted and tilted a degree or two, and settles flat on drop. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- A text selection stays under the I-beam on every frame. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- Phones are touch-driven and move differently: a card opens into its screen as one object and a swiped row leaves at the speed the finger released it. (Stageshow, https://benji.org/stageshow; Stageshow, references/motion.md, https://github.com/benjitaylor/skills)

## One object, one easing

- Liveline never jumps to a new value. The chart eases toward the new state at 8 percent per frame. (Liveline, https://benji.org/liveline)
- The Y-axis range, the badge and the grid labels share that easing, which is why the chart reads as one thing and not as parts updating separately. (Liveline, https://benji.org/liveline)
- The range expands at once when data exceeds it, so the line is never clipped: he eases everything except the thing that would hide information. (Liveline, https://benji.org/liveline)
- A momentum arrow fades out fully before the arrow for the new direction fades in. (Liveline, https://benji.org/liveline)
- The large value overlay updates at 60fps by writing to the DOM directly, not through React re-renders. (Liveline, https://benji.org/liveline)
- Loading is a breathing line that morphs into the real chart when data lands. (Liveline, https://benji.org/liveline)
