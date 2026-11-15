---
title: "Fabric SQL Analytics Endpoint Shows Stale Data: Understand Metadata Sync Delays"
summary: "Why a Fabric SQL analytics endpoint can lag behind its lakehouse: how the background metadata sync works, normal lag, causes of delay, on-demand refresh options and the guidance Learn gives on workspaces, maintenance and file layout."
status: review
publish: false
author: mirko-p
date: 2027-01-07
topics: [fabric-lakehouse, fabric-warehouse]
keypoints:
  - "A background process scans the lakehouse and updates the SQL analytics endpoint. Learn says normal lag is under one minute, ranging from seconds to minutes."
  - "The process runs while the endpoint is active and stops after 15 minutes without query activity."
  - "Delays can come from large ETL change volumes, many lakehouses in one workspace, and many small Parquet files without table maintenance."
  - "You can start an on-demand sync in the Fabric portal or with the Refresh SQL analytics endpoint metadata REST API."
  - "Learn advises separate workspaces for scale, regular table maintenance, adaptive target file size and partitions close to or greater than 1 GB."
faq:
  - q: "How long should the sync take?"
    a: "Microsoft Learn says that under normal operating conditions the lag between a lakehouse and its SQL analytics endpoint is less than one minute. It can vary from a few seconds to minutes depending on several factors."
  - q: "Why is my new table missing?"
    a: "Learn lists this as a possible case: you create a new table in the lakehouse but it is not yet listed in the SQL analytics endpoint. The same applies to a large number of committed rows that are not yet visible."
  - q: "Can I force a refresh?"
    a: "Yes. Learn says you can start an on-demand metadata sync in the Fabric portal or use the Refresh SQL analytics endpoint metadata REST API. The page gives no button location or request details."
  - q: "Does the sync always run?"
    a: "No. The background process runs while the SQL analytics endpoint is active and stops after 15 minutes without query activity."
  - q: "What reduces sync latency?"
    a: "Per Learn: move lakehouses to separate workspaces when there are many, schedule regular table maintenance, use adaptive target file size, avoid high-cardinality partitioning and use partitions close to or greater than 1 GB."
---

When a lakehouse table changes, the SQL analytics endpoint does not update in the same instant. A background process scans for committed changes and applies them. Under normal conditions the lag is less than a minute. Large loads, many lakehouses in one workspace and badly laid-out Parquet files can stretch it. This guide follows the Microsoft Learn page on SQL analytics endpoint performance and metadata sync. That page links to a separate article for manual refresh details, which was not read for this guide.

## How the sync works

- A background process scans the lakehouse for changes and keeps the SQL analytics endpoint up to date for changes committed to lakehouses in a workspace.
- The Fabric platform manages it transparently. When a change is detected, the process updates metadata and the endpoint reflects what was committed to the lakehouse tables.
- The process runs while the endpoint is active and stops after 15 minutes without query activity.
- Automatic metadata discovery is a single instance per Fabric workspace.

## What is normal

Under normal operating conditions the lag is less than one minute. Learn says it can vary from a few seconds to minutes depending on many factors. During ETL with an extremely large volume of table changes, a delay is expected until all changes are processed.

## Typical stale data symptoms

- You create a new table in the lakehouse, but the endpoint does not list it yet.
- You commit a large number of rows to a table, but the data is not yet visible in the endpoint.

## Causes the page names

1. **Large change volumes during ETL.** The sync catches up after processing.
2. **Many lakehouses in one workspace.** Discovery is a single instance per workspace, and Learn says increased latency could be due to a large number of lakehouses in one workspace.
3. **Many small files.** Updates and deletes create file growth. Without scheduled maintenance, Parquet files accumulate, which creates read overhead and slows the sync.
4. **Related limitation: unsupported Delta features.** Learn lists this as a separate point, not as a stated cause of delay: the automatic sync process does not support all Delta features, and the page refers readers to the Delta Lake table format interoperability documentation.

## Force a refresh

Learn says you can start an on-demand metadata sync in the Fabric portal or call the Refresh SQL analytics endpoint metadata REST API. The page does not name the portal control, its location or the request parameters. It also does not say whether an on-demand sync resets the 15-minute inactivity timer.

## Guidance to reduce latency

- **Separate workspaces.** If latency rises and many lakehouses share a workspace, consider moving each lakehouse to its own workspace so automatic discovery can scale.
- **Table maintenance.** Schedule regular lakehouse table maintenance to limit file accumulation.
- **File layout.** On Fabric Spark runtime 2.0 or later, the default Spark settings enable adaptive target file size, and Learn says to avoid static targets or arbitrary row-count limits on top of them. On runtime 1.3, adaptive target file size and file-level compaction targets are opt-in features that you enable. Avoid high-cardinality partitioning. Enable auto compaction where the added synchronous write latency is acceptable, or schedule periodic `OPTIMIZE` jobs where it is not.
- **Partition sizing.** Choose partition columns so partitions are close to or greater than 1 GB. The page includes a sample notebook script that reports partition size and file counts.

## What the page does not say

- The exact sync interval or polling frequency.
- A threshold for what counts as a large workspace or number of lakehouses.
- Throttling or limits on the REST API or on-demand sync.
- REST parameters, authentication or code samples for the refresh call (the only code on the page is the partition-size notebook script).
- Sync behavior for mirrored databases (the page only says they count toward the number of SQL analytics endpoints in a workspace), views, shortcuts or object types other than tables.
- Expected sync time for a given data volume.

## A troubleshooting order

This order is practical advice built on the page.

1. Check whether a large ETL job has just committed. If so, allow time for catch-up.
2. Check whether the endpoint has been idle for more than 15 minutes, then query it and recheck.
3. Start an on-demand sync from the portal or the REST API.
4. Look at table health. Many small files point to missing maintenance.
5. Count lakehouses in the workspace. Consider splitting them if latency keeps growing.
6. Check whether the table uses Delta features the sync does not support.

## Typical mistakes (my advice)

- Assuming a delay of a few minutes is a failure when it is within the documented range.
- Skipping table maintenance and blaming the endpoint.
- Partitioning on a high-cardinality column.
- Putting many busy lakehouses in one workspace.

## Related

- [Fabric Lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)
- [Fabric Warehouse](https://www.m365.fm/entity/fabric-warehouse/)
- [Delta Lake](https://www.m365.fm/entity/delta-lake/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [SQL Analytics Endpoint Performance Considerations (Microsoft Learn)](https://learn.microsoft.com/fabric/data-engineering/sql-analytics-endpoint-performance)
