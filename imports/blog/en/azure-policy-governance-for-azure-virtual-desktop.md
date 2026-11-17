---
title: "Azure Policy governance for Azure Virtual Desktop"
summary: "Azure Policy governs the Azure resources around Azure Virtual Desktop, such as host pools, workspaces and private endpoints, through built-in definitions with audit, deny, modify and deploy-if-not-exists effects. This guide compares the effects, shows the AVD definitions Microsoft lists, and sets out a staged rollout."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, azure-policy]
keypoints:
  - "Microsoft lists 11 built-in Azure Policy definitions under Desktop Virtualization, all at version 1.0.0. They cover public network access, Private Link, private endpoints and private DNS zones for host pools and workspaces."
  - "Audit only reports. Deny blocks a create or update request. Modify and DeployIfNotExists change resources and need a managed identity on the assignment, plus a remediation task for resources that already exist."
  - "Roll out in stages: assign with enforcement mode DoNotEnforce or an audit effect first, test on a small scope such as a test resource group, then widen the scope. Switch to deny only after the compliance results look right."
  - "Use exclusions (notScopes) to bypass evaluation permanently for a broad scope. Use an exemption with an expiresOn date for a time-bound or specific case that must stay visible as Exempt in compliance reports."
  - "Azure Policy works on the Azure control plane. For settings inside the session host operating system, Learn points to machine configuration, whose supported OS table you should check against your image."
faq:
  - q: "Does Azure Policy change settings inside the Windows session?"
    a: "Not through the AVD built-in definitions listed on Learn, which target host pool and workspace resources, private endpoints and private DNS zones. For operating system settings, Learn describes machine configuration, which can audit or configure OS settings as code through Azure Policy. Check that your session host operating system is in its supported table first."
  - q: "Will a deny policy stop my existing session hosts?"
    a: "Learn says Azure Policy evaluates new and updated resources and existing resources in a standard cycle that runs once every 24 hours. A deny effect stops a create or update request. Our reading: a later update to a non-compliant host pool or workspace, including a change made by automation, can therefore be blocked, so test with audit first."
  - q: "How do I find out which policy blocked an Azure Virtual Desktop deployment?"
    a: "Learn's AVD troubleshooting article points to the deployment operations in Azure Resource Manager and, if those show no errors, to the activity log. Learn's assignment article says an assignment with enforcement mode Default writes deny entries to the Azure Activity log, while DoNotEnforce does not."
---

Azure Policy governs [Azure Virtual Desktop](/entity/azure-virtual-desktop/) at the Azure resource level: it audits, blocks or changes properties of host pools, workspaces, private endpoints and private DNS zones, and it reports compliance across subscriptions. It does not manage what runs inside a user session. The sections below list the AVD definitions Microsoft ships, compare the effects, and give a staged rollout that avoids blocking your own deployments.

## What Azure Policy does and where it stops

Learn describes [Azure Policy](/entity/azure-policy/) as a service that evaluates resources and actions in Azure by comparing their properties to business rules written in JSON, called policy definitions. Several definitions can be grouped into an initiative (also called a policySet). Learn recommends initiatives even for a single definition.

Evaluation happens when a resource is created or updated in a scope with an assignment, when a scope gets a new assignment, when an assigned policy or initiative is updated, and in a standard cycle once every 24 hours. Learn adds that Azure Policy keeps resource state compliant "without concern for who made the change or who has permission to make a change" (Our reading: an Owner role does not bypass it). One detail from the overview: although a policy can be assigned at the management group level, only resources at the subscription or resource group level are evaluated.

For AVD this means the policy sees the Azure objects: [host pools](/entity/avd-host-pool/), [workspaces](/entity/avd-workspace/), [session host](/entity/avd-session-host/) virtual machines, their disks and network interfaces. Settings inside Windows belong to other tools. Learn's machine configuration overview describes "audit or configure operating system settings as code" through Azure Policy, with three modes: Audit, Apply and Monitor, and Apply and Autocorrect. Its supported-OS table lists Windows Client "10 - 11" and Windows Server "2012 - 2025". Confirm that your multi-session image is covered before you plan around it.

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

All 11 point at Private Link and network exposure. Learn's list contains no AVD-specific definitions for scaling plans, load balancing or session limits, so those settings need custom definitions or other tools. Background: [Azure Private Link](/entity/azure-private-link/).

### How the network policies relate to the AVD settings

Learn's Private Link overview describes the host pool setting under Networking, Public access, with two choices: enable public access for end users and use private access for session hosts, or disable public access and use private access. It names three private endpoint types: one `connection` endpoint per host pool, one `feed` endpoint per workspace, and a single `global` endpoint for initial feed discovery in the whole deployment. Two points matter for policy design:

- Learn says you cannot control access to the workspace used for initial feed discovery. If you configure it to allow only private access, the setting is ignored, and that workspace stays reachable from public routes. Our reading: assign the workspace definitions in audit first and see how that workspace is reported before you consider deny.
- Learn's setup article says you must re-register the Microsoft.DesktopVirtualization resource provider on each subscription that should use Private Link. Check the page's current status wording for Private Link before relying on it.

## Choosing the effect

| Effect | What it does (per Learn) | Fits in AVD when | Watch out for |
|---|---|---|---|
| Audit | Assesses compliance from the resource's own properties and reports it | You want a baseline of current host pools and workspaces | Nothing is blocked or fixed |
| Deny | Stops the create or update request | A rule is settled, for example a mandatory tag on new resources | Can block your own pipelines and portal deployments if they do not meet the rule |
| Modify | Alters the resource (tags, properties); remediation tasks apply it to existing resources | Adding a missing tag, or changing the public access setting | A modify that disables public network access can cut off connections. Our reading: schedule it like a change |
| DeployIfNotExists | Deploys a template after a resource is created or updated, if a related resource is missing | Creating private endpoints or private DNS zone links | Needs a managed identity with roles; the template runs under that identity |

The evaluation order on a create or update request is: disabled, append and modify, deny, audit, manual, auditIfNotExists, then denyAction. deployIfNotExists and auditIfNotExists run after the resource provider returns a success code. Learn calls the combined result of layered policies "cumulative most restrictive", and says each assignment is evaluated individually.

## Roll out a policy in six steps

The order below follows Learn's guidance on evaluating the impact of a new policy definition and its assignment article.

1. **Choose the scope and name the owner.** Learn says resources must be within the resource hierarchy of the definition location, and that the location is typically a management group near the root when many subscriptions are covered. Assign at a subscription or resource group that holds only AVD resources first, for example a test resource group.
2. **Assign without enforcement.** Set enforcement mode to `DoNotEnforce`, or use an audit effect. Learn says DoNotEnforce evaluates compliance without enforcing the effect or writing deny entries to the Activity log.
3. **Add a non-compliance message.** The optional `nonComplianceMessages` property shows a custom explanation in addition to the default error, so an engineer who is blocked sees why. Learn says this is supported for Resource Manager mode definitions.
4. **Read the compliance results.** Create or update a few resources that match the definition and confirm that the audit or auditIfNotExists effect fires as expected. If you change the definition during testing, Learn recommends starting the validation over.
5. **Widen the scope, then enforce.** Learn recommends continuing the gradual rollout until the assignment covers the full intended scope. Only then switch to `Default` enforcement or a deny effect.
6. **Remediate existing resources.** For modify and deployIfNotExists, Learn says non-compliant resources are brought into compliance by remediation tasks, which use the managed identity of the assignment.

### The managed identity for modify and deployIfNotExists

Learn says an assignment with a modify or deployIfNotExists effect must have an identity, and that the identity needs the minimum Azure RBAC role required to remediate. In the portal, Azure Policy grants the listed roles when the assignment starts. With an SDK you must grant the roles yourself, and also when the modified resource lies outside the assignment scope. An assignment can have only one managed identity, and one remediation task handles one modify or deployIfNotExists policy at a time. In the portal, the "Create a remediation task" option at assignment time is supported for policies assigned on a subscription. For a management group assignment, create the task from the Remediation or Compliance page after evaluation.

## Exclusions and exemptions

Both keep a resource out of a policy, but they behave differently in reports.

| | Exclusion (`notScopes`) | Exemption |
|---|---|---|
| Where it is set | On the assignment object | A separate Resource Manager object on the resource or hierarchy |
| In compliance reports | Not evaluated or counted | Shown as Exempt, with a substate |
| Typical use per Learn | Permanent bypass for a broad scope such as a test environment | Time-bound or specific cases that should still be tracked |
| Expiry | None | Optional `expiresOn`; the object is kept but no longer honored |

Learn defines two exemption categories: Waiver (non-compliance is temporarily accepted) and Mitigated (the intent is met another way). Creating an exemption needs the `Microsoft.Authorization/policyExemptions/write` operation plus the `exempt/Action` verb on the target assignment.

Example: a legacy pooled host pool in a resource group named `rg-avd-legacy` still allows public access while a Private Link migration runs. Give it a waiver exemption for the host pool definition with an `expiresOn` date at the end of the migration window. Compliance reports show the pool as Exempt, and the exemption lapses without anyone having to remember it.

## Tags and cost allocation

Learn's tag policy article lists 17 built-in tag policies, among them "Inherit a tag from the resource group if missing" (modify) and "Require a tag and its value on resources" (deny). The "if missing" variant does not change a tag that exists with a different value, while the plain inherit policy adds or replaces it. Append policies do not touch resources created before the assignment; the article points to the modify policies for existing resources. Not every resource type supports tags, so check Learn's tag support list for the AVD resource types you care about. A Cloud Adoption Framework article for AVD landing zones, which Learn marks as deprecated, suggested tagging host pools and virtual machines to identify AVD compute cost and using built-in definitions for tagging rules and diagnostic settings.

## Reading compliance with the security baseline

Learn's Azure security baseline for AVD (control AM-2) says to use Microsoft Defender for Cloud to configure Azure Policy to audit and enforce configurations, and to use the deny and deploy-if-not-exists effects for secure configuration. It says Azure Policy definitions appear in the Regulatory Compliance section of the Microsoft Defender for Cloud page, and that some recommendations may need a paid Defender plan. A notice on that page says it is based on version 1.0 of the Microsoft cloud security benchmark and may contain outdated guidance.

## When something is blocked

Learn's AVD troubleshooting article for host pool creation advises reviewing errors in the deployment through the deployment operations in Azure Resource Manager and, if there are none, the activity log. Our reading: for a denial, check the scope of the assignment and its non-compliance message first, and ask the policy owner for an exemption instead of weakening the assignment.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Azure Policy built-in policy definitions (Desktop Virtualization section)](https://learn.microsoft.com/en-us/azure/governance/policy/samples/built-in-policies)
- [Microsoft Learn: Overview of Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/overview)
- [Microsoft Learn: Azure Policy definitions effect basics](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-basics)
- [Microsoft Learn: Remediate non-compliant resources with Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources)
- [Microsoft Learn: Azure Policy assignment structure](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/assignment-structure)
- [Microsoft Learn: Azure Policy exemption structure](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/exemption-structure)
- [Microsoft Learn: Understand scope in Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/scope)
- [Microsoft Learn: Evaluate the impact of a new Azure Policy definition](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/evaluate-impact)
- [Microsoft Learn: Use tags to organize your Azure resources (tag policies)](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-policies)
- [Microsoft Learn: Understand Azure Policy machine configuration](https://learn.microsoft.com/en-us/azure/governance/machine-configuration/overview)
- [Microsoft Learn: Azure Private Link with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/private-link-overview)
- [Microsoft Learn: Set up Private Link with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/private-link-setup)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop host pool creation](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-set-up-issues)
- [Microsoft Learn: Azure security baseline for Azure Virtual Desktop](https://learn.microsoft.com/en-us/security/benchmark/azure/baselines/azure-virtual-desktop-security-baseline)
- [Microsoft Learn: Security, governance, and compliance for Azure Virtual Desktop infrastructure (Cloud Adoption Framework, deprecated)](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/azure-virtual-desktop/eslz-security-governance-and-compliance)
