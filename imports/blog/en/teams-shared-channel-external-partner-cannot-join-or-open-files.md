---
title: "Teams Shared Channels With Another Company: Fix Missing Users and Blocked Files"
summary: "You cannot add a partner to a shared channel, or they join but the Files tab fails? Check Teams channel policies, two-way B2B direct connect, trust settings and the separate channel site."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [shared-channels, cross-tenant-access-settings, guest-access]
keypoints:
  - "External people in a shared channel use B2B direct connect, not guest accounts. Guests cannot be added to a shared channel at all."
  - "Direct connect only works when both organizations allow it, inbound and outbound, in Microsoft Entra cross-tenant access settings. Blocked is the default."
  - "If your Conditional Access policies require MFA, you must configure inbound trust settings so the partner's MFA claims are accepted."
  - "Files live on a separate SharePoint site for the channel. Anonymous Anyone links are not part of Microsoft's description of shared channel file sharing."
faq:
  - q: "Can I add a guest to a shared channel?"
    a: "No. Microsoft says guests, including guests that were converted to members, cannot be added to a shared channel. People from outside your organization take part through Microsoft Entra B2B direct connect. Guest access in Teams still has to be enabled to invite them."
  - q: "Do I need to configure anything in the partner's tenant?"
    a: "Yes. Microsoft states that B2B direct connect requires mutual trust. Your inbound and outbound settings are not enough if the partner's organization has not enabled the matching settings for your organization."
  - q: "Do external shared channel members appear as users in my Entra directory?"
    a: "No. According to Microsoft, B2B direct connect users have no presence in your directory and no guest user object. The shared channel owner manages them in the Teams client."
  - q: "How long do cross-tenant access changes take?"
    a: "The current Entra page on B2B direct connect does not state a time. An archived Teams page says up to six hours, and the Teams policies page says policy changes can take up to 24 hours. Plan for a delay before you retest."
---

A partner company should work with you in a Teams shared channel. But their person does not show up when you try to add them. Or the person can post, and the **Files** tab opens empty or shows an access error. These cases appeared in several Microsoft Q&A threads between February 2025 and January 2026. This article turns Microsoft's documentation into one ordered check. It is not an official Microsoft procedure. Statements from threads are labeled as such, and none of the threads below has a confirmed fix from the person who asked.

## What the threads describe

- In February 2025, an administrator could add external users to teams but not to shared channels, even with default cross-tenant settings. A short answer said that the partner's organization must enable the relationship too, and to allow up to 24 hours for changes. The answer did not say who wrote it.
- In September 2025, a user asked how partners could use a channel from their own Teams without switching accounts. A moderator listed the setup: B2B direct connect, a shared channel, and external access and guest access in the Teams admin center. The person did not reply.
- In December 2025, an organization invited into a partner's shared channel could post, but the **Files** tab was empty and a direct link said access was blocked by a policy issue. Both tenants had matching cross-tenant settings, and sign-in logs showed MFA satisfied. The same setup worked in the other direction. A moderator called it a cross-tenant misconfiguration and pointed to a support ticket. The person said they would open one.
- In January 2026, someone reported that the **Anyone** link option had disappeared from a shared channel site.

## Step 1: Understand the model

Microsoft's page on [shared channels](https://learn.microsoft.com/en-us/microsoftteams/shared-channels) says guests cannot be added to a shared channel. External participants use Microsoft Entra B2B direct connect, which sets up mutual trust between two organizations. The [B2B direct connect overview](https://learn.microsoft.com/en-us/entra/external-id/b2b-direct-connect-overview) adds the practical effects:

- The external person signs in with the home account and opens the channel from their own Teams, without switching tenants.
- They have no user object in your directory and are managed by the shared channel owner in Teams.
- B2B direct connect currently works only with Teams shared channels.
- A guest from B2B collaboration cannot see shared channels in your team.

This answers the September 2025 question. Account switching is what you get with guest access. Direct connect avoids it, but both sides must be set up.

## Step 2: Check the Teams channel policies

In the Teams admin center, open **Teams**, then **Teams policies**. The channel policy has three toggles:

- **Create shared channels**: team owners can create shared channels.
- **Invite external users to shared channels**: owners and members of shared channels can invite external participants from organizations where a cross-organization trust has been configured.
- **Join external shared channels**: your users can join shared channels of other organizations.

For the first scenario you need the first two on your side. For your people to join the partner's channel, the third one must be on. Microsoft says policy changes can take up to 24 hours. Microsoft says team owners can create shared channels when that policy is on. The shared channels page also says only the shared channel owner can directly add or remove people, while the policies page says owners and members can invite, so check who actually has the owner role.

## Step 3: Set cross-tenant access on both sides

This is the step that most often explains a missing user. B2B direct connect is blocked by default, inbound and outbound. Microsoft's [setup page](https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-settings-b2b-direct-connect) requires at least the Security Administrator role to change it. Teams administrators can read these settings but cannot change them.

In the Microsoft Entra admin center, go to **Entra ID**, then **External Identities**, then **Cross-tenant access settings**. The setup page describes enabling direct connect per organization:

1. Select **Organizational settings**, then **Add organization**. Enter the partner's full domain name or tenant ID and select **Add**.
2. Select the link under **Inbound access**. On the **B2B direct connect** tab choose **Customize settings**, then under **External users and groups** choose **Allow access**. On the **Applications** tab choose **Allow access** as well.
3. Select the link under **Outbound access** and do the same: **Allow access** for **Users and groups** and for **External applications**.
4. Ask the partner's admin to do the mirror image for your organization.

The mutual part is the point. The setup page says both organizations need to enable B2B direct connect with each other, and the overview page gives an example: Contoso can allow inbound access from Fabrikam, but sharing is not possible until Fabrikam enables outbound access to Contoso. If you pick **Select applications**, an archived Teams admin article chose **Office 365**, which covers Teams and SharePoint. That article is retired, so verify the choice against the current Entra pages. Choosing specific users, groups or applications instead of everyone needs Microsoft Entra ID P1 (inbound) or P1 or P2 (outbound), according to the setup page.

## Step 4: Handle trust settings and Conditional Access

If your Conditional Access policies require MFA and you allow direct connect with a partner, Microsoft says you must configure the inbound **Trust settings** so that MFA claims from that organization are accepted. If the person already completed MFA at home, they get in. If not, they are blocked. The same page describes **Trust compliant devices** and **Trust Microsoft Entra hybrid joined devices**. Without them, a partner on a compliant device can still fail a compliant-device requirement in your tenant.

Microsoft's shared channels page adds that only the host organization's Conditional Access policies apply to direct connect users. Supported policies are those scoped to **All guest and external users** and the **Office 365 SharePoint Online** cloud app, with grant controls for MFA, a compliant device or a hybrid joined device. Look at the host tenant's sign-in logs for the failed sign-in. The Learn pages in the sources do not describe how these sign-ins are labeled, so check the log details in your own tenant.

## Step 5: Add the person correctly

Learn lists several details that cause "I cannot find them":

- Guests, including those converted to members, cannot be added.
- If the external person also has a guest account in your organization, Learn says to search for `ext:user@domain.com` to get their organization account instead of the guest account.
- Add external participants by their UPN if it differs from their email address in Microsoft Entra ID.
- People who must not communicate under information barrier policies cannot be in the channel.

If the partner is still missing, the usual cause is the partner side of Step 3. In the 2023 thread I reviewed for background, a moderator's accepted answer said the same: when the external organization does not allow direct connect, the user's address is not listed. The person who asked later wrote that they had completed those steps and the user still did not appear, so this is the usual cause, not a guaranteed one.

## Step 6: The Files tab and the channel site

Each shared channel has its own SharePoint site. Only people with owner or member permissions in the channel can reach it. Site membership follows the channel membership, and you cannot manage site permissions separately in SharePoint. Members of the parent team and admins have no access unless they are channel members.

In the December 2025 thread, the file problem appeared although the Teams side worked. Compare what Microsoft says about files:

- IP-based Conditional Access policies apply at the SharePoint file level. A partner can reach the channel from a restricted location and still be blocked when opening a file.
- The SharePoint organization-level and site-level sharing settings must allow guests, and the partner's domains must not be blocked. This is from the archived admin article, so verify it for your tenant.

If both are fine, collect the sign-in log entries for the failed file access and open a support case. That is where the December 2025 thread ended.

## Step 7: Sharing files with people outside the channel

The January 2026 thread asked why **Anyone** links vanished from a shared channel site. A moderator said it was a Teams-side governance change and that existing anonymous links may keep working until a file or its permissions change. There was no link to an official announcement, so treat that as unconfirmed. What Microsoft's page does say is that files in a shared channel can be shared with people outside the channel, but not outside the organization, with standard SharePoint file sharing. For mass distribution to external people, the moderator suggested a separate SharePoint communication site. Decide for yourself whether that fits your case.

## Limits to know

- Shared channels between the Commercial and GCC clouds are not supported, according to the archived admin article.
- Deleted shared channels can be restored within 30 days.

## Related

- [Shared channels](https://www.m365.fm/entity/shared-channels/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [Guest access](https://www.m365.fm/entity/guest-access/)

## Sources

- [Microsoft Learn: Shared channels in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/shared-channels)
- [Microsoft Learn: B2B direct connect overview](https://learn.microsoft.com/en-us/entra/external-id/b2b-direct-connect-overview)
- [Microsoft Learn: Set up B2B direct connect with an external organization](https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-settings-b2b-direct-connect)
- [Microsoft Learn: Teams policies](https://learn.microsoft.com/en-us/microsoftteams/teams-policies)
- [Microsoft Learn (archived): Collaborate with external participants in a shared channel](https://learn.microsoft.com/en-us/microsoft-365/solutions/collaborate-teams-direct-connect)
- [Microsoft Q&A: Shared channel, externals users and Entra B2B Connect (February 2025)](https://learn.microsoft.com/en-us/answers/questions/4426691/shared-channel-externals-users-and-entra-b2b-conne)
- [Microsoft Q&A: External users having issues with accessing Teams channels (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5564780/external-users-having-issues-with-accessing-teams)
- [Microsoft Q&A: Can't access documents in shared channel (December 2025)](https://learn.microsoft.com/en-us/answers/questions/5648313/cant-access-documents-in-shared-channel)
- [Microsoft Q&A: Anyone links unavailable in Shared Channel sites (January 2026)](https://learn.microsoft.com/en-us/answers/questions/5742590/discrepancy-in-external-sharing-anyone-links-unava)
- [Microsoft Q&A: Unable to add external user to Shared Channel (2023, background)](https://learn.microsoft.com/en-us/answers/questions/1405863/unable-to-add-external-user-to-shared-channel)
