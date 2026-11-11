---
title: "Lead Time Reduction in Manufacturing: 10 Levers From the Value Stream"
summary: "Lead time reduction in manufacturing starts with queues, not machines. Ten levers from WIP caps to quick changeovers, plus an invented worked example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, polaris-optimizer, bottleneck, kanban]
keypoints:
  - "Lead time reduction in manufacturing mostly means removing waiting: a Kaizen Institute page (a vendor) states that queue time accounts for most of total lead time."
  - "Little's Law links the three numbers: lead time equals work in process divided by throughput, so halving work in process halves lead time if throughput holds."
  - "Ten levers, in a sensible order: find the constraint, cap work in process, cut batch size, speed up changeovers, pull, level, cut handoffs, fix rework, shorten supplier lead times, keep standard work."
  - "One practitioner in a Lean Enterprise Institute ebook cut a changeover from 10 hours to 30 minutes, which allows smaller batches without losing capacity."
  - "Measure the whole stream, from order to delivery, and compare lead time with value-creating time to see how much of it is waiting."
faq:
  - q: "How do you reduce manufacturing lead time?"
    a: "Reduce waiting first. Find the constraint, cap the work in process, cut batch sizes, shorten changeovers and release orders in a steady rhythm. Because lead time equals work in process divided by throughput, lowering the work in process shortens lead time if output stays the same. Work on one product family at a time and measure the whole order-to-delivery flow."
  - q: "What is the difference between lead time and cycle time?"
    a: "Lead time is the total time from order or release to delivery, including waiting. Cycle time is the time one step takes to process one unit. A stream can have short cycle times and a long lead time, because the product waits in queues between steps. Lead time reduction usually targets those queues, not the machines."
  - q: "What is Little's Law in manufacturing?"
    a: "Little's Law says that in a stable system, lead time equals work in process divided by throughput. With 200 units in process and 10 shipped per day, lead time is 20 days. Capping work in process at 50 with the same throughput gives 5 days. It is a rule of thumb, so check that your stream is stable before you rely on it."
---

Lead time reduction in manufacturing means shortening the time from customer order to delivery, and most of that time is waiting, not work. Shorter lead times also help customer satisfaction and cash flow. This article is for plant leaders who want a short list of levers they can test in one product family. It defines the terms, shows the simple law that links lead time to inventory, gives ten levers in a practical order, and walks through an invented example with numbers.

## How does lead time reduction work?

Lead time is the total time an order or a unit spends in the system, from release or order to delivery. Cycle time is different: it is the time one step needs to process one unit. A stream can have short cycle times and a long lead time, because the product waits between steps. That waiting is called queue time.

A Kaizen Institute page on [reducing work in process and lead time](https://kaizen.com/insights/reduce-wip-manufacturing-lead-time/) states that queue time accounts for most of the total lead time. The page is from a consulting firm, so treat it as a vendor view. It matches what many value stream maps show: the value-creating time is a small share of the lead time.

The link between waiting and inventory is Little's Law. [LearnLeanSigma explains it](https://www.learnleansigma.com/lean-manufacturing/littles-law-explained-formula/) as lead time equals work in process divided by throughput in a stable system. Its bicycle line example has 200 bikes in process and 10 shipped per day, so lead time is 20 days. Capping work in process at 50 with the same throughput gives 5 days.

The practical message is simple. If you want to reduce lead time, you have two ways: less work in process or more throughput. Reducing lead time in the right place also cuts costs, because inventory ties up cash. The ten levers below do one or the other.

## What are the ten levers?

The order matters. Start with the first three, because they protect the others.

1. **Find the real bottleneck.** It is the step that limits the output of the whole stream. Measure before you change anything, because improving a step that is not the [bottleneck](https://www.m365.fm/entity/bottleneck/) only moves waiting somewhere else. The Kaizen Institute page also puts this first.
2. **Cap work in process.** A visible limit stops the stream from filling with started but unfinished orders. Tools include [kanban](https://www.m365.fm/entity/kanban/) cards, CONWIP (constant work in process, one total limit for the whole line) and first-in-first-out lanes. Kanban is a Japanese word for signal card. Choose the tool by product mix.
3. **Measure the whole flow.** Track lead time from order to delivery, not only machine time. The gap between lead time and value-creating time shows how much is waiting.
4. **Cut batch sizes.** A batch of 500 means the last piece waits for 499 others. Smaller batches shorten the queue in front of each step, but only if changeovers allow them.
5. **Speed up changeovers.** SMED stands for single-minute exchange of dies, a method to cut changeover time. In an LEI ebook on value stream mapping, a practitioner reports cutting a changeover [from 10 hours to 30 minutes](https://email.lean.org/hubfs/ebook%20files/eBook-Top5-VSM-final.pdf). This is one practitioner's result, not a promise.
6. **Pull instead of push.** Release work when the next step needs it, not when the plan says so. Pull links release to real consumption.
7. **Level the schedule.** Release orders in a steady rhythm of small lots. Weekly waves of orders create queues on Monday and idle time on Friday.
8. **Reduce handoffs and approvals.** Orders also wait in offices: for a release, a signature or a missing drawing. Map the information flow and remove steps that only pass work along.
9. **Fix rework and scrap.** Every rework loop adds a trip through the stream. Raise first pass yield at the steps that cause the most loops.
10. **Shorten supplier lead times and keep standard work.** Material that arrives late stops the stream, so involve key suppliers and review your own forecast accuracy. Then write the new way of working down as standard work, so that gains do not erode.

## Which lever first?

Use a simple rule of my own. Ask three questions in this order:

- Is the stream filled with unfinished work? Then cap work in process.
- Is the first step of the stream waiting for changeovers? Then work on setup time and batch size.
- Is the lead time long even with little work in process? Then look at the information flow and at suppliers.

Do not try all ten at once. Change one thing, measure for two to four weeks, and keep what works.

## Example: from 15 days to 6, invented numbers

This example is invented. The numbers are not from a real plant.

A product family has 1,500 units in process and ships 100 units per day. By Little's Law, lead time is 1,500 divided by 100, or 15 days. A value stream map shows 0.5 days of value-creating time, so the value-creating share is 0.5 divided by 15, about 3 percent.

The team makes three changes, one after the other, and assumes throughput stays at 100 units per day:

- **Cap work in process at 1,000 units.** Lead time is 1,000 divided by 100, or 10 days.
- **Cut the changeover at the constraint from 3 hours to 1 hour and halve the batch from 500 to 250.** Work in process drops to 700 units, so lead time is 7 days.
- **Release orders daily instead of weekly.** Work in process settles at 600 units, so lead time is 6 days.

Lead time falls from 15 days to 6, a cut of 60 percent. The value-creating share rises to 0.5 divided by 6, about 8 percent. If a unit in process carries 40 in material and labour, work in process falls from 60,000 to 24,000, which frees 36,000 in cash. The team still has to prove that throughput holds, and a falling output would show the cut was too deep.

## How do suppliers and the supply chain affect lead time?

Your own plant is only part of the picture. Material that arrives late stops the stream, whatever the plant does. The customer's total wait includes the time to get material, so look at it at the edge of your map: how long does an order for a key part take, and how reliable is that time?

These are general practices, not findings from a source I opened:

- **Share your forecast with key suppliers.** A reliable forecast lets them hold the right material and shorten the delivery of goods to you.
- **Agree on frequent, small deliveries** for fast-moving parts, so that you can cut inventory management effort and holding costs.
- **Compare nearby and distant suppliers** on lead time and its variation, not only on price. A short, steady delivery time can lower the safety stock you need.
- **Track supplier delivery performance** as a KPI, and discuss it in the review.

Supply chain thinking also shows a limit. If you cut your own lead time to six days but a key part takes six weeks, the order-to-delivery time stays long. Decide which part families you stock and which you order to demand, and say so on the map.

## Common mistakes

- **Pushing machines to run faster.** Cycle times are rarely the problem; queues are.
- **Improving a step that is not the constraint.** The queue only moves.
- **Cutting batches without cutting changeovers.** Capacity drops and the constraint gets worse.
- **Measuring only part of the flow.** A short shop floor time can sit inside a long order-to-delivery time.
- **Forgetting suppliers and offices.** Waiting for material and approvals counts as lead time.
- **Trying ten levers at once.** You cannot tell which one worked.

## How software can help

Finding the constraint and the queues needs data on orders, steps and times. Tools can help streamline the analysis and automate the data collection, but automation of a poor flow only speeds up the inefficiency. Planning rules also decide how much work waits: a schedule that ignores capacity creates the queues you want to remove.

iFAKT's [Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible, so you can reduce costs from waiting where they arise. iFAKT's [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities.

## Next step

Lead time reduction starts with one product family and one honest number: the lead time from order to delivery. This week, measure it, compare it with the value-creating time, and pick the first lever from the list above.
