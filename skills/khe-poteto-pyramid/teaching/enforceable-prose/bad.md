<!-- teaching: a bullet that bans a named API in words, where a lint could ban it -->

# Pinwheel: rules for agents

| Rule | Enforced by |
|---|---|
| Renderer never imports main | `npm run lint:deps` |
| Build what was asked, finished | judgment |

## Judgment

- Build what was asked, finished: empty, loading and error states included. (judgment)
- Never call `setTimeout` in product code to fix rendering glitches.
