---
title: silent
summary: Topics his public articles do not cover. For each, the reply says so and never builds a position for him.
---

# Silent

The thirteen articles in [sources](sources.md) say nothing, or one passing line, about everything below. When a question lands here the answer is "he has not written about this", followed by the nearest thing he did write if there is one, marked as a reading.

A topic is silent when no line in any theme file answers the question. A topic missing from this list is still silent if the theme files have nothing: this list is the common cases, never the boundary.

## How to answer a silent topic

1. Say it in the first sentence: he has not written about it.
2. If a published line sits close, give it with its source and start the sentence `My reading:`. A rule about motion carried over to sound is your transfer, never his statement.
3. If one of his skills covers the topic, name the skill in backticks. A skill is not an article and is never a `Source:` line.
4. Put the topic on the `Not in his writing:` line.

## Topics with nothing

| Topic | What exists, if anything | Where to send the job |
|---|---|---|
| Interface sound | Nothing | `khe-sound` |
| Haptics | One word on the index page, in the description of `animate-expo` | `animate-expo` |
| Color: palettes, contrast, color spaces, dark mode design | "Color" appears once, as a kind of skill a person could write | `khe-ui` |
| Layout, spacing scales, grids, responsive breakpoints | "Layout" appears once, the same way | `khe-ui` |
| Icon design | "Icons" appears once, the same way | `khe-svg` |
| Type scale, font choice, font pairing | Seven rules about measure, numerals and emphasis; nothing on scale or choice | `khe-ui` |
| Forms, validation, error messages, empty states | Nothing | `khe-ui` |
| UI copy and microcopy | Nothing | `khe-ui` |
| Design tokens and design systems | Nothing | `khe-design-tokens` |
| Screen readers, focus order, contrast ratios, WCAG levels | Reduced motion, a hit area, `aria-hidden` on copies, and a pointer to Radix | `khe-ui` |
| Spring values: stiffness, damping, mass, bounce | He names the three parameters and gives no numbers | `animate` |
| Stagger, and several elements moving together | Nothing in the articles | `choreograph` |
| Page transitions and the View Transitions API | Named once as the proper route; he says he does not cover it | `animate` |
| Scroll-driven storytelling, parallax | One clipped scroll line; no position on scroll effects as a whole | `find-animation-opportunities` |
| Lottie, Rive, GSAP, canvas, WebGL | Nothing | `pick-ui-library` |
| React Native and native iOS motion | One sentence on the index page | `animate-expo`, `apple-design` |
| Mobile web details beyond the drawer: safe areas, tap delay, input zoom | The drawer's keyboard and touch handling only | `mobile-native` |
| Loading skeletons, optimistic UI | Two lines on spinners and perceived speed | `khe-ui` |
| Charts and data visualization | One line: a functional graph is better with no animation | none |
| Bundle size, Core Web Vitals, rendering strategy | "Framer Motion is heavy", once | none |
| State management, data fetching, testing | The observer pattern inside Sonner; nothing general | none |
| Which model, which agent harness, how to prompt | He names the tool he drafts skills with, and gives no comparison | none |
| Career: jobs, pay, interviews, portfolios, freelancing | Nothing. He writes about shipping his own projects only | none |
| Pricing, business models, running a company | Enrollment numbers for one project; no advice | none |
| Team process, design reviews, handoff between design and engineering | "Critique from the right person", once | none |
| Launch films and video editing | Announcement videos showed one interaction; nothing on making them | `khe-launch-film` |

## Topics people assume he covered

These come up because his skills or his talks cover them. The articles do not.

- **The exact custom curves he uses.** The articles tell you to use custom curves and where to find them. The only curves printed in full are Vaul's sheet curve and the reveal curve, both in [easing-and-duration](easing-and-duration.md). Any other cubic-bezier is not from an article.
- **A rule for when to use a spring over a curve.** He says springs feel natural and limits one spring effect to decoration. He gives no decision rule.
- **Exit animations as a topic.** One line: exits run about 20% faster. Nothing on what an exit looks like.
- **Drag thresholds as general values.** `0.11` and 100ms are Sonner's and Vaul's own numbers. He does not offer them as defaults for other components.
- **Accessibility as a whole.** Three sentences on reduced motion.

## Never do this

- Never answer a silent topic from his skills as if a skill were an article. Name the skill and stop.
- Never answer from a talk, a tweet, a video or a podcast. They are not in [sources](sources.md).
- Never answer from material behind a login or a payment, whatever it is and wherever it came from.
- Never reason "he would say" from his general taste to a specific position. If the reply needs it, it is `My reading:` and it says so.
