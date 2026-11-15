---
title: "Create Management Groups and Organize Azure Subscriptions in the Portal"
summary: "Create an Azure management group in the portal, understand ID versus display name, the root management group, documented limits of 10,000 groups and six levels, how policy and RBAC inherit, and the rules for moving subscriptions."
status: review
publish: false
author: mirko-p
date: 2026-12-25
topics: [azure-management-group, azure-subscription]
keypoints:
  - "Portal path: All services > Management + governance > Management Groups > Add management group. The ID is not editable after creation and the display name can change at any time."
  - "A directory supports 10,000 management groups and a tree supports up to six levels of depth, not counting the root or subscription level."
  - "The first management group in a directory can take up to 15 minutes to complete. The creator gets an Owner role assignment on the new group."
  - "Policy and RBAC assignments on a management group inherit to children. Anything assigned on the root applies to all resources in the directory."
  - "Azure Resource Manager caches the hierarchy for up to 30 minutes, so the portal may not show a move immediately."
faq:
  - q: "How do I create a management group in the portal?"
    a: "According to Microsoft Learn, select All services > Management + governance > Management Groups, then Add management group, enter a Management Group ID and an optional display name, and select Save."
  - q: "Can I change the management group ID later?"
    a: "No. Learn says the ID is not editable after creation. The display name can be changed at any time."
  - q: "What are the hierarchy limits?"
    a: "The overview says a single directory can support 10,000 management groups and a tree can support up to six levels of depth, not including the root level or the subscription level. Each group or subscription supports only one parent."
  - q: "What happens to new subscriptions?"
    a: "Learn says new subscriptions automatically default to the root management group when they are created."
  - q: "Why does the portal not show my subscription move?"
    a: "Learn says Azure Resource Manager caches the hierarchy for up to 30 minutes, so the portal may not immediately reflect a move."
---

Management groups are containers above subscriptions where you apply access and policy once. You create them in the Azure portal in a few steps. This guide follows two Microsoft Learn pages, the portal quickstart and the management groups overview.

## Create a management group

1. Sign in to the Azure portal.
2. Select **All services** > **Management + governance**.
3. Select **Management Groups**.
4. Select **+ Add management group**.
5. Leave **Create new** selected and fill in the fields:
   - **Management Group ID:** the directory-unique identifier used in commands. It is not editable after creation.
   - **Display name:** optional, shown in the portal, and can be changed at any time.
6. Select **Save**.

The new group becomes a child of the root management group or the default management group, and the creator is given an Owner role assignment. Learn says any Microsoft Entra ID user in the tenant can create a management group without the management group write permission if hierarchy protection is not enabled. The first management group in a directory could take up to 15 minutes to complete, and you receive a notification when setup finishes.

## Limits

- A single directory can support 10,000 management groups.
- A tree can support up to six levels of depth, not counting the root level or the subscription level.
- Each management group and subscription supports only one parent.
- Each management group can have many children.

## The root management group

Each directory has one built-in root group, with the default display name Tenant root group and an ID equal to the Microsoft Entra tenant ID. It cannot be moved or deleted. Initially, Global Administrators must elevate access to the User Access Administrator role on the root, and then can assign any Azure role to manage the hierarchy. Learn warns that any assignment of user access or policy on the root applies to all resources in the directory. New subscriptions default to the root.

## Inheritance

Policies and role assignments on a management group cascade to child groups, subscriptions and resources. The overview gives an example of a policy limiting VM locations that the owner of a resource or subscription cannot alter. Any Azure role can be assigned to a management group and inherits down to resources. For custom roles, only one management group may be listed in a new role's assignable scopes, and custom roles with `DataActions` cannot be assigned at management group scope. Use the group ID, not the display name, in assignable scopes.

## Move a subscription or group

- You need `Microsoft.management/managementgroups/write`, `Microsoft.Management/register/action` and role assignment write and delete permissions on the item you move. For subscriptions, you also need `Microsoft.management/managementgroups/subscriptions/write`.
- You need `Microsoft.management/managementgroups/write` on the target and current parent. If either is the root, these requirements do not apply.
- If Owner is inherited, you can move the item only to a group where you also have Owner.
- Moving a subscription can break the path between a role assignment and a custom role definition on another branch. Learn lists four fixes: remove the assignment before the move, add the subscription to the assignable scope, widen the assignable scope, or create a second role in the new branch.
- The hierarchy is cached for up to 30 minutes.

## Other notes from the overview

All subscriptions in a management group must trust the same Microsoft Entra tenant. Activity logs support management groups, with the target scope format `/providers/Microsoft.Management/managementGroups/{management-group-id}`. Diagnostic settings for management groups can be configured through the REST API. Changing the display name of the root group requires the Owner or Contributor role on the root group.

## Delete a management group

Select **All services** > **Management + governance** > **Management Groups**, select the group, then **Details**, then **Delete** and confirm.

## Not covered

The quickstart does not explain moving subscriptions, hierarchy protection details, inheritance or other tools such as CLI, PowerShell and Bicep. The overview does not describe hierarchy protection or a way to change the default management group, and it links to separate articles for step-by-step procedures. Management groups are not currently supported in cost management features for Microsoft Customer Agreement subscriptions, per the overview.

## Related

- [Azure management group](https://www.m365.fm/entity/azure-management-group/)
- [Azure subscription](https://www.m365.fm/entity/azure-subscription/)

## Sources

- [Quickstart: Create a management group with portal (Microsoft Learn)](https://learn.microsoft.com/azure/governance/management-groups/create-management-group-portal)
- [Organize your resources with management groups (Microsoft Learn)](https://learn.microsoft.com/azure/governance/management-groups/overview)
