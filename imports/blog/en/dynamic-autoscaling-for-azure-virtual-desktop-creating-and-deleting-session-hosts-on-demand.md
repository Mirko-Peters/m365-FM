---
title: "Dynamic autoscaling for Azure Virtual Desktop: creating and deleting session hosts on demand"
summary: "Dynamic autoscaling starts existing session hosts while the number needed stays within the minimum host pool size, and creates additional ones once more are needed, up to the maximum. This article covers when it creates, when it only starts and when it deletes, and where Microsoft Learn stays silent."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-dynamic-autoscaling, avd-scaling-plan]
keypoints:
  - "When the number of hosts needed is not larger than the minimum host pool size, autoscale only turns hosts on. When it is larger, autoscale turns on stopped hosts and creates additional ones, up to the maximum host pool size."
  - "Two settings steer the mix: the same minimum and maximum host pool size means only start and deallocate, and a minimum percentage of active hosts of 100 means only create and delete."
  - "If the host count exceeds the phase's maximum, which can happen when the maximum differs per phase, autoscale deletes active deallocated hosts without sessions and then continues to delete or deallocate by schedule and capacity threshold, except in the ramp-up phase."
  - "New hosts get the latest valid and stable image version of the default session host configuration, if you do not already have an active session host configuration."
  - "Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, in July 2026. Some Learn pages still carry preview wording; check the current page before relying on a limit."
faq:
  - q: "When does autoscale create a host instead of just starting one?"
    a: "The autoscale FAQ ties it to the minimum host pool size. If the number of hosts needed is not larger than the minimum, autoscale turns on session hosts when used capacity exceeds the capacity threshold. If it is larger, autoscale turns on stopped hosts and creates additional ones. Active hosts do not exceed the maximum host pool size."
  - q: "How do I make dynamic autoscaling only start and deallocate, or only create and delete?"
    a: "For start and deallocate only, set the same value for minimum and maximum host pool size, or choose power management autoscaling. For create and delete only, set the minimum percentage of active hosts to 100."
  - q: "Can I still create and delete session hosts manually?"
    a: "The FAQ says yes. When autoscale deletes a host that you created manually, it honors your settings for whether to delete the network interface and the disk automatically."
---

Dynamic autoscaling for [Azure Virtual Desktop](/entity/azure-virtual-desktop/) decides between three actions. Per the autoscale FAQ, it only turns hosts on while the number of hosts needed is not larger than the minimum host pool size, turns on stopped hosts and creates additional ones when more are needed, and deletes hosts when the pool exceeds the maximum. Per the scaling plan page, its final scale-in action during ramp-down is to deallocate or delete the VM. It works only for pooled host pools with a session host configuration, and Microsoft announced its general availability in July 2026, although some Learn pages still carry preview wording.

This article is about that decision. The status details, requirements and network rules are in the article "Requirements and limits of dynamic autoscaling in Azure Virtual Desktop", the phases in "Ramp-up, peak, ramp-down and off-peak: the four AVD autoscale phases explained", and the contrast with the older method in "Power management autoscaling vs dynamic autoscaling: which one fits your host pools".

## What the method adds

Learn defines [dynamic autoscaling](/entity/avd-dynamic-autoscaling/) as a method that "powers on and off session hosts and creates and deletes session hosts to adjust to the available capacity in a host pool". [Power management autoscaling](/entity/avd-power-management-autoscaling/) only powers hosts on and off. Learn says the consolidation logic is identical for both methods, and its forced sign-out text is parallel; the final scale-in action is "deallocates or deletes the VM" instead of only deallocating it.

Status in one line: Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## When autoscale starts, creates or deletes

The FAQ section "Dynamic scaling" answers this directly. You set the minimum host pool size, the maximum host pool size and the minimum percentage of active hosts for the ramp-up and ramp-down phases; Learn says the ramp-up values are carried over to the peak phase. You do not choose between turning on and creating. Autoscale decides:

| Situation | What autoscale does |
|---|---|
| Hosts needed are not larger than the minimum host pool size | Turns on session hosts if used capacity exceeds the capacity threshold |
| Hosts needed are larger than the minimum host pool size | Turns on the stopped hosts and creates additional ones |
| More hosts would be needed than the maximum host pool size allows | Does not start or create more hosts than the maximum |
| Host count is above the current phase's maximum | Deletes active deallocated hosts that have no sessions, then continues by schedule and capacity threshold, except in ramp-up |
| Scale-in during ramp-down with forced sign-out | Signs users out after the wait time, then deallocates or deletes the VM |

Three more rules from the FAQ and the scaling plan page:

- **New hosts.** Autoscale creates hosts with the latest valid and stable image version defined in the default session host configuration, if you do not already have an active session host configuration. The FAQ words this condition in that way, and the page does not explain what an "active" session host configuration is in this context.
- **Minimum overrides.** The minimum host pool size overrides the number of session hosts you defined in the host pool. The scaling plan page describes it as the number of hosts that are always part of the pool, running or stopped.
- **Maximum per phase.** The maximum can differ between phases, and the FAQ says a pool can exceed the maximum if it is configured differently in each phase. Autoscale then deletes active deallocated hosts without sessions to honor the current phase's maximum, and afterwards continues to delete or deallocate by schedule and capacity threshold, except in the ramp-up phase. The FAQ adds that this matches power management autoscaling, where pooled hosts are not deallocated in ramp-up.

## Illustration under an assumption

This example is an illustration, not a Learn scenario. The glossary defines the formula required hosts = total sessions / (maximum session limit x capacity threshold), rounded up, for session consolidation in ramp-down and off-peak. Learn does not say that the FAQ's "number of session hosts needed" is calculated the same way in other phases, so the numbers below rest on that assumption.

Setup: maximum session limit 5, capacity threshold 80%, minimum host pool size 4, maximum host pool size 10. One host handles 5 x 0.8 = 4 sessions before the threshold is reached.

- 14 sessions: 14 / 4 = 3.5, rounded up to 4. This is not larger than the minimum of 4, so autoscale starts stopped hosts and does not create any.
- 22 sessions: 22 / 4 = 5.5, rounded up to 6. This is larger than the minimum, so autoscale turns on the stopped hosts and creates additional ones.
- 50 sessions: 50 / 4 = 12.5, rounded up to 13. Per the FAQ, autoscale does not run more than the 10 active hosts you set as maximum, even while used capacity stays above the threshold. Learn does not say what users experience when more hosts would be needed than the maximum allows.

## Steering the mix

Two levers come from the FAQ:

1. **Only start and deallocate.** Choose power management autoscaling when you create the plan, or use dynamic autoscaling and set the same value for minimum and maximum host pool size.
2. **Only create and delete.** Set the minimum percentage of active hosts to 100 in each phase. Autoscale then creates or deletes hosts only if used capacity exceeds or drops below the capacity threshold. The ephemeral OS disks page recommends this for hosts that cannot be deallocated, and says each phase of the scaling plan should carry the 100 percent value.

Learn names the host that is picked on forced sign-out (the one with the fewest sessions) but does not say what decides whether that host is deleted or only deallocated. The final action is only described as "deallocates or deletes". Test with a small pool before you rely on a particular outcome.

## Scale-in and the exclusion tag

During ramp-down with **Force logoff users** enabled, autoscale picks the host with the fewest sessions, active and disconnected, puts it in [drain mode](/entity/avd-drain-mode/), notifies users, signs them out after the wait time and then deallocates or deletes the VM. [Forced sign-out](/entity/avd-force-logoff/) only works in ramp-down. Without it, you choose between the conditions **VMs have no active or disconnected sessions** and **VMs have no active sessions**. Learn adds that autoscale only shuts down or deletes hosts if all existing sessions, active and disconnected, can be consolidated onto fewer hosts without exceeding the capacity threshold, and the minimum percentage of hosts is still respected. Learn says the consolidation calculation and the forced sign-out behavior are identical for both methods and shows one example, scenario 3 on the scenarios page, that applies to both; the article on forced sign-out in this series works through it with numbers.

The [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) is described in two ways. The scaling plan page says that if you add the tag to a session host, autoscale "doesn't start, stop, or change the drain mode" of that host, and the scenarios page says autoscale "won't turn it on, off, or change its drain mode setting". The glossary words it more broadly: the tag is a name you apply to VMs "that you want to exclude from scaling actions", and autoscale "only performs scaling actions on VMs without tag names that match the exclusion tag". Tagged hosts still count toward the minimum percentage of hosts. None of the three pages says explicitly whether autoscale can delete a tagged host. The glossary wording may mean that deletion is excluded as well, but that is not stated, so test it on a small pool before you rely on it.

## Manual hosts, ephemeral disks and managed identity

- **Manual hosts.** The FAQ says you can still create and delete session hosts manually. For a host you created manually that autoscale later deletes, your NIC and disk deletion settings are honored. Learn's management approaches page adds that, with a session host configuration, you cannot create, update or scale hosts outside the service using tools designed for standard management. The same page names the supported way to add hosts to such a pool: increase the host pool size in the Azure portal, an ARM template or PowerShell, and the service then creates the hosts. It also says you cannot retrieve a registration token to add hosts created outside Azure Virtual Desktop. Read together with the FAQ, "manual" most plausibly means increasing the host pool size yourself; that reading is an assumption, so test it on a small pool.
- **Ephemeral OS disks.** These hosts can be restarted, reimaged or deleted but not deallocated, and are supported only in pooled host pools with a session host configuration. Ephemeral OS disks are part of the July 2026 general availability announcement, and the June 2026 What's new entry says they are "now available". As of the Learn page, which still carries preview wording, there is no support for NVMe and premium SSD, only Standard SSD, and no Azure Government. Those limits may be out of date, so check the page. See [ephemeral OS disks](/entity/avd-ephemeral-os-disks/).
- **Managed identity.** Learn gives two different statements on when a [managed identity](/entity/avd-managed-identity/) becomes mandatory for host pools with a session host configuration: an estimated progression ending 15 November 2025 (What's new, September 2025) and "in a future service update" (What's new, September 2026, in the same entry that announces general availability of managed identity support for host pools; the configuration page uses the same wording). The requirements article lists both with their wording; check the current state before you rely on either.

## Where creation is documented

What's new (June 2025) says session host creation retries automatically after transient errors and that Log Analytics for the host pool includes session host creation activity. Hosts that autoscale creates need access to `wvdhpustgr0prod.blob.core.windows.net` to deploy the agent, according to the scaling plan page. The requirements article lists the other roles, scope and network rules.

## Monitoring and open points

Autoscale evaluations for pooled host pools are written to the `WVDAutoscaleEvaluationPooled` table. If a result is Failed, join to `WVDErrors` on `CorrelationId` for details. The monitoring page has four example queries: a sample of rows, failed evaluations joined to `WVDErrors`, a count of start, deallocate and force sign-out attempts, and the maximum occupancy and active host count. None of them counts creations or deletions, and the failed-evaluations query does not filter by action type. The diagnostics page shows a single example log entry, `HostPoolLoadBalancerTypeUpdated`. Neither the monitoring page nor the diagnostics page says where creation or deletion failures appear or how long creating a host takes.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Configure managed identity in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-managed-identity)
- [Microsoft Learn: What's new in Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Ephemeral OS disks on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks)
- [Microsoft Learn: Autoscale monitoring and operations insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Autoscale diagnostics](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
