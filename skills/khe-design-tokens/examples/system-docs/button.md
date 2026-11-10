<!-- Gold: one design-system doc page, written from an inventory of the code. Learn: four parts in a fixed order (when and the alternative, the closed variant set with its default, one correct and one incorrect example, a flowchart), every name traced to a file and a line, and no word that leaves a decision open. -->

# Buttons

Inventory: variants from `Button.tsx:5`, sizes from `Button.tsx:6`, colors and heights from `button.css:4` and `kit.design`.

## Button

Use for actions. Navigation styled as a button is a Link. An action in a tight space is an IconButton.

Variants: `secondary` (default), `primary`, `tertiary`, `ghost`, `danger`. Nothing else exists: an unlisted variant is a bug.

Sizes: `small` 24px, `medium` 28px (default), `large` 32px. Nothing else exists.

One `primary` per view: two means the screen has no hierarchy.

A label that changes (Resolve to Resolved) changes on the same Button. Never swap in a second element: the new element drops the focus the first one held.

Colors come from semantic tokens: `--accent` on `primary`, `--danger` on `danger`. Never a primitive, never a raw value: a hex in a component is a value the next theme change misses.

Correct: `<Button variant="danger">Delete</Button>`

Incorrect: `<button className="px-3 py-1 rounded-md">Delete</button>` (a hand-built twin of Button: uneven padding, unsized text, no variant)

```text
Which variant?
├─ Does it delete or destroy?                    -> danger
├─ Is it the one action this view is about?      -> primary
├─ Does it sit in a toolbar or a dense row?      -> ghost
├─ Is it a low-weight action beside a primary?   -> tertiary
└─ Anything else                                 -> secondary
```
