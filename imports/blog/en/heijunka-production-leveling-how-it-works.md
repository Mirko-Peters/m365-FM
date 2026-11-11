---
title: "Heijunka (Production Leveling): How It Works in Real Plants"
summary: "Heijunka levels the type and quantity of production over a fixed period. Learn how leveling by volume and mix works, with a heijunka box example and numbers."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-optimizer, finite-capacity-scheduling, heijunka]
keypoints:
  - "Heijunka means leveling the type and quantity of production over a fixed period of time, so the plant works at an even pace."
  - "Leveling by volume smooths the quantity per day. Leveling by mix repeats a short sequence of products instead of running one product in a big batch."
  - "A heijunka box releases kanban at fixed intervals. Pitch is takt time multiplied by the pack-out quantity."
  - "Leveling needs short changeovers and a small finished goods buffer, otherwise the plan collapses into batches again."
  - "Start with one line and a few products, and level the plan first before you change anything on the floor."
faq:
  - q: "What is heijunka in lean manufacturing?"
    a: "Heijunka is the Japanese term for leveling the type and quantity of production over a fixed period of time. Instead of making large batches of one product, the plant makes a repeating mix in small amounts at an even pace. The aim is to meet customer demand without large inventories or uneven workloads."
  - q: "What is a heijunka box?"
    a: "A heijunka box is a tool that levels the mix and volume of production by distributing kanban at fixed intervals. Each row stands for a product type and each column for a time interval. A material handler withdraws the kanban at each interval and passes them to the production processes."
  - q: "What is the difference between leveling by volume and by mix?"
    a: "Leveling by volume smooths the quantity made each day, even when orders arrive unevenly, usually with a small finished goods buffer. Leveling by mix spreads the product types across the period in a repeating sequence, such as A A B C, instead of making each product in one batch. Many plants use both together."
---

Heijunka is the Japanese term for leveling the type and quantity of production over a fixed period of time. Instead of making one product in a big batch, a leveled plant makes a repeating mix in small amounts at an even pace. This article is for lean managers who want to know how production leveling works in a real plant, not only on a poster. It explains leveling by volume and by mix, the heijunka box, a worked example with numbers and the mistakes that make leveling fail.

## What is heijunka, and why level production?

The Lean Enterprise Institute defines [heijunka](https://www.lean.org/lexicon-terms/heijunka/) as leveling the type and quantity of production over a fixed period of time. The Japanese word means roughly "levelization". The goal is to meet customer demand efficiently while avoiding batching. According to the institute, it results in minimum inventories, capital costs, manpower and production lead time through the whole value stream.

Why does this matter? Customer demand is rarely even, and plants that follow it directly pass the swings on to every process behind. One day is overloaded, the next day people wait. Large batches of one product leave other products out of stock until their turn comes. The institute lists further benefits compared with batch-and-queue production: lower work-in-process inventory, fewer defects multiplied across a batch and fewer uneven workloads that strain workers.

Leveling absorbs the swings in one place, at the point where the plan is made, so that the rest of the plant can run at a steady rhythm. It is closely linked to [takt time](https://www.lean.org/lexicon-terms/takt-time/), the available production time divided by customer demand, because the leveled pace is set by the takt.

In a production system with leveling, the production schedule no longer follows every fluctuation in orders. Leveling removes unevenness from the production flow and the workflow behind it, and it reduces waste such as waiting, overload and surplus inventory. Many plants use [heijunka](https://www.m365.fm/entity/heijunka/) together with takt, kanban and quick changeover, and they implement heijunka one line at a time.

There are two ways of leveling: by volume and by mix.

## How does leveling by volume work?

Leveling by volume smooths the quantity made each day. The institute gives an example. A producer receives 500 orders per week, but they arrive unevenly: 200 on Monday, 100 on Tuesday, 50 on Wednesday, 100 on Thursday and 50 on Friday. The producer keeps a small finished goods buffer near shipping to absorb Monday's peak, and aims to level production at 100 units per day through the week.

The idea is simple. Instead of building 200 on Monday and 50 on Wednesday, the plant builds 100 every day. The buffer covers the difference. The buffer is part of the system, not a failure of it. It has a size, a place and a rule for refilling.

This only works if demand over the week is reasonably predictable and the buffer is sized for the typical peaks. If demand changes sharply, the level has to be reviewed, as with takt.

## How does leveling by mix work?

Leveling by mix spreads the product types across the period. The institute's example is a shirt company with weekly demand of 5 units of Model A, 3 of Model B and 2 each of Models C and D. A mass producer would batch identical models together. A lean producer would run a repeating sequence, A A B C D A A B C D A B, and adjust it periodically as orders change.

The effect is that every product is made often, in small amounts. A customer who needs Model C does not wait until the batch of Model C comes up at the end of the week. The plant needs less finished stock of each model, because the next batch is never far away. And the load on each process is more even, because no single product dominates a day.

The price is more changeovers. A leveled sequence switches between products many times, so changeover time becomes the limiting factor. This is why leveling and quick changeover go together.

## How does a leveling box work?

A heijunka box is a tool for turning the leveled plan into daily work. The institute describes it as a tool used to level the mix and volume of production by distributing kanban at fixed intervals. It is also called a leveling box.

The structure is a grid:

- **Rows.** Each horizontal row holds one product type, identified by part number.
- **Columns.** Each vertical column is a fixed time interval for the paced withdrawal of kanban. In the institute's example, the shift starts at 7:00 a.m. and kanban are withdrawn every 20 minutes.
- **Kanban in the slots.** Each kanban in a slot represents one pitch of production for one product type.

The institute defines pitch as the takt time multiplied by the pack-out quantity. A material handler withdraws the kanban at each interval and distributes them to the production processes. Because demand is released in short increments rather than as a full shift's, day's or week's worth, the box levels both volume and mix.

In the institute's example, product A has a 20-minute pitch, so it gets one kanban per interval. Product B has a 10-minute pitch and gets two kanban per interval. Product C has a 40-minute pitch, so its kanban appear in every other interval.

## How do you introduce leveling in a plant?

Start small, and level the plan before you change the floor.

1. **Pick one line and a few products.** Choose products with regular demand and similar processes.
2. **Calculate takt.** Divide the net available time by customer demand.
3. **Set the pitch.** Multiply takt by a pack-out quantity that fits your containers.
4. **Build the leveled sequence.** Distribute the products evenly across the day, in proportion to demand.
5. **Check the changeovers.** Can the line switch as often as the sequence needs? If not, shorten the changeovers first, or level in larger steps.
6. **Plan the buffer.** Size a finished goods buffer for the typical swings in demand and mark its place.
7. **Release the work at fixed intervals.** Use a box, a board or a simple schedule.
8. **Review weekly.** Compare plan and actual, adjust the sequence and the buffer.

A leveled sequence is still a plan, and it must respect real limits. That is where [finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) helps: it plans each resource with its real capacity, so the sequence shows conflicts before the floor feels them.

## Example: batches versus a leveled day

This is an illustration with made-up numbers.

A line has 420 minutes of net available time per day and a daily demand of 140 units: 70 of product A, 40 of product B and 30 of product C. Takt is 420 ÷ 140 = 3.0 minutes. The pack-out quantity is 10, so the pitch is 3.0 × 10 = 30 minutes. That gives 420 ÷ 30 = 14 pitches per day: 7 for A, 4 for B and 3 for C.

**Batch plan.** A runs first for 7 pitches, then B for 4, then C for 3. Product C is made from minute 330 to 420, so it is available only at the end of the day. Each product appears once per day.

**Leveled plan.** The sequence over 14 pitches is A B A C A B A C A B A C A B.

- Product A appears 7 times, B 4 times and C 3 times, in proportion to demand.
- Product C is made every fourth pitch, about every 120 minutes.
- Each product is available several times per day.

Now the cost. The batch plan needs 2 changeovers per day. The leveled plan needs 13. If each changeover takes 30 minutes, the batch plan loses 2 × 30 = 60 minutes. The leveled plan would lose 13 × 30 = 390 minutes, which is impossible. To lose no more than the same 60 minutes, each changeover must fall below 60 ÷ 13, about 4.6 minutes. If the changeovers cannot be shortened that far, level in larger steps, for example by running two pitches of each product in a row. These numbers are assumptions. Check your own changeover times.

## Common mistakes

- **Leveling before shortening changeovers.** The sequence needs many changeovers. If each takes long, the plant slips back into batches.
- **No finished goods buffer.** Volume leveling relies on a small buffer near shipping. Without one, demand swings hit production again.
- **Starting with all products.** Begin with a few products on one line, learn and then expand.
- **A plan that is never reviewed.** Demand shifts. Review the sequence and the buffer at a fixed rhythm.
- **Ignoring capacity limits.** A level sequence that overloads one machine is not leveled. Check it against the real constraints.
- **Treating it as a scheduling trick.** Leveling changes how the whole plant runs, from material supply to staffing. Involve those teams.

## How software can help

Building a leveled sequence by hand is possible for a few products. With many products, shifts and machines, the plan has to respect more limits. iFAKT's [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities. Use such a plan as a starting point, and check with the team that the sequence works at the line.

## Next step

Pick one line with a few products, calculate takt and the pitch, and write down a leveled sequence for one day. Then measure your changeover times, because they decide whether heijunka works on that line.
