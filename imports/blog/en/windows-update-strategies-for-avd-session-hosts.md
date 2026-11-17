---
title: "Windows Update strategies for AVD session hosts"
summary: "The right way to patch an Azure Virtual Desktop session host depends on its operating system and on whether you patch the running VM or replace it from an updated image. Microsoft Learn's September 2026 guidance recommends Windows Update or Windows Autopatch for single-session Windows client, session host update for multi-session, and Azure Update Manager for Windows Server."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, avd-session-host]
keypoints:
  - "Learn separates two servicing models. Patch in-place updates the existing VM. Image-based servicing builds a new image version, deploys new hosts and drains the old ones."
  - "For monthly updates Learn recommends Windows Update or Windows Autopatch for Windows client Enterprise (single-session), session host update or Azure Compute Gallery for multi-session, and Azure Update Manager or automatic guest patching for Windows Server."
  - "Windows Autopatch is marked not supported for Windows client multi-session, and Intune's own multi-session page says update rings are not supported there. Quality update settings are available through the settings catalog instead."
  - "Hotpatching is supported on Windows Server Azure Edition and on Windows 11 Enterprise 24H2 or later with virtualization-based security, but not on multi-session."
  - "Image-based servicing does not save user data or local storage on the replaced host, so profiles must live outside the VM, for example in FSLogix."
faq:
  - q: "Should I run Windows Update on a pooled multi-session host?"
    a: "Learn marks Windows Update as not recommended for Windows client multi-session and recommends session host update or an Azure Compute Gallery image instead. Configuration Manager is listed as supported. Learn's terminology page says pooled hosts are updated by redeploying from updated images."
  - q: "Can Intune update rings patch multi-session session hosts?"
    a: "No. Microsoft's Intune page for Azure Virtual Desktop multi-session says Windows update rings policies are not currently supported. It lists quality update settings in the settings catalog, such as deferral and deadline periods, that you can use instead."
  - q: "Do Azure Virtual Desktop agent updates follow the same strategy?"
    a: "No. The agent, side-by-side stack and Geneva Monitoring agent are updated by the service. Scheduled agent updates let you set up to two two-hour maintenance windows, but critical updates are still installed by force."
---

There is no single patching method for Azure Virtual Desktop. Microsoft Learn's guidance, published in September 2026, picks a method by operating system: Windows Update or Windows Autopatch for single-session Windows client, session host update or an image from Azure Compute Gallery for multi-session, and Azure Update Manager or automatic guest patching for Windows Server. This article sets out that matrix, the two servicing models behind it and the limits of Intune on multi-session hosts.

Sources are listed at the end and were retrieved on 17 November 2026. The Learn page states no preview or general availability label for the methods themselves, so check each tool's status before you commit to it.

## Two servicing models

Learn's [update management methodologies](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-update-management-methodologies-session-hosts) page groups every method under one of two models.

- **Patch in-place** updates the existing VM without replacing it. Windows Update, Windows Autopatch, Intune, Configuration Manager, Azure Update Manager, automatic guest patching and WSUS all fall here. Learn describes it as typical for monthly cumulative updates, security updates and Windows Server patching.
- **Image-based servicing** creates a new image version and deploys updated [session hosts](/entity/avd-session-host/). Session host update and Azure Compute Gallery fall here. Learn's typical workflow is: update the base image, validate applications and configurations, publish a new Azure Compute Gallery image version, deploy new session hosts, then drain and remove the old ones.

Learn adds one caveat to image-based servicing: user data and local storage on a replaced host are not saved. For pooled hosts, Learn's terminology page already says users should keep profile data in [FSLogix](/entity/fslogix/), because they can land on a different host at each sign-in.

## Host pool type and operating system

Learn's matrix also restricts which operating systems suit which host pool type:

| Host pool type | Windows client Enterprise (single-session) | Windows client multi-session | Windows Server |
|---|---|---|---|
| Personal | Supported | Not supported | Supported |
| Pooled | Not recommended (session density of 1) | Supported | Supported |

The terminology page gives the matching default: [personal host pools](/entity/avd-personal-host-pool/) are updated with Windows Update, Microsoft Configuration Manager or other software distribution tools, and [pooled host pools](/entity/avd-pooled-host-pool/) by redeploying session hosts from updated images.

## Monthly security and quality updates

Learn's recommendation markers are *Recommended*, *Supported*, *Not recommended* and *Not supported*. For monthly updates:

| Method | Client Enterprise | [Multi-session](/entity/windows-enterprise-multi-session/) | Windows Server |
|---|---|---|---|
| Windows Update | Recommended | Not recommended | Supported |
| [Windows Autopatch](/entity/windows-autopatch/) | Recommended | Not supported | Not supported |
| [Configuration Manager](/entity/configuration-manager/) | Supported | Supported | Supported |
| [Azure Update Manager](/entity/azure-update-manager/) | Not supported | Not supported | Recommended |
| Automatic guest patching | Not supported | Not supported | Recommended |
| Session host update | Not supported | Recommended | Not recommended |
| [Azure Compute Gallery](/entity/azure-compute-gallery/) | Not recommended | Recommended | Not recommended |

Two readings follow. First, multi-session is the one operating system where Learn steers you away from patching the running VM and toward replacing it. Second, Configuration Manager is the only method marked at least *Supported* for all three.

### Configuration Manager for multi-session

Learn's [Configuration Manager article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-automatic-updates) describes grouping multi-session hosts in a query-based collection and targeting it with an automatic deployment rule. The query uses operating system SKU 175, which Learn says covers Windows 10 and Windows 11 Enterprise multi-session. You need the Configuration Manager agent on the hosts and at least branch 1910 for Windows 10 or 2107 for Windows 11. You can check the SKU on a host with `Get-WmiObject -Class Win32_OperatingSystem | FT Caption,OperatingSystemSKU`.

### Automatic guest patching and Azure Update Manager for Windows Server

Learn recommends both for Windows Server. The Azure VM page on automatic guest patching says critical and security patches are applied automatically in off-peak hours in the VM's time zone, within 30 days of the monthly release, and that it works only on images with a supported publisher, offer and SKU; custom images are not supported. Other patch classes are left to Azure Update Manager. Because host images for pools are often custom, check this support list before you rely on guest patching.

## Hotpatch

Learn describes hotpatching as applying eligible monthly security updates without a reboot. Support is limited:

| Operating system | Hotpatch |
|---|---|
| Windows client Enterprise | Supported on Windows 11 Enterprise 24H2 or later with virtualization-based security enabled |
| Windows client multi-session | Not supported |
| Windows Server | Supported on Azure Edition only |

For Windows 11 Enterprise, Learn says updates must be managed through Windows Autopatch and Microsoft Intune. A pooled multi-session pool therefore cannot use hotpatching for reboot avoidance.

## Feature updates and OS version upgrades

Feature updates, including enablement package updates such as Windows 11 24H2 to 25H2, do not apply to Windows Server. For multi-session, Learn recommends session host update or Azure Compute Gallery, marks WSUS as not recommended and in-place Setup.exe or ISO as not supported. For client Enterprise it recommends Windows Update or Windows Autopatch.

For OS version upgrades, such as Windows Server 2022 to 2025 or Windows 10 to 11, Learn's recommended method is deploying new VMs from an image of the target version. In-place upgrades are marked not supported for all three operating system types.

## What Intune can and cannot do on multi-session

Intune is Learn's recommended tool for managing AVD hosts, and its [multi-session page](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session) is specific about updates: Windows update rings policies are not currently supported. Quality updates are managed through the settings catalog, filtered to *Enterprise multi-session*, under **Windows Update for Business**. The settings listed are active hours start, end and maximum range, the ability to block pausing updates, deadline grace period, defer quality updates period in days, pause quality updates start time and quality update deadline period in days. The page does not mention feature update policies. See [Intune update rings](/entity/intune-update-rings/) and [Windows Update for Business](/entity/windows-update-for-business/) for the single-session case.

The same page says multi-session hosts must be in pooled host pools deployed through Azure Resource Manager and run agent 1.0.2944.1400 or later. It also says Intune does not support a cloned image of an already-enrolled computer.

## Session host update in short

[Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update) works on host pools with a [session host configuration](/entity/avd-session-host-configuration/). It deallocates or deletes the existing VMs and creates new ones from the updated configuration, in batches. Per Learn, the first host is updated alone to prove the process, and each host takes about 20 minutes. Users get a notification, and the hosts are placed in [drain mode](/entity/avd-drain-mode/). Learn's cautions: disable autoscale on the host pool before an update and keep it off until it finishes, test on a non-production pool first, and note that manual customizations on the old VM are lost unless they are in the image, in Intune or Group Policy, or in the custom configuration script. The page gives no preview or GA label. Its detail belongs to the dedicated articles in this series.

## The agent is separate

Operating system patches are not the only updates. The service updates the [Azure Virtual Desktop agent](/entity/avd-agent/), the side-by-side stack and the Geneva Monitoring agent. With [scheduled agent updates](/entity/avd-scheduled-agent-updates/) you set up to two maintenance windows, each two hours long, and non-critical updates then happen only inside them. Learn adds that critical updates are installed by force, that an update does not succeed on a shut-down or deallocated host, and that after four attempts the broker installs the update by force.

## A short procedure

1. Record the operating system and host pool type of each pool.
2. Look up the row in Learn's matrix and choose a *Recommended* method; fall back to *Supported* only with a reason.
3. For pooled multi-session, plan image-based servicing: image, test pool, new image version, batch replacement, with profiles in FSLogix.
4. For personal client hosts, pick Windows Update or Windows Autopatch; for Windows Server, check guest patching support against your image.
5. Decide who controls agent updates, and set maintenance windows if needed.
6. Re-check the Learn matrix before each major change, because the page was updated in October 2026.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Windows update management methodologies for session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-update-management-methodologies-session-hosts)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Windows Enterprise multi-session remote desktops in Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Use Configuration Manager to deploy software updates to Azure Virtual Desktop session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-automatic-updates)
- [Microsoft Learn: Automatic VM guest patching for Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-machines/automatic-vm-guest-patching)
- [Microsoft Learn: Session host update for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts using session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Manage the operating system of session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/management)
- [Microsoft Learn: Scheduled agent updates for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/scheduled-agent-updates)
- [Microsoft Learn: Azure Virtual Desktop agent overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/agent-overview)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
