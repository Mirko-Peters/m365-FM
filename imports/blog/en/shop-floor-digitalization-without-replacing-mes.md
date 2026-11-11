---
title: "Shop Floor Digitalization: Where to Start Without Replacing Your MES"
summary: "Shop floor digitalization does not mean a new MES. Learn where to start: one problem, the production data you already have, and a feedback loop to the floor."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [manufacturing-execution-system, polaris-operator, industry-4-0, shop-floor-management]
keypoints:
  - "You can digitalize the shop floor in steps and keep your existing MES. Add the missing data and feedback loops around it."
  - "Start with one concrete problem, such as manual reporting, unknown downtime reasons or a plan that the floor cannot see."
  - "Use the production data you already have first, then close the gaps with simple capture at the machine or the cell."
  - "Connect systems through defined interfaces, using ISA-95 as a map of which level owns which data."
  - "Measure the result with a few metrics, such as reporting time, schedule adherence and unplanned downtime."
faq:
  - q: "Do I need to replace my MES to digitalize the shop floor?"
    a: "No. A manufacturing execution system already handles many functions at level 3 of the ISA-95 model. Most plants gain more by adding what it lacks: better data capture, a live view of the plan, digital boards or a feedback loop to planning. Replace the MES only if it cannot meet a defined requirement."
  - q: "What is the first step in shop floor digitalization?"
    a: "Pick one concrete problem and one cell or line. Write down what the team does today, what data it needs and where it is lost. Then fix that flow: capture the data once, show it where decisions are made and feed it back. A narrow start gives results within weeks and shows what the next step should be."
  - q: "What production data should I collect first?"
    a: "Start with data that supports a daily decision: units made against plan, reasons for stops, scrap or rework, and job start and finish times. Take it from existing systems where you can. Add manual capture only for the gaps. More data is not better. Collect only what the team will use."
---

Shop floor digitalization means capturing production data where it arises, showing it where decisions are made and feeding it back into planning. You can do this without replacing your manufacturing execution system (MES). This article is for plant managers who have an MES, a few spreadsheets and a long list of ideas, and who need to know where to start. It explains the layers, the first steps, a worked example of the effect and the mistakes that waste the budget.

## What does shop floor digitalization actually mean?

The term is wide. In practice it covers four things:

- **Capture.** Get production data from machines and people without retyping it: counts, stops, scrap, job progress.
- **Visibility.** Show the data on a digital shop floor board or screen in real time, next to the plan.
- **Guidance.** Give operators the current job, instructions and priorities digitally, instead of paper.
- **Feedback.** Send actual progress back to planning, so the next plan starts from reality.

Digitalization is a means, not a goal. It is useful when it removes a specific waste, such as double entry, late information or decisions on old data. It is part of the larger [Industry 4.0](https://www.m365.fm/entity/industry-4-0/) movement, but you do not need a full program to begin.

## Where does the MES fit, and why keep it?

A useful map is the ISA-95 standard. The OPC Foundation describes [ISA-95](https://reference.opcfoundation.org/specs/OPC-10030/4.2.3) as the enterprise and control system integration standard, which focuses on information exchange between manufacturing operations systems and between those systems and business systems. It describes five levels:

- **Level 0:** the physical process.
- **Level 1:** sensors and actuators.
- **Level 2:** automation and control systems, such as PLCs, with real-time responses.
- **Level 3:** manufacturing operations management, on time frames from days down to seconds. It covers functions such as maintenance, quality assurance, inventory movement, detailed scheduling, work dispatching and work or product tracking.
- **Level 4:** business planning and logistics, typically in ERP systems, over months, weeks and days.

A [manufacturing execution system](https://www.m365.fm/entity/manufacturing-execution-system/) lives at level 3. If it works for your core tasks, such as tracking orders and recording quality data, replacing it brings cost and risk, and often no gain. The gaps are usually elsewhere: in data that never reaches the system, in a plan that the floor cannot see, or in information that arrives a day late. Closing those gaps can often be done around the MES, through its interfaces.

Ask three questions before you buy anything:

1. What does the MES do well today?
2. Which decisions on the floor are made on missing or late data?
3. Can the gap be closed by an interface, a screen or a simple capture step?

## Where do you start?

Follow these steps.

1. **Choose one problem.** Examples: team leaders spend time copying numbers, stop reasons are unknown, the floor works from a printed plan that is already outdated, or reports reach management a day late.
2. **Pick one pilot cell.** Choose a line with a willing team leader and a clear pain.
3. **Map the data flow today.** For one shift, write down every piece of information the team needs, where it comes from, who types it and where it ends up. This shows where data is lost or duplicated.
4. **Use the production data you already have.** Pull what exists from the ERP and the MES: orders, routings, quantities, confirmations. Often most of the data is already there and the gap is a few fields.
5. **Close the gaps with the simplest capture.** A tablet at the cell, a button to log a stop reason or a barcode scan is often enough. Add sensors only where manual capture does not work.
6. **Show it where decisions are made.** Put the plan and the actual numbers on a screen at the cell, with the same few metrics every day.
7. **Feed it back.** Send actual progress back to planning so the next plan reflects reality.
8. **Review after four weeks.** Check the metrics, remove what nobody uses and decide the next cell.

## Which data should you collect first?

Collect only data that supports a decision. A short list for the first stage:

- Units made against plan, per hour or shift
- Stop events and reasons, in a short fixed list
- Scrap and rework counts with a reason
- Job start and finish times
- Material availability for the next jobs

Resist the temptation to capture everything. Data that nobody uses costs time to record and creates mistrust. Agree on definitions first: what counts as a stop, when a job starts, what is scrap. Without this, the numbers from different shifts cannot be compared.

## How does digital shop floor management fit in?

Digital shop floor management moves the boards and routines of [shop floor management](https://www.m365.fm/entity/shop-floor-management/) onto screens. The daily meeting, the KPIs and the action list stay the same. What changes is that the numbers come from real-time data, the visualization updates itself and nobody retypes anything. Digital work instructions are the guidance side: the operator sees the current job and the right instruction on a screen. Both are small parts of a wider digital transformation. Both should serve productivity on the floor, not the other way round. Use them to optimize flow and to shorten the time between a problem and its fix.

## Example: the cost of manual reporting

This is an illustration with made-up numbers.

A plant has 10 cells on 3 shifts. In each shift, a team leader spends 20 minutes writing production counts and stop reasons on paper and 10 minutes typing them into a spreadsheet. That is 30 minutes per cell per shift.

- Per day: 10 cells × 3 shifts × 30 minutes = 900 minutes, or 15 hours.
- Per week of five days: 75 hours.

The team picks one pilot cell and introduces a tablet where operators log counts and stop reasons once, and the data flows to the board and to the system. The 10 minutes of typing disappear and the 20 minutes of writing fall to 5. The saving is 25 minutes per shift in that cell, or 75 minutes per day, which is 6.25 hours per week. Rolled out to all 10 cells, the same saving would be 62.5 hours a week. These are assumptions, and the gain depends on your real process. More important than the saved hours: the numbers are now on the board within minutes, not the next morning.

## How do you connect the new layer to the old systems?

Keep the connection simple and defined.

- Use the interfaces your MES and ERP already offer, and agree on which system owns which data: orders in the ERP, detailed schedule and tracking in level 3, machine data from level 2.
- Write the data fields and the update frequency down for each flow.
- Avoid parallel truths. If two systems hold the same value, decide which one is right.
- Plan for support: who maintains the interface, and who answers when a screen is blank.

For continuous improvement, the digital layer should make loops shorter: stop reasons visible the same day, trends visible after a week. The Lean Enterprise Institute describes an [andon](https://www.lean.org/lexicon-terms/andon/) as a visual management tool that highlights the status of operations in an area at a single glance. A digital board does the same job for a whole plant.

## Common mistakes

- **Buying a platform before defining the problem.** Tools do not set priorities. The pain does.
- **Replacing the MES by default.** Check what a connection or a screen would solve first.
- **Starting with too many cells.** A pilot on one cell gives you a lesson at low cost.
- **Collecting data nobody uses.** Every field needs a decision it supports.
- **Ignoring the operators.** If the capture step adds work without benefit to them, they will work around it.
- **No owner for the data.** Without a named owner, definitions drift and trust falls.

## How software can help

The goal is software that closes the gap between the plan and the floor without replacing what works. iFAKT's [Polaris Operator](https://www.m365.fm/entity/polaris-operator/) brings production plans to the shop floor as time-based tasks and feeds progress back to planning in real time. Evaluate any such tool against your pilot problem, and ask how it connects to the systems you already run.

## Next step

Write down one problem on one cell this week and map how its data flows today. That map shows whether you need a new MES or just a better connection for shop floor digitalization.
