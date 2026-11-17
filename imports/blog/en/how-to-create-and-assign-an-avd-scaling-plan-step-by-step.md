---
title: "How to create and assign an AVD scaling plan step by step"
summary: "In the Azure portal, you create an Azure Virtual Desktop scaling plan under Azure Virtual Desktop, then Scaling Plans, then Create, after giving the service one role at subscription level. Then you define the schedule phases and assign the plan to host pools of the same type."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-scaling-plan, azure-virtual-desktop]
keypoints:
  - "Before the plan works, set a custom MaxSessionLimit on pooled host pools and assign Desktop Virtualization Power On Off Contributor at subscription level. Dynamic autoscaling additionally needs Desktop Virtualization Virtual Machine Contributor."
  - "Each schedule has four phases: ramp-up, peak hours, ramp-down and off-peak hours, and a plan can hold several schedules. Capacity threshold and minimum percentage of hosts drive power decisions."
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

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. This article follows power management.

Two rules apply to every plan. A host pool can have only one scaling plan, while one plan can serve several host pools of the same type. Autoscale cannot run on the same host pool as the Azure Automation and Azure Logic Apps scaling script, and Learn says not to combine it with other Microsoft or third-party scaling tools: disable those on the host pools you assign.

See also [Azure Virtual Desktop](/entity/azure-virtual-desktop/) and [AVD host pool](/entity/avd-host-pool/).

## Prerequisites

1. **Region.** The scaling plan configuration data must be stored in the same Azure region as the host pool configuration.
2. **MaxSessionLimit.** For pooled host pools, set a custom **MaxSessionLimit** in the host pool settings. Learn says not to use the default value. You can also set it with `New-AzWvdHostPool` or `Update-AzWvdHostPool`.
3. **Permissions.** You need the `Microsoft.Authorization/roleAssignments/write` permission on your subscriptions. It is part of the built-in **User Access Administrator** and **Owner** roles. See [Azure RBAC](/entity/azure-rbac/).
4. **PowerShell (only if you script it instead of the portal).** Learn lists the Az.DesktopVirtualization module, version 4.2.0 or later, for power management plans, with `New-AzWvdScalingPlan` and `New-AzWvdScalingPlanPooledSchedule` or `New-AzWvdScalingPlanPersonalSchedule`.
5. **Hibernation (personal host pools only).** To let personal desktops hibernate, enable hibernation on the session hosts. FSLogix and App Attach do not support hibernate, so do not enable it for personal host pools that use them. See [FSLogix](/entity/fslogix/).

## Step 1: Assign the role to the service

First find the service principal's object ID, as Learn's page on the AVD service principals describes:

- In the Azure portal, open **Microsoft Entra ID**. On the Overview page, enter the application ID `9cdead84-a844-4324-93f2-b2e6bb768d07` under **Search your tenant**.
- Select the matching enterprise application, **Azure Virtual Desktop** or **Windows Virtual Desktop**. Under properties, note its name and object ID. The object ID corresponds to the application ID and is unique to your tenant.

Then assign the role:

1. In the Azure portal, search for **Subscriptions** and open the subscription.
2. Select **Access control (IAM)**, then **Add**, then **Add role assignment**.
3. On the **Role** tab, select **Desktop Virtualization Power On Off Contributor**.
4. On the **Members** tab, select the Azure Virtual Desktop service principal (**User, group, or service principal**), or a managed identity assigned to your host pool (**Managed identity**). Entries ending in "Client" or "ARM Provider" are different principals. If you get two entries with the same name, select both for now, then remove the entry whose object ID does not match the one you noted.
5. Select **Review + assign**. Repeat for every subscription with host pools to scale.

Learn says that a scope below the subscription, such as a resource group, host pool or VM, prevents autoscale from working properly.

Dynamic autoscaling additionally needs **Desktop Virtualization Virtual Machine Contributor** at the same scope, which lets the resource provider create, delete, update, start and stop VMs. Power management does not.

## Step 2: Create the plan (Basics tab)

1. Sign in to the Azure portal and search for **Azure Virtual Desktop**.
2. Select **Scaling Plans**, then **Create**.
3. On the **Basics** tab, fill in these fields:
   - **Subscription**, **Resource group** and **Scaling plan name**, for example `sp-pooled-weekday-westeurope`.
   - **Location**: the plan's Azure region (see prerequisite 1). **Time zone**: the time zone to use with your plan.
   - **Host pool type**: **Pooled** or **Personal**. The type cannot be changed after the plan is created.
   - **Exclusion tag**: a tag name for hosts autoscale must leave alone, for example `excludeFromScaling`.
   - **Scaling method** (pooled only): **Power management autoscaling**.

If you add the exclusion tag to a session host, autoscale does not start it, stop it or change its drain mode. Tagged hosts still count toward the minimum percentage of hosts.

## Step 3: Define the schedule

On the **Schedules** tab, select **Add schedule**, enter a **Schedule name** and choose the days under **Repeat on**. Each schedule has four phases, each with its own tab: ramp-up, peak hours, ramp-down and off-peak hours. The start time of a phase is also the end time of the previous one. A plan can hold more than one schedule.

### Pooled host pools

The portal pre-fills suggested weekday values, which you can change.

- **Ramp up:** start time, load balancing algorithm (Learn recommends breadth-first), minimum percentage of hosts, capacity threshold.
- **Peak hours:** start time and algorithm. The capacity threshold carries over from ramp-up.
- **Ramp-down:** start time, algorithm, minimum percentage of hosts, capacity threshold and **Force logoff**. With force logoff on, set the wait time. With it off, select **VMs have no active or disconnected sessions** or **VMs have no active sessions**. Forced sign-out happens only in ramp-down.
- **Off-peak hours:** start time and algorithm (Learn recommends depth-first). The capacity threshold carries over from ramp-down.

The algorithm in the schedule overrides the one in the host pool settings. The articles "Power management autoscaling in Azure Virtual Desktop: what it does and when to use it" and "Ramp-up, peak, ramp-down and off-peak: the four AVD autoscale phases explained" explain how the threshold and the minimum percentage drive power decisions.

### Personal host pools

On the **Ramp up** tab you set the start time, **Start VM on Connect** (Learn highly recommends it if you do not start session hosts during ramp-up), **VMs to start** (**Assigned VMs only**, **Assigned and unassigned VMs**, or **Don't turn VMs on at start time**), and the disconnect and sign-out timers (0 to 360 minutes, with the action deallocate, hibernate or do nothing). The other phases offer the same settings except **VMs to start**.

### Example: weekday and weekend schedules

These values are an example, not Learn defaults. A pooled plan has a schedule named **Weekdays**, repeating Monday to Friday: ramp-up 07:00, peak hours 09:00, ramp-down 17:00, off-peak 19:00. Learn says that the last off-peak parameters on the selected days carry over to unselected days until the next ramp-up, so with this schedule alone the Friday off-peak settings run until Monday 07:00. A second schedule named **Weekend**, repeating Saturday and Sunday, with ramp-up 09:00, peak hours 10:00, ramp-down 14:00, off-peak 16:00 and a lower minimum percentage of hosts, lets weekend traffic follow its own curve.

## Step 4: Assign the plan to host pools

1. Open the **Host pool assignments** tab.
2. Select the check box for each host pool the plan should control.
3. Optionally add tags, then select **Review + create** and **Create**.

You can only assign a plan to host pools whose type matches the type chosen in the plan. If you do not want to enable autoscale yet, leave all check boxes unselected and assign pools later. Changes to a plan that is already assigned to host pools apply immediately.

To assign pools later, open **Azure Virtual Desktop**, then **Scaling plans**, select the plan, and under **Manage** select **Host pool assignments**, then **+ Assign**, select the host pools and select **Assign**. The host pools must be in the same Azure region as the plan.

## Step 5: Optional time limit policy

Disconnected sessions count toward used capacity. Learn describes a time limit policy that signs out disconnected users after a set time; the autoscale FAQ suggests 15 to 30 minutes, completed before ramp-down ends. Use one of two routes.

- **[Intune](/entity/intune/):** the account needs the **Policy and Profile manager** role. In the Microsoft Intune admin center, create or edit a configuration profile for **Windows 10 and later** with profile type **Session Time Limits**. In the settings picker go to **Administrative templates**, **Windows Components**, **Remote Desktop Services**, **Remote Desktop Session Host**, **Session Time Limits**, select **Set time limit for disconnected sessions**, set it to **Enabled** and choose a time value. Assign the profile to a group containing the session hosts, create it, and restart the computers after the policy applies.
- **Group Policy:** you need a domain account that can create or edit Group Policy objects and a group or OU containing the hosts. In the Group Policy Management console, create or edit a policy that targets the hosts, go to **Computer Configuration**, **Policies**, **Administrative Templates**, **Windows Components**, **Remote Desktop Services**, **Remote Desktop Session Host**, **Session Time Limits**, open **Set time limit for disconnected sessions**, select **Enabled**, choose a time value and select **OK**. Restart the hosts.

The prerequisites page says that hosts joined to Microsoft Entra Domain Services cannot be managed with Intune, and that Windows Server hosts with Microsoft Entra join cannot be enrolled in Intune. Use Group Policy for those.

## Verification

A suggested test, not a Learn requirement: Tag one test host and confirm that autoscale leaves its power state and drain mode alone.

To see what autoscale did, enable diagnostics: in the Azure portal open **Azure Virtual Desktop**, **Scaling plans**, select the plan, then **Diagnostic Settings** and **Add diagnostic setting**. Enter a name for the diagnostic setting, select **Autoscale logs** and choose **Archive to a storage account** or **Stream to an event hub**, and select **Save**. The storage account must be in the same region as the plan, and the logs appear in the `insight-logs-autoscaling` container. For pooled host pools, Learn recommends the autoscale data integrated with [Insights](/entity/avd-insights/) in Azure Virtual Desktop for a more complete view.

## Known limits

- Autoscale overwrites drain mode for pooled host pools. Use exclusion tags when you update VMs.
- Autoscale cannot ramp down on specific dates such as holidays, does not consider availability zones and cannot be configured with Azure CLI (autoscale FAQ).
- Learn recommends autoscale for session hosts deployed with Azure Virtual Desktop Azure Resource Manager templates or first-party Microsoft tools. Pooled autoscale does not turn off session hosts in the ramp-up phase.

## Sources

Retrieved 2026-11-17.

- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Autoscale FAQ for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Enable diagnostics for Autoscale scaling plans](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-diagnostics)
- [Microsoft Learn: Assign Azure roles using the Azure portal](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments-portal)
- [Microsoft Learn: Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-principal-assign-roles)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Set up scaling of session hosts using Azure Automation and Azure Logic Apps](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-scaling-script)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
