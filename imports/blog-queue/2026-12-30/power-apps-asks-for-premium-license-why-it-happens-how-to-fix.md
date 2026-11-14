---
title: "Power Apps Asks for a Premium License: Why It Happens and How to Fix It"
summary: "Why a Power Apps app asks users for a premium license, using the Power Platform licensing FAQ: premium, custom and on-premises connectors, Dataverse, per app versus per user plans, Microsoft 365 seeded rights and the transition end dates, and the fixes the page documents."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [power-apps, power-platform]
keypoints:
  - "Learn says a standalone Power Apps or Power Automate plan is required to access all premium, on-premises and custom connectors. Microsoft 365 seeded rights cover standard connectors."
  - "Accessing an environment with Dataverse requires a corresponding standalone Power Platform license for each service used, per app or per user, depending on the scenario."
  - "A per app license gives one user rights to one app in one environment and licenses are stackable. A Power Apps Premium license allows unlimited apps."
  - "The extended transition period for older apps ended on October 1, 2024, and in-product enforcement was set to begin April 1, 2025."
  - "Fixes on the page are assigning licenses, enabling auto-claim policies and using inventory reports. The page does not describe the user prompt or how to remove premium connectors."
faq:
  - q: "Why does my app require a premium license?"
    a: "According to Microsoft Learn, the app probably uses a premium, on-premises or custom connector, or Dataverse. A standalone Power Apps or Power Automate plan is required for those, while Microsoft 365 includes use rights for standard connectors."
  - q: "Which connectors are premium?"
    a: "Learn lists examples including Azure SQL, SQL Server, Dynamics 365, Azure Blob Storage, Azure DevOps, Service Bus and Event Hubs. The SQL, Azure and Dynamics 365 connectors were reclassified as premium."
  - q: "What is the difference between per app and per user?"
    a: "A per app license gives one user rights to one app in one environment, and can be stacked. The per user plan, now called Power Apps Premium, allows unlimited apps. The page lists the per app price as 5 dollars per user per app per month, and Power Apps Premium as 20 dollars per user per month."
  - q: "How do I find which apps use premium connectors?"
    a: "Use the inventory reports in the Power Platform admin center."
  - q: "Do guest users need a license?"
    a: "Yes. A guest needs the same license a non-guest would need, assigned through the tenant hosting the app or the guest's home tenant, and for Dataverse from the tenant holding the data."
---

When a user opens a Power Apps app and is told a premium license is needed, the cause is almost always what the app connects to. This guide follows the Microsoft Learn Power Platform licensing FAQ. The page has no section on the prompt itself, so the material below is gathered from its use-rights, Dataverse and per app sections.

## What makes an app premium

- **Premium connectors:** Learn says the SQL, Azure and Dynamics 365 connectors were reclassified as premium. A standalone Power Apps or Power Automate plan is required to access all premium, on-premises and custom connectors. The listed examples include Azure Blob Storage, Azure SQL, Azure DevOps, Dynamics 365, Event Hubs, Service Bus and SQL Server.
- **Custom connectors:** also need a standalone plan.
- **On-premises data gateways:** a premium capability.
- **Dataverse:** accessing an environment with Dataverse requires a standalone Power Platform license for each service used. A user of a Dataverse app needs a per app or per user plan.

Standard connectors that Microsoft 365 users previously had remain available to them under the seeded rights.

## Timeline

Apps and flows created before October 1, 2019 received an extended transition until October 1, 2024. The page still words the next date as a future one: in-product licensing enforcement begins April 1, 2025, after which users without assigned licenses cannot use the affected apps. That date has passed. It also says that starting January 2025 an auto-claim policy would be enabled for customers who were in an extended transition. Dataverse for Teams environments are described as deprecated, and premium connectors in an app there also require a per app or per user plan.

## How licenses are evaluated

- **Per app:** one user, one app (canvas or model-driven) in one environment. Licenses are stackable. Embedded canvas components in a model-driven app count as one app.
- **Flows:** flows must run in the context of the app, using the same data sources. Unrelated standalone flows need a Power Automate license.
- **Mixing:** you can mix Power Apps licenses across users.
- **Guest users:** need the same license as non-guests, assigned in the tenant hosting the app or the guest's home tenant. For Dataverse, the license comes from the tenant where the data is.

Plan prices on the page: Power Apps per app is 5 dollars per user per app per month, and Power Apps Premium is 20 dollars per user per month, or 12 with 2,000 or more new licenses. Prices change, so check the current pricing page.

## Fixes the page describes

1. Assign licenses, and enable auto-claim policies for Power Apps and Power Automate so licenses are assigned automatically.
2. Use the inventory reports in the Power Platform admin center to identify apps and flows that use specific connectors.
3. Buy the appropriate licenses, as listed in the Power Apps and Power Automate licensing guide that the page links.
4. For Dataverse for Teams, upgrade the environment to Dataverse. Users still need licenses.

## Check before buying

This section is a suggestion, not Microsoft guidance. List the connectors the app uses, check whether any is premium, and see whether a per app license for the few users who need the app is cheaper than per user licenses. Removing a premium connector is a design decision, and the page does not describe it as a fix.

## Plans and related offers

Besides per app and Power Apps Premium, the page mentions a Power Apps pay-as-you-go option, described as preview, which lets individual users run one app through an Azure subscription without licenses, with postpaid billing for the users who used the app in a month. Power Apps per user was renamed Power Apps Premium with no difference between the two, and admins no longer need a standalone P2 license for management operations.

## Seeded Microsoft 365 rights

Microsoft 365 subscriptions include seeded Power Apps and Power Automate use rights. These cover standard connectors but not the premium list above. The Dynamics 365 connector does not provide Dataverse capacity, and Dataverse capacity is a prerequisite for apps and flows to use Dataverse.

## Not covered

The page does not describe the text of the license prompt, steps to check or reassign a user's license, whether a trial grants premium connector access beyond giving trial durations of 30 days for Power Apps and 90 days for Power Automate, or how to remove connectors from an app.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Power Platform licensing FAQs (Microsoft Learn)](https://learn.microsoft.com/power-platform/admin/powerapps-flow-licensing-faq)
