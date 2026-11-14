---
title: "Power Apps and Power Automate Licensing: Per User, Per App and Pay-As-You-Go Explained"
summary: "An overview of Power Apps and Power Automate licensing from Microsoft Learn: standalone per-user and per-app licenses, Microsoft 365 and Dynamics 365 use rights, capacity add-ons, pay-as-you-go, and how to report who is licensed."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [power-platform, power-apps, power-automate, dataverse]
keypoints:
  - "Learn describes standalone per-user licenses such as Power Apps Premium and Power Automate Premium, and Power Apps per app as a capacity-based license for one app in an environment."
  - "Since 2 January 2026 the Power Apps per app SKU is no longer available to new customers through some purchasing channels. Existing customer and CSP availability varies."
  - "Microsoft 365 licenses include limited use rights for standard connectors and Microsoft 365 data, not the rights of standalone premium licenses."
  - "Pay-as-you-go links an environment to an Azure subscription through a billing plan and bills eligible usage through Azure meters."
  - "Learn lists four reports for who is licensed, and says license assignment changes can take up to seven days to appear in the PowerShell export."
faq:
  - q: "What license types does Learn describe for Power Apps and Power Automate?"
    a: "According to Microsoft Learn, standalone licenses (per user and per app), use rights included with other Microsoft products, capacity add-ons and pay-as-you-go meters."
  - q: "Is Power Apps per app still available?"
    a: "According to Microsoft Learn, effective January 2, 2026 the Power Apps per app SKU is no longer available to new customers through some purchasing channels, and existing customer and CSP availability varies."
  - q: "Do Microsoft 365 licenses include Power Apps?"
    a: "Learn says some Microsoft 365 licenses include limited Power Apps and Power Automate use rights for Microsoft 365 data and standard connectors, not the same rights as standalone premium licenses."
  - q: "How does pay-as-you-go work?"
    a: "According to Microsoft Learn, pay-as-you-go links an environment to an Azure subscription through a billing plan, and eligible usage is billed through Azure meters."
  - q: "Does the page give prices?"
    a: "No. The Microsoft Learn overview does not list prices, trial lengths or a comparison table."
---

Power Apps and Power Automate can be licensed with standalone per-user licenses, a per-app license for Power Apps, use rights that come with Microsoft 365 or Dynamics 365, capacity add-ons, or pay-as-you-go meters. The Microsoft Learn licensing overview explains these options in general terms. It gives no prices and no comparison table, so this guide describes the categories and says what to check elsewhere.

Learn adds a warning: the article is a general overview, licensing programs and terms can change, and the Power Platform Licensing Guide and your agreement are the authority.

## The license categories

Learn says Power Platform capabilities are licensed through standalone licenses, use rights included with other Microsoft products, capacity add-ons, or pay-as-you-go meters.

### Per user

Standalone licenses give use rights for a specific product. The page names Power Apps Premium and Power Automate Premium, and says product licenses can include Dataverse and other capacity entitlements.

### Per app

Power Apps per app is a capacity-based license for running a specific app in an environment. The page states that, effective January 2, 2026, the SKU is no longer available to new customers through some purchasing channels. Availability for existing customers and for Cloud Solution Provider partners varies.

The overview does not describe a separate per-flow license for Power Automate. It covers Power Automate premium licensing only through the premium wording and a link to the types of Power Automate licenses.

### Trials

Power Apps and Power Automate offer trials. The page says availability, duration and self-service sign-up vary by product and tenant settings. No trial length is given.

## Rights that come with other products

- **Microsoft 365:** Some licenses include limited Power Apps and Power Automate use rights for scenarios that use Microsoft 365 data and standard connectors. They do not provide the same rights as standalone premium licenses. Some Microsoft 365 apps include limited Dataverse rights. These do not entitle users to run standalone custom apps, premium flows or Copilot Studio agents, even if a Dataverse service plan shows in the admin center.
- **Dynamics 365:** Qualifying licenses include Power Apps and Power Automate use rights for extending and customizing the licensed Dynamics 365 application. The rights must be used in the context of that application.

## Capacity add-ons

Capacity add-ons give tenant-level or environment-level capacity for specific services. The page names Dataverse storage, AI Builder credits, Power Pages capacity and Copilot Credits. Admins manage them in the Licensing area of the Power Platform admin center.

## Pay-as-you-go

Pay-as-you-go links an environment to an Azure subscription through a billing plan. Eligible usage is billed through Azure meters instead of requiring all capacity to be bought in advance. The page names meters for Power Apps, Power Automate, Dataverse, Power Pages and Copilot Studio. Supported meters, prerequisites and setup are on a separate page, and this overview gives no rates.

## The Developer Plan

The free Power Apps Developer Plan gives an individual developer environment for building and testing. It is not for production workloads. Learn warns that unmanaged developer environments are deprecated, including the ones created at Developer Plan sign-up. Managed developer environments are not affected. To keep work, enable Managed Environments or move solutions to another environment before suspension starts.

## Find out who is licensed

Learn lists four reporting experiences:

| Where | Who can use it | What it shows |
|---|---|---|
| Microsoft 365 admin center | Billing Administrator, License Administrator or Global Administrator | Purchased products, available licenses, per-user assignments |
| Power Apps license consumption report (preview) | Power Platform Administrator, Dynamics 365 Administrator, Environment Admin for the environment view | Purchased, assigned and used licenses, active users, pay-as-you-go plans, usage trends |
| Power Automate license consumption report (preview) | Power Platform Administrator, Dynamics 365 Administrator | Licenses, consuming users and flows, flows that need licensing attention |
| Capacity add-ons | Power Platform Administrator, Dynamics 365 Administrator | Purchased, available, allocated and consumed capacity |

You can also export with PowerShell:

```powershell
Get-AdminPowerAppLicenses -OutputFilePath '<licenses.csv>'
```

The export includes users who accessed a Power Platform service. It might not include users who were assigned a license but never accessed the service, and license assignment changes can take up to seven days to appear.

## Suggestion: how to use this overview

This section is a practical suggestion and not a Microsoft statement.

1. List the apps and flows, the connectors they use and the data they touch.
2. Mark which ones use only standard connectors and Microsoft 365 data.
3. For the rest, check the product-specific pages linked from the overview.
4. Confirm current prices and terms in the Licensing Guide or with your licensing partner.

## Not covered

The pages I read do not describe the following:

- Prices for any license, meter or capacity add-on.
- A feature comparison of Premium, per app and Microsoft 365 rights.
- A separate per-flow license.
- Trial durations and capacity quantities per license.
- Azure meter rates.

## Related

- [Power Platform](https://www.m365.fm/entity/power-platform/)
- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Automate](https://www.m365.fm/entity/power-automate/)
- [Dataverse](https://www.m365.fm/entity/dataverse/)

## Sources

- [Licensing overview for Microsoft Power Platform](https://learn.microsoft.com/power-platform/admin/pricing-billing-skus)
