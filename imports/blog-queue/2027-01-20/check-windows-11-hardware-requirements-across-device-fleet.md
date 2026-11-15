---
title: "How to Check Windows 11 Hardware Requirements Across a Device Fleet"
summary: "The Windows 11 minimum hardware list from Microsoft Learn, how to read it for a fleet, and which Microsoft tools evaluate devices: PC Health Check for single PCs and the Endpoint analytics Work from anywhere report for managed devices."
status: review
publish: false
author: mirko-p
date: 2027-01-20
topics: [intune, trusted-platform-module, configuration-manager, windows-update-for-business]
keypoints:
  - "Minimum hardware per Learn: 1 GHz and two or more cores, 4 GB memory, 64 GB storage, UEFI with Secure Boot, TPM 2.0 and a DirectX 12 capable graphics card."
  - "Direct upgrades need Windows 10 version 2004 or later with the September 14, 2021 security update or later."
  - "PC Health Check is the Learn-named tool for single devices on Windows 10 Home, Pro or Pro for Workstations."
  - "For managed fleets, the Endpoint analytics Work from anywhere report shows Capable, Not capable, Upgraded or Unknown per device, with top blockers."
  - "Virtual machines need generation 2, Secure Boot capable settings and a virtual TPM, so generation 1 VMs cannot be upgraded in place."
faq:
  - q: "What are the minimum hardware requirements for Windows 11?"
    a: "According to Microsoft Learn, a 1 GHz or faster processor with two or more cores on a compatible 64-bit processor or SoC, 4 GB memory, 64 GB available storage, UEFI with Secure Boot capability, TPM version 2.0, DirectX 12 or later graphics with a WDDM 2.0 driver, and a high definition display of 9 inches or more with 8 bits per color channel."
  - q: "How do I check one PC against the requirements?"
    a: "The Plan for Windows 11 page on Microsoft Learn names the PC Health Check app for Windows 10 Home, Pro and Pro for Workstations. It says users on Enterprise and Education editions should rely on their IT administrators to tell them when they are eligible."
  - q: "How do I check many managed devices at once?"
    a: "Learn describes the Windows 11 hardware readiness insights in the Endpoint analytics Work from anywhere report. They cover devices enrolled via Intune, co-management, or Configuration Manager version 2107 or newer with tenant attach. The Windows tab lists each device as Capable, Not capable, Upgraded or Unknown."
  - q: "What does Unknown mean in the Windows 11 readiness status?"
    a: "The Work from anywhere page says that in most cases a device with Unknown status is simply inactive, and suggests reviewing the last check-in time from Intune. A device appears in the report only if it uploaded at least one Endpoint analytics event in the past 29 days."
  - q: "Do virtual machines have different requirements?"
    a: "Yes. Learn lists generation 2, 64 GB or more storage, 4 GB or more memory, two or more virtual processors, and Secure Boot and a virtual TPM. It says an in-place upgrade of existing generation 1 VMs to Windows 11 is not possible."
---

To check Windows 11 hardware requirements across a fleet, compare each device with the minimum list on Microsoft Learn, then use a tool that evaluates many devices at once. For managed devices, Learn points to the Windows 11 hardware readiness insights in the Endpoint analytics Work from anywhere report. For a single PC, it names the PC Health Check app.

## The minimum hardware list

Learn states that devices must meet these minimums to install or upgrade to Windows 11:

| Component | Requirement |
| --- | --- |
| Processor | 1 GHz or faster with two or more cores on a compatible 64-bit processor or system on a chip |
| Memory | 4 GB or greater |
| Storage | 64 GB or greater available disk space |
| Graphics | DirectX 12 or later with a WDDM 2.0 driver |
| System firmware | UEFI, Secure Boot capable |
| TPM | Trusted Platform Module version 2.0 |
| Display | High definition (720p), 9 inch or greater monitor, 8 bits per color channel |
| Internet | Needed for updates and for downloading and using some features |

A note under the storage line says more storage may be needed over time for updates and for specific features. Windows 11 Home also requires an internet connection and a Microsoft account to complete device setup on first use.

## The operating system requirement

Hardware is only half of the check. To upgrade directly, eligible Windows 10 devices must run Windows 10 version 2004 or later and have the September 14, 2021 security update or later installed.

S mode is only supported on the Home edition of Windows 11. If a device runs a different edition in S mode, Learn says to switch out of S mode before upgrading, which also needs internet access. After switching out, you cannot switch back to S mode later.

## Check a single device

For one PC, the Plan for Windows 11 page says that if you run Windows 10 Home, Pro or Pro for Workstations, you can use the PC Health Check app to determine eligibility. Users on Enterprise and Education editions should rely on their IT administrators to tell them when they are eligible.

## Check a managed fleet with Endpoint analytics

The Plan for Windows 11 page says enterprises evaluating device readiness can expect the capability in existing tools such as Endpoint analytics. The Work from anywhere report page describes how it works today.

1. Open the **Work from anywhere** report in Endpoint analytics and go to the **Overview** page.
2. Select **Windows** to open the flyout. A chart shows which hardware requirements are the top blockers in your organization.
3. Open the **Windows** tab for a device-by-device view.
4. Read the **Windows 11 readiness status** column. A device is **Capable** or **Not capable**, or it is listed as already **Upgraded**, or the status is **Unknown**.
5. For devices that are **Not capable**, read the **Windows 11 readiness reason** column. It names the hardware requirements that are not met.

The report covers devices enrolled via Intune, co-management, or Configuration Manager version 2107 or newer with tenant attach enabled. Learn also says the Windows 11 hardware readiness insights do not affect the Work from anywhere score. The page gives the path Reports > Endpoint analytics > Work from anywhere in the Microsoft Intune admin center. It states no licensing requirements, so confirm those in your tenant.

### Reading Unknown

Learn says that in most cases a device with Unknown status is simply inactive, and recommends checking the last check-in time in Intune. A device appears in the report only if it has uploaded at least one Endpoint analytics event, such as a boot, sign-in or application crash event, in the past 29 days.

## Feature-specific requirements

Some features need more than the minimum hardware. Learn lists examples such as a 5G capable modem for 5G support, an HDR monitor for Auto HDR, a processor with second-level address translation for Client Hyper-V, and a camera configured for near infrared imaging or a fingerprint reader for biometric Windows Hello. Learn adds that devices without biometric sensors can use Windows Hello with a PIN or a portable Microsoft compatible security key. Teams features need a camera, microphone and speaker. These items do not block the upgrade itself, but they decide which features a device can use.

## Virtual machines

For VMs, Learn requires generation 2, 64 GB or more storage, 4 GB or more memory and two or more virtual processors. The VM host processor must also meet the Windows 11 processor requirements. In Azure, trusted launch with vTPM is required. On Hyper-V, Secure Boot and TPM must be enabled. Learn says in-place upgrade of existing generation 1 VMs is not possible, and, for Hyper-V hosts, that virtual TPM 2.0 is emulated in the guest VM independent of the host TPM.

## What the Learn pages leave open

The Plan for Windows 11 page treats the hardware check as the first step and then covers deployment planning, managed and unmanaged devices and servicing. It says organizations using Windows Update client policies can keep devices that do not meet the minimum requirements from being offered the upgrade automatically. In my reading, that is useful once you know which devices fail, because it lets you hold them while you plan hardware refreshes.

## A practical order of work (my advice)

This sequence is my suggestion, not a Microsoft procedure:

1. Take the Not capable list and group it by reason, since one blocker such as TPM often covers many devices.
2. Look at the Unknown devices separately and bring them online before you decide anything.
3. Check VMs against the generation 2 and virtual TPM rules.
4. Use the refresh plan to prioritize eligible and non-eligible devices.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Trusted Platform Module (TPM)](https://www.m365.fm/entity/trusted-platform-module/)
- [Microsoft Configuration Manager](https://www.m365.fm/entity/configuration-manager/)
- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)

## Sources

- [Windows 11 requirements (Microsoft Learn)](https://learn.microsoft.com/windows/whats-new/windows-11-requirements)
- [Plan for Windows 11 (Microsoft Learn)](https://learn.microsoft.com/windows/whats-new/windows-11-plan)
- [Work from anywhere report (Microsoft Learn)](https://learn.microsoft.com/mem/analytics/work-from-anywhere)
