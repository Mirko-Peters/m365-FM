---
title: "Azure Deployment Fails With SkuNotAvailable or QuotaExceeded: Fix Steps"
summary: "Fix Azure deployment errors SkuNotAvailable and quota errors: list available VM sizes with az vm list-skus, read the Restrictions column, check vCPU usage, request a quota increase, and learn which error codes Learn actually documents."
status: review
publish: false
author: mirko-p
date: 2027-01-05
topics: [azure-resource-manager, azure-virtual-machines]
keypoints:
  - "SkuNotAvailable means the chosen SKU, such as a VM size, is not available in the location or zone, or a Spot VM has no capacity there."
  - "Use az vm list-skus with --location, --size and --all. Without --all, restricted SKUs are hidden, and the Restrictions column shows reasons such as NotAvailableForSubscription."
  - "Learn documents the quota errors as OperationNotAllowed and ResourceQuotaExceeded. It does not use the code QuotaExceeded."
  - "Quota scope depends on the resource type: subscription plus region for vCPUs, resource group, or subscription."
  - "Request a quota increase under Subscriptions > your subscription > Usage + quotas > Request increase."
faq:
  - q: "What causes SkuNotAvailable?"
    a: "Microsoft Learn names two cases: the selected resource SKU, such as a VM size, is not available in the location or zone, or you deploy an Azure Spot VM or scale set instance and there is no Spot capacity in that location."
  - q: "How do I find sizes that are available?"
    a: "Run az vm list-skus with --location, optionally --size for a partial name, and --all to include sizes not available to the current subscription. The Restrictions column shows why a SKU is blocked."
  - q: "What if the SKU is blocked for my subscription?"
    a: "Learn says to submit a SKU request to Azure Support if the SKU is blocked for your subscription in a location or zone you need."
  - q: "Is QuotaExceeded an official error code?"
    a: "The Learn quota page documents OperationNotAllowed, for example Operation results in exceeding quota limits of Core, and ResourceQuotaExceeded for per resource group counts. It does not use the code QuotaExceeded."
  - q: "How do I request more quota?"
    a: "Per Learn: in the Azure portal open Subscriptions, select your subscription, select Usage + quotas, select Request increase and complete the form. Some quotas accept a limit that is reviewed and approved or rejected."
---

Two different problems look alike here. SkuNotAvailable means the SKU is not offered to you in that location or zone. A quota error means you reached a limit. Fix the first by finding another size, location or zone, or by requesting access. Fix the second by checking usage and requesting more quota. This guide follows two Microsoft Learn troubleshooting pages.

## SkuNotAvailable

### Causes

- The resource SKU you selected, such as a VM size, is not available in the location or zone.
- You deploy an Azure Spot VM or Spot scale set instance and there is no Spot capacity in that location. Learn points to its Spot error messages page for more.

### What you see

- With `New-AzVM` or `az vm create`, the message says the requested size is not available in the location or zone.
- With an ARM template or Bicep deployment, the error is `InvalidTemplateDeployment`. Validation fails before the deployment starts, so there is no deployment history. The error appears in the portal activity log.
- The activity log codes are `SkuNotAvailable` or `InvalidTemplateDeployment`.

### Fix steps

**1. List available SKUs with the Azure CLI.**

```azurecli
az vm list-skus --location centralus --size Standard_D --all --output table
```

- `--location` filters by location.
- `--size` searches by partial size name.
- `--all` includes sizes not available to the current subscription. Without it, only unrestricted SKUs are shown.

The **Restrictions** column shows why a SKU is blocked, for example `NotAvailableForSubscription`.

**2. Check availability zones.**

```azurecli
az vm list-skus --location centralus --zone --all --output table
```

**3. Pick another size, location or zone.** The error message itself recommends this.

**4. Request access.** If the SKU is blocked for your subscription in a location or zone you need, submit a SKU request to Azure Support.

### Caveat

Without `--all`, restricted SKUs are hidden, so a size can look missing when it is blocked for your subscription. For Spot VMs, the cause may be temporary capacity rather than a restriction.

## Quota errors

The Learn quota page documents two error codes. It does not use the code QuotaExceeded.

```
Code=OperationNotAllowed
Message=Operation results in exceeding quota limits of Core.
Maximum allowed: 4, Current in use: 4, Additional requested: 2.
```

```
Code=ResourceQuotaExceeded
Message=Creating the resource of type <resource-type> would exceed the quota of <number>
resources of type <resource-type> per resource group.
```

### Where the quota applies

| The error mentions | Quota scope |
| --- | --- |
| vCPUs or VM cores | Subscription plus region |
| Resource count per resource group | Resource group |
| Total instances of a resource type | Subscription |

### Check usage

```azurecli
az vm list-usage --location "West US" --output table
```

The output shows `CurrentValue` and `Limit` per quota, for example Total Regional vCPUs. The Learn page also has a PowerShell tab, whose content was not available for this guide.

### Request an increase in the portal

1. Sign in to the Azure portal.
2. Search for **Subscriptions** and open your subscription.
3. Select **Usage + quotas**.
4. Select **Request increase**. For quotas with a pencil icon you can enter a limit directly.
5. Complete the form for the quota type.

### Caveats

- For vCPUs the quota applies per region. To deploy 30 vCPUs in West US, request 30 Resource Manager vCPUs in West US. To deploy 30 vCPUs in any accessible region, request them in all regions.
- Some quotas accept a limit that is submitted for review and then approved or rejected. If rejected, the page shows a link to open a support request.

## What the pages do not cover

The quota page does not describe alternatives such as another region or a smaller size. It gives no approval times and no PowerShell commands in the text read. The SKU page gives no way to predict when a restricted SKU becomes available and no turnaround time for a SKU request. For the full list of limits, Learn links to its page on Azure subscription and service limits.

## Which error am I looking at

1. Does the message say a size is not available in a location or zone? Treat it as SkuNotAvailable.
2. Does it mention exceeding quota or maximum allowed? Treat it as a quota error.
3. Is it a Spot deployment? Check Spot capacity first.
4. Is the deployment an ARM or Bicep template? Look in the activity log, because there may be no deployment history.

## Typical mistakes

- Listing SKUs without `--all` and concluding the size does not exist.
- Requesting a quota increase for the wrong region.
- Requesting a SKU increase when the real problem is zone availability.
- Searching deployment history for a template that failed validation.

## Related

- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)
- [Azure virtual machines](https://www.m365.fm/entity/azure-virtual-machines/)
- [Azure Spot virtual machines](https://www.m365.fm/entity/azure-spot-virtual-machines/)

## Sources

- [Resolve errors for SKU not available (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-sku-not-available)
- [Resolve errors for resource quotas (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/error-resource-quota)
