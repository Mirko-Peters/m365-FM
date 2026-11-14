---
title: "Defender for Endpoint Onboarding Fails: Troubleshoot Onboarding Issues"
summary: "Devices missing from the Devices list an hour after onboarding: check the script result by event ID, Intune error codes and non-compliance cases, then the SENSE event log, the diagnostic data service, connectivity, Antivirus policies and servers."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [microsoft-defender-for-endpoint, group-policy, configuration-manager, intune]
keypoints:
  - "If devices are not in the Devices list an hour after onboarding, the Learn page points to an onboarding or connectivity problem."
  - "For script deployments, look in Event Viewer under Windows Logs, Application, for events from the WDATPOnboarding source and match the event ID."
  - "Event ID 15, failed to start the SENSE service, has three listed causes: a pending service state, system error 577 or 1058 with the ELAM driver, or a missing SENSE feature on demand."
  - "On the device, filter the SENSE Operational log for Critical, Warning and Error. Events 5, 15 and similar often mean no Internet access."
  - "Make sure the diagnostic data service is set to AUTO_START, WinHTTP can reach the service URLs, and no policy disables Microsoft Defender Antivirus."
faq:
  - q: "How long should I wait before I troubleshoot?"
    a: "The Learn page says that if you completed onboarding and do not see devices in the Devices list after an hour, it might indicate an onboarding or connectivity problem. Group Policy deployments do not show success or failure in the console, so check the script output on the devices."
  - q: "Where do I see the result of the onboarding script?"
    a: "On the device, open Event Viewer and go to Windows Logs, Application, then look for events from the WDATPOnboarding event source. If the event is an error, the page's table maps the event ID to a cause and a fix, for example 65 for insufficient privileges, which means run the script again with administrator privileges."
  - q: "What does event 15, failed to start the SENSE service, mean?"
    a: "The page lists three cases. If the service is in a pending state, check it with sc query sense and run the script again with administrator rights. If the message is system error 577 or 1058, the Microsoft Defender Antivirus ELAM driver must be enabled. If the SENSE feature on demand may be missing, check it with DISM and install it if the state is not Installed."
  - q: "Why does Intune show my device as non-compliant after onboarding?"
    a: "The page lists three known cases: the user has not finished the out-of-box experience, the SENSE service startup type is Delayed Start, which the page says should fix itself within 24 hours, or onboarding and offboarding policies are deployed to the same device at the same time."
  - q: "Do servers follow the same steps?"
    a: "The page has a separate section for Windows Server 2016 and earlier. It points to the Microsoft Monitoring Agent and the server onboarding article. Use that article for server specifics."
---

When a device does not appear in Microsoft Defender for Endpoint after onboarding, the cause can sit in the deployment tool, on the device, or in the connection to the service. The Microsoft Learn page on onboarding troubleshooting is long. This article follows its order and keeps the tables that matter most. The page first asks you to confirm that the minimum requirements for licensing, hardware and software are met, so do that before anything below. My own advice is marked.

## When to start

The page says that if you finished onboarding and do not see the devices in the **Devices list** after an hour, there might be an onboarding or connectivity problem.

## Step 1: Check the deployment tool

### Group Policy

Group Policy deployment runs the onboarding script on the devices. The Group Policy console does not show whether it worked. After an hour without devices, check the script output on the devices, as in the next section.

### Configuration Manager

The page notes that with Configuration Manager version 1606 or later you no longer need a local script. You can deploy onboarding configuration files through applications or endpoint protection policies, and track the deployment in the console. Local scripts remain an option for manual onboarding of a few devices.

### Script result on the device

1. Open **Event Viewer**.
2. Go to **Windows Logs** > **Application**.
3. Look for events from the **WDATPOnboarding** source.

These IDs are specific to the onboarding script:

| Event ID | Meaning | What the page says to do |
| --- | --- | --- |
| 5 | Offboarding data found but could not be deleted | Check the registry permissions on `HKLM\SOFTWARE\Policies\Microsoft\Windows Advanced Threat Protection` |
| 10 | Onboarding data could not be written to the registry | Same registry check, and verify the script ran as administrator |
| 15 | Failed to start the SENSE service | See the three cases below |
| 30 | Script did not wait for the service to start | The service might need more time or hit errors. See the event and error codes page |
| 35 | Onboarding status registry value not found | The service writes status to `HKLM\SOFTWARE\Microsoft\Windows Advanced Threat Protection\Status`. Check whether it is there |
| 40 | SENSE onboarding status is not 1 | The service did not onboard properly. See the event and error codes page |
| 65 | Insufficient privileges | Run the script again as administrator |
| 70 | Offboarding script is for a different organization | Get the offboarding script for the organization that SENSE is onboarded to |

**Event 15, three cases:**

1. Check the service with `sc query sense`. It must not be in an intermediate state such as Pending_Stopped or Pending_Running. Run the script again with administrator rights. For Windows 10 version 1607 with `START_PENDING`, reboot, and if that does not help, the page says to upgrade to KB4015217 and onboard again.
2. If the message is system error 577 or error 1058, enable the Microsoft Defender Antivirus ELAM driver, see the policy section below.
3. The SENSE Feature on Demand might not be installed. Check with `DISM.EXE /Online /Get-CapabilityInfo /CapabilityName:Microsoft.Windows.Sense.Client~~~~`. If it returns an error or the state is not Installed, install the feature on demand.

### Intune

The page says to use Intune to check error codes. If policies are configured but not reaching devices, you might need automatic MDM enrollment. Selected points:

- **0x87D1FDE8 (remediation failed):** possible causes include a wrong blob (wrong signature or missing PreviousOrgIds fields), a missing policy registry key `HKLM\SOFTWARE\Policies\Microsoft\Windows Advanced Threat Protection` or missing write permission for the OMA DM client, an attempt to remediate a read-only property, or deployment on an unsupported SKU. The page lists Enterprise, Education and Professional as supported, and says Server is not supported by this path.
- **0x87D101A9:** the sender lacks adequate access control permissions. The listed cause is an unsupported SKU, particularly Holographic.
- **MDM event 1819:** Defender for Endpoint CSP failed to set a node value. The page suggests the cumulative update for Windows 10 version 1607. The event log is `Microsoft\Windows\DeviceManagement-EnterpriseDiagnostics-Provider`, channel Admin.

Known non-compliance cases:

| Case | Symptom | Cause and step on the page |
| --- | --- | --- |
| 1 | Compliant by SenseIsRunning, not by OrgId, Onboarding, OnboardingState | The user has not passed OOBE after installation or upgrade. Wait for OOBE to complete |
| 2 | Compliant by OrgId, Onboarding, OnboardingState, not by SenseIsRunning | SENSE startup type is Delayed Start. The page says it should fix itself within 24 hours |
| 3 | Non-compliant | Make sure onboarding and offboarding policies are not deployed to the same device at the same time |

If nothing works, the page says to download the local script from the **Device management** section of the portal and run it in an elevated command prompt.

## Step 2: Check the agent on the device

If the tool shows no error but devices still do not appear after an hour:

1. Open **Event Viewer** and go to **Applications and Services Logs** > **Microsoft** > **Windows** > **SENSE** > **Operational**. SENSE is the internal name of the sensor behind Defender for Endpoint.
2. Filter the current log for **Critical**, **Warning** and **Error**.
3. Match the event ID. A few from the page's table:

| Event ID | Message in short | Page action |
| --- | --- | --- |
| 5 | Failed to connect to the server | Ensure the device has Internet access |
| 6 | Not onboarded, no parameters found | Run the onboarding script again |
| 7 | Failed to read onboarding parameters | Check Internet access, run the whole process again |
| 9 | Failed to change start type | During onboarding, reboot and rerun the script. During offboarding, contact support |
| 10 | Failed to persist onboarding information | Rerun the script, contact support if it persists |
| 15 | Cannot start the command channel | Ensure Internet access |
| 55 | Failed to create the Secure ETW autologger | Reboot |
| 69 | A service is stopped | Start the named service, contact support if it persists |

The table has more events, many of which end in contact support. Use the page for the full list.

## Step 3: Check the supporting components

### Diagnostic data service

Check that the Windows diagnostic data service starts automatically and runs. The page gives the commands `sc qc diagtrack`, `sc config diagtrack start=auto` and `sc start diagtrack`, with `AUTO_START` as the expected start type. It notes that from Windows 10 build 1809 the EDR service has no direct dependency on DiagTrack, and evidence can still upload if it is not running.

### Internet connection

The sensor needs Windows HTTP (WinHTTP) to report data. WinHTTP is independent of browser proxy settings and must find the proxy servers in your environment. The page points to the articles on verifying client connectivity to the service URLs and on configuring proxy and Internet connectivity.

### Microsoft Defender Antivirus must not be disabled by policy

The page says this applies to devices that did not yet get the August 2020 update (version 4.18.2007.8) of Microsoft Defender Antivirus, which stopped a system policy from turning it off. The symptom is that onboarding completes, but starting the service gives error 577 or 1058. With a third-party antimalware client, the agent needs the ELAM driver enabled. Clear the `DisableAntiSpyware` and `DisableAntiVirus` policy values under `HKLM\SOFTWARE\Policies\Microsoft\Windows Defender`, then onboard again. The Windows Defender services should be in their default state, and the page warns that changing their startup is unsupported and may force a reimage.

## New devices and servers

For a newly built device, the SENSE service may not start if the OOBE or first user logon is not completed and the device is turned off or restarted first. The page says a logon after OOBE is no longer required from Windows 10 version 1809, Windows Server 2019 and Azure Stack HCI OS version 23H2.

For Windows Server 2016 and earlier, the page lists verification steps around the Microsoft Monitoring Agent, the proxy and Internet settings, and checks in Task Manager, Event Viewer and Services. Use the linked server onboarding documentation for those systems, since this article does not cover the server steps in detail.

## Checking order (my advice)

This is my suggestion, not an order from the page:

1. Wait the hour, then confirm the device really is missing from the Devices list and not just filtered.
2. Check the tool first: script events for script deployments, Intune error codes for Intune.
3. If the tool says success, read the SENSE Operational log on one device.
4. Test the connection with the verification steps before you change policies. Many events on the page end in Internet access.
5. Fix one device, then roll the fix out, and record the event ID that led to it.

## Related

- [Microsoft Defender for Endpoint](https://www.m365.fm/entity/microsoft-defender-for-endpoint/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)
- [Microsoft Configuration Manager](https://www.m365.fm/entity/configuration-manager/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Troubleshoot Microsoft Defender for Endpoint onboarding issues (Microsoft Learn)](https://learn.microsoft.com/defender-endpoint/troubleshoot-onboarding)
