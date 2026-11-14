---
title: "Intune PowerShell Script Not Running on Windows Devices: Checks and Logs"
summary: "Check why an Intune PowerShell script does not run on a Windows device: Intune management extension prerequisites, install triggers, the 8-hour check-in, manual sync, log files such as AgentExecutor.log, and what the Learn page leaves to other articles."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [intune]
keypoints:
  - "PowerShell scripts run through the Intune management extension (IME). It must be installed and at version 1.58.103.0 or later, and the device must be Entra joined or registered and enrolled in Intune."
  - "The IME installs automatically when a feature such as a PowerShell script is assigned. It does not support Windows Home or devices in S mode."
  - "The IME checks in with Intune every 8 hours, separately from the MDM check-in. Use Company Portal Settings > Sync or restart the IntuneManagementExtension service."
  - "Logs are typically in C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs. AgentExecutor.log covers PowerShell script executions."
  - "The page does not describe the 64-bit host, run-as context, signature checks or retry counts. Those are in a separate article that was not read."
faq:
  - q: "Where are the logs for Intune PowerShell scripts?"
    a: "Microsoft Learn says IME logs are typically in C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs. IntuneManagementExtension.log is the main log and AgentExecutor.log covers PowerShell script executions. Open them with CMTrace."
  - q: "How often does the IME check in?"
    a: "Every 8 hours, independent of the MDM check-in. After the enrollment status page or Autopilot device preparation finishes, it checks for new Windows app assignments immediately."
  - q: "How do I force a check-in?"
    a: "In Company Portal select Settings > Sync, or restart the IntuneManagementExtension service in Task Manager."
  - q: "Why did the IME not download?"
    a: "Learn lists causes such as a device not joined to Entra ID, no scripts or Win32 apps assigned, no connectivity to Intune or Windows Push Notification Services, S mode, a corrupted agent config file, installation outside Intune, or a per-user proxy."
  - q: "Does the page explain script run-as context or retries?"
    a: "No. The page defers PowerShell script details to a separate article and does not give a retry count."
---

When an Intune PowerShell script does not run, the first question is whether the Intune management extension (IME) is on the device and checking in. The IME is the agent that runs PowerShell scripts, among other things. This guide follows the Microsoft Learn page Understand Microsoft Intune Management Extension, which covers prerequisites, check-in, logs and IME download problems. It does not cover script execution details.

## What the IME is

The IME is an installer agent that supplements the standard Windows MDM feature. It applies to supported Windows versions, excluding Windows Home and devices in S mode.

## Check the prerequisites

1. **Agent version.** Devices must run IME version 1.58.103.0 or later. Older versions do not receive configurations or updates that depend on the IME. The IME updates itself.
2. **Windows version.** A supported version. S mode is not supported because it does not allow nonstore apps.
3. **Join state.** The device is joined to Microsoft Entra ID. The page names two forms: Entra hybrid joined (joined to Entra ID and on-premises Active Directory), and Entra registered or workplace joined, for example a BYOD device with a work or school account under **Settings** > **Accounts** > **Access work or school**.
4. **Enrollment.** Enrolled through Group Policy, enrolled manually or automatically, or co-managed with Configuration Manager. Learn says PowerShell scripts run even if the Apps workload is set to Configuration Manager.
5. **Network.** Behind a firewall or proxy, communication to Intune must be allowed.

## When the IME installs

The IME installs automatically when certain features are assigned to a user or device. The page lists PowerShell scripts, remediations, discovery scripts for custom compliance, Win32 apps, endpoint analytics, Remote Help, Managed Installers and the BIOS update configuration policy. A note near the top of the page lists a slightly different set (PowerShell script, Win32 app, Microsoft Store app, custom compliance policy setting, proactive remediation), so treat both lists as examples. The page also says the IME installs automatically only when the prerequisites are met. It is removed when scripts are no longer assigned, when the device is no longer managed, or when the IME stays in an irrecoverable state for over 24 hours of device-awake time.

## Check-in timing

The IME checks for new or updated installations every 8 hours. This is independent of the MDM check-in. After the enrollment status page or Autopilot device preparation ends, it checks for new app assignments right away. To check in manually, open **Company Portal** > **Settings** > **Sync**, or restart the **IntuneManagementExtension** service in Task Manager.

## Read the logs

Logs are typically in `C:\ProgramData\Microsoft\IntuneManagementExtension\Logs`. Open them with CMTrace.

| Log | Content |
| --- | --- |
| IntuneManagementExtension.log | Main log: check-ins, policy requests, processing, reporting |
| AgentExecutor.log | PowerShell script executions |
| HealthScripts.log | Scheduled remediations |
| AppWorkload.log | Win32 app deployment |
| ClientHealth.log | IME health |

Other logs cover app detection, client certificates, notifications and endpoint analytics.

## If the IME does not download

Learn lists these possible causes:

- The device is not joined to Microsoft Entra ID.
- No PowerShell scripts or Win32 apps are assigned to the device or user groups.
- The device cannot reach Intune, or cannot reach Windows Push Notification Services.
- The device is in S mode.
- The agent config file under `C:\Program Files (x86)\Microsoft Intune Management Extension` is corrupted or changed.
- The agent was installed outside Intune. The only supported mechanism is automatic installation as devices sync.
- The proxy is set only per user. Make sure a user is signed in, or run `bitsadmin /util /setieproxy`.

To check automatic enrollment, create the advanced diagnostic report under **Settings** > **Accounts** > **Access work or school**, open the joined account's **Info**, and search the MDMDiagReport for MDMDeviceWithAAD. If it exists, the device is automatically enrolled.

## Microsoft Intune Windows Agent app disabled

Learn says the Entra app that authenticates the IME can fail subscription validity checks and be disabled again even after you re-enable it. The stated fix is to delete its service principal with Microsoft Graph in Graph Explorer, by someone familiar with it and with a role such as Application Administrator.

## What the page does not say

- How the script runs: 64-bit or 32-bit host, system or user context, and signature checks.
- How many retries occur after a failure.
- Which steps to take for a script that ran but failed.
- Step-by-step script troubleshooting. The page links to a separate article on PowerShell scripts.

## A troubleshooting order

This order is my advice, built on the page.

1. Confirm the device meets the prerequisites and is not in S mode.
2. Confirm the script is assigned to the device or user.
3. Force a sync, then wait.
4. Open IntuneManagementExtension.log for the check-in and AgentExecutor.log for the run.
5. If the IME is missing, work through the download causes.
6. For script behavior beyond that, read the dedicated Learn article on PowerShell scripts.

## Typical mistakes (my advice)

- Waiting for the 8-hour check-in instead of forcing a sync.
- Targeting Home edition or S mode devices.
- Installing the IME by hand.
- Looking only at the main log and skipping AgentExecutor.log.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Intune update rings](https://www.m365.fm/entity/intune-update-rings/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)

## Sources

- [Understand Microsoft Intune Management Extension (Microsoft Learn)](https://learn.microsoft.com/intune/device-management/tools/management-extension-windows)
