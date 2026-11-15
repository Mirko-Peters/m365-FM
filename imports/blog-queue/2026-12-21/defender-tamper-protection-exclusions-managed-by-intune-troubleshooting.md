---
title: "Defender Tamper Protection and Antivirus Exclusions Managed by Intune: Why Changes Are Blocked and How to Check"
summary: "What Microsoft Learn documents about tamper protection, Defender Antivirus exclusions managed only by Intune, the conditions that must all be met, the registry values that show the state, and how troubleshooting mode and device exclusion fit in."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [microsoft-defender-for-endpoint, intune]
keypoints:
  - "With tamper protection on, changes to protected settings, including exclusions in the protected case, can appear to succeed but are blocked. Group Policy changes to those settings are ignored."
  - "Exclusions are tamper protected only if platform 4.18.2211.5 or later, DisableLocalAdminMerge enabled, Intune-only or Configuration Manager-only management, and exclusions managed there are all met."
  - "Co-managed devices are not supported for tamper-protected exclusions, and Learn also lists co-managed devices as unsupported for managing tamper protection in Intune."
  - "Registry values ManagedDefenderProductType, EnrollmentStatus and TPExclusions show whether a device meets the conditions. Learn says to view them only and not change them."
  - "Troubleshooting mode can temporarily disable tamper protection on a device, and any changes made to tamper-protected settings are reverted after it ends."
faq:
  - q: "Why does my exclusion change show as successful but nothing changes?"
    a: "Learn says that with tamper protection on, changes to tamper-protected settings might appear to succeed but are actually blocked. Exclusions are among the protected settings when the conditions for exclusion protection are met."
  - q: "What must be true for exclusions to be tamper protected?"
    a: "Learn lists four conditions: Defender platform version 4.18.2211.5 or later, DisableLocalAdminMerge enabled, devices managed only by Intune or only by Configuration Manager with Sense enabled, and exclusions managed in Intune or Configuration Manager."
  - q: "How do I see whether a device protects its exclusions?"
    a: "In Registry Editor, read ManagedDefenderProductType (HKLM SOFTWARE Microsoft Windows Defender), EnrollmentStatus (HKLM SOFTWARE Microsoft SenseCM) and TPExclusions (HKLM SOFTWARE Microsoft Windows Defender Features). A TPExclusions value of 1 means exclusions are tamper protected. Learn says not to change these keys."
  - q: "Are co-managed devices supported?"
    a: "Learn says co-managed devices are not supported for managing tamper protection in Intune. The registry table also lists a device co-managed with Configuration Manager and Intune as unsupported for tamper-protected exclusions."
  - q: "How do I change a protected setting for troubleshooting?"
    a: "Learn recommends troubleshooting mode to temporarily disable tamper protection on a device. After the mode ends, changes made to tamper-protected settings are reverted. You can also exclude devices from tamper protection in Intune or Configuration Manager."
---

When tamper protection is on, Microsoft Defender Antivirus settings it protects cannot be changed by local admins, scripts or Group Policy. When exclusions are protected too, a change from the wrong place looks like it worked and then has no effect. Microsoft Learn documents the exact conditions, the Intune policy settings and the registry values that show the state. This article collects them. It does not cover every cause of a failed policy, because the pages read do not.

## What tamper protection locks

Learn's list of tamper-protected settings: virus and threat protection, real-time protection, behavior monitoring, antivirus protection including IOAV, cloud protection, security intelligence updates, automatic actions on detected threats, notifications in the Windows Security app, scanning of archived files, and exclusions that cannot be modified or added. A note says that as of signature release 1.383.1159.0, tamper protection no longer locks "Allow Scanning Network Files" to its default value.

Key behavior from the overview page:

- Changes made to tamper-protected settings might appear to succeed but are actually blocked.
- If you use Group Policy to manage Defender Antivirus settings, changes to tamper-protected settings are ignored. Learn recommends other methods, such as Intune, instead of Group Policy for Defender for Endpoint settings.
- Tamper protection is on by default through built-in protection, according to the Tip on the page.
- If your organization uses Defender for Endpoint, individual users cannot change the setting.
- A tampering attempt raises an alert in the Microsoft Defender portal.
- Learn adds a note that controlled configuration is being introduced, and that the existing tamper protection setting in management experiences is renamed to controlled configuration. Existing behavior remains unchanged, and organizations do not get the new protections automatically.

## Turn tamper protection on with Intune

From the Learn page on managing tamper protection in Intune, create an endpoint security antivirus policy:

1. Policy type **Antivirus**, platform **Windows**, profile **Windows Security Experience**.
2. Enter a name and description.
3. Turn **Tamper protection (device)** on in the **Defender** section.
4. Add scope tags if you use them.
5. Assign to **All users** and **All Devices** with target type **Include** for both.

Requirements in the Learn table include a role such as Security Administrator, Intune licenses, Windows 10 version 1709 or later or Windows 11, security intelligence 1.287.60.0 or later, antimalware platform 4.18.1906.3 or later, devices onboarded to Defender for Endpoint, and shared Microsoft Entra infrastructure for the Intune and Defender for Endpoint tenants. Co-managed devices are not supported for this feature. Learn says that devices not enrolled in Defender for Endpoint show tamper protection as **Not Applicable** until onboarding completes. If you see Event ID 5013, Learn points to its Defender Antivirus troubleshooting article.

Learn also says that when Intune manages Defender settings, you must set `DisableLocalAdminMerge` to `true` on devices.

## Conditions for protected exclusions

Tamper protection protects Defender Antivirus exclusions only when all of these are met:

| Condition | Learn's criteria |
|---|---|
| Platform | Platform version 4.18.2211.5 or later. |
| DisableLocalAdminMerge | Enabled, so device settings do not merge with organization policy. |
| Device management | Managed in Intune only or Configuration Manager only. Sense must be enabled. |
| Exclusions | Managed in Intune or Configuration Manager, and the exclusion protection feature must be enabled on the device. |

If Configuration Manager is the only tool managing exclusions and all conditions are met, the exclusions are protected, and you do not need to push them through Intune as well.

## Check a device in the registry

Learn describes a read-only check. Do not change the values, because changing keys has no effect on whether tamper protection applies to exclusions.

1. Read `ManagedDefenderProductType` under `HKLM\SOFTWARE\Microsoft\Windows Defender` and `EnrollmentStatus` under `HKLM\SOFTWARE\Microsoft\SenseCM`.
2. Interpret them with Learn's table: `6` means Intune only (meets the requirement), `7` with `4` means Configuration Manager (meets the requirement), `7` with `3` means co-managed (not supported), any other value means not managed by Intune only or Configuration Manager only.
3. Read `TPExclusions` under `HKLM\SOFTWARE\Microsoft\Windows Defender\Features`: `1` means exclusions are tamper protected, `0` means tamper protection is not currently protecting exclusions. Learn says that if all requirements are met and `0` seems wrong, contact support.

To check tamper protection itself on older systems, Learn describes `Get-MpComputerStatus` and the values `IsTamperProtected` and `RealTimeProtectionEnabled`, where true means enabled. This applies to Windows Server 2012 R2 with the modern unified solution, Windows Server 2016 and older Windows 10 builds where the Windows Security app does not show the setting. Learn adds that on Windows Server 2016 the Settings app does not accurately reflect real-time protection status when tamper protection is on.

## When you must change a protected setting

Learn lists these options:

- Use troubleshooting mode to temporarily disable tamper protection on the device. After the mode ends, changes made to tamper-protected settings are reverted to their configured state.
- Exclude devices from tamper protection in Intune, the Microsoft Defender portal or Configuration Manager.
- If you manage tamper protection through Intune, you can change tamper-protected antivirus exclusions through Intune.
- For a permanent change through Group Policy, the Group Policy tip says to disable tamper protection temporarily, change the values and turn it back on. Learn warns this poses security risks and does not work on devices that were offline when it was disabled, and recommends other management methods instead.

## What the documentation does not say

The pages read do not list causes for specific Intune policy errors, do not explain how to find which management source created a conflicting exclusion, and do not describe the exclusion protection feature flag beyond the registry value. The Learn "How to determine whether antivirus exclusions are tamper protected" section is the documented way to check. If a device shows `TPExclusions` as 0 and the conditions are met, Learn's own instruction is to contact support.

## Related

- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Protect security settings with tamper protection (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-endpoint/prevent-changes-to-security-settings-with-tamper-protection)
- [Manage tamper protection for your organization using Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-endpoint/manage-tamper-protection-intune)
