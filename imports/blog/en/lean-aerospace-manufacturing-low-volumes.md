---
title: "Lean in Aerospace Manufacturing: What Works at Low Volumes"
summary: "Lean aerospace manufacturing works at low volumes when you level demand, group part families and cut changeovers. A practical guide for plant managers."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [aerospace, smed, takt-time, ifakt]
keypoints:
  - "Lean works at low volumes in aerospace, but the tools must be adapted: takt time is counted in days, and part families replace one product line."
  - "Every Part, Every Interval (EPEI) replaces push scheduling with a fixed cycle per part number, so small lots flow through a cell in a steady rhythm."
  - "Shorter changeovers make small lots affordable; one published machine shop cut changeovers from 30 minutes to two or three minutes."
  - "Published results come from single parts in single plants, so treat them as examples of what is possible and not as promises."
  - "Start with one part family: group the part numbers, level the demand, set a fixed interval and shorten the changeovers."
faq:
  - q: "Does lean work in aerospace with low volumes?"
    a: "Yes, but not in the form used for high-volume lines. Published cases show that part families, cells, fixed production intervals and shorter changeovers work with a few hundred units per year. Standard tools such as takt time and kanban need to be adapted, and the effort is plant-wide, not only a shop floor project."
  - q: "What is Every Part, Every Interval?"
    a: "Every Part, Every Interval, or EPEI, is a scheduling method in which each part number is produced on a fixed cycle with a fixed lot size, instead of being pushed into the cell in large batches. The interval can shrink as changeovers get shorter, because smaller lots become affordable. Demand is reviewed on a regular basis."
  - q: "How do you set takt time with low volumes?"
    a: "Divide the available production time by the customer demand in the same period. With a few hundred units a year, the result is often one unit per day or per week, so takt time is counted in days. Use it to pace the cell and to compare the actual rhythm with demand, not to force a fast line."
---

Lean aerospace manufacturing works at low volumes when you level demand, group part numbers into families and make changeovers short enough to run small lots. This article is for plant managers of aerospace manufacturers and aviation suppliers who hear that lean manufacturing belongs to car plants. You will learn which tools carry over, what published cases show, how to calculate a simple example and how to start with one part family.

## What does lean aerospace manufacturing mean at low volumes?

In a car plant, lean often means a paced line that makes the same product thousands of times. Aerospace parts look different. The industry is defined by strict quality, traceability and certification requirements, and a typical plant makes many part numbers in small quantities. The [aerospace](https://www.m365.fm/entity/aerospace/) industry therefore calls this a high-mix, low-volume setting, and aerospace production rarely fits a paced line.

An MIT thesis on lean in a high-mix, low-volume aerospace facility in France gives a useful warning. Its abstract says that many companies in this setting continue to struggle with implementation, and it questions the relevance of some widely accepted lean tools there. It also concludes that lean here is an enterprise-wide process that depends on a lean culture which uses the tacit knowledge of the people who know the complex products. See the [MIT thesis record](https://dspace.mit.edu/handle/1721.1/34795).

So the aim is not to copy the automotive playbook or the Toyota Production System in every detail. The lean principles stay the same: reduce waste, improve flow and shorten lead times. What changes is how you apply these lean practices in your production system.

## Which lean tools carry over to low volumes?

Several tools carry over if you adapt them.

1. **Part families and cells.** Group part numbers that use the same machines and similar routings. Dedicate machines to the family, so that the work has a clear home.
2. **Leveled demand and a fixed interval.** Instead of pushing large batches into the cell, produce every part number on a fixed cycle. This is called Every Part, Every Interval, or EPEI.
3. **Shorter changeovers.** Small lots only make sense if setups are short. [SMED](https://www.m365.fm/entity/smed/) is the method for this: it separates the work that needs a stopped machine from the work that can be done while the machine runs, then simplifies both.
4. **FIFO lanes instead of one queue.** A lane per part number in front of each machine keeps the order clear and limits work in process. A kanban card or a simple signal can tell the operator what to make next.
5. **Standard work.** Written instructions let an operator move between part numbers with fewer errors.
6. **Takt time in days.** [Takt time](https://www.m365.fm/entity/takt-time/) is the available production time divided by the customer demand in the same period. With a few hundred units a year, takt may be one unit per day or even per week. It is still useful, because it shows how far the real rhythm is from demand.

Value stream mapping fits the start of the work. A map of one part family, with its queues and handoffs, shows where lead times are lost and which machine is the bottleneck before you change anything.

## What do published cases show?

Two trade articles, each a short case study from the aerospace industry, describe plants that use these lean manufacturing tools. Both come from a few plants, so read them as examples and not as benchmarks.

**A helicopter machine shop.** The Lean Enterprise Institute describes the Sikorsky machine shop in Stratford. The shop replaced MRP push scheduling, which had sent batches of up to 70 forgings into a cell, with EPEI. Seven spindle and cuff part numbers were grouped into one family, and four of six milling machines were dedicated to it. Each part number had its own FIFO lane, and setup reduction cut changeovers from 30 minutes to two or three minutes. The interval started at five days and fell to three and then two as changeovers shrank. For one Black Hawk spindle, the article reports a lead time cut of 73 percent and a changeover cut of 90 to 93 percent. The figures come from one part number in one plant. See the [Lean Enterprise Institute article](https://www.lean.org/the-lean-post/articles/the-backbone-of-lean-in-the-back-shops/).

**A gearbox supplier.** Assembly magazine describes Aero Gear, a maker of accessory gearboxes for jet engines. The company builds each gearbox in its own U-shaped cell, with components staged in shadow boxes. It moved from departments to equipment lined up in process sequence, with small batches of about 20 pieces. One flow line may handle about 100 part numbers. Output is a couple hundred gearboxes per program per year, so takt time differs sharply from automotive plants. See the [Assembly magazine article](https://www.assemblymag.com/articles/94385-lean-high-tech-help-aerospace-supplier-compete).

The common thread is not speed. It is a stable rhythm, small lots and clear ownership of a part family. These cases are close to cellular manufacturing: a family of parts, dedicated machines and a clear flow.

## Where do standard lean tools need care?

Some tools do not fit without changes. The MIT thesis questions the relevance of some widely accepted tools in complex high-mix, low-volume environments, and the experience of plants points to a few typical cases.

- **Pure pull systems.** If demand for a part is one unit every few weeks, a kanban loop is hard to size. A fixed interval with a defined lot size often works better, and a card can still signal the next job.
- **One-piece flow on every route.** Parts that share machines but follow different routings cannot all flow in a straight line. Use lanes and a clear sequence rule.
- **Zero idle time.** In a low-volume cell, machines accept some idle time, because the interval absorbs differences in cycle times.
- **Skipping the quality system.** Changes to a certified process need the usual approvals. Plan the lean change together with quality, and keep traceability intact.

The aerospace supply chain also deserves attention. A cell with a stable rhythm still stops if a supplier delivers a forging late. Share the schedule with your suppliers and track their delivery against it.

## Which metrics show that lean is working?

Pick a few metrics before you start, and measure them the same way every week:

- **Lead times** from order release to finished part, by part family.
- **Changeover time** on the bottleneck machine.
- **Schedule adherence**, meaning actual against planned run time.
- **Work in process** in front of each machine.
- **On-time delivery** to the customer, and first-pass quality.

These metrics keep continuous improvement and operational excellence work honest: if lead times do not fall, the change has not worked yet.

## Example: leveling eight part numbers

This example uses assumed numbers.

A cell makes 8 part numbers. Total demand is 20 pieces per day, which is 2.5 pieces per part number on average. The average run time is 12 minutes per piece, and the available time is 450 minutes per day.

**Run time per day.** 20 × 12 = **240 minutes**. That leaves 450 − 240 = **210 minutes** per day for changeovers and other losses.

**Before.** Each changeover takes 30 minutes. If every part number runs once per interval, the cell needs 8 × 30 = 240 minutes of changeover per interval. Over X days, the time needed is 240 × X for running plus 240 for changeovers, and the time available is 450 × X. Solving 240 × X + 240 ≤ 450 × X gives X ≥ 240 ÷ 210 = 1.14, so the shortest whole interval is **2 days**. Each part number runs once in 2 days with an average lot of 5 pieces.

**After setup reduction.** Each changeover takes 10 minutes, so the interval needs 8 × 10 = 80 minutes. Now 240 × X + 80 ≤ 450 × X gives X ≥ 80 ÷ 210 = 0.38, so the interval can be **1 day**. Check: 240 + 80 = 320 minutes, which is below 450. The average lot falls to 2.5 pieces, and the work waiting in front of the machines is about half.

The numbers are made up, but the logic is general: the shorter the changeover, the shorter the interval. The remaining 130 minutes per day are a reserve for rush jobs and variation.

## How do you start in your plant?

1. **Pick one part family** with shared machines and stable demand, not the most difficult part.
2. **Map the value stream** of that family and note the lead time and where it is spent.
3. **Level the demand.** Take the last months of orders and calculate the average per part number per day.
4. **Dedicate the machines** and set up one FIFO lane per part number.
5. **Shorten the changeovers** on the bottleneck machine first, with the operators who run it.
6. **Set a fixed interval** and a lot size per part, and run it for several weeks.
7. **Write standard work** for the changeovers and the main operations.
8. **Review regularly.** Check demand, lot sizes and the interval, and use the findings for continuous improvement.

## Common mistakes

- **Copying the automotive playbook.** A line designed for thousands of identical parts does not fit a plant with hundreds of part numbers.
- **Starting plant-wide.** Lean is an enterprise-wide effort, but you still prove the method on one family first.
- **Cutting inventory too early.** Without a stable interval and reliable setups, less stock means missed deliveries.
- **Ignoring the people with the tacit knowledge.** Setup and machining experts know the real constraints.
- **Treating one published result as a benchmark.** A 73 percent lead time cut on one part says little about your plant.
- **Forgetting quality and certification.** A change that breaks traceability is not an improvement, in any lean transformation.

## How software can help

Low-volume plants have many part numbers and shared machines, so spreadsheets reach their limit quickly. [iFAKT](https://www.m365.fm/entity/ifakt/) is a Stuttgart-based consulting company and software specialist for Industry 4.0, founded in 2001, that helps manufacturers plan and optimize production and logistics processes. It is the developer of the Polaris software. When you compare planning tools, ask how they handle shared machines, qualifications, setup times and rush orders, and how they show the effect of a new interval before you change the floor.

## Next step

Choose one part family and calculate your own interval with the numbers of the last three months. Write down what would have to change for lean aerospace manufacturing to run it at half that interval, and start with the changeover on the bottleneck machine.
