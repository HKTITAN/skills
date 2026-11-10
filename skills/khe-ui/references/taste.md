---
title: taste
summary: Decides whether a piece of polish, delight or detail is worth its cost, and returns a verdict of do it, do less, or do not, with the deciding principle named.
---

# Taste

This lane answers "should we polish this, is it worth the time, why does it feel cheap". Open it when someone proposes an animation, a flourish, a dependency or a day of detail work, when two correct versions compete, or when a screen works and still feels off. It returns a verdict, never an opinion. A project's `.design` file or DESIGN.md outranks every default here.

## Decide first

```text
1. Is it broken?            yes -> fix correctness first. Polish multiplies trust; it never replaces it.
2. Marketing or product?    marketing: seen once or twice. product: seen hundreds of times.
                            onboarding: marketing's delight budget, product's layout discipline.
3. How often is it seen?    read the tier from the frequency table. The tier caps the delight.
4. What does it cost?       build time, a dependency, bytes, a state to maintain.
5. Can you name it?         write "name: measured -> target". No measured value means you have not looked yet.
6. Which need does it serve? safe and predictable > understood > done > enjoyed. Higher wins a tie.
7. Run the verdict procedure at the end of this file. Output: do it, do less, or do not, plus the principle.
```

## Frequency against delight

The more often a person meets a feature, the less delight it can carry before it becomes friction. This is the single rule that settles "should this animate, make a sound, or get a flourish".

| Frequency | Delight allowance | Number |
|---|---|---|
| Every keystroke, every scroll | None. The keyboard never animates. | 0ms |
| Every action: primary button, row hover, menu | Feedback only, no flourish | Responds on the first frame after input; nothing still moving after 200ms |
| Daily: commit, send, save | Small: a tick, a brief highlight | Toast rise 0.6s `cubic-bezier(0.22, 1, 0.36, 1)` |
| Weekly: new doc, share, a finished flow | Medium: a stagger or scale-in | |
| Rare: signup complete, first export, year in review | Big. Confetti is allowed. | Count-up 700ms, digits staggered 45ms |

Per-action reference values: a menu row highlights at 0s and eases off over 0.15s; a button press is `scale(0.97)` with `transition: transform 160ms cubic-bezier(0.16, 1, 0.3, 1)`, and `scale(0.96)` on an icon button.

- **Start per-action feedback on the input, with no presentation delay** because a delayed click feels unresponsive however short the animation. Only storytelling motion may slow down.
- **Never give a daily feature weekly-tier motion** because it feels slow within a week. The micro-stagger that pleased on session 1 nauseates on session 50.
- **Spend the big budget on rare moments** because each encounter there is fresh.
- **When asked to "make it more fun" on a high-frequency feature, make it less visible instead.**
- **First run is the exception**: onboarding is rare per user, so it carries weekly-tier delight even on per-action moments. The budget collapses back the moment onboarding ends.

Exact curves, springs and durations belong to [motion](motion.md).

## Marketing versus product

Decide the medium before reviewing anything, because the same proposal gets opposite verdicts.

| | Marketing | Product |
|---|---|---|
| Visits | Once or twice | Hundreds |
| Goal | Convert, communicate, impress | Get out of the way |
| Asymmetry | Welcome | Reads as broken |
| Motion | One hero entrance plus explanatory motion | Tight, per the frequency table |
| Custom type | Encouraged | Risky at small sizes |
| Density | Loose | Often dense |
| Personality | Front and centre | Earned in small moments |
| Design system | May break it | Never breaks it |

- **Never put a reveal on every section, even on marketing** because it replays on every visit and holds content back from anyone scrolling fast. Keep the hero, cut the rest.
- **In product, earn delight through power features**: keyboard shortcuts, multi-select, bulk operations. They cost little and signal craft on the hundredth session.
- **In product, spend the polish on states** (empty, loading, error, full, dense, sparse) because marketing rarely has them and product has them constantly.
- **Size a product shot for where it is shown**: a 400 x 300 card or a 720 x 340 hero beside copy, 3 to 7 real strings, the window pinned top-left and running off the right and bottom, the payoff held 2s. The product itself shows every row real, at its own width.
- **Mixing the two is a tell**: hero plus three cards plus FAQ on a product page, or a pristine symmetric grid on a marketing page. See [tells](tells.md) and [layout](layout.md).

## Feeling right, not merely working

A screen can be correct, accessible, fast and consistent and still feel cheap. Feel is the last check, run only after those four pass, and automated checks cannot run it.

- **Motion must clarify intent, never decorate.**
- **The first frame and the last frame must both look intended.**
- **Persistent elements stay continuous across a change**; they travel, they never vanish and reappear.
- **Fewer moves read as confidence; a busy screen with five animations reads as anxiety.** A static screen with the right hierarchy, type and colour beats it.
- **"It works but something is off" is never one property.** Look at rhythm and timing across several elements.

| Test | How | Fails when |
|---|---|---|
| Next day | Build, sleep, look again | You no longer like it |
| Phone call | Demo it to someone by voice | They say "wait, what?" |
| Slow motion | Record, play at 25%, step each frame | A frame looks accidental |
| Cold eyes | Hand it to someone who has never seen it | Their first reaction is confusion |
| Contact sheet | Film one full loop plus the start of the next, at the shown width and at 390 | A press pops or the loop seam jumps |

Contact-sheet settings: slow the page 6x and sample every 40ms for a press or a landing; at 390 wide take 6 frames 2500ms apart for the whole loop. A single screenshot of the end state judged "looks fine" is never evidence, because a still cannot show a pop.

## Unseen details compound

The details a person names are mostly noise; the ones they never name decide trust. Each one removes a micro-friction or signals that someone checked. Twenty of them turn "works" into "this feels nice".

| Detail | Value |
|---|---|
| Button press | `scale(0.97)` over 160ms, 0.96 for an icon button, never 0.95 |
| Tooltip delay | 400 to 700ms before the first, dropping to 0ms after the first hover |
| Skeleton | Matches the real layout |
| Dark background | `#18181b`, not pure black |
| Display type | Tracking tightens as size grows |
| Shadow | Three layers at 4% opacity, not one at 10% |
| Unread dot | Hangs 7px into the margin so the row never shifts when read |
| Edges | Line up exactly, or part by at least the gutter, never under 8px |
| Label beside an icon | `text-box: trim-both cap alphabetic` centres it on its capitals |
| Digit in a ring | Proportional figures trimmed to cap height, not tabular |

- **A "functionally complete" pull request is not done.** Ask what was tuned.
- **Spend the last day of a sprint on the unseen**, once features are finished.
- **In a critique, skip the obvious problems and go below the surface** because the obvious ones get fixed anyway.
- **Stop when the cost outruns the frequency**: three days on the loading spinner of a feature that ships once a quarter is procrastination.
- **Polish is leverage, not a cost centre** because most software is functionally undifferentiated and people choose on feel they cannot name. The last 5% of polish takes 50% of the time and is the part a competitor cannot copy in a sprint.
- **Polish never precedes correctness.** A pretty, buggy UI looks worse than an ugly, reliable one.
- **Match polish to the product's segment and audience.** Not every product must feel like Linear, and the best polish is invisible, never theatrical.
- **When two correct versions compete, the calmer, fuller, better-framed one wins over the one that tells more**: four beats in 12s with the window pinned to a corner beats six beats in a whole window floating on even 24px margins.

Per-detail values live in [polish-and-ship](polish-and-ship.md), [typography](typography.md) and [color-and-surface](color-and-surface.md).

## Training taste and naming it

Taste is a trained instinct built from exposure, constraint and attention. An agent trains it per task, from references.

- **Start from a filmed reference, never a blank file or a glance.** Film the closest strong example as a still, copy its structure, then swap in the brief's look and content.

| Keep from the reference | Replace with the brief's |
|---|---|
| Stage size, crop and bleed | The product's own tokens |
| Row and type sizes, spacing | The product's own icons and chrome |
| The beats of the script, the parts used | The product's words, 3 to 7 real strings |

- **A copy that only changes the name is not done.**
- **Constrain first**: two fonts and three colours force decisions; unlimited choice produces average work.
- **Imitate before deviating.** The first hundred buttons look like buttons. A button that matches Linear's beats one that "innovates" with a gradient and a custom shape. Reinventing a solved problem is not taste.
- **Turn every correction into a written rule with its reason, then rerun the work from scratch** because hand-patching the output fixes one instance and teaches nothing.
- **Expect the first version to be ugly.** The third starts to feel inevitable.
- **Between two valid approaches, pick the one closer to the project's reference set.**
- **When someone cannot say why it feels off, ask what references they have studied** because the usual cause is too few.

### Name it precisely

"It feels off" cannot be fixed, handed off or taught. "The leading is too tight and the uppercase labels need more tracking" can. Almost every taste decision has a logical reason, and a reason can be written as a rule.

- **Write every finding as `name: measured -> target`.** If two findings share a name and need different fixes, one name is wrong.

| Vague | Precise |
|---|---|
| "The card text feels cramped" | `tight inset`: the title sits 6px from the card edge; words keep 12px, under 8px is a fault |
| "The stat looks broken" | `unit wrapped`: the unit of "48 ms" drops to its own line; number and unit stay on one line |
| "The label looks off" | `tight stack`: 2px of ink between title and subtitle; 4 to 6px is right |
| "Make it pop" | Raise the contrast to 4.5:1 |
| "The icon looks weird" | The play icon is mathematically centred, not optically centred, so it reads left-heavy |

- **Pair every "do not" with its "because"** so it transfers to the next person and the next prompt. `scale(0.95)` beats `scale(0)` on enter because a real object never deflates to nothing.
- **Hold the confusable pairs apart**: kerning and tracking, opacity and visibility, chroma and saturation, widow and orphan, tag and badge.
- **Show a fault as a pair that changes one thing**: same content, layout and timing, with the exact difference written under each side.
- **Use the shortest unambiguous word, not the most technical**: "the button has no hover state" beats "the affordance lacks a mouseover transition".
- **Point at the exact element as well as naming the fault**: file, line or selector. See [review](review.md).

## Dependency discipline

Every dependency is a tax on bundle size, security surface, version drift, licence review and time to interactive. "It is convenient" is never a reason.

```text
Before installing anything, pause 30 seconds:
1. Can it be written in 5 to 10 lines?                 -> write it
2. Does a native API do it?                            -> use the native API
3. Using 2 functions from a 70KB library?              -> write the 2 functions
4. Is the job mostly edge cases, security-maintained,
   or large and hard to get right?                     -> install one maintained package
5. Small, single-purpose package?                      -> install
6. Otherwise                                           -> do not install
```

| Library | Use instead |
|---|---|
| `moment.js` (300KB) | `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat` |
| `axios` | `fetch()` with a thin JSON wrapper |
| `lodash`, most uses | `Array.from`, `.flat`, `.includes`, `.at`, `Object.fromEntries`, `[...new Set(arr)]` |
| `classnames` | `clsx` (about 240 B, same API); add `cva` only for real variants (size x intent x state) |
| `uuid` | `crypto.randomUUID()` |
| `query-string` | `URLSearchParams` |
| jQuery | DOM API with `closest()`, `matches()`, `querySelector()` |
| IntersectionObserver polyfill | Native, universal since 2019 |

- **Install for these, and only these**: crypto primitives, framework runtimes, date-parsing edge cases (`date-fns`); packages with a security team behind them (payment and OAuth clients); small focused ones (`nanoid`, `clsx`); and jobs that are mostly edge cases: animated digits, OTP paste and autofill, focus-trapped primitives, virtualized scroll, drag and drop. A ten-minute hand-rolled version of those ships the bugs.
- **A motion library earns its place only for springs, layout or exit animations, or gesture-driven values.** A hover, a fade or a press scale stays a CSS transition.
- **Draw geometry in CSS, never as an image file**: dots, rings, dividers, a triangle from borders (`border-left` and `border-right` 10px transparent, `border-bottom` 16px solid). No request, no decoded bytes.
- **Take icons from one icon set, never your own hand** because a hand-drawn glyph's weight never matches its neighbours.
- **Treat any package over 100KB as a budget item**, and be able to give a one-line reason for every bare import.
- **Scale the rule to lifetime and audience**: a throwaway prototype may import anything; a production app on slow mobile networks pays on every page load.

## Apple's principles, for the web

Every craft rule serves one of four human needs, in this order: to feel safe and able to predict what happens next, to understand what is in front of them, to get the thing done, to enjoy it. When two fixes compete, the one serving the higher need wins: safety before delight. Use the principle's name when arguing for a decision.

| Principle | Rule on the web |
|---|---|
| Purpose | Decide first what to leave out. A feature must give back more time and attention than it takes. |
| Agency | Undo absorbs mistakes. A confirm dialog guards only what cannot come back, because a dialog on everything gets dismissed unread. |
| Responsibility | Request access only when the feature needs it, ask for the minimum, say why. |
| Familiarity | Things that look alike act alike and sit in the same place. Depart from a known pattern only when testing proves the new one wins. |
| Flexibility | Adapt to device, situation and ability. Where no single layout fits all, let people reorder or hide parts. |
| Simplicity, not minimalism | Cut what does not help. Adding a fact can simplify: a file size beside a download button saves a guess. |
| Craft | No value is arbitrary. You can say why each gap, duration and offset is what it is. |
| Delight | The payoff of the other seven done well, never a celebration bolted on afterwards. |

- **Give four kinds of feedback**: status (running), completion (worked), warning (about to go wrong), error (went wrong). Validate inline as people type, not after submit.
- **Every screen answers four wayfinding questions**: where am I, where can I go next, what does this screen hold, how do I leave. A screen with no way back is a dead end.
- **Put a control next to what it changes, arranged in the same shape.** If a caption has to say what a control affects, move the control.
- **Labels name their contents**: "Invoices" and "Drafts" predict what is behind them; "Hub" and "Overview" do not.
- **Count steps to the common task, never elements on the screen** because a screen that hides everything behind one menu has fewer pixels and more work. Show the three settings people change weekly inline; put the rest one level deeper under a label that names them.

## The verdict

Walk these in order and stop at the first that decides. State the verdict in one line:

`Verdict: do it | do less | do not. Principle: <name>. Because: <name: measured -> target>.`

```text
1. The thing is buggy, inaccessible or slow.
   -> DO NOT polish. Fix it first.                         Principle: correctness before beauty
2. It fires on every keystroke or every scroll.
   -> DO NOT.                                              Principle: frequency caps delight
3. It fires on every action (click, hover, menu).
   -> DO LESS: respond on the first frame, finish inside
      200ms, no flourish, no delay.                        Principle: frequency caps delight
4. It is a reveal on every section, or marketing-style
   asymmetry, custom type or motion inside product UI.
   -> DO LESS: keep one hero moment on marketing; in
      product, hold the system.                            Principle: marketing versus product
5. It needs a new dependency that fails the install test.
   -> DO LESS: build it with CSS or a native API, or cut
      the part that needed the library.                    Principle: dependency discipline
6. You cannot write it as "name: measured -> target".
   -> DO NOT yet. Film it, measure it, then return to 1.   Principle: name it precisely
7. It serves delight while a safety, clarity or
   completion problem is open on the same screen.
   -> DO NOT yet. Fix the higher need.                     Principle: four needs, in order
8. The cost outruns the frequency (days of work on
   something met once a quarter, by few people).
   -> DO LESS: ship the plain version that is correct on
      first and last frame.                                Principle: details must compound
9. It is daily or weekly, cheap, and removes a
   micro-friction or aligns a detail a reviewer would
   circle.
   -> DO IT.                                               Principle: unseen details compound
10. It is a rare milestone or first run.
   -> DO IT, at full budget.                               Principle: frequency caps delight
11. Two correct versions remain.
   -> DO the calmer, fuller, better-framed one; if still
      tied, the one closer to the reference set.           Principle: beauty decides
```

After any "do it", run the feel tests before calling it finished: a passing check is necessary, never sufficient.

## Never ship

| Never | Instead |
|---|---|
| Animation on typing or scrolling | 0ms: nothing moves |
| A click that waits before it responds | Change on the first frame after input |
| Per-action motion still running after 200ms | `scale(0.97)` over 160ms, or cut it |
| Press scale of 0.95, or enter from `scale(0)` | Press 0.97 (0.96 for an icon button); enter from 0.95 |
| A fade-in on every marketing section | One hero entrance |
| Confetti on save | Confetti on signup complete or first export |
| "Feels off", "make it pop", "looks weird" | `name: measured -> target` |
| A motion library for one press and one toast | Two CSS transitions |
| `moment.js`, `axios`, `uuid`, `query-string` | `Intl`, `fetch`, `crypto.randomUUID()`, `URLSearchParams` |
| A hand-drawn icon beside set icons | The set's icon |
| A confirm dialog on a reversible action | Undo |
| A settings screen folded into one overflow menu | The three weekly settings inline, the rest one level deeper |
| A label of "Hub", "Overview" or "More" | The name of what is behind it |
| A verdict of "looks fine" from one end-state screenshot | A contact sheet of the whole loop at 6x slow |

## Check

- State the frequency tier of the thing under review in words (keystroke, action, daily, weekly, rare) before proposing any motion.
- Film the interaction 6x slow at 40ms steps. A per-action response changes on the first frame after the input; anything still moving after 200ms belongs to a rarer tier.
- Film the full loop at the shown width and at 390 (6 frames, 2500ms apart). Read every press and the loop seam.
- Zoom a still to 2x and ask what a strict reviewer would circle and send back. That is the next fix. Then film it, because a pill hopping 4px shows only between frames.
- Put the still beside the closest strong reference at the same width. If yours is the emptier, flatter, smaller or more boxed one, that is the first fix, before any polish.
- Open the screen cold and answer the four wayfinding questions in one breath each. Any you cannot answer is the first fix.
- Rewrite every finding as `name: measured -> target`. A blank measured value means look again.
- List every bare import, for example with `grep -rhoE "from '[^.][^']*'" src | sort | uniq -c`, and give each a one-line reason.
- Count the real strings in a marketing product shot: 3 to 7. Then open the shipped product view at 390 and confirm no placeholder survives into it.
- Look again the next day before shipping.

## Where sources disagree

- **Per-action duration.** The frequency table gives about 100 to 160ms for per-action feedback; Stageshow's button press runs 180ms, and its check allows anything finished by 200ms. This file uses 160ms for the press, the value in [motion](motion.md), and keeps 200ms only as the ceiling for any other per-action motion.
- **Tooltip delay.** One source gives 600ms, another 200ms. This file uses the motion lane's 400 to 700ms before the first tooltip.
- **Marketing motion budget.** One source calls the marketing budget generous; the marketing checklist calls it larger than product's and still small. This file uses: one hero entrance plus explanatory motion.
- **CSS shapes.** One source draws a chevron in CSS from two borders and a rotate; Benji Taylor takes every icon from a set and hand-draws only glyphs no set has. This file uses CSS for geometry and a set for icons, chevrons included.
- **Conditional classes.** One source replaces `classnames` with a one-line `filter(Boolean).join(' ')` helper; Emil Kowalski's pick is `clsx`. This file uses `clsx`, and the one-liner only when every input is a plain string.
- **Audit cadence.** The same source says to audit `package.json` annually and to analyse the bundle quarterly. This file sets no calendar: check on every new install.

## Sources

- Benji Taylor, "Family Values", benji.org/family-values: frequency against delight.
- Benji Taylor, benji.org/agentation, benji.org/morphing-icons-with-claude and benji.org/stageshow: judging feel, corrections as rules.
- Benji Taylor, Stageshow 1.1.1 (MIT, github.com/benjitaylor/skills): press, menu, toast and count values, filming and contact sheets, named faults, reference-first workflow, the icon-set rule.
- Emil Kowalski, public writing and open-source skills (github.com/emilkowalski/skills, MIT), emilkowal.ski: taste is trained, polish as leverage, next-day review, `apple-design`, `pick-ui-library`, `remove-animations`.
- Emil Kowalski, "Agents with Taste", emilkowal.ski/ui/agents-with-taste.
- Emil Kowalski and Glenn Carstens-Peters, Index, index.how/to/articulate: say precisely what you mean.
- Apple, "Principles of Great Design" (WWDC talk): the eight principles and four needs.
- Paul Graham, "Taste for Makers": the compounding-details argument.
- guidelines.sh: marketing versus product, collecting references.
- Ben DC, frontend-guidelines (github.com/bendc/frontend-guidelines): favour native methods.
- web.dev: third-party and bundle audits.
