---
title: "OneLake Catalog: Find and Govern Data in Microsoft Fabric"
summary: "How the OneLake catalog works: the Explore, Govern and Secure tabs, filters, governance insights, recommended actions, and the limits that Microsoft Learn lists, with steps to open and use each tab."
status: review
publish: false
author: mirko-p
date: 2026-12-05
topics: [onelake, fabric, data-governance, fabric-workspace]
keypoints:
  - "The OneLake catalog opens from the OneLake icon in the Fabric navigation pane and has three tabs: Explore, Govern and Secure."
  - "Explore lists the Fabric items you can access, with filters for domain, item type, tags, workspace and endorsement."
  - "Govern shows governance insights and recommended actions, in an estate view for tenant-wide users and a My items view for data owners."
  - "Govern data refreshes once a day, and it does not support cross-tenant scenarios, guest users or Private Link-enabled tenants."
  - "Browsing objects such as tables needs Read or higher control-plane permission on the item."
faq:
  - q: "What is the OneLake catalog?"
    a: "According to Microsoft Learn, the OneLake catalog is the central place in Microsoft Fabric for discovering data, understanding governance status and managing security. You open it from the OneLake icon in the Fabric navigation pane, and it has three tabs: Explore, Govern and Secure."
  - q: "Which items does the Explore tab show?"
    a: "Microsoft Learn says it lists all Fabric items you have access to or can directly request access to. It also includes semantic models configured as discoverable. Columns show name, type, owner, refreshed time, location, endorsement and sensitivity label."
  - q: "What does the Govern tab do?"
    a: "Microsoft Learn describes it as the place to assess governance status, act on recommendations and reach governance and admin tools. It has governance insights and recommended actions, and an estate view for tenant-wide visibility and a My items view for data owners."
  - q: "How current are the governance insights?"
    a: "For the estate view, Microsoft Learn says insights, recommendations and reports reflect data that refreshes once a day, so changes can take up to a day to appear. The My items report is refreshed each time you open Govern, and you can select Refresh for the latest data."
  - q: "What are the known limits of the Govern tab?"
    a: "Microsoft Learn lists cross-tenant scenarios, guest users and Private Link-enabled tenants as not supported. Subitems such as tables do not appear in insights, third-party workload items are not in the View more charts, and the estate semantic model is read-only and cannot be used with Fabric data agents."
---

The OneLake catalog is where people in Microsoft Fabric find data, check how well it is governed and review who can reach it. It opens from the OneLake icon in the Fabric navigation pane and is split into three tabs: Explore for finding items, Govern for governance health and recommended actions, and Secure for roles and permissions. This article walks through each tab based on Microsoft Learn and notes the limits the pages list.

## Open the catalog

Select the **OneLake catalog** icon in the Fabric navigation pane. **Explore** opens by default. The catalog is also available as an embedded experience in Microsoft Teams, Microsoft Excel and Microsoft Copilot Studio, and catalog metadata can be searched across workspaces with the Microsoft Fabric Catalog Search REST API.

## Explore: find and inspect items

Explore surfaces lakehouses, warehouses, Fabric databases, mirrored items and other supported types. The list shows the items you have access to or can request access to. It also includes semantic models set as discoverable.

| Column | Meaning |
|---|---|
| Name | Item name, opens the details |
| Type | Item type |
| Owner | Item owner |
| Refreshed | Last refresh, rounded to hour, day, month or year |
| Location | Workspace |
| Endorsement | Endorsement status |
| Sensitivity | Sensitivity label, if set |

**Narrow the list:**

- **Domain selector:** if your organization defines domains, pick a domain or subdomain. The choice persists across sessions.
- **Predefined filters:** All Items, My items, Endorsed items (certified first, then promoted) and Favorites.
- **Item type category:** data types such as lakehouses and semantic models, or insight types such as reports and dashboards.
- **Tags selector:** appears only if tags are enabled in your organization.
- **Workspaces filter:** select a workspace to list its items.

**Inspect an item:** select it to open details beside the list. Details include metadata, lineage and permissions. Use **More options (...)** for settings and permissions, or **Open** to open the item.

**Browse inside an item:** items with an expand arrow can be browsed down to tables and columns. This needs Read or higher control-plane permission on the item.

Learn also describes an AI Auto-Summary for semantic models, labeled preview. It needs the right Copilot capacity and permissions.

## Govern: see the health of your data

Govern is the place to understand governance status and act on it. Learn says it is rolling out by region. Where it is not available, use the Admin portal. Open it from the OneLake catalog, or from the settings gear with **OneLake Catalog | Govern**.

There are two views:

| | All data in Fabric | My items |
|---|---|---|
| Scope | Tenant-wide metadata | Items you own |
| Default for | Users with tenant-wide visibility | Data owners |
| Refresh | Daily, from Admin Monitoring Storage | Each time you open Govern, or select Refresh |

**Governance insights.** The estate "View more" report has three tabs: manage your data estate, protect, secure and comply (sensitivity labels and DLP), and discover, trust and reuse (freshness, curation state, description and endorsement coverage, content sharing).

**Recommended actions.** Shown as cards. Each card explains the issue, why it matters and how to resolve it.

**Governance features reachable from Govern:** domains, tags, endorsement, metadata scanning, cross-tenant sharing discovery and policies. Admin items such as capacities, workspaces, tenant settings and Fabric identities are surfaced there as well. What you see depends on your role, so a user without admin rights sees only configuration help entries if enabled.

## Secure: roles in one view

Secure gives a unified view of workspace roles and OneLake security roles across items. Admins can review access, audit permissions, view user access, and create, edit or delete security roles.

## Limits to plan around

- Govern does not support cross-tenant scenarios, guest users or Private Link-enabled tenants.
- Estate data refreshes once a day.
- Subitems such as tables do not appear in insights, and third-party workload items are not in the View more charts.
- Users viewing the Admin Monitoring workspace need a Power BI Pro license unless the workspace is on a capacity.
- Do not modify the autogenerated report or semantic model. Copy the report and edit the copy.
- Streaming semantic models are not shown in Explore, because real-time streaming in Power BI has been retired.

## A simple routine for data owners

1. Open Explore and select **My items**.
2. Check endorsement and sensitivity columns for gaps.
3. Open Govern, switch to My items and read the recommended action cards.
4. Fix one card per week, starting with missing descriptions or unlabeled items.

## Typical mistakes

- Expecting live numbers in the estate view. It is a daily snapshot.
- Editing the autogenerated governance report instead of copying it.
- Assuming every user sees all admin options in Govern. Roles decide.
- Treating discoverable as the same as accessible. Browsing objects still needs Read permission.

## What the pages do not say

The overview does not state who may use the catalog or which licenses are required beyond the points above, and it does not detail endorsement, tags or data insights.

## Related

- [OneLake](https://www.m365.fm/entity/onelake/)
- [Microsoft Fabric](https://www.m365.fm/entity/fabric/)
- [Data governance](https://www.m365.fm/entity/data-governance/)
- [Fabric workspace](https://www.m365.fm/entity/fabric-workspace/)

## Sources

- [OneLake catalog overview (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/governance/onelake-catalog-overview)
- [Discover and explore Fabric items in the OneLake catalog (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/governance/onelake-catalog-explore)
- [Govern your data in Fabric (Microsoft Learn)](https://learn.microsoft.com/en-us/fabric/governance/onelake-catalog-govern)
