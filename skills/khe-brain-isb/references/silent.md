---
title: silent
summary: Topics the notes do not cover, the words the gate watches for each, and the nearest piece that may be offered as nearest and never as the notes' position.
---

# Silent

The notes are 457 short files on nine subjects. They summarise frameworks; they are not a full course in any of the nine, and they say nothing about the school they are named for. This file is the list of what is not there, so a reply says "the notes do not cover this" in place of filling the gap from general knowledge. That gap is the easy mistake here: you know these subjects well, and the notes are thin, so the sentence that comes to mind first is often yours and not theirs.

## The rule

1. If the question's topic is in the table, the answer is silence. Say it in the first sentence.
2. The reply still has a `Source:` line: `isb-skills: README.md`, the front page that lists the nine skills.
3. The `Not in the notes:` line names the topic.
4. A nearest piece may be offered, labelled as nearest, with what it does say. Never continue from it to what the notes "must" mean.
5. A topic missing from this table and from every theme file is also silent. Search [sources](sources.md) for a title on the topic, open that file by its URL, and add a row here or a line to a theme file after you have read it.
6. A router's description is not evidence. Several `SKILL.md` files list trigger words for topics no rule file covers, such as debt markets and credit analysis in finance. A topic is covered only when a rule file covers it.
7. Knowing the answer is not evidence either. If the line is not in a theme file, it is not in the reply.

## Not covered

The gate reads the first two columns. When a sentence that speaks for the notes contains a watched word and cites a piece, the gate prints the candidate line `silent-topic:` so the sentence is looked at again. Each row was checked on 2026-11-11 by searching every rule file for its words.

| Topic | Words the gate watches | Nearest piece, and what it does say |
|---|---|---|
| ISB itself: admissions, fees, rankings, placements, campus | admission, admissions, GMAT, tuition, scholarship, placement report, ISB ranking, school ranking, alumni network, campus life | None. The README names the programme and says nothing else about the school. |
| Professors, courses, terms, sessions and case studies at ISB | syllabus, course outline, case list, term 1, core term, elective | None. No rule file names a professor, a course or a case study. |
| Students and classes | classmate, class profile, batch profile, student data, study group | None. The repository holds no data about any person. |
| Which sentences came from an ISB classroom | lecture, in class, taught in | None. The README says the notes draw on the ISB PGP 2025-26 curriculum; two footers mention wiki articles and one of them ChatGPT knowledge bases. See [sources](sources.md). |
| Capital budgeting | capital budgeting, net present value, profitability index | The Finance files discount cash flows to value a whole business, and no finance file is about choosing between projects. One economics file defines a hurdle rate for an entry investment in two lines. |
| Bonds and credit analysis | bond pricing, yield curve, convexity, credit spread, credit analysis | None, though the finance router lists debt markets and credit analysis among its trigger words. |
| Option pricing and portfolio theory | Black-Scholes, option pricing, portfolio theory, efficient frontier, Sharpe ratio | The derivatives file describes an option as a right bought for a premium. It prices nothing. |
| Dividends and buybacks | dividend policy, buyback, share repurchase | None. A payout ratio appears inside the sustainable growth formula, and a dividend recap among private equity levers. |
| Tax planning | tax planning, transfer pricing, deferred tax | None. A tax rate appears inside formulas such as WACC. |
| Accounting standards in detail | lease accounting, accounting standard, consolidation accounting | One pitfall says IFRS and US GAAP differ and to normalise before comparing. Nothing else. |
| Indian company, securities and startup law | SEBI, Companies Act, angel tax, DPIIT, ONDC | None on these. One security file names India's DPDPA in a line, and the employee equity file covers options and vesting with an IRS 409A valuation and ISO and NSO tax treatment. India also appears as rates in the CAPM file and in the financial inclusion file. |
| Macroeconomic models | IS-LM, aggregate demand, aggregate supply | The Economics files name the Solow growth model and the Phillips curve and give the GDP expenditure identity. They name neither IS-LM nor aggregate demand and supply. |
| Labour markets | wage determination, wage setting | The macro indicators file defines the unemployment rate and its types, and one monetary policy file ties tight labour markets to wage inflation. No file covers how wages are set. |
| Econometrics and measures of concentration or inequality | econometrics, econometric, HHI, Herfindahl, Gini | No file uses the word econometrics; one Operations file covers regression analysis. The antitrust lines give a market share and name no index, and one development line names the Kuznets curve. |
| Industry life cycle | industry life cycle | None. PESTLE, SWOT and make-versus-buy are covered and are not silent: PESTLE is a section of the marketing 5Cs file, SWOT is defined in the first step of the case method, and make-versus-buy has lines in Operations and a build, buy or partner file in Technology. |
| Media planning | media planning, media plan | None. The product lifecycle is not silent: the product management file gives five stages. |
| Toyota Production System detail and sales and operations planning | jidoka, heijunka, SMED, S&OP, sales and operations planning | The lean file lists wastes and 5S. It names none of these. |
| Founders and early company formation | equity split, founder equity, venture debt, crowdfunding | None. Co-founder conflict is mentioned in passing in three entrepreneurship files. |
| Layoffs, remote teams and whistleblowing | layoff, layoffs, whistleblowing, whistleblower | None. One MBA Tutor line says remote work changes culture and distributed teams need different coordination. |
| IT governance frameworks and ML operations | COBIT, ITIL, TOGAF, MLOps | The security file names the NIST framework and ISO 27001, and nothing on COBIT, ITIL or TOGAF. Technical debt and precision and recall are each named once and not explained, and the machine learning workflow gives deployment and monitoring one line each. |
| AI regulation and open-source licensing | EU AI Act, AI regulation, open-source licence, open source license | No file names the EU AI Act. The AI ethics file says legal frameworks are still evolving and that GDPR limits data usage. |
| Climate and carbon | carbon accounting, climate risk, net zero | The stakeholder file lists carbon emissions and climate impact as one ESG item, the marketing 5Cs file names climate change and ESG pressure, and one development line calls developing countries most exposed. Nothing on carbon accounting, climate risk or net zero. |
| Family business | family business, family-owned | None. |
| Planning tools the notes never name | OKR, business model canvas, lean canvas, design thinking, jobs to be done | None. |
| Personal money and career decisions | mutual fund, retirement, pension, which stock, stock tip, my salary, career switch | None. The notes are about firms. This skill reports them and gives no personal advice. |
| Current market data | current repo rate, today's rate, latest GDP, this quarter | The notes give undated rates and ranges and one table headed "as of 2026". Nothing is live. |

## Thin, not silent

These have a line or two. Report the line, its piece and that the notes hold little more.

| Topic | What the notes hold |
|---|---|
| IPOs | An IPO is listed as an exit route for a private equity fund, where it carries the highest multiple, and for a venture investor, where the file calls it expensive and rare. No file gives an account of how one is done. (Finance: PE Exits, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-pe-exits.md; Entrepreneurship: Exit Strategies, how VCs get returns, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-exit-strategies-how-vcs-get-returns.md) |
| India-specific figures | The CAPM file gives India's 10-year government bond yield as about 6 to 7% and an India market risk premium of 6.5 to 7.5%, and the financial inclusion file gives 40M+ microfinance borrowers, 400M+ Jan Dhan accounts and Aadhaar at over 99% of the population. All are undated and have no source. (Finance: CAPM, Capital Asset Pricing Model, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-capm-capital-asset-pricing-model.md; Finance: Financial Inclusion & Emerging Markets Context, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-financial-inclusion-emerging-markets-context.md) |
| Accounting standards | The pitfalls list says IFRS and US GAAP differences matter and to normalise before comparing. (Finance: Pitfalls to Avoid, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-pitfalls-to-avoid.md) |
| The source of the notes | One footer says a strategy reference "Integrates 21 wiki articles + multiple ChatGPT knowledge bases", and a second calls a leadership reference one "integrating 20 wiki articles". (Strategy: Core Principles, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-core-principles.md; Leadership: Related Theories & Frameworks, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/related-theorie-related-theories-frameworks.md) |
| The 4Ps | The file titled for the 5Cs, STP and 4Ps is one sentence and does not list the four. The STP file lists product, price, distribution and promotion as the marketing mix without calling them the 4Ps. (Marketing: Strategic Foundations: the 5Cs, STP, and 4Ps, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/foundations-strategic-foundations-the-5cs-stp-and-4ps.md; Marketing: STP Framework: Segmentation, Targeting, Positioning, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/foundations-stp-framework-segmentation-targeting-positioning.md) |

## Silent in the notes, said in a session

The tables above are about the 457 rule files. A session note in `ivi/` can still speak on one of their topics: capital budgeting, design thinking, founder equity and Indian startup law all come up in sessions.

1. Before answering silence, open the ivi file for the subject from the table in `SKILL.md`.
2. If a session line bears on the question, the reply says the notes do not cover the topic and gives the session line as its speaker's, with the session note as the source.
3. If no session line bears on it either, the answer is silence, as above.
4. Students, classmates and their startups stay silent everywhere. No note holds them.
