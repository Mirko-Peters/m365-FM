---
title: "Capacity and Staffing Planning in Aerospace Plants"
summary: "Capacity planning aerospace plants can trust links machine hours, qualified people and shifts to demand. A guide for plant managers with a staffing example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-simulator, aerospace, bottleneck, finite-capacity-scheduling]
keypoints:
  - "Aerospace products are made in low volumes with high complexity, so a capacity plan must cover qualified people and shifts as well as machine hours."
  - "A capacity plan starts from a demand forecast, converts it into hours per resource and compares the hours with effective capacity, not with the nominal calendar."
  - "Skills often limit capacity before machines do; cross-training and standard work create redundancy and reduce overstaffing."
  - "Shift planning and skill matrices belong in the same plan, because a free machine without a qualified operator adds no capacity."
  - "Start with one critical work center: forecast the workload, list the qualified people per shift and close the largest gap first."
faq:
  - q: "What is capacity planning in aerospace manufacturing?"
    a: "Capacity planning in aerospace matches the work that the demand forecast requires with the machines, people and shifts that can do it. Because volumes are low and complexity is high, it covers qualified staff and certified processes as well as machine hours, and it looks ahead far enough to cover long lead times for hiring, training and equipment."
  - q: "How do you calculate effective capacity?"
    a: "Start with the available hours of a resource from its calendar, then reduce them by planned downtime, changeovers, breaks and typical losses, which gives the effective capacity. For people, also reduce by training, absence and the share of time that is not productive. Compare the workload with this effective figure, not with the nominal calendar."
  - q: "How do you plan staffing when skills are scarce?"
    a: "Keep a skill matrix that shows who is qualified for which operation, and plan the workload against the number of qualified people per shift. Cross-train operators for the critical operations, standardize work so that others can step in, and capture the knowledge of experienced people before they retire."
---

Capacity planning aerospace plants can trust has to cover machines, qualified people and shifts together, because a free machine without a qualified operator adds no capacity. This article is for plant managers who plan capacity and staffing for low-volume, high-complexity work. You will learn what is different in aerospace, how to build a capacity plan, how to plan staffing and shifts, and how to start with one critical work center.

## Capacity planning aerospace: what makes it different?

McKinsey describes low-volume, high-complexity products as typically made in quantities of 10 to 10,000 units per year. It says labor costs can be significant because fewer tasks can be automated, and it estimates about ten years to clear the backlog for the Airbus A320 family and the Boeing 737 family. See the [McKinsey article on low-volume, high-complexity manufacturing](https://www.mckinsey.com/industries/aerospace-and-defense/our-insights/improving-productivity-in-low-volume-high-complexity-manufacturing). It is from July 2024, and the figures are estimates by a consultancy.

The [aerospace](https://www.m365.fm/entity/aerospace/) industry also has strict quality, traceability and certification requirements. So a capacity plan in an aerospace plant differs in three ways:

- **People are often the limit.** Certified skills and long training times matter more than machine count.
- **Lead times are long.** A hiring decision or a new machine takes months to show up in the plan, so the forecast horizon must be long.
- **Demand is lumpy.** Programs ramp up and down, and each part has its own routing.

## How do you build a capacity plan for machines?

Capacity planning in manufacturing is a planning process, not a one-time calculation. A capacity plan compares the workload with the current capacity that can really be used, so that the capacity requirements of the demand are met. The usual steps of this planning process are:

1. **Forecast the demand.** Use confirmed orders for the near term and a demand forecast for the longer term, by product family.
2. **Convert the forecast into hours** per resource, using routings, cycle times and setup times. This is rough-cut capacity planning.
3. **Calculate the effective capacity.** Start with the available hours from the calendar, then subtract planned downtime, changeovers, breaks and typical losses. Use this usable figure, not the nominal one.
4. **Compare workload and capacity** by week and by resource. The gap shows the overload and the free capacity.
5. **Decide what to do about the gaps.** Add a crew, move work to another resource, outsource or shift the due dates.

Look for the [bottleneck](https://www.m365.fm/entity/bottleneck/) first. It is the resource that limits how much work can pass through the plant, and after a disruption it can shift to another machine, an inspection step, a tool or a person. Extra capacity elsewhere does not raise the output.

Strategic capacity planning looks at future capacity and market trends, while operational capacity planning handles the existing capacity and the weekly load. The monthly or weekly capacity plan answers whether the load fits, and it should flag capacity gaps early, so that the plant can meet demand with optimal capacity. For the daily plan, [finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) takes over: it plans operations onto real resource calendars and treats each machine, person or station as limited, so that conflicts between orders become visible.

## Which capacity planning strategies fit long lead times?

Three common capacity planning strategies differ in timing. A lead strategy adds capacity ahead of demand, a lag strategy adds it only after demand is confirmed, and a match strategy adds it in small steps. With long lead times for training and equipment, a pure lag strategy is risky, because the production capacity arrives after the orders are already late. A pure lead strategy ties up money and creates excess capacity if a program slips.

Most plants end up with a mix. Add production capacity early where lead times are long and the demand is secure, such as certified training. Keep it flexible where demand is uncertain, for example with overtime or temporary teams. Check the available resources and the resource availability each month. Resource management and planning decisions belong to the production planning team, which should own the capacity plan, so that the supply chain, sales and HR work from the same numbers. Capacity planning tools that can optimize the allocation and show the effect of each option help with the capacity decision, and a few key performance indicators, such as load by week and qualified hours per shift, keep it honest.

## How do you plan staffing?

The capacity of a person is not 37.5 hours a week. Subtract absence, training, meetings and the time that is not productive, then check the qualification.

McKinsey's 2023 article on scaling aerospace manufacturing says that cross-training operators and standardizing work can create redundancy and reduce overstaffing. It describes an OEM whose utilization-based approach, with better batching and schedule optimization, cut excess staffing by 20 percent. That is one OEM's reported result, and not a benchmark for your plant. See the [McKinsey article on scaling complex manufacturing](https://www.mckinsey.com/industries/aerospace-and-defense/our-insights/taking-off-scaling-complex-manufacturing-in-the-aerospace-industry).

The age structure also matters. The July 2024 article says that about one-third of employees in aerospace and defense are 55 or older. A vendor article by the CEO of a manufacturing execution software company adds that much process knowledge is undocumented, and that rigid job roles and fixed staffing structures create bottlenecks when people are unavailable. It quotes average turnover of around 13 percent among member companies of the Aerospace Industries Association, against a national average of 3.8 percent. See the [iBase-t article on the workforce gap](https://www.ibaset.com/ceo-playbook-three-ways-solve-ad-workforce-gap/). It is written by a software vendor, so read the figures with care.

What follows for your staffing plan:

- **Keep a skill matrix** that shows who is qualified for which operation, and who is in training.
- **Plan against the qualified headcount** per shift, not the total headcount.
- **Cross-train for the critical** operations first.
- **Document the know-how** of experienced operators in work instructions before they leave.
- **Use real-time data** on absence and progress for the allocation of people, and optimize the plan for the scarce skills first.

## How do shift plans and skills fit together?

A shift plan decides when people work. A skill matrix decides what they can do. Both must go into the same capacity plan, because the output of a shift is limited by the scarcest qualification on it.

McKinsey suggests that autonomous, multifunctional teams can set priorities and allocate resources, and that flexible schedules can help with retention. For ramp-ups it mentions selective overtime and moving employees between production lines when teams fall behind. Overtime is a short-term tool. If it becomes the plan, it raises costs and turnover.

A practical approach to shift planning:

1. **List the operations** that need a qualified person, and the number of such people per shift.
2. **Check the workload per shift** against the qualified hours.
3. **Balance the allocation.** Spread the scarce skills across the crews, so that no team is left without one.
4. **Keep a reserve.** Plan utilization of the scarce people below 100 percent, so that absence does not stop the line.
5. **Review each week** and update the capacity plan with the actual hours.

## Example: machines suffice, people do not

This example uses assumed numbers.

A work center has 3 machines. It runs 2 shifts of 7.5 hours on 5 days. The demand forecast requires **160 machine hours** per week, and each running machine needs a qualified operator.

**Machine capacity.** 3 × 2 × 7.5 × 5 = 225 hours per week. With 85 percent usable time, 225 × 0.85 = **191 hours**. The machines can cover 160 hours, at a load of 160 ÷ 191 = 84 percent.

**Workforce capacity.** Only 4 operators are qualified for these machines. Each works 37.5 hours per week, and 80 percent of that time is productive: 37.5 × 0.80 = 30 hours. So 4 × 30 = **120 hours**.

**Result.** The demand of 160 hours is above the workforce capacity of 120 hours. The gap is 40 hours, or 40 ÷ 30 = 1.33 operators. The real limit is the people, even though the machines look sufficient.

**Action.** Cross-train 2 more operators. Then 6 × 30 = **180 hours**, and the load on the team is 160 ÷ 180 = **89 percent**, which leaves a small reserve for absence.

The numbers are made up, but the effect is common. A capacity plan that looks only at machine hours shows 84 percent and says everything is fine. The plan with qualified people shows 133 percent (160 ÷ 120) and shows the true problem.

## How do you start?

1. **Pick one critical work center** with a skill limit.
2. **Forecast the workload** in hours for the next three months, by week.
3. **Calculate the usable capacity** of the machines and of the qualified people.
4. **Build the skill matrix** for that work center, and mark the single points of failure.
5. **Close the largest gap first.** Cross-train, shift the work or adjust the crew plan.
6. **Test the scenarios** before you commit, for example an extra shift or one operator less.
7. **Review the plan every week** and compare the forecast with the actual hours.

## Common mistakes

- **Planning with nominal hours.** The calendar says 37.5 hours, but the productive time is lower.
- **Counting headcount, not qualifications.** Ten people with the wrong skills add no capacity.
- **Using overtime as the plan.** It hides the gap and raises turnover.
- **Planning capacity once a year.** Programs change faster, so the forecast needs a regular update.
- **Ignoring knowledge loss.** An experienced operator who retires takes undocumented know-how along.
- **Forgetting the reserve.** A plan with 100 percent utilization of scarce people fails with the first absence.

## How software can help

Scenarios for capacity, staffing and shifts are hard to test in a spreadsheet. [iFAKT's Polaris Simulator](https://www.m365.fm/entity/polaris-simulator/) is a module of iFAKT Polaris that tests the production system virtually, for example capacity, staffing and buffer scenarios, and reveals bottlenecks before changes are made. When you compare tools, ask how they model qualifications and shifts, how they use your actual data and how fast you can compare two scenarios.

## Next step

Take your most critical work center, list the qualified people per shift and compare their productive hours with next quarter's forecast. That comparison is the starting point for capacity planning aerospace plants can rely on, and it shows within an afternoon whether machines or people limit your output.
