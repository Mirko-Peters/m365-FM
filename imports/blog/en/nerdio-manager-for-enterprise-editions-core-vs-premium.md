---
title: "Nerdio Manager for Enterprise editions: Core vs Premium"
summary: "Nerdio Manager for Enterprise has two editions. Core covers host pool, image, app and endpoint management; Premium adds advanced auto-scale, Global Pools, Azure Capacity Extender and per-user cost reporting."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-manager-for-enterprise, nerdio]
keypoints:
  - "Nerdio's help center says there are two editions, Core and Premium, and that Premium includes everything in Core plus more. Before version 6.0 the choice was Standard or Premium."
  - "Nerdio's pricing table lists as Premium only: Advanced AVD Auto-scale, Global Pools (Public Preview), multi-region management, Azure Capacity Extender, Intune multi-tenant and cost reporting."
  - "Nerdio's own pages disagree on some items, for example Azure Government support and SCCM integration. Check the live pricing page and the edition pop-up in your console before you decide."
  - "You can change the edition at any time in Nerdio Manager. Downgrading to Core can lose functionality, and the confirmation pop-up lists what you will lose."
  - "Billing is per unique Entra ID user per month at the highest entitlement used. Nerdio's pricing page lists no Core or Premium price, so ask for a quote."
faq:
  - q: "Can I switch between Core and Premium later?"
    a: "Yes. Nerdio's Edition Management page says you can change the edition at any time in Nerdio Manager. Going from Premium to Core could result in loss of functionality; Nerdio names advanced cost optimization features such as Azure Capacity Extender as not available in Core. When you downgrade, the confirmation pop-up lists the functionality you lose, so read it before you select OK."
  - q: "Is Standard still an edition?"
    a: "Not for new installations. Nerdio says that before version 6.0 customers could buy Standard or Premium, and that the Core and Premium options apply to new installations from 6.0. Nerdio's April 2024 announcement said Standard would be replaced by Core. If you run an older installation under a contract, follow your agreement or ask your Nerdio contact."
  - q: "What does Nerdio Manager for Enterprise cost?"
    a: "Nerdio's current Enterprise pricing page lists no price for Windows Cloud Core or Windows Cloud Premium and links to a pricing request. An April 2024 Nerdio announcement named $6 (Core) and $10 (Premium) per MAU at the time of the version 6 launch; the announcement does not define the term, but treat those as dated and confirm with Nerdio. Azure costs for VMs, storage and the Nerdio components are separate."
---

[Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) has two editions, Core and Premium, and Premium contains everything in Core plus additional features. Core covers daily management of [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) (AVD), Windows 365 and Intune; the Premium-only items are mostly about advanced scaling, multi-region operation, cost optimisation and cost reporting. This guide lists the differences as Nerdio documents them, points out where Nerdio's own pages disagree, and shows how to check, change and budget for an edition.

## Where the two editions come from

Nerdio's Edition Management page states that Nerdio Manager has two editions, Core and Premium, and that these options apply to new installations from version 6.0. Before 6.0, customers could buy Standard or Premium. Nerdio's April 2024 announcement of version 6 said the Standard edition was retiring and would be replaced by Core, with Premium remaining the edition that includes all features. It described Core as including management features such as the API, custom RBAC roles and the PowerShell module.

Today's Enterprise pricing page uses the labels Windows Cloud Premium and Windows Cloud Core, plus a third column, Physical Endpoint Management, listed at $1 per user per month. The Core and Premium columns carry no price and link to a pricing request. The 2024 announcement named $6 and $10 per MAU for Core and Premium; the current page does not repeat them, so treat the figures as historic.

## What each edition includes

The abridged table follows the feature matrix on Nerdio's Enterprise pricing page, with the Public Preview label for Global Pools added from Nerdio's Global Pools Overview page. The first group is available in both Core and Premium; the second group is marked for Premium only.

| In Core and Premium | Premium only |
|---|---|
| Nerdio Compass and Nerdio Modeler | Advanced AVD Auto-scale |
| Automated Windows Cloud migrations | Global Pools and user distribution (Public Preview) |
| Windows 365 Cloud PC lifecycle management and license management | Multi-region management and business continuity |
| AVD host pool and session host management | Azure Capacity Extender |
| Desktop image management | Intune multi-tenant management |
| AVD Auto-scale and AVD Auto-heal | Executive and operational insights |
| Profile management and self-service portal | Per-user cost reporting |
| AVD Hybrid management, Azure Files and Azure NetApp Files management | |
| Intune endpoint management, Policy Studio, Console Connect | |
| Unified Application Management, WinGet, application deployment policies, App Attach management | |
| Nerdio Advisor and TCO analysis, reporting, Windows 365 and AVD Insights | |
| Scripted Actions and Sequences, custom RBAC roles, REST API | |

Nerdio's entitlement and billing page gives a finer list of Premium-only items, which explains what "advanced" means:

- **AVD management:** Advanced Auto-scale, with multiple auto-scale triggers, intelligent pre-stage, rolling drain mode, a secondary auto-scale configuration and personal host pool auto-grow and auto-shrink; desktop image disk tier optimization; Azure Files and Azure NetApp Files auto-scale; Azure Capacity Extender; Azure API Limit Booster; Global Pools.
- **Insights:** Executive Insights, User Cost Attribution, Operational Efficiency, Auto-scale Analytics, Advisor recommendations for AVD and Log Analytics cost optimization.
- **Infrastructure and endpoints:** multiple Entra ID tenant support, Azure Government support, Intune cross-tenant support and Unified App Management SCCM integration.
- **End users:** advanced self-service actions (resize, re-image, restore, create desktops and others) and custom logo and notifications.

Other Nerdio pages confirm individual items. The auto-scale help page says the multiple auto-scale triggers feature and auto-scale profiles are Premium only. The release notes introduced Global Pools in version 8.1.0 (Public Preview, 21 July 2026) as a Premium-only feature, with only multi-session desktop and RemoteApp experiences supported in that initial release. The 8.2.0 release notes (17 September 2026) list further Global Pools enhancements. Nerdio's Global Pools Overview page, dated 9 November 2026, describes the feature as Public Preview, under active development, and lists it as available in AVD Premium but not AVD Core. The release notes for 8.2.1 to 8.2.3 contain no general-availability announcement for it, and the pricing page lists it without a preview label, which on its own is no evidence of general availability. In our reading, Global Pools is a Premium-only Public Preview feature today. The overview page names limits of the preview, among them multi-session desktop experiences only, no public API and only core host pool profiles.

## Where Nerdio's own pages disagree

Three items show why a table is not enough:

- **Azure Government support.** The pricing matrix marks it for both editions. The entitlement page lists it as Premium only. Nerdio's Azure Government page says Nerdio Manager for Enterprise can be deployed in an Azure Government tenant and names no edition.
- **SCCM integration.** The pricing matrix shows "SCCM integration" in both editions. The entitlement page lists "UAM SCCM integration" as Premium only. The names differ, so the scope may differ too. Nerdio's help page on UAM SCCM integration also says the feature is available only in the Premium edition.
- **Advisor.** The pricing matrix lists Nerdio Advisor and TCO analysis in both editions, while the entitlement page lists "Advisor Recommendations for AVD" as Premium only.

The pages may describe different layers of one feature, or one may be older. Nerdio does not say which. The practical rule is to rely on the live pricing page, the edition pop-up in your console and written confirmation from Nerdio for any feature that carries your design.

## How to check or change the edition

1. Open Nerdio Manager and go to **System > Settings > Nerdio**, as the Edition Management page describes.
2. In the **Product edition** area, select the product edition name.
3. Review the confirmation pop-up. When you downgrade to Core, Nerdio says it lists the functionality you lose access to.
4. Select **OK** to confirm.

Before a downgrade, inventory what you actually use. Open your auto-scale configurations (multiple triggers, profiles, rolling drain mode), Global Pools, Azure Capacity Extender, cost attribution reports and Intune cross-tenant settings, and compare them with the Premium-only list. Nerdio says advanced cost optimization features such as Azure Capacity Extender are not available in Core; it does not describe what happens to each configuration you built with them, so test in a non-production tenant first if you can.

## How billing counts users

Nerdio's entitlement page describes a model that applies to Nerdio's standard terms:

- Each unique user, identified by Entra ID, is billed for one entitlement per calendar month. If several are consumed, the highest is billed.
- A tenant uses one model at a time. Under the **Windows Cloud** model (Core or Premium), one entitlement covers a user who launches an AVD session, is the primary user of a Windows 365 Cloud PC, or both. Under the **AVD** model the hierarchy is AVD, then Windows 365, then Unified Endpoint Management.
- AVD usage counts by session launches; Windows 365 Cloud PCs and physical endpoints count by Intune primary user assignment.
- The edition selected in the console decides whether Core or Premium is billed. The entitlement page places that setting under System > Settings > Nerdio > Services Managed > Azure Virtual Desktop.
- Marketplace customers see charges on their Microsoft invoice. Partner customers should ask their partner. Custom agreements override the standard model.

Under this model, a user who launches sessions in March and never signs in during April is billed in March only, provided the user is also not the Intune primary user of a Windows 365 Cloud PC or a physical endpoint in April. Nerdio's licensing page adds that there are no long-term commitments and that installation from the Azure Marketplace starts a 30-day trial. A separate Nerdio blog post from 1 April 2022 announced that all new trials would be the Premium edition; that post is old, so check which edition your trial shows.

## Choosing between them

| Your situation | What the sources suggest |
|---|---|
| One region, schedule-based scaling, a few host pools | Core lists AVD Auto-scale, Auto-heal, image and profile management. Compare with native autoscale first. |
| Demand that follows CPU, RAM or session counts, with several triggers | Multiple triggers are Premium only. The auto-scale help page does not mark the single triggers as Premium. |
| Users spread across regions, failover needs | Global Pools (Public Preview) and multi-region management are Premium only. |
| Showback or per-user cost reports for finance | Per-user cost reporting and User Cost Attribution are Premium only. |
| Large environments close to Azure capacity or API limits | Azure Capacity Extender and API Limit Booster are Premium only. |
| Several Entra ID tenants | Multiple Entra ID tenant support and Intune cross-tenant support are Premium only. |
| Scripts, API access, custom roles, app deployment | Listed in both editions on the pricing matrix. |

## Limits of this comparison

- Nerdio changes packaging between releases. The feature table reflects Nerdio's pricing page as of 17 November 2026; that page carries no date. The entitlement page shows 6 November 2026 and the Edition Management page 9 November 2026.
- Your contract may differ. Nerdio's entitlement page says custom agreements follow their own terms.
- Native Azure Virtual Desktop already offers power management autoscaling and, for pooled host pools with session host configuration, dynamic autoscaling. Test whether a Premium-only scaling feature solves a problem you have, not just one you can name.

## Sources

- [Nerdio help center (Enterprise): Nerdio Manager Edition Management](https://nmehelp.getnerdio.com/hc/en-us/articles/25499386018701-Nerdio-Manager-Edition-Management)
- [Nerdio help center (Enterprise): NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio help center (Enterprise): Subscribe to a License of Nerdio Manager](https://nmehelp.getnerdio.com/hc/en-us/articles/25499377095053-Subscribe-to-a-License-of-Nerdio-Manager)
- [Nerdio help center (Enterprise): Enable dynamic host pool Auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
- [Nerdio help center (Enterprise): UAM: SCCM integration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124368428045-Unified-Application-Management-SCCM-Integration)
- [Nerdio help center (Enterprise): Nerdio Manager in Azure Government: What to know](https://nmehelp.getnerdio.com/hc/en-us/articles/40495096260493-Nerdio-Manager-in-Azure-Government-What-to-know)
- [Nerdio help center (Enterprise): Global Pools Overview](https://nmehelp.getnerdio.com/hc/en-us/articles/47890093534477-Global-Pools-Overview)
- [Nerdio help center (Enterprise): Release Notes](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Nerdio: Enterprise pricing and feature table](https://getnerdio.com/pricing/enterprise/)
- [Nerdio: Nerdio's 2024 product initiatives (Enterprise 6 and MSP 5)](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Nerdio: Introducing Nerdio Manager for Enterprise Premium](https://getnerdio.com/blog/introducing-nerdio-manager-enterprise-premium/)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
