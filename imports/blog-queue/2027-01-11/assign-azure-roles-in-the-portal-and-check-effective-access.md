---
title: "How to Assign Azure Roles in the Azure Portal and Check Effective Access"
summary: "Assign an Azure role in the Azure portal: required permissions, scopes, the Access control (IAM) steps, job function versus privileged roles, conditions, eligible and active assignments, how to view assignments and what the Learn page does not cover."
status: review
publish: false
author: mirko-p
date: 2027-01-11
topics: [azure-rbac]
keypoints:
  - "You need the Microsoft.Authorization/roleAssignments/write permission, for example through Role Based Access Control Administrator or User Access Administrator."
  - "Scope can be a management group, subscription, resource group or resource. Open the scope, then Access control (IAM) > Add > Add role assignment."
  - "Choose the role, select members (user, group, service principal or managed identity), optionally add a condition, then select Review + assign."
  - "The Assignment type tab for eligible or active and permanent or time-bound assignments appears only with Microsoft Entra ID P2 or Governance licensing."
  - "The page has no Check access section, no propagation time and no assignment limits. View assignments on the Role assignments tab."
faq:
  - q: "What permission do I need to assign a role?"
    a: "Microsoft.Authorization/roleAssignments/write, which built-in roles such as Role Based Access Control Administrator and User Access Administrator have. If you lack it, the Add role assignment option is disabled."
  - q: "At which scopes can I assign roles?"
    a: "Management group, subscription, resource group and resource, from broad to narrow."
  - q: "How do I assign a role?"
    a: "Open the scope in the Azure portal, select Access control (IAM), the Role assignments tab, then Add > Add role assignment. Pick the role, select members, optionally add a condition and select Review + assign."
  - q: "What is the difference between job function and privileged administrator roles?"
    a: "On the Role tab, job function roles are general or service-specific resource roles. Privileged administrator roles include Owner, Contributor, User Access Administrator and Role Based Access Control Administrator."
  - q: "How long until the assignment works?"
    a: "The page says the principal is assigned after a few moments. For edits it says updates might take a while to be reflected in the portal and gives no duration."
---

Azure role-based access control decides who can do what on which Azure resource. Assigning a role takes four ingredients: a security principal, a role, a scope and permission to assign. This guide follows the Microsoft Learn page on assigning Azure roles in the portal.

## Prerequisites

You need the `Microsoft.Authorization/roleAssignments/write` permission, for example through the built-in Role Based Access Control Administrator or User Access Administrator role. If you lack it, the **Add role assignment** option is disabled. The page does not list Owner as a prerequisite, although it calls Owner a privileged role elsewhere.

## Steps

1. **Identify the scope.** Management group, subscription, resource group or resource. Search for it in the Azure portal and open it.
2. **Open the page.** Select **Access control (IAM)**, then the **Role assignments** tab, then **Add** > **Add role assignment**.
3. **Role tab.** Search by name or description and filter by **Type** and **Category**. Select **View** in the Details column to see a role. Select **Next**.
4. **Members tab.** Choose **User, group, or service principal** or **Managed identity**, select **Select members** and **Select**. Add an optional description and select **Next**.
5. **Conditions tab, optional.** For Owner, Role Based Access Control Administrator and User Access Administrator you can delegate with the option **Allow user to only assign selected roles to selected principals (fewer privileges)**. For certain storage data roles you can add a storage condition.
6. **Assignment type tab.** It appears only with Microsoft Entra ID P2 or Microsoft Entra ID Governance, for management group, subscription and resource group scopes. Choose **Eligible** or **Active**, and **Permanent** or **Time bound**. Eligible assignments cannot be created for applications, service principals or managed identities.
7. **Review + assign.** Select **Review + assign**.

## Job function and privileged roles

On the Role tab roles are grouped in two tabs. **Job function roles** are general Azure resource management or service-specific roles. **Privileged administrator roles** include Owner, Contributor, User Access Administrator and Role Based Access Control Administrator. The page links to best practices for limiting privileged assignments.

## Copilot role selection

On the Role tab you can select **Copilot can help pick role**, describe the access you need and select a recommended role.

## View assignments

The page has no Check access section. It says to view assignments on **Access control (IAM)** > **Role assignments** for the scope. Use **Edit columns** to add the **Description** column if it is missing.

## Timing

The principal is assigned after a few moments. After editing an assignment, updates might take a while to be processed and reflected in the portal. The page gives no number.

## What the page does not say

- A procedure for the Check access feature.
- Propagation time.
- Limits such as the number of role assignments. The maximum eligible duration depends on the Privileged Identity Management policy.
- What to do if the Conditions tab does not appear.
- The Assignment type section repeats Start date and time, which is probably a typo for End date and time.

## An assignment outline

This outline is practical advice built on the page.

1. Pick the narrowest scope that fits the task.
2. Prefer a job function role. Use privileged roles rarely, with a condition if possible.
3. Assign to a group where several people need the same access.
4. After the assignment, open the Role assignments tab and confirm the entry.
5. Allow time before you test, since the page gives no exact delay.

## Typical mistakes

- Assigning at subscription scope when a resource group is enough.
- Using Owner when a job function role would do.
- Expecting the Assignment type tab without Entra ID P2 or Governance licensing.
- Testing right after the change and assuming the assignment failed.

## Quick reference

| Item | Value on the page |
| --- | --- |
| Required permission | Microsoft.Authorization/roleAssignments/write |
| Example roles | Role Based Access Control Administrator, User Access Administrator |
| Scopes | Management group, subscription, resource group, resource |
| Portal path | Scope > Access control (IAM) > Role assignments > Add > Add role assignment |
| Principal types | User, group, service principal, managed identity |
| Final step | Review + assign |

## What a role assignment consists of

A role assignment connects a security principal, a role definition and a scope. The portal steps ask for them in this order: scope first (where you open the page), then the role on the Role tab, then the principal on the Members tab. The optional Conditions tab narrows what the assigned person may do, and the Assignment type tab, where licensed, sets whether the assignment is eligible or active.

## Related

- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Azure Key Vault](https://www.m365.fm/entity/azure-key-vault/)

## Sources

- [Assign Azure roles using the Azure portal (Microsoft Learn)](https://learn.microsoft.com/azure/role-based-access-control/role-assignments-portal)
