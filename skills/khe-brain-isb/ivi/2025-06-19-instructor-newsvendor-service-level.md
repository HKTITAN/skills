---
title: "ivi: Newsvendor model and optimal service level, 19 Jun 2025"
speaker: "Not identified in the recording"
organisation: "Not stated in the recording"
date: "2025-06-19"
kind: "class"
transcript_quality: "poor, many sentences cut off mid way, the typed class notes in the file confirm the numbers"
---

# Newsvendor model and optimal service level

The operations management instructor recapped the newsvendor formula from the previous class and had the cohort solve two problems in Excel: how many hotel rooms to hold back for last minute bookings, and a vaccine stocking problem with a government buy back. The session is a worked problem class.

## What was said

### Service level

- The instructor defines service level as a probability: the chance that all the demand that occurs is met by the quantity you have available.
- A high service level is a good way to look at customer satisfaction and to build a brand that never says no to the customer.
- The instructor says the cost is inventory. Meeting all demand most of the time means carrying a lot of stock, and if customers do not turn up it is wasted.
- The optimal service level balances two aims: not saying no to the customer, and not running into losses.

### The critical ratio

- The instructor gives the optimal service level as Cu divided by Cu plus Co, where Cu is the cost of understocking and Co is the cost of overstocking. The instructor calls this the critical ratio or newsvendor ratio.
- The cost of understocking is an opportunity loss: demand was there and you could not meet it, so you gave up profit.
- The class notes give Cu as price minus cost and Co as cost minus salvage value.
- The instructor says the ratio needs no probabilities, only the two costs.
- To turn the ratio into a quantity you go back to the histogram of past demand and use the condition on the probability that demand is less than or equal to the quantity Q.
- The instructor says that condition uses cumulative probability, which is easy to calculate in practice.
- The instructor says keeping the formula in mind helps a founder set service levels quickly and decide what to agree with customers in a B2B negotiation.

### From frequencies to a decision

- The instructor says past demand usually comes as frequencies, not probabilities, and you compute the probabilities yourself by dividing each frequency by the total number of observations.
- Cumulative probability for each quantity is the running sum, and the last value must come to 100 percent as a check.
- The procedure is to step up one unit at a time, comparing the cumulative probability with the critical ratio, to decide whether to add the next unit or stop.

### Where the model applies

- The instructor lists airlines, hotels, agriculture and health care as industries with newsvendor problems.
- An apparel shop faces it when deciding how much stock to hold before the next fashion change.
- A hospital faces it when deciding how many theatres or cubicles to keep for emergencies.
- The instructor says last minute bookings are a chance to earn a significant extra profit from the customer.

### Optimisation, not prediction

- Asked whether this is predictive analytics, the instructor says forecasting uses past demand plus seasonality, error terms and new market variables, and that predictive analytics is only a decision support system.
- The instructor places the newsvendor model as an application of an optimisation model: it does not predict demand, it optimises the decision.

## Examples and cases used

- Hotel California: a luxury hotel always fills on advance bookings at 200 a night, and the manager holds some rooms back to sell at 300 a night at the last minute. A room is either in the advance pool or the held back pool.
- In that problem the cost of understocking is 100, the extra revenue lost when a last minute guest arrives and no room was held back. The cost of overstocking is 200, the revenue lost when a held back room stays empty.
- The critical ratio is 100 divided by 300, or 0.33. Using the cumulative demand table the class built from 150 observations, the answer reached is to hold two rooms and not a third.
- Vaccine problem: with a cost of 6, a price of 24 and no salvage value, Cu is 18, Co is 6 and the critical ratio is 0.75.
- Vaccine buy back: the government offers to buy unsold stock at some price. If the maker wants to run out only 10 percent of the time, the target service level is 90 percent, and the class is asked to find the buy back price that gives that ratio.

## Numbers given

- 0.33: the critical ratio in the instructor's hotel problem.
- 0.75: the critical ratio in the instructor's vaccine problem before the buy back.
- 17 percent: the cumulative probability of zero last minute requests in the hotel data, from 25 of 150 observations.

## Not covered

- The derivation of the critical ratio was done in the previous class and is only referred to here.
- The final buy back price in the vaccine problem is not stated in the recording.
- Continuous demand distributions and safety stock were not covered.
