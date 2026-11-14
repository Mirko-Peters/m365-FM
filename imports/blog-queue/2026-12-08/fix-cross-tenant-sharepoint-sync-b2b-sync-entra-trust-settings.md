---
title: "Fix cross-tenant SharePoint sync problems: B2B Sync and Entra trust settings"
summary: "When a guest cannot sync a SharePoint library from another tenant, check external sharing, Anyone links, Conditional Access, the BlockExternalSync policy and the Entra cross-tenant access settings, in that order."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [sharepoint, entra-external-id, cross-tenant-access-settings, onedrive]
keypoints:
  - "B2B Sync lets users sync libraries shared by another organization. It relies on a guest account in the sharing tenant that links to the user's home account."
  - "Anyone links do not create guest accounts, so B2B Sync does not work with them. Share directly with named people instead."
  - "The sync app cannot show interactive sign-in. Conditional Access that needs MFA, terms of use or device compliance blocks or breaks the sync."
  - "The cross-tenant access settings page documents inbound, outbound and trust settings. It does not say that trusting MFA claims repairs B2B Sync, so test it."
  - "Receiving organizations can block the feature with the BlockExternalSync policy, which needs OneDrive build 19.086 or later."
faq:
  - q: "What is B2B Sync in OneDrive and SharePoint?"
    a: "According to Microsoft Learn, B2B Sync lets users sync SharePoint libraries or folders, or OneDrive folders, that another organization shared with them. A guest account in the sharing tenant links to the recipient's member account in their home tenant, so the user signs in only with their home organization's account."
  - q: "Why does sync fail when Conditional Access requires MFA?"
    a: "Learn says the sync client cannot show interactive authentication during external sync. Policies that need MFA or terms of use prompts block sync from that tenant. If such a policy is deployed before the first sync, the relationship cannot be established. If it is deployed afterwards, the guest gets an error."
  - q: "Do device compliance policies work with B2B Sync?"
    a: "Learn states that device compliance policies are not compatible, because guest machines are usually managed by their own organization. Location-based Conditional Access can also cause trouble, since guests are usually outside trusted locations."
  - q: "What do trust settings in cross-tenant access settings do?"
    a: "Microsoft Learn says inbound trust settings determine whether your Conditional Access policies accept the MFA, compliant device and Microsoft Entra hybrid joined device claims from an external organization. Trusting MFA does not remove your MFA policies. Trust settings need Microsoft Entra ID P1 and at least the Security Administrator role to configure."
  - q: "How can an organization stop its users from syncing other tenants' content?"
    a: "Learn describes the BlockExternalSync policy. On Windows it is set under the OneDrive policies registry key with a DWORD value of 1, and on a Mac with a defaults write command. The ADMX templates must come from OneDrive build 19.086 or later."
---

Cross-tenant sync of a SharePoint library fails most often because of one of four things: the content was shared with an Anyone link, external sharing is off at the organization or site level, a Conditional Access policy needs interactive sign-in, or the guest account or permission is gone. Check these in the sharing tenant first, then look at the Entra cross-tenant access settings on both sides.

## How B2B Sync works

Microsoft Learn describes B2B Sync as a OneDrive sync app feature. A user syncs a SharePoint library or folder, or a OneDrive folder, that another organization shared. A guest account in the sharing tenant links to the user's member account in the home tenant, so the user signs in only with their home account. The page recommends enabling SharePoint and OneDrive integration with Microsoft Entra B2B so that guest accounts are created in the sharing directory.

## Step 1: Confirm how the content was shared

- **Anyone links do not work.** They do not create guest accounts, so B2B Sync does not support them. Share directly with named people.
- **External sharing must be on** at the organization level, set by a global or SharePoint admin. Sites can be equal to or more restrictive than the organization, never more permissive.
- To check a site: sign in to the SharePoint admin center, open **Active sites**, add the **External sharing** column to the view, select the site, and review its setting.
- If you add permissions on the advanced permissions page instead of using **Share site**, no invitation is sent. Tell the guest they have access. Grant permissions at site level, not on a single library or folder.

## Step 2: Check Conditional Access in the sharing tenant

The Learn page lists limitations that map to the most common failures:

| Policy | Effect on B2B Sync |
|---|---|
| MFA or terms of use prompts | Block sync, because the client cannot show interactive sign-in |
| Policy deployed before first sync | The sync relationship cannot be established |
| Policy deployed after first sync | The guest gets an error and cannot continue |
| Updated terms of use | Sync fails until the user accepts interactively |
| Device compliance | Not compatible, guest devices are managed by their own organization |
| Location-based access | Guests are usually outside trusted locations |

If sync stopped after a change, look for new MFA, terms of use, device compliance or location policies on the sharing tenant. A workable approach is to exclude the affected guests or the OneDrive and SharePoint apps from those policies, after a risk review. The Learn page does not recommend a specific policy design.

## Step 3: Review cross-tenant access settings

The cross-tenant access settings page on Microsoft Learn explains the pieces:

- **Inbound settings** control whether users from other Entra organizations can access your resources.
- **Outbound settings** control whether your users can access external organizations.
- **Trust settings** decide whether your Conditional Access policies accept MFA, compliant device and hybrid joined device claims from the other organization.
- **Default settings** apply to all external organizations, and **organizational settings** override them.

Defaults allow B2B collaboration for all internal users and do not trust MFA or device claims from other organizations. Learn warns that changing the default inbound or outbound settings to block access can break business-critical access.

Things that can block B2B collaboration, per the page:

- Conflicting settings. Access for users and groups must match access for applications.
- Blocking all apps by default. Users cannot read Office 365 Message Encryption mail unless app ID `00000012-0000-0000-c000-000000000000` is allowed.
- Conditional Access that blocks MFA registration or terms of use consent. The page names app IDs to allow for these cases and says inbound settings for them must be set through Microsoft Graph.
- Licensing. Trust settings and per-user, group or app access settings require Microsoft Entra ID P1. You need at least the Security Administrator role.

Trusting MFA does not remove your MFA policies. It only lets users who already completed MFA in their home tenant avoid repeating it. The B2B Sync page does not say that trust settings repair a sync that failed because of an MFA policy, so test with one guest before you change anything broadly.

Also note that tenant restrictions are independent from cross-tenant access settings. Changing inbound, outbound or trust settings does not affect them.

## Step 4: Check the guest and the client

- If the guest account was deleted or the permission removed, the sync app shows an error, a notification and a banner in the activity center.
- Removing a guest's access does not delete files that were already synced. They stay on the PC.
- The user opens the share link, selects **Organizational account**, browses to the library and selects **Sync**. Content goes into a folder named like `SharePoint - Contoso`.

## Step 5: Look for the block policy

A receiving organization can disable the feature with `BlockExternalSync`. On Windows:

```text
reg add "HKLM\SOFTWARE\Policies\Microsoft\OneDrive" /v BlockExternalSync /t REG_DWORD /d 1
```

On a Mac the page uses `defaults write BlockExternalSync -bool YES`. ADMX management needs templates from build 19.086 or later. If users in one organization cannot sync anything shared by others, check whether this policy is set.

## Common mistakes

- Sharing with Anyone links and expecting sync.
- Adding MFA or compliance requirements after guests already sync.
- Granting access on a folder instead of the site and skipping the invitation.
- Editing default cross-tenant settings when an organizational override would do.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)

## Sources

- [B2B Sync for SharePoint and OneDrive](https://learn.microsoft.com/en-us/onedrive/b2b-sync)
- [Cross-tenant access settings in Microsoft Entra External ID](https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-overview)
