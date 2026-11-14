---
title: "What Is Power BI in Teams? Embed Reports in Channels and Chats"
summary: "Power BI in Teams lets you add reports to channels and chats, preview links, get notifications and chat from Power BI. Learn what you can embed, what permissions viewers need, and the known limits."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [power-bi, teams, power-bi-service]
keypoints:
  - "Power BI in Teams means the Power BI app, a Power BI tab for channels and chats, link previews, chat from the Power BI service and activity feed notifications."
  - "The tab can hold reports, paginated reports, scorecards and organizational apps. Dashboards cannot be embedded in the Power BI tab."
  - "Embedding a report does not grant access. Viewers need permission in Power BI, and without it they see 'Content isn't available'."
  - "Adding the tab creates a tab conversation, so everyone in the channel can discuss the report next to it."
  - "Known limits include no URL filters, no cross-tenant links and no new Power BI tab in national or regional clouds."
faq:
  - q: "What is Power BI in Teams?"
    a: "According to Microsoft Learn, it is a set of integrations: the Power BI app in Teams, a Power BI tab that embeds interactive reports in channels and chats, link previews for pasted links, chatting from the Power BI service, an In Teams view of all your Power BI tabs, activity feed notifications and mobile support."
  - q: "Can I embed a Power BI dashboard in a Teams tab?"
    a: "No. Microsoft Learn states that you can't embed Power BI dashboards in the Power BI tab for Microsoft Teams. You can embed reports, paginated reports, scorecards and organizational apps."
  - q: "Why do my colleagues see 'Content isn't available'?"
    a: "Microsoft Learn says users without a Power BI license or without permission to access the report see that message. Embedding a report in Teams or sending a link does not automatically give them permission."
  - q: "Do Teams users need a Power BI Pro license to view an embedded report?"
    a: "The pages I read say users with a Fabric (Free) license can access content shared with them from a workspace in a Power BI Premium capacity (P SKU) or Fabric F64 or greater capacity. Pro or Premium Per User licenses are listed for sharing and building content in workspaces."
  - q: "Can external guests see a Power BI report in Teams?"
    a: "Microsoft Learn lists three steps: invite the guest through Microsoft Entra B2B, give them permission on the report, and make sure they have a Power BI license. If the content is in a Premium capacity, a Free license is enough for the guest."
---

Power BI in Teams is a group of integrations that bring Power BI reports into Teams channels and chats. You add a Power BI tab, paste a link and get a preview, chat about a view from the Power BI service, and receive notifications in the Teams activity feed. The report stays in Power BI, and Teams shows it in a tab.

## What the integration offers

Microsoft Learn lists these pieces:

- **The Power BI app in Teams**, which brings the Power BI service experience into Teams.
- **The Power BI tab**, which embeds interactive reports in channels and chats, including private and shared channels.
- **Link previews**, which show a preview in the message box when you paste links to reports, dashboards and apps.
- **Chat from the Power BI service**, so you can share a filtered view and start a conversation.
- **An In Teams view**, found on the Power BI app home page, that lists all your Power BI tabs.
- **Notifications** in the Teams activity feed when important things happen in Power BI.
- **Mobile support**, where the best experience is through the Power BI mobile apps.

## What you can embed

The tab supports these items, hosted in Power BI workspaces (including My workspace) or published through an organizational app:

- Interactive reports (.pbix)
- Paginated reports (.rdl)
- Scorecards
- Organizational apps and interactive reports inside them

Dashboards are not on the list. Microsoft Learn says directly that you can't embed Power BI dashboards in the tab. Fabric items can't be embedded in the tab either. They open in the browser.

## Requirements

To embed a report, Teams needs the **Power BI** tab, you need at least the Viewer role in the workspace that hosts the item, and you need permission to view an organizational app if you use one.

For viewers, Microsoft Learn lists:

- The Power BI app must be enabled in the Teams admin center apps list.
- Users with a Fabric (Free) license can access content shared with them from a workspace in a Power BI Premium capacity (P SKU) or Fabric F64 or greater capacity.
- Users with a Power BI Pro or Premium Per User license can share content and build content in workspaces.
- Users must sign in within the Power BI app for Teams or the Power BI service to activate their Power BI license.

The pages I read do not give a full licensing table beyond these points. Check your capacity type before you roll this out to a large audience.

## Add a Power BI tab to a channel or chat

1. Open a channel or chat in Teams and select the **+** icon.
2. Select the **Power BI** tab.
3. Select **Save**. A configuration screen appears.
4. Choose one option:
   - Paste a link to a supported item in the **Paste a Power BI link** box and select **Add tab**.
   - Select **Browse workspaces**, then pick a report, app or scorecard in the dialog. Use **Search** to find an item.
   - Select **Create new** to create a new report.

To change what the tab shows, right-click the tab name, select **Settings**, then **Reset tab**. To rename it, right-click the tab name and select **Rename**. You can't change the name through the tab settings after you save.

### Which link to paste

Microsoft says links created with **Share** in Power BI give the best experience. Supported link types are sharing links, links with **include my changes** (shared views), links from **copy link to visual** and links from the address bar. Use include my changes links to open a specific page with specific filters. Links don't support query string parameters, personal bookmarks or cross-tenant use.

## Permissions: the step people miss

Embedding a report or sending a link does not give anyone permission to see it. Microsoft's advice:

- Review who can see the report in the Power BI service and grant access to anyone missing.
- Put reports in one workspace and give the team's Microsoft 365 Group access, so everyone in the team has access.
- If you use a **Share link**, make sure it includes permissions. Otherwise colleagues don't get access automatically.

Users without a license or permission see a "Content isn't available" message.

### Guests

Microsoft lists three steps for external users: invite them to the organization through Microsoft Entra B2B and have them accept, give them permission on the report, and assign a Power BI license. For content in a Premium capacity, the guest needs only a Free license.

## Conversations

Adding a Power BI tab creates a tab conversation automatically. Select **Show tab conversation** in the upper right. The first comment links to the report, and everyone in the channel can discuss it there.

## Known issues and limits

From the two Microsoft Learn pages:

- URL filters aren't supported in the Power BI tab.
- Exported visual data is saved to your Downloads folder as data (n).xlsx.
- In national or regional clouds, the new Power BI tab isn't available. Learn adds that an older version might be available, which doesn't support workspaces or reports in Power BI apps.
- In US Government Community Cloud, the Power BI app and the new tab are available, but the messaging extension (link previews, search and link unfurling), activity feed notifications and chat in Teams are not.
- The messaging extension might process request and response data in a region that differs from your Power BI tenant home region.
- When an organizational app is embedded in a tab, items that can't be embedded in Teams open in a new browser window.
- Links created with **Share** give the best experience, and links don't support query string parameters, personal bookmarks or cross-tenant use.
- Link previews don't work in meeting chat or private channels.
- Power BI doesn't support all the languages that Teams supports, so localization of the embedded report can be incomplete.
- On Teams mobile, use **More options (...)** > **Open in browser** to open the report in the Power BI mobile app if it is installed.
- Org apps are not supported in the Power BI personal app for Teams. They open in a browser.

## Quick decision guide

- Want one report in front of a team? Add a tab in the team's channel.
- Want a conversation about a specific filtered view? Share from the Power BI service into Teams chat, or paste an include my changes link.
- Have a dashboard? Paste a link for a preview in a message. Don't plan on a tab.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI service](https://www.m365.fm/entity/power-bi-service/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Embed Power BI content in Microsoft Teams, Microsoft Learn](https://learn.microsoft.com/en-us/power-bi/collaborate-share/office-integration/service-embed-report-microsoft-teams)
- [Collaborate in Microsoft Teams with Power BI, Microsoft Learn](https://learn.microsoft.com/en-us/power-bi/collaborate-share/office-integration/service-collaborate-microsoft-teams)
