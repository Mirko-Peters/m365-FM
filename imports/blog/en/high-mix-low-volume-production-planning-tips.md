---
title: "High-Mix Low-Volume Production Planning: 7 Practical Tips"
summary: "High mix low volume production planning needs real capacity, short changeovers and part families. Seven practical tips for production managers, with an example."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [polaris-optimizer, finite-capacity-scheduling, smed, bottleneck]
keypoints:
  - "In high-mix low-volume (HMLV) production, changeovers, shifting bottlenecks and changing orders make static spreadsheet plans go stale within hours."
  - "Short changeovers are the first lever: one published example cuts a changeover from 60 to 10 minutes and gains 50 minutes of capacity per switch."
  - "A plan is only as good as its capacity figures; overstated capacity builds up and turns into permanent firefighting."
  - "Grouping parts into families and checking material before release removes two common causes of stalled work."
  - "Start with one machine group: count changeovers as load, fix the capacity figures and review the plan every day."
faq:
  - q: "What is high-mix low-volume production?"
    a: "High-mix low-volume, or HMLV, production means making many different products in small quantities, often as make-to-order or job shop work. A single shift may include dozens of different products. The mix creates frequent changeovers, shifting bottlenecks and unstable schedules, which is why it needs different planning habits than mass production."
  - q: "Why do spreadsheets fail for HMLV planning?"
    a: "Customers change orders often, and breakdowns, missing material and rush requests disrupt the plan. A static spreadsheet is out of date after the first change, and it rarely checks capacity or setup times. Planners then spend the day fixing the plan by hand instead of planning, and the shop floor falls back on its own priorities."
  - q: "How do you reduce changeover time in a job shop?"
    a: "Separate the setup work that needs a stopped machine from the work that can be done while it runs, then simplify both. This is the idea behind SMED. Digital checklists for each setup and tooling kept ready at the machine help. Group similar work in sequence, so that the machine needs fewer full changeovers."
---

High mix low volume manufacturing means making many different products in relatively small quantities, and it breaks plans that work in mass production. This article is for production managers at a manufacturer with a job shop or an assembly area where every shift looks different, a typical case of low-volume manufacturing. You will learn what makes planning hard, seven practical tips with sources, a worked example of the changeover effect and a way to start with one machine group.

## What makes high mix low volume planning so hard?

Fabrico, a vendor of production software, describes high-mix low-volume (HMLV) manufacturing as a model where factories make many different products in small quantities. Its example is a job shop that may produce 50 different products in a single shift. The article lists the typical problems. See the [Fabrico guide to HMLV manufacturing](https://www.fabrico.io/blog/high-mix-low-volume-manufacturing-strategy-guide/).

- **Changeovers cost more.** A 4-hour changeover is acceptable in mass production if the run lasts weeks. It is costly when runs last only hours.
- **Bottlenecks move.** The constraint shifts between machines from day to day, so some people wait while work piles up elsewhere.
- **Schedules are unstable.** Customers change orders often, and breakdowns, missing material and rush orders disturb the plan.
- **Material gaps.** Work can start without the raw material, which leads to downtime, delay and missed shipments.

In high-volume production, for example in the automotive industry, the same part is made again and again. HMLV is the opposite, and it is common in aerospace, tooling and electronics manufacturing services, where OEMs order a wide range of products in small runs. Many EMS companies handle new product introduction (NPI) and time-to-market pressure with highly specialized equipment. Product lines and product variations multiply, each part type has its own manufacturing process, and variability in demand and long lead times for some parts make the manufacturing system hard to tune. These unique challenges also make supply chain planning harder for every supplier and every planner.

An MIT thesis on scheduling in a high-mix low-volume job shop describes the same balance: varied production needs against efficient use of resources and shorter lead times. See the [MIT thesis record](https://dspace.mit.edu/handle/1721.1/156004).

## Which seven tips help most?

### Tip 1: Shorten changeovers first

[SMED](https://www.m365.fm/entity/smed/) separates the setup work that needs a stopped machine from the work that can be done while the machine runs, and then simplifies both. Fabrico gives an example of cutting a changeover from 60 to 10 minutes, which gains 50 minutes of capacity per switch. It also suggests digital checklists for each setup. With small batches and short production runs, this is often the cheapest capacity you can find.

### Tip 2: Group parts into families

Parts with different numbers often share much of the same process. Fabrico says they can be about 90 percent the same. Group such parts into families, an idea that comes from lean manufacturing, and run a family in sequence or in a cell. The machine then needs fewer full setups, and the operators learn the family. Frequent setups also raise the risk of a defect on the first piece, so keep a first-piece check in the routine.

### Tip 3: Plan against real capacity

A trade article on scheduling in HMLV shops makes a simple point about lead time: release orders so that they finish when the customer or the next operation needs them, and check the capacity of each operation by time period. If a machine is full, push the work to the next period and move the promised date to match. The same article says that wrong capacity figures do more damage than a single scheduling error, because an overstated capacity builds up and turns into a permanent state of firefighting. See the [Fabricator article on scheduling HMLV operations](https://www.thefabricator.com/thefabricator/article/shopmanagement/scheduling-high-mix-low-volume-operations). [Finite capacity scheduling](https://www.m365.fm/entity/finite-capacity-scheduling/) puts this into practice: it plans work onto real resource calendars and treats each machine, person or station as limited.

### Tip 4: Check material before release

Do not start work without its raw material and tools. Hold it back in the plan until the material is booked in, and show missing material early. Late deliveries from a supplier can be a cause, so ask for confirmed dates and make the supply chain part of the daily review.

### Tip 5: Treat firefighting as a symptom

The Fabricator article argues that complaints about poor scheduling and constant changes in priority are often symptoms of an unpredictable process, not the root cause. Early release, time buffers, extra inventory and overtime may be needed in the short term, but it calls them expensive band-aids, so less is better. It also says that expedites should be in the once-a-week category at most, and that daily expedites point to other problems.

### Tip 6: Cross-train and keep a skill matrix

Fabrico recommends a poly-skilled team, with skills tracked in a matrix and digital work instructions, so that people can move between stations when the constraint moves. 

### Tip 7: Replan in short cycles

Static spreadsheets are out of date after the first change. Use a visual board or planning software, review the plan every day and treat each version as an iteration that you update when orders, material or machines change. Fabrico also suggests grouping similar work, for example by material, and using short machine gaps for quick preventive maintenance.

## How do you plan when bottlenecks move and rush orders arrive?

Start by accepting that the [bottleneck](https://www.m365.fm/entity/bottleneck/) is not fixed. It is the resource or step that limits the flow at a given time, and after a disruption it can shift to another machine, an inspection step, a tool or a person.

A practical routine has four parts:

1. **Plan the next days in detail** and the weeks beyond in rough blocks.
2. **Keep a small reserve** of free capacity on the machines that most often limit the flow. A fully loaded machine cannot take a rush request.
3. **Decide the rush rule in advance.** Who may approve an expedite, what it displaces, and what the customer is told.
4. **Compare plan and actual** at the end of each shift, and note the reason for each deviation.

Rush orders are part of a make-to-order shop. Have a rule for them.

## Which tools and automation fit a job shop?

Planning usually runs on ERP and MES systems plus planning or management software, connected to the shop-floor data. The ERP system holds orders and routings, the MES records what happened on the shop floor, and planning software turns both into a feasible plan. Automation helps where it removes waiting, for example automatic program loading, but a fully automated line is hard when the product range is wide and runs are short. Some shops use 3D printing, a form of additive manufacturing, for simple jigs and fixtures. 

Whatever you choose, aim for agility: the adaptability of the workflow to change. As demand grows and the wide variety of products gets more diverse, managing multiple variants across production systems needs connectivity between engineering, where design changes start, and the shop floor. Modern manufacturing trends such as mass customization ask shops to customize products at low cost, so tailor the plan to your product mix. Treat it as process improvement with a clear ROI, and track product quality and failure rates so that speed does not cost precision.

## Example: 53 percent load that was really 147 percent

This example uses assumed numbers.

A machine group has 450 minutes per shift. The plan holds 12 lots per shift, each with a run time of 20 minutes. A full setup between lots takes 35 minutes.

**Planned from run time only.** 12 × 20 = 240 minutes, which is 240 ÷ 450 = **53 percent** load. The plan looks comfortable.

**With setups.** 12 × 35 = 420 minutes of setup. The total is 240 + 420 = 660 minutes, which is 660 ÷ 450 = **147 percent** load. The shift cannot finish the plan, and the shop floor falls back on its own priorities.

**With families in sequence.** Suppose the 12 lots belong to 4 families. Each family needs one full setup, and the other 8 setups inside a family take 5 minutes. Setup time is 4 × 35 + 8 × 5 = 140 + 40 = 180 minutes. The total is 240 + 180 = 420 minutes, or **93 percent**.

**With shorter changeovers as well.** If SMED brings the full setup to 15 minutes, setup time is 4 × 15 + 8 × 5 = 60 + 40 = 100 minutes. The total is 340 minutes, or **76 percent**. That leaves 110 minutes of reserve for rush requests.

The numbers are made up, but the lesson is general. Setups belong in the load, and sequence and setup time decide whether the plan is possible.

## How do you start with one machine group?

1. **Pick one machine group** with frequent setups, for example the current constraint.
2. **Measure real times.** Record run times, setup times and stops for four weeks.
3. **Correct the capacity figures** in the planning data, including setups and breaks.
4. **Define part families** and a sequence rule inside each family.
5. **Add a material check** before release.
6. **Review the plan every day,** and write down why lots moved.
7. **Work on the largest setup first,** together with the team.

## Common mistakes

- **Planning with run time only.** Setups and waiting are part of the load.
- **Trusting the routing without checking.** Theoretical times are a common source of failed plans.
- **Treating every order as urgent.** If everything is a rush, nothing is.
- **Ignoring skills.** A machine may be free, but nobody may be qualified to run the work.
- **Adding reserves everywhere.** Extra stock and time hide the causes. Use them where the flow is limited, and nowhere else.

## How software can help

Spreadsheets reach their limits in a plant with hundreds of lots. [iFAKT's Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) is a module of iFAKT Polaris that automatically generates optimized production plans under constraints such as resources, shifts, zones, qualifications and capacities. When you compare systems, ask how they treat setup times, how they respect qualifications and how quickly they replan after a change.

## Next step

Take one machine group and recalculate its load for last week, with setups included. If the figure is above your capacity, you have found the reason why high mix low volume planning feels like firefighting. Then pick the largest setup and plan its reduction.
