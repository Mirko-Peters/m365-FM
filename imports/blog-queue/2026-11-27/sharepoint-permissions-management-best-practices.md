---
title: "Microsoft SharePoint Permissions Management: Best Practices from Microsoft Learn"
summary: "How to manage SharePoint permissions the way Microsoft documents it: pick the right model per site type, use groups, limit unique permissions, control sharing links and review access."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [sharepoint, microsoft-365-groups, teams]
keypoints:
  - "Team sites are best managed through the Microsoft 365 group or the Teams team. Communication sites use the Owners, Members and Visitors groups."
  - "Start with the default groups and permission levels: Owners get Full Control, Members get Edit, Visitors get Read."
  - "Keep unique permissions low. Microsoft recommends under 5,000 unique ACLs per library; the maximum is 50,000."
  - "Sharing a single file breaks inheritance and costs one permission scope. Sharing a folder costs one scope for all files inside it."
  - "Use groups instead of individual users, and avoid nested security groups on communication sites."
  - "External sharing is set at organization and site level. The more restrictive setting wins."
faq:
  - q: "What is the simplest way to manage SharePoint permissions?"
    a: "According to Microsoft Learn, use the built-in groups. For team sites, manage access through the associated Microsoft 365 group or Teams team. For communication sites, use the SharePoint Owners, Members and Visitors groups. Microsoft says this makes administration easier and that the defaults cover most common scenarios."
  - q: "How many unique permissions can a SharePoint library have?"
    a: "Microsoft Learn states that a document library can have up to 50,000 unique ACLs, but for best performance it recommends keeping the number under 5,000. Each file or folder that stops inheriting permissions creates a new permission scope."
  - q: "Should I share files individually or share a folder?"
    a: "Microsoft recommends sharing folders instead of individual files. Learn gives an example: sharing 10,000 files one by one costs 10,000 scopes, while sharing one folder and moving the files into it costs a single additional scope."
  - q: "Where do I put security groups on a communication site?"
    a: "Microsoft Learn says the Visitors group is a good place to use security groups, and that nested security groups can cause performance issues and are not recommended. If a Teams team also uses the site, you may add the team's Microsoft 365 group to the Members group."
---

The short answer: let the site type decide the model, use groups instead of individuals, keep inheritance intact wherever possible, and treat every sharing link as a permission decision. That is the common thread in the Microsoft Learn articles on SharePoint sharing, permission levels and permission scopes. This guide pulls those points together and marks where the documentation is silent.

## Step 1: Match the permission model to the site type

Microsoft describes four site types, and each has a preferred way to manage access.

| Site type | How Microsoft says to manage permissions |
|---|---|
| Team site (group-connected) | Through the associated Microsoft 365 group or Teams team |
| Channel site (private or shared channel) | Through the channel in Teams. In SharePoint the permissions are read-only |
| Communication site | Through the SharePoint Owners, Members and Visitors groups |
| Hub site | Through the group for a team site, or the SharePoint groups for a communication site |

For team sites, Microsoft notes that you can manage access separately with SharePoint groups, except on channel sites. It recommends against it "for the simplest management experience." Users added directly to the site do not get access to the other group services such as the mailbox or Planner.

For sites used with Teams, Learn recommends doing all permission management through Teams.

## Step 2: Know the default groups and permission levels

The permission levels article describes three standard groups and their default levels.

| Group | Default permission level |
|---|---|
| Owners | Full Control |
| Members | Edit |
| Visitors | Read |

Full Control and Limited Access cannot be changed. Limited Access is assigned automatically when someone gets access to a single item, and you cannot assign it directly. Other levels such as Design, Contribute, Approve and Restricted Read exist, and an administrator can define custom levels.

Microsoft's advice is to start with the defaults. They "cover most common scenarios," and fine-grained permissions should be used only when needed.

One detail on team sites: Microsoft 365 groups have no view-only role. People who should only read the site have to be added directly to the Visitors group.

## Step 3: Use groups, not individual users

The scope article lists this tip: use SharePoint groups and Microsoft Entra to manage user references and permissions. A group in an access control entry gives every member the specified level, so access changes happen in one place instead of on every item.

Two cautions from the sharing article apply to communication sites:

- Nested security groups can cause performance issues and are not recommended.
- If a Teams team uses the site, you may want to add the team's Microsoft 365 group to the Members group.

## Step 4: Keep unique permissions under control

By default, a file or folder inherits permissions from its library or folder. When it stops inheriting, it gets its own permission scope. The numbers Microsoft gives:

- Up to 50,000 unique ACLs per document library, with a recommendation to stay under 5,000.
- A folder can only break inheritance if it has 100,000 or fewer items.
- A new library starts with a single scope.

Two behaviors are easy to miss. First, sharing a file or folder breaks inheritance on it. Second, moving files does not clean up: the system does not restore inheritance on your behalf, which the article says is not implemented due to security concerns.

Microsoft's tips on this page:

1. Minimize unique scopes by relying on inheritance.
2. Share folders instead of individual files.
3. Make sure folders that need unique permissions are shared before they exceed 100,000 items.
4. Review access requests and run regular audits.

## Step 5: Treat sharing links as permissions

Giving someone access to a site, group or team gives them access to all site content. Links are for individual files or folders. The sharing article names three types:

- **Anyone:** no sign-in, and access cannot be audited.
- **People in your organization:** only people inside the organization.
- **Specific people:** only the people named.

The default link type can be changed per site. In shared channel sites, Anyone links cannot be used, and the other two types behave differently for outside participants.

## Step 6: Set external sharing at two levels

External sharing is configured for the organization and for each site. To allow it on any site, it must be allowed at the organization level first. The more restrictive of the two settings applies. Microsoft recommends storing information that should never be shared externally in a site with external sharing turned off.

## Step 7: Watch the broad groups

The permission levels article names two special groups. "Everyone except external users" is added to the Members group on Modern Team sites with Public privacy. It cannot be granted permissions on Private Modern Team sites. Check public team sites before putting sensitive content there.

Microsoft also notes that lockdown mode is on by default for publishing sites and is the recommended configuration if greater security is required.

## Typical mistakes

- Sharing many files one by one, which creates many scopes.
- Adding individuals directly to a group-connected site and expecting group services to follow.
- Putting sensitive files in a public team site.
- Nesting security groups on a communication site.
- Assuming that moving a file restores inheritance.

## What the documentation does not say

The pages read for this article do not give a review schedule or a fixed audit procedure. They say to audit regularly, but not how often. The sharing article also states no numeric limits. Use your own governance policy to fill that gap.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft 365 Groups](https://www.m365.fm/entity/microsoft-365-groups/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Sharing and permissions in the SharePoint modern experience](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions)
- [Understanding permission levels in SharePoint](https://learn.microsoft.com/en-us/sharepoint/understanding-permission-levels)
- [Manage permission scope in SharePoint](https://learn.microsoft.com/en-us/sharepoint/manage-permission-scope)
