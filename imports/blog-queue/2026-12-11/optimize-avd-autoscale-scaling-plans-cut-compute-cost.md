---
title: "Azure Virtual Desktop Autoscale Scaling Plans: Cut Compute Cost Without Capacity Dips"
summary: "How to tune AVD autoscale for pooled host pools: capacity threshold, minimum percentage of hosts, ramp-down and force sign-out, exclusion tags, roles and diagnostics. Based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [azure-virtual-desktop, azure-autoscale, avd-host-pool]
keypoints:
  - "Cost and capacity are balanced by two levers: minimum percentage of hosts (a floor, rounded up) and capacity threshold (a ceiling for used capacity)."
  - "Autoscale starts a host only when used capacity is strictly above the threshold. It turns a host off only if usage stays at or below the threshold afterwards."
  - "Assign Desktop Virtualization Power On Off Contributor at subscription scope. Lower scopes stop autoscale from working properly."
  - "Hosts with the exclusion tag are never started or stopped but still count toward the minimum percentage. Tagging too many hosts can cause 'No resources available'."
  - "Turn on Autoscale logs in the scaling plan's Diagnostic Settings to see why an operation did not complete."
faq:
  - q: "What do the capacity threshold and minimum percentage of hosts do?"
    a: "Microsoft Learn describes the capacity threshold as the ceiling for used host pool capacity and the minimum percentage of hosts as a floor on running hosts. Fractions of the minimum are rounded up, so 30 percent of 6 hosts means 2 hosts. A high threshold in ramp-down reduces the need to start hosts late in the day."
  - q: "Why did autoscale not shut down an idle host during peak hours?"
    a: "Learn explains that autoscale only turns off a host if remaining capacity keeps usage at or below the threshold, and during phases without consolidation it only turns off hosts with zero sessions. Ramp-up never scales down, to avoid a poor user experience."
  - q: "Which role does autoscale need?"
    a: "For power management autoscale, Learn names Desktop Virtualization Power On Off Contributor, assigned to the Azure Virtual Desktop service principal or a managed identity at subscription scope. Assigning at resource group, host pool or VM scope prevents autoscale from working properly."
  - q: "Can I use autoscale together with Azure Automation or Logic Apps scaling?"
    a: "No. Microsoft Learn states that autoscale and the Azure Automation or Logic Apps scaling solution cannot be used on the same host pool. Dynamic autoscaling also cannot be combined with any other scaling script on the same host pool."
  - q: "Where do I find autoscale logs?"
    a: "Open the scaling plan, select Diagnostic Settings, add a setting, choose Autoscale logs and send them to a storage account or an event hub. The Learn page lists CorrelationID, OperationName, ResultType and Message as fields, and it does not list Log Analytics as a destination."
---

Autoscale saves money by switching off idle session hosts, and it protects users with two settings: the **minimum percentage of hosts** and the **capacity threshold**. Tune those, set phase times to match real usage, and keep the permissions and exclusion tags clean. This guide follows Microsoft Learn for pooled host pools and notes what the pages do not document.

## How a scaling plan works

A scaling plan defines schedules for one or more host pools of the same type. Each host pool can have only one plan. The plan is time zone specific and takes effect as soon as it is enabled. A schedule has four phases:

- **Ramp-up**: usage picks up, hosts start.
- **Peak**: highest usage.
- **Ramp-down**: usage tapers off and hosts are typically shut down to save cost.
- **Off-peak**: lowest usage.

Autoscale overrides drain mode and the load balancing algorithm of a pooled host pool, so do not manage those by hand.

## The two levers

Available capacity is available session hosts times the maximum session limit. Used capacity is user sessions divided by that number.

- **Capacity threshold** is the ceiling. Autoscale turns a host on only when used capacity exceeds the threshold, and turns one off only if the result stays at or below it.
- **Minimum percentage of hosts** is the floor. Fractions round up.

Microsoft's example: ramp-up with a 30 percent threshold, a 30 percent minimum, 6 hosts and 5 sessions per host starts two hosts. Three sessions on 10 capacity is exactly 30 percent, so nothing starts. A fourth session makes it 40 percent, so a third host starts and capacity rises to 15.

For ramp-down, Learn gives the consolidation formula: required hosts equal total sessions (active plus disconnected) divided by max session limit times the capacity threshold. With 4 sessions, 5 sessions per host and a 75 percent threshold, that is about 1.07, rounded up to 2 hosts.

## Steps to set up a plan

1. In the Azure portal, search for **Azure Virtual Desktop** and select **Scaling Plans** > **Create**.
2. On **Basics**, set subscription, resource group, name, location, **Time zone** and **Host pool type** (**Pooled**). Choose **Power management autoscaling** as the scaling method.
3. Optionally set an **Exclusion tag**, for example `excludeFromScaling`.
4. On **Schedules**, add a schedule with the days it repeats on and configure the four phases.
5. On **Host pool assignments**, select the host pools. Changes to an assigned plan apply immediately.
6. Select **Review + create**.

Prerequisites from Learn: the scaling plan must be in the same region as the host pool configuration, a pooled host pool needs a non-default **MaxSessionLimit**, and Az.DesktopVirtualization 4.2.0 or later is needed for PowerShell.

## Phase settings that protect capacity

| Phase | Settings Learn lists | Practical note |
|---|---|---|
| Ramp-up | Start time, load balancing, minimum percentage, capacity threshold | Breadth-first is recommended. Start early enough that hosts are ready. |
| Peak | Start time, load balancing | Threshold carries over from ramp-up. |
| Ramp-down | Start time, load balancing, minimum percentage, capacity threshold, force sign-out | A higher threshold lets the pool shrink without restarting hosts later. |
| Off-peak | Start time, load balancing | Depth-first is recommended. Threshold carries over from ramp-down. |

Unselected days inherit the last off-peak settings until the next ramp-up. A Monday to Friday schedule therefore keeps Friday's off-peak settings through the weekend.

## Force sign-out in ramp-down

With **Force logoff of users** on, autoscale puts the host with the fewest sessions into drain mode, notifies users, signs them out after the wait time and deallocates the VM. Learn lists forced sign-outs as a shortage risk, because displaced users reconnect and push usage up. Without it, autoscale waits for users to sign out and then deallocates empty hosts.

To reduce used capacity from stale sessions, the **Time limit policy** signs out disconnected users after a set time. In Intune, use a **Session Time Limits** profile and enable **Set time limit for disconnected sessions**, then restart the session hosts.

## Exclusion tags and the minimum

Tagged hosts are never started, stopped or changed in drain mode, but they still count toward the minimum percentage. Learn's example has five of six hosts tagged. One untagged host reached 80 percent usage and autoscale could not start another. If the last untagged host is turned off, new users get a "No resources available" error. Keep tagging short and temporary, for example during VM updates.

## Permissions

Assign **Desktop Virtualization Power On Off Contributor** to the Azure Virtual Desktop service principal at subscription scope. Lower scopes prevent autoscale from working properly. You need permission to write role assignments, included in User Access Administrator and Owner.

## Diagnose problems

Open the scaling plan, select **Diagnostic Settings** > **Add diagnostic setting**, choose **Autoscale logs** and send them to a storage account (same region as the plan) or an event hub. In the storage account, logs sit in the `insight-logs-autoscaling` container as JSON. Look for records where `ResultType` is not `Succeeded` and read `Message`. Give the `CorrelationID` to support. For pooled host pools Learn recommends the Insights article on monitoring autoscale operations.

## What the pages do not say

Learn gives no savings figure and no default values per phase. Size the minimum percentage and threshold from your own session data, change one at a time and compare user complaints with host hours.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Azure autoscale](https://www.m365.fm/entity/azure-autoscale/)
- [AVD host pool](https://www.m365.fm/entity/avd-host-pool/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Create an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scaling-plan)
- [Enable diagnostics for scaling plans](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
