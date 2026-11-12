---
title: "Manufacturing KPI Dashboard: What to Show and How to Build It"
summary: "A manufacturing KPI dashboard works when each number has an owner and an action. Learn which KPIs to pick, how to define them and how to build it in Power BI."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [power-bi, oee, manufacturing, key-performance-indicator, power-bi-data-alerts, polaris-analyzer, ifakt]
keypoints:
  - "A manufacturing KPI dashboard should show the few numbers a team needs to decide what to do next, each with an owner, a target and a clear action when it goes off target."
  - "ISO 22400-1 offers an industry-neutral framework for defining and using KPIs in manufacturing operations management, which helps you write one definition that every plant uses."
  - "Build one view per role. A supervisor needs the current shift, a plant manager needs weekly trends, and mixing the two buries both."
  - "Roll up percentages from raw counts or time, never by averaging daily percentages, or a short shift will count as much as a long one."
  - "Power BI data alerts work only on refreshed data and only on gauges, KPIs and cards, so choose the few numbers that should trigger a message."
faq:
  - q: "What should a manufacturing KPI dashboard show?"
    a: "Only the numbers that drive a decision for the people looking at it. For most plants that means delivery performance, output against plan, equipment effectiveness and downtime, scrap, and sometimes inventory. Each KPI needs an owner, a target and an agreed action when it goes off target. Extra numbers belong in drill-down reports."
  - q: "How many KPIs should one dashboard have?"
    a: "Fewer than most teams think. Microsoft's Power BI guidance advises keeping the dashboard clean and uncluttered, with the highest-level data at the top left, and notes that fewer tiles read better on tablets and phones. As a rule of thumb, aim for a handful of tiles per role, with detail one click away."
  - q: "Can Power BI send an alert when a KPI goes off target?"
    a: "Yes, with limits. Data alerts work on gauge, KPI and card tiles pinned from reports, only on numeric data and only when the data has refreshed. Alerts arrive in the notification center and can also be sent by email. They are personal, so each person who needs one has to set their own."
---

A manufacturing KPI dashboard is one screen that shows the few numbers a team needs to decide what to do next: ship, fix, re-plan or leave alone. It isn't a reporting archive. This guide is for operations managers in [manufacturing](https://www.m365.fm/entity/manufacturing/) who have to decide which KPIs go on it, how to define them and how to build it, with [Power BI](https://www.m365.fm/entity/power-bi/) as the example tool.

## What belongs on a manufacturing KPI dashboard?

Start with decisions, not data. For every number you consider, ask: who looks at this, what would they do if it turned red, and how soon? If nobody can answer, leave it off. The [key performance indicator](https://www.m365.fm/entity/key-performance-indicator/) is only useful when it comes with an owner, a target and a response.

Most plants end up with a core set in five groups:

- Delivery. On-time delivery to the customer, and schedule attainment inside the plant (how closely actual output followed the plan).
- Flow. Lead time, work in process, order backlog.
- Equipment. [OEE](https://www.m365.fm/entity/oee/) and the downtime reasons behind it.
- Quality. Scrap rate, rework, first-pass yield.
- Cost and inventory. Cost per unit, inventory levels, but usually only on the plant manager's view.

OEE deserves a note. The OEE FAQ at [oee.com](https://www.oee.com/faq/) describes it as availability multiplied by performance multiplied by quality, the ratio of fully productive time to planned production time. The same page calls the often-quoted 85% world-class figure "completely artificial" as a universal benchmark, and it warns that comparing OEE across machines or plants is only sound when products, equipment and conditions are alike. Use OEE as a trend for the same asset, and treat cross-plant rankings with suspicion.

## How do you define each KPI so everyone reads it the same way?

Two people can build "on-time delivery" and get two different numbers. One counts against the promised date, the other against the requested date. The dashboard then starts an argument instead of a decision.

ISO 22400-1 helps here. [ISO describes it](https://www.iso.org/standard/56847.html) as an industry-neutral framework for defining, composing, exchanging and using KPIs in manufacturing operations management, covering batch, continuous and discrete industries. It explains what a KPI is, how to construct one and which terms to use. Part 2 of the series defines a selected set of KPIs, each with a formula, its elements, time behavior and unit. You don't have to certify against it. Using it as a template for your own definitions saves a lot of debate.

Keep a one-page definition card for every KPI:

1. Name and one-sentence purpose.
2. Formula, including what counts and what doesn't (planned stops, test runs, rework).
3. Data source and refresh time.
4. Time basis: per hour, per shift, per week.
5. Unit and target, and who set the target.
6. Owner, and the action expected when it goes off target.

### Why do averages of percentages mislead?

Because they treat a short run like a long one. Here is an invented example. Line 1 runs eight hours at 80% equipment effectiveness. Line 2 runs two hours at 50%. The simple average is 65%. Weighted by planned time it's (8 × 0.8 + 2 × 0.5) ÷ 10 = 74%. The oee.com page recommends this kind of weighting for a plant-level figure, by planned production time or by value added. The general rule works for scrap, yield and attainment too: add up the counts or the time first, then calculate the percentage once.

## Who is the dashboard for?

Build one view per role. A single "plant dashboard" that tries to serve everyone ends up with 30 tiles, and nobody reads it.

- Shift supervisor. The current shift: output against plan by hour, current stops and their reasons, scrap, the next order. Updated within the shift.
- Plant manager. Weekly and monthly trends: delivery, OEE, scrap, backlog, cost. Updated daily is usually enough.
- Planner. Schedule attainment, late orders, capacity load for the next days.
- Maintenance. Downtime by cause and machine, open work orders, repeat failures.

Microsoft's [dashboard design tips](https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips) fit this approach. The page asks you to consider how the audience uses the dashboard and which metrics help them decide. It recommends a clean, uncluttered layout with all tiles on one screen, the highest-level data at the top left, and big card visuals for the numbers that matter. It also advises against hard-to-read visuals such as 3D charts, and says to keep axis scales and colors consistent. A dashboard meant for a tablet or phone needs fewer tiles than one on a large monitor.

If some people shouldn't see cost or personnel data, set that up in the data model. Power BI supports row-level security, where roles filter which rows a user sees. Note that it applies to workspace viewers, not to people who can edit the model, so check who has which workspace role.

## Where does the data come from, and how often should it refresh?

Four sources cover most of it:

- The ERP system for orders, quantities, due dates and cost.
- A manufacturing execution system or shop floor data capture for starts, stops, counts and scrap.
- Machine signals, where they exist, for run state and cycle counts.
- A quality system for inspection results and holds.

The hard part is that these sources describe the same order differently. The ERP knows an order by number and due date. The machine knows a part count and a state. Someone has to map between them, and that someone needs a name on the project plan.

Decide refresh by decision. A supervisor reacting inside a shift needs data in minutes. A plant manager reviewing delivery performance can live with a daily refresh. Faster costs more to build and to maintain, and a fast refresh of bad data is just a faster wrong answer.

### Can the dashboard tell you when something is wrong?

Power BI [data alerts](https://www.m365.fm/entity/power-bi-data-alerts/) can. According to [Microsoft Learn](https://learn.microsoft.com/en-us/power-bi/create-reports/service-set-data-alerts), they work on gauge, KPI and card tiles pinned from report visuals, only with numeric data and only on data that has refreshed. Notifications appear in the notification center and can also go by email, and alerts can be automated with Power Automate. They are personal: alerts don't support co-ownership, and only the person who sets one sees it. Use them for the two or three numbers where a late reaction costs money, such as a stop at the bottleneck. More than that and people mute them.

## How do you build the dashboard step by step?

1. **Pick one line and one audience.** A supervisor view for one line is a good first target.
2. **Write the definition cards.** Six to eight KPIs at most, agreed with the people who own them.
3. **Get the data into one model.** Orders, production events, downtime events and scrap as clean tables with shared keys such as order number, line and shift. Fix the keys before you design anything.
4. **Create each measure once.** Put the formulas in the model, not in individual visuals, so every page uses the same definition.
5. **Design the page.** Highest-level number top left, then detail. Same scale and color rules everywhere.
6. **Add alerts for a few numbers.** Test that they fire on refreshed data.
7. **Pilot for two to four weeks on one shift.** Ask what people looked at, what they ignored and what they needed but couldn't find.
8. **Review every week.** Look at which decisions the dashboard actually changed. Remove tiles nobody used.

Only then copy it to other lines. Don't copy blindly. Each line has its own stops, its own products and its own targets.

## Example: one supervisor view (invented numbers)

This is an invented illustration of how a view could be organized, not a measured result.

A supervisor view for a packaging line has six tiles. At the top left is output against plan for the shift so far. Next to it sits the current state of the line (running, stopped, changeover) with the stop reason. Below are scrap since the start of the shift, OEE for the last full shift, the top three downtime reasons this week, and the next three orders.

At 10:15 the output tile shows the line 40 units behind plan, and the stop tile shows a jam that has recurred three times this week. The supervisor calls maintenance and moves a short order forward. The number didn't fix anything. The tile showed what to do and who to call.

## Common mistakes

- **Too many KPIs.** If a screen needs a legend, it has too much on it.
- **No owner and no action.** A red tile that nobody is responsible for becomes wallpaper.
- **Averaging percentages.** Add the counts first, then calculate the percentage.
- **Changing definitions quietly.** If a formula changes, announce it, date it and mark the trend line.
- **Copying targets from another plant.** Different products and equipment need different targets.
- **Manual data entry as the main source.** It's slow, and it drifts away from the truth over time.
- **One dashboard for all roles.** Build the view per audience.
- **Ignoring data quality.** A beautiful dashboard on wrong stop codes just displays the wrong thing.

## Where Polaris fits

If your KPIs should compare plan and actual, iFAKT Polaris is one option to look at. [iFAKT](https://www.m365.fm/entity/ifakt/) describes Polaris as AI plus a digital twin for production. Its [Polaris Analyzer](https://www.m365.fm/entity/polaris-analyzer/) module consolidates KPIs from all Polaris modules in dashboards, including lead times, utilization, bottlenecks and project status, and compares scenarios, plans and actual performance. It draws on the data of the other modules, so it fits best where you also plan or simulate in Polaris. For a plain Power BI dashboard on your own data, the steps above apply either way.

## Related topics to explore

- **Predictive KPIs.** Forecasting downtime or OEE needs a long, reliable history first. Get the basic dashboard accurate before you add prediction.
- **Anomaly alerts.** Decide which jumps in scrap or cycle time deserve a message, and who answers it.
- **Setting targets and benchmarks.** Use your own trend and similar plants before any "world-class" figure.
- **Discrete versus process plants.** Assembly lines care about cycle time and changeovers. Batch and continuous plants care about yield and batch consistency.

## Next step

A good manufacturing KPI dashboard starts with a definition, not a chart. Pick the one line you know best, write the definition card for its three most important KPIs, and agree on an owner and an action for each before you open Power BI.
