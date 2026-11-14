---
title: "How to Write Your First KQL Queries in Log Analytics"
summary: "Start a KQL query with a table name, pipe into take, where, project, sort, top and summarize, and set the time range. A step-by-step guide to the basics from Microsoft's Azure Monitor tutorial, including KQL mode versus Simple mode, case sensitivity and the permission you need."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [log-analytics, azure-monitor, kql]
keypoints:
  - "Queries run in Log Analytics in the Azure portal and need read permission on the workspace, for example through the Log Analytics Reader role."
  - "Start with a table name, not search, because it scopes the query and improves performance."
  - "KQL is case sensitive, so table and column names must match the schema pane exactly."
  - "Use take for a quick sample, top for the latest records, where for filters, project to choose columns and summarize with bin for time series."
  - "The default time range is the last 24 hours, and a time filter in the query should come right after the table name."
faq:
  - q: "Where do I run a KQL query?"
    a: "In Log Analytics, a tool in the Azure portal for querying Azure Monitor Logs. Learn describes KQL mode for advanced queries and Simple mode, where you select a table and apply filters in a user interface."
  - q: "What permission do I need?"
    a: "Learn says you need Microsoft.OperationalInsights/workspaces/query/*/read permissions on the Log Analytics workspaces you query, as provided for example by the Log Analytics Reader built-in role."
  - q: "What is the difference between take and top?"
    a: "take returns up to the number of records you give, in no particular order. top sorts the table on the server side and returns the top records, for example the latest 10 by TimeGenerated. sort alone orders results but does not limit them."
  - q: "Why does my filter on Level not work with numbers?"
    a: "Learn notes that in its SecurityEvent example the Level column is a string, so you must cast it to a numeric type such as int before using numeric operators, for example with toint."
  - q: "Why does a search query run slowly?"
    a: "Learn says search queries are ordinarily slower than table-based queries because they process more data. Use search in a specific table, or better, filter on the column that holds the value."
---

A KQL query in Log Analytics starts with a table name, followed by operators joined with the pipe character. For a first useful result, run `SecurityEvent | take 10`, then add `where` to filter, `project` to pick columns, `top` for the latest records and `summarize` to count or average. Microsoft Learn's tutorial on log queries walks through these steps, and this article follows it with notes on common mistakes.

## Where and what you need

Learn says you write and run log queries in Log Analytics, a tool in the Azure portal. It offers two modes: **KQL mode** for writing and customizing advanced queries, and **Simple mode**, where you select a table and apply filters. This article uses KQL mode.

To query a workspace you need `Microsoft.OperationalInsights/workspaces/query/*/read` permissions to it, as provided by the Log Analytics Reader built-in role, for example. If you have no data of your own, Learn points to a demo environment with sample data.

## Structure of a query

Learn says a query can start with a table name or with the `search` command, and recommends starting with a table name because it defines a clear scope, improves performance and improves the relevance of results. Azure Monitor organizes log data in tables with columns, and the schema pane in Log Analytics lists all of them.

One rule matters early: KQL is case sensitive. Language keywords are usually lowercase, while table and column names must be written in the correct case as shown in the schema pane.

## Step 1: take a sample

```kusto
SecurityEvent
| take 10
```

The query starts with the table name, then a pipe, then the `take` operator. The pipe passes the output of one command to the next. Learn says `take` returns records in no specific order, which is fine for a first look at a table's structure.

## Step 2: sort and top

`take` cannot give you ordered results. Learn describes two operators for that:

- `sort by TimeGenerated` sorts all available records, but does not limit how many are returned. Descending is the default order for `sort` and `top`.
- `top 10 by TimeGenerated` sorts on the server side and returns only the top records, here the latest 10.

Learn calls `top` the best way to get only the latest records, since sorting an entire table is not optimal.

## Step 3: filter with where

```kusto
SecurityEvent
| where Level == 8 and EventID == 4672
```

Learn lists comparison operators: `==` for case-sensitive equality, `=~` for case-insensitive equality, `!=` or `<>` for inequality, and `and` or `or` between conditions. You can also pipe several `where` clauses one after another.

Values can have different types. Learn gives the example that `Level` in `SecurityEvent` is a string, so a numeric comparison needs a cast: `SecurityEvent | where toint(Level) >= 10`.

## Step 4: set the time range

The time picker next to **Run** defaults to the last 24 hours. You can also add a time filter in the query, ideally right after the table name:

```kusto
SecurityEvent
| where TimeGenerated > ago(30m)
```

`ago(30m)` means 30 minutes ago, and other units include days such as `2d` and seconds such as `10s`. Learn notes that if you set a range in the query, the picker changes to Set in query, and if you also change the picker, Log Analytics applies the smaller of the two ranges.

## Step 5: choose and create columns

Use `project` to select columns, rename them and define new ones:

```kusto
SecurityEvent
| top 10 by TimeGenerated
| project Computer, TimeGenerated, EventDetails=Activity, EventCode=substring(Activity, 0, 4)
```

Use `extend` to keep all original columns and add another. Learn says to use `extend` for ad hoc computations and to use ingestion-time transformations or summary rules for efficiency at scale.

## Step 6: summarize

```kusto
Perf
| where TimeGenerated > ago(1h)
| summarize count() by ObjectName, CounterName
```

`summarize` groups records and applies aggregations, most commonly `count`. Learn's averaging example shows a trap: averaging `CounterValue` by `Computer` alone mixes counters and gives meaningless results, so group by `Computer, CounterName`. For time series, group with `bin`, for example `summarize avg(CounterValue) by bin(TimeGenerated, 1h)`, then switch to Chart view and pick a line chart.

## Search queries

`search in (SecurityEvent) "Cryptographic" | take 10` finds records with a phrase in any column of that table. Learn says that omitting `in (SecurityEvent)` searches all tables, which is slower and less efficient, and that you should filter on a column when you know which one holds the value.

## My suggested habits

This section is my advice, not a Microsoft statement.

1. **Always begin with the table and a time filter.** It keeps queries fast and cheap to run.
2. **Read the schema pane before writing.** Case errors in column names are a common first failure.
3. **Build in small steps.** Run after each added operator, and keep the pipe order readable, one operator per line.
4. **Cast before comparing numbers.** If a numeric filter returns nothing, check the column type.
5. **Keep a note of working queries.** Save the ones you reuse, so the next investigation starts from a known base.
6. **Use top instead of sort for recent records.** It states your intent and avoids sorting more than needed.

## Duplicates in results

Learn's FAQ says duplicate records can come from retries in the pipeline, which can cause duplicates for a small percentage of telemetry items, or from having both the Log Analytics agent and Azure Monitor Agent installed on a virtual machine.

## What I did not read

I read the whole tutorial. It covers the basics only. Join, union, parsing and functions are in other KQL documentation that I did not read for this article.

## Related

- [Log Analytics](https://www.m365.fm/entity/log-analytics/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [KQL](https://www.m365.fm/entity/kql/)

## Sources

- [Get started with log queries in Azure Monitor Logs - Azure Monitor (Microsoft Learn)](https://learn.microsoft.com/azure/azure-monitor/logs/get-started-queries)
