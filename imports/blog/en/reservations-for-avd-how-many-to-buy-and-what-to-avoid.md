---
title: "Reservations for AVD: how many to buy and what to avoid"
summary: "Start from the cores that are powered on in every hour of the week, then add cores only while each extra core runs more than one minus the discount of the hours, and test any recommended number against your own usage before you buy. This guide walks through the steps, a worked example with invented rates, and the mistakes Microsoft Learn and Nerdio's help pages point to."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-reserved-instance-management, nerdio-manager-for-enterprise]
keypoints:
  - "Learn says reservations are bought on consistent base usage, apply hour by hour, and unused hours are not carried forward. Each additional reserved core adds savings only if it runs in more than one minus the discount of the hours (60 percent at a 40 percent discount); a whole reservation beats pay-as-you-go only if its average utilisation is above that share."
  - "In a worked example with invented numbers, reserving the 8-core floor of an autoscaled pool saves most at a 40 percent discount, while reserving 24 cores (about the weekly average of 20.6, rounded up to whole hosts) turns negative. At a 60 percent discount 16 cores edge ahead of the floor, which is why term and rate matter."
  - "Nerdio's RI analytics recommends a region, VM family and total cores from a host pool's auto-scale history. Nerdio's RI analytics help article does not document the formula. Its cost-data page says Nerdio Manager cannot calculate figures using Microsoft Reserved Instances or Savings Plans; our reading is that the recommendation does not net out what you already hold, so check the number yourself."
  - "Convert cores to VMs with the instance size flexibility ratio of the VM group. In Learn's Ddsv5 example the ratios match the vCPU count in the size names, but other groups differ, so fetch the ratios for your region."
  - "Check the family is still purchasable (several older series cannot be bought or renewed since 1 July 2026), the reservation is for compute only, it guarantees no capacity, and auto-renew will repeat an old choice unless you change it."
faq:
  - q: "Should I reserve my peak number of hosts?"
    a: "Learn says to buy based on consistent base usage, and that usage above the reserved quantity is charged at pay-as-you-go rates while unused reserved hours are lost. Peak hosts run only for part of the week, so reserving them leaves paid hours unused. In the worked example below, the pool's peak of 48 cores is used in 45 of 168 hours."
  - q: "Can I reserve a mix of VM sizes after Nerdio gives me a core count?"
    a: "Nerdio's RI analytics article says you can buy the recommended cores in any combination of VM sizes within the recommended region and VM family. Learn's instance size flexibility lets one reservation cover several sizes in the same group by ratio, so your actual hosts need not match the purchased sizes."
  - q: "What if I buy too many?"
    a: "You can change the scope or the instance size flexibility setting after purchase, or exchange or refund within Learn's limits. Refunds are capped at USD 50,000 of cancelled commitments in a 12-month rolling window, and reservations bought after 1 February 2027 lose exchange rights where savings plans support the service. The article on reservations or savings plans covers the exit options."
---

Start from the cores that are powered on in every hour of the week, the floor of your autoscaled pool, and add cores only while each extra core runs in more than one minus the discount of the hours. Do not size to the average or the peak. Nerdio's RI analytics gives a starting core count, but its help article does not document how it is derived, so test it against your own usage. This guide shows the steps, a worked example with invented rates, and the mistakes to avoid.

It covers [Azure Reservations](/entity/azure-reservations/) for [session hosts](/entity/avd-session-host/) in an autoscaled [host pool](/entity/avd-host-pool/), using [Nerdio Manager for Enterprise](/entity/nerdio-manager-for-enterprise/) and Microsoft Learn. It is arithmetic and documentation, not advice. The reservation-versus-savings-plan comparison is in [Reservations or savings plans for AVD: which to buy](/community/u/mirko-p/blog/reservations-or-savings-plans-for-avd-which-to-buy/), and the RI analytics and purchase screens are in [Reserved Instance management in Nerdio: guided purchases](/community/u/mirko-p/blog/reserved-instance-management-in-nerdio-guided-purchases/); this guide only summarises them.

## The rule behind the number

Learn's guidance on determining a purchase says reservations are applied hourly and should be bought on consistent base usage. Buying more than your historical usage leaves a reservation underused, unused capacity does not carry over to the next hour, and usage above the reserved quantity is billed at pay-as-you-go rates.

From that follows a break-even rule (our arithmetic, not a Learn statement). You pay for every hour of the reservation. With a discount of d, a reserved core-hour costs (1 − d) of the pay-as-you-go price, so each extra reserved core adds savings only if it is used more than (1 − d) of the hours. At a 40 percent discount that is 60 percent of hours; at 60 percent it is 40 percent. The whole reservation beats pay-as-you-go only if its average utilisation is above the same share. The tests differ: in the example below, 16 reserved cores beat pay-as-you-go at 40 percent (70.8 percent utilisation) although cores 9 to 16 run only 41.7 percent of the hours, because the first 8 cores run all the time.

## Steps

1. **Run RI analytics on a representative range.** Open the dynamic host pool's more actions menu, select Auto-scale > RI analytics and choose the date range. Note the CPU-hours, the projected CPU-months (based on 730 hours per month) and the recommended region, VM family and cores. Repeat per host pool.
2. **Get the most detailed usage profile you have.** Learn's analysis of the usage file works on daily data: it filters MeterCategory to Virtual Machines, reads the VM size from the ServiceType value in AdditionalInfo, uses ResourceLocation for the region and ignores resources with less than 24 hours of usage in a day. Learn's prepay page adds that the Meter subcategory and Product fields cannot tell premium-storage sizes apart. Nerdio's RI analytics page shows CPU-hours and projected CPU-months, no hourly series. Nerdio's Auto-scale History page plots active hosts over a time range you choose and shows a hosts snapshot when you select a point on the graph; it does not state the granularity, so check that it suits an hourly profile (active hosts times vCPUs per host). Nerdio's cost-data page says user cost attribution reads VM uptime from the Log Analytics Heartbeat table.
3. **Find the floor.** With an hourly profile, take the cores powered on in the quietest hour of a normal week, including weekends. With daily data only, our reading is that hosts that ran all 24 hours on every day of the week approximate the floor, but a host running 24 hours only on weekdays also passes the filter, so check each day. A reservation above the floor will have unmatched hours, acceptable only while the marginal test holds.
4. **Test the candidate quantity.** For each candidate, add up the hours it would cover, compare with what you pay, and compare the utilisation of the extra cores with the break-even share. If one reservation scope covers several pools with matching VMs, our reading is that the floor comes from their combined profile, not from the sum of each pool's floor.
5. **Convert cores to VMs.** See the next section.
6. **Subtract what you already hold.** Nerdio's cost-data page says Nerdio Manager cannot calculate figures using customers' Microsoft Reserved Instances or Savings Plans, and the RI analytics page says nothing about existing commitments. Our reading: deduct existing coverage yourself. Learn says Azure's own recommendations exclude existing reservations and savings plans, and Learn recommends a 3-day wait after buying either product before using recommendations for the other.
7. **Compare with Azure.** The portal's purchase page shows a recommended quantity, and Learn says the recommendation engine evaluates hourly usage over the past 7, 30 and 60 days. Learn's API notes add that a 7-day look-back might return no recommendation if VMs are shut down for more than a day.
8. **Buy and review.** Buy in the Azure portal. If you use Nerdio Manager for MSP, its Reservations Management feature can also purchase and track. Review utilisation in the Reservations list of the Azure portal.

## From cores to VMs

Nerdio recommends cores in a VM family and region; Azure sells a quantity of one VM size. Learn's instance size flexibility connects them: each size in a flexibility group has a ratio, and a reservation for one size applies to others in the group in proportion to the ratios, which are relative units, not prices.

In Learn's example for the Ddsv5 group the original ratios are 2 (D2ds_v5), 4, 8, 16, 32, 48, 64 and 96 (D96ds_v5), which matches the vCPU count in the size names. Our reading: for that group, 8 reserved cores can be one D8ds_v5 or two D4ds_v5. Do not assume this for every group. Learn's example for the BS group shows ratios of 0.25 for Standard_B1ls, 0.5 for B1s and 2 for B2s, and says ratios can vary by region. Learn's VM page says the ratio CSV stopped receiving updates on 9 May 2026 and is to be removed on 30 August 2026, so use the API or PowerShell. Learn's instance size flexibility page gives a PowerShell example that sets `$ResourceType = "VirtualMachines"` and runs `Get-AzReservationCatalog -SubscriptionId $SubscriptionId -Location $Location -ReservedResourceType $ResourceType`, then reads `ReservationsAutofitGroup` and `ReservationsAutofitRatio` from each item's SKU properties.

When purchasing, Learn says "Optimize for" defaults to instance size flexibility and capacity priority is available only with a single-subscription scope. A reservation scoped to one subscription needs vCPU quota in that subscription, and the check includes VMs already deployed there.

## Worked example with invented numbers

Assume a pool of 8-vCPU hosts. On weekdays: 2 hosts (16 cores) from 06:00 to 08:00, 6 hosts (48 cores) from 08:00 to 17:00, 3 hosts (24 cores) from 17:00 to 20:00 and 1 host (8 cores) overnight. At weekends, 1 host (8 cores) all day. The weekly hours per core level are:

| Cores powered on | Hours per week |
|---|---|
| 8 | 98 |
| 16 | 10 |
| 24 | 15 |
| 48 | 45 |

That is 3,464 core-hours in a 168-hour week, an average of 20.6 cores. Take a pay-as-you-go price of 1.00 per core-hour and a 40 percent reservation discount (Nerdio's cited 1-year average; your rate will differ), so a reserved core-hour costs 0.60.

| Reserved cores | Core-hours covered | Reservation cost | Utilisation | Net vs pay-as-you-go |
|---|---|---|---|---|
| 8 | 1,344 | 806.4 | 100% | +537.6 |
| 16 | 1,904 | 1,612.8 | 70.8% | +291.2 |
| 24 | 2,384 | 2,419.2 | 59.1% | -35.2 |
| 48 | 3,464 | 4,838.4 | 43.0% | -1,374.4 |

Reserving the 20.6-core average, rounded up to 24 cores of whole hosts, loses a little; reserving the 48-core peak loses heavily. The marginal cores 9 to 16 are used 70 of 168 hours, 41.7 percent, below the 60 percent break-even, so they cost more than they save. Now change one assumption: a 60 percent discount, with a break-even of 40 percent:

| Reserved cores | Reservation cost | Net vs pay-as-you-go |
|---|---|---|
| 8 | 537.6 | +806.4 |
| 16 | 1,075.2 | +828.8 |
| 24 | 1,612.8 | +771.2 |
| 48 | 3,225.6 | +238.4 |

With the deeper discount the picture flattens and 16 cores edge ahead, but this assumes the same schedule for three years. The example ignores Windows licences, storage and networking, which a reservation does not cover.

## What to avoid

- **Reserving the average or the peak.** The example shows both lose against the floor at 40 percent. Nerdio's "projected CPU-months" reads like an average, but its page does not say the recommendation equals it.
- **A window that is not typical.** A range with a holiday or a pilot skews the floor. Learn's engine uses 7, 30 and 60 days; Nerdio lets you choose, so pick normal weeks.
- **Hosts that are stopped, not deallocated.** Stopped VMs keep using reservation hours; deallocated or deleted VMs free them, as the article on [Nerdio's reservation features](/community/u/mirko-p/blog/reserved-instance-management-in-nerdio-guided-purchases/) explains. Freed hours go to other matching VMs in the scope; if none match, they go unused and do not carry over to the next hour.
- **Wrong family or storage variant.** Learn gives an example: a reservation for Standard_D1 does not apply to Standard_DS1, which is in a different group.
- **Series that can no longer be bought.** Since 1 July 2026 several older series, including Dv3, Dsv3, Ev3 and Esv3, cannot be bought or renewed as reservations, and for some other series the one-year term is affected; the article on reservations or savings plans lists them. Check the family against Learn's transition guide.
- **Sizing at deployment time.** The Purchase Reserved Instance toggle on Hosts > Add new, documented for Nerdio Manager for MSP, buys for the VM size, region and quantity being created, which is a deployment count, not necessarily an always-on count.
- **Forgetting auto-renew.** Learn says the renewal setting is turned on by default when you make a purchase, and the replacement has the same SKU, region, scope, billing subscription, term and quantity unless you change quantity, billing frequency or term. Learn lists an expiring SKU that is no longer active as a reason a renewal may not be processed. Nerdio's purchase form also has an Auto renew option. If the pool will change, review it before expiry; Learn suggests starting 6 to 12 months ahead for retiring series.
- **Expecting capacity or licensing.** Learn says a reserved VM instance is a billing discount and does not guarantee capacity, and it covers compute only; [Azure Hybrid Benefit](/entity/azure-hybrid-benefit/) can cover the Windows software cost.

After the purchase, watch utilisation. Nerdio's tracking note says to aim close to 100 percent: lower may mean too many reservations, above 100 percent may mean more reservations are cost effective. Also compare it with the usage billed above the reservation in [Microsoft Cost Management](/entity/microsoft-cost-management/).

## Sources

- [Nerdio Help: Auto-scale: Reserved instances analytics (RI)](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388632205-Auto-scale-Reserved-instances-analytics-RI)
- [Nerdio Help (NMM): Reservations Management](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125616109325-Reservations-Management)
- [Nerdio Help (NMM): Manually Create a Session Host](https://nmmhelp.getnerdio.com/hc/en-us/articles/29488415751437-Manually-Create-a-Session-Host)
- [Nerdio Help: Auto-scale History for Dynamic Host Pools](https://nmehelp.getnerdio.com/hc/en-us/articles/26124306148237-Auto-scale-History-for-Dynamic-Host-Pools)
- [Nerdio Help: Where does NME show me Azure cost data?](https://nmehelp.getnerdio.com/hc/en-us/articles/48618389927565-Where-does-NME-show-me-Azure-cost-data)
- [Microsoft Learn: Determine what Azure reservation you should purchase](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/determine-reservation-purchase)
- [Microsoft Learn: Azure reservation recommendations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reserved-instance-purchase-recommendations)
- [Microsoft Learn: Instance size flexibility for Azure Reservations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/instance-size-flexibility)
- [Microsoft Learn: Virtual machine size flexibility with Reserved VM Instances](https://learn.microsoft.com/en-us/azure/virtual-machines/reserved-vm-instance-size-flexibility)
- [Microsoft Learn: Prepay for Azure virtual machines to save money](https://learn.microsoft.com/en-us/azure/virtual-machines/prepay-reserved-vm-instances)
- [Microsoft Learn: Understand Azure Reserved VM Instances discount](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/understand-vm-reservation-charges)
- [Microsoft Learn: How an Azure reservation discount is applied](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reservation-discount-application)
- [Microsoft Learn: What are Azure Reservations?](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Microsoft Learn: View Azure reservation utilization](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reservation-utilization)
- [Microsoft Learn: Automatically renew Azure reservations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reservation-renew)
- [Microsoft Learn: Self-service exchanges and refunds for Azure Reservations](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/exchange-and-refund-azure-reservations)
- [Microsoft Learn: Transition guide for retired Azure Reserved VM Instances](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/manage-legacy-vm-reservations-after-july-1-2026)
