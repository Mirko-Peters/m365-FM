---
title: "Troubleshoot Dynamics 365 Customer Service Unified Routing and Queue Assignment Failures"
summary: "Why records do not route or work items stay unassigned in Dynamics 365 Customer Service unified routing: intake rules, queue setup, presence, capacity, skills, declines and the documented checks in order."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [dynamics-365-customer-service, dynamics-365-omnichannel, dynamics-365-queue, dynamics-365]
keypoints:
  - "After unified routing is enabled, the active basic routing rule does not route records until an intake rule is configured and mapped to it."
  - "Automatic assignment needs a private queue with at least one representative who matches presence, capacity and skills."
  - "The Assign command changes the owner of a case but does not route it. Use Save and route to send it through unified routing."
  - "Closing a voice or chat conversation without the X button leaves it in wrap-up, so capacity stays occupied until the wrap-up time ends."
  - "The unified routing diagnostics page is marked deprecated, so check the Learn deprecation notice before relying on it."
faq:
  - q: "Why are my cases not routed after I enabled unified routing?"
    a: "Microsoft Learn says the active basic routing rule will not route records until you configure intake rules. The FAQ advises checking that an intake rule exists and is mapped to an active basic routing rule or a workstream."
  - q: "Why does a work item stay in the queue even though agents are online?"
    a: "Per Microsoft Learn, automatic assignment considers presence and capacity, plus any skills in the assignment setup. Check that the agent presence matches an allowed presence in the workstream, that capacity is available, and that the agent has the skills found during classification. Learn also says the queue must be a private queue with at least one representative."
  - q: "What happens when a conversation is routed to a queue with no representatives?"
    a: "According to the Microsoft Learn FAQ, the conversation is closed automatically by the system. Records such as cases remain in the queue and are not assigned automatically."
  - q: "Does the Assign command send a case through unified routing?"
    a: "No. Microsoft Learn explains that Assign changes the case owner but does not route the case. Manually created cases have the Route Case attribute set to false. Use Save and route on the case, or select several cases in the grid and use it there."
  - q: "How often is a work item offered to the same agent again after a decline?"
    a: "Microsoft Learn says declining or letting the notification time out counts as a decline. An agent can be reconsidered for the same item up to three times by default if they are the only eligible one. The limit is configurable from 1 to 5."
---

When unified routing fails, the problem sits at one of four points: the record never enters routing, no queue matches, the queue has nobody who is eligible, or the eligible agents are blocked by presence, capacity or skills. Microsoft Learn documents each point. Work through them in the order below.

## Step 1: Confirm the record enters routing

For records such as cases, the first gate is the intake rule. Learn states that after you enable unified routing, the active basic routing rule will not route records until intake rules are configured. Check these items in the Copilot Service admin center:

1. Under **Customer support**, select **Routing**, then **Manage** for **Record routing**.
2. Confirm the record type is added and has a workstream and intake rules.
3. Open the workstream and check **Intake rules**. Rules map either to a workstream or to an active basic routing rule.
4. Check the order. Intake rules are evaluated in the order of the decision list.

Manual actions need care. The **Assign** command changes the owner but does not route the case. Manually created cases have the **Route Case** attribute set to `false`. Select **Save & Route** on the case, or select several cases in the grid and use the same command. The Learn FAQ also says **Save and route** reassigns a work item from one queue to another.

## Step 2: Check the queue

The FAQ says that for work items to be assigned automatically, the queue must be a private queue with at least one representative. Check these facts:

- Representatives are added to the queue. Adding one triggers an assignment cycle.
- The queue is an advanced queue if you use unified routing. Learn says advanced queues cannot be associated with a mailbox.
- Queue priority is set sensibly. A smaller number has a higher priority, so queue 1 is handled before queue 2.

If a conversation is routed to a queue without representatives, the conversation closes automatically. Records stay in the queue.

## Step 3: Check overflow settings

Overflow can move or end items before they reach agents. Learn describes two stages. Before-queue checks run once per item. After-queue checks run when an item has waited too long. Configure them under **Customer support** > **Queues** > **Advanced queues** > the queue > **Overflow handling**.

Points that explain odd behavior:

- Adding an operating hour record to a queue creates an **Out of operation hours** condition with the action **Assign to queue anyway**.
- Items sent to a fallback queue skip that queue's overflow settings.
- For records, the options are limited: out of operating hours before queueing, and waiting time in queue after queueing, with the action **Transfer to a different queue**.
- Overflow is checked only once before queueing. After an overflow action or a supervisor transfer, no further pre-queue checks run.

## Step 4: Check why agents are not receiving work

The Learn troubleshooting page covers the common case of available agents who get nothing. Automatic assignment looks at presence and capacity, plus skills or other attributes in the assignment configuration. Check in this order:

1. If the workstream uses an out-of-the-box method such as highest capacity or advanced round robin, open the work distribution settings in the workstream and verify that agent presences match the allowed presences.
2. Check the agent's available capacity in the **Agent details** drill-down of the real-time analytics dashboard.
3. For unit-based capacity, check the available units.
4. For a capacity profile, check the available profile units and whether another capacity profile blocks capacity from other profiles.

Then check skills. For highest capacity, the **Default skill matching algorithm** decides whether skills must match exactly or by closest match. If no agent has the skills found during classification, the item returns to the queue. If you change a rating model, open work items keep the old rating, which can leave no matching agents.

Know the triggers. An assignment cycle starts when a new item arrives, when presence changes, when capacity changes at runtime, when an agent is added to the queue, and every five minutes for records. Learn says a manual capacity change does not trigger assignment.

Custom assignment methods need extra care. Learn says you must configure presence, capacity and skill rules yourself because workstream defaults are not used. Default methods do not consider operating hours, so use the `is_working` operator in a custom rule if hours matter. Attributes with field-level security are not supported in custom assignment.

## Step 5: Check capacity that is not released

If an agent finishes work but capacity stays occupied, the cause is usually how the conversation was closed. For voice and chat, ending a conversation without using the **X** button leaves it in wrap-up, and capacity stays occupied until the wrap-up time ends. For social, Teams, SMS and persistent chat, closing an active conversation releases capacity and moves it to waiting. Supervisors can check the ongoing conversations dashboard and the auto-close time.

## Step 6: Check declines and permissions

Learn counts a rejected notification and a timed-out notification as declines. By default, an agent can be offered the same item up to three times if they are uniquely qualified or all others declined. Afterwards, the agent is no longer considered for that item. The limit can be set from 1 to 5.

Permissions also matter. If a representative lacks access to the record, the system stops the assignment and closes the conversation. The FAQ says representatives can pick such items but cannot view details.

## Step 7: Use diagnostics carefully

The routing diagnostics page describes the path **Intake**, **Classification**, **Route to queue** and **Assignment**, with a status per rule set and an agent assignment trace. It lists a **Status reason** for the first three attempts, and after that the failure message updates hourly. The page also carries a notice that the feature is deprecated and points to the Customer Service deprecations page. Check that notice before building a process around it. It also says diagnostics data uses Dataverse storage.

## Typical mistakes

- Enabling unified routing and forgetting the intake rule.
- Using **Assign** and expecting routing to run.
- Creating a queue without representatives.
- Using a custom assignment method and expecting workstream presence and capacity settings to apply.
- Leaving conversations in wrap-up.

## What the sources do not say

The pages read for this article do not describe default queue behavior in detail, and the FAQ lists route-to-queue configuration and skipped rule sets as covered elsewhere. If a case still lands in the wrong queue after these checks, review the route-to-queue rules and their order in the workstream.

## Related

- [Dynamics 365 Customer Service](https://www.m365.fm/entity/dynamics-365-customer-service/)
- [Dynamics 365 Omnichannel](https://www.m365.fm/entity/dynamics-365-omnichannel/)
- [Dynamics 365 queue](https://www.m365.fm/entity/dynamics-365-queue/)
- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)

## Sources

- [Troubleshoot issues with automatic assignment](https://learn.microsoft.com/en-us/troubleshoot/dynamics-365/customer-service/unified-routing/troubleshoot-assignment-issues)
- [Assignment methods for queues](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/assignment-methods)
- [Set up unified routing for records](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/set-up-record-routing)
- [FAQ about unified routing](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/unified-routing-faqs)
- [Manage overflow of work items in queues](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/manage-overflow)
- [View diagnostics for unified routing](https://learn.microsoft.com/en-us/dynamics365/customer-service/administer/unified-routing-diagnostics)
