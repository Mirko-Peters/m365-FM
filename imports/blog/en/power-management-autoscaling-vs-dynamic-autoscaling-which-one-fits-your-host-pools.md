---
title: "Power management autoscaling vs dynamic autoscaling: which one fits your host pools"
summary: "Power management autoscaling turns existing session hosts on and off, while dynamic autoscaling also creates and deletes them. Which one you can use depends first on how the host pool is managed, not on preference."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-power-management-autoscaling, avd-scaling-plan]
keypoints:
  - "Power management autoscaling starts and deallocates existing session hosts. Dynamic autoscaling can also create and delete session hosts."
  - "Dynamic autoscaling works only for pooled host pools with a session host configuration, and Learn lists it for Azure only, not Azure Government. Power management autoscaling is generally available."
  - "Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, in July 2026. Some Learn pages, such as the scenarios and glossary pages, still carry preview wording."
  - "The management approach is set when the host pool is created and cannot be changed later, so the choice is often made before the scaling plan exists."
  - "For pooled host pools, both methods use the same consolidation calculation and force sign-out behavior. The difference is the final action: deallocate or delete."
faq:
  - q: "Can I switch a host pool with standard management to dynamic autoscaling?"
    a: "No. Microsoft Learn says the management approach is set when the host pool is created and cannot be changed later, and that a host pool created without a session host configuration cannot get one afterwards. Dynamic autoscaling needs a session host configuration, so a standard host pool stays with power management autoscaling."
  - q: "Does autoscale cost extra?"
    a: "The autoscale FAQ on Microsoft Learn says no and points to the Azure Virtual Desktop pricing page for rates."
  - q: "Can I use dynamic autoscaling but keep all hosts and only start and stop them?"
    a: "Yes. The autoscale FAQ says that you can set the same value for Minimum host pool size and Maximum host pool size, or choose power management autoscaling as the scaling method when you create the plan."
---

Use power management autoscaling when your session hosts are created and updated by your own tools, when the host pool is personal, or when you run in Azure Government. Use dynamic autoscaling only for pooled host pools with a session host configuration, and check the current Learn page before relying on a limit, because some pages still carry preview wording.

## The short comparison

Microsoft Learn says power management autoscaling "powers on and off session hosts", while dynamic autoscaling also "creates and deletes session hosts". The table collects what the Learn pages state.

| Aspect | Power management autoscaling | Dynamic autoscaling |
|---|---|---|
| Scale-down action | Deallocates session hosts | Deallocates or deletes session hosts |
| Scale-up action | Turns on existing session hosts | Turns on existing hosts and creates new ones |
| Host pool type | Pooled and personal | Pooled only |
| Management approach | Standard management or session host configuration | Session host configuration only |
| Status | Generally available | GA announced July 2026; some Learn pages still say preview (see below) |
| Clouds | Azure and Azure Government | Azure only |
| Role assignment | Desktop Virtualization Power On Off Contributor | Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor |
| PowerShell module | Az.DesktopVirtualization 4.2.0 or later | Az.DesktopVirtualization 5.4.2-preview or later (the module version still carries the preview label) |

The management-approach row comes from the host pool management approaches page: with standard management, autoscale turns hosts on and off; with a session host configuration, it can also create and delete them. The FAQ adds that you can pick power management autoscaling as the method when you create a plan.

For pooled host pools, the scenarios article says the consolidation calculations and force sign-out behavior are identical. Only the final action differs.

## Status of dynamic autoscaling

Power management autoscaling is generally available. For dynamic autoscaling, Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community, 9 July 2026). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. The troubleshooting article also still says "Dynamic Autoscaling (preview)". What's new lists it as preview in November 2024 and, in June 2026, as "now available for pooled host pools with session host configuration", without a label. Details are in the article "Requirements and limits of dynamic autoscaling in Azure Virtual Desktop".

## Decision 1: Which cloud and how was the host pool created?

If the host pool is in Azure Government, the choice is made: dynamic autoscaling is not supported there.

Otherwise, the way the host pool was created settles most cases. With standard management, you create, update and scale session hosts yourself and add them with a registration token. With a session host configuration, hosts are added by increasing the host pool size, and autoscale can create and delete them. Two statements from the management approaches page matter:

- The approach is set at creation. If you create a host pool without a session host configuration, you cannot add one afterwards.
- A session host configuration can be used with pooled host pools only.

The autoscale prerequisites repeat the consequence: a standard host pool needs the power management method. Hosts built with pipelines or scripts mean standard management. Learn's June 2026 What's new also introduces the term "Automated host pools" for pools where one session host configuration is enforced across all session hosts; this article keeps saying "host pool with a session host configuration". One more point if you plan a new pool for this: Learn's What's new (September 2025) says that from 19 September 2025 new host pools with a session host configuration created in the Azure portal must use a managed identity, and announced that existing pools without one lose the ability to update the configuration (from 15 October 2025) and to create session hosts (from 15 November 2025). See [AVD host pool](/entity/avd-host-pool/) and [AVD session host configuration](/entity/avd-session-host-configuration/).

## Decision 2: Pooled or personal?

A [scaling plan](/entity/avd-scaling-plan/) has a type, pooled or personal, and you can assign it only to host pools of that type. In the portal, the scaling method option appears if you select pooled for the host pool type. Personal host pools therefore use power management autoscaling.

Personal plans work differently from pooled ones:

- **Start VM on Connect** is a switch in every phase. Only ramp-up also has a choice of which VMs to start: assigned only, assigned and unassigned, or none.
- **Disconnect settings** ("When disconnected for (min)") and **sign-out settings** ("When logged off for (min)") take 0 to 360 minutes. The action can be deallocate, hibernate or do nothing.
- The FAQ says you cannot make autoscale force users to sign out of a personal desktop, and that autoscale for personal desktops "only deallocates session hosts if the user has signed out of their user session". The plan settings above also offer an action for disconnected sessions. Learn does not reconcile the two statements, so test what your personal pool does after a disconnect.
- Learn warns that FSLogix and App Attach do not currently support hibernate, so do not enable it with either.

See [personal host pool](/entity/avd-personal-host-pool/) and [hibernation](/entity/avd-hibernation/).

## Decision 3: Do you need hosts created and deleted?

Only pooled host pools with a session host configuration reach this question. Dynamic autoscaling changes the number of VMs in the pool, not just the number running. Learn's glossary says that when autoscale shuts down a VM it deallocates and stops it, so you are not charged for the compute resources. What other resources of a deallocated host cost, compared with deleting the host, depends on your own pricing. New hosts are built from the session host configuration: the FAQ says autoscale uses "the latest valid/stable image version defined in the default session host configuration, if you don't already have an active session host configuration". The second half of that sentence is unclear in the FAQ itself, so confirm in a test pool which image a new host receives.

If you need neither creation nor deletion, power management autoscaling is the narrower choice. When autoscale starts, creates or deletes is the subject of the article "Dynamic autoscaling for Azure Virtual Desktop: creating and deleting session hosts on demand".

## Settings that differ

Both methods use a schedule with ramp-up, peak, ramp-down and off-peak phases. See [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/) and the phase article in this series.

**Power management, pooled.** Ramp-up has a start time, load balancing algorithm, [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) and [capacity threshold](/entity/avd-capacity-threshold/). Learn recommends breadth-first at ramp-up and depth-first at off-peak. Ramp-down adds [force logoff](/entity/avd-force-logoff/).

**Dynamic, pooled.** The General tab holds three values: minimum percentage of active hosts, minimum host pool size and maximum host pool size. Ramp-up and ramp-down let you change them for those phases; peak and off-peak have only a start time and a load balancing algorithm. Learn says the ramp-up minimum percentage, minimum host pool size and capacity threshold carry over to peak, and the ramp-down capacity threshold to off-peak. It does not say what happens to the other off-peak values. The FAQ gives two levers:

- To only turn hosts on and deallocate them, use the same value for minimum and maximum host pool size.
- To only create and delete hosts, set the minimum percentage of active hosts to 100.

## Example with numbers

Learn's consolidation scenario (scenario 3) applies to both methods and is worked through in the phase article. In short: with four user sessions, a maximum session limit of 5 and a capacity threshold of 75%, the glossary formula Required Hosts = Total User Sessions / (Max Session Limit x Capacity Threshold), rounded up, gives 4 / (5 x 0.75) = 1.07, so 2 hosts. In Learn's scenario, with four of six hosts available, autoscale turns off two hosts after signing users out.

The final step is where the methods diverge: power management leaves the removed hosts in the host pool, deallocated. Dynamic autoscaling can delete them.

## Shared settings in brief

- **Maximum session limit.** For pooled host pools, set it explicitly and do not use the default. See [maximum session limit](/entity/avd-maximum-session-limit/).
- **Exclusion tag.** Tagged hosts are not turned on, turned off or changed in drain mode in any phase, but they still count toward the minimum percentage of hosts. If the tagged hosts are switched off, autoscale cannot start them, so the pool cannot reach the minimum. Learn's scenario 4 shows the result: if the last untagged host is tagged and switched off, a user who tries to sign in sees "No resources available". See [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/).
- **Drain mode.** For pooled host pools, autoscale overwrites drain mode, so use the exclusion tag for maintenance. See [drain mode](/entity/avd-drain-mode/).
- **Holidays.** The autoscale FAQ says autoscale "doesn't currently support ramping down on specific dates", so a schedule cannot be tied to a calendar date.
- **Roles.** Power management needs Desktop Virtualization Power On Off Contributor, dynamic autoscaling also Desktop Virtualization Virtual Machine Contributor. The create-and-assign prerequisites for both methods allow the role to go to a managed identity assigned to the host pool or to the Azure Virtual Desktop service principal. The subsection on assigning permissions names the managed identity option only for power management and the service principal alone for dynamic autoscaling. The scope is the subscription. It says a lower scope prevents autoscale from working properly, while the troubleshooting page lists host pool, resource group or subscription scope as acceptable. Use the subscription scope. Endpoint and network requirements for dynamic autoscaling are in the requirements article.

## How to pick, in order

1. Azure Government: use power management autoscaling.
2. Open the host pool and check whether it has a session host configuration. If not, use power management autoscaling. It cannot be added later.
3. Check the pool type. Personal pools use power management autoscaling.
4. For a pooled host pool with a session host configuration, decide whether the VM count must change. If you only need fewer running VMs, power management autoscaling is enough.
5. If you want create and delete, check the current Learn pages for limits, assign both roles at subscription level and set the maximum session limit explicitly.
6. Advice, not from Learn: try the plan on one pilot pool for a full week of schedules before you assign it widely. The troubleshooting article lists maximum session limit, capacity threshold, session mix, minimum active host percentage and sign-out behavior as reasons similar pools scale down differently, so one pool's behavior may not carry over to another.
7. If hosts stay on after hours, check disconnected sessions first. Learn says disconnected sessions count as active for capacity calculations, and the troubleshooting page names a Group Policy setting for a time limit on disconnected sessions.

## One more check

Force sign-out can only happen in the ramp-down phase. The create-and-assign page states no default wait time (its PowerShell example uses 30 minutes as an example value), so set and test it yourself. For personal pools with hibernate, the troubleshooting article says a host stays unavailable if the RDAgentBootLoader and RDAgent services are not Running about 5 minutes after resume. It suggests deallocate in that case.

## Related

- [AVD power management autoscaling](/entity/avd-power-management-autoscaling/)
- [AVD dynamic autoscaling](/entity/avd-dynamic-autoscaling/)
- [AVD scaling plan](/entity/avd-scaling-plan/)

## Sources

All pages retrieved on 17 November 2026.

- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Troubleshoot Autoscale Issues in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
