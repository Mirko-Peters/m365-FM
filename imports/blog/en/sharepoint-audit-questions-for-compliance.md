---
title: "What compliance teams should ask the SharePoint admin before an audit"
summary: "SharePoint audit questions for compliance officers: what to ask the administrator about ownership, sharing, retention, audit logs and evidence before an audit."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [audit-readiness, compliance, sharepoint-governance, audit-logs]
keypoints:
  - "A compliance officer does not need admin rights, but needs clear answers from the SharePoint admin on ownership, access, sharing, retention and logs before an audit."
  - "Microsoft Purview Audit (Standard) keeps records for 180 days by default, while Audit (Premium) keeps SharePoint records for one year, so check that retention covers your audit period."
  - "Sharing events such as link creation do not prove access, because link-use events are logged only when someone actually uses the link."
  - "Retention policies and labels keep or delete content, but conflicts are resolved by rules such as retention beating deletion, so ask which ones apply."
  - "Ask for evidence you can reproduce: a dated export, the person who ran it and the filter used, not a screenshot from memory."
faq:
  - q: "What should a compliance officer ask the SharePoint admin before an audit?"
    a: "Ask who owns each important site, who has access and how that is reviewed, how external sharing is controlled, which retention policies and labels apply, how long audit logs are kept, and how you can reproduce evidence on request. Ask for written answers with dates, so the audit file shows what was true and when."
  - q: "How long does Microsoft keep SharePoint audit logs?"
    a: "According to Microsoft, Audit (Standard) keeps records for 180 days by default. Audit (Premium) keeps Exchange, SharePoint, OneDrive and Microsoft Entra ID records for one year, with longer custom retention available with an add-on license. Check which license applies to your tenant, because the answer decides how far back you can look."
  - q: "Does an audit log show who actually opened a shared file?"
    a: "Only partly. Microsoft notes that link-creation events alone do not show access, and that link-use events such as an anonymous link being used are logged only when someone uses the link. To answer who opened a file, you need the use or access events, so confirm that they are captured and within retention."
---

SharePoint audit questions for compliance teams are best asked early, in writing, and to the person who can actually answer them. This guide is for compliance officers who must show an auditor that SharePoint is under control but do not run the tenant themselves. You will see which questions to put to the SharePoint administrator, grouped by topic: ownership, access and sharing, retention and records, and audit logs and evidence. A worked example with made-up numbers shows how one gap came to light three weeks before an audit instead of during it.

## Before you ask: what an administrator can answer

A SharePoint administrator can tell you how the tenant is configured and can pull reports. The administrator cannot decide what the organization must keep for [compliance](https://www.m365.fm/entity/compliance/), who should have access to payroll files or what your auditor will accept. Those are decisions for the business, and they belong in [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/), not in the administrator's inbox.

So begin by agreeing on scope, because good preparation saves rework later. Which sites hold regulated or sensitive data, for which period and under which rules? Name the audit period, such as the last twelve months. Then ask the questions below for those sites first. This is the practical side of [audit readiness](https://www.m365.fm/entity/audit-readiness/): being able to produce dated, retained evidence without rebuilding it by hand.

Auditors look at the whole SharePoint environment, not one site. A compliance audit usually touches SharePoint security, data security and the compliance standards your organization has signed up to. Preparation should cover the compliance risks that matter most: security risks around sensitive data, data access by many people, and the best practices your own policy sets. Include OneDrive and other workloads if they hold the same data, and treat the work as risk management, not as a one-off security audit of every setting.

Ask for written answers, and ask for dates. A reply such as "yes, we review access" is weak. A reply such as "owners confirmed access on 14 March, and the export is stored here" is evidence.

## SharePoint audit questions for compliance teams: ownership and scope

Start with who answers for each site. Without an owner, every other control has no one to act on it.

1. **Which sites hold regulated or sensitive data, and who owns each one?** Ask for a list with the owner's name, not just a department.
2. **Does every site have at least two owners, and how do you find sites that have none?** A site without a current owner has no one to confirm access.
3. **Who may create sites, and under which rules?** Sprawl makes every later answer harder.
4. **Who holds administrator roles, and are they the least-privileged roles that do the job?** Ask for the list of people with administrator access to SharePoint and the date it was last reviewed. Microsoft recommends using the role with the fewest permissions.
5. **Where are the rules written down?** Ask for the governance policy and its date, and for the names of the people who approve exceptions.

## Ask about access and sharing

Reviewers often start with access, because it is the easiest control to test.

1. **How is access given?** The good answer is groups with an owner, not a long list of individual entries.
2. **How often is access reviewed, and who does it?** Ask for the last completed review and its result. Microsoft's site access review feature lets administrators send a review to the owners of flagged sites, and records who completed it and when, if you use it. Ask whether it is in use.
3. **Is external sharing allowed, for which sites, and with which type of link?** Ask for the tenant setting and any site-level exceptions, and ask which sensitivity labels or access control settings apply to sensitive information on those sites.
4. **Can you list every guest and every "anyone" link on the regulated sites?** Ask for an export with dates.
5. **What happens when someone leaves or changes role?** Ask for the offboarding steps, and for a sample.

Be careful when reading sharing evidence. Microsoft's page on [sharing and access request auditing](https://learn.microsoft.com/purview/audit-log-sharing) lists events such as SharingInvitationCreated, AnonymousLinkCreated and SecureLinkCreated. It notes that link-creation events do not show that anyone used the link, and that link-use events are logged only when someone does. It also says an anonymous link can be copied, so a document with one should be assumed shared with a target user. For compliance, that is the right default: treat any file with an anyone link as widely shared until you know otherwise.

## Ask about retention and records

Retention answers the question "how long do we keep this, and when do we delete it?" Microsoft's page on [retention policies and labels](https://learn.microsoft.com/purview/retention) is the reference. Retention can keep content for a set period, delete it after a set period, or keep it and then delete it. Policies cover SharePoint sites, and labels can be applied to items and set as a default on a library or folder.

Questions to ask:

1. **Which retention rules and labels apply to the regulated sites, and who approved them?** Ask for the list with dates.
2. **Do conflicts exist, and how are they resolved?** Microsoft explains that retention beats deletion and that the longest retention period wins when policies overlap. Ask the administrator to confirm what that means for your sites.
3. **Are there legal holds?** Microsoft states that eDiscovery holds override retention and deletion until released.
4. **Can anyone, including administrators, weaken a policy?** Microsoft describes Preservation Lock, which prevents anyone from turning off or weakening a policy. Ask whether your rules require it.
5. **How long does a change take to apply?** The page says to allow up to seven days for policies and auto-apply labels to take effect, so a policy created the week before an audit may not be in force yet.

If you use records or regulatory records, ask how disposal is documented. Microsoft states that deletions of regulatory records produce proof of disposition for up to seven years.

## Ask about audit logs and evidence

An [audit log](https://www.m365.fm/entity/audit-logs/) is the record that shows what happened, and it forms your audit trail. Microsoft's [auditing overview](https://learn.microsoft.com/purview/audit-solutions-overview) explains the two tiers. Audit (Standard) is enabled by default for organizations with the appropriate subscription and keeps records for 180 days. Audit (Premium) keeps Exchange, SharePoint, OneDrive and Microsoft Entra ID records for one year, allows custom retention up to one year, and supports up to ten years with a per-user add-on license. Records can be searched in the Purview portal, with a PowerShell cmdlet or through the Graph API, and exported to CSV.

Questions to ask:

1. **Is auditing on, and which license applies to us?** The answer sets your look-back period, and Microsoft Purview is where you check it.
2. **Does the retention period cover our audit period?** If the period is twelve months and the log keeps 180 days, you have a gap.
3. **Who may search and export audit records?** Ask for the people and the date of the last review.
4. **Can you reproduce a specific search on request?** Ask for the filter, the date range, the person who ran it and the exported file. Evidence you can reproduce beats a screenshot.
5. **Who looks at the logs between audits?** A log that nobody reads proves little.

Note one more limit from the Microsoft page: logs created before 17 October 2023 were retained for 90 days, not 180. For older questions, confirm what exists.

## Example: a gap found three weeks early

The numbers are made up.

A compliance officer prepares for an audit that covers the last twelve months. She sends the administrator a list of 14 questions and asks for written answers with dates within five days.

The administrator answers 12 of them well. Two answers worry her. The tenant has Audit (Standard) only, so logs reach back 180 days, about six months, and the audit period is twelve months. Also, 9 of the 40 regulated sites have only one owner.

She does not panic. She asks the administrator to price the longer retention and meanwhile exports the sharing and access reports each month, stored with dates. The administrator assigns second owners to the 9 sites within a week and records the date. At the audit, she explains the gap, shows the monthly exports and the ownership fix, and the auditor notes it as an improvement already in progress.

## Common mistakes

- **Asking verbally.** Spoken answers leave no evidence.
- **Asking for everything.** Start with the regulated sites and the audit period.
- **Accepting "we do that" without a date.** Dates turn a claim into proof.
- **Assuming logs go back far enough.** Check the retention against the audit period.
- **Reading a sharing event as proof of access.** Creation events do not show use.
- **Waiting until the audit starts.** Gaps found early can still be fixed.

## How software can help

Start with what Microsoft 365 already provides: the Purview audit search, retention policies and labels, and the access and sharing reports in the SharePoint admin center. A shared list can track your questions, answers, dates and owners, as a simple workflow for your compliance audit file. Scheduled exports can automate the collection of evidence each month, and an alert on key changes helps with audit preparation. If your tenant is large, a reporting tool may save time, but check that its records show dates and sources, and compare it with the built-in options first.

## Next step

Write your first ten questions from the lists above, pick the sites and the audit period they apply to, and send them to your SharePoint administrator this week. Use the written answers as the start of your file of SharePoint audit questions for compliance, and repeat the exercise each quarter.
