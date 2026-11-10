---
title: verify
summary: The last pass on a figure or a canvas. The gate commands, the yes/no questions answered from a render, the gate's lines, a table from symptom to fix, what the gate cannot see, and the FIGURE.md handover template.
tags: [diagram, verify, gate, handover]
---

# Verify

The last pass. Every answer comes from something you looked at: the gate's output, a render of the figure at the width it ships at, the same render at 400%, or the board itself. Never answer from the markup you remember writing. Fix the largest visible fault first, run the gate again, return to the top, and repeat until every answer is yes. The rules behind the questions are in [diagram-decision](diagram-decision.md), [diagram-craft](diagram-craft.md), [diagram-design-reconciliation](diagram-design-reconciliation.md) and [tldraw-canvas](tldraw-canvas.md).

## Gate

```sh
node scripts/diagram-check.mjs <figure.svg or figure.html or a folder> --gate
node scripts/diagram-check.mjs <figure> --gate --report figure-check.json
node scripts/diagram-check.mjs --self-test
```

- Does `--gate` end with the line `diagram check passed`? That line prints only when every never-intentional line is at 0. It exits 1 with the counts when one is not, and exits 2 with `inconclusive` when it found no figure it could read. An inconclusive run is never a pass.
- Did you read every candidate line it printed and decide each one from the render?
- Did you paste the gate's last line into FIGURE.md?

Passing is necessary, not sufficient. The gate reads markup. It finds structure by class, so a figure it is to check carries these names:

| Thing | How the gate finds it |
|---|---|
| Node | `class="node"` on a `<g>` or a `<rect>`. With none in the file, every plain `<rect>` counts as a node and the run says so |
| Connector | `class="edge"` on a `<path>`, `<line>` or `<polyline>`, or any of those with a marker |
| Connector label | `<text class="label">`, with its `<rect class="mask">` earlier in the file |
| Type role | `class="name"`, `class="sub"` or `class="label"` on the `<text>` |
| Legend, callout | `class="legend"`, `class="callout"` |
| Zone, trust boundary, type tag | `class="zone"`, `class="boundary"`, `class="tag"` |
| HTTP or external call | `class="link"` on the connector; it is left out of the accent count |
| Slide ramp | `data-preset="slide"` on the root `<svg>` |
| Faithful import | `data-import="faithful"` on the root `<svg>`; the node budget becomes 24 |

The files in `examples/` use every one of these names. Copy their structure.

## Should it exist (first, because nothing else matters if this is no)

- Did you write the paragraph before drawing, and does a reader lose something when the figure is replaced by it?
- Does a three-column table fail to carry the same meaning?
- Is the content flow, containment, order in time, dependency or position on two axes, and not a list, one relationship or an attribute-only before and after?
- Is the surface the one the next person to touch it needs: a finished figure for readers, a canvas for a team that keeps editing, a Mermaid block for the code?
- Is the figure a redraw from structure, and not a screenshot of a canvas or an auto-layout export?

## Structure and budget

- Count from the render: 9 nodes or fewer, 12 connectors or fewer, 2 callouts or fewer?
- Cover each node in turn. Does the figure lose an idea every time?
- Cover each connector in turn. Does the reader lose information the layout does not already show?
- Is there a pair of nodes that always travel together and could be one?
- Past the budget, is it two figures, an overview and a detail, and not one figure made smaller?

## Connectors and labels (at 400%)

- Is every run horizontal or vertical, and every turn an elbow rounded at r=8, or r=6 in a tight layout?
- Does every connector end at its own attach point, 12px or more from the next one on the same edge?
- Are parallel routes 12px or more apart, with no two strokes sharing a pixel?
- Does any line pass behind a box it does not end at?
- Does every label sit on an opaque paper mask, 6 to 10px clear of its stroke, 14 characters or fewer?
- Is a request solid and its reply a separate dashed `5,4` line that starts at the recipient?
- Does a fan-out draw its shared trunk once and branch from a junction?
- Are all connectors drawn before all nodes, so no stroke or mask paints over a box?

## Signal, type and place

- What does the eye land on first, and is it the one or two things the reader must see?
- Is the accent one hue on 1 or 2 elements, and everything else ink, muted or soft?
- Do service, store, external and optional nodes differ by fill, stroke and dash, at one size?
- Nodes at radius 6, type tags at 2, borders and no shadow?
- Names in a sans at 600 and 12px, sublabels at 9px, connector labels at 8px, at the viewBox width? On a slide: 16, 12, 12?
- Mono only on ports, commands, URLs and field types?
- Is the legend a horizontal strip under the figure, naming every line style and color in use?
- Does the paper match the page surface exactly, with the figure set on the page it ships on?
- In a project with a contract, do the nine color roles and the families come from it, with none of `#f5f5f5`, `#2d3142` or `#eb6c36` left in the file?
- Is the shown width at least the viewBox width, or inside an `overflow-x: auto` wrapper with `min-width` at the viewBox width?
- `role="img"`, a first-child `<title>`, a one-sentence `<desc>` about the content, both ids prefixed with the figure's slug?

## A live canvas (the gate cannot read one)

Answer these on a copy of the board, from the board.

- Drag every card you touched 200px and undo. Did every arrow stay attached and every word move with its card?
- Does `helpers.getLints()` report nothing your edit introduced?
- Is every meaningful connection made with `helpers.createArrowBetweenShapes`, and no arrow placed by coordinates?
- Is every card's label in its own `richText`, with `text` shapes only for words that stand alone?
- Is each group a frame named the way the team says it, and not a rectangle drawn behind cards?
- Is one named color on the focal shapes and every other shape neutral?
- Did you reply in the thread you acted on, name each shape by what identifies it, and resolve the thread?
- Did you leave every shape and thread that was not yours where it was?
- Did you ask before writing to a board whose scripts you did not start?

## Lines that are never intentional

Not candidates for judgment: fix the cause and run the gate again. Clearing a line by deleting the class it reads, renaming a node so it is not counted, or moving a connector out of the `edge` class is a bug, and the fresh eye judges every line you call intentional again.

| Line | What it means |
|---|---|
| `no-title:` | The root `<svg>` lacks `role="img"`, a first-child `<title>`, a `<desc>`, or an `aria-labelledby` that names them |
| `bare-id:` | The `<title>` or `<desc>` id is a bare `title` or `desc`, which collides when two figures are inlined |
| `node-budget:` | More than 9 nodes (24 with `data-import="faithful"`) |
| `connector-budget:` | More than 12 connectors |
| `callout-budget:` | More than 2 callouts |
| `accent-colors:` | More than 2 chromatic hues anywhere in the figure |
| `accent-spread:` | One accent hue on more than 2 nodes, connectors, zones or callouts |
| `diagonal:` | A connector segment that is neither horizontal nor vertical, or a curved route |
| `sharp-elbow:` | A right-angle turn with no rounding |
| `edge-over-node:` | A connector that comes after a node in the file, so it paints on top of the boxes |
| `line-through-node:` | A connector passing through a box it does not end at |
| `shared-attach:` | Two connectors meeting one node edge less than 12px apart |
| `stacked-strokes:` | Parallel connector runs less than 12px apart |
| `two-headed:` | One connector with an arrowhead at both ends |
| `label-on-line:` | A connector label with no mask behind it, or a mask that sits on a stroke |
| `small-text:` | A name under 12px, a sublabel under 9px, a connector label or any other text under 8px (16, 12, 12 on a slide) |
| `off-grid:` | A node or zone whose x, y, width or height does not divide by 4 |
| `node-radius:` | A node whose corner radius is not 6, or a type tag whose radius is not 2 |
| `shadow:` | A `filter` on anything in the figure |
| `missing-legend:` | Connectors differ by color or dash and the figure has no legend |
| `floating-legend:` | The legend starts above the bottom of the nodes |
| `mono-label:` | A monospace face on a node name, or on plain words anywhere |

## Candidate lines

Reported for judgment. Decide each from the render, and write the decision in FIGURE.md. `--strict` fails the run on these as well.

| Line | What it means | When it stands |
|---|---|---|
| `sentence-figure:` | 3 nodes or fewer and 2 connectors or fewer | Never when the paragraph test passes; ship the sentence |
| `at-budget:` | Exactly 9 nodes or exactly 12 connectors | When all four deletion tests fail on every element |
| `long-label:` | A connector label over 14 characters | Never in a new figure; in a redraw, shorten or move the words to a sublabel |
| `label-clearance:` | A mask closer than 6px to a stroke or more than 10px from every stroke | When the label belongs to a curved or diagonal run the gate has already named |
| `elbow-radius:` | A rounded elbow whose radius is not 8 or 6 | Never; the two radii are the rule |
| `geometry-desc:` | `<desc>` runs past one sentence or says box, arrow, left, right | When the content itself is about position, such as a floor plan |
| `shipped-palette:` | `#f5f5f5`, `#2d3142` or `#eb6c36` is in the file | Only in a project with no contract, where diagram-design's skin is the default |
| `faithful-import:` | `data-import="faithful"` raised the node budget to 24 | Only for an import the reader asked to keep whole, laid out in zones |

## What you see, what you do

| You see | You do |
|---|---|
| Three boxes in a row for one relationship (`sentence-figure:`) | Delete the figure and ship the sentence |
| More than 9 nodes (`node-budget:`) | Two figures: an overview of zones, then one path in detail |
| A node or a line nobody would miss | Delete it, or merge the node with the one it always travels with |
| A connector at an angle or with a square corner (`diagonal:`, `sharp-elbow:`) | A horizontal run, a quarter curve at r=8, a vertical run |
| Two arrows landing on one point (`shared-attach:`) | Give each its own point at `L·k/(N+1)` along the edge, 12px or more apart; for a fan-in, one junction and one delivery |
| Two strokes running together (`stacked-strokes:`) | Offset the routes by 12px or more, or draw the shared trunk once |
| A line under a box (`line-through-node:`) | Reroute it around the box; never rely on the box to hide it |
| A stroke on top of a box (`edge-over-node:`) | Move every connector before the first node in the file |
| A label on its line (`label-on-line:`) | An opaque paper mask beside the run, 6 to 10px clear of the stroke |
| One arrow with two heads (`two-headed:`) | A solid request, and a dashed `5,4` reply that starts at the recipient |
| The accent on a third thing, or a third hue (`accent-spread:`, `accent-colors:`) | Pick the one or two the reader must see first; return the rest to ink, muted or soft and carry the other distinctions by fill, stroke and dash |
| Every box identical | Give service, store, external and focal nodes their own treatment at one size |
| Pills, soft cards or shadows (`node-radius:`, `shadow:`) | Radius 6, a border, no filter |
| A legend among the nodes (`floating-legend:`) | A horizontal strip under the figure; widen the viewBox by about 60px |
| Everything in mono (`mono-label:`) | Names in a sans at 600; mono only on ports, commands, URLs and field types |
| Type you squint at (`small-text:`) | Restore the ramp and delete content until it fits; never shrink the type |
| A gate line you think is intentional | Look at the render again; if it still stands, say so in FIGURE.md with the line and the reason; never clear it by renaming a class |
| Ten gate runs, gate green, render unchanged | Stop. Fresh eye ([review](review.md)) |

## Settled values

The references, the gold examples and the gate state one value for each decision; to overrule one, write it in [pov](pov.md).

## Not checked by the gate

- Whether the figure should exist, and whether the surface is right. The paragraph test and the table test are yours.
- Whether the accent is on the right things, and whether any node, connector or label could go.
- Text that overflows its box, and anything about the rendered pixels. Look at the render.
- The attach-point formula `L·k/(N+1)`. The gate measures only the 12px minimum.
- Whether a fan-out shares one trunk, and whether a reply starts at the recipient.
- Whether the paper matches the page it sits on.
- Dark-mode overrides, `@media` rules, gradients, and positions under a transform other than `translate`. The run lists what it skipped.
- Motion. Whether a figure moves is decided before it is drawn; a `step` figure is checked by clicking through it.
- A live tldraw canvas, a `.tldraw` file, a Mermaid block and FigJam. Use the canvas questions above.
- A "no diagram" answer. The gate lists a `.md` file as not checked; a person reads it against the first section.

## Hand over

Write `FIGURE.md` beside the figure. For a "no diagram" answer the verdict line is the whole file.

````md
# Figure: <name>

Verdict: <sentence | table | figure | canvas>, because <reason>
Surface: <finished figure | tldraw canvas | Mermaid block | FigJam>, next touched by <who>
Gold: <examples/file> (what you kept, what you changed)
Counts: <n>/9 nodes, <n>/12 connectors, <n>/2 callouts, accent on <the 1 or 2 elements>
Skin: <contract path, profile, or "diagram-design default, no contract">
Looked at: <render at the shown width>, <render at 400%>, <the page it sits on>
Gate: <the last line of diagram-check.mjs --gate, pasted>
Lines: <each candidate or disputed line> -> <what the render shows> -> <fix, or why it stands>
Review: <the reviewer's list> -> <your response>
Assumptions:
Unresolved:
Not checked:
````

- Did you say what you did not look at?
