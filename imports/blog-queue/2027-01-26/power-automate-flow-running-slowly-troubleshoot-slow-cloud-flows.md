---
title: "Power Automate Flow Running Slowly: Troubleshoot Slow Cloud Flows"
summary: "A slow cloud flow usually has one of five causes on the Learn page: a slow service, connector throttling, plan action limits, data allowance or other limits. What to check, how to read the 429 error, and the two resolutions."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [power-automate, power-automate-run-history, power-automate-process-license]
keypoints:
  - "The Learn page covers flows that run slowly or look stuck on one step, not triggers that never fire and runs that never start."
  - "The page lists five causes: slow service, connector throttling, daily action limits, daily data allowance, and the limits and configuration page."
  - "A 429 Too Many Requests error with text like Rate limit is exceeded points to connector throttling. The SharePoint connector example is 600 actions per minute."
  - "Every card in a flow counts as an action, including variable steps and delays. Only completed and failed actions count toward the plan limit, not skipped ones."
  - "Resolution 1 is to redesign the flow for fewer actions and less data. Resolution 2 is a Premium or Process license bought by a tenant administrator."
faq:
  - q: "Does this page help when a flow does not start at all?"
    a: "No. The Learn page says it does not apply to cases where triggers are not firing, where the flow does not start or show up in the run history list. It covers flows that run slowly and might appear stuck on a single step in the flow run details."
  - q: "How do I recognize connector throttling?"
    a: "The page says you might see a 429 Too Many Requests error in the flow, with text such as Rate limit is exceeded. Try again in 27 seconds. Its example is the SharePoint connector, which caps actions at 600 per minute, even when one connection is used across several flows. Most connector pages have a Throttling section that documents the limit."
  - q: "Which actions count toward the daily limit?"
    a: "Every card executed in a flow counts as an API call, including actions that make no outgoing call, such as setting a variable or a delay. Only completed and failed actions count, skipped actions do not. For the separate limits on the limits and configuration page, both executed and skipped actions count."
  - q: "Where can I see how many actions a flow uses?"
    a: "The page points to the Analytics tab on the flow details page to check actions and usage."
  - q: "What can I change in the flow itself?"
    a: "Reduce loop iterations by retrieving fewer items, use the Filter query and Top count parameters that many connectors offer, lower the frequency of scheduled flows, keep file sizes small, and store a reused property from a large action output in a variable. The page notes that all outputs of an earlier action are passed to later actions even if only one property is used."
---

A cloud flow that runs slowly, or seems stuck on one step, is not always broken. The Microsoft Learn page on slow running flows lists five causes and two resolutions. This article follows that page and adds a checking order that I mark as my own advice. One limit of the page comes first: it does not apply to flows whose trigger does not fire. If the flow never starts or never shows up in the run history, a different article is the right one.

## What the page describes

The symptom on the page is simple. A flow runs slowly and might appear to get stuck on a single step in the flow run details. The five causes below are in the page's order.

## Cause 1: The service you connect to runs slowly

The page gives one example. A slow running SQL query can slow a flow down while the flow waits for the query to complete. In this case the flow is waiting for another system, so the fix is on the other side.

## Cause 2: Connector throttling

Connectors can slow your flow as a service protection mechanism. The page gives this example: the SharePoint connector caps actions at 600 per minute, and one SharePoint connection used across several flows can still run only 600 operations per minute.

- Most connector pages have a **Throttling** section that documents the limit.
- You might see a 429 (Too Many Requests) error in the flow, with text like "Rate limit is exceeded. Try again in 27 seconds."

## Cause 3: More actions than the daily limits of your plan

- The minimum number of actions for each plan is on the Request limits and allocation page of the Power Platform documentation.
- Every card executed in a flow counts as an API call (action). This includes actions that call another service, for example SharePoint, and actions that do not, for example setting a variable or a delay.
- Only completed and failed actions count toward the limit, not skipped ones.
- The page says the service typically allows higher counts than documented and does not slow flows down for occasional and reasonable overages. If the action count exceeds the limits, flows are subject to potential throttling, or are disabled in cases of extended violations.
- Check the actions and usage on the **Analytics** tab of the flow details page.

## Cause 4: More data than the daily allowance

This is the amount of data the flow consumes through input or output operations. The page gives no further detail in this cause, but the plan summary table has the data figures.

## Cause 5: The limits on the limits and configuration page

The page links the Power Automate limits and configuration page for these throttles. For them, both executed and skipped actions, for example in an if/else branch, count toward the limit. The page says that violating the plan limits is much more common than violating these.

It also describes a transition period with non-strict enforcement and higher limits. That text is old. The page was last changed in 2024 and still talks about the transition period ending later. For your tenant today, check the Request limits and allocation page and the licensing documentation instead of taking the figures below as current.

## Plan summary on the page

| Plan group | Limits per 24 hours | Data per day |
| --- | --- | --- |
| Office 365 Flow licenses, Power Apps per app, Dynamics team member and trials | Final limit 6,000 actions across all flows of one user. Transition limit 10,000 actions per flow | 1 GB across all flows of one user |
| Power Automate Premium, Power Apps Premium, Power Automate per user (also with attended RPA), Power Apps per user | 40,000 actions across all flows of one user. Transition limit 200,000 per flow | 10 GB across all flows of one user |
| Dynamics Professional and Dynamics Enterprise Application licenses | 40,000 actions across all flows of one user. Transition limit 200,000 per flow | 10 GB across all flows of one user |
| Power Automate Process license and per flow license | 250,000 actions per process. Transition limit 500,000 per flow | 50 GB storage per flow |

I copy these figures as the page states them, with the warning above that the page is old.

## Resolution 1: Redesign the flow for fewer actions and less data

- For Do until or For each loops, reduce the number of iterations by retrieving fewer items.
- Many connectors have **Filter query** and **Top count** parameters. Use them to reduce the number of items and the amount of data.
- Reduce the frequency of a scheduled flow. The page says many flows that run once per minute or hour can run less often.
- If the flow works with files, watch the file size and reduce it where possible.
- If you reuse one property of a large action output several times, store it with **Initialize variable** and use the variable later. The page says that even if you use only one property of an earlier action, all outputs of that action are passed to the later action as inputs.

## Resolution 2: Buy a Premium or Process license

A tenant administrator must buy the plan, because regular users get a message that individual plan purchases are not available. The administrator then applies the plan to the user who created the flow. Process plans can be assigned on the flow details page. After the license is bought and assigned, the flow author should resave the flow. Otherwise the page says flows are updated in the background once per week to reflect current plans.

For flows that run thousands of actions every day, the page suggests a Process license for better throughput and higher quotas, and says it gives the best performance quotas available. If you need more actions than Power Automate provides daily, it suggests exporting the flow to Logic Apps and points to the cost planning page for Azure Logic Apps.

## Checking order (my advice)

This is my suggestion, not the order of the page:

1. Open the run history and find the step where the time goes. A flow that waits on one step points to cause 1 or 2.
2. Look at that step's error text. A 429 with a retry time points to throttling, so open the Throttling section of that connector's page.
3. If the whole flow is slow across many runs, open the **Analytics** tab and compare the action count with the plan limit.
4. Look for loops that work on more items than needed. A filter on the source usually saves more than any later fix.
5. Check how many flows share one connection. The SharePoint example on the page says a shared connection shares the limit.
6. Only after that think about licensing. Buying a license for a flow with a wasteful loop moves the problem, it does not remove it.

## What the page does not cover

The page does not describe flow run timeouts, the limits of individual actions or performance of desktop flows. For those, use the limits and configuration page that it links.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Automate run history](https://www.m365.fm/entity/power-automate-run-history/)
- [Power Automate Process license (per flow)](https://www.m365.fm/entity/power-automate-process-license/)

## Sources

- [Troubleshoot slow running flows (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-automate/flow-run-issues/troubleshoot-slow-running-flows)
