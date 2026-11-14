---
title: "Use Threat Explorer to Investigate and Remove Malicious Email in Defender for Office 365"
summary: "How to use Threat Explorer and real-time detections in Microsoft Defender for Office 365, based on Microsoft Learn: plans, permissions, views, filters and export limits, and the Take action wizard for moving, deleting or remediating email."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [defender-for-office-365, exchange-online]
keypoints:
  - "Real-time detections are in Defender for Office 365 Plan 1 and Threat Explorer is in Plan 2. Each has its own page in the Microsoft Defender portal."
  - "The date filter reaches back up to 30 days, and you can export up to 200,000 results according to Learn."
  - "Previewing and downloading messages needs the Preview role, and these actions are logged as an AdminMailAccess audit entry."
  - "Take action offers Move or delete, Submit to Microsoft for review, Initiate automated investigation and Propose remediation, in a wizard with three steps."
  - "Running remediation needs the Search and Purge role. With 1 to 100 entries you can pick several actions, and with 101 to 200,000 only one action type."
faq:
  - q: "Which plan includes Threat Explorer?"
    a: "According to Microsoft Learn, Threat Explorer is in Defender for Office 365 Plan 2, and real-time detections are in Plan 1."
  - q: "Where do I open it?"
    a: "The Learn page gives security.microsoft.com/threatexplorerv3 for Threat Explorer and security.microsoft.com/realtimereportsv3 for real-time detections."
  - q: "Which role do I need to delete or remediate messages?"
    a: "According to Microsoft Learn, the Search and Purge role is needed for the Take action remediation options."
  - q: "How many messages can I act on at once?"
    a: "Learn says that with 1 to 100 entries you can choose multiple actions, and with 101 to 200,000 entries you can choose only one action type."
---

Threat Explorer in Microsoft Defender for Office 365 shows detected email threats and lets you act on them: move or delete messages, submit them for review, start an automated investigation, or propose remediation. Real-time detections give a similar view for Plan 1. This guide follows two Microsoft Learn pages: the one on real-time detections and Threat Explorer, and the one on threat hunting with Threat Explorer.

A note on sources: the Learn page named threat-explorer-about could not be read when this guide was written, so I used the two pages above. The real-time detections page was long, and I could read only the first 100,000 of about 142,000 characters. Sections on the Phish, Content malware, URL clicks and Campaigns detail tables, saved queries and property filter steps were not available to me.

## Plans and where to open them

- **Real-time detections** are in Defender for Office 365 Plan 1, at `security.microsoft.com/realtimereportsv3`.
- **Threat Explorer** is in Plan 2, at `security.microsoft.com/threatexplorerv3`.

## Permissions

Learn describes two permission models.

With Microsoft Defender XDR Unified RBAC, three permissions matter:

- Read headers: Security operations, Raw data (email and collaboration), Email and collaboration metadata (read).
- Preview and download: Raw data, Email and collaboration content (read).
- Remediate: Security data, Email and collaboration advanced actions (manage).

With Email and collaboration permissions in the Defender portal:

- Full access comes from the **Organization Management** or **Security Administrator** role groups. Some actions need additional roles.
- The **Preview** role is assigned by default only to **Data Investigator** or **eDiscovery Manager**. Organization Management and Security Administrators do not have it by default.
- The **Search and Purge** role is assigned by default only to **Data Investigator** or **Organization Management**.
- Read-only access comes from the **Security Reader** role group.

Microsoft Entra roles also work: Global Administrator or Security Administrator for full access, and Global Reader or Security Reader for read-only access. Learn advises least privilege and limiting Global Administrator to emergency scenarios.

Other statements on the page: a Defender for Office 365 license is required and data covers only users with those licenses. End-user spam notifications and system-generated messages are not available unless a mail flow rule overrides them. For moderated mailboxes and distribution groups, moderator actions and releases are not logged or shown.

## Views and filters

| View | Description from Learn |
|---|---|
| All email | Default for Threat Explorer. All inbound, outbound and intra-org email, malicious and non-malicious |
| Malware | Default for real-time detections. Messages that contain malware |
| Phish | Messages that contain phishing threats |
| Campaigns | Malicious email that Plan 2 identified as part of a coordinated campaign |
| Content malware | Files processed by built-in virus protection and Safe Attachments for SharePoint, OneDrive and Teams |
| URL clicks | User clicks on URLs in email, Teams messages, SharePoint files and OneDrive files |

Threat Explorer adds All email, Campaigns and URL clicks, more property filters, saved queries and the Go hunt action. Real-time detections shows detections at delivery time only, while Threat Explorer also shows post-delivery activity.

The date range defaults to yesterday and today, and you can choose dates up to 30 days back. There are no default filters. Property filters cover sender and recipient, domain, subject, delivery action, detection technology, threat type, URLs, files, and authentication results such as SPF, DKIM and DMARC. Text fields accept comma-separated values.

## Export

- **Export chart data** writes chart data to CSV.
- **Export** in the details table writes up to 200,000 results to CSV.
- Top targeted users can be exported for up to 3,000 users.

## The email details flyout

Select a Subject to open the email summary panel. At the top you find **Open email entity**, **View header**, **Take action** and **More options**. More options has **Email preview** and **Download email**, which need the Preview role, plus **View in Explorer** and **Go hunt** (Threat Explorer only). Selecting a recipient opens a flyout with a summary, recent email, recent alerts and recent activity.

Messages can be previewed or downloaded only if they are still in cloud mailboxes or quarantine. They are not available if dropped, if delivery failed, if soft-deleted to Recoverable Items, or if moved to quarantine by ZAP. Each preview or download creates an audit entry. Search the admin audit log by user for **AdminMailAccess**.

The page is inconsistent about which role a custom role group needs for preview. A footnote says Search and Purge while the permissions section says Preview, so verify in your tenant.

## Take action

Select messages in Threat Explorer and choose **Take action**. The page lists these options:

| Option | What it does |
|---|---|
| Move or delete | Move to Junk, Inbox or Deleted items, or delete as Soft deleted or Hard deleted |
| Submit to Microsoft for review | Send the message to Microsoft for analysis |
| Initiate automated investigation | Start an automated investigation |
| Propose remediation | Propose a remediation action for review |

The wizard has three steps: **Choose response actions**, **Choose target entities** and **Review and submit**.

Learn states a limit on bulk work. With 1 to 100 entries, you can choose multiple actions. With 101 to 200,000 entries, you can choose only one action type.

After you submit, track the result in the Action center. For US Government environments, the page gives `security.microsoft.com/threatincidents` for the logs.

## Suggestion: a working order for a phishing report

This section is a practical suggestion and not a Microsoft statement.

1. Filter by sender, subject or recipient and check the date range.
2. Open one entry and review its details before you act on many.
3. Check URL clicks, if the plan includes the view, to see whether users clicked a link.
4. Use Take action on a small selection first.
5. Confirm the result in the Action center.
6. For a larger set, remember the one action type rule above 100 entries.

## Not covered

The pages I read do not describe the following:

- The Threat Explorer overview page, which could not be read, and the last part of the real-time detections page.
- License prices or the exact license names for each plan.
- How long actions take to complete.
- A full list of every view in the table, which is long.

## Related

- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Real-time detections and Threat Explorer](https://learn.microsoft.com/defender-office-365/threat-explorer-real-time-detections-about)
- [Threat hunting with Threat Explorer](https://learn.microsoft.com/defender-office-365/threat-explorer-threat-hunting)
