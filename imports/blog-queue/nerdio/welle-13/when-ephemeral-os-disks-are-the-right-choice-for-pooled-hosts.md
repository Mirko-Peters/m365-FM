---
title: "When ephemeral OS disks are the right choice for pooled hosts"
summary: "Ephemeral OS disks fit pooled Azure Virtual Desktop hosts that hold no user state and are created and deleted rather than deallocated. They are wrong when hosts must be deallocated, keep local data or need Azure Backup."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [avd-ephemeral-os-disks, avd-session-host]
keypoints:
  - "Ephemeral OS disks suit stateless pooled session hosts. Microsoft's Azure documentation names workloads that tolerate individual VM failures but are sensitive to deployment and reimage time."
  - "Learn's Azure Virtual Desktop page says these VMs cannot be deallocated and can only be restarted, reimaged or deleted. The cost model is delete and recreate, not deallocate and start."
  - "They are supported only in pooled host pools with a session host configuration, and not in Azure Government during preview. Personal pools and pools without a configuration are out."
  - "For dynamic autoscaling, Learn says to set Minimum percentage of active hosts to 100 percent in every phase, so that scaling only creates and deletes hosts."
  - "Everything on the OS disk is lost on resize, redeploy or healing. Backup, Disk Encryption, snapshots and image capture are unsupported; NVMe and Premium SSD are excluded in preview."
faq:
  - q: "Can I use ephemeral OS disks on a personal host pool?"
    a: "No. Learn says ephemeral OS disks in Azure Virtual Desktop are supported only in pooled host pools configured with a session host configuration, and the October 2025 preview post says the same."
  - q: "Will my users lose their files when a session host is reimaged?"
    a: "Anything stored on the session host's OS disk is lost, and that includes a local profile. Users whose profile is in an FSLogix container on remote storage keep it, because the container is not part of the host's disk. Check where each application writes data before you decide."
  - q: "Do ephemeral OS disks save money?"
    a: "The sources differ. Nerdio's help article says ephemeral OS disks have no associated storage costs. Microsoft's Azure page says the placement option does not change the cost, and that a Standard SSD or Premium SSD base disk is charged. Learn's Azure Virtual Desktop page says that during preview only Standard SSD is supported. Compare the full VM price with a local-storage size against your current size and disk."
---

Ephemeral OS disks are the right choice for pooled session hosts that hold no user state: the profile is in FSLogix, the applications are in the image or delivered separately, and the pool adds and removes hosts instead of deallocating them. They are the wrong choice when hosts must be deallocated and started again, keep local data, run in Azure Government, or rely on features such as Azure Backup. This article is the decision guide. How the disk works and how to switch it on is covered in the sibling article "Ephemeral OS disks for Azure Virtual Desktop: what they are and when to use them".

## The short answer

| Your situation | Ephemeral OS disk |
|---|---|
| Pooled host pool with a session host configuration, profiles in FSLogix | Fits |
| Capacity added and removed by dynamic autoscale | Fits |
| Image updated by replacing hosts rather than patching them | Fits |
| Personal host pool, or a host pool without a session host configuration | Not supported, according to Learn |
| Azure Government | Not supported during preview, according to Learn |
| Hosts deallocated overnight to save cost | Does not fit: deallocation is not supported |
| Users keep files or per-user apps on the C: drive | Does not fit: that data is lost |
| Compute-level backup, Azure Disk Encryption or VM snapshots required | Does not fit: all three are listed as unsupported |

## What you give up

The cost of local storage is state: data on the OS disk is deleted on resize and redeploy, healing does not preserve it, and Learn lists VM image capture, disk snapshots, Azure Disk Encryption, Azure Backup, Azure Site Recovery and OS disk swap as unsupported. The sibling article covers each difference in detail.

One wording difference matters for runbooks. The Azure VM page lists stop-deallocate and stop/start of the VM as not supported. Learn's Azure Virtual Desktop page says these VMs "can't be deallocated only restarted, reimaged, or deleted". Our reading is that restarting a running host is allowed and deallocating it is not; try anything beyond that in a pilot pool. Nerdio's help article agrees on the consequence: such a host must be destroyed to free its compute capacity.

## Check 1: pool type, management approach and cloud

Learn's Azure Virtual Desktop page says ephemeral OS disks are supported only in pooled host pools configured with a session host configuration. The October 2025 preview post says the same. Learn's host pool management approaches page adds that the approach is set when the pool is created and cannot be changed, so an existing pool without a session host configuration means a new pool. The decision is made before deployment. See [pooled host pools](https://www.m365.fm/entity/avd-pooled-host-pool/) and, for the other type, [personal host pools](https://www.m365.fm/entity/avd-personal-host-pool/).

Cloud matters too. The Azure Virtual Desktop page says ephemeral OS disks are only available in Azure and are not supported in Azure Government during preview. The autoscale scenarios page says dynamic autoscaling is not supported in Azure Government either, and the session host update page limits session host update to the global Azure cloud. For an Azure Government tenant, this check ends the decision.

Two points to verify before relying on this:

- The Azure Virtual Desktop FAQ on Learn still answers "No" to whether ephemeral OS disks are supported with Azure Virtual Desktop, which contradicts the dedicated Learn page. Our reading is that the entry is outdated, but Microsoft has not said so.
- Nerdio describes ephemeral OS disks in its own dynamic host pools (Workspace, Dynamic host pools, Add dynamic host pool) and does not mention a session host configuration, so confirm in Nerdio's documentation how the two relate in your tenant.

Status: Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

## Check 2: where the state lives

Learn says pooled users should store profile data in [FSLogix](https://www.m365.fm/entity/fslogix/). With an ephemeral OS disk this becomes a requirement in practice: a local profile on the C: drive disappears with the host.

Walk through what else writes to the OS disk:

1. **User data outside the profile.** Files saved to a local folder outside the redirected profile are lost on reimage, deletion, resize or healing.
2. **Per-machine apps installed after deployment.** Learn's session host update page says manual customizations are not present after an update and lists three homes for them: the image, configuration management (Intune or Group Policy) and the custom configuration PowerShell script. Our reading is that the same logic applies to every replaced ephemeral host. Add apps to the [golden image](https://www.m365.fm/entity/golden-image/); [MSIX app attach](https://www.m365.fm/entity/msix-app-attach/) is our suggestion for apps that change more often than the image.
3. **Monitoring agents.** The same page says that if you use Azure Virtual Desktop Insights, the Azure Monitor agent is not installed automatically on updated session hosts, and that you can use Azure Policy to install it automatically.

Learn's FAQ recommends compute-level Azure Backup only for personal host pools. In our reading, that leaves the image and the profile storage as the things to protect for a pooled pool with ephemeral hosts, and the host itself as disposable.

## Check 3: capacity pattern and cost

Learn's ephemeral OS disk page lists deallocation of VMs as unsupported and recommends [dynamic autoscaling](https://www.m365.fm/entity/avd-dynamic-autoscaling/) for these pools. It sets one rule: in each phase of the scaling plan, set **Minimum percentage of active hosts (%)** to 100 percent. The reason it gives is that these hosts do not support starting and deallocating, so with 100 percent the scaling process only creates and deletes session hosts. Power management autoscaling remains generally available.

Nerdio's help article (see also Nerdio [auto-scaling](https://www.m365.fm/entity/nerdio-auto-scaling/)) describes the same constraint in its own terms: such a host must be destroyed to free its compute capacity, and the base host pool capacity is always set to the minimum active host capacity and cannot be edited. With a minimum active host capacity of 0, the article says there are no compute and no storage costs.

For cost, the sources differ in what they promise:

- Nerdio: ephemeral OS disks "have no associated storage costs", and its cost estimate shows storage as 0.
- Microsoft's Azure page: the placement option does not change the cost of an ephemeral disk, performance depends on the VM's local storage, and with a Standard SSD or Premium SSD base disk you pay the applicable base disk charges.

Neither source gives a regional price, so compare two full configurations in the Azure pricing calculator: your current size with a managed OS disk, and a size with enough local storage.

## Check 4: VM size and image fit

The size check is arithmetic. The Azure page says the image's OS disk size must be less than or equal to the cache or temp size of the chosen VM size. With trusted launch, Azure reserves 1 GiB for VMGS from that local space, so add 1 GiB to the image size when you compare. The Azure page shows the effect: a 75 GiB image on Standard_D2ads_v5, whose temp disk is 75 GiB, fails with temp disk placement and trusted launch, and the error message names 74 GB as the limit.

Read the temp or cache size for the exact VM size from that size's own page in Azure documentation before relying on any example.

Learn's Azure Virtual Desktop page sets two disk-type limits on top of that, both worded for preview. Ephemeral OS disks are not supported with NVMe and Premium SSD during preview, and only Standard SSD is supported and is selected automatically once ephemeral OS disks are configured. The Azure VM page describes NVMe placement, but the Azure Virtual Desktop page excludes it for session hosts. Nerdio says a VM size without Premium SSD support does not support ephemeral OS disks, and that the option is grayed out when the cache is too small. Our reading is that Nerdio describes a VM size capability while Learn describes the disk type you can pick, so the two statements are not the same test.

With trusted launch, the Azure page cautions that keys or secrets the vTPM generates or seals after VM creation might be lost on reimage or service healing.

## A decision walk-through

1. Confirm you are in Azure, not Azure Government.
2. Confirm the pool is, or can be, a pooled host pool with a session host configuration. If not, stop here.
3. Confirm profiles are in FSLogix and no user data is written elsewhere on C:.
4. Confirm every application is in the image or delivered by a layer that survives host replacement.
5. Confirm capacity is managed by creating and deleting hosts, with dynamic autoscaling (Minimum percentage of active hosts at 100 percent in every phase), and that no process depends on deallocating the same host.
6. Check the size: image OS disk, plus 1 GiB if you use trusted launch, against the cache or temp storage of the VM size, and make sure the size is not one that relies on NVMe.
7. Confirm you do not need Azure Backup, Azure Disk Encryption, snapshots or image capture on the host itself.
8. Pilot with a small pool, reimage or replace a host, and confirm that users find their profile, apps and settings unchanged.

## If it does not fit

A pooled pool with managed OS disks and power management autoscaling (generally available) keeps hosts that can be deallocated and started again; the Azure VM page lists stop-deallocation as supported for persistent OS disks. Compare the disk charges as described in Check 3. A personal host pool is where Learn's autoscale scenarios page lists hibernation.

## Sources

- [Microsoft Learn: Ephemeral OS disks on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks)
- [Microsoft Learn: Ephemeral OS disks for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/ephemeral-os-disks)
- [Microsoft Tech Community: Now in public preview, ephemeral OS disk support on Azure Virtual Desktop (15 October 2025)](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/now-in-public-preview-ephemeral-os-disk-support-on-azure-virtual/ba-p/4460172)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Update session hosts with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Create and assign an autoscale scaling plan for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Nerdio Manager help: Ephemeral OS Disks](https://nmehelp.getnerdio.com/hc/en-us/articles/26124378246157-Ephemeral-OS-Disks)
