---
title: "Microsoft Planner, Outlook and SharePoint Integration: How They Fit Together"
summary: "How Planner connects to Outlook, SharePoint and Teams: where plan data is stored, calendar sync with iCalendar links, the Planner web part on SharePoint sites, and admin controls."
status: review
publish: false
author: mirko-p
date: 2026-11-27
topics: [microsoft-planner, outlook, sharepoint, teams]
keypoints:
  - "Planner stores basic plans in Azure and manages them in the Planner service. Attachments go to the SharePoint location for the group, and comments are kept in Exchange."
  - "Outlook calendar sync uses iCalendar links. They do not require authentication, so anyone with a link can see the synced task details."
  - "Admins can turn calendar sync off with Set-PlannerConfiguration -AllowCalendarSharing $false."
  - "The Planner web part works only on group-connected team sites and can show a plan as a board or as charts."
  - "Planner is also available inside Outlook on the web and the new Outlook for Windows. It is on by default, and Microsoft lists no admin action."
  - "Premium plans need a Project Plan 1 license and are stored in Dataverse."
faq:
  - q: "Where does Planner store its data?"
    a: "According to Microsoft Learn, private tasks are stored in Exchange. Basic plans and their tasks are stored in Azure and managed by the Planner service, comments are stored in Exchange as email threads, and attachments are stored in the SharePoint location for the group. Premium plans are stored in Dataverse."
  - q: "How do I see Planner tasks in my Outlook calendar?"
    a: "Microsoft Learn explains that calendar sync lets users view scheduled Planner tasks in Outlook by generating iCalendar links for basic plans and for their Assigned to me tasks. Users can verify the feature in Planner under My Tasks, where the Add My Tasks to Outlook calendar command appears when sync is enabled."
  - q: "Can I turn off the Planner and Outlook calendar sync?"
    a: "Yes, a global admin can. Microsoft Learn gives the PowerShell command Set-PlannerConfiguration -AllowCalendarSharing $false, and $true to turn it back on. The page warns that iCalendar links need no authentication."
  - q: "Can I show a Planner plan on a SharePoint page?"
    a: "Yes, with the Planner web part. Microsoft Support states that the web part is available only on group-connected team sites. In edit mode you open the Toolbox, choose Planner, create or select a plan and pick a board or charts display."
---

Planner, Outlook and SharePoint are not tied together by one switch. Each connection works differently. Planner tasks can appear in an Outlook calendar through iCalendar links, a plan can be shown on a SharePoint page through a web part, and Planner files and comments end up in SharePoint and Exchange. This guide explains each link and the admin controls, based on the Microsoft pages that could be read.

## Planner in one paragraph

Planner in Microsoft 365 lets users create basic plans with four views: Grid, Board, Schedule and Charts. Premium plans need a Project Plan 1 license and add views such as Timeline, People and Goals. Planner and Project Plan 3 or Plan 5 add advanced features such as dependencies, sprints and custom fields. Planner comes with Microsoft 365 Business Basic and Business Standard, Office 365 E1, E3 and E5, and Microsoft 365 A1, per Microsoft Learn.

## Where Planner data lives

The Teams admin article for the Planner app lists the storage locations:

| Item | Location |
|---|---|
| Private tasks | Exchange |
| Basic plans and tasks | Azure, managed by the Planner service |
| Comments on basic plan tasks | Exchange, as email threads |
| Attachments | The SharePoint location for the group |
| Premium plans and tasks | Dataverse, through the Project for the web service |

When a premium task is assigned to a user, it is also stored in the same Azure location as basic plans. So SharePoint is where files attached to plan tasks end up, and Exchange holds comments and personal tasks.

## Planner and Outlook

### Calendar sync

Calendar sync lets users view scheduled Planner tasks in their Outlook calendar. When it is enabled, users can generate iCalendar links for basic plans and for their Assigned to me tasks. Outlook and other calendar apps use these links to show scheduled tasks as events.

Microsoft's warning is plain: iCalendar links do not require authentication. Anyone with the link can view task details for the synced tasks as long as the link is enabled. Treat the link like a password.

Planner is on by default for organizations whose subscription includes it.

### Turn calendar sync off

A global admin can use PowerShell, after completing the prerequisites for Planner changes:

```
Set-PlannerConfiguration -AllowCalendarSharing $false
```

Use `$true` to turn it back on and `Get-PlannerConfiguration` to check the value. Users sign in with Microsoft Entra credentials. To verify, open **Planner** > **My Tasks**, select the ellipsis (...) and look for **Add "My Tasks" to Outlook calendar**. If the command is there, sync is on.

### Planner inside Outlook

Microsoft 365 Message center item MC1309747 announces that the Planner experience is available directly in Outlook on the web and the new Outlook for Windows, and in the Microsoft 365 Copilot app. It states that the feature is enabled by default, that no admin action is required, that existing permissions, Planner settings and Copilot policies still apply, and that data storage is unchanged. A Copilot Premium license is not needed for Planner in Outlook. The rollout was planned for August 2026.

## Planner and SharePoint

### The Planner web part

The web part shows a plan on a SharePoint page. Steps from Microsoft Support:

1. Open the page and select **Edit** at the top right if it is not already in edit mode.
2. Open the **Toolbox** on the right and select **See all web parts**.
3. Select **Planner**, or drag it onto the page.
4. To create a plan, type a name under **Plan** and select **Create**. To show an existing plan, pick it under "Select an existing plan."
5. Under **Display**, choose a board or charts.

Limits: the web part is available only on group-connected team sites. It is not available in SharePoint Server 2019.

### Attachments

As the storage table shows, attachments to tasks in a group-based plan go to the SharePoint location for the group. That is how a plan and a team site share files.

## Planner in Teams

Users get Planner as an app on the left side of Teams and as a tab in a channel. The app shows My Day, My Tasks, My Plans and a way to create a new plan. Settings and policies for Planner on the web also apply to Planner in Teams. Admins can block or allow it in the Teams admin center under **Teams apps** > **Manage apps**.

## Common mistakes

- Sharing an iCalendar link in a chat or email without realizing it needs no sign-in.
- Expecting the web part on a communication site. It is for group-connected team sites only.
- Expecting premium features with only a basic license.
- Removing a user's Exchange Online license to hide My Tasks. Microsoft warns the user then loses mailbox access and does not recommend this for information workers.

## What the documentation does not say

Two gaps affect this article. The Support page on seeing the Planner calendar in Outlook could not be read, so the calendar sync details come from the Learn admin page. Microsoft's integration landing page lists related articles, such as Use Microsoft Planner on your SharePoint site, but gives no steps itself. The Message center item was read through a third-party mirror and not on Microsoft's own site. Check the Message center in your tenant for the current rollout state.

## Related

- [Microsoft Planner](https://www.m365.fm/entity/microsoft-planner/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Microsoft Planner for admins](https://learn.microsoft.com/en-us/planner/planner-for-admins)
- [Manage the Planner app in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/manage-planner-app)
- [Turn off Outlook calendar sync in Planner](https://learn.microsoft.com/planner/turn-off-outlook-calendar-sync)
- [Use the Planner web part (Microsoft Support)](https://support.microsoft.com/en-au/sharepoint/sites-pages/use-the-planner-web-part)
- [Planner apps and integrations (Microsoft Support)](https://support.microsoft.com/en-us/office/apps-integrations-1bf9c5f2-3e54-44fb-a7ae-c120bd5f482a)
- [Microsoft 365 Message center MC1309747, via a third-party mirror](https://www.itelio.com/en/microsoft-message-center/mc1309747)
