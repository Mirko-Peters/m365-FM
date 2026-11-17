---
title: "Managing Windows 365 alongside AVD with Nerdio"
summary: "Nerdio Manager for Enterprise can manage Windows 365 Cloud PCs in the same console as Azure Virtual Desktop host pools. It builds on Intune and the Windows 365 service rather than replacing them, so the useful question is which tasks you want in one place."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-365, nerdio-manager-for-enterprise]
keypoints:
  - "Enabling Windows 365 in Nerdio Manager needs a Global Administrator, plus an Intune license and a Windows 365 license in the tenant where Nerdio Manager is installed."
  - "The Windows 365 menu has pages for Enterprise, Flex Dedicated, Flex Shared and Cloud Apps. Windows 365 Frontline is now Windows 365 Flex; Nerdio's notes record the rename in 8.1.0."
  - "Provisioning policies, Cloud PC actions and alerts exist in Nerdio and in Intune. Nerdio adds a shared console with AVD, User Experience Sync and Cloud Apps setup, and migration."
  - "Enterprise-to-AVD and AVD-to-Flex Dedicated migration are Public Preview; AVD-to-Enterprise was announced as GA in 8.1.0. Flex Dedicated is the only Flex migration target."
  - "Removing a Cloud PC in Nerdio is permanent and drops the user from the policy's provisioning groups. License cleanup is off by default; the notes name Enterprise Cloud PCs for it."
faq:
  - q: "Do I need Nerdio to manage Windows 365 Cloud PCs?"
    a: "No. Microsoft's own tools cover provisioning policies, remote actions and alerts: Learn says Flex Cloud PCs are managed in Microsoft Intune, with provisioning, policies, remote actions and reporting. Nerdio Manager is an additional layer that adds a shared console with AVD and tasks such as migration between AVD and Windows 365."
  - q: "Does Nerdio Manager support Windows 365 Flex, formerly Frontline?"
    a: "Yes. Nerdio's help describes Flex Dedicated and Flex Shared pages, a Flex Shared provisioning policy with User Experience Sync, and Cloud Apps. Nerdio's release notes for version 8.1.0 list the rename from Frontline to Flex, although some Nerdio pages still use the old name, for example a User Experience Sync alert condition and the licensing advisor description on Nerdio's Windows 365 marketing page."
  - q: "Can I move users between AVD personal desktops and Windows 365 with Nerdio?"
    a: "Nerdio documents three paths. AVD personal hosts can be migrated to Windows 365 Enterprise (general availability announced with 8.1.0) or to Flex Dedicated, and Windows 365 Enterprise Cloud PCs can be migrated to AVD Personal. The Enterprise-to-AVD and Flex Dedicated pages both say Public Preview from Nerdio Manager for Enterprise 8.2, while the release notes mention Flex Dedicated as a destination already in 8.1.1."
---

Nerdio Manager for Enterprise can manage Windows 365 Cloud PCs in the same console as Azure Virtual Desktop host pools, using its Intune integration. It is a management layer on top of the Windows 365 service and Intune, not a replacement. This article covers enabling it, where Intune does the same job, the permissions each task needs, and the migration paths between AVD and Windows 365.

## What the integration is

[Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) from [Nerdio](/entity/nerdio/) is known for [Azure Virtual Desktop](/entity/azure-virtual-desktop/) management. Its Windows 365 support works through [Intune](/entity/intune/), where the Windows 365 permission is set. [Windows 365](/entity/windows-365/) stays the Microsoft service that provisions the Cloud PCs.

## Prerequisites

Per Nerdio's help page "Windows 365: Enable and configure Cloud PCs":

- The person enabling the feature must be a Global Administrator.
- The [Microsoft Entra ID](/entity/entra-id/) tenant where Nerdio Manager is installed needs an Intune license and a Windows 365 license.
- Entra ID must approve the application permission consent request.
- Network: Nerdio's page says Enterprise Cloud PCs need Active Directory with hybrid Entra ID sync and a network connection. Learn is more specific: Microsoft Entra join can use a Microsoft hosted network or an Azure network connection (ANC); only Hybrid Microsoft Entra join requires an ANC.

## Enable Windows 365 in Nerdio Manager

1. Go to **System > Settings > Integrations** and select **Configure** next to Current Status in the Intune section.
2. Switch Current Status on, choose the configurable features and permissions (Nerdio's Cloud Apps page and the two AVD-to-Windows 365 migration pages require Windows 365 set to Manage; the Enterprise-to-AVD page lists only Group membership: Manage).
3. Save. A "hide individual Cloud PC hosts page" toggle decides whether Cloud PCs appear under **Endpoints > Windows 365** or only under **Endpoints > Intune > All Devices**.
4. Under **Cloud Desktops > Windows 365**, use the Network Connections area to create an Azure network connection: name, network type, NIC resource group, network and subnet, AD profile. Health checks can take 30 to 60 minutes or more.
5. Create a provisioning policy: name, description, license type, Cloud PC image, language and region, network connection, optional device name template. The Enterprise form has no group field; the page maps a policy to an assignment of Entra ID security groups, and a Policy Assignments tab shows desktops grouped by policy. The Flex Shared and Cloud Apps dialogs below include the group assignment.
6. Assign Cloud PC licenses in the Microsoft 365 admin portal. Per Nerdio, users in an assigned group with a healthy network and image normally get a Cloud PC within 30 to 60 minutes.

On paths: this procedure still says **Cloud Desktops > Windows 365**, while the page's top note and the 8.2.0 release notes describe one page per provisioning type. Nerdio's help does not name the restructured location of Network Connections; look on the page for your provisioning type.

A forced region change shuts down Cloud PCs and can take hours. **Force apply configuration** (policy action menu) offers Entra single sign-on for all devices, and region or network connection for all or for selected devices. SSO has no selected-devices option.

## The Nerdio menus after the Flex rename

Microsoft's What's new page says that in the week of 4 May 2026 Windows 365 Frontline was renamed [Windows 365 Flex](/entity/windows-365-frontline/), with product, licensing and capabilities unchanged. Nerdio's release notes list the rename under 8.1.0 (21 July 2026) and, under 8.2.0, a menu with pages for Enterprise, Flex Dedicated, Flex Shared and Cloud Apps.

Per Learn, one Dedicated license provisions up to three Cloud PCs, each for one user. One Shared license provisions one Cloud PC that a group shares, one user at a time; user data is deleted after each session unless User Experience Sync is enabled. Learn's Flex overview still lists Resize as not yet supported, but What's new (March 2026) says resize for Flex dedicated Cloud PCs is generally available, so check the current page.

## Where Nerdio and Intune overlap

| Task | Nerdio Manager (help pages) | Intune admin center (Learn) |
|---|---|---|
| Provisioning policy | Cloud Desktops > Windows 365, page for the policy type | Devices > Provision Cloud PCs > Provisioning policies |
| Network connection | Network Connections area (enable page) | Azure network connections |
| Cloud PC actions | Endpoints > Windows 365 > Cloud PCs or Endpoints > Intune > All Devices: sync, scans, restart, reprovision, restore, resize, remove | Remote actions such as Sync, Restart, Reprovision, Restore, Resize, Deprovision; bulk under Devices > All devices (up to 5,000 Cloud PCs) |
| Alerts | Alerts page (Notifications > Windows 365 per the 8.2.1 notes); Intune Administrator or Windows 365 Administrator role | Tenant administration > Cloud PC Alerts, with alert rules for conditions, severity, console and email notification; same two roles |

Nerdio's pages disagree on the alert location: the top note and release notes say the Alerts page, while the Manage Cloud PCs list names a Cloud PC Alerts tab. Since 8.2.0, editing a Cloud PC alert rule's conditions in Nerdio changes the Intune alert rule itself.

For a tenant that runs only Cloud PCs, Intune already provides policies, remote actions and alerts. Nerdio changes the picture when one team also runs AVD pools and wants one console, one RBAC model, or the migration wizards.

## Flex Shared: User Experience Sync and Cloud Apps

Learn documents both as Windows 365 features: User Experience Sync is enabled in a Flex Shared policy, and the experience type "Access only apps" provides Cloud Apps. Two Nerdio pages describe the setup in its console.

**User Experience Sync.** Open **Cloud Desktops > Windows 365 > Flex Shared > Provisioning Policies**. Set License type to Flex and Shared mode, choose the image and network, optionally tick Entra single sign-on, pick the license assignment mode (Manual or Automatic), tick **Enabled** next to User experience sync and choose a storage size. Nerdio shows a recommended per-user size and a capacity warning. Under **Manual Entra ID Group Assignments**, select the group and Cloud PC size, enter an assignment name and the number of Cloud PCs, select **Assign**, then **OK**. You can edit any policy without an active assignment; on an assigned policy, changing the User Experience Sync setting means removing and re-adding the assignment, which deprovisions and reprovisions the affected Cloud PCs. The related alert condition is still named "Frontline Cloud PC User Experience Sync Storage Limits".

**Cloud Apps.** Nerdio's prerequisites: Windows 365 set to Manage, enough Flex licenses for concurrent users (others are denied), and an image containing the apps. The policy uses license type Flex, mode Shared, experience Cloud App, and a manual Entra ID group assignment as above, then Save. The app list fills after a short interval; per Nerdio, an empty list right after creation is not a misconfiguration. Under **Cloud Desktops > Windows 365 > Cloud Apps**, an app showing Ready can be published; Reset & Publish retries one in error.

## Moving between AVD personal and Windows 365

Nerdio documents three migration paths.

**AVD personal host to Windows 365 Enterprise.** Go to **Cloud Desktops > Azure Virtual Desktop > Workspaces**, select the workspace, then use a host pool's more options menu (**Hosts > Migrate to Windows 365**) or a host's, or choose **Migrate to Windows 365 for selected (x)** for bulk. The wizard covers users, Provisioning Policy, User Settings (source type Image or Snapshot), optional Schedule (no repeats), Cleanup (a deletion date and time) and Notifications. The 8.2.0 release notes say the agent is removed from the source VM as part of the cleanup step; the page does not list what else is deleted, while the Flex Dedicated page below says the VM is deleted. With the message enabled, active users are notified and the host enters drain mode first. Per the release notes, general availability of this path was announced with 8.1.0, and 8.2.1 removed the Device name template field because it did not apply: migrated Cloud PCs keep the AVD host name.

**AVD personal host to Flex Dedicated.** The release notes list Public Preview from 8.1.1; the Nerdio page says available from 8.2 and in Public Preview. Flex Dedicated is the only Flex mode supported as a target, because Shared has no per-user license assignment. The tenant needs an active Flex Dedicated service plan with free licenses, and the user must not hold an unassigned Windows 365 Enterprise license. The user's User Settings policy must use a Snapshot source, otherwise provisioning from the image discards profile, apps and data. Bulk runs default to 60 hosts. Cleanup removes the AVD agent and deletes the source VM.

**Windows 365 Enterprise to AVD Personal.** Start at **Cloud Desktops > Windows 365 > Enterprise**, Cloud PCs tab, and choose **Migrate to AVD**; progress shows under **Cloud Desktops > Migrate > Migrations**. The page says Public Preview from 8.2. Limits:

- The license type must be Windows 365 Enterprise; the Cloud PC must be provisioned, not under review, not in grace period.
- The AVD Personal host pool and a storage account must exist. The target VM uses Standard security (no Trusted Launch or Confidential VM), no Ephemeral OS disks, and a disk at least as large as the source. In an Entra-joined pool, the VM name must differ from the Cloud PC name.
- Each migration places the source Cloud PC under review to export its VHD; Microsoft allows 10 at once.
- With **Deprovision Cloud PC** on, the Cloud PC is permanently and immediately deleted. Off, it stays under review and counts against the limit.

## Permissions by task

| Task | Nerdio role | Further permissions (Nerdio help) |
|---|---|---|
| AVD to Windows 365 Enterprise | Not stated | Intune: managed devices Read-only or higher, Group membership Manage, Windows 365 Manage |
| AVD Personal to Flex Dedicated | Admin, or custom role with Manage on Migrate, Windows 365, Workspaces | Same Intune access plus Graph Group.ReadWrite.All. Without the Nerdio access, Migrate to Windows 365 is not shown |
| Enterprise to AVD Personal | Same | Intune Group membership Manage; Graph GroupMember.ReadWrite.All for Deprovision, LicenseAssignment.Read.All for the license-group checkbox; direct license unassignment needs Enterprise license management |
| Cloud Apps | Admin, or custom role with Full access in INTUNE > WINDOWS 365 | Windows 365 set to Manage |

## Day two: removing Cloud PCs

**Remove** permanently deletes the Cloud PC and removes the user from the provisioning groups of its policy; it cannot be undone. Two independent license cleanup options (remove the user from license-assigning groups, unassign direct licenses) are off by default, and a license left assigned keeps consuming a seat. Direct unassignment needs LicenseAssignment.ReadWrite.All. The admin types Confirm to proceed. The 8.2.0 release notes name Enterprise Cloud PCs for license unassignment; the help page names no type, so check Flex before relying on it.

## Choosing: a short checklist

1. Run only Cloud PCs? Check Intune first.
2. Run AVD and Cloud PCs with one team? A shared console may reduce tool switching.
3. Need AVD-to-Windows 365 moves? Confirm the preview status of your path.
4. Use Flex Shared with User Experience Sync? Decide the setting before assignment.

## Related

- [Windows 365](/entity/windows-365/)
- [Windows 365 Flex (formerly Frontline)](/entity/windows-365-frontline/)
- [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/)
- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Personal host pools](/entity/avd-personal-host-pool/)
- [Intune](/entity/intune/)

## Sources

- [Nerdio Help: Enable and configure Cloud PCs](https://nmehelp.getnerdio.com/hc/en-us/articles/25499404997901)
- [Nerdio Help: Manage and publish Cloud Apps](https://nmehelp.getnerdio.com/hc/en-us/articles/45339575273997)
- [Nerdio Help: User Experience Sync for Flex in Shared mode](https://nmehelp.getnerdio.com/hc/en-us/articles/48600318419725-Use-Nerdio-Manager-to-configure-and-manage-User-Experience-Sync-for-Windows-365-Flex-in-Shared-mode)
- [Nerdio Help: Migrate from AVD to Windows 365](https://nmehelp.getnerdio.com/hc/en-us/articles/40495096222477-Migrate-from-AVD-to-Windows-365-Cloud-PCs)
- [Nerdio Help: Migrate from AVD Personal to Flex Dedicated](https://nmehelp.getnerdio.com/hc/en-us/articles/49560126638093-Migrate-from-AVD-Personal-to-Windows-365-Flex-Dedicated)
- [Nerdio Help: Migrate from Windows 365 Enterprise to AVD Personal](https://nmehelp.getnerdio.com/hc/en-us/articles/49560126619277-Migrate-from-Windows-365-Enterprise-to-AVD-Personal)
- [Nerdio Help: Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677)
- [Nerdio: Nerdio for Windows 365](https://getnerdio.com/nerdio-windows-365/)
- [Learn: What's new in Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
- [Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Learn: Manage Windows 365 Flex Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-flex-manage)
- [Learn: Create a provisioning policy](https://learn.microsoft.com/en-us/windows-365/enterprise/create-provisioning-policy)
- [Learn: Remotely manage Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/remotely-manage-cloud-pc)
- [Learn: Alerts in Windows 365](https://learn.microsoft.com/en-us/windows-365/enterprise/alerts)
