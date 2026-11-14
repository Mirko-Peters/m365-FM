---
title: "Is Microsoft Teams Secure? Encryption, End-to-End Limits and Safe File Sharing"
summary: "What Microsoft documents about Teams security: encryption in transit and at rest, end-to-end encryption limits, where data lives, shared channels, guest access and the admin controls for safe sharing."
status: review
publish: false
author: mirko-p
date: 2026-11-28
topics: [teams, purview, conditional-access]
keypoints:
  - "Teams encrypts data in transit and at rest by default. Microsoft names TLS 1.2 or later with AES-256 for transit, and BitLocker plus per-file encryption at rest."
  - "End-to-end encryption covers audio, video and video-based screen sharing in one-to-one calls and meetings. It does not cover chat or shared files, and meetings need Teams Premium."
  - "Teams data stays in the tenant and in the geographic region of your organization, according to Microsoft's security and compliance overview."
  - "A shared channel has its own SharePoint site. Only channel members can open its files, and parent team members and admins are excluded unless they join."
  - "Safe sharing depends on settings: external access, guest access, sensitivity labels, DLP, retention and Conditional Access are all admin choices."
faq:
  - q: "Is Microsoft Teams encrypted?"
    a: "Yes. Microsoft Learn says Teams data is encrypted in transit and at rest in Microsoft services. Standard encryption uses TLS 1.2 or later with AES-256 for data in transit and a combination of BitLocker disk encryption and per-file encryption for data at rest. Customer Key can add organization-managed keys."
  - q: "Does Teams offer end-to-end encryption?"
    a: "Only for specific cases. Microsoft Learn says end-to-end encryption covers audio, video and video-based screen sharing in one-to-one calls and in meetings. It does not cover chat. For meetings the organizer must require it when scheduling, and meetings need Teams Premium."
  - q: "Where are Teams chats and files stored?"
    a: "Microsoft's security and compliance overview says data in Teams resides in the geographic region associated with your Microsoft 365 organization and that customer data stays within the tenant. The page says files go through SharePoint, and it names Exchange for messages, but it does not give a full location map."
  - q: "Who can see files in a shared channel?"
    a: "According to Microsoft Learn each shared channel has its own SharePoint site. Only owners and members of the channel can access its content. People in the parent team and admins do not have access unless they are also channel members."
  - q: "How do I share files with external people more safely?"
    a: "Microsoft Learn describes shared channels with Microsoft Entra B2B direct connect and cross-tenant access settings, and guest access through guest accounts. Sensitivity labels, Conditional Access policies from the host organization and standard SharePoint file sharing controls apply. The right option depends on your policies."
---

Microsoft documents Teams as encrypted in transit and at rest, with data kept in your tenant and region. That covers the transport and storage layers. Whether a specific file share is safe depends on settings you control: who is inside a channel, whether guests or external partners are allowed, how files are labeled and which sharing links exist. This article separates what Microsoft guarantees from what you configure.

## Encryption in transit and at rest

Microsoft Learn describes standard encryption in Teams as active by default, with no setup by users or admins:

- **In transit:** TLS 1.2 or later with AES-256, protecting data between devices and Microsoft servers. Media uses SRTP.
- **At rest:** data in Azure, SharePoint, OneDrive and other Microsoft 365 services is protected with BitLocker disk encryption and per-file encryption.
- **Service encryption:** adds a layer by encrypting Teams data before it is sent to the data store, with keys managed by Microsoft. Learn says it is available for media content.
- **Customer Key:** organizations can provide their own keys through Microsoft Purview Customer Key. It can apply to Teams files, chat messages and other content.

Microsoft's security guide adds that enterprise data is encrypted at rest so organizations can decrypt content when needed, for example for eDiscovery.

## End-to-end encryption has a narrow scope

End-to-end encryption (E2EE) is not the default and it does not cover everything:

- **One-to-one calls:** disabled by default. An admin must enable it and both participants must turn it on in their Teams settings.
- **Meetings:** the admin policy is on by default, but a meeting is end-to-end encrypted only when the organizer requires it at scheduling. Learn says E2EE for meetings requires Teams Premium.
- **Covered:** audio, video and video-based screen sharing.
- **Not covered:** group calls, channel meetings, chat messages, shared files, recordings, transcripts and meeting recap. Calls involving the PSTN are not supported.

There is a trade-off. Learn says E2EE disables features such as recording, transcription and AI-powered recap, limits server-side retention and eDiscovery, and is not compatible with compliance recording.

## Where the data lives

The Teams security and compliance overview says data resides in the geographic region associated with your organization and that customer data stays within the tenant. It also says Microsoft does not have access to uploaded content, and it states that files are stored in SharePoint and OneNote notes in the team site. The page describes data flowing to both Exchange and SharePoint for messages and files but does not list every location.

## File sharing across teams

Where you share matters more than which button you press.

**Standard channels.** Microsoft states that SharePoint encryption handles files stored in SharePoint, so SharePoint permissions and sharing settings apply to those files. The pages read for this article do not describe the exact link and permission behavior for chats and standard channels, so check Microsoft's Teams and SharePoint integration documentation before you rely on it.

**Shared channels.** Learn describes a stricter model:

- Each shared channel has its own SharePoint site. Only channel owners and members can access it. People in the parent team and admins cannot, unless they join the channel.
- Only team owners can create shared channels. The channel owner adds and removes people.
- External participants join through Microsoft Entra B2B direct connect. This also needs cross-tenant access settings on both sides, and guest access must be enabled in Teams to invite them.
- Files can be shared with people outside the channel, but not outside the organization, through standard SharePoint sharing.
- Removing a user from the channel does not remove access they were given directly to a file, folder or notebook through SharePoint.

**Guest access.** Microsoft's security guide says guest access lets you create guest accounts for people outside your organization to reach teams, documents in channels, chats and apps while you keep control of corporate data.

## Controls that make sharing safer

- **Sensitivity labels:** in shared channels, only labels from the host organization apply to documents. An encrypted file cannot be opened by external participants unless permissions are granted.
- **Conditional Access:** supported policies from the host organization apply to B2B direct connect users. The external organization's policies are not used. Supported controls include MFA, a compliant device or a Microsoft Entra hybrid joined device.
- **Purview:** the overview lists communication compliance, retention policies, DLP, eDiscovery, legal hold and audit.
- **Information barriers:** effective only for users in the host organization, so they do not apply to external participants in another organization's shared channel.
- **Meeting controls:** admins choose which external participant types can join and who enters through the lobby.
- **External access:** Microsoft says it must be enabled by both organizations. Users from organizations without external access are treated as anonymous.

Learn adds that changes in Teams admin settings can take up to 24 hours, and Teams content can take up to 24 hours to be discoverable.

## A practical safe-sharing checklist

1. Decide per project: standard channel, shared channel or guest access.
2. Apply a sensitivity label to the files that need one.
3. Review who is a channel member. Direct file shares survive channel removal.
4. Check the host Conditional Access policy for external users.
5. Do not rely on E2EE unless you accept losing recording and transcription.
6. Set retention and audit so you can answer questions later.

Microsoft also says no system can guarantee complete security. The honest answer to "is Teams secure" is that the platform is encrypted and certified, and the remaining risk sits in permissions, guests and user behavior.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Microsoft Learn: Encryption in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/teams-encryption)
- [Microsoft Learn: Teams security guide](https://learn.microsoft.com/en-us/microsoftteams/teams-security-guide)
- [Microsoft Learn: Security and compliance in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/security-compliance-overview)
- [Microsoft Learn: Shared channels in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/shared-channels)
