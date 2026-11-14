---
title: "LRS vs ZRS vs GRS vs GZRS: Choosing Azure Storage Redundancy"
summary: "Compare Azure Storage redundancy options using Learn's figures: LRS, ZRS, GRS and GZRS plus the read-access variants. Durability from 11 to 16 nines, outage scenarios, supported services and account types, asynchronous replication and data loss, and how to choose."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [azure-storage-redundancy, azure-storage-account, availability-zones]
keypoints:
  - "LRS keeps copies in one datacenter (at least 11 nines durability), ZRS spreads them across three or more zones (12 nines), and GRS and GZRS add a secondary region (16 nines)."
  - "Learn recommends ZRS in the primary region for high availability, and GZRS for applications that need high consistency, durability, availability and disaster recovery resilience."
  - "Data reaches the secondary region asynchronously, so a regional failure can lose data; the gap is the recovery point objective, and Geo priority replication targets 15 minutes or less for block blobs."
  - "With GRS or GZRS the secondary is not readable unless you fail over; RA-GRS and RA-GZRS allow read access."
  - "The redundancy setting is shared by all services in a storage account, and Azure Files does not support RA-GRS or RA-GZRS."
faq:
  - q: "What is the difference between GRS and GZRS?"
    a: "Learn says the primary difference is how data is replicated in the primary region. GRS uses LRS in the primary region, GZRS uses ZRS across three or more availability zones. In the secondary region data is always copied synchronously by using LRS."
  - q: "Which option survives a datacenter loss?"
    a: "From Learn's outage table: an entire datacenter becoming unavailable is survived by ZRS and GZRS, and by GRS with account failover. LRS does not survive it. A region-wide outage in the primary region is survived only by GRS and GZRS, and needs account failover to restore write availability."
  - q: "Can I read from the secondary region?"
    a: "Not with plain GRS or GZRS unless a failover occurs. RA-GRS and RA-GZRS allow read access to the secondary. Learn notes that Azure Files does not support RA-GRS or RA-GZRS."
  - q: "Can redundancy protect against deletion or overwrites?"
    a: "No. Learn says all replicas reflect the same current state, so deletions and overwrites apply to all copies at once. Redundancy protects against hardware failure, not against data-modifying operations."
  - q: "Does one account hold different redundancy settings?"
    a: "No. The redundancy setting is shared by all storage services in the account. Learn suggests separate storage accounts for resources with different redundancy requirements."
---

LRS keeps your data in one datacenter, ZRS in three or more availability zones of one region, GRS adds a second region copied from LRS, and GZRS adds a second region copied from ZRS. Microsoft Learn recommends ZRS in the primary region for high availability, and GZRS for applications that need high consistency, durability, availability and resilience for disaster recovery. The cost is higher with each step. This comparison follows Learn's data redundancy page for Azure Storage.

## The decision factors

Learn gives three questions:

1. How is data replicated within the primary region?
2. Is data replicated to a second, geographically distant region to protect against regional disasters?
3. Does the application need read access to the replicated data in the secondary region during a primary outage?

Learn adds that the redundancy setting is shared by all storage services in a storage account, and suggests separate accounts for resources with different redundancy needs.

## The options side by side

| | LRS | ZRS | GRS / RA-GRS | GZRS / RA-GZRS |
| --- | --- | --- | --- | --- |
| Primary region copies | One datacenter | Three or more availability zones, synchronously | LRS in primary | ZRS in primary |
| Secondary region | None | None | Yes, asynchronous, then LRS | Yes, asynchronous, then LRS |
| Durability over a year | At least 11 nines | At least 12 nines | At least 16 nines | At least 16 nines |
| Availability for reads | At least 99.9% | At least 99.9% | At least 99.9% GRS, 99.99% RA-GRS | At least 99.9% GZRS, 99.99% RA-GZRS |
| Availability for writes | At least 99.9% | At least 99.9% | At least 99.9% | At least 99.9% |

Learn lowers some of those availability figures for the cool, cold and archive access tiers, so read the page's table for your tier. Learn also states that GRS does not allow reads from the secondary, so read availability during a primary outage needs RA-GRS or RA-GZRS.

## What each option means in practice

**LRS.** Copies sit in a single physical datacenter in your chosen region. Learn calls it the lowest-cost option with the least durability. It protects against drive, server and rack failures, but a disaster such as fire or flooding in the datacenter can make all replicas unrecoverable, and a temporary event such as a thermal event can make them temporarily unavailable. Learn names LRS as a fit when data can be easily rebuilt, when governance keeps data in one region, and for Azure unmanaged disks.

**ZRS.** Data is written synchronously to three or more zones, each a separate physical location with independent power, cooling and networking. Reads and writes continue if a zone fails, though Azure may make networking updates such as DNS repointing, so Learn advises transient fault handling with retries and exponential back-off. ZRS alone may not protect against a regional disaster that permanently affects several zones. Learn recommends ZRS for Azure Files workloads and for Azure Data Lake Storage workloads. The archive tier is not supported for ZRS, GZRS or RA-GZRS accounts, and unmanaged disks do not support ZRS or GZRS.

**GRS.** Synchronous LRS copies in the primary region, then asynchronous copy to a secondary region hundreds of miles away.

**GZRS.** ZRS in the primary region plus the same asynchronous secondary. To support GZRS, a region must have availability zones and a paired region.

The paired secondary region is determined by the primary region and cannot be changed.

## Outage scenarios from Learn

| Scenario | LRS | ZRS | GRS/RA-GRS | GZRS/RA-GZRS |
| --- | --- | --- | --- | --- |
| A node in a datacenter fails | Yes | Yes | Yes | Yes |
| An entire datacenter fails | No | Yes | Yes, with failover | Yes |
| Region-wide outage in the primary | No | No | Yes, with failover | Yes, with failover |
| Read access to secondary during primary outage | No | No | Yes with RA-GRS | Yes with RA-GZRS |

Account failover is needed to restore write availability if the primary region becomes unavailable.

## Asynchronous replication and data loss

Learn warns that data is replicated to the secondary asynchronously, so a failure of the primary region can lose data if the primary is not recoverable. The interval between the latest write to the primary and the last write to the secondary is the recovery point objective. Learn says Geo priority replication keeps the RPO for block blobs at 15 minutes or less. With read access enabled, the secondary endpoint is the account name with `-secondary` added, for example `myaccount-secondary.blob.core.windows.net`, and the keys are the same for both endpoints. All replicas reflect the same state, so redundancy does not protect against deletions or overwrites.

## Support by service and account type

Blob Storage, Queue Storage and Table Storage support all six options. Azure Files supports LRS, ZRS, GRS and GZRS but not the read-access variants, and SSD file shares are supported on LRS and ZRS. Managed disks support LRS and ZRS, with limitations for ZRS. Elastic SAN supports LRS and ZRS. For account types, Standard general-purpose v2 supports all four families. Premium block blobs and SSD file shares support LRS and ZRS. Legacy v1 and BlobStorage accounts support LRS and GRS only.

## How I would choose

This section is my advice, not a Microsoft statement.

1. **Start from the loss you must survive,** then use the outage table. If a lost datacenter is unacceptable, LRS is out.
2. **Use ZRS as the default for production data** in regions with zones, following Learn's recommendation for high availability. Add a secondary region when a regional loss is unacceptable.
3. **Pick the read-access variants only if the application can use the secondary.** Test the secondary endpoint in advance, as Learn suggests.
4. **State the RPO to the business.** Asynchronous replication means some recent writes may be lost.
5. **Do not mistake redundancy for backup.** Deletions replicate too. Use soft delete, versioning or backups for that risk.
6. **Separate accounts by need,** since the setting applies to the whole account.

## Related

- [Azure storage redundancy](https://www.m365.fm/entity/azure-storage-redundancy/)
- [Azure storage account](https://www.m365.fm/entity/azure-storage-account/)
- [Availability zones](https://www.m365.fm/entity/availability-zones/)

## Sources

- [Data redundancy - Azure Storage (Microsoft Learn)](https://learn.microsoft.com/azure/storage/common/storage-redundancy)
