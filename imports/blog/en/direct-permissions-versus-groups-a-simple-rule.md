---
title: "Direct permissions versus groups: a simple rule"
summary: "A simple rule for SharePoint access: use groups for people who need access to a whole site, and use direct permissions or sharing links only for real exceptions that you can explain and review later."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [sharepoint-permissions, least-privilege, permission-inheritance]
faq:
  - q: "Should I ever give a user direct permissions on a SharePoint site?"
    a: "Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible. Direct permissions can make sense for a real exception, such as a person who must only read a team site. Document the reason and review it regularly, because direct entries are easy to forget."
  - q: "How do I give someone read-only access to a team site?"
    a: "A Microsoft 365 group has no view-only access, so people who should only read must be added directly to the SharePoint Visitors group, which has the Read permission level. Adding them to the group's members would give them edit rights instead."
  - q: "Why does Microsoft advise against nested security groups in SharePoint?"
    a: "Microsoft advises against nested security groups because they can cause performance problems. Prefer the Microsoft 365 group or team, and check Microsoft Learn for current guidance before you design a group structure."
---

Every SharePoint owner eventually faces the same small decision: add this person to the group, or give them access directly? It looks harmless in the moment. Over months and years, the answers add up to the access structure you have to live with.

This article offers a simple rule for that decision, based on how [SharePoint permissions](https://www.m365.fm/entity/sharepoint-permissions/) are described in Microsoft documentation. It is not the only valid approach, but it is easy to explain to site owners and easy to review.

## The rule in one sentence

**Use groups for everyone who needs access to the whole site. Use direct permissions or sharing links only for real exceptions that you can name, explain and review.**

Groups answer the question "who belongs to this team?". Direct permissions answer "who is the exception, and why?". If you cannot answer the second question in one sentence, the person probably belongs in a group or does not need access at all.

The rest of this article explains why this rule fits how SharePoint works.

## How SharePoint groups work

Microsoft Learn describes the permission model by site type, and the starting point differs.

- **Team sites** are by default connected to a Microsoft 365 group. The group owners become site owners, and the group members become site members.
- **Communication sites** are not connected to a Microsoft 365 group. They use the standard SharePoint groups Owners, Members and Visitors.
- **Private and shared channel sites** have their permissions managed in Teams.

On a team site, the three groups map to permission levels: Full Control for Owners, Edit for Members and Read for Visitors.

Permissions on a site, group or team give access to all content in it. That is the key point for the rule. A group is the right tool when the answer to "does this person need access to everything on this site?" is yes. Group membership is a single place to see and change who has access.

Microsoft recommends managing permissions through the Microsoft 365 group or the team where possible. It also advises against nested security groups, because they can cause performance problems. Check Microsoft Learn for the current guidance before you design a group structure.

## When a direct permission is the right answer

The rule says "real exceptions", so it helps to know what a real exception looks like.

**Read-only access on a team site.** A Microsoft 365 group has no view-only access. If you add someone to the group as a member, they can edit. People who should only read must be added directly to the Visitors group, which has the Read permission level. This is a documented case where going outside the group is the correct approach.

Imagine a team site for a project team, where the legal department needs to read the documents but must not change them. Adding legal to the Microsoft 365 group would give them edit rights. Adding them to the Visitors group matches the intent.

**A single file or folder.** Sharing links exist for content below the site level. SharePoint offers three link types: Anyone, People in your organization and Specific people. When one colleague needs one document, a link set to Specific people is a more precise tool than adding them to the site. A site can allow external sharing only if it is allowed at organization level first, so external sharing depends on settings above the site as well.

**Temporary or unusual access.** Imagine an external advisor who needs one folder for a few weeks. This is the kind of case where a narrow, documented exception can fit better than a broad group membership. The key words are "documented" and "reviewed". An exception without an end date or an owner is easy to forget.

## Where inheritance and least privilege fit in

Two other concepts explain why the rule is shaped this way.

**[Permission inheritance](https://www.m365.fm/entity/permission-inheritance/)** means that content in SharePoint normally takes its permissions from the parent, such as the site, library or folder above it. This is what makes group-based access simple: set it once at the site and it applies below. When someone breaks inheritance on a library, folder or file and assigns unique permissions, that item no longer follows the parent. Unique permissions are the technical form of an exception, and every one of them is something a future admin has to find and understand.

Before you break inheritance or remove permissions anywhere, test the change on a pilot site or in a test tenant first, and make sure you have a backup or a documented way back. Changing access in bulk without a plan can lock people out or expose content to the wrong audience.

**[Least privilege](https://www.m365.fm/entity/least-privilege/)** is the security principle of giving an identity the smallest role at the smallest scope for the shortest time that still lets it do its work. It limits what an attacker can reach if an account is compromised. Applied to SharePoint, it asks three questions about every access grant:

1. Is this the smallest role that works (Read instead of Edit, Edit instead of Full Control)?
2. Is this the smallest scope (a single file instead of the whole site)?
3. Does it need to last, or can it end?

Notice that least privilege and the group rule can pull in different directions. Least privilege often points to narrow scope, such as a single folder. The group rule points to simplicity at site level. The way to reconcile them is to keep the site as the main boundary: put people who belong together on the same site, give them access through the group, and use narrow exceptions only where the content truly differs in audience.

## Applying the rule in practice

A few habits make the rule work day to day.

**Name an owner for every site.** Group-based access only stays clean if someone is responsible for membership. Owners should know that adding a person to the group gives access to all content on the site.

**Choose the group deliberately.** Members get Edit, Visitors get Read, Owners get Full Control. Keep the Owners group small. If a person only needs to read, use Visitors, and remember that on a team site this means adding them directly to the Visitors group.

**Prefer a second site over many unique permissions.** If one library needs a very different audience from the rest of the site, ask whether it should be its own site. A separate site with its own group is easier to understand than a library with a long list of individual entries.

**Review the exceptions, not just the groups.** Group membership is easy to list. Direct permissions, sharing links and unique permissions need an explicit review step. Microsoft 365 provides reports and settings for sharing and access; see Microsoft Learn for what is available in your tenant and licence. Third-party tools are another option. One example is the SharePoint Essentials Toolkit from [Cognillo](https://www.cognillo.com), which is one option among others, and native Microsoft features are the place to start.

**Be careful with clean-up.** Reviewing is safe. Removing is not always safe. Before you delete permissions, remove people or restore inheritance, test on a pilot site, confirm who depends on the access, and keep a way back.

## Practical takeaways

- Use the rule: groups for everyone who needs the whole site, direct permissions and sharing links for named exceptions.
- Manage access through the Microsoft 365 group or team where possible, as Microsoft recommends, and avoid nested security groups.
- For read-only users on a team site, add them directly to the Visitors group, because a Microsoft 365 group has no view-only access.
- Treat every broken inheritance and every unique permission as an exception that needs a reason and a reviewer.
- Apply least privilege: smallest role, smallest scope, shortest time.
- If one area needs a different audience, consider a separate site instead of many individual entries.
- Always test permission changes on a pilot site or test tenant first, and have a backup or a way back before you remove access or restore inheritance.
- Check the [SharePoint sharing and permissions documentation on Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/modern-experience-sharing-permissions) for the current behaviour in your tenant.
