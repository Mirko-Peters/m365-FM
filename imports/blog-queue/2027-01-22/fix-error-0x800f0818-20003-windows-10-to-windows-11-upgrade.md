---
title: "Fix Error 0x800F0818 - 0x20003 During an Upgrade From Windows 10 to Windows 11"
summary: "A Windows 10 22H2 to Windows 11 23H2 or 24H2 feature update fails in the Safe_OS phase and rolls back with 0x800F0818 - 0x20003. Learn ties it to a legacy SetupConfig.ini and an UnattendFile registry value. Symptoms, log checks, the fix and how to read the code."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [windows-update-for-business, configuration-manager]
keypoints:
  - "Learn describes a feature update from Windows 10 22H2 to Windows 11 23H2 or 24H2 that fails in the Safe_OS phase with 0x800F0818 - 0x20003, then rolls back."
  - "It appears on devices serviced with SCCM, WSUS or Windows Update for Business, and SetupDiag returns the same code."
  - "Cause: a legacy SetupConfig.ini with hard-coded paths to outdated language packs and scripts that are not compatible with Windows 11."
  - "Fix: delete SetupConfig.ini from the Default user WSUS folder and delete the UnattendFile value under HKLM SYSTEM Setup. Back up the registry first."
  - "The extend code 0x20003 decodes as phase 2 (Safe OS) and operation 03 (install updates), according to Learn's upgrade error code tables."
faq:
  - q: "What does 0x800F0818 - 0x20003 mean?"
    a: "Microsoft Learn describes it as an error on some computers during an upgrade from Windows 10 to Windows 11. The feature update from Windows 10 22H2 to Windows 11 23H2 or 24H2 fails in the Safe_OS phase and the update rolls back. In the logs you see an identity mismatch, CBS_E_IDENTITY_MISMATCH, for a language feature package that does not match the current OS."
  - q: "Which devices are affected?"
    a: "Learn says devices serviced with System Center Configuration Manager, Windows Server Update Services or Windows Update for Business, that previously received a Windows 10 feature update using a custom SetupConfig.ini file, or whose earlier updates or upgrades used manually configured or deployed language packs or post-upgrade scripts."
  - q: "What is the fix?"
    a: "Open C:\\Users\\Default\\AppData\\Local\\Microsoft\\Windows\\WSUS\\ and delete the SetupConfig.ini file. Then open Registry Editor, go to HKEY_LOCAL_MACHINE\\SYSTEM\\Setup and delete the UnattendFile entry. Learn tells you to back up the registry before modifying it and notes the AppData folder is hidden by default."
  - q: "Which log files show the problem?"
    a: "Learn names C:\\$Windows.~BT\\Sources\\Rollback\\setupact_rollback.log for the result and extend values, and C:\\$Windows.~BT\\Sources\\Panther\\setupact.log for several entries, including the command line with the language pack and script paths and the CBS identity mismatch for a language feature package."
  - q: "How do I read the extend code?"
    a: "Learn's upgrade error codes page says the first digit of the extend code is the phase and the last two digits are the operation. For 0x20003 the phase is 2, SP_EXECUTION_SAFE_OS, and the operation is 03, SP_EXECUTION_OP_INSTALL_UPDATES. The page says the tables reflect Windows 10 version 1607 and might change."
---

A feature update from Windows 10 22H2 to Windows 11 that fails with 0x800F0818 - 0x20003 and rolls back has a documented cause on Microsoft Learn: a legacy `SetupConfig.ini` file that points to old language packs and scripts. The fix is to remove that file and one registry value. This article covers the symptoms, the log entries to confirm the cause, the fix and how to read the error code.

## Symptoms

Learn describes this scenario:

- You service Windows client computers with System Center Configuration Manager (SCCM), Windows Server Update Services (WSUS) or Windows Update for Business.
- A feature update from Windows 10 22H2 to Windows 11 23H2 or 24H2 fails in the Safe_OS phase with error 0x800F0818 - 0x20003, and the update rolls back.
- A diagnostic tool such as SetupDiag returns the same code.

## Confirm it in the logs

Learn lists two files:

| File | What you see |
| --- | --- |
| `C:\$Windows.~BT\Sources\Rollback\setupact_rollback.log` | ImageExit lines with SetupResult 0x800f0818 and Extended 0x20003 |
| `C:\$Windows.~BT\Sources\Panther\setupact.log` | The Setup command line with `/InstallLangPacks`, `/PostOOBE`, `/PostRollback` and `/DynamicUpdate Disable` pointing to a W10_22H2 folder, a message about copying user-provided langpack package files, and CBS lines reporting a language feature package that does not match the current OS with `0x800f0818 - CBS_E_IDENTITY_MISMATCH` |

The sample on the page shows a Windows 10 language feature package (version 10.0.19041.1) where the Windows 11 version (10.0.22621.1) was expected.

## Cause

Learn says the issue affects devices with one of these histories:

- The device previously received a Windows 10 feature update that used a custom `SetupConfig.ini`.
- Earlier updates or upgrades used language packs or post-upgrade scripts that were manually configured or deployed.

The upgrade fails because a legacy `SetupConfig.ini` contains hard-coded paths to outdated language packs and scripts that are not compatible with Windows 11. The usual path is `C:\Users\Default\AppData\Local\Microsoft\Windows\WSUS\SetupConfig.ini`. The page shows a file with `InstallLangPacks`, `PostOOBE` and `PostRollback` entries and `DynamicUpdate=Disable`. These stale references cause identity mismatches during the upgrade, so it fails and rolls back.

## The fix

Learn warns that registry changes can cause serious problems if done incorrectly, and says to back up the registry first.

1. On the affected computer, open File Explorer and go to `C:\Users\Default\AppData\Local\Microsoft\Windows\WSUS\`. If you cannot see AppData, use **View** > **Show** > **Hidden items**.
2. Delete the `SetupConfig.ini` file.
3. Open Registry Editor and go to `HKEY_LOCAL_MACHINE\SYSTEM\Setup`.
4. Delete the `UnattendFile` registry entry.

The page does not describe how to push this to many devices. For a fleet, you would script or deploy those two steps with your management tool, and test first. That is my observation, not a Learn procedure.

## How to read 0x800F0818 - 0x20003

The Learn page on upgrade error codes explains that Windows Setup returns two codes: a result code and an extend code. The extend code carries the phase and the operation.

- First digit is the phase. For 0x20003 that is 2, listed as SP_EXECUTION_SAFE_OS.
- Last two digits are the operation. For 0x20003 that is 03, listed as SP_EXECUTION_OP_INSTALL_UPDATES.

The page says the tables apply to Windows 10 version 1607 and might change in later releases. The Safe_OS phase in the Windows 11 article matches the phase table.

For the result code, the page's method: the first hexadecimal digit tells the type, 8 for a Win32 error code and C for an NTSTATUS value. Learn does not give a general meaning for 0x800F0818 other than this article's CBS identity mismatch.

## More diagnostic tools

The article points to SetupDiag, the Windows upgrade errors guide and the upgrade log files page. The upgrade errors guide groups its content by level, from quick fixes to log file analysis, and links resolution procedures for result codes starting with 0x800. I did not read those pages in full for this post.

## Preparing the fleet (my advice)

This section is my suggestion, not Microsoft guidance:

1. Before a Windows 11 wave, search your devices for the legacy file and the registry value, not only the failed ones. Devices that have not tried the upgrade yet may carry the same history.
2. Check your old deployment scripts for `SetupConfig.ini` creation and language pack paths, so they do not recreate the file.
3. Keep the two log files from a failed device before you clean up. They show the paths that caused the failure.
4. After the fix, retry the upgrade on a pilot group first.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Configuration Manager](https://www.m365.fm/entity/configuration-manager/)

## Sources

- [Error 0x800F0818 - 0x20003 Occurs During Upgrade from Windows 10 to Windows 11 (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/setup-upgrade-and-drivers/error-0x800f0818-during-upgrade-to-windows-11)
- [Windows 10 upgrade error codes (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/setup-upgrade-and-drivers/windows-10-upgrade-error-codes)
- [Resolve Windows upgrade errors (Microsoft Learn)](https://learn.microsoft.com/windows/deployment/upgrade/resolve-windows-upgrade-errors)
