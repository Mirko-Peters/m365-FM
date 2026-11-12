---
title: "How to Upgrade to Windows 11: Steps, Requirements and Rollback"
summary: "How to upgrade to Windows 11 from Windows 10: check requirements, use Windows Update, the Installation Assistant or install media, and roll back within 10 days."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-update-for-business]
keypoints:
  - "The upgrade from Windows 10 to Windows 11 is free, but the PC must meet the Windows 11 minimum requirements, including TPM 2.0 and Secure Boot capable UEFI."
  - "The recommended route is Windows Update: open Settings, Update & Security, Windows Update, select Check for updates, then Download and install."
  - "If Windows Update doesn't offer the upgrade, use the Windows 11 Installation Assistant or run setup from installation media with Keep personal files and apps."
  - "After the upgrade you have 10 days to return to Windows 10 and keep your files, so don't clean up old files too early."
  - "Back up before you start. Some apps are removed during the upgrade, and some of them can't be reinstalled."
faq:
  - q: "How do I upgrade from Windows 10 to Windows 11 for free?"
    a: "Check that your PC meets the requirements with the PC Health Check app, back up your files, then open Start, Settings, Update & Security, Windows Update and select Check for updates. If the upgrade is offered, select Download and install and accept the license terms. Microsoft states that the upgrade from Windows 10 is free."
  - q: "Will I lose my files when I upgrade to Windows 11?"
    a: "By default your files and data move to the new installation. Microsoft still recommends a backup before any Windows upgrade, for example to OneDrive. Some apps are uninstalled before the upgrade, and a few that don't work on Windows 11 can't be reinstalled. A clean install from media erases the drive."
  - q: "Can I go back to Windows 10 after upgrading?"
    a: "Yes, for 10 days. Microsoft says you can return to Windows 10 within that period and keep the files and data that were migrated. After 10 days you need to back up your files manually and do a clean install of Windows 10. Keep this window in mind before you delete old files."
---
To upgrade to Windows 11, check that your PC meets the requirements, back up your files, then go to **Start** > **Settings** > **Update & Security** > **Windows Update** on Windows 10 and select **Check for updates**. When the Windows 11 upgrade shows up, select **Download and install** and follow the prompts. The upgrade is free. This article is for Windows users who want to move one PC, and for admins who need a plan for many. You'll see the requirements, three ways to upgrade, what stays on the PC, how to roll back, and how admins handle it at scale.

One date matters more than any other: Microsoft's FAQ says support for Windows 10 ended on October 14, 2025. After that, there are no free updates through Windows Update, no technical assistance and no security fixes. The PC still runs, but Microsoft recommends moving to Windows 11. If your PC can't make the move, the next article in this series covers the reasons.

## Check whether your PC can upgrade

Microsoft says the device must meet the Windows 11 minimum requirements. According to its page on [Windows 11 requirements](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements), these are:

- **Processor:** 1 GHz or faster with two or more cores, on a compatible 64-bit processor or system on a chip.
- **Memory:** 4 GB or more.
- **Storage:** 64 GB or more of available disk space. Microsoft adds that more may be needed over time for updates and certain features.
- **Graphics:** compatible with DirectX 12 or later, with a WDDM 2.0 driver.
- **System firmware:** UEFI, Secure Boot capable.
- **TPM:** Trusted Platform Module version 2.0.
- **Display:** high definition (720p), 9 inches or larger, 8 bits per color channel.
- **Internet:** needed for updates and some features. Windows 11 Home needs an internet connection and a Microsoft account for first-time setup.

For a direct upgrade from Windows 10, the same page asks for Windows 10 version 2004 or later with the September 14, 2021 security update or later installed. S mode is supported only on Windows 11 Home. Other editions in S mode must leave S mode first, and you can't switch back afterwards.

There are two ways to check:

1. **Windows Update.** In Windows 10, Windows Update checks whether the device meets the requirements. When the check finishes, it shows that the upgrade is ready to install.
2. **PC Health Check.** Microsoft's recommended tool for Windows 10 devices. Download it from Microsoft's Windows 11 page and run the check.

If you see a message called "What needs your attention" during an upgrade attempt, the device may not meet the requirements. Microsoft's installation page says plainly that it isn't recommended to install Windows 11 on a device that doesn't meet them.

## Prepare before you start

Microsoft's [Upgrade to Windows 11 FAQ](https://support.microsoft.com/en-us/windows/deployment/install-upgrade/upgrade-to-windows-11-faq) lists what to do first:

1. Decide which device will run Windows 11.
2. Sign in to Windows 10 with a Microsoft account.
3. Back up files and data, for example to OneDrive. Files already synced to OneDrive may not need an extra backup.
4. Free up disk space if the drive is low.

Two extra steps that aren't on Microsoft's page but are cheap insurance: write down the license details of paid apps, and make sure you have the BitLocker recovery key if the drive is encrypted. Both are easier before the upgrade than after.

The FAQ also tells you what to expect for apps. Most software and accessories that worked on Windows 10 are expected to work on Windows 11, but confirm with the publisher or manufacturer. Some apps are uninstalled before the upgrade because they cause upgrade problems, and you can reinstall those afterwards. Others are removed because they don't work correctly on Windows 11, and those can't be reinstalled. For those, ask the publisher for a Windows 11 version.

By default, files and data move to the new Windows 11 installation.

## How to upgrade to Windows 11: the three routes

Microsoft's page [Ways to install Windows 11](https://support.microsoft.com/en-us/windows/ways-to-install-windows-11-e0edbbfb-cfc5-4011-868b-2ce77ac7c70e) lists three methods. Use them in this order.

### 1. Windows Update (recommended)

This is the easiest one, and the one Microsoft recommends. Wait until Windows Update says the upgrade is ready.

1. Go to **Start** > **Settings** > **Update & Security** > **Windows Update**.
2. Select **Check for updates**. If updates for your current version are pending, install them, restart, and check again.
3. Select **Download and install**, then **Accept and install** in the Software License Terms window.
4. When the status shows a pending restart, select **Restart now**. The PC restarts several times.
5. Sign in to finish.

The FAQ says the download time depends on your internet speed and the upgrade usually takes longer than a normal Windows 10 feature update. You can keep using the PC while it downloads, and after the download you can schedule the installation for a time when you aren't working. Microsoft also mentions that large downloads over a metered connection may cost money.

### 2. Windows 11 Installation Assistant

Use this when Windows Update doesn't offer the upgrade, although your PC passes the check. Download the Installation Assistant from Microsoft's Windows 11 download page. Microsoft advises you to wait for Windows Update first, but says the app can be used earlier. The Assistant shows one of three results:

- **Install Windows 11.** Select **Accept and install**, then **Restart now** when asked, and sign in after the restarts.
- **Use the PC Health Check app.** Run PC Health Check, then select **Refresh** in the Assistant.
- **"This PC doesn't meet the minimum system requirements."** Microsoft recommends staying on Windows 10, whose support ended on October 14, 2025.

### 3. Installation media

Microsoft's page on creating installation media for Windows describes the media. You need a PC with a reliable internet connection and a blank USB drive with at least 8 GB. Everything on the USB drive is deleted. A product key may be needed, but digital licenses don't require one. Go to the Windows 11 download site, select **Download Now** under "Create Windows 11 Installation Media" to get `MediaCreationTool.exe`, run it and follow the prompts. The page also mentions an ISO file, for virtual machines or for burning to a DVD.

You can use the media in two ways:

**Run setup from the current Windows (keeps files).**

1. Sign in, insert the media and select **Run setup.exe** in the pop-up. If no pop-up appears, open File Explorer, select **This PC**, right-click the media and choose **Install or run program from your media**.
2. On the **Ready to install** page, select **Change what to keep**.
3. Choose **Keep personal files and apps** (the default), **Keep personal files only**, or **Nothing**. Nothing deletes everything, so back up first.

**Boot from the media (clean install).** Microsoft's warning: this method completely wipes the contents of the hard drive. Back up first, run PC Health Check in the current Windows, shut down, insert the media, power on and open the boot menu. The key depends on the manufacturer, usually F1 to F12 or DEL. Select the media and follow the Windows 11 Setup steps.

A clean install is the right choice for a PC that has been slow and cluttered for years. For a PC that works fine, the in-place upgrade saves hours.

## Upgrade versus update

People mix the words, and Microsoft's FAQ separates them. An **upgrade** moves a device to a later Windows version, for example from Windows 10 to Windows 11. An **update** installs the latest features and security improvements for the version you already have. The "Windows 11 update" you see in Settings after you're on Windows 11 is the second kind, and it doesn't ask you to repeat any of the steps above.

## Rolling back within 10 days

After you upgrade, you have 10 days to return to Windows 10 and keep the files and data that were migrated. After 10 days, back up your files manually, for example to OneDrive, and then do a clean install of Windows 10. Microsoft's FAQ doesn't describe the steps for going back, and I didn't find them on the pages I opened, so look at the recovery options in Windows 11 Settings or ask your IT team before the 10 days run out.

Practical advice for the 10 days: test your key workflows in the first two days. Print, scan, VPN, the apps that you use every day, and anything tied to a hardware dongle. If something fails, you still have a way back. Be careful with disk cleanup tools in that period. Microsoft doesn't say what they remove, and the return depends on files from the old installation staying in place.

## For admins: upgrading many PCs

Windows 10 and Windows 11 can be managed side by side. Microsoft's guide to preparing for Windows 11 says existing management tools and processes can generally manage both, and that you should check with the vendors of non-Microsoft security or data loss prevention software to confirm Windows 11 compatibility.

Devices don't upgrade automatically unless an administrator sets it up. The guide names several tools:

- **[Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)** with the Target Version capability, set through policy or Windows Autopatch. Microsoft says feature update deferrals alone don't move devices between products.
- **Microsoft Intune** feature update deployments. Per Microsoft's page on [upgrading devices to Windows 11 with Intune](https://learn.microsoft.com/en-us/intune/device-updates/windows/upgrade-to-windows-11), you pick the Windows 11 version in the Feature update to deploy list. A checkbox, "When a device isn't capable of running Windows 11, install the latest Windows 10 feature update", lets one policy upgrade eligible devices and keep ineligible ones current on Windows 10. You can't add that checkbox to an existing policy. You delete the policy and create a new one.
- **WSUS and Configuration Manager.** Sync the Windows 11 product category, accept the license terms on behalf of your users, and note that there is no x86 option because Windows 11 doesn't support 32-bit.

For readiness, Intune's Endpoint analytics shows which managed devices meet the hardware requirements and which requirement they miss. Start with a pilot group, then widen in rings: a small preview ring, a limited ring of early adopters, then broad deployment. Write a short note for users that says what will change and when, and update the help desk guides with new screenshots.

## Common mistakes

- Skipping the compatibility check and finding out halfway through setup.
- Starting without a backup, then discovering that an app was removed.
- Choosing **Nothing** on the "Change what to keep" screen by accident.
- Booting from install media for a "simple upgrade", which wipes the drive.
- Deleting old files within 10 days and then wanting to roll back.
- Installing on a device that doesn't meet the requirements. Microsoft doesn't recommend it.
- Assuming that deferring feature updates moves devices to Windows 11. Without a Target Version or a feature update policy for Windows 11, nothing happens.

## Related topics to explore

- **Why you can't upgrade to Windows 11.** Look at TPM, Secure Boot and processor reasons, and what each fix involves.
- **Windows 11 requirements for new hardware purchases.** A short checklist you can give to buyers.
- **Bootable USB drives.** How to create and boot from installation media.
- **Windows Update for Business policies.** Feature update policies, Target Version and rings, covered on the [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/) page.
- **Windows 10 end of support planning.** What the end of free updates means for the PCs that stay behind.

## Next step

Run PC Health Check on one PC today and write down the result. If it passes, back up your files and start with Windows Update, because that's the route Microsoft recommends. If you plan to upgrade to Windows 11 across a team, try the same steps on one pilot PC first and keep the 10-day return window in mind.
