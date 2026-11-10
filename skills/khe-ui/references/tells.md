---
title: tells
summary: Finds the defaults that make a UI, its code or its copy look generated, and returns a numbered deletion list with what goes in their place.
---

# Tells

This lane decides what to delete from a screen, a diff or a block of copy that reads as generated, and what to put back so it reads as made by someone. Open it when a screen "looks AI", before any generated page ships, and after any agent-written change. A project's `.design` file or DESIGN.md outranks every default here: a contract colour that happens to be violet is a choice, not a tell.

The test for every element: could this have been produced in 30 seconds from a prompt with nothing specified? Nobody spots one tell; they spot fifty median choices compounding. The list is anti-default, not anti-generation.

## Decide first

```text
1. SQUINT    Could this screen belong to any of 10,000 products?
             Cover the logo. If the logo was the only tie to this product, everything is up for review.
2. SUBTRACT  Walk every icon, line, badge, caption, container and word.
             Ask "what breaks if this is gone?" Nothing breaks -> delete.
             Walk twice: round two finds what was only balancing something round one removed.
3. SWEEP     In this order: colour, type, layout, decoration, icons, proof, copy, motion.
             Then code (if there is a diff) and leftovers (if it is shipping).
4. PUT BACK  One point of view: a derived palette, one type decision, the real product on screen.
5. AUDIT     "What here would make a designer suspect a model built this?" Fix, repeat until nothing.
6. STOP      When you can name the one choice a competitor could not copy-paste.
```

**Always subtract before restyling.** Deletion is free, cannot add a new tell, and gives every survivor hierarchy for nothing. "Adds visual interest" and "fills the space" are the reasons the model put the element there.

**Always sweep colour first.** It is the loudest tell: a page survives a common layout, it does not survive indigo-to-purple.

**Never stop after step 3.** A screen scrubbed of tells with no chosen opinion is still generic, only more quietly.

### Output

A numbered list, most visible first, one tell per line. Deletions come before replacements.

```text
1. DELETE   pill badge above hero h1 (Hero.tsx:14)           label repeats the heading
2. DELETE   3 of 6 feature icons                             nothing breaks without them
3. REPLACE  from-indigo-500 to-purple-600 -> var(--surface)  unchosen gradient, no job
4. REPLACE  "Get started" -> "Create project"                names the action
Not checked: dark theme, 390 wide
```

## Colour, type, layout, decoration

| Tell | Put in its place |
|---|---|
| Purple, indigo or fuchsia gradient on the hero; any gradient with no job; more than one gradient | Neutrals plus one true accent, derived from the domain, brand or content |
| Dark-and-neon as a "premium" costume | A palette with a source you can name |
| Pure `#000` dark background | `#18181b` with a slight hue |
| Pure `#ffffff` text on dark | `rgba(255,255,255,0.92)` |
| `0 2px 8px rgba(0,0,0,0.1)` shadow; glow such as `0 0 24px #6366f166` on card, button and dot | Layered shadow at 4 to 6% opacity on a `#111` base, e.g. `0 0 0 1px #0000000d, 0 6px 18px #0000000f` |
| Gradient text (`background-clip: text`) | Solid ink; size and weight carry emphasis |
| Inter or SF Pro on a marketing page; `Inter font-black tracking-tight`, centred | A chosen sans (Geist, Pangram, Displaay). One distinctive type decision per project; three is a costume party |
| Tiny tracked caps: `RECENT DEPLOYS`, eyebrows, kickers | Sentence case (`Recent deploys`), or fold the words into the heading |
| Rows of text at 9 to 10px | 14px names, 12px metadata |
| Gradient button fill with no reason | Solid colour plus a quiet shadow |
| Hero of pill badge, centred headline, one-line subhead, two buttons, orb | Layout chosen after content: the real product, cropped with intent |
| Hero + 3 icon cards + FAQ; bento as three cards with better kerning | One feature full-width with a real screenshot; six small ones become a list; unequal features get unequal space |
| Centred single column top to bottom; one card pattern for unrelated content; every page one template | Section width and layout follow the content type |
| Asymmetric grid on a product screen; scroll parallax on product UI | Keep both for marketing pages |
| Glass with nothing behind it; blurred orbs and blobs | Delete |
| Border and shadow and ring and gradient on one card | One edge treatment |
| One radius everywhere (`rounded-2xl` as every answer) | A radius scale, see [color-and-surface](color-and-surface.md) |

### What prevalence data says

Measured on 246 gallery sites, split by a model panel into top (82 sites) and weak (23 sites). These are model judgements of one screenshot per site, so they track fashion as much as quality.

Delete on sight (top / weak): icon-topped feature cards 1% / 28%, tiny tracked caps 16% / 57% (three or more on a page: 6% / 43%), gradient text 2% / 13%, pill label above a heading 5% / 26%, five or more resting shadows 10% / 30%, emoji 10% / 26%, gradient fills 22% / 52%.

A choice, not a tell: backdrop blur 32% / 39%, the italic-serif accent word 4% / 7%, thin rules 61% / 52%. Monospace labels are more common on top sites, 44% / 24%.

One site in 246 has a terracotta button and none has a violet one.

## Icons, motion, sound

| Tell | Put in its place |
|---|---|
| Emoji as feature markers or UI | An icon from the set, or nothing |
| A reflexive or mixed icon set; hand-drawn glyphs in rainbow squircles | One pack at 16px, stroke 1.75, status shown by colour only |
| Sparkle, wand or gradient "AI" chip | A plain label naming what happens: `Explain failure`. The product's own mark is fine |
| Translucent icon ink (darker where strokes cross) | One opaque colour per icon; a lighter icon is a lighter opaque grey |
| Two icons cross-fading by opacity (double exposure) | Rotate one icon when the change is angular; otherwise scale 0.25 to 1 with blur 4px to 0 |
| `fade-in-up` on every block; one easing everywhere | Motion only where it explains a change, see [motion](motion.md) |
| `hover:scale-105` on cards that are not clickable; hover motion on touch | Delete; gate real hover behind `@media (hover: hover) and (pointer: fine)` |
| Pulsing blobs, `animate-bounce`, `animate-ping` | Delete; a pulse is for a live state only |
| Bouncy spring on a daily-use button | Fast, quiet easing |
| Spinner with no ETA | Skeleton, progress bar, or nothing |
| A click on every button, a whoosh on every transition; sound on by default | Sound on daily and rare moments only, off by default, persisted toggle. See `khe-sound` |
| Stock-pack sounds; a "futuristic blip" with a reverb tail | One material, dry and short |

## Fabricated proof and placeholder content

**Never invent proof.** An honest gap beats a fake testimonial, and fake proof is the one tell that costs trust instead of taste.

| Tell | Put in its place |
|---|---|
| "Trusted by 10,000+" on an unlaunched product; a wall of 6 greyscale logos nobody agreed to | Real numbers and opted-in named quotes, or cut the section |
| "100+ customers", "1000+ projects", "Hundreds of integrations" | The real count: "127 customers", "1,243 projects", "26 integrations" |
| "This product changed our company." John Doe, CEO | A quote with a metric and a person: "12 deploys a week to 47 in the first month", name, role, company |
| Lorem ipsum, "Coming soon", "Section Title", "Learn more" with no destination | Real copy, or remove the section. No real copy means the design is not ready |
| John Doe, Jane Doe, Acme Inc, `user@example.com` | Believable names and values that fit the layout: `Jon Park · Owner`, `maya@northwind.com` |
| Six rows of "John Doe · $100.00" | Three real rows (the selected one and its two neighbours), bars at varied widths (84, 64, 78) for the rest |
| Stock photos of a smiling team | A real product screenshot, a real unposed team photo, a custom illustration, or no image |
| `v1.0` forever, no dates | Real version numbers (`v4.7.2`), timestamps on changelog entries, "as of this week" |

**Budget 3 to 7 real strings in a product shot.** Real words everywhere is as wrong as none; each string names a specific thing.

**Fit the fixture to the layout.** A believable name that truncates or wraps at 390 wide makes the screen look broken.

**Use only opted-in customer data.** Fictional examples are marked as fictional. Internal admin tools and early prototypes are exempt, until the prototype ships.

## Copy

Strip in this order: words, sentences, punctuation, claims. Then put a voice back.

| Generated | Write |
|---|---|
| delve into | look at |
| crucial, pivotal | important, or name the consequence |
| leverage, utilize | use |
| facilitate | help |
| enhance | improve, or the specific change |
| showcase, underscore | show |
| landscape, tapestry | field, mix, or delete the sentence |
| additionally | also |
| in the event that | if |
| serves as, boasts, offers | is, has |
| seamless, robust, stunning, vibrant | describe the thing; the reader supplies the adjective |
| "Get started" | the action: "Create project" |
| "Awesome!", "Oops!" | "Saved." and "Couldn't save. Try again." |
| "Click here to view..." | "View details" |
| "Unleash your potential", "The all-in-one solution for" | a claim with a number: "Saves our analytics team 4 hours a week" |

- **State Y.** "Not just X, but Y" is a runway. If Y cannot stand alone, Y is the problem.
- **Count the real items.** The rule of three is a habit: write two or five.
- **Kill false ranges** ("from startups to enterprises"): list the things or name the one that matters.
- **Repeat the word.** Cycling synonyms hides the subject.
- **Name the actor, one idea per sentence.** Passive voice hides who does what.
- **Hedge once at most.** "Could potentially" is a refusal to commit.
- **No em dashes in copy you write.** Use a full stop or a comma. Colons introduce lists and do not join clauses.
- **Bold is for scanning.** A bold label plus colon that restates its own line is the strongest formatting tell.
- **Sentence-case headings, no decorative emoji.** Straight quotes in source prose, curly quotes in rendered UI copy.
- **Delete** filler ("in order to", "it is important to note that"), trailing "-ing" conclusions (", ensuring reliability"), puffery ("a testament to"), closing lines ("exciting times ahead") and chatbot residue ("I hope this helps!").

**Two tests for every product sentence.** Can it be restated as a concrete instruction, fact or number? Could it appear unchanged in another product's docs? Fail either, cut it.

**Put a voice back.** Clean and voiceless is its own tell, and the pass is not "shorter": a sentence of bare nouns reads as generated too. Write the sentence a specific person would say about this product: "Conversion fell from 3.4% to 2.7% after the new address step went live on Tuesday."

## Code

Generated code runs, and still buries intent. Scan in order: comments, defence, types, names, structure, logging, tests, scope. The default fix is deletion.

| Tell | Fix |
|---|---|
| Comments that narrate, note the edit, divide sections, restate a signature; commented-out code | Keep a comment only when it says what the code cannot: a constraint, a unit, a tradeoff, the bug worked around |
| Null checks the types already guarantee; validation at every layer | Fix the type once |
| Catch-log-rethrow, empty catch, `catch (e) { console.error(e) }` then continue | Handle once at a real boundary with context, or do not catch |
| Silent fallback: `catch { return [] }`, `?? default` over a failed fetch | Throw. Tests stay green while the main path is broken, so this is the most dangerous item |
| `as any`, `as unknown as X`, `@ts-ignore`, a silencing `!` | Fix the error; a cast survives only with a comment stating the invariant |
| `data`, `result`, `item`, `handler` | The meaning: `unpaidInvoices`, `retryDelayMs` |
| `fetchDataV2`, `EnhancedButton`, `utils-new.ts` | Replace the old thing and take its name |
| One-call wrappers, one-caller options objects, one-implementation interfaces, unused imports, `TODO: implement` stubs | Delete |
| A hand-styled lookalike of a component the repo has (`btn-new`, a card `div`) | The existing component through its props and tokens |
| `console.log('here')`, success logs with a tick emoji | What an operator needs, in the repo's logger, or nothing |
| A test deleted, skipped, weakened, or re-deriving the implementation | Assert an independently known outcome |
| Unrelated cleanup in the diff | Propose it separately |

**Choose the loud failure.** When removing a cast, catch or fallback forces a choice, a throw or a failed build beats a quiet wrong answer.

**Match the room.** Mirror the repo's comment density, naming and error idiom. Deleting to a standard the codebase does not hold is itself a drive-by change.

## Critique from a screenshot

**Always critique the render, never your own code.** Class names say "hero", so you see a hero. Shoot 1440, 768 and 390, first screen and full page, and open them before the code.

Run each pass alone. Blended passes produce "looks good overall".

1. One second: exactly one answer (a word, an image, an object), not "a website". Then five seconds as a stranger: what is this, who is it for, what do I do next?
2. Squint, cover the logo, then scroll: does the idea reach pricing and footer?
3. Edges: count distinct left-edge x positions. Two or three is a composition, six is placement one at a time.
4. Frame: equal margins, no half-empty section, no empty stretch taller than half a screen.
5. Sameness: one layout word per section (split, list, grid, full-bleed, statement). The same word twice in a row or three times on the page is the template.
6. Phone: 390 is its own composition, not the desktop squeezed.
7. Fullness: no narrow column of small text in dead ground; every requested section delivers its information at a readable size.
8. Collisions: nothing over a headline or button at any scroll position, nothing off the phone's edge.
9. Beside the closest real reference at the same size: name the one difference. If yours is sparser, flatter or smaller, that is finding one.

```text
ROUND n
Seen in one second: ...
Idea (one sentence): ...
Layout words by section: hero=... / ...=...
Top three problems, most visible first: screenshot, finding, fix
```

**Fix in order: idea, hierarchy, composition, type, imagery, colour, detail, motion.** Later items cannot rescue earlier ones.

**Run three rounds at most.** Critique, fix the top three, re-shoot. Stop early when a round finds nothing a stranger would notice; after round three, report what remains plainly.

**Never let subtraction leave the page thin.** In blind tests a richer page full of template devices beat a cleaner thin page every time, and the stripping skill lost to no skill across five rounds (6.6 to 7.7 against 7.5 to 8.0). When a deletion leaves a gap, enlarge what remains or close the gap. Never refill it with an ornament.

The five ways a product shot fails, largest first: too much (real text everywhere), wireframe (grey blobs), boxed (window shrunk into a card with even margins), flat (every object one weight), bland (the brief's look never shows).

## Leftovers and leaks

Nothing here shows as a bug, which is why it is a blocker lane. Find everything, gate what you cannot prove is dead, delete only what is provably dead.

| Leftover | Level | Fix |
|---|---|---|
| Dev panels and inspectors (Leva, Tweakpane, dat.gui, query devtools, grid overlays, flag panels) | Blocker | Gate on the development build and load by dynamic import. `hidden` still ships bytes and still feeds its defaults. Tuned values live in a saved config file |
| `/proto`, `/lab`, `/test`, `/playground`, `/sandbox`, `/debug`, `/styleguide`, auth-dodging previews | Blocker | Return not-found in production builds; robots disallow as a second layer only. Deleting the route is the user's call |
| `console.log`, `console.table`, `debugger`, `alert(`, `JSON.stringify` in a `<pre>` | Blocker when it prints user, session, auth or payment data | Remove and say so. `console.error` in an error boundary or real `catch` stays |
| Public-prefixed env names (`NEXT_PUBLIC_`, `VITE_`, `PUBLIC_`) with SECRET, PRIVATE, SERVICE_ROLE or a non-public KEY; `sk_live_`, `sk_test_`, `eyJ` literals; `localhost`, `127.0.0.1`, tunnel and staging hosts; tracked env files | Blocker | Report file and variable name, never the value. Put "Rotate this now" above the verdict |
| Commented-out blocks; `.only(`, `.skip(`; fresh `@ts-ignore`, `as any` | Should fix | Delete |
| A TODO on an auth, payment, permission or deletion path | Should fix, often the top finding | Read it and quote it verbatim; never delete it |

```tsx
import tuning from './tuning.json'
const DevPanel = import.meta.env.DEV ? lazy(() => import('./DevPanel')) : () => null
```

## Never ship

| Never | Instead |
|---|---|
| `from-indigo-500 to-purple-600` on a hero | Neutrals and one accent with a source |
| `background-clip: text` gradient headings | Solid ink |
| `RECENT DEPLOYS` eyebrow at 10px | `Recent deploys`, 14px |
| Sparkle chip labelled "Ask AI" | `Explain failure` |
| "100+ customers" | "127 customers", or no number |
| "Unleash your potential" | A sentence with a number in it |
| `catch { return [] }` | A throw at a real boundary |
| `<Leva hidden />` in production | Dev-only dynamic import |
| A robots line as the only guard on `/lab` | A 404 in the production build |
| A secret's value in a report | The file and variable name, plus "Rotate this now" |

## Check

- Screenshot at 1:1 at 1440, 768 and 390. Every element you can match to a row above is a survivor: fix one, re-shoot, repeat.
- Shrink the screenshot to thumbnail size. Subject, support and empty space read as one picture.
- Run the two copy tests on every string, then read each string in place at 390 wide. A label that truncates or wraps fails even when the words pass.
- Read only the comments left in the diff. Each says something the line under it cannot. Run typecheck and tests before and after; report pre-existing failures apart.
- Build for production and search the built output, not the source, for the panel's package name, `/lab` and `sk_live_`. Request `/lab` on that build and expect a 404.
- Every finding quotes a screenshot file or a file and line. A frame you could not shoot is listed under "Not checked"; a predicted pass is not a pass. Anything that moves gets filmed.
- A tell cleared by hiding the thing it points at is still open.

## Where sources disagree

- **Lucide.** One catalogue lists the popular Lucide glyphs (`chevron-down`, `arrow-right`) as a tell and names Phosphor, Hugeicons and Tabler as replacements. Benji Taylor counts Lucide among packs chosen on purpose. This file uses the second: the tell is a reflexive or mixed set, not the pack.
- **Icon swap values.** One note gives scale 0.3 to 1 with `blur(3px)`; the review checklist gives scale 0.25 to 1 with blur 4px to 0. This file uses 0.25 and 4px to match [review](review.md).
- **Em dashes.** The copy rules say none; the review checklist flags more than about 4 per page and allows one or two. This file uses none for copy you write, and the checklist threshold when reviewing someone else's.
- **Fix order.** The page critique order is idea, hierarchy, composition, type, imagery, colour, detail, motion. Benji Taylor's order for product shots is framing, hierarchy and density, motion, polish. The second sits inside the first; this file uses the first.

## Sources

- guidelines.sh: the visual, layout, content and microcopy defaults, and the content authenticity rules.
- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT): the subtract-then-sweep pass, copy and code habits, leftovers.
- Benji Taylor, Stageshow 1.1.1 (github.com/benjitaylor/skills, MIT) and benji.org/stageshow: the paired good and bad cards, the string budget, the five failures, critiquing from frames.
- Leonxlnx, taste-skill v2.1.1 (MIT): device prevalence on 246 One Page Love and Awwwards sites, the critique passes, the round write-up and the three-round stop.
