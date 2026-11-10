---
title: agents-and-skills
summary: What he published about working with coding agents, writing skill files, and which public skills he ships.
---

# Agents and skills

This file reports what he wrote about agents and skills. It is never a substitute for his skills. To apply his rules, run his skill; the names are in the last section.

## Agents

- Coding agents multiply an engineer's output and do not know what polished visual work feels like. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- The creative work stays with the person. The more taste is packaged into a skill, the more an agent can carry. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Guide an agent the way you would guide a less experienced designer: with the rule and its reason. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- The scarce skill in animation is judgment, such as which curve and which duration. Models are weak at that and strong at code. (Building an Animation Course, https://emilkowal.ski/ui/building-an-animation-course)
- Understanding the code still has value, even though models write it well. (Building an Animation Course, https://emilkowal.ski/ui/building-an-animation-course)
- In 2024 most of the work of building a teaching platform could not be handed to a model. (Building an Animation Course, https://emilkowal.ski/ui/building-an-animation-course)
- Building became cheap, and cheap building without a decision produces work that feels empty. (Friction as a Feature, https://emilkowal.ski/ui/friction-as-a-feature)

## Writing a skill

- One skill file per aspect of the interface: animation, typography, layout, icons, color. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- The method: step back, ask why you made a decision, state the reason, turn it into rules, and be strict. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Taste can be handed over once you can say why something feels right. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- A strict decision tree with a default branch means the agent never invents a rule. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- The shapes he shows: a table from a symptom to its fix, a flowchart for easing, a table of durations followed by short rules, and numbered rules that carry their reason. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- He drafts skills with Anthropic's skill-creator skill. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- What a good run looks like: the agent lists the issues it found and gives a before and after table of what it changed. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)

## The symptom table he gives agents

- A button feels unresponsive: `transform: scale(0.97)` on `:active`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- An element appears from nowhere: start at `scale(0.95)`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Motion is shaky: `will-change: transform`. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Hover flickers: animate the child. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- A popover scales from the wrong point: set `transform-origin` to the trigger. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- Tooltips in sequence feel slow: skip the delay and the animation after the first. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- A small button is hard to tap: a 44px hit area through a pseudo-element. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)
- It still feels off: subtle blur, under 20px. (Agents with Taste, https://emilkowal.ski/ui/agents-with-taste)

## The skills he ships

- A skill built from his blog posts is published separately from his other teaching material. (Building an Animation Course, https://emilkowal.ski/ui/building-an-animation-course)
- The index page lists fifteen skills and the job each one does, split by job: build, review, audit, find opportunities, fix performance, vocabulary, prototype, pick a library, stress-test. (AI Skills for Design Engineers, https://emilkowal.ski/skill)
- The main skill is `emil-design-eng`; the page describes it as mostly animation with some design advice. (AI Skills for Design Engineers, https://emilkowal.ski/skill)
- The page presents the public skills as a starting point, not the whole of what he teaches. (AI Skills for Design Engineers, https://emilkowal.ski/skill)
