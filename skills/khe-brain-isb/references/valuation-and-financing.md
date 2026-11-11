---
title: valuation and financing
summary: What a business is worth and how it is paid for, as the Finance files put it. DCF, CAPM, WACC, multiples, capital structure, M&A synergies, private equity, banks.
---

# What is it worth, and how is it paid for?

One claim per line, each with its piece. Every line is the repository author's summary: the Finance files name Modigliani and Miller and the Gordon growth model and no other author, no professor, no course and no source for any figure. A number inside a worked example is that example's number, never a benchmark. Two pairs of these files disagree: the WACC file and the WACC components file on what leverage does to WACC, and the DCF file and the pitfalls list on what a DCF values; see [disagreements](disagreements.md) before you merge them.

## Discounted cash flow

- A DCF values a business as the present value of its future free cash flows, discounted at WACC, plus a discounted terminal value. (Finance: DCF, Discounted Cash Flow Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md)
- Free cash flow to the firm is EBIT less taxes, plus depreciation and amortisation, less capital expenditure, less the change in net working capital, projected for 5 to 10 years. (Finance: DCF, Discounted Cash Flow Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md)
- Terminal value comes from one of two methods: Gordon growth, which divides the grown final-year cash flow by WACC minus the growth rate, or an exit multiple on final-year EBITDA. (Finance: DCF, Discounted Cash Flow Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md)
- The file's worked example reaches an enterprise value of $1,329M, subtracts $150M of net debt and divides by 100M shares to get $11.79 a share; in it the present value of the terminal value is $1,025M of the total. (Finance: DCF, Discounted Cash Flow Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md)
- The file calls DCF sensitive to assumptions and says to build a table of value against WACC and terminal growth; it states that a 0.5% change in the growth rate moves value significantly. (Finance: DCF, Discounted Cash Flow Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-dcf-discounted-cash-flow-valuation.md)
- The pitfalls list says perpetual high growth is unrealistic and gives GDP-like rates of 2 to 3% for terminal growth. (Finance: Pitfalls to Avoid, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-pitfalls-to-avoid.md)
- The same list says that when terminal value is 80% or more of the total, small changes in assumptions cause large swings, and the result is checked against comparable multiples. (Finance: Pitfalls to Avoid, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ratios-pitfalls-to-avoid.md)

## Cost of capital

- CAPM sets the cost of equity at the risk-free rate plus beta times the market risk premium, and the risk-free rate for a long-term DCF is the 10-year government bond yield. (Finance: CAPM, Capital Asset Pricing Model, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-capm-capital-asset-pricing-model.md)
- The CAPM file gives the US risk-free rate as currently about 4 to 4.5% and India's as about 6 to 7%, a historical global average market risk premium of 6 to 8% and an India-specific one of 6.5 to 7.5% that includes a country risk premium; it dates none of these and names no source. (Finance: CAPM, Capital Asset Pricing Model, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-capm-capital-asset-pricing-model.md)
- A beta of 1.0 moves with the market, above 1.0 is more volatile and below 1.0 less; the file's example is 6.5% plus 1.2 times 7%, a cost of equity of 14.9%. (Finance: CAPM, Capital Asset Pricing Model, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-capm-capital-asset-pricing-model.md)
- WACC weights the cost of equity and the after-tax cost of debt by their shares of total value, and the weights use market values, never book values. (Finance: WACC, Weighted Average Cost of Capital, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-wacc-weighted-average-cost-of-capital.md)
- The WACC file's example, a company it calls ABC, has 71.4% equity at 13.7% and 28.6% debt at 6% after tax, a WACC of 11.5%. (Finance: WACC, Weighted Average Cost of Capital, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-wacc-weighted-average-cost-of-capital.md)
- The WACC file states that a 1% change in WACC changes a valuation by 10 to 15%. (Finance: WACC, Weighted Average Cost of Capital, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-wacc-weighted-average-cost-of-capital.md)
- Equity costs more than debt because it is the residual claim, it is junior in bankruptcy, and interest on debt is tax-deductible. (Finance: Understanding WACC Components, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/costcap-understanding-wacc-components.md)
- A table headed "as of 2026" gives WACC ranges by industry, from 6 to 8% for utilities and 9 to 12% for tech and software up to 12 to 20% or more for startups, and adds that an actual WACC reflects company-specific factors. (Finance: Industry WACC Ranges, as of 2026, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/costcap-industry-wacc-ranges-as-of-2026.md)

## Multiples

- EV/EBITDA is called the most common multiple and is said to compare companies regardless of capital structure or tax rates; enterprise value is market capitalisation less cash plus debt. (Finance: Comparable Multiples Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-comparable-multiples-valuation.md)
- The file lists typical EV/EBITDA multiples of 15 to 25x for tech and SaaS, 8 to 12x for utilities and for manufacturing, 6 to 9x for retail and 8 to 10x for banks. (Finance: Comparable Multiples Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-comparable-multiples-valuation.md)
- P/E is affected by capital structure and tax rates, price-to-book suits asset-heavy businesses such as banks and insurers, and EV/Revenue is used for unprofitable growth companies. (Finance: Comparable Multiples Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-comparable-multiples-valuation.md)
- Peers share an industry, a size and a geography; the file gives 3 to 5 close peers plus 5 to 10 broader ones and adjustments of 10 to 20% for differences. (Finance: Comparable Multiples Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-comparable-multiples-valuation.md)
- No single method is relied on: the file says to run DCF, multiples and an asset-based value, note the assumptions and report a range. (Finance: Valuation Triangulation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/valuation-valuation-triangulation.md)
- Banks fit DCF poorly, so they are judged on return on assets, return on equity and net interest margin and valued most often on price-to-book, with 1.0 to 2.5x book given as typical. (Finance: Bank Valuation, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/specialized-bank-valuation.md)

## Capital structure

- Modigliani-Miller Proposition I, with no taxes: firm value does not depend on capital structure. Leverage benefits equity holders and raises their risk proportionally, offsetting the benefit. (Finance: Modigliani-Miller Theorem, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-modigliani-miller-theorem.md)
- With taxes, deductible interest creates a tax shield; the file's example is $100M of debt at 6% and a 25% tax rate, worth $1.5M a year or $25M in perpetuity. (Finance: Modigliani-Miller Theorem, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-modigliani-miller-theorem.md)
- The trade-off theory balances debt's tax shield, discipline and lower cost against distress risk, lost flexibility and agency costs. (Finance: Trade-Off Theory, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-trade-off-theory.md)
- The trade-off file gives a typical optimal debt-to-equity of 0.5 to 1.5, or debt-to-assets of 30 to 50%, varying by industry and business risk. (Finance: Trade-Off Theory, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-trade-off-theory.md)
- The pecking order: companies fund from retained earnings first, then debt, then equity as a last resort, because issuing equity signals overvaluation. (Finance: Pecking Order Theory, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/corpfin-pecking-order-theory.md)

## Deals and private equity

- Acquisitions are justified by growth, synergies or financial engineering; revenue synergies are labelled harder to realise and cost synergies more reliable. (Finance: Strategic Rationale for M&A, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-strategic-rationale-for-ma.md)
- The synergy file's timeline is 25 to 30% realised in year 1, 60 to 70% in year 2 and 90 to 100% from year 3 "if achieved at all", and its best practice is a 30 to 50% discount on claimed synergies. (Finance: Synergy Realization, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/ma-synergy-realization.md)
- Private equity's "2 and 20" is a 2% annual management fee and 20% of profits; the file's example fund turns a 3x gross return into 2.16x net to investors. (Finance: PE Fund Economics, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-pe-fund-economics.md)
- Private equity returns are attributed to four levers: operational improvement, multiple arbitrage, leverage and dividend recapitalisations. (Finance: Value Creation Levers, https://github.com/HKTITAN/isb-skills/blob/060ee06/skills/finance/rules/pe-value-creation-levers.md)
