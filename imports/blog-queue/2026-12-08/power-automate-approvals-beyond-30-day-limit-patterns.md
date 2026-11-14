---
title: "Power Automate approvals beyond the 30-day limit: patterns for long-running flows"
summary: "A flow run waits at most about 30 days, so slow multi-stage approvals need a different design. Learn what Microsoft documents, how to split approvals across flows and how to avoid stuck or abandoned requests."
status: review
publish: false
author: mirko-p
date: 2026-12-08
topics: [power-automate, multistage-approvals, power-automate-run-history]
keypoints:
  - "Learn lists a run duration limit of 30 days, including pending steps such as approvals. Another Learn page states 28 days, so design for the shorter value."
  - "When the wait runs out, the flow fails but the approval stays in the action center. Abandoned approvals must be deleted manually by the requestor or an environment admin."
  - "Microsoft's guidance for flows that may run longer than 30 days is to store approvals in Dataverse and use one flow to send the request and another to process responses."
  - "For multi-level approvals, parent and child flows give each approver their own 30 days to respond."
  - "Do not split Create an approval and Wait for an approval far apart. A response that arrives before the wait action can leave the flow stuck."
faq:
  - q: "What is the maximum time a Power Automate approval can wait?"
    a: "The limits page on Microsoft Learn lists a run duration of 30 days, calculated from the run's start time and including pending steps such as approvals. The approvals known-issues page says an approval flow can wait for 28 days. Because the two pages differ, plan for 28 days to be safe."
  - q: "What happens to the approval when the flow times out?"
    a: "Learn's approvals known-issues page says only the flow is affected. The approval continues to exist in the action center, which can leave abandoned approvals with no flow waiting on them. The requestor or an environment admin then deletes them manually. The page does not say what an approver's late response does."
  - q: "How do I build a multi-stage approval that takes months?"
    a: "Microsoft Learn suggests breaking the approval into parent and child flows, which gives each approver 30 days to respond. For flows that might run longer than 30 days, it recommends storing approvals in Microsoft Dataverse and using two flows, one to send the request and one to act on the response."
  - q: "What is the difference between Start and wait for an approval and Create an approval?"
    a: "Learn explains that Start and wait for an approval creates the records, sends notifications and blocks the run until criteria are met or the action times out. Create an approval creates the records and sends notifications without blocking, and you use Wait for an approval to collect responses."
  - q: "Can a flow be switched off while it waits?"
    a: "Yes, for different reasons. Learn's limits page says a cloud flow with continuously failing triggers or actions is turned off after 14 days, and a flow without trigger activity for 90 days might be turned off. Flows owned by users with premium licenses, or assigned capacity licenses, are not subject to the 90-day suspension."
---

A single Power Automate run cannot wait for an approval forever. Microsoft documents a 30-day limit for run duration, and one approvals page says 28 days. For approvals that take longer, do not keep one flow open. Store the approval in Dataverse and let a second flow pick up the response, or give each stage its own flow run.

## What the limits say

The Power Automate limits page lists **Run duration: 30 days**, calculated from the run's start time and including flows with pending steps like approvals. After 30 days, any pending steps time out. Run retention in storage is also 30 days.

The approvals known-issues page is stricter: an approval flow can wait for 28 days, and if the wait exceeds that, the flow fails. This affects the flow only. The approval remains in the action center, which can create abandoned approvals that no flow is waiting on. The requestor or an environment admin must delete them manually.

The two pages disagree, so treat 28 days as the planning limit.

## Why it matters for multi-stage approvals

Sequential approvals add up. Three stages with two weeks each already run past 28 days if they live in a single run. The timer starts when the run starts, not when each stage starts.

## Pattern 1: Parent and child flows

Learn's guidance for multi-level approvals is to break each approval out into parent and child flows. Each child flow is its own run, so each approver gets their own 30 days.

1. The parent flow starts the process and calls a child flow for stage 1.
2. When the child finishes, the parent calls the next child for stage 2.
3. The parent decides on the final outcome.

The limits page adds a caution. Child flows that start before a response action continue to run separately, and the page describes this as a way to let a flow respond and continue other work. The pages I read do not say the parent's own duration resets, so test how the run time of the parent behaves in your tenant.

## Pattern 2: Dataverse and two flows

Microsoft's approvals documentation says that if a flow might run longer than 30 days, store the approvals in Microsoft Dataverse. This lets you create flows that act on responses even after the original flow run times out. The recommended structure is two flows: one that sends the request, and one that processes responses.

Build it like this:

1. Flow A uses **Create an approval** (v2), which creates the Dataverse records and sends notifications without blocking the run.
2. Flow A saves the approval ID and the business record ID somewhere durable, such as a Dataverse table or SharePoint list, and ends.
3. Flow B starts when the approval is completed and updates the business record. Check the exact trigger name in the Approvals connector in your environment, because the pages I read do not name it.

This is a design inference from Microsoft's guidance, not a documented template, so test it with a short approval first.

## Choose the right approval action

| Action | Behavior | Use when |
|---|---|---|
| Start and wait for an approval | Creates records, sends notifications, blocks until criteria are met or it times out | Short approvals inside one run |
| Create an approval | Creates records and sends notifications, does not block | Long approvals, Teams adaptive cards, logging the request |
| Wait for an approval | Collects responses, approvers and comments | After Create an approval in the same flow |

## Pitfalls that Microsoft lists

- **Split actions placed far apart.** If a user responds before the flow reaches the wait action, the flow can get stuck. Keep create and wait close together, or change the approval status in Dataverse before the wait action.
- **Do until loops.** Flows can loop forever unless they handle every outcome. Basic and await-all approvals end as Approved, Rejected or Canceled, so use a condition or switch.
- **Guests.** Guests need a valid Power Automate license to view or respond. Guests with pending invitations are removed from the assignee list.
- **Custom responses with Everyone must approve.** These can fail with many users because of data size limits in the results field.
- **Time zone.** Approval timestamps are always shown in UTC.

## Keep the flow itself alive

Learn's limits page also lists retention rules. A cloud flow whose trigger or actions fail continuously is turned off after 14 days. A flow that is not triggered within 90 days might be turned off, unless it is owned by a user with a premium license or has a Process license. Owners get a notice 30 days before suspension.

## A cleanup routine

Because timed-out flows leave approvals behind, plan a periodic check. Someone with the right role can review the **Approvals** area and delete approvals that have no flow waiting. The pages I read do not describe a bulk method.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Multistage approvals](https://www.m365.fm/entity/multistage-approvals/)
- [Power Automate run history](https://www.m365.fm/entity/power-automate-run-history/)

## Sources

- [Limits of automated, scheduled, and instant flows](https://learn.microsoft.com/en-us/power-automate/limits-and-config)
- [Known issues with approvals](https://learn.microsoft.com/en-us/power-automate/approvals-known-issues)
- [Create and test an approval workflow with Power Automate](https://learn.microsoft.com/en-us/power-automate/modern-approvals)
- [Known issues and limits (Microsoft Learn training)](https://learn.microsoft.com/en-us/learn/modules/approvals-power-automate/5-issues-limits)
- [Differences between flow approval actions](https://learn.microsoft.com/en-us/troubleshoot/power-platform/power-automate/approvals/differences-between-flow-approval-actions)
