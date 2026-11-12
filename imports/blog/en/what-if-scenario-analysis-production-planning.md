---
title: "What-If Scenario Analysis in Production Planning: A Method"
summary: "What if scenario analysis production planning means copying the plan, changing one assumption and comparing results. Learn the steps, data, tools and checks."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [factory-simulation, dynamics-365, power-bi, polaris-simulator, polaris-optimizer, ifakt]
keypoints:
  - "A what-if scenario takes your baseline plan, changes one assumption such as a machine outage or a rush order, and compares the result with the baseline before anything happens for real."
  - "Start with the decision, then pick two or three levers and two or three KPIs, because a scenario without a decision behind it is only an exercise."
  - "Change one lever at a time first, and combine levers only after you understand each effect alone."
  - "Test the model against a past period before you trust it with a future one, since a model's value depends on whether its output is accurate enough for its purpose."
  - "Microsoft tools cover parts of the job: Dynamics 365 master plans can hold alternative planning strategies, and Power BI what-if parameters suit simple calculations, not schedule sequencing."
faq:
  - q: "What is what-if scenario analysis in production planning?"
    a: "It is a way to test a decision on paper before you make it. You keep a baseline plan, change one assumption such as a machine outage, a rush order or a shift change, and compare the new result with the baseline. You see the impact on delivery dates, load and cost without touching the real plant."
  - q: "What is the difference between what-if analysis and simulation?"
    a: "What-if analysis is the question you ask, and simulation is one way to answer it. You can answer a what-if question with a spreadsheet, a planning run in your ERP system or a simulation model. The more constraints interact, such as shared machines, setups and shifts, the more a simulation helps."
  - q: "How many scenarios should I run?"
    a: "Fewer than you think. Start with the baseline and three to five scenarios that each answer a real decision, changing one lever at a time. Add combined cases only after the single effects are clear. More scenarios than the team can discuss in one meeting produce reports, not decisions."
---

What-if scenario analysis in production planning means keeping a baseline plan, changing one assumption, and comparing the result before anything happens for real. The assumption can be a machine that stops for two shifts, a rush order, a missing material or a new shift model. The comparison shows what each choice does to delivery dates, load and overtime. This article is for production planners who want a repeatable method, not a one-off spreadsheet, and who need to know what data, tools and checks make the answers trustworthy.

## What is a what-if scenario, and what is it not?

A scenario is a coherent set of assumptions about the future, run against the same model as your baseline. The baseline is your best current plan. Everything else is a variation of it.

It's worth separating three ideas that people mix up.

- **A forecast** says what you expect to happen. A scenario says what happens if something specific does.
- **A what-if question** is the question you ask. [Factory simulation](https://www.m365.fm/entity/factory-simulation/) is one way to answer it, by running a model of the plant with chosen inputs. A spreadsheet or a planning run in your ERP system is another.
- **A sensitivity check** varies one input across a range to see how much the result moves. It tells you which assumptions deserve your attention.

The point of all three is the same: to learn the consequences of a decision while it is still cheap to change your mind.

## Which decisions are worth a scenario?

Run a scenario when a decision is costly to reverse, when several constraints interact, or when the answer isn't obvious from experience. Typical triggers in production planning:

- A bottleneck machine will be down for maintenance, and you must choose which orders slip.
- A customer asks for an earlier date. What does it push back, and who pays?
- Absence or holidays reduce staffing for a week.
- A supplier announces a delay on a key material.
- The product mix is about to change, and you want to know whether the current capacity still works.
- You're considering a second shift, a new buffer or extra tooling.

Skip scenarios for decisions that are cheap and quick to undo, and for questions where the plan is already feasible with plenty of slack. A scenario costs a planner's time, and it should buy a better decision.

## How do you run a what-if scenario analysis in production?

Here is a sequence that works in a spreadsheet and in specialized software.

1. **Write down the decision.** One sentence: "We have to decide X by Friday." If you can't, you don't need a scenario yet.
2. **Freeze the baseline.** Save the current plan with its assumptions: calendars, cycle times, order list, material availability. Every scenario is compared with this version, so it must not change under you.
3. **Choose the levers.** The levers are the things you can change or that might change: capacity, staffing, order priorities, due dates, material arrival. Pick two or three that matter for this decision.
4. **Set realistic ranges.** Ask the people who know. How long does a typical repair take? How often do suppliers deliver late, and by how much? Don't invent numbers; use your own history, and mark any estimate as an estimate.
5. **Pick the measures.** Two or three KPIs are enough: on-time delivery, lead time, utilization of the bottleneck, overtime hours, work in process. State them before you run anything, so nobody picks the favorable one afterwards.
6. **Change one lever at a time.** Run each scenario against the baseline. Combine levers only once you understand each effect on its own.
7. **Compare and decide.** Put the baseline and the scenarios side by side. Discuss what you'd do in each case, and write down the decision and the reason.
8. **Keep the record.** Save the assumptions and the result with the decision. You'll need them when you review what really happened.

Here is a hypothetical example, invented only to show the logic. A cell has one bottleneck press that makes 300 units per shift. The plant runs ten shifts a week, so capacity is 3,000 units. This week's orders add up to 2,700 units, which is 90% of capacity. The baseline is feasible, with one shift of slack.

- **Scenario A:** The press is down for two shifts. Capacity drops to eight shifts, or 2,400 units. That leaves 300 units uncovered, so some orders miss their dates.
- **Scenario B:** Same outage, plus a Saturday shift. Capacity is back to 2,700 units, but load is now 100%. Any further disturbance means a missed date.
- **Scenario C:** Same outage, and the planner moves 300 units of low-priority orders to next week. The key orders ship on time, and one customer gets a call today, not a surprise on Friday.

None of this needs a sophisticated tool. It needs a baseline, one lever and an honest comparison. The value is in seeing that B looks like a solution but carries no reserve.

## What data and tools do you need?

Start with what you have. A scenario needs the same inputs as the plan itself: orders and due dates, routings and cycle times, resources and calendars, material availability. If these are unreliable, every scenario inherits the error. Fix master data first, or you will argue about the model instead of the decision.

Then choose the tool by the complexity of the question.

- **A spreadsheet** is fine when one or two resources and a handful of orders drive the answer, as in the example above.
- **Your ERP planning run** can handle material-driven questions. In [Dynamics 365](https://www.m365.fm/entity/dynamics-365/) Supply Chain Management, [master plans](https://learn.microsoft.com/en-us/dynamics365/supply-chain/master-planning/master-plans) let you simulate different planning strategies, and Microsoft's documentation notes that you can set up as many plans as you like and keep some of them for different forecasts or simulations. Check with your implementation partner how this fits your version and your planning engine, because the page doesn't describe scenario handling in detail. Master planning works on materials and capacity at a coarse level, and it isn't a detailed sequencing tool.
- **A finite-capacity scheduler or a simulation model** is the right choice when shared machines, sequence-dependent setups, shifts and skills interact. In that case a simple calculation can look fine while the daily schedule is infeasible.
- **[Power BI](https://www.m365.fm/entity/power-bi/)** is a good place to show scenario results to managers. Its [what-if parameters](https://learn.microsoft.com/en-us/power-bi/transform-model/desktop-what-if) let users move a slider and see a measure change. Microsoft says they are designed for use in measures within visuals, and a parameter can have at most 1,000 unique values. That makes them useful for simple questions such as "what does 5% more scrap do to output?" They don't sequence a schedule. Treat them as a front end for results, not as the engine.

Whichever tool you choose, keep two things outside it: the written assumptions and the decision log. Tools change, and documents survive.

## How do you know the answers can be trusted?

A scenario is only as good as the model behind it. Three checks help.

**Backtest it.** Run the model on a past period where you know what happened. Compare its output with the real results. In the simulation literature this is called operational validity: whether a model's output behavior is accurate enough for its intended purpose, within the range of conditions it will be used for. A paper by Sargent and colleagues from the [Winter Simulation Conference](https://www.informs-sim.org/wsc15papers/005.pdf) frames it this way and points out that the model user's risk, accepting a wrong model, must be kept small. In plain words, if the model can't reproduce last month, don't use it to decide next month.

**Know your drivers.** Vary each assumption across its range and see which ones move the result. Often two of them dominate. Those deserve better data. The rest can stay rough.

**Show the range, not one number.** A statement like "we ship on Thursday" suggests precision you don't have. "Between Wednesday and Friday, depending on repair time" is more honest and more useful. Decision-makers can handle uncertainty if they can see it.

## How do you make it a habit instead of a project?

Scenario work fails when it depends on one person's spreadsheet. A few practices keep it alive.

- **Name an owner** for the baseline and the model data. Without one, the model drifts away from the plant.
- **Hold a short weekly slot** where the planner, production lead and, when needed, purchasing and sales review the open questions. Bring two or three scenarios, not twenty.
- **Review afterwards.** When the week is over, compare what happened with what the scenario said. Where was it off, and why? Update the model or the ranges.
- **Share the logic, not only the output.** If the production lead understands the assumptions, they will challenge them early, which is the point of the exercise.
- **Keep finance in the loop.** Cost questions, such as overtime against a late delivery, need the same scenarios with cost figures added. Agree on the cost inputs once so the numbers don't change between meetings.

Live data helps once the basics work. If actual progress flows back into the plan, scenarios start from the real state of the plant rather than from yesterday's plan. Get the logic and the master data right first. A live feed on top of a weak model just produces wrong answers faster.

## Common mistakes

- Running scenarios without a decision behind them.
- Changing several levers at once, so nobody knows what caused the effect.
- Comparing scenarios with a baseline that has changed in between.
- Using best-case numbers for cycle times and repair times.
- Skipping the backtest because the model "looks right".
- Reporting one number instead of a range.
- Building scenarios for everything and acting on none of them.
- Forgetting to record the decision, so the review has nothing to compare.

## Where Polaris fits

If your what-if questions involve shared machines, shifts and changing product mixes, a simulation of the production system can answer them faster than a spreadsheet. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, working with ERP data. The [Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) module tests the production system virtually before real decisions, including capacity, staffing and buffer scenarios, and shows bottlenecks and utilization imbalances. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module creates an optimized plan under constraints and analyzes the impact of disruptions. Try it on one real decision first, and check the results against a spreadsheet calculation you trust.

## Related topics to explore

- **Disruption planning:** how to prepare standard responses for machine outages, late material and absence.
- **Capacity versus finite scheduling:** why a weekly load view can look fine while the daily schedule fails.
- **Product mix changes:** testing how a shift toward complex variants moves the bottleneck.
- **Model validation in practice:** comparing simulated and real lead times for a past period.
- **Scenario reporting:** showing baseline and scenarios side by side in Power BI so managers can follow the logic.

## Next step

Take the next decision on your desk and write it as one sentence. Then save your current plan as the baseline and run three scenarios on it, changing one lever at a time. That small round of what-if scenario analysis in production planning will show you whether the method earns a place in your weekly meeting.
