---
title: "Fix ResourceNotFound and NotFound Errors in Azure Deployments: Properties, Dependencies and Scope"
summary: "Resource Manager returns NotFound or ResourceNotFound when it cannot find a resource in your subscription. Follow Microsoft's six solutions: check name, resource group and subscription, set dependencies, reference external resources, managed identities, functions and deleted resources."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [azure-resource-manager, arm-template, bicep]
keypoints:
  - "Learn names two codes: NotFound and ResourceNotFound, both meaning Resource Manager cannot find the resource in your subscription."
  - "For management tasks, check the resource name, the resource group name and the subscription, and make sure your shell runs in the right subscription."
  - "In deployments, a missing dependency can make a resource deploy in parallel with the resource it needs; Bicep uses implicit dependencies through symbolic names."
  - "A resource in another resource group needs the existing keyword with scope in Bicep; in JSON use resourceId with the resource group and subscription."
  - "A deleted resource can briefly still show in the portal; refresh, and contact support if it stays for more than a few minutes."
faq:
  - q: "What do NotFound and ResourceNotFound mean?"
    a: "Microsoft Learn says two error codes indicate that a resource cannot be found. Typical messages are Cannot find ServerFarm with name exampleplan for NotFound, and The Resource Microsoft.Storage/storageAccounts/name under resource group was not found for ResourceNotFound. Resource Manager needs the resource properties but cannot find the resource in your subscription."
  - q: "What do I check first during a management task?"
    a: "The three values Learn names: the resource name, the resource group name and the subscription. In PowerShell or Azure CLI, confirm you run commands in the subscription that holds the resource, using Set-AzContext or az account set."
  - q: "Why does a template deployment say a resource is not found when it exists in the template?"
    a: "Resource Manager deploys in parallel where it can. If a web app does not depend on its App Service plan, both are created at the same time and the web app can fail because the plan does not exist yet. Set a dependency."
  - q: "How do I reference a resource in another resource group?"
    a: "In Bicep, use the existing keyword with scope set through the resourceGroup function. In JSON templates, use the resourceId function and provide the resource group and subscription, because they default to the current ones when omitted."
  - q: "What if I just deleted the resource?"
    a: "Learn says a deleted resource can appear in the portal for a short time but not be available, and selecting it gives a Not found error. Refresh the portal. If it still shows for more than a few minutes, contact support."
---

NotFound and ResourceNotFound mean that Azure Resource Manager needed the properties of a resource and could not find that resource in your subscription. The fix depends on when you see it. During a management task, check the resource name, resource group and subscription. During a Bicep or ARM template deployment, check dependencies, scope and the functions that read other resources. This guide follows the six solutions in the Microsoft Learn page on resource not found errors, in the same order.

## Symptoms

Learn names two error codes. The `NotFound` error looks like this:

```
Code=NotFound;
Message=Cannot find ServerFarm with name exampleplan.
```

The `ResourceNotFound` error looks like this:

```
Code=ResourceNotFound;
Message=The Resource 'Microsoft.Storage/storageAccounts/{storage name}' under resource
group {resource group name} was not found.
```

You see them mostly when you deploy with Bicep or an ARM template, and also during management tasks. Learn's example for the second case: adding tags to a resource that does not exist.

## Cause

Resource Manager needs to retrieve the properties of a resource but cannot find the resource in your subscription.

## Solution 1: check the resource properties

For a management task, check three values: the resource name, the resource group name and the subscription.

If you use PowerShell or Azure CLI, confirm that the commands run in the subscription that holds the resource. Change the subscription with `Set-AzContext` or `az account set`. Many commands also take a subscription parameter that overrides the current context. If you cannot verify the values, find the resource in the Azure portal and read its name, resource group and subscription.

## Solution 2: set dependencies

For a template deployment, you may need a dependency. Resource Manager creates resources in parallel when it can. Learn's example: a web app needs its App Service plan. Without a declared dependency, both are created at the same time, and the web app fails because the plan does not exist yet.

**Bicep.** Use an implicit dependency instead of the `resourceId` function, built from the symbolic name and the `id` property. For example, the web app's `serverFarmId` uses `servicePlan.id`. Learn says explicit `dependsOn` is not needed for most deployments.

**JSON.** Use the `dependsOn` element when one resource must follow another. Learn adds that `reference` and `list*` functions create an implicit dependency when the resource is in the same template and is referenced by name, not by resource ID. The `resourceId` function neither creates an implicit dependency nor checks that the resource exists.

Both formats: avoid dependencies you do not need. They lengthen the deployment because resources no longer deploy in parallel, and they can create circular dependencies that block it.

### See the deployment order

1. Sign in to the Azure portal.
2. In the resource group **Overview**, select the link for the deployment history.
3. For the deployment, select **Related events**.
4. Read the sequence of events per resource, with status and time stamp. Parallel deployments start at the same time. Chained deployments show each one as Started, Accepted and Succeeded before the next starts.

## Solution 3: get an external resource

**Bicep.** The `existing` keyword references a deployed resource. If it sits in a different resource group, add `scope` with the `resourceGroup` function. Learn's example deploys a web app that uses an existing App Service plan from another resource group.

**JSON.** Use the `resourceId` function, which returns the fully qualified resource name. Its subscription and resource group parameters are optional and default to the current ones, so provide them when the resource is elsewhere.

## Solution 4: get a managed identity from a resource

If you deploy a resource with a managed identity, wait until that resource is deployed before you read values from the identity.

**Bicep.** Use an implicit dependency on the resource the identity applies to. For a virtual machine with symbolic name `vm`, `vm.identity.principalId` and `vm.identity.tenantId` return the values.

**JSON.** Do not pass the managed identity name to `reference`. Pass the name of the resource the identity is applied to, and use `Full` to get all properties including the identity. Learn warns against the pattern that concatenates `/providers/Microsoft.ManagedIdentity/Identities/default`, and says a template using it fails.

## Solution 5: check functions

**Bicep.** Use the symbolic name to read values. For a resource in another resource group, use `existing` with `scope`. Learn says the `reference` function is not needed in most cases.

**JSON.** Look for expressions that use `reference` or `listKeys`. The values you pass depend on whether the resource is in the same template, resource group and subscription. If it is in another resource group, provide the full resource ID.

## Solution 6: after deleting a resource

After a deletion, the resource can appear in the portal for a short time even though it is unavailable, and selecting it gives a **Not found** error. Refresh the portal. If it still shows after more than a few minutes, contact support.

## A triage order

This is my own order, not Microsoft's.

1. Read the full error message. It names the type and often the resource group. Copy those into the portal search.
2. Ask whether the failure happened in a deployment or in a command you ran by hand. For a command, start with Solution 1 and the active subscription. For a deployment, look at the deployment history first.
3. In the deployment history, check whether the failing resource started before the resource it needs. If it did, add the dependency.
4. If the needed resource is in another scope, check Solution 3 before changing anything else.
5. If the error follows a delete and redeploy cycle, wait and refresh before you debug the template.

## Related

- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)
- [ARM template](https://www.m365.fm/entity/arm-template/)
- [Bicep](https://www.m365.fm/entity/bicep/)

## Sources

- [Resource not found errors - Azure Resource Manager (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-not-found)
