---
title: "Future State Map: How to Design a Better Value Stream"
summary: "A future state value stream map shows the flow you want to run. Learn six design guidelines, five steps, takt time, pull and pitch, with a worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, polaris-simulator, value-stream-mapping, takt-time]
keypoints:
  - "A future state value stream map is the target picture of the flow you want to run. A current state map without one is not much use."
  - "Design from the customer: produce to takt time, create continuous flow where you can and use supermarkets for pull where you cannot."
  - "Schedule one process only, the pacemaker, and let the upstream steps follow it through pull signals."
  - "Level the mix at the pacemaker and release work in small, steady increments called pitch."
  - "A map is only a picture. Turn it into a one-page implementation plan with owners and dates, and draw a new map after each improvement."
faq:
  - q: "What is a future state value stream map?"
    a: "A future state value stream map is a drawing of the improved flow you want to reach. It builds on the current state map and shows how material and information should move: produced to takt time, in continuous flow where possible, with pull signals elsewhere and one scheduled process. It guides the implementation plan."
  - q: "How do you design a future state value stream map?"
    a: "Compare each cycle time with takt time, decide whether to build to stock or make to order, create continuous flow with the right crew size, add pull with supermarkets and kanban where flow is not possible, and schedule one pacemaker process. Then write a one-page plan with owners and dates."
  - q: "What is the difference between a current state and a future state map?"
    a: "The current state map records how material and information flow today, drawn from observation on the floor. The future state map shows the target flow you design from it. The first shows where waste sits, and the second shows how to remove it. Both are needed, and a new future state follows each improvement."
---
A future state value stream map is a drawing of the improved flow you want to run: how material and information should move once you have removed the waste you found on the current state map. This guide is for lean managers who have a current state map and need a clear way to design the target state. It gives six design guidelines, five design steps, a way to turn the map into a plan and a worked example with simple numbers.

## What is a future state value stream map?

A *value stream* is all the steps that turn a customer need into a delivered product or service. [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) draws it on paper, first as it is and then as it should be. The workbook *Learning to See* from the Lean Enterprise Institute (LEI) is clear about the order of importance. In its [first part](https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-part1.pdf), it says the future state is the design goal and matters most. It also says that a current state without a future state is not much use. The two drawings overlap in practice, because ideas for the future state often show up while you map the current one. The workbook estimates about two days to reach a usable future state map.

The map is also called a *target state* map, or target state VSM. It does not show a perfect plant. It shows the next realistic step, with an implementation plan behind it. The map follows the same methodology as the current state map, so you can lay the two value stream maps side by side. Once you have made improvements, you draw a new future state map. This is how VSM supports continuous improvement: each map starts the next cycle. For lean manufacturing teams, the map also helps to visualize the target, so that everyone works towards the same picture. A plant usually has several value streams, one for each product family, so you design one value stream at a time. Do not mix value streams on one value stream map.

## Which design guidelines should you follow?

LEI describes six guidelines in its article [6 guidelines for moving toward a lean value stream](https://www.lean.org/the-lean-post/articles/6-guidelines-for-moving-toward-a-lean-value-stream/). They work as lean design principles for the target state:

1. **Produce to takt time.** [Takt time](https://www.m365.fm/entity/takt-time/) is the pace of production set by customer demand. It equals the available production time divided by the customer demand in the same period.
2. **Develop continuous flow wherever possible.** Each step finishes one unit and passes it on right away, without creating stock between the steps.
3. **Use supermarkets where continuous flow does not reach upstream.** A *supermarket* is a set stock of standard inventory kept near the process. A batch step is linked to its downstream customer through a pull system, so a separate schedule does not drive it.
4. **Send the customer schedule to only one process.** With pull in place, you usually schedule one point, called the *pacemaker*. Its pace sets the rhythm for the upstream steps.
5. **Level the production mix at the pacemaker.** *Heijunka* is the Japanese word for levelling. Instead of long runs of one product, you spread the products evenly over time. Long runs lengthen lead times and swell stock.
6. **Create an initial pull through paced withdrawal.** Release and withdraw small, steady amounts of work at the pacemaker. That steady amount is the *pitch*, and it is calculated from takt time and the pack-out quantity.

Together, the guidelines reduce waste, shorten wait times and add value for the customer in the production process. They also give the workflow between steps a clear rule.

LEI gives an example for the pitch: with a takt time of 30 seconds and a pack-out quantity of 20 pieces, the pitch is 10 minutes.

## How do you design the map in five steps?

Gemba Academy, a lean training provider, describes a similar order in its guide to [creating a future state map](https://blog.gembaacademy.com/2008/02/26/lets-create-a-future-state-value-stream-map/). The steps below follow it:

1. **Compare cycle times with takt time.** Draw a simple graph with each step's cycle time and the takt time. Steps above takt time cannot meet demand. This also helps identify waste and the bottleneck of the current state.
2. **Decide: build to stock or make to order.** A finished goods supermarket suits many products and unreliable forecasts. Make to order suits stable demand with few products.
3. **Calculate the crew size and design continuous flow.** Divide the total cycle time by takt time to get the number of operators. Then design a cell, for example in a U shape, so that each unit moves from step to step.
4. **Add pull where flow is not possible.** Use kanban cards between a supermarket and the upstream steps. Withdrawal cards trigger shipments, and production cards trigger replenishment.
5. **Schedule the pacemaker.** Pick the one process that receives the schedule, typically the step closest to the customer, and let the upstream steps respond through pull.

Do not try to optimize every step at once, because the aim is to streamline the whole flow. The map helps identify which changes come first. Waiting and stock are the main inefficiency, so look there. A target state with three clear changes beats one with twelve.

## How do you turn the map into a plan?

A picture changes nothing on its own. According to *Learning to See*, a one-page implementation plan guides the change, and a new future state map follows each improvement. Use these elements:

- **Each change as a project.** Treat it as a process improvement and name it, such as "cell for cutting, welding and painting".
- **An owner and a date** for each project.
- **A metric** such as lead time, stock level or the share of on-time orders, so that you can see whether the change worked.
- **Regular reviews.** Walk the flow, compare it with the map and update the plan.

Keep the first steps small and near the customer. Many teams bring a cross-functional team together for this, with the people from planning, production and quality in the room. A change that frees stock and shortens lead time in a few weeks builds support for the next one.

## Example: from six days of waiting to a cell and a supermarket

This is an illustrative example with made-up numbers, not a measured case. A lean manager has a current state map with four steps: cutting 30 seconds, welding 70 seconds, painting 45 seconds and packing 25 seconds. Customer demand is 200 units per day. One day has 27,000 seconds of available time.

- **Takt time:** 27,000 ÷ 200 = **135 seconds**.
- **Total cycle time:** 30 + 70 + 45 + 25 = **170 seconds**.
- **Current stock:** 600 units before cutting, 400 before welding and 200 before painting, which is 3 + 2 + 1 = **6 days** of waiting.

Every cycle time is below takt time, so no single step limits the flow. The waiting comes from stock and push scheduling.

The manager designs the target state:

- **Crew size:** 170 ÷ 135 = 1.26, so a cell with **2 operators**. Each operator has about 85 seconds of work (170 ÷ 2), which is 63 percent of takt time.
- **Continuous flow:** cutting, welding, painting and packing form one cell. A maximum of 10 units may wait between steps. Three gaps give 30 units, or 0.15 days.
- **Supermarket:** a finished goods supermarket of 200 units, which is 1 day of supply.
- **Pitch:** with a pack-out quantity of 20 units, the pitch is 135 × 20 = 2,700 seconds, or **45 minutes**.

The planned waiting time is 1 + 0.15 = 1.15 days, or 1.15 × 27,000 = 31,050 seconds. The value-added time stays at 170 seconds. So the share of time that adds value moves from 170 ÷ (162,000 + 170) = 0.1 percent to 170 ÷ (31,050 + 170) = 0.5 percent. Lead time falls from 6 days to about 1.15 days, a reduction of 81 percent on paper.

These are targets, not results. The manager writes them into the plan, names an owner for the cell and sets a date to check the stock on the floor.

## Common mistakes

- **Designing the future state without a true current state.** Walk the process first, keep the current state value stream map in hand and integrate lessons from the floor into each new version.
- **Drawing an ideal plant.** Aim for the next step you can implement in a few months.
- **Scheduling every process.** Send the customer schedule to one process and let pull do the rest.
- **Ignoring product mix.** Without levelling, a pull system jumps between large and small orders.
- **Stopping at the map.** Write the plan, name owners and set review dates.
- **Skipping the team.** The people at the line know which cell layout can work.

## How software can help

A model can check a target state before you build it. [iFAKT's Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) is a module of iFAKT Polaris that tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module for data-based value stream mapping that models material and information flows collaboratively. Your team still decides which design to run.

## Next step

Take your current state map, compare each cycle time with takt time and sketch the cell, the supermarket and the pacemaker. Then write a one-page plan so that your future state value stream map leads to action.
