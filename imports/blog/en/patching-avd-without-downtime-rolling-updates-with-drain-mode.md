---
title: "Patching AVD without downtime: rolling updates with drain mode"
summary: "To patch Azure Virtual Desktop session hosts without downtime, update them in small waves: tag, drain, empty, patch, restart and return each wave to service before the next. Microsoft recommends image-based servicing for pooled multi-session hosts and rates pooled single-session Windows client as not recommended, so rolling drain fits mainly pooled Windows Server hosts and the retirement of old hosts."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-drain-mode, avd-session-host]
keypoints:
  - "Drain mode stops a session host from accepting new sessions. Existing sessions stay active until users sign out or an administrator ends them, and administrators can still connect to the host directly."
  - "Autoscale turns drain mode on or off on every host included in scaling, no matter who set it. Microsoft Learn says to use the scaling plan's exclusion tag for hosts you maintain."
  - "A rolling update is limited by capacity. Hosts in drain mode do not take new sessions, so the remaining hosts must be able to hold the users who reconnect."
  - "Learn's September 2026 servicing guidance recommends session host update or Azure Compute Gallery images for Windows client multi-session pools and rates Windows Update there as not recommended. It also rates pooled single-session Windows client as not recommended, so rolling drain is mainly the pattern for patch-in-place Windows Server hosts."
  - "A user with a disconnected session is sent back to that host even when drain mode is on, so a host with disconnected sessions does not empty by itself."
faq:
  - q: "Does drain mode disconnect users who are already signed in?"
    a: "No. Microsoft Learn says existing connections stay active until the user signs out or an administrator ends the session. Only new connections are redirected to the next available session host."
  - q: "Why did my host leave drain mode during maintenance?"
    a: "If the host is part of a scaling plan, autoscale can turn drain mode on or off regardless of who set it. Learn says to use exclusion tags to keep a VM out of scaling actions while you work on it."
  - q: "Can I use drain mode while session host update is running?"
    a: "Learn says not to change drain mode on VMs during a session host update, because the service manages it automatically. Use drain mode for manual rolling maintenance instead."
---

To patch Azure Virtual Desktop session hosts without downtime, work in waves. Tag a few hosts, put them into drain mode, wait until their users have signed out, patch and restart them, check that they are healthy, return them to service, and only then take the next wave. This article covers how to size a wave, how the wave loop runs, why autoscale can undo your work, and when Microsoft's own guidance points away from patching in place. The cmdlet-level runbooks live in the companion articles "How to use drain mode for patching and maintenance of session hosts" and "How to use the exclusion tag for maintenance windows and special session hosts", so this one concentrates on planning and decisions.

## What drain mode does

Microsoft Learn describes drain mode as a way to isolate a session host for maintenance without disrupting service. The host does not accept new user sessions, and new connections go to the next available session host. Existing connections stay active until the user signs out or an administrator ends the session. Administrators can still connect directly to the server without going through the Azure Virtual Desktop service. See also the entity pages for [drain mode](/entity/avd-drain-mode/) and [session hosts](/entity/avd-session-host/).

One detail changes how a wave behaves. **Disconnected sessions come back:** the load balancing page says a user with an active or disconnected session who signs in again is sent to the host that holds that session, even if drain mode is on for it. A host that still has disconnected sessions therefore does not empty by itself. Plan a cut-off at which you end those sessions.

## Roles for the wave

Two built-in roles matter for a wave, according to the RBAC page:

- **Desktop Virtualization Session Host Operator** allows viewing and removing session hosts and changing drain mode.
- **Desktop Virtualization User Session Operator** allows sending messages, disconnecting sessions and signing users out, but does not allow host pool or session host management such as removing a session host or changing drain mode.

Learn's drain mode page lists only the Session Host Operator role as its prerequisite. If a separate team handles user messages, the User Session Operator role covers that work but not drain mode. The RBAC page does not say whether the Session Host Operator role also covers the user-session actions, so check in your tenant before you decide whether one team needs both roles.

## Rolling drain or image-based servicing?

Microsoft added "Windows update management methodologies for session hosts" to Learn in September 2026 (page dated 29 October 2026). It states that image-based servicing through session host update is recommended for pooled environments because it provides consistent host configuration, easier rollback and reduced impact to active user sessions. Its table for monthly security and quality updates lists seven delivery methods; this excerpt omits the Windows Autopatch, Configuration Manager and automatic guest patching rows:

| Method | Windows client Enterprise | Windows client multi-session | Windows Server |
|---|---|---|---|
| Windows Update | Recommended | Not recommended | Supported |
| Session host update | Not supported | Recommended | Not recommended |
| Azure Compute Gallery | Not recommended | Recommended | Not recommended |
| Azure Update Manager | Not supported | Not supported | Recommended |

The page does not use the term rolling drain, but its image-based workflow ends with deploying new hosts and then draining and removing the old ones. The consequence for this article:

- **Windows client multi-session pools:** Learn favors replacing hosts over patching them. Use rolling drain to retire the old hosts, not as the monthly patch route. Session host update needs a session host configuration; without one, the Compute Gallery route applies.
- **Windows Server in pooled pools:** Learn's host pool type table rates it as supported, and Windows Update (supported) and Azure Update Manager (recommended) are the in-place routes. Rolling drain is how you patch in place without downtime.
- **Windows client Enterprise (single-session):** the same table rates pooled pools of it as not recommended, with the footnote that session density is set to 1, and personal pools as supported. For a pooled single-session pool, rolling drain is therefore an exception. Personal pools are patched per VM, and the wave logic in this article does not carry over to them.
- **Local state:** Learn notes that user data and local storage are not kept when hosts are replaced through image-based servicing. Hosts that carry such state are a reason to stay with patching in place where the tables permit it.

## Autoscale can undo drain mode

If the pool has a [scaling plan](/entity/avd-scaling-plan/), drain mode is not yours alone. The autoscale FAQ says autoscale still turns VMs in drain mode on or off no matter who put them there, and that it overrides drain mode on all VMs included in scaling. The scenarios page repeats this for pooled pools and tells you to use exclusion tags when updating VMs.

The [exclusion tag](/entity/avd-scaling-plan-exclusion-tag/) is a tag name that you define on the scaling plan. The glossary calls it a property of the plan that you apply to the VMs to leave out of scaling actions. In practice that is an ordinary Azure resource tag on the VM whose name matches the plan's exclusion tag, for example `excludeFromScaling`, Learn's example. Autoscale then does not turn the VM on or off or change its drain mode. The autoscale pages speak only of the tag name, and the exclusion tag runbook covers the portal and `Update-AzTag` steps. Two further points matter for patching:

- Tagged hosts still count toward the minimum percentage of hosts calculation, but autoscale cannot start them.
- Learn asks you to keep sensitive information, such as user principal names, out of exclusion tags.

Tag before you turn drain mode on. Remove the tag from each host once that host is back in service, not at the end of the whole run. A tagged host cannot be scaled, so leaving the tag on after the patch holds capacity out of autoscale for no reason.

## Size the wave

Draining a host removes its capacity for new sessions. Learn defines available capacity as the host pool's maximum session limit multiplied by the number of available session hosts.

Worked example with illustrative numbers: a pooled pool has 10 hosts and a maximum session limit of 10, so capacity is 100. At 15:00 there are 55 sessions. Draining 2 hosts leaves 8 accepting hosts with a capacity of 80. The users on the drained hosts will sign out and reconnect to the other hosts, so 55 sessions must fit into 80 with room for new arrivals. They do. Draining 5 hosts would leave 50, which is below the current 55, so that wave is too large. Your own session counts and limit decide.

Practical rules that follow:

1. Patch outside peak hours, so the session count is low while capacity is reduced.
2. Keep the wave small enough that the remaining hosts stay below the capacity you are willing to run at. Tagged hosts cannot be started by autoscale, so the untagged hosts must carry the load.
3. Do not tag and switch off the last untagged host. The scenarios page describes that case: autoscale cannot start a VM for the next user, who sees "No resources available".

## The wave loop

The sequence repeats for each wave. The companion articles hold the commands; this is the order and the points specific to waves.

1. **Check the starting state.** Every host in the pool shows as available, and you have a test user for a smoke test.
2. **Tag the wave's hosts** with the scaling plan's exclusion tag.
3. **Turn drain mode on** in the portal (**Host pools** > pool > **Session hosts** > **Turn drain mode on**) or with PowerShell. Learn's drain mode page calls `Update-AzWvdSessionHost` with `ResourceGroupName`, `HostPoolName`, `Name` and `AllowNewSession = $False`; `$True` turns drain mode off again. Run it once per host.
4. **Empty the hosts.** `Get-AzWvdUserSession -ResourceGroupName <rg> -HostPoolName <pool> -SessionHostName <host>` lists the sessions on one host. Its `-Filter` parameter, an OData expression on `userprincipalname` and `sessionstate`, exists only in the form without `-SessionHostName`, which lists the whole pool. `Send-AzWvdUserSessionMessage` requires the resource group, pool, host and `-UserSessionId`. After the cut-off, `Remove-AzWvdUserSession` ends what remains; its `-Force` switch is described only as forcing the deletion. Ending a session can lose unsaved work.
5. **Patch and restart** the hosts with your normal tooling.
6. **Verify.** Check in the portal that each host is available and that a test sign-in works. Administrators can sign in to a drained host directly for this purpose.
7. **Turn drain mode off**, remove the tag, and wait at least 60 seconds before you refresh the portal, because Learn says the status might appear out of sync.
8. **Confirm the host takes sessions again** before you start the next wave.

Check the drain state of each host in the portal's **Session hosts** list, after the 60-second wait.

## Rolling drain compared with session host update

Pools created with a session host configuration have a second option. Session host update replaces hosts in batches instead of patching them in place. Learn describes it as deallocating or deleting the existing VMs and creating new ones from the updated configuration.

| | Rolling drain (manual) | Session host update |
|---|---|---|
| Works with | Pooled pools | Pooled pools that use a session host configuration |
| What changes | The existing VM is patched in place | The VM is replaced from the configuration, including image, size, disk type and domain join settings |
| Drain mode | You set it | Managed automatically; do not change it during the update |
| Autoscale | Use the exclusion tag | Disable autoscale before the update and keep it off until it finishes |
| Batches | Your wave size | First one host, then the batch size you set |
| Time per host | Depends on your patching | About 20 minutes according to Learn |
| Manual host changes | Kept | Lost, unless they are in the image, in management tools or in the custom script |

Learn notes that with a batch size of 3 and 10 hosts, at least 7 stay available after the first host. For the mechanics, see [session host configuration](/entity/avd-session-host-configuration/) and the companion article on managing updates with it. The capacity thinking from the sizing section applies there too.

## Pitfalls

- **Forgetting the tag.** A host leaves drain mode while you work because autoscale treated it as a normal host.
- **Draining too much.** Capacity is the product of the limit and the available hosts. Do the arithmetic before each wave.
- **Disconnected sessions.** A host that never reaches zero sessions usually holds disconnected ones that users would reconnect to.
- **Mixing methods.** Do not change drain mode by hand while a session host update is running, and do not run both on the same hosts.
- **Personal pools.** This pattern is written for pooled pools, where several users share a host. For personal pools the autoscale FAQ says autoscale does not put hosts in drain mode before deallocating them, so the wave logic here does not carry over.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Windows update management methodologies for session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-update-management-methodologies-session-hosts)
- [Microsoft Learn: Drain session hosts for maintenance in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Host pool load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-load-balancing)
- [Microsoft Learn: Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost)
- [Microsoft Learn: Get-AzWvdUserSession](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/get-azwvdusersession)
- [Microsoft Learn: Send-AzWvdUserSessionMessage](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/send-azwvdusersessionmessage)
- [Microsoft Learn: Remove-AzWvdUserSession](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/remove-azwvdusersession)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts using session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
