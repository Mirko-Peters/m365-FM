---
title: "A short training plan for new SharePoint site owners"
summary: "A SharePoint site owner training plan for IT managers: three short sessions, the permission rules owners must know, and the Microsoft notices they will receive."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-site-owner, sharepoint-governance, sharepoint-permissions]
keypoints:
  - "New site owners need more than basic user skills: Microsoft's guidance expects them to manage permissions, settings, content and the link to the administrators."
  - "A short plan of three sessions can cover the owner role and rules, permissions and sharing, and the routines for content and lifecycle."
  - "Owners should grant only the minimum access each person needs and use the default Owner, Member and Visitor groups instead of one-off grants."
  - "Microsoft's site ownership and inactive site policies send owners email notices, so training should show what the notices mean and how to act."
  - "Check that the training worked with a hands-on task for each owner, and name at least two owners per important site."
faq:
  - q: "What should SharePoint site owner training cover?"
    a: "Cover the owner's responsibilities, how permissions and sharing work, how to manage lists, libraries and site settings, and the routines for content and site lifecycle. Add the rules of your organization and the notices owners will receive from Microsoft. Use hands-on practice so that owners can apply each topic to their own site."
  - q: "How long should site owner training take?"
    a: "A short plan can run as three sessions of about an hour each, plus a hands-on task. Microsoft community guidance suggests basic user training of a few hours per group, with advanced training for owners. Keep sessions short, and repeat the key rules after a few weeks when owners have real questions."
  - q: "How many owners should a SharePoint site have?"
    a: "At least two. Microsoft's site ownership policy lets administrators set a minimum number of owners or admins and flags sites below it, with a minimum of two given as an example. A second owner keeps the site manageable when the first one leaves or is unavailable."
---

A SharePoint site owner training plan turns a new owner from someone who was handed a site into someone who knows what the job involves. This guide is for IT managers who have to train site owners without a big budget or a long course. You will see what owners need to know, a plan of three short sessions, which Microsoft notices they will meet, and how to check that the training worked. A worked example with made-up numbers shows a team preparing twelve new owners.

## What a new site owner needs to know

The Microsoft support article on [site governance, permissions and sharing](https://support.microsoft.com/office/overview-site-governance-permission-and-sharing-for-site-owners-95e83c3d-e1b0-4aae-9d08-e94dcaa4942e) gives a clear picture of the job. It tells owners to work with their SharePoint administrator, because many sharing and permission rules are set there, and it suggests owner training as part of the model. It also says owners can add or remove other owners, members and visitors and can edit site settings.

This matters because Microsoft SharePoint is more than a document store. The PnP community article points out that people often assume it works like a network share, while it offers versioning, metadata, content types, labels and workflows, and connects to Teams, Power Automate and Power Apps. Microsoft 365 puts more functionality around each site than a new owner expects, which is one more reason to train early.

From the same article, four habits belong in every plan for a new [site owner](https://www.m365.fm/entity/sharepoint-site-owner/):

- **Grant only the minimum access each person needs** for their tasks.
- **Use the default Owner, Member and Visitor groups** instead of ad hoc grants.
- **Keep sensitive material in its own site or library** instead of relying on unique permissions inside a larger library.
- **Audit site and page content on a schedule**, and assign content owners for large lists and libraries.

The PnP community article on [why SharePoint training is important](https://pnp.github.io/community-docs/articles/why-sharepoint-training-is-important.html) adds the audience view. It separates basic users from super users or site owners, who need advanced training to manage their team or department site, and it notes that owners take on security responsibilities and often act as the support contact for their site members. It also suggests finding experienced people, which it calls SharePoint champions, who can serve as owners or help to train colleagues.

## A SharePoint site owner training plan in three sessions

The articles do not prescribe a schedule, so the plan below is our own suggestion, built from their topic lists. Keep each session short and practical, and let owners work on their own site during the session.

**Session 1: the job and the rules (about 60 minutes).**

- What an owner is responsible for, and what stays with the administrators.
- Your organization's SharePoint [governance](https://www.m365.fm/entity/sharepoint-governance/) rules for site creation and use, including who may create sites.
- Where to ask for SharePoint help, and who the site expert or liaison is.
- A look at the lifecycle: sites are created, used, reviewed and one day retired.

**Session 2: permissions and sharing (about 60 minutes).**

- The SharePoint Owner, Member and Visitor groups, and why they are the default.
- How [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) are inherited, and why unique permissions cost you clarity later. The PnP article lists permission inheritance among its advanced topics for owners.
- Sharing a file, a folder or a SharePoint site, and what your tenant settings allow.
- What to do when someone asks for broader access: ask why, give the least access that works, and send unusual requests to the administrator.

**Session 3: content and routines (about 60 minutes).**

- SharePoint lists and libraries, views, version history and metadata, from the PnP list of basic topics.
- Content types, approval workflows and Power Automate flows, all of which the PnP article places in its advanced topics. Show one simple workflow, and tell owners when to ask for help before they customize a site.
- Pages and web parts. The PnP article lists creating and customizing pages and web parts as an advanced topic, so decide how much customization owners may do and which functionality stays with the administrators.
- Restoring items from the SharePoint recycle bin.
- A short routine: review members and content every quarter, and confirm the site is still needed.

Run the sessions in small groups so that owners can train each other, and ask every owner to train a deputy for their site. Pair the sessions with a hands-on task, because the PnP article stresses balancing theory with practice so that people apply new skills to daily work. If your organization uses SharePoint Online, a Microsoft training course or an internal wiki can fill gaps, but a short course built on your own rules is usually more useful than a generic one.

## What Microsoft will ask owners to do

Owners also receive automated notices, and training is a good moment to explain them. Two Microsoft features matter most. Both are set by administrators, so check what is turned on in your tenant before you teach them.

The [site ownership policy](https://learn.microsoft.com/sharepoint/create-sharepoint-site-ownership-policy) lets administrators set a minimum number of owners or admins and flags sites below it. A minimum of 2 is the example given. Notices can go to current owners and admins, who are asked to add another owner, to managers of former owners, and to active members, who are asked to accept ownership. The policy runs monthly in active mode. Only ownerless sites can go read-only or be archived under it, so sites with at least one owner are not locked.

The [inactive site policy](https://learn.microsoft.com/sharepoint/inactive-site-policy) sends owners or site admins up to three monthly emails after a period of inactivity. An owner who selects Certify site in the email keeps the site from being checked for one year. If nobody responds, the enforcement action chosen by the administrators applies: do nothing, read-only access, or read-only followed by archive. Site owners cannot lift read-only mode, and only a tenant admin can unlock it.

Tell owners plainly that these notification emails are normal, that they should act on them, and who to contact if they are unsure. A notice that is ignored leads to a locked site and an unhappy team.

## Check that the training worked

Do not measure training by attendance. Give each owner a short hands-on task, such as these four:

1. Open the site's permissions page and list who has access and why.
2. Add a second owner to the site.
3. Share one file with a colleague using the least access that works.
4. Find the site's last review date, or set one.

Then look at your own data. Count sites with fewer than two owners, and count open owner notices in Microsoft 365. These two numbers show whether the training changed anything. Revisit the key rules after a few weeks, when owners have run into real situations.

## Example: twelve new owners

The numbers are made up.

An IT manager has twelve new owners after a reorganization. Together they look after 30 SharePoint sites. Today, 18 of those sites have only one owner, and the manager has had two access requests this month that she did not know how to judge.

She runs the three sessions over three weeks, with a group of six owners each time. Each owner finishes the four hands-on tasks on a real site. After the second session, the owners add second owners to 14 of the 18 sites. After the third, she asks each owner to set a quarterly reminder to review members.

Six weeks later, 4 sites still have one owner, and all four are on a list for follow-up. Access requests now arrive with a reason attached. The manager does not know how much time the owners save, but she notices fewer questions that start with "who can see this site?"

## Common mistakes

- **Giving owners a site and no briefing.** They learn by making mistakes on live content.
- **Teaching every feature.** Focus on permissions, sharing and routines first.
- **Training once and never again.** Repeat the key rules when owners meet real cases.
- **Relying on a single owner per site.** One departure leaves the site without a manager.
- **Skipping the notices.** Owners who do not know the emails may ignore them.
- **Measuring attendance instead of outcomes.** Check owner counts and hands-on tasks.

## How software can help

Start with what Microsoft 365 provides: the site ownership policy, the inactive site policy and the SharePoint admin center reports. Use a shared page or a short video for the rules, and a simple tracking list for who completed which task. A scheduled script or report can show sites with fewer than two owners. Choose tools that make the owner list easy to check, and keep the training itself focused on your own rules.

## Next step

Pick your three most important sites and check that each has two trained owners. Then book the first session for your next owner cohort, and use this SharePoint site owner training plan as the outline.
