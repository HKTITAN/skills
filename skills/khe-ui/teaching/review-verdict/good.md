<!-- The review closes on one of three verdicts, then on what it did not see. -->

# Review: `Menu.css`

Two issues in the menu's entrance.

| Before | After | Why |
|---|---|---|
| `transition: all 200ms` (`Menu.css:8`) | `transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1), opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)` | `all` animates every property that changes, layout properties included. See [motion](../../references/motion.md). |
| `transform: scale(0)` (`Menu.css:6`) | `transform: scale(0.96); opacity: 0` | From zero the menu inflates from a point and its first frames blur. See [motion](../../references/motion.md). |

Verdict: Approve with changes (2 findings).
Not checked: dark theme, 390px, reduced motion.
