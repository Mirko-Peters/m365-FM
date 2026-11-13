---
title: "Delete a Failed Copilot Connector When the Admin Center Panel Is Blank"
summary: "A Microsoft 365 Copilot (Graph) connector switched to Failed and its details panel stays empty, so you cannot delete it? Retry in the admin center, then remove it with Microsoft Graph PowerShell or a REST call."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot-connectors, microsoft-graph-powershell, microsoft-365-admin-center, microsoft-graph-permissions]
keypoints:
  - "Microsoft Learn says a Failed connection had a critical failure that needs manual intervention, and that you can permanently delete connections in the admin center. Learn does not describe the blank panel."
  - "In a 2025 Q&A thread the details panel of a Failed connector never loaded. The asker reported that the Graph DELETE call on /external/connections/{id} deleted it."
  - "Learn documents Get-MgExternalConnection and Remove-MgExternalConnection, and the DELETE method needs ExternalConnection.ReadWrite.OwnedBy or ExternalConnection.ReadWrite.All."
  - "Deleting removes all items indexed through the connection. Find the cause of the failure before you rebuild, for example with the connector error codes."
faq:
  - q: "Can I delete a connector that is in the Failed state?"
    a: "Learn's admin center page says you can permanently delete connections of Microsoft and partner connectors, and Learn's state table for the Microsoft Graph connectors API allows deleting in every state it lists (Draft, Ready, Obsolete, LimitExceeded). That table does not list the admin center state Failed, so Learn does not explicitly confirm this case. In the community thread, the admin center panel did not load, so the asker used the Graph API instead and reported that it worked."
  - q: "What happens to the indexed items when I delete the connection?"
    a: "Learn says that deleting a connection removes all items that were indexed through it. Items that were indexed before a failure stay searchable while the connection exists, according to the admin center documentation, so plan for users to lose those results after the delete."
  - q: "Which permission does the delete call need?"
    a: "Learn lists ExternalConnection.ReadWrite.OwnedBy as the least privileged permission and ExternalConnection.ReadWrite.All as the higher privileged one, for both delegated and application access. Learn also says you can manage connections that you created or were authorized to manage. It does not say how this applies to a connection created in the admin center, so if the call is denied, check the permission and your role."
  - q: "Is the blank panel a known bug?"
    a: "A Microsoft staff member called it a known UI bug in the thread, but gave no source, and we found no Learn page that describes it. Treat it as reported, not confirmed."
---

A Copilot connector was created in the Microsoft 365 admin center. It showed **Ready**, indexing looked normal, and all validations had passed. Some time later the state changed to **Failed**. When the administrator opened the connection, the **Details** panel stayed blank, including the Delete button.

Learn now calls the feature Microsoft 365 Copilot connectors (earlier Microsoft Graph connectors), and the admin center menu names differ between Learn pages (see Step 2). This is a scenario from a July 2025 Microsoft Q&A thread. The article explains the way out that worked there and checks every step against Microsoft Learn. It is not an official Microsoft procedure. Before you delete anything, read the warning in the section "What deleting does".

## What the thread reported

- The asker built a connector for an Azure SQL source. The state moved from Ready to Failed, and the details pane never loaded.
- A Microsoft staff member (labelled Microsoft External Staff) replied with an answer that the asker accepted. It called the blank panel a known UI bug (without a source) and gave three ways to delete the connection: Microsoft Graph PowerShell, a REST call, and "alternative admin UIs".
- The asker then wrote that the REST DELETE call worked and removed the connector.
- The root cause of the Failed state was not confirmed. The asker suspected resource limits on the test SQL server, which is a guess.

The staff member's list of alternative portals was not checked in the thread, and we found no Learn page for it, so we leave it out.

## Step 1: Understand the state

Learn's page on managing connectors describes the states you see in the **Connection state** column:

- **Failed**: the connection had a critical failure. The error requires manual intervention. Data indexed before the error remains searchable.
- **Delete failed**: the deletion of the connection failed. Learn recommends trying to delete it again.
- **Paused**, **Syncing** and **Ready** are normal states.

The page says that you must be an AI administrator to access and manage Copilot connectors.

## Step 2: Try the admin center once more

In the Microsoft 365 admin center, Learn names the page **Copilot**, then **Connectors**, then **Your Connections**. The Microsoft Graph connections article calls the area **Copilot**, then **Agents and connectors**. The menu names differ between Learn pages, so look for the connections list in the Copilot section.

If the connection opens, delete it there. Learn says you can permanently delete one or more connections, for Microsoft and partner connectors alike. If the state shows **Delete failed**, try again.

If the panel stays blank, as in the thread, move on to the next step.

## Step 3: Get the connection ID

You need the ID that the connector was created with. Learn documents the PowerShell cmdlet `Get-MgExternalConnection`, which reads external connections, and the Microsoft staff member in the thread used it for this purpose.

```powershell
Install-Module Microsoft.Graph -Scope CurrentUser
Connect-MgGraph -Scopes "ExternalConnection.ReadWrite.OwnedBy"
Get-MgExternalConnection
```

The `Install-Module` and `Connect-MgGraph` lines come from the thread's answer. The cmdlet reference on Learn shows `Get-MgExternalConnection` without any sign-in note, and lists the permissions that can be used. Look for your connection by its name and state in the output, and copy its ID.

## Step 4: Delete the connection

Learn's reference for `Remove-MgExternalConnection` shows this usage:

```powershell
Remove-MgExternalConnection -ExternalConnectionId $externalConnectionId
```

The underlying Graph call is documented as:

```http
DELETE https://graph.microsoft.com/v1.0/external/connections/{connection-id}
```

Learn says to send no request body, and a successful call returns **202 Accepted** with nothing in the response body. In the thread, the asker used the REST call and reported that it deleted the connector. Whether the asker used PowerShell first is not stated.

### Permissions

Learn lists the same permissions for delegated work or school accounts and for applications:

- Least privileged: `ExternalConnection.ReadWrite.OwnedBy`
- Higher privileged: `ExternalConnection.ReadWrite.All`

The Graph connections article adds that you can only view and manage connections that you created or were explicitly authorized to manage, and that a search admin can view and manage all connections in the tenant through the admin center. Learn does not say how the `OwnedBy` scope treats a connection that was created in the admin center. If the call is denied, check the scope you consented to, and whether the higher privileged permission fits your policy. Do not add permissions without approval from the owner of your tenant security.

You can also send the REST call from Graph Explorer or another tool, with a valid token that includes one of these permissions.

## Step 5: Confirm that it is gone

Learn does not say how long a delete takes to complete. After the **202 Accepted** response:

1. Run `Get-MgExternalConnection` again and check that the connection is no longer listed.
2. Open the connections list in the admin center and refresh it.
3. If the connection shows **Delete failed**, repeat the delete, as Learn recommends.

If it stays in a failed delete state after several tries, collect the connection ID, the tenant ID, and the time of your attempts and open a support case. The Microsoft staff member in the thread suggested this too.

## What deleting does

Learn says that deleting a connection removes all items that were indexed through it. Users lose those results in Microsoft Search and in Copilot when the delete finishes. A connection that was only Failed would still serve the older items.

Also check what depends on the connection. Learn's overview says that connectors serve as knowledge sources for custom agents built in Copilot Studio or the Microsoft 365 Agents Toolkit. An agent that uses the deleted connection will lose that source, so list the agents and the people who rely on the data before you start. If other people need the data, tell them first and plan the new connection with a short, staged rollout so that you can validate it with a few users.

## Find the cause before you rebuild

The thread did not confirm why the connector failed. Before you create the connection again, look for the cause. Use these Learn-based pointers:

- The connector error page says to open **Connectors**, **Your connections**, select the connection and open the **Error** tab. It lists error codes with their number of occurrences, and you can download a log. The codes include 1000 (data source not available), 1002 and 1005 (authentication failed or credentials expired), 1008 to 1010 (quota reached), and 2010 (connection invalidated by a Microsoft update, so delete it and create a new one).
- For the full list, the same page describes a script, `DownloadErrorScript`, that takes the connection ID. You need the ID before you delete the connection, so save it first.
- The Learn FAQ recommends test users for ACL testing and the index browser to verify that items were indexed.

In the thread, the staff member's generic checklist covered the connection string, firewall rules, query timeouts and database limits. Those are reported ideas and not confirmed for this case. The asker planned to start again with a smaller set of data.

## Limits of this guide

- One thread with one confirmed outcome: the REST delete worked for one person.
- The "known UI bug" claim is not backed by a Learn page.
- The PowerShell lines were not shown to work in the thread. They match the Learn cmdlet reference.

## Related

- [Copilot connectors](https://www.m365.fm/entity/copilot-connectors/)
- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Graph permissions](https://www.m365.fm/entity/microsoft-graph-permissions/)

## Sources

- [Microsoft Learn: Manage Copilot connectors](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/manage-connector)
- [Microsoft Learn: Manage connections (Microsoft Graph connectors API)](https://learn.microsoft.com/en-us/graph/connecting-external-content-manage-connections)
- [Microsoft Learn: Delete externalConnection](https://learn.microsoft.com/en-us/graph/api/externalconnectors-externalconnection-delete?view=graph-rest-1.0)
- [Microsoft Learn: Remove-MgExternalConnection](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.search/remove-mgexternalconnection?view=graph-powershell-1.0)
- [Microsoft Learn: Get-MgExternalConnection](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.search/get-mgexternalconnection?view=graph-powershell-1.0)
- [Microsoft Learn: Monitor connector errors](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/error-responses)
- [Microsoft Learn: Copilot connectors overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/overview)
- [Microsoft Learn: Copilot connectors FAQ](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/frequently-asked-questions)
- [Microsoft Q&A: Unable to open a previously created Search & Intelligence Data Source (July 2025)](https://learn.microsoft.com/en-us/answers/questions/4375567/unable-to-open-a-previously-created-search-intelli)
