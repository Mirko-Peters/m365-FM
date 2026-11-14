---
title: "Enable Copilot for Power BI in the Fabric Admin Portal: Settings and Requirements"
summary: "Which tenant settings, capacity types and workspace requirements Microsoft Learn lists for Copilot in Power BI, how capacity admins can override the tenant setting, and what is not supported."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [copilot-in-power-bi]
keypoints:
  - "Copilot is enabled by default in the Fabric admin portal. A Fabric admin can limit it with the setting Users can use Copilot and other features powered by Azure OpenAI."
  - "Workspaces need Power BI Premium P1 or higher, paid Fabric F2 or higher, or a Fabric Copilot capacity. Trial SKUs and trial capacities are not supported."
  - "If Azure OpenAI is not available in your region, a separate cross-geography tenant setting must be turned on, and Learn says to do that only if your organization accepts it."
  - "The Copilot setting is automatically delegated to capacity admins, and a capacity admin can override the tenant setting for that capacity."
  - "Copilot is not currently supported for Private Link or closed network environments."
faq:
  - q: "Do I have to turn Copilot on, or is it already on?"
    a: "Microsoft Learn says Copilot is enabled by default in the Fabric admin portal, and admins can disable it if the organization is not ready. Turning it on in Fabric gives access across all workloads, not only Power BI."
  - q: "Who can change the Copilot tenant settings?"
    a: "Learn says you must have Fabric admin privileges to enable Copilot. The settings are in the admin portal under Tenant settings, which you reach from the Settings gear in the Power BI service."
  - q: "What capacity does Copilot in Power BI need?"
    a: "Learn lists Power BI Premium P1 and above, paid Fabric F2 and above, or a Fabric Copilot capacity. Trial SKUs and trial capacities are not supported, and the capacity must be in a supported region."
  - q: "Can a capacity admin enable Copilot if the tenant setting is off?"
    a: "Yes, according to Learn. The AI and Copilot setting is delegated to capacity admins automatically, and a capacity admin can override the inherited tenant setting, so Copilot can be enabled for a capacity even if it is off at the tenant level."
  - q: "What do Power BI Desktop users need?"
    a: "Learn says they need admin, member or contributor access to at least one workspace on a paid Fabric capacity of F2 or higher or a Power BI Premium capacity of P1 or higher with Copilot enabled, unless they use a Fabric Copilot capacity."
---

Copilot for Power BI is controlled in the Fabric admin portal, not in a separate Power BI switch. Microsoft Learn says Copilot is enabled by default, so for many tenants the real work is checking capacity and region requirements, or limiting who can use it. This guide lists the settings and requirements as the Learn page describes them.

## Who can change the settings

You need Fabric admin privileges. Open the admin portal at app.fabric.microsoft.com/admin-portal, or select the **Settings** gear in the Power BI service and then **Admin portal**. The Copilot settings are under **Tenant settings**.

## Tenant settings to know

### Users can use Copilot and other features powered by Azure OpenAI

This is the main switch. It is enabled by default. To limit access, use the **Applies to** section to choose who can use Copilot, then select **Apply**. Learn notes that enabling Copilot in Fabric gives access across all workloads, not only Power BI.

### Data sent to Azure OpenAI can be processed outside your capacity's geographic region, compliance boundary, or national cloud instance

This applies only if Azure OpenAI is not available in your geographic region. Switch it on only if your organization accepts that data may be processed outside your area. Learn says the cross-geo setting stays disabled by default and does not auto-delegate to capacity admins.

### Standalone Power BI Copilot experience (preview)

Learn says that, as of September 2025, this was enabled by default for tenants where Copilot was already on. Admins can turn it off to opt out and hide the Copilot icon from the left navigation. It requires the main Copilot setting at the tenant level, because capacity-level delegation alone is not enough. It is available only for tenants whose home region is in a supported Fabric geo.

### Only show approved items in the standalone experience (preview)

When on, standalone Copilot searches only content marked **Approved for Copilot**. Workspace admins decide when a workspace has enough high-value content.

## Capacity-level delegation

The AI and Copilot setting is automatically delegated to capacity administrators, and tenant admins can't turn the delegation off. Capacity admins find it under **Capacity settings** > **Fabric capacity** > the capacity name > **Delegated tenant settings**, in the section **Copilot and Azure OpenAI Service (preview)**.

By default a capacity inherits the tenant setting. A capacity admin can override it, which means Copilot can be enabled for one capacity even if the tenant setting is off. If you need a hard block, also look at who administers each capacity (my advice).

## Capacity and workspace requirements

For the Power BI service, the workspace must sit on one of these:

- Power BI Premium P1 or higher
- Paid Fabric F2 or higher
- A Fabric Copilot capacity

To check the license of a workspace, open **More** > **Workspace settings** and look at the **Premium capacity** or **Fabric capacity** options. If the options are grayed out, the workspace has no access to a suitable capacity.

Trial SKUs and trial capacities are not supported. The capacity must be in a region listed on the Fabric region availability page.

### Power BI Desktop

Users need admin, member or contributor access to at least one workspace on a paid capacity (F2 or higher, or Power BI Premium P1 or higher) with Copilot enabled, unless they use a Fabric Copilot capacity. On first use, Desktop asks the user to pick a Copilot-compatible workspace. It can be changed later from the **Settings** gear.

## Billing in one paragraph

Learn says a Fabric Copilot capacity is billed only for Copilot AI consumption, meaning prompt processing and response generation. Downstream operations such as querying a semantic model are charged to that model's capacity. The page I read does not give prices.

## Limitations

Copilot is not currently supported for Private Link or closed network environments, according to the page.

## Checklist for admins (my advice)

1. Confirm you hold Fabric admin rights.
2. Open **Tenant settings** and review **Users can use Copilot and other features powered by Azure OpenAI**. Restrict it with **Applies to** if you want a pilot group.
3. Check whether Azure OpenAI is available in your capacity region. If not, decide on the cross-geo setting.
4. List the capacities, confirm each is a paid F2 or P1 and above, and not a trial.
5. Check who the capacity admins are, since they can override the tenant setting.
6. Decide on the standalone experience and the **Approved for Copilot** option.
7. Check networking. Private Link and closed networks are not supported.

## What the page leaves open

The Learn page does not say how long a settings change takes to apply, and it does not describe what end users see if the capacity is paused or throttled. My advice: test with a pilot group before you tell users it is available.

## Related

- [Copilot in Power BI](https://www.m365.fm/entity/copilot-in-power-bi/)

## Sources

- [Enable Fabric Copilot for Power BI (Microsoft Learn)](https://learn.microsoft.com/power-bi/create-reports/copilot-enable-power-bi)
