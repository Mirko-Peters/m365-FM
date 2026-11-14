---
title: "Teams Connectors and Webhooks: Retirement Status and How to Replace Them With Workflows"
summary: "Office 365 connectors and connector-based incoming webhooks in Teams were retired in May 2026. This guide covers what stopped working, what replaces it, how to migrate and where Workflows still differs."
status: review
publish: false
author: mirko-p
date: 2026-11-23
topics: [teams, power-automate, connector, adaptive-cards]
keypoints:
  - "Per Microsoft Learn, Office 365 connectors in Teams, including connector-based incoming webhooks, were retired in May 2026. The final rollout window in the dev blog was May 18 to May 22, 2026."
  - "The replacement is the Workflows app in Teams, which is Power Automate. Use the trigger When a Teams webhook request is received or a ready-made template."
  - "A workflow has its own webhook URL, so every sending system must be switched to it, because the old connector URL no longer works."
  - "MessageCard payloads render, but their HttpPost buttons do not. Use Adaptive Cards for interactive content."
  - "Workflows belong to an owner, not to a channel. Add co-owners so the workflow does not become orphaned when its owner leaves."
faq:
  - q: "Do Teams connectors still work?"
    a: "No. Microsoft Learn states that Office 365 connectors in Teams, including connector-based incoming webhooks, were retired in May 2026. The Microsoft 365 developer blog gave May 18 to May 22, 2026 as the final rollout window and says webhooks had to be migrated before it began."
  - q: "What replaces the Incoming Webhook connector in Teams?"
    a: "The Workflows app, which runs on Power Automate. According to Microsoft Learn you either use a predefined template that posts to a chat or channel when a webhook request is received, or build a flow from scratch with the trigger When a Teams webhook request is received."
  - q: "Do I need a new URL for my monitoring tool or script?"
    a: "Yes. A workflow has its own trigger URL, and the connector reference describes the trigger as started by a POST request to that endpoint. The pages I read do not say where the URL is displayed, so open the workflow trigger in Power Automate to copy it. Paste it into the system that sends the POST request."
  - q: "Can the Workflows webhook post buttons that call back to my system?"
    a: "Not with MessageCard. The dev blog says MessageCard renders content but does not support HttpPost action buttons. For interactive elements Microsoft points to Adaptive Cards, and Learn says you must configure the workflow to handle the responses."
  - q: "Who can send requests to a workflow webhook?"
    a: "You choose. The Microsoft Teams connector reference on Learn lists three options: anyone, any user in your tenant, or specific users in your tenant. For the tenant options, requests must carry an authentication token. For Anyone, you must not send one."
---

Teams connectors, including the Incoming Webhook connector, are gone. Microsoft Learn states that Office 365 connectors in Teams were retired in May 2026, and that the way to receive webhook requests and post to Teams now is the Workflows app. A workflow built on the trigger **When a Teams webhook request is received** replaces the old connector URL.

This article explains what was retired, what replaces it, how to move over and which differences can still bite.

## What was retired and when

The retirement ran for almost two years and the date moved several times. The Microsoft 365 developer blog documents the sequence:

- July 2024: first plan to block new connectors from August 15, 2024 and stop all connectors on October 1, 2024.
- July 2024: retirement pushed out to December 2025.
- October 2025: migration deadline moved to March 31, 2026.
- February 2026: Message Card support added to Workflows, and the Workflows bot could post in shared channels. The deadline moved to April 30, 2026.
- April 14, 2026 (final update): rollout begins May 18, 2026 and completes May 22, 2026. After that the connectors no longer function.

The affected items are Office 365 connectors in Teams, including webhook-based connectors such as Incoming Webhook and third-party connectors that post to a URL. The blog notes that the webhook URL change applies to webhook-based connectors, not to polling connectors such as RSS.

If something still posts through an old connector, treat it as broken or about to break and plan the migration now.

## What replaces connectors

Microsoft names three paths on Learn:

1. **Workflows app (Power Automate)** for incoming webhooks. Use a predefined template or the trigger *When a Teams webhook request is received*.
2. **The Power Automate connector** for ISVs and product teams. Learn calls it the scalable and secure way to move data into and out of Teams programmatically.
3. **A Teams app with proactive messages**, so users can set up messages based on trigger events in your system.

For most admins and scripters, path 1 is the direct swap.

## How to migrate a webhook to Workflows

The Microsoft support page for incoming webhooks could not be read when this article was prepared, so the steps below follow the dev blog and the Learn connector reference.

1. List every connector in use. Check channels that used **Manage channel** > **Connectors** and the systems that send alerts, such as monitoring, build or ticket tools.
2. In Teams, open the **Workflows** app. The dev blog says you can also open it from a chat or channel through **More options (...)**.
3. Choose a predefined webhook template, or start from scratch with the trigger **When a Teams webhook request is received**.
4. Pick the team and channel, then save, and copy the trigger URL from the workflow in Power Automate.
5. Replace the old connector URL in the sending system with the new one.
6. Name, describe and test the workflow, and add co-owners.
7. Send a test POST and check that the message appears.

The trigger only accepts POST requests. The Learn connector reference says GET requests are not supported.

## Payload format and cards

The trigger body can hold an array of adaptive cards. The reference shows a message with an `attachments` array whose `contentType` is `application/vnd.microsoft.card.adaptive`. A single Message Card body is also accepted.

Keep these points in mind:

- Adaptive Cards are the supported way to build interactive content.
- MessageCard payloads render, but buttons that use HttpPost do not work. The dev blog says to switch to Adaptive Cards if you use interactive card elements.


## Access control

One real improvement: the trigger has an authentication setting. Learn lists three choices.

| Setting | What the sender must do |
|---|---|
| Anyone | Send no authentication token header, or the request fails |
| Any user in my tenant | Send an authentication token |
| Specific users in my tenant | Send an authentication token, and the user must be on the allowed list |

For the tenant options Learn points to its guide on OAuth authentication for HTTP request triggers. If a tool can only send a plain POST to a URL, it needs the Anyone setting. Then treat the URL as a secret.

## Differences from the old connector

Plan for these before you cut over.

- **Sender identity.** The April 2026 dev blog update says bot icon and name customization is not available for webhook posts. Messages show the default Workflows bot identity.
- **Ownership.** Learn says workflows are tied to owners, not to a team or channel. If the owner leaves and no co-owner exists, the flow can become orphaned. Add co-owners with full control.
- **Limits.** The Learn reference lists about 1,000 concurrent inbound calls for the trigger, and a 28 KB limit on the *Post adaptive card in a chat or channel* action. Larger payloads return a "Request Entity too large" error.
- **Private channels.** The sources disagree. The dev blog says private channel selection in the Workflows app was scheduled to roll out fully by April 20, 2026, one Learn page says Workflows webhooks support private channels, and another Learn page calls private channel support under development. The Microsoft Teams connector reference still says posting a message or card to a private channel is not currently supported. Test your target channel before relying on it.

## Common mistakes

- Migrating only the channel and forgetting to change the URL in the sending system.
- Leaving a single person as the only workflow owner.
- Sending a token to a trigger set to Anyone.
- Keeping MessageCard buttons and expecting the callbacks to work.
- Assuming the old bot name and icon carry over.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Connector](https://www.m365.fm/entity/connector/)
- [Adaptive Cards](https://www.m365.fm/entity/adaptive-cards/)

## Sources

- [Retirement of Office 365 connectors within Microsoft Teams (Microsoft 365 developer blog)](https://devblogs.microsoft.com/microsoft365dev/retirement-of-office-365-connectors-within-microsoft-teams/)
- [Create Office 365 Connectors for Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-creating)
- [Retirement of Microsoft 365 Connectors and Custom Connectors in Teams (Microsoft Learn)](https://learn.microsoft.com/en-us/microsoftteams/m365-custom-connectors)
- [Microsoft Teams connector reference for Power Automate (Microsoft Learn)](https://learn.microsoft.com/en-us/connectors/teams/)
