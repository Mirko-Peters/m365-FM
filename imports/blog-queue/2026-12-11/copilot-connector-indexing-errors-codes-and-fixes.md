---
title: "Copilot Connector Indexing Failures: Connection States, Error Codes and Fixes"
summary: "Fix Microsoft Graph connector (Copilot connector) indexing failures: read the connection state, find error codes in the admin center, and apply the fix Microsoft lists for each code range."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [copilot-connectors, copilot, graph]
keypoints:
  - "Start in Microsoft 365 admin center > Copilot > Connectors > Your Connections. Read Connection state and Last sync time before anything else."
  - "A Failed state needs manual intervention. Data indexed before the error stays searchable."
  - "Error codes 1000 to 1026 cover connection, authentication, quota and agent problems. Codes 2001 to 2010 cover item and indexing problems."
  - "The admin center shows a limited error view. The full list comes from the DownloadErrorScript PowerShell script, batch size up to 5,000."
  - "This article covers items that fail to ingest. If items are indexed but Copilot does not use them, that is a different problem."
faq:
  - q: "Where do I see why a connector fails to index?"
    a: "Microsoft Learn says to open the Microsoft 365 admin center, go to Connectors, Your connections, select the connection and open the Error tab. It shows error codes, counts per code and a Download log option. For the full error list, Learn describes the DownloadErrorScript PowerShell script."
  - q: "What does connection state Failed mean?"
    a: "Per Microsoft Learn, Failed means a critical failure needs manual intervention. Data indexed before the error stays searchable, and permanent failures also create notifications under Service health. Act on the error message shown."
  - q: "What do error codes 1002 and 1005 mean?"
    a: "Microsoft Learn lists 1002 as unable to authenticate with the data source and 1005 as expired credentials. For both, select Edit on the connection to update the credentials."
  - q: "Items are rejected with codes 2002 to 2005. What should I do?"
    a: "These codes mean unsupported item formatting, content, size or a URI that is too long. Microsoft Learn gives no generic fix and points to the documentation of the specific connector."
  - q: "How long are items kept if deletion cannot be detected?"
    a: "The manage connection page says that if connection failures prevent delete detection, items not rediscovered during crawls for 28 days are removed from the Microsoft 365 index."
---

Start with the connection itself. In the Microsoft 365 admin center go to **Copilot** > **Connectors** > **Your Connections**, read the **Connection state** and **Last sync time**, then open the error list and match the code against Microsoft's table. Most failures fall into four groups: credentials, quota, the connector agent, or items the index cannot accept. You need the **AI administrator** role to manage Copilot connectors.

This article is about items that fail to ingest. If items are indexed but Copilot does not use them, the cause is elsewhere.

## Step 1: Read the connection state

| State | Meaning | What to do |
|---|---|---|
| Syncing | A crawl is running | Wait. On-demand crawls are disabled while Syncing. |
| Ready | No crawl running | Last sync time shows freshness |
| Paused | An admin paused crawls | Resume on the connector page |
| Failed | A critical failure needs manual intervention | Act on the error message. Earlier data stays searchable. |
| Delete failed | Deletion failed | Data may still be indexed and quota may still be used. Try deleting again. |

For connections built through the Graph API, Learn lists the states **Draft**, **Ready**, **Obsolete** and **LimitExceeded**. In LimitExceeded you cannot add more items until you exit the state. In Obsolete, deleting the connection is the only valid operation.

## Step 2: Open the error list

In the admin center, select the connection and open the **Error** tab. You see error codes, counts per code and **Download log**. That view is limited. For the full list, install the script from an elevated Windows PowerShell:

```powershell
Install-Script -Name DownloadErrorScript
```

Run `DownloadErrorScript.ps1`, then enter the connection ID, an output file name (default `.csv`) and a batch size (maximum 5,000). It authenticates with MSAL.PS.

## Step 3: Match the code

### Connection and source errors (1000 to 1026)

| Code | Meaning | Fix listed by Microsoft |
|---|---|---|
| 1000 | Data source not available | Check the network and that the source was not deleted, moved or renamed |
| 1001 | Data source is throttling the connector | Check if scale limits can be raised, or wait for a quieter time |
| 1002 | Cannot authenticate | Select Edit and update credentials |
| 1003 | Account lacks permission to the item | Make sure the right account has access |
| 1005 | Credentials expired | Select Edit and update credentials |
| 1008 | Tenant quota reached | Delete a connection or reduce ingestion filters, then contact support |
| 1009 | Connection quota reached | Reduce ingestion filters, then contact support |
| 1010 | Quota for non-Entra groups reached (100 K) | Delete a connection or reduce ingestion filters |
| 1015 | Missing ExternalItem.ReadWrite.OwnedBy | Grant it to the Entra app used for agent registration |
| 1016 | Missing Directory.Read.All | Grant it to the Entra app used for registration |
| 1025, 1026 | Connector agent deprecated or critically broken | Upgrade the agent |

Other codes in the range cover an offline agent (1011), unsupported authentication mode (1012), network loss during indexing (1017), missing interactive sign-in rights on the agent computer (1018) and invalid app credentials (1019).

### Indexing and item errors (2001 to 2010)

| Code | Meaning | Fix |
|---|---|---|
| 2001 | Indexing throttled by a large update queue | Wait for the queue to clear |
| 2002 to 2005 | Unsupported formatting, content, size or URI too long | See the connector's own documentation |
| 2006 | User mapping failed | Delete and recreate the connection with a different mapping formula |
| 2007 | Item will not display because some users or groups could not be indexed | None listed |
| 2008 | Non-Entra group with more than 50,000 members | Reduce the group or the items it protects, recreate the connection |
| 2009 | Non-Entra group indexing temporarily paused | Check back later |
| 2010 | Connection invalid after a Microsoft update | Delete it and create a new one |

Code 5000 is a generic error. Contact support if it continues.

## Step 4: Understand crawl behavior

Scheduled crawls are full or incremental. On-demand crawls need Microsoft Graph connector agent version 2.1.0.0 or later. Only one crawl category runs at a time. If a crawl runs past the next scheduled one, the ongoing crawl stops and the scheduled crawl is skipped and queued. Editing a published connection might trigger a full crawl.

To change which items are indexed, delete the connection and create a new one with a data source exclusion filter.

## Step 5: Set up failure alerts

Permanent failures create notifications under **Service health** > **Issues**. A notification stays active for 6 days and moves to Issue history, which keeps it up to 30 days. For email, go to **Service health** > **Customize** > **Email**, select **Issues in your environment that require action** and include the **Microsoft 365 suite** service. You can add up to two addresses.

## What the pages do not cover

The manage-connection page does not describe an item count metric or refresh interval values. The Graph connection page does not describe schema registration status or how item failures are reported in the API. For custom connectors, check the Graph API reference.

## Related

- [Copilot connectors](https://www.m365.fm/entity/copilot-connectors/)
- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft Graph](https://www.m365.fm/entity/graph/)

## Sources

- [Troubleshoot connector error responses](https://learn.microsoft.com/en-us/microsoftsearch/connector-error-responses)
- [Manage your Microsoft 365 Copilot connector](https://learn.microsoft.com/en-us/microsoftsearch/manage-connector)
- [Manage connections for external content in Microsoft Graph](https://learn.microsoft.com/en-us/graph/connecting-external-content-manage-connections)
