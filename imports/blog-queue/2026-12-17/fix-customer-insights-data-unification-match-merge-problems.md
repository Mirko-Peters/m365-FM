---
title: "Fix Customer Insights Data Unification: Match Rules, Duplicates and Merge Conflicts"
summary: "Find out why Customer Insights - Data unifies the wrong records or picks the wrong field values, using the deduplication, matching and merge steps, the output tables and the Match failed checks from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [dynamics-365-customer-insights, dynamics-365-customer-insights-data, unified-customer-profile]
keypoints:
  - "Unification runs in three stages: deduplication within each table, matching across tables, then merging fields into the Customer table."
  - "Rule order matters. The matching algorithm only tries the next rule when the previous rule found no match for a record."
  - "Conditions inside one rule use AND. Add exceptions to stop false matches, such as twins with the same last name and address."
  - "Merge preferences decide field values. Importance takes the first non-null value by rank, and grouping fields keeps values from one source together."
  - "Download Deduplication_*, ConflationMatchPairs and Customer output tables to see at which stage a result went wrong."
faq:
  - q: "Why is a unified field filled from a different source than I expected?"
    a: "According to Microsoft Learn, the default merge policy is Importance, which uses the first non-null value in table rank order. If a higher ranked table has an empty value, the field falls back to the next table. Reorder the fields or choose Most recent or Least recent, which need a date or numeric field in every participating table."
  - q: "How do I stop two different customers from matching?"
    a: "Microsoft Learn describes exceptions, added through Edit rule > Add > Add exception, which are applied after the match rules. Custom match conditions also offer Never match, which keeps two primary-key rows apart. Learn also advises not to match on name alone."
  - q: "What does the Match failed message mean?"
    a: "The Learn troubleshooting page lists causes such as a failed data refresh, source table changes that were not ingested, missing data files or partition paths, a match job canceled after running for hours, and transient issues. In most cases you refresh the data sources and rerun unification."
  - q: "Which record wins when duplicates are found in one table?"
    a: "Microsoft Learn says the winner is chosen by merge preferences. Most filled is the default, with Most recent and Least recent as alternatives. If candidates tie, the row with the larger primary key value wins. Non-winner rows stay available as alternate rows for matching."
  - q: "Can I see where a wrong merge came from?"
    a: "Yes. Learn names three output tables: Deduplication_{Datasource}_{Table}, ConflationMatchPairs and Customer. You can download up to the most recent 100,000 records from each table, or set up exports for larger volumes."
---

Wrong unified profiles usually come from one of three places: deduplication grouped records that should stay apart, a match rule joined or missed records across tables, or the merge step took a field value from an unexpected source. Customer Insights - Data keeps one output table per stage, so you can find the stage that caused the result before you change any rule. This article follows Microsoft Learn.

## Know the three stages

| Stage | What it does | Output table |
|---|---|---|
| Deduplication | Reduces each source table to one row per customer | `Deduplication_{Datasource}_{Table}` |
| Matching | Matches the winner rows across tables | `ConflationMatchPairs` |
| Merge | Combines fields into the unified profile | `Customer` |

Each table is deduplicated separately. Grouping is transitive: if one rule matches rows 1 and 2 and another matches rows 2 and 3, all three form one group. A winner row represents the group. The other rows are alternate rows, which the matching step still uses. If a row matches an alternate row, the record matches the winner.

## Step 1: Rule out data and refresh problems

If the page shows **Match failed**, check these causes first. They come from the Learn troubleshooting page:

1. A failed refresh. Go to **Data** > **Data sources**, check each source used in unification and refresh failed ones.
2. Source table changes that were not ingested. Compare the data sources with the data in Customer Insights and rerun ingestion or refresh.
3. Missing data files or partition paths. Check that the files exist and are reachable.
4. A match job canceled after hours. Reduce the complexity of the match rules or contact support.
5. A transient issue. Rerun unification.

After each fix, rerun the unification process.

## Step 2: Download the output tables

Open **Tables** and select **Download** for each output table. This returns the most recent 100,000 records. For more records, set up an export for each table, preferably to blob storage. To isolate a few problem records, Learn describes a sandbox environment with a small set of those records, the original deduplication rules, copied matching rules with **Include all records** turned on, and the default **Unified data view**.

Then ask which stage changed the result:

- Unexpected deduplication: check source data, normalization, precision, exceptions and merge preferences.
- Unexpected match: check the `Deduplication_*` records, match order, normalization, precision, exceptions and custom match conditions.
- Unexpected merge: check the `ConflationMatchPairs` records, excluded fields, clusters, grouped fields and custom ID generation.

The Learn example shows why this order helps. A unified first name came out as "Moni" because the Contact winner had a blank first name, and the unified field fell back to the Referral table.

## Step 3: Fix match rules

Match order and rules follow these principles:

- Matching needs at least two tables. The first table is the primary table, and it should have the most complete and reliable data.
- A table can only match tables higher in the order. Table3 can match Table2 or Table1.
- Rule order matters. The next rule runs only if the first found no match.
- Conditions in one rule are joined with AND. Separate rules act as OR.
- **Include all records** keeps unmatched records as singletons.
- Once you select **Next** after the conditions, you cannot remove a selected table or column. Use **Back** first.

Precision sets how close strings must be: Low 30 percent, Medium 60, High 80, Exact 100, or a custom percentage. Learn's best practices advise at least one exact condition in every fuzzy rule, columns with good uniqueness, and no columns with repeated defaults such as "Firstname". Fuzzy matching runs slower, and it is not meant for name variants such as Suzzie and Suzanne. Use the **Type - Name** normalization or alias mapping for those.

Use normalization to standardize values before comparing. It affects matching only and does not change stored data. Phone matching treats a number with a country code as different from one without. Custom bypass lists strings that are never matched, such as `test@contoso.com`.

## Step 4: Stop false matches

Two tools exist for false matches:

- **Exceptions.** On the **Edit rule** pane, select **Add** > **Add exception**. Exceptions are applied after the rules. Learn's example is twins with the same last name, city and birth date, separated by an exception on first name.
- **Custom match conditions.** Select **Custom** and choose **Always match**, **Never match**, **Bypass** or **Alias mapping**. Download the template, fill it with table names, which are case sensitive, and keys, ingest it from **Data** > **Data sources** and apply it. Changes take effect on the next unification run.

For duplicates inside one table, deduplication rules need a field that is likely unique, such as email, and Learn says not to rely on name alone.

## Step 5: Fix merge conflicts

On the column review step, open a field with **Edit** to see the **Combine columns** pane. Learn lists the merge policies:

| Policy | Winning value |
|---|---|
| **Importance** (default) | First non-null value by table rank |
| **Most recent** | Newest value, needs a date or numeric field in each table |
| **Least recent** | Oldest value, same requirement |

For deduplication winners, the table-level options are **Most filled** (default), **Most recent** and **Least recent**. Under **Edit merge preferences** > **Advanced**, you can set a preference per column, for example the most recent email and the most complete address.

Mixed records happen when fields come from different sources. Learn's example shows an address line from one table combined with other address fields from another. Use **Combine** > **Group of fields**, set **Rank groups by**, and group the address fields so the values of one source stay together. A group allows up to 10 fields and up to 15 data sources. Use **Exclude** to remove columns that should not be in the profile, after removing them from segments or other processes.

If `CustomerId` changes between runs, check custom ID generation on the **Keys** tab. Learn says the ID changes when the source table or input field values change, and it recommends stable fields such as a government ID instead of phone, email or address.

## Step 6: Measure the effect of a rule

On the **Deduplication rules** and **Matching rules** pages, watch the **Unique records** count. If a new rule does not change it, an earlier rule already found those matches. To see run time, go to **Settings** > **System** > **Status** and select **Match**.

## Typical mistakes

- Matching on name alone.
- Fuzzy rules without an exact condition.
- Placing the least reliable table first in the match order.
- Expecting an exception to change the deduplication stage.
- Ranking a table first even though its fields are often empty.

## What the sources do not say

The pages read for this article do not describe a maximum number of rules or a run time threshold. The troubleshooting page on output tables does not cover duplicate customer IDs, and its worked example does not state an explicit fix.

## Related

- [Dynamics 365 Customer Insights](https://www.m365.fm/entity/dynamics-365-customer-insights/)
- [Dynamics 365 Customer Insights data](https://www.m365.fm/entity/dynamics-365-customer-insights-data/)
- [Unified customer profile](https://www.m365.fm/entity/unified-customer-profile/)
- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)

## Sources

- [Matching rules for data unification](https://learn.microsoft.com/en-us/dynamics365/customer-insights/data/data-unification-match-tables)
- [Remove duplicates before unifying data](https://learn.microsoft.com/en-us/dynamics365/customer-insights/data/data-unification-duplicates)
- [Unify customer columns](https://learn.microsoft.com/en-us/dynamics365/customer-insights/data/data-unification-merge-tables)
- [Data unification best practices](https://learn.microsoft.com/en-us/dynamics365/customer-insights/data/data-unification-best-practices)
- [Resolve data unification match failures](https://learn.microsoft.com/en-us/troubleshoot/dynamics-365/customer-insights/data/profile-unification/match-failed)
- [Troubleshoot unification output tables](https://learn.microsoft.com/en-us/troubleshoot/dynamics-365/customer-insights/data/profile-unification/troubleshoot-unification-output-tables)
