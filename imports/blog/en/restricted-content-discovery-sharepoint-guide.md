---
title: "Restricted Content Discovery: what it hides and what it does not"
summary: "Restricted Content Discovery in SharePoint hides a site from org-wide search and Copilot but leaves permissions alone. See its limits, setup and best use."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [restricted-content-discovery, copilot-governance, sharepoint-advanced-management, restricted-sharepoint-search]
keypoints:
  - "Restricted Content Discovery hides a site's content from organization-wide search and from Copilot's broad discovery, but it is not an access control."
  - "It does not change permissions: users who already have access can still open the content, and sharing links keep working."
  - "It is a site-level setting meant as a temporary step while you fix the real sharing problem or run a phased Copilot rollout."
  - "It needs SharePoint Advanced Management and a Copilot license in the organization, and sites with over 500,000 items can take more than a week to update."
  - "For real protection use restricted access control, and use discovery limits only for the time you need to clean up permissions."
faq:
  - q: "What does Restricted Content Discovery do in SharePoint?"
    a: "It limits the discovery of a site's content in organization-wide search and in Microsoft Copilot responses. It also removes AI entry points on the site, such as the Copilot button. It does not change permissions, so people who already have access can still open the files directly. Microsoft describes it as a site-level, temporary control."
  - q: "Is Restricted Content Discovery the same as restricted access control?"
    a: "No. Restricted Content Discovery only removes a site from broad discovery in search and Copilot, and permissions and sharing links still work. Restricted access control closes access itself, because users outside the named groups lose access even if they have permissions or a link. Use the first to hide, the second to protect."
  - q: "How long does it take for Restricted Content Discovery to work?"
    a: "It depends on the site size. Updates must spread across indexing systems. For most sites it is quick, but Microsoft says that sites with more than 500,000 items can take more than a week to fully reflect in search and Copilot. If a site still appears, allow time and check the item count."
---

Restricted Content Discovery hides a SharePoint site's content from organization-wide search and from Copilot's broad discovery, but it does not change who can open the files. That is what it hides and what it does not. This article is for SharePoint admins who must decide when this setting helps and when it only gives a false sense of safety. You will learn what Microsoft says it does, what it leaves untouched, how to turn it on, how it differs from restricted access control, and see a worked example.

## What is Restricted Content Discovery in SharePoint?

Microsoft's page on [restricting discovery of SharePoint sites and content](https://learn.microsoft.com/en-us/sharepoint/restricted-content-discovery) describes the feature. It limits the discovery of a site's content, including recently used files, in organization-wide search and in Microsoft Copilot responses. Organization-wide search covers places such as the SharePoint home page, Office.com and Bing.

It also removes some AI entry points on the site: the Copilot button, the AI actions menus, including creating agents, and the option to create pages with AI.

Two points set the frame:

- It is a **site-level** setting. You turn it on for a site, not for the whole tenant.
- Microsoft intends it as a **temporary** governance control, for example during reviews or phased Copilot rollouts.

So think of [Restricted Content Discovery](https://www.m365.fm/entity/restricted-content-discovery/) as a way to buy time. A site you have flagged drops out of broad discovery while you fix its sharing problem.

## What does it not do?

This is the part that surprises people. Microsoft's page lists what stays the same:

- It does not change permissions. Users who already have access can still open the content directly.
- It does not remove content from the Microsoft 365 search index.
- It does not affect Microsoft Purview capabilities such as eDiscovery and auto-labeling.
- It does not apply to OneDrive sites. It supports SharePoint sites only.
- It does not affect searches from site context, or intelligent experiences such as the Microsoft 365 feed and recommendations.
- It does not affect experiences that work on content the user already has in use, such as summarizing an open document.

Microsoft's [training module on the topic](https://learn.microsoft.com/en-us/training/modules/govern-sharepoint-onedrive-copilot/6-restricted-content-discovery) adds two points. The feature is not an access control, and it does not check for or revoke Anyone links or Everyone except external users sharing, which is often what makes a site overshared. It also still lets Copilot surface content that a user owns or has recently interacted with, even on a restricted site.

The conclusion is simple. If a person can open a file today, Restricted Content Discovery does not stop that person from opening it tomorrow. It only makes the file harder to stumble upon in broad search and in Copilot answers.

## How do you turn it on?

Check the prerequisites first. Microsoft lists a Microsoft Copilot license and [SharePoint Advanced Management](https://www.m365.fm/entity/sharepoint-advanced-management/), including the SharePoint Online PowerShell module and RBAC role assignments. The training module adds that the feature becomes available once at least one user in the organization holds a Microsoft 365 Copilot license. Review your site categories too.

In the SharePoint admin center, go to Sites, then Active sites, select the site, open the Settings tab, turn on Restrict content from Microsoft Copilot and save. In PowerShell, run Set-SPOSite with the site URL and the RestrictContentOrgWideSearch parameter set to true. To remove it, set the parameter to false. To check the status, run Get-SPOSite and select the same property.

Plan for the delay. Updates must spread across indexing systems, so the time depends on site size and activity. Microsoft states that for sites with more than 500,000 items, the update may take more than a week to show fully in search and Copilot. If a site still appears, wait and check the item count before you assume the setting failed.

After you turn the setting on, test it with an ordinary user account. Search for a unique phrase from a file on the site, ask Copilot a question that the file would answer, and note the result. Then ask the same question from inside the site, where site-context search still works. This test shows you the real behavior in your tenant and gives you something to show the site owner. Repeat it after the update has had time to spread, because the first result may still be stale.

## Who can manage it, and how do you report on it?

By default, only SharePoint administrators can manage the setting. You can delegate it to site administrators with the DelegateRestrictedContentDiscoverabilityManagement setting in Set-SPOTenant. Site administrators who change the setting must give a justification. Enabling, disabling and the justifications are logged as Microsoft Purview audit log activities.

For a tenant-wide view, Microsoft documents a report. You start it with Start-SPORestrictedContentDiscoverabilityReport, check its status with Get-SPORestrictedContentDiscoverabilityReport, and download the finished report by report ID. Keep the report with your exception list, so that every restricted site has an owner and an end date.

## Restricted Content Discovery vs restricted access control

These two features are often confused. The difference is the question they answer.

- **Restricted Content Discovery** answers: should this site appear in broad search and in Copilot's broad discovery? It changes visibility only.
- **Restricted access control** answers: who may reach this site at all? Microsoft's page on [restricting site access with groups](https://learn.microsoft.com/en-us/sharepoint/restricted-access-control) says users outside the named groups cannot access the site or its content, even if they had permissions or a sharing link.

Microsoft's training module states it clearly: RAC closes access itself, while RCD only removes the site from discovery. It also notes that RAC is a site-by-site and group-by-group control, so it does not scale well to dozens of overshared sites, and it is often stricter than those sites need. For that case, the module suggests a lighter tenant-wide control over search and Copilot visibility as a complement.

This choice is part of your wider [Copilot governance](https://www.m365.fm/entity/copilot-governance/) plan. A good rule: use RAC for sites that hold truly confidential content, such as a due diligence site. Use RCD for sites that you cannot fix yet but want out of broad discovery in the meantime.

## Example: 40 flagged sites, three tools

The numbers are invented to show the method. A company with 600 SharePoint sites plans a Copilot rollout in three months. A data access governance report flags 40 sites with broad access, such as Everyone except external users.

The SharePoint admin sorts the 40 sites:

1. **6 sites hold confidential content**, such as legal and M&A. Use restricted access control with a named group for each. The access is closed, not only hidden.
2. **24 sites are old project sites** that nobody uses. Turn on Restricted Content Discovery now, so they drop out of broad search and Copilot, and ask owners to archive or fix them within 60 days.
3. **10 sites are active but overshared**, such as team sites with company-wide access. Ask owners to remove broad groups and replace links. Use Restricted Content Discovery only as a bridge for the first weeks.

After 60 days, the admin checks the report. 18 of the 24 old sites were archived, and 6 got new owners and were cleaned up. The RCD setting is removed from those 6 once their permissions are fixed. For the 10 active sites, the owners removed the broad groups on 8, and 2 remain flagged.

Count the effect. Of the 40 sites, 6 are protected by RAC, 18 are archived, 14 are cleaned up and 2 remain on the list. RCD was never the final answer for any site. It was a tool for the weeks in between.

## Common mistakes

- **Treating RCD as security.** It hides, but it does not close access.
- **Leaving it on forever.** Microsoft describes it as temporary, so set an end date for every site.
- **Expecting an instant effect.** Large sites can take more than a week.
- **Forgetting OneDrive.** The feature supports SharePoint sites only.
- **Skipping the sharing fix.** The Anyone links and company-wide groups stay in place until you remove them.
- **No report.** Without the tenant report, nobody knows which sites are restricted.

## How software can help

The built-in route is the SharePoint admin center, the PowerShell cmdlets and the tenant report for restricted sites. For a larger tenant, a script can join the report with site owners, last activity and sharing links, so that each restricted site has a named owner and a review date. Compare the output of any tool with the report from Microsoft on a few sites before you rely on it.

## Next step

List the sites that you plan to hide with Restricted Content Discovery in SharePoint, and write an owner and an end date next to each one. Then start with the site that would cause the most trouble if Copilot surfaced it tomorrow.
