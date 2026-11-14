---
title: "Use Azure Resource Locks to Prevent Accidental Deletion: Lock Levels, Scope and Gotchas"
summary: "Protect Azure resources with management locks using Microsoft Learn: the Delete and Read-only levels, inheritance, who can create locks, portal, CLI and PowerShell steps, the control plane versus data plane boundary and the side effects of ReadOnly locks on storage, VMs and other services."
status: review
publish: false
author: mirko-p
date: 2026-12-30
topics: [azure-resource-locks]
keypoints:
  - "Lock levels are Delete (CanNotDelete in the CLI) and Read-only. A lock overrides user permissions and applies to all users and roles, and the most restrictive lock in the inheritance chain wins."
  - "Locks apply to control plane operations only. Data plane operations, such as changing data in an SQL database, are not restricted."
  - "A ReadOnly lock can block operations that do not look like changes, because Resource Manager treats POST requests as writes. Examples include listing storage account keys and starting a VM."
  - "Creating or deleting locks needs Microsoft.Authorization/locks actions. Owner and User Access Administrator have them, and you cannot add locks to management groups."
  - "A Delete lock on any resource blocks deleting its whole resource group, with no partial deletion."
faq:
  - q: "What is the difference between the two lock levels?"
    a: "According to Microsoft Learn, CanNotDelete lets authorized users read and modify a resource but not delete it, while ReadOnly lets them read it but not delete or update it, similar to restricting everyone to the Reader role."
  - q: "Does a lock protect the data in a storage account?"
    a: "No. Learn says neither lock type protects the data in blobs, queues, tables or files, because locks apply only to control plane operations."
  - q: "Who can create a lock?"
    a: "Users with access to Microsoft.Authorization/* or Microsoft.Authorization/locks/* actions. Owner and User Access Administrator have it. Locks cannot be added to management groups."
  - q: "How are locks inherited?"
    a: "A lock at a parent scope is inherited by all resources inside it, including ones added later, and the most restrictive lock takes precedence."
  - q: "How do I remove a lock?"
    a: "In the portal select the Delete button for the lock under Locks, or use Remove-AzResourceLock in PowerShell or az lock delete in the CLI."
---

Azure management locks protect subscriptions, resource groups and resources from accidental deletion or modification. This guide follows the Microsoft Learn article on locking resources. A lock overrides user permissions and applies to every user and role, which separates it from role-based access control.

## Lock levels

| Portal name | CLI name | Behavior |
| --- | --- | --- |
| Delete | CanNotDelete | Authorized users can read and modify the resource but cannot delete it |
| Read-only | ReadOnly | Authorized users can read the resource but cannot delete or update it, similar to the Reader role for everyone |

## Inheritance

A lock on a parent scope is inherited by everything inside it, including resources added later. The most restrictive lock in the chain wins. Extension resources inherit locks from the resource they apply to. For example, if you lock a storage account, you cannot delete a diagnostic setting applied to one of its blob services.

If any resource in a resource group has a Delete lock, deleting the resource group is blocked as a whole, even for unlocked resources. A lock does not block subscription cancellation. Azure deactivates resources and deletes them permanently only after a waiting period.

## Control plane versus data plane

Locks apply to control plane operations, which go to management.azure.com. Data plane operations go to the service instance, for example a blob endpoint, and are not restricted. A ReadOnly lock on an SQL logical server prevents deleting or modifying the server, but you can still create, update or delete data in its databases.

## Side effects of ReadOnly locks

Resource Manager treats many operations as POST requests, and locks block POST requests. Learn lists these examples:

- **Storage accounts:** a ReadOnly lock blocks listing account keys, so users must use Entra credentials for blob or queue data. It also blocks assigning Azure roles scoped to the account and creating a blob container through the control plane. A user can still create one through the data plane.
- **Virtual machines:** a ReadOnly lock on a resource group with a VM prevents starting or restarting the VM.
- **App Service:** it blocks scaling up or out for a plan in a locked resource group, and Visual Studio Server Explorer cannot show the files.
- **Application Gateway:** it prevents retrieving backend health.
- **Automation accounts:** runbooks cannot start.
- **Log Analytics:** it prevents enabling User and Entity Behavior Analytics.
- **Resource groups:** it blocks moving resources into or out of the group.

Other notes: a Delete lock on the resource group created by Azure Backup makes backups fail, because the service cannot clean up restore points. A Delete lock on a resource group with Azure Machine Learning workspaces stops autoscaling from removing unused compute nodes. A Delete lock on a resource group stops Resource Manager from automatically deleting old deployments from history, and deployments fail once the history reaches 800.

## Who can create locks

You need access to Microsoft.Authorization/* or Microsoft.Authorization/locks/* actions. Owner and User Access Administrator have them, and some specialized built-in roles do too. You cannot add locks to management groups.

## Create a lock

**Portal:** open **Locks** in the Settings of the resource, resource group or subscription, select **Add**, enter a name, choose **Delete** or **Read-only** and optionally add notes. To remove it, select **Delete** for that lock.

**PowerShell:**

```azurepowershell
New-AzResourceLock -LockLevel CanNotDelete -LockName LockGroup -ResourceGroupName exampleresourcegroup
Get-AzResourceLock -ResourceGroupName exampleresourcegroup
```

**Azure CLI:**

```azurecli
az lock create --name LockGroup --lock-type CanNotDelete --resource-group exampleresourcegroup
az lock list --resource-group exampleresourcegroup
```

Learn also shows ARM templates, Bicep, Python and a REST call with a PUT to the locks endpoint. Its CLI example for removing a resource group lock reuses the name LockSite, which looks like a copy error, so check the lock name you pass.

## Managed applications

Some services, such as Azure Databricks, create a locked infrastructure resource group that you cannot delete directly. Delete the service itself, which also deletes the infrastructure group.

## A practical approach

This section is a suggestion, not Microsoft guidance. Use Delete locks on production resource groups first, since ReadOnly has the larger side effects. Test a ReadOnly lock in a non-production scope before relying on it.

## Not covered

The page gives no lock limits or quotas, no complete list of blocked POST operations, and no guidance on configuring backups around locks beyond the one note.

## Related

- [Azure resource locks](https://www.m365.fm/entity/azure-resource-locks/)

## Sources

- [Protect your Azure resources with a lock](https://learn.microsoft.com/azure/azure-resource-manager/management/lock-resources)
