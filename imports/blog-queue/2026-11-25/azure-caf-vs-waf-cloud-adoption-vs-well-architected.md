---
title: "Azure CAF vs WAF: Cloud Adoption Framework and Well-Architected Framework Explained"
summary: "How the Azure Cloud Adoption Framework (CAF) and the Azure Well-Architected Framework (WAF) differ, what each covers, who uses them, and how they fit together, based on Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-25
topics: [cloud-adoption-framework, azure-well-architected-framework, azure-landing-zone]
keypoints:
  - "The Cloud Adoption Framework (CAF) is a structured roadmap that helps organizations adopt Azure and integrate it into their existing IT environments."
  - "The Well-Architected Framework (WAF) is a design framework that improves the quality of a single workload across five pillars."
  - "CAF has seven phases in Microsoft's current overview: Strategy, Plan, Ready, Adopt, Govern, Secure and Manage. The first four are sequential, the last three cover operations."
  - "WAF pillars are Reliability, Security, Cost Optimization, Operational Excellence and Performance Efficiency."
  - "Microsoft points readers who want centralized controls for a portfolio of workloads to CAF rather than WAF."
faq:
  - q: "What is the difference between CAF and WAF in Azure?"
    a: "According to Microsoft Learn, the Cloud Adoption Framework is a structured roadmap that helps organizations adopt Azure and integrate it into their existing IT environments. The Azure Well-Architected Framework is a design framework for improving the quality of a workload. In short, CAF covers the cloud journey of the organization and WAF covers the design quality of a workload."
  - q: "What are the CAF phases?"
    a: "The Microsoft Learn overview lists seven core methodologies, also called phases: Strategy, Plan, Ready, Adopt, Govern, Secure and Manage. Strategy, Plan, Ready and Adopt are sequential, and Govern, Secure and Manage are the operational phases. Ready covers Azure purchasing, tenant setup, the platform landing zone and application landing zones. The page does not include an Organize phase."
  - q: "What are the five pillars of the Well-Architected Framework?"
    a: "Microsoft Learn names Reliability, Security, Cost Optimization, Operational Excellence and Performance Efficiency. It says design decisions must be balanced across all pillars, given the business requirements."
  - q: "Which framework should I use first?"
    a: "The pages do not prescribe an order between the two. The CAF overview says the framework integrates with the Well-Architected Framework, and the WAF overview points readers who want centralized controls for a portfolio of workloads to CAF. Choose by the decision in front of you: the whole Azure environment points to CAF, a single workload points to WAF."
  - q: "Is the Well-Architected Review free?"
    a: "The Microsoft Learn overview says the Microsoft Azure Well-Architected Review is offered at no charge. It is a collection of questionnaires tied to the pillar checklists, and you can track your score through repeated runs."
---

The Cloud Adoption Framework (CAF) is about getting an organization ready for Azure and keeping it governed. The Well-Architected Framework (WAF) is about designing and improving individual workloads once they run on Azure. CAF answers decisions such as how to build a landing zone. WAF answers whether a given workload is reliable, secure, cost-efficient, operable and fast enough.

Both come from Microsoft Learn and are meant to be used together. The sections below describe each one as Microsoft documents it and then compare them.

## What CAF is

Microsoft describes the Cloud Adoption Framework as a structured roadmap that helps organizations successfully adopt Azure and integrate it into their existing IT environments. It provides best practices and guidance to help organizations make the right decisions for their business throughout the cloud journey. The overview also says the framework integrates with the Well-Architected Framework and the Azure Architecture Center.

### The seven phases

The current overview organizes Azure guidance into seven core methodologies, which the page also labels phases. The foundational ones, Strategy, Plan, Ready and Adopt, are sequential. They help you define business outcomes, prepare your organization and environment, and deploy workloads to Azure. These phases are where most organizations start and are revisited as adoption matures. Once workloads run in Azure, the operational phases Govern, Secure and Manage define different aspects of cloud operations.

| Phase | Outcome | How |
|---|---|---|
| 1. Strategy | Cloud adoption aligned to business goals | Map business drivers to cloud outcomes |
| 2. Plan | A plan for cloud adoption | Operating model, cloud skills, migration plan and cloud cost estimation |
| 3. Ready | An Azure environment ready for workloads | Azure purchasing, tenant setup, platform landing zone and application landing zones |
| 4. Adopt | Workloads in Azure meeting business needs | Migrate, modernize or build cloud-native workloads |
| 5. Govern | Control workloads | Assess cloud risks and mitigate them with Azure and Microsoft tools |
| 6. Secure | Protect workloads | Apply security controls with Azure and Microsoft tools |
| 7. Manage | Optimize workloads | Administer workloads with Azure and Microsoft tools |

The page lists these seven phases only, with no Organize phase, so use these names when you refer to the current version.

### Scenarios

Besides the phases, the overview lists scenario guidance: Data, AI adoption, AI agents, Azure Virtual Desktop, Azure VMware Solution, Hybrid and multicloud, Oracle on Azure and SAP on Azure.

### Who it is for

Microsoft states that CAF serves organizations of all industries and sizes pursuing Azure adoption. It adapts to your cloud maturity level and is designed for anyone responsible for technology adoption, whether that spans business strategy, technology governance, cloud integration or day-to-day operations. The page gives two examples: startups build cloud-native applications using best practices, and enterprises establish a governance foundation to control workloads at scale.

## What WAF is

Microsoft describes the Azure Well-Architected Framework as a design framework that can improve the quality of a workload by helping it be resilient, available and recoverable, be as secure as needed, deliver a sufficient return on investment, support responsible development and operations, and accomplish its purpose within acceptable timeframes.

### The five pillars

1. Reliability
2. Security
3. Cost Optimization
4. Operational Excellence
5. Performance Efficiency

Each pillar has its own guide with design principles, checklists, key design strategies, tradeoffs and risks, design patterns and a maturity model. Microsoft stresses that decisions must be balanced across all pillars, since improving one can cost another.

### Audience

The WAF overview says the framework applies to teams that are responsible for improving workloads and addressing cross-cutting concerns. Architects, developers, operators and business stakeholders can all benefit if they have the authority to make decisions within the scope of a workload.

### Layers and assessment

The framework is structured as pillars, workload guidance, service guides and design guides. The workload layer shows how the pillars apply to a specific class of workload, and Microsoft suggests reading the one that most closely matches your requirements. Service guides support decisions about single Azure components.

The Azure Well-Architected Review is offered at no charge. It is a set of questionnaires tied to the pillar checklists that evaluate design choices. You can run it repeatedly to track your score.

## CAF and WAF side by side

| | Cloud Adoption Framework | Well-Architected Framework |
|---|---|---|
| Main purpose | Roadmap for adopting and governing Azure | Design framework for workload quality |
| Scope | The cloud journey of the organization, including landing zones and operations | A single workload |
| Structure | Seven phases from Strategy to Manage | Five pillars plus workload, service and design guides |
| Typical readers | Anyone responsible for technology adoption, from business strategy to operations | Workload teams: architects, developers, operators, business stakeholders |
| Output | Outcomes per phase, for example an Azure environment ready for workloads after Ready | Better design choices and a Review score |

## How they fit together

Microsoft's WAF overview contains a direct pointer. If you want guidance for improving a portfolio of workloads through centralized controls, that content might not fully apply, and Microsoft recommends the Cloud Adoption Framework. In other words, centralized controls across many workloads are CAF territory, while the quality of one workload is WAF territory.

The CAF overview adds the other direction: it says the framework integrates with the Well-Architected Framework and the Azure Architecture Center. Neither page spells out how the two are meant to be sequenced. A reasonable reading is that CAF prepares the environment and governs it, and WAF is used on the workloads that run inside it. That reading is an interpretation, not a statement from the pages.

## Common mix-ups

- **Treating WAF as a migration plan.** WAF does not describe how to move to Azure. Its pillars help you judge the design of a workload, and the Review scores that design.
- **Treating CAF as an architecture checklist.** CAF is a roadmap through strategy, planning, readiness, adoption and operations, not a per-application design review.
- **Applying only one pillar.** Microsoft says decisions must be balanced across all five pillars.

## A practical way to choose

- **You are planning your first Azure environment.** Start with CAF: Strategy, Plan and Ready, which covers the landing zones.
- **You need rules across many subscriptions or teams.** Use the Govern, Secure and Manage phases of CAF.
- **You are designing or reviewing one application.** Use WAF: read the pillar checklists and run the Well-Architected Review.
- **You are unsure.** Ask whether the decision affects the whole Azure environment or a single workload.

## Related

- [Microsoft Cloud Adoption Framework](https://www.m365.fm/entity/cloud-adoption-framework/)
- [Azure Well-Architected Framework](https://www.m365.fm/entity/azure-well-architected-framework/)
- [Azure landing zone](https://www.m365.fm/entity/azure-landing-zone/)
- [Microsoft Azure](https://www.m365.fm/entity/azure/)

## Sources

- [Microsoft Learn: What is the Cloud Adoption Framework?](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/overview)
- [Microsoft Learn: What is the Azure Well-Architected Framework?](https://learn.microsoft.com/en-us/azure/well-architected/what-is-well-architected-framework)
