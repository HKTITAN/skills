---
title: disagreements
summary: Where two files in the notes give different numbers, steps or definitions, where one file contradicts itself, and which worked examples do not close. Each row gives every side with its piece and how to report it.
---

# Disagreements

Open this file before you answer. The notes were assembled from many small files, and the files were never reconciled: the same ratio has two thresholds, the same formula two forms. When a question touches a row, the reply gives each side on its own `Disagrees:` line with its piece, and never merges them into one smooth view. The reply does not pick a winner. No file names another file, so nothing in the notes says which one is right, and what you know about the subject is not a file.

The repository has two commits, dated 2026-04-10 and 2026-11-01, and the second changed only frontmatter lines, so no side is the later view. There are no changes over time to report.

## Finance

### Does more debt lower WACC?

- The WACC file says higher leverage means a lower WACC through cheaper debt and a higher financial risk, and that WACC increases once bankruptcy risk becomes material. (Finance: WACC, Weighted Average Cost of Capital, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-wacc-weighted-average-cost-of-capital.md)
- The WACC components file lists financial risk among the things WACC varies by and says leverage increases WACC. (Finance: Understanding WACC Components, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/costcap-understanding-wacc-components.md)
- How to report it: give both lines. The first file has its own turning point and gives no level of debt for it. Do not supply one.

### Does a DCF give enterprise value or equity value?

- The DCF file labels the result of its formula enterprise value and subtracts net debt afterwards to reach equity value. (Finance: DCF, Discounted Cash Flow Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md)
- The tenth pitfall says "DCF values equity, not enterprise value" and tells the reader always to subtract net debt. (Finance: Pitfalls to Avoid, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-pitfalls-to-avoid.md)
- How to report it: both files subtract net debt; they differ on what the number is called before that step. Give both lines.

### What is free cash flow?

- The statements file defines free cash flow as operating cash flow less capital expenditure. (Finance: The Three Financial Statements, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/statements-the-three-financial-statements.md)
- The DCF file builds free cash flow to the firm from EBIT less taxes, plus depreciation and amortisation, less capital expenditure, less the change in net working capital. (Finance: DCF, Discounted Cash Flow Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md)
- How to report it: name which definition a figure uses. The files do not say the two are the same measure.

### What is a healthy debt-to-equity?

- The leverage ratios file gives under 1.0 as healthy for most industries. (Finance: Leverage, Solvency Ratios, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-leverage-solvency-ratios.md)
- The trade-off file gives 0.5 to 1.5 as the typical optimal range, varying by industry and business risk. (Finance: Trade-Off Theory, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-trade-off-theory.md)
- How to report it: two rules of thumb from two files, neither with a source. Give both.

### Are banks valued on EV/EBITDA?

- The multiples file lists a typical EV/EBITDA of 8 to 10x for banks. (Finance: Comparable Multiples Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-comparable-multiples-valuation.md)
- The bank valuation file says banks fit DCF poorly, calls price-to-book the most common valuation for them and does not mention EV/EBITDA. (Finance: Bank Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-bank-valuation.md)
- How to report it: the second file does not reject the first; it names a different measure as the usual one. Give both.

### The cash conversion cycle

- The Finance efficiency ratios file gives the cycle as days sales outstanding plus days inventory outstanding minus days payable outstanding. (Finance: Efficiency Ratios, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-efficiency-ratios.md)
- The Operations key formulas file gives the cash conversion cycle as DIO plus DSO minus DPO. (Operations: Key Formulas and Quantitative Tools, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/key-formulas-an-key-formulas-and-quantitative-tools.md)
- The Operations working capital file gives the cash conversion cycle as DPO minus DSO minus DIO, and says shorter cycles free capital. (Operations: Working Capital in Supply Chain, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/supply-working-capital-in-supply-chain.md)
- How to report it: two files agree and one reverses the signs. Give the formula with the file it came from.

## Startups

### What LTV to CAC is enough?

- The foundation file calls LTV to CAC the most critical metric: 3:1 or higher is sustainable, 2:1 is difficult but possible if other factors are strong, and below 2:1 the unit economics are broken. (Entrepreneurship: Unit Economics: The Foundation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/bizmodel-unit-economics-the-foundation.md)
- The scaling file gives 3:1 to 5:1 as the ideal LTV to CAC range, calls below 3:1 unsustainable at scale and marks above 5:1 as a sign of possible underinvestment in growth. (Entrepreneurship: Unit Economics: Foundation of Scaling, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/scaling-unit-economics-foundation-of-scaling.md)
- Among its readiness checks the scaling-phase file asks only for CAC below LTV on conservative estimates. (Entrepreneurship: After PMF: The Scaling Phase, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-after-pmf-the-scaling-phase.md)
- An MBA Tutor file gives healthy unit economics as 3x+ LTV/CAC, at which scaling becomes capital-efficient. (MBA Tutor: Unit Economics and Scalability, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-unit-economics-and-scalability.md)
- A second MBA Tutor file writes the ratio the other way up: a SaaS business with a 30% CAC/LTV ratio is one the file expects to be self-sustaining, while Uber and Lyft at less than 1x CAC/LTV are described as burning capital. (MBA Tutor: Entrepreneurship ↔ Finance, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-entrepreneurship-finance.md)
- How to report it: a ratio of 2:1 is difficult but possible in one file and sits in the band below 3:1 that another calls unsustainable at scale. Give every line that bears on the user's number, say which way up each file writes the ratio, and report the last file's two figures as written, noting that both are below one and get opposite verdicts.

### What retention shows fit?

- The signals file says cohort retention curves flatten at high levels, given as 50% or more month over month for consumer and 70% or more for B2B. (Entrepreneurship: Clear PMF Signals, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-clear-pmf-signals.md)
- The scaling-phase file sets 30-day retention targets of 40 to 50% for consumer and 70% or more for B2B. (Entrepreneurship: After PMF: The Scaling Phase, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/pmf-after-pmf-the-scaling-phase.md)
- How to report it: the B2B figure matches and the consumer figure does not. One is month over month and one is 30-day; the files do not say these are the same measure.

### How much evidence before a pivot?

- The pivot-or-persevere file says not to pivot after only 20 conversations, since 50 or more are needed, or after only 3 months, since it says most successful pivots took more than 6 months to validate. (Entrepreneurship: Pivot vs. Persevere Framework, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-pivot-vs-persevere-framework.md)
- The pivot framework file offers 100 customer conversations, a number it calls arbitrary, and its example test runs for 8 weeks with a decision date. (Entrepreneurship: The Pivot Framework, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-the-pivot-framework.md)
- The pivot-or-persevere file lists seven pivot types: customer segment, feature, platform, technology, business model, zoom in and zoom out. (Entrepreneurship: Pivot vs. Persevere Framework, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/lean-pivot-vs-persevere-framework.md)
- The pivot types file lists five: segment, feature, channel, product and business model. (Entrepreneurship: Common Pivot Types, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-common-pivot-types.md)
- How to report it: give the count with its file. The 8 weeks is the length of one test, and the 6 months is how long validation took; do not set them against each other as the same thing.

### What does a non-participating preference pay?

- The term sheet file defines 1x non-participating as the investor getting the investment back or the equity stake, whichever is greater. (Entrepreneurship: Term Sheet Terms and Negotiation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/vc-term-sheet-terms-and-negotiation.md)
- In the liquidation file's example headed non-participating, a company sells for $10M, a Series A investor who put in $5M and owns 50% receives the $5M and then 50% of the remaining $5M, a total of $7.5M. (Entrepreneurship: Liquidation Preferences in Exit Scenarios, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-liquidation-preferences-in-exit-scenarios.md)
- How to report it: the example pays both the money back and a share, which is not what the definition says. Give the definition from the first file and say the second file's example does not follow it.

### How big is the option pool?

- The dilution file says to reserve 10 to 20% as an employee pool for future hires. (Entrepreneurship: Dilution Mechanics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-dilution-mechanics.md)
- The employee equity file says a company reserves 10 to 15% of shares for future employee options. (Entrepreneurship: Employee Equity and Vesting, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/finance-employee-equity-and-vesting.md)
- How to report it: give both ranges.

## Operations

### What is the defect rate at six sigma?

- The Six Sigma metrics file lists 308,538 defects per million opportunities at 1 sigma, 69,146 at 2 sigma, 6,210 at 3 sigma and 3.4 at 6 sigma, the last accounting for 1.5 sigma of process drift. (Operations: Six Sigma Metrics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/quality-six-sigma-metrics.md)
- The key formulas file lists defects per million opportunities by sigma level as 308,538 at 1, 69,146 at 2, 6,210 at 3, 233 at 4, 3.4 at 5 and 0.002 at 6. (Operations: Key Formulas and Quantitative Tools, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/key-formulas-an-key-formulas-and-quantitative-tools.md)
- How to report it: 3.4 defects per million sits at 6 sigma in one file and at 5 sigma in the other. Give both tables.

### Is the quality target six sigma?

- The quality management file says optimal quality is not zero defects: it is where marginal improvement cost equals marginal failure cost savings, and it typically requires 3 to 4 sigma capability. (Operations: Quality Management, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/fundamentals-quality-management.md)
- The Six Sigma file describes a structured problem-solving framework targeting 3.4 defects per million opportunities, which it ties to 6 standard deviations from specification accounting for process drift. (Operations: Six Sigma, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/lean-six-sigma.md)
- How to report it: one file describes an economic optimum and the other a method's target. Give both and do not rank them.

## Leading and negotiating

### Do you reveal your BATNA?

- The BATNA file says to know your BATNA precisely but not disclose it, and to reference it indirectly to increase credibility, as in "I have other options". (Leadership: BATNA: Best Alternative to Negotiated Agreement, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-batna-best-alternative-to-negotiated-agreement.md)
- The ZOPA file says revealing your true BATNA may lower your power but credible signals of a good BATNA strengthen it. (Leadership: ZOPA: Zone of Possible Agreement, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-zopa-zone-of-possible-agreement.md)
- The negotiation-fundamentals file lists revealing your BATNA among common mistakes and says it weakens your position. (Leadership: Negotiation Fundamentals Beyond BATNA, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/conflict-negotiation-fundamentals-beyond-batna.md)
- How to report it: three files, three shades. Give all three lines.

### Is the reservation price the BATNA?

- The BATNA file says to use the BATNA to set your reservation price. (Leadership: BATNA: Best Alternative to Negotiated Agreement, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-batna-best-alternative-to-negotiated-agreement.md)
- The ZOPA file defines the reservation price as the worst deal you would accept and calls it equivalent to the BATNA. (Leadership: ZOPA: Zone of Possible Agreement, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/negotiation-zopa-zone-of-possible-agreement.md)
- How to report it: one file derives the price from the BATNA and one equates them. Give both.

### Who sets strategy, the board or the CEO?

- The corporate governance file says the board represents shareholders, oversees the CEO and sets strategic direction, and it lists approving strategy and major decisions first among six board responsibilities. (Leadership: Corporate Governance, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/governance-corporate-governance.md)
- The CEO-challenges file lists strategy first of five CEO priorities, given in order, and says the board provides governance, oversight and counsel and has authority to remove the CEO. (Leadership: CEO Challenges and Specific Leadership Contexts, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/strategic-ceo-challenges-and-specific-leadership-contexts.md)
- How to report it: give both lines; the notes do not divide the work between the two.

### Which rewards are hygiene factors?

- The Herzberg file puts compensation and benefits among hygiene factors and puts recognition and growth and advancement among motivators. (Leadership: Herzberg's Two-Factor Theory, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/motivation-herzbergs-two-factor-theory.md)
- The key-principles file calls money and title hygiene factors, not motivators, and says real motivation comes from autonomy, competence and relatedness. (Leadership: Key Principles for Effective Leadership, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/leadership/rules/styles-key-principles-for-effective-leadership.md)
- How to report it: the files agree on money. The first file never mentions title and the second never mentions recognition or advancement, so give both lines as written and do not set title against advancement.

## Strategy and cases

### Is Southwest a cost leader or a blue ocean?

- The generic strategies file lists Southwest Airlines as an example of cost leadership, with no frills, rapid turnaround and secondary airports. (Strategy: Generic Strategies, Porter, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-generic-strategies-porter.md)
- The blue ocean file lists Southwest Airlines as a blue ocean, where value innovation achieves low cost and differentiation together. (Strategy: Blue Ocean Strategy, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/frameworks-blue-ocean-strategy.md)
- How to report it: the same company is the example for two frameworks that the notes present as different positions. Give both.

### Do incumbents hold or lose, and why?

- The platform file says incumbent dominance "is hard to overcome" and that the first mover to critical mass often wins. (Strategy: Platform Business Models, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/innovation-platform-business-models.md)
- The disruption file says incumbents win sustaining innovation but lose to disruptive innovation, because they are locked into high-margin, high-performance positioning. (Strategy: Disruptive Innovation, Christensen, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/strategy/rules/innovation-disruptive-innovation-christensen.md)
- In the MBA Tutor disruption template the incumbent's cost structure prevents a competitive response. (MBA Tutor: Industry Disruption Pattern, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/patterns-industry-disruption-pattern.md)
- A second MBA Tutor file gives the reason incumbents struggle as organisational rigidity created by a successful business model. (MBA Tutor: Digital Disruption and Strategic Response, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/advanced-digital-disruption-and-strategic-response.md)
- How to report it: the first pair is about different kinds of market, platforms and low-end entry. The second pair gives two causes for the same failure. Say which file each line is from.

### Do network effects differentiate?

- The competitive advantage file lists network effects as a source of differentiation, beside brand, quality, service and customisation. (MBA Tutor: Competitive Advantage, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-competitive-advantage.md)
- The platform strategy file says that in network effect markets a company wins big or loses, and that differentiation is often impossible. (MBA Tutor: Platform Strategy and Winner-Take-Most Dynamics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/advanced-platform-strategy-and-winner-take-most-dynamics.md)
- How to report it: give both lines.

### What do 10% and 90% measure in a change?

- One file's example is that digital transformation fails technically 10% of the time and organisationally 90% of the time. (MBA Tutor: Leadership ↔ Operations, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/connections-leadership-operations.md)
- The change management file gives 10% and 90% as shares of effort: technical implementation is often 10% of the effort and organisational change is 90%. (MBA Tutor: Change Management and Implementation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/integrated-change-management-and-implementation.md)
- How to report it: the same pair of numbers is a failure rate in one file and a share of effort in the other, with no source in either. Never quote the split without saying which.

### Five steps or ten?

- The implementation plan is numbered step 5 of the case method, and it turns the decision into action under five headings. (MBA Tutor: Step 5: Implementation Plan, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-step-5-implementation-plan.md)
- The integration exercise presents a ten-step list as the complete framework: situation, strategy, operations, finance, marketing, economics, leadership, technology, cross-domain connections and recommendation. (MBA Tutor: Integration Exercise: the Complete Analysis, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/mba-tutor/rules/case-integration-exercise-the-complete-analysis.md)
- How to report it: one file is step 5 of a numbered case method and the other numbers ten items it calls the complete framework. The notes do not map one onto the other.

## Markets and policy

### Is the Vickrey auction used?

- One auction file lists the common use of the Vickrey auction as spectrum auctions and online advertising. (Economics: Auction Theory and Design, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-auction-theory-and-design.md)
- A second auction file says of the second-price sealed-bid auction, which it labels Vickrey, that it is "rarely used". (Economics: Auction Theory and Strategic Bidding, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/market-design-auction-theory-and-strategic-bidding.md)
- How to report it: give both lines.

### Are quotas as bad as tariffs?

- One file describes quotas as a quantity restriction on imports with similar effects to tariffs. (Economics: International Economics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-international-economics.md)
- A second file calls a quota less efficient than a tariff: both create efficiency loss, and quotas are worse because the rents go to foreign sellers, not the government. (Economics: Trade Policy and Strategic Considerations, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/international-trade-policy-and-strategic-considerations.md)
- How to report it: give both lines.

### Why did South Korea and Vietnam grow?

- The trade policy file lists South Korea, Taiwan and Vietnam as successes "with selective protection and time limits". (Economics: Trade Policy and Strategic Considerations, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/international-trade-policy-and-strategic-considerations.md)
- The development strategies file gives South Korea and Vietnam as successes of export-led growth, which it describes as integrating with global markets and specialising in comparative advantage. (Economics: Development Strategies, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/development-development-strategies.md)
- How to report it: the same countries are the example for protection in one file and for openness in the other. Give both.

### What is the resource curse?

- Under terms of trade, one file's resource curse is that countries with natural resources often face long-run terms of trade deterioration. (Economics: International Economics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/macro-international-economics.md)
- A second file's resource curse is that natural resource wealth can reduce the incentive for institution-building and brings volatile revenues. (Economics: Development Strategies, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/economics/rules/development-development-strategies.md)
- How to report it: two mechanisms under one name. Give both.

## Technology

### How fast is Visa?

- The blockchain file gives Bitcoin 7 transactions a second against Visa 24k. (Technology: Blockchain and Web3, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/emerging-blockchain-and-web3.md)
- A second blockchain file gives Bitcoin 7 transactions a second against Visa 65K. (Technology: Blockchain and Web3, Additional Details, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-blockchain-and-web3-additional-details.md)
- How to report it: give both figures; neither has a source or a date.

### What is the RICE formula?

- The user stories file gives RICE as Reach times Impact divided by Effort. (Technology: User Stories and Prioritization, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-user-stories-and-prioritization.md)
- The product management file gives RICE as Reach times Impact times Confidence, divided by Effort. (Technology: Product Management Essentials, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/agile-product-management-essentials.md)
- How to report it: give both forms.

### What is replatforming?

- The migration file defines replatform as minor optimisations during migration. (Technology: Migration Strategies, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/cloud-migration-strategies.md)
- A transformation file defines re-platforming as a rewrite on modern architecture with large effort and significant benefits. (Technology: 5 Digital Transformation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/digital-5-digital-transformation.md)
- How to report it: the word means a small change in one file and a large one in the other. Say which file.

## Marketing

### Start low or start high?

- The pricing development file's key principle is that prices can always be lowered and are much harder to raise, and that it is better to underprice at first and raise gradually than to overprice and destroy demand. (Marketing: Pricing Strategy Development, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/pricing-pricing-strategy-development.md)
- The market entry file lists skimming as a strategy: a high price, limited distribution and early adopters as the target. (Marketing: Market Entry Strategies, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/gtm-market-entry-strategies.md)
- How to report it: the first file advises a low start while saying a later rise is much harder, and the second offers a high start as one option among several. Give both and do not choose.

### How long is a B2B sale?

- The sales cycle file says enterprise sales cycles often extend 6 to 12 months. (Marketing: Longer B2B Sales Cycles, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-longer-b2b-sales-cycles.md)
- The B2B characteristics table gives the B2B sales cycle as months or years. (Marketing: Key B2B Characteristics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/b2b-key-b2b-characteristics.md)
- How to report it: give both.

### Does omnichannel always win?

- The retail section opener says the future is not e-commerce against physical retail but seamless omnichannel integration. (Marketing: Retail & Omnichannel Strategy, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-retail-omnichannel-strategy.md)
- The category splits file says pure e-commerce wins in commodities where comparison and price matter, pure physical wins in try-before-you-buy categories, and omnichannel wins in most mainstream categories. (Marketing: The Reality: Category Splits, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/retail-the-reality-category-splits.md)
- How to report it: the second file limits the first. Give both.

### How many tests for a segment?

- The STP file judges a segment on seven criteria: size, growth, competition, fit, profitability, strategic fit and barriers to entry. (Marketing: STP Framework: Segmentation, Targeting, Positioning, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/foundations-stp-framework-segmentation-targeting-positioning.md)
- The segmentation research file judges a segment on five: size and growth potential, competitive intensity, strategic fit, profitability and barriers to entry. (Marketing: Market Segmentation Research, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/research-market-segmentation-research.md)
- How to report it: give the list with its file.

## Inside one file

These files contradict themselves, state something their own numbers do not support, or give a striking figure with no source. Report the line as written, say what sits beside it, and build nothing on it.

- The synergy file's timeline has 90 to 100% of synergies realised from year 3, and its list of common failures says 70% realisation is typical for cost synergies. (Finance: Synergy Realization, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-synergy-realization.md)
- The lean file heads its list of wastes "Seven Wastes" and gives eight entries, the last marked as added. (Operations: Lean Manufacturing, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/lean-lean-manufacturing.md)
- The Monte Carlo file gives 10,000 to 100,000 as the typical number of repetitions and, in another line, says results stabilise after 10,000 to 50,000 iterations for most applications. (Operations: Simulation & Monte Carlo, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/operations/rules/analytics-simulation-monte-carlo.md)
- The failure reasons file, whose title says research-based, gives 42%, 29%, 23%, 19% and 18% for its five reasons and names no study; the five add to 131%. (Entrepreneurship: Top Failure Reasons, Research-Based, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/entrepreneurship/rules/failure-top-failure-reasons-research-based.md)
- The churn formula file states that 5% monthly churn equals 60% annual churn, which is 5 times 12 and not a compounded rate. (Marketing: Financial Metrics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/formulas-financial-metrics.md)
- The attribution file's example adds improvements of 14%, 12% and 18% and calls the result a 52% uplift; the three add to 44. (Marketing: Marketing Analytics & Attribution, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/digital-marketing-analytics-attribution.md)
- The advanced pricing file says $9.99 feels cheaper than $10.00 "even though it's 1 cent more". (Marketing: Advanced Pricing Strategies, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/marketing/rules/pricing-advanced-pricing-strategies.md)
- The generative AI file gives GPT-4 as 8+ trillion parameters and GPT-3.5 as 175 billion, with no source. (Technology: Generative AI and Large Language Models, LLMs, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/technology/rules/ai-generative-ai-and-large-language-models-llms.md)

## Worked examples that do not close

Never repeat one of these as a model answer. If the user asks about it, give the numbers the file gives and say where they stop adding up.

- The coffee shop balance sheet lists assets that total $31,400 and a total of liabilities and equity of $35,400. (Finance: Key Insight: The Three Statements Connect, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/statements-key-insight-the-three-statements-connect.md)
- The leverage ratios file defines one ratio as EBITDA over total debt, works an example of 0.4x, and then grades under 3.0x as healthy and over 5.0x as high leverage. (Finance: Leverage, Solvency Ratios, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-leverage-solvency-ratios.md)
- The LBO example exits at $1,500M, subtracts a $400M debt paydown against $700M of senior debt at entry, and reports equity proceeds of $1,100M, a 3.7x return on $300M. (Finance: LBO Modeling, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-lbo-modeling.md)
- The private equity fund example takes the 20% carry of $540M on $2.7B, which is the $3B gross value less fees and costs, with the $1B invested not deducted. (Finance: PE Fund Economics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-pe-fund-economics.md)
- The accretion example prices the target at $500M in the all-cash case and issues 40M shares at $50, which is $2,000M, in the all-stock case. (Finance: Accretion/Dilution Analysis, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-accretiondilution-analysis.md)
- The tax shield is written as debt times tax rate times cost of debt, marked perpetual, in one file, whose own example values it at $25M on $100M of debt at a 25% tax rate; the formulas file writes debt times tax rate. (Finance: Modigliani-Miller Theorem, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-modigliani-miller-theorem.md; Finance: Capital Structure, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/formulas-capital-structure.md)

## Labels

- The pecking order file carries the impact label CRITICAL, and the description line beside it reads "Core MBA framework, foundational to domain". (Finance: Pecking Order Theory, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-pecking-order-theory.md)
- How to report it: a label is that file's label. The routers and the section indexes rate several sections differently from each other, so never call one topic more important than another on the strength of a label.
