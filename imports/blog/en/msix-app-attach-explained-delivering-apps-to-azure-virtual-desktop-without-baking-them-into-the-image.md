---
title: "MSIX app attach explained: delivering apps to Azure Virtual Desktop without baking them into the image"
summary: "App Attach mounts an application package from an SMB file share into a user's session at sign-in, so the app is never installed on the session host or in the image. This article explains the moving parts: package formats, disk images, the file share, registration, assignment and certificates."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [msix-app-attach, azure-virtual-desktop]
keypoints:
  - "App Attach attaches an application from a package to a user session. Learn says apps are not installed locally on session hosts or images, and that they run in containers that separate user data, the operating system and other applications."
  - "A user gets an app only if three conditions hold at sign-in: the app is assigned to the host pool, the user is in a desktop or RemoteApp application group, and the app is assigned to the user or a group."
  - "Disk images can be CimFS, VHDX or VHD. Learn does not recommend VHD and recommends CimFS only when session hosts run Windows 11."
  - "Images sit on an SMB file share that each session host reads with its computer account. Azure Files is the recommended storage; Microsoft Entra Domain Services is listed as not supported."
  - "Every MSIX or Appx package needs a code signing certificate whose whole chain the session hosts trust. Learn advises timestamping the package so it outlasts the certificate."
faq:
  - q: "Is App Attach the same as MSIX app attach?"
    a: "Learn's current articles use the name App Attach and describe MSIX, Appx and App-V packages as inputs. A Learn training module title still uses the older name MSIX app attach. For admins the practical point is that MSIX is one of the supported package types, not the only one."
  - q: "Do session hosts need the application installed?"
    a: "No. Microsoft Learn says applications are not installed locally on session hosts or images. The disk image is mounted from a file share during sign-in and the app is registered for the user, either partially at sign-in (on-demand, the default) or fully at sign-in (log on blocking)."
  - q: "Can I manage App Attach with Azure CLI?"
    a: "No. The Learn setup article says you cannot add or manage App Attach applications using Azure CLI. It documents the Azure portal and Azure PowerShell, and the PowerShell module Az.DesktopVirtualization must be version 4.2.1 or later."
---

App Attach is the Azure Virtual Desktop feature that attaches an application from a package to a user session at sign-in. Learn says the applications are not installed locally on session hosts or images, which makes custom images easier to create and reduces operational overhead. This article explains how the pieces fit together; a separate comparison covers when images or App Attach suit a given estate.

Naming first. Learn's current articles call the feature App Attach and treat MSIX, Appx and App-V as package types. Older material, including the title of a Microsoft training module, says "MSIX app attach". Both names point to the same idea. This article follows the current Learn wording.

## What App Attach does

Per Microsoft Learn's [App Attach overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview), applications run inside containers that separate user data, the operating system and other applications. The documented benefits are:

- Apps are delivered through RemoteApp or as part of a desktop session.
- Permissions apply per application per user. Desktop users see only the App Attach applications assigned to them.
- One package can serve several host pools.
- Apps run on any session host with a Windows client or supported Windows server operating system in the same Azure region as the package.
- A new application version comes from a new disk image, without a maintenance window.
- Several versions of the same app can run at the same time on one session host.
- Usage and health telemetry is available through Azure Log Analytics.

The setup article adds that, as of April 14, 2026, Windows Server 2022 and 2025 are supported session host operating systems. Session hosts must be joined to Microsoft Entra ID or Active Directory Domain Services. The overview lists Microsoft Entra Domain Services as not supported. The Learn pages used for this article carry no preview label for App Attach; the overview was last updated on 26 August 2026 and the setup article on 22 April 2026.

## Package types and disk images

App Attach accepts these package types:

| Package type | File formats |
|---|---|
| MSIX and MSIX bundle | .msix, .msixbundle |
| Appx and Appx bundle | .appx, .appxbundle |
| App-V | .appv |

MSIX and Appx are similar; Learn describes MSIX as a superset of Appx with extra features that suit enterprise use. You can get MSIX packages from software vendors or build one from an existing installer.

For MSIX and Appx, you expand the package into a disk image. Learn names three formats: Composite Image File System (CimFS), VHDX and VHD. It does not recommend VHD, and it recommends CimFS only when session hosts run Windows 11. A CimFS image is several files: a .cim file with metadata plus at least two more files, one starting with `objectid_` and one with `region_`, that hold the application data.

Learn publishes a test of 500 files of 300 MB per format on a DSv4 Azure virtual machine:

| Metric | VHD | CimFS |
|---|---|---|
| Average mount time | 356 ms | 255 ms |
| Average unmount time | 1615 ms | 36 ms |
| Memory consumption | 6% of 8 GB | 2% of 8 GB |
| CPU | Maxed out several times | No effect |

Treat this as one vendor test on one VM size, not a promise for your estate.

### Creating the image

The [Create an MSIX image](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-create-msix-image) article uses the MSIXMGR tool. You need administrative permissions on a Windows 10 or Windows 11 device and an .msix file. The documented command for a CIM image is:

```
msixmgr.exe -Unpack -packagePath "C:\msix\myapp.msix" -destination "C:\msix\myapp\myapp.cim" -applyACLs -create -fileType cim -rootDirectory apps
```

Create the destination folder first, because a CIM image consists of several files and a dedicated folder keeps them apart. Learn also warns that CIM files should be generated on a Windows version lower than or equal to the version that will run the package: files generated on Windows 11 may not work on Windows 10.

## The file share

Images live on an SMB file share that each session host mounts at sign-in. Learn says App Attach has no dependency on the storage type and recommends [Azure Files](/entity/azure-files/); Azure NetApp Files also works but requires session hosts joined to Active Directory Domain Services.

Permissions follow the session host, not the user. Each session host computer object needs read access through NTFS and share permissions. With Azure Files and session hosts joined to Microsoft Entra ID, Learn tells you to assign the Reader and Data Access role to both the Azure Virtual Desktop and the Azure Virtual Desktop ARM Provider service principals. Learn warns that this grants the service access to all data in that storage account, so keep only App Attach content there and rotate the access keys. With Azure Files and Active Directory Domain Services, the default share-level role is Storage File Data SMB Share Reader plus NTFS read access for each computer object.

Learn's performance guidance for one 1 GB image holding one application is: one IOPS in steady state, ten IOPS at machine boot sign-in and 400 ms latency per session host. It also advises keeping the share in the same Azure region as the session hosts, excluding the read-only images from antivirus scans, and not sharing the share with FSLogix profile containers. Disaster recovery plans must include replicating the share. Because the disk image is mounted with the session host's computer account, Azure Files opens one handle per session host per image, not per user.

## Certificates

Every MSIX and Appx package must be signed with a code signing certificate (object identifier 1.3.6.1.5.5.7.3.3), and the whole chain must be trusted on the session hosts. Public CA certificates are trusted by default. For an internal enterprise CA, Active Directory joined hosts trust it by default when AD CS is the enterprise CA; a standalone CA needs Group Policy to distribute the root and intermediate certificates, and Entra-joined hosts can receive them through Intune trusted root certificate profiles. Self-signed certificates are for testing only. Learn also says to timestamp the package so it stays valid after the certificate expires; otherwise you must re-sign it and re-establish trust.

## Adding and assigning an application

The [setup article](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup) lists these prerequisites: an existing host pool with session hosts, an application group and a workspace; at least one session host powered on; the file share in the same region; the Desktop Virtualization Contributor role on the resource group as a minimum; and Az.DesktopVirtualization 4.2.1 or later for PowerShell. Azure CLI is not supported for App Attach.

In the Azure portal the path is Azure Virtual Desktop, then **App Attach**, then **+ Create**. The tabs are Basics (subscription, resource group, host pool, location), Image path (storage account and file, or a UNC path; display name, version, registration type, state and health check status on failure), optional Assignments and Tags, then Review + create. A package inherits its deployment scope from the host pool: a package created for a Regional host pool can be assigned only to Regional host pools in the same Azure region, and the scope cannot be changed later.

Assignment is separate from creation. Open the package, then **Manage** > **Host pools** > **+ Assign**, and **Manage** > **Users** > **+ Add**. Learn notes that user accounts need to be hybrid accounts (created in AD DS and synchronized), while groups do not.

### How a user gets an app

At sign-in three conditions must all be true:

1. The application is assigned to the host pool.
2. The user can sign in to the pool, meaning the user is in a Desktop or RemoteApp [application group](/entity/avd-application-group/). For a RemoteApp group, the App Attach application must be added to that group.
3. The application is assigned to the user, directly or through a group.

This is why two users on the same multi-session host can see different apps. For desktop sessions, assignment alone makes the app available; you cannot add App Attach applications to a desktop application group. For [RemoteApp](/entity/avd-remoteapp/), open the application group, choose **Applications** > **+ Add** and select App Attach as the application source.

## Registration, state and versions

Registration makes the mounted app visible to the user. **On-demand** is the default and the recommended type: apps are registered only partially at sign-in and fully when the user starts them, so sign-in time is not affected. **Log on blocking** registers every assigned app fully during sign-in, which can lengthen sign-in. A package is either active or inactive; inactive packages are ignored at sign-in.

For a new version you have two routes. Side by side creates a new application with the new image and assigns it to the same pools and users. In place creates an image with a different application version number and updates the existing application to it; the version can be higher or lower but not identical, and the old image should stay until all users have finished with it. Users get the new version at their next sign-in.

## One setting to review

Learn recommends disabling automatic updates for MSIX and Appx apps on the session hosts. The documented values are `AutoDownload` = 2 under `HKLM\Software\Policies\Microsoft\WindowsStore`, `PreInstalledAppsEnabled` = 0 under `HKCU\Software\Microsoft\Windows\CurrentVersion\ContentDeliveryManager`, and `ContentDeliveryAllowedOverride` = 2 under `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\ContentDeliveryManager\Debug`. Set them with Group Policy or Intune, or with PowerShell on each host and in the OS image.

## Where App Attach does not help

Learn lists three limits worth knowing before a pilot. The packages must be MSIX, Appx or App-V; anything else needs repackaging or stays in the image. The app and the file share must be in the same Azure region as the session hosts. And user configuration files for App-V packages are, at the time of writing, supported only on desktop connections, not on RemoteApp connections.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Add and manage App Attach applications in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup)
- [Microsoft Learn: Create an MSIX image to use with App Attach in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-create-msix-image)
