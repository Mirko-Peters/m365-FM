---
title: "MSIX App Attach in Azure Virtual Desktop: Package, Publish and Assign Apps Without Baking Them Into the Image"
summary: "How to package an app as a CIM or VHDX image with msixmgr, store it on an SMB share, add it as an App Attach package in Azure Virtual Desktop and publish it to users, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [azure-virtual-desktop, avd-host-pool, azure-files, windows-365]
keypoints:
  - "App attach delivers apps from a disk image at sign-in, so they are not installed on session hosts or in the master image."
  - "Create the image with msixmgr -Unpack. CIM is recommended for best performance, VHDX is the alternative, and VHD is not recommended."
  - "The image must sit on an SMB file share in the same Azure region as the session hosts, and every host needs read access with its computer account."
  - "In the Azure portal, add the package under Azure Virtual Desktop > App Attach, then assign it to host pools and to users or groups."
  - "To publish an app as RemoteApp, add it to a RemoteApp application group with App Attach as the application source."
faq:
  - q: "What is the difference between MSIX app attach and app attach?"
    a: "The Microsoft Learn overview describes app attach as one feature that supports MSIX, Appx and App-V packages. It does not describe a separate product called MSIX app attach, so the older name appears to refer to the same delivery method with MSIX packages."
  - q: "Which image format should I use?"
    a: "According to Microsoft Learn, supported formats are CimFS, VHDX and VHD. Learn recommends CimFS when session hosts run Windows 11, advises VHDX instead of VHD, and does not recommend VHD. Generate CIM files on a Windows version that is the same as or lower than the version where the apps will run."
  - q: "Do I need to add the app to a desktop application group?"
    a: "No. The setup article says users get desktop access to assigned apps through the package assignment. To publish an app as RemoteApp, add it to a RemoteApp application group. You cannot add MSIX or Appx apps to a desktop application group with App Attach."
  - q: "How do I update an app without a maintenance window?"
    a: "The overview says you can update in place by pointing the existing application to a new image with a changed version number, or add a new application from the new image side by side. The version number can be higher or lower, but the same version cannot be reused."
---

App attach lets you keep the session host image small. You package an application into a disk image, store the image on an SMB file share, register it as a package in Azure Virtual Desktop and assign it to host pools and users. At sign-in the image is attached, and the app appears for the users who are assigned to it. Microsoft Learn states that the apps are not installed locally on session hosts or in images, which makes custom images easier to create and reduces operational overhead.

## What you need before you start

The setup article lists these prerequisites:

- A host pool with session hosts, an application group and a workspace.
- Session hosts running a supported Windows client or Windows Server OS, joined to Microsoft Entra ID or Active Directory Domain Services. At least one host must be powered on when you add the package.
- An SMB file share in the same Azure region as the session hosts. Each session host needs read access with its computer account.
- An MSIX or Appx disk image on that share, or an App-V package.
- Azure RBAC rights: Desktop Virtualization Contributor on the resource group at minimum to add images, and permission to write role assignments on the application group to assign users.

Microsoft Entra Domain Services is listed as not supported as an identity provider in the overview. The same page mentions it in one storage section, so check the current wording if you use it.

## Step 1: Create the image with msixmgr

Download msixmgr from aka.ms/msixmgr, extract it and run it from an elevated command prompt on Windows 10 or Windows 11. Use a new, empty folder for each image, because a CIM image consists of several files. The example in the Learn article is:

```
msixmgr.exe -Unpack -packagePath "C:\msix\myapp.msix" -destination "C:\msix\myapp\myapp.cim" -applyACLs -create -fileType cim -rootDirectory apps
```

Learn gives these format rules:

- **CIM** is recommended for best performance, especially on Windows 11. It uses less CPU and memory and mounts and unmounts faster. In Microsoft's test with 500 files of 300 MB each, average unmount time was 36 ms for CimFS and 1615 ms for VHD.
- **VHDX** is the alternative. **VHD** is not recommended.
- Generate CIM files on a Windows version lower than or equal to the version where the packages will run. CIM files created on Windows 11 may not work on Windows 10.

The pages I read do not show the VHDX command text or explain every msixmgr parameter. The full syntax is in the msixmgr tool parameters reference linked from the Learn article.

## Step 2: Check certificates

Every MSIX and Appx package needs a valid code-signing certificate, and the whole chain must be trusted on the session hosts. Public CA certificates are trusted by default. Internal CA certificates need to be distributed, for example through Group Policy or Intune trusted root profiles. Self-signed certificates are for testing only, and Learn says not to distribute them through Group Policy or Intune. Timestamp the package so it stays valid after the certificate expires.

## Step 3: Prepare the file share and permissions

Azure Files is the recommended store. For Azure Files with Entra-joined session hosts, assign the **Reader and Data Access** role to both the **Azure Virtual Desktop** and **Azure Virtual Desktop ARM Provider** service principals. Learn warns that the ARM Provider assignment grants access to all data in the storage account, so keep only app attach images there and rotate access keys regularly. For Azure Files with AD DS, use **Storage File Data SMB Share Reader** as the default share-level permission and give each session host's computer object read access through NTFS permissions.

Further guidance from the overview:

- Keep the share in the same region as the session hosts.
- Exclude the image disks from antivirus scans, since they are read-only.
- Do not share the file share with FSLogix profile containers.

## Step 4: Add the package in the Azure portal

1. Sign in to the Azure portal and open **Azure Virtual Desktop**.
2. Select **App Attach**, then **+ Create**.
3. On **Basics**, choose subscription, resource group, host pool and location.
4. On **Image path**, select the file from the storage account or enter a UNC path, then choose the package.
5. Set **Display name**, check **Version**, and choose the **Registration type** and **State**.
6. Optionally add host pools and users on **Assignments**, then select **Review + create** and **Create**.

Registration type has two values. **On-demand** is the default and recommended: partial registration happens at sign-in and full registration when the user starts the app, so sign-in time is not affected. **Register at log on** does full registration during sign-in and can lengthen it. State is **Active** or **Inactive**. Inactive packages are ignored and not added at sign-in.

A package inherits its deployment scope from the host pool. A regional package can only be assigned to regional host pools in the same region, and the scope cannot be changed after creation.

## Step 5: Assign and publish

A user gets an app only if three things are true at sign-in: the app is assigned to the host pool, the user can reach the host pool through a Desktop or RemoteApp application group, and the app is assigned to the user directly or by group.

- **Host pools:** open the package, select **Host pools** under **Manage**, then **+ Assign**.
- **Users:** select **Users** under **Manage**, then **+ Add**. Users must be hybrid accounts synced to Microsoft Entra ID. Groups do not have this requirement.
- **RemoteApp:** open the RemoteApp application group, select **Applications** > **+ Add**, choose **App Attach** as the application source, pick the package and app, and set identifier and display name.

For a desktop session, an active package assigned to the host pool and the user is enough.

## Updating and removing packages

For updates, use the **Update** button on the package and point it to the new image. The overview describes two methods. In-place update changes the existing application to a new image with a different version number. Side-by-side creates a new application from the new image and assigns it to the same host pools and users. Do not delete the old image until all users have finished with it. To remove a package, select it and choose **Remove**. You do not need to unassign host pools or users first.

## Settings Learn recommends on session hosts

Learn recommends turning off automatic app updates on session hosts, ideally through Group Policy or Intune. The registry values listed are AutoDownload set to 2 under the WindowsStore policy key, PreInstalledAppsEnabled set to 0, and ContentDeliveryAllowedOverride set to 2.

## Common mistakes

- Putting the share in another region from the session hosts.
- Forgetting read access for the computer accounts of every session host.
- Reusing a version number when updating in place.
- Using a self-signed certificate in production.
- Expecting to add an app to a desktop application group. Desktop sessions use the package assignment instead.

## What the pages I read do not cover

The setup article's Azure PowerShell tab and service limits were not part of the text I could read. It states that Azure CLI is not supported for app attach and that the PowerShell option needs Az.DesktopVirtualization 4.2.1 or later. Check the Learn page for the current limits before you plan a large rollout.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Host pool (Azure Virtual Desktop)](https://www.m365.fm/entity/avd-host-pool/)
- [Azure Files](https://www.m365.fm/entity/azure-files/)
- [FSLogix](https://www.m365.fm/entity/fslogix/)

## Sources

- [Microsoft Learn: App attach in Azure Virtual Desktop overview](https://learn.microsoft.com/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Create an MSIX image with MSIXMGR](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-create-msix-image)
- [Microsoft Learn: Add and manage app attach applications](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup)
- [Microsoft Learn: MSIXMGR tool](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-msixmgr)
