---
title: "How to Run Your First Azure Resource Graph Query in the Azure Portal"
summary: "Open Resource Graph Explorer in the Azure portal, set the scope, run a first query, learn why order by and limit order matters, then use the schema browser, CSV download, charts and dashboard pinning, including the 55,000 record export limit."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [azure-resource-graph, azure-portal, kql]
keypoints:
  - "Search for resource graph in the Azure portal and open Resource Graph Explorer; use Directory to change the scope to a directory, management group or subscription."
  - "A query without order by can return a different set of resources on each run."
  - "Command order matters: limit then order by orders only the first five rows, while order by then limit returns a stable top five."
  - "Download as CSV is limited to 55,000 records, a platform limit that a support ticket cannot override."
  - "Only queries that output a count can become a chart; a chart can be pinned to a dashboard with the scope used when the query ran."
faq:
  - q: "How do I open Azure Resource Graph Explorer?"
    a: "Sign in to the Azure portal, search for resource graph and select Resource Graph Explorer. If you need another scope, select Directory and choose the directory, management group or subscription whose resources you want to query."
  - q: "What is a simple first query?"
    a: "Microsoft Learn uses a query on the resources table that projects name and type and limits the result to five rows. Paste it in the Query 1 area and select Run query. Results appear on the Results tab and details such as result count, duration and errors appear on the Messages tab."
  - q: "Why do my results change between runs?"
    a: "Learn says a query without a sort modifier such as order by might yield a different set of resources on each request. Put order by before limit if you want a stable top five, because the order of the query commands is important."
  - q: "What is the CSV export limit?"
    a: "When you use Download as CSV in Resource Graph Explorer, the result set is limited to 55,000 records. Learn says this is a platform limit that cannot be overridden by filing an Azure support ticket."
  - q: "Can I chart or pin any query?"
    a: "You can create charts only from queries that output a count of resources. Queries that output lists cannot be charted, but they can also be pinned to a dashboard. A pinned query runs again each time the dashboard loads."
---

To run your first Azure Resource Graph query, sign in to the Azure portal, search for resource graph, open Resource Graph Explorer, paste a query into the **Query 1** area and select **Run query**. The scope defaults to what the portal offers, and you can change it with **Directory**. This guide follows the Microsoft Learn quickstart for running a query in the portal and adds a few notes of my own where marked.

## What Resource Graph Explorer does

Learn says Resource Graph Explorer lets you query information about Azure Resource Manager resource types and properties. It also gives an interface to work with several queries, evaluate results, and turn the results of some queries into a chart that you can pin to an Azure dashboard. You need an Azure account. Learn mentions a free account if you do not have one.

## Run a query

1. Sign in to the Azure portal.
2. Search for resource graph and select **Resource Graph Explorer**.
3. If you need another scope, select **Directory**, then pick the directory, management group or subscription whose resources you want to query.
4. In **Query 1**, paste the following and select **Run query**:

   ```kusto
   resources
   | project name, type
   | limit 5
   ```

5. Read the response on the **Results** tab. Select the **Messages** tab for the result count, the duration of the query and any errors.

Learn points out that this query has no sort modifier such as `order by`. If you run it several times, it might return a different set of resources each time.

## Why the order of commands matters

Learn walks through two changes, and the difference is the point of the exercise.

**Order by after limit.**

```kusto
resources
| project name, type
| limit 5
| order by name asc
```

Learn says that, like the first query, this can yield a different set of resources per request. The query limits the results to five resources and then orders those five by name.

**Order by before limit.**

```kusto
resources
| project name, type
| order by name asc
| limit 5
```

Here the query orders all results by name and then keeps five. Learn says that with no change in your environment the results are consistent, ordered by `name` and limited to five.

The practical rule: when you want a stable top-N, sort first and limit second.

## Use the schema browser

The schema browser sits in the left pane. It lists all the resource types of Azure resources that Resource Graph supports and that exist in your tenant. Select a resource type or property to see child properties you can use in a query.

- Selecting a table name adds it to the query.
- Selecting a resource type adds a line such as `where type =="<resource type>"`.
- Selecting a property adds a line such as `where <propertyName> == "INSERT_VALUE_HERE"`. Replace `INSERT_VALUE_HERE` with your own value and add conditions, operators and functions as needed.

Learn's example uses the table `authorizationresources` with the resource type `microsoft.authorization/roledefinitions` and the property `roleName`.

## Download results as CSV

Run a query and select **Download as CSV** on the toolbar. Learn says the result set of this export is limited to 55,000 records. It describes this as a platform limit that cannot be overridden by an Azure support ticket. If you need more rows, split the query by a filter such as subscription or resource type and export each part. That workaround is my suggestion, not a statement from the page.

## Create a chart

Charts work for queries that output a count. Learn gives this example:

```kusto
resources
| where type == "microsoft.compute/virtualmachines"
| summarize count() by tostring(properties.storageProfile.osDisk.osType)
```

Run it, check that the **Results** tab shows counts, then open the **Charts** tab and change the type from **Select chart type...** to **Bar chart** or **Donut chart**. If you try to chart a list, the tab shows a message like "the result set isn't compatible with a donut chart visualization".

## Pin a query to a dashboard

1. Select **Save**, use the name Virtual machine by OS type and the type **Private queries**, then select **Save** in the right pane.
2. Select **Run query** to rerun the saved query.
3. On the **Charts** tab choose a visualization and select **Pin to dashboard**.
4. Choose the existing dashboard to use.
5. Open **Dashboard** from the hamburger menu at the top left of any portal page.

The pinned item uses the title of the saved query, or Query 1 if you did not save it. Learn says the query and its visualization run and update each time the dashboard loads. Lists can be pinned too, not only charts. The pinned query keeps the scope used when you ran it.

## Clean up

To remove the sample, open **Dashboard**, find the chart, select the ellipsis and choose **Remove from dashboard**, then **Save**. To delete the saved query, open Resource Graph Explorer, select **Open a query**, set **Type** to **Private queries**, select the rubbish bin icon next to the query name and confirm with **Yes**.

## How I would build from here

This is my advice, not a Microsoft statement.

1. Start every exploration with `project` so that you only see the columns you need, then add `where` filters one at a time.
2. Use the schema browser to find the property name before typing it by hand.
3. Save queries that you reuse as private queries, and pin only those that give a count or a short list.
4. Check the scope in the Directory selector before you trust a count, because a subscription scope and a management group scope give different totals.

## Related

- [Azure Resource Graph](https://www.m365.fm/entity/azure-resource-graph/)
- [Azure portal](https://www.m365.fm/entity/azure-portal/)
- [Kusto Query Language](https://www.m365.fm/entity/kql/)

## Sources

- [Quickstart: Run Resource Graph query using Azure portal - Azure Resource Graph (Microsoft Learn)](https://learn.microsoft.com/azure/governance/resource-graph/first-query-portal)
