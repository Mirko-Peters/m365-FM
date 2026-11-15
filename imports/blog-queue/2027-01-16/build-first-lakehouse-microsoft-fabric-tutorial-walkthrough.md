---
title: "How to Build Your First Lakehouse in Microsoft Fabric: A Walkthrough"
summary: "Create a lakehouse in Fabric, ingest the sample customer CSV with Dataflow Gen2, check the Delta table, query it from the SQL analytics endpoint, add it to a Direct Lake semantic model and auto-create a report. Follows Microsoft Learn's lakehouse tutorial."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [fabric, fabric-lakehouse, fabric-capacity, power-bi]
keypoints:
  - "You need a Fabric workspace, and OneDrive configured if you ingest the sample CSV through the tutorial's file upload."
  - "Create the lakehouse from the workspace with New item, then Lakehouse, and name it wwilakehouse as the tutorial does."
  - "Ingest the dimension_customer.csv file with a Dataflow Gen2 created from the lakehouse, so the destination is set automatically."
  - "The query name becomes the table name in the lakehouse, so it must be lowercase and without spaces."
  - "The semantic model is created in Direct Lake storage mode, and Auto-create report builds a quick summary report."
faq:
  - q: "What do I need before starting?"
    a: "Per Microsoft Learn, a Fabric workspace, and OneDrive configured if you ingest a CSV file as the tutorial does. If you have no Fabric access, Learn points to a free trial capacity. If data is already in your lakehouse you can use that instead of the sample file."
  - q: "Why does the tutorial need OneDrive?"
    a: "Learn says the file ingestion process relies on OneDrive as the underlying storage for file uploads: an uploaded CSV is temporarily stored there before ingestion. The step fails without OneDrive, unless your data is already in the lakehouse or another supported location."
  - q: "Why must the table name be lowercase?"
    a: "Learn says the name in the query settings is used as the table name in the lakehouse, so it must be lowercase and must not contain spaces."
  - q: "What is the SQL analytics endpoint for?"
    a: "It lets you query the lakehouse tables with SQL. In the tutorial you open it from the dropdown at the top right, select New SQL Query and run a count grouped by BuyingGroup."
  - q: "What storage mode does the semantic model use?"
    a: "Direct Lake. Learn says it reads data directly from the Delta tables in OneLake for fast query performance without importing the data."
---

To build your first lakehouse in Microsoft Fabric, create a lakehouse in a workspace, load a CSV into a Delta table with a Dataflow Gen2, check the table, query it through the SQL analytics endpoint, add it to a semantic model, and auto-create a report. The sample data is a customer file, `dimension_customer.csv`. This guide follows Microsoft Learn's tutorial for creating your first lakehouse, with notes where the tutorial warns about common stumbling blocks.

## Before you start

- A **Fabric workspace**. Learn links its tutorial for creating one. If you do not have Fabric, it points to a free trial capacity.
- **OneDrive configured**, if you ingest the CSV by upload. Learn explains that an uploaded CSV is temporarily stored in your OneDrive account before ingestion into the lakehouse, so the step cannot work without it. If your data is already in a lakehouse, use that instead and skip the upload. You can check with Lakehouse explorer or the SQL analytics endpoint.

## Step 1: create the lakehouse

1. In Fabric, select **Workspaces** and open your workspace by searching for its name.
2. Select **New item**, type **Lakehouse** in the search box and select **Lakehouse**.
3. In the **New lakehouse** dialog, enter **wwilakehouse** as the name and select **Create**. The lakehouse opens.

## Step 2: ingest the sample data

1. Download `dimension_customer.csv` from the Fabric samples repository that the tutorial links.
2. In the lakehouse, go to the **Home** tab and select **Get data** > **New Dataflow Gen2**. The **New Dataflow Gen2** tile under **Get data in your lakehouse** does the same.
3. Name the dataflow **Customer Dimension Data** and select **Create**.
4. On the dataflow Home tab, select **Import from a Text/CSV file**.
5. On **Connect to data source**, choose **Upload file**, browse to or drag in the CSV, and select **Next**.
6. Review the data on **Preview file data** and select **Create** to return to the dataflow canvas.

## Step 3: transform and load

1. In the **Query settings** pane, make sure **Name** is **dimension_customer**. Learn says this name becomes the table name in the lakehouse, so it must be lowercase and contain no spaces.
2. Because you created the dataflow from the lakehouse, the data destination is set to that lakehouse. Check **Data destination** in the query settings. Learn adds that a dataflow created from the workspace needs a destination added manually.
3. The tutorial makes no transformations for simplicity. Select **Save and Run** in the toolbar, and wait for the run to finish.
4. Open the lakehouse from the top menu bar. In Lakehouse explorer, find the **dbo** schema under **Tables**, select **...** and then **Refresh**.
5. Expand **dbo** to see the **dimension_customer** Delta table, and select it to preview the data.

## Step 4: query with the SQL analytics endpoint

1. Switch to **SQL analytics endpoint** with the dropdown at the top right.
2. Select **dimension_customer** to preview it, then select **New SQL Query**.
3. Run the sample query from the tutorial:

```sql
SELECT BuyingGroup, Count(*) AS Total
FROM dimension_customer
GROUP BY BuyingGroup
```

Select **Run**. Learn says SQL query files are saved automatically and you can rename or delete them.

## Step 5: add the table to a semantic model

1. In the SQL analytics endpoint view, select **New semantic model**.
2. Enter a name, assign a workspace and select **dimension_customer**.
3. Select **Confirm**.

If you see "We couldn't add or remove tables" because the organization's Fabric compute capacity exceeds its limits, Learn says to wait a few minutes and try again, and it links its capacity documentation.

The semantic model is created in **Direct Lake** storage mode, which reads directly from the Delta tables in OneLake for fast query performance without importing data. You can edit the model afterwards to add relationships and measures.

## Step 6: create a report

1. In the workspace, find the semantic model, select **...** and then **Auto-create report**.
2. Because the table is a dimension with no measures, Power BI creates a row count measure, aggregates it across columns and builds several charts in a quick summary.
3. Select **Save** to keep the report, and adjust it by adding or removing tables or columns.

## Where the tutorial goes next

Learn says the tutorial is part of a series. The next step is its page on ingesting data into the lakehouse, which builds a fuller lakehouse with Data Factory pipelines, Spark notebooks and more advanced reporting.

## Practical notes

This section is my advice, not a Microsoft statement.

1. **Use a development workspace** on a trial or small capacity for the first run, and delete the lakehouse items afterwards to keep the workspace tidy.
2. **Name tables in lowercase** from the start in your own projects, since the tutorial's rule about names shows how the dataflow query name carries over.
3. **If the CSV step fails,** check OneDrive first, as Learn describes.
4. **If table refresh shows nothing,** confirm the dataflow run finished before you refresh the dbo schema.
5. **Keep the SQL query file** as a sanity check you can re-run after later changes.
6. **Treat the sample as a pattern.** Real data usually needs transformations in the dataflow or a notebook before it lands in a Delta table.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Fabric Lakehouse](https://www.m365.fm/entity/fabric-lakehouse/)
- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)
- [Power BI](https://www.m365.fm/entity/power-bi/)

## Sources

- [Lakehouse tutorial - Create your first lakehouse - Microsoft Fabric (Microsoft Learn)](https://learn.microsoft.com/fabric/data-engineering/tutorial-build-lakehouse)
