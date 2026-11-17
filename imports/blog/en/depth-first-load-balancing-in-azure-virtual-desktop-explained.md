---
title: "Depth-first load balancing in Azure Virtual Desktop explained"
summary: "Depth-first load balancing sends each new session to the available session host that already has the most sessions, until that host reaches its maximum session limit. This article explains the selection rule step by step, what the required limit does, and where the algorithm stops being the whole story."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-depth-first-load-balancing, avd-host-pool]
keypoints:
  - "Depth-first queries session hosts that allow new connections and have not reached their maximum session limit, then selects the one with the most sessions. On a tie it takes the first host from the query."
  - "A maximum session limit is required. When every host has reached it, you must raise the limit or add session hosts."
  - "A user with an active or disconnected session is routed back to that host even if drain mode is on. A user without a session is never routed to a host in drain mode."
  - "A host at its limit still shows as Available in the portal if it passes its health checks, so the status does not tell you whether it can take new sessions."
  - "Under high concurrent sign-in load, the number of sessions on a host can exceed the maximum session limit, according to Learn's terminology page."
faq:
  - q: "What happens when all session hosts reach the maximum session limit?"
    a: "New users cannot be placed. Microsoft Learn says that in this case you must either increase the maximum session limit or add session hosts to the host pool."
  - q: "Does depth-first turn session hosts off by itself?"
    a: "No. Load balancing only decides which host receives a new session. Learn describes autoscale as the feature that turns VMs on and off in pooled host pools, based on capacity thresholds and schedules. Depth-first leaves some hosts with few or no sessions, which makes them easier to scale down."
  - q: "Can I use depth-first on a personal host pool?"
    a: "No. Learn says load balancing does not apply to personal host pools, because each user has a 1:1 mapping to a session host. Personal pools use automatic or direct assignment."
---

Depth-first load balancing sends each new user session to the session host that already has the most sessions, as long as that host has not reached its maximum session limit. When a host is full, the next one starts to fill. The rule is deterministic, and it is the reason a pooled host pool can end up with some hosts full and others empty.

This article explains the algorithm for a pooled [host pool](/entity/avd-host-pool/). For a side-by-side decision against breadth-first, see the article "Breadth-first vs depth-first: which load balancing algorithm should a host pool use". Sources are listed at the end and were retrieved on 17 November 2026.

## What depth-first does

Microsoft Learn's [load-balancing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing) describes [depth-first](/entity/avd-depth-first-load-balancing/) as aiming to saturate one session host at a time. Learn calls it ideal for cost-conscious organizations that want more granular control over the number of session hosts available in a host pool, because it lets them scale down the number of powered-on hosts more easily when there are fewer users. In practice, starting sessions stay on one host until its maximum session limit is reached, then move to the next.

The algorithm applies only to pooled host pools, where several users share a host and a returning user may land on a different host. In a personal pool, Learn says, the user always maps 1:1 to a host and load balancing does not apply.

## The selection rule, step by step

When a user with no existing session in the pool connects, the load balancer does the following, per Learn:

1. It queries the session hosts that allow new connections and have not reached their maximum session limit.
2. It selects the host with the most sessions among them.
3. If several hosts tie, it selects the first host from the query.

Two consequences follow from the wording.

- **Hosts at the limit are skipped.** A host that has reached its limit is not in the candidate list.
- **Hosts not accepting connections are skipped.** Learn's status table lists *Shutdown* and *Unavailable* hosts as not available for load balancing, and a host in [drain mode](/entity/avd-drain-mode/) is not considered for a user without a session.

### A worked example

The numbers here are an illustration built from the rule, not a Learn example. Take three hosts, H1 to H3, with a maximum session limit of 5, all accepting connections and all empty.

| Event | H1 | H2 | H3 | Why |
|---|---|---|---|---|
| Start | 0 | 0 | 0 | |
| User 1 | 1 | 0 | 0 | Three-way tie, first host in the query wins |
| Users 2 to 5 | 5 | 0 | 0 | H1 always has the most sessions below the limit |
| User 6 | 5 | 1 | 0 | H1 is at the limit and skipped, H2 and H3 tie |
| Two users leave H1 | 3 | 1 | 0 | |
| User 7 | 4 | 1 | 0 | H1 has the most sessions and is below the limit again |

The last row matters. Gaps on the fuller hosts are refilled before emptier hosts receive anyone, which is why sessions keep concentrating on the early hosts.

## What the maximum session limit does

Learn calls the maximum session limit required for depth-first. It is the trigger for moving on to the next host, so without it the algorithm would have no stopping point. Learn's guidance on choosing it is short: use [Azure Virtual Desktop Insights](/entity/avd-insights/) to monitor sessions per host and review host performance. For breadth-first the default limit is 999999, which is also the highest allowed value. A Learn note says that with depth-first you should change the limit to a number that suits your requirements, to keep the user experience good.

The limit is the same value that feeds [autoscale](/entity/avd-scaling-plan/) capacity. Learn's autoscale glossary defines available host pool capacity as the host pool's maximum session limit multiplied by the number of available session hosts. The scaling plan article tells you not to use the default value on a pooled host pool with autoscale.

### Starting points for the value

Learn's [sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs) list maximum users per vCPU for multi-session hosts: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. At the light level, an 8-vCPU host supports about 48 users. Learn calls these estimates generic and recommends validating them with a pilot or simulation. The step-by-step calculation is in "How to size the maximum session limit per session host".

Pick the limit with the knowledge that depth-first deliberately runs the first hosts at it. That is the point of the algorithm, so the limit has to be a load you are willing to put on a host for a whole working day, not only a theoretical maximum.

## Behaviors that surprise administrators

**A full host still looks healthy.** Learn's status table says a session host that has reached its maximum session limit but passed health checks is still listed as *Available*. Do not use the status to judge whether a host is full; use session counts.

**Health status decides eligibility.** Learn's status table says new sessions are load balanced to hosts with the status *Available*, *Needs Assistance* (a non-fatal health check failed, so the user experience may degrade), *Upgrading* and *Upgrade Failed*. A host that is *Shutdown* or *Unavailable* is not used. Putting the status table and the selection rule together (an inference, not a Learn statement), the fullest host stays first in line even when it is in *Needs Assistance*, so check that status before you accept the packing as healthy.

**Returning users bypass the rule.** If a user already has an active or disconnected session in the pool and signs in again, the load balancer sends them to that host. This holds even if drain mode is enabled on it. Disconnected sessions therefore keep a host in play for their owners until they are signed out.

**Lowering the limit does not end sessions.** Learn says lowering the limit on a host with active sessions does not affect those sessions. A host can sit above its new limit until users sign out.

**The limit can be exceeded.** The terminology page says that under high concurrent connection load, when multiple users connect to the host pool at the same time, the number of sessions created on a session host can exceed the maximum session limit. Separately, the same page describes a pending user session as a placeholder that reserves a spot for a user while sign-in completes, which can take anywhere from 30 seconds to five minutes depending on the user profile. With depth-first, the host being filled is also the one that takes a burst of sign-ins (an inference from the selection rule).

**The pool can fill up completely.** Learn flags this as important: when all hosts reach the limit, you must raise it or add hosts.

## Where depth-first fits in a design

Depth-first only decides placement. The cost effect depends on something switching idle hosts off. Learn describes autoscale for pooled pools as turning VMs on and off based on the capacity thresholds and schedules you define, and its FAQ suggests depth-first in ramp-down and off-peak so that autoscale can consolidate sessions to the minimum number of hosts. Learn's autoscale scenarios page says that for pooled host pools autoscale ignores the load-balancing algorithm in the host pool settings and applies the one from the schedule. That interaction has its own article, "Depth-first load balancing and autoscale: how the schedule overrides the host pool setting". This article covers power management autoscaling, which the scenarios page labels generally available.

Learn's sizing page adds a caution about host size. For 20 or more users per VM, several smaller VMs perform better than one or two large ones. Many smaller VMs are also easier to patch and to shut down when idle, which suits depth-first.

## Setting depth-first in the portal

You need the Desktop Virtualization Host Pool Contributor role on a pooled host pool.

1. Open **Azure Virtual Desktop** in the Azure portal and select **Host pools**.
2. Select the host pool, then **Properties**.
3. Set **Load balancing algorithm** to depth-first and enter a value in **Max session limit**.
4. Select **Save**.

Learn says you can configure one algorithm at a time and change it at any time. Learn also has Azure PowerShell and Azure CLI tabs for this setting, which are not reproduced here.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Configure host pool load balancing in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop session host statuses and health checks](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-statuses-checks)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
