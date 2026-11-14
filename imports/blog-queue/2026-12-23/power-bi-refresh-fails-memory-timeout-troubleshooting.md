---
title: "Power BI Refresh Fails With Not Enough Memory or Timeouts: Troubleshooting Guide"
summary: "Fix Power BI scheduled refresh failures from memory limits and timeouts: error codes, refresh time limits, incremental refresh, gateway and source timeouts, disabled schedules and throttling messages."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [power-bi-service]
keypoints:
  - "Memory failures show as Query memory limit exceeded or there wasn't enough memory to finish, error code 0xC13E0003. Resource governance cancels the refresh when memory hits the enforced limit."
  - "Learn lists incremental or partition-level refresh, fewer parallel partitions, smaller models, scale-out and a larger Fabric SKU as fixes."
  - "Scheduled refresh of an imported semantic model times out after 2 hours, or after 5 hours in a Premium workspace."
  - "Power BI disables a scheduled refresh after four consecutive failures. Fix the cause, then re-enable the schedule."
  - "Source query timeouts can be raised with CommandTimeout in M. Entra ID OAuth tokens expire in about an hour, so long loads can fail on credentials."
faq:
  - q: "What does error 0xC13E0003 mean?"
    a: "Microsoft Learn lists it with the messages Query memory limit exceeded and This operation was canceled because there wasn't enough memory to finish running it. Refresh needs memory for the existing model, the new copy and temporary structures, and resource governance cancels the operation when peak use hits the capacity limit."
  - q: "How long can a scheduled refresh run?"
    a: "Learn says scheduled refreshes of imported semantic models time out after two hours, increased to five hours in Premium workspaces. A separate section gives a 1 GB maximum size for semantic models imported into the Power BI service and a 10 GB limit on uncompressed data processed during refresh in shared capacity. Premium semantic models are not subject to those two limits."
  - q: "Why was my scheduled refresh turned off?"
    a: "Learn says that if a scheduled refresh fails four times in a row, Power BI disables it. Fix the underlying problem, then re-enable the schedule."
  - q: "How do I fix a source query timeout?"
    a: "Learn lists increasing the CommandTimeout value in the M code when long-running source queries contribute to refresh failures. For the overall scheduled refresh time-out it suggests reducing model size or complexity or refactoring the model into several smaller semantic models."
  - q: "What do the capacity limit messages mean?"
    a: "For Premium, messages such as You've exceeded the capacity limit for semantic model refreshes, Capacity level limit exceeded and Node level limit exceeded point to throttling. Learn says to reschedule refreshes to off-peak times, space them out or retry."
---

Refresh failures that mention memory or timeouts come from resource limits, not from a broken report. This guide follows Microsoft Learn's refresh troubleshooting page. It starts with the basics, then covers memory, timeouts, gateways and throttling.

## Start with the basics

Learn says to confirm that the gateway is up to date and that the semantic model has a gateway selected. A missing gateway can mean the data source changed or is missing.

## Memory errors

Refresh needs memory for the existing model, the new copy that is being processed and temporary structures. When peak usage reaches the capacity's enforced limit, resource governance cancels the operation.

**Messages and code:**

- `Query memory limit exceeded`
- `This operation was canceled because there wasn't enough memory to finish running it.`
- Error code `0xC13E0003`

**Checks before changing the model:**

- If the capacity is briefly low on memory, wait and retry.
- After moving a workspace to another capacity, the new capacity may enforce a lower per-model refresh memory limit, so compare the limits.

**Fixes Learn lists:**

1. Use incremental refresh, or refresh at table or partition level instead of a full refresh.
2. Reduce parallel partition processing.
3. Remove unneeded columns and rows, reduce high-cardinality columns and move calculated tables or columns upstream.
4. Enable semantic model scale-out.
5. Move the workspace to a higher F SKU.

If errors persist, open a support ticket.

## Timeouts and size limits

| Scenario | Limit |
| --- | --- |
| Scheduled refresh, imported semantic model | 2 hours |
| Scheduled refresh, imported model, Premium workspace | 5 hours |
| Uncompressed data processed during refresh, shared capacity (Premium is not subject to this limit) | 10 GB |
| Maximum imported semantic model size in the Power BI service | 1 GB |

To stay inside the limits, reduce model size or complexity or split the model into smaller semantic models. For source query timeouts, increase `CommandTimeout` in the M code.

For sources that use Microsoft Entra ID OAuth, such as Dynamics CRM Online and SharePoint Online, Learn says the token expires in about one hour while a load can run up to two hours. Expect credential failures on long loads.

## Gateway and connection errors

- `GatewayNotReachable` when setting credentials: install the latest gateway and retry.
- `The connection either timed out or was lost` from the Analysis Services connector: usually transient, so retry. If it persists with complex M joins, Learn suggests wrapping the outer-join table in `Table.Buffer`.
- For dataflows, Microsoft supports only the last six gateway versions, so update the gateway.

## Refresh disabled after repeated failures

If a scheduled refresh fails four times in a row, Power BI disables it. Fix the cause, then turn the schedule back on.

## Credential errors

For Access to the resource is forbidden, or failures after a password change, Learn says to clear the browser cache, sign in and open `https://app.powerbi.com?alwaysPromptForContentProviderCreds=true` to re-enter credentials.

## Throttling on Premium

- `You've exceeded the capacity limit for semantic model refreshes`: reschedule to off-peak times, space refreshes out or retry.
- `Capacity level limit exceeded` or `Node level limit exceeded`: retry or reschedule.
- `Container exited unexpectedly with code 0x0000DEAD`: disable the scheduled refresh and republish the model.

## Other errors on the page

- `Processing Error: The following system error occurred: Type Mismatch`: check the M script or update Power BI Desktop.
- A circular dependency with `SummarizeColumns` in calculated tables: add the referenced tables as filter arguments. Tabular Editor can change several tables in one transaction.

## Triage order (my advice)

1. Read the exact message and code.
2. Check gateway version and gateway selection.
3. For memory, look at what changed: data volume, a new capacity, new calculated columns.
4. Move to incremental refresh or partition refresh if the model is large.
5. For timeouts, find whether the limit is the whole refresh or one source query.
6. For throttling, look at when refreshes are scheduled on the capacity.

## What the page does not say

The Learn page does not mention a daily refresh count limit, so none is stated here. Check the limits for your license type separately. It also does not give per-SKU memory numbers.

## Related

- [Power BI service](https://www.m365.fm/entity/power-bi-service/)

## Sources

- [Troubleshoot refresh scenarios (Microsoft Learn)](https://learn.microsoft.com/power-bi/connect-data/refresh-troubleshooting-refresh-scenarios)
