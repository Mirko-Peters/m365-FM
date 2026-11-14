---
title: "Replace Azure Blueprints With Template Specs and Deployment Stacks Before Retirement"
summary: "Plan the move off Azure Blueprints: the phased retirement dates on Microsoft Learn, what is deleted if you do not export, how blueprint artifacts map to deployment stacks and template specs, and what the migration pages leave open."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [azure-deployment-stacks, azure-policy]
keypoints:
  - "Azure Blueprints (Preview) retires on January 31, 2027, with a phased retirement that began July 31, 2026. The original date of July 11, 2026 was extended."
  - "Definitions, versions and assignments not exported before January 31, 2027 are automatically and permanently deleted. Resources created through blueprints remain."
  - "Learn recommends Deployment Stacks for deployment, lifecycle management and deny-assignment locking, and Template Specs for storing and versioning templates."
  - "Blueprint locks stop functioning at retirement. Deny settings on a deployment stack are described as similar to blueprint locks, not identical."
  - "The pages do not describe the export commands or cutover and rollback guidance, and the retirement page is inconsistent about CLI and PowerShell timing."
faq:
  - q: "When is Azure Blueprints retired?"
    a: "According to Microsoft Learn, January 31, 2027, with a phased retirement that began July 31, 2026. It was originally announced on September 14, 2023 with a retirement date of July 11, 2026, which was extended."
  - q: "What happens at each phase?"
    a: "Learn lists July 31, 2026 for no new definitions or versions, October 31, 2026 for no changes to existing definitions and no new assignments, December 31, 2026 for no changes to existing assignments, and January 31, 2027 for retirement."
  - q: "What gets deleted?"
    a: "Learn says definitions, versions and assignments not exported before January 31, 2027 are automatically and permanently deleted and cannot be recovered. Resources created through blueprints remain."
  - q: "What replaces blueprints?"
    a: "Learn recommends Deployment Stacks for most customers and Template Specs, or a Git repository, for storing and versioning templates. In most migrations you use both together."
  - q: "Are deny settings the same as blueprint locks?"
    a: "No. The migration page describes DenySettingsMode as similar to blueprint locks, not identical, and says setting deny settings requires corresponding roles."
---

Azure Blueprints (Preview) is being retired, and Microsoft recommends moving to Deployment Stacks and Template Specs. This guide uses the Microsoft Learn overview, the retirement page and the page on migrating to deployment stacks. Check those pages for any later change to the dates.

## Retirement timeline

The retirement was announced on September 14, 2023 for July 11, 2026. The date was extended to January 31, 2027, with a phased retirement beginning July 31, 2026.

| Date | What changes |
| --- | --- |
| July 31, 2026 | New blueprint definitions and versions can no longer be created |
| October 31, 2026 | Existing definitions can no longer be modified. New assignments can no longer be created. |
| December 31, 2026 | Existing assignments can no longer be modified |
| January 31, 2027 | Azure Blueprints is retired. The API stops responding, CLI and PowerShell commands stop working and Blueprints is removed from the portal. |

The retirement page also uses relative phase labels it does not define against dates, and one row mentions CLI and PowerShell commands being postponed to April or May 2027. That conflicts with the January 31, 2027 row, so confirm the current wording before you plan around it.

## Impact

- Definitions, versions and assignments not exported before January 31, 2027 are automatically and permanently deleted and cannot be recovered.
- Blueprint locks (Do Not Delete and Read Only) stop functioning at retirement.
- Resources created through blueprints remain and are not deleted.
- Until retirement, existing assignments can still be read and deleted. Updates are blocked after December 31, 2026.

## What to do

1. **Find usage.** Azure Advisor flags subscriptions and management groups that use Blueprints, or check the Azure Blueprints blade in the portal.
2. **Export what you want to keep** before January 31, 2027. The retirement page stresses this and points to the migration guides for the procedure.
3. **Migrate.** Use Deployment Stacks for deployment, lifecycle management and deny-assignment locking. Use Template Specs, or a Git repository, for storing and versioning templates. In most migrations you store the template as a template spec, then deploy and govern it with a deployment stack.

## Migration steps

The page on deployment stacks gives three steps:

1. **Export** each blueprint definition to JSON.
2. **Convert** the JSON into a single ARM template or Bicep file for a deployment stack.
3. **Optionally** create template specs for the converted templates.

### How artifacts map

| Blueprint artifact | Deployment stack equivalent |
| --- | --- |
| Policy assignment | `Microsoft.Authorization/policyAssignments`, with optional embedded `policyDefinitions` |
| Role assignment | `Microsoft.Authorization/roleAssignments` |
| Resource group | `Microsoft.Resources/resourceGroups` declared in the template |
| ARM template artifact | Module, nested template or template link, or a template spec |
| Blueprint lock | `DenySettingsMode` on the deployment stack |

Template specs are not required to use deployment stacks. The page includes a subscription-scoped Bicep sample with a role assignment, policy assignment, resource group and module. It does not say the sample was tested, and its placeholder IDs must be replaced.

## What blueprints were

Learn describes blueprints as a declarative way to orchestrate deployments of resource templates and other artifacts, including role assignments, policy assignments, ARM templates and resource groups. A blueprint packages these artifacts, can be versioned and is assigned to a subscription in a single auditable operation. That packaging role is why the page maps storage and versioning to template specs and deployment to deployment stacks.

## A caution about generated migrations

The overview mentions a migration skill for GitHub Copilot. It describes it as MIT-licensed sample content, not a Microsoft product, with no SLA or support agreement. The page warns that output is nondeterministic and can generate commands that permanently delete blueprint definitions, assignments and other resources, and says to test everything in a nonproduction subscription.

## Not covered

The pages do not give export commands, step-by-step conversion for each artifact type, the roles and `DenySettingsMode` values for deny settings, cutover or rollback guidance, or pricing and support implications. They link to a retirement FAQ and a template spec migration guide.

## Related

- [Azure Deployment Stacks](https://www.m365.fm/entity/azure-deployment-stacks/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Bicep](https://www.m365.fm/entity/bicep/)

## Sources

- [Overview of Azure Blueprints](https://learn.microsoft.com/azure/governance/blueprints/overview)
- [Azure Blueprints retirement](https://learn.microsoft.com/azure/governance/blueprints/blueprint-retirement)
- [Migrate Azure Blueprints to deployment stacks](https://learn.microsoft.com/azure/azure-resource-manager/bicep/migrate-blueprint)
