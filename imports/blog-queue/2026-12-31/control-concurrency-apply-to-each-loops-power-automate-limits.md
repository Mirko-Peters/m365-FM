---
title: "Control Concurrency in Apply to Each Loops in Power Automate: Settings and Limits"
summary: "How to speed up Apply to each loops in Power Automate by changing concurrency, using Microsoft Learn: the default of one, the degree of parallelism 1 to 50, a timing example, nested loop behavior, the array limits, and the separate trigger concurrency setting."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [power-automate, power-automate-concurrency-control]
keypoints:
  - "Apply to each runs one item at a time by default. Learn gives a degree of parallelism of 1 to 50 and a default of 1."
  - "In the Learn timing example for an array of 4 items, the loop took 21 seconds off, 11 seconds at 2, and 6 seconds at 4 and at 6."
  - "Concurrency applies only to the highest-level loop. Nested loops run sequentially."
  - "The array limit for Apply to each is 5,000 items for Low and 100,000 for other plans, and nesting is limited to depth 8."
  - "Trigger concurrency is a separate setting. Once concurrency control is turned on it cannot be turned off, according to Learn."
faq:
  - q: "Does Apply to each run in parallel by default?"
    a: "No. According to Microsoft Learn, Apply to each runs sequentially by default, with a default concurrency of 1."
  - q: "What is the maximum degree of parallelism?"
    a: "Learn lists a range of 1 to 50 for the Apply to each degree of parallelism, with 50 as the maximum."
  - q: "Do nested loops also run in parallel?"
    a: "According to Microsoft Learn, concurrency applies only to the highest-level loop, and nested loops run sequentially."
  - q: "Can I turn concurrency control off again?"
    a: "Learn states that concurrency control is irreversible once turned on."
  - q: "How many items can an Apply to each loop handle?"
    a: "According to the Microsoft Learn limits page, the array limit is 5,000 items for Low and 100,000 items for other plans."
---

An Apply to each loop in Power Automate runs one item at a time by default. To speed it up, turn on concurrency for the loop and set a degree of parallelism between 1 and 50. This guide uses two Microsoft Learn pages: the guidance on implementing parallel execution and the limits and configuration page.

## What Learn says about the default

Apply to each runs sequentially by default. Learn gives a default concurrency of 1 and a maximum of 50. The guidance page shows the setting in screenshots only, so it gives no click path and no label text. The page calls the setting the degree of concurrency, or parallelism.

## When Learn suggests parallel execution

The guidance page says parallel execution and concurrency run multiple actions at the same time and can significantly reduce execution time. For parallel execution in branches, it suggests considering tasks that do not depend on each other and tasks that take more than five seconds, presented as guidance and not a hard rule. The goal is to optimize performance without overwhelming the system.

For Apply to each, the page lists these use cases:

- Sending individual emails to many recipients.
- Updating records in Dataverse, SharePoint lists and SQL.
- Creating users in Microsoft Entra ID in bulk.
- Creating parallelized approvals.

The page also warns about overhead. Dividing work, queuing extra threads and endpoint delays add cost, so a high number such as 50 might not make things faster.

## A timing example

The guidance page gives this table for an array of 4 items:

| Degree of parallelism | Time to run the loop |
|---|---|
| Off | 21 seconds |
| 2 | 11 seconds |
| 4 | 6 seconds |
| 6 | 6 seconds |

The page does not explain the test setup, such as the action type, the endpoint or the environment. Going from 4 to 6 gave no gain for a 4-item array. That reading is an inference from the numbers and not a statement from the page. Treat the figures as an illustration and not as a promise for your flow.

## Rules that matter

- Concurrency controls for Apply to each take effect only on the highest level in the flow. When you nest Apply to each actions, the inner actions always run sequentially.
- Skipped actions, which are actions whose condition is not met, still consume resources even though they do not run. They often occur in switch branches. The page recommends calling child flows from the switch branch instead of adding many individual actions.
- The pages do not discuss variables or the order of results from concurrent iterations.

## Limits from the limits page

| Item | Value on the limits page |
|---|---|
| Apply to each default concurrency | 1 |
| Apply to each maximum concurrency | 50 |
| Array items for Apply to each | 5,000 for Low, 100,000 for others |
| Until loop | Default 60, maximum 5,000 |
| Nesting depth | 8 |
| Split on items with trigger concurrency | 100 |

## Trigger concurrency is a different setting

Concurrency can also be set on a trigger. The limits page states that with trigger concurrency off, the number of runs is unlimited, and with it on the range is 1 to 100 with a default of 25. The article on optimizing triggers describes it as off by default, with a default parallelism of 1 once enabled. Learn states that concurrency control is irreversible once turned on: the limits page says it cannot be undone without deleting and re-adding the trigger, and the triggers article says to create a new flow. The triggers article also names dirty reads as a reason to use trigger concurrency control. Read that article before you change a production trigger.

The setting on Apply to each controls items inside one run. Trigger concurrency controls how many runs execute at the same time. They are separate decisions.

## Suggestion: things to check before raising the value

This section is a practical suggestion and not a Microsoft statement, because the Learn pages do not cover it.

1. Check whether each iteration depends on the result of another. If it does, parallel execution can change the outcome.
2. If the loop sets or appends to a variable, test with a small array first, because parallel iterations may change the order or the values.
3. Check the limits of the services the loop calls. A higher degree can send many calls at once.
4. Raise the value step by step, as in the timing table, and measure.

## Not covered

The pages I read do not describe the following:

- A click path or exact label for the setting.
- Behavior of variables and ordering in parallel loops.
- Throttling limits of individual connectors.
- Why the trigger concurrency default differs between the two pages: 25 on the limits page and 1 on the triggers article.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Automate concurrency control](https://www.m365.fm/entity/power-automate-concurrency-control/)

## Sources

- [Optimize flows with parallel execution and concurrency (Microsoft Learn)](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/implement-parallel-execution)
- [Limits of automated, scheduled, and instant flows (Microsoft Learn)](https://learn.microsoft.com/power-automate/limits-and-config)
- [Optimize Power Automate triggers (Microsoft Learn)](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/optimize-power-automate-triggers)
