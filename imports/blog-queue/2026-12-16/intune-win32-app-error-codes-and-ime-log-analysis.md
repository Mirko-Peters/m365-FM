---
title: "Intune Win32 App Error Codes and IME Log Analysis: Where to Look First"
summary: "A Win32 app fails in Intune and the portal shows only a code. Use the Installation details pane, the right Intune Management Extension log and the documented codes and rules to find the cause."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [intune, windows-autopilot]
keypoints:
  - "Start in the Intune admin center: the Installation details pane for the app offers Collect logs, and Troubleshoot + support shows when the app was targeted and delivered."
  - "The IME writes its logs to C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs. For app problems read AppWorkload.log and AppActionProcessor.log first."
  - "Microsoft's error code page has no dedicated Win32 table. 0x87D1041C means the install finished but the app was not detected afterwards."
  - "Return codes decide the outcome: Failed, Hard reboot, Soft reboot, Retry (three attempts, five minutes apart) or Success."
  - "Learn does not explain individual log lines. Treat any line-by-line reading as your own experience, not as documented behavior."
faq:
  - q: "Where are the Intune Management Extension logs on a device?"
    a: "Microsoft Learn lists the folder C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs and recommends CMTrace.exe as the viewer. The files include IntuneManagementExtension.log, AppWorkload.log, AppActionProcessor.log, AgentExecutor.log, ClientHealth.log and HealthScripts.log."
  - q: "Which log should I read first for a failed Win32 app?"
    a: "Learn says to start with AppWorkload.log and AppActionProcessor.log for install, applicability and detection problems. IntuneManagementExtension.log covers check-in and policy processing, and AgentExecutor.log covers PowerShell script execution."
  - q: "What does error 0x87D1041C mean?"
    a: "On the Microsoft Learn error code page the code appears in the Other installation errors table with the text that installation succeeded but the app was not detected. The same page lists it for Android and iOS with their own explanations. Check the detection rule first."
  - q: "How many times does Intune retry a failed Win32 install?"
    a: "Learn says a return code of type Retry makes the agent attempt the install three times with five minutes between attempts. If a required app is not detected, Intune offers it again within about 24 hours."
  - q: "Can I get the logs from the portal without touching the device?"
    a: "Yes, in many cases. Learn describes Collect diagnostics on the Installation details pane. It needs Windows 11 or Windows 10 version 1909 or later, takes about 15 to 20 minutes and uploads at most 25 file paths or 250 MB."
---

To analyze a failed Win32 app in Intune, open the app's **Installation details** pane for the error, then read `AppWorkload.log` and `AppActionProcessor.log` in `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs` on the device. Match what you find against the app's detection rules and return codes. Microsoft documents the log files, the folder and the rules, but not the meaning of individual log lines.

## Step 1: Read the portal first

In the Microsoft Intune admin center, open the app and look at its installation status. The **Installation details** pane shows the result per device. For an installation issue, **Collect logs** is available there. The **Troubleshoot + support** pane shows when the app was created, modified, targeted and delivered to a device.

Two quick checks come from Microsoft's Win32 troubleshooting page:

- A Win32 app or PowerShell script targeted to a group creates an agent installation policy for a security group. Confirm that the device is in that group, so the Intune Management Extension (IME) gets installed.
- A user-targeted Win32 app that needs administrator rights fails for a standard user.

## Step 2: Collect diagnostics without a visit

If the install failed, the **Collect diagnostics** option is available on the **Installation details** pane. It is not enabled when the app installed successfully. Learn lists these conditions:

- The device runs Windows 11 or Windows 10 version 1909 or later.
- You enter complete file paths. Environment variables such as `%PROGRAMDATA%`, `%WINDIR%` and `%TEMP%` are allowed.
- Allowed extensions are .log, .txt, .dmp, .cab, .zip, .xml, .evtx and .evtl.
- You can enter at most 25 paths, and the upload stops at 250 MB or 25 files, whichever comes first.

Collection takes about 15 to 20 minutes. When it is done, select **Download diagnostics**. A useful first path is the IME log folder, plus the installer's own log if your package writes one.

## Step 3: Pick the right IME log

The IME log folder is `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs`. Microsoft recommends CMTrace.exe to read the files.

| Log file | What Learn says it tracks |
|---|---|
| `AppWorkload.log` | Main app workload log: app check-ins, installs, applicability and detection |
| `AppActionProcessor.log` | The Application Action Processor, including detection and applicability checks |
| `IntuneManagementExtension.log` | Agent check-in, policy request, policy processing and reporting |
| `_IntuneManagementExtension.log` | Saved copy of the main log after it rolls over |
| `AgentExecutor.log` | PowerShell script execution |
| `HealthScripts.log` | Remediation scripts, such as custom compliance scripts and proactive remediations |
| `ClientHealth.log` | Sidecar agent client health |

For install, applicability and detection problems, Learn says to start with `AppWorkload.log` and `AppActionProcessor.log`. If older entries are missing, look in `_IntuneManagementExtension.log`. The pages I read do not describe the format of single log lines or give search strings. Use the file names above to narrow the search, then compare what you see with the rules in the next steps.

## Step 4: Interpret the error code

Microsoft's app installation error code page has tables for Android, iOS and iPadOS, and a table named Other installation errors. There is no dedicated Win32 section. The Windows related entries in the Other table are mostly package errors, such as:

- **0x80073CFF** and **0x80CF201C**: the system requires sideloading. The package must be signed with a trusted signature.
- **0x80073CF0**: the package is unsigned or the publisher name does not match the certificate subject.
- **0x80073CFB**: the package is already installed and reinstallation is blocked, because a rebuilt package is not identical to the installed one.
- **0x8000FFFF**: an unexpected error. The page says to check the installation logs.
- **0x87D1041C**: installation succeeded, but the app was not detected afterwards. The page says required apps reinstall at the next check-in.

Treat the page as a partial map. If your code is not in it, work from the log and the rules below.

## Step 5: Check detection rules and return codes

Many Win32 failures come down to two settings.

**Detection rules.** You must configure at least one rule, and the conditions of all rules must be met for the app to count as detected. The rule types are MSI product code, file or folder, registry and custom script. A custom script counts as detected only when it exits with code 0 and writes a string to STDOUT. Any data on STDERR makes the result not installed, even with exit code 0. Microsoft recommends encoding the script as UTF-8 BOM. File paths must not contain special characters such as a comma or a quotation mark.

**Return codes.** Each code maps to a type:

- **Failed**: the install failed.
- **Hard reboot**: the next Win32 app cannot install without a reboot.
- **Soft reboot**: the next app can install without a reboot, but the current app still needs one.
- **Retry**: the agent tries three times, waiting five minutes between attempts.
- **Success**: the app installed.

The page I read says default entries are added when you create the app, but it does not list their values. Open the app's **Properties** and check the return codes there before you assume a code is treated as success.

## Step 6: Rule out common side effects

- **Timeouts.** The installation time required is 60 minutes by default and at most 1440 minutes. An install that runs longer fails.
- **Silent install.** Installs must be silent. Interactive installs are not supported.
- **Antimalware.** Exclude `C:\Program Files (x86)\Microsoft Intune Management Extension\Content` and `C:\windows\IMECache` on x64 devices. On x86 devices the first path is `C:\Program Files\Microsoft Intune Management Extension\Content`.
- **Autopilot.** Do not mix Win32 and line-of-business apps during Windows Autopilot enrollment, because the install might fail. Mixing them during Windows Autopilot device preparation is supported.
- **Dependencies.** A failed dependency shows the message that dependencies defined by the admin were not met. Each dependency follows the same retry logic.

## What to do next

After a fix, wait for the next check-in or sync the device, then watch the same Installation details pane. Learn says the IME checks for new Win32 assignments every hour and on service or device restart. If you changed a detection rule, remember that a required app that is not detected is offered again within about 24 hours.

## Limits of this article

Microsoft's pages describe where logs live and which rules decide success. They do not explain the content of log entries, and they do not give a full Win32 error code table. If a code is missing from the Learn tables, say so in a support case and attach the collected logs.

## Related

- [Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Windows Autopilot device preparation](https://www.m365.fm/entity/windows-autopilot-device-preparation/)

## Sources

- [Troubleshoot Win32 app deployments (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-troubleshoot)
- [Collect Win32 app diagnostics (Microsoft Learn)](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/app-management/troubleshoot-win32-app-install)
- [App installation error codes (Microsoft Learn)](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/app-management/app-install-error-codes)
- [Add, assign and monitor a Win32 app (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-add)
- [Win32 app management (Microsoft Learn)](https://learn.microsoft.com/en-us/mem/intune/apps/apps-win32-app-management)
