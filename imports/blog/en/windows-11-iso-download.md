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
    a: "Use Microsoft's Download Windows 11 page. Under the third option, Download Windows 11 Disk Image (ISO) for x64 devices, select an edition, confirm your language and download the file. Microsoft states that the download links are valid for 24 hours from creation. Avoid ISO files from other sites, because you can't know what was changed in them."
  - q: "Is the Windows 11 ISO free?"
    a: "Downloading the file doesn't cost anything, but running Windows 11 requires a license. Microsoft says you need a Windows 11 license or a Windows 10 device that is eligible for the upgrade. The ISO is a multi-edition image, so your product key determines which edition gets installed. Many devices store the key in firmware."
  - q: "How do I check that my Windows 11 ISO is genuine?"
    a: "Open PowerShell and run Get-FileHash with the path to the ISO. Compare the SHA256 value in the output with the hash Microsoft lists on the download page for the language you chose. If the two match, the file is intact and unaltered. If they differ, delete the file and download it again from Microsoft."
---
The official way to get a Windows 11 ISO is Microsoft's Download Windows 11 page: scroll to **Download Windows 11 Disk Image (ISO) for x64 devices**, select an edition, confirm the language and download the file. That's it, and you don't need a third-party site for any part of it. This article is for IT admins who need an ISO for a lab, a virtual machine or installation media. It explains the three download options Microsoft offers, how the ISO download works, how to verify the file and what to do with it afterwards.

## Which download option do you need?

The [Windows 11 download page](https://www.microsoft.com/en-us/software-download/windows11) offers three options, and they solve different problems.

The first is the **Installation Assistant**. It's for upgrading the PC you're sitting at. It needs Windows 10, version 2004 or later, 9 GB of free disk space and administrator rights, and it only works on x64 processors.

The second is the **Media Creation Tool**. Use it for a clean install or a reinstall on a new or used PC. It creates a bootable USB drive, a DVD or an ISO file. The tool needs a blank flash drive or disc with at least 8 GB, an internet connection and a 64-bit CPU. If you only want a USB stick, the article on creating a Windows 11 bootable USB goes through that in detail.

The third is the **disk image (ISO)**. This is what you want when you need the file itself: for a virtual machine, for your own deployment share, for burning to a disc, or to build installation media with another tool. Microsoft calls it a multi-edition ISO, which means one file holds several editions and your product key decides which edition gets installed.

If you manage a fleet, stop and ask whether you need an ISO at all. For upgrading Windows 10 devices, [Microsoft Intune](https://www.m365.fm/entity/intune/) can deploy a feature update policy and you select the Windows 11 version in the admin center. Microsoft's page on [upgrading devices to Windows 11 with Intune](https://learn.microsoft.com/en-us/intune/device-updates/windows/upgrade-to-windows-11) lists the prerequisites: devices running Windows 10 that meet the Windows 11 minimum system requirements. That's a cleaner route than walking around with media.

## Download the ISO step by step

Microsoft documents the ISO download on the download page. In practice it's four clicks.

1. Open the Download Windows 11 page and go to the section **Download Windows 11 Disk Image (ISO) for x64 Devices**.
2. Select an edition from the dropdown menu, then select **Download**.
3. Select the product language from the second dropdown, then select **Confirm**.
4. Select the download button that appears. Save the file somewhere with enough space.

Two details are easy to miss. First, the download link is time-limited: Microsoft says links are valid for 24 hours from creation, and the page shows an expiration time in UTC. If the link expires, go through the steps again. Second, the ISO is for x64 devices only. If you have an Arm-based PC, the Installation Assistant and the Media Creation Tool don't support it, and the Arm64 ISO lives on a separate Windows 11 for Arm page.

Plan for the requirements, too. Microsoft's page says the same applies as for the media option: an internet connection, enough storage, a 64-bit CPU and a PC that meets the system requirements. Installing on unsupported hardware isn't recommended, because the PC would no longer be supported or eligible for updates, and manufacturer warranties don't cover resulting damage. The minimum list, from the Windows 11 requirements on Microsoft Learn, includes a 1 GHz processor with two or more cores, 4 GB of RAM, 64 GB of storage, UEFI firmware with Secure Boot capability and TPM 2.0.

## Verify the file with a SHA-256 hash

An ISO is a large file, and a download can break or be swapped. Microsoft publishes SHA-256 hashes for every language on the download page, so checking takes a minute.

1. Open **Windows PowerShell**.
2. Run `Get-FileHash` followed by the path to your ISO file, for example `Get-FileHash C:\Users\you\Downloads\Win11.iso`.
3. Compare the SHA256 value in the output with the hash for your language in the table on the download page.
4. If both strings are identical, the file is intact and unaltered.

If they don't match, delete the file and download it again from Microsoft. Don't try to repair it. This is also the reason to stay away from unofficial copies. A modified ISO can look and install exactly like the real thing, and you won't see the difference without the hash.

## What to do with the ISO

You have a few choices, and the download page explains the basic ones.

To burn it to a DVD, right-click the ISO and select **Burn disc image**. A blank disc needs at least 8 GB, and if you get a "disc image file is too large" message, you need a dual-layer disc.

To use it in a virtual machine, attach the ISO as the virtual DVD drive and boot from it.

To make bootable USB media, copy the contents of the ISO onto a FAT32 drive. Microsoft Learn describes this in [Install Windows from a flash drive](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/install-windows-from-a-usb-flash-drive), including how to split `install.wim` with DISM when it is larger than 4 GB.

You can also right-click the ISO, select **Mount** and double-click `setup.exe`. Be careful here. Microsoft notes that mounting the ISO and running setup performs an in-place upgrade of your current operating system. That's fine on a machine you want to upgrade and a bad surprise on a machine you only meant to look at. Back up first.

## Enterprise editions, Insider builds and other versions

Not every ISO comes from the same page. Microsoft's download page points out that Enterprise editions are available through the Microsoft 365 admin center, Visual Studio subscribers can find downloads on the Visual Studio portal, and Insider Preview builds are on the Windows Insider site. The page also lists Windows 10 and older downloads in its navigation.

That matters because the quick searches for "Windows 11 ISO" often end at pages about preview builds. A preview ISO is a different thing: it's meant for testing in the Windows Insider Program, it can break features, and it doesn't belong on a production machine. If you want a stable build for a normal install, use the disk image on the main download page.

On the question of which release you get: at the time of writing the page listed the Windows 11 2026 Update (version 26H2) as the current release. Check the page itself, because it changes. Microsoft also suggests checking the Windows release health page for known issues before you install any option.

## Common mistakes

- Downloading the ISO from a site that isn't Microsoft's. You can't verify what's inside, and the hash comparison only helps if you compare against Microsoft's value.
- Letting the 24-hour link expire halfway through a slow download. Start again at the edition dropdown.
- Choosing the wrong language. The product language you confirm is the language Setup uses, so match it to what you want on the device.
- Double-clicking `setup.exe` in a mounted ISO on the wrong PC. That starts an in-place upgrade.
- Forgetting the architecture. This ISO is x64 only, so an Arm-based PC needs Microsoft's Arm64 page.
- Skipping the hash check because the file "looks fine".

## Related topics to explore

- How do I put the ISO on a USB stick? Format the drive as FAT32 and copy the contents, or let the Media Creation Tool do it. The article on a Windows 11 bootable USB covers both.
- How do I deploy Windows 11 to many devices? Use [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/) for new devices, which Microsoft describes as setting up and pre-configuring them without custom images, or an Intune feature update policy for upgrades.
- Will my PC even run Windows 11? Check the requirements before you download: UEFI with Secure Boot capability and TPM 2.0 are the usual blockers.
- What if I want to try the next build? That is what the Windows Insider Program is for, and its ISOs come from the Insider site, not from the main download page.

## Next step

Open the download page, choose the disk image, and run `Get-FileHash` on the file before you use it. A Windows 11 ISO download that you have checked against Microsoft's hash is a safe base for every USB stick, virtual machine and lab you build from it.
