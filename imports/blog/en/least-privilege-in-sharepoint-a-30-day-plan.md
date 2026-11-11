---
title: "Least privilege in SharePoint: a 30-day plan"
summary: "A practical 30-day plan to apply least privilege in SharePoint: map current access, tighten site permissions, control sharing links, and set up recurring access reviews with Microsoft Entra."
status: review
publish: false
author: mirko-p
date: 2026-11-23
topics: [least-privilege, sharepoint-permissions, access-reviews]
faq:
  - q: "Does least privilege in SharePoint mean everyone gets Read access only?"
    a: "No. It means each person gets the smallest role at the smallest scope for the time they need it. Someone who edits documents daily still needs Edit through the Members group. The goal is to avoid Full Control and broad access where the work does not require it."
  - q: "Where should I manage permissions on a team site?"
    a: "Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible, rather than adding many individual users or nested security groups directly in SharePoint. Because a Microsoft 365 group has no view-only access, people who should only read are added to the Visitors group."
  - q: "Can access reviews remove people from SharePoint sites automatically?"
    a: "Microsoft Entra access reviews can ask reviewers to confirm access to groups, applications, access packages or privileged roles, and can optionally apply removals automatically. For team sites connected to a Microsoft 365 group, that group can be reviewed. Test the configuration on a pilot group first."
---

Access in SharePoint can grow over time. Imagine a project that starts, people are added, a few sharing links are created, and nobody removes anything when the project ends. Over time, a site's content may become reachable by more people than anyone intended.

[Least privilege](https://www.m365.fm/entity/least-privilege/) is the security principle that counters this drift: give an identity the smallest role at the smallest scope for the shortest time that still lets it do its work. If an account is compromised, that limits what an attacker can reach. This article turns the principle into a 30-day plan for SharePoint.

## What least privilege means in SharePoint

Least privilege has three dimensions, and each maps to something you can inspect in SharePoint:

- **Role:** Owners, Members or Visitors, or a sharing link with view or edit rights.
- **Scope:** an entire site, a library, a folder or a single file.
- **Time:** how long the access stays in place.

Scope deserves special attention. According to Microsoft Learn, permissions on a site, group or team give access to all content in it. A person added to a site as a Member can edit everything the Members group can edit, not just the one document they needed. Whenever only a single file or folder needs to be shared, a sharing link is the narrower tool.

Time is easy to neglect: roles and links are granted deliberately, but withdrawing them is often forgotten. That is the gap the last part of this plan addresses.

## Week 1: understand how access works and what you have

Before changing anything, learn how [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) work for each site type. Microsoft Learn describes the model like this:

- **Team sites** are by default connected to a Microsoft 365 group. Group owners become site owners and group members become site members.
- **Communication sites** are not connected to a Microsoft 365 group and use the standard SharePoint groups Owners, Members and Visitors.
- **Private and shared channel sites** have their permissions managed in Teams.

On a team site, the three groups carry the permission levels Full Control (Owners), Edit (Members) and Read (Visitors). Keep this in mind when you review: a person in the Owners group has Full Control over the site, which is rarely what an everyday contributor needs.

For week 1, build a simple inventory instead of fixing things:

1. List your sites and note the site type and the named owners.
2. For a first group of sites, check who sits in Owners, Members and Visitors.
3. Note sites with no clear owner, sites with unusually large Owners groups, and sites where people have been added individually instead of through the group.
4. Check your organization-level sharing settings, because a site can allow external sharing only if it is allowed at organization level first.

Pick a small set of sites as your pilot. A mix works well: one active team site, one communication site and one older site that is rarely used. Everything in the next weeks is tried there first.

## Week 2: tighten roles on the pilot sites

Now apply the principle to roles. Imagine a team site for a product launch with eight people in the Owners group because "it was easier at the start." Most of them edit documents and never change site settings. Under least privilege, one or two named owners keep Full Control, and the rest move to Members.

A few points from Microsoft's guidance help here:

- **Manage access through the Microsoft 365 group or the team where possible.** Microsoft recommends this over many individual entries managed directly in SharePoint.
- **Avoid nested security groups.** Microsoft advises against them because they can cause performance problems.
- **Use Visitors for read-only access.** A Microsoft 365 group has no view-only access, so people who should only read must be added directly to the Visitors group.

Changing roles changes what people can do. Removing a person from a group or lowering a role can lock them out of work they still need, and restoring access later may take time. Always test on the pilot sites first, tell the affected people in advance, and write down the previous membership so you have a way back. If you are unsure how a change behaves, check the current documentation on Microsoft Learn before applying it more widely.

## Week 3: bring sharing links under control

Site membership is only one path to content. Sharing links are the other. SharePoint offers three link types for single files and folders:

- **Anyone:** the broadest type, usable by anyone who has the link.
- **People in your organization:** works for people inside your tenant who have the link.
- **Specific people:** works only for the people you name.

From a least-privilege view, Specific people is the narrowest option, and Anyone is the broadest. Which types are available depends on your sharing settings; a site can allow external sharing only if it is allowed at organization level first.

A practical exercise for week 3, again on your pilot sites:

1. Review which link types are currently allowed and whether that matches how people actually work.
2. Look at existing links on sensitive libraries and ask whether each one is still needed.
3. Agree on a default: for example, Specific people for anything confidential.
4. Tell site owners where to find and remove links they no longer need.

Removing or changing links can interrupt people or external partners who rely on them. Test the change on a pilot site, inform the people involved, and keep a record of what was removed so it can be recreated if needed.

## Week 4: make it recurring with access reviews

A one-time cleanup helps, but access drifts again. This is where [access reviews](https://www.m365.fm/entity/access-reviews/) come in. They are recurring Microsoft Entra reviews that ask designated reviewers whether a person still needs access to a group, application, access package or privileged role. Removals can optionally be applied automatically.

For SharePoint, the connection runs through groups. Because team sites are connected to a Microsoft 365 group, reviewing that group's membership is a way to review who has access to the connected site. Microsoft Learn describes the capabilities in its [access reviews overview](https://learn.microsoft.com/en-us/entra/id-governance/access-reviews-overview); check it for current requirements, such as licensing, because they can change.

A sensible start:

- Choose a small number of groups behind sensitive team sites.
- Name reviewers who know the work, typically the group or site owners.
- Begin with reviews that only collect decisions, and consider automatic removal later, once you trust the process.
- Run the first review on a pilot group and look at the results before extending it.

Automatic removal changes access without a human in the loop. Test it on a pilot group first and make sure you can restore membership if a reviewer decides wrongly or does not respond as expected.

Also keep in mind what access reviews cover: they review identities and their membership in groups and similar objects. They do not replace the checks on sharing links and direct permissions described above, so the two approaches complement each other.

## Practical takeaways

- Treat least privilege as three questions for every access: which role, which scope, for how long.
- Learn how permissions work per site type before changing anything: team sites follow their Microsoft 365 group, communication sites use Owners, Members and Visitors, channel sites are managed in Teams.
- Keep Owners small and named. Move everyday contributors to Members and read-only people to Visitors.
- Prefer managing access through the Microsoft 365 group or team, and avoid nested security groups.
- For single files and folders, use sharing links deliberately: Specific people is narrower than People in your organization, which is narrower than Anyone.
- Pilot first. Test every change to roles, groups and links on a small set of sites, inform affected people, and record the previous state so you can go back.
- Use recurring Microsoft Entra access reviews to deal with the time dimension, and check Microsoft Learn for current requirements.
- Repeat the cycle on a schedule. Least privilege is a routine, not a one-time project.
