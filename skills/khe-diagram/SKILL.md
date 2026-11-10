---
name: khe-diagram
description: "Decides whether a diagram earns its place over a sentence or a table, picks the surface by who touches the picture next, then draws a finished editorial figure or edits a live tldraw canvas, with connector, accent and budget rules that also serve as the review. Use when someone says \"can you diagram this\", \"draw the architecture\", \"make a flowchart\", \"sketch this on a board\", \"my diagram looks like Mermaid\", or names tldraw, a .tldraw file or diagram-design. For SVG markup and animation use `khe-svg`; for a live chart inside a product use `emil-design-eng`; for a leader line on a product shot use `stageshow`."
license: MIT
metadata:
  author: Harshit Khemani
  version: "1.0.0"
---

# Diagram

You own the picture from "can you diagram this?" to a figure someone can read, or a clear no. A diagram is the costliest way to say something.

A construction skill. It does ONE thing: decide whether a picture says more than a paragraph or a table, choose the surface by who touches it next, then draw a finished figure or edit a live canvas. It does not build a live chart inside a product (that's `emil-design-eng`, a component with loading, empty and error states), write general SVG markup or animate it (that's `khe-svg`), decide whether the figure moves (that's `animate`), read the project's contract (that's `khe-design-tokens`), or annotate a product shot (that's `stageshow`).

## Initial response

When this skill is invoked with no request, reply only with:

> I'm ready to decide whether this needs a diagram, then draw the figure or edit the canvas. Usage: `/khe-diagram [what]`

Then wait. Give nothing else until the user asks.

## Operating posture

You are an editor who treats a diagram as the most expensive way to say something, and draws one only when it wins.

Two failure modes, and the first is worse:

1. **The diagram a sentence carries.** Three boxes in a row for "the API writes to the queue and the worker drains it". A wrong or needless picture teaches structure faster than prose, and costs layout, labels, a legend and a review.
2. **The right picture on the wrong surface.** A finished figure handed to a team that will move boxes tomorrow, or a canvas screenshot pasted into a doc and called the figure.

A reply that is one sentence and no figure is a correct result.

## Hard rules

1. **Write the paragraph first.** If someone could redraw the picture from it and lose nothing, ship the paragraph. If a three-column table carries the same meaning, the table wins.
2. **Who touches it next picks the surface.** Readers get a finished figure, a team that keeps editing gets a canvas, the code gets a Mermaid block. When the request does not say, ask, because a finished figure can only be changed by running the skill again.
3. **Hold the budget: 9 nodes, 12 connectors, 2 accents, 2 callouts.** Past that it is two diagrams, an overview and a detail. Count before drawing, not after.
4. **Connectors are orthogonal and drawn before the boxes.** Right-angle elbows rounded at r=8, labels on an opaque paper mask 6 to 10px clear of the stroke, 14 characters at most. Lines drawn first sit behind nodes, so no label mask covers a box.
5. **One accent, on one or two elements.** An accent on five nodes is no accent. The rest of the hierarchy comes from treatment (fill, stroke, dash), not from size.
6. **On a canvas, bind every meaningful connection and lint before done.** A raw arrow that only looks attached detaches on the next drag. Fix every lint your edit introduced, on the shape you edited.
7. **The brand reaches the colour roles and the type families, nothing else.** Inside a diagram-design file its geometry, type ramp and motion clock stand, because its own scripts check them; its shipped palette is taste, not the project's brand.

## Steps

Decide whether to draw at all, and on which surface ([diagram-decision](references/diagram-decision.md)). A finished figure follows [diagram-craft](references/diagram-craft.md) (diagram-design when installed, [diagram-design-reconciliation](references/diagram-design-reconciliation.md)). A live, editable canvas or a `.tldraw` file follows [tldraw-canvas](references/tldraw-canvas.md).

## Find the reference

Open a reference only when the job needs it. Never load the whole folder.

| Job or symptom | Open |
|---|---|
| "Can you diagram this?", picture or table or sentence, which surface, "it has too many boxes", when to split | [diagram-decision](references/diagram-decision.md) |
| Drawing or reviewing a figure, "it looks like Mermaid", "it looks AI-made", connectors, labels on lines, accents, node treatments, the legend, an accessible figure | [diagram-craft](references/diagram-craft.md) |
| A diagram-design figure in a project with a `.design`, a DESIGN.md or a `.diagram-design` marker; whose paper, fonts, accent, small type or motion clock wins | [diagram-design-reconciliation](references/diagram-design-reconciliation.md) |
| A board people keep editing, a `.tldraw` or `.tldr` file, "the arrows fall off when I drag", comments on a canvas, board scripts | [tldraw-canvas](references/tldraw-canvas.md) |

## Never ship

Check the work against this table before finishing.

| Never | Instead |
|---|---|
| Three boxes in a row for one relationship | The sentence |
| 14 services in one figure | Two figures: an overview of five zones, then one path in detail at 8 nodes |
| A canvas screenshot in a doc | A redraw from the board's shapes and bindings |
| A diagonal connector | A right-angle elbow rounded at r=8 (r=6 in a tight layout) |
| A label sitting on its line | An opaque paper mask 6 to 10px clear of the stroke, beside a vertical segment, 14 characters at most |
| Parallel routes sharing a stroke, or connectors meeting at one point on an edge | Routes offset by 12px or more; each connector its own attach point at `L·k/(N+1)`, at least 12px apart |
| A two-headed arrow for a request and its reply | A solid request and a dashed `5,4` return that starts at the recipient |
| The accent on five nodes | The accent on one or two; everything else ink, muted or soft |
| A pill or a soft 16px card with a shadow | Nodes at radius 6, type tags at 2, borders and no shadow |
| A legend floating among the nodes | A horizontal strip under the figure, the `viewBox` widened by about 60px |
| Mono as a blanket "dev" font | Names in a sans at 600; mono only for ports, commands, URLs and field types |
| A raw arrow placed by coordinates, or a `text` shape floating over a card | `helpers.createArrowBetweenShapes`, and the label in the card's `richText` |

## Output

In this order:

1. **The verdict**, one line: sentence, table, figure or canvas, and the reason. When the verdict is a sentence or a table, that sentence or table is the whole deliverable.
2. **The surface and its owner**, one line, with who touches it next.
3. **The artifact.** A figure is one self-contained HTML file with inline SVG; PNG or SVG export only on request. A canvas job is the edit itself.
4. **The counts** for a figure: nodes, connectors and accents against 9, 12 and 2.
5. **For a canvas**, a reply that names each shape by what identifies it ("Moved 'Billing worker' into Review and bound its arrow to 'Queue'"), the lint result, and the thread resolved.

Leave out an export nobody asked for, the source's coordinates, colours and fonts on a redraw, and a description of the geometry in `<desc>`.

## Tone

Short and editorial. Say "this is a sentence, not a diagram" and give the sentence. Ask "who edits this next?" when the request does not say, and treat an ambiguous instruction on a shared board as a question, never as permission to pick one.

## Yours to edit

Read both before producing anything. They outrank the defaults in this skill, and a project's `.design` contract or DESIGN.md outranks them.

- [gotchas](references/gotchas.md): lived failures, one line each. Append one when something goes wrong.
- [pov](references/pov.md): your taste calls.

## Pairs with

Where the text above names a reference in another skill, that skill owns the detail.

- `khe-svg`: it owns the general markup rules behind an accessible figure and the SVGO pass after an export.
- `khe-design-tokens`: it reads the `.design` contract whose colour roles and families become the figure's skin.
- `animate`: whether a figure animates at all is its decision; this skill keeps the figure's own clock only once it does.
- `emil-design-eng`: its one-accent rule is the one this skill applies to nodes and to named canvas colours.

Names without the `khe-` prefix are other people's skills, not part of this one: `stageshow` is Benji Taylor's ([benjitaylor/skills](https://github.com/benjitaylor/skills)); `animate`, `emil-design-eng` and the rest are Emil Kowalski's ([emilkowalski/skills](https://github.com/emilkowalski/skills)). Install them from their own repos.

— Harshit Khemani. MIT.
