---
title: "Image update workflow: test, validate, roll out"
summary: "A runbook for the part of a Nerdio image update that happens before and after the re-image: stage the version, build a test VM from it, check it, activate it, and keep a rollback path you chose in advance. It lists what Nerdio's help center documents for each stage and where the documentation stops."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-desktop-image, nerdio-manager-for-enterprise]
keypoints:
  - "To test first, create the new version with Stage new image as inactive. Nerdio's toggle Use the \"staged\" image version can create a test desktop image; confirm the Azure image field in your console."
  - "Activation is manual (Activate staged image) or timed (after a number of days). Nerdio says linked pools then get the new image, without saying whether hosts are re-imaged."
  - "Choose rollback before the update: keep the current version as a backup, back up the image VM with Azure Backup, or accept that removing the current version leaves no older one."
  - "Nerdio's pages differ on kept backup versions: one says they are not visible in Nerdio Manager, another describes a Backup Version Limit. Check your console before relying on an old version."
  - "The Resize/re-image page documents no pause between re-image groups for manual validation. If you need a pause, use a small pool first or separate schedules."
faq:
  - q: "How do I test a new Nerdio desktop image version without affecting users?"
    a: "Run Set as image with Stage new image as inactive, which creates the version without activating it. Nerdio says existing configurations continue to use the current version. Then, as our own approach, create a desktop image with Azure library as the source and turn on Use the \"staged\" image version, which Nerdio describes as building the new desktop image from the staged version of the selected desktop image. The toggle is available only for images with Geographic distribution and Azure compute gallery enabled. Nerdio's pages do not show how that image is chosen in the Azure image field, so check this in your console."
  - q: "Can I go back to the previous image version?"
    a: "Only if you kept it. Keep current version as a backup retains the old version as a standalone object, and Nerdio says prior gallery versions appear under Unmanaged ACG image versions in the Desktop image list when you add a host to a dynamic host pool. Alternatively, take an Azure backup of the image VM object before the change, restore a recovery point and run Power off & set as image. If you chose Remove current version after activation, there is nothing to go back to."
  - q: "Does automatic activation re-image my session hosts?"
    a: "Nerdio's pages say that Activate staged image after activates the staged image after the chosen number of days and that linked pools have their associated image updated. They do not say whether that includes re-imaging running hosts. Test it on a non-production pool, and schedule Resize/Re-image explicitly if you want control over the timing."
---

To test a Nerdio image update before it reaches users, create the new version with **Stage new image as inactive**, build a test desktop image from the staged version if your console offers it, check it, and only then activate it and re-image the host pools. Nerdio documents the staging and the toggle, but not the test-VM workflow itself; that part is our approach. Decide the rollback path before you start, because most of the options are set during the update, not after it.

This runbook covers what happens around the re-image: test, validate, activate and roll back. The dialog fields of Set as image and Resize/Re-image are explained in "An image update workflow with Nerdio", and image concepts in "Desktop image management in Nerdio"; this article names only the settings that matter for testing and rollback. Menu names come from Nerdio's help center for [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) and can change between releases.

## What Nerdio documents for testing

Nerdio's Stage Desktop Images page says the Image Staging feature lets administrators test and validate changes before deploying to the wider user base, by deploying images to a test or "Staging" pool before activation. The page then gives steps for staging, auto-activation and manual activation, but none for choosing the test pool. Its note also says the option is available only for desktop images recently refreshed from the Azure Marketplace, while the Set as image page lists **Stage new image as inactive** without that condition. Which applies to your image is something to confirm in the console before you build a process around it.

Nerdio documents a toggle in the Create Desktop Image wizard, though not as a testing step. With **Azure library** as source, **Use the "staged" image version** creates the new desktop image from the staged version of the selected desktop image, if one exists. Nerdio says the setting is available only for desktop images with **Geographic distribution & Azure compute gallery** enabled. In our reading, the result is a separate image VM you can power on, sign in to and test without touching the production image or its host pools. Using the toggle as a test machine is what this runbook adds to the staging steps, and the next steps build on it.

## Step 1: write the pass criteria first

The staging pages describe no validation checklist, so write your own before staging. These are example checks, to be adjusted:

- the image task finished without errors in the Desktop Images Tasks section;
- users sign in and their profile loads, with the FSLogix agent version you expect, since Nerdio installs the latest agent on hosts created from the image;
- the applications you changed start and the applications you did not change still start;
- the security baseline you require is applied.

Record the version number and the change log text you will use, so the result of each check is attached to a specific version.

## Step 2: back up, then stage

1. Decide the rollback route (Step 6) first. If you want an Azure backup of the image VM object, take it now, because a recovery point has to exist before you change anything.
2. Under **Cloud Desktops > Desktop Images**, open the image's action menu and select **Set as image** or **Power off & set as image**. Fill in the fields described in the sibling article.
3. Select **Stage new image as inactive**, and choose **Keep current version as backup** under **Current image action** (the Stage page calls the field **Current version action**) if you want an old version to return to. The Stage page also lists **Save current image as a backup**, not selected by default; if selected, the new image is kept inactive with an older version number.
4. Leave **Activate staged image after** empty for the first runs. It activates the image automatically after a number of days, so in our reading it also ends your test window.
5. Select **Run now**.

The gallery setting needs care, because Nerdio's pages differ. The Stage page says to turn on **Geographic distribution & Azure compute gallery** if it is not already on and to select or create a gallery. The Set as image page shows **Azure Compute Gallery** as locked to the choice made when the image was created or imported. Whether you can still add a gallery to an image created without one is not stated, so check in your console, since staging and the test toggle both depend on the gallery.

Scripts started from the Desktop Images **Run script** action receive the variables `$DesktopImageActiveVersion` and `$DesktopImageStagedVersion`, according to Nerdio. A validation script can write both values to its output, so a log line shows which version it ran against. This is a use we suggest, not a documented workflow.

## Step 3: build the test VM

1. Select **Create** on the Desktop Images page and choose **Azure library**.
2. Turn on **Use the "staged" image version**. Nerdio's toggle text refers to the staged version of the selected desktop image, but its page describes the **Azure image** list as the standard Azure Marketplace images and the custom managed images in your subscription. It does not say how a desktop image is selected there, so check how the staged image appears in your console.
3. Decide **Join to AD** on purpose. Nerdio says turning it off prevents AD group policy from applying to the image before it is created, and tells you to enter local administrator credentials under Custom credentials. In our reading, a test VM that skips group policy tests less than production applies.
4. Submit. Nerdio says creation can take up to an hour.

Power the VM on and run the checks. One option we would consider is **Do not create image object**, which Nerdio describes as creating only the VM; Nerdio does not present it as a testing option, so this is our reading.

Scripts for the test fall into two groups. The **Target VM** setting (clone, the default, or source VM) belongs to scripted actions and applications in the Create wizard, where they run during creation. The **Run script** action on an existing desktop image has no such field on its page, and the page does not say which VM the script runs against.

The Stage page says images can be deployed to a test or staging pool, but neither it nor the Add new page shows how a host is built from the staged version, so use the test VM unless you have confirmed that behaviour yourself.

## Step 4: activate

For manual activation, select the inactive image, choose **Activate staged image**, select **Save current image version as a backup** and select **OK**. Nerdio says the staged image becomes the active version and the older version is saved as a backup and is no longer shown in the list. For timed activation, **Configure auto-activation** in the action menu sets the number of days and the current version action. Whether the timer re-images hosts is not stated, so check it on a non-production pool before relying on it. The sibling article covers both options in more detail.

## Step 5: roll out in groups

With the version active, run **Hosts > Resize/Re-image** on each pool; the sibling article lists the dialog fields. Nerdio's example for **Process Host in Groups Of** suggests groups of 25 for a pool of 150 hosts. A separate, optional checkbox, **After first group is done, set remaining hosts to drain mode**, sets the hosts not yet re-imaged to drain mode once the first group finishes, so users reach only re-imaged hosts. The documented stop mechanism is **Number of failures before aborting**; the page describes no pause for manual validation between groups. Treat the first group as a technical gate, not a user acceptance gate. If you want an acceptance gate, re-image a small pool first, then the rest. With **Force Users to Log Off** set to **Never**, Nerdio waits indefinitely, and a scheduled re-image that comes due meanwhile is skipped.

## Step 6: decide the rollback before you need it

| Route | What Nerdio says | Limits |
|---|---|---|
| Keep current version as backup | The old version stays as a standalone object, listed under **Unmanaged ACG image versions** in the Desktop image list. The dynamic host pool Add new page describes them as backup versions created while activating staged images, usable to restore changes made to session hosts | Set as image says it is not visible or manageable in Nerdio Manager and must be deleted manually. Manage versions says versions can be selected and deleted there, but managed versions cannot. Nerdio does not say whether backups kept this way appear in Manage versions |
| Backup Version Limit | **Manage versions > Enable Version Limit** keeps up to the set number of backups and deletes the oldest when the limit is reached | Nerdio says that when a new version is created and the old one is saved as a backup, the number of backups is limited and the oldest are deleted; in our reading this is the event Keep current version as backup triggers, but Nerdio does not name the option. Whether they appear in Manage versions is not stated, since Set as image calls them not manageable. Check that the version you need has not been deleted by the limit |
| Azure Backup of the image VM object | Create a policy under **Manage backup**, take a **Backup** (with a retention in days) before the change, then **Restore** a recovery point, then **Power off & set as image** | Needs the Microsoft.RecoveryServices provider and a Backup Reader role for Nerdio Manager (assigned automatically if the user who first configures the backup is a subscription Owner). A policy must exist first, and the backup is deleted automatically after its retention days |
| Remove current version after activation | The old version is removed automatically | No older version to return to |

The restore route creates a new image from an older VM state. In our reading it does not undo hosts that have already been re-imaged, because the pages describe restoring the image VM object, not the hosts. For those hosts you would re-image again from an older version. The Add new page offers the unmanaged versions in its Desktop image list; the Resize/Re-image page does not mention them, so check whether they are selectable there before you depend on that path.

If the image uses Trusted launch, Nerdio's pages disagree: one lists lack of backup support, another says Enhanced backup policies are required. Test a restore before you depend on it.

Microsoft's own golden image guide uses snapshots for the same job: take them while customizing, and create a new base VM from the last snapshot if sysprep or capture fails.

## Step 7: close the loop

Record the change log, delete backups you no longer need in the place Step 6 identified for your tenant, and note the staged-to-active date yourself. That is our suggestion, not a documented Nerdio feature.

## Sources

- [Nerdio help: Stage Desktop Images](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805464077-Stage-Desktop-Images)
- [Nerdio help: Desktop images: set as image](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775147789-Desktop-images-set-as-image)
- [Nerdio help: Create a Desktop Image](https://nmehelp.getnerdio.com/hc/en-us/articles/48898864381453-Create-a-Desktop-Image)
- [Nerdio help: Desktop Images Manage Versions](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805378445-Desktop-Images-Manage-Versions)
- [Nerdio help: Desktop Images Scripted Actions](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775171213-Desktop-Images-Scripted-Actions)
- [Nerdio help: Use Azure to Backup and Restore Desktop Image VM Objects](https://nmehelp.getnerdio.com/hc/en-us/articles/48283805225997-Use-Azure-to-Backup-and-Restore-Desktop-Image-VM-Objects)
- [Nerdio help: Resize/re-image a host pool](https://nmehelp.getnerdio.com/hc/en-us/articles/26124319282061-Resize-re-image-a-host-pool)
- [Nerdio help: Add a new session host to a dynamic host pool](https://nmehelp.getnerdio.com/hc/en-us/articles/26124322398605-Add-a-new-session-host-to-a-dynamic-host-pool)
- [Nerdio help: Desktop Images Change Log Feature](https://nmehelp.getnerdio.com/hc/en-us/articles/48283775306125-Desktop-Images-Change-Log-Feature)
- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
