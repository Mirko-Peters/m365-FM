---
title: "Site access reviews: how to run one"
summary: "Site access reviews let admins hand overshared SharePoint sites to their owners for review. Learn what to prepare, how the flow works, and where it differs from Entra access reviews."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [site-access-reviews, access-reviews, sharepoint-site-owner]
faq:
  - q: "What is the difference between site access reviews and Microsoft Entra access reviews?"
    a: "Site access reviews are a SharePoint Advanced Management feature. Administrators delegate the review of overshared sites, found in data access governance reports, to site owners. Entra access reviews are recurring reviews of access to groups, applications, access packages or privileged roles, with optional automatic removal. They address different scopes."
  - q: "Who should be the reviewer in a site access review?"
    a: "The site owner, because the feature is designed to delegate the review to the people who manage the site. Owners of team sites have Full Control and can manage permissions. Sites without a clear owner are a problem, so check ownership before you start."
  - q: "Should I test a site access review before running it broadly?"
    a: "Yes. Reviews can lead to access being changed or removed, so try the process on a pilot site or in a test tenant first, and make sure you have a way back, such as a record of the original permissions. Check Microsoft Learn for the current behaviour and licensing requirements."
---

Oversharing can be hard to fix from the admin console alone. IT can see that a site is shared widely, but often cannot tell who on the team still needs access and who does not. The site owners are usually closer to that knowledge.

[Site access reviews](https://www.m365.fm/entity/site-access-reviews/) are built around that fact. This article explains what the feature does, how to prepare for it, how a review runs from start to finish, and how it relates to the other review tools in Microsoft 365. Details such as licensing and exact portal options change over time, so check the [Microsoft Learn page on site access reviews](https://learn.microsoft.com/en-us/sharepoint/site-access-review) before you start.

## What a site access review is

A site access review is a feature of SharePoint Advanced Management. It lets administrators delegate the review of overshared sites to the site owners. The sites come from data access governance reports, which are designed to surface sites where content may be shared more widely than intended.

The owners then confirm who should keep access. The idea is simple: instead of IT guessing, the people closest to the content make the call.

An example, clearly hypothetical: imagine a project site created two years ago that still has a large group with access, including people who left the project long ago. A data access governance report flags it. An admin starts a site access review, and the owner of the site gets the task of confirming who should stay.

## Prepare before you start

The review is only as good as the people doing it. Three things are worth sorting out first.

**1. Check that sites have real owners.** On a team site, the Owners group has the Full Control permission level. Microsoft Learn describes its members as people who must be able to manage site permissions, settings and appearance. If the site is connected to a Microsoft 365 group, the group owners are the site owners. The review is delegated to these people, so a site with no active owner is a problem before you even begin.

If you find sites without owners, SharePoint Advanced Management offers a site ownership policy. According to Microsoft, it defines who is responsible for each site, sets minimum owner or admin counts and automates notifications. Whether and how you use it is your decision; see [Microsoft Learn on SharePoint Advanced Management](https://learn.microsoft.com/en-us/sharepoint/advanced-management) for the current scope.

**2. Tell owners what is coming.** [SharePoint site owners](https://www.m365.fm/entity/sharepoint-site-owner/) often have this role as a small part of a bigger job. Microsoft's intranet governance guidance notes that managing a site is often only a small part of an owner's job, and that owner training should include the organization's policies and guidelines. A short message before the review, explaining what they will be asked and why, can prevent confusion.

**3. Decide what "should have access" means.** Owners need a rule of thumb. For example: people who actively work with the content, plus any groups the team agrees on. Write it down in two or three sentences so that owners do not each invent their own standard.

## Run the review

The exact screens depend on your tenant and on current Microsoft documentation, so follow the Learn page for the steps. The general flow looks like this:

1. An administrator works with the data access governance reports to identify overshared sites.
2. The administrator delegates the review of selected sites to the site owners.
3. The owners go through the access list and confirm who should keep access.
4. The administrator checks the outcome and follows up where needed.

Two cautions apply here, because reviews can lead to access being changed or removed.

**Test first.** Run your first review on a pilot site, or in a test tenant, with owners who know it is a trial. Look at what the owners see, how clear the task is and what changes after they respond.

**Keep a way back.** Before a review leads to access changes on a production site, record the current permissions, for example by exporting or documenting who has access to what. If an owner removes the wrong group by mistake, you need to be able to restore the original state. Check Microsoft Learn for the recovery options that apply to your setup.

Start with a small, manageable set of sites rather than everything flagged at once. A small first round shows whether your owners understand the task.

## Follow up on the results

A review is not finished when the owners click through. Plan a short follow-up.

- **Look at non-responses.** Owners who do not react leave the site as it was. Decide in advance what happens then: a reminder, escalation to a manager, or a check by an admin.
- **Check for surprises.** If an owner removes access that clearly should have stayed, find out why. It may point to unclear instructions rather than a careless owner.
- **Fix the cause where you can.** If a site keeps appearing in reports because of a broad sharing setting or a large group that was added years ago, a one-time review treats the symptom. Look at the sharing settings and group structure as well.

Site attestation is a related feature in SharePoint Advanced Management. According to Microsoft, it is a regular review by site owners of whether the site is needed, who its owners and members are, and its permissions and sharing settings. Site access reviews focus on overshared sites from reports, while attestation is a more general regular check-in. Read the Learn pages to decide which fits your situation, or whether you use both.

## How this relates to Entra access reviews

The name is close, but the tools address different things. [Access reviews](https://www.m365.fm/entity/access-reviews/) in Microsoft Entra are recurring reviews that ask designated reviewers whether a person still needs access to a group, application, access package or privileged role. They can optionally apply removals automatically. Microsoft describes them in the [access reviews overview](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview).

In short:

- **Site access reviews** start from overshared SharePoint sites in data access governance reports and delegate the review to site owners.
- **Entra access reviews** are recurring, identity-level reviews of group, application, access package or role membership.

They can complement each other. A SharePoint site whose access comes through a Microsoft 365 group may be affected by both, for example when group membership is reviewed in Entra while an owner reviews the site's overall access. Be careful when running both on the same site: make sure owners and reviewers know which review is which, so they do not get conflicting or duplicate requests. Licensing requirements differ between the features, so check the documentation for each.

## Practical takeaways

- Read the [Microsoft Learn page on site access reviews](https://learn.microsoft.com/en-us/sharepoint/site-access-review) first and confirm that your licensing and tenant setup support it.
- Check ownership before you delegate anything. A review sent to a site without an active owner will not go anywhere.
- Brief owners in a few sentences: what the review asks, why it matters and what counts as "should keep access".
- Pilot on one or two sites, or in a test tenant, before the first broad round.
- Record current permissions beforehand so that a mistaken removal can be reversed.
- Start small, then widen the scope once owners understand the task.
- Plan for non-responses and follow up on the cause of oversharing, not just the symptoms.
- Keep site access reviews and Entra access reviews clearly apart in your communication.
