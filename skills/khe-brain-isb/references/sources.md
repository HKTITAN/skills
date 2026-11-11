---
title: sources
summary: Every piece in the corpus, with its URL, its last commit, its section and its label; whose words the notes are; what was not used; how to refresh. The gate reads the tables to check every citation.
---

# Sources

The corpus is one public repository, [HKTITAN/isb-skills](https://github.com/HKTITAN/isb-skills), read whole at commit `060ee06` on 2026-11-11. It holds nine sets of Markdown study notes: economics, entrepreneurship, finance, leadership, marketing, an MBA tutor, operations, strategy and technology. The corpus is 467 pieces: 457 rule files, the nine `SKILL.md` routers and the repository `README.md`.

Every claim in the theme files ends with `(Title, URL)`, and both come from the tables below. A reply cites a piece as `(Title)` inside the sentence and as `Source: Title, URL` under the answer. The gate (`scripts/brain-check.mjs`) reads the first two columns of every table here, so a title that is not here cannot be cited.

To find one piece, search this file for its title. Never read the tables top to bottom to answer a question: the claims are in the theme files, with their titles and URLs already attached.

## Whose words these are

Report the notes as the notes. The evidence for that, each line from the files themselves:

- The README says the collection is based on the ISB MBA curriculum and names the ISB PGP 2025-26 programme as its content source. (isb-skills: README.md, https://github.com/HKTITAN/isb-skills/blob/060ee06/README.md)
- Each router's frontmatter gives the author as "ISB-Knowledge-Repository", version "1.0.0" and an MIT licence, and calls itself a compact router over the rule files. (Finance: SKILL.md, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/SKILL.md)
- Each skill's `metadata.json` gives the organisation as "ISB Knowledge Repository", the date as April 2026 and the source as the Indian School of Business MBA curriculum. Those files were read and are not pieces.
- No rule file contains the words ISB or Indian School of Business. No rule file names a professor, a course, a term, a session, a student or a case study. Nine readers read all 457 files in full on 2026-11-11 and a pattern search of the repository agreed.
- One strategy file ends with a footer that says the content "Integrates 21 wiki articles + multiple ChatGPT knowledge bases". (Strategy: Core Principles, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-core-principles.md)
- One leadership file ends with a footer that describes a reference of more than 8,500 words "integrating 20 wiki articles". (Leadership: Related Theories & Frameworks, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/related-theorie-related-theories-frameworks.md)
- The files give no source for their figures: no study, no dataset, no year beyond a few headings such as "as of 2026".

So a reply says "the notes state", and never "ISB teaches" or "the professor says". The README's statement about the curriculum is reported as the README's statement. The footers are reported as footers. This skill does not know which sentence, if any, came from an ISB classroom, and it says so when asked.

This skill is Harshit Khemani's reading of that repository. The Indian School of Business did not write it, review it or endorse it. When this skill and a file in the repository disagree, the file is right.

## How a piece is titled

- A rule file's title is its skill, a colon, and the title in the file's own frontmatter: `Finance: Pecking Order Theory`.
- Brackets in a file's title are replaced by a comma, because a reply cites in brackets: the file titled "CAPM (Capital Asset Pricing Model)" is `Finance: CAPM, Capital Asset Pricing Model`.
- Titles the files write in capitals are written here in title case.
- Two technology files share the title "Data as Strategic Asset". The one in the operating principles section is `Technology: Data as Strategic Asset, operating principles`.
- A router is `<Skill>: SKILL.md`. The front page is `isb-skills: README.md`.
- Every URL points at the file at commit `060ee06`, so the text a claim was checked against stays reachable after the repository changes.

## How it was read

- Nine readers each read one skill folder in full, one file at a time, and wrote one note per rule file: 457 notes, kept outside this skill with the clone of the repository.
- Every claim line in the theme files was written with the rule file open, then checked against the file again by a reviewer who had not written it. [gotchas](gotchas.md) records what that check corrected.
- Every claim is a paraphrase. The few direct quotes are under 15 words each.
- The Last commit column is the date of the last commit that touched the file. The repository has two commits: 2026-04-10, when every file was added, and 2026-11-01, which repaired YAML frontmatter in 46 of these pieces and changed no body text that a claim rests on.
- The Label column is the `impact` value in the file's frontmatter. The same line in every file explains CRITICAL as a core framework. The routers and the section indexes rate several sections differently from each other, so a label is reported as that file's label and never as a ranking of importance.
- The Section column is the heading the skill's own `rules/_sections.md` files the piece under. Thirteen rule files are in no index and are marked "not indexed".

## In the repository and not in the corpus

| File | Why it is not a piece |
|---|---|
| `skills/<skill>/rules/_sections.md`, nine files | Indexes of the rule files. Read for the Section column. They hold no claim of their own. |
| `skills/<skill>/metadata.json`, nine files | Version, date, source line, rule count. Read; the facts used are stated above. |
| `AGENTS.md` and `CLAUDE.md` | Instructions to coding agents working on the repository. No subject content. |
| `skills/.claude/rules/*.md` and `skills/.cursor/rules/*.mdc`, eleven files | Path rules for coding tools. No subject content. |

## Not in the repository, so not read

A reply that needs one of these says so on its `Not in the notes:` line.

| Material | Why it is not in the corpus |
|---|---|
| ISB's own course material: slides, readings, case studies, session plans, exams | Not in the repository and not public. Programme content is paid, and case studies belong to their publishers. Nothing from them was read or is reproduced here. |
| The "wiki articles" and "ChatGPT knowledge bases" the two footers mention | Not in the repository. Only the footers were read. |
| Anything about ISB itself: admissions, fees, rankings, placements, faculty, campus life | The repository holds subject notes only. |
| Data about any ISB student or class | None is in the repository. If it were, it would be used only as an aggregate over groups of five or more, and never by name. |
| The books and papers behind the frameworks the notes summarise | Not read. A framework is reported as the notes summarise it, and an author is named only where a file names one. |

## What was found and not carried over

Nothing in the repository was held back for being private or under someone else's copyright: no file holds personal data, a named paid case, a reproduced reading or a confidentiality mark. Two kinds of content were read and are handled with care:

- Worked examples whose own arithmetic does not close, and lines inside one file that contradict each other. They are listed in [disagreements](disagreements.md) and are never repeated as fact.
- Table-of-contents files, a conclusion in two skills and section headers of one or two sentences. They are pieces and are in the tables, and no claim is drawn from them.

## Refresh

The corpus is a dated reading of one commit. Before answering about a file that is not in the tables, or when the repository has moved:

1. Run `git ls-remote https://github.com/HKTITAN/isb-skills HEAD` and compare the commit with `060ee06`.
2. For each new or changed rule file: read it in full, add or update its row here, then add or correct its claims in the theme files, one line each, in your own words, with the file open.
3. Update the commit in every URL, the counts in this file, in `SKILL.md` and in `README.md`, and the date.
4. Check [disagreements](disagreements.md) and [silent](silent.md): a changed file can end a disagreement or a silence.
5. Run `node scripts/brain-check.mjs --self-test`. It fails when a claim cites a title that is not in the tables, and when `SKILL.md` does not state the number of pieces the tables hold.

Use only what is in the public repository. Course material, anything behind a login or a payment, and anything about a named student never goes into this file or into a reply.

## The corpus

467 pieces. All were read on 2026-11-11 at commit `060ee06`.

### The repository

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| isb-skills: README.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/README.md | 2026-04-10 | the repository front page | none |

### Economics

49 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Economics: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/SKILL.md | 2026-04-10 | the router | none |
| Economics: Prospect Theory and Loss Aversion | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/behavioral-prospect-theory-and-loss-aversion.md | 2026-04-10 | Behavioral Economics | CRITICAL |
| Economics: Behavioral Biases and Heuristics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/behavioral-behavioral-biases-and-heuristics.md | 2026-04-10 | Behavioral Economics | CRITICAL |
| Economics: Nudge Theory and Choice Architecture | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/behavioral-nudge-theory-and-choice-architecture.md | 2026-04-10 | Behavioral Economics | HIGH |
| Economics: Behavioral Decision-Making Frameworks | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/behavioral-behavioral-decision-making-frameworks.md | 2026-04-10 | Behavioral Economics | HIGH |
| Economics: Frameworks for Strategic Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/behavioral-frameworks-for-strategic-analysis.md | 2026-04-10 | Behavioral Economics | HIGH |
| Economics: Managing with Behavioral Insights | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/behavioral-managing-with-behavioral-insights.md | 2026-04-10 | Behavioral Economics | HIGH |
| Economics: Summary: Economics as Management Tool | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/behavioral-summary-economics-as-management-tool.md | 2026-04-10 | Behavioral Economics | CRITICAL |
| Economics: Simultaneous-Move Games | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/game-simultaneous-move-games.md | 2026-04-10 | Game Theory | MEDIUM |
| Economics: Sequential-Move Games, Extensive Form | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/game-sequential-move-games-extensive-form.md | 2026-04-10 | Game Theory | MEDIUM |
| Economics: Imperfect Information Games | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/game-imperfect-information-games.md | 2026-04-10 | Game Theory | MEDIUM |
| Economics: Game Applications to Business | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/game-game-applications-to-business.md | 2026-04-10 | Game Theory | CRITICAL |
| Economics: Adverse Selection | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/information-adverse-selection.md | 2026-04-10 | Information Economics | MEDIUM |
| Economics: Moral Hazard | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/information-moral-hazard.md | 2026-04-10 | Information Economics | MEDIUM |
| Economics: Signaling and Screening | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/information-signaling-and-screening.md | 2026-04-10 | Information Economics | MEDIUM |
| Economics: Principal-Agent Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/information-principal-agent-framework.md | 2026-04-10 | Information Economics | MEDIUM |
| Economics: Auction Theory and Design | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-auction-theory-and-design.md | 2026-04-10 | Market Design & Mechanism Design | CRITICAL |
| Economics: Mechanism Design Fundamentals | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-mechanism-design-fundamentals.md | 2026-04-10 | Market Design & Mechanism Design | HIGH |
| Economics: Matching Markets and Two-Sided Platforms | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-matching-markets-and-two-sided-platforms.md | 2026-04-10 | Market Design & Mechanism Design | CRITICAL |
| Economics: Auction Theory and Strategic Bidding | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-auction-theory-and-strategic-bidding.md | 2026-04-10 | Market Design & Mechanism Design | CRITICAL |
| Economics: Matching Markets and Network Effects | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-matching-markets-and-network-effects.md | 2026-04-10 | Market Design & Mechanism Design | MEDIUM |
| Economics: Information Aggregation and Mechanism Performance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-information-aggregation-and-mechanism-performance.md | 2026-04-10 | Market Design & Mechanism Design | HIGH |
| Economics: Supply, Demand, and Equilibrium | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/micro-supply-demand-and-equilibrium.md | 2026-04-10 | Microeconomics for Strategy | MEDIUM |
| Economics: Market Structures and Pricing Power | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/micro-market-structures-and-pricing-power.md | 2026-04-10 | Microeconomics for Strategy | HIGH |
| Economics: Value Creation and Pricing Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/micro-value-creation-and-pricing-strategy.md | 2026-04-10 | Microeconomics for Strategy | HIGH |
| Economics: Entry and Exit Decisions | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/micro-entry-and-exit-decisions.md | 2026-04-10 | Microeconomics for Strategy | CRITICAL |
| Economics: Macroeconomic Indicators | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-macroeconomic-indicators.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: Monetary Policy and Central Banking | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-monetary-policy-and-central-banking.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: Fiscal Policy and Government Finance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-fiscal-policy-and-government-finance.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: International Economics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-international-economics.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: Development Economics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-development-economics.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: Monetary Policy Transmission to Business | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-monetary-policy-transmission-to-business.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: Fiscal Policy and Public Finance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-fiscal-policy-and-public-finance.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: Public Finance and Market Failures | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-public-finance-and-market-failures.md | 2026-04-10 | Macroeconomic Foundations | MEDIUM |
| Economics: Consumer Surplus and Producer Surplus | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/surplus-consumer-surplus-and-producer-surplus.md | 2026-04-10 | Supply & Demand Mathematics | MEDIUM |
| Economics: Elasticity Applications | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/surplus-elasticity-applications.md | 2026-04-10 | Supply & Demand Mathematics | MEDIUM |
| Economics: Consumer Choice and Utility | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/surplus-consumer-choice-and-utility.md | 2026-04-10 | Supply & Demand Mathematics | MEDIUM |
| Economics: Externalities and Public Goods | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/failure-externalities-and-public-goods.md | 2026-04-10 | Market Failure & Government Intervention | MEDIUM |
| Economics: Antitrust and Competition Policy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/failure-antitrust-and-competition-policy.md | 2026-04-10 | Market Failure & Government Intervention | HIGH |
| Economics: Decision-Making Under Uncertainty | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/managers-decision-making-under-uncertainty.md | 2026-04-10 | Key Concepts for Managers | HIGH |
| Economics: Market Dynamics and Competitive Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/managers-market-dynamics-and-competitive-strategy.md | 2026-04-10 | Key Concepts for Managers | MEDIUM |
| Economics: Economic Profit and Competitive Advantage | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/strategic-economic-profit-and-competitive-advantage.md | 2026-04-10 | Strategic Economics | CRITICAL |
| Economics: Oligopoly and Strategic Interaction | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/strategic-oligopoly-and-strategic-interaction.md | 2026-04-10 | Strategic Economics | MEDIUM |
| Economics: Information Asymmetry and Organizational Design | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/strategic-information-asymmetry-and-organizational-design.md | 2026-04-10 | Strategic Economics | MEDIUM |
| Economics: Comparative Advantage and Specialization | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/international-comparative-advantage-and-specialization.md | 2026-04-10 | International Economics & Trade | MEDIUM |
| Economics: Trade Policy and Strategic Considerations | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/international-trade-policy-and-strategic-considerations.md | 2026-04-10 | International Economics & Trade | MEDIUM |
| Economics: Balance of Payments and Exchange Rates | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/international-balance-of-payments-and-exchange-rates.md | 2026-04-10 | International Economics & Trade | MEDIUM |
| Economics: Growth Fundamentals | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/development-growth-fundamentals.md | 2026-04-10 | Development Economics & Growth | MEDIUM |
| Economics: Institutional Foundations | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/development-institutional-foundations.md | 2026-04-10 | Development Economics & Growth | MEDIUM |
| Economics: Development Strategies | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/development-development-strategies.md | 2026-04-10 | Development Economics & Growth | MEDIUM |

### Entrepreneurship

61 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Entrepreneurship: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/SKILL.md | 2026-04-10 | the router | none |
| Entrepreneurship: What Defines a Startup | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/foundations-what-defines-a-startup.md | 2026-04-10 | Startup Foundations & Mindset | MEDIUM |
| Entrepreneurship: The Build-Measure-Learn Loop | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-the-build-measure-learn-loop.md | 2026-04-10 | Lean Startup Methodology | MEDIUM |
| Entrepreneurship: Build Phase: Creating the MVP | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-build-phase-creating-the-mvp.md | 2026-04-10 | Lean Startup Methodology | MEDIUM |
| Entrepreneurship: Measure Phase: Actionable Metrics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-measure-phase-actionable-metrics.md | 2026-04-10 | Lean Startup Methodology | MEDIUM |
| Entrepreneurship: Learn Phase: Insights and Hypotheses | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-learn-phase-insights-and-hypotheses.md | 2026-04-10 | Lean Startup Methodology | MEDIUM |
| Entrepreneurship: Pivot vs. Persevere Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-pivot-vs-persevere-framework.md | 2026-04-10 | Lean Startup Methodology | CRITICAL |
| Entrepreneurship: Innovation Accounting | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-innovation-accounting.md | 2026-04-10 | Lean Startup Methodology | CRITICAL |
| Entrepreneurship: Customer Development Stages | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-customer-development-stages.md | 2026-04-10 | Lean Startup Methodology | HIGH |
| Entrepreneurship: Continuous Deployment and Learning Acceleration | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-continuous-deployment-and-learning-acceleration.md | 2026-04-10 | Lean Startup Methodology | HIGH |
| Entrepreneurship: What Product-Market Fit Actually Means | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-what-product-market-fit-actually-means.md | 2026-04-10 | Product-Market Fit | CRITICAL |
| Entrepreneurship: The Sean Ellis Test | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-the-sean-ellis-test.md | 2026-04-10 | Product-Market Fit | MEDIUM |
| Entrepreneurship: Clear PMF Signals | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-clear-pmf-signals.md | 2026-04-10 | Product-Market Fit | MEDIUM |
| Entrepreneurship: Before PMF: The Search Phase | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-before-pmf-the-search-phase.md | 2026-04-10 | Product-Market Fit | MEDIUM |
| Entrepreneurship: After PMF: The Scaling Phase | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-after-pmf-the-scaling-phase.md | 2026-04-10 | Product-Market Fit | HIGH |
| Entrepreneurship: Common Product-Market Fit Mistakes | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-common-product-market-fit-mistakes.md | 2026-04-10 | Product-Market Fit | CRITICAL |
| Entrepreneurship: Business Model Definition and Types | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/bizmodel-business-model-definition-and-types.md | 2026-04-10 | Business Models & Monetization | MEDIUM |
| Entrepreneurship: Unit Economics: The Foundation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/bizmodel-unit-economics-the-foundation.md | 2026-04-10 | Business Models & Monetization | HIGH |
| Entrepreneurship: The 3x Rule for Sustainable Growth | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/bizmodel-the-3x-rule-for-sustainable-growth.md | 2026-04-10 | Business Models & Monetization | MEDIUM |
| Entrepreneurship: Business Plan Structure, for operations and team | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pitch-business-plan-structure-for-operations-and-team.md | 2026-04-10 | Business Planning & Pitch Decks | MEDIUM |
| Entrepreneurship: Pitch Deck Design, for investors | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pitch-pitch-deck-design-for-investors.md | 2026-04-10 | Business Planning & Pitch Decks | CRITICAL |
| Entrepreneurship: Pitch Narrative, 5-minute verbal pitch | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pitch-pitch-narrative-5-minute-verbal-pitch.md | 2026-04-10 | Business Planning & Pitch Decks | MEDIUM |
| Entrepreneurship: Storytelling for Investors | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pitch-storytelling-for-investors.md | 2026-04-10 | Business Planning & Pitch Decks | MEDIUM |
| Entrepreneurship: Financial Projections in Detail | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pitch-financial-projections-in-detail.md | 2026-04-10 | Business Planning & Pitch Decks | MEDIUM |
| Entrepreneurship: VC Fund Mechanics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-vc-fund-mechanics.md | 2026-04-10 | Venture Capital & Fundraising | MEDIUM |
| Entrepreneurship: GP-LP Dynamics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-gp-lp-dynamics.md | 2026-04-10 | Venture Capital & Fundraising | MEDIUM |
| Entrepreneurship: Investment Thesis and Due Diligence | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-investment-thesis-and-due-diligence.md | 2026-04-10 | Venture Capital & Fundraising | CRITICAL |
| Entrepreneurship: Term Sheet Terms and Negotiation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-term-sheet-terms-and-negotiation.md | 2026-04-10 | Venture Capital & Fundraising | CRITICAL |
| Entrepreneurship: Valuation at Different Stages | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-valuation-at-different-stages.md | 2026-04-10 | Venture Capital & Fundraising | CRITICAL |
| Entrepreneurship: Investment Types by Stage | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-investment-types-by-stage.md | 2026-04-10 | Venture Capital & Fundraising | HIGH |
| Entrepreneurship: Exit Strategies, how VCs get returns | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-exit-strategies-how-vcs-get-returns.md | 2026-04-10 | Venture Capital & Fundraising | HIGH |
| Entrepreneurship: Cap Tables and Ownership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-cap-tables-and-ownership.md | 2026-04-10 | Startup Finance | CRITICAL |
| Entrepreneurship: Dilution Mechanics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-dilution-mechanics.md | 2026-04-10 | Startup Finance | MEDIUM |
| Entrepreneurship: Fundraising Instruments | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-fundraising-instruments.md | 2026-04-10 | Startup Finance | CRITICAL |
| Entrepreneurship: Employee Equity and Vesting | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-employee-equity-and-vesting.md | 2026-04-10 | Startup Finance | MEDIUM |
| Entrepreneurship: Liquidation Preferences in Exit Scenarios | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-liquidation-preferences-in-exit-scenarios.md | 2026-04-10 | Startup Finance | MEDIUM |
| Entrepreneurship: Down Rounds | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-down-rounds.md | 2026-04-10 | Startup Finance | CRITICAL |
| Entrepreneurship: Failed vs. Successful Exits | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-failed-vs-successful-exits.md | 2026-04-10 | Startup Finance | MEDIUM |
| Entrepreneurship: Unit Economics: Foundation of Scaling | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/scaling-unit-economics-foundation-of-scaling.md | 2026-04-10 | Scaling a Startup | HIGH |
| Entrepreneurship: Scaling Phases | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/scaling-scaling-phases.md | 2026-04-10 | Scaling a Startup | HIGH |
| Entrepreneurship: Blitzscaling vs. Sustainable Growth | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/scaling-blitzscaling-vs-sustainable-growth.md | 2026-04-10 | Scaling a Startup | HIGH |
| Entrepreneurship: The Founder-to-Manager Transition | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/scaling-the-founder-to-manager-transition.md | 2026-04-10 | Scaling a Startup | HIGH |
| Entrepreneurship: Scaling Metrics to Track Weekly | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/scaling-scaling-metrics-to-track-weekly.md | 2026-04-10 | Scaling a Startup | HIGH |
| Entrepreneurship: When to Slow Down | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/scaling-when-to-slow-down.md | 2026-04-10 | Scaling a Startup | HIGH |
| Entrepreneurship: Top Failure Reasons, Research-Based | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-top-failure-reasons-research-based.md | 2026-04-10 | Startup Failure Patterns | HIGH |
| Entrepreneurship: Early Warning Signs | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-early-warning-signs.md | 2026-04-10 | Startup Failure Patterns | MEDIUM |
| Entrepreneurship: The Pivot Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-the-pivot-framework.md | 2026-04-10 | Startup Failure Patterns | MEDIUM |
| Entrepreneurship: Common Pivot Types | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-common-pivot-types.md | 2026-04-10 | Startup Failure Patterns | MEDIUM |
| Entrepreneurship: When to Shut Down | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-when-to-shut-down.md | 2026-04-10 | Startup Failure Patterns | HIGH |
| Entrepreneurship: Food and Consumer Business Entrepreneurship | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/specialized-food-and-consumer-business-entrepreneurship.md | 2026-04-10 | Specialized Entrepreneurship Topics | CRITICAL |
| Entrepreneurship: Social Entrepreneurship | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/specialized-social-entrepreneurship.md | 2026-04-10 | Specialized Entrepreneurship Topics | HIGH |
| Entrepreneurship: Impact Measurement | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/specialized-impact-measurement.md | 2026-04-10 | Specialized Entrepreneurship Topics | MEDIUM |
| Entrepreneurship: B-Corporations and Governance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/specialized-b-corporations-and-governance.md | 2026-04-10 | Specialized Entrepreneurship Topics | HIGH |
| Entrepreneurship: Bottom-of-Pyramid Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/specialized-bottom-of-pyramid-strategy.md | 2026-04-10 | Specialized Entrepreneurship Topics | MEDIUM |
| Entrepreneurship: Microfinance and Financial Inclusion | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/specialized-microfinance-and-financial-inclusion.md | 2026-04-10 | Specialized Entrepreneurship Topics | MEDIUM |
| Entrepreneurship: Balance Ambition with Realism | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/principles-balance-ambition-with-realism.md | 2026-04-10 | Operating Principles for Entrepreneurs | MEDIUM |
| Entrepreneurship: Emphasize Testing Over Opinions | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/principles-emphasize-testing-over-opinions.md | 2026-04-10 | Operating Principles for Entrepreneurs | MEDIUM |
| Entrepreneurship: Focus on Unit Economics Foundation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/principles-focus-on-unit-economics-foundation.md | 2026-04-10 | Operating Principles for Entrepreneurs | HIGH |
| Entrepreneurship: Discuss Common Failures Honestly | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/principles-discuss-common-failures-honestly.md | 2026-04-10 | Operating Principles for Entrepreneurs | MEDIUM |
| Entrepreneurship: Be Practical and Founder-Focused | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/principles-be-practical-and-founder-focused.md | 2026-04-10 | Operating Principles for Entrepreneurs | MEDIUM |
| Entrepreneurship: Key Frameworks to Master | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/principles-key-frameworks-to-master.md | 2026-04-10 | Operating Principles for Entrepreneurs | HIGH |
| Entrepreneurship: Conclusion | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/conclusion-conclusion.md | 2026-04-10 | not indexed | CRITICAL |

### Finance

49 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Finance: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/SKILL.md | 2026-11-01 | the router | none |
| Finance: The Accounting Equation: Foundation of All Finance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/statements-the-accounting-equation-foundation-of-all-finance.md | 2026-04-10 | Financial Statements & Fundamentals | MEDIUM |
| Finance: The Three Financial Statements | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/statements-the-three-financial-statements.md | 2026-04-10 | Financial Statements & Fundamentals | HIGH |
| Finance: Key Insight: The Three Statements Connect | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/statements-key-insight-the-three-statements-connect.md | 2026-04-10 | Financial Statements & Fundamentals | HIGH |
| Finance: Profitability Ratios | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-profitability-ratios.md | 2026-04-10 | Financial Ratio Analysis | MEDIUM |
| Finance: Liquidity Ratios | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-liquidity-ratios.md | 2026-04-10 | Financial Ratio Analysis | HIGH |
| Finance: Leverage, Solvency Ratios | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-leverage-solvency-ratios.md | 2026-04-10 | Financial Ratio Analysis | CRITICAL |
| Finance: Efficiency Ratios | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-efficiency-ratios.md | 2026-04-10 | Financial Ratio Analysis | HIGH |
| Finance: Pitfalls to Avoid | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-pitfalls-to-avoid.md | 2026-04-10 | Financial Ratio Analysis | CRITICAL |
| Finance: DuPont Analysis & Performance Decomposition | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/dupont-dupont-analysis-performance-decomposition.md | 2026-04-10 | DuPont Analysis & Performance Decomposition | CRITICAL |
| Finance: DCF, Discounted Cash Flow Valuation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md | 2026-04-10 | Valuation Methodologies | CRITICAL |
| Finance: CAPM, Capital Asset Pricing Model | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-capm-capital-asset-pricing-model.md | 2026-04-10 | Valuation Methodologies | CRITICAL |
| Finance: WACC, Weighted Average Cost of Capital | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-wacc-weighted-average-cost-of-capital.md | 2026-04-10 | Valuation Methodologies | CRITICAL |
| Finance: Comparable Multiples Valuation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-comparable-multiples-valuation.md | 2026-04-10 | Valuation Methodologies | CRITICAL |
| Finance: Valuation Triangulation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-valuation-triangulation.md | 2026-04-10 | Valuation Methodologies | CRITICAL |
| Finance: Understanding WACC Components | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/costcap-understanding-wacc-components.md | 2026-04-10 | Cost of Capital | CRITICAL |
| Finance: Industry WACC Ranges, as of 2026 | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/costcap-industry-wacc-ranges-as-of-2026.md | 2026-04-10 | Cost of Capital | CRITICAL |
| Finance: Modigliani-Miller Theorem | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-modigliani-miller-theorem.md | 2026-04-10 | Corporate Finance & Capital Structure | CRITICAL |
| Finance: Trade-Off Theory | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-trade-off-theory.md | 2026-04-10 | Corporate Finance & Capital Structure | CRITICAL |
| Finance: Pecking Order Theory | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-pecking-order-theory.md | 2026-04-10 | Corporate Finance & Capital Structure | CRITICAL |
| Finance: Levering/Unlevering Beta | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-leveringunlevering-beta.md | 2026-04-10 | Corporate Finance & Capital Structure | MEDIUM |
| Finance: Strategic Rationale for M&A | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-strategic-rationale-for-ma.md | 2026-04-10 | Mergers & Acquisitions | HIGH |
| Finance: M&A Process | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-ma-process.md | 2026-04-10 | Mergers & Acquisitions | CRITICAL |
| Finance: Common Red Flags in Due Diligence | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-common-red-flags-in-due-diligence.md | 2026-04-10 | Mergers & Acquisitions | HIGH |
| Finance: Accretion/Dilution Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-accretiondilution-analysis.md | 2026-04-10 | Mergers & Acquisitions | MEDIUM |
| Finance: Synergy Realization | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-synergy-realization.md | 2026-04-10 | Mergers & Acquisitions | MEDIUM |
| Finance: Hostile Takeovers & Defenses | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-hostile-takeovers-defenses.md | 2026-04-10 | Mergers & Acquisitions | HIGH |
| Finance: PE Fund Economics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-pe-fund-economics.md | 2026-04-10 | Private Equity & LBOs | MEDIUM |
| Finance: Value Creation Levers | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-value-creation-levers.md | 2026-04-10 | Private Equity & LBOs | HIGH |
| Finance: LBO Modeling | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-lbo-modeling.md | 2026-04-10 | Private Equity & LBOs | MEDIUM |
| Finance: PE Exits | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-pe-exits.md | 2026-04-10 | Private Equity & LBOs | MEDIUM |
| Finance: Types of Financial Risk | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/risk-types-of-financial-risk.md | 2026-04-10 | Risk Management & Derivatives | MEDIUM |
| Finance: Derivatives for Hedging | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/risk-derivatives-for-hedging.md | 2026-04-10 | Risk Management & Derivatives | HIGH |
| Finance: Value-at-Risk, VaR | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/risk-value-at-risk-var.md | 2026-04-10 | Risk Management & Derivatives | MEDIUM |
| Finance: Hedging Effectiveness | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/risk-hedging-effectiveness.md | 2026-04-10 | Risk Management & Derivatives | MEDIUM |
| Finance: Bank Valuation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-bank-valuation.md | 2026-04-10 | Specialized Finance Topics | CRITICAL |
| Finance: Real Estate Finance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-real-estate-finance.md | 2026-04-10 | Specialized Finance Topics | MEDIUM |
| Finance: Behavioral Finance & Investor Bias | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-behavioral-finance-investor-bias.md | 2026-04-10 | Specialized Finance Topics | CRITICAL |
| Finance: Financial Inclusion & Emerging Markets Context | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-financial-inclusion-emerging-markets-context.md | 2026-04-10 | Specialized Finance Topics | MEDIUM |
| Finance: AI in Finance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-ai-in-finance.md | 2026-04-10 | Specialized Finance Topics | CRITICAL |
| Finance: Working Capital Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/workcap-working-capital-management.md | 2026-04-10 | Working Capital Management | CRITICAL |
| Finance: Profitability | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-profitability.md | 2026-04-10 | Key Financial Formulas | MEDIUM |
| Finance: Liquidity | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-liquidity.md | 2026-04-10 | Key Financial Formulas | HIGH |
| Finance: Leverage | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-leverage.md | 2026-04-10 | Key Financial Formulas | MEDIUM |
| Finance: Efficiency | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-efficiency.md | 2026-04-10 | Key Financial Formulas | HIGH |
| Finance: DuPont | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-dupont.md | 2026-04-10 | Key Financial Formulas | CRITICAL |
| Finance: Valuation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-valuation.md | 2026-04-10 | Key Financial Formulas | CRITICAL |
| Finance: Capital Structure | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-capital-structure.md | 2026-04-10 | Key Financial Formulas | CRITICAL |
| Finance: Growth & Sustainability | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-growth-sustainability.md | 2026-04-10 | Key Financial Formulas | MEDIUM |
| Finance: Table of Contents | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/table-of-conten-table-of-contents.md | 2026-04-10 | not indexed | CRITICAL |

### Leadership

49 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Leadership: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/SKILL.md | 2026-04-10 | the router | none |
| Leadership: Maslow's Hierarchy of Needs | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/motivation-maslows-hierarchy-of-needs.md | 2026-04-10 | Motivation Theory & Performance Management | MEDIUM |
| Leadership: Herzberg's Two-Factor Theory | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/motivation-herzbergs-two-factor-theory.md | 2026-04-10 | Motivation Theory & Performance Management | MEDIUM |
| Leadership: McClelland's Three Needs Theory | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/motivation-mcclellands-three-needs-theory.md | 2026-04-10 | Motivation Theory & Performance Management | MEDIUM |
| Leadership: Self-Determination Theory, Deci & Ryan | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/motivation-self-determination-theory-deci-ryan.md | 2026-04-10 | Motivation Theory & Performance Management | MEDIUM |
| Leadership: Performance Management Systems | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/motivation-performance-management-systems.md | 2026-04-10 | Motivation Theory & Performance Management | MEDIUM |
| Leadership: Team Dynamics and High-Performance Teams | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/teams-team-dynamics-and-high-performance-teams.md | 2026-04-10 | Teams & Organizations | MEDIUM |
| Leadership: Team Composition and Role Clarity | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/teams-team-composition-and-role-clarity.md | 2026-04-10 | Teams & Organizations | MEDIUM |
| Leadership: Organizational Culture and Design | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/teams-organizational-culture-and-design.md | 2026-04-10 | Teams & Organizations | MEDIUM |
| Leadership: Change Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/teams-change-management.md | 2026-04-10 | Teams & Organizations | CRITICAL |
| Leadership: Cross-Cultural Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/teams-cross-cultural-management.md | 2026-04-10 | Teams & Organizations | MEDIUM |
| Leadership: Cognitive Biases Catalog and Debiasing Strategies | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/decisions-cognitive-biases-catalog-and-debiasing-strategies.md | 2026-04-10 | Decision-Making & Cognitive Biases | CRITICAL |
| Leadership: Decision-Making Frameworks | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/decisions-decision-making-frameworks.md | 2026-04-10 | Decision-Making & Cognitive Biases | CRITICAL |
| Leadership: Groupthink: Symptoms and Prevention | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/decisions-groupthink-symptoms-and-prevention.md | 2026-04-10 | Decision-Making & Cognitive Biases | MEDIUM |
| Leadership: Power, Politics, and Influence in Organizations | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/decisions-power-politics-and-influence-in-organizations.md | 2026-11-01 | Decision-Making & Cognitive Biases | MEDIUM |
| Leadership: Vroom-Yetton Model Expanded | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/decisions-vroom-yetton-model-expanded.md | 2026-04-10 | Decision-Making & Cognitive Biases | HIGH |
| Leadership: Cialdini's Six Principles of Influence | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/influence-cialdinis-six-principles-of-influence.md | 2026-11-01 | Influence & Persuasion | MEDIUM |
| Leadership: Framing Effects in Persuasion | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/influence-framing-effects-in-persuasion.md | 2026-04-10 | Influence & Persuasion | MEDIUM |
| Leadership: Credibility Building | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/influence-credibility-building.md | 2026-04-10 | Influence & Persuasion | MEDIUM |
| Leadership: BATNA: Best Alternative to Negotiated Agreement | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-batna-best-alternative-to-negotiated-agreement.md | 2026-04-10 | Negotiation | CRITICAL |
| Leadership: ZOPA: Zone of Possible Agreement | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-zopa-zone-of-possible-agreement.md | 2026-04-10 | Negotiation | CRITICAL |
| Leadership: Negotiation Preparation: The Foundation of Success | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-negotiation-preparation-the-foundation-of-success.md | 2026-04-10 | Negotiation | CRITICAL |
| Leadership: Deal Structuring and Creative Problem-Solving | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-deal-structuring-and-creative-problem-solving.md | 2026-04-10 | Negotiation | CRITICAL |
| Leadership: Emotional Intelligence in Negotiation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-emotional-intelligence-in-negotiation.md | 2026-04-10 | Negotiation | CRITICAL |
| Leadership: Thomas-Kilmann Five Modes | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/conflict-thomas-kilmann-five-modes.md | 2026-04-10 | Conflict Resolution | MEDIUM |
| Leadership: Negotiation Fundamentals Beyond BATNA | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/conflict-negotiation-fundamentals-beyond-batna.md | 2026-04-10 | Conflict Resolution | CRITICAL |
| Leadership: Escalation Dynamics and De-escalation Techniques | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/conflict-escalation-dynamics-and-de-escalation-techniques.md | 2026-04-10 | Conflict Resolution | MEDIUM |
| Leadership: Emotional Intelligence, EI | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-emotional-intelligence-ei.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | CRITICAL |
| Leadership: Goleman's Six Leadership Styles | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-golemans-six-leadership-styles.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | MEDIUM |
| Leadership: Authentic Leadership & Servant Leadership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-authentic-leadership-servant-leadership.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | MEDIUM |
| Leadership: Key Principles for Effective Leadership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-key-principles-for-effective-leadership.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | HIGH |
| Leadership: Authentic Leadership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-authentic-leadership.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | MEDIUM |
| Leadership: Servant Leadership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-servant-leadership.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | MEDIUM |
| Leadership: Life MAP Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-life-map-framework.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | MEDIUM |
| Leadership: Achievement-Affiliation-Power, AAP Motivation Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-achievement-affiliation-power-aap-motivation-framework.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | MEDIUM |
| Leadership: Executive Derailment Patterns | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-executive-derailment-patterns.md | 2026-04-10 | Leadership Styles & Emotional Intelligence | MEDIUM |
| Leadership: Corporate Governance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/governance-corporate-governance.md | 2026-04-10 | Organizational Governance & Ethics | HIGH |
| Leadership: Ethical Leadership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/governance-ethical-leadership.md | 2026-04-10 | Organizational Governance & Ethics | HIGH |
| Leadership: Stakeholder Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/governance-stakeholder-management.md | 2026-04-10 | Organizational Governance & Ethics | MEDIUM |
| Leadership: Vision and Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/strategic-vision-and-strategy.md | 2026-04-10 | Strategic Leadership | MEDIUM |
| Leadership: CEO Decision-Making Categories | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/strategic-ceo-decision-making-categories.md | 2026-04-10 | Strategic Leadership | HIGH |
| Leadership: Crisis Leadership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/strategic-crisis-leadership.md | 2026-04-10 | Strategic Leadership | MEDIUM |
| Leadership: Organizational Turnaround | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/strategic-organizational-turnaround.md | 2026-04-10 | Strategic Leadership | MEDIUM |
| Leadership: CEO Challenges and Specific Leadership Contexts | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/strategic-ceo-challenges-and-specific-leadership-contexts.md | 2026-04-10 | Strategic Leadership | MEDIUM |
| Leadership: Succession Planning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/strategic-succession-planning.md | 2026-04-10 | Strategic Leadership | MEDIUM |
| Leadership: Oral Communication | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/communication-oral-communication.md | 2026-04-10 | Communication & Influence | CRITICAL |
| Leadership: Written Communication | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/communication-written-communication.md | 2026-04-10 | Communication & Influence | MEDIUM |
| Leadership: Corporate Governance Frameworks | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/communication-corporate-governance-frameworks.md | 2026-11-01 | Communication & Influence | HIGH |
| Leadership: Board Composition and Dynamics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/communication-board-composition-and-dynamics.md | 2026-04-10 | Communication & Influence | MEDIUM |
| Leadership: Related Theories & Frameworks | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/related-theorie-related-theories-frameworks.md | 2026-04-10 | not indexed | MEDIUM |

### Marketing

64 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Marketing: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/SKILL.md | 2026-04-10 | the router | none |
| Marketing: Strategic Foundations: the 5Cs, STP, and 4Ps | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/foundations-strategic-foundations-the-5cs-stp-and-4ps.md | 2026-04-10 | Strategic Foundations: 5Cs, STP, 4Ps | CRITICAL |
| Marketing: The 5Cs Framework: Situational Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/foundations-the-5cs-framework-situational-analysis.md | 2026-04-10 | Strategic Foundations: 5Cs, STP, 4Ps | CRITICAL |
| Marketing: STP Framework: Segmentation, Targeting, Positioning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/foundations-stp-framework-segmentation-targeting-positioning.md | 2026-11-01 | Strategic Foundations: 5Cs, STP, 4Ps | CRITICAL |
| Marketing: Brand Management & Equity | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/brand-brand-management-equity.md | 2026-04-10 | Brand Management & Equity | CRITICAL |
| Marketing: Keller's Customer-Based Brand Equity Model | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/brand-kellers-customer-based-brand-equity-model.md | 2026-04-10 | Brand Management & Equity | HIGH |
| Marketing: Measuring Brand Equity | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/brand-measuring-brand-equity.md | 2026-04-10 | Brand Management & Equity | HIGH |
| Marketing: Building and Protecting Brand Equity | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/brand-building-and-protecting-brand-equity.md | 2026-04-10 | Brand Management & Equity | HIGH |
| Marketing: Brand Architecture Decisions | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/brand-brand-architecture-decisions.md | 2026-04-10 | Brand Management & Equity | MEDIUM |
| Marketing: Brand Loyalty | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/brand-brand-loyalty.md | 2026-04-10 | Brand Management & Equity | HIGH |
| Marketing: Pricing Strategy & Models | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/pricing-pricing-strategy-models.md | 2026-04-10 | Pricing Strategy & Models | HIGH |
| Marketing: Three Core Pricing Approaches | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/pricing-three-core-pricing-approaches.md | 2026-04-10 | Pricing Strategy & Models | HIGH |
| Marketing: Advanced Pricing Strategies | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/pricing-advanced-pricing-strategies.md | 2026-04-10 | Pricing Strategy & Models | CRITICAL |
| Marketing: Pricing Strategy Development | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/pricing-pricing-strategy-development.md | 2026-04-10 | Pricing Strategy & Models | HIGH |
| Marketing: Digital Marketing & Channels | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-digital-marketing-channels.md | 2026-04-10 | Digital Marketing & Channels | MEDIUM |
| Marketing: Search Engine Optimization, SEO and Content Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-search-engine-optimization-seo-and-content-strategy.md | 2026-04-10 | Digital Marketing & Channels | MEDIUM |
| Marketing: Social Media Marketing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-social-media-marketing.md | 2026-04-10 | Digital Marketing & Channels | CRITICAL |
| Marketing: Email Marketing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-email-marketing.md | 2026-04-10 | Digital Marketing & Channels | MEDIUM |
| Marketing: Influencer Marketing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-influencer-marketing.md | 2026-04-10 | Digital Marketing & Channels | MEDIUM |
| Marketing: Programmatic Advertising | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-programmatic-advertising.md | 2026-04-10 | Digital Marketing & Channels | HIGH |
| Marketing: Affiliate Marketing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-affiliate-marketing.md | 2026-04-10 | Digital Marketing & Channels | MEDIUM |
| Marketing: Marketing Analytics & Attribution | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-marketing-analytics-attribution.md | 2026-04-10 | Digital Marketing & Channels | HIGH |
| Marketing: Consumer Behavior & Psychology | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/consumer-consumer-behavior-psychology.md | 2026-04-10 | Consumer Behavior & Psychology | MEDIUM |
| Marketing: Customer Journey: Awareness to Loyalty | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/consumer-customer-journey-awareness-to-loyalty.md | 2026-11-01 | Consumer Behavior & Psychology | HIGH |
| Marketing: Journey Archetypes | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/consumer-journey-archetypes.md | 2026-04-10 | Consumer Behavior & Psychology | MEDIUM |
| Marketing: Behavioral Biases | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/consumer-behavioral-biases.md | 2026-04-10 | Consumer Behavior & Psychology | HIGH |
| Marketing: Attitude Formation and Change | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/consumer-attitude-formation-and-change.md | 2026-04-10 | Consumer Behavior & Psychology | CRITICAL |
| Marketing: B2B Marketing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-b2b-marketing.md | 2026-04-10 | B2B Marketing (b2b) | MEDIUM |
| Marketing: Key B2B Characteristics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-key-b2b-characteristics.md | 2026-04-10 | B2B Marketing (b2b) | MEDIUM |
| Marketing: Decision-Making Units, DMU | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-decision-making-units-dmu.md | 2026-04-10 | B2B Marketing (b2b) | CRITICAL |
| Marketing: B2B Value Propositions | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-b2b-value-propositions.md | 2026-04-10 | B2B Marketing (b2b) | MEDIUM |
| Marketing: Longer B2B Sales Cycles | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-longer-b2b-sales-cycles.md | 2026-04-10 | B2B Marketing (b2b) | CRITICAL |
| Marketing: B2B Relationship Marketing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-b2b-relationship-marketing.md | 2026-11-01 | B2B Marketing (b2b) | MEDIUM |
| Marketing: B2B Marketing Channels | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-b2b-marketing-channels.md | 2026-04-10 | B2B Marketing (b2b) | MEDIUM |
| Marketing: Services Marketing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/services-services-marketing.md | 2026-11-01 | Services Marketing | MEDIUM |
| Marketing: IHIP Characteristics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/services-ihip-characteristics.md | 2026-04-10 | Services Marketing | MEDIUM |
| Marketing: The 7Ps for Services | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/services-the-7ps-for-services.md | 2026-04-10 | Services Marketing | CRITICAL |
| Marketing: SERVQUAL Model | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/services-servqual-model.md | 2026-11-01 | Services Marketing | MEDIUM |
| Marketing: Service Blueprinting | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/services-service-blueprinting.md | 2026-04-10 | Services Marketing | MEDIUM |
| Marketing: Gaps Model | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/services-gaps-model.md | 2026-04-10 | Services Marketing | MEDIUM |
| Marketing: Retail & Omnichannel Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-retail-omnichannel-strategy.md | 2026-04-10 | Retail & Omnichannel Strategy | MEDIUM |
| Marketing: Retail Strategy Fundamentals | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-retail-strategy-fundamentals.md | 2026-04-10 | Retail & Omnichannel Strategy | MEDIUM |
| Marketing: Brick-and-Click Integration | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-brick-and-click-integration.md | 2026-04-10 | Retail & Omnichannel Strategy | HIGH |
| Marketing: Last-Mile Delivery | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-last-mile-delivery.md | 2026-11-01 | Retail & Omnichannel Strategy | MEDIUM |
| Marketing: Retail Analytics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-retail-analytics.md | 2026-04-10 | Retail & Omnichannel Strategy | HIGH |
| Marketing: The Reality: Category Splits | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-the-reality-category-splits.md | 2026-04-10 | Retail & Omnichannel Strategy | MEDIUM |
| Marketing: Marketing Research & Insights | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/research-marketing-research-insights.md | 2026-04-10 | Marketing Research & Insights | MEDIUM |
| Marketing: Research Methods | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/research-research-methods.md | 2026-04-10 | Marketing Research & Insights | HIGH |
| Marketing: Market Segmentation Research | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/research-market-segmentation-research.md | 2026-04-10 | Marketing Research & Insights | HIGH |
| Marketing: Customer Journey Research | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/research-customer-journey-research.md | 2026-04-10 | Marketing Research & Insights | HIGH |
| Marketing: Competitive Intelligence | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/research-competitive-intelligence.md | 2026-04-10 | Marketing Research & Insights | HIGH |
| Marketing: Brand Research | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/research-brand-research.md | 2026-04-10 | Marketing Research & Insights | MEDIUM |
| Marketing: Go-to-Market Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/gtm-go-to-market-strategy.md | 2026-04-10 | Go-To-Market Strategy | HIGH |
| Marketing: GTM Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/gtm-gtm-framework.md | 2026-04-10 | Go-To-Market Strategy | HIGH |
| Marketing: Launch Sequencing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/gtm-launch-sequencing.md | 2026-04-10 | Go-To-Market Strategy | CRITICAL |
| Marketing: Market Entry Strategies | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/gtm-market-entry-strategies.md | 2026-04-10 | Go-To-Market Strategy | MEDIUM |
| Marketing: Financial Metrics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/formulas-financial-metrics.md | 2026-11-01 | Key Marketing Formulas & Metrics | HIGH |
| Marketing: Marketing Metrics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/formulas-marketing-metrics.md | 2026-04-10 | Key Marketing Formulas & Metrics | MEDIUM |
| Marketing: Attribution & Analytics Metrics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/formulas-attribution-analytics-metrics.md | 2026-04-10 | Key Marketing Formulas & Metrics | MEDIUM |
| Marketing: Decision Framework: Channel Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/appendix-framew-decision-framework-channel-strategy.md | 2026-04-10 | not indexed | MEDIUM |
| Marketing: Decision Framework: Positioning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/appendix-framew-decision-framework-positioning.md | 2026-11-01 | not indexed | MEDIUM |
| Marketing: Decision Framework: Pricing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/appendix-framew-decision-framework-pricing.md | 2026-04-10 | not indexed | HIGH |
| Marketing: Decision Framework: Segmentation Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/appendix-framew-decision-framework-segmentation-strategy.md | 2026-04-10 | not indexed | HIGH |
| Marketing: Conclusion | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/conclusion-conclusion.md | 2026-04-10 | not indexed | CRITICAL |
| Marketing: Table of Contents | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/table-of-conten-table-of-contents.md | 2026-04-10 | not indexed | CRITICAL |

### MBA Tutor

60 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| MBA Tutor: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/SKILL.md | 2026-04-10 | the router | none |
| MBA Tutor: Cross-Domain Connections | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-cross-domain-connections.md | 2026-04-10 | Cross-Domain Connections | MEDIUM |
| MBA Tutor: Finance ↔ Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-finance-strategy.md | 2026-04-10 | Cross-Domain Connections | CRITICAL |
| MBA Tutor: Marketing ↔ Economics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-marketing-economics.md | 2026-04-10 | Cross-Domain Connections | HIGH |
| MBA Tutor: Operations ↔ Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-operations-strategy.md | 2026-04-10 | Cross-Domain Connections | CRITICAL |
| MBA Tutor: Leadership ↔ Operations | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-leadership-operations.md | 2026-04-10 | Cross-Domain Connections | CRITICAL |
| MBA Tutor: Technology ↔ All Domains | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-technology-all-domains.md | 2026-04-10 | Cross-Domain Connections | CRITICAL |
| MBA Tutor: Entrepreneurship ↔ Finance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-entrepreneurship-finance.md | 2026-04-10 | Cross-Domain Connections | HIGH |
| MBA Tutor: Economics ↔ Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-economics-strategy.md | 2026-04-10 | Cross-Domain Connections | MEDIUM |
| MBA Tutor: Case Analysis Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-case-analysis-framework.md | 2026-04-10 | Case Analysis Framework | MEDIUM |
| MBA Tutor: Step 1: Situation Analysis, Context and Diagnosis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-step-1-situation-analysis-context-and-diagnosis.md | 2026-04-10 | Case Analysis Framework | CRITICAL |
| MBA Tutor: Step 2: Problem Identification | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-step-2-problem-identification.md | 2026-04-10 | Case Analysis Framework | MEDIUM |
| MBA Tutor: Step 3: Alternative Generation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-step-3-alternative-generation.md | 2026-04-10 | Case Analysis Framework | MEDIUM |
| MBA Tutor: Step 4: Recommendation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-step-4-recommendation.md | 2026-04-10 | Case Analysis Framework | CRITICAL |
| MBA Tutor: Step 5: Implementation Plan | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-step-5-implementation-plan.md | 2026-04-10 | Case Analysis Framework | MEDIUM |
| MBA Tutor: Integration Exercise: the Complete Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-integration-exercise-the-complete-analysis.md | 2026-04-10 | Case Analysis Framework | CRITICAL |
| MBA Tutor: Financial Statements and What They Reveal | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-financial-statements-and-what-they-reveal.md | 2026-04-10 | Integrated Thinking by Domain | MEDIUM |
| MBA Tutor: Unit Economics and Scalability | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-unit-economics-and-scalability.md | 2026-04-10 | Integrated Thinking by Domain | HIGH |
| MBA Tutor: Valuation and Strategic Decisions | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-valuation-and-strategic-decisions.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Capital Structure and Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-capital-structure-and-strategy.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Competitive Advantage | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-competitive-advantage.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Market Positioning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-market-positioning.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Competitive Response and Game Theory | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-competitive-response-and-game-theory.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Segmentation and Targeting | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-segmentation-and-targeting.md | 2026-04-10 | Integrated Thinking by Domain | MEDIUM |
| MBA Tutor: Customer Acquisition and Lifetime Value | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-customer-acquisition-and-lifetime-value.md | 2026-04-10 | Integrated Thinking by Domain | HIGH |
| MBA Tutor: Brand and Positioning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-brand-and-positioning.md | 2026-04-10 | Integrated Thinking by Domain | HIGH |
| MBA Tutor: Efficiency vs Flexibility Tradeoff | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-efficiency-vs-flexibility-tradeoff.md | 2026-04-10 | Integrated Thinking by Domain | MEDIUM |
| MBA Tutor: Quality and Cost | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-quality-and-cost.md | 2026-04-10 | Integrated Thinking by Domain | MEDIUM |
| MBA Tutor: Supply Chain as Competitive Advantage | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-supply-chain-as-competitive-advantage.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Elasticity and Pricing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-elasticity-and-pricing.md | 2026-04-10 | Integrated Thinking by Domain | HIGH |
| MBA Tutor: Market Structures and Competition | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-market-structures-and-competition.md | 2026-04-10 | Integrated Thinking by Domain | MEDIUM |
| MBA Tutor: Network Effects and Platform Dynamics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-network-effects-and-platform-dynamics.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Organizational Design | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-organizational-design.md | 2026-04-10 | Integrated Thinking by Domain | MEDIUM |
| MBA Tutor: Culture and Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-culture-and-strategy.md | 2026-04-10 | Integrated Thinking by Domain | HIGH |
| MBA Tutor: Change Management and Implementation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-change-management-and-implementation.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Leadership Styles and Context | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-leadership-styles-and-context.md | 2026-04-10 | Integrated Thinking by Domain | HIGH |
| MBA Tutor: Technology as Enabler vs Differentiator | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-technology-as-enabler-vs-differentiator.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Digital Transformation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-digital-transformation.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: AI and Machine Learning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-ai-and-machine-learning.md | 2026-04-10 | Integrated Thinking by Domain | CRITICAL |
| MBA Tutor: Industry Disruption Pattern | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/patterns-industry-disruption-pattern.md | 2026-04-10 | Cross-Case Analysis Patterns | CRITICAL |
| MBA Tutor: Performance Decline Pattern | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/patterns-performance-decline-pattern.md | 2026-04-10 | Cross-Case Analysis Patterns | MEDIUM |
| MBA Tutor: Scaling Challenges Pattern | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/patterns-scaling-challenges-pattern.md | 2026-04-10 | Cross-Case Analysis Patterns | HIGH |
| MBA Tutor: Market Entry Strategy Pattern | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/patterns-market-entry-strategy-pattern.md | 2026-04-10 | Cross-Case Analysis Patterns | MEDIUM |
| MBA Tutor: Porter's Five Forces, Competitive Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/frameworks-porters-five-forces-competitive-analysis.md | 2026-04-10 | Core Frameworks to Teach | CRITICAL |
| MBA Tutor: VRIO Framework, Resource Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/frameworks-vrio-framework-resource-analysis.md | 2026-04-10 | Core Frameworks to Teach | CRITICAL |
| MBA Tutor: Boston Consulting Group Matrix | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/frameworks-boston-consulting-group-matrix.md | 2026-04-10 | Core Frameworks to Teach | MEDIUM |
| MBA Tutor: Strategic Group Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/frameworks-strategic-group-analysis.md | 2026-04-10 | Core Frameworks to Teach | MEDIUM |
| MBA Tutor: Ansoff Matrix, Growth Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/frameworks-ansoff-matrix-growth-strategy.md | 2026-04-10 | Core Frameworks to Teach | MEDIUM |
| MBA Tutor: McKinsey 7-S Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/frameworks-mckinsey-7-s-framework.md | 2026-04-10 | Core Frameworks to Teach | HIGH |
| MBA Tutor: Teaching Product-Market Fit | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/teaching-teaching-product-market-fit.md | 2026-04-10 | Teaching Approaches | CRITICAL |
| MBA Tutor: Teaching Unit Economics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/teaching-teaching-unit-economics.md | 2026-04-10 | Teaching Approaches | CRITICAL |
| MBA Tutor: Teaching Valuation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/teaching-teaching-valuation.md | 2026-04-10 | Teaching Approaches | CRITICAL |
| MBA Tutor: Teaching Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/teaching-teaching-strategy.md | 2026-04-10 | Teaching Approaches | CRITICAL |
| MBA Tutor: Teaching Leadership | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/teaching-teaching-leadership.md | 2026-04-10 | Teaching Approaches | CRITICAL |
| MBA Tutor: How to Know Understanding is Real | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/assessment-how-to-know-understanding-is-real.md | 2026-04-10 | Assessment & Feedback | MEDIUM |
| MBA Tutor: Common Signs of Surface-Level Understanding | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/assessment-common-signs-of-surface-level-understanding.md | 2026-04-10 | Assessment & Feedback | MEDIUM |
| MBA Tutor: Feedback Approach | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/assessment-feedback-approach.md | 2026-04-10 | Assessment & Feedback | MEDIUM |
| MBA Tutor: Digital Disruption and Strategic Response | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/advanced-digital-disruption-and-strategic-response.md | 2026-04-10 | Advanced Topics for Integrated Thinking | CRITICAL |
| MBA Tutor: Platform Strategy and Winner-Take-Most Dynamics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/advanced-platform-strategy-and-winner-take-most-dynamics.md | 2026-04-10 | Advanced Topics for Integrated Thinking | CRITICAL |
| MBA Tutor: Organizational Capability and Strategic Execution | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/advanced-organizational-capability-and-strategic-execution.md | 2026-04-10 | Advanced Topics for Integrated Thinking | MEDIUM |
| MBA Tutor: Sustainability and Social Enterprise | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/advanced-sustainability-and-social-enterprise.md | 2026-04-10 | Advanced Topics for Integrated Thinking | MEDIUM |

### Operations

53 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Operations: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/SKILL.md | 2026-04-10 | the router | none |
| Operations: Operations Management Overview | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/fundamentals-operations-management-overview.md | 2026-04-10 | Operations Fundamentals | MEDIUM |
| Operations: Process Design and Flow Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/fundamentals-process-design-and-flow-analysis.md | 2026-04-10 | Operations Fundamentals | HIGH |
| Operations: Capacity Planning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/fundamentals-capacity-planning.md | 2026-04-10 | Operations Fundamentals | MEDIUM |
| Operations: Quality Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/fundamentals-quality-management.md | 2026-04-10 | Operations Fundamentals | MEDIUM |
| Operations: Bottleneck Analysis and Theory of Constraints, TOC | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/fundamentals-bottleneck-analysis-and-theory-of-constraints-toc.md | 2026-04-10 | Operations Fundamentals | HIGH |
| Operations: Lean Manufacturing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/lean-lean-manufacturing.md | 2026-11-01 | Lean & Six Sigma | HIGH |
| Operations: Six Sigma | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/lean-six-sigma.md | 2026-04-10 | Lean & Six Sigma | CRITICAL |
| Operations: Process Improvement | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/lean-process-improvement.md | 2026-04-10 | Lean & Six Sigma | MEDIUM |
| Operations: Supply Chain Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/supply-supply-chain-strategy.md | 2026-11-01 | Supply Chain Management | CRITICAL |
| Operations: Inventory Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/supply-inventory-management.md | 2026-04-10 | Supply Chain Management | HIGH |
| Operations: Bullwhip Effect | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/supply-bullwhip-effect.md | 2026-04-10 | Supply Chain Management | CRITICAL |
| Operations: Network Optimization | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/supply-network-optimization.md | 2026-11-01 | Supply Chain Management | MEDIUM |
| Operations: Working Capital in Supply Chain | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/supply-working-capital-in-supply-chain.md | 2026-04-10 | Supply Chain Management | CRITICAL |
| Operations: Business Analytics Maturity and Capability | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-business-analytics-maturity-and-capability.md | 2026-04-10 | Operations Analytics | HIGH |
| Operations: Forecasting Methods | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-forecasting-methods.md | 2026-04-10 | Operations Analytics | HIGH |
| Operations: Linear Programming | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-linear-programming.md | 2026-04-10 | Operations Analytics | MEDIUM |
| Operations: Integer/Binary Programming | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-integerbinary-programming.md | 2026-11-01 | Operations Analytics | MEDIUM |
| Operations: Prescriptive Analytics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-prescriptive-analytics.md | 2026-04-10 | Operations Analytics | MEDIUM |
| Operations: Simulation & Monte Carlo | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-simulation-monte-carlo.md | 2026-04-10 | Operations Analytics | MEDIUM |
| Operations: Statistical Methods | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-statistical-methods.md | 2026-11-01 | Operations Analytics | MEDIUM |
| Operations: Decision Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-decision-analysis.md | 2026-04-10 | Operations Analytics | MEDIUM |
| Operations: Project Planning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/project-project-planning.md | 2026-04-10 | Project Management | MEDIUM |
| Operations: Scheduling | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/project-scheduling.md | 2026-04-10 | Project Management | MEDIUM |
| Operations: Cost Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/project-cost-management.md | 2026-11-01 | Project Management | MEDIUM |
| Operations: Risk Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/project-risk-management.md | 2026-04-10 | Project Management | HIGH |
| Operations: Systematic Biases in Projects | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/project-systematic-biases-in-projects.md | 2026-04-10 | Project Management | HIGH |
| Operations: Enterprise Systems | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/infosys-enterprise-systems.md | 2026-04-10 | Information Systems | CRITICAL |
| Operations: IT Infrastructure | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/infosys-it-infrastructure.md | 2026-04-10 | Information Systems | MEDIUM |
| Operations: Data Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/infosys-data-management.md | 2026-04-10 | Information Systems | HIGH |
| Operations: Digital Platforms and IT Governance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/infosys-digital-platforms-and-it-governance.md | 2026-04-10 | Information Systems | CRITICAL |
| Operations: Strategic Role of Operations | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/strategy-strategic-role-of-operations.md | 2026-11-01 | Operations Strategy | MEDIUM |
| Operations: Capacity Strategy and Facility Location | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/strategy-capacity-strategy-and-facility-location.md | 2026-04-10 | Operations Strategy | MEDIUM |
| Operations: Process Technology and Competitiveness | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/strategy-process-technology-and-competitiveness.md | 2026-04-10 | Operations Strategy | MEDIUM |
| Operations: Service Operations Characteristics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/queuing-service-operations-characteristics.md | 2026-11-01 | Queuing Theory & Service Operations | HIGH |
| Operations: Queuing Theory Basics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/queuing-queuing-theory-basics.md | 2026-04-10 | Queuing Theory & Service Operations | MEDIUM |
| Operations: Prescriptive Analytics, Optimization | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/advanced-prescriptive-analytics-optimization.md | 2026-04-10 | Advanced Analytics Topics | MEDIUM |
| Operations: Predictive Analytics & Machine Learning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/advanced-predictive-analytics-machine-learning.md | 2026-11-01 | Advanced Analytics Topics | CRITICAL |
| Operations: Control Charts and Variation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/quality-control-charts-and-variation.md | 2026-11-01 | Quality Management Frameworks | MEDIUM |
| Operations: Six Sigma Metrics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/quality-six-sigma-metrics.md | 2026-04-10 | Quality Management Frameworks | CRITICAL |
| Operations: Frameworks Summary Table | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/quality-frameworks-summary-table.md | 2026-04-10 | Quality Management Frameworks | CRITICAL |
| Operations: Connect Operations to Business Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-connect-operations-to-business-strategy.md | 2026-04-10 | Operating Principles & Best Practices | MEDIUM |
| Operations: Use Data and Metrics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-use-data-and-metrics.md | 2026-04-10 | Operating Principles & Best Practices | MEDIUM |
| Operations: End-to-End Supply Chain Perspective | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-end-to-end-supply-chain-perspective.md | 2026-04-10 | Operating Principles & Best Practices | CRITICAL |
| Operations: Think About Trade-offs | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-think-about-trade-offs.md | 2026-04-10 | Operating Principles & Best Practices | HIGH |
| Operations: Use Structured Problem-Solving | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-use-structured-problem-solving.md | 2026-04-10 | Operating Principles & Best Practices | MEDIUM |
| Operations: Balance Optimization with Robustness | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-balance-optimization-with-robustness.md | 2026-04-10 | Operating Principles & Best Practices | CRITICAL |
| Operations: Consider Human Factors and Change Management | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-consider-human-factors-and-change-management.md | 2026-04-10 | Operating Principles & Best Practices | CRITICAL |
| Operations: Align Incentives with Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-align-incentives-with-strategy.md | 2026-04-10 | Operating Principles & Best Practices | MEDIUM |
| Operations: Build Supplier and Partner Relationships | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/principles-build-supplier-and-partner-relationships.md | 2026-04-10 | Operating Principles & Best Practices | CRITICAL |
| Operations: Analytical Techniques by Use Case | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytical-tech-analytical-techniques-by-use-case.md | 2026-11-01 | not indexed | CRITICAL |
| Operations: Common Pitfalls & How to Avoid Them | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/common-pitfalls-common-pitfalls-how-to-avoid-them.md | 2026-04-10 | not indexed | CRITICAL |
| Operations: Key Formulas and Quantitative Tools | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/key-formulas-an-key-formulas-and-quantitative-tools.md | 2026-04-10 | not indexed | HIGH |
| Operations: Key Performance Indicators by Functional Area | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/key-performance-key-performance-indicators-by-functional-area.md | 2026-04-10 | not indexed | CRITICAL |

### Strategy

18 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Strategy: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/SKILL.md | 2026-04-10 | the router | none |
| Strategy: Porter's Five Forces | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-porters-five-forces.md | 2026-04-10 | Core Strategic Frameworks | CRITICAL |
| Strategy: Value Chain Analysis | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-value-chain-analysis.md | 2026-04-10 | Core Strategic Frameworks | CRITICAL |
| Strategy: Generic Strategies, Porter | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-generic-strategies-porter.md | 2026-04-10 | Core Strategic Frameworks | CRITICAL |
| Strategy: Blue Ocean Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-blue-ocean-strategy.md | 2026-11-01 | Core Strategic Frameworks | CRITICAL |
| Strategy: Core Principles | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-core-principles.md | 2026-11-01 | Core Strategic Frameworks | CRITICAL |
| Strategy: Diversification and Scope | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/corporate-diversification-and-scope.md | 2026-11-01 | Corporate Strategy | CRITICAL |
| Strategy: International Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/corporate-international-strategy.md | 2026-04-10 | Corporate Strategy | MEDIUM |
| Strategy: Strategic Alliances | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/corporate-strategic-alliances.md | 2026-04-10 | Corporate Strategy | HIGH |
| Strategy: Platform Business Models | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/innovation-platform-business-models.md | 2026-11-01 | Innovation and Disruption | CRITICAL |
| Strategy: Business Model Innovation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/innovation-business-model-innovation.md | 2026-11-01 | Innovation and Disruption | MEDIUM |
| Strategy: Disruptive Innovation, Christensen | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/innovation-disruptive-innovation-christensen.md | 2026-04-10 | Innovation and Disruption | MEDIUM |
| Strategy: Scenario Planning | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/innovation-scenario-planning.md | 2026-04-10 | Innovation and Disruption | HIGH |
| Strategy: Strategy Consulting Methodology | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/implementation-strategy-consulting-methodology.md | 2026-04-10 | Strategic Implementation & Execution | MEDIUM |
| Strategy: Stakeholder Theory & ESG | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/implementation-stakeholder-theory-esg.md | 2026-04-10 | Strategic Implementation & Execution | HIGH |
| Strategy: Competition Policy & Regulation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/antitrust-competition-policy-regulation.md | 2026-11-01 | Antitrust & Market Power | HIGH |
| Strategy: Sustainable Competitive Advantage | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/competitive-sustainable-competitive-advantage.md | 2026-04-10 | Competitive Advantage & Positioning | CRITICAL |
| Strategy: Dynamic Capabilities | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/competitive-dynamic-capabilities.md | 2026-04-10 | Competitive Advantage & Positioning | CRITICAL |
| Strategy: Strategy Execution & Governance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/competitive-strategy-execution-governance.md | 2026-04-10 | Competitive Advantage & Positioning | HIGH |

### Technology

54 rule files and the router.

| Title | URL | Last commit | Section in its skill | Label |
|---|---|---|---|---|
| Technology: SKILL.md | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/SKILL.md | 2026-04-10 | the router | none |
| Technology: AI Fundamentals | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-ai-fundamentals.md | 2026-04-10 | Artificial Intelligence & Machine Learning | CRITICAL |
| Technology: Neural Networks | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-neural-networks.md | 2026-04-10 | Artificial Intelligence & Machine Learning | MEDIUM |
| Technology: Natural Language Processing, NLP | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-natural-language-processing-nlp.md | 2026-11-01 | Artificial Intelligence & Machine Learning | MEDIUM |
| Technology: Generative AI and Large Language Models, LLMs | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-generative-ai-and-large-language-models-llms.md | 2026-04-10 | Artificial Intelligence & Machine Learning | CRITICAL |
| Technology: Reinforcement Learning, RL | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-reinforcement-learning-rl.md | 2026-04-10 | Artificial Intelligence & Machine Learning | CRITICAL |
| Technology: Agentic AI | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-agentic-ai.md | 2026-11-01 | Artificial Intelligence & Machine Learning | CRITICAL |
| Technology: AI Business Applications | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-ai-business-applications.md | 2026-11-01 | Artificial Intelligence & Machine Learning | CRITICAL |
| Technology: AI Ethics and Governance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-ai-ethics-and-governance.md | 2026-04-10 | Artificial Intelligence & Machine Learning | CRITICAL |
| Technology: Data as Strategic Asset | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/data-data-as-strategic-asset.md | 2026-04-10 | Data Science & Analytics | HIGH |
| Technology: Data Governance Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/data-data-governance-framework.md | 2026-04-10 | Data Science & Analytics | HIGH |
| Technology: Data Architecture | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/data-data-architecture.md | 2026-04-10 | Data Science & Analytics | CRITICAL |
| Technology: Analytics Maturity Model | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/data-analytics-maturity-model.md | 2026-11-01 | Data Science & Analytics | none |
| Technology: Product Analytics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/data-product-analytics.md | 2026-11-01 | Data Science & Analytics | MEDIUM |
| Technology: Cloud Service Models | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-cloud-service-models.md | 2026-04-10 | Cloud Computing & Infrastructure | CRITICAL |
| Technology: Deployment Models | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-deployment-models.md | 2026-04-10 | Cloud Computing & Infrastructure | MEDIUM |
| Technology: Cloud Economics | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-cloud-economics.md | 2026-04-10 | Cloud Computing & Infrastructure | MEDIUM |
| Technology: Migration Strategies | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-migration-strategies.md | 2026-11-01 | Cloud Computing & Infrastructure | CRITICAL |
| Technology: Serverless Computing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-serverless-computing.md | 2026-04-10 | Cloud Computing & Infrastructure | HIGH |
| Technology: Web Apps and SaaS Architecture | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-web-apps-and-saas-architecture.md | 2026-04-10 | Cloud Computing & Infrastructure | MEDIUM |
| Technology: Databases and Data Infrastructure | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-databases-and-data-infrastructure.md | 2026-04-10 | Cloud Computing & Infrastructure | MEDIUM |
| Technology: APIs and Integration | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-apis-and-integration.md | 2026-04-10 | Cloud Computing & Infrastructure | MEDIUM |
| Technology: Cybersecurity | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-cybersecurity.md | 2026-04-10 | Cloud Computing & Infrastructure | MEDIUM |
| Technology: Blockchain and Web3 | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/emerging-blockchain-and-web3.md | 2026-11-01 | Emerging & Advanced Technologies | MEDIUM |
| Technology: Quantum Computing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/emerging-quantum-computing.md | 2026-11-01 | Emerging & Advanced Technologies | MEDIUM |
| Technology: Edge Computing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/emerging-edge-computing.md | 2026-04-10 | Emerging & Advanced Technologies | MEDIUM |
| Technology: Internet of Things, IoT | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/emerging-internet-of-things-iot.md | 2026-04-10 | Emerging & Advanced Technologies | MEDIUM |
| Technology: Extended Reality, AR/VR | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/emerging-extended-reality-arvr.md | 2026-04-10 | Emerging & Advanced Technologies | MEDIUM |
| Technology: Technology Adoption Lifecycle | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/digital-technology-adoption-lifecycle.md | 2026-04-10 | Digital Innovation & Transformation | MEDIUM |
| Technology: Disruptive Innovation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/digital-disruptive-innovation.md | 2026-04-10 | Digital Innovation & Transformation | CRITICAL |
| Technology: Digital Transformation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/digital-digital-transformation.md | 2026-04-10 | Digital Innovation & Transformation | HIGH |
| Technology: Digital Strategy | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/digital-digital-strategy.md | 2026-04-10 | Digital Innovation & Transformation | CRITICAL |
| Technology: Digital Business Models | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/digital-digital-business-models.md | 2026-04-10 | Digital Innovation & Transformation | CRITICAL |
| Technology: 5 Digital Transformation | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/digital-5-digital-transformation.md | 2026-04-10 | Digital Innovation & Transformation | HIGH |
| Technology: Agile Fundamentals | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-agile-fundamentals.md | 2026-11-01 | Agile Development & Product Management | CRITICAL |
| Technology: Scrum Framework | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-scrum-framework.md | 2026-11-01 | Agile Development & Product Management | HIGH |
| Technology: User Stories and Prioritization | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-user-stories-and-prioritization.md | 2026-04-10 | Agile Development & Product Management | MEDIUM |
| Technology: Alternative Methodologies | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-alternative-methodologies.md | 2026-11-01 | Agile Development & Product Management | HIGH |
| Technology: Product Management Essentials | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-product-management-essentials.md | 2026-04-10 | Agile Development & Product Management | MEDIUM |
| Technology: Product Analytics Deep Dive | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-product-analytics-deep-dive.md | 2026-11-01 | Agile Development & Product Management | MEDIUM |
| Technology: Blockchain and Web3, Additional Details | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-blockchain-and-web3-additional-details.md | 2026-11-01 | Agile Development & Product Management | MEDIUM |
| Technology: Cloud Economics and Cost Optimization | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-cloud-economics-and-cost-optimization.md | 2026-04-10 | Agile Development & Product Management | MEDIUM |
| Technology: Serverless and Edge Computing | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-serverless-and-edge-computing.md | 2026-04-10 | Agile Development & Product Management | MEDIUM |
| Technology: Connecting Technology to Business Value | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-connecting-technology-to-business-value.md | 2026-04-10 | Operating Approach | CRITICAL |
| Technology: Explaining Technical Concepts in Business Terms | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-explaining-technical-concepts-in-business-terms.md | 2026-04-10 | Operating Approach | CRITICAL |
| Technology: Evaluating ROI and Implementation Timelines | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-evaluating-roi-and-implementation-timelines.md | 2026-04-10 | Operating Approach | CRITICAL |
| Technology: Considering Organizational Capability | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-considering-organizational-capability.md | 2026-04-10 | Operating Approach | HIGH |
| Technology: Data as Strategic Asset, operating principles | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-data-as-strategic-asset.md | 2026-04-10 | Operating Approach | HIGH |
| Technology: Balancing Innovation with Operational Efficiency | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-balancing-innovation-with-operational-efficiency.md | 2026-04-10 | Operating Approach | MEDIUM |
| Technology: Build vs Buy vs Partner Decisions | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-build-vs-buy-vs-partner-decisions.md | 2026-11-01 | Operating Approach | CRITICAL |
| Technology: Ethical Implications of Technology | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/operating-ethical-implications-of-technology.md | 2026-11-01 | Operating Approach | none |
| Technology: Incident Response | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/security-incident-response.md | 2026-04-10 | Security & Governance | MEDIUM |
| Technology: Insider Threats and Monitoring | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/security-insider-threats-and-monitoring.md | 2026-11-01 | Security & Governance | MEDIUM |
| Technology: Cyber Insurance | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/security-cyber-insurance.md | 2026-11-01 | Security & Governance | none |
| Technology: Security Culture Building | https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/security-security-culture-building.md | 2026-04-10 | Security & Governance | MEDIUM |
