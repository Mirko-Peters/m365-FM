---
title: "Intune Non-Compliant Device: Find the Cause, Fix Conflicts and Force a Re-Check"
summary: "How to fix an Intune non-compliant device: read the compliance status, find the failing setting, check enrollment and check-in, resolve policy conflicts and handle the Secure Boot and TPM case."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [intune, device-compliance, conditional-access]
keypoints:
  - "Start at Devices > Compliance > Monitor, open the policy and use Per-setting status to see which setting fails. The Policy device status report lists the devices."
  - "Compliant, In-grace period, Not evaluated and Not compliant mean different things. Not evaluated is the initial state of newly enrolled devices."
  - "Devices check in about every 8 hours after the first enrollment period. A device that has not reported within the validity period (30 days by default) is treated as noncompliant."
  - "A compliance policy setting always takes precedence over the same setting in a configuration profile. Between two compliance policies, the most restrictive setting applies."
  - "Secure Boot shows Not Compliant when the device lacks TPM 1.2 or 2.0, or when UEFI and PCR7 binding are not as required."
faq:
  - q: "Where do I see why a device is non-compliant in Intune?"
    a: "Microsoft Learn says to go to Devices > Compliance, select the policy and open the Per-setting status tile. Selecting a device count opens details for that setting and status. The Policy device status report, opened with View report, lists device name, user, compliance status, OS and last contacted."
  - q: "What does Not evaluated mean in Intune compliance?"
    a: "According to Microsoft Learn it is an initial state for newly enrolled devices. It also appears for devices with no assigned compliance policy and no trigger to check, and for devices that have not checked in since the policy was last updated."
  - q: "How often does a device check in with Intune?"
    a: "Microsoft Learn says the estimated check-in schedule for all platforms is about every 8 hours, and a device is allowed only one maintenance sync every 6.5 hours. Newly enrolled devices check in more often at first, and macOS settles at about hourly."
  - q: "Why are devices without a compliance policy marked compliant?"
    a: "The compliance policy setting Mark devices with no compliance policy assigned as is Compliant by default. Learn recommends setting it to Not compliant if you use Conditional Access with compliance policies, so only confirmed compliant devices get access."
  - q: "What happens when two policies set the same value differently?"
    a: "Microsoft Learn says compliance policy settings take precedence over the same setting in configuration profiles. If two compliance policies evaluate the same setting, the most restrictive applies. Conflicts between two configuration policies are shown in Intune and must be resolved manually."
---

To fix a non-compliant device in Intune, first find which setting fails, then decide whether the device is really out of compliance or simply has not reported yet. The Intune admin center shows both, in a fixed order: policy, per-setting status, device. This article walks through that order and then covers conflicts, check-in timing and a common Windows case with Secure Boot.

## Step 1: Read the compliance status correctly

Microsoft Learn defines four statuses in the Device compliance status tile:

- **Compliant:** the device applied one or more compliance policy settings successfully.
- **In-grace period:** the device is targeted but not yet compliant to all settings. It is noncompliant, but inside the grace period the admin defined.
- **Not evaluated:** an initial state for newly enrolled devices. It also appears for devices with no assigned policy and no trigger, and for devices that have not checked in since the policy was last updated.
- **Not compliant:** the device failed one or more settings, or the user did not comply.

The per-policy chart groups results as Compliant, Noncompliant and Others, such as Error or Not evaluated. Learn adds that if a setting returns Error, the device's compliance state stays unchanged for up to seven days. After that it becomes Not compliant, or In grace period if a grace period is set.

## Step 2: Find the failing setting

1. In the Intune admin center, go to **Devices** > **Compliance**.
2. Select the policy and open the **Per-setting status** tile.
3. Select a device count in a status column to see details for that setting and status.
4. For device-level detail, select **View report** to open the Policy device status report.

For organization-wide views, go to **Reports** > **Device compliance** and select the **Reports** tab. Learn also names reports for Noncompliant devices and Policy noncompliance under **Devices** > **Monitor**.

Learn notes the per-setting drill-in does not go deeper, so use the other reports to find which policy and setting a given device fails.

## Step 3: Check enrollment and check-in

Use the built-in troubleshooting pane:

1. Go to **Troubleshooting + support** > **Troubleshoot**.
2. Select **Select user** and choose the user.
3. Confirm the **Intune license** shows a green check.
4. Under **Devices**, check the columns.

What to look for, as Microsoft describes it:

| Column | Expected | If not |
|---|---|---|
| Managed | MDM or EAS/MDM | The device is not enrolled and gets no compliance policy |
| Microsoft Entra join type | Workplace or AzureAD | Not Registered suggests an enrollment issue; unenroll and re-enroll |
| Intune compliant | Yes | Check policies and connectivity; the device may be off or offline |
| Last check in | Recent | Over 24 hours suggests a device problem |

Learn says devices check in about every 8 hours by default. A device that cannot check in cannot receive policies. If a device fails to report its compliance status within the validity period, it is treated as noncompliant. The default period is 30 days and you can set 1 to 120 days.

To force a check-in, Learn lists:

- **Android:** Company Portal > **Devices** > select the device > **Check Device Settings**.
- **iOS/iPadOS:** Company Portal > **Devices** > select the device > **Check Settings**.
- **Windows:** **Settings** > **Accounts** > **Access Work or School** > select the account > **Info** > **Sync**.

Intune reports can lag behind the actual device state, so wait for the next sync before you decide.

## Step 4: Resolve policy conflicts

Microsoft's guidance on conflicts is specific:

- Settings in a compliance policy always take precedence over the same setting in device configuration policies.
- If two compliance policies evaluate the same setting, the most restrictive one applies.
- If two configuration policies conflict, Intune shows the conflict and you resolve it manually.

In the device's policy view, the **Conflict** state means there is an existing setting on the device that Intune cannot override, or two policies set the same setting to different values. **Pending** means the device has not checked in or has not reported its status. **Not Applicable** means the setting is not supported on that platform, for example an iOS/iPadOS policy on Android.

Learn also notes that policies created in several places, such as security baselines or Group Policy analytics, can contribute to conflicts, and suggests using the built-in reports.

If expected policies are missing from the device, the policy is not targeted correctly. Open the policy and assign it to the user or device.

## Step 5: Check the "no policy" setting

Under compliance policy settings, **Mark devices with no compliance policy assigned as** defaults to **Compliant**. Learn recommends **Not compliant** if you use Conditional Access with compliance policies, so only confirmed compliant devices reach your resources. If a device is blocked or allowed unexpectedly, check this setting before the policy itself.

## Step 6: The Secure Boot and TPM case

Microsoft documents a Windows case where a device with Secure Boot enabled shows Not Compliant. The Secure Boot setting is supported only on devices with TPM 1.2 or 2.0, and TPM 2.0 requires UEFI firmware. Verify:

1. Run `tpm.msc` and check **Specification Version**.
2. Run `msinfo32` and confirm **BIOS Mode** is **UEFI** and **PCR7 Configuration** is **Bound**.
3. In elevated PowerShell, run `Confirm-SecureBootUEFI`. The expected result is `True`.
4. Run `manage-bde -protectors -get $env:systemdrive` and confirm the drive is protected by PCR 7.

If the device has TPM 1.2 or legacy BIOS, it cannot meet the requirement as configured.

## What the pages do not say

The pages I read do not list numeric error codes for compliance errors and do not give a fixed time for how long a new policy takes to apply. Learn gives only estimates, for example notification times that vary from immediately up to a few hours, and removal of a group assignment taking up to 7 hours or more.

## Quick order of checks

1. Is the device enrolled and checking in?
2. Which setting fails in Per-setting status?
3. Do two policies target the same setting?
4. Is the status just Not evaluated or Pending?
5. Does a hardware requirement such as TPM or UEFI block the setting?

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Device compliance (Intune compliance policies)](https://www.m365.fm/entity/device-compliance/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Microsoft Learn: Monitor device compliance policies in Intune](https://learn.microsoft.com/en-us/intune/device-security/compliance/monitor-policy)
- [Microsoft Learn: Device compliance overview](https://learn.microsoft.com/en-us/intune/device-security/compliance/overview)
- [Microsoft Learn: Troubleshoot policies in Microsoft Intune](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-configuration/troubleshoot-policies-in-microsoft-intune)
- [Microsoft Learn: Common questions and scenarios with policies and profiles](https://learn.microsoft.com/en-us/mem/intune/configuration/device-profile-troubleshoot)
- [Microsoft Learn: Secure Boot enabled device shows not compliant](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/secure-boot-enabled-device-shows-not-compliant)
