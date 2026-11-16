---
title: "Power management autoscaling in Azure Virtual Desktop: what it does and when to use it"
summary: "Power management autoscaling starts and deallocates existing session hosts on a schedule, based on how much of a host pool's session capacity is in use. It fits host pools with a predictable daily pattern, and it does not create or delete VMs."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [avd-power-management-autoscaling, avd-scaling-plan]
keypoints:
  - "Power management autoscaling powers existing session hosts on and off. Dynamic autoscaling also creates and deletes hosts, works only for pooled host pools with a session host configuration, and is not labelled generally available on Learn."
  - "A scaling plan holds the schedules. Pooled schedules use four phases (ramp-up, peak, ramp-down, off-peak) with a capacity threshold and a minimum percentage of hosts. Personal schedules act on disconnected and signed-out sessions."
  - "Autoscale turns a host on when used capacity exceeds the threshold, and turns one off only if used capacity stays at or below the threshold afterwards."
  - "The role Desktop Virtualization Power On Off Contributor must be assigned at subscription level. A lower scope can stop autoscale from working properly."
  - "Do not combine autoscale with the Azure Automation and Logic Apps scaling tool or other scaling tools on the same host pool."
faq:
  - q: "Does power management autoscaling cost extra?"
    a: "Microsoft's autoscale FAQ says no: you are not charged extra for using autoscale, and it points to the Azure Virtual Desktop pricing page for rates. The FAQ also says autoscale deallocates a session host that was turned on but never used to sign in, after a period of inactivity, to avoid unnecessary compute costs."
  - q: "Can autoscale turn off every VM in a host pool?"
    a: "Only if there are no user sessions on the session hosts, including disconnected sessions. Microsoft's FAQ says a disconnected session counts as a session and recommends a time limit policy that signs out disconnected users."
  - q: "Can I configure autoscale with the Azure CLI or skip specific dates such as holidays?"
    a: "According to the autoscale FAQ on Microsoft Learn at the time of review, autoscale does not offer configuration through Azure CLI and does not support ramping down on specific dates. Check the current FAQ before you plan around either point."
---

Power management autoscaling is the Azure Virtual Desktop feature that powers existing session hosts on and off, following a schedule and the share of session capacity that is in use. Use it when a host pool has a recognisable daily rhythm and you want unused VMs deallocated outside working hours. It does not create or delete VMs. That is the job of dynamic autoscaling, a separate scaling method.

## What power management autoscaling does

Microsoft Learn defines autoscale as the native scaling service that scales session hosts up and down based on the capacity of the host pools and the scaling plan schedule you define. There are two scaling methods:

- **Power management autoscaling** powers session hosts on and off to adjust to the available capacity in a host pool. Learn names it as the option for host pools with standard management.
- **Dynamic autoscaling** also creates and deletes session hosts. It can only be used for pooled host pools with a session host configuration. The scenarios and glossary pages label it preview. The What's new page lists it as preview in November 2024 and as "now available" in June 2026, without a general availability label. No Learn page calls it generally available. Power management autoscaling is generally available.

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

Autoscale turns a host on when used capacity exceeds the threshold. It turns a host off only if used capacity stays at or below the threshold after the host is gone, and the host has no sessions (force logoff in ramp-down is the exception).

Learn's ramp-up example has six session hosts, two available, a maximum session limit of 5 and a capacity threshold of 30 percent. The sequence below is worked out from the same rules; Learn's table confirms the 33, 30 and 35 percent steps.

1. Available capacity is 2 × 5 = 10 sessions. With 3 sessions, used capacity is 30 percent. That is not above the threshold, so nothing happens.
2. A fourth session brings used capacity to 40 percent. Autoscale turns on a host. Capacity is now 15, and used capacity is about 27 percent.
3. A fifth session gives 5 ÷ 15 = 33 percent, so another host is turned on. Capacity is 20.
4. At 6 sessions nothing happens (30 percent). A seventh session gives 35 percent and a fifth host starts.

Autoscale does not turn hosts off during ramp-up. In peak it turns hosts on and off to keep use stable. A peak example, worked out from the same rules: with 5 hosts and a limit of 5 sessions each, 7 sessions give 28 percent. Removing one host would give 7 ÷ 20 = 35 percent, above the 30 percent threshold, so none is turned off. With 5 sessions, removing one empty host gives 25 percent, so autoscale puts it in drain mode and turns it off.

## Ramp-down and off-peak

Ramp-down uses session consolidation. Autoscale counts active and disconnected sessions, assumes disconnected users may come back, and keeps enough hosts for all of them. The formula on Learn is: required hosts = total sessions ÷ (maximum session limit × capacity threshold), rounded up. Example: 8 disconnected sessions, a limit of 10 and a threshold of 80 percent need 8 ÷ 8 = 1 host.

You choose how the remaining hosts are emptied:

- **Stop VMs when there are no active sessions** (portal wording varies, for example "no active or disconnected sessions"): autoscale waits for users to sign out.
- **Force logoff of users**: autoscale picks the host with the fewest sessions, puts it in drain mode, notifies users, signs them out after the wait time you set, and deallocates the VM.

Force logoff applies only in ramp-down. The page gives no default wait time. In the Learn ramp-down example (4 available hosts, limit 5, 4 sessions, threshold 75 percent, minimum 10 percent), the consolidation formula gives 4 ÷ (5 × 0.75) = 1.07, rounded up to 2 required hosts. Autoscale therefore turns off two of the four hosts. With force logoff it picks the hosts with the fewest sessions and signs out their remaining users after the wait time. The last host is never turned off, because capacity 0 would fall below the 10 percent minimum.

In off-peak, the minimum percentage of hosts keeps capacity on. To reach zero running hosts there must be no user sessions at all, disconnected ones included. Learn points to a time limit policy, set in Intune or Group Policy, that signs out disconnected sessions.

## Personal host pools

A personal schedule has no capacity threshold. Each phase has a start time, an optional Start VM on Connect setting, and actions for sessions that were **disconnected** or **signed out** for 0 to 360 minutes: deallocate, hibernate or do nothing. In ramp-up you choose which VMs to start: assigned only, assigned and unassigned, or none. If autoscale does not start personal desktops, the FAQ says to enable [Start VM on Connect](/entity/avd-start-vm-on-connect/) or start them yourself. Do not enable hibernation when FSLogix or MSIX app attach is used, because they do not support it.

## Setting it up

The step-by-step procedure is covered in the article "How to create and assign an AVD scaling plan step by step". The points that decide whether power management autoscaling works are these:

1. **Grant the power role.** Assign **Desktop Virtualization Power On Off Contributor** to the Azure Virtual Desktop service principal, or to a managed identity on the host pool, with the subscription as scope. Learn says a lower scope, such as a resource group, host pool or VM, prevents autoscale from working properly. Add every subscription that holds host pools you want to scale.
2. **Set a maximum session limit** on pooled host pools and keep plan and host pool in the same region.
3. **Mind the weekend.** Off-peak settings of the last selected day carry over to unselected days, so a Monday-to-Friday plan holds Friday's off-peak settings through the weekend.
4. **Turn on diagnostics.** Autoscale logs can go to a storage account or an event hub. For pooled pools Microsoft recommends the autoscale data in [Insights](/entity/avd-insights/).

## When to use it, and when not

Power management autoscaling fits when:

- Working hours are regular and you can name a ramp-up, peak and ramp-down window.
- The host pool uses standard host management, with VMs that already exist.

Consider another approach when:

- You need hosts created and deleted on demand. That is dynamic autoscaling, and it requires a session host configuration.
- Your demand depends on specific dates. The FAQ says autoscale does not currently support ramping down on specific dates.
- You rely on the Azure CLI. The FAQ says autoscale cannot be configured with it.
- You need failover across regions. Autoscale scales existing VMs in the region where they were created and does not handle outages in another region.
- Another tool already scales the pool. Learn says autoscale cannot be used with Azure Automation and Azure Logic Apps scaling on the same host pool, and should not be combined with other Microsoft or third-party scaling tools. The same caution applies to scaling features of third-party management products such as [Nerdio's auto-scaling](/entity/nerdio-auto-scaling/): keep one scaling mechanism per host pool and check the vendor's documentation.

## Common traps

- **Exclusion tags used too widely.** Learn describes a pool of six hosts where five were tagged. At 80 percent used capacity autoscale could not add capacity. After the last running host was turned off, sign-ins failed with "No resources available." Removing the tag from two VMs let autoscale start one host, enough for the 10 percent minimum.
- **Drain mode is overwritten.** Autoscale changes drain mode on pooled hosts. Use the exclusion tag when you update VMs.
- **Load balancing is overridden.** In pooled pools autoscale applies the algorithm from the schedule, not the one set on the host pool.

## Sources

All pages retrieved on 2026-11-16.

- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Set up diagnostics for Autoscale](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
