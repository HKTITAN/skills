---
title: components and states
summary: What he has written about building parts of a product. Trays, designed states, a small API, phone layouts, tools that act like their physical counterparts, colour, type and sound that carry meaning.
---

# Components and states

One claim per line, each with its piece. The tray rules come from one shipped iOS wallet. The API lines come from two React libraries he published. None of them is offered by him as a general rule for every product, and a reply says which product a line came from.

## Trays

- Family's main tool for simplicity is a tray system: small overlays that expand, contract and adapt to what the user is doing. (Family Values, https://benji.org/family-values)
- A tray is opened by a button, an icon or a notification. It can sit over any content or grow out of a component such as a button. (Family Values, https://benji.org/family-values)
- Each successive tray has a different height, so the change of step is visible. Keeping that rule sometimes meant rewriting copy or changing a layout. (Family Values, https://benji.org/family-values)
- Every tray has a title and an icon. On the first tray the icon dismisses; on later trays it steps back. (Family Values, https://benji.org/family-values)
- One tray holds one piece of content or one primary action. (Family Values, https://benji.org/family-values)
- A tray takes the theme of the flow it sits in: a dark flow gets dark trays. (Family Values, https://benji.org/family-values)
- Trays are for transient things such as confirmations and warnings, and they keep context because they overlay it. Full screens are for content that persists. (Family Values, https://benji.org/family-values)
- A tray flow can end in a full screen. (Family Values, https://benji.org/family-values)
- First-use teaching is folded into the same tray as the action, so the tutorial is not a separate place. (Family Values, https://benji.org/family-values)
- He credits Craft's similar system as part of the inspiration for the trays. (Family Values, https://benji.org/family-values)

## Designed states

- Loading, empty and paused are designed states, not gaps. Liveline's loading state is a breathing line that morphs into the chart. (Liveline, https://benji.org/liveline)
- If data never arrives, Liveline shows a quiet empty state with text the developer can set. (Liveline, https://benji.org/liveline)
- Paused freezes the view while data keeps arriving, then catches up on resume. (Liveline, https://benji.org/liveline)
- A skeleton sits at the content's own geometry, with rows resolving top to bottom and real chrome throughout. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- A form error sits on the field that caused it and is cleared by fixing that field. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- A trigger with its popover open keeps its pressed look. (Stageshow, references/craft.md, https://github.com/benjitaylor/skills)
- An open popover, menu or sheet is pinned by the edge it opened from and never drifts as its list changes height. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- In an empty state most of the sentence stays put and only the changing part updates. (Family Values, https://benji.org/family-values)
- A first-use empty state can point at the action: Family's browser shows an animated arrow toward opening a new tab. (Family Values, https://benji.org/family-values)

## State shown through an object

- A small trash can fills as you type, shakes when the bubble is full and empties when you clear. (Honkish, https://benji.org/honkish)
- An in-app notification has an animated border that counts down how long it will stay. (Honkish, https://benji.org/honkish)
- A dashed outline around a friend's avatar means they are elsewhere in the app. (Honkish, https://benji.org/honkish)
- A friend's arrival fills a border around their avatar with a sound; their departure is a burst of waving emojis with a sound. (Honkish, https://benji.org/honkish)
- Hidden balances shimmer in Family's stealth mode to show they are still updating. (Family Values, https://benji.org/family-values)
- A rating slider shaped like the logo changes its face with the score. (Honkish, https://benji.org/honkish)

## A small API

- Two required props are enough for the core job. Liveline takes the data and the latest value. (Liveline, https://benji.org/liveline)
- Both libraries fill their parent, so the wrapper sets the height. (Liveline, https://benji.org/liveline; Drawesome, https://benji.org/drawesome)
- Features sit behind props that are off or have defaults he calls sensible; the core is one line that moves. (Liveline, https://benji.org/liveline)
- One input can produce a whole palette: Liveline converts any CSS colour to HSL and derives the line, fill, glow, badge and labels from it. (Liveline, https://benji.org/liveline)
- Drawesome's toolbar can be removed entirely, and the surface, toolbar and drawing hook are exported for custom layouts. (Drawesome, https://benji.org/drawesome)
- Strokes are plain data: they can be read, set, restored and observed after every stroke or erase. (Drawesome, https://benji.org/drawesome)
- An export matches what is on screen exactly, erasures included. (Drawesome, https://benji.org/drawesome)
- Named options over free values: Drawesome's depth is flat, soft, regular or strong, and its theme is light, dark or auto. (Drawesome, https://benji.org/drawesome)
- For assembling a drawing tool from parts he points people to tldraw or Excalidraw instead. (Drawesome, https://benji.org/drawesome)
- The Stageshow kit supplies mechanics, never a look: it does the parts that are hard to get right by hand and leaves the product's look to the builder. (Stageshow, https://benji.org/stageshow; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- Use the kit part, never a hand-built lookalike. A hand-built button or card is where uneven padding and squeezed labels come from. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- In a stage, parts stay mounted through transitions so they can animate in and out, and positions are measured so the cursor and overlays line up at any size. (Stageshow, https://benji.org/stageshow)

## Tools that act like the real thing

- Drawing tools behave like their physical counterparts: pencil, pen and brush thin with speed, fineliner and highlighter hold their width, and the fountain pen depends on direction. (Drawesome, https://benji.org/drawesome)
- No two strokes come out identical. (Drawesome, https://benji.org/drawesome)
- The eraser removes area, not whole strokes. (Drawesome, https://benji.org/drawesome)
- Pens in a tray beat a row of icons. He credits Apple's markup tools for the idea. (Drawesome, https://benji.org/drawesome)
- In Family, deleted items tumble into a skeuomorphic bin with a sound. (Family Values, https://benji.org/family-values)

## Phones and input

- Under 680px his Drawesome demo moves the bar to the left edge and trims the toolset, because the default bar is wider than a phone. (Drawesome, https://benji.org/drawesome)
- Two stacked sliders on a vertical rail can be taller than the canvas, so size and opacity can be switched off separately. (Drawesome, https://benji.org/drawesome)
- Each pen's shortcut is shown in its tooltip, undo and redo use the standard keys, and shortcuts can be turned off where the host page has its own. (Drawesome, https://benji.org/drawesome)
- A heart placed by a double tap is stored as relative coordinates, so it lands in the right place on any screen size. (Honkish, https://benji.org/honkish)
- That double tap gives a visual, an animation and a haptic pulse felt by both people. (Honkish, https://benji.org/honkish)
- Honk never shipped on Android, and he lists that among the reasons it ended. (Honkish, https://benji.org/honkish)

## Colour, type and sound that carry meaning

- Colour carries meaning in Honk: a destructive action such as deleting the account turns the tray background red, and the same coding runs into chat themes. (Honkish, https://benji.org/honkish)
- Honk used two commissioned typefaces, one for the app's UI and one only for the two message bubbles. (Honkish, https://benji.org/honkish)
- Sound was composed after the feature was designed, to the timing of each interaction. (Honkish, https://benji.org/honkish)
- The Honk sound itself went through many iterations. (Honkish, https://benji.org/honkish)
- The Honk button fires bursts of emoji or stickers at a friend with matching sounds, and rapid tapping is part of the design. (Honkish, https://benji.org/honkish)
- Liveline's momentum arrows are green for up, red for down and grey for flat. (Liveline, https://benji.org/liveline)
