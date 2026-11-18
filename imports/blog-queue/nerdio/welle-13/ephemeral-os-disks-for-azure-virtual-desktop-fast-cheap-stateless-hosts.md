---
title: "Ephemeral OS disks for Azure Virtual Desktop: what they are and when to use them"
summary: "An ephemeral OS disk keeps the session host's OS on the VM's local storage, so the host is reimaged or deleted rather than stopped. In Azure Virtual Desktop it works only in pooled host pools with a session host configuration."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [avd-ephemeral-os-disks, avd-session-host]
keypoints:
  - "An ephemeral OS disk lives on the VM's local storage (OS cache or temp disk) and is not saved to Azure Storage. Everything on it is lost when the host is reimaged or deleted."
  - "Azure Virtual Desktop supports it only in pooled host pools configured with a session host configuration. Personal host pools and pooled pools without a configuration are out."
  - "The image's OS disk must fit into the VM size's cache or temp disk. Learn's Standard_D8s_v3 example conflicts with the Dsv3 size page, so check sizes before you plan."
  - "Hosts can be restarted, reimaged or deleted but not deallocated; backup, snapshots, image capture and Azure Disk Encryption are unsupported. With dynamic autoscaling, set minimum active hosts to 100."
  - "Microsoft announced GA in July 2026, but the AVD Learn page still says NVMe and Premium SSD are unsupported during preview. Check the page before planning around a limit."
faq:
  - q: "Can I use ephemeral OS disks in a personal host pool?"
    a: "No. The Learn page says ephemeral OS disks in Azure Virtual Desktop are supported only in pooled host pools configured with a session host configuration, and it names pooled as the only host pool type supported with session host configuration and ephemeral OS disks. The October 2025 preview post also says they are not available for personal host pools or for pooled pools without a session host configuration."
  - q: "Can I stop and deallocate a session host that has an ephemeral OS disk?"
    a: "No. Learn says VMs that use ephemeral OS disks cannot be deallocated, only restarted, reimaged or deleted. For dynamic autoscaling, Learn says each phase of the scaling plan should have the minimum percentage of active hosts set to 100 percent for such host pools, because these hosts do not support starting and deallocating."
  - q: "Does the Azure Virtual Desktop FAQ say ephemeral OS disks are unsupported?"
    a: "An entry in the Azure Virtual Desktop FAQ says ephemeral OS disks for Azure VMs are not supported with Azure Virtual Desktop. That contradicts the dedicated Learn page, the What's new entries and Microsoft's July 2026 announcement. Our reading is that the FAQ entry is outdated, but Microsoft has not said so, so follow the dedicated page and check the FAQ again before you rely on either."
---

An ephemeral OS disk stores a session host's operating system on the virtual machine's local storage instead of in remote Azure Storage. In Azure Virtual Desktop that means a host is reset by reimaging it or removed by deleting it, never deallocated and started again. The feature works only in pooled host pools that use a session host configuration, and it is meant for stateless hosts.

Which workloads should use it is a separate decision and is not covered here. The sources describe lower latency and quicker reimaging only qualitatively, and none gives a figure for a cost saving on session hosts.

## Status and naming

Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community, 9 July 2026). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

Learn's What's new page records public preview in October 2025, and its June 2026 entry says ephemeral OS disks are "now available and optimized for stateless workloads", without a GA or preview label. The dedicated Azure Virtual Desktop page still says ephemeral OS disks are not supported with NVMe and Premium SSD during preview, nor in Azure Government during preview.

## What it is and how it differs

Compared with a persistent OS disk, the Azure VM documentation lists these differences:

- **Persistence:** data is not persisted to Azure Storage, and stop-deallocated state and stop and start of the VM are not supported.
- **Resize:** the OS disk can be sized only at VM creation. Resizing the VM or redeploying deletes the OS disk data and reprovisions the OS.
- **Healing:** OS disk data is not preserved; live migration does preserve it.
- **Page file:** on Windows the page file moves to the OS disk.

The Tech Community announcement names lower network latency, better disk performance and a clean starting state after each reimage. Learn's Azure VM page gives "faster VM reimage" but no measured times, and neither page publishes a figure for session host creation speed.

## Requirements for session hosts

Learn's Azure Virtual Desktop page sets these conditions:

1. **Pooled host pool with a session host configuration.** The host pool type must be pooled. A [session host configuration](https://www.m365.fm/entity/avd-session-host-configuration/) is chosen when the host pool is created.
2. **An image value.** The image must be configured before the ephemeral option can be selected.
3. **A VM size with enough local space.** The image's OS disk size must be less than or equal to the temp or cache size of the chosen VM size; otherwise you cannot configure an ephemeral OS disk.
4. **Azure, not Azure Government**, during preview, according to Learn.

The Azure VM page adds the upper bound: the OS disk can be as large as the cache, temp or NVMe disk size of the VM size, or 2,040 GiB, whichever is smaller. Trusted launch and confidential VMs reserve 1 GiB of it for VMGS.

### Sizing examples from Learn

- Learn's temp-placement example uses a 127 GiB Windows 11 multi-session image on Standard_D8s_v3 and says the temp size is 200 GiB, leaving about 73 GiB. The Dsv3 size page contradicts this: Standard_D8s_v3 has a 64 GiB temp disk and a 200 GiB cache, so a 127 GiB image does not fit with temp placement.
- Dadsv5 size page: Standard_D2ads_v5 has a 75 GiB temp disk (127 GiB does not fit), Standard_D4ads_v5 150 GiB and Standard_D8ads_v5 300 GiB. Subtracting the image size, as the Azure VM page describes, would leave 23 and 173 GiB (our arithmetic).

### Checking sizes with the Microsoft script

The Azure VM FAQ contains a PowerShell script that takes an image size in GiB and a location and lists the VM sizes that support ephemeral OS disks there, with cache, temp and NVMe placement marked SUPPORTED or NOT SUPPORTED for that image size. If all three are not supported, the image size cannot use an ephemeral OS disk. Save it as a file, for example `Get-EphemeralSku.ps1`, sign in with the Az module and run:

```powershell
.\Get-EphemeralSku.ps1 -Location westeurope -OSImageSizeInGB 127
```

Read the cache and temp columns. The script also reports NVMe placement, but Learn's Azure Virtual Desktop page says NVMe is not supported there.

## Placement: OS cache or temp disk

The Azure Virtual Desktop page says the OS disk can sit on the VM's OS cache or on its temp disk, set through the DiffDiskPlacement property. Azure VM documentation says cache placement is available on older sizes with a cache disk, such as Dsv3, and temp placement on sizes with a temp disk, such as Dadsv5 and Ddsv5. It states that placement does not affect cost or performance, because performance depends on the VM's local storage, and with temp placement the disk shares IOPS with the temp disk. The FAQ says placement cannot be changed once the disk exists; in a host pool, our reading is that a change means replacing hosts.

## What it rules out

Learn lists these as unsupported with ephemeral OS disks: deallocation, VM image capture, disk snapshots, Azure Disk Encryption, Azure Backup, Azure Site Recovery and OS disk swap. The Azure VM page adds that customer-managed key rotation is not supported and that keys or secrets sealed by the vTPM might be lost when a VM is reimaged or healed.

In our reading, two consequences follow. Anything written to the OS disk is gone after a reimage or delete, so profile data belongs elsewhere, usually [FSLogix](https://www.m365.fm/entity/fslogix/) in a pooled host pool. And the [golden image](https://www.m365.fm/entity/golden-image/) and the session host configuration become the only durable definition of a host, because backup, snapshots and image capture are unsupported.

### Disk type and cost

Learn's Azure Virtual Desktop page says that during preview only Standard SSD is supported and that it is selected automatically once ephemeral OS disks are configured. The page has no cost section and no savings figure. The Tech Community announcement describes the three features together as saving time and achieving cost-effective scalability, but its ephemeral OS disk section states no cost effect.

Two vendor statements point in different directions. The Azure VM page says that if you choose a Standard SSD or Premium SSD base disk, you pay the applicable base disk charges, with partial or full caching. The Nerdio help page for Nerdio Manager says ephemeral OS disks have no associated storage costs and that its estimated monthly cost shows storage as 0; it does not mention a base disk. The sources do not reconcile the two, and none gives a saving for session hosts; check your own invoice or the Azure pricing calculator.

### Full caching is a VM-level option

The Azure VM documentation describes full caching, which keeps the whole OS disk on local storage and needs eight or more vCPUs and local space greater than 2 × OS disk size + 1 GiB. The Azure Virtual Desktop page and the Tech Community post mention no such option for session hosts.

## How to enable it

### New host pool

The Tech Community announcement and Learn describe this Azure portal path:

1. Open Azure Virtual Desktop, select **Host pools** and then **Create**.
2. Set the host pool type to **Pooled** and, under **Create Session Host Configuration**, select **Yes** (Tech Community wording).
3. On the **Session hosts** tab, select an image and a VM size with enough cache or temp space.
4. Select the **Ephemeral OS disk** option and a placement: **OS cache** or **Temp disk**. Learn says the OS disk type is set to Standard SSD automatically.
5. Select **Review + create**, then **Create**.

To verify, Learn's path is: open the host pool's **Overview**, select **Total machines** under Virtual machines, select the session host, then select its name under **Name**. Learn calls the page that opens "Priorities" and says you can confirm the ephemeral OS disk under **Disk**. The Azure VM page adds that ephemeral disks are not accessible through the portal: opening one returns "Resource not Found" or 404, which it calls expected. Learn's page mentions Azure PowerShell but gives no commands.

### Existing host pool

This route applies only to host pools that already have a session host configuration. Learn's Azure Virtual Desktop page says to use session host update and to configure the update settings first; otherwise hosts are redeployed with the existing configuration values.

Learn's update page gives this portal path: **Host pools**, select the host pool, **Session hosts**, **Manage session host update**, **New update**. Alternatively select **Manage session host configuration**, then **Edit**, which also requires an update. The Tech Community announcement words it differently: **Manage** in the host pool's navigation menu, then **Manage session host update**, **new update** and **Review + Update**. The update page's description of the Session hosts tab lists image, VM size and OS disk type but no ephemeral OS disk option, so confirm that the form offers it before you schedule.

Learn's update concept page says an update deallocates or deletes the existing VMs and creates new ones, and its process ends with the original VMs being deleted. In PowerShell, the session host management policy has an `UpdateDeleteOriginalVM` setting, and Learn recommends `$true` so that you do not need to clean up session host resources afterwards. Learn does not describe how this applies to hosts with ephemeral OS disks.

If you use autoscale, Learn says to disable it on the host pool before you start an update and keep it disabled until the update has finished, because a scaling plan that is enabled during an update can make the update fail with a runtime error. Session host update is available only in the global Azure cloud. An update takes around 20 minutes per session host, users are asked to sign out with a 0 to 60 minute notice period, and you can schedule it up to two weeks ahead. Do not remove VMs or change [drain mode](https://www.m365.fm/entity/avd-drain-mode/) during an update.

## Working with autoscale

Learn recommends [dynamic autoscaling](https://www.m365.fm/entity/avd-dynamic-autoscaling/) for host pools with ephemeral OS disks. Learn's Azure Virtual Desktop page sets one rule: each phase of the scaling plan should have **Minimum percentage of active hosts (%)** set to 100, because these hosts do not support starting and deallocating, so the scaling process then only creates and deletes hosts.

## Checklist before you rely on it

- The host pool is pooled and uses a session host configuration.
- The image's OS disk size fits the cache or temp size of the VM size, with 1 GiB spare for trusted launch.
- Users keep nothing on the OS disk; profiles are redirected.
- Scaling plan phases use a minimum of 100 percent active hosts.
- You are on Azure, not Azure Government, and have checked Learn for the current NVMe, Premium SSD and disk type limits.

## Sources

- [Microsoft Learn: Ephemeral OS disks on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks)
- [Microsoft Learn: Ephemeral OS disks for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks)
- [Microsoft Learn: Ephemeral OS disks FAQ](https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks-faq)
- [Microsoft Learn: Dsv3 size series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dsv3-series)
- [Microsoft Learn: Dadsv5 size series](https://learn.microsoft.com/en-us/azure/virtual-machines/sizes/general-purpose/dadsv5-series)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Autoscale scaling plan scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Tech Community: Enhanced host pool management is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Tech Community: Ephemeral OS disk support in public preview](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/now-in-public-preview-ephemeral-os-disk-support-on-azure-virtual/ba-p/4460172)
- [Nerdio Help: Ephemeral OS Disks](https://nmehelp.getnerdio.com/hc/en-us/articles/26124378246157-Ephemeral-OS-Disks)
