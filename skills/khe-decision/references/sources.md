---
title: sources
summary: Where the council idea came from, what was borrowed as ideas, what is different here and why, what was left out, and where the brains' own sources live.
---

# Sources

## The council

The idea of putting one decision to several independent seats and writing the synthesis last comes from **autodecision** by Harshil Mathur, a decision tool for Claude Code and Claude Cowork, MIT licensed: [github.com/harshilmathur/autodecision](https://github.com/harshilmathur/autodecision). Read for this file: its README, on 2026-11-21.

Its README names its own lineage: Andrej Karpathy's [autoresearch](https://github.com/karpathy/autoresearch) and [llm-council](https://github.com/karpathy/llm-council). Neither was read for this skill; they are credited here because autodecision credits them.

This skill is Harshit Khemani's. Harshil Mathur and Andrej Karpathy did not write it, review it or endorse it. Every sentence, brief and label here was written fresh. Nothing is copied from autodecision: not its text, its prompts, its section names or its output schema.

## Borrowed, as ideas

- A council: several seats put to the same decision, each run as its own parallel subagent, none able to see another.
- A chair that writes last, from the seats' finished answers.
- Disagreement kept in the result and shown to the reader, never averaged into one view.

## Different here, and why

| In autodecision, by its README | Here | Why |
|---|---|---|
| Five seats that are roles the tool defines, each generating a view of the decision | Seats that are published bodies of work, already read into the brain skills | A role can be asked for an opinion. A person's published work can only be read, so a seat cites a line or says it is silent, and never generates a view |
| A loop that repeats until a judge sees the answers stop moving | One round, then at most one cross-check | A generated view can shift between rounds. A corpus returns the same lines however often it is asked; the one second look only shows whether a disagreement is real or one corpus never addressed the point |
| Web search for data, adversarial stress tests, probabilities with ranges | None of them | The only evidence here is what the brains cite. A number this skill produced would sit beside real people's names with no source |
| A long brief with a recommendation the process arrives at | A short reply whose one recommendation is labelled as the skill's own synthesis, and withheld when fewer than two seats spoke | With real names in the reply, an unlabelled call reads as theirs |
| A council whose seats the tool describes | Seats found by folder at run time; no council on fewer than two relevant brains | A new brain joins by being installed, and one corpus is that brain's answer, not a council |

Autodecision is the better tool when the job is to model a decision: second-order effects, worst cases, thresholds. This skill does one narrower thing: it shows what named, published sources say about the decision and where they part.

## Left out

- Its commands, templates, deck export and publishing steps. They belong to that tool.
- Any invented persona. A seat here is always a brain skill with its own corpus, sources table and gate.

## The brains' own sources

This skill holds no corpus. Every citation in a council reply comes from a brain, and each brain keeps its own record: the pieces read, their URLs and dates, how they were read and what was not read are in that brain's `references/sources.md`; what it does not cover is in its `references/silent.md`; where its pieces pull apart is in its `references/disagreements.md`. The people and institutions the brains read (on this branch: Emil Kowalski, Benji Taylor, Varun Mayya, Enrico Tartarotti, Y Combinator's partners, the ISB notes and ivi speakers, and Harshit Khemani's own posts) are credited there, and none of them wrote or endorsed a council reply.

When a council reply and a brain's source disagree, the source is right, and the fix goes in that brain.
