---
title: "Feature Update Deferral and Driver Updates in Intune Update Rings: How the Settings Fit Together"
summary: "How the feature update deferral, quality update deferral and Windows drivers settings in Intune update rings relate, what Windows Update client policies (formerly Windows Update for Business) document, and how driver update policies work."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [windows-update-for-business, intune-update-rings, intune, windows-autopatch]
keypoints:
  - "Learn says Windows Update for Business is now called Windows Update client policies. The feature update deferral can be 0 to 365 days and the quality update deferral 0 to 30 days."
  - "In an Intune update ring, drivers are controlled by their own Windows drivers setting (Allow or Block) under Update settings, separate from the feature update deferral."
  - "Learn describes driver updates as part of quality updates and on by default, with the option to turn them off in the policies."
  - "Intune driver update policies offer automatic or manual approval and work alongside feature and quality update policies. They need an Autopatch entitlement and Intune Plan 1."
  - "The pages read do not state how driver offerings behave while a feature update is deferred. Test on a pilot ring and verify with reports."
faq:
  - q: "Does a feature update deferral stop driver updates?"
    a: "The Learn pages read do not say so. They describe feature update deferral as a separate setting (0 to 365 days) and describe drivers under quality updates, with a separate Windows drivers setting in the update ring. Verify the behavior on a pilot ring before you rely on it."
  - q: "How long can I defer feature and quality updates?"
    a: "Learn lists a maximum deferral of 365 days for feature updates and 30 days for quality updates. The Intune update ring reference gives the same ranges, 0 to 365 and 0 to 30 days, and says the periods add to any deferral that is part of the service channel you select."
  - q: "How do I block drivers from Windows Update in an update ring?"
    a: "In the update ring reference, the Windows drivers setting under Update settings has Allow and Block values. Block prevents scanning for drivers. The setting maps to the ExcludeWUDriversInQualityUpdate policy."
  - q: "What is the alternative to blocking drivers completely?"
    a: "Learn describes Intune driver update policies, where you review, approve and deploy drivers with automatic or manual approval. They require Microsoft Intune Plan 1 and a Windows license with the Autopatch entitlement, and Enterprise LTSC is not supported."
  - q: "What is the pause period for updates?"
    a: "Learn says you can pause a feature or quality update for 35 days from a start date. If you pause a feature update, quality updates are still offered so that devices stay secure."
---

In Intune update rings, feature update deferral and driver handling are separate settings. The feature update deferral delays when a feature update is offered. The **Windows drivers** setting decides whether Windows Update drivers are included at all. Microsoft Learn documents both, plus a separate Intune driver update policy for controlled approval. It does not say how the two interact when a feature update is deferred, so that part needs testing.

## Naming note

Learn's overview says the feature formerly known as Windows Update for Business is now called Windows Update client policies. It is free for Pro, Education and Enterprise editions of Windows 10 and Windows 11. Group Policy or MDM solutions such as Intune configure it. Many portal strings and older articles still use the earlier name.

## What the settings do

From the update ring settings reference:

| Setting | Values and behavior |
|---|---|
| Feature update deferral period | 0 to 365 days. Adds to any deferral from the service channel you select. The deferral starts when Microsoft releases the update. |
| Quality update deferral period | 0 to 30 days. Adds to any deferral from the service channel. Learn advises keeping it under three days so devices stay secure. |
| Windows drivers | Allow includes Windows Update drivers during updates. Block prevents scanning for drivers. |
| Microsoft product updates | Allow or Block scanning for app updates from Microsoft Update. |

Learn's overview describes the update types this way: feature updates contain security and quality revisions plus significant feature changes, quality updates are typically released on the second Tuesday of each month and include security, critical and driver updates, and driver updates for non-Microsoft drivers are on by default but can be turned off. Product updates are off by default.

The overview also explains that deferrals count days from when an update is first made available on the Windows Update service. A feature update deferral of 365 days means a device does not install a feature update released less than 365 days ago. Learn names the policy **Select when Preview Builds and feature updates are Received** for feature update deferral and **Select when Quality Updates are Received** for quality updates.

## Pause as a safety valve

If a problem appears during deployment, Learn says you can pause a feature or quality update for 35 days from a specified start date. If you pause a feature update, quality updates are still offered, so devices stay secure. Learn's update ring reference also has an option that controls whether device users can pause updates themselves.

## Where the driver question sits

The monthly quality update path is where Learn places driver updates. That is why the quality update deferral and the Windows drivers setting matter more for driver timing than the feature update deferral. The pages read do not state that a feature update deferral changes driver offerings, and they do not state that it leaves them untouched. Treat it as untested.

A practical check, as the author's suggestion rather than a Learn procedure:

1. Use a pilot update ring with the feature update deferral you plan to use.
2. Keep the quality update deferral low and leave **Windows drivers** on **Allow**.
3. Confirm in your update reports which drivers arrive on the pilot devices.
4. Only then copy the ring settings to broader rings.

## Controlled driver approval with driver update policies

If you do not want all drivers from Windows Update, Learn describes driver update policies in Intune. Key points from the page:

- Policies provide a place to review, approve and deploy drivers to managed devices.
- They support automatic or manual approval workflows.
- They work alongside feature and quality update policies and can be used independently or as part of Windows Autopatch.
- Client-side install behavior such as restarts and notifications is still governed by the standard Windows Update policy settings.
- Windows Update decides which driver updates apply to a device and installs only approved updates during regular update scans.

Requirements listed on the page include Microsoft Intune Plan 1, a Windows license with the Autopatch entitlement, Pro, Pro Education, Enterprise or Education editions, devices that are Intune-managed and Microsoft Entra joined or hybrid joined, telemetry at least on Required, and the `wlidsvc` service running. Enterprise LTSC is not supported, and Learn says to use update ring policies there.

## Restart and deadline settings

Deadlines and restart behavior sit in the same update ring but are independent of the deferral values. Learn's reference lists separate deadline, grace period and auto reboot settings for quality and feature updates. For quality updates it suggests a deadline of 0 or 1 day and a grace period of 1 or 2 days. Another article in this series covers those restart settings in detail.

## What the documentation does not say

The pages read do not describe:

- how driver offerings behave while feature updates are deferred;
- how the Windows drivers Block setting interacts with an active Intune driver update policy;
- a recommended deferral value for feature updates.

Check those combinations on test devices and in reports before wide deployment.

## Related

- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Intune update rings](https://www.m365.fm/entity/intune-update-rings/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)

## Sources

- [Windows Update client policies (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/deployment/update/windows-update-client-policies)
- [Update rings policy settings, Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/device-updates/windows/ref-update-ring-settings)
- [Manage Windows driver updates, Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/device-updates/windows/manage-driver-updates)
