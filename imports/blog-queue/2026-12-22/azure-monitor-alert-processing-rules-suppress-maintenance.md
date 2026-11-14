---
title: "Azure Monitor Alert Processing Rules: Suppress Alerts During Maintenance"
summary: "Create an Azure Monitor alert processing rule to suppress notifications during a maintenance window: scope, filters, schedule, what stays visible, and the 30-minute delay before a rule takes effect."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [azure-monitor]
keypoints:
  - "Alert processing rules change fired alerts. Alert rules create alerts. Suppression removes action groups from affected alerts, so no notifications go out."
  - "Suppressed alerts still fire and remain visible in the portal, Azure Resource Graph, the API and PowerShell."
  - "Scope can be resources, a resource group or a subscription in one subscription. Multiple filters combine with AND, and each filter takes up to five values."
  - "Use the On a specific time schedule for one maintenance window or Recurring for a weekly window."
  - "A new or changed rule can take up to 30 minutes to take effect. Azure Service Health alerts are not affected."
faq:
  - q: "What is the difference between an alert rule and an alert processing rule?"
    a: "Microsoft Learn says alert rules generate new alerts when something happens, while alert processing rules modify fired alerts as they are being fired to change the usual alert behavior. They were previously called action rules."
  - q: "Do suppressed alerts disappear?"
    a: "No. Learn says suppressed alerts still fire and remain visible when you list alerts in the portal, Azure Resource Graph, the API or PowerShell. Suppression only removes the action groups, so notifications and automation do not run."
  - q: "Can one rule cover resources in several subscriptions?"
    a: "No. Learn says you cannot create an alert processing rule on a resource from a different subscription. The scope is resources, a resource group or a whole subscription."
  - q: "How quickly does a new rule work?"
    a: "Learn says it can take up to 30 minutes after you create or update a rule for it to take effect and start processing newly fired alerts. Create maintenance rules ahead of the window."
  - q: "Does this suppress Azure Service Health alerts?"
    a: "No. Learn states that alert processing rules do not affect Azure Service Health alerts."
---

Planned maintenance should not page anyone. In Azure Monitor you can handle this with an alert processing rule that suppresses notifications for a scope and a time window. This guide covers how the rule works, how to build one in the portal, and the behavior Microsoft Learn documents that often surprises people.

## How alert processing rules work

Microsoft Learn describes alert processing rules as a way to apply processing to fired alerts. They differ from alert rules. Alert rules generate alerts when something happens. Alert processing rules modify alerts as they fire. The resource type is still `Microsoft.AlertsManagement/actionRules`, a leftover from the earlier name.

There are two rule actions:

- **Suppression** removes all action groups from the affected fired alerts.
- **Apply action groups** adds one or more action groups to the affected fired alerts.

If one alert is hit by rules of both types, Learn says suppression wins and the alert's action groups are suppressed.

## Scope and filters

A scope is a list of specific Azure resources, a resource group, or an entire subscription. Rules cannot span subscriptions.

Available filters:

- Alert context (payload)
- Alert rule ID
- Alert rule name
- Description
- Monitor condition (Fired or Resolved)
- Monitor service
- Resource
- Resource group
- Resource type
- Severity

With several filters, all of them apply, which Learn describes as a logical AND. Each filter can have up to five values, joined with a logical OR. A narrow filter is useful for a maintenance window that should silence only warnings and not critical alerts.

## Create a suppression rule in the portal

1. In Azure Monitor, open **Alerts** and select **Alert processing rules**, or select **Create** > **Alert processing rules**.
2. On the **Scope** tab, pick the resources, resource groups or subscription. Optionally add filters.
3. On the **Rule settings** tab, choose **Suppress notifications**.
4. On the **Scheduling** tab, choose **On a specific time** for a single window, or **Recurring** for a repeating window such as a weekly one. Without a schedule the rule is always active.
5. On the **Details** tab, name the rule, choose where it is stored, and optionally add a description.
6. Add tags if needed, then select **Review + create**.

You can enable, disable or delete rules in bulk from the list view by selecting their checkboxes. To change a rule, select it and edit it. You can also toggle it on the **Details** tab.

## Timing: create the rule early

Learn says that after you create or update an alert processing rule, it can take up to 30 minutes to take effect and start processing newly fired alerts. For a maintenance window starting at 22:00, create or edit the rule well before that time. The page I read does not describe time zone handling for schedules, so test a new schedule against a low-risk scope first.

## What suppression does not do

- **Alerts are not deleted.** They still fire and appear in the alert list, in Azure Resource Graph, the API and PowerShell. That also means the alert history shows what happened during maintenance.
- **Service Health alerts are unaffected.** Learn says alert processing rules do not affect Azure Service Health alerts.
- **Only action groups are removed.** Anything that depends on the alert existing, such as dashboards that count fired alerts, still sees them.

## Using the rule type to add action groups

The other action is not about maintenance, but it is worth a note. Learn says alert processing rules can add action groups to alert types that cannot specify them natively, such as Azure Backup, VM Insights guest health, Azure Stack Edge and Azure Stack Hub alerts.

## Practical maintenance pattern

1. Pick the narrowest scope that covers the maintenance, for example one resource group.
2. Add a filter on monitor service or severity if you only want to silence some alerts.
3. Use **On a specific time** for one-off work or **Recurring** for a standing patch window.
4. Create the rule at least 30 minutes ahead.
5. After the window, check the alert list for alerts that fired during maintenance and are still unresolved.
6. Disable or delete one-off rules so they cannot hide real incidents later.

## What the Learn page does not say

The page I read does not list the Azure roles needed to create these rules, and it does not give quotas beyond the five values per filter. Its CLI and PowerShell examples are in tabs that were not part of the text I could read, so this guide shows the portal path only. Check your own permissions before a change window.

## Related

- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)

## Sources

- [Alert processing rules](https://learn.microsoft.com/azure/azure-monitor/alerts/alerts-processing-rules)
