---
title: "Microsoft Teams Integration with ServiceNow and Jira: Setup Guide for Admins"
summary: "How to connect Microsoft Teams with ServiceNow and Jira Cloud: what each app does, what must be in place, the install steps, and the Teams admin center settings that decide whether the app is available."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [teams, servicenow, teams-admin-center]
keypoints:
  - "ServiceNow connects to Teams through the Conversational Integration with Microsoft Teams app (sn_va_teams) and Now Virtual Agent. Jira connects through the Jira Cloud app from the Teams app store."
  - "The two apps are built by the vendors. The pages I read at Microsoft describe only how to allow or block apps, not the ServiceNow or Jira setup itself."
  - "ServiceNow ties one instance to one Teams tenant. Cloning a non-production instance and rerunning the setup disassociates the original instance."
  - "Jira Cloud respects existing Jira permissions. In team, channel and meeting chats it answers only when you mention it with @Jira."
  - "If the app is missing from the Teams store, check Teams apps > Manage apps and the org-wide app settings in the Teams admin center before you troubleshoot anything else."
faq:
  - q: "Does Microsoft Teams integrate with ServiceNow?"
    a: "Yes. According to the ServiceNow documentation for the Zurich release, you install the Conversational Integration with Microsoft Teams app (sn_va_teams) from the ServiceNow Store and then integrate Now Virtual Agent with Teams. The integration is built and documented by ServiceNow."
  - q: "What permissions are needed to set up the ServiceNow integration?"
    a: "ServiceNow lists the roles virtual_agent_admin and external_app_install_admin (or admin) on the instance side. On the Microsoft side it lists Application Administrator or Global Administrator for accepting the one-time app permissions, and it says non-admin consent is not recommended."
  - q: "How do I connect Jira Cloud to Teams?"
    a: "Atlassian's guide says to open Apps in Teams, search for Jira Cloud, select Add and choose Add for me. Then open the Jira Cloud chat, enter Configure, sign in to your Atlassian account and pick the Jira site."
  - q: "Why can't I find the Jira or ServiceNow app in Teams?"
    a: "Atlassian says your Teams administrator may need to allow the Jira Cloud app. Microsoft Learn says an app that an admin has not allowed shows as Blocked by publisher in the admin center, and org-wide settings decide whether users can install third-party apps."
  - q: "Can the integration send Jira notifications to a Teams channel?"
    a: "Atlassian describes channel notifications by subscribing a channel to a Jira space. The page I read points to a separate article for the exact steps, so follow that article for the details."
---

Microsoft Teams connects to ServiceNow and Jira through apps that the vendors publish, not through a built-in Microsoft feature. ServiceNow uses the Conversational Integration with Microsoft Teams app together with Now Virtual Agent. Jira uses the Jira Cloud app from the Teams app store. In both cases the Teams admin center decides whether users may install the app at all.

A note on sources: I found no Microsoft Learn page that describes either integration. The setup steps below come from ServiceNow and Atlassian documentation. The Teams-side admin controls come from Microsoft Learn. If your tenant looks different, trust the vendor page for your release.

## What the two integrations do

**ServiceNow.** The Teams app lets Now Virtual Agent, ServiceNow's chat assistant, talk to people inside Teams. ServiceNow's Zurich documentation describes installing the Microsoft Teams application (sn_va_teams) and then integrating Virtual Agent with Teams.

**Jira Cloud.** Atlassian says the app lets users create, update and assign work items, get notifications and search without leaving Teams. It also offers link previews for pasted Jira links, a message menu to turn a Teams message into a work item, and tabs that show recent or assigned work items.

## Before you start

Check these points first:

1. **Teams admin center access.** You need to be able to allow the app (see the section on app controls below).
2. **ServiceNow roles.** ServiceNow lists virtual_agent_admin and external_app_install_admin, or admin.
3. **Microsoft consent.** ServiceNow lists Global Administrator, Application Administrator or Cloud Application Administrator for the Microsoft side. It says granting non-admin consent is not recommended.
4. **ServiceNow plugin.** Activate the Glide Virtual Agent plugin (com.glide.cs.chatbot) for full functionality, or the Virtual Agent Lite plugin (com.glide.cs.chatbot.lite) for a limited version, before installing the integration.
5. **Entitlements.** ServiceNow says the app and all associated Store apps need valid entitlements.
6. **Jira site.** You need an Atlassian account that can access the Jira Cloud site you want to use.

## Set up ServiceNow with Teams

The documentation splits this into two parts.

**Part 1: install the app (Zurich release, page updated July 31, 2025).**

1. In ServiceNow, go to **All** > **Conversational Interfaces** > **Channels and integrations**.
2. On the Microsoft Teams card, select **Get Teams plugin**. You land on the ServiceNow Store page.
3. Select **Get** (you must be signed in to the Store portal), then **Request Install**.
4. Enter the instance name and a reason, optionally select **Validate Instance**, then select **Request**. The page says a message confirms the request was auto-approved.

**Part 2: integrate Virtual Agent (Zurich release, page updated February 27, 2026).**

1. Go to **All** > **Conversational Interfaces** > **Settings**.
2. Under **General Settings** > **Channels and integrations**, select **View All**.
3. On the **Microsoft Teams** tile under **Available Channels**, select **Add Integrations**, then **Integrate with ServiceNow Virtual Agent**.
4. Choose a Microsoft Teams account, sign in, and select **Accept** to grant the app permissions.
5. Wait for the background installation to finish, then select **Go to Microsoft Teams** to manage the Teams app.

The pages I read do not cover Azure or Entra app registration, uploading a Teams app manifest, or a separate Teams admin approval workflow. They say that for self-configured bots you download the manifest and re-upload it to push changes to Teams, without describing those steps.

### ServiceNow rules that cause trouble

- The app creates a one-to-one association between a ServiceNow instance and a Teams tenant. Use a separate tenant for each instance.
- If you clone a non-production instance, rerun the configuration on the clone. Doing so disassociates the original instance from the tenant.
- If the tenant is already assigned to Virtual Agent on another instance, uninstall it there first. From the Tokyo release on, ServiceNow says you must contact the administrator for this.

## Set up Jira Cloud with Teams

Atlassian's getting-started page lists these steps.

**Install**

1. In Teams, select **Apps** on the left toolbar.
2. Search for **Jira Cloud** and select **Add**.
3. In the app dialog, choose **Add for me** and follow the sign-in prompts.

**Connect your site**

1. Select **Jira Cloud** on the left toolbar.
2. Enter **Configure** in the chat.
3. Sign in to your Atlassian account if asked.
4. Select the Jira site you want to use.

To change the site later, enter **Configure** again. If your organization has several Jira Cloud sites, Atlassian says you pick one when you connect spaces or set up notifications.

**Use it in a channel.** Add the Jira Cloud app to the channel or meeting first. In team, channel or meeting chats, type **@Jira**, select **Jira Cloud** from the suggestions, then enter a command. Listed commands include Configure, Notifications, Find, Support, Help, Feedback, Tour and Sign out.

**Permissions.** The app respects existing Jira permissions. If a site uses work-item-level security schemes, Teams notifications are not sent for restricted work items. Signing out does not remove existing channel subscriptions.

## The Teams admin center decides availability

Whether either app appears for users is a Teams setting. Microsoft Learn describes these controls:

- Go to **Teams apps** > **Manage apps**. Select the app and choose **Allow** or **Block**, or open the app and change **Status**.
- On the **Manage apps** page, open **Actions** > **Org-wide app settings**. The **Third-party apps** control manages the bulk availability of third-party agents and apps. The **Custom apps** control covers apps you upload.
- Settings in org-wide app settings take effect after a few hours.
- Microsoft says that before an admin allows an app, it can show as **Blocked by publisher**. Follow the publisher's guidance to configure it before you allow it for users.
- In Microsoft 365 GCC, GCC High and DoD, all third-party apps are blocked by default.

The same Learn page says users can request access from the Teams client, and admins are notified and can allow the app.

## Typical problems and where to look

| Symptom | Check first |
|---|---|
| App missing in the Teams store | Manage apps status, then the Third-party apps org-wide setting |
| Jira app installs but shows no data | Run **Configure** and select the correct Jira site |
| No Jira messages in a channel | Confirm the app was added to the channel and that you mention **@Jira** |
| ServiceNow setup refuses the tenant | The tenant may already be linked to another instance |
| Notifications missing for some issues | Work-item-level security schemes can suppress them |

## Other business apps

The same pattern applies to most business apps. The vendor documents its own install and sign-in steps, and your Teams admin controls availability. Start with the Manage apps page, then follow the vendor's guide.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [ServiceNow](https://www.m365.fm/entity/servicenow/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)

## Sources

- [Install Conversational Integration with Microsoft Teams, ServiceNow (Zurich)](https://www.servicenow.com/docs/r/Xh633tLbz1TiB0XwDksy6A/mTsRE9Ax3PoXevM9U65fvw)
- [Integrate ServiceNow Virtual Agent with Microsoft Teams, ServiceNow (Zurich)](https://www.servicenow.com/docs/r/Xh633tLbz1TiB0XwDksy6A/jFEoFrHHw5ue6sA2E_bN1Q)
- [Integrate Jira Cloud and Microsoft Teams, Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/integrate-jira-cloud-and-microsoft-teams/)
- [Get started with Jira Cloud and Microsoft Teams, Atlassian Support](https://support.atlassian.com/jira-software-cloud/docs/get-started-with-jira-cloud-and-microsoft-teams/)
- [Manage your apps in the Microsoft Teams admin center, Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/manage-apps)
