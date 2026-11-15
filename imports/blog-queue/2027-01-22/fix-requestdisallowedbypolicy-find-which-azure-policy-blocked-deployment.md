---
title: "Fix RequestDisallowedByPolicy: Find Which Azure Policy Blocked Your Deployment"
summary: "RequestDisallowedByPolicy means a resource in your ARM template or Bicep deployment violates an assigned Azure Policy. Read the policy assignment and definition names from the error, look them up with CLI or PowerShell, change the deployment, or request an exemption."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [azure-policy, arm-template, bicep, azure-resource-manager]
keypoints:
  - "The error shows the policy assignment and policy definition. The name is the last segment of each id string."
  - "Look the policy up with az policy definition show or Get-AzPolicyDefinition, and the assignment with az policy assignment show or Get-AzPolicyAssignment."
  - "Read the rules in the definition and change the template or Bicep file to comply, for example by turning off public network access."
  - "If the resource must stay non-compliant, an exemption in the Waiver or Mitigated category can exclude it, and expiresOn ends it."
  - "Creating an exemption needs the write permission on policyExemptions and the exempt/Action verb on the target assignment."
faq:
  - q: "What does RequestDisallowedByPolicy mean?"
    a: "According to Microsoft Learn, the error appears when deploying an ARM template or Bicep file and one of the resources does not comply with an existing Azure Policy. Azure CLI, Azure PowerShell and the activity log in the Azure portal show similar information. The key elements are the error code, the policy assignment and the policy definition."
  - q: "How do I find the policy that blocked me?"
    a: "The error message names the policy definition and the policy assignment. The name of each is the last segment of its id string. Use those names with az policy definition show and az policy assignment show, or with Get-AzPolicyDefinition and Get-AzPolicyAssignment in PowerShell. Learn notes that ConvertTo-Json has a Depth parameter whose default of 2 can hide nested output."
  - q: "How do I fix the deployment?"
    a: "Within the policy definition you see the description of the policy and the rules that apply. Review the rules and update the ARM template or Bicep file to comply. Learn's example: if the rule says public network access must be disabled, update the matching resource properties."
  - q: "Can I exempt a resource from the policy?"
    a: "Yes. A policy exemption excludes a resource hierarchy or an individual resource from evaluation of an assignment. The categories are Waiver, for a temporarily accepted noncompliance state, and Mitigated, where the policy intent is met another way. Exempt resources show as Exempt in the compliance state. You need to be allowed to write exemptions and to hold the exempt/Action verb on the target assignment."
  - q: "What happens when an exemption expires?"
    a: "The expiresOn property sets when the resource is no longer exempt. Learn says the exemption object is not deleted when the date is reached, it is preserved for record-keeping, but it is no longer honored. Learn also advises revisiting exemptions regularly and removing those that do not qualify, and expired ones can be deleted."
---

RequestDisallowedByPolicy means that a resource in your ARM template or Bicep deployment breaks a rule of an Azure Policy assigned to the scope. The error text already names the policy, so the work is to read it, look the policy up, and either change the deployment or ask for an exemption. This article follows the Microsoft Learn troubleshooting page and adds details from the policy exemption reference.

## What the error looks like

Learn says Azure CLI, Azure PowerShell and the Azure portal's activity log show similar information. The key elements are the error code, the policy assignment and the policy definition. The sample output on the page shows a message in this shape: the resource was disallowed by policy, followed by policy identifiers with the `policyAssignment` name and id and the `policyDefinition` name and id.

In the `id` string, the `{guid}` placeholder is an Azure subscription ID. The name of a `policyAssignment` or `policyDefinition` is the last segment of its `id`.

## Why it happens

Organizations assign policies to enforce standards and to assess compliance at scale. If you deploy a resource that violates a policy, the deployment is blocked. Learn's example: a policy that prevents public IPs on network interfaces blocks the creation of a network interface that has a public IP address.

## Step 1: Get the names

Copy the policy definition name and the policy assignment name from the error. You need both to read the policy.

## Step 2: Look up the definition and the assignment

Azure CLI, from the page:

```azurecli
az policy definition show --name {policy-name}
az policy assignment show --name {assignment-name} --resource-group {resource-group-name}
```

PowerShell, from the page:

```azurepowershell
$subid = (Get-AzContext).Subscription.Id
$defname = "<policy definition name>"
(Get-AzPolicyDefinition -Id "/subscriptions/$subid/providers/Microsoft.Authorization/policyDefinitions") |
  Where-Object -Property Name -EQ -Value $defname |
    ConvertTo-Json -Depth 10

$rg = Get-AzResourceGroup -Name "<resource group name>"
$assignmentname = "<policy assignment name>"
Get-AzPolicyAssignment -Name $assignmentname -Scope $rg.ResourceId | ConvertTo-Json -Depth 5
```

The page notes that `ConvertTo-Json` has a `Depth` parameter that expands the output and has a default of 2.

The CLI assignment example on the page uses a resource group name, and the PowerShell example uses a resource group scope. The page shows no examples for other scopes.

## Step 3: Read the rules and change the deployment

Within the policy definition you see a description and the rules. Review the rules and update your ARM template or Bicep file to comply. For example, if the rule states public network access is disabled, update the corresponding resource properties. The page points to the Azure Policy overview, a tutorial on creating and managing policies, and the list of built-in policy definitions.

## Step 4: If the resource must stay non-compliant, use an exemption

The exemption reference says exemptions exclude a resource hierarchy or an individual resource from evaluation of initiatives or definitions. Resources that are exempt count toward overall compliance, but cannot be evaluated or have a temporary waiver.

| Property | What it does |
| --- | --- |
| `policyAssignmentId` | Full path of the policy or initiative assignment the exemption applies to |
| `policyDefinitionReferenceId` | For an initiative, which policy definitions inside it are exempted. An array |
| `exemptionCategory` | Waiver or Mitigated |
| `expiresOn` | Optional end date in ISO 8601 format |
| `resourceSelectors` | Optional, to exempt only a subset by resource type, location or identity |
| `displayName`, `description` | Up to 128 and 512 characters |

Categories: **Mitigated** means the policy intent is met through another method. **Waiver** means the noncompliance is temporarily accepted. Waiver is also used to exclude a resource or hierarchy from some definitions in an initiative, but not from the whole initiative.

Notes from the page:

- An exemption is created as a child object on the hierarchy or resource granted the exemption. If the parent resource is removed, so is the exemption.
- When the `expiresOn` date is reached, the object is kept for record-keeping, but no longer honored.
- Identity-based exemptions can use the `userPrincipalId` and `groupPrincipalId` selector kinds, for example to let a high-privilege group bypass a VM size policy.
- Exempt resources show the compliance state Exempt, and the compliance substate shows what the state would be without the exemption.

### Permissions

Managing exemptions uses the `Microsoft.Authorization/policyExemptions` operation group. Learn names Resource Policy Contributor and Security Admin as built-in roles with read and write, and Policy Insights Data Writer (Preview) with read. Beyond the write operation on the target, the creator also needs the `exempt/Action` verb on the target assignment.

Learn recommends exemptions for time-bound or specific scenarios where a resource should still be tracked, and says to revisit exemptions regularly and remove those that do not qualify.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Treat the policy as intended. Most of the time the deployment should change, not the policy.
2. Capture the whole error text, since you need both names and the target resource.
3. If the policy is a built-in definition, search its name in the built-in list to see the intent before you read the JSON.
4. If an exemption is needed, set an expiry date and a clear description, and use the metadata property for a ticket reference, as the page's example does.
5. Talk to the team that owns the assignment before you request anything.

## Related

- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [ARM template](https://www.m365.fm/entity/arm-template/)
- [Bicep](https://www.m365.fm/entity/bicep/)
- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)

## Sources

- [Request disallowed by policy error (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-policy-requestdisallowedbypolicy)
- [Details of the policy exemption structure (Microsoft Learn)](https://learn.microsoft.com/azure/governance/policy/concepts/exemption-structure)
