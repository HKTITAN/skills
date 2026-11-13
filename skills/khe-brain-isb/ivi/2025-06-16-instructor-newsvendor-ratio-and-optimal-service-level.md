---
title: "ivi: The newsvendor ratio and optimal service level, 16 Jun 2025"
speaker: "Not identified in the recording"
organisation: "Not stated in the recording"
date: "2025-06-16"
kind: "class"
transcript_quality: "fair, the board derivation is only partly captured and some spoken numbers conflict"
---

# The newsvendor ratio and optimal service level

The second half of the operations management class on inventory, after the break. The instructor, who is not named in the recording, derives the newsvendor ratio from the question of whether to make one more unit, then has the class apply it to the cupcake bakery case and explains how a service level figure is used with vendors and customers. It ran as a derivation on the board with a class exercise.

## What was said

### Cost of overstocking and understocking

- The instructor poses the new question: what if the demand range and its probabilities are unknown, as for a new business with no past data.
- He defines the cost of overstocking, Co, as cost minus salvage per unit. You have already paid the cost, and salvage recovers part of it.
- He defines the cost of understocking, Cu, as price minus cost per unit. It is the profit you would have made on a unit you did not have.
- He says Co and Cu are per unit costs and have nothing to do with quantity.
- He says that when there is no salvage, Co equals the full cost, a total loss of the unit.
- He says the only simplifying assumption in the example is that the shop sells one product.

### Should I make one more unit

- The instructor frames the decision as: I have already made Q units, should I make unit Q plus 1.
- He says making it and failing to sell it wastes the production cost, and not making it when demand exists is an opportunity lost.
- He says only two things can happen: demand is greater than Q, or demand is less than or equal to Q. The two are mutually exclusive and collectively exhaustive, so their probabilities add up to 1.
- If demand is greater than Q, the extra unit sells and the payoff is plus Cu. If demand is less than or equal to Q, the extra unit does not sell and the payoff is minus Co.
- He writes the expected value of the extra unit as the probability that demand exceeds Q times Cu, minus the probability that demand is at most Q times Co.
- He says you make the extra unit only if that expected value is positive.
- Replacing the first probability with 1 minus the second and simplifying, he gets the condition: make unit Q plus 1 if the probability that demand is at most Q is less than Cu divided by Cu plus Co.

### The newsvendor ratio

- The instructor says the ratio Cu over Cu plus Co is called the newsvendor ratio, the critical ratio or the optimal service level.
- He says three things are enough to work out the optimal service level: cost of production per unit, selling price per unit and salvage value if there is any.
- He says the ratio does not depend on probabilities. You need probabilities only to check the condition and find the quantity.
- He defines service level for a quantity Q as the probability that you meet all your demand.
- He describes the optimal service level as the stock position at which you do not turn customers away and still make the maximum profit. "It is not higher the better, it is optimal the better."
- He ties this back to lean: zero inventory is the ideal, real businesses hold some, and this ratio answers how much to hold without giving up profit.

### Applying it to the cupcake case

- With a cost of 1.24 dollars, a price of 2.49 and salvage of 0.99, the class gets Cu of 1.25 and Co of 0.25.
- The class works out a critical ratio of about 83 percent. The recording gives it as both 83.3 and 83.5.
- To find the quantity he uses a table of cumulative probability of demand. Starting from the lowest quantity, at each Q you ask whether the cumulative probability is below the critical ratio. If it is, you make one more.
- At 12 the cumulative probability read out in class is 74.1 percent, which is below the ratio, so the 13th unit is made. At 13 the condition is violated, so the optimal quantity is 13.
- He says 13 matches the quantity with the highest expected profit found before the break.
- In the second problem the production cost is raised and everything else stays the same. Both Co and Cu change and the critical ratio falls to 66.7 percent. The recorder's written notes give the new optimal quantity as 12.
- He says the intuition matters more than the mathematics, which is only multiplication and addition.

### Seasonality is not a special cause

- Asked about demand jumps during events, the instructor says ordinary business variation is common cause variation. A war does not happen every day, and variation from one is a special cause to investigate.
- He says a recurring peak such as a cricket league season or summer ice cream sales is seasonal variation in demand and not special cause variation.
- For a season, he says the baseline changes: you use last year's data for the same season and not all past data.

### Unit economics questions from the class

- Asked about software, the instructor says licences are capped at a number of simultaneous users, so he would divide the cost of the software by that cap to get a per unit figure.
- On a streaming example from a student, he says the cost of producing a show has to be divided by the number of people served before comparing it with the price per user.
- Asked about several products at once, he says the model shown is for one product. With several, the probabilities are multiplied because it is an and condition, and the logic stays the same.

### Using the service level in practice

- The instructor says the service level figure is a starting point when signing contracts with vendors and making promises to customers.
- His example: if a business customer demands that you meet its orders 90 percent of the time and your calculated service level is 87.5 percent, you negotiate for 87.5.
- He says the service level is a useful metric by itself even when you do not know the quantity.
- For a consumer business he says the percentage guides how much raw material to buy, since the raw material is also perishable.
- He says products such as computers have a longer shelf life but still have one, because demand for them falls over time, so they can be treated as perishable to a degree.
- He says the probabilities needed for the quantity come from market research, an experiment or a test market when there is no ready data.
- He describes a supply chain as a chain in which every customer is a supplier to the next customer.

## Examples and cases used

- Kristen's Cupcakes: the case from before the break, now solved with the critical ratio in place of the expected profit table.
- Cricket league season and summer ice cream: seasonal demand needs a seasonal baseline.
- Capped software licences: how to get a per unit cost when the product is a licence.
- A laptop supplier asked for 90 percent on-time delivery: the service level as a negotiating number.

## Numbers given

- Cu 1.25 and Co 0.25 for the cupcake case, as computed in class.
- Critical ratio about 83 percent for the cupcake case, spoken as both 83.3 and 83.5.
- Optimal quantity 13 cupcakes, the class's answer.
- Cumulative probability 74.1 percent at a quantity of 12, read from the instructor's table.
- Critical ratio 66.7 percent in the second problem with a higher production cost.
- 87.5 percent against 90 percent in his negotiation example.

## Not covered

- The newsvendor model with a continuous demand distribution or a normal approximation.
- How to estimate the demand probabilities in any detail.
- The newspaper seller's own answer. The instructor returned to it at the end, and the recording does not capture what he said.
- Hypothesis testing, which he again offered for an extra class.
