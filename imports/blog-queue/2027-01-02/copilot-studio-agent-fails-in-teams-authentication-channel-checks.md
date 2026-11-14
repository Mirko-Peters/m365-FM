---
title: "Copilot Studio Agent Fails in Teams: Authentication and Channel Troubleshooting"
summary: "Troubleshoot a Copilot Studio agent that fails in Microsoft Teams: SystemError after publishing, sharing and approval, authentication mode limits in group chats, and channel settings."
status: review
publish: false
author: mirko-p
date: 2027-01-02
topics: [copilot-studio, teams]
keypoints:
  - "SystemError after publishing is documented. The workaround is to toggle the app in the Teams admin center, toggle the Teams channel in Copilot Studio and republish."
  - "Group chats and meeting chats do not support agents with manual authentication and single sign-on for Teams."
  - "In Teams group chats and channels, agents cannot use knowledge sources that need end-user authentication, such as SharePoint."
  - "A user can reach an agent but be unable to chat if the agent is not shared with that user or an applicable security group."
  - "Authentication changes take effect only after you publish. Publish the agent at least once before installing or sharing it."
faq:
  - q: "What does SystemError after publishing mean?"
    a: "Microsoft Learn says users may see 'Sorry, something unexpected happened' with the error code SystemError when Teams keeps using a previously published version. The documented workaround is to turn the app off and on in the Teams admin center, turn the Teams channel off and on in Copilot Studio, and republish."
  - q: "Why does my agent not work in a Teams group chat?"
    a: "Learn says group chats and meeting chats do not support agents configured for manual authentication with single sign-on for Teams. Either authenticate with Microsoft or remove SSO for Teams from the manual authentication. Knowledge sources that need end-user authentication also do not work there."
  - q: "Which authentication option fits the built-in Teams channel?"
    a: "The Learn authentication page says Authenticate with Microsoft sets up Microsoft Entra ID authentication automatically for Teams, SharePoint, Power Apps and Microsoft Copilot, and to use it for the built-in Teams and Microsoft 365 channel."
  - q: "Why can a user open the agent in Teams but not chat?"
    a: "Learn says this can happen if the agent is not shared with that user or an applicable security group. Verify access and test again with the affected account."
  - q: "Why do new answers not appear in an ongoing conversation?"
    a: "Learn says new content in a freshly published agent does not appear in ongoing conversations. Entering start over begins a new conversation."
---

When a Copilot Studio agent fails in Teams, check four things (my suggested order): the agent was published and the Teams channel is added, the user has access through sharing and admin approval, the authentication mode fits where the agent is used, and Teams is not holding on to an old version. Microsoft Learn documents each of these. This guide follows the Learn pages on connecting an agent to Teams and on end-user authentication. It does not rely on community posts.

## Step 1: Publish and add the channel

Learn says to publish the agent at least once before installing or sharing it. To connect it:

1. In Copilot Studio, open the agent and select **Channels**, then the **Microsoft 365 and Microsoft Teams** tile.
2. Under **Turn on Microsoft 365**, select **Make agent available in Microsoft Copilot** if you want both Copilot and Teams. Otherwise the agent is available only in Teams.
3. Select **Add channel**.

If you add the channel again without uninstalling the agent from Teams first, the button reads **Update now** instead of **Add**.

## Step 2: SystemError after publishing

Users may see "Sorry, something unexpected happened. We're looking into it. Error code: SystemError". Learn says this happens when Teams keeps using a previously published version. The workaround:

1. In the Teams admin center, find the agent app, turn it off, wait a few seconds and turn it on.
2. In Copilot Studio, turn off the **Teams** channel, save, and turn it back on.
3. Republish the agent.

If the problem persists, Learn says to contact Microsoft Support with the **Conversation ID**, the **Agent ID** and the time of the error.

## Step 3: Check sharing, approval and Teams settings

- **Sharing:** the agent must be shared with users so they can install and chat with it. A user can reach the agent in Teams and still be unable to chat if the agent is not shared with them or an applicable security group.
- **Power Platform apps in Teams:** Learn says your organization must allow Power Platform apps to be added to Teams before users can install an agent directly or find it in the Teams app store. If it is disabled, work with your admin on managing Microsoft Power Platform apps in the Teams admin center.
- **Org catalog submission:** if you use **Submit to org catalog**, an admin must approve it. Another user cannot resubmit until the admin approves or rejects the previous submission. After approval, a missing entry in **Built for your org** may be Teams caching, so sign out and back in on desktop or refresh the browser on web.
- **Do not narrow access after submission:** Learn says not to change the access setting to less than everyone in your organization after submitting. Otherwise users cannot chat with the agent after installing it from the app store.
- **Resubmit when needed:** you must submit again to update the icon and descriptions of an approved agent, or after enabling **Users can add this agent to a team** or **Use this agent for group and meeting chats**. Content-only updates do not need resubmission.

## Step 4: Match the authentication option to the use

Learn describes three options under **Settings** > **Security** > **Authentication**:

| Option | Notes from Learn |
| --- | --- |
| No authentication | Anyone with the link can chat. Not available when a Power Platform data policy requires authentication |
| Authenticate with Microsoft | Sets up Microsoft Entra ID authentication automatically for Teams, SharePoint, Power Apps and Microsoft Copilot. Use it for the built-in Teams and Microsoft 365 channel |
| Authenticate manually | You configure the identity provider. Teams deployments need the separate SSO requirements |

Points that commonly cause Teams failures:

- With **Authenticate with Microsoft**, users in Teams are not prompted to sign in unless the agent needs an expanded scope.
- Group chats and meeting chats do not support agents with **manual authentication** and **single sign-on for Teams**. Use Authenticate with Microsoft or remove SSO for Teams from the manual setup.
- In Teams group chats and channels, agents cannot use knowledge sources that need end-user authentication, such as SharePoint. They are supported only in 1:1 chats.
- **Require users to sign in** applies only to manual authentication.
- Switching to **Authenticate with Microsoft** turns `User.AccessToken` references into unknown variables, and in Teams `User.IsLoggedIn` references as well. Fix the topic errors before you publish.
- Authentication changes take effect only after you publish.
- Do not turn off agent-level authentication if tools are configured to require user credentials.

## Step 5: Other behaviors to rule out

- Teams applies rate limiting, so keep published content concise.
- After you disconnect the Teams channel, it may take a few minutes before users can no longer reach the agent.
- Installation links do not work in the Teams mobile app. Configure showing the agent in the Teams app store for mobile users.
- Admin-approved agents use the app icon and have no avatar icon option.

## What the pages do not say

The Copilot Studio troubleshooting landing page I read does not list an article specific to Teams or authentication, and it points to the Copilot Studio support page and the community forum. This guide therefore covers only the documented settings and the SystemError workaround. For other error codes, collect the Conversation ID, Agent ID and time and open a support case.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Connect and configure an agent for Teams and Microsoft Copilot (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/publication-add-bot-to-microsoft-teams)
- [Configure user authentication in Copilot Studio (Microsoft Learn)](https://learn.microsoft.com/microsoft-copilot-studio/configuration-end-user-authentication)
- [Microsoft Copilot Studio troubleshooting (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/copilot-studio/welcome-copilot-studio)
