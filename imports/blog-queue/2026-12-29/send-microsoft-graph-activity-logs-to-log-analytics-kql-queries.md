---
title: "Send Microsoft Graph Activity Logs to Log Analytics: Prerequisites, Cost, Schema and KQL Samples"
summary: "Collect Microsoft Graph activity logs for your tenant using Microsoft Learn: license and role prerequisites, destinations, delivery time, cost estimates, cost reduction, key schema columns, limitations and the five sample KQL queries for failures, risky users and throttling."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [microsoft-graph-activity-logs, entra-id, log-analytics]
keypoints:
  - "Graph activity logs need a Microsoft Entra ID P1 or P2 license. Security Administrator is the only least privileged role the page lists for diagnostic settings."
  - "Stream the logs through Azure Monitor diagnostic settings to Log Analytics, Azure Storage or Event Hubs. The table is MicrosoftGraphActivityLogs."
  - "Events usually arrive within 30 minutes, and in less common cases up to 2 hours."
  - "Estimates: 1,000 users need about 14 GiB storage or 15 GiB in Logs per month, and 100,000 users about 1,000 GiB or 1,200 GiB."
  - "You cannot filter in diagnostic settings, and logs cover only your own tenant. Do not store secrets in directory attributes, because request URIs can be logged."
faq:
  - q: "What do I need to collect Graph activity logs?"
    a: "According to Microsoft Learn, a Microsoft Entra ID P1 or P2 license, an admin in a supported role such as Security Administrator, and an Azure subscription with a Log Analytics workspace, a storage account with List Keys permission or an Event Hubs namespace."
  - q: "How do I reduce the cost?"
    a: "Learn suggests a workspace transformation on the table to omit columns or rows, or switching the table to the Basic log data plan. Diagnostic settings themselves cannot filter."
  - q: "How do I correlate with sign-in logs?"
    a: "Join on the SignInActivityId column of the Graph logs and the UniqueTokenIdentifier of the sign-in tables, as in Learn's third sample. Some Microsoft apps may have no matching sign-in entries."
  - q: "Do the logs include a multitenant app's activity in other tenants?"
    a: "No. Learn says logs cover only the resource tenant."
  - q: "How do I recognise MCP Server requests?"
    a: "Learn says requests to the Microsoft MCP Server for Enterprise have a RequestUri that includes /enterprise."
---

Microsoft Graph activity logs are an audit trail of the HTTP requests that the Graph service receives and processes for your tenant. They cover line-of-business apps, API clients, SDKs, AI clients and Microsoft apps. This guide follows the Microsoft Learn overview.

## Prerequisites

- A Microsoft Entra ID P1 or P2 license.
- An admin in a supported role. Security Administrator is the only least privileged role the page lists.
- An Azure subscription with a destination: a Log Analytics workspace, an Azure Storage account where you have List Keys permission, or an Event Hubs namespace.

## Enable and send

Logs are streamed through diagnostic settings in the Azure portal or through Azure Resource Manager APIs. The page links to articles for each destination and does not give the category name to select, portal clicks or retention settings. Log Analytics holds them in the table `MicrosoftGraphActivityLogs`, Storage serves long-term retention and Event Hubs feeds external SIEM tools.

## Delivery and limits

- Events usually arrive within 30 minutes, in less common cases up to 2 hours.
- Logs cover the resource tenant only.
- Diagnostic settings cannot filter the data.

## Cost planning

| Users | Storage per month | Event Hubs messages per month | Azure Monitor Logs per month |
| --- | --- | --- | --- |
| 1,000 | 14 GiB | 62,000 | 15 GiB |
| 100,000 | 1,000 GiB | 4,800,000 | 1,200 GiB |

These are estimates for general consideration. To reduce cost, apply a workspace transformation to omit columns or rows, or switch the table to the Basic log data plan.

## Key columns

AppId and ServicePrincipalId identify the caller, and UserId the user. RequestUri, RequestMethod and ResponseStatusCode describe the call, DurationMs its length and IPAddress the client. ClientAuthMethod is 0 for a public client, 1 for client ID and secret and 2 for a client certificate. Roles and Scopes show token claims, and SignInActivityId links to sign-in logs. OperationId is shared across a batch.

## Sample queries

Learn gives five queries, abbreviated here.

```kusto
MicrosoftGraphActivityLogs
| where TimeGenerated >= ago(3d)
| where ResponseStatusCode == 401 or ResponseStatusCode == 403
| where RequestUri contains "/groups"
| summarize UniqueRequests=count_distinct(RequestId) by AppId, ServicePrincipalId, UserId
| sort by UniqueRequests desc
| limit 20
```

This one finds the top entities with authorization errors on groups. The other samples cover resources queried by potentially risky users through a join with AADRiskyUsers, a left outer join with the sign-in tables on SignInActivityId, apps throttled with status 429, and a time chart of request counts in 10-minute bins. Copy those from the page.

## Use cases

Learn lists reviewing all activity of consented apps, finding actions of a compromised account, detecting suspicious Graph use, investigating unexpected application permission grants, spotting extreme call volumes and monitoring AI clients.

## Warning

Do not store secrets such as passwords, tokens or connection strings in directory object attributes. Request URIs and values can be recorded in the logs, readable by admins and downstream destinations. Use a secret store such as Azure Key Vault.

## Rollout suggestion

This section is a suggestion. Use a dedicated workspace, check ingestion volume after a week and start with the throttling and error queries.

## Clouds and sources

The page lists the global service, US Government L4, US Government L5 (DOD) and China operated by 21Vianet as supported. Besides apps and SDKs, the logs include requests from AI clients that query the Microsoft MCP Server for Enterprise, and from Microsoft apps such as Outlook, Teams and the Microsoft admin portals.

## More columns worth knowing

Other columns include ConditionalAccessStatus, DeviceId, IdentityProvider, Location (the region that served the request), ResponseSizeBytes, SessionId, TokenIssuedAt, UniqueTokenId, UserAgent and Wids, which holds tenant-wide roles assigned to the user. The columns ATContent, ATContentH and ATContentP are reserved for future use.

## Reading the samples

The risky users sample joins to the AADRiskyUsers table, so it only returns data if Entra ID Protection data is available in the same workspace. That is an inference from the query text, not a statement on the page. The throttling sample extracts the first path segments of RequestUri to group by resource, which gives a count per app, resource and method.

## Not covered

The page does not give the diagnostic category name, click path, retention periods or volume caps.

## Related

- [Microsoft Graph activity logs](https://www.m365.fm/entity/microsoft-graph-activity-logs/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Log Analytics](https://www.m365.fm/entity/log-analytics/)

## Sources

- [Microsoft Graph activity logs overview](https://learn.microsoft.com/graph/microsoft-graph-activity-logs-overview)
