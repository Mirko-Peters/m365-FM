---
title: "Connect Claude to Microsoft 365 Securely: A Governance Checklist"
summary: "How the Claude Microsoft 365 connector works, which Entra consent it needs, which data it can read, and which admin controls limit it: a checklist based on Anthropic's and Microsoft's documentation."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [claude, microsoft-365, governance, mcp]
keypoints:
  - "The connector uses delegated permissions. Claude acts as the signed-in user and can only reach what that user can already see in Microsoft 365."
  - "A Global Administrator must grant Microsoft Entra admin consent for two enterprise apps before work or school accounts can connect."
  - "The connector is read-only by default. Write tools for mail, files, calendar and Teams are optional and can be set to Always allow, Needs approval or Blocked."
  - "Entra controls such as Assignment required and revoking single Graph permissions narrow access further."
  - "Microsoft 365 admin center has an Agents > Tools > Registry page where admins can block MCP servers and connectors."
faq:
  - q: "Can Claude read everything in my Microsoft 365 tenant after the connector is enabled?"
    a: "No. According to Anthropic's help article, the connector uses delegated permissions, so Claude acts as each signed-in user and reaches only the data that user can already see. Members cannot see anything through Claude that they could not see in Microsoft 365 itself."
  - q: "Who has to approve the connector in Microsoft Entra?"
    a: "Anthropic's help article says a Global Administrator is required to grant Microsoft Entra admin consent. This can be done through Claude by checking the box to grant access on behalf of the whole organization, or manually in Entra ID for the two apps named M365 MCP Client for Claude and M365 MCP Server for Claude."
  - q: "Is the connector read-only?"
    a: "By default, yes. The help article describes search and read tools as the default. Write tools, such as sending mail or creating files and calendar events, are set per tool to Always allow, Needs approval or Blocked."
  - q: "Where can I see what Claude did in Microsoft 365?"
    a: "The Anthropic help article does not describe a Claude-side audit log of connector activity. It names the Microsoft Entra sign-in logs, starting with the non-interactive tab, as the documented way to investigate blocked connections. Check what logging your own plan provides before you rely on it for audits."
  - q: "How do admins control MCP servers and connectors across Microsoft 365?"
    a: "Microsoft Learn describes a Tools page in the Microsoft 365 admin center. Under Agents > Tools > Registry, admins can see plugins, skills, MCP servers and connectors, filter them by status and publisher, and Block or Unblock a selected tool."
---

Connecting Claude to Microsoft 365 is a governance decision, not only a setup task. Anthropic's Microsoft 365 connector works with delegated permissions, so Claude acts as each signed-in user and can reach only data that user can already open. Before the rollout, an admin should decide who may connect, which permissions stay granted, whether write tools are allowed, and how connection problems will be investigated. The checklist below follows the order of Anthropic's help article and adds the Microsoft-side controls.

Note on sources: the connector is an Anthropic product. The details about Claude come from Anthropic's help article for the Microsoft 365 connector. Microsoft Learn covers the Microsoft 365 admin center side. The pages read do not describe data retention or model-training use for connector data, so check Anthropic's separate security guide for that before approving.

## What the connector can access

Anthropic lists these delegated permissions:

- **Basic:** sign-in, profile, email address and offline access.
- **Outlook mail:** messages, metadata, accessible shared mailboxes, folder structure and mailbox settings.
- **Calendar:** the user's events and calendars shared with the user.
- **Teams:** chats, chat members, team and channel names, and channel messages.
- **Meetings:** online meetings, transcripts, AI insights and recordings.
- **Files:** OneDrive and SharePoint files and the sites the user can reach.
- **Directory:** basic profiles of all users, used for meeting availability.

Two limits are worth knowing. SharePoint search covers the whole tenant, and restricting it to specific sites is not supported. Mail search does not cover the Online Archive.

## Step 1: Enable the connector in Claude

This applies to Team and Enterprise plans. An owner opens **Organization settings** > **Connectors**, selects **+ Add**, chooses **All available**, and adds Microsoft 365. On other plans, members connect directly, and work or school accounts still need a Microsoft Entra tenant.

## Step 2: Grant Microsoft Entra admin consent

A Global Administrator must consent. There are two options in Anthropic's article.

1. **Through Claude:** go to **Customize** > **Connectors**, select **Connect** on Microsoft 365, sign in with the work or school account, and check the box to grant access on behalf of the whole organization.
2. **Manually in Entra ID:** register two service principals with Microsoft Graph Explorer and open the admin consent URL for each. The apps are **M365 MCP Client for Claude** and **M365 MCP Server for Claude**.

Anthropic notes that repeating admin consent restores all default permissions, including write permissions that were revoked earlier. Keep that in mind when you document your baseline.

## Step 3: Decide who may sign in

By default every user in the tenant can try to authenticate. To narrow this:

1. Open entra.microsoft.com and select each of the two enterprise applications.
2. Go to **Properties** and set **Assignment required?** to **Yes**.
3. Under **Users and groups**, assign the same people or groups to both apps.

## Step 4: Remove permissions you do not need

In the Entra enterprise application **M365 MCP Server for Claude**, open **Permissions**. On the **Admin consent** tab, use the **...** menu on a Microsoft Graph permission and select **Revoke permission**. Calls that need the revoked permission then fail with a "Failed to call tool" error. This is a way to keep, for example, Teams chat access off while mail and files stay on.

## Step 5: Treat write tools as a separate decision

The connector is read-only by default. Write tools can send and forward mail, manage drafts, create and update OneDrive and SharePoint files, manage calendar events and send Teams messages. If your tenant consented before write tools launched, a Global Administrator has to review and approve the updated permission set before write tools activate. After that, **Organization settings** > **Connectors** > **Microsoft 365** lets you set each write tool to **Always allow**, **Needs approval** or **Blocked**. On Enterprise plans, custom roles can scope write tools to certain users.

Points from the article that matter for risk:

- "Always allow" can let Claude use a tool without asking, including in some scheduled tasks.
- Creating or updating a calendar event notifies attendees automatically.
- Mail sent by Claude carries an attribution header. File, calendar and Teams writes are not tagged.
- Attachments are not supported in write tools.
- For organizations that added the connector before November 9, 2026, Anthropic describes limits on 11 Outlook, Calendar and Teams tools until at least December 9, 2026. After that date, unset tools move to **Needs approval**, and tools set to **Blocked** stay blocked. Organizations with HIPAA enabled are excluded from these default changes.

## Step 6: Check Conditional Access

Conditional Access policies that restrict location or sign-in frequency can block server-side requests. The token exchange happens on Anthropic's servers, so Entra sees Anthropic's outbound IP addresses. Anthropic suggests excluding its IP ranges for such policies but warns against doing so for device compliance policies. Test with a pilot group first, and look at the Entra sign-in logs when a user cannot connect. Anthropic points to the **User sign-ins (non-interactive)** tab first, then the Conditional Access tab, because the blocked server-side requests show up there. The member's own sign-in appears on the interactive tab and usually shows as successful.

## Step 7: Add the Microsoft 365 admin center view

Microsoft Learn describes a **Tools** page for AI tools in the organization. Sign in to the Microsoft 365 admin center and select **Agents** > **Tools** > **Registry**. The registry lists plugins, skills, MCP servers and connectors. You can filter by status and publisher and use **Block** or **Unblock** on a selected tool. The page does not list prerequisites or required admin roles, so confirm your role in a test tenant. Whether a third-party connector like this one appears there depends on how it is registered, which the pages read do not say.

## A short review list

| Question | Where to check |
|---|---|
| Who can authenticate? | Entra enterprise apps, Assignment required |
| Which data is reachable? | Entra enterprise app permissions |
| Can Claude write? | Claude connector settings, per tool |
| Why was a sign-in blocked? | Entra sign-in logs, Conditional Access |
| Which agent tools are in the tenant? | Microsoft 365 admin center, Agents > Tools |

## Typical mistakes

- Enabling write tools together with the first rollout. Start read-only.
- Granting consent for the whole organization without setting Assignment required.
- Assuming SharePoint access can be limited to a few sites. The article says it cannot.
- Expecting a Claude-side audit trail. The article does not describe one.

## Related

- [Claude](https://www.m365.fm/entity/claude/)
- [Governance](https://www.m365.fm/entity/governance/)
- [Model Context Protocol](https://www.m365.fm/entity/mcp/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)

## Sources

- [Enable and use the Microsoft 365 connector (Claude Help Center)](https://support.claude.com/en/articles/12542951-enable-and-use-the-microsoft-365-connector)
- [Overview of the Tools page in Microsoft 365 admin center (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoft-agent-365/admin/agent-tools-overview)
