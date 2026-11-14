---
title: "How to Set Up Windows Autopilot Device Preparation for User-Driven Entra Join"
summary: "Set up Windows Autopilot device preparation for user-driven Microsoft Entra join: the seven steps, assigned device group with the Intune Provisioning Client owner, policy settings, app and script limits, deployment flow and caveats."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [windows-autopilot-device-preparation, intune]
keypoints:
  - "The tutorial applies to Windows 11. Steps 1 to 6 are required: automatic Intune enrollment, user join setting, device group, user group, apps and scripts, and the policy."
  - "The device group must be an assigned security group with the service principal Intune Provisioning Client (AppId f1346770-5b25-470b-88bd-d5744ab7952c) as owner. Dynamic groups are not used."
  - "A policy selects up to 25 apps and up to 10 PowerShell scripts. A failure in a selected app or script fails the deployment."
  - "The policy is assigned to the user group, and the device group is chosen on the Device group page of the wizard."
  - "OOBE customization and device naming work only for devices associated with your tenant. Use corporate identifiers or device association, not both."
faq:
  - q: "What are the required steps?"
    a: "Per Microsoft Learn: set up Windows automatic Intune enrollment, allow users to join devices to Microsoft Entra ID, create an assigned device group, create a user group, assign applications and PowerShell scripts to the device group, and create the device preparation policy. Step 7, for corporate identifiers or device association, is optional."
  - q: "Who must own the device group?"
    a: "The service principal Intune Provisioning Client with AppId f1346770-5b25-470b-88bd-d5744ab7952c. In some tenants it appears as Intune Autopilot ConfidentialClient. The group must be an assigned security group."
  - q: "How many apps and scripts can the policy include?"
    a: "Up to 25 essential apps and up to 10 essential PowerShell scripts. Learn does not say whether the limits are per policy or per device."
  - q: "What happens if an app fails?"
    a: "For LOB, Microsoft 365, Win32, Store and Enterprise App Catalog apps selected in the policy, a failure fails the deployment. The same applies to selected PowerShell scripts. MDM policy application is not tracked and does not fail it."
  - q: "What if the device is registered in Autopilot?"
    a: "If a device is registered as an Autopilot device but not associated with your tenant, the Windows Autopilot deployment runs instead. If it is associated, device preparation runs."
---

Autopilot device preparation for user-driven Microsoft Entra join takes seven steps, six of them required. You set up automatic enrollment and user join rights, create an assigned device group owned by the Intune Provisioning Client, create a user group, assign apps and scripts, and create the policy. This guide follows the Microsoft Learn tutorial overview and its pages on the device group, the join setting and the policy. It applies to Windows 11.

## The seven steps

| Step | Task | Required |
| --- | --- | --- |
| 1 | Set up Windows automatic Intune enrollment | Yes |
| 2 | Allow users to join devices to Microsoft Entra ID | Yes |
| 3 | Create an assigned device group | Yes |
| 4 | Create a user group | Yes |
| 5 | Assign applications and PowerShell scripts to the device group | Yes |
| 6 | Create the device preparation policy | Yes |
| 7 | Add corporate identifiers or associate devices | Only if Intune enrollment restrictions block personal devices |

## Step 2: allow users to join

The Learn page uses the Azure portal. Go to **Microsoft Entra ID** > **Devices** > **Device Settings**. Under **Users may join devices to Microsoft Entra**, select **All** or **Selected**. For Selected, add the users or groups under **Members allowed to join devices**. Any group must be a Microsoft Entra group with user objects. Select **Save**. If users may already join devices, skip the step. Learn does not name a required role.

## Step 3: the device group

In the Intune admin center, select **Groups** > **New group** and enter:

- **Group type:** Security
- **Group name:** for example Windows Autopilot device preparation device group
- **Microsoft Entra roles can be assigned to the group:** No
- **Membership type:** Assigned
- **Owners:** the service principal **Intune Provisioning Client**

The AppId is `f1346770-5b25-470b-88bd-d5744ab7952c`. In some tenants the principal appears as **Intune Autopilot ConfidentialClient**, so identify it by AppId. If it is not listed, Learn gives a PowerShell procedure with `New-MgServicePrincipal -AppID f1346770-5b25-470b-88bd-d5744ab7952c` after `Connect-MgGraph -Scopes "Application.ReadWrite.All"`. A 409 Conflict means it already exists, and a 403 Forbidden means missing permission or consent.

Learn also says:

- Only assigned groups are supported. Dynamic groups are not used.
- Devices are added to the group automatically during deployment.
- Use a group dedicated to device preparation and, ideally, one group per policy.

## Step 6: the policy

Path: Intune admin center > **Devices** > **By platform: Windows** > **Windows devices** > **Device onboarding: Enrollment** > **Windows enrollment** > **Windows Autopilot device preparation: Device preparation policies** > **Create** > **User Driven**.

1. **Basics:** name and optional description.
2. **Device group:** pick the device group from step 3, not the user group.
3. **Configuration settings** (below).
4. **Scope tags:** optional.
5. **Assignments:** pick the user group from step 4, not the device group.
6. **Review + create:** save.

### Configuration settings

- **Deployment mode:** User-driven. **Deployment type:** Single user. **Join type:** Microsoft Entra joined.
- **User account type:** Standard User or Administrator. By default users are added to the Administrators group. With Standard User, the deployment removes the user from that group before it completes.
- **Minutes allowed before showing installation error:** 15 to 720, for the whole deployment.
- **Custom error message**, **Allow users to skip setup after multiple attempts** (adds Continue anyway) and **Show link to diagnostics**.
- **Apps:** up to 25, assigned to the device group and installed in the System context. Types are LOB, Win32, Microsoft Store (WinGet-supported apps only), Microsoft 365 and Enterprise App Catalog.
- **Scripts:** up to 10 PowerShell scripts, assigned to the device group and run in the System context by setting **Run this script using the logged on credentials** to **No**.

**Settings for associated devices only:** language and region, automatic keyboard, hiding the license terms, hiding privacy settings, hiding change-account options (needs company branding in Entra ID), and a device name template with a prefix plus `%RAND:4%` or `%SERIAL%`, up to 63 characters.

## The deployment flow

1. The user signs in with Entra credentials during OOBE and the policy for that user is delivered.
2. The device joins Entra ID and enrolls in Intune.
3. The Intune management extension installs.
4. The user is added to the local Administrators group, or removed from it for a standard user.
5. The device syncs. Policy application is not tracked.
6. LOB and Microsoft 365 apps install. A failure fails the deployment.
7. Selected PowerShell scripts run. A failure fails the deployment.
8. Win32, Store and Enterprise App Catalog apps selected in the policy install. A failure fails the deployment.
9. On success, the **Required setup complete** page appears and the desktop opens.
10. A final sync delivers remaining apps, scripts, policies and user configuration.

## Caveats

- Apps and scripts that are only assigned to the group, and not selected in the policy, install after the desktop appears.
- If multiple policies apply, the highest priority policy (smallest number) wins. A device-based assignment beats a user-based one.
- Use either corporate identifiers or device association, not both.
- The tutorial suits labs and tests but can be used in production.

## What the pages do not say

Licensing, minimum Windows 11 build, network endpoints, the number of attempts behind the skip option, default values for toggles, and the roles needed for the Intune portal steps.

## Typical mistakes

- Selecting the user group on the Device group page, or the device group in assignments.
- Using a dynamic device group.
- Selecting more apps than the limit.
- Expecting device naming to work on devices that are not associated.

## Related

- [Windows Autopilot device preparation](https://www.m365.fm/entity/windows-autopilot-device-preparation/)
- [Windows Autopilot](https://www.m365.fm/entity/windows-autopilot/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Overview: user-driven Microsoft Entra join (Microsoft Learn)](https://learn.microsoft.com/autopilot/device-preparation/tutorial/user-driven/entra-join-workflow)
- [Step 2: allow users to join devices (Microsoft Learn)](https://learn.microsoft.com/autopilot/device-preparation/tutorial/user-driven/entra-join-allow-users-to-join)
- [Step 3: create an assigned device group (Microsoft Learn)](https://learn.microsoft.com/autopilot/device-preparation/tutorial/user-driven/entra-join-device-group)
- [Step 6: create the device preparation policy (Microsoft Learn)](https://learn.microsoft.com/autopilot/device-preparation/tutorial/user-driven/entra-join-autopilot-policy)
