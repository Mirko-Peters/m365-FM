---
title: "Exclusion tags in AVD autoscale: keeping individual VMs out of scaling"
summary: "The exclusion tag is a tag name set on an Azure Virtual Desktop scaling plan. Autoscale does not turn on, turn off or change the drain mode of any VM that carries a tag with that name, in every phase of the schedule."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-scaling-plan-exclusion-tag, avd-scaling-plan]
keypoints:
  - "The exclusion tag is a property of the scaling plan. Autoscale performs scaling actions only on VMs whose tag names do not match it."
  - "A tagged VM is not turned on, not turned off and its drain mode is not changed, in all phases of the schedule. Tagged hosts still count toward the minimum percentage of hosts."
  - "For pooled host pools autoscale overwrites drain mode on every VM it scales, whoever set it, so the exclusion tag is the documented way to protect a host during maintenance."
  - "Tagging too many hosts can leave autoscale unable to add capacity. In Microsoft's example, with five of six hosts tagged autoscale starts no further host at 80 percent used capacity; once the last host is tagged and off, the next user sees No resources available."
  - "Azure tags are not inherited from a resource group, so each session host VM needs its own tag."
faq:
  - q: "Does the exclusion tag stop autoscale for the whole host pool?"
    a: "No. Microsoft Learn says autoscale only performs scaling actions on VMs without a tag name that matches the exclusion tag. Untagged hosts in the same pool are still scaled."
  - q: "Does autoscale change drain mode on a tagged host?"
    a: "No. Learn says autoscale will not turn a tagged VM on or off or change its drain mode setting. On untagged hosts in pooled host pools, autoscale overwrites drain mode regardless of who set it."
  - q: "Do tagged hosts count toward the minimum percentage of hosts?"
    a: "Yes. Learn says tagged session hosts are still considered in the calculation of the minimum percentage of hosts. Learn's fourth scenario adds that tagged hosts that are off cannot be turned on, so the pool cannot meet its minimum until tags are removed. Learn does not say whether a running tagged host satisfies the minimum."
---

The exclusion tag is a tag name that you enter on an Azure Virtual Desktop scaling plan. Autoscale does not turn on, turn off or change the drain mode of any VM that carries a tag with that name, in any phase of the schedule. This article explains what the tag does and does not do, how it interacts with the minimum percentage of hosts, and which questions Microsoft Learn leaves open. The step-by-step maintenance procedure is in "How to use the exclusion tag for maintenance windows and special session hosts".

## What the exclusion tag is

Learn's glossary defines it as a property of a scaling plan: a tag name you can apply to VMs that you want to exclude from scaling actions. Autoscale only performs scaling actions on VMs without tag names that match the exclusion tag. A scaling action, in the glossary's wording, is when autoscale turns VMs on or off.

The scenarios page adds the exact scope. When a VM has a tag name that matches the exclusion tag, autoscale won't turn it on, off, or change its drain mode setting. The tag applies in all phases of the schedule: ramp-up, peak, ramp-down and off-peak. See the entity page for the [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) and the [scaling plan](/entity/avd-scaling-plan/) it belongs to.

## Where you set it

In the Azure portal wizard for a scaling plan, the **Basics** tab has an **Exclusion tag** field, for both power management and dynamic plans. Learn's field description uses `excludeFromScaling` as the example name. After creation, you change the tag name on the **Properties** tab of the plan, together with the friendly name, description and time zone. Changes to a plan that is already assigned apply immediately.

The autoscale pages give no procedure for applying the tag to the VMs themselves. That is ordinary Azure tagging, covered below. Learn also asks you not to put sensitive information such as user principal names or other personal data into the exclusion tag.

## What a tagged host does and does not do

| Question | Tagged VM | Untagged VM |
|---|---|---|
| Autoscale turns it on | No | Yes, when the phase rules require it |
| Autoscale turns it off | No | Yes, when the phase rules allow it |
| Autoscale changes drain mode | No | Yes, pooled host pools |
| Included in the minimum percentage calculation | Yes | Yes |

The last row matters most. The create-and-assign page says tagged session hosts are still considered part of the minimum percentage calculation. The minimum percentage is the lowest percentage of all session hosts in the pool that must be turned on in a phase, rounded up. A tagged host that is switched off is counted in the total, but autoscale cannot switch it on. Learn's fourth scenario says this directly: being unable to turn VMs back on means the host pool cannot meet its minimum percentage of hosts.

A tagged host that is already running stays running, because autoscale will not turn it off. That follows from the definition above; Learn does not spell the case out, and it does not say whether a running tagged host satisfies the minimum.

## Why drain mode is the main reason to use it

Autoscale uses drain mode itself when it consolidates sessions in ramp-down. The autoscale FAQ states the consequence: autoscale still turns VMs in drain mode on or off, no matter who put them in drain mode. It overrides drain mode on all VMs included in scaling, so to exclude a VM from scaling actions you must use exclusion tags. How drain mode behaves and how the load balancer treats a drained host is covered in "Drain mode in Azure Virtual Desktop explained", and the wave planning for a whole pool in "Patching AVD without downtime: rolling updates with drain mode".

The FAQ treats personal host pools differently. For personal desktops autoscale does not put the session host in drain mode when it deallocates a VM, and a user who connects during deallocation gets a "No resources available" error. In a personal pool the tag therefore protects the power state, not drain mode.

## The failure mode: tagging too many hosts

Learn's fourth scenario shows what happens when the tag removes the capacity autoscale needs. The pool has six session hosts, a 75 percent capacity threshold, a 10 percent minimum percentage of hosts and a maximum session limit of 5, in the off-peak phase. One host is running with three sessions, which is 60 percent used capacity.

1. The administrator tags five of the six hosts. A fourth user signs in. Four sessions on a capacity of 5 are 80 percent, above the 75 percent threshold, but autoscale starts nothing because every other host is tagged. Learn reports four user sessions on the one running host and no further host being turned on.
2. All users sign out. The single running host stays on, because 10 percent of six hosts rounds up to one host.
3. The administrator tags the last untagged host and turns it off. Now every host is excluded and off. Autoscale cannot turn on a VM for the next user, who sees a "No resources available" error.
4. The administrator removes the tag from two VMs. Autoscale turns on only one of them, because one host is enough to meet the 10 percent minimum.

The lesson is arithmetic you can do in advance. This is the article's own simplified model, not a statement from Learn. It assumes that every tagged host is switched off. Learn's glossary defines available host pool capacity as the maximum session limit multiplied by the number of available session hosts, and available session hosts as hosts that pass the agent health checks and have powered-on VMs. A tagged host that is running therefore also adds capacity by that definition, and the ceiling is higher; Learn does not say whether a host in drain mode counts. With all tagged hosts off and all untagged hosts running, untagged hosts times the maximum session limit times the capacity threshold is the number of sessions the pool can carry before used capacity goes over the threshold and autoscale has no host left to turn on. Four untagged hosts, a limit of 10 and a 75 percent threshold give 4 x 10 x 0.75 = 30 sessions. If some untagged hosts are still off, autoscale can start them, so the ceiling is reached only when they are all on. Learn's final table for the scenario lists a 19 percent minimum although its text says 10 percent; the text and the arithmetic agree on 10 percent, so this article uses that. See [capacity threshold](/entity/avd-capacity-threshold/), [maximum session limit](/entity/avd-maximum-session-limit/) and [minimum percentage of hosts](/entity/avd-minimum-percentage-of-hosts/); the rounding rule has its own article, "How rounding up works with the minimum percentage of hosts, with worked examples".

## How Azure tags behave

The exclusion tag is a standard Azure resource tag, so the general tagging rules apply. They come from the Azure Resource Manager tagging documentation, not from the autoscale pages.

- Tag names are case-insensitive for operations, and tag values are case-sensitive. The autoscale pages do not say how autoscale compares the name, so use one spelling everywhere.
- A resource can have up to 50 tag name-value pairs. A tag name can have up to 512 characters and a value up to 256. The characters < > % & \ ? / are not allowed in tag names.
- Resources do not inherit tags from their resource group or subscription. Tagging the resource group of a host pool does not tag its VMs.
- To add tags you need write access to tags. Learn names the **Tag Contributor** role, with a limit: that role cannot apply tags to resources through the Azure portal, but it supports all tag operations through Azure PowerShell and the REST API. An administrator with only that role must tag the VMs from PowerShell.
- The portal asks for a name and a value. The autoscale pages define the match by tag name; they do not say whether the value is compared.

## Checking that it works

For a pooled host pool, open the host pool in the Azure portal, select **Insights** (or **Insights (Legacy)** if the session hosts use the Log Analytics agent) and then the **Autoscale** tab. Insights for autoscale supports pooled host pools only. The data comes from the `WVDAutoscaleEvaluationPooled` Log Analytics table, which records what autoscale did and why. Its `ExcludedSessionHostCount` column is described as the number of session hosts excluded from autoscale management. The Insights page does not say that the tab displays this value, so query the table if you need it. The `ScalingReasonMessage` column explains the actions taken. Autoscale logs written through diagnostic settings carry the fields `operationName`, `resultType` and `correlationId`; the Autoscale diagnostics page does not list a log entry for skipped tagged hosts.

## What Learn does not say

The Learn pages on autoscale do not answer several questions, so plan around them instead of assuming:

- How quickly autoscale notices a newly added or removed tag.
- Whether the tag value is part of the match.
- Whether a running tagged host satisfies the minimum percentage of hosts.
- How the tag affects Start VM on Connect when a user connects to a tagged host that is off. The setup of that feature is in "How to configure Start VM on Connect for personal and pooled host pools".
- How dynamic autoscaling, which can create and delete session hosts, handles tagged hosts. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. Power management autoscaling is also generally available.

Because of the first gap, tag a host before you put it into drain mode, and confirm in the logs that autoscale leaves it alone before you rely on it.

## Related

- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Drain mode](/entity/avd-drain-mode/)
- [Azure resource tags](/entity/azure-resource-tags/)
- [AVD Insights](/entity/avd-insights/)

## Sources

All retrieved on 2026-11-17.

- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Set up diagnostics for Autoscale](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: Monitor autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: Use tags to organize your Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources)
- [Microsoft Learn: Use the Azure portal to manage tags](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources-portal)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
