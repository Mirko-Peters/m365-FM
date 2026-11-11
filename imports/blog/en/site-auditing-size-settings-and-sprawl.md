---
title: "Site auditing: size, settings and sprawl"
summary: "A site audit in SharePoint covers three things: how big a site is, how it is configured and whether it is part of the sprawl. Here is how to use governance, built-in reports and lifecycle rules to review it."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [sharepoint-governance, sharepoint-reporting, content-lifecycle-management]
faq:
  - q: "What should a SharePoint site audit cover?"
    a: "A useful audit looks at size and growth, settings such as sharing and permissions, and ownership. It also asks whether the site is still needed. Microsoft Learn names external sharing, default sharing links, metadata and site ownership as governance topics, so those are sensible starting points."
  - q: "How often should I run SharePoint permission and sharing reports?"
    a: "Microsoft recommends running snapshot reports in Data access governance quarterly and activity reports monthly. These reports require SharePoint Advanced Management and the SharePoint administrator role. Data collection pauses if no report is generated for three months, so check Microsoft Learn for current details."
  - q: "Does the single-site sharing report show everything?"
    a: "No. The CSV report a site admin can create lists unique files, users, permissions and links, but it does not include Anyone links or links that were e-mailed but not clicked. It shows SharePoint groups, not the individual people inside them. Plan for those gaps when you interpret the results."
---

Most SharePoint tenants grow faster than anyone reviews them. Sites are created, shared and then forgotten. A site audit is how you find out what you actually have.

"Audit" can mean different things, so this article splits it into three angles: size, settings and sprawl. Each uses different tools, and each needs an owner who acts on the results.

## Why audit at all: governance gives the audit a purpose

An audit without rules produces a list of observations and no decisions. That is where [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/) comes in. Microsoft describes governance in general as the set of policies, roles, responsibilities and processes that control how an organization's business divisions and IT teams work together. For SharePoint in Microsoft 365, the Microsoft Learn guide on [intranet governance](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) adds practical points:

- Start governance planning early and review it regularly.
- A governance team should include business and IT and stay in place after launch.
- The business is responsible, not IT alone.
- Policies are requirements; guidelines are recommendations.

Before you audit, decide which of your rules are policies and which are guidelines. A site that breaks a policy needs action. A site that ignores a guideline might only need a conversation.

## Angle one: size

Size is an angle that is easy to misread. A large site is not automatically a problem, and a small one is not automatically healthy.

Useful size questions include:

- Which sites are growing quickly compared with the rest of your tenant?
- Which large sites have little recent activity?
- Which sites hold content that nobody has opened for a long time?

Microsoft groups the tools in SharePoint Advanced Management into three areas: content sprawl, the content lifecycle and oversharing. Which of these areas is most relevant to size questions depends on your tenant. Check Microsoft Learn on [SharePoint Advanced Management](https://learn.microsoft.com/en-us/sharepoint/advanced-management) for the current feature list and licensing requirements before you plan around any of them.

Imagine a project site that was active for one year and has been quiet since. It still holds many files and is still in search results. Size alone does not tell you what to do with it. You need the owner, the last activity and the lifecycle rules for the site type. That leads to the next two angles.

## Angle two: settings

Settings are where an audit finds risk. Microsoft Learn names external sharing, default sharing links and metadata as governance topics. Those are good starting points for a settings review.

Two built-in report types help here, both described under [SharePoint reporting](https://www.m365.fm/entity/sharepoint-reporting/).

**Data access governance reports (organization-wide).** You find them in the SharePoint admin center under Reports, Data access governance. They need SharePoint Advanced Management and the SharePoint administrator role. The two types behave differently:

- **Snapshot reports** show data as of the day they were created. Microsoft Learn names site permissions across the organization and sensitivity labels applied to files.
- **Activity reports** cover the last 28 days. Microsoft Learn names sharing links and content shared with "Everyone except external users".

Microsoft recommends snapshot reports quarterly and activity reports monthly. Note that data collection pauses if no report is generated for three months.

**The single-site CSV report.** A site admin can create a CSV file listing every unique file, user, permission and link on a SharePoint site or OneDrive. The file is saved on the site, and Microsoft suggests keeping it in a folder that only site owners can access.

Know its limits before you rely on it:

- It does not include Anyone links.
- It does not include links that were e-mailed but not clicked.
- It shows SharePoint groups, but not the individual people inside them.

If you need wider analysis than these reports offer, the Microsoft Learn page points to Microsoft Graph Data Connect.

One practical note: the CSV contains sensitive information about who can reach what. Treat the file like the data it describes.

## Angle three: sprawl

Sprawl means sites and content that exist without a clear purpose or owner. It is rarely one big mistake. It is the sum of many small decisions: a team site created for a short project, a channel site nobody archived, a shared library that grew without structure.

Governance gives you two levers against sprawl, both named in the Microsoft Learn guide:

- **Ownership.** Define site ownership, for example with a primary and a secondary contact per site. A secondary contact gives the site a second person to ask when the primary contact is unavailable or has left.
- **Creation model.** Sites can be created by request or by self-service. Request-based creation gives you a checkpoint; self-service gives you speed. Neither is right for every organization, and many combine them by site type.

Microsoft also notes that policies work best when site owners do not have to think about them, for example through site designs. The idea is that owners follow rules more easily when they do not have to remember them.

Imagine you audit your tenant and find a group of sites with no recent activity and a single owner who has left the company. Without a secondary contact, nobody can answer "do we still need this?" That one finding shows why ownership belongs in governance and not only in the audit.

## Turning findings into decisions with lifecycle rules

Findings only matter if they lead somewhere. [Content lifecycle management](https://www.m365.fm/entity/content-lifecycle-management/) provides the vocabulary: managing documents through defined stages of creation, review, archiving and deletion, with owners, review dates and expiration rules so outdated content does not linger.

For each site you audit, you can land on one of a few outcomes:

1. **Keep as is.** The site is active, owned and configured within policy.
2. **Fix settings.** The site is needed, but sharing or permissions fall outside your policies.
3. **Review with the owner.** The site is quiet; the owner decides whether to continue.
4. **Archive or delete.** The site is no longer needed and your lifecycle rules allow it.

The Microsoft Learn governance guide says a review cycle can be automated, for example with Power Automate. A recurring review that asks owners to confirm their site is still needed is easier to sustain than a one-off clean-up.

**Be careful with outcomes 2 and 4.** Changing permissions, breaking inheritance, deleting sites or running bulk changes can remove access or lose data. Test the change on a pilot site or in a test tenant first, and make sure you have a backup or a way to restore before you touch production. Check Microsoft Learn for the retention and restore options that apply to your tenant, since the way back depends on your configuration.

## Practical takeaways

- Decide your policies and guidelines first, so the audit has a standard to measure against.
- Treat size, settings and sprawl as three separate questions. A large site is not automatically a problem.
- If you have SharePoint Advanced Management and the SharePoint administrator role, run Data access governance snapshot reports quarterly and activity reports monthly, as Microsoft recommends. Do not let three months pass without a report.
- Use the single-site CSV report for detail, and remember what it leaves out: Anyone links, e-mailed links that were not clicked, and the people inside SharePoint groups.
- Store audit exports in a folder that only site owners can access.
- Name a primary and a secondary contact per site, and make the business, not IT alone, responsible for the answers.
- Attach every finding to a lifecycle outcome: keep, fix, review or archive.
- Test any change to permissions, inheritance or site deletion on a pilot site first, and have a backup or restore path ready.
- Verify feature availability, licensing and report details on Microsoft Learn before you build a process around them.
