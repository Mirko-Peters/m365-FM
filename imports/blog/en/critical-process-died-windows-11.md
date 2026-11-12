---
title: "Critical Process Died in Windows 11: Causes and Fixes"
summary: "Critical process died in Windows 11 means a core system process stopped and Windows crashed. Fix it in order: safe mode, drivers, updates, SFC and DISM."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-update-for-business]
keypoints:
  - "CRITICAL_PROCESS_DIED is bug check 0xEF. It means a process Windows can't run without, such as csrss.exe or wininit.exe, terminated because its state was corrupted or damaged."
  - "Start with the easy causes: unplug newly added hardware, boot into Safe Mode, update or remove drivers with a yellow exclamation point, free disk space and install Windows updates."
  - "Run DISM /Online /Cleanup-Image /RestoreHealth first and then sfc /scannow in a Command Prompt run as administrator to repair damaged system files."
  - "If the PC can't start, use the Windows Recovery Environment: Startup Repair, Uninstall Updates, point-in-time restore, System Restore or Reset this PC. Keep your BitLocker key handy."
  - "Admins can pause a problem update for up to 35 days with Windows Update client policies while they investigate."
faq:
  - q: "What does CRITICAL_PROCESS_DIED mean in Windows 11?"
    a: "It is bug check 0xEF. Microsoft says it indicates that a critical system process terminated, which happens when the process state is corrupted or damaged. Windows can't continue without these processes, so it stops with a blue or black screen. The named examples include csrss.exe, wininit.exe, winlogon.exe, smss.exe and services.exe."
  - q: "How do I fix critical process died when Windows won't start?"
    a: "Open the Windows Recovery Environment. Windows enters it by itself after several failed starts, or you can interrupt startup twice and use the Automatic Repair screen on the third start. Then try Startup Repair, Uninstall Updates, a restore point or Safe Mode through Startup Settings. Reset this PC is the last resort."
  - q: "Can a Windows update cause critical process died?"
    a: "It can happen after an update, and Microsoft's own guidance lists recently added drivers, patches and system services as things to remove or check. In Recovery you can uninstall updates. If you manage devices, Windows Update client policies let you pause an update for up to 35 days so other PCs don't install it."
---
Critical process died means that a process Windows can't run without has stopped, so Windows crashed with a stop code. The fix is to work from the cheap checks to the heavy ones: unplug new hardware, start in Safe Mode, fix drivers, install updates, repair system files with DISM and SFC, and only then restore or reset the PC. This article is for Windows users and help desk staff. It follows the order Microsoft documents and shows what to do when the PC no longer reaches the desktop.

## What the CRITICAL_PROCESS_DIED stop code means

The error is bug check 0xEF. Microsoft's reference says it indicates that a critical system process terminated, which happens when the state of the process is corrupted or damaged. Because these processes are central to Windows, the system stops to protect itself. The page names csrss.exe, wininit.exe, logonui.exe, smss.exe, services.exe, conhost.exe and winlogon.exe as examples, and notes that a service whose recovery option is set to **Restart the Computer** can trigger the same stop code.

The reference does not name a single root cause, and the Microsoft troubleshooting guide doesn't either. That matters for how you troubleshoot. There is no one switch to flip. A driver, a failed update, damaged system files, a hardware fault or malware can all lead to a critical process dying, so the plan is to rule them out one by one.

What you see depends on the version. According to Microsoft's page on [unexpected restarts and stop code errors](https://support.microsoft.com/en-us/windows/experience/performance-optimization/troubleshooting-windows-unexpected-restarts-and-stop-code-errors), Windows 11 24H2 and later shows a black screen with an unexpected-error message, while Windows 11 23H2 and older shows the traditional stop code screen. The stop code is at the bottom of the screen, together with the module name of the failing code when it's available. Write it down or take a photo.

## The basic steps, in Microsoft's order

Microsoft's guide for stop code errors lists six basic steps. Do them in this order.

1. Remove new hardware. If you added something before the error began, shut down, remove it and restart. That covers docks, USB devices, extra memory and cards.
2. Start in Safe Mode. If you can't restart normally, boot into Safe Mode and do the remaining steps from there. In the recovery environment, choose **Troubleshoot**, **Advanced options**, **Startup Settings**, then **Restart**. On the Startup Settings screen press 4 or F4 for Safe Mode, or 5 or F5 for Safe Mode with Networking.
3. Check Device Manager. Right-click the Start button and open Device Manager. Look for devices with a yellow exclamation point. Right-click one and choose **Update driver**. If that doesn't help, disable or uninstall the device.
4. Free up disk space. Microsoft suggests keeping roughly 10% to 15% of the drive free, because Windows uses space for swap files and other functions.
5. Install Windows updates. Go to **Settings**, **Windows Update** and select **Check for updates**.
6. Restore Windows. If nothing above works, use a restore point or another option from Microsoft's recovery options article.

Microsoft's bug check page adds more ideas that apply here. Remove or update recently added device drivers or system services. Check the System log in Event Viewer for errors in the same time window as the crash. Check for an updated BIOS or firmware, and run the manufacturer's hardware diagnostics. Confirm that new hardware is compatible with your Windows version, and run a virus scan that includes the Master Boot Record.

## Repair system files with DISM and SFC

Damaged system files are one reason a critical process dies, and two built-in tools address them. Microsoft's page on the [System File Checker](https://support.microsoft.com/en-us/windows/experience/backup-recovery/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system-files) says to run DISM first, because DISM supplies the files SFC needs.

1. Type `cmd` in the search box, right-click **Command Prompt** and select **Run as administrator**.
2. Run `DISM.exe /Online /Cleanup-Image /RestoreHealth` and wait for it to finish. Microsoft says it can take several minutes.
3. In the same window, run `sfc /scannow` and keep the window open until the scan reaches 100%.

Read the result. "Windows Resource Protection did not find any integrity violations" means no missing or corrupted files were found. If it could not perform the requested operation, Microsoft says to run the scan in Safe Mode. If it found corrupt files and repaired them, the log has details. If some files couldn't be fixed, the log tells you which. It's at `%windir%\Logs\CBS\CBS.log`, and Microsoft shows a `findstr` command that exports the SFC entries to a text file on your desktop.

When Windows Update is broken, DISM can use another repair source such as a mounted Windows DVD, with `/Source` and `/LimitAccess`. If SFC still can't repair files, the page's last advice is to reinstall Windows using the recovery options.

## When Windows 11 won't boot

If the PC shows the stop code on every start, you have to work from the Windows Recovery Environment. Windows enters it on its own after several failed starts. You can also force it: turn the PC on, hold the power button as soon as the logo appears, and repeat once. On the third start, the **Automatic Repair** screen appears, where you select **Advanced options**.

Microsoft's page on [recovery options in Windows](https://support.microsoft.com/en-us/windows/experience/backup-recovery/recovery-options-in-windows) lists these tools for a PC that won't start, in order:

1. Point-in-time restore (**Troubleshoot**, **Point-in-time restore**), listed for Windows 11, version 24H2 or later.
2. **Uninstall updates** (**Troubleshoot**, **Advanced options**, **Uninstall updates**). Useful if the crash started right after a Windows update.
3. **Reset this PC** (**Troubleshoot**, **Reset this PC**).
4. **Cloud rebuild**, which removes personal files, apps and settings.
5. Reinstall from recovery media.

System Restore is also available: it rolls back system files and settings, but not personal files. Startup Repair sits under **Troubleshoot**, **Advanced options**. Microsoft says it can fix missing or damaged system files, corrupted boot configuration data, a damaged master boot record, incompatible drivers and registry errors, and it gives you a report if it can't fix the problem.

If the drive is encrypted with BitLocker, expect to be asked for the recovery key. Find it on another device before you start. Resetting or reinstalling erases things, so copy off what you can first. If the PC starts in Safe Mode, use that to back up your files before you try anything drastic.

## Look at what changed

A crash rarely comes from nowhere. Ask what changed in the days before the first blue screen. A new graphics or storage driver, a Windows update, a new peripheral, an app that installs its own driver, or a security tool are all candidates. In Event Viewer, check the System log around the time of the crash. If the crash started after a specific update, you can uninstall it from the recovery environment, as listed above.

For help desk work, one more habit pays off: write down the stop code, the module name if one is shown, what changed and what you tried. If the same PC crashes again, the pattern will point to the cause. Microsoft's bug check page says that finding the cause for this stop code typically requires a debugger. It suggests examining multiple dump files for similar characteristics, using `!analyze`, and examining user mode dumps first when available. Don't spend hours on that for a single home PC. Do it when the same issue hits many devices.

## For admins: stop the update from spreading

If a quality or feature update looks like the trigger across several devices, pause it. Microsoft's page on Windows Update client policies (formerly Windows Update for Business) says an admin can pause an update for up to 35 days from a chosen start date, which stops other devices from installing it. Pausing feature updates doesn't stop quality updates, so devices stay secure. The policies are free for Pro, Pro for Workstations, Education and Enterprise editions and are configured through Group Policy or MDM such as Intune. [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/) is the control point here: deferrals can delay feature updates for up to 365 days and quality updates for up to 30 days, so you can stage a rollout in waves instead of hitting everyone at once.

Microsoft's page doesn't explain how to roll back a problem update, so use the recovery steps above for the affected PCs.

## Common mistakes

- Starting with a reset. It's the last step, not the first.
- Running sfc /scannow without running DISM first, then wondering why SFC can't repair anything.
- Running the commands in a normal Command Prompt window. They need to run as administrator.
- Ignoring recently added hardware because "it worked fine before".
- Forgetting the BitLocker recovery key before using recovery tools.
- Not writing down the stop code and module name.

## Related topics to explore

- Why does my PC blue-screen with other stop codes? The troubleshooting steps above apply to most stop codes, and the code at the bottom of the screen narrows it down.
- How do I get into Safe Mode if Windows won't start? Use the recovery environment and Startup Settings, as shown above.
- Should I reset or reinstall? Microsoft's recovery options article puts Reset this PC and Cloud rebuild late in the list for a reason: they remove apps and settings.
- Can I reduce the risk of a bad update? Staged rollouts with deferrals and pauses are the answer for managed devices.

## Next step

Start with the cheap checks today: unplug anything new, update your drivers, and run DISM and then SFC from a Command Prompt run as administrator. If critical process died in Windows 11 keeps coming back after that, move on to the recovery environment and write down what you see on each crash.
