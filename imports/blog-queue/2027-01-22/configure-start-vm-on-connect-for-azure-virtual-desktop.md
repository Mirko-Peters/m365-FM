---
title: "Configure Start VM on Connect for Azure Virtual Desktop"
summary: "Start VM on Connect powers on deallocated session hosts when a user connects, so you pay for compute only when needed. Prerequisites, the Power On Contributor role and its scope, enabling it in the portal, PowerShell or CLI, pooled versus personal behavior and troubleshooting."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [azure-virtual-desktop, azure-rbac, managed-identity]
keypoints:
  - "Start VM on Connect lets users power on session host VMs only when needed. It is configured per host pool, on Azure or Azure Local, personal or pooled."
  - "You can only enable it on an existing host pool that has an application group and a workspace, not while creating the pool."
  - "The Desktop Virtualization Power On Contributor role must go to a managed identity or the Azure Virtual Desktop service principal, at a scope that contains the host pool and session host VMs."
  - "Pooled host pools start a VM when none are on, and then only when the first VM reaches its session limit, at most one VM every five minutes."
  - "Connecting directly to a powered off VM by IP address or name outside the Azure Virtual Desktop service does not start it."
faq:
  - q: "What does Start VM on Connect do?"
    a: "According to Microsoft Learn, it reduces costs by letting end users power on the VMs used as session hosts only when they are needed, so you can power them off when they are not. The connection takes longer when the VM is deallocated, because the VM needs time to start, like turning on a physical computer. Windows App and the Remote Desktop app tell the user that a VM is being powered on."
  - q: "Which role does it need and where do I assign it?"
    a: "Assign the Desktop Virtualization Power On Contributor role to a managed identity assigned to the host pool or to the Azure Virtual Desktop service principal. Learn says the scope must contain the host pool and session host VMs. A subscription scope is recommended for environments with several host pools or a dedicated subscription, but lower scopes also work if they contain the target session hosts."
  - q: "How does it behave in pooled and personal host pools?"
    a: "For personal host pools it powers on an existing session host VM that is already assigned or can be assigned to the user. For pooled host pools it powers on a VM only when none are turned on, and more VMs only when the first VM reaches the session limit. Learn adds that for pooled pools it starts a VM every five minutes at most."
  - q: "What do users see if no VM is available during the wait?"
    a: "If other users try to sign in during the five minute period and there are still no available resources, no new VM is started, and users get the error No resources available. Learn says they should wait a few minutes and try again."
  - q: "What should I check when the VM does not power on?"
    a: "Learn says to check the health of the VM you tried to power on first. You can also view Azure Virtual Desktop logs in Log Analytics, note the error name from any error message, and use Azure Virtual Desktop Insights for suggestions. Also make sure the host pool, session host and resource group names contain only ANSI characters."
---

Start VM on Connect is a host pool setting for Azure Virtual Desktop. Per Microsoft Learn, it lets users power on the virtual machines used as session hosts only when they are needed, so you can keep them off otherwise and save cost. This article covers the prerequisites, the role assignment, three ways to enable it, how pooled and personal host pools behave, and what to check when it does not work.

## How it behaves

- **Personal host pools:** it powers on an existing session host VM that is already assigned or can be assigned to a user.
- **Pooled host pools:** it powers on a VM only when none are turned on. More VMs are turned on only when the first VM reaches the session limit.
- **Connection time:** connecting to a deallocated session host takes longer, because the VM must start. Users of Windows App and the Remote Desktop app are told a VM is being powered on.
- **Scope of the setting:** it works for session hosts on Azure and Azure Local, in personal or pooled host pools, and is configured per host pool.

## Prerequisites

From the Learn page:

- An existing host pool associated with an application group and workspace. You cannot enable the setting while you create a new host pool.
- An Azure account with the Desktop Virtualization Host Pool Contributor role to configure the setting.
- Windows App or the Remote Desktop app on a local device, with a user assigned to a desktop or application in the application group, to test.
- Only ANSI characters in the names of the host pool, the session hosts and the resource group.
- For PowerShell or CLI, the Az.DesktopVirtualization module or the desktopvirtualization CLI extension, or Azure Cloud Shell.

## Step 1: Assign the Power On Contributor role

Assign the **Desktop Virtualization Power On Contributor** role to a managed identity assigned to your host pool, or to the Azure Virtual Desktop service principal, at a scope that contains the host pool and the session host VMs. The role lets Azure Virtual Desktop power on VMs, check their status and report diagnostic information. You need this assignment for every host pool and session host VM you want to use with the feature.

Two details from the pages:

- Learn says earlier guidance that a role assignment below subscription scope prevents Start VM on Connect from working was technically incorrect. The subscription scope is recommended for environments with multiple host pools or a subscription dedicated to Azure Virtual Desktop, since one assignment simplifies management. Lower scopes can meet security requirements if the scope contains the target session host VMs.
- Managed identity (a system-assigned identity tied to the host pool, or a user-assigned identity usable across host pools) is available for host pools on Azure. The Azure Virtual Desktop service principal is available for host pools on Azure and Azure Local.

### Assign the role to the service principal in the portal

The service principal article describes this path. To assign it you need `Microsoft.Authorization/roleAssignments/write` on the subscription, which is part of the Owner and User Access Administrator built-in roles.

1. In the Azure portal, open **Microsoft Entra ID** and search your tenant for the application ID `9cdead84-a844-4324-93f2-b2e6bb768d07`. Depending on when you registered the Microsoft.DesktopVirtualization resource provider, the entry is named Azure Virtual Desktop or Windows Virtual Desktop.
2. Note the name and the object ID. If two entries share the name, the object ID tells you which one is correct.
3. Go to **Subscriptions**, select the subscription, then **Access control (IAM)** > **Add** > **Add role assignment**.
4. Select the Desktop Virtualization Power On Contributor role, then assign access to a Microsoft Entra user, group, or service principal and select the application.
5. Select **Review + assign**.

The service principal article also shows PowerShell and CLI examples. Its sample uses a different role (Desktop Virtualization Power On Off Contributor) to illustrate the commands, so use the role named on the Start VM on Connect page for this feature. For managed identities, that article points to the general Azure RBAC pages for portal, PowerShell and CLI.

## Step 2: Enable the setting

### Azure portal

1. Sign in to the Azure portal and open **Azure Virtual Desktop**.
2. Select **Host pools** and the host pool.
3. Select **Properties**.
4. Set **Start VM on connect** to **Yes** (or **No** to disable it).
5. Select **Save**.

### Azure PowerShell

```azurepowershell
Update-AzWvdHostPool -ResourceGroupName <resourcegroupname> -Name <hostpoolname> -StartVMOnConnect:$true
```

Use `$false` to disable it.

### Azure CLI

```azurecli
az desktopvirtualization hostpool update \
     --resource-group $resourceGroupName \
     --name $hostPoolName \
     --start-vm-on-connect true
```

Use `false` to disable it.

## Pooled host pools: the five minute rule

Learn says that for pooled host pools, Start VM on Connect starts a VM every five minutes at most. If other users try to sign in during that period and there are still no available resources, it does not start another VM. These users get the message **No resources available** and should wait a few minutes and try again.

## Troubleshooting

Learn gives a short order:

1. If the session host VM does not power on, check the health of that VM first.
2. View Azure Virtual Desktop logs in Log Analytics to look for problems.
3. If an error appears, read the message and note the error name.
4. Use Azure Virtual Desktop Insights for suggestions on how to resolve issues.

One more note from the page: if you connect to a powered off session host outside the Azure Virtual Desktop service, for example directly by IP address or name, the VM is not started.

## Checks I would add (my advice)

This is my suggestion, not a Microsoft procedure:

1. Confirm the role assignment first. If the feature never starts any VM, check that the right principal (managed identity or the service principal with the correct application ID) holds the role at a scope that contains the VM and its host pool.
2. Test with one user and one deallocated VM before you tell users to expect it.
3. Tell users that the first sign-in after hours takes longer, and what the app message means, so they do not open tickets.
4. Remember that it is a start-on-demand setting only. Powering VMs off again is a separate task, for example with a scaling plan.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Azure role-based access control (Azure RBAC)](https://www.m365.fm/entity/azure-rbac/)
- [Managed identity](https://www.m365.fm/entity/managed-identity/)

## Sources

- [Configure Start VM on Connect for Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/start-virtual-machine-connect)
- [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/service-principal-assign-roles)
