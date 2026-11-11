---
title: "Value Stream Analysis in Manufacturing: Step by Step"
summary: "Value stream analysis turns a current state map into decisions. Follow eight steps from product family to bottleneck and future state, with a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, value-stream-mapping, bottleneck]
keypoints:
  - "Value stream analysis reads a current state map to find where time is lost, which step limits the flow and which changes come first."
  - "Choose one product family, collect data at the gemba and draw the current state map before you start to analyse."
  - "Compare waiting time with processing time. In many flows, work waits far longer than it is worked on."
  - "A step whose cycle time is above takt time cannot meet demand. The step with the biggest gap, the most waiting work and the highest load is the bottleneck."
  - "Turn the findings into a future state map and a short plan with owners, dates and a target for lead time."
faq:
  - q: "What is the difference between value stream mapping and value stream analysis?"
    a: "Value stream mapping draws the flow: process steps, material, information, inventory and times. Value stream analysis reads that drawing. You compare cycle times with takt time, check waiting against processing time, find the bottleneck and decide what to change. Mapping gives you the picture, and analysis gives you the decisions."
  - q: "Which metrics do you use in a value stream analysis?"
    a: "The usual metrics are cycle time, changeover time, queue time and inventory at each step, plus value-added and non-value-added time. Many teams add equipment availability and first pass yield. From these you derive lead time, takt time comparison and the share of time that adds value for the customer."
  - q: "How do you find the bottleneck in a value stream?"
    a: "Look for the step with the most work waiting in front of it, the longest wait in the lead time ladder and the highest utilisation. Then compare each cycle time with takt time. A step slower than takt cannot meet demand. If the signals point to different steps, check variation in cycle time, availability and quality."
---
Value stream analysis is the work you do after you draw a map: you read the current state map, find where time and effort are lost and choose the changes that matter most. This guide is for continuous improvement managers who have a map, or want to make one, and need a clear way to turn it into decisions. It gives eight steps, the metrics to check, a way to find the bottleneck and a worked example with simple numbers.

## What is value stream analysis?

A *value stream* is all the steps that turn a customer need into a delivered product or service. The method also fits a service workflow, but this article stays with manufacturing. [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) draws that flow on paper. Analysis reads the drawing.

The American Society for Quality (ASQ) describes value stream mapping as a lean tool that documents every step in a process and combines material flow with information flow and related data. According to its [value stream mapping tutorial](https://asq.org/quality-resources/value-stream-mapping), teams use it to find waste, shorten process cycle times and plan improvements on a lean journey. The ASQ page also warns about scope: start with a facility-level map first, so that you do not improve one area at the expense of another.

Value stream analysis answers four questions:

1. How long does a unit take from start to finish, and how much of that time is work?
2. Which step cannot keep up with customer demand?
3. Which steps add value, and which waste, such as waiting, stock or rework, costs the most time?
4. Which change should come first?

The word *lean* here means a management approach that aims for more customer value with fewer resources. The word *waste* means any activity or delay that the customer does not pay for. These short definitions are enough for the steps below.

## Which steps do you follow in a value stream analysis?

The steps below combine the ASQ tutorial with practical lean routines. Keep the order. Each step needs the result of the one before it.

1. **Choose one product family.** ASQ suggests a matrix of process steps against parts, with an X wherever a part goes through a step. Group the parts that share about 80 percent of their steps. Then rank the families by impact, for example by the effect on customers or on lead time and inventory.
2. **Gather data at the gemba.** *Gemba* is the Japanese word for the place where work happens. Observe, talk to the operators and collect cycle time, changeover time, first pass yield, inventory and queue times, as the ASQ tutorial lists.
3. **Draw the current state map.** Show the customer, the suppliers, the information flow, the material flow, and value-added and non-value-added time.
4. **Read the lead time ladder.** The *lead time ladder* is the line along the bottom of the map that compares waiting time with processing time. Add both. This tells you how much of the total time is work.
5. **Compare each cycle time with takt time.** *Takt time* is the pace at which you must finish a product to meet demand. You calculate it as available production time divided by customer demand.
6. **Find the bottleneck.** Use the signals in the next section.
7. **Mark the waste.** Note where work waits, where stock builds up, where parts are reworked and where information arrives late.
8. **Draw the future state and plan.** Ask where flow can improve, where queues can shrink and where the pace should be set. Then write a plan with an owner and a date for every change.

Draw the map and walk the flow with the people who run it. They can tell you why a step takes as long as it does.

## Which metrics matter most?

You do not need dozens of numbers. A short list is enough:

- **Cycle time.** The time one unit takes at one step.
- **Changeover time.** The time needed to switch a machine from one product to the next.
- **Queue time and inventory.** How long work waits and how much waits. Divide the pieces on hand by average daily demand to get days of supply.
- **Value-added and non-value-added time.** ASQ defines an activity as value-added only if the customer is willing to pay for it and it directly meets their requirements.
- **First pass yield.** The share of units that pass a step without rework.
- **Equipment availability.** The share of planned time a machine can run.

Record what you observe, not what the schedule or the system says. Kaizen Institute makes the same point in its guide on [bottleneck and capacity analysis in value stream maps](https://kaizen.com/insights/value-stream-mapping-bottleneck-capacity/): record what actually happens, and treat variation by shift or operator as a sign that the work is not yet standard.

## How do you find the bottleneck on the map?

The [bottleneck](https://www.m365.fm/entity/bottleneck/) is the step that limits how much work can pass through the flow. Kaizen Institute defines it as the process step whose capacity is lowest relative to demand. On a map it usually shows three signs:

- The **most work waiting** in front of the step.
- The **longest wait** on the lead time ladder.
- The **highest utilisation** of the step.

Then check the cycle times against takt time. A step whose cycle time is above takt time is running over capacity. The step with the largest gap is the confirmed bottleneck. If the three signs point to different steps, look for variation in cycle time, availability or quality. Variation can hide the real constraint.

This matters for the order of your actions, and it keeps you from trying to optimize every step at once. A minute saved at the bottleneck helps the whole flow, while a minute saved at a step with spare capacity may change nothing.

## Example: reading a current state map

This is an illustrative example with made-up numbers, not a measured case. A continuous improvement manager analyses one product family with four steps. Demand is 240 units per day. One day has 28,800 seconds of available time.

- **Takt time:** 28,800 ÷ 240 = **120 seconds**.
- **Cutting:** cycle time 40 seconds, stock in front 480 units.
- **Welding:** cycle time 150 seconds, stock in front 720 units.
- **Painting:** cycle time 90 seconds, stock in front 240 units.
- **Packing:** cycle time 60 seconds, no stock in front.

**Days of supply** are the stock divided by daily demand: cutting 480 ÷ 240 = 2 days, welding 720 ÷ 240 = 3 days, painting 240 ÷ 240 = 1 day. Waiting time is 2 + 3 + 1 = **6 days**, or 6 × 28,800 = 172,800 seconds. Processing time is 40 + 150 + 90 + 60 = **340 seconds**.

The share of time that is work is 340 ÷ (172,800 + 340) = 0.002, about **0.2 percent**. Waiting dominates.

Now compare the steps with takt time. Welding takes 150 seconds, which is 30 seconds more than takt. Its capacity is 28,800 ÷ 150 = **192 units per day**, but demand is 240. The shortfall is 240 − 192 = 48 units per day, or 20 percent of demand. Welding also has the most stock in front (720 units) and the longest wait (3 days). All three signs point to the same step, so welding is the bottleneck.

The first action is not to add stock or speed up cutting. It is to ask why welding takes 150 seconds, and what the operators do during that time. The manager goes to the welding station, counts how long loading, clamping and welding take, and asks the team what slows them down.

## Common mistakes

- **Analysing before you have clean data.** A map built from planned times hides the real delays. Observe first.
- **Mapping and analysing the whole plant.** Take one product family and finish the cycle.
- **Looking at cycle times only.** The lead time ladder usually shows that waiting is the larger problem.
- **Fixing the step that is easy, not the one that limits the flow.** Work on the bottleneck first, and streamline the steps around it afterwards.
- **Doing the analysis alone.** The team knows why work waits. Their answers turn numbers into causes.
- **Ending with a list of ideas.** Without an owner and a date for each action, the analysis changes nothing.

## How software can help

Data collection takes time, and maps go out of date when products and routings change. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Such a model can speed up the first reading of a map. The checks on the floor, and the discussion with the team, stay with you.

## Next step

Pick one product family, collect the cycle times and stock levels, and write down your takt time. Then run the eight steps of value stream analysis on that family before you plan any change.
