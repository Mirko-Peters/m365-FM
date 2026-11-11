---
title: "How to find every site and file a single user can access"
summary: "Find everything a user has access to in SharePoint with the per-user data access governance report or PowerShell. Steps, limits and how to read the results."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-permissions, least-privilege, user-offboarding, sharepoint-essentials-toolkit]
keypoints:
  - "SharePoint has no built-in search box for a user's access, so admins use the Site permissions for users report in the SharePoint admin center or a PowerShell command."
  - "The per-user report lists sites with full-site access and sites where the user reaches only some files or folders, and it separates direct access from access through groups."
  - "The report is a snapshot that can be up to 48 hours old, can be rerun only every 30 days, and needs SharePoint Advanced Management and a first organization-wide report."
  - "Use the user's user principal name, not the display name, when you run the PowerShell version, and request up to 100 users per call."
  - "Read the output as a to-do list: remove stale direct shares first, move people into groups, and then re-run the report to confirm the result."
faq:
  - q: "How do I see all SharePoint sites a user has access to?"
    a: "Open the SharePoint admin center, go to Reports, then Data access governance, and create a Site permissions for users report. Add the user, choose SharePoint as the scope and run it. The result lists every site the user can reach and whether access is for the full site or only for items."
  - q: "How long does a user access report take, and how fresh is it?"
    a: "Microsoft says the data reflects up to 48 hours before the report is generated, and each report can be run again every 30 days. You also need an organization-wide site permissions report first. Plan ahead, because this is not a tool for an urgent same-hour check."
  - q: "Can I run a user access report with PowerShell?"
    a: "Yes. The SharePoint Online Management Shell has Start-SPODataAccessGovernanceInsight, which takes the report entity PermissionsReport, the type Snapshot and a list of user principal names. You can request up to 100 users per call, then export the finished report as a CSV file."
---

To find everything a user has access to in SharePoint, run the **Site permissions for users** report from the SharePoint admin center, or start the same report with PowerShell. Both list the sites a person can reach and whether the access is direct or through a group. This article is for Microsoft 365 admins who get the question "what can this person see?" before an offboarding, a role change or a security review. You will get the steps, the limits Microsoft documents, a worked reading of a report and the mistakes that lead to wrong answers.

## Why can't you just list a user's permissions in SharePoint?

SharePoint stores permissions at the site, at the library or list, and at the single item. A person can hold access at all three levels at once, in one site collection or in many. They can get it from a site group, from a Microsoft 365 group, from a direct share or from a link. No single page in a SharePoint site shows this list of site permissions for a person across the tenant. Site owners see only their own site, and an admin needs a tenant-wide view to audit access.

A site's **Check Permissions** feature, described in Microsoft's article on [Access Denied errors](https://learn.microsoft.com/en-us/troubleshoot/sharepoint/administration/access-denied-or-need-permission-error-sharepoint-online-or-onedrive-for-business), works for one person on one site. That is fine for a support ticket. It is too slow when you must audit a person across hundreds of sites. For that you need a report built for the task.

This matters most for [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) cleanup in three moments: when someone changes roles and should lose old access, when a contractor leaves, and when a compromised account needs a damage estimate.

## How to run the user permissions report in the admin center

Microsoft documents this in its article on the [site permissions report for given users](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-site-permissions-users-report). It is part of data access governance, which belongs to SharePoint Advanced Management. Before you start, check the license and role rules on Microsoft's prerequisites page. A base Microsoft 365 or Office 365 subscription is needed, plus either a Copilot license assigned to at least one user in the organization or the SharePoint Advanced Management add-on. The page also names two roles, SharePoint Administrator and SharePoint Advanced Management Administrator.

You also need the organization-wide **Site permissions for your organization** report to have been generated at least once. Then follow these steps:

1. Open the SharePoint admin center and go to **Reports**, then **Data access governance**.
2. Under **Site permissions for users**, select **View reports**, then **Create report**.
3. Select **Add users to report**, pick the people and save. You can edit the list later.
4. Set **Scope** to SharePoint or OneDrive. Run the report twice if you need both.
5. Give the report a unique name and select **Create and run**.
6. Watch the **Status** column. When the report is ready, select its name to read the results.

Users appear on the left. The list of sites that the selected user can reach appears on the right, so you can scan it for sites that do not belong to the person's current role.

## How to check user permissions with PowerShell

If you prefer scripts, Microsoft's page on [PowerShell for data access governance](https://learn.microsoft.com/en-us/sharepoint/powershell-for-data-access-governance) lists the cmdlets. The main one is `Start-SPODataAccessGovernanceInsight`. For a user report, set `-ReportEntity PermissionsReport`, `-ReportType Snapshot` and `-Workload SharePoint`. Then add `-Name` and a list of people in `-UserEmailList`.

Three details from that page save time:

- The parameter is called an email list, but it takes **user principal names** (UPNs). Look them up with `Get-MgUser` if needed.
- You can send up to **100 users** in one request.
- Do not mix up `PermissionsReport` with `PermissionedUsers`. The second one creates the organization-wide site permission snapshot.

The command returns a report ID. Use `Get-SPODataAccessGovernanceInsight` to check the status, and `Export-SPODataAccessGovernanceInsight` to download the finished report as a CSV file. Connect with `Connect-SPOService` without the `-Credential` parameter, because Microsoft says that way of signing in is not supported for these cmdlets.

## How to read the permission report

The columns tell you more than the site list. Microsoft's documentation describes these:

- **Is site shared:** yes means the user is in at least one SharePoint group with site-level access.
- **Items with direct access count:** files or folders shared directly with the person.
- **Items with indirect access count:** files or folders the person reaches through group membership.
- **ExternalSharing, Site Sensitivity and Site Template:** context on how risky the site is. If external users can reach the site, treat it as a higher priority.
- **Primary admin:** the person you must ask before you change anything.

A **single-user CSV** can hold up to 1 million sites. File counts are approximate, and the report is a point-in-time snapshot. Microsoft says changes can take up to 48 hours to appear. It also limits you to 5 reports at a time, and each report can be rerun every 30 days. Plan your cleanups around these limits, and do not promise a live answer to a manager. Download the CSV file, sort it in Excel by direct access count and keep a copy as evidence of the audit.

## What the permissions report does not tell you

The documented columns give you counts. They tell you that a user has direct access to 14 items on a site. They do not name those 14 items, and they do not list the sharing links behind them. To find them, open the SharePoint site, go to the document library or folder, select an item and use **Share**, then **Manage access**, as described in Microsoft's article on [seeing who a file is shared with](https://support.microsoft.com/en-us/sharepoint/sharepoint-sharing-and-permissions/see-who-a-file-is-shared-with-in-onedrive-or-sharepoint). That panel lists people, groups and links for one item. It is slow for hundreds of items, so ask the site owner who shared what before you start clicking.

Direct access usually comes from unique permissions. By default, files and folders inherit permissions from their document libraries. Microsoft's documentation on permission levels explains that inheritance stops when someone with control changes the permissions of an item, and that SharePoint stops it automatically when a user shares an item with someone who has no access. That is how individual users end up on folder permissions that nobody tracked. Sharing links add a second path. A link can reach people outside the organization, which is external sharing that no site group shows. SharePoint administrators should audit these items site by site, with the owners.

The report also says nothing about why access exists. A group may have been set up for a project that ended. A direct share may follow a request that was approved long ago. Only the site owner or the person who shared the item can say. Ask first, then act. A short note in a shared sheet, with the site, the item count and the owner's answer, is enough to keep the review traceable.

## Example: an access review before a role change

The numbers below are made up to show the method.

An analyst moves from finance to marketing. You run the per-user report and get 41 sites. You sort the CSV like this:

1. **Is site shared = yes: 9 sites.** The analyst belongs to a site group. Seven are finance sites. Two are marketing sites, which are correct.
2. **Direct access count above 0: 6 sites.** The analyst received direct shares of 3, 8, 1, 14, 2 and 5 items. Total: 33 items. Nobody remembers granting these, so they are the first cleanup candidates.
3. **Indirect access only: 26 sites.** The analyst reaches these through a Microsoft 365 group or a larger group. These are checked last, because removing the person from a group changes access for that group's whole purpose.

Your plan: remove the analyst from the seven finance site groups, review the 33 directly shared items with the site owners, and keep the 26 group-based sites for a second look. This follows the idea of [least privilege](https://www.m365.fm/entity/least-privilege/): the smallest role at the smallest scope that still lets the person work. Rerun the report after the 30-day wait and compare.

## Common mistakes

- **Using the wrong identifier.** The PowerShell parameter wants a UPN. A display name or a different mail alias gives no match.
- **Forgetting OneDrive.** The scope is either SharePoint or OneDrive. A report for one does not cover the other.
- **Treating the snapshot as live.** If you removed access yesterday, the report may still show it.
- **Cleaning group access first.** Direct shares are the exception cases. Start there, then deal with groups.
- **Skipping the owner.** The site's primary admin knows why the access exists. Ask before you remove it.
- **Forgetting the permission level.** A site group can hold Read or Full Control. Two sites in the report can carry very different risk.

## How software can help

Microsoft's own route is the data access governance report described above, plus PowerShell for scripting and export. It suits quarterly reviews and one-off questions. Teams that need an answer more often, or that want to list all SharePoint sites a user can reach without waiting 30 days between runs, can add a reporting tool. Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/) is one example. According to its product page, it can show everything one person can access, replace one user with another, and fix permissions from reports. These are the vendor's statements and M365.FM did not test them. Compare any tool with the built-in report first, and check what it needs in your tenant.

## Next step

Choose one person who changed roles in the last six months and run the per-user report to find everything they have access to in SharePoint. Sort the output by direct access and book the cleanup with the site owners this week.
