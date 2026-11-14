---
title: "Azure Cost Anomaly Alerts and Budget Action Groups With Logic Apps"
summary: "Create anomaly alerts and budgets in Microsoft Cost Management, then trigger Logic Apps from budget action groups. Covers limits, timing, the budget payload and what anomaly alerts cannot do."
status: review
publish: false
author: mirko-p
date: 2026-12-16
topics: [microsoft-cost-management, azure-logic-apps, cloud-cost-optimization]
keypoints:
  - "Anomaly alerts exist only at subscription scope, arrive by email and are sent once. A subscription can have five of them."
  - "Budgets can trigger action groups, but only at subscription and resource group scope. Budgets are evaluated every 24 hours and do not stop resources by themselves."
  - "Microsoft's budget scenario sends the action group call to a Logic App with an HTTP trigger, parses the payload and branches on NotificationThresholdAmount."
  - "For anomaly alerts Learn names mailbox-based automation, such as Logic Apps, as the way to integrate other tools."
  - "The Learn scenario is dated: it uses a Run As account and a 2018 API version, so verify current authentication and API versions."
faq:
  - q: "Can an anomaly alert call a Logic App directly?"
    a: "The Learn page describes anomaly alerts as email notifications only, sent once at the time of detection. It says other tools can be integrated through mailbox-based automation, for example Logic Apps, Microsoft Sentinel or ITSM tools. Budgets, in contrast, can call action groups."
  - q: "At which scope can I create anomaly alerts?"
    a: "Only at subscription scope, according to Microsoft Learn. Anomaly detection runs daily, compares the day's usage with a forecast based on the last 60 days and runs 36 hours after the end of the day in UTC."
  - q: "How often are budgets evaluated?"
    a: "Learn says cost and usage data is typically available within 8 to 24 hours and budgets are evaluated against it every 24 hours. Email notifications are normally sent within an hour of the evaluation."
  - q: "Do budgets stop spending?"
    a: "No. Learn states that resources are not affected and consumption is not stopped. Stopping resources needs your own automation, as in the Learn scenario with Automation runbooks and a Logic App."
  - q: "Which roles do I need?"
    a: "For anomaly alerts, Learn names Cost Management Contributor or greater. For budgets, Contributor is needed to create and manage them, and Owner can create, change or delete budgets for a subscription."
---

Anomaly alerts and budget alerts behave differently, and that decides how you automate them. An anomaly alert is an email, so Logic Apps would read it through a mailbox. A budget can call an Azure Monitor action group, and the action group can start a Logic App with an HTTP trigger. Neither one stops spending on its own.

## Anomaly alerts: what they do

Microsoft Cost Management detects anomalies per subscription. Learn describes how:

- The day's total usage is compared with a forecast based on the last 60 days, which accounts for patterns such as a spike every Monday.
- Detection runs 36 hours after the end of the day in UTC, so the data is complete.
- Usage is anomalous if it falls outside an expected range based on a confidence interval.

To see anomalies, open **Cost Management**, select a subscription scope, choose **Cost analysis** and open a view under **Smart views**. An insight such as a daily run rate change appears when there is one. Onboarding happens when you open such a view, and the status appears within 24 hours.

### Create the alert

1. Open **Cost Management** > **Cost alerts** > **+ Add**.
2. Choose **Anomaly** as the alert type.
3. Fill in the required fields and select **Create**. View and manage rules under **Alert rules**.

Facts to plan with:

- Scope is subscription only. A subscription can have five alerts. If you reach the limit, add yourself to an existing rule.
- The alert contains the change in resource group count and cost, the top resource group changes and a link to the portal.
- It is sent by email, once, at detection.
- Alerts use the access of the rule creator at send time. The creator needs the Reader role to keep receiving them. For environments that avoid permanent privileges, Learn describes a service principal with the Scheduled Actions API and the kind `InsightAlert`.
- Not available in Azure Government or other sovereign clouds.

## Budgets: where automation starts

Create a budget from **Subscriptions** or **Resource groups** > **Budgets** > **Add**. Choose filters, a reset period, an amount and alert conditions.

- You can use up to five thresholds and five email addresses per budget. The threshold range is 0.01% to 1000%.
- Condition types are actual cost and forecasted cost.
- Action groups are supported only for subscription and resource group scopes.
- Budgets work with action groups whether or not the common alert schema is enabled.
- Budgets created with PowerShell do not send notifications, according to Learn. Use the REST API instead.

Timing matters. Data typically arrives within 8 to 24 hours, and the evaluation runs every 24 hours. That means a budget alert is not a real-time brake.

## The Logic App pattern from Microsoft

Learn's scenario stops virtual machines at budget thresholds. Its components are an Automation runbook, webhooks, a Logic App with an HTTP trigger, an action group and the budget.

1. **Trigger.** Use **Request: When an HTTP request is received**.
2. **Parse JSON.** The action group has no custom headers for the webhook, so parse the payload in a separate step. The sample payload has the schema ID `AIP Budget Notification` and a `data` object with `SubscriptionName`, `SubscriptionId`, `SpendingAmount`, `Budget`, `Unit`, `BudgetName`, `BudgetType`, `ResourceGroup` and `NotificationThresholdAmount`.
3. **Branch.** Compare `NotificationThresholdAmount` as a number. In the scenario, a value of at least 0.8 and below 1 posts to one webhook, and a value of at least 1 posts to another. In the Logic App the value is a fraction, while the budget API uses whole percentages such as 80.
4. **Notify.** Send an email in each branch.
5. **Action group.** Add a Logic App action to an action group, then give the group to the budget as a contact group.

The webhook URL cannot be viewed again after creation, so save it at once. A runbook with mandatory parameters blocks webhook creation until you give values.

## Handle the dated parts

The Learn scenario was written for older tooling. It uses an Automation Run As account and the budget API version 2018-03-31 with 2018 dates. The page itself has a few inconsistencies, for example in the wording of the 100 percent email step. Verify the current authentication method for Automation and the current API version before you copy it.

## Connect anomaly alerts to Logic Apps

Since the anomaly alert is only an email, a common design is a Logic App with a mailbox trigger that reads messages from `microsoft-noreply@microsoft.com`. The Learn page names mailbox-based automation as the integration path but does not give steps. Check that no mail rule blocks that sender, and remember the alert is sent once.

## A sensible split of responsibilities

Use anomaly alerts to learn quickly that something unusual happened, and use budgets with action groups for thresholds that must start an action. Keep the actions reversible. Stopping virtual machines suits a noncritical workload, as Microsoft says about its own scenario. For production, a Logic App that opens a ticket or posts to a team channel is safer than one that shuts resources down. Budgets also support forecast alerts, which warn before the actual cost crosses the threshold, so consider a forecast condition for the early warning and an actual condition for the action.

## Typical mistakes

- Expecting a budget alert to stop spending.
- Creating a budget on a management group and expecting an action group to work.
- Mixing up 0.8 and 80 in the branch condition.
- Losing the anomaly email in a spam folder.

## Related

- [Microsoft Cost Management](https://www.m365.fm/entity/microsoft-cost-management/)
- [Azure Logic Apps](https://www.m365.fm/entity/azure-logic-apps/)
- [Cloud cost optimization](https://www.m365.fm/entity/cloud-cost-optimization/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Identify anomalies and unexpected changes in cost (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/understand/analyze-unexpected-charges)
- [Create and manage budgets (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets)
- [Manage costs with budgets: stop VMs at thresholds (Microsoft Learn)](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/cost-management-budget-scenario)
- [Anomaly management in the FinOps Framework (Microsoft Learn)](https://learn.microsoft.com/mt-mt/cloud-computing/finops/framework/understand/anomalies)
