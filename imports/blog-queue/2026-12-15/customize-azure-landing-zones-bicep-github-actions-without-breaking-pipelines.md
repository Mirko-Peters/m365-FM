---
title: "Customize Azure Landing Zones With Bicep and GitHub Actions Without Breaking Pipelines"
summary: "How to customize an Azure landing zone deployed through the Bicep accelerator and GitHub Actions: use supported customization points, keep OIDC and scopes correct, run what-if first, and stay current with upstream."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [azure-landing-zone, bicep, github-actions, azure-policy]
keypoints:
  - "Microsoft recommends the IaC accelerator with Azure Verified Modules, and the bootstrap creates the GitHub repositories, environments and OIDC identities for you."
  - "Customize in Phase 3 (Run) by editing the generated IaC, not by changing the pipeline wiring the bootstrap created."
  - "Authenticate with OIDC. The federated credential must match the branch or environment, and the workflow needs id-token: write."
  - "Run what-if before apply. It has limits such as nested template expansion caps and noisy results for unevaluable expressions."
  - "Decide on native policy management or EPAC early. Learn warns you cannot easily switch policy governance methods later."
faq:
  - q: "Which approach does Microsoft recommend for platform landing zones?"
    a: "According to the Learn implementation options page, the IaC approach using the platform landing zone accelerator with Azure Verified Modules for Terraform or Bicep is recommended. A portal-based option exists but offers less flexibility, and Learn recommends moving to IaC when possible."
  - q: "What does the accelerator bootstrap create in GitHub?"
    a: "The accelerator documentation lists repositories for the module and action templates, a starter module, a branch policy, CI and CD actions, Plan and Apply environments, action variables, an approval team and a customized OIDC token subject, plus Azure user-assigned managed identities with federated credentials."
  - q: "Why does azure/login fail in my workflow?"
    a: "The Bicep deployment page requires an identity with a federated credential matching the branch or environment that runs the workflow, and the id-token: write permission. Mismatched subjects and missing permissions are typical causes, though the page itself does not list errors."
  - q: "Can I customize policies without losing upstream updates?"
    a: "Learn says unattended drift becomes technical debt and tells you to review landing zone changes regularly. The pages I read give no merge or version-pinning procedure, so define your own review cycle and test with what-if."
  - q: "Is ALZ-Bicep still the current Bicep path?"
    a: "The pages I read point to the accelerator and Azure Verified Modules for Bicep and do not mention the older ALZ-Bicep module set or retirement dates. One page that likely covers the status was blocked for me, so confirm it on the Azure Landing Zones site."
---

The reliable way to customize a landing zone is to change the infrastructure code the accelerator generated, test every change with what-if, and leave the bootstrap-created pipeline plumbing alone unless you understand the identity and approval design it set up. This article follows Microsoft's published guidance. It has limits: the pages I read do not describe a merge procedure for upstream updates, and they do not list GitHub Actions errors.

## Know what you deployed

A landing zone has a platform component (management groups, governance, shared services) and workload landing zones. Microsoft describes two ways to implement the platform: accelerators and a custom build. For most organizations, accelerators are the fastest path to the recommended practices.

The Azure Landing Zones IaC accelerator uses Azure Verified Modules for Terraform and Bicep. With Bicep, Terraform bootstraps the environment only, and Bicep deploys and updates the platform landing zone. GitHub and Azure DevOps are supported in their hosted forms. The process has four phases: planning, prerequisites, bootstrap and run. Customization happens in the run phase.

## What the bootstrap sets up

For GitHub, the accelerator documentation lists:

- Repositories for the module and the action templates
- A starter module with variables
- A branch policy and CI and CD actions
- Environments for Plan and Apply, with an approval team
- Action variables for the backend and for Plan and Apply
- A customized OIDC token subject for governed actions
- In Azure, resource groups with user-assigned managed identities for Plan and Apply using federated credentials, with permissions on state storage and management groups

These pieces fit together. Changing a branch name, an environment name or the identity permissions on your own can break authentication without touching your Bicep code.

## Customize the code, not the plumbing

Learn's accelerator pages list customization options. For Terraform they run to 11 scenarios and 17 options. For Bicep the navigation lists two: Sovereign Landing Zone controls and turning off Defender plans. If a change you need is not a listed option, you are customizing code, so treat it like any other infrastructure change:

1. Make the change in a branch.
2. Open a pull request so the CI action runs.
3. Review the plan or what-if output.
4. Approve through the Apply environment.

For sovereign clouds, Learn says only Bicep and Terraform can be modified, and the platform team must remove unsupported policies, adjust resource API versions and remove unsupported resources such as DDoS Protection plans in Azure in China.

## Keep authentication correct

The Bicep deployment page for GitHub Actions describes the pattern:

- Use OpenID Connect so no client secret is stored.
- Create a federated identity credential that matches the branch or environment running the workflow.
- Grant `id-token: write` and `contents: read` permissions in the workflow.
- Scope RBAC to the narrowest scope. Broader scopes need broader roles. Contributor cannot manage deny settings for deployment stacks, which also need Azure Deployment Stack Owner.
- Use `azure/login` with client, tenant and subscription IDs, and `azure/bicep-deploy` for the deployment.

The page says the deploy action supports resource group, subscription, management group and tenant scopes, and it does not show the inputs for the broader scopes. Check the action's input reference before you use them, since landing zone deployments typically run at management group or subscription level.

## Run what-if before every apply

What-if predicts changes and supports resource group, subscription, management group and tenant scopes through `az deployment group|sub|mg|tenant what-if`. With the Bicep deploy action, set `operation: whatIf`. Result types are Create, Delete, Ignore, NoChange, NoEffect, Modify and Deploy.

Limits to know:

- It stops expanding at 500 nested templates, 800 resource groups or 5 minutes, and reports the rest as Ignore.
- `templateLink` and template specs in nested deployments are not expanded.
- Properties set to defaults can appear as deleted, and expressions using `reference`, `listKeys()`, `newGuid()` or secure parameters are shown unevaluated or always as changing.
- It needs the same permissions as deployment.

Do not treat a clean what-if as proof of safety. Review Modify and Ignore entries by hand.

## Decide how to manage policy

Learn says to start with native policy management in the default implementation. If that does not meet your governance needs, run a proof of concept with Enterprise Policy as Code (EPAC), because you cannot easily change policy governance methods after you establish them. Policies may be replaced by built-in policies or newer versions over time, so include policy updates in your update cycle.

## Stay current

Learn lists reasons to keep the landing zone up to date: security, avoiding configuration drift, using new Azure features and community support, which is limited to the open source project. Review the what's new page regularly. Use infrastructure as code to apply updates consistently.

The pages do not cover version pinning, testing changes or pipeline details for customized forks. Define your own: a test management group hierarchy or subscription, a required what-if review and a scheduled upstream comparison.

## A short safety checklist

- Change code in branches, never directly on the main branch
- Keep the Plan and Apply environments and approvals intact
- Confirm the federated credential subject after any repo or environment rename
- Run what-if at the right scope and read Modify and Ignore items
- Record every customization so upgrades are a diff, not a surprise

## Related

- [Azure landing zone](https://www.m365.fm/entity/azure-landing-zone/)
- [Bicep](https://www.m365.fm/entity/bicep/)
- [GitHub Actions](https://www.m365.fm/entity/github-actions/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)

## Sources

- [Azure landing zones overview](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/)
- [Platform landing zone implementation options](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/implementation-options)
- [Azure Landing Zones IaC accelerator](https://azure.github.io/Azure-Landing-Zones/accelerator)
- [Deploy Bicep files by using GitHub Actions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-github-actions)
- [Bicep deployment what-if](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if)
- [Keep your Azure landing zone up to date](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/keep-azure-landing-zone-up-to-date)
- [Landing zone deployment guidance](https://learn.microsoft.com/en-us/azure/architecture/landing-zones/landing-zone-deploy)
