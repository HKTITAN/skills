# Review: `InviteDialog`

Gold for a finished `review`. Learn one thing: every row quotes a line you can grep, gives the line to type in its place, and says why in one sentence. The review edits nothing, ranks by damage, and ends on a verdict and on what it did not see. The format is set by [review](../references/review.md).

## What was reviewed

Two files, as they stand: `InviteDialog.css` (25 lines) and `InviteDialog.tsx` (15 lines).

```css
.invite {
  position: fixed;
  inset: 0;
  margin: auto;
  opacity: 0;
  transform: scale(0);
  transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);
}

.invite[open] {
  opacity: 1;
  transform: scale(1);
}

.invite__email {
  font-size: 14px;
  outline: none;
}

@media (prefers-reduced-motion: reduce) {
  .invite {
    transform: none;
    transition: opacity 120ms;
  }
}
```

```tsx
export function InviteDialog({ onClose, onInvite }: Props) {
  return (
    <dialog className="invite" aria-labelledby="invite-title">
      <h2 id="invite-title">Invite people</h2>
      <button type="button" className="invite__close" onClick={onClose}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>
      </button>
      <form onSubmit={onInvite}>
        <label htmlFor="invite-email">Email</label>
        <input id="invite-email" className="invite__email" type="email" autoComplete="email" />
        <button type="submit">Send invite</button>
      </form>
    </dialog>
  );
}
```

## Evidence

The gate, run on both files:

```text
scale-from-zero: `transform: scale(0)` in `.invite` (InviteDialog.css:6)
transition-all: `transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1)` in `.invite` (InviteDialog.css:7)
outline-none: `.invite__email { outline: none }` has no `:focus-visible` outline or ring to replace it (InviteDialog.css:17)
unnamed-icon-button: <button> holds only an icon and has no `aria-label` (InviteDialog.tsx:5)

files scanned: 2
never-intentional: 4 (scale-from-zero 1, transition-all 1, outline-none 1, unnamed-icon-button 1)
candidates: 0
passing is necessary, not sufficient
ui-check failed
```

The checklist sheet, rows with a hit and the rows that cleared:

```text
#1  transition: all     1 hit   InviteDialog.css:7                  finding
#2  scale(0) entrance   1 hit   InviteDialog.css:6                  finding
#3  ease-in             0 hits
#4  duration > 300ms    0 hits  (200ms)
#6  reduced motion      guard present, InviteDialog.css:20
#7  ungated :hover      0 hits
#27 input under 16px    1 hit   InviteDialog.css:16 (class selector; the gate did not see it)   finding
#30 icon-only button    1 hit   InviteDialog.tsx:5                  finding
#32 focus ring removed  1 hit   InviteDialog.css:17                 finding
#34 layout animated     0 hits
```

## Findings

Five issues, the two that lock someone out first.

| Before | After | Why |
|---|---|---|
| `outline: none;` (`InviteDialog.css:17`) | `outline-offset: 2px;` | With the outline removed and no `:focus-visible` rule, a keyboard user cannot see that the email field has focus (WCAG 2.4.7). The browser ring returns when the line is deleted. See [accessibility](../references/accessibility.md). |
| `<button type="button" className="invite__close" onClick={onClose}>` (`InviteDialog.tsx:5`) | `<button type="button" className="invite__close" aria-label="Close dialog" onClick={onClose}>` | The button holds only a hidden icon, so a screen reader announces "button" and nobody using one can tell that it closes the dialog. See [accessibility](../references/accessibility.md). |
| `font-size: 14px;` (`InviteDialog.css:16`) | `font-size: 16px;` | iOS Safari zooms the page when an input under 16px takes focus, and the user has to pinch back out to see the dialog. See [mobile](../references/mobile.md). |
| `transform: scale(0);` (`InviteDialog.css:6`) | `transform: scale(0.95);` | From zero the dialog inflates from a point and its first frames blur; from 0.95 with the opacity it already has, it arrives as one surface. See [motion](../references/motion.md). |
| `transition: all 200ms cubic-bezier(0.23, 1, 0.32, 1);` (`InviteDialog.css:7`) | `transition: opacity 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 200ms cubic-bezier(0.23, 1, 0.32, 1);` | `all` animates every property that changes on the dialog, layout properties included; naming the two keeps the move on the compositor. See [motion](../references/motion.md). |

Verdict: Blocked (5 findings).
Not checked: the dark theme, 390px on a real phone, VoiceOver, the entrance at 25% speed, where focus lands when the dialog closes, and contrast (the colours are tokens defined outside these two files).
