---
title: "Set Up Power Platform Tenant Isolation: Cross-Tenant Inbound and Outbound Restrictions"
summary: "Configure Power Platform tenant isolation using Microsoft Learn: what it blocks, the Security, Identity and access path, allow list directions, the star wildcard, the 500 rule threshold, user-visible errors, the one hour delay and the Azure DevOps connector gap."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [power-platform-tenant-isolation, power-platform-admin-center, power-platform]
keypoints:
  - "Tenant isolation controls cross-tenant connections made through Power Platform connectors that use Microsoft Entra ID authentication, in canvas apps and Power Automate flows."
  - "It is off by default. When on, inbound and outbound cross-tenant connections are blocked even with valid credentials, unless an allow list entry exists."
  - "In the Power Platform admin center go to Security, Identity and access, Tenant isolation and turn on Restrict cross-tenant connections."
  - "An outbound allow list entry does not permit inbound connections. Entries apply only in their configured direction, and a star allows all tenants in a direction."
  - "The Azure DevOps connector does not enforce tenant isolation. Policy changes take about an hour to be assessed against active apps and flows."
faq:
  - q: "What does tenant isolation block?"
    a: "According to Microsoft Learn, cross-tenant connections through connectors that use Microsoft Entra ID authentication in Power Platform canvas apps and flows. It does not affect Entra ID access outside Power Platform."
  - q: "Where do I turn it on?"
    a: "In the Power Platform admin center select Security, then Identity and access, then Tenant isolation, and turn on Restrict cross-tenant connections. You must be a tenant admin."
  - q: "How do I allow one partner tenant?"
    a: "Select Add exceptions, choose the allowed direction (inbound, outbound or both), enter the tenant domain or tenant ID and save. Entries have no effect while isolation is off."
  - q: "What do users see when a connection is blocked?"
    a: "In a canvas app the connection is not added and the app shows The data didn't load correctly. In Power Automate the flow saves but is marked Suspended until the DLP policy violation is resolved."
  - q: "Are there known gaps?"
    a: "Yes. Learn says the Azure DevOps connector has its own OAuth flow and token service, so tenant isolation is not enforced for it. Use data policies to limit that connector."
---

Power Platform tenant isolation lets an administrator decide which external tenants can connect to or from the tenant through connectors that use Microsoft Entra ID authentication, such as Office 365 Outlook and SharePoint. The goal is to keep tenant data inside the tenant. This guide follows the Microsoft Learn article.

## What it covers

- It applies to canvas apps and Power Automate flows, and only to connectors with Microsoft Entra ID based authentication.
- It differs from Microsoft Entra ID wide tenant restrictions and does not affect access outside Power Platform.
- You must be a tenant admin, and the page also names the Power Platform administrator role for seeing and setting the policy.

## Default behavior

| State | Effect |
| --- | --- |
| Off (default) | Cross-tenant connections are allowed with valid Entra credentials |
| On | All external tenants are restricted, inbound and outbound, even with valid credentials. Exceptions come from allow lists |

The page describes two-way (inbound and outbound) isolation and one-way (inbound) isolation. Its text on the one-way option is brief and does not describe outbound behavior separately.

## Turn it on

1. Go to the Power Platform admin center.
2. Select **Security**, then **Identity and access**.
3. On the Identity and access management page, select **Tenant isolation**.
4. Turn on **Restrict cross-tenant connections**.

## Add exceptions

1. Select **Add exceptions** in the Tenant isolation pane. If isolation is off, you can still add entries, but they are not enforced.
2. In **Allowed direction**, choose inbound, outbound or both.
3. In **Tenant ID**, enter the tenant domain or ID. A domain is converted to the ID. Use `*` to allow all tenants in the chosen direction.
4. Select **Save**.

To make sure isolation blocks nothing, turn it on and add a rule with `*` in both directions.

## How the allow list behaves

- Entries bypass isolation only in their configured direction. Adding Fabrikam to Contoso's outbound list lets Contoso users connect out, but Fabrikam users still cannot connect into Contoso. Add the inbound direction as well for two-way access.
- You can add, edit and delete entries whether isolation is on or off.
- The page sets a threshold of 500 rules because of technical limits.
- The page describes no separate blocklist.
- A guest user connecting from their host tenant to a data source in that same host tenant is not evaluated by the rules.

## What makers and users see

- Canvas apps: a blocked connection is not added, and the app shows The data didn't load correctly. Please try again.
- Power Automate: saving shows Couldn't retrieve values. The dynamic invocation request failed with error. The flow saves but is marked Suspended and does not run until the data loss prevention policy violation is resolved.
- At runtime, changes can break existing apps and flows. The failed run appears in run history. Policy changes take about an hour to be assessed against active apps and flows.

## Scenarios from the page

Take Contoso with isolation on and Fabrikam not on the allow list. Contoso users cannot create outbound connections to Fabrikam data sources, and Fabrikam users cannot create inbound connections to Contoso, even with valid credentials. Connections within one tenant still work. If Fabrikam is added to Contoso's outbound list only, Contoso users can connect out, but Fabrikam users still cannot connect in. If Fabrikam is on both lists, access works in both directions.

## Plan before you enable

Learn suggests a scenario: turn isolation on, add exception rules to remove impact, and run the cross-tenant isolation reports, which are in preview, to find tenants that need exemptions. A practical order, which is a suggestion, is to review the reports first, add the exceptions for known partners and then turn isolation on.

## Known issue

The Azure DevOps connector uses Microsoft Entra authentication but has its own OAuth flow and security token service, so the token is not issued by Entra ID and tenant isolation is not enforced. Microsoft recommends other data policies to limit the connector or its actions.

## Not covered

The page states no license requirements and does not explain how tenant isolation relates to Entra tenant restrictions v2 in configuration. It has no separate test procedure beyond the reports, the error messages and flow run history.

## Related

- [Power Platform tenant isolation](https://www.m365.fm/entity/power-platform-tenant-isolation/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Cross-tenant inbound and outbound restrictions](https://learn.microsoft.com/power-platform/admin/cross-tenant-restrictions)
