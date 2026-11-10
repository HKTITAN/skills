---
title: sticker-craft
summary: The rules every sticker shares, whatever its kind. The brief turned into a kind, a verb, a palette and a size; the canvas; the one outline; the palette roles; the die-cut; the set as the unit; the silhouette and the small-size checks; the motion as one story, a hold and a still.
tags: [sticker, craft, outline, palette, die-cut, set, motion, still]
---

# Sticker craft

A sticker is one idea drawn as one object, seen small, on a ground nobody chose. These rules hold for every kind. The rules for one kind are in [sticker-kinds](sticker-kinds.md), the files a pack ships are in [sticker-pack](sticker-pack.md), and a project's `.design` contract, [pov](pov.md) and [gotchas](gotchas.md) outrank the defaults here.

## Decide first

Turn the brief into six lines before drawing. A sticker with one of them missing is redrawn later.

```text
1. Idea     one thing the sticker says, in two or three words ("sent", "locked", "love it")
2. Kind     flat | lettering | character | badge | isometric | reaction      (sticker-kinds.md)
3. Verb     what it does, in one word (pop, clasp, thump, hop), or "none" for a still
4. Palette  the roles it uses, mapped from the project's contract: two accents and white
5. Home     a chat pack (loops, die-cut, 512 px files) or a page (plays once, then the page idles it)
6. Set      the stickers it sits beside, and the outline, tilt, band and marks rule it inherits from them
```

A second idea is a second sticker. A brief that needs a sentence to explain is not a sticker yet.

## The canvas and the outline

- **Draw on a 500-unit square: `viewBox="0 0 500 500"`, no `width` or `height`.** Every number in this skill is in those units, and the render step maps them to pixels.
- **One outline: 5 units, in the ink role, on every part.** Use 4 only for a small, busy set, and then on the whole set. Two weights in one sticker read as two drawings.
- **The ink is a near-black tint of the palette's own hue, never pure black.** A tinted ink ties the outline to the fills. Pure black sits on top of them.
- **Round joins and round caps by default** ([pov](pov.md), Defaults). Corners stay soft at 64 px, where a miter spike becomes a stray pixel.
- **Bake every lean and squash into the path data.** A `matrix()` or `skew` on a stroked group leans the outline with the face, so one edge is thick and the next thin. `vector-effect: non-scaling-stroke` breaks it the other way: the outline stops shrinking with the sticker and is three times too heavy at 160 px.
- **Coordinates to one decimal at most.** A sticker has no detail finer than a unit; the decimal only keeps a curve smooth.
- **No gradient, no blur, no glow, no drop shadow, no filter.** Depth is a hard shape in a darker shade. A soft effect has no edge to cut and turns to a smudge when the sticker is small.
- **No live text, no image, no script, no link out of the file.** A sticker is opened by chat apps, renderers and image tags that load nothing else.

## Colour as roles

Every paint is a role with its fallback: `fill="var(--main, #4f7cf7)"`. A bare hex is a fault, because the sticker then keeps that colour in every project.

| Role | Use |
| --- | --- |
| `main` | bodies |
| `deep` | the dark second colour |
| `tint` | pale fills |
| `gold` | coins, awards, the one warm accent |
| `ok` | success |
| `hot` | hearts, alerts |
| `white`, `paper`, `ink` | white parts, a paper ground, the outline and ink detail |

- **Two accents and white per sticker.** `main` and one more. A third accent needs a reason written in the handover.
- **A side or shadow shade belongs to its face's role, written `<role>-side`** (`--main-side`). It is a darker tone of the same hue and does not count as an accent.
- **A white part's side is a pastel of the palette, `--white-side`, never grey.** Grey is the one dead colour in a sticker made of palette colours ([pov](pov.md), Defaults).
- **One white highlight at most:** a short pill on the main face, with no outline. Two highlights compete.
- **Map the roles from the project's contract** with `khe-design-tokens`, on the first render. A sticker left on its default colours in a two-colour brand is the sign nobody mapped it.
- **No purple as a stand-in for magic, and no colour chosen because it looks like an app icon.** A colour is in the sticker because the contract has it.

## The die-cut

- **A static master carries a white die-cut as its first layer:** one closed shape 12 units outside the united silhouette, no outline, holes filled. Grow the union of every part by 16 units and pull it back by 4: the border is 12 units wide and its inside corners are rounded.
- **Parts that sit near each other share one cut.** An island of white round a stray mark is a second sticker.
- **A sticker made for one known ground may go borderless: write `data-diecut="none"` on the root.** That is a decision, and the gate reads it. A chat sticker never takes it, because a chat has photos, dark mode and coloured bubbles.
- **An animated file carries its die-cut only inside the group that moves the whole sticker,** and the cut then covers every limb across its swing. When parts move against each other, the file ships with no cut and the render step adds a moving one ([sticker-pack](sticker-pack.md)).

## The set is the unit

Nobody sees one sticker. A pack, a page section and a picker all show several, and the set is judged before any one of them.

| One per set | Value | Why |
| --- | --- | --- |
| Outline weight and ink | 5 units (or 4), one ink | Two weights read as two artists |
| Light and tilt | one facing for every slab, sides falling one way; an upright subject takes the tall-object facing, with the same side direction | A second tilt reads as a second world |
| Occupancy band | the subject's larger side at 55 to 65% of the canvas | Stickers of one size read as one family |
| Centre | the subject's optical centre within 15 units of the canvas centre | An off-centre sticker looks misplaced in a grid of them |
| Palette | one fallback per role across every file | A drifting blue is noticed before any drawing is |
| Accent rule | two or three hues per sticker counting white; one warm accent at most, on the thing the sticker is about | The warm colour is where the eye lands |
| Hue spread | the set spans five hue families or more, each from its own role | A set in one blue reads as one sticker repeated |
| Dimension | a light face and a darker tone of the same hue on every sticker, flat kinds included | One flat fill and a highlight reads as an emoji |
| Marks rule | impact marks on every hit, or on none | Marks on some stickers and not others look forgotten |
| Extras | a base, a ground or a shadow slab on all, or on none | The one sticker with a base looks like a different set |
| Motion | one length for every story, 2.5s | A row of stickers lands together |

The band and the tolerance are measured: on a fourteen-sticker page set by the pack's author, every subject sat between 55 and 65%, and the stickers that looked centred had their painted centre within 15 units; the two that looked misplaced sat 22 units out. A slab sticker may sit as low as 50% to leave room for a swing ([sticker-kinds](sticker-kinds.md)). The gate accepts 50 to 65% for one sticker and 10 points of spread across a set.

## Judge it small, and filled black

- **Fill the sticker black and look at it at 160 px.** If the shape alone does not say what it is, redraw the shape. Detail never rescues a silhouette.
- **Then look at 64 px.** That is a picker row. Anything that became a dot or a cross at 64 px is removed or made larger.
- **Then put it on three grounds:** white, near-black and a chat bubble colour. The die-cut is what makes all three work.
- **Simplify the detail, never the character.** Cut the fourth highlight, the second texture, the extra line. Keep the one feature that makes it this object: the keyhole, the fold, the smile.
- **About 15 shapes** is the default budget ([pov](pov.md)). Count them: a face and its side count once, and impact marks are not counted.
- **No near-tangents.** Two edges that almost touch read as a mistake. Line them up, overlap them clearly, or part them by more than the outline.
- **Even insets.** A shape nested in another sits the same distance from every edge. Centre a mark by its visible weight: a shape with a point sits towards the point.
- **Nothing on the canvas edge.** Leave room for the swing and for the die-cut.

## Motion: one story, then stillness

- **One verb per sticker.** A lock clasps, a parcel hops, a heart thumps, a bubble pops. Choose the verb by what the thing does, never by what it is.
- **The verb is a small story, never only an entrance.** The shackle drops and clicks shut, the tick stamps down, the character jumps and lands, the heart beats and a second one appears. A bare scale pop says the sticker arrived and nothing about what it is.
- **Every motion has a cause, and one part leads.** The lead moves first. Everything else moves because the lead did: a child follows 4 to 6 frames late at 0.6 to 1.4 of the lead's amplitude. Parts that start on the same frame read as one rigid stamp.
- **Pivot where it would hinge.** Set `transform-box: fill-box` and a `transform-origin` on every group that turns or scales: a shoulder, a base, a hinge. Without one the part orbits the canvas corner.
- **One transform per named group.** A lift, a squash and a lag are three nested groups, each with its own keyframes, so no two motions fight over one property.
- **A pop starts at scale 0.2, fully opaque.** Never at 0, which appears from nowhere, and never with a fade, which shows a ghost. From 0.2 it passes 1 to 1.161 on frame 10, then 0.919, 1.04, 0.98, 1.01, and rests on frame 55: each swing is half the last, 9 frames apart.
- **A settle is the same shape for any value:** the first swing passes rest by 0.448 of the travel times an amplitude, each later swing is half the one before on the other side, keys 9 to 11 frames apart. At full amplitude it peaks at 1.448 of the travel and takes 91 frames; the pop uses 0.45.
- **A hit accelerates in:** `cubic-bezier(0.55, 0, 1, 0.45)` on the key before the contact. Every other key uses `cubic-bezier(0.37, 0, 0.63, 1)`.
- **Squash only on a hit,** from the base (`transform-origin: 50% 100%`), to between 0.82 and 0.88, then settle.
- **Parts change as the same object.** Eyes squint by scaling the same two shapes. Nothing is swapped for a second drawing while it is in view; a swap happens only on a frame where the part is edge-on or covered.
- **Impact marks are switched, never faded.** A mark appears on the frame of the hit with `steps(1, end)`, scales 0.2 to 1.35 in 7 frames, 0.9 at 15, 1 at 22, holds to 70 and is gone by 82. Marks live in a `burst` layer and are never in the still.
- **Then hold.** After the action nothing moves. The hold is where the sticker is read, and filling it with an idle wobble is the commonest way to cheapen one.

### Two homes, two endings

| Home | Play | Ending | Idle |
| --- | --- | --- | --- |
| Chat pack | a loop of 150 frames (2.5s) at 60 fps; the range is 123 to 180 frames | action in the first half, a hold, and when the sticker entered with a pop it pops back out over the last 12 frames (1.06 at 7 frames from the end, 0.2 on the last) so the loop restarts on its entrance | none |
| Page or product | once: `animation: <name> 2.5s <curve> 1 both` | the last keyframe is the rested still | the page adds one at 2.6s |

- **The loop's hold is at least 20 frames,** the shortest in the ten-sticker pack this pipeline shipped; nine of its ten hold 36 or more.
- **A page idles a sticker only after its story has landed:** at 2.6s, 100ms after the 2.5s story. Three idles, dealt out by position so neighbours never move in step: a 7px rise with a 2 degree lean over 4.6s, a 3.5 degree rock about `50% 88%` over 5.4s, a 1.05 breathe over 4s, on a sticker shown 72 to 96px wide. `examples/idle.css` is the whole of it.
- **Where eight or more stickers show at once, serve the still twin** and no idle. Eight loops in one view is noise, and a still costs nothing to float.
- **In a grid of tiles, one sticker, played once.** It plays as the grid enters view, 80 to 120ms after the tile before it, then rests.

## The still

- **The rested still is the sticker.** It is the static master, the poster, the PNG, the tray icon and the reduced-motion frame, and most people see only it.
- **It is the frame after the action lands:** never the opening, never mid-squash, never with a mark half grown. Cover the motion and ask what the still says. If it cannot answer, the still is wrong, whatever the motion does.
- **Reduced motion is inside the file:** `@media (prefers-reduced-motion: reduce)` sets `animation: none` on every moving group, and the base state of every group is the rested pose. A mark layer rests at `opacity: 0`.
- **Every animated sticker has a still twin** with the die-cut, as a file of its own.

## Check

Run `node scripts/sticker-check.mjs <folder> --gate`, then render the set at 400, 160 and 64 px on three grounds and walk [verify](verify.md).

## Sources

- A ten-sticker chat pack and a fourteen-sticker page set, both built by this skill's author with this pipeline: the outline, the die-cut numbers, the pop and settle keys, the impact-mark keys, the loop and story lengths, the idle values, and the measured occupancy and centring.
- Benji Taylor, Stageshow (MIT, github.com/benjitaylor/skills): restraint, the silhouette before the detail, every motion with a cause, one place leading, the held result, the poster as the frame most people see, no decoration without a job.
- Emil Kowalski, public writing and open-source skills (MIT, github.com/emilkowalski/skills): only `transform` and `opacity` move; `transform-origin` set on purpose; reduced motion keeps the result.
