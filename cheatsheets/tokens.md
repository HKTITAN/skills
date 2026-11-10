# Tokens Cheatsheet

| Problem                                    | Solution                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| Corner is 6px when the scale is 4 / 8 / 16 | A step on the scale, such as `var(--rounded-lg)`                                |
| Hex in the code equals a token             | The token: `background: var(--surface)`                                         |
| CSS drifted from the contract              | Refresh the CSS from the contract: tokens outrank `css_vars`                    |
| The token I need does not exist            | Follow `policy.if_missing`; under DESIGN.md, a proposal comment                 |
| `var(--radius-xl)` resolves to nothing     | Bind the last step of the scale, or propose the token; never declare it locally |
| Agent invented `variant="outline"`         | A listed variant, and "Nothing else exists" closing the set in the docs         |
| `.design` and DESIGN.md disagree           | The `.design` wins; DESIGN.md says it is rationale                              |
| Contract has a changelog block             | Edit in place and bump `version`: git is the audit trail                        |
| Docs say "use sparingly"                   | The number: "Body 16px, captions 14px, never below 12px"                        |
| Product makes a sound nobody asked for     | No `tokens.sound` in the contract means silent                                  |
| DESIGN.md has a field you do not recognize | Pass it through unchanged: the spec is `version: alpha`                         |
| Gate rejects the `.design` file            | `schema: design.v1`, `name`, `version` and `agent.instructions`                 |
| Cannot find the DESIGN.md                  | Check the root, `docs/`, `design/` and `.design/`                               |
| Half the tokens report as unused           | Run the gate on the folder, not on one file                                     |
