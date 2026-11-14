---
title: "Write Reliable PowerShell Detection Scripts for Intune Win32 Apps"
summary: "How Intune evaluates a custom Win32 detection script (exit code, STDOUT, STDERR), how to handle 32-bit and 64-bit, signing and encoding, and where to find the logs when detection misreports an install."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [intune, windows-autopilot]
keypoints:
  - "A script detects the app only if it exits with code 0 and writes something to STDOUT. Intune does not look for a specific string."
  - "Any data on STDERR makes the result 'not installed', even with exit code 0 and STDOUT output."
  - "Choose the 32-bit or 64-bit setting on purpose, because registry and path lookups differ between the two contexts."
  - "All detection rules must pass. A failing rule means the app is not detected, and required apps are offered again after about 24 hours."
  - "Use AppWorkload.log and AppActionProcessor.log in C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs to see detection results."
faq:
  - q: "What must a detection script return?"
    a: "Microsoft Learn says the app is detected when the script returns exit code 0 and writes a string value to STDOUT. A nonzero exit code means failure and the app is not detected. Exit code 0 with STDOUT data counts as detected, and Intune does not look for a particular string."
  - q: "Why does my script say installed but Intune reports not installed?"
    a: "Learn states that exit code 0 with data in STDOUT plus any data in STDERR is evaluated as not installed. Check that non-terminating errors, warnings routed to the error stream or noisy cmdlets are not writing to STDERR."
  - q: "Should I run the script as a 32-bit process?"
    a: "The default is No, which runs a 64-bit process on 64-bit clients. Set Yes only when the script must see the 32-bit view, for example 32-bit registry or file system redirection. Learn notes that 32-bit clients always run 32-bit."
  - q: "Do I need to sign the script?"
    a: "Only if you enable Enforce script signature check. With Yes, Intune verifies that a trusted publisher signed the script so it runs without warnings or prompts. The default is No. Learn also recommends UTF-8 BOM encoding."
  - q: "How often does Intune re-check detection?"
    a: "Learn says that if Intune detects the app is not present, it offers the app again within approximately 24 hours. This applies only to apps targeted with the required intent. The IME checks in for new assignments every 8 hours, according to its reference page."
---

A good detection script is small, silent and strict about one thing: it proves the exact version you want exists. It prints one line and exits 0 when the app is present, and exits 1 with no output when it is not. Most unreliable detection comes from scripts that do more than that.

## How Intune reads the result

Microsoft Learn documents the rule precisely. On the **Detection rules** pane of a Win32 app you either configure rules manually or use a custom detection script. The conditions for all rules must be met to detect the app.

For a custom script:

- Nonzero exit code: the script fails and the app is not detected.
- Exit code 0 with data in STDOUT: the app is detected.
- Exit code 0 with data in STDOUT and any data in STDERR: not installed.
- Intune does not look for a particular string in STDOUT.

The script settings are **Script file**, **Run script as 32-bit process on 64-bit clients** (default No) and **Enforce script signature check** (default No). Learn recommends UTF-8 BOM encoding.

## A minimal pattern

Learn's own example for a file version follows this shape:

```powershell
$FileVersion = [System.Diagnostics.FileVersionInfo]::GetVersionInfo("<path to binary>").FileVersion
$FileVersion = $FileVersion.Trim()
if ("<expected version>" -eq $FileVersion)
{
    $FileVersion
    exit 0
}
else
{
    exit 1
}
```

It writes the version to STDOUT on success and exits nonzero otherwise. For complex installs, apply the same structure: check each condition, and print and exit 0 only if all pass.

## Practical rules for complex installs

1. **Test the final state, not the installer.** Check the file version of the main binary, or a registry value written at the end of the install. A folder that exists before configuration finishes is a weak signal.
2. **Keep the script silent on failure.** Use `-ErrorAction SilentlyContinue` where a missing path is a normal result, and avoid writing to the error stream. Remember the STDERR rule above.
3. **Use exit codes, not output text, for decisions.** Output only needs to be non-empty on success.
4. **Pick the architecture deliberately.** The default runs a 64-bit process on 64-bit clients. Learn's manual File and Registry rules use the same idea in the setting Associated with a 32-bit app on 64-bit clients, so decide for each app which view you mean, and test it.
5. **Match the install context.** Learn says System installs for all users of the device and User installs for a specific user. Test the script in the context you deploy to, because this is a practical suggestion and not a documented script rule.
6. **Combine rules only when you need to.** Because all rules must pass, one stale rule makes a healthy app look missing.

## Compare with built-in rules

Before you write a script, check whether a manual rule is enough:

- **MSI:** product code, with an optional version check. Can be added once.
- **File:** path, file or folder, and a method such as existence, date, version or size. Paths must not contain characters like a comma or a quote.
- **Registry:** key path, optional value name, and a value, string, integer or version comparison.

A script earns its place when you need logic across several of these, for example a version check plus a configuration value.

## Why the app installs again or reports failed

If Intune finds the app missing, it re-offers a required app within about 24 hours. Learn's retry text for return codes says the agent tries three times with five minutes between attempts. Apps installed correctly but reported as failed point to a detection problem. The existing m365.fm article on error 0x87d1041c covers that symptom.

## Find the evidence in the logs

All IME logs are in `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs`, readable with CMTrace.

- **AppWorkload.log:** the main app workload log, including check-ins, installs, applicability and detection.
- **AppActionProcessor.log:** detection and applicability checks.
- **IntuneManagementExtension.log:** overall check-in and reporting.
- **AgentExecutor.log:** PowerShell script execution.

In the Intune admin center, **Collect logs** in the app's **Installation details** pane gathers them remotely. The pages I read do not explain how to interpret individual log messages.

To test faster, trigger a sync from the Company Portal (**Settings** > **Sync**), which starts both an MDM and an IME check-in. After the Enrollment Status Page or Autopilot device preparation ends, IME checks immediately for new Win32 assignments.

## Other causes to rule out

Learn's Win32 troubleshooting page also lists: a Windows S mode device, a user-targeted app that needs admin rights, mixing Win32 and line-of-business apps during Autopilot enrollment (supported in device preparation), and antimalware scanning of `C:\Windows\IMECache` and the IME content folder, which Microsoft says to exclude.

## Do not confuse detection with requirements

A requirement rule decides whether the app applies to a device at all. A detection rule decides whether it is already installed. Learn lets you use a script for either. A requirement script has extra settings: **Run this script using the logged on credentials** and **Select output data type**. If the exit code is 0, Intune compares STDOUT with the selected data type. A detection script has no output data type, and any STDOUT data counts.

Built-in requirement fields cover operating system architecture, minimum operating system, disk space, physical memory, logical processors and CPU speed. Use those before writing a script. Scripts are the right tool when file and registry checks cannot express the rule.

Also confirm the install behavior. **System** installs for all users, and Learn says it is required when the device is enrolled by being Microsoft Entra registered. **User** installs for a specific user, and an app that needs device admin rights fails when targeted to users without them.

## Related

- [Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)

## Sources

- [Add and assign a Win32 app in Intune](https://learn.microsoft.com/en-us/intune/app-management/deployment/add-win32)
- [Win32 app detection rules, requirements and install behavior](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-add)
- [Intune Management Extension reference](https://learn.microsoft.com/en-us/intune/device-management/tools/management-extension-windows)
- [Troubleshoot Win32 app issues](https://learn.microsoft.com/en-us/intune/intune-service/apps/apps-win32-troubleshoot)
