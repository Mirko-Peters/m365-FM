---
title: "How to Run Data Access Governance Reports for SharePoint Sites"
summary: "Run the Data access governance reports in the SharePoint admin center to find overshared sites. Covers prerequisites, snapshot versus activity reports, the site permissions and sharing links reports, timing limits, CSV fields and the remediation options Learn lists."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [sharepoint-advanced-management, sharepoint, sensitivity-labels]
keypoints:
  - "Open the SharePoint admin center as a SharePoint administrator, expand Reports and select Data access governance."
  - "Snapshot reports show permissions as of a date; activity reports track sharing activity from the last 28 days."
  - "The first site permissions report takes up to 5 days, later runs complete within 24 hours, and you can run it again every 30 days."
  - "Sharing links reports cover SharePoint sites, may take up to 24 hours, and can be run again every 24 hours."
  - "Learn lists restricted access control, the Change history report and Site access review as remediation options."
faq:
  - q: "Where do I find the reports?"
    a: "Sign in to the SharePoint admin center with SharePoint administrator credentials, expand Reports in the left pane and select Data access governance. The landing page lists snapshot and activity reports."
  - q: "What is the difference between snapshot and activity reports?"
    a: "Learn says snapshot reports show your organization's current status as of the date they were generated, while activity reports track potential oversharing activity from the last 28 days on recently active sites."
  - q: "How often can I run them?"
    a: "Per Learn, the site permissions report can be run again every 30 days, and sharing links reports every 24 hours. Learn recommends running snapshot reports quarterly and activity reports monthly."
  - q: "Do I need SharePoint Advanced Management?"
    a: "Learn points to the SharePoint Advanced Management prerequisites. It also says that IT administrators with Microsoft 365 E5 can use Data access governance reporting without the other features, but get no snapshot reports or remedial actions, and activity reports can return only up to 10,000 sites."
  - q: "Why does a report show no data or fail?"
    a: "Learn lists one known issue: reports might not work if your organization uses nonpseudonymized report data. A Global Administrator must clear the setting Display concealed user, group, and site names in all reports in the Microsoft 365 admin center."
---

To run data access governance reports, sign in to the SharePoint admin center as a SharePoint administrator, expand **Reports** and select **Data access governance**. Start with the site permissions report to get a baseline, then use the activity reports, such as the sharing links report, to watch for new oversharing. Microsoft Learn recommends snapshot reports quarterly and activity reports monthly. This guide follows Learn's overview page, its site permissions and sharing links pages, and the SharePoint Advanced Management prerequisites.

## What you need first

Learn sends you to the SharePoint Advanced Management prerequisites page for requirements. That page lists:

- A base subscription such as Office 365 E3, E5 or A5, Microsoft 365 E1, E3, E5 or A5, or Microsoft 365 GCC, GCC-High or DoD.
- Either at least one user with a Microsoft Copilot license, or a SharePoint K, P1 or P2 subscription plus the SharePoint Advanced Management Plan 1 add-on, or Microsoft 365 E7.
- A role in Microsoft Entra ID: SharePoint Administrator or SharePoint Advanced Management Administrator.

The overview page adds two limits. The reports are currently unavailable for Microsoft 365 operated by 21Vianet, even with the required licenses. And IT administrators with Microsoft 365 E5 licensing can access Data access governance reporting but cannot use the other SharePoint Advanced Management features. For them the reports do not include snapshot reports or remedial actions, and activity reports return only up to 10,000 sites.

## Open the reports

1. Sign in to the SharePoint admin center with SharePoint administrator credentials.
2. In the left pane, expand **Reports** and select **Data access governance**.

The landing page lists these reports:

| Type | Report |
| --- | --- |
| Snapshot | Site permissions across your organization (marked Recommended) |
| Snapshot | Sensitivity label applied to files |
| Activity | Sharing links |
| Activity | Shared with Everyone except external users |

The overview page also describes a site permissions for users report, which lists the sites a specified user can access, and a report on sites and files shared through the special groups Everyone except external users and Everyone. It links separate pages for each.

## Snapshot and activity reports

Snapshot reports show data as of the date they were generated. Activity reports cover the last 28 days and focus on recently active sites where users created sharing links or shared with large groups. Learn says every activity tracked has matching baseline data in the snapshot reports.

If your organization does not have SharePoint Advanced Management, you must enable data collection before generating activity reports. Learn gives these details: the system then starts collecting audit data, data is stored for 28 days, reports become available 24 hours after you enable collection and contain only data from that point, and if no reports are generated for 3 months, collection pauses and must be re-enabled.

## Run the site permissions report

Learn lists these points before the first run:

- Separate reports are created for SharePoint and OneDrive sites.
- The first report takes up to 5 days to complete, regardless of organization size.
- Later reports complete within 24 hours.
- Reports capture data from up to 48 hours before generation.
- You can run reports again every 30 days.

Not all sites are included. Sites with a NoAccess lock status and archived sites are excluded because role assignments and group information cannot be retrieved. Unlocked and ReadOnly sites are included.

Steps:

1. On the landing page, select **View reports** under **Site permissions across your organization**.
2. Select **Create report**. If reports already exist, select **Run reports** when it is enabled.
3. When the report is ready, the summary shows total sites scanned, sites without users, sites with user permissions (split by SharePoint and OneDrive) and the report date.
4. Select **View report** under SharePoint or OneDrive to see the top 100 sites with the highest number of users who have permissions.

You can download a CSV to analyze up to 1 million sites offline. Columns include site name and URL, site template, primary admin, external sharing, site privacy and sensitivity, number of users having access, guest and external participant permission counts, Microsoft Entra group permission count, file count, items with unique permissions, People in your org and Anyone link counts, EEEU and Everyone permission counts, and the report date.

Learn explains that Total permissioned users are unique users after expanding all groups and removing duplicates. Sharing links and EEEU grants do not raise that count, because they create potential exposure that becomes actual only when someone uses them. The EEEU and Everyone counts exclude permissions from hidden system files and groups, which Learn says are typically present by design.

## Run the sharing links reports

Learn describes three views: Anyone links, People in the organization links, and Specific people links shared externally. Before you start:

- Reports are created for SharePoint sites only, and OneDrive support is available through PowerShell.
- Reports may take up to 24 hours.
- Reports capture data from up to 24 hours before generation.
- You can run them again every 24 hours.

Run them manually, either all at once or one at a time, and check the **Status** column to see whether a report is ready. Each report shows the top 100 sites with the most sharing links created, the applied policies (site sensitivity labels, unmanaged device controls and external sharing settings) and the primary administrator. The page says last 28 days in its introduction and last 30 days in the view section, so treat the exact window with care. CSV download covers up to 1 million sites.

## Act on what you find

Learn says to weigh the sensitivity of the exposed content, the amount of content at risk and the potential disruption to users. It lists:

- **Immediate action:** restricted access control to limit access to a specific group, and the Change history report to see recent permission changes.
- **Collaborative remediation:** the Site access review feature, which asks site owners to review and update permissions.

## My suggested routine

This section is my advice, not a Microsoft statement.

1. Run the site permissions report first and sort by total permissioned users. The sites at the top are the first to review.
2. Review the EEEU and Everyone counts and the Anyone link counts next, since those columns point at broad exposure.
3. Put the 30-day and 24-hour limits in your calendar, so reports are not missed.
4. Export the CSV each time and keep dated copies, so you can compare runs.
5. Hand site owners a short list with the Site access review feature rather than a spreadsheet.
6. Check the pseudonymization setting early, as Learn says it can stop reports from working.

## Related

- [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Sensitivity labels](https://www.m365.fm/entity/sensitivity-labels/)

## Sources

- [Data access governance reports for SharePoint sites - SharePoint in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/sharepoint/data-access-governance-reports)
- [Data access governance reports - get site permission states snapshot report for SharePoint sites - SharePoint in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/sharepoint/data-access-governance-site-permissions-report)
- [Data access governance reports - get sharing links activity report for SharePoint sites - SharePoint in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/sharepoint/data-access-governance-sharing-links-report)
- [Prerequisites for SharePoint Advanced Management - SharePoint in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/sharepoint/sharepoint-advanced-management-prerequisites)
