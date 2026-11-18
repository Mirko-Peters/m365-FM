---
title: "Cloud PC vs Azure Virtual Desktop session host: the practical differences"
summary: "A Windows 365 Enterprise Cloud PC is created by the service in a Microsoft-owned subscription, so day-to-day work happens through Intune remote actions. An Azure Virtual Desktop session host is a VM in your subscription that you are responsible for, from image and network to backup and monitoring."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-365]
keypoints:
  - "A Windows 365 Enterprise Cloud PC lives in a Microsoft-owned subscription and is provisioned by policy. An AVD session host is a VM in your subscription that you create and manage."
  - "Repair differs. Enterprise Cloud PCs have Intune remote actions: restart, resize, restore and reprovision. Session hosts are fixed with drain mode, VM-level tools or replacement from an updated image."
  - "Cloud PC custom images must be generalized, single-session and free of FSLogix; existing Cloud PCs need reprovisioning for a new image. Session hosts can use multi-session images and FSLogix."
  - "A Windows 365 Enterprise Cloud PC size is tied to the license and changed with resize. Session hosts scale with autoscale, which starts and deallocates hosts and, if dynamic, creates and deletes them."
  - "Monitoring differs. Cloud PCs are reported in Intune. Azure Virtual Desktop Insights needs a Log Analytics workspace, data collection and the Azure Monitor Agent on the session hosts."
faq:
  - q: "Is a Cloud PC just an Azure Virtual Desktop session host that Microsoft runs for me?"
    a: "Not quite. Learn says Cloud PC connectivity is provided by Azure Virtual Desktop and that Windows 365 integrates the Azure Virtual Desktop connectivity components into its images. But a Windows 365 Enterprise Cloud PC is a single-user machine in a Microsoft-owned subscription (Windows 365 Flex in Shared mode is the exception: one Cloud PC is shared by a group, one user at a time), provisioned from a license and policy and managed in Intune. A session host is a VM in your subscription that you create, update and scale, and which can serve several users in a pooled host pool."
  - q: "Can I manage both with Intune?"
    a: "Yes, with different scope. Learn says Windows 365 Cloud PCs are managed through Intune, and its comparison lists Intune as a management option for Azure Virtual Desktop as well. The difference is the layer below: for an Enterprise Cloud PC, provisioning, resize, restore and reprovision are also Intune actions, while for session hosts those tasks happen in Azure and the Azure Virtual Desktop service."
  - q: "Where do I look when a Cloud PC fails to provision on my own network?"
    a: "Start with the Azure network connection health checks. Learn lists checks for DNS resolution of the Active Directory domain, domain join, endpoint connectivity, subnet IP address usage, Azure tenant readiness, enrollment restrictions and more. Open View details on each failed or warning check, fix the cause and retry the check."
---

A Windows 365 Enterprise Cloud PC is a machine that the service builds and keeps for one user, and you work on it through Intune. An Azure Virtual Desktop (AVD) session host is a virtual machine in your own Azure subscription that you are responsible for. With a session host configuration the service creates and updates the VMs for you, but image, network, backup and monitoring remain your decisions.

This article covers operations, not the buying decision, licensing or pricing, which "AVD or Windows 365: how to choose between them" covers. "Cloud PC" below means Windows 365 Enterprise unless stated. Windows 365 Flex (the new name for Frontline, changed in May 2026) has a Dedicated mode (up to three Cloud PCs per license, each for one user) and a Shared mode (one Cloud PC used by a group, one user at a time, with user data deleted at sign-out). Windows 365 Reserve gives up to 10 days of Cloud PC access per user per year.

## What stays the same

[Windows 365](https://www.m365.fm/entity/windows-365/) and [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) share a connection layer. Learn's Windows 365 architecture page says Cloud PC connectivity is provided by Azure Virtual Desktop and that no inbound connections from the internet are made to the Cloud PC. The Windows IT Pro Blog describes [Windows App](https://www.m365.fm/entity/windows-app/) as connecting to both. [Intune](https://www.m365.fm/entity/intune/) is a management option for both.

## Who owns the machine

For a Cloud PC, the architecture page says the "hosted on behalf of" model means the Cloud PCs exist in a subscription owned by Microsoft, which also manages capacity and in-region availability and picks the VM size from the license assigned to the user. Learn's comparison unit summarizes this as "Microsoft-managed, fixed cost, no access to VMs".

For a session host, the AVD service architecture page splits the duties differently. Microsoft provides the web, broker and gateway services. You are responsible for creating and managing session hosts, including images, applications, network connectivity, resiliency, and backup and recovery, and for user identities and access control. The same page points to Azure Availability Zones, [Azure Backup](https://www.m365.fm/entity/azure-backup/), Site Recovery and Advisor for that work.

## How a machine comes into existence

**Cloud PC (Enterprise).** You assign a license and put the user in a Microsoft Entra group targeted by a provisioning policy (Intune admin center, **Devices** > **Provision Cloud PCs** > **Provisioning policies** > **Create policy**). Windows 365 then runs three stages: core provisioning (capacity, VM, network, Microsoft Entra ID join, Intune enrollment), post-provisioning configuration, and assignment. Post-provisioning hides the Start menu power icons, disables the Windows reset action (`reagentc.exe /disable`) and inbound port 3389, and sets the PowerShell execution policy to RemoteSigned. Learn warns that an AllSigned policy can override this and make provisioning fail. If an optimization fails, the Cloud PC is marked **Success with warnings**, and you can reprovision to retry.

Other Windows 365 types differ. Learn says Reserve Cloud PCs are provisioned through the **Provision** device action in Intune, or by users in the Windows App if you enable that setting, not automatically when the policy is created. A Flex Shared assignment takes a friendly name and a Cloud PC number for the group rather than one Cloud PC per user.

**Session host.** You add VMs yourself. With the standard management approach you create the VM with your preferred method and register it with a registration token. With a session host configuration (pooled host pools only), you add hosts by increasing the host pool size, and you cannot retrieve a registration token for hosts created outside the service. The management approach cannot be changed after creation. See [session host configuration](https://www.m365.fm/entity/avd-session-host-configuration/) and [session hosts](https://www.m365.fm/entity/avd-session-host/).

## Images and updates

| Task | Cloud PC | Session host |
|---|---|---|
| Image source | Gallery images (updated monthly) or up to 20 custom images | Azure Marketplace, Azure Compute Gallery or managed image |
| Image rules | Generalized, single-session, Generation 2 for new images, no recovery partition, no [FSLogix](https://www.m365.fm/entity/fslogix/) components | Must be supported for AVD (the prerequisites page lists Windows 10 and 11 Enterprise multi-session) and match the VM generation |
| Apply a new image to existing machines | Reprovision the Cloud PC | Standard: your own pipeline. Session host configuration: session host update |
| What the update does | Wipes the Cloud PC and deploys a new one | Drains and removes each batch from the host pool, creates replacements from the updated configuration, adds them to the pool, then deletes the original VMs |

Newly provisioned Cloud PCs get the latest image automatically; existing ones need reprovisioning. The session host update page says updates run in batches after one initial host, only one update can run or be scheduled per host pool, and autoscale must be disabled until the update finishes. It also says manually added customizations (files, registry keys, certificates) are not preserved, so they belong in the image, in Intune or Group Policy, or in the custom script. Session host update is only available in the global Azure cloud, and a session host configuration cannot currently use a Compute Gallery image from another subscription.

## Fixing a broken machine

Cloud PC repair is a menu of Intune remote actions. Learn's remote actions include restart, troubleshoot, resize, restore, reprovision, deprovision, collect diagnostics and sync. Bulk device actions (**Devices** > **All devices** > **Bulk device actions**) run for up to 5,000 Cloud PCs at a time and need a user group, not a device group.

The table describes Windows 365 Enterprise:

| Action | Effect on data | Notes from Learn |
|---|---|---|
| Restart, rename | None | |
| Resize | Preserved | Takes 15 to 20 minutes, disconnects the user (unsaved work might be lost), cannot reduce disk size, not supported for GPU Cloud PCs |
| Restore | Changes after the restore point are lost | Short-term points every 4, 6, 12, 16 or 24 hours, long-term points every 7 days, one manual point per Cloud PC |
| Reprovision | All data, apps and settings deleted | Learn says organizations often reserve it as a last resort; needs status **Failed** or **Provisioned** |

For a session host, the first tool is [drain mode](https://www.m365.fm/entity/avd-drain-mode/): the host accepts no new sessions while existing connections stay (portal path **Azure Virtual Desktop** > **Host pools** > your pool > **Session hosts**, then **Turn drain mode on**; the Desktop Virtualization Session Host Operator role is required). What comes next depends on the management approach. With standard management you manage the hosts yourself, so in our reading the usual Azure VM tools apply: restart, resize, restore from your own backup, or replace the VM. With a session host configuration, Learn says session hosts cannot be updated individually or changed outside the service with standard-management tools. You change size or image in the configuration and apply it with session host update, which replaces the VMs.

## Scaling and capacity

A Cloud PC does not scale in the host-pool sense. For Windows 365 Enterprise, Learn says its size is tied to the user's license, and you change it by resize. With group-based licenses the Cloud PC enters **Resize pending license** for 48 hours. The resize starts only when the source license is removed and the target license is assigned, in either order. If the source license is removed but no target license arrives within 48 hours, the device goes into a grace period; if neither happens, it returns to **Provisioned**.

Flex differs. In Dedicated mode you pick the size per group in the provisioning policy assignment and change it there; Shared mode Cloud PCs cannot be resized. Learn's Flex overview still lists the Resize remote action as not yet supported.

Session hosts scale with autoscale. Power management autoscaling is generally available and works for pooled and personal host pools. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. [Dynamic autoscale](https://www.m365.fm/entity/avd-dynamic-autoscaling/) needs a pooled host pool with a session host configuration and can also create and delete session hosts, which [power management autoscaling](https://www.m365.fm/entity/avd-power-management-autoscaling/) cannot.

## Ending the machine's life

For Windows 365 Enterprise, removing a user's license or targeted provisioning policy puts the Cloud PC into a seven-day grace period. Learn says that afterwards Windows 365 deprovisions the Cloud PC and its storage completely, and that **Deprovision now** ends the grace period early and is a destructive action that deletes the operating system and data. Flex Dedicated also moves into a grace period when users leave the group. Removing the group from a Flex Shared assignment deprovisions its Cloud PCs without a grace period. Reserve Cloud PCs are returned (deprovisioned) by users or admins. For session hosts with a session host configuration, session host update deletes the original VMs but not the Active Directory computer objects: the replacement inherits the object, and after a domain change you remove the orphaned objects from the previous domain.

## Monitoring and networking

Cloud PC monitoring lives in Intune: the Cloud PC actions report (**Devices** > **Monitor**) shows action status. With your own network, Azure network connection health checks cover domain join, endpoint connectivity, subnet IP usage, enrollment restrictions and single sign-on.

AVD monitoring is something you assemble. [AVD Insights](https://www.m365.fm/entity/avd-insights/) is built on Azure Monitor workbooks and needs a Log Analytics workspace, diagnostic settings on host pools and workspaces, and data collection from session hosts through the [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/) with a managed identity. The Desktop Virtualization Reader and Log Analytics Reader roles are required, and standard Log Analytics storage charges apply. The agent is not installed automatically on hosts replaced by session host update.

## A short operations checklist

1. Decide who triggers repairs: write down your restore point interval and who may restore Enterprise Cloud PCs, and tell users that reprovision deletes local data and that resize can lose unsaved work.
2. For Flex and Reserve, check the provisioning and resize rules above before copying an Enterprise runbook.
3. For session hosts, define how profiles, images and backup are handled before the first user signs in.
4. Pilot one failure of each kind (bad image, broken machine, network fault) and time the recovery.

## Sources

- [Microsoft Learn: Windows 365 architecture](https://learn.microsoft.com/en-us/windows-365/enterprise/architecture)
- [Microsoft Learn: Compare Windows 365 Cloud PCs to Azure Virtual Desktop (training unit)](https://learn.microsoft.com/en-us/training/modules/examine-windows-365/3-compare-windows-365-azure-virtual-desktop)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Microsoft Learn: Resize Windows 365 Flex Cloud PCs in Dedicated mode](https://learn.microsoft.com/en-us/windows-365/enterprise/resize-windows-365-flex-cloud-pc)
- [Microsoft Learn: What is Windows 365 Reserve?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-reserve)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Create provisioning policies for Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/create-provisioning-policy)
- [Microsoft Learn: Automated provisioning steps for Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/automated-provisioning-steps)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Windows 365 device images](https://learn.microsoft.com/en-us/windows-365/enterprise/device-images)
- [Microsoft Learn: Session host update in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Remotely manage Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/remotely-manage-cloud-pc)
- [Microsoft Learn: Resize a Cloud PC](https://learn.microsoft.com/en-us/windows-365/enterprise/resize-cloud-pc)
- [Microsoft Learn: Point-in-time restore for Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/restore-overview)
- [Microsoft Learn: Reprovision a Cloud PC](https://learn.microsoft.com/en-us/windows-365/enterprise/reprovision-cloud-pc)
- [Microsoft Learn: Windows 365 lifecycle](https://learn.microsoft.com/en-us/windows-365/enterprise/lifecycle)
- [Microsoft Learn: End the grace period for Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/end-grace-period)
- [Microsoft Learn: Azure network connection health checks in Windows 365](https://learn.microsoft.com/en-us/troubleshoot/windows-365/health-checks)
- [Microsoft Learn: Set drain mode on session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/drain-mode)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Azure Virtual Desktop Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
- [Microsoft Learn: What's new in Windows 365](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft Tech Community (Windows IT Pro Blog): Windows 365, how to choose the connection method](https://techcommunity.microsoft.com/t5/windows-it-pro-blog/windows-365-how-to-choose-the-best-connection-method-for-your/ba-p/4463228)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
