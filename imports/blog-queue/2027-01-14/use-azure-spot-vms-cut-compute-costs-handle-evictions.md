---
title: "How to Use Azure Spot VMs to Cut Compute Costs and Handle Evictions"
summary: "Azure Spot VMs use unused capacity at a discount but can be evicted with 30 seconds notice and carry no SLA. Choose the eviction policy and max price, know the limits, and check price and eviction history before you deploy."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [azure-spot-virtual-machines, azure-virtual-machines, azure-virtual-machine-scale-sets]
keypoints:
  - "Spot VMs run on unused Azure capacity at a significant cost saving, but have no SLA and no high availability guarantee."
  - "Azure can evict a Spot VM with 30 seconds notice; Scheduled Events deliver the warning on a best effort basis."
  - "The eviction policy is Deallocate (default) or Delete; deallocated VMs still count against quota and incur disk storage costs."
  - "A max price of -1 means no eviction for pricing reasons and you never pay more than the standard price."
  - "B-series and promo sizes are not supported, and the Spot flag can only be set when the VM is created."
faq:
  - q: "What is an Azure Spot VM?"
    a: "According to Microsoft Learn it is a VM that uses unused Azure capacity at a significant cost saving. When Azure needs the capacity back, it evicts the VM. Learn describes Spot VMs as a fit for workloads that tolerate interruptions, such as batch processing jobs, dev/test environments and large compute workloads."
  - q: "How much notice do I get before an eviction?"
    a: "Learn says Azure evicts Spot VMs with 30 seconds notice. You can opt in to in-VM notifications through Azure Scheduled Events, which are delivered on a best effort basis up to 30 seconds before the eviction."
  - q: "What is the difference between Deallocate and Delete?"
    a: "Deallocate moves the VM to the stopped-deallocated state so you can redeploy it later, but allocation is not guaranteed, the VM counts against quota and you pay for the disks. Delete removes the VM together with its underlying disks, so storage charges stop."
  - q: "What does a max price of -1 do?"
    a: "The VM is not evicted for pricing reasons. You pay the current spot price or the standard VM price, whichever is less, as long as capacity and quota are available. You are never charged above the standard price."
  - q: "Can I turn an existing VM into a Spot VM?"
    a: "No. Learn says the Spot flag is supported only at creation time, and a Spot VM cannot be directly converted to a standard VM."
---

An Azure Spot VM runs on unused Azure capacity at a lower price, and Azure can take that capacity back at any time. Microsoft Learn says eviction happens with 30 seconds notice and that Spot VMs have no SLA and no high availability guarantee. Use them for work that can stop and restart, set the eviction policy and max price on purpose, and check price and eviction history before you pick a size and region. This guide follows the Learn page on Azure Spot Virtual Machines.

## When Spot VMs fit

Learn says Spot VMs suit workloads that can handle interruptions, and names batch processing jobs, dev/test environments and large compute workloads. The page also states that if you need capacity right away after an eviction, you should use standard VMs instead.

In every other respect, Learn says a Spot VM is the same as a regular standard VM once it is created. The differences are the missing SLA and the fact that it can be evicted at any time.

## Eviction policy

Spot VMs can be stopped in two situations, according to Learn: Azure needs the capacity for other pay-as-you-go workloads, or the price of the spot instance exceeds the maximum price you set. When you create the VM, you choose one of two eviction policies:

- **Deallocate** (the default). The VM moves to the stopped-deallocated state, so you can redeploy it later. There is no guarantee the allocation will succeed. Deallocated VMs count against your quota, and you are charged storage costs for the underlying disks.
- **Delete.** The evicted VM is deleted together with its underlying disks, so you do not continue to be charged for storage.

To receive a warning inside the VM, opt in to Azure Scheduled Events. Learn says these arrive on a best effort basis up to 30 seconds before the eviction, which is not much time. My advice, not Learn's: design the workload so that it can save state or hand work back within that window, or so that losing it costs little.

## Max price: what each setting does

You can set a max price in US dollars with up to five decimal places. For example, the value `0.98765` means a max price of $0.98765 per hour. Learn lists these outcomes:

| Situation | Outcome |
| --- | --- |
| Max price is greater than or equal to the current price | The VM is deployed if capacity and quota are available. |
| Max price is below the current price | The VM is not deployed. You get an error that the max price must be at least the current price. |
| Restart of a stopped or deallocated VM, max price at least the current price | The VM is deployed if capacity and quota exist. |
| Restart of a stopped or deallocated VM, max price below the current price | You get the same max price error. |
| Price rises above your max price | The VM is evicted. Azure attempts scheduled event delivery up to 30 seconds before. |
| Price falls back below your max price after an eviction | The VM is not restarted automatically. You can restart it yourself and it is charged at the current price. |
| Max price is -1 | The VM is not evicted for pricing reasons. The max price is the current price, up to the standard VM price. |
| Changing the max price | Deallocate the VM, set a new max price, then update the VM. |

For the portal, Learn says to deallocate the VM first and then change the max price in the **Configuration** section of the VM.

With a max price of `-1`, Learn says the price you pay is the current spot price or the price of a standard VM, whichever is less, as long as capacity and quota are available. Capacity can still be reclaimed, so `-1` removes price-based eviction only.

## Limits to check before you plan

- **Unsupported sizes.** B-series and promo versions of any size (Learn gives Dv2, NV, NC and H promo sizes as examples) are not supported.
- **Regions.** Spot VMs can be deployed to any region except Microsoft Azure operated by 21Vianet.
- **Offer types.** Learn lists Enterprise Agreement, pay-as-you-go offer code 003P, and sponsored offers 0036P and 0136P (not available in Fairfax). For Cloud Service Provider, it points to Partner Center or your partner.
- **Quota.** Spot VMs have a separate quota pool, shared between VMs and scale-set instances. You can request more through the standard quota request process.
- **No conversion.** You cannot convert existing VMs to Spot VMs, and you cannot convert Spot VMs to standard VMs.
- **Scale sets.** The Learn page applies to Linux VMs, Windows VMs, flexible scale sets and uniform scale sets.

## Check price and eviction history

Pricing is variable by region and SKU. Learn gives three ways to look at it.

1. **Portal, during VM creation.** Select **Run with Azure Spot discount**. A link titled **View pricing history and compare prices in nearby regions** appears under the size selection and opens a table or graph of spot pricing for that size. Learn notes that eviction rates are quoted per hour: an eviction rate of 10% means a 10% chance of eviction within the next hour, based on historical eviction data of the last 7 days.
2. **Azure Resource Graph.** Learn says you can query pricing history for the last 90 days and eviction rates for the last 28 trailing days, using the `SpotResources` table. It gives sample queries with the types `microsoft.compute/skuspotpricehistory/ostype/location` and `microsoft.compute/skuspotevictionrate/location`, filtered by SKU name and region.
3. **Retail prices API.** In the Azure retail prices API, Learn says the `meterName` and `skuName` both contain `Spot`.

Note that the portal figure uses 7 days and the Resource Graph figure uses 28 trailing days. They are different windows, so do not compare the two numbers directly.

## A rollout approach

This section is my advice, not a Microsoft statement.

1. Pick one workload that already survives a restart: a build agent, a batch worker or a test environment.
2. Compare two or three sizes and nearby regions in the pricing and eviction view, and prefer the one with a lower eviction rate if the price difference is small.
3. Start with Delete if the VM holds no state and you want storage charges to stop, or Deallocate if you want to restart it later and accept disk costs and quota use.
4. Start with a max price below the standard price if cost control matters more than uptime, or `-1` if you want to avoid price-based eviction.
5. Subscribe to Scheduled Events inside the VM and test what your workload does on a simulated stop.
6. Keep a standard VM or a fallback path for work that must finish by a deadline.

Learn links an architecture guide on Azure VM Spot eviction for building a reliable interruptible workload, which is the next page to read if the workload is business critical.

## Related

- [Azure Spot Virtual Machines](https://www.m365.fm/entity/azure-spot-virtual-machines/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Azure Virtual Machine Scale Sets](https://www.m365.fm/entity/azure-virtual-machine-scale-sets/)

## Sources

- [About Azure Spot Virtual Machines - Azure Virtual Machines (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-machines/spot-vms)
