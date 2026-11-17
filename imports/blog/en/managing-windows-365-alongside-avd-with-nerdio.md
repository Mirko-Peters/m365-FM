---
title: "Managing Windows 365 alongside AVD with Nerdio"
summary: "Nerdio Manager for Enterprise can manage Windows 365 Cloud PCs in the same console as Azure Virtual Desktop host pools. It builds on Intune and the Windows 365 service rather than replacing them, so the useful question is which tasks you want in one place."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [windows-365, nerdio-manager-for-enterprise]
keypoints:
  - "Nerdio Manager for Enterprise manages Cloud PCs through its Intune integration. Enabling it needs a Global Administrator, plus an Intune license and a Windows 365 license in the tenant where Nerdio Manager is installed."
  - "The Windows 365 menu in Nerdio Manager has separate pages for Enterprise, Flex Dedicated, Flex Shared and Cloud Apps. Windows 365 Frontline is now called Windows 365 Flex; Nerdio's release notes record the rename in version 8.1.0."
  - "Provisioning policies, network connections and Cloud PC actions exist in both Nerdio Manager and the Intune admin center, so the overlap is large. Nerdio's help pages add migration between AVD and Windows 365 and Flex Shared User Experience Sync management."
  - "Migrating an AVD personal host to Windows 365 is documented in Nerdio's help. Moving a Windows 365 Enterprise Cloud PC to AVD Personal and the Flex Dedicated destination are described as Public Preview."
  - "Removing a Cloud PC in Nerdio Manager is permanent, and an Enterprise-to-AVD migration with Deprovision switched on deletes the source Cloud PC immediately."
faq:
  - q: "Do I need Nerdio to manage Windows 365 Cloud PCs?"
    a: "No. Microsoft's own tools cover provisioning policies and remote actions: Learn says Flex Cloud PCs are managed in Microsoft Intune, with provisioning, policies, remote actions and reporting. Nerdio Manager is an additional layer that adds a shared console with AVD and the tasks listed in Nerdio's help, such as migration between AVD and Windows 365."
  - q: "Does Nerdio Manager support Windows 365 Flex, formerly Frontline?"
    a: "Yes. Nerdio's help describes Flex Dedicated and Flex Shared pages, a Flex Shared provisioning policy with User Experience Sync, and Cloud Apps. Nerdio's release notes for version 8.1.0 list the rename from Frontline to Flex. One Nerdio marketing page retrieved on 17 November 2026 still says Frontline."
  - q: "Can I move users between AVD personal desktops and Windows 365 with Nerdio?"
    a: "Nerdio documents both directions. AVD personal hosts can be migrated to Cloud PCs, and Windows 365 Enterprise Cloud PCs can be migrated to AVD Personal. The Enterprise-to-AVD page says that path is in Public Preview, and the release notes label Flex Dedicated as a destination in Public Preview."
---

Nerdio Manager for Enterprise can manage Windows 365 Cloud PCs in the same console as Azure Virtual Desktop host pools, using its Intune integration. It is a management layer on top of the Windows 365 service and Intune, not a replacement for them. This article shows how to switch it on, what the Nerdio menus cover, where Intune already does the same job, and how the migration paths between AVD and Windows 365 work.

The comparison of the two services themselves, and the Flex cost model, are covered elsewhere on this site. Here the focus is day-two operations for an admin who runs both.

## What the integration is

[Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) from [Nerdio](/entity/nerdio/) is known for [Azure Virtual Desktop](/entity/azure-virtual-desktop/) management. Its Windows 365 support works through [Intune](/entity/intune/): Nerdio's help page on enabling Cloud PCs starts with the Intune integration, and the Windows 365 permission is set there. [Windows 365](/entity/windows-365/) itself stays a Microsoft service, and Cloud PCs are still provisioned by it. Nerdio's page for Windows 365 describes the product as a way to deploy, manage and optimize Cloud PCs; those are Nerdio's own claims, and the sections below stay with what the help pages document.

## Prerequisites

Per Nerdio's help page "Windows 365: Enable and configure Cloud PCs":

- The person enabling the feature must be a Global Administrator.
- The [Microsoft Entra ID](/entity/entra-id/) tenant where Nerdio Manager is installed needs an Intune license and a Windows 365 license.
- Entra ID must approve the application permission consent request. If a "grant consent on behalf of your organization" option appears, select it.
- Enterprise Cloud PCs on a customer network need Active Directory with hybrid Entra ID sync and a network connection. The policy form also offers a Microsoft-hosted network option that does not need on-premises AD.

## Enable Windows 365 in Nerdio Manager

1. Go to **System > Settings > Integrations** and select **Configure** next to Current Status in the Intune section.
2. Switch Current Status on, choose the configurable features and their permissions (set Windows 365 to Manage), and set the device visibility limits: device type scope, Entra ID group limits, and whether devices without a primary user are included.
3. Save. A toggle named "hide individual Cloud PC hosts page" decides whether Cloud PCs appear under **Endpoints > Windows 365** or only under **Endpoints > Intune > All Devices**. Management functions work either way, according to the page.
4. Under **Cloud Desktops > Windows 365 > Network Connections**, create a connection if you use an Azure network: name, network type, resource group for the NICs, network and subnet, and an AD profile. Windows 365 then runs health checks, which Nerdio says can take 30 to 60 minutes or more and must pass before provisioning.
5. Under **Cloud Desktops > Windows 365 > Provisioning Policies**, create a policy: name, license type, image (Nerdio-managed, gallery or custom), language and region, network connection, optional device naming template, and the Entra ID security groups it applies to.
6. Assign Cloud PC licenses to users in the Microsoft 365 admin portal. The license SKU sets the VM size. Users in the policy's group with a healthy network connection and image normally get a Cloud PC within 30 to 60 minutes, per Nerdio.

Editing a policy later has consequences. Nerdio's page says a forced region change shuts down the Cloud PCs and can take hours, and that configuration changes such as SSO or region and network changes can be force-applied to all or selected devices.

## The Nerdio menus after the Flex rename

Microsoft's What's new page says that in the week of 4 May 2026 Windows 365 Frontline was renamed [Windows 365 Flex](/entity/windows-365-frontline/), with product, licensing and capabilities unchanged. Nerdio's release notes list the same rename under version 8.1.0 (21 July 2026). The Windows 365 menu in Nerdio Manager now has separate pages for Enterprise, Flex Dedicated, Flex Shared and Cloud Apps. Nerdio's release notes for 8.2.0 describe this as a menu restructure.

Two modes sit behind the Flex pages, according to Learn. In Dedicated mode one license provisions up to three Cloud PCs, each assigned to one user and used non-concurrently. In Shared mode one license provisions one Cloud PC that a group shares one user at a time, and user data is deleted at sign-out. Shared mode is available only in Azure Global Cloud.

## Where Nerdio and Intune overlap

The Intune admin center is the native console for Cloud PCs. Learn describes provisioning policies under **Devices > Provision Cloud PCs > Provisioning policies**, and bulk device actions under **Devices > All devices > Bulk device actions** (up to 5,000 Cloud PCs at a time, user groups only). The table compares what the sources document.

| Task | Nerdio Manager (help pages) | Intune admin center (Learn) |
|---|---|---|
| Provisioning policy | Cloud Desktops > Windows 365 > Provisioning Policies | Devices > Provision Cloud PCs > Provisioning policies |
| Network connection | Cloud Desktops > Windows 365 > Network Connections | Azure network connections |
| Device actions | Sync, quick and full scan, change primary user, update Defender, rotate local admin password, restart, reprovision, restore, resize, remove | Remote actions such as Sync, Quick Scan, Full Scan, Restart, Reprovision, Restore, Resize, Update Windows Defender, Deprovision |
| Alerts and reporting | Cloud PC Alerts tab; needs the Intune Administrator or Windows 365 Administrator Entra role | Cloud PC actions report under Devices > Monitor (a report of actions taken, not alert rules) |
| AVD host pools in the same console | Yes | No, separate Azure portal |

Learn also marks Power On and Power Off for Flex Cloud PCs as (preview) in its remote actions list. The device-action list on Nerdio's enable page does not include those two actions.

An honest reading of the table: for a tenant that runs only Cloud PCs, Intune already provides provisioning policies and remote actions. Nerdio changes the picture when the same team also runs AVD pools and wants one place for both, one RBAC model, or the migration wizards. Whether that is worth another subscription is an operational and cost decision that these pages do not answer. Nerdio's marketing page lists a TCO calculator and a licensing advisor; treat those as vendor statements and compare against your own numbers.

## Flex Shared: User Experience Sync and Cloud Apps

Two Nerdio help pages cover Flex Shared specifically.

**User Experience Sync.** To configure it, open **Cloud Desktops > Windows 365 > Flex Shared > Provisioning Policies** and create or edit a policy. Set License type to Flex and Shared mode, choose the image, network type, region and connection option, tick the **Enabled** checkbox next to User experience sync, and pick a storage size. Then assign Entra ID groups with a Cloud PC size, an assignment name and a number of Cloud PCs. The page says a policy can be edited only when it has no active assignment, and changing the Enabled setting on an assigned policy means removing and re-adding the assignment, which deprovisions and reprovisions the affected Cloud PCs. Plan this change before users are assigned.

**Cloud Apps.** In the Nerdio help page for publishing Cloud Apps, the prerequisites include Windows 365 set to Manage, enough Flex licenses for the users who access published apps at the same time (users beyond that are denied until sessions drop), and an image that contains the apps. The policy uses license type Flex, mode Shared and experience Cloud App. Publishing then happens under **Cloud Desktops > Windows 365 > Cloud Apps**: an app showing Ready can be published, and Reset & Publish retries an app in error. Learn's What's new lists adding Cloud Apps from a file path as generally available since the week of 31 August 2026.

## Moving between AVD personal and Windows 365

Nerdio documents migration in both directions. Pooled hosts are not part of these pages.

**AVD personal host to Windows 365.** The wizard starts from **Workspaces**: select the workspace and host pool, then **Migrate to Windows 365** (also as a bulk action for selected hosts or pools). Nerdio lists these permissions: Intune managed devices at least read-only, Group membership Manage, Windows 365 Manage. The wizard tabs are Assign users to hosts, Provisioning Policy, User Settings, an optional Schedule, optional Cleanup and optional Notifications. A schedule cannot repeat. If the message is enabled, users with active sessions are notified and the host goes into drain mode before the migration starts. Nerdio's release notes say AVD Personal to Windows 365 Enterprise migration became generally available in version 8.1.0, and that Flex Dedicated as a destination arrived in Public Preview in 8.1.1.

**Windows 365 Enterprise to AVD Personal.** Start at **Cloud Desktops > Windows 365 > Enterprise > Cloud PCs**, select the Cloud PCs and choose **Migrate to AVD**; progress shows under **Cloud Desktops > Migrate > Migrations**. This page says the path is in Public Preview from Nerdio Manager for Enterprise 8.2. Its prerequisites and limits are specific:

- The Cloud PC must be provisioned (or provisioned with warnings), not under review, and not in its grace period.
- The target AVD Personal host pool and a storage account must already exist. The target VM uses Standard security; Trusted Launch and Confidential VM are not available. Ephemeral OS disks are not supported, and the target disk cannot be smaller than the source.
- Every migration places the source Cloud PC under review so Nerdio can export its VHD. Microsoft allows 10 Cloud PCs under review at once.
- With **Deprovision Cloud PC** on, the Cloud PC is permanently and immediately deleted. With it off, the Cloud PC stays under review and counts against the limit until someone removes it.

Illustrative example: an admin moves 12 AVD personal hosts for a project team to Windows 365. They create a policy first, schedule the migration outside working hours with the user message enabled, and set a cleanup date a week later so the old hosts can still be checked. That sequence is an operating choice built on the documented Schedule and Cleanup tabs, not a Nerdio recommendation.

## Choosing: a short checklist

1. Run only Cloud PCs? Check Intune first; it covers policies and remote actions.
2. Run AVD and Cloud PCs with one team? A shared console and RBAC may reduce tool switching. Test with a pilot.
3. Need AVD-to-Windows 365 moves? Confirm the preview status of your direction and destination on the current Nerdio page.
4. Use Flex Shared with User Experience Sync? Decide the setting before assignment.
5. Whoever removes Cloud PCs needs to know the action is permanent.

## Related

- [Windows 365](/entity/windows-365/)
- [Windows 365 Flex (formerly Frontline)](/entity/windows-365-frontline/)
- [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/)
- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Personal host pools](/entity/avd-personal-host-pool/)
- [Intune](/entity/intune/)

## Sources

Retrieved on 17 November 2026.

- [Nerdio Help: Windows 365: Enable and configure Cloud PCs](https://nmehelp.getnerdio.com/hc/en-us/articles/25499404997901)
- [Nerdio Help: Manage and publish Windows 365 Cloud Apps](https://nmehelp.getnerdio.com/hc/en-us/articles/45339575273997)
- [Nerdio Help: Use Nerdio Manager to configure and manage User Experience Sync for Windows 365 Flex in Shared mode](https://nmehelp.getnerdio.com/hc/en-us/articles/48600318419725-Use-Nerdio-Manager-to-configure-and-manage-User-Experience-Sync-for-Windows-365-Flex-in-Shared-mode)
- [Nerdio Help: Migrate from AVD to Windows 365 Cloud PCs](https://nmehelp.getnerdio.com/hc/en-us/articles/40495096222477-Migrate-from-AVD-to-Windows-365-Cloud-PCs)
- [Nerdio Help: Migrate from Windows 365 Enterprise to AVD Personal](https://nmehelp.getnerdio.com/hc/en-us/articles/49560126619277-Migrate-from-Windows-365-Enterprise-to-AVD-Personal)
- [Nerdio Help: Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677)
- [Nerdio: Nerdio for Windows 365](https://getnerdio.com/nerdio-windows-365/)
- [Microsoft Learn: What's new in Windows 365](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft Learn: What is Windows 365 Flex?](https://learn.microsoft.com/en-us/windows-365/enterprise/introduction-windows-365-flex)
- [Microsoft Learn: Manage Windows 365 Flex Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/windows-365-flex-manage)
- [Microsoft Learn: Create a provisioning policy](https://learn.microsoft.com/en-us/windows-365/enterprise/create-provisioning-policy)
- [Microsoft Learn: Remotely manage Windows 365 Cloud PCs](https://learn.microsoft.com/en-us/windows-365/enterprise/remotely-manage-cloud-pc)
