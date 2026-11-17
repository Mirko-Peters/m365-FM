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
  - "Host count is peak concurrent sessions divided by sessions per host, rounded up. Dividing also by the capacity threshold gives a starting estimate for autoscale. That step is our inference from Learn's ramp-down formula, not a Learn sizing rule."
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

## Step 1: choose the workload type and read the ceiling

Learn defines four workload types by example users: light (basic data entry), medium (consultants, market researchers), heavy (software engineers, content creators) and power (graphic designers, 3D model makers, machine learning researchers). For multi-session hosts it lists a maximum number of users per vCPU:

| Type | Max users per vCPU | Minimum VM configuration from Learn |
|---|---|---|
| Light | 6 | 8 vCPUs, 16 GB RAM, 32 GB OS storage |
| Medium | 4 | 8 vCPUs, 16 GB RAM, 32 GB OS storage |
| Heavy | 2 | 8 vCPUs, 16 GB RAM, 32 GB OS storage |
| Power | 1 | 6 vCPUs, 56 GB RAM, 340 GB OS storage |

These are maximums, not targets. Running a host at its ceiling leaves no margin for a busy hour. If one pool serves users of several types, the numbers do not average well, and splitting them across host pools is easier to size.

## Step 2: pick the VM size

Learn gives these reasons and rules for multi-session VMs:

- Limit the size to between 6 and 24 vCPUs. Later on the same page Learn calls 4 to 24 cores the recommended range, and says at least four cores are needed for a stable multi-session VM, so, in our reading, 6 is the working floor and 4 the stability minimum.
- A VM should not have more than 32 cores. Synchronization overhead grows with core count, and at around 16 cores the return diminishes. Learn says user experience is better with two 16-core VMs than with one 32-core VM.
- Doubling the cores does not double the capacity. Learn gives a scaling factor of 1.5 to 1.9 for a doubling.
- Running on virtual machines can cost 15 to 20 percent of capacity compared with bare metal, based on Microsoft's internal testing.
- Prefer a large number of smaller VMs. Learn's reason is operational: it is easier to shut down VMs that need updates or are unused, and with larger VMs there is more often at least one user signed in, which prevents shutdown.
- For 20 or more users on one VM, several smaller VMs would perform better than one or two large ones.

Sign-in peaks matter as much as the average. Learn says user logon is a CPU-intensive operation, and its example is 30 or more users signing in within 10 minutes on a 16-core host, where two 8-core VMs would handle the load better.

## Step 3: calculate the host count

Take the peak number of concurrent sessions, not the number of named users. Autoscale counts active and disconnected sessions together, and a disconnected session still occupies the host, so count both.

Example: 200 users with a medium workload, all connected at peak. This is arithmetic on the Learn ceiling, not a Learn figure.

| Option | vCPUs per host | Ceiling per host (4 x vCPUs) | Hosts for 200 sessions | Total vCPUs |
|---|---|---|---|---|
| 8-vCPU size, such as D8s_v5 | 8 | 32 | 200 / 32 = 6.25, so 7 | 56 |
| 16-vCPU size, such as D16s_v5 | 16 | 64 | 200 / 64 = 3.13, so 4 | 64 |

If one host fails or is drained, seven hosts lose about 14 percent of capacity and four hosts lose 25 percent. Seven hosts also leave 24 sessions of slack against the ceiling (7 x 32 = 224), and four hosts leave 56 (4 x 64 = 256). Neither option is a recommendation. In our reading, the table shows the trade-off between the number of hosts and the share of capacity that one failed or drained host takes away.

## Step 4: add headroom for autoscale

If you use autoscale, the [capacity threshold](/entity/avd-capacity-threshold/) decides when it starts another host. Learn's [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan) gives the rule with an example: two hosts with a limit of 20 give a capacity of 40 sessions, and with a threshold of 75 percent a third host starts once there are more than 30 sessions.

Learn's [scenarios page](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) states a formula for consolidation in ramp-down:

Required hosts = total sessions (active + disconnected) / (max session limit x capacity threshold)

Using it for peak sizing is our inference, not a Learn statement. For the example with a limit of 32 and a threshold of 75 percent, which is a calculation example and not a Learn recommendation: 200 / (32 x 0.75) = 8.33, so 9 hosts. That is two more 8-vCPU hosts than the plain ceiling calculation, and it keeps used capacity under the threshold. The real count can differ, because autoscale does not turn hosts off in ramp-up and the minimum percentage of hosts sets a floor. For how to pick the percentage, see "Choosing the right capacity threshold for pooled host pools" and the explainer "Capacity threshold in AVD autoscale: how the percentage decides when another host starts".

Two prerequisites: for autoscale on pooled pools Learn says you must configure a custom maximum session limit and not keep the default. The load-balancing page states that a pool created with breadth-first gets a default of 999999, which says nothing about your VM. See [power management autoscaling](/entity/avd-power-management-autoscaling/) and [scaling plans](/entity/avd-scaling-plan/) for the mechanics.

## Step 5: validate in a pilot

Learn's sizing page names two approaches: a pilot, which it describes as more time and cost effective for smaller deployments, and a simulation with generated user load, which it describes as more suitable for larger deployments where capacity affects purchasing decisions. For a pilot, Learn's [load balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) suggests [Azure Virtual Desktop Insights](/entity/avd-insights/) to monitor the sessions on each host and review session host performance when choosing the limit. Record CPU and memory at the busiest hour, include the morning sign-in window, then adjust the VM size or the limit.

[Nerdio](/entity/nerdio/) offers a related, rule-based route. Its [right-sizing](/entity/nerdio-right-sizing/) feature for pooled host pools is described in Nerdio's article on right-sizing shared host pools as a premium feature of Nerdio Manager for Enterprise 6.0 and later, found under Advisor, with potential savings shown for each option. The article was published on 21 May 2024, so check the current documentation before relying on version details. Nerdio's help page for the rule "Right-size AVD pooled desktops" says it uses two counters, processor time and available memory, with default triggers of 80 percent to recommend a larger size and 60 percent to recommend a smaller one, a 90th percentile baseline and a 30-day analysis window. Recommendations need at least 72 hours of VM power-on time, which can be non-continuous. Between 24 and 72 hours they appear with a warning. Prerequisites listed there are a dynamic host pool, autoscale on, and CPU and RAM collection enabled. "Right-sizing host pools with Nerdio Advisor: a worked example" walks through it. 

## Cost: what moves the bill

Learn's [VM states and billing page](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing) states which power states are billed for compute:

- Starting, running and stopping are billed.
- Stopped (allocated) is billed. A shutdown from inside the guest OS leaves the VM in this state.
- Deallocated is not billed for compute. Disks and networking still incur charges.

How autoscale uses this depends on the phase. Per Learn's scenarios page, pooled autoscale turns off only hosts without sessions, and it does not turn hosts off in ramp-up. Per the scaling plan page, in ramp-down autoscale deallocates a host after it signs out the remaining users when forced sign-out is enabled, and otherwise once no active sessions remain. With dynamic autoscaling a host can also be deleted, which removes its disk charges as well. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

Three things set the compute bill: how many hosts run, for how many hours, and the VM size. Learn's sizing page says conserving resources makes a deployment "less expensive", which is the argument for smaller VMs that can be switched off.

Illustration with the nine-host result: if all nine run 24 hours, that is 216 VM-hours a day. If nine run for 8 peak hours and two stay on for the other 16, that is 9 x 8 + 2 x 16 = 104 VM-hours. Multiply by your own hourly rate. This is arithmetic, not a saving that Microsoft promises: the two always-on hosts are an assumption, and Learn says autoscale only shuts down hosts when sessions can be consolidated without exceeding the capacity threshold. "What Azure Virtual Desktop really costs: the full cost model" and "15 ways to cut Azure Virtual Desktop cost without hurting users" cover the other line items.

Profile storage is a separate line. If the 30 GB minimum profile storage from Learn's table applies to each user, 200 users need at least 6,000 GB for profile containers. See [FSLogix](/entity/fslogix/) for where those live.

Reservations lower the price but do not reserve physical capacity, according to Microsoft's multiregion article, so they do not guarantee that a deallocated host can start.

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
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: States and billing status of Azure Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing)
- [Microsoft Learn: Azure subscription and service limits, quotas, and constraints (Azure Virtual Desktop section)](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Microsoft Learn: Multiregion business continuity and disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Nerdio: How to right-size shared host pools](https://getnerdio.com/resources/how-to-right-size-shared-host-pools/)
- [Nerdio Manager help: Rules: Right-size AVD pooled desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/26124363575053)
