---
title: "Reservations or savings plans for AVD: which to buy"
summary: "Buy a reservation for session host compute that stays in one VM family and region every hour, and a compute savings plan where size, family or region may change. For session hosts, both discount only the VM compute part and both lose unused hours, so size them to the hosts you always run, not to peak."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-reservations, azure-savings-plans]
keypoints:
  - "A reservation commits to a specific instance type or family in a specific region. A compute savings plan commits to an hourly spend across eligible compute services in all regions. Learn says reservations offer deeper discounts but suit stable, predictable usage, while savings plans suit changing workloads."
  - "Both are use-it-or-lose-it each hour. For session hosts, a VM reservation covers only the compute part of VM usage, and a compute savings plan does not cover software, networking or storage."
  - "Autoscale leaves hours with no running host. In a worked example with invented rates, reserving the always-on floor of 2 hosts pays off, while reserving 2 hosts in a pool that scales to zero overnight loses money."
  - "Savings plans cannot be cancelled, refunded or exchanged. Reservations can be refunded up to USD 50,000 in a 12-month rolling window, and Learn says reservations bought after 1 February 2027 lose exchange rights for services that savings plans support."
  - "Since 1 July 2026 several older VM series, including Dsv3 and Ev3, can no longer be bought or renewed as reserved instances. Learn points to a compute savings plan as the alternative."
faq:
  - q: "Can I use a reservation and a savings plan for the same AVD environment?"
    a: "Yes. Learn says Azure applies reservation benefits first, because they are more restrictive and usually give greater discounts, and the savings plan then covers eligible usage up to its hourly commitment."
  - q: "Do reservations or savings plans guarantee that my session hosts will start?"
    a: "No. Learn says reserved VM instances provide a billing discount only and do not reserve or guarantee compute capacity, and Microsoft's savings plan pricing page says savings plans do not infer capacity guarantees. For guaranteed capacity it points to on-demand capacity reservations, which can be combined with reserved VM instances."
  - q: "What happens to a commitment when autoscale turns my hosts off?"
    a: "The hours are not carried forward. Learn says that when VMs are deallocated or deleted, a reservation applies to another matching resource in its scope, and if there is none, the reserved hours are lost. A savings plan's unused hourly commitment expires in the same way."
---

Buy a reservation for compute that will run in the same VM family and region every hour of the term, and a compute savings plan for compute that may change size, family or region. For session hosts the decision usually comes down to one question: how many hours per week does a host run no matter what autoscale does? Commit to that floor, not to the peak.

This article compares [Azure Reservations](/entity/azure-reservations/) and [Azure savings plans](/entity/azure-savings-plans/) for [Azure Virtual Desktop](/entity/azure-virtual-desktop/) session hosts, based on Microsoft Learn.

## What each one commits you to

Learn's cost page says VM instances usually cost the most of a session host's components, and lists autoscale, savings plans and reserved VM instances as ways to reduce compute cost.

| | Reservation (reserved VM instance) | Compute savings plan |
|---|---|---|
| You commit to | A specific instance type or family in a specific region | A fixed hourly spend on eligible compute |
| Term | One or three years | One or three years |
| Applies to | Matching VMs in the chosen scope | Eligible compute across all regions: Virtual Machines, App Service, Functions Premium, Container Instances, Dedicated Host, Container Apps, Spring Apps Enterprise |
| Discount | Up to 72 percent from pay-as-you-go, per Learn | Up to 65 percent, per Learn's training module (the pricing page says estimated savings range from 11 to 65 percent); rates vary by product and term, not commitment amount |
| Scope options | Resource group, subscription, shared, management group | Resource group, subscription, management group, shared |
| Cancel or exchange | Refund up to USD 50,000 in 12 months; exchange rules below | Cannot be cancelled, refunded or exchanged |

Learn's decision page recommends reservations for continuous, stable workloads and savings plans for dynamic ones or workloads moving between regions.

## How the discount is applied each hour

Both models are matched against running VMs hour by hour, and both lose unused hours.

- **Reservations.** Learn says the discount applies to running VMs that match the scope and attributes, and a reservation is "use-it-or-lose-it": with no matching resource in an hour, that quantity is lost and cannot be carried forward. Stopped VMs are billed and keep using reservation hours, so deallocate rather than only shut down. Per the autoscale scenarios page, power management autoscaling deallocates the hosts it turns off, while dynamic autoscaling can delete them.
- **Savings plans.** Each hour the plan discounts eligible usage until the commitment is reached, starting with the product that has the greatest discount. Usage above the commitment is billed at pay-as-you-go rates, and the unused part of an hour's commitment expires.
- **Order.** Learn says reservations are applied before savings plans, and a narrower-scoped plan is applied before a broader one.

A deallocated host frees its hours for other matching VMs in the same scope, so a shared scope can recover hours one pool leaves empty, but only if other matching VMs run then.

## What neither one covers

- **Windows software.** A reserved instance covers infrastructure, not software costs. Compute savings plans likewise exclude software, and Learn notes that [Azure Hybrid Benefit](/entity/azure-hybrid-benefit/) might cover licensing. The reservation software-cost page lists Windows Server meters by core count and does not mention multi-session images or Azure Virtual Desktop, so check your own usage data for software meters on your session hosts.
- **Storage and networking.** Learn says a VM reservation covers only the compute part of VM usage, and compute savings plans do not cover networking or storage.
- **Spot VMs.** Learn says Azure does not offer reservations for [Spot VMs](/entity/azure-spot-virtual-machines/). Its Spot VM article does not say whether savings plans apply, so confirm that first.
- **Capacity.** Learn says reserved VM instances provide a billing discount only and do not guarantee compute capacity. Microsoft's savings plan pricing page says savings plans "do not infer capacity guarantees".
- **Older VM series.** Learn says that from 1 July 2026 one-year reserved instances for Av2, Amv2, Bv1, D, Ds, Dv2, Dsv2, F, Fs, Fsv2, G, Gs, Ls and Lsv2, and one- and three-year reserved instances for Dv3, Dsv3, Ev3 and Esv3, can no longer be purchased or renewed. Existing ones run to the end of their term. If your host pools run on one of these series, the savings plan is Learn's suggested alternative, or you can move to a newer size.

## Worked example: an autoscaled pool

The numbers are invented. Assume a pooled host pool with this schedule from Monday to Friday: 2 hosts from 07:00 to 09:00, 8 hosts from 09:00 to 17:00, 4 hosts from 17:00 to 19:00, and a minimum of 2 hosts otherwise, including all weekend. Learn's autoscale glossary defines the minimum percentage of hosts as the lowest share of session hosts that must be on in each phase of the schedule. The pool then runs 596 host-hours in a 168-hour week.

Assume a pay-as-you-go rate of 1.00 per host-hour and a 30 percent reservation discount, which is 0.70. The break-even point is simple arithmetic: you pay for every hour of the reservation, so it pays off only if you use more than 70 percent of those hours.

| Reserved hosts | Hours paid | Hours used | Utilisation | Reservation cost | Pay-as-you-go for the used hours | Net |
|---|---|---|---|---|---|---|
| 1 | 168 | 168 | 100% | 117.6 | 168.0 | +50.4 |
| 2 | 336 | 336 | 100% | 235.2 | 336.0 | +100.8 |
| 3 | 504 | 386 | 77% | 352.8 | 386.0 | +33.2 |
| 4 | 672 | 436 | 65% | 470.4 | 436.0 | -34.4 |

Reserving 2 hosts, the floor, gives the largest net saving in this example; the fourth host costs more than it saves. With 2 reserved, the week costs 235.2 for the reservation plus 260 pay-as-you-go host-hours, 495.2 against 596.

Now change one assumption: the schedule scales to zero hosts overnight and at weekends, so hosts run only from 07:00 to 19:00 on weekdays, giving 380 host-hours a week. A reservation for 2 hosts is used 120 of 336 hours, about 36 percent. It costs 235.2 to cover 120.0 of pay-as-you-go usage, a net loss of 115.2. For that pool, a reservation only makes sense if other matching VMs in the same scope run at night.

A savings plan follows the same logic with a different break-even. At an invented 20 percent discount, an hourly commitment of 1.60 (two hosts at 0.80) in the first schedule costs 268.8 a week against 336.0 of pay-as-you-go usage, a net of +67.2, less than the reservation's +100.8. With a commitment of 3.20, only 65 percent of the commitment is used, and it needs 80 percent to break even, so it loses 101.6. In return for the smaller discount, the plan still applies if you change size, family or region.

## Flexibility, exit and the 2027 exchange change

**Size flexibility.** Learn's manage page says that when the scope is shared, instance size flexibility is on by default, and the purchase page says it is the default selection under "Optimize for". With it on, the reservation applies to other sizes in the same flexibility group by ratio. Learn's example: a Standard_DS4_v2 reservation (ratio 8) covers eight Standard_DS1_v2 VMs or two DS2_v2 and one DS3_v2. It does not cover sizes in a different group, such as DSv2 high-memory. Learn says you cannot directly change a reservation's region, SKU, quantity or duration after purchase; an exchange is the route for those changes. Scope, ownership and the optimize setting (instance size flexibility or capacity priority) can be changed directly, and capacity priority needs a single-subscription scope.

**Scope.** You can change the scope of either commitment after purchase. Learn's Reserved VM page says scope changes cause no new commercial transaction, and its savings plan scope page says the same for rescoping a plan. If you change a reservation from shared to single scope, you can select only subscriptions you own.

**Exchange and refund.** Learn says an exchange is processed as a refund plus a repurchase, and the new commitment must be at least the remaining commitment. Refunds are capped at USD 50,000 of cancelled commitments in a 12-month rolling window per billing profile or enrolment, and Learn says exchanges have no annual limit. Learn says no early termination fee is charged today, but a 12 percent fee might be later. Reservations purchased after 1 February 2027 are not eligible for exchange where savings plans support the service, which includes virtual machines; reservations purchased before then keep one final exchange. The same page's policy section still describes compute exchanges "until further notice", so read the current wording before relying on an exchange.

**Trade-in.** Compute reservations (VMs, Dedicated Hosts, App Service) can be traded in for a compute savings plan, up to 100 at a time. The plan's total commitment must at least equal the returned reservation's remaining commitment.

## A purchase sequence for session hosts

1. **Right-size and tune autoscale first.** Learn's optimisation sequence says discounts reduce rates, not waste.
2. **Measure the floor.** Using [Microsoft Cost Management](/entity/microsoft-cost-management/) usage data, find the number of VMs of one size that run in every hour of the week.
3. **Reserve a stable floor.** If it sits in one family and region, buy a reservation for that quantity, scoped to the subscription or shared scope that holds the pool.
4. **Use a savings plan where the shape moves.** Cover floors that change size, family or region, or are shared with other eligible compute, with an hourly commitment sized to the discounted hourly spend you always incur.
5. **Check recommendations, then override them.** Azure Advisor and the portal recommend commitments from a 30-day lookback for savings plans. Learn says regularly shut-down resources can yield no reservation recommendation, so compare the number with your own floor.
6. **Wait before the second purchase.** Wait seven days before buying the other type so recommendations reflect the first purchase (the reservation page says three).
7. **Review utilisation monthly.** In the portal, Reservations shows a Utilization (%) column. For an underused reservation, Learn's manage page suggests matching VM sizes, turning size flexibility on, widening the scope to shared, or exchanging the unused quantity.

Buying needs a specific role. Learn lists the owner or reservation purchaser role on a subscription for reservations (for EA subscriptions, Add Reserved Instances must be enabled in the EA portal, or you must be an EA Admin), and the savings plan purchaser role or subscription ownership for savings plans; EA and MCA customers can alternatively use billing permissions. Savings plans are available to EA, MCA and MPA customers, and auto-renew is off by default.

## Sources

- [Microsoft Learn: Decide between a savings plan and a reservation](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/decide-between-savings-plan-reservation)
- [Microsoft Learn: What are savings plans?](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview)
- [Microsoft Learn Training: What is Azure savings plan for compute?](https://learn.microsoft.com/en-us/training/modules/azure-savings-plan-for-compute/what-azure-savings-plan-for-compute)
- [Microsoft Azure: Azure savings plan for compute pricing](https://azure.microsoft.com/en-us/pricing/offers/savings-plan-compute/)
- [Microsoft Learn: Savings plan for compute](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-compute-overview)
- [Microsoft Learn: How a savings plan discount is applied](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/discount-application)
- [Microsoft Learn: Savings plan scopes](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/scope-savings-plan)
- [Microsoft Learn: Buy a savings plan](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/buy-savings-plan)
- [Microsoft Learn: Savings plan recommendations](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/purchase-recommendations)
- [Microsoft Learn: Self-service trade-in for savings plans](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/reservation-trade-in)
- [Microsoft Learn: What are Azure Reservations?](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Microsoft Learn: Self-service exchanges and refunds for Azure Reservations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations)
- [Microsoft Learn: Prepay for Azure virtual machines to save money](https://learn.microsoft.com/en-us/azure/virtual-machines/prepay-reserved-vm-instances)
- [Microsoft Learn: Manage Azure Reservations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/manage-reserved-vm-instance)
- [Microsoft Learn: Understand Azure Reserved VM Instances discount](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges)
- [Microsoft Learn: Instance size flexibility](https://learn.microsoft.com/en-us/azure/virtual-machines/reserved-vm-instance-size-flexibility)
- [Microsoft Learn: Azure reservation recommendations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reserved-instance-purchase-recommendations)
- [Microsoft Learn: Reservations software costs for Azure](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reserved-instance-windows-software-costs)
- [Microsoft Learn: Transition guide for retired Azure Reserved VM Instances](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/manage-legacy-vm-reservations-after-july-1-2026)
- [Microsoft Learn: Understand and estimate the costs of Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Autoscale scaling plans and example scenarios in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Autoscale glossary for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-glossary)
- [Microsoft Learn: Azure Spot Virtual Machines](https://learn.microsoft.com/en-us/azure/virtual-machines/spot-vms)
