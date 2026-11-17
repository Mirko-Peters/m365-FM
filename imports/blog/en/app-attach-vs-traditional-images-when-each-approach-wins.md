---
title: "App attach vs traditional images: when each approach wins"
summary: "App Attach suits apps that change on their own schedule, go to only some users, or exist as MSIX, Appx or App-V packages. Baking apps into the image suits stable, common, unpackaged apps and avoids the extra file share and certificate chain."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [msix-app-attach, azure-virtual-desktop]
keypoints:
  - "In the golden-image model, an app change typically means a new image version and a session host update. With App Attach, Learn says a new app version comes from a new disk image and needs no maintenance window; users get it at their next sign-in."
  - "App Attach assigns apps per user and per host pool, so users on the same multi-session host can see different apps. An image gives every user of the host the same installed apps."
  - "App Attach adds dependencies: an SMB file share in the same region, read access for each session host's computer account, trusted code signing certificates, and packages in MSIX, Appx or App-V format."
  - "Learn lists Microsoft Entra Domain Services as not supported for App Attach and lists Windows Server 2022 and 2025 as supported as of 14 April 2026."
  - "The two approaches can be combined. Our reading: apps every user needs and apps that cannot be packaged stay in the image, while fast-changing or group-specific apps are good candidates to attach."
faq:
  - q: "Does App Attach replace a golden image?"
    a: "No. Learn's overview says App Attach makes it easier to create custom images, and the setup article says it lets you create fewer custom images. Neither removes the image: the session host still needs an operating system image, and App Attach changes where the applications come from."
  - q: "What happens to apps I install by hand on session hosts when I update the image?"
    a: "On a host pool with a session host configuration, Learn says customizations added manually, such as files, registry keys or certificates, are not present after a session host update. Put them in the image, apply them with Intune or Group Policy, or add them to the custom configuration script in the session host configuration."
  - q: "Can Nerdio Manager manage App Attach?"
    a: "Nerdio's knowledge base for Nerdio Manager for Enterprise documents managing App Attach images, packages, image versions and assignments, including a package wizard under Applications > Catalog > App Attach. The underlying Azure Virtual Desktop feature and its requirements are the same."
---
App Attach wins when applications change on a different schedule than the operating system, when only some users should have them, or when the app already exists as an MSIX, Appx or App-V package. A traditional image wins when the apps are common to everyone, rarely change, or cannot be packaged, because then App Attach only adds a file share and a certificate chain. Many designs combine both; that is our reading, not a Microsoft statement. This article gives the criteria, the costs on each side and a short pilot plan. The mechanics of App Attach itself, including the file share, certificates and registration types, are covered in the explainer on MSIX app attach, so they are summarised here only where they affect the decision.

## What each approach asks of you

In the traditional model, applications are installed on a golden image, the image is published as a new version, and session hosts are replaced from it. For a host pool with a session host configuration, Learn's [session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) article describes this as the recommended way of managing updates, within the core source image rather than on each host on a repeated schedule. Two conditions apply. The pool needs a session host configuration; a pool without one is not covered by that article. And session host update is only available in the global Azure cloud, not in clouds such as Azure US Government or Azure operated by 21Vianet. On status, Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

The update deallocates or deletes existing VMs and creates new ones from the new image, in batches. You choose the batch size, users receive a notification and are signed out after a wait you set, and the first host is updated alone as a test. Learn adds that manually added files, registry keys and certificates are gone after the update, so they must be in the image, applied by Intune or Group Policy, or added to the custom configuration PowerShell script. Disable autoscale for the duration of an update, because a scaling plan enabled during an update can make it fail. The article on managing session host updates with a session host configuration covers the procedure.

With [App Attach](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview), the application is not installed on the host or in the image. A disk image on an SMB share is mounted at sign-in and registered for the user. A new version is a new disk image, either as a new application or by updating the existing one in place with a different version number, and users get it at their next sign-in. Learn lists that as an update without a maintenance window.

## Criteria that decide it

The traditional column below is our reading of the golden-image model, not Learn text; the App Attach column follows Learn.

| Criterion | Traditional image (our reading) | App Attach (per Learn) |
|---|---|---|
| App change cadence | Typically a new image version and host update; Intune, Group Policy or a script can also deploy content | New disk image; users get it at next sign-in |
| Who sees the app | Everyone who reaches an updated host, unless other tools restrict it | Per application per user; assignment to host pools and users or groups |
| Several versions at once | Typically one installed version per image | Several versions of one app can run concurrently on a host |
| Package format | Whatever the installer supports | MSIX, Appx or App-V only |
| Dependencies | Image pipeline and gallery | SMB share in the same region, computer-account read access, signed MSIX and Appx packages |
| Identity | No App Attach-specific limit | Microsoft Entra ID and AD DS supported; Microsoft Entra Domain Services not supported |
| Session host OS | Any supported by your pool | Windows client or supported Windows server; Server 2022 and 2025 supported as of 14 April 2026 |
| Sign-in impact | No attach step; Learn gives no figure | On-demand registration (default) avoids added sign-in time; log on blocking can lengthen it |
| Image count | Typically one image per distinct app set | The setup article says you can create fewer custom images |

Two rows deserve emphasis. First, per-user assignment is the clearest reason to attach. Learn's overview says assigning an application to a host pool lets you be selective about where it runs, and that a graphics-intensive application can be kept to a host pool with GPU-optimized session hosts. Our example: an engineering group needs such an application, so you assign it to the GPU pool and to that group. Doing the same with images typically means a separate image and pool for each app combination, unless you deploy apps by other means such as Intune, Group Policy or a script; that too is our reading. Second, the package-format row is the clearest reason not to attach. Learn lists the supported types as MSIX, Appx and App-V, and it does not say which Win32 apps convert cleanly, so packaging success per application is something you test, not assume.

## When a traditional image is the better fit

- **Common apps for every user.** If every user needs the same browser, agent and Office suite, an image gives them to everyone without per-user assignment.
- **Apps with no usable package.** If a vendor offers no MSIX, Appx or App-V and repackaging fails testing, the app stays in the image, or is installed at update time with the custom configuration script.
- **Hosts with other identity setups.** Microsoft Entra Domain Services joined hosts are listed as not supported, so those estates have no choice.
- **Small, stable estates.** One pool, one image and a quarterly app change leave little to gain from an extra moving part. This is our reading, not a Microsoft statement.
- **Strict regional layouts.** The package, the file share and the session hosts must share an Azure region, and Learn's setup article adds that a package created for a Regional host pool can be assigned only to Regional host pools in the same region, with no later change of that scope.

## When App Attach is the better fit

- **Frequent app updates.** If an application ships monthly and the OS image changes quarterly, attaching the app removes it from the image cycle.
- **Different users, different apps.** Learn's example is a single multi-session host where users get different app combinations because three conditions hold at sign-in: the app is assigned to the host pool, the user is in a desktop or RemoteApp group, and the app is assigned to the user.
- **Per-application assignment in RemoteApp.** Publishing to a RemoteApp group works for apps in the image as well; Learn's setup article points to the RemoteApp publishing article for Start menu or file-path sources. What App Attach adds is that each application is assigned to users and groups individually.
- **Rollback and parallel versions.** Because versions are separate images and the version number can be higher or lower in an in-place update, an earlier version can be reapplied (our reading, not a Learn statement). Learn also says not to delete the old image until users have finished with it.

## The costs on the App Attach side

The operational costs are real, and each belongs in the decision. Images live on an SMB share that every session host mounts with its computer account, so the share becomes a dependency: Learn says disaster recovery plans must include replicating it, and gives example figures for one 1 GB image of one IOPS in steady state, ten IOPS at machine boot sign-in and 400 ms latency per session host. It also advises against sharing it with FSLogix profile containers. For Azure Files with Entra-joined hosts, the Reader and Data Access role goes to two service principals, which Learn warns gives the Azure Virtual Desktop service access to all data in that storage account.

Learn states that every MSIX or Appx package needs a code signing certificate whose whole chain is trusted on the hosts. Learn says to timestamp packages so they remain valid after the certificate expires. Azure CLI cannot manage App Attach; the setup article documents the Azure portal and Azure PowerShell. Learn's What's new also records that partner solutions can deliver applications through App Attach (November 2024), which belongs in a tooling comparison.

Nerdio documents, in its Nerdio Manager for Enterprise knowledge base, a workflow under Applications > Catalog > App Attach. You upload an image, or an MSIX file that Nerdio expands into a disk image on a temporary VM, to its image library, then add the images as App Attach packages with a wizard. The wizard uses a temporary host pool with at least one running desktop to read the image metadata, and it assigns host pools and users or groups; Nerdio also keeps multiple versions of an app. Its notes say Microsoft Entra Domain Services is not supported and name Active Directory Domain Services, while for Entra ID you enable Entra ID host support on the storage account; Learn's identity table lists both Entra ID and AD DS as supported. The storage location should be in the same Azure region as the session hosts, as in Learn. Nerdio's tooling covers part of the work above; the certificate, share and packaging requirements still apply.

## A short pilot plan

1. List your applications and mark each as common to all users, group-specific, or fast-changing.
2. For each non-common app, check for an MSIX, Appx or App-V package, and test it in a dedicated host pool. Keep the unpackaged apps in the image.
3. Create the file share in the session hosts' region and grant computer-account read access. Do not reuse the FSLogix share.
4. Create the disk image. Learn's overview recommends CimFS only on Windows 11 session hosts; use VHDX otherwise, and avoid VHD.
5. Add the package, assign it to the pilot host pool and a pilot group, and keep registration on-demand unless you have a reason to block sign-in.
6. Measure sign-in time with and without the attached apps, then roll one app version forward and check that users receive it at next sign-in.
7. Set the registry values Learn lists to disable automatic updates for MSIX and Appx apps (`AutoDownload` = 2, `PreInstalledAppsEnabled` = 0 and `ContentDeliveryAllowedOverride` = 2, with the key paths in the setup article), on the hosts and in the image.

## Sources

- [Microsoft Learn: App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Add and manage App Attach applications in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup)
- [Microsoft Learn: Create an MSIX image to use with App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-create-msix-image)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Nerdio Manager for Enterprise: Manage App Attach images and packages](https://nmehelp.getnerdio.com/hc/en-us/articles/26124305372045)
- [Nerdio Manager for Enterprise: Manage App Attach Assignments](https://nmehelp.getnerdio.com/hc/en-us/articles/43837197417357)
