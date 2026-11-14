---
title: "Configure Intune Windows Update Rings Without Causing Unexpected User Reboots"
summary: "Which Intune update ring settings decide when Windows restarts after an update: automatic update behavior, active hours, deadlines, grace period, auto reboot before deadline, and maintenance windows."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [intune, intune-update-rings, windows-update-for-business]
keypoints:
  - "Automatic update behavior sets who controls the restart. Some options restart without end-user control, and Reset to default lets Windows choose active hours."
  - "With deadlines, the effective deadline is the later of scan discovery plus the deadline or restart-required time plus the grace period."
  - "Once the effective deadline passes, the device is forced to restart regardless of active hours."
  - "Auto reboot before deadline set to Yes restarts outside active hours. Set to No, the restart waits for the deadline and grace period and can fall in working hours."
  - "Maintenance windows exist for Windows 11 24H2 and later, but Learn recommends configuring either maintenance windows or deadlines, not both."
faq:
  - q: "Why did a device restart while the user was working?"
    a: "According to Microsoft Learn, once the effective deadline is reached the device is forced to restart regardless of active hours. Learn also says that with Auto reboot before deadline set to No, the device waits until the deadline and grace period expire and the restart could occur during active hours. The Learn page on automatic update behavior adds that some options restart the device automatically after installation."
  - q: "What is the effective deadline?"
    a: "Microsoft Learn defines it as whichever is later: the scan discovery time plus the specified deadline, or the restart-required time plus the grace period. The grace period starts when a restart is pending after the installation is complete."
  - q: "Which Auto reboot before deadline value is recommended?"
    a: "The Intune settings reference recommends Yes, because it lets the system restart when the user is not using the device. No forces the system to wait until the deadline and grace period are over, and that restart could happen during active hours."
  - q: "What does Reset to default do for automatic update behavior?"
    a: "Microsoft Learn says Windows then determines active hours for the device automatically and uses them to schedule the best time to install updates and restart after the installation."
  - q: "Can I use maintenance windows and deadlines together?"
    a: "Microsoft Learn says it does not break the update process but adds confusion. Expired deadlines are the only case in which update settings force actions outside a maintenance window. Learn generally recommends configuring one or the other."
---

Unexpected restarts after Windows updates almost always trace back to three settings groups on the update ring: **Automatic update behavior**, the **deadline** settings and the **active hours** that apply to them. Microsoft Learn is clear about the final rule. When the effective deadline has passed, the device is forced to restart regardless of active hours. The aim is therefore to let the device restart on its own before that point, or to give users enough time.

## Know the restart paths

An update ring offers these options for **Automatic update behavior**, as Learn describes them:

| Option | Restart behavior |
|---|---|
| Notify download | The user chooses to download and install. Without action, the update waits until the configured deadline. |
| Auto install at maintenance time | Installs when the device is not in use or on battery. If a restart is needed, users are prompted for up to seven days, then the restart is forced. |
| Auto install and restart at maintenance time | Restarts when the device is not being used. Active hours block automatic restarts. |
| Auto install and restart at a scheduled time | Installs at your day and time, or 3 AM daily by default, then a 15-minute countdown to restart. Logged-on users can delay it. |
| Auto install and reboot without end-user control | Restarts when not in use. The end-user control pane is read-only. |
| Reset to default | Windows determines active hours automatically and schedules install and restart around them. |

The two options that rely on active hours use **Active hours start** and **Active hours end** to suppress restarts caused by update installation.

For most user devices, **Reset to default** is the least surprising choice, because Windows works out the active hours. Learn notes that some other options can restart a device automatically after installation.

## Set deadlines deliberately

Under **Use deadline settings**, choose **Allow** to configure these values:

| Setting | Range |
|---|---|
| Deadline for feature updates | 2 to 30 days |
| Deadline for quality updates | 2 to 30 days |
| Grace period | 0 to 7 days |
| Auto reboot before deadline | Yes or No |

The Windows documentation explains how they combine. The deadline is based on when the client first discovered the update through a scan. The grace period starts from the pending restart after installation is complete. The effective deadline is the later of the two. Before it, the user can schedule a restart, and Windows can restart outside active hours. After it, the device is forced to restart regardless of active hours.

Set **Auto reboot before deadline** to **Yes**. Learn recommends it because the system then restarts when the user is not using the device. With **No**, the restart waits for the deadline and grace period and could occur during active hours.

Use a grace period that matches how people work. Learn says the grace period is helpful for users returning from time away, because it prevents an immediate forced restart when they come back. Note that short deadline and grace values raise the risk that users miss the notifications.

## Understand what the user sees

Learn describes the default experience on Windows 11 version 23H2 and later:

- While a restart is pending and before the deadline, a toast notification shows the deadline and offers restart now, pick a time, or restart tonight after active hours.
- If the user turned on **Notify me when a restart is required to finish updating**, automatic restarts are blocked for 24 hours after the first notification. With the default Off, the toast appears 24 hours after the restart-pending state.
- A scheduled restart triggers a notification 15 minutes before it happens.
- After the effective deadline, the user has 15 minutes to choose restart before the device is forced to restart.

The **Change notification Update level** setting only controls notifications, not when updates install. Learn lists the option to turn off all notifications including restart warnings. Avoid it, since it removes the warning users rely on before a restart.

## Check interactions that surprise admins

- When a deadline policy is set, updates download and install as soon as they are offered, and the deadline policy ignores restart settings from **Configure Automatic Updates**. Learn notes that since the December 10, 2024 update for Windows 11 22H2 and later, Configure Automatic Updates is respected before the deadline and ignored after it.
- **Restart checks** set to **Skip** is meant for education devices that stay in carts overnight. It causes devices to reboot immediately after installation, and it is not designed for 1:1 devices. It is no longer offered for new policies.
- Pausing: **Option to pause Windows updates** lets users pause. A pause from an update ring runs up to 35 days.
- The quality update **deferral** (0 to 30 days) is an additional delay. Learn notes that the deadline calculation is based on the time the client's scan first discovered the update, so check both values together.

## Consider a maintenance window

Learn describes maintenance windows as a feature released with the January 2026 Windows non-security update for Windows 11, version 24H2 and later. They can be set through Group Policy and MDM. The window can be one-time or repeating, and `MaintenanceWindowUpdateActions` decides whether **Restart**, **Install and restart**, or **Download, install and restart** must start inside the window. The device does not start a restart too close to the end of the window. Learn says the feature fits user-less and critical-use devices and offers few notification controls, so for devices with regular users it points to the default experience or deadlines.

Learn generally recommends configuring either maintenance windows or deadlines, not both. An expired deadline is the only case that forces actions outside the window. The pages read do not describe a dedicated Intune setting for maintenance windows, so check your Intune settings catalog for the CSP policy names.

## A practical checklist

1. Assign rings to device groups. Intune's tip is that device groups remove the need for a sign-in before the policy applies.
2. Choose **Reset to default** for **Automatic update behavior** on user devices.
3. Enable **Use deadline settings** with a deadline, a grace period of several days and **Auto reboot before deadline** set to **Yes**.
4. Leave notifications on.
5. Pilot with a small ring, then roll out.

## Typical mistakes

- Setting **Auto reboot before deadline** to **No** and expecting restarts only at night.
- Using **Auto install and reboot without end-user control** on user devices.
- Stacking a maintenance window and deadlines without checking the result.
- Turning off restart warnings.
- Expecting the Configure Automatic Updates schedule to hold after the deadline.

## What the sources do not say

The pages read do not state a maximum length for active hours, and they do not describe restart behavior for devices managed through Windows Autopatch. For those, Learn only notes that Autopatch may create and maintain update rings and that admins should typically not assign custom rings to Autopatch devices.

## Related

- [Intune](https://www.m365.fm/entity/intune/)
- [Intune update rings](https://www.m365.fm/entity/intune-update-rings/)
- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)

## Sources

- [Update rings policy settings](https://learn.microsoft.com/en-us/intune/device-updates/windows/ref-update-ring-settings)
- [Manage Windows update ring policies](https://learn.microsoft.com/en-us/intune/device-updates/windows/manage-update-rings)
- [Enforce compliance deadlines with policies](https://learn.microsoft.com/en-us/windows/deployment/update/wufb-compliancedeadlines)
