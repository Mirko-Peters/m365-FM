---
title: "Enforce Compliance on Non-Azure Servers With Azure Arc and Machine Configuration Policies"
summary: "How machine configuration audits and enforces OS settings on Arc-enabled servers through Azure Policy: audit first, choose between Audit, Apply and Monitor and Apply and Autocorrect, create remediation tasks and read compliance."
status: review
publish: false
author: mirko-p
date: 2026-12-18
topics: [azure-arc, azure-policy, azure-connected-machine-agent, azure-policy-initiative]
keypoints:
  - "Machine configuration audits or configures operating system settings as code for Azure machines and hybrid Arc-enabled machines, orchestrated at scale with Azure Policy."
  - "Arc servers get the machine configuration component and a system-assigned identity through the Connected Machine agent. Learn says not to install the Azure VM extension on them."
  - "Three modes exist: Audit, Apply and Monitor, and Apply and Autocorrect. Learn advises assigning in audit mode first."
  - "Applying configuration packages needs Arc agent 1.10.0 or later. Up to 50 guest assignments are supported per machine."
  - "With Apply and Autocorrect there is no way to report when a drift was automatically corrected."
faq:
  - q: "What does machine configuration do on Arc-enabled servers?"
    a: "According to Microsoft Learn, Azure Policy's machine configuration feature audits or configures operating system settings as code for machines running in Azure and hybrid Arc-enabled machines. You can use it per machine or orchestrate it at scale with Azure Policy."
  - q: "What do I need to deploy on an Arc server?"
    a: "Microsoft Learn training content says Azure VMs need the machine configuration VM extension and a system-assigned managed identity. Arc-enabled servers receive both the machine configuration component and the identity through the Connected Machine agent, and Learn says not to install the Azure VM extension separately on them. Instead, verify onboarding, agent health, supported versions and connectivity. Applying packages needs Arc agent 1.10.0 or later."
  - q: "What is the difference between the three modes?"
    a: "Microsoft Learn says Audit only reports. Apply and Monitor applies the configuration once and then monitors it, with no automatic correction of drift unless remediation is triggered. Apply and Autocorrect applies it and corrects drift at the next evaluation."
  - q: "How do I trigger remediation for existing non-compliant servers?"
    a: "Microsoft Learn says the Remediation tab of a policy assignment has a Create a remediation task checkbox. Remediation tasks correct resources that evaluate to NonCompliant after the assignment is created. With Apply and Autocorrect, the task needs to run only once per existing noncompliant machine."
  - q: "Are there limits on assignments per machine?"
    a: "Yes. Microsoft Learn states that machine configuration currently supports the creation of up to 50 guest assignments per machine. It also lists supported operating systems, and notes that ARM64 is not supported on Azure VMs."
---

Machine configuration lets Azure Policy check, and optionally change, operating system settings on servers outside Azure once they are Azure Arc-enabled. The safe sequence is the one Microsoft Learn recommends: assign in audit mode, review which machines are noncompliant, and only then choose a mode that applies settings. This article covers what to prepare, how the modes differ and how to read the results.

## What it is

Learn describes machine configuration as a native capability to audit or configure operating system settings as code for Azure machines and hybrid Arc-enabled machines. Configurations are extension resources, and Azure Policy assigns them dynamically. Settings can cover the operating system, application configuration or presence, and environment settings.

Two scenarios are named. Configuration management describes a whole server as code. Compliance audits or deploys settings to all machines in scope, for example requiring TLS 1.2 on every server.

## Step 1: Check the prerequisites

- **Arc enrollment.** The Learn training unit says the machine configuration agent evaluates settings against a built-in baseline or a custom configuration, and that the machine's system-assigned managed identity authenticates it to the service. Arc-enabled servers get the component and the identity through the Connected Machine agent, and Learn says not to install the Azure VM extension separately on them.
- **Agent version.** Applying configuration packages requires Arc agent 1.10.0 or later, or guest configuration extension 1.26.24 or later on Azure VMs.
- **Operating system.** Learn lists Windows Server 2012 to 2025 and Windows 10 and 11, plus several Linux distributions. For Arc, it points to the supported server editions on Azure Arc. Starting in November 2026, Linux versions older than the listed ones must be upgraded to use PowerShell-based configurations with new agent versions.
- **Deploy the prerequisites at scale.** For Azure VMs, assign the initiative **Deploy prerequisites to enable guest configuration policies on virtual machines**. For Arc servers, the training unit says to verify onboarding, agent health, supported versions and connectivity instead.
- **Limit.** Up to 50 guest assignments per machine.

The pages read do not list outbound endpoints or proxy requirements for the extension.

## Step 2: Assign a policy in audit mode

In the Azure portal, search for **Policy**, expand **Authoring**, select **Assignments** and then **Assign policy**. Pick a scope, a management group or subscription, and choose a policy definition in the Guest Configuration category. When a policy is assigned to an existing machine, Learn says a guest assignment is created first in Audit mode, and the results show which machines need remediation.

Existing resources that do not comply appear as Non-compliant on the **Compliance** page. The Arc tutorial does not say how long reporting takes. The training unit adds that the OS-specific audit baseline policies default the `IncludeArcMachines` parameter to `false`, and that including Arc servers means reviewing and acknowledging the applicable charges.

## Step 3: Choose the enforcement behavior

Learn lists three assignment types. The `assignmentType` property is case sensitive, and the pages vary in casing, so check the exact value for your API version.

| Mode | Behavior |
|---|---|
| Audit | Reports the state and makes no changes |
| Apply and Monitor | Applied once, then monitored. Drift is reported as NonCompliant but not corrected unless remediation is triggered |
| Apply and Autocorrect | Applied, and the local service corrects drift at the next evaluation |

Details worth knowing:

- With Apply and Monitor, status is Compliant unless an error occurs or the machine is not in the desired state at the next evaluation.
- With Apply and Autocorrect the machine always reports Compliant unless an error occurs. Learn says there is no way to report when a drift was automatically corrected.
- Custom definitions use `AuditIfNotExists` for audit and `DeployIfNotExists` for settings that change machines.
- The training unit advises starting with audit findings and reviewing application impact before piloting any configuration that changes settings.
- The training unit also says the built-in Windows and Linux security baseline definitions support only `AuditIfNotExists` and `Disabled`, so you cannot turn them into enforcement policies by changing an assignment setting. Applying settings needs a custom package and a policy that deploys its guest assignment.

## Step 4: Understand enforcement mode and remediation

Each assignment also has an **Enforcement Mode**. When Enabled, the default, the configuration is applied when a machine is deployed or updated in Azure Resource Manager, for example a tag change. Changes inside the machine do not trigger remediation unless they also change the machine resource. When Disabled, the assignment audits until a remediation task changes the behavior. The training unit names the property values `Default` and `DoNotEnforce` instead and says they control policy-effect enforcement, not the guest assignment type. Learn does not reconcile the naming.

For existing machines, use the **Remediation** tab of the assignment and select **Create a remediation task**. Tasks correct resources that evaluate to NonCompliant after the assignment is created. You can also trigger remediation outside Azure Policy by updating a guest assignment resource. Learn says the machine configuration service requests the list of assignments every 5 minutes and applies a configuration whose complianceStatus is Pending when its mode is an apply mode.

To disable remediation for custom content packages only, add the machine tag `CustomGuestConfigurationSetPolicy` with the value `disable`.

## Step 5: Read the compliance data

Per-setting results appear on the **Guest assignments** page. If an Azure Policy assignment orchestrated the configuration, open **Compliance details** and select **Last evaluated resource**. Policy uses the `complianceStatus` property of the guest assignment resource, of type `Microsoft.GuestConfiguration/guestConfigurationAssignments`.

Two behaviors to expect:

- A custom policy's `assignmentType` can temporarily show as Null, which Learn says typically resolves within one hour.
- Deleting a policy assignment deletes the machine configuration assignment it created. If you remove a policy from an initiative, delete the assignments manually. Deleting the Arc machine also deletes manual assignments.

## Typical mistakes

- Starting in an applying mode without reviewing audit results.
- Expecting changes made inside the machine to trigger remediation.
- Using an old Linux version with PowerShell-based configurations after November 2026.
- Forgetting the 50 assignment limit when stacking baselines.
- Assuming Apply and Monitor corrects drift on its own.

## What the sources do not say

The pages read do not describe the evaluation interval, outbound network requirements, the amount of the charges for Arc servers (the training unit only mentions that charges apply), or the possible values of `complianceStatus`. The Arc tutorial uses a Defender for servers policy as its example and not a machine configuration baseline.

## Related

- [Azure Arc](https://www.m365.fm/entity/azure-arc/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure Connected Machine agent](https://www.m365.fm/entity/azure-connected-machine-agent/)
- [Azure Policy initiative](https://www.m365.fm/entity/azure-policy-initiative/)

## Sources

- [What is Azure Machine Configuration?](https://learn.microsoft.com/en-us/azure/governance/machine-configuration/overview/01-overview-concepts)
- [Remediation options for machine configuration](https://learn.microsoft.com/en-us/azure/governance/machine-configuration/concepts/remediation-options)
- [Understand machine configuration assignment resources](https://learn.microsoft.com/en-us/azure/governance/machine-configuration/concepts/assignments)
- [Explore Azure Machine Configuration extension capabilities and modes](https://learn.microsoft.com/en-us/training/modules/enforce-vm-security-machine-configuration/2-explore-machine-configuration-capabilities)
- [Tutorial - New policy assignment with Azure portal](https://learn.microsoft.com/en-us/azure/azure-arc/servers/tutorial-assign-policy-portal)
