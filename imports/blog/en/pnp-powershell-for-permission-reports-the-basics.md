---
title: "PnP PowerShell for permission reports: the basics"
summary: "PnP PowerShell can help you build repeatable SharePoint permission reports, but you need to know what the built-in reports already cover and how to run read-only scripts safely."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [pnp-powershell, sharepoint-permissions, sharepoint-reporting]
faq:
  - q: "Do I need PnP PowerShell if I already have the built-in SharePoint reports?"
    a: "Not always. Microsoft offers Data access governance reports in the SharePoint admin center and a CSV sharing report for a single site. PnP PowerShell is an option when you need a custom or repeatable view, such as a specific list of sites and permission levels. Check Microsoft Learn first for what the built-in reports cover."
  - q: "Is a permission report script safe to run in production?"
    a: "A script that only reads data is generally low risk, but verify that it contains no commands that change anything, and try it on a pilot site first. Scripts that remove permissions or break inheritance can cause data loss or access problems, so always test them and have a way back before using them."
  - q: "Why does my report show a group but not the people inside it?"
    a: "Reports often list the SharePoint group or Microsoft 365 group that holds a permission, not every member. Microsoft's single-site CSV report, for example, shows SharePoint groups but not the individual people inside them. To see members, you need to query the group membership separately."
---

Permission questions in SharePoint tend to arrive suddenly. Someone asks who can access a project site, an auditor wants to know where broad sharing exists, or a site owner suspects that a folder is more open than intended. A report is the usual answer.

[PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/) is one way to build such reports. This article covers the basics: what to understand about the permission model first, what Microsoft already reports on, and how to approach a script safely.

## Understand the permission model before you script

A report is only meaningful if you know what you are looking at. [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) work differently depending on the site type, and Microsoft Learn describes the model by type.

- **Team sites** are by default connected to a Microsoft 365 group. Group owners become site owners, group members become site members.
- **Communication sites** are not connected to a Microsoft 365 group. They use the standard SharePoint groups Owners, Members and Visitors.
- **Private and shared channel sites** have their permissions managed in Teams.

On a team site, the three groups map to the permission levels Full Control (Owners), Edit (Members) and Read (Visitors). A Microsoft 365 group has no view-only access, so people who should only read must be added directly to the Visitors group. Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible, and advises against nested security groups because they can cause performance problems.

Permissions on a site, group or team give access to all content in it. For single files and folders, SharePoint offers sharing links of three types: Anyone, People in your organization and Specific people. External sharing on a site is only possible if it is allowed at organization level first.

Why does this matter for reporting? Because the same question, "who has access?", has several layers: group membership, direct permissions, and sharing links. A good report keeps them apart.

## Check what the built-in reports already cover

Before writing anything, look at what Microsoft provides. [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) offers two kinds of built-in reports for permissions and sharing, according to Microsoft Learn.

**Data access governance reports** live in the SharePoint admin center under Reports, Data access governance. They need SharePoint Advanced Management and the SharePoint administrator role.

- Snapshot reports show data as of the day they were created. The page names site permissions across the organization and sensitivity labels applied to files.
- Activity reports cover the last 28 days. The page names sharing links and content shared with "Everyone except external users".
- Microsoft recommends snapshot reports quarterly and activity reports monthly. Data collection pauses if no report is generated for three months.

**A report for a single site** is a CSV file that a site admin can create. It lists every unique file, user, permission and link on a SharePoint site or OneDrive, and the file is saved on the site. It has limits:

- It does not include Anyone links or links that were e-mailed but not clicked.
- It shows SharePoint groups but not the individual people inside them.

Microsoft suggests saving the file in a folder that only site owners can access. For wider analysis, Microsoft's page points to Microsoft Graph Data Connect.

Details and current requirements are on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports). Check them before you plan, because requirements can change.

## Where PnP PowerShell fits

PnP PowerShell is an open-source PowerShell module maintained by the community. It is designed for managing SharePoint, Teams and Microsoft 365 through Microsoft Graph and CSOM. It is maintained by the community, so treat it as a community tool and read its documentation and release notes before relying on it.

When does a script make sense? Imagine you want a list of all team sites in a defined set, showing the members of each SharePoint group and any item with unique permissions. The built-in reports may give you part of that, but not in the exact shape you need. A script lets you define the scope, the columns and the output format, and run the same query again next month for comparison.

A script is also useful when the answer should feed another process, for example a CSV that a site owner reviews, or a list that you compare against the previous run.

It is not always the right choice. If the built-in report answers your question, using it means less to maintain and no code to review. A script becomes your responsibility: authentication, permissions of the account running it, and keeping it working as the module evolves.

## Start with a read-only report

The safest first script only reads. Reading permissions does not change them, and it gives you a baseline before anything else happens. A typical read-only report might:

1. Connect to a site with an account that has the required rights.
2. Read the site's SharePoint groups and their members.
3. List items or folders that have unique permissions.
4. Write the result to a CSV for review.

This article deliberately does not give exact cmdlet names or parameters, because they depend on the module version and how you authenticate. Use the official PnP PowerShell documentation for the current syntax and sign-in options, and confirm the required permissions for your tenant.

Some practical points for the design:

- **Limit the scope.** Begin with one site, not the whole tenant. Large tenants take time, and mistakes are easier to spot on a small result.
- **Separate layers in the output.** Keep columns for group-based access, direct permissions and sharing links so reviewers can tell them apart.
- **Expand groups deliberately.** Like the single-site CSV, a naive script may only show a group name. Decide whether you need the members, and read them explicitly if so.
- **Protect the output.** Store the report where only the right people can read it, as Microsoft suggests for its own CSV.
- **Record when and how it ran.** Add the date and the script version to the file so you can compare reports later.

## Keep changes separate from reporting

Reports invite action. You find a folder shared too widely, and the next thought is to fix it with the same script. Keep those two things apart.

Anything that deletes content, removes permissions, breaks or restores inheritance, or changes many items at once can lock people out or expose data. Before you run such a change:

- **Test first** on a pilot site or in a test tenant, never directly on production.
- **Have a way back.** Export the current permissions, keep a backup where appropriate, and know how you would restore the previous state.
- **Change in small steps**, with a named owner who has agreed to the change.
- **Review the script line by line.** A copied script that "just reports" may contain a command that modifies something.

A clean habit is to run the report, review the results with the site owner, agree on the change, and only then perform it as a separate, tested step.

## Practical takeaways

- Learn the permission model first: Microsoft 365 group, Owners/Members/Visitors, and sharing links are different layers.
- Check the built-in reports before scripting. Data access governance reports need SharePoint Advanced Management and the SharePoint administrator role; the single-site CSV does not show Anyone links, unclicked e-mailed links or the people inside groups.
- Use PnP PowerShell when you need a custom, repeatable view, and treat it as a community tool that you maintain.
- Start read-only, on one pilot site, and keep the output in a restricted location.
- Get current syntax and sign-in guidance from the official documentation, not from copied snippets.
- Never mix reporting and fixing. Any change to permissions needs testing first and a way back.
- Re-run reports on a schedule, for example in the rhythm Microsoft suggests for its own reports, so you can compare results over time.
