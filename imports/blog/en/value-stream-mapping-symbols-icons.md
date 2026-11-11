---
title: "Value Stream Mapping Symbols and Icons Explained"
summary: "Value stream mapping symbols show steps, stock and flows on one page. Learn the core icons, how push and pull look on a map and how to read a map step by step."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-vsm, value-stream-mapping, takt-time]
keypoints:
  - "A small core set of symbols is enough for a current state map: customer box, process box, data box, inventory triangle, information arrows and a timeline."
  - "A dashed line through an inventory triangle marks a push step, where a step produces whether or not the next step needs the work."
  - "Future state maps add supermarkets, kanban cards, kanban posts and a pacemaker to show pull and the point where production is scheduled."
  - "There is no single binding symbol standard. Books and software tools differ, so agree on one legend and use it on every map."
  - "Read a map by checking the arrows for material and information first, then compare the stock under each triangle with the timeline."
faq:
  - q: "What are the main value stream mapping symbols?"
    a: "The core symbols are the customer box, process boxes with data boxes underneath, inventory triangles between steps, arrows for material and information flow, a production control box and a timeline. Future state maps add supermarkets, kanban cards and a pacemaker. Together they show steps, stock, schedules and the time that work waits."
  - q: "Is there one official set of VSM symbols?"
    a: "No single set binds everyone. The Lean Enterprise Institute offers a downloadable set of value stream mapping icons, but books, trainers and software tools draw some symbols differently. What matters is a shared legend. Agree on the symbols with your team and use them in the same way on every map."
  - q: "What do push and pull look like on a value stream map?"
    a: "A push step is marked with a dashed line through the inventory triangle, because the step produces to its own schedule. Pull is shown with supermarkets, which hold stock, and kanban cards, which signal what to make or ship. A pacemaker marks the one process that is scheduled and sets the pace for the others."
---
Value stream mapping symbols are the small drawings that let you show process steps, stock, material flow and information flow on one page. This guide is for lean managers who read or draw maps and want to know what each symbol means. It covers the core symbols for a current state map, the extra symbols for a future state map, how to read a map and how to keep your legend consistent. A worked example reads a small map from its symbols.

## Which value stream mapping symbols do you need?

[Value stream mapping](https://www.m365.fm/entity/value-stream-mapping/) is a pencil-and-paper tool for seeing how material and information move through a product's path. The Lean Enterprise Institute (LEI) explains in its workbook *Learning to See* that you follow the path from the customer back to the supplier, draw each step and then draw a future state. The text uses simple labelled boxes and arrows. LEI also offers a downloadable set of value stream mapping icons on its [lexicon page](https://www.lean.org/lexicon-terms/value-stream-mapping/), but the page does not explain each icon.

There is no single binding standard, and books and software tools draw some icons differently. The list below follows the Gemba Academy guide to [creating a current state map](https://blog.gembaacademy.com/2008/02/24/lets-create-a-current-state-value-stream-map/). It is a common core, not a rulebook, and a good overview to start from:

- **Customer box.** A small box at the top right of the map. It holds the demand per month or day and the takt time. [Takt time](https://www.m365.fm/entity/takt-time/) is the pace at which you must complete a product to meet customer demand.
- **Process box.** One box for each step of the flow.
- **Data box.** A small table under each process box. It holds figures such as cycle time, number of operators, changeover time and defect rate.
- **Inventory triangle.** A triangle with the letter "I". The pieces waiting between two steps go under it. Many teams convert the pieces into days of supply.
- **Push indicator.** A dashed line through the triangle. It marks a step that pushes work forward whether or not the next step needs it.
- **Information flow arrows.** A straight arrow means manual communication, such as a printed schedule. A lightning-bolt arrow means electronic communication.
- **Production control box.** A box, often labelled with a planning system such as MRP, that sends schedules to the steps.
- **Timeline.** A saw-tooth line along the bottom. It separates value-added time from waiting time.

## How do material flow and information flow look on the map?

*Learning to See* calls material and information "two sides of the same coin". Material is the physical movement of the product through the plant. Information tells each process what to make next. You need both on the diagram, because the guiding question is how one process can make only what the next process needs, when it needs it.

On a map, this has a typical layout:

1. **Material flow** runs from left to right through the process boxes, with inventory triangles between them.
2. **Information flow** runs between the customer, the production control box and the steps. Arrows show who tells whom what to do and how.
3. **The timeline** sits at the bottom and adds the waiting time under each triangle and the working time under each box.

Look at the arrows first. A schedule that goes to every step at once, with a dashed line through every triangle, means each step produces to its own plan. That usually builds stock. A map that shows one scheduled process and signals between the steps tells a different story.

## Which symbols appear on a future state map?

The *future state map* shows the improved flow. Gemba Academy describes the symbols it adds in its guide to [creating a future state map](https://blog.gembaacademy.com/2008/02/26/lets-create-a-future-state-value-stream-map/):

- **Supermarket.** A holding point for finished goods or work in progress that controls stock levels.
- **Kanban.** A card that signals production or withdrawal. Withdrawal cards trigger shipments and production cards trigger replenishment.
- **Kanban post.** A goal-post symbol that is used to replenish a work-in-progress supermarket.
- **Pacemaker.** The one process that is scheduled. The guide describes it as typically the process step closest to the customer. The upstream steps respond through kanban.

A related term is the *FIFO lane*. LEI describes it as a painted lane or physical channel that holds a limited amount of inventory in order. The supplier fills it, the customer empties it, and when it is full the supplier stops. Many icon sets include a symbol for it, so check your legend.

Pull is the idea behind these symbols. A step makes what the next step has used, not what a schedule says. On the map, the dashed push line gives way to supermarkets and signals.

## How do you keep your symbols consistent?

A map only helps if everyone reads it the same way. Four habits keep a team on one legend:

- **Choose one set and write the legend on the page.** A short key in a corner saves discussion.
- **Use words as well as icons.** A label such as "weekly schedule, electronic" is clearer than an arrow alone.
- **Keep the drawing simple.** Draw only the symbols you need. A map with fewer symbols is easier to analyze.
- **Share a template.** A one-page value stream mapping template with the symbol set helps new team members draw in the same style.

Remember what LEI says about perfection. Its lexicon page notes that having a perfectly drawn current state map is not the point. The aim is to understand the flow, from dock to dock.

## Example: reading a small map from its symbols

This is an illustrative example with made-up numbers, not a measured case. A lean manager reads a current state map for one product family. The customer box shows demand of 120 units per day and 24,000 seconds of available time per day.

- **Takt time:** 24,000 ÷ 120 = **200 seconds**.
- **Stamping:** cycle time 20 seconds, inventory triangle with 480 units.
- **Bending:** cycle time 45 seconds, inventory triangle with 120 units.
- **Assembly:** cycle time 120 seconds, inventory triangle with 60 units.

Each triangle has a dashed line through it. A lightning-bolt arrow runs from a production control box to each step. The manager reads: each step receives a schedule by electronic message and produces to its own plan. That is a push system.

Now the timeline. Days of supply are the pieces divided by daily demand: 480 ÷ 120 = 4 days, 120 ÷ 120 = 1 day and 60 ÷ 120 = 0.5 days. Waiting time is 4 + 1 + 0.5 = **5.5 days**, or 5.5 × 24,000 = 132,000 seconds. Value-added time is 20 + 45 + 120 = **185 seconds**.

The share of time that adds value is 185 ÷ (132,000 + 185) = 0.0014, about **0.14 percent**. Every cycle time is below the takt time of 200 seconds, so no machine limits the flow. The biggest triangle sits in front of stamping, the first step, and the dashed lines show why: stamping produces to its own schedule and feeds the stock.

For the future state, she would look at a supermarket in front of assembly and kanban signals back to the earlier steps. She does not draw it yet. First she checks the counts on the floor.

## Common mistakes

- **Mixing symbol sets.** One map with icons from three books confuses readers. Choose one set.
- **Drawing symbols without data.** A triangle without a count, or a box without cycle time, tells you little.
- **Leaving arrows unlabelled.** State whether information is manual or electronic, and how often it is sent.
- **Using too many symbols.** Start with the core set. Add more only when you need them.
- **Drawing the symbols for the design, not the practice.** Show how the schedule really reaches the floor.
- **Skipping the legend.** Newcomers cannot read your maps without it.

## How software can help

Hand-drawn maps are quick, but a shared symbol library keeps teams consistent when many people draw maps. [iFAKT's Polaris VSM](https://www.m365.fm/entity/polaris-vsm/) is a module of iFAKT Polaris for data-based value stream mapping. It models material and information flows collaboratively and makes waste and bottlenecks visible. The meaning of each symbol still has to be agreed in your team.

## Next step

Print one legend page with the symbols you will use, and draw your next map with it. Then check each of your value stream mapping symbols against what you see on the floor.
