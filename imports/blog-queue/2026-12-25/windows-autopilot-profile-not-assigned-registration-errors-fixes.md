---
title: "Windows Autopilot Profile Not Assigned or Registration Errors: Event IDs and Fixes"
summary: "Troubleshoot Windows Autopilot with Microsoft Learn's FAQ: event IDs 809, 815, 807 and 908, error 0x80180014, hardware changes, hardware hash import failures, Intune Connector issues and the topics the FAQ does not cover."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [windows-autopilot, intune]
keypoints:
  - "Event 815 means no profile is assigned and no default profile exists in the tenant. Event 809 means the assigned profile was deleted without cleanup."
  - "Event 807 points to the hardware hash and profile assignment. Event 908 is a serial number or product key ID mismatch that calls for re-registering the device."
  - "Error 0x80180014 has two causes: a device record to clear with Unblock device, or Windows MDM enrollment blocked in restrictions."
  - "A hardware hash import that does nothing and shows a 400 error can mean unpadded Base64. Learn gives a PowerShell test and a padding method."
  - "The FAQ does not cover Assigning profile hangs, group tags or dynamic group delay, and it gives no hours or minutes."
faq:
  - q: "What does event ID 815 mean?"
    a: "According to Microsoft Learn, no profile is assigned to the device and no default profile was found in the tenant. Validate that a Windows Autopilot profile is assigned to the device."
  - q: "What does event ID 809 mean?"
    a: "The assigned profile was deleted without first being cleaned up. Learn says to assign a different profile and then try to re-enroll the device."
  - q: "How do I fix error 0x80180014 on re-enrollment?"
    a: "Learn lists two causes. One, clear the device record: in the Intune admin center go to Devices > Windows > Enrollment > Devices, select the device and choose Unblock device, then redeploy the profile. Two, set Windows (MDM) to Allow in enrollment restrictions."
  - q: "What should I do after a hardware change?"
    a: "Learn says the device might show Fix pending or Attention required, and the fix is to deregister and re-register the device."
  - q: "Does the FAQ explain how long profile assignment takes?"
    a: "No. The page contains no hours or minutes values, and it does not cover group tags or dynamic group membership delay."
---

When a Windows Autopilot device gets no profile or fails registration, the Windows event log usually names the cause. This article follows the Microsoft Learn troubleshooting FAQ and keeps to what it states.

## Profile not assigned

- **Event 809** (`ZtdDeviceHasNoAssignedProfile`, the assigned profile does not exist): the profile assigned to the device was deleted without first being cleaned up. Assign a different profile and then try to re-enroll.
- **Event 815** (`ZtdDeviceHasNoAssignedProfile`, no profile assigned and no default profile found in the tenant): validate that a profile is assigned to the device.

## Registration errors

- **Event 807** (`ZtdDeviceIsNotRegistered`): validate that the hardware hash is uploaded to Intune and that the device is assigned to a deployment profile.
- **Event 908** (`SerialNumberMismatch` or `ProductKeyIdMismatch`): re-register the device and try to re-enroll.
- **Error 0x80180014** on re-enrollment has two causes:
  1. Intune changed the self-deploying and pre-provisioning experience, so the device record must be cleared. In the Intune admin center go to **Devices** > **Windows** > **Enrollment** > **Devices**, select the device and choose **Unblock device**. A success message might not appear, but the device is ready. Then redeploy the profile.
  2. Windows MDM enrollment is blocked. Set **Windows (MDM)** to **Allow** in enrollment restrictions.
- **Hardware change:** the device might show **Fix pending** or **Attention required**. Deregister and re-register it.
- **Join type shows Microsoft Entra registered:** delete the Intune, Microsoft Entra ID and Windows Autopilot objects, then re-register and re-enroll.
- **Error 80180018:** follow the linked Intune enrollment troubleshooting guide. Common causes named are incorrect or missing user licenses and too many devices enrolled for the user. The default device limit is 50 and can be configured in Microsoft Entra ID.

## Quick reference

| Event or error | What the FAQ says to do |
| --- | --- |
| 809 | Assign a different profile, then re-enroll |
| 815 | Validate that a profile is assigned to the device |
| 807 | Check the hardware hash upload and the deployment profile assignment |
| 908 | Re-register the device, then re-enroll |
| 0x80180014 | Choose Unblock device in the Intune admin center, or set Windows (MDM) to Allow |
| 80180018 | Follow the linked Intune enrollment troubleshooting guide |

## Suggested order

This order is a suggestion, not from the FAQ. Read the event ID first, because it narrows the cause. Then check whether a profile is assigned, whether the hardware hash is registered and whether enrollment restrictions allow Windows MDM. Only deregister and re-register the device when the event or the device status points to a mismatch or a hardware change, because that removes the existing registration.

## Hardware hash import does nothing

If selecting **Import** does nothing, a network trace may show a 400 error with the message that a literal cannot be converted to type `Edm.Binary`. The page says the hash is unpadded Base64, while Autopilot expects padded Base64.

1. Test the hash with PowerShell: `[System.Text.Encoding]::ascii.getstring([System.Convert]::FromBase64String("DEVICE HASH"))`.
2. If decoding fails and the last two characters are `=`, replace both with a single `A`. Otherwise add one `=` at the end. Repeat until the error `Invalid length for a Base-64 char array or string` no longer appears.
3. Import the padded hash.

## Intune Connector for Active Directory

For hybrid scenarios the page says:

- Update to version 6.2501.2000.5 or later and make sure the legacy version is not in use.
- Logs are in Event Viewer under **Applications and Services Logs** > **Microsoft** > **Intune** > **ODJConnectorService**. The older ODJ Connector Service log may be empty.
- To uninstall, use the Settings app and `ODJConnectorBoostrapper.exe`. The installer version must match the connector version.
- For a permissions error, check the administrator's permissions and that the OU in `ODJConnectorEnrollmentWizard.exe.config` exists. Details are in `ODJConnectorUI.log`.
- Error 0x80070774 is usually a domain mismatch between where the connector is installed and where device configurations are targeted.
- For "Cannot start service ODJConnectorSvc", check replication latency across domain controllers and that the MSA has Log on as a service rights.

## Not covered by the FAQ

The page does not cover a device stuck at Assigning profile, group tags, dynamic group membership delay, a portal procedure for uploading a hardware hash, or any waits and timeouts. For those, use other Microsoft documentation and do not assume timings.

## Related

- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Windows Autopilot troubleshooting FAQ](https://learn.microsoft.com/autopilot/troubleshooting-faq)
