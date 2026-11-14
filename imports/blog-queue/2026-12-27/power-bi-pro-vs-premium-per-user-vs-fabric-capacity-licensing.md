---
title: "Power BI Pro vs Premium Per User vs Fabric Capacity: Which License Model Fits"
summary: "Compare Power BI Pro, Premium Per User and Fabric F capacity using Microsoft Learn: what each provides, who needs a license to view content, F64 as the free viewer threshold, the SKU mapping and the stated retirement of Power BI Premium per-capacity SKUs."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [power-bi-pro, power-bi-premium-per-user, fabric-capacity]
keypoints:
  - "On F SKUs smaller than F64, each viewer of Power BI content needs Pro, PPU or an individual trial. On F64 or larger, users with only a Free license and a viewer role can view Power BI content."
  - "Premium Per User gives most Premium features per user but does not provision a Fabric capacity, so non-Power BI Fabric items still need an F or Trial capacity."
  - "Learn says PPU is more cost effective when Power BI Premium features are needed for fewer than 250 users."
  - "Microsoft is consolidating purchase options and retiring the Power BI Premium per-capacity SKUs. The page gives no retirement date."
  - "F capacity is billed through Azure per second with a one-minute minimum. A Fabric trial lasts 60 days with 64 CUs."
faq:
  - q: "Who can view Power BI content without Pro?"
    a: "According to Microsoft Learn, on F64 or larger, users with only a Fabric (Free) license and a viewer role can view Power BI content. On F SKUs smaller than F64, each viewer needs Pro, PPU or an individual trial."
  - q: "Does Premium Per User include Fabric capacity?"
    a: "No. Learn says PPU does not provision a Fabric capacity, so non-Power BI Fabric items still require an F or Trial capacity."
  - q: "When is PPU the better value?"
    a: "Learn says PPU is more cost effective when Power BI Premium features are needed for fewer than 250 users."
  - q: "Are Power BI Premium P SKUs going away?"
    a: "Learn says Microsoft is consolidating purchase options and retiring the Power BI Premium per-capacity SKUs, and that new and existing customers should consider F SKUs. No date is given on the page."
  - q: "How is Fabric F capacity billed?"
    a: "Through Azure per second with a one-minute minimum, with regional pricing and an option of a yearly capacity reservation. The page gives no prices."
---

The right Power BI license model depends on who creates content, who only views it and whether you need Fabric items beyond Power BI. This article restates the Microsoft Learn page on Fabric licenses and keeps to what it says. It gives no prices, because the page gives none.

## The options

| Option | What it provides | Who needs a license |
| --- | --- | --- |
| F capacity | Compute for all Fabric experiences, including lakehouses, warehouses, notebooks and pipelines. Recommended for Fabric. Billed through Azure per second, one-minute minimum. | Creators need a per-user license. Free users can view Power BI content only on F64 or larger. |
| P capacity | Power BI Premium and Fabric items once Fabric is enabled. Only for customers with an active Enterprise Agreement, billed monthly or yearly. | Viewers need a Fabric (Free) license with a viewer role. Other roles need Pro or PPU, or an individual trial. |
| Pro | Share Power BI content and collaborate on reports, dashboards and scorecards. | At least one user with Pro or PPU if the organization uses Power BI within Fabric. |
| Premium Per User | Most Premium features per user, including dataflows, datamarts, 48 refreshes per day, semantic models over 1 GB and the XMLA endpoint. | Per user. Does not provision a Fabric capacity. |
| Free | Granted on first Fabric sign-in if Fabric is enabled. Lets users create and share non-Power BI Fabric items in F or Trial capacity workspaces. | Automatic |
| Trial | 60 days with 64 CUs, equivalent to F64. | A Fabric (Free) license |

## Viewing rules

- On F SKUs smaller than F64, each viewer of Power BI content needs Pro, PPU or an individual trial.
- On F64 or larger, users with only a Free license and a viewer role can view Power BI content.
- On P SKUs, viewers need a Fabric (Free) license with a viewer role.
- For embedding in the "Embed for your organization" scenario, F SKUs smaller than F64 and all A SKUs require each consuming user to have Pro, PPU or an individual trial. "App owns data" scenarios work with unlicensed end users and a service principal.

## SKU mapping

Capacity units (CUs) measure compute. The page says its table is a compute reference, not a statement of functional or licensing equivalence.

| SKU | CUs | Power BI SKU | Power BI v-cores |
| --- | --- | --- | --- |
| F2 | 2 | none | 0.25 |
| F4 | 4 | none | 0.5 |
| F8 | 8 | EM/A1 | 1 |
| F16 | 16 | EM2/A2 | 2 |
| F32 | 32 | EM3/A3 | 4 |
| F64 | 64 | P1/A4 | 8 |
| F128 | 128 | P2/A5 | 16 |
| F256 | 256 | P3/A6 | 32 |
| F512 | 512 | P4/A7 | 64 |
| F1024 | 1024 | P5/A8 | 128 |

The table continues to F2048, F4096 and F8192.

## Retirement of P SKUs

The page states that Microsoft is consolidating purchase options and retiring the Power BI Premium per-capacity SKUs, and that new and existing customers should consider F SKUs instead. It gives no retirement date and no migration steps.

## Pricing mentions

F capacity pricing is regional, billed per second with a one-minute minimum, with an option of a yearly capacity reservation. An Azure capacity can be used without commitment. P capacities require an active Enterprise Agreement. Fabric capacity can also be bought through a Cloud Solution Provider.

## How to choose

This approach is my advice, built from the table, not a Microsoft recommendation.

1. If you need only Power BI and have few creators, compare Pro with PPU. The page says PPU is more cost effective when Premium features are needed for fewer than 250 users.
2. If you have many viewers, consider an F64 or larger capacity, because Free users can then view Power BI content. You still need per-user licenses for creators.
3. If you need lakehouses, warehouses or pipelines, you need an F or Trial capacity, even with PPU.
4. If you are on P SKUs, read the retirement note and plan with your licensing partner.

## Not covered

The page does not give prices, the size of reservation savings, retirement dates or migration steps for P SKUs, Enterprise Agreement terms, detailed trial limits or detailed Power BI Embedded terms. It links to purchase, Pro, PPU and Premium FAQ pages.

## Related

- [Power BI Pro](https://www.m365.fm/entity/power-bi-pro/)
- [Power BI Premium Per User](https://www.m365.fm/entity/power-bi-premium-per-user/)
- [Fabric capacity](https://www.m365.fm/entity/fabric-capacity/)

## Sources

- [Understand Microsoft Fabric licenses and capacity (Microsoft Learn)](https://learn.microsoft.com/fabric/enterprise/licenses)
