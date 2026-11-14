---
title: "Exclude SharePoint Sites From the Copilot Semantic Index Before Rollout: Search Setting vs Restricted Content Discovery"
summary: "What the semantic index covers, how to exclude a SharePoint site from it with the search setting, how Restricted Content Discovery differs, and what the Learn pages say about permissions, propagation time and limits."
status: review
publish: false
author: mirko-p
date: 2026-12-21
topics: [semantic-index, sharepoint, restricted-content-discovery]
keypoints:
  - "Semantic indexing is automatic, needs no admin action and cannot be disabled. The tenant-level index is built from text-based SharePoint Online files and respects each user's access."
  - "Without Purview DLP, admins can exclude a site by setting Allow this site to appear in search results to No. Learn says this removes it from Microsoft Search and the semantic index together."
  - "Restricted Content Discovery hides a site from organization-wide search and Copilot but does not remove content from the search index. It supports up to 20,000 sites and needs SAM."
  - "Neither control changes permissions. Users who already have access still reach the content directly, so these settings are a pause, not a permissions fix."
  - "Updates need time to propagate. For sites above 500,000 items, a Restricted Content Discovery change can take more than a week to fully take effect."
faq:
  - q: "Can I turn off the Copilot semantic index?"
    a: "No. Learn says semantic indexing is an improvement to Microsoft 365 Search, is enabled automatically by Microsoft and cannot be disabled. Admins can instead exclude files with Microsoft Purview Data Loss Prevention, or exclude SharePoint sites from the tenant-level index."
  - q: "How do I exclude a SharePoint site from the semantic index?"
    a: "Learn describes it for organizations without Purview DLP: in the site, select Settings, Site information, View all site settings, then Search and offline availability, and select No for Allow this site to appear in search results. Learn says this can also be done with PowerShell for multiple sites."
  - q: "Does excluding a site from search only affect Copilot?"
    a: "No. Learn says there is no option to exclude results from Microsoft Search only or the semantic index only. The action applies to both at the same time, and only the tenant-level index is covered."
  - q: "Does Restricted Content Discovery change who can open the files?"
    a: "No. Learn says it affects discoverability, not permissions. Users with access can still open content directly, and they can still discover content they own or recently interacted with."
  - q: "Is Restricted Content Discovery a permanent solution?"
    a: "Learn describes it as a temporary governance control that gives time to review and right-size access while the Copilot deployment continues. It cautions that excessive use can reduce the completeness and relevance of search and Copilot results."
---

Before a Copilot rollout, many teams want certain SharePoint sites kept out of Copilot answers while permissions are reviewed. Microsoft Learn describes two mechanisms for it that behave differently, and a third control (Purview Data Loss Prevention) for individual files. This article compares the two site-level options based on the Learn pages read, and states what they leave open.

## What the semantic index is

Per the Learn page on semantic indexing, Microsoft Copilot maps organizational data into a lexical and semantic index that is generated from content in Microsoft Graph. Facts from the page:

- A tenant-level index exists for every Copilot customer, requires no administrative involvement and is enabled automatically. Learn says semantic indexing is an improvement to Microsoft 365 Search and cannot be disabled.
- The tenant-level index is an organization-wide index generated from text-based SharePoint Online files. It only surfaces results to a user who already has access under role-based access control, and the SharePoint site must remain searchable.
- Supported file types in the tenant-level index include Word, PowerPoint, PDF, web pages (aspx), OneNote files and Copilot connector data. Archived SharePoint data is listed as not supported. Files up to 512 MB are supported for PDF, PPTX and DOCX.
- New documents added to accessible SharePoint sites, accessible by two or more users via site inheritance, are indexed daily. Changes to an indexed document are indexed immediately.
- Indexing does not change access permissions. Learn gives the example that sharing with an organization-wide link does not make the content part of the tenant-level index.

## Option 1: Exclude the site from search results

Learn describes this for organizations without Microsoft Purview Data Loss Prevention, and says to consider it only for sensitive data such as payroll, HR or financial information.

1. Browse to the site with appropriate administrator permissions.
2. Select **Settings** > **Site information** > **View all site settings**.
3. Under **Search**, select **Search and offline availability**.
4. Set **Allow this site to appear in search results** to **No**.

Learn says this can also be done with PowerShell for multiple sites, and the page does not give the command. Important limits from the page:

- The exclusion covers the tenant-level index only.
- There is no way to exclude from Microsoft Search only or from semantic indexing only. Both change together, which means the site also disappears from ordinary Microsoft Search results.
- For metadata-aware scoped queries (users attaching a library or folder in Copilot), the page says the site or library must remain searchable.

## Option 2: Restricted Content Discovery

Restricted Content Discovery is a site-level setting that limits discovery of content from specific sites, including recently interacted files, in organization-wide search and Microsoft Copilot responses. Learn describes it as designed for phased Copilot rollouts, sites with high oversharing risk and sites under permissions review.

How to enable it:

- SharePoint admin center: **Sites** > **Active sites**, select the site, open **Settings** and turn **Restrict content from Microsoft Copilot** on, then **Save**.
- PowerShell: `Set-SPOSite -Identity <site-url> -RestrictContentOrgWideSearch $true`. Use `$false` to remove it. Check status with `Get-SPOSite ... | Select RestrictContentOrgWideSearch`.

Prerequisites on the page: review the SharePoint Advanced Management (SAM) prerequisites including PowerShell module and RBAC role assignments, have a Microsoft Copilot license, and review catalog categories. The FAQ says you can configure it if your organization is licensed for Copilot and has SAM available.

Other documented behavior:

- A **Restricted** tag is visible on the site, and users do not see AI entry points such as the Copilot button, AI actions menus (including creating agents) or **Create pages with AI** on those sites.
- It applies to up to 20,000 sites, only to SharePoint sites (not OneDrive), and does not affect searches that start from site context or experiences such as Microsoft 365 Feed and Recommendations.
- By default only SharePoint administrators manage it. With `Set-SPOTenant -DelegateRestrictedContentDiscoverabilityManagement $true`, site administrators can manage it for their sites and must give a justification for each change.
- Reports: `Start-SPORestrictedContentDiscoverabilityReport`, `Get-SPORestrictedContentDiscoverabilityReport` and the download action with a report ID. Purview audit log events cover enabling, disabling and justifications.

## Side-by-side

| Aspect | Search setting set to No | Restricted Content Discovery |
|---|---|---|
| Documented for | Organizations without Purview DLP, sensitive data | Phased rollout, oversharing risk, permissions review |
| Effect on search index | Site removed from Microsoft Search and the semantic index together | Does not remove content from the Microsoft 365 search index |
| Changes permissions | The page does not say it does | No |
| Extra licensing named on page | None named | Copilot license and SAM availability |
| Documented scale limit | None named | Up to 20,000 sites |
| Propagation time | Not stated on the page | Depends on site size. Over 500,000 items can take more than a week |

## What neither option does

- Neither changes permissions. Learn is explicit for Restricted Content Discovery, and the semantic index page says indexing does not change access permissions. A user who can open a file can still open it directly.
- Restricted Content Discovery does not affect experiences that work on content already in use, such as summarizing an open document. Learn's FAQ gives that example.
- Restricted Content Discovery does not affect Microsoft Purview features such as eDiscovery and auto-labeling, because content stays in the index.
- Learn cautions that excessive use of Restricted Content Discovery reduces the content available to search and Copilot, which can lower the completeness and relevance of answers.

## What the documentation does not say

- The semantic index page does not state how long an exclusion through the search setting takes to apply.
- It does not give the PowerShell command for the bulk search-setting change.
- The two pages do not say what happens if both are applied to the same site, and they do not rank the options. A pilot test with a copy of a site is the author's suggestion, not a Learn procedure.
- The semantic index page does not describe a verification report for the search-setting option. The Restricted Content Discovery page does, as listed above.

## Related

- [Semantic index](https://www.m365.fm/entity/semantic-index/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Restricted Content Discovery](https://www.m365.fm/entity/restricted-content-discovery/)
- [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/)

## Sources

- [Semantic indexing for Microsoft Copilot (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftsearch/semantic-index-for-copilot)
- [Restrict discovery of SharePoint sites and content, SharePoint in Microsoft 365 (Microsoft Learn)](https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery)
