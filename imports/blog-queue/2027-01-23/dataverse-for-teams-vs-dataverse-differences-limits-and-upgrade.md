---
title: "Dataverse for Teams vs Dataverse: Differences, Limits and When to Upgrade"
summary: "Dataverse for Teams environments are deprecated: no new ones from November 15, 2026, suspension on September 15, 2027 and decommissioning on October 30, 2027 unless upgraded. Side-by-side tables for features, limits, security and integration, plus the upgrade checklist from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [dataverse, teams, power-apps]
keypoints:
  - "Learn lists Dataverse for Teams environments as deprecated. New ones cannot be created from November 15, 2026."
  - "Environments that are not upgraded are suspended on September 15, 2027 and decommissioned on October 30, 2027. Their apps, flows, agents and data are then no longer available."
  - "Dataverse for Teams has one environment per team and about 1 million rows or 2 GB. Dataverse has unlimited environments and no listed size maximum."
  - "Dataverse adds API access, plug-ins, model-driven apps, auditing, field-level security, customer-managed keys and more integration options."
  - "Before an upgrade, check tenant Dataverse capacity and licenses. After the upgrade the environment is no longer tied to the team lifecycle."
faq:
  - q: "Is Dataverse for Teams still available?"
    a: "Microsoft Learn says Dataverse for Teams environments are deprecated in three phases. You cannot create new ones starting November 15, 2026. Existing environments that are not upgraded to Dataverse are suspended on September 15, 2027 and decommissioned on October 30, 2027. Existing environments continue to work until September 15, 2027."
  - q: "What are the main limits of Dataverse for Teams?"
    a: "One environment per team, a capacity of 2 GB that can typically store up to 1 million rows, only one business unit, no API access, no plug-ins, no model-driven apps, no auditing and no field-level security. Learn also says it does not support custom connectors, desktop flows or AI Builder."
  - q: "What do I need before I upgrade?"
    a: "Your tenant needs at least as much available Dataverse capacity as the size of the Dataverse for Teams environment, since its consumption counts toward tenant capacity afterwards. Users also need Power Apps, Power Automate or Copilot Studio licenses for the apps, flows and agents. A tenant admin such as a Power Platform admin does the upgrade in the Power Platform admin center."
  - q: "What happens to my apps and data after the upgrade?"
    a: "They stay in the upgraded environment. Apps can run inside and outside Teams, makers edit apps and flows in Power Apps and Power Automate, the environment lifecycle is no longer tied to the team, so it remains if the team is deleted, and team owners get the System Administrator role."
  - q: "Can I move to an existing Dataverse environment instead?"
    a: "Yes. Learn says you can export apps, flows and tables as a solution from the Dataverse for Teams environment and import the solution into a Dataverse environment."
---

Dataverse for Teams was the built-in data platform behind apps made inside a team in Microsoft Teams. Microsoft Learn now marks these environments as deprecated, so the comparison with Dataverse has become a migration question. This article puts the two side by side using the Learn comparison page and the deprecation notice, and ends with a checklist.

## The timeline first

According to the Power Platform page on important changes (deprecations) coming, the deprecation has three phases:

| Phase | Date | What happens |
| --- | --- | --- |
| Creation ends | November 15, 2026 | New Dataverse for Teams environments cannot be created from Teams, including when you create a first app or agent in a team or install an app from the Teams app catalog |
| Environments suspended | September 15, 2027 | Environments not upgraded to Dataverse are suspended. Apps, flows, agents and data are no longer available |
| Environments decommissioned | October 30, 2027 | Not-upgraded environments are decommissioned |

Existing environments continue to work until September 15, 2027. Upgraded environments, other Teams assets (teams, channels, chats, SharePoint sites and files) and apps, flows and agents built in Dataverse environments and added to Teams are not affected.

## What Dataverse for Teams is

Applications within a team have access to a Dataverse for Teams environment, which delivers a targeted set of the features commonly needed for apps, flows and more within Teams. Learn says that if you need more granular security and governance, or more capacity than the approximately 1 million rows an environment holds, you can upgrade to Dataverse.

## Table and maker features

| Feature | Dataverse for Teams | Dataverse |
| --- | --- | --- |
| Basic data types, relational storage, files and images, find, filter and sort | Yes | Yes |
| Advanced data types (customer, multiple transaction currencies) | No | Yes |
| Non-relational storage (logs), managed data lake | No | Yes |
| Advanced and Dataverse search | No | Yes |
| Mobile offline | No | Yes |
| Data visualization | Yes | Yes |
| Paginated reports | No | Yes |
| API access, plug-ins, Power Apps component framework | No | Yes |
| Canvas apps | Yes | Yes |
| Model-driven apps | No | Yes |

Most of the standard tables provided with a Power Platform environment are not present in Dataverse for Teams.

## Environments and limits

| Item | Dataverse for Teams | Dataverse |
| --- | --- | --- |
| Environments | 1 per team (for up to 10,000 teams) | Unlimited |
| Maximum size | 1 million rows or 2 GB | Unlimited, per the page |
| Lifecycle | Tied to the team. Deleting the team deletes the environment | Not tied to a team. An upgraded environment stays if the team is deleted |
| Upgrade to Dataverse | Yes | Not applicable |

Both support backups, point-in-time restore and disaster recovery. Capacity in Dataverse for Teams is measured with relational, image and file data. The page notes that Dataverse also supports copy and reset operations for multiple environments.

## Security

| Feature | Dataverse for Teams | Dataverse |
| --- | --- | --- |
| Roles | Preconfigured by membership type: owners, members and guests. Admin roles System Administrator and System Customizer | Standard and custom security roles, plus other service admin roles |
| Business units | One | Unlimited |
| Activity logging and auditing | No | Yes |
| Customer-managed encryption key | No | Yes |
| Field-level and hierarchical security | No | Yes |
| Record sharing | No | Yes |
| Microsoft Entra group teams and sharing to group teams | No | Yes |
| Owner teams, assigning roles to owner teams, changing record ownership | Yes | Yes |

The page notes that assigning Teams roles to owner teams in Dataverse for Teams can be done via a custom app in Power Apps.

## Integration

| Feature | Dataverse for Teams | Dataverse |
| --- | --- | --- |
| Power Automate | Yes | Yes |
| Azure Synapse Link for Dataverse | No | Yes |
| Data Export Service | No | Yes |
| Events to Azure Event Hubs or Service Bus, webhooks | No | Yes |
| Server-side sync | No | Yes |
| SQL Server Management Studio (TDS) | No | Yes |

Both can use connectors. The page says users with Premium licenses have access to the full set of over 350 standard and premium connectors. The deprecation notice adds that Dataverse for Teams does not support custom connectors, desktop flows or AI Builder.

## Upgrade checklist from Learn

1. In the Power Platform admin center, go to **Manage** > **Environments** and filter by **Type** equal to **Microsoft Teams**. Use the **Last activity** column to find environments still in use.
2. For each environment you need, check that the tenant has at least as much available Dataverse capacity as the environment size, and that users have the licenses they need after the upgrade.
3. Upgrade the environment before October 30, 2027. A tenant admin such as a Power Platform admin does it in the admin center. Agents have their own Copilot Studio upgrade article.
4. Tell the team owners. After the upgrade makers work in Power Apps and Power Automate.
5. Environments you do not need need no action and are decommissioned.

After the upgrade, the app can run inside and outside Teams, and the environment remains if the team is deleted. For new work, Learn tells makers to build in a Dataverse environment and add the app to Teams. The alternative to upgrading is exporting a solution and importing it into an existing Dataverse environment.

## Deciding (my advice)

This is my suggestion, not Microsoft guidance:

1. Treat the inventory as the first task, since a Teams environment can be created when a user builds a first app in a team, as the deprecation notice describes.
2. Upgrade what has activity and a clear owner. Let the rest expire, after you ask the owners.
3. If an app needs auditing, API access or a model-driven interface, plan the move to a managed Dataverse environment with solutions rather than only upgrading in place.
4. Budget for capacity and licenses early, because they decide whether the upgrade can start.

## Related

- [Dataverse](https://www.m365.fm/entity/dataverse/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)

## Sources

- [Dataverse for Teams vs. Dataverse (Microsoft Learn)](https://learn.microsoft.com/power-apps/teams/data-platform-compare)
- [Important changes (deprecations) coming in Power Platform (Microsoft Learn)](https://learn.microsoft.com/power-platform/important-changes-coming)
