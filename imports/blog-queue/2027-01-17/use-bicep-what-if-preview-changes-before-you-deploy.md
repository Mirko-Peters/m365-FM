---
title: "How to Use Bicep What-If to Preview Changes Before You Deploy"
summary: "Run the what-if operation with Azure CLI or Azure PowerShell to preview what a Bicep deployment would create, modify or delete. Covers permissions, commands per scope, validation levels, change types, result formats, noise, unevaluated expressions and limits."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [bicep-what-if, bicep, azure-resource-manager]
keypoints:
  - "What-if makes no changes to existing resources; it predicts what happens if the Bicep file is deployed, and needs the same permissions as deployment."
  - "Use az deployment group what-if or the -Whatif switch on New-AzResourceGroupDeployment, and --confirm-with-what-if or -Confirm to be asked before deploying."
  - "Learn lists change types Create, Delete, Ignore, NoChange, NoEffect, Modify and Deploy; Delete applies to complete mode for JSON templates."
  - "What-if can report noise, such as properties shown as deleted that are set by default during deployment, and it cannot evaluate expressions such as utcNow() or reference()."
  - "What-if expands nested templates only up to 500 templates, 800 resource groups and 5 minutes, and templateLink resources are not visible."
faq:
  - q: "Does what-if change anything in Azure?"
    a: "No. Learn says the what-if operation does not make any changes to existing resources. It predicts the changes if the specified Bicep file is deployed."
  - q: "Which permissions do I need?"
    a: "The same as deploying: write access on the resources you deploy and access to all operations on the Microsoft.Resources/deployments resource type, for example Microsoft.Compute/virtualMachines/write plus Microsoft.Resources/deployments/* for a virtual machine."
  - q: "What are the validation levels?"
    a: "With Azure CLI 2.76.0 or later or Azure PowerShell 13.4.0 or later: Provider (default, full validation including permission checks), ProviderNoRbac (full validation but read permission checks only) and Template (static validation only, skipping preflight and permission checks)."
  - q: "Why does what-if show changes I did not make?"
    a: "Learn says properties can be reported as deleted when they are not in the Bicep file but are set automatically during deployment, which it calls noise. It also says what-if cannot resolve the reference function, so such properties are reported as changing."
  - q: "Which scopes does what-if support?"
    a: "Resource group, subscription, management group and tenant deployments, using Visual Studio Code, Azure PowerShell, Azure CLI or REST API operations."
---

The Bicep what-if operation shows what a deployment would create, update or delete without changing anything. Microsoft Learn says Azure Resource Manager predicts the changes if the specified Bicep file is deployed, and that the operation does not modify existing resources. You run it with Azure CLI or Azure PowerShell, in Visual Studio Code, or through the REST API, at resource group, subscription, management group and tenant scope. This guide follows Learn's page on Bicep what-if.

## Permissions and versions

Learn says the what-if operation has the same permission requirements as deployment: write access on the resources you deploy and access to all operations on `Microsoft.Resources/deployments`. For a virtual machine, that means `Microsoft.Compute/virtualMachines/write` and `Microsoft.Resources/deployments/*`.

Tool versions from the page:

- Azure CLI 2.14.0 or later for what-if; Az PowerShell module 4.2 or later.
- Azure CLI 2.76.0 or later and Azure PowerShell 13.4.0 or later add the validation level switch.
- Az 13.1.0 or later, or Azure CLI 2.75.0 or later, show diagnostics when what-if cannot analyze part of the deployment. Earlier versions behave the same way but do not display the diagnostics.

## Run what-if

Azure CLI, per scope:

- `az deployment group what-if` for resource groups
- `az deployment sub what-if` for subscriptions
- `az deployment mg what-if` for management groups
- `az deployment tenant what-if` for tenants

Azure PowerShell adds the `-Whatif` switch to `New-AzResourceGroupDeployment`, or to `New-AzSubscriptionDeployment` and `New-AzDeployment` for subscription level.

Learn's test run: deploy a virtual network from `what-if-before.bicep`, then preview a modified `what-if-after.bicep`:

```azurecli
az deployment group what-if \
  --resource-group ExampleGroup \
  --template-file "what-if-after.bicep"
```

```azurepowershell
New-AzResourceGroupDeployment `
  -Whatif `
  -ResourceGroupName ExampleGroup `
  -TemplateFile "what-if-after.bicep"
```

In Learn's sample, one tag is missing, a subnet is removed and an address prefix changes. The output marks a deleted tag, a changed address prefix and a deleted subnet, and ends with Resource changes: 1 to modify. The symbols are `-` for delete, `+` for create and `~` for modify. Learn stresses that these changes were not deployed.

### Confirm before deploying

Add `--confirm-with-what-if` (or `-c`) to the `az deployment ... create` commands, or `-Confirm` to the PowerShell commands. You get the preview and a prompt before the deployment runs. For a result you can inspect in code, use `--no-pretty-print` in Azure CLI, or `Get-AzResourceGroupDeploymentWhatIfResult` in PowerShell.

## Validation levels

| Level | What it does |
| --- | --- |
| Provider (default) | Full validation including syntax, resource definitions, dependencies and permission checks for deploying all resources |
| ProviderNoRbac | Full validation like Provider, but checks only read permission on each resource |
| Template | Static validation only: syntax and structure, skipping preflight checks and permission checks, so it may miss issues that cause failures |

In CLI the switch is `--validation-level`, in PowerShell `-ValidationLevel`.

## Read the result

Learn lists seven change types:

- **Create**: the resource does not exist but is defined in the file.
- **Delete**: applies only to complete mode for JSON template deployment. Only resources that support complete mode deletion are included.
- **Ignore**: the resource exists but is not defined in the file, so it will not be deployed or modified. You also see it when nested template expansion limits are reached.
- **NoChange**: the resource is redeployed with no property changes. Returned when the result format is FullResourcePayloads, the default.
- **NoEffect**: the property is read-only and ignored by the service.
- **Modify**: the resource is redeployed and properties change. Also returned with FullResourcePayloads.
- **Deploy**: the resource will be redeployed and properties may or may not change. Returned with ResourceIdOnly when there is not enough information.

The result format is FullResourcePayloads (resources and property changes, the default) or ResourceIdOnly (just the list of resources). Use `--result-format` in CLI, `-WhatIfResultFormat` in PowerShell.

## Noise and unevaluated expressions

Learn says some properties listed as deleted do not actually change: properties can be reported as deleted when they are not in the Bicep file but are set automatically during deployment as default values. It calls this noise and says these properties are expected to be filtered out as the operation matures.

What-if cannot resolve the `reference` function, so any property set from an expression with `reference` is reported as changing. Expressions that are not evaluated outside a deployment include nondeterministic functions such as `newGuid()` and `utcNow()`, references to secure parameter values, references to resources not deployed in the same template, references to properties not defined in the same template, and resource functions such as `listKeys()`. They appear as written, for example `"[utcNow()]"`.

## Limits

What-if expands nested templates until it reaches 500 nested templates, 800 resource groups in a cross-resource-group deployment, or 5 minutes for expansion. Remaining resources then get the change type Ignore. Evaluation and expansion of `templateLink` are not supported, so resources deployed through template links in nested deployments, including template spec references, are not visible. Learn also describes short-circuiting, where a module or resource cannot be fully analyzed; the response then carries a diagnostic message.

## A routine I suggest

This section is my advice, not a Microsoft statement.

1. **Run what-if in the pipeline before every production deployment** and keep the output with the change record.
2. **Read Modify and Delete first.** A clean Create list rarely hides a problem, but an unexpected Delete or a changed address range does.
3. **Treat noise as noise, but verify it once.** Compare a suspicious line with the Bicep file and the deployed resource before you dismiss it.
4. **Know what is invisible.** If you use template links or modules that short-circuit, what-if will not show them, so test those parts another way.
5. **Match the validation level to the job.** Learn says Provider is the default and the most thorough. I would use Template only for a fast syntax check.
6. **Preview stack changes too.** Learn's tip says you can preview deployment stack changes with what-if.

## Related

- [Bicep what-if](https://www.m365.fm/entity/bicep-what-if/)
- [Bicep](https://www.m365.fm/entity/bicep/)
- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)

## Sources

- [Bicep What-If: Preview Changes Before Deployment - Azure Resource Manager (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/bicep/deploy-what-if)
