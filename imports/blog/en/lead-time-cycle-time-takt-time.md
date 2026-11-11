---
title: "Lead Time vs Cycle Time vs Takt Time: Definitions and Examples"
summary: "Lead time vs cycle time explained for production managers: clear definitions, the takt time formula and a worked example with made-up numbers on one product."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, polaris-analyzer, takt-time, value-stream-mapping]
keypoints:
  - "Cycle time is the time to complete one step, measured at the station. Lead time is the total time a product needs to move through the whole value stream."
  - "Takt time is not measured. You calculate it as net available time divided by customer demand in the same period."
  - "In most plants, processing time is a small fraction of lead time, because products spend most of their time waiting in stock."
  - "Cutting a few seconds of cycle time barely moves lead time, while removing a day of stock between steps moves it a lot."
  - "Compare each cycle time with takt time to find the steps that cannot keep the pace, and use lead time to judge how long the customer waits."
faq:
  - q: "What is the difference between cycle time, lead time and takt time?"
    a: "Cycle time is how long one step takes, measured at the station. Lead time is the total time a product needs from start to finish, including waiting. Takt time is the pace set by customer demand, calculated from available time divided by demand. Cycle time shows capability, lead time shows speed, and takt shows the target rhythm."
  - q: "How do you calculate takt time?"
    a: "Divide the net available production time by customer demand for the same period. Net time excludes breaks and planned stops. For example, 420 available minutes and 200 units of demand give a takt time of 2.1 minutes per unit. You cannot measure takt time with a stopwatch, because it comes from demand, not from the process."
  - q: "Is lead time always longer than cycle time?"
    a: "Yes, when both describe the same product. Lead time covers every step plus all waiting between them, so it includes the cycle times and adds queues, moves and storage. In a typical plant the gap is large, because products wait much longer than they are worked on. A short cycle time can sit inside a very long lead time."
---
Lead time vs cycle time is a question of scope. Cycle time covers one step of the work. Lead time covers the whole journey of a product, including every minute it waits. Takt time is a third clock, and it is set by the customer, not by your process. This guide is for production managers who need clear definitions and a feel for how the three numbers behave on a real line. It gives the formulas, a worked example with made-up numbers and a short rule for when to use which measure.

## What is the difference between lead time vs cycle time?

The Lean Enterprise Institute (LEI) defines cycle time as the time required to produce a part or complete a process, as timed by actual measurement. You watch the work and time it. The same lean lexicon separates two kinds of cycle time. Machine cycle time is what a machine needs for all its operations on one piece. Operator cycle time is what a person needs to finish all work elements at a station before repeating them. Both come from direct observation. See the LEI's [lean lexicon entry on cycle time](https://www.lean.org/lexicon-terms/cycle-time/) for the full list of related terms.

Lead time has a wider view. The LEI lexicon calls *production lead time* the total time for a product to move from start to finish through a process or value stream. Other names are throughput time and total product cycle time. At plant level people also say door-to-door time. Ron Pereira prefers the term production lead time in his Gemba Academy article [How to Determine Cycle Time, Takt Time, Lead Time](https://blog.gembaacademy.com/?p=2210). He describes it as the total time, value added and non value added, that a product needs to pass through an entire value stream.

Customers feel a slightly different number. The lexicon defines *order lead time* as production lead time plus the downstream time to deliver, including order processing and delays when orders exceed capacity. That is how long the customer waits. When someone quotes a lead time, ask which one they mean.

Here is the difference in short form:

- **Cycle time** answers: how long does this step take, once work starts?
- **Production lead time** answers: how long is the product in our plant, from start to finish?
- **Order lead time** answers: how long does the customer wait from order to delivery?

Other industries use the same words with their own starting points. The Lean Construction Institute, for example, [defines cycle time](https://leanconstruction.org/blog/key-definitions-cycle-time-lead-time-takt-time/) as how long a crew needs to finish its scope at one location. It defines lead time as the total time for the full sequence of work. Software teams often start the clock at other events again. Check the definition before you compare numbers from two sources.

## What is takt time and how do you calculate it?

*Takt* is a German word for pace or rhythm. Takt time is the rate at which you must make product to satisfy customer demand. The [takt time](https://www.m365.fm/entity/takt-time/) formula is simple:

**Takt time = net available production time ÷ customer demand in the same period**

Pereira gives a plain example. With 480 minutes available and 240 toaster ovens demanded, takt time is 480 ÷ 240 = 2 minutes per oven. The training site [6sigma.us](https://www.6sigma.us/six-sigma-in-focus/takt-time-vs-cycle-time-vs-lead-time/) shows how net time works. A shift of 480 minutes with 60 minutes of breaks leaves 420 available minutes. With 200 units needed, takt time is 420 ÷ 200 = 2.1 minutes per unit.

Pereira also makes a point that matters on the floor. You cannot measure takt time with a stopwatch. You can only calculate it. Cycle time is what the process does. Takt time is what the customer needs. The two meet when you ask a simple question: can this step finish a unit within one takt?

- If cycle time is **below** takt time, the step can keep the pace. It will wait for work part of the time.
- If cycle time is **equal** to takt time, the step has no room for disturbance.
- If cycle time is **above** takt time, the step cannot meet demand without help. That could be overtime, a second station or a faster method.

Recalculate takt time when demand or working time changes. A new shift model, a new customer order or a seasonal peak changes the number, even if the line itself stays the same.

## How do process time and the value-added ratio fit in?

Two more terms appear on every value stream map. *Processing time* is the time a product or order is actively being worked on. The LEI lexicon notes that it is typically a small fraction of production lead time. *Value-added time* is the part of that work that changes the product in a way the customer will pay for. The lexicon calls it value-creating time and says it is usually less than cycle time. Setup, inspection, rework and moving are work too, but the customer does not pay for them.

Divide the value-added time by the lead time, and you get the *value-added ratio*. It tells you what share of the product's time in the plant is real work. The ratio is almost always small, because most of the lead time is waiting. [Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) shows this on its timeline, with waiting time between the steps and processing time at each step. A later article in this series covers the calculation in detail.

## Example: one product through four steps

This is an illustrative example with made-up numbers, not a measured case. A production manager looks at one product family. Demand is 280 units per day. A shift has 480 minutes, minus a 30-minute lunch and two 15-minute breaks, which leaves 420 minutes, or 25,200 seconds.

**Step 1: takt time.** 25,200 ÷ 280 = **90 seconds**.

**Step 2: cycle times and stock in front of each step.**

- **Cutting:** cycle time 40 seconds, stock in front 560 units.
- **Welding:** cycle time 85 seconds, stock in front 840 units.
- **Painting:** cycle time 60 seconds, stock in front 560 units.
- **Packing:** cycle time 30 seconds, stock in front 280 units.

**Step 3: processing time.** 40 + 85 + 60 + 30 = **215 seconds** per unit.

**Step 4: waiting time.** Divide each stock by daily demand: 560 ÷ 280 = 2 days, 840 ÷ 280 = 3 days, 560 ÷ 280 = 2 days and 280 ÷ 280 = 1 day. That is **8 days** of waiting. In working time, 8 × 25,200 = 201,600 seconds.

**Step 5: production lead time.** 201,600 + 215 = **201,815 seconds**, a little over 8 working days.

**Step 6: value-added ratio.** Assume all 215 seconds are value-added work. Then 215 ÷ 201,815 = about **0.11 percent**. Real value-added time is usually lower than processing time, so the true ratio would be lower still.

What the numbers say:

- Every cycle time is below the 90-second takt time. Welding is closest, at 85 seconds. It uses 94 percent of the takt (85 ÷ 90), so it has little room for a disturbance.
- Cutting 5 seconds from the welding cycle time saves 5 seconds of lead time. That is about 0.0025 percent of 201,815 seconds. Nobody outside the plant would notice.
- Removing one day of stock in front of welding saves 25,200 seconds. That is more than 100 times the whole processing time.
- If demand rose to 350 units per day, takt time would fall to 25,200 ÷ 350 = 72 seconds. Welding at 85 seconds would then be above takt time, and it would become the bottleneck. The other steps would still be fine.

The lesson: use cycle time and takt time to see which steps can keep the pace. Use lead time to see where the waiting is. Faster machines do not shorten the waiting time. Smaller batches, less stock and better flow do.

## Which measure should you use for which question?

Match the clock to the decision:

1. **Planning capacity or staffing?** Use takt time. It tells you how fast each step must work to meet demand.
2. **Looking at one station or machine?** Use cycle time. Time several cycles on the floor and write down the range, not just the average.
3. **Promising a delivery date or cutting stock?** Use lead time. Order lead time is the one the customer feels.
4. **Looking for waste?** Compare processing time with lead time. The gap shows where products wait.
5. **Checking a line balance?** Put all cycle times next to the takt time. A balanced line has steps of similar length, all below takt.

## Common mistakes

- **Using the terms as synonyms.** Cycle time and lead time answer different questions. A short cycle time can sit inside a very long lead time.
- **Measuring takt time.** Takt comes from demand and available time. If you time it, you are measuring cycle time.
- **Using gross shift time.** Net available time excludes breaks, meetings and planned stops. Gross time gives a takt that is too long.
- **Quoting a lead time without a definition.** State whether it is production lead time or order lead time, and where the clock starts and stops.
- **Improving only the fast part.** Speeding up one step rarely helps, unless that step is the bottleneck. Look at waiting first.
- **Taking one stopwatch reading.** Time the step several times and on different shifts. Cycle times vary.

## How software can help

Spreadsheets work for one product. They become hard to keep current when you have many products, changing demand and changing stock. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. [iFAKT's Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) offers KPI dashboards across all modules that compare planned and actual values in production. Whichever tool you use, check the numbers against what you see on the floor.

## Next step

Pick one product family and write down its lead time vs cycle time: the total days from start to finish, and the seconds of work per unit. Then calculate takt time for the same family and compare all three numbers.
