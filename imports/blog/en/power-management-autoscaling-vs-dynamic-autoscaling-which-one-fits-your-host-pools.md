---
title: "Power management autoscaling vs dynamic autoscaling: which one fits your host pools"
summary: "Power management autoscaling turns existing session hosts on and off, while dynamic autoscaling also creates and deletes them. Which one you can use depends first on how the host pool is managed, not on preference."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [avd-power-management-autoscaling, avd-scaling-plan]
keypoints:
  - "Power management autoscaling starts and deallocates existing session hosts. Dynamic autoscaling can also create and delete session hosts."
  - "Dynamic autoscaling works only for pooled host pools with a session host configuration, and only in Azure, not Azure Government. Power management autoscaling is generally available."
  - "Microsoft Learn is inconsistent on dynamic autoscaling: the scenarios and glossary pages say preview, What's new (June 2026) says 'now available' without a GA label."
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

Use power management autoscaling when your session hosts are created and updated by your own tools, when the host pool is personal, or when you run in Azure Government. Use dynamic autoscaling only for pooled host pools with a session host configuration, and only after you have checked its status, because Microsoft Learn is not consistent about it.

## The short comparison

Microsoft Learn says power management autoscaling "powers on and off session hosts", while dynamic autoscaling also "creates and deletes session hosts". The table collects what the Learn pages state.

| Aspect | Power management autoscaling | Dynamic autoscaling |
|---|---|---|
| Scale-down action | Deallocates session hosts | Deallocates or deletes session hosts |
| Scale-up action | Turns on existing session hosts | Turns on existing hosts and creates new ones |
| Host pool type | Pooled and personal | Pooled only |
| Management approach | Standard management or session host configuration | Session host configuration only |
| Status | Generally available | Scenarios and glossary: preview. What's new: preview (Nov 2024), "now available" (June 2026) |
| Clouds | Azure and Azure Government | Azure only |
| Role assignment | Desktop Virtualization Power On Off Contributor | Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor |
| PowerShell module | Az.DesktopVirtualization 4.2.0 or later | Az.DesktopVirtualization 5.4.2-preview or later preview version |

For pooled host pools, a note in the scenarios article says the consolidation calculations and force sign-out behavior are identical. The only difference is that power management deallocates session hosts while dynamic autoscaling can delete them.

## Status of dynamic autoscaling

The sources disagree, so here is each one:

- The autoscale scenarios and glossary pages label dynamic autoscaling "preview" and power management "generally available".
- What's new in Azure Virtual Desktop lists it as preview in November 2024. In June 2026 it says dynamic autoscaling "is now available for pooled host pools with session host configuration", with no GA or preview label.
- No Learn page calls dynamic autoscaling generally available. The scaling plan page still requires a `-preview` PowerShell module.

Treat it as preview until a page says otherwise.

## Decision 1: Which cloud and how was the host pool created?

If the host pool is in Azure Government, the choice is made: dynamic autoscaling is not supported there.

Otherwise, the next question settles most cases. The host pool management approaches article describes two approaches. With standard management, you create, update and scale session hosts yourself and add them with a registration token. With a session host configuration, hosts are added by increasing the host pool size, and autoscale can create and delete them.

Two statements from that page matter:

- The approach is set at creation. If you create a host pool without a session host configuration, you cannot add one afterwards.
- A session host configuration can be used with pooled host pools only.

The autoscale prerequisites repeat the consequence: a standard host pool needs the power management method. Hosts built with pipelines or scripts mean standard management. See [AVD host pool](/entity/avd-host-pool/) and [AVD session host configuration](/entity/avd-session-host-configuration/).

## Decision 2: Pooled or personal?

A [scaling plan](/entity/avd-scaling-plan/) has a type, pooled or personal, and you can assign it only to host pools of that type. In the portal, the scaling method option appears only when you select pooled.

Personal host pools therefore use power management autoscaling. Ramp-up offers a Start VM on Connect switch and a choice of which VMs to start: assigned only, assigned and unassigned, or none. Disconnect and sign-out settings take 0 to 360 minutes, and the action can be deallocate, hibernate or do nothing. The FAQ says autoscale for personal desktops only deallocates a host after the user has signed out, and you cannot force users to sign out. Learn warns that FSLogix and App Attach do not currently support hibernate, so do not enable it with either. See [personal host pool](/entity/avd-personal-host-pool/) and [hibernation](/entity/avd-hibernation/).

## Decision 3: Do you need hosts created and deleted?

Only pooled host pools with a session host configuration reach this question. Dynamic autoscaling changes the number of VMs in the pool, not just the number running. The autoscale pages do not compare the cost of deallocated and deleted hosts, so check your own pricing.

A new host is built from the session host configuration. The FAQ says autoscale creates hosts with the latest valid and stable image version defined in the default session host configuration, if you do not already have an active session host configuration.

If you need neither creation nor deletion, power management autoscaling is the narrower choice.

## Settings that differ

Both methods use a schedule with ramp-up, peak, ramp-down and off-peak phases. See [autoscale schedule phases](/entity/avd-autoscale-schedule-phases/).

**Power management, pooled.** Ramp-up has a start time, load balancing algorithm, [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) and [capacity threshold](/entity/avd-capacity-threshold/). Learn recommends breadth-first at ramp-up and depth-first at off-peak. Ramp-down adds [force logoff](/entity/avd-force-logoff/).

**Dynamic, pooled.** Each phase adds a minimum percentage of active hosts, a minimum host pool size and a maximum host pool size, including ramp-down with force logoff. The FAQ gives two rules:

- The minimum host pool size overrides the number of session hosts you defined in the host pool.
- The total number of active session hosts does not exceed the maximum host pool size if used capacity exceeds the capacity threshold.

Because the maximum can differ per phase, a pool can exceed the maximum when a new phase starts. Autoscale deletes active deallocated hosts with no sessions to honor the maximum of the current phase, and then continues to delete or deallocate hosts by schedule and capacity threshold, except in the ramp-up phase.

The FAQ shows two ways to make dynamic autoscaling behave like a simpler method:

- To only turn hosts on and deallocate them, use the same value for minimum and maximum host pool size.
- To only create and delete hosts, set the minimum percentage of active hosts to 100.

## Example with numbers

The scenarios article gives a worked consolidation example for pooled host pools that applies to both methods. Setup at ramp-down: six session hosts, depth-first, capacity threshold 75%, minimum percentage 10%, four available hosts, a maximum session limit of 5, four user sessions and force logoff enabled for the ramp-down phase.

The glossary formula is Required Hosts = Total User Sessions / (Max Session Limit x Capacity Threshold), rounded up to the nearest whole number. Here that is 4 / (5 x 0.75) = 1.07, rounded up to 2. Autoscale turns off two hosts. Every host has sessions and all have the same number, so autoscale picks two hosts at random, puts them in drain mode, notifies the users and signs them out after the wait time. In general, autoscale prefers the host with the fewest sessions. Without force logoff, autoscale waits for users to sign out themselves and only turns off hosts without sessions. When users reconnect and one signs out, 3 sessions remain (30%), and autoscale turns off one more host. One host stays on, because turning off the last would drop available capacity to zero, below the 10% minimum.

The troubleshooting article gives CEILING(9 / (5 x 0.9)) = 2 hosts for 9 disconnected users, with a maximum session limit of 5 and a capacity threshold of 90%. It adds that during ramp-down and off-peak, autoscale uses the higher of that result and the minimum percentage of active hosts.

With power management, the removed hosts are deallocated and stay in the host pool. With dynamic autoscaling, they can be deleted. When demand rises, the FAQ says autoscale turns on stopped hosts and creates additional ones if the number needed is larger than the minimum host pool size.

## Shared settings and requirements in brief

- **Maximum session limit.** For pooled host pools, set it explicitly and do not use the default. See [maximum session limit](/entity/avd-maximum-session-limit/).
- **Exclusion tag.** Tagged hosts are not turned on, turned off or changed in drain mode in any phase. Because autoscale cannot turn them on, an excluded host cannot help meet the minimum percentage of hosts. See [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/).
- **Drain mode.** For pooled host pools, autoscale overwrites drain mode, so use the exclusion tag for maintenance. See [drain mode](/entity/avd-drain-mode/).
- **Other scaling tools.** You cannot use autoscale together with scaling via Azure Automation and Azure Logic Apps on the same host pool.
- **Holidays.** Autoscale does not support ramping down on specific dates.

Permissions and network requirements are covered in the article "Requirements and limits of dynamic autoscaling in Azure Virtual Desktop". In short:

- Power management needs Desktop Virtualization Power On Off Contributor. Dynamic autoscaling also needs Desktop Virtualization Virtual Machine Contributor. Assign them to the Azure Virtual Desktop service principal with the subscription as scope, because Learn says a lower scope prevents autoscale from working properly.
- Dynamic autoscaling needs access to `wvdhpustgr0prod.blob.core.windows.net`. Without it, hosts fail with `CustomerVmNoAccessToDeploymentPackageException`.

## How to pick, in order

1. Azure Government: use power management autoscaling.
2. Open the host pool and check whether it has a session host configuration. If not, use power management autoscaling. It cannot be added later.
3. Check the pool type. Personal pools use power management autoscaling.
4. For a pooled host pool with a session host configuration, decide whether the VM count must change. If you only need fewer running VMs, power management autoscaling is enough.
5. If you want create and delete, accept the status described above, assign both roles at subscription level, allow the endpoint and set the maximum session limit explicitly.
6. Run one pilot pool for a full week of schedules. The troubleshooting article lists maximum session limit, capacity threshold, session mix, minimum active host percentage and sign-out behavior as reasons similar pools scale down differently.
7. If hosts stay on after hours, check disconnected sessions first. Learn says disconnected sessions count as active for capacity calculations, and suggests a Group Policy time limit for disconnected sessions.

## One more check

Force sign-out can only happen in the ramp-down phase, and Learn gives no default wait time, so set and test it yourself. For personal pools with hibernate, the troubleshooting article says a host stays unavailable if the RDAgentBootLoader and RDAgent services are not Running about 5 minutes after resume. It suggests deallocate in that case.

## Related

- [AVD power management autoscaling](/entity/avd-power-management-autoscaling/)
- [AVD dynamic autoscaling](/entity/avd-dynamic-autoscaling/)
- [AVD scaling plan](/entity/avd-scaling-plan/)

## Sources

All pages retrieved on 2026-11-16.

- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Troubleshoot Autoscale Issues in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
