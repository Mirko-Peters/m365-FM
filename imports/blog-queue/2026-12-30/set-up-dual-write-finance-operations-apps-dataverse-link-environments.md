---
title: "Set Up Dual-Write Between Finance and Operations Apps and Dataverse: Link, Sync and Pitfalls"
summary: "Set up dual-write between finance and operations apps and Dataverse using Microsoft Learn: what dual-write is, the six setup scenarios, the Lifecycle Services link steps, initial sync and company bootstrapping, the DW9003 permissions error and what the pages do not state."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [dual-write, dynamics-365, dataverse]
keypoints:
  - "Dual-write is near-real-time, bidirectional integration. Any data change in finance and operations apps writes to Dataverse and any change in Dataverse writes back."
  - "Complete the Power Platform integration for a new or existing Dataverse instance first, then in Lifecycle Services use Dual-write application, Configure, and Link to Power Platform environment."
  - "Setup typically takes 30 minutes or less, and linking typically takes less than five minutes. Fix any setup error before the next step."
  - "Before starting dual-write on an entity, run an initial sync for existing data. For existing Dataverse data, bootstrap company data with a three-letter ISO company code."
  - "The only prerequisite named is the Power Platform integration, with no role list or limits. DW9003 means the application user lacks permissions on Dataverse or finance and operations."
faq:
  - q: "What is dual-write?"
    a: "According to Microsoft Learn, an out-of-box infrastructure for near-real-time, bidirectional integration between customer engagement apps and finance and operations apps."
  - q: "Where do I enable it?"
    a: "On the Environment Details page in Lifecycle Services, expand Power Platform Integration, select Dual-write application, review the terms, select Configure, then after setup select Link to Power Platform environment."
  - q: "How long does setup take?"
    a: "Learn says setup typically takes 30 minutes or less, and creating the link typically takes less than five minutes."
  - q: "How do I bring existing data across?"
    a: "Run Initial sync for the tables you want. For existing Dataverse data into a new finance and operations company, bootstrap the data using a three-letter ISO company code."
  - q: "What does error DW9003 mean?"
    a: "Learn says it means Failed to connect to CRM or AX, because the application user for dual-write lacks the right permissions. It points to the system requirements and prerequisites article."
---

Dual-write links Dynamics 365 finance and operations apps with Dataverse, so data changes flow both ways in near real time. This guide combines three Microsoft Learn pages: the dual-write overview, the guidance for setup scenarios and the Lifecycle Services setup article. Beyond completing the Power Platform integration they give no prerequisites list, same-tenant rule or role requirements (the Lifecycle Services page points to a separate system requirements article), and this article says so rather than guessing.

## What it is

Learn describes dual-write as an out-of-box infrastructure with synchronous and bidirectional data flow, play, pause and catchup modes, an initial data sync, combined logs, custom alerts and extensibility for standard and custom tables and maps. It installs two Marketplace solutions on Dataverse. Learn lists changes for developers, among them the company and party concepts, unified activities and notes, an opt-in currency precision of up to 10 decimal places, date effectivity and product unit conversions.

## Which apps are covered

Finance and operations apps in the guidance are Dynamics 365 Finance, Supply Chain Management, Commerce and Human Resources. Customer engagement apps are Sales, Customer Service, Field Service, Marketing and Project Service Automation. The Human Resources module in Dynamics 365 Finance supports dual-write connections, but the Dynamics 365 Human Resources app does not.

## Link the environments in Lifecycle Services

First complete the Power Platform integration, either with a new Dataverse instance or with an existing one, using the linked Learn articles. Then:

1. On the **Environment Details** page expand **Power Platform Integration**.
2. Select **Dual-write application**.
3. Review the terms and conditions, select **Configure**, then **OK**.
4. Refresh the page to monitor progress. Setup typically takes 30 minutes or less. On failure, fix the error before continuing.
5. Select **Link to Power Platform environment**. It typically takes less than five minutes.
6. Use the hyperlink that appears to open the dual-write administration area and set up entity mappings.

## Six setup scenarios

| Scenario | What Learn says |
| --- | --- |
| New finance and operations plus new customer engagement | Setup provisions both empty, installs the CRM prime solution, creates the connection for DAT company data and enables table maps |
| New finance and operations plus existing Dataverse | Create a new company, add it to the connection, bootstrap Dataverse data with a three-letter ISO company code, run Initial sync |
| New finance and operations with data plus new customer engagement | Finish scenario one, then in Data Management, Dual-write run Initial sync |
| New with data plus existing | Finish scenario two, then run the sync from finance and operations |
| Existing plus new customer engagement | Link through Lifecycle Services, the connection covers all legal entities, remove entities you want excluded, run Initial sync |
| Existing plus existing | Link, bootstrap Dataverse data, run Initial sync |

Initial sync copies existing data from one app to another bidirectionally, and you can skip it if you do not need to sync existing data.

## Errors and warnings

- **Linking mismatch:** if dual-write points to a different Dataverse instance than Power Platform Integration in Lifecycle Services, Learn warns of unexpected behavior. If Lifecycle Services was already set up for Power Platform integration, reset the dual-write connection to the one it specifies. If it was never set up, connect it to the Dataverse instance that is configured in dual-write.
- **DW9003:** Failed to connect to CRM or AX, caused by an application user without the right permissions.
- **Development environments:** Learn says Power Platform integration for cloud-hosted development environments is deprecated and not supported. Use a Sandbox environment or a Unified Developer Environment.

## Planning suggestion

This section is a suggestion, not Microsoft guidance. Decide which legal entities should be in scope before linking, because the connection covers all legal entities by default for existing environments, and review initial sync volumes before running them.

## What dual-write is used for

Learn lists application scenarios such as an integrated customer master and vendor master, unified product mastering, organization hierarchy awareness, finance and tax reference data, an on-demand price engine, prospect-to-cash, procure-to-pay and project-to-cash, integrated activities and notes, on-hand inventory lookup, and multiple addresses and roles through the party concept. It also says the approach is no-code or low-code, with minimal engineering effort to extend standard table maps or add custom maps, and that it supports online and offline modes.

## Initial sync and company data

Initial sync handles data that exists before dual-write starts. For Dataverse data that must reach a new finance and operations company, the guidance says to create the company, add it to the connection setup, bootstrap the Dataverse data using a three-letter ISO company code, and then run Initial sync for the tables you want. For finance and operations data going to Dataverse, run Initial sync from Data Management, Dual-write.

## Not covered

Apart from the Power Platform integration prerequisite, the pages do not cover licenses, tenant requirements, roles for linking, default maps, limits or throttling, and do not explain conflict handling in the initial sync.

## Related

- [Dual-write](https://www.m365.fm/entity/dual-write/)
- [Dynamics 365](https://www.m365.fm/entity/dynamics-365/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Dual-write overview (Microsoft Learn)](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/dual-write-overview)
- [Guidance for dual-write setup (Microsoft Learn)](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/connection-setup)
- [Dual-write setup from Lifecycle Services (Microsoft Learn)](https://learn.microsoft.com/dynamics365/fin-ops-core/dev-itpro/data-entities/dual-write/lcs-setup)
