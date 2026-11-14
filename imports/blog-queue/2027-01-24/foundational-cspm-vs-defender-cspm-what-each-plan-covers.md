---
title: "Foundational CSPM vs Defender CSPM in Microsoft Defender for Cloud: What Each Plan Covers"
summary: "Foundational CSPM is free and Defender CSPM is paid. A side-by-side of the features in each plan from Microsoft Learn: inventory, secure score and recommendations in both, attack path analysis, agentless scanning and DSPM only in Defender CSPM, plus clouds, billing and DevOps."
status: review
publish: false
author: mirko-p
date: 2027-01-24
topics: [microsoft-defender-for-cloud, cloud-security-posture-management]
keypoints:
  - "Defender for Cloud has two CSPM plans: Foundational CSPM is free, and Defender CSPM is paid and adds advanced posture features."
  - "Both plans include asset inventory, data exporting, Azure Workbooks reporting, the Microsoft Cloud Security Benchmark, secure score, recommendations, remediation tools and workflow automation."
  - "Only Defender CSPM adds attack path analysis, risk prioritization, security explorer, agentless VM scanning, AI security posture, DSPM, internet exposure analysis and governance rules."
  - "Defender CSPM billing is based on specific resources, for example VMs, storage accounts with blob containers or file shares and SQL servers, and serverless billing became effective in 2026."
  - "Support covers Azure, AWS and GCP, hybrid resources through Azure Arc, and DevOps platforms. Advanced DevOps posture features need the paid plan."
faq:
  - q: "What is the difference between Foundational CSPM and Defender CSPM?"
    a: "Microsoft Learn says Foundational CSPM is free. Defender CSPM is paid and provides extra capabilities beyond it, including advanced tools for cloud visibility and compliance monitoring, such as AI security posture, attack path analysis and risk prioritization. Both give recommendations and secure score. The Foundational plan gives MCSB-based recommendations and a secure score based on some of them."
  - q: "Which features are only in Defender CSPM?"
    a: "For Azure the page lists: agentless code-to-cloud container vulnerability assessment, agentless discovery for Kubernetes, agentless VM secrets scanning and vulnerability scanning, AI security posture management, API security posture management, attack path analysis, critical assets protection, custom recommendations, data security posture management with sensitive data scanning, discovery and posture for serverless containers, governance rules, internet exposure analysis, external attack surface management, regulatory compliance assessments, risk hunting with security explorer, risk prioritization and serverless protection. The AKS security dashboard is listed as preview."
  - q: "How is Defender CSPM billed?"
    a: "Billing is based on specific resources enabled in your subscriptions or connectors. For Azure, billable resources include virtual machines and scale sets, storage accounts with blob containers or file shares, SQL servers, PostgreSQL and MySQL flexible servers and Synapse workspaces. Serverless protection for Function Apps and Web Apps and serverless containers have separate enablement and billing dates in 2026. See the pricing page and cost calculator."
  - q: "Does CSPM work for AWS, GCP and on-premises?"
    a: "Yes. Defender CSPM supports Azure, AWS and GCP environments, and on-premises resources connected through Azure Arc, plus GitHub, Azure DevOps and GitLab. The feature lists differ slightly per cloud, for example AWS CloudTrail ingestion is listed as preview for AWS, and GCP sensitive data discovery supports only Cloud Storage."
  - q: "Which plan do I need for DevOps security posture?"
    a: "Learn says advanced DevOps security posture features, such as pull request annotations, code-to-cloud mapping, attack path analysis and security explorer, require the paid Defender CSPM plan. The free plan provides basic Azure DevOps recommendations."
---

Microsoft Defender for Cloud offers cloud security posture management (CSPM) in two plans, and the choice decides which features you can use and what you pay. This article follows the Microsoft Learn page on CSPM and puts the feature tables into one comparison. Check the page again before a purchase decision, since it lists billing dates and preview items that change.

## What CSPM does

CSPM provides continuous visibility into the security state of cloud assets and workloads, with actionable guidance, across Azure, AWS and GCP. Defender for Cloud assesses your infrastructure against security standards for Azure subscriptions, AWS accounts and GCP projects and issues recommendations to reduce misconfigurations and risk. With Foundational CSPM on, the Microsoft Cloud Security Benchmark (MCSB) standard provides recommendations, and a secure score based on some of them helps you monitor compliance. A higher score means lower identified risk.

## The two plans

- **Foundational CSPM** is free.
- **Defender CSPM** is paid. It provides extra capabilities beyond Foundational CSPM, such as AI security posture, attack path analysis and risk prioritization.

## Feature comparison for Azure

| Feature | Foundational | Defender CSPM |
| --- | --- | --- |
| Asset inventory | Yes | Yes |
| Data exporting | Yes | Yes |
| Data visualization with Azure Workbooks | Yes | Yes |
| Microsoft Cloud Security Benchmark | Yes | Yes |
| Secure score | Yes | Yes |
| Security recommendations | Yes | Yes |
| Tools for remediation | Yes | Yes |
| Workflow automation | Yes | Yes |
| Agentless VM vulnerability scanning | No | Yes |
| Agentless VM secrets scanning | No | Yes |
| Agentless discovery for Kubernetes | No | Yes |
| Agentless code-to-cloud container vulnerability assessment | No | Yes |
| AI security posture management | No | Yes |
| API security posture management | No | Yes |
| Attack path analysis | No | Yes |
| AKS security dashboard (preview) | No | Yes |
| Critical assets protection | No | Yes |
| Custom recommendations | No | Yes |
| Data security posture management and sensitive data scanning | No | Yes |
| Discovery and posture for serverless container workloads | No | Yes |
| Governance to drive remediation at scale | No | Yes |
| Internet exposure analysis | No | Yes |
| External attack surface management | No | Yes |
| Regulatory compliance assessments | No | Yes |
| Risk hunting with security explorer | No | Yes |
| Risk prioritization | No | Yes |
| Serverless protection | No | Yes |

The AWS and GCP tables are close to this list. Differences noted on the page: AWS adds AWS CloudTrail ingestion (preview) and has no API security posture or AKS dashboard row, and GCP lists sensitive data discovery with the footnote that it only supports Cloud Storage.

## Where the plans apply

Defender CSPM supports commercial clouds in all Azure commercial regions, Azure Government and Azure Government Secret, multicloud with Azure, AWS and GCP, hybrid with on-premises resources connected through Azure Arc, and DevOps through GitHub, Azure DevOps and GitLab. Docker Hub and JFrog Artifactory connectors support selected capabilities of both plans. For Arc-enabled resources, Foundational CSPM covers asset inventory, recommendations, secure score, data export, workbooks, remediation tools and workflow automation. Container registry vulnerability assessment for Arc-connected clusters needs Defender CSPM. The page points to the support matrix for regional details.

For Azure Database for PostgreSQL flexible server, Learn says Defender CSPM assesses server-level and database-level configuration against best practices, covering network security, auditing and operational resilience.

## Billing

Defender CSPM billing is based on the resources enabled. Defender CSPM protects all Azure workloads, but billing applies only to listed resource types:

| Service | Azure billable resources | Exclusions |
| --- | --- | --- |
| Compute | Virtual machines, scale sets, classic VMs | Deallocated VMs, Databricks VMs |
| Storage | Storage accounts | Accounts without blob containers or file shares |
| Databases | SQL servers, PostgreSQL and MySQL flexible servers, Synapse workspaces | None listed |
| Serverless protection | Function Apps, Web Apps | None listed |
| Serverless containers | Azure Container Apps, Azure Container Instances | None listed |

Serverless protection needs to be enabled in Defender CSPM, and billing became effective on April 1, 2026. The serverless containers component needs enabling too, with Registry access for full coverage, and billing became effective on July 1, 2026. For AWS, billable resources are EC2 instances, S3 buckets, RDS instances, Lambda functions (one billable resource represents eight functions) and ECS on Fargate workloads (one billable resource represents two). For GCP they are compute instances and instance groups, storage buckets and Cloud SQL instances, with listed exclusions. Use the pricing page and cost calculator for estimates.

## DevOps posture

Advanced DevOps security posture features, pull request annotations, code-to-cloud mapping, attack path analysis and security explorer, need the paid plan. The free plan provides basic Azure DevOps recommendations.

## Which plan? (my advice)

This is my suggestion, not Microsoft guidance:

1. Start with Foundational CSPM everywhere. It is free and gives you the inventory, recommendations and secure score you need to know your baseline.
2. Turn on Defender CSPM first on the subscriptions that hold production data or internet-facing workloads, where attack paths and internet exposure matter most.
3. Count billable resources per subscription before you enable, and exclude what the page lists as not billed, for example deallocated VMs.
4. Treat serverless protection and serverless containers as separate decisions, since each has its own component and billing.
5. Review the plan table again once a year, because the feature list and billing notes change.

## Related

- [Microsoft Defender for Cloud](https://www.m365.fm/entity/microsoft-defender-for-cloud/)
- [Cloud Security Posture Management (CSPM)](https://www.m365.fm/entity/cloud-security-posture-management/)

## Sources

- [What is Cloud Security Posture Management (CSPM) (Microsoft Learn)](https://learn.microsoft.com/azure/defender-for-cloud/concept-cloud-security-posture-management)
