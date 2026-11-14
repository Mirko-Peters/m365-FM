---
title: "Direct Lake Cold Starts and Slow First Queries in Fabric: How to Diagnose and Reduce Them"
summary: "A slow first query in a Direct Lake semantic model is usually a cold start. Learn what cold, warm and hot mean, what forces a cold reload, and which Delta table habits keep models warm, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [direct-lake, cold-start, semantic-model, delta-lake]
keypoints:
  - "Learn defines four memory states: cold, semiwarm, warm and hot. Direct Lake performs best warm or hot, and cold states are slower."
  - "A cold query must transcode Parquet dictionaries into VertiPaq dictionaries and load column segments before it can answer."
  - "Overwrite patterns erase the Delta log, so incremental framing is impossible and everything reloads. Avoid them where you can."
  - "Run EVALUATE INFO.STORAGETABLECOLUMNSEGMENTS() after framing to check which segments are still resident."
  - "Learn suggests row groups of 1 to 16 million rows, partitioning on low-cardinality columns and scheduled Optimize runs."
faq:
  - q: "What is a cold start in Direct Lake?"
    a: "Microsoft Learn defines the cold state as one where the VertiPaq store is empty, so all data needed to answer a DAX query must be loaded from the Delta tables. Queries in this state are slower, and Learn says moving quickly from cold to warm is key to good performance."
  - q: "What makes a Direct Lake model go cold again?"
    a: "Learn lists destructive loading patterns such as Overwrite, which erase the Delta log and force a full reload, and rolling-window deletes or updates on large unpartitioned tables. It also notes that, because of unforeseen demand for compute and memory, a model might reload onto another Fabric cluster node in cold state."
  - q: "Does Optimize help or hurt?"
    a: "Both, in different time frames. Learn says Optimize causes a short-term cold-state penalty, while the resulting fewer, larger and more uniform segments improve long-term query performance. It suggests running it infrequently, such as at weekends or month end, or more often for high-frequency small updates."
  - q: "Does Microsoft describe a prewarming feature?"
    a: "The pages read for this article give no explicit prewarming guidance. The only warm-up step they mention is querying the model until it is warm or hot, which is part of their procedure for checking column residency."
---

A slow first query in a Direct Lake semantic model is most often a cold start. The model has to load the columns a query needs from Delta tables into memory, and that takes time that warm queries skip. To diagnose it, compare a first run with a repeat run, check what your data loads do to the Delta tables, and look at which column segments stay in memory after a refresh. This article follows Microsoft Learn's page on Direct Lake loading, residency and performance.

## What happens during a cold query

Learn describes the main tasks when a DAX query reaches a cold model:

- **Dictionary transcoding.** Direct Lake merges the local Parquet dictionaries of each column chunk into a global VertiPaq dictionary. Learn says this merge affects query response time.
- **Loading column chunks into segments.** Usually this is a direct remapping of Parquet data IDs to VertiPaq IDs. If the Parquet dictionaries use plain encoding, the values must be converted first, which takes longer.
- **Join indexes.** For queries across related tables, Direct Lake loads the key-column dictionaries and the primary-key column segments on the one side of the relationship.
- **Deletion vectors.** If the source table uses them, they are loaded so deleted rows are excluded.

The "How Direct Lake works" page adds that columns are loaded only when a query requests them for the first time, and that loaded columns stay resident. A column can be evicted when the model or table was refreshed after a Delta table update, when no query used it for some time, or for other memory management reasons, including memory pressure in the capacity from concurrent operations.

## The four memory states

| State | Meaning according to Learn |
|---|---|
| Cold | The VertiPaq store is empty. All data must be loaded from Delta tables. |
| Semiwarm | Only segments of removed row groups were dropped during framing, or segments were unloaded under memory pressure. |
| Warm | The columns a query needs are already fully in memory. |
| Hot | Columns are in memory, VertiScan caches are populated and queries hit the caches. |

Learn states that Direct Lake performs best warm or hot, and that it reaches performance on par with import mode when dictionaries, segments and join indexes are loaded.

## Step 1: Reproduce the pattern

Run the same report or DAX query twice after a refresh. This comparison is my own diagnostic habit, not a documented procedure: if only the first run is slow, you are probably seeing cold loading. If both are slow, the cause may be something else. The Direct Lake pages describe DirectQuery fallback as another reason for slow queries, so rule that out separately. For Direct Lake on SQL analytics endpoints, the "How Direct Lake works" page says the DAX query `EVALUATE TABLETRAITS()` shows the fallback reason per table in the `[DirectLakeFallbackInfo]` column, where `None` means the table uses Direct Lake mode.

## Step 2: Check how the Delta table is loaded

A framed model references a Delta commit version. Learn describes incremental framing: when only part of a Delta table changes, Direct Lake reuses the in-memory data that is still valid. Some loading patterns defeat this.

- **Overwrite.** Learn says Overwrite erases the Delta log, so Direct Lake cannot use incremental framing and must reload all data, dictionaries and join indexes.
- **Rolling-window deletes or updates on large unpartitioned tables.** In Learn's example, deleting one day of data from a table with one billion rows rewrote all eight Parquet files, so a change of 548,665 rows forced a reload of the whole table.
- **No updates.** When a Delta table receives no updates, columns already in memory do not need to reload.

## Step 3: Check residency after framing

Learn gives this procedure:

1. Query the model until it is warm or hot.
2. Update the Delta table and refresh (frame) the model.
3. Run `EVALUATE INFO.STORAGETABLECOLUMNSEGMENTS()`, which wraps the `DISCOVER_STORAGE_TABLE_COLUMN_SEGMENTS` view.

Segments that are no longer resident after framing indicate a true cold state. Segments that remain show that incremental framing worked.

Learn also describes how to force a cold state for testing: send a `processClear` followed by a `processFull` XMLA command. `ProcessClear` removes all data and the link to the framed Delta version, and `ProcessFull` frames the model to the latest Delta commit.

## Step 4: Reduce cold reloads

Learn's guidance for the Delta tables themselves:

- **Partition on low-cardinality columns.** In the example, partitioning by a derived Month column with 60 distinct values limited the same update to one Parquet file, so about 17 million rows reloaded instead of one billion. Learn's guidance is fewer than 100 to 200 distinct values.
- **Target a row group size of 1 to 16 million rows.** Row groups significantly under one million rows can cause performance problems.
- **Schedule Optimize.** Optimize produces fewer, larger and more uniform segments, which helps in the long run, but causes a short-term cold-state penalty. Learn suggests running it infrequently, for example over weekends or at month end, or more often when small updates arrive at high frequency.
- **Keep the referenced Delta version.** A framed model references a specific Delta commit version. Learn says the table must keep that version until you frame again, otherwise users get query errors.

## Step 5: Size the model for memory

Learn says Direct Lake must load all column data required by a query, which can exhaust memory. With too little memory it unloads column data and may need to reload it for later queries. It recommends sizing semantic models adequately to avoid frequent reloads. Maximum memory per model depends on the Fabric SKU. Learn calls Max Memory the upper limit for how much data can be paged in. It is not a guardrail, but large data volumes can cause excessive paging in and out of OneLake data.

The pages read here do not give a numeric eviction threshold or a prewarming feature. If you need either, check the current Fabric capacity documentation and release notes.

## Common mistakes (own reading of the pages above)

- Judging performance only on the first run after a refresh.
- Loading with Overwrite and then wondering why every refresh is slow.
- Running Optimize in the middle of the working day.
- Partitioning on a high-cardinality column, which creates many small files.

## Related

- [Direct Lake](https://www.m365.fm/entity/direct-lake/)
- [Cold start](https://www.m365.fm/entity/cold-start/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)
- [Delta Lake](https://www.m365.fm/entity/delta-lake/)

## Sources

- [Microsoft Learn: Understand Direct Lake query performance](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-understand-storage)
- [Microsoft Learn: How Direct Lake works](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-how-it-works)
- [Microsoft Learn: Direct Lake overview](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview)
