---
title: "Azure Policy Shows Non-Compliant Resources: Find the Cause With Compliance Details"
summary: "Find out why a resource is non-compliant in Azure Policy using Microsoft Learn: the portal path to View compliance details, how to read compliance reasons by policy mode, guest configuration results and the 14 day Change history preview."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [azure-policy, azure-resource-graph]
keypoints:
  - "Open Policy, select a Non-compliant policy, use the Resource compliance tab and choose View compliance details on the resource."
  - "The Compliance details pane shows the resource, the last evaluation time and a reason for each failed condition. You need read access to the resource type."
  - "Reasons depend on policy mode: Resource Manager conditions, Resource Provider reason codes or AKS Gatekeeper constraint template states."
  - "Guest configuration policies show per-setting results through the Last evaluated resource link and the Guest Assignment page."
  - "Change history is in preview. It shows the last 14 days of changes with a visual diff, and the changes might not relate to the compliance state."
faq:
  - q: "Where do I see why a resource is non-compliant?"
    a: "According to Microsoft Learn, in the Azure portal under Policy, open a non-compliant policy, go to Resource compliance, and choose View compliance details for the resource."
  - q: "What permission is needed to see the details?"
    a: "Read access to the resource type, because the pane shows current property values. For virtual machines that is Microsoft.Compute/virtualMachines/read. Secret values are shown as asterisks."
  - q: "What does a reason such as Current value must be equal to the target value mean?"
    a: "In Resource Manager mode each reason maps to a condition in the policy rule, for example equals or not notEquals. The pane shows the field, the current value and the expected value."
  - q: "How do I see when a change made a resource non-compliant?"
    a: "Use the Change History (preview) tab on the Resource Compliance page. It lists detected changes from the last 14 days with a before and after diff, but the changes might be unrelated to the compliance state."
  - q: "Does the page explain evaluation timing?"
    a: "No. The page shows the last evaluation timestamp but does not say how often evaluations run or what triggers them."
---

When Azure Policy reports a resource as non-compliant, the first question is which condition failed. Microsoft Learn describes two tools: the Compliance details pane and Change history. This guide follows that page.

## Open the compliance details

1. In the Azure portal, select All services, then search for and select Policy.
2. On the Overview or Compliance page, select a policy whose state is Non-compliant.
3. On the Resource compliance tab, right-click the resource, or use the ellipsis, and choose View compliance details.
4. Read the pane.

The pane shows the resource name, type, location and ID, the compliance state with the timestamp of the last evaluation for the assignment, and a list of reasons. If a resource fails for several reasons, each is listed. Learn's example shows the field Microsoft.Sql/servers/version as 12.0 while the policy expected 14.0.

You need read access to the resource type, for example Microsoft.Compute/virtualMachines/read, otherwise an access error appears. Secret values are shown as asterisks.

For auditIfNotExists and deployIfNotExists definitions, the pane also shows the details.type property, and Last evaluated resource is a related resource from the details section of the definition. It includes an evaluated resource count.

## Compliance reasons by mode

**Resource Manager mode.** Each reason maps to a condition in the policy rule, for example:

| Reason | Condition |
| --- | --- |
| Current value must be equal to the target value | equals or not notEquals |
| Current value must exist | exists |
| Current value must be in the target value | in or not notIn |
| Current value must be like the target value | like or not notLike |
| No related resources match the effect details | A related resource of the type in then.details.type does not exist |

**Resource Provider mode.** Reason codes on the page include NonModifiablePolicyAlias, ConflictingAppendPolicies (several assignments modify the same field), AppendPoliciesFieldsExist, MissingRegistrationForType (the subscription is not registered for the resource type), InvalidPolicyFieldPath and TooManyResourceNameSegments, among others.

**AKS Resource Provider mode.** Reasons relate to the Gatekeeper constraint template state, such as ConstraintTemplateConflicts, ConstraintStatusStale (an audit status older than an hour), ConstraintNotProcessed and InvalidConstraint/Template. A failed update leaves the existing template in place, so the cluster stays protected but reports as non-compliant until you fix the failure.

For Resource Provider modes, open the resource and its Component Compliance tab for component name, ID and type.

## Guest configuration

Follow the steps above, then select the Last evaluated resource link. The Guest Assignment page lists every evaluation inside the machine, and the Reason column shows why the assignment is non-compliant, including the current value of each setting. To see all guest assignments in the tenant, open the Guest Assignments page in the portal.

## Change history (preview)

Change history is in public preview and shows the last 14 days of changes for resources that support complete mode deletion. Open Policy, select a policy in any state, select a resource on the Resource compliance tab, then the Change History (preview) tab, and select a change to see the diff. The data comes from Azure Resource Graph. A detected change might not relate to the current compliance state.

## A practical order of checks

This order is a suggestion, not a Microsoft procedure.

1. Read the reason text and compare the current value with the target value.
2. Check whether the policy mode is Resource Manager or a Resource Provider mode, because the reason codes differ.
3. For guest configuration, open the Guest Assignment page for per-setting results.
4. Use Change History to see what changed recently, bearing in mind the 14 day window.

## Reading the pane with an example

Learn's example is a SQL server whose version field has the current value 12.0 while the policy expects 14.0. In that case the reason tells you three things: which field failed, what the resource has now and what the policy wanted. Fix the resource or adjust the policy, then wait for the next evaluation. If the pane lists more than one reason, each condition of the policy rule failed separately, so expect to fix all of them before the resource turns compliant.

For effects that look for related resources, the reason No related resources match the effect details in the policy definition means that a resource of the type in then.details.type, related to the resource in the if condition, does not exist. Learn's partial deployIfNotExists definition looks for Microsoft.Insights/metricAlerts with an existence condition on the alert name.

## Where to go next

Learn's next steps link pages on policy definition structure, policy effects, getting compliance data and remediating non-compliant resources.

## Not covered

The page does not mention the activity log, includes no Resource Graph, CLI or PowerShell queries, and does not explain how often evaluations run or what triggers them.

## Related

- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure Resource Graph](https://www.m365.fm/entity/azure-resource-graph/)

## Sources

- [Determine causes of non-compliance](https://learn.microsoft.com/azure/governance/policy/how-to/determine-non-compliance)
