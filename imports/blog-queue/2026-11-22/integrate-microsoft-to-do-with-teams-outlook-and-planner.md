---
title: "Integrate Microsoft To Do with Teams, Outlook and Planner: What Connects Where"
summary: "How Microsoft To Do connects to Outlook flagged email, the Planner app in Teams and Planner plans: which lists show which tasks, how to turn the links on, and the account and mailbox limits that stop sync."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [microsoft-to-do, microsoft-planner, teams]
keypoints:
  - "To Do is for your own tasks and shared lists. Planner is for team work and needs a business, enterprise or education Microsoft 365 subscription."
  - "Flagged emails from your primary Microsoft-hosted mailbox appear in To Do under Flagged email. Turn it on or off in Settings > Flagged email."
  - "When first enabled, Flagged email shows the 100 most recently flagged emails from the last 30 days. Shared mailboxes and flagged calendar events do not sync."
  - "In Teams, the Planner app shows Private tasks, Assigned to me, Flagged emails and All. Shared To Do lists feed Assigned to me."
  - "New Outlook has a To Do icon in the left navigation and a My Day view. Smart lists include Assigned to me and Flagged Email."
faq:
  - q: "How do flagged emails get into Microsoft To Do?"
    a: "According to Microsoft Support, flagged emails show up as tasks in To Do with the message subject as the task name. For new users with a supported mailbox the Flagged email list is enabled automatically, and you can turn it on or off under Settings > Flagged email. The account must be Microsoft-hosted, such as Outlook.com or a Microsoft-hosted custom domain, and only the primary mailbox syncs."
  - q: "Why are my flagged emails not appearing in To Do?"
    a: "Microsoft Support lists the limits: only the 100 most recent flagged emails from the last 30 days load at first, shared mailboxes and shared folders are not supported and flagged calendar events do not convert to tasks. A Microsoft Q&A answer also suggests turning Flagged email off and on in To Do Settings, selecting Sync under Help and Feedback and confirming that Outlook and To Do use the same account."
  - q: "Do Planner tasks show up in To Do?"
    a: "It depends on the page. Microsoft Support on To Do versus Planner says tasks assigned to you appear under Assigned to you in To Do, and that the Teams app shows To Do and Planner tasks alongside each other. The Planner in Teams article lists an Assigned to me view that includes basic plans, premium plans, Teams meeting notes, Loop components and shared To Do lists. Names differ between pages, so check your own client."
  - q: "What is the difference between To Do and Planner?"
    a: "Microsoft Support says To Do is for individual work, such as daily lists and sharing specific lists, and can pull in flagged email. Planner is for team work and needs a business, enterprise or education Microsoft 365 subscription. It offers visual scheduling, progress charts and collaboration across Planner, Teams and Outlook through Microsoft 365 Groups."
---

Microsoft To Do connects to the rest of Microsoft 365 in three places: Outlook flagged email becomes tasks in To Do, the **Planner** app in Teams shows your To Do and Planner tasks together, and tasks assigned to you in Planner or shared To Do lists show up in an assigned list. Each link has account and mailbox conditions. This guide goes through them and flags where Microsoft's own pages use different names.

## To Do or Planner: which one is for what

Microsoft Support describes the split like this:

- **To Do** is for individual work: your own tasks, daily lists and sharing specific lists with teammates, family or friends. It can pull in flagged emails from Outlook and scheduled tasks.
- **Planner** is for team work. It needs a business, enterprise or education Microsoft 365 subscription and offers visual scheduling, progress charts and collaboration through Microsoft 365 Groups across Planner, Teams and Outlook.

In the Windows and mobile apps you can switch between personal and organizational accounts.

## Outlook: flagged email in To Do

Microsoft Support says flagged emails appear as tasks in To Do. The task name is the message subject, the detail view includes a preview and **Open in Outlook** opens the original email. You can rename these tasks, add due dates and reminders, add them to My Day and mark them important.

### Turn it on

1. Sign in to Microsoft To Do with the same account you use for email.
2. For new users with a supported mailbox, **Flagged email** is enabled automatically. Select it from the list menu to view the tasks.
3. To turn it on or off, go to **Settings** > **Flagged email**.

### Limits that explain missing tasks

- The mailbox must be Microsoft-hosted: Outlook.com, Hotmail.com, Live.com or a Microsoft-hosted account on a custom domain.
- When first enabled, the list holds the 100 most recently flagged emails from the last 30 days. After that, newly flagged emails are added.
- Only emails flagged in your primary mailbox sync. Shared folders and shared mailboxes are not supported.
- Flagged calendar events are not converted to tasks.

A Microsoft Q&A moderator answer from March 2026 adds troubleshooting steps for a stalled sync: turn **Flagged email** off, wait about thirty seconds and turn it on, then select **Sync** under **Help and Feedback**. Confirm that Outlook and To Do use the same account, and test by flagging a message in Outlook on the web. The thread shows no confirmed fix, so treat it as a checklist.

## Outlook: the To Do view and My Day

For Outlook.com and new Outlook for Windows, Microsoft Support says you select the To Do icon in the left navigation to see all tasks. **My Day** shows upcoming calendar events and tasks on the Mail, Calendar, People and Groups screens. Smart lists in new Outlook are My Day, Important, Planned, All, Completed, Assigned to me, Flagged Email and Due Today, and you can switch them on or off in Settings.

That article covers only Outlook.com and new Outlook. It does not describe classic Outlook, a To Do bar or Planner tasks.

## Teams: the Planner app

The Planner app in Teams is where task sources meet. Microsoft Support describes the **My tasks** views:

| View | What it shows |
|---|---|
| Private tasks | Quick capture for tasks not yet in a plan; move them into plans later |
| Assigned to me | Tasks assigned to you in Teams meeting notes, basic plans, premium plans, Loop components and shared lists in To Do |
| Flagged emails | Your flagged Outlook emails |
| All | Private tasks, Assigned to me and Flagged emails combined, filterable and sortable |

**My Plans** shows lists created in To Do.

To add the app, select **More apps** (or **View more apps**), search for **Planner** and select **Add**. You can right-click it to pin it or open it in a new window. If it is missing, your organization may not have it turned on, so ask your admin.

To create a plan, select **Create a plan** in the left navigation, pick a blank or template option (some need a premium license) and enter a name. Leave the Microsoft 365 group blank for a personal plan or add one for a shared plan.

## A naming caveat

Microsoft's pages do not agree on one name. The To Do versus Planner article says tasks assigned to you appear under **Assigned to you** in To Do and does not say that Planner tasks appear in To Do itself. The Planner in Teams article and the new Outlook smart list use **Assigned to me**. A 2020 Microsoft blog post describes the older Tasks app in Teams and says tasks assigned on Planner boards appear in an Assigned to you list. Use the label you see in your own client and verify the behavior with a test task.

## A simple setup

1. Use To Do for personal lists and flagged email.
2. Use Planner plans for tasks that more than one person owns.
3. Open the Planner app in Teams as the single place that shows Private tasks, Assigned to me and Flagged emails.
4. Assign a test task in a plan and confirm it appears where you expect.

## Common mistakes

- **Flagging in a shared mailbox.** Those flags do not sync to To Do.
- **Using different accounts.** Outlook and To Do must use the same account for flagged email.
- **Expecting a full history.** The first sync loads only 100 recent flags from 30 days.
- **Expecting Planner features in To Do.** Visual scheduling and charts belong to Planner.

## Limits of the sources

One Microsoft Support page on the Tasks app in Teams could not be retrieved. The 2020 blog post is old and its plans, such as @mentions in Office apps, are not confirmed features. The To Do and Outlook pages read do not cover classic Outlook, so test classic Outlook behavior yourself.

## Related

- [Microsoft To Do](https://www.m365.fm/entity/microsoft-to-do/)
- [Microsoft Planner](https://www.m365.fm/entity/microsoft-planner/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)

## Sources

- [Microsoft Support: To Do vs. Planner](https://support.microsoft.com/ToDo/to-do-vs-planner)
- [Microsoft Support: Getting started with Planner in Teams](https://support.microsoft.com/office/e32639f3-2e07-4b62-9a8c-fd706c12c070)
- [Microsoft Support: Using Microsoft To Do with flagged email from Outlook](https://support.microsoft.com/en-us/todo/using-microsoft-to-do-with-flagged-email-from-outlook)
- [Microsoft Support: Manage tasks with To Do in Outlook](https://support.microsoft.com/en-us/outlook/calendar/manage-tasks-with-to-do-in-outlook)
- [Microsoft Q&A: My flagged emails do not sync in my To Do list](https://learn.microsoft.com/en-us/answers/questions/5829120/my-flagged-emails-do-not-sync-in-my-to-do-list)
- [Microsoft Tech Community: To Do is now integrated with the Microsoft 365 suite of applications](https://techcommunity.microsoft.com/blog/to-doblog/to-do-is-now-integrated-with-the-microsoft-365-suite-of-applications/1543999)
