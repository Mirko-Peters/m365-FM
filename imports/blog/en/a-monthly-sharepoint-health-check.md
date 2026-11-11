---
title: "A monthly SharePoint health check"
summary: "A monthly SharePoint health check gives owners a light routine: review ownership, sharing and oversharing signals, and reports, then record decisions so governance stays a habit, not a project."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [sharepoint-governance, sharepoint-reporting, oversharing]
faq:
  - q: "How often should a SharePoint health check run?"
    a: "Microsoft's data access governance guidance recommends snapshot reports quarterly and activity reports monthly. A monthly check fits the activity reports, and a deeper permissions review can follow the quarterly snapshot. Adjust the rhythm to your risk level and team capacity, and check Microsoft Learn for current guidance."
  - q: "Which reports can I use for a SharePoint health check?"
    a: "Microsoft Learn describes data access governance reports in the SharePoint admin center, which need SharePoint Advanced Management and the SharePoint administrator role. A site admin can also create a CSV report on file and folder sharing for a single site or OneDrive."
  - q: "What does oversharing mean in Microsoft 365?"
    a: "Oversharing means content is shared more broadly than intended, for example through organization-wide or anonymous links. It matters more with AI assistants like Copilot, which can surface content that users can already access, so a regular review of sharing helps."
---

Most SharePoint environments do not break in one dramatic moment. They drift. A site loses its owner, a sharing link stays active long after the project ended, a team site gets opened up "just for now". Each step is small. Together they change who can see what.

A monthly health check is a way to catch that drift while it is still small. This article describes a short, repeatable routine built on documented Microsoft 365 features. It is a starting point you can adapt, not a fixed standard.

## Why a monthly rhythm works

[SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) is, in Microsoft's general definition, the set of policies, roles, responsibilities and processes that control how an organization works with a platform. For SharePoint in Microsoft 365, the Microsoft Learn [intranet governance guide](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) adds practical points: start governance planning early, review it regularly, and keep a governance team of business and IT people in place after launch. The business is responsible, not IT alone.

A policy on paper does not tell you whether reality still matches it. A regular check does. The point of a monthly rhythm is not to audit everything. It is to look at a small, fixed set of signals and decide what needs attention.

Keep the check short. A routine that takes half a day is more likely to be skipped than one that takes about an hour.

## Step 1: Check ownership

Ownership is the foundation. The intranet governance guide suggests defining ownership of sites, for example with a primary and a secondary contact per site. When both are gone, nobody can answer the question "should this still be shared?"

Imagine a team site created for a project two years ago. The project lead has left the company and the only other owner was the same person. The site still holds documents and a few sharing links. Nobody feels responsible, so nobody reviews it.

For your monthly check, look for:

- Sites with no active owner or only one owner
- Sites that nobody has used for a long time
- Sites whose purpose you cannot name

For each one, decide: assign a new owner, archive, or ask the business whether the site is still needed. Record the decision. Do not delete anything during the check itself; test any later cleanup on a pilot site first and make sure you have a backup or a way back.

## Step 2: Use the built-in reports

SharePoint offers two kinds of built-in [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) for permissions and sharing, described on Microsoft Learn.

**Data access governance reports.** You find them in the SharePoint admin center under Reports, Data access governance. They need SharePoint Advanced Management and the SharePoint administrator role. According to [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports), snapshot reports show data as of the day they were created, for example site permissions across the organization and sensitivity labels applied to files. Activity reports cover the last 28 days, for example sharing links and content shared with "Everyone except external users".

Microsoft recommends running snapshot reports quarterly and activity reports monthly. That maps neatly onto a monthly routine: activity reports every month, a snapshot every third month.

One detail matters for planning: data collection pauses if no report is generated for three months. If you skip the routine for a quarter, data collection pauses, so the data may have a gap. Check Microsoft Learn for the current behaviour before you rely on this.

**The site-level CSV report.** A site admin can create a CSV file of every unique file, user, permission and link on a SharePoint site or OneDrive, as described on the [sharing reports page](https://learn.microsoft.com/en-us/sharepoint/sharing-reports). The file is saved on the site. Know its limits: it does not include Anyone links or links that were e-mailed but not clicked, and it shows SharePoint groups but not the individual people inside them. Microsoft suggests saving the file in a folder that only site owners can access. For wider analysis, the page points to Microsoft Graph Data Connect.

Use the CSV report selectively, for example for a site that the organization-wide report flagged.

## Step 3: Look for oversharing

[Oversharing](https://www.m365.fm/entity/oversharing/) means content in Microsoft 365 is shared more broadly than intended, for example through organization-wide or anonymous links. It has become a more visible topic because AI assistants like Copilot can surface content to users who can already access it. A file that was technically reachable but practically unnoticed can become easy to find.

That is why the activity report on content shared with "Everyone except external users" is a useful monthly signal. Ask yourself:

- Is this site meant to be visible to the whole organization?
- Does it contain material that should be limited to a team?
- Who owns it, and can they confirm the sharing was intended?

Imagine a finance team site where a folder was shared with everyone in the organization to help a colleague, and the link was never removed. A report entry on content shared with "Everyone except external users" could point to it. The owner confirms it was temporary and the link can be reviewed.

The Microsoft Learn overview of [SharePoint Advanced Management](https://learn.microsoft.com/en-us/sharepoint/advanced-management) groups its tools in three areas: content sprawl, the content lifecycle and oversharing. If you have the licence, it is worth reading which tools apply to the issues you found. Check Microsoft Learn for current licensing and feature details.

## Step 4: Fix with care, then document

Finding a problem is the easy part. Changing access can break things, so treat every fix as a change.

Before you remove sharing links, change permissions, break or restore inheritance, or run bulk changes with PowerShell:

- **Test first** on a pilot site or in a test tenant, so you understand the effect.
- **Have a way back.** Note the current state, for example by keeping the report you used, so you can restore access if a team loses something it needs.
- **Talk to the site owner** before you remove access. A link that looks forgotten may support a running process.

Then record what you decided. A simple log is enough: date, site, finding, decision, who is responsible. The intranet governance guide describes policies as requirements and guidelines as recommendations, and notes that policies work best when site owners do not have to think about them, for example through site designs. If you see the same issue every month, that is a sign to turn a manual fix into a policy or a template.

Microsoft also notes that a review cycle can be automated, for example with Power Automate. Once your routine is stable, consider automating reminders to site owners. Keep the human decision in the loop for anything that changes access.

## Practical takeaways

- Run a short check every month and keep it to about an hour, so it actually happens.
- Check ownership first: every site should have a primary and a secondary contact.
- Use data access governance reports: activity reports monthly, snapshot reports quarterly, as Microsoft recommends. They require SharePoint Advanced Management and the SharePoint administrator role.
- Do not let the routine lapse: data collection pauses if no report is generated for three months.
- Use the site-level CSV report for single sites, and remember it does not show Anyone links, unclicked e-mailed links or the people inside SharePoint groups. Store it where only site owners can reach it.
- Treat content shared with "Everyone except external users" as a monthly review item, especially with Copilot in mind.
- Test every access change on a pilot site or test tenant first, and keep a way back.
- Log your decisions, and turn repeated fixes into policies, templates or automated reviews.
- Verify the details against Microsoft Learn, because features and licensing can change.
