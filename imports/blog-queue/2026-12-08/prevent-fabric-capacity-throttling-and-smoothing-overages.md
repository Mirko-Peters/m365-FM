---
title: "Prevent Fabric capacity throttling and smoothing overages in workspaces"
summary: "How Microsoft Fabric smoothing and throttling stages work, how to read the Capacity Metrics app, and which steps reduce overages: optimize heavy items, consider surge protection, and scale out or scale up."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [fabric-capacity, fabric, fabric-workspace]
keypoints:
  - "Throttling is based on future capacity use. Fabric smooths background work over 24 hours and interactive work over 5 to 64 minutes before it decides to delay or reject requests."
  - "Four stages apply: up to 10 minutes of overage is protected, then interactive delay, then interactive rejection above 60 minutes, then background rejection above 24 hours."
  - "The Capacity Metrics app shows the cause: its Utilization, Throttling and Overages views, plus a matrix of items and operations sorted by CU seconds."
  - "Microsoft names three strategies for high usage: optimize, scale up and scale out. Surge protection helps too but is no substitute for them."
  - "Throttling is per capacity, so moving a workspace to another capacity isolates its load from critical content."
faq:
  - q: "What is the difference between bursting and smoothing in Fabric?"
    a: "According to Microsoft Learn, bursting lets an operation temporarily use more compute than the SKU provides. Smoothing then spreads that operation's capacity unit use over future 30-second timepoints. Interactive operations are smoothed over at least 5 minutes and up to 64 minutes, and background operations over 24 hours."
  - q: "When does Fabric start rejecting requests?"
    a: "Learn describes four stages. Overage up to 10 minutes is protected, between 10 and 60 minutes interactive jobs are delayed by 20 seconds at submission, between 60 minutes and 24 hours interactive jobs are rejected, and above 24 hours all requests are rejected. Operations already running continue to completion."
  - q: "How can I recover from throttling quickly?"
    a: "The throttling page on Microsoft Learn lists waiting, because capacities are self-healing, or on F SKUs temporarily increasing the SKU, pausing and resuming the capacity, or enabling capacity overage billing. It notes that pausing creates a billing event for accumulated future usage and can make content unavailable. P SKUs can enable Autoscale."
  - q: "Does throttling affect the whole tenant?"
    a: "No. Microsoft Learn states that throttling applies per capacity, not per tenant. Only operations requested after throttling starts are affected, and workspaces on other capacities are not part of that capacity's calculation."
  - q: "Where do I see what caused an overage?"
    a: "In the Microsoft Fabric Capacity Metrics app. Learn describes the Utilization, Throttling and Overages tabs and a matrix by item and operation. Sorting by CU seconds shows top consumers, and the Overloaded minutes field shows which items were most affected."
---

Fabric throttling happens when a capacity uses more compute than its SKU allows, after smoothing is applied. Learn names three strategies for a heavily used capacity: optimize, scale up and scale out, without ranking them. The order used in this article is my own: find the items that consume the most capacity units (CUs), optimize them, consider surge protection, isolate critical content on its own capacity, and scale up when optimization is not enough.

## How smoothing and throttling work

Microsoft Learn explains the mechanics. **Bursting** lets operations temporarily use more compute than the SKU provides. **Smoothing** spreads an operation's CU use over future timepoints, which are 30 seconds long.

- **Interactive operations** (for example, report queries) are smoothed over at least 5 minutes and up to 64 minutes, depending on how much CU they use.
- **Background operations** (for example, semantic model or dataflow refreshes) are smoothed over 24 hours.

Smoothing does not apply when Autoscale Billing for Spark is enabled, because Spark use is then pay-as-you-go.

Throttling is based on how much future capacity is already used. Learn lists four stages:

| Future use already consumed | Policy | Effect |
|---|---|---|
| Up to 10 minutes | Overage protection | No throttling |
| 10 to 60 minutes | Interactive delay | User-requested interactive jobs are delayed by 20 seconds at submission |
| 60 minutes to 24 hours | Interactive rejection | User-requested interactive jobs are rejected |
| More than 24 hours | Background rejection | Requests are rejected until the capacity recovers |

Only operations requested after throttling starts are affected, and in-flight operations run to completion. Throttling applies per capacity, not per tenant. Typical error signals are the status code `CapacityLimitExceeded` and the message that the organization's Fabric compute capacity has exceeded its limits.

### A worked example from Microsoft

Learn uses an F2 capacity and one background operation that consumed 1 CU hour, which is 3,600 CU seconds. Spread over the 2,880 timepoints in 24 hours, it adds 1.25 CU seconds per timepoint. An F2 provides 60 CU seconds per timepoint, so the operation takes about 2.1 percent of each timepoint. Learn's point is that the F2 is not throttled even though the job consumed six times the CUs available in the next 10 minutes, because smoothing spreads the total over 24 hours. My reading is that throttling usually needs many jobs stacking up in the same window.

Overage means use above the SKU in a timepoint, calculated after smoothing. Overage beyond the 10-minute window becomes carryforward, and unused capacity in later timepoints burns it down.

## Step 1: Find the cause in the Capacity Metrics app

The Compute page of the Microsoft Fabric Capacity Metrics app has three tabs.

1. **Utilization** shows Background % and Interactive % per 30-second period. Columns above the CU % limit line are overloaded timepoints.
2. **Throttling** shows delay and rejection over time. Learn gives a reading rule: if 75 percent of the future capacity consumption is used at a timepoint, about 15 minutes remain before rejection starts.
3. **Overages** shows carryforward (added, burned down and cumulative) and, when capacity overage billing is on, billed overage.

To find the culprit:

1. Select an overloaded timepoint and open the timepoint detail.
2. Compare background and interactive use to see which type dominates.
3. In the matrix by item and operation, sort by **CU (s)**.
4. Add the **Overloaded minutes** field to see which items were most affected.

Learn also describes a **Performance delta** field that compares with seven days earlier, which can flag items that are getting worse.

## Step 2: Optimize the heavy items

The optimization article on Microsoft Learn gives workload-specific advice:

- **Power BI.** Interactive hot spots include models that do not follow star schema practice, inefficient DAX, pages with too many visuals and high concurrency. Background hot spots include inefficient Power Query logic and missing incremental refresh for large fact tables.
- **Data Factory.** Avoid expensive merges and sorts, get query folding where possible, disable staging for small volumes and do not refresh more often than the source changes.
- **Spark.** Reserve only the executors you need, because over-requesting can fail with an HTTP 430 status. Stop idle sessions, since active sessions accrue CU use. The default session expiration is 20 minutes.
- **Warehouse.** Use the smallest data types possible, a star schema and current statistics.

## Step 3: Consider surge protection

Learn describes surge protection as a way to limit the total compute that background jobs consume. When it is active, background jobs are rejected. The page says it is not a substitute for optimization, scaling up or scaling out.

## Step 4: Isolate and scale

- **Scale out.** Move workspaces or items to another capacity to spread the load. Learn suggests a separate capacity for high-priority content, such as executive reporting.
- **Scale up.** For F SKUs you can resize, pause and resume to match consumption. Learn advises starting small and growing, and using trial or pay-as-you-go capacities to measure real need.

Learn does not rank these options. The order of the steps in this article is my own suggestion.

## Recovering during an incident

Learn lists these options:

- Wait, because capacities are self-healing.
- On F SKUs, temporarily increase the SKU, or pause and resume the capacity. Pausing creates a billing event for accumulated future use and can make content unavailable.
- Enable capacity overage billing, which Learn says costs three times the normal capacity rate.
- On P SKUs, enable Autoscale.

## Common mistakes (own reading of the pages above)

- Treating a single throttling event as proof that the SKU is too small.
- Scheduling many large background refreshes close together. The pages do not state this rule directly, but they say background work counts against the same 24-hour smoothing window.
- Leaving Spark sessions idle.
- Pausing a capacity during throttling without checking the billing effect.

## Related

- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric workspace](https://www.m365.fm/entity/fabric-workspace/)

## Sources

- [Understand capacity throttling in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/enterprise/throttling)
- [Evaluate and optimize your Microsoft Fabric capacity](https://learn.microsoft.com/en-us/fabric/enterprise/optimize-capacity)
- [Understand the metrics app compute page](https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app-compute-page)
