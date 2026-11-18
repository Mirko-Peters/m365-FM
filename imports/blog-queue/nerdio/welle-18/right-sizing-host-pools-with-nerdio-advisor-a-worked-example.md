---
title: "Right-sizing host pools with Nerdio Advisor: a worked example"
summary: "A worked example for a pooled Azure Virtual Desktop host pool: set up the Nerdio Advisor right-sizing rule, compare CPU and memory with the 60% and 80% triggers, check sizes and apply on a schedule. Figures are invented."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-advisor, nerdio-manager-for-enterprise]
keypoints:
  - "The pooled rule needs a dynamic pool with auto-scale and CPU and RAM collection. It compares 30 days of utilisation with 60% (decrease) and 80% (increase); we read the 90th percentile as compared."
  - "Example: D16s_v5 hosts at 31% CPU and 44% RAM. D8s_v5 would push RAM to about 88%, above 80%. A memory-preserving 8 vCPU size keeps RAM near 44%, CPU near 62%."
  - "Check every candidate size against both triggers before applying it, because a size that fixes one resource can create a new recommendation on the other."
  - "Apply from Observability > Advisor > Recommendations with a schedule outside working hours and an optional message to active users. After a resize, Nerdio excludes data from before the change."
  - "Nerdio recommends 1 to 4 weeks of assessment data before accepting changes; below 72 hours of power-on time the result is not reliable."
faq:
  - q: "How long must a host pool run before the rule gives a usable recommendation?"
    a: "Nerdio's help recommends at least 72 hours of power-on time, which does not have to be continuous. Between 24 and 72 hours a recommendation appears with a warning, and below 24 hours the recommended sizes are hidden. The Rules overview advises collecting 1 to 4 weeks of data before you accept changes."
  - q: "Why did Advisor suggest a size that I think is wrong?"
    a: "The rule only sees CPU and memory counters over the last 30 days, summarised as 90th-percentile indicators by default; that the triggers are compared with those indicators is our reading. It also rejects sizes for exhausted quota, missing benchmarks, unknown prices, GPU mismatches or missing features. Nerdio Manager cannot calculate figures using Reserved Instances or Savings Plans, according to Nerdio. Hide the recommendation for 7 days or permanently, adjust the triggers or the allowed VM sizes, or pick another of the three candidates."
  - q: "Can I limit which VM sizes the rule may recommend?"
    a: "Yes. The rule has an Allowed VM sizes setting; when it is set, only those sizes are considered. A Respect quota setting restricts recommendations to sizes for which enough quota exists."
---

To right-size a pooled host pool with Nerdio Advisor, you create a right-sizing rule for the pool, let it collect enough usage data, compare the recommended size with both the CPU and memory triggers, and apply the change on a schedule. This article walks through that sequence for one invented pool, so that you can see where the arithmetic decides between candidates.

The background on what [Nerdio Advisor](https://www.m365.fm/entity/nerdio-advisor/) is and how it relates to Azure Advisor is in the explainer article "Nerdio Advisor: modelling and optimising AVD cost". Here we assume you have [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) and a pooled [host pool](https://www.m365.fm/entity/avd-host-pool/) in production.

## The example pool

The environment is made up, and its utilisation numbers are not measurements. What is sourced are the rule defaults, the formula, the menu paths and the VM sizes.

- A pooled host pool called Sales-Pool in West Europe, 6 session hosts of Standard_D16s_v5. Learn lists that size at 16 vCPU and 64 GiB.
- Roughly 180 users doing office work, and a medium workload type in Microsoft's sizing guidelines.
- Auto-scale is on, and Nerdio Manager collects CPU and RAM data.

## Step 1: check the prerequisites

The pooled right-sizing rule needs three things, per Nerdio's help:

1. The host pool type is "dynamic".
2. Auto-scale is turned on for the pool.
3. CPU and RAM data collection is enabled, either in the auto-scale options or in the host pool's AVD Properties. The counters are Processor Information/% Processor Time and Memory/Available MBytes.

Sales-Pool has one VM size; with mixed sizes the rule uses the most-used one. The personal-desktop rule reads from a Log Analytics workspace instead.

On editions, Nerdio's sources are not consistent. The entitlement and billing page lists "Advisor Recommendations for AVD" among Premium-only features, while the pricing page ticks "Nerdio Advisor and TCO analysis" for both Windows Cloud Premium and Core, and a May 2024 article calls pooled right-sizing a premium feature without naming an edition. Confirm with Nerdio what your licence includes.

## Step 2: where the Modeler fits

The Modeler under **Observability > Advisor > Models** answers a different question, namely what a new pool would cost, from user numbers, work hours and a workload type. You can clone a model and change the VM size to compare two estimates. In the Review step, the Modeler page describes **Compare with existing Host Pool** when User Cost Attribution is enabled, which sets model costs against an existing pool. The entitlements page lists User Cost Attribution among the Premium functions, so check your edition. Nerdio says the Modeler only generates estimates, so use it to compare options, not to predict an invoice.

## Step 3: create the rule

1. Go to **Observability > Advisor > Rules** and select **New rule**. Set the status to Enabled or Disabled.
2. Enter a name and description, select the host pool or pools in scope, and select the analyzer **Right-sizing (AVD pooled)**.
3. Review the settings. The defaults are a CPU decrease trigger of 60%, a CPU increase trigger of 80%, and the same two values for RAM. The **Active session only** setting (listed as Active Sessions Only in the rule settings section) shows Enabled as its default. Nerdio's page describes it in two ways. The create-rule text says the rule then applies only to VMs that have active user sessions. The percentile section says recommendations by default use any-session values, and adds that below 72 hours of active period the any-session values are always used. Check the flag in your rule and read the usage report to see which percentile it shows.
4. Optionally set **Allowed VM sizes** and **Respect quota**, then select **OK** to save the rule.

Without Allowed VM sizes, the rule evaluates all sizes in the same region and subscription, except A-series and B-series.

## Step 4: wait for enough data

The rule analyses the last 30 days and wants at least 72 hours of power-on time for a reliable result; below 24 hours Nerdio by default hides the recommended sizes. The Rules overview recommends 1 to 4 weeks of data, and "VM right-sizing in Nerdio: reading the utilisation recommendations" covers the thresholds in detail. For Sales-Pool, assume three weeks have passed.

## Step 5: read the numbers

Nerdio's rule dialog describes the four triggers as thresholds for average CPU or RAM utilisation, while the data sections describe 90th-percentile indicators and a baseline percentile of 90 by default. The page does not say in words which value the triggers are compared with. Our reading: the 90th-percentile indicator is the compared value, and "usage" in the scale-factor formula means the same figure. Suppose the recommendation shows these 90th-percentile values (invented for the example; we do not say whether they are any-session or active-session values):

| Resource | 90th percentile | Decrease trigger | Increase trigger | Result |
|---|---|---|---|---|
| CPU | 31% | 60% | 80% | Below decrease trigger |
| RAM | 44% | 60% | 80% | Below decrease trigger |

Both resources sit under 60%, so on our reading the rule proposes a smaller size. Nerdio's help gives the scale factor for a decrease as usage divided by the increase trigger, limited to 0.3 to 3.0. Taking usage to be the 90th-percentile value, that gives 31 / 80 = 0.39 for CPU and 44 / 80 = 0.55 for RAM. Our reading of that formula: a candidate needs about 39% of the current CPU capacity and about 55% of the current memory to run at the 80% trigger, so the memory figure sets the floor.

## Step 6: test each candidate against both triggers

The rule evaluates every allowed size in the region, drops those it rejects (quota, benchmarks, prices, GPU or features) and stores the first three. The page says a CPU increase or decrease is sorted by price ascending, while optimal RAM and a RAM increase use a combined coverage score. It does not say which sorting applies when both resources are below their decrease triggers, so we cannot say how candidates would be ranked or which three your tenant will show; judge whatever it lists with the same check. The projection assumes the same sessions per host and linear scaling, a simplification; Nerdio compares benchmarks.

| Candidate | vCPU | Memory | Projected CPU | Projected RAM | Verdict |
|---|---|---|---|---|---|
| D16s_v5 (current) | 16 | 64 GiB | 31% | 44% | Over-provisioned |
| D8s_v5 | 8 | 32 GiB | about 62% | about 88% | RAM above the 80% trigger |
| E8s_v5 | 8 | 64 GB | about 62% | about 44% | CPU just above the 60% trigger, RAM below it |
| D4s_v5 | 4 | 16 GiB | about 124% | about 176% | Too small |

Sizes are from the Learn Dsv5 and Esv5 pages; Learn labels memory GiB on one page and GB on the other. The projections are our arithmetic (current utilisation multiplied by the ratio of current to candidate capacity).

The comparison shows why the check matters. The plain halving, D8s_v5, a size you might pick yourself rather than one the rule necessarily offers, would put memory at about 88%, so the rule could soon recommend an increase again. The memory-optimised E8s_v5 keeps memory where it is and takes CPU to about 62%. It does not settle the matter either: RAM at about 44% stays below the 60% decrease trigger and CPU is only two points above it, so after the next 72 hours of data the rule may again suggest a smaller size. How it weighs a low RAM figure against a CPU figure just above its trigger is not documented. If the rule asks again, you can hide the recommendation for 7 days or permanently, adjust the decrease triggers, or limit Allowed VM sizes. Treating 60% to 80% as the target band is our reading; for a decrease, the scale-factor formula itself aims at the 80% trigger.

Learn's sizing guidance lists 8 vCPU and 16 GB as the minimum configuration for light, medium and heavy workloads, and the 8 vCPU candidates meet it. The example does not claim E8s_v5 is cheaper; the recommendation page shows the cost effect.

## Step 7: check what else changes

Before applying, look at two settings that were chosen for the old size. First, the maximum session limit per host: Learn's medium-workload ceiling is 4 users per vCPU, so an 8 vCPU host has a lower ceiling (32) than a 16 vCPU host (64). If the limit was set for the larger size, revisit it. With all 180 users signed in, 6 hosts carry 30 each; on 8 vCPU hosts that is 3.75 users per vCPU, close to the medium ceiling, so more hosts may be needed. Second, the Nerdio auto-scale settings. Nerdio's page on changing machine size names the Session limit per host in Host Pool Properties; Base host pool capacity, Min active host capacity and Burst beyond base capacity in Host Pool Sizing; and Hosts to be active by start of work hours under Pre-stage Hosts. Its example moves from D4as_v5 to D8as_v5, a larger size, at the same density of 1 user per CPU, and says a smaller size follows the same steps. It changes four of these settings (session limit 4 to 8, base capacity 30 to 15, burst 8 to 4, pre-staged hosts 15 to 8) and leaves Min active host capacity at 2. See [maximum session limits](https://www.m365.fm/entity/avd-maximum-session-limit/) and [Nerdio auto-scaling](https://www.m365.fm/entity/nerdio-auto-scaling/).

## Step 8: apply on a schedule

Go to **Observability > Advisor > Recommendations**, filter by rule, status or scope, open the action menu and select **Apply**. Choose **Run now** or **Schedule** (pick a window outside working hours), and turn on **Messaging** with a delay in minutes and a message for active users. "Acting on right-sizing recommendations safely" covers the dialog in detail.

The Recommendations help does not describe how a change rolls across several hosts of a pooled pool, so on a first run use a pilot pool or watch the first schedule closely.

## Step 9: verify after the change

Nerdio excludes data from before a resize, so the analysis window is shorter afterwards. Allow another 72 hours of power-on time and check the numbers again. Suppose you applied E8s_v5: our arithmetic points to CPU around 62% and RAM around 44%. If CPU is clearly above 80% at the 90th percentile, the pool is now undersized and an increase recommendation is likely. If RAM or both resources stay below 60%, another smaller-size recommendation is possible; decide as described in Step 6.

## Limits to keep in mind

- The rule's inputs are the CPU and memory counters. Disk, network and sign-in time are not among them.
- Nerdio's cost-data page says Nerdio Manager cannot calculate figures using Microsoft Reserved Instances or Savings Plans. Check your commitments before changing size family.
- A 30-day window can miss a rare peak. If the pool has a seasonal peak outside it, wait until the peak falls inside the window or keep a margin. Hide a recommendation when you know something the rule does not, such as a planned user increase.

## Sources

- [Nerdio help center (Enterprise): Rules: Right-size AVD pooled desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/48236074482957-Rules-Right-size-AVD-pooled-desktops)
- [Nerdio help center (Enterprise): Rules: Right-size AVD personal desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376589965-Rules-Right-size-AVD-personal-desktops)
- [Nerdio help center (Enterprise): Rules overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124386088973--Rules-overview)
- [Nerdio help center (Enterprise): Auto-scale: Adjusting Machine Size/Density Considerations](https://nmehelp.getnerdio.com/hc/en-us/articles/30352409540109-Auto-scale-Adjusting-Machine-Size-Density-Considerations)
- [Nerdio help center (Enterprise): Recommendations dashboard](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376554381-Recommendations-dashboard)
- [Nerdio help center (Enterprise): Modeler overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356019981)
- [Nerdio help center (Enterprise): Where does NME show me Azure cost data?](https://nmehelp.getnerdio.com/hc/en-us/articles/48618389927565-Where-does-NME-show-me-Azure-cost-data)
- [Nerdio help center (Enterprise): NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio: Nerdio Manager for Enterprise pricing and feature matrix](https://getnerdio.com/pricing/enterprise/)
- [Nerdio: How to right-size shared host pools](https://getnerdio.com/blog/how-to-right-size-shared-host-pools/)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Dsv5 size series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dsv5-series)
- [Microsoft Learn: Esv5 size series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/memory-optimized/esv5-series)
