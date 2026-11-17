---
title: "Reserved Instance management in Nerdio: guided purchases"
summary: "Nerdio's help covers two separate reservation features: RI analytics in Nerdio Manager for Enterprise recommends a region, VM family and core count from a host pool's auto-scale history, and Reservations Management in Nerdio Manager for MSP buys and tracks Azure reservations. Only RI analytics produces a recommendation; Nerdio's cost-data page says Nerdio Manager cannot calculate figures using existing reservations or savings plans, and the RI analytics page does not say whether it nets them out."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-reserved-instance-management, nerdio-manager-for-enterprise]
keypoints:
  - "Nerdio's help describes two separate pieces: RI analytics (Nerdio Manager for Enterprise) recommends a region, VM family and total CPU cores from a dynamic host pool's auto-scale history, and Reservations Management (Nerdio Manager for MSP) purchases, tracks and monitors reservations. Only RI analytics gives a recommendation."
  - "RI analytics is reached from a dynamic host pool's more actions menu under Auto-scale > RI analytics. It shows CPU-hours for the chosen dates and projected CPU-months (based on 730 hours per month), and the cores can be bought in any mix of VM sizes inside the recommended family and region."
  - "Purchasing in Nerdio Manager for MSP needs Customer Permissions in Partner Center, a Reservation Administrator role (Reservations Administrator in Nerdio's command) plus Subscription Owner for the authorising user, and authorisation under Settings > Integrations. Pay-as-you-go and CSP subscriptions are supported, with CSP conditions."
  - "Nerdio's cost-data page says Nerdio Manager cannot calculate figures using Microsoft Reserved Instances or Savings Plans. Our reading: RI analytics does not net out commitments you already hold, so subtract them yourself. Learn says Azure's own recommendation engine excludes existing reservations and savings plans."
  - "A reserved VM instance discounts compute only. Learn says it does not cover Windows software, networking or storage, and does not reserve or guarantee capacity."
faq:
  - q: "Does Nerdio buy reservations on its own?"
    a: "Only on a user's request, with one exception. Nerdio's Reservations Management article describes purchases made by a signed-in Nerdio Manager for MSP user who holds the Accounts.Reservations.Purchase role, after an administrator has authorised the integration. The exception is the Auto renew option in the purchase form, which Nerdio says automatically purchases a new reservation on the expiration date. RI analytics in Nerdio Manager for Enterprise only shows a recommendation; the article describes no purchase step."
  - q: "Are the savings percentages in Nerdio's article what I will get?"
    a: "Treat them as Nerdio's typical averages, not as your rate. The RI analytics article says the average discount is about 40 percent for a 1-year and about 60 percent for a 3-year reservation. Learn says reservations save up to 72 percent from pay-as-you-go prices, so check the Azure price for your own size, region and term before buying."
  - q: "Is RI analytics the same as Azure's reservation recommendations?"
    a: "No. Nerdio builds its recommendation from one host pool's auto-scale history over a date range you pick. Learn says Azure's engine evaluates hourly usage in a scope over the past 7, 30 and 60 days, simulates costs for different quantities and excludes reservations and savings plans you already own. Nerdio does not document the exact formula behind its recommendation."
---

Nerdio's help covers reservations in two separate features, and only one of them recommends anything. In Nerdio Manager for Enterprise, **RI analytics** reads a dynamic host pool's auto-scale history and recommends a region, a VM family and a number of CPU cores to reserve. In Nerdio Manager for MSP, **Reservations Management** lets a partner buy an Azure reservation, track its utilisation and receive renewal reminders.

This article explains what each feature does, what it needs and where its view stops. For the choice between a reservation and a savings plan, see [Reservations or savings plans for AVD: which to buy](/community/u/mirko-p/blog/reservations-or-savings-plans-for-avd-which-to-buy/) and the entity pages for [Azure Reservations](/entity/azure-reservations/) and [Azure savings plans](/entity/azure-savings-plans/). The companion article [Reservations for AVD: how many to buy and what to avoid](/community/u/mirko-p/blog/reservations-for-avd-how-many-to-buy-and-what-to-avoid/) covers sizing.

## What Nerdio documents

| | RI analytics | Reservations Management |
|---|---|---|
| Product | [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) help | [Nerdio Manager for MSP](/entity/nerdio-manager-for-msp/) help |
| Job | Recommend what to reserve | Purchase and track reservations; renewal reminders |
| Input | Auto-scale history of one dynamic host pool, for a date range you choose | Your decision; the purchase form asks for name, term, billing plan, region, VM series and quantity |
| Output | Region, VM family and total CPU cores | A purchased Azure reservation and a utilisation rate |

Nerdio's release post for Nerdio Manager for MSP 5.0, dated 2 April 2024, introduced [Nerdio Reserved Instance Management](/entity/nerdio-reserved-instance-management/). It says the feature was built from partner feedback to "guide Reserved Instance purchases based on recommendations" while keeping the right resources available when needed. It gives no technical detail. The RI analytics article calls the feature "a simple guide" that looks at a host pool's auto-scale history and provides RI recommendations, and describes only that recommendation. The Reservations Management article does not use the word "guide"; it describes purchase, tracking, utilisation and renewal reminders, and gives no quantity recommendation. Neither article mentions the other, and a feature request on Nerdio's community forum asks whether RI analytics, which exists in Nerdio Manager for Enterprise, can be added to Nerdio Manager for MSP. Do not assume one product line has both. The RI analytics article states no edition requirement, so confirm your entitlement first.

## RI analytics: how the recommendation is built

The starting point is a premise in Nerdio's article: it rarely makes sense to reserve every host of every pool when [auto-scaling](/entity/nerdio-auto-scaling/) is in use, but it can make sense to reserve the cores that remain after auto-scaling has reduced demand. Nerdio gives a worked illustration: auto-scaling might reduce a pool from 100 cores to 25 for a typical 40-hour week, and the 25 cores can then be reserved.

To generate a recommendation, Nerdio's steps are:

1. Locate the dynamic host pool you want to analyse.
2. Open the more actions menu and select Auto-scale > RI analytics.
3. Select the date range. The metrics and recommendations are based on it.
4. Read the metrics and the recommendation, then select Close.

The page shows two metrics:

- **CPU-hours for select dates**: the hours the VMs were powered on, multiplied by the cores in each VM, over the range.
- **Projected CPU-months**: a projection of how many CPU cores are fully consumed on a monthly basis, based on 730 hours in a month.

From these, Nerdio recommends a **region**, a **VM family** and a **total number of CPU cores**. You can buy those cores in any combination of VM sizes inside the recommended family and region. Nerdio's example: for 100 recommended cores, buy three 32-core VMs and one 4-core VM.

Two limits apply to what you can conclude. First, the article does not say how the core number is derived from the two metrics, so you cannot reproduce it by hand from the article alone. The companion article on how many to buy shows how to test a number against your own hourly profile. Second, the metric counts powered-on hours. Microsoft Learn says stopped VMs are billed and continue to use reservation hours, while deallocated or deleted VMs release them. Our reading: a host that is stopped but not deallocated may not count as powered on in Nerdio's metric yet still consume reservation hours, so confirm in Azure that your off-hours hosts are deallocated.

The article states that the average discount is about 40 percent for a 1-year reservation and about 60 percent for a 3-year reservation, compared with pay-as-you-go. Learn's overview says reservations save up to 72 percent from pay-as-you-go prices. Check the rate for your own size, region and term.

## Reservations Management: set-up and purchase

Nerdio's article says partners have trouble knowing whether they bought the right amount of reservations and Azure Hybrid Benefit, and that the feature helps them purchase, track, monitor utilisation and generate renewal reminder alerts. The alert settings are not described.

### Prerequisites

Purchasing in Nerdio Manager is limited to certain scenarios. The article lists pay-as-you-go and CSP subscriptions as supported, with these conditions for CSP:

- Your CSP must allow customer permissions to buy their own services.
- Tier 1 Cloud Solution Providers are supported.
- Tier 2 providers are supported if their distributor allows self-service reservation purchases. The article says Pax8 has confirmed support and tells you to ask other distributors.

Set-up has three parts, each in the article:

1. **Partner Center.** Sign in with a user holding the Admin Agent role for the customer, open the customer's account page, edit Customer Permissions and allow customers to purchase Azure Reservations. The article says these permissions are off by default.
2. **Azure role.** The account that authorises Nerdio Manager needs the Reservation Administrator role and the Subscription Owner role. Nerdio's text says "Reservation Administrator", but its command uses the name Reservations Administrator. The article assigns the role from Cloud Shell, with an account that has Global Admin permissions, using `New-AzRoleAssignment -Scope "/providers/Microsoft.Capacity" -PrincipalId <EntraId User ObjectId> -RoleDefinitionName "Reservations Administrator"`. If you get a Forbidden error, elevate access to manage all Azure subscriptions and management groups.
3. **Authorise in Nerdio Manager.** At the account level, go to Settings > Integrations, select Authorize in the Reserved Instance Management area, sign in, consent on behalf of the organisation, then switch the area from Disabled and confirm.

Within Nerdio Manager, purchasing needs the Accounts.Reservations.Purchase role and viewing needs Accounts.Reservations.Read.

### Two ways to purchase

**Separately.** At the account level, go to Settings > Azure, find the Reservations section and select Purchase. The form asks for name, term, billing plan, auto renew, subscription, region, VM series and quantity. Nerdio says Auto renew automatically purchases a new reservation on the expiration date. The article notes that by default Nerdio Manager uses instance size flexibility, so a reservation for a D2s_v3 still applies if the matching VM changes to a D4s_v3.

**While deploying.** The Manually Create a Session Host article describes a Purchase Reserved Instance toggle under Hosts > Add new for a host pool. It buys a reservation for the same VM size and region as the VMs being created. You supply name, term, billing plan, auto renew and agreement to the license terms. The Reservations Management article adds that Nerdio Manager matches the VM size, region and quantity of the resources you are adding.

In our reading, that convenience has a catch: a reservation sized to the hosts you are adding reflects the deployment, not the number of hosts that run every hour. Work out the quantity that stays on first, then buy it.

### Tracking

The Reservations section under Settings > Azure shows a utilisation rate. Nerdio says to aim for close to 100 percent, that a lower rate suggests too many reservations and a rate above 100 percent suggests additional reservations may be cost effective, and that Microsoft allows returns only in specific cases. Learn sets the limits: refunds are capped at USD 50,000 of cancelled commitments in a 12-month rolling window, and reservations bought after 1 February 2027 are not exchangeable where savings plans support the service.

## Where the figures stop

Nerdio's page on where cost data appears says that the cost figures from Nerdio Advisor, Auto-Scale Savings and user cost attribution are estimates and projections based on Microsoft's published pricing and observed environment usage, and may differ from reconciled Azure billing. Under Limitations it adds that Nerdio Manager cannot calculate figures using customers' Microsoft Reserved Instances or Savings Plans, because the product has no access to them under its existing permissions. The page does not mention RI analytics.

Our reading, which Nerdio does not spell out for RI analytics: a recommendation is not netted against reservations or savings plans you already hold, so you must subtract existing coverage yourself. Learn says Azure's own engine does exclude existing reservations and savings plans.

Learn adds limits for reserved VM instances, which is the kind Nerdio's analytics recommends:

- The discount covers the compute part of VM usage. It does not cover Windows software, networking or storage; Azure Hybrid Benefit can cover Windows licensing.
- A reserved instance is a billing discount only and does not reserve or guarantee capacity.
- Azure does not offer reservations for Spot VMs.
- From 1 July 2026, several older series, including Dv3, Dsv3, Ev3 and Esv3, can no longer be bought or renewed as reservations; Learn's transition guide lists them all. Nerdio's pages do not say whether a recommended family could be one of them, so check the family before you buy.

## Nerdio's recommendation next to Azure's

| | Nerdio RI analytics | Azure recommendation engine |
|---|---|---|
| Data | Auto-scale history of one dynamic host pool, date range you choose | Hourly usage in a scope over the past 7, 30 and 60 days |
| Unit | CPU cores in a VM family and region | Quantity of a VM size |
| Existing commitments | Nerdio's cost-data page says Nerdio Manager cannot calculate figures using them; the RI analytics page is silent (our reading: not netted out) | Excluded from the recommendation, per Learn |
| Where | Host pool menu in Nerdio Manager for Enterprise | Azure Advisor (single subscription), purchase pages, API |

Learn also warns that if resources are shut down regularly the simulation can find no savings and give no recommendation, and, under its notes on API behavior, that with a 7-day look-back you might get none when VMs are shut down for more than a day. Our reading: a pool that scales to zero can therefore show a Nerdio figure and no Azure one. Use both as inputs and compare the numbers with your own hourly profile.

The Modeler in Nerdio Advisor (Observability > Advisor > Models) has a Reserved instances field for the number of reservations and the term. Nerdio's page says it only generates estimates. See [Nerdio Advisor](/entity/nerdio-advisor/) for what it can and cannot model.

## Sources

- [Nerdio Help: Auto-scale: Reserved instances analytics (RI)](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388632205-Auto-scale-Reserved-instances-analytics-RI)
- [Nerdio Help (NMM): Reservations Management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125616109325-Reservations-Management)
- [Nerdio Help (NMM): Manually Create a Session Host](https://nmmhelp.getnerdio.com/hc/en-us/articles/29488415751437-Manually-Create-a-Session-Host)
- [Nerdio Help: Where does NME show me Azure cost data?](https://nmehelp.getnerdio.com/hc/en-us/articles/48618389927565-Where-does-NME-show-me-Azure-cost-data)
- [Nerdio Help (NMM community): Port Auto-scale Reserved Instances analytics from NME to NMM](https://nmmhelp.getnerdio.com/hc/en-us/community/posts/40908023204365-Port-Auto-scale-Reserved-Instances-analyitics-from-NME-to-NMM)
- [Nerdio Help: Modeler overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356019981-Modeler-overview)
- [Nerdio: Unveiling Nerdio Manager for Enterprise 6.0 and MSP 5.0](https://getnerdio.com/blog/unveiling-nerdio-manager-for-enterprise-6-and-nerdio-manager-for-msp-5/)
- [Microsoft Learn: What are Azure Reservations?](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Microsoft Learn: Prepay for Azure virtual machines to save money](https://learn.microsoft.com/en-us/azure/virtual-machines/prepay-reserved-vm-instances)
- [Microsoft Learn: Azure reservation recommendations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reserved-instance-purchase-recommendations)
- [Microsoft Learn: Determine what Azure reservation you should purchase](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/determine-reservation-purchase)
- [Microsoft Learn: Understand Azure Reserved VM Instances discount](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges)
- [Microsoft Learn: Self-service exchanges and refunds for Azure Reservations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations)
- [Microsoft Learn: Transition guide for retired Azure Reserved VM Instances](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/manage-legacy-vm-reservations-after-july-1-2026)
