---
title: "Planner Premium Plans: Fix Dependency and Resource Bottlenecks Using Critical Path, Assignments and Documented Limits"
summary: "How to find schedule and workload bottlenecks in Planner premium plans using dependencies, Timeline, critical path, People and Assignments views, and which documented limits and license rules can block you."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [microsoft-planner, project, microsoft-365]
keypoints:
  - "Premium plans support four dependency link types and a scheduling engine that updates execution dates from the dependencies."
  - "The Timeline view shows tasks, dependencies and the critical path, which marks the tasks that define the timeline."
  - "People view shows workload and over- or under-allocation. Assignments view shows effort per resource by day, week or month."
  - "A premium license is required, and Planner's comparison page lists 3,000 tasks per premium plan against 9,000 for basic plans."
  - "Learn's Project for the web limits list 20 links per task, 2,000 successor links, 300 resources per project and 20 per task."
faq:
  - q: "Which dependency types does Planner premium support?"
    a: "According to Microsoft Support, the supported link types are finish to start, start to start, start to finish and finish to finish. Planner's scheduling engine automatically updates execution dates based on dependencies, and dependencies appear in the Timeline view."
  - q: "How do I see who is overloaded?"
    a: "Microsoft Support describes a People view for workload distribution and over- or under-allocation, and an Assignments view for effort per resource by day, week or month. Both are premium features."
  - q: "How many tasks can a premium plan hold?"
    a: "Planner's basic versus premium comparison lists 3,000 tasks per plan for premium and 9,000 for basic plans. The comparison links to Project for the web limits for premium, which list 3,000 tasks per project."
  - q: "Do I need a license to use dependencies?"
    a: "Yes. Microsoft Support says a premium license is required. Without one, you can start an upgrade from My Plans, which offers a free 30-day premium trial or a license request to your administrator."
---

A plan slips for two reasons: tasks wait on other tasks, or the same people are asked to do too much at once. Planner premium plans have features for both, and a handful of documented limits can look like bottlenecks when you reach them. This article walks through the tools Microsoft describes and the limits worth checking. It does not repeat the feature timeline of the separate Planner updates article.

## What a premium plan adds

Microsoft Support lists these premium features: Goals, People view, Sprints, task chat and task history, advanced dependencies, the Timeline view (a Gantt chart) with critical path, milestones, custom calendars, Assignments view, custom fields (up to ten new fields), conditional coloring, and summary and subtasks. A Project Manager agent chat is listed as preview.

A premium license is required. Without one, you can start an upgrade from **My Plans** by selecting **Create a plan** and choosing a premium option. Users are offered a free 30-day trial, or they can request a license from the administrator. With a license, premium views open from **Timeline** or the **...** menu.

Basic plans have a Schedule view, recurring tasks, Outlook calendar integration and SharePoint integration, which premium plans do not list. If a missing feature is the problem, check which plan type you have first.

## Find schedule bottlenecks: dependencies and critical path

Dependencies link tasks. The supported types are finish to start, start to start, start to finish and finish to finish. The scheduling engine updates execution dates automatically based on the links, so moving one task can move many.

The **Timeline** view shows all tasks and dependencies and highlights the **critical path**. Microsoft describes the critical path as the tasks that define the timeline. A delay in a critical task delays the plan, while a delay in a task off the path may not.

To use it:

1. Open the plan and select **Timeline**.
2. Turn on the critical path highlight if it is not on.
3. Look for long chains of finish to start links through the same few tasks. Those are the bottleneck candidates.
4. Check whether a link is necessary. A start to start link can let two tasks overlap where a finish to start link forced a queue.
5. Add milestones for the dates that matter and watch whether the critical path still reaches them.

Custom calendars set the days that count as work days. If dates look longer than expected, a calendar with fewer work days may be the cause.

## Find resource bottlenecks: People and Assignments

- **People view** shows workload distribution and over- or under-allocation. Use it to spot someone with several overlapping tasks.
- **Assignments view** shows effort per resource by day, week or month. Use it to see when the overload happens.

Typical fixes are to reassign tasks, shift a non-critical task so it no longer overlaps, or split a large task into subtasks assigned to different people. Support does not list a feature that levels resources automatically, so these remain manual decisions.

## Limits that can stop you

Planner's comparison page lists 3,000 tasks per plan for premium and 9,000 for basic. It says the premium task limit links to the Project for the web limits, which Planner's page does not reproduce. The Project for the web limits and boundaries page lists:

| Limit | Value |
|---|---|
| Tasks per project | 3,000 |
| Total links (successor only) per project | 2,000 |
| Links per task (successor plus predecessor) | 20 |
| Resources per project | 300 |
| Resources assigned to a task | 20 |
| Custom fields per project | 10 |
| Goals per project | 10 |
| Hierarchy levels | 10 |
| Duration of a leaf task | 1,250 days |
| Duration of a summary task | 3,650 days |

That page does not mention Planner premium plans. It says Project for the web will soon become Microsoft Planner. Because the Planner comparison page links to these limits for premium, they are a reasonable reference, but confirm in your tenant before relying on them for a large plan. A Microsoft Q&A thread repeats similar figures, but it is community content and not an official statement, so I did not use it as a source for numbers.

If a plan hits a limit, the options are to split it into several plans by phase, reduce links by grouping tasks under summary tasks, or keep milestones instead of linking every task.

## Other behaviors that look like bugs

From the comparison page:

- Premium tasks appear in **Assigned to me** only for members of the plan's associated group, and editing there is limited.
- Task conversations in premium plans require the plan to be added to a Teams channel.
- Apps and workflows built for basic plans need modification to work with premium plans.

If an automation stopped working after you upgraded a plan, the last point is the first thing to check.

## A weekly review routine

1. Open Timeline and check that the critical path still ends at the expected milestone.
2. Open People view and look for over-allocated people in the next two weeks.
3. Use Assignments view for the weeks where effort peaks.
4. Remove or change links that are no longer valid.
5. Check how close the plan is to the task and link limits.

## What the pages I read do not cover

Microsoft Support's article does not give steps to resolve scheduling conflicts or dependency errors, and does not give limits on tasks, dependencies or assigned users per plan. The comparison page gives only the task limit. There is no description of automatic resource leveling. Anything beyond the steps above should be tested in your plan.

## Related

- [Microsoft Planner](https://www.m365.fm/entity/microsoft-planner/)
- [Microsoft Project](https://www.m365.fm/entity/project/)
- [Microsoft 365](https://www.m365.fm/entity/microsoft-365/)

## Sources

- [Microsoft Support: Advanced capabilities with premium plans in Planner](https://support.microsoft.com/Planner/teams/advanced-capabilities-with-premium-plans-in-planner)
- [Microsoft Support: Compare Microsoft Planner basic vs premium plans](https://support.microsoft.com/hr-HR/Planner/compare-microsoft-planner-basic-vs-premium-plans)
- [Microsoft Learn: Project for the web limits and boundaries](https://learn.microsoft.com/en-us/project-for-the-web/project-for-the-web-limits-and-boundaries)
