---
title: "Power management autoscaling in Azure Virtual Desktop: what it does and when to use it"
summary: "Power management autoscaling starts and deallocates existing session hosts on a schedule, based on how much of a host pool's session capacity is in use. It fits host pools with a predictable daily pattern, and it does not create or delete VMs."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-power-management-autoscaling, avd-scaling-plan]
keypoints:
  - "Power management autoscaling powers existing session hosts on and off. Dynamic autoscaling also creates and deletes hosts and works only for pooled host pools with a session host configuration. Microsoft announced it as generally available in July 2026, while some Learn pages still carry preview wording."
  - "A scaling plan holds the schedules. Pooled schedules use four phases (ramp-up, peak, ramp-down, off-peak) with a capacity threshold and a minimum percentage of hosts. Personal schedules act on disconnected and signed-out sessions."
  - "Autoscale turns a host on when used capacity exceeds the threshold. It turns a host off when used capacity is below the threshold and removing the host would not push it over the threshold. At exactly the threshold, nothing happens."
  - "The role Desktop Virtualization Power On Off Contributor must be assigned at subscription level. A lower scope can stop autoscale from working properly."
  - "Learn says not to combine autoscale with other Microsoft or third-party scaling tools, and to disable those for the host pools a scaling plan is applied to. Azure Automation and Logic Apps scaling cannot run on the same host pool."
faq:
  - q: "Does power management autoscaling cost extra?"
    a: "Microsoft's autoscale FAQ says no: you are not charged extra for using autoscale, and it points to the Azure Virtual Desktop pricing page for rates. For personal host pools, the FAQ adds that autoscale deallocates a session host that was turned on but never used to sign in, after a period of inactivity, to avoid unnecessary compute costs."
  - q: "Can autoscale turn off every VM in a host pool?"
    a: "Only if the minimum percentage of hosts is set to 0 percent and there are no user sessions on the session hosts. Microsoft's FAQ says a disconnected session counts as a session and recommends a time limit policy that signs out disconnected users."
  - q: "Can I configure autoscale with the Azure CLI or skip specific dates such as holidays?"
    a: "The autoscale FAQ on Microsoft Learn states that autoscale does not offer configuration through Azure CLI and does not support ramping down on specific dates, such as holidays."
---

Power management autoscaling is the Azure Virtual Desktop feature that powers existing session hosts on and off, following a schedule and the share of session capacity that is in use. Use it when a host pool has a recognisable daily rhythm and you want unused VMs deallocated outside working hours. It does not create or delete VMs. That is the job of dynamic autoscaling, a separate scaling method.

## What power management autoscaling does

Microsoft Learn defines autoscale as the native scaling service that scales session hosts up and down based on the capacity of the host pools and the scaling plan schedule you define. There are two scaling methods:

- **Power management autoscaling** powers session hosts on and off to adjust to the available capacity in a host pool. Learn names it as the option for host pools with standard management.
- **Dynamic autoscaling** also creates and deletes session hosts. It can only be used for pooled host pools with a session host configuration. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 ([Tech Community](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. Learn describes power management autoscaling as generally available.

When autoscale shuts down a VM, it deallocates it. Microsoft's FAQ states that using autoscale does not cost extra and refers to the pricing page for rates.

Power management autoscaling is available in Azure and Azure Government, in regions where you can create host pools. Dynamic autoscaling is Azure only and is not supported in Azure Government.

## The building blocks

A [scaling plan](/entity/avd-scaling-plan/) is an Azure Resource Manager object that defines the schedules for scaling session hosts. A few rules from Learn shape the design:

- One plan can be assigned to several host pools, but only to pools of the type set in the plan, pooled or personal.
- Plan configuration data must be stored in the same Azure region as the host pool configuration. The session host VMs themselves can be in other regions.
- The plan runs in its configured time zone. Changes to a plan that is already assigned to host pools apply immediately.
- Pooled host pools need a maximum session limit that you set yourself. Learn says not to use the default value.

You can also set an exclusion tag on the plan, for example `excludeFromScaling`. A VM carrying that tag is not turned on or off and its drain mode is not changed. Excluded hosts still count toward the minimum percentage of hosts, which matters for the example later in this article.

## How a pooled schedule works

A pooled schedule splits the day into four phases. Learn describes them like this:

- **Ramp-up**: users start signing in and sessions rise quickly.
- **Peak**: sessions reach the daily maximum and hold steady.
- **Ramp-down**: users sign out and sessions fall.
- **Off-peak**: few sessions remain, and a small amount of capacity may stay on for late users.

Each phase has a start time. Ramp-up and ramp-down also expose the capacity threshold and the minimum percentage of hosts. Peak carries the capacity threshold over from ramp-up, and off-peak carries it over from ramp-down. Learn recommends the breadth-first load balancing algorithm for ramp-up and depth-first for off-peak. Peak can use either.

Three terms drive every decision:

- **Available host pool capacity** is the maximum session limit multiplied by the number of available session hosts.
- **Used host pool capacity** is the number of active and disconnected sessions divided by the available capacity.
- **Capacity threshold** is the percentage of used capacity that triggers a scaling action.

The **minimum percentage of hosts** is the lowest share of all session hosts that must be on in a phase. It is rounded up: 10 percent of 7 hosts keeps 1 host on.

## The decision rule, with numbers

Autoscale turns a host on when used capacity exceeds the threshold. It turns a host off when used capacity is below the threshold, turning the host off would not exceed the threshold, and the host has no sessions (force logoff in ramp-down is the exception). Per Learn's FAQ, when capacity equals the threshold, autoscale does nothing.

Learn's ramp-up scenario (scenario 1) starts with two available hosts out of six, a maximum session limit of 5 and a threshold of 30 percent. Capacity is 10 sessions. Three sessions give 30 percent, which is not above the threshold, so nothing happens. A fourth session gives 40 percent and autoscale turns on one host (capacity 15, about 27 percent). A fifth session gives 33 percent and another host starts. At 6 sessions nothing happens (30 percent). A seventh session gives 35 percent and a fifth host starts.

Autoscale does not turn hosts off during ramp-up. Learn's peak scenario (scenario 2) has 5 available hosts, a limit of 5 and 7 sessions, which is 28 percent used. Autoscale turns off no host yet, because removing one would leave 7 sessions on 20 sessions of capacity, 35 percent (35 percent by simple division), above the 30 percent threshold. After two users sign out for lunch, 5 sessions remain. Removing one host would give 25 percent, so autoscale selects a host without user sessions, puts it in drain mode and turns it off. For more worked schedules, see the companion articles on the four autoscale phases and on the scaling plan procedure.

## Ramp-down and off-peak

Ramp-down uses session consolidation. Autoscale counts active and disconnected sessions, assumes disconnected users may come back, and keeps enough hosts for all of them. The formula on Learn's glossary page is required hosts = total user sessions ÷ (maximum session limit × capacity threshold), rounded up. The glossary's example: 8 disconnected sessions, a limit of 10 and a threshold of 80 percent need one host.

You choose how the remaining hosts are emptied:

- **Stop VMs when**: select **VMs have no active or disconnected sessions** or **VMs have no active sessions**, and autoscale waits for users to sign out. The FAQ says that with the second option autoscale still treats disconnected sessions as active, because users may reconnect immediately.
- **Force logoff of users**: autoscale picks the host with the fewest sessions, puts it in drain mode, notifies users, signs them out after the wait time you set, and deallocates the VM.

Force logoff applies only in ramp-down. Learn's ramp-down scenario (scenario 3) has 4 available hosts, a limit of 5, 4 sessions (20 percent used), a threshold of 75 percent and a minimum of 10 percent. Applying the glossary formula, 4 ÷ (5 × 0.75) = 1.07, so 2 hosts are required. Learn's text says two hosts can be turned off without exceeding 75 percent, and because every host has the same number of sessions, autoscale chooses two hosts at random, signs out all their users and turns the hosts off. Later in the same scenario, after the users reconnect (4 sessions, 40 percent) and one user signs out (3 sessions, 30 percent), one more host is turned off, chosen as the host with the fewest sessions. When the forced-out user signs back in (3 sessions on one host, 60 percent), autoscale keeps the last host on, because turning it off would drop capacity to 0, below the 10 percent minimum.

In off-peak, the minimum percentage of hosts keeps capacity on. Per the FAQ, autoscale can turn off all VMs only if the minimum percentage of hosts is 0 percent and there are no user sessions on the session hosts, disconnected ones included. Learn points to a time limit policy, set in Intune or Group Policy, that signs out disconnected sessions.

## Personal host pools

A personal schedule has no capacity threshold. Each phase has a start time, an optional Start VM on Connect setting, and actions for sessions that were **disconnected** or **signed out** for 0 to 360 minutes: deallocate, hibernate or do nothing. In ramp-up you choose which VMs to start: assigned only, assigned and unassigned, or none. If autoscale does not start personal desktops, the FAQ says to enable [Start VM on Connect](/entity/avd-start-vm-on-connect/) or start them yourself. Learn says FSLogix and App Attach currently do not support hibernate, so do not enable it for personal host pools that use them.

## Setting it up

The step-by-step procedure is in the article "How to create and assign an AVD scaling plan step by step". Four points decide whether power management autoscaling works:

1. **Role scope.** Assign **Desktop Virtualization Power On Off Contributor** at subscription level. Learn says a lower scope prevents autoscale from working properly.
2. **Session limit and region.** Set a maximum session limit on pooled host pools and keep plan and host pool in the same region.
3. **Weekend.** Off-peak settings of the last selected day carry over to unselected days, so a Monday-to-Friday plan holds Friday's off-peak settings through the weekend.
4. **Diagnostics.** Autoscale logs can go to a storage account or an event hub. For pooled pools Microsoft recommends the autoscale data in [Insights](/entity/avd-insights/).

## When to use it, and when not

Power management autoscaling fits when:

- Working hours are regular and you can name a ramp-up, peak and ramp-down window.
- The host pool uses standard host management, with VMs that already exist.

Consider another approach when:

- You need hosts created and deleted on demand. That is dynamic autoscaling, and it requires a session host configuration.
- Your demand depends on specific dates. The FAQ says autoscale does not currently support ramping down on specific dates.
- You rely on the Azure CLI. The FAQ says autoscale cannot be configured with it.
- You need disaster recovery. The FAQ says customers must set up their own disaster recovery strategy to manage outages: autoscale only handles scaling existing VMs within the region they were created in.
- Another tool already scales the pool. Learn says autoscale cannot be used with Azure Automation and Azure Logic Apps scaling on the same host pool. More generally, the scenarios page says: "Don't use autoscale in combination with other scaling Microsoft or third-party scaling tools. Ensure that you disable those for the host pools you apply the scaling plans to." For a specific third-party product, check that vendor's documentation and keep one scaling mechanism per host pool.

## Common traps

- **Exclusion tags used too widely.** Learn describes a pool of six hosts where five were tagged. At 80 percent used capacity autoscale could not add capacity. After the admin tagged and turned off the last untagged host, the affected user saw "No resources available." Removing the tag from two VMs let autoscale start one host, enough for the 10 percent minimum. (Learn's final table shows a 19 percent minimum, which contradicts its own text and numbers.)
- **Drain mode is overwritten.** Autoscale changes drain mode on pooled hosts. Use the exclusion tag when you update VMs.
- **Load balancing is overridden.** In pooled pools autoscale applies the algorithm from the schedule, not the one set on the host pool.

## Sources

All pages retrieved on 2026-11-17.

- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Set up diagnostics for Autoscale](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
