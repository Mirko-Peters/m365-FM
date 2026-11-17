---
title: "When ephemeral OS disks are the right choice for pooled hosts"
summary: "Ephemeral OS disks fit pooled Azure Virtual Desktop hosts that hold no user state: profiles in FSLogix, apps in the image, and capacity that is created and deleted instead of stopped. They are the wrong choice when hosts must be deallocated, keep local data, or depend on features such as Azure Backup."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-ephemeral-os-disks, avd-session-host]
keypoints:
  - "Ephemeral OS disks suit stateless pooled session hosts. Microsoft's Azure documentation names workloads that tolerate individual VM failures but are sensitive to deployment and reimage time."
  - "A session host with an ephemeral OS disk cannot be stop-deallocated. It can only be reimaged or deleted, so the cost model is delete and recreate, not deallocate and start."
  - "In Azure Virtual Desktop the announcement ties the feature to pooled host pools with a session host configuration. Personal pools and pools without one are excluded."
  - "Everything on the OS disk is lost on resize, redeploy or healing. Profiles belong in FSLogix and apps belong in the image or in an app delivery layer."
  - "Azure Backup, Azure Disk Encryption, snapshots and image capture are listed as unsupported for ephemeral OS disks. The VM size must also have enough local storage for the image."
faq:
  - q: "Can I use ephemeral OS disks on a personal host pool?"
    a: "Not according to the Azure Virtual Desktop announcement. The Tech Community post of 15 October 2025 says ephemeral OS disks are not available for personal host pools or for host pools without a session host configuration. A personal desktop is meant to keep its state, which an ephemeral disk does not do."
  - q: "Will my users lose their files when a session host is reimaged?"
    a: "Anything stored on the session host's OS disk is lost, and that includes a local profile. Users whose profile is in an FSLogix container on remote storage keep it, because the container is not part of the host's disk. Check where each application writes data before you decide."
  - q: "Do ephemeral OS disks save money?"
    a: "Possibly, but the saving depends on the VM size you need. Nerdio's help article says ephemeral OS disks have no associated storage costs. Microsoft's Azure page says the placement option does not change the cost, and that a Standard SSD or Premium SSD base disk is charged. Compare the full VM price with a local-storage size against your current size and disk."
---

Ephemeral OS disks are the right choice for pooled session hosts that hold no user state: the profile is in FSLogix, the applications are in the image or delivered separately, and the pool adds and removes hosts instead of stopping them. They are the wrong choice when hosts must be deallocated and restarted, keep local data, or rely on features such as Azure Backup. This article is the decision guide. How the disk works is covered in the sibling article "Ephemeral OS disks for Azure Virtual Desktop: fast, cheap, stateless hosts".

## The short answer

| Your situation | Ephemeral OS disk |
|---|---|
| Pooled host pool with a session host configuration, profiles in FSLogix | Fits |
| Capacity added and removed by dynamic autoscale | Fits |
| Image updated by replacing hosts rather than patching them | Fits |
| Personal host pool, or a host pool without a session host configuration | Not available in the Azure Virtual Desktop announcement |
| Hosts stopped and deallocated overnight to save cost | Does not fit: stop-deallocate is not supported |
| Users keep files or per-user apps on the C: drive | Does not fit: that data is lost |
| Compute-level backup, Azure Disk Encryption or VM snapshots required | Does not fit: all three are listed as unsupported |

The rest of the article explains each row and how to check it.

## What you give up

Microsoft Learn describes ephemeral OS disks as created on the local VM storage and not saved to remote Azure Storage, ideal for stateless workloads where applications tolerate individual VM failures but are sensitive to deployment times or reimaging. In exchange for lower read and write latency and faster reimage, the Azure page lists these differences from a persistent OS disk:

- **No stop-deallocate and no stop/start.** Both are marked not supported.
- **Data is deleted when you resize to a new VM size or redeploy.** The OS is reprovisioned.
- **Healing maintenance does not preserve the OS disk data.** Live migration does.
- **The Windows page file is stored on the OS disk.** On a persistent disk it sits on the temp disk.
- **OS disk resize is supported at VM creation only.**
- **Unsupported features:** VM image capture, disk snapshots, Azure Disk Encryption, Azure Backup, Azure Site Recovery and OS disk swaps.

For Azure Virtual Desktop, the Tech Community announcement adds that these VMs cannot be started or deallocated and can only be reimaged or deleted, and that changes made during a session are lost on reimage or deletion. Nerdio's help article says the same: a session host with an ephemeral OS disk must be destroyed to free its compute capacity.

## Check 1: pool type and management approach

The October 2025 announcement says an ephemeral OS disk needs a pooled host pool with a [session host configuration](/entity/avd-session-host-configuration/). Learn's host pool management approaches page adds two constraints: the approach is set when the pool is created and cannot be changed, and a session host configuration is available for pooled host pools only. If you have an existing pool without one, the route is a new pool, not a setting. That makes the decision a design choice before deployment. See [pooled host pools](/entity/avd-pooled-host-pool/) and, for the other type, [personal host pools](/entity/avd-personal-host-pool/).

Two points to verify before relying on this:

- The Azure Virtual Desktop FAQ on Learn still answers "No" to whether ephemeral OS disks for Azure VMs are supported with Azure Virtual Desktop. It contradicts the announcement and the June 2026 what's-new entry ("Ephemeral OS disks are now available"). Treat the FAQ line as stale until Microsoft updates it, and test in a pilot pool.
- Nerdio describes ephemeral OS disks in its own dynamic host pools (Workspace, Dynamic host pools, Add dynamic host pool). Nerdio's article does not mention a session host configuration, so confirm in Nerdio's documentation how the two approaches relate in your tenant.

Status: Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Check 2: where the state lives

A pooled user can land on a different host at every sign-in, which is why Learn says pooled users should store profile data in [FSLogix](/entity/fslogix/). FSLogix redirects the profile to a storage provider. With an ephemeral OS disk this moves from good practice to a requirement: a local profile on the C: drive would disappear with the host.

Walk through what else writes to the OS disk:

1. **User data outside the profile.** Files saved to a local folder outside the redirected profile are lost on reimage, deletion, resize or healing.
2. **Per-machine apps installed after deployment.** Learn's session host update page says manual customizations are not present after an update and lists three homes for them: the image, configuration management (Intune or Group Policy) and the custom configuration PowerShell script. The same logic applies to every replaced ephemeral host. Add apps to the [golden image](/entity/golden-image/), or deliver them with [MSIX app attach](/entity/msix-app-attach/).
3. **Agents and logs.** The same page says the Azure Monitor agent is not installed automatically on updated session hosts if you use Azure Virtual Desktop Insights. Put it in the image or in the script, and send logs off the host.
4. **Domain objects.** The update page notes that computer accounts for domain-joined hosts are not deleted when hosts are replaced and are inherited by the new VMs, so existing GPOs still apply; review them if OU membership changes.

Learn's FAQ recommends compute-level Azure Backup only for personal host pools. For pooled hosts, the things worth protecting are the image and the profile storage, not the VM.

## Check 3: capacity pattern and cost

An ephemeral host cannot be stop-deallocated, so the way to release its compute capacity is deletion. Learn describes two scaling methods: power management autoscaling, which deallocates session hosts and is generally available, and [dynamic autoscaling](/entity/avd-dynamic-autoscaling/), which can also create and delete them. The announcement recommends dynamic autoscaling with ephemeral hosts. Nerdio's help article says its [auto-scaling](/entity/nerdio-auto-scaling/) can create and destroy session host VMs on this storage.

A usable pattern from Learn's dynamic plan settings: set a minimum host pool size for the hosts that must always exist, a maximum for peak, and let off-peak shrink the pool. Learn's wording says the minimum hosts can be in a running or a stopped state, but an ephemeral host cannot be stop-deallocated. Learn does not reconcile the two statements, so test what your plan does with the minimum hosts.

For cost, the sources differ in what they promise:

- Nerdio: ephemeral OS disks "have no associated storage costs", and its cost estimate shows storage as 0.
- Microsoft's Azure page: the placement option does not change the cost of an ephemeral disk, performance depends on the VM's local storage, and with a Standard SSD or Premium SSD base disk you pay the applicable base disk charges.

Neither source gives a price for your region, so compare two full configurations in the Azure pricing calculator: the VM size you use today with a managed OS disk, and a size with enough local storage.

## Check 4: VM size and image fit

The size check is arithmetic. The Azure page says the image's OS disk size must be less than or equal to the cache, temp or NVMe size of the chosen VM size. Learn's examples:

- Cache placement: a standard Windows Server image is about 127 GiB, and Standard_DS3_v2 has a cache of 127 GiB, which is large enough.
- Temp placement: the remaining temp disk is the initial temp size minus the image size.
- Trusted launch: Azure reserves 1 GiB for VMGS from the cache, temp or NVMe disk. For a VM with a 75 GiB temp disk (Standard_D2ads_v5) the largest allowed OS disk is 74 GB, and the page shows the error you get above that.

In the Azure Virtual Desktop portal flow you select a VM size with enough cache or temporary storage and then a placement of OS cache or Temp disk. The announcement mentions no NVMe placement for Azure Virtual Desktop; a Microsoft reply in its comments said NVMe support was expected by general availability, so check the portal for your size. Nerdio says a VM size that does not support Premium SSD does not support ephemeral OS disks and that the option is grayed out when the cache is too small for the image.

Learn's regional host pools page says that for the OS disk type, "During preview, only Standard SSD is supported and is automatically selected once ephemeral OS disks are configured." That page is about regional host pools and still carries preview wording in places, so confirm the current text before you plan around a disk type.

Trusted launch works with ephemeral disks, with one caution from the Azure page: keys or secrets the vTPM generates or seals after VM creation might not be saved and can be lost on reimage or service healing. Do not store anything in the vTPM that the host cannot recreate.

Image size also affects the size choice later. Learn's session host update page says the OS disk size cannot be changed during an update and defaults to the size defined by the gallery image.

## A decision walk-through

1. Confirm the pool is, or can be, a pooled host pool with a session host configuration. If not, stop here.
2. Confirm profiles are in FSLogix and no user data is written elsewhere on C:.
3. Confirm every application is in the image or delivered by a layer that survives host replacement.
4. Confirm capacity is managed by creating and deleting hosts, with dynamic autoscaling or Nerdio auto-scaling, and that no process depends on deallocating the same host.
5. Check the size: image OS disk, plus 1 GiB if you use trusted launch, against the local storage of the VM size.
6. Confirm you do not need Azure Backup, Azure Disk Encryption, snapshots or image capture on the host itself.
7. Pilot with a small pool, reimage or replace a host, and confirm that users find their profile, apps and settings unchanged.

## If it does not fit

A pooled pool with managed OS disks and power management autoscaling (generally available) keeps hosts that can be deallocated and restarted, at the price of persistent disk charges. A personal host pool keeps user state on the host and supports hibernation, which Learn limits to personal pools. Both choices are less strict about state, and neither gives the fast reimage that ephemeral disks offer.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Ephemeral OS disks for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks)
- [Microsoft Tech Community: Now in public preview, ephemeral OS disk support on Azure Virtual Desktop (15 October 2025)](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/now-in-public-preview-ephemeral-os-disk-support-on-azure-virtual/ba-p/4460172)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Update session hosts with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Regional host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: What is FSLogix?](https://learn.microsoft.com/en-us/fslogix/overview-what-is-fslogix)
- [Nerdio Manager help: Ephemeral OS Disks](https://nmehelp.getnerdio.com/hc/en-us/articles/26124378246157-Ephemeral-OS-Disks)
