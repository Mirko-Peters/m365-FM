---
title: "Power Automate Flow Failed: Read Run History and Fix Common Error Codes"
summary: "Find the failed step in Power Automate run history, read inputs and outputs, and fix 400, 401, 403, 404, 500 and 502 errors, including Conditional Access problems for flows embedded in SharePoint, Teams or Excel."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [power-automate, power-automate-run-history]
keypoints:
  - "Open My flows, select the flow, then the date in the 28-day run history with a Failed status. The failed step has a red exclamation icon."
  - "Inputs show what the action sent. Outputs show the downstream service's real error message and status code."
  - "Learn says 401 and 403 authentication errors can usually be fixed with View Connections > Fix connection, then Resubmit. A 403 can also come from DLP, permissions or licensing."
  - "400 and 404 point to an action setting that does not work as expected, such as malformed input or a missing resource. 500 and 502 are temporary, so use Resubmit."
  - "Flow owners get repair tips emails with a Fix my flow link on failure, which can be turned off in the flow properties."
faq:
  - q: "Where do I find why a flow failed?"
    a: "According to Microsoft Learn, go to My flows, select the flow, and in the 28-day run history select the date of the run with a Failed status. Find the step with the red exclamation icon, open it and read the error in the right pane."
  - q: "What do Inputs and Outputs tell me?"
    a: "Learn's error reference says the Inputs section shows exactly what was sent, and that expanding Outputs shows the actual error message and status code from the API."
  - q: "How do I fix a 401 or 403 error?"
    a: "Learn says 401 or 403 authentication errors can usually be fixed by updating the connection: in the right pane under How to fix select View Connections, select Fix connection next to the unauthenticated connection, verify your credentials and select Resubmit. The error reference adds that a 403 can come from a DLP policy, missing permissions on the target or a missing premium license. If the flow fails only when embedded in SharePoint, Teams or Excel, review Conditional Access, because policies can differ between the host app and Power Automate."
  - q: "Which Conditional Access settings does Learn mention?"
    a: "Target the Office 365 app or All cloud apps. If you target individual apps, include Microsoft Flow Service with application ID 7df0a125-d3be-4c96-aa54-591f83ff541c, exclude service accounts and flow connection owners from Terms of Use grant controls, and have affected users sign out and in again."
  - q: "Does the page cover 429 or 504 errors?"
    a: "No. The troubleshooting page does not mention 408, 429 or 504 errors, the flow checker or retry policy defaults, and neither does the error code reference, which covers named errors such as ActionTimedOut and FlowCheckerError."
---

When a cloud flow fails, the answer is almost always in the run history. This guide follows Microsoft Learn's troubleshooting page for failed cloud flows. It covers how to find the failing step, how to read the error and what Learn says to do for each status code it lists.

## Find the failed run

1. Go to **My flows** and select the flow.
2. In the **28-day run history** section, select the date of the run with a **Failed** status.
3. Find the step with a red exclamation icon, open it and read the error in the right pane.

To make runs easier to spot, select **Edit columns** on the flow details page and add trigger output columns, for example `hasAttachments` or `isHTML`, to the run history view.

## Read the error

- **Inputs** shows exactly what was sent to the action's service.
- **Outputs** shows the downstream service's actual error message and status code.

The Learn pages do not describe Inputs and Outputs together as a rule. My advice: compare the two, because a wrong value in Inputs points to the flow design, while a message in Outputs shows what the other side rejected.

## Fix by status code

| Code | Meaning per Learn | Fix |
| --- | --- | --- |
| 401 Unauthorized | Authentication error, token invalid or expired | **View Connections** in the right pane, **Fix connection**, then **Resubmit** |
| 403 Forbidden | Listed with 401 as an authentication error. The error reference says the user or app lacks permission | Fix the connection. Also check DLP policies, target permissions and premium licensing. If it fails only when embedded, review Conditional Access |
| 400 Bad request | An action setting does not work as expected, for example malformed input | Inspect Inputs, **Edit** the flow to correct the action, save and **Resubmit** |
| 404 Not found | The resource the action tries to access does not exist | Check that the resource exists, correct the action, save and **Resubmit** |
| 500 Internal server error | Temporary service failure | **Resubmit** |
| 502 Bad gateway | Temporary service failure | **Resubmit** |

## Conditional Access and embedded flows

If a flow works at make.powerautomate.com but fails with an authentication error from SharePoint, Teams or Excel, a Conditional Access policy may differ between the host app and Power Automate. Learn's guidance:

- Target the **Office 365** app or **All cloud apps** in the policy.
- If you target individual apps, include **Microsoft Flow Service** (application ID `7df0a125-d3be-4c96-aa54-591f83ff541c`) with matching requirements.
- Exclude service accounts and flow connection owners from Terms of Use grant controls.
- Affected users must sign out and sign back in.

## Other tools from the page

- **Repair tips emails** are sent to flow owners on failure and include a **Fix my flow** link. You can turn them off in the flow's properties menu.
- **Troubleshoot in Copilot** in the new designer gives a plain-language error summary and, when possible, a suggested fix.
- **Desktop flows:** the error reference says desktop flow errors are covered on a separate troubleshooting page.
- **Error handling:** the troubleshooting page links a training module on error handling best practices. The error reference suggests **Configure run after** settings.

## A short triage routine (my advice)

1. Open the failed run and the failed step.
2. Read Outputs for the status code and message.
3. For 401 and 403, reconnect the connection first.
4. For 400 and 404, compare Inputs with what the target service expects.
5. For 500 and 502, resubmit once, then look again.
6. If a flow fails only inside SharePoint, Teams or Excel, check Conditional Access.

## Error names in the error reference

Microsoft Learn also has a cloud flow error reference that explains named errors, not just status codes. Entries it covers:

| Error | What it means | Fix on the page |
| --- | --- | --- |
| InvalidTemplate | Syntax error in an expression or action configuration | Check unmatched parentheses or quotes, and make sure action names match exactly, case-sensitive |
| ActionFailed | Generic wrapper for a failing action | Open the failed action and expand **Outputs** to see the underlying API error |
| Unauthorized (401) | Authentication token invalid or expired | Under **Connections**, select **Fix connection** and sign in again. For service principals, rotate the secret in Entra ID |
| NotFound (404) | The resource does not exist | Confirm it exists, update renamed references, replace hardcoded IDs with dynamic lookups |
| ActionTimedOut | One action exceeded its timeout | Raise the action **Timeout** in **Settings** using an ISO 8601 duration such as `PT5M`. HTTP actions default to 100 seconds |
| OperationTimedOut | A long-running wait exceeded the maximum | Set explicit timeouts on webhook and approval actions and add a has timed out branch. Cloud flows have a maximum run duration of 30 days |
| WorkflowRunActionRepetitionQuotaExceeded | An Apply to each loop exceeded its iteration limit | Filter data before the loop, or use Select or Filter array |
| FlowRunQuotaExceeded | Daily action execution limit exceeded | Check usage in the admin center analytics, reduce actions or change the license tier |

For the loop limit the reference gives defaults of 100,000 for premium and 5,000 for performance profiles. The reference page itself does not cover 408, 429, 504 or retry policy defaults and points to two other pages that I did not read.

## What the page leaves out

Neither page covers the codes 408, 429 and 504 or retry policy defaults. The error reference has a FlowCheckerError entry but no guide to the flow checker. It links to a limits and configuration page for daily action limits. For throttling, use those pages rather than assuming a fix from the number alone.

## Related

- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Power Automate run history](https://www.m365.fm/entity/power-automate-run-history/)

## Sources

- [Troubleshoot a cloud flow (Microsoft Learn)](https://learn.microsoft.com/power-automate/fix-flow-failures)
- [Cloud flow error code reference (Microsoft Learn)](https://learn.microsoft.com/power-automate/error-reference)
