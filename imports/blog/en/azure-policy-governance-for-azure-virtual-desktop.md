---
title: "Azure Policy governance for Azure Virtual Desktop"
summary: "Azure Policy governs the Azure resources around Azure Virtual Desktop, such as host pools, workspaces and private endpoints, through built-in definitions with audit, deny, modify and deploy-if-not-exists effects. This guide compares the effects, shows the AVD definitions Microsoft lists, and sets out a staged rollout."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, azure-policy]
keypoints:
  - "Microsoft lists 11 built-in Azure Policy definitions under Desktop Virtualization, all at version 1.0.0. They cover public network access, Private Link, private endpoints and private DNS zones. Separate Monitoring definitions deploy diagnostic settings for host pools, workspaces, application groups and scaling plans."
  - "Audit only reports. Deny blocks a create or update request. Modify and DeployIfNotExists change resources and need a managed identity on the assignment, plus a remediation task for resources that already exist."
  - "Roll out in stages: test on a small scope such as a test resource group with enforcement mode DoNotEnforce, remediate existing resources, use audit where the definition offers it, then widen the scope gradually. The seven Configure definitions have no audit effect."
  - "Use exclusions (notScopes) to bypass evaluation permanently for a broad scope. Use an exemption with an expiresOn date for a time-bound or specific case that must stay visible as Exempt in compliance reports."
  - "Azure Policy works on the Azure control plane. For settings inside the session host operating system, Learn points to machine configuration, whose supported OS table you should check against your image."
faq:
  - q: "Does Azure Policy change settings inside the Windows session?"
    a: "Not through the AVD built-in definitions on Learn, which target Azure resources such as host pools, workspaces, private endpoints and private DNS zones, or deploy diagnostic settings. For operating system settings, Learn describes machine configuration, which can audit or configure OS settings as code through Azure Policy. Check that your session host operating system is in its supported table first."
  - q: "Will a deny policy stop my existing session hosts?"
    a: "No. Learn says that during evaluation of existing resources, resources that match a deny definition are marked as non-compliant. Deny acts on create or update requests, which are returned as 403 (Forbidden). Our reading: a later update to a non-compliant host pool or workspace, including one made by automation, can therefore be blocked, so test with audit first."
  - q: "How do I find out which policy blocked an Azure Virtual Desktop deployment?"
    a: "Learn's RequestDisallowedByPolicy article says the error shows the policy assignment and policy definition. The name of each is the last segment of its id, and az policy assignment show and az policy definition show return the details. Learn's AVD troubleshooting article separately points to the deployment operations and, if those show no errors, to the activity log."
---

Azure Policy governs [Azure Virtual Desktop](/entity/azure-virtual-desktop/) at the Azure resource level: it audits, blocks or changes properties of host pools, workspaces, private endpoints and private DNS zones, deploys diagnostic settings, and reports compliance across subscriptions. It does not manage what runs inside a user session. The sections below list the AVD definitions Microsoft ships, compare the effects, and give a staged rollout that avoids blocking your own deployments.

## What Azure Policy does and where it stops

Learn describes [Azure Policy](/entity/azure-policy/) as a service that evaluates resources and actions in Azure by comparing their properties to business rules written in JSON, called policy definitions. Several definitions can be grouped into an initiative (also called a policySet).

Evaluation happens when a resource is created or updated in a scope with an assignment, when a scope gets a new assignment, when an assigned policy or initiative is updated, and in a standard cycle once every 24 hours. Learn adds that Azure Policy keeps resource state compliant "without concern for who made the change or who has permission to make a change". Although a policy can be assigned at the management group level, only resources at the subscription or resource group level are evaluated.

For AVD this means the policy sees the Azure objects: [host pools](/entity/avd-host-pool/), [workspaces](/entity/avd-workspace/), [session host](/entity/avd-session-host/) virtual machines, their disks and network interfaces. Settings inside Windows belong to other tools. Learn's machine configuration overview describes "audit or configure operating system settings as code" through Azure Policy, with three enforcement modes for custom policies. Its supported-OS table lists Windows Client "10 - 11" and Windows Server "2012 - 2025"; confirm that your multi-session image is covered.

## The built-in AVD definitions

Learn's built-in policy list has a Desktop Virtualization section with 11 definitions, all at version 1.0.0. They fall into three groups, and the effects differ by group.

| Definition (Learn name) | Effects |
|---|---|
| Azure Virtual Desktop hostpools should disable public network access | Audit, Deny, Disabled |
| Azure Virtual Desktop hostpools should disable public network access only on session hosts | Audit, Deny, Disabled |
| Azure Virtual Desktop workspaces should disable public network access | Audit, Deny, Disabled |
| Azure Virtual Desktop service should use private link | Audit, Disabled |
| Configure Azure Virtual Desktop hostpools to disable public network access | Modify, Disabled |
| Configure Azure Virtual Desktop hostpools to disable public network access only for session hosts | Modify, Disabled |
| Configure Azure Virtual Desktop workspaces to disable public network access | Modify, Disabled |
| Configure Azure Virtual Desktop hostpools with private endpoints | DeployIfNotExists, Disabled |
| Configure Azure Virtual Desktop workspaces with private endpoints | DeployIfNotExists, Disabled |
| Configure Azure Virtual Desktop hostpool resources to use private DNS zones | DeployIfNotExists, Disabled |
| Configure Azure Virtual Desktop workspace resources to use private DNS zones | DeployIfNotExists, Disabled |

All 11 point at Private Link and network exposure. Separately, Learn's Azure Monitor article lists built-in policies that create diagnostic settings by category group for host pools, workspaces, application groups and scaling plans, with Log Analytics, event hub or storage destinations. Background: [Azure Private Link](/entity/azure-private-link/).

### How the network policies relate to the AVD settings

Learn's Private Link setup article gives the host pool setting under Networking, Public access, three choices: enable public access from all networks; enable public access for end users and use private access for session hosts; disable public access and use private access. Workspaces have two. Our reading, from the definition names: the "only on session hosts" definitions correspond to the middle choice, and the plain "disable public network access" definitions to the third. Learn does not state this mapping.

- Learn says that if you configure the workspace used for initial feed discovery to allow only private access, the setting is ignored. Our reading: assign the workspace definitions in audit first and see how that workspace is reported.
- The Private Link overview and setup articles carry no preview label; the setup article says only the Azure PowerShell cmdlets that support Private Link are in preview (Az.DesktopVirtualization 5.0.0-preview).
- The AVD security baseline (control NS-2, based on an older benchmark version) says AVD does not require, nor recommend, Private Link for RDP unless you have a specific need. Our reading: enforce the Private Link definitions only where that need exists.

## Choosing the effect

| Effect | What it does (per Learn) | Fits in AVD when | Watch out for |
|---|---|---|---|
| Audit | Assesses compliance from the resource's own properties and reports it | You want a baseline of current host pools and workspaces | Nothing is blocked or fixed |
| Deny | Stops the create or update request | A rule is settled, for example a mandatory tag on new resources | Can block your own pipelines and portal deployments if they do not meet the rule |
| Modify | Alters the resource (tags, properties); remediation tasks apply it to existing resources | Adding a missing tag, or changing the public access setting | Learn says to restart the RDAgentBootLoader service on each session host (or restart the hosts) whenever you change a host pool's network configuration |
| DeployIfNotExists | Deploys a template after a resource is created or updated, if a related resource is missing | Creating private endpoints or private DNS zone links | Needs a managed identity with roles; the template runs under that identity |

The evaluation order on a create or update request is: disabled, append and modify, deny, audit, manual, auditIfNotExists, then denyAction. deployIfNotExists and auditIfNotExists run after the resource provider returns a success code.

## Roll out a policy in six steps

The order follows Learn's article on evaluating the impact of a new policy definition.

1. **Choose the scope and name the owner.** Start at a resource group that holds only AVD resources, for example a test resource group. The optional `nonComplianceMessages` property adds a custom explanation to the default error (Resource Manager mode definitions only).
2. **Test on existing resources without enforcement.** Set enforcement mode to `DoNotEnforce`. Learn says it evaluates compliance without enforcing the effect or writing deny entries to the Activity log. The seven Configure definitions offer only Modify or DeployIfNotExists, so this mode is the way to test them. Learn adds that remediation tasks for deployIfNotExists can be started even under DoNotEnforce, so such a task still changes resources.
3. **Remediate existing resources.** Learn describes this as a chance to remediate non-compliant resources before full implementation, manually or by remediation task for modify and deployIfNotExists.
4. **Audit new and updated resources.** Learn says: if the definition supports effect parameterization, use audit or auditIfNotExists, then create or update matching resources and check that the effect fires. Our reading: because DoNotEnforce writes no Activity log entries, this step needs enforcement mode Default. If you change the definition, start the validation over.
5. **Deploy to a subset, then widen.** Learn recommends assigning first to a subset such as a resource group, optionally narrowed by location or resource type with `resourceSelectors`, then widening the selectors or replacing the assignment at a broader scope, until the full intended scope is covered. The assignment article also describes an `Enroll` enforcement mode for adding subscopes in batches. Our reading: move from audit to deny stage by stage as well.
6. **Monitor.** Learn recommends continuous compliance monitoring with Azure Monitor alerts.

### The managed identity for modify and deployIfNotExists

Learn says an assignment with a modify or deployIfNotExists effect must have an identity with the minimum Azure RBAC role required to remediate. In the portal, Azure Policy grants the listed roles when the assignment starts; with an SDK you grant them yourself. An assignment can have only one managed identity, and one remediation task handles one modify or deployIfNotExists policy at a time. For a management group assignment, create the task from the Remediation or Compliance page after evaluation.

## Exclusions and exemptions

Both keep a resource out of a policy, but they behave differently in reports.

| | Exclusion (`notScopes`) | Exemption |
|---|---|---|
| Where it is set | On the assignment object | A separate Resource Manager object on the resource or hierarchy |
| In compliance reports | Not evaluated or counted | Shown as Exempt, with a substate |
| Typical use per Learn | Permanent bypass for a broad scope such as a test environment | Time-bound or specific cases that should still be tracked |
| Expiry | None | Optional `expiresOn`; the object is kept but no longer honored |

Learn defines two exemption categories: Waiver (non-compliance is temporarily accepted) and Mitigated (the intent is met another way). An exemption names a policy assignment, and for an initiative assignment optionally individual definitions by `policyDefinitionReferenceId`. Creating one needs the `Microsoft.Authorization/policyExemptions/write` operation plus the `exempt/Action` verb on the target assignment.

Example: a legacy host pool in `rg-avd-legacy` still allows public access while a Private Link migration runs. Give it a waiver exemption on the assignment of the host pool definition, with `expiresOn` set to the end of the migration window. Reports show the pool as Exempt, and the exemption lapses by itself.

## Tags and cost allocation

Learn's tag policy article lists 17 built-in tag policies, among them "Inherit a tag from the resource group if missing" (modify) and "Require a tag and its value on resources" (deny). The "if missing" variant keeps an existing tag with a different value; the plain inherit policy adds or replaces it. Append policies do not modify tags on resources created before the assignment until those resources are changed; the article points to the modify policies for existing resources.

Learn's tag support list marks host pools, workspaces, application groups, scaling plans and app attach packages as supporting tags and showing them in the cost report; the hostpools/sessionhosts resource type does not. Learn's AVD tagging article recommends starting with tags on all host pools to track VM compute costs, and describes a `cm-resource-parent` tag whose value is the host pool resource ID, to group costs by host pool. It also says that when you add session hosts in the portal you must enter the tags manually each time. Our reading: an inherit-tag policy can close that gap.

## When something is blocked

A deny returns 403 (Forbidden), which the portal shows as a deployment status prevented by the policy assignment. Learn's RequestDisallowedByPolicy article says the error message, Azure CLI, Azure PowerShell and the activity log show the error code, policy assignment and policy definition. The name of each is the last segment of its `id`. Use `az policy assignment show --name <assignment> --resource-group <rg>` and `az policy definition show --name <definition>` (or Get-AzPolicyAssignment and Get-AzPolicyDefinition) to read the rule, then adjust the deployment. Our reading: ask the policy owner for an exemption instead of weakening the assignment.

## Sources

- [Microsoft Learn: Azure Policy built-in policy definitions (Desktop Virtualization section)](https://learn.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies)
- [Microsoft Learn: Enable diagnostic settings by category group using built-in policies](https://learn.microsoft.com/en-us/azure/azure-monitor/data-collection/diagnostic-settings-policy-built-in)
- [Microsoft Learn: Overview of Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview)
- [Microsoft Learn: Azure Policy definitions effect basics](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics)
- [Microsoft Learn: Azure Policy definitions deny effect](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-deny)
- [Microsoft Learn: Remediate non-compliant resources with Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources)
- [Microsoft Learn: Azure Policy assignment structure](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/assignment-structure)
- [Microsoft Learn: Azure Policy exemption structure](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/exemption-structure)
- [Microsoft Learn: Understand scope in Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope)
- [Microsoft Learn: Evaluate the impact of a new Azure Policy definition](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/evaluate-impact)
- [Microsoft Learn: Use tags to organize your Azure resources (tag policies)](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies)
- [Microsoft Learn: Tag support for Azure resources](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-support)
- [Microsoft Learn: Tag Azure Virtual Desktop resources](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
- [Microsoft Learn: Understand Azure Policy machine configuration](https://learn.microsoft.com/en-us/azure/governance/machine-configuration/overview)
- [Microsoft Learn: Azure Private Link with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/private-link-overview)
- [Microsoft Learn: Set up Private Link with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/private-link-setup)
- [Microsoft Learn: Request disallowed by policy error](https://learn.microsoft.com/en-us/azure/azure-resource-manager/troubleshooting/error-policy-requestdisallowedbypolicy)
- [Microsoft Learn: Azure Virtual Desktop environment host pool creation (troubleshooting)](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-issues)
- [Microsoft Learn: Azure security baseline for Azure Virtual Desktop](https://learn.microsoft.com/en-us/security/benchmark/azure/baselines/azure-virtual-desktop-security-baseline)
