---
title: "Reducing Lead Time in Complex Assembly: A Value Stream Approach"
summary: "Reduce lead time in complex assembly with a value stream approach: map the flow, use Little's law, cap work in process and cut setups. For lean managers."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, aerospace, value-stream-mapping, bottleneck]
keypoints:
  - "Most of the lead time in complex assembly is waiting, not work: the gap between value-added time and total lead time on a value stream map shows where the time goes."
  - "Little's law links the three variables: lead time equals work in process divided by throughput, so with flat output the only way to shorten lead time is to cut work in process."
  - "Cap work in process at the bottleneck, shorten the changeovers there and shrink the batch size to match, instead of working on every station at once."
  - "In complex assembly, material waiting is a frequent hold-up, so include supplier delivery and procurement dates in the same map."
  - "Start with one product family: walk the stream, count the work in process at every step and pick the one queue with the largest gain."
faq:
  - q: "How do you calculate lead time from work in process?"
    a: "Use Little's law: lead time equals work in process divided by throughput. Count the units waiting at each step during a walk of the stream, add them up and divide by the daily output or requirement. For example, 100 pieces in process with a requirement of 50 pieces a day give a lead time of two days."
  - q: "Why is lead time in complex assembly so long?"
    a: "Complex assembly joins many parts, steps and sub-assemblies, so one missing part, one queue or one inspection can hold a whole unit. Large batches, long changeovers, shared resources and late supplier deliveries add waiting time. In most cases the work itself takes only a small part of the total lead time."
  - q: "What is the fastest way to cut lead time?"
    a: "Cut work in process where it limits the flow. Find the true bottleneck with data, cap the work in process in front of it, shorten the changeovers there and reduce the batch size to match. Gains elsewhere are smaller, because output is limited by the constraint, and extra work on the floor only adds queue time."
---

To reduce lead time in complex assembly, find where units wait, because waiting usually takes far more time than the work itself. This article is for lean managers who run assembly with many parts, steps and sub-assemblies, for example in aerospace. You will learn how a value stream map shows the waiting, how to measure lead time with Little's law, which levers cut it fastest and how to start with one product family.

## Why is it hard to reduce lead time in complex assembly?

Complex assembly joins many parts and sub-assemblies, often from several suppliers. A single missing part, a queue in front of an inspection or a shared fixture can hold a whole unit. In the [aerospace](https://www.m365.fm/entity/aerospace/) industry, strict quality and traceability requirements add checks and records, which add steps and waiting.

An article in IndustryWeek on lead time lists the usual causes. See the [IndustryWeek article on lead time](https://industryweek.com/operations/continuous-improvement/article/21964950/taking-a-bite-out-of-lead-time).

- **Queues and work in process (WIP).** Every queue adds waiting. The article says that WIP should not be cut to zero, though.
- **Batch size and batch movement.** Large lots pile up between operations while inspectors or operators handle other duties.
- **Changeover time.** Long changeovers limit how far you can cut WIP.
- **Staffing and layout.** Staffing gaps, large equipment and layouts that prevent cells limit the flow.

In a complex assembly, add the material side. If a supplier delivers late or procurement orders at the wrong time, the line waits for raw material and components even if every station is ready. The supply chain is part of the lead time.

## What does a value stream map show about lead time?

A [value stream map](https://www.m365.fm/entity/value-stream-mapping/) shows how material, information and decisions flow through a product family, including process steps, queues and handoffs. A framework page on value stream mapping describes the method in two linked parts. See the [Umbrex page on value stream mapping](https://umbrex.com/resources/frameworks/strategy-frameworks/lean-value-stream-mapping/).

**Current state.** Walk the stream where the work happens and record data for each step, for example cycle time, changeover time, uptime, first-pass yield, batch size and WIP. Note how each step is triggered and who schedules it. Compute takt time from real demand: available production time per period divided by customer demand per period.

**Timeline.** The bottom of the map has two totals. Value-added time is the sum of the actual processing times. Non-value-added time covers queues, transport, waits and inventory days. The gap between the two totals shows where time is lost between a customer request and delivery. The page does not define a value-added ratio, so any ratio, such as value-added time divided by total lead time, is your own calculation.

**Future state.** Choose one pacemaker step that sets the schedule, create continuous flow where cycle times allow it, and use FIFO lanes with explicit WIP limits where they do not. Then level the load, reduce the changeovers and turn the design into a plan with owners and targets.

## How do you measure lead time with Little's law?

Little's law links three variables: WIP equals throughput multiplied by lead time. Rearranged, lead time equals WIP divided by throughput. A guide on the website kaizen.com explains that if throughput stays flat, the only way to shorten lead time is to reduce WIP, because extra work on the floor adds queue time without adding output. See the [kaizen.com article on WIP and lead time](https://kaizen.com/insights/reduce-wip-manufacturing-lead-time/). The site is commercial, so treat its figures as examples.

The IndustryWeek article uses the same idea in a practical way. During the data walk, count the inventory at each operation, then divide the WIP by the daily requirement to get the lead time in days. Its example: 100 pieces of WIP and a daily requirement of 50 pieces give 2 days of lead time. It also warns not to mix this method with lead times taken from router or ERP history, so choose one method and keep it.

The kaizen.com article adds a warning about queues. It says that queue time is often 80 percent or more of total lead time in discrete manufacturing, and that queue time starts to climb sharply at roughly 80 to 85 percent resource utilization. Those are the article's figures, not a rule for every plant, but they explain why a fully loaded station is slow.

## Which levers shorten lead time most?

The sources agree on a short list. Start with the first lever.

1. **Find the true bottleneck with data.** The [bottleneck](https://www.m365.fm/entity/bottleneck/) is the resource whose capacity limits the whole line, and it is often not the busiest-looking machine. Gains elsewhere do not change the output.
2. **Cap WIP in front of it.** Use a kanban system, a total WIP cap across the routing (CONWIP) or FIFO lanes, depending on the product mix. As a starting limit, the kaizen.com article suggests the current average WIP at the constraint minus 20 to 30 percent.
3. **Shorten the changeovers and shrink the batches.** The kaizen.com article says a 75 percent cut in setup time can roughly halve the economic batch size. Smaller batches move through the stream sooner.
4. **Use standard WIP.** IndustryWeek defines standard WIP as the total cycle time of an operation divided by takt time. Its example: 60 minutes of cycle time and an 80-minute takt give 0.75, rounded up to 1 piece.
5. **Form cells.** Dedicated cells for each product family allow flow. Standard work and cross-training keep them staffed.
6. **Include procurement.** Agree delivery dates with suppliers, and release long-lead items first.

IndustryWeek reports one case in which WIP was cut from 10.5 days to 5 days of lead time at a cost of about $500, with a potential of 2 days. It is a single case and not a benchmark, but it shows that the first gains can be cheap.

## How do supply chain and inventory shape the lead time?

Manufacturing lead time is only one part of what the customer sees. The delivery times to the customer also include order processing, procurement and the supply chain lead time of raw material and components. Long lead times at suppliers force higher inventory levels, and excess inventory hides problems and ties up cash. Good inventory management and supply chain management aim to reduce inventory without risking delivery: share forecasts, agree delivery dates and track the on-time delivery of suppliers.

Reducing lead times has a clear business effect. A shorter lead time supports customer satisfaction, helps to reduce costs and improves productivity, because less capital waits in finished goods and in process. Track a few key performance indicators: total lead time, process time, WIP, on-time delivery and the supplier delivery date.

## Example: from 8 days to 5 days

This example uses assumed numbers.

A complex assembly area has 120 units in process. The area completes 15 units per day. A working day has 7.5 hours.

**Before.** Lead time equals WIP divided by throughput: 120 ÷ 15 = **8 days**, which is 8 × 7.5 = 60 working hours. The value-added time per unit, the sum of all processing steps, is 6 hours. The value-added share, as our own ratio, is 6 ÷ 60 = **10 percent**. The other 54 hours are waiting.

**Action.** The team finds the bottleneck at the final test, caps WIP in front of it with a FIFO lane, and shortens the changeovers there. WIP falls from 120 to 75 units, while throughput stays at 15 units per day.

**After.** Lead time is 75 ÷ 15 = **5 days**, which is 5 × 7.5 = 37.5 hours. The value-added share is 6 ÷ 37.5 = **16 percent**. The lead time fell by 3 days, or 37.5 percent, without a faster machine.

The numbers are made up, but the lesson is general. With flat output, WIP and lead time move together.

## How do you start?

1. **Pick one product family** with a clear start and end, for example one assembly from kit to test.
2. **Walk the stream** and count the WIP at every step. Record cycle time, changeover time and batch size.
3. **Draw the current-state map** with both material and information flow, and add the timeline.
4. **Compute lead time** with Little's law and compare it with the sum of the processing times.
5. **Pick the largest queue** at or before the bottleneck, and set a WIP limit.
6. **Shorten the changeover** there, and shrink the batch to match.
7. **Draw the future state,** streamline the workflow of the production process, set targets and owners, and review the numbers every week. Optimize the schedule only after the map is done.

## Common mistakes

- **Mapping without measuring.** A map with guessed times hides the real queues.
- **Mixing methods.** Do not compare lead times from Little's law with lead times from ERP history.
- **Cutting WIP to zero.** Some WIP protects the bottleneck from starving.
- **Improving every station.** Output is limited by the constraint, so work elsewhere has little effect.
- **Forgetting suppliers.** If material arrives late, the best flow still waits.
- **Chasing every station for optimization.** The map tells you which step to improve first.
- **Stopping after one project.** Without owners and weekly numbers, WIP grows back.

## How software can help

A value stream map drawn on a wall is a good start, but it ages fast. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping that models material and information flows collaboratively and makes waste and bottlenecks visible. When you compare tools, ask where the data comes from, how often the map updates and how it shows queues and lead times per product family.

## Next step

Choose one product family, count the WIP at every step and divide it by the daily output. That figure is your lead time today, and the largest queue before the bottleneck is the first place to reduce lead time.
