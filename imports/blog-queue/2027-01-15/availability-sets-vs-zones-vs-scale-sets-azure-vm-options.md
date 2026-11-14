---
title: "Availability Sets vs Availability Zones vs Scale Sets: Azure VM Availability Options Compared"
summary: "Compare the Azure VM availability options Learn lists: availability zones, scale sets, availability sets, Load Balancer, storage redundancy and Site Recovery. See what each protects against, the 99.95% availability set SLA note and how to combine them."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [availability-sets, availability-zones, azure-virtual-machine-scale-sets, azure-load-balancer]
keypoints:
  - "An availability zone is a physically separate zone in a region with a distinct power source, network and cooling; each supported region has three."
  - "Scale sets create and manage a group of load balanced VMs that can grow or shrink with demand or a schedule, and can span zones or run regionally."
  - "Learn recommends two or more VMs in an availability set for a highly available app and to meet the 99.95% Azure SLA."
  - "Availability sets and scale sets cost nothing themselves; you pay for each VM instance."
  - "Learn says to combine Azure Load Balancer with availability zones and scale sets for the most application resiliency, and to plan storage redundancy and Site Recovery separately."
faq:
  - q: "What is the difference between an availability zone and an availability set?"
    a: "Per Microsoft Learn, an availability zone is a physically separate zone within an Azure region with its own power source, network and cooling, and there are three per supported region. An availability set is a logical grouping of VMs that lets Azure understand how your application is built for redundancy. Learn recommends two or more VMs in an availability set to meet the 99.95% Azure SLA."
  - q: "What do scale sets add?"
    a: "Scale sets let you create and manage a group of load balanced VMs, with the number of instances increasing or decreasing automatically in response to demand or a defined schedule. They provide high availability and central management of many VMs. Learn says VMs in a scale set can be deployed into multiple zones, a single zone or regionally, and that the options can differ by orchestration mode."
  - q: "Do these options cost extra?"
    a: "Learn says there is no cost for the scale set itself or for an availability set, and you pay only for each VM instance you create."
  - q: "Does a zone failure affect regional VMs?"
    a: "Learn notes that regional resources may or may not exist in an availability zone and you have no insight into which zone they are in. A failure in any of the zones in a region has the potential to bring down a regional VM."
  - q: "Do I still need backup or disaster recovery?"
    a: "Learn lists Azure Storage redundancy and Azure Site Recovery as separate pieces. Storage keeps multiple copies of data, and Site Recovery replicates workloads to a secondary location so you can fail over during an outage and fail back later."
---

Azure gives you several ways to keep VMs available, and they protect against different failures. An availability zone protects against the loss of a data center in a region. A scale set groups and scales load balanced VMs, and can span zones. An availability set groups VMs so Azure can arrange redundancy for your application. Learn says to combine Azure Load Balancer with zones and scale sets for the most resiliency. This comparison follows the Microsoft Learn overview of availability options for Azure Virtual Machines.

## The options side by side

| Option | What it is | What Learn says |
| --- | --- | --- |
| Availability zones | Physically separate zones inside an Azure region | Three zones per supported region, each with distinct power, network and cooling |
| Virtual machine scale sets | A group of load balanced VMs that scales | Instances can grow or shrink with demand or a schedule; can use multiple zones, a single zone or the region |
| Availability sets | A logical grouping of VMs | Two or more VMs recommended, to meet the 99.95% Azure SLA |
| Load Balancer | Distributes traffic across VMs | Combine with zones and scale sets for the most resiliency |
| Storage redundancy | Multiple copies of data | Choose by tradeoff between cost and availability |
| Site Recovery | Replicates workloads to a second location | Fail over during an outage, then fail back |

The page applies to Linux VMs, Windows VMs, flexible scale sets and uniform scale sets.

## Availability zones

An availability zone is a physically separate zone within an Azure region. There are three zones per supported region, and each has a distinct power source, network and cooling. Learn says that by designing solutions to use replicated VMs in zones, you can protect apps and data from the loss of a data center. If one zone is compromised, replicated apps and data are instantly available in another zone.

A note for design: regional resources may or may not exist in an availability zone, and you have no insight into what zone a regional resource is in. A failure in any zone of a region has the potential to bring down a regional VM. My reading: a VM you want to protect from zone loss therefore needs to be deployed zonal and replicated, not only regional.

## Scale sets

Learn says scale sets let you create and manage a group of load balanced VMs. The instance count can automatically increase or decrease in response to demand or a defined schedule. Scale sets provide high availability and let you manage, configure and update many VMs centrally. There is no cost for the scale set itself.

VMs in a scale set can be deployed into multiple zones, a single zone or regionally. Zone deployment options may differ based on the orchestration mode, which Learn links to a separate page.

## Availability sets

An availability set is a logical grouping of VMs that lets Azure understand how your application is built, to provide redundancy and availability. Learn recommends creating two or more VMs in an availability set to provide a highly available application and to meet the 99.95% Azure SLA. The availability set itself is free.

The overview page does not explain fault domains or update domains, so this article does not either. The availability set overview that Learn links is the next page to read if you use them.

## Load Balancer

Learn says to combine Azure Load Balancer with availability zones and scale sets to get the most application resiliency. The Load Balancer distributes traffic between multiple VMs. Learn adds that it is included for Standard tier VMs and that not all VM tiers include it. That sentence is worded loosely on the page, so check the Load Balancer documentation for the SKU you plan to use.

## Storage and recovery

Two further pieces are not about VM placement.

**Azure Storage redundancy.** Storage always keeps multiple copies of data to protect it from hardware failures, network or power outages and natural disasters. When you choose a redundancy option, Learn lists three factors: how data replicates in the primary region, whether it replicates to a distant second region, and whether your application needs read access to the replica if the primary region is unavailable.

**Azure Site Recovery.** It helps with business continuity by replicating workloads from a primary site to a secondary location, so you can fail over during an outage and fail back when the primary is running again. It can manage replication for Azure VMs between Azure regions, and for on-premises VMs, Azure Stack VMs and physical servers.

## How I would choose

This section is my advice, not a Microsoft statement.

1. **Start from the failure you want to survive.** Host or rack problems point to an availability set or a scale set. A data center loss points to zones. A region loss points to Site Recovery or a second region.
2. **Use zones for new designs where the region supports them.** Learn's wording on zones is the strongest statement on the page about protecting against data center loss.
3. **Use a scale set when the workload is stateless and scales.** The load balanced group and the schedule or demand based scaling are what scale sets add.
4. **Keep an availability set for workloads you cannot place in zones.** Learn's recommendation is two or more VMs in the set.
5. **Always put a load balancer in front** of replicated VMs, and check what the chosen SKU includes.
6. **Treat data separately.** Decide the storage redundancy and the recovery plan on their own, because VM placement does not protect the data copy.
7. **Document the SLA you rely on.** The page gives 99.95% for two or more VMs in an availability set, and links the full SLA text for details. Do not extend that number to other options from this page alone.

## Related

- [Availability sets](https://www.m365.fm/entity/availability-sets/)
- [Availability zones](https://www.m365.fm/entity/availability-zones/)
- [Azure Virtual Machine Scale Sets](https://www.m365.fm/entity/azure-virtual-machine-scale-sets/)
- [Azure Load Balancer](https://www.m365.fm/entity/azure-load-balancer/)

## Sources

- [Availability options for Azure Virtual Machines - Azure Virtual Machines (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-machines/availability)
