---
title: "Windows Update for Business: Expedite Quality Updates and Roll Back in Intune"
summary: "How to push a critical Windows quality update ahead of the normal schedule with an Intune expedite policy, how reboot deadlines work, and how to roll back a bad update from an update ring, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [windows-update-for-business, intune, windows-autopatch, intune-update-rings]
keypoints:
  - "An expedite policy installs one chosen update as soon as possible, bypasses deferrals for that update only and does not change future monthly servicing."
  - "Create it under Devices > Windows Updates > Quality updates > Create > Expedite policy. The reboot deadline can be 0, 1 or 2 days."
  - "Devices need Intune management, Entra join or hybrid join, telemetry at Required, and no Group Policy that blocks scanning or points to another update source."
  - "Deleting an expedite policy does not uninstall an update that already installed."
  - "To roll back, use Uninstall on an update ring. Intune sends it immediately, can restart devices without a delay option, and pauses updates of that type on the ring."
faq:
  - q: "Does an expedite policy replace my update rings?"
    a: "No. According to Microsoft Learn, expedite policies are designed for targeted, time-bound scenarios and do not change how future quality updates are deployed. They override deferrals only for the update named in the policy. Keep using update rings or quality update policies for monthly servicing."
  - q: "How fast does an expedited update install?"
    a: "Microsoft Learn gives no fixed time. Expedited updates begin installing after the device completes its next update scan and communicates with the service. The start time can vary with connectivity, scan timing and service processing."
  - q: "What reboot deadline can I set in an expedite policy?"
    a: "Microsoft Learn says you can choose 0 to 2 days. With 0 days the user is notified right after installation and has limited time to save work. With 1 or 2 days the automatic restart is delayed by 24 or 48 hours. If the update does not need a restart, the setting is not enforced."
  - q: "Can I expedite a non-security quality update?"
    a: "Per Microsoft Learn, non-security D releases can be expedited only on Windows 11 devices. A Windows 10 device assigned a D release is not expedited and shows an alert in the reports. Only one update can be selected per policy."
  - q: "How many days can I roll back a quality update?"
    a: "The Microsoft Learn page on update rings states a 2 to 60 day uninstall period only for feature updates. For quality updates it describes no such window, but says the device must have installed the latest update and that rollback is available only for the servicing channel the device is on."
---

For a zero-day fix, create an Intune expedite policy for the single security update you need. It installs that update after each device's next scan and ignores deferrals for it, while your monthly servicing stays untouched. If the update causes problems, use the **Uninstall** action on the update ring to roll it back. Microsoft Learn describes both features, with a few limits that matter during an incident.

## Check the prerequisites first

Learn lists these requirements for quality update and expedite policies:

- Microsoft Intune Plan 1 and a Windows license that includes the Autopatch entitlement.
- Windows Pro, Pro Education, Enterprise or Education. Windows Enterprise LTSC is not supported for these policies, so use update rings there.
- Devices managed by Intune and either Microsoft Entra joined or hybrid joined.
- Telemetry on, at a minimum of **Required**.
- The Microsoft Account Sign-In Assistant service (`wlidsvc`) enabled and running.
- Access to Intune, Windows Update and Windows Autopatch endpoints.
- For reporting, permission for Intune to use Windows diagnostic data.

Learn recommends these update ring values on targeted devices:

| Setting | Recommended value |
|---|---|
| Enable pre-release builds | Not configured |
| Automatic update behavior | Reset to default |
| Change notification update level | Anything except turning off all notifications including restart warnings |

Settings that stop scanning block the expedited scan, and requiring approval for download can delay the update. If Group Policy manages the device, Learn lists CorpWuURL, AutoUpdateCfg, DeferFeatureUpdates and Disable Dual Scan as settings to restore to Not configured.

For Windows versions earlier than 24H2, the Update Health Tools are required, installed through KB4023057 or the Download Center. On Windows 11 24H2 and later, Learn says not to install them and to uninstall the MSI if present.

## Create the expedite policy

1. In the Microsoft Intune admin center, go to **Devices** > **Windows Updates** > **Quality updates**.
2. Select **Create** > **Expedite policy**.
3. Enter a name and a description.
4. Under **Select the quality update you would like to Expedite**, choose the update. The list shows only expeditable updates.
5. Choose the number of days before a required reboot is enforced.
6. Under **Assignments**, select **Add groups**.
7. Select **Review + create**, then **Create**.

The policy deploys to the assigned groups after it is created.

Updates are identified by release date. B releases are the Patch Tuesday security updates, and OOB releases are out-of-band security updates. The list shows the two most recent security updates. Non-security D releases appear only when no newer security update exists, and they apply to Windows 11 only.

## Understand the reboot deadline

The deadline range is 0 to 2 days. With 0, the user is notified right after installation. With 1 or 2, the automatic restart is delayed by 24 or 48 hours. If the device restarts manually before the deadline, the automatic restart is canceled. If the update needs no restart, the setting does nothing.

Users can restart now, schedule a restart or let Windows choose a time outside active hours. If they do nothing, Learn says the restart might occur during working hours after the deadline.

## Know what the policy does and does not do

- Windows Update checks each device for applicability. Devices that already have the update, or a newer applicable one, do not receive it.
- The policy overrides deferrals only for the update version it names.
- A newer update can be installed instead if the device is not blocked by a deferral for it and a new scan finds it. Windows Update then tries to stop the original installation and cancels the restart.
- Only one update per policy is supported, and preview builds are not supported.
- No fixed delivery time is documented.

## Monitor the rollout

Go to **Reports** > **Windows Updates**. The **Summary** tab shows the **Windows Expedited Quality updates** table with devices installing, completed or in error. On the **Reports** tab, open **Windows Expedited Update Report**, choose the profile and select **Generate report** for per-device status.

## Roll back a bad update

Deleting the expedite policy does not uninstall an update that has finished installing. Learn also says Windows Update tries to cancel in-progress installations, but cancellation cannot be guaranteed. For rollback, use the update ring:

1. Go to **Devices** > **By platform** > **Windows** > **Manage updates** > **Windows updates**.
2. Open the **Update rings** tab and select the ring.
3. Select **Uninstall**, choose **Quality** or **Feature**, and select **OK**.

Learn describes these effects:

- Intune sends the request to devices immediately. Removal is not limited to maintenance schedules.
- If removal needs a restart, the device restarts without offering the user a delay.
- The device must have installed the latest update, and the rollback is available only for the servicing channel the device is on.
- Intune also pauses updates of the same type on that ring. When the pause ends, devices reinstall the rolled-back update if it still applies.
- After a quality update is rolled back, it still appears in **Update History**.
- Uninstall does not work when a feature update was applied with an enablement package.

The pause itself lasts up to 35 days. You can use **Pause**, **Resume** and **Extend** from the same ring. A pause command reaches devices at their next check-in, so a scheduled update can install before then.

## Typical mistakes

- Expecting the policy to start within minutes on offline devices.
- Leaving Group Policy settings that block scanning in place.
- Using a user group instead of a device group, which Learn advises against for update rings.
- Selecting a D release for Windows 10 devices.
- Rolling back during working hours without warning users of the forced restart.

## What the sources do not say

The pages read do not state a delivery timeframe, and the quality update page does not mention rollback. The update ring page gives a 2 to 60 day window only for feature updates, so check on a pilot ring how long the rollback of a quality update stays available. The expedite page also says the Update Health Tools check script's return codes are described the opposite way from what the script prints, so verify the logic before using it.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)
- [Intune update rings](https://www.m365.fm/entity/intune-update-rings/)

## Sources

- [Expedite policies for Windows quality updates](https://learn.microsoft.com/en-us/intune/device-updates/windows/quality-updates-policy)
- [Windows quality updates overview](https://learn.microsoft.com/en-us/intune/device-updates/windows/manage-quality-updates)
- [Manage Windows update ring policies](https://learn.microsoft.com/en-us/intune/device-updates/windows/manage-update-rings)
- [Windows update ring settings reference](https://learn.microsoft.com/en-us/intune/device-updates/windows/ref-update-ring-settings)
