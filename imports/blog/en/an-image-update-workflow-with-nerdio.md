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
  - "A monthly cycle uses three recurring jobs: patch the image (the Update Windows 10 or Update Windows 11 script, or an endpoint management tool), Set as image, then Resize/Re-image on the host pool. Nerdio says each should start after the previous one has finished."
  - "Staging creates the new version inactive. Existing configurations keep using the current version until you activate it, by hand or automatically after a set number of days; Nerdio says linked pools have their image updated when the automatic activation runs."
  - "Re-image settings control the blast radius: group size, number of failures before aborting, drain mode for hosts not yet processed, and how long to wait before forcing users off."
  - "Backup versions need attention. Nerdio's pages say some backup images are not visible or manageable in Nerdio Manager and should be deleted manually to avoid storage costs."
faq:
  - q: "Can I stage an image before it reaches users?"
    a: "Nerdio's pages differ on the conditions. The Stage Desktop Images page says staging is available only for desktop images recently refreshed from the Azure Marketplace, while the Set as image page and the patching FAQ list Stage new image as inactive without that condition; the Set as image page points to the Stage page for details. The option creates the new version without activating it, and existing configurations keep using the current version. Check which applies to your image before you plan around it."
  - q: "Does Set as image replace running Sysprep myself?"
    a: "According to Nerdio, Set as image automates the steps that commit changes to the image object, including Sysprep and sealing. Nerdio adds that during the image creation process it removes all local user profiles, which increases the likelihood of Sysprep success; Skip removal of local profiles bypasses this step. You still decide what goes into the image beforehand."
  - q: "What happens to users on hosts that are being re-imaged?"
    a: "That is set in the Resize/Re-image dialog. Force Users to Log Off can act immediately, after a chosen time, or Never, in which case Nerdio waits for users to log off by themselves. Drain mode while waiting is selected by default. Separate options control logging off disconnected sessions and sending a message while waiting. You can also drain the hosts not yet processed after the first group finishes, so new connections reach re-imaged hosts."
---

An image update in Nerdio Manager for Enterprise is a chain of three jobs. You change the desktop image VM, run **Set as image** to turn that VM into a new image version, and then run **Resize/Re-image** on each host pool that should use it. This article sets out the chain as a monthly cycle, explains staging and backups, and compares it with the native Azure Virtual Desktop route.

The facts below come from the help center for [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/); menu names can change between releases, so check them in your tenant. For generic image design see the [golden image](/entity/golden-image/) articles.

## How the pieces fit

In Nerdio's model a [desktop image](/entity/nerdio-desktop-image/) consists of two Azure objects: a VM used to manage the image, and the image itself, used to deploy session hosts. Powering on a desktop image powers on its VM.

Nerdio's lifecycle page lists the loop:

1. Power on the image under **Desktop Images**.
2. Connect with RDP and make the changes.
3. Select **Power off & set as image**. An automated process commits the changes to an image object, including Sysprep and sealing. Progress appears in the logs.
4. Use the image to build host pools or re-image existing ones.

Native guidance on Microsoft Learn differs at step 3: run [sysprep](/entity/sysprep/) yourself, capture the VM, delete it, and build the next base from your last snapshot.

## What Set as image decides

The options in the Set as image dialog that matter for an update cycle:

- **Run scripted actions before set as image**, for example to optimize the image, install software or install updates. See [scripted actions](/entity/nerdio-scripted-actions/).
- **Refresh image from Azure Marketplace**: replace the image with the latest version of the selected Marketplace image (see below).
- **Geographic distribution & Azure compute gallery**: store the image in an [Azure Compute Gallery](/entity/azure-compute-gallery/) and replicate it to selected regions. Only one gallery can be chosen, in a linked resource group in the image VM's subscription, and the current region must be among the replication regions.
- **Version Increment Type**: Major, Minor or Revision. From 1.4.3 these give 2.0.0, 1.5.0 and 1.4.4.
- **Stage new image as inactive**, **Backup Version Limit**, **Change log** and **Apply tags**.

Three settings are fixed once the image exists: hibernation support cannot be changed after creation, and the security type and the Azure Compute Gallery are locked to the selection made when the image was created or imported. Standard is the default security type; the other options need a generation 2 VM with the gallery option enabled. Nerdio's page lists limitations of the Trusted launch and Confidential VM options, such as no support for backup, managed disks and ephemeral OS disks, whereas Microsoft's Trusted Launch page lists only managed images and Linux VM hibernation as unsupported. Check the current state before choosing a security type; see [trusted launch](/entity/trusted-launch/).

Nerdio also says it removes all local user profiles during image creation, which increases the likelihood of Sysprep success; **Skip removal of local profiles** bypasses this.

## Option A: patch the image with Nerdio's own scripts

Nerdio's patching FAQ describes two methods. The first patches the image and re-images the hosts, with three scheduled tasks:

1. **Patch the image.** Under **Desktop images**, open the image's action menu and select **Run script**. Choose **Update Windows 10** or **Update Windows 11** to match the image. Optionally enable **Restart VM after script execution**.
2. **Create the new version.** Select **Set as image** on the patched image, enable **Schedule** and start it after patching finishes. Nerdio's example patches two days after Patch Tuesday and runs Set as image three days after.
3. **Re-image the hosts.** Under **Workspaces**, select the workspace and host pool, then **Manage Hosts > Hosts > Resize/Re-image**, select the calendar icon, and on **New schedule** choose the updated desktop image. It should run once the other two tasks are complete; the example uses four days after Patch Tuesday.

Patch Tuesday is the second Tuesday of each month; Nerdio recommends **Monthly after "Patch Tuesday"** with a **Days after** value for all three tasks.

The second method patches session hosts directly: **Hosts > Run script** runs the Update Windows script on all VMs in the pool, with an optional **Exclude non-running hosts** setting. Because it changes the hosts and not the image, hosts built later from the unchanged image start at the image's patch level. This article follows the image route.

## Option B: patch with an endpoint management tool

Nerdio's lifecycle page also describes a tool such as Microsoft Endpoint Configuration Manager or Ivanti Endpoint Manager. In Set as image, select **Leave desktop image VM running** so the tool can modify the image. Run a recurring job on Patch Tuesday in the endpoint tool, schedule **Set as image** to start shortly after that job finishes, and schedule the host pool's **Re-image Hosts** function shortly after Set as image completes. The help center notes that this is one example. The schedules are time-based, so leave a margin between jobs.

## Refreshing from the Azure Marketplace

A third pattern starts from a Microsoft-published image each time. Nerdio describes refreshing desktop images from the Azure Marketplace to get a pristine image with the latest OS patches: select **Power off & Set as image**, turn on **Schedule**, enable **Refresh image from Azure Marketplace** and pick the **Marketplace Image**. Scripted actions can run with the refresh. Nerdio says the refreshed image is deployed automatically to all session hosts that use it, unlike the patch-the-image pattern with its separate Resize/Re-image job.

Nerdio states that refreshing removes the existing desktop image VM and re-creates it from the latest Marketplace image. In our reading, anything installed on the old VM by hand is then gone, so put customizations into scripted actions and application management.

## Staging and activation

**Stage new image as inactive** creates the new version without activating it. Existing configurations keep using the current version. Nerdio's staging steps turn on **Geographic distribution & Azure compute gallery** if it is not already on, so staging assumes the gallery option. Related settings:

- **Activate staged image after**: activates automatically after a set number of days. Nerdio says any linked pools then have their associated image updated, without saying whether that re-images the hosts.
- **Current image action**: keep the current version as a backup, or remove it after activation.
- **Activate staged image** in the action menu, for manual activation. Nerdio says the staged image becomes the active version and the older version is saved as a backup.

The Stage Desktop Images page describes testing changes in a test or "Staging" pool before activation. It also says staging is available only for images recently refreshed from the Azure Marketplace, whereas the Set as image page and the patching FAQ list the staging option without that condition. Nerdio's staging steps have no field for choosing the test pool, and its pages do not say which version a scheduled Resize/Re-image uses while a newer version is staged. Confirm both in your tenant before relying on staging as a gate.

## Re-imaging the host pool

Select **Hosts > Resize/Re-image** on the host pool. The dialog offers:

| Setting | What Nerdio says |
|---|---|
| Run now or Schedule | Run at once, or in chosen time frames |
| Desktop Image | The image applied to the hosts |
| Process Host in Groups Of | Concurrent re-imaging operations; larger groups finish faster, but a bad image or an Azure issue can leave many hosts in error. For 150 hosts the page suggests groups of 25. The patching FAQ gives a default of 1 |
| Number of failures before aborting | Stops the run after that many failed tasks. The patching FAQ gives a default of 1 |
| After first group is done, set remaining hosts to drain mode | Users then connect only to re-imaged hosts. See [drain mode](/entity/avd-drain-mode/) |
| Force Users to Log Off | Immediately, after a period, or Never; Never waits indefinitely, and a re-image that comes due meanwhile is skipped |
| Log off users with disconnected sessions | When disabled, disconnected sessions are not forcibly logged off |
| Set hosts to drain mode while waiting | Selected by default; can be cleared only when forcing logoff is set to Never |
| Send message while waiting | Optional text sent to users |

Type **CONFIRM** in the confirmation box.

## Versions, backups and clean-up

Nerdio's Manage versions page gives two controls for gallery versions: manual deletion (managed versions cannot be deleted) and an **Enable Version Limit** toggle with a **Backup Version Limit**; when the limit is reached, the oldest backup version is deleted.

Set as image has two backup options. **Keep current version as backup** retains the version as a standalone object, and prior gallery versions can be used under **Unmanaged ACG image versions**. **Save current image as a backup** keeps a gallery image with an older version number; outside a gallery it is under Azure portal > Images, and in Nerdio's selectors under Custom images. For both, Nerdio says the backup is not visible or manageable via Nerdio Manager and should be deleted manually when no longer needed, to avoid storage costs.

Nerdio thus calls backups unmanaged and also describes an automatic limit on them. It does not say whether the limit covers the versions listed as unmanaged, so check the gallery after the first few cycles.

For Windows 365, the same dialog has **Enable for Cloud PCs**, with a limit of 20 uploaded images. Custom image templates are an alternative build route; see the [custom image templates](/entity/avd-custom-image-templates/) articles.

## Native route in comparison

| Step | Nerdio Manager for Enterprise | Native Azure Virtual Desktop |
|---|---|---|
| Change the image | Power on the image VM and change it, or use scripts | New base VM from your last snapshot, patched |
| Generalize and capture | Set as image automates Sysprep and sealing | Run sysprep, capture, delete the VM; never capture the same VM twice |
| Roll out | Resize/Re-image, in groups | Session host update, only for [host pools with a session host configuration](/entity/avd-session-host-configuration/) |
| Staging | Inactive version, then manual or timed activation | Test the update process on a test host pool aligned to the host pool |

Session host update deallocates or deletes the existing VMs and creates new ones; its first batch updates one initial host to test the process. Its Learn page says autoscale should be disabled before an update and kept disabled until it finishes, that manual customizations are not present afterwards, and that it is available only in the global Azure cloud. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. Nerdio's documentation on re-imaging does not say whether Nerdio's autoscale must be paused during a re-image, so test that case before the first scheduled run.

## Sources

- [Nerdio help: Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283774944141-Desktop-Images)
- [Nerdio help: Management and lifecycle tasks for imported desktop images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283797323661-Management-and-lifecycle-tasks-for-imported-desktop-images)
- [Nerdio help: Desktop images: set as image](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775147789-Desktop-images-set-as-image)
- [Nerdio help: Stage Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805464077-Stage-Desktop-Images)
- [Nerdio help: Refresh desktop images from the Azure Marketplace](https://nmehelp.getnerdio.com/hc/en-us/articles/48283781457677-Refresh-desktop-images-from-the-Azure-Marketplace)
- [Nerdio help: Resize/re-image a host pool](https://nmehelp.getnerdio.com/hc/en-us/articles/26124319282061-Resize-re-image-a-host-pool)
- [Nerdio help: How can I automate Windows patching on desktop images and session hosts?](https://nmehelp.getnerdio.com/hc/en-us/articles/35702669333133-How-can-I-automate-Windows-patching-on-desktop-images-and-session-hosts)
- [Nerdio help: Desktop Images Manage Versions](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805378445-Desktop-Images-Manage-Versions)
- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Trusted Launch for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
