---
title: "How to use drain mode for patching and maintenance of session hosts"
summary: "Runbook for taking one Azure Virtual Desktop session host out of service: protect it from autoscale, turn on drain mode, warn and end the remaining sessions, do the work, then switch drain mode off. Roles, commands and pitfalls are included; waves across a whole host pool are covered in a separate article."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-drain-mode, avd-session-host]
keypoints:
  - "Drain mode stops new sessions on a host. Existing sessions stay until the user signs out or an administrator ends them."
  - "A user who already has an active or disconnected session in the pool is still routed back to that host, even in drain mode, so list and end sessions before you patch."
  - "In pooled host pools, Learn says autoscale overrides drain mode on every VM in scope, so tag the VM with the scaling plan's exclusion tag first. For personal host pools, Learn's FAQ says autoscale does not put the session host in drain mode."
  - "Turning drain mode on needs the Desktop Virtualization Session Host Operator role. Messaging and signing users out is covered by the User Session Operator role; check the effective permissions of the account that runs the runbook."
  - "For image-based updates of hosts that use a session host configuration, session host update handles drain mode itself, and Learn says not to change it manually during an update."
faq:
  - q: "What happens to users who are connected when I turn drain mode on?"
    a: "No. Microsoft Learn says existing connections stay active until the user signs out or an administrator ends the session. Drain mode only stops new sessions. You have to message the users and end the sessions yourself, for example with Send-AzWvdUserSessionMessage and Remove-AzWvdUserSession."
  - q: "Why is a user still landing on the host I drained?"
    a: "Learn's load-balancing page says a user who already has an active or disconnected session in the host pool is redirected to the host that holds that session, even if drain mode is on. Users without a session are not sent to a drained host. Check for disconnected sessions with Get-AzWvdUserSession."
  - q: "Will autoscale switch my host back on during maintenance?"
    a: "In a pooled host pool it can. Learn's autoscale FAQ says autoscale overrides drain mode on all VMs included in scaling. To keep a VM out of scaling actions, use the exclusion tag set in the scaling plan: Learn says autoscale then does not start, stop or change the drain mode of tagged hosts. For personal host pools the FAQ says autoscale does not put the session host in drain mode, but it can still deallocate a host that nobody signs in to."
---

To patch one session host without cutting users off, tag the VM so autoscale leaves it alone, turn on drain mode, give the remaining users a message and a deadline, end any sessions that are left, patch and restart, and then turn drain mode off.

This article is the runbook for a single host. What drain mode is belongs to "Drain mode in Azure Virtual Desktop explained". Planning waves across a whole host pool, with wave sizes and capacity, is the subject of "Patching AVD without downtime: rolling updates with drain mode". The mechanics of the exclusion tag, including how to apply it, are in "How to use the exclusion tag for maintenance windows and special session hosts".

## What you need before you start

- **Roles.** Learn says turning drain mode on or off requires the Desktop Virtualization Session Host Operator role. Its description on the RBAC page adds that the role can view and remove session hosts and change drain mode. Sending messages, disconnecting sessions and signing users out is covered by the Desktop Virtualization User Session Operator role, which the RBAC page says does not allow changing drain mode. The built-in definition of the Session Host Operator role lists `Microsoft.DesktopVirtualization/hostpools/sessionhosts/*`, while the User Session Operator definition lists `.../sessionhosts/usersessions/*` explicitly. Whether one account can do both steps therefore depends on the roles actually assigned, so test with the account that will run the runbook.
- **Azure PowerShell** with the Az.DesktopVirtualization module, or Azure Cloud Shell, if you want to script it.
- **Capacity.** Learn says new connections go to the next available session host, so check that the remaining hosts can take the load. For a depth-first pool, check the [maximum session limit](/entity/avd-maximum-session-limit/) too, because Learn says that once all hosts have reached it you must raise it or add hosts.

## Step by step

1. **Keep autoscale away from the host (pooled host pools).** Learn's scenarios page says that for pooled host pools autoscale overwrites drain mode, and the autoscale FAQ says autoscale still turns drained VMs on or off, no matter who put them in drain mode, because it overrides drain mode on all VMs included in scaling. The [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) is a tag name that you enter on the Basics tab of the [scaling plan](/entity/avd-scaling-plan/) (on the Properties tab of an existing plan). Learn's example is `excludeFromScaling`. The field exists for power management plans and for dynamic plans, which apply only to pooled host pools with session host configuration. With the tag on a session host, autoscale does not start, stop or change the drain mode of that host. Add a tag with that name to the VM. Tag permissions and further details are in the exclusion tag article named above. For personal host pools see the section further down.
2. **Turn drain mode on.** In the Azure portal, open **Azure Virtual Desktop**, then **Host pools**, select the host pool, select **Session hosts**, check the host and select **Turn drain mode on**. With Azure PowerShell, Learn's drain-mode page sets drain mode with the `AllowNewSession` parameter of `Update-AzWvdSessionHost`, run once for each session host. The page uses a `$params` hash table with `AllowNewSession = $False` and splats it into the cmdlet; the same call in one block, in the form of the cmdlet reference example, is:

   ```powershell
   Update-AzWvdSessionHost -ResourceGroupName <ResourceGroupName> `
       -HostPoolName <HostPoolName> `
       -Name <SessionHostName> `
       -AllowNewSession:$false
   ```

   Learn warns that the portal status can look out of sync if you refresh immediately. Wait at least 60 seconds first.
3. **List the sessions left on the host.**

   ```powershell
   Get-AzWvdUserSession -ResourceGroupName <ResourceGroupName> `
       -HostPoolName <HostPoolName> -SessionHostName <SessionHostName>
   ```

   Learn's example output names each session as `HostPoolName/SessionHostName/2`, and the `Remove-AzWvdUserSession` reference takes the session number as `-Id` (alias `UserSessionId`), so use the last part of the name as the session ID.
4. **Warn the users.** Learn's reference shows this form, with the message title and body as free text:

   ```powershell
   Send-AzWvdUserSessionMessage -ResourceGroupName <ResourceGroupName> `
       -HostPoolName <HostPoolName> -SessionHostName <SessionHostName> `
       -UserSessionId <id> -MessageTitle 'Maintenance' `
       -MessageBody 'Please save your work and sign out. This host is patched at 18:30.'
   ```

   Give a deadline that you can keep.
5. **End what is left.** After the deadline, remove the remaining sessions:

   ```powershell
   Remove-AzWvdUserSession -ResourceGroupName <ResourceGroupName> `
       -HostPoolName <HostPoolName> -SessionHostName <SessionHostName> -Id <id>
   ```

   The reference page also lists a `-Force` parameter ("Specify to force userSession deletion") but shows no example with it. Removing a session ends it, so anything the user did not save is lost. That is why step 4 comes first.
6. **Do the maintenance.** Learn says that once no sessions remain, you can perform the maintenance you need, and that administrators can still connect to the server directly without going through the Azure Virtual Desktop service. The patching itself, through Windows Update, Intune, WSUS or another tool, is outside this article, but check how Learn rates in-place patching for your operating system first (see the last section). If the host does not come back as available afterwards, use the checklist in the sibling article "Azure Virtual Desktop Session Host Shows Unavailable: A Step-by-Step Checklist".
7. **Turn drain mode off.** In the portal, check the host and select **Turn drain mode off**. In PowerShell, run the same cmdlet with `-AllowNewSession:$true`; Learn's drain-mode page shows both directions, `$False` to turn drain mode on and `$True` to turn it off. Wait at least 60 seconds before you check the status in the portal. Then remove the exclusion tag so that autoscale manages the host again.

## Behavior that surprises people

- **Disconnected sessions come back.** Learn's load-balancing page says that a user with an active or disconnected session who signs in again is sent to the host with that session, even in drain mode. A user without a session is never sent to a drained host. This is why step 3 matters: a host that looks empty can still hold disconnected sessions.
- **An untagged pooled host is still in scope.** If you drain a host in a pooled host pool manually and do not tag it, autoscale can still start, stop or change the drain mode of that host, according to the FAQ. The tag is what takes the host out of scaling, not drain mode.
- **Unsaved work is lost.** `Remove-AzWvdUserSession` ends the session. Learn's reference describes no way to recover the session, so send the message in step 4 first.
- **A tag left behind keeps the host out of scaling.** Learn says tagged hosts are still part of the calculation of the minimum percentage of hosts, but autoscale does not start them. Remove the tag in step 7. While it stays, autoscale does not start the host, even when the pool needs the capacity; Learn's scenario 4 describes users seeing "No resources available" when every host in the pool is tagged and turned off.

## An example timeline for one host

These times are invented for illustration and are not a Microsoft recommendation. One pooled host, `avd-host-03`, is patched on a weekday evening.

| Time | Action |
|---|---|
| 17:30 | Tag the VM, turn on drain mode, list the sessions (steps 1 to 3). |
| 17:35 | Send a message to each remaining session: save work, sign out, the host is patched at 18:30 (step 4). |
| 18:30 | Remove the sessions that are left, including disconnected ones (step 5). |
| 18:35 | Install the updates and restart (step 6). |
| 19:15 | Confirm the host reports as available, turn drain mode off, remove the tag (step 7). |

Before you start, check that the other hosts can carry the evening load. The sibling article on rolling updates covers how many hosts to take out at once.

## Personal host pools

Learn's FAQ says autoscale does not put a personal desktop into drain mode before it deallocates it, and a user who connects during deallocation sees "No resources available". The FAQ also says that if a session host is turned on, by autoscale, Start VM on Connect or an administrator, and nobody signs into it, autoscale deallocates it after a period of inactivity that the page does not define. That affects you if the pool has a scaling plan: a personal host that you start for patching, without a user signing in, can be deallocated under you. Learn describes the exclusion tag field for power management plans without limiting it to pooled host pools, but it does not spell out its effect on personal host pools. Tagging the personal host before you start the VM is therefore a precaution that this article suggests, not a documented guarantee; check on a test host. Also tell the assigned user, because a personal session host is assigned to one user.

## When drain mode is the wrong tool

Learn's page on update methods for session hosts rates in-place patching by operating system. For Windows client multi-session hosts it marks Windows Update as "Not recommended" for monthly and feature updates and WSUS as "Not recommended" for feature updates, and it marks session host update and Azure Compute Gallery as "Recommended". For Windows Server it marks Windows Update as "Supported" and Azure Update Manager and automatic guest patching as "Recommended". For Windows client Enterprise (single-session) it marks Windows Update as "Recommended", but it marks pooled host pools of that type as "Not recommended". The same page's patch in-place paragraph lists Windows Update among common technologies, so read the per-system tables, not that sentence alone. Our reading: this runbook fits Windows Server hosts, personal hosts and maintenance that is not patching, such as configuration changes, restarts, troubleshooting or retiring a host. For pooled Windows client multi-session pools, Learn recommends image-based servicing.

If you update by replacing the image rather than patching in place, Learn's session host update feature does the work for hosts that use a session host configuration. Learn says it places the selected hosts into drain mode itself and that you must not change drain mode manually during an update. Its page also says to disable autoscale on the host pool before the update, because an enabled scaling plan can make it fail with a runtime error, and that manual customizations such as files, registry keys and certificates are not present after the update. Microsoft announced general availability of enhanced host pool management, which includes session host configuration and update, in July 2026 (Tech Community). Some Learn pages still carry preview wording; for example, the configuration page marks the Azure PowerShell cmdlets for such host pools as preview and asks for the preview version of the Az.DesktopVirtualization module. Check the current page before relying on a limit. Compare this approach with rolling drain in "Patching AVD without downtime: rolling updates with drain mode".

## Sources

Accessed 17 November 2026.

- [Microsoft Learn: Drain session hosts for maintenance in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Azure RBAC roles for Azure Virtual Desktop (rbac page)](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost)
- [Microsoft Learn: Get-AzWvdUserSession](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/get-azwvdusersession)
- [Microsoft Learn: Send-AzWvdUserSessionMessage](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/send-azwvdusersessionmessage)
- [Microsoft Learn: Remove-AzWvdUserSession](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/remove-azwvdusersession)
- [Microsoft Learn: Configure host pool load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-host-pool-load-balancing)
- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Windows update management methodologies for session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-update-management-methodologies-session-hosts)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
