---
title: "Azure Files or Azure NetApp Files for FSLogix: cost and performance compared"
summary: "Both Azure Files and Azure NetApp Files can host FSLogix profile containers over SMB, and Microsoft Learn recommends Azure Files for most customers. This comparison sets billing, published limits, Learn's workload tier tables, region and identity prerequisites side by side, using Microsoft Learn only."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-files, azure-netapp-files, fslogix]
keypoints:
  - "Learn states: \"We recommend storing FSLogix profile containers on Azure Files for most of our customers.\" Azure NetApp Files is the other Azure-native option, with higher stated ceilings: up to 460K IOPS at about 1 ms, against 100K IOPS at about 3 ms."
  - "Both bill what you provision, not what you store. Azure Files provisioned v2 bills storage, IOPS and throughput separately, and Azure NetApp Files bills capacity pools by the hour, with a minimum pool of 1 TiB."
  - "Learn's FSLogix page lists Azure Files as available in all regions and Azure NetApp Files in select regions, but the Azure Files billing article adds that not all regions support all media tiers and redundancy options. Check region, media and redundancy together."
  - "Azure NetApp Files SMB volumes need an Active Directory connection and a delegated subnet, and Learn's FSLogix article says Entra-only identities are not supported there. Entra Kerberos for Azure NetApp Files is announced as a preview from September 2026. Azure Files documents an Entra Kerberos route."
  - "This article gives no prices, because Learn only shows representative, region-dependent rates. Use the Azure pricing calculator with your region, user count and profile size."
faq:
  - q: "Which does Microsoft recommend for FSLogix, and which is cheaper?"
    a: "Learn recommends Azure Files for most customers. It does not say which is cheaper, and this article gives no prices. Both bill provisioned resources, so the cost depends on region, redundancy, profile size and the tier you provision. Model your own case in the Azure pricing calculator."
  - q: "Is Azure NetApp Files faster than Azure Files for profiles?"
    a: "Learn's FSLogix storage page lists higher maximum IOPS and lower latency for Azure NetApp Files: up to 460K IOPS per volume at about 1 ms, against up to 100K IOPS per share at about 3 ms. These are ceilings, and the pages used here give no profile-specific benchmark that compares the two."
  - q: "Can Azure NetApp Files host FSLogix profile containers?"
    a: "Yes. Learn lists FSLogix user profile containers, including FSLogix ODFC (Office) containers, as a supported workload for SMB Continuous Availability on Azure NetApp Files. The SMB volume needs an Active Directory connection and a delegated subnet, and Learn says Entra-only identities are not currently supported."
---

Azure Files and Azure NetApp Files can both host FSLogix profile containers over SMB, and Microsoft Learn is explicit about its default: "We recommend storing FSLogix profile containers on Azure Files for most of our customers." Azure NetApp Files is the other Azure-native option, with higher stated performance ceilings and a different billing model, region list and identity prerequisites. This comparison uses Learn only, gives no prices and states where Learn is silent or its pages differ. Sources are listed at the end and were retrieved on 17 November 2026.

## What FSLogix needs from storage

A [profile container](/entity/fslogix-profile-container/) redirects the entire Windows user profile into a virtual hard disk stored on a storage provider, and Learn says the most common provider is an SMB file share ([FSLogix tutorial](https://learn.microsoft.com/en-us/fslogix/tutorial-configure-profile-containers)). The `VHDLocations` registry value points to the share, with the form `\\{windows-server-or-azure-files-fqdn}\{share-name}`, and the default `SizeInMBs` is 30000. The prerequisite is an SMB share with NTFS and share-level permissions configured. Everything below is about the share that holds those VHDX files. [FSLogix](/entity/fslogix/) itself is the same on both.

## Side by side

Learn's [storage options article for FSLogix](https://learn.microsoft.com/en-us/azure/virtual-desktop/store-fslogix-profile) compares the options. These values are from that page:

| Area | Azure Files | Azure NetApp Files |
|---|---|---|
| Regional availability | All regions | Select regions |
| Redundancy | Locally, zone, geo and geo-zone redundant | Locally redundant; zone-redundant with cross-zone replication; geo-redundant with cross-region replication |
| Tiers | Standard (transaction optimized), Premium | Standard, Premium, Ultra |
| Stated maximum performance | Up to 100K IOPS and 10 GBps per share at about 3 ms latency | Up to 460K IOPS and 4.5 GBps per volume at about 1 ms latency |
| Capacity (FSLogix page) | 100 TiB per share, up to 5 PiB per general purpose account | 100 TiB per volume, up to 12.5 PiB per NetApp account |
| Minimum size | Share: 1 GiB | Capacity pool: 1 TiB; volume: 50 GiB |
| Backup | Azure Backup snapshot integration | Azure NetApp Files snapshots and Azure NetApp Files backup |
| Identity | Native Active Directory and Microsoft Entra Domain Services | Microsoft Entra Domain Services and native Active Directory |

The page carries no preview or general availability labels for these rows. Learn's NetApp [solution page for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/azure-netapp-files/solutions-windows-virtual-desktop) states up to 450,000 IOPS and sub-millisecond latency, slightly different from the 460K and about 1 ms above, so treat the figures as order of magnitude. The capacity row is the FSLogix page's figure; the Azure Files scale targets page lists different limits by media type, shown in the next section. The same page reports a 500-user LoginVSI test with roughly 62 knowledge users per D16as_v4 VM, which tests the session hosts, not a comparison with Azure Files.

## Which tier Learn suggests for which workload

The same FSLogix storage page gives recommendations by workload type. For Azure Files:

| Workload | Recommended Azure Files tier |
|---|---|
| Light (fewer than 200 users) | Standard file shares |
| Light (more than 200 users) | Premium file shares, or standard with multiple file shares |
| Medium, Heavy, Power | Premium file shares |

For Azure NetApp Files:

| Workload (Learn's example users) | Recommended tier |
|---|---|
| Light (basic data entry) | Standard |
| Medium (consultants, market researchers) | Premium for a small to medium user count, Standard for a large user count |
| Heavy (software engineers, content creators) | Premium for a small to medium user count, Standard for a large user count |
| Power (graphic designers, 3D model makers, machine learning researchers) | Ultra for a small user count, Premium for a medium count, Standard for a large count |

Learn gives no user-count boundaries for "small", "medium" or "large". It adds that more provisioned capacity gives a higher performance budget, which likely allows a lower tier and a more optimal total cost of ownership, and it points to an Azure NetApp Files sizing calculator for choosing tier and volume size. For Azure NetApp Files, Learn's [FSLogix configuration article](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-netapp) also says to limit concurrent profiles actively accessing containers on a single regular volume to 3,000, because exceeding that can significantly increase latency; above that it suggests distributing users across volumes, each in a different availability zone.

## Performance: what the limits mean for profiles

These are ceilings for a share or volume. A profile workload is many users, each with one VHDX file, so per-file limits matter too. For SSD file shares, Learn's [scale targets](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-scale-targets) list a maximum of 12,000 data IOPS per file, up to about 3 GiB/s SMB read throughput per file and 2,000 concurrent handles per file and directory. The HDD tiers, which include the standard shares recommended for light workloads, are lower per file: 1,000 IOPS and 60 MiB/s. Whether a single profile reaches these figures depends on the workload, and Learn gives no profile-specific numbers. The scale targets page also gives capacity by media type, which differs from the single figure in the table above: 256 TiB per share and per account for SSD provisioned v2, 100 TiB for SSD provisioned v1, 256 TiB per share and 4 PiB per account for HDD provisioned v2, and 100 TiB per share and 5 PiB per account for HDD pay-as-you-go. SSD provisioned v2 shares can be provisioned from 32 GiB to 256 TiB. The 1 GiB minimum share size in the table is the figure on the FSLogix page. The scale targets page lists 32 GiB for SSD provisioned v2 and 100 GiB for SSD provisioned v1, so check the minimum for the tier you choose.

For Azure NetApp Files, throughput follows the service level and the capacity ([service levels](https://learn.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-service-levels)): up to 16 MiB/s per TiB for Standard, 64 MiB/s for Premium and 128 MiB/s for Ultra. Learn's example is a 2 TiB Premium volume in an auto QoS pool, which gets 128 MiB/s. The Flexible service level, which has a minimum throughput of 128 MiB/s for a pool and is supported only for new manual QoS capacity pools, is outside this comparison. The 1 TiB minimum pool at the three linear levels gives, by simple multiplication, 16, 64 and 128 MiB/s.

## Cost: how each one is billed

No prices appear here. Learn shows only representative rates for Azure NetApp Files, says they depend on the region and refers readers to the pricing page. The billing models are what Learn does describe.

**Azure Files** ([billing article](https://learn.microsoft.com/en-us/azure/storage/files/understanding-billing)) has three models:

- **Provisioned v2**: you provision storage, IOPS and throughput separately and pay for what you provision, regardless of use. Learn says to use it for all new Azure Files deployments. You can scale up or down, but you can only decrease a quantity 24 hours after the last increase. Snapshots cost nothing extra if they fit in the unused provisioned space.
- **Provisioned v1**: you provision storage, and IOPS and throughput follow the size. Optional paid bursting is available in PowerShell and CLI.
- **Pay-as-you-go**: you pay for used storage and transactions. The scale targets article places these accounts on the HDD tier, and Learn's FSLogix page recommends standard shares for light workloads of fewer than 200 users.

**Azure NetApp Files** ([cost model](https://learn.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-cost-model)) bills a combination of provisioned capacity and throughput through capacity pools, not the data stored. The service measures pool allocation every hour. A pool has a minimum size of 1 TiB and grows in 1 TiB steps. The rate per GiB-hour rises from Standard to Ultra. Snapshots use the volume's quota and are not billed separately. Reserved capacity gives a discount on the per-GiB rate for a committed quantity.

The practical difference, calculated from the minimums above, is granularity. A small profile estate of 200 GiB still sits in a pool of at least 1 TiB on Azure NetApp Files, while Azure Files provisioned v2 starts at 32 GiB for SSD shares and lets you set IOPS and throughput apart from size. Neither fact tells you which is cheaper for your case.

## Identity and network prerequisites

**Azure Files.** Besides AD DS and Microsoft Entra Domain Services, Learn's [profile container article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-profile-container-azure-ad) describes Microsoft Entra Kerberos for hybrid identities on Entra joined or hybrid joined session hosts without line-of-sight to a domain controller, and for cloud-only identities in the Azure cloud only. A storage account can use only one authentication method. Multifactor authentication must be disabled on the storage account, and cloud-only groups need a manifest tag. See [Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/).

**Azure NetApp Files.** An SMB volume needs an Active Directory connection and a subnet delegated to the service, with one delegated subnet per virtual network ([SMB volume article](https://learn.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-create-volumes-smb)). Regular volume quotas run from 50 GiB to 100 TiB. SMB Continuous Availability is supported for FSLogix user profile containers, including FSLogix ODFC containers, and Learn's FSLogix article recommends enabling it for FSLogix. That article also says Azure NetApp Files requires Kerberos authentication from AD DS or Microsoft Entra Domain Services, and states: "Azure NetApp Files does not currently support FSLogix profile access using Entra-only (cloud-only) identities." Learn's Azure NetApp Files [what's new page](https://learn.microsoft.com/azure/azure-netapp-files/whats-new) lists a September 2026 preview, "Support for Microsoft Entra Kerberos authentication (preview)", for SMB volumes with hybrid or cloud-only identities. Learn's pages therefore differ: the FSLogix article does not mention the preview, and a preview is not a general availability feature. Check both pages before you plan an Entra-only design on Azure NetApp Files.

**Both.** Learn's tutorial and the Azure NetApp Files FSLogix article warn that file shares hosting FSLogix containers that are not upgraded to AES-SHA1 might have access issues once the April 2026 Windows Server update changes the default Kerberos encryption type from RC4 to AES-SHA1. The pages still call this an upcoming change at retrieval, so check your patch level and the share's encryption setting.

## How to decide

1. Start from Learn's default: Azure Files for most customers. Move to Azure NetApp Files if your workload tier and user count point to it in the tables above.
2. Check region, media type and redundancy. Azure NetApp Files is listed for select regions, and Azure Files does not offer every media tier and redundancy option in every region.
3. Check identity. If session hosts are Entra joined and users are cloud-only, Azure Files has a documented route. For Azure NetApp Files, Learn's FSLogix article says Entra-only identities are not supported, and Entra Kerberos is a September 2026 preview.
4. Estimate profile size and concurrent logons, then compare the per-share, per-file and 3,000-profile volume limits and the service level throughput against that estimate.
5. Model cost for each option in the Azure pricing calculator for the same region and redundancy.
6. Compare backup and recovery: Azure Backup for Azure Files, snapshots and backup for Azure NetApp Files.
7. Pilot with a representative group and measure logon time before you commit.

If neither fits, Learn also lists Storage Spaces Direct, which is self-managed.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Storage options for FSLogix profile containers in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/store-fslogix-profile)
- [Microsoft Learn: Azure Files scalability and performance targets](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-scale-targets)
- [Microsoft Learn: Understand Azure Files billing](https://learn.microsoft.com/en-us/azure/storage/files/understanding-billing)
- [Microsoft Learn: Service levels for Azure NetApp Files](https://learn.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-service-levels)
- [Microsoft Learn: Cost model for Azure NetApp Files](https://learn.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-cost-model)
- [Microsoft Learn: Azure NetApp Files for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/azure-netapp-files/solutions-windows-virtual-desktop)
- [Microsoft Learn: Create an SMB volume for Azure NetApp Files](https://learn.microsoft.com/en-us/azure/azure-netapp-files/azure-netapp-files-create-volumes-smb)
- [Microsoft Learn: Create a profile container with Azure Files and Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-profile-container-azure-ad)
- [Microsoft Learn: Configure profile containers with FSLogix](https://learn.microsoft.com/en-us/fslogix/tutorial-configure-profile-containers)
- [Microsoft Learn: Configure Azure NetApp Files for FSLogix profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-netapp)
- [Microsoft Learn: What's new in Azure NetApp Files](https://learn.microsoft.com/azure/azure-netapp-files/whats-new)
