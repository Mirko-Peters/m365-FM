---
title: "Power Automate Try-Catch Error Handling and Logging Across Child Flows"
summary: "Build try-catch with Scope and Run after, capture error details with result() and workflow(), set retries and Terminate, and plan logging for parent and child flows. Includes what Microsoft's pages leave open."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [power-automate, power-platform, application-insights]
keypoints:
  - "Wrap main actions in a Try scope and add a Catch scope whose Run after is set to has failed."
  - "result('ScopeName') returns the outcomes of actions inside a scope. workflow() returns run metadata you can use to build a link to the failed run."
  - "Child flows must be in the same solution as the parent, start with Manually trigger a flow and end with Respond to a Power App or flow (or Response)."
  - "Child flows that use more than built-in actions or Dataverse need embedded connections. Parent-to-child connection passing is not supported."
  - "Learn does not describe how a child failure surfaces in the parent, so test that behavior with a deliberate failure."
faq:
  - q: "How do I build try-catch in Power Automate?"
    a: "According to Microsoft Learn, put the main actions in a scope named Try, create a second scope named Catch and set the Catch scope's Run after to has failed. Actions in the Catch scope can identify the error, log it and send a notification."
  - q: "Which Run after options exist?"
    a: "Microsoft Learn names is successful, has failed, is skipped and has timed out. Use them to create alternative paths, for example sending a notification when an update action fails."
  - q: "How do I get the error message in the Catch scope?"
    a: "Learn says result() returns the outcomes of actions in a scope and that a Filter array action can isolate the error. The page does not show the exact expression. A common pattern filters result('Try') for items whose status equals Failed, which is a pattern and not text from the page."
  - q: "What are the requirements for a child flow?"
    a: "Per Microsoft Learn, parent and child flows must be created in the same solution, the child uses Manually trigger a flow and ends with Respond to a Power App or flow or the premium Response action. The parent calls it with Run a Child Flow."
  - q: "Does Learn say how a failed child flow appears in the parent?"
    a: "No. The child flows page does not document error propagation, retry behavior or maximum nesting depth. Test with a deliberate failure and read the parent's run history."
---

The standard pattern is a **Try** scope for the main work and a **Catch** scope that runs only when Try has failed. Inside Catch you read the error, write a log entry, notify someone and, when needed, stop the flow with **Terminate**. With child flows, add the same pattern in each child and decide what the child returns to the parent. Microsoft's pages do not describe how a child's failure reaches the parent, so verify that in a test.

## Step 1: Build the Try and Catch scopes

1. Add a **Scope** action and rename it `Try`. Put the main actions inside.
2. Add a second **Scope** below it and rename it `Catch`.
3. Open the Catch scope's menu, select **Configure run after**, and clear **is successful**. Select **has failed**. If a timeout should also be handled, select **has timed out** as well.

Run after outcomes named by Learn: **is successful**, **has failed**, **is skipped** and **has timed out**.

## Step 2: Capture error details

`result('Try')` returns the outcomes of the actions inside the scope. Learn says to filter this output with a **Filter array** action to isolate the error. The page does not show the expression. A common pattern, not taken from the page:

```
Filter array input:  @result('Try')
Filter condition:    @equals(item()?['status'], 'Failed')
Message:             @body('Filter_array')[0]?['error']?['message']
```

`workflow()` returns run metadata including `name`, `tags` (with `flowDisplayName`, `environmentName`, `logicAppName`, `triggerType` and more) and `run` (with `id` and `name`). Parse it with **Parse JSON** and the schema from the Learn page. Learn also shows how to build the run URL with **Compose**:

```
https://make.powerautomate.com/environments@{body('Parse_JSON')?['tags']?['environmentName']}/flows@{body('Parse_JSON')?['tags']?['logicAppName']}/runs@{body('Parse_JSON')?['run']}
```

The page warns that adding this everywhere can create excessive logging and degrade performance.

## Step 3: Log and notify

In Catch, write the error details to a SharePoint list or other storage, then notify stakeholders. Microsoft also notes that the service emails flow owners about common failures such as broken connections or throttling. For monitoring beyond custom logging, the page recommends Application Insights and links to the setup article.

Log fields worth keeping: flow name, run link, scope name, error message and time.

## Step 4: Retries and Terminate

- **Retry policy** is set in each action's settings. Learn prefers **exponential** over fixed intervals, for example retries after 1, 2 and 4 minutes, with an initial interval and a maximum count. It targets transient faults such as network or service problems.
- **Terminate** stops the flow on a critical error. Set the status to `Failed` so no further actions run, and add a status message so the cause is clear.

The page does not say how run history reports a flow whose Catch scope handled the error, so check a deliberate failure in your own tenant. Decide per flow whether a handled error should still end as Failed with Terminate, so that monitoring and the owner emails see it.

## A minimal checklist for every flow and child

1. Main actions sit inside a Try scope.
2. A Catch scope runs on has failed and logs the error, the flow name and the run link.
3. Retry policies on actions that call external services use exponential intervals.
4. Critical errors end in Terminate with status Failed and a clear message.
5. Child flows return a status and a message, and the parent checks them.
6. Logging is limited to what you will read, because excessive logging can degrade performance.

## Step 5: Set up child flows correctly

Requirements from the Learn child flows page:

| Item | Requirement |
|---|---|
| Solution | Parent and child created in the same solution |
| Child trigger | **Manually trigger a flow** |
| Child return | **Respond to a Power App or flow**, or **Response** (premium HTTP connector) |
| Call | **Run a Child Flow** action (Flows connector, Built-in tab) |
| Connections | Embedded connections for anything beyond built-in actions and Dataverse |

Parent-to-child connection passing is not supported. If you see an error that child workflows only support embedded connections, open the child's properties, select **Edit** in the **Run only users** tile and choose **Use this connection** for each connection. The parent waits for the child for the lifetime of the flow: one year for built-in connections and Dataverse, 30 days for all others.

A child flow does not inherit process license capacity from the parent's flow group. Add both flows to the same flow group, and each counts toward the 25-flow limit.

## Step 6: Decide what a child returns on failure

Because the child must end with a response, a clean design is to define outputs such as `status` and `message`. Return `Succeeded` from the Try path and `Failed` with the error text from the Catch path, then let the parent check `status` after **Run a Child Flow**. This is a design choice, not a documented Microsoft pattern, so test it. Also test what the parent run shows when the child fails without returning, because Learn does not document it.

## What Learn does not cover

- The error handling page does not cover the `actions()` function or child flows.
- The child flows page does not cover maximum nesting depth, error propagation or per-run limits beyond the wait windows.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)
- [Application Insights](https://www.m365.fm/entity/application-insights/)

## Sources

- [Error handling in Power Automate](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling)
- [Create child flows](https://learn.microsoft.com/en-us/power-automate/create-child-flows)
