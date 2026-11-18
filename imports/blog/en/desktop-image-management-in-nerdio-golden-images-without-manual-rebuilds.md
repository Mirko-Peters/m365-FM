---
title: "Desktop image management in Nerdio: golden images without manual rebuilds"
summary: "In Nerdio Manager for Enterprise a desktop image is an Azure VM you change plus an image object hosts deploy from; Nerdio automates generalize and capture. Covers what stays with you and settings fixed at creation."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-desktop-image, nerdio-manager-for-enterprise]
keypoints:
  - "A Nerdio desktop image has two Azure parts: a VM used to manage the image, and the image object used to deploy session hosts. Powering on a desktop image powers on the VM."
  - "Set as image automates Sysprep and sealing. By default Nerdio also removes local profiles and the FSLogix agent before Sysprep, and it can remove Citrix and Omnissa agents."
  - "Gallery replication is on by default. Nerdio lists a maximum of 20 concurrent clone operations per replica and up to 100 replicas per region."
  - "Hibernation support cannot be changed after creation, and Set as image shows security type and gallery as locked. For images from an Azure VM, Nerdio says the image VM is Gen1 unless you select Gen2."
  - "Importing images is optional: Nerdio says custom Azure images in your subscription can build and re-image host pools without being imported, but import unlocks the management features described here."
faq:
  - q: "Do I have to import my images into Nerdio Manager to use them?"
    a: "No. Nerdio says that even with no images imported, the custom Azure images in your subscription can build new host pools and re-image existing ones in the same way as imported images. Importing makes many management features available, and it puts the lifecycle tasks in one portal."
  - q: "Does Nerdio Manager remove the need to maintain a golden image?"
    a: "No. It automates the mechanical steps, such as Sysprep, sealing and optional gallery replication. Someone still decides what goes into the image, tests it and schedules updates. Nerdio's lifecycle page describes importing the image, powering it on, making the changes over RDP and running Power off & set as image. Scripted actions and applications can run as part of Set as image, and an endpoint management tool can apply updates to the running image VM."
  - q: "What can I not change after a desktop image exists?"
    a: "According to Nerdio, hibernation support cannot be enabled or disabled after the image is created. Set as image shows the security type and the Azure Compute Gallery field as locked to the selection made when the image was created or imported. The Stage page describes turning the gallery on in the same dialog and Nerdio does not say whether that works for an image created without one, so decide both at the start."
---

In Nerdio Manager for Enterprise, a desktop image is a pair of Azure objects: a virtual machine you change, and an image object that session hosts are built from. Nerdio automates the step between them, which covers Sysprep, sealing and optional replication to other Azure regions, so you do not run those steps by hand. You still choose what goes into the image and when it changes.

This article is the concept view: what the object is, how you create it, what the product does for you, and which choices are fixed. The monthly patch-and-re-image routine is covered in "An image update workflow with Nerdio", and the generic design questions in "The golden image lifecycle: build, test, release, retire". Menu names come from Nerdio's help center and can change between releases, so check them in your tenant.

## What a desktop image is in Nerdio

Nerdio's host pool documentation says a desktop image consists of two Azure objects: a VM that is used to manage the image, and the image that is used to deploy session hosts. When you power on a desktop image, you are powering on the VM. Virtual machines in a host pool are created from a desktop image, which holds the operating system, your applications and anything else you add. This is what Microsoft calls a [golden image](https://www.m365.fm/entity/golden-image/), and [Nerdio desktop images](https://www.m365.fm/entity/nerdio-desktop-image/) manages its lifecycle.

Nerdio makes one point that is easy to miss: you do not have to import images to use them. Its help center says custom Azure images in your subscription can build new host pools and re-image existing ones in exactly the same way as imported images. Importing adds management features that are otherwise not available, and keeps lifecycle work in one portal. For a team with a working image pipeline outside Nerdio, the choice is about management features, not about whether host pools can use the image.

## Two ways to create an image

Under **Cloud Desktops > Desktop Images**, the **Create** button opens a wizard with the sections VM, Join to AD, Settings, Clean up, Scripted Actions & Apps, Image, Replication and Tags. The **Source** is one of two:

- **Azure library**: build from an image that already exists. Nerdio says the list contains all standard Azure Marketplace images and all custom managed images in your subscription. Images labelled Microsoft 365 Apps include a pre-installed Microsoft 365 Apps for enterprise.
- **Azure VM**: import an existing VM.

Some settings are worth reading before you submit:

- **Join to AD** is on by default. Turning it off keeps AD group policy from applying to the image before it is created; Nerdio's page says to enter local administrator credentials under **Custom credentials** on the Settings step, because the VM is not in the domain.
- **Create image VM as Gen2** is available only for the Azure VM source. Nerdio says image VMs are created as Gen1 by default, and shows a message if the selected OS needs Gen2.
- **Run sysprep in** sets the context in which Sysprep runs, for example System-context. **Specialized image** is for images that keep machine and user information.
- **Do not create image object** creates only the VM. You then run **Power off and set as image** before the image can be used for session hosts. Use it if you want to change the VM first.

Nerdio says creating an image can take up to an hour; progress shows on the **Tasks** tab.

## What the product does instead of you

Microsoft's own golden image guide describes a manual sequence: create a base VM, take snapshots, install and update, remove the VM from the domain, remove user profiles, run Sysprep, shut down, capture, and delete the VM after capture. It warns not to capture the same VM twice and not to capture a VM that already exists in a host pool. Nerdio's pages describe which of these steps it takes over, and two further clean-up options that Learn's guide does not list.

| Task | What Nerdio's pages say |
|---|---|
| Remove user profiles before Sysprep | Nerdio removes all local user profiles during image creation, which it says increases the likelihood of Sysprep success. **Skip removal of local profiles** bypasses this, and its page says Sysprep will fail to remove partially installed APPX apps on the image VM |
| Run Sysprep, seal, capture | **Power off & set as image** starts an automation process that commits the changes to an image object, including Sysprep and sealing, with progress in the logs |
| Additional Nerdio step: remove other agents | **Uninstall legacy VDI agents** tries to remove Citrix and Omnissa agents; only detected agents are removed |
| Additional Nerdio step: FSLogix agent | **Remove FSLogix apps** is selected by default. The agent is not needed in the image, and Nerdio installs the latest [FSLogix](https://www.m365.fm/entity/fslogix/) agent on session hosts created from it |
| Customize the VM | Scripted actions and applications run during creation, against the clone of the image VM by default |

Two details deserve attention. First, Nerdio says Windows scripts run through the Azure Custom Script extension as LocalSystem, on the clone of the image VM before it is sysprepped, and not on the image VM itself. You can switch the target to the source VM. That matters if a script installs something you expect on the VM afterwards. Second, Azure runbooks run in the context of the Nerdio Manager app service principal. The scripts receive variables such as the VM name and region, and Nerdio's Run script page lists `$DesktopImageActiveVersion` and `$DesktopImageStagedVersion`. See [scripted actions](https://www.m365.fm/entity/nerdio-scripted-actions/) for the wider feature, and use the **Restart VM after script execution** option instead of restarting inside a script, because Nerdio says the Custom Script extension fails if a script restarts the VM.

Applications can be added in the same wizard as install or uninstall actions for single applications or groups, in a set order, with an optional reboot.

## Versions, gallery and replication

**Geographic distribution & Azure compute gallery** is enabled by default in the wizard. It stores the image in an [Azure Compute Gallery](https://www.m365.fm/entity/azure-compute-gallery/) and distributes it to the regions you pick. Nerdio's rules:

- Only one gallery can be selected, and it must be in a linked resource group in the same subscription as the image VM.
- The current Azure region must be among the replication regions.
- **Replica count (per region)**: Nerdio says a replica supports a maximum of 20 concurrent clone operations, up to 100 replicas per region are supported, and replicas can only be deployed within the same subscription.

**Set as image** has a **Version Increment Type** field, and Nerdio says version numbers use the format Major.Minor.Revision. For a current version 1.4.3, it gives 2.0.0 for Major, 1.5.0 for Minor and 1.4.4 for Revision. How to use those three levels is your convention; Nerdio does not prescribe one. If you select **Save current image as a backup** for an image that is not in a gallery, Nerdio says the retained image can be found in the Azure portal under Images, and under Custom images in its image selector lists.

Replica count is also a sizing question. The Resize/re-image page describes **Process Host in Groups Of** as the number of concurrent operations for host re-imaging, and the gallery limit is 20 concurrent clone operations per replica. Nerdio does not say the two are the same load. If each re-image operation counted as one clone operation, a group of 20 would fit one replica and a group of 25 would need two; that is our own calculation, not a recommendation. Microsoft's Learn page recommends one replica for every 20 VMs created concurrently and at least three replicas for production images; "Azure Compute Gallery for AVD images: versions and replication" covers that guidance.

## Settings you cannot change later

Choose these at creation or import:

- **Hibernation supported**: Nerdio says it cannot be enabled or disabled after the image is created.
- **Security type**: Standard is the default. Trusted launch and Confidential VM options need a generation 2 VM with the gallery option enabled, and Set as image shows the choice as locked afterwards. Nerdio lists limitations for those options, including no support for backup, managed disks and ephemeral OS disks. Compare that with Microsoft's [trusted launch](https://www.m365.fm/entity/trusted-launch/) documentation before you decide.
- **Azure Compute Gallery**: Set as image shows the field as locked to the choice made at creation or import. The Stage page tells you to toggle the gallery on in that dialog if it is not already on, and Nerdio does not say whether that works for an image created without a gallery. Deciding at the start is safe either way.

Nerdio's backup page says Enhanced backup policies are required to back up Trusted launch desktops, while other pages list lack of backup support for it. Test a restore before you rely on it.

## Cloning, change log, Cloud PCs and tags

- **Clone** creates a new image with the same properties, so customizations need not be rebuilt. Nerdio says that to move an image to another region you select a network in that region during the clone.
- **Change log**: text you type at Set as image is attached to the image, and **Change Log** in the action menu shows changes made manually or automatically.
- **Enable for Cloud PCs** requires Windows 10/11 Enterprise and is not available for AVD, EVD or CIS images. Nerdio says the image is uploaded and tested for compatibility, which can take a long time, with a limit of 20 images uploaded to [Windows 365](https://www.m365.fm/entity/windows-365/).
- **Tags** entered in the wizard apply to the image VM, OS disk, network interface, image object and gallery image.

## What stays your job

Automation covers the mechanical steps; it does not decide content. The lifecycle page runs from import through power on, RDP, the changes and Power off & set as image. Scripted actions and applications can run before Set as image, and in the endpoint management example the VM is left running so that a tool can apply Windows updates to it. Backups are described inconsistently: Set as image says a current version kept as a backup is not visible or manageable in Nerdio Manager, while Manage versions offers a **Backup Version Limit** that deletes the oldest backup. "An image update workflow with Nerdio" and "Image update workflow: test, validate, roll out" cover this in detail.

The native alternative is [custom image templates](https://www.m365.fm/entity/avd-custom-image-templates/), which Learn describes as built on Azure Image Builder, defined in a JSON file, and able to store the result in an Azure Compute Gallery, a managed image or both. The Custom image templates page does not compare effort with a management tool. Learn's golden image guide says only that other approaches exist, such as Intune or Azure Image Builder with Azure DevOps, and that the choice depends on the size and complexity of your environment and your current application deployment processes.

## Sources

- [Nerdio help: Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283774944141-Desktop-Images)
- [Nerdio help: Create a Desktop Image](https://nmehelp.getnerdio.com/hc/en-us/articles/48898864381453-Create-a-Desktop-Image)
- [Nerdio help: Management and lifecycle tasks for imported desktop images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283797323661-Management-and-lifecycle-tasks-for-imported-desktop-images)
- [Nerdio help: Desktop images: set as image](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775147789-Desktop-images-set-as-image)
- [Nerdio help: Stage Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805464077-Stage-Desktop-Images)
- [Nerdio help: Desktop Images Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775171213-Desktop-Images-Scripted-Actions)
- [Nerdio help: Clone Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805270925-Clone-Desktop-Images)
- [Nerdio help: Desktop Images Change Log Feature](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775306125-Desktop-Images-Change-Log-Feature)
- [Nerdio help: Use Azure to Backup and Restore Desktop Image VM Objects](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805225997-Use-Azure-to-Backup-and-Restore-Desktop-Image-VM-Objects)
- [Nerdio help: Desktop Images Manage Versions](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805378445-Desktop-Images-Manage-Versions)
- [Nerdio help: Resize/re-image a host pool](https://nmehelp.getnerdio.com/hc/en-us/articles/26124319282061-Resize-re-image-a-host-pool)
- [Microsoft Learn: Overview of Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery)
- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
