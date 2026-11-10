---
title: nodes
summary: The engine folder, the template for each node and what each one must contain, the run file format, and the brief.
---

# Nodes

An engine is a folder of small markdown files in the owner's project. Each file is a node: one subject, one page, with links to the nodes it depends on. The folder is the owner's. This skill writes it, reads it and changes it, and holds none of it.

## The folder

```text
content-engine/
  index.md            the briefing: who, what a run is for, every node with its reason
  voice.md            samples of the owner's writing, traits, what they never say
  audience.md         one "## Segment:" section per group
  hooks.md            the opening moves this owner uses
  repurpose.md        the treatment for each platform, and what two drafts may never share
  content-types.md    the forms this owner writes
  cadence.md          what they can keep up, and who posts
  platforms/
    x.md              one node per platform the owner posts on now
    linkedin.md
  ideas/              briefs waiting for a run (not nodes)
  runs/               one file per run (not nodes)
```

Default location: `content-engine/` at the root of the owner's project. Ask before using another place. Files in `ideas/` and `runs/` are not nodes and are not checked as nodes.

## Rules for every node

- **Frontmatter first**, with `node:` and the type: `index`, `voice`, `audience`, `hooks`, `repurpose`, `content-types`, `cadence` or `platform`. Add `owner:` and `updated:`. A file without `node:` raises `untyped-node:`.
- **One page.** A node that needs scrolling is two nodes. The run reads several nodes for every draft, and a long node gets skimmed.
- **Links carry a reason.** A link is written as two square brackets on each side of the node's file name, for example `[[voice]]`. Beside every link say why the reader goes there. A bare link list gives a run nothing to decide with.
- **Every node is linked from another node.** A node nothing points at is never read (`orphan-node:`). The index links all of them.
- **No blanks.** A bracketed blank, `TODO` or `TBD` raises `placeholder:`. A fact that is not known yet is asked for, or the line is left out.
- **Changes are dated.** A node that has been tuned ends with `## Changes`, one line per change: the date, what changed and the draft line that caused it.

Inside this skill's own documents a link is shown in a code span. In an engine it is written plain, so that the gate and any markdown editor that follows such links can resolve it.

## index

The briefing a run reads first. It is never a file list.

```markdown
---
node: index
owner: <name>
updated: <date>
---

# <Name> content engine

## Who this is
Two or three sentences: who writes, what they do, who posts.

## What a run is for
One idea in, one draft per platform asked for, each a different treatment.

## Nodes
- link to voice: why a run reads it
- link to each other node: one line each, with the reason

## Order of a run
The numbered order in which a run reads the nodes.

## Rules that outrank every node
Nothing is posted by the engine. Numbers and quotations come from the brief.
```

Must contain: a link to every node, each with its reason; the order of a run; the rule that a person posts.

## voice

The node that decides whether a draft sounds like the owner. How to fill it is in [voice-sampling](voice-sampling.md).

Must contain:

- `## Samples`: at least 3 block quotations copied from what the owner wrote, each followed by a `Source:` line saying where and when it was published and who supplied it. Fewer raises `voice-no-samples:`.
- `## Traits`: observations, each ending with the sample numbers that show it, as `(samples 1, 3)`. A trait with no sample is a candidate line (`trait-no-sample:`).
- `## Never say`: at least 5 entries, each a phrase in double quotation marks, then a colon and the reason. The gate matches these phrases against every draft (`never-say:`).
- `## Never do`: habits of form the owner avoids: openings, sign-offs, punctuation, emoji.

## audience

Must contain at least one `## Segment: <name>` section. Each segment says who they are, what they already know, what they want, and on which platforms the owner meets them, with links to those platform nodes. End with who is not the audience. A segment described only by age or job title gives a draft nothing; say what they know and what they are trying to do this week.

## hooks

The opening moves this owner uses, one second-level heading per type. Each type says what it is, what it needs from the brief, and what the body must do to pay it off. End with what the owner never opens with. How to derive the types is in [hooks](hooks.md). A draft names its type on its `Hook:` line, and the gate reports a name that is not a heading here (`hook-not-in-node:`).

## repurpose

How one idea becomes a different piece per platform. Must contain: the instruction to write the claim first; one line per platform node, with a link, giving that platform's treatment; the table of what changes between drafts; what to do when a platform has nothing. The rules are in [repurposing](repurposing.md). A platform with no line here is a candidate line (`repurpose-misses-platform:`).

## content-types

The forms the owner writes, one second-level heading each: where it is used, and its skeleton in one or two sentences. End with what is not made here. Only forms the owner has published or asked for; a form copied from a list of everything a platform supports is never used and dilutes the node.

## cadence

What the owner can keep up. A table of platform, how often, which day and who posts; the batch routine; the review habit. Every number comes from the owner's answer or their own analytics. Must state that nothing is scheduled or posted by the engine. No "best time" is written here unless the owner's own data gives it, with the date.

## platform

One node per platform, in `platforms/`. The file name is the platform's id, and a run asks for it by that id.

Must contain:

- `Limit: <number> characters` or `Limit: <number> words`, the owner's ceiling for a draft there. Add `per part` when a draft is a thread or a set of slides. Missing raises `platform-no-limit:`.
- `Max parts: <number>` when the limit is per part.
- `Facts checked: YYYY-MM-DD`, then each platform fact with its source. Missing raises `platform-no-dated-facts:`. A date more than 180 days old is a candidate line (`stale-facts:`).
- `## Confirm before relying on this`: everything about reach, ranking and timing that nobody has verified.
- `## Form`: what a post there looks like for this owner.
- Links to voice, repurpose, hooks, content-types and audience, each with its reason.

The facts come from [platforms](platforms.md), and for X from [x-algorithm](x-algorithm.md).

## The brief

A run starts from a brief, written into the run file under `## Brief`. It holds everything a draft may state as fact:

- what happened, in the owner's words;
- every number, with its unit and where it came from;
- every quotation, word for word, with whether the person agreed to be quoted;
- what is not known;
- the claim, in one sentence.

A draft may use a number or a quotation only when it is in the brief. Anything else is marked `[confirm]` on the same line, after the number or quotation, or left out. Write a count of the draft's own structure as a word ("four steps"), because the gate reads every digit as a fact.

## The run file

One file per run, in `runs/`, named with the date and a short slug.

````markdown
# Run: <the idea in a few words>

Engine: <path from this file to the engine folder>
Idea: <one sentence>
Platforms: <platform ids, comma separated>
Skipped: <platform id (reason)>          only when a platform asked for gets no draft

## Brief

<the brief>

## Draft: <platform id>

- Treatment: <how this draft treats the idea>, with a link to the repurpose node
- Hook: <a hook type from the hooks node>
- Segment: <a segment from the audience node>
- Type: <a form from the content-types node>
- Nodes: links to every node this draft used; the voice node and its own platform node are always among them

```text
<the draft, exactly as it would be posted>
```

Not verified: <what nobody checked>
````

- The draft sits in a fenced block so that it can be copied whole and measured.
- A thread or a set of slides separates its parts with a line that holds only `---`.
- `Not verified:` is the last line of the file.
- The gold runs in `examples/runs/` are the model. Start from the closest one.
