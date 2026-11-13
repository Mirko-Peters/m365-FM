---
title: "Intune BitLocker Policy Succeeds in the Portal but Some Devices Never Encrypt: A Checklist"
summary: "Most devices encrypt with your Intune BitLocker policy, but a few stay unencrypted without a clear error. Check the encryption report, the policy, the device prerequisites and the logs in this order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [intune, bitlocker, device-compliance]
keypoints:
  - "Start with Devices, Monitor, Encryption report in Intune. The status tells you if the problem is TPM, WinRE, user rights or an encryption method mismatch."
  - "Silent encryption needs a policy without a startup PIN or startup key, and for standard users the standard-user encryption setting must be on."
  - "On the device, check reagentc /info, Get-Tpm, the DeviceManagement and BitLocker-API event logs, and the BitLocker MDM policy Refresh task."
  - "A community answer suggested allowing an un-allowed DMA bus. Microsoft Learn is more careful and says to allow it only for an internal DMA interface."
  - "Microsoft Learn is not fully consistent on whether Secure Boot is required for silent encryption, so check the current pages for your case."
faq:
  - q: "Why do only some devices fail to encrypt silently?"
    a: "The usual differences between devices are the TPM state, WinRE, the user type (administrator or standard user), the BIOS mode, and leftover encryption by another tool. Microsoft Learn's encryption-report scenarios cover a missing or not-ready TPM, WinRE not enabled, missing admin rights for a standard user and an encryption method mismatch."
  - q: "Does silent BitLocker work with a startup PIN?"
    a: "No. Microsoft Learn says devices must not require a TPM startup PIN or startup key for silent BitLocker, because these need user interaction. Note that the Microsoft Defender security baseline can enable them by default."
  - q: "Can Intune BitLocker policies encrypt Azure virtual machines?"
    a: "In an April 2026 Microsoft Q&A thread, a Microsoft employee said that encryption for Azure VMs is configured in Azure and linked to Azure Disk Encryption. That answer was not marked as accepted, and the poster did not confirm. Check the Azure documentation for your VM type."
  - q: "How do I fix an error state caused by a different encryption method?"
    a: "Microsoft Learn says that if the policy's XTS-AES 128-bit and 256-bit settings do not match the existing encryption, you decrypt the device. The Intune policy then encrypts it the next time it reaches the device."
---

You deployed a BitLocker policy with Intune. The dashboard looks mostly green. A handful of devices show no error, no obvious TPM problem and no encryption. On those devices, a manual "Turn on BitLocker" works at once.

This is the scenario in a Microsoft Q&A thread from May 2026. An administrator who was preparing a fully remote setup saw about a dozen devices fail silently. The thread has one detailed answer from a community volunteer (an independent advisor) and a follow-up from the same person that asks for an accepted answer. No answer was accepted, and the poster never replied. So the thread gives us a list of ideas, not a confirmed fix. This article checks each idea against Microsoft Learn. It is not an official Microsoft procedure.

## Symptoms

- The BitLocker policy is assigned and reports success for most devices.
- A small group of devices has an unencrypted OS drive and no clear error.
- Starting encryption by hand on the device works.

## Step 1: Read the encryption report

In the Microsoft Intune admin center, go to **Devices**, then **Monitor**, then **Encryption report**. Compare the device state with the cases that Microsoft Learn describes:

- **Not ready and not encrypted:** the policy needs a TPM and the device does not have one.
- **Not ready and will not encrypt silently:** Learn says the TPM is likely not ready for BitLocker. Check the TPM state on the device.
- **Ready but not encrypted silently:** WinRE may be disabled, or the targeted user has no admin rights and the standard-user setting is off. Learn shows the status text "The user logged into the device does not have admin rights" in this scenario and ties it to WinRE not being configured correctly, so check WinRE as well as the standard-user setting.
- **Error state but encrypted:** the policy's encryption method does not match the encryption that is already on the drive.
- **Ready but not encrypted, no silent policy:** if the policy is not silent, the user has to answer the prompt.

If your 12 devices fall into one of these, you already know where to look.

## Step 2: Check the policy for silent settings

Silent encryption has requirements for the policy itself. Learn lists these for the Endpoint security profile (**Endpoint security**, **Disk encryption**, **Create Policy**, platform **Windows**, profile **BitLocker**):

- **Require Device Encryption** set to **Enabled**.
- **Allow Warning For Other Disk Encryption** set to **Disabled**.
- **Allow Standard User Encryption** set to **Enabled**. Learn says it is required when standard users use the device. In the Endpoint protection template the setting is called **Allow standard users to enable encryption during Microsoft Entra join**.
- No TPM startup PIN or startup key. Learn says that for silent BitLocker, devices must not require them. The client-side troubleshooting page says to configure the compatible TPM startup PIN as **Blocked**.

Two label notes. The thread answer calls the standard-user setting "during Autopilot." One Learn page uses that wording in its text and another uses "during Microsoft Entra join." Look at the label in your own profile.

Also check for a second policy. Learn warns that the Security baseline for Microsoft Defender can enable TPM startup PIN and key by default, which blocks silent enablement. The client-side troubleshooting page lists the conflicting error "use of a USB startup key cannot be required" and says that any compatible TPM setting set to **Required** makes silent encryption fail.

## Step 3: Check the device prerequisites

Learn lists these for silent encryption:

- Windows 10 version 1803 or later or Windows 11 when users sign in as administrators. Windows 10 version 1809 or later or Windows 11 for standard users.
- Microsoft Entra joined or hybrid joined.
- TPM 1.2 or later.
- Native UEFI BIOS mode.
- Secure Boot enabled.
- Windows Recovery Environment (WinRE) configured and available.

On one affected device, run these as administrator:

```
reagentc /info
Get-Tpm
msinfo32
manage-bde -status
```

- `reagentc /info` shows if WinRE is enabled. If it is disabled, `reagentc /enable` is the fix that Learn gives. The thread answer said the same.
- `Get-Tpm` shows the TPM state.
- `msinfo32` shows the BIOS mode. For silent encryption with TPM 2.0, Learn says the BIOS mode must be UEFI. TPM 1.2 does not need UEFI.
- `manage-bde -status` shows if the drive is encrypted, with which method, and the protectors.

Here Learn is not fully consistent. The Intune BitLocker page lists Secure Boot as a requirement. The client-side troubleshooting page says Secure Boot, DMA protection and PCR7 are not required for silent encryption. The thread answer mentions a Secure Boot or PCR 7 problem. I could not settle this from the pages. Treat Secure Boot as expected, and check the current pages if a device lacks it.

## Step 4: Read the event logs

Learn names these logs for the client side:

1. Do a manual sync first. On the device go to **Settings**, then **Accounts**, then **Access work or school**, select the work account, select **Info**, and under **Device sync status** select **Sync**.
2. **DeviceManagement-Enterprise-Diagnostics-Provider** (Admin). Filter for Critical, Error and Warning and search for BitLocker. Errors name CSP paths such as `./Device/Vendor/MSFT/BitLocker/RequireDeviceEncryption`.
3. **BitLocker-API** management log.
4. The **System** log, with the sources TPMProvisioningService and TPM-WMI, where Learn says TPM errors appear.

The thread answer named Event ID 853 and a status code 0x8031002c for a DMA bus problem. Learn's client-side page gives no event IDs and does not mention that code. Use the messages in the log first. If one of them says "Un-Allowed DMA capable bus/device(s) detected," follow Learn: confirm with the hardware vendor that the device has no external DMA ports, and add it to the allowed list only if it is an internal DMA interface or bus. The thread answer suggested allowing encryption despite this. That weakens a protection, so do not apply it broadly.

## Step 5: Check if the policy is processed at all

If the policy arrives but encryption never starts, and BitLocker-API shows no attempt, Learn points to the task scheduler:

1. Enable the **TaskScheduler/Operational** log. It is off by default.
2. In Task Scheduler open **Microsoft**, **Windows**, **BitLocker**.
3. Right-click **BitLocker MDM policy Refresh** and select **Run**.
4. Check **Last Run Result**. `0x0` means it ran successfully. `0x41303` means the task never ran.

Also compare the applied values. Learn lists the registry keys under `HKLM\SOFTWARE\Microsoft\PolicyManager\current\device\BitLocker` and `HKLM\SOFTWARE\Policies\Microsoft\FVE`, and the MDM diagnostics report in `C:\Users\Public\Documents\MDMDiagnostics`.

## Step 6: Fix an encryption method mismatch

If a device is encrypted already, for example manually, with a different method than the policy (say XTS-AES 128 on the device and 256 in the policy), the report shows an error state. Learn's fix: decrypt the device by hand or with PowerShell. The Intune policy then encrypts it the next time it reaches the device. Plan this carefully for devices with user data.

## Verify

- The device appears as encrypted in the **Encryption report**.
- `manage-bde -status` shows the expected method and protectors.
- If your policy saves recovery information to Microsoft Entra ID (Learn lists the setting **Save BitLocker recovery information to Microsoft Entra ID**), check that a recovery key now exists for the device.

## Limits and open points

- The thread has no accepted answer and no confirmation. Its four causes (standard user setting, WinRE, DMA bus, startup PIN conflict) all match Learn except the event ID and status code, which Learn does not list.
- A second Q&A thread from April 2026 had an administrator who saw "Require device encryption not applicable" on Azure virtual machines. A Microsoft employee answered that Azure VMs are encrypted in Azure, not through Intune. That answer was not accepted, and the poster did not confirm. The AI-generated reply in the same thread is not a source.
- Learn describes full disk encryption on non-modern standby devices and used space only encryption on modern standby devices for silent encryption, and says this cannot be customized in that scenario.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [BitLocker](https://www.m365.fm/entity/bitlocker/)
- [Device compliance](https://www.m365.fm/entity/device-compliance/)

## Sources

- [Microsoft Learn: Encrypt Windows devices with BitLocker using Intune](https://learn.microsoft.com/en-us/intune/device-configuration/endpoint-security/encrypt-bitlocker-windows)
- [Microsoft Learn: Troubleshooting BitLocker policies from the client side](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-protection/troubleshoot-bitlocker-policies)
- [Microsoft Learn: Troubleshooting BitLocker with the Intune encryption report](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-protection/troubleshoot-bitlocker-admin-center)
- [Microsoft Q&A: Has anyone seen BitLocker policies silently fail on certain devices? (May 2026)](https://learn.microsoft.com/en-us/answers/questions/5881100/has-anyone-seen-bitlocker-policies-silently-fail-o)
- [Microsoft Q&A: Intune Policy for Bitlocker Encryption (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5846954/intune-policy-for-bitlocker-encryption)
