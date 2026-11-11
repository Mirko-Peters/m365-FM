---
title: "Use Data Before You Walk: How to Decide Where to Look First"
summary: "Gemba walk data helps you choose where to look first. Use OEE, queues and late orders to pick one line and one question, then verify the numbers on the floor."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-analyzer, oee, gemba-walk, bottleneck]
keypoints:
  - "Use gemba walk data to choose where to go and which question to ask. The walk then checks whether the numbers describe reality and finds the cause behind them."
  - "Look at four data views before a walk: OEE by line, queues and waiting time, late orders against plan, and quality or rework."
  - "OEE is availability multiplied by performance multiplied by quality. The weakest of the three factors tells you what to look for on the floor."
  - "A growing queue in front of a step is a sign of a bottleneck. Start your walk at the step with the longest queue."
  - "Write one question from the data, then walk. Never present the numbers as a verdict. Show them to the team and ask what they see."
faq:
  - q: "What data should I check before a gemba walk?"
    a: "Check four views: OEE or output by line, queues and waiting time between steps, late orders against the plan, and quality or rework. Pick the line where plan and actual differ most. Then write one question the data cannot answer, such as why performance dropped, and take it to the floor."
  - q: "Can data replace a gemba walk?"
    a: "No. Data shows what happened and where, but not why. A dashboard can tell you that a line lost 20 minutes per shift to small stops. Only the people at the machine can tell you what caused them. Use data to choose where to walk, and the walk to find causes."
  - q: "What is OEE and how is it calculated?"
    a: "OEE, overall equipment effectiveness, shows what share of planned production time is truly productive. It equals availability times performance times quality. Availability is run time divided by planned time, performance compares actual output to ideal cycle time, and quality is good parts divided by all parts."
---
A [gemba walk](https://www.m365.fm/entity/gemba-walk/) gives you the best return when you go to the right place with a clear question. Gemba walk data helps you choose both. This article is for operational excellence managers who want a simple way to turn plant data into a short list of places to visit. It covers four data views, how to read OEE and queues before you go, a method to turn numbers into a question and an example with three lines. *Gemba* is Japanese for "actual place", the place where the work happens. The Lean Enterprise Institute explains the term in its [lean lexicon entry on gemba](https://www.lean.org/lexicon-terms/gemba/).

## Gemba walk data: what to look at before you go

You do not need a new system to prepare a gemba walk, and you do not need a digital gemba walk app. A spreadsheet is enough for data collection at the start. Four views of data that you probably have already will do:

1. **OEE or output by line.** Overall equipment effectiveness shows what share of planned time is truly productive. Look at the trend, not one shift.
2. **Queues and waiting time.** Work in progress in front of each step shows where flow slows down.
3. **Late orders against the plan.** Which orders missed their date, and in which area did they wait?
4. **Quality and rework.** Where do parts fail, and where are they reworked?

Add one soft source: the notes from your last gemba walk. Open corrective actions point to places that still need attention. Put the four views and the open actions on a one-page gemba walk checklist, so that every successful gemba walk starts the same way and you can compare one walk with the next.

The rule is simple. Look for the **largest gap between plan and actual**, and for a **change** from last week. A line that is always at 60 percent is a different story from a line that fell from 80 to 65 in two weeks. Write down two or three candidates and the data behind each one. Then choose one, because one question per gemba walk is enough. Use the checklist to conduct the walk in the same order each time.

Data can mislead. A KPI may be measured differently on two lines, or a stop code may be used loosely. Treat the numbers as a hypothesis. The gemba walk tests whether the data describes what really happens. This is the main link between data and continuous improvement: the data points to opportunities for improvement and to areas for improvement that deserve a closer look, and the gemba walk shows the real problem behind it.

## How to read OEE data before a gemba walk

[OEE](https://www.m365.fm/entity/oee/) is a standard way to measure how well equipment is used. The Lean Production guide from Vorne Industries defines it as the percentage of planned production time that is truly productive, and gives the formula as **availability × performance × quality**. You can read it in the [OEE guide](https://leanproduction.com/oee).

Each factor tells you what to look for:

- **Availability** is run time divided by planned production time. A low value points to stops: breakdowns, material shortages, changeovers. On the floor, ask what stopped the machine and how long it took to restart.
- **Performance** compares actual output with the ideal cycle time. A low value points to slow cycles and small stops. On the floor, watch cycle after cycle and ask what makes the machine run below its ideal speed.
- **Quality** is good count divided by total count. A low value points to scrap and rework. On the floor, ask where defects start and how they are found.

The guide states that 85 percent OEE is considered world class for discrete manufacturers, and describes 60 percent as fairly typical. Remember that this is a statement by one vendor of OEE systems, not a standard. Use your own history as the main benchmark. The question is whether a line improves, not whether it hits a number from a web page.

## Find the bottleneck first

OEE tells you about one machine. To choose between machines, look at flow. The [bottleneck](https://www.m365.fm/entity/bottleneck/) is the resource or process step that limits how much work can pass through a production system in a given period. Queues are its footprint. If work piles up in front of one step and the steps after it wait for parts, that step limits the whole line.

Use data to find it:

- Rank steps by the amount of work waiting in front of them.
- Compare the utilisation of the steps. The step that is busiest, and in front of which work waits, is the candidate.
- Check whether the bottleneck has moved since last month. After a disruption it can shift to another machine, an inspection step or a person.

A minute lost at the bottleneck is a minute lost for the whole line. A minute lost at a step with spare capacity may cost nothing. That is why a gemba walk at the bottleneck often has the highest return.

## From data to a question

Turn the numbers into one question in five steps:

1. **List the gaps.** Note the three largest gaps between plan and actual.
2. **Pick one place.** Choose the line or step with the biggest gap and the most recent change.
3. **Write a question the data cannot answer.** "Why did performance fall on line C?" is better than "Why is line C bad?"
4. **Show the data to the team.** Bring a one-page chart and ask the team members what they see. They often know why, and their problem-solving ideas are usually practical.
5. **Check the data on the floor.** Count a few cycles or stops yourself. Does your count match the system?

## Example: choosing between three lines

This is an illustrative example with made-up numbers. An operational excellence manager looks at last week's OEE data for three lines.

- **Line A:** availability 90 percent, performance 85 percent, quality 98 percent. OEE = 0.90 × 0.85 × 0.98 = 0.7497, about **75 percent**.
- **Line B:** availability 82 percent, performance 90 percent, quality 95 percent. OEE = 0.82 × 0.90 × 0.95 = 0.7011, about **70 percent**.
- **Line C:** availability 88 percent, performance 78 percent, quality 99 percent. OEE = 0.88 × 0.78 × 0.99 = 0.6795, about **68 percent**.

Line C has the lowest OEE. Its weakest factor is performance at 78 percent, while quality is almost perfect. That suggests slow cycles or many small stops, not scrap. Queue data shows that line C also has the longest queue in front of its second machine.

Her question for the gemba walk: "What makes machine 2 on line C run below its ideal speed?" She plans 30 minutes at that machine. She will count cycles for 10 minutes, note small stops and ask the operator what causes them. If her count of stops differs from the system, that is a finding too: the data may be wrong.

The numbers did not tell her the cause. They told her where to start.

## How to use the data once you are on the floor

The data has done its job when you arrive. Now put it aside and watch. Here is a simple routine for the first 30 minutes at the chosen step:

1. **Say why you came.** Tell the operator which number caught your eye and that you want to understand it, not judge it.
2. **Watch two or three cycles without asking anything.** You need your own picture before you listen to explanations.
3. **Compare with the system.** Count stops, waiting time or scrap for ten minutes. Write down the count next to the number you saw on the dashboard.
4. **Ask open questions.** "What usually gets in the way here?" works better than "Why is OEE low?" The operator knows the small stops that no code captures.
5. **Note what the data missed.** If the floor shows a problem that the dashboard never mentioned, that is a finding. It may mean you need a new stop code or a new measure.

If your dashboard shows real-time data, check it at the station and compare it with what you count. After the gemba walk process is done, update your data view. Add the reason codes people gave you. Next time the chart will tell you more, and your questions will get sharper. Over weeks this builds a culture of continuous improvement, because the team sees that its answers change the data and the data changes the work. Good gemba walks conducted with data are a core habit of lean management and operational excellence, because they ensure that informed decisions rest on facts, that productivity gains hold and that employees stay engaged in the work of improvement. This is how a KPI dashboard and a gemba walk improve each other: the dashboard sends you to the right place, and the gemba walk improves the dashboard.

## Common mistakes

- **Using data as a verdict.** If you arrive with a chart and an accusation, the team will defend the numbers instead of explaining them.
- **Trusting the data blindly.** Check a sample on the floor. Wrong stop codes are common.
- **Looking at one shift.** Use a trend of a few weeks to avoid chasing noise.
- **Skipping the good lines.** Compare with a line that performs well. The difference often shows the cause.
- **Visiting only the worst line every time.** Rotate, or the team will feel singled out.
- **Preparing so much that you stop watching.** Data is for choosing the place. On the floor, look at the work.

## How software can help

Collecting these views by hand is slow, and a tool can streamline the work and support operational efficiency. KPI dashboards bring them together. [iFAKT's Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) is a module of the Polaris production software with KPI dashboards across all modules that compare planned and actual values in production. A view of planned against actual helps you pick the area for your next walk. The explanation still has to come from the people who run the process.

## Next step

Take last week's data, pick the line with the biggest gap between plan and actual, and write one question for it. Then test the numbers on the floor and compare your own count with the dashboard, because gemba walk data is a starting point and not the answer.
