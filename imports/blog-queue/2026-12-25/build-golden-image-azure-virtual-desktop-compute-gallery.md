---
title: "Build a Golden Image for Azure Virtual Desktop With Azure Compute Gallery"
summary: "Build, generalize and capture an Azure Virtual Desktop golden image: OS choice, snapshots, sysprep preparation, capturing to Azure Compute Gallery, mistakes to avoid and what the Learn page does not cover about versions and automation."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [azure-virtual-desktop, azure-compute-gallery]
keypoints:
  - "Learn recommends multi-session Windows 10 or 11 or Windows Server images for pooled host pools, and Windows 10 or 11 Enterprise for personal host pools."
  - "Deploy the image VM without the Login with Microsoft Entra ID flag. You can enable it later when you deploy session hosts."
  - "Take snapshots, remove the VM from the domain and disable antivirus before sysprep. Unified Write Filter is not supported on session hosts."
  - "Capture to an Azure Compute Gallery for production, then delete the VM. Never capture the same VM twice."
  - "Do not join the image VM to a host pool, because the registration token will have expired for session hosts created later."
faq:
  - q: "Which OS should I use for the golden image?"
    a: "According to Microsoft Learn, a Windows 10 or 11 multi-session image (with or without Microsoft 365) or a Windows Server image for pooled host pools, and Windows 10 or 11 Enterprise for personal host pools."
  - q: "Why take snapshots?"
    a: "Learn describes snapshots as save states that let you roll back changes. Take several, name them clearly, and take a final one before sysprep so you can build a new base VM if sysprep or capture fails."
  - q: "Can I capture the VM twice?"
    a: "No. Learn says not to capture the same VM twice, even after a failure. Create a new VM from your latest snapshot and run sysprep again."
  - q: "Should the image VM be in a host pool?"
    a: "No. Learn says not to join it to a host pool by deploying the AVD Agent, and not to capture a VM that already exists in a host pool."
  - q: "Does the page explain image versions?"
    a: "It mentions versioning as a benefit of Azure Compute Gallery but gives no steps for creating, promoting or retiring versions."
---

A golden image is a custom VM image with the apps and settings you want on your Azure Virtual Desktop session hosts. This guide follows the Microsoft Learn walkthrough, which uses the Azure portal.

## 1. Choose the OS and create the VM

- **Pooled host pools:** Learn recommends a Windows 10 or 11 multi-session image, with or without Microsoft 365, or a Windows Server image.
- **Personal host pools:** Windows 10 or 11 Enterprise images.
- **Generation:** Gen 1 or Gen 2. Gen 2 supports features that Gen 1 does not.
- **Important:** deploy the VM without the **Login with Microsoft Entra ID** flag. You can enable it later when you deploy session hosts.

## 2. Take snapshots

After deploying the base VM, take a snapshot of its disk. Snapshots are save states that let you roll back changes. Use clear names, and take several snapshots if you install many apps.

## 3. Customize the VM

Sign in, install apps, updates and other components. If the VM is domain-joined while you customize it, remove it from the domain before sysprep. Before the final snapshot, install the latest Windows updates, clean temporary files, defragment disks and remove unnecessary user profiles.

Notes from the page:

1. Antivirus software can cause sysprep issues, so disable all antivirus programs before running sysprep.
2. Unified Write Filter is not supported for session hosts, so make sure it is not enabled in your image.
3. Do not join the image VM to a host pool by deploying the AVD Agent. Session hosts created later from the image would fail because the registration token will have expired. Host pool deployment joins session hosts automatically.

## 4. Final snapshot

When app installation is done, take a final disk snapshot. If sysprep or capture fails, you can build a new base VM from it.

## 5. Run sysprep

Optionally reboot once, clean temporary files, optimize drives and remove user profiles. Then generalize the VM with sysprep. The page links to general sysprep documentation and does not show the command or switches.

## 6. Capture the VM

1. After sysprep completes and you shut down the VM in the Azure portal, open the VM and select **Capture**.
2. Choose a shared image gallery or a standalone managed image. Learn recommends Azure Compute Gallery images for production because of capabilities such as replication and image versioning. The page uses both Shared Image Gallery and Azure Compute Gallery as names.
3. Delete the VM after capture. You can no longer use it.
4. Do not capture the same VM twice, even after a failure. Create a new VM from your latest snapshot and run sysprep again.

To find the image when you create session hosts, open the **Host pool** tab, choose **Gallery**, select all images, then **My items**. Managed images appear under **My images**.

## Other recommendations

- Do not capture a VM that already exists in a host pool, because the image conflicts with that VM's configuration.
- Remove the VM from the domain before sysprep.
- Delete the base VM after capturing the image.
- Create a new base VM from the last snapshot for updates, and patch it regularly.
- Do not build a new base VM from an existing custom image. Start with a new source VM.

## Suggested order of work

This order is a suggestion that restates the page, not a separate Microsoft procedure.

1. Create the base VM without the Entra ID sign-in flag and snapshot it.
2. Install apps in stages and snapshot after each larger change.
3. Remove the domain join, disable antivirus and confirm Unified Write Filter is off.
4. Take the final snapshot, run sysprep and shut the VM down.
5. Capture to an Azure Compute Gallery and delete the VM.
6. For the next update, start a new VM from the last snapshot, not from the captured VM or an existing custom image.

Keeping this order avoids the failures the page warns about, such as an expired registration token or a conflict with an existing host pool VM.

## Not covered

The page gives no steps for managing image versions, no sysprep command syntax, no language pack instructions and no scripts. It mentions Microsoft Intune and Azure Image Builder with Azure DevOps as alternative build methods without explaining them.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Azure Compute Gallery](https://www.m365.fm/entity/azure-compute-gallery/)
- [Golden image](https://www.m365.fm/entity/golden-image/)

## Sources

- [Create a golden image for Azure Virtual Desktop](https://learn.microsoft.com/azure/virtual-desktop/set-up-golden-image)
