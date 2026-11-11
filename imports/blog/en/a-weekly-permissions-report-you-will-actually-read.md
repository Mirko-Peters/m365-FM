---
title: "A weekly permissions report you will actually read"
summary: "A permissions report only helps if someone reads it. Learn how to combine built-in SharePoint reports with a simple weekly routine, including a Power Automate reminder, so permission drift gets noticed early."
status: review
publish: false
author: mirko-p
date: 2026-11-24
topics: [sharepoint-reporting, sharepoint-permissions, power-automate]
faq:
  - q: "Which built-in SharePoint reports help with permissions and sharing?"
    a: "Microsoft Learn describes two kinds. Data access governance reports in the SharePoint admin center cover the organization and need SharePoint Advanced Management and the SharePoint administrator role. A site admin can also create a CSV report of files, users, permissions and links for a single site or OneDrive."
  - q: "How often should I run SharePoint data access governance reports?"
    a: "Microsoft recommends snapshot reports quarterly and activity reports monthly. Activity reports cover the last 28 days. Data collection pauses if no report is generated for three months, so a regular schedule matters. A weekly routine can still review the latest available report."
  - q: "Does the single-site CSV report show everything about sharing?"
    a: "No. According to Microsoft Learn, it does not include Anyone links or links that were e-mailed but not clicked. It shows SharePoint groups but not the individual people inside them. Treat it as a useful starting point and check Microsoft Learn for the current scope."
---

Imagine an organization that cares about SharePoint permissions and has at least one report somewhere. It was generated once, perhaps during an audit or a cleanup, and then it sat in a folder. The problem in such a case is often not missing data. The problem is that nobody has a reason to open the report again.

This article looks at how to build a small, repeatable routine around the built-in [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/) options, so that a weekly look at permissions and sharing takes minutes, not hours. It also shows where [Power Automate](https://www.m365.fm/entity/power-automate/) can help with reminders, and where the built-in reports have limits you should know about.

## What the built-in reports actually give you

Microsoft Learn describes two kinds of built-in reports for permissions and sharing.

**Data access governance reports** live in the SharePoint admin center under Reports, Data access governance. They need SharePoint Advanced Management and the SharePoint administrator role, so check your licensing and role assignments first. They come in two flavors:

- **Snapshot reports** show data as of the day they were created. They cover site permissions across the organization and sensitivity labels applied to files.
- **Activity reports** cover the last 28 days. They cover sharing links and content shared with "Everyone except external users".

**The single-site CSV report** is created by a site admin. It lists every unique file, user, permission and link on a SharePoint site or OneDrive and is saved on the site itself. Microsoft suggests storing it in a folder that only site owners can access, which makes sense: a report about who can see what is itself sensitive.

For wider analysis beyond these reports, the Microsoft Learn page points to Microsoft Graph Data Connect. That is a separate topic and worth reading about on Microsoft Learn if you need organization-wide data in your own analytics tools.

## Know the limits before you trust the numbers

A report you read weekly will shape your decisions, so it helps to know what it does not show. According to Microsoft Learn, the single-site CSV report:

- does not include Anyone links
- does not include links that were e-mailed but not clicked
- shows SharePoint groups, but not the individual people inside them

The last point matters in practice. Imagine a team site where the CSV shows that "Project Alpha Members" has Edit access to a folder. The report tells you the group has access, but you still need to open the group to see who belongs to it. If your review question is "who can edit this folder?", the CSV answers only half of it.

On the organization-wide side, the timing rules matter. Snapshot reports reflect a point in time, so a snapshot from last month will not show a sharing change made yesterday. Activity reports look at a 28-day window. And Microsoft notes that data collection pauses if no report is generated for three months. A routine that quietly stops means the reports lose their value, so build something that notices when it stops.

Details can change, so confirm the current behavior on the [data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) and [sharing reports](https://learn.microsoft.com/en-us/sharepoint/sharing-reports) pages on Microsoft Learn.

## Decide what "worth reading" means

A report is worth reading when it answers a question someone already has. "Here are all permissions" is not a question. "Did anything change that I should know about?" is.

Pick a small set of recurring questions that map to the data the built-in reports provide. Some examples:

- **Which sites have broad sharing?** The activity reports name content shared with "Everyone except external users" and sharing links. Comparing that list over time can help you see whether broad sharing is growing.
- **Where do sensitive files live?** The snapshot report names sensitivity labels applied to files. If your organization uses labels, this helps you see where labeled content sits.
- **Which sites need an owner review?** Site permissions across the organization are covered by the snapshot reports and can serve as a starting point for such a review.

Limit yourself to two or three questions. A weekly routine with ten questions turns into a monthly routine with ten skipped questions.

## Match the rhythm to the report

Microsoft recommends snapshot reports quarterly and activity reports monthly. That is the rhythm for generating them. A weekly routine does not mean generating a new organization-wide report every week. It means a weekly habit of looking at what you already have and acting on it.

A workable split could look like this:

- **Weekly (15 minutes):** open the latest available report, check your two or three standing questions, and note anything unusual. If nothing stands out, write that down too. A record of "nothing found" shows the routine is running.
- **Monthly:** generate the activity report and review sharing links and broad sharing in more depth.
- **Quarterly:** generate the snapshot report and review site permissions and sensitivity label coverage across the organization.
- **Per site, when asked:** a site admin creates the CSV report for a single site or OneDrive, for example before a site owner review.

Because data collection pauses after three months without a report, regularly generating reports matters. Check Microsoft Learn for exactly which report generation resumes or maintains collection. Put them in a shared calendar.

## Use permissions knowledge to read the report faster

A report is easier to read when you know what a normal result looks like. Microsoft Learn describes the model behind [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/): team sites are by default connected to a Microsoft 365 group, where group owners become site owners and group members become site members. Communication sites are not connected to a Microsoft 365 group and use the SharePoint groups Owners, Members and Visitors. For private and shared channel sites, permissions are managed in Teams.

That gives you a baseline. In a team site, the groups have Full Control (Owners), Edit (Members) and Read (Visitors). A Microsoft 365 group has no view-only access, so people who should only read must be added directly to the Visitors group. If your report shows many individual users with direct permissions on a team site, that is worth a question: was there a reason, or did someone work around the group model?

Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible and advises against nested security groups because they can cause performance problems. If the weekly look keeps turning up unusual group structures, those are candidates for cleanup.

Remember also that permissions on a site, group or team give access to all content in it. Single files and folders are shared through Anyone, People in your organization or Specific people links. A site can allow external sharing only if it is allowed at organization level first. When a report shows an unexpected link, these rules help you work out where it came from.

One caution: **fixing what the report finds can change access or remove content.** Removing permissions, breaking inheritance or changing group membership can lock people out or expose data. Try changes on a pilot site first, and make sure you can undo them, for example by noting the previous settings before you change anything. Do not bulk-edit access based on a report alone without that safety net.

## Add a Power Automate reminder, not a report factory

Power Automate is a service for building workflows between apps and services. Cloud flows react to triggers, for example a new email or a new file or SharePoint item. Scheduled triggers are also documented on Microsoft Learn. That makes it a reasonable tool for the *human* part of the routine, the nudge.

Imagine a small flow that runs every Monday morning and posts a message to the governance channel in Teams: "Weekly permissions check: open the latest report, review your three questions, log the result." A second part could create an item in a SharePoint list, with a date, an owner and a result field, so the review leaves a trail.

A few design principles keep it useful:

- **Remind, do not replace.** The flow prompts a person to look. It does not decide anything.
- **Name an owner.** A reminder sent to a whole channel with no owner is easy to ignore. Assign the check to one person or role per week.
- **Track skipped weeks.** If the list item is not completed, a follow-up message can ask why.
- **Keep it read-only.** Avoid flows that change permissions automatically. That kind of automation can lose access or data and needs careful testing in a pilot site or test environment, plus a way back.

What a flow can read from reports, and in which format, depends on the report type, your licensing and your connectors. Check the [Power Automate documentation](https://learn.microsoft.com/power-automate/) on Microsoft Learn before planning anything more ambitious than a reminder.

## Practical takeaways

- Check that you have SharePoint Advanced Management and the SharePoint administrator role before planning around the data access governance reports.
- Generate snapshot reports quarterly and activity reports monthly, as Microsoft recommends, and keep them going so data collection does not pause after three months.
- Choose two or three standing questions. Review those weekly instead of scanning everything.
- Remember the CSV report's limits: no Anyone links, no e-mailed links that were never clicked, and SharePoint groups without their individual members.
- Store site-level CSV reports in a folder only site owners can access.
- Use the permissions model (Microsoft 365 group, Owners, Members, Visitors) as a baseline to spot unusual access.
- Use Power Automate for reminders and a simple review log, not for automatic permission changes.
- Test any access change on a pilot site first and keep a way back.
- Confirm current report behavior on Microsoft Learn, since features and licensing can change.
