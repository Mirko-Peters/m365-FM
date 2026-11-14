---
title: "Windows Devices Cannot Sync With Intune: Check the dmwappushservice Service"
summary: "A Windows device that stops syncing with Intune after enrollment, with no event log errors, may have the dmwappushservice service disabled, for example by a script. Learn says to set its startup type to Automatic. Includes how to test a sync."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [intune, powershell]
keypoints:
  - "Learn describes a Windows 10 device that stops syncing from two minutes to two days after enrollment, with no errors in the event logs."
  - "Manual sync from the device or the Intune admin center does not start and the last sync time does not update."
  - "The cause is a disabled Device Management Wireless Application Protocol service (dmwappushservice), for example disabled by a deployed PowerShell script."
  - "The fix Learn gives is to change the startup type of dmwappushservice to Automatic."
  - "The Intune management extension can keep working in this state, so script deployment alone does not prove that sync is healthy."
faq:
  - q: "What are the symptoms of this sync problem?"
    a: "Microsoft Learn says that after a Windows 10 device has been enrolled for some time, randomly from two minutes to two days, it can no longer sync. A manual sync from the device or the Microsoft Intune admin center does not start, and the last sync time is not updated. No errors are logged in the event logs."
  - q: "What causes it?"
    a: "Learn says the dmwappushservice service is disabled. As an example it names a PowerShell script deployed to the device that contains a command disabling this service. The service is required on client devices for Intune management."
  - q: "How do I fix it?"
    a: "Learn says to change the startup type of the dmwappushservice service to Automatic. Its page shows a screenshot of the startup type drop-down in the service properties."
  - q: "Why can PowerShell scripts still be deployed if sync is broken?"
    a: "Learn notes that in this scenario the Intune management extension still works and you can still deploy PowerShell scripts to the device. That is why a working script deployment does not mean the device is syncing normally."
  - q: "Does the Learn page cover Windows 11?"
    a: "The page is titled and written for Windows 10 devices and does not mention Windows 11. Windows 10 support ended on 14 October 2025, so treat this as a known cause to check on any Windows device that stops syncing, and confirm the behavior on your own build."
---

If a Windows device in Intune stops syncing some time after enrollment, shows no sync start when you press Sync and logs no errors, check the Device Management Wireless Application Protocol service, named `dmwappushservice`. Microsoft Learn says the device cannot sync when this service is disabled, and the fix is to set its startup type to **Automatic**. This guide follows the Learn troubleshooting page, which is short, and adds a few checks marked as my own advice.

## A note on scope

The Learn page is titled for Windows 10 devices and does not mention Windows 11. Windows 10 support ended on 14 October 2025, so many tenants have moved on. The page is still a useful reference because it names a service that Learn says is required on client devices for Intune management. Whether the same symptom on a newer Windows build has the same cause is not something the page says, so verify it on your own devices.

## Symptoms

Learn describes this pattern:

- The device is enrolled in Intune and works for a while. Learn says the time varies randomly from two minutes to two days.
- Then the device can no longer sync.
- When you start a manual sync on the device or in the Microsoft Intune admin center, synchronization does not start and the last sync time is not updated.
- No errors are logged in the event logs.

The last point matters. An empty event log means you will not find an error code to search for. The symptom is a silent failure.

Learn adds a note that makes this harder to spot: the Intune management extension still works, and you can still deploy PowerShell scripts to the device. A script that arrives and runs does not prove that the normal device sync is healthy.

## Cause

Learn says the issue occurs if the `dmwappushservice` service is disabled. Its example is a PowerShell script deployed to the device that contains a command disabling this service. The service is required on client devices for Intune management, and with it disabled the device cannot sync with Intune.

That example has an uncomfortable side effect. The management extension delivers the script that disables the service that normal sync depends on, and the extension keeps working afterward.

## Solution

Learn gives one fix: change the startup type of the `dmwappushservice` service to **Automatic**. The page includes a screenshot of the startup type drop-down option in the service properties.

## Checks I would add

This section is my own advice, not part of the Learn page.

1. **Look at the service on the affected device.** Open the Services console (`services.msc`), find the service by its name `dmwappushservice`, and read the startup type and status. If the startup type is **Disabled**, you have found the Learn cause.
2. **Set the startup type, then start the service if it is stopped.** Learn only names the startup type change. Starting the service afterward is my addition, so that you do not have to wait for a restart to test.
3. **Search your own scripts before you fix a single device.** If a PowerShell script, a remediation or another tool disabled the service, it can do so again. Look through the scripts and remediations assigned to the device for any command that stops or disables services. Fix the source, not only the device.
4. **Compare an affected and a working device.** If many devices show the same service state, the cause is in what you deploy, not in the individual machines.

## Test the sync after the fix

Learn's separate page for the Sync device action describes how to trigger a sync from the admin center and what it does:

1. In the Microsoft Intune admin center, select **Devices** > **All devices**.
2. Select the device.
3. In the row of action icons at the top of the device overview pane, select **Sync**.
4. Select **Yes** to confirm.

The page says the action forces a device to check in with Intune. When a device checks in, it receives any pending actions or policies assigned to it. Learn says this is useful for validating and troubleshooting policy deployment without waiting for the next scheduled check-in.

For Windows, the page says Intune starts an on-demand synchronization across multiple workloads, which includes, but is not limited to, configuration policy processing, app detection and deployment state updates, and script and remediation processing. You can follow the progress on the **Device sync status** tab in the device overview pane. Learn says that tab applies only to Windows and iOS/iPadOS devices, and that you need the **Preview new device view** toggle set to on, found at the top right of the Intune admin console.

To run the Sync action you need an account with one of these roles, per Learn: Help Desk Operator, School Administrator, Endpoint Security Manager, or a custom role that includes the **Remote tasks/Sync devices** permission plus permissions that give visibility into managed devices, for example Organization/Read and Managed devices/Read.

After you correct the service, run **Sync** and check that the last sync time updates and the **Device sync status** tab shows progress.

## What the page does not tell you

I read the whole Learn page. It does not describe how to recover a device that is also unenrolled, how to find which script disabled the service, or what happens on other platforms. It gives the cause and the one fix. For anything beyond it, collect the service state, the scripts assigned to the device and the last sync time, and compare them against a healthy device.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [PowerShell](https://www.m365.fm/entity/powershell/)

## Sources

- [Troubleshoot Windows 10 devices that can't sync with Intune after enrollment - Intune (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/mem/intune/device-management/cannot-sync-windows-10-devices)
- [Device Action: Sync - Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/intune/device-management/actions/sync)
