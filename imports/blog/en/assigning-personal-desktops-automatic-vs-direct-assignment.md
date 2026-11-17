---
title: "Assigning personal desktops: automatic vs direct assignment"
summary: "Personal host pools use either automatic assignment, where a user gets a desktop on first connection, or direct assignment, where an admin ties each user to a named session host. This guide gives the portal, PowerShell and Azure CLI routes for assignment type and user assignment, the multiple-desktop rules and the errors to expect."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-personal-host-pool, avd-host-pool]
keypoints:
  - "Automatic assignment is the default for new personal host pools: the user is assigned a desktop the first time they connect. Direct assignment requires you to assign the user to both the host pool and a specific session host."
  - "With direct assignment, a user who is assigned to the host pool but not to a session host sees 'No resources available'."
  - "Assigning, unassigning and reassigning work in the Azure portal and PowerShell, but not in the Azure CLI. Session host friendly names can be set only with PowerShell."
  - "Multiple personal desktops per user need direct assignment, cannot be switched off once enabled, and need Az.DesktopVirtualization 5.3.0-preview or later when scripted."
  - "Direct assignment must be saved first. Enabling multiple desktops in the same step produces an error."
faq:
  - q: "Can I assign users to specific session hosts when the pool uses automatic assignment?"
    a: "Yes. Microsoft Learn says you can still directly assign a user to a session host before they connect, even if the assignment type is automatic. Users must still be assigned to the host pool so they can see the desktop."
  - q: "What does a user see if they have no session host under direct assignment?"
    a: "The message 'No resources available'. Microsoft Learn says that with direct assignment you must assign the user to both the personal desktop host pool and a specific session host before they can connect."
  - q: "Can I give one user two personal desktops?"
    a: "Yes, but only in a personal host pool with direct assignment. Learn says there is no limit to the number of personal desktops you can assign to a user in a single host pool, and that the setting cannot be disabled once it is turned on."
---

Personal host pools offer two assignment types. With automatic assignment the user gets a session host the first time they connect. With direct assignment an admin assigns each user to a named session host before the user can connect. This guide covers how to choose, how to switch and operate each type, and the limits of the tools involved.

The sibling article "Pooled or personal host pools: a decision guide" lists the portal paths in a compact form. This article adds the prerequisites, the commands, the working scenarios and the order of steps that avoids the documented errors.

## How the two types differ

Learn's [personal desktop assignment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type) describes the types in prose. The table summarises that text:

| | Automatic | Direct |
|---|---|---|
| Default for new personal host pools | Yes | No |
| Session host needed before first connection | No | Yes |
| What happens on first connection | The session is load balanced to a previously unassigned session host and that desktop becomes the user's | The user connects to the session host they were assigned to |

Under automatic assignment, users must first be assigned to the host pool so that they can see the desktop; the portal steps below do this through the application group. Under direct assignment, Learn says you must assign the user to both the host pool and a specific session host. A user who has only the host pool assignment sees the error "No resources available".

When you create the pool, select **Automatic** for the service to assign any personal desktop not already assigned to a user, or **Direct** to assign a specific personal desktop to a user ([host pool creation article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace)). With **Direct** you can also check **Assign multiple desktops to a single user** at that point.

## Which type fits which situation

Learn does not prescribe a type for a scenario. The guidance below is inference from the rules above.

- **Many similar users, no need to control which VM they get.** Automatic needs the least admin work, because you only maintain the application group assignment and keep enough free session hosts.
- **Named VMs with different sizes, images or software.** Direct lets you map a user to a specific host, for example a larger VM for a heavy workload. Under automatic assignment you can also assign a user directly in advance, which gives you a mix.
- **One user needs more than one desktop.** Only direct assignment supports this.
- **You want a predictable failure.** Under direct assignment an unassigned user fails with "No resources available". Under automatic assignment the service picks from available session hosts, so you need to watch how many free hosts remain. The personal desktop assignment page does not say what a user sees when no free host is left, so test it.

## Prerequisites

Learn lists these for the configuration tasks:

- A personal host pool with at least one session host.
- An Azure account with the **Desktop Virtualization Contributor** role or equivalent.
- For local scripting, the `desktopvirtualization` Azure CLI extension or the `Az.DesktopVirtualization` PowerShell module. Azure Cloud Shell is the alternative.
- To assign multiple personal desktops with PowerShell, Az.DesktopVirtualization 5.3.0-preview or later, because the non-preview module does not contain the required values.

## Switch the assignment type

The type is a host pool property. In the Azure portal, open **Azure Virtual Desktop**, then **Host pools**, the personal host pool and **Properties**. Select **Automatic** or **Direct** in the **Assignment** drop-down and select **Save**.

Learn's PowerShell and Azure CLI tabs show the following commands. Replace the `<placeholder>` values, and replace `Direct` with `Automatic` to switch back:

```powershell
$parameters = @{
   ResourceGroupName = '<ResourceGroupName>'
   Name = '<HostPoolName>'
   PersonalDesktopAssignmentType = 'Direct'
}

Update-AzWvdHostPool @parameters
```

```azurecli
az desktopvirtualization hostpool update \
    --resource-group <ResourceGroupName> \
    --name <HostPoolName> \
    --personal-desktop-assignment-type Direct
```

The [Azure CLI reference](https://learn.microsoft.com/en-us/cli/azure/desktopvirtualization/hostpool) lists the parameter with the accepted values Automatic and Direct.

## Assign a user to a session host

Learn says you can do this in the Azure portal or PowerShell, not the Azure CLI. In the portal, open the host pool, select **Application groups**, the application group and **Assignments**, then **+ Add** to add the users or groups. Select **Assign VM** in the information bar, choose the session host and select **Assign**, then pick the user and select **Select**. You can also open **Session hosts**, select the host, then **Assignment** and **Assign user**.

In PowerShell, Learn's command is:

```powershell
$parameters = @{
   HostPoolName = '<HostPoolName>'
   Name = '<SessionHostName>'
   ResourceGroupName = '<ResourceGroupName>'
   AssignedUser = '<UserUPN>'
}

Update-AzWvdSessionHost @parameters
```

The [Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost) reference describes `-AssignedUser` as "User assigned to SessionHost" and `-Force` as the "Force flag to update assign, unassign or reassign personal desktop".

## Unassign and reassign

Both operations are portal and PowerShell only. In the portal, open the host pool and **Session hosts**, select the host's checkbox, then the ellipsis at the end of the row or **Assignment**. Select **Unassign user** and confirm with **Unassign**, or select **Assign to a different user**, choose the user and select **Select**.

Learn's PowerShell tabs call the REST API through `Invoke-AzRestMethod` with an empty or a new `assignedUser` value:

```powershell
$parameters = @{
    Path = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/$hostPoolName/sessionHosts/$($sessionHostName)?api-version=2022-02-10-preview&force=true"
    Payload = @{
        properties = @{
            assignedUser = ''
        }
    } | ConvertTo-Json
    Method = 'PATCH'
}

Invoke-AzRestMethod @parameters
```

For a reassignment, Learn first sets `$reassignUserUpn` to the new user's UPN and then runs the same call with `assigneduser = $reassignUserUpn` in the payload instead of the empty string:

```powershell
$parameters = @{
    Path = "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DesktopVirtualization/hostPools/$hostPoolName/sessionHosts/$($sessionHostName)?api-version=2022-02-10-preview&force=true"
    Payload = @{
        properties = @{
            assigneduser = $reassignUserUpn
        }
    } | ConvertTo-Json
    Method = 'PATCH'
}

Invoke-AzRestMethod @parameters
```

The path contains a preview API version, so test the call against a lab host pool first.

Learn does not describe what happens to the data on the VM when you reassign it. Because Learn says files and settings can persist on the OS disk after sign-out, treat the OS disk as belonging to the previous user and decide in advance whether to clean up or replace the VM.

## Multiple personal desktops per user

Learn says multiple personal desktop assignment lets you assign more than one desktop to one user in a single host pool. It names users who juggle diverse business roles as the use case, for example backend and frontend development, or moving between testing and production environments. It removes the need for several host pools.

Learn's What's new page lists the feature as a preview in March 2025 and as generally available since May 2025. Only the PowerShell module version needed for scripting carries the preview label.

Rules from the page:

- Only personal host pools with direct assignment support it. Pooled pools and automatic assignment do not.
- Once enabled on a host pool, it cannot be disabled.
- There is no limit on the number of personal desktops one user can have in the pool.
- If you use a single FSLogix profile container for a single host pool, allow multiple connections to the profile containers to avoid errors.

Learn shows an Azure PowerShell tab next to the portal steps for both enabling and assigning multiple desktops. For assigning, it says explicitly that you can't assign multiple personal desktops to a user with the Azure CLI. The enabling steps list only the portal and PowerShell and say nothing about the Azure CLI.

For a new pool, check the box when you select **Direct**. For an existing pool, save direct assignment first: open **Settings**, **Properties**, set **Assignment type** to **Direct** and select **Save**, then check **Assign multiple desktops to a single user** and save again. Learn warns that doing both in one step produces an error.

In PowerShell the same two-step order applies. First make sure the assignment type is `Direct`, then set the load balancer type to `MultiplePersistent`:

```powershell
$parameters = @{
   ResourceGroupName = '<ResourceGroupName>'
   Name = '<HostPoolName>'
   PersonalDesktopAssignmentType = 'Direct'
}

Update-AzWvdHostPool @parameters
```

```powershell
$parameters = @{
   ResourceGroupName = '<ResourceGroupName>'
   Name = '<HostPoolName>'
   LoadBalancerType = 'MultiplePersistent'
}

Update-AzWvdHostPool @parameters
```

The `MultiplePersistent` value is the reason for the preview module requirement: the release notes of Az.DesktopVirtualization 5.3.0-preview read "Added 'MultiplePersistent' enum value to HostPool property loadBalancerType". Check the module version in the PowerShell Gallery before you script this.

Then assign each session host with the `Update-AzWvdSessionHost` command from the section above. Run it again with a different `Name` value for every additional desktop in the same host pool.

Set friendly names so that users can tell their desktops apart. Learn says the portal and the Azure CLI cannot set them. In PowerShell, use `Update-AzWvdSessionHost` with `-HostPoolName`, `-Name`, `-ResourceGroupName` and `-FriendlyName`. To audit the result, pipe `Get-AzWvdSessionHost` to `FL Name, AssignedUser, FriendlyName`.

## Three routines built from these steps

These routines combine the documented steps. The order is a suggestion, not a Learn procedure.

**Onboarding under direct assignment.** Add the user or group to the application group under **Assignments**, pick a session host that has no assigned user (the **Session hosts** list shows the assigned user per host), assign the user and ask them to sign in with a client.

**Offboarding.** Unassign the user from the session host, decide whether the VM is cleaned up for reuse or replaced by a new session host from the current image, then remove the user from the application group.

**Moving a user to a larger VM.** Add the new session host to the pool, unassign the user from the old host or reassign it, and assign the user to the new host. If the profile lives on the OS disk, plan the data copy before you change the assignment.

## Tool support at a glance

| Task | Portal | PowerShell | Azure CLI |
|---|---|---|---|
| Set assignment type | Yes | Yes | Yes |
| Assign a user to a session host | Yes | Yes | No |
| Unassign or reassign | Yes | Yes, through a REST call | No |
| Assign several desktops to one user | Yes | Yes, with the preview module (5.3.0-preview or later) | No |
| Set friendly names | No | Yes | No |

## Interaction with power management

Assignment also decides which VM wakes up. Learn's [Start VM on Connect article](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect) says that in a personal pool it only powers on a session host that is already assigned or can be assigned to the user. The [autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq) says that if a user tries to connect while autoscale deallocates a personal host, they get "No resources available".

So the message has at least two documented causes for personal pools: a missing session host assignment under direct assignment, or a host that is being deallocated. Learn also uses the message for pooled pools when Start VM on Connect has no free VM to offer yet. As a suggestion, check the assignment first, then the VM's power state.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Configure personal desktop assignment in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-personal-desktop-assignment-type)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [PowerShell Gallery: Az.DesktopVirtualization 5.3.0-preview](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/5.3.0-preview)
- [Microsoft Learn: Create a host pool in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-host-pools-azure-marketplace)
- [Microsoft Learn: az desktopvirtualization hostpool](https://learn.microsoft.com/en-us/cli/azure/desktopvirtualization/hostpool)
- [Microsoft Learn: Update-AzWvdHostPool](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdhostpool)
- [Microsoft Learn: Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost)
- [Microsoft Learn: Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
