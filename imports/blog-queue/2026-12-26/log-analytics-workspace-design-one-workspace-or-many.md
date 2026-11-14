---
title: "Log Analytics Workspace Design: One Workspace or Many"
summary: "Decide between one Log Analytics workspace and several using Microsoft Learn's criteria: operational and security data, tenants, regions, data ownership, billing, retention, commitment tiers, access control and resilience, with the figures the page gives."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [azure-monitor]
keypoints:
  - "Learn recommends starting with a single workspace and using the fewest workspaces that meet your requirements. Data volume does not limit performance."
  - "Use separate workspaces for multiple Microsoft Entra tenants, for data residency or compliance across regions, and for data segregation by owner."
  - "Consolidating data helps reach a commitment tier. At 100 GB per day or more the page recommends a dedicated cluster."
  - "A workspace with Microsoft Sentinel gets three months of free retention instead of 31 days, and all its data is subject to Sentinel pricing."
  - "Use resource-context or table-level RBAC to restrict access inside one workspace instead of splitting it."
faq:
  - q: "Should I start with one workspace or many?"
    a: "According to Microsoft Learn, start with a single workspace. Managing and querying several adds complexity, and data volume does not limit performance. Use the fewest workspaces that meet your requirements."
  - q: "When do I need separate workspaces per region?"
    a: "Learn says to use a separate workspace per region if you have data residency or compliance requirements. Otherwise use a single workspace, and create a workspace per region with VMs only if bandwidth charges are significant."
  - q: "Why consolidate for cost?"
    a: "Consolidating data into one workspace helps reach a commitment tier. The same volume split across workspaces is not eligible unless you use a dedicated cluster. At 100 GB per day or more, Learn recommends a dedicated cluster."
  - q: "How do I restrict access without more workspaces?"
    a: "Use resource-context RBAC, the default mode, or table-level RBAC. Learn says workspace access grants access to all data in the workspace."
  - q: "What about multiple tenants?"
    a: "Learn says single tenant means one workspace and multiple tenants means one workspace per tenant. It describes distributed, centralized and hybrid strategies for service providers."
---

For most environments, one Log Analytics workspace is the right starting point. You split only when a concrete requirement forces it. This article follows the Microsoft Learn workspace design guidance and keeps to the figures it gives.

## The core rule

Start with a single workspace. Managing and querying multiple workspaces adds complexity, and data volume does not limit performance because many services and data sources can send data to the same workspace. Use the fewest workspaces that meet your requirements. Some criteria conflict, so weigh each one and your priorities.

## Criteria and what Learn recommends

| Criterion | Guidance |
| --- | --- |
| Operational and security data | Separate workspaces let teams own their data, but a combined workspace gives better cross-data visibility and can reach a commitment tier. With Microsoft Sentinel enabled, all data in the workspace is subject to Sentinel pricing. Use table-level or resource-context RBAC to restrict security data in a combined workspace. |
| Microsoft Entra tenants | One workspace for a single tenant, one per tenant for several. |
| Azure regions | A workspace per region for data residency or compliance. Otherwise one workspace. Bandwidth charges are usually minor compared with ingestion costs. |
| Data ownership | A workspace per owner only if you require data segregation. |
| Split billing | Cost Management and Billing shows charges by workspace, and a log query can show billable volume by resource, resource group or subscription. Use a workspace per cost owner only if that is not enough for charge-back. |
| Retention | Default retention can be set per workspace and per table. Use separate workspaces only when resources sending to the same table need different retention. |
| Commitment tiers | One workspace helps reach a tier. At 100 GB per day or more, use a dedicated cluster, which can combine data from several workspaces. |

## Figures from the page

- The example of about 50 GB per day each for operational and security data, combined into a 100 GB per day tier, gives a 15% discount for Azure Monitor and a 50% discount for Sentinel.
- A workspace with Microsoft Sentinel gets three months of free retention instead of 31 days.
- Cross-workspace queries in a distributed architecture cannot scale above 100 workspaces.

## Agents

Azure Monitor Agent and the Log Analytics agent for Windows can connect to multiple workspaces. The Log Analytics agent for Linux supports only one workspace, so migrate to Azure Monitor Agent or make sure Linux machines need access to only one workspace. Avoid sending duplicate data to several workspaces because of extra charges.

## Access control

Workspace access grants access to all data in the workspace, which suits central admin or security teams. In resource-context mode, the default setting **Use resource or workspace permissions** lets users access data for resources they can read. To require explicit workspace permissions, switch to **Require workspace permissions**. Table-level RBAC grants or denies access to specific tables, for example giving an auditing team access only to certain Sentinel tables.

## Resilience

For region-failure protection, ingest critical data into workspaces in different regions. You must then manage integrations separately for each workspace, and alerts and workbooks do not switch automatically. The page suggests storing ARM templates with alternate-workspace configuration, or disabled policies that you can enable during failover.

## Multiple tenants

- **Distributed:** one workspace per Entra tenant. The only option for monitoring non-VM Azure services. Access through Azure Lighthouse or Entra B2B guest users. Disadvantages include slow cross-workspace queries and query audit visibility to workspace admins.
- **Centralized:** one workspace in the provider's subscription. Collection is limited to VMs with agents and Azure PaaS through Lighthouse, data separation is harder and everything shares one region, one bill and one retention setting.
- **Hybrid:** each tenant keeps a workspace and data is pulled to a central workspace through the Query API with the logs ingestion API, Logic Apps, data export or summary rules.

## A decision path

This path is a suggestion built from the criteria, not a Microsoft flowchart.

1. Default to one workspace.
2. Split for tenants, data residency, true data ownership separation or different retention on the same table.
3. Before you split for cost or access, check whether commitment tiers, resource-context RBAC or table-level RBAC solve it.
4. Review again when volume nears 100 GB per day.

## Not covered

The page does not give commitment tier prices, the full Sentinel pricing model, bandwidth rates, limits beyond the 100-workspace query guidance or step-by-step configuration. It links to cost documentation for those.

## Related

- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Design a Log Analytics workspace architecture](https://learn.microsoft.com/azure/azure-monitor/logs/workspace-design)
