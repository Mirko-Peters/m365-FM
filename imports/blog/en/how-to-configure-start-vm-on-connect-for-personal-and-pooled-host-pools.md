---
title: "How to configure Start VM on Connect for personal and pooled host pools"
summary: "Assign the Desktop Virtualization Power On Contributor role to the Azure Virtual Desktop service principal or a managed identity, then set Start VM on connect to Yes in the host pool's properties. Test with a deallocated host and add a deallocation mechanism, because the feature only starts VMs."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-start-vm-on-connect, azure-virtual-desktop]
keypoints:
  - "Two things are required: a role assignment that lets Azure Virtual Desktop power on the VMs, and the Start VM on connect setting on an existing host pool."
  - "The role is Desktop Virtualization Power On Contributor, assigned to the Azure Virtual Desktop service principal or a host pool managed identity at a scope that contains the host pool and its session host VMs."
  - "Names of the host pool, its session hosts and the resource group may contain only ANSI characters."
  - "The setting is per host pool, so test it on one pool first. You can set it in the Azure portal, Azure PowerShell or Azure CLI, but not while you create a new host pool."
  - "Test a deallocated host for each pool type you run, and plan separately what deallocates the VMs afterwards."
faq:
  - q: "Which role does Start VM on Connect need, and who gets it?"
    a: "Microsoft Learn says to assign the Desktop Virtualization Power On Contributor role to the Azure Virtual Desktop service principal, or to a managed identity assigned to the host pool, at a scope that contains the host pool and the session host VMs. The person who configures the setting needs the Desktop Virtualization Host Pool Contributor role."
  - q: "Can I enable it when I create the host pool?"
    a: "Learn's configuration page says no: you can only configure Start VM on Connect on existing host pools, which are associated with an application group and a workspace. Create the host pool first, then open its properties."
  - q: "Does the setting start VMs that I connect to by RDP directly?"
    a: "No. Learn says that connecting to a powered-off session host outside the Azure Virtual Desktop service, for example by IP address or name, does not start the VM."
---

To configure Start VM on Connect, give the Azure Virtual Desktop service principal (or a managed identity on the host pool) the Desktop Virtualization Power On Contributor role, then set **Start VM on connect** to **Yes** in the host pool's properties. The steps are the same for personal and pooled host pools; what differs is what you test. The sources are Microsoft Learn pages retrieved on 17 November 2026. Learn last updated the main page on 1 September 2026.

How the feature behaves, why it saves cost and what the pooled start rules mean are in "Start VM on Connect in Azure Virtual Desktop: how it saves cost". This article is the procedure.

## Prerequisites

From Learn's configuration page:

- An existing host pool that is associated with an application group and a workspace.
- An Azure account with the Desktop Virtualization Host Pool Contributor role, which Learn lists for configuring the setting.
- A test user assigned to a desktop or application in the application group, with Windows App or the Remote Desktop app on a local device.
- Names of the host pool, its session hosts and the resource group that contain only ANSI characters.
- For PowerShell or CLI: the `Az.DesktopVirtualization` module or the `desktopvirtualization` Azure CLI extension, or Azure Cloud Shell.

For the role assignment itself you need permission to create it. Learn's autoscale page, which describes the same kind of assignment, names `Microsoft.Authorization/roleAssignments/write` and says Owner and User Access Administrator include it. The Start VM on Connect page does not state this permission, so check what your own account has.

## Step 1: assign the Power On Contributor role

Learn says this assignment allows Azure Virtual Desktop to power on VMs, check their status and report diagnostic information. The role description on the RBAC page is "used to allow the Azure Virtual Desktop Resource Provider to start virtual machines". Assign *Desktop Virtualization Power On Contributor* to either the Azure Virtual Desktop service principal or a managed identity assigned to the host pool, for every host pool and set of session host VMs you want to use with the feature.

**Scope.** Learn's tip says subscription scope is recommended for environments with several host pools or a subscription dedicated to Azure Virtual Desktop, because one assignment covers everything. Lower scopes also work, as long as the assignment scope contains the target session host VMs. Learn calls older guidance that anything below the subscription breaks the feature technically incorrect. Do not carry this over to autoscale: for its own role, Desktop Virtualization Power On Off Contributor, Learn says the subscription is the assignable scope, and that assigning it at any lower level, such as the resource group, host pool or VM, prevents autoscale from working properly.

**Service principal in the Azure portal** (Learn's service principal page):

1. Open **Microsoft Entra ID**. On **Overview**, use **Search your tenant** and enter the application ID `9cdead84-a844-4324-93f2-b2e6bb768d07`.
2. Select the enterprise application named *Azure Virtual Desktop* or *Windows Virtual Desktop*. Note its name and object ID.
3. Search for **Subscriptions** and select the target subscription.
4. Select **Access control (IAM)**, then **+ Add**, then **Add role assignment**.
5. Select **Desktop Virtualization Power On Contributor** and **Next**.
6. Set **Assign access to** to **Microsoft Entra user, group, or service principal**, select **Select members**, enter the application name and select it. If two entries share the name, select both, then remove the one whose object ID does not match the one you noted.
7. Select **Next**, then **Review + assign**.

**Managed identity alternative.** Learn lists Start VM on Connect among the features that can use a managed identity on a host pool. Learn's "What's new in Azure Virtual Desktop" lists "Managed identity support is now generally available" under September 2026, and says that in a future service update, host pools configured with a session host configuration will require a managed identity to add session hosts. The configuration page adds that this replaces reliance on the Azure Virtual Desktop service principal. Some Learn pages may still show older preview wording, so check the page you follow. A system-assigned identity is tied to the host pool; a user-assigned identity is an independent resource. Learn's managed identity page (updated 24 September 2026) gives these portal steps:

1. Search for **Azure Virtual Desktop**, select **Host pools**, then select the host pool.
2. Select **Identity** and select **Assign a Managed Identity**.
3. Choose **System assigned managed identity**, or **User assigned managed identity** and then the subscription and the existing identity.
4. Select **Save**.

You need Desktop Virtualization Host Pool Contributor at the host pool scope or higher; for a user-assigned identity you also need Managed Identity Operator at the identity's scope or higher. Then assign Desktop Virtualization Power On Contributor to that identity at a scope that contains the host pool and its session host VMs, using Azure's general role assignment steps. Learn's Start VM on Connect page does not give separate steps for that assignment, so confirm the result in **Access control (IAM)**. Both the service principal and a managed identity are documented options for this role assignment; because Learn says a managed identity will be required for host pools with a session host configuration, plan for it if you create or update such pools.

## Step 2: enable Start VM on connect

In the Azure portal (Learn's steps):

1. Search for **Azure Virtual Desktop** and select it.
2. Select **Host pools**, then the host pool.
3. Select **Properties**.
4. In the configuration section, set **Start VM on connect** to **Yes**, or **No** to disable it.
5. Select **Save**.

The setting applies to the one host pool you edit, so repeat the steps for each pool.

**Azure PowerShell and Azure CLI.** The parameters below come from the reference pages:

- `Update-AzWvdHostPool` has a `-StartVMOnConnect` switch parameter, described as "The flag to turn on/off StartVMOnConnect feature". The reference has no example that uses it, so the line below is derived from the syntax:

```powershell
Update-AzWvdHostPool -ResourceGroupName <resource-group> -Name <host-pool-name> -StartVMOnConnect
```

- `az desktopvirtualization hostpool update` has `--start-vm-on-connect`, which accepts 0, 1, f, false, n, no, t, true, y and yes. The extension needs Azure CLI 2.55.0 or later. The reference shows the parameter only in its `create` example, not in an `update` example:

```azurecli
az desktopvirtualization hostpool update -g <resource-group> -n <host-pool-name> --start-vm-on-connect true
```

Learn's page says to configure the feature on an existing host pool, even though the `create` command accepts the parameter, so follow the page. Test either command on one host pool and read the value back in the portal before you script it.

## Step 3: test each pool type

Deallocate a session host first, so the test starts from a powered-off VM. Learn's FAQ says shutting down from the Start menu does not deallocate it.

**Personal host pool.** Assign a test user to a session host, or use an unassigned host if the pool uses automatic assignment (see [personal host pools](/entity/avd-personal-host-pool/)). Deallocate that VM, then connect as the test user with Windows App. Learn says the client tells the user that a VM is being powered on. Expect the connection to take longer than usual, because the VM must boot.

**Pooled host pool.** Deallocate all session hosts and check the [maximum session limit](/entity/avd-maximum-session-limit/). Connect as the first test user; one VM should start. Fill it to its limit with test sessions and connect once more to see the next VM start. Learn says that for pooled host pools Start VM on Connect starts a VM every five minutes at most, so wait at least five minutes after the first start before the connection that should start the second VM. If a user connects inside that window and no resources are available, no new VM starts and the user gets **No resources available**; Learn tells them to wait a few minutes and try again. That is expected behavior, not a misconfiguration. The wider pooled start rules are in the explainer article, and a low session limit keeps the test short.

## Step 4: decide what deallocates the VMs

Start VM on Connect does not turn VMs off. Learn's FAQ says VMs are not deallocated when users stop using them and that signing users out does not deallocate them. It points to [autoscale](/entity/avd-scaling-plan/) for pooled and personal host pools, and the ramp-up tab of a personal scaling plan schedule has its own **Start VM on Connect** option, which Learn highly recommends enabling if you choose not to start session hosts during ramp-up. The Start VM on Connect page does not explain how that option relates to the host pool property, so check both after you enable the feature.

Without autoscale, the FAQ (page dated 20 June 2025) describes a two-part approach. First, on the VM, open the Group Policy Editor and go to **Local Computer Policy > Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Session Time Limits**. Set **Set time limit for disconnected sessions** to **Enabled**, then select **End a disconnected session** with a limit greater than five minutes, because a low limit can end sessions when a network connection drops for a while. Second, deallocate the VMs with Azure automation scripts.

## Settings at a glance

| Item | Value |
|---|---|
| Portal setting | **Start VM on connect** under host pool **Properties** |
| Scope of the setting | One host pool |
| Role for the service principal or managed identity | Desktop Virtualization Power On Contributor |
| Role for the person who changes the setting | Desktop Virtualization Host Pool Contributor |
| Where it works | Session hosts on Azure and on Azure Local, personal or pooled |

## Troubleshooting

- **VM does not power on.** Learn says to check the health of the VM first. Then review Azure Virtual Desktop logs in Log Analytics, note the exact error name and use Insights for suggestions.
- **Direct RDP does not start the VM.** This is expected, per Learn.
- **Second connection starts no VM.** On a pooled host pool, this is expected if less than five minutes passed since the last start; Learn says users then get **No resources available**.
- **Own checklist, not from Learn.** If the role assignment looks right but nothing starts, confirm that the assignment scope contains the VM, that the assignment names the service principal whose object ID you noted in step 1, and that the host pool, session host and resource group names contain only ANSI characters, which Learn lists as a prerequisite.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Configure Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Start VM on Connect FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect-faq)
- [Microsoft Learn: Configure managed identity in Azure Virtual Desktop](https://learn.microsoft.com/en-ie/azure/virtual-desktop/configure-managed-identity)
- [Microsoft Learn: What's new in Azure Virtual Desktop (September 2026)](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-principal-assign-roles)
- [Microsoft Learn: Azure RBAC roles for Azure Virtual Desktop (rbac page)](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and schedules](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scaling-plan)
- [Microsoft Learn: Update-AzWvdHostPool](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdhostpool)
- [Microsoft Learn: az desktopvirtualization hostpool](https://learn.microsoft.com/en-us/cli/azure/desktopvirtualization/hostpool)
