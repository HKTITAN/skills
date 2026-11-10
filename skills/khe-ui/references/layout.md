---
title: layout
summary: Decides the page-level structure, one design per viewport, the frame, grouping, overflow, scroll, URL state, direction, navigation and what a public page owes machines.
---

# Layout

This lane decides everything above the component: which composition each viewport gets, where the margins sit, how things group, what happens when content grows or scrolls, what lives in the URL, and what a public page must carry for crawlers and link previews. Open it before building any new screen and when reviewing one in a browser. A project's `.design` file or DESIGN.md outranks every default here; the numbers below are starting points for a project that has none.

## Decide first

```text
1. Medium?      marketing -> asymmetry inside the frame, bento, one hero moment
                product   -> hold the grid, symmetric, no reveal, every state designed
                onboarding -> marketing's delight budget, product's layout discipline
2. Content?     form                -> one column, top to bottom, no exceptions
                prose, docs         -> centred column, max-width 65ch (or 720px)
                comparable widgets  -> symmetric grid
                landing page        -> 12 columns, then one deliberate break
3. Viewports    compose 390, 768 and 1440 separately. Never scale one into another.
4. Frame        one gutter both sides, one h1 that says what this is, a heading per section
5. Grouping     space, then a background shape, then a line. Stop at the first that works.
6. Growth       pseudo-localize +30 to 40%, zoom text to 200%, paste a long URL. Fix what clips.
7. Scroll       pick the sticky option, leave page scroll native, anchor lists that change above the view
8. State        anything visible goes in the URL
9. Direction    start and end, never left and right
10. Public?     title, description, preview image, crawl rule, icons, the paying flow walked end to end
```

## One design per viewport

- **Design each width as its own composition** because a desktop layout bent by breakpoints reads as designed once and squeezed twice. Components stay identical across widths; only their arrangement changes.
- **At narrow width, crop closer, drop or stack the secondary piece, and keep the action and its result whole** because shrinking a 1000px hero into a 390 column turns 13px row names into about 5px.

| Desktop | Phone |
|---|---|
| Sidebar plus main | Bottom tab bar plus full-width content |
| 3-column card grid | Horizontal carousel, or a vertical stack in a new priority order |
| Hero with image right | Stacked hero, image full width below |
| Dense table | One card per row, key fields first |
| Hero demo, 900 to 1100px window at 1:1 | Its own 358-wide design in a 390 viewport (switch below 560; 358 x 320) |
| List row: title, labels, avatar | Labels column dropped, title shortened |
| UI type 11 to 15px | Nothing under 10px |

- **Cap prose at `max-width: 65ch` (or 720px) with 24px side padding, even on a 4K monitor** because a 2400px line is unreadable and spare width is not a reason to fill it.
- **Start landing pages on `repeat(12, 1fr)` with a 24px gap** because 12 divides into 1, 2, 3, 4 and 6, which gives thirds, quarters and a 3/9 sidebar split from one grid.
- **Break the grid only on marketing pages, and only on purpose**: a hanging quote mark, an illustration overlapping a divider, a callout bleeding past its column. In product UI an asymmetric grid looks broken.
- **In a bento, let tile size carry hierarchy: one hero tile, each tile self-contained** because equal tiles with random spans read as a broken grid, not a composition.
- **Take breakpoints from the content, written in `rem`**: break where the sidebar squeezes text below its measure or a column drops below a usable width, never at 768px because a preset says so. `rem` lets a larger browser font size reach the narrow layout.
- **Give reusable components container queries, not viewport queries** because a card with a viewport query breaks the moment it sits in a narrow sidebar.

```css
.parent { container-type: inline-size; }
@container (width < 400px) { .card { /* narrow layout */ } }
```

Two traps: the query styles only descendants, never the container itself; and a shrink-to-fit container (a flex item with no width, an inline-block, an absolute box) collapses to zero under size containment. Always give it a definite width.

## The page frame

Readers judge the frame before any typeface or shadow. Each rule is a measurement on a render at 1440, 768 and 390.

| Rule | Passes when | Fails when |
|---|---|---|
| One pair of equal margins | Left and right agree within 16px; header and page share one inset | Sides drift by 16px or more |
| Text off the edge | 16px or more on desktop, 12px or more on a phone | Any text box closer |
| Use the width | A section of 12+ words fills both halves | About half the width is plain ground (about 1 section in 100 on strong pages) |
| No holes | No empty run over half a screen | One empty block is 28% or more of the first screen; a section gap passes about 40% of a screen |
| Say what this is | The first screen's `h1` is readable on first paint and names the thing | Missing, a slogan only, or waiting on a reveal (15 of 97 studied sites) |
| Title every section | Each section of 30+ words opens with a heading on one shared left edge | 82% of studied sections had one: median 57px, about 3.5x body |
| Few left edges | The three most-used left edges hold 60% or more of left-aligned text | Under 60% |

- **Space sections 120 to 240px apart on desktop and 72 to 112px on a phone, with at least twice the space above a heading as below it** because the section gap must be clearly larger than any gap inside a section. Gaps stretched to 250 to 760px are the first cause of holes.
- **Allow one deliberate rest per page, and close it** with a picture that has type docked at its edge, a headline big enough to span it, or a wordmark and one fact in the corners. Two near-empty screens fail.
- **When a section looks empty, enlarge its main element or cut the section** because adding a decoration almost never fixes a hole.
- **Never pad a footer to `100vh` or pin a scene that holds nothing for several screens** because both produce holes.
- **Keep asymmetry inside the frame** (an anchor line at a third or at 42%), never in the margins.
- **Run one figure language down the page: one ground, one gutter, one hero shadow, one radius set** because a second shadow or radius must mean something or it reads as a mistake.
- **Bleed the hero window off a corner with no plate behind it**: top-left whole, 15 to 35% running past the right and bottom of its column, one gutter (64px at 1440, 16px at 390). No edge crosses or stops short of the gutter by under 24px. A whole window centred on a tinted plate is a box inside a box.

## Grouping and alignment

- **Group with space first, a background shape second, a separator line last** because proximity adds structure with no ink. A separator that space would carry gets deleted.
- **Make the gap between groups at least 2x the gap inside one** (8px inside, 16px or more between) because equal gaps say nothing belongs together. Uniform generous padding is not grouping.
- **Give every control a background, a border, an underline or a fixed zone such as a toolbar** because a control styled like the text beside it does not read as a control.
- **Put everything on a small set of shared edges, one spacing step per nesting level (16px default)**.

| Between | Start at |
|---|---|
| Adjacent bordered or filled controls | 12px |
| Visible glyphs of borderless text or icon buttons, padding counted | 24px |
| Unrelated control groups | 24px or more |
| Words and any card edge | 12px |
| Title and subtitle of one row | line-height 1.3 plus about 2px (4 to 6px of ink) |
| Neighbouring rows | fixed `gap` of 8 to 12px, never leftover `space-between` |

- **Never let expanded hit areas overlap** because with borderless controls the space is the only boundary.
- **Inset a full-width mobile button 16px inline, with `calc(16px + env(safe-area-inset-bottom))` below** because a button glued to three edges reads as system chrome and clips on curved corners.
- **Bleed backgrounds and media to the viewport edge; keep text and controls inside margins and safe areas.** For a full-bleed child inside an article: `grid-template-columns: 1fr min(65ch, calc(100% - 48px)) 1fr`, children in column 2, the bleed across `1 / -1`.
- **Allow one primary action per view and at most three secondaries; the rest go behind a menu.**

## Growth and overflow

- **Size text boxes with `max-width` and `min-height`, never fixed `width` or `height`, and let rows wrap (`flex-wrap: wrap; gap: 12px`)** because translation lengthens short strings most: a `width: 96px; overflow: hidden` button truncates in German.
- **Where height must cap, pair `max-height` with `overflow-y: auto`** so text survives 200% zoom.
- **Never place a critical action where clipping can reach it**: the bottom of a resizable pane, a modal taller than the viewport, anything the keyboard covers. Keep it in flow, at the top, or in a sticky footer with safe-area padding.

| Symptom | Fix |
|---|---|
| `1fr` track or flex child overflows with long text or a wide table | `minmax(0, 1fr)` on the track, `min-width: 0` on the child |
| `width: 100vw` scrolls sideways on desktop | `width: 100%` (`100vw` includes the scrollbar) |
| `height: 100vh` pane hidden behind the mobile toolbar | `100dvh` |
| Modal taller than the viewport | `max-height: 100dvh`, scrolling body, action row outside the scroll area |
| `env(safe-area-inset-*)` resolves to 0 | Add `viewport-fit=cover` |
| A horizontal scrollbar "fixed" with `overflow: hidden` on the parent | Find the child that refused to shrink; the clip hides the bug and the content |

- **Let the next item of a horizontal row peek 16 to 32px** (`flex: 0 0 calc(100% + gap - peek)`, `scroll-padding-inline` matching the padding) because a row that ends exactly at the edge looks complete and nobody scrolls it.
- **Name what a disclosure hides**: "Show 12 more results", never "More".
- **Give every truncated value a way back**: an expand control, a detail view, or a tooltip that also opens on keyboard focus. A hover-only `title` never counts.
- **Keep a number and its unit in one `white-space: nowrap` box** so "ft" never sits alone on a line.
- **Fade a scroller's edge only on the side that hides rows, set from scroll position**, 8px per edge with a `.15s ease` transition; no fade at rest and none at the end of the scroll. A permanent fade on a list that never scrolls is decoration.

## Sticky and scroll

Pick exactly one sticky treatment for a top bar:

| Option | Spec | Use for |
|---|---|---|
| Solid | `position: sticky; top: 0; background: var(--bg-base); border-bottom: 1px solid var(--border-default)` | Default |
| Hide down, show up | `translateY(-100%)` when scrolling down past 100px, `translateY(0)` on any scroll up | Long pages where nav is wanted on return |
| None | The bar scrolls away | Articles and docs |
| Tuned blur | `blur(6px)`, palette background at 0.85 alpha, the same 1px bottom border; marketing pages only | When blur is the brand |

- **Never ship `rgba(255,255,255,.7)` plus `backdrop-filter: blur(12px)` on every route with no bottom border** because that exact recipe is the generated-landing-page signature, and content bleeds under it. See [tells](tells.md).
- **Test any blurred sticky bar in Safari and Firefox** because `backdrop-filter` misbehaves with sticky positioning and `overflow: hidden` parents.
- **Set `scroll-padding-block-start: var(--header-height)` on the scroller** so anchor targets and focused elements never land under sticky chrome.
- **Leave vertical page scroll native. Snap only a contained scroller**: a single-row carousel, a gallery of explicit slides, a first-run step sequence. Test snap on a real iPhone, where it fights the collapsing URL bar.
- **Never intercept, slow, lock or snap the page scroll, and never animate scroll-up differently from scroll-down** because the same gesture then produces different results and the OS scroll feels broken. Content tracks the finger 1:1.
- **Limit scroll-driven effects to a reading-progress bar and motion scrubbed 1:1 with scroll.** Timing and easing belong to [motion](motion.md).

### Scroll anchoring

When rows above the view change height (an image loads, older messages prepend, a resize reflows), anchor to a row, never to a pixel offset. Use it for feeds, chat logs, virtualized lists and reflowing galleries.

1. Read `scrollTop` once at the start of the frame.
2. Compare it by value with the number stored last frame. Different: the user scrolled, so pick a new anchor (the first row whose bottom is below `scrollTop`) and record its screen offset, row top minus `scrollTop`. Same: data or size changed, keep the old anchor.
3. Lay out. If the anchor's top moved, set `scrollTop = anchorTop - anchorOffset`.
4. Write the DOM first and scroll last with `behavior: 'instant'`. Write a spacer's new height before the new scroll position or the browser clamps to the old height.
5. Read `scrollTop` back and store that value, because a request for 10.6 is kept as 10 or 10.5 and storing 10.6 fakes a user scroll on the next frame.

- **Never infer user scrolling from scroll events** because your own `scrollTo` fires one, and React 18 batches a handler's flag with an unrelated data update and skips the adjustment exactly when rows shifted.
- **Keep the offset recorded when the anchor was picked** because adding a per-frame delta drifts 3 to 4px over a 15-step continuous resize.
- **Set `overflow-anchor: none` on the scroller when anchoring in code** so the browser's built-in anchoring does not move the view a second time. CSS `overflow-anchor` alone is enough for simple pages.
- **Lay rows out on whole pixels** because fractional row tops jitter by a sub-pixel each frame. A view showing the end of a list keeps showing the end after an append.

## Direction and RTL

Write leading and trailing from the first line, because retrofitting means auditing every rule.

| Physical | Logical |
|---|---|
| `margin-left`, `padding-right` | `margin-inline-start`, `padding-inline-end` |
| `left`, `right` | `inset-inline-start`, `inset-inline-end` |
| top and bottom margin or padding | `*-block-start`, `*-block-end` |
| `text-align: left` | `text-align: start` |
| `float: left` | `float: inline-start` |
| `border-top-left-radius` | `border-start-start-radius` |
| Tailwind `ml-4`, `pl-4`, `left-0` | `ms-4`, `ps-4`, `start-0` |

- **Keep safe-area insets physical and override per direction** because `env(safe-area-inset-left)` is the left edge of the glass in every language. Mixing `inset-inline-*` with a physical inset is the bug.

```css
.fab { right: calc(16px + env(safe-area-inset-right)); }
[dir="rtl"] .fab { right: auto; left: calc(16px + env(safe-area-inset-left)); }
```

- **Add a `[dir="rtl"]` override for `translateX` and `background-position`** because neither has a logical form. A slide-in drawer's transform needs one.
- **Keep visual order equal to DOM order; never reorder with `order`, `row-reverse` or grid placement** because focus and screen readers follow the DOM.
- **Mirror only icons whose meaning follows reading direction**: back, forward, reply, progress chevron, list indent. Never a play triangle, clock, checkmark, logo or slash.
- **Set `lang` and `dir`, and wrap any value that may run the other way (username, product name, URL, number) in `<bdi>`**. Never reorder digits by hand.

## Information architecture and URL state

- **Name and arrange things by the user's model, not the codebase or org chart**: "Send messages in the background", never "Enable async relay mode".
- **Split settings past about a dozen options into named side-nav sections, each page under a dozen** because forty toggles on one page have no hierarchy.
- **Show what most users need and put rare options one level deeper under a label that names them**, or reveal a feature when it becomes relevant (a swap control once the wallet holds two tokens).
- **Use tabs only for views of one thing** (week, month, year; a record's Overview, Activity, Settings). Unrelated destinations are navigation.
- **Stop at two menu levels.** Flatten a third, or move depth into pages with breadcrumbs and a URL that carries the location.
- **Treat search logs as rename requests**: if people search "invoices" while the nav says "Billing", rename the item. Rename before restructuring; the label is a one-line fix.
- **Never leave the primary action only at the foot of a long page.** Anchor it in a sticky bar or the header.
- **Set destructive actions apart by space and a visual break**, never beside confirm as an equal.
- **Deliver first value before any tour**: creating the first project in one step beats eight tour stops.
- **End no screen in a dead end**: an empty view says why and carries the button that fills it; an error names the failure and one recovery ("That link expired. Request a new one").

### State in the URL

**Anything the user can see must be rebuildable from the URL** because a link that can be shared, bookmarked and restored by Back is a feature.

| State | Where | Example |
|---|---|---|
| Page | path | `/projects/acme/issues` |
| Tab | query | `?tab=closed` |
| Filters | query, comma-separated | `?status=open,blocked&assignee=me` |
| Sort | query | `?sort=-updated_at` |
| Pagination | query | `?cursor=eyJpZCI6...` |
| Panel or modal | query | `?panel=settings`, `?modal=invite` |
| Search | query | `?q=auth+bug` |

- **Never put these in the URL**: form drafts (local storage), auth (cookies), toast visibility, text-cursor position, hover or focus.
- **Read from the URL and write through the router; never mirror it into local state** because two sources drift. Omit the default value from the query, and push with scroll disabled (`{ scroll: false }`).
- **Back and forward restore scroll to the same row.** Verify the router does it; if a custom scroll lock broke it, fix the lock.
- **Keep URLs under about 2000 characters.** Past that, encode the state as base64 JSON or store it server-side behind a short key.

## Marketing pages and what machines read

Marketing is visited once or twice; product is used hundreds of times. Marketing may break the design system, use custom type and loose density; product may not. That licence covers one hero entrance and explanatory motion, never a reveal on every section.

- **First viewport: brand, one headline, one supporting line, one CTA group, one dominant visual.** No stat strips, card soup or floating promo chips.
- **No preloader; the `h1` readable on first paint; any load sequence over by 1.2s** because 60 of 99 studied award sites opened on a loading screen, a third were unreadable at 4.5s, and only usability scores fell. Scroll hijacking scored 6.01 on usability against 6.50.
- **Motion maps to user input**: no scroll-triggered fade-ups, no auto-advancing carousels, no parallax that is not 1:1 with scroll. A section that fades in is bare ground until it fires.
- **Gate intro sequences with `sessionStorage`** so internal navigation skips them and a new visit sees them. `localStorage` kills them forever.
- **One product demo may lead a viewport**: about 720 x 340 beside copy, loop 10 to 16s in three to five beats, payoff held 2s, stopped offscreen, a visible pause control when it moves over 5s, and the payoff frame as `poster` and as the reduced-motion state.
- **Feature grid: one stage per tile, tile copy as page HTML at 17 to 24px outside the picture, window chrome at most once.**
- **Pre-render blog, docs and changelog at build time with revalidation.** Preload fonts (`<link rel="preload" as="font" type="font/woff2" crossorigin>`) and above-the-fold images; lazy-load the rest.
- **Keep hover-revealed nav submenus in the DOM when closed** because crawlers and assistive tech need the markup.
- **Switch CTA copy and destination on auth state** ("Get started" logged out, "Open app" logged in), resolved on the client, because reading cookies in the layout opts the page out of static rendering.
- **Docs: a copy button on every snippet, a `.md` URL for every page (`/docs/getting-started.md`), a visual example per concept.** Blogs and changelogs: RSS at `/blog/rss.xml` and `/changelog/rss.xml`, `text-wrap: balance` on headings.
- **Code-built illustrations get `role="img"`, `aria-label`, `user-select: none`, and `pointer-events: none` unless interactive.**

| Item | Rule | Severity |
|---|---|---|
| Title | One template in the root layout (`%s · Product`), per-route metadata, dynamic routes from the record; words taken from the `h1` | Blocker |
| Description | Taken from existing copy (hero subhead, post excerpt); flag the gap when none exists | Blocker |
| Metadata base | Production origin set, or relative image URLs resolve to localhost | Blocker |
| Preview image | `og:image` at least 1200x630, absolute URL, file exists, `summary_large_image` card; shows the result, never mid-change | Should fix; blocker when launch depends on sharing |
| Crawl rules | No leftover `Disallow: /` or site-wide `noindex`; sitemap lists real pages only; canonical on any page reachable at two URLs | Leftover block: blocker |
| Icons | Own favicon (checked on a dark tab bar), SVG icon, `apple-touch-icon`, manifest with the real name; the real mark, never a letter in a coloured square | Should fix |
| Paying flow | Landing, CTA, signup or checkout, first screen: every link resolves, page price equals billing config, no `/test_` checkout links, no placeholder handles, no form posting nowhere | Blocker |
| Analytics | Loaded once from the root layout, async; a consent banner never pushes content down | Should fix |

A missing preview image, a price mismatch and a consent decision cannot be settled in code: state both values and hand them to a human.

## Never ship

| Never | Instead |
|---|---|
| A 1000px hero scaled into a 390 column | A 358-wide recomposition, nothing under 10px |
| Prose running the full width of a wide monitor | `max-width: 65ch` or 720px |
| Left and right margins that differ by 16px or more | One gutter, 64px at 1440 and 16px at 390 |
| Six equal gaps in a card of three items | Between-group gap at least 2x the within-group gap |
| `width: 96px; overflow: hidden` on a label | `max-width`, `min-height`, wrapping |
| `width: 100vw`, `height: 100vh` panes | `100%`, `100dvh` |
| `overflow: hidden` to kill a sideways scrollbar | `minmax(0, 1fr)` and `min-width: 0` on the offender |
| `blur(12px)` over 70% white on every route | Solid bar with a 1px bottom border |
| Page-level scroll snap, hijack or lock | Native page scroll, snap only contained scrollers |
| `useState` for a tab, filter, sort or modal | A query param read from the URL |
| `margin-left: auto`, `[dir="rtl"] svg { scaleX(-1) }` | `margin-inline-start: auto`, mirror only the back arrow |
| A third nested dropdown, 40 toggles on one page | Two levels, named sections under a dozen options |
| A preloader, or an `h1` hidden until a reveal | Title readable on first paint, load sequence done by 1.2s |
| `<title>` left at the framework default, `og:image` on localhost | `h1` through `%s · Product`, absolute 1200x630 image |

## Check

- Screenshot at 1440, 768 and 390. Measure left and right margins (within 16px), nearest text to the edge, the tallest empty run, and the between-group over within-group gap ratio (2 or more).
- Put the wide and 390 shots side by side. If the 390 frame is the wide one shrunk with nothing cropped, dropped or restacked, it was not designed.
- Shrink a screenshot to thumbnail size and count the blobs: one per record, not one per line.
- Rerun at 390 with pseudo-localized copy (+30 to 40%), one long-string locale such as German, and 200% text. No clipped label lacks a way back; no unit sits alone.
- Screenshot LTR and RTL at 390 with real Arabic or Hebrew strings and an LTR brand name inside an RTL sentence. The RTL shot is a mirror except play, checkmark, clock and logo. Tab through it: focus moves right to left in reading order. Flipping `dir` in devtools with English copy is not a test.
- Film a scroll down and back up at 390: content tracks the finger 1:1, the bar never covers a row without its rule, fades appear only on edges hiding rows.
- Film a 15-step continuous resize and a prepend of 20 messages: the anchor row holds the same screen offset on every frame.
- Set a filter, a sort and an open modal, paste the URL into a private window and compare screenshots. Open a row, press Back: the list returns to the same row.
- Put the ten most frequent search queries beside the nav: each matches a label word for word or sits one click under one. Count menu levels on the deepest path: two.
- Film a marketing page at 1440 and 390 with reduced motion on and off: the poster alone tells the story, nothing on the first screen waits for a reveal, one thing moves per viewport.
- Paste the production URL into two chat apps on a phone: title, description and image text each came from the page, none cut mid-word.

## Where sources disagree

- **Reveal on scroll.** One source lists a subtle scroll-in fade as a valid use of scroll-driven animation; the marketing checklist bans scroll-triggered fade-ups of page content; Benji Taylor's bento rule lets a supporting tile play one small motion once as the grid scrolls in, staggered 80 to 120ms in reading order. This file uses the ban.
- **Parallax.** One source allows backgrounds at 0.7x scroll speed and forbids 0.3x or below (nausea); the marketing checklist allows only 1:1. This file uses 1:1.
- **Minimum motion.** taste-skill's inspector fails a page where fewer than 8 elements move. This file sets no floor: the permitted extra is one first-run hero moment.
- **Scroller edge fade.** Stageshow's kit fades 18px on both edges once a list has scrolled; its teaching example fades 8px on only the edge that hides rows. This file uses 8px per hidden edge.
- **Strings.** Faux product UI picks names short enough to fit. A shipped product does not choose its strings, so this file designs for the longest one.

## Sources

- Jakub Krehel, interfaces skills (MIT, github.com/jakubkrehel/skills): `better-layout` (grouping, shared edges, clearance, growth, logical properties, the floating-button recipe), `better-ui` icons in RTL, `better-typography` language and bidi.
- Benji Taylor, Stageshow 1.1.1 (MIT, github.com/benjitaylor/skills): framing, bento, compact layouts, edge fades, list reflow, poster rule.
- Benji Taylor, "Family Values", benji.org/family-values (progressive disclosure).
- Leonxlnx, taste-skill v2.1.1 (MIT): layout and motion references, the October 2026 studies of 97 and 99 Awwwards Sites of the Day. Its usability and design marks are model-panel judgements of screenshots, not human jurors.
- Cheng Lou, chenguini and handwired (both MIT): scroll anchoring, the React 18 pitfall, the 3 to 4px drift, `overflow-anchor: none`.
- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT): marketing pages, per-section reveals removed and the hero kept.
- Vercel Web Interface Guidelines: URL as state, deep-link everything, scroll positions persist.
- guidelines.sh: design for each viewport, narrow columns, 12-column grids, blurred sticky sections, scroll hijacking, marketing versus product.
- web.dev, scroll-driven animations documentation.
- Bento Grids, bentogrids.com.
- W3C, CSS Logical Properties and Values Level 1.
