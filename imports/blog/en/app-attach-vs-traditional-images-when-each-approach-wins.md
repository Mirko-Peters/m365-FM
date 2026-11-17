---
title: "App attach vs traditional images: when each approach wins"
summary: "App Attach suits apps that change on their own schedule, go to only some users, or exist as MSIX, Appx or App-V packages. Baking apps into the image suits stable, common, unpackaged apps and keeps the estate free of a file share and certificate chain."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [msix-app-attach, azure-virtual-desktop]
keypoints:
  - "With a traditional image, an app change means a new image version and replacing session hosts. With App Attach, Learn says a new app version comes from a new disk image and needs no maintenance window; users get it at their next sign-in."
  - "App Attach assigns apps per user and per host pool, so users on the same multi-session host can see different apps. An image gives every user of the host the same installed apps."
  - "App Attach adds dependencies: an SMB file share in the same region, read access for each session host's computer account, trusted code signing certificates, and packages in MSIX, Appx or App-V format."
  - "Learn lists Microsoft Entra Domain Services as not supported for App Attach and lists Windows Server 2022 and 2025 as supported as of 14 April 2026."
  - "The two approaches combine: keep the operating system, Office-style common apps and drivers in the image, and attach the rest."
faq:
  - q: "Does App Attach replace a golden image?"
    a: "No. Microsoft Learn describes App Attach as making custom images easier to create and as reducing the number of custom images, not as removing the image. The session host still needs an operating system image; App Attach changes where the applications come from."
  - q: "What happens to apps I install by hand on session hosts when I update the image?"
    a: "On a host pool with a session host configuration, Learn says customizations added manually, such as files, registry keys or certificates, are not present after a session host update. Put them in the image, apply them with Intune or Group Policy, or add them to the custom configuration script in the session host configuration."
  - q: "Can Nerdio Manager manage App Attach?"
    a: "Nerdio's knowledge base for Nerdio Manager for Enterprise documents managing App Attach images, packages, versions and assignments, including a package wizard and image versions. Whether that is worth it depends on your own tooling; the underlying Azure Virtual Desktop feature is the same."
---

App Attach wins when applications change on a different schedule than the operating system, when only some users should have them, or when the app already exists as an MSIX, Appx or App-V package. A traditional image wins when the apps are common to everyone, rarely change, or cannot be packaged, because then App Attach only adds a file share and a certificate chain. Most estates end up with both. This article gives the criteria, the costs on each side and a short pilot plan. The mechanics of App Attach itself are covered in the explainer for the feature.

## What each approach asks of you

In the traditional model, applications are installed on a golden image, the image is published as a new version, and session hosts are replaced from it. Learn's [session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) article describes this as the recommended way of managing updates within the core source image rather than installing updates on each host on a repeated schedule. The update deallocates or deletes existing VMs and creates new ones from the new image, in batches. You choose the batch size, users receive a notification and are signed out after a wait you set, and the first host is updated alone as a test before the rest follow. Learn adds that manually added files, registry keys and certificates are gone after the update, so they must be in the image, applied by Intune or Group Policy, or added to the custom configuration PowerShell script. Autoscale should be disabled for the duration of an update, because a scaling plan enabled during an update can make it fail.

With [App Attach](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview), the application is not installed on the host or in the image. A disk image on an SMB share is mounted at sign-in and registered for the user. A new version is a new disk image, either as a new application or by updating the existing one in place with a different version number, and users get it at their next sign-in. Learn lists that as an update without a maintenance window.

## Criteria that decide it

| Criterion | Traditional image | App Attach |
|---|---|---|
| App change cadence | Each change needs a new image version and a host replacement | New disk image; users get it at next sign-in |
| Who sees the app | Everyone who reaches an updated host | Per application per user; assignment to host pools and users or groups |
| Several versions at once | One installed version per image | Learn: several versions of one app can run concurrently on a host |
| Package format | Whatever the installer supports | MSIX, Appx or App-V only |
| Dependencies | Image pipeline and gallery | SMB share in the same region, computer-account read access, signed packages |
| Identity | No App Attach-specific limit | Microsoft Entra ID and AD DS supported; Microsoft Entra Domain Services not supported |
| Session host OS | Any supported by your pool | Windows client or supported Windows server; Learn says Server 2022 and 2025 are supported as of 14 April 2026 |
| Sign-in impact | None from apps | On-demand registration (default) avoids added sign-in time; log on blocking can lengthen it |
| Image count | One image per distinct app set | Learn says App Attach lets you create fewer custom images |

Two rows deserve emphasis. First, per-user assignment is the clearest reason to attach. If an engineering group needs a graphics-heavy application, Learn's overview notes you can assign it only to host pools with GPU-optimized session hosts and only to that group. Doing the same with images needs a separate image and pool for each app combination. Second, the package-format row is the clearest reason not to. Learn lists the supported types as MSIX, Appx and App-V, and it does not say which Win32 apps convert cleanly, so packaging success per application is something you test, not assume.

## When a traditional image is the better fit

- **Common apps for every user.** If every user needs the same browser, agent and Office suite, an image gives them to everyone without per-user assignment.
- **Apps with no usable package.** If a vendor offers no MSIX, Appx or App-V and repackaging fails testing, the app stays in the image, or is installed at update time with the custom configuration script.
- **Hosts with other identity setups.** Microsoft Entra Domain Services joined hosts are listed as not supported, so those estates have no choice.
- **Small, stable estates.** One pool, one image and a quarterly app change leave little to gain from an extra moving part. This is our reading, not a Microsoft statement.
- **Strict regional layouts.** The package, the file share and the session hosts must share an Azure region, and Learn's setup article adds that a package created for a Regional host pool can be assigned only to Regional host pools in the same region, with no later change of that scope.

## When App Attach is the better fit

- **Frequent app updates.** If an application ships monthly and the OS image changes quarterly, attaching the app removes it from the image cycle.
- **Different users, different apps.** Learn's example is a single multi-session host where users get different app combinations because three conditions hold at sign-in: the app is assigned to the host pool, the user is in a desktop or RemoteApp group, and the app is assigned to the user.
- **RemoteApp publishing.** Learn says you can add an App Attach application to a RemoteApp application group, with App Attach chosen as the application source.
- **Rollback and parallel versions.** Because versions are separate images and the version number can be higher or lower in an in-place update, an earlier version can be reapplied (our reading, not a Learn statement). Learn also says not to delete the old image until users have finished with it.

## The costs on the App Attach side

The operational costs are real. Images live on an SMB share that every session host mounts with its computer account. For Azure Files with Microsoft Entra joined hosts, Learn requires the Reader and Data Access role for two service principals and warns that this gives the Azure Virtual Desktop service access to all data in that storage account, so the account should hold only App Attach content. Learn also advises against sharing that file share with FSLogix profile containers and says the disaster recovery plan must replicate the share.

Every package needs a code signing certificate whose whole chain is trusted on the hosts. Learn says to timestamp packages so they remain valid after the certificate expires. If you use a self-signed certificate for testing, install the root on each host.

Tooling can reduce the effort. Nerdio documents, in its Nerdio Manager for Enterprise knowledge base, a workflow of uploading an image or an MSIX file to its image library (it creates a VHD for an MSIX upload using a temporary VM), adding the images as App Attach packages with a wizard that also assigns host pools and users, and managing image versions and assignments. Its notes repeat the Learn limits: Microsoft Entra Domain Services is not supported, and the storage location should be in the same Azure region as the session hosts. Azure-native tools cover the same steps; the Learn setup article documents the Azure portal and Azure PowerShell, and Learn says you cannot manage App Attach with Azure CLI.

## A short pilot plan

1. List your applications and mark each as common to all users, group-specific, or fast-changing.
2. For each non-common app, check for an MSIX, Appx or App-V package, and test it in a dedicated host pool. Keep the unpackaged apps in the image.
3. Create the file share in the session hosts' region and grant computer-account read access. Do not reuse the FSLogix share.
4. Create the disk image. Learn recommends CimFS only on Windows 11 session hosts; use VHDX otherwise, and avoid VHD.
5. Add the package, assign it to the pilot host pool and a pilot group, and keep registration on-demand unless you have a reason to block sign-in.
6. Measure sign-in time with and without the attached apps, then roll one app version forward and check that users receive it at next sign-in.
7. Disable the automatic update registry values Learn lists for MSIX and Appx apps on the hosts and in the image.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Add and manage App Attach applications in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup)
- [Microsoft Learn: Create an MSIX image to use with App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-create-msix-image)
- [Microsoft Learn: Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Nerdio Manager for Enterprise: Manage App Attach images and packages](https://nmehelp.getnerdio.com/hc/en-us/articles/26124305372045)
