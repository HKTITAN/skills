# khe-diagram

Whether to draw at all, then a finished figure or a live tldraw canvas.

```bash
npx skills add HKTITAN/skills --skill khe-diagram
```

## What it does

- Tests the request against a sentence and a table before any box is drawn.
- Picks the surface by who touches the picture next: a finished figure, a tldraw canvas, a Mermaid block or FigJam.
- Draws figures inside a budget of 9 nodes, 12 connectors, 2 callouts and one accent on 2 elements at most, with orthogonal connectors and masked labels.
- Edits tldraw boards with bound arrows, frames and lints, and replies in the comment thread it acted on.
- Checks a finished figure with a gate script that names every fault as a line, then walks a checklist from a render and hands over a `FIGURE.md`.

## When to use it

Use it when you are about to ask for an architecture, flow, sequence, state, timeline or org diagram, when a board needs building or tidying in tldraw, or when a figure you already have reads as auto-generated. It will tell you when a sentence or a table does the job better, and it will ask who edits the picture next when you have not said.

## Invoke with

`/khe-diagram [what]`

Or describe the problem in your own words. The skill's description carries the triggers, so no special wording is needed.

## Before and after

Before: 14 identical rounded boxes on a dark ground, diagonal arrows with labels sitting on the lines, five accent colors, a legend floating in the middle.

After: two figures, five zones then one path at 8 nodes, right-angle connectors with labels on masks 8px clear of the stroke, the accent on two elements, the legend in a strip underneath.

## Example prompts

- Can you diagram how our API, the queue and the worker connect?
- I have a tldraw board for the launch plan and the arrows fall off whenever someone drags a card.
- This architecture diagram looks like it came straight out of Mermaid. Can you make it look designed for the README?

## Pairs with

- `khe-auto`: it runs this skill's loop and names this skill's gate at each step.
- `khe-svg`: it owns the general markup rules behind an accessible figure and the SVGO pass after an export.
- `khe-design-tokens`: it reads the `.design` contract whose color roles and families become the figure's skin.
- `khe-ui`: whether a figure animates at all is its decision; this skill keeps the figure's own clock only once it does.
- `khe-ui`: its one-accent rule is the one this skill applies to nodes and to named canvas colors.

## Verify

```bash
node scripts/diagram-check.mjs path/to/figure.svg --gate
node scripts/diagram-check.mjs --self-test
```

The gate reads an `.svg`, or SVG inline in `.html`, and prints one line per fault: `diagonal:`, `edge-over-node:`, `accent-spread:`, `off-grid:` and 26 more. It ends `diagram check passed` only when all 22 never-intentional lines are at 0, exits 1 when one is not, and exits 2 with `inconclusive` when it found no figure to read. `--self-test` runs it against the skill's own gold examples and teaching pairs.

What it proves: the budget of 9 nodes, 12 connectors and 2 callouts is held, connectors are orthogonal, rounded and drawn before the boxes, labels sit on masks, the accent is one hue on 2 elements at most, type holds the ramp, nodes sit on the 4px grid, the legend is present and under the figure, and the figure has an accessible title.

What it does not prove: that the figure should exist, that the accent is on the right thing, that text fits its box, or anything about a live tldraw canvas. Those are the yes/no questions in `references/verify.md`, answered from a render or from the board. Passing is necessary, not sufficient.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow with its exits, the rules and the reference map.
- `references/`: 4 craft references the agent opens one at a time; `verify.md` (the last pass and the handover template), `review.md` (the brief for a fresh-eye reviewer) and `teaching.md` (the index of pairs); plus `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: 4 gold files, an architecture figure, a flow, a sequence and a "no diagram" answer. They are the bar and the starting point.
- `teaching/`: 14 bad and good pairs, one fault each, each folder named for the gate line it raises. They are also the gate's tests.
- `scripts/diagram-check.mjs`: the gate. Zero dependencies, Node 20 or later.
- [LICENSE](LICENSE): MIT.
