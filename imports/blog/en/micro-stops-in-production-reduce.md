---
title: "Micro-Stops in Production: How to Find and Reduce Them"
summary: "Micro stops in production are short interruptions that nobody records but that eat hours of output. Learn how to count them, rank causes and remove them."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [micro-stops, oee, manufacturing-execution-system]
keypoints:
  - "Micro-stops are very short interruptions that the operator clears at once, so they usually go unrecorded even though they add up to large losses."
  - "In OEE, micro-stops count as a performance loss, not an availability loss, which is why a good availability figure can hide them."
  - "Manually recorded downtime is often highly inaccurate, and automatic counting from the machine signal is the most reliable way to see short stops."
  - "Count stops per hour and per cause, rank them in a Pareto chart, and fix the most frequent cause that has a concrete improvement idea."
  - "Most micro-stop fixes are small and physical, such as a guide, a sensor position, a cleaned surface or a changed feed, and the operators know them."
faq:
  - q: "What counts as a micro-stop?"
    a: "A micro-stop is a very short interruption that the operator clears without maintenance help, often a minute or two. OEE.com says small stops are usually well under five minutes and need no maintenance staff. The exact limit is your decision. Write it down so every shift and every line applies the same rule."
  - q: "Are micro-stops part of availability or performance in OEE?"
    a: "They are a performance loss. OEE availability covers stops long enough for an operator to log a reason, usually several minutes. Small stops sit in the performance factor, together with slow cycles. A machine can therefore show high availability and still lose a lot of output to short stops."
  - q: "How do I measure micro-stops without a big system?"
    a: "Start with a signal you already have: a part counter or a run light. A simple logger can record each time the machine stops for more than a few seconds. If that is not possible, tally marks by operators for two weeks give a rough first picture. Move to automatic counting once you know where to look."
---

Micro stops in production are very short interruptions, usually cleared by the operator in a minute or two, that nobody writes down. Each one looks harmless. Together they can take more productivity than the major breakdown everyone talks about. This guide is for production managers who suspect hidden losses on a line. You will learn what micro-stops are, how to make them visible, how to rank the causes and how to remove the biggest one.

## What are micro-stops, and why do they stay hidden?

Micro-stops go by several names: minor stoppages, small stops, brief stops, idling and minor stops. The [OEE.com description of the six big losses](https://oee.com/oee-six-big-losses) lists "idling and minor stops" as one of the six. It describes the typical case as a minute or two, resolved by the operator, and usually well under five minutes. It also says the line between a small stop and a failure is flexible and should follow your reason-tracking policy.

Typical examples are a part jammed in a chute, a misfed label, a film that slips, a dirty photo-eye or a robot waiting for a part that did not arrive. On a conveyor line the same effect shows up as blocking and starving. A full queue halts the station upstream for a few seconds, and an empty one halts the station downstream. A faulty sensor or a crooked part is another frequent cause.

The operator fixes it and the line restarts. Because the fix is quick, nobody calls maintenance and nothing reaches the downtime log. Three reasons keep these events hidden. Operators focus on keeping the line running, not on writing notes. Paper forms have no field for a 20-second event. And most reports start at a threshold of several minutes, so shorter events fall off the chart.

A [micro-stop](https://www.m365.fm/entity/micro-stops/) is therefore defined less by its cause than by its size and its invisibility. If it is long enough that an operator would enter a reason, it is downtime. If it is shorter, you need another way to see it. Some plants treat a 30-second halt as a stoppage and a 2-minute jam as downtime. The class limit matters less than using the same one on every shift.

## Micro stops in production and your OEE number

In OEE, short interruptions are a performance loss. The OEE.com page on the [OEE factors](https://oee.com/oee-factors/) defines performance loss as anything that makes the process run below its maximum speed while it is running, including slow cycles and small stops. Availability, by contrast, covers stops long enough for an operator to log a reason, usually several minutes.

This matters for how you read your [OEE](https://www.m365.fm/entity/oee/) result. A line can report 90 per cent availability and still lose a lot of output. If the performance factor is low and nobody knows why, micro-stops are the first suspect. Vorne, an OEE software vendor, writes that slow cycles and small stops are often larger sources of lost time than individual downtime reasons. That is a vendor statement, so check it against your own data. The method below does exactly that.

## How to find micro-stops and rank them in a Pareto chart

Vorne also says that manually recorded downtime is often highly inaccurate, and that manual sheets overlook shorter events. Its guide to [downtime tracking](https://vorne.com/learn/downtime/machine-downtime-tracking-and-reporting) recommends automated data collection and notes that automation catches shorter stops that are easy to miss. Follow these steps.

1. **Pick one line** that you suspect, usually the bottleneck or a machine with a low performance factor.
2. **Define the event.** Write the shortest interruption you count, for example 10 seconds. Write the limit above which it is downtime, for example 5 minutes.
3. **Capture the signal.** Use the run signal, a part counter or a simple sensor, for example from the PLC (programmable logic controller) that runs the equipment. A manufacturing execution system or a data logger can store each event with a timestamp. Without any system, use operator tally sheets for two weeks as a first look.
4. **Add a reason.** Let operators choose a reason after the restart, from a short list. Vorne suggests no more than 25 reasons, all actionable, describing symptoms rather than root causes.
5. **Count frequency, not only minutes.** Record the number of events per hour and the total time per cause.
6. **Rank the causes** in a Pareto chart, a bar chart sorted from largest to smallest with a cumulative line.

Look at the time of day, the shift, the product, the material batch and the cycle time just before the event. If the line slows down before each one, a worn part or a sensor fault is likely. Patterns show up quickly: clusters after a changeover, on one product, or with one supplier's material.

## How to reduce small stops and the loss they cause

Take the most frequent or largest cause that has a concrete improvement idea. Vorne's advice is to focus first on the largest loss where the team has concrete ideas, using a cycle of tracking, picking and fixing. Then:

- **Ask the operators.** They clear these interruptions every day and usually know the cause.
- **Go to the shop floor and watch.** Film it on a phone if it happens too fast to see. Ask why it happened, and then why again. This is root cause analysis in its simplest form.
- **Fix the cause, not only the clearing.** A wider guide, a better sensor position, a cleaned surface, a changed feed angle or a better tool are typical fixes. Each is small.
- **Design the error out.** If a part can jam because it enters crooked, add a guide so it cannot. This is the idea behind poka-yoke, mistake-proofing.
- **Add the routine to the checklist.** In total productive maintenance, operators clean and inspect their equipment, which often removes the cause of repeated small stops.
- **Check the bottleneck first.** An interruption at the bottleneck costs throughput for the whole line. The same event at a station with spare capacity may cost almost nothing.
- **Re-measure.** Check that the count for that cause falls, and look at the next one.

## Example: what 70 short stops cost in one shift

This is an illustrative calculation, not a measured result. A packaging line runs 450 minutes per shift. The ideal cycle is 20 seconds, so the ideal output is 450 times 60 divided by 20, which is 1,350 units.

A logger records 70 events per shift, each averaging 40 seconds. That is 70 times 40, or 2,800 seconds, which is about 47 minutes of lost time that no report shows, or 10 per cent of the production time. At 20 seconds per unit, those 47 minutes equal about 140 units that the line could have made.

The team ranks the causes:

- Film slips at the wrapper: 28 events
- Product jam at the infeed: 21 events
- Label misfeed: 12 events
- Dirty sensor: 6 events
- Other: 3 events

Film slips and infeed jams together are 49 of 70 events, which is 70 per cent. The team starts with those two. If a guide at the infeed removed all 21 jams, the line would gain 21 times 40 seconds, which is 14 minutes per shift. The figures are invented, but the method works with real counts.

## Common mistakes

- **Counting only long stops.** If the log starts at five minutes, you cannot see micro-stops at all.
- **Letting operators type reasons by hand during the event.** The restart is the priority. Capture the event automatically and add the reason afterwards.
- **A reason list that is too long.** Operators pick "other" when the list is a maze.
- **Blaming operators.** A micro-stop is a signal about the equipment or the material. Treat it as data.
- **Fixing the symptom by clearing faster.** Faster clearing makes the interruption shorter, but it still happens.
- **Chasing the longest event instead of the most frequent one.** Check both the count and the minutes.

## How software can help

A [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) or a data logger can record each interruption from the machine signal, with a timestamp, so short events stop being invisible. It can then ask the operator for a reason after the restart, classify the causes, and show frequency and duration by shift, product and hour on a dashboard. This replaces tally sheets and gives a real-time view of event counts per hour. The same analytics can later feed predictive maintenance. It does not replace a walk to the line, because the data tells you how often and when, and only the line tells you why.

## Next step

Pick the line with the weakest performance factor and log every interruption longer than a few seconds for two weeks. Then rank the causes and start with the top one. That is the fastest way to deal with micro stops in production.
