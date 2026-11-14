---
title: "Power BI Import vs DirectQuery vs Composite: Semantic Model Modes Compared"
summary: "The three semantic model modes in Power BI per Microsoft Learn: Import, DirectQuery and Composite. What each stores, refresh limits, DAX and Power Query restrictions, Dual tables, hybrid tables, and what each mode asks of capacity memory and processor."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [power-bi, power-bi-service, semantic-model, import-mode, directquery]
keypoints:
  - "Learn names three semantic model modes: Import, DirectQuery and Composite. Import is the default for a new Power BI Desktop solution."
  - "Import data is always stored on disk and must be fully loaded into capacity memory when queried or refreshed. It can compress about 10 times."
  - "DirectQuery stores only metadata and sends native queries to the source. DAX and Power Query are limited to what can be translated, and calculated tables are not supported."
  - "Scheduled refresh is limited to eight times a day on shared capacity and 48 times a day on Premium capacity."
  - "Composite models set the storage mode per table: Import, DirectQuery or Dual. Hybrid tables need a Premium capacity workspace."
faq:
  - q: "Which semantic model mode is the default in Power BI Desktop?"
    a: "Import. Microsoft Learn calls it the most common mode and says it is the default when you create a new Power BI Desktop solution. It offers fast performance through in-memory querying and design flexibility."
  - q: "When should I consider DirectQuery?"
    a: "Learn gives two main reasons: data volumes too large to load into a model or practically refresh, even with data reduction methods, and reports that need near real-time data beyond the scheduled refresh limits."
  - q: "What are the scheduled refresh limits that push people to DirectQuery?"
    a: "The page states eight times a day for shared capacity and 48 times a day for a Premium capacity. Dashboard tiles based on DirectQuery models can update automatically as often as every 15 minutes."
  - q: "What does a Dual storage mode table do?"
    a: "A Dual table is both Import and DirectQuery. Learn says this lets the Power BI service choose the most efficient mode query by query. A typical design puts dimension tables in Import or Dual mode and fact tables in DirectQuery mode."
  - q: "What is a hybrid table?"
    a: "A table with one or several Import partitions and one DirectQuery partition. It serves most data quickly from memory and includes the latest changes after the last import. Learn says hybrid tables are supported only when the semantic model is in a workspace on Premium capacity."
---

Every semantic model in Power BI has a mode, and the mode decides where the data lives, how fresh it can be, and what load it puts on the Power BI service and on the source. This article follows the Microsoft Learn page on semantic model modes in the Power BI service. The page names three modes: Import, DirectQuery and Composite. It also says the content applies to models developed in Power BI Desktop and to models that represent a live connection to an externally hosted Analysis Services model. The original request for this topic mentioned Live Connection as a fourth item. This page does not treat it as a separate mode, so I compare the three modes that it names.

## Import mode

Import is the most common mode and the default for a new Power BI Desktop solution. Queries run in memory, which gives fast performance. It also gives modelers design flexibility and support for specific service features, for example Q&A and Quick Insights.

How it works, per Learn:

- Imported data is always stored on disk. When queried or refreshed, the data must be fully loaded into the memory of the Power BI capacity. A model is never partially loaded.
- On refresh the VertiPaq storage engine compresses and optimizes the data, then stores it to disk. Learn says 10-times compression is possible, so 10 GB of source data can compress to about 1 GB. Size on disk can be reduced by a further 20 percent of the compressed size.

Flexibility comes in three forms: caching data from dataflows and external sources of any type or format, the full set of Power Query M functions in data preparation, and the full set of DAX functions, including calculated columns, calculated tables and measures.

Disadvantages named on the page:

- The whole model must be in memory before it can be queried, which puts pressure on capacity as models grow in number and size.
- Data is only as current as the last refresh, so you refresh it, usually on a schedule.
- A full refresh removes all data from all tables and reloads it, which can be costly in time and resources for the service and for the sources.

The page notes that incremental refresh can avoid truncating and reloading entire tables. Resource needs: enough memory to load the model, plus processing and extra memory to refresh.

## DirectQuery mode

A DirectQuery model does not import data. It holds only metadata that defines the model structure. When someone queries the model, native queries fetch the data from the source.

Learn gives two main reasons to choose it:

- Data volumes are too large to load or practically refresh, even after data reduction.
- Reports need near real-time data beyond scheduled refresh limits, which the page states as eight times a day on shared capacity and 48 times a day on Premium capacity.

Advantages:

- Import size limits do not apply.
- No scheduled refresh is required.
- Users see the latest data when they use filters and slicers, and can refresh the whole report.
- Real-time reports are possible with automatic page refresh.
- Dashboard tiles can update as often as every 15 minutes.

Limitations:

- Power Query expressions can only be functions that can be translated to native queries the source understands.
- DAX formulas are limited in the same way, and calculated tables are not supported.
- Quick Insights is not supported.

Resource needs: little memory, since only metadata loads. But the service sometimes needs significant processor time to generate and process the queries it sends to the source, which can affect throughput when many users query at once.

## Composite mode

A Composite model can mix Import and DirectQuery, or combine several DirectQuery sources. You set the storage mode per table: Import, DirectQuery or Dual. Calculated tables defined in DAX are supported. A Dual table is both Import and DirectQuery, and Power BI decides query by query which is more efficient. Learn says well-configured composite models try to combine the speed of in-memory models with near real-time data.

### Dimensions and facts

Learn says modelers of Composite models are likely to put dimension tables in Import or Dual mode and fact tables in DirectQuery mode. Its example is a Product table in Dual mode and a Sales table in DirectQuery mode. The Product table can fill a slicer quickly from memory. A query that uses Product with Sales in DirectQuery can produce one efficient native SQL query that joins both tables and filters by the slicer values.

### Hybrid tables

A hybrid table has one or more Import partitions and one DirectQuery partition, so it combines fast in-memory queries with changes made after the last import. The easiest way to create one is to configure an incremental refresh policy in Power BI Desktop and enable **Get the latest data in real time with DirectQuery (Premium only)**. For good performance the page advises setting dimension tables to Dual mode. Hybrid tables are supported only when the model is hosted in a Premium capacity workspace. You can also add a DirectQuery partition to an Import table with TMSL, TOM or a third-party tool. A hybrid table can have several Import partitions but only one DirectQuery partition.

## Side by side

| Aspect | Import | DirectQuery | Composite |
| --- | --- | --- | --- |
| Data location | Imported, stored on disk, loaded to memory | Stays in the source, model holds metadata | Per table: Import, DirectQuery or Dual |
| Query speed source | In-memory | Native queries to the source | Mix |
| Freshness | As of last refresh | Latest when queried | Depends on table modes |
| Scheduled refresh | Needed | Not needed | For imported tables |
| Power Query and DAX | Full M and DAX | Only what translates to native queries | Calculated tables supported |
| Memory need | Whole model in memory | Minimal | Depends |
| Quick Insights | Supported | Not supported | Not stated on the page |

## Choosing a mode (my advice)

This is my suggestion, not guidance from the page:

1. Start with Import. It is the default and the most flexible. Move away only for a clear reason, such as volume or freshness.
2. If only one large fact table needs live data, test a Composite model with that table in DirectQuery and the dimensions in Dual before you convert the whole model.
3. When you choose DirectQuery, test with the number of users you expect, since the processor load and the source load grow with concurrent queries.
4. Check capacity memory before you add more Import models, since each one loads fully.
5. Record the mode and refresh plan in the model description, so the next owner knows why it was chosen.

## Related

- [Power BI](https://www.m365.fm/entity/power-bi/)
- [Power BI Service](https://www.m365.fm/entity/power-bi-service/)
- [Semantic model](https://www.m365.fm/entity/semantic-model/)
- [Import mode (Power BI)](https://www.m365.fm/entity/import-mode/)
- [DirectQuery](https://www.m365.fm/entity/directquery/)

## Sources

- [Semantic model modes in the Power BI service (Microsoft Learn)](https://learn.microsoft.com/power-bi/connect-data/service-dataset-modes-understand)
