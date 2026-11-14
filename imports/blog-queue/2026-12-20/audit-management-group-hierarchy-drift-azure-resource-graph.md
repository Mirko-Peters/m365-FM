---
title: "Audit Management Group Hierarchy Drift and Policy Compliance with Azure Resource Graph Queries"
summary: "Use the Azure Resource Graph tables ResourceContainers and PolicyResources to list the management group hierarchy, find subscriptions in the wrong place and track compliance and exemptions, with the Learn sample queries and their limits."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [azure-management-group, azure-resource-graph, azure-policy]
keypoints:
  - "Learn's Resource Graph samples read the management group hierarchy from the ResourceContainers table, using the managementGroupAncestorsChain property of subscriptions and management groups."
  - "Policy compliance and exemptions are queryable from the PolicyResources table, including exemptions that expire within 90 days."
  - "Drift detection is not a built-in report. Save query results on a schedule and compare snapshots. This is the author's approach, not a Learn procedure."
  - "Management group limits from Learn: 10,000 management groups per directory, six levels of depth, and one parent per management group or subscription."
  - "Resource Manager caches hierarchy details for up to 30 minutes, so a just-moved subscription may not show immediately."
faq:
  - q: "Which Resource Graph table holds the management group hierarchy?"
    a: "Learn's sample queries for management groups use the ResourceContainers table. Management groups have the type microsoft.management/managementgroups, and subscriptions have the type microsoft.resources/subscriptions with a managementGroupAncestorsChain property."
  - q: "How do I query a specific management group?"
    a: "The Learn samples set the query scope to the management group. With Azure CLI, the samples use the management-groups parameter. With Azure PowerShell they use the ManagementGroup parameter, or UseTenantScope for the whole tenant."
  - q: "Where can I see policy exemptions that are about to expire?"
    a: "Learn includes a PolicyResources sample that lists policy exemptions expiring within 90 days, with the exemption name, display name and expiration date."
  - q: "What are the hierarchy limits for management groups?"
    a: "According to Learn, a single directory supports 10,000 management groups, a tree supports up to six levels of depth, not counting the root or subscription level, and each management group and subscription has only one parent."
  - q: "Why does the portal not show a move I just made?"
    a: "Learn says Azure Resource Manager caches details of the management group hierarchy for up to 30 minutes, so the Azure portal might not immediately show a moved management group."
---

Hierarchy drift means that subscriptions or management groups are no longer where your design says they should be, or that the policies and exemptions on them have changed. Azure Resource Graph is the tool Microsoft Learn shows for querying both. The ResourceContainers table describes management groups and subscriptions, and the PolicyResources table describes policy assignments, compliance states and exemptions. Learn gives sample queries for these. It does not provide a built-in drift report, so a repeatable audit means saving results and comparing them yourself.

## What to audit

From the management group overview, the structure has these rules:

- A single directory can support 10,000 management groups.
- A tree can have up to six levels of depth, not counting the root or subscription level.
- Each management group and subscription can have only one parent.
- Each directory has one root management group. By default its display name is Tenant root group and its ID equals the Microsoft Entra tenant ID. New subscriptions land there by default.

Learn also warns that any user access or policy assignment on the root management group applies to all resources in the directory, and that such assignments should be "must have" only at this scope. That makes root-level assignments a good first audit target.

## Step 1: Export the hierarchy

Learn lists sample queries on the ResourceContainers table. The first counts subscriptions per management group:

```kusto
ResourceContainers
| where type =~ 'microsoft.management/managementgroups'
| project mgname = name
| join kind=leftouter (resourcecontainers | where type=~ 'microsoft.resources/subscriptions'
| extend mgParent = properties.managementGroupAncestorsChain | project id, mgname = tostring(mgParent[0].name)) on mgname
| summarize count() by mgname
```

The other samples read the ancestor chain:

- For a management group, `properties.details.managementGroupAncestorsChain` is expanded with `mv-expand` and an index to show each level. The scope in the sample is set to a management group named Application.
- For a subscription, `properties.managementGroupAncestorsChain` is expanded the same way and the scope is a subscription.
- To list all subscriptions under a management group, the sample queries `microsoft.resources/subscriptions` with the scope set to that management group.

Learn shows how to set the scope for each tool. With Azure CLI, the samples use `--management-groups`. With Azure PowerShell they use `-ManagementGroup`, and `-UseTenantScope` to query the tenant.

## Step 2: Check compliance and exemptions

The Azure Policy sample page uses the PolicyResources table. Useful queries from Learn:

- **Compliance by policy assignment.** Shows state, percentage and counts per assignment, based on `Microsoft.PolicyInsights/PolicyStates`.
- **List all non-compliant resources.** Filters `properties.complianceState` to `NonCompliant`.
- **Compliance by state and location.** Counts resources per state and `resourceLocation`.
- **Compliance states for all policy assignments.** Includes assignments that have no resources in scope, which show as compliant. A note says that to mimic the portal behavior at a management group scope, you set the Authorization Scope Filter to `atScopeAndAbove`, otherwise `AtScopeAboveAndBelow`, to limit the number of results.
- **Policy exemptions per assignment**, and **exemptions that expire within 90 days**, using `microsoft.authorization/policyexemptions` and the `expiresOn` property.

Expiring exemptions are a natural drift signal. An exemption that quietly lapses changes the compliance picture without anyone editing a policy.

## Step 3: Compare over time (author's suggestion)

Resource Graph returns the current state. The pages read do not describe a history or a diff feature. A simple approach, which is the author's suggestion and not a Learn procedure:

1. Run the hierarchy and policy queries on a schedule, for example from Azure Automation or a pipeline.
2. Store the output in a dated file or table.
3. Compare the new run with the last approved baseline.
4. Review any subscription whose parent changed, any new root-level assignment and any exemption nearing expiry.

For changes that already happened, Learn says management groups are supported in Azure Monitor activity logs. You can see events such as role assignments or policy assignment changes on a management group. For management groups outside the portal, the target scope looks like `/providers/Microsoft.Management/managementGroups/{management-group-id}`. Learn also notes that diagnostic settings for a management group can be enabled through the Resource Manager REST API to send activity log entries to a Log Analytics workspace, a storage account or Event Hubs.

## Things that can confuse an audit

- **Cache delay.** Resource Manager caches hierarchy details for up to 30 minutes.
- **Role definitions and moves.** A custom role defined on one management group and assigned on a subscription blocks a move that would break the path between assignment and definition. Learn lists the options, such as removing the assignment before the move or changing the assignable scope. Learn also says only one management group can be in the assignable scopes of a new custom role.
- **Display name and ID.** Learn notes that custom role definitions must use the management group ID and not the display name.
- **Moves need permissions.** Moving a subscription needs write permissions on the child, the target parent and the current parent, with an exception when the root management group is involved.

## What the documentation does not say

The pages read do not describe an automatic baseline comparison, a drift alert in Azure Policy for hierarchy changes, or retention of past Resource Graph results. They also do not give a recommended audit frequency. Those choices are up to you.

## Related

- [Azure management groups](https://www.m365.fm/entity/azure-management-group/)
- [Azure Resource Graph](https://www.m365.fm/entity/azure-resource-graph/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)

## Sources

- [Azure Resource Graph sample queries for management groups (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/governance/management-groups/resource-graph-samples)
- [Azure Resource Graph sample queries for Azure Policy (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/governance/policy/samples/resource-graph-samples)
- [Organize your resources with management groups (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/governance/management-groups/overview)
