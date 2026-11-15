---
title: "Fabric IQ and Planning in Microsoft Fabric Explained"
summary: "What Fabric IQ is, how its three layers and items fit together, and what Planning adds: ontology, graph, data agent and operations agent, based on Microsoft Learn, with open points listed."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [fabric-iq, fabric, ontology, onelake]
keypoints:
  - "Fabric IQ is the part of Microsoft IQ that covers business entities and data. Work IQ and Foundry IQ cover other context."
  - "It has three layers: unified data on OneLake, business intelligence on Power BI semantic models, and operational intelligence through ontology."
  - "The IQ workload groups ontology, semantic model, planning, graph, data agent and operations agent. Ontology is labeled preview."
  - "Planning is an EPM and CPM solution in Fabric for budgets, forecasts and scenarios, with planning, PowerTable and intelligence sheets plus Infobridge."
  - "Planning needs semantic models on a Fabric F SKU or Premium P capacity with XMLA endpoints on. The IQ overview itself lists no prerequisites or limits."
faq:
  - q: "What is Fabric IQ?"
    a: "According to Microsoft Learn, Fabric IQ is part of Microsoft IQ, the enterprise intelligence layer of the Microsoft stack. It provides context on the state of the business by raising data to the language of the business. Work IQ covers how employees work, Foundry IQ covers policies and documents, and Fabric IQ covers business entities and data."
  - q: "What is an ontology in Fabric IQ?"
    a: "Microsoft Learn describes the ontology, labeled preview, as a shared machine-understandable representation of the business. It defines entity types, properties, relationships, rules and metrics, bound to live enterprise data. It can be created from scratch, generated from a Power BI semantic model, generated with the ontology agent or imported from RDF or OWL."
  - q: "What is Planning in Fabric IQ?"
    a: "Learn describes Planning as an enterprise and corporate performance management solution inside Fabric for budgets, forecasts and scenarios. It includes planning sheets, PowerTable sheets, intelligence sheets and Infobridge. A note on the page says it is available worldwide as part of the Microsoft Fabric SKU, with new billing meters."
  - q: "Do I need Fabric IQ to use Power BI semantic models?"
    a: "No page I read says so. Learn lists the Power BI semantic model as one item that appears in both the IQ workload and the Power BI workload. It is the base of the business intelligence layer, and ontologies can be generated from semantic models already in production."
  - q: "What does the Fabric IQ overview not cover?"
    a: "The overview page does not describe prerequisites, tenant settings, required capacity, licensing, limitations or general availability dates. Those details sit on item-level pages. For Planning, the prerequisites page lists tenant and capacity settings and the known limitations page lists limits such as 25 sheets and 50 visuals per plan item."
---

Fabric IQ is Microsoft's layer in Fabric that gives data a business meaning, so people and AI agents work with the same definitions of customers, orders or assets. Planning is one of the items in that layer. It adds budgets, forecasts and scenarios on the same data. This article explains how the parts relate, based on Microsoft Learn, and marks what the pages do not say.

## Where Fabric IQ sits

Learn describes Fabric IQ as part of Microsoft IQ, a set of capabilities that form the enterprise intelligence layer of the Microsoft stack. The split is:

- **Work IQ:** how employees work.
- **Foundry IQ:** policies and authoritative documents.
- **Web IQ:** web context.
- **Fabric IQ:** business entities and data.

## The three layers

| Layer | Foundation | What it gives |
|---|---|---|
| Unified data | OneLake | One governed source across clouds and on-premises data, using shortcuts, mirroring and the OneLake catalog |
| Business intelligence | Power BI semantic models | Curated measures, hierarchies and dimensions |
| Operational intelligence | Ontology (preview) | Entity types, properties, relationships, rules and metrics tied to live data |

## The items in the IQ workload

Learn calls the IQ workload (preview) a grouping of related Fabric items for unifying and contextualizing business data.

| Item | What it does | Status shown on the page |
|---|---|---|
| Ontology | Shared business vocabulary that grounds AI agents | Preview |
| Power BI semantic model | Trusted KPIs and visuals | Not labeled preview |
| Planning | Planning, forecasting and reporting in a no-code experience | Not labeled preview |
| Graph | Stores and queries connected data, such as dependencies | Graph overview is labeled preview |
| Data agent | Natural-language answers for a domain | Not labeled preview |
| Operations agent | Watches real-time data and triggers governed responses | Not labeled preview |

OneLake is not an IQ item, but all items rely on OneLake tables.

## How the pieces connect

Learn states these relationships:

- **Ontology and semantic model:** a concept such as Customer is defined once and aligned across reports and agents.
- **Ontology and graph:** the ontology declares what connects and why, and the graph stores and traverses the connections.
- **Ontology and agents:** the ontology grounds agents so they can reason across domains and trigger governed actions.
- **Planning and semantic model:** dimensions and measures flow into planning sheets for plan-versus-actuals analysis and forecasting.

## What an ontology contains

Rules capture business logic in natural language. Metrics carry Power BI DAX measures from the source model into ontology context. An ontology can be built in four ways: from scratch, from a Power BI semantic model, with the built-in ontology agent, or by importing RDF or OWL. The ontology agent works in natural language and proposes changes for review under a proposal-first model. An optional built-in graph model can be generated from entities, relationships, rules and source bindings.

## What Planning adds

Learn describes Planning as an EPM and CPM solution in Fabric. It lets organizations create and analyze budgets, forecasts and scenarios on the platform used for data, analytics and AI. The suite has these parts:

- **Planning sheets:** budgeting, forecasting and scenario modeling in a spreadsheet-like experience.
- **PowerTable sheets:** structured planning at scale for large dimensional models.
- **Intelligence sheets:** insights and automated variance analysis.
- **Infobridge:** connects data across systems so planning data stays aligned with Fabric workloads.

Listed capabilities include what-if analysis, variance reporting, and automatic write-back of planning results to a SQL database in Fabric. A note says Planning is available worldwide as part of the Fabric SKU, in all supported Fabric regions.

## Planning prerequisites

The IQ overview lists no prerequisites, but the planning prerequisites page does. According to it:

- **Tenant settings.** A Fabric administrator enables **Allow XMLA endpoints and Analyze in Excel with on-premises semantic models** under Integration settings. For service principal authentication, **Service principals can call Fabric public APIs** under Developer settings must also be enabled.
- **Capacity.** Semantic models used in planning must be hosted on supported capacities, such as Power BI Premium P1, P2 and higher or Fabric F SKUs. Scenarios that rely on XMLA endpoints need F SKUs or Premium P1 to P5. Power BI Pro and Premium Per User are not supported for those scenarios, and some lower SKUs have XMLA and memory limits that prevent supported use.
- **XMLA endpoint.** In the capacity settings, the **XMLA Endpoint** setting must be **Read Only** or **Read Write**.
- **Optional database connections.** A Fabric SQL database connection shared with report viewers enables collaboration, and a writeback destination enables writing plan data back. When you create a plan item, a Fabric SQL database that stores the plan report's metadata is created in your workspace automatically.

## Known limitations of Planning

The known limitations page says supported limits can vary with client resources, Fabric capacity and Power BI XMLA query limits. Selected points:

- Each plan item connects to one semantic model and you cannot change it afterwards. Semantic models in My workspace are not supported.
- Renaming the connected semantic model or the workspace that contains a plan item breaks the item.
- Workspaces that use private links do not support plan items, while tenant-level private links are supported.
- A plan item supports up to 25 sheets and 50 visuals. Writeback supports up to 1.2 million cells per operation, and bulk data input up to 10 million rows.
- Deleting a row in a planning sheet does not delete the matching row in the destination Fabric SQL table.
- PowerTable has its own limits, for example 1,022 columns for bulk uploads, 5 million rows for sort and group by, and 30,000 rows for Gantt and Resource Layout.
- The page lists two known problems awaiting fixes: deployment pipelines fail when a plan item contains 100 Data Input items, and a "Something went wrong" error that may need up to 90 minutes before a retry.

## What the pages do not tell you

The IQ overview lists no prerequisites, licensing, capacity needs, limitations or general availability dates. The planning pages do not give meter names, rates or SKU prices either. I did not read the item-level pages for ontology, graph, the data agent or the operations agent in this check, so look at those before piloting them.

## A practical way to start

1. List the business entities your reports already agree on, such as Customer or Product.
2. Check which Power BI semantic models define their measures, since an ontology can start from them.
3. Check the XMLA tenant and capacity settings from the planning prerequisites page, and the known limitations.
4. Pilot one domain, and keep the preview labels in mind when you set expectations.

## Key terms in one place

- **Entity type:** a kind of business object defined in the ontology, such as Customer.
- **Property and relationship:** attributes of an entity type and the links between entity types.
- **Rule:** business logic written in natural language.
- **Metric:** a Power BI DAX measure carried from a source model into ontology context.
- **Data binding:** the link from an ontology definition to live data, which the ontology agent can propose.
- **Graph:** the store that traverses connections, for impact chains, dependencies and shortest paths.

Learn lists three benefits: cross-domain reasoning through graph links, faster onboarding because concepts are declared once, and governance through consistent semantics and constraints. The page gives a supply chain example, Order to Shipment to Temperature Sensor to Cold Chain Breach, to show the reasoning across domains. Treat these as stated intentions of the platform. The overview page does not include measured results.

## Related

- [Fabric IQ](https://www.m365.fm/entity/fabric-iq/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Ontology](https://www.m365.fm/entity/ontology/)
- [OneLake](https://www.m365.fm/entity/onelake/)

## Sources

- [What is Fabric IQ? (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/iq/overview)
- [Planning in Fabric IQ overview (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/iq/plan/overview)
- [Prerequisites for Planning (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/iq/plan/overview-prerequisites)
- [Known Limitations in Planning (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/iq/plan/overview-limitations)
