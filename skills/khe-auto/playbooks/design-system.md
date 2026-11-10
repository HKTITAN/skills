# Design system

**You own this from scattered values to a contract an agent can follow.** A system nobody wrote down gets reinvented on every prompt.

1. **Inventory what exists.** Read the code for the colors, sizes, radii and curves already in use. Never invent a parallel system.
2. **Color and surface** with `khe-ui`, color-and-surface lane. Exit: scales with a role per step.
3. **Type** with `khe-ui`, typography lane. Exit: a closed scale named by role.
4. **Capture it** with `khe-design-tokens`, as a `.design` file or a DESIGN.md. Exit: every value in the UI resolves to a token.
5. **Verify by prompting.** Ask an agent to build one new component from the contract alone. Where it invents a value, the contract is missing a rule.

**Reply:** where the contract lives, what it covers, the values that had no token, and what the test prompt got wrong.
