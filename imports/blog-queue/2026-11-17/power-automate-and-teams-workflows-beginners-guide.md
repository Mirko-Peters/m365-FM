---
title: "Power Automate and Workflows in Teams: How They Work (Beginner's Guide)"
summary: "How the Workflows app in Microsoft Teams relates to Power Automate, how to create a workflow from a template or from scratch, how to manage it, and what the Office 365 Connectors retirement means for webhooks."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [power-automate, teams, power-platform]
keypoints:
  - "The Workflows app in Teams creates and manages automated workflows. Microsoft's documentation shows these flows are Power Automate flows and can also be managed in the Power Automate portal."
  - "Create one from a template or from scratch. In both cases you set a trigger and an action, fill in the required fields and select Save."
  - "Workflows built in the Workflows app are placed in the organization's default environment. The app must be enabled in the Teams admin center."
  - "Office 365 Connectors in Teams stop working in the rollout from May 18 to May 22, 2026. Microsoft recommends Workflows, which run on Power Automate."
  - "The pages read here do not describe licensing. Check Microsoft's licensing documentation before you rely on specific connectors."
faq:
  - q: "What is the Workflows app in Teams?"
    a: "According to Microsoft Support, the Workflows app helps you set up, find and manage automated workflows for routine tasks. Microsoft Learn describes the flows created in it as Power Automate flows, which you can also manage at make.powerautomate.com."
  - q: "How do I create a workflow in Teams?"
    a: "Microsoft Support describes opening the Workflows app, choosing a template from the home page or All templates, following the prompts and selecting Save. To start without a template, select Build from scratch, choose a trigger and an action, complete the fields and select Save."
  - q: "Where do my Teams workflows run?"
    a: "Microsoft Learn says all flows created in the Workflows app are placed in your organization's default environment. The Workflows app also has to be enabled in the Microsoft Teams admin center."
  - q: "What happened to Office 365 Connectors in Teams?"
    a: "According to a Microsoft 365 developer blog post updated April 14, 2026, the rollout that stops Office 365 Connectors begins May 18, 2026 and completes May 22, 2026. Webhooks must be moved to Power Automate based workflows before it begins."
  - q: "Do I need a Power Automate license for Teams workflows?"
    a: "The Microsoft Support and Learn pages read for this article do not discuss licensing and do not say which connectors are included. Check Microsoft's Power Automate licensing documentation or ask your admin before you build something that uses premium connectors."
---

A workflow in Teams is an automated sequence that runs when something happens, such as a message being posted, and then does something, such as notifying a channel. The Workflows app in Teams is the entry point for building and managing them, and Microsoft's documentation shows these workflows run on Power Automate. If you can describe a routine task as "when this happens, do that", it is a candidate.

## How Teams and Power Automate fit together

Power Automate is Microsoft's flow service. Microsoft Learn's page on creating flows from Teams refers to flows, the Power Automate designer and the portal at make.powerautomate.com, where flows created in Teams can also be managed. Microsoft Support describes **See all** in the Workflows app as showing workflows across Teams, SharePoint, Power Automate and Copilot. The pages read do not go further into how the services relate, so treat the Workflows app as a Teams front end for Power Automate flows.

Three terms help:

- **Trigger.** The event that starts the workflow.
- **Action.** What the workflow does after the trigger.
- **Connection.** The sign-in a workflow uses to reach an app or service. Learn says you must sign in to all connectors for flows to run successfully.

## Where to find the Workflows app

Microsoft Support lists several entry points:

- **View more apps** on the left side of Teams, search for "Workflows" and select **Add**. Right-click the app and select **Pin** to keep it visible.
- **More options** next to a chat or channel name, then **Workflows**.
- **More options** next to a message, then **More actions** > **Create new action**.
- **Actions and apps** next to the compose box, then **Workflows**.

If you do not see it, your organization may not have enabled it. Microsoft Learn says the Workflows app must be enabled in the Microsoft Teams admin center.

## Create a workflow from a template

1. Open the **Workflows** app.
2. Pick a template from the home page carousel, or select **All templates**. You can also search by keyword.
3. Follow the prompts and fill in the required fields. Learn describes setting up connections, where a green check indicates successful authentication.
4. Select **Save** to activate the workflow.

The Workflows app shows Teams-relevant templates by default. Filters at the top right show all Power Automate templates.

## Create a workflow from a message

For a flow that acts on a specific message, select **More actions** > **Create new action** on that message, then choose a template that uses the **For a selected message** manual trigger and set up its connections.

## Create a workflow from scratch

1. In the Workflows app, select **Build from scratch**.
2. Choose a trigger and an action. You can change them later.
3. Complete the required fields and select **Save**.

Microsoft Learn also describes **Create a flow** in the Workflows app, which opens the full Power Automate designer inside Teams. The two pages describe slightly different wording for this step, which can reflect different versions of the app. Follow what you see in your tenant.

## Manage your workflows

The home page shows your five most recent workflows under **Your workflows**. Select **See all** for the full list and use the search bar to filter. From **More actions** you can:

- **Edit** and **Save**.
- **Turn on** or **Turn off**.
- **Details**, including adding a co-owner under **Owners**.
- **Delete**, confirmed with a second **Delete**.

Adding a co-owner matters. A workflow that belongs to one person is a risk when that person leaves.

## Known limits and admin notes

From Microsoft Learn:

- Flows from the Workflows app go into the **default environment**.
- Conditional Access needs care. If Teams and Power Automate token requirements differ for individually targeted apps, users may see authentication errors. Microsoft recommends targeting **Office 365** or **All cloud apps**, and if you target individual apps, include **Microsoft Flow Service** with matching requirements.
- Terms of Use policies can break existing connections.

## Webhooks and the Office 365 Connectors retirement

If you send alerts into Teams with incoming webhooks, this matters. A Microsoft 365 developer blog post, with an update dated April 14, 2026, gives the final schedule:

- Rollout begins May 18, 2026 and completes May 22, 2026.
- After that, Office 365 Connectors stop working.
- Webhooks must be moved to Power Automate based workflows before the rollout begins.
- The recommended replacement is Workflows in Microsoft Teams.

Known limitations of Workflows webhooks as of that update: no bot icon or name customization, so messages appear under the default Workflows bot, and MessageCard payloads do not support HttpPost action buttons. Interactive cards need Adaptive Cards and a workflow that handles the response. Private channels are supported through the Power Automate portal, and Microsoft said selecting private channels in the Workflows app was rolling out fully by April 20, 2026.

## Getting started safely

1. Start with one template that notifies a channel. It teaches triggers, actions and connections with low risk.
2. Check the workflow's **Details** and add a co-owner.
3. Ask your admin whether the Workflows app is enabled and how Conditional Access is set.
4. Do not assume a connector is free to use. The pages read do not describe licensing.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Microsoft Support: Get started with the Workflows app in Microsoft Teams](https://support.microsoft.com/en-us/teams/apps-service/get-started-with-the-workflows-app-in-microsoft-teams)
- [Microsoft Learn: Create flows from Teams](https://learn.microsoft.com/en-us/power-automate/teams/teams-app-create)
- [Microsoft 365 developer blog: Retirement of Office 365 connectors within Microsoft Teams](https://devblogs.microsoft.com/microsoft365dev/retirement-of-office-365-connectors-within-microsoft-teams/)
