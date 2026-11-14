---
title: "Fix DeploymentQuotaExceeded: Azure Deployment History Limit per Resource Group"
summary: "Each Azure resource group keeps at most 800 deployments in its history. When a deployment would exceed that, delete old deployments with Azure CLI or PowerShell. Learn also lists three reasons why automatic cleanup may not keep up: a lock, an opt-out, or heavy concurrency."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [azure-resource-manager, arm-template, bicep]
keypoints:
  - "Learn says each resource group is limited to 800 deployments in its deployment history, and a deployment that would exceed it fails."
  - "Deleting a deployment from the history does not affect the resources that were deployed."
  - "Resource Manager deletes history automatically as you near the limit, so the error points to a lock, an opt-out or heavy concurrency."
  - "Use az deployment group delete or Remove-AzResourceGroupDeployment, with Learn's loop to remove deployments older than five days."
  - "Count the history first with az deployment group list --query length(@) or (Get-AzResourceGroupDeployment).Count."
faq:
  - q: "What is the deployment history limit?"
    a: "Microsoft Learn says each resource group is limited to 800 deployments in its deployment history. A deployment that would exceed the allowed 800 fails with an error stating that it will exceed the quota."
  - q: "Does deleting deployments delete my resources?"
    a: "No. Learn says deleting a deployment from the history does not affect any of the resources that were deployed."
  - q: "Why does the error appear when Azure deletes history automatically?"
    a: "Learn lists three reasons: a CanNotDelete lock on the resource group prevents deletions from the history, you opted out of automatic deletions, or many deployments run at the same time and automatic deletions are not processed fast enough."
  - q: "How do I see how many deployments the group holds?"
    a: "With Azure CLI in a Bash environment, run az deployment group list with the query length(@). With PowerShell, count the result of Get-AzResourceGroupDeployment."
  - q: "Where do I turn automatic deletion back on or remove a lock?"
    a: "Learn points to its page on automatic deletions from deployment history for both. That page is not covered in this article."
---

DeploymentQuotaExceeded means the resource group already holds the maximum number of deployment records. Microsoft Learn says each resource group is limited to 800 deployments in its deployment history, and a deployment that would exceed that number fails. The fix is to delete deployments from the history, which does not affect the resources that were deployed. This guide follows Learn's page on the deployment quota error.

## What you see

During deployment you receive an error that states the current deployment will exceed the quota of 800 deployments. Learn describes this as the symptom and gives one solution: delete deployments from the resource group history.

The limit counts deployment records, not resources. A group with a handful of resources can still reach 800 records if it receives many deployments over time, for example from a pipeline that runs often.

## Why it can happen when Azure cleans up for you

Learn says Azure Resource Manager automatically deletes deployments from your history as you near the limit. You can still see the error for one of three reasons:

1. A **CanNotDelete** lock on the resource group prevents deletions from the deployment history.
2. You opted out of automatic deletions.
3. A large number of deployments run concurrently, and the automatic deletions are not processed fast enough to reduce the total.

Learn sends you to its page on automatic deletions from deployment history to remove a lock or opt in again. I did not read that page for this article, so check it before you change a lock or the opt-out setting.

## Count what is in the history

Learn gives a command for each tool. With Azure CLI, in a Bash environment:

```azurecli
az deployment group list --resource-group exampleGroup --query "length(@)"
```

With PowerShell:

```azurepowershell
(Get-AzResourceGroupDeployment -ResourceGroupName exampleGroup).Count
```

Replace `exampleGroup` with your resource group name. A count near 800 confirms the diagnosis.

## Delete one deployment

With Azure CLI:

```azurecli
az deployment group delete --resource-group exampleGroup --name deploymentName
```

With PowerShell:

```azurepowershell
Remove-AzResourceGroupDeployment -ResourceGroupName exampleGroup -Name deploymentName
```

## Delete deployments older than five days

Learn's Azure CLI example, which needs Bash:

```azurecli
startdate=$(date +%F -d "-5days")
deployments=$(az deployment group list --resource-group exampleGroup --query "[?properties.timestamp<'$startdate'].name" --output tsv)

for deployment in $deployments
do
  az deployment group delete --resource-group exampleGroup --name $deployment
done
```

The script sets a start date five days back, lists the names of deployments whose timestamp is earlier, and deletes each in turn.

The PowerShell version:

```azurepowershell
$deployments = Get-AzResourceGroupDeployment -ResourceGroupName exampleGroup | Where-Object -Property Timestamp -LT -Value ((Get-Date).AddDays(-5))

foreach ($deployment in $deployments) {
  Remove-AzResourceGroupDeployment -ResourceGroupName exampleGroup -Name $deployment.DeploymentName
}
```

The five-day cutoff is Learn's example value. Choose your own to suit your history. Run the count command again afterwards to confirm the number fell.

## What the page does not cover

I read the whole page. It does not give the exact wording of the error message beyond the symptom above, an error code name, a permission list for deleting deployments, or a recommended retention period. It also does not say how long the deletion loop takes. Check your Azure role assignments with your administrator if a delete command is denied.

## Why the limit matters for pipelines

This section is my advice, not a Microsoft statement. Learn explains the limit and the cleanup, but not how teams usually hit it. In my experience the cause is a pipeline that deploys to the same resource group on every commit. Each run adds a record, and the group reaches the cap although the resources barely change. Two habits help: deploy only when something changed, and keep one resource group for one lifecycle, so unrelated pipelines do not share one history. If an automatic cleanup is blocked on purpose, a scheduled cleanup run with the commands above is the fallback, and the cutoff in the script should be a deliberate choice, not the five days in Learn's example.

## A practical routine

This section is my advice, not a Microsoft statement.

1. **Diagnose before you delete.** Run the count command and check the resource group for a CanNotDelete lock, then ask whether anyone opted out of automatic deletion. If one of those is the cause, deleting records only buys time until the limit returns.
2. **Keep the history you need.** Deployment records help when you have to explain what changed and when. Choose a cutoff that leaves recent deployments in place.
3. **Try the loop on a small cutoff first.** Start with a short list of old names and confirm that only history records disappear, as Learn says.
4. **Look at your pipelines.** If a pipeline deploys to one group many times a day, concurrent runs are a likely contributor. Reducing parallel deployments to the same group lowers the load on the automatic cleanup.
5. **Schedule the cleanup only if the cause cannot be removed.** If a lock or opt-out is intentional, a scheduled cleanup script with the commands above is a reasonable workaround. Document why the lock exists so the next engineer does not remove it.
6. **Record the fix in your runbook.** Include the count command, the cutoff and the person who owns the group.

## Related

- [Azure Resource Manager](https://www.m365.fm/entity/azure-resource-manager/)
- [ARM template](https://www.m365.fm/entity/arm-template/)
- [Bicep](https://www.m365.fm/entity/bicep/)

## Sources

- [Deployment quota exceeded - Azure Resource Manager (Microsoft Learn)](https://learn.microsoft.com/azure/azure-resource-manager/troubleshooting/deployment-quota-exceeded)
