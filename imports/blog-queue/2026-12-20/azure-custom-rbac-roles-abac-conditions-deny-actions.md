---
title: "Azure Custom RBAC Roles With ABAC Conditions: What Conditions and Deny Actions Can and Cannot Do"
summary: "How to build a custom Azure RBAC role, add ABAC role assignment conditions, and restrict actions with NotActions, based on Microsoft Learn, including why you cannot create your own deny assignments and why conditions cannot deny."
status: review
publish: false
author: mirko-p
date: 2026-12-20
topics: [azure-rbac, azure-policy, azure-management-group]
keypoints:
  - "A custom role lists Actions, NotActions, DataActions, NotDataActions and AssignableScopes. Custom roles with DataActions cannot be assigned at management group scope."
  - "NotActions only subtracts from wildcard Actions in the same role. Learn says it is not a deny rule, because a second role that grants the action still allows it."
  - "ABAC conditions are added to role assignments, not role definitions. They filter permissions down and, per Learn, cannot explicitly deny access to specific resources."
  - "Learn says you cannot create your own deny assignments. Azure creates them, for example through deployment stack deny settings."
  - "The Learn overview says conditions can be added to role assignments with blob or queue storage data actions. Check the current page for other services."
faq:
  - q: "Can an Azure ABAC condition deny access?"
    a: "No. Learn says you cannot explicitly deny access to specific resources using conditions. A condition is an extra check on a role assignment that filters down the permissions granted by the role definition and assignment."
  - q: "Can I create my own deny assignment in Azure?"
    a: "Not directly. Learn says deny assignments are created and managed by Azure, and you cannot create your own. You can specify deny settings when creating a deployment stack, which creates a deny assignment owned by the stack."
  - q: "Does NotActions work as a deny?"
    a: "No. Learn states NotActions is not a deny rule. If another role assigned to the same user grants the excluded action, the user is allowed to perform it. NotActions only subtracts actions from the wildcard Actions of the same role."
  - q: "Where do I add a condition?"
    a: "Conditions are added to a role assignment at the same scope as the assignment, using the Azure portal condition editor, PowerShell, CLI or REST. You need Microsoft.Authorization/roleAssignments/write permission, as for any role assignment."
  - q: "Why can I not assign my custom data role at a management group?"
    a: "Learn says custom roles with DataActions cannot be assigned at management group scope. You can still list one management group in AssignableScopes and assign the role at the scope of subscriptions in that group."
---

Azure gives you three separate tools that people often mix up: custom role definitions, role assignment conditions (ABAC) and deny assignments. A custom role defines what is allowed, a condition narrows what an assignment allows, and a deny assignment blocks actions, but Microsoft Learn says you cannot create deny assignments yourself. This article follows the Learn pages on custom roles, role definitions, ABAC conditions and deny assignments, and says plainly where they stop.

## Step 1: Build the custom role

Learn's basic steps are to determine the permissions, decide how to create the role (Azure portal, PowerShell, CLI or REST API), create it, and test it. Learn suggests starting from an existing built-in role and modifying it.

Properties you set (from the custom roles page):

| Property | Notes from Learn |
|---|---|
| Name | Must be unique within the Microsoft Entra tenant. Recommended maximum 256 characters, maximum 512. |
| Description | Required. Recommended maximum 512 characters, maximum 2,048. |
| Actions | Control plane actions the role allows. |
| NotActions | Control plane actions excluded from the allowed Actions. |
| DataActions | Data plane actions the role allows. |
| NotDataActions | Data plane actions excluded from the allowed DataActions. |
| AssignableScopes | Scopes where the role can be assigned. Maximum 2,000. |

Rules and limits listed by Learn:

- Each tenant can have up to 5,000 custom roles (2,000 in Microsoft Azure operated by 21Vianet).
- You cannot set AssignableScopes to the root scope, and you cannot use wildcards in AssignableScopes.
- You can have only one wildcard in an action string.
- You can define only one management group in AssignableScopes.
- Custom roles with DataActions cannot be assigned at management group scope. You can assign them at the scope of subscriptions within the management group.
- Learn recommends listing Actions and DataActions explicitly instead of using wildcards, because future actions could grant unwanted access.
- Before you delete a custom role, remove its role assignments, including eligible assignments in Privileged Identity Management. Otherwise you get the error `RoleDefinitionHasAssignments`.

To create or update a role you need `Microsoft.Authorization/roleDefinitions/write` on all of its AssignableScopes. Learn names Owners and User Access Administrators as examples.

## Step 2: Understand what NotActions does

The role definitions page says NotActions subtracts excluded actions from the allowed Actions that have a wildcard. Actions minus NotActions gives the effective control plane permissions. Learn's example: `Microsoft.CostManagement/exports/*` with `Microsoft.CostManagement/exports/delete` in NotActions allows action, read, write and run, but not delete. The same holds for DataActions and NotDataActions.

The important note: **NotActions is not a deny rule.** If a user has one role that excludes an action and a second role that grants it, the user can perform the action. For a real block, you would need a deny assignment, which is the next section.

## Step 3: Add an ABAC condition to a role assignment

Learn describes a role assignment condition as an additional check on a role assignment. It filters down the permissions granted by the role definition and assignment. Its example is read access to a blob only if the blob has a certain tag.

What the overview page states:

- Conditions are added to built-in or custom **role assignments**, at the same scope as the assignment.
- Currently, conditions can be added to role assignments that have blob storage or queue storage data actions. The page was last updated in 2025, so check Learn for newer service support.
- Attributes listed for blob storage include account name, blob index tags, blob path, blob prefix, container name, encryption scope name, is current version, is hierarchical namespace enabled, is private link, snapshot, UTC now and version ID.
- You need `Microsoft.Authorization/roleAssignments/write` to add a condition.
- A condition expression has the form attribute, operator, value. The visual editor allows up to five expressions per condition, and the code editor allows more.
- Conditions can also be added to eligible role assignments in Microsoft Entra Privileged Identity Management.
- Feature status in Learn's table: environment attributes in conditions GA (April 2024), portal condition editor GA (October 2022), PowerShell, CLI and REST GA (October 2022), custom security attributes on a principal GA (November 2023).
- Known issue: with PIM and custom security attributes, **Principal** does not appear in **Attribute source** when adding a condition.

Learn says there is a benefit beyond precision: conditions can reduce the number of role assignments, since each subscription has a role assignment limit.

## Step 4: Know the deny limits

Two statements from Learn decide what you can build:

1. Conditions cannot explicitly deny access to specific resources.
2. You cannot directly create your own deny assignments. Deny assignments are created and managed by Azure. You can specify deny settings when you create a deployment stack, which creates a deny assignment that the deployment stack owns.

Deny assignments differ from role assignments: they deny access, can exclude principals, can prevent inheritance to child scopes and apply to classic subscription administrator assignments. A deny assignment can use the special All Principals principal (zero GUID, type SystemDefined) combined with excluded principals to deny everyone except some users. Learn's PowerShell example shows a deployment stack deny assignment with `*/delete` in Actions and an excluded user.

To see existing deny assignments in the portal, open the scope, select **Access control (IAM)** and then the **Deny assignments** tab. In PowerShell, use `Get-AzDenyAssignment`. You need `Microsoft.Authorization/denyAssignments/read`.

## A practical combination (author's suggestion)

This is an interpretation, not a Learn procedure:

1. Build the custom role with explicit Actions or DataActions and a narrow AssignableScopes.
2. If your use case is covered by the documented condition services, add the condition on the assignment instead of creating many roles.
3. Use deployment stack deny settings for protecting managed resources against deletion, since that is the documented way to get a deny assignment.
4. Test with a user that has only the role under test, and check that no second role grants the excluded action.

## What the documentation does not say

The pages read do not describe a way to write conditions that deny, and they do not describe creating deny assignments for arbitrary actions outside deployment stacks. They also do not provide a complete current list of services that support conditions beyond what the overview states. For Key Vault data plane access, none of the pages read mention ABAC.

## Related

- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Azure Policy](https://www.m365.fm/entity/azure-policy/)
- [Azure management group](https://www.m365.fm/entity/azure-management-group/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)

## Sources

- [Azure custom roles (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/role-based-access-control/custom-roles)
- [Understand Azure role definitions (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/role-based-access-control/role-definitions)
- [What is Azure attribute-based access control (Azure ABAC)? (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/role-based-access-control/conditions-overview)
- [List Azure deny assignments (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments)
