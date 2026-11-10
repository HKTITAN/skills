# khe-diagram

Whether to draw at all, then a finished figure or a live tldraw canvas.

```bash
npx skills add HKTITAN/skills --skill khe-diagram
```

## What it does

- Tests the request against a sentence and a table before any box is drawn.
- Picks the surface by who touches the picture next: a finished figure, a tldraw canvas, a Mermaid block or FigJam.
- Draws figures inside a budget of 9 nodes, 12 connectors and 2 accents, with orthogonal connectors and masked labels.
- Edits tldraw boards with bound arrows, frames and lints, and replies in the comment thread it acted on.

## When to use it

Use it when you are about to ask for an architecture, flow, sequence, state, timeline or org diagram, when a board needs building or tidying in tldraw, or when a figure you already have reads as auto-generated. It will tell you when a sentence or a table does the job better, and it will ask who edits the picture next when you have not said.

## Invoke with

`/khe-diagram [what]`

Or describe the problem in your own words. The skill's description carries the triggers, so no special wording is needed.

## Before and after

Before: 14 identical rounded boxes on a dark ground, diagonal arrows with labels sitting on the lines, five accent colours, a legend floating in the middle.

After: two figures, five zones then one path at 8 nodes, right-angle connectors with labels on masks 8px clear of the stroke, the accent on two elements, the legend in a strip underneath.

## Example prompts

- Can you diagram how our API, the queue and the worker connect?
- I have a tldraw board for the launch plan and the arrows fall off whenever someone drags a card.
- This architecture diagram looks like it came straight out of Mermaid. Can you make it look designed for the README?

## Pairs with

- `khe-svg`: it owns the general markup rules behind an accessible figure and the SVGO pass after an export.
- `khe-design-tokens`: it reads the `.design` contract whose colour roles and families become the figure's skin.
- `animate`: whether a figure animates at all is its decision; this skill keeps the figure's own clock only once it does.
- `emil-design-eng`: its one-accent rule is the one this skill applies to nodes and to named canvas colours.

## What is inside

- [SKILL.md](SKILL.md): the scope, the rules and the steps the agent follows.
- `references/`: 4 references the agent opens one at a time, plus `gotchas.md` and `pov.md`, which are yours to edit.
- [LICENSE](LICENSE): MIT.
