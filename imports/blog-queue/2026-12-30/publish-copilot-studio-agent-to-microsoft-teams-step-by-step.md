---
title: "Publish a Copilot Studio Agent to Microsoft Teams: Steps, Availability Options and Limits"
summary: "Publish a Copilot Studio agent to Microsoft Teams and Microsoft 365 Copilot using Microsoft Learn: prerequisites, the Channels steps, availability options, submitting to the org catalog for admin approval, authentication notes, admin steps and the documented limitations."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [copilot-studio, teams]
keypoints:
  - "Publish the agent at least once and share it with users first. Your organization must also allow Power Platform apps in Teams, or users cannot install the agent."
  - "Open the agent, select Channels, then the Microsoft 365 and Microsoft Teams tile. Under Turn on Microsoft 365 you can also select Make agent available in Microsoft Copilot. Select Add channel."
  - "Availability options are Copy link, Show to my teammates and shared users, Download .zip, and Show to everyone in my org with Submit to org catalog for admin approval."
  - "Content changes need no re-approval. Changes to the icon or descriptions require a new approval for admin-approved agents."
  - "In group and channel chats, agents cannot use knowledge sources that require end-user authentication such as SharePoint, so those agents work only in 1:1 chats."
faq:
  - q: "What do I need before publishing to Teams?"
    a: "According to Microsoft Learn, the agent published at least once, shared with the users who will use it, and an organization setting that allows Power Platform apps in Teams."
  - q: "Where is the channel setting?"
    a: "In Copilot Studio open the agent, select Channels on the top menu, then the Microsoft 365 and Microsoft Teams tile and select Add channel."
  - q: "How do I make it available to everyone in the organization?"
    a: "Select Availability options, then Show to everyone in my org, review the requirements, select Submit to org catalog and confirm. The agent goes to your admin for approval."
  - q: "Do I need approval after each change?"
    a: "No for content changes. Changes to the icon or descriptions need a new approval for admin-approved agents."
  - q: "How do I disconnect the agent?"
    a: "Select Remove channel, then Disconnect. Existing installs remain until uninstalled, and admin-approved agents stay in the store until an admin removes them."
---

Copilot Studio agents reach users in Microsoft Teams and Microsoft 365 Copilot through the Microsoft 365 and Microsoft Teams channel. This guide follows the Microsoft Learn article on publishing to Teams.

## Prerequisites

- All agent users in your organization can use Microsoft Copilot.
- Agent makers can create and access a Copilot Studio environment.
- You published the agent at least once. Users cannot interact with it in Teams before that.
- You shared the agent with the users who will install and chat with it.
- Your organization allows Power Platform apps in Teams. If it is disabled, users cannot install the agent or find it in the Teams app store.

## Steps

1. Open your agent in Copilot Studio and select **Channels** on the top menu.
2. Select the **Microsoft 365 and Microsoft Teams** tile.
3. Under **Turn on Microsoft 365**, select **Make agent available in Microsoft Copilot** if you want it in both. If you leave it cleared, the agent is available only in Teams.
4. Select **Add channel**.
5. Optionally select **Edit details** to change the icon, color and descriptions, then **Save**.
6. Select **See agent in Teams** to install it for yourself, then **Add**. In Microsoft Copilot, type @ and pick your agent to test it.

## Availability options

| Option | What it does |
| --- | --- |
| Copy link | Share a link. Only users with access can use it. It does not work in the Teams mobile app |
| Show to my teammates and shared users | Lists the agent in Shared with you in the Microsoft 365 Agent Store |
| Download .zip | Advanced. Upload as a custom app in Teams through Apps, Manage your apps, Upload an app |
| Show to everyone in my org | Select Submit to org catalog and confirm. Your admin approves the agent |

When the status shows Approved you can open the agent and share the approved link.

## Authentication and access

To keep people outside your organization from using the agent, turn on the security settings for agents built for Teams, Microsoft Copilot or internal use. Learn links a separate article for those steps. A user who can install an agent may still be unable to chat with it if it is not shared with them or a security group. Check access and retest with that account.

## Limitations

- Agents with user authentication cannot explicitly sign out, which fails Teams Marketplace certification but not personal or tenant use.
- In group and channel chats, agents cannot use knowledge sources that require end-user authentication such as SharePoint. They work only in 1:1 chats.
- Group and meeting chats do not support manual authentication with SSO for Teams.
- Admin-approved agents cannot set an avatar icon. They use the app icon.
- Teams applies rate limiting, so keep published content concise.
- After you disconnect the channel, users might still reach the agent for a few minutes.

For Microsoft Copilot, there is no Conversation Start topic, GIFs and some media do not render, files and speech are not supported, and handoff to a customer service representative is not supported.

## Admin steps in Teams

Admins approve or reject submissions on the Manage apps page. Once approved, availability is managed in Built for your org in the Teams app store and Built by your org in the Microsoft 365 Agent Store, and only an admin can remove the agent. App setup policies can install and pin the agent automatically. For a SystemError caused by an old cached version, turn the app off in the Teams admin center, wait a few seconds and turn it back on.

## Update after publishing

Content changes do not need re-approval, so publish as often as needed. Changes to icon or descriptions require a new approval for admin-approved agents. Users who installed from a link or Shared with you must reinstall to see detail changes. New content does not appear in ongoing conversations, so enter start over. Do not reduce access below everyone in the organization after submitting for approval.

## A rollout suggestion

This section is a suggestion, not Microsoft guidance. Install it yourself first, share it with a pilot group, and submit to the org catalog only after testing in a group chat and a 1:1 chat.

## Not covered

The page does not give approval timelines or review criteria, exact Teams admin center navigation beyond Manage apps, or licensing and pricing.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Connect and configure an agent for Teams and Microsoft Copilot (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)
