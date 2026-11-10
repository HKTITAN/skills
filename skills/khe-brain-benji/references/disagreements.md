---
title: disagreements
summary: Where his pieces pull against each other, and where a position moved over time. Each row gives both sides with their pieces and dates, and how to report it.
---

# Disagreements and changes

Open this file before you answer. When a question touches a row, the reply gives both sides on a `Disagrees:` or `Changed:` line, each with its piece, and never merges them into one smooth view. The reply does not pick a winner unless a later piece says the earlier one was wrong; none of these do.

Dates are publication dates. Honk was built before Family, and its article came out ten months after the Family one, so the order of the products and the order of the articles are different. Say which order you mean.

## Disagreements

Each side is one claim with its piece.

### Does every animation need a purpose?

- Yes, in Family: every animation has an architectural purpose, and a transition was added only once the team understood why it made sense. (Family Values, https://benji.org/family-values)
- No, in Honk: "Not everything needed a purpose." Emojis could be spammed until the chat was unreadable for a moment, and the fun was in seeing what would happen. (Honkish, https://benji.org/honkish)
- Both: Honk felt more like a toy than a utility, while Family was built to make a complex financial product feel welcoming. (Honkish, https://benji.org/honkish; Family Values, https://benji.org/family-values)
- How to report it: give both lines and name the product each one is about. A wallet and a toy messenger are his own two cases; do not extend either to a third kind of product.

### Respect the user's time, or slow them down?

- Family is framed as respect for the user's time, and its motion is fast and directional. (Family Values, https://benji.org/family-values)
- Honk added friction on purpose outside the chat: a slot-machine reveal, cycling picks, a signature before talking to strangers. (Honkish, https://benji.org/honkish)
- He places the friction outside the real-time core and reports that the signature reduced bad behaviour. (Honkish, https://benji.org/honkish)
- How to report it: friction is his tool for a pause that changes behaviour or builds anticipation, in a place away from the main task. He has not written a rule for when a pause is worth the time it costs.

### Is a crossfade ever right?

- For icons, no: fading one icon out and another in is not a transformation, and he rejected it. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- In Stageshow, an object that keeps its identity rotates the same strokes, and a status word rolls; two spans crossfading in place read as a smudge. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- In the same file a button crossfades its own label while its width eases, and a page swap inside one window crossfades only the body. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills)
- How to report it: the line he draws is identity. A thing that is still the same thing transforms; content replaced inside a container that stays put may crossfade. Report it as that distinction, with both pieces.

### How much real text?

- Too much is the first failure: real text in every row makes a demo look generated, and a scene usually holds 3 to 7 real strings. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, references/craft.md, https://github.com/benjitaylor/skills)
- Realism is also the developer's call: at realistic fidelity, at hero scale or for a named real product, plausible content goes everywhere. (Stageshow, references/craft.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- Too little is a failure as well: a wireframe that does not read as a product. (Stageshow, https://benji.org/stageshow; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- How to report it: the default is few words. The exceptions are stated by him and are about scale and about the brief. Never quote the word budget without its exceptions.

### Must the window bleed off the frame?

- A whole window with even margins is the boxed failure, and a hero's window bleeds or fills. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, references/framing.md, https://github.com/benjitaylor/skills)
- A whole window with even gutters is valid when its contents read and the brief asks, and an unframed window is the developer's call. (Stageshow, references/framing.md, https://github.com/benjitaylor/skills)
- How to report it: the fault is a whole screen shrunk until it cannot be read, chosen by default. A whole window chosen by the brief is allowed. Both lines are in the same file.

### Is bounce allowed?

- In a demo, landings are soft with no bounce and no ring pulse; only a small expressive icon may overshoot. (Stageshow, references/motion.md, https://github.com/benjitaylor/skills; Stageshow, references/choreography.md, https://github.com/benjitaylor/skills)
- In Honk, emojis collide under a physics engine and bursts fly across the screen. (Honkish, https://benji.org/honkish)
- How to report it: one is a picture of a product on a page, the other a consumer toy. He has not written a general rule about springs or overshoot in product UI.

### Opt-in, or on by default?

- Liveline's core is one moving line and "Everything else is opt-in." (Liveline, https://benji.org/liveline)
- The same article says features are off by default or have sensible defaults, and some, such as the hover scrub, are on. (Liveline, https://benji.org/liveline)
- How to report it: the principle is one job in the core. The article's own defaults do not follow the sentence to the letter, and a reply that leans on the sentence says so.

### Hand-drawn or never drawn?

- Icons come from a set and are never drawn by hand in a demo; a hand-drawn glyph is the first tell of generated UI. (Stageshow, references/craft.md, https://github.com/benjitaylor/skills)
- Lucide is to be chosen deliberately and never by reflex, and the kit's own icon part depends on it. (Stageshow, references/craft.md, https://github.com/benjitaylor/skills; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- How to report it: the rule is about choosing a set on purpose and keeping one weight. It is not a ban on any one icon set.

## Changes over time

### From correcting the agent to writing the corrections down

- January 2026: feedback is a loop run by hand. He points, the agent changes, he points again, for dozens of rounds per demo. (Agentation, https://benji.org/agentation; Annotating for agents, https://benji.org/annotating)
- January 2026: written guidelines are a baseline only, because they state general principles and feedback addresses specific instances. (Annotating for agents, https://benji.org/annotating)
- October 2026: the decisions are written into a skill with rules that carry reasons, the agent films its own work and reads the frames, and a wrong output is fixed by changing the skill and rerunning. (Stageshow, https://benji.org/stageshow)
- October 2026: rules alone still did not move behaviour for cropping; examples to copy did. (Stageshow, https://benji.org/stageshow)
- How to report it: the later piece builds on the earlier ones and does not withdraw them. The human still judges whether a demo is worth watching. Give the dates.

### What the model can see

- January 2026: the model could not tell that a morph looked wrong and aimed for working code. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- October 2026: good models can make faux UI unaided, some early rules became unnecessary as models improved, and he expects more of the skill to come built in. (Stageshow, https://benji.org/stageshow)
- Unchanged in October 2026: models do not know that framing and motion matter until told, and checks still cannot judge a dull idea. (Stageshow, https://benji.org/stageshow)
- How to report it: a claim about what models cannot do carries its date. Never present the January claim as his current view without the October one beside it.

### From the first pass to many passes

- The icon system came together in a single session. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- Agentation's point is that one-shotting is not the goal and each pass counts. (Agentation, https://benji.org/agentation)
- A first Stageshow pass is usually a clear step up and still needs several rounds. (Stageshow, https://benji.org/stageshow)
- How to report it: these agree more than they differ. A single session held many rounds of watching and describing. Do not report the single session as a claim that one prompt is enough.

### His own verdict on Honk

- The retrospective celebrates Honk's model: no send button, no history, no drafts, everything live. (Honkish, https://benji.org/honkish)
- In the same piece he names real-time-only messaging as impractical and a reason it ended. (Honkish, https://benji.org/honkish)
- How to report it: he holds both. Admiring the details is not his recommendation to copy the model.
