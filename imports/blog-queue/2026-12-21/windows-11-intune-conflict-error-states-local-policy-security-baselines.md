---
title: "Windows 11 Conflict and Error States in Intune: Security Baselines, Group Policy and MDM Policy Compared"
summary: "How to find and resolve Conflict and Error states for Intune policies and security baselines on Windows devices, how MDMWinsOverGP decides between MDM and Group Policy, and which Microsoft Learn pages say what about local policy conflicts."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [intune, security-baselines, group-policy]
keypoints:
  - "In Intune, a Conflict means a device setting Intune cannot override or two policies setting the same value differently. Error means the setting failed to apply, and Pending means no check-in yet."
  - "Per-setting status, the device configuration report and the Source Profiles list show which profiles configure the same setting, so you can fix the conflicting profile."
  - "The MDMWinsOverGP policy (value 1) makes MDM win over Group Policy only for policies in Policy CSP. It does not cover other CSPs such as the Defender CSP."
  - "Learn recommends not configuring the same setting in both GPO and MDM unless MDMWinsOverGP controls it. Otherwise there is a race condition and no guarantee which one wins."
  - "The Windows MDM Advanced Diagnostic Report lists applied policies, configuration sources and blocked Group Policy settings. Use it to trace why a setting conflicts."
faq:
  - q: "What do Conflict, Error and Pending mean for Intune policies?"
    a: "Learn says Conflict means there is an existing setting on the device that Intune cannot override, or two policies deploy the same setting with different values. Error means the policy failed to apply, and Pending means the device has not checked in or has not reported status yet."
  - q: "How do I find which profile conflicts with my baseline?"
    a: "Open the setting in the device's Device configuration view or the baseline's per-setting status. The Settings details pane lists the Source Profiles that configure the same setting with a different value, and you can open each profile and edit its settings to remove the conflict."
  - q: "Does MDM always win over Group Policy?"
    a: "No. Learn says MDMWinsOverGP applies only to policies in Policy CSP, and that it does not apply to equivalent settings defined in other CSPs, such as the Defender CSP. Without it, configuring the same setting in both channels creates a race condition with no guaranteed winner."
  - q: "Where can I see which Group Policy settings are blocked by MDM?"
    a: "In the MDM Advanced Diagnostic Report. Learn says it includes a list of blocked Group Policy settings because an MDM equivalent is configured, if any. Create it under Settings, Accounts, Access work or school, then the account and Advanced Diagnostic Report."
  - q: "How long until baseline status appears after assigning it?"
    a: "For baseline versions released before May 2023, Learn says it takes up to 24 hours for data to appear after the first assignment, and later changes up to six hours. Learn does not give the same figures for newer baseline versions."
---

When a Windows 11 device shows Conflict or Error for an Intune policy or security baseline, the cause is either two Intune profiles that disagree, a setting that Intune cannot override, or a second management channel such as Group Policy. Microsoft Learn documents the report views for the first case and the `MDMWinsOverGP` setting for the third. It does not describe locally applied security baselines (for example from local policy tooling) as a topic, so this article sticks to what the pages read say and marks gaps.

## Understand the states

From the Intune troubleshooting page:

| State | Meaning according to Learn |
|---|---|
| Not Applicable | The policy is not supported on this platform. |
| Conflict | An existing setting on the device cannot be overridden by Intune, or two policies with the same setting use different values. |
| Pending | The device has not checked in to get the policy, or received it but has not reported the status. |
| Error | Look up the error code. Learn links to its company resource access troubleshooting article. |

Baseline pages add: Conflict means two settings are applied to the same device and Intune cannot sort out the conflict, so an administrator should review. For baseline profiles Succeeded means the setting matches the configured value.

## Step 1: Rule out check-in and enrollment problems

In the Microsoft Intune admin center, **Troubleshooting + support** > **Troubleshoot**, select the user and check:

- **Intune license** shows the green check.
- **Managed** shows **MDM** or **EAS/MDM**. Otherwise the device is not enrolled and receives no policies.
- **Last check in** is recent. Learn says devices check in every 8 hours by default and the value updates every 8 hours. More than 24 hours may indicate a device problem.
- To force a sync on Windows: **Settings** > **Accounts** > **Access Work or School** > select the account or MDM enrollment > **Info** > **Sync**.

Learn also tells you to check the Intune Tenant Status for active incidents.

## Step 2: Find the conflicting profile

Learn gives these paths for a baseline or endpoint security policy:

1. **Endpoint security** > **Security baselines** > select the baseline type > **Profiles** > select the profile > **Device status**.
2. Or **Devices** > **All devices** > select the device > **Device configuration** > select the policy > select a setting that shows Conflict or Error.
3. In the **Settings details** pane, read **State** and **Source Profiles**. Source Profiles lists each conflicting profile that configures the same setting with a different value.
4. Select a source profile, open **Properties** and edit its settings to remove the conflict.

For baselines created in the newer format (May 2023 or later), the dashboard offers **Device and user check-in status** with a **View report** option, a **Device assignment status** tile and a **Per setting status** tile. You must select **Generate report** the first time, because the view is empty until then. The per-setting view shows counts of Success, Error and Conflict for each setting, with no drill-in. Use the device assignment status report filtered to the status you are investigating. Learn says that if other profiles configure the same setting, they are listed as source profiles.

For baseline versions released before May 2023, Learn says it takes up to 24 hours for data to appear after the first assignment and up to six hours for later changes. Its steps for those versions: select the profile, **Monitor** > **Per-setting status**, and select the **Error** or **Conflict** column.

## Step 3: Trace the setting on the device

Learn describes the built-in MDM diagnostic report for Windows:

1. On the device, go to **Settings** > **Accounts** > **Access work or school**.
2. Select the account, then **Info** > **Advanced Diagnostic Report** > **Create report**.
3. Choose **Export** and open the file. Look for the setting in sections such as **Enrolled configuration sources and target resources** and **Unmanaged policies**.

Tips from the page: some settings list a GUID you can search for in the registry, and the Event Viewer log under **Applications and Services Logs** > **Microsoft** > **Windows** > **DeviceManagement-Enterprise-Diagnostics-Provider** > **Admin** may show error information.

## When Group Policy is involved

The ControlPolicyConflict Policy CSP page documents `MDMWinsOverGP`:

- Set to 1, any MDM policy that has an equivalent Group Policy makes the Group Policy service block setting that policy through the Group Policy console. Default is 0. Setting 0 or deleting the policy removes the blocks and restores the saved Group Policy settings.
- It applies only to policies in Policy CSP. It does not apply to equivalent settings defined in other CSPs, such as the Defender CSP.
- Learn recommends not configuring the same setting in both GPO and MDM unless it is under the control of `MDMWinsOverGP`. Otherwise there is a race condition and no guarantee which one wins.
- The policy should be set at every sync so the device removes conflicting settings, as on the first set.
- The diagnostic report lists blocked Group Policy settings because an MDM equivalent exists.
- In Windows 10 version 1803, the policy does not support the Delete command or setting 0 again after 1.
- The Policy DDF has tags such as `ADMXBacked` and `ADMXMapped` that identify policies with a Group Policy equivalent, and Learn points to a mapping list of Policy CSP policies supported by Group Policy.

For Defender settings managed by Intune, the tamper protection page says Group Policy changes to tamper-protected settings are ignored.

## Other documented limits

- Windows devices may not remove security policies when you unassign them. Learn says you may need to leave the policy assigned and change the settings back to default values.
- The Intune device configuration report shows which device configuration based policies, including baselines, apply to a device.

## What the documentation does not say

The pages read do not cover security baselines applied locally with tools outside Intune, they do not say how a specific local baseline interacts with an Intune baseline, and they do not give a list of settings outside Policy CSP that conflict. The safest reading of the page on `MDMWinsOverGP` is that overlapping settings between channels are unreliable and should be avoided. That conclusion is the author's own, not a Learn statement.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Security baselines](https://www.m365.fm/entity/security-baselines/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)

## Sources

- [Monitor security baselines deployed by Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/intune/device-security/security-baselines/monitor-baselines)
- [Troubleshoot policies and configuration profiles in Microsoft Intune (Microsoft Learn)](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-configuration/troubleshoot-policies-in-microsoft-intune)
- [ControlPolicyConflict Policy CSP (Microsoft Learn)](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-controlpolicyconflict)
- [Protect security settings with tamper protection (Microsoft Learn)](https://learn.microsoft.com/en-us/defender-endpoint/prevent-changes-to-security-settings-with-tamper-protection)
