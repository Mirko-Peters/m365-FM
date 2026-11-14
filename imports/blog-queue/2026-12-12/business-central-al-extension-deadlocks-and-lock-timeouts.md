---
title: "Business Central AL Extensions: Find and Fix SQL Deadlocks, Lock Timeouts and Slow Code"
summary: "Use Business Central telemetry events RT0012, RT0013 and RT0028 to locate deadlocks and lock timeouts in AL extensions, then apply Microsoft's AL guidance on locking, transactions, set-based reads and background work."
status: review
publish: false
author: mirko-p
date: 2026-12-12
topics: [dynamics-365-business-central, business-central-extensions, azure-monitor]
keypoints:
  - "RT0012 records a database lock timeout victim, RT0013 holds the lock snapshot, and RT0028 records a database deadlock."
  - "RT0012 shows the victim session and its AL stack, not the sessions holding the locks, so join it with RT0013 by snapshotId."
  - "Microsoft's AL guidance includes deferring Record.LockTable as late as possible, keeping transactions short and never writing in OnAfterGetRecord."
  - "Do not insert child records of the same parent in parallel, because it causes locks on the parent and Integration Record tables."
  - "Use DataAccessIntent ReadOnly for reports, API pages and queries, and move slow work to background tasks or job queues."
faq:
  - q: "Which telemetry event shows a deadlock in Business Central?"
    a: "Microsoft Learn names event RT0028, Database deadlock occurred. It identifies the deadlock victim, including alObjectName, alStackTrace, sqlStatement and extension details. On premises, the EnableDeadlockMonitoring server setting turns collection on."
  - q: "Why does RT0012 not show who blocked me?"
    a: "Per Microsoft Learn, RT0012 is the victim session of a lock timeout. The blocking sessions appear in RT0013 snapshot entries that share the same snapshotId, and the snapshot may not capture the holding locks."
  - q: "Why is LockTable a performance risk?"
    a: "Microsoft Learn says Record.LockTable applies the WITH (updlock) hint on all subsequent reads of the table until the transaction commits. It recommends calling it as late as possible so that only the data in scope for the update is locked."
  - q: "Do table events affect locking and performance?"
    a: "Microsoft Learn says table event subscribers force row-by-row SQL, which affects ModifyAll and DeleteAll that normally do bulk operations. Uninstalling the test framework before measuring insert and update performance is advised, because its presence forces row-by-row operations."
---

A deadlock or lock timeout in Business Central comes from two or more transactions competing for the same database resources. The way to fix it is to find the exact AL object and SQL statement through telemetry, then shorten or reorder the locking work in the code. The steps below follow Microsoft Learn's AL performance article and its telemetry pages.

## Know the symptoms

A lock timeout shows users the message that the operation could not complete because a record in a table was locked by another user, with a request to retry. A deadlock is different: two or more processes block each other, because each holds a resource the other needs. The system ends and rolls back one session, the deadlock victim.

## Step 1: Turn on the telemetry

Send telemetry to Application Insights. On premises, Microsoft names these server settings: `EnableLockTimeoutMonitoring` for lock timeout telemetry, which is off by default, and `EnableDeadlockMonitoring` for deadlock telemetry.

## Step 2: Read the events

| Event | ID | Meaning |
|---|---|---|
| Database lock timed out | RT0012 | The victim session and its AL code |
| Database lock snapshot | RT0013 | SQL locks held at the time of the timeout |
| Snapshot parent | RT0027 | Groups RT0013 entries (2024 release wave 2 and later) |
| Database deadlock occurred | RT0028 | The deadlock victim |

RT0012 dimensions include `alObjectName`, `alObjectType`, `alStackTrace`, `extensionName`, `sessionId`, `sqlServerSessionId` and `snapshotId`. RT0013 adds `sqlTableName`, `sqlLockRequestMode`, `sqlLockRequestStatus` and `sqlLockResourceType`. The `sqlLockRequestStatus` values are `GRANT` for an active lock, `WAIT` for a lock blocked by a conflicting lock, and `CNVRT` for a lock converting while blocked.

Microsoft states RT0012 is the victim and does not show who holds the locks. To find the blockers, join RT0012 and RT0013 on `snapshotId`. Microsoft points to a `LockTimeouts.kql` sample in its BCTech repository for this and notes that you might be lucky that the snapshot captured the locks that were held, so it may not show the holder.

A starting query for deadlocks, written for illustration and not taken from Microsoft, groups the victims:

```kusto
traces
| where customDimensions.eventId == "RT0028"
| summarize Deadlocks = count() by
    alObjectName = tostring(customDimensions.alObjectName),
    extensionName = tostring(customDimensions.extensionName),
    sqlStatement = tostring(customDimensions.sqlStatement)
| order by Deadlocks desc
```

Learn's deadlock page gives no step list. It names two complements: SQL deadlock monitoring on a sandbox or on-premises environment, and the database lock trace telemetry. Grouping victims by object and statement, tracing the code through `alStackTrace` and correlating with lock timeouts is my own approach. Learn adds that in some deadlocks the victim and the winner swap by chance, and then both are stored as separate events.

## Step 3: Apply Microsoft's locking guidance

From the AL performance article:

- **Defer `Record.LockTable`.** It applies `WITH (updlock)` to all later reads of that table until commit, so call it as late as possible.
- **Enable tri-state locking** to avoid reads-after-writes taking locks.
- **Read setup data before starting write transactions.**
- **Limit how long you hold locks**, and limit transaction size by dividing work into smaller operations that can be committed.
- **Index the ranges you update.**
- **Do not write in `OnAfterGetRecord`.** With more than one user, it causes locking issues and deadlock errors.
- **Do not insert child records of the same parent in parallel** (the page lists this under web service calls). It locks the parent and Integration Record tables. Wait for the first call to finish, or use OData `$batch`.
- **Use a number sequence object** if you do not want a number series and can accept gaps.
- Logical separation across companies makes locking much less of an issue.

Pay attention to table events. Microsoft says subscribers force the server to issue SQL updates or deletes row by row, instead of bulk statements, which affects `ModifyAll` and `DeleteAll`.

Microsoft's pages do not give a recipe for a consistent lock order across code paths. As general practice, if two processes touch the same tables, keep the sequence the same in both, and verify with the telemetry that the deadlock count falls.

## Step 4: Cut the SQL load

The same article lists set-based operations such as `FindSet`, `CalcFields`, `CalcSums` and `SetAutoCalcFields`, which are faster than looping, and advises deferring `CalcFields` calls until the end in the `OnAfterGetRecord` trigger. It recommends partial records to load fewer fields and to avoid joining unneeded table extensions (since 2023 release wave 2 the page says at most one companion-table join is involved), SIFT indexes for sum and count FlowFields, and caching expensive results in a table refreshed by a background job. Query objects are not cached in the server's primary key cache, so they always go to the database.

For reads that compete with write workloads, set `DataAccessIntent = ReadOnly` on reports, API pages and queries, so they run on a read-only replica. Microsoft suggests API queries with this setting for OData consumers such as Power BI.

## Step 5: Move work out of the user's session

Microsoft compares four mechanisms:

| Mechanism | Traits |
|---|---|
| Page background task | Read-only, bound to a page and its parent session, can (will) be canceled, lightweight |
| `Session.StartSession` | Created immediately, runs on the same server as the starting session, runs as a background session, less controlled than a page background task |
| Task scheduler | Queued, any server in a cluster can start it, background session, survives server restarts, no logging in Business Central |
| Job queue | Scheduled with recurrence, any server in a cluster can start it, survives server restarts, results logged in Business Central |

Background work does not make code faster, but users do not wait (Learn makes this point for reports).

## Step 6: Measure again

Use the Performance Profiler for a slow scenario and the AL debugger's database statistics to see how AL maps to SQL. The Performance Toolkit supports regression testing. The Database Locks page shows a snapshot of current SQL locks. My own advice: after each change, compare RT0012 and RT0028 counts over the same period. For outgoing HTTP calls, Microsoft notes RT0019 shows that the server blocks the session until the call completes.

## Related

- [Dynamics 365 Business Central](https://www.m365.fm/entity/dynamics-365-business-central/)
- [Business Central extensions](https://www.m365.fm/entity/business-central-extensions/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Microsoft Learn: Performance articles for developers](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/performance/performance-developer)
- [Microsoft Learn: Analyzing database lock timeout trace telemetry](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/administration/telemetry-database-locks-trace)
- [Microsoft Learn: Analyzing database deadlock telemetry](https://learn.microsoft.com/en-us/dynamics365/business-central/dev-itpro/administration/telemetry-database-deadlocks-trace)
