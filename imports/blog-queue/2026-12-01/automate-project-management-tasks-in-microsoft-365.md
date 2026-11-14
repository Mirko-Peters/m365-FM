---
title: "Automate Project Management Tasks in Microsoft 365 with Planner, Power Automate and Copilot"
summary: "Four documented ways to automate project tasks in Microsoft 365: Power Automate flows on Planner, the Planner Agent, Teams Workflows and the Copilot Workflows agent, with the plan-type limits Microsoft lists."
status: review
publish: false
author: mirko-p
date: 2026-12-01
topics: [microsoft-planner, power-automate, teams, workflows-agent]
keypoints:
  - "The Planner connector for Power Automate is a standard connector with three triggers: task created, task assigned to me and task completed."
  - "Microsoft Learn states that the Planner connector supports basic plans only, so premium plans need another approach."
  - "A Microsoft template can send a scheduled summary of Planner tasks by bucket, using a Recurrence trigger, List buckets, List tasks and Send an email."
  - "The Planner Agent needs a Microsoft Copilot license. Task generation from goals is available only in premium plans."
  - "The Workflows agent can read your Planner tasks, but Microsoft lists only List my tasks for Planner and requires the Frontier program."
faq:
  - q: "Can Power Automate create tasks in Microsoft Planner?"
    a: "Yes. The Microsoft Learn connector reference lists actions such as Create a task, Create a bucket, Update a task and Add assignees to a task. Learn also lists the limitation that the connector currently supports basic plans only."
  - q: "What triggers does the Planner connector offer?"
    a: "Microsoft Learn lists three triggers: When a new task is created, When a task is assigned to me and When a task is completed. Trigger polling is limited to one poll every 360 seconds."
  - q: "Does the Planner connector work with premium plans?"
    a: "According to the Microsoft Learn connector page, it supports basic plans only. A reader comment on a Microsoft Tech Community post reports trigger failures on premium plans, which is consistent with that but is not a Microsoft statement."
  - q: "What can the Planner Agent automate?"
    a: "Microsoft Support says the agent can run tasks assigned to it, generate status reports as Loop components, create tasks from a goal and plan files, and create or update tasks and plans in chat. Task generation from goals is premium plans only, and a Copilot license is required."
  - q: "Is the Planner Agent the same as the Project Manager agent?"
    a: "Microsoft's Planner blog describes the official renaming of Project Manager Agent to Planner Agent. The Support FAQ page uses the name Planner Agent."
---

Project work in Microsoft 365 usually lives in Planner and Teams, and most repetitive steps can be automated with tools that are already in the tenant. Microsoft documents four options: Power Automate flows on Planner, the Planner Agent, the Workflows app in Teams and the Workflows agent in Copilot. Which one fits depends mainly on your plan type and your license.

## Option 1: Power Automate flows on Planner

Power Automate is the general-purpose route. The Planner connector is published by Microsoft and, according to Microsoft Learn, is in the Standard tier in Power Automate, Power Apps, Logic Apps and Copilot Studio.

### What the connector offers

**Triggers:** When a new task is created, When a task is assigned to me and When a task is completed.

**Actions** include Create a task, Create a bucket, Get a task, Get task details, List buckets, List my tasks, List plans for a group, List tasks, Update a task, Update task details, Add assignees to a task, Remove assignees from a task and, in preview, Delete a task and Get plan details.

### Know the limits first

- The connector currently supports **basic plans only**, per Microsoft Learn.
- Some actions need a **Group Id** only to fill dependent dropdowns, such as Plan Id in Create a task. After the dropdown loads, any value can be entered and the action still works, despite warnings.
- Throttling: 100 API calls per connection per 60 seconds, and one trigger poll per 360 seconds. Do not expect instant reactions.
- The connection is not shareable. If you share an app that uses it, the other person must create a new connection.

### Example: weekly task summary by bucket

A Microsoft Tech Community post shows a scheduled summary email. Steps as described there:

1. In Planner, create a basic plan with buckets such as Backlog, Final Draft, Review and Published, and add tasks.
2. Open Power Automate at make.powerautomate.com and select **Templates**.
3. Search for "Create a daily summary of Planner tasks by bucket" and open it.
4. Sign in to the **Planner** and **Office 365 Outlook** connections.
5. Set the **Recurrence** trigger. The post uses Monday at 9:00 AM and notes the schedule can be changed.
6. In **List buckets** and **List tasks**, select the plan.
7. In **Send an email**, enter the recipient and save.
8. Test with the **Manual** option, then check the inbox. If nothing arrives, review the flow run.

## Option 2: The Planner Agent

Microsoft Support describes the Planner Agent as a collaborator for plans. It can:

- run tasks assigned to it, using task details, goals and plan files, and return output in a Loop component with a **Regenerate** option;
- generate customizable status reports covering completed, ongoing, upcoming and overdue work;
- create a set of tasks from a goal and plan files;
- create or update tasks and plans through chat.

Execution, status reports and chat work in basic and premium plans. Task generation from goals works only in premium plans. Users need a Microsoft Copilot license, and Support notes it may not complete every task, in which case it gives instructions. Hebrew and Arabic are not currently supported.

Microsoft's Planner blog also describes meeting-based help: Facilitator can create and assign tasks through the meeting chat and extract tasks from transcripts, and a Channel Agent in Teams channels can create, assign and update tasks. The blog states that Channel Agent capabilities are in public preview and need a Microsoft 365 Copilot license.

## Option 3: Workflows app in Teams

For small triggers that start in a chat or channel, the Workflows app creates Power Automate flows from templates. Microsoft Support documents opening it from Apps, from a chat or channel, or from a message with **More actions** > **Create new action**. Flows go into the default environment. See the separate guide on Workflows in Teams for details and Conditional Access notes.

## Option 4: Workflows agent in Copilot

Microsoft Support lists Planner support in the Workflows agent as **List my tasks**. A Microsoft 365 blog example is a Monday Teams update with launch deadlines and key tasks from Planner. The agent requires the Frontier program, works in English only and cannot share workflows. It cannot create Planner tasks according to the supported-actions list, so use Power Automate when tasks must be written back.

## How to choose

| Goal | Documented option |
|---|---|
| Create or update tasks automatically on events | Power Automate with the Planner connector, basic plans |
| Scheduled digest of tasks | Power Automate template with Recurrence |
| Status reports and task drafts from plan content | Planner Agent, Copilot license |
| Tasks from meeting transcripts | Facilitator and Planner, Copilot license |
| Plain-language automation reading your tasks | Workflows agent, Frontier |

## Common mistakes

- **Building on a premium plan.** The connector page says basic plans only. Test with one task before you build a long flow.
- **Expecting instant triggers.** Polling is limited to one poll every 360 seconds.
- **Forgetting the connection owner.** Connections are not shareable, so flows depend on the account that made them.
- **Assuming one agent does everything.** The Workflows agent lists a narrow Planner action set.

## Related

- [Microsoft Planner](https://www.m365.fm/entity/microsoft-planner/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Workflows agent](https://www.m365.fm/entity/workflows-agent/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Microsoft Learn: Planner connector reference](https://learn.microsoft.com/en-us/connectors/planner/)
- [Microsoft Tech Community: Microsoft Planner and Power Automate, the perfect duo](https://techcommunity.microsoft.com/blog/nonprofittechies/microsoft-planner--automate-the-perfect-duo/4375211)
- [Microsoft Support: Frequently asked questions about the Planner Agent](https://support.microsoft.com/office/frequently-asked-questions-about-project-manager-agent-ab2bc39a-edec-4d4d-8e86-2cc927870096)
- [Microsoft Tech Community: The next chapter for AI-powered work management in Microsoft Planner](https://techcommunity.microsoft.com/t5/planner-blog/the-next-chapter-for-ai-powered-work-management-in-microsoft/ba-p/4469796)
- [Microsoft Tech Community: Bringing AI assistance to basic plans in Microsoft Planner](https://techcommunity.microsoft.com/blog/plannerblog/bringing-ai-assistance-to-basic-plans-in-microsoft-planner/4500074)
- [Microsoft Support: Get started with Workflows in Microsoft 365 Copilot](https://support.microsoft.com/topic/get-started-with-workflows-in-microsoft-365-copilot-8c6aba25-db31-443d-8319-bc79747b280a)
- [Microsoft Support: Get started with the Workflows app in Microsoft Teams](https://support.microsoft.com/en-US/Teams/apps-service/get-started-with-the-workflows-app-in-microsoft-teams)
