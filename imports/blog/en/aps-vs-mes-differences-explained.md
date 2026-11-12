---
title: "APS vs MES: Differences, Overlaps and How They Work Together"
summary: "APS vs MES in plain terms: one plans a feasible schedule ahead, the other records and controls execution. See where they overlap and which gap to close first."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [advanced-planning-and-scheduling, manufacturing-execution-system, isa-95, enterprise-resource-planning, polaris-optimizer, polaris-operator, ifakt]
keypoints:
  - "An APS calculates a feasible schedule ahead of time from capacity, calendars, material and priorities; an MES records and controls what actually happens on the floor."
  - "ISA-95 names detailed scheduling, work dispatching and work tracking as activities of manufacturing operations management, which is why scheduling features appear in both kinds of products."
  - "The cleanest rule is one owner for the sequence: if both systems publish a work list, the floor gets two versions of the plan."
  - "Data flows both ways: sequence, dates and resources go down; start, finish, quantities, scrap, downtime and material use come back."
  - "If you can't trust order status, close that gap first, because a scheduler works on actuals and drifts without them."
faq:
  - q: "What is the main difference between APS and MES?"
    a: "An APS looks ahead. It builds a feasible schedule from capacity, calendars, material and priorities and lets planners test what-if cases. An MES looks at the present. It records and controls production against work orders on the shop floor. One decides what should happen, the other captures what did happen."
  - q: "Can an MES replace an APS?"
    a: "Only if your sequencing is simple. Many MES products include dispatch lists or basic scheduling, and that can be enough for stable routings and little contention for resources. With a shared bottleneck, sequence-dependent setups or several constraints at once, a dedicated scheduling engine usually gives planners more control."
  - q: "Do I need both APS and MES?"
    a: "Not always. Choose by the bigger gap. If you can't produce a feasible schedule or promise dates, look at APS. If you can't see what is happening or prove what was made, look at MES or simpler shop floor reporting. Plants that need both should plan the data exchange from the start."
---

An APS (advanced planning and scheduling) system calculates a feasible schedule ahead of time, based on capacity, calendars, material and priorities. An MES (manufacturing execution system) records and controls what actually happens on the shop floor, order by order and operation by operation. APS looks forward, MES looks at now. They overlap in detailed scheduling, which is where most of the confusion starts. This article is for production planners who need to decide which one to look at first, or how to make both work together.

## APS vs MES: what does each system do?

Start with the plain descriptions.

An [APS](https://www.m365.fm/entity/advanced-planning-and-scheduling/) is planning software. It takes orders, routings, resources, shift calendars, material availability and rules, and it calculates a schedule that the plant can actually run. Planners use it to answer questions such as "when can we deliver this rush order, and what does it push back?" A good APS lets you copy the plan, change one assumption and compare the two.

An [MES](https://www.m365.fm/entity/manufacturing-execution-system/) is shop floor software. It records production activity against work orders and operations, for example the material consumed at a station. Operators and supervisors use it during the shift. A NIST blog post on MES for small manufacturers describes it as software that gathers real-time data to flag defects and inefficiencies, links production activity to actual costs, and can feed data into an ERP system. The author's views are his own, and the post notes that an MES can also serve as a quality or scheduling system.

So the first difference is time and user. The APS works on hours to weeks and serves the planner. The MES works on seconds to days and serves the floor.

## Where does ISA-95 put them?

The [ISA-95](https://www.m365.fm/entity/isa-95/) standard helps here, because it gives both camps the same map. The [OPC Foundation's summary](https://reference.opcfoundation.org/specs/OPC-10030/4.2.3) describes the levels this way:

- Level 4 is business planning and logistics, typically automated by an [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/). It works on time frames of months, weeks and days.
- Level 3 is manufacturing operations management. It works on time frames from days down to seconds. The activities it names include detailed scheduling, work dispatching and work or product tracking.
- Levels 0 to 2 cover the physical process, sensors and actuators, and automation and control.

Notice that detailed scheduling sits at level 3, next to dispatching and tracking. The standard doesn't use the product category "APS" there. It describes activities, not software packages. [ISA's own page](https://www.isa.org/standards-and-publications/isa-standards/isa-95-standard) lists eight parts, with part 2 covering the interface content between levels 3 and 4 and part 3 the activity models of manufacturing operations management.

That explains why you can buy detailed scheduling in either kind of product. A vendor can put it in the planning box or in the execution box and both are defensible.

## Where do APS and MES overlap?

The overlap is the sequence of work. Three questions help you sort it out.

1. Which system builds the sequence under several constraints and lets you compare alternatives? That is APS work, even if an MES offers a simple version.
2. Which system knows the true status of each order right now? That is MES work.
3. Which system produces the list the operator works from? This must be exactly one.

The third question is the one that hurts when it's answered badly. If the APS prints one list and the MES shows another, the floor will pick the one that's easier to follow, and your plan quietly stops being the plan. Name one owner for the sequence and make the other system a consumer of it.

Rescheduling needs the same clarity. When a machine stops, the MES sees it first. The APS decides what the new plan looks like. Between those two events sits a rule, and you should write it down: who may change the sequence during the shift, and how the change gets back to the planner.

## How do APS and MES exchange data?

Plan data goes down and feedback comes up.

Going down are the released orders, their sequence, planned start and finish times, resource assignments and priorities. Coming up are actual start and finish, good and scrapped quantities, setup and run times, downtime, material consumption and the availability of people and machines.

ISA-95 names four kinds of information that are exchanged between systems at levels 3 and 4: material, equipment, physical assets, and personnel with their roles and qualifications. For a scheduler, that's a sensible checklist of what it needs to know. A schedule that ignores which operators are qualified for a machine is not feasible, whatever the screen shows.

Speed is the next question. The OPC summary says that real-time at level 3 means information available a few seconds after a shop floor event, and at level 4 it means data available daily or within a few hours after a shift ends. Researchers at [FIR at RWTH Aachen](https://www.fir.rwth-aachen.de/en/research/production-management/production-control) make a similar point about production control: real-time should be understood as a delay for recording defined events, not as milliseconds. Ask which decision each message supports. A supervisor who reassigns people when a job runs late needs minutes. A planner who reschedules tomorrow's orders needs the status by the end of the shift.

The same FIR page notes that deviations are considered in later decisions and can change the input data for later planning. In plain words, actuals should improve the plan. If your planners keep using standard times that the MES contradicts every day, the loop isn't closed.

## Do you need APS, MES or both?

Choose by the bigger gap. These patterns are common:

- You can't give reliable delivery dates, the bottleneck sequence takes hours to work out and rush orders break the week. Look at APS, once your routing data is sound.
- You don't know what was produced when, order status lives on paper, or you can't show which material went into which product. Look at MES or simpler shop floor reporting first.
- Your products are regulated and you need records for each batch or serial number. That's MES territory.
- Your routings are stable and your capacity is not tight. ERP planning plus a careful planner may be enough.
- You want the plan to react to what happens on the floor. You need both, with a defined data exchange.

Here is a hypothetical example. A plant runs on paper travelers. Operators write quantities at the end of the shift, and the planner types them in the next morning. The planner learns Tuesday's status on Wednesday. Buying a better scheduler would give a sharper plan, but one built on yesterday's status. Capturing progress during the shift would fix the staleness first. The plant in this example is invented. The logic holds for any plant: a scheduler works on actuals, and without them it drifts.

## How do you connect them without a big-bang project?

Work in small steps, one line at a time.

1. Decide who owns the sequence, and write it down.
2. List the messages in both directions, with sender, receiver, trigger and frequency.
3. Check routings, times and calendars for the pilot line. Both systems inherit every error in them.
4. Run the new flow next to the old process for a few weeks.
5. Compare planned and actual start and finish for each order, and look at the gaps.
6. Extend to the next line only when the numbers on both sides agree.

## What should you ask vendors?

Whether you buy an APS, an MES or both, the same questions separate good answers from vague ones:

- Which system is the master for the sequence, and how does the other one learn about changes?
- Which messages go in each direction, and how often?
- What happens when the connection fails? Can the shop floor keep working and catch up later?
- How long does a reschedule take, and how does the planner see what changed?
- Who maintains the data mapping when you add a product family or a work center?
- Which standards does the interface use, such as ISA-95-based message definitions or OPC UA?

Ask for a pilot on one line with your own data. A demo on the vendor's sample plant doesn't show how the two systems behave when your data is imperfect.

## Common mistakes

- Buying an APS to fix a problem that is really missing shop floor data.
- Buying an MES and expecting it to optimize the sequence.
- Letting both systems publish a work list.
- Assuming the interface is "standard" and skipping the data mapping.
- Measuring the plan against standard times that nobody has checked for a year.
- Going live on the whole plant at once, so no team can learn from the first line.

## Where Polaris fits

If your main gap is a feasible plan and its link to the floor, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, working with ERP data. The [Polaris Optimizer](https://www.m365.fm/entity/polaris-optimizer/) module creates an optimized plan under constraints such as resources, shifts, skills and capacities, and it analyzes the impact of disruptions and re-optimizes. The [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) module brings the plan to the floor as time-based tasks and captures progress, delays and disruptions as feedback. Whether it replaces or complements your MES depends on what your MES has to record, such as material consumption, quality data or traceability, so compare that list first.

## Related topics to explore

- Finite capacity scheduling: why a weekly load view can look fine while a daily schedule is infeasible.
- Closed-loop production planning: how feedback from the floor changes the next plan.
- Master data for scheduling: who owns routings, times and calendars.
- Connecting an MES to ERP: which orders and confirmations move in each direction.

## Next step

Write down which of two sentences is truer in your plant: "We can't build a schedule we trust" or "We can't see what is really happening." That answer settles most of the aps vs mes question for you, and it tells you which vendor conversation to have first.
