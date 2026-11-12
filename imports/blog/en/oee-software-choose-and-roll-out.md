---
title: "OEE Software: How to Choose It and Roll It Out Without Regret"
summary: "OEE software records stops, speed and scrap per machine. Learn how to pick it, pilot it, connect it to ERP and older machines and avoid the common traps."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [oee, manufacturing, power-bi, manufacturing-execution-system, enterprise-resource-planning, polaris-analyzer, ifakt]
keypoints:
  - "OEE software automates what a paper log does by hand: it records run time, stops, speed and rejects per machine and turns them into availability, performance and quality."
  - "Lean.org defines OEE as availability times performance times quality, so check that a tool's formula and its stop and ideal-speed settings match the definition your plant uses."
  - "Choose by data capture first, because a dashboard is only as honest as the counts, states and downtime reasons behind it."
  - "Run a pilot on one constraint machine with your own data, and compare the tool's counts with a manual log before you trust any chart."
  - "Plan the connection to ERP and to Power BI early, and ask how the tool delivers data, because Microsoft is retiring the creation of streaming semantic models after October 31, 2027."
faq:
  - q: "What does OEE software do?"
    a: "OEE software captures machine states, part counts, rejects and downtime reasons, either from the machine's controller, from added sensors or from operator input. It then calculates availability, performance and quality for each machine and shift, and shows the results on screens and reports so teams can see where time is lost."
  - q: "Do I need OEE software or is a spreadsheet enough?"
    a: "A spreadsheet or paper log is enough for a pilot on one machine, and it is the best way to learn your losses. It stops working when many lines and shifts need entries, small stops get missed, or results arrive too late to act on. That is the point to automate."
  - q: "How long should an OEE pilot run?"
    a: "Long enough to cover typical conditions on the machine: several shifts, a few product changeovers and at least one planned stop. For many plants that means a few weeks. The goal is not a better number but proof that the counts, states and downtime reasons match what really happened at the machine."
---

OEE software records what a machine does during planned production time, meaning when it runs, when it stops, how fast it goes and how many parts come out good. It then turns that into availability, performance and quality, and a combined OEE figure. This article is for operations managers in [manufacturing](https://www.m365.fm/entity/manufacturing/) who have to pick a tool, test it and get it accepted on the shop floor. It deals with selection and roll-out, not with the formula itself. If you want the formula and the six big losses first, read up on [OEE](https://www.m365.fm/entity/oee/) first and come back.

## What should the tool actually do?

Three jobs, in this order.

1. **Capture the data.** Machine state (running, stopped, idle), part counts, rejects and, above all, the reason for each stop. This is the hard part, and it decides whether anything else is worth looking at.
2. **Calculate the figures the same way every time.** Lean.org defines [OEE](https://www.lean.org/lexicon-terms/overall-equipment-effectiveness/) as a measure of how effectively equipment is used, with availability, performance and quality multiplied together. Availability counts downtime from failures and adjustments. Performance counts speed losses, including small stoppages. Quality counts scrap and rework. Lean.org's own example multiplies 90%, 95% and 99% to get 84.6%.
3. **Show it to the right people at the right time.** The operator needs the current shift on a screen at the machine. The supervisor needs the last few hours. The plant manager needs trends, not a number that jumps around.

Everything else on a feature list, such as mobile apps, alerts, maintenance modules and AI add-ons, is secondary. If the first job is done badly, those extras only decorate wrong numbers.

## How is it different from an MES or an ERP?

The boundaries blur, so be clear about what you are buying.

An [MES](https://www.m365.fm/entity/manufacturing-execution-system/) manages and records production against work orders: what was made, from which material, at which station. An [ERP system](https://www.m365.fm/entity/enterprise-resource-planning/) holds orders, items, routings and costs. OEE software focuses on equipment time and losses. Many OEE products overlap with an MES, and some MES products include OEE screens.

A simple test: do you need to prove which material went into which product, or to control the work order flow? That's MES territory. Do you want to know why your constraint machine loses time, shift by shift? That's an OEE question. If you need both, ask how the two share order data, so that operators don't enter the same information twice.

## How do you choose OEE software without a vendor ranking?

Use criteria you can test, and write them down before the first demo. Here is a set that works for most plants.

### Data capture

- Can it read states and counts directly from the machine controller, from added sensors, or both? Which of these does your equipment need?
- How does it handle machines with no digital output at all?
- How does an operator enter a stop reason? On a touchscreen, in two taps, with a list that supervisors can edit? A reason list with fifty items won't get used on a night shift.
- Does it detect small stops automatically, or only those that someone types in?

### Calculation and settings

- Where is the ideal speed set, and who is allowed to change it?
- How does it treat planned stops, breaks and changeovers? Can you see them as separate categories?
- Can you view the raw events behind a figure, not only the percentage?
- Does the formula follow the Lean definition, or does it follow ISO 22400-2? [ISO describes](https://www.iso.org/standard/54497.html) that standard as specifying key performance indicators for manufacturing operations management, each with its formula, elements, time behavior and unit. Names and time bases can differ between sources, so ask the vendor for the exact formula and compare it with your own.

### Use on the shop floor

- Is the screen readable from two meters away, in gloves, in a loud hall?
- Can an operator see the current shift without logging in to a full application?
- Does the tool work during a network outage and catch up later?

### Integration and ownership

- Which data can leave the system, and in what form? Can you export raw events, or only reports?
- How does it connect to your ERP, your MES and your reporting tools?
- Who owns the data, where is it stored and who can see it?
- What does the contract say about leaving: export, deletion, notice periods?

### Cost over time

- What do licenses cost per machine, per user or per site, and what changes when you add a line?
- What hardware does each machine need, and who installs and maintains it?
- Which part of the work needs the vendor, and which part can your own people do?

Score each candidate against the list with a small team: someone from operations, maintenance, IT and one operator. The operator's vote on the screen matters more than most managers expect.

## How do you test a tool before you commit?

A demo on the vendor's sample plant shows you nothing about yours. Ask for a pilot on your own machine, and run it like an experiment.

1. **Pick one machine.** Choose the constraint, or a machine that's known to lose time. An IndustryWeek article on using OEE correctly recommends focusing on the constraint, and warns against comparing shifts, departments or plants with it.
2. **Define terms in writing.** Planned production time, ideal cycle time, what counts as a good part, what counts as downtime. One page, signed off by operations and quality.
3. **Run the tool and a manual log side by side.** Have an operator or a supervisor record stops on paper for the same period. Compare counts, stop times and reasons.
4. **Look at the differences, not the score.** If the tool misses small stops or books a changeover as production, find out why before you go on.
5. **Hold a short weekly review.** Take the largest loss, discuss it with the operators and decide on one action. If the pilot produces no action, you are only collecting numbers.
6. **Decide with a checklist.** Did the counts match? Did operators use it without prompting? Did the results lead to a change? Could IT support the connection?

Here is a hypothetical example, invented only to show the method. A packaging line shows 82% availability in the tool, but the manual log suggests 74%. The difference turns out to be a rule that books every stop shorter than five minutes as running time. Nobody would have noticed on the dashboard. The side-by-side log did. Fixing that rule is worth more than any new chart.

## How do you connect it to ERP, older machines and Power BI?

### Older machines

Plants are rarely full of new equipment. For older machines you typically choose between reading the controller, adding sensors for run state and counts, or using a gateway that translates between protocols. OPC UA is a common target language here. The OPC Foundation describes it as carrying data from factory and process control devices to enterprise systems, with an emphasis on security, reliability and operation across platforms, and notes that it became the IEC 62541 standard in 2011. Ask a vendor which protocols it speaks, and test your oldest machine in the pilot, not your newest.

### ERP

You want orders and product data to flow in, so that the tool knows what is being made and its planned speed, and you want actual quantities and downtime summaries to flow back where it helps planning. Decide who owns the master data for items, routings and standard times. If the tool and the ERP system each keep their own copy, they will disagree within a month.

### Power BI and reporting

Many plants want OEE figures next to sales, quality and maintenance data in [Power BI](https://www.m365.fm/entity/power-bi/). Ask how the OEE tool delivers data: through a database, an export, an API or a push into a semantic model. The method matters for two reasons.

First, live screens and live reports are not the same thing. Microsoft documents automatic page refresh for reports on a [fixed interval or with change detection](https://learn.microsoft.com/en-gb/power-bi/create-reports/desktop-automatic-page-refresh), and lists which storage modes support it. Import mode is not supported. On shared capacity the minimum fixed interval is 30 minutes, and change detection is not available there. Dedicated capacity allows shorter intervals, set by an administrator. If someone promises a "live" Power BI report, ask what refresh mode and capacity it needs.

Second, check the vendor's plan against Microsoft's. The [real-time streaming page](https://learn.microsoft.com/en-us/power-bi/connect-data/service-real-time-streaming) says creation of push and streaming semantic models stays enabled until October 31, 2027, after which new ones can't be created. Existing ones are unaffected, and Microsoft points to Real-Time Intelligence in Microsoft Fabric as the alternative. A vendor whose Power BI link depends on streaming semantic models should be able to tell you how it will change.

Keep a division of labor. The shop floor screen should work without Power BI. Power BI is for trends, comparisons and management reports, not for the operator's live view.

## How do you get operators to use it?

Software doesn't improve OEE. People who see the numbers and can act on them do.

- **Involve operators before purchase.** Let them try the screen. If they hate it, they'll find ways around it.
- **Keep the stop-reason list short.** Start with a handful of reasons based on your six big losses, and refine after a month.
- **Use the data in the shift handover.** If nobody discusses the numbers, the system turns into extra work.
- **Never use OEE to blame.** One published OEE implementation guide puts it plainly: OEE is a tool for finding losses, not a scorecard to game. If operators feel punished, they stop reporting accurately.
- **Assign an owner for each loss.** One person per machine or line who looks at the top loss every week.

## Common mistakes

- Buying on the dashboard demo and testing data capture last.
- Starting on every machine at once, so no team can learn from the first line.
- Letting the vendor set the ideal speed without checking it against what the machine has actually achieved.
- Treating planned stops and changeovers as unavoidable and leaving them out of the analysis.
- Comparing OEE across different machines, products or plants, as if one score meant the same thing everywhere.
- Skipping the manual cross-check in the pilot.
- Leaving the connection to ERP and reporting until after the purchase.
- Collecting data for months without ever acting on the largest loss.

## Where Polaris fits

OEE software looks backward at equipment time. If your questions are also about the plan, such as which orders will be late or what a change in shifts does to throughput, a planning view helps. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production, working with ERP data. Its [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) module consolidates KPIs from the Polaris modules into dashboards, such as lead times, utilization and bottlenecks, and compares plans with actual performance. That is a different job from capturing machine states with sensors, so check what data source you need for the equipment-level figures before assuming one tool covers both.

## Related topics to explore

- **Connecting OEE data to ERP:** which orders and quantities should move in each direction, and who owns the master data.
- **Retrofitting older machines:** sensors, controller access and protocol gateways for equipment without a digital interface.
- **OEE for small and mid-sized plants:** how to start with a paper log and one machine, and what a tool must offer to grow later.
- **From OEE to root cause:** how to link losses to shifts, material batches and changeovers with simple analysis before adding predictive tools.
- **Predictive maintenance alerts:** what data you need before machine learning adds value over simple thresholds.

## Next step

Choose one constraint machine and write down your definitions of planned time, ideal speed and downtime on a single page. Then ask each vendor on your shortlist to run the pilot for this OEE software decision on that machine, using your definitions, and compare their counts with a manual log before you sign.
