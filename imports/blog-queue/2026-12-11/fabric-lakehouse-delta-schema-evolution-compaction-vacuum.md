---
title: "Fabric Lakehouse Delta Tables: Schema Evolution, Compaction and VACUUM Explained"
summary: "How to change a Delta table schema in a Fabric lakehouse safely, then keep files healthy with OPTIMIZE, auto compaction and VACUUM. Options, defaults and risks as Microsoft documents them."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [fabric-lakehouse, delta-lake, delta-lake-compaction, fabric]
keypoints:
  - "Delta rejects writes that do not match the table schema. Schema evolution is an opt-in: mergeSchema adds columns, overwriteSchema replaces the whole schema."
  - "mergeSchema never drops columns and never changes types. Rename and drop need column mapping enabled first with delta.columnMapping.mode = name."
  - "OPTIMIZE compacts small files. In the lakehouse UI use Tables > Maintenance. Apply V-order is a checkbox that appears when the compaction option is on, and VACUUM is its own option."
  - "VACUUM keeps seven days by default. Portal and API requests below seven days fail unless the retentionDurationCheck is disabled in Spark properties."
  - "Check SQL analytics endpoint, Direct Lake models and notebooks before you change a production schema."
faq:
  - q: "What is the difference between mergeSchema and overwriteSchema in Fabric?"
    a: "According to Microsoft Learn, mergeSchema adds columns that exist in the incoming data but not in the table, and it does not remove columns or change types. overwriteSchema replaces the table schema with the incoming DataFrame schema, which the page describes as destructive to the schema contract."
  - q: "How do I rename or drop a column in a Fabric Delta table?"
    a: "Microsoft Learn says to enable column mapping before you need it, with ALTER TABLE ... SET TBLPROPERTIES ('delta.columnMapping.mode' = 'name'). After that, RENAME COLUMN and DROP COLUMN work without rewriting all data files."
  - q: "What is the default VACUUM retention in a Fabric lakehouse?"
    a: "The Learn page on lakehouse table maintenance gives a default retention threshold of seven days. Portal and API maintenance requests with a shorter interval fail by default, and the page warns that shorter intervals can reduce time-travel history and affect concurrent readers or writers."
  - q: "Should I turn on auto compaction for every table?"
    a: "Microsoft's file size tuning page recommends auto compaction for streaming or micro-batch ingestion. It adds latency to the write that triggers it, so for other write patterns use it selectively and only if your service levels tolerate occasional write latency spikes."
  - q: "Does the Learn schema evolution page explain the effect on the SQL analytics endpoint?"
    a: "No. The page lists the SQL analytics endpoint, Power BI Direct Lake models, notebooks and Spark jobs as consumers that schema changes can affect, but it does not describe endpoint-specific behavior. Review those dependencies before changing production schemas."
---

To evolve a Delta table schema in a Fabric lakehouse, opt in explicitly. Use `mergeSchema` to add columns, `ALTER TABLE` for deliberate changes, and column mapping before renames or drops. To keep the files healthy, run OPTIMIZE for compaction and VACUUM to remove unreferenced files, either from the table's Maintenance dialog or from Spark. This article covers both jobs in the order Microsoft's pages describe them.

## How schema changes work in Delta

Delta Lake enforces the schema on write. If incoming data does not match the target table, Delta rejects the write instead of changing the table silently. Schema evolution is the controlled, opt-in exception.

| Option | What it does | Limits |
|---|---|---|
| `mergeSchema` write option | Adds columns that exist in the source but not in the target | Does not remove columns, does not change column types |
| `overwriteSchema` write option | Replaces the table schema with the incoming schema | Can break downstream consumers that expect the old schema |
| `spark.databricks.delta.schema.autoMerge.enabled` | Session setting that lets writes and merges add new source columns | Applies to the session, so later operations are affected too |
| `ALTER TABLE` | Explicit add column, change type, change comment | Type changes can affect results and model refresh |
| Column mapping | Enables rename and drop without rewriting all data files | Must be enabled before you need it |

### Add columns with mergeSchema

```python
df.write \
  .format("delta") \
  .option("mergeSchema", "true") \
  .mode("append") \
  .saveAsTable("sales")
```

For upserts, Learn shows `MERGE WITH SCHEMA EVOLUTION INTO`. New source columns are added to the target. You can use the session setting instead of the clause.

### Replace a schema with overwriteSchema

Use `overwriteSchema` together with `mode("overwrite")` only when you really want a new contract. Microsoft calls it more disruptive than `mergeSchema`, because consumers of the old schema can break.

### Rename and drop columns

Enable column mapping first:

```sql
ALTER TABLE sales SET TBLPROPERTIES ('delta.columnMapping.mode' = 'name')
ALTER TABLE sales RENAME COLUMN old_name TO new_name
ALTER TABLE sales DROP COLUMN obsolete_column
```

Column mapping tracks columns by name in table metadata. Learn says this enables rename and drop without rewriting all existing data files.

### Widen a type

Type widening needs Fabric Spark Runtime 1.3 (Delta Lake 3.2) or later. Enable it with `ALTER TABLE sales SET TBLPROPERTIES ('delta.enableTypeWidening' = 'true')`, then run `ALTER TABLE sales ALTER COLUMN order_id TYPE BIGINT`. Learn warns that clients on older Delta versions cannot read or write the table after you enable it. Changes from integer types to decimal or double must be applied manually with `ALTER TABLE`, not through schema evolution. Learn's example alters `order_id` to BIGINT without stating the source type, but its table of supported changes lists int to long only for Runtime 2.0+ (Delta Lake 4.1). For Runtime 1.3 it lists byte to short or int, short to int, float to double and decimal with greater precision and scale.

## Check consumers before you change production

The schema evolution page lists the SQL analytics endpoint, Power BI Direct Lake models, notebooks and Spark jobs as affected consumers. New columns appear as fields but reports and semantic models do not use them automatically. Renames and drops can break queries and reports. The page does not describe SQL analytics endpoint behavior in detail, so test there before you roll out.

## Run compaction

Delta tables fragment over time. Learn explains that fragmentation adds file-operation overhead, reduces compression efficiency and can limit reader parallelism. Compaction rewrites many small files into fewer right-sized files.

### From the lakehouse UI

1. Open the lakehouse.
2. In **Lakehouse explorer**, under **Tables**, right-click the table or use the ellipsis.
3. Select **Maintenance** to open **Run maintenance commands**.
4. Turn on the option that compacts small Parquet files. The page describes it as an **On** option, so check the exact label in your dialog. The **Apply V-order** checkbox can be selected only when that option is on.
5. Turn on the **VACUUM** option if you also want to remove unreferenced files. The dialog has a further option that merges transactions into Parquet files and removes the extra deletion vector files.
6. Select **Run now**.

Track the run in the notification pane or in the **Monitoring hub**, where portal runs contain `TableMaintenance` in the activity name. Maintenance applies only to Delta tables, not to legacy Hive tables in Parquet, ORC, AVRO or CSV format.

### From Spark SQL

```sql
OPTIMIZE dbo.table_name
OPTIMIZE dbo.table_name ZORDER BY (column1, column2)
OPTIMIZE dbo.table_name VORDER
```

When you combine Z-Order and V-Order, Spark applies bin compaction first, then Z-Order, then V-Order. Use Z-Order when queries often filter on two or more columns together and the predicates are selective.

### Auto compaction and optimize write

According to the file size tuning page:

- **Auto compaction** runs a synchronous OPTIMIZE after a write commits when a partition has too many small files. It suits streaming and micro-batch ingestion. Enable it with `ALTER TABLE dbo.table_name SET TBLPROPERTIES ('delta.autoOptimize.autoCompact' = 'true')`.
- **Optimize write** shuffles data into bins before Parquet files are written. It suits partitioned tables and operations such as MERGE, UPDATE and DELETE. The shuffle adds processing time, so use it selectively.
- **Adaptive target file size** is enabled by default in Runtime 2.0 and later. Microsoft recommends enabling it manually on Runtime 1.3. The documented size guidance is about 128 MB for tables under 10 GB, growing to about 1 GB for tables over 10 TB.

## Run VACUUM safely

VACUUM removes unreferenced files older than the retention threshold.

- The default threshold is **seven days**.
- Portal and API maintenance requests fail by default for intervals under seven days.
- To go lower, set `spark.databricks.delta.retentionDurationCheck.enabled = false` in the Spark properties of the Fabric environment attached to your workspace.

Learn warns that a shorter interval can reduce time-travel history and affect concurrent readers or writers. The pages I read do not show Spark SQL syntax for VACUUM, so use the Maintenance dialog or check the Delta documentation linked from Learn.

## Typical mistakes (my own list)

- Using `overwriteSchema` when `mergeSchema` is enough.
- Trying to rename or drop a column before enabling column mapping.
- Enabling type widening and then reading the table from an older Delta client.
- Setting a very short VACUUM retention while long-running readers are active.
- Expecting V-Order to change existing files. A table property change affects future writes only, so use compaction to rewrite old files.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric Lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)
- [Delta Lake](https://www.m365.fm/entity/delta-lake/)
- [Delta Lake compaction](https://www.m365.fm/entity/delta-lake-compaction/)

## Sources

- [Schema evolution for Delta tables in Microsoft Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/delta-lake-schema-evolution)
- [Delta table maintenance in a Fabric lakehouse](https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-table-maintenance)
- [Table compaction in Fabric](https://learn.microsoft.com/en-us/fabric/data-engineering/table-compaction)
- [Tune the size of Delta table data files](https://learn.microsoft.com/en-us/fabric/data-engineering/tune-file-size)
- [Delta optimization and V-Order](https://learn.microsoft.com/en-us/fabric/data-engineering/delta-optimization-and-v-order)
