---
title: "A SharePoint governance dashboard: which metrics are worth tracking"
summary: "A SharePoint governance dashboard needs few metrics: ownership, idle sites, oversharing, storage, reviews. See the sources and how to build it in Power BI."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-governance, sharepoint-reporting, power-bi, sharepoint-essentials-toolkit]
keypoints:
  - "A governance dashboard answers five questions: who owns the sites, which sites are idle, who can see what, what is growing, and whether reviews happen."
  - "Microsoft's data access governance reports in the SharePoint admin center give snapshot reports and 28-day activity reports, and they need SharePoint Advanced Management for the full set."
  - "Site lifecycle policies report on ownership, inactivity and attestation, and they can run in simulation mode before you enforce anything."
  - "Microsoft provides a Power BI template app for usage and the Graph Data Connect datasets for custom reports, but no ready-made governance dashboard."
  - "Keep six to eight metrics with an owner and a target each, and refresh them monthly, so the dashboard drives decisions instead of decorating a slide."
faq:
  - q: "What should a SharePoint governance dashboard show?"
    a: "It should show a few metrics that map to decisions: the share of sites with enough owners, inactive sites, sites open to everyone or to external guests, storage growth and the completion of site reviews. Each metric needs a source, a target and a person who acts on it. Avoid raw usage numbers that no one owns."
  - q: "Does Microsoft offer a governance dashboard for SharePoint?"
    a: "Microsoft offers parts of one. The SharePoint admin center has data access governance reports and lifecycle policy reports, and the Microsoft 365 usage analytics template app runs in Power BI. Microsoft Graph Data Connect provides datasets for sites, permissions, groups and files. You combine these sources yourself, because no single ready-made governance dashboard exists in the documentation."
  - q: "How often should I refresh governance metrics?"
    a: "Microsoft suggests running the site permissions snapshot reports quarterly and the sharing links and Everyone except external users activity reports monthly. A monthly refresh of the whole dashboard is a practical rhythm for most teams, because it matches the reporting cycle of leadership and keeps the trend lines comparable from month to month."
---

A SharePoint governance dashboard should show five things: who owns the sites, which sites are idle, who can see what, what is growing, and whether reviews take place. Microsoft provides the data in several places, but not a finished dashboard, so you assemble a small set of metrics, give each one a target and an owner, and refresh them every month. This guide is for the IT manager who has to report on SharePoint to leadership and wants metrics that lead to decisions.

## SharePoint governance dashboard: start with five questions

Governance means that people know who is responsible for what, across SharePoint and OneDrive. The entity page on [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) describes it as the policies, roles and processes that control who owns sites, how they are created and shared, and how content is reviewed. A dashboard makes that visible. Start with five questions, and add a metric only if it answers one of them.

1. **Who owns our sites?** Metric: the share of sites with fewer owners than your minimum.
2. **Which sites are idle?** Metric: the number of sites without meaningful activity for a set period.
3. **Who can see what?** Metric: sites open to everyone in the organization or to external guests.
4. **What is growing?** Metric: storage used and its trend.
5. **Are reviews happening?** Metric: the share of site owners who confirmed their site on time.

Each question matches a place in Microsoft 365 where the numbers exist. The next sections show where, and what each source leaves out.

## SharePoint governance metrics worth tracking

A short list works better than a long one. These are the metrics that most teams can fill from Microsoft's own data:

- **Ownership coverage.** Sites with fewer than two owners or site admins, as a percentage of all sites. Microsoft's site ownership policy detects sites with fewer owners than you require.
- **Inactive sites.** Sites without activity for a set period. Microsoft's inactive site policy checks activity across SharePoint and connected workloads such as Teams, Exchange and Viva Engage.
- **Broad access.** Sites with thousands of users, external guests or Everyone except external users permissions. This is what the site permissions snapshot report is designed to find.
- **Sharing activity.** Sites where users created the most sharing links in the last 28 days, including Anyone links.
- **Labeled content.** Sites containing files with a specific sensitivity label.
- **Storage trend.** Storage used and the growth per month, from the storage report.
- **Review completion.** The share of attestation requests answered by owners.
- **Policy outcomes.** How many sites were set to read-only or archived after no response.

Treat the first three as the core. If you track only these, you already see ownership, idleness and exposure, which are the main risks of unmanaged growth.

## Where the data comes from in Microsoft 365: native tools and templates

Four Microsoft sources feed these metrics, and each has limits.

**Data access governance reports.** Microsoft's article on [data access governance reports](https://learn.microsoft.com/en-us/sharepoint/data-access-governance-reports) describes snapshot reports, which show data as of the day they were generated, and activity reports for recent sharing in the last 28 days. You find them in the SharePoint admin center under Reports and Data access governance. The article suggests running the site permissions reports quarterly and the sharing links and Everyone except external users reports monthly. It points to SharePoint Advanced Management for the prerequisites. The article also names remedial actions that belong next to the numbers: restricted access control to limit access to a specific group, and a site access review, in which site owners review and update permissions. For Microsoft 365 E5 IT admins, it states that the reports do not include snapshot reports or remedial actions, and the activity reports can return only up to 10,000 sites.

**Site lifecycle policies.** The article on [site lifecycle management](https://learn.microsoft.com/sharepoint/site-lifecycle-management) names the ownership, inactive site and attestation policies. In simulation mode, a policy runs once and creates a report without enforcement. In active mode, it runs on a schedule, generates reports and sends notifications. The reports can include ownership status, activity status, notification history and enforcement actions. The page does not describe a CSV export, so check what the admin center offers in your tenant.

**Usage reports and usage analytics.** The Microsoft 365 admin center has the site usage report with storage, files and last activity per site, as part of your [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/). Microsoft's usage analytics is a template app for Power BI with a prebuilt dashboard that covers the last 12 months and has a separate report for each service, including SharePoint.

**Microsoft Graph Data Connect.** Microsoft's [dataset list](https://learn.microsoft.com/en-us/graph/data-connect-datasets) includes SharePointSites_v1, SharePointPermissions_v1, SharePointGroups_v1 and SharePointFiles_v1. The datasets are copied with Azure Synapse or Azure Data Factory, and Microsoft states that service principal authentication is the only supported mechanism for the copy activity. This is the choice for large tenants and custom reports, and it needs more setup than the other sources.

## Governance plan: who decides what the dashboard measures

A dashboard works only if someone owns the decisions behind it. Microsoft's guidance on [planning intranet governance](https://learn.microsoft.com/sharepoint/intranet-governance) recommends a governance team with core members from the key business stakeholder groups as well as IT, and it says the team should not be disbanded at launch. The page lists 11 elements that a governance plan should consider at minimum, among them policies and guidelines, site provisioning and decommissioning, roles and responsibilities, security and measurement. It also separates the two terms: users are expected to meet policies without deviation, while guidelines are more like recommendations. One example policy on the page says that all SharePoint sites have a primary and a secondary contact, which is the same rule as the ownership coverage metric above.

The page also names a decision that changes your numbers: who can create a new site. A request process keeps the environment tidy but can frustrate users if the approval takes too long. Self-service creation with site designs needs follow-up, and Microsoft says to track new sites in the admin center so that you can contact their owners. For measurement, the page suggests looking beyond page views, and it asks you to review the plan and the policies regularly.

## External sharing and guest access: what to track

Broad access is the metric where policy and data meet. Microsoft's article on [sharing and collaboration options](https://learn.microsoft.com/sharepoint/collaboration-options) describes four organization-level levels: Anyone, New and existing guests, Existing guests and Only people in your organization. The tenant setting is the default for sites. Individual sites can be locked down further but cannot be more permissive, and the OneDrive setting cannot be more permissive than the SharePoint setting. Microsoft does not recommend the Existing guests level, because guests can be added to the directory in other ways. The page recommends leaving external sharing enabled, since it can be more secure and governable than email attachments, and it names no level beyond that.

Decide the tenant level first. Then let the dashboard show which sites use Anyone links or guest access, so that oversharing becomes a number that an owner can act on.

## SharePoint admin dashboard in Power BI: how to build it

Most teams do not need a big data project. A monthly routine is enough to start:

1. Pick six to eight metrics from the list above and write down the definition of each.
2. Export the data once a month: the site list, the usage report, and the reports from the data access governance and lifecycle pages.
3. Save every export as a dated file in one library, and never overwrite old ones.
4. Load the files into [Power BI](https://www.m365.fm/entity/power-bi/) as one table per source, with the snapshot date as a column.
5. Build one page: six numbers at the top, a trend line per metric, and a top 10 list of sites to act on.
6. Share the page with leadership, and give every metric a named owner.

Two cautions apply. First, usage reports hide usernames and site names by default, so decide who may see the names before you build the page. Second, a snapshot differs from an activity report: a snapshot shows the status on its date, and an activity report covers the last 28 days. Do not mix them in one trend line without a label.

## Targets and owners: governance best practices

A metric without a target is only a number. These example targets are practice recommendations, not Microsoft benchmarks:

- **Ownership coverage:** every site has at least two owners, and the gap closes by a fixed amount each month.
- **Inactive sites:** every inactive site has an owner decision within 30 days.
- **Broad access:** every site open to everyone has a documented reason.
- **Review completion:** 90 percent of owners answer within the notification period.

Each target needs a person. The owner of ownership coverage is usually the SharePoint admin, while the owner of broad access is the security lead. The IT manager's job is to review the dashboard monthly and to decide what happens when a target is missed.

## Example: 800 sites over three months

This example uses invented numbers. A company has 800 sites. In month 0, the dashboard shows 168 sites with fewer than two owners, which is 21 percent of 800. It also shows 140 inactive sites and 36 sites open to everyone in the organization.

After three months of owner requests and a simulation of the lifecycle policies, the numbers are 72 sites with fewer than two owners, 110 inactive sites and 12 sites open to everyone.

- **Ownership:** 168 − 72 = 96 sites fixed, which is about 57 percent of the original 168, and the share falls from 21 percent to 9 percent of 800.
- **Inactive sites:** 140 − 110 = 30 sites decided.
- **Broad access:** 36 − 12 = 24 sites closed or documented.

The check: the share of 72 sites out of 800 is 9 percent. The IT manager sees that ownership improved fastest and that the inactive sites still need a decision process, so the next quarter's target focuses on those.

## Common mistakes

- **Tracking too many metrics.** More than eight numbers make the dashboard unreadable. Start with five questions.
- **Showing usage without decisions.** Page views alone do not tell anyone what to do.
- **Mixing snapshot and activity data.** The two cover different time frames, so label them.
- **Skipping the owner.** A metric without a named person never improves.
- **Overwriting old exports.** Without dated snapshots, there is no trend.

## How software can help

Microsoft's reports and Power BI cover a first version of the dashboard. If your team wants monitoring and exports without building the pipeline, a tool can help. One example is Cognillo's [SharePoint Essentials Toolkit](https://www.m365.fm/entity/sharepoint-essentials-toolkit/). According to the vendor's product page, its governance functions include monitors, a dashboard, a monitor for permission changes, e-mail notifications and a monitor for storage growth, and reports can be scheduled and exported to SharePoint, by e-mail, or to Excel or CSV. These are the vendor's statements, and M365.FM has not tested them. Compare the metrics of any tool with your five questions before you decide.

Disclosure: Cognillo sponsors M365.FM.

## Next step

Write down your five governance questions this week and pick one metric for each. Then build the first version of your SharePoint governance dashboard from a single month of exports, and present it to the people who own the targets.
