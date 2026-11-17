---
title: "Azure budgets and alerts: stopping surprise bills"
summary: "An Azure budget compares actual or forecasted cost with an amount you set and sends alerts at thresholds, but it does not stop any resource. To act on an alert you connect an action group, which only subscription and resource group budgets support."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-budgets, microsoft-cost-management]
keypoints:
  - "A budget is a notification tool. Learn says that when a threshold is met, resources are not affected and consumption is not stopped."
  - "Per the portal tutorial, a budget needs at least one threshold and one email address and allows up to five of each. Thresholds run from 0.01% to 1000%, and can be based on actual or forecasted cost."
  - "Alerts are not real time: cost data is typically available within 8 to 24 hours, budgets are evaluated every 24 hours, and emails normally follow within an hour of the evaluation. A different Learn page says recipients get alerts within 24 hours of crossing the threshold."
  - "Learn calls action groups the only endpoint you integrate with a budget, and they are supported only at subscription and resource group scope. They can call runbooks, Functions, Logic Apps and webhooks."
  - "A budget resets monthly, quarterly or annually, and Learn says it is deleted automatically when its expiration date passes, so check the end date."
faq:
  - q: "Does an Azure budget stop my virtual machines when the limit is reached?"
    a: "No. Learn says notifications are triggered when thresholds are exceeded, but resources are not affected and consumption is not stopped. To act automatically, a budget at subscription or resource group scope can call an action group, which can run automation such as an Azure Automation runbook, an Azure Function, a Logic App or a webhook. You build and test that automation yourself."
  - q: "How quickly will I hear about an overspend?"
    a: "Not immediately. Learn says cost and usage data is typically available within 8 to 24 hours, budgets are evaluated against it every 24 hours, and emails are normally sent within an hour of the evaluation. The Automate budget creation page separately says recipients receive email alerts within 24 hours of crossing the budget threshold. Adding up the steps above gives, in our reading, a longer worst case, so an alert can arrive well after the spend happened. A forecasted-cost threshold gives earlier warning than an actual-cost one."
  - q: "Who can create a budget?"
    a: "Per Learn, at subscription scope an Owner can create, modify or delete budgets. A Contributor or Cost Management Contributor can create, modify or delete their own budgets and change the amount of budgets created by others. Readers and Cost Management Readers can view the budgets they have permission to see."
---

An Azure budget compares your cost with an amount you set and sends alerts when spending crosses the thresholds you choose. It does not stop anything: Learn says resources are not affected and consumption is not stopped when a threshold is met. So a budget reduces the chance of surprises by telling people early, and any automatic response is something you build on top of it.

This article covers what a budget is, how it evaluates cost, which other cost alerts exist and how to wire a budget to automation. It uses Azure Virtual Desktop (AVD) as the running example, because session host VMs are usually the largest cost line. Prices are out of scope; the amounts below are illustrative.

## What a budget is

Budgets are a feature of [Microsoft Cost Management](/entity/microsoft-cost-management/), the suite of FinOps tools for analysing, monitoring and optimising Microsoft cloud costs. Learn says [Azure budgets](/entity/azure-budgets/) help you plan for and drive organizational accountability, proactively inform others about their spending and monitor how spending progresses over time. You can base alerts on actual or forecasted cost.

A budget is created for a scope. Learn lists these:

| Agreement type | Scopes |
|---|---|
| Azure RBAC | [Management group](/entity/azure-management-group/), [subscription](/entity/azure-subscription/), [resource group](/entity/azure-resource-group/) |
| Enterprise Agreement | Billing account, department, enrollment account |
| Individual agreements | Billing account |
| Microsoft Customer Agreement | Billing account, billing profile, invoice section, customer |

Filters narrow a budget to part of a scope, for example certain resource groups or a service such as virtual machines. Each budget has an amount, a name and a reset period: monthly, quarterly or annually, calendar-aligned, or billing month, quarter or year, which Learn ties to invoice periods for offers such as pay-as-you-go. A quarterly amount is divided evenly across the three months and an annual amount across twelve. The cost evaluated starts at zero in each new period.

One setting catches teams out. Budgets reset at the end of a period for the same amount only when the expiration date is in the future, and Learn says that when a budget expires it is deleted automatically. A budget with a short end date quietly disappears.

## How a budget evaluates cost

Four rules from Learn help explain late or unexpected alerts.

1. **Data arrives with a delay.** Learn says cost and usage data is typically available within 8 to 24 hours. For pay-as-you-go subscriptions, the Cost Management data page says it can take up to 72 hours.
2. **Evaluation is periodic.** Budgets are evaluated against these costs every 24 hours, and email notifications are normally sent within an hour of the evaluation.
3. **The measure is actual cost.** Budget evaluations use actual cost and exclude amortization. Learn adds that evaluations include reserved instance and purchase data, so purchases can trigger alerts. To evaluate only first-party Azure consumption, it suggests the filters Publisher Type: Azure and Charge Type: Usage. The group and filter page notes that for Microsoft Customer Agreement customers the Azure publisher type value was renamed to Microsoft, so check which value your filter list offers.
4. **New subscriptions need time.** Learn says it can take up to 48 hours before you can use all Cost Management features, though the data page adds that a budget can be configured at creation time.

Our reading of rules 1 and 2: a spike on day 1 can reach an inbox on day 2 or later. The Automate budget creation page gives a different, single figure: recipients receive email alerts within 24 hours of crossing the budget threshold. Learn does not reconcile the two, so treat the chain above as our own addition and allow for the longer case. If the cost of waiting is high, a forecasted-cost threshold is the earlier signal.

## Thresholds and alert types

Per the portal tutorial, a budget needs at least one cost threshold (percent of the budget) and a matching email address, and can have up to five thresholds and five email addresses. Thresholds support a range of 0.01% to 1000%.

- **Actual cost alerts** fire for the actual cost accrued against the thresholds.
- **Forecasted alerts** give advance notice that spending trends are likely to exceed the budget. They are generated when the forecasted cost projection exceeds the threshold.

Use the Type field to switch between the two. A budget can mix both, and in the Learn Bicep quickstart's two-filter template the second notification sets the threshold type to Forecasted. For emails, Learn advises adding azure-noreply@microsoft.com to the approved senders so they do not land in junk. Assigning roles to receive alerts is not supported in the portal and is available through the Budgets API; the API also takes a locale, with 21 listed culture codes, for the email language.

An illustrative AVD example: a dev and test subscription with a monthly budget of 2,000 USD and these thresholds.

| Threshold | Type | Purpose |
|---|---|---|
| 100% | Forecasted | Early warning that the month will exceed the budget |
| 80% | Actual | Time to review host pool sizes |
| 100% | Actual | Budget used up |
| 120% | Actual | Escalate to the budget owner |

The values are examples, not a Microsoft recommendation.

## Other cost alerts

Budget alerts are one of several alert types in Cost Management. Learn names three main ones: budget, credit and department spending quota. It also describes anomaly and scheduled alerts.

| Alert | What it tells you | Availability and notes |
|---|---|---|
| Budget | Spending reached or exceeded the amount in the budget's alert condition | Enterprise Agreement, Microsoft Customer Agreement and pay-as-you-go |
| Credit | Generated at 90% and 100% of an Azure Prepayment credit balance | Enterprise Agreement only |
| Department spending quota | A department reaches a fixed threshold of its quota, for example 50% or 75% | Enterprise Agreement only |
| Anomaly | An unexpected change in daily usage, a spike or a dip | Subscription scope only |
| Scheduled | Latest costs on a daily, weekly or monthly schedule from a saved cost view | See the Cost Management overview |

Anomaly alerts suit the "something odd happened" case that a fixed budget misses. Learn says anomalies are evaluated daily, comparing the day's total usage with a forecast based on the last 60 days, and that detection runs 36 hours after the end of the day (UTC). The email is sent once, at detection. Creating a rule requires the Cost Management Contributor role or greater, or the `Microsoft.CostManagement/scheduledActions/write` permission for a custom role; Learn also mentions a limit of five alerts per subscription. The path is Cost Management, Cost alerts, Add, with Anomaly as the alert type. Anomaly alerts are available only in the Azure public cloud.

## Turning an alert into an action

For subscription and resource group scopes, a budget can call an Azure Monitor action group. Learn calls action groups the only endpoint you integrate with a budget, and its Cost Management overview says they can be notified to take automated actions to reduce or even stop further charges. The tutorial says action groups are currently only supported at these two scopes, that they can send push notifications to the Azure mobile app, and that they can trigger automation such as Azure Functions or webhooks. On the action groups page, the action types include Automation runbook, Functions, Logic apps, webhook, secure webhook, ITSM and Event Hubs.

Learn's budget scenario shows the pattern: an action group calls a Logic App, which reads the notification threshold from the payload. Between 80% and under 100% it calls a webhook that runs a runbook for the resource group named in a parameter, and at 100% it calls a second webhook that runs the runbook without parameters, stopping all remaining VMs. The sample uses a 1,000 USD monthly budget. Two cautions from the sources:

- The scenario page imports a Stop Azure V2 VMs runbook and creates an Azure Automation Run As account. The Automation migration page says Run As accounts retired on 30 September 2023 and that you can no longer create or renew them in the portal. Use a managed identity instead; new Automation accounts enable a system-assigned one. The README of the gallery runbook says it connects with that system-assigned identity, which needs at least Virtual Machine Contributor on the VMs, the resource group or the subscription.
- The action groups page says rate limiting applies to SMS, voice, push and email notifications, and that a failing webhook is retried up to five times and then not called for 15 minutes. A notification path that matters should not rely on a single channel.

For AVD, think before you automate shutdowns. Stopping VMs interrupts the sessions on them (our reading). Learn names autoscale, savings plans and reserved VM instances as ways to reduce compute cost, so, in our reading, the scaling plan is the routine control and the budget is the backstop. How a runbook that stops VMs interacts with a scaling plan is not described in the budget scenario, so test it in a non-production subscription first.

## Setting one up in the portal

1. Open the scope, for example **Subscriptions**, select the subscription, then **Budgets**. For a resource group, open the group and select **Budgets**.
2. Select **Add**.
3. In **Create budget**, confirm the scope and add any filters.
4. Enter a name, choose the reset period and set an expiration date.
5. Set the amount. A graph suggests a value based on the highest forecasted cost in future periods; you can change it.
6. Select **Next**, then set thresholds, the Type for each, and email addresses.
7. For subscription and resource group scopes, optionally select **Manage action group**, then **Add action group**.

Creating and managing budgets needs contributor permission at least; viewing needs read access.

## Limits and traps

- **One currency per scope.** All subscriptions within a scope such as a management group must use a single currency. Multi-currency evaluation is not supported, and Learn says you may miss budget alerts if it occurs.
- **Billing account scope under a Microsoft Customer Agreement** is evaluated in USD regardless of billing currency, and in the billing currency for billing profile, invoice section and customer scopes.
- **Same amount every period.** Because a budget resets with the same amount, create separate budgets when the amounts differ for future periods.
- **PowerShell caveat.** Learn says budgets created with the Azure PowerShell module do not send notifications, and recommends the REST API for create and edit.

## When a budget is not enough

A budget answers "has the total passed a number". It does not say which host pool caused it, and it will not spot a one-day spike that stays under the monthly amount. Pair it with anomaly alerts, a tagging scheme for per-pool budgets and a regular look at cost analysis. The sibling article on per-host-pool budgets covers the tag-based filter.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Tutorial, Create and manage budgets](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets)
- [Microsoft Learn: Use cost alerts to monitor usage and spending](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending)
- [Microsoft Learn: Manage costs with budgets (budget scenario)](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/cost-management-budget-scenario)
- [Microsoft Learn: Automate budget creation](https://learn.microsoft.com/en-us/azure/cost-management-billing/automate/automate-budget-creation)
- [Microsoft Learn: Quickstart, Create a budget with Bicep](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/quick-create-budget-bicep)
- [Microsoft Learn: Analyze unexpected charges (anomaly alerts)](https://learn.microsoft.com/en-us/azure/cost-management-billing/understand/analyze-unexpected-charges)
- [Microsoft Learn: Microsoft Cost Management overview](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management)
- [Microsoft Learn: Understand Cost Management data](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/understand-cost-mgt-data)
- [Microsoft Learn: Group and filter options in cost analysis](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/group-filter)
- [Microsoft Learn: Azure Monitor action groups](https://learn.microsoft.com/en-us/azure/azure-monitor/alerts/action-groups)
- [Microsoft Learn: Migrate Azure Automation Run As accounts to managed identities](https://learn.microsoft.com/en-us/azure/automation/migrate-run-as-accounts-managed-identity)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [GitHub: Stop Azure V2 VMs runbook (Azure Automation gallery)](https://github.com/azureautomation/stop-azure-v2-vms)
