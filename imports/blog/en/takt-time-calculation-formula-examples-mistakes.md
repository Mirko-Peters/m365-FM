---
title: "Takt Time Calculation: Formula, Examples and Common Mistakes"
summary: "Takt time is available production time divided by customer demand. See the takt time calculation step by step, with a worked line example and common mistakes."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-simulator, value-stream-mapping, takt-time, bottleneck]
keypoints:
  - "Takt time is the available production time divided by customer demand. It sets the pace at which you must finish a unit to meet demand."
  - "Available time is the shift minus breaks, planned maintenance, changeovers and clean-down. Demand is units per time period."
  - "Takt is a target set by the customer. Cycle time is what a station actually needs. A station with a longer cycle than takt is a bottleneck."
  - "Divide the total work content by takt to estimate the minimum number of operators, then balance the work among them."
  - "Recalculate takt when demand or available time changes. Toyota typically reviews the takt for a process every month."
faq:
  - q: "What is the formula for takt time?"
    a: "Takt time equals available production time divided by customer demand. If a plant works 480 minutes per day and customers demand 240 units per day, takt time is two minutes. Use net available time, after breaks, planned maintenance and similar stops, and use the demand for the same period."
  - q: "What is the difference between takt time and cycle time?"
    a: "Takt time is the pace set by customer demand: how often you must finish one unit. Cycle time is how long a process actually takes to complete one unit. If cycle time is longer than takt, the process cannot meet demand at that pace. If it is much shorter, the process risks overproduction."
  - q: "How often should you recalculate takt time?"
    a: "Recalculate whenever customer demand or available working time changes. The Lean Enterprise Institute notes that Toyota typically reviews the takt for a process every month, with a tweaking review every ten days. Your own rhythm depends on how much demand varies, but a fixed monthly review is a sound start."
---

Takt time is the available production time divided by customer demand. It tells you how often a finished unit must leave a process if you are to meet demand exactly. This article is for production planners who need to calculate takt time for a line or cell and use it. It shows the formula, what counts as available time, how takt differs from cycle time, a worked example with line balancing and the mistakes that make the number useless.

## What is takt time?

The Lean Enterprise Institute defines [takt time](https://www.lean.org/lexicon-terms/takt-time/) as a calculation of the available production time divided by customer demand. Its purpose is to match production precisely with demand, and the institute calls it the heartbeat of a lean production system. *Takt* is German for a precise interval of time, such as a musical meter. The page notes that takt was first used as a production management tool in the German aircraft industry in the 1930s and was widely used within Toyota in the 1950s.

The institute gives a simple case: if a widget factory operates 480 minutes per day and customers demand 240 widgets per day, takt time is two minutes. That means one widget must be finished every two minutes. The LEI page quotes Art Byrne, who describes takt as the beat of the customer, or the rate of demand.

The key point: takt comes from the customer, not from the machine. It does not say how fast a station can run. It says how fast the plant must run to match demand. The [takt time](https://www.m365.fm/entity/takt-time/) idea is therefore the link between the market and the shop floor.

In lean manufacturing, the takt time formula is the starting point for designing a production line. It sets the net available production time per unit that every station must meet, so that the line can meet customer demand without building stock or leaving people idle. When you draw a [value stream map](https://www.m365.fm/entity/value-stream-mapping/), takt is a useful yardstick: compare the time of each step with it. Once the line is running, takt helps you see at a glance whether a station is keeping pace.

## How do you calculate takt?

Use this formula:

**Takt = available production time ÷ customer demand**

1. **Choose the period.** One shift, one day or one week. Use the same period for time and demand.
2. **Find the available production time.** Start with the scheduled time and subtract everything in which the line cannot produce.
3. **Find the customer demand.** Count the units the customer needs in the same period.
4. **Divide.** Time available divided by units gives time per unit.
5. **Convert to a practical unit.** Minutes or seconds per unit are common.

## What counts as available time and demand?

Be strict here, because most errors come from these two inputs. The [Process Excellence Network](https://www.processexcellencenetwork.com/lean-six-sigma-business-transformation/articles/what-is-takt-time/) describes available production time as total production time minus breaks, maintenance activities, shift changeover and clean-down time, and customer demand as the units required by the customer in a time period.

Typical items to subtract from the shift:

- Breaks and lunch
- Planned maintenance
- Shift handover
- Planned meetings, such as the daily board meeting
- Planned cleaning

Do not subtract unplanned stops such as breakdowns. Those are a loss that you try to remove, not a planned part of the time. If you subtract them, you set a takt that hides the problem.

For demand, use customer orders or a reliable forecast, not the plan of what the plant would like to make. If the customer takes 140 units per shift, the demand is 140 units, even if the plant has capacity for 200. Making the extra 60 is overproduction.

Process Excellence Network gives a worked example: 8 hours, which is 480 minutes, minus 50 minutes of breaks leaves 430 minutes. With a demand of 100 pieces, takt is 430 ÷ 100 = 4.3 minutes, or 258 seconds.

## How is takt different from cycle time and lead time?

Three times are often mixed up.

- **Takt time** is the pace of demand: how often a unit must be finished.
- **Cycle time** is how long a process actually needs to produce one unit.
- **Lead time** is how long a unit takes from the start of the process to the end, including all waiting time.

The comparison of takt and cycle time is the heart of the method. If the cycle time of a station is longer than takt, that station cannot keep up. It is a [bottleneck](https://www.m365.fm/entity/bottleneck/) relative to demand, and the line will build queues in front of it. If the cycle time is much shorter than takt, the station will wait, or it will overproduce if nobody stops it.

The Process Excellence Network advises measuring individual cycle times and bringing them closer to takt. It also notes that you may want to run a little under takt, to absorb variation in process steps, breakdowns and quality issues. So aim for cycle times at or just under takt.

## How do you use takt to balance a line?

Once you know takt, you can see whether the work is spread well across the stations.

1. **Measure cycle times** for each station with a stopwatch or video over many cycles, not once.
2. **Compare each with takt.** Mark every station above takt.
3. **Estimate the number of operators.** Divide the total work content, the sum of the cycle times, by takt, and round up. This is a first estimate, not a rule.
4. **Move work.** Shift tasks from stations above takt to stations below takt, so that all sit at or just under takt.
5. **Check the result with the people on the line.** A balance that looks good on paper may not work if the tasks need different skills or tools.

Takt is not always easy to run. The same article says the formula is simple, but takt is one of the more difficult parts of lean to implement, because the processes must be dependable, produce good quality and have very high machine uptime first. If they do not, work on stability first.

## Example: takt and a five-station line

This is an illustration with made-up numbers.

A shift has 480 minutes. Breaks take 50 minutes, a planned cleaning 10 minutes. Available time is 480 − 50 − 10 = 420 minutes. The customer demand is 140 units per shift.

- Takt = 420 ÷ 140 = 3.0 minutes per unit, or 180 seconds.

The five stations have these measured cycle times, in minutes:

- Station 1: 2.4
- Station 2: 3.1
- Station 3: 2.8
- Station 4: 3.4
- Station 5: 2.6

Total work content is 2.4 + 3.1 + 2.8 + 3.4 + 2.6 = 14.3 minutes. Stations 2 and 4 are above takt of 3.0 and cannot meet demand. Station 4 is the largest gap at 0.4 minutes. The team moves 0.5 minutes of work from station 4 to station 1, and 0.2 minutes from station 2 to station 5.

- New cycle times: 2.9, 2.9, 2.8, 2.9 and 2.8 minutes.
- The total stays at 14.3 minutes, and every station is now at or under 3.0.

Then demand rises to 168 units per shift. The new takt is 420 ÷ 168 = 2.5 minutes. Total work content divided by takt is 14.3 ÷ 2.5 = 5.72, so the line needs at least 6 operators, or the work content must shrink. These numbers are assumptions. Measure your own stations, because real cycle times vary.

## Common mistakes

- **Using gross time.** If you do not subtract breaks and planned stops, takt is too long and the line will miss demand.
- **Subtracting breakdowns.** Unplanned downtime is a loss to remove. Leave it in, or the takt hides it.
- **Using capacity instead of demand.** Takt follows the customer. If you divide by what the plant can make, you get overproduction.
- **Confusing takt with cycle time.** One is a target, the other is a measurement. Never swap them.
- **Calculating once.** Demand changes. Review takt on a fixed rhythm, for example monthly, as Toyota does according to the Lean Enterprise Institute.
- **Forcing takt on an unstable process.** If machines break down often, fix reliability before you hold the line to takt.

## How software can help

A spreadsheet is enough to calculate takt. The harder question is what happens when takt, demand or staffing change: where does the next bottleneck appear, and how many people does the line need? iFAKT's [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. Use the model to compare options, and confirm the result on the line with the team.

## Next step

Pick one line, list the planned stops and calculate takt for one shift from the customer demand. Then compare the cycle time of each station with it, and start with the station that is furthest above takt time.
