---
title: "Microsoft Purview Audit: How to Search, Export and Understand Retention"
summary: "How Microsoft Purview Audit works: required roles, the search steps in the Purview portal, search limits, CSV export caps, and how long audit records are kept in Audit Standard versus Audit Premium."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [microsoft-purview-audit, audit-logs, purview]
keypoints:
  - "Audit is enabled by default. To search you need the Audit Logs or View-Only Audit Logs role in the Microsoft Purview portal."
  - "Search at purview.microsoft.com, Audit solution, Search page. The default range is the last 7 days and the maximum is 180 days."
  - "Audit Standard keeps records for 180 days. Audit Premium keeps Entra ID, Exchange, OneDrive and SharePoint records for one year by default."
  - "CSV export is capped at 50,000 rows for Audit Standard and 1,000,000 rows for Audit Premium."
  - "Core services usually return records 60 to 90 minutes after an event, and broad searches in large tenants can take up to 48 hours."
faq:
  - q: "What is Microsoft Purview Audit?"
    a: "According to Microsoft Learn, Microsoft Purview Audit records user and admin activity across Microsoft 365 so you can search and investigate it. Audit Standard and Audit Premium are both enabled by default, and Audit Premium includes everything in Audit Standard plus longer retention, retention policies and intelligent insights."
  - q: "Is the Purview audit log turned on by default?"
    a: "According to Microsoft Learn, Audit Standard and Audit Premium are both enabled by default for organizations with the appropriate subscription. You mainly need to assign permissions to the search tool. Admins can check ingestion in Exchange Online PowerShell with Get-AdminAuditLogConfig and the UnifiedAuditLogIngestionEnabled property."
  - q: "Which role do I need to search the audit log?"
    a: "Microsoft Learn says you must be assigned the Audit Logs or View-Only Audit Logs role in the Microsoft Purview portal. To use the audit cmdlets you need the same role in the Exchange admin center. These roles can be added to a custom role group."
  - q: "How long does Purview keep audit records?"
    a: "Microsoft Learn lists 180 days for Audit Standard. Audit Premium keeps Microsoft Entra ID, Exchange, OneDrive and SharePoint records for one year by default and other records for 180 days unless a retention policy extends them. A 10-year option needs an add-on license and is not retroactive."
  - q: "How many rows can I export?"
    a: "According to Microsoft Learn, the Export command downloads a CSV file of up to 50,000 rows for Audit Standard and up to 1,000,000 rows for Audit Premium. For larger volumes, Microsoft points to the Office 365 Management Activity API."
  - q: "Why does my search take so long?"
    a: "Microsoft Learn says completion time depends on the date range, number of users, activity volume and tenant size, and that broad searches in large tenants can take up to 48 hours. Jobs keep running after you close the browser, and completed jobs are kept for 30 days."
---

Microsoft Purview Audit records user and admin activity across Microsoft 365 in the unified audit log so you can investigate who did what and when. It is on by default. You search the audit log in the Microsoft Purview portal under **Audit**, export the audit records to CSV, and the audit log retention period depends on whether you use Audit Standard (180 days) or Audit Premium (one year for core services, with options to extend).

## What Microsoft Purview Audit records

Microsoft Purview Audit stores audit events for user and admin activities, which Microsoft Learn calls audit activities. You search audit records by date, activity or operation name, workload, record type and user, and the details of an exported record sit in its `AuditData` JSON property. The pages read mention Exchange, SharePoint, OneDrive, Teams and Microsoft Entra ID, and note that Power BI auditing must be enabled in its own admin portal, but they do not list every audited activity. Microsoft's audit activities reference is the place to look up one operation.

## Four ways to access the audit log

Microsoft Learn lists these routes for Audit Standard and Audit Premium:

- **The search tool in the Microsoft Purview portal.** The route this article walks through.
- **The Search-UnifiedAuditLog cmdlet** in Exchange Online PowerShell, for scripted or recurring searches.
- **The Audit Search Graph API**, which uses Microsoft Graph.
- **The Office 365 Management Activity API**, which Microsoft recommends for downloading audit data programmatically.

## Standard versus Premium

Microsoft Learn states that Audit Premium includes everything in Audit Standard. Both are enabled by default and include the search tool in the Purview portal, the Search-UnifiedAuditLog cmdlet, the Audit Search Graph API, CSV export and access to the Office 365 Management Activity API.

| Capability | Audit Standard | Audit Premium |
|---|---|---|
| Enabled by default | Yes | Yes |
| 180-day retention | Yes | Yes |
| Up to 1-year retention | No | Yes |
| 10-year retention (add-on license) | No | Yes |
| Audit log retention policies | No | Yes |
| Intelligent insights | No | Yes |
| Management Activity API bandwidth | Baseline | About twice Standard |

The API baseline is 2,000 requests per minute per organization, which grows with seat count and licensing. Premium needs the appropriate Premium license for each user whose events you want captured, and the 10-year option needs an additional per-user add-on. Exact subscription requirements are on Microsoft's enterprise plans page, not in the audit articles.

## Roles and prerequisites

According to Microsoft Learn:

- You need the **Audit Logs** or **View-Only Audit Logs** role in the Microsoft Purview portal to search.
- For the audit cmdlets, you need the same role in the Exchange admin center.
- To verify that search is on, run `Get-AdminAuditLogConfig | Format-List UnifiedAuditLogIngestionEnabled` in Exchange Online PowerShell. `True` means it is on. In Security & Compliance PowerShell the property always shows `False`, even when search is on.
- For Power BI, auditing must be enabled in the Power BI admin portal.

The audit search page does not mention the Organization Management role, so do not assume it gives search access.

## How to search

1. Sign in to the Microsoft Purview portal at purview.microsoft.com.
2. Select the **Audit** solution card. If you do not see it, select **View all solutions**, then **Audit** under **Core**.
3. On the **Search** page, set the criteria and select **Search**.

The main fields:

- **Date and time range (UTC).** Defaults to the last seven days. The maximum is 180 days, and the range cannot start before auditing was turned on.
- **Keyword Search.** Searches indexed content only, not the audit data content.
- **Activities, friendly names** or **operation names.** Pick activities or enter exact operation names, comma separated. Wrong names return no results.
- **Record types, Workloads, Users.** Leave Users empty to search all users and service accounts.
- **File, folder, or site.** Full or partial names or URLs, with `*` as a trailing wildcard.
- **Admin Units.** Scope results to administrative units. Restricted admins only see users within their units.
- **Search name.** A custom name. If blank, one is generated.

## Search jobs, timing and limits

- Each admin can run up to 10 search jobs at once, with only one unfiltered job.
- Jobs keep running after you close the browser.
- Core services such as Exchange, SharePoint, OneDrive and Teams typically return records 60 to 90 minutes after an event. Other services may take longer, and Microsoft does not commit to a specific time.
- Broad searches in large tenants can take up to 48 hours.
- Completed search jobs are kept for 30 days.
- Above 100,000 results, the dashboard shows an approximate count.

## How to export

Open a completed job and select **Export** on the command bar to download a CSV file.

- Audit Standard: up to 50,000 rows.
- Audit Premium: up to 1,000,000 rows.

In Excel, you can sort and filter by property, or use Power Query to split the `AuditData` JSON into separate columns. For downloading audit data programmatically, Microsoft recommends the Office 365 Management Activity API instead of a PowerShell script. For scripted or recurring searches, the Search-UnifiedAuditLog cmdlet in Exchange Online PowerShell is the route.

## Audit log retention policies and retention periods

Microsoft Learn lists these audit log retention periods. Audit retention policies exist only in Audit Premium:

- **180 days.** Audit Standard, and Premium records not covered by a longer policy. Standard logs generated before October 17, 2023 were kept for 90 days.
- **1 year.** Microsoft Entra ID, Exchange, OneDrive and SharePoint records, through the default retention policy in Audit Premium. The audit search page ties this default to Office 365 E5, Microsoft 365 E5 and the Purview Suite or E5 eDiscovery and Audit add-ons. Any other non-E5 license gets 180 days.
- **Up to 1 year.** Other services, through custom Premium retention policies, by service, activity or user.
- **10 years.** Users with the 10-Year Audit Log Retention add-on and a 10-year policy. This is not retroactive and cannot keep records created before the policy existed. Records from non-user entities, such as service principals and system events, are kept for a fixed one year.

Custom policies take precedence over the default policy. Changes to licensing or policies affect expiry after they are applied but not items already committed.

## Common mistakes

- Searching a range longer than 180 days and getting an error.
- Typing operation names by hand. Copy them from Microsoft's audit activities article.
- Expecting results minutes after an event. Allow 60 to 90 minutes for core services.
- Planning for one-year retention without checking the license. Premium retention depends on the license.
- Assuming a mailbox event always appears. Microsoft notes that some mailbox audit events may not show in portal searches.

## What these pages do not cover

The pages read do not list every audit activity, and the audit search page does not mention Copilot interactions. Look up specific activities in Microsoft's audit activities reference before building alerts on them.

## Related

- [Microsoft Purview Audit](https://www.m365.fm/entity/microsoft-purview-audit/)
- [Audit logs](https://www.m365.fm/entity/audit-logs/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)

## Sources

- [Microsoft Learn: Audit solutions overview](https://learn.microsoft.com/en-us/purview/audit-solutions-overview)
- [Microsoft Learn: Search the audit log](https://learn.microsoft.com/en-us/purview/audit-search)
