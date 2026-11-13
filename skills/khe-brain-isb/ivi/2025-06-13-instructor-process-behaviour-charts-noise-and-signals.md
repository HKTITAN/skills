---
title: "ivi: Process behaviour charts, noise and signals, 13 Jun 2025"
speaker: "Not identified in the recording"
organisation: "Not stated in the recording"
date: "2025-06-13"
kind: "class"
transcript_quality: "fair, the classroom game is mostly noise and many sentences are cut, the lecture after it is clear enough"
---

# Process behaviour charts, noise and signals

The second part of the operations management class on 13 June, after the Cp and Cpk session. The instructor, who is not named in the recording, runs a marble factory game with volunteers as workers and the class as managers, then uses it to teach the voice of the process, control limits, common and special cause variation, and the difference between a process being in control and being capable.

## What was said

### The marble experiment

- The instructor trains three volunteer workers in a fixed three-step process of drawing marbles from a box. White marbles and empty slots count as defects, and each draw has 33 opportunities.
- Playing the manager, he sets a goal of at least 24 good marbles, pushes for speed, and rewards and blames workers by their numbers.
- He then points out that every decision in the game was made on data, and that the data came from randomness in the process. The best worker had nothing to do with her good numbers and the worst had nothing to do with his bad ones.
- He says the game makes the randomness visible on purpose. In a real process the same hidden randomness exists and is not visible.
- He says promotions, bonuses and appraisal discussions in most organisations are run the way he ran the game, from dashboard numbers.

### Two things mixed in any performance data

- The instructor says performance data has two components embedded in it: the true performance of the worker and the inherent randomness of the process.
- His example is the class start time. Arrival times spread around 9.30 because of the campus roads and other causes, and blaming one person for arriving at 9.35 attributes the whole variation to the worker.
- He says comparing each number with a goal and labelling it good or bad is an incorrect way for managers to read data, because it mixes the two components.
- He says not to conclude from insufficient data. Three data points that seem to show improvement gave the class the wrong conclusion once more points were shown.
- He says setting a goal did not explain why performance rose or fell in the game. The randomness did.

### Voice of the process, noise and signals

- The instructor says the voice of the customer is expressed in specification limits, and the voice of the process is what the process keeps telling you through its own data.
- He defines noise as fluctuation a manager should not react to.
- He says reacting to noise wastes managerial time, because you end up hunting for explanations of a bad number.
- He says noise has no root cause, since it is randomly generated, so no root cause analysis and no process improvement should be aimed at it.
- He says data also carries signals that you must react to. Variation that comes from true performance is a signal.
- He says anything in the data that is not noise is a signal, so you first need a way to pick out the noise.

### Process behaviour charts and control limits

- The instructor prefers the name process behaviour chart over control chart, because the chart tells you about the behaviour of the process and does not control it.
- He says all fluctuation between the upper control limit and the lower control limit is noise.
- He says specification limits come from the customer and need no logic behind them. Control limits come from the voice of the process, meaning your mean and standard deviation, and are calculated.
- He sets the upper control limit at the mean plus 3 standard deviations and the lower control limit at the mean minus 3 standard deviations. His example uses a mean of 22 and a standard deviation of 4.
- He says the 3 here is three standard deviations from the mean and has nothing to do with a 3 sigma or 4 sigma capability level.
- He credits the chart and the three standard deviation recommendation to Walter Shewhart and says it is the industry standard, a recommendation and not a hard rule.
- He says a very critical business such as aircraft manufacturing should monitor more stringently by shrinking the limits to two standard deviations or one.
- He says how tight to make the limits is a top management decision and not an individual manager's.
- He says control limits are always balanced on both sides, because a swing on the good side deserves the same attention as one on the bad side so that best practices can be found.
- He says control limits are theoretical values, so a calculated lower limit can come out at a value the process could never show.

### What a manager does with the chart

- The instructor says a manager should put a chart like this in front of every KPI and monitor it daily.
- In his 16-day example only one point fell outside the limits. He says that was the only day a manager should have asked for an explanation.
- He says to investigate an unusually good point too, to see whether a best practice or a new technique can be taught to the others.
- He calls variation inside the limits common cause variation, which comes from causes inherent in the design of the process. Variation outside the limits is special cause variation.
- He says asking for an explanation of every ordinary fluctuation is micromanagement and improves nothing.
- He says a special cause point is not an outlier. In statistics an outlier is a point you would remove because it carries no meaning, and this point is a signal.
- He says rewarding someone for random good numbers also harms that person, who believes she is a great performer when she is not.
- He says you become a good manager when your people respect you and you treat them with love and respect, not by writing policies from a room.

### In control is not the same as capable

- The instructor says a process that is in control is free from special cause variation, which means it is stable. Data from a stable process can be used for managerial decisions.
- He says control has nothing to do with meeting the customer's expectation. That is capability, and both apply to every KPI.
- He says the two questions to ask, in order, are: is my process in control, and is my process capable of meeting the customer expectation.
- His combined example has customer limits of 2 and 8 minutes, a mean of 6 and a standard deviation of 2. The points all sit inside the control limits, so the process is in control, yet it often breaks the customer's limits, so it is not capable.
- He says when the control limits lie outside the specification limits it is a bad process. The control limits should sit inside the specification limits.
- His picture is a car on a bridge. The railings are the specification limits, and hitting them cannot be reversed. The lane lines painted inside them are the control limits, which warn you while there is still time to act.
- He says a process whose specification limits lie inside its control limits has something fundamentally wrong and needs a redesign, the DMADV route.
- He says control charts are for day to day monitoring and have nothing to do with process improvement.
- He says an internal KPI such as attrition gets its specification limit from an internal customer, which is top management.

### Setting up the chart

- The instructor says to calculate control limits from your baseline, meaning the mean and standard deviation of past data.
- He says once the limits are calculated you keep them fixed and monitor new data against them. You do not add each new point to the baseline and move the limits every day.
- He says to change the control limits only when the process itself changes.
- He says a deliberate change that makes the metric worse, such as lengthening a turnaround time to save cost, still counts. He prefers the term process change to process improvement.

## Examples and cases used

- The marble factory game: shows that worker numbers can come entirely from randomness in the process.
- Students arriving at class around 9.30: ordinary spread is noise, and one arrival at 10.45 is a signal.
- Daily visitors to an e-commerce app: an important metric whose daily fluctuation should not be trusted on its own.
- A car on a bridge with railings and lane lines: specification limits against control limits.
- Aircraft manufacturing: a case for tighter control limits.

## Numbers given

- 33 opportunities per draw and a goal of 24 good marbles, in the instructor's game.
- Mean 22 and standard deviation 4 in his control limit example.
- Customer limits of 2 and 8 minutes, mean 6 and standard deviation 2 in his combined control and capability example.
- 1 point outside the limits in 16 days in his chart example.

## Not covered

- Rules for reading patterns inside the control limits, such as runs or trends.
- Different chart types for different kinds of data.
- The figure showing control limits inside specification limits. He could not find the slide and showed it in the next class.
