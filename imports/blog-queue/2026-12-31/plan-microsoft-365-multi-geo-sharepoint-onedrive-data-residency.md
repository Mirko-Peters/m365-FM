---
title: "Plan Microsoft 365 Multi-Geo for SharePoint and OneDrive Data Residency"
summary: "What Microsoft 365 Multi-Geo is and how to plan it, based on Microsoft Learn: eligible licenses, the 5 percent minimum, covered workloads, setup timing, the EU Data Boundary exclusion, and the steps from purchase to search configuration."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [sharepoint, onedrive, data-residency, microsoft-365]
keypoints:
  - "Multi-Geo is an add-on license for enterprise customers, bought through Enterprise Agreement, Web Direct or CSP channels. Small business and education subscriptions do not qualify."
  - "Enterprise Agreement customers must buy Multi-Geo licenses for at least 5 percent of their total eligible users, plus a license for each user hosted in a satellite geography."
  - "Learn lists Exchange Online, SharePoint and OneDrive, Teams, and Microsoft 365 Copilot and Copilot Chat as in-scope services."
  - "Learn says most tenants finish the one-time configuration within a month after the licenses arrive, and larger tenants may need more time."
  - "Tenants that bought or used Multi-Geo are not in scope for the EU Data Boundary, and Flex routing is not available to them."
faq:
  - q: "What is Microsoft 365 Multi-Geo?"
    a: "According to Microsoft Learn, it is an add-on that lets enterprise customers store data in multiple geographies within a single Microsoft 365 tenant while keeping single-tenant administration."
  - q: "How many licenses do I need?"
    a: "According to Microsoft Learn, Enterprise Agreement customers must purchase Multi-Geo licenses equal to or greater than 5 percent of their total eligible Microsoft 365 users. A license is also needed for each user hosted in a satellite geography."
  - q: "How long does setup take?"
    a: "The Learn page says the time varies by tenant, that most tenants finish within a month after receiving the licenses, and that larger or more complex tenants may need more time."
  - q: "Does Multi-Geo work with the EU Data Boundary?"
    a: "According to Microsoft Learn, customers who bought or used Multi-Geo are not in scope for the EU Data Boundary, and the Flex routing setting is not available to them."
---

Microsoft 365 Multi-Geo lets an enterprise tenant keep user data in more than one geography while it stays one tenant. For SharePoint and OneDrive, planning starts with licensing, then the one-time configuration by Microsoft, and then the planning, administration and configuration articles. This guide follows the Microsoft Learn overview and notes what it does not explain.

## What Multi-Geo is

Learn describes the Microsoft 365 Multi-Geo Capabilities add-on as a way to expand a Microsoft 365 presence to multiple geographies within a single existing tenant. It is meant for enterprises that need to store data in several geographies to meet data residency requirements, and that want single-tenant administration and full-fidelity collaboration between users.

A Multi-Geo tenant has a primary provisioned geography, which is where the subscription was originally provisioned, and one or more satellite geographies. Geography locations, groups and user information are mastered in Microsoft Entra ID and synchronized into each geography.

## Which services are in scope

Learn says Multi-Geo lets you manage and store in-scope data at a user level for:

- Exchange Online
- SharePoint and OneDrive
- Microsoft Teams
- Microsoft 365 Copilot and Microsoft 365 Copilot Chat

Shared resources can also be used with Multi-Geo. The page names SharePoint sites, Microsoft 365 Groups, shared mailboxes, eDiscovery and Teams teams.

The overview does not explain how each workload places or accesses data. It refers to the per-service data residency pages and to the Multi-Geo articles for Exchange, OneDrive and SharePoint, and Teams.

## Licensing

Learn lists eligible base subscriptions. Multi-Geo is an add-on to them:

- Microsoft 365 F1, F3, E3, E5 or E7, including SKUs without Teams
- Office 365 F3, E1, E3 or E5, including SKUs without Teams
- Exchange Online Plan 1 or Plan 2
- OneDrive Plan 1 or Plan 2
- SharePoint Plan 1 or Plan 2
- Microsoft Teams Enterprise, EEA or Essentials

Subscriptions for small businesses and education do not currently qualify, even if they contain elements of the list.

| Topic | What Learn states |
|---|---|
| Channels | Enterprise Agreement, Web Direct or CSP |
| Minimum quantity | Licenses equal to or greater than 5 percent of total eligible Microsoft 365 users |
| CSP partners | 5 percent of the customer's total eligible users |
| Enterprise Agreement | User subscription licenses must be on the same agreement as the Multi-Geo licenses |
| Per user | A license for each user hosted in a satellite geography |
| Shared resources | No separate license. With enough user licenses, shared resources can be used without limitation |

Learn tells customers to contact their Microsoft account team for details.

## EU Data Boundary

The page states that customers who bought or used Multi-Geo are not in scope for the EU Data Boundary, even if the tenant is listed in an EU or EFTA country or region. The Flex routing setting is not available in the Microsoft 365 admin center for these customers. The Data Location card in the admin center shows the tenant's country or region.

## Steps from purchase to search

1. **Purchase** Multi-Geo licenses for at least 5 percent of eligible users.
2. **Wait for configuration.** Microsoft runs a one-time automatic configuration after you order and the licenses appear in the tenant. Notices arrive in the Microsoft 365 message center. Learn says most tenants finish within a month, and larger or more complex tenants may need more time.
3. **Plan** with the article on planning a multi-geo environment.
4. **Administer and learn the user experience** with the administration and user experience articles.
5. **Configure** with the Multi-Geo tenant configuration article.
6. **Set up search** with the article on configuring search for multi-geo.

## Geographies and PDL values

The overview has a table that maps each geography to a PreferredDataLocation value, which is a three-letter code, for example NAM for the United States and GBR for the United Kingdom. The table also lists groups such as EUR and APC, and some countries appear in more than one row. The page does not explain what the value is, how it is set, or what it controls. Use the configuration article for that.

## Suggestion: questions to settle before you buy

This section is a practical suggestion and not a Microsoft statement.

1. Which user groups need their data in which geography, and why?
2. Does the total number of eligible users make the 5 percent minimum a large purchase?
3. Is the tenant currently counted in the EU Data Boundary, and can your compliance team accept that Multi-Geo changes this?
4. Who owns the follow-up work after Microsoft completes the configuration?

## Not covered

The pages I read do not describe the following:

- How to move users between geographies.
- How the preferred data location is set.
- Pricing and data migration steps.
- How each workload stores and serves data.
- A limit on the number of satellite geographies.

## Related

- [SharePoint](https://www.m365.fm/entity/sharepoint/)
- [OneDrive](https://www.m365.fm/entity/onedrive/)
- [Data residency](https://www.m365.fm/entity/data-residency/)

## Sources

- [Microsoft 365 Multi-Geo](https://learn.microsoft.com/microsoft-365/enterprise/microsoft-365-multi-geo)
