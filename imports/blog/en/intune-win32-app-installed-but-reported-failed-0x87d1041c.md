---
title: "Intune Win32 App Installs but Shows Failed with 0x87D1041C: Fix the Detection Rule"
summary: "A Win32 app installs on the device, yet Intune reports 0x87D1041C because the detection rule does not find it. Compare the rule with what the installer really creates, then fix scope, bitness and format."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [intune]
keypoints:
  - "Intune checks detection before and after the install. If the after-install check fails, the app shows as failed even though it is on the device."
  - "Build the rule from what a manual install really leaves behind, and prefer a simple, machine-wide marker such as an HKLM registry value or a folder."
  - "The 32-bit versus 64-bit option on file and registry rules decides which view of the registry or file system is searched."
  - "A custom detection script counts as detected only with exit code 0 and output on STDOUT, and any output on STDERR turns it into not detected."
faq:
  - q: "What does error 0x87D1041C mean for a Win32 app?"
    a: "In community threads and advisor answers it means the install command finished but the detection rule did not find the app afterwards. The Microsoft Learn error code page lists the code under Android, iOS/iPadOS and an Other installation errors table. The Other entry reads that the installation succeeded but the application is not detected, and it describes the app as deployed by Intune and then uninstalled. The page does not label that table as Win32, so the Win32 reading is not spelled out. For Win32 apps, the useful Learn page is the one on detection rules."
  - q: "If I add several detection rules, does one match suffice?"
    a: "No. Microsoft Learn says the conditions of all detection rules must be met for the app to count as detected. If you need either-or logic, for example a file or a registry value, use a custom detection script."
  - q: "What must a custom detection script return?"
    a: "According to Microsoft Learn, the app is detected only when the script exits with code 0 and writes a string value to STDOUT. A nonzero exit code means not detected, and any data on STDERR also leads to not installed, even if STDOUT has text. Intune does not look for a specific string."
  - q: "How often does Intune try again?"
    a: "Learn says that if a required app is not detected, Intune offers it again within about 24 hours. The Intune Management Extension also checks for new assignments every 8 hours, and you can force a check from Company Portal with Settings, then Sync."
---

You package an app as a `.intunewin` file and assign it as required. The install command runs and the app is on the device. In the Intune admin center the status is still failed, with the message that the application was not detected after installation completed successfully and the code `0x87D1041C`.

This came up in Microsoft Q&A threads between late 2024 and mid 2026. Three of them name the error directly. One described 25 of 26 identical devices detecting the app while one failed. Another had about 2,000 devices failing. A third saw several thousand endpoints reporting the error after an update of an internal app. A fourth thread, from May 2026, is about Win32 installs that fail silently on some devices and does not name this code in its human answers. None of the threads has an accepted answer, and in one of them the asker only solved the problem by recreating the app with a simpler rule. So this article is not a copy of one confirmed fix. It combines the points from the threads with what Microsoft Learn says about detection rules. It is not an official Microsoft procedure.

## What you see

- Intune shows the app as failed, with the error above, on some or all devices.
- On the device, the app is installed and works.
- Re-running the install from Intune does not change the result.
- Often only a share of devices is affected. In the March 2025 thread, the asker wrote that about 3% of devices failed and that most of them were new builds or machines migrated from Windows 10 to Windows 11.

## Why it happens

Microsoft's own description of the Win32 flow, in the support tip on deployment, explains it. The Intune Management Extension (IME) evaluates the detection rules before it downloads anything. If the app is already detected, it skips the install. It then installs, and evaluates the detection rules a second time. The result goes to the service. If the second check does not find what the rule describes, the app is reported as not detected, no matter what the installer said.

One caution on the code itself. The Learn page on app install error codes lists 0x87D1041C with explanations for Android and iOS/iPadOS, and in an Other installation errors table. The Other entry says the installation succeeded but the application is not detected, and it names causes such as a user who removed the app or a self-updating MSI whose version no longer matches. The page does not label that table as Win32. The Win32 reading, "installed but not detected", matches the message text and the threads and advisor answers, but Learn does not confirm it for Win32 apps by name.

## Step 1: Find out what the detection step saw

On an affected device, open the IME log folder: `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs`. Learn lists these files:

- `AppWorkload.log`, which helps troubleshoot and analyze Win32 app deployment activities.
- `IntuneManagementExtension.log`, the main log.
- `AppActionProcessor.log`, which tracks detection and applicability checks for assigned apps.

Open them with CMTrace. Look for the lines of your app and find the detection result after the install. An AI-generated answer in the May 2026 thread suggested comparing these logs from a failing device with those from a working one, which is a sensible check but not a documented procedure.

## Step 2: Check what the install really leaves behind

On a test device that matches the failing ones, install the app by hand with the same command. Learn recommends a manual test install before packaging, to confirm the silent switches and the install folder. Then write down:

- the files and folders that exist, with their exact paths,
- the registry keys and values that were written,
- the MSI product code, if it is an MSI.

Compare this list with your rule. Typical mismatches to look for are a path that differs between devices, a rule that expects a value the installer never writes, and a rule tied to a specific file date or version that differs on some machines. These are things to check, not findings from the threads.

## Step 3: Make the rule simpler and machine-wide

Learn describes three manual rule types:

- **MSI**: product code, with an optional version check. It can only be added once.
- **File**: path, file or folder, and a detection method.
- **Registry**: key path, value name and method. If the value name is empty, Learn says the detection happens on the key.

The Q&A threads suggest these practical points:

1. For an MSI, use the product code rule. Otherwise a registry rule was recommended over a file rule in the March 2025 thread, where a Microsoft external staff member wrote that file rules sometimes fail to detect a file that exists. Learn does not say this.
2. Be careful with very specific properties such as a modified date and time. In the one-of-26 thread, the original rule checked for a specific .exe file in a specific folder with a specific date modified. The asker retired the app and recreated it with a rule that only checks that a folder exists. The asker did not say whether the problem went away, only that they needed to move on, and the cause was never explained, so treat this as a workaround.
3. Choose a place that the service can read. An answer from June 2026 said that the agent runs as SYSTEM and cannot reliably read `HKEY_CURRENT_USER`, and that machine-wide locations such as `HKLM` or a folder under Program Files are safer. Learn does not state this in the text I read, so test it.
4. Match the install behavior. Learn says that user context refers to only a particular user and system context refers to all users of a Windows device. The rule should look in a location that fits that choice.

## Step 4: Check the 32-bit and 64-bit setting

For file and registry rules, Learn describes the option **Associated with a 32-bit app on 64-bit clients**:

- For a registry rule, **No** (the default) searches the 64-bit registry, and **Yes** searches the 32-bit view.
- For a file rule, **Yes** expands path variables in the 32-bit context, and **No** uses the 64-bit context.
- 32-bit clients always use the 32-bit view.

A 32-bit installer that writes its key into the 32-bit view will not be found by a rule left at **No**. Check where the key really is on the test device, then set the option to match.

## Step 5: Use a custom script when you need either-or logic

Learn says that when you add several rules, all of them must be met. If the app can show up in more than one way, write a detection script.

Rules from Learn for the script:

- It is detected only if the exit code is 0 and something is written to STDOUT.
- A nonzero exit code means not detected.
- Anything written to STDERR makes the result not installed, even if STDOUT has text and the exit code is 0.
- Intune does not check for a particular string.
- Save the file as UTF-8 with BOM, as Microsoft recommends.
- The option to run the script as a 32-bit process on 64-bit clients is off by default.

A small example that follows these rules, with placeholder paths that you must change:

```powershell
$folder = "C:\Program Files\ContosoApp"
$regKey = "HKLM:\SOFTWARE\Contoso\App"

if ((Test-Path -Path $folder) -or (Test-Path -Path $regKey)) {
    Write-Output "Detected"
    exit 0
}
exit 1
```

Test it in the same context Intune uses before you upload it. An independent advisor in the May 2026 thread suggested using PsExec to run the install in the SYSTEM context to reproduce what the agent sees. That tip comes from a thread, not from Learn.

## Step 6: Look at other things that make an install look odd

Where only some devices fail, an independent advisor in the May 2026 thread listed more candidates: a pending reboot, locked files, and antivirus or EDR software that silently blocks the installer. That thread is about silent install failures in general, not about this error code. Also review the return codes in the app settings. Learn describes success, failed, retry (up to three attempts, five minutes apart), soft reboot and hard reboot, and your installer's exit codes should map to the right type.

## Step 7: Redeploy and force a check

1. Save the changed rule in the Intune admin center.
2. On a test device, open **Company Portal**, then **Settings**, then **Sync**. Learn says this triggers both the MDM and the IME check-in. Restarting the **IntuneManagementExtension** service also forces a check.
3. Watch `AppWorkload.log` for the new detection result.
4. If the status stays stale, look at the device in the portal and wait for the next report. Learn says IME checks for assignments every 8 hours, and a required app that is not detected is offered again within about 24 hours.

If a rule change does not help one device, the one-of-26 thread used another approach: retire the app for that device, recreate the app with the simpler rule, and deploy again.

## Verification

- The device shows the app as installed in the Intune admin center.
- `AppWorkload.log` shows a successful detection after the install.
- A second device that failed before shows the same result.

## Limits

- None of the four threads has a confirmed root cause. The only closed one used a new app with a simpler rule.
- The Learn error code page does not label any entry for 0x87D1041C as Win32, although the Other installation errors entry describes an installation that succeeded but is not detected.
- The tip about SYSTEM not reading `HKEY_CURRENT_USER`, and the PsExec test, are reported in threads and not checked against Learn.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Microsoft Learn: Add, assign and monitor a Win32 app in Intune](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-add)
- [Microsoft Learn: Understanding the flow behind deployment, delivery and processing of a Win32 app](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/app-management/develop-deliver-working-win32-app-via-intune)
- [Microsoft Learn: Intune Management Extension](https://learn.microsoft.com/en-us/intune/intune-service/apps/intune-management-extension)
- [Microsoft Learn: App install error codes](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/app-management/app-install-error-codes)
- [Microsoft Q&A: The application was not detected after installation completed successfully (March 2025)](https://learn.microsoft.com/en-us/answers/questions/2236146/the-application-was-not-detected-after-installatio)
- [Microsoft Q&A: The application was not detected after the installation was completed successfully (December 2024)](https://learn.microsoft.com/en-us/answers/questions/2134779/the-application-was-not-detected-after-the-install)
- [Microsoft Q&A: Why do some Win32 apps fail to install via Intune without any clear errors (May 2026)](https://learn.microsoft.com/en-us/answers/questions/5881230/why-do-some-win32-apps-fail-to-install-via-intune)
- [Microsoft Q&A: Intune Win32 application delivery reporting 0x87D1041C (June 2026)](https://learn.microsoft.com/en-us/answers/questions/5924319/microsoft-intune-win32-application-delivery-pipeli)
