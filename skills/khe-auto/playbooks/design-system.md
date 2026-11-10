# Design system

**You own this from scattered values to a contract an agent can follow.** A system nobody wrote down gets reinvented on every prompt.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Inventory what exists** with `khe-design-tokens`. Read the code for the colors, sizes, radii and curves already in use. Never invent a parallel system. Exit: a list of every value in use, each with the file it came from. Gate: none, an inventory; the list is the evidence.
2. **Color and surface** with `khe-ui`, color-and-surface lane. Exit: scales with a role per step. Gate: `khe-ui/scripts/ui-check.mjs`.
3. **Type** with `khe-ui`, typography lane. Exit: a closed scale named by role. Gate: `khe-ui/scripts/ui-check.mjs`.
4. **Capture it** with `khe-design-tokens`, as a `.design` file or a DESIGN.md. Exit: every value in the UI resolves to a token. Gate: `khe-design-tokens/scripts/token-check.mjs`.
5. **Verify by prompting** with `khe-design-tokens`. Ask a fresh agent to build one new component from the contract alone. Where it invents a value, the contract is missing a rule: add the rule to the contract and run the prompt again, never patch the component. Exit: the component, and a list of every value it invented. Gate: `khe-design-tokens/scripts/token-check.mjs` on the component.

**Reply:** where the contract lives, what it covers, the values that had no token, what the test prompt got wrong, the last line of each gate, and what you could not verify.
