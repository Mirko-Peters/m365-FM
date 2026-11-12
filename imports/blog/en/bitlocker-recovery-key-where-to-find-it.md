---
title: "BitLocker Recovery Key: Where to Find It (Account, Entra, IT)"
summary: "Find your BitLocker recovery key in your Microsoft account, work account, a printout or a USB drive, and see how admins retrieve it from Entra ID or Intune."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [bitlocker, microsoft-entra, intune]
keypoints:
  - "Look for the BitLocker recovery key in your Microsoft account at aka.ms/myrecoverykey, or for a work or school device at aka.ms/aadrecoverykey."
  - "Write down the first 8 characters of the key ID on the blue screen so you can pick the right key if your account lists several."
  - "The recovery key is 48 digits long, and Microsoft Support can't retrieve, provide or recreate a lost key for you."
  - "Admins can read keys in the Microsoft Entra admin center or the Intune admin center, and those lookups leave an audit trail."
  - "If no key exists anywhere, the only way back into the device is a reset, and a reset removes all files on the drive."
faq:
  - q: "Where do I find my BitLocker recovery key?"
    a: "On another device, open aka.ms/myrecoverykey and sign in with your Microsoft account. For a work or school device, use aka.ms/aadrecoverykey instead and open Devices, then View BitLocker Keys. Match the key ID shown on the recovery screen. You can also check a printout, a USB drive, or ask your IT department."
  - q: "Can Microsoft Support give me my BitLocker recovery key?"
    a: "No. Microsoft's support article states that Microsoft Support can't retrieve, provide or recreate a lost recovery key. The key lives in your own account, in your organization's directory, or on a printout or USB drive you saved. If you can't find it anywhere, the remaining option is a device reset."
  - q: "How long is a BitLocker recovery key?"
    a: "It's a 48-digit number, shown as eight blocks of six digits separated by hyphens. The recovery screen also shows a key ID, and the first 8 characters of that ID help you pick the matching key when several are stored for one account or device. Type the digits carefully, because the screen checks each block."
---
Your BitLocker recovery key is almost always stored in an account, not on the PC itself. Open `aka.ms/myrecoverykey` on another device and sign in with your Microsoft account. If the PC belongs to your employer or school, use `aka.ms/aadrecoverykey` with your work or school account instead. If neither shows a key, check for a printout or a USB drive, or ask your IT department. This article is for Windows users who just met the blue recovery screen and for admins who get that call from a user. It explains each place to look, how an admin retrieves keys, why the prompt appears, and what happens if no key exists.

## What the recovery key is and why you must note the key ID

The recovery key is a 48-digit number. Microsoft's recovery documentation shows it as eight blocks of six digits, and the boot-time recovery screen checks each block as you type, so most typing errors are caught immediately. [BitLocker](https://www.m365.fm/entity/bitlocker/) asks for the key when it can't open the drive automatically. That happens after a security risk or a hardware change, or when you've forgotten the password for a data drive.

Before you do anything else, write down the first 8 characters of the **recovery key ID** that the screen shows. If your account holds more than one key, for example because the device was re-encrypted once or you own several PCs, the key ID is how you pick the right one. Use your phone camera to take a picture of the screen if you can. It costs nothing, and you'll need the ID twice: once to find the key and once if you call IT.

One more fact to know now. Microsoft's support article says plainly that Microsoft Support can't retrieve, provide or recreate a lost recovery key. Nobody at Microsoft has a copy. That makes the next section important.

## Where to find your BitLocker recovery key

The right place depends on how BitLocker was turned on. Go through the options in this order.

1. **Your Microsoft account.** On another device, open a browser and go to `https://aka.ms/myrecoverykey`. Microsoft's article says the link points to the recovery key page in your account at account.microsoft.com. Sign in with your Microsoft account, find the key ID that matches the one on your screen, and use that key to open the drive. This is the most common case on home PCs, because Device Encryption turns BitLocker on when you sign in with a Microsoft account and attaches the key to that account.
2. **A work or school account.** On another device, go to `https://aka.ms/aadrecoverykey` and sign in with your work or school account. Select **Devices**, expand the device you need, and select **View BitLocker Keys**. Find the key that matches your key ID.
3. **A printout.** If you printed the key when BitLocker was turned on, look where you keep important papers for the device. The printout shows the key ID next to the key.
4. **A USB flash drive.** Plug it into the locked device and follow the on-screen instructions. If the key was saved as a text file on the drive, open the file on a different device.

Two details from Microsoft's article save people a lot of time. First, if someone else set up the device or turned on BitLocker, the key may be in that person's Microsoft account, for example a family member or a former admin. Second, in Windows 11 version 24H2 and later, the recovery screen shows a hint about which Microsoft account is linked to the key. Read that hint before you try accounts at random.

The page also covers devices managed by an organization. For those, your IT department retrieves the key, so don't waste time guessing.

## How admins retrieve the BitLocker recovery key

If you're the helpdesk, you have more options than the user does. Microsoft's BitLocker recovery documentation names the places and roles.

**Microsoft Entra ID.** For devices joined to [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/) or hybrid joined, saving keys to Entra ID is the recommended approach, so that a BitLocker administrator or helpdesk can help users get their keys. The Cloud Device Administrator and Helpdesk Administrator roles are the common choices. A custom role can use the permission `microsoft.directory/bitlockerKeys/key/read`, optionally limited to administrative units. You can read keys in the Microsoft Entra admin center, through the Microsoft Graph API, or with PowerShell.

**Self-service.** By default, users can retrieve the keys of their own devices at `https://myaccount.microsoft.com`: open the **Devices** tab, select the device and choose **View BitLocker Keys**. An admin can switch that off with the setting named **Restrict users from recovering the BitLocker key(s) for their owned devices**. Microsoft's recommendation is to allow self-service only in trusted environments, or otherwise to rely on helpdesk recovery.

**Intune.** In the [Intune](https://www.m365.fm/entity/intune/) admin center, go to **Devices**, then **All devices**. Select the device, and under **Monitor** select **Recovery keys**. Then select **Show Recovery Key**. Microsoft's Intune article says this action creates an audit log entry under the KeyManagement activity, so every lookup is traceable. The same article lists Cloud Device Administrator, Helpdesk Administrator and Global Administrator as roles that can view keys.

**Active Directory.** For domain-joined devices that store keys in AD DS, only Domain Admins can read recovery information by default, though access can be delegated. The BitLocker Recovery Password Viewer, part of the remote server administration tools, adds a **BitLocker Recovery** tab to the computer object. You can also search by the first eight characters of the password ID.

A good helpdesk step is to ask why the prompt appeared before you hand out the key, which the next section explains.

## Why BitLocker asked for the key

Handing over the key solves today's problem. Finding the cause stops the next call. Microsoft lists these triggers:

- An unknown or forgotten PIN, when the device uses a TPM plus PIN.
- A lost startup key, when the device uses a USB startup key.
- Changes to boot files or firmware, such as a BIOS upgrade, or possibly malicious software.
- Moving a drive with an operating system volume and a TPM protector to another device, which binds it to the new TPM and prompts for recovery.

Microsoft's article tells helpdesk staff to find the root cause before they give out the key. Useful starting points are `manage-bde.exe -status` and the event log. If you suspect malware, treat the device as a security case and not as a routine lockout.

After a successful recovery, Windows writes an event to the log, resets the TPM platform validation measurements to match the current configuration, and releases the encryption key. If the prompt keeps coming back, Microsoft says to suspend and resume BitLocker, which resets the validation profile. For devices with automatic recovery password rotation, the password rotates after use, and admins can rotate it on demand from Intune or Configuration Manager. That matters if you pasted a key into a ticket, because the old key stops being valid for that device once it has been rotated.

## If you can't find the key

Check every account you own first, including old ones and the account of whoever set up the PC. Then check the printouts and USB drives. For a managed device, your IT department is the only route.

If you can't find the key and can't undo the change that triggered the prompt, Microsoft's article says you'll need to reset the device using a Windows recovery option. That removes all of your files. The encrypted files can't be read without the key, so don't start a reset until you've asked everyone who could hold it.

## Common mistakes

- **Not writing down the key ID.** Without it, you may try the wrong key from a list of several.
- **Looking in the wrong account.** The key may sit in a Microsoft account you rarely use, in your work account, or in the account of the person who set up the PC.
- **Typing the key on the blue screen from memory.** The 48 digits must be exact. Read them from the other screen and type each block carefully.
- **Resetting the device too early.** A reset deletes your files and is the last resort, not the first.
- **Giving out the key without asking why.** An admin who skips the root cause may face the same prompt next week, or miss a security issue.

## Related topics to explore

- Back up the key before you need it: check now that your Microsoft account or Entra ID shows a key for each device, because that costs two minutes today.
- Device Encryption versus BitLocker Drive Encryption: Windows Home gets Device Encryption, while BitLocker Drive Encryption is available on Pro, Enterprise and Education, as the Microsoft article on [Device Encryption](https://support.microsoft.com/en-us/windows/security/encryption/device-encryption-in-windows) explains.
- Suspend BitLocker before firmware updates: this avoids a recovery prompt after a BIOS or TPM update.
- Rotate recovery keys after use: Intune can rotate a key on demand for supported Windows devices.
- Turn BitLocker off: some users want to decrypt a drive entirely, which has its own steps and risks.

## Next step

To find your BitLocker recovery key, write down the key ID, then check your Microsoft account at `aka.ms/myrecoverykey` or your work account at `aka.ms/aadrecoverykey`. After you're back in, open the same page again and confirm that each of your devices has a key stored, so the next prompt takes two minutes and not two days. Microsoft's article on how to [find your BitLocker recovery key](https://support.microsoft.com/en-us/windows/find-your-bitlocker-recovery-key-6b71ad27-0b89-ea08-f143-056f5ab347d6) is worth bookmarking, and admins should read the [BitLocker recovery process](https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/recovery-process) and the [Intune BitLocker guidance](https://learn.microsoft.com/en-us/intune/device-configuration/endpoint-security/encrypt-bitlocker-windows) once.
