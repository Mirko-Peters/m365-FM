---
title: "Azure SQL Database vs Managed Instance vs SQL Server on Azure VMs"
summary: "Compare Azure SQL Database, Azure SQL Managed Instance and SQL Server on Azure Virtual Machines: PaaS versus IaaS, feature parity, size limits, CLR support, networking, administration and SLA, based on the Microsoft Learn comparison page."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [azure-sql-database, azure-sql-managed-instance]
keypoints:
  - "Azure SQL Database and Managed Instance are PaaS. SQL Server on Azure VMs is IaaS with full OS access and 100 percent SQL Server compatibility."
  - "Managed Instance offers almost 100 percent feature parity with the latest SQL Server and is described as the best fit for most migrations."
  - "Learn lists maximum sizes of up to 128 TB for SQL Database, 16 TB for Managed Instance and 256 TB for SQL Server on Azure VMs."
  - "CLR is not supported in SQL Database. It is supported in Managed Instance and on VMs."
  - "PaaS options handle backups, patching and recovery. On VMs you implement high availability yourself. The page gives no prices except a Basic tier from 5 dollars per month."
faq:
  - q: "What is the difference between PaaS and IaaS here?"
    a: "Azure SQL Database and Managed Instance are PaaS with built-in backups, patching and recovery. SQL Server on Azure VMs is IaaS, where you manage the operating system and SQL Server."
  - q: "Which option fits most migrations?"
    a: "Microsoft Learn describes Managed Instance as the best for most migrations to the cloud, because it has almost 100 percent compatibility with the latest SQL Server."
  - q: "Which option supports CLR?"
    a: "Managed Instance and SQL Server on Azure VMs support CLR. Azure SQL Database does not."
  - q: "What are the maximum database sizes?"
    a: "The page lists up to 128 TB for Azure SQL Database, up to 16 TB for Managed Instance and up to 256 TB for SQL Server on Azure VMs."
  - q: "Does the page give prices?"
    a: "Only that the Basic tier of Azure SQL Database starts from 5 dollars per month. It gives no prices for Managed Instance or VMs and no numeric SLA values."
---

Azure offers three ways to run SQL Server workloads: Azure SQL Database, Azure SQL Managed Instance and SQL Server on Azure Virtual Machines. The choice depends on how much compatibility and control you need and how much administration you want to hand to Microsoft. This guide follows the Microsoft Learn comparison page for these options.

## The three options

- **Azure SQL Database.** A PaaS database service. It has the latest stable SQL Server features.
- **Azure SQL Managed Instance.** A PaaS service with almost 100 percent feature parity with the latest SQL Server. Learn describes it as the best for most migrations to the cloud.
- **SQL Server on Azure VMs.** An IaaS option. It gives 100 percent SQL Server compatibility and access to the operating system.

## Side by side

| Topic | SQL Database | Managed Instance | SQL Server on VMs |
| --- | --- | --- | --- |
| Model | PaaS | PaaS | IaaS |
| Compatibility | Latest stable features | Almost 100 percent | 100 percent |
| Maximum size | Up to 128 TB | Up to 16 TB | Up to 256 TB |
| CLR | Not supported | Supported | Supported |
| Private IP | Through Private Link | In the virtual network | In the virtual network |
| OS access | No | No | Yes |

## Administration

With the PaaS options, built-in backups, patching and recovery are handled for you. Maintenance windows can be configured. With SQL Server on Azure VMs, you manage the operating system and SQL Server, and you implement high availability yourself. Resizing a VM causes downtime.

## Availability and SLA

Learn states that the PaaS options have a higher SLA. Zone redundancy is available. The SLA for virtual machines does not cover SQL Server processes inside the VM. The page gives no numeric SLA values, so check the Azure SLA pages for the current figures.

## Cost

The page says the Basic tier of Azure SQL Database starts from 5 dollars per month. It gives no price for Managed Instance or for VMs, so it does not support a cost ranking.

## What the page does not say

- Hyperscale. It is missing from the size table.
- Numeric SLA values.
- Prices for Managed Instance and VMs.
- A clear version-control row. The wording in that row is hard to read.
- A migration guide. Use the migration pages for that.

## A decision outline

This outline is practical advice built on the page.

1. If you need operating system access or full compatibility, look at VMs.
2. If you migrate an existing SQL Server estate and want PaaS, look at Managed Instance first.
3. If you build a new cloud application and need no instance-level features, look at SQL Database.
4. Check CLR and size needs against the table.
5. Check the current SLA and price pages before you commit.

## Typical mistakes

- Choosing SQL Database for an application that needs CLR.
- Choosing VMs for the PaaS savings in administration, which you do not get.
- Assuming a size limit from memory instead of from the page.
- Comparing cost without prices for all three options.

## Which question points to which option

The page frames the choice around a few questions. The answers below restate its table and text.

- **Do you need the latest stable features and no instance-level control?** Azure SQL Database fits. It is PaaS, CLR is not supported, and a private IP is available through Private Link.
- **Do you migrate an existing SQL Server estate and want a managed service?** Managed Instance has almost 100 percent feature parity, supports CLR, and sits in your virtual network with a private IP. Its listed maximum is 16 TB.
- **Do you need operating system access, full compatibility or very large databases?** SQL Server on Azure VMs gives 100 percent compatibility and a listed maximum of up to 256 TB.

## Who does what

| Task | PaaS options | SQL Server on VMs |
| --- | --- | --- |
| Backups, patching, recovery | Built in | You manage them |
| Maintenance windows | Configurable | Not described on the page |
| High availability | Built in, with zone redundancy | You implement it |
| Resizing | Not described as downtime | Downtime when resizing |

The last row is cautious on purpose. The page names downtime only for VM resizing.

## Related

- [Azure SQL Database](https://www.m365.fm/entity/azure-sql-database/)
- [Azure SQL Managed Instance](https://www.m365.fm/entity/azure-sql-managed-instance/)
- [Azure Private Link](https://www.m365.fm/entity/azure-private-link/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)

## Sources

- [Compare Azure SQL options: IaaS and PaaS (Microsoft Learn)](https://learn.microsoft.com/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview)
