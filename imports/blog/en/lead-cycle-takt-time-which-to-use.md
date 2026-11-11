---
title: "Lead Time vs Cycle Time vs Takt Time: What Is the Difference?"
summary: "Lead time vs cycle time vs takt time: three numbers that answer three different questions. Learn which one shows waiting, which shows pace and how to use them."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [lead-time, cycle-time, takt-time]
keypoints:
  - "Lead time is the total elapsed time including waiting, cycle time is the time a step needs per unit, and takt time is the pace that customer demand requires."
  - "The three numbers answer different questions: how long the customer waits, whether a step keeps pace, and how fast the plant must produce."
  - "Takt time is calculated from available time and demand, while cycle time and lead time are measured on the floor."
  - "A line can meet takt on every station and still have a very long lead time, because most of the lead time is waiting, not processing."
  - "Write down where each clock starts and stops, otherwise two teams will report two different lead times for the same product."
faq:
  - q: "What is the difference between lead time and cycle time?"
    a: "Lead time is the total elapsed time from the start of an order or batch until the product is finished, including all waiting. Cycle time is the time one step needs to make one unit. Lead time is what the customer feels, and cycle time is what a station can do."
  - q: "How do lead time, cycle time and takt time relate?"
    a: "Takt time is the pace demand requires, calculated as available time divided by demand. Cycle time is the time a step actually needs per unit. Lead time is the total elapsed time including waiting. Cycle time should stay slightly below takt, and lead time is usually far larger than cycle time."
  - q: "Can cycle time be longer than takt time?"
    a: "For a short time, yes, but then that station cannot keep pace with demand and becomes the bottleneck. The plant must cover the gap with overtime, extra capacity or a faster step. If cycle time is far below takt, the station waits for work and capacity sits idle."
---

[Lead time](https://www.m365.fm/entity/lead-time/) is how long the customer or the next process waits, cycle time is how long one step needs per unit, and takt time is how fast demand requires you to produce. They are three different clocks, and mixing them up leads to wrong decisions. This guide is for lean managers who hear all three words in the same meeting. You will see what each number answers, a worked example where a line meets takt and still has a very long lead time, and how to measure each one cleanly.

## Lead time vs cycle time: the core difference

Both numbers are measured in time, so they are easy to confuse. The difference is what they include. [Cycle time](https://www.m365.fm/entity/cycle-time/) covers one step, and lead time covers the whole journey.

The Lean Enterprise Institute (LEI) defines cycle time, in its [lexicon entry](https://www.lean.org/lexicon-terms/cycle-time/), as the time required to produce a part or complete a process, as timed by actual measurement. On the same page, it defines production lead time, also called throughput time, as the total time for a product to move through a process or value stream. It adds order lead time, which includes delays downstream, such as order processing and waiting when customer orders exceed capacity. LEI puts the three in a clear order: value-creating time is usually less than cycle time, which is less than production lead time.

Michael Ballé gives a plain description in his LEI article [Should I pursue waste elimination or lead-time reduction?](https://www.lean.org/the-lean-post/articles/should-i-pursue-waste-elimination-or-lead-time-reduction/). In his words, the lead time is the time the order sits in the queue plus the time it takes to actually make it. So lead time has two parts: processing and waiting. Cycle time covers only the processing part of one step.

That is why the two numbers move independently. You can speed up a machine and improve its cycle time, and the lead time may not change, because the order still waits for the same queue. Ballé warns that a faster step alone mainly encourages more overproduction.

One more trap: cycle time itself has variants. LEI's page shows an effective machine cycle time that adds load and unload time and a share of the changeover to the machine's own cycle. In its example, 20 seconds of machine time, 30 seconds of loading and a 30-second changeover over a minimum batch of 30 pieces give 51 seconds. Decide which version your plant uses and write it down. The same caution applies when your IT colleagues talk about kanban boards, agile teams and workflow metrics: they often start and stop the clocks at other points than the shop floor does.

## Takt time: the third number

Takt time is different in kind. LEI defines [takt time](https://www.lean.org/lexicon-terms/takt-time/) as the available production time divided by customer demand. In its example, a factory that runs 480 minutes a day and faces demand of 240 widgets a day has a takt time of two minutes. Nobody measures takt with a stopwatch. You calculate it from the time you have and the demand you must meet, and you recalculate it when either changes.

Takt is therefore the target pace, and the [takt time](https://www.m365.fm/entity/takt-time/) of your plant is a calculation, not a reading. Cycle time is the actual pace of a step. If a station's cycle time is below the takt time, it can keep up with demand. If it is above, the station is the bottleneck, and the line cannot deliver what customers ask for. Lead time sits on a different axis: it counts every hour in which the product waits, so it can be long even when every station is faster than takt.

## Which number answers which question

Use this as a quick guide. It is our own summary, not a standard.

- **Takt time answers:** How fast must we produce to meet demand? Use it to set the pace, to size the number of stations and operators, and to check whether the plan is realistic.
- **Cycle time answers:** Can this step keep up, and where is the bottleneck? Use it to compare each station with takt and to find the step that limits the output.
- **Lead time answers:** How long does the customer wait, and how long does our stock sit in the process? Use it as a metric for delivery speed, flexibility and the amount of work in process.

If your question is about waiting, you need lead time. If it is about speed at a station, you need cycle time. If it is about the pace demanded, you need takt. A plant that tracks only cycle time sees pace, not waiting. A plant that tracks only lead time sees waiting, not the cause.

## Example: a line that meets takt and still waits

This is an illustrative example, not a measured case. A plant runs 480 minutes per day for a demand of 240 units per day, so the takt time is 120 seconds. Three stations process the product. The batches of 240 pieces, one day of demand, move from station to station as a whole.

- **Cutting:** cycle time 100 seconds, queue before the station 16 hours.
- **Welding:** cycle time 115 seconds, queue before the station 24 hours.
- **Painting:** cycle time 90 seconds, queue before the station 8 hours.

Every cycle time is below the takt of 120 seconds, so the line keeps pace with demand. Welding is the bottleneck with a margin of only 5 seconds. The hands-on time for one piece is 100 + 115 + 90 = 305 seconds, or about 5 minutes.

Now the lead time of a batch. Running 240 pieces takes 240 × 100 seconds = 6.7 hours at cutting, 7.7 hours at welding and 6.0 hours at painting, which together make 20.3 hours. The queues add 16 + 24 + 8 = 48 hours. The production lead time is about 68 working hours, which is more than eight working days at eight hours. The hands-on time of 5 minutes is about 0.1 per cent of it.

All three numbers are correct, and they tell three different stories. Takt says the pace is right. Cycle time says no station is too slow. Lead time says the customer waits more than eight days for a product that takes five minutes of work.

Now the team cuts the batch to 60 pieces. Cycle times and takt do not change. The runs shrink to a quarter, which is 5.1 hours in total. Assume the queues also shrink to a quarter, because they were mostly waiting for the batches ahead: 12 hours. The lead time falls to about 17 hours, a reduction of three quarters. That is an assumption to be checked on the floor, but the direction is sound, and it follows the logic that Ballé describes: to reduce lead time, cut the queue and the batch, not the time of each step.

## How to measure each number without fooling yourself

1. **Fix the start and the end.** Decide where each clock starts and stops. Does lead time start at order entry, at release to the shop floor or at the first operation? Does it end at the last operation, at packing or at delivery?
2. **Calculate takt from net time.** Take the available time after breaks and planned stops, and divide by the demand in the same period.
3. **Time the cycle time at the station.** Use a stopwatch or the machine data, over several cycles, and state whether you include load, unload and changeover share.
4. **Track lead time with timestamps.** Mark a sample of orders or batches at entry and exit of each step. A simple tag or a booking scan is enough. Do not infer lead time from averages of cycle times.
5. **Compare them in one picture.** Put takt, cycle time per step and the lead time of a sample order side by side. The gap between the cycle times and the lead time shows the waiting.

Repeat the measurement after a change. If the lead time did not move, the change did not touch the waiting.

## Common mistakes

- **Using the words as synonyms.** A report that says "cycle time of eight days" mixes the two. Name the clock.
- **Reporting lead time without its start and end.** Two teams can report different numbers for the same product.
- **Judging a plant by cycle time alone.** Fast stations do not guarantee short lead times, as the example shows.
- **Setting takt from the gross time.** Breaks and planned stops are not available for production.
- **Treating takt as a measurement.** It is a target derived from demand. When demand changes, takt changes.
- **Cutting cycle time at a station that is not the bottleneck.** The line does not get faster, and stock only piles up further downstream.

## How software can help

A manufacturing execution system can book the start and end of each operation and compute cycle times and lead times from the same timestamps. An ERP system holds demand and available time, so takt can be recalculated when the plan changes. Dashboards can show takt, cycle time and lead time side by side. Software supplies the data. The decision about where the waiting comes from is still made at the gemba.

## Next step

Pick one product, calculate its takt, and follow one batch with timestamps from release to the last operation. Then put the numbers next to each other to see the lead time vs cycle time gap, and ask where the product spends its waiting hours.
