---
title: "Microsoft Entra ID vs Microsoft Identity Manager: Which Identity Solution to Choose"
summary: "Microsoft Entra ID and Microsoft Identity Manager solve different problems. This guide compares what each does, the MIM support dates, and when Microsoft documents MIM as still the right tool."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [entra-id, entra-connect, entra-cloud-sync]
keypoints:
  - "Entra ID is a cloud identity and access management service. MIM is on-premises software that provisions and synchronizes identities between directories, HR systems and databases."
  - "Microsoft Learn describes MIM as augmenting Entra: it places the right users in Active Directory, and Entra Connect then makes them available in Entra ID."
  - "MIM 2016 extended end of support is January 9, 2029, extended from January 13, 2026."
  - "Learn points to MIM with the Microsoft Graph connector only for scenarios that Entra Connect cloud sync and Entra Connect Sync do not cover."
  - "Several MIM features are deprecated, including BHOLD, Azure MFA Server approvals and hybrid reporting. Plan replacements before new deployments."
faq:
  - q: "Is Microsoft Identity Manager the replacement for Entra ID, or the other way round?"
    a: "Neither. According to Microsoft Learn, Entra ID is a cloud-based identity and access management service for authentication, policy enforcement and protection. MIM builds on Forefront Identity Manager and integrates on-premises platforms such as HR systems, directories and databases. Learn describes MIM as augmenting Entra by preparing users in Active Directory so Entra Connect can bring them into Entra ID."
  - q: "How long is Microsoft Identity Manager 2016 supported?"
    a: "Microsoft Learn states that extended end of support for MIM 2016 was extended from January 13, 2026 to January 9, 2029. The page does not give a mainstream end date. Learn also recommends staying on a fully supported service pack, and lists MIM 2016 SP3 as the latest release."
  - q: "When should I still use MIM instead of Entra provisioning?"
    a: "The Microsoft Learn scenario page says that if you have user and group integration scenarios that are not in scope for Entra Connect cloud sync or Entra Connect Sync, you should consider MIM and its connector for Microsoft Graph. The page does not compare the options further, so test your scenario against the connector documentation first."
  - q: "Do Entra ID P1 or P2 customers get support for MIM?"
    a: "Yes, for specific components. Microsoft Learn says standard support is available for MIM components that enable Entra integration, including the Synchronization Service, the MIM Service and Portal and the connectors, in addition to the support under the fixed lifecycle policy. Customers should use MIM 2016 SP3 or a later hotfix."
---

Entra ID and Microsoft Identity Manager are not two answers to the same question. Microsoft Entra ID is a cloud identity and access management service. Microsoft Identity Manager (MIM) is on-premises software that provisions and synchronizes identities between directories, HR systems and databases. Microsoft Learn describes them as working together: MIM prepares users and groups in Active Directory, and Entra Connect makes them available in Entra ID for Microsoft 365 and cloud apps. The real decision is whether you still need MIM at all.

## What each product does

**Microsoft Entra ID.** Learn calls it the foundational product of Microsoft Entra and a cloud-based identity and access management service that provides authentication, policy enforcement and protection for users, devices, apps and resources. Every Microsoft 365, Azure or Dynamics CRM Online tenant is automatically an Entra tenant. Licenses named on the page include Entra ID Free, P1, P2, Entra Suite, External ID, Workload ID and Entra ID Governance.

**Microsoft Identity Manager 2016.** Learn says MIM builds on Forefront Identity Manager 2010 and its predecessors. It integrates heterogeneous platforms across the datacenter, including on-premises HR systems, directories and databases. The common scenarios are:

- automatic identity and group provisioning based on business policy and workflow
- integration of directory contents with HR systems and other authoritative sources
- synchronization of identities between directories, databases and on-premises applications through common APIs, protocols and Microsoft or partner connectors

## Side by side

| Question | Entra ID | MIM 2016 |
|---|---|---|
| Where it runs | Cloud service | On-premises servers you operate |
| Main job | Authentication, policy enforcement, protection | Provisioning and synchronization across directories and systems of record |

| Support status | Current product | Extended end of support January 9, 2029 |

The table only contrasts what Learn states. It does not claim feature parity, because Learn does not map MIM features to Entra features one to one.

## How they fit together

Learn says MIM augments Entra cloud services by placing the right users in Active Directory for on-premises apps. Entra Connect then makes them available in Entra ID. For Entra ID P1 or P2 customers, Microsoft provides standard support for the MIM components that enable this integration, in addition to the fixed lifecycle policy. The covered components include the Synchronization Service, the Password Change Notification Service, the MIM Service and Portal, add-ins and extensions, and connectors.

The support page frames this as support while customers migrate identity management scenarios from on-premises systems to Entra ID. Read that as direction of travel, not as an end date for your own project.

## Support dates and versions

- **Extended end of support:** extended from January 13, 2026 to January 9, 2029, according to Learn. The scenario page for provisioning MIM to Entra repeats the January 9, 2029 date.
- **Latest release on the Learn page:** MIM 2016 SP3, build 4.7.13.0 (KB5134305), last updated November 2026.
- **SP3 changes:** improved compatibility with SharePoint Subscription Edition, Exchange SE, Outlook 2021, SQL Server 2022 and Azure SQL.

Learn also encourages customers to stay on a fully supported service pack.

## Deprecated MIM features to know about

The Learn page on deprecated features states that deprecated features are not recommended for new deployments and may be removed in a later hotfix or service pack. Examples:

- **BHOLD Suite:** Microsoft does not recommend new deployments. Some modules depend on Silverlight, which reached end of support on October 12, 2021. Learn names Entra access reviews as the replacement for BHOLD attestation and entitlement management for access assignment.
- **Azure MFA Server:** since September 30, 2024, Azure MFA Server deployments no longer service MFA requests for MIM self-service password reset or PAM approvals. Learn points to a custom MFA provider, Windows Hello or smartcard-based authentication in Active Directory.
- **Hybrid reporting:** its cloud endpoints stopped being available as of November 2025. Learn points to Azure Monitor through the Azure Arc agent.
- **Older platforms:** deploying the MIM Service, Portal or Sync on Windows Server 2008 R2 or SQL Server 2008 R2 is deprecated.

## How to decide

1. **List what MIM does today.** Which connectors, which sources, which targets.
2. **Check each scenario against Entra provisioning.** Learn names Entra Connect cloud sync and Entra Connect Sync as the first options. It points to MIM only for scenarios outside their scope.
3. **Look for deprecated pieces** in your current MIM design, such as BHOLD or Azure MFA Server approvals, and plan their replacements.
4. **Set a date** that leaves room before January 9, 2029.
5. **For a new project,** start from the Entra options and add MIM only for a documented gap.

## Common mistakes

- **Treating the two as interchangeable.** They sit at different layers.
- **Planning around mainstream support.** The Learn page read here gives only the extended date.
- **Leaving Azure MFA Server in a MIM design.** Since September 30, 2024 it no longer services MFA requests for MIM SSPR or PAM approvals.

## Limits of the sources

The Microsoft pages read do not compare Entra Connect cloud sync and Entra Connect Sync feature by feature, and the scenario page states no prerequisites or licensing for MIM with the Graph connector. The deprecated features page does not name Entra ID Governance, cloud sync or Entra Connect as migration targets. Verify your own connector coverage with Microsoft before committing to a migration plan.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Entra Cloud Sync](https://www.m365.fm/entity/entra-cloud-sync/)
- [Entra ID Governance](https://www.m365.fm/entity/entra-id-governance/)

## Sources

- [Microsoft Learn: Microsoft Identity Manager 2016](https://learn.microsoft.com/en-us/microsoft-identity-manager/microsoft-identity-manager-2016)
- [Microsoft Learn: Deprecated features and planning for the future](https://learn.microsoft.com/en-us/microsoft-identity-manager/microsoft-identity-manager-2016-deprecated-features)
- [Microsoft Learn: Support update for Microsoft Entra ID P1 or P2 customers using Microsoft Identity Manager](https://learn.microsoft.com/en-us/microsoft-identity-manager/support-update-for-azure-active-directory-premium-customers)
- [Microsoft Learn: Provision Microsoft Identity Manager to Microsoft Entra](https://learn.microsoft.com/en-us/entra/id-governance/scenarios/provision-microsoft-identity-manager-to-entra)
- [Microsoft Learn: What is Microsoft Entra ID?](https://learn.microsoft.com/en-us/entra/fundamentals/whatis)
