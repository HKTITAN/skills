---
title: color-and-surface
summary: Which ramps exist, how each step is computed and named, how dark mode remaps them, and how surfaces separate, nest, blur, stack and dismiss.
---

# Color and surface

This lane decides the palette and everything a surface does with it: OKLCH ramps, token names, dark mode, shadows, radius, gradients, glass, z-index and which overlay closes. Open it when building or auditing a tokens file, adding a theme, writing any `box-shadow`, `border-radius`, `backdrop-filter`, gradient or `z-index`, or when a UI reads as generated. A project's `.design` file or DESIGN.md outranks every default here.

## Decide first

```text
1. Contract   Project ships a .design file or DESIGN.md? -> use its tokens. Stop.
2. Existing   Palette already exists? -> inventory it and report before changing anything.
3. Ramps      1 neutral + 1 accent + only the status ramps the product renders (0 to 4).
4. Steps      Compute each ramp in OKLCH: one hue, L 0.97 -> 0.22 in even steps, chroma as a clamped curve.
5. Names      Primitives by hue and step. Semantics by role. Components use semantics only.
6. Dark       Remap which step each role points at. Never a second hand-picked palette.
7. Separation Raised -> layered shadow (light) or lighter surface + ring (dark). Divided -> border.
8. Nesting    inner radius = outer radius - padding, floor 4px.
9. Layering   DOM order, then one global layer file, then local values inside isolation: isolate.
10. Check     Every text pair measured on its real surface, in every theme shipped.
```

## Palette and step roles

- **One neutral, one accent, status only where status is shown.** The eye tracks 2 to 3 colors; the accent stands out by being the only deviation. The neutral carries 80 to 90% of the interface and gets the most steps. A second accent only when two things must be told apart at a glance.
- **Every step has a role or it does not exist.** A step no role consumes is maintenance for zero pixels.

| Role | Tailwind step | Radix step |
|---|---|---|
| Page, subtle background | 50 | 1 to 2 |
| Component background | 100 | 3 |
| Hover, then active or selected | 200 | 4, 5 |
| Subtle border, separator | 200 | 6 |
| Border, focus ring | 300 | 7 |
| Hovered border | 400 | 8 |
| Solid fill, its hover | 600, 700 | 9, 10 |
| Low, high-contrast text | 700, 900 | 11, 12 |

- **Solid fills sit on 600, never 500.** White text on most 500 hues fails 4.5:1.
- **Radix steps are roles and hold in dark; Tailwind steps are lightness and invert.** Match the project. For a new system use the role model, and put the dark swap in the semantic tier.
- **One color, one meaning.** Hues within 15 degrees of OKLCH hue read as one color. Status hues sit at least 15 degrees from the accent; a red brand gets a distinct destructive treatment. Check gain and loss colors per locale (Chinese financial UIs show gains in red).
- **One filled action per view, and the fill goes on the background.** Accent text on a neutral button reads as a link.
- **A filled button's hover is one step of its own color.** `color-mix(in srgb, var(--accent), #000 10%)`, never a swap to `#e5e7eb`. Hover and pressed raise contrast; only disabled lowers it.
- **Neutrals keep one temperature across the ramp and match the brand's.** A warm grey border on a cool grey surface shows. Tint at OKLCH C 0.005 to 0.02 on the accent hue.
- **Light tints by lowering chroma, never opacity.** Opacity greys them out.
- **Disabled gets its own token, never `opacity`.** Opacity passes on one background and fails on the next.
- **Anything carrying text sits on a solid token.** A color with alpha has a different contrast on every background.
- **Keep an opaque twin of any translucent step that can overlap.** Stacked avatars or crossing icon strokes paint darker where they pile (3% ink on white flattens to `#ebebeb`).
- **Never ship `purple -> indigo -> fuchsia` gradients, five-color palettes, or saturation everywhere.** Neutrals at 5 to 10% saturation read as restrained. More in [tells](tells.md).

Starting set:

| Role | Light | Dark |
|---|---|---|
| canvas / surface / well | `#f6f5f4` / `#fff` / `#efeeec` | `#111113` / `#1a1a1d` / `#0a0a0b` |
| text strong / text / faint | `#262628` / `#7a7a7d` / `#9a9a9d` | `#ececee` / `#9d9da1` / `#6c6c70` |
| ink-1 to ink-5 (fills, ghost hovers) | `rgba(0,0,0,.04/.06/.08/.1/.15)` | |
| accent / soft / text | `#3b82f6` / 12% tint / mixed 82% with `#000` | `#3b82f6` / mixed 70% with `#fff` for text |

**Audit before restructuring.** Collect every literal (hex, `rgb(`, `hsl(`, `oklch(`, utilities, SVG `fill`/`stroke`, chart configs, email templates), sort by lightness per hue, collapse near-duplicates under OKLab delta E 0.02 by keeping the most-used (never average), give each survivor a role, count the ramps. Report the inventory before changing a value: consolidation changes screens nobody asked you to touch.

## OKLCH ramps, gamut and migration

`oklch(0.586 0.222 17.6)`: L 0 to 1, C 0 to about 0.4, H 0 to 360 (20 red, 90 yellow, 145 green, 195 cyan, 260 blue, 330 pink). Alpha after a slash. Three decimals.

- **Never generate a scale in HSL.** `hsl(55 100% 50%)` is near white-bright and `hsl(255 100% 50%)` is dark; mid steps bunch and tints drift violet.
- **Anchor L at 0.97 (step 50) and 0.22 (step 950), linear between: 0.075 per step.** Even L makes every adjacent pair look equally far apart. Never run to L 0 or 1, where chroma collapses.

| Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L | .970 | .895 | .820 | .745 | .670 | .595 | .520 | .445 | .370 | .295 | .220 |

- **Chroma is a fraction of each step's sRGB ceiling: 30% at the ends, 85% around 400 to 500.** Tints stay airy, shades stay rich, nothing leaves the gamut.
- **Hue is fixed across all eleven steps.** An inherited scale with more than 10 degrees of spread drifts visibly; rebuild it on the mid-tone hue. Tailwind's blue runs H 254.6 to 267.9.
- **Sibling hues share L at each step and the same fraction of their own ceiling, never the same absolute C.** Ceilings differ threefold at one lightness.

sRGB ceilings: at L 0.5, violet H 285 is 0.29, red H 25 is 0.20, cyan H 195 is 0.09; at L 0.7, pink H 330 is 0.31; at L 0.9, spring green H 130 is 0.24.

- **Clamp C yourself, holding L and H.** `oklch(0.6 0.31 20)` becomes `oklch(0.6 0.241 20)`. The browser's own mapping is one you did not pick.
- **Extra chroma goes in a P3 layer; the base stays inside sRGB.**

```css
.cta { background: oklch(0.66 0.2 330); }
@media (color-gamut: p3) { .cta { background: oklch(0.66 0.32 330); } }
```

At L 0.66, H 330, sRGB tops out near 0.30 and P3 near 0.33. A hex floor inside `@supports (color: oklch(1 0 0))` is for browsers older than 2023 only.

- **Repair contrast by moving L only.** Chroma and hue barely move contrast. Triage: a surface with L > 0.6 takes dark text; grounds at L >= 0.85 take foreground L <= 0.45 (first candidate on step 50 is 700); grounds at L <= 0.25 take L >= 0.75 (on 950, step 200). Then measure: APCA Lc 75 body (90 preferred), 60 other text, 45 large, 30 non-text and disabled; WCAG 4.5:1 body, 3:1 large. Pass both. Full rules in [accessibility](accessibility.md).
- **`prefers-contrast: more` gets a value per theme, L gap widened by at least 0.15.** One shared block darkens the dark theme too and lowers its contrast.

**Migrating to OKLCH is value-for-value.** Hex first, then `rgb()`, then `hsl()`. `rgba(255,255,255,.12)` becomes `oklch(1 0 0 / 0.12)`; opaque values carry no `/ 1`. Never convert keywords (`currentColor`, `transparent`, `inherit`), interpolation hints (`in oklab`, the `in srgb` of a `color-mix`), or config a library parses as hex. Keep comments, order and indentation. `#3b82f6` is `oklch(0.623 0.188 259.8)`; C 0.214 is a recolor. Re-run contrast on pairs that mattered, and report every touched line, old value beside new, with the rule named.

## Token tiers

- **Primitives name a value (`--blue-600`, `--neutral-200`) and never appear in a component.** A raw `bg-blue-600` leaves no seam for a theme.
- **Semantics name a job and point at a primitive (`--color-text-secondary: var(--neutral-700)`).** Dark mode, white-label and increased contrast repoint this tier only.
- **A component tier (`--color-button-danger-bg`) is a documented exception.** Twenty of them means the semantic tier is missing roles.
- **Build against the full inventory, never as components ask.**

| Group | Roles |
|---|---|
| Surfaces | page, surface, raised, sunken, overlay scrim |
| Text | primary, secondary, disabled, inverse, on-accent |
| Borders | subtle, default, strong, focus ring, separator |
| Accent | subtle background, border, solid, solid hover, text |
| Status (each one shown) | subtle background, border, solid, text |

- **Separator and border are two roles.** They diverge the first time inputs are restyled.
- **Use a token only in its role.** A border token borrowed as caption text fades with the borders.
- **One grammar.** Neutral: `--color-{bg|text|border}-{variant}-{state}`. Accent and status: `--color-{accent|danger}-{subtle|border|solid|text}-{state}`. Never mix in `fg`, `foreground`, `stroke`, `brand`.
- **Call the brand `accent`.** `--color-primary` beside `--color-text-primary` is the most common collision.
- **Derive, never hand-pick, dependent tokens.** `--color-accent-text: color-mix(in srgb, var(--color-accent-solid) 82%, #000)` survives a rebrand.
- **Tailwind v4:** declare both tiers in `@theme`; repoint semantics in a `.dark` block outside `@theme`, without `inline`. Token file formats: `khe-design-tokens`.

## Dark mode

- **Never `#000` under `#fff`.** Harsh, and OLED smears scrolling text. `#000` is for photo backdrops, video chrome and opt-in OLED themes.
- **Elevation is a lighter surface, and the topmost layer is the lightest.** `#18181b` base, `#1f1f23` cards, `#2a2a2f` menus and modals, `#35353a` floating.
- **Remap, never invert, then re-check every pair.** `--surface` 50 to 950, `--ink` 950 to 50, 200 to 800, 300 to 700. Reverse step order alone is wrong: dark needs lower accent chroma and a wider dark end.
- **Desaturate accents 20 to 30% on dark.** They vibrate at light-mode chroma.
- **Text is opaque tokens.** White at 92% and 62% alpha is safe only on one known surface.
- **Dividers are solid dark greys (`#2a2a2a` on `#18181b`).** An alpha white line glows.
- **White rings are for elevation only.** A raised card swaps its shadow stack for `0 0 0 1px rgb(255 255 255 / .09)`.
- **A light document over a dark workspace keeps its own dark ink and edge.**
- **`fill="currentColor"` on icons and one-color logos.** Hardcoded `#fff` or `#000` breaks one theme.
- **Themes flip variables.** Per-component `dark:` overrides rot on the first palette change.
- **Declare only the schemes you designed.** `color-scheme: light dark` on `:root` for both, `color-scheme: light` for light-only; pair with `<meta name="theme-color">` per scheme.
- **A reachable half-finished dark mode is a blocker.** Until it is done, hide the toggle and do not declare `color-scheme: dark`.

## Shadows, depth and radius

- **Never `0 2px 8px rgba(0,0,0,0.1)`.** A visible soft grey blur is too strong.
- **Layer 2 to 3 shadows at 4 to 6% opacity on `#111`, y-offset never larger than blur, led by a 1px ring.** One blur looks flat; the ring gives the top edge a line.

```css
--shadow-sm: 0 1px 1px rgba(17,17,17,.04), 0 2px 4px rgba(17,17,17,.04);
--shadow-md: 0 1px 2px rgba(17,17,17,.05), 0 4px 8px rgba(17,17,17,.05), 0 8px 24px rgba(17,17,17,.04);
--shadow-lg: 0 2px 4px rgba(17,17,17,.06), 0 8px 16px rgba(17,17,17,.06), 0 16px 48px rgba(17,17,17,.06);
--elevation-raised: 0 0 0 1px rgb(0 0 0 / .05), 0 1px 3px rgb(0 0 0 / .05), 0 4px 10px -4px rgb(0 0 0 / .05);
```

`sm` cards and buttons, `md` dropdowns and popovers, `lg` modals. Top-edge highlight: `inset 0 1px 0 rgba(255,255,255,.06)`.

- **One shadow per role on a page.** Count distinct `box-shadow` values; each maps to a role.

| Marketing-stage role | Shadow |
|---|---|
| Hero window | `0 0 0 1px rgba(0,0,0,.06), 0 30px 60px -12px rgba(50,50,93,.25), 0 18px 36px -18px rgba(0,0,0,.3)` |
| Satellite over the hero | `0 0 0 1px rgba(0,0,0,.04), 0 14px 32px -8px rgba(50,50,93,.24), 0 4px 10px -4px rgba(0,0,0,.1)` |
| Lone small window | `0 0 0 1px rgba(50,50,93,.06), 0 24px 48px -24px rgba(50,50,93,.18)` |
| Card at rest | `inset 0 0 0 1px var(--line), 0 1px 2px rgba(0,0,0,.04)` |

- **The shadow goes on the outlined shape, never a wrapper; a ring is `inset`, so padding stays even.** Transition `box-shadow` only, `150ms ease-out`.
- **Shadows sit, they never glow.** No `0 0 24px #6366f166, 0 0 60px #22d3ee44`. No `text-shadow`.
- **Hairlines are 0.5px on 2x displays, 1px fallback.**
- **Every image gets `outline: 1px solid rgb(0 0 0 / .1); outline-offset: -1px`, white at 10% in dark.** A tinted line reads as grime.
- **Fade with `mask-image`, never a gradient overlay, and never fade scrollable content.**
- **Raised surfaces (cards, menus, dialogs, hover lift) take a shadow; row dividers, gridlines and input edges keep a border.** A translucent shadow works on any background; an input edge is an accessibility feature.
- **One depth cue per surface.** Border and shadow and ring and gradient on one card is hedging.

Radius: `4px` badges, `8px` inputs and small buttons, `12px` cards (the product default), `16px` modals, `24px` hero cards, `9999px` pills and avatars.

- **Inner radius = outer radius - padding.** Equal radii pinch the corner. `16px` with `6px` padding gives `10px`. Floor it: `max(4px, calc(var(--radius) - var(--pad)))`. Past a 24px gap, pick each radius independently.
- **A radius per role, one set per page.** One `12px` on row, field, popover and window means nothing reads as nested. A shipped set: menu row `6px`, field `8px`, popover `10px`, window `12px`, chip `999px`.
- **A pill button commits everywhere.** Inset icons and badges take `9999px` too.

## Gradients and translucent materials

| Space | Result |
|---|---|
| none (sRGB) | midpoint darkens and mutes |
| `in oklab` | even brightness: the default |
| `in oklch` | arcs round the hue wheel, vivid; add `shorter hue` or `longer hue` |

- **Opposite hues in sRGB or OKLab pass through grey.** Use `in oklch` or a third stop. `linear-gradient(122deg in oklab, #1c315f, #3d74bd 60%, #cbdfee)` beats `linear-gradient(90deg, #3b82f6, #f59e0b)`.
- **Large low-contrast gradients band on 8-bit displays.** Widen the contrast, shrink the area, or add noise (`feTurbulence`). Never a two-stop linear between close solids.
- **Measure text on a gradient at its worst region, or put a scrim behind it.**
- **Heavier, more opaque glass for structure (sidebars, tab bars); lighter for interactive pieces; bigger surfaces get more blur and deeper shadow.** Weight is the hierarchy.
- **Never a light translucent layer on another one.** Two blurs compound and text dies. Make one solid.
- **Put color or crisp bands behind glass.** Over a plain page it is a grey tint.
- **Modal task: scrim. Parallel panel: no scrim.**
- **Text on glass: one weight heavier, 0.01em tracking, measured over the worst backdrop.** Brand color on a solid layer.
- **Enter and exit by animating blur radius and a slight scale together.** Timing in [motion](motion.md).

```css
.toolbar { background: rgb(255 255 255 / 0.6); backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgb(255 255 255 / 0.4); }
@media (prefers-reduced-transparency: reduce) { .toolbar { background: var(--surface); backdrop-filter: none; } }
@media (prefers-contrast: more) { .toolbar { background: var(--surface); border-color: var(--border-strong); } }
```

A parent with `overflow: hidden`, `transform` or `isolation` can leave `backdrop-filter` sampling nothing. Check Safari and Firefox.

## Stacking and dismissal

1. **No z-index.** Order the markup so source order is paint order.
2. **One global file of sequential constants for app-wide layers.**

   ```ts
   let d = 1
   export const nav = d++, contextMenu = d++, tooltip = d++, modal = d++, toast = d++
   ```

3. **Local `1` and `2` inside `isolation: isolate`.** Nothing escapes the wrapper.

- **Never `9999`, `z-10` or `z-50` by feel, and never `modal + 1` in a component.**
- **`fixed` and `sticky` create a stacking context but stay bounded by an ancestor's.** A context paints as `z-index: 0`, so an unpositioned later sibling paints below it; give the sibling `position: relative`.
- **No z-index lets a child out of `overflow: hidden`.** `transform`, `filter`, `will-change: transform` and `contain: paint` create a containing block; `isolation` does not. Re-check depth after adding any animation to a container.

**Every dismissible layer joins one stack.** Dialogs, drawers, sheets, popovers, menus, combobox lists, calendars, pinned tooltips, context menus.

1. One Escape or platform close request (Android back, `CloseWatcher`) reaches the topmost layer only. It closes or refuses; it never falls through.
2. A known parent outranks DOM or portal order.
3. Content claims Escape first; the shared listener runs in the bubble phase.
4. Escape that cancels an IME composition closes nothing.
5. A backdrop press dismisses only when it starts and ends on the backdrop. Never `onPointerDown` alone.
6. The top layer consumes its own outside press.
7. Focus returns to the opener without scrolling.
8. The stack calls the layer's dismiss callback; open state stays with the owner.

Component behavior is in [components](components.md).

## Deliberate imperfection

- **Marketing and brand surfaces only.** Never forms, tables, dashboards or repeated lists.
- **Align optically.** A circle beside a square needs to be 5% larger; an icon beside text takes `translateY(-1px)`.
- **Grain under UI at 1% opacity on a 4 to 8px pattern (`rgba(0,0,0,0.012)` dots, `background-size: 4px 4px`), never over a word.**
- **Earn every tilt.** Compare tilted against straight at final size. Small angles, alternating sign, uneven offsets, only the top card with words and a real shadow:

```css
.back { translate: -20px 10px; rotate: -6deg; }
.mid  { translate: 18px -6px;  rotate: 4deg; }
.top  { translate: 0 4px;      rotate: -2deg; box-shadow: var(--shadow-satellite); }
```

Asymmetric composition is in [layout](layout.md).

## Never ship

| Never | Instead |
|---|---|
| `linear-gradient(135deg, #7c3aed, #db2777 60%, #f59e0b)` | One neutral family, one accent, spent once |
| `--blue-100: hsl(220 90% 95%)` ramps | OKLCH, L 0.97 to 0.22 in 0.075 steps |
| White text on a 500 fill | 600, hover 700 |
| `bg-blue-600` or a hex in a component | `bg-accent-solid` |
| `--color-primary` for the brand | `--color-accent-solid` |
| `opacity: .5` for disabled | `--color-text-disabled` |
| Hover that swaps a filled button to `#e5e7eb` | `color-mix(in srgb, var(--accent), #000 10%)` |
| `#000` page under `#fff` text | `#18181b` or `#111113`, text `#ececee` |
| `0 2px 8px rgba(0,0,0,0.1)` | Layered token at 4 to 6% |
| `border-radius: 16px` on parent and child | `16px` outer, padding `6px`, `10px` inner |
| `z-index: 9999` | A constant in the global layer file |
| `onPointerDown` on a backdrop to dismiss | Press that starts and ends on the backdrop |
| Glass on glass | One of the two solid |
| `oklch(0.623 0.214 259.8)` as the base "for punch" | Base inside sRGB, punch in `@media (color-gamut: p3)` |

## Check

1. Print L and H per step: adjacent L deltas match to 0.01, H spreads under 10 degrees.
2. Grep components for hex and primitive names: zero. Switch every theme without touching a component.
3. View in grayscale. If the thing acted on vanishes, mark it with a solid step, never a translucent wash.
4. Screenshot dark on its own, then desaturate: stacking order still reads from surface steps.
5. Measure each label against the surface it sits on, at shown size and at 390px wide.
6. At a 25% thumbnail you find the card's edge, not a grey halo.
7. Sample a gradient's midpoint at real size: chroma well below both stops is the grey zone.
8. Swap the ground behind glass for a flat fill. If the glass looks the same, it was decoration.
9. Open a menu in a dialog and press Escape once: only the menu closes. Drag a selection past the dialog's edge: nothing closes.
10. After a hex migration, diff screenshots on an sRGB screen: no channel moves more than 1/255.

## Where sources disagree

- **Neutral tint.** "Warm or cool grey beats pure grey" against "pure grey is a fine default". This file tints at C 0.005 to 0.02.
- **Dark text.** White at 92% and 62% alpha against opaque greys. This file uses opaque.
- **Dark elevation.** Ring alone at `.09`; ring at `.06` plus `0 4px 12px rgba(0,0,0,.4)`; Stageshow's `.08` hairline plus `0 30px 60px -12px rgba(0,0,0,.6)` with satellites on `#26262a`. This file uses lighter surface plus the `.09` ring in product UI, hairline plus drop on a marketing stage.
- **Dark base.** `#18181b` against `#111113` (`#09090b` for a hero page). Both are listed.
- **Shadow weight.** 4 to 6% against a hero window at 25%. Whisper scale in product, stage tokens on marketing.
- **Adjacent radii.** "4px beside 8px looks like a mistake" against a shipped role set of 6, 8, 10, 12. This file uses a radius per nesting role.
- **Palette size.** "About 14 tokens" against the full role inventory. This file builds the inventory on three ramps or fewer.
- **Ramp math.** OKLCH against Benji Taylor's HSL or `color-mix(in srgb)` variants of one known color. The second is for a few variants, never a ramp.
- **Z-index.** One constants file (Cheng Lou) against raw commented numbers (20, 25, 30, 100) inside an isolated stage (Stageshow). This file uses the constants file.
- **Glass on glass.** Never, against Stageshow's popover (0.74) over a window (0.62) with a brighter 1px rim. Banned in product UI.
- **Grain.** 1% under UI against `opacity: .7` with `soft-light` over a whole ground (`baseFrequency="0.7"`, `numOctaves="2"`). The heavier grain only on a ground with no text.

## Sources

- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT).
- Jakub Krehel, interfaces skills (github.com/jakubkrehel/skills, MIT): token tiers, step roles, gradient spaces.
- Benji Taylor, Stageshow (github.com/benjitaylor/skills, MIT) and benji.org/liveline: surface, shadow and radius sets.
- Cheng Lou, chenguini (MIT): z-index strategies.
- Meta, Astryx (github.com/meta/astryx, MIT): the overlay dismissal stack.
- guidelines.sh; Vercel Web Interface Guidelines; Material Design 3; Apple Human Interface Guidelines.
- Andrew Somers, APCA (git.apcacontrast.com); W3C WCAG 2 and CSS Color Level 4.
- Tailwind CSS v4 `theme.css`; Radix Colors.
