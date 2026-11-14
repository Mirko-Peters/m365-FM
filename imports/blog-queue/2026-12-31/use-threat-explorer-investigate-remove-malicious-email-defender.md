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
  - "In Plan 2, Take action offers Move or delete, Submit to Microsoft for review, Initiate automated investigation and Propose remediation, in a three-page wizard."
  - "Move or delete needs the Search and Purge role. With up to 100 entries you can pick several actions. With 101 to 200,000, Threat Explorer offers only Move or delete or Propose remediation."
faq:
  - q: "Which plan includes Threat Explorer?"
    a: "According to Microsoft Learn, Threat Explorer is in Defender for Office 365 Plan 2, and real-time detections are in Plan 1."
  - q: "Where do I open it?"
    a: "The Learn page gives security.microsoft.com/threatexplorerv3 for Threat Explorer and security.microsoft.com/realtimereportsv3 for real-time detections."
  - q: "Which role do I need to delete or remediate messages?"
    a: "According to Microsoft Learn, the Move or delete action needs the Search and Purge role, or the Unified RBAC permission Email and collaboration advanced actions (manage). Previewing or downloading needs the Preview role. Users without enough permissions can use Propose remediation, which someone with permissions approves in the Action center."
  - q: "How many messages can I act on at once?"
    a: "Learn says that with 100 or fewer entries you can take multiple actions in the wizard. With 101 to 200,000 entries, Threat Explorer offers only Move or delete and Propose remediation, and you can select one or the other."
---

Threat Explorer in Microsoft Defender for Office 365 shows detected email threats and lets you act on them: move or delete messages, submit them for review, start an automated investigation, or propose remediation. Real-time detections give a similar view for Plan 1. This guide follows two Microsoft Learn pages: About Threat Explorer and Real-time detections in Microsoft Defender for Office 365, and Threat hunting in Threat Explorer and Real-time detections.

A note on sources: the About page is long, about 128,000 characters, and its details sections for the individual views, the property filter steps and the saved queries section are not summarized here beyond a few facts.

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

Select a Subject to open the email summary panel. At the top you find **Open email entity**, **View header**, **Take action** and **More options**. More options has **Email preview** and **Download email**, which need the Preview role, plus **View in Explorer** and **Go hunt** (Threat Explorer only). Selecting a recipient opens a flyout with summary, email, recent alerts and recent activity sections.

Learn says you can preview or download messages that are available in cloud mailboxes and quarantine. Examples of messages that are no longer available in mailboxes are those dropped before delivery, those where delivery failed, those that were soft deleted to Recoverable Items\Deletions, and those that ZAP moved to quarantine. Each preview or download creates an audit entry. Search the admin audit log by user for **AdminMailAccess**.

The page is inconsistent about which role a custom role group needs for preview. A footnote says Search and Purge while the permissions section says Preview, so verify in your tenant.

## Take action

Select messages in the **All email**, **Malware** or **Phish** view and choose **Take action**. This section comes from the threat hunting page, not from the real-time detections page. That page lists these options:

| Option | What it does | Plan |
|---|---|---|
| Move or delete | Move to Junk, Inbox or Deleted items, or delete as Soft deleted or Hard deleted. Moving a quarantined message to Inbox releases it | Plan 2 |
| Submit to Microsoft for review | Send the message to Microsoft for analysis, with allow or block entries in the Tenant Allow/Block List | Plan 1 and Plan 2 |
| Initiate automated investigation | Start an automated investigation | Plan 2 |
| Propose remediation | Create a remediation, which creates a soft delete pending action that an admin approves in the Action center | Plan 2 |

The wizard has three pages: **Choose response actions**, **Choose target entities** and **Review and submit**.

Learn states a limit on bulk work. With 100 or fewer entries, you can take multiple actions in the wizard. With 101 to 200,000 entries, Threat Explorer offers only **Move or delete** and **Propose remediation**, and you can select one or the other. Real-time detections offers only **Submit to Microsoft for review** and the matching allow or block entries.

Permissions: the **Move or delete** action needs the **Search and Purge** role, or the Unified RBAC permission Email and collaboration advanced actions (manage). Learn adds that SecOps staff without enough permissions can use **Propose remediation** to create a remediation, which someone with permissions then approves in the Action center.

For US Government organizations (GCC, GCC High and DoD), the page says the action logs are available only at `security.microsoft.com/threatincidents` and not in the Action center. It also says the actions might take time to appear on the related pages, but the speed of the remediation is not affected.

## Suggestion: a working order for a phishing report

This section is a practical suggestion and not a Microsoft statement.

1. Filter by sender, subject or recipient and check the date range.
2. Open one entry and review its details before you act on many.
3. Check URL clicks, if the plan includes the view, to see whether users clicked a link.
4. Use Take action on a small selection first.
5. Confirm the result in the Action center.
6. For a larger set, remember that above 100 entries Threat Explorer offers only Move or delete or Propose remediation.

## Not covered

The pages I read do not describe the following:

- The detailed filter property tables for each view and the steps for saved queries.
- License prices or the exact license names for each plan.
- How long actions take to complete.
- A full list of every view in the table, which is long.

## Related

- [Defender for Office 365](https://www.m365.fm/entity/defender-for-office-365/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [About Threat Explorer and Real-time detections in Microsoft Defender for Office 365 (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/threat-explorer-real-time-detections-about)
- [Threat hunting in Threat Explorer and Real-time detections (Microsoft Learn)](https://learn.microsoft.com/defender-office-365/threat-explorer-threat-hunting)
