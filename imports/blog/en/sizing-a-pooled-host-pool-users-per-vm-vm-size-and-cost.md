---
title: "Sizing a pooled host pool: users per VM, VM size and cost"
summary: "Size a pooled host pool by choosing a workload type, using Microsoft's maximum users per vCPU as an upper bound, picking a VM size, and dividing your peak concurrent sessions by the sessions per VM. Cost then follows from the number of hosts, their running hours and their size."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-pooled-host-pool, avd-host-pool]
keypoints:
  - "Microsoft Learn gives maximum users per vCPU for multi-session hosts: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. It calls these generic guidelines for initial estimates only."
  - "For multi-session VMs Learn limits the size to 6 to 24 vCPUs, says not to go above 32 cores, and says that for 20 or more users on one VM several smaller VMs would perform better than one or two large ones."
  - "Without autoscale, host count is peak concurrent sessions divided by the sessions per host you set, rounded up; with autoscale, divide by the limit times the capacity threshold. Learn's ceiling is an upper bound for estimating, not a value to set: in our reading the limit should be lower, and the pilot decides how much lower."
  - "Compute is billed while a VM runs or is stopped but still allocated. A deallocated VM is not billed for compute, but its disks and networking still are."
  - "Pilot with real users, including the sign-in peak, and check session counts and host performance in Azure Virtual Desktop Insights before you fix the VM size and the limit."
faq:
  - q: "How many users fit on one session host?"
    a: "Microsoft Learn gives maximums per vCPU: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. An 8-vCPU host with a medium workload gives 32 as a ceiling. Learn describes the figures as generic guidelines for initial estimates, so confirm them in a pilot."
  - q: "Should I use a few large VMs or many small ones?"
    a: "Learn recommends a large number of smaller VMs instead of a few large ones, because smaller VMs are easier to shut down and update. It also says that for 20 or more users on one VM, several smaller VMs would perform better than one or two large VMs."
  - q: "Does Microsoft Learn give a price per user or per VM?"
    a: "Learn's sizing and billing pages explain what is billed, not what it costs: a running or stopped-but-allocated VM is billed for compute, a deallocated VM is not. Rates depend on region, VM size and agreement, and Learn's service limits page points to the Azure pricing calculator for Azure Virtual Desktop pricing."
---

To size a pooled host pool, pick the workload type of your users, take Microsoft's maximum users per vCPU for that type as a ceiling, choose a VM size, and divide your peak concurrent sessions by the sessions each VM can carry. Cost then depends on how many VMs run for how many hours, plus storage.

This guide assumes you know what a [pooled host pool](/entity/avd-pooled-host-pool/) is. It covers the host-count calculation, an example with arithmetic, and the cost levers, and it counts VM-hours instead of currency because rates depend on region, VM size and agreement. The workload tables and the per-host limit are covered in "How to size the maximum session limit per session host", and the threshold in "Choosing the right capacity threshold for pooled host pools". This article adds the step in between: how many hosts, of which size.

## What you are sizing

Three numbers define a pooled pool: the VM size, the number of sessions each VM accepts (the [maximum session limit](/entity/avd-maximum-session-limit/)), and the number of [session hosts](/entity/avd-session-host/) in the [host pool](/entity/avd-host-pool/). Microsoft states the caveat itself: the examples on its [sizing guidelines page](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines) are "generic guidelines" for initial performance estimates, and you should scale the deployment to your users' needs.

Two terms are used here in a fixed way. The ceiling is the arithmetic maximum from Learn's table: users per vCPU times the vCPUs of the VM. The limit is the value you set on the host pool, which in our reading should sit below the ceiling.

## Step 1: choose the workload type and read the ceiling

Learn defines four workload types by example users (light, medium, heavy and power) and lists a maximum number of users per vCPU for multi-session hosts: 6, 4, 2 and 1. The full table, with the minimum VM configuration for each type, is in "How to size the maximum session limit per session host".

These are maximums, not targets. Learn asks you to plan for some headroom for unexpected spikes in user activity, so a host that runs at its ceiling has none left for a busy hour. Learn does not say how to size a pool that serves several user types. Splitting the groups across host pools is our judgment, not a Learn rule.

## Step 2: pick the VM size

The VM-size rules from Learn (6 to 24 vCPUs, not more than 32 cores, 15 to 20 percent virtualization overhead) are listed in "How to size the maximum session limit per session host", together with the scaling factor, the memory example and the sign-in example. Two statements decide the host count here:

- Learn recommends a large number of smaller VMs instead of a few large ones. Its reason is operational: smaller VMs are easier to shut down for updates or when unused, whereas a large VM more often has a user signed in.
- For 20 or more users connected to one VM, Learn says several smaller VMs would perform better than one or two large ones. It also names breadth-first load balancing as a way to spread users evenly across VMs instead of filling one host first.

A ceiling of 32 or more sessions per host is above that 20-user statement. In our reading, that is a reason to pilot, not to take the ceiling at face value.

## Step 3: calculate the host count

Take the peak number of concurrent sessions, not the number of named users. Autoscale counts active and disconnected sessions together, so count both.

Example: 150 users with a heavy workload (2 users per vCPU), all connected at peak. The numbers are arithmetic on the Learn ceiling, not Learn figures.

| Option | vCPUs per host | Ceiling per host (2 x vCPUs) | Hosts for 150 sessions at the ceiling | Total vCPUs |
|---|---|---|---|---|
| 8-vCPU size, such as D8s_v5 | 8 | 16 | 150 / 16 = 9.38, so 10 | 80 |
| 16-vCPU size, such as D16s_v5 | 16 | 32 | 150 / 32 = 4.69, so 5 | 80 |

At the ceiling both options leave only 10 sessions of slack. If one host fails or is drained, ten hosts lose 10 percent of capacity and five hosts lose 20 percent.

Now set a limit below the ceiling. As an assumption, not a Learn value, take three quarters of each ceiling: 12 for the 8-vCPU size and 24 for the 16-vCPU size.

| Option | Limit per host | Hosts for 150 sessions | Total vCPUs | Capacity lost with one host out |
|---|---|---|---|---|
| 8-vCPU size | 12 | 150 / 12 = 12.5, so 13 | 104 | about 8 percent |
| 16-vCPU size | 24 | 150 / 24 = 6.25, so 7 | 112 | about 14 percent |

In our reading, the tables show the trade-off between host count and the capacity one failed or drained host takes away, and what headroom costs in extra hosts. The pilot in step 5 decides the real limit.

## Step 4: check the autoscale prerequisites

If you use autoscale, the [capacity threshold](/entity/avd-capacity-threshold/) decides when it starts another host, and the host count from step 3 is a lower bound. Learn's [scenarios page](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) gives the ramp-down formula Required Hosts = Total Sessions (Active + Disconnected) / (Max Session Limit x Capacity Threshold %), and starts another host when used capacity exceeds the threshold. In our reading, hosts to deploy = sessions / (limit x threshold), rounded up. With the limit of 12 and an assumed 80 percent threshold, 150 / (12 x 0.8) = 15.6, so 16 hosts instead of 13. The threshold is worked through in "Choosing the right capacity threshold for pooled host pools", and the minimum percentage of hosts sets a further floor.

One prerequisite affects sizing directly: for autoscale on pooled pools, Learn's [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan) says you must configure a custom maximum session limit and not keep the default. The [load-balancing page](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) states that a pool created with breadth-first gets a default of 999999, which says nothing about your VM. See [power management autoscaling](/entity/avd-power-management-autoscaling/) and [scaling plans](/entity/avd-scaling-plan/) for the mechanics.

## Step 5: validate in a pilot

Learn's sizing page names two approaches: a pilot, described as more time and cost effective for smaller deployments, and a simulation with generated user load, described as more suitable for larger deployments where capacity affects purchasing decisions. Learn's [load balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) suggests [Azure Virtual Desktop Insights](/entity/avd-insights/) to monitor the sessions on each host and review session host performance when choosing the limit. Check the busiest hour, including the sign-in window.

[Nerdio](/entity/nerdio/) offers a related, rule-based route. Its [right-sizing](/entity/nerdio-right-sizing/) feature for pooled host pools is described in Nerdio's article on right-sizing shared host pools as a premium feature of Nerdio Manager for Enterprise 6.0 and later, found under Advisor, with potential savings shown for each option. The article dates from 21 May 2024, so check current documentation for version details. Nerdio's help page for the rule "Right-size AVD pooled desktops" says it uses processor time and available memory counters, with default triggers of 80 percent to recommend a larger size and 60 percent to recommend a smaller one, a 90th percentile baseline and a 30-day analysis window. Recommendations need at least 72 hours of VM power-on time, which can be non-continuous, and between 24 and 72 hours they appear with a warning.

The rule page requires the host pool type to be "dynamic", Nerdio auto-scale to be turned on, and CPU and RAM data collection to be turned on. Nerdio's [host pool overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124329605517) now calls these auto-scale-enabled host pools, where session hosts are created and removed automatically based on the auto-scale configuration, and says the type was previously called "dynamic".

## Cost: what moves the bill

Learn's [VM states and billing page](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing) states which power states are billed for compute:

- Starting, running and stopping are billed.
- Stopped (allocated) is billed. A shutdown from inside the guest OS leaves the VM in this state.
- Deallocated is not billed for compute. Disks and networking still incur charges.

How autoscale uses this depends on the phase. Per Learn's scenarios page, pooled autoscale turns off only hosts without sessions, and it does not turn hosts off in ramp-up. Per the scaling plan page, in ramp-down autoscale deallocates a host after it signs out the remaining users when forced sign-out is enabled. Without forced sign-out you choose one of two conditions: the host has no active or disconnected sessions, or it has no active sessions. Either way the capacity threshold and the minimum percentage of hosts still apply, and autoscale shuts a host down only if all existing sessions, active and disconnected, fit on fewer hosts without exceeding the threshold.

With dynamic autoscaling a host can be deleted instead of deallocated. Learn's [autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq) says that when autoscale deletes a session host you created manually, it honors your setting for deleting the NIC and disk.

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

Three things set the compute bill: how many hosts run, for how many hours, and the VM size. In outline, monthly compute is VM-hours multiplied by the hourly rate, plus disks, profile storage and licences. Learn's service limits page points to the Azure pricing calculator for the rate.

Illustration with the 13 hosts of 8 vCPUs from step 3: if all 13 run 24 hours, that is 312 VM-hours a day. If 13 run for 8 peak hours and two stay on for the other 16, that is 13 x 8 + 2 x 16 = 136 VM-hours. The two always-on hosts are an assumption, not a Microsoft figure. "What Azure Virtual Desktop really costs: the full cost model" and "15 ways to cut Azure Virtual Desktop cost without hurting users" cover the other line items.

Profile storage is a separate line. Learn's [cost page](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs) lists user profile storage, such as Azure Files or Azure NetApp Files, for FSLogix profile containers as an accompanying cost. The sizing table lists a minimum profile storage of 30 GB per workload type without saying whether that is per user or in total, so it is not multiplied here. See [FSLogix](/entity/fslogix/).

## Common mistakes

- Using the ceiling as the limit, which leaves no margin for a busy hour.
- Counting named users instead of peak concurrent sessions, or ignoring disconnected sessions.
- Sizing for the average and ignoring the sign-in peak.
- Keeping the default limit when autoscale is on.
- Choosing one very large VM because it is simpler to manage.
- Treating guest-OS shutdown as a way to save money.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/session-host-virtual-machine-sizing-guidelines)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: States and billing status of Azure Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing)
- [Microsoft Learn: Azure subscription and service limits, quotas, and constraints (Azure Virtual Desktop section)](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Nerdio: How to right-size shared host pools](https://getnerdio.com/resources/how-to-right-size-shared-host-pools/)
- [Nerdio Manager help: Rules: Right-size AVD pooled desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/26124363575053)
- [Nerdio Manager help: Overview of host pools](https://nmehelp.getnerdio.com/hc/en-us/articles/26124329605517)
