---
title: "“Everyone except external users”: the permission that exposes more than you think"
summary: "The 'Everyone except external users' claim can quietly make SharePoint sites and libraries visible to your whole organization. Learn how it differs from group-based access, why it matters for Copilot, and how to review it."
status: review
publish: false
author: mirko-p
date: 2026-11-16
topics: [everyone-except-external-users, oversharing, sharepoint-permissions]
faq:
  - q: "What does 'Everyone except external users' mean in SharePoint?"
    a: "It is a built-in claim that includes every internal user in your tenant. If it is added to a site, library or folder, all internal users can reach that content at the granted permission level. External users and guests are not included, but everyone inside the organization is."
  - q: "Is 'Everyone except external users' the same as a sharing link for people in your organization?"
    a: "No. A sharing link of type People in your organization is created for a single file or folder. The claim is a permission entry that can be granted on a site, library or folder. Both can broaden access internally, but they are managed in different places, so review both."
  - q: "Why does this matter for Microsoft 365 Copilot?"
    a: "AI assistants like Copilot can surface content that users already have access to. If a site is broadly visible inside the organization, its files can show up in answers for many people. Reviewing broad access beforehand can help avoid surprises. Check Microsoft Learn for current Copilot guidance."
---

Most SharePoint admins know the risk of an "Anyone" link. Fewer pay attention to a quieter entry in a permissions list: "Everyone except external users". It looks like a group name, it sounds harmless, and it can make a site visible to every internal user in your tenant.

This article explains what the claim is, how it differs from other ways of granting access, why it matters more once AI assistants are in the picture, and how to review it carefully.

## What "Everyone except external users" actually is

[Everyone except external users](https://www.m365.fm/entity/everyone-except-external-users/) (often shortened to EEEU) is a built-in claim in SharePoint and Microsoft 365. It is not a group you create and maintain. It represents every internal user of your tenant.

The important part is the scope. If you grant this claim access to a site, a library or a folder, then every internal user can reach that content at the permission level you granted. There is no membership list to check and no owner who approved individual people. The claim itself is the audience.

External users are excluded, which is where the name comes from. That can give a false sense of safety: "nobody outside the company can see it" is true, but "everyone inside the company can see it" is often not what the content owner intended.

## How it differs from normal SharePoint permissions

To see why this claim stands out, it helps to recall how [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) are meant to work. Microsoft Learn describes the model by site type:

- **Team sites** are connected to a Microsoft 365 group by default. Group owners become site owners and group members become site members.
- **Communication sites** are not connected to a Microsoft 365 group. They use the standard SharePoint groups Owners, Members and Visitors.
- **Private and shared channel sites** have their permissions managed in Teams.

On a team site, the three groups map to the permission levels Full Control (Owners), Edit (Members) and Read (Visitors). A Microsoft 365 group has no view-only access, so people who should only read must be added directly to the Visitors group. Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible, and advises against nested security groups because of possible performance problems.

In that model, access is tied to named people or groups that someone can review. Permissions on a site, group or team give access to all content in it. The EEEU claim bypasses this idea of a defined audience: instead of a group with members, you grant access to "everybody inside".

For single files and folders, SharePoint also offers sharing links of three types: Anyone, People in your organization and Specific people. A "People in your organization" link is created for one item and is a different mechanism from the EEEU claim. Both can broaden internal access, but they live in different places, so a review of one does not cover the other.

## Why it matters for oversharing and Copilot

[Oversharing](https://www.m365.fm/entity/oversharing/) means content is shared more broadly than intended, for example through organization-wide or anonymous links. Granting the EEEU claim on a site or library is another way to reach a similar result: content becomes broadly visible inside the organization, and it can go unnoticed because the claim does not appear in the member list of a Microsoft 365 group.

For years, a broadly accessible but rarely visited library could sit unnoticed. People simply did not find it. AI assistants like Copilot change that: they can surface content that a user already has access to. A file that nobody ever browsed to may now appear in an answer because the user technically has permission.

This does not mean the assistant breaks permissions. It means the existing permissions are suddenly much more visible. If the permission was broader than the content owner intended, the AI assistant makes that gap easier to notice. Treat this as a reason to review access before and during a rollout, and check Microsoft Learn for current guidance on Copilot and data governance.

## Imagine a typical scenario

Imagine a team site for the HR department. Years ago, someone granted "Everyone except external users" read access to one library so that a policy document could be shared with all staff. Later, the team started using that same library for draft contracts and salary-related spreadsheets, because it was convenient and the library was already set up.

Nobody revisited the permissions. On paper, the site is owned by HR and looks private. In practice, every internal user can open the library. The site's member list does not reveal this, because the claim is not a member of the Microsoft 365 group.

This is a hypothetical example, but the pattern is easy to recognize: access that was meant for one document ends up covering everything in the container, because permissions apply to all content in it.

## How to review it carefully

A review has three goals: find where the claim is used, decide whether the broad access is intended, and replace it where it is not.

1. **Find it.** Look at the permissions of your sites, libraries and folders, and check whether the EEEU claim appears. Check Microsoft Learn for the SharePoint admin tools and reporting available for this in your tenant, as these options change over time.
2. **Classify the content.** For each place, ask whether the content is truly meant for everyone inside the organization. Company-wide announcements and general policies often are. Project files and HR or finance material usually are not.
3. **Replace with a defined audience.** Where broad access is not intended, use the Microsoft 365 group or team, or the SharePoint groups Owners, Members and Visitors, as Microsoft recommends. People who should only read can be added to the Visitors group.
4. **Keep intended broad access intentional.** If a site is meant to be open to all internal users, document that decision and keep the content on that site limited to material that fits.

Before you change anything, note that removing or changing permissions can cut off people who legitimately rely on the access. Test the change on a pilot site first, and make sure you can restore the previous state, for example by recording the existing permission settings beforehand. Do not roll out bulk permission changes without a tested way back.

Some organizations use third-party tools to inventory and report on permissions across many sites. These are one option among others and sit alongside the native Microsoft features, which should be your starting point. Cognillo, for example, offers the SharePoint Essentials Toolkit; see [www.cognillo.com](https://www.cognillo.com) for details.

## Practical takeaways

- Treat "Everyone except external users" as "every internal user", not as a small or harmless group.
- Check where the claim appears on sites, libraries and folders. It will not show up in the member list of a Microsoft 365 group.
- Review sharing links separately. "People in your organization" links are a different mechanism and need their own review.
- Prefer permissions through the Microsoft 365 group or team, and the Owners, Members and Visitors groups, as described on [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions).
- Review access before rolling out AI assistants like Copilot, since they can surface content users already have access to.
- Test permission changes on a pilot site first and keep a record or backup so you can go back.
- Where broad internal access is intended, make it a documented decision and keep sensitive material elsewhere.
