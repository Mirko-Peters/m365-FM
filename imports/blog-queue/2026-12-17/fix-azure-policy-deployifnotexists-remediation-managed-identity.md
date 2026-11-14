---
title: "Fix Azure Policy DeployIfNotExists Remediation Failures and Managed Identity Permission Problems"
summary: "Check the managed identity, roleDefinitionIds, evaluation timing and remediation task settings when an Azure Policy deployIfNotExists remediation fails, using the order and limits that Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [azure-policy, azure-rbac, azure-resource-manager, azure-policy-initiative]
keypoints:
  - "A deployIfNotExists remediation deploys with the assignment's managed identity. If that identity lacks a role, the deployment fails."
  - "Built-in definitions prepopulate roleDefinitionIds. Custom definitions need the full role ID, not the role name."
  - "Changing roleDefinitionIds later does not update the assignment, so the new role must be granted by hand."
  - "A remediation task handles one policy per task, 500 resources by default, 10 parallel deployments and a 100 percent failure threshold."
  - "Evaluation alone never deploys anything. New or updated resources trigger a deployment after the evaluation delay, and existing resources need a remediation task."
faq:
  - q: "Which identity does a remediation task use?"
    a: "According to Microsoft Learn, Azure Policy uses the managed identity of the policy assignment to deploy or modify resources. Policy evaluation, including the existence condition, uses the identity of the caller that started the API request, not the assignment identity."
  - q: "Why did my remediation fail after I changed the policy definition?"
    a: "Microsoft Learn says changing a policy definition does not automatically update the assignment or its managed identity. If the roleDefinitionIds change, the new permissions must be granted manually, even in the portal."
  - q: "How many resources can one remediation task handle?"
    a: "Per the Microsoft Learn remediation task structure page, resourceCount defaults to 500 with a maximum of 50,000, parallelDeployments defaults to 10 with a range of 1 to 30, and failureThreshold defaults to 100 percent. Learn says these settings cannot be changed after the task begins."
  - q: "How long does it take before a new assignment shows compliance results?"
    a: "Microsoft Learn says a new or updated assignment takes about five minutes to apply to the scope before evaluation starts. A resource that is deployed or updated is evaluated in about 15 minutes, and all assignments are reevaluated once every 24 hours."
  - q: "Can a deployIfNotExists template use linked templates?"
    a: "No. The Learn page on the deployIfNotExists effect says nested templates are supported but linked templates are currently not supported."
---

Most failed deployIfNotExists remediations come down to one of four causes: the managed identity of the assignment lacks a role, the role list in the definition is wrong or outdated, the policy was evaluated too early or too late, or the task settings stop work early. Check them in that order. Microsoft Learn describes each of these, and this article follows its wording.

## Know which identity does what

Learn separates two identities. Azure Policy uses the managed identity of the assignment to deploy or modify resources. Policy evaluation, including the existence condition, uses the identity of the caller that initiated the API request. A missing role on the assignment identity therefore breaks the deployment but not the compliance result.

Each assignment has only one managed identity, which can hold several roles. The identity location does not affect how it works with Azure Policy.

## Step 1: Check the managed identity and its roles

Open **Policy** > **Assignments** and select the assignment. On the **Remediation** tab, check **Types of Managed Identity**:

- **System assigned managed identity**: you set only the location. The scope is inherited from the assignment.
- **User assigned managed identity**: you choose the scope that hosts the identity and then an existing identity. Learn says it does not need to match the assignment scope but must be in the same tenant.

In the portal, roles are granted automatically when the identity is created. Learn lists the cases where you must grant them manually:

- The assignment was created through an SDK.
- A resource modified by the policy is outside the assignment scope.
- The template accesses properties on resources outside the assignment scope.

To grant a role by hand:

1. Open **Policy** > **Assignments**, select the assignment and copy the last segment of the **Assignment ID**. That is the identity name.
2. Go to the target resource or its parent, such as the resource group, subscription or management group.
3. Select **Access control (IAM)** > **+ Add role assignment**.
4. Choose a role that matches an entry in `roleDefinitionIds`.
5. Leave **Assign access to** at the default, search for the copied name, select the object and select **Save**.

Learn asks you to keep the permissions to the smallest possible set. Do not assign Owner just to make a task pass.

## Step 2: Check roleDefinitionIds in the definition

For built-in definitions, the required roles are prepopulated. For custom definitions, add a `roleDefinitionIds` array under `details`. The property requires the full resource identifier, not the short role name. To find an ID, run `az role definition list --name "Contributor"`.

The array is required for deployIfNotExists. If you edit it later, grant the new role to the existing identity by hand. This is the usual reason for a remediation that worked once and then failed.

## Step 3: Read the evaluation and deployment settings

The Learn page on the effect gives these rules:

- The deployment runs after a configurable delay when a resource provider handles a create or update request and returns success.
- A template deployment occurs if there are no related resources, or if none satisfies `existenceCondition`.
- During an evaluation cycle, matching resources are marked non-compliant, but no action is taken. Existing resources need a remediation task.

Properties worth checking when nothing deploys:

| Property | Default | Note |
|---|---|---|
| `evaluationDelay` | `PT10M` | Allows `AfterProvisioning`, `AfterProvisioningSuccess`, `AfterProvisioningFailure` or an ISO 8601 duration of 0 to 360 minutes |
| `existenceScope` | `ResourceGroup` | `Subscription` needs the assignment at subscription scope or higher |
| `deploymentScope` | `ResourceGroup` | A subscription-level deployment needs a `location` in the deployment |
| `existenceCondition` | none | If omitted, any related resource of the type satisfies the effect |

Learn warns that a long evaluation delay can leave the recorded compliance state outdated until the next evaluation trigger. In the `deployment` property, nested deployments should use unique names to avoid contention between evaluations, and linked templates are not supported.

Template functions can also cause trouble. Learn says functions such as `parameter()` or `resourceGroup()` can be processed by Resource Manager as part of the deployment instead of the policy. Escape the string with an extra bracket, for example `[[resourceGroup().tags.myTag]`.

## Step 4: Create the remediation task and read its result

In the portal, select **Policy** > **Remediation**. The **Policies to remediate** tab lists the deployIfNotExists and modify assignments. You can also select **Compliance**, pick a non-compliant assignment and select **Create Remediation Task**.

If the source is an initiative, pick one policy. Only one deployIfNotExists or modify policy can be remediated per task. Use **Scope** and **Locations** to narrow the target, then select **Remediate**.

To find the cause of a failure:

1. Open the **Remediation tasks** tab and select the task.
2. Right-click a resource to open the deployment or the resource.
3. Select **Related events** at the end of the row for details such as an error message.
4. Check the assignment's **Deployed Resources** tab for what was created.

The Learn remediation structure page lists these task settings:

| Setting | Default | Limit |
|---|---|---|
| `resourceCount` | 500 | maximum 50,000 |
| `parallelDeployments` | 10 | 1 to 30 |
| `failureThreshold` | 100% | 0 to 100 |
| Discovery mode | `ExistingNonCompliant` | or `ReEvaluateCompliance` |

At the default threshold the task keeps going even when resources fail, so read the deployment summary counts and do not rely on the task state alone. Learn also says up to 100 remediation tasks can run in parallel for one policy definition, and that remediation task resources are deleted 60 days after their last modification.

## Step 5: Refresh the compliance data

If a result looks stale, wait for the documented timing: about five minutes for a new or updated assignment, about 15 minutes for a deployed or updated resource, and a full cycle every 24 hours. For a manual scan, Learn lists `az policy state trigger-scan --resource-group "resourceGroupName"` and `Start-AzPolicyComplianceScan -ResourceGroupName 'resourceGroupName'`. Not all resource providers support on-demand scans.

## Typical mistakes

- Creating the assignment through an SDK and never granting the roles.
- Using a role name instead of the full role definition ID.
- Editing `roleDefinitionIds` without updating the role assignments.
- Expecting a deployment from evaluation alone.
- Keeping the failure threshold at 100 percent and assuming the task succeeded.

## What the sources do not say

The pages read for this article do not list a key vault specific permission set. They also give no further failure detail than the related events, deployment links and the deployment summary counts. For a failing template, the error text in the linked deployment is the place to look.

## Related

- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure Policy initiative](https://www.m365.fm/entity/azure-policy-initiative/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)

## Sources

- [Remediate non-compliant resources with Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/remediate-resources)
- [Azure Policy definitions deployIfNotExists effect](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/effect-deploy-if-not-exists)
- [Azure Policy remediation task structure](https://learn.microsoft.com/en-us/azure/governance/policy/concepts/remediation-structure)
- [Get compliance data of Azure resources](https://learn.microsoft.com/en-us/azure/governance/policy/how-to/get-compliance-data)
- [Troubleshoot errors with using Azure Policy](https://learn.microsoft.com/en-us/azure/governance/policy/troubleshoot/general)
