---
title: "Getting alerts when SharePoint permissions change: options and limits"
summary: "Alert on SharePoint permission changes with Microsoft's alert policies on audit events. See which events to pick, which delays apply and where the options stop."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [audit-logs, sharepoint-permissions, power-automate, sharepoint-essentials-toolkit]
keypoints:
  - "The native way to get alerts on permission changes is an alert policy in the Microsoft Defender portal that watches audit events such as a site collection admin being added."
  - "Classic SharePoint alerts and list rules react to item changes, and the SharePoint connector in Power Automate has no trigger for permission or sharing changes."
  - "Alert policies need the Manage Alerts role, can take up to 24 hours to start working after you create or update them, and aggregate events into one alert."
  - "Threshold and unusual-activity alerts need an E5 license or an add-on, while E1 and E3 organizations can alert every time an activity occurs."
  - "Start with a few high-risk sites and a small set of events, then tune the policy, because adding users to groups also happens as a side effect of normal sharing."
faq:
  - q: "Can SharePoint alert me when permissions change?"
    a: "Not with classic SharePoint alerts, which are being retired. Microsoft's alert policies in the Defender portal can notify you about audit events, such as a site collection admin being added or a sharing event. You choose the activity, conditions, recipients and severity."
  - q: "Which role do I need to create an alert policy?"
    a: "Microsoft states that you must be assigned the Manage Alerts role or the Organization Configuration role to create alert policies. The View-Only Manage Alerts role is enough to view them in the Microsoft Defender portal. After you create or update a policy, it can take up to 24 hours before alerts are triggered."
  - q: "Does Power Automate have a trigger for permission changes?"
    a: "The SharePoint connector lists triggers for items, files, forms and hub site requests, but none for permission, sharing or access changes. It offers actions such as granting access or stopping sharing, which do not detect changes. One design uses an alert policy email as the trigger for a flow, but Microsoft does not document it as a feature."
---

To alert on SharePoint permission changes, create an alert policy in the Microsoft Defender portal that watches the audit events for site permissions and sharing, send the alert to a shared mailbox, and tune it on a few high-risk sites first. Classic SharePoint alerts are retired, and the Microsoft pages I read list no rule condition and no Power Automate trigger for permission changes. This guide is for the security admin who needs a notice when someone becomes a site collection admin or opens a site to everyone, and it shows what each option can and cannot do.

## Alert on SharePoint permission changes: what Microsoft offers

Three families of options exist, and only one of them watches permissions.

- **Alert policies.** Microsoft's article on [alert policies](https://learn.microsoft.com/purview/alert-policies) says you can create policies and view the alerts that are generated when users perform activities that match the policy conditions. The activities include sharing a file externally, assigning access permissions and creating an anonymous link.
- **SharePoint alerts and rules.** The classic SharePoint alerts feature, known as Alert me, is being retired in SharePoint Online. Microsoft's page on the [SharePoint Alerts retirement](https://support.microsoft.com/sharepoint/admin/sharepoint-alerts-retirement) states that from July 2026 existing alerts can't be extended anymore and won't work anymore. It points to Power Automate and SharePoint Rules as replacements, and its template examples cover list item and file updates. Rules react to an item being modified, a column value or an approaching date, as the Microsoft support page on rules describes. That page does not say whether permission changes can trigger a rule.
- **Power Automate.** The [SharePoint connector](https://learn.microsoft.com/sharepoint/dev/business-apps/power-automate/sharepoint-connector-actions-triggers) lists triggers for items, files, forms and hub site join requests. It lists no trigger for permission, sharing or access changes. Actions such as granting access or stopping sharing exist, but they change permissions instead of detecting changes.

The result: the audit trail is the source of truth for permission changes, and alert policies are the native way to be notified about it. [Audit logs](https://www.m365.fm/entity/audit-logs/) record the event, and the alert policy turns the event into an email.

## SharePoint Rules and Power Automate after the retirement

Many admins first look for a notification feature on the list or library. Microsoft's retirement page gives this timeline: new alerts were turned off for newly onboarding tenants from July 2025, alerts started expiring 30 days after their first run in October 2025, creating new alerts was turned off for all tenants from January 2026, and in July 2026 existing alerts stopped working. The page does not say that alerts are migrated automatically. It recommends Power Automate first and SharePoint Rules second.

Rules have clear limits for this use case. Microsoft's article on rules says that a rule starts with a condition such as an item being modified or a column value changing, and that a date-approaches condition is limited to two per list or library. Notifications are emails to a person, several people or a people column, but not to a group email address, and you need Contribute permission on the list to manage rules. Rules watch list items, not the permission settings of a site, which is why the audit-based alert policy below is the better fit.

## Which audit events to watch

Microsoft's list of [audit log activities](https://learn.microsoft.com/purview/audit-log-activities) names the site permission events. These are the ones worth considering:

- **SiteCollectionAdminAdded:** a site collection administrator or owner adds a person as a site collection administrator. Microsoft notes that this site admin has full control of the site collection and all subsites.
- **AddedToGroup and RemovedFromGroup:** a member or guest is added to or removed from a SharePoint group. Microsoft notes that this can be intentional or the result of another activity, such as a sharing or unsharing event.
- **PermissionLevelAdded:** a permission level was added to a site collection.
- **PermissionLevelsInheritanceBroken and SharingInheritanceBroken:** an item no longer inherits permission levels or sharing permissions from its parent.
- **GroupAdded:** a group is created for a site, sometimes as a side effect of a sharing link.

For sharing, Microsoft's page on sharing auditing names SharingSet, SharingInvitationCreated, AnonymousLinkCreated, SecureLinkCreated and AddedToSecureLink. Microsoft also marks the older SitePermissionsModified operation as deprecated, so do not build a new policy around it.

One caveat: Microsoft's alert policy page does not list the selectable activities. It says only that the activities you can track depend on your plan. The default policy that the page lists in the Permissions category covers Exchange admin privilege, not SharePoint. So SharePoint permission events need a custom policy, and you should open the form and check the activity list before you plan the whole design.

## Build the alert policy

Microsoft's page describes the setup in the Defender portal: under Email and collaboration, select Policies and rules, then Alert policy. The settings are:

1. **Activity.** Pick the event, for example a site collection admin being added.
2. **Conditions.** Limit the policy to specific users, IP addresses, file names or URLs. A site URL is the practical way to focus on your sensitive sites.
3. **Trigger.** Choose every time the activity occurs, when a threshold is exceeded, or when the activity is unusual.
4. **Category and severity.** Use the Permissions category if it fits, and a severity of Low, Medium, High or Informational.
5. **Recipients.** Send email to a list of users, and set a daily notification limit.

You can also configure the default alert policies. Microsoft states that you can turn them off or on again, set a list of recipients for the email notifications and set a daily notification limit. Check them first, because one default policy in the Information governance category alerts when an unusually large number of files in SharePoint or OneDrive are shared with users outside of your organization. Microsoft notes that this policy is in the process of being deprecated because of false positives, so do not rely on it alone.

Licensing and roles decide what you can build. Microsoft states that you need the Manage Alerts role or the Organization Configuration role to create policies. Threshold and unusual-activity triggers require an E5 subscription or an add-on such as Microsoft Defender for Office 365 Plan 2 or Microsoft 365 E5 Compliance. Organizations with E1 or E3 can only create policies where an alert is triggered every time that an activity occurs. Unusual-activity policies need up to seven days to establish a baseline, and no alerts are generated meanwhile.

## What the alert does not tell you

An alert says that an event happened, not that it was wrong. Plan for these limits:

- **Delay.** It takes up to 24 hours after you create or update a policy before alerts can be triggered. The alert itself also follows the audit record, which is typically available 60 to 90 minutes after an event for core services.
- **Aggregation.** Events that match a policy within a short time are added to an existing alert. The aggregation interval is 1 minute with E5 and related add-ons, and 15 minutes for E1 and E3.
- **Noise.** Adding a person to a SharePoint group is often a side effect of normal sharing, so an alert on every group change can bury the important events.
- **No decision.** The alert does not know whether the change was approved. Someone must check the change against the request.

Before you switch alerts on, review the [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) of the watched sites, so the alerts start from a clean baseline. Keep a record of each alert and its outcome. After a month, the record shows which events deserve a High severity and which can be dropped.

## Search the audit log when an alert fires

An alert is only a pointer. To see the detail, search the audit log in the Microsoft Purview portal. According to Microsoft's page on [searching the audit log](https://learn.microsoft.com/purview/audit-search), you need the Audit Logs or View-Only Audit Logs role. You can search by activity, by user and by file, folder or site, with a wildcard at the end of a site URL. The last seven days are selected by default and the maximum range is 180 days. Records for core services such as SharePoint are typically available 60 to 90 minutes after an event, and a broad search in a large tenant can take up to 48 hours. You can export the results to CSV. For retention, Microsoft states 180 days for non-E5 licenses and one year for SharePoint activity with E5 by default, so keep your own record of alerts that matter.

## Connect alerts to a flow

If email is not enough, a flow can route the alert. Cloud flows in [Power Automate](https://www.m365.fm/entity/power-automate/) react to triggers such as a new email, so a flow can start when the alert policy email arrives in a shared mailbox and then post a message to a Teams channel or create a task for the site owner. This is a design pattern, not a documented Microsoft feature for permission alerts, so test it. Keep the flow simple: parse the subject, add the site URL to the message, and name the person who handles the case.

## Example: 84 alerts in two weeks

This example uses invented numbers. A security admin on E3 licenses creates alert policies for 12 sensitive sites with three activities: AddedToGroup, AnonymousLinkCreated and SiteCollectionAdminAdded. All three trigger every time, because E3 allows no threshold.

- **AddedToGroup:** 60 alerts in two weeks, mostly from normal sharing.
- **AnonymousLinkCreated:** 18 alerts.
- **SiteCollectionAdminAdded:** 6 alerts.

The total is 60 + 18 + 6 = 84 alerts. The admin finds that 60 of the 84, which is about 71 percent, come from one noisy activity. Only 6 of the 60 AddedToGroup alerts came from the 3 most sensitive sites, so the admin keeps that activity on those 3 sites and leaves the other two policies on all 12. The next two weeks bring 6 + 18 + 6 = 30 alerts instead of 84, which is about 64 percent fewer, and every alert gets a named reviewer.

## Common mistakes

- **Expecting classic alerts to work.** Alert me is retired, so do not build a permission monitoring plan on it.
- **Alerting on everything at once.** Start with a few sites and events, and tune after two weeks.
- **Forgetting the delay.** A new policy can need up to 24 hours before it triggers, so test early.
- **Missing the license limits.** E1 and E3 organizations cannot use thresholds or unusual-activity triggers.
- **Sending alerts to one person.** Use a shared mailbox and name a backup reviewer.

## How software can help

Microsoft's alert policies cover the audit events, and they need tuning and a person who reads them. Some teams add a tool for monitoring. One example is Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/). According to the vendor's product page, it provides a monitor for permission changes, e-mail notifications, a governance dashboard, and permission reports for sites, folders and items. These are the vendor's statements, and M365.FM has not tested them. Compare any tool with the alert policies you already have, and check which events it can see.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Pick your three most sensitive sites and create one alert policy for site collection admins being added. Then you have a first way to alert on SharePoint permission changes, and you can read the results after two weeks before you add more events.
