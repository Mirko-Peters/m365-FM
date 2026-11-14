---
title: "Teams Keeps Crashing: Resolve Teams Client Crash Issues on Windows"
summary: "How admins investigate Teams client crashes with the Teams client health dashboard, per Microsoft Learn: the Insight column, antivirus and DLP exclusions first, media stack failures with Windows Error Reporting, and how to read WebView2 exit and error codes by group."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [teams]
keypoints:
  - "When Teams exits unexpectedly, the Teams client health dashboard reports a Client crash. Check the Insight column on the Issues tab for the likely reason."
  - "First step for any crash: make sure non-Microsoft antivirus and DLP tools include or approve the Teams desktop client, the executable that starts Teams, and Microsoft Edge WebView2."
  - "For media stack failures, if antivirus and DLP are not blocking, enable Windows Error Reporting and keep audio and video drivers updated."
  - "For WebView2 failures, read the process exit or error codes. They point to external termination, invalid parameters, resource limits, sandbox or GPU issues, or system faults."
  - "If the issue persists after the resolution, contact Microsoft Support."
faq:
  - q: "Where do I see Teams crashes in my organization?"
    a: "In the Teams client health dashboard. Microsoft Learn says an unexpected exit of the Teams app is categorized as a Client crash. On the Issues tab, the Insight column shows potential reasons why the app stopped responding."
  - q: "What should I check first?"
    a: "Learn calls this the first step for any such issue: make sure all non-Microsoft antivirus and data loss prevention applications include or approve the Teams desktop client, the executable that automatically starts the Teams app, and Microsoft Edge WebView2. The page links its article on preventing antivirus and DLP tools from blocking or crashing Teams."
  - q: "What do I do about a media stack technology failure?"
    a: "If antivirus and DLP tools do not block the Teams and WebView2 processes and the media stack still fails, enable Windows Error Reporting to help find the root cause and report it to Microsoft. Learn also recommends keeping audio and video drivers updated."
  - q: "How do I read WebView2 exit codes?"
    a: "Learn lists general process exit codes (for example 1 for a process that was killed, 2 for hung, 4 for a GPU process that failed at startup), POSIX signal errors (131 to 140), sandbox, crashpad and time-out errors (258, 7006 to 7013 and negative crashpad codes), and C++ and Windows runtime errors such as access violation and out of memory. Use the table on the page to look up the exact code."
  - q: "Does any code mean malware?"
    a: "The page lists STATUS_VIRUS_INFECTED, code -1073739514, as meaning the process was terminated because a virus or malware was detected. It gives no further steps for it, so treat it as a reason to check your security tools and logs."
---

A Teams client that crashes is hard to fix by guessing. The Microsoft Learn page on Teams client crash issues gives admins a structured way: start in the Teams client health dashboard, read the insight, exclude the usual suspects, and decode the WebView2 code if there is one. This article follows that order. The page is written for administrators, so I do not describe user-side repair steps that it does not give.

## Where crashes show up

When the Teams app exits unexpectedly on a user's device, the **Teams client health dashboard** reports it as a **Client crash**. On the **Issues** tab, the **Insight** column lists potential reasons why the app stopped responding. The Learn article lists the insights for client crashes with resolutions. If the problem persists after the resolution, the page says to contact Microsoft Support.

## Step 1: Antivirus and DLP exclusions

Learn marks this as the first step for any such issue. Make sure all non-Microsoft antivirus and data loss prevention (DLP) applications include or approve:

- The Teams desktop client.
- The executable that automatically starts the Teams app.
- Microsoft Edge WebView2.

The page links its article on preventing antivirus and DLP tools from blocking or crashing Microsoft Teams, which has the details.

## Step 2: Match the insight

### Media stack technology failure

If antivirus and DLP tools do not block the Teams and WebView2 processes from accessing Teams services and the media stack still fails:

1. Enable Windows Error Reporting (WER). It helps identify the root cause and report the issue to Microsoft. Learn links its guidance on enabling WER diagnostics.
2. Keep audio and video drivers updated for performance and stability.

### WebView2 failure

For WebView2 process failures, read the process exit or error codes. Learn says they indicate problems such as external termination, invalid parameters, resource limits, sandbox or GPU issues and system faults. The page lists the codes in groups.

| Group | Examples from the page | What they suggest |
| --- | --- | --- |
| General process exit codes (1 to 34) | 1 killed by the system or an external controller, 2 hung, 3 bad IPC message, 4 GPU process failed at startup (drivers or hardware), 9 conflicting machine-level installation, 21 profile in use, 30 action blocked by policy, 34 GPU lost the rendering context | Termination, startup, policy and GPU problems |
| POSIX signal errors (131 to 140) | 134 abort, 137 forcibly terminated, 139 segmentation fault | Fatal errors and forced termination |
| Sandbox, crashpad and time-out errors | 258 wait timed out, 7006 to 7013 sandbox fatal errors including 7012 memory exceeded, negative crashpad codes where crash data could not be logged | Sandbox limits and crash logging problems |
| C++ and Windows runtime errors | Access violation, heap corruption, out of memory, DLL not found, invalid image hash, stack overflow, commitment limit | Memory, DLL and corruption problems |

A few entries are worth knowing by name, because they give a direction:

- **4, GPU dead on arrival:** the GPU process failed at startup, usually because of driver issues or hardware incompatibility.
- **9, machine-level install exists:** a conflicting machine-level installation might prevent a per-user instance from running.
- **30, action disallowed by policy:** a policy restriction blocked the attempted action.
- **-1073740760, invalid image hash:** the hash of a loaded executable or DLL did not match, indicating possible corruption or tampering.
- **-1073739514, virus infected:** the process was terminated because a virus or malware was detected.
- **-536870904, out of memory** and **-1073741523, commitment limit:** the process ran out of memory or exceeded the system's commitment limit.

For the full list use the tables on the Learn page. It gives the symbolic name and a description for each code.

## How to work through it in practice (my advice)

This is my suggestion, not an order from the page:

1. Open the dashboard and sort the crash issues by insight. One insight with many devices usually means one cause.
2. For many devices, check the antivirus and DLP exclusions first, as the page says. Compare an affected machine with a healthy one on the same security product and policy.
3. For a single device, look at the WebView2 code and the group it belongs to. GPU codes call for a driver check. Memory codes call for a look at free memory and other heavy apps.
4. Note the Windows build, the Teams version, the drivers and the security tools in your ticket before you ask Microsoft Support for help. The page tells you to contact support if the issue persists, but gives no list of what to collect.
5. Make one change at a time and watch the dashboard for a few days, since the insight list is based on reported crashes.

## What the page does not cover

The page does not explain user-side steps such as clearing the cache or reinstalling Teams, and it does not give crash rates or expected timelines. If those are your questions, check the Teams troubleshooting pages for the specific symptom.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Resolve Teams Client Crash Issues (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-administration/resolve-teams-client-crash-issues)
