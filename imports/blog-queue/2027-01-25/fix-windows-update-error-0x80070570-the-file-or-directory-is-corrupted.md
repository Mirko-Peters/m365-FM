---
title: "Fix Windows Update Error 0x80070570: The File or Directory Is Corrupted"
summary: "Windows Update error 0x80070570 (ERROR_FILE_OR_DIRECTORY_CORRUPTED) from Microsoft Learn: log entries to look for, five causes, and the six steps in order: clear the update cache, DISM RestoreHealth, sfc, chkdsk, and the Azure VM reset tool and repair VM."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [windows-update-for-business]
keypoints:
  - "0x80070570 means Windows cannot read or process the files needed to install an update. Look for it in CBS.log or WindowsUpdate.log."
  - "Causes: corrupted download files, a corrupted component store, a corrupted system volume, antivirus interference or truncated downloads."
  - "Back up the OS disk first, then work in order: clear SoftwareDistribution Download, DISM /Online /Cleanup-Image /RestoreHealth, sfc /scannow, chkdsk C: /f /r."
  - "Restart and retry the update after each step, and only go to the next step if it still fails."
  - "For Azure VMs, the next steps are the Azure VM Windows Update Reset Tool under Run command, then a repair VM with offline DISM, chkdsk and sfc."
faq:
  - q: "What does error 0x80070570 mean?"
    a: "It is ERROR_FILE_OR_DIRECTORY_CORRUPTED. Microsoft Learn says Windows cannot read or process the files required to install an update. It typically comes from corrupted update cache files, a damaged component store, disk errors or interference from security software."
  - q: "How do I confirm this error in the logs?"
    a: "Review WindowsUpdate.log or CBS.log for entries such as Failed to internally open package with HRESULT 0x80070570 - ERROR_FILE_OR_DIRECTORY_CORRUPTED. You can also run sfc /verifyonly in a Command Prompt window to scan system files for issues."
  - q: "What is the first fix to try?"
    a: "Clear the Windows Update download cache. Stop the wuauserv and bits services, delete the %windir%\\SoftwareDistribution\\Download folder, start bits and wuauserv again, restart the computer and retry the update."
  - q: "What if clearing the cache does not help?"
    a: "Repair the component store with DISM /Online /Cleanup-Image /RestoreHealth, then run sfc /scannow, then check the disk with chkdsk C: /f /r. Restart and retry after each step. By default DISM uses Windows Update as the repair source."
  - q: "What is different on Azure virtual machines?"
    a: "If the steps fail on an Azure VM, Learn adds two steps: the Azure VM Windows Update Reset Tool, which you can run from the VM page with Operations and Run command, and a repair VM where you attach the OS disk and run offline DISM, chkdsk and sfc."
---

Error 0x80070570 is a corruption error. Windows tried to use a file that it needs for an update, and could not read it. The Microsoft Learn page on this error gives five causes and a six-step resolution that goes from the cheapest fix to the most involved. This article follows that order.

## Symptoms

An update installation fails and error code `0x80070570` is reported. For more detail, Learn suggests:

1. Open WindowsUpdate.log or CBS.log and look for entries such as:

   ```text
   Error   CBS   Failed to internally open package. [HRESULT = 0x80070570 - ERROR_FILE_OR_DIRECTORY_CORRUPTED]
   Info    CBS   Failed to resolve package [Package_for_KB5XXXXXX...] [HRESULT = 0x80070570]
   ```
2. Open a Command Prompt window and run `sfc /verifyonly` to scan the system files for issues.

## Causes

- Downloaded update files in `%windir%\SoftwareDistribution\Download` are corrupted.
- The Windows component store in `%windir%\WinSxS` contains corrupted manifests or files.
- The system volume is corrupted, for example bad sectors or file system errors.
- An antivirus or security application interferes when Windows Update extracts files from downloaded packages.
- The update files are truncated or partial because the download was interrupted.

`%windir%` is the Windows system folder, by default C:\Windows.

## Before you start

Back up the operating system disk. For VMs, Learn points to its page on Azure Virtual Machine restore.

## Step 1: Clear the Windows Update cache

This deletes corrupted download files so that Windows downloads new copies. In a Command Prompt window:

```console
net stop wuauserv
net stop bits
rd /s /q %windir%\SoftwareDistribution\Download
net start bits
net start wuauserv
```

Restart the computer and try the update again. If it still fails, go to step 2.

## Step 2: Repair the component store

```console
DISM /Online /Cleanup-Image /RestoreHealth
```

By default DISM uses Windows Update as the repair source. Learn points to its page Repair a Windows Image for other sources. Restart and try the update again. If it fails, go to step 3.

## Step 3: Check system file integrity

```console
sfc /scannow
```

If it finds problems, Learn links the Microsoft Support page on using the System File Checker tool. When the command finishes without errors, restart and try the update again. If it fails, go to step 4.

## Step 4: Check disk integrity

1. Run `chkdsk C: /f /r` in a Command Prompt window.
2. Confirm when prompted that the operating system disk should be scanned at the next restart.
3. Restart. The tool repairs the problems it finds.
4. After it finishes, restart again and try the update.

On an Azure VM where you monitor and remediate disk health in the Azure portal, you still have to restart the VM that uses the disk. If the update still fails, a VM goes to step 5. For other machines, Learn says to contact Microsoft Support.

## Step 5 (Azure): Run Command reset tool

Try the Azure VM Windows Update Reset Tool. You can run it from the VM's page in the Azure portal with **Operations** > **Run command**, without signing in to the VM. The tool resets the Windows Update servicing stack, which clears memory-related lock states in the update agent. Then try the update again.

## Step 6 (Azure): Use a repair VM

If the reset tool does not fix it, or the VM cannot start:

1. Create a repair VM with the Azure VM repair commands.
2. Attach the affected OS disk to the repair VM.
3. With an offline operating system image available, run `DISM /Image:<Drive>:\ /Cleanup-Image /RestoreHealth`, where `<Drive>` is the drive letter of the affected OS disk.
4. Run `chkdsk <Drive>: /f /r`.
5. Run `sfc /scannow /offwindir <Drive>:%windir%`.
6. Reattach the repaired disk to the original VM.
7. Try the update again. If it still fails, contact Microsoft Support.

## Summary table

| Step | Command or action | Targets |
| --- | --- | --- |
| 1 | Stop wuauserv and bits, delete SoftwareDistribution\Download, restart services | Corrupted or partial downloads |
| 2 | DISM /Online /Cleanup-Image /RestoreHealth | Component store |
| 3 | sfc /scannow | System files |
| 4 | chkdsk C: /f /r | Disk and file system |
| 5 | Azure VM Windows Update Reset Tool | Servicing stack (Azure VMs) |
| 6 | Repair VM with offline DISM, chkdsk, sfc | VMs that cannot be repaired online |

## Working notes (my advice)

This is my suggestion, not guidance from the page:

- Keep the CBS.log excerpt from before your first fix. If the error returns, you can compare it with a new one.
- Restart between steps as the page says, and note which step changed the outcome.
- If many machines show the same error for the same update, think of a shared cause, such as a security product that scans downloaded packages, and not of single disks. The page lists antivirus interference as a cause but gives no check for it.
- On physical machines with repeated corruption after chkdsk, treat the disk as suspect and plan its replacement.
- For fleets, apply step 1 as a script first, since it is the cheapest fix. Run the steps in the page's order.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)

## Sources

- [Troubleshoot Windows Update Error 0x80070570 (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/installing-updates-features-roles/troubleshoot-windows-update-error-0x80070570)
