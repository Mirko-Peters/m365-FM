---
title: "How to create and assign an AVD scaling plan step by step"
summary: "You create an Azure Virtual Desktop scaling plan under Azure Virtual Desktop, then Scaling Plans, then Create, after giving the service one role at subscription level. Then you define the schedule phases and assign the plan to host pools of the same type."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [avd-scaling-plan, azure-virtual-desktop]
keypoints:
  - "Before the plan works, set a custom MaxSessionLimit on pooled host pools and assign Desktop Virtualization Power On Off Contributor at subscription level (the Learn page lists a second role for dynamic autoscaling)."
  - "A plan has up to four phases per schedule: ramp-up, peak hours, ramp-down and off-peak hours. Capacity threshold and minimum percentage of hosts drive power decisions."
  - "A plan applies only to host pools of its own type, and each host pool can have only one scaling plan."
  - "Changes to a plan that is already assigned take effect immediately. As a suggestion, not a Learn requirement, test with the exclusion tag first."
faq:
  - q: "Which role does autoscale need and where is it assigned?"
    a: "Microsoft Learn names Desktop Virtualization Power On Off Contributor. It is assigned to the Azure Virtual Desktop service principal or to a managed identity assigned to the host pool, with the subscription as the assignable scope. Learn says that a lower scope, such as a resource group, host pool or VM, prevents autoscale from working properly."
  - q: "Can one scaling plan cover several host pools?"
    a: "Yes. Microsoft Learn says one plan can be assigned to multiple host pools of the same type, but each host pool can have only one scaling plan. The plan and the host pools must be in the same Azure region for assignment from the plan's Host pool assignments page."
  - q: "Can I use autoscale together with the Azure Automation scaling script?"
    a: "No. Microsoft Learn says you cannot use autoscale and scaling with Azure Automation and Azure Logic Apps on the same host pool. You must use one or the other."
---

To create an Azure Virtual Desktop scaling plan, assign the **Desktop Virtualization Power On Off Contributor** role at subscription level, open **Azure Virtual Desktop**, select **Scaling Plans**, then **Create**, and define a schedule. Finally, assign the plan to host pools of the same type on the **Host pool assignments** tab. This article covers the power management method, which is generally available.

## What a scaling plan does

An [AVD scaling plan](/entity/avd-scaling-plan/) scales the session host virtual machines of a host pool up or down on a schedule to reduce deployment cost. Microsoft Learn describes two methods:

- **Power management autoscaling** powers existing session hosts on and off. It is generally available in Azure and Azure Government.
- **Dynamic autoscaling** also creates and deletes session hosts. It works only for pooled host pools with session host configuration and is not supported in Azure Government.

Status of dynamic autoscaling: the scenarios and glossary pages label it preview, and the create page requires a preview build of the Az.DesktopVirtualization module (5.4.2-preview or later). The What's new page lists it as preview in November 2024 and as "now available" in June 2026, without a general availability label. No Learn page calls it generally available. Check the current pages before relying on it. This article follows power management.

Two rules apply to every plan. A host pool can have only one scaling plan, while one plan can serve several host pools of the same type. Autoscale cannot run on the same host pool as the Azure Automation and Azure Logic Apps scaling script.

See also [Azure Virtual Desktop](/entity/azure-virtual-desktop/) and [AVD host pool](/entity/avd-host-pool/).

## Prerequisites

1. **Region.** The scaling plan configuration data must be stored in the same Azure region as the host pool configuration.
2. **MaxSessionLimit.** For pooled host pools, set a custom **MaxSessionLimit** in the host pool settings. Learn says not to use the default value. You can also set it with `New-AzWvdHostPool` or `Update-AzWvdHostPool`.
3. **Permissions.** You need the `Microsoft.Authorization/roleAssignments/write` permission on your subscriptions. It is part of the built-in **User Access Administrator** and **Owner** roles. See [Azure RBAC](/entity/azure-rbac/).
4. **PowerShell (only if you script it).** Learn lists the Az.DesktopVirtualization module, version 4.2.0 or later, for power management plans.
5. **Hibernation (personal host pools only).** To let personal desktops hibernate, enable hibernation on the session hosts. FSLogix and App Attach do not support hibernate, so do not enable it for personal host pools that use them. See [FSLogix](/entity/fslogix/).

## Step 1: Assign the role to the service

The scaling plan page does not describe the clicks; they follow the Azure RBAC article on assigning roles in the portal:

1. In the Azure portal, search for **Subscriptions** and open the subscription.
2. Select **Access control (IAM)**, then **Add**, then **Add role assignment**.
3. On the **Role** tab, select **Desktop Virtualization Power On Off Contributor**.
4. On the **Members** tab, select the Azure Virtual Desktop service principal (**User, group, or service principal**), or a managed identity assigned to your host pool (**Managed identity**). The service principal is named "Azure Virtual Desktop" or "Windows Virtual Desktop" (depending on when the resource provider was registered) and has the application ID `9cdead84-a844-4324-93f2-b2e6bb768d07`. Entries ending in "Client" or "ARM Provider" are different principals. If two entries share the name, keep the one whose object ID matches the application ID search in your tenant.
5. Select **Review + assign**. Repeat for every subscription with host pools you want to scale.

Learn says that a scope below the subscription, such as a resource group, host pool or VM, prevents autoscale from working properly.

The Learn page lists a second role, **Desktop Virtualization Virtual Machine Contributor**, in the permissions section that precedes the dynamic scaling plan steps. Learn describes it as allowing the resource provider to create, delete, update, start and stop virtual machines.

## Step 2: Create the plan (Basics tab)

1. Sign in to the Azure portal and search for **Azure Virtual Desktop**.
2. Select **Scaling Plans**, then **Create**.
3. On the **Basics** tab, fill in these fields:
   - **Subscription**, **Resource group** and **Scaling plan name**, for example `sp-pooled-weekday-westeurope`.
   - **Location**: must match the host pool region. **Time zone**: the plan operates only in this time zone.
   - **Host pool type**: **Pooled** or **Personal**.
   - **Exclusion tag**: a tag name for hosts autoscale must leave alone, for example `excludeFromScaling`.
   - **Scaling method** (pooled only): **Power management autoscaling**.

If you add the exclusion tag to a session host, autoscale does not start it, stop it or change its drain mode. Tagged hosts still count toward the minimum percentage of hosts. Keep personal data out of the tag.

## Step 3: Define the schedule

On the **Schedules** tab, select **Add schedule**, enter a **Schedule name** and choose the days under **Repeat on**. Then complete the four phases: ramp-up, peak hours, ramp-down and off-peak hours. The start time of a phase is also the end time of the previous one. "Ramp-up, peak, ramp-down and off-peak: the four AVD autoscale phases explained" covers every parameter.

### Pooled host pools

- **Ramp-up:** start time, load balancing algorithm (Learn recommends breadth-first), minimum percentage of hosts, capacity threshold.
- **Peak hours:** start time and algorithm (breadth-first or depth-first). The ramp-up capacity threshold carries over.
- **Ramp-down:** start time, algorithm (the autoscale FAQ suggests depth-first), minimum percentage of hosts, capacity threshold, force logoff.
- **Off-peak hours:** start time and algorithm (depth-first). The ramp-down capacity threshold carries over.

Autoscale applies the algorithm from the schedule, not the one in the host pool settings.

Two numbers drive the decisions. The capacity threshold compares user sessions with available capacity, which is the number of available session hosts times the maximum session limit. Learn's example: two hosts with 20 sessions each give a capacity of 40; at 75%, a third host starts above 30 sessions. The minimum percentage of hosts is rounded up: 10% of seven hosts keeps one host on.

In ramp-down, **Force logoff** on means autoscale puts the host with the fewest sessions in drain mode, notifies users, signs them out after the wait time and deallocates the VM. With it off, select **VMs have no active or disconnected sessions** or **VMs have no active sessions**, and autoscale waits for users to sign out. A host is shut down only if the remaining hosts can take all sessions without exceeding the capacity threshold. Forced sign-out happens only in ramp-down.

### Example schedule

The following values are an example, not Learn defaults, for a pooled host pool of 10 hosts with a maximum session limit of 10:

- Ramp-up 07:00, breadth-first, minimum 20% of hosts (2 hosts), capacity threshold 60%.
- Peak hours 09:00, breadth-first; the threshold carries over.
- Ramp-down 17:00, depth-first, minimum 10% (1 host), threshold 75%.
- Off-peak hours 19:00, depth-first; the threshold carries over.

Repeat on Monday to Friday, with force logoff on and a 30-minute wait time in ramp-down. With 2 hosts on, capacity is 20 sessions, so the 60% threshold is crossed at 13 sessions and a third host starts.

### Personal host pools

On the **Ramp up** tab you set the start time, **Start VM on Connect** (Learn highly recommends it if you do not start session hosts during ramp-up), **VMs to start** (**Assigned VMs only**, **Assigned and unassigned VMs**, or **Don't turn VMs on at start time**), and the disconnect and sign-out timers (0 to 360 minutes, with the action deallocate, hibernate or do nothing). The other phases offer the same settings except **VMs to start**. Force logoff exists only in the ramp-down phase of pooled schedules; personal schedules use the disconnect and sign-out timers instead.

### Days you do not select

If days are unselected in a schedule, the last off-peak parameters on the selected days carry over to the unselected days until the next ramp-up phase.

## Step 4: Assign the plan to host pools

1. Open the **Host pool assignments** tab.
2. Select the check box for each host pool the plan should control.
3. Optionally add tags, then select **Review + create** and **Create**.

You can only assign a plan to host pools whose type matches the type chosen in the plan. If you do not want to enable autoscale yet, leave all check boxes unselected and assign pools later. Changes to a plan that is already assigned to host pools apply immediately.

To assign pools later, open **Azure Virtual Desktop**, then **Scaling plans**, select the plan, and under **Manage** select **Host pool assignments**, then **+ Assign**, select the host pools and select **Assign**. The host pools must be in the same Azure region as the plan. If you enabled the plan during host pool deployment, you can switch autoscale off for that host pool by clearing **Enable autoscale** in the **Scaling plan** menu of the host pool.

## Step 5: Optional time limit policy

Disconnected sessions still count toward used capacity, so, without force logoff, hosts with only disconnected sessions stay on. Learn describes a time limit policy that signs out disconnected users after a set time; the autoscale FAQ suggests 15 to 30 minutes, completed before ramp-down ends. For [Intune](/entity/intune/): in the Microsoft Intune admin center, create or edit a configuration profile for **Windows 10 and later** with profile type **Session Time Limits**. In the settings picker go to **Administrative templates**, **Windows Components**, **Remote Desktop Services**, **Remote Desktop Session Host**, **Session Time Limits**, select **Set time limit for disconnected sessions**, set it to **Enabled** and choose a time value. Assign the profile to a group containing the session hosts, create it, and restart the computers after the policy applies.

The account needs the **Policy and Profile manager** role.

## Verification

A suggested test, not a Learn requirement: Tag one test host and confirm that autoscale leaves its power state and drain mode alone.

To see what autoscale did, enable diagnostics: in the Azure portal open **Azure Virtual Desktop**, **Scaling plans**, select the plan, then **Diagnostic Settings** and **Add diagnostic setting**. Select **Autoscale logs** and choose **Archive to a storage account** or **Stream to an event hub**, and select **Save**. The storage account must be in the same region as the plan, and the logs appear in the `insight-logs-autoscaling` container.

## Known limits

- Autoscale overwrites drain mode for pooled host pools. Use exclusion tags when you update VMs.
- Autoscale cannot ramp down on specific dates such as holidays, does not consider availability zones and cannot be configured with Azure CLI (autoscale FAQ).

## Sources

Retrieved 2026-11-16.

- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale FAQ for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Enable diagnostics for Autoscale scaling plans](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: Assign Azure roles using the Azure portal](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal)
- [Microsoft Learn: Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-principal-assign-roles)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Set up scaling of session hosts using Azure Automation and Azure Logic Apps](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-scaling-script)
