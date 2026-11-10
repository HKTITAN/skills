---
title: agents and tools
summary: How he works with coding agents. Pointing instead of describing, the right amount of context, constraints instead of open asks, tools built for the job, and how a skill is written, tested and retired.
---

# Agents and tools

One claim per line, each with its piece. These pieces span January to October 2026 and his method moved in that time, from correcting an agent by hand to writing the corrections down as a skill. See [disagreements](disagreements.md) for the change.

## Pointing

- His core principle for agent feedback: "pointing beats describing." (Annotating for agents, https://benji.org/annotating)
- Precision drops as feedback moves from seeing a thing to describing it in words. (Annotating for agents, https://benji.org/annotating)
- A vague note leaves the agent guessing: a sluggish hover could be the start delay, the duration or the easing. (Annotating for agents, https://benji.org/annotating)
- More specific text reduces the guessing and is tedious to write. A screenshot helps and still leaves the agent inferring which part is meant. (Annotating for agents, https://benji.org/annotating)
- The harder a thing is to describe, the more it is worth pointing at it. (Annotating for agents, https://benji.org/annotating)
- Tools that let you point lock you into one product; flexible terminal agents accept any workflow and make you describe everything. The gap is worst for animation and interaction. (Annotating for agents, https://benji.org/annotating)
- When the tool captures the context, the note can stay short: slow this down, make this rounder. (Annotating for agents, https://benji.org/annotating)
- With the selector in the output, the agent searches for the exact element instead of guessing which blue button was meant. (Annotating for agents, https://benji.org/annotating; Agentation, https://benji.org/agentation)
- The implementation will change; the principle (react to what you see and capture the context automatically) is the part he expects to last. (Annotating for agents, https://benji.org/annotating)
- Written style guidelines give an agent a baseline. Guidelines state general principles and feedback addresses specific instances, so both are needed. (Annotating for agents, https://benji.org/annotating)

## Agentation

- Agentation is a visual feedback tool for coding agents: one React component rendered in development that adds a toolbar and outputs plain markdown, so it works with any agent. (Agentation, https://benji.org/agentation)
- The loop: the agent builds, he uses the result, he clicks what is off and writes a short note, the agent finds the code and changes it, and he looks again. (Agentation, https://benji.org/agentation)
- He counts dozens of rounds per demo and hundreds across the documentation site. (Agentation, https://benji.org/agentation)
- There are five ways to point: select text, click an element, select several elements, select an empty area, and pause an animation to catch a state that exists only briefly. (Agentation, https://benji.org/agentation)
- A text selection puts the exact string in the output so the agent knows what to search for. (Agentation, https://benji.org/agentation)
- An area selection flags what is missing: a gap, a cramped region. (Agentation, https://benji.org/agentation)
- The output names an element by its most identifying feature: its text, an image's alt text, a link's destination, its class names. (Agentation, https://benji.org/agentation)
- Four levels of output run from a selector and a note up to everything including computed styles. The second level was usually enough. (Agentation, https://benji.org/agentation)
- Match the context to the problem. A settings-panel animation the standard level could not explain was fixed in one pass once the fullest level exposed the exact CSS properties. (Agentation, https://benji.org/agentation)
- The aim is not a perfect first attempt. It is giving the agent what it needs for its best attempt, usually over several passes. (Agentation, https://benji.org/agentation)
- Anyone building a similar tool should let their agent help design the output format, because the agent knows what context it needs. (Agentation, https://benji.org/agentation)
- The product page's own practice list: be specific, keep one issue per annotation, and give expected against actual behaviour. (agentation.com, https://agentation.com)

## Constraints

- An open request gets the generic answer: asked for smooth icon transitions, the model wrapped two SVGs in a crossfade. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- A structural constraint gets the system: exactly three lines per icon, spare lines collapsed to an invisible point, same-shape icons rotated. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- His reusable prompt shape states the outcome and the structural constraints, then iterates: use it, notice, describe, repeat. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- The first request to Stageshow is small: one interaction, one product, one size. (Stageshow, https://benji.org/stageshow)
- A first pass is usually a clear step up, and most demos still need several rounds of feedback. (Stageshow, https://benji.org/stageshow)

## What the model cannot see

- The model could not tell that something looked wrong. It aimed for code that worked, not for motion that felt right. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- The insight to rotate arrows instead of morphing them came from him, by watching and describing what felt off. Once he described it, the model understood the reasoning. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- Good models can already make faux UI unaided, and the result tends to be sloppy and heavy-handed. (Stageshow, https://benji.org/stageshow)
- Models often do not know that framing and motion matter until they are told. (Stageshow, https://benji.org/stageshow)

## Build the tool

- During the icon work the agent built a sequencer: queue icons, step through them, point at the one transition that feels wrong. (Morphing icons with Claude, https://benji.org/morphing-icons-with-claude)
- He packaged Drawesome after rebuilding the same drawing feature several times. (Drawesome, https://benji.org/drawesome)
- The Stageshow playground shows every example, the kit parts alone and the bad and good pairs. (Stageshow, https://benji.org/stageshow; Stageshow, README.md, https://github.com/benjitaylor/skills)
- Every animation on the Agentation page, down to cursor movement and easing, was refined by pointing and feedback. (Agentation, https://benji.org/agentation)

## Writing a skill

- Stageshow is his many small hand-made decisions about faux UI, written down so an agent can follow them. (Stageshow, https://benji.org/stageshow)
- A skill's shape, as he ships it: one sentence for the standard, five named failures, numbered steps, a table of gold examples, references split by topic, a kit and scripts. (Stageshow, https://benji.org/stageshow; Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- Every rule in the references came from reviewing a real attempt and states its reason. (Stageshow, https://benji.org/stageshow)
- Rules alone barely produced off-edge crops. A gold example to copy did. So the skill ships dozens of examples to start from and measure against. (Stageshow, https://benji.org/stageshow)
- Start from the closest gold example and copy its folder. Do not rewrite it from a glance. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- A copy that only changes the name is not done: it has to read as the brief's product. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills)
- He tested the skill with a fresh agent, the skill and a short prompt, against an agent with the same prompt and no skill. (Stageshow, https://benji.org/stageshow)
- When the output was wrong he did not patch the output. He recorded the fault, changed the skill and ran again from scratch. (Stageshow, https://benji.org/stageshow)
- Each skill keeps its instructions, references, examples and tools together, with references local to the skill, so the installed folder works alone. (Skills, AGENTS.md, https://github.com/benjitaylor/skills)
- The skill says what it cannot do: it cannot draw, so illustration and photography are made by hand and dropped in. (Stageshow, https://benji.org/stageshow)
- These demos are authored illustrations, not browser automation: a scripted click draws the press and a scripted set changes the scene. (Stageshow, SKILL.md, https://github.com/benjitaylor/skills; Stageshow, README.md, https://github.com/benjitaylor/skills)
- A demo never calls a live service. (Stageshow, references/looks.md, https://github.com/benjitaylor/skills)

## Rules expire

- Some early rules, such as keeping the traffic lights the right size, stopped doing anything as models improved. (Stageshow, https://benji.org/stageshow)
- The rules about framing and motion held on every model he tried. (Stageshow, https://benji.org/stageshow)
- He expects much of what the skill teaches to come built in, and says that is fine with him. (Stageshow, https://benji.org/stageshow)
