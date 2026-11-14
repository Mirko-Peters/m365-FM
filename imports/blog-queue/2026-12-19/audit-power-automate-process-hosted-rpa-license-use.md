---
title: "Audit Power Automate Process and Hosted Process License Use Across Environments"
summary: "How to check where Process and Hosted Process capacity is allocated, what each license covers, which Microsoft-documented reports show usage, and where a cross-environment view needs your own consolidation."
status: review
publish: false
author: mirko-p
date: 2026-12-19
topics: [power-automate, power-automate-process-license, rpa]
keypoints:
  - "Process and Hosted Process licenses are capacity licenses that license flows and machines, not users. They are environment-specific, so an audit has to be repeated per environment."
  - "A Process license gives a cloud flow 250,000 actions per day. Up to 10 licenses can be stacked on one flow, and a flow group lets up to 25 solution flows share one license without stacking."
  - "On a machine, each allocated Process license becomes one unattended bot, and each hosted machine or group bot comes from the Hosted RPA pool. Max bots and committed bots control group scaling."
  - "Learn describes per-environment utilization pages, Power Platform request reports and the Licensing > Power Automate > Usage view. It describes no single report for all environments."
  - "The Unattended RPA and Hosted RPA add-ons are legacy. Learn says the unattended add-on was replaced by the Process license and hosted add-ons convert automatically to Hosted Process licenses."
faq:
  - q: "What does a Process license cover?"
    a: "Learn says Process and Hosted Process licenses license the flows and machines, not the user. A Process license on a cloud flow gives it a dedicated 250,000 action daily entitlement and premium connector access regardless of who runs it. On a machine it becomes an unattended bot that runs one desktop flow at a time."
  - q: "Do I need Process licenses in every environment?"
    a: "Per Learn, Process licenses are environment-specific. Importing a flow into another environment creates a separate flow, and flow groups and capacity assignments are environment-specific too. User licenses such as Power Automate Premium are assigned at tenant level."
  - q: "Where do I see the current usage?"
    a: "Learn names the Process capacity utilization page and the Hosted Process capacity utilization page per environment, the Licensing, Power Automate, Usage view in the Power Platform admin center, and action usage reports labeled Power Platform Requests, which are in public preview."
  - q: "How do I find flows at risk of suspension?"
    a: "The licensing FAQ points to the Get-AdminFlowAtRiskOfSuspension PowerShell script for tenants with fewer than 500 environments. It says a flow that stays above limits for 14 consecutive days is suspended and the owner is notified."
  - q: "Is the Hosted RPA add-on still sold?"
    a: "Learn marks the Hosted RPA add-on as legacy and says it is automatically converted into Power Automate Hosted Process licenses with no action needed. The Unattended RPA add-on has been replaced by the Process license, and existing add-ons should not be renewed."
---

Auditing Power Automate Process licensing means answering three questions for every environment: how much Process and Hosted Process capacity is allocated, to which flows and machines, and how much of it is actually used. Microsoft Learn documents per-environment utilization pages and several admin center reports. It does not document a single view across all environments, so an audit across many environments needs a routine of your own.

## Know what you are auditing

Learn separates user licenses from capacity licenses:

- **Process license.** Allocated to a cloud flow or a machine. It licenses the flow or machine, not the user.
- **Hosted Process license.** A superset of the Process license, with Microsoft-hosted machine capacity. It can be allocated to a hosted machine, hosted machine group, cloud flow or machine.
- **Premium user license.** Intended for a human user. It includes one attended bot. It is required for RPA developers to build desktop flows.

The legacy add-ons matter when you read old purchase records. The Unattended RPA add-on has been replaced by the Process license, and existing add-ons can be used interchangeably with Process licenses. The Hosted RPA add-on is automatically converted into Hosted Process licenses.

## What each license gives

| Item | Process | Hosted Process |
|---|---|---|
| Daily actions | 250,000 per license | 250,000 per license |
| Unattended bot | One | One, plus one hosted bot |
| Allocated to | Cloud flow or machine | Hosted machine, hosted group, cloud flow or machine |
| Other entitlements | 50 MB Dataverse database, 200 MB file storage, 5,000 AI Builder credits per month | Same |

The daily actions appear as Power Platform Requests in admin center reports. Each trigger and action execution counts as one action, and actions inside a loop count once per iteration. Desktop flow actions inside the desktop flow do not count. Only those invoked from cloud flows do.

## Step 1: List environment-level allocation

Process capacity must first be assigned to an environment. In the Power Platform admin center, select **Licensing** > **Capacity add-ons**, open the **Add-ons** tab and check the usage gauge for each capacity. The **Summary** tab offers **Download reports**. The **Manage add-ons** panel shows allocation per environment. If you want to limit who can allocate, Learn describes the tenant setting **Add-on capacity assignments** with **Only specific admins**.

Record per environment: capacity assigned, capacity used, and who can change it.

## Step 2: Check allocation to flows and machines

In each environment, Learn points to two pages:

- **Process capacity utilization** lists Process licenses allocated to cloud flows and machines in the environment. Learn notes that a detailed breakdown of cloud flow allocations is not available yet.
- **Hosted Process capacity utilization** lists Hosted Process licenses allocated to hosted machines and groups.

Also check:

- **Cloud flows.** The details page shows the plan. New flows default to the user plan. A flow with a Process license shows **Process plan**. A flow on a machine with unattended bots shows **Process plan inherited from machine**, with 250,000 actions per day that cannot be stacked.
- **Stacking.** Up to 10 licenses can be stacked on one flow, each adding 250,000 actions per day. A flow group lets up to 25 solution-aware cloud flows share one license, and licenses cannot be stacked on a group. Child flows must be added explicitly, since capacity is not inherited.
- **Machines.** In the machine **Settings**, the **Unattended bots** slider shows allocated capacity. **Enable auto-allocation** allocates bots at runtime, and they stay until manually deallocated. A machine's maximum number of bots equals the number of concurrent Windows sessions it can open, up to 10 on some Windows Servers.
- **Hosted groups.** **Max bots** is the most hosted bots a group can auto-allocate. **Committed bots** is the guaranteed number. Multiple groups can share a pool through load balancing.

Only solution flows can have Process capacity assigned, so flows outside solutions are a finding on their own.

## Step 3: Measure consumption

Learn lists these sources:

- **Licensing** > **Power Automate** > **Usage** in the Power Platform admin center for current totals.
- Action usage reports, in public preview: a user report, a per flow licensed flows report that covers flows with a Per-flow or Process license, and a nonlicensed user report.
- **Analytics** on a flow's details page, with the **Actions** chart.

Estimate the need as actions per run times runs per day. If the result is above 250,000, stack more licenses.

## Step 4: Flag risk

The licensing FAQ describes what happens at the limit: delayed runs of later actions, a banner on the throttled flow, and suspension after 14 consecutive days above the limits, with a notification to the owner. For tenants with fewer than 500 environments, it points to `Get-AdminFlowAtRiskOfSuspension`. Larger tenants should raise a support ticket.

Other items worth checking in the audit:

- Flows owned by users who left, since the FAQ says a flow is downgraded and turned off after 14 days if the owner loses the Premium license.
- Flows that run under an application user, process large data or are invoked by many users. Learn lists these as criteria that call for a Process license.
- Licenses that stay unallocated while flows run throttled.

## Where the documentation stops

The pages read for this article do not describe:

- one report that covers Process and Hosted RPA allocation for all environments at once;
- an hourly or per-run view of hosted bot consumption;
- how the superset behavior of Hosted Process, where it covers Process overage, works in practice. Learn says the behavior and its admin center setting are not yet available.

If you need a tenant-wide table, build it yourself from the per-environment pages and the downloadable capacity reports, and add the review date. Also note that assignment changes can take time to show: the FAQ says a license can take up to seven days to appear in the portal banners, and editing and saving the flow refreshes the status.

## A repeatable checklist

1. Export the capacity report from the **Summary** tab.
2. For each environment with Process capacity, open the Process capacity utilization page.
3. Note flows with stacked licenses and flow group membership.
4. Compare with the Power Platform request reports for the same flows.
5. List machines with auto-allocation on and hosted groups with high max bots.
6. Record findings and the next review date.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Automate Process license (per flow)](https://www.m365.fm/entity/power-automate-process-license/)
- [Robotic Process Automation](https://www.m365.fm/entity/rpa/)

## Sources

- [Power Automate license types (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/types)
- [Power Automate licensing FAQ (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs)
- [Deep dive on Process and Hosted Process licenses (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/deep-dive-on-specific-license)
- [Power Automate add-ons (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/add-ons)
- [Process capacity (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/desktop-flows/capacity-process)
- [Capacity add-ons in the Power Platform admin center (Microsoft Learn)](https://learn.microsoft.com/en-us/power-platform/admin/capacity-add-on)
- [Hosted RPA overview (Microsoft Learn)](https://learn.microsoft.com/en-us/power-automate/desktop-flows/hosted-rpa-overview)
