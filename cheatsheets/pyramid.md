# Pyramid Cheatsheet

| Problem                                         | Solution                                                                    |
| ----------------------------------------------- | --------------------------------------------------------------------------- |
| The agent keeps making the same mistake         | Place it at the highest layer that holds it: codebase, static, verification |
| Not sure it is a pattern yet                    | A class counts once it has happened twice                                   |
| "Never import X from Y" in AGENTS.md            | Two folders and an import ban; delete the line                              |
| An API agents keep misusing                     | Fence it into one file behind a replacement; ban it elsewhere               |
| Lint error says only "not allowed"              | Name the file, type, function or command to use instead                     |
| New rule turns the whole repo red               | Ratchet: fail only on additions, list the old cases to burn down            |
| "CI is green" as proof                          | Replay the past mistake and paste the check failing on it                   |
| A comment explaining a workaround               | Ban comments; encode the constraint as a type, test or lint                 |
| "It works" with nobody having run it            | A verification skill with a feature map and a CLI                           |
| A bug only a bad ordering reaches               | A TLA+ model checked against the version with the bug                       |
| Rules file keeps growing                        | A rule table: every rule paired with its enforcer, or `judgment`            |
| Structural fix and the old instruction both kept | Delete the instruction; `Prose: deleted`                                   |
| Reviewer catches the same thing again           | Move it up the pyramid; review only feeds it                                |
| "Let's automate it"                             | Only after the inner loop verifies itself: the five readiness questions     |
