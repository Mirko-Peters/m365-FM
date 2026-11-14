---
title: "Dataverse FetchXML Multi-Table Queries in the List Rows Action: Joins, Paging and Limits"
summary: "How to query related Dataverse tables with FetchXML link-entity in the List rows action of the Dataverse connector, including join types, paging rules, row limits and what the action does not support."
status: review
publish: false
author: mirko-p
date: 2026-12-13
topics: [dataverse, azure-logic-apps, power-automate]
keypoints:
  - "The List rows action of the Dataverse connector has a Fetch Xml Query parameter for joins that OData filters and expand cannot express."
  - "link-entity joins a related table. The default link-type is inner, and exists or in can improve performance when you only need to filter."
  - "A query can contain up to 15 link-entity elements. Exceeding that returns error 0x8004430D."
  - "Without paging, Dataverse returns at most 5,000 rows. The connector's pagination setting does not support FetchXML, so you manage paging in the query."
  - "Aggregation queries are not supported by List rows with FetchXML, and the page's statements on distinct conflict, so test it."
faq:
  - q: "How do I join tables in a FetchXML query?"
    a: "According to Microsoft Learn, add a link-entity element inside entity. Set name to the related table, from to the column in the related table, and to to the matching column in the parent. Add an alias so result columns have predictable names."
  - q: "Why do I only get 5,000 rows?"
    a: "Microsoft Learn says that without paging Dataverse returns up to 5,000 standard table rows, or 500 for elastic tables. For more, send further requests with page and paging-cookie. The List rows page adds that the connector's pagination setting does not support FetchXML queries."
  - q: "Can I use aggregate or distinct with List rows?"
    a: "The List rows article says aggregation queries are currently not supported with FetchXML in this action. It states in one place that distinct can be used and in another that distinct is not supported directly, so test your query. The article suggests removing duplicates with a Select action and a union expression."
  - q: "Can I combine top with paging?"
    a: "No. Microsoft Learn says not to use the fetch top attribute together with paging, because the two methods of limiting results are not compatible."
---

OData filters and the expand option cover many Dataverse queries, but they get awkward once you need rows from several related tables, outer joins or "rows with no related rows". The List rows action of the Dataverse connector has a **Fetch Xml Query** parameter for these cases. Microsoft Learn describes it as the option for more flexible custom queries, such as tables with multiple related tables or paging scenarios. This article covers how to write the joins, how to handle paging and which limits apply.

## Where the parameter lives

In Power Automate, the action is **List rows** under **Microsoft Dataverse**. Fetch Xml Query sits in the **Advanced parameters** dropdown. The connector reference lists it as the fetchXml parameter, described as a Fetch XML query for advanced customization, next to Select columns, Filter rows, Sort By, Expand Query, Row count (default 5000), Skip token and Partition ID.

The connector reference lists Power Automate, Power Apps and Copilot Studio as products and does not mention Azure Logic Apps for the Dataverse connector. If you plan to use the action in a Logic Apps workflow, confirm availability in your plan before you design around it.

## A basic query with a join

The List rows article shows this example, which returns accounts with the full name of the primary contact:

```xml
<fetch count="10">
   <entity name="account">
      <attribute name="name" />
      <attribute name="emailaddress1" />
      <link-entity name="contact" to="primarycontactid" from="contactid">
         <attribute name="fullname" />
      </link-entity>
      <filter>
         <condition attribute="createdon" operator="ge" value="2021-01-01T00:00:00-00:00" />
      </filter>
      <order attribute="name" descending="true" />
   </entity>
</fetch>
```

Every FetchXML query is based on one table, set by the entity element. Use logical names, not display names.

## How link-entity works

The join article lists the attributes of link-entity:

| Attribute | Meaning |
|---|---|
| name | Logical name of the related table |
| from | Column in the related table that matches the to column |
| to | Column in the parent element that matches the from column |
| link-type | Join type. Default is inner |
| alias | Name of the related table in the results |
| intersect | Set to true when the link entity is an intersect table that returns no columns |

Set an alias. Without one, the system generates a name such as account1.name.

To go in the other direction, query from the contact side and swap the columns: from is the lookup column on the referencing table and to is the primary key of the parent. For many-to-many relationships, nest two link-entity elements and mark the first, for example teammembership, with intersect set to true.

## Choosing the join type

- **inner** returns rows that match in both tables.
- **outer** keeps parent rows without matches. Combine it with a filter on a null column of the related table to find parents with no children, such as accounts with no contacts.
- **exists** and **in** are inner variants that use subqueries. Use them when you only need to filter the parent rows and do not need linked columns. Learn says they can reduce result size and improve performance when many linked rows match one parent. They return no linked-entity columns.
- **matchfirstrowusingcrossapply** returns each parent at most once with columns from one matching linked row. With this type the returned property names omit the alias prefix.

The type list also includes any, not any, all and not all. The join article does not describe their behavior, so consult the link-entity reference if you need them.

You can join on columns that are not in a defined relationship. Both columns should have the same data type. File, Image, MultiSelect and PartyList columns cannot be used in from or to. Multiple Lines of Text, long Single Line of Text (over 850 characters), Formula, Calculated and Logical columns work but may perform poorly.

## Limits to design around

- **Joins:** a query can contain up to 15 link-entity elements. Each adds a JOIN and increases execution time. Going over returns error 0x8004430D.
- **Rows:** without paging, Dataverse returns up to 5,000 standard table rows and 500 elastic table rows.
- **No aggregation:** the List rows article says aggregation queries cannot be used with FetchXML in this action.
- **Threshold:** the pagination threshold in the action settings has a maximum of 100,000 and is rounded to the page size, but it does not apply to FetchXML queries.
- **Throttling:** the connector reference lists 6000 API calls per connection per 300 seconds.

## Paging a FetchXML query

The List rows article says the pagination setting does not support FetchXML, so to request more than 5,000 rows you manage paging in the query itself. The FetchXML paging article describes two models:

- **Simple paging** uses count and page. It cannot return more than 50,000 records in total, and performance drops as the row count grows.
- **Paging cookies** use count, page and paging-cookie. Learn recommends this for all dataset sizes, though some queries do not support it. Do not modify the cookie.

Rules that apply to both:

- count defaults to and is capped at 5,000 for standard tables.
- Do not combine top with paging.
- Always specify an order. If you add none, Dataverse adds one based on the primary key. With distinct, no primary key is returned, so you must specify the order yourself.
- Ordering on the primary key is best. Avoid ordering on calculated fields, choices, long text or non-unique numbers.
- Paging works best going forward. Going back may return different records if data changed.

The pages I read do not show how to read the paging cookie from the connector's response inside a flow. If you cannot get it, simple paging with an incrementing page value is the documented fallback, within its 50,000 record limit.

## Keep the query efficient

The List rows article recommends Select columns and leaving Return full metadata off, so only essential columns load. For FetchXML, the same idea applies: list only the attribute elements you need rather than using all-attributes, which Learn says is not recommended for most cases. Use filters in the query to reduce rows early, and prefer exists or in when you only filter on the related table.

## Removing duplicates

Joins can create duplicates, for example when a parent matches several children. The List rows article suggests using a Select action to reshape the response and then a variable with the expression union(body('Select'),body('Select')) to get distinct rows. The exists and in link types avoid the duplicates at the source when you do not need child columns.

## Common mistakes

- Using display names instead of logical names.
- Forgetting the alias and then guessing column names in dynamic content.
- Turning on the action's pagination and expecting it to page a FetchXML query.
- Mixing top with page or count.
- Joining on columns with different data types.
- Ordering a paged query on a non-unique column, which can repeat rows across pages.

## Build and test the query first

The FetchXML overview names two community tools for composing and testing queries: the XrmToolBox FetchXML Builder and the Power Platform Toolbox FetchXML Studio. Microsoft does not support community tools, so contact the tool publisher with issues. Test the query there, then paste it into the action.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)

## Sources

- [Microsoft Learn: List rows action](https://learn.microsoft.com/en-us/power-automate/dataverse/list-rows)
- [Microsoft Learn: Join tables using FetchXml](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/fetchxml/join-tables)
- [Microsoft Learn: Page results using FetchXml](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/fetchxml/page-results)
- [Microsoft Learn: FetchXml overview](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/fetchxml/overview)
- [Microsoft Learn: Microsoft Dataverse connector](https://learn.microsoft.com/en-us/connectors/commondataserviceforapps/)
