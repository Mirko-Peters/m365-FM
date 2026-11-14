---
title: "Fix Windows Update Error 0x80070005 (Access Denied)"
summary: "0x80070005 (E_ACCESSDENIED) means the update process cannot reach required files, folders or registry entries. Read the logs, then the Learn steps: reset permissions, TrustedInstaller ownership, reset components, DISM, SFC, filter drivers, Azure VM steps."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [windows-update-for-business, group-policy]
keypoints:
  - "0x80070005 is E_ACCESSDENIED. The Learn page says the update process cannot access required files, folders or registry entries, which typically indicates a permissions problem."
  - "Causes named: TrustedInstaller permissions, registry permissions, third-party antivirus locks, SYSTEM without Full Control on the Windows folder, Group Policy or a management agent."
  - "Step 1 resets permissions on WinSxS and SoftwareDistribution with icacls, step 2 sets TrustedInstaller as owner of WinSxS. Restart and retry after each step."
  - "Later steps: reset Windows Update components, DISM RestoreHealth, sfc /scannow, and check third-party filter drivers with fltmc."
  - "Back up the operating system disk before you start. Steps 7 and 8 apply to Azure VMs only."
faq:
  - q: "What does 0x80070005 mean?"
    a: "It is E_ACCESSDENIED. The Microsoft Learn page says it occurs if the update process cannot access required files, folders or registry entries, and that it typically indicates a permissions problem affecting the component store, the Software Distribution folder or related system resources."
  - q: "How do I confirm that it is this error?"
    a: "Open WindowsUpdate.log or CBS.log and look for entries such as Failed to create file with HRESULT 0x80070005 - E_ACCESSDENIED. To get a static copy of the Windows Update log, run Get-WindowsUpdateLog in PowerShell and search the output for 0x80070005."
  - q: "What should I do first?"
    a: "Back up the operating system disk, then run the icacls reset commands for the WinSxS and SoftwareDistribution folders in an administrative Command Prompt window, restart and try the update again. The page says to go to the next step only if the update still does not install."
  - q: "Could my antivirus be the cause?"
    a: "The page lists a third-party antivirus or security tool that locked update-related files or folders as one cause. Step 6 says to temporarily disable real-time antivirus protection, list file system filter drivers with fltmc, and temporarily unload non-Microsoft filter drivers."
  - q: "Does this apply to Azure virtual machines?"
    a: "Yes. The page covers supported versions of Windows client, Windows Server and Azure VMs. Steps 7 and 8 are Azure only: the Azure VM Windows Update Reset Tool through Run command, and a repair VM when that does not work or the VM cannot start."
---

Windows Update error 0x80070005 is E_ACCESSDENIED: the update installation fails because something cannot be read or written. The Microsoft Learn page on this error gives a fixed order of steps. This article follows it, with the commands as the page gives them, and adds a few cautions that are my own and marked so.

## What the page says

The page says the error occurs if the update process cannot access required files, folders or registry entries. It typically points to a permissions problem that affects the Windows component store, the Software Distribution folder or related system resources. The steps apply to supported versions of Windows client, Windows Server and Azure virtual machines.

## Confirm the error in the logs

1. Open `WindowsUpdate.log` or `CBS.log` and look for entries like these:

   ```output
   Error  CBS  Failed to create file. [HRESULT = 0x80070005 - E_ACCESSDENIED]
   Error  CBS  Failed to internally open package. [HRESULT = 0x80070005 - E_ACCESSDENIED]
   ```

2. For the Windows Update log, run this in a PowerShell window to write a static copy, then search the output for `0x80070005`:

   ```powershell
   Get-WindowsUpdateLog
   ```

## Causes the page names

- The TrustedInstaller service account does not have permissions on the `%windir%\WinSxS` folder or the `%windir%\SoftwareDistribution` folder.
- The permissions on the registry subkey `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing` are not correct.
- A third-party antivirus or security tool locked update-related files or folders.
- The SYSTEM account does not have Full Control on the `%windir%` folder.
- A Group Policy setting or a management agent restricted write access to system directories.

`%windir%` is the Windows system folder, by default `C:\Windows`.

## Before you start

The page says to back up the operating system disk first. For VMs it links the Azure VM restore documentation. In my experience, a permission reset on system folders is the kind of change you want a way back from, so do not skip this.

## Step 1: Reset the permissions on the component store

In an administrative Command Prompt window:

```console
icacls "%windir%\WinSxS" /reset /t /c /q
icacls "%windir%\SoftwareDistribution" /reset /t /c /q
```

Restart the computer and try the update again. If it still fails, go on.

## Step 2: Make TrustedInstaller the owner of WinSxS

```console
icacls "%windir%\WinSxS" /setowner "NT SERVICE\TrustedInstaller" /t /c /q
```

Restart and try again.

## Step 3: Reset the Windows Update components

```console
net stop wuauserv
net stop bits
net stop cryptSvc

ren %windir%\SoftwareDistribution SoftwareDistribution.old
ren %windir%\System32\catroot2 catroot2.old

net start cryptSvc
net start bits
net start wuauserv
```

Restart and try again. The page does not say what to do with the renamed `.old` folders afterward. I would keep them until the update works, since they hold the old state.

## Step 4: Repair the component store

```console
DISM /Online /Cleanup-Image /RestoreHealth
```

The page notes that DISM uses Windows Update as its repair source by default, and links its article on repairing a Windows image for another source. Restart and try again.

## Step 5: Check system file integrity

```console
sfc /scannow
```

If it finds problems, the page links the Support article on the System File Checker tool. After it finishes without errors, restart and try again.

## Step 6: Check for third-party interference

1. Temporarily disable real-time antivirus protection on the affected computer.
2. List the file system filter drivers with `fltmc`.
3. If a non-Microsoft filter driver is listed, unload it temporarily with `fltmc unload <DriverName>`, using the name from the list.
4. Restart and try again.

If several non-Microsoft drivers are listed, repeat the unload for each one. If the computer is a VM, go to step 7. Otherwise the page says to contact Microsoft Support.

Remember to turn antivirus protection back on after the test. That reminder is mine, not the page's.

## Step 7: Azure VM Windows Update Reset Tool

For an Azure VM, the page points to the Azure VM Windows Update Reset Tool. You can run it from the VM's page in the Azure portal under **Operations** > **Run command**, without signing in to the VM. The page says it resets the Windows Update servicing stack and clears memory-related lock states in the update agent. Try the update again afterward.

## Step 8: Use a repair VM (Azure)

If the reset tool does not help, or the VM cannot start:

1. Create a repair VM with the Azure VM repair commands.
2. Attach the affected OS disk to the repair VM.
3. Run the two `icacls /reset` commands from step 1 and the `/setowner` command from step 2.
4. Make sure you have an offline OS image, then run `DISM /Image:<Drive>:\ /Cleanup-Image /RestoreHealth`, where `<Drive>` is the drive letter of the affected OS disk.
5. Do the antivirus and `fltmc` checks from step 6 for the affected computer.
6. Reattach the repaired disk to the original VM and try the update again. If it fails, contact Microsoft Support.

## Summary of the order

| Step | Action |
| --- | --- |
| 1 | `icacls` reset on WinSxS and SoftwareDistribution |
| 2 | TrustedInstaller as owner of WinSxS |
| 3 | Reset Windows Update components |
| 4 | DISM RestoreHealth |
| 5 | `sfc /scannow` |
| 6 | Antivirus and filter drivers |
| 7 | Azure only: Reset Tool |
| 8 | Azure only: repair VM |

## Notes on use at scale (my advice)

This is my suggestion, not guidance from the page:

1. Because the page names Group Policy and management agents as causes, check what writes to system folders before you run the steps on one machine and move on. Resetting permissions by hand does not stop a policy from changing them again.
2. Keep the exact step at which the update started to work. If it was step 1, a permissions change is likely at work, and the same cause may hit other computers.
3. Do not run these steps on many computers at once before one has been tested and has a backup.
4. For servers, schedule the work in a maintenance window, since every step asks for a restart.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)

## Sources

- [Troubleshoot Windows Update Error 0x80070005 (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/windows-client/installing-updates-features-roles/troubleshoot-windows-update-error-0x80070005)
