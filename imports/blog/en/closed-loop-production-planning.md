---
title: "Closed-Loop Production Planning: Closing the Gap Between Plan and Shop Floor"
summary: "Closed loop production planning feeds real progress back into the plan. Learn how the loop works, what data it needs and how plant managers can start."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [closed-loop-production-scheduling, polaris-operator, finite-capacity-scheduling, manufacturing-execution-system]
keypoints:
  - "Closed loop production planning means plan, execution, measurement and replanning form a continuous feedback loop, so schedules follow the real production state."
  - "A typical loop has four steps: detect that the plan is no longer valid, evaluate the effect, replan and communicate the change to the shop floor."
  - "The loop is only as good as its data, because without reliable progress reports a system cannot tell whether the plan is still valid."
  - "Replanning does not create capacity, but it lets you decide early which order slips and who must be told, instead of finding out at the end of the shift."
  - "Avoid constant plan changes: set rules for what triggers a replan and freeze the near term so that the shop floor is not confused."
faq:
  - q: "What is closed loop production planning?"
    a: "It is a way of working in which the production plan is not fixed after release. Progress, delays and disruptions are measured on the shop floor and fed back into planning, which updates the schedule from the current state. The shop floor then receives the new plan. Planning, execution, measurement and replanning form one continuous loop."
  - q: "What is the difference between open loop and closed loop planning?"
    a: "An open loop plan is created once and sent to the shop floor, and nobody checks whether it still holds. A closed loop plan receives feedback on what really happened, such as late jobs or a machine stop, and is revised. The difference is feedback: closed loop planning keeps the plan valid, open loop planning lets it age."
  - q: "How often should a plan be updated in a closed loop?"
    a: "It depends on how often disruptions happen and how fast you can act. Some plants replan after each important event, others at fixed times, such as each shift. Set clear triggers, for example a stop at the bottleneck, and keep the next few hours stable so that the shop floor does not face constant changes."
---

Closed loop production planning means that planning, execution, measurement and replanning form one continuous feedback loop. The schedule is not fixed once it is released. It is revised from the current state of production. This article is for plant managers who see plans fall apart by mid-morning and want to close the gap. You will learn how it works, what data it needs, how to start in steps and which mistakes to avoid.

## What is closed loop production planning?

Think of a heating system with a thermostat, a simple control system. It measures the room temperature and adjusts the heating. An open-loop plan, a plan without feedback, is a heater on a fixed timer. Open-loop planning vs closed loop planning is the difference between a fixed timer and a thermostat. In production, closed loop planning means that the schedule is adjusted from what actually happens: how far each job has progressed, which machine stopped, which material is late.

In [closed-loop production scheduling](https://www.m365.fm/entity/closed-loop-production-scheduling/), planning, shop floor execution, measurement, learning and replanning form a continuous feedback loop, so schedules are revised from the current production state instead of staying static after release.

The idea is old. A glossary entry for closed-loop MRP describes it as a system with a feedback feature that links tasks such as purchasing, scheduling and dispatching. See the [Capterra glossary entry on closed-loop MRP](https://www.capterra.com/glossary/closed-loop-mrp-closed-loop-material-requirements-planning/). Later, [MRP II](https://www.techtarget.com/searcherp/definition/closed-loop-manufacturing-resource-planning-MRP) widened the manufacturing planning process to other resources and added capacity planning, and both MRP and MRP II are seen as predecessors of ERP. What is new is that sensors, the internet of things, terminals and planning software make fast feedback possible for more plants. Industrial IoT sensors and automation help here. A closed loop links planning and execution in one planning system, from production planning and control to the production process itself, using real-time data.

## Why do plans drift away from the shop floor?

Every schedule rests on assumptions: machines run, material arrives, people are present, jobs take the planned time. On the day, some of these assumptions fail. A schedule with no feedback does not notice. Typical causes of deviation are:

- machine breakdowns and short stops
- late or missing material
- operator absences
- quality problems that need rework
- rush orders and priority changes from sales

A closed loop also helps the supply chain: when a replan moves a delivery date, purchasing and sales can react, and lead times promised to customers become more realistic. Without feedback, the planner learns about drift late, often at the end of the shift or the next morning. By then, the options are few. With feedback, the same event is visible within minutes, and there is still room to choose.

## How does feedback reach the plan?

Delfoi, a vendor of planning software, describes real-time rescheduling as a four-step closed loop. See its article on [real-time production rescheduling](https://delfoi.com/?p=25229). The steps are:

1. **Detect.** A signal shows that the current plan is no longer valid. It can come from a machine sensor, an ERP event or a supervisor.
2. **Evaluate.** Find the affected orders and a new feasible sequence, given resource availability, material status and priorities.
3. **Replan.** Create an updated schedule that respects machine capacity, tooling, skills and due dates.
4. **Communicate.** Send the update to displays at the line, supervisor dashboards and, where needed, to the customer delivery estimate.

The same article notes that rescheduling one job moves the later jobs on the same resources, so the effects should be visible. It also says that small events on low-priority jobs may be absorbed by buffers, while a stop at a bottleneck may require a full reschedule. The trigger is the event, not the habit of the planner.

For the replan step you need a schedule that respects real limits. That is the idea of [finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/): each resource is treated as limited, so conflicts between orders become visible. Feedback without this logic only tells you faster that the plan is wrong.

## Which data do you need?

Delfoi states that the quality of the output depends on the accuracy and freshness of the input, especially actual production progress. Without progress reporting, the system cannot tell whether the plan is still valid. It also warns about plans that look precise but do not match reality, and advises companies that track production in spreadsheets or lack reliable machine status data to close these gaps before or alongside new scheduling software.

The minimum feedback data:

- **Start and end of each operation,** or at least its status.
- **Quantities produced,** scrap and quality control results that trigger rework.
- **Machine status,** running or stopped, with a reason code.
- **Material status,** received, short or late.
- **Availability of people,** including absences.

Software that records production activity against work orders, such as a [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/), is one common source. Real-time feedback from the shop floor is the core of the loop. Paper sheets typed in after the shift are not enough, because the feedback arrives too late for the planning process.

## How do you avoid a plan that changes all the time?

Feedback can turn into noise. The Oracle glossary defines nervousness as a characteristic of MRP systems where minor changes to plans at higher levels cause significant changes at lower levels. See the [Oracle glossary](https://docs.oracle.com/cd/A60725_05/html/comnls/us/mrp/gls.htm). A closed loop can create a similar effect on the line if every small event rewrites the schedule. Three rules help:

1. **Define triggers.** For example a stop at the bottleneck longer than 20 minutes, a missing material for a job starting today or a new rush order. Small deviations are absorbed.
2. **Freeze the near term.** Keep the next hour or two stable, so that supervisors can prepare.
3. **Explain changes.** Show what moved and why. People follow a plan they understand.

## Example: a stop at the bottleneck

This example uses assumed numbers.

A bottleneck machine runs one shift of 7.5 hours, which is 450 minutes. Five jobs are planned back to back:

- J1: 90 minutes, due today
- J2: 60 minutes, due today
- J3: 120 minutes, due Friday
- J4: 75 minutes, due today
- J5: 105 minutes, due today

The total is 90 + 60 + 120 + 75 + 105 = 450 minutes. The plan fits the shift exactly.

Early in the shift, the machine stops for 90 minutes. Available time becomes 450 − 90 = 360 minutes.

**Open loop.** The plan stays as it is. The team works through the jobs in order. J1 to J4 need 345 minutes, so 15 minutes of J5 get done. J5 has 105 − 15 = 90 minutes left and is late. Planning learns this at the end of the shift.

**Closed loop.** The stop is reported at once. The system sees that 450 minutes of work no longer fit into 360. Job J3 is due only on Friday, so it can move. The remaining jobs need 450 − 120 = 330 minutes, which fits into 360 with 30 minutes to spare. All four jobs due today finish on time, and J3 moves to tomorrow.

Replanning did not create any capacity. It helped to optimize the use of the minutes that were left. It made a choice early, and it chose the job that could wait. If no job could wait, the system would show it just as early, so that the plant manager can decide on overtime or a call to the customer while there is still time.

## How do you start?

1. **Pick one area,** preferably the bottleneck and the steps around it.
2. **Make progress visible.** Start with simple status feedback per operation, not every detail.
3. **Agree triggers and owners.** Who decides, and within what time?
4. **Run it by hand first.** A short meeting at fixed times can replan on paper, to learn which events matter.
5. **Measure.** Track how often the schedule changes, how long a replan takes and how many orders were late. Use planned versus actual figures.
6. **Automate the steps that repeat.** Add tools for data capture and replanning once the routine works.

## Common mistakes

- **Replanning without reliable data.** A fast wrong plan is worse than a slow right one. Real-time feedback needs real-time data collection.
- **Changing the schedule for every small event.** Define triggers and absorb small deviations in buffers.
- **Ignoring the people who execute the plan.** Supervisors must be able to accept the new plan, or the change stops at the screen. Include them from the start.
- **Treating this as a software project.** Treat it as a methodology first, and agree roles, triggers and reaction times before you integrate any manufacturing software.
- **No freeze window.** A schedule that changes every ten minutes cannot be followed.
- **Not learning from replans.** Use simple analytics on the causes of replans. Repeated causes point to problems to fix, such as a machine that stops again and again.

## How software can help

A closed loop needs two directions: plans to the floor and progress back to planning. [iFAKT's Polaris Operator](https://www.m365.fm/entity/polaris-operator/) is a module of iFAKT Polaris that brings production plans to the shop floor as time-based tasks and feeds progress back to planning in real time. When you evaluate tools, check how workers report progress, how fast a replan appears for the crew and how changes are explained to the people who must act.

## Next step

Pick the bottleneck in your plant, list the five events that most often break the plan and decide who reacts to each one, and how fast. That is the first working version of closed loop production planning, and it needs no new software.
