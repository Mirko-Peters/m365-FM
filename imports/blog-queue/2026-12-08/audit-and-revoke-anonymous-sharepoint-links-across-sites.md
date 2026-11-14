---
title: "Audit and revoke anonymous SharePoint sharing links across site collections"
summary: "Find where Anyone links are created with SharePoint Advanced Management reports and PowerShell, then reduce the risk with site sharing settings, link expiration, access reviews and the change history report."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [sharepoint-sharing-links, sharepoint-advanced-management, sharepoint, oversharing]
keypoints:
  - "The Sharing links activity report lists the sites with the most new Anyone links, People in the organization links and externally shared Specific people links in the last 28 days."
  - "Reports are not generated automatically. Run them in the SharePoint admin center under Reports > Data access governance, or with Start-SPODataAccessGovernanceInsight."
  - "Control the source: set Anyone links to expire, limit them to view permission, and lower the external sharing level per site."
  - "The pages I read do not say what happens to existing Anyone links when you lower a site's sharing level, so test on a non-production site first."
  - "Use site access reviews to involve site owners, and the change history report to see who changed sharing settings."
faq:
  - q: "How do I get a list of sites with many Anyone links?"
    a: "In the SharePoint admin center, expand Reports, select Data access governance, then under Activity reports select Sharing links. Microsoft Learn says the report shows the sites where users created the most Anyone links in the last 28 days, the top 100 sites, applied policies and the primary administrator. Reports must be run manually and can take up to 24 hours."
  - q: "Can I run the same audit with PowerShell?"
    a: "Yes. The Learn page on PowerShell for data access governance lists Start-SPODataAccessGovernanceInsight with -ReportEntity SharingLinks_Anyone, -ReportType RecentActivity and -Workload SharePoint or OneDriveForBusiness. You track it with Get-SPODataAccessGovernanceInsight and download it with Export-SPODataAccessGovernanceInsight."
  - q: "What licensing do the reports need?"
    a: "Learn says the reports come with SharePoint Advanced Management. Microsoft 365 E5 IT administrators can access activity reports but not the other features, and activity reports can return only up to 10,000 sites. Without Advanced Management you must enable data collection first, and the reports are unavailable for Microsoft 365 operated by 21Vianet."
  - q: "How do I limit how long Anyone links stay valid?"
    a: "The external sharing page on Microsoft Learn says you can require all Anyone links to expire and set the maximum number of days. If you change the expiration, existing links keep their current expiration if the new setting is longer, or update to the new setting if it is shorter. You can also limit Anyone links to view permission."
  - q: "Does lowering a site's sharing setting break existing Anyone links?"
    a: "The Learn pages I read do not say. They state that if external sharing is turned off for the whole organization, shared links stop working, and that guests typically lose access within one hour. Test a lower site setting on a non-production site before you apply it widely."
---

To audit anonymous links across many sites, run the Sharing links report from SharePoint Advanced Management, review the top sites, then reduce risk at the source: shorter link expiration, view-only permissions and a lower external sharing level for sites that do not need Anyone links. This article follows what Microsoft documents and says where the documentation stops.

## Step 1: Understand what you can see

Anyone links let anyone with the link access files and folders without signing in. Learn's Sharing links report page describes three activity reports that cover the last 28 days:

| Report | What it shows |
|---|---|
| Anyone links | Sites with the most Anyone links created |
| People in the organization links | Sites with the most organization-wide links created |
| Specific people links shared externally | Sites with the most links created for external recipients |

The reports cover SharePoint sites. OneDrive is available through PowerShell. The page does not list the CSV column names, so review a sample file before building automation.

## Step 2: Generate the report in the admin center

1. Sign in to the SharePoint admin center with SharePoint administrator credentials.
2. Expand **Reports** and select **Data access governance**.
3. Under **Activity reports**, select **Sharing links**, and run the report.
4. Check the **Status** column. Reports can take up to 24 hours, and you can run one again every 24 hours.
5. Open the report to see the top 100 sites, the applied policies (sensitivity label, unmanaged device controls and external sharing setting) and the primary administrator.
6. Download the CSV for offline analysis. Learn says the file can contain up to 1 million sites.

Reports are not created automatically. Learn recommends running the site permissions and sensitivity label reports quarterly for a baseline, and the sharing links and "Everyone except external users" reports monthly.

## Step 3: Generate it with PowerShell

For OneDrive, or to automate, use the SharePoint Online Management Shell. Connect with `Connect-SPOService` without `-Credential`, then:

```powershell
Start-SPODataAccessGovernanceInsight -ReportEntity SharingLinks_Anyone -Workload SharePoint -ReportType RecentActivity
Get-SPODataAccessGovernanceInsight -ReportID <GUID>
Export-SPODataAccessGovernanceInsight -ReportID <GUID> -DownloadPath "C:\Reports"
```

Use `-Workload OneDriveForBusiness` for OneDrive. Learn warns that its own text uses both `SharingLinks_Anyone` and `SharingLinksAnyone` in different places, so verify the value before scripting.

## Step 4: Know the licensing and limits

- The reports are part of SharePoint Advanced Management.
- Microsoft 365 E5 IT administrators can open activity reports but not snapshot reports or remedial actions, and activity reports return only up to 10,000 sites.
- Without Advanced Management you must enable data collection. Data is stored for 28 days, reports become available 24 hours after enabling, and collection pauses if no report is generated for three months.
- The reports are unavailable for Microsoft 365 operated by 21Vianet.

## Step 5: Reduce risk at the source

In the SharePoint admin center, go to **Policies** > **Sharing**. Learn lists the levels: **Anyone**, **New and existing guests**, **Existing guests** and **Only people in your organization**. For Anyone links, you can:

- Require links to expire and set the maximum number of days.
- Limit links to view permission.

If you change the expiration, existing links keep their current expiry when the new setting is longer, and update to the new value when it is shorter. That makes a shorter maximum an effective way to retire old links gradually.

For a single site, open **Active sites**, select the site, go to the **Settings** tab and choose **More sharing settings**. A site setting must be the same as or more restrictive than the organization setting.

What the pages do not say: what happens to existing Anyone links when you lower a site's sharing level. They only state that if external sharing is turned off for the organization, shared links stop working, and that guests typically lose access within one hour. Test on a non-production site first and communicate before you change production sites.

## Step 6: Involve owners and keep a record

Learn's remedial actions for oversharing findings are:

- **Restricted access control** to limit access to a specific group right away.
- **Site access review** to ask site owners to review and update permissions. The PowerShell reference lists `Start-SPOSiteReview` and says up to 1,000 reviews per calendar month.
- **Change history report** to see who changed sharing settings. It exports CSV for up to 180 days, needs audit logging turned on in Microsoft Purview, and allows up to 10 reports.

Weigh the sensitivity of the content, the amount at risk and the disruption to users before choosing between a hard restriction and a review.

## Common mistakes

- Waiting for the report without running it. It is not automatic.
- Reading the 28-day activity report as an inventory of all existing links.
- Turning off Anyone links organization-wide without telling teams.
- Tightening a site's setting without testing the effect on links.

## A simple monthly routine

1. Run the Sharing links reports for SharePoint, and for OneDrive with PowerShell.
2. Sort the downloaded files by the number of Anyone links and pick the top sites.
3. Check each site's applied policies and primary administrator in the report.
4. For sites that should not use Anyone links, lower the site sharing setting after a test, or start a site access review.
5. Keep the organization-wide expiration setting short enough that unused links retire on their own.
6. Record the date and the settings you changed, and use the change history report to confirm them later.

## Related

- [SharePoint sharing links](https://www.m365.fm/entity/sharepoint-sharing-links/)
- [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/)
- [Oversharing](https://www.m365.fm/entity/oversharing/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Sharing links activity reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-sharing-links-report)
- [Data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports)
- [PowerShell for data access governance](https://learn.microsoft.com/en-us/sharepoint/powershell-for-data-access-governance)
- [Manage sharing settings for SharePoint and OneDrive](https://learn.microsoft.com/en-us/sharepoint/turn-external-sharing-on-or-off)
- [Change the external sharing setting for a site](https://learn.microsoft.com/en-us/sharepoint/change-external-sharing-site)
- [Change history report](https://learn.microsoft.com/en-us/sharepoint/change-history-report)
