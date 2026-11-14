---
title: "Azure Subscription Vending With Terraform or Bicep: Implementation Guide for Landing Zones"
summary: "How to automate subscription vending for Azure landing zones: the request, pull request and deployment pipeline flow, what the Terraform and Bicep modules do, and the billing, identity and governance points Microsoft Learn lists."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [subscription-vending, azure-landing-zone, terraform, bicep]
keypoints:
  - "Microsoft recommends three automation goals: collect request data, initiate platform automation and create subscriptions with infrastructure as code."
  - "Use one parameter file per subscription request, and with Terraform use a dedicated state file for each landing zone subscription."
  - "Creating subscriptions programmatically needs a commercial agreement. Without one, create the subscription manually and automate the rest."
  - "The deployment pipeline places the subscription in a management group, sets RBAC, policy and budgets, and can create a peered virtual network."
  - "Authenticate the pipeline with managed identity or OpenID Connect, and give the workload team the finished subscription to own."
faq:
  - q: "What is subscription vending in Azure landing zones?"
    a: "According to Microsoft Learn, it is a platform mechanism for programmatically issuing subscriptions to workload teams. It standardizes how subscriptions are requested, deployed and governed, so application teams get a workload landing zone faster while the platform team keeps governance in place."
  - q: "Can I vend subscriptions without an Enterprise Agreement?"
    a: "Microsoft Learn says you need a commercial agreement to create a subscription programmatically. Without one, you introduce a manual step for creating the subscription but can still automate all other configuration. The Learn page names EA, MCA and MPA as the agreement types and links to separate pages for the required roles."
  - q: "Should I use Terraform or Bicep for subscription vending?"
    a: "Microsoft Learn offers both a Bicep module and a Terraform module and says to adapt them to your needs. The pages read give no preference. Pick the language your platform team already uses for the rest of the landing zone, because the module is meant to be combined with the platform deployment."
  - q: "How should the vending pipeline authenticate to Azure?"
    a: "Microsoft Learn says to use a managed identity or OpenID Connect to authenticate to Azure. The pipeline needs permission for every system it touches, such as billing, management groups, networking and the data collection tool."
  - q: "What does a Terraform subscription vending module create?"
    a: "The Azure Verified Module README lists subscription creation and management group placement, virtual network peering, role assignments, resource provider registration, resource groups and user-assigned managed identities. It uses the AzAPI provider and is meant to be instantiated once per landing zone."
---

Subscription vending turns a subscription request into a governed, ready-to-use landing zone without manual platform work. Microsoft recommends three automation tasks: collect the request data, start platform automation, and create the subscription with infrastructure as code (IaC). Microsoft offers both a Bicep module and a Terraform module for the last step. This guide follows the Azure Architecture Center implementation guidance and the Cloud Adoption Framework design area.

## Decide the process before the code

The design area describes seven steps: define the business logic and approval, submit a request, configure networking, determine placement, create and configure the subscription, update the budget, and deploy the workload. Three roles appear:

- **Cloud center of excellence:** defines the business logic and what to collect.
- **Workload team:** submits the request and later owns the workload and budget.
- **Platform team:** creates and configures the subscription, then hands it off.

Learn lists intake items to capture: the request authorizer, cost center, networking needs such as internet or on-premises connectivity, workload components, data sensitivity, and the number of environments. The request must also say Production or DevTest. The DevTest offer is not available for MPA.

## Step 1: Collect and validate the request

Use an ITSM tool or a portal built with a low-code tool such as Power Apps. Create a trackable request, validate the data early, and tie approval to it. If an IP address management tool exists, reserve address space during intake. Learn says never to use overlapping IP addresses in a single routing domain. A push trigger may need middleware such as Azure Functions or Azure Logic Apps.

## Step 2: Turn the request into a pull request

The reference flow has five parts:

1. The data collection tool gathers the request.
2. Approval starts the platform automation: a request pipeline, source control and a deployment pipeline.
3. The request pipeline writes a JSON, YAML or TFVARS parameter file, creates a branch, commits it and opens a pull request.
4. The branch merges into `main`.
5. The merge starts the deployment pipeline.

Two rules from Learn matter here. Use one file for each subscription request, because the subscription is the unit of deployment. With Terraform, use a dedicated state file for each landing zone subscription. That improves plan and apply performance and reduces the blast radius of mistakes. The pull request should trigger linting, for example to check that the IP range is still free, and you can add a manual review gate.

## Step 3: Deploy with the Bicep or Terraform module

Learn lists what the deployment pipeline does:

| Area | Tasks |
|---|---|
| Identity | Create or update Entra resources for ownership, set up workload identities for deployments |
| Governance | Place in the management group, assign the owner, set RBAC for security groups, assign policies, enroll in Defender for Cloud |
| Networking | Deploy virtual networks and peer to the regional hub |
| Budgets | Create budgets from the request data |
| Reporting | Update IPAM, update the request with the subscription name and GUID, notify the application team |

### Terraform

The Azure Verified Module `avm-ptn-alz-sub-vending` uses the AzAPI provider to create the subscription and its resources in one `terraform apply`. Its README lists Terraform `~> 1.10` and azapi `~> 2.12`. Main inputs:

- `subscription_alias_enabled` with `subscription_billing_scope` creates a subscription.
- `subscription_management_group_association_enabled` with `subscription_management_group_id` sets placement. Use the ID, not the display name.
- `virtual_network_enabled` with `virtual_networks` creates networking, including hub peering.
- `role_assignment_enabled`, `budget_enabled` and `umi_enabled` turn on role assignments, budgets and a user-assigned managed identity.
- `subscription_id` manages an existing subscription.

The README says destroying a module-created subscription tries to remove NetworkWatcherRG through the Azure CLI, so the CLI must be installed and signed in.

### Bicep

The Bicep module sits in the Azure Verified Modules registry. The Learn example parameter file sets `subscriptionDisplayName`, `subscriptionAliasName` and `subscriptionBillingScope`, where the scope is an enrollment account path. The module README could not be retrieved for this article, so check it for the full parameter list and deployment scope.

Both module landing pages recommend deploying the platform first with the Azure landing zone module for the same language, and then using the vending module for workload landing zones.

## Permissions, billing and identity

- A commercial agreement is required to create subscriptions programmatically. Without it, create subscriptions by hand and automate the rest.
- The pipeline identity needs rights in every system it touches. Use managed identity or OIDC.
- The subscription owner must be a user or service principal in the subscription's directory. Guest users are not allowed.
- Use group-based access, and PIM for groups for elevated access. Workload identities created by vending cannot use PIM and get standing access, so Learn recommends managed identities.
- Budgets are not hard limits, so add budget alerts. Learn also advises reviewing subscription quota limits before creation.

## After the handoff

The platform team owns the automation and the governance of the subscription, including moves between management groups. The application team updates the budget and deploys the workload. Learn suggests automating routine governance changes with Bicep or Terraform.

## Typical mistakes

- Starting with code before agreeing what the request must contain.
- Putting several subscriptions in one parameter file or one Terraform state.
- Using the management group display name instead of its ID.
- Assuming programmatic creation works without a commercial agreement.
- Skipping IP address checks, which then fail at deployment.

## What the sources do not say

The pages read do not list the billing roles for each agreement type, they link to other pages for that. The Bicep module README could not be read, and the Learn pages give no preference between Terraform and Bicep.

## Related

- [Subscription vending](https://www.m365.fm/entity/subscription-vending/)
- [Azure landing zone](https://www.m365.fm/entity/azure-landing-zone/)
- [Terraform](https://www.m365.fm/entity/terraform/)
- [Bicep](https://www.m365.fm/entity/bicep/)

## Sources

- [Subscription vending implementation guidance](https://learn.microsoft.com/en-us/azure/architecture/landing-zones/subscription-vending)
- [Subscription vending design area](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/subscription-vending)
- [Azure landing zones subscription vending, Terraform](https://azure.github.io/Azure-Landing-Zones/sub-vending/tf)
- [Azure landing zones subscription vending, Bicep](https://azure.github.io/Azure-Landing-Zones/sub-vending/bicep/)
- [Terraform AVM module for subscription vending](https://github.com/Azure/terraform-azure-avm-ptn-alz-sub-vending)
