---
title: "How to add, replace and retire session hosts without disrupting users"
summary: "Adding a session host depends on the management approach: standard pools register hosts you build, pools with a session host configuration create them from the pool size. Replacing means adding first in a standard pool, while session host update takes capacity out first and signs users out; retiring means draining, removing the host and deleting what remains."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-session-host, azure-virtual-desktop]
keypoints:
  - "The management approach is chosen when the host pool is created and cannot be changed later. It decides how hosts are added and replaced, and the session host configuration article covers the details."
  - "A registration key authorizes hosts to join a standard pool. For staged rollouts set its lifetime to cover the whole window, up to 27 days, or hosts fail with EXPIRED_MACHINE_TOKEN."
  - "In a standard pool, add and test the new host first, then drain and remove the old one so capacity never drops. Session host update works the other way round: it drains and removes hosts first, and users are asked to log off."
  - "To retire a host, turn drain mode on, let users sign out, remove it from the pool, then delete the VM and its leftovers yourself. Learn does not say that removing a host deletes its VM."
  - "Name prefixes are short: Learn gives 11 characters on the add page and 10 for a session host configuration at host pool creation, with 15 characters for the full name."
faq:
  - q: "How many session hosts can I add in one operation?"
    a: "Microsoft Learn gives up to 400 in one add operation for standard management, subject to subscription quota. At host pool creation with a session host configuration it gives 0 to 500, also subject to quota."
  - q: "Does removing a session host from a host pool delete the virtual machine?"
    a: "The Remove-AzWvdSessionHost reference only says it removes a session host. Learn's article on deleting a host pool says the related VMs are not deleted and remain in the subscription. Plan to delete the VM and its disk and network interface separately."
  - q: "Can I force a session host out while users are signed in?"
    a: "The Remove-AzWvdSessionHost cmdlet has a Force switch that deletes the session host even when a user session exists. That ends the users' work on that host, so drain the host and notify users first."
---

Adding, replacing and retiring session hosts are three different operations. What keeps users undisturbed is the same each time: know how much capacity is left while a host is out, and never remove a host that still has sessions. In a standard pool you can bring a replacement in before the old host leaves; in a pool with a session host configuration, session host update does the reverse and asks users to log off, so the batch size sets how much capacity you lose. This article gives the steps for pooled host pools and shows where the route splits by management approach. Microsoft Learn pages were retrieved on 17 November 2026.

## Check the management approach first

Learn describes two approaches for a [host pool](/entity/avd-host-pool/): standard management and a [session host configuration](/entity/avd-session-host-configuration/). The approach is set at creation and cannot be changed, and the companion article "Session host configuration in Azure Virtual Desktop explained" covers the differences.

What matters here is the lifecycle. With a session host configuration, which only works with pooled pools, you add hosts by raising the pool size and replace them with session host update. You cannot create, update or scale hosts outside the service with tools built for standard management, and you cannot retrieve a registration token for externally created hosts. With standard management you build the hosts yourself and register them with a token. Learn does not describe a visual marker that tells you which approach a pool uses. In a pool with a session host configuration, the **Session hosts** page offers **Manage session host configuration** and **Manage session host update**, which the update steps on Learn use.

Personal host pools are outside this article. For them, `Update-AzWvdSessionHost` has an `-AssignedUser` parameter, and the autoscale FAQ says autoscale does not put personal desktops into drain mode before deallocating them.

## Add session hosts

### Prerequisites

The add page lists these points:

- All hosts in a standard pool should share one configuration, including identity provider. Do not mix Microsoft Entra joined and Active Directory joined hosts in one pool.
- Keep the VM size, image and name prefix of the existing hosts.
- Do not disable Windows Remote Management, because PowerShell DSC needs it.
- Minimum roles: Desktop Virtualization Host Pool Contributor to generate a registration key, and that role plus Virtual Machine Contributor to create and add hosts on Azure.

### Registration key (standard management)

Go to Azure portal > **Azure Virtual Desktop** > **Host pools** > your pool > **Registration key** > **Generate new key**, set an expiry and select **OK**. Learn suggests 1 to 4 hours for an interactive rollout. For a staged rollout, set the lifetime to cover the whole window, up to 27 days; otherwise later hosts fail with `EXPIRED_MACHINE_TOKEN`. Pre-provisioned VMs that stay powered off for more than 90 days also lose their machine token, so power each one on for at least 20 minutes every 90 days.

### Portal steps

For standard management: **Host pools** > your pool > **Session hosts** > **+ Add**. The Basics tab is not available, so go to **Virtual Machines**, fill in the Azure section, optionally add tags, and select **Review + create**, then **Create**. Details worth knowing:

- The name prefix is at most 11 characters on this page, and prefix plus suffix may not exceed 15. The page for creating a pool with a session host configuration says 10 characters, so use 10 if you want a prefix that works in both.
- You can add up to 400 VMs in one operation, subject to quota.
- Microsoft recommends Premium SSD OS disks for production. Public inbound ports should be set to No, since Azure Virtual Desktop does not need them.

For a session host configuration: **Session hosts** > **+ Add**, enter the number of hosts to add, check the calculated pool size, optionally change the failed host cleanup policy or drain mode policy, and select **Add**. Microsoft recommends Log Analytics for these pools, because diagnostics go there.

PowerShell is not available for this on the add page. The What's new entry of June 2025 adds that you can increase the host pool size through the API or custom ARM templates, which triggers the service to create the new hosts. An older troubleshooting page (21 January 2025) says only the Azure portal is supported.

### After the hosts appear

Hosts created by the service get a Windows license automatically. Hosts created elsewhere may need one applied, and Windows Server hosts need RDS client access licenses. For Entra joined hosts, enable single sign-on or older authentication protocols, assign a role to users and review multifactor policies. Then sign in with a client as a test user, before you drain any host you plan to replace.

## Replace session hosts

Replacement means a new image, size or setting. The approaches differ in what happens to capacity.

**Standard management: add first**

1. Build the new hosts from the new image with the same size and prefix scheme, and register them.
2. Wait until they show as available and a test user can sign in.
3. Put one or more old hosts in drain mode, which stops new sessions without ending the current ones. If a [scaling plan](/entity/avd-scaling-plan/) is assigned, tag the old hosts with its exclusion tag first, because autoscale turns drain mode on or off on every VM included in scaling. The steps are in the article on [drain mode](/entity/avd-drain-mode/) and in the rolling-update article.
4. When the old hosts are empty, remove them as described below.

**Session host configuration: capacity goes down first**

Edit the configuration and schedule a session host update. Per Learn's "Update process" the service works in batches, starting with one initial host to test the process, and then:

1. Sends the administrator's notification to connected users, waits the configured time, then signs out the users who remain.
2. Puts the selected hosts in drain mode and removes them from the host pool.
3. Creates the same number of new hosts from the updated configuration.
4. Joins them to the pool, disables drain mode so they accept connections, and deletes the original VMs.

During an update the number of available hosts is reduced and logged-on users are asked to log off. They can sign in again immediately and are connected to another host. The batch size is therefore your control over lost capacity: a smaller batch keeps more hosts available and lengthens the run. Learn's constraints: disable autoscale until the update finishes, schedule a quiet period, do not change drain mode or remove VMs by hand during the update, and expect about 20 minutes per host. The companion article on managing updates with a session host configuration covers the procedure.

## Retire session hosts

A host that is retired for good should leave in this order. Roles split here: Desktop Virtualization Session Host Operator can change drain mode and remove hosts, and Desktop Virtualization User Session Operator can send messages and sign users out but cannot change drain mode. Deleting the VM, disk and network interface needs an Azure permission that the Azure Virtual Desktop pages do not list.

1. **Check capacity.** The remaining hosts must carry the sessions. Learn defines capacity as the maximum session limit times the number of available hosts.
2. **Tag and drain.** Add the exclusion tag if a plan applies, then turn drain mode on.
3. **Empty the host.** Notify users, wait for your cut-off and end what remains. Learn's load balancing page says users with a disconnected session are sent back to a drained host, so end those sessions too. The commands, including `Send-AzWvdUserSessionMessage` and `Remove-AzWvdUserSession`, are in the rolling-update and drain mode articles.
4. **Remove the host from the pool:**

```powershell
Remove-AzWvdSessionHost -ResourceGroupName <rg> -HostPoolName <pool> -Name <host>
```

The Learn pages retrieved document removing a single host only through this cmdlet reference; the delete host pool page shows the portal removing the hosts when you delete a whole pool. The reference describes a `-Force` switch that deletes the session host even when a user session exists. Use it only for an emptied or dead host. The cmdlet page does not say what happens to the VM, but Learn's article on deleting a host pool says the VMs of removed hosts remain in the subscription, so verify in the portal.

5. **Delete the leftovers.** Delete the VM, its OS disk and its network interface in Azure. With a manual retirement, also clean up the computer object in your directory if the name will not be reused. Session host update is different: it does not delete computer objects, but the replacement VM uses the original host name and inherits the orphaned object, so nothing needs cleaning there. For Intune-managed hosts, Learn's multi-session page says that deleting VMs from Azure leaves orphaned device records in the Intune admin center.

For pools with a session host configuration, Learn says tools built for standard management do not work. The pages retrieved give no manual retire procedure for such pools, so use the portal and the update process. Dynamic autoscaling can delete hosts on its own. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, in July 2026. Some Learn pages still carry preview wording; check the current page before relying on a limit.

## A short runbook

| Situation | Order of operations |
|---|---|
| Add capacity, standard pool | Registration key, add hosts, check available, test sign-in |
| Add capacity, configuration pool | Raise the host count in the portal (or via API or ARM template), check Log Analytics if hosts fail |
| Replace, standard pool | Add new, test, drain old, remove old, clean up |
| Replace, configuration pool | Edit configuration, disable autoscale, schedule update, choose batch size, monitor |
| Retire | Capacity check, tag, drain, message, end sessions, remove, delete VM and objects |

## Common failure points

- **Expired key.** If hosts fail to register in a staged rollout, check the key lifetime first.
- **Mixed identity.** A pool with both Entra joined and AD joined hosts is outside Learn's guidance.
- **Network.** Learn's deploy page says that skipping validation of the required URLs is the most common cause of registration failures, including `EXPIRED_MACHINE_TOKEN`. The agent troubleshooting page says these codes mean the registration key used is not recognized as valid, and the fix is a new key. Check both. Once the first host is on the network, run the Azure Virtual Desktop Agent URL Tool (`WVDAgentUrlTool.exe`, in the RDAgent folder, RDAgent 1.0.2944.400 or higher). It lists required endpoints the host cannot reach.
- **Quota.** Large add operations and update batches both depend on subscription quota.
- **Orphans.** After a manual retirement, VMs, disks, directory objects and device records outlive the pool entry unless you delete them.

## Sources

All retrieved on 17 November 2026.

- [Tech Community: Enhanced host pool management is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Add session hosts to a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/add-session-hosts-host-pool)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts using session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Troubleshoot session host configuration and session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-session-host-update)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop Agent issues](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-agent)
- [Microsoft Learn: Azure Virtual Desktop Agent URL Tool](https://learn.microsoft.com/en-us/azure/virtual-desktop/required-url-check-tool)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Host pool load balancing](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-load-balancing)
- [Microsoft Learn: Remove-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/remove-azwvdsessionhost)
- [Microsoft Learn: Update-AzWvdSessionHost](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/update-azwvdsessionhost)
- [Microsoft Learn: Delete a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/delete-host-pool)
- [Microsoft Learn: Drain session hosts for maintenance](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Autoscale scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale glossary](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Intune with Azure Virtual Desktop multi-session](https://learn.microsoft.com/en-us/intune/intune-service/fundamentals/azure-virtual-desktop-multi-session)
