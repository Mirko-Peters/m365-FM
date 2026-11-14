---
title: "How to Create Azure Budgets and Cost Alerts in Cost Management"
summary: "Azure budgets in Cost Management alert you when actual or forecasted spend crosses a threshold; they never stop resources. Learn the scopes, reset periods, alert limits, action groups and permissions from Microsoft's budget tutorial, and what to check when alerts do not arrive."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [microsoft-cost-management, azure-monitor, azure-rbac]
keypoints:
  - "Budgets send notifications when thresholds are exceeded; resources are not affected and consumption is not stopped."
  - "Cost data is typically available within 8 to 24 hours and budgets are evaluated every 24 hours; emails normally follow within an hour."
  - "A budget needs at least one threshold and email address, and can have up to five of each; alert limits range from 0.01 percent to 1000 percent."
  - "Action groups can be called for subscription and resource group scopes only, which enables automation beyond email."
  - "Budgets created with Azure PowerShell do not send notifications, and Learn recommends REST APIs over CLI for programmatic creation."
faq:
  - q: "Does a budget stop my spending?"
    a: "No. Learn says notifications are triggered when thresholds are exceeded, but resources are not affected and consumption is not stopped. A budget informs people, and you can attach an action group for automation."
  - q: "How often is a budget evaluated?"
    a: "Learn says cost and usage data is typically available within 8 to 24 hours and budgets are evaluated against these costs every 24 hours. When a threshold is met, email notifications are normally sent within an hour of the evaluation."
  - q: "Which scopes support budgets?"
    a: "Management group, subscription and resource group for Azure RBAC scopes, plus billing scopes for Enterprise Agreement and Microsoft Customer Agreement accounts and individual agreements. Learn lists billing account, department, enrollment account, billing profile, invoice section and customer among them."
  - q: "How many alerts can one budget have?"
    a: "Learn says a budget needs at least one cost threshold and a corresponding email address, and can include up to five thresholds and five email addresses. Alert limits support a range of 0.01 percent to 1000 percent of the budget."
  - q: "Why did I not get an email?"
    a: "Learn suggests adding azure-noreply@microsoft.com to your approved senders so emails do not go to junk. It also says new subscriptions can take up to 48 hours before Cost Management features are available, and multi-currency scopes are not supported for evaluation."
---

An Azure budget in Microsoft Cost Management watches spending against an amount you set and sends alerts when actual or forecasted cost crosses thresholds you choose. Microsoft Learn is explicit that budgets do not stop anything: resources are not affected and consumption continues. To create one, open a scope in the Azure portal, select **Budgets**, then **Add**, and configure the scope, filters, reset period, amount and alerts. This article follows Learn's tutorial on creating and managing budgets.

## What budgets do and do not do

Learn describes budgets as a way to plan and drive accountability, to inform others about their spending and to monitor how spending progresses. Points to keep in mind:

- Notifications trigger when thresholds are exceeded. Resources are not affected and consumption is not stopped.
- Cost and usage data is typically available within 8 to 24 hours, and budgets are evaluated against it every 24 hours.
- When a threshold is met, emails are normally sent within an hour of the evaluation.
- Budgets reset automatically at the end of a monthly, quarterly or annual period for the same amount if you select an expiration date in the future. When a budget expires, it is deleted automatically.

Because the same amount repeats each period, Learn says to create separate budgets when the amount differs for future periods.

## Scopes and permissions

Supported scopes include management group, subscription and resource group for Azure RBAC; billing account, department and enrollment account for Enterprise Agreement; billing account for individual agreements; and billing account, billing profile, invoice section and customer for Microsoft Customer Agreement. Budget evaluation at a Microsoft Customer Agreement billing account scope uses USD, regardless of billing currency, while billing profile, invoice section and customer scopes are evaluated in billing currency.

Learn also states a single currency requirement: all subscriptions within the scope, such as a management group, must use a single currency. Multi-currency budget evaluation is not supported, and you may miss alerts if it arises.

For permissions, you need at least read access to view budgets. To create and manage them you need contributor permission. Learn's subscription list: Owner can create, modify or delete budgets; Contributor and Cost Management contributor can create, modify or delete their own budgets and change the amount on budgets created by others; Reader and Cost Management reader can view budgets they have permission to.

A new subscription may take up to 48 hours before you can use all Cost Management features.

## Create a budget in the portal

1. Open the scope. For a subscription, go to **Subscriptions**, select it, then **Budgets**. For a resource group, navigate to the group first. Use the **Scope** pill to switch scopes.
2. Select **Add**.
3. In **Create budget**, confirm the scope and add filters if you want the budget to cover specific costs, such as a service or resource groups in a subscription.
4. Type a budget name and choose a reset period: monthly, quarterly or annual.
5. Set an expiration date, after which the budget stops evaluating costs.
6. Set the amount. A graph suggests a threshold based on the highest forecasted cost you might incur in future periods, and you can change it.
7. Select **Next** to configure alerts.

A quarterly budget works like a monthly one, with the amount divided evenly across the three months. An annual amount is divided evenly across 12 months. For pay-as-you-go, MSDN or Visual Studio subscriptions whose invoice period does not match the calendar month, Learn offers reset periods of **Billing month**, **Billing quarter** and **Billing year** as alternatives.

## Configure alerts

A budget needs at least one cost threshold (percent of budget) and a corresponding email address. You can include up to five thresholds and five email addresses. Use the **Type** field to switch between **Actual** and **Forecasted** alerts. Forecasted alerts warn that spending trends are likely to exceed the budget. Alert limits support 0.01 percent to 1000 percent of the budget.

Learn adds that you can assign roles to receive alerts only if you create the budget with the Budgets API, not in the portal. Learn also tells you to add azure-noreply@microsoft.com to approved senders so emails do not land in junk.

## Costs included in evaluations

Learn says budget evaluations now include reserved instance and purchase data, so you may receive alerts as these charges are incorporated. To evaluate against first-party Azure consumption only, add the filters Publisher Type: Azure and Charge Type: Usage. Budget evaluations use actual cost and do not include amortization.

## Trigger an action group

For subscription and resource group scopes, a budget can call an action group when a threshold is met. Select **Manage action group** while creating or editing the budget, then **Add action group**. Learn says action groups are currently supported only for those two scopes, that they work whether the common alert schema is enabled or not, and that enabling Azure app push notifications in the action group gives mobile push alerts. Action groups can also trigger automation such as Azure Functions or webhooks.

## Create budgets in code

Learn has tabs for PowerShell, CLI, Terraform and ARM templates. Two cautions from the page: budgets created with Azure PowerShell do not send notifications, and Learn recommends REST APIs over CLI commands because the CLI might not support the latest API version. Customers with a Microsoft Customer Agreement should use the Budgets REST API. Use the page's examples as a starting point and test the result in the portal.

## Setting up sensible budgets

This section is my advice, not a Microsoft statement.

1. **Start at the subscription scope.** It is the simplest place to learn how alerts behave.
2. **Use both actual and forecasted alerts.** Forecasted alerts give earlier warning, since they react to the trend.
3. **Pick thresholds people will act on.** In my experience, three alerts that someone owns beat five that everyone ignores.
4. **Send alerts to a shared mailbox or a group address.** A budget tied to one person's mailbox breaks when that person leaves.
5. **Add an action group for real automation.** An email only informs, so if you need a response, link to a runbook or ticket.
6. **Review budgets when scopes change.** Moving subscriptions between management groups, or adding one in another currency, can affect evaluation, as Learn's single currency note says.

## Troubleshooting missing alerts

This section is my advice, not a Microsoft statement, built on points from Learn.

- Check the timing: data arrives within 8 to 24 hours and evaluation runs every 24 hours, so an alert is not instant.
- Check junk mail and the approved senders list.
- Check whether the budget has expired, since Learn says an expired budget is deleted.
- Check the scope's currency, given the single currency requirement.
- Check how the budget was created, since PowerShell-created budgets do not send notifications.

## What the page does not cover

I read the whole tutorial. It does not give a maximum number of budgets, and it does not describe pricing for Cost Management. The related pages on cost alerts and on budget-based automation are separate and I did not read them.

## Related

- [Microsoft Cost Management](https://www.m365.fm/entity/microsoft-cost-management/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)

## Sources

- [Tutorial - Create and manage budgets - Microsoft Cost Management (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/costs/tutorial-acm-create-budgets)
