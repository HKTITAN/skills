---
title: "ivi: Process capability indices Cp and Cpk, 13 Jun 2025"
speaker: "Not identified in the recording"
organisation: "Not stated in the recording"
date: "2025-06-13"
kind: "class"
transcript_quality: "fair, board work is not captured and several passages drop out"
---

# Process capability indices Cp and Cpk

The first part of the operations management class on the day after the Six Sigma session. The instructor, who is not named in the recording, turns the sigma idea into the formulas for Cp and Cpk, applies them to the food delivery case set as homework, and names two strategies for improving a process. It ran as board work with questions.

## What was said

### Cp, the process capability index

- The instructor defines process capability as the allowable spread divided by the actual spread.
- He says the allowable spread is what the customer allows, which is USL minus LSL. The actual spread is your standard deviation.
- He writes Cp as USL minus LSL, divided by 3 times the standard deviation.
- He introduces the 3 as a constant. His explanation is that a proportional relationship needs a constant before it can be written as an equation.
- His first example has specification limits of 1 and 7 and a standard deviation of 1, giving a Cp of 6 divided by 3, which is 2.
- He says the mean and the standard deviation describe your own performance and have nothing to do with the customer.

### Why Cp is not enough

- His second example has limits of 1 and 9 with a standard deviation of 1, giving a Cp of 8 divided by 3. That is also close to 2, but this process has more defects on one side.
- The instructor says Cp does not always give the right process capability, because its formula has only spread in it and ignores the central tendency of the data.
- He says Cp is a good measure only when the process is centred, meaning the mean is the same distance from both specification limits.
- He says you cannot count on a centred process, because the specification limits are the customer's choice and the customer may allow more room on one side than the other.
- He says a process whose mean is off centre between the limits is still a normal distribution. A skewed distribution is a different thing.

### Cpk

- The instructor builds Cpk by measuring the spread on each side separately from the mean: mean minus LSL on one side and USL minus mean on the other, each divided by 3 standard deviations.
- He says Cpk is the minimum of those two values.
- He takes the minimum because overall capability should be judged by the poorer side, the side with more defects. He calls this making the measure strict.
- He says the sigma value Z equals Cpk multiplied by 3. So Z is the minimum of mean minus LSL over the standard deviation and USL minus mean over the standard deviation.
- He says Cp is a lenient measure.
- He says if Cp equals Cpk the process is centred, and if they differ it is not centred. This check matters when you have no picture of the data to look at.
- He writes the sample mean as x bar and says mu is used for a population.
- He says he does not want the formula memorised. He wants the intuition, so that the class can fix the problem when the simple formula does not work.

### One-sided specifications

- The instructor's call centre example: a call that ends in under one minute leaves the customer feeling unheard, and a call beyond 9 minutes also makes the customer unhappy, so the limits are 1 and 9.
- He then changes the example so that handling time is a lower-is-better KPI. Then only the USL exists and the LSL does not.
- He says with no LSL there are no longer two values to take a minimum of, so Z is USL minus the mean, divided by the standard deviation.
- He says centring does not arise in the food delivery case, because it has a one-sided specification.

### Working the food delivery case

- For the homework case the instructor says to write down two things first: the voice of the customer, and your performance as a mean and a standard deviation.
- In the case data the class reads a mean of about 21 and a standard deviation of about 7. He says a standard deviation that high already points to a consistency problem.
- He says always to start an analysis by plotting a histogram, and to look for three things in it: the mean, the spread and where the specification limit sits.
- He says everything beyond the specification limit in the histogram is a defect.
- The class arrives at a sigma value of about 1.11 for the case.

### Two strategies for improvement

- The instructor reads the strategies off the formula: Z rises if the numerator, USL minus mean, grows, or if the denominator, the standard deviation, shrinks.
- He says you can never change the specification limit, but the mean is in your control because it is your performance.
- The first strategy is to shift the mean away from the limit. In the delivery case that means consciously reducing the overall time taken.
- The second strategy is to reduce the standard deviation.
- He says Six Sigma as a methodology focuses on reducing defects and reducing variation, while lean focuses on improving value and reducing waste.
- Answering a student, he says a lower mean in a later sample tells you about the first strategy only. You cannot comment on the standard deviation unless you have the data points.

## Examples and cases used

- Two bell curves with limits 1 to 7 and 1 to 9: same Cp of about 2, different defect levels, which shows why Cp misleads when a process is off centre.
- A call centre with 5,000 to 6,000 calls in a year and a mean call time of 4 minutes: used for two-sided and then one-sided specification limits.
- A food delivery case with a 30 minute promise: used to compute a sigma value from real data and to derive the two improvement strategies.

## Numbers given

- Cp of 2 for limits 1 and 7 with standard deviation 1, the instructor's first example.
- Cp of 8 divided by 3 for limits 1 and 9 with standard deviation 1, his second example.
- Mean about 21 and standard deviation about 7 in the delivery case data, as read out in class.
- Sigma value about 1.11 for the delivery case, the class's answer.

## Not covered

- Why the constant is 3. The instructor said twice that he would explain later, and gave only what he called an arbitrary explanation.
- Hypothesis testing. The class voted to keep the next session for supply chain basics instead.
- The process behaviour chart material, which followed after the break and is in a separate recording.
