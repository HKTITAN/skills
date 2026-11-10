# Explain a system

**You own this from "can you diagram this?" to a picture someone can read, or a clear no.** A diagram is the costliest way to say something.

Every step runs the [loop](../references/loop.md): the owning skill's closest gold first, its gate until it passes, and the exit checked from evidence before the next step starts. A gate that is missing or says `inconclusive` is reported, never counted as a pass.

1. **Decide whether to draw** with `khe-diagram`. A sentence or a table often wins. Exit: a yes with the reason, or a no with what replaces it. Gate: none, a decision; a no ends the playbook here.
2. **Pick the surface** with `khe-diagram`, by who touches the picture next: a finished figure, or a live canvas someone will keep editing. Exit: the surface, and the name of who edits it next. Gate: none, a decision.
3. **Draw it** with `khe-diagram`. Delete first, one or two accents, connectors before boxes. Exit: the figure exists, and you can list what you deleted. Gate: `khe-diagram/scripts/diagram-check.mjs`.
4. **Skin it from the contract** with `khe-design-tokens` when the project has one. Exit: every color in the figure resolves to a token, or "no contract" is stated. Gate: `khe-design-tokens/scripts/token-check.mjs` when a contract exists.
5. **Review it** with `khe-diagram`, by its connector and budget rules. Exit: every rule answered yes or no from the rendered figure, never from the source. Gate: `khe-diagram/scripts/diagram-check.mjs`.

**Reply:** the file or the board, what the figure leaves out on purpose, the assumption you made about who edits it next, the last line of each gate, and what you could not verify.
