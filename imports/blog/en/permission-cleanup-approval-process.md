---
title: "Who approves a permission cleanup? A simple decision process"
summary: "A permission cleanup approval process in three lanes: who decides, what an approver needs to see, how site owners review access and how to tell users first."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [decision-rights, sharepoint-permissions, sharepoint-governance, least-privilege]
keypoints:
  - "Cleanups stall because nobody knows who may approve the removal of access, so the first fix is to write down who decides what."
  - "Split cleanup work into three lanes by risk: pre-approved routine removals, assessed changes with a named approver, and expedited changes with a review afterward."
  - "ITIL-style change enablement assigns approval by risk and delegates low-risk decisions instead of sending every change to one central board."
  - "Site owners know their people, so Microsoft's site access review lets administrators delegate the review while administrators track the status."
  - "Every removal needs a record of what was removed and why, a notice to affected users, and an easy way to request access back."
faq:
  - q: "Who should approve a SharePoint permission cleanup?"
    a: "It depends on risk. Site owners can usually approve removing stale access on their own sites, an administrator approves tenant-wide or bulk changes, and security or compliance should approve anything touching sensitive data. Write these decision rights down once, so that each request has a named approver and no cleanup waits for a meeting."
  - q: "Does every permission removal need a change request?"
    a: "No. ITIL-style practice treats routine, low-risk changes with a known procedure as standard changes that are pre-approved, so each instance runs without a new assessment. Define which removals qualify, for example removing a departed employee, and keep formal approval for broader or riskier changes."
  - q: "How do I tell users that their access is being removed?"
    a: "Tell them before, not after. Say what is changing, why, when it happens and how to ask for access back, and name a contact. Keep the message short and consistent. Record what was removed, so that you can restore access quickly if someone proves they need it."
---

A permission cleanup approval process answers one question that quietly blocks most access cleanups: who is allowed to say yes? This guide is for IT managers who know that old permissions should go but cannot get a decision. You will see why cleanups stall, how to sort them into three lanes by risk, who can decide in each lane, what an approver needs to see, how site owners can review access, and how to tell users. A worked example with made-up numbers shows a simple version a small team can adopt in a week.

## Why cleanups stall at the approval step

The technical part of a cleanup is often easy. You can list stale entries with a script or a report. The hard part is deciding who may remove it. Administrators worry that removing a person's rights will break a project. Site owners worry that they will be blamed. Managers do not want another meeting. So the report sits in a folder.

A decision process fixes this by removing guesswork. It states which removals are routine, which need a look, and who decides each one. It is a small piece of [SharePoint governance](https://www.m365.fm/entity/sharepoint-governance/), and it connects directly to [decision rights](https://www.m365.fm/entity/decision-rights/): who may decide, who may approve and who may override.

The goal is not to add bureaucracy. The goal is speed with control, so that low-risk work moves quickly and higher-risk work gets the attention it needs. A scheduled review, with a clear path from findings to decision, keeps the backlog from growing again.

## A permission cleanup approval process in three lanes

You do not have to invent the structure. IT service management already sorts changes by risk. The Faddom overview of [ITIL change types](https://faddom.com/itil-change-management-types-standard-vs-normal-vs-emergency/) describes three:

- **Standard change.** A low-risk, routine change with a known, trusted procedure and a predictable outcome. It is pre-approved, so each instance runs without a new assessment, although monitoring and review still apply.
- **Normal change.** A non-emergency change with significant scope or impact. It needs assessment and formal authorization, and it can be approved, rejected or sent back for more information.
- **Emergency change.** An urgent change to resolve a major incident or a critical security problem. It gets expedited approval from a designated authority and a review afterward.

The itsm.tools guide to [change enablement](https://itsm.tools/change-enablement/) explains the idea behind it. ITIL 4 introduces a change authority that decentralizes decisions, so not every change needs a central board. Low-risk changes can be approved automatically or by delegated authorities, with approval assigned by risk. The aim, in the guide's words, is to balance speed and stability.

Translate that to access cleanup:

1. **Routine lane (pre-approved).** Removing the access of a person who has left, removing an expired guest, or removing an individual user from a site where the same person already has access through a group. Write the procedure once, approve it once, and let administrators run it.
2. **Reviewed lane (named approver).** Removing a department's access, breaking up a large group, or removing company-wide access from a site that people use. A site owner or the administrator reviews each case and approves or declines.
3. **Urgent lane (fast, then review).** Removing access to a site that holds sensitive data that is open to everyone. A named person can act at once, and the owner and the security contact are told afterward and review the result.

The lanes are our adaptation, not a Microsoft or ITIL rule. Use them as a starting point, and adjust the thresholds to your own risk.

## Who decides what

Write the decision rights in a short list. A version for a small team might read like this:

- **Site owner:** decides on removing individual members from their own site, and confirms the review of their own site's access.
- **SharePoint administrator:** signs off on bulk deletions of access and tenant-wide changes, and runs the routine lane.
- **Security or compliance contact:** decides on any removal or retention question that touches sensitive data, and on any exception to a rule.
- **IT manager:** accountable for the process, settles disputes, and reviews the numbers each month.

In identity terms, each permission is an entitlement, and a user often holds the same entitlement twice: once directly and once through a group membership. Review entitlements and group memberships together, whether the group lives in Microsoft Entra or is synced from Active Directory, because removing the direct entry changes nothing if the membership still grants the right.

Keep one accountable name per decision. If two people can both sign off and neither does, you are back where you started. Link the list to your principle of [least privilege](https://www.m365.fm/entity/least-privilege/): the default answer is that access that is not needed goes, and the burden is on the person who wants to keep it.

## What an approver needs to see

An approver can decide in a minute if the request is complete. Use a short template:

- **Where:** the site or library, and its owner.
- **What:** which user, group or link, and what level of [permission](https://www.m365.fm/entity/sharepoint-permissions/) it grants.
- **Why:** the reason it is a candidate, such as no activity for a year, a departed employee, or company-wide rights on a site with confidential files.
- **Risk:** what could break, and who might notice.
- **Undo:** how you will restore the access, and where the previous state is recorded.

The undo line matters most. If the previous state is stored in a system of record, a wrong removal is a five-minute fix, and the approver can say yes more easily. Treat the stored state as audit evidence, too: it shows who decided what, and when.

Ask for a business purpose whenever someone wants to keep access that looks unused or stale. Access with no stated business need can be revoked, and the person can send an access request if the need turns out to be real. Seen over the whole access lifecycle, from provision to review to revoke, a cleanup is the review step that keeps the process honest, and it limits the damage if an account is ever breached.

## Let site owners review their own access

Site owners know who should be on their site, and administrators often do not. Treat their review as the core of your routine. Microsoft's page on [site access reviews](https://learn.microsoft.com/sharepoint/site-access-review) describes a way to delegate this. Administrators start the review from data access governance reports in the SharePoint admin center and send it to the owners of the flagged sites. Microsoft notes that administrators cannot see file-level details for compliance reasons, which is why the review is delegated. Reviews can cover sharing links, content shared with everyone except external users, and the oversharing baseline report.

The page also gives limits: up to 100 sites per batch from the report view, and up to 1,000 site access reviews per calendar month from the site permissions report. Owners can remove users from groups, remove sharing links and adjust permissions, then complete the review with a comment. Administrators track each review as pending, completed or failed, and a completed review records the reviewer's name, the time and the comments. The feature needs SharePoint Advanced Management, so check your licensing first.

Use the owner's answer as the sign-off for the reviewed lane. The owner decided, the record shows it, and the administrator did the work.

## Tell users before you remove access

Communication is part of the process, not an extra. A short notice before the change avoids angry calls afterward:

- **What** is changing, in one sentence.
- **Why**, in plain words.
- **When** it takes effect.
- **How** to ask for access back, and whom to contact.

Send it to the site owner and to the affected users, and keep the tone calm. Give a short window for objections on reviewed items. For routine items, such as a departed employee, no notice to the person is needed, but the owner should still see the change.

## Example: a one-week setup

The numbers are made up.

An IT manager has a backlog of 600 stale access entries across 80 sites. Nothing moves, because every removal triggers an email thread.

On Monday she writes the three lanes and the decision list on one page. Of the 600 entries, 340 are leavers and expired guests. They go in the routine lane and are removed by an administrator over two days, with the previous state exported first. Another 230 are individual users whose entitlement also comes through a group membership. She sends them to the owners as a review, and 190 are approved within a week. The remaining 30 involve company-wide rights on sites with salary and contract files. The security contact approves them, and the administrator removes the entries the same day, and the owners are told afterward.

By Friday, 560 of 600 entries are closed. Three users ask to get their rights back, and the administrator restores them from the record within an hour. The manager keeps the page and reviews the counts every month.

## Common mistakes

- **Sending everything to one board.** Low-risk work waits for no reason.
- **Having no named approver.** Requests sit unanswered.
- **Approving without a record.** You cannot undo what you did not write down.
- **Skipping the notice.** Users find out when something fails.
- **Treating owners as bystanders.** They know the people and the work.
- **Making exceptions without an end date.** Temporary access becomes permanent.

## How software can help

Start with what Microsoft 365 provides: data access governance reports and site access reviews in the SharePoint admin center, if you have SharePoint Advanced Management. A script that exports permissions before a change gives you the undo record. For the approval workflow itself, a shared list, your ticket system or Power Automate can route requests and keep a log. Choose the simplest option your team will actually use.

## Next step

Take your next ten cleanup candidates and sort each into the routine, reviewed or urgent lane, naming an approver for each. Then share the one-page result with your administrators and owners, and use it as your permission cleanup approval process from the next request on.
