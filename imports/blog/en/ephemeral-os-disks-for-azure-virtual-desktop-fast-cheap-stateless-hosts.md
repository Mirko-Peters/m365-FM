---
title: "Ephemeral OS disks for Azure Virtual Desktop: fast, cheap, stateless hosts"
summary: "An ephemeral OS disk keeps the session host's operating system on the VM's local storage instead of remote Azure Storage, so the host is reimaged or deleted rather than stopped and started. In Azure Virtual Desktop it works only in pooled host pools that use a session host configuration, and it comes with a clear list of size, placement and feature limits."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-ephemeral-os-disks, avd-session-host]
keypoints:
  - "An ephemeral OS disk lives on the VM's local storage (OS cache or temp disk in Azure Virtual Desktop) and is not saved to remote Azure Storage. Everything on it is lost when the host is reimaged or deleted."
  - "Azure Virtual Desktop supports it only in pooled host pools configured with a session host configuration. Personal host pools and pooled pools without a configuration are out."
  - "The image's OS disk must fit into the cache or temp disk of the chosen VM size. Learn's example: a 127 GiB Windows 11 multi-session image on a size with a 200 GiB temp disk leaves about 73 GiB."
  - "Hosts can be restarted, reimaged or deleted but not deallocated, and backup, snapshots, image capture and Azure Disk Encryption are not supported. With dynamic autoscaling, set the minimum percentage of active hosts to 100 in every phase."
  - "Microsoft announced general availability in July 2026, but the Azure Virtual Desktop Learn page still says NVMe and Premium SSD are unsupported during preview and that only Standard SSD is selected. Check the page before you plan around a limit."
faq:
  - q: "Can I use ephemeral OS disks in a personal host pool?"
    a: "No. The Learn page says ephemeral OS disks in Azure Virtual Desktop are supported only in pooled host pools configured with a session host configuration, and it names pooled as the only host pool type supported with session host configuration and ephemeral OS disks. The October 2025 preview post also says they are not available for personal host pools or for pooled pools without a session host configuration."
  - q: "Can I stop and deallocate a session host that has an ephemeral OS disk?"
    a: "No. Learn says VMs that use ephemeral OS disks cannot be deallocated, only restarted, reimaged or deleted. For dynamic autoscaling, Learn says each phase of the scaling plan should have the minimum percentage of active hosts set to 100 percent for such host pools, because these hosts do not support starting and deallocating."
  - q: "Does the Azure Virtual Desktop FAQ say ephemeral OS disks are unsupported?"
    a: "An entry in the Azure Virtual Desktop FAQ says ephemeral OS disks for Azure VMs are not supported with Azure Virtual Desktop. That contradicts the dedicated Learn page, the What's new entries and Microsoft's July 2026 announcement. Our reading is that the FAQ entry is outdated, but Microsoft has not said so, so follow the dedicated page and check the FAQ again before you rely on either."
---

An ephemeral OS disk stores a session host's operating system on the virtual machine's local storage instead of in remote Azure Storage. In Azure Virtual Desktop that means a host is reset by reimaging it or removed by deleting it, never stopped and started. The feature works only in pooled host pools that use a session host configuration, and it is meant for stateless hosts.

This article explains what the disk is, what it needs, what it rules out and how to switch it on. The question of which workloads should use it is a separate decision and is not covered here.

## Status and naming

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community, 9 July 2026). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

The history on Learn's What's new page is short. Ephemeral OS disk support entered public preview in October 2025, and the June 2026 entry says ephemeral OS disks are "now available and optimized for stateless workloads", without a GA or preview label. The dedicated Azure Virtual Desktop page still says that ephemeral OS disks are not supported with NVMe and Premium SSD during preview, and that they are not supported in Azure Government during preview. Treat those three limits as current until the page changes.

## What it is and how it differs

Learn describes ephemeral OS disks as created on local VM storage and not saved to remote Azure Storage. Compared with a persistent OS disk, the Azure VM documentation lists these differences:

- **Persistence:** the data is not persisted to Azure Storage.
- **Stop and start:** stop-deallocated state, and stop and start of the VM, are not supported.
- **Resize:** the OS disk can be sized only when the VM is created. Resizing the VM to a new size deletes the data on the OS disk and reprovisions the OS. The same applies to redeploy.
- **Healing:** OS disk data is not preserved. Live migration does preserve it.
- **Page file:** on Windows the page file moves to the OS disk, which Learn describes as further optimizing performance.

The Tech Community announcement names the benefits: lower network latency and better disk performance, and a clean, consistent starting state after each reimage. Learn's Azure VM page gives "faster VM reimage" as a benefit but no measured times, and neither page publishes a figure for session host creation speed.

## Requirements for session hosts

Learn's Azure Virtual Desktop page sets these conditions:

1. **Pooled host pool with a session host configuration.** The host pool type must be pooled. A [session host configuration](/entity/avd-session-host-configuration/) is chosen when the host pool is created.
2. **An image value.** The image must be configured before the ephemeral option can be selected. Marketplace, custom and Azure Compute Gallery images are supported.
3. **A VM size with enough local space.** The image's OS disk size must be less than or equal to the temp or cache size available on the chosen VM size. If the size has no temp disk or cache equal to or larger than the image, you cannot configure an ephemeral OS disk.
4. **Azure, not Azure Government.** Learn says ephemeral OS disks are only available in Azure and are not supported in Azure Government during preview.

The Azure VM page adds the upper bound: the OS disk can be as large as the cache, temp or NVMe disk size of the VM size, or 2,040 GiB, whichever is smaller. Trusted launch and confidential VMs reserve 1 GiB of that local space for VMGS, so leave headroom if you use them.

### Sizing examples from Learn

- A 127 GiB marketplace Windows image on Standard_DS3_v2: the size has a 127 GiB cache, which is large enough for cache placement.
- A 127 GiB Windows 11 Enterprise multi-session image on Standard_D8s_v3: the temp disk is 200 GiB, so the OS disk fits and about 73 GiB of temp space remains after creation.

### Checking sizes with the Microsoft script

The Azure VM FAQ contains a PowerShell script that takes the OS image size in GiB and a location and lists every VM size with its cache, temp and NVMe placement as supported or not supported. The Tech Community post points to the same script. Save it as a file of your own, for example `Get-EphemeralSku.ps1`, sign in with the Az module and run:

```powershell
.\Get-EphemeralSku.ps1 -Location westeurope -OSImageSizeInGB 127
```

Read only the cache and temp columns. The script also reports NVMe placement, but Learn's Azure Virtual Desktop page says NVMe is not supported there, and the Tech Community post offers only OS cache and temp disk as placement choices.

## Placement: OS cache or temp disk

The portal asks for a disk placement. The Azure Virtual Desktop page says the OS disk can sit on the VM's OS cache or on its temp disk, set through the DiffDiskPlacement property. Azure VM documentation says cache placement is available on older sizes that have a cache disk, such as Dsv2 and Dsv3, and temp placement on sizes with a temp disk, such as Dadsv5 and Ddsv5. It states that placement does not affect cost or performance directly, because performance depends on the VM's local storage, and the FAQ says placement cannot be changed once the disk exists. In a host pool, our reading is that a change means replacing hosts, for example through a session host update.

## What it rules out

Learn lists these features as unsupported with ephemeral OS disks: deallocation of VMs, capturing VM images, disk snapshots, Azure Disk Encryption, Azure Backup, Azure Site Recovery and OS disk swap. The Azure VM page adds two details. Customer-managed key rotation is not supported with ephemeral OS disks, and keys or secrets sealed by the vTPM might be lost when a VM is reimaged or healed.

Two consequences follow for session hosts. First, anything a user or process writes to the OS disk is gone after a reimage or delete, so profile data and application state belong elsewhere; for a pooled host pool that usually means [FSLogix](/entity/fslogix/). Second, in our reading the [golden image](/entity/golden-image/) and the session host configuration become the only durable definition of a host, because Learn lists backup, snapshots and image capture as unsupported.

### Disk type and cost

Learn's Azure Virtual Desktop page says that during preview only Standard SSD is supported and that it is selected automatically once ephemeral OS disks are configured. The page has no cost section and no savings figure. The Azure VM page says that if you choose a Standard SSD or Premium SSD base disk, you pay the applicable base disk charges, and that full caching adds no charge beyond standard VM and disk costs. We read this as a reason to check the price of the base disk for your sizes rather than assume the OS disk is free; Learn does not state either way for session hosts. Check your own invoice or the Azure pricing calculator.

### Full caching is a VM-level option

The Azure VM documentation also describes full caching, which keeps the whole OS disk on local storage. It needs eight or more vCPUs, API version 2025-04-01 or later, and local space greater than 2 × OS disk size + 1 GiB. The Azure Virtual Desktop page and the Tech Community post mention no full caching option for session hosts, so do not plan on it unless the Azure Virtual Desktop documentation adds it.

## How to enable it

### New host pool

The Tech Community announcement and Learn describe the same path in the Azure portal:

1. Open Azure Virtual Desktop, select **Host pools** and then **Create**.
2. Set the host pool type to **Pooled** and, under **Create Session Host Configuration**, select **Yes** (Tech Community wording).
3. On the **Session hosts** tab, select an image and a VM size with enough cache or temp space.
4. Select the **Ephemeral OS disk** option and a placement: **OS cache** or **Temp disk**. Learn says the OS disk type is set to Standard SSD automatically.
5. Select **Review + create**, then **Create**.

To verify, Learn describes a path from the host pool's **Overview** through **Total machines** to the session host, then a check of its **Disk** details. The Learn text for the last page in that path looks garbled, so confirm against the VM's disk settings in the portal. Learn's Azure Virtual Desktop page does not give Azure PowerShell or CLI commands for session hosts.

### Existing host pool

Learn's route is a session host update: edit the session host configuration and enable ephemeral OS disks, then schedule an update. Its warning matters: before scheduling the update, configure the settings to enable ephemeral OS disks, otherwise the hosts are redeployed with the existing configuration values.

The update page describes what happens next. Existing VMs are deleted or deallocated and new ones are created from the configuration, which takes around 20 minutes per session host. Logged-on users are asked to sign out, and the notification period is 0 to 60 minutes. Because ephemeral hosts cannot be deallocated, deletion is the only route for them; that is our reading, not a Learn statement. You can schedule an update up to two weeks ahead. Do not remove VMs or change [drain mode](/entity/avd-drain-mode/) during an update.

## Working with autoscale

Ephemeral hosts are built for [dynamic autoscaling](/entity/avd-dynamic-autoscaling/), which can create and delete hosts, and the Tech Community post notes that the autoscale feature adds, starts, deallocates or deletes VMs based on demand. Learn's Azure Virtual Desktop page sets one rule: for these host pools, each phase of the scaling plan should have **Minimum percentage of active hosts (%)** set to 100, because the hosts do not support starting and deallocating. Dynamic autoscaling is only available in Azure and is not supported in Azure Government, according to the autoscale scenarios page, which still labels it as preview in one note.

## Checklist before you rely on it

- The host pool is pooled and uses a session host configuration.
- Your image's OS disk size fits the cache or temp size of the target VM size, with 1 GiB spare if you use trusted launch.
- Users keep nothing on the OS disk; profiles are redirected.
- Backup, snapshot and capture steps in your runbooks do not target these hosts.
- Scaling plan phases use a minimum of 100 percent active hosts.
- You are on Azure, not Azure Government, and you have checked the Learn page for the current NVMe, Premium SSD and disk type limits.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Ephemeral OS disks on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks)
- [Microsoft Learn: Ephemeral OS disks for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks)
- [Microsoft Learn: Ephemeral OS disks FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks-faq)
- [Microsoft Learn: Deploy Ephemeral OS disks](https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks-deploy)
- [Microsoft Learn: Session host update for host pools with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Tech Community: Ephemeral OS disk support on Azure Virtual Desktop (public preview)](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/-/4460172)
