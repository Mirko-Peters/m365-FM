---
title: "Microsoft Planner Updates 2026: Timeline, Capacity View, Connected Plans and Planner Agent"
summary: "What changed in Microsoft Planner from February to October 2026 according to Microsoft Support: refreshed interface, Planner Agent, Planner MCP Server, custom templates, Timeline, Capacity view and admin usage reports."
status: review
publish: false
author: mirko-p
date: 2026-12-06
topics: [microsoft-planner, copilot, mcp]
keypoints:
  - "Microsoft's what's new page (dated November 4, 2026) lists Planner changes month by month from February to October 2026."
  - "Project Manager Agent was renamed Planner Agent in March 2026. It became generally available in Copilot in June 2026."
  - "October 2026 added Timeline (Gantt) view, Capacity view, connected plans, rich text task notes and admin usage reports."
  - "The Planner MCP Server is generally available as part of Work IQ APIs, supports unified plans only and has listed gaps."
  - "Feature availability depends on your license. The page does not name Basic or Premium plans."
faq:
  - q: "What was added to Planner in October 2026?"
    a: "Microsoft Support lists status reports in Planner Agent in Copilot, Capacity view, Timeline (Gantt) view, connected plans, rich text task notes, Start, Due and Finish date filtering and grouping, and Planner usage reports for admins in the Microsoft 365 admin center."
  - q: "What happened to Project Manager Agent?"
    a: "According to Microsoft Support, it was renamed Planner Agent in March 2026. It works in unified plans shared with a Microsoft 365 group. In June 2026 Planner Agent in Copilot became generally available."
  - q: "Can I build my own agent on Planner data?"
    a: "Microsoft Support lists the Planner MCP Server as generally available since June 2026, as part of the Work IQ APIs. The Work IQ API must be enabled in the tenant. It supports unified plans only. Dependencies, task history and custom fields are not supported."
  - q: "Can I add Planner to a Teams channel?"
    a: "Yes. Microsoft Support says that since September 2026 Planner can be added as a tab in private and shared Teams channels. Users can create a unified plan or select an existing one shared with the channel's group."
  - q: "Which license do the new features need?"
    a: "The Microsoft Support page says feature availability depends on your license and refers readers to the Planner plans and pricing page. It does not map individual features to plans, so check that page for your tenant."
---
Microsoft Planner changed a lot in 2026. The main themes are a refreshed interface, an AI agent in Microsoft Copilot, more planning views such as Timeline and Capacity, and admin reporting. This article summarizes the changes in Microsoft's own what's new page, grouped by theme, with dates as Microsoft gives them.

## Where the information comes from

The source is Microsoft Support's "What's new in Microsoft Planner" page, dated November 4, 2026. It lists updates by month from February to October 2026 and lists no retired features. A Tech Community post titled "What's new in Microsoft Planner, September 2026" describes the first quarterly edition of that update series, but only its title and description could be read. Treat dates and rollout wording as Microsoft's, and check your tenant, because rollout is gradual.

## Interface and collaboration

- **February 2026:** a refreshed interface with less clutter and improved spacing. Task chat in unified plans, with @mentions, rich formatting, emojis and reactions. A Goals view in unified plans to define objectives and connect tasks to them.
- **August 2026:** a Task Details side pane beside Board, Grid or My Tasks. Planner remembers the layout across sessions.
- **August 2026:** Planner in Outlook on the web and the new Outlook for Windows, for personal tasks, shared plans and assigned work.
- **September 2026:** Planner as a tab in private and shared Teams channels.
- **October 2026:** rich text task notes with bold, highlights, headings, lists and links. Pasting from Word and OneNote keeps formatting.

## Planning views

October 2026 brought the biggest view changes:

- **Timeline (Gantt chart):** shows task start, finish and due dates. You can reschedule by moving bars and change duration by resizing them.
- **Capacity view:** review work by assignee and time, with scheduled and unscheduled tasks in one view. You can adjust work across weeks.
- **Connected plans:** link related plans. Subtasks, owners and delivery dates can be managed in a dedicated plan linked to a task in an overarching plan.
- **Date filtering and grouping:** filter by Start date across views, group by Start date in Board view and set custom date ranges.

August 2026 added **custom templates**. You convert a group-backed unified plan into a template, choose which elements to copy (goals, buckets, labels, notes, checklists, attachments) and share it with a Microsoft 365 group.

## Planner Agent and AI

- **March 2026:** Project Manager Agent was renamed **Planner Agent**. It is available in unified plans shared with a Microsoft 365 group. It can be assigned tasks and generates status reports.
- **June 2026:** Planner Agent in Copilot became generally available. Users ask questions and create or update tasks in natural language. Interactive task cards update name, status, due date or priority. AI-generated content appears in draft mode for review before it is applied.
- **September 2026:** Planner Agent in Copilot Chat handles larger plans. It can generate initial task lists without the previous 30-task limit, and users review tasks before saving. Users can choose Quick response, Think deeper or Auto.
- **October 2026:** AI-generated status reports were rolling out to Planner Agent in Microsoft Copilot.

## Planner MCP Server

In June 2026 the **Planner MCP Server** became generally available as part of the Work IQ APIs, for building custom agents. Conditions from the page: the Work IQ API must be enabled in the tenant, it supports unified plans only, and dependencies, task history and custom fields are not supported. If you build on it, plan around those gaps.

## Admin and government clouds

- **October 2026:** Planner usage reports in the Microsoft 365 admin center, with active-user trends, active days and last activity days, and data export.
- **September 2026:** a refreshed experience for GCC and GCC High with improved spacing and a Goals view in unified plans. Microsoft says it does not provide all the features of the commercial experience.

## How to use this list

1. Pick the view that fits the question: Timeline for schedule, Capacity for workload, Connected plans for programs with several plans.
2. Pilot Planner Agent on one plan and review every AI-generated task before saving.
3. Ask your admin whether the Work IQ API is enabled before you plan agent work.
4. Check license requirements for each feature on Microsoft's plans and pricing page.

## What the sources do not say

The Support page does not name Basic or Premium plans, does not give rollout schedules per tenant, and does not describe how connected plans roll up progress. The Tech Community September post body could not be read. If a feature in your tenant looks different, rollout may not have reached you.

## Related

- [Microsoft Planner](https://www.m365.fm/entity/microsoft-planner/)
- [Copilot](https://www.m365.fm/entity/copilot/)
- [Model Context Protocol](https://www.m365.fm/entity/mcp/)

## Sources

- [What's new in Microsoft Planner (Microsoft Support)](https://support.microsoft.com/en-us/planner/whats-new-in-microsoft-planner)
- [What's new in Microsoft Planner, September 2026 (Microsoft Tech Community)](https://techcommunity.microsoft.com/blog/plannerblog/whats-new-in-microsoft-planner--september-2026/4560866)
