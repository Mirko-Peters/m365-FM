---
title: "Azure Managed Disk Types Compared: Ultra, Premium SSD v2, Premium SSD, Standard SSD and Standard HDD"
summary: "Azure offers five managed disk types. Compare limits, OS disk support, restrictions and billing for Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD and Standard HDD, including the Standard HDD OS disk retirement on September 8, 2028."
status: review
publish: false
author: mirko-p
date: 2027-01-14
topics: [azure-disk-storage, azure-virtual-machines]
keypoints:
  - "Azure has five managed disk types: Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD and Standard HDD."
  - "Ultra Disk and Premium SSD v2 cannot be used as OS disks; Premium SSD and Standard SSD can."
  - "Learn says Standard HDDs lose OS disk support on September 8, 2028 and asks you to migrate before then."
  - "Ultra and Premium SSD v2 let you set capacity, IOPS and throughput separately; Premium SSD v2 includes 3,000 IOPS and 125 MB/s at no extra charge."
  - "Ultra Disks and Premium SSD v2 have restrictions on caching, Azure Compute Gallery and redundancy options that you should check before design."
faq:
  - q: "How many managed disk types does Azure offer?"
    a: "Microsoft Learn lists five: Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD and Standard HDD. The first four are SSD based and Standard HDD is hard disk drive based."
  - q: "Which disk types can be OS disks?"
    a: "Premium SSD and Standard SSD. Ultra Disk and Premium SSD v2 cannot be used as OS disks. Standard HDD can still be used as an OS disk, but Learn says that ability is retired on September 8, 2028 and links a migration article."
  - q: "What is the maximum IOPS and throughput per disk type?"
    a: "Per Learn: Ultra Disk 400,000 IOPS and 10,000 MB/s; Premium SSD v2 80,000 IOPS and 2,000 MB/s; Premium SSD 20,000 IOPS and 900 MB/s; Standard SSD 6,000 IOPS and 750 MB/s; Standard HDD 2,000 IOPS (3,000 with performance plus) and 500 MB/s."
  - q: "What is different about Premium SSD v2 compared with Premium SSD?"
    a: "Premium SSD v2 has no dedicated sizes, so you set any supported size and adjust performance without downtime. It does not support host caching but offers lower latency. Learn says it generally costs less than Premium SSD and offers higher performance."
  - q: "Are there extra charges beyond disk size?"
    a: "Learn lists disk type, provisioned size, snapshots, outbound data transfers and transactions as billing factors. It also describes an Ultra Disk VM reservation fee, charged per vCPU when a VM has the Ultra Disk capability enabled but no Ultra Disk attached."
---

Azure offers five managed disk types: Ultra Disk, Premium SSD v2, Premium SSD, Standard SSD and Standard HDD. Ultra Disk has the highest limits, but Ultra Disk and Premium SSD v2 cannot be OS disks and both have design restrictions. Premium SSD and Standard SSD work as OS disks. Standard HDD is for infrequently accessed, latency-tolerant work, and its use as an OS disk is retired on September 8, 2028. This comparison follows the Microsoft Learn page on selecting a disk type for Azure IaaS VMs.

## The five types side by side

| | Ultra Disk | Premium SSD v2 | Premium SSD | Standard SSD | Standard HDD |
| --- | --- | --- | --- | --- | --- |
| Media | SSD | SSD | SSD | SSD | HDD |
| Max disk size | 65,536 GiB | 65,536 GiB | 32,767 GiB | 32,767 GiB | 32,767 GiB |
| Max throughput | 10,000 MB/s | 2,000 MB/s | 900 MB/s | 750 MB/s | 500 MB/s |
| Max IOPS | 400,000 | 80,000 | 20,000 | 6,000 | 2,000 (3,000 with performance plus) |
| OS disk | No | No | Yes | Yes | Yes, retiring September 8, 2028 |

Learn's scenario guidance for each type:

- **Ultra Disk:** I/O-intensive workloads such as SAP HANA, top-tier databases (SQL Server and Oracle Database are examples) and other transaction-heavy workloads.
- **Premium SSD v2:** production and performance-sensitive workloads that consistently need low latency, high IOPS and high throughput.
- **Premium SSD:** production workloads that need high performance and low latency.
- **Standard SSD:** web servers, lightly used enterprise applications, and development and test environments.
- **Standard HDD:** backup and other noncritical, infrequently accessed workloads.

The page also has a decision tree based on latency, IOPS and throughput: Standard HDD for cost-efficient storage, Standard SSD for consistent performance, Premium SSD for high performance, Premium SSD v2 for very low latency, Ultra Disk for the highest performance.

## Ultra Disk

Learn calls Ultra Disks the highest-performing storage option for Azure VMs. You can change performance parameters without restarting the VM.

- **Use:** data disks only, created as empty disks. Use Premium SSDs as the OS disks.
- **Size:** 4 GiB up to 64 TiB, in 1 GiB increments, billed per GiB. By default you can deploy 100 TiB of Ultra capacity per region per subscription, with more on request.
- **Performance:** you set capacity, IOPS and throughput individually, and each value affects the cost. IOPS limits are 1,000 per GiB up to 400,000 per disk, with a minimum baseline of 100. Throughput is up to 0.25 MB/s per provisioned IOPS, up to 10,000 MB/s, with a minimum guaranteed throughput of 1 MB/s.
- **Changing performance:** up to four performance resize operations in 24 hours, and a change can take up to an hour. A resize can fail because of a lack of performance bandwidth capacity.
- **Limitations:** no use as an OS disk or with Azure Compute Gallery; only Single VM and availability zone infrastructure options as locally redundant storage, with no zone redundant storage; no availability sets; no disk caching.

## Premium SSD v2

Learn says Premium SSD v2 offers higher performance than Premium SSDs while generally costing less, and that for most general purpose workloads it can provide the best price performance. It suits SQL Server, Oracle, MariaDB, SAP, Cassandra, MongoDB, big data and analytics, and gaming on VMs or stateful containers.

- **No dedicated sizes.** Set any supported size from 1 GiB to 64 TiB, in 1 GiB increments, and adjust performance without downtime.
- **Included baseline.** Every disk has 3,000 IOPS and 125 MB/s of throughput free of charge. Going above those values raises the price.
- **IOPS scaling.** After 6 GiB, the maximum IOPS rises by 500 per GiB, up to 80,000. Learn says an 8 GiB disk can have up to 4,000 IOPS and 80,000 IOPS needs at least 160 GiB.
- **Throughput scaling.** The maximum rises by 0.25 MB/s per set IOPS, and 2,000 MB/s is the maximum for disks with 8,000 IOPS or more.
- **Performance changes.** Four adjustments within 24 hours, and creating the disk counts as one.
- **Limitations:** not usable as an OS disk or with Azure Compute Gallery, and no host caching. In most regions with availability zones you can attach Premium SSD v2 only to zonal VMs, so specify the zone when you create the VM. Learn explains that lower latency addresses some of the same problems host caching solves, and that adjustable size and performance means you can avoid striping disks.

## Premium SSD

Premium SSDs are for I/O-intensive workloads and mission-critical production, but work only with compatible VM series. Check each VM size's article for premium storage support.

- **Fixed sizes** from P1 (4 GiB) to P80 (32,767 GiB). Capacity, IOPS and throughput are guaranteed at provisioning, designed to be met 99.9% of the time with single-digit millisecond latency.
- **Bursting:** Learn says Premium SSDs offer disk bursting, which is useful during OS disk boot and for spiky traffic. Its size table lists burst up to 3,500 IOPS for 30 minutes on P1 to P20, and up to 30,000 IOPS on P30 and larger for disks with on-demand bursting enabled.
- **Expanded performance:** P30 and larger have expanded IOPS and throughput on disks with performance plus enabled.
- **Reservation:** Learn says disk reservations (one year) cover Premium SSD sizes P30 to P80 in all production regions.

## Standard SSD

Standard SSDs target consistent performance at lower IOPS levels and are described as an especially good choice for customers with varying workloads supported by on-premises HDD solutions. Compared with Standard HDD, Learn says they have better availability, consistency, reliability and latency. Sizes run from E1 to E80 (32,767 GiB). Learn says there is an hourly limit on Standard SSD transactions that incur a billable cost.

## Standard HDD

Standard HDDs suit latency-tolerant workloads with large sequential I/O, such as light data processing that reads or writes large files sequentially. Learn says they are not suitable for workloads that need low latency or frequent small-block access, such as OS disks or transactional databases, and to use Standard SSD or Premium SSD for those. Sizes run from S4 to S80.

A retirement note: on September 8, 2028, the ability to use Standard HDDs as OS disks is retired. Learn links an article titled "Migrate your Standard HDD OS disks by September 08, 2028".

## Billing

Learn lists these billing factors: disk type, managed disk size, snapshots, outbound data transfers and number of transactions.

- **Size:** you pay for the provisioned size, rounded up to the nearest offered size. Learn's example is a 200 GiB Standard SSD that maps to E15 (256 GiB). Billing is prorated hourly.
- **Snapshots:** billed on used size, not provisioned size.
- **Ultra Disk VM reservation fee:** a VM with Ultra Disk capability enabled but no Ultra Disk attached incurs a per-vCPU reservation charge. The charge does not apply once an Ultra Disk is attached.
- **Disk reservation:** a one-year commitment for Premium SSD P30 to P80.

## How I would choose

This is my advice, not a Microsoft statement.

1. Start with the OS disk. Only Premium SSD, Standard SSD and (until retirement) Standard HDD qualify, so the Ultra versus Premium SSD v2 question is about data disks.
2. For new production data disks, compare Premium SSD v2 against Premium SSD. Check the zonal VM requirement for v2 and whether you depend on host caching, which v2 does not support.
3. Use Ultra Disk only when you have measured a need beyond Premium SSD v2 limits, because of its restrictions: no caching, LRS only, no availability sets.
4. For test and light workloads, Standard SSD is the sensible floor. Keep Standard HDD for backup-type data.
5. Check the VM size's own disk limits. For Ultra Disks, Learn says the selected disk IOPS must be below the VM IOPS limit to reach the target, and I would check the same for every disk type.
6. Plan any Standard HDD OS disk migration before September 8, 2028.

## Related

- [Azure Disk Storage](https://www.m365.fm/entity/azure-disk-storage/)
- [Azure Virtual Machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Azure Spot Virtual Machines](https://www.m365.fm/entity/azure-spot-virtual-machines/)

## Sources

- [Select a disk type for Azure IaaS VMs - managed disks - Azure Virtual Machines (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-machines/disks-types)
