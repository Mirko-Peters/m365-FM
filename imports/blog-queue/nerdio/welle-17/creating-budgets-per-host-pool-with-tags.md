---
title: "Creating budgets per host pool with tags"
summary: "To budget one host pool on its own, tag the virtual machines and other cost-bearing resources of that pool and create a budget whose filter matches the tag. Learn documents the tag filter in the Budgets API and in Bicep; its portal tutorial does not describe it."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [azure-budgets, microsoft-cost-management]
keypoints:
  - "Tags appear in usage data only while applied and not on historical data. Our reading: a tag-filtered budget counts only tagged usage, so tag first and wait for the data."
  - "The Budgets API filter takes a tag name, the operator In and values. Learn documents no way to select untagged cost, so in our reading a budget cannot select it; test first."
  - "Learn's az consumption budget create page documents resource, resource group and meter filters but no tag parameter, and the group is marked preview. Use Bicep or the REST API for tag filters."
  - "Budgets that call an action group must be at subscription or resource group scope. A tag-filtered budget at subscription scope can still use one."
  - "Tags are name-value pairs, so in our reading shared resources such as profile storage carry one value per key and fall outside per-pool budgets. Give them their own tag value and budget."
faq:
  - q: "Can I create a tag-filtered budget in the Azure portal?"
    a: "Learn's budget tutorial says to confirm the scope and add any filters in Create budget, and links to a group and filter page that lists Tag among the options for cost analysis and budgets, but the tutorial does not describe tag filters and Learn does not say explicitly whether the portal's budget filter offers Tag. The documented route is the Budgets API or Bicep, whose filter has a tags element. Check the filter list in your portal before relying on it."
  - q: "Do I tag the host pool or the virtual machines?"
    a: "The virtual machines at least. Learn says tags only report usage and cost for resources they are directly assigned to, and that VMs usually cost the most. Tags entered in the portal's host pool creation workflow are passed to the resources created in it. For session hosts added to an existing pool you enter them again each time."
  - q: "Why does my new budget show zero cost?"
    a: "Learn says resource tags are only available in Cost Management after the data is refreshed and while the resource is active and producing usage records, and that tags are not applied to historical data. Cost data is typically available in 8 to 24 hours. Check that the tag sits on the running VMs and that the budget's key and value match exactly."
---

To budget a single host pool, tag the resources that make up its cost and create a budget with a tag filter that matches. Learn documents that filter in the Budgets API and in Bicep: a `tags` element with a name, the operator `In` and a list of values. The portal tutorial says to add any filters but does not describe tag filters, so this guide builds the budget as code.

It assumes you have read the explainer on budgets and alerts. Choosing the tag keys and enforcing them is covered in the article on a tagging strategy for AVD cost allocation, so this guide only states what the budget needs from the tags.

## What a per-pool budget measures

A budget evaluates cost records. Our reading is that a tag filter keeps only the records whose resource carried the tag when it reported usage. Three points from Learn bear on this.

- Learn's Azure Virtual Desktop (AVD) tagging page says tags only report usage and cost for resources they are directly assigned to. A tag on a top-level resource does not tag the resources under it.
- The Cost Management data page says resource tags are included in usage data only while the tag is applied, and are not applied to historical data. Our reading: a budget created today for a tag added today counts from the next usage that carries the tag, not from the start of the month.
- Cost Management data is based on past usage records and includes resources that might be stopped or deleted. Tags, though, are only available when the resource is active and producing usage records.

The [host pool](https://www.m365.fm/entity/avd-host-pool/) object itself does not carry the compute charge. The cost sits on the VMs behind the [session hosts](https://www.m365.fm/entity/avd-session-host/), plus disks, network and shared services. Learn's cost page says VMs usually cost the most, and that session host costs are joined by profile storage, application storage, Azure Monitor log data and identity infrastructure.

## Prerequisites

1. **Tags on the VMs.** Use one key for the pool, for example `workload`, with a distinct value per pool such as `avd-finance-pooled`. Learn says tags entered in the portal's creation workflow are passed to all resources created there. For session hosts added later in the portal you must enter them manually each time. Learn also warns that small typos affect reporting, so write the allowed values down.
2. **Time.** Learn says tags are only available in Cost Management after the data is refreshed and while the resource is producing usage records. For Enterprise Agreement and Microsoft Customer Agreement subscriptions, data is typically available within 8 to 24 hours; for pay-as-you-go it can take up to 72.
3. **Permissions.** At subscription scope an Owner can create, modify or delete budgets. A Contributor or Cost Management Contributor can create, modify or delete their own budgets.
4. **A scope.** Pick a [subscription](https://www.m365.fm/entity/azure-subscription/) or [resource group](https://www.m365.fm/entity/azure-resource-group/) if you want an action group to be callable. Learn says action groups are only supported at those two scopes.

## Three ways to isolate one pool

| Approach | How the pool is selected | Needs | Limit |
|---|---|---|---|
| Tag filter | Budget filter `tags` on a key and values | Tags on each cost-bearing resource | Only `In` is listed as an operator; Learn documents no selection of untagged cost |
| Resource group scope | The budget is created on the pool's resource group | One resource group per pool | Cost of resources outside that group is not seen |
| Tag inheritance, then tag filter | Subscription and resource group tags are copied to usage records | Enterprise Agreement, Microsoft Customer Agreement or Microsoft Partner Agreement billing | Updates take about 8 to 24 hours and apply to the current month |

The second row needs no tags at all, and it is the simplest option if each pool already has its own resource group. The tag filter helps when pools share a resource group or you want one budget to follow a department or environment across groups. Learn says that with tag inheritance enabled you can create budgets with filters on the inherited tags 24 hours after enabling it, and that inherited tags go to usage records, not to the resources.

## Create the budgets with Bicep

The Learn reference for `Microsoft.Consumption/budgets` shows a budget with a `tags` filter. The file below adapts it to loop over several pools. It is our adaptation of Learn's sample and quickstart, not a Microsoft sample. The reference lists 2026-06-01 as the latest API version; the file uses 2023-11-01, which the reference still lists and which the Learn quickstart uses. Use the version your tooling accepts, and validate the file in a test subscription first.

```bicep
targetScope = 'subscription'

param tagKey string = 'workload'
param startDate string
param contactEmails array
param pools array = [
  {
    name: 'finance-pooled'
    amount: 1800
  }
  {
    name: 'sales-pooled'
    amount: 1200
  }
]

resource budget 'Microsoft.Consumption/budgets@2023-11-01' = [for pool in pools: {
  name: 'avd-${pool.name}'
  properties: {
    category: 'Cost'
    amount: pool.amount
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: startDate
    }
    filter: {
      tags: {
        name: tagKey
        operator: 'In'
        values: [
          'avd-${pool.name}'
        ]
      }
    }
    notifications: {
      Forecasted_GreaterThan_100_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        thresholdType: 'Forecasted'
        contactEmails: contactEmails
      }
      Actual_GreaterThan_80_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 80
        thresholdType: 'Actual'
        contactEmails: contactEmails
      }
      Actual_GreaterThan_100_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        thresholdType: 'Actual'
        contactEmails: contactEmails
      }
    }
  }
}]
```

The amounts are illustrative. Points taken from the Learn references:

- `category` is `Cost`, `timeGrain` is one of Monthly, Quarterly or Annually (plus billing-period variants that Learn says only some customers support), and the start date must be the first of a month. If `endDate` is omitted it defaults to 10 years from the start date. The Learn quickstart says a future start date should not be more than three months ahead; the REST reference says twelve, so start on the first of the current or next month.
- A budget can have up to five notifications. Learn's samples use key names such as `Actual_GreaterThan_80_Percent`, and the file follows that pattern.
- `contactEmails` or `contactGroups` must be present at subscription and resource group scope. To call an action group, add `contactGroups` with the group's full resource ID.
- Learn calls `GreaterThan` the recommended operator. It says `EqualTo` is not recommended because the cost is unlikely to equal the threshold exactly, and that `EqualTo` will be deprecated in future.

Deploy at subscription scope, following the quickstart's pattern:

```azurecli
myContactEmails='("finops@contoso.com")'

az deployment sub create --name avdBudgets --location centralus --template-file main.bicep --parameters startDate=2026-12-01 contactEmails=$myContactEmails
```

## Two tags in one budget

To narrow a pool further, for example production only, combine two tags with `and`. Learn says `and` must have at least two items.

```json
"filter": {
  "and": [
    { "tags": { "name": "workload", "operator": "In", "values": ["avd-finance-pooled"] } },
    { "tags": { "name": "env", "operator": "In", "values": ["prod"] } }
  ]
}
```

Learn's REST page shows the same shape with a dimension filter and two tag filters, using `PUT https://management.azure.com/{scope}/providers/Microsoft.Consumption/budgets/{budgetName}?api-version=2024-08-01`. For Enterprise Agreement customers Learn recommends the REST API over the Azure PowerShell module, and says budgets created with PowerShell do not send notifications. The `az consumption budget create` page lists resource, resource group and meter filters but no tag parameter, and marks the command group as preview.

## Check that it works

1. Run `az consumption budget list` and confirm the budget names. The command group is preview.
2. After 24 hours, open Cost Management for the subscription and group cost by tag. Learn describes cost analysis grouping by a tag key.
3. Compare cost analysis (actual cost, the same tag filter, the same period) with the budget's current spend. Learn does not say the two will match. Budgets are evaluated every 24 hours, so in our reading a small gap can be data timing.
4. Look in the Untagged group in cost analysis. Learn says taggable resources without the tag show there, while purchases and some other items show as Tags not supported.
5. Open Cost alerts later in the month to see which thresholds fired.

## Stumbling blocks

- **Zero spend after creation.** The tag was not applied before the usage, or the key or value does not match.
- **Hosts added later without the tag.** Learn says tags for hosts added in the portal are entered manually each time, and its tagging page does not describe hosts created by automation. Verify new VMs carry the tag. Learn's tags page points to tag policies to ensure cost-accruing services are provisioned with a tag.
- **Shared costs fall outside.** Tags are name-value pairs, so in our reading a profile storage account serving two pools carries one value per tag key. Give shared resources a value such as `avd-shared` and a budget of their own, and agree an allocation rule.
- **No catch-all by tag.** Learn lists only `In` and documents no way to select untagged cost. Our reading is that you cannot write "everything without a tag", so test before relying on it. As a rule of thumb, keep one subscription-wide budget and compare it with the sum of the pool budgets. In our reading the difference is not only untagged cost: it also holds other workloads in the subscription, purchases, and items that cost analysis shows as Tags not supported or Tags not available.
- **Late alerts.** Budgets are evaluated every 24 hours and the forecasted threshold is the early signal. See the budgets explainer.
- **A budget does not act.** Resources are not stopped when a threshold is met. An action group at subscription or resource group scope can start automation.
- **`cm-resource-parent`.** Learn describes it for grouping a host pool's costs in cost analysis, not for budget filters.

## Sources

- [Microsoft Learn: Tutorial, Create and manage budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets)
- [Microsoft Learn: Microsoft.Consumption budgets (template reference)](https://learn.microsoft.com/en-us/azure/templates/microsoft.consumption/budgets)
- [Microsoft Learn: Budgets, Create Or Update (Consumption REST API)](https://learn.microsoft.com/en-us/rest/api/consumption/budgets/create-or-update?view=rest-consumption-2024-08-01)
- [Microsoft Learn: Automate budget creation](https://learn.microsoft.com/en-us/azure/cost-management-billing/automate/automate-budget-creation)
- [Microsoft Learn: Quickstart, Create a budget with Bicep](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/quick-create-budget-bicep)
- [Microsoft Learn: az consumption budget](https://learn.microsoft.com/en-us/cli/azure/consumption/budget)
- [Microsoft Learn: Tag Azure Virtual Desktop resources to manage costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Understand Cost Management data](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data)
- [Microsoft Learn: Group and filter options in cost analysis](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/group-filter)
- [Microsoft Learn: Use tags to organize your Azure resources and management hierarchy](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/tag-resources)
- [Microsoft Learn: Group and allocate costs using tag inheritance](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/enable-tag-inheritance)
- [Microsoft Learn: Cost alerts](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending)
