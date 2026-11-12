---
title: "Can't Upgrade to Windows 11? Find the Cause and Fix It"
summary: "Why can't I upgrade to Windows 11? Check TPM 2.0, Secure Boot, UEFI, CPU, RAM, storage and the Windows 10 version, with fixes and options if the PC is blocked."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-update-for-business, trusted-platform-module]
keypoints:
  - "Start with PC Health Check. It tells you which Windows 11 requirement the PC fails, so you don't have to guess."
  - "TPM 2.0 and Secure Boot are the most common blockers, and both are often only switched off in the UEFI firmware."
  - "Check TPM with tpm.msc. Reach the firmware through Settings, Recovery, Advanced startup, Troubleshoot, Advanced options, UEFI Firmware Settings."
  - "A processor that is not on Microsoft's supported list, or less than 4 GB RAM or 64 GB storage, can't be fixed with a setting."
  - "Microsoft does not recommend installing Windows 11 on a device that does not meet the requirements. Other options are extended security updates or a new PC."
faq:
  - q: "Why does my PC say it can't run Windows 11?"
    a: "The PC fails at least one minimum requirement. Common reasons are TPM 2.0 switched off or missing, Secure Boot not enabled, legacy BIOS mode instead of UEFI, an unsupported processor, or too little memory or storage. Run the PC Health Check app, which shows which requirement fails, then fix the one it names."
  - q: "How do I check if my PC has TPM 2.0?"
    a: "Press the Windows key and R, type tpm.msc and select OK. If TPM is ready, look at Specification Version under TPM Manufacturer Information. If you see Compatible TPM cannot be found, the TPM may be disabled in the firmware. You can also look under Windows Security, Device security, Security processor."
  - q: "What can I do if my PC can't upgrade to Windows 11?"
    a: "Microsoft recommends either enrolling in consumer Extended Security Updates for Windows 10, which Microsoft says protects devices until October 12, 2027, or moving to a new Windows 11 PC. Microsoft does not recommend installing Windows 11 on hardware that doesn't meet the requirements."
---
If you can't upgrade to Windows 11, the PC almost always fails one of a short list of requirements: TPM 2.0, Secure Boot, UEFI boot mode, the processor, memory, storage or the Windows 10 version. The fastest way to find out which one is to run the **PC Health Check** app and read what it says. Some causes are only a firmware setting, and some mean the hardware is too old. This article is for Windows users who got the message "This PC can't run Windows 11" and for help desk staff who need a checklist. You'll find how to read the result, how to fix each cause, what to do when a fix isn't possible, and how admins find out which devices are blocked.

Don't change anything until you know which requirement fails. Switching a random firmware option can make a PC unbootable, and it may not even be the option that's causing the problem.

## Find out which requirement fails

Microsoft's FAQ on upgrading to Windows 11 says a device must meet the minimum system requirements. Two checks exist:

- **Windows Update.** In Windows 10, Windows Update checks whether the device meets the requirements and shows when the upgrade is ready.
- **PC Health Check.** Download the app from Microsoft's Windows 11 page and run the check. Per the Installation Assistant flow on Microsoft's page Ways to install Windows 11, you can run PC Health Check and select **Refresh** in the Assistant to update its result.

If setup shows a message titled "What needs your attention", the device may not meet the requirements. The Installation Assistant can also say that the PC doesn't meet the minimum system requirements. In that case Microsoft recommends staying on Windows 10.

Now compare the result with Microsoft's list on the [Windows 11 requirements](https://learn.microsoft.com/en-us/windows/whats-new/windows-11-requirements) page:

- **Processor:** 1 GHz or faster with two or more cores, on a compatible 64-bit processor or system on a chip.
- **RAM:** 4 GB or more.
- **Storage:** 64 GB or more of available disk space.
- **Graphics:** DirectX 12 or later, with a WDDM 2.0 driver.
- **Firmware:** UEFI, Secure Boot capable.
- **TPM:** version 2.0.
- **Display:** 720p, 9 inches or larger, 8 bits per color channel.
- **Internet and account:** Windows 11 Home needs an internet connection and a Microsoft account for first-time setup.
- **Windows 10 base:** version 2004 or later with the September 14, 2021 security update or later, for a direct upgrade.

## Cause 1: TPM 2.0 is off or missing

A TPM, or Trusted Platform Module, is a security chip or firmware feature. Windows 11 needs version 2.0. Microsoft notes it supports features such as Windows Hello and BitLocker. The page on [enabling TPM 2.0](https://support.microsoft.com/en-us/windows/security/devicesecurity/enable-tpm-2-0-on-your-pc) says many retail motherboards ship with TPM switched off, although it's usually possible to turn on. See the [Trusted Platform Module](https://www.m365.fm/entity/trusted-platform-module/) page for background.

**Check it.** There are two ways:

1. Press **Windows key + R**, type `tpm.msc` and select **OK**. If you see "Compatible TPM cannot be found", the TPM may be disabled. If it's ready, look at **Specification Version** under TPM Manufacturer Information. It should say 2.0.
2. Go to **Settings** > **Update & Security** > **Windows Security** > **Device Security**. If there's no Security processor section, the TPM may be disabled. If **Security processor details** appears, check that the Specification version is 2.0.

**Enable it.** Microsoft's path to the firmware settings:

1. Go to **Settings** > **Update & Security** > **Recovery** and select **Restart now** under Advanced startup.
2. Select **Troubleshoot** > **Advanced options** > **UEFI Firmware Settings** > **Restart**.
3. In the firmware, look for TPM settings under **Advanced**, **Security** or **Trusted Computing**.
4. Turn on the option. The name varies: Security Device or Security Device Support, TPM State, AMD fTPM switch or AMD PSP fTPM on AMD systems, and Intel PTT or Intel Platform Trust Technology on Intel systems.
5. Save, restart and check again with `tpm.msc`.

If you can't find the setting, use your manufacturer's support pages. Microsoft's article links to resources for Asus, Dell, HP, Lenovo and Surface. Firmware menus differ a lot between makers, and a wrong change can have effects you didn't expect, so go slowly and note every value before you change it.

## Cause 2: Secure Boot is off or the PC boots in legacy mode

Secure Boot allows only trusted, digitally signed software to run at startup. Microsoft's page Windows 11 and Secure Boot says that for the upgrade from Windows 10 the PC must be Secure Boot capable, which means UEFI is enabled.

The same page explains the common trap: the boot mode. You may need to switch from Legacy BIOS, also called CSM, to UEFI. If both UEFI and Legacy/CSM are offered, UEFI has to be the first or only option. Go to the firmware the same way as above (**Settings** > **System** > **Recovery** > **Restart now** under Advanced startup > **Troubleshoot** > **Advanced options** > **UEFI Firmware Settings** > **Restart**), change the mode, then enable Secure Boot. If a PC refuses to show a Secure Boot option, the boot mode is the first thing to look at.

Microsoft says you may need to disable Secure Boot temporarily to fix a different problem, and you should turn it back on afterwards.

One catch: a PC that was installed in legacy mode usually uses an old disk layout (MBR). Switching the firmware to UEFI without converting the disk can leave Windows unable to start. That's the next cause.

## Cause 3: The disk uses the old MBR layout

If the firmware has to run in UEFI mode, the system disk needs GPT partitioning. Microsoft's tool for the conversion is `MBR2GPT`, described on Microsoft Learn's page [MBR2GPT.EXE](https://learn.microsoft.com/en-us/windows/deployment/mbr-to-gpt). Key facts from that page:

- It converts a system disk from MBR to GPT without modifying or deleting the data on the disk.
- `/validate` checks whether the disk is eligible without converting it. `/convert` validates and converts.
- By default it runs from a Windows PE command prompt. The `/allowFullOS` option allows it in the full Windows.
- It needs at most three primary partitions and no extended or logical partitions.
- After the conversion, the firmware must be switched to UEFI mode, and the disk can then only boot in GPT mode. Microsoft's own output says the changes can't be undone.
- A disk with BitLocker volumes can be converted only if protection is suspended.

The page doesn't ask for a backup, but make one anyway. The order that works: run `/validate` first, back up, convert, then switch the firmware to UEFI and confirm that Windows starts. Don't do this on a PC that holds irreplaceable data and has no backup.

## Cause 4: The processor isn't on the list

This is the cause you can't fix with a setting. Microsoft publishes lists of supported processors. Microsoft's page on supported Intel processors covers the Intel Core line from the 8th through the 14th generation, plus some Core X-series, Celeron, Pentium and Xeon families. It notes that future generations that meet the same principles count as supported even if they aren't listed yet. The Core listing starts at the 8th generation, so an older Core chip is not on it, however fast it feels.

Microsoft's page doesn't explain why a given model is excluded beyond saying the listed processors meet its design principles for security, reliability and the minimum requirements. For anything else, ask the hardware vendor. I haven't opened the AMD list, so check that page directly if you run a Ryzen system.

If the check says the processor isn't supported, no setting will change that. The vendor of your PC is the right place to ask whether a newer model of the same line is supported.

## Cause 5: Memory, storage, graphics or the Windows 10 version

- **RAM below 4 GB.** Upgrade the memory if the PC allows it, or retire the PC.
- **Less than 64 GB available.** Microsoft's FAQ tells you to free up disk space if the drive is low. Move files to OneDrive, remove old apps, or use a larger drive.
- **Graphics.** DirectX 12 and a WDDM 2.0 driver are required. Updating the graphics driver is the first thing to try.
- **Windows 10 too old.** A direct upgrade needs version 2004 or later with the September 14, 2021 update. Microsoft's end-of-support page says only Windows 10 PCs running version 22H2 that meet the hardware specs can upgrade for free. Install the pending Windows 10 updates first.
- **S mode.** Windows 11 Home supports S mode. Other editions in S mode must switch out of S mode first, which needs internet and can't be undone.

## When the PC qualifies but the upgrade doesn't appear

The hardware may be fine and Windows Update still shows nothing. Try these in order:

1. Open **Settings** > **Update & Security** > **Windows Update**, select **Check for updates**, install anything pending and restart.
2. Run the Windows 11 **Installation Assistant**. Microsoft says it can be used even before Windows Update offers the upgrade, although it recommends waiting.
3. Use installation media with **Run setup.exe** and **Keep personal files and apps**.

Microsoft's guidance for admins adds that devices don't upgrade automatically unless an administrator configures a Target Version, so a managed PC may simply have no policy telling it to upgrade.

## If the PC can't be fixed

Microsoft's page does not recommend installing Windows 11 on a device that doesn't meet the requirements. Guides online describe registry changes and modified install media that skip the checks. I won't walk through them: Microsoft doesn't support them, and I couldn't verify what they do to security updates on a Microsoft page. If you take that route anyway, you accept the risk, you need a full backup and you should expect to maintain the PC yourself.

Microsoft's page [Windows 10 support has ended](https://support.microsoft.com/en-us/windows/deployment/updates-lifecycle/windows-10-support-has-ended-on-october-14-2025) describes the supported options:

- **Consumer Extended Security Updates.** Microsoft says it protects Windows 10 devices until October 12, 2027. The page doesn't give enrollment steps or prices, and links to a separate page for them.
- **A new Windows 11 PC.** Microsoft lists Copilot+ PCs, Surface devices and devices from other makers.
- **Trade in or recycle** the old PC.

Windows 10 support itself ended on October 14, 2025. The PC keeps working, but it no longer gets free security fixes through Windows Update, and Microsoft says the risk from malware grows.

## For admins: find the blocked devices

Don't check PCs one by one. Per Microsoft's page on upgrading devices to Windows 11 with Intune, Endpoint analytics shows which devices meet the hardware requirements and which requirement they miss. In the Work from anywhere report, the Windows tab lists the readiness of each device. Devices must be Intune-managed, co-managed, or have the Configuration Manager client with tenant attach.

A feature update policy has a checkbox, "When a device isn't capable of running Windows 11, install the latest Windows 10 feature update". It lets one policy move capable devices to Windows 11 and keep incapable ones current. You can't add it to an existing policy. Without it, devices that don't meet the requirements stay on their current Windows 10 version. Use [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/) rings so the first group is small.

## Common mistakes

- Changing firmware settings before reading what PC Health Check reports.
- Switching to UEFI without converting an MBR disk, then wondering why Windows won't start.
- Converting the disk with no backup. Microsoft says the change can't be undone.
- Assuming a fast CPU is a supported CPU.
- Forgetting to install pending Windows 10 updates before checking again.
- Leaving a PC on Windows 10 without a plan after the end of support.
- Trying bypass guides on a work PC.

## Related topics to explore

- **How to upgrade to Windows 11 when the PC qualifies.** The three routes and the 10-day return window.
- **Secure Boot certificate updates.** Microsoft says certificates from 2011 begin to expire in June 2026, and that supported Windows versions handle it automatically.
- **TPM in business.** The role of the [Trusted Platform Module](https://www.m365.fm/entity/trusted-platform-module/) for BitLocker and Windows Hello.
- **Extended Security Updates for Windows 10.** Who qualifies and for how long.
- **Hardware refresh planning.** Use readiness reports to budget replacements instead of reacting to each ticket.

## Next step

Run PC Health Check, write down the one requirement that fails and fix only that, starting with TPM and Secure Boot because they are the most likely to be a setting. If you're still asking why you can't upgrade to Windows 11 after that, the hardware is probably the answer, and the ESU or new PC options are the way forward.
