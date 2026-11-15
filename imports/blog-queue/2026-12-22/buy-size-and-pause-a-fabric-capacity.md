---
title: "Buy, Size and Pause a Microsoft Fabric Capacity to Save Cost"
summary: "Buy a Fabric F SKU in the Azure portal, understand the size table, and pause or resume a capacity. Covers permissions, quota, billing on pause, and warnings from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [fabric-capacity]
keypoints:
  - "Buy an F SKU in the Azure portal with Create Fabric Capacity. You need an Azure subscription, the Microsoft.Fabric resource provider and enough capacity unit quota."
  - "Size is chosen on the Basics tab. F SKUs are measured in capacity units, from F2 with 2 CUs up to F8192, and F64 is the first size that matches P1 compute."
  - "Below F64, every user viewing Power BI content needs a Pro, PPU or trial license. At F64 or larger, free-license viewers can view."
  - "Pause and resume need Azure RBAC actions. Pausing can make Fabric content unavailable, and remaining overages and smoothed operations are added to your Azure bill."
  - "Resuming also resumes billing. An Azure runbook can schedule pause and resume, and REST APIs can pause and resume a capacity."
faq:
  - q: "What do I need before buying a Fabric capacity?"
    a: "Microsoft Learn lists an Azure subscription in the same Entra tenant, permission to create a capacity, the Microsoft.Fabric resource provider registered, a supported region and enough capacity unit quota. An F64 capacity, for example, needs 64 available CUs."
  - q: "Which permissions are needed to create, pause and resume?"
    a: "Learn lists four Azure RBAC actions on the capacity: Microsoft.Fabric/capacities/read, write, suspend/action and resume/action. It recommends a custom role scoped to these instead of the privileged Owner or Contributor roles."
  - q: "Does pausing a capacity stop all charges?"
    a: "Not entirely. Learn says that when you pause, the remaining cumulative overages and smoothed operations are summed and added to your Azure bill. It also says resuming the capacity resumes billing."
  - q: "Can I pause a capacity that is being throttled?"
    a: "Yes. Learn says pausing a throttled capacity stops the throttling and returns it to a healthy state immediately, so it can be used as a self-service way to end throttling. Learn also warns that pausing can make Fabric content unavailable."
  - q: "Who can be the Fabric capacity administrator?"
    a: "Learn says the capacity administrator must belong to the tenant where you provision the capacity, and business-to-business guest users cannot be capacity administrators."
---

A Fabric F SKU is bought in the Azure portal, billed through Azure and can be paused when nobody needs it. This guide covers the purchase steps, how to read the size table, and what pausing does and does not save, based on Microsoft Learn.

## What you need first

Microsoft Learn lists these prerequisites for buying a capacity:

- One of the licenses Microsoft Fabric free or Power BI.
- An Azure subscription associated with the Microsoft Entra tenant where you want the capacity.
- Permission to create a capacity. Learn recommends a custom role scoped to `Microsoft.Fabric/capacities/read`, `write`, `suspend/action` and `resume/action`. The built-in Owner or Contributor roles also work but grant more permission than necessary.
- The `Microsoft.Fabric` resource provider registered in the subscription. Registration is required before the first capacity.
- A supported Azure region for the workloads you plan to use.
- Enough available Fabric capacity unit quota for the SKU in that subscription and region. An F64 needs 64 available CUs. If quota is too low, request an increase first.

## Buy an F SKU in the Azure portal

1. Sign in to the Azure portal.
2. Search for **Microsoft Fabric** and open the service.
3. Select **Create Fabric Capacity**.
4. On the **Basics** tab, set **Subscription**, **Resource group**, **Capacity name**, **Region**, **Size** and **Fabric capacity administrator**.
5. Optionally add tags under **Next: Tags**.
6. Select **Review + create**.

The capacity administrator must belong to the tenant, and B2B guests can't be capacity administrators. If you buy through a Cloud Solution Provider, the partner helps with the subscription and the F SKU, and Learn says you can then assign workspaces, including ones on trial capacities, to the new capacity.

## Read the size table

The Fabric licenses page lists F SKUs by capacity units. The table below is a compute reference, and Learn says it is not a statement of functional or licensing equivalence.

| SKU | Capacity units | Power BI SKU |
| --- | --- | --- |
| F2 | 2 | none listed |
| F4 | 4 | none listed |
| F8 | 8 | EM/A1 |
| F16 | 16 | EM2/A2 |
| F32 | 32 | EM3/A3 |
| F64 | 64 | P1/A4 |
| F128 | 128 | P2/A5 |
| F256 | 256 | P3/A6 |
| F512 | 512 | P4/A7 |

Larger sizes continue up to F8192. The Trial SKU provides 64 CUs, and Learn says Fabric features are available for 60 days on a trial.

One licensing rule affects sizing: for F2 through F32, each user who views Power BI content needs a Pro, Premium Per User or individual trial license. At F64 or larger, users with only a free license and a viewer role can view Power BI content. Azure bills F capacities per second with no commitment, and a yearly reservation is available to save cost.

The Learn pages I read give no sizing formula and no workload-by-workload guidance. My advice: start with a small SKU, watch usage, and scale as the data shows.

## Pause and resume

You can pause only an F SKU capacity, and you need the four RBAC actions above.

**Pause:**

1. Sign in to the Azure portal and open the **Microsoft Fabric** service.
2. Select the capacity.
3. Select **Pause**, then **Yes**.

**Resume:** repeat the steps and select **Resume**, then **Yes**.

### What Learn says about billing and content

- Resuming the capacity also resumes billing.
- When you pause, the remaining cumulative overages and smoothed operations are summed and added to your Azure bill. So a busy capacity can still produce a charge at pause time.
- Pausing can make Fabric content unavailable, so make sure nobody uses the capacity first.
- You can still monitor a paused capacity with the Microsoft Fabric Capacity Metrics app.
- Pausing a throttled capacity ends the throttling immediately.

The page does not say what happens to operations that are running at the moment you pause.

## Schedule pause and resume

Learn says you can use an Azure runbook to schedule pause and resume. Import a module from the module gallery, search the runbook gallery for Fabric, choose the notebook you want and read its description for the scheduling parameters. The page also links Fabric REST APIs to pause (suspend) and resume a capacity, without request details.

## A cost routine (my advice)

1. Buy the smallest SKU that meets the viewer license rule you can live with.
2. Use a custom role with only the four capacity actions for the people who pause and resume.
3. Schedule off-hours pause for dev and test capacities with a runbook, after confirming no scheduled refreshes run in that window.
4. Review the Azure bill for a first pause, to see the overage and smoothing charge Learn describes.

## Related

- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)

## Sources

- [Buy Fabric capacity Azure SKUs (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/buy-capacity)
- [Pause and resume your Fabric capacity (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/pause-resume)
- [Understand Microsoft Fabric licenses and capacity (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/licenses)
