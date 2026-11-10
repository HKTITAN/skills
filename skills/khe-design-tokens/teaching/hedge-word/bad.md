<!-- bad: hedge-word. "sparingly" hands the count to whoever reads it. -->

# Buttons

## Button

Use for actions. Navigation styled as a button is a Link.

Variants: `secondary` (default), `primary` (the one action a view is about), `danger`. Nothing else exists: an unlisted variant is a bug.

Use the primary variant sparingly.

Correct: `<Button variant="danger">Delete</Button>`

Incorrect: `<button className="px-3 py-1 rounded-md">Delete</button>` (hand-built: uneven padding, unsized text)
