<!-- Gold: a finished handover. Learn: it pastes the gate's last line, maps every token to the line it lands on, reports the literals that stayed with their reasons, and says what nobody checked. -->

# Tokens: plan card and button

Contract: `harbor.design`, version 1.4.0; no DESIGN.md beside it
Gold: `examples/design-file` (this folder is the gold; nothing was copied in)
Checked: `examples/design-file`, the contract and 5 source files
Gate: `token-check passed`

## Token map

| Token | Lands in | As |
|---|---|---|
| `color.surface` | `plan-card.css:4`, `button.css:19` | `var(--surface)` |
| `color.ink` | `plan-card.css:5`, `button.css:20` | `var(--ink)` |
| `color.line` | `plan-card.css:6`, `button.css:7` | `var(--line)` |
| `color.accent` | `button.css:14`, `button.css:24` | `var(--accent)` |
| `color.danger` | `button.css:30` | `var(--danger)` |
| `radius.lg` | `plan-card.css:7` | `var(--radius-lg)` |
| `radius.md` | `button.css:8` | `var(--radius-md)` |
| `radius.sm` | `plan-card.css:16` | `var(--radius-sm)` |
| `spacing.2`, `spacing.4` | `button.css:9`, `plan-card.css:8` | `var(--space-2)`, `var(--space-4)` |
| `typography.body` | `plan-card.css:9` | `var(--font-body)`, `var(--text-body)`, `var(--leading-body)` |
| `typography.caption` | `button.css:6`, `plan-card.css:18` | `var(--text-caption)` |
| `motion.duration.base` | `button.css:10` | `var(--duration-base)` |
| `components.button.variants` | `Button.tsx:7` | the `variant` union type |

## Drift

none. `tokens.css` mirrors all 15 values of `harbor.design`.

## Lines

The gate printed no never-intentional line and no candidate.

## Literals left in place

- `1px` at `button.css:7`, `plan-card.css:6` and `plan-card.css:15`: a hairline border. The contract has no border-width token; proposed as `tokens.border.hairline`.
- `2px` at `button.css:14` and `button.css:15`: the focus ring's width and offset. The contract has no focus token; proposed as `tokens.focus.width` and `tokens.focus.offset`.

Review: nothing. Files read: all six, with `harbor.design` open beside each.
Assumptions: the contract sets a 400ms base duration; this skill would pick under 300ms; using 400ms.
Unresolved: the two proposals above wait for a yes. Until then the literals stand.
Not checked: a render in a browser; contrast of `surface` on `accent` and on `danger`; the `voice` rules against the button labels; dark mode, which the contract does not define.
