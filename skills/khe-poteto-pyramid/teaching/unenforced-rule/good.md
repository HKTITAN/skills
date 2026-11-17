# Pinwheel: rules for agents

| Rule | Enforced by |
|---|---|
| Renderer never imports main | `npm run lint:deps` |
| No timers in product code | `npm run lint` (`no-restricted-syntax`) |
| Build what was asked, finished | judgment |

## Judgment

- Build what was asked, finished: empty, loading and error states included. (judgment)
