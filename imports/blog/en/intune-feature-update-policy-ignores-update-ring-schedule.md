---
title: "Intune Feature Update Policy Ignores the Update Ring Schedule: What Controls the Install Time"
summary: "A feature update policy set to 'as soon as possible' installs at check-in, even if the update ring has a weekly install schedule. Here is what each policy controls and how to set them up together."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [intune, intune-update-rings, windows-update-for-business, windows-autopatch]
keypoints:
  - "A feature update policy decides which Windows version is offered and when the offer starts. An update ring does not decide that for a feature update that a policy controls."
  - "'Make update available as soon as possible' makes the update available without delay, so a weekly ring schedule will not hold it back."
  - "Use the rollout options on the feature update policy (specific date or gradual) to control when the offer starts."
  - "Microsoft Learn recommends setting 'Feature update deferral period (days)' to 0 in the ring, but only after the targeted devices show OfferReady in the report."
  - "Restart behavior, deadlines and active hours still come from the update ring and the Windows Update client settings."
faq:
  - q: "Does the update ring install schedule apply to a feature update policy?"
    a: "In a 2025 Tech Community thread, the answer marked as the solution said no. Microsoft Learn does not state this directly. It says that installation timing and restart behavior are still influenced by update ring settings, while the offer itself is controlled by the feature update policy. Test it on a pilot group."
  - q: "What should the feature update deferral in my update ring be?"
    a: "Microsoft Learn recommends 0 when a device is also targeted by a feature update policy. Change it only after the targeted devices show OfferReady in the Windows feature updates (Organizational) report."
  - q: "How do I stop all devices from downloading the feature update at once?"
    a: "Use the rollout options of the feature update policy. Learn lists 'Make update available on a specific date' and 'Make update available gradually'. A gradual rollout needs a first group date at least two days in the future."
  - q: "Will the policy move a device back to an older Windows version?"
    a: "No. Microsoft Learn says feature update policies do not downgrade devices. A device that is already on a newer version keeps it."
---

You have an Intune update ring that installs monthly updates on Tuesdays at 11 AM. You add a feature update policy to move Windows 10 devices to Windows 11, and you assign it to the same device group. You expect the upgrade to wait for the Tuesday window. Instead the devices download it at their next check-in.

A Microsoft Community Hub thread from March 2025 describes exactly this test. The poster used a required feature update policy with the rollout option "Make update available as soon as possible." One reply was marked as the solution. It came from a community member with the Microsoft Certified Trainer badge. The poster did not confirm in the thread that the advice worked, so treat the thread as the scenario and use Microsoft Learn for the facts.

This is not an official Microsoft procedure. It is a troubleshooting guide built from one community thread and the Microsoft Learn pages for Intune Windows updates, which were last updated in April 2026 when I checked.

## Symptoms

- A feature update starts downloading right after the device checks in, not at the time set in the update ring.
- The device is in both an update ring and a feature update policy.
- The feature update policy uses a required deployment and "Make update available as soon as possible."

## What each policy controls

Microsoft Learn describes the feature update policy as the place that controls which Windows version a device is offered and when that version can install. The update ring still influences the client side. Learn says restart experience and installation timing continue to be influenced by standard Windows Update policy settings, including update rings.

So the two policies do not compete over the same thing. The feature update policy is about the offer. The ring is about how the device behaves once Windows Update has the update.

The thread reply said the same in simple terms: the ring's schedule does not apply to the feature update policy, and the "as soon as possible" option makes devices download and install when they detect the policy. Learn does not word it this way, and it does not say whether the ring's scheduled install day and time apply to a feature update. That point is open. Test it before you rely on it.

## Step 1: Check the rollout option of the policy

1. In the Microsoft Intune admin center, go to **Devices**, then **Windows**, then **Windows updates**, then **Feature updates**.
2. Open the policy and look at its deployment settings and rollout options.

Microsoft Learn lists three rollout options:

- **Make update available as soon as possible.** The update is available to targeted devices without delay. This matches the default Windows Update behavior.
- **Make update available on a specific date.** Devices do not get the offer until that date.
- **Make update available gradually.** The offer is spread over time in offer groups.

If your policy uses the first option, the early download in the thread is the expected result.

## Step 2: Pick a rollout option that fits your plan

For a controlled start, change the rollout option instead of trying to use the ring for it.

- **Specific date:** use this when you want the offer to start on a known day for the whole group.
- **Gradual:** set **First group availability**, **Final group availability** and **Days between groups**. Learn says the first group date must be at least two days in the future. Devices are placed into groups at random, and each group has at least 100 devices. Devices assigned after the final date get the offer immediately.
- **Separate policies for separate groups:** the thread reply also suggested this. It fits Learn, because each feature update policy is assigned to device groups and targets one Windows version.

Also check the deployment type. Learn names two options. **Make available to users as a required update** installs automatically based on device settings. **Make available to users as an optional update** needs the user to start it, and it requires a Windows Autopatch license.

## Step 3: Clean up the feature update deferral in the ring

Learn says that when a device is targeted by both a feature update policy and an update ring, you should set **Feature update deferral period (days)** in the ring to 0. Then the ring does not delay a feature update that the policy controls. Make sure feature updates in the ring are not paused.

Learn also says combining feature update deferrals with feature update policies adds complexity and can delay or block feature updates. Update rings can still manage user experience settings such as restart behavior and notifications.

Do not just set the deferral to 0 on a live group. Learn gives a safe order:

1. Create the feature update policy for the version you want and assign it. Wait. Learn says processing usually finishes within 10 minutes but can take longer.
2. In the **Windows feature updates (Organizational)** report, check that the targeted devices show **OfferReady**.
3. Only then edit the update ring and set **Feature update deferral period (days)** to 0.

Learn warns that if you skip the check, devices may be offered a feature update you did not intend, if they scan after the deferral is removed and before processing finishes.

## Step 4: Use the ring for install behavior

The ring settings that still matter for a feature update are the client-side ones. In the ring, look at these settings:

- **Automatic update behavior.** For example, **Auto install at maintenance time** or **Auto install and restart at a scheduled time**. Learn notes that a scheduled install can be missed because of power policies or user absence, and the device then waits for the next scheduled time or a deadline.
- **Use deadline settings.** When set to **Allow**, you can set **Deadline for feature updates** (2 to 30 days), a **Grace period** (0 to 7 days) and **Auto reboot before deadline**.
- **Active hours.** These block automatic restarts during that period.
- **Option to pause Windows updates.** This decides whether users can pause.

Learn says deadlines, restart controls and active hours continue to be governed by the update rings and the Windows Update client settings.

## Step 5: Verify

- In the feature update report, check that devices move from **OfferReady** to the later states you expect.
- Pick two pilot devices, one in each rollout setup, and watch when the download starts and when the restart happens.
- Check the policy assignment. A device can be in more than one feature update policy. Learn says Windows Update offers one feature update at a time and picks the latest applicable version. Windows 11 counts as later than Windows 10.

## Limits and open points

- **Autopilot:** Learn says feature update policies do not apply during the Windows Autopilot out-of-box experience. They take effect at the first Windows Update scan after provisioning ends.
- **Safeguard holds:** Learn says a safeguard hold blocks installation of the targeted version until the known issue is resolved. A device that does not receive the update may be under a hold.
- **Policy lifetime:** A feature update policy stays in effect until you change or remove it. Learn contrasts this with the feature update pause in update rings, which expires after 35 days.
- **No downgrade:** The policy does not move a device to an older version.
- **Prerequisites:** Learn lists Microsoft Intune Plan 1 and a Windows license that includes the Autopatch entitlement, supported editions (LTSC is not supported), Intune management with Microsoft Entra join or hybrid join, telemetry set to at least Required, and the Microsoft Account Sign-In Assistant service (`wlidsvc`) enabled and running. A missing prerequisite can look like a timing problem.
- **Co-management:** Learn says that newly switching the Windows Update policies workload to Intune can cause devices to update past the version you want. Create and assign the feature update policy first, and wait for OfferReady before you switch the workload.
- **Thread status:** The thread has one reply. The poster did not confirm the result. The claim that the ring schedule does not apply is not stated in the same words on Learn.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Intune update rings](https://www.m365.fm/entity/intune-update-rings/)
- [Windows Update for Business](https://www.m365.fm/entity/windows-update-for-business/)
- [Windows Autopatch](https://www.m365.fm/entity/windows-autopatch/)

## Sources

- [Microsoft Learn: Windows feature update policies in Intune](https://learn.microsoft.com/en-us/intune/device-updates/windows/configure-feature-update-policy)
- [Microsoft Learn: Rollout options for Windows updates](https://learn.microsoft.com/en-us/intune/device-updates/windows/configure-rollout-options)
- [Microsoft Learn: Feature updates in Intune](https://learn.microsoft.com/en-us/intune/device-updates/windows/feature-updates)
- [Microsoft Learn: Update ring policy settings](https://learn.microsoft.com/en-us/intune/device-updates/windows/ref-update-ring-settings)
- [Microsoft Learn: Update rings for Windows updates](https://learn.microsoft.com/en-us/intune/device-updates/windows/update-rings)
- [Microsoft Community Hub: Feature Update Policy relationship to Update Ring Install Schedule (March 2025)](https://techcommunity.microsoft.com/discussions/microsoft-intune/feature-update-policy-relationship-to-update-ring-install-schedule/4393447)
