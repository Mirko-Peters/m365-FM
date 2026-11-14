---
title: "How to Create Intune Remediations to Fix Device Issues Automatically"
summary: "Create Intune remediations, formerly Proactive Remediations: detection and remediation scripts, requirements and licenses, script settings, exit codes, schedules, limits, built-in packages, on-demand runs and the gaps the Learn page leaves open."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [intune]
keypoints:
  - "A remediation package has a detection script and an optional remediation script, both PowerShell .ps1 files saved as UTF-8. It was formerly called Proactive Remediations."
  - "The detection script must exit with code 1 when it finds the issue. Any other exit code means no remediation runs."
  - "Devices must be Entra joined or hybrid joined, and Intune enrolled with Windows Enterprise, Pro or Education, or co-managed. Learn lists Windows Enterprise or Education licensing."
  - "Schedules are once, hourly or daily. Devices retrieve policy at restart, sign-in and every 8 hours. Limits include 200 script packages and 2,048 characters of output."
  - "The page gives no script timeout, no minimum hourly interval and no failure handling. Scripts must not reboot the device or handle sensitive data."
faq:
  - q: "What are Intune remediations?"
    a: "Script packages with a detection script and an optional remediation script that find and fix common issues on Windows devices. The feature was formerly called Proactive Remediations."
  - q: "Where do I create them?"
    a: "In the Intune admin center under Devices > Manage devices > Scripts and remediations."
  - q: "How does detection trigger remediation?"
    a: "The detection script must exit with code 1 when it finds the issue. Any other exit code means that no remediation runs."
  - q: "What licenses are needed?"
    a: "Learn lists Windows Enterprise E3 or E5, which is included in Microsoft 365 F3, E3 and E5, Windows Education A3 or A5, or Windows VDA per user. An Intune Service Administrator must confirm licensing."
  - q: "What are the limits?"
    a: "Up to 200 script packages and 2,048 characters of script output. Scripts must not include reboot commands or sensitive or personal data."
---

Remediations in Microsoft Intune run a detection script on Windows devices and, if it finds a problem, run a remediation script that fixes it. The feature was formerly called Proactive Remediations. This guide follows the Microsoft Learn page on remediations.

## What a package contains

A script package has a detection script and, optionally, a remediation script. Both are PowerShell files in .ps1 format, saved as UTF-8. You find them in the Intune admin center under **Devices** > **Manage devices** > **Scripts and remediations**.

## Requirements

- Devices are Microsoft Entra joined or hybrid joined.
- Devices are Intune enrolled and run Windows Enterprise, Pro or Education, or they are co-managed.
- Licensing: Windows Enterprise E3 or E5 (included in Microsoft 365 F3, E3 and E5), Windows Education A3 or A5, or Windows VDA per user. Learn says an Intune Service Administrator must confirm the licensing.

## Script settings

- **Run this script using the logged-on credentials.** The result depends on what the script does.
- **Enforce script signature check.** Learn recommends No.
- **Run script in 64-bit PowerShell.** Learn recommends No.

## Exit codes

The detection script must `exit 1` when it finds the issue. Any other exit code means the issue is not present, so no remediation runs. The remediation script runs only after detection reports exit code 1.

```powershell
# Detection example (illustrative, not from the page)
if (-not (Test-Path "C:\Temp\flag.txt")) { exit 1 } else { exit 0 }
```

The example is illustrative practical advice. The page describes the exit code rule and does not give this script.

## Schedule

- Run once, hourly (less than 24 hours) or daily.
- Use local time or UTC.
- Missed runs execute when the device is back online.
- Devices retrieve the policy at restart, at sign-in and every 8 hours.
- Recurring scripts report in a seven-day cycle.

## Limits

- Up to 200 script packages.
- Up to 2,048 characters of script output.
- No reboot commands in scripts.
- No sensitive or personal data in scripts.

## Built-in packages

The page lists two built-in packages: Update stale Group Policies and Restart Office Click-to-run service.

## Run a remediation on demand (preview)

You can run a remediation on a single device. During the preview you need the Run remediation permission and Organization: Read. Only one action runs per device at a time.

## Known issue

Filters and Export cover only the packages that are loaded in the list.

## What the page does not say

- A script timeout.
- A minimum interval for hourly schedules.
- How failures are retried or handled.
- A full permission list for creating packages.

## A rollout outline

This outline is practical advice built on the page.

1. Pick one narrow issue and write the detection script first.
2. Test the exit code on a pilot device.
3. Add the remediation script and assign to a pilot group.
4. Start with a daily schedule and review the reports after the seven-day cycle.
5. Check the license position before you widen the assignment.

## Typical mistakes

- Returning exit code 0 when the issue is found.
- Putting reboot commands or personal data in a script.
- Producing more than 2,048 characters of output.
- Assuming licensing is covered without confirmation.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Portal path | Devices > Manage devices > Scripts and remediations |
| File format | .ps1, UTF-8 |
| Exit code for issue found | 1 |
| Schedules | Once, hourly, daily |
| Policy retrieval | Restart, sign-in, every 8 hours |
| Reporting for recurring scripts | Seven-day cycle |
| Package limit | 200 |
| Output limit | 2,048 characters |

## How a run works

The device retrieves the package at restart, at sign-in and every 8 hours. At the scheduled time it runs the detection script. If the detection script exits with code 1, the remediation script runs. With any other exit code the remediation script does not run. If a scheduled run was missed because the device was off, the run happens when the device is back online. You can choose local time or UTC for the schedule, which matters for devices in several time zones.

## Choosing script settings

The page recommends No for the signature check and No for 64-bit PowerShell. The setting for the logged-on credentials depends on what the script needs to change. As practical advice, a script that changes per-user settings probably needs the user context. The page itself only says that the effect depends on the script, so test on a pilot device.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Remediations in Intune (Microsoft Learn)](https://learn.microsoft.com/intune/intune-service/fundamentals/remediations)
