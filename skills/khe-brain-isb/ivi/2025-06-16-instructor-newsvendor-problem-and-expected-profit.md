---
title: "ivi: The newsvendor problem and expected profit, 16 Jun 2025"
speaker: "Not identified in the recording"
organisation: "Not stated in the recording"
date: "2025-06-16"
kind: "class"
transcript_quality: "fair, slides and spreadsheet work are not captured and several numbers are garbled"
---

# The newsvendor problem and expected profit

The first half of an operations management class on inventory, part of the same series as the Six Sigma sessions. The instructor, who is not named in the recording, closes the control and capability topic with four pictures, then introduces the newsvendor problem through a newspaper seller and works a cupcake bakery case with an expected profit table and a marginal profit curve. This recording ends at the break. The analytical model follows in a separate recording.

## What was said

### Control and capability, recap

- The instructor says capability is read against the specification limits and control is read against the control limits.
- He says a process that is neither capable nor in control is the worst case. A process with only one of the two problems is still bad but can be saved.
- He says a process that is both in control and capable is what a firm should expect of its processes when continuous improvement is part of its DNA.
- He says control and capability is the concept that the whole of quality management revolves around.
- Asked about a point that sits exactly on a limit, he says the limit only tells you how risky things are, and whether to act is a call you make from your business context.

### The newsvendor problem

- The instructor tells of a newspaper seller near a railway station who arrived at 7 a.m. with bundles of papers and sold all of them within two or three hours, on two days running.
- He says the seller must decide at 7 a.m. how many papers to buy from the wholesaler without knowing that day's demand.
- He says a newspaper is a perishable good. It sells for about three hours, loses value after that, and is waste paper the next day.
- He says understanding how to order in this situation is how you learn to deal with both understock and overstock, and that both are very expensive in business.
- He lists the same decision in other industries: how many hotel rooms to hold back for last-minute guests, how many airline seats to keep for last-minute bookings, and how many theatres and rooms a hospital keeps free for emergencies.
- His hotel example is a 2,000 rupee room sold for 6,000 rupees a night to a walk-in guest because the room had been held back.
- He says airlines raise prices sharply on last-minute seats, and if nobody books them they have lost the money a normal reservation would have brought.
- He says people with experience are the wisdom of an organisation and that the humility to learn from them makes an organisation powerful.

### The cupcake case

- The instructor's case is a bakery, Kristen's Cupcakes, whose policy is to sell only cupcakes made that day. He says freshness is its value indicator.
- In the case each cupcake costs 1.24 dollars to make and sells for 2.49 dollars. Cupcakes left at closing go to a street-side retailer for 0.99 dollars each.
- He says selling the leftovers at 0.99 is worth doing because it recovers part of the loss.
- He says the profit opportunity on each cupcake sold is 1.25 dollars, which is 2.49 minus 1.24, and the loss on each leftover is 0.25 dollars after salvage.
- He says the letter S stands for the leftover price, and cost minus S is the loss on an unsold unit.
- He says the bakery also has past demand data in the form of a histogram.
- The question in the case is how many cupcakes to make in a day. Make too many and the leftovers lose money. Make too few and sales are lost, which is an opportunity loss.
- He says 90 percent of management is common sense once the jargon is taken out.

### The profit function

- The instructor starts by assuming production of 11, chosen because it sits near the mean of the demand histogram. He says this is only a starting choice and not the right answer.
- He says the production cost is fixed once you decide the quantity and does not depend on demand. For 11 cupcakes it is 13.64 dollars.
- He says the number sold at full price is the smaller of demand and the quantity made. Demand above 11 cannot be served, and that gap is an opportunity loss.
- He says the number of leftovers is the quantity made minus demand, or zero when demand is higher.
- His profit for a production of 11 is: minus 1.24 times 11, plus 2.49 times the smaller of demand and 11, plus 0.99 times the larger of 11 minus demand and zero.
- In words, profit is the money from retail sales plus the money from salvage, minus the production cost.

### Expected profit and the marginal curve

- The instructor says a prediction about the future can only be made with probabilities, so he uses expected profit: the probability of each demand level multiplied by the profit at that level, added up over all levels.
- He says the probabilities come from past data. His example is a dish served within 2 to 3 minutes on 4 days out of 30, which gives a probability of 4 over 30.
- In the case, demand ranges between 3 and 18 according to the histogram.
- He says the whole table is a simple spreadsheet built from two formulas, the profit formula and the expected value formula.
- He then repeats the calculation for every production quantity and plots expected profit against quantity. The curve rises to a point and then declines.
- He says this shows that increasing the quantity is good only up to a point. Beyond it, extra production starts to hit profit.
- He says the quantity at the top of the curve is the optimum, where the business avoids both overproduction and underproduction.
- When the top is hard to see by eye, he says to plot the difference in expected profit between successive quantities. That difference is the marginal profit, the profit increase from one more unit.
- He says you keep producing while the marginal profit is positive and stop where it reaches zero. Each cupcake made beyond that point is made at a loss.
- He says the marginal profit starts near 1.25 dollars and falls as quantity rises.
- He calls this production economics, an application of economics in operations, and names the law of diminishing marginal returns as the idea behind it.

### When you have no past data

- Asked what a startup without past data should do, the instructor says to use a proxy or market research, unless the product is so disruptive that nothing like it has existed. Data from an experiment also works.
- He says that for data the frequency matters more than the time period. With hourly data one week is enough, and with daily data he asks for a month.
- He gives 30 data points as the minimum for running a statistical test and calls it an arbitrary rule, with higher being better.
- He says that with fewer than 30 points there are still tests available, using the t distribution in place of the normal distribution.

## Examples and cases used

- A newspaper seller outside a railway station: the plain form of the newsvendor problem, a perishable good bought before demand is known.
- Hotels, airlines and hospitals: capacity held back for uncertain last-minute demand is the same decision.
- Kristen's Cupcakes: the worked case for the profit function, expected profit and marginal profit.

## Numbers given

- 1.24 dollars cost, 2.49 dollars price and 0.99 dollars salvage per cupcake, from the case.
- 1.25 dollars profit per cupcake sold and 0.25 dollars loss per leftover, from the case.
- 13.64 dollars production cost for 11 cupcakes, the instructor's starting assumption.
- Demand between 3 and 18 cupcakes a day, from the case histogram.
- 30 data points as his minimum for a statistical test.

## Not covered

- The optimal quantity for the bakery. The figures spoken at this point in the recording are not consistent, and the answer is settled in the next recording.
- The critical ratio and the service level formula, which come after the break.
- Reorder points, safety stock, lead times and other inventory topics.
