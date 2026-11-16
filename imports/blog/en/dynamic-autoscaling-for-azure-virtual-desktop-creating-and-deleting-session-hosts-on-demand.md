---
title: "Dynamic autoscaling for Azure Virtual Desktop: creating and deleting session hosts on demand"
summary: "Dynamic autoscaling is the Azure Virtual Desktop scaling method that, besides powering session hosts on and off, creates and deletes them. It works only for pooled host pools with a session host configuration, and Microsoft Learn labels its status inconsistently, so check the current page before you rely on it."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [avd-dynamic-autoscaling, avd-scaling-plan]
keypoints:
  - "Dynamic autoscaling powers session hosts on and off and also creates and deletes them. Power management autoscaling only deallocates and starts them."
  - "It requires a pooled host pool with a session host configuration, a custom maximum session limit and two roles assigned at subscription level."
  - "The consolidation maths is the same for both methods: required hosts = sessions / (maximum session limit x capacity threshold), rounded up."
  - "Microsoft Learn still marks dynamic autoscaling as preview on some pages, while the June 2026 What's new entry says it is available without a label. Verify the status before you plan a rollout."
  - "Hosts with an ephemeral OS disk cannot be deallocated, so Learn recommends a minimum percentage of active hosts of 100% in every phase."
faq:
  - q: "Is dynamic autoscaling generally available?"
    a: "The Learn pages do not agree. The What's new page announced it as preview in November 2024 and says in June 2026 that it is now available, without the words generally available. The autoscale scenarios, glossary and troubleshooting pages call it preview, no Learn page calls it generally available, and the PowerShell instructions use a preview module of Az.DesktopVirtualization. Treat the status as unconfirmed and check the pages again before a production rollout."
  - q: "Can I use dynamic autoscaling on any host pool?"
    a: "No. Microsoft Learn says it can only be assigned to pooled host pools with a session host configuration. For a standard host pool without session host configuration, use the power management scaling method. The approach is set when the host pool is created and cannot be changed later."
  - q: "Can I combine dynamic autoscaling with another scaling script?"
    a: "No. Learn says you cannot use dynamic scaling with any other scaling script on the same host pool, and names scaling with Azure Automation and Azure Logic Apps as an example. Use one method or the other."
---

Dynamic autoscaling is a scaling method for [Azure Virtual Desktop](/entity/azure-virtual-desktop/) that adjusts capacity in two ways: it powers session hosts on and off, and it creates and deletes session hosts. It works only for pooled host pools that use a session host configuration. Microsoft Learn labels its release status inconsistently, so the status section below shows what each page says.

This article covers what the method does, how hosts are created and deleted, and how the schedule parameters interact. It is based on Microsoft Learn pages retrieved on 2026-11-16. It does not cover the creation of a session host configuration itself.

## What dynamic autoscaling does

Microsoft Learn defines [dynamic autoscaling](/entity/avd-dynamic-autoscaling/) as a scaling method that "powers on and off session hosts and creates and deletes session hosts to adjust to the available capacity in a host pool." The alternative is [power management autoscaling](/entity/avd-power-management-autoscaling/), which only powers hosts on and off and is the option for host pools with standard management.

In the Learn scenarios, the consolidation calculation and the forced sign-out behavior are identical for both methods. The only difference is that power management deallocates a session host, while dynamic autoscaling can delete it.

Both methods are configured in a [scaling plan](/entity/avd-scaling-plan/). A plan can only be assigned to host pools of the host pool type set in the plan, and a host pool can have only one scaling plan. For pooled host pools, autoscale also overwrites [drain mode](/entity/avd-drain-mode/) and ignores the load-balancing algorithm in the host pool settings.

## Status: preview or available?

Learn does not use one label across pages:

- The scenarios, glossary and troubleshooting pages label it "Dynamic Autoscaling (preview)", while power management autoscaling is listed as generally available.
- What's new lists "Dynamic autoscaling for Azure Virtual Desktop is now in preview" in November 2024.
- What's new says in June 2026 that dynamic autoscaling "is now available for pooled host pools with session host configuration." That entry has no generally available label and does not mention preview.
- The create-and-assign page requires the `Az.DesktopVirtualization` module in version 5.4.2-preview or a later preview version for PowerShell.

No Learn page calls dynamic autoscaling generally available. Before a production rollout, check the current pages and your support terms.

## Requirements in short

Learn lists these conditions for assigning a dynamic scaling plan. The full list is in the article "Requirements and limits of dynamic autoscaling in Azure Virtual Desktop".

- **Host pool.** Pooled, with a [session host configuration](/entity/avd-session-host-configuration/). The management approach is set when the host pool is created and cannot be changed later. A host pool created without a session host configuration cannot get one afterwards.
- **Maximum session limit.** A custom [maximum session limit](/entity/avd-maximum-session-limit/) for load balancing. Learn says not to use the default value.
- **Cloud and region.** Azure only, not Azure Government. Scaling plan configuration data must be in the same region as the host pool configuration.
- **Roles.** Desktop Virtualization Power On Off Contributor and Desktop Virtualization Virtual Machine Contributor, with the subscription as scope. Learn warns that a lower scope, such as a resource group, host pool or VM, prevents autoscale from working properly. Assigning them needs `Microsoft.Authorization/roleAssignments/write`.
- **No other scaling tool.** Learn says dynamic scaling cannot be used with any other scaling script on the same host pool.

The What's new page also describes a [managed identity](/entity/avd-managed-identity/) requirement for host pools with a session host configuration. Its September 2025 entry gives an estimated progression: from September 19, 2025, new host pools created in the Azure portal need a managed identity; from October 15, 2025, existing host pools cannot update the configuration without one; from November 15, 2025, they cannot create session hosts without one. The September 2026 entry says managed identity support is now generally available and that the requirement for adding session hosts will apply "in a future service update", without a date. The two entries do not fit together cleanly, so check the page for the current state.

## How hosts are created and deleted

Creating and deleting hosts is what power management autoscaling does not do. What Learn documents:

- What's new describes the purpose as schedules that "dynamically create and delete session host virtual machines based on usage patterns".
- Hosts in a pool with a session host configuration are managed by the Azure Virtual Desktop service. Tools built for standard management cannot create, update or scale them.
- The two roles allow Azure Virtual Desktop to "create, delete, update, start, and stop any session hosts in those subscriptions".
- When autoscale creates a host, it deploys the Azure Virtual Desktop agent from the endpoint `wvdhpustgr0prod.blob.core.windows.net`. Hosts that cannot reach it fail with `CustomerVmNoAccessToDeploymentPackageException`, so open that endpoint on firewalls and proxies.
- At the end of a scale-in with forced sign-out, autoscale "deallocates or deletes the VM" after signing users out.
- For every pool with a session host configuration, What's new (June 2025) says session host creation retries automatically after transient errors, Log Analytics for the host pool includes session host creation activity, and increasing the host pool size through the API or a custom ARM template makes the service create new session hosts.

The scenario examples below say "turn on" and show only the threshold logic, not a host being created. The final action of a scale-in is the difference: power management deallocates, dynamic autoscaling "deallocates or deletes".

## Create a plan in the Azure portal

In the Azure portal, open **Azure Virtual Desktop**, select **Scaling Plans** and then **Create**. On **Basics**, set the host pool type to **Pooled** and the scaling method to **Dynamic autoscaling**. An optional exclusion tag such as `excludeFromScaling` is entered there too. Add a schedule with the General, Ramp up, Peak hours, Ramp-down and Off-peak hours tabs, assign the pooled host pools with session host configuration, then select **Review + create**.

Changes to a plan that is already assigned take effect immediately.

## How the schedule parameters work

A schedule has four [phases](/entity/avd-autoscale-schedule-phases/): ramp-up, peak hours, ramp-down and off-peak hours. Learn describes these parameters on the General tab:

| Parameter | Meaning |
|---|---|
| Minimum percentage of active hosts | Minimum share of running hosts, based on the minimum host pool size. Learn's example: 10% with a minimum pool size of 10 keeps one host available. |
| Minimum host pool size | Number of session hosts that are always part of the pool. They can be running or stopped. |
| Maximum host pool size | Maximum number of running session hosts. |

The [capacity threshold](/entity/avd-capacity-threshold/) is set on the ramp-up tab and carried into peak hours. The ramp-down value carries into off-peak hours. Learn's example: a threshold of 60% with 100 total sessions of capacity triggers scale-out once more than 60 sessions are in use. The [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/) in ramp-up carries into peak hours. On unselected days the last off-peak parameters stay in effect until the next ramp-up, so Friday's off-peak settings apply until Monday's ramp-up.

## The consolidation maths

The glossary gives the formula for both methods: required hosts = total user sessions / (maximum session limit x capacity threshold), rounded up. Active and disconnected sessions both count.

Worked example from the glossary: 8 disconnected users, a maximum session limit of 10 and a capacity threshold of 80%. That gives 8 / (10 x 0.8) = 1, so one host stays. To reach zero hosts, there must be zero sessions, including disconnected ones. The glossary suggests a Group Policy setting that signs out disconnected sessions automatically.

The scenarios page adds a scale-out example with 6 hosts, breadth-first load balancing, a 30% threshold, a 30% minimum percentage and a maximum session limit of 5:

- The pool starts with 2 running hosts, because 30% of 6 rounds up to 2.
- With 3 sessions on 2 hosts, usage is 30%. That is not greater than the threshold, so nothing is turned on.
- With 4 sessions, usage is 40%. A third host is started, capacity rises to 15 and usage falls to 27%.

For scale-in during ramp-down, Learn's example uses depth-first, a 75% threshold and a 10% minimum. With 4 sessions on 2 running hosts and a maximum session limit of 5, capacity is 10 and usage is 40%. This is a later step of the scenario, and autoscale does not turn off another host there. Learn states why: turning off one more host would leave one host with a capacity of 5, and 4 users would make 80% used capacity, above the 75% threshold. Autoscale only removes or stops a host when all existing sessions can fit on the remaining hosts without exceeding the threshold.

## Scale-in, forced sign-out and the exclusion tag

During ramp-down with **Force logoff users** enabled, autoscale picks the host with the fewest sessions, active and disconnected, puts it in [drain mode](/entity/avd-drain-mode/), notifies users, signs them out after the wait time, and then deallocates or deletes the VM. [Forced sign-out](/entity/avd-force-logoff/) ends the user sessions once the wait time is over. Without forced sign-out, you choose between the conditions **VMs have no active or disconnected sessions** and **VMs have no active sessions**.

Hosts that carry the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) are left alone for start, stop and drain-mode changes, but they still count toward the minimum percentage of hosts. In Learn's scenario, five of six hosts carry the tag and the pool cannot grow when 4 sessions on the single running host push usage to 80%.

## Ephemeral OS disks

Hosts that use [ephemeral OS disks](/entity/avd-ephemeral-os-disks/) cannot be deallocated, only restarted, reimaged or deleted. Learn therefore recommends dynamic autoscaling for these host pools and a **Minimum percentage of active hosts** of 100% in every phase. With that value, scaling only creates and deletes hosts and never tries to start or deallocate them. Ephemeral OS disks are supported only in pooled host pools with a session host configuration. The same Learn page frames further limits as applying "during preview": no NVMe or premium SSD, only Standard SSD as OS disk type, and no Azure Government.

## Open points

The Learn pages retrieved do not explain how long session host creation takes, how deleted hosts are cleaned up beyond the VM, or which diagnostic tables record creation failures. What's new says only that Log Analytics for the host pool includes session host creation activity. The troubleshooting page points to separate pages on autoscale diagnostics and monitoring, which were not read for this article.

## Sources

Retrieved on 2026-11-16.

- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: What's new in Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Troubleshoot autoscale issues in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: Ephemeral OS disks on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks)
