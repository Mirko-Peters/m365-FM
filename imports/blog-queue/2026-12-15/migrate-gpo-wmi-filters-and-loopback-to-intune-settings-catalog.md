---
title: "Migrate GPO WMI Filters and Loopback Processing to Intune Settings Catalog"
summary: "What replaces WMI filters and loopback processing when you move Group Policy to Intune: assignment filters, scope and assignment rules in the settings catalog, and what Microsoft Learn does not say about direct conversion."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [intune, group-policy, hybrid-entra-join]
keypoints:
  - "Group Policy analytics reads GPO XML but the Learn pages I read do not mention WMI filters or loopback, so plan these two by hand."
  - "Assignment filters are the closest Intune tool to a WMI filter. They use device properties such as model, manufacturer, OS version and SKU."
  - "A user-scope settings catalog setting assigned to a device group applies to all users on the device, similar to loopback in merge mode."
  - "Loopback Replace mode has no documented one-click match. Rebuild it as device-scoped settings or a separate profile."
  - "Test on a pilot group and check conflicts under Devices > Monitor > Assignment failures."
faq:
  - q: "Does Group Policy analytics detect WMI filters?"
    a: "The Microsoft Learn pages on importing and migrating GPOs do not mention WMI filters, security filtering or loopback. The analysis reports settings, MDM support, scope and CSP mappings, so check targeting logic yourself in the Group Policy Management Console."
  - q: "What replaces a WMI filter in Intune?"
    a: "Assignment filters. Learn describes them as reusable rules you add to an assignment in Include or Exclude mode. They evaluate device properties such as manufacturer, model, operating system version and SKU. They are not a general WMI query engine."
  - q: "What is the Intune equivalent of loopback processing?"
    a: "The settings catalog page says that a user-scope setting assigned to a device group is applied to all users on that device, which Learn compares to loopback processing set to merge. A documented match for Replace mode is not given."
  - q: "Which wins if a setting is assigned in both user and device scope?"
    a: "Learn says that if a setting is available in both scopes and you assign it to both, user scope takes precedence over device scope."
  - q: "Can I migrate AppLocker and firewall rules with the settings catalog migration?"
    a: "No. The Migrate option is disabled for AppLocker and Firewall rule settings. Learn says to configure them in Endpoint Security instead."
---

WMI filters and loopback processing are the two pieces of Group Policy targeting that do not move over as a simple setting. The Intune answer is a different design: assignment filters for the device condition, and assignment scope for the user-versus-device question. Microsoft Learn describes both pieces, but it does not describe a direct conversion from a WMI filter or from loopback. That gap is stated openly below.

## Start with the inventory

Group Policy analytics gives you the setting-level view. In the Group Policy Management Console, right-click a GPO, select **Save report** and save as XML. In the Intune admin center go to **Devices** > **Manage devices** > **Group Policy analytics** > **Import**. Each file must be 4 MB or less.

The report shows MDM support per GPO, whether the GPO is targeted in AD, and for each setting its value, scope (user or device), minimum OS version and CSP name. The Reports view classifies settings as Ready for migration, Not supported or Deprecated.

What the pages do not cover: WMI filters, security filtering, loopback and item-level targeting. Note these by hand for every GPO you plan to move. Also, Learn lists a known issue: only non-ADMX settings in English are supported, so non-English GPOs can give inaccurate MDM support percentages.

## How WMI filters work today

Per the Windows Server documentation, a WMI filter uses a WMI query. The GPO applies only if the filter evaluates to true on the destination computer during processing. Each GPO links to one WMI filter, but one filter can serve many GPOs.

## Replace WMI filters with assignment filters

Assignment filters decide whether a policy applies to a device. Create one under **Tenant administration** > **Assignment filters** > **Create**, or under **Devices** > **Organize devices** > **Assignment filters**. Pick the platform, build the rule and use **Preview devices**.

Windows properties listed on Learn include:

- `manufacturer` and `model`
- `operatingSystemVersion`, with comparison operators (`osVersion` is deprecated)
- `operatingSystemSKU`
- `deviceOwnership`, `deviceTrustType` and `deviceName`
- `enrollmentProfileName`, which matches the Windows Autopilot profile
- `cpuArchitecture`, though enrollment scenarios do not support it yet

Example from Learn: `(device.operatingSystemVersion -gt 10.0.22000.1000)`.

When you assign the policy, select **Edit filter** and choose **Include filtered devices** or **Exclude filtered devices**. Limits: up to 200 filters per tenant, 3,072 characters per rule, and a filter cannot be deleted while assignments use it.

Be realistic about coverage. A WMI query can ask almost anything about a machine. Assignment filters only see the listed properties. If your WMI filter checks something outside that list, such as installed hardware details or a registry-derived state, the pages I read give no equivalent. Options that remain are a dynamic group where the attribute exists, or a different design.

## Replace loopback with scope and assignment

Loopback processing applies the computer's user-configuration GPO settings to whoever signs in. In Merge mode the computer's GPO list is appended to the user's list, so computer GPOs win on conflict. In Replace mode only the computer's list is used. It is meant for kiosks, labs, classrooms and similar machines.

In the settings catalog, scope and assignment target are separate. Learn's table:

| Setting scope | Assigned to | Result |
|---|---|---|
| User | Device group | All users on the device get the setting |
| User | User group | Only that user gets it |
| Device | Device group | All users on the device |

Learn compares the first row to loopback in merge mode. The practical pattern for shared devices is a profile with the user-scope settings you need, assigned to a device group.

Points to watch:

- User-scope policy writes to HKCU, device-scope to HKLM.
- Early in device activity, before a user hive exists, some user-scope settings show as not applicable.
- If a setting exists in both scopes and you assign both, user scope wins.

For Replace mode, Learn gives no matching switch. A safe reading is to keep the shared-device settings in a device-assigned profile and avoid also assigning conflicting user-targeted profiles to the same people. Test this, because the pages do not promise Replace semantics.

## Build the profiles

1. Go to **Devices** > **Manage devices** > **Group Policy analytics**, select the GPOs and choose **Migrate**.
2. On **Settings to migrate**, tick only settings you reviewed. Learn says not to include all settings without review.
3. Resolve conflicts by selecting one value when two GPOs disagree.
4. Name the profile, add scope tags and assign it, with a filter where you replaced a WMI filter.

Migration is best effort. AppLocker and Firewall rule settings cannot be migrated this way and belong in Endpoint Security. Some older Office and Chrome settings map to newer ones.

## Check results

Open the profile under **Devices** > **Manage devices** > **Configuration** to see per-setting counts for applied, conflict and error. **Devices** > **Monitor** > **Assignment failures** lists conflicts. Pilot on a small group before widening.

## Remember how precedence changes

In Group Policy, processing runs local, site, domain and then OU GPOs, later policies override earlier ones, and computer settings override user settings. Link order, enforced links and block inheritance change the result. Intune has no link hierarchy. Two settings catalog profiles that set the same setting to different values create a conflict instead of one overriding the other, and the only user-versus-device tie-breaker Learn gives is that user scope wins when both are assigned.

That is why the migration step asks you to pick one value when GPOs disagree. Before you assign anything, list every setting that two GPOs set differently, decide the winner, and migrate only that one.

## Related

- [Intune](https://www.m365.fm/entity/intune/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)
- [Hybrid Entra join](https://www.m365.fm/entity/hybrid-entra-join/)

## Sources

- [Migrate Group Policy to the settings catalog](https://learn.microsoft.com/en-us/intune/device-configuration/migrate-group-policy)
- [Analyze GPOs with Group Policy analytics](https://learn.microsoft.com/en-us/intune/device-configuration/import-group-policy-analytics)
- [Use the settings catalog](https://learn.microsoft.com/en-us/intune/device-configuration/settings-catalog)
- [Assignment filters in Intune](https://learn.microsoft.com/en-us/intune/intune-service/fundamentals/filters)
- [Windows device properties for filters](https://learn.microsoft.com/en-us/intune/intune-service/fundamentals/filters-device-properties)
- [Loopback processing of Group Policy](https://learn.microsoft.com/en-us/troubleshoot/windows-server/group-policy/loopback-processing-of-group-policy)
- [Group Policy processing for Windows](https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/group-policy/group-policy-processing)
