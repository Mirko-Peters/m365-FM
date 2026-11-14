---
title: "Power Platform Environment Strategy: Secure the Default Environment, Routing and Tenant Isolation"
summary: "How to lay out Power Platform environments with a locked-down default environment, environment routing, environment groups and cross-tenant isolation, based on Microsoft Learn's environment strategy and admin guidance."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [power-platform, default-environment, environment-routing, power-platform-tenant-isolation]
keypoints:
  - "You cannot block the default environment, but you can minimize what happens there. Routing makers to personal developer environments is the first step."
  - "Environment routing is off by default, creates managed developer environments and evaluates rules in priority order."
  - "Environment groups apply shared rules such as sharing limits and solution checker. An environment must be managed to join one."
  - "Tenant isolation restricts cross-tenant Entra ID connections for canvas apps and flows, with inbound and outbound allow lists."
  - "Learn has no dedicated multi-tenant section. Environments belong to one tenant, so multi-tenant design means separate strategies plus isolation rules."
faq:
  - q: "Can I block access to the default environment?"
    a: "No. Microsoft Learn says you can't block access, but you can minimize what is done in it. Recommended steps are environment routing, limiting admins, renaming it, and a data policy that restricts connectors."
  - q: "Does Microsoft describe a quarantine feature?"
    a: "Only as a migration action. The strategy page says assets not used recently should trigger a notice to the owner and a move to quarantine if there is no response. The pages I read do not describe a product feature called quarantine, so treat it as a process you define."
  - q: "Do routed developer environments need a premium license?"
    a: "Learn says creating or previewing an app or flow in a managed developer environment does not require a premium license, but users need a premium license to run apps or flows there. Managed environments are not included as an entitlement in the Developer Plan when users run assets."
  - q: "What does tenant isolation block?"
    a: "When on, it restricts cross-tenant connections in both directions for connectors that use Microsoft Entra ID authentication, such as SharePoint and Office 365 Outlook, even when the user has valid credentials. The Azure DevOps connector is a known exception because it uses its own OAuth flow."
  - q: "What changes on December 15, 2026?"
    a: "The environment routing page says unmanaged developer environments are deprecated and will be suspended starting December 15, 2026. Routing creates managed developer environments, so it is not affected. The strategy page also says no new Dataverse for Teams environments can be created starting November 15, 2026."
---

A sound layout has four parts: a default environment limited to personal productivity, routing that sends makers to their own managed developer environments, shared environments organized into environment groups, and tenant isolation to restrict cross-tenant data movement. Microsoft Learn describes each. It does not describe a multi-tenant architecture as such. Environments belong to a tenant, so for several tenants you repeat the strategy per tenant and use isolation and allow lists to control traffic between them.

## Understand the default environment

Every tenant has one. Learn says it isn't intended for long-term or permanent work beyond Microsoft 365 personal productivity scenarios. You can't block access to it.

Securing steps in Learn's order:

1. Use environment routing to send makers to their own workspace.
2. Review who has admin access and limit it. Prefer environment admin or system administrator over Power Platform administrator where possible, and use PIM for high-privilege roles.
3. Consider renaming it, for example Personal Productivity. It is created as *TenantName* (default).
4. Create a data policy. If the default environment is managed, scope it to that environment with all connectors blocked using advanced connector policies. If you cannot enable managed environments, set Blocked as the default data group, move unblockable connectors to Business and blockable ones to Blocked, and add a rule that blocks custom connector URL patterns.
5. Keep **Share with Everyone** disabled, which is the default.

Recommended sharing limit for the default environment: exclude security groups and limit sharing to 20 individuals. Solution checker: Block and Send emails.

The Office 365 Outlook connector cannot be blocked. Learn suggests Exchange rules to stop outbound mail to external recipients from Power Automate and Power Apps, using headers such as `x-ms-mail-application`.

## Turn on environment routing

Routing sends makers to personal developer environments when they open Copilot Studio, Power Apps or Power Automate. It is a premium governance feature, off by default, and only Power Platform admins can enable it.

1. Open the Power Platform admin center.
2. Select **Manage** > **Tenant settings** > **Environment routing**.
3. Choose the portals to include.
4. Select **New rule**, name it, choose **Everyone** or security groups, and pick the environment group for new developer environments.
5. Set rule priority with the arrows and **Save**.

Rules run in priority order and the first match wins. No match, or routing off, means the default environment. Makers with an existing developer environment go to it (the first alphabetically if several). Makers get the admin role in their environment. If creation fails, they land in the default environment. Power Pages is not supported.

Routed environments are managed by default and inherit group rules. Preconfigured settings include sharing with five individuals, solution checker on Warn and usage insights enabled.

## Use environment groups

Groups let you apply rules to many managed environments. Constraints from Learn: an environment must be managed to join, it can be in one group at a time, groups can span regions, and groups cannot contain groups. Rules cover sharing controls, usage insights, maker welcome content, solution checker enforcement, backup retention and AI-generated descriptions. While a group manages a setting, the environment setting is locked.

Group by lifecycle stage, department, project or region. Learn's naming pattern example is `Prod-US-Finance-Payroll`. Groups have no rule for data policies, so name the data policy similarly to the group.

## Environment types and sharing limits

Learn's recommended sharing limits by type:

| Type | Limit |
|---|---|
| Default | Exclude security groups, 20 individuals |
| Developer | Exclude security groups, 5 individuals |
| Sandbox | Exclude security groups, no individual limit |
| Production | No limits, or exclude security groups |

Solution checker: Block and Send emails for default and production, Warn for developer and sandbox. Provision Dataverse wherever makers create assets to be shared. Each environment other than trial and developer uses 1 GB of capacity initially.

## Add tenant isolation

Tenant isolation governs cross-tenant data movement for connections that use Microsoft Entra ID authentication. It affects canvas apps and flows, and it is separate from Entra tenant restrictions.

1. In the Power Platform admin center select **Security** > **Identity and access** > **Tenant isolation**.
2. Turn on **Restrict cross-tenant connections**.
3. Select **Add exceptions**, choose the direction, enter the tenant domain or ID, and **Save**.

Direction matters. Allowing outbound to a partner tenant does not allow inbound from it. The allow list holds up to 500 rules, and `*` allows all tenants. Policy changes take about an hour to be assessed against active apps and flows. Learn recommends running the cross-tenant isolation reports in preview before enabling, to find tenants to exempt.

## Rolling this out in an existing tenant

Learn's brownfield sequence:

1. Create a group for new developer environments and turn on routing.
2. Create groups for existing environments and move them in.
3. Move popular default-environment apps to pipelines and production, then move development to dedicated environments.
4. Notify owners of unused assets, quarantine them if there is no response, then remove them.

Restrict creation of new production environments to admins, as Learn advises.

## Know the developer environment rules

Learn describes the developer environment as a personal workspace. Each maker gets one managed developer environment, it does not count against tenant capacity, and Dynamics 365 apps are not available in it. It is removed automatically if it is inactive and the owner does not respond to notifications. Unmanaged developer environments are deprecated.

Because routing creates managed environments, users who run apps in them need a premium license. Budget for that before you turn routing on for everyone. To limit who is eligible, name a security group in the routing rule. Non-members fall back to the default environment, which is why the default environment still needs the controls above.

Also decide early where Dynamics 365 might be used. Learn says that if Dynamics 365 apps might be deployed, you must enable them when you create the environment, because you cannot install them later.

## Related

- [Power Platform](https://www.m365.fm/entity/power-platform/)
- [Default environment](https://www.m365.fm/entity/default-environment/)
- [Environment routing](https://www.m365.fm/entity/environment-routing/)
- [Tenant isolation](https://www.m365.fm/entity/power-platform-tenant-isolation/)

## Sources

- [Environment routing](https://learn.microsoft.com/en-us/power-platform/admin/default-environment-routing)
- [Develop a tenant environment strategy](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/environment-strategy)
- [Secure the default environment](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/secure-default-environment)
- [Cross-tenant inbound and outbound restrictions](https://learn.microsoft.com/en-us/power-platform/admin/cross-tenant-restrictions)
