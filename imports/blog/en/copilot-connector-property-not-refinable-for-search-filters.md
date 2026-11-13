---
title: "Copilot Connector Property Not Refinable: Fix Missing Search Filters"
summary: "The properties you need as search filters are greyed out or not refinable in a Copilot (Graph) connector schema? Learn why a published schema cannot change and how to rebuild it with the right attributes."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [copilot-connectors, microsoft-search, microsoft-365-admin-center]
keypoints:
  - "Microsoft Learn says you cannot add or remove the refinable attribute of a property in a published connection, and you cannot delete a property. To change either, you rebuild the connection."
  - "A refinable property cannot be searchable, and int properties cannot be refined even if they are marked refinable."
  - "In a 2025 Q&A thread, an admin rebuilt a Jira connection without one string collection property and the other properties became refinable. Self-reported, not confirmed by Microsoft."
  - "After the schema is right, a custom filter is added in the vertical wizard under Filters. Learn says vertical changes can take a few hours to show."
faq:
  - q: "Can I make a property refinable after the connection is published?"
    a: "No. Microsoft Learn's schema page says you cannot add or remove a refinable search attribute to a property, and the deployment page says you cannot add or remove it after setup. The Graph connectors schema article says you cannot add a refinable attribute as part of a schema update. To get a different set of refinable properties, create a new connection."
  - q: "Which properties can be used as filters?"
    a: "Learn says a refinable property can be used to configure a filter, that it cannot also be searchable, and that int properties cannot be refined. The custom filters page says filters work on text and dateTime properties. The Graph schema article says only string or numeric types can be refinable, so the Learn pages are not fully consistent. Test your property types in a small connection first."
  - q: "How long until a new filter appears in the search results page?"
    a: "The custom filters page does not give a time. The verticals page says that changes after you enable or update a vertical may take a few hours to appear. In the community thread, the asker wrote that the filters needed a few days to become usable after the crawl, which is a personal observation."
  - q: "Do I have to run a full crawl after a schema change?"
    a: "Learn recommends it. The schema page says to run a full crawl after an update to bring items to the latest schema, and that without one, item behavior can be inconsistent. Adding a search capability requires a full crawl."
---

A team builds a Jira connection for Microsoft Search. They add more source properties to the schema, mark them as refinable, and expect them to appear as filters. Only two do. The fields they need are greyed out, cannot be refined and cannot be removed.

This is a scenario from a May 2025 Microsoft Q&A thread. It has no Microsoft answer, so this article uses the current Microsoft Learn schema and filter pages to explain the behavior and to give a safe way forward. It is a troubleshooting guide, not an official Microsoft procedure.

## What the thread reported

An administrator had set up a Confluence connector earlier and customized its schema so that extra properties could be filters in a custom vertical. For a new Jira connector, the same approach did not work: only two properties ended up refinable.

The administrator then replied to their own question. They suspected that one property, the issue type, defined as a refinable string collection, caused the problem. After deleting and re-creating the connector and its index without that property, the other properties became refinable. In a later comment, they wrote that the filters needed a few days to become fully usable in the vertical.

No Microsoft staff member answered, and the reply is not marked as accepted. The administrator's broader conclusion about Jira projects with different schemas is an opinion. The useful part is the rebuild.

## Step 1: Learn what the schema allows

Learn's page on managing the search schema defines the attributes:

- **Searchable**: the value goes into the full-text index.
- **Queryable**: you can query the property with KQL.
- **Retrievable**: the value can be returned in results. Learn says labels can only be mapped to retrievable properties.
- **Refinable**: an admin can configure the property as a custom filter on the Microsoft Search results page.

The rules that matter here:

- A refinable property cannot be searchable.
- The `int` data type cannot be refined, even if marked as refinable.
- You cannot add or remove a refinable attribute on a property.
- You cannot delete an existing property in a published connection. To remove a property, delete and recreate the connection.

The deployment page says the same: you cannot add or remove the refinable attribute after setup, and you cannot refine int properties. Learn's Graph article on registering a schema adds that marking too many properties as refinable can hurt performance.

## Step 2: Open the schema and read the current state

In the Microsoft 365 admin center, Learn describes this path:

1. Go to the **Schema** page in the **Customization** section.
2. Select **View details** under **Copilot connectors schema**.
3. Select the connection and choose **Customize schema**.

Check each property you wanted as a filter. Note its type, and whether it is searchable or retrievable. A greyed-out refinable box on a published connection is consistent with the rule that this attribute cannot change after setup. The thread does not prove that this is the reason in that tenant, but the rule fits the symptom.

## Step 3: Check the data type of each filter property

Learn gives three statements that you have to read together:

- The custom filters page says filters are configurable on text and dateTime properties and that int properties cannot be refined.
- The Graph schema article says only string or numeric types can be refinable.
- The same article lists an example property `tags` of type StringCollection with the refinable box ticked, but its text does not say that this type is supported.

So Learn does not clearly say whether a string collection works as a refinable property. In the thread, a refinable string collection coincided with the failure. That is a reported observation. If you need a multi-value field, test it in a small test connection first, with only that property refinable, before you build the production schema.

## Step 4: Decide whether you must rebuild

Use this rule of thumb, based on the Learn rules above:

| Situation | What you can do |
|---|---|
| The property is not refinable and the connection is published | Create a new connection with the property refinable. You cannot add the attribute later. |
| A property you do not need blocks you | Learn says you can only remove a property by deleting and recreating the connection. |
| The property is refinable but not showing as a filter | Check the vertical and filter setup in Step 6. No rebuild is needed. |
| The property is `int` | It cannot be refined. Learn does not give a conversion path, so add a string or text version of the value in your source or mapping. |

Before you delete a connection, write down the connection settings, the schema, the labels and the crawl schedule. Deleting a connection removes the items that were indexed through it, so users lose those results until the new crawl completes.

## Step 5: Rebuild with the right attributes

When you create the new connection, set the attributes at the schema step. Learn's deployment page lists them as **SEARCH**, **QUERY**, **RETRIEVE** and **REFINE**. Follow these rules:

1. Mark only the properties you really want as filters as refinable.
2. Do not make those properties searchable at the same time.
3. Map the `title` label to a property, since Learn calls it the most important label.
4. Make sure that every property that is mapped to a label is retrievable.
5. Leave out a property that you are not sure about, like a string collection, and add it in a separate test.

Then run a full crawl. Learn says to run a full crawl after any schema update, and that adding a search capability needs one.

## Step 6: Add the filter to a vertical

According to the Learn page on custom filters, a vertical must exist, and the property must be refinable.

1. In the Microsoft 365 admin center, go to **Verticals**.
2. Select the vertical and choose **Edit**.
3. Go to the **Filters** step.
4. Choose **Add a filter** and configure it on a refinable managed property.
5. Review and save the vertical.

If you use more than one connection, Learn recommends a common alias that maps the source properties of each connection. Its example maps an Owner property in one system and a Publisher property in another to the alias Author.

Learn also notes that a filter shows a maximum of 50 values in the drop-down, and that you can add a connection as a content source under only one vertical. A search result layout is needed for connector results to render on the vertical page. The verticals page says changes may take a few hours to appear after you enable or update a vertical.

## Step 7: Wait and test

The thread's author saw a delay of days between the crawl and usable filters. Learn only gives the "few hours" figure for vertical changes and no figure for indexing. Check the crawl state in the admin center, then test the filter with a user account and with queries that return items that carry the filter property.

## Limits of this guide

- The thread is one self-answered case. The role of the string collection property is not confirmed.
- Learn pages disagree on which types can be refinable. We kept both statements.
- The page on the schema does not give a time for reindexing.
- If a rebuilt connection still shows the same behavior, collect the connection ID, the schema, and the property types and open a support case.

## Related

- [Copilot connectors](https://www.m365.fm/entity/copilot-connectors/)
- [Microsoft Search](https://www.m365.fm/entity/microsoft-search/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)

## Sources

- [Microsoft Learn: Manage the search schema](https://learn.microsoft.com/en-us/microsoftsearch/manage-search-schema)
- [Microsoft Learn: Register and update the schema for a connection (Microsoft Graph)](https://learn.microsoft.com/en-us/graph/connecting-external-content-manage-schema)
- [Microsoft Learn: Deploy connectors in the Microsoft 365 admin center](https://learn.microsoft.com/en-us/microsoft-365/copilot/connectors/deployment-overview)
- [Microsoft Learn: Manage custom filters in Microsoft Search](https://learn.microsoft.com/en-us/microsoftsearch/custom-filters)
- [Microsoft Learn: Manage verticals](https://learn.microsoft.com/en-us/microsoftsearch/manage-verticals)
- [Microsoft Q&A: Microsoft Search Graph connector to Jira, schema fixed after customisation (May 2025)](https://learn.microsoft.com/en-us/answers/questions/2276878/microsoft-search-graph-connector-to-jira-schema-fi)
