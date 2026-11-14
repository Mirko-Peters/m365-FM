---
title: "Fix Windows Update Errors 0x80073712 and 0x80070002 With DISM and SFC"
summary: "Repair component store corruption behind Windows Update errors 0x80073712 and 0x80070002 using two Microsoft Learn Windows Server articles: DISM RestoreHealth with and without a source, sfc, CBS.log analysis, plus five documented symptoms for 0x80070002. Notes the Windows Server scope."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [windows-update-for-business]
keypoints:
  - "Learn's code table says 0x80073712 is ERROR_SXS_COMPONENT_STORE_CORRUPT, meaning the component store is in an inconsistent state, and 0x80070002 is ERROR_FILE_NOT_FOUND."
  - "Method 1 is DISM.exe /Online /Cleanup-image /Restorehealth followed by sfc /scannow, then running Windows Update again."
  - "If the machine cannot reach Windows Update, use DISM with /Source and /LimitAccess pointing to a repair source of the same OS version."
  - "Both Learn pages are scoped to supported Windows Server versions, although the DISM method applies to Windows 11, Windows 10 and Server 2016 or later."
  - "Back up the OS disk before the manual 0x80070002 fixes. The page gives no rollback steps, and one registry path in it looks wrong."
faq:
  - q: "What does 0x80073712 mean?"
    a: "According to Microsoft Learn, it is ERROR_SXS_COMPONENT_STORE_CORRUPT, described as the component store being in an inconsistent state."
  - q: "What is the first repair step?"
    a: "Open an elevated command prompt, run DISM.exe /Online /Cleanup-image /Restorehealth, then sfc /scannow, and run Windows Update again."
  - q: "What if the computer cannot reach Windows Update?"
    a: "Use the /Source option with a path to a working installation, network share or media of the same OS version, together with /LimitAccess."
  - q: "Where do I see what DISM repaired?"
    a: "In %windir%\\Logs\\CBS\\CBS.log, which Learn explains how to read for corrupt payloads and missing MUM files."
  - q: "Does this article cover resetting Windows Update components?"
    a: "No. The two Learn pages used here do not describe resetting Windows Update components, and both are scoped to Windows Server."
---

Errors 0x80073712 and 0x80070002 usually point to a damaged component store or missing files. This guide combines two Microsoft Learn troubleshooting pages. Both are written for supported versions of Windows Server. The DISM repair section says it applies to Windows 11, Windows 10 and Windows Server 2016 or later. The Learn page for general Windows client update errors does not mention these two codes, so this article is limited to what the server pages document.

## What the codes mean

Learn lists the codes among common corruption errors seen in the Setup event log:

| Code | Name | Description |
| --- | --- | --- |
| 0x80070002 | ERROR_FILE_NOT_FOUND | The system cannot find the file specified |
| 0x80073712 | ERROR_SXS_COMPONENT_STORE_CORRUPT | The component store is in an inconsistent state |

The other codes in the same table include 0x800f081f (source missing), 0x800f0831 (CBS store corruption) and 0x800736CC (file hash mismatch).

## Method 1: DISM and SFC

1. Open an elevated Command Prompt.
2. Run `DISM.exe /Online /Cleanup-image /Restorehealth`. It can take several minutes and fetches replacement files from Microsoft Update.
3. If the computer cannot reach Windows Update, use a working installation, share or media as the source: `DISM.exe /Online /Cleanup-Image /RestoreHealth /Source:\\<servername>\c$\windows /LimitAccess`. The source must run the same OS version, and the administrative share needs appropriate access.
4. Run `sfc /scannow`.
5. Run Windows Update again.

DISM logs to `%windir%\Logs\CBS\CBS.log`. Learn explains that DISM checks the Servicing\Packages and WinSxS\Manifests folders and component registry data, and may replace incorrect data with corrected versions.

## Method 2: manual CBS repair

Use this if the result is not The restore operation completed successfully.

1. Open CBS.log and read the summary of detected and repaired corruption. Entries such as CSI Payload Corrupt and CBS MUM Missing name the damaged items.
2. Read the Update Build Revision from each path, then map it to a KB number in the Windows release information history. Learn labels its examples as only might correspond.
3. Download the update from the Microsoft Update Catalog and extract the .msu and .cab files, using the script Learn links.
4. Copy the correct files into `C:\temp\Source`, then run `DISM /Online /Cleanup-Image /RestoreHealth /Source:C:\temp\Source\ /LimitAccess`.
5. Verify with `DISM /Online /Cleanup-Image /ScanHealth` and review CBS.log.

Because of `/LimitAccess`, the source folder must contain every required file.

## Extra causes of 0x80070002

The second page says the error typically comes from missing or corrupt files or incomplete earlier updates, and gives five symptoms. It requires an OS disk backup first.

- **Monthly Rollup fails with clr_optimization errors in CBS.log:** if the .NET v4.0.30319 folder is empty, back up and delete the `clr_optimization_v4.0.30319_32` and `_64` service keys under `HKLM\System\CurrentControlSet\services`, then retry.
- **Update fails with STATUS_OBJECT_NAME_NOT_FOUND:** restore the System Tools Start Menu folder from a working machine.
- **Missing DLLs in WinSxS:** take ownership with takeown and icacls, copy the files from a working server, run DISM RestoreHealth, then install the standalone Monthly Rollup.
- **Cumulative update rolls back after restart:** export the driver's registry keys, for example flpydisk and sfloppy, from a working computer and import them.
- **Upgrade fails with a Wimmount error:** export the Wimmount service key from a working server and merge it.

## Cautions

The page gives no rollback procedure for these changes. Its Wimmount path, `HKLM\System\CCS\Services\Wimmount.sys`, probably should name the service key, so verify it on a working server first. Its WinSxS example also uses folder names that do not match the log entry.

## Reading CBS.log

Learn's example shows a log summary with Total Detected Corruption and Total Repaired Corruption counts and an operation result of 0x800f081f. The entry CSI Payload Corrupt means a payload file is corrupt, CBS MUM Missing means a required MUM file is absent from a package, and CSI Manifest Corrupt means a manifest entry is damaged. In the example one corrupt entry was fixed and another stayed corrupt, so the final result can still be an error even after a partial repair.

## Where to get more help

For Microsoft support cases the page recommends gathering data with TSS. Home users are pointed to a separate support article on fixing Windows Update errors, which is aimed at a different audience than these server pages.

## Not covered

Neither page describes resetting Windows Update components, reboot requirements or Windows client specific steps.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)

## Sources

- [Fix Windows Update corruptions and installation failures](https://learn.microsoft.com/troubleshoot/windows-server/installing-updates-features-roles/fix-windows-update-errors)
- [Troubleshoot Windows Update error 0x80070002](https://learn.microsoft.com/troubleshoot/windows-server/installing-updates-features-roles/troubleshoot-windows-update-error-0x80070002)
