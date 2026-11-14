---
title: "How to Manage Microsoft 365 Apps Policies With the Cloud Policy Service"
summary: "Cloud Policy enforces Microsoft 365 Apps policy settings for the signed-in user, without domain join. Roles, licenses, group rules, creating and ordering policy configurations, the 90 minute and 24 hour check-ins, and troubleshooting registry keys."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [microsoft-365-apps, intune, group-policy]
keypoints:
  - "Cloud Policy applies Microsoft 365 Apps policy settings to the signed-in user, even on devices that are not domain joined or otherwise managed."
  - "Office Apps Administrator is the recommended role. Policies apply only to user objects in Microsoft Entra ID, with nested groups up to three levels deep."
  - "Create a policy configuration under Customization, Policy Management, Create, then name, scope and settings. Priority 0 is the highest."
  - "Click-to-Run checks in every 90 minutes for users in an assigned group and every 24 hours otherwise. Policies take effect when the Office app restarts."
  - "Cloud Policy settings take precedence over Group Policy settings on Windows Server. Volume licensed Click-to-Run versions such as Office LTSC 2021 are not supported."
faq:
  - q: "What does Cloud Policy do?"
    a: "It enforces policy settings for Microsoft 365 Apps for enterprise on a user's device, even if the device is not domain joined or otherwise managed. The settings roam to the device when the user signs in. They are available for Windows, macOS, iOS and Android, though not every setting is available for every operating system."
  - q: "Which role do I need?"
    a: "The page lists Office Apps Administrator as recommended, plus Security Administrator and Global Administrator. It recommends using roles with the fewest permissions and says Global Administrator should be limited to emergency scenarios when no existing role fits."
  - q: "Where do I create a policy configuration?"
    a: "In the Microsoft 365 Apps admin center at config.office.com, or in the Microsoft Intune admin center under Apps, Policy, Policies for Office apps. Under Customization select Policy Management, then Create on the Policy configurations page."
  - q: "How long until a policy is applied?"
    a: "The page says Click-to-Run checks in regularly. For a user in a Microsoft Entra group with an assigned policy configuration the service tells it to check back in 90 minutes, otherwise in 24 hours. Policies take effect the next time the user opens an Office app, and apply only when the app is restarted."
  - q: "What if two policy configurations conflict?"
    a: "Priority decides. The highest priority is applied, with 0 as the highest value you can assign. Use Reorder priority on the Policy configurations page. The page also says Cloud Policy settings take precedence over Group Policy settings on Windows Server and over preference or locally applied policy settings."
---

Cloud Policy service for Microsoft 365 lets you enforce Microsoft 365 Apps policy settings for a user, even when the device is not domain joined or otherwise managed. This article follows the Microsoft Learn overview of the service: what you need, how to create and manage a policy configuration, how and when it is applied, and what to check when it does not work. My own advice is marked.

## What it does

When a user signs in to Microsoft 365 Apps for enterprise on a device, the policy settings roam to that device. Settings are available for Windows, macOS, iOS and Android, although not all settings exist for all systems. Some settings can also be enforced for Office for the web and Loop, for signed-in guests and for users who access documents anonymously.

## Requirements

### Roles

The page lists these built-in Microsoft Entra roles:

| Role | Note on the page |
| --- | --- |
| Office Apps Administrator | Recommended. Manages Office apps cloud services, including policy and settings |
| Security Administrator | Can read security information and reports and manage configuration in Entra ID and Office 365 |
| Global Administrator | Can manage all aspects of Entra ID and Microsoft services that use Entra identities |

The page advises roles with the fewest permissions, and says Global Administrator should be limited to emergency scenarios when you cannot use an existing role.

### Licensing

Cloud Policy supports most Microsoft 365 subscription plans that include Microsoft 365 Apps. Check your licensing documentation for specifics. Microsoft 365 operated by 21Vianet is not supported. Two notes from the page:

- A policy configuration cannot be applied to volume licensed versions of Office that use Click-to-Run, such as Office LTSC Professional Plus 2021 or Office Standard 2019.
- You can create a configuration for Microsoft 365 Apps for business, but only privacy control settings are supported.

### Versions and network

On Windows you need a supported version of Microsoft 365 Apps, a supported Windows 10 or 11, or a supported Windows Server. For GCC, GCC High and DoD customers the minimum Office client version for policy delivery on Windows is version 2402. Devices must reach the Microsoft 365 Apps admin center endpoints. For commercial and GCC the page lists login.live.com, `*.office.com`, `*.office.net`, `*.config.office.com` and `*.config.office.net`.

### Group rules

- Policies apply only to **user objects**.
- User objects must exist in Microsoft Entra ID and have a supported license.
- Nested groups work up to three levels deep.
- A group can contain device objects, but they are ignored.

## Create a policy configuration

Sign in to the Microsoft 365 Apps admin center at config.office.com, or use the Microsoft Intune admin center under **Apps** > **Policy** > **Policies for Office apps**. On first use, review the terms and select **Accept**.

1. Under **Customization**, select **Policy Management**.
2. On **Policy configurations**, select **Create**.
3. On **Start with the basics**, enter a name and optionally a description, then **Next**.
4. On **Choose the scope**, decide whether it applies to all users, specific groups, or users who access documents anonymously with Office for the web.
5. For specific groups, select **Add Groups**. You can add several groups to one configuration, and the same group can be in several configurations.
6. On **Configure Settings**, choose the policies. You can search by name or filter by platform, application, whether the policy is configured, and whether it is a recommended security baseline.
7. Select **Next**, review, and select **Create**.

## Manage existing configurations

- **Change:** open the configuration under **Policy Management**, make changes, go to **Review and publish**, and select **Update**.
- **Copy:** select a configuration and **Copy**, change what you need, then **Create**.
- **See what is configured:** in the **Policies** section, filter by the **Status** column or use the **Configured** slicer.
- **Priority:** select **Reorder priority** on the **Policy configurations** page.
- **Export:** select a configuration and **Export** to get a CSV file.

## How and when policies are applied

The Click-to-Run service checks in with Cloud Policy regularly. When an Office app starts, or the signed-in user changes, it decides whether it is time to retrieve policies.

- First sign-in of a user: the check-in call is made.
- Earlier sign-in: the call is made only after the check-in interval has passed.
- User not in a group with an assigned configuration: the service tells Click-to-Run to check back in 24 hours.
- User in a group with an assigned configuration: the service returns the settings and tells Click-to-Run to check back in 90 minutes.
- On an error, another check-in happens the next time the user opens an Office app.

Policies take effect when the Office app is restarted, like Group Policy. On Windows, policies are enforced for the primary user signed in to Microsoft 365 Apps. If several accounts are signed in, only the primary account's policies apply, and after a switch most policies apply only after a restart. Some privacy control policies apply without a restart. The page says the check-in interval is controlled by the service.

### Conflicts and precedence

If a user is in several groups with conflicting settings, the highest priority wins, and 0 is the highest. Cloud Policy settings take precedence over Group Policy on Windows Server, and over preference or local policy settings.

## Baselines and auditing

The policy table has a **Recommendation** column that flags security baseline policies, and you can filter on it. There is also an accessibility baseline. With Microsoft Purview auditing enabled, creating, deleting or changing policy configurations, changing settings and reordering priority are recorded and can be searched in the audit log.

## Limits

- Only user-based settings are available, not computer-based ones.
- New user-based settings are added automatically, so you do not need updated ADMX and ADML files.
- Configurations can also cover supported desktop apps from Project and Visio subscription plans.
- The health status feature was retired in the second half of March 2022. The page says advanced health reporting is planned, with no known date.

## Troubleshooting from the page

1. Make sure the user is signed in to Microsoft 365 Apps for enterprise, has activated it and has a valid license.
2. Make sure the user is in the right security group.
3. Check that no authenticated proxy is in the way. Click-to-Run runs under the system context. If it cannot reach the proxy with the system account, it retries impersonating the signed-in Windows user.
4. Check the priority of the configurations if the user is in several groups.
5. Be aware that policies might not apply correctly if two users with different policies sign in to Office on the same device in the same Windows session.
6. Policies are stored in `HKEY_CURRENT_USER\Software\Policies\Microsoft\Cloud\Office\16.0`, overwritten at each check-in.
7. Check-in activity is in `HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Common\CloudPolicy`. Deleting that key and restarting Office apps triggers a check-in at the next launch. The `FetchInterval` value there, in minutes, shows the next scheduled check, for example 1440 for 24 hours. A value of 0 means the client waits 24 hours from the last check-in.

## Rollout advice (my advice)

This is my suggestion, not guidance from the page:

1. Test a new configuration with a small pilot group first, and plan for the 90 minute check-in plus an app restart before you judge the result.
2. Name configurations after their purpose and group, so priority conflicts are easy to read later.
3. Keep priority gaps in mind. Write down why one configuration ranks above another.
4. If you still use Group Policy for the same settings, decide which one owns each setting. The page says Cloud Policy wins, so a leftover Group Policy value will not show.
5. Before you promise a setting to a team, check that it exists for their platform. Not every setting is available on every operating system.

## Related

- [Microsoft 365 Apps](https://www.m365.fm/entity/microsoft-365-apps/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)

## Sources

- [Overview of Cloud Policy service for Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/microsoft-365-apps/admin-center/overview-cloud-policy)
