---
title: "An image update workflow with Nerdio"
summary: "In Nerdio Manager for Enterprise, an image update is three linked jobs: patch or change the desktop image VM, run Set as image to create a new version, then re-image the host pool from it. This article lays out the monthly cycle, the staging and backup options, and where it differs from the native Azure Virtual Desktop route."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-desktop-image, golden-image]
keypoints:
  - "Nerdio's cycle is power on the image VM, change it, then Power off & set as image. Per the help center, an automated process runs Sysprep and sealing and commits the result to the image object, after which the image can build new host pools or re-image existing ones."
  - "A monthly cycle uses three recurring jobs: patch the image (the Update Windows 10 or Update Windows 11 script, or an endpoint management tool), Set as image, then Resize/Re-image on the host pool. Each must start after the previous one has finished."
  - "Staging creates the new version inactive. Existing configurations keep using the current version until you activate it by hand or after a set number of days, and linked pools are then updated."
  - "Re-image settings control the blast radius: group size, number of failures before aborting, drain mode for hosts not yet processed, and how long to wait before forcing users off."
  - "Backup versions need attention. Nerdio's pages say some backup images are not shown or managed in Nerdio Manager and must be deleted manually to avoid storage costs."
faq:
  - q: "Can I stage an image before it reaches users?"
    a: "Yes. Stage new image as inactive in Set as image creates the new version without activating it, and existing configurations keep using the current version. Nerdio's Stage Desktop Images page says staging is available only for images recently refreshed from the Azure Marketplace, while the Set as image page lists the option without that condition. Check which applies to your image before you plan around it."
  - q: "Does Set as image replace running Sysprep myself?"
    a: "According to Nerdio, Set as image automates the steps that commit changes to the image object, including Sysprep and sealing. Nerdio Manager also removes local user profiles before this to improve Sysprep success, unless you select Skip removal of local profiles. You still decide what goes into the image beforehand."
  - q: "What happens to users on hosts that are being re-imaged?"
    a: "That is set in the Resize/Re-image dialog. Force Users to Log Off waits a chosen time before signing users out, or never forces it, and drain mode while waiting is selected by default. You can also drain the hosts not yet processed after the first group finishes, so new connections reach re-imaged hosts."
---

An image update in Nerdio Manager for Enterprise is a chain of three jobs. You change the desktop image VM, run **Set as image** to turn that VM into a new image version, and then run **Resize/Re-image** on each host pool that should use it. This article sets out that chain as a repeatable monthly cycle, explains the staging and backup options, and compares it with the native Azure Virtual Desktop route. Generic image design is covered in the [golden image](/entity/golden-image/) articles; this one stays with the Nerdio steps.

The facts below come from the help center for [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/). Menu names can change between releases, so check them in your tenant.

## How the pieces fit

In Nerdio's model a [desktop image](/entity/nerdio-desktop-image/) consists of two Azure objects: a virtual machine used to manage the image, and the image itself, which is used to deploy session hosts. Powering on a desktop image powers on its VM.

Nerdio's lifecycle page lists the loop:

1. Power on the image under **Desktop Images**.
2. Connect with RDP and make the changes.
3. Select **Power off & set as image**. An automated process commits the changes to an image object, including Sysprep and sealing tasks you would otherwise run by hand. Progress appears in the logs.
4. Use the image to build host pools or re-image existing ones.

The distinction from a manual process is step 3. The native guidance on Microsoft Learn is to run [sysprep](/entity/sysprep/) yourself, capture the VM, delete it, and build the next base from your last snapshot. Sysprep has its own articles.

## What Set as image decides

The Set as image dialog is where a version is defined. The options that matter for an update cycle:

- **Run scripted actions before set as image**, for example to optimize the image, install software or install updates, optionally with AD credentials. See [scripted actions](/entity/nerdio-scripted-actions/).
- **Refresh image from Azure Marketplace**: replace the image with the latest version of the selected Marketplace image.
- **Geographic distribution & Azure compute gallery**: store the image in an [Azure Compute Gallery](/entity/azure-compute-gallery/) and replicate it to selected regions. Only one gallery can be chosen, it must be in a linked resource group in the same subscription as the image VM, and the current region must be among the replication regions.
- **Version Increment Type**: Major, Minor or Revision. From version 1.4.3 these give 2.0.0, 1.5.0 and 1.4.4.
- **Stage new image as inactive**, **Backup Version Limit**, **Change log** and **Apply tags**.

Two choices are fixed at creation: hibernation support cannot be changed afterwards, and the security type is locked. Options other than Standard need a generation 2 VM with the gallery option enabled, and Nerdio notes that Trusted launch and Confidential VM images do not support backup, managed disks or ephemeral OS disks. See [trusted launch](/entity/trusted-launch/).

Nerdio Manager removes local user profiles before Sysprep to improve its success; **Skip removal of local profiles** turns this off.

## Option A: patch the image with Nerdio's own scripts

Nerdio's article on automating Windows patching describes two methods. The first patches the image and re-images the hosts. It has three scheduled tasks:

1. **Patch the image.** Under **Desktop images**, open the image's action menu and select **Run script**. Choose **Update Windows 10** or **Update Windows 11** to match the image. Optionally enable **Restart VM after script execution**, and set the time zone to match the image VM.
2. **Create the new version.** Select **Set as image** on the patched image and enable **Schedule**. Set the start time after patching finishes. Nerdio's example patches two days after Patch Tuesday and runs Set as image the next day.
3. **Re-image the hosts.** Under **Workspaces**, select the workspace and the host pool. From the **Manage Hosts** menu choose **Hosts > Resize/Re-image**, select the calendar icon, and on **New schedule** choose the updated desktop image. It must run after the other two tasks have completed.

Patch Tuesday is the second Tuesday of each month; Nerdio recommends the schedule option **Monthly after "Patch Tuesday"** with a **Days after** value for all three tasks.

The second method patches session hosts directly through **Hosts > Run script**. Our reading, not a Nerdio statement: it patches running hosts only, so hosts created later from an unchanged image start unpatched. This article follows the image route.

## Option B: patch with an endpoint management tool

Nerdio's lifecycle page also describes using a tool such as Microsoft Endpoint Configuration Manager or Ivanti Endpoint Manager. The sequence is:

1. In Set as image, select **Leave desktop image VM running** so the tool can modify the image.
2. Run a recurring job or runbook on Patch Tuesday in the endpoint tool.
3. Schedule **Set as image** to start shortly after that job finishes.
4. Schedule the host pool's **Re-image Hosts** function to start shortly after Set as image completes.

The help center notes that this is one example. In both options the schedules are time-based, so leave a margin between jobs.

## Refreshing from the Azure Marketplace

A third pattern starts from a Microsoft-published image each time. Nerdio describes refreshing desktop images from the Azure Marketplace so that you have a pristine image with the latest OS patches. To set it up: **Cloud Desktops > Desktop Images**, find the image, select **Power off & Set as image**, turn on **Schedule**, enable **Refresh image from Azure Marketplace**, then pick the **Marketplace Image**. You can join the image to AD directly and run scripted actions with the refresh, for example to install Teams or the Zoom client. Nerdio says the refreshed image is deployed automatically to all session hosts that use it.

Refreshing removes the existing desktop image VM and re-creates it from the latest Marketplace image, so anything installed by hand is gone; put your customizations into scripted actions and application management. Marketplace images you link yourself under **System > Settings** are, in Nerdio's words, not certified by Nerdio for compatibility.

## Staging and activation

**Stage new image as inactive** creates the new version without activating it. Existing configurations keep using the current version, and the pools linked to the image are updated when the staged image is activated. The related settings are:

- **Activate staged image after**: activates automatically after a set number of days.
- **Current image action**: keep the current version as a backup, or remove it after activation.
- **Activate staged image** in the action menu, for manual activation. The previous version is saved as a backup and drops out of the list.

The Stage Desktop Images page describes the purpose as testing and validating changes before a wider user base sees them, and says Nerdio Manager deploys the image to a test or "Staging" pool before activation. It also says staging is available only for images recently refreshed from the Azure Marketplace, whereas the Set as image page lists the staging option without that condition. The steps on the staging page do not include a field for choosing the test pool, so confirm in your tenant how a pool picks up a staged version before you rely on it as a gate.

## Re-imaging the host pool

Open the host pool menu and select **Hosts > Resize/Re-image**. The dialog offers these settings:

| Setting | What Nerdio says |
|---|---|
| Run now or Schedule | Run at once, or in chosen time frames with an existing or new schedule |
| Desktop Image | The image applied to the hosts |
| Process Host in Groups Of | Number of concurrent re-imaging operations; larger groups finish faster, but a bad image or an Azure issue can leave many hosts in an error state. Default 1. For 150 hosts the page suggests groups of 25 |
| Number of failures before aborting | Stops the run after that many failed tasks. Default 1 |
| After first group is done, set remaining hosts to drain mode | Users then connect only to re-imaged hosts. See [drain mode](/entity/avd-drain-mode/) |
| Force Users to Log Off | Immediately, after a period, or Never; Never waits indefinitely, and a re-image that comes due meanwhile is skipped |
| Set hosts to drain mode while waiting | Selected by default; can be cleared only when forcing logoff is set to Never |

You must type **CONFIRM** in the confirmation box.

## Versions, backups and clean-up

With the gallery option on, each Set as image creates a new version in the gallery. The Manage versions pages give two controls: manual deletion, where managed versions cannot be deleted, and an **Enable Version Limit** toggle with a **Backup Version Limit**, after which the oldest backup is deleted when the limit is reached. The Set as image page adds that backup images are not visible or manageable in Nerdio Manager, that gallery backups appear under **Unmanaged ACG image versions**, and that other backups appear under Images in the Azure portal; delete them manually to avoid storage costs. The pages do not explain how the limit relates to the unmanaged versions, so check the gallery after the first few cycles.

If you also use Windows 365, the same dialog has **Enable for Cloud PCs**, and Nerdio notes a limit of 20 uploaded images. Custom image templates are an alternative Azure build route, covered in the [custom image templates](/entity/avd-custom-image-templates/) articles.

## Native route in comparison

| Step | Nerdio Manager for Enterprise | Native Azure Virtual Desktop |
|---|---|---|
| Change the image | Power on the image VM, connect, change it, or use scripts and application management | Create a new base VM from your last snapshot and patch it |
| Generalize and capture | Set as image automates Sysprep and sealing | Run sysprep, capture, then delete the VM; never capture the same VM twice |
| Roll out | Resize/Re-image, in groups, scheduled | Session host update, for [host pools with a session host configuration](/entity/avd-session-host-configuration/) only |
| Batching | Group size and failure limit | A batch; one initial host is updated first to test the process |
| Staging | Inactive version, then manual or timed activation | Test on a separate host pool that matches production |

Session host update deallocates or deletes the existing VMs and creates new ones. Its Learn page says autoscale should be disabled before an update and kept disabled until it finishes, that manual customizations are not present afterwards, and that it is available only in the global Azure cloud. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. The Nerdio pages used here do not state whether Nerdio's autoscale must be paused during a re-image, so test that case.

## Sources

Retrieved on 17 November 2026.

- [Nerdio help: Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283774944141-Desktop-Images)
- [Nerdio help: Management and lifecycle tasks for imported desktop images](https://nmehelp.getnerdio.com/hc/en-us/articles/26124349934989-Management-and-lifecycle-tasks-for-imported-desktop-images)
- [Nerdio help: Desktop images: set as image](https://nmehelp.getnerdio.com/hc/en-us/articles/26124381963149)
- [Nerdio help: Desktop images: set as image (second listing of the same article)](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775147789)
- [Nerdio help: Stage Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/26124320214797)
- [Nerdio help: Refresh desktop images from the Azure Marketplace](https://nmehelp.getnerdio.com/hc/en-us/articles/48283781457677)
- [Nerdio help: Resize/re-image a host pool](https://nmehelp.getnerdio.com/hc/en-us/articles/26124319282061)
- [Nerdio help: How can I automate Windows patching on desktop images and session hosts?](https://nmehelp.getnerdio.com/hc/en-us/articles/35702669333133-How-can-I-automate-Windows-patching-on-desktop-images-and-session-hosts)
- [Nerdio help: Desktop Images Manage Versions](https://nmehelp.getnerdio.com/hc/en-us/articles/32612209645581)
- [Nerdio help: Desktop Images Change Log Feature](https://nmehelp.getnerdio.com/hc/en-us/articles/26124351649677-Desktop-Images-Change-Log-Feature)
- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
