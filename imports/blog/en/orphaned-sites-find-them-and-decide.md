---
title: "Orphaned sites: find them and decide"
summary: "Orphaned SharePoint and Teams sites keep content and permissions after their owners leave. Learn how to find them, decide what to do with each one, and use site lifecycle policies to keep new ones from piling up."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [orphaned-sites, sharepoint-site-lifecycle]
faq:
  - q: "What is an orphaned site in SharePoint?"
    a: "An orphaned site is a SharePoint or Teams site that no longer has an active owner, typically because the original owner left the organization. The content and permissions remain in the tenant, but nobody is clearly responsible for reviewing access or deciding whether the site is still needed."
  - q: "Does SharePoint site lifecycle management delete orphaned sites?"
    a: "No. Microsoft states that site lifecycle management policies do not delete SharePoint sites directly. Depending on configuration, a policy can take no action, set a site to read-only, or archive it with Microsoft 365 Archive after a configurable read-only period. Disabling a policy does not undo actions already taken."
  - q: "Should I delete an ownerless site right away?"
    a: "Usually not. First check whether the site still has content, members or activity, and who could take over. Deleting or restoring sites can lose data or change access, so test the process on a pilot site first and make sure you have a backup or a way back."
---

When an employee leaves, their account is usually handled by a defined process. Their sites often are not. A team site created years ago may still be there, with its documents, its members and its permissions, but without anyone who feels responsible for it.

These are [orphaned sites](https://www.m365.fm/entity/orphaned-sites/): SharePoint or Teams sites that no longer have an active owner, typically because the original owner left the organization. The content and permissions remain in the tenant. This article explains how to approach them: find them, decide what to do with each one, and reduce the number of new ones.

## Why ownerless sites matter

A site without an owner is not automatically a problem, but it removes the person who would normally answer the important questions. Is this content still needed? Who should have access? Who approves a request to join?

Imagine a project site from a finished project. Three people from the original team still have access. One of them has since moved to another department. Nobody reviews the membership, and nobody would notice if the site were shared more widely than intended. The site is quiet, but it is not harmless.

The opposite case exists too. Imagine a site whose owner left, but whose document library is still used every week by a small group of members. Calling that site "abandoned" because it has no owner would be wrong. This is why finding orphaned sites is only the first half of the job. The second half is deciding, site by site.

## How to find orphaned sites

The starting point is the information you already have, such as the SharePoint admin center, where active sites and their owners are listed, and Microsoft 365 usage reporting. Microsoft Learn describes the current options and their limits, so check there which reports and filters your licensing and tenant settings give you. A good entry point is the [SharePoint documentation on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/).

Some practical angles to look at:

- **Sites with no owner or no active owner.** The owner account may be disabled or removed.
- **Sites with a single owner.** These are the next candidates to become orphaned, because one departure is enough.
- **Sites with no recent activity.** Inactivity alone does not prove a site is unneeded, but it helps you prioritize.
- **Teams-connected sites.** A Teams team is backed by a Microsoft 365 group, so check how ownership is handled for the team and its site together.

Treat the result as a candidate list, not a deletion list. A site on the list has earned a closer look, nothing more.

## Decide: what to check before you act

For each candidate, collect a few facts before choosing an action. You do not need a heavy process. A short checklist is enough:

1. **Content.** What is stored there? Is it a working area, a record that must be retained, or leftover material?
2. **Members and access.** Who can open the site today? Is sharing with external users or large groups involved?
3. **Activity.** Is anyone still using it, in SharePoint or in connected workloads such as Teams?
4. **Possible new owner.** Is there a manager, a team lead or a current member who can take responsibility?
5. **Retention or legal requirements.** Does your organization have rules that apply to this content? Check these with the responsible people before anything is removed.

The outcome usually falls into one of these categories:

- **Keep and reassign.** The site is used. Assign at least one, ideally two, current owners.
- **Keep, but restrict.** The content must stay, but few people need access. Reduce the membership.
- **Read-only or archive.** The content has value, but the site is no longer worked in.
- **Delete.** The content is confirmed unneeded and no retention requirement applies.

Be careful with the last option and with anything that changes access.

> **Test first, keep a way back.** Deleting a site, removing permissions, restoring a site or applying changes in bulk can lose data or change who has access. Try your process on a pilot site or in a test tenant first, and make sure you have a backup or a documented way to recover. Check Microsoft Learn for the current retention and recovery behaviour of deleted sites before you rely on it.

## Prevent new orphans with site lifecycle policies

Cleaning up once helps, but the problem returns unless ownership is checked continuously. This is what the [SharePoint site lifecycle](https://www.m365.fm/entity/sharepoint-site-lifecycle/) policies in SharePoint Advanced Management are designed for. Microsoft Learn describes them as policies that automate governance so that sites stay active, properly owned and regularly reviewed. There are three policy types:

- **Site ownership policy.** Makes sure a site has a minimum number of owners or admins, for example at least two.
- **Inactive site policy.** Detects sites without meaningful activity across SharePoint and connected workloads such as Teams, Exchange and Viva Engage.
- **Site attestation policy.** Asks at regular intervals for an explicit confirmation that the site is still needed.

The ownership policy speaks most directly to the orphan problem, since a minimum number of owners means one departure does not leave a site without anyone. The inactive site and attestation policies help you find sites where nobody can say whether the content still matters.

These features belong to [SharePoint Advanced Management](https://learn.microsoft.com/en-us/sharepoint/advanced-management). Licensing and availability can change, so check Microsoft Learn for the requirements that apply to your tenant.

## How the policies behave, and what they do not do

Understanding the mechanics helps you set expectations with your organization.

A policy can run in **simulation mode**, where it runs once and creates a report. This is a sensible first step: you see what the policy would find before anyone receives a notification. In **active mode**, the policy runs regularly, creates reports and sends notifications. Recipients can respond from the e-mail, for example by confirming that the site is still in use.

If nobody responds after several notices, the policy can take no action, set the site to read-only, or archive it after a configurable read-only period with Microsoft 365 Archive.

Two points deserve attention:

- Microsoft states: "Site lifecycle management policies don't delete SharePoint sites directly." The policies are about keeping sites owned, active and reviewed, not about automatic deletion.
- Disabling or deleting a policy stops future actions but does not undo actions already taken. If a policy has already set sites to read-only or archived them, you need to deal with those sites separately.

Because setting a site to read-only or archiving it changes how people can work, start in simulation mode, then try active mode on a limited scope or a pilot group first. Make sure site owners and members know to expect the notifications, and that someone knows how to reverse an action if a site was affected by mistake. The details are on the [site lifecycle management page on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/site-lifecycle-management).

## Practical takeaways

- **Define "orphaned" for your tenant.** For example: no active owner, or fewer than two owners.
- **Build a candidate list, not a delete list.** No owner means "review", not "remove".
- **Check content, access, activity and retention** before choosing keep, reassign, restrict, archive or delete.
- **Assign accountability.** Decide who in your organization makes the final call on ownerless sites.
- **Use lifecycle policies to prevent repeats.** Consider an ownership policy with a minimum number of owners, plus inactive site and attestation policies where they fit.
- **Start in simulation mode** and review the report before enabling notifications or actions.
- **Test first and keep a way back.** Use a pilot site or test tenant and have a backup or recovery option before deleting, restoring, changing permissions or acting in bulk.
- **Check Microsoft Learn** for current licensing, features and recovery behaviour before you finalize the process.
- **Add owner handover to your offboarding checklist**, so ownership of sites is transferred before an account is disabled.
