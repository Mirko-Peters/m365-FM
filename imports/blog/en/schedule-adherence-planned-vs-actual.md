---
title: "Planned vs Actual: How to Measure Schedule Adherence in Production"
summary: "Schedule adherence shows how closely production follows the plan. Learn the formulas for quantity, timing and sequence, sensible targets and how to improve."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-analyzer, closed-loop-production-scheduling, oee, finite-capacity-scheduling]
keypoints:
  - "Schedule adherence is the share of production activity that happens as planned, and it can be measured for quantity, for timing and for sequence."
  - "Output against plan alone can hide problems: a shift can hit its total and still overbuild one product and short another."
  - "Define the tolerance window and the frozen plan before you measure, and keep both fixed so that the number stays comparable."
  - "Low adherence often starts upstream, with infeasible releases, late supplier dates or slow feedback, rather than with shop floor discipline."
  - "Add a reason code to every miss and review the biggest causes, instead of simply asking the shop floor to try harder."
faq:
  - q: "What is schedule adherence in production?"
    a: "Schedule adherence is the share of production activity that happens according to the plan. It can cover quantity, meaning the right amount, timing, meaning within the planned time window, and sequence, meaning in the planned order. It is usually shown as a percentage over a period, such as a shift or a week."
  - q: "How do you calculate schedule adherence?"
    a: "Divide the activity that followed the plan by the planned activity, and multiply by 100. For quantity, count units built to plan per item, capped at the planned amount, and divide by total planned units. For timing and sequence, count orders finished in the planned window or in the planned order, and divide by the number of orders."
  - q: "What is a good schedule adherence target?"
    a: "There is no universal figure. Some published guides call the mid-90s strong for discrete manufacturers and treat anything consistently below 90 percent as worth investigating, while others use different bands and windows. Set your own target from your baseline, define the tolerance window, and watch the trend rather than a single value."
---

Schedule adherence shows how closely production follows the plan. It is the share of planned work that was done as planned, measured for quantity, timing and sequence. This article is for operational excellence managers who want to compare planned and actual figures in a fair way. You will learn the formulas, how to choose a target, why adherence drops and how to improve it, with a worked example and a list of common mistakes.

## What does schedule adherence tell you?

A SourceDay article from a supply chain software vendor defines schedule adherence as the percentage of production or delivery activity that occurs according to the planned schedule. It also treats the number as a signal of whether the schedule reflects reality, not only as a score for discipline on the shop floor. See the [SourceDay article on schedule adherence in manufacturing](https://sourceday.com/blog/schedule-adherence/).

That second point matters. If adherence is low, there are two questions to ask:

- Did the shop floor fail to follow a good plan?
- Or was the plan not executable in the first place?

In many plants the answer is the second one. The plan did not respect real capacity, material or supplier dates, so even perfect work could not follow it. That is why this key metric belongs in an operational excellence toolkit: it tests the plan as much as the people. Measuring schedule adherence honestly means looking at the plan and at the staff who carry it out.

The term also appears in workforce management, for example in contact centers, where it compares the work hours of staff with the hours they were scheduled to work. In production, the same idea applies to orders, quantities and sequence.

## How do you calculate it?

To calculate schedule adherence in a way that managers trust, define the metric first. Two vendor guides give clear formulas, and they agree on the main idea: count only what ran according to the plan.

A Fabrico article separates two measures. **Schedule attainment** is actual units produced divided by planned units, times 100. **Production adherence** counts units built to plan per item, each capped at its own target, divided by total planned units, times 100. The cap means that surplus on one product cannot offset a shortfall on another. See the [Fabrico article on attainment and adherence](https://www.fabrico.io/blog/schedule-attainment-vs-production-adherence/).

Symestic describes three dimensions for orders: quantity, timing and sequence. See the [Symestic page on schedule adherence](https://www.symestic.com/en-us/what-is/schedule-adherence). In simple terms:

1. **Quantity adherence.** Orders where the actual quantity equals the planned quantity, divided by all orders.
2. **Timing adherence.** Orders completed inside the planned time window, divided by all orders.
3. **Sequence adherence.** Orders executed in the planned order, divided by all orders.
4. **Composite adherence.** An order counts only if it passes all three tests.

The same page warns that plants which report only quantity overstate their performance. It gives an example where 92 percent quantity, 88 percent timing and 85 percent sequence adherence give a composite of roughly 69 percent.

## What is a good target, and what window should you use?

Treat published benchmarks as a rough guide when you set adherence targets and adherence goals. The Fabrico article says many discrete manufacturers consider sustained adherence in the mid-90s strong and anything consistently below 90 percent worth investigating, while stating that targets vary by industry. The Symestic page gives different bands, with above 85 percent solid and above 92 percent best-in-class for discrete manufacturing on a shift window. Both are vendor figures, and they use different definitions. So do not copy a number. Set your target from your own baseline.

Two settings change the result more than anything else:

- **The tolerance window.** Symestic notes that an exact-hour rule suits only paced takt-time assembly, that a shift window of 8 or 12 hours is the common rule for discrete manufacturing and that a day window suits process industries. Pick one rule and keep it fixed for the whole period.
- **The frozen plan.** Measure against a plan that was frozen at a defined point, for example 24 to 48 hours ahead for discrete production, as Symestic suggests. If you compare with a plan that was rewritten after the fact to match reality, adherence will look good but it will tell you nothing.

## Why does adherence drop?

Sourceday says the causes usually start upstream. It lists supplier dates that are accepted but not updated, delays that arrive late so the schedule still shows the original plan, coordination that lives in emails and spreadsheets, and ERP data that reflects what was expected instead of what will happen.

Symestic adds more causes:

- **Chasing equipment efficiency.** Pressure to raise [OEE](https://www.m365.fm/entity/oee/) can push shifts to pick long runs and defer small orders. OEE combines availability, performance and quality, so a long run is the easy way to raise it. Show adherence next to OEE so that cherry-picking becomes visible.
- **Reschedule thrash.** Frequent rewrites of the plan make adherence look good while measuring against a plan that was just adjusted.
- **Infeasible releases.** Orders released that the plant cannot execute in the planned window.
- **Slow feedback.** If completion is reported by hand after the shift, corrective action comes too late.

## How do you improve it?

To improve schedule adherence, start with analyzing adherence data by cause, because adherence challenges differ from line to line. Sourceday's advice is that improvement does not come from tightening the schedule but from stabilizing execution. Combined with the other sources, a practical list looks like this:

1. **Measure in near-real-time.** Symestic suggests latency under about 15 minutes between ERP and the shop floor for shift-level decisions.
2. **Release only feasible orders.** Check capacity first. A schedule built with [finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) respects the limits of each resource.
3. **Freeze the near term** and count changes to it.
4. **Capture real supplier dates** and update them when conditions change.
5. **Attach reason codes** to each miss, for example material shortage, unplanned stop or schedule change, then rank them in a Pareto chart, as Fabrico advises.
6. **Close the loop.** When the shop floor deviates, replan quickly. This is the idea of [closed-loop production scheduling](https://www.m365.fm/entity/closed-loop-production-scheduling/).
7. **Change the shift handover talk.** Ask which planned orders were missed and why, not who was slow.

## Which other metrics belong next to it?

Adherence is a key metric, but it is not the only performance indicator. It tells you whether execution followed the plan. It does not tell you whether the plan was good, or whether the customer got the goods on time. Put it on the same dashboard as a few other key performance indicators:

- **On-time delivery.** The share of orders shipped by the promised date. Late orders hurt customer satisfaction, the customer experience and the service level. A plant can have a high adherence rate and still deliver late, if the plan itself was misaligned with the customer dates.
- **OEE and utilization.** They show how well the equipment is used. Read them together with adherence, because pushing utilization alone can damage the mix.
- **Lead time and work in process.** If adherence is low, orders wait and both rise.
- **Productivity.** Output per hour or per person, to check that the effort to improve adherence does not cost output.
- **Number of replans.** It shows how stable the plan is, which is the base of every adherence goal.

Keep the set small. Four or five indicators on one page, with the same definitions every week, will do more than twenty indicators that nobody reads. Use the dashboard in the daily meeting to identify areas for optimization, and set adherence targets by line, because a paced assembly line and a job shop cannot share one number.

## Example: 92 percent, or 50 percent?

This example uses assumed numbers.

**Quantity view.** A shift plans three products and builds as follows:

- Product A: planned 400, built 460. Counted for adherence: 400, the cap.
- Product B: planned 400, built 320. Counted: 320.
- Product C: planned 200, built 200. Counted: 200.

Total planned is 1,000 and total built is 980, so attainment is 980 ÷ 1,000 = **98 percent**. Adherence counts 400 + 320 + 200 = 920, so it is 920 ÷ 1,000 = **92 percent**. The shift overbuilt A by 60 units and shorted B by 80, which attainment hides.

**Order view.** The same shift has 10 orders. Checked on the three tests:

- Quantity as planned: 9 of 10 (order 6 failed).
- Finished in the window: 7 of 10 (orders 3, 6 and 9 were late).
- In the planned sequence: 7 of 10 (orders 4, 7 and 9 were out of order).

Quantity adherence is 90 percent, timing 70 percent and sequence 70 percent. Only orders 1, 2, 5, 8 and 10 pass all three tests, so composite adherence is 5 ÷ 10 = **50 percent**.

The same shift is "98 percent", "92 percent" or "50 percent", depending on the definition. That is why you must write the definition down and keep it fixed.

## Common mistakes

- **Measuring only quantity.** It hides timing and sequence problems.
- **Letting surplus offset shortages.** Cap each item at its plan.
- **Changing the window or the frozen plan.** The trend becomes meaningless.
- **Using adherence as a stick.** If low adherence is punished, people will edit the plan or hide the misses.
- **Chasing the number.** A high percentage against a poor plan still means late deliveries. Check delivery performance too.
- **No reason codes.** Without causes you can measure the gap but cannot close it.

## How software can help

Comparing planned and actual values needs both sets of data in one place. [iFAKT's Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) is a module of iFAKT Polaris with KPI dashboards across all modules that compare planned and actual values in production. Whatever tool you use, check that it can apply your tolerance window, that it can measure against a frozen plan and that it stores a reason for each deviation.

## Next step

Write down your definition of schedule adherence for one line: the tolerance window, the frozen plan and the three tests. Then measure last month with that definition and rank the reasons for the misses, so you know where to start.
