---
title: "How to Use Copy Job in Fabric Data Factory for Incremental Data Movement"
summary: "Create and run a Copy job in Microsoft Fabric Data Factory: full vs incremental copy, watermark vs CDC, update methods, creation steps for databases and files, and documented caveats such as deletes and resets."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [fabric-copy-job, fabric-data-factory]
keypoints:
  - "Copy job moves data from many sources to many destinations without pipelines and supports full copy, incremental copy and change data capture."
  - "Watermark-based incremental copy tracks inserts and updates only. CDC-based copy also replicates deletes and supports SCD Type 2, but needs CDC enabled on the source."
  - "Update methods are Append (default), Merge by key, Overwrite and SCD Type 2."
  - "Changing settings such as the incremental column resets incremental copy to an initial full load on the next run."
  - "The pages read give no limits or quotas and no full connector list. Learn links to the supported connectors page."
faq:
  - q: "What is a Copy job?"
    a: "Per Microsoft Learn, it is the recommended way to move data from many sources to many destinations in Fabric Data Factory without pipelines. It supports bulk copy, incremental copy and change data capture replication."
  - q: "What is the difference between watermark and CDC?"
    a: "Watermark-based copy uses a column such as ROWVERSION, datetime, date or integer and tracks inserts and updates only. CDC-based copy needs CDC enabled on the source, replicates inserts, updates and deletes, and supports SCD Type 2."
  - q: "What happens on the first incremental run?"
    a: "The first run copies everything. Later runs move only new or changed data. A failed job resumes from the end of the last successful run."
  - q: "Do manual runs copy everything?"
    a: "No. Learn says a manual run of an incremental job still moves only the changes since the last run."
  - q: "How do I force a full load of one table?"
    a: "In incremental mode, select Read all data every run from the Incremental column drop-down for that table. You can also reset incremental copy to full copy for the whole job or per table."
---

A Copy job copies data between stores without a pipeline. You pick a source, a destination and a copy mode, and Fabric tracks what moved. For incremental movement, choose an incremental column (watermark) or use change data capture if the source supports it. This guide follows two Microsoft Learn pages: the Copy job overview and the article on creating a Copy job.

## What Copy job supports

- **Full copy:** copies all source data on every run.
- **Incremental copy:** the first run copies everything. Later runs move only new or changed data.
- **Failure handling:** a failed job resumes from the end of the last successful run.
- **Update methods:** Append (default), Merge by key, Overwrite and SCD Type 2. Merge and SCD Type 2 use the primary key by default if one exists. For storage destinations, new data is saved as new files, and a file with the same name is replaced.
- **Table handling:** can create destination tables, map columns and optionally truncate the destination before a full load.
- **Database queries:** copy subsets, such as one region or the top N rows.
- **Audit columns:** can add metadata such as extraction time, source file path and job and run IDs.
- **Hosting:** supports on-premises data gateways and virtual network data gateways.
- **Operations:** source control, CI/CD and Variable library support.

## Watermark or CDC

| Aspect | Watermark-based | CDC-based |
| --- | --- | --- |
| Needs | A reliable incremental column | CDC enabled on the source |
| Column types | ROWVERSION, datetime, date, string interpreted as datetime, or integer | Not applicable |
| Inserts and updates | Yes | Yes |
| Deletes | No | Yes |
| SCD Type 2 | Not stated | Supported |

Learn says to use CDC when the source supports it and you need deletes, SCD Type 2 or lower scan load. Use watermark when CDC is unavailable and the table has a reliable incremental column.

## Create a Copy job: database source

1. Create or choose a workspace.
2. Select **+ New Item**, choose **Copy job**, name it and select **Create**.
3. Choose the data source, for example **Azure SQL Database**.
4. Enter the connection: server path and credentials. For virtual network scenarios you can use an on-premises or virtual network gateway.
5. Select tables and columns, or select **+ New query** under Queries.
6. Select the destination store.
7. Optionally choose the update method. For **Merge**, select the **Key columns**.
8. Optionally configure mapping. For timestamps without time zone information going into a Fabric Lakehouse, Learn says to map to `timestamp_ntz`.
9. Choose **Full data copy** or **Incremental copy**. For incremental copy, choose an **Incremental column** per table. Use the preview button to find the right column.
10. Review the summary, choose run once or a schedule, and select **Save + Run**.
11. Monitor status, row counts and copy duration per table in the inline monitoring panel.

## Create a Copy job: file storage source

1. Create or choose a workspace, then **+ New Item** > **Copy job**.
2. Choose the data store, for example **Azure Data Lake Storage Gen2**, and enter the storage URL and credentials.
3. Select folders or files. **Schema agnostic (binary copy)** is a faster option that copies files without parsing the schema.
4. Select the destination, for example **Lakehouse**, and the folder path. Choose **Preserve Hierarchy** or **Flatten Hierarchy**.
5. Choose **Full data copy** or **Incremental copy**. Incremental copies all files on the first run, then only new or updated files.
6. Review and select **Save + Run**.

## Caveats from Learn

- **Deletes:** only CDC-based incremental copy replicates deletes. Row deletions cannot otherwise be captured.
- **Resets:** changing settings such as the incremental column resets incremental copy to an initial full load on the next run.
- **Manual runs:** **Run** copies only data changed since the last run, even on a schedule.
- **Truncate:** enabling it truncates the destination on the first incremental run. If you later reset to full copy, enabling it again clears the destination before loading. No data is deleted from the destination unless you enable truncation or use Merge or Overwrite.
- **Type conversion:** supported only for tabular data.
- **Empty files:** when copying files to storage and no data loads from the source, empty files are created at the destination.
- **Preview features:** auto-partitioning (Preview) and SQL database in Fabric (Preview).
- **Change data feed:** for Lakehouse tables the job creates, you can enable CDF with Enable CDF on destination in Write settings.

## What the pages do not say

No limits, quotas or throughput figures. No full list of sources and destinations, only a link to the supported connectors page. No detailed comparison with copy activity in pipelines, only a pointer to a data movement strategy guide. No licensing, capacity or role details. No schedule configuration details.

## A setup checklist

The checklist is practical advice.

1. Check the supported connectors page for your source and destination.
2. Decide whether you need deletes. If yes, check that CDC is available.
3. Pick an incremental column with a reliable, increasing value.
4. Test with Append, then switch to Merge if you need updates.
5. Leave truncation off unless you intend to clear the destination.
6. Remember that edits to the incremental column trigger a full reload.

## Typical mistakes

- Expecting watermark copy to remove deleted rows from the destination.
- Choosing a column that is not reliably updated.
- Changing the incremental column and being surprised by a full load.
- Enabling truncate without noticing the effect on the next full load.

## Related

- [Fabric Copy job](https://www.m365.fm/entity/fabric-copy-job/)
- [Fabric Data Factory](https://www.m365.fm/entity/fabric-data-factory/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [What is Copy job in Data Factory for Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/data-factory/what-is-copy-job)
- [Create a Copy job in Data Factory (Microsoft Learn)](https://learn.microsoft.com/fabric/data-factory/create-copy-job)
