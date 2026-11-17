---
title: "MSIX app attach explained: delivering apps to Azure Virtual Desktop without baking them into the image"
summary: "App Attach mounts an application disk image or App-V package from an SMB file share into a user's session at sign-in, so the app is not installed on the session host or in the image. This article explains the moving parts: package formats, disk images, the file share, registration, assignment and certificates, and how current App Attach differs from the older MSIX app attach."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [msix-app-attach, azure-virtual-desktop]
keypoints:
  - "App Attach attaches an application from a package to a user session. Learn says apps are not installed locally on session hosts or images, and that they run in containers that separate user data, the operating system and other applications."
  - "A user gets an app only if three conditions hold at sign-in: the app is assigned to the host pool, the user is in a desktop or RemoteApp application group, and the app is assigned to the user or a group."
  - "Disk images can be CimFS, VHDX or VHD. Learn does not recommend VHD and recommends CimFS only when session hosts run Windows 11."
  - "Images sit on an SMB file share that each session host reads with its computer account, and Learn recommends Azure Files for it. Separately, Learn's identity table lists Microsoft Entra Domain Services as not supported."
  - "Every MSIX or Appx package needs a code signing certificate whose whole chain the session hosts trust. Learn advises timestamping the package so it outlasts the certificate."
faq:
  - q: "Is App Attach the same as MSIX app attach?"
    a: "No. Learn's What's new announced that the earlier MSIX App Attach would be deprecated on 1 June 2025 and asked admins to move all apps to App Attach. Current App Attach still accepts MSIX packages, alongside Appx and App-V. Some older material, including the title of one Microsoft training module, still uses the name MSIX app attach."
  - q: "Do session hosts need the application installed?"
    a: "No. Microsoft Learn says applications are not installed locally on session hosts or images. The disk image is mounted from a file share during sign-in and the app is registered for the user, either partially at sign-in (on-demand, the default) or fully at sign-in (log on blocking, labelled Register at log on in the portal)."
  - q: "Can I manage App Attach with Azure CLI?"
    a: "No. The Learn setup article says you cannot add or manage App Attach applications using Azure CLI. It documents the Azure portal and Azure PowerShell, and the PowerShell module Az.DesktopVirtualization must be version 4.2.1 or later."
---

App Attach is the Azure Virtual Desktop feature that attaches an application from a package to a user session at sign-in. Learn says the applications are not installed locally on session hosts or images, which makes custom images easier to create and reduces operational overhead. This article explains how the pieces fit together; a separate comparison covers when each approach suits an estate.

Naming first, because older guides can mislead. In March 2025 Learn's What's new announced that MSIX App Attach, the earlier method, would be deprecated on 1 June 2025 and asked admins to move all apps to App Attach. When App Attach appeared in preview in December 2023, What's new described benefits over MSIX App Attach, including per-user assignment, one package across several host pools, and two versions of an application running concurrently. So the two names do not describe the same mechanism. A guide that still says "MSIX app attach", such as the Microsoft training module titled "Deploy applications by using MSIX app attach for Azure Virtual Desktop", is worth comparing with current Learn pages before you follow it. This article describes current App Attach, where MSIX is one supported package type.

## What App Attach does

Per Learn's [App Attach overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview), applications run inside containers that separate user data, the operating system and other applications. Documented benefits:

- Apps are delivered through RemoteApp or as part of a desktop session.
- Permissions apply per application per user. Desktop users see only the App Attach applications assigned to them.
- One package can serve several host pools.
- Apps run on any session host with a Windows client or supported Windows server operating system in the same Azure region as the package.
- A new application version comes from a new disk image, without a maintenance window.
- Several versions of the same app can run at the same time on one session host.
- Usage and health telemetry is available through Azure Log Analytics.

The setup article adds that, as of April 14, 2026, Windows Server 2022 and 2025 are supported session host operating systems. Session hosts must be joined to Microsoft Entra ID or Active Directory Domain Services. The overview lists Microsoft Entra Domain Services as not supported. On status, Learn's What's new lists adding and managing App Attach applications as available since June 2024, without a preview label. One step in the setup article's PowerShell instructions still begins "During the preview", so check the current page before relying on a detail.

## Package types and disk images

App Attach accepts these package types:

| Package type | File formats |
|---|---|
| MSIX and MSIX bundle | .msix, .msixbundle |
| Appx and Appx bundle | .appx, .appxbundle |
| App-V | .appv |

MSIX and Appx are similar; Learn describes MSIX as a superset of Appx. You can get MSIX packages from software vendors or build one from an existing installer. The overview describes the disk-image step for MSIX and Appx; an App-V package is stored on the file share as it is.

For MSIX and Appx, you expand the package into a disk image. Learn names three formats: Composite Image File System (CimFS), VHDX and VHD. It does not recommend VHD, and the overview recommends CimFS only when session hosts run Windows 11. The create-image article words this more broadly, so check both pages. A CimFS image is several files: a .cim file with metadata plus at least two more files, one starting with `objectid_` and one with `region_`, that hold the application data.

Learn publishes a test of 500 files of 300 MB per format on a DSv4 Azure virtual machine:

| Metric | VHD | CimFS |
|---|---|---|
| Average mount time | 356 ms | 255 ms |
| Average unmount time | 1615 ms | 36 ms |
| Memory consumption | 6% of 8 GB | 2% of 8 GB |
| CPU | Maxed out several times | No effect |

Learn's text calls this a VHDX versus CimFS test while the column says VHD. Treat it as one test on one VM size, not a promise for your estate.

### Creating the image

The [Create an MSIX image](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-create-msix-image) article uses the MSIXMGR tool, which you download from aka.ms/msixmgr and extract to a folder. You need administrative permissions on a Windows 10 or Windows 11 device and an .msix file. The documented command for a CIM image is:

```
msixmgr.exe -Unpack -packagePath "C:\msix\myapp.msix" -destination "C:\msix\myapp\myapp.cim" -applyACLs -create -fileType cim -rootDirectory apps
```

For a single VHDX file, the same article uses `-destination "C:\msix\myapp.vhdx"` and `-fileType vhdx` in place of the CIM values. Create the destination folder first, because a CIM image consists of several files and a dedicated folder keeps them apart. Learn also warns to generate CIM files on a Windows version no newer than the one that will run the package: files generated on Windows 11 may not work on Windows 10.

## The file share

Images live on an SMB file share that each session host mounts at sign-in. Learn says App Attach has no dependency on the storage type and recommends [Azure Files](/entity/azure-files/); Azure NetApp Files also works but, in that sentence, requires session hosts joined to Active Directory Domain Services. The overview's permissions list for Azure NetApp Files also names Microsoft Entra Domain Services, which its identity table lists as not supported; this article follows the table.

Permissions follow the session host, not the user. Each session host computer object needs read access through NTFS and share permissions. With Azure Files and session hosts joined to Microsoft Entra ID, Learn tells you to assign the Reader and Data Access role to both the Azure Virtual Desktop and the Azure Virtual Desktop ARM Provider service principals. For Azure Files with Entra-joined hosts, the setup article adds that the storage account must be in the same subscription as the session host VMs. Learn warns that this grants the service access to all data in that storage account, so keep only App Attach content there and rotate the access keys. With Azure Files and Active Directory Domain Services, the default share-level role is Storage File Data SMB Share Reader plus NTFS read access for each computer object.

For one 1 GB image holding one application, Learn gives one IOPS in steady state, ten IOPS at machine boot sign-in and 400 ms latency per session host. It also advises keeping the share in the session hosts' region, excluding the read-only images from antivirus scans, and not reusing a share that holds FSLogix profile containers. Disaster recovery plans must include replicating the share.

## Certificates

Every MSIX and Appx package must be signed with a code signing certificate (object identifier 1.3.6.1.5.5.7.3.3), and the whole chain must be trusted on the session hosts. Public CA certificates are trusted by default. For an internal enterprise CA, Active Directory joined hosts trust it by default when AD CS is the enterprise CA; a standalone CA needs Group Policy to distribute the root and intermediate certificates, and Entra-joined hosts can receive them through Intune. Self-signed certificates are for testing only. Learn also says to timestamp the package so it stays valid after the certificate expires; otherwise you must update it with a new certificate and re-establish trust.

## Adding and assigning an application

The [setup article](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup) lists these prerequisites: an existing host pool with session hosts, an application group and a workspace; at least one session host powered on; the file share in the same region; and, to add images, the Desktop Virtualization Contributor role on the resource group as a minimum. Assigning users to the application group needs more: Microsoft.Authorization/roleAssignments/write on the application group, which the User Access Administrator and Owner roles include. For PowerShell you need Az.DesktopVirtualization 4.2.1 or later and the Microsoft Graph PowerShell module, or Azure Cloud Shell. Azure CLI is not supported for App Attach.

In the Azure portal the path is Azure Virtual Desktop, then **App Attach**, then **+ Create**. The tabs are Basics (subscription, resource group, host pool, location), Image path (storage account and file, or a UNC path; display name, version, registration type, state and health check status on failure), optional Assignments and Tags, then Review + create. A package inherits its deployment scope from the host pool: a package created for a Regional host pool can be assigned only to Regional host pools in the same Azure region, and the scope cannot be changed later.

Assignment is separate from creation. Open the package, then **Manage** > **Host pools** > **+ Assign**, and **Manage** > **Users** > **+ Add**. Learn notes that user accounts need to be hybrid accounts, while groups do not.

### How a user gets an app

At sign-in three conditions must all be true:

1. The application is assigned to the host pool.
2. The user can sign in to the pool, meaning the user is in a Desktop or RemoteApp [application group](/entity/avd-application-group/). For a RemoteApp group, the App Attach application must be added to that group.
3. The application is assigned to the user, directly or through a group.

This is why two users on one multi-session host can see different apps. For desktop sessions, assignment alone makes the app available; you cannot add App Attach applications to a desktop application group. For [RemoteApp](/entity/avd-remoteapp/), open the application group, choose **Applications** > **+ Add** and select App Attach as the application source.

## Registration, state and versions

Registration makes the mounted app visible to the user. **On-demand** is the default and the recommended type: apps are registered only partially at sign-in and fully when the user starts them, so sign-in time is not affected. **Log on blocking** (shown as **Register at log on** in the portal) registers every assigned app fully during sign-in, which can lengthen sign-in. A package is either active or inactive; inactive packages are ignored at sign-in.

For a new version you have two routes. Side by side creates a new application with the new image and assigns it to the same pools and users. In place creates an image with a different application version number and updates the existing application to it; the version can be higher or lower but not identical, and the old image should stay until all users have finished with it. Users get it at their next sign-in.

## One setting to review

Learn recommends disabling automatic updates for MSIX and Appx apps by setting these values on the session hosts: `AutoDownload` = 2 under `HKLM\Software\Policies\Microsoft\WindowsStore`, `PreInstalledAppsEnabled` = 0 under `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`, and `ContentDeliveryAllowedOverride` = 2 under `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug`. Use Group Policy or Intune, or PowerShell on each host and in the OS image.

## Where App Attach does not help

Learn states several constraints in different places. Applications run on session hosts in the same Azure region as the package. Microsoft Entra Domain Services is not a supported identity provider. Azure CLI cannot add or manage App Attach applications. Learn does not recommend VHD images. User configuration files for App-V packages are, "at this time", supported only on desktop connections, not RemoteApp. Our reading, not a Learn statement: an application with no MSIX, Appx or App-V package needs repackaging or stays in the image.

## Sources

- [Microsoft Learn: App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Add and manage App Attach applications in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup)
- [Microsoft Learn: Create an MSIX image to use with App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-create-msix-image)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn Training: Deploy applications by using MSIX app attach for Azure Virtual Desktop](https://learn.microsoft.com/en-us/training/modules/m365-wvd-application-management/)
