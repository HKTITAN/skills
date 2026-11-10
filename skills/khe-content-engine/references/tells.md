---
title: tells
summary: The words, phrases and sentence patterns that make a draft read as generated. The gate reads its word list from this file.
---

# Writing tells

A reader who spots one of these stops reading the post as a person's and starts reading it as output. The owner's voice node is the positive rule; this file is the negative one. A draft is checked against both: this list, and the `Never say` list in the engine's voice node.

Finding a tell is never fixed by swapping the word for its synonym. The sentence was written without anything to say. Go back to the brief, find the fact the sentence was standing in for, and write that.

## The gate's list

`scripts/content-check.mjs` reads this block, one entry to a line, and raises `tell:` for any of them in a draft. Matching ignores case and treats straight and curly apostrophes alike. Add a line to ban a phrase; the owner's own bans go in their voice node.

```text
delve
tapestry
testament to
game-changer
game changer
unlock the
unleash
supercharge
revolutionize
revolutionise
transformative
cutting-edge
seamless
seamlessly
robust
leverage
harness the
elevate your
ever-evolving
ever-changing
fast-paced
in today's
in a world where
when it comes to
at the end of the day
it's worth noting
it is worth noting
it's important to note
it is important to note
needless to say
moreover
furthermore
in conclusion
in summary
let's dive in
dive into
here's the thing
here's the kicker
here's why
the truth is
the reality is
let that sink in
read that again
buckle up
look no further
rest assured
navigating the
embark on
a journey
the realm of
pivotal
foster a
that being said
without further ado
i hope this helps
```

## Patterns the gate bans

These are in the script, because a pattern needs more than a word match.

| Pattern | Reads like | Write instead |
|---|---|---|
| An em dash (U+2014) | A clause bolted on with the one mark people rarely type | A full stop, a comma or a colon |
| The "not just X, but Y" turn | A contrast made up so the second half sounds bigger | Say Y. If X matters, give it its own sentence |
| The "it is not X. It is Y." turn | A strawman set up to be knocked over | Say Y, and the fact that shows it |
| A question the writer answers at once ("The result?") | A drum roll | The answer, as a statement |
| The "No X. No Y. Just Z." run | A slogan | One sentence that says what the thing is |

## Tells the gate cannot see

Check these by reading. They are in [verify](verify.md).

- Three items in every list, each the same length.
- Every paragraph the same number of sentences.
- A closing line that restates the post as a moral.
- An opening that announces the topic instead of starting it.
- Adjectives where the brief had a number.
- A reader addressed as a crowd ("freelancers everywhere") when the voice node says "you".
- Bold on phrases the owner's samples never bold.
- Emoji as bullets, when the samples have none.
- A hedge in front of a fact the brief states flat.
- A sign-off question asking for engagement, when the samples never ask one.

## When the owner really writes that way

A person may use a word on this list, on purpose, in their own posts. The samples decide. If three of their samples use it, record that in the engine's voice node under `Traits`, with the sample numbers, and remove the line from this block in your own copy of the skill. Never clear a `tell:` line by rewording around the match while the empty sentence stays.
