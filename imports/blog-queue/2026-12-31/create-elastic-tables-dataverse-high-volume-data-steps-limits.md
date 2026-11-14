---
title: "Create Elastic Tables in Dataverse for High-Volume Data: Steps, Partitions and Limits"
summary: "How to create an elastic table in Microsoft Dataverse, based on Microsoft Learn: the maker steps, how partition IDs and consistency work, time to live, unsupported features, bulk operations and known issues to check before choosing an elastic table."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [dataverse-elastic-tables, dataverse, power-apps, cosmos-db]
keypoints:
  - "In Power Apps, select Tables, then New table, then Set advanced properties, open Advanced options and choose the type Elastic."
  - "Elastic tables are backed by Azure Cosmos DB and use a partition ID. Logical partitions hold 20 GB each, and a partition ID value can be at most 1,024 bytes."
  - "Strong consistency applies only within a session token, and multi-record transactions and deep insert are not supported."
  - "A time to live column deletes rows after a number of seconds. Learn lists as a known issue that rows exported with Synapse Link are not removed from the lake when TTL expires."
  - "CreateMultiple, UpdateMultiple and DeleteMultiple give 10 times the throughput according to the maker article."
faq:
  - q: "How do I create an elastic table?"
    a: "According to Microsoft Learn, in Power Apps select Tables, then New table, then Set advanced properties, then Advanced options, and choose the type Elastic."
  - q: "What is a partition ID?"
    a: "According to the Microsoft Learn developer article, Azure Cosmos DB divides rows into logical partitions of up to 20 GB based on this value. The value can be at most 1,024 bytes and must avoid certain characters."
  - q: "Do elastic tables support transactions?"
    a: "The Learn developer article states that multi-record transactions are not supported, and that deep insert is not supported."
  - q: "Do elastic tables use extra storage?"
    a: "According to the maker article, elastic table data is included in Dataverse log capacity."
---

Elastic tables are a Dataverse table type for high-volume, high-throughput data. You create one in Power Apps by choosing the type **Elastic** in the advanced options of a new table. Before you do, read the limits: elastic tables are backed by Azure Cosmos DB and behave differently from standard tables. This guide combines the Microsoft Learn maker article and the developer article.

## When to choose an elastic table

The developer article has no comparison table. It uses two lists.

Use elastic tables when:

- Data is unstructured or semi-structured, or the data model changes often.
- You need horizontal scaling for growing or bursty workloads.
- You must handle a high volume of reads and writes.

Use standard tables when:

- The application requires strong data consistency.
- It requires relational modeling, transactions across tables, or transactional behavior during plug-in execution.
- It requires complex joins.

Learn says a mix of both may suit your data and application.

## Create an elastic table

The maker article describes these steps:

1. In Power Apps, select **Tables**.
2. Select **New table**.
3. Select **Set advanced properties**.
4. Open **Advanced options**.
5. Choose the type **Elastic**.

The maker page has no steps for editing an elastic table after creation. It states that elastic table data is included in Dataverse log capacity.

## How partitions work

Every elastic table has a system column named Partition Id (schema name `PartitionId`, logical name `partitionid`, type string). Azure Cosmos DB divides rows into logical partitions based on this value. Learn says to set a strategy and apply it consistently.

A good partition value, according to the page:

- Never changes after the row is created.
- Has high cardinality. Each logical partition holds up to 20 GB.
- Spreads data evenly across partitions.
- Is no larger than 1,024 bytes.
- Avoids these characters: `/`, `<`, `>`, `*`, `%`, `&`, `:`, `\`, `?` and `+`. Alternate keys do not support them either.

With a custom partition ID the primary key is not unique on its own. A unique reference is the primary key plus the partition ID. Dataverse sets no limit on the number of logical partitions, and a partition is not deleted when its rows are.

The page contradicts itself on the default. It says an unset partition ID stays null and cannot be changed later, and it also says Dataverse uses the primary key value as the default. It recommends the primary key for write-heavy tables of any size, or when rows are mostly retrieved by primary key. Because of the conflict, test the behavior in your environment before you rely on it.

The page gives an IoT example: a sensor data table uses the device ID column as the partition ID, because each device has a unique ID and queries are usually per device.

## Consistency and session tokens

Elastic tables give strong consistency within a logical session, which is a connection between a client and Dataverse. Each write returns a session token in the `x-ms-session-token` response header. To read the latest data, pass the token with later requests: the `SessionToken` optional parameter in the SDK, or the `MSCRM.SessionToken` request header in the Web API. Without the token, recent changes may be missing, and other sessions may not see changes right away.

## Transactions and plug-ins

The developer page documents these behaviors:

- Multi-record transactions are not supported.
- An error in a synchronous PostOperation plug-in does not undo the created record. The request returns an error, but the data operation succeeds.
- Do not cancel operations by throwing `InvalidPluginExecutionException` in PreOperation or PostOperation. Use PreValidation for validation.
- `ExecuteTransactionRequest` and `$batch` changesets succeed but are not atomic. The page says they will throw errors in the future.
- Deep insert is not supported. The error text is `Cannot create related entities. Create has to be called individually for each entity.`

## Time to live

Elastic tables have an integer column named Time to live (schema name `TTLInSeconds`). The value is the number of seconds until the row expires and is deleted. If no value is set, the row stays indefinitely, as in standard tables. The page does not describe how to set the column in code and gives no value range.

## Bulk operations and unsupported features

The maker article states that using CreateMultiple, UpdateMultiple and DeleteMultiple gives 10 times the throughput. It also lists features and column types that elastic tables do not support. I am not reproducing that long list. Check it against your design.

## Known issues from the developer page

1. `ExecuteTransactionRequest` and `$batch` changesets complete without an error but are not applied as a transaction.
2. No `x-ms-session-token` is returned for delete operations.
3. The `partitionId` optional parameter works only for Retrieve and Delete.
4. Rows exported to a data lake with Synapse Link for Dataverse are not removed from the lake when their TTL expires.

The page says known issues should be fixed before the feature becomes generally available. Check the page for the current status.

## Suggestion: before you commit

This section is a practical suggestion and not a Microsoft statement.

1. Name the key you read by most often and use it as the partition value.
2. Check whether any process needs rows to save together. If yes, a standard table fits better.
3. Test a bulk load with the Multiple messages and not single-row calls.
4. If you use Synapse Link, plan how expired rows are cleaned up in the lake.

## Not covered

The pages I read do not describe the following:

- Steps to edit an elastic table after creation.
- Code samples for creating tables or setting TTL.
- Upsert and alternate key operation details.
- Total table size, throughput limits, pricing or regional availability.

## Related

- [Dataverse elastic tables](https://www.m365.fm/entity/dataverse-elastic-tables/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Cosmos DB](https://www.m365.fm/entity/cosmos-db/)

## Sources

- [Create and edit elastic tables with Power Apps](https://learn.microsoft.com/power-apps/maker/data-platform/create-edit-elastic-tables)
- [Elastic tables (developer documentation)](https://learn.microsoft.com/power-apps/developer/data-platform/elastic-tables)
