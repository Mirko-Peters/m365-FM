---
title: "How to Enable Secure Boot in Windows 11 (Check, Fix, Verify)"
summary: "How to enable Secure Boot in Windows 11: check the current state, open UEFI settings, switch from legacy mode, convert MBR to GPT and verify it in Intune."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-autopilot, intune]
keypoints:
  - "Secure Boot is a UEFI firmware setting, so you enable it in the firmware setup, not in Windows. Open it with Settings, System, Recovery, Advanced startup."
  - "Secure Boot needs the firmware in UEFI mode. If the PC runs in Legacy or CSM mode, switch to UEFI first. The menu names depend on the manufacturer."
  - "A BIOS-mode install on an MBR disk usually has to be converted to GPT with MBR2GPT before the firmware can use UEFI mode. The conversion can't be undone, so back up first."
  - "Check the result with Confirm-SecureBootUEFI in PowerShell as administrator. True means Secure Boot is on."
  - "In Intune, the compliance setting Require Secure Boot depends on device health attestation and TPM 2.0. A device without TPM 2.0 shows as not compliant."
faq:
  - q: "Do I need Secure Boot for Windows 11?"
    a: "Windows 11 requires UEFI firmware that is Secure Boot capable, along with TPM 2.0. Capable means the hardware supports it, and Microsoft also advises turning it on for better security. Microsoft's guidance for upgrading from Windows 10 says the PC must be Secure Boot capable, which means UEFI mode is enabled in the firmware."
  - q: "How can I check if Secure Boot is on?"
    a: "Open PowerShell as administrator and run Confirm-SecureBootUEFI. It returns True when Secure Boot is enabled and False when it is supported but disabled. On a legacy BIOS system, it displays that the cmdlet is not supported on this platform. System Information (msinfo32) also shows the Secure Boot State and the BIOS Mode."
  - q: "Can I enable Secure Boot without reinstalling Windows?"
    a: "Often yes. If the disk already uses GPT and the firmware only needs to be switched from Legacy to UEFI, no reinstall is needed. If the disk uses MBR, the MBR2GPT tool can convert it in place without deleting data. Back up first, suspend BitLocker, and switch the firmware to UEFI mode afterwards."
---
To enable Secure Boot in Windows 11, restart into the UEFI firmware settings (**Settings**, **System**, **Recovery**, **Advanced startup**, **Restart now**, then **Troubleshoot**, **Advanced options**, **UEFI Firmware Settings**), make sure the boot mode is UEFI instead of Legacy or CSM, and switch Secure Boot on under the Boot or Security tab. Then confirm it from Windows. This article is for IT admins who have a PC or a fleet where Secure Boot is off, or where Windows 11 says the PC can't run it. It shows how to check the current state, enable the setting, convert a disk from MBR to GPT when the firmware is stuck in legacy mode, and verify the result in Intune.

## What Secure Boot does and why Windows 11 asks for it

Microsoft describes Secure Boot as a security feature that helps prevent unauthorized software from loading when your PC starts. With it enabled, the firmware checks that the bootloader is signed by a trusted certificate before it starts, and Windows then continues the trust chain. The details are on Microsoft Learn in [Secure the Windows boot process](https://learn.microsoft.com/en-us/windows/security/operating-system-security/system-security/secure-the-windows-10-boot-process).

For Windows 11 the relevant lines are in the hardware requirements: the system firmware must be UEFI and Secure Boot capable, and the PC needs TPM 2.0. "Capable" is the word that trips people up. A PC can support Secure Boot and still have it switched off, or run in a legacy mode where it can't be used at all. Microsoft's Secure Boot page for Windows 11 adds that to enable it you switch the boot mode from Legacy (also called CSM mode) to UEFI, and that if the firmware offers both, UEFI should be the first or only option.

## Check the current state first

Before you touch the firmware, find out what you have. It takes a minute and saves a reboot.

1. Open **PowerShell** as administrator.
2. Run `Confirm-SecureBootUEFI`.

Microsoft Learn documents the result: `True` if the computer supports Secure Boot and it is enabled, `False` if it is supported but disabled. If the computer doesn't support Secure Boot or is a BIOS (non-UEFI) machine, the cmdlet says that it isn't supported on this platform. The cmdlet needs a prompt run as administrator, otherwise you get an access denied message.

You can also run `msinfo32` and look at the **System Summary**. The BIOS Mode row should read UEFI. Microsoft's Intune troubleshooting article uses the same tool to check BIOS Mode and the PCR7 Configuration. System Information also has a Secure Boot State row, which reads On, Off or Unsupported. That row isn't described on the Microsoft pages I used, so trust the PowerShell result first.

After the change, Microsoft's enablement guide offers another check: open **Settings**, **Security**, **Integrity protection** and confirm Secure Boot shows **On**. The label can differ between Windows builds.

If `Confirm-SecureBootUEFI` says the platform isn't supported, you have the situation most of this article is about: the PC boots in legacy mode.

## Enable Secure Boot in the UEFI settings

The setting lives in the firmware, so you need to open it. The steps below come from Microsoft's [Secure Boot enablement guide](https://support.microsoft.com/en-us/windows/security/secure-boot-enablement-guide).

1. Save your work. Open **Settings**, then **System**, then **Recovery**.
2. Next to **Advanced startup**, select **Restart now**.
3. On the **Choose an option** screen, select **Troubleshoot**, then **Advanced options**.
4. Select **UEFI Firmware Settings**, then **Restart**.
5. In the firmware, find the Secure Boot setting, which usually sits on the **Boot** or **Security** tab. If the boot mode is Legacy or CSM, switch it to UEFI first.
6. Enable Secure Boot, save and exit.

Menus and wording differ by manufacturer, and Microsoft doesn't give one generic path. Its guide links to vendor instructions for Surface, Acer, ASRock, ASUS, BIOSTAR, Colorful, Dell or Alienware, GIGABYTE or AORUS, HP or OMEN, Lenovo and MSI. If you built the PC yourself, use your motherboard maker's guide. On Surface the steps are in Surface UEFI: select **Security**, then under Secure Boot select **Change configuration**, choose **Microsoft only** from the certificate list and select **OK**, then **Exit** and **Restart now**.

Microsoft's warning applies to every vendor: changing firmware settings incorrectly can affect your PC's security or prevent it from starting properly. Change only the Secure Boot settings your manufacturer describes. If the PC doesn't start afterwards, go back into the firmware and undo your last change.

## When the PC runs in legacy mode on an MBR disk

This is the stubborn case. The firmware can offer UEFI mode, but Windows was installed in legacy mode on an MBR disk, so switching to UEFI makes the PC fail to boot. The fix is to convert the disk to GPT. Microsoft's [MBR2GPT](https://learn.microsoft.com/en-us/windows/deployment/mbr-to-gpt) tool does this without modifying or deleting data on the disk.

First check the partition style. In PowerShell run `Get-Disk | ft -Auto` and read the **Partition Style** column, which shows MBR or GPT. In Disk Management (`diskmgmt.msc`) you can open the disk's **Properties** and look at **Partition style** on the **Volumes** tab.

Then go through Microsoft's prerequisites. The device must support UEFI, the disk must be the system disk, and it needs room for the GPT structures. It can have at most three primary partitions and no extended or logical ones. If a volume is BitLocker-encrypted, you must suspend protection first.

1. Back up the PC. The tool's own output warns that the changes cannot be undone.
2. Suspend BitLocker if it is on.
3. Validate: `MBR2GPT /validate /allowFullOS` (or `/disk:0` from Windows PE).
4. Convert: `MBR2GPT /convert /allowFullOS`.
5. Restart into the firmware and switch the boot mode to UEFI. Microsoft is clear on this: the disk can only boot in GPT mode afterwards, and the system won't boot correctly until the firmware is switched to UEFI.
6. Enable Secure Boot as above and resume BitLocker.

By default the tool runs from a Windows PE command prompt. The `/allowFullOS` option lets it run in the full operating system, and in that case it creates a new EFI system partition by shrinking the OS partition. Return code 0 means success. Code 100 means the conversion succeeded but some BCD entries couldn't be restored. Check `setupact.log` and `setuperr.log` for details. Microsoft's page says Windows 10 and Windows 11 are supported.

## Check TPM 2.0 as well

Windows 11 asks for Secure Boot and TPM 2.0 together, and a Secure Boot check in management tools usually depends on the TPM. To check, press **Windows key + R**, type `tpm.msc` and read **Specification Version** under TPM Manufacturer Information. If you see a "Compatible TPM cannot be found" message, the TPM may be disabled in firmware.

Microsoft's page on enabling TPM 2.0 says to look in a submenu labeled **Advanced**, **Security** or **Trusted Computing**. The setting may be called Security Device or Security Device Support, TPM State, AMD fTPM or Intel PTT. A TPM below version 2.0 can't be fixed by turning it on, because the device doesn't meet the Windows 11 requirements.

## For admins: verify Secure Boot in Intune and Autopilot

In [Microsoft Intune](https://www.m365.fm/entity/intune/) the Windows compliance setting **Require Secure Boot to be enabled on the device** has two choices, Not configured and Require. Microsoft describes it as requiring the device to boot into a factory-trusted state, with core boot components verified by UEFI firmware. The catch is in the troubleshooting article: the check depends on device health attestation, which needs TPM 2.0 or later. A device without TPM 2.0 shows as **Not Compliant** even when Secure Boot is on, and TPM 2.0 itself requires UEFI firmware.

If a device with Secure Boot shows as not compliant, Microsoft's checks are:

1. Run `tpm.msc` and check the specification version.
2. Run `msinfo32` and confirm **BIOS Mode** is UEFI and **PCR7 Configuration** is Bound.
3. Run `Confirm-SecureBootUEFI` in a prompt run as administrator and expect True.
4. Run `manage-bde -protectors -get $env:systemdrive` and confirm the drive is protected by PCR 7.

If the device fails any step, the Not Compliant status is expected, and the fix is on the hardware or firmware side, not in the policy. Microsoft's Windows compliance reference names Device Health Attestation for Windows 10 devices, so check the current documentation for Windows 11 details.

For deployments with [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/), a firmware check is part of preparing the hardware. Self-deploying mode requires TPM 2.0 and TPM device attestation, and a device without them can't use that mode.

## Secure Boot certificates and the June 2026 date

Microsoft is updating the Secure Boot certificates first issued in 2011, and they begin expiring in June 2026. Microsoft says that on supported Windows versions the update happens automatically. For your fleet, this is a reason to have Secure Boot on and Windows updated, not a reason to touch the firmware by hand. Microsoft links to separate guidance on the Microsoft-managed update, so read it before you plan any manual work.

## Common mistakes

- Looking for the setting in Windows. It is a firmware setting, and Windows can only report on it.
- Switching to UEFI on an MBR install. The PC fails to boot until the disk is converted or Windows is reinstalled in UEFI mode.
- Converting a disk with BitLocker protection still on. Suspend it first.
- Skipping the backup before MBR2GPT. The conversion cannot be undone.
- Reading a Not Compliant result in Intune as a Secure Boot problem when the cause is a missing TPM 2.0.
- Leaving Secure Boot off after troubleshooting. Microsoft says to turn it back on once the issue is resolved.

## Related topics to explore

- How do I get into the firmware if Windows won't start? The article on how to open BIOS in Windows 11 explains the recovery route.
- What if Secure Boot blocks my USB stick? Microsoft says you may need to turn it off temporarily to boot some media. See the Windows 11 bootable USB article.
- Which TPM does my PC have? Use `tpm.msc` and compare with the Windows 11 requirements.
- How do I enforce this on many PCs? Combine an Intune compliance policy with a hardware check in your deployment process.

## Next step

Run `Confirm-SecureBootUEFI` on one PC today and write down the result, then check the disk partition style if it fails. Once you know whether the PC is in UEFI mode, the way to enable Secure Boot in Windows 11 is a short list of firmware changes instead of guesswork.
