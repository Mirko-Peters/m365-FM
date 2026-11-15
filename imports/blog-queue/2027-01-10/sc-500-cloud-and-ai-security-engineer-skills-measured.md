---
title: "SC-500 Cloud and AI Security Engineer: What It Replaces and Skills Measured"
summary: "The SC-500 skills outline from the Microsoft study guide: four areas with percentage weights, sub-skills for identity, storage, compute, AI and posture management, and an open note that the guide does not say what the exam replaces."
status: review
publish: false
author: mirko-p
date: 2027-01-10
topics: [sc-500]
keypoints:
  - "The exam name is Implementing End-to-End Security Controls for Cloud and AI Workloads (SC-500). The page metadata lists an update on 2026-07-31."
  - "Four areas: identity, access and governance 20-25%, storage, databases and networking 25-30%, compute 20-25%, security posture 20-25%."
  - "The guide text names no replaced exam and no retirement date, so what SC-500 replaces is not documented there."
  - "A score of 700 or greater is required to pass. No beta status and no practice assessment are mentioned."
  - "AI security is covered in the compute area, including Copilot Studio agents, Entra Agent ID, AI Gateway and Defender for AI Services."
faq:
  - q: "What does SC-500 replace?"
    a: "The study guide does not say. Its text names no other exam and shows no retirement date, so this guide makes no claim about a replacement."
  - q: "What are the skill areas and weights?"
    a: "Manage identity, access and governance 20-25%, secure storage, databases and networking 25-30%, secure compute 20-25%, manage and monitor security posture 20-25%."
  - q: "Who is the exam for?"
    a: "A security engineer who protects systems and data across cloud and hybrid environments, spanning identity, network, application, data and compute, and who helps secure the platforms, data, identities and infrastructure used by AI workloads."
  - q: "What is the pass score?"
    a: "A score of 700 or greater is required to pass."
  - q: "What experience does the guide expect?"
    a: "Practical experience administering Azure and hybrid environments for compute, network and storage, strong familiarity with Microsoft Entra ID, and familiarity with Microsoft 365 administration."
---

SC-500 covers end-to-end security controls for cloud and AI workloads. This guide summarizes the published skills outline from the Microsoft study guide, whose page metadata lists an update on 2026-07-31. It contains no exam questions. The study guide does not say what the exam replaces, so this guide makes no claim about it.

## Replacement and status

The text of the guide does not mention SC-200, SC-300, AZ-500 or any retirement date. The only trace of AZ-500 is the search term in the link to the Exam Readiness Zone videos, which is not a statement about a replacement. The page names no beta status and no practice assessment. For official statements on replaced exams, check the exam page on Microsoft Learn, which this guide did not use.

## Audience and prerequisites

The audience is a security engineer who protects organizational systems and data across cloud and hybrid environments. The role spans identity, network, application, data and compute, and includes securing the platforms, data, identities and infrastructure used by AI workloads. Responsibilities listed:

- Securing access with Microsoft Entra ID and Azure Key Vault.
- Enforcing security and regulatory compliance.
- Securing storage, databases and networking.
- Securing compute.
- Securing AI solutions.
- Managing and monitoring security posture.

Expected experience: administering Azure and hybrid environments, strong familiarity with Microsoft Entra ID, and familiarity with Microsoft 365 administration. The candidate works closely with architects, administrators, engineers, analysts and developers responsible for Azure, Microsoft 365, identity and access, information protection, security operations, DevOps, application development, database platforms and networks.

## Skills at a glance

| Area | Weight |
| --- | --- |
| Manage identity, access and governance | 20-25% |
| Secure storage, databases and networking | 25-30% |
| Secure compute | 20-25% |
| Manage and monitor security posture | 20-25% |

## Identity, access and governance

- **Entra ID:** Privileged Identity Management, Conditional Access, authentication methods including MFA and passwordless, application identity, OAuth consent settings, managed identities.
- **Key Vault:** deployment, settings, access, firewall, keys, secrets and certificates, secret scanning with Defender CSPM, Defender for Key Vault.
- **Governance:** Azure Policy, regulatory compliance in Defender for Cloud, security standards and recommendations, resource locks, role assignments, custom roles, overprivileged access, Azure Backup security, infrastructure as code.

## Storage, databases and networking

- **Storage:** security configuration, firewall rules, Defender for Storage, access policies.
- **Databases:** platform-level security in Azure SQL, auditing for SQL Database and Managed Instance, Defender for Databases.
- **Networking:** NSGs and ASGs, Azure Virtual Network Manager, Virtual WAN, VPN, Microsoft Entra Private Access, private endpoints, Private Link services, Azure Firewall, Network Watcher diagnostics.

## Compute

- **AI:** overexposure of data in SharePoint, Purview Data Security Posture Management for Copilot and AI apps, real-time protection for Copilot Studio agents, Conditional Access and access management for Entra Agent ID, blast radius analysis in Defender XDR, AI Gateway in API Management for Microsoft Foundry, Defender for AI Services, guardrails for agents in Foundry, the Data and AI security dashboard, managing agents in the Microsoft 365 admin center.
- **Servers and VMs:** disk encryption, Azure Bastion, just-in-time access, Azure Arc, Defender for Servers including vulnerability scanning, EDR and agentless scanning, VM security features such as secure boot and vTPM, Azure Machine Configuration.
- **Application platforms:** Defender for Containers, AKS, Container Registry, Container Instances and Container Apps, Functions, Logic Apps, App Service, Web Application Firewall, API Management policies.

## Security posture

- **Defender for Cloud:** Defender CSPM, compliance frameworks, workload protection plans, AWS and GCP connections, Defender Vulnerability Management for Azure VMs, Defender External Attack Surface Management.
- **Microsoft Sentinel:** workspaces, roles, content hub, data connectors, syslog and CEF, Windows Security events with data collection rules, custom log tables, automation rules and playbooks, data retention, Purview Audit queries in Defender XDR.
- **Security Copilot:** workspaces, permissions and roles, plugins, Microsoft and Security Store agents.

## Scoring and format notes

A score of 700 or greater is required to pass. Most questions cover generally available features, and Preview features may appear if commonly used. If the exam is not in your language, you can request an additional 30 minutes. The study resources table links the certification page for training, documentation for Azure, Defender for Cloud, Microsoft Sentinel and other services, and the Exam Readiness Zone and Azure Friday videos.

## A study plan

This plan is my advice, built on the weights.

1. Start with storage, databases and networking, the largest area at 25-30%.
2. Build hands-on labs for Key Vault, private endpoints, Defender for Cloud and Sentinel.
3. Spend time on the AI security items, because the exam lists many AI security items.
4. Review identity items such as PIM and Conditional Access.
5. Re-read the guide close to your exam date to catch changes.

## Typical mistakes (my advice)

- Assuming a replacement relationship that the guide does not state.
- Studying only Defender products and skipping networking.
- Treating the AI section as optional.
- Using material for older security exams.

## Related

- [SC-500](https://www.m365.fm/entity/sc-500/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Study guide for Exam SC-500: Implementing End-to-End Security Controls for Cloud and AI Workloads (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/sc-500)
