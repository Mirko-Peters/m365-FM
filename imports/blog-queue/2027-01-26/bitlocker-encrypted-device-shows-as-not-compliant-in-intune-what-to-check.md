---
title: "BitLocker-Encrypted Device Shows as Not Compliant in Intune: What to Check"
summary: "The short Learn page blames unfinished encryption. This article adds what Learn says about Require BitLocker (measured at boot, reboot needed), the encryption data storage setting, the Intune encryption report with its 24 hour delay and status details."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [intune, bitlocker, device-compliance]
keypoints:
  - "The troubleshooting page covers a Windows 10 device with BitLocker that shows Not compliant because encryption is not finished. After it finishes, the device shows Compliant."
  - "The Learn compliance reference says the Require BitLocker setting is only measured at boot time, so a reboot is required before a finished encryption is detected."
  - "The Encryption of data storage on a device setting checks for encryption at the OS drive level. The page says Intune supports only the BitLocker check for it."
  - "The Intune encryption report can take up to 24 hours to show encryption status or a change, including the time the OS needs to encrypt."
  - "Status details in the report name causes such as an unprotected OS volume, a missing TPM, a TPM not ready, WinRE not configured, or a failed recovery key backup."
faq:
  - q: "Why does a BitLocker-encrypted device show Not compliant?"
    a: "The Learn troubleshooting page names one cause: the encryption is not finished. Based on disk size, number of files and BitLocker settings, encryption can take a long time, and after it completes the device shows as Compliant. The page describes a Windows 10 device enrolled in Intune with a compliance policy that requires device encryption."
  - q: "Does the device need a restart?"
    a: "For the Require BitLocker setting, yes, according to the Windows compliance settings reference. It says the state of the setting is only measured at boot time, so even though encryption might have completed, a reboot is required for the device to detect this and become compliant."
  - q: "What is the difference between the two encryption settings?"
    a: "Encryption of data storage on a device generically checks for encryption at the OS drive level, and the page says Intune supports only the BitLocker check for it. Require BitLocker uses Windows Device Health Attestation to validate BitLocker status at the TPM level, and the page calls it the more robust setting, with the reboot caveat."
  - q: "How long can the status take to update?"
    a: "The encryption report page says it can take up to 24 hours for Intune to report a device's encryption status or a change to that status. That includes the time for the OS to encrypt plus the time for the device to report back."
  - q: "Where do I see why a device is not encrypted?"
    a: "In the Microsoft Intune admin center under Devices, Manage devices, Configuration, on the Monitor tab, select Device encryption status. Select a device to see Encryption readiness, Encryption status, Profiles, Profile state summary and Status details. Status details appear for Windows 10 April 2019 Update or later, and Windows 11."
---

A Windows device is encrypted with BitLocker, enrolled in Intune, and a compliance policy requires encryption, yet Intune shows **Not compliant**. The Microsoft Learn page on this problem is very short, about 100 words, and gives one cause. This article states that cause, then adds what other Learn pages say that bears on it: how the two encryption compliance settings are measured, how the Intune encryption report works, and which status details point to a real fault. I label the parts that are my advice.

## What the troubleshooting page says

**Scenario:** a Windows 10 device has BitLocker Drive Encryption enabled, is enrolled in Intune, and has a compliance policy that requires device encryption. The device shows **Not compliant**.

**Cause:** encryption is not finished. Depending on the disk size, the number of files and the BitLocker settings, encryption can take a long time. After it completes, the device shows as **Compliant**.

That is all the page says. It gives no steps, no timings and no reboot advice. The rest of this article comes from two other Learn pages.

## Which compliance setting do you use?

The Windows compliance settings reference describes two settings that relate to BitLocker.

### Require BitLocker

It sits under Device health and uses the Windows Health Attestation Service. The reference says BitLocker uses the Trusted Platform Module (TPM) to help protect the operating system and user data, and to lock the encryption keys until the TPM verifies the state of the computer. Options are **Not configured** (the default, not evaluated) and **Require**.

The reference carries an important note: the state of this setting is only measured at boot time. Even though BitLocker encryption may have completed, a reboot is required for the device to detect this and become compliant.

### Encryption of data storage on a device

It sits under System security, Encryption, and applies to all drives on a device. The reference says it generically checks for the presence of encryption, more specifically at the OS drive level, and that Intune currently supports only the encryption check with BitLocker. For a more robust setting, the page suggests Require BitLocker, which uses Device Health Attestation to validate BitLocker status at the TPM level, with the reboot caveat above.

So if your policy uses Require BitLocker, a device that finished encrypting an hour ago can still show Not compliant until it restarts. That is described by the reference, and it fits the troubleshooting page.

## How compliance is recalculated

The compliance reference also says that on Windows, Intune can trigger a compliance evaluation when it detects relevant changes. BitLocker is in the list of settings monitored through real-time event detection, together with Firewall, Antivirus, Microsoft Defender status, OS build version, real-time protection and Secure Boot. When a supported change is detected, Intune proactively requests a device check-in. The page adds that Intune throttles compliance-triggered reevaluations for reliability, so if several changes occur in a short time, some are processed in a later cycle.

## Check the encryption report

Open the Microsoft Intune admin center and go to **Devices** > **Manage devices** > **Configuration**, select the **Monitor** tab and then **Device encryption status**. The report supports Windows version 1607 or later and macOS 10.13 or later. Select a device to see details.

Fields that matter here:

- **Encryption readiness:** Ready, Not ready, or Not applicable. For Windows, Ready needs a supported Windows edition and version, and a TPM chip that is activated. The page notes that a device that is Not ready might still support encryption, since a device can be encrypted manually, or by a policy that allows it without a TPM.
- **Encryption status:** whether the OS drive is encrypted. The page says it can take up to 24 hours for Intune to report the status or a change to it, including the time for the OS to encrypt and for the device to report back. For Windows this field does not look at other drives such as fixed drives.
- **Profiles and Profile state summary:** the endpoint protection profiles that apply, with the least favorable state across them. If one of several profiles has an error, the summary shows Error.
- **Status details:** advanced details, shown for Windows 10 April 2019 Update or later and Windows 11.

### Status details that point to a real problem

Examples the page lists for Windows:

- The BitLocker policy requires user consent to start the wizard, but the user did not consent.
- The encryption method of the OS volume does not match the policy.
- The policy requires a TPM protector, or TPM with PIN, a startup key, or both, but that protector is not used.
- The OS volume is unprotected. The page says this can mean encryption was suspended or did not complete.
- Recovery key backup failed. Check the device event log, and you might need `manage-bde` to escrow the keys manually.
- A fixed drive is unprotected, or its encryption method does not match.
- The policy needs a signed-in administrator, or for Microsoft Entra joined devices the `AllowStandardUserEncryption` policy set to 1.
- Windows Recovery Environment (WinRE) is not configured.
- A TPM is not available, or the TPM is not ready for BitLocker. The page suggests checking BIOS settings, and running `initialize-tpm` where needed.
- The network is not available, which recovery key backup needs.

The page also lets you export the report as a CSV file, which helps to find patterns across a group of devices.

## Checking order (my advice)

This is my suggestion, not guidance from the pages:

1. Check which compliance setting the policy uses. If it is Require BitLocker, restart the device first. That costs nothing and matches the reference note.
2. Look at Encryption status in the report. If encryption is still running, wait, and allow up to 24 hours before you decide anything.
3. If it says not encrypted after a long time, read Status details. An unprotected OS volume, a TPM problem or a missing WinRE are real causes, not delays.
4. Check for a failed recovery key backup, since policies often depend on it.
5. Trigger a manual sync from the device after the restart, then look at the compliance status again.
6. If you see many devices with the same status detail, export the report and fix the cause once for the group.

## What the pages do not say

The troubleshooting page names Windows 10 only. It does not describe Windows 11 in this scenario and gives no timing for how long encryption takes. I did not read the Intune BitLocker policy article, so settings for silent encryption are not covered here.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [BitLocker](https://www.m365.fm/entity/bitlocker/)
- [Device compliance (Intune compliance policies)](https://www.m365.fm/entity/device-compliance/)

## Sources

- [BitLocker-encrypted device displays as Not compliant (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-protection/bitlocker-encrypted-device-not-compliant)
- [Windows compliance settings in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-security/compliance/ref-windows-settings)
- [View report details for encryption status of devices managed with Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-configuration/endpoint-security/monitor-encryption)
