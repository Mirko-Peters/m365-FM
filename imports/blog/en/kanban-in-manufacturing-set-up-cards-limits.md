---
title: "Kanban in Manufacturing: How to Set Up Cards and Limits"
summary: "Kanban in manufacturing uses cards and limits to make a pull system work. Learn the card types, how to set up the loop and how to size your WIP limits."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-operator, continuous-improvement, kanban]
keypoints:
  - "A kanban is a signal that authorizes production or withdrawal of items in a pull system. Cards are the most common form."
  - "A production kanban tells an upstream process what and how much to make. A withdrawal kanban authorizes moving parts downstream."
  - "The number of cards in a loop is the work in progress limit. Parts are never made or moved without a card."
  - "Set the first limit lower than feels comfortable and treat it as a hypothesis. Review it on a fixed rhythm and adjust."
  - "Kanban exposes problems such as stops and late supply. Use them as input for improvement, not as a reason to add cards."
faq:
  - q: "What is kanban in manufacturing?"
    a: "Kanban is a signaling system that controls production in a pull system. A card or other signal authorizes an upstream process to make or move a defined quantity of parts, and only when a downstream process has used them. It limits work in progress and shows what to make next."
  - q: "How many kanban cards do you need?"
    a: "Enough to cover demand during the time it takes to replenish a container, plus a small safety margin. Count the containers the next process uses while one container is refilled and returned, then add one. Start with fewer cards than feels comfortable and adjust after observing stockouts and queues for a few weeks."
  - q: "What is the difference between kanban and a kanban board?"
    a: "A kanban is the signal that triggers production or movement of parts, such as a card, an empty container or an electronic message. A kanban board is a visual display, physical or digital, that shows work in stages and often limits how much each stage can hold. Both express the same idea of limiting work in progress."
---

Kanban in manufacturing is a signaling system that makes a pull system work: a card or other signal tells a process what to make and how much, and nothing is made without it. This article is for production leads who want to set up kanban cards and work in progress limits on a real line. It explains the card types, the loop, the setup steps and how to size limits. It gives a worked example with numbers and the mistakes that make kanban fail.

## What is kanban in manufacturing?

The Lean Enterprise Institute defines a [kanban](https://www.lean.org/lexicon-terms/kanban/) as a signaling device that gives authorization and instructions for the production or withdrawal, also called conveyance, of items in a pull system. The word is Japanese for "sign" or "signboard". The lexicon states the core idea: as long as no parts are produced or moved without a kanban, a true pull system is maintained.

That ties kanban to the wider idea of [pull production](https://www.lean.org/lexicon-terms/pull-production/), in which downstream activities signal their needs to upstream activities. The signal replaces the forecast. In the words of the [Kaizen Institute](https://kaizen.com/insights/what-is-kanban/), the cards in Toyota's system indicated precisely when a production line required additional components, replacing forecasts with actual demand.

[Kanban](https://www.m365.fm/entity/kanban/) is one tool inside lean manufacturing and just-in-time production. It is a visual signal for the manufacturing process, and it helps to reduce waste and shorten lead time. It does three jobs:

- It **limits work in progress** (WIP). The number of cards sets a hard upper limit.
- It **prevents overproduction**. Without a card, nothing is made.
- It **makes the state of the flow visible**. An empty buffer or a pile of cards shows where the line is stuck.

## What types of kanban cards are there?

The lexicon names three main types.

1. **Production kanban.** It tells an upstream process what type and how much to make for a downstream process. In the simplest case, one card stands for one container of parts.
2. **Withdrawal kanban**, also called conveyance kanban. It authorizes moving parts to a downstream process. It takes two forms: an internal kanban between processes and a supplier kanban for external suppliers.
3. **Signal kanban.** It is used in large-batch settings, such as a stamping press with short cycle times and long changeovers. It triggers production once a minimum number of containers is reached.

The same page notes that cards are the most common form. A card may list the part name and number, the supplier, the pack-out quantity, the storage address and the address of the consuming process. A barcode is optional. Other forms include triangular metal plates, coloured balls and electronic signals. The form does not matter. The rule does: no signal, no production.

## How does a kanban system work?

Take two processes: a supplying process and a consuming process, with a small supermarket, a defined buffer of full containers, between them.

1. The consuming process takes a full container from the supermarket.
2. The withdrawal kanban comes off. In the lexicon's description, it is removed when the first item of the container is used and carried back to the supermarket. A production kanban is removed when a container is taken, which triggers replenishment.
3. The card travels to the supplying process and tells it what to make: part, quantity, destination.
4. The supplying process makes one container and attaches the card.
5. The full container goes to the supermarket, and the loop is closed.

The number of cards in the loop caps the stock. If all cards are on full containers, the supplying process stops, because it has no authorization. That stop is not a failure. It is the system preventing overproduction. If all cards sit at the supplier, the consuming process is at risk of running dry, and the loop needs attention.

A kanban board works on the same logic in another form. It shows each stage as a column, and each column has a limit. The Kaizen Institute describes the work in progress limits as a hard cap on how many cards a column can hold, and lists six principles: visualize the workflow, limit work in progress, manage flow, make policies explicit, implement feedback loops, and improve collaboratively. Manufacturing teams often use both: cards for material replenishment and a board to show the state of orders.

## How do you set up cards and limits?

Start with one flow, not the whole plant.

1. **Pick the flow.** Choose a part family with steady demand and a clear supplying and consuming process. Rare, odd-sized parts are poor candidates to start.
2. **Map the current workflow.** Write down how material actually moves today, not how the procedure says. The Kaizen Institute also advises this first step for any kanban system.
3. **Choose containers and quantities.** Define a standard container and a fixed pack-out quantity. One card stands for one container.
4. **Design the buffer.** Give the supermarket a marked location and a place for each part number. Mark the maximum.
5. **Design the card.** List the part name and number, the quantity, the supplier and the consumer. Keep it simple enough to read at a glance.
6. **Set the initial number of cards.** Use the reasoning in the next section.
7. **Write the rules.** For example: no card, no production. Cards go back in the order they were removed. A card never leaves the loop.
8. **Launch with the team.** Train the operators who use the cards every day and explain what a stop means.
9. **Review on a fixed rhythm.** Check stockouts, queues and idle time each week and adjust.

## How do you size and tune the limit?

Neither of the sources gives a universal formula for the number of cards. The Lean Enterprise Institute notes that in the simplest case a card equals a container, and the Kaizen Institute says to set the first limit lower than feels comfortable and treat it as a hypothesis to test, not a fixed rule. So treat the card count as something you learn.

A practical way to find the first number is to ask how many containers the next process consumes while one container is replenished and returned.

- Measure the **replenishment time**: from the moment a card comes off to the moment a full container is back in the supermarket.
- Measure the **consumption rate**: containers used per hour.
- Multiply the two. That is the number of containers the consumer needs to survive one loop.
- Add a small safety margin, for example one container, and then reduce it step by step as the loop becomes stable.

This is a rule of thumb, not a standard. Review it whenever demand, container size or the replenishment time changes. Do not add cards each time the line stops. A stop is a clue to a cause such as a long changeover or an unreliable machine. Adding cards hides the cause and brings back the stock you wanted to remove.

## Example: sizing one loop

This is an illustration with made-up numbers.

A consuming station uses 40 parts per hour. A standard container holds 20 parts, so the station uses 40 ÷ 20 = 2 containers per hour. The team measures the replenishment time at 1.5 hours.

- Containers consumed during one loop: 2 × 1.5 = 3.
- Add a safety margin of 1 container: 4 cards.
- Work in progress limit: 4 × 20 = 80 parts.

After four weeks without stockouts, the team investigates the longest part of the loop, a wait of up to 45 minutes for the forklift. They agree on a fixed pick-up every 15 minutes, which cuts the wait to at most 15 minutes. The loop shortens by 30 minutes, to 1 hour.

- New consumption during one loop: 2 × 1 = 2 containers.
- With the same margin of 1: 3 cards.
- New limit: 3 × 20 = 60 parts.

The stock in the loop falls from 80 to 60 parts, a reduction of 25%, and the cause of the delay is gone rather than hidden. Real loops have uneven demand and varying times, so test the numbers on your own line.

## Common mistakes

- **Adding cards whenever there is a stop.** It removes the signal. Find the cause instead.
- **Cards without discipline.** If people produce without a card, the system is not pull any more.
- **Too many part numbers at once.** Start with a few high-volume parts and add more when the loop works.
- **Unmarked buffers.** If there is no marked place and maximum, nobody sees when the limit is exceeded.
- **No review.** Demand changes. A loop sized once and never reviewed drifts out of balance.
- **Ignoring the bottleneck.** Put the first loop around the process that feeds your constraint, because stock and stops cost most there.
- **Using it for everything.** Parts with rare, irregular demand may be better planned than stocked.

## How software can help

Kanban handles replenishment, but the line still follows a production plan, and the plan changes during the shift. Software can show the current plan as tasks for each work place and show how far the work has progressed. iFAKT's [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) brings production plans to the shop floor as time-based tasks and feeds progress back to planning in real time. Keep the cards where they work well, and use software to link the plan to the floor, as part of [continuous improvement](https://www.m365.fm/entity/continuous-improvement/).

## Next step

Choose one part family with steady demand, measure the replenishment time and consumption rate, and set the first card count with a safety margin of one. Review the loop in four weeks and lower the limit if kanban in manufacturing is working without stockouts.
