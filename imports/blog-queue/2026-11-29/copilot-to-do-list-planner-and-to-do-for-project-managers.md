---
title: "Copilot To Do List for Project Managers: Planner Agent, Tasks and Status Reports"
summary: "How project managers can build a to-do list with Microsoft Copilot: the Planner Agent, Planner tasks in Copilot chat, Add to To Do for files, OneNote lists, status reports, licenses and admin controls."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [copilot, microsoft-planner, microsoft-to-do]
keypoints:
  - "Planner capabilities in Copilot chat let you ask about tasks, edit task fields, and create private tasks, shared basic plan tasks and plans, including from an Office file."
  - "The Planner Agent needs a Microsoft Copilot license. Status reports need at least 10 tasks in the plan and open in a Loop canvas."
  - "Copilot chat task editing covers only name, progress, due date, start date, priority and plan name."
  - "The Microsoft pages I read describe Planner tasks in Copilot chat, not Microsoft To Do tasks. For a file, the Copilot app offers Add to > To Do."
  - "Admins can restrict the Planner Agent with Set-PlannerConfiguration -AllowPlannerCopilot. Changes can take up to an hour."
faq:
  - q: "Can Copilot create a to-do list for me?"
    a: "Yes, in a few places. Microsoft Support says Planner capabilities in Copilot chat can create private tasks and tasks in shared basic plans, and Copilot in OneNote can build a to-do list from the notes on a page. The OneNote article describes copying the list out, not saving native tasks."
  - q: "Does Copilot work with Microsoft To Do?"
    a: "The Microsoft pages I read are cautious here. The Planner capabilities pages cover Planner tasks only and do not mention To Do. A separate Copilot app article says you can select Add to > To Do on a file in Search, and that the task can be found in Planner, To-Do or Outlook. I could not read a Microsoft page describing To Do tasks inside Copilot chat."
  - q: "Which license do I need for the Planner Agent?"
    a: "Microsoft Learn and Microsoft Support state that users need a Microsoft Copilot license to interact with the Planner Agent. Users without one can still collaborate on plans but cannot assign tasks to the agent."
  - q: "How do I get a status report from Planner?"
    a: "Microsoft Support describes the Reports tab. Open it, set the reporting period, choose sections and a length, and select Generate report. The plan needs at least 10 tasks, and the report opens in a Loop canvas."
  - q: "Can I turn the Planner Agent off for my organization?"
    a: "Yes. Microsoft Learn documents PowerShell: Set-PlannerConfiguration -AllowPlannerCopilot $false turns it off for all users, and a security group ID can limit it to a group. Changes may take up to 1 hour."
---

A project manager can get a Copilot to-do list in three ways: ask Copilot chat about Planner tasks and plans, hand tasks to the Planner Agent inside a plan, or ask Copilot in OneNote to extract a task list from meeting notes. Microsoft documents each of these. The details below follow Microsoft's pages as of mid-November 2026.

Naming: Microsoft's current pages say Microsoft Copilot for the paid license, and older pages say Microsoft 365 Copilot. The Planner pages also say "Planner Agent", which replaced the earlier name Project Manager agent.

## Option 1: Planner capabilities in Copilot chat

Open Microsoft 365 Copilot, select **New chat**, and ask about your Planner tasks, plans or goals. Copilot uses the capabilities when they fit the request.

What Microsoft says you can do:

- **Ask questions:** about private tasks, tasks assigned to you, flagged emails, tasks in shared basic plans, and goals with related work.
- **Edit:** update task properties, mark tasks complete, update plan details, move tasks between plans and associate tasks with goals. Proposed work appears in task cards for review before it is created.
- **Create:** private tasks, tasks in shared basic plans, plans from scratch, and plans generated from Word, Excel or PowerPoint files.

Prompts taken from Microsoft's pages:

- "Show my tasks and help me prioritize what needs attention."
- "Which shared plans need attention?"
- "Review my emails and draft private tasks for urgent follow-ups."
- "Create a marketing plan for the product launch."
- "Generate a project plan from this PowerPoint."
- "Adjust the deadline for the Marketing task and change the priority to Important."

**Limit:** task editing currently supports only name, progress, due date, start date, priority and plan name. Status reports in this experience support shared basic plans only, and premium plans aren't currently supported there.

Message Center item MC1443523 says the Planner capabilities in Copilot chat were planned for general availability worldwide from early September 2026, on desktop and web, with existing Planner permissions still applying and no admin action required.

## Option 2: The Planner Agent inside a plan

The Planner Agent is built into the plan. Microsoft Support lists these steps.

**Basic plans (shared with a Microsoft 365 Group)**

1. Open the plan and select the floating action button in the lower-right corner. Upload files as context under **Knowledge sources** if needed.
2. Assign a task to the Planner Agent. You are assigned too, so you can track progress.
3. With at least 10 tasks, open the **Reports** tab and generate a status report.

**Premium plans**

1. Open a premium plan shared with a Microsoft 365 Group. The agent is enabled by default.
2. Assign a task to the agent, or use the **Goals** tab to generate tasks from a high-level goal. Task generation from goals works only in premium plans.

**Track agent work.** On the board, select **Group by** > **AI agent tasks**. Tasks sort into All pending tasks, Assigned to Planner Agent, Couldn't complete (the agent needs more information) and Ready for review.

### Status report steps

1. Open the **Reports** tab.
2. Set the reporting period: last week, last two weeks, last month or last quarter.
3. Choose report sections and, optionally, more options.
4. Choose Concise, Standard or Detailed.
5. Select **Generate report**. It opens in a Loop canvas.
6. Select **Keep it** or **Discard**. You can also share it as a newsletter.

Microsoft's example request: "Create a comprehensive update on high-priority items for the leadership team." Loop files the agent creates are stored in the SharePoint site of the plan's group. Microsoft says to review reports for accuracy before sharing.

## Option 3: OneNote and files

**OneNote.** On the Home ribbon select **Copilot**, then ask, for example, "Extract a to-do list from the new role notes on this page." You can also right-click a page and select **Copilot** > **Create a task list**. Microsoft's article describes copying the result. It does not say the list becomes native OneNote tasks, and it does not mention To Do or Planner sync.

**Files.** In the Microsoft Copilot app, select **Search**, find the file in **Quick access**, hover over it, select **More actions**, then **Add to** > **To Do**. Microsoft says a task is created with a link to the file and can be found in Planner, To-Do or Outlook.

## What about Microsoft To Do?

This is the weak spot in the documentation I could read. The Planner pages cover Planner tasks only. The Copilot app article offers Add to > To Do for files. I did not find a Microsoft page that describes asking Copilot chat to create or manage To Do tasks directly. A third-party site reported such a capability, but I could not open it, so I don't rely on it. Test in your own tenant before you promise it to a team.

## Licenses and prerequisites

- A Microsoft Copilot license is required to interact with the Planner Agent. Without it, users can collaborate on plans but can't assign tasks to the agent.
- Users who also have a Planner Plan 1 or Planner and Project Plan 3 license get premium functionality.
- The agent is available in all premium plans and in basic plans shared with a Microsoft 365 Group.

## Admin controls

Microsoft Learn documents PowerShell for the Planner Agent and Planner Agent chat. Run `Set-PlannerConfiguration -AllowPlannerCopilot $false` to turn it off for everyone, or set it to `$true` with `-PlannerCopilotAllowedGroupId <security group id>` to allow one group. An invalid group ID turns it off for all users. Changes may take up to 1 hour. Turning off the Planner Agent also disables the document authoring skill of Facilitator.

## A practical weekly flow

Microsoft's project review scenario suggests Copilot Chat for summarizing scope, Teams with Facilitator for notes and action items, and Outlook for a recap. Combine that with the options above: capture actions in the meeting, turn them into Planner tasks, then generate the status report from the plan.

## Related

- [Microsoft Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Planner](https://www.m365.fm/entity/microsoft-planner/)
- [Microsoft To Do](https://www.m365.fm/entity/microsoft-to-do/)
- [Copilot Chat](https://www.m365.fm/entity/copilot-chat/)

## Sources

- [Planner capabilities in Microsoft 365 Copilot, Microsoft Support](https://support.microsoft.com/planner/what-are-planner-capabilities-incopilot-newchat)
- [What can you do with Planner Agent in Copilot, Microsoft Support](https://support.microsoft.com/planner/what-can-you-do-with-planner-agent-in-copilot)
- [Access Planner Agent, Microsoft Support](https://support.microsoft.com/planner/copilot/access-planner-agent)
- [Turn off or restrict access to Planner Agent, Microsoft Learn](https://learn.microsoft.com/office365/planner/turn-off-copilot-planner)
- [MC1443523, Planner capabilities in Copilot chat, Message Center via mc.merill.net](https://mc.merill.net/message/MC1443523)
- [Create a To Do for a file in the Microsoft Copilot app, Microsoft Support](https://support.microsoft.com/en-US/microsoft-365-copilot/create-a-to-do-for-a-file-in-the-microsoft-365-copilot-app)
- [Bringing AI assistance to basic plans in Microsoft Planner (rename of Project Manager Agent to Planner Agent), Microsoft Community Hub](https://techcommunity.microsoft.com/blog/plannerblog/bringing-ai-assistance-to-basic-plans-in-microsoft-planner/4500074)
- [Create a to-do list and tasks in OneNote with Copilot, Microsoft Support](https://support.microsoft.com/en-us/office/create-a-to-do-list-and-tasks-in-onenote-with-copilot-95fdfbeb-d499-4024-9387-5416ab56a58e)
- [Execute a project review, Microsoft Copilot Scenario Library](https://adoption.microsoft.com/en-us/copilot-scenario-library/operations/executing-a-project-review)
