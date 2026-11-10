# New screen

**You own this from the request to a screen that passes review.** Structure first, surfaces second, behavior third, motion only once the static version works.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Undecided?** If nobody can say which direction is right, run `prototype` first and keep one. Never prototype a decision that is already made. Exit: one direction kept, or the decision was already made. Gate: none, `prototype` ships no gate; the kept direction is the evidence.
2. **Check for a contract** with `khe-design-tokens`. Exit: the contract's path, or "no contract" stated. Gate: `khe-design-tokens/scripts/token-check.mjs` when a contract exists.
3. **Structure** with `khe-ui`, layout lane: hierarchy, grouping, what the screen does when content grows. Exit: the screen reads correctly in grey boxes. Gate: `khe-ui/scripts/ui-check.mjs`.
4. **One material pass** with `khe-ui`, for what the screen is made of: the typography lane, the color-and-surface lane or the components lane. One, not all three. Look at the screen before choosing a second. Exit: the one lane is named and its changes are in the code. Gate: `khe-ui/scripts/ui-check.mjs`.
5. **States** with `khe-ui`, components lane: loading, empty, error, partial. They are most of the product. Exit: every data view has all its branches. Gate: `khe-ui/scripts/ui-check.mjs`.
6. **Motion, last** with `khe-ui`, motion lane. Exit: every motion names its purpose, or it is deleted. Gate: `khe-ui/scripts/ui-check.mjs`.
7. **The floor** with `khe-ui`, accessibility lane. It applies even when the screen already looks finished. Exit: every finding fixed, or listed as needing a person. Gate: `khe-ui/scripts/ui-check.mjs`.
8. **Review** with `khe-ui`, review lane. Exit: a verdict. Gate: `khe-ui/scripts/ui-check.mjs`.

Look at the screen between steps. Two passes at a time is the limit.

**Reply:** the verdict, the states that now exist, what was left out on purpose, the last line of the gate, and what you could not verify.
