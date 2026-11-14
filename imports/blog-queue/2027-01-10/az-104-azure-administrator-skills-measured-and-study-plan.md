---
title: "AZ-104 Azure Administrator: Skills Measured and Study Plan"
summary: "The AZ-104 skills outline with the five skill areas and their percentage weights, the sub-skills listed in the Microsoft study guide, scoring and language notes, practice assessment and a study plan built on the outline. No exam questions."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [az-104]
keypoints:
  - "The study guide lists skills as of October 26, 2023. The page footer shows Last updated on 2026-10-30."
  - "Five areas: identities and governance 20-25%, storage 15-20%, compute 20-25%, virtual networking 15-20%, monitoring and maintenance 10-15%."
  - "Compute includes ARM templates and Bicep, virtual machines, containers and App Service. Networking includes peering, NSGs, Bastion, private endpoints and load balancing."
  - "A score of 700 or greater is required to pass. Most questions cover generally available features, and Preview features may appear."
  - "Microsoft recommends the new Practice Assessment on AI Skills Navigator. The legacy assessment is no longer updated."
faq:
  - q: "What are the AZ-104 skill areas and weights?"
    a: "Manage Azure identities and governance 20-25%, implement and manage storage 15-20%, deploy and manage Azure compute resources 20-25%, implement and manage virtual networking 15-20%, monitor and maintain Azure resources 10-15%."
  - q: "What score do I need?"
    a: "The study guide says a score of 700 or greater is required to pass."
  - q: "Which version of the skills does the guide show?"
    a: "Skills measured as of October 26, 2023. The page footer shows Last updated on 2026-10-30, and earlier skills are listed separately on the page."
  - q: "Is there a practice assessment?"
    a: "Yes. The guide recommends the new Practice Assessment on AI Skills Navigator at aka.ms/AZ104-PA. The legacy practice assessment is no longer updated."
  - q: "What if the exam is not in my language?"
    a: "English is updated first and localized versions follow about eight weeks later. If the exam is not available in your preferred language, you can request an additional 30 minutes."
---

AZ-104 tests how well you can implement, manage and monitor an Azure environment. This guide summarizes the skills outline from the Microsoft study guide. It contains no exam questions and no claims about the content of the exam beyond the published outline.

## About the guide

- The skills are measured as of October 26, 2023. The page footer shows Last updated on 2026-10-30.
- The audience profile is a candidate with subject matter expertise in implementing, managing and monitoring an Azure environment, including virtual networks, storage, compute, identity, security and governance.
- A score of 700 or greater is required to pass.
- Most questions cover generally available features. Preview features may appear if they are commonly used.

## Skills at a glance

| Area | Weight |
| --- | --- |
| Manage Azure identities and governance | 20-25% |
| Implement and manage storage | 15-20% |
| Deploy and manage Azure compute resources | 20-25% |
| Implement and manage virtual networking | 15-20% |
| Monitor and maintain Azure resources | 10-15% |

## Identities and governance (20-25%)

- **Microsoft Entra users and groups:** create users and groups, manage properties and licenses, manage external users, configure self-service password reset.
- **Access to Azure resources:** manage built-in roles, assign roles at different scopes, interpret access assignments.
- **Subscriptions and governance:** Azure Policy, resource locks, tags, resource groups, subscriptions, costs with alerts, budgets and Advisor, management groups.

## Storage (15-20%)

- **Access:** storage firewalls and virtual networks, SAS tokens, stored access policies, access keys, identity-based access for Azure Files.
- **Storage accounts:** creation, redundancy, object replication, encryption, Azure Storage Explorer and AzCopy.
- **Files and Blob:** file shares, containers, tiers, snapshots and soft delete, lifecycle management, versioning.

## Compute (20-25%)

- **ARM templates and Bicep:** interpret, modify and deploy, export a deployment, convert a template to Bicep.
- **Virtual machines:** create, Azure Disk Encryption, move, sizes, disks, availability zones and sets, Virtual Machine Scale Sets.
- **Containers:** container registry, Container Instances, Container Apps, sizing and scaling.
- **App Service:** plans, scaling, certificates and TLS, custom DNS names, backup, networking, deployment slots.

## Virtual networking (15-20%)

- **Virtual networks:** networks and subnets, peering, public IP addresses, user-defined routes, troubleshooting connectivity.
- **Secure access:** network security groups and application security groups, effective rules, Azure Bastion, service endpoints, private endpoints.
- **Name resolution and load balancing:** Azure DNS, internal and public load balancers, troubleshooting.

## Monitoring and maintenance (10-15%)

- **Monitor:** Azure Monitor metrics and logs, queries, alert rules, action groups and processing rules, Insights, Network Watcher and Connection Monitor.
- **Backup and recovery:** Recovery Services vault, Backup vault, backup policies, backup and restore, Site Recovery, failover to a secondary region, reports and alerts.

## Changes from the prior version

The change log marks most areas No change. The page notes the rename from Azure AD users and groups to Microsoft Entra users and groups.

## Resources the guide links

Self-paced learning paths, instructor-led courses, Azure documentation, Microsoft Q&A and community support, and videos such as the Exam Prep video. The guide recommends the new Practice Assessment on AI Skills Navigator. The legacy practice assessment is no longer updated.

## Languages

English is updated first. Localized versions follow about eight weeks later, though the schedule is not always met. If the exam is not available in your language, you can request an additional 30 minutes.

## A study plan

This plan is practical advice built on the weights, not an official recommendation.

1. Start with the two 20-25% areas, identities and compute, since they carry the most weight.
2. Practice in a test subscription: create networks, a storage account and a virtual machine.
3. Work through storage and networking next, each at 15-20%.
4. Cover monitoring and backup last. It has the lowest weight but is hands-on.
5. Take the practice assessment and revisit weak areas.

## Typical mistakes

- Studying from material for the skills measured before October 26, 2023.
- Skipping hands-on practice for ARM templates and Bicep.
- Ignoring monitoring because of its lower weight.
- Not checking the page for updates close to the exam date.

## Related

- [AZ-104](https://www.m365.fm/entity/az-104/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure Virtual Network](https://www.m365.fm/entity/azure-virtual-network/)
- [Azure Bastion](https://www.m365.fm/entity/azure-bastion/)

## Sources

- [Study guide for Exam AZ-104 (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-104)
