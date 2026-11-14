---
title: "How to Design a Star Schema in Power BI for Faster Reports"
summary: "Design a star schema in Power BI: dimension and fact tables, one-to-many relationships, role-playing dimensions, explicit measures, snowflake trade-offs, surrogate keys, bridging tables and degenerate dimensions, with gaps in the Learn article."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [power-bi-relationships, power-bi]
keypoints:
  - "A star schema classifies each table as a dimension table for filtering and grouping or a fact table for summarization. Power BI infers the type from the relationships."
  - "The one side of a one-to-many relationship is a dimension table and the many side is a fact table. Avoid mixing both types in one table."
  - "Only one active relationship can exist between two tables. For role-playing dimensions such as dates, Learn recommends a separate dimension table per role."
  - "Single model tables usually beat snowflake designs. Many-to-many dimension relationships are best modeled with a bridging table."
  - "The article gives no benchmarks and no dedicated guidance on single-direction filtering, date table setup or wide tables."
faq:
  - q: "What is a star schema?"
    a: "A modeling approach widely used in relational data warehouses. Each table is classified as a dimension table, which describes business entities and enables filtering and grouping, or a fact table, which stores observations or events and enables summarization."
  - q: "How does Power BI know which table is which?"
    a: "There is no table property for it. The type is determined by the model relationships. The one side of a one-to-many relationship is always a dimension and the many side is always a fact table."
  - q: "How should I model dates used for order, ship and delivery?"
    a: "Only one relationship between two tables can be active. Learn recommends creating a dimension table for each role-playing instance, instead of relying on inactive relationships and USERELATIONSHIP."
  - q: "Should I snowflake dimensions?"
    a: "Generally the benefits of a single model table outweigh the benefits of multiple tables. Snowflake designs add tables, longer filter chains and a less intuitive Data pane."
  - q: "How do I model many-to-many between dimensions?"
    a: "Learn calls the bridging table approach the best practice when relating two dimensions. A bridging table can be a factless fact table that stores the relationships."
---

A star schema separates what you filter by from what you add up. Power BI models built this way are easier to understand and, according to the Microsoft Learn article, optimized for performance and usability. This guide follows the Learn article on star schema. The article is qualitative and gives no benchmarks.

## The two table types

- **Dimension tables** describe business entities, the things you model. They enable filtering and grouping. They usually have a relatively small number of rows.
- **Fact tables** store observations or events, such as sales orders, stock balances, exchange rates or temperatures. They enable summarization. They can have many rows and keep growing.

The dimension key columns determine the dimensionality of a fact table. The dimension key values determine its granularity. Fact tables should always load data at a consistent grain.

## How Power BI sees the types

You do not set a table type in Power BI. The model relationships decide it. In a one-to-many relationship the one side is always a dimension table and the many side is always a fact table. Avoid mixing the two types in a single table.

## Role-playing dimensions

A date table can filter related facts by order date, ship date or delivery date. There can only be one active relationship between two Power BI tables. All others must be inactive, and the only way to use an inactive relationship is a DAX expression with USERELATIONSHIP.

The recommended pattern is to create a dimension table for each role-playing instance, using referencing queries or calculated tables. Use self-describing column names such as Ship Year and table descriptions such as Filters reseller sales by order date.

## Measures

- An explicit measure is created from a DAX formula and produces a scalar value at query time. Values are never stored in the model.
- An implicit measure is a column that visuals or Q&A can summarize directly.

Learn gives three reasons for explicit measures: MDX clients such as Analyze in Excel, paginated reports that use the MDX query designer for server aggregates, and control over how columns are summarized.

## Snowflake dimensions

Generally the benefits of a single model table outweigh those of multiple tables. Mimicking a snowflake adds tables, longer filter chains, a less intuitive Data pane and no cross-table hierarchies. Combining tables can increase storage through redundant data.

## Keys

Relationships need a single unique column in one table. If a dimension has none, the article suggests adding a surrogate key, for example a Power Query index column, and merging it into the many-side query.

## Special cases

- **Many-to-many.** A bridging table is the best practice when relating two dimensions. A factless fact table stores only dimension keys and can serve as the bridge.
- **Degenerate dimensions.** An attribute needed for filtering that lives in the fact table, such as a sales order number, is an accepted exception to the no-mixing rule.
- **Junk dimensions.** Many small, low-cardinality attributes such as order status or gender can be combined into one table built as a Cartesian product with a surrogate key.

## Data preparation

Power BI semantic models depend on Power Query to import or connect to data. For large volumes or slowly changing dimensions, the article recommends first building a data warehouse with ETL processes.

## What the article does not say

- Benchmarks or measured performance gains.
- Dedicated guidance on single-direction filtering. It links to a separate page on bi-directional relationships.
- A section on creating or marking a date table.
- Advice on avoiding wide tables.
- Full DAX or Power Query samples.

## A design outline

This outline is practical advice built on the article.

1. List the business events and entities and sort them into facts and dimensions.
2. Fix the grain of each fact table.
3. Use one-to-many relationships from dimensions to facts.
4. Add a dimension table for each date role you need.
5. Create explicit measures and hide the raw numeric columns.

## Typical mistakes

- Putting dimension attributes and facts in one table.
- Relying on inactive relationships for every date role.
- Snowflaking dimensions without a clear reason.
- Using a many-to-many relationship where a bridging table fits.

## Related

- [Power BI relationships](https://www.m365.fm/entity/power-bi-relationships/)
- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Desktop](https://www.m365.fm/entity/power-bi-desktop/)

## Sources

- [Understand star schema and the importance for Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/guidance/star-schema)
