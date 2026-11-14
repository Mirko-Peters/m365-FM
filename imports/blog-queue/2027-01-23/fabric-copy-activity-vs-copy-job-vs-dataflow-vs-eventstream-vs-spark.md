---
title: "Fabric Copy Activity vs Dataflow vs Eventstream vs Spark: Which Data Movement Tool to Use"
summary: "Compare pipeline copy activity, Copy job, Dataflow Gen2, Eventstream and Spark in Microsoft Fabric using the Learn decision guide: use cases, personas, skills, data volume, sources, destinations, transformation depth and the five scenarios that show when each one fits."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [fabric, fabric-data-factory, dataflow-gen2, eventstream, apache-spark, fabric-copy-job]
keypoints:
  - "The Learn decision guide compares five options: pipeline copy activity, Copy job, Dataflow Gen2, Eventstream and Spark."
  - "Copy activity and Copy job are no-code or low-code movers with lightweight transformation. Copy job targets incremental copy and replication through a wizard."
  - "Dataflow Gen2 offers 300+ transformation functions through Power Query and 150+ connectors. Eventstream handles event data. Spark is code-first with notebooks and Spark job definitions."
  - "Sources and destinations differ: copy activity lists 50+ source and 40+ destination connectors, while Eventstream targets Eventhouse, Lakehouse, Activator alerts, derived streams and custom endpoints."
  - "Pick by the work: bulk ingestion or migration, no-code transformation, real-time events, custom distributed processing, or CDC-based incremental copy."
faq:
  - q: "What is the difference between copy activity and Copy job?"
    a: "Both are listed as no-code or low-code with lightweight transformation, 50+ source connectors and 40+ destination connectors, and wizard or canvas interfaces. Copy job lists data ingestion, incremental copy, replication and migration as use cases and business analysts among its personas. Learn's fifth scenario uses a Copy job for a CDC-enabled on-premises SQL Server with an initial full load and automatic switch to incremental loads."
  - q: "When should I pick Dataflow Gen2?"
    a: "When you need data transformation, wrangling or profiling with a no-code or low-code Power Query interface. The page lists 150+ connectors, 300+ transformation functions, and destinations including Lakehouse, Azure SQL database, Azure Data Explorer and Azure Synapse analytics. In the example, a data engineer with Power Query experience and low to medium data volume cleans data and loads it into several destinations."
  - q: "When is Eventstream the right tool?"
    a: "For event data ingestion and lightweight transformation. Sources include databases supporting CDC, Kafka and messaging systems with publish and subscribe. Destinations are Eventhouse, Lakehouse, Activator alert, derived stream and custom endpoint. The example forwards events as they occur without managing extraction schedules, for real-time decision support."
  - q: "When do I need Spark?"
    a: "When you want code: Spark in Scala, Python, Spark SQL or R, developed in notebooks or Spark job definitions, with support for native Spark and open-source libraries and low to high transformation complexity. The example reads structured, semi-structured and unstructured data from OneLake, transforms it and writes Delta tables in a lakehouse."
  - q: "Can I combine the tools?"
    a: "The guide treats them as choices for a given job, and its scenarios describe a layered flow: copy activity brings raw data into a bronze lakehouse, and another person uses a dataflow for cleansing and business logic. Whether you combine them in one solution is a design decision the page does not prescribe."
---

Microsoft Fabric has several ways to move and shape data, and the Learn decision guide compares five of them: pipeline copy activity, Copy job, Dataflow Gen2, Eventstream and Spark. This article reproduces the comparison in a compact form, adds the five scenarios from the page, and ends with a short way to choose. Note that the Learn page title lists four tools, while its table has five columns, because Copy job is in the table.

## The comparison

| | Copy activity | Copy job | Dataflow Gen2 | Eventstream | Spark |
| --- | --- | --- | --- | --- | --- |
| Use case | Lake and warehouse migration, ingestion, lightweight transformation | Ingestion, incremental copy, replication, migration, lightweight transformation | Ingestion, transformation, wrangling, profiling | Event data ingestion and transformation | Ingestion, transformation, processing, profiling |
| Primary persona | Data engineer, data integrator | Business analyst, data integrator, data engineer | Data engineer, data integrator, business analyst | Data engineer, data scientist, data developer | Data integrator, data engineer |
| Skill set | ETL, SQL, JSON | ETL, SQL, JSON | ETL, M, SQL | SQL, JSON, messaging | Spark (Scala, Python, Spark SQL, R) |
| Code | No code, low code | No code, low code | No code, low code | No code, low code | Code |
| Data volume | Low to high | Low to high | Low to high | Medium to high | Low to high |
| Interface | Wizard, canvas | Wizard, canvas | Power Query | Canvas | Notebook, Spark job definition |
| Sources | 50+ connectors | 50+ connectors | 150+ connectors | CDC databases, Kafka, publish and subscribe messaging, event streams | Hundreds of Spark libraries |
| Destinations | 40+ connectors | 40+ connectors | Lakehouse, Azure SQL database, Azure Data Explorer, Azure Synapse analytics | Eventhouse, Lakehouse, Activator alert, derived stream, custom endpoint | Hundreds of Spark libraries |
| Transformation | Low, lightweight: type conversion, column mapping, merge or split files, flatten hierarchy | Low, same lightweight set | Low to high, 300+ functions | Low, lightweight | Low to high, native Spark and open-source libraries |

## Reading the table

- **Copy activity and Copy job** are the movers. Their transformation ability is limited to the lightweight set listed. Copy job differs by use case: incremental copy and replication.
- **Dataflow Gen2** is the transformation tool with a visual Power Query interface and the widest connector list in the table, 150+.
- **Eventstream** is the only one built around events. It lists medium to high volume and lightweight transformation.
- **Spark** is the only code-first choice and has the widest transformation range.

## The five scenarios

1. **Bulk ingestion with copy activity.** Leo needs to bring a large volume of data from on-premises and cloud systems into a bronze lakehouse, without writing code and without Spark experience, on a schedule. He picks pipeline copy activity. The page says it applies to historical and incremental refresh, can load gold data to a warehouse with no code, and that pipelines provide high-scale ingestion that can move petabyte-scale data.
2. **Cleansing with Dataflow Gen2.** Mary applies business logic and loads data into several destinations such as Azure SQL Database, Azure Data Explorer and a lakehouse. She knows Power Query and the volume is low to medium, so she picks Dataflow Gen2, which gives 300+ transformation options and several destinations.
3. **Events with Eventstream.** Prashant integrates event data from business applications for real-time decision support, with medium to high volume and a preference for no code. Eventstream forwards events as they occur without managing extraction schedules.
4. **Custom logic with Spark.** Adam builds extract and transform logic for customer review analytics. He writes a Spark application in Python or Scala that reads structured, semi-structured and unstructured data from OneLake and writes Delta tables in the lakehouse.
5. **CDC with Copy job.** Rajesh loads incremental data from an on-premises SQL Server with CDC enabled into an Azure SQL Database. He wants a wizard that selects multiple CDC-enabled tables, performs an initial full load, switches to incremental loads and schedules refreshes. The Copy job with on-premises gateway support fits.

## Choosing quickly

| Question | Pointer from the page |
| --- | --- |
| Do you move data in bulk with no or low code? | Copy activity |
| Do you need incremental copy or replication through a wizard? | Copy job |
| Do you need visual transformation with Power Query skills? | Dataflow Gen2 |
| Is the data a stream of events? | Eventstream |
| Do you need code, libraries or very flexible transformation? | Spark |

## What the page does not say

The guide is a reference table and scenarios. It does not give price or capacity comparisons, performance numbers beyond the volume ranges, or limits of each tool, so check the product pages for those before a final design.

## A short way to decide (my advice)

This is my suggestion, not Microsoft guidance:

1. Start with the skill of the team. A team with Power Query experience and modest data volumes is quicker with a dataflow than with Spark.
2. Separate movement from transformation in your design. Use copy activity or Copy job to land raw data, and use a dataflow or Spark to shape it, as the first two scenarios suggest.
3. Treat events as their own case. Do not force streaming sources into scheduled copies.
4. For CDC sources, look at Copy job before you build a pipeline by hand.
5. Test the capacity use of the chosen tool on real data, since the page gives no consumption numbers.

## Related

- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Data Factory in Microsoft Fabric](https://www.m365.fm/entity/fabric-data-factory/)
- [Dataflow Gen2](https://www.m365.fm/entity/dataflow-gen2/)
- [Eventstream](https://www.m365.fm/entity/eventstream/)
- [Apache Spark](https://www.m365.fm/entity/apache-spark/)
- [Copy job (Fabric Data Factory)](https://www.m365.fm/entity/fabric-copy-job/)

## Sources

- [Fabric decision guide: copy activity, dataflow, Eventstream, or Spark (Microsoft Learn)](https://learn.microsoft.com/fabric/fundamentals/decision-guide-pipeline-dataflow-spark)
