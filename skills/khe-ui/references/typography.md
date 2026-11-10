---
title: typography
summary: Which face, which size from a closed role scale, what leading, measure and tracking, how each line wraps or cuts off, and which font features and files ship.
---

# Typography

This lane decides the face, the scale, the spacing of lines and letters, and what happens to a string when its box runs out. Open it when setting up a project's type, when text feels cramped in one place and airy in another, when anything truncates, wraps or ticks, and on every font-loading diff. A project's `.design` file or DESIGN.md outranks every default here.

## Decide first

```text
1. Contract    Project ships a .design file or DESIGN.md?  -> use its faces, scale and tracking. Stop.
2. Surface     Marketing page      -> a chosen face, never Inter / SF Pro / Roboto / system-ui
               Product UI          -> Inter or SF Pro allowed; that is the one default you get
               Picture of a product -> that product's own font stack
3. Role        Map every string to a role in the closed scale. No role fits -> add a role, never a one-off size.
4. Leading     By role: body 1.5 to 1.6, display and headings 1.1, always unitless.
5. Tracking    By size, from the table. Body is 0.
6. Measure     Reading columns: max-width 65ch. Labels and fields: shorter.
7. Wrap        Headings balance. Short blurbs pretty. Long-form paragraphs neither.
8. Overflow    Per field: wrap, end-truncate, middle-truncate, clamp, or never cut.
9. Numbers     Anything that updates gets tabular figures.
10. Files      woff2 only, used weights only, font-synthesis: none.
11. Check      Render at shown width and at 390px. Count sizes, wraps and cuts.
```

## Choose a face

- **Never set a marketing page in Inter, SF Pro, Roboto or `system-ui`.** They are well made and so common they are invisible; the page then competes with every other page that made the same non-choice.
- **In product UI, Inter and SF Pro are allowed, and they use up your one default.** They are tuned for small screen text. If you take them, do not also take the default colors and the default Lucide icons.
- **Start with one weight of one face for everything.** Hierarchy from size and spacing alone is cleaner; add a weight only when a real need appears. System stack as fallback.
- **Two faces cover a product; three is the ceiling.** Pair across categories (serif display over sans text), never two lookalike grotesques, which read as an accident.
- **Monospace only for code, identifiers and aligned numbers.** Labels set in mono on a technical product read as costume.
- **Test the face at every size you ship.** Geometric sans faces look right at 14px and up and turn to mush at 10 to 12px. Inter is legible at 12px, and sometimes that wins.
- **Re-tune sizes when swapping faces, and match the fallback stack's x-height.** Two families at one `font-size` rarely look the same size, and a mismatched fallback jolts on load.
- **Pick the optical cut for the size you set.** Text cuts are sturdier and looser, Display and Big cuts have hairlines for poster sizes (Freight ships all three).

Faces to reach for: PangramPangram (Object Sans, Pangram Sans, Pangram Sans Rounded), Displaay (Grato, Migra, Neulis), Grilli Type (GT Walsheim, GT America, GT Maru), Søren Sprogø's open-runde (free), Vercel Geist Sans and Mono, GitHub Mona.

Inside a picture of a product, use that product's stack: Notion is `ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif`; a Wikipedia title is `'Linux Libertine', 'Georgia', 'Times', serif`; code and IDs are `"SF Mono", "SFMono-Regular", ui-monospace, Consolas, monospace`.

## Scale and leading

- **Every size comes from a short closed list.** One-off sizes are the cause of "cramped here, airy there". A ratio of 1.2 on a 16px root or Tailwind's stock steps both work.
- **Name steps by role (`text-caption`, `text-card-title`), never by size (`text-lg`).** A role polices its own usage.
- **Text sizes in `rem`, never `px`.** The reader's settings must hold. `px` is for hairlines.
- **Leading is always unitless.** `line-height: 24px` breaks on the first size tweak or user zoom.
- **Paragraph spacing equals 1x the line-height.** An arbitrary px gap breaks the rhythm.
- **Light weights only at display sizes.** A 300 weight that reads at 32px is illegible at 11px.
- **Never change font weight on hover or selection.** The text reflows by a pixel and the layout shifts. Signal state with color, or use a variable axis at the same advance width.
- **Crop built-in space with `text-box: trim-both cap alphabetic`, as enhancement only.** Fonts reserve room above cap height and below the baseline, so a label never sits dead center in a button.

Floors: body 16px, dense controls 14px, captions 13px; under 12px needs a stated reason. Leading: body 1.5 to 1.6, headings and display 1.1, hero headline and stat number 1.0.

A closed product scale read off a shipped list row (px, inside a product shot):

| Role | Desktop | iOS list row | Leading |
|---|---|---|---|
| Row title | 12px, weight 600 | 17px | 16px (22px iOS) |
| Subtitle | 11.5px | 15px | 16px (20px iOS), 2px gap under the title (0 on iOS) |
| Metadata | 11px | 15px | 16px (22px iOS) |
| Tile copy (page type) | 17 to 24px | same | 24px at 17px |
| Stat | 48 to 72px, unit on the same line | same | 1 |

**Never shrink type to fit more rows.** 10px names, 8.5px timestamps and an 18px button is the failure; 14px names, 12px metadata and fewer rows is the fix.

### Display on a marketing page

Measured on 202 gallery sites (1440 x 900 and 390 x 844): the hero headline has a median of 72px (5.0vw; middle half 43 to 109px; 40px on a phone), leading about 1.0, about 4.3x body (4.7x on top-scored sites). The largest type is 8.4vw on top sites against 5.0vw on weak ones. 48% of heroes are regular weight, so size separates them and weight does not have to.

**Budget the words before the size.** Characters per line = line width / (size x k), with k = 0.40 condensed, 0.50 most faces, 0.58 wide or caps. A two-line headline at 44px on a 390px phone holds about 32 characters, four to six words. Over budget, cut words before shrinking type. Product UI never gets this scale.

## Tracking and measure

**Tighten as size grows, open as it shrinks, in `em`.** A face's spacing is calibrated for body sizes; untightened display text is the most common amateur mark.

| Size | Tracking |
|---|---|
| 10 to 12px | +0.5px to +1px |
| 14 to 16px (body) | 0 |
| 20 to 28px | -0.01em to -0.02em |
| 32 to 48px | -0.02em to -0.04em |
| 64px and up | -0.04em to -0.06em |
| Small uppercase label | +0.05em to +0.1em |

Tokens: `--max-prose: 65ch; --tracking-display: -0.03em; --tracking-body: 0; --tracking-caps: 0.06em;`

Real values to land on: tile copy 17px/24px at -0.012em with `max-width: 380px` (460px on a hero tile); stat number 76px/1 at -0.04em; stat unit 40px at -0.025em; stat label 15px/21px at 0 with `max-width: 240px`.

- **Kerning stays on.** It is the font's own pair data; `font-kerning: none` is a rare deliberate act.
- **Cap reading columns at `max-width: 65ch`.** The readable range is 45 to 75 characters, 60 to 70 for prose; shorter lines read choppy and longer ones lose the start of the next line. `ch` is the width of "0", and Tailwind's `max-w-prose` is exactly 65ch. Re-check the count when the family changes.
- **Left-align by default.** The ragged right edge is the eye's landmark; justification without hyphenation opens rivers. Centering fails past two wrapped lines.

## Wrapping and truncation

| Text | `text-wrap` |
|---|---|
| Headings | `balance` |
| Standfirsts, card blurbs, empty-state copy | `pretty` |
| Long-form paragraphs | neither |

- **Never put `balance` on body paragraphs.** Chrome stops balancing past about 6 lines and silently does nothing, and a balanced paragraph spends width that reading needs. Both values ship without fallback (Chrome 114+, Safari 17.4+). A three-line headline can still open with a short first line; a manual break wins there.
- **`overflow-wrap: anywhere` wherever a URL, hash or user token can appear.** `break-word` leaves the min-content width alone, so a flex item still overflows.
- **`white-space: nowrap` on badges, buttons, key-value labels, and a number with its unit.** A mid-phrase break there reads as a bug. `30,000` with `ft` dropped to its own line in a 160px tile is the canonical one.
- **`hyphens: auto` only with a correct `lang`.** Without it the browser has no dictionary.
- **Never truncate without a route to the full string.** Tooltip, `title`, expand or detail view. A clipped ID with no escape is data loss.

Choose per field, never globally:

| Field | Behavior |
|---|---|
| What identifies the thing (name, detail title) | Wrap. Two lines is fine; four means the column is too narrow |
| Secondary metadata whose start carries meaning (role, description, preview) | End-truncate: `nowrap` + `overflow: hidden` + `text-overflow: ellipsis` |
| Items that differ at the end (file names, emails on one domain, paths, hashes) | Middle-truncate (`Q3-report…v12.pdf`). CSS cannot; split the string and keep the tail |
| Card previews | `line-clamp: 2`, so card heights stay predictable |
| Prices, counts, dates, IDs | Never cut. Widen the column or truncate the label beside them |
| Copy you choose (demo, empty state, marketing shot) | Pick strings that fit: `maya@acme.co`, not `maya.chen@northwind-ana…` |

## Casing, punctuation and finish

- **Store copy in sentence case and uppercase it with `text-transform`.** ALL-CAPS strings in source get rewritten at the next redesign and confuse screen readers.
- **Uppercase only at 10 to 12px with +0.05em to +0.1em tracking (navigation, badges, table headers), or for phrases under 4 words.** Same-height letters are slow to read. Never for body prose or anything skimmed.
- **Never set a tracked-caps eyebrow over a heading.** Tiny tracked caps sit on 57% of weak gallery sites against 16% of top ones, and three or more per page on 43% against 6%. Fold the eyebrow's words into the heading. `Recent deploys` and `Deploy`, never `RECENT DEPLOYS` at 12px and 0.12em beside a tracked `DEPLOY` button. More in [tells](tells.md).
- **Type real punctuation.** Curly quotes in prose, an en dash for spans (`Mon–Fri`), the em dash character for asides, the single `…` character, `&nbsp;` between a value and its unit, `&shy;` inside long words. Code keeps straight quotes.
- **Underlines take metrics from the font.** `text-decoration-thickness: from-font; text-underline-position: from-font`, or hand-tuned in `em` with `text-decoration-skip-ink: auto`. Dotted means "more here" (abbreviations). Never underline a non-link.
- **Animate only the color of a native underline.** A growing or sliding underline is its own element.
- **Style `::selection` and keep it legible; `user-select: none` on control labels and chrome.** Check what select-all grabs.
- **Smooth once at the root.** `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale`, never per component.
- **Write direction-neutral CSS.** `padding-inline-start`, `text-align: start`, `lang` on the document, `dir="rtl"` where it applies.

## Features, axes and files

- **Ship `woff2` and nothing else.** A `ttf` or `otf` in `public/fonts` is a bug. Load only used weights, subset to used characters.
- **`font-synthesis: none` at the root.** An unloaded bold or italic then fails visibly instead of being faked by thickening or slanting.
- **Use the high-level property, never the raw tag.** Properties degrade on a fallback font; raw tags silently stop.

| Want | Write | Not |
|---|---|---|
| Weight 620 | `font-weight: 620` | `font-variation-settings: "wght" 620` |
| Width (`wdth`) | `font-stretch` | raw tag |
| Optical size (`opsz`) | `font-optical-sizing: auto` | hand-set `"opsz"` |
| Slant, italic (`slnt`, `ital`) | `font-style` | raw tag |
| Tabular figures | `font-variant-numeric: tabular-nums` | `"tnum" 1` |
| Small caps | `font-variant-caps: small-caps` | shrunken uppercase (too light) |
| m², CO₂ | `font-variant-position: super` or `sub` | default `<sup>` (too big, pushes lines apart) |
| Custom axis (Fraunces `SOFT`, `WONK`) | `font-variation-settings` | no property exists |
| `ss01` to `ss20`, `cv01` to `cv99` | `font-feature-settings: "ss02" 1; /* single-storey a */` | uncommented slot |

- **Comment every numbered set.** The slots mean something different in each family; read the specimen.
- **Check the font has the axis or feature before writing it.** A missing one fails silently.
- **Static files for one or two weights; the variable file for many weights, `opsz` or a custom axis.** Measure the bytes, never assume.
- **Never stroke a variable font (`-webkit-text-stroke`).** Unmerged overlapping contours show as seams and no CSS removes them. Use a static instance.

Figures:

```css
.ticker   { font-variant-numeric: tabular-nums; white-space: nowrap; }
.ticker .unit { margin-left: 0.08em; }  /* "240ms": a hair; 0.28em for a word space */
.ring-val { font-variant-numeric: proportional-nums; text-box: trim-both cap alphabetic; }
.serial   { font-variant-numeric: tabular-nums slashed-zero; }
```

- **Tabular figures on timers, prices and counters.** Without them every tick nudges the neighbours.
- **Proportional figures and a cap-height trim on a lone figure centered in a shape.** A fixed-width 1 sits visibly left of a ring's center.
- **`slashed-zero` on codes and serials; `diagonal-fractions` for 1/2; `lining-nums` or `oldstyle-nums` chosen for running text; ligatures off in code-like strings** via `font-variant-ligatures`.
- **`initial-letter` is enhancement only.** It is missing in Firefox; `::first-letter` works everywhere.
- **`caret-color` is the whole safe caret API.** Replacing the caret means rebuilding editing. `::placeholder` is lighter than typed text and still passes contrast.

## Phones

- **Inputs never below 16px on phones.** Safari zooms the page on focus. Never patch it with `maximum-scale=1`, which removes zoom for everyone (WCAG 1.4.4).
- **Raise phone body text to 16px by pinning one heading role, never by scaling everything or touching the root size.** Mobile base = `max(desktop base, 16)`; the ratio is re-derived so the pinned role keeps its desktop size (base 14, ratio 1.333: body 14 to 16, Heading 2 stays 25, Display 1 goes 79 to 60). Activate on `(width < 1024px) and (pointer: coarse)`, both conditions. The formula and pin table are in [mobile](mobile.md).

## Never ship

| Never | Instead |
|---|---|
| Inter, SF Pro, Roboto or `system-ui` on a marketing page | One chosen face, one weight |
| A size outside the scale; `text-lg` as a team token | A role step: `text-caption`, `text-card-title` |
| `line-height: 24px` | Unitless: 1.5 to 1.6 body, 1.1 display |
| 48px heading at `letter-spacing: 0` | -0.02em to -0.04em |
| `RECENT DEPLOYS` at 12px, 0.12em, over a heading | `Recent deploys`, sentence case, untracked |
| `text-wrap: balance` on paragraphs | `balance` on headings, `pretty` on blurbs, neither on long-form |
| `overflow-wrap: break-word` on a URL in a flex item | `overflow-wrap: anywhere` |
| Ellipsis with no tooltip, `title`, expand or detail view | A route to the full string |
| A truncated price, count, date or ID | Widen the column |
| A unit on its own line under its number | `white-space: nowrap` on the pair |
| `font-variation-settings: "wght" 620`, `"tnum" 1` | `font-weight: 620`, `font-variant-numeric: tabular-nums` |
| `ttf` / `otf` shipped; faux bold | `woff2` only; `font-synthesis: none` |
| Weight change on hover | Color change, weight constant |
| Input under 16px on a phone, or `maximum-scale=1` | 16px inputs, zoom left on |

## Check

1. Render at the shown width and again at 390px. Count every wrapped and truncated string. Each is a choice: no unit on its own line, no name wrapping in a chip, every cut string has a route to the full text.
2. Count the distinct font sizes on screen. Each maps to a role. Nothing is under 10px, and no text sits at 16px only because nothing sized it.
3. Put your heading beside a reference stat at the same size (76px, -0.04em) and screenshot. If yours looks looser, tighten it.
4. Count tracked-caps strings. Each needs the product's own capitals behind it.
5. Hide the logo and name. If the page type could belong to any product in its category, the face is still a default.
6. Film a counter stepping 9, 10, 11 and a ring going 1 to 7 at 40 to 80ms per step. Neighbours never shift, and the 1 looks centered at 2x zoom.
7. Contrast in both themes: 4.5:1 body, 3:1 from 24px (or bold 18.5px). Layout survives user zoom and an enlarged root size. Thresholds in [accessibility](accessibility.md).

## Where sources disagree

- **Display tracking.** A single value of -0.015em against the size table (-0.02em to -0.06em from 32px up). This file uses the table.
- **`pretty` on paragraphs.** `p { text-wrap: pretty }` against `pretty` for short blurbs only. This file uses the second.
- **Where `balance` stops.** "A few lines" against "about 6 lines in Chrome". This file uses 6.
- **Tracked caps.** Allowed at 10 to 12px on navigation, badges and table headers, against Benji Taylor, who keeps capitals only where the product itself capitalizes. This file allows the first and bans the eyebrow.
- **Units.** `rem` and unitless leading on the page, against px text and leading inside a faux product shot that the stage scales. This file uses px only inside a scaled shot.
- **Small-size floor.** "Below 12px needs a reason" against a shipped desktop row at 11px and 11.5px with a hard floor of 10px. This file uses 12px for page and app text and 10px inside a product shot.

## Sources

- Robert Bringhurst, *The Elements of Typographic Style*: the 45 to 75 character measure.
- guidelines.sh: default faces, foundry list, tracking by size.
- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT).
- Benji Taylor, Stageshow (github.com/benjitaylor/skills, MIT): row scale, stat and figure values, product-shot stacks.
- Leonxlnx, taste-skill (MIT): the 202-site hero measurements and headline budget.
- Meta, Astryx (github.com/meta/astryx, MIT): the mobile type pin.
- web.dev on `text-wrap`; W3C CSS Text 4, CSS Fonts 4, CSS Inline Layout, WCAG 2.2 (1.4.3, 1.4.4).
