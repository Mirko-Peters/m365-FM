---
title: "Teams Shared Channels With Several External Entra Tenants: Troubleshooting Guide"
summary: "When a Teams shared channel works for one partner tenant but not another, check cross-tenant access settings on both sides, the channel policy, how the person was added, and host Conditional Access. A checklist based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [shared-channels, cross-tenant-access-settings, b2b-collaboration, teams]
keypoints:
  - "Shared channels with outside organizations use Entra B2B direct connect, which needs mutual trust. Both tenants must enable it in their own cross-tenant access settings."
  - "Configure each partner as its own organization under Cross-tenant access settings. Org-specific settings override the defaults, which block B2B direct connect."
  - "Check the Teams channel policy and that guest access is enabled in Teams, even though external participants do not use guest accounts."
  - "Add external people by UPN if it differs from the email address, and search with ext:user@domain.com if they also have a guest account."
  - "Host Conditional Access applies. Without trust settings for MFA or device claims, the partner can be blocked."
faq:
  - q: "Why does a shared channel work for one partner tenant but not another?"
    a: "Microsoft Learn says B2B direct connect is possible only when both organizations allow access to and from each other. Each partner needs its own mutual configuration, so a channel can work with one tenant whose admin completed the settings and fail with another tenant whose admin did not."
  - q: "Can guests be added to a shared channel?"
    a: "No. Microsoft Learn states that guests with Entra guest accounts in your organization cannot be added to a shared channel. People outside the organization take part through B2B direct connect, and guest access must still be enabled in Teams to invite them."
  - q: "Who can change cross-tenant access settings?"
    a: "Microsoft Learn says you need at least the Security Administrator role to configure them in the Microsoft Entra admin center. Teams administrators can read these settings but cannot change them."
  - q: "Are there size limits that matter when sharing with many organizations?"
    a: "Microsoft Learn lists up to 50 teams a channel can be shared with, excluding the parent team, and 5,000 direct members in a shared channel. The limits page does not give a separate cap on external tenants."
---

If a shared channel works with one partner tenant but not another, the cause is usually on the setup side: B2B direct connect needs matching settings in both tenants, and each partner has to be configured on its own. Work through the checks below in order. They follow Microsoft Learn's documentation for shared channels and for B2B direct connect.

## How the pieces fit together

Shared channels let people outside a team, and outside the organization, take part. Learn says guests with Microsoft Entra guest accounts cannot be added to a shared channel. External people join through **Microsoft Entra B2B direct connect**, a mutual trust relationship between two Entra organizations. Users sign in with their home credentials and see the channel in their own Teams.

Two rules from Learn matter most when several tenants are involved:

- B2B direct connect needs mutual trust. Both the resource organization and the external organization must enable it in their cross-tenant access settings.
- Initially, Entra blocks inbound and outbound B2B direct connect for all external tenants. Learn says you can usually keep the defaults and enable access for individual organizations.

So with three partners, you have three separate relationships, each with two sides to configure.

## Step 1: Check the Teams channel policy

Shared channels are enabled by default. Admins control, through a channel policy, whether people can create shared channels, whether they can share them with people outside the organization and whether they can take part in external shared channels. Check the policy for the host owner and for the external user.

Also confirm that guest access is enabled in Teams. Learn says external participants do not use guest accounts, but guest access in Teams must be enabled to invite them.

## Step 2: Check cross-tenant access settings for each partner

Sign in as at least a Security Administrator and open the Microsoft Entra admin center. Go to **Entra ID** > **External Identities** > **Cross-tenant access settings**.

1. Select the **Organizational settings** tab and check that the partner is listed. If not, select **Add organization** and enter the full domain name or the tenant ID.
2. A new organization inherits the default settings. Select **Inherited from default** under **Inbound access** or **Outbound access** to customize them.
3. On the **B2B direct connect** tab, allow access for the users and applications that need it. Set both **Inbound access** and **Outbound access** where your users and the partner's users must work in each other's channels.
4. Ask the partner admin to do the same in their tenant, for the direction that points to you.

Learn notes that blocking all external users also blocks all your internal applications from being shared through B2B direct connect, and the same applies to blocking all your users for outbound access. Targeting specific users, groups or applications needs Entra ID P1 or P2 on the configuring tenant, and user or group targeting is not available in the default settings.

If a user cannot be selected for outbound targeting, Learn mentions users with SMS-based authentication. The documented workarounds are to add the object ID through Microsoft Graph or to target a group the user belongs to.

## Step 3: Check how the person was added

- Only the shared channel owner can directly add or remove people.
- Learn says external participants must be added with their UPN, not their email address, if the two do not match in Entra ID.
- If the external person also has a guest account in your tenant, search for `ext:user@domain.com` in the Teams admin center to get the external participant account instead of the guest account.

## Step 4: Check Conditional Access and trust settings

Conditional Access policies from the host organization apply to B2B direct connect users, and the partner's own policies are not used. Learn lists the supported policies as those scoped to **All guest and external users** and the **Office 365 SharePoint Online** cloud app, with controls such as MFA, compliant device or hybrid joined device.

If your policies require MFA, you must configure inbound trust settings so they accept MFA claims from the partner. On the **Trust settings** tab, the options are:

- **Trust multi-factor authentication from Microsoft Entra tenants**
- **Trust compliant devices**
- **Trust Microsoft Entra hybrid joined devices**

Learn warns that if **Trust compliant devices** is off for the user's home tenant, policies that require device compliance can block external users, even when their device is compliant at home. Enable it only for organizations whose compliance policies you trust.

IP-based policies apply at the SharePoint file level. A participant may join the channel from a restricted location and still be blocked when opening a file.

## Step 5: Check files, labels and limits

- Only owners and members of the channel can open its SharePoint site content. Admins and parent team members have no access unless they are channel members.
- A file encrypted by a sensitivity label cannot be opened by external participants unless permissions are granted.
- Only Entra work or school accounts are supported for external participants.
- Learn's limits table gives up to 50 teams a channel can be shared with, excluding the parent team, and 5,000 direct members. It does not list a separate cap on external tenants.
- Shared channels are not supported in class teams.

## Step 6: Check ownership and who does what

External participants cannot create, delete or edit a channel, add members or manage tabs and apps. They can leave the channel. If the last owner leaves and no member from your organization can be promoted, the channel stays ownerless and a Teams admin must assign an owner.

## What the read pages do not describe

The Learn pages used here do not give a propagation time for cross-tenant access changes, and they have no dedicated troubleshooting section for shared channels. If a setting looks right on both sides and access still fails, collect the user's UPN, both tenant IDs and the exact error, and open a support case.

## Related

- [Shared channels](https://www.m365.fm/entity/shared-channels/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Microsoft Learn: Shared channels in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/shared-channels)
- [Microsoft Learn: Configure cross-tenant access settings for B2B direct connect](https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-settings-b2b-direct-connect)
- [Microsoft Learn: B2B direct connect overview](https://learn.microsoft.com/en-us/entra/external-id/b2b-direct-connect-overview)
- [Microsoft Learn: Limits and specifications for Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/limits-specifications-teams)
