---
title: "Manage Tasks in Teams with Planner and To Do (Plus a Daily Standup Setup)"
summary: "How the Planner app in Teams brings together To Do, Planner plans and meeting tasks, how to create shared plans with files, and how to run a daily standup with recurring meeting notes."
status: review
publish: false
author: mirko-p
date: 2026-11-19
topics: [microsoft-planner, microsoft-to-do, teams]
keypoints:
  - "The Planner app in Teams, called Tasks by Planner and To Do before March 2024, shows your private tasks, assigned tasks, flagged emails and plans in one place."
  - "Add it with View more apps, search for Planner, then Add. If it is missing, an admin may need to turn it on in the Teams admin center."
  - "Create a plan with Create a plan. Leave the Microsoft 365 group empty for a personal plan or add a group for a shared plan."
  - "Files attached to basic plan tasks are stored in the group's SharePoint site, and a plan can be added as a tab in a team channel."
  - "Meeting notes in Teams can hold an agenda and tasks. Tasks assigned there appear under Assigned to me, and changes to a meeting series apply to future meetings."
faq:
  - q: "What is the difference between To Do and Planner?"
    a: "Microsoft Support says to start with To Do for individual tasks and shared lists, and with Planner when you work with a team on visual scheduling, progress charts and collaboration across Planner, Teams and Outlook. In Teams, the app shows To Do and Planner tasks side by side."
  - q: "Where do I find my tasks in Teams?"
    a: "Open the Planner app. Microsoft Support describes My Day, My Tasks and My Plans. My Tasks has views for Private tasks, Assigned to me, Flagged emails and All. Assigned to me includes tasks from Teams meeting notes, Planner plans, Loop components and shared To Do lists."
  - q: "Is Planner in Teams free for Microsoft 365 users?"
    a: "Microsoft Learn says users with a Microsoft 365 license are entitled to the Planner app. Premium features, for example from Planner Plan 1, Project Plan 3 or Project Plan 5, need a premium license. Microsoft 365 only users can collaborate on premium plans but can't use premium features."
  - q: "Where are files attached to tasks stored?"
    a: "According to Microsoft Learn, attachments for basic plans are stored in the group's SharePoint site, and comments are in Exchange. For premium plans, attachments are also stored in SharePoint. Private tasks are stored in Exchange."
  - q: "Can I turn Planner off in Teams?"
    a: "Yes. Microsoft Learn says Planner is on by default for all Teams users. An admin can allow or block it in the Teams admin center under Teams apps, Manage apps, or control it per user with an app permission policy."
---
Teams has no separate task product. The **Planner** app in Teams combines your To Do lists, Planner plans, tasks from meeting notes and flagged emails in one place. To manage tasks as a team, create a shared plan, attach the working files to the tasks and run a short recurring meeting whose notes hold the agenda and tasks. This article covers each part and says where Microsoft's pages stop.

## Naming

Microsoft Learn says the app was called **Tasks by Planner and To Do** before March 2024. If an admin can't find Planner in the Teams admin center, searching the old name helps. Microsoft Support's older comparison pages still mention the Tasks app in Teams.

## Add the Planner app

1. In Teams, select **View more apps**.
2. Search for **Planner** and select **Add**.
3. To keep it visible, right-click **Planner** and select **Pin**. To use a separate window, select **Open in new window**.

If Planner doesn't appear, an administrator may need to turn it on.

## What you see in the app

- **My Day:** tasks due today plus tasks you add yourself. It clears every night, and unfinished tasks return to the plan they came from.
- **My Tasks:** **Private tasks** for quick capture, **Assigned to me** (from Teams meeting notes, Planner plans, Loop components and shared To Do lists), **Flagged emails** from Outlook, and **All**, which you can filter and sort.
- **My Plans:** all your plans and lists, with filters such as Recent, Shared, Personal, Pinned and My teams.

## To Do or Planner?

Microsoft Support's guidance is short. Use **To Do** for your own daily list and for sharing specific lists. Use **Planner** when you work with a team and need buckets, due dates, progress charts and a plan that sits next to the team's posts and files. For more complex projects with dependencies and costs, Microsoft's comparison page points to Project. The Planner app in Teams shows To Do and Planner tasks together, so you don't have to pick one view.

## Create a shared plan

1. In the Planner app, select **Create a plan** in the left navigation.
2. Choose a blank plan or a template. Some options require a premium license.
3. Enter a plan name.
4. Add a Microsoft 365 group for a shared plan. Leave it empty for a personal plan.

In a plan you can add buckets and tasks. The Planner web instructions from Microsoft Support are: select **Add a new bucket** and type a name, then **+ Add task**, name the task, select **Set due date**, select **Assign** and choose a team member, then **Add task**. You can change **Assign** or **Due date** later in the task details. Microsoft's Learn training module says a Planner tab can be added to a team channel, and that team members can then create plans, assign tasks, share files, chat about tasks and review charts.

The pages I read for this article did not give click-by-click steps for adding a plan as a channel tab or for attaching a file inside a task. Use the in-app prompts for those two actions.

## Where task files live

For shared documents, Microsoft Learn gives the storage rules:

| Task type | Where data is stored |
|---|---|
| Private tasks | Exchange |
| Basic plans and tasks | Planner service, comments in Exchange, attachments in the group's SharePoint |
| Premium plans and tasks | Dataverse via Project for the web, attachments in SharePoint |

So a file attached to a basic-plan task lives in the SharePoint site of the Microsoft 365 group behind the plan. Check the permissions of that site before you put sensitive files into task attachments.

## Notifications

Planner notifies you in the Teams activity feed, on desktop and mobile, when someone assigns you a task, marks a task assigned to you as urgent or not urgent, changes its progress, or removes you from a task's assignees.

## A daily standup setup

Microsoft doesn't publish a standup template. You can combine documented parts:

1. **Schedule a recurring meeting.** In **Calendar**, select **New** and add details, attendees and the **Teams meeting** toggle. The scheduling page I read doesn't describe the recurrence options, so set the repeat pattern in the meeting form and check the wording in your version.
2. **Add an agenda.** In the meeting's **Details**, select **Add an agenda**, and add the standing questions and any tasks. Participants can add notes or tasks, and you can @mention people.
3. **Handle series changes.** Microsoft says a change to the series applies to all future meetings, and a change to a single meeting affects only that one. Select **View series** to edit the whole series.
4. **Capture tasks in the meeting.** During the meeting, select **Notes** in the meeting controls and add tasks. Assigned tasks show in Planner under **Assigned to me**.
5. **Review afterwards.** Notes are available in the meeting recap and can be edited as a Loop document in Office.com.

External attendees can't access or edit meeting notes. Any attendee or organizer can start notes.

## For admins

Planner is on by default. Turn it on or off in the Teams admin center under **Teams apps** > **Manage apps** by searching for Planner and selecting **Allow** or **Block**. For per-user control, keep it on org-wide and assign a custom app permission policy. To pin it, edit the global app setup policy or create a custom one. Mobile has limited functionality, and users see only plans added to a tab in a team channel.

## Common mistakes

- Looking for Tasks by Planner and To Do after the March 2024 rename.
- Expecting premium features with only a Microsoft 365 license.
- Storing files in task attachments without checking the SharePoint permissions of the group.
- Using My Day as a permanent list. It clears every night.
- Inviting external guests and expecting them to edit meeting notes.

## Related

- [Microsoft Planner](https://www.m365.fm/entity/microsoft-planner/)
- [Microsoft To Do](https://www.m365.fm/entity/microsoft-to-do/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Loop](https://www.m365.fm/entity/microsoft-loop/)

## Sources

- [Microsoft Support: Use the Planner app in Teams](https://support.microsoft.com/en-us/office/use-the%20tasks-app-in%20teams-e32639f3-2e07-4b62-9a8c-fd706c12c070)
- [Microsoft Learn: Manage the Planner app for your organization in Microsoft Teams](https://learn.microsoft.com/en-us/microsoftteams/manage-planner-app)
- [Microsoft Support: To Do vs. Planner](https://support.microsoft.com/en-US/ToDo/to-do-vs-planner)
- [Microsoft Support: When to use Microsoft Project, Planner, To Do, or the Tasks app in Teams](https://support.microsoft.com/en-us/project/when-to-use-microsoft-project-planner-to-do-or-the-tasks-app-in-teams)
- [Microsoft Learn: Organize project tasks with Planner (training)](https://learn.microsoft.com/en-us/training/modules/collaborate-colleagues-staff-plc-teams-microsoft-teams/organize-project-tasks-planner)
- [Microsoft Support: Organize your team's tasks in Microsoft Planner](https://support.microsoft.com/office/organize-your-team-s-tasks-in-microsoft-planner-c931a8a8-0cbb-4410-b66e-ae13233135fb)
- [Microsoft Support: Take meeting notes in Teams](https://support.microsoft.com/en-us/office/take-meeting-notes-in-teams-734a62b6-b792-4e19-87cf-978fd9f7cfb5)
- [Microsoft Support: Schedule a meeting in Microsoft Teams](https://support.microsoft.com/office/schedule-a-meeting-in-teams-943507a9-8583-4c58-b5d2-8ec8265e04e5)
