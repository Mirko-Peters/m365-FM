---
title: "Replacing SharePoint subsites with hub sites: a migration guide"
summary: "Plan the move from SharePoint subsites to hub sites: why flat sites work better, how to promote each subsite to its own site, and how to connect the new sites."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [sharepoint-subsites, sharepoint-hub-sites, sharepoint-migration, information-architecture]
keypoints:
  - "Microsoft states that subsites are not recommended in modern SharePoint and advises one site for each discrete topic, task or unit of work."
  - "Retention, sensitivity labels and DLP apply to a whole site and everything beneath it, so a subsite can never have its own policy."
  - "A hub site connects related sites with shared navigation, branding and search, but associating a site does not change its permissions."
  - "There is no native conversion of a subsite into a standalone site, so you create the new site and move the content with a template, a copy or a migration tool."
  - "Each site can belong to only one hub, so design the hubs around the way the organization actually reorganizes, such as department, region or project."
faq:
  - q: "Can I convert a SharePoint subsite into a hub site?"
    a: "Not directly. A subsite stays nested under its parent site, and no native command promotes it to a standalone site. The usual route is to create a new site, recreate the structure, for example with a PnP provisioning template, and move the content. Then you register one site as the hub and associate the others."
  - q: "Does associating a site with a hub change its permissions?"
    a: "No. Microsoft's hub planning guidance states that associating a site with a hub does not change the permissions of that site. Hub content is security-trimmed, so people see rolled-up content only from sites they can already open. Site owners still manage access for their own site."
  - q: "Can a site belong to more than one hub?"
    a: "No. According to Microsoft Learn, each site can be associated with only one hub at a time, although content from a site can still appear on multiple hubs through roll-up web parts. Hubs themselves can be linked to each other through association and navigation links."
---

To replace [SharePoint subsites](https://www.m365.fm/entity/sharepoint-subsites/) with [hub sites](https://www.m365.fm/entity/sharepoint-hub-sites/), promote each subsite to its own standalone site, move its content across, and then connect the new sites through a hub that provides shared navigation, branding and search. This guide is for the SharePoint architect of an older tenant who inherits a deep tree of sites and subsites in SharePoint Online and wants to flatten the site structure. You will see why the flat model works better, which options exist for moving content, and how to plan the sequence.

## From SharePoint subsites to hub sites: the target model

In a classic site structure, content was organized as a hierarchy of site collections and subsites with inherited navigation, permissions and design. Microsoft's guide to the [modern information architecture](https://learn.microsoft.com/sharepoint/information-architecture-modern-experience) says that this structure is inflexible and hard to maintain, and that "in the modern SharePoint experience, subsites aren't recommended." The best practices are simple: create one site for each discrete topic, task or unit of work.

A hub site connects those flat sites. According to the [hub site planning guide](https://learn.microsoft.com/en-us/sharepoint/planning-hub-sites), a hub provides shared navigation and theme, rolls up news and content from associated sites, and lets people search across them. Hubs model relationships as links rather than hierarchy, so a site can move to another hub when the organization changes. A subsite cannot, because its parent is part of its address.

The target model therefore has three parts:

- **Standalone sites**, one per topic, team or project, each with its own owners and permissions.
- **Hubs** that group the sites by department, region or concept.
- **Roll-ups and links** that surface content across sites, such as news, highlighted content and the Sites web part.

The [information architecture](https://www.m365.fm/entity/information-architecture/) work is the real task. The technical move is only a consequence of the decisions you make about grouping.

## Why subsites cause problems

The strongest reason to leave subsites is control. Joanne Klein explains in a [Practical365 article](https://practical365.com/practical-purview-why-a-flat-sharepoint-architecture-matters-to-microsoft-purview/) from July 2024 that Microsoft Purview controls work at the site level:

- Retention policies and label policies are scoped to a site and apply to every subsite beneath it. A parent site cannot have a two-year policy on one subsite and a seven-year policy on another.
- Sensitivity labels that control guest access or external sharing apply to the whole container.
- Data loss prevention locations target sites, not subsites.
- Each site has a Preservation Hold library whose content counts toward the storage quota, and subsite libraries count toward the parent as well.

The article also notes that subsite creation is enabled by default and recommends disabling it. Whatever you decide, avoid new subsites and stop their creation first. Otherwise you will be migrating a moving target.

## Take stock of the subsite tree

Before you design anything, list every parent site and every subsite beneath it. For each subsite, record the owner, last activity, size, whether it breaks permission inheritance, and what it contains. PowerShell or the SharePoint admin center can provide most of this. You need the inventory for three decisions:

1. **Archive or delete:** subsites that nobody has opened for a long time need no new home.
2. **Promote:** active subsites become standalone sites.
3. **Merge:** small subsites with the same audience can be combined into one site with several libraries.

Also record what depends on the old address: navigation links, pages with embedded links, Power Automate flows, bookmarks and shared documents. The new site will have a new URL, so every one of these references needs a fix or at least a communication.

Remember what promotion means for permissions. A subsite often inherits access from its parent site. A standalone site is its own site collection. Separate site collections have separate boundaries for storage, membership and permissions, as the Purview article points out. So the new top level site needs named owners and an explicit access model before the content arrives. Write down who owns each new site, who may create further sites, and how members are added, because the parent site can no longer answer those questions for you.

## Choose the right site type

Each promoted subsite becomes either a team site or a communication site. Use a team site when the group works together and needs a shared library, lists and possibly a Microsoft 365 group. Use a communication site when a small group publishes content to a large audience. The modern architecture guide notes that Microsoft 365 groups can only be used on team sites, so the choice affects how you manage membership later.

A subsite usually does not map to a Microsoft 365 group. Decide early whether you create groups for the new team sites, or whether you keep the SharePoint groups of the old site.

## Options for moving the content

There is no native conversion that turns a subsite into a standalone site. A Microsoft Tech Community [discussion from 2022](https://techcommunity.microsoft.com/discussions/sharepoint_general/change-a-modern-sharepoint-subsite-to-its-own-site/3672845) confirms the pattern: the site cannot be moved directly. The answer marked as the solution suggested exporting the structure with PnP provisioning, applying it to a new site and moving the content manually, and another reply pointed to a paid third-party tool. Those are community answers, so test them in a pilot before you trust them.

In practice you have three options:

- **Copy or move in the browser** from the source site to the destination site. Fine for a single library of moderate size. Check the limits on size and file count, and note that the Copy to action does not preserve the full version history.
- **Template plus content move.** Use a provisioning template to rebuild lists, libraries and pages, then move the content.
- **Migration tool.** Third-party migration tools and other tools that migrate between sites can keep metadata and permissions while restructuring. Compare them against your requirements.

Whichever route you take, plan it as a [SharePoint migration](https://www.m365.fm/entity/sharepoint-migration/) with an inventory, a pilot, a freeze period and a verification step, not as a series of ad-hoc copies.

## Example: HR parent site with 14 subsites

This example uses invented numbers. An HR intranet has one parent site and 14 subsites, each with its own navigation. The inventory shows that 4 subsites have had no activity for more than two years, 10 are active, and 2 of the active ones share the same audience.

- **4 inactive subsites** are archived with the owners' approval.
- **2 small subsites** are merged into one site with two libraries, which leaves 9 sites.
- **9 sites** are grouped into 3 hubs: People with 4 sites, Recruiting with 3 sites and Operations with 2 sites.
- **The Payroll subsite** needed a seven-year retention label, which previously applied to the whole HR parent. In the new structure only the Payroll site gets the label.

The outcome: 14 subsites become 9 standalone sites in 3 hubs, plus the 3 hub sites themselves, which makes 12 sites to manage. The hub navigation replaces the old parent navigation. The retention label now covers only the one site that needs it, which is the control the old structure could not provide.

## Connect the new sites to hubs

Creating a hub requires SharePoint administrator rights. According to the hub planning guide, only administrators can create a hub, and site owners can associate sites with the hub only if the hub owner allows it. Associated sites inherit the hub theme and navigation, and their content rolls up to the hub.

Keep these points in mind:

- **Permissions stay as they are.** Association does not change permissions, and rolled-up content is security-trimmed. Visitors see only what they can already open.
- **One hub per site.** Choose the grouping that matches how the organization will reorganize.
- **Navigation limits.** Microsoft recommends no more than 100 sites in the hub navigation. Navigation can hold up to 500 child links per level.
- **Hub owners decide the navigation.** Associating a site does not add it to the navigation automatically.

## Common mistakes

- **Treating the hub as a new parent.** A hub is not a container, and it does not own the permissions of its sites.
- **Promoting every subsite without review.** Many subsites are dead. Archive them instead of paying for a migration.
- **Ignoring address changes.** Links, flows and bookmarks that use the old address stop working.
- **Mirroring the old tree in hubs.** Building three levels of hubs reproduces the rigid structure you wanted to leave.
- **Leaving subsite creation open.** New subsites keep appearing while you migrate.

## How software can help

Start with what you have: the SharePoint admin center for site lists, PowerShell for inventories, and Microsoft's own copy and move features for small libraries. Migration tools can help with larger moves because they handle metadata, versions and permissions in bulk. Judge any tool by whether it preserves the properties you need and reports what it could not move.

## Next step

List all parent sites and their subsites this week, and mark each one as archive, promote or merge. Use that list to draft your hub structure, because the grouping is the main design decision when you move from SharePoint subsites to hub sites.
