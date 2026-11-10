---
title: accessibility-and-typography
summary: The little he published on reduced motion, hit areas and assistive technology, and the seven typography rules from one article.
---

# Accessibility and typography

Both topics are thin in his writing. Reduced motion gets one section of one article; typography gets one list. Contrast, screen readers, focus order, type scales and font choice are in [silent](silent.md). Never stretch these lines into a full accessibility or typography position.

## Reduced motion

- Motion can make some people feel sick or distracted, so users who do not want it must be planned for. (Great Animations, https://emilkowal.ski/ui/great-animations)
- Under `prefers-reduced-motion: reduce`, swap the movement for a plain fade of the same duration; his example replaces a bounce with a `0.2s` fade. (Great Animations, https://emilkowal.ski/ui/great-animations)
- In Framer Motion, `useReducedMotion` sets the sidebar's closed x position to 0, so only opacity changes. (Great Animations, https://emilkowal.ski/ui/great-animations)

## Hit areas and hidden copies

- A small target gets a 44px minimum hit area through a pseudo-element. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- A decorative copy of a control is `aria-hidden` and out of the tab order. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- The hold-to-delete overlay is `aria-hidden`. (Building a Hold to Delete Component, https://emilkowal.ski/ui/building-a-hold-to-delete-component)
- For accessible tabs he points to Radix Tabs, and calls his own demo code simplified. (The Magic of Clip Path, https://emilkowal.ski/ui/the-magic-of-clip-path)
- Vaul sits on Radix Dialog for accessibility and focus management. (Building a Drawer Component, https://emilkowal.ski/ui/building-a-drawer-component)

## Typography

All seven come from one list, given as an example of taste written as rules for an agent.

- Cap body text at about 65ch. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Use `tabular-nums` on price columns. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Use the single ellipsis character, never three dots, so truncation follows the container. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Loosen the letter-spacing on uppercase labels. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Use a fallback font stack whose x-height and weight match the primary face, so nothing shifts when the font loads. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Underline only links. Emphasize anything else with weight or color. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Bold for emphasis in an interface. Italic only for citations and stress in prose; italic hierarchy reads as print editorial. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
