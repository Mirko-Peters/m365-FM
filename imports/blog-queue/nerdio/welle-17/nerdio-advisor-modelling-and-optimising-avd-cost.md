---
title: "Nerdio Advisor: modelling and optimising AVD cost"
summary: "Nerdio Advisor in Nerdio Manager models the cost of a planned Azure Virtual Desktop deployment and gives recommendations for existing ones, such as right-sizing. Its figures are estimates, not an Azure invoice."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-advisor, nerdio-manager-for-enterprise]
keypoints:
  - "Nerdio Advisor has two jobs: the Modeler estimates a host pool design's cost before deployment (Observability > Advisor > Models), and rules produce recommendations for existing resources."
  - "Rules are criteria you create. Nerdio lists six, covering right-sizing for AVD and Cloud PCs, Platform TCO for AVD personal and Cloud PC Enterprise, and licence suitability."
  - "Admins apply a recommendation now or on schedule, optionally messaging users, in bulk, or hide it for 7 days or permanently. Nerdio recommends 1 to 4 weeks of data before accepting changes."
  - "The figures are estimates. Nerdio says it cannot calculate with Reserved Instances or Savings Plans, and the Modeler warns that actual costs vary with usage and price changes."
  - "Nerdio's sources disagree on editions: the entitlement page lists Advisor Recommendations for AVD as Premium-only, the pricing page lists it for Premium and Core. Confirm your licence."
faq:
  - q: "Is Nerdio Advisor the same as Azure Advisor?"
    a: "No. Azure Advisor is Microsoft's built-in service that gives recommendations across Azure resources, and it looks at VMs generally. Nerdio Advisor is part of Nerdio Manager and works on host pools, with rules for AVD pooled and personal desktops, Cloud PCs and licences, and it can apply a size change from its own recommendation page. The two use different thresholds and lookback periods, so they can disagree."
  - q: "Do I need Nerdio Manager to model an AVD deployment?"
    a: "Not for a first estimate. Nerdio publishes a free AVD Modeler web tool on its site and describes it as the first in its Nerdio Advisor suite of cost modeling and optimization tools. The in-product Modeler sits under Observability > Advisor > Models in Nerdio Manager and can import and export models as JSON files."
  - q: "Does Nerdio Advisor change my environment by itself?"
    a: "The Recommendations help page describes actions you choose: Apply (now or scheduled, with optional messaging to active users), bulk apply, and hide for 7 days or permanently. It does not describe automatic application. Treat every recommendation as a proposal and check it against how your users work."
---

Nerdio Advisor is a set of capabilities inside [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) with two jobs. It models what an Azure Virtual Desktop deployment should cost before any Azure resource exists, and it analyses existing deployments to recommend changes, such as a different VM size. Both outputs are estimates, and this article explains what each job needs, what it returns and where it stops.

Nerdio introduced [Nerdio Advisor](https://www.m365.fm/entity/nerdio-advisor/) in 2023 according to its April 2024 release announcement, which describes the models as a way "to fully understand the costs before deploying any Azure resources" and the recommendations as a way to "continuously optimize an existing deployment". This guide describes Nerdio's own documentation; the claims are the vendor's, and the numbers your environment produces will differ.

## Where Advisor sits in Nerdio Manager

In the Nerdio Manager portal, Advisor lives under Observability. The Nerdio help center's Advisor section covers the Modeler, rules, the Recommendations dashboard and a CO2 report. The menu paths in the help pages are:

- **Observability > Advisor > Models** for the Modeler.
- **Observability > Advisor > Rules** to create the criteria that drive recommendations.
- **Observability > Advisor > Recommendations** to review and act on the results.

The Modeler works from the inputs you enter, so it can run before deployment. Rules and recommendations work after deployment and depend on usage data that Nerdio Manager collects from your host pools.

## Job 1: modelling a deployment before you build it

The Modeler produces cost estimates and optimization recommendations for new host pools. Nerdio's help describes a guided flow. You add a model, give it a name and then describe each host pool in turn:

1. **General.** Host pool or Windows 365 group name, total number of users with access (the help says this is not concurrent users), desktop experience and Azure region. The desktop experiences are Windows 365 Cloud PC, multi-user desktop (pooled), multi-user RemoteApp (pooled), single-user desktop (pooled) and single-user desktop (personal).
2. **Compute.** Workload type, Azure Reserved VM Instances (count and term), VM size, disk size and the disk type used while a VM is stopped. Users per vCPU and network egress per user can be edited only with the Custom workload type.
3. **Image.** A marketplace offer or a custom image. For a custom image you set the VM size and monthly VM running hours.
4. **Work hours.** Standard working days and hours, the percentage of absent users and, where some staff work outside standard hours, the percentage of those users and their average extra hours.
5. **FSLogix.** Whether profiles are used, where they are stored and the profile size (default 30 GiB). Shared pools default to Azure Files and dedicated pools to local storage.
6. **Administrative.** Optional admin tasks, hours per task and a custom hourly rate.

The Review step shows predicted cost per host pool, cost per user and a comparison with a standard "always on" deployment. An Advanced details view shows the calculation inputs.

Global settings add commercial context. You can enter an Azure Enterprise Agreement discount (use 0% if you have none), a Windows 365 discount, an Azure Government option, and Nerdio Manager licence and resource costs. The help states that selecting a Nerdio Manager licence option adds a minimum of USD 1,000 per month to the model. It lists the options as Standard, Premium or Custom, while Nerdio's 2024 announcement said the Standard edition was being replaced by Core, so read the labels in your own portal.

Models can be cloned and exported as JSON, and a JSON file can be imported again. That makes it practical to keep a baseline model and clone variants of it.

Nerdio also publishes a free AVD Modeler web tool, which its page describes as the first in a suite of cost modeling and optimization tools under the Nerdio Advisor name. It takes host pool sizing, working hours, desktop performance, enterprise discounts and Reserved Instance pricing. The web version asks you to enter contact details and confirm by email to see the full review.

## Job 2: finding savings in an existing deployment

For deployed resources, Advisor works through rules. A rule defines how an analyzer assesses resource usage and what triggers a recommendation. The Nerdio help lists six:

| Rule | Applies to |
|---|---|
| Right-size AVD personal desktops | Personal host pools |
| Right-size AVD pooled desktops | Pooled host pools |
| Platform TCO (AVD personal) | Compares a personal desktop with a target platform, preset to Windows 365 Enterprise |
| Right-sizing Cloud PC | Windows 365 Cloud PCs |
| Platform TCO (Cloud PC Enterprise) | Cloud PC Enterprise |
| License suitability (Cloud PC Enterprise and Flex) | Windows 365 licences |

Learn says Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026, with product, licensing and capabilities unchanged. Older Nerdio help pages still use the Frontline name.

### What the right-sizing rules look at

The pooled and personal right-sizing rules share their logic, per the help pages. By default they compare the 90th percentile of CPU and memory use over the last 30 days with an 80% increase trigger and a 60% decrease trigger. (The trigger descriptions on the rule page say "average", while its data sections use the 90th percentile; this article follows the data sections.) At least 72 hours of power-on time are needed for a reliable result, A and B-series sizes are excluded, and Nerdio stores and shows the first three candidate sizes. The pooled rule needs a dynamic host pool with auto-scale on and CPU and RAM collection enabled, while the personal rule reads from a [Log Analytics](https://www.m365.fm/entity/log-analytics/) workspace linked to the host pool.

[Nerdio host pool and VM right-sizing](https://www.m365.fm/entity/nerdio-right-sizing/) has its own entity page. Reading the figures is covered in "VM right-sizing in Nerdio: reading the utilisation recommendations", and a worked example is "Right-sizing host pools with Nerdio Advisor: a worked example".

### Acting on a recommendation

On the Recommendations page you can filter by rule, status and scope. Each recommendation can be applied now or on a schedule (optionally with a message to active users first), applied in bulk, or hidden for 7 days or forever. Nerdio recommends gathering 1 to 4 weeks of data before accepting changes; "Acting on right-sizing recommendations safely" covers the apply step.

## What the numbers are, and what they miss

Two statements in Nerdio's documentation shape how much weight to put on Advisor output.

First, the Modeler "only generates estimates". Actual costs vary with usage, price changes and other factors. The Modeler does not include Log Analytics workspace costs. Nerdio's pricing page advertises "75% Azure compute savings" for Nerdio Manager without stating a method or baseline, so treat that as marketing, not a forecast for your model. The model reflects your inputs, so a wrong working-hours assumption gives a wrong answer.

Second, Nerdio's page on where cost data appears says Advisor, auto-scale savings and user cost attribution figures are estimates based on public pricing and observed usage, so they may differ from Azure billing. It also says Nerdio Manager cannot account for Microsoft Reserved Instances or Savings Plans because it lacks the permissions to see them. The Modeler accepts a Reserved Instance count and term as an input, but the recommendation views for deployed resources cannot see your existing commitments. If you hold [Azure Reservations](https://www.m365.fm/entity/azure-reservations/) or [savings plans](https://www.m365.fm/entity/azure-savings-plans/), compare a proposed size change with those commitments before applying it. Microsoft documents the same hazard for Azure Advisor: cross-series changes can increase cost if reservations cover the original SKUs.

For cost actuals, the same page points elsewhere: Executive Insights uses the Azure Cost Management API and needs read access enabled per subscription, and [user cost attribution](https://www.m365.fm/entity/nerdio-finops-user-cost-attribution/) depends on correct resource tagging.

## Advisor next to Azure Advisor

[Azure Advisor](https://www.m365.fm/entity/azure-advisor/) also gives VM resize recommendations, so a fair question is whether you need both. They differ in method:

| | Azure Advisor (Microsoft Learn) | Nerdio Advisor right-sizing (Nerdio help) |
|---|---|---|
| Scope | VMs and scale sets in general | AVD host pools, plus Cloud PC and licence rules |
| Lookback | 7 days by default, configurable up to 90 | 30 days by default |
| Metrics | CPU, memory and outbound network | CPU and memory |
| Trigger logic | Target utilisation on the new SKU, for example P95 CPU at or below 40% for user-facing workloads | 60% and 80% triggers on the 90th percentile, adjustable per rule |
| Reservations | Not considered | Not visible to Nerdio Manager |
| Acting on it | Recommendation in Azure | Apply or schedule from the recommendation, with optional user messaging |

Because the methods differ, the two can disagree, and neither is automatically right. A practical use is to treat disagreement as a prompt to look at the pool's actual usage.

## Editions and availability

Nerdio's own sources point in different directions, so the edition question is open. Its entitlement and billing page lists "Advisor Recommendations for AVD" among the features that require a Premium entitlement and are not included with Windows Cloud Core or AVD Core. Nerdio's current pricing page ticks "Nerdio Advisor and TCO analysis" for both Windows Cloud Premium and Core, and "Nerdio Modeler" for Premium, Core and Physical Endpoints; it gives no public prices for Premium or Core ("Request pricing"). The April 2024 announcement, written when Core was replacing Standard, says Premium remains the edition with all features and lists continuous cost optimization recommendations among its advanced features. The Edition Management help page says Premium includes all Core features plus others and that advanced cost optimization features are not supported in Core, citing Azure Capacity Extender as its example. The Advisor rules and Recommendations help pages themselves name no edition.

Our reading: the pricing page puts the Modeler in every edition, and the disagreement concerns the recommendations. Confirm with Nerdio what your licence includes before building a plan on Advisor.

## When Advisor helps, and when it does not

Advisor helps when you are comparing designs before purchase, when pools were sized once and never revisited, and when you need a documented basis for a resize. It helps less when a pool has little history (under 72 hours of power-on time gives weak results), when workloads are bursty in ways a 30-day percentile smooths over, or when Reserved Instances drive your cost. In those cases Azure Cost Management and a pilot with real users stay necessary.

## Sources

- [Nerdio help center (Enterprise): Nerdio Advisor section](https://nmehelp.getnerdio.com/hc/en-us/sections/19703455958029-Nerdio-Advisor)
- [Nerdio help center (Enterprise): Modeler overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356019981)
- [Nerdio help center (Enterprise): Web-based Nerdio Manager for Enterprise Modeler Help](https://nmehelp.getnerdio.com/hc/en-us/articles/26124326402189-Web-based-Nerdio-Manager-for-Enterprise-Modeler-Help)
- [Nerdio help center (Enterprise): Rules overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124386088973--Rules-overview)
- [Nerdio help center (Enterprise): Rules: Right-size AVD pooled desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/48236074482957-Rules-Right-size-AVD-pooled-desktops)
- [Nerdio help center (Enterprise): Rules: Right-size AVD personal desktops](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376589965-Rules-Right-size-AVD-personal-desktops)
- [Nerdio help center (Enterprise): Rules: Platform TCO (AVD personal)](https://nmehelp.getnerdio.com/hc/en-us/articles/35702669311373-Rules-Platform-TCO-AVD-personal)
- [Nerdio help center (Enterprise): Recommendations dashboard](https://nmehelp.getnerdio.com/hc/en-us/articles/26124376554381-Recommendations-dashboard)
- [Nerdio help center (Enterprise): Where does NME show me Azure cost data?](https://nmehelp.getnerdio.com/hc/en-us/articles/48618389927565-Where-does-NME-show-me-Azure-cost-data)
- [Nerdio: Unveiling Nerdio Manager for Enterprise 6 and Nerdio Manager for MSP 5](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Nerdio: Free AVD Modeler tool](https://getnerdio.com/pricing/enterprise/free-avd-modeler-tool/)
- [Nerdio: Nerdio Manager for Enterprise pricing and feature matrix](https://getnerdio.com/pricing/enterprise/)
- [Nerdio help center (Enterprise): NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio help center (Enterprise): Nerdio Manager Edition Management](https://nmehelp.getnerdio.com/hc/en-us/articles/25499386018701-Nerdio-Manager-Edition-Management)
- [Microsoft Learn: Right-size or shut down underutilized virtual machines (Azure Advisor)](https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations)
- [Microsoft Learn: What's new in Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/enterprise/whats-new)
