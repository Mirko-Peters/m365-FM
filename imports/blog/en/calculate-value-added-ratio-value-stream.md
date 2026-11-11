---
title: "How to Calculate the Value-Added Ratio in a Value Stream"
summary: "Learn how to calculate the value added ratio in a value stream: the formula, the data you need, a worked example with made-up numbers and common mistakes."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, value-stream-mapping, bottleneck]
keypoints:
  - "The value added ratio is value-added time divided by production lead time. Lean teams also call it value-added percentage or process cycle efficiency."
  - "Value-added time covers only the work the customer pays for. Waiting, storage, inspection, transport and rework are non-value-added."
  - "Most of the lead time is waiting, so the ratio is usually very small on a first current state map."
  - "Define your inputs before you calculate. Work content and elapsed time give different results for the same process."
  - "Use the ratio to compare your own maps before and after a change. Outside benchmarks vary widely and are rarely reliable."
faq:
  - q: "What is the formula for the value added ratio?"
    a: "The value added ratio equals value-added time divided by production lead time. Both must cover the same product and the same time unit. Multiply the result by 100 if you want a percentage. For example, 2 hours of value-added work in a 10-hour lead time gives 0.2, or 20 percent."
  - q: "What is a good value-added ratio?"
    a: "There is no reliable universal target. Published figures differ widely, and first current state maps often show very low values, because most lead time is waiting. A better test is direction: the ratio should rise after each improvement. Compare your own maps over time, and do not chase figures from other plants."
  - q: "Is the value added ratio the same as process cycle efficiency?"
    a: "In lean use, yes. Process cycle efficiency, flow efficiency and value added ratio all describe value-added time divided by lead time. Some writers express it as a percentage and others as a ratio. The meaning is the same, but check how a source defines its inputs before you compare two numbers."
---
The value added ratio shows what share of a product's time in your manufacturing plant is real work. You calculate it by dividing the value-added time by the production lead time. This guide is for continuous improvement managers who want to calculate the ratio on a value stream map and read the result with care. It explains the inputs, gives a step-by-step method and a worked example with made-up numbers, and lists the traps that make two ratios impossible to compare.

## What does this ratio measure?

A *value stream* is all the steps that turn a customer need into a delivered product. *Production lead time* is the total time a product needs to move through it, from start to finish. The Lean Enterprise Institute (LEI) lexicon uses that term. It adds that the actual processing time is typically a small fraction of it. Most of the time, the product waits.

*Value-added time* is the part of the work that transforms the product in a way the customer will pay for. The lexicon calls it value-creating time. Time that adds cost but no customer value, such as storage, inspection and rework, is non-value-added time. You can read the definitions in the [LEI lexicon entry on cycle time](https://www.lean.org/lexicon-terms/cycle-time/). Waiting for materials or approvals, transport and rework caused by earlier errors belong in the same group.

Three names describe the same idea. Value added ratio, value-added percentage and process cycle efficiency (PCE) all mean value-added time divided by lead time. Jon Miller of Gemba Academy writes that this is the correct way to calculate the ratio when you make a value stream map. Do not confuse it with value added in financial reporting, which is a money measure. This article covers the time-based ratio only. Cost accounting sites use it too. The [AccountingTools](https://accountingtools.com/articles/value-added-ratio) definition divides value-added time by the total time from order receipt to delivery. It notes that some versions start the clock at the start of production, which is the production lead time used here. The concept is simple, but the inputs need care.

## How do you calculate the value added ratio?

The formula is short:

**Value added ratio = value-added time ÷ production lead time**

Multiply by 100 to get a percentage. Both times must describe the same product, in the same unit. The work is in getting honest inputs. Follow these steps on a [value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) exercise for one product family:

1. **Draw the current state map.** Walk the flow and record each process step with its cycle time. Count the stock in front of each step.
2. **Split each step into value-added and non-value-added work.** Ask: would the customer pay for this? Teams should decide this together at the station.
3. **Add up the value-added time** of all steps for one unit.
4. **Calculate the waiting time.** Divide the stock in front of each step by daily demand to get days of stock, then convert days into working seconds.
5. **Add the processing time and waiting time** to get the production lead time.
6. **Divide** the value-added time by the lead time.

If you cannot count stock directly, you can estimate lead time with Little's Law. The training site 6sigma.us gives it as lead time = work-in-process ÷ throughput rate, in its article on [process cycle efficiency](https://www.6sigma.us/business-process-management-articles/process-cycle-efficiency/). For example, 600 units in process and 300 units per day gives 2 days (made-up numbers). Check the estimate against a real count on the floor if you can.

One input needs a decision. In his Gemba Academy post [Value Added Percentage Question](https://blog.gembaacademy.com/?p=11459), Miller treats value-added time as work content summed across all staff, and lead time as elapsed clock time. When several people work on one item at the same time, work content can be longer than elapsed time, and the ratio can then exceed 100 percent. In his example, it came to 300 percent. Readers in the comments got 75 percent and 65 percent from the same case by defining the inputs differently. The lesson is not which choice is right. The lesson is to write down your choice and keep it.

## Example: five steps, one product family

This is an illustrative example with made-up numbers, not a measured case. A continuous improvement manager maps one product family, an assembled motor housing. Demand is 200 units per day. One working day has 25,200 seconds.

Per unit, each step has a cycle time, a value-added time and stock in front of it:

- **Machining:** cycle time 70 seconds, value-added 55 seconds, stock in front 400 units.
- **Deburring:** cycle time 30 seconds, value-added 0 seconds, stock in front 200 units.
- **Inspection:** cycle time 25 seconds, value-added 0 seconds, stock in front 300 units.
- **Assembly:** cycle time 95 seconds, value-added 80 seconds, stock in front 200 units.
- **Packing:** cycle time 20 seconds, value-added 0 seconds, no stock in front.

The team classified deburring, inspection and packing as non-value-added for this example. That is a judgement. Other teams may decide differently, and they should decide at the station.

**Value-added time:** 55 + 80 = **135 seconds**.

**Processing time:** 70 + 30 + 25 + 95 + 20 = **240 seconds**.

**Waiting time:** 400 ÷ 200 = 2 days, 200 ÷ 200 = 1 day, 300 ÷ 200 = 1.5 days and 200 ÷ 200 = 1 day. That is **5.5 days**, or 5.5 × 25,200 = 138,600 seconds.

**Production lead time:** 138,600 + 240 = **138,840 seconds**.

**Value added ratio:** 135 ÷ 138,840 = 0.00097, about **0.1 percent**.

Now compare two improvement ideas:

- **Remove deburring and inspection.** Suppose a better process makes both unnecessary. Processing time falls by 55 seconds, and lead time falls to 138,785 seconds. The ratio is still 0.1 percent, because 55 seconds is tiny next to 138,600 seconds of waiting.
- **Halve the stock in front of every step.** Waiting time falls to 2.75 days, or 69,300 seconds. Lead time becomes 69,540 seconds, and the ratio becomes 135 ÷ 69,540 = about **0.19 percent**. The ratio has almost doubled, and the customer receives the product 2.75 days sooner.

Both ideas are good for other reasons. But only the second one moves the ratio, which shows where the time sits: in the queues.

## How do you read the result?

Do not expect a high number on the first map. The LEI lexicon says processing time is typically a small fraction of lead time, and the arithmetic above shows why. A queue of a few days dwarfs seconds of work. One commenter on the Gemba Academy post reports from his own experience that first current state maps often show about 1 percent or less. AccountingTools gives a plastics-case example in which about 6 of 168 hours add value, which is 3.6 percent. These are single cases, not benchmarks. Take such figures with caution. None of the sources I checked gave a firm benchmark.

A better use of the ratio is direction. Calculate it on the current state map, then again on the future state map and after each improvement. Use it to analyze where the time goes, and treat it as one signal next to others, such as lead time in days, stock and on-time delivery. The ratio can also mislead. Adding more value-added work to a step raises the ratio but may not help the customer, so always read it together with lead time.

## How do you raise the ratio?

Because waiting makes up most of the lead time, the biggest gains in productivity and delivery come from reducing waiting, not from speeding up work. The 6sigma.us article lists approaches such as kanban, visual management and one-piece flow, and it recommends finding constraints with value stream mapping and cycle time analysis. In practice, these steps help:

1. **Reduce batch sizes.** Smaller batches wait less between steps.
2. **Limit work in process.** Pull systems and kanban stop stock from building up.
3. **Fix the [bottleneck](https://www.m365.fm/entity/bottleneck/).** Stock collects in front of the slowest step, so improving it shortens the queue.
4. **Remove non-value-added steps.** Do this after you understand why each step exists.
5. **Level the flow.** Even demand at the pacemaker reduces waves of stock.

## Common mistakes

- **Mixing definitions.** Work content and elapsed time give different ratios. Fix one rule and apply it to every step.
- **Calling everything value-added.** If someone does the work, it feels valuable. Ask whether the customer would pay for it.
- **Ignoring the waiting time.** If you only add up cycle times, you describe a fast process and miss the real lead time.
- **Comparing with outside benchmarks.** Plants differ in product, process and counting rules. Compare your own maps over time, and share the definition across the organization so every plant counts the same way.
- **Using one product for the whole plant.** Calculate the ratio per product family, then compare families.
- **Chasing the ratio alone.** Check lead time, delivery and quality as well.

## How software can help

Counting stock and times by hand takes days, and the numbers age fast. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. Such a model can show where waiting piles up. The classification of value-added and non-value-added work still needs the people at the station.

## Next step

Take one product family and calculate its value added ratio on paper: list the steps, split each into value-added and non-value-added time, and add the waiting time from stock and daily demand. Then write down your definition of each input, so you can calculate the same value added ratio again after your next improvement.
