---
title: "Fix Azure VM AllocationFailed and Overconstrained Allocation Errors: Workarounds in Order"
summary: "Resolve Azure VM allocation failures using Microsoft Learn: what AllocationFailed, ZonalAllocationFailed and the Overconstrained errors mean, and the documented workarounds for standalone VMs, availability sets, zones, proximity placement groups, old sizes and large deployments."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [azure-virtual-machines]
keypoints:
  - "AllocationFailed and ZonalAllocationFailed mean too little capacity for the VM size in the region or zone. Overconstrained errors mean the platform cannot meet the combined constraints."
  - "For a standalone VM, Learn lists retrying later, resizing to a size with more availability, or changing region or zone."
  - "In an availability set, stop and deallocate all VMs, then start them together so allocation can use all clusters."
  - "For overconstrained errors, relax constraints such as Accelerated Networking, proximity placement groups and Ultra or Premium SSD v2 disks."
  - "On-demand Capacity Reservations are recommended to reserve compute ahead. A VM can join an availability set only at creation."
faq:
  - q: "What do AllocationFailed and ZonalAllocationFailed mean?"
    a: "According to Microsoft Learn, there is not enough capacity for the requested VM size in the region or zone."
  - q: "What do the Overconstrained errors mean?"
    a: "The platform cannot meet the combined constraints of the request. Learn names VM size, Accelerated Networking, availability zone, ephemeral disk, proximity placement group and Ultra or Premium SSD v2 disks as likely constraints."
  - q: "How do I fix a failure in an availability set?"
    a: "Create the new VM in a different availability set, resize to a size the set supports, or stop and deallocate all VMs in the set and start them together."
  - q: "Do scale sets behave the same?"
    a: "Learn says a scale set is handled the same way as a standard VM. For deployments over 500 cores it suggests scale sets with multiple placement groups."
  - q: "How can I avoid capacity failures?"
    a: "Learn recommends on-demand Capacity Reservations to make deployments more reliable and predictable, and treats the other workarounds as temporary."
---

An allocation failure means Azure could not place your VM on hardware that matches the request. This guide follows the Microsoft Learn troubleshooting article on allocation failures. It applies to creating, starting, redeploying and resizing VMs.

## The errors

- **AllocationFailed** or **ZonalAllocationFailed:** not enough capacity for the requested VM size in this region.
- **OverconstrainedAllocationRequest** or **OverconstrainedZonalAllocationRequest:** the platform cannot meet the combined constraints of the request.

Azure partitions servers into clusters. Normally a request is tried across several clusters, but constraints such as VM size, Ultra SSD and proximity placement groups can limit it to one cluster, where it can fail.

## Workarounds by scenario

1. **Standalone VM:** retry after a short period, resize to a size with more availability, or change the region or zone. Learn's examples of alternatives are Standard_A2_v2, Standard_A2m_v2 and Standard_D2a_v4, or zones 1 and 3.
2. **Resize, add VMs or start partially deallocated VMs in an availability set:** the request must go to the cluster hosting the set. Create a new VM in a different availability set in the same region, resize to a size the set supports, or stop and deallocate all VMs in the set and start them together. In the portal, filter Virtual machines for the set, select all, select **Stop**, wait for Stopped (deallocated), then select **Start**. A VM can be added to an availability set only at creation.
3. **Start fully deallocated VMs in an availability set:** retry, resize, or change the region or zone.
4. **Availability zones:** retry later, resize, or change the zone. Creating a VM from a copy of the OS disk without a zonal constraint widens allocation to the whole region.
5. **Overconstrained failures:** retry, resize or change zone, or relax constraints by disabling Accelerated Networking, removing the VM from a proximity placement group or removing Ultra or Premium SSD v2 disks.
6. **Proximity placement groups:** the first VM started picks the datacenter. Deallocate all VMs in the group and start them in a different order, beginning with the most restrictive SKU.
7. **Older sizes:** Av1, Dv1, DSv1, D15v2 and similar do not run on the latest infrastructure. Learn suggests Av2, Dv3 or DSv3, Ev3 or ESv3, and D16v3 or D32v3 equivalents.
8. **Deployments over 500 cores:** reduce the instance count, or consider scale sets with multiple placement groups. A scale set can change from single to multiple placement groups, not the reverse.

## Reserve capacity

Learn recommends on-demand Capacity Reservations to reserve compute in advance, and describes the other workarounds as temporary until your preferred size is available in your preferred region. The article gives no details on reservations.

## Practical order

This is a suggestion, not Microsoft guidance. Retry once, then try the least disruptive change, such as an alternative size, before moving zone or region.

## Reading the message

The AllocationFailed text says there is not enough capacity for the requested VM size in the region and points to Microsoft's allocation guidance. For a scale set with a single placement group, the message says allocation may be scoped to a single cluster that is out of capacity. Learn says the requested size is then not currently available in the selected region or zone, and you can apply an alternative size or zone to your VM input or resize the existing VM, then retry.

## Where the portal steps apply

The only portal steps in the article are for stopping and starting all VMs in an availability set. The rest of the workarounds link to separate articles, for example on changing the availability set of a VM, creating a snapshot of a disk, creating a VM from a snapshot and moving Azure VMs across regions.

## Legacy size replacements

| Legacy size | Recommended |
| --- | --- |
| Av1 | Av2-series |
| Dv1 and DSv1 (D1 to D5) | Dv3 and DSv3-series |
| Dv1 and DSv1 (D11 to D14) | Ev3 and ESv3-series |
| D15v2 and DS15v2 | D16v3 or DS16v3, or D32v3 or DS32v3. For isolation, E64i_v3 or E64is_v3 |

## Not covered

The article gives no CLI, PowerShell or REST commands for these steps, no retry timing, no way to check capacity in advance, and no cost or quota information.

## Related

- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)

## Sources

- [Troubleshoot allocation failures](https://learn.microsoft.com/troubleshoot/azure/virtual-machines/windows/allocation-failure)
