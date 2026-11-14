---
title: "AZ-400 DevOps Engineer Expert: Skills Measured and Study Plan"
summary: "The AZ-400 Designing and Implementing Microsoft DevOps Solutions skills outline with five domain weights, subtopics for each, the study resources named on the guide, and a study plan built on the weights."
status: review
publish: false
author: mirko-p
date: 2027-01-09
topics: [az-400]
keypoints:
  - "The study guide lists five domains. Design and implement build and release pipelines is the largest at 50-55%."
  - "The other domains are processes and communications (10-15%), source control (10-15%), security and compliance (10-15%) and instrumentation (5-10%)."
  - "The skills are measured as of July 27, 2026. The audience needs experience with both GitHub and Azure DevOps solutions."
  - "The page recommends a Practice Assessment on AI Skills Navigator and calls the Learn practice assessment legacy and no longer updated."
  - "Use the outline to plan study. This guide contains no exam questions."
faq:
  - q: "What does AZ-400 cover?"
    a: "The Microsoft study guide lists five domains: processes and communications, source control strategy, build and release pipelines, security and compliance planning, and instrumentation strategy."
  - q: "How is the exam weighted?"
    a: "Processes and communications 10-15%, source control 10-15%, build and release pipelines 50-55%, security and compliance 10-15% and instrumentation 5-10%."
  - q: "Do I need both GitHub and Azure DevOps?"
    a: "The audience profile expects experience implementing both GitHub and Azure DevOps solutions, and strong skills in administering and developing in Azure."
  - q: "Which practice assessment should I use?"
    a: "The page recommends the Practice Assessment on AI Skills Navigator. The legacy assessment on Microsoft Learn is no longer updated."
  - q: "Is there a retirement date?"
    a: "The study guide page does not show a retirement date. It shows skills measured as of July 27, 2026 and a last update of 2026-10-30."
---

AZ-400 is the DevOps engineer exam, and more than half of it is about pipelines. The study guide lists five domains, with build and release pipelines at 50-55%. This guide summarizes the outline as published on the Microsoft Learn study guide, with skills measured as of July 27, 2026, and adds a study order. It contains no exam questions.

## Audience

A DevOps engineer is a developer or infrastructure administrator who works with people, processes and products to enable continuous delivery of value. The role delivers continuous security, integration, testing, delivery, deployment, monitoring and feedback. Candidates work on cross-functional teams, need experience administering and developing in Azure, and need experience implementing both GitHub and Azure DevOps solutions. The page shows no retirement date.

## Domain 1: design and implement processes and communications (10-15%)

- **Traceability and flow of work:** a flow of work structure including GitHub Flow, feedback cycles with notifications and GitHub Issues, work tracking with GitHub Projects and Azure Boards, and source, bug and quality traceability.
- **Metrics and queries:** dashboards with cycle time, time to recovery and lead time, and metrics for planning, development, testing, security, delivery and operations.
- **Collaboration:** wikis and diagrams with Markdown and Mermaid, release and API documentation, documentation from Git history, webhooks, and integrations between Azure Boards and GitHub and between GitHub or Azure DevOps and Teams.

## Domain 2: design and implement a source control strategy (10-15%)

- **Branching:** trunk-based, feature branch and release branch strategies, pull request workflows, and merge restrictions with branch policies and protection rules.
- **Repositories:** large files with Git LFS and git-fat, scaling with Scalar and cross-repository sharing, permissions, tags, recovering data with Git commands and removing data from source control.

## Domain 3: design and implement build and release pipelines (50-55%)

- **Package management:** GitHub Packages and Azure Artifacts, feeds and views, versioning with SemVer and CalVer, and artifact versioning.
- **Testing strategy:** quality and release gates, unit, integration and load tests, test tasks and agents, and code coverage.
- **Pipelines:** GitHub Actions or Azure Pipelines, runner and agent infrastructure, triggers, YAML, job order and parallelism, complex scenarios, reusable elements such as templates and variable groups, and checks and approvals with environments.
- **Deployments:** blue-green, canary, ring, progressive exposure, feature flags and A/B testing, ordering of dependency deployments, minimizing downtime with load balancing, rolling deployments and deployment slots, hotfix paths, resiliency, Azure App Configuration feature flags, containers, binaries, scripts and database tasks.
- **Infrastructure as code:** configuration management, IaC strategy, desired state with Azure Automation State Configuration, ARM, Bicep and Azure Machine Configuration, and Azure Deployment Environments.
- **Maintain pipelines:** health, cost, time and reliability optimization, concurrency, retention, and migrating classic pipelines to YAML.

## Domain 4: develop a security and compliance plan (10-15%)

- **Authentication and authorization:** service principals and managed identities, GitHub authentication including GitHub Apps and GITHUB_TOKEN, Azure DevOps service connections, permissions and roles, access levels and projects and teams.
- **Sensitive information:** Azure Key Vault, secretless authentication such as workload identity federation and OpenID Connect, secure files and leak prevention.
- **Scanning:** dependency, code, secret and license scanning, Defender for Cloud DevOps Security, GitHub Advanced Security, container scanning with CodeQL, and Dependabot alerts.

## Domain 5: implement an instrumentation strategy (5-10%)

- **Monitoring:** Azure Monitor and Logs, telemetry with Application Insights, VM Insights, Container Insights, storage and networks, GitHub insights, and alerts for GitHub Actions and Azure Pipelines.
- **Metrics:** infrastructure performance indicators, usage and application performance, distributed tracing and basic KQL queries.

## Resources named on the page

Self-paced training and instructor-led courses, the DevOps resource center and documentation for Azure DevOps, Boards, Key Vault, Monitor, Pipelines and Repos, Microsoft Q&A and community hubs, the Exam Prep video and Learn shows, and the recommended practice assessment on AI Skills Navigator with the legacy assessment no longer updated.

## What the page does not say

Exam length, question count, price, prerequisites and weights below the domain level.

## A study plan

This plan is practical advice built on the weights.

1. **Weeks 1-5, domain 3.** Build a YAML pipeline in both GitHub Actions and Azure Pipelines. Add tests, approvals, a deployment strategy and an IaC step.
2. **Week 6, domain 4.** Set up Key Vault, workload identity federation and GitHub Advanced Security scanning.
3. **Week 7, domains 1 and 2.** Practice branching policies, wikis, dashboards and Git recovery commands.
4. **Week 8, domain 5.** Connect Application Insights and write basic KQL.
5. **Final days.** Take the practice assessment and review weak areas.

## Typical mistakes

- Learning only Azure DevOps or only GitHub.
- Skipping IaC and deployment strategy topics.
- Treating the small instrumentation domain as optional.
- Using the legacy practice assessment as the main check.

## Related

- [AZ-400](https://www.m365.fm/entity/az-400/)
- [Azure App Service](https://www.m365.fm/entity/azure-app-service/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)

## Sources

- [Study guide for Exam AZ-400: Designing and Implementing Microsoft DevOps Solutions (Microsoft Learn)](https://learn.microsoft.com/credentials/certifications/resources/study-guides/az-400)
