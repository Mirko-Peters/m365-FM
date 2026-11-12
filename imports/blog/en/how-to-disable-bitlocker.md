---
title: "How to Disable BitLocker: Suspend or Decrypt a Drive"
summary: "How to disable BitLocker: when to suspend protection, when to decrypt it with Disable-BitLocker or manage-bde -off, and what changes on managed devices."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [bitlocker, intune]
keypoints:
  - "Suspending BitLocker is temporary and keeps the drive encrypted, while turning BitLocker off decrypts the whole drive and removes its key protectors."
  - "To decrypt the system drive, run Disable-BitLocker -MountPoint C: in PowerShell as administrator, or manage-bde -off C: at an administrator command prompt."
  - "Use Suspend-BitLocker before firmware or TPM updates so Windows doesn't ask for the recovery key at the next restart."
  - "On a device managed by your organization, policy may require encryption, so ask IT before you decrypt anything."
  - "Check progress with Get-BitLockerVolume, which reports the volume status, protection status and encryption percentage."
faq:
  - q: "How do I turn off BitLocker in Windows?"
    a: "Open PowerShell as administrator and run Disable-BitLocker -MountPoint C: for the system drive. You can also run manage-bde -off C: at an administrator command prompt. Both remove the key protectors and start decrypting the drive. Check progress with Get-BitLockerVolume until the volume shows as fully decrypted."
  - q: "What is the difference between suspending and disabling BitLocker?"
    a: "Suspending pauses protection temporarily, and you can resume it later. It's meant for tasks such as firmware updates. Disabling, also called turning BitLocker off, decrypts the drive and removes its key protectors. Microsoft says decryption belongs to the case where protection is no longer required, not to troubleshooting."
  - q: "Do I need the recovery key to disable BitLocker?"
    a: "Not when you're signed in to Windows and the drive is open. You only need the 48-digit key when Windows or a data drive asks for it. If the device shows the blue recovery screen, you can't reach Windows to run any command, so find the key first and sign in."
---
To disable BitLocker on the system drive, open PowerShell as administrator and run `Disable-BitLocker -MountPoint "C:"`. The same job on the command line is `manage-bde -off C:`. Both remove the key protectors and start decrypting the drive in the background. If you only need to get past a firmware update or a hardware change, you don't want this at all. You want to suspend protection, which is temporary and keeps the data encrypted. This article is for Windows users who want BitLocker gone and for admins who get that request. It explains the difference, the exact commands, how to check progress, and why a managed device may not let you decrypt.

## Suspend or decrypt: choose before you type anything

Two different actions both get called "disable", and mixing them up causes most of the trouble.

**Suspending** protection pauses [BitLocker](https://www.m365.fm/entity/bitlocker/) for a while. The drive stays encrypted, and you can resume at any time. Microsoft recommends it before non-Microsoft software updates that change boot components, such as manufacturer firmware updates and TPM firmware updates. If you skip the suspend, Microsoft says the system won't recognize the BitLocker key, and you'll be asked for the recovery key at the next restart and at every restart after that.

**Decrypting** is what the PowerShell and manage-bde commands do. It removes all key protectors and begins decrypting the volume. Microsoft's BitLocker operations guide gives a clear rule: decryption belongs to the case where protection is no longer required, and not to troubleshooting.

So ask yourself one question. Do you want the drive unprotected for good, or only out of the way for a few minutes? For a firmware update, a BIOS change or a repair task, suspend. If someone says the laptop is "faster without it", measure that claim before you decrypt a device that carries company data. My recommendation is to keep encryption on for any laptop that leaves the building.

## Suspend BitLocker for an update, then resume

This takes a minute and avoids a recovery prompt. Microsoft documents both the Control Panel route and the PowerShell route.

Control Panel:

1. Open **Control Panel**.
2. Select **System and Security**, then **BitLocker Drive Encryption**, then **Suspend protection**.
3. Select **Yes**.
4. After the update, go to the same place, select **Resume protection** and select **Yes**.

PowerShell, opened as administrator:

1. Run `Suspend-BitLocker -MountPoint "C:" -RebootCount 0`.
2. Install the update and restart as often as it needs.
3. Run `Resume-BitLocker -MountPoint "C:"`.

The `-RebootCount` parameter sets how many restarts can pass before BitLocker turns itself on again. Valid values are 0 to 15. A value of 0 keeps protection suspended until you resume it by hand, which means you have to remember the last step. Microsoft also notes that resuming only works on devices that have accepted the Windows EULA.

## How to disable BitLocker: decrypt a drive with PowerShell or manage-bde

Decrypting takes one command per drive. Open PowerShell or a command prompt as administrator, because BitLocker operations need that.

1. Check what you have. Run `Get-BitLockerVolume C: | fl` in PowerShell. The output includes `VolumeStatus`, `ProtectionStatus`, `LockStatus` and `EncryptionPercentage`. A fully encrypted, protected drive shows `FullyEncrypted` and `On`.
2. Decrypt the drive. In PowerShell, run `Disable-BitLocker -MountPoint "C:"`. BitLocker starts decrypting C: immediately. In a command prompt, the equivalent is `manage-bde -off C:`. Microsoft's description says it decrypts the drive and turns off BitLocker, and that all key protectors are removed when decryption is complete.
3. Watch the progress. Run `Get-BitLockerVolume C:` again, or `manage-bde -status`, and look at the encryption percentage. The Microsoft pages I checked don't give a typical duration, so don't guess. It depends on how much data the drive holds and how busy the machine is. You can keep working while it runs.
4. Confirm the result. When decryption finishes, the volume status shows the drive as fully decrypted, and protection is off.

Some variations from Microsoft's examples:

- **Several drives at once.** `$BLV = Get-BitLockerVolume` followed by `Disable-BitLocker -MountPoint $BLV` disables BitLocker on all volumes. The operations guide also shows `Disable-BitLocker -MountPoint C,D` for named drives.
- **A test run.** `Disable-BitLocker` supports `-WhatIf`, which shows what would happen without doing it. That's a handy habit on a server.
- **Automatic keys for data drives.** If the operating system volume has automatic keys that open it at startup, `Disable-BitLocker` doesn't proceed. Run `Clear-BitLockerAutoUnlock` first, then disable BitLocker on the volume. Microsoft doesn't say how these keys usually get there, so check the output of the cmdlet if you hit this.
- **Another computer.** `manage-bde` accepts a `-computername` parameter to change protection on a different machine.

You can read the details in Microsoft's [Disable-BitLocker](https://learn.microsoft.com/en-us/powershell/module/bitlocker/disable-bitlocker?view=windowsserver2025-ps) reference and the [manage-bde -off](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/manage-bde-off) page.

A note on the Settings app and Windows Home. Windows Home doesn't include BitLocker Drive Encryption. It has Device Encryption instead, which Windows turns on when you sign in with a Microsoft account or a work or school account, and you manage it in **Settings**, under **Privacy & security**, **Device encryption**. The Microsoft article I checked describes how to turn it on and doesn't document the steps for turning it off, so look at the toggle on your own device and read the text on the screen before you change it.

## Data drives, USB drives and turning BitLocker on again

The commands work per volume, so the same steps apply to a data drive or a USB drive. The Control Panel applet lists three groups: **Operating system drive**, **Fixed data drives**, and **Removable data drives - BitLocker To Go**. With `manage-bde -off` you name the volume by drive letter followed by a colon, for example `manage-bde -off E:`. Microsoft also accepts a volume GUID path or a mounted volume there. Replace the letter with the one Explorer shows for your drive, and double-check it, because decrypting the wrong volume wastes time.

Decrypting a removable drive has one practical consequence. Once it's finished, anyone who plugs the stick into a PC can read the files, with no password. Decide first whether the data on it should stay protected.

You can turn BitLocker on again later. Microsoft's support article for BitLocker Drive Encryption describes the path: open the applet, select **Turn on BitLocker** next to the drive, choose how the drive is protected and back up the recovery key. Encryption then runs in the background, and you can keep using the device while it finishes. Treat it as a new setup, not as a "resume". All earlier key protectors were removed when you decrypted, so the recovery key you saved before doesn't apply to the new encryption. Save the new key where you can reach it from another device, and check with the guidance on finding a [recovery key](https://support.microsoft.com/en-us/windows/find-your-bitlocker-recovery-key-6b71ad27-0b89-ea08-f143-056f5ab347d6) that the new key really appears in your account.

## Devices managed by your organization

Your IT department usually manages BitLocker, and organizational policy may require encryption. That's the first thing to check on a work laptop. If a policy requires encryption, a manual decrypt may be undone, or it may cause the device to fall out of compliance.

If you manage devices with [Intune](https://www.m365.fm/entity/intune/), the BitLocker settings live in an endpoint security disk encryption policy. For silent encryption, Microsoft's guidance lists settings such as **Require Device Encryption** set to Enabled. Microsoft's article doesn't say what happens to an encrypted device when you remove or unassign the policy, and it doesn't describe a way to decrypt through Intune. Don't assume that unassigning a policy decrypts anything. Test on one device and read the result with `Get-BitLockerVolume`.

One statement from the Intune article is worth remembering. If you delete the Intune object of a Microsoft Entra joined device that BitLocker protects, Intune syncs and removes the key protectors for the operating system volume, which leaves BitLocker in a suspended state on that volume. Deleting a device record to "clean up" is therefore not harmless.

## Common mistakes

- **Decrypting to fix a boot problem.** Microsoft says decryption isn't a troubleshooting step. Suspend, repair, resume.
- **Forgetting to resume after a suspend.** With `-RebootCount 0` protection stays off until you run `Resume-BitLocker`. Put it on the update checklist.
- **Leaving the recovery key unknown.** If you decrypt and later re-enable BitLocker, you get a new set of protectors. Don't rely on an old printout.
- **Decrypting a laptop with company data.** The drive is then readable by anyone who takes the device. Do this only when policy allows it.
- **Skipping the automatic-key step.** `Disable-BitLocker` refuses to run until the clean-up cmdlet from the list above has removed those keys.
- **Assuming the Intune policy decrypts.** Microsoft's documentation doesn't say that, so verify on a test device.

## Related topics to explore

- Find the recovery key before changes: if a firmware update or hardware change triggers the blue screen, the [recovery key](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/recovery-process) is the only way back in.
- Suspend BitLocker for BIOS and TPM updates: this is the safer alternative to turning encryption off.
- Silent BitLocker deployment with Intune: the settings for TPM, Secure Boot and standard users decide whether encryption starts without a prompt.
- Device Encryption versus BitLocker Drive Encryption: the two features differ by edition, and the difference decides where you manage them.
- Check encryption status across many PCs: `Get-BitLockerVolume` gives you the data for a simple report.

## Next step

To disable BitLocker, decide first whether you need to suspend or to decrypt. Suspend for updates and repairs, and decrypt with `Disable-BitLocker` or `manage-bde -off` only when the drive no longer needs protection and policy allows it. Then check `Get-BitLockerVolume` until the volume reports that decryption has finished.
