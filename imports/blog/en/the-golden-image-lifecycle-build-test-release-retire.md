---
title: "The golden image lifecycle: build, test, release, retire"
summary: "A golden image for Azure Virtual Desktop goes through four stages: build it from a fresh base, test it on a pool that matches production, release it as a versioned gallery image, and retire old versions once nothing references them. Each stage has documented traps, from sysprep to the fact that an end of life date does not block a version."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [golden-image, avd-custom-image-templates]
keypoints:
  - "Learn says to build each image from a fresh base VM, not from an existing custom image, never to capture a VM that is registered in a host pool, and not to capture the same VM twice."
  - "Custom image templates build the image with Azure Image Builder, apply built-in or custom scripts, and can output to an Azure Compute Gallery, a managed image or both."
  - "Exclude from latest only matters for deployments that use latest in place of a version number, and the end of life date is informational. Neither blocks a version that is requested by number."
  - "Session host update rolls a new image out in batches for pools with a session host configuration. Learn asks you to test it first on a test pool that matches production."
  - "Learn recommends at least two replicas for a gallery image used with session host update and at least three replicas for production images in general."
faq:
  - q: "Should I use a managed image or an Azure Compute Gallery?"
    a: "Learn recommends Azure Compute Gallery images for production because of capabilities such as replication and image versioning, and describes the gallery as the way to create and share images at scale. It describes managed images as suited to development and test, with a couple of simple generalized images used within a single region and subscription. A managed image can only create VMs in its own region and cannot be shared across subscriptions and tenants."
  - q: "Can I capture a session host that is already in a host pool?"
    a: "Learn says not to. Its configuration would conflict with the image and the new VM would not work. Build the image from a separate base VM that was never registered to a host pool."
  - q: "How do I keep a new image version from being picked up automatically?"
    a: "Set Exclude from latest to Yes on the version. Learn ties this to creating a VM with latest in place of a version number, so a deployment that names the version can still use it. The session host update pages do not say whether a configuration accepts latest, so pin a version number you have tested. The flag can be changed after creation."
---

A golden image is the prepared operating system image from which session hosts are built. Treat it as a product with a lifecycle in four stages: build it from a clean base, test it on a pool that matches production, release it as a numbered version, and retire versions once nothing references them. This article follows Microsoft Learn's guidance through each stage, compares the two main build methods, and lists the traps Learn documents. It covers the process, not a single tool. For the entity background, see [golden image](/entity/golden-image/).

## Stage 1: build

### Two build methods compared

| | Manual VM, snapshot, sysprep | Custom image template |
|---|---|---|
| How | You create a base VM, customize it, run sysprep and capture it | A JSON template is submitted to Azure Image Builder, which builds and generalizes the image with sysprep |
| Repeatability | As good as your notes | Source image, targets, build properties and scripts are stored in the template |
| Customization | Anything you can do on a VM | Built-in scripts and your own scripts hosted at a publicly available location |
| Typical output | Gallery image or managed image | Gallery image, managed image or both |
| Needs | A VM and snapshots | A user-assigned managed identity, a custom role, resource providers |

The repeatability row is an assessment, not Learn wording. Learn also names Microsoft Intune and Azure Image Builder with Azure DevOps as other approaches and says the choice depends on environment size and your app deployment process.

### Manual build

The golden image article gives this sequence:

1. Choose an OS from the list of supported virtual machine OS images. Learn recommends Windows 10 or 11 multi-session or a Windows Server image for pooled host pools, and Windows 10 or 11 Enterprise for personal host pools. Generation 1 and 2 both work, and Generation 2 supports features Generation 1 does not.
2. Create the base VM without the "Login with Microsoft Entra ID" flag. You can enable it later when you deploy hosts.
3. Take a snapshot of the disk, and take more at intermediate points during heavy installs.
4. Install apps, updates and settings. If the VM is domain joined, remove it from the domain before sysprep.
5. Do not install the Azure Virtual Desktop agent to register the VM to a pool. Hosts built from that image would fail to join, because the registration token will have expired.
6. Disable antivirus before sysprep, since it can break it. Make sure Unified Write Filter is not enabled, because it is not supported on session hosts.
7. Take a final snapshot, run sysprep as described in the generalize guide, and capture.

On capture, Learn recommends an Azure Compute Gallery for production. Learn's imaging overview notes that the gallery was formerly known as Shared Image Gallery, which is the name some older pages still use. After a capture you must delete the VM, because you can no longer use it. If capture fails, do not capture the same VM again; create a new VM from the last snapshot and run sysprep again. Likewise, build the next image from a new base VM created from your last snapshot, and patch that base regularly.

### Custom image templates

The portal path is **Azure Virtual Desktop > Custom image templates > + Add custom image template**, with tabs for Basics, Source image, Distribution targets, Build properties, Customizations, Tags and Review. You set a build timeout in minutes, and Learn recommends a higher value for language pack installation or Windows Optimization because they trigger Windows Update. It gives no default or range. The feature is described as generally available in the What's new entry of September 2023; the template pages themselves carry no label. Prerequisites, the built-in script list and the template anatomy are covered in the article on Azure Image Builder for AVD. [Custom image templates](/entity/avd-custom-image-templates/) sit on top of [Azure Image Builder](/entity/azure-image-builder/).

## Stage 2: test

The session host update page asks you to test an update on a test host pool that matches production, including applications and hotfixes. The Azure Compute Gallery page adds that production and test images should live in separate galleries. The following checklist is a suggestion built from the traps Learn documents:

- The image deploys on the intended VM size and generation. Learn says Trusted launch and Confidential VMs need a Generation 2 image.
- A host built from it registers and reports as available.
- Your applications start, and the profile setup you rely on (for example [FSLogix](/entity/fslogix/)) works for a test user.
- Domain join or Entra join succeeds, and policies apply.
- Monitoring works. If you use Azure Virtual Desktop Insights, Learn says the Azure Monitor agent or Log Analytics agent is not installed automatically on updated hosts. Options are Azure Policy for the Azure Monitor agent, Azure Automation for the Log Analytics agent, or adding the hosts manually in Insights.

A validation host pool is different. Learn describes it as the pool that receives Azure Virtual Desktop service updates first, so it tests the service, not your image. Use a separate test pool for images.

## Stage 3: release

Release means publishing a version, deciding it is approved, and pointing pools at it.

**Version it.** In an [Azure Compute Gallery](/entity/azure-compute-gallery/), a version number has the form MajorVersion.MinorVersion.Patch, uses integers and periods, and must fit a 32-bit integer. A scheme such as 2026.11.0 fits that rule; the scheme is your choice, not Learn's. Versioning, replication and sharing are covered in the article on Azure Compute Gallery for AVD images.

**Replicate it.** Replication time depends on the amount of data and the number of target regions, and Learn says it can take a few hours in some cases. The page on updating session hosts recommends at least two replicas of a gallery image used with session host update, and the Azure Compute Gallery page recommends at least three replicas for production images.

**Stage it.** The **Exclude from latest** field defaults to No, and Learn describes it as the way to keep a version from being used when a VM is created with `latest` in place of a version number. It does not hide the version from anyone who names it. The session host update pages do not say whether a session host configuration accepts `latest`, so a practical approach, not a Learn rule, is to leave candidates unreferenced and give the configuration the version number only after the test pool passes. Exclude from latest and the end of life date can be changed after creation.

**Roll it out.** For a pool with a [session host configuration](/entity/avd-session-host-configuration/), point the configuration to the new version and schedule a session host update. Learn's image requirement is that the image is supported for Azure Virtual Desktop and for the generation of virtual machine in use. Batches, timing, notifications, the purchase plan and OS disk limits, and the `C:\packages\plugin` trap are covered in "Managing session host updates with a session host configuration". Two limits matter at release time:

- Session host update is only available in the global Azure cloud, not in clouds such as Azure US Government or Azure operated by 21Vianet.
- Learn's session host update pages say a gallery image in a different Azure subscription than the host pool is not currently supported, while the What's new entry of September 2025 announces support for images in another subscription within the same tenant. The pages disagree, so test it before you rely on it. The article "Session host configuration in Azure Virtual Desktop explained" discusses this.

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. For pools under standard management, build new hosts from the version and swap them in, as in the article on adding and replacing hosts.

**Know the rollback.** If a host fails to update, the service tries to roll that host back, while hosts already updated stay updated. Keep the previous gallery version available for as long as a rollout or a retry may need it.

## Stage 4: retire

Retiring a version has three parts, and the first is weaker than it sounds.

1. **Stop recommending it.** Set Exclude from latest to Yes and set the **End of life date**, which the image version article describes as the date when you think the version should stop being used. Learn is explicit that end of life dates are informational: users can still create VMs from images and versions past the end of life date. Together with the Exclude from latest wording, this means a version requested by number stays usable. Both settings are signals, not locks.
2. **Find what still references it.** In the host pool's Session hosts list, the Current Version column shows the timestamp of the session host configuration version, not the image version, so it does not answer this question. Learn does not describe a single report for it. Check the image selected in the pool's session host configuration and the image reference in the properties of the VMs in Azure. Learn says new hosts are created with the configuration stored in the session host configuration. It does not document what happens when that configuration names a deleted version, so expect host creation from it to fail. The gallery FAQ documents the neighboring case: VMs already created from a deleted gallery image stay unaffected, but virtual machine scale set scale-out fails because it relies on the source image ID.
3. **Delete it.** Learn says to delete gallery resources in reverse order: image versions first, then the image definition once all its versions are gone, then the gallery. The Azure CLI command is:

```bash
az sig image-version delete \
  --resource-group <rg> --gallery-name <gallery> \
  --gallery-image-definition <definition> --gallery-image-version <x.y.z>
```

Learn also lists protections against accidental deletion: resource locks at the gallery level, setting `safetyProfile.allowDeletionOfReplicatedLocations` to `false` on image versions, and `BlockDeletionBeforeEndOfLife` to block deletion before the end-of-support date.

## Common mistakes

- Building a new image on top of an existing custom image. Learn says to start from a fresh source.
- Leaving antivirus on during sysprep.
- Capturing a VM twice or reusing the captured VM.
- Skipping a test pool, then discovering a profile or app issue during a production update.
- Treating Exclude from latest or the end of life date as a block, then finding a pool still deploying the old version.
- Deleting a version before checking which configurations name it.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Create an Azure Virtual Desktop golden image](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-golden-image)
- [Microsoft Learn: Custom image templates in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/custom-image-templates)
- [Microsoft Learn: Create custom image templates and custom images](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates)
- [Microsoft Learn: Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/azure-compute-gallery)
- [Microsoft Learn: Store and share images in an Azure Compute Gallery](https://learn.microsoft.com/en-us/azure/virtual-machines/shared-image-galleries)
- [Microsoft Learn: Create an image version](https://learn.microsoft.com/en-us/azure/virtual-machines/image-version)
- [Microsoft Learn: List, update, and delete gallery resources](https://learn.microsoft.com/en-us/azure/virtual-machines/update-image-resources)
- [Microsoft Learn: Virtual machine image options (Azure Compute Gallery and managed images)](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/imaging)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts using session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Troubleshoot session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-session-host-update)
- [Microsoft Learn: Configure a validation host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-validation-host-pool)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available (9 July 2026)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
