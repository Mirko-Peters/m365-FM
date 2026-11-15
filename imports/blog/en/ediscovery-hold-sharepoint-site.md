---
title: "eDiscovery holds and SharePoint sites: what site owners should know"
summary: "An eDiscovery hold on a SharePoint site keeps content safe for a legal case, even when owners delete it. See what changes for site owners and what to ask legal."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [ediscovery, retention-policies, sharepoint-site-owner, compliance]
keypoints:
  - "An eDiscovery hold preserves content on a SharePoint site for a legal case until someone removes the site from the hold, releases it or deletes the hold policy."
  - "Site owners can still work normally. Edits and deletions go on, but the original content is copied to the hidden Preservation Hold library."
  - "A hold can take up to 24 hours to take effect, and after removal a delay hold of up to 30 days still blocks permanent deletion."
  - "A site on hold cannot be deleted. A site-scoped retention policy or content in the Preservation Hold library can also block deleting a library."
  - "Site owners cannot see holds. Ask your legal or compliance team whether a site is on hold before you delete, archive or restructure it."
faq:
  - q: "Can I delete files on a SharePoint site that is on eDiscovery hold?"
    a: "Usually yes, users can still delete files. The original content is copied to the Preservation Hold library, so it stays available to the legal team. The recycle bin is different: Microsoft says it is not indexed, so eDiscovery cannot place holds on recycle bin content. Deleting a whole site or a library with preserved content can be blocked."
  - q: "Why can't I delete a SharePoint site after the hold was removed?"
    a: "Microsoft applies a delay hold after a hold is removed. It preserves content for up to 30 days before the hold is actually removed, and during that time SharePoint site deletion can fail. Other hold sources can also block deletion, such as a site-scoped retention policy. Ask the compliance team to check every hold source."
  - q: "How long does an eDiscovery hold take to start working?"
    a: "Microsoft says it can take up to 24 hours for a new eDiscovery hold to take effect. The hold status appears on the details tab of the hold policy as on hold, not on hold or an error. Do not assume a site is protected the minute the case team clicks save."
---

An eDiscovery hold on a SharePoint site keeps the site's content available for a legal case, even if people edit or delete it. For site owners, the hold is invisible but it changes what delete, archive and clean-up actions really do. This article is for [site owners](https://www.m365.fm/entity/sharepoint-site-owner/) who work on sites that a legal team might place on hold, and who need to know what to expect and what to ask. It follows Microsoft's documentation for [eDiscovery](https://www.m365.fm/entity/ediscovery/) holds in Microsoft Purview.

## What an eDiscovery hold does to a SharePoint site

A hold is a rule created in an eDiscovery case. To create an eDiscovery hold, the case team needs a user account with eDiscovery permissions and then adds the locations to the case. The same case also holds the search queries for the matter. According to Microsoft's article [Create holds in eDiscovery](https://learn.microsoft.com/en-us/purview/edisc-hold-create), holds cover SharePoint sites and OneDrive accounts. For SharePoint Online sites, the case team adds the site URL, or the URL of a Microsoft Teams team, a Microsoft 365 group or a Viva Engage group, to the hold policy. The content stays preserved until the team removes the site from the hold, releases the hold or deletes the hold policy.

For you, the practical effect is simple. People can keep working. When a user edits or deletes an item that is subject to a hold, SharePoint copies the original content to the Preservation Hold library, a hidden system location. Microsoft says it is not supported to edit, delete or move those files yourself, and that you should use compliance tools such as eDiscovery to reach them. That is why site storage can grow on a held site. Microsoft's page on [retention for SharePoint and OneDrive](https://learn.microsoft.com/en-us/purview/retention-policies-sharepoint) describes the same library for retention in general.

You may know the term litigation hold. In Microsoft 365 that name belongs to a mailbox setting. For a SharePoint site, the eDiscovery hold plays the same role.

## How an eDiscovery hold differs from a retention policy

Both keep content, but they come from different owners. A [retention policy](https://www.m365.fm/entity/retention-policies/) is a standing rule that compliance sets for the whole tenant or for chosen locations. An eDiscovery hold belongs to a case and normally ends when the case ends. Both can apply to the same site at once. Microsoft states that permanent deletion is always suspended if an item must be retained because of another retention policy, a label or an eDiscovery hold.

For site owners, the difference matters in three ways:

- **Scope.** A hold can be limited to one site, while a retention policy may cover many.
- **Lifetime.** A hold stays until the case team releases it. A retention policy follows its retention period.
- **Visibility.** Neither is visible to site owners in the site itself. You find out from legal, or when something fails.

## What gets held, and what does not

Microsoft's page gives the limits. These facts affect site owners most:

- The site must have a title to be placed on a hold. The page also advises keeping site names under 70 characters, because long names can lead to truncated site URLs and access errors.
- Subsites cannot be held on their own. If the case team selects a subsite, the hold goes on the parent site instead.
- The recycle bin is not covered. Microsoft says it is not indexed, so eDiscovery searches cannot find recycle bin content to hold.
- Group membership does not extend a hold. For holds on Microsoft 365 groups, the mailboxes and OneDrive sites of group members aren't placed on hold unless someone adds them explicitly.
- In Teams, channel files live on the team site, which is the team's SharePoint site, so a team site on hold covers them. Files shared in chats live in the sharing user's OneDrive.

Query-based holds work differently. Microsoft says a query-based hold first places all content from the selected locations on hold, and the system later clears content that does not match the query every seven to 14 days. A deleted document moves to the Preservation Hold library even if it does not match the query, and a timer job later removes the ones that do not match.

## Hold states, errors and read-only sites

The case team sees a hold policy in one of five states: Draft, On, Off, In progress or Pending deletion. Microsoft's article [Manage hold policies for eDiscovery cases](https://learn.microsoft.com/en-us/purview/edisc-hold-manage) lists the usual errors, and two of them concern sites. If a site is inaccessible, a SharePoint admin must make it writable before the case team retries the policy. If the site is not found or the hold failed to apply, the team must update the policy with the new site URL and retry.

This matters if you plan to lock a site. Microsoft says items in a site with the lock state NoAccess or ReadOnly cannot be deleted by retention settings, and Microsoft lists an inaccessible site as a reason why a hold can fail. Before you set a site to read-only, ask the case team whether the site is part of a hold.

Microsoft also warns that turning off a hold policy might result in the permanent deletion of any content that is currently preserved, and that deleting the policy releases all sites and mailboxes. Only the case team should make those changes.

## How long it takes, and how to check

Microsoft says it can take up to 24 hours for a new hold to take effect. Treat a site as unprotected until the status says otherwise. The case team can check the hold status on the Details tab of the hold policy, which shows on hold, not on hold, or an error. For a SharePoint site, Microsoft Learn also describes the command `Invoke-HoldRemovalAssistant`, which takes the site URL as its identity and lists the hold sources that apply to the site.

Holds are not monitored for later changes. Microsoft says eDiscovery does not continuously monitor location changes after a hold is applied. If the site URL changes, the case team must edit the hold policy and reapply it. If you rename or move a site, tell legal first.

## Example: a deletion that fails

This example uses invented dates. A legal team creates a hold on a project site on Monday at 9:00. Microsoft says it can take up to 24 hours, so the site is only safe from Tuesday 9:00 at the latest. During that gap, a site owner deletes a folder. After Tuesday 9:00, deletions on that site copy the original files to the Preservation Hold library.

Six months later, the case closes. The team removes the site from the hold on 3 March. A delay hold now preserves content for up to 30 days, which means until 2 April at the latest. On 10 March, the owner tries to delete the site and it fails. That is expected, not a fault. The owner waits until after 2 April and asks compliance to confirm that no retention policy still applies to the site.

The arithmetic is short. 3 March plus 30 days is 2 April. A request to delete before that date fails, and a request to delete before the site is released from all other hold sources fails too.

## What site owners should do

1. **Ask before you delete or archive.** Ask your legal or [compliance](https://www.m365.fm/entity/compliance/) team whether the site, or the team behind it, is on hold.
2. **Do not touch the Preservation Hold library.** Microsoft does not support editing, deleting or moving its files.
3. **Tell legal about restructuring.** A new site URL, a merge or a move can break the link between the hold and the site.
4. **Keep an owner list.** If the owner leaves, the site can be forgotten while it is still on hold.
5. **Expect delays.** After a hold ends, plan for the delay hold before you decommission the site.

## Common mistakes

- **Assuming deletion works.** A site on hold, a site-scoped retention policy or a delay hold can block deletion, and so can content in the Preservation Hold library.
- **Deleting the recycle bin to free storage.** It does not release held content, and for eDiscovery the recycle bin is outside the hold.
- **Renaming or moving a held site without telling legal.** The hold may stop finding the site.
- **Treating holds as permanent.** They end when the case team releases them, so ask for a date.
- **Turning off or deleting a hold policy yourself.** Microsoft warns that this might result in the permanent deletion of preserved content.

## How software can help

Site owners have little to work with here, and that is by design. Microsoft's own tools are the eDiscovery case view for the legal team and the Preservation Hold library for storage reviews. A simple register helps: one line per site with its owner, the case reference supplied by legal, the hold start date and the planned release date. Your compliance team can keep it up to date and share it on request.

## Next step

Write to your compliance team this week and ask which of your sites have an eDiscovery hold on a SharePoint site, and whether a delay hold still applies. Add the answer to your site register before the next clean-up.
