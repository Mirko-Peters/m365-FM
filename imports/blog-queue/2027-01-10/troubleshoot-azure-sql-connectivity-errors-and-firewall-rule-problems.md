---
title: "Troubleshoot Azure SQL Connectivity Errors and Firewall Rule Problems"
summary: "Handle transient Azure SQL connection errors with retry logic and check firewall rules and port 1433, with the documented retry timings, SqlConnection settings, test tools and logs, and a clear list of what the Learn page does not explain."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [azure-sql-database]
keypoints:
  - "Transient errors resolve themselves soon. Most reconfiguration events finish in under 60 seconds. Wait about 5 seconds before the first retry, then grow the delay exponentially up to 60 seconds."
  - "After a transient error during a query, do not retry the command directly. Establish a fresh connection and then retry the command."
  - "To fix a blocked client IP, add a firewall rule: SQL servers > your server > Settings > Firewall > Add Client IP, then Save. Usually only outbound port 1433 must be open."
  - "Test tools named: SSMS, sqlcmd, portqry on Windows and netstat or nmap on Linux, plus sys.event_log and sys.database_connection_stats run against master."
  - "The page gives no meaning for most error numbers, nothing on error 40615 and no explanation of server-level versus database-level firewall rules."
faq:
  - q: "What is a transient error?"
    a: "A transient error has an underlying cause that soon resolves itself. Microsoft Learn says most reconfiguration events finish in less than 60 seconds."
  - q: "How should I retry?"
    a: "Wait about 5 seconds before the first retry. Let each later delay grow exponentially up to a maximum of 60 seconds, and set a maximum number of retries. For a failed query, establish a fresh connection before you retry the command."
  - q: "How do I allow my client IP?"
    a: "In the portal select All services > SQL servers > your server > Settings > Firewall > Add Client IP, name the rule, enter the low and high IP values and select Save."
  - q: "Which port must be open?"
    a: "Usually only outbound port 1433. For Azure VMs the page refers to a separate article on ports beyond 1433 for ADO.NET 4.5."
  - q: "How can I look at connectivity events?"
    a: "Run queries against the master database on sys.event_log filtered by event_category connectivity for the last 2 hours, and sys.database_connection_stats for the last 24 hours."
---

Two common causes of Azure SQL connection failures are short-lived faults that a retry can fix and a client IP that the firewall does not allow. This guide follows the Microsoft Learn page Working with Transient Errors. The page applies to Azure SQL Database, Azure SQL Managed Instance, Azure Synapse Analytics and SQL database in Fabric. It focuses on transient faults and retry logic and is not a full error code reference.

## Transient faults

A transient error has an underlying cause that soon resolves itself. Most reconfiguration events finish in less than 60 seconds.

- **During a connection attempt:** after a delay of several seconds, retry the connection.
- **During a query:** do not retry the command immediately. After a delay, establish a fresh connection, then retry the command.
- A failed SELECT needs a fresh connection before the retry. For a failed UPDATE the retry logic must ensure that the entire transaction either finished or was rolled back.

## Retry timing

- Wait 5 seconds before the first retry.
- Let each later delay grow exponentially, up to 60 seconds.
- Set a maximum number of retries before the program stops.
- Do not flood the system. A UI program should not retry every few seconds.

## SqlConnection settings in .NET

| Parameter | Default | Range |
| --- | --- | --- |
| ConnectRetryCount | 1 | 0 to 255 |
| ConnectRetryInterval | 10 seconds | 1 to 60 |
| Connection Timeout | 15 seconds | 0 to 2147483647 |

For an open connection, Connection Timeout should be at least ConnectRetryCount times ConnectRetryInterval. For an idle connection, Command Timeout should be larger than (ConnectRetryCount minus 1) times ConnectRetryInterval. Retries stack: an application retry of 4 with ConnectRetryCount 3 gives 12 retries. For new development the page recommends Microsoft.Data.SqlClient, which supports configurable retry logic.

## Error numbers on the page

The page lists numbers that its sample code treats as transient, including 40613, 40197, 40540, 40143, 10928, 10929, 10053, 10054, 10060, 233 and 64. It gives no meaning or action for most of them. It states only these:

- **40501:** the service is busy, retry after 10 seconds. This appears in a legacy source code comment.
- **20:** the SQL Server instance does not support encryption.
- **11001:** no such host is known, used in a network-disconnect test.
- **18456:** login failed, used in a misspelled-username test.

The list comes from the Enterprise Library 6 source code, and the page notes that Microsoft has no plans for further feature or maintenance updates to it. My inference: the list may therefore be outdated. Error 49918 and error 40615 are not on the page.

## Firewall rules

If the client IP is not allowed, the page says your program fails with a message that states the needed IP address. To add a rule in the portal:

1. Select **All services** > **SQL servers** and your server.
2. Select **Settings** > **Firewall** > **Add Client IP**.
3. Name the rule, enter the low and high IP values and select **Save**.

Usually only outbound port 1433 needs to be open. The page does not explain server-level versus database-level firewall rules. It links to a separate article.

## Test the connection

- SQL Server Management Studio and sqlcmd. After connecting, run a short SELECT.
- Windows: `portqry.exe -n <server>.database.windows.net -p tcp -e 1433` should report the port as LISTENING.
- Linux: netstat or nmap.

## Logs

Run these against the master database:

- `sys.event_log` filtered by event_category connectivity, for the last 2 hours.
- `sys.database_connection_stats`, for the last 24 hours.
- `sys.fn_xe_telemetry_blob_target_read_file`, excluding login events.

Log all errors in your application so you can correlate them with the server logs.

## What the page does not say

- The meaning and recommended action for most error numbers.
- Error 40615 and 49918.
- The difference between server-level and database-level firewall rules.
- A full error reference. The page links no error list.

## A troubleshooting order

This order is my advice, built on the page.

1. Note the exact error number and message.
2. If it looks transient, retry with a fresh connection and the documented delays.
3. If the message names an IP address, add a firewall rule.
4. Check port 1433 from the client.
5. Query the connectivity logs on master.

## Typical mistakes (my advice)

- Retrying a failed command on the same connection.
- Retrying every few seconds without a maximum.
- Stacking application retries on top of connection retries.
- Using the error list from the page as a complete reference.

## Related

- [Azure SQL Database](https://www.m365.fm/entity/azure-sql-database/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Working with Transient Errors (Microsoft Learn)](https://learn.microsoft.com/azure/azure-sql/database/troubleshoot-common-connectivity-issues)
