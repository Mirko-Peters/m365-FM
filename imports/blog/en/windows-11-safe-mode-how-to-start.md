---
title: "Windows 11 Safe Mode: How to Start It, Use It and Get Out Again"
summary: "Windows 11 safe mode explained: three ways to boot into it, the F4, F5 and F6 choices, what to fix there, and how to leave it if the PC keeps booting back in."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [windows-update-for-business]
keypoints:
  - "Microsoft's page for starting a PC in safe mode uses the Windows Recovery Environment: Troubleshoot, Advanced options, Startup Settings, Restart, then press 4, 5 or 6 (or F4, F5, F6)."
  - "Four is plain Safe Mode, five is Safe Mode with Networking, and six is Safe Mode with Command Prompt. Pick networking only when you need the internet."
  - "To reach Windows RE, use Settings, System, Recovery, Advanced startup, Restart now, or hold Shift while you select Restart. A PC that won't start can enter it after two forced shutdowns."
  - "A BitLocker-encrypted device asks for the recovery key, so find the key before you begin."
  - "Restart to leave safe mode. If it comes back, open msconfig, go to the Boot tab and clear Safe boot."
faq:
  - q: "How do I start Windows 11 in safe mode?"
    a: "Open Windows RE, for example with Settings, System, Recovery, Advanced startup, Restart now. Then select Troubleshoot, Advanced options, Startup Settings and Restart. On the Startup Settings screen press 4 or F4 for Safe Mode, 5 or F5 for Safe Mode with Networking, or 6 or F6 for Safe Mode with Command Prompt."
  - q: "How do I get out of safe mode in Windows 11?"
    a: "Restart the device. That should return it to normal mode. If it boots into safe mode again, press Windows key and R, type msconfig, select OK, open the Boot tab and clear the Safe boot checkbox under Boot options. Apply the change and restart once more to confirm that Windows starts normally."
  - q: "What is the difference between safe mode and a clean boot?"
    a: "Safe mode starts Windows with a limited set of files and drivers. A clean boot starts normal Windows but lets you switch off non-Microsoft services and startup items in msconfig and Task Manager. Microsoft says a clean boot gives greater control for isolating the source of a problem than safe mode."
---
To start Windows 11 in safe mode, open the Windows Recovery Environment, select **Troubleshoot** > **Advanced options** > **Startup Settings** > **Restart**, and press **4** (or F4) on the Startup Settings screen. Press **5** for Safe Mode with Networking, or **6** for Safe Mode with Command Prompt. This article is for Windows users whose PC crashes, loops or misbehaves after an update or a driver change, and for help desk staff who talk someone through it by phone. It covers three ways in, the choices on the menu, what to fix once you're there, and how to leave without getting stuck.

Microsoft describes safe mode as starting Windows in a basic state, using a limited set of files and drivers. That's the whole idea. If a problem disappears in safe mode, the cause is probably something that doesn't load there, such as a driver, a startup program or a recent update. If the problem is still there, the cause is more likely in the core of Windows or in the hardware.

## What safe mode is for

Think of safe mode as a test, not a place to work. You start Windows with less, see whether the trouble stays, and then change one thing at a time. Typical reasons to use it:

- A blue screen or restart loop that began after a driver or update.
- A startup program that freezes the desktop.
- A display driver that leaves the screen unusable.
- System files that need a repair scan.

Microsoft's troubleshooting guide for startup problems puts it the same way: if the PC starts in Safe Mode or Safe Mode with Networking, use Event Viewer to help find the cause of the startup problem. Safe mode gives you a clean enough system to read the logs and to remove what broke it.

One thing to know before you begin: if the device is encrypted, you need your BitLocker recovery key to complete the change, according to Microsoft's startup pages. Find the key first. A PC that asks for a key you can't produce is a bigger problem than the one you started with.

## Three ways to reach safe mode

Microsoft's page [Start your PC in safe mode in Windows](https://support.microsoft.com/en-us/windows/start-your-pc-in-safe-mode-in-windows-92c27cff-db89-8644-1ce4-b3e5e56fe234) documents one route: through the Windows Recovery Environment, called Windows RE. Everything below is a different door into that same room. Microsoft's page on the [Windows recovery environment](https://support.microsoft.com/en-us/windows/experience/backup-recovery/windows-recovery-environment) lists the doors.

### 1. From Settings (Windows still starts)

1. Open **Settings** > **System** > **Recovery**.
2. Under **Recovery options**, next to **Advanced startup**, select **Restart now**.
3. When the blue menu appears, select **Troubleshoot** > **Advanced options** > **Startup Settings** > **Restart**.
4. On the Startup Settings screen, press the key for the mode you want (see the next section).

On Windows 10, Microsoft names the path **Update & Security** > **Recovery** instead.

### 2. With the Shift key

Hold **Shift** while you select **Power** > **Restart**. Windows restarts into Windows RE, and you continue with Troubleshoot, Advanced options, Startup Settings and Restart. Microsoft's page gives this method without naming a screen. The Power menu is also on the sign-in screen, and many guides use it there when a user can't get to the desktop, but I didn't find Microsoft naming the sign-in screen as a starting point, so treat that as a likely rather than a documented route.

### 3. When Windows will not start

Windows enters Windows RE by itself after repeated failed starts. You can also force it. Microsoft's instructions:

1. When the Windows logo or the manufacturer's logo appears, hold the power button to shut the PC down.
2. Repeat that two times.
3. On the third start, the Automatic Repair screen appears. Select **Advanced options**.
4. Continue with **Troubleshoot** > **Advanced options** > **Startup Settings** > **Restart**.

Some guides say to do it three times and expect repair on the fourth boot. Microsoft's page says twice and the third start, so use that. If your device behaves differently, the manufacturer may have configured it that way.

Other doors from the same Microsoft page:

- **A hardware recovery button.** Some devices have a dedicated button or key combination, usually set up by the manufacturer.
- **A recovery drive.** Boot from the USB recovery drive and it opens Windows RE directly.
- **Installation media.** On a working PC, create installation media with the Media Creation Tool. On the broken PC, boot from it, select **Next** on the setup screen and then **Repair my PC** > **Next**.

The installation-media route is the fallback when the built-in recovery files are damaged. It needs a second working PC and a USB drive, so it's a good job to do before you need it.

## Pick the right mode on the Startup Settings screen

After the restart, Microsoft's [Windows startup settings](https://support.microsoft.com/en-us/windows/experience/startup-boot/windows-startup-settings) page says you choose with the number keys or with F1 to F9. Press **Enter** instead to start Windows normally. The list is:

1. Enable debugging. An advanced troubleshooting mode for IT professionals and administrators.
2. Enable boot logging. Creates `ntbtlog.txt`, a list of the drivers installed during startup.
3. Enable low-resolution video. Uses your current video driver with a low resolution and refresh rate, which is useful for resetting display settings.
4. Enable Safe Mode.
5. Enable Safe Mode with Networking.
6. Enable Safe Mode with Command Prompt.
7. Disable driver signature enforcement. Allows drivers with improper signatures to install.
8. Disable early launch anti-malware protection. Temporarily turns off the protection that normally starts anti-malware software before other third-party boot components.
9. Disable automatic restart after failure. Microsoft says to use this only if Windows is stuck in a loop of failing and restarting.

The three safe mode choices differ like this:

- **Safe Mode (4 or F4).** Windows with a limited set of files and drivers. This is the default choice. Start here.
- **Safe Mode with Networking (5 or F5).** The same, plus the network drivers and services that you need to reach the internet and other computers on your network. Choose it when you must download a driver or reach a file share.
- **Safe Mode with Command Prompt (6 or F6).** Safe mode with a command prompt window in place of the usual Windows interface. Choose it for command-line repairs, or when the desktop itself is the problem.

Which one first? Use the plain one when you can. Add networking only when you need it, because every extra service that loads is one more thing that might be the cause. If a malware infection is a possibility, think before you connect. That is my caution and not a Microsoft statement.

Settings 2, 3 and 9 are worth remembering as separate tools. Low-resolution video helps when a bad display setting leaves the screen unreadable. Boot logging produces a driver list to check after a failed start. Disabling automatic restart lets you read a stop error instead of watching the PC reboot before you can note it. Settings 7 and 8 lower protection. Use them only when you know why, and turn them off again by restarting normally.

## What to do inside safe mode

Once Windows is running, change one thing, then restart normally and test.

### Roll back or reinstall a driver

If trouble began after a driver update, this is the first stop. Microsoft's page on [updating drivers through Device Manager](https://support.microsoft.com/en-us/windows/update-drivers-through-device-manager-in-windows-ec62f46c-ff14-c91d-eead-d7126dc1f7b6) gives the steps. You need administrator permission.

1. Right-click the Start button and select **Device Manager**.
2. Expand the category of the device that gives trouble.
3. Right-click the device and select **Properties**, then open the **Driver** tab.
4. Select **Roll Back Driver**, pick a reason when asked, and select **Yes**.
5. Restart if prompted.

If rollback isn't available, the same page describes **Uninstall device**: right-click the device, select **Uninstall device**, confirm, and restart so that Windows tries to reinstall the driver. Microsoft's page doesn't say how Device Manager behaves in safe mode, so if a driver doesn't show up there, don't assume it's gone.

### Remove a recent Windows update

Windows RE has an **Uninstall Updates** option under Advanced options, which Microsoft describes as removing recently installed Windows updates. It lives in the same menu you used to get here, so you can use it without ever reaching the desktop. I didn't open a Microsoft page for the Settings route to uninstall updates, so I'm not giving a path for it here.

### Repair system files

Microsoft's page on the [System File Checker](https://support.microsoft.com/en-us/topic/use-the-system-file-checker-tool-to-repair-missing-or-corrupted-system-files-79aa86cb-ca52-166a-92a3-966e85d4094e) says to run DISM before SFC, in a Command Prompt that you open as administrator:

1. Run `DISM.exe /Online /Cleanup-image /Restorehealth`. It can take several minutes and uses Windows Update by default.
2. Run `sfc /scannow` and keep the window open until the scan reaches 100 percent.

Safe mode shows up on that page for one case. If SFC reports "Could not perform the requested operation", the page says to run the scan in safe mode. Note that DISM with a repair source or Windows Update needs a connection, so Safe Mode with Networking may be the better choice for that step. The page doesn't state this, so it's an inference.

If Windows can't start at all, you can run the checks from Windows RE. Microsoft's startup troubleshooting guide gives the offline form `SFC /Scannow /OffBootDir=C:\ /OffWinDir=C:\Windows` and mentions `chkdsk /f /r`. Drive letters in Windows RE can differ from what you see in Windows, so check the letter before you run anything. That warning is mine.

### Let Windows try Startup Repair

If the PC won't boot even into safe mode, try **Troubleshoot** > **Advanced options** > **Startup Repair** > **Restart** from Windows RE. Microsoft's Startup Repair page says it scans for startup problems such as missing or damaged system files, corrupted boot configuration data, a damaged master boot record, incompatible drivers and registry errors. If it can't fix the problem, it gives a report. The troubleshooting guide names the log as `%windir%\System32\LogFiles\Srt\Srttrail.txt`.

### Use safe mode to find the cause

If the PC works in safe mode, open Event Viewer and read the System log around the time of the failure. Microsoft's guide suggests exactly that. Then compare. Which driver or service appears just before the crash? Which update was installed that day? That tells you what to remove or roll back.

## How to leave safe mode

Restart the device. Microsoft says this should return it to normal mode. If it boots into safe mode again:

1. Press **Windows key + R**.
2. Type `msconfig` in the **Open** box and select **OK**.
3. Open the **Boot** tab.
4. Under **Boot options**, clear the **Safe boot** checkbox.
5. Select **Apply** and **OK**, then restart.

That checkbox is also a way to force safe mode on every start, which some people use for repeated tests. The same checkbox then keeps you there until you clear it, which explains many "I'm stuck in safe mode" reports. The sub-options under Safe boot in that dialog, such as Minimal and Network, are not described on the Microsoft pages I opened, so I'm not explaining them here.

If msconfig can't be reached, Microsoft's article on a machine that keeps booting into safe mode gives a command for an administrator Command Prompt: `bcdedit /deletevalue {default} safeboot`. Read the caveat. That article is written for Windows Server and the older versions it names, not for Windows 11, so I can't confirm it from Microsoft for Windows 11. Microsoft's page on BCDEdit also warns that changing some boot options can make a computer inoperable, and suggests msconfig as the alternative. Try msconfig first, and use bcdedit only when you've no other way in.

## Safe mode or a clean boot?

They solve different problems. Microsoft's page on performing a clean boot says a clean boot gives you greater control than starting Windows in safe mode when you want to isolate the source of a problem. The steps, in short: in msconfig, hide Microsoft services on the Services tab and disable the rest, disable the startup items in Task Manager, and restart. To go back, choose normal startup on the General tab, enable the services and the startup items again, and restart.

Use safe mode when Windows doesn't run normally at all. Use a clean boot when Windows runs but you suspect a program or service that you installed.

## For help desk and admins

A few notes from the Microsoft pages that matter at scale:

- **BitLocker.** Both startup pages say an encrypted device needs the recovery key for this task. Know where your keys are stored before users call. Keeping them escrowed with your management tool is general good practice and not something those pages specify.
- **Phone support.** Ask the user to read the screen. The blue menu says Choose an option, then Troubleshoot, then Advanced options. Walk them through Startup Settings and the number to press.
- **Bad update on many PCs.** Safe mode fixes one PC at a time. Microsoft's page on Windows Update client policies (the service was formerly called [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)) says admins can defer feature updates up to 365 days and quality updates up to 30 days, and pause an update for 35 days from a start date until an issue is fixed. That page doesn't describe uninstalling updates, so removing a bad update is still a separate job per device or through your own tooling.
- **Windows 10 devices.** The recovery path starts at Update & Security instead of System, and support for Windows 10 ended on October 14, 2025.

## Common mistakes

- Forgetting that a BitLocker-encrypted PC asks for the recovery key.
- Forcing shutdowns more times than needed. Microsoft says twice, and Automatic Repair appears on the third start.
- Choosing networking when the plain mode would do.
- Changing several things in one session, so you can't tell which one fixed the problem.
- Leaving the Safe boot checkbox set in msconfig and then wondering why the PC always starts in safe mode.
- Using the driver signature or anti-malware options (7 and 8) and not noting that they lower protection.
- Trusting bcdedit commands from old articles without checking that they apply to Windows 11.
- Expecting the old F8 menu. Microsoft's startup guide lists a `bcdedit` setting for when F8 doesn't work, but the documented route on Windows 11 is Windows RE as described above.

## Related topics to explore

- **Startup Repair.** What it fixes and how to read its log.
- **Clean boot.** Isolating a service or startup app on a PC that still runs.
- **Windows Recovery Environment.** Reset this PC, System Restore and the other Advanced options.
- **Driver rollback.** Device Manager steps for a specific device class.
- **Windows Update policies.** Deferral and pause settings, covered on the [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/) page.

## Next step

Before you need it, write down where your BitLocker recovery key is and try the Settings route to Startup Settings once, then press Enter to boot normally. That way you know what the screens look like. When trouble comes, start with plain Safe Mode, change one thing, and restart to test.
