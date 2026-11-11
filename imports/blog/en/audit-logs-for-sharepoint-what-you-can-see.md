---
title: "Audit logs for SharePoint: what you can see"
summary: "Audit logs show who did what and when in SharePoint. This guide explains what they record, how they support investigations and governance, and what they cannot tell you on their own."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [audit-logs, sharepoint-governance]
faq:
  - q: "What do audit logs for SharePoint show?"
    a: "Audit logs are records of who did what and when in a system. For SharePoint, they help answer questions such as who accessed, changed or shared content. The exact list of recorded events, search options and retention periods depends on your Microsoft 365 licensing and settings, so check Microsoft Learn."
  - q: "Are audit logs only useful for security incidents?"
    a: "No. Security investigations and compliance are the classic uses, but audit records also support governance. They can help you check whether sharing rules are followed, whether sites have active owners and whether policies match real behaviour. They show activity, but they do not replace policies or reviews."
  - q: "Do audit logs replace SharePoint governance?"
    a: "No. Governance defines policies, roles, responsibilities and processes. Audit logs are evidence about what happened. They help you check and improve governance, but someone still has to decide the rules, assign site owners and act on what the records show."
---

[Audit logs](https://www.m365.fm/entity/audit-logs/) are records of who did what and when in a system. They are used for security investigations and for compliance. In SharePoint, they can help you see what happened to content, sites and sharing, rather than relying on what you assume happened.

This article explains what kinds of questions audit records can help with, how to approach a search, and where their limits are. It also shows how they fit with [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/). Exact event names, retention periods and licensing requirements change over time, so verify those details on Microsoft Learn for your tenant.

## What an audit record is, and what it is not

An audit record is a log entry. At its core it answers a small set of questions: who performed an action, what the action was, which item or site it affected, and when it happened. That is the idea behind any audit trail, in SharePoint or elsewhere.

Three things are worth keeping in mind from the start:

- **A record shows activity, not intent.** If someone shared a folder, the log can show the sharing action. It cannot tell you whether that was a mistake, a business need or something malicious.
- **A record is only evidence.** It does not prevent anything. Policies, permissions and site design prevent problems; audit records help you find out afterwards, or check regularly, whether those controls work.
- **A record depends on what is captured.** Which events are recorded, how long they are kept and how you can search them depend on your Microsoft 365 setup and licensing. Check Microsoft Learn before you promise anyone an answer, for example "we can look back a year".

If you start from this understanding, you avoid the most common disappointment: expecting the log to explain why something happened.

## The kinds of questions you can ask about SharePoint

It helps to sort your questions into groups before you open any search tool. For SharePoint, the useful groups are usually these.

**Access questions.** Who opened or downloaded a file or visited a site? Imagine a project site containing a draft contract. Someone asks whether a person outside the project team opened it. This is an access question, and the audit record is the natural place to look.

**Change questions.** Who edited, renamed, moved or deleted an item? Imagine a document library where a folder has suddenly disappeared. You want to know who removed it and when, so you can decide whether to restore it. Restoring content is a change in itself, so test the process on a pilot site first and make sure you know your recovery options before you touch production content.

**Sharing and permission questions.** Who created a sharing link? Who was invited? Who changed permissions on a site or library? Imagine a team site where the owner says only members have access, but a colleague reports seeing the content through a link. Audit records can help you trace how that link came to exist, subject to what is recorded in your tenant.

**Administration questions.** Who changed a site setting, added an owner or altered a policy? These matter most when several admins work in the same environment and nobody remembers who did what.

Naming the group first narrows your search and makes the results easier to read. A search for "everything this user did last month" tends to produce more noise than insight.

## How to approach an investigation

Whether you work in the Microsoft Purview portal or with other tools, a structured approach saves time. The exact search interface and options change, so confirm the current steps on Microsoft Learn. The approach itself stays stable.

1. **Write the question in one sentence.** For example: "Who created the external sharing link for the Finance Q3 folder?"
2. **Define the scope.** Which site, library or user is involved? Which time window is plausible? A narrow scope returns fewer, more relevant entries.
3. **Pick the activity types.** Search for sharing actions rather than every action on the site.
4. **Read the results in sequence.** Sort by time. A single entry rarely tells the story; the sequence of entries around it usually does.
5. **Note what you cannot see.** If the log does not cover the period or the event, write that down. A documented gap is better than a guess.
6. **Keep a record of your own findings.** For anything that might become an HR, legal or security matter, follow your organisation's process and involve the right people before drawing conclusions.

A practical tip: agree in advance who is allowed to search audit records and for what purposes. Audit data can reveal what individual people did, so access to it is itself something to govern and, ideally, to document.

## Audit logs and SharePoint governance

Microsoft describes governance as the set of policies, roles, responsibilities and processes that control how an organisation uses a technology. For SharePoint in Microsoft 365, the Microsoft Learn guide on [intranet governance](https://learn.microsoft.com/en-us/sharepoint/intranet-governance) recommends starting governance planning early and reviewing it regularly. It also says the business is responsible, not IT alone, and that a governance team should stay in place after launch.

Audit records fit into this in a specific way: they let you check whether the rules you wrote match what people do.

Consider a few of the topics the guide names:

- **External sharing.** A policy might say that external sharing is allowed only for certain sites. Audit records on sharing activity can help you see whether sharing happens elsewhere, and who is doing it. That tells you whether the policy needs better configuration, better communication or both.
- **Site ownership.** The guide suggests defining ownership, for example with a primary and a secondary contact per site. Audit records of administrative changes may show when owners were added or removed, which can help you keep that list accurate. Which events are recorded depends on your setup, so check Microsoft Learn.
- **Review cycles.** The guide mentions that a review cycle can be automated, for example with Power Automate. Audit records can be one input for such reviews, because activity data may help show which sites are actively used and which are not, depending on what is recorded in your tenant.
- **Policies that owners do not have to think about.** The guide notes that policies work best when site owners do not have to think about them, for instance through site designs. If audit records show repeated deviations, that may be a sign that a policy depends too much on individual effort.

Microsoft also offers SharePoint Advanced Management, with tools in three areas: content sprawl, the content lifecycle and oversharing. These address related concerns from a different angle. Read the [SharePoint Advanced Management documentation](https://learn.microsoft.com/en-us/sharepoint/advanced-management) to see how they relate to audit records and what requirements apply in your tenant. For a general introduction, see [what governance in SharePoint means](https://learn.microsoft.com/en-us/sharepoint/governance/what-is-governance-in-sharepoint).

The point is not that audit logs replace any of this. They are the feedback loop. Policies and roles set the direction; audit records tell you whether you are heading there.

## Limits and common pitfalls

A few cautions will save you from wrong conclusions.

**Volume.** SharePoint activity can generate a lot of entries. Without a clear question and filters, you can drown in detail. Start narrow and widen only if needed.

**Context.** A log entry says what happened, not the circumstances. A deletion might be routine clean-up or a mistake. Talk to the site owner before assuming anything.

**Retention and coverage.** You cannot search for something that was never recorded or is no longer kept. Find out how long records are retained in your tenant and whether that is long enough for your compliance needs. Microsoft Learn is the reference for current retention behaviour, which can depend on licensing.

**Privacy and purpose.** Audit data relates to named people. Define who may look at it, for what reasons, and how findings are handled. Involve your works council, data protection officer or legal team where your organisation requires it.

**Acting on findings.** If an audit search leads you to change permissions, remove sharing links, delete content or run bulk changes, treat that as a separate, risky step. Test the change on a pilot site or in a test tenant first, and make sure you have a backup or another way back. Permission and sharing changes can lock people out or expose content in ways that are hard to undo.

## Practical takeaways

- **Start with a question, not a search.** Decide whether you are asking about access, change, sharing or administration, and narrow the scope before you search.
- **Treat audit records as evidence, not explanation.** They show actions. Intent and context come from people.
- **Check the details for your tenant.** Recorded events, retention periods and licensing requirements are documented on Microsoft Learn and can change.
- **Tie audit review to governance.** Use records to check external sharing, site ownership and review cycles against your written policies, and adjust the policies or their implementation when reality differs.
- **Define who may search and why.** Audit data is sensitive. Document access and purpose.
- **Test before you act.** Any permission change, deletion, restore or bulk action that follows an audit finding should go through a pilot site or test tenant first, with a backup or way back in place.
- **Review regularly.** Governance is not a one-off project. A recurring check of audit records, ideally with a defined owner, keeps it connected to what actually happens in SharePoint.
