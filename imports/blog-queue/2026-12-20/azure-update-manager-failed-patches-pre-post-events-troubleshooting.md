---
title: "Azure Update Manager Failed Patches and Pre/Post Events: Troubleshooting Checklist"
summary: "A troubleshooting order for failed or skipped patching in Azure Update Manager, based on Microsoft Learn: logs, extension checks, HRESULT codes, maintenance window timing, and pre and post event execution and cancellation."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [azure-update-manager, azure-arc, azure-event-grid]
keypoints:
  - "Learn names the log locations for Azure VMs and Azure Arc-enabled servers. Start with the patch extension logs on the machine before changing any schedule."
  - "Machines shown as Not assessed with an HRESULT point to the machine's update agent. Learn says to try updating locally first, then check WSUS or Windows Update endpoints."
  - "A run can show Maintenance window exceeded when less than 25 minutes remain (30 for Windows service packs), because 10 minutes are reserved for reboot."
  - "Pre and post events use Event Grid. The schedule status covers only update installation, not event success. A failed pre-event does not stop patching unless your code calls the cancellation API."
  - "A pre-event needs at least 40 minutes before the window starts, otherwise the current run is auto-cancelled, and cancellation must happen at least 10 minutes before the start."
faq:
  - q: "Where are the patch logs on an Azure VM?"
    a: "Per Microsoft Learn, on Windows check WindowsUpdateExtension.log and CommandExecution.log under C:\\WindowsAzure\\Logs\\Plugins\\Microsoft.CPlat.Core.WindowsPatchExtension. On Linux, the logs are in /var/log/azure/Microsoft.CPlat.Core.LinuxPatchExtension/, including the core.log file for patch actions."
  - q: "Why does a failed pre-event not stop patching?"
    a: "Learn says Azure Update Manager does not automatically cancel the schedule. You must initiate cancellation as part of the pre-event. If you do not, the run proceeds with installing updates in the maintenance window."
  - q: "Does the schedule status include pre and post event results?"
    a: "No. Learn says the success or failure status of a schedule run refers only to update installation on the machines. If a pre-event failed and you called the cancellation API, the run status shows canceled."
  - q: "Why are shut-down machines not patched?"
    a: "Learn lists shut-down machines as a cause for patches not being applied and for machines losing maintenance configurations or schedules. It says to make sure machines are turned on at least 15 minutes before the scheduled update."
  - q: "What can cause a maintenance window exceeded status when time seems sufficient?"
    a: "Learn explains that the deployment checks remaining time at several steps and reserves 10 minutes for reboot. It needs 25 minutes in total for most updates and 30 minutes for Windows service packs, otherwise it skips scan, download and installation."
---

When Azure Update Manager patching fails, the usual order is: confirm the machine can be assessed, confirm the patch extension and prerequisites, check the maintenance window arithmetic, and only then look at pre and post events. Microsoft Learn documents causes and fixes for each step. This checklist follows the Update Manager troubleshooting page and the pre and post events pages.

## Step 1: Read the logs on the machine

Learn names where to look.

**Azure Windows VM**

- Agent log: `C:\WindowsAzure\Logs\AggregateStatus`.
- Extension logs: `C:\WindowsAzure\Logs\Plugins\Microsoft.CPlat.Core.WindowsPatchExtension<version>`. `WindowsUpdateExtension.log` records patches assessed and installed and problems. `CommandExecution.log` records whether the patch operation was invoked.

**Azure Linux VM**

- Agent log: `/var/log/waagent.log`, where every automatic patching request has a unique sequence number.
- Extension logs: `/var/log/azure/Microsoft.CPlat.Core.LinuxPatchExtension/`. `<seq number>.core.log` holds patch actions, and `<Date and Time>_Enable.ext.log` shows whether the patch operation was invoked.

**Azure Arc-enabled servers (Windows)**

- `C:\ProgramData\GuestConfig\extension_logs\Microsoft.SoftwareUpdateManagement.WindowsOsUpdateExtension`, with `WindowsUpdateExtension.log` and the `cmd_execution_<numeric>_stdout.txt` and `_stderr.txt` files.

## Step 2: Check that the machine can be assessed

If a machine shows **Not assessed** under **Compliance**, possibly with an `HRESULT` error, Learn says the update agent is not configured correctly. Update Manager relies on the Windows Update Agent or the Linux package manager. Learn's first test is to perform updates locally. If that fails, check the agent configuration, WSUS or Windows Update endpoints, or repository access on Linux.

Codes from the Learn table:

| Code | Learn's explanation |
|---|---|
| `0x8024402C`, `0x8024401C`, `0x8024402F` | Network connectivity problems. Check connectivity to Update Manager. |
| `0x8024001E` | Update did not finish because the service or system was shutting down. Retry. |
| `0x8024002E` | Windows Update service is disabled. Enable it. |
| `0x8024402C` with WSUS | Check `WUServer` and `WUStatusServer` under the WindowsUpdate policy registry key. |
| `0x80072EE2` | Network problem or problem reaching the WSUS server. |
| `0x80070422` | Make sure `wuauserv` is running and not disabled. |
| `0x80070005` | Access denied. Causes listed include infection, wrong Windows Update settings, file permissions on `%WinDir%\SoftwareDistribution` or insufficient disk space on the system drive. |

For Arc-enabled servers whose subscriptions do not produce assessment data, Learn says to make sure the subscriptions are registered to the Microsoft.Compute resource provider.

## Step 3: Check extension and prerequisite checks

Learn lists these failures with their causes:

- **Extension not installed.** The patch extension must be installed successfully. Trigger an on-demand assessment or patching to install it, or attach a maintenance configuration schedule. If the extension exists but status is not **Succeeded**, remove it and trigger an on-demand operation.
- **AllowExtensionOperations.** The property is `false` in the machine's `OSProfile`. Set it to `true`.
- **Sudo privileges.** On Linux, the extensions use the root account. Learn describes adding `root ALL=(ALL) ALL` to the `sudoers` file.
- **Proxy, HTTPS and TLS.** A proxy can block required endpoints, an HTTPS connection is required, and TLS 1.0 or 1.1 fails the check. Use TLS 1.2 or later.
- **MsftLinuxPatchAutoAssess.** Needed for periodic assessments on Linux. Make sure `LinuxPatchExtension` shows `succeeded` and reboot to test.
- **Linux repositories.** Network security rules can block repositories.

## Step 4: Check the schedule and window

- Machines in a shutdown state are not patched, and can lose maintenance configurations or schedules. Turn them on at least 15 minutes before the scheduled update.
- For conflicting schedules, only one is triggered and the other runs after the first finishes. A newly created Azure VM can see 15 minutes of trigger delay.
- `ShutdownOrUnresponsive`: Learn says schedules on machines deleted and re-created with the same resource ID within 8 hours can fail, and the problem does not occur after the 8-hour period.
- Moved VMs lose the maintenance configuration, because maintenance configurations do not support moving assigned resources. Learn gives separate steps for static and dynamic scopes: remove or let the system remove the assignment, move the resource, then re-create the assignment.
- **Maintenance window exceeded.** Learn explains that 10 minutes are reserved for reboot and that the deployment needs 15 minutes plus 10 for most updates, or 20 plus 10 for Windows service packs, before it scans, downloads or installs. Otherwise those steps are skipped and the run is marked Failed. For on-demand deployments, set a longer maximum duration.

If periodic assessment or the prerequisite for scheduled patching is not set for specialized, migrated or restored VMs, Learn says to run a remediation task for the newly created resources. For policy remediation failures on images, it describes granting the managed identity the Contributor role.

## Step 5: Check pre and post events

Learn says pre and post events let you run tasks before and after a scheduled maintenance configuration, and that Azure Update Manager uses Event Grid with handlers such as Azure Webhooks or Azure Functions.

Execution order: pre-event, optional cancellation, update installation, post-event, schedule status. Key points:

- Pre-events run outside the maintenance window, and post-events may run outside it.
- You must initiate cancellation from the pre-event. If you do not, the run proceeds even when the pre-event failed.
- The cancellation API cancels the schedule run and not the whole schedule. It must be called at least 10 minutes before the start time. In the portal, **History** > **By Maintenance run ID** > **Cancel schedule update** is enabled for 10 minutes before the start.
- Creating or editing a schedule with a pre-event needs at least 40 minutes before the window starts, otherwise the current run is auto-cancelled.
- With several pre-events, all must run within 20 minutes, and they run independently.
- The schedule status covers update installation only.

To verify delivery, open the maintenance configuration, select **Events** under **Settings**, and compare Published, Matched and Delivered Events. Learn says Event Grid delivers at least once, so handlers should be idempotent. For the job itself, check the Automation runbook job under **Process Automation** > **Runbooks**, or the function's **Invocations**.

To see why a run was cancelled, open the run in **History**. Learn describes cancellation by the user and by the system. The system cancels when it cannot send the pre-event 30 minutes before the job.

## What the documentation does not say

The pages read do not list causes of failure specific to individual security patches, such as a particular KB failing to install. For that, the Learn page points to the machine's own update agent logs and the Windows Update troubleshooting guidance.

## Related

- [Azure Update Manager](https://www.m365.fm/entity/azure-update-manager/)
- [Azure Arc](https://www.m365.fm/entity/azure-arc/)
- [Azure Event Grid](https://www.m365.fm/entity/azure-event-grid/)

## Sources

- [Troubleshoot known issues with Azure Update Manager (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/update-manager/troubleshoot)
- [An overview of pre and post events in Azure Update Manager (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/update-manager/pre-post-scripts-overview)
- [Manage the pre and post maintenance configuration events in Azure Update Manager (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/update-manager/manage-pre-post-events)
