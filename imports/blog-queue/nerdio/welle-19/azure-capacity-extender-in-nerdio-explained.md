---
title: "Azure Capacity Extender in Nerdio explained"
summary: "Azure Capacity Extender is a Nerdio Manager for Enterprise host pool setting that lists fallback VM sizes for when Azure lacks capacity for the preferred size. Nerdio's help center says it is Premium only."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-azure-capacity-extender, nerdio-manager-for-enterprise]
keypoints:
  - "Nerdio describes Azure Capacity Extender as fallback VM sizes used in sequence when the preferred size is unavailable, so host creation, auto-scale, auto-grow and auto-heal do not fail."
  - "It is set per host pool under Settings > Azure Capacity Extender: a read-only default size, an ordered list of alternate sizes and four further settings. 8.1.0 release notes add an auto-revert option."
  - "With Availability Zone Awareness on, the default size is tried in every zone before the first alternate size. With it off (before version 7.4) only the least-used zone was tried."
  - "Nerdio warns that alternate sizes with a different resource profile may affect user performance, and the size picker marks sizes whose size or cost differs significantly from the default."
  - "Nerdio's entitlement page lists the Azure Capacity Extender among the Premium-only features, so it is not part of Core."
faq:
  - q: "Does the Azure Capacity Extender add Azure capacity?"
    a: "Not in the sense of adding capacity to Azure. Nerdio's help article says the feature lets you work around Azure compute capacity limits by specifying fallback VM sizes that are used if capacity is exhausted for the preferred size in the region. Our reading is that it widens the choice of sizes. Whether an alternate size has capacity is still decided by Azure."
  - q: "Is the Azure Capacity Extender available in the Core edition?"
    a: "No. Nerdio's help article says the feature is only available in the Premium edition, and the entitlement and billing page lists it under Premium edition features that are not included with Core."
  - q: "Where do I set it up?"
    a: "Per host pool. In Nerdio Manager locate the host pool, select the more options menu, then Settings > Azure Capacity Extender, enable it, choose the alternate VM sizes and save."
---

[Azure Capacity Extender](https://www.m365.fm/entity/nerdio-azure-capacity-extender/) is a host pool setting in [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/). You list fallback VM sizes, and if Azure has no capacity left in the region for the preferred size, Nerdio Manager tries the alternates in the order you set. With the intelligent option on, Nerdio Manager selects sizes dynamically; the configuration page does not say how that combines with the manual list. It only works with the Premium edition. This article explains the problem it addresses, how the settings behave, what the documentation does not say, and how it compares with other ways to handle capacity.

The Nerdio help pages behind this article are dated November 2026, and the configuration page refers to behaviour that changed in version 7.4. Check the current pages and your Nerdio Manager version before you rely on a detail.

## The problem: Azure cannot always allocate the VM size you ask for

When you create, start or resize a VM, Azure must allocate compute resources in a region or zone. Microsoft Learn's troubleshooting page for allocation failures links this to unprecedented growth in demand for Azure services in specific regions, and it lists error codes such as `AllocationFailed` and `ZonalAllocationFailed`. The message says there is not sufficient capacity for the requested VM size in the region. Learn also describes "overconstrained" failures (`OverconstrainedAllocationRequest` and `OverconstrainedZonalAllocationRequest`), where the combination of constraints in a request, such as VM size, availability zone or ephemeral disk, cannot be met.

For an [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) [host pool](https://www.m365.fm/entity/avd-host-pool/) this matters at the moments when you need hosts most: an auto-scale scale-out, an auto-grow step, the creation of new hosts or an auto-heal operation. These are the cases Nerdio's page names. Our reading: a pool that is configured for exactly one [VM size](https://www.m365.fm/entity/azure-virtual-machines/) has no automatic fallback when that size is short, although you can still resize a VM manually or try another zone.

## What the Azure Capacity Extender does

Nerdio's help article says administrators can specify additional VM sizes for the case that sufficient resources for the preferred size are not available in the Azure region. Nerdio states that this ensures host creation, auto-scale, auto-grow and auto-heal operations do not fail because of Azure capacity constraints. We read that as the stated aim, not as a guarantee, since Azure still decides which sizes have capacity. Nerdio words it as overcoming Azure compute capacity limits by specifying multiple fallback VM sizes.

Two points follow from the wording:

- Our reading: the extender widens the choice of sizes. Nerdio's page does not say it reserves or adds capacity in Azure, and whether a fallback size has capacity is still Azure's decision.
- The default size stays the first choice. The help article says the host pool default VM size is used whenever possible during Start and Create VM operations. Alternates are for when that is not possible.

## Where to find it and what the settings mean

The path in Nerdio Manager is: locate the host pool, open the more options menu, then select **Settings** > **Azure Capacity Extender**. Select **Save** or **Save and Close** when done. The page lists these fields:

| Setting | What Nerdio's page says |
|---|---|
| Azure Capacity Extender | Enables the feature for this host pool. |
| Host Pool Default VM Size | The size used whenever possible during Start and Create VM operations. For reference only; it cannot be changed on this screen. |
| Alternate Preference VM Sizes | Fallback sizes chosen from a drop-down list, used in sequence if the default size is not available. You can drag and drop to change the order. |
| Allow resizing of hibernated VMs | Lets end users use the extender to resize hibernated VMs in the self-service portal. |
| Availability Zone Awareness | Lets Nerdio Manager consider all possible availability zones when reinstantiating VMs. Requires **Distribute VMs across Availability Zones** in the host pool VM deployment configuration. |
| Use Intelligent Azure Capacity Extender | Nerdio Manager selects resources dynamically if the default size has a capacity issue, based on the current running size of the VMs in the pool. |
| Manageable Restrictions | Has its own enable switch. Fine-tunes the configuration by specifying the allowed CPU and GPU architectures and the maximum difference in RAM and CPU cores. |

Under Manageable Restrictions the fields are Processor Type, Number of Cores and RAM. Processor Type sets the processor difference allowed between the default VM size and the suggested sizes, and the other two set the maximum difference in cores and in RAM. Our reading: the restrictions apply to the sizes the intelligent option suggests. The page lists Manageable Restrictions as a separate option after the intelligent one and does not say this explicitly.

The page also says the alternate list can be filtered with the Resource Rules selectors at the top of the list, and that an icon marks sizes whose size or cost differs significantly from the default host pool VM size. Resource selection rules are documented on a separate Nerdio page.

## How the order works, with Nerdio's example

Nerdio's page includes a worked example of the logic when a session host VM does not boot because of a Microsoft capacity issue. The host pool default size is BS1, the alternate is BS2, and all zones are enabled under the deploy-across-availability-zones option. Zone 1 is the least used, zone 2 is moderately used and zone 3 is the most used.

With **Availability Zone Awareness enabled** (the new logic):

1. Zone 1 with BS1: no capacity.
2. Zone 2 with BS1: no capacity.
3. Zone 3 with BS1: no capacity.
4. Zone 1 with BS2: no capacity.
5. Zone 2 with BS2: the VM is created and the "Add host" task completes with the status Complete.

With it **disabled** (the old logic, before version 7.4), only zone 1, the least used, was tried: BS1 failed, BS2 failed, and the "Add host" task ended with the status Error.

In Nerdio's example the default size is tried in every zone before any alternate is used. Nerdio uses both "Distribute VMs across Availability Zones" (in a note) and "Deploy VMs across availability zones" (in the example) for the zone option. Our reading is that zone awareness only has an effect if the pool is actually distributed across zones, which the page lists as a prerequisite. If you run a pool in a single zone or without zones, the example does not apply to you.

## Choosing alternate sizes

Nerdio's note is direct: select VM sizes that match the resources of the preferred size, because sizes with a different resource profile may affect user performance. Three checks help:

- **Match vCPU and memory first.** Our reading: an alternate with half the memory changes how many sessions a host can carry, because a session limit is usually chosen for the preferred size.
- **Look at cost.** The icon in the list flags sizes whose size or cost differs significantly from the default. Nerdio's configuration page does not say how long a host stays on an alternate size. The release notes for version 8.1.0 (Public Preview, July 21, 2026) describe an auto-revert option for the Azure Capacity Extender: when enabled, stopped session hosts that were resized to an alternative SKU are automatically reverted to the host pool's default VM size when auto-scaling. Nerdio says the option is off by default. Our reading: without it, do not assume a pool returns to its default size by itself. The configuration page does not list the option and the release notes do not say whether it is unchanged in later versions, so check your own version and test it in a lab.
- **If you enable the intelligent option, check the Manageable Restrictions fields as well.** Nerdio's page names processor type, core count and RAM as the dimensions you can limit, compared between the default size and the suggested sizes.

## Edition and licensing

Nerdio's help article opens with a note that the feature is only available in the Nerdio Manager Premium edition. Nerdio's entitlement and billing page confirms this: the Azure Capacity Extender is in its list of Premium edition features, which are not included with Windows Cloud Core or AVD Core. The same list includes the Azure API Limit Booster, covered in the companion article on [capacity and API limit helpers in large environments](https://www.m365.fm/community/u/mirko-p/blog/when-large-environments-need-capacity-and-api-limit-helpers/). The edition is selected under **System** > **Settings** > **Nerdio** > **Services Managed** > **Azure Virtual Desktop**, according to that page. Our guide to [Nerdio Manager for Enterprise editions, Core versus Premium](https://www.m365.fm/community/u/mirko-p/blog/nerdio-manager-for-enterprise-editions-core-vs-premium/) covers the edition decision. Prices are not covered here.

## What it does not cover, and alternatives

The Nerdio article gives no numeric limits and no list of supported VM families. It does not describe notifications when an alternate size is used, and it does not list the auto-revert option that the version 8.1.0 release notes mention. It also does not state how it interacts with the intelligent option when both a manual list and the intelligent mode are enabled. It also does not say explicitly whether Manageable Restrictions apply only to the sizes the intelligent option suggests or also to the manual list. Treat those as open questions for your own test.

Microsoft's own workarounds for allocation failures, from the same Learn page, include these options:

- Retry the allocation after a short period.
- Resize the VM to a different size.
- Try another availability zone or region.
- Relax constraints in the request that make it overconstrained.
- Use On-demand Capacity Reservations to reserve compute capacity in advance.

Of these, the extender covers the resize option, since it falls back to alternate sizes, and, with Availability Zone Awareness on, the zone option within the region. Nerdio's page does not mention retrying, trying another region or relaxing constraints, so treat those as manual. Capacity reservations are an Azure feature outside Nerdio's page, and the Nerdio article does not mention them. They address the same risk from the other side, by securing capacity before you need it.

## A short setup checklist

1. Confirm the tenant is on a Premium entitlement.
2. For the host pool, note the default VM size with its vCPU and memory, so you can match alternates to it.
3. Open **Settings** > **Azure Capacity Extender** on the host pool and enable it.
4. Choose alternate sizes with matching vCPU and memory, and drag them into the order you prefer.
5. If hosts are spread across zones, check that **Distribute VMs across Availability Zones** is on, then enable Availability Zone Awareness.
6. Decide on the intelligent option only after you have tested the manual list. If you enable it, check the Manageable Restrictions fields as well.
7. Save, then check the result of the next "Add host" task after a scale-out or a host creation, and note which VM size was used if the task details show it.

## Sources

- [Nerdio Help Center: Host Pool Azure Capacity Extender Configuration](https://nmehelp.getnerdio.com/hc/en-us/articles/26124377923085-Host-Pool-Azure-Capacity-Extender-Configuration)
- [Nerdio Help Center: NME entitlements consumption and billing](https://nmehelp.getnerdio.com/hc/en-us/articles/26124388880397-NME-entitlements-consumption-and-billing)
- [Nerdio Help Center: Release Notes (version 8.1.0, auto-revert option)](https://nmehelp.getnerdio.com/hc/en-us/articles/19837802929677-Release-Notes)
- [Microsoft Learn: Troubleshooting Azure VM allocation failures](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-machines/windows/allocation-failure)
