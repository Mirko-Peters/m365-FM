---
title: "Azure Virtual Desktop scaling plans explained: schedules, phases and host pools"
summary: "An Azure Virtual Desktop scaling plan is an Azure resource that holds schedules, and each schedule splits the day into four phases: ramp-up, peak, ramp-down and off-peak. The plan is assigned to host pools of one type, and autoscale then starts, consolidates and stops session hosts according to the phase settings."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-scaling-plan, azure-virtual-desktop]
keypoints:
  - "A scaling plan is an Azure Resource Manager object. It can be assigned to several host pools, but only to pools of the same type, and the type cannot be changed after creation."
  - "Every schedule has four phases. In a pooled schedule each phase has its own start time and load balancing algorithm, and capacity threshold and minimum percentage of hosts are set in ramp-up and ramp-down."
  - "Autoscale turns hosts on when used capacity exceeds the capacity threshold, and it consolidates sessions in ramp-down. Force sign-out applies only in ramp-down."
  - "Learn says the Desktop Virtualization Power On Off Contributor role should be assigned with the subscription as scope. A lower scope can stop autoscale from working properly."
  - "Hosts that carry the exclusion tag are not started, stopped or put into drain mode by autoscale, but they still count toward the minimum percentage calculation."
faq:
  - q: "How many phases does a scaling plan schedule have?"
    a: "Four: ramp-up, peak, ramp-down and off-peak. Microsoft Learn describes them as the start of the workday, the period with the most active sessions, the end of the workday, and the period with the fewest active sessions."
  - q: "Can one scaling plan cover pooled and personal host pools?"
    a: "No. Microsoft Learn says a scaling plan can be assigned only to host pools of the type set in the plan, pooled or personal, and the type cannot be changed after the plan is created."
  - q: "Does autoscale respect the load balancing algorithm I set on the host pool?"
    a: "For pooled host pools, Microsoft Learn says autoscale ignores the configured algorithm and applies the algorithm set for the phase in the schedule. Learn suggests breadth-first for ramp-up and peak and depth-first for ramp-down and off-peak."
---

An Azure Virtual Desktop scaling plan is an Azure resource that contains one or more schedules. Each schedule divides the day into four phases, and autoscale uses the settings of the current phase to decide when to turn session hosts on, consolidate sessions and turn hosts off. This article explains the objects, the four phases, the settings of each phase and the points that decide whether a plan behaves as expected. It follows [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary); sources are listed at the end.

## The objects: scaling plan, schedule, host pool

A **scaling plan** is an Azure Resource Manager object that defines the schedules for scaling the session hosts of a host pool. A **schedule** is a sub-resource of the plan. For a pooled host pool, a schedule specifies the start time, capacity threshold, minimum percentage of hosts, load balancing algorithm and other settings for each phase of the day. For a personal host pool, it specifies the start time and the operation to perform depending on the session state, signed out or disconnected.

One plan can be assigned to several host pools, but each host pool can have only one scaling plan. Learn adds two limits: the host pools must be of the same type as the plan, and the type cannot be changed after creation. A mixed fleet therefore needs one plan per pool type. The plan runs in the time zone you select on the Basics tab of the creation wizard. The scaling plan configuration data must sit in the same Azure region as the host pool configuration. The session host VMs can be in any supported region.

Learn also names two scaling methods for pooled pools. **Power management autoscaling** powers VMs on and off and works with standard session host management. **Dynamic autoscaling** can also create and delete session hosts, and it applies only to pooled host pools that use session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 ([Tech Community](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. The create-and-assign page lists the `Az.DesktopVirtualization` PowerShell module version 5.4.2-preview or later for dynamic autoscaling, and the scenarios page says it is not available in Azure Government. Power management autoscaling is generally available. This article concentrates on power management. See the entity pages for [power management autoscaling](/entity/avd-power-management-autoscaling/) and [dynamic autoscaling](/entity/avd-dynamic-autoscaling/).

## The four phases

Learn defines the phases as follows:

- **Ramp-up**: usually the start of the workday. Active sessions increase quickly but have not reached the day's maximum.
- **Peak**: the host pool reaches its maximum number of active sessions. The count holds steady and new sessions are still established, usually more slowly than in ramp-up.
- **Ramp-down**: usually the end of the workday. Active sessions decrease quickly.
- **Off-peak**: the pool usually reaches its minimum number of active sessions. Few users are active, and a small amount of capacity may stay on for people who work after the peak.

In the portal each phase is configured by its start time. Learn adds that on days you do not select for a schedule, the last off-peak settings carry over until the next ramp-up. See also [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/).

## Settings per phase for a pooled host pool

In the Azure portal the Schedules tab for a pooled plan asks for these values:

| Phase | Settings |
|---|---|
| Ramp-up | Start time, load balancing algorithm, minimum percentage of hosts, capacity threshold |
| Peak | Start time, load balancing algorithm. The capacity threshold carries over from ramp-up |
| Ramp-down | Start time, load balancing algorithm, minimum percentage of hosts, capacity threshold, force logoff of users |
| Off-peak | Start time, load balancing algorithm. The capacity threshold carries over from ramp-down |

**Capacity threshold.** [Available capacity](/entity/avd-capacity-threshold/) is the [maximum session limit](/entity/avd-maximum-session-limit/) multiplied by the number of available session hosts. Used capacity is the number of active and disconnected sessions divided by that figure. If used capacity exceeds the threshold, autoscale turns on hosts until usage falls below it. For example, two hosts with a maximum session limit of 20 give a capacity of 40. At a 75 percent threshold, more than 30 sessions trigger a third host.

**Minimum percentage of hosts.** This is the lowest percentage of all session hosts in the pool that must be turned on in a phase. The result is rounded up to a whole number. In the scenarios page's first example, 30 percent of six hosts is not a whole number, and autoscale rounds up to two hosts. See [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/).

**Load balancing algorithm.** For pooled pools autoscale ignores the algorithm configured on the host pool and applies the algorithm from the schedule. The FAQ suggests [breadth-first](/entity/avd-breadth-first-load-balancing/) for ramp-up and peak, and [depth-first](/entity/avd-depth-first-load-balancing/) for ramp-down and off-peak, so that sessions spread out early in the day and consolidate later.

## What autoscale does in each phase

The scenarios page describes the behavior for pooled pools:

- **Ramp-up**: autoscale turns on hosts to meet the minimum percentage of hosts and whenever used capacity is above the threshold. It does not turn hosts off in this phase, to avoid a poor user experience.
- **Peak**: autoscale turns hosts on and off as needed to keep use stable. It turns a host off when used capacity is below the threshold, turning it off would not exceed the threshold, and the host has no user sessions. At exactly the threshold, autoscale does nothing (FAQ).
- **Ramp-down**: autoscale consolidates sessions and deallocates excess hosts. Before it turns a host off, it puts the host into [drain mode](/entity/avd-drain-mode/). It selects the host with the fewest sessions.
- **Off-peak**: autoscale keeps the minimum percentage of hosts running, even if they have no users. With 0 percent and no sessions, no host needs to stay on (FAQ).

For consolidation Learn gives this formula: required hosts equal total sessions (active plus disconnected) divided by the product of the maximum session limit and the capacity threshold, rounded up. With eight disconnected sessions, a maximum session limit of 10 and a threshold of 80 percent, the result is 8 / (10 × 0.8) = 1 host.

### Force sign-out and wait time

[Force sign-out](/entity/avd-force-logoff/) is a setting of the ramp-down phase of a schedule and applies only there. Autoscale drains the host with the fewest sessions, notifies users, waits for the configured time, and then ends the remaining sessions and deallocates the host. Without it, you choose between "VMs have no active or disconnected sessions" and "VMs have no active sessions", and autoscale waits for users to sign out. Learn's FAQ adds that disconnected sessions still count for capacity, and that reaching zero running hosts after hours requires a minimum percentage of 0 percent and no sessions at all. It suggests the Group Policy setting "Set time limit for disconnected sessions" for that. Learn's FAQ gives only example wait times, 15 and 20 minutes, and states no default. The ramp-down details have their own article in this series, "Ramp-up, peak, ramp-down and off-peak: the four AVD autoscale phases explained".

## Personal host pools

A personal schedule works differently. The ramp-up phase offers a choice of which VMs to start: assigned VMs only, assigned and unassigned VMs, or no VMs at the start time. Learn highly recommends [Start VM on Connect](/entity/avd-start-vm-on-connect/) if you do not start hosts in ramp-up. Each phase has a disconnect setting and a sign-out setting. They take a number of minutes from 0 to 360 and an action: deallocate the VM, hibernate the personal desktop, or do nothing. The FAQ adds that autoscale cannot force users to sign out of a personal desktop, and that if hibernate is chosen but not enabled on the VM, autoscale neither hibernates nor deallocates it.

Hibernation needs to be enabled on the session hosts. Learn states that FSLogix and App Attach do not support hibernate, so do not enable it where either is used on personal host pools. See [AVD hibernation](/entity/avd-hibernation/).

## Create and assign a plan

The full portal procedure has its own article, "How to create and assign an AVD scaling plan step by step". In short: set a **MaxSessionLimit** on every pooled host pool instead of keeping the default, and assign the **Desktop Virtualization Power On Off Contributor** role to the Azure Virtual Desktop service principal or a managed identity with the subscription as scope. Then, in the Azure portal, search for Azure Virtual Desktop, select **Scaling Plans**, then **Create**, and work through the Basics (including the exclusion tag, for example `excludeFromScaling`), Schedules and Host pool assignments tabs. Changes to an assigned plan apply immediately.

## Exclusion tags and drain mode

A VM with the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) is not turned on, turned off or changed in drain mode by autoscale, in any phase. Tagged hosts still count toward the minimum percentage calculation. Learn warns that if every available host is excluded and none can be turned on, new users get a "No resources available" error. The Learn FAQ and the scenarios page both state that for pooled host pools autoscale overrides drain mode on the VMs it scales, whoever set it, so use the tag when you patch or test a host.

## Checks after assignment

- Confirm the role assignment scope. The create-and-assign page says a scope lower than the subscription prevents autoscale from working properly; the troubleshooting page is less strict and lists host pool, resource group or subscription scope, so follow the create-and-assign page.
- Do not combine autoscale with other scaling scripts. Learn says you cannot use autoscale together with scaling based on Azure Automation and Logic Apps on the same host pool.
- A host pool needs at least one VM for autoscale to work, and autoscale cannot be set up with the Azure CLI, according to the FAQ. It also cannot ramp down on specific dates such as holidays.
- Autoscale does not track availability zones, so it may not scale evenly across zones.
- Turn on diagnostics: on the scaling plan, open **Diagnostic Settings**, add a setting, select **Autoscale logs**, and archive to a storage account in the same region as the plan or stream to an event hub. The records include `operationName`, `resultType` and `correlationId`. For pooled pools Learn recommends the autoscale data in Azure Virtual Desktop Insights for a fuller view.

## Related

- [AVD scaling plan](/entity/avd-scaling-plan/)
- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [AVD host pool](/entity/avd-host-pool/)
- [Pooled host pool](/entity/avd-pooled-host-pool/)
- [Personal host pool](/entity/avd-personal-host-pool/)

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan (create-assign page)](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Set up diagnostics for Autoscale](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Troubleshoot autoscale issues in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
