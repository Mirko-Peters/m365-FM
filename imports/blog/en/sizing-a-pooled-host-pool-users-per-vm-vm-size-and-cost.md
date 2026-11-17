---
title: "Sizing a pooled host pool: users per VM, VM size and cost"
summary: "Size a pooled host pool by choosing a workload type, taking Microsoft's maximum users per vCPU as an upper bound, picking a VM size, and dividing your peak concurrent sessions by the sessions per VM. Cost then follows from VM size and running hours, which autoscale and deallocation control."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-pooled-host-pool, avd-host-pool]
keypoints:
  - "Microsoft Learn gives maximum users per vCPU for multi-session hosts: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. It calls these generic guidelines for initial estimates only."
  - "For multi-session VMs Learn recommends 6 to 24 vCPUs, never more than 32 cores, and several smaller VMs instead of one or two large ones once 20 or more users share a VM."
  - "Host count is peak concurrent sessions divided by sessions per host, rounded up. Autoscale's capacity threshold then adds headroom: required hosts = sessions / (max session limit x capacity threshold)."
  - "Compute is billed while a VM runs or is stopped but still allocated. A deallocated VM is not billed for compute, but its disks and networking still are."
  - "Pilot with real users and check session counts and host performance in Azure Virtual Desktop Insights before you fix the VM size and the limit."
faq:
  - q: "How many users fit on one session host?"
    a: "Microsoft Learn gives maximums per vCPU: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. An 8-vCPU host with a medium workload gives 32 as a ceiling. Learn describes the figures as generic guidelines for initial estimates, so confirm them in a pilot."
  - q: "Should I use a few large VMs or many small ones?"
    a: "Learn recommends a large number of smaller VMs instead of a few large ones, and says that for 20 or more users on one VM, several smaller VMs would perform better than one or two large VMs. It also limits multi-session VM size to 6 to 24 vCPUs."
  - q: "Does Microsoft Learn give a price per user or per VM?"
    a: "The sizing and billing pages used here give no prices. They explain what is billed: a running or stopped-but-allocated VM is billed for compute, a deallocated VM is not. Use the Azure pricing calculator with your own region and VM size for figures."
---

To size a pooled host pool, pick the workload type of your users, take Microsoft's maximum users per vCPU for that type as a ceiling, choose a VM size, and divide your peak concurrent sessions by the sessions each VM can carry. Cost then depends on how many VMs run for how many hours, plus storage.

This guide assumes you already know what a [pooled host pool](/entity/avd-pooled-host-pool/) is. It covers the calculation, an example with arithmetic, and the cost levers. It gives no prices, because the sources used here contain none.

## What you are sizing

Three numbers define a pooled pool: the VM size, the number of sessions each VM accepts (the [maximum session limit](/entity/avd-maximum-session-limit/)), and the number of [session hosts](/entity/avd-session-host/) in the [host pool](/entity/avd-host-pool/). The sibling article "How to size the maximum session limit per session host" covers the limit in detail. This article covers the step before it, which VM and how many.

Microsoft states the caveat itself: the examples on its sizing page are "generic guidelines" for initial performance estimates, and you should scale the deployment to your users' needs. Treat every figure below as a starting hypothesis.

## Step 1: choose the workload type

Learn's [sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs) define four types by example users and applications:

| Type | Example users | Example apps |
|---|---|---|
| Light | Basic data entry | Database entry apps, command-line interfaces |
| Medium | Consultants, market researchers | Light apps plus Microsoft Word, static web pages |
| Heavy | Software engineers, content creators | Medium plus Outlook, PowerPoint, dynamic web pages, software development |
| Power | Graphic designers, 3D model makers, machine learning researchers | Heavy plus photo and video editing, CAD and CAM |

If one pool has users of several types, the numbers below do not average well. Splitting them across host pools is easier to size.

## Step 2: read the multi-session ceiling

For multi-session hosts Learn lists a maximum number of users per vCPU:

| Type | Max users per vCPU | Minimum per host | Example Azure VM sizes from Learn |
|---|---|---|---|
| Light | 6 | 8 vCPUs, 16 GB RAM, 32 GB OS storage | D8s_v5, D8s_v4, F8s_v2, D8as_v4, D16s_v5, D16s_v4, F16s_v2, D16as_v4 |
| Medium | 4 | 8 vCPUs, 16 GB RAM, 32 GB OS storage | same list |
| Heavy | 2 | 8 vCPUs, 16 GB RAM, 32 GB OS storage | same list |
| Power | 1 | 6 vCPUs, 56 GB RAM, 340 GB OS storage | D16ds_v5, D16s_v4, D16as_v4, NV6, NV16as_v4 |

Learn lists a minimum of 30 GB of profile storage for every type.

These are maximums, not targets. Running a host at its ceiling leaves no margin for a busy hour.

## Step 3: pick the VM size

Learn gives these rules for multi-session VMs:

- Limit the size to between 6 and 24 vCPUs.
- Four cores is the lowest recommended count for a stable multi-session VM.
- A VM should not have more than 32 cores.
- Prefer a large number of smaller VMs over a few large ones. For 20 or more users on one VM, several smaller VMs would perform better than one or two large VMs.

Fewer, larger hosts reduce the number of objects to patch and monitor. More, smaller hosts reduce what a single host failure or a drain for maintenance takes away. Learn's wording favors the second approach, and the next step shows the difference in numbers.

## Step 4: calculate the host count

Take the peak number of concurrent sessions, not the number of named users. Autoscale counts active and disconnected sessions together, and a disconnected session still occupies the host, so count both.

Example: 200 users with a medium workload, all connected at peak. This is arithmetic on the Learn ceiling, not a Learn figure.

| Option | vCPUs per host | Ceiling per host (4 x vCPUs) | Hosts for 200 sessions | Total vCPUs |
|---|---|---|---|---|
| 8-vCPU size, such as D8s_v5 | 8 | 32 | 200 / 32 = 6.25, so 7 | 56 |
| 16-vCPU size, such as D16s_v5 | 16 | 64 | 200 / 64 = 3.13, so 4 | 64 |

If one host fails or is drained, seven hosts lose about 14 percent of capacity and four hosts lose 25 percent. Seven hosts also leave 24 sessions of slack against the ceiling (7 x 32 = 224), and four hosts leave 56 (4 x 64 = 256). Neither is a recommendation. It shows why the choice is a trade-off between management effort and blast radius.

## Step 5: add headroom with the capacity threshold

If you use autoscale, the [capacity threshold](/entity/avd-capacity-threshold/) decides when it starts another host: when used host pool capacity goes above the threshold. Learn's [scenarios page](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios) gives this formula for ramp-down:

Required hosts = total sessions (active + disconnected) / (max session limit x capacity threshold)

Applied to the example with a limit of 32 and a threshold of 75 percent: 200 / (32 x 0.75) = 8.33, so 9 hosts. The threshold therefore asks for two more 8-vCPU hosts than the plain ceiling calculation. Pick the threshold to match how quickly new hosts start relative to how fast users sign in. Learn's page does not recommend a value; its examples use 30 and 75 percent.

Two prerequisites from Learn's [scaling plan article](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan): for autoscale on pooled pools you must configure a custom maximum session limit and not keep the default. The default for a pool created with breadth-first is 999999, which says nothing about your VM. See [power management autoscaling](/entity/avd-power-management-autoscaling/) and [scaling plans](/entity/avd-scaling-plan/) for the mechanics.

## Step 6: validate in a pilot

Run a pilot with real users on the chosen size. Learn's [load balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) suggests using [Azure Virtual Desktop Insights](/entity/avd-insights/) to monitor the number of sessions on each host and to review session host performance when choosing the limit. Record CPU and memory at the busiest hour, then adjust the VM size or the limit.

Nerdio documents a similar workflow in its article on right-sizing shared host pools. Its [right-sizing](/entity/nerdio-right-sizing/) feature for pooled pools collects CPU, RAM, disk, round-trip time and FSLogix data, needs at least 72 hours of data to generate pooled recommendations, and shows potential savings per size option. The article describes it as a premium feature of Nerdio Manager for Enterprise 6.0 and later, found under Advisor. It was published on 21 May 2024 and shows a later modification date, so check the current [Nerdio](/entity/nerdio/) documentation before relying on version details. The article gives no CPU or memory trigger values. Insights and the Nerdio feature are alternatives for the same task, and a pilot with Insights alone is enough for a small pool.

## Cost: what moves the bill

Learn's [VM states and billing page](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing) states which power states are billed for compute:

- Running, starting and stopping are billed.
- Stopped (allocated) is billed. A shutdown from inside the guest OS leaves the VM in this state.
- Deallocated is not billed for compute. Disks and networking still incur charges.

Autoscale deallocates hosts in ramp-down and off-peak, as described on the scaling plan page. The levers, in order of effect, are the number of hosts running at peak, how many hours they run, and the VM size.

Illustration with the nine-host result: if all nine run 24 hours, that is 216 VM-hours a day. If nine run for 8 peak hours and two stay on for the other 16, that is 9 x 8 + 2 x 16 = 104 VM-hours. Multiply by your own hourly price. This is arithmetic, not a saving that Microsoft promises: the two always-on hosts here are an assumption, and Learn says autoscale only shuts down hosts when sessions can be consolidated without exceeding the capacity threshold.

Profile storage is a separate line. If the 30 GB minimum from Learn's table applies to each user, 200 users need at least 6,000 GB for profile containers. See [FSLogix](/entity/fslogix/) for where those live.

Reservations lower the price but do not reserve physical capacity, according to Microsoft's multiregion article, so they do not guarantee that a deallocated host can start.

## Common mistakes

- Using the ceiling as the limit, which leaves no margin for a busy hour.
- Counting named users instead of peak concurrent sessions, or ignoring disconnected sessions.
- Keeping the default limit when autoscale is on.
- Choosing one very large VM because it is simpler to manage.
- Treating guest-OS shutdown as a way to save money.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: States and billing status of Azure Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing)
- [Microsoft Learn: Multiregion business continuity and disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Nerdio: How to right-size shared host pools](https://getnerdio.com/resources/how-to-right-size-shared-host-pools/)
