---
title: "Windows 11 ISO Download: The Official Way, Step by Step"
summary: "Windows 11 ISO download from Microsoft: pick the right option, choose edition and language, verify the SHA-256 hash and stay away from unofficial copies."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-autopilot, intune]
keypoints:
  - "The official Windows 11 ISO comes from Microsoft's Download Windows 11 page, under Download Windows 11 Disk Image (ISO) for x64 devices."
  - "You pick an edition from a dropdown, confirm the product language and then download. The download links are valid for 24 hours."
  - "The ISO is a multi-edition image: your product key decides which edition gets installed during setup."
  - "Check the file with Get-FileHash in PowerShell and compare the SHA256 value with the one Microsoft lists for your language."
  - "Arm-based PCs, Enterprise editions and Insider builds have their own download locations."
faq:
  - q: "Where can I download the official Windows 11 ISO?"
    a: "Use Microsoft's Download Windows 11 page. Under the third option, Download Windows 11 Disk Image (ISO) for x64 devices, select an edition, confirm your language and download the file. The download link the page generates is time-limited, so start the download right away and generate a new link if it expires. Avoid ISO files from other sites, because you can't know what was changed in them."
  - q: "Is the Windows 11 ISO free?"
    a: "Downloading the file doesn't cost anything, but running Windows 11 requires a license. Microsoft's installation media article says a 25-character product key might be needed, but not for digital licenses. Which edition ends up activated depends on your license."
  - q: "How do I check that my Windows 11 ISO is genuine?"
    a: "Open PowerShell and run Get-FileHash with the path to the ISO. Compare the SHA256 value in the output with the hash Microsoft lists on the download page for your download. If the two match, the file is intact and unaltered. If they differ, delete the file and download it again from Microsoft."
---
The official way to get a Windows 11 ISO is Microsoft's Download Windows 11 page: scroll to **Download Windows 11 Disk Image (ISO) for x64 devices**, select an edition, confirm the language and download the file. That's it, and you don't need a third-party site for any part of it. This article is for IT admins who need an ISO for a lab, a virtual machine or installation media. It explains the three download options Microsoft offers, how the ISO download works, how to verify the file and what to do with it afterwards.

## Which download option do you need?

The [Windows 11 download page](https://www.microsoft.com/en-us/software-download/windows11) offers three options, and they solve different problems.

The first is the **Installation Assistant**. It's for upgrading the PC you're sitting at. For a direct upgrade, Microsoft's requirements page asks for Windows 10 version 2004 or later with the September 14, 2021 security update or later installed.

The second is the **Media Creation Tool**. Use it for a clean install or a reinstall on a new or used PC. It creates a bootable USB drive, and Microsoft says it can also create an ISO file for virtual machines or for burning to a DVD. The USB route needs a blank USB flash drive of at least 8 GB and a reliable internet connection. If you only want a USB stick, the article on creating a Windows 11 bootable USB goes through that in detail.

The third is the **disk image (ISO)**. This is what you want when you need the file itself: for a virtual machine, for your own deployment share, for burning to a disc, or to build installation media with another tool. Which edition ends up activated depends on your license, so check that before you build media for a whole team.

If you manage a fleet, stop and ask whether you need an ISO at all. For upgrading Windows 10 devices, [Microsoft Intune](https://www.m365.fm/entity/intune/) can deploy a feature update policy and you select the Windows 11 version in the admin center. Microsoft's page on [upgrading devices to Windows 11 with Intune](https://learn.microsoft.com/intune/device-updates/windows/upgrade-to-windows-11) shows how to select a Windows 11 version from the **Feature update to deploy** list. The prerequisites sit on the linked page about managing feature updates, and the devices must meet the Windows 11 requirements. That's a cleaner route than walking around with media.

## Download the ISO step by step

The ISO download happens on the download page. In practice it's four clicks, but Microsoft changes the labels from time to time, so read the page as you go.

1. Open the Download Windows 11 page and go to the section **Download Windows 11 Disk Image (ISO) for x64 Devices**.
2. Select an edition from the dropdown menu, then select **Download**.
3. Select the product language from the second dropdown, then select **Confirm**.
4. Select the download button that appears. Save the file somewhere with enough space.

Two details are easy to miss. First, the download link is time-limited. If it expires halfway through, go through the steps again. Second, the option in step 1 is for x64 devices. If you have an Arm-based PC, check Microsoft's current download options for Arm instead of assuming this image fits.

Plan for the requirements, too. Microsoft says it isn't recommended to install Windows 11 on a device that doesn't meet them, and that if you already did, you should roll back to Windows 10. The minimum list, from the [Windows 11 requirements](https://learn.microsoft.com/windows/whats-new/windows-11-requirements) on Microsoft Learn, includes a 1 GHz processor with two or more cores, 4 GB of RAM, 64 GB of storage, UEFI firmware with Secure Boot capability and TPM 2.0.

## Verify the file with a SHA-256 hash

An ISO is a large file, and a download can break or be swapped. Microsoft lists SHA-256 hashes on the download page, so checking takes a minute.

1. Open **Windows PowerShell**.
2. Run `Get-FileHash` followed by the path to your ISO file, for example `Get-FileHash C:\Users\you\Downloads\Win11.iso`.
3. Compare the SHA256 value in the output with the hash that the download page lists for your download.
4. If both strings are identical, the file is intact and unaltered.

If they don't match, delete the file and download it again from Microsoft. Don't try to repair it. This is also the reason to stay away from unofficial copies. A modified ISO can look and install exactly like the real thing, and you won't see the difference without the hash.

## What to do with the ISO

You have a few choices.

To burn it to a DVD, right-click the ISO and select **Burn disc image**. Check that the disc has enough capacity first, because the image is large.

To use it in a virtual machine, attach the ISO as the virtual DVD drive and boot from it.

To make bootable USB media, copy the contents of the ISO onto a FAT32 drive. Microsoft Learn describes this in [Install Windows from a flash drive](https://learn.microsoft.com/windows-hardware/manufacture/desktop/install-windows-from-a-usb-flash-drive), including how to split `install.wim` with DISM when it is larger than 4 GB.

You can also right-click the ISO, select **Mount** and double-click `setup.exe`. Be careful here. Running setup from the media can upgrade the Windows installation you are on, as Microsoft's page on ways to install Windows 11 notes for installation media. That's fine on a machine you want to upgrade and a bad surprise on a machine you only meant to look at. Back up first.

## Enterprise editions, Insider builds and other versions

Not every ISO comes from the same page. Enterprise and volume-licensed media usually come through your organization's licensing portal, Visual Studio subscribers have their own downloads, and Insider Preview builds come from the Windows Insider site. Check which of these applies to you before you download.

That matters because the quick searches for "Windows 11 ISO" often end at pages about preview builds. A preview ISO is a different thing: it's meant for testing in the Windows Insider Program, it can break features, and it doesn't belong on a production machine. If you want a stable build for a normal install, use the disk image on the main download page.

On the question of which release you get: the download page shows the current version, and it changes over time, so check the page itself. Checking the Windows release health page for known issues before a large rollout is a good habit.

## Common mistakes

- Downloading the ISO from a site that isn't Microsoft's. You can't verify what's inside, and the hash comparison only helps if you compare against Microsoft's value.
- Letting the download link expire halfway through a slow download. Start again at the edition dropdown.
- Choosing the wrong language. The product language you confirm is the language Setup uses, so match it to what you want on the device.
- Double-clicking `setup.exe` in a mounted ISO on the wrong PC. That starts an in-place upgrade.
- Forgetting the architecture. The x64 image isn't meant for an Arm-based PC.
- Skipping the hash check because the file "looks fine".

## Related topics to explore

- How do I put the ISO on a USB stick? Format the drive as FAT32 and copy the contents, or let the Media Creation Tool do it. The article on a Windows 11 bootable USB covers both.
- How do I deploy Windows 11 to many devices? Use [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/) for new devices, which uses the OEM-optimized Windows that's preinstalled so you don't maintain custom images for every model, or an Intune feature update policy for upgrades.
- Will my PC even run Windows 11? Check the requirements before you download: UEFI with Secure Boot capability and TPM 2.0 are the usual blockers.
- What if I want to try the next build? That is what the Windows Insider Program is for, and its ISOs come from the Insider site, not from the main download page.

## Next step

Open the download page, choose the disk image, and run `Get-FileHash` on the file before you use it. A Windows 11 ISO download that you have checked against Microsoft's hash is a safe base for every USB stick, virtual machine and lab you build from it.

## Sources

- [Create installation media for Windows (Microsoft Support)](https://support.microsoft.com/windows/create-installation-media-for-windows-99a58364-8c02-206f-aa6f-40c3b507420d)
- [Ways to install Windows 11 (Microsoft Support)](https://support.microsoft.com/windows/ways-to-install-windows-11-e0edbbfb-cfc5-4011-868b-2ce77ac7c70e)
- [Windows 11 system requirements (Microsoft Learn)](https://learn.microsoft.com/windows/whats-new/windows-11-requirements)
- [Upgrade Windows 10 devices to Windows 11 with Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-updates/windows/upgrade-to-windows-11)
- [Install Windows from a USB flash drive (Microsoft Learn)](https://learn.microsoft.com/windows-hardware/manufacture/desktop/install-windows-from-a-usb-flash-drive)
- [Windows Autopilot overview (Microsoft Learn)](https://learn.microsoft.com/autopilot/overview)
