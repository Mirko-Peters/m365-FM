---
title: "Microsoft Purview Data Map Explained Simply: What It Does and How It Fits Into Purview"
summary: "What the Microsoft Purview Data Map is, how scanning fills it, how it differs from the Unified Catalog, how capacity units are billed, and the retirement notice Microsoft now shows on its data governance pages."
status: review
publish: false
author: mirko-p
date: 2026-11-21
topics: [purview-data-map, purview, purview-unified-catalog, data-governance]
keypoints:
  - "The Data Map is the metadata layer of Purview data governance. It stores metadata about data sources, not the data itself."
  - "Scans connect to a source, capture technical metadata, extract schemas and apply classifications. Ingestion then loads the result into the Data Map."
  - "The Unified Catalog sits on top of the Data Map. Stewards curate data products, glossary terms and domains there."
  - "Billing uses capacity units: each unit covers 25 operations per second and 10 GB of metadata. Accounts start at 1 and autoscale to 10."
  - "Microsoft's data governance overview says Unified Catalog and classic data governance are being retired, with no new accounts and maintenance mode through November 12, 2027."
faq:
  - q: "What is the Microsoft Purview Data Map?"
    a: "According to Microsoft Learn, the Data Map is the foundation for data discovery and data governance in Microsoft Purview. It captures metadata about data in analytics, SaaS and operational systems across hybrid, on-premises and multicloud environments. Built-in scanning and classification keep it up to date."
  - q: "What is the difference between the Data Map and the Unified Catalog?"
    a: "Microsoft Learn describes the Data Map as the technical layer that stores metadata gathered by scanning data sources. The Unified Catalog is the business-facing layer where stewards curate data and consumers find data products. Both hold only metadata, and neither grants access to the underlying data."
  - q: "How is the Purview Data Map billed?"
    a: "Microsoft Learn says the Data Map is billed hourly, based on the highest number of capacity units needed in that hour, with a minimum of 1. Each capacity unit includes 25 operations per second and 10 GB of metadata storage. If storage exceeds the current unit, the next unit is billed even when throughput is unused."
  - q: "Is the Purview Data Map being retired?"
    a: "A notice on the Microsoft Learn data governance overview says Unified Catalog and classic Purview data governance capabilities, formerly Azure Purview, are being retired as Microsoft consolidates data governance in Microsoft Fabric. It says new accounts can no longer be created and existing capabilities stay in maintenance mode through November 12, 2027. The Data Map capacity page I read carries no such notice, so check the linked announcement before you plan a rollout."
  - q: "Does the Data Map give people access to my files and tables?"
    a: "No. Microsoft Learn states that all data in the Data Map and Unified Catalog is metadata, not the underlying data, and that none of the roles or permissions in either solution provide access to the underlying data."
---

The Microsoft Purview Data Map is a metadata inventory. It scans your data sources, records what exists and what it contains, and keeps that record current so people can find and govern data. It does not copy or open your data for users. One caution before you start: Microsoft's data governance overview now carries a retirement notice, covered near the end of this article.

## Where the Data Map sits in Purview

Microsoft Learn describes Microsoft Purview as a set of solutions to govern, protect and manage data, delivered through the Microsoft Purview portal. It groups them into three areas:

- **Data security**, for example Data Loss Prevention, Information Protection and Insider Risk Management.
- **Data governance**, which lists the Data Map and the Unified Catalog.
- **Data compliance**, for example Audit, eDiscovery, Compliance Manager and Records Management.

Sensitivity labels, classifiers and connectors are shared capabilities used across several of these. The Data Map belongs to the governance area, so it is a different job from labeling files in Microsoft 365.

## What the Data Map does

Microsoft Learn calls the Data Map the foundation for data discovery and data governance. It captures metadata about data in analytics systems, SaaS applications and operational systems, across hybrid, on-premises and multicloud setups. Built-in scanning and classification keep it up to date.

The metadata falls into a few groups: technical metadata such as schemas, data types and columns, semantic metadata such as classifications and collection mappings, operational metadata such as lineage run statuses, and business metadata such as descriptions and glossary terms.

One rule matters for security reviews. Microsoft states that all data in the Data Map and Unified Catalog is metadata. None of the permissions in either solution provide access to the data itself.

## Data Map versus Unified Catalog

The two products are often confused. Microsoft's planning guidance separates them this way:

- The **Data Map** is the technical layer. It stores metadata about assets gathered by scanning sources.
- The **Unified Catalog** is the business-facing layer. Data stewards curate data there and consumers find data products.

In the Unified Catalog, the main objects are governance domains (for example Marketing or Finance), data products, glossary terms, critical data elements, OKRs and data quality scores. The Data Map feeds it. Registering and scanning sources happens in the Data Map, and data products are built in the Unified Catalog.

## How scanning fills the Data Map

A scan connects to a data source and captures technical metadata such as names, file size and columns. For structured sources it extracts the schema and applies classifications. If the Data Map is connected to the Microsoft Purview portal, it also applies sensitivity labels. Ingestion then analyzes the scan output, applies resource set patterns, adds available lineage and loads the Data Map. Assets can be curated only after ingestion finishes.

Each scan has a level:

| Level | What it extracts |
|---|---|
| L1 | Basic metadata such as file name, size and fully qualified name |
| L2 | Schema for structured file types and database tables |
| L3 | Schema where applicable, plus sampling and classification |

Auto detect is the default and applies the highest level the source supports. For Azure SQL Database that is Level 3. Custom scan levels are available only on the Azure integration runtime and the Managed Virtual Network integration runtime v2.

A **scan rule set** defines which file types and classifications a scan looks for. Many sources have system rule sets, and custom ones are possible. Scans can run once or on a daily, weekly or monthly schedule. Microsoft suggests daily or weekly for sources under active development and monthly for sources that change rarely.

For credentials, Microsoft recommends a managed identity where possible, because it avoids storing credentials for each source. Purview itself does not store passwords or secrets directly.

Deletion is detected by comparing the last scan with the current one, so several successful scans may be needed before deleted assets are resolved.

## Capacity units and billing

The Data Map is billed in capacity units (CU). Each CU represents operations throughput and metadata storage:

- 25 operations per second per CU
- 10 GB of metadata storage per CU
- Every account starts at 1 CU and autoscales up to 10 CU by default
- There is no default limit on metadata storage

Operations include creating an asset, adding a relationship, editing business metadata and running a keyword search. Billing is hourly, based on the highest CU needed in that hour, with a minimum of 1. Storage can drive cost on its own: at 25 operations per second and 15 GB, you are billed for 2 CU. Microsoft's six-hour example adds up to 22 capacity-unit hours.

To watch usage, open **Microsoft Purview accounts** in the Azure portal, select the account and check **Monitoring** on the **Overview** page. For more detail, go to **Monitoring** > **Metrics** and pick **Data Map Capacity Units** or **Data Map Storage Size**. Alerts can be created from the same page.

Microsoft's cost tips are practical: use incremental scans after the first full scan, limit scan scope, stagger schedules, reduce frequency if freshness allows, turn off lineage extraction you do not need, and clean up historical lineage.

## A sensible order for getting started

Microsoft's get-started page lists these basic setup steps for data governance, after the prerequisites of a Purview Enterprise instance and registered, scanned data sources:

1. Assign the Data Governance Administrator role.
2. Build governance domains: assign the governance domain creator role, create at least one domain and assign at least one domain owner.
3. Register and scan data sources in the Data Map.
4. Build data products: assign data product owners and create at least one data product.
5. Grant catalog reader access in the governance domains so users can explore the data products.

The planning page gives a similar order and also names creating a collection in the Data Map and adding a data source administrator before the first scan. It suggests starting with the stakeholders who care most about data governance, such as business intelligence or data lake teams, rather than the whole organization.

## Retirement notice and what the sources do not settle

The Microsoft Learn data governance overview opens with this message: Unified Catalog and classic Microsoft Purview data governance capabilities, formerly Azure Purview, are being retired, and Microsoft is consolidating its data governance capabilities in Microsoft Fabric. It adds that new accounts can no longer be created and that existing capabilities stay in maintenance mode through November 12, 2027.

The sources disagree in tone. The Data Map capacity page I read still describes creating an account in the Azure portal and carries no retirement notice, and the planning page shows none either. The full announcement that the overview links to could not be read for this article. Before you build on the Data Map, read that announcement, check how your tenant is set up, and ask Microsoft what the Fabric path means for your sources.

## Related

- [Purview Data Map](https://www.m365.fm/entity/purview-data-map/)
- [Microsoft Purview](https://www.m365.fm/entity/purview/)
- [Purview Unified Catalog](https://www.m365.fm/entity/purview-unified-catalog/)
- [Data governance](https://www.m365.fm/entity/data-governance/)

## Sources

- [Microsoft Learn: Microsoft Purview Data Map](https://learn.microsoft.com/en-us/purview/data-map)
- [Microsoft Learn: Learn about Microsoft Purview](https://learn.microsoft.com/en-us/purview/purview)
- [Microsoft Learn: Data governance overview](https://learn.microsoft.com/en-us/purview/data-governance-overview)
- [Microsoft Learn: Data governance plan](https://learn.microsoft.com/en-us/purview/data-governance-plan)
- [Microsoft Learn: Scans and ingestion in the Data Map](https://learn.microsoft.com/en-us/purview/data-map-scan-ingestion)
- [Microsoft Learn: Get started with data governance](https://learn.microsoft.com/en-us/purview/data-governance-get-started)
- [Microsoft Learn: Unified Catalog](https://learn.microsoft.com/en-us/purview/unified-catalog)
