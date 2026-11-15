---
title: "How to Use Hotpatch Updates on Windows 11 Enterprise Through Windows Autopatch"
summary: "Use hotpatch updates on Windows 11 through Windows Autopatch: license and OS prerequisites, VBS, the Arm64 CHPE step, the Intune quality update policy setting, baseline and hotpatch months, status checks and rollback."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [windows-autopatch, windows-365]
keypoints:
  - "Hotpatch updates are Monthly B security updates that install and take effect without a restart. They need Windows Autopatch and a quality update policy with hotpatch turned on."
  - "Prerequisites: an eligible license, Windows 11 version 24H2 or later, the latest baseline, Intune, and virtualization-based security running."
  - "In Intune, create a Windows quality update policy and set 'When available, apply without restarting the device (Hotpatch)' to Allow."
  - "Baseline months with restarts are January, April, July and October. The other months are hotpatch months without restart."
  - "There is no automatic rollback. To roll back manually, uninstall the hotpatch, install the latest cumulative update and restart."
faq:
  - q: "What are hotpatch updates?"
    a: "According to Microsoft Learn, they are Monthly B release security updates that install and take effect without a device restart. They extend Windows Update and need Windows Autopatch to create and deploy them to devices in the Autopatch quality update policy."
  - q: "What do I need?"
    a: "One of the listed licenses (Windows 11 Enterprise E3 or E5, Microsoft 365 F3, Windows 11 Education A3 or A5, Microsoft 365 Business Premium or Windows 365 Enterprise), Windows 11 24H2 or later, the latest baseline, Intune and virtualization-based security running. On Arm64, CHPE must be disabled."
  - q: "Where do I turn it on?"
    a: "In the Intune admin center go to Devices > Manage updates > Windows updates > Quality updates, select Create > Windows quality update policy and set the Hotpatch option to Allow under Settings."
  - q: "Which months need a restart?"
    a: "The baseline months January, April, July and October. In the other months, hotpatch updates install without a restart. A device that is not on the latest baseline in a hotpatch month receives both the baseline, with restart, and the latest hotpatch."
  - q: "How do I check that a device is enrolled?"
    a: "Learn lists System information showing Virtualization-based security as Running, the Configured update policies entry Enable hotpatching when available in Windows Update settings, and Event Viewer entries for AllowRebootlessUpdates."
---

Hotpatch lets eligible Windows 11 devices install security updates in most months without a restart. You turn it on with a Windows quality update policy in Intune, make sure virtualization-based security runs, and plan for the quarterly baseline update that still needs a restart. This guide follows the Microsoft Learn page on hotpatch updates in Windows Autopatch. It covers Windows 11. The page says hotpatch is also available on Windows Server and Windows 365 and links one separate article for Windows Server Azure Edition.

## What it is

Hotpatch updates are Monthly B release security updates that install and take effect without a restart. They extend Windows Update and need Windows Autopatch to create and deploy hotpatch updates to devices in the Autopatch quality update policy. The packages are much smaller than standard cumulative updates, so they install faster and use less bandwidth.

## Prerequisites

- **License (one of):** Windows 11 Enterprise E3 or E5, Microsoft 365 F3, Windows 11 Education A3 or A5, Microsoft 365 Business Premium, or Windows 365 Enterprise.
- **OS:** Windows 11 version 24H2 or later.
- **Baseline:** the device must be on the latest baseline release.
- **Management:** Microsoft Intune deploys a Windows quality update policy with hotpatch turned on.
- **Virtualization-based security (VBS):** must be running. It can be enabled with the `VirtualizationBasedTechnology` CSP. VBS is required for the hotpatch installer.
- **Arm64 only:** CHPE (Compiled Hybrid PE) usage must be disabled, with the `DisableCHPE` system policy CSP or by setting the registry DWORD `HotPatchRestrictions` to 1 under `HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management`. Set it once and restart. Learn warns that disabling CHPE can break 32-bit apps, such as VBA with `Declare` statements or 32-bit COM add-ins, and says there are no plans to support hotpatch on Arm64 with CHPE enabled.

## Turn it on in Intune

1. In the Intune admin center go to **Devices** > **Manage updates** > **Windows updates** > **Quality updates**.
2. Select **Create** > **Windows quality update policy**.
3. Enter a name. Under **Settings**, set **When available, apply without restarting the device ("Hotpatch")** to **Allow**.
4. Set scope tags or leave Default, assign devices, review and select **Create**.

You can also edit an existing Windows quality update policy and set the same option to Allow. For Autopatch groups, create a hotpatch policy and assign devices to it. Turning on hotpatch does not change existing deferral, deadline, scheduled-install or active-hours settings.

## Baseline and hotpatch months

| Quarter | Baseline, restart required | Hotpatch, no restart |
| --- | --- | --- |
| 1 | January | February and March |
| 2 | April | May and June |
| 3 | July | August and September |
| 4 | October | November and December |

- Baseline updates can occasionally fall outside the schedule for security reasons. The planned cadence does not change.
- If a device is hotpatch-enabled but not on the latest baseline in a hotpatch month, it receives both the baseline, which needs a restart, and the latest hotpatch.
- Upgrading Windows in a baseline month keeps the device on the hotpatch cycle. Upgrading in a hotpatch month switches it to standard updates that need a restart, and hotpatch resumes after the next baseline.

## Check status

- **Ineligible devices** receive the standard latest cumulative update, which needs a restart, and keep their existing ring settings.
- **Autopatch reporting:** the Hotpatch quality update report shows per-policy update status. Autopatch alerts include Hotpatch with VBS not running.
- **On the device:** System information should show Virtualization-based security as Running. Under Settings > Windows Update > Advanced options > Configured update policies, Enable hotpatching when available indicates enrollment. In Event Viewer, searching for `AllowRebootlessUpdates` with a value of 1 indicates enrollment. The sample entry on the page also shows `isEnrolled: 1` and `vbsState: 2`.
- **Errors:** search Event Viewer Windows Logs > Application for `hotpatch`. The inbox monitor service logs errors, and a critical error makes the device install the cumulative update.

## Rollback

Learn says automatic rollback of a hotpatch update is not supported, but you can uninstall it. For an unexpected issue, you can investigate by uninstalling the hotpatch update, installing the latest cumulative update and restarting. Uninstalling is quick but needs a restart.

## What the page does not say

Hardware requirements beyond VBS and the Arm64 CHPE step, such as TPM, Secure Boot or memory. Whether a separate Autopatch license is needed beyond the eligible licenses. The exact day hotpatches are released in a month. The rollback time beyond quick. Windows 10 support, since the page body covers only Windows 11 24H2 and later.

## A pilot (my advice)

The steps are my own suggestion, not taken from the page.

1. Pick a pilot group on Windows 11 24H2 or later with an eligible license.
2. Check VBS on a sample device before you deploy.
3. On Arm64 devices, assess the 32-bit app impact of disabling CHPE first.
4. Create the quality update policy with hotpatch Allow and assign it to the pilot.
5. Watch the Hotpatch quality update report and the VBS alert.
6. Plan a restart window for each baseline month.

## Typical mistakes (my advice)

- Expecting no restarts at all. Baseline months still restart devices.
- Deploying to devices where VBS is not running.
- Disabling CHPE on Arm64 without testing 32-bit apps.
- Upgrading Windows in a hotpatch month and being surprised by a restart.

## Related

- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)
- [Windows 365](https://www.m365.fm/entity/windows-365/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Hotpatch updates (Microsoft Learn)](https://learn.microsoft.com/windows/deployment/windows-autopatch/manage/windows-autopatch-hotpatch-updates)
