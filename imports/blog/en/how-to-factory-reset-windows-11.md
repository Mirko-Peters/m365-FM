---
title: "How to Factory Reset Windows 11: Every Method Explained"
summary: "How to factory reset Windows 11 from Settings or recovery: keep or remove files, cloud or local reinstall, BitLocker keys, backup and what to do afterwards."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [intune, windows-autopilot, bitlocker]
keypoints:
  - "To factory reset Windows 11, open Settings, System, Recovery and select Reset PC under Recovery options. Then choose Keep my files or Remove everything."
  - "Keep my files removes apps and settings but keeps personal data. Remove everything wipes files, apps and settings, and the optional Clean data step makes recovery harder."
  - "Cloud download pulls a fresh copy of Windows with the latest updates. Local reinstall uses files already on the PC and can be faster, but may not include recent updates."
  - "If Windows won't start, open the Windows Recovery Environment and choose Troubleshoot, then Reset this PC. Keep your BitLocker recovery key ready."
  - "Work devices managed with Intune can use Autopilot Reset, which keeps the Entra ID connection and the management enrollment."
faq:
  - q: "Does a factory reset delete everything on Windows 11?"
    a: "It depends on the option. Keep my files reinstalls Windows and removes apps and settings but keeps your personal files. Remove everything deletes personal files, apps and settings. Files stored in OneDrive or other cloud services are not removed from the cloud, but copies on the PC are. Back up first either way."
  - q: "How long does a factory reset of Windows 11 take?"
    a: "Microsoft says recovery options typically take 30 minutes to 2 hours, and lighter options take less. During a reset the screen can stay black for a long time, sometimes more than 15 minutes, and the PC may restart on its own. Don't restart it manually, because that could make the reset fail."
  - q: "What do I need if the drive is encrypted with BitLocker?"
    a: "Have your BitLocker recovery key ready before you start, because some recovery steps ask for it. For a personal device, sign in to the linked Microsoft account on another device and look up the 48-digit key there. For a work device, ask IT. Microsoft Support can't retrieve or recreate a lost key."
---
To factory reset Windows 11, open **Settings**, go to **System**, then **Recovery**, and select **Reset PC** under Recovery options. Windows asks whether to keep your files or remove everything, and then reinstalls itself. This article is for Windows users and help desk staff who need to wipe a PC clean, fix one that has gone bad, or hand one over to someone else. It explains which options to pick, how to protect your data first, what to do when the PC won't start and how the process differs on a work device.

## Is a factory reset really what you need?

A reset is the heavy tool. Microsoft's page on [recovery options in Windows](https://support.microsoft.com/en-us/windows/experience/backup-recovery/recovery-options-in-windows) lists the options for a PC that still starts, in order from least to most disruptive. Run through them before you wipe anything:

1. Run a troubleshooter, under **Settings**, **System**, **Troubleshoot**, **Other troubleshooters**.
2. Reinstall Windows through Windows Update. This keeps your files, apps and settings and is available on Windows 11, version 22H2 or later.
3. Uninstall a recent Windows update, if the problem began right after one.
4. Use a point-in-time restore, which rolls the whole PC back to an automatic restore point. Microsoft lists it for Windows 11, version 24H2 or later.
5. Reset this PC.
6. Cloud rebuild, which reinstalls Windows and drivers from a fresh copy and removes personal files, apps and settings.

If the problem began after an upgrade, there is also the option to go back to the previous version. It's available for 10 days after upgrading. Personal files stay, but apps, drivers and settings added or changed after the upgrade are removed.

A reset makes sense when the system is slow in ways nothing explains, when updates keep failing, when you suspect the install itself is damaged, or when the PC changes owner. It's also what you do when you hand a laptop back to the company. Whatever the reason, the same rule applies: a reset takes things away, so decide what you want to keep first.

## Back up before you reset

Microsoft's own advice is short: back up important files first. How you do it is up to you, but there are three practical routes.

**Windows Backup** is the built-in app. According to Microsoft's page on Windows Backup, it can back up your Desktop, Documents, Pictures, Videos and Music folders to OneDrive, plus your installed apps list, Wi-Fi networks and passwords, and personalization and other Windows settings. It needs a personal Microsoft account and a free account has 5 GB of OneDrive storage. Work or school accounts do not work with the Windows Backup app. Microsoft Edge favorites and preferences are not included; Edge needs its own sync. To change the settings later, go to **Settings**, **Accounts**, **Windows backup**.

When you set up the PC again, sign in with the same Microsoft account. Setup detects the backup and offers a **Restore** option. Store apps can be reinstalled from their pins, and apps from outside the Store send you to the web to download an installer.

**OneDrive folder sync** keeps the files themselves in the cloud. Before you reset, open OneDrive and wait until sync is finished. Files that are only on the PC and have not uploaded are gone after the reset.

**An external drive** is the plain option. Copy Documents, Pictures, Desktop and Downloads, and don't forget the files that live outside the normal folders: browser exports, project folders on a second drive, and license files. Open a few files from the copy to check they work, then eject the drive safely and put it aside.

## Reset this PC from Settings, step by step

Microsoft documents the same four steps for Windows 11 on the [Reset your PC](https://support.microsoft.com/en-us/windows/experience/backup-recovery/reset-your-pc) page.

1. Open **Settings**, then select **System** and **Recovery**.
2. Under **Recovery options**, select **Reset PC**.
3. Choose your options, which are covered in the next section.
4. Follow the on-screen instructions.

Plug in a laptop before you start. The page warns that the screen may stay black for a long time, occasionally more than 15 minutes, and that the device may restart on its own. Don't restart it by hand during the reset, because that could cause it to fail. Microsoft says the recovery options typically take 30 minutes to 2 hours, and lighter options take less time.

If the drive is encrypted with BitLocker, have the recovery key ready. Microsoft's page [Find your BitLocker recovery key](https://support.microsoft.com/en-us/windows/security/encryption/find-your-bitlocker-recovery-key) lists the places to look: your Microsoft account at `aka.ms/myrecoverykey` for a personal device, `aka.ms/aadrecoverykey` for a work or school account, a printout, a USB drive, or your IT department. Note the first 8 digits of the key ID on the recovery screen so you can match the right key. Microsoft Support can't retrieve or recreate a lost key. If you manage [BitLocker](https://www.m365.fm/entity/bitlocker/) for a team, store those keys somewhere your help desk can reach before the day someone needs them.

## Which options should you pick?

The first choice is what to do with your files.

- **Keep my files** reinstalls Windows and keeps documents, photos and other personal data. It removes apps and settings. Under it you can choose **Restore preinstalled apps** to reapply the PC manufacturer's customizations.
- **Remove everything** reinstalls Windows and wipes the device. Personal files, apps and settings are removed. This is the option for a fresh start or for giving the PC away.

Under **Remove everything** there is also **Clean data**. It erases files and cleans the drive. It takes longer, but it makes files harder to recover, and Microsoft recommends it before you donate, recycle or sell the PC. Microsoft also says the erasure is aimed at consumers and doesn't meet government or industry standards. If you need a documented wipe for compliance, that is a job for your organization's own process, not for this checkbox.

The second choice is how Windows gets reinstalled.

- **Cloud download** downloads a fresh copy of Windows. It includes the latest updates and helps when local files are corrupted or missing.
- **Local reinstall** uses the files already on the PC. It's faster on a slow connection but may not include the latest updates.

A simple rule: if you suspect damaged system files, choose cloud download. If the connection is poor and the PC otherwise works, local reinstall is fine, and you'll install updates afterwards. Microsoft's page doesn't say where in the flow this choice appears, and the order of screens can differ between PCs, so read each screen before you confirm.

## When Windows 11 won't start

If you can't reach Settings, you work from the Windows Recovery Environment (WinRE). Microsoft's page on the Windows recovery environment describes the ways in. If Windows fails to start correctly several times, it enters WinRE on its own. You can also force it: turn on the PC, and when the Windows or manufacturer logo appears, hold the power button to shut it down. Do this twice. On the third start, Windows should show the **Automatic Repair** screen, where you select **Advanced options**.

From WinRE, select **Troubleshoot**, then **Reset this PC**. The same keep-or-remove choices apply. If the device is encrypted, you'll need the BitLocker key to finish. On the same menu you'll also find Startup Repair, Uninstall Updates, System Restore and **UEFI Firmware Settings**.

The recovery options page adds two more routes for a PC that won't start. **Cloud rebuild** is under **Troubleshoot**, **Cloud rebuild**, or in Windows under **Settings**, **System**, **Recovery**, **Rebuild PC**. It is a Windows 11 option. And if the recovery image on the PC is gone, you can reinstall from recovery media: the manufacturer's recovery image, or installation media you made on another PC. Microsoft describes a bootable USB drive of at least 8 GB for that. A clean install from media removes everything.

For a damaged startup rather than a damaged system, try Startup Repair before you reset. Microsoft's Startup Repair page says it can fix missing or damaged system files, corrupted boot configuration data, a damaged master boot record, incompatible drivers and registry errors. It's under **Troubleshoot**, **Advanced options**, **Startup Repair** in WinRE.

## Work devices: Intune and Autopilot Reset

If the PC belongs to an organization, don't reset it on your own and call it done. A standard reset with Remove everything wipes the device, and the user lands in setup like on any new PC.

Microsoft's [Windows Autopilot Reset](https://learn.microsoft.com/en-us/autopilot/windows-autopilot-reset) is built for this. It returns a device to a business-ready state: it removes personal files, apps and settings, and it keeps the Microsoft Entra ID connection, the MDM enrollment, Wi-Fi details and previously applied provisioning packages. [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/) Reset can be local or remote:

- A **local reset** is started at the device by an admin. The policy must be enabled first, because it's disabled by default. At the lock screen, press `CTRL` + `WIN` + `R`, then sign in with an account that has local admin credentials.
- A **remote reset** is started through MDM. In the [Intune](https://www.m365.fm/entity/intune/) admin center, go to **Devices**, **All devices**, select the devices, choose **More** and select **Autopilot Reset**. The device must be MDM-managed and Entra-joined.

There are limits. Microsoft says Autopilot Reset is not supported on Microsoft Entra hybrid joined devices or Surface Hub, which need a full device wipe. Windows RE must be enabled, or the reset fails immediately with error `0x80070032`. You check and enable it with `reagentc.exe /enable`.

## After the reset

Sign in, connect to the internet and open **Windows Update**. If you used a local reinstall, expect updates to install, because that route may not include the latest ones. Then restore your data: sign in to OneDrive, run the restore step during setup if you used Windows Backup, or copy your files back from the external drive. Reinstall the apps that are not from the Store, and check that your printer and other devices work.

If you reset the PC because of a suspected infection, don't treat the reset as the only step. Microsoft's pages describe the reset as a reinstall of Windows, and they don't promise that it removes every kind of malware. Change your passwords from a different, clean device, and check the other places the PC had access to.

## Common mistakes

- Starting the reset without a backup, then realising the project folder was on the Desktop of a second user profile.
- Picking Keep my files and expecting your apps to survive. They don't. Only the personal files stay.
- Not having the BitLocker key ready. Without it you can be stuck at the recovery screen, and Microsoft can't recreate it.
- Restarting the PC because the screen has been black for ten minutes. Microsoft says that can cause the reset to fail.
- Selling or donating a PC after a reset without choosing Remove everything and Clean data.
- Resetting a managed work laptop by hand instead of using Autopilot Reset or Intune.

## Related topics to explore

- What if the PC doesn't start at all? The article on how to open the BIOS in Windows 11 shows how to reach firmware settings and the boot menu.
- How do I reinstall from scratch? A Windows 11 bootable USB lets you do a clean install, as Microsoft describes it, which removes everything.
- How do I set up a new PC after a reset? Autopilot can configure it for a business user without a custom image.
- Where do I get an ISO to rebuild from? The Windows 11 ISO download article covers Microsoft's disk image and the hash check.

## Next step

Make a backup today, find your BitLocker key, and decide between Keep my files and Remove everything before you click anything. When you know that, the steps to factory reset Windows 11 take a few minutes, and the rest is waiting.
