---
title: "What Is Value Stream Mapping? A Plain-English Guide"
summary: "What is value stream mapping? A plain-English guide for lean managers: what a value stream map shows, how to draw a current state map and plan a better flow."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, value-stream-mapping, takt-time]
keypoints:
  - "Value stream mapping is a paper-and-pencil method that draws every process step, the material flow and the information flow for one product family."
  - "A value stream map shows process boxes, data boxes, inventory between steps, information flow and a timeline that compares waiting time with working time."
  - "Draw the current state first by walking the real process. Map how work is done today, not how it was designed to be done."
  - "In most maps the work waits far longer than it is worked on. That gap is where the improvement ideas usually come from."
  - "A future state map describes the improved flow, and an action plan with owners and review dates turns it into change."
faq:
  - q: "What is value stream mapping in simple words?"
    a: "Value stream mapping is a lean method that draws how material and information move through a process, from customer order to delivery. You map one product family step by step, record key data for each step and add a timeline. The map makes waiting, stock and other waste visible so teams can improve the flow."
  - q: "Who created value stream mapping?"
    a: "The method comes from Toyota, where it was called material and information flow mapping. Mike Rother and John Shook turned it into a training tool and described it in the Lean Enterprise Institute workbook Learning to See. The workbook teaches managers to draw a current state map, find waste and design a leaner future state."
  - q: "What is the difference between process mapping and value stream mapping?"
    a: "A process map shows the steps of one process. A value stream map covers the whole flow of one product family across several processes. It includes information flow as well as material flow, and it adds data such as cycle time and inventory plus a timeline. This helps you see where work waits."
---
Value stream mapping is a lean method that draws every step a product passes through, from customer order to delivery, together with the flow of material and information. This guide is for lean managers who want to understand the method before they start. It explains what a value stream map shows, how to draw a current state map, how to plan a future state and which mistakes to avoid. A worked example with simple numbers shows how the timeline works.

## What is value stream mapping?

A *value stream* is all the work that turns a customer need into a delivered product. It includes the work that adds value and the work that does not, such as waiting, moving and checking. [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/), often shortened to VSM, is the method to draw that flow on one sheet of paper.

The Lean Enterprise Institute (LEI) describes the map in its workbook *Learning to See*. According to the [LEI page on the book](https://www.lean.org/store/book/learning-to-see/), a value stream map is a paper-and-pencil representation of every process in the material and information flow, together with key data. Unlike a process map or a layout diagram, it covers information flow as well as material flow. The authors are Mike Rother and John Shook.

The book's introduction says that Toyota used the method under the name "Material and Information Flow Mapping". It was a simple way to communicate. Rother and Shook built it into a training method. The introduction states the aim: to help people see flow, and to see waste and its sources. You can read it in the [introduction to Learning to See](https://www.lean.org/wp-content/uploads/2021/01/Learning-to-See-introduction.pdf).

The introduction also explains why teams map. The method ties together lean concepts that otherwise seem disconnected. It helps manufacturers think in terms of flow, not isolated process improvement at single machines. It also supports lasting continuous improvement, because it targets waste and the sources of waste, so the waste does not return. In practice this helps lean manufacturing teams streamline a workflow and reduce waste across a whole flow. A plant usually has several value streams, one for each product family, so you map value streams one at a time.

That gives you a short **value stream map definition**: a drawing of the whole flow of one product family, with the data you need to see where time is lost.

## What does a value stream map show?

Most maps use the same building blocks. Symbols differ a little between books and tools, so treat the list below as a general guide:

- **Customer box.** Shows who buys the product, how much they need and when.
- **Process boxes.** One box for each step of the flow, such as cutting, welding or assembly.
- **Data boxes.** Under each process box, a small table with key data. Typical entries are cycle time (how long one unit takes at that step), changeover time (how long it takes to switch from one product to the next) and defect rate.
- **Inventory triangles.** Show stock that waits between steps. Many maps convert the stock into days of supply.
- **Information flow.** Arrows that show how orders and schedules travel, for example from the customer to planning and from planning to each step.
- **Timeline.** A line along the bottom that compares waiting time with working time and adds up both.

Two ideas matter most. First, a VSM follows **one product family**, not the whole plant. A product family is a group of products that pass through similar steps. Second, the map shows **flow of information** next to the flow of material. Many delays come from the way orders and schedules reach the floor, not from the machines.

## How do you create a current state map?

The *current state map* of a VSM shows how work is done today. Gemba Academy, a lean training provider, stresses in its [guide to drawing a current state map](https://blog.gembaacademy.com/?p=533) that it should record how the process performs now, not how it was designed to work. To create a value stream map, follow these steps, in short:

1. **Pick one product family.** Choose a family with a clear customer and a stable set of steps.
2. **Calculate takt time.** [Takt time](https://www.m365.fm/entity/takt-time/) is the pace at which a product must be completed to meet customer demand. You calculate it as available production time divided by customer demand in the same period.
3. **Walk the process.** Go to the place where the work happens, which lean people call the *gemba*. Learn the flow and decide where the map starts and stops.
4. **Draw the customer box.** Add the demand and the takt time.
5. **Map from the end to the beginning.** Start at shipping and work back towards the first step. This keeps your attention on the customer.
6. **Add process boxes and data boxes.** Measure what you can on the spot. Collect missing figures later.
7. **Add inventory.** Count the stock between steps. Divide the pieces on hand by the average daily demand to get days of supply.
8. **Draw the information flow.** Note how orders and schedules travel.
9. **Add the timeline.** Sum the working time and the waiting time.

Use pencil and a large sheet of paper. A map on paper is easy to change, and a team can stand around it. Draw it with the people who run the value streams, because they know the steps that no document shows.

## What can you learn from the timeline?

The timeline turns the map into numbers. Two numbers matter. **Lead time** is how long a unit takes from the start of the flow to the end, including all waiting. **Value-added time** is the part of that time in which someone changes the product in a way the customer pays for. Divide value-added time by lead time and you get the share of time that adds value.

In most first maps the share is small, and much of the rest is non-value-adding time, such as waiting, extra moves and overproduction (making more than the next step needs). Work spends most of its time waiting between steps, and this hides inefficiency. That is why the Learning to See introduction talks about seeing waste and its sources: a machine can run fast while the order still waits for days in front of it.

## Example: a three-step flow with made-up numbers

This is an illustrative example with made-up numbers, not a measured case. A lean manager maps one product family with three steps. Customer demand is 200 units per day. One shift has 27,000 seconds of available time.

- **Takt time:** 27,000 ÷ 200 = **135 seconds** per unit.
- **Cutting:** cycle time 35 seconds. Stock in front: 600 units.
- **Machining:** cycle time 55 seconds. Stock in front: 400 units.
- **Assembly:** cycle time 80 seconds. Stock in front: 200 units.

First, convert the stock to days of supply by dividing it by daily demand:

- Cutting: 600 ÷ 200 = 3 days.
- Machining: 400 ÷ 200 = 2 days.
- Assembly: 200 ÷ 200 = 1 day.

Total waiting time is 3 + 2 + 1 = **6 days**. Value-added time here is the sum of the cycle times: 35 + 55 + 80 = **170 seconds**. If a working day has 27,000 seconds, then 6 days are 162,000 seconds. The lead time is about 162,170 seconds.

Now divide: 170 ÷ 162,170 = 0.00105, so about **0.1 percent** of the lead time adds value. Every step runs below the takt time of 135 seconds, so no machine limits the flow. The long wait comes from stock between steps. The manager's first question for the future state is therefore not "how do we make machines faster?" but "why does this much stock wait, and who decides when to release work?"

## How do you move to a future state?

The *future state map* shows the flow you want to reach. The introduction to *Learning to See* says that Toyota practitioners use such a map of an ideal state when they plan to install lean systems. For a first attempt, three questions help:

1. **What does the customer need, and when?** Match the pace of the flow to takt time.
2. **Where can work flow without waiting?** Look for steps that can connect directly, with a small, fixed amount of stock between them.
3. **Where should the plant plan production?** Choose one point in the flow that sets the pace, and let the other steps follow it.

The LEI page on the workbook says that readers learn to map the current state, find sources of waste, draw a leaner future state and plan the implementation, with regular progress reviews. Take the last part seriously. A map without actions is only a picture. Mark the areas for improvement on the map, and keep the list short. Write the actions down, give each an owner and a review date, and update the map when the flow has changed. A later article in this series covers future state design in detail.

## Common mistakes

- **Mapping the whole plant.** Start with one product family. A map of everything is unreadable.
- **Using planned times instead of observed times.** Measure what happens on the floor. Standard times hide the real delays.
- **Drawing the map alone.** The people who run the steps know why work waits. Map with them.
- **Skipping the information flow.** Many delays start with how orders and schedules are released.
- **Stopping at the picture.** Without an action plan, the map changes nothing.
- **Chasing a perfect map.** A rough map in pencil, drawn this week, beats a polished one drawn in two months.

## How software can help

Paper maps are quick and good for learning. They are harder to update when products, routings and demand change, and VSM tools can make that easier. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Whichever tool you use, the team still has to walk the process and discuss the map together.

## Next step

Choose one product family and draw a first current state map on paper this week, with the people who run it. A short session of value stream mapping with a pencil will show you more about your flow than another report.
