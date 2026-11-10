# Landing page

**You own this from a blank page to a reviewed one.** A marketing page tolerates more expression than product UI and less default, so the deletion pass is never optional.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Check for a contract** with `khe-design-tokens`. If one exists it goes first and outranks every default below. Exit: the contract's path, or "no contract" stated. Gate: `khe-design-tokens/scripts/token-check.mjs` when a contract exists.
2. **Lay it out** with `khe-ui`, layout lane. A design per viewport, never a desktop page squeezed. Exit: the page frame holds at 390 and at 1440, seen in a capture at each width. Gate: `khe-ui/scripts/ui-check.mjs`.
3. **Set the type** with `khe-ui`, typography lane. Exit: a closed scale named by role, a measure near 65 characters. Gate: `khe-ui/scripts/ui-check.mjs`.
4. **Show the product** with `stageshow`. Frame a still first, at the size it will be seen and again at 390, before anything moves. Exit: its rehearsal gate passes. Gate: none here; `stageshow` runs its own rehearsal gate, and this step is not done until that gate passes.
5. **Explain a system, only if one needs explaining** with `khe-diagram`. Most pages need zero diagrams. Exit: a figure, or a stated no. Gate: `khe-diagram/scripts/diagram-check.mjs` when a figure was drawn.
6. **Delete the defaults** with `khe-ui`, tells lane. Subtract first, then sweep. Exit: a numbered deletion list, applied. Gate: `khe-ui/scripts/ui-check.mjs`.
7. **Review** with `khe-ui`, review lane. Exit: a verdict. Gate: `khe-ui/scripts/ui-check.mjs`.

**Reply:** the verdict, what was deleted, what each product picture shows, the last line of each gate, and what still needs a real phone.
