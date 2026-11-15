---
title: "How to Add a Live Chat Widget in Dynamics 365 Customer Service Omnichannel"
summary: "Create a Modern live chat widget in the Copilot Service admin center: where to start, widget settings, behaviors, user features, domain allow list and version management, with embed steps left to separate docs."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [dynamics-365-customer-service, dynamics-365-omnichannel]
keypoints:
  - "Create the chat channel in the Copilot Service admin center under Customer support > Channels, then choose Modern or Classic."
  - "A workstream that routes chat conversations to queues must be configured first. Authentication settings are mandatory for persistent chat."
  - "Modern widget settings cover colors, chat button, header, intro page, size, proactive chat, operating hours and allowed domains."
  - "Use Only show widget on the provided domains to limit where the widget appears. Enter the portal link."
  - "The configuration page does not describe the embed code or website installation. Those steps are in separate Learn articles."
faq:
  - q: "Where do I create a chat widget?"
    a: "According to Microsoft Learn, in the Copilot Service admin center select Customer support > Channels, select Manage for Chat, then Add chat channel and choose Modern or Classic. Alternatively open a workstream with the Chat channel and select Add Modern UI."
  - q: "What do I need before creating a widget?"
    a: "Learn says to configure a workstream that defines how chat conversations route to queues. Authentication settings are mandatory for persistent chat, and a non-Microsoft marketplace provider is needed for screen sharing or co-browse."
  - q: "How do I show the widget only on my website?"
    a: "Turn on Only show widget on the provided domains and enter the portal link, according to Microsoft Learn."
  - q: "How do I get the embed code?"
    a: "The configuration page I read does not include embed instructions. It points to separate Learn articles about embedding the chat widget in a website or portal and in mobile experiences."
  - q: "Can I test a new widget version without switching over?"
    a: "Learn says the ellipsis menu has Copy testing script, which always loads that version, and Set as active, which makes the general script tag use that version. Some settings are shared between versions, so edit only the active version to avoid unintended live changes."
---

To add a live chat widget, create a chat channel in the Copilot Service admin center, choose the Modern widget, set its appearance, behavior and features, restrict the domains if needed, and then embed the script on your site. The configuration part is documented on the Microsoft Learn page for adding a chat widget. That page does not cover the embed code, so this guide stops where Learn stops and says where to continue.

## What you need first

From the Learn page:

- A **workstream** that defines how chat conversations route to queues.
- The product: Dynamics 365 Contact Center (embedded or standalone) or Dynamics 365 Customer Service.
- **Authentication settings**, which are mandatory for persistent chat.
- An **Azure Notification Hub**, only if you reuse the channel in a mobile app with push notifications.
- A **marketplace provider**, a non-Microsoft one, for screen sharing or co-browse.

Learn refers to supported browsers on a separate page.

## Create the widget

**Option A: new Modern channel**

1. In the Copilot Service admin center, select **Customer support** > **Channels**.
2. Select **Manage** for **Chat**, then **Add chat channel**.
3. Select **Modern** and **Continue**.

**Option B: add the Modern UI to an existing chat channel**

1. Select **Customer support** > **Workstreams**.
2. Open a workstream whose **Channel** is **Chat**.
3. Select **Add Modern UI**.

**Option C: Classic widget.** Select **Classic** in the same flow, then complete **Channel details**, **Chat Widget**, **Behaviors**, **User features**, **Notifications** and **Review and finish**, and select **Create channel**. Learn describes Modern as the new version and says existing deployments can keep Classic while you test Modern.

## Modern widget settings

| Section | Settings |
| --- | --- |
| General Configuration | Name, Language |
| Workstream details | Select an option and enter details |
| Color Settings | Brand color |
| Chat button | An icon, or Use custom icon with a public .png or .svg URL in Icon image URL |
| Header | Show header text, Header text, Show widget icon, icon or custom icon |
| Intro page | Enable intro page, Greeting title, Greeting subtitle, Show legal disclaimer, Disclaimer text |
| Chat Widget | Allow users to expand the chat, Set custom size (Width, Height), Representative display name, Proactive chat, Reconnect to previous chat, Show widget during operation hours, Only show widget on the provided domains |
| Behaviors | Custom automated messages, Pre-conversation survey, Post-conversation survey, Authentication settings, Show position in queue, Show average wait time, Customer location detection |
| User features | File attachments, Customer notifications, Conversation transcripts, Voice and video calls, Screen sharing, Co-browse |
| Notifications | Notifications toggle and Azure Notification Hub details |
| Review and finish | Create channel |

Custom icons must be publicly hosted .png or .svg files.

## Limit where the widget appears

Turn on **Only show widget on the provided domains** and enter the portal link. For Classic, the same setting exists, plus **Only show widget during operation hours** with an **Operation hours name**.

## Notes on features

- **Customer wait time** settings do not apply to persistent chat.
- **Screen sharing and co-browse** need a non-Microsoft provider from Microsoft Marketplace. Each widget supports one co-browse provider and one screen sharing provider.
- **Customer notifications:** when the chat window is minimized or inactive, a sound plays for new representative messages and the unread count shows. Enable it under **User features** > **Customer notifications**.
- Learn notes terminology changes: a Copilot Studio bot is now called a Copilot agent, and a human agent is now called a customer service representative.

## Manage versions safely

- **Edit the configuration:** use the pencil button next to Classic or Modern.
- **Copy testing script:** in the ellipsis menu, select **Copy testing script**. That tag always loads the chosen version.
- **Set as active:** in the ellipsis menu, select **Set as active**. The general script tag then uses that version. You can roll back to Classic.
- Some settings, such as **Behaviors** and **User features**, are shared between versions. Edit only the active version to avoid unintended live changes.

## Embed on a website

The page does not describe the embed code or website installation. It lists two separate articles in its related information: embedding the chat widget in a website or portal, and embedding it in mobile experiences. Read the website one before you publish. I did not read it, so this guide gives no script tag or placement advice.

## A pre-launch check (my advice)

1. Workstream and queue routing work with a test conversation.
2. Authentication settings are in place if you use persistent chat.
3. Allowed domains list the production portal.
4. Operating hours settings match your support schedule.
5. You used **Copy testing script** to test before **Set as active**.

## Typical mistakes (my advice)

- Creating the widget before the workstream exists.
- Editing shared Behaviors or User features on a version that is not active and expecting no live effect, or the reverse.
- Forgetting the domain allow list.
- Expecting screen sharing without a marketplace provider.

## Related

- [Dynamics 365 Customer Service](https://www.m365.fm/entity/dynamics-365-customer-service/)
- [Dynamics 365 Omnichannel](https://www.m365.fm/entity/dynamics-365-omnichannel/)

## Sources

- [Configure a chat widget in Dynamics 365 Contact Center (Microsoft Learn)](https://learn.microsoft.com/dynamics365/customer-service/administer/add-chat-widget)
