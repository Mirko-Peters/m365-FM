---
title: "Power BI Direct Lake Falls Back to DirectQuery: How to Find the Cause in Fabric"
summary: "Direct Lake on SQL endpoints can silently switch to DirectQuery. See which conditions trigger it, how to read the fallback reason with TABLETRAITS, and how to confirm it in Performance Analyzer or Profiler."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [direct-lake, directquery, semantic-model, fabric]
keypoints:
  - "Only Direct Lake on SQL analytics endpoints can fall back to DirectQuery. Direct Lake on OneLake runs in DirectLakeOnly mode and does not fall back."
  - "Run EVALUATE TABLETRAITS() against the model. The DirectLakeFallbackInfo column names the reason per table, and None means the table uses Direct Lake."
  - "Documented triggers include SQL row-level security, dynamic data masking or object-level security on the endpoint, unmaterialized SQL views, exceeded guardrails and a missing refresh (framing)."
  - "Set the Direct Lake behavior property to DirectLakeOnly during development so a fallback fails loudly instead of silently slowing reports."
  - "Performance Analyzer shows a Direct query metric on fallback. In SQL Server Profiler, DirectQuery_Begin and DirectQuery_End events point to it."
faq:
  - q: "Does Direct Lake on OneLake fall back to DirectQuery?"
    a: "No. According to Microsoft Learn, DirectQuery fallback is not supported by Direct Lake on OneLake, which runs exclusively in DirectLakeOnly mode. Fallback only applies to Direct Lake on SQL analytics endpoints."
  - q: "How do I see why a table fell back?"
    a: "Microsoft Learn says to run the DAX query EVALUATE TABLETRAITS() against the semantic model. The DirectLakeFallbackInfo column shows the reason for each table, and the value None means the table uses Direct Lake mode."
  - q: "Which Direct Lake behavior setting should I use in production?"
    a: "Microsoft Learn describes Automatic as the default and recommends it for production, because reports keep working if fallback is needed, although they may be slower. DirectLakeOnly is recommended during development to surface errors, and DirectQueryOnly to measure fallback performance."
  - q: "Can a large table cause fallback?"
    a: "Yes. Learn states that a single table that exceeds a guardrail limit (Parquet file count, row group count or row count) prevents Direct Lake mode for the entire model. It recommends OPTIMIZE and VACUUM to reduce files and row groups, and a larger Fabric SKU if the table still exceeds the limits."
---

Direct Lake falls back to DirectQuery when the semantic model cannot read a table straight from its Delta files. The fastest way to find out why is to run `EVALUATE TABLETRAITS()` against the model and read the `DirectLakeFallbackInfo` column. It names the reason per table, and `None` means the table runs in Direct Lake mode. The rest of this article follows the order Microsoft Learn uses: confirm that fallback happens, read the reason, fix the cause, then decide how strict the model should be.

## First check which Direct Lake flavor you have

Fallback is not a property of every Direct Lake model. Microsoft Learn says that only **Direct Lake on SQL analytics endpoints** can use DirectQuery fallback. **Direct Lake on OneLake** does not support it and runs exclusively in DirectLakeOnly mode. If your model is on OneLake, a slow or failing query cannot be explained by a fallback to DirectQuery, so look at other causes such as the guardrails and memory limits.

For a model on SQL analytics endpoints, fallback means the table "no longer operates in Direct Lake mode" and retrieves data from the SQL analytics endpoint of the lakehouse or warehouse. Learn adds that these queries return the latest data, because they are not tied to the last framing operation, but they might be slower.

## Step 1: Confirm that fallback is happening

There are two documented ways to confirm it.

**Performance Analyzer in Power BI Desktop**

1. Start Power BI Desktop and select **New** > **Report**.
2. Select **Get Data**, then **Power BI semantic models**.
3. In the OneLake catalog, select the Direct Lake model and choose **Connect**.
4. Add a card visual with a data column, then open **View** > **Performance analyzer**.
5. Select **Start recording**, then **Refresh visuals**, and expand the card visual.

If no DirectQuery processing shows up, the model processed the visual's DAX queries in Direct Lake mode. A **Direct query** metric indicates a fallback.

**SQL Server Profiler**

Profiler comes with SQL Server Management Studio. Create a new trace with server type **Analysis Services**, use the workspace URL as the server name, and connect to the semantic model. Under **Events Selection**, select **Show all events**, and under **Query Processing** pick the DirectQuery and VertiPaq events. According to Learn, `DirectQuery_Begin` and `DirectQuery_End` events suggest a fallback. VertiPaq storage engine events without them indicate Direct Lake processing. Learn notes that EngineEdition queries and object-level security checks do not count as fallback, because the engine always uses DirectQuery for those checks.

## Step 2: Read the reason

Run this DAX query against the model:

```
EVALUATE TABLETRAITS()
```

The `DirectLakeFallbackInfo` column lists the reason for each table. Use that value instead of guessing.

## Step 3: Compare against the documented conditions

Microsoft Learn lists the conditions under which Direct Lake mode stays in use. Fallback is the result when one of them is not met:

- No referenced table has SQL row-level security defined at the SQL analytics endpoint.
- No referenced table has SQL dynamic data masking defined at the endpoint.
- No referenced table has SQL object-level security defined at the endpoint.
- No referenced table is based on an unmaterialized SQL view.
- No single table exceeds the guardrail limits for Parquet files, row groups or rows.
- The model was refreshed (framed) after the Delta tables were created or modified.

The query-processing page also names memory pressure that prevents loading the columns a DAX query needs as a typical fallback reason. The Direct Lake overview adds that SQL-based granular access control in a warehouse also triggers fallback, and that tables created through XMLA and not yet processed fall back unless fallback is disabled, in which case queries fail.

## Step 4: Fix the matching cause

| Cause shown | What Microsoft documents |
|---|---|
| SQL view as source | Fallback to DirectQuery. Direct Lake on OneLake offers lakehouse materialized views as the alternative. |
| Security on the SQL endpoint (RLS, OLS, DDM) | Fallback. Moving to Direct Lake on OneLake changes behavior: the SQL-based RLS is not applied there, and users need file access in OneLake. Review this with your security owner before you switch. |
| Guardrail exceeded | Run `OPTIMIZE` and `VACUUM` on the Delta table to reduce files and row groups. If the table still exceeds the limits, Learn suggests a larger Fabric SKU. |
| Model not refreshed | Refresh the model so framing runs against the current Delta tables. Learn notes that framing itself can fail if a Delta table exceeds guardrails, for example with more than 10,000 Parquet files. |

The exact numeric guardrail limits depend on the Fabric SKU. Learn points to its capacity requirements page for them, so check the current table there.

## Step 5: Choose how strict the model should be

The **Direct Lake behavior** property controls what happens when conditions are not met. It applies only to Direct Lake on SQL analytics endpoints.

| Value | Behavior | Intended use |
|---|---|---|
| Automatic | Silently falls back to DirectQuery. This is the default. | Production, to keep reports working |
| DirectLakeOnly | The query fails with an error. | Development, to find and fix problems |
| DirectQueryOnly | Always uses DirectQuery. | Development, to measure fallback performance |

To change it in the Fabric portal, open the semantic model's **Model** view, open the **Properties** pane and change **Direct Lake behavior**. Programmatically, Learn shows setting `database.Model.DirectLakeBehavior` with the Tabular Object Model.

A practical pattern is to run DirectLakeOnly while you build and test, so every fallback becomes a visible error. Switch to Automatic once the model is stable and users depend on it. The pages read for this article do not describe other settings paths, such as Power BI Desktop menus for this property.

## Common mistakes (own reading of the pages above)

- Treating a slow report as a capacity problem without checking for fallback first.
- Testing only with Automatic, so fallbacks never surface.
- Assuming the model is on OneLake when it was created on a SQL analytics endpoint.
- Forgetting to refresh after changing Delta tables.

## Related

- [Direct Lake](https://www.m365.fm/entity/direct-lake/)
- [DirectQuery](https://www.m365.fm/entity/directquery/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)

## Sources

- [Microsoft Learn: Direct Lake overview](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview)
- [Microsoft Learn: How Direct Lake works](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-how-it-works)
- [Microsoft Learn: Analyze query processing for Direct Lake semantic models](https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-analyze-query-processing)
