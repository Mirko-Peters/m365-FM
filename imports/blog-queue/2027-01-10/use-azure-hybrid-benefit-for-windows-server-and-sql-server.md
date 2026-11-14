---
title: "How to Use Azure Hybrid Benefit for Windows Server and SQL Server"
summary: "Apply Azure Hybrid Benefit to Azure SQL Database and Managed Instance: eligibility, where it applies, portal steps, core conversion ratios, the 180-day migration allowance and what the SQL page does not say about Windows Server and SQL Server on VMs."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [azure-hybrid-benefit, azure-sql-database, azure-sql-managed-instance]
keypoints:
  - "Azure Hybrid Benefit applies Software Assurance-enabled SQL Server licenses to Azure SQL Database and Managed Instance. Learn says you can save up to 30 percent or more."
  - "For SQL Database it works only with the provisioned compute tier of the vCore model, not the DTU model or serverless."
  - "Enable it in the portal under Compute + storage in Settings. Enabling needs no downtime."
  - "Conversion ratios: Enterprise General Purpose 1 core to 4 vCores, Enterprise Business Critical 1 to 1, Standard General Purpose 1 to 1, Standard Business Critical 4 cores to 1 vCore."
  - "The SQL page has no Windows Server content and no body content on SQL Server on VMs. A 180-day migration allowance applies."
faq:
  - q: "What is Azure Hybrid Benefit for SQL?"
    a: "It lets you apply your SQL Server licenses with Software Assurance to Azure SQL Database and Azure SQL Managed Instance. Microsoft Learn says you can save up to 30 percent or more. It discounts only the SQL Server Database Engine license component."
  - q: "Where does it work?"
    a: "For Azure SQL Database only with the provisioned compute tier of the vCore purchasing model. It does not apply to the DTU model or the serverless tier. It is also supported for Managed Instance."
  - q: "How do I turn it on for an existing database?"
    a: "Select Compute + storage in the Settings menu, then select Save money. If you do not see the option, check that you use the vCore provisioned tier. For Managed Instance select Azure Hybrid Benefit under Compute + storage."
  - q: "How many vCores does one core license cover?"
    a: "SQL Server Enterprise with Software Assurance: 4 vCores in General Purpose or 1 in Business Critical. Standard: 1 vCore in General Purpose, and 4 on-premises cores for 1 vCore in Business Critical."
  - q: "What about Windows Server?"
    a: "The SQL page read for this guide does not mention Windows Server. This guide gives no Windows Server rules."
---

Azure Hybrid Benefit lets you use licenses you already own to lower Azure costs. The topic name mentions Windows Server and SQL Server. The Microsoft Learn page read for this guide covers the SQL side for Azure SQL Database and Azure SQL Managed Instance and has no Windows Server content, so this guide does the same.

## What it is

Azure Hybrid Benefit lets you apply Software Assurance-enabled SQL Server licenses to Azure SQL. Learn says you can save up to 30 percent or more. The benefit discounts only the SQL Server Database Engine license component. The base compute remains billed at the base rate. Enabling it needs no downtime.

## Eligibility

The page names Software Assurance-enabled SQL Server licenses. It does not mention subscription licenses.

## Where it applies

- **Azure SQL Database:** only the provisioned compute tier of the vCore-based purchasing model. Not the DTU-based model and not the serverless compute tier.
- **Azure SQL Managed Instance:** supported.
- **SQL Server on Azure VMs:** not covered in the page body.

## Enable it in the portal

- **New SQL Database:** on the **Basics** tab select **Configure database**, then the option to **Save money**.
- **Existing SQL Database:** select **Compute + storage** in the **Settings** menu, then **Save money**. If you do not see it, confirm you use the vCore provisioned tier.
- **New Managed Instance:** on the **Basics** tab select **Configure Managed Instance**, then **Azure Hybrid Benefit**.
- **Existing Managed Instance:** select **Compute + storage** in the **Settings** menu, then **Azure Hybrid Benefit**.

The page also has command line and REST tabs. Their contents were not read, so this guide gives no commands.

## Core conversion

| License | Service tier | Conversion |
| --- | --- | --- |
| SQL Server Enterprise with Software Assurance | General Purpose | 1 on-premises core = 4 vCores |
| SQL Server Enterprise with Software Assurance | Business Critical | 1 on-premises core = 1 vCore |
| SQL Server Standard with Software Assurance | General Purpose | 1 on-premises core = 1 vCore |
| SQL Server Standard with Software Assurance | Business Critical | 4 on-premises cores = 1 vCore |

## Migration allowance

You get a 180-day migration allowance. After that period the license can only be used on Azure, with no on-premises use during or after the allowance.

## Compared with license mobility

The page says Azure Hybrid Benefit offers cost benefits for moving highly virtualized workloads to Azure, which license mobility does not. It targets a PaaS destination, SQL Managed Instance, that is highly compatible with SQL Server. License mobility covers Azure IaaS and AWS EC2.

## At scale

The page points to separate guidance on managing SQL license types at scale. It covers a PowerShell script for one-time or scheduled transitions and an Azure Policy sample for continuous enforcement.

## What the page does not say

- Anything about Windows Server.
- Details for SQL Server on Azure VMs.
- Subscription license eligibility.
- Savings beyond up to 30 percent or more. It points to the Azure Pricing Calculator.

## A rollout outline

This outline is practical advice built on the page.

1. Confirm that your licenses have active Software Assurance.
2. Check that the database uses the vCore provisioned tier.
3. Apply the conversion ratio to plan the number of cores you need.
4. Enable the benefit in the portal and check the bill.
5. For many resources, read the at-scale guidance.

## Typical mistakes

- Enabling it on a serverless or DTU database and not finding the option.
- Using the wrong ratio for the service tier.
- Forgetting that the 180-day allowance ends.
- Expecting this page to cover Windows Server.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Savings claim | Up to 30 percent or more |
| What is discounted | Only the SQL Server Database Engine license component |
| Database tier | vCore provisioned compute only |
| Not eligible | DTU model, serverless compute tier |
| Downtime | None when enabling |
| Migration allowance | 180 days |

## A worked example of the ratios

The ratios let you estimate the vCores your licenses cover. With SQL Server Enterprise and Software Assurance in the General Purpose tier, one on-premises core covers 4 vCores, so 8 licensed cores would cover 32 vCores. In the Business Critical tier the ratio is 1 to 1, so 8 licensed cores would cover 8 vCores. This arithmetic is practical advice built on the page's table. Check your own license terms before you plan.

## What the benefit does not change

The benefit discounts the SQL Server license component only. The base compute stays billed at the base rate. The page therefore does not promise a fixed saving on the whole bill, and it points to the Azure Pricing Calculator for service-level estimates.

## Related

- [Azure Hybrid Benefit](https://www.m365.fm/entity/azure-hybrid-benefit/)
- [Azure SQL Database](https://www.m365.fm/entity/azure-sql-database/)
- [Azure SQL Managed Instance](https://www.m365.fm/entity/azure-sql-managed-instance/)

## Sources

- [Azure Hybrid Benefit for Azure SQL (Microsoft Learn)](https://learn.microsoft.com/azure/azure-sql/azure-hybrid-benefit)
