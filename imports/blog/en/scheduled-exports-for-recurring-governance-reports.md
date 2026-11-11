---
title: "Scheduled exports for recurring governance reports"
summary: "Recurring governance reports are easier to keep up when you schedule the rhythm yourself. See what SharePoint's built-in reports cover, where they stop, and how Power Automate can help with the review cycle."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [sharepoint-reporting, power-automate, sharepoint-governance]
faq:
  - q: "Can I schedule the data access governance reports in SharePoint?"
    a: "Microsoft Learn describes the reports as ones you generate in the SharePoint admin center and recommends a rhythm: snapshot reports quarterly, activity reports monthly. The Microsoft Learn pages on these reports do not describe a built-in scheduler, so check Microsoft Learn for the current state. A calendar reminder or a flow can support the routine."
  - q: "What do the data access governance reports need?"
    a: "According to Microsoft Learn, the data access governance reports in the SharePoint admin center need SharePoint Advanced Management and the SharePoint administrator role. Snapshot reports show data as of the day they were created. Activity reports cover the last 28 days. Data collection pauses if no report is generated for three months."
  - q: "What does the single-site sharing report not include?"
    a: "The CSV report a site admin can create for a SharePoint site or OneDrive lists unique files, users, permissions and links. Microsoft Learn notes that it does not include Anyone links or links that were e-mailed but not clicked. It also shows SharePoint groups, but not the individual people inside them."
---

A governance problem is often not a missing report but a report that nobody looked at in time. Permissions grow, links pile up, and by the time someone asks "who can access this?", the last overview is months old.

A recurring export, review and follow-up routine turns reporting from a one-off task into a habit. This article looks at what Microsoft's built-in [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) offers, where its limits are, and how [Power Automate](https://www.m365.fm/entity/power-automate/) can support a regular review cycle.

## What the built-in reports give you

Microsoft Learn describes two kinds of built-in reports for permissions and sharing.

The first are the **data access governance reports** in the SharePoint admin center (Reports, Data access governance). They need SharePoint Advanced Management and the SharePoint administrator role. There are two flavours:

- **Snapshot reports** show data as of the day they were created. The page names site permissions across the organization and sensitivity labels applied to files.
- **Activity reports** cover the last 28 days. The page names sharing links and content shared with "Everyone except external users".

The second is a **report for a single site**. A site admin can create a CSV file of every unique file, user, permission and link on a SharePoint site or OneDrive. The file is saved on the site.

Both are useful for different questions. The organization-wide reports help you spot where to look. The single-site CSV helps you go deep on one site, for example before an access review with the site owner.

## Know the limits before you build a routine

A routine built on a report is only as good as the report's coverage. Microsoft Learn names several limits.

The single-site CSV report does not include Anyone links or links that were e-mailed but not clicked. It shows SharePoint groups, but not the individual people inside them. If your review depends on knowing exactly who is in a group, you need a second step for that, for example checking the group membership separately.

The CSV file lists who can access what, which can be sensitive. Microsoft suggests saving it in a folder that only site owners can access. Treat the exports like any other governance data: restrict access and decide how long you keep them.

For wider analysis across many sites, the Learn page points to Microsoft Graph Data Connect. Whether that fits your needs, your licensing and your skills is something to check in the current Microsoft documentation before you plan around it.

## Set a rhythm that matches the reports

Microsoft recommends generating snapshot reports quarterly and activity reports monthly. That is a good starting point for a calendar.

There is also a practical reason to keep to it: according to Microsoft Learn, data collection for the data access governance reports pauses if no report is generated for three months. A missed cycle is therefore not just a gap in your records: data collection pauses, so the data itself may have a gap.

Imagine an IT team that agrees on this simple rhythm:

- First week of each month: generate the activity report and review the sharing links and "Everyone except external users" content.
- First week of each quarter: generate the snapshot report and review site permissions and sensitivity label coverage.
- Before an access review for a specific site: create the single-site CSV and share it with the site owners in a restricted folder.

This is a hypothetical example, and your own rhythm may differ. The point is that each report has a named moment, a named person and a place where the result is stored.

## Where governance comes in

A report without a decision is just a file. This is where [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) matters. Microsoft's intranet governance guidance for SharePoint in Microsoft 365 says to start governance planning early and review it regularly. A governance team should include business and IT and stay in place after launch. The business is responsible, not IT alone.

Applied to reporting, that means a few questions need an answer before the first export is even created:

- **Who reviews the report?** IT can produce the data, but the business decides whether a sharing setup is acceptable.
- **Who owns each site?** Microsoft's guidance suggests defining ownership, for example with a primary and a secondary contact per site. Without that, a finding has nowhere to go.
- **What counts as a policy and what as a guideline?** The guidance distinguishes policies as requirements and guidelines as recommendations. Your review needs to know which one a finding violates.
- **What happens after a finding?** Define whether the answer is "leave as is", "ask the owner", or "change the setting", and who may make that change.

The guidance also names topics such as external sharing, default sharing links and metadata as areas a governance plan should cover. Those are exactly the areas the reports surface.

## Using Power Automate to keep the cycle going

Microsoft's intranet governance guidance notes that a review cycle can be automated, for example with Power Automate. Power Automate is a service for automating workflows between apps and services. Cloud flows react to triggers such as a new email or a SharePoint item.

One option is to automate the **follow-up around** the report, not necessarily the report generation itself. Whether and how a specific report can be generated by a flow depends on the current product capabilities, so check Microsoft Learn before you design around that.

Imagine a flow that runs on a monthly schedule and creates a task or a SharePoint list item for the governance owner: "Generate and review the monthly activity report." When the item is completed, a second step could notify the site owners who need to act on findings. Another variant could create a review item per site owner after the quarterly snapshot report.

Such a flow does not make decisions. It is designed to help make sure the reminder, the owner and the record exist, which can help when the routine tends to be forgotten.

If a flow touches permissions, deletes content or changes settings, treat it as a risky change. Build and test it first in a pilot site or test tenant, and make sure you have a backup or a way back before it runs on production data. For reminders and task creation, the risk is low, but the same habit of testing first is worth keeping.

## Practical takeaways

- Use the built-in reports first. Data access governance reports need SharePoint Advanced Management and the SharePoint administrator role.
- Plan the rhythm Microsoft recommends: snapshot reports quarterly, activity reports monthly. Do not let three months pass without a report, because data collection pauses.
- Use the single-site CSV report for deep dives, and remember its limits: no Anyone links, no un-clicked e-mailed links, no individual members of SharePoint groups.
- Store exports in a restricted location, for example a folder only site owners can access, and decide how long to keep them.
- Define owners before you review: a primary and a secondary contact per site, and a business decision-maker, not IT alone.
- Write down which findings break a policy and which only break a guideline, and what the follow-up action is.
- Use Power Automate for reminders, tasks and review records. Test any flow that changes access or content in a pilot site or test tenant first, and keep a way back.
- Check the Microsoft Learn pages on [data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) and [sharing reports](https://learn.microsoft.com/en-us/sharepoint/sharing-reports) regularly, because features and requirements can change.
