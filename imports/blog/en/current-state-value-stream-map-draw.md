---
title: "Current State Map: How to Draw a Value Stream Map That Is Right"
summary: "A current state value stream map shows how work flows today. Learn the symbols, process and data boxes and nine steps to draw a map that matches the floor."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, value-stream-mapping, takt-time]
keypoints:
  - "A current state value stream map records how material and information flow today, not how the process was designed to work."
  - "Each process step gets a process box with a data box underneath that holds cycle time, changeover time, operators and defect rate."
  - "Draw in pencil on a large sheet, walk the real process first and map from the end of the flow back to the start."
  - "Convert stock between steps into days of supply by dividing the pieces on hand by the average daily demand."
  - "Check the map on the floor and with the operators. A map is right when the people who run the process recognise it."
faq:
  - q: "What is a current state value stream map?"
    a: "A current state value stream map is a drawing of how material and information flow through one product family today. It shows each process step, the stock between steps, the way orders travel and a timeline of waiting and working time. Teams use it to see waste before they design a better flow."
  - q: "What goes in a data box on a value stream map?"
    a: "A data box sits under a process box and holds the key numbers for that step. Typical entries are cycle time, number of operators and changeover time, plus defect rate. Teams often add equipment uptime or first pass yield. Measure these values on the floor instead of copying planned times from the system."
  - q: "Where do you start when you draw a current state map?"
    a: "Start at the customer. Draw the customer box with demand and takt time, then work backward from the end of the process towards the first step. Walk the real flow first, so that you know where the map starts and stops. Map the material flow first, then stock, then information flow and the timeline."
---
A current state value stream map shows how material and information flow through one product family today, step by step, with the data you need to see where time is lost. This guide is for continuous improvement managers who need to draw such a map and want it to match the shop floor. It explains the symbols, what goes into process boxes and data boxes, nine steps to draw the map and a way to check that it is right. A worked example with simple numbers shows the timeline.

## What is a current state value stream map?

A *value stream* is all the steps that turn a customer need into a delivered product or service. A plant usually has several value streams, one for each product family. [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/), or VSM, draws that flow on paper. The *current state* map is the first drawing in the method. The Lean Enterprise Institute describes the method in its workbook *Learning to See*. According to the [LEI page on the book](https://www.lean.org/store/book/learning-to-see/), readers map the current state, find sources of waste and then draw a leaner future state. The future state map comes later and builds on the current one, so a wrong current state leads to a wrong plan.

The current state map is a record of the current process, not a plan. It is the starting point for process improvement in any manufacturing process. Gemba Academy, a lean training provider, stresses in its guide to [creating a current state map](https://blog.gembaacademy.com/2008/02/24/lets-create-a-current-state-value-stream-map/) that the map should show how the process performs now, not how it was designed to work. If you draw the design, you will map the plan and miss the problem.

## Which symbols do you need?

Value stream maps use a small set of symbols. Books and software tools differ a little in their VSM symbols, so treat the list as a common core. The descriptions follow the Gemba Academy guide:

- **Customer box.** A box at the top right of the map. Write the demand per month or per day and the takt time in it. [Takt time](https://www.m365.fm/entity/takt-time/) is the pace at which you must complete a product to meet customer demand.
- **Process box.** One box for each step of the flow.
- **Data box.** A small table under each process box with key figures for that step.
- **Inventory triangle.** A triangle with the letter "I". Write the number of pieces waiting between two steps under it.
- **Push indicator.** A dashed line through the triangle shows a step that pushes work forward whether the next step needs it or not.
- **Information flow arrows.** A straight arrow marks manual communication, such as a printed schedule. A lightning-bolt arrow marks electronic communication.
- **Production control box.** A box, often labelled with a planning system such as MRP, that sends schedules to the process steps.
- **Timeline.** A saw-tooth line along the bottom that separates value-added time from waiting time.

The exact look matters less than a shared meaning, and every symbol should add value for the reader. Drop any symbol that you do not need. Agree on the symbols with your team before you start and use them in the same way on every map.

## What goes into process boxes and data boxes?

The process box names the step, for example "Welding". Keep the names short and use the words the operators use.

The data box holds the numbers. The Gemba Academy guide lists cycle time, the number of operators and changeover time, and it mentions defect rates as follow-up data. *Cycle time* is how long one unit takes at that step. *Changeover time* is the time between the last good unit of one product and the first good unit of the next. The American Society for Quality (ASQ) lists a similar set in its [value stream mapping tutorial](https://asq.org/quality-resources/value-stream-mapping): cycle time, changeover time, first pass yield, inventory and queue times.

Add wait times between the steps, because waiting is where most of the lead time hides. Each figure is a metric that must be measured, not guessed. Three rules keep the data honest:

1. **Measure at the gemba.** *Gemba* is the Japanese word for the place where the work happens. Time the steps yourself or with the operators. Planned times from the system often hide the real delays.
2. **Use the same unit everywhere.** Seconds for cycle time and days for stock keep the timeline clear.
3. **Record what you could not measure.** Write "estimate" next to a guessed value and collect the real number later.

## How do you draw the map, step by step?

Use pencil, a large eraser and a large sheet of paper for your value stream map. Gemba Academy remarks that the best maps have eraser marks all over them. The order below follows its guide, with one reminder added at the end:

1. **Calculate takt time.** Divide the available production time by the customer demand in the same period.
2. **Walk the process.** Follow the production process from the first step to shipping. Learn the flow and decide where the map starts and where it stops.
3. **Draw the customer box.** Add demand and takt time.
4. **Start at the end of the process and work backward.** This keeps your attention on the customer.
5. **Map the material flow.** Draw the process boxes and fill in the data boxes.
6. **Add inventory.** Count the pieces between the steps. Divide them by the average daily demand to get days of supply. Mark a push step with a dashed line.
7. **Draw the information flow.** Show how the customer's orders reach planning and how planning sends schedules to each step.
8. **Add the timeline.** Add up the value-added time and the waiting time. Divide value-added time by total lead time to get the *process cycle efficiency*, the share of time that adds value.
9. **Take on a small scope.** Gemba Academy advises not to attempt too much. One product family is enough for a first value stream map.

## How do you check that the map is right?

A value stream map can look neat and still be wrong, and a wrong map sends the future state in the wrong direction. These checks help:

- **Walk the flow again with the map in your hand.** Does each box exist? Does the stock you drew match what you can see?
- **Ask the operators to read it.** If they say "that is not how we do it", you have mapped the plan. Change the map, not their answer.
- **Compare two shifts.** If cycle times differ a lot, note the range and ask why.
- **Check the arithmetic.** Days of supply, total waiting time and lead time should add up. The map should help you identify waste and eliminate waste step by step, not hide it in rounded numbers.
- **Check the boundaries.** The map should start with the customer and end where the product leaves, with no gaps.

## Example: a small current state map with made-up numbers

This is an illustrative example with made-up numbers, not a measured case. A continuous improvement manager maps one product family with three steps. Customer demand is 150 units per day. One day has 25,200 seconds of available time.

- **Takt time:** 25,200 ÷ 150 = **168 seconds**.
- **Press:** cycle time 30 seconds, one operator, stock in front 600 units.
- **Weld:** cycle time 60 seconds, two operators, stock in front 300 units.
- **Assembly:** cycle time 110 seconds, three operators, stock in front 75 units.

The planning system sends a weekly schedule to all three steps by electronic message, so each step produces to its own schedule. That is a push flow, and the manager draws a dashed line through each inventory triangle.

Days of supply: press 600 ÷ 150 = 4 days, weld 300 ÷ 150 = 2 days, assembly 75 ÷ 150 = 0.5 days. Waiting time is 4 + 2 + 0.5 = **6.5 days**. One day has 25,200 seconds, so 6.5 days are 6.5 × 25,200 = 163,800 seconds. Value-added time is 30 + 60 + 110 = **200 seconds**.

Process cycle efficiency is 200 ÷ (163,800 + 200) = 200 ÷ 164,000 = 0.0012, about **0.12 percent**. All cycle times are below the takt time of 168 seconds. So the long lead time does not come from slow machines. It comes from the stock that the push schedule builds up between the steps. That is the kind of inefficiency in the workflow that lean manufacturing teams try to optimize first.

The manager checks this on the floor. She counts the pieces in front of each step on two different days. The counts are close to the map, so the map is right enough to analyse. She marks the push schedule as the first area for improvement and plans a small kaizen (a small, practical improvement step) to eliminate waste in the form of excess stock. No step is slower than takt, so she has no bottleneck to identify yet.

## Common mistakes

- **Mapping the design, not the reality.** Walk the process and measure it.
- **Drawing the map in a meeting room.** The floor shows delays that no one mentions.
- **Mixing product families.** One family per value stream map keeps the flow clear, and it keeps the value streams apart.
- **Skipping the information flow.** The way schedules reach the floor often explains the stock.
- **Chasing detail.** A rough pencil map drawn today beats a perfect one in two months.
- **Drawing the value stream map alone.** Operators know what the numbers hide, and they help you improve the process.

## How software can help

Paper maps are fast and good for learning, but they are hard to update when products, routings and demand change. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Whatever tool you use, someone still has to walk the flow and check that the map matches the floor.

## Next step

Choose one product family, walk its flow and draw a first current state value stream map in pencil this week. Then take the map to the operators and ask them what is missing.
