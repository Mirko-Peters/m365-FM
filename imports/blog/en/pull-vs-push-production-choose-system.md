---
title: "Pull vs Push Production: How to Choose the Right System"
summary: "A pull system starts work only when the next step signals a need. Compare pull vs push production and learn when to use each, with a worked example and steps."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-optimizer, value-stream-mapping, kanban]
keypoints:
  - "Push production makes parts based on a forecast or schedule. Pull production starts work only when a downstream step signals a need."
  - "The practical test is a work in progress limit: a pull system explicitly caps the work in process, a push system does not."
  - "The Lean Enterprise Institute describes three pull types: supermarket pull, sequential pull and mixed pull."
  - "Many plants need both. Use pull where demand is steady and parts are few, and push or sequenced pull where demand or variety is high."
  - "Introduce pull on one flow, set a clear WIP limit, and use a value stream map to find where the signal should start."
faq:
  - q: "What is the difference between push and pull production?"
    a: "Push production makes items based on forecasts or a schedule and passes them on, whatever the next step needs. Pull production starts work only when a downstream step signals a need. The practical test is whether the system explicitly limits work in process. If it does, it is a pull system. If not, it is push."
  - q: "Is kanban a pull system?"
    a: "Yes. Kanban is a common way to run a pull system. Cards or other signals tell an upstream process what to make and how much, and the number of cards caps the work in process. When no card comes back, the upstream step stops. Kanban is a tool for pull. It is not the only one."
  - q: "Is just-in-time a pull or push system?"
    a: "Just-in-time is built on pull. The Lean Enterprise Institute lists pull production as one of three major components of a complete just-in-time system. Upstream work starts when a downstream step signals a need, so the plant makes only what is needed, when it is needed and in the amount needed."
---

A pull system starts work only when the next step signals that it needs something. A push system makes parts based on a forecast or schedule and passes them on, whether the next step is ready or not. This article is for production planners who must decide which logic fits which part of their plant. It explains the two systems, the three types of pull, a decision guide, a worked example with numbers and the mistakes that make pull fail.

## What is a pull system, and how does it differ from push?

The Lean Enterprise Institute defines [pull production](https://www.lean.org/lexicon-terms/pull-production/) as a method of production control in which downstream activities signal their needs to upstream activities. The downstream operation tells the upstream one which part is needed, how many, and when and where. Upstream work starts only after that signal arrives. The institute says pull strives to eliminate overproduction and calls it one of three major components of a complete just-in-time system.

Its lexicon defines [push production](https://www.lean.org/lexicon-terms/push-production/) as processing large batches of items at a maximum rate, based on forecasted demand, and then passing them downstream or into storage regardless of the actual pace of work in the next process. That makes it virtually impossible, it says, to establish the smooth flow of work from one process to the next that is the hallmark of lean production.

Plain words: push produces to a plan. Pull produces to a signal.

There is a sharper test than "who triggers the work". An article on [the true difference between push and pull](https://www.allaboutlean.com/de/en-the-true-difference-between-push-and-pull/) cites Hopp and Spearman: a pull production system is one that explicitly limits the amount of work in process that can be in the system. The article argues that the difference has nothing to do with the physical pulling or pushing of material or information. By this test, a plan in a spreadsheet can still run as pull if it has a hard cap on work in process, and a card system without a cap is push.

## What do push and pull look like on the shop floor?

In a **push** plant, the planning system, for example an [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/) or a spreadsheet, releases orders based on forecast and due dates. Each step works at its own pace and passes parts to the next step or to storage. Typical signs:

- Stock of semi-finished parts piles up between stations.
- Some stations stand idle while others have a queue.
- Expediting is a daily job: someone chases the part that is missing.
- Lead times are long and hard to predict.

In a **pull** plant, each step makes only what the next step asks for, up to a fixed limit. Typical signs:

- Small, defined stocks sit between steps, often with marked places.
- A step stops when its buffer is full. That stop is a signal, not a failure.
- Lead times tend to be shorter and easier to predict.
- Problems show up fast, because there is no big stock to hide them.

In lean manufacturing terms, push often means building finished goods to stock from a forecast, while pull means making to a customer order or to the refill of a buffer. The same logic applies to raw material, work in process and finished goods, across the supply chain and the production process, and it shapes inventory management and inventory control at every link.

Neither system is "good" in itself. They solve different problems, and many plants run both.

## What types of pull are there?

The Lean Enterprise Institute describes three types of pull in its lexicon entry.

1. **Supermarket pull** (also called a-type, fill-up or replenishment). Each process keeps a stocked buffer of every product it makes. When downstream withdraws items, a signal goes upstream so that the process can refill what was taken. Each process is responsible for its own supermarket, which keeps daily management simple. The drawback: each process must hold stock for every part number, which may be impractical when there are many.
2. **Sequential pull** (b-type). Used when there are too many part numbers to stock in supermarkets. Products are made to order while overall inventory stays low. Scheduling sets the mix and quantity, and the sequence is passed to the first upstream process. This needs predictable lead times and well-understood order patterns, and it demands strong management.
3. **Mixed pull** (c-type). It combines both. High-volume items may use supermarkets, and low-volume items use a special kanban that represents a block of capacity. It suits complex demand, but it is harder to balance and needs discipline.

A [kanban](https://www.m365.fm/entity/kanban/) card is the most common signal. Pull systems often use kanban cards to communicate demand upstream. Withdrawing material from a supermarket sends a signal that authorizes the supplier to replace it.

## When should you choose push, pull or a mix?

Use these questions as a guide. They are a planning aid, not a rule from a standard.

- **Is demand steady, and are there few part numbers?** Supermarket pull works well. Buffers are small and refilled quickly.
- **Is variety high, with many part numbers and low volumes per item?** Stocking each one is costly. Consider sequential pull or a mix, or plan the sequence centrally.
- **Are lead times and order patterns predictable?** Sequential pull needs them. If they are not, fix that first.
- **Is a step far away, or does it run only in large batches?** A heat treatment oven or a supplier overseas may need push for that link, with pull on both sides. Break the flow there, not everywhere.
- **Is the demand forecast reliable, and is stock cheap?** Then push is fine. Do not pull for its own sake.

Push and pull can share a plan. The central plan sets the mix and the volume, and pull signals control the execution inside each area, with a cap on work in process. This combination is possible: the allaboutlean article notes that a digital kanban can sit alongside a central plan, and that MRP can be set up as a pull system.

## How do you introduce a pull system step by step?

1. **Pick one flow.** Choose a product family with steady demand and a clear sequence of steps.
2. **Map it.** A [value stream map](https://www.m365.fm/entity/value-stream-mapping/) shows where the stock is and where the flow breaks. The signal usually starts at the point where one step feeds the next without flow.
3. **Choose the type.** Supermarket, sequential or mixed, using the questions above.
4. **Set the limit.** Decide the maximum work in process for each link. Start generous and reduce it step by step as you fix the problems it exposes.
5. **Mark the buffers.** Give every buffer a place, a label and a maximum.
6. **Define the signal.** A card, an empty container or an electronic message. Write down who sends it, to whom and when.
7. **Train and watch.** Run the new rule for a few weeks, with the team leader at the line.
8. **Review.** Check stock, lead time and stops. Lower the limit when the flow is stable.

## Example: a limit on work in process

This is an illustration with made-up numbers.

Station A makes 60 parts per hour. Station B, the next step, handles 40 parts per hour. A shift has 8 hours.

**Push.** A runs at its maximum rate and passes parts to B, whatever B can handle.

- A makes 60 × 8 = 480 parts.
- B processes 40 × 8 = 320 parts.
- The queue in front of B after the shift: 480 − 320 = 160 parts.
- A new part arriving at the end of the queue waits 160 ÷ 40 = 4 hours.

**Pull with a limit.** The buffer in front of B holds at most 40 parts. When it is full, A stops.

- B still processes 40 × 8 = 320 parts. Output does not change, because B sets the pace.
- A makes only about 320 parts and has idle time.
- The queue is at most 40 parts. A new part waits at most 40 ÷ 40 = 1 hour.

The plant makes the same number of good parts, with 120 fewer parts in the queue and a waiting time of 1 hour instead of 4. The idle time at A looks like waste, but it only shows that A was overproducing. The team can use that time for changeovers, maintenance or training, or reassign people to B. The numbers are assumptions. Measure your own queues.

## Common mistakes

- **Pulling everything.** Some links, such as large ovens or distant suppliers, need batches. Use pull on each side of them.
- **Cards without a limit.** If the number of cards or containers is not capped, the system is still push.
- **A limit that is too tight, too soon.** Without fixing the causes of stops, a tight limit starves the next step. Lower it step by step.
- **Treating idle time as a failure.** A stop when the buffer is full is the system working. Use the time for improvement.
- **Ignoring demand swings.** If demand changes sharply, the buffers and the plan need review. Pull does not remove variation.
- **No owner of the rules.** Someone must own buffer sizes and review them.

## How software can help

Pull controls execution, but plants still need a good plan for the mix, the sequence and the capacity. That is true for push links and for sequenced pull. iFAKT's [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities. Use such a plan as the frame, and let the pull signals handle the daily variation. Check the plan with the people who run the line.

## Next step

Pick one flow, map it and set a clear limit on work in process between its two busiest steps. Run it for four weeks and compare the queue and the lead time with your baseline, then decide where else the pull system fits.
