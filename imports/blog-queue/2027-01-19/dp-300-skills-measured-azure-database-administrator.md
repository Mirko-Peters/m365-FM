---
title: "DP-300 Skills Measured: Administering Azure SQL Solutions Exam Outline"
summary: "Exam DP-300, Administering Microsoft Azure SQL Solutions, is the exam for the Azure Database Administrator Associate certification. This article lists the five skill areas with their weightings and the topics under each, based on the current study guide, without any exam questions."
status: review
publish: false
author: mirko-p
date: 2027-01-19
topics: [azure-sql-database, azure-sql-managed-instance, sql-server]
keypoints:
  - "The study guide says the skills measured are as of October 27, 2026, which is the outline in force now."
  - "Five areas: plan and implement data platform resources 15-20%, secure environment 20-25%, monitor and optimize 20-25%, automation 15-20%, HA and DR 20-25%."
  - "The outline names Azure SQL Database, Azure Arc-enabled SQL services use cases, Azure SQL Database in Microsoft Fabric use cases, Always On availability groups and failover groups among its topics."
  - "The passing score listed on the study guide is 700."
  - "This article is only an outline of what is measured, not a source of exam questions or a study plan from Microsoft."
faq:
  - q: "Is DP-300 still an active exam?"
    a: "Yes. The certification page for Azure Database Administrator Associate lists it as the exam, and the page shows no retirement notice. Check the page for the current status before you book."
  - q: "How is the exam weighted?"
    a: "Plan and implement data platform resources 15-20%, implement a secure environment 20-25%, monitor, configure and optimize database resources 20-25%, configure and manage automation of tasks 15-20%, plan and configure a high availability and disaster recovery environment 20-25%."
  - q: "What passing score does the study guide list?"
    a: "The study guide lists a passing score of 700."
  - q: "Does the exam cover only Azure SQL Database?"
    a: "No. Beyond Azure SQL Database, the outline mentions use cases for Azure Arc-enabled SQL services and for Azure SQL Database in Microsoft Fabric, SQL Server on Azure Virtual Machines, hybrid deployments, Always On availability groups and failover cluster instances."
  - q: "Does this article contain exam questions?"
    a: "No. It only reports the published skills outline and what Learn lists under each skill. It contains no questions or answers from the exam."
---

DP-300, Administering Microsoft Azure SQL Solutions, is the exam for the Microsoft Certified: Azure Database Administrator Associate certification. The study guide says the skills measured are as of October 27, 2026, and that date has passed, so this is the outline currently in force. It has five areas, with weightings between 15 and 25 percent. This article reports that outline only. It contains no exam questions and no claims about how the exam is scored beyond what Learn publishes.

## Where the information comes from

This article uses two Learn pages: the certification page for Azure Database Administrator Associate and the Study guide for Exam DP-300. The certification page shows a last updated date of April 24, 2026 and a note that the English version of the certification will be updated on October 27, 2026, a date that has now passed. Neither page shows a retirement notice. The study guide lists a passing score of 700.

## Facts from the certification page

- The certification page shows 100 minutes to complete the assessment and 10 languages: English, Chinese (Simplified), Japanese, Korean, French, German, Portuguese (Brazil), Italian, Chinese (Traditional) and Spanish.
- The page says the English version of the certification will be updated on October 27, 2026, the same date as the study guide's skills measured.
- The assessed skills on the page are the same five groups as in the study guide.

Neither page shows a retirement notice. Because exams do retire, confirm on the page that the exam is still offered before you schedule it.

## The five areas and weightings

| Skill area | Weight |
| --- | --- |
| Plan and implement data platform resources | 15-20% |
| Implement a secure environment | 20-25% |
| Monitor, configure, and optimize database resources | 20-25% |
| Configure and manage automation of tasks | 15-20% |
| Plan and configure a high availability and disaster recovery (HA/DR) environment | 20-25% |

## Plan and implement data platform resources (15-20%)

The outline lists three groups:

- **Plan and deploy Azure SQL solutions.** Includes use cases for Azure Arc-enabled SQL services and for Azure SQL Database in Microsoft Fabric, table partitioning, database sharding, hybrid SQL Server solutions and patching for hybrid and IaaS deployments.
- **Configure resources for scale and performance.** Azure SQL Database, Azure SQL Managed Instance and SQL Server on Azure Virtual Machines, plus table partitioning and data compression.
- **Plan and implement a migration strategy.** Evaluating, implementing and troubleshooting offline and online migrations, including to Azure and between Azure SQL services.

## Implement a secure environment (20-25%)

- **Authentication and authorization.** Microsoft Entra authentication, least privilege and permissions with T-SQL.
- **Data at rest and in transit.** Transparent data encryption, Always Encrypted including secure enclaves, firewall rules, private links and service endpoints.
- **Compliance.** Data classification, auditing, change data tracking, dynamic data masking, the ledger feature and row-level security.

## Monitor, configure, and optimize database resources (20-25%)

- **Monitoring.** Baselines, the database watcher and Extended Events.
- **Query performance.** Query Store, blocking, dynamic management views, indexes, execution plans and Intelligent Insights.
- **Optimal performance.** Index and statistics maintenance, integrity checks, automatic tuning, Resource Governor, database-scoped configuration and intelligent query processing.

## Configure and manage automation of tasks (15-20%)

- **SQL Agent jobs.**
- **Automated deployment.** Azure Resource Manager templates and Bicep, PowerShell and the Azure CLI.
- **Database tasks.** Elastic jobs.

## Plan and configure HA/DR (20-25%)

- **Strategy.** Recovery point and recovery time objectives.
- **Backup and restore.** Point-in-time restore, long-term retention, T-SQL backups and cloud storage.
- **Configuration.** Active geo-replication, Always On availability groups, failover groups, failover cluster instances, log shipping, monitoring and troubleshooting.

These lists are condensed from the study guide. For the exact wording of each skill, read the page itself.

## Reading the outline

This section is my advice, not a Microsoft statement.

1. **Use the weights to allocate time.** Three areas carry up to 25 percent each. Most of the exam weight sits in security, monitoring and optimization, and HA/DR.
2. **Match topics to the platform.** Some skills apply to every deployment option, while others, such as failover groups or Always On availability groups, belong to particular ones. Make a table of which skill applies where.
3. **Practice in a lab.** Skills such as Query Store, automatic tuning, elastic jobs and failover groups are easier to remember after you configure them once.
4. **Learn the T-SQL side.** The outline mentions permissions with T-SQL, backup with T-SQL and dynamic management views, so be comfortable writing and reading T-SQL.
5. **Treat the study guide as the authority.** If another source disagrees with the study guide, the study guide wins.
6. **Check the change log.** The study guide's change log compares the versions before and after October 27, 2026. It lists Implement a secure environment as no change overall, with a minor change to the data at rest and data in transit objectives. Read it yourself for the details.
7. **Check for retirement before booking.** Microsoft retires exams from time to time. The certification page is the place to confirm that DP-300 is still offered.

## A study approach by area

This section is my advice, not a Microsoft statement.

- **Plan and implement (15-20%).** Compare the deployment options in a table: what each one supports, how you patch it and how you migrate to it. The outline names hybrid deployments and Azure Arc-enabled SQL Server, so include those in the table.
- **Secure environment (20-25%).** Walk one database through authentication with Microsoft Entra, a least-privilege role set, transparent data encryption, a firewall rule and a private connection. Then add auditing and dynamic data masking and see what each changes.
- **Monitor and optimize (20-25%).** Turn on Query Store on a test database, generate a slow query, read the execution plan and fix it with an index. This one exercise touches several bullets of the outline.
- **Automation (15-20%).** Deploy a database with a Bicep or ARM template, then with PowerShell or the Azure CLI, and create one SQL Agent job and one elastic job.
- **HA and DR (20-25%).** Define a recovery point and recovery time objective for an imaginary system, then pick the backup and replication features that meet it, and test a point-in-time restore.

## What this article does not do

It does not describe exam format or question types beyond what is reported here, and it does not give questions or answers. It does not cover the linked learning resources. For retake rules, pricing and scheduling, use the exam page.

## Related

- [Azure SQL Database](https://www.m365.fm/entity/azure-sql-database/)
- [Azure SQL Managed Instance](https://www.m365.fm/entity/azure-sql-managed-instance/)
- [SQL Server](https://www.m365.fm/entity/sql-server/)

## Sources

- [Microsoft Certified: Azure Database Administrator Associate (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/azure-database-administrator-associate/)
- [Study guide for Exam DP-300: Administering Microsoft Azure SQL Solutions (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/dp-300)
