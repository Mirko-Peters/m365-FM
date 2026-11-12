---
title: "Windows 11 Bootable USB: How to Create One Step by Step"
summary: "Create a Windows 11 bootable USB with Microsoft's Media Creation Tool or by hand, fix the 4 GB file problem, and boot a PC from the drive without surprises."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-autopilot]
keypoints:
  - "A Windows 11 bootable USB needs a blank drive of at least 8 GB, a 64-bit PC to create it on and an internet connection. Everything on the drive is erased."
  - "The easiest route is Microsoft's Media Creation Tool: choose language, edition and 64-bit, pick USB flash drive and let the tool write the media."
  - "You can also format a drive as FAT32 and copy the contents of the Windows 11 ISO onto it. If install.wim is larger than 4 GB, split it with DISM."
  - "To boot from the drive, open the boot menu (often F2, F12, Delete or Esc) and pick the USB stick. If it doesn't show up, check the boot order and Secure Boot settings."
  - "Fleet deployments usually don't need USB media. Windows Autopilot configures new devices over the network."
faq:
  - q: "How big does a USB drive need to be for Windows 11?"
    a: "Microsoft asks for a blank USB flash drive with at least 8 GB for the Media Creation Tool. Anything stored on the drive is deleted when the media is created. Microsoft's manual method for manufacturers lists 5 GB of free space, but 8 GB is the safe choice because it covers the tool's requirement and leaves some room."
  - q: "Can I make a Windows 11 bootable USB without the Media Creation Tool?"
    a: "Yes. Download the Windows 11 ISO from Microsoft, format a USB drive as FAT32, mark the partition active and copy the full contents of the ISO onto the drive. If sources\\install.wim is larger than 4 GB, split it into install.swm files with DISM so it fits on FAT32."
  - q: "Why doesn't my PC boot from the USB drive?"
    a: "Most often the boot order is wrong or the firmware hides the drive. Open the boot menu with the key your manufacturer uses, commonly F2, F12, Delete or Esc, and select the USB stick. If it still doesn't appear, Microsoft says you may need to turn Secure Boot off temporarily, then turn it back on after setup."
---
To create a Windows 11 bootable USB, plug in a blank flash drive with at least 8 GB, download the Media Creation Tool from Microsoft, run it as administrator and choose **USB flash drive** when it asks what media to create. The tool downloads Windows 11 and writes a drive you can boot from. This article is for IT admins and power users who need clean installation media for a new PC, a rebuild or a repair. It covers the Microsoft tool, the manual method for when the tool is not an option, and what to do when the PC refuses to boot from the stick.

## What you need before you start

Microsoft's [Windows 11 download page](https://www.microsoft.com/en-us/software-download/windows11) lists the requirements for creating installation media. You need a PC with a reliable internet connection, enough storage, and a blank USB flash drive of at least 8 GB. The tool erases the drive, so copy off anything you want to keep first. A 64-bit processor is required, and you can check yours under **Settings**, **System**, **About**. The language you pick for the media should match the language you plan to use during installation.

Two limits are worth knowing now. The tool only creates media for x64 processors, so it won't help for an Arm-based PC. And the download page does not list the Windows 11 hardware requirements itself. It points to Microsoft's device specifications instead. If the target PC is older, read the Windows 11 requirements on Microsoft Learn before you spend an evening on it. They include UEFI firmware that is Secure Boot capable and TPM 2.0. Microsoft says that installing on hardware below the minimum is not recommended: the PC would no longer be supported or eligible for updates, and damage from it isn't covered by the manufacturer's warranty.

You may also be asked for a product key. Microsoft's [installation media article](https://support.microsoft.com/en-us/windows/create-installation-media-for-windows-99a58364-8c02-206f-aa6f-40c3b507420d) says a 25-character key can be needed, but not for digital licenses. Many devices store the key in firmware, and if it matches the Windows version and edition you install, it's applied automatically.

## Create the USB with the Media Creation Tool

This is the method Microsoft documents and the one to use unless you have a reason not to.

1. On a working PC, open the Windows 11 download page and, under **Create Windows 11 Installation Media**, select **Download Now**. This gives you `MediaCreationTool.exe`.
2. Plug in the blank USB drive.
3. Run the tool as administrator and accept the license terms.
4. Choose the option to create installation media for another PC, then select **Next**.
5. Pick the language, the edition and the 64-bit architecture.
6. Select **USB flash drive**, choose your drive from the list and select **Next**.
7. Wait for the download and the write to finish. How long that takes depends on your connection and on the drive.

If you choose **ISO file** in step 6 instead, the tool saves an ISO that you can burn to a DVD later. The download page notes that a blank DVD needs at least 8 GB, and that a "disc image file is too large" error means you need a dual-layer disc.

One practical habit: label the stick with the Windows 11 version and the date you created it. Media from a year ago still installs, but you will spend the first hour after setup on updates.

## Make the drive by hand from an ISO

Sometimes you can't run the tool. Maybe the PC you're working on is locked down, or you already have an ISO from the download page. Microsoft Learn describes the manual way in [Install Windows from a flash drive](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/install-windows-from-a-usb-flash-drive), written for manufacturers. It needs the installation ISO, a flash drive with at least 5 GB free, and a Windows PC to prepare the drive.

1. Plug in the drive. Right-click **Start** and open **Disk Management**.
2. Right-click the USB partition, choose **Format** and select **FAT32**. Microsoft states that FAT32 lets the drive boot both BIOS-based and UEFI-based PCs.
3. Right-click the partition again and choose **Mark Partition as Active**. If that menu entry is greyed out, Microsoft's page says to use `diskpart` to select the partition and mark it active.
4. Right-click the ISO and choose **Mount**, or open it in any way you like. In File Explorer, copy the entire contents of the ISO onto the flash drive.

That's the whole job for most ISOs. Be careful with formatting: you are erasing a disk, so make sure you picked the USB drive and not an internal one.

### When install.wim is larger than 4 GB

FAT32 can't store a file over 4 GB. If `sources\install.wim` on your ISO is bigger than that, the copy fails or the file is skipped. Microsoft's article shows a fix with two commands. In these examples `D:` is the mounted ISO and `E:` is the flash drive, so change the letters to match yours.

1. Copy everything except the large file: `robocopy D: E: /s /max:3800000000`
2. Split the image into smaller pieces on the drive: `Dism /Split-Image /ImageFile:D:\sources\install.wim /SWMFile:E:\sources\install.swm /FileSize:3800`

Windows Setup installs from the split file automatically, as long as it is named `install.swm`. The page only covers FAT32 and says nothing about NTFS, so I'm leaving NTFS out here as well.

## Boot the target PC from the drive

Making the drive is half of the job. Now you have to get the PC to start from it.

1. Back up the data on the target PC if there is anything on it you care about.
2. Connect the USB drive and restart or power on the PC.
3. Open the boot menu. Microsoft's download page says the key is commonly F2, F12, Delete or Esc, and the Learn article adds F10 as an example. It depends on the manufacturer, so look at the screen right after power-on or check the maker's support page.
4. Select the USB drive. Windows Setup starts.
5. On the **Install Windows** page, set the language, time and keyboard, then select **Install Windows** and follow the prompts.
6. When the installation is done, remove the drive. If you changed the boot order, put it back. Otherwise the Install Windows page can appear again after setup finishes.

If the PC goes straight into the existing system, shut it down completely and try again, as Microsoft suggests. If the media does not appear at all, check the boot order in UEFI. Microsoft also says you may need to turn Secure Boot off temporarily, so check your manufacturer's instructions. Turn it back on afterwards. Secure Boot is one of the settings Windows 11 expects to be available.

## Common mistakes

- Using a drive that has data on it. The media creation erases the drive. Copy your files first, and check that you picked the right drive letter.
- Choosing the wrong architecture or language. Windows 11 media is 64-bit only, and the language should match what you plan to use during setup.
- Copying files onto an NTFS or exFAT drive and wondering why a UEFI PC ignores it. Microsoft's manual method uses FAT32, which works for both BIOS and UEFI.
- Forgetting the 4 GB limit. A failed copy of `install.wim` is the classic sign. Split the image with DISM or let the Media Creation Tool do the work.
- Leaving the boot order changed. After setup, put the internal disk back first, or you will meet the Install Windows screen again.
- Using an old stick. Rebuild the media from time to time so you aren't installing a version that needs a long update afterwards.

## Related topics to explore

- Where do I get the ISO itself? Microsoft offers a multi-edition disk image for x64 devices, and you can check the download against a SHA-256 hash.
- Do I need USB media at all for many PCs? [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/) sets up new devices from the cloud. Microsoft says it lets IT skip building and maintaining custom images for each model, because the OEM-optimized Windows that ships on the hardware is configured with settings and policies.
- What if the PC won't start from any media? Open firmware settings and check boot order and Secure Boot. The article on how to open the BIOS in Windows 11 covers the steps.
- Can the PC be repaired instead of reinstalled? Booting from your installation media also gives access to the Windows Recovery Environment through **Repair my PC**, as described in Microsoft's [recovery options](https://support.microsoft.com/en-us/windows/experience/backup-recovery/recovery-options-in-windows).

## Next step

Create the drive today with the Media Creation Tool, test that a spare PC actually boots from it, and keep the stick somewhere you can find it. A tested Windows 11 bootable USB is the thing you will be glad to have when a machine won't start.
