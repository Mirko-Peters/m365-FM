---
title: "Windows Device With Secure Boot Enabled Shows as Not Compliant in Intune: Causes and Checks"
summary: "Secure Boot is on, yet Intune marks the Windows device Not Compliant. Learn why TPM version and UEFI mode matter for the Require Secure Boot setting, and run the five checks Microsoft lists."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [intune, device-compliance, bitlocker]
keypoints:
  - "The Require Secure Boot to be enabled on the device setting is supported on some TPM 1.2 and 2.0 devices, and Intune shows Not Compliant when TPM 2.0 or later is not supported."
  - "TPM 2.0 requires UEFI firmware, so a computer with legacy BIOS and TPM 2.0 will not work as expected."
  - "Check the TPM Specification Version with tpm.msc, BIOS Mode and PCR7 Configuration in msinfo32, and Confirm-SecureBootUEFI."
  - "Run manage-bde -protectors -get on the system drive and verify the drive is protected by PCR 7."
  - "If the device has TPM 1.2 but supports 2.0, Learn says to contact the device manufacturer about updating."
faq:
  - q: "Why does Intune show a device with Secure Boot enabled as Not Compliant?"
    a: "Microsoft Learn explains that the Require Secure Boot to be enabled on the device setting is supported on some TPM 1.2 and 2.0 devices. For devices that do not support TPM 2.0 or later, the policy status in Intune shows Not Compliant. TPM 2.0 also requires UEFI firmware, so legacy BIOS with TPM 2.0 does not work as expected."
  - q: "How do I check the TPM version?"
    a: "Learn says to type tpm.msc in the Run box and check the value in Specification Version. If the TPM version is 1.2 and the device supports TPM 2.0, Learn says to contact the device manufacturer to update to TPM 2.0."
  - q: "What should msinfo32 show?"
    a: "Open an elevated command prompt, run msinfo32 and look at System Summary. Learn says BIOS Mode should be UEFI and PCR7 Configuration should be Bound."
  - q: "Which PowerShell commands does Microsoft suggest?"
    a: "Learn lists two. Confirm-SecureBootUEFI should return True, and manage-bde -protectors -get with the system drive should show that the drive is protected by PCR 7. Both run in an elevated session."
  - q: "Does this article apply to Windows 11?"
    a: "The Learn troubleshooting page is titled for Windows 10 devices. The Intune Windows compliance settings page, which describes the same setting, is for the Windows 10 and later platform. Windows 10 support ended on 14 October 2025, so treat the device checks as hardware checks that also help on newer Windows."
---

A Windows device can have Secure Boot turned on and still show **Not Compliant** in Intune. According to Microsoft Learn, the compliance setting **Require Secure Boot to be enabled on the device** is supported on some TPM 1.2 and 2.0 devices. Devices that do not support TPM 2.0 or later are reported as Not Compliant. TPM 2.0 also requires UEFI firmware, so a PC with legacy BIOS and TPM 2.0 will not work as expected. Five checks on the device show which part fails.

## The symptom

You create a compliance policy for Windows in Intune and set **Require Secure Boot to be enabled on the device** to **Require**. A device that meets the requirement still shows as **Not Compliant**.

Learn's Windows compliance settings page describes what **Require** means: the system is forced to boot to a factory trusted state. Core boot components must carry correct cryptographic signatures that the device manufacturer trusts. The UEFI firmware verifies the signature before the machine starts, and if files were tampered with, the system does not boot. **Not configured** is the default and the setting is then not evaluated.

## Why it happens

This setting belongs to the group of Windows Health Attestation Service evaluation rules, which also includes **Require BitLocker** and **Require code integrity**. Intune uses Microsoft device attestation services so that devices boot to a trusted state. Learn says devices running Windows 10 across the Intune commercial, US Government GCC High and DoD services use the Device Health Attestation service.

The troubleshooting article gives the cause in two sentences:

1. The setting is supported on some TPM 1.2 and 2.0 devices. For devices without TPM 2.0 or later, the policy status in Intune shows Not Compliant.
2. TPM 2.0 requires UEFI firmware. A computer with legacy BIOS and TPM 2.0 will not work as expected.

So the usual suspects are the TPM version and the firmware mode, not the Secure Boot switch itself.

## The five checks from Microsoft

Run these on the affected device. Learn presents them as steps to check whether the device meets the hardware requirements for health attestation.

1. **Check the TPM version.** Type `tpm.msc` in the **Run** box and read **Specification Version**. If the version is 1.2 and your device supports TPM 2.0, Learn says to contact the device manufacturer to update to TPM 2.0.
2. **Open System Information.** In an elevated command prompt, run `msinfo32`.
3. **Check BIOS Mode and PCR7.** In **System Summary**, verify that **BIOS Mode** is **UEFI** and that **PCR7 Configuration** is **Bound**.
4. **Confirm Secure Boot from PowerShell.** In an elevated PowerShell window, run:

   ```powershell
   Confirm-SecureBootUEFI
   ```

   Verify that it returns **True**.
5. **Check the PCR protector.** Run:

   ```powershell
   manage-bde -protectors -get $env:systemdrive
   ```

   Verify that the drive is protected by PCR 7.

If one of these fails, you have found the part that blocks the compliance state. The article does not give fixes beyond the TPM update note, so treat the result as input for your hardware or firmware owner.

## What each result suggests

This table is my reading of the checks, not a Microsoft table.

| Check | Result that points to a problem | Next step |
| --- | --- | --- |
| tpm.msc Specification Version | 1.2 on a TPM 2.0 capable device | Ask the manufacturer about a TPM 2.0 update, as Learn advises |
| msinfo32 BIOS Mode | Legacy | The device is not in UEFI mode, which TPM 2.0 needs |
| msinfo32 PCR7 Configuration | Not Bound | Compare with the Learn expectation of Bound |
| Confirm-SecureBootUEFI | False or an error | Secure Boot is not active in UEFI mode |
| manage-bde protectors | PCR 7 not listed | The drive is not protected by PCR 7 |

Be careful with a change from legacy BIOS to UEFI on an installed system. Learn does not describe how to do that, so plan it with your hardware vendor and keep a backup.

## Related Intune behavior worth knowing

Learn's compliance page adds two points that help when you test:

- For **Require BitLocker**, the state is measured only at boot time. Even when encryption has completed, a reboot is required before the device detects it and becomes compliant. The same page does not say this about Secure Boot, so do not assume it, but a restart before a recheck is a cheap step. That last point is my advice.
- Secure Boot is one of the settings that Intune monitors through real-time event detection, along with firewall, antivirus, BitLocker, Defender status, OS build version and real-time protection. Intune uses built-in throttling for compliance-triggered reevaluations, so some changes may be processed in a later cycle.

## About the Windows version

The troubleshooting article is written for Windows 10 devices. Windows 10 support ended on 14 October 2025. The compliance settings page applies to the **Windows 10 and later** platform. For a current fleet, the hardware checks above are still the documented way to test TPM and UEFI readiness. I did not find Windows 11 specific guidance on the pages I read.

## A short working order

1. Confirm the policy really sets Require Secure Boot, not another health attestation rule.
2. Pick one failing device and run the five checks.
3. Sort the fleet by TPM version and BIOS mode using your inventory data.
4. Decide per hardware model: update TPM, switch firmware mode, or exclude the setting for models that cannot support it.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Device compliance](https://www.m365.fm/entity/device-compliance/)
- [BitLocker](https://www.m365.fm/entity/bitlocker/)

## Sources

- [Secure boot enabled Windows 10 device shows Not Compliant in Intune - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-protection/secure-boot-enabled-device-shows-not-compliant)
- [Windows compliance settings in Microsoft Intune - Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-security/compliance/ref-windows-settings)
