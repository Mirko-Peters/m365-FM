---
title: "Azure Update Manager Dynamic Scopes and Maintenance Windows at Scale"
summary: "Set up scheduled patching with maintenance configurations and dynamic scopes in Azure Update Manager: window length, recurrence, tag and policy scoping, service limits and what happens when a window runs out."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [azure-update-manager, azure-arc, azure-policy]
keypoints:
  - "A maintenance configuration defines the schedule and window. A dynamic scope attaches machines to it by subscription or resource group plus optional filters such as tags, location and OS type."
  - "Patch orchestration of Azure machines must be Customer Managed Schedules. For Azure Arc-enabled machines this is not a requirement."
  - "The maximum maintenance window is 3 hours 55 minutes. Updates are not started if too little time is left, and in-progress updates are not stopped."
  - "Dynamic scopes are evaluated at run time, so the machine list can differ from the preview you saw when saving."
  - "Plan around documented limits, such as 1,000 resource associations per dynamic scope and 250 dynamic scopes per resource group or subscription per region."
faq:
  - q: "What is the longest maintenance window?"
    a: "Microsoft Learn says the upper maintenance window is 3 hours 55 minutes. If updates need longer, increase the window within that limit or split the machines across several schedules at different times."
  - q: "What happens when the window is exceeded?"
    a: "Learn says Azure Update Manager does not stop installing new updates as the window ends, and it does not terminate updates that are in progress. Only the remaining updates are not attempted. On Windows, a slow service pack is often the reason."
  - q: "Are new machines picked up automatically?"
    a: "A dynamic scope evaluates its criteria at the scheduled run time, so a machine that matches the filters at that moment is included. The pages I read do not say how quickly a new machine is associated outside the run. With the Azure Policy method, remediation covers existing machines and the assignment covers machines added later."
  - q: "Do dynamic scopes work for Azure Arc-enabled servers?"
    a: "Yes. Learn lists Azure Arc-enabled servers under the applies-to section. The pages I read give no Arc-specific rules beyond that, and the Customer Managed Schedules requirement is not needed for Arc machines."
  - q: "Can I change the subscription of a dynamic scope later?"
    a: "No. Learn says the subscription or resource group chosen when you create the scope cannot be edited. Only the filters can be changed."
---

For patching at scale, create one maintenance configuration per schedule, attach machines with dynamic scopes instead of fixed lists, and keep each window within the documented limit of 3 hours 55 minutes. Machines are then picked up by tags, locations or resource groups when the schedule runs. The details below follow Microsoft Learn for Azure Update Manager.

## The building blocks

Azure Update Manager covers Windows and Linux machines in Azure and machines connected through Azure Arc. Its overview names periodic assessments (every 24 hours when enabled), scheduled patching within a defined maintenance window, and dynamic scoping to group machines by criteria.

- **Maintenance configuration.** The schedule object. Its scope is **Guest (Azure VM, Azure Arc-enabled VMs/servers)**, shown as **InGuestPatch** in the list.
- **Dynamic scope.** A set of criteria that is associated with the configuration. Criteria are subscription, resource group, location, resource type, OS type and tags.
- **Static association.** A machine you attach directly. A schedule can use dynamic and static associations together.

## Step 1: Meet the prerequisite

Patch orchestration of Azure machines must be **Customer Managed Schedules**. For Azure Arc-enabled machines this is not required. When you add a dynamic scope in the portal, a consent pane offers two choices:

- Change the options so that the machines support the schedule. This sets patch mode to `AutomaticByPlatform` and `BypassPlatformSafetyChecksOnUserSchedule` to `True`.
- Continue with supported machines only.

For new VMs, the **Management** tab has **Patch orchestration options**. **Azure-orchestrated** sets the same values.

## Step 2: Create the schedule

1. In the Azure portal, open **Azure Update Manager** and select **Schedule updates**.
2. On **Basics**, choose subscription, resource group and instance details, and set **Maintenance scope** to Guest.
3. Select **Add a schedule**. Set **Start on**, **Maintenance window** in hours, and **Repeats**.
4. On **Updates**, include or exclude classifications such as Critical, Security and Feature updates, or specific KB IDs and packages.
5. Add tags and create the configuration.

Recurrence can be daily, weekly or monthly. The hourly option exists only in the API. Monthly can use a calendar date, or the nth weekday with an offset of up to plus or minus 6 days. Microsoft's example: to patch on the first Saturday after Patch Tuesday, set the second Tuesday with a +4 day offset. Driver updates are not supported. A maintenance configuration and its VMs must currently be in the same subscription.

## Step 3: Add a dynamic scope

1. Open **Azure Update Manager** > **Machines** > **Maintenance configurations** and pick the configuration.
2. Select **Dynamic scopes** > **Add a dynamic scope**.
3. Choose the subscription. This is mandatory.
4. Under **Filter by**, set optional filters for resource group, resource type, location, tags and OS type.
5. Review the machine preview, save, and answer the consent pane.

Rules from the page:

- Subscription or resource group cannot be changed after creation.
- A resource group scope covers only that group. A resource moved to another group is unassigned, even in the same subscription.
- Create subscription-level scopes with an empty location.
- The preview may differ at run time, because criteria are evaluated when the schedule runs.

A benefit: removing a tag from a machine drops its association without any edit to the schedule.

For permissions, the overview says write permission at subscription level is needed to create or change a schedule, and read permission to assign or read one.

## Step 4: Or scope through Azure Policy

Learn also describes a policy route. Assign the built-in definition **Schedule recurring updates using Azure Update Manager**. Parameters include the maintenance configuration ARM ID (mandatory), resource groups, OS types, machine locations, tags and a tags operator (all tags or any tag). Use a system-assigned managed identity for remediation. With remediation selected, the policy applies to existing machines. Without it, the policy applies to machines added later. The policy also sets the patch orchestration property to Customer Managed Schedules for Azure machines.

## Documented limits

| Limit | Value |
|---|---|
| Schedules per subscription per region | 250 |
| Resource associations per schedule | 3,000 |
| Resource associations per dynamic scope | 1,000 |
| Dynamic scopes per resource group or subscription per region | 250 |
| Dynamic scopes per schedule (public cloud) | 200 |
| Subscriptions across all dynamic scopes per schedule (public cloud) | 200 |
| Tag filters per dynamic scope | 50 |
| Resource group filters per dynamic scope | 50 |

The first six values come from the scheduled patching page and the last two from the dynamic scope overview. Smaller values apply to some sovereign clouds.

## Window behavior

Use a window that fits the work. Learn gives a 3-hour example starting at 3:00 PM:

- A service pack needs 20 minutes left, or it is skipped. It must finish by 5:40 PM.
- Other updates need 15 minutes left. Deadline 5:45 PM.
- A reboot needs 10 minutes left. Start it by 5:50 PM.
- After a reboot, Update Manager waits at most 15 minutes for Azure VMs and 25 minutes for Arc servers before it marks the reboot failed.

Also note that registry keys for automatic updates and restarts can cause a reboot even when the schedule says Never Reboot. VMs in one availability set are not updated at the same time, so a large set can miss the window. Learn suggests a longer window or splitting such machines across schedules.

## Check the result

Open **History** in Azure Update Manager to see runs, or open the deployment history by maintenance run ID. The scheduled patching page also includes an Azure Resource Graph based script that lists the machines assigned to a configuration.

## Typical mistakes

- Leaving Azure VMs on a patch mode that does not follow your schedule.
- One huge schedule where one slow service pack ends the window.
- Treating the preview as the final list.

## Related

- [Azure Update Manager](https://www.m365.fm/entity/azure-update-manager/)
- [Azure Arc](https://www.m365.fm/entity/azure-arc/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Azure Update Manager overview (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/update-manager/overview)
- [Schedule recurring updates in Azure Update Manager (Microsoft Learn)](https://learn.microsoft.com/azure/update-manager/scheduled-patching)
- [About dynamic scoping (Microsoft Learn)](https://learn.microsoft.com/azure/update-manager/dynamic-scope-overview)
- [Manage a dynamic scope (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/update-manager/manage-dynamic-scoping)
