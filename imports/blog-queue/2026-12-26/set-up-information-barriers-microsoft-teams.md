---
title: "Set Up Information Barriers in Microsoft Teams: Modes, Prerequisites and Limits"
summary: "Set up information barriers for Microsoft Teams: what they block in chats, calls, meetings and search, the scoped directory search prerequisite, Open, Implicit and Owner Moderated modes, SharePoint handling and documented limits."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [information-barriers, teams]
keypoints:
  - "Information barriers prevent individuals or groups from communicating. In Teams they cover team and channel membership and content, chats, calls, meetings, screen sharing and search."
  - "Enable scoped directory search in Teams first and wait at least a few hours before you set up or define policies."
  - "Modes for Teams are Open, Implicit and Owner Moderated. Teams created before activation default to Open and need updating to Implicit."
  - "IB policies do not apply to the SharePoint site connected to a team by default. Enabling IB for SharePoint follows a separate article."
  - "Limits include 5,000 segments in the current mode and 250 in legacy mode, and a meeting chat roster capped at 1,000 users."
faq:
  - q: "What is required before defining policies?"
    a: "According to Microsoft Learn, you must enable scoped directory search in Microsoft Teams and wait at least a few hours after enabling it before you set up or define policies for information barriers."
  - q: "Which role manages the policies?"
    a: "Learn says the IB Compliance Management role is responsible for managing information barrier policies. Permissions are covered in the Microsoft Purview permissions article."
  - q: "What are the Teams modes?"
    a: "Open means no policies apply and is the default for groups provisioned before information barriers were enabled. Implicit is the default for teams provisioned afterwards. Owner Moderated lets the team owner add members per their policy."
  - q: "How many segments can I have?"
    a: "Learn says up to 5,000 segments in the current mode, which needs the organization to be out of Legacy mode. In Legacy mode the limit is 250 segments and each user can belong to only one."
  - q: "Are federated external users restricted?"
    a: "Learn says users from federated external organizations are not restricted by information barrier policies, but your users remain restricted when communicating with them."
---

Information barriers (IB) are policies that prevent individuals or groups from communicating with each other. In Microsoft Teams they affect chats, calls, meetings, membership and search. This guide follows the Microsoft Learn article on information barriers in Teams, which gives a high-level outline and links to other pages for the detailed steps.

## What IB blocks in Teams

- **Membership and content:** adding a user to a team or channel, and user access to team or channel content.
- **Chat:** access to one-to-one and group chats. If a conversation violates a policy, it is not started.
- **Calls:** a voice call is blocked when a violation exists.
- **Meetings:** invitees who violate a policy are not allowed to join.
- **Screen sharing:** not allowed when a policy is violated.
- **Search and discovery:** users are not visible in the people picker.

Existing communications are re-evaluated when policies change. A blocked one-to-one chat becomes read-only, and a user who becomes blocked in a group chat is removed from it.

## Prerequisites

- **Licensing:** the page only points to the subscription requirements and lists no licenses.
- **Role:** the IB Compliance Management role manages IB policies.
- **Scoped directory search:** required. Enable it in Teams before you set up or define policies, and wait at least a few hours afterwards.

The page does not mention an Entra address book policy.

## Setup outline

1. Manage segments and policies in the Microsoft Purview portal or with PowerShell. The article points to other pages for the detailed steps.
2. Set the IB mode for each team. Teams created before IB activation default to Open. After you activate IB policies, update existing teams to Implicit, for example with `Set-UnifiedGroup -InformationBarrierMode Implicit`. A linked script updates all existing teams.
3. Handle SharePoint separately: IB policies do not apply to the site connected to a team by default, and enabling IB for SharePoint and OneDrive follows a separate article. If you change the mode of existing Teams-connected groups, also update the IB modes of the associated SharePoint sites.

### Modes

- **Open:** no policies apply. Default for groups provisioned before IB was enabled.
- **Implicit:** default for teams provisioned after IB is enabled. All compatible users can be added.
- **Owner Moderated:** the team owner can add members per their IB policy, which allows moderated collaboration between users in incompatible segments.

## How changes are applied

A background processor receives change notifications for user or group changes, evaluates the group's mode and each member's policies, and removes non-compliant users from the group and team. The page does not say how long this takes.

## Limits

- **Current mode:** up to 5,000 segments, and users can belong to multiple segments. This needs the organization to be out of Legacy mode and extra steps to change the IB mode.
- **Legacy mode:** up to 250 segments, and each user can belong to only one segment.
- **Meetings:** the meeting chat roster is capped at 1,000 users, and Teams enforces a separate 1,000-user meeting limit. Teams pre-adds 750 users when a large audience is invited. Once the roster is full, more users cannot be added. Teams Town Hall is recommended for audiences larger than 1,000.
- **Channel meetings:** non-members cannot join when IB is enabled.
- **Federation:** users from federated external organizations are not restricted by IB policies.

## A rollout order

This order is my advice, built from the page, not a Microsoft procedure.

1. Enable scoped directory search and wait.
2. Define segments and policies in the Purview portal.
3. Update existing teams to Implicit, and update the IB modes of connected SharePoint sites if you changed the mode of Teams-connected groups.
4. Test chats, a call, a meeting invite and people search between two incompatible users.

## Why the mode matters

The mode decides who can be added to a team. A team in Open mode ignores your policies, so users in incompatible segments can still be added until you change it. Implicit mode applies the policies automatically. Owner Moderated mode is the exception for teams that must collaborate across segments under the owner's control. After activation, review existing teams one by one or with the linked script, and remember that private channels are only described as complying with the policies you configure.

## Not covered

The page gives no licensing detail, no portal or PowerShell steps for segments and policies, no timing for policy application and no detail for shared channels, which have their own article.

## Related

- [Information barriers](https://www.m365.fm/entity/information-barriers/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Information Barriers in Microsoft Teams (Microsoft Learn)](https://learn.microsoft.com/purview/information-barriers-teams)
