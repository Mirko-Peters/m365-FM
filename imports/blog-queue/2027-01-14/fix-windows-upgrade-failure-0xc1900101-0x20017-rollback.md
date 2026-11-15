---
title: "Fix Windows Upgrade Failure 0xC1900101-0x20017 (Rollback During Boot)"
summary: "Error 0xC1900101-0x20017 rolls the upgrade back during the SAFE_OS or BOOT phase. Work through Microsoft's eleven steps: drivers, BIOS, unsigned drivers, third-party security software, clean boot and peripherals."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [windows-update-for-business]
keypoints:
  - "The upgrade fails during SAFE_OS or BOOT, or while cleaning up external drivers, and Windows rolls back; sometimes the upgrade seems to finish but the PC does not restart."
  - "Learn names outdated drivers, third-party software such as antivirus and CrowdStrike, wrong driver settings and hardware or dynamic update settings as typical causes."
  - "Microsoft's resolution has eleven steps, starting with prerequisites and event logs and ending with replacing the computer."
  - "Use sigverif and sigcheck to find unsigned drivers, then update, reinstall or remove them."
  - "Make a backup and recovery plan before you upgrade, especially in production."
faq:
  - q: "What does error 0xC1900101-0x20017 mean?"
    a: "Microsoft Learn says the upgrade fails during the SAFE_OS or BOOT phases, or while cleaning up external drivers, and Windows rolls back to the previous version. In another pattern the upgrade appears to finish but the computer does not restart. The error can affect Windows Client and Windows Server."
  - q: "What usually causes it?"
    a: "According to Learn it typically results from driver or hardware configuration issues, or conflicts with third-party software. Examples are outdated or incompatible drivers for network adapters, storage controllers or external devices, PVSCSI controllers, antivirus or security tools such as CrowdStrike, incorrect CSagent altitude settings, and hardware or dynamic update settings."
  - q: "How do I find unsigned drivers?"
    a: "Learn says to open an administrative Command Prompt, run sigverif, select Start in the File Signature Verification tool, and review the list or the log under Advanced > View Log. For a detailed check, use sigcheck from Sysinternals with the -i switch on each driver path."
  - q: "Which logs should I collect for Microsoft Support?"
    a: "Learn lists the CBS log folder at %windir%\\Logs\\CBS, SetupAct.log and SetupErr.log from C:\\Windows and C:\\$WINDOWS.~BT\\Sources\\Panther, and logs from the TroubleshootingScript tool."
  - q: "Should I choose Download and install updates during the retry?"
    a: "It depends on the step. In the clean restart step Learn says to select it if the option appears. In the step that removes nonessential hardware it says to make sure it is disabled, to avoid driver conflicts for removed or disabled devices."
---

Error 0xC1900101-0x20017 means a Windows upgrade failed during the SAFE_OS or BOOT phase, or while cleaning up external drivers, and Windows rolled back. It usually points to a driver, hardware or third-party software problem. Microsoft Learn gives eleven steps in order. Start with a backup, check requirements and the event log, update drivers and firmware, and then remove conflicting software and peripherals.

## Symptoms

Learn lists two behaviors:

- The upgrade fails during the SAFE_OS or BOOT phases, or while it cleans up external drivers, and Windows rolls back to the previous version.
- The upgrade appears to finish, but the computer does not restart.

You might also see other codes, such as 0x00000005. The error can affect Windows Client and Windows Server editions.

## Causes

Learn says the error typically results from driver or hardware configuration issues, or from conflicts with third-party software. Its examples:

- Outdated or incompatible drivers, especially for network adapters, storage controllers or external devices. PVSCSI controllers are named as a known cause.
- Conflicts with third-party software, including antivirus programs and security tools such as CrowdStrike.
- Incorrect driver settings, such as CSagent altitude configurations in CrowdStrike.
- Hardware configurations or dynamic update settings that interfere with the upgrade.

## Before you start

Learn's important note: set up a robust backup and recovery plan before you upgrade the operating system, particularly in production.

## The eleven steps

1. **Check the prerequisites.** Compare the device with the Windows 11 requirements or the hardware requirements for Windows Server.
2. **Review event logs.** Open Event Viewer and look at the system logs for events about drivers or hardware. Fix what you can, then retry.
3. **Update Windows and drivers.** Run **Check for updates** in Windows Update until no Important, hardware or driver updates remain. Learn says you might need to check several times. Then get updated third-party drivers from the manufacturer.
4. **Check Device Manager.** Open `devmgmt.msc`, expand the categories and look for devices with a yellow exclamation mark. Right-click and choose **Update Driver Software** or **Uninstall**. Retry after fixing all errors.
5. **Check the BIOS.** Make sure BIOS and firmware are current.
6. **Repair or remove unsigned drivers.** See the next section.
7. **Remove conflicting software.** Try disabling third-party antivirus and anti-malware, reconfigure or remove software known to conflict, such as CrowdStrike, and retry.
8. **Perform a clean restart.** In `msconfig` choose **Services** > **Hide all Microsoft services** > **Disable all**. Under **Startup** open Task Manager and disable each startup item. Restart and retry. Learn says that if the **Download and install updates** option appears during setup, select it.
9. **Remove nonessential hardware.** Disconnect everything except mouse, keyboard and display, including external drives and docks, and disconnect or disable unused network adapters. In this step Learn says to make sure **Download and install updates** is disabled if you see it.
10. **Check the number of local accounts.** In Computer Management, go to **Local Users and Groups** > **Users** and remove unused or extraneous accounts.
11. **Replace the computer** if the issue persists.

The two statements about **Download and install updates** differ by step, as quoted above. Follow each step's own wording.

## Step 6 in detail: unsigned drivers

Learn says drivers can look unsigned if you disabled driver signature verification, which it calls highly not recommended, or if a catalog file with the `.cat` extension is corrupted or missing.

1. In an administrative Command Prompt, run `sigverif`.
2. In the File Signature Verification tool select **Start**.
3. Review the list of names, locations and versions. Use **Advanced** > **View Log** for the log.
4. For a detailed check, download `sigcheck.zip` from Sysinternals, extract it, and for each driver run:

   ```
   sigcheck64 -i <DriverPath>
   ```

   On a 32-bit operating system use `sigcheck -i` instead. Learn also mentions the `driverquery` tool.

If you find unsigned drivers: look for updated versions, uninstall and reinstall the drivers, or restore the catalog file by reinstalling the driver or copying it from another device. If nothing works, uninstall the driver and retry the upgrade.

## Data to collect for support

- The contents of `%windir%\Logs\CBS`.
- `SetupAct.log` and `SetupErr.log` from `C:\Windows` and `C:\$WINDOWS.~BT\Sources\Panther`.
- Logs from the TroubleshootingScript (TSS) tool. Learn links its data collection article for the installing or upgrading Windows scenario.

## How I would sequence this

This section is my advice, not a Microsoft statement. Do the cheap, reversible steps first: event log, updates, Device Manager, BIOS. Then the security software, because it is a named cause and easy to test on one machine. Keep the clean boot and peripheral removal together, since both reduce what runs during the upgrade. Record the result of each step so that a failed upgrade leaves you with data for support.

If you manage many machines, note which hardware model, storage controller and security agent the failing ones share. Learn names PVSCSI and CrowdStrike as examples, so a pattern in your fleet may point to the same cause. That is an inference on my part, not a statement from the page.

## What the page does not cover

The Learn article does not say how to read the rollback logs line by line and it gives no version or build numbers. For a deeper analysis follow its data collection article.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Windows Server](https://www.m365.fm/entity/windows-server/)

## Sources

- [Upgrade Fails and Generates Error Code 0xC1900101-0x20017 - Windows Client (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/setup-upgrade-and-drivers/upgrade-fails-with-error-0xc1900101-0x20017)
