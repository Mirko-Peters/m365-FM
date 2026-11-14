---
title: "Audit Insider Risk Management Policies for Departing User Data Theft in Purview"
summary: "A review routine for Purview Insider Risk Management policies that watch departing users: prerequisites, triggering events, indicators, policy health messages and manual scoring, as Microsoft documents them."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [insider-risk-management, purview]
keypoints:
  - "The Data theft by departing users template scores activity near resignation and end dates. It starts scoring from the Microsoft HR connector or from a Microsoft Entra account deletion trigger."
  - "Without a triggering event a user is not evaluated. Policy indicators only score after a trigger occurs, and all global indicators are disabled by default."
  - "The Status column on the Policies tab shows Healthy, Recommendations or Warnings. A stale HR connector (over 7 days) is a listed warning."
  - "Manual scoring can start scoring for chosen users for 5 to 30 days, up to 4,000 users, as a stopgap when no trigger exists."
  - "Microsoft's pages do not define a time window for the departing-user template and do not list audit log settings beyond turning audit on."
faq:
  - q: "What does the Data theft by departing users template detect?"
    a: "Microsoft Learn says it detects potential data theft around employee departure, using exfiltration indicators for risk scoring. Activities include downloading files from SharePoint Online, printing and copying data to personal cloud messaging and storage services, near resignation and end dates."
  - q: "How does a user enter scoring in a departing-user policy?"
    a: "Through a triggering event. Learn names the Microsoft HR connector, which imports resignation and termination dates, or the option User account deleted from Microsoft Entra. Without a HR connector, select the Entra option when you configure trigger events."
  - q: "Why does my policy produce no alerts?"
    a: "The policy health table lists causes such as no indicators selected, no triggering event, no users or groups, a HR connector not working or stale for more than 7 days, no devices onboarded and, for Defender-based policies, missing alert sharing. After a first policy, alerts typically start appearing after about 24 hours."
  - q: "Do I need to turn on auditing?"
    a: "Learn lists the Microsoft 365 audit log as a required step. It is on by default, and if it was turned off, confirm with the administrator who disabled it before re-enabling. Log preparation takes a few hours."
  - q: "Can I see what an indicator threshold means?"
    a: "Learn gives SharePoint as an example: 1 to 9 daily events have minimal impact and usually no alert, 10 to 19 give low severity, 20 to 29 medium severity and 30 or more high severity. The page presents this as an example, so check your own thresholds in the policy."
---

To audit a departing-user policy, check four layers in order: prerequisites (audit log, roles, HR connector), the triggering event, the indicators and thresholds, and the policy health status. If a layer is missing, the policy can look fine and still never score a leaver. Microsoft's pages describe each layer, but they do not define a time window for the template, so confirm the window in your own policy.

## What the template does

**Data theft by departing users** targets exfiltration near employment end. Learn lists downloads from SharePoint Online, printing and copying to personal cloud messaging and storage services, with cloud indicators for Box, Dropbox, Google Drive, Amazon S3 and Azure. It focuses on detection and alerts, and it correlates with employment status. There is also a **Security policy violations by departing users** template for security-related activity.

## Layer 1: Prerequisites

- **Permissions**: users need the right role group, such as **Insider Risk Management** or **Insider Risk Management Admins**. Microsoft recommends the roles with the fewest permissions.
- **Audit log**: required. It is on by default.
- **Licensing**: confirm a supported Microsoft 365 subscription. Some indicators need pay-as-you-go billing.
- **HR connector**: the Microsoft 365 HR connector is required for the departing user templates. It imports resignation and termination dates.

Setup order from Learn: assign permissions, enable the audit log, optionally run analytics (**Run scan** on the Overview tab, results up to 48 hours), configure prerequisites, configure **Insider risk settings**, then create the policy under **Policies** > **Create policy**.

## Layer 2: Triggering events

A user is not evaluated unless a trigger occurs. For the departing-user template, the trigger is a HR connector date or **User account deleted from Microsoft Entra**. If you do not use the HR connector, select the Entra option in the policy workflow.

Audit questions:

1. Is the HR connector running and sending data? Learn flags a connector that is not working or stale for more than 7 days as a health issue.
2. Does the trigger repeat for more than 15 percent of users? Learn lists that as a health issue to tune.
3. Are leavers actually in scope of the policy's users or groups?

## Layer 3: Indicators and thresholds

All global indicators are disabled by default, and you must select at least one to configure a policy. Go to **Settings** > **Policy indicators** and enable the ones that match your risk, for example Office indicators for SharePoint, Teams and email, cloud storage indicators and device indicators. Cloud storage, cloud service and some other indicators require pay-as-you-go billing and connected apps in Microsoft Defender. Device indicators need Windows 10 build 1809 or later, or macOS.

Thresholds control how daily event counts affect score and severity. Learn's SharePoint example: 1 to 9 events minimal, 10 to 19 low severity, 20 to 29 medium, 30 or more high. The option **Activity is above user's usual activity for the day** adds an anomaly-based trigger. **Cumulative exfiltration detection** compares the last 30 days with organization or peer-group norms.

Priority content (supported by this template) narrows scoring to chosen SharePoint sites, sensitive information types, sensitivity labels, up to 50 file extensions or up to 5 trainable classifiers. Cumulative exfiltration activity is always scored.

## Layer 4: Policy health

On the **Policies** tab, the **Status** column shows **Healthy**, **Recommendations** or **Warnings**. Open the policy and read **Notifications**. Learn's table includes these fixes:

| Issue | Fix |
|---|---|
| No indicators selected | Edit the policy and select indicators |
| No triggering event | Edit the policy and select one |
| No users or groups | Add users or groups |
| HR connector not working or stale over 7 days | Fix the connector or use the Entra account deletion trigger |
| No devices onboarded | Confirm device onboarding |
| No alerts generated | Review indicators, thresholds, users and groups |
| Nearing the user limit for a template | Remove users no longer needing scoring |

Viewing policy health needs the Insider Risk Management or Insider Risk Management Admins role. The policy dashboard also shows alert effectiveness: confirmed alerts divided by confirmed plus dismissed actions over the past year.

## Cover gaps with manual scoring

If you learn about a departure before data reaches the connector, use **Policies** > select policies > **Start scoring activity for users**. Enter a reason and a duration of 5 to 30 days, add users by UPN or CSV (up to 4,000), and expect the previous 90 days of activity to take up to 24 hours to appear.

## Housekeeping

Editing a policy locks the template and name. You can copy a policy and edit the copy. Deleting can take up to 72 hours and cannot be undone, and cases are never deleted. Each template supports up to 100 policies, and user limits count unique scored users across policies using the same template.

## What the pages do not say

No page I read defines the time window the departing-user template uses. Policy windows are described only as the time frame for alert activities and the duration of the policy once activated, without values. The permissions page for audit and role details is separate, so check it for audit log retention. Any statement about an exact number of days before departure should be verified in your tenant.

## Related

- [Insider Risk Management](https://www.m365.fm/entity/insider-risk-management/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Insider Risk Management policy templates](https://learn.microsoft.com/en-us/purview/insider-risk-management-policy-templates)
- [Create and manage Insider Risk Management policies](https://learn.microsoft.com/en-us/purview/insider-risk-management-policies)
- [Get started with Insider Risk Management](https://learn.microsoft.com/en-us/purview/insider-risk-management-configure)
- [Insider Risk Management policy indicators](https://learn.microsoft.com/en-us/purview/insider-risk-management-settings-policy-indicators)
