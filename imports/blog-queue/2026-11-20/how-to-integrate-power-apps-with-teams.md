---
title: "How to Integrate Power Apps with Teams: Tabs, Personal Apps and Limits"
summary: "How to add a Power Apps canvas app to Microsoft Teams as a tab or personal app, which prerequisites and admin settings apply, and what the Dataverse for Teams deprecation means for apps built inside Teams."
status: review
publish: false
author: mirko-p
date: 2026-11-20
topics: [power-apps, teams, power-platform]
keypoints:
  - "Microsoft documents three routes: embed a canvas app, embed a model-driven app, or build an app inside Teams on Dataverse for Teams."
  - "To add a canvas app, open make.powerapps.com > Apps, select More actions on the app, choose Add to Teams and then select Add to Teams again."
  - "With the web player method you can only add apps from the same tenant as your Teams account. Otherwise you see the error App was not found in tenant."
  - "New Dataverse for Teams environments can no longer be created from November 15, 2026. Environments not upgraded are suspended on September 15, 2027."
  - "Team custom app policies must allow uploading custom apps. The web player method also needs Allow interaction with custom apps turned on and Shared Power Apps allowed."
faq:
  - q: "How do I add a Power Apps canvas app to Teams?"
    a: "Per Microsoft Learn, sign in to make.powerapps.com, select Apps, select More actions on the app and choose Add to Teams. Optionally add details under Advanced settings, select Add to Teams, open Teams and select Add, or use Add to team or Add to chat. You can also select Download app and upload the package manually."
  - q: "Why do I get the error 'App was not found in tenant'?"
    a: "In the web player method, Microsoft Learn says you can only add apps that belong to the same tenant as your Teams account. Otherwise you see this error."
  - q: "What do admins need to allow?"
    a: "Microsoft Learn says team custom app policies must allow uploading custom apps. For the web player method, Allow interaction with custom apps must also be on and Shared Power Apps must be allowed. Admins can also publish the app to the Teams catalog for organization-wide distribution."
  - q: "What is happening to Dataverse for Teams?"
    a: "Microsoft Learn says Dataverse for Teams environments are deprecated. New environments cannot be created from November 15, 2026. Environments that are not upgraded to Dataverse are suspended on September 15, 2027 and decommissioned on October 30, 2027, and their apps, flows, agents and data are no longer available."
  - q: "Do I need a license to embed an app in Teams?"
    a: "Microsoft Learn says you need a valid Power Apps license to embed an app. It also says that after upgrading a Dataverse for Teams environment, apps, flows and agents in it require Power Apps, Power Automate or Copilot Studio licenses."
---

The standard way to integrate Power Apps with Teams is to build a canvas app in Power Apps and add it to Teams as a tab or a personal app. Select **Add to Teams** from the app's menu in Power Apps, then add it to a team, chat or your personal apps. Building apps inside Teams on Dataverse for Teams is being retired, so new work should start in a Dataverse environment.

## Three ways Power Apps works with Teams

The Microsoft Learn overview describes these routes:

1. **Embed a canvas app** as a tab app or a personal app. The canvas app can use business data from many Microsoft and third-party sources, including Dataverse.
2. **Embed a model-driven app** as a tab app, using the Power Apps tab, or as a personal app.
3. **Create apps inside Teams** with the Power Apps app in Teams, backed by Dataverse for Teams.

Route 3 is deprecated, as covered below. Routes 1 and 2 are the current choice.

### Which route to pick

- You already have a canvas app in Power Apps: embed it as a tab for a team or chat, or as a personal app.
- You have a model-driven app: use the Power Apps tab to embed it.
- You want to build something new: Microsoft Learn says makers should build new apps in a Dataverse environment and then embed them in Teams. New Dataverse for Teams environments cannot be created from November 15, 2026.

## Prerequisites

- A valid **Power Apps license** and an existing app built in Power Apps.
- Team custom app policies that allow uploading custom apps.
- For the web player route, **Allow interaction with custom apps** turned on and **Shared Power Apps** allowed, and an app in the **same tenant** as your Teams account. Otherwise you get the error "App was not found in tenant".
- Your own apps must be shared before you add them to Teams. Sample app templates are shared by default.

## Add a canvas app from Power Apps

1. Sign in to make.powerapps.com and select **Apps**.
2. Select **More actions** on the app, then **Add to Teams**. A panel opens on the right.
3. Optional: select **Edit details** if the app has no description.
4. Optional: select **Advanced settings** to add name, website, terms of use, privacy policy and MPN ID.
5. Select **Add to Teams** and open Teams when prompted. As an alternative, select **Download app** and upload the package through Teams manually.
6. In Teams, select **Add**, or use **Add to team** or **Add to chat** to target a specific team or chat.
7. Optional: pin the app for easy access.

A second route uses the web player. Open the app, select the **Play** icon or press F5, then select **Add to Teams** at the top right.

## Embed an app as a channel tab

The Learn tab article gives these steps:

1. In Teams, select a team, then a channel.
2. Select **+** to add a tab.
3. In **Add a tab**, choose **Power Apps**.
4. Pick your app and save. The Learn example selects **Sample app templates** > **Product Showcase** > **Save**.

To remove it, select the tab and choose **Remove**.

## Known limits

From the Learn pages (the pages I read do not list limits on media, sensors or mobile attachments, so check the current Learn article before you promise a feature):

- Teams context variables such as `theme`, `teamId`, `channelId` and `userTeamRole` can be read in an app. `groupId` is not supported with private channels.
- Apps embedded before March 2020 may need to be re-added for the `Param()` context feature.

## Admin checklist

1. Confirm custom app policies allow uploads.
2. For the web player method, turn on **Allow interaction with custom apps** and allow **Shared Power Apps**.
3. For organization-wide distribution, publish the app to the Teams catalog.

## Dataverse for Teams is being retired

This matters if you built apps in the Power Apps app in Teams. Microsoft Learn lists these dates:

| Date | What happens |
|---|---|
| November 15, 2026 | New Dataverse for Teams environments can no longer be created |
| September 15, 2027 | Environments not upgraded to Dataverse are suspended |
| October 30, 2027 | Environments not upgraded are decommissioned |

Suspended and decommissioned environments lose their apps, flows, agents and data. For admins, Learn suggests filtering environments in the Power Platform admin center under **Manage** > **Environments** by Type **Microsoft Teams**, and using the **Last activity** column to see what is still used. Before upgrading, check that Dataverse capacity is at least the size of the environment and that users have the licenses they need. For makers, Learn says to ask your admin to upgrade and to build new apps in a Dataverse environment, then add them to Teams.

## Common problems

- **"App was not found in tenant."** In the web player method, the app belongs to a different tenant than your Teams account.
- **Add to Teams is unavailable or fails.** Ask your admin to check the custom app policy and, for the web player method, the Allow interaction with custom apps and Shared Power Apps settings.
- **Colleagues cannot open the tab.** Share the app first.
- **Old embedded apps behave oddly.** Re-add apps embedded before March 2020.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)

## Sources

- [Microsoft Learn: Power Apps and Teams overview](https://learn.microsoft.com/en-us/power-apps/teams/overview)
- [Microsoft Learn: Embed a canvas app in Teams](https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-app)
- [Microsoft Learn: Embed a canvas app as a tab in Teams](https://learn.microsoft.com/en-us/power-apps/teams/embed-teams-tab)
- [Microsoft Learn: Important changes coming to Power Platform](https://learn.microsoft.com/en-us/power-platform/important-changes-coming)
