---
title: "Fix MissingSubscriptionRegistration and NoRegisteredProviderFound: Register an Azure Resource Provider"
summary: "These Azure Resource Manager errors mean a resource provider is not registered for your subscription, or the API version or location is not supported. Check the status and register the provider with the portal, Azure CLI or PowerShell, then verify locations and API versions."
status: review
publish: false
author: mirko-p
date: 2027-01-16
topics: [azure-resource-manager, arm-template, bicep, azure-portal]
keypoints:
  - "NoRegisteredProviderFound and MissingSubscriptionRegistration appear when a Bicep or ARM template uses a resource provider you have not used in the subscription."
  - "Learn lists four causes: provider not registered, API version not supported, location not supported, and Microsoft.DevTestLab not registered for VM auto-shutdown."
  - "Register with the portal (Subscriptions, Resource providers, Register), az provider register, or Register-AzResourceProvider."
  - "The failing namespace can belong to a supporting resource your resource creates, such as monitoring or security resources, not to a resource in your template."
  - "The error message suggests supported locations and API versions, and you can query them with az provider show or Get-AzResourceProvider."
faq:
  - q: "What do these two errors mean?"
    a: "Microsoft Learn says they occur when you use a resource provider you have not already used in your subscription. NoRegisteredProviderFound says no registered resource provider was found for the location and API version of a type. MissingSubscriptionRegistration says the subscription is not registered to use a namespace."
  - q: "How do I register a provider in the portal?"
    a: "Sign in to the Azure portal, open Subscriptions, select the subscription, then under Settings select Resource providers. Select the provider and then Register."
  - q: "How do I register with the command line?"
    a: "Azure CLI: az provider register --namespace Microsoft.Cdn. PowerShell: Register-AzResourceProvider -ProviderNamespace Microsoft.Cdn. Substitute the namespace from your error message."
  - q: "Why does the error name a provider that is not in my template?"
    a: "Learn says this can happen when a resource you deploy creates other supporting resources, for example monitoring or security resources. The error then names the namespace of the supporting resource."
  - q: "What if a VM auto-shutdown setting fails with AuthorizationFailed?"
    a: "Learn lists an AuthorizationFailed message for Microsoft.Compute/virtualMachines/read when VM auto-shutdown is disabled, and says the Microsoft.DevTestLab resource provider must be registered."
---

NoRegisteredProviderFound and MissingSubscriptionRegistration mean Azure Resource Manager could not use a resource provider for your subscription. The first cause on Learn's list is a provider that is not registered, which you fix by registering the provider named in the error message, using the portal, Azure CLI or Azure PowerShell. Learn lists three other causes to rule out: an unsupported API version, an unsupported location, and Microsoft.DevTestLab not being registered for VM auto-shutdown. This guide follows the Microsoft Learn page on resource provider registration errors.

## What the errors look like

When a deployment with a Bicep file or ARM template hits an unregistered provider, you can get:

```text
Code: NoRegisteredProviderFound
Message: No registered resource provider found for location {location}
and API version {api-version} for type {resource-type}.
```

or:

```text
Code: MissingSubscriptionRegistration
Message: The subscription is not registered to use namespace {resource-provider-namespace}
```

Learn says the message should suggest supported locations and API versions, and that you can change your template to a suggested value. Most providers are registered automatically by the Azure portal or command-line interface, but not all, so if you have not used a provider before you might need to register it.

A third variant concerns VM auto-shutdown. When it is disabled, you might see `AuthorizationFailed` with an action such as `Microsoft.Compute/virtualMachines/read`. The cause listed for that case is that `Microsoft.DevTestLab` must be registered.

Also note that the namespace in the error might not be one you wrote in the template. Learn says an unexpected error can occur for a provider that is not in your template or Bicep file when a resource creates supporting resources, for example monitoring or security resources. The message names the namespace of the supporting resource, so register that one.

## The four causes

1. The required resource provider is not registered for the subscription.
2. The API version is not supported for the resource type.
3. The location is not supported for the resource type.
4. For VM auto-shutdown, `Microsoft.DevTestLab` is not registered.

## Fix it in the portal

1. Sign in to the Azure portal.
2. Search for and select **Subscriptions**, then select the subscription you deploy to.
3. Under **Settings**, select **Resource providers**.
4. Select the provider, for example the namespace from the error, and select **Register**.

## Fix it with Azure CLI

List the registration state of the subscription's providers:

```azurecli
az provider list --output table
```

Filter by state, replacing the value with `Registered` or `NotRegistered`:

```azurecli
az provider list --query "[?registrationState=='Registered']" --output table
```

Check one provider:

```azurecli
az provider list --query "[?namespace=='Microsoft.Compute']" --output table
```

Register a provider by namespace:

```azurecli
az provider register --namespace Microsoft.Cdn
```

## Fix it with PowerShell

```azurepowershell
Get-AzResourceProvider -ListAvailable
```

Without `-ListAvailable` only registered providers are listed. Check one provider, then register:

```azurepowershell
Get-AzResourceProvider -ListAvailable |
  Where-Object -Property ProviderNamespace -Like -Value "Microsoft.Compute"

Register-AzResourceProvider -ProviderNamespace "Microsoft.Cdn"
```

## Check locations and API versions

If registration is not the cause, check what the resource type supports. With Azure CLI:

```azurecli
az provider show --namespace Microsoft.Web --query "resourceTypes[?resourceType=='sites'].locations"
az provider show --namespace Microsoft.Web --query "resourceTypes[?resourceType=='sites'].apiVersions"
```

With PowerShell:

```azurepowershell
((Get-AzResourceProvider -ProviderNamespace Microsoft.Web).ResourceTypes |
  Where-Object -Property ResourceTypeName -EQ -Value "sites").Locations
```

Use `.ApiVersions` instead of `.Locations` for API versions. Then change the location or `apiVersion` in your template to a supported value.

## What the page does not cover

The page does not say which Azure role or permission you need to register a provider, how long registration takes, or whether to register providers ahead of time. The page gives none of those details. Check with your Azure administrator or the Azure RBAC documentation before you assume you have the right to register.

## A practical routine

This section is my advice, not a Microsoft statement.

1. Copy the namespace from the error, and check its state with the list commands above.
2. After registering, re-run the failed deployment, and recheck the state if the same error returns.
3. If the namespace is unfamiliar, look at the resource you deploy for supporting resources such as monitoring or security components. Learn describes this case.
4. For new subscriptions in a landing zone, I would list the providers your templates use and register them as part of subscription setup, so deployments do not fail later. That is my suggestion, not a Learn recommendation.
5. In pipelines, add a pre-deployment step that checks registration state for the namespaces your Bicep modules use.
6. Keep API versions in templates current, and test against the supported versions list when you change region.

## Reading the error text

This section is my advice, not a Microsoft statement. The error message has three parts worth copying into your ticket or runbook: the code, the namespace or resource type, and the location with API version. The code gives a first guess: registration for MissingSubscriptionRegistration, or a supported combination of location and API version for NoRegisteredProviderFound. Learn lists the same four causes for both codes, so treat that as a starting point only. The namespace tells you which provider to check. The location and API version tell you what to compare against the provider's supported values. Recording all three makes a repeat of the problem in another subscription quick to fix, because you can run the same checks with the same commands. If the same code appears for a different namespace on the next deployment, repeat the check rather than assuming the first registration covered it, since each namespace is registered on its own.

## Related

- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)
- [ARM template](https://www.m365.fm/entity/arm-template/)
- [Bicep](https://www.m365.fm/entity/bicep/)
- [Azure portal](https://www.m365.fm/entity/azure-portal/)

## Sources

- [Resource provider registration errors - Azure Resource Manager (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-register-resource-provider)
