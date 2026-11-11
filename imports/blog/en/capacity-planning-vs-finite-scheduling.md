---
title: "Capacity Planning vs Finite Capacity Scheduling: What Plants Need"
summary: "Finite capacity scheduling or capacity planning? Learn how they differ, why infinite loading fails on the shop floor and when a plant needs a feasible schedule."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [finite-capacity-scheduling, polaris-optimizer, bottleneck, enterprise-resource-planning]
keypoints:
  - "Capacity planning estimates over a longer horizon whether you have enough resources, while finite capacity scheduling places each operation on a real resource calendar."
  - "Classic MRP and capacity requirements planning plan with infinite capacity, so they can book more work on a machine than it can do in the time available."
  - "A finite schedule shows conflicts between orders early and gives delivery dates that reflect achievable output instead of theoretical lead times."
  - "Plants with recurring bottlenecks, high product mix, short lead times or frequent order changes benefit most from finite scheduling."
  - "A finite schedule is only as reliable as its inputs, so use measured capacity, setup times and real shift calendars."
faq:
  - q: "What is the difference between capacity planning and finite capacity scheduling?"
    a: "Capacity planning looks at a longer horizon and estimates whether you have enough machines, people and hours to meet expected demand. Finite capacity scheduling works at the detailed level. It assigns each operation to a specific resource at a specific time, and never loads a resource beyond the time it has available."
  - q: "Does my ERP system already do finite capacity scheduling?"
    a: "Not always. An ERP system that plans materials with classic MRP logic assumes unlimited capacity, and may add a capacity check afterwards. Ask your vendor whether the system sequences orders on real resource calendars and moves jobs when a resource is full. If not, planners usually fix the conflicts by hand in spreadsheets."
  - q: "Can finite capacity scheduling and MRP work together?"
    a: "Yes. MRP continues to calculate material needs and purchasing, while finite scheduling sequences the production orders on the available resources. The dates from the finite schedule can then be fed back into the ERP system, so the material plan and the shop floor plan stay aligned."
---

Finite capacity scheduling treats every machine, person and station as limited and places each operation on a real calendar, so that conflicts between orders show up before the work starts. Capacity planning, by contrast, checks over a longer horizon whether you have enough capacity in total. This article is for production managers who need reliable delivery dates. You will learn the difference, why infinite loading fails on the shop floor, when you need a feasible schedule and how to avoid the usual mistakes.

## What is finite capacity scheduling?

[Finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) plans production operations onto real resource calendars. Each resource can do only so much work in a day. When a resource is full, the next job moves to the next open slot, and the schedule shows when the work can actually finish.

An article from the planning software vendor Delfoi describes it the same way: operations are loaded onto resources only up to their available capacity. The model takes in shift patterns, planned downtime, tooling, material availability and workforce skills. It works at the short-horizon, detailed level, and takes the material needs from MRP and sequences them into a plan that can be executed. See the Delfoi article on [finite capacity scheduling and MRP](https://delfoi.com/?p=25192).

Three things make a finite capacity schedule realistic:

- **Limited resources.** Capacity constraints are real: a machine cannot run two jobs at the same time.
- **Real calendars.** Shifts, breaks, holidays and planned maintenance count.
- **Visible conflicts.** If orders compete for the same resource, the schedule shows it, instead of leaving the conflict for the shop floor to solve.

## How is capacity planning different from scheduling?

The two answer different questions.

**Capacity planning** asks: do we have enough capacity for the expected demand? It works over weeks or months, in hours per work center. It helps decide about people, machines, shifts and investments.

**Scheduling** asks: what runs where, and when? It works over days or hours, per resource and per order. It decides the sequence and the start time of each operation.

A chapter on the history of manufacturing scheduling, found as a Wiley book excerpt, puts the split this way: planning approximates future material and capacity needs over a longer horizon, while scheduling defines operations precisely over a short interval. See the [excerpt, "Why Schedule?"](https://catalogimages.wiley.com/images/db/pdf/0471352640.pdf). The excerpt does not name its author in the preview, so treat it as background reading.

You need both. Rough-cut capacity planning tells you whether the plant can carry the load in principle, and finite capacity planning turns that into a production schedule per resource. Scheduling tells you whether a particular order can be finished on its due date.

## Why does infinite loading fail on the shop floor?

Delfoi explains that MRP plans with infinite capacity. It uses backward scheduling from due dates to set material needs and order timing, and it does not check whether machines or workstations are free. It assumes unlimited resources. The result can be a plan that overloads a [bottleneck](https://www.m365.fm/entity/bottleneck/) while other machines sit idle. The Fabrico blog makes the same point in simple words: classic MRP can book three jobs on one machine at the same time, and its dates often cannot be met on the floor. See the [Fabrico article on finite and infinite scheduling](https://www.fabrico.io/blog/finite-vs-infinite-capacity-scheduling/).

The Wiley excerpt adds the consequence: when the schedule assumes that work starts as soon as it arrives and uses average queue times, expediting becomes the normal way of working. Planners then fix the plan by hand every day.

Infinite capacity planning is not useless. It is fast, and it is fine for rough, long-range planning, where approximate timing is enough. The problem starts when you use its dates as promises to customers.

## When does a plant need a finite schedule?

Delfoi lists the situations where it pays off: recurring bottlenecks, high product mix, short lead times and frequent order changes. It also lists warning signs:

- planners adjust the MRP output by hand every day
- on-time delivery is inconsistent
- some machines are overloaded while others sit idle

It adds that make-to-order and engineer-to-order environments benefit most, while a make-to-stock plant with stable, high-volume demand may manage with MRP plus rough-cut capacity checks. This is a vendor view, but it matches common experience: the more varied the orders, the more a plain material plan fails.

A short self-test for your plant:

1. Do you have a resource that is often the limit? Look for the bottleneck first.
2. Do due dates change after the plan is released?
3. Do planners keep a private spreadsheet next to the [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/)?
4. Do customers hear a date that the shop floor then misses?

Two or more yes answers suggest that capacity planning alone is not enough.

## How do you put a finite capacity plan in place?

You do not need a big project to start. A practical path:

1. **Pick the scope.** One value stream, one hall or the bottleneck and the steps around it.
2. **Check customer demand and the order book.** Which orders are firm, which are forecasts?
3. **Load the real constraints.** Calendars, skills, setups and material, not only machine hours.
4. **Create a first production plan** for the next one or two weeks and compare it with what planners would do by hand.
5. **Review conflicts together.** Planners, supervisors and sales decide what moves: a due date, overtime or an outside supplier.
6. **Release one plan** to the shop floor, and update it when something changes. A realistic schedule needs real-time or at least daily feedback on what was actually done.
7. **Measure.** Track delivery date accuracy and the number of manual changes, and use them to improve the data.

## What data does a finite schedule need?

A finite schedule is only as reliable as its inputs. Fabrico points out that a machine rated for eight hours that delivers six in practice makes a plan built on the rated figure over-promise. Measured capacity, such as figures from OEE data, makes the model more accurate.

Collect these inputs:

1. **Routings.** Operations, sequence, resource options and times.
2. **Real capacity.** Net available hours, after breaks, maintenance and typical losses.
3. **Setup and changeover times.** Especially if they depend on the product sequence.
4. **Calendars.** Shifts, holidays and planned downtime for each resource.
5. **Skills.** Who can run which machine.
6. **Orders.** Quantities, due dates and priorities, from the ERP system.
7. **Material status.** What is available and when more arrives.

You do not need perfect data to start. Begin with the bottleneck and its true capacity, then widen the scope.

## Example: weekly load looks fine, daily load does not

This example uses assumed numbers.

A press runs one shift of 7.5 productive hours per day, five days a week. Weekly capacity is 5 × 7.5 = **37.5 hours**. This week's orders need 34 hours on the press.

**Capacity planning view.** Load is 34 ÷ 37.5 = 91 percent. The week looks feasible.

**Due dates.** The 34 hours split into three groups: 18 hours are due at the end of Tuesday, 4 hours at the end of Wednesday and 12 hours at the end of Friday.

**Finite schedule view.** By the end of Tuesday the press has 2 × 7.5 = 15 hours. The Tuesday group needs 18. So 18 − 15 = **3 hours do not fit**. That is 3 ÷ 7.5 = 40 percent of a day.

The schedule moves the 3 hours to Wednesday, where Wednesday has 3 + 4 = 7 hours of work against 7.5 available. Thursday and Friday carry the 12 hours with room to spare. So one order is a day late unless someone acts. The options are 3 hours of overtime on Tuesday, a second press or an outside supplier, or a call to the customer to move one date.

The capacity plan said "91 percent, fine". A feasible schedule shows the conflict early. The schedule says "one order will be late, and here is which one". That difference is why plants need both views.

## Common mistakes

- **Trusting weekly load alone.** A feasible week can hide an infeasible day.
- **Using rated capacity.** Plan with measured, net capacity.
- **Ignoring setup times.** Sequence changes the setup load, and a schedule without it is optimistic.
- **Scheduling every resource at the same detail.** Focus on the bottleneck first.
- **Freezing the plan.** Disruptions happen. Re-plan and tell the shop floor.
- **Keeping the schedule in a private spreadsheet.** Share one plan that planners, supervisors and sales can see.
- **Promising dates from infinite logic.** Give customers dates from the finite schedule.

## How software can help

Finite scheduling by hand works for a few machines and breaks as orders and constraints grow. Scheduling software, often called advanced planning and scheduling (APS), calculates a feasible plan from capacity, calendars, material and priorities. [iFAKT's Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) is a module of iFAKT Polaris that automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities. When you compare tools, test them with your own bottleneck and a real order list, and check how fast a plan updates after a disruption.

## Next step

Take the bottleneck in your plant and compare its real net capacity for the next two weeks with the orders that are due. If the daily load exceeds the hours available, you have a case for finite capacity scheduling, and you can show the planners and the sales team where the first conflict falls.
