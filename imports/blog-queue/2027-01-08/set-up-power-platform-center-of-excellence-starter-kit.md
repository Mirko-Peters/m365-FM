---
title: "How to Set Up the Power Platform Center of Excellence Starter Kit"
summary: "Prerequisites and planning for the Power Platform CoE Starter Kit: identity and licenses, environments, DLP connectors, inventory data source options, Power BI files, upgrade cadence, and the note that the kit is no longer actively maintained."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [power-platform-center-of-excellence, power-platform-admin-center]
keypoints:
  - "Learn says the CoE Starter Kit is no longer actively maintained and its core capabilities are now part of the Power Platform admin center. Issues are not reviewed."
  - "Use a Power Platform service admin or global tenant admin with roles and licenses assigned directly and permanently. Dynamics 365 service admin is not supported."
  - "Plan two production environments with a database, one for testing and one for production, with the security group set to None."
  - "Import the core components managed solution first. Set the ProductionEnvironment variable to no in the test environment."
  - "Inventory comes from either cloud flows, which can slow down above 10,000 objects, or the experimental data export option."
faq:
  - q: "Is the CoE Starter Kit still maintained?"
    a: "Microsoft Learn says it is no longer actively maintained and that its core capabilities are now part of the Power Platform admin center. Issues are no longer reviewed or addressed."
  - q: "Who can set it up?"
    a: "A Power Platform service admin or global tenant admin. Learn says Dynamics 365 service admin is not supported, and roles and licenses must be assigned directly and permanently."
  - q: "How many environments do I need?"
    a: "Two production environments with a database, one for testing and one for production. The page says to use the default language English, add no sample apps and datasets, and set the security group to None."
  - q: "How is inventory collected?"
    a: "Either with data export (experimental preview) to Azure Data Lake Storage, or with cloud flows that crawl the tenant into Dataverse tables. Cloud flows are suitable for small to medium tenants and can slow down above 10,000 objects."
  - q: "How often should I upgrade?"
    a: "Learn says a new version is released monthly and that you should upgrade at least every three months, testing first in a dedicated test environment."
---

The Center of Excellence (CoE) Starter Kit is a set of Power Platform components for inventory, governance and nurture. Before you invest in it, note the first line of the Microsoft Learn setup page: the kit is no longer actively maintained, its core capabilities are now part of the Power Platform admin center, and issues are not reviewed. This guide covers what the setup page documents. The detailed import and wizard steps are on a linked page that was not read.

## Status of the kit

The page says the kit is no longer actively maintained. Potential security issues should be reported to the Microsoft Security Response Center. If you are starting fresh, check what the admin center already offers before you deploy the kit.

## Identity and roles

- The identity must be a Microsoft Power Platform service admin or a global tenant admin. Dynamics 365 service admin is not supported, because it cannot gather all environment types, for example Teams, and does not allow privilege escalation.
- Roles and licenses must be assigned directly and permanently.
- Configure MFA by following the recommended Conditional Access settings for Power Automate.

## Licenses

- Power Apps per user license (nontrial) and a Microsoft 365 license.
- Power Automate per user or per flow licenses (nontrial).
- Power BI Premium per user or per capacity, only if you use data export for inventory.
- Power BI Pro, if you share the report.
- An Office 365 mailbox that meets the Office 365 Outlook connector requirements.
- An Azure app registration with permission to read the Microsoft 365 audit log, only for usage collection and only with cloud flows for inventory.

## Environments

Create two production environments, one for testing and one for production:

- Create each with a database.
- Default language English.
- No sample apps and datasets.
- Security group None, because approval actions need makers to interact with the environment.

## DLP policy

The data policy must allow these connectors together in the business group: Approvals, Azure Resource Manager, HTTP, HTTP with Microsoft Entra ID (preauthorized), Microsoft Dataverse and Dataverse (legacy), Microsoft Teams, Office 365 Groups, Office 365 Outlook, Office 365 Users, Power Apps for Admins and for Makers, Power Automate for Admins and Management, Power Platform for Admins and V2, Power Query Dataflows, and RSS. Endpoint filtering cannot be applied to these connectors, and no other policy may conflict.

## Communication personas

Learn recommends three Microsoft 365 groups for Admin, Maker and User personas. Makers are added to the Maker group automatically during inventory setup, so the setup account must own that group. Approvals and Teams adaptive cards cannot go to groups, so name an individual admin.

## Core components

- Download the solution and Power BI files from the aka.ms download link on the page.
- Import the managed core components solution into a production environment. Governance and nurture components depend on it.
- In the test environment, set the environment variable **ProductionEnvironment** to no, so tests do not email makers or users.
- The page refers to a setup wizard and to a separate page for the full steps.

## Inventory data source

| Option | Notes |
| --- | --- |
| Data export (preview) | Exports inventory and usage data to Azure Data Lake Storage. Marked experimental preview. The first files can take up to five days. Needs Power BI Premium |
| Cloud flows | Crawl the tenant with Power Platform admin connectors into Dataverse tables. Suited to small and medium tenants. Performance problems above 10,000 combined environments, apps and flows |

## Power BI files

The page lists template files for the CoE dashboard, governance and compliance, data export dashboards, the pulse survey and an admin task planner. Configuration steps are on a linked page.

## Releases and upgrades

A new version is released monthly, usually in the first full week. Upgrade at least every three months, because longer gaps can cause unexpected issues. Test upgrades in a dedicated test environment first.

## What the page does not cover

Step-by-step import, wizard use, connection reference setup and turning on flows. Power BI configuration. Governance, nurture and innovation backlog setup. Upgrade steps and customization. All of these sit on linked pages.

## A planning checklist

This list is practical advice built on the page.

1. Decide whether the kit still fits, given its maintenance status.
2. Confirm roles, licenses and DLP before you create environments.
3. Choose cloud flows or data export for inventory based on tenant size.
4. Build the test environment first and set ProductionEnvironment to no.
5. Plan quarterly upgrades.

## Typical mistakes

- Using a Dynamics 365 service admin account.
- Assigning roles through eligibility instead of directly and permanently.
- Putting a security group on the CoE environment.
- Going many months without upgrading.

## Related

- [Power Platform Center of Excellence](https://www.m365.fm/entity/power-platform-center-of-excellence/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [DLP](https://www.m365.fm/entity/dlp/)

## Sources

- [Set up the CoE Starter Kit (Microsoft Learn)](https://learn.microsoft.com/power-platform/guidance/coe/setup)
