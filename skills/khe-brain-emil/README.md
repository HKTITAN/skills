# khe-brain-emil

Answers an interface, motion or craft question from Emil Kowalski's published articles, with the article named.

```bash
npx skills add HKTITAN/skills --skill khe-brain-emil
```

## Credit

This is Harshit Khemani's reading of Emil Kowalski's public writing. Emil Kowalski did not write it, review it or endorse it, and any mistake in the reading is Harshit's. Every claim is a paraphrase that names its article, so you can read the original and disagree.

- His writing: <https://emilkowal.ski/>
- His own skills, which apply his rules and are kept up to date by him: <https://github.com/emilkowalski/skills>

Only what he has published openly is used. Nothing from behind a login or a payment.

## What it does

- Answers "what would Emil say about X" in two or three sentences, each pointing at the article it comes from, with the title and the URL.
- Tests a UI or a decision against his stated positions: what it breaks, what it matches, what he left open.
- Says "he has not written about this" when the articles are silent, and names the skill that owns the job.
- Shows where two of his articles give different answers, or where his own component breaks his general rule, with both sides cited.
- Marks every inference of its own as `My reading:` so it is never mistaken for his.
- Ends every reply with what is not in his writing.

## When to use it

Use it when you want an answer from a named source instead of an average of everything: before you repeat a rule as "Emil says", when two people remember his advice differently, or when a decision needs checking against what he has put in writing. To build or review a screen, use `khe-ui`. To have his rules applied to your code, use his own skills (`emil-design-eng`, `animate`, `review-animations`); this skill reports his writing and changes nothing.

## Invoke with

`/khe-brain-emil [question | test <ui or decision> | who said <claim> | topics]`

Or ask in your own words: "what would Emil say about", "is this how Emil would do it", "ask Emil", "who said that".

## Before and after

Before: "what scale should a popover start from?" gets "Emil recommends about 0.94 with a spring", a number he never published and a spring he never specified, with nothing to check it against.

After: never from `scale(0)`, then `0.95`, `0.93` and `0.5` each beside the article that gives it on a `Conflict:` line, a `My reading:` sentence for which one fits a popover, three `Source:` lines, and `Not in his writing:` a single scale for every element.

## Example prompts

- What would Emil say about animating our command palette when it opens from the shortcut?
- Test this against Emil's writing: a drawer that opens over 600ms with ease-in and animates its height.
- Who said prototyping is thinking, and what was the point?
- Has Emil written anything about sound?

## Verify

```bash
node scripts/brain-check.mjs reply.txt --gate   # an answer, saved as text
node scripts/brain-check.mjs examples --gate    # the gold replies
node scripts/brain-check.mjs --self-test        # the gate against its own fixtures
```

`brain-check.mjs` names every fault as a line. `--gate` ends `brain-check passed` only when every never-intentional line is at 0, exits 1 with the counts otherwise, and exits 2 with `inconclusive` when it could not look.

What it proves: the reply has an answer and at least one `Source:` line, every cited title and URL is a row in `references/sources.md`, every `[n]` has a source behind it, every sentence in the answer is sourced, marked `My reading:` or a statement of silence, a `Conflict:` line cites both sides, a quotation is under 15 words and is one of the six in `references/quotes.md`, no hedge word is used, and the last line is `Not in his writing:`.

What it does not prove: that the article says what the sentence says, that a paraphrase is fair, that a reading is sound, that a topic called silent is silent, or that a disagreement was not left out. It reads titles and never reads an article. Passing is necessary, not sufficient.

`--self-test` also checks the skill itself: every claim line in `references/` names a page in the sources table, every page backs at least one claim, and SKILL.md links every reference.

## What is inside

- [SKILL.md](SKILL.md): the one idea, the workflow, the table from a theme to its file, the hard rules and the output format.
- `references/`: the corpus by theme, one claim per line with its article and URL (`when-to-animate.md`, `easing-and-duration.md`, `springs-and-gestures.md`, `transforms-and-clip-path.md`, `performance.md`, `components.md`, `accessibility-and-typography.md`, `taste-and-practice.md`, `agents-and-skills.md`, `craft-and-shipping.md`); `sources.md` (thirteen articles and one index page, with the date each was read); `disagreements.md`; `silent.md`; `quotes.md` (the six quotations a reply may use); `verify.md`, `review.md`, `teaching.md`; and `gotchas.md` and `pov.md`, which are yours to edit.
- `examples/`: six gold replies: a direct question, a pressure-test, a silent topic, a disagreement, "who said that", and a build request handed off.
- `teaching/`: eleven bad/good pairs, each named for the gate line its bad half raises. They are the gate's tests.
- `scripts/`: `brain-check.mjs` (the gate). Node 20 or newer, no dependencies.
- [LICENSE](LICENSE): MIT. It covers this skill's own text and code, never the articles it points to.
