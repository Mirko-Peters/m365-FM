---
title: "How to Set Up Service Health and Resource Health Alerts in Azure"
summary: "Create Azure Service Health alerts in the portal: steps, scope, condition, action group and details, required permissions, public cloud and Global action group caveats, and how Resource Health alerts differ."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [azure-monitor]
keypoints:
  - "Create a service health alert from Service Health > Service Issues > Create service health alert. Set scope, condition, details and notifications, then select Create."
  - "Learn advises selecting all services and all regions, because Service Health only alerts for events that affect regions where your services run."
  - "Creating or editing a rule needs read on the target resource, write on the resource group and read on any action group."
  - "Service Health alerts are supported only in public clouds within the global region, and the action group region must be Global."
  - "Service Health notifications do not send alerts for Resource Health events. The page only links to its Health alerts article for more information."
faq:
  - q: "How do I create a service health alert?"
    a: "Per Microsoft Learn: in the Azure portal select Service Health, select Create service health alert in the Service Issues panel, set Scope by subscription, Condition for services, regions and event types, Details with resource group and alert rule name, and Notify me by, then select Create."
  - q: "Which permissions do I need?"
    a: "Read permission on the alert rule's target resource, write permission on the resource group where you create the rule, and read permission on any associated action group."
  - q: "What are the Global caveats?"
    a: "Service Health alerts are supported only in public clouds, within the global region. The action group's region must be set to Global to work with Service Health alerts."
  - q: "Do Service Health alerts cover Resource Health?"
    a: "No. Learn says Service Health notifications do not send alerts for Resource Health events. The page links to a Health alerts article for more information."
  - q: "Where can I see the alerts I created?"
    a: "On the Health alerts page. The option to create a Service Health alert is not available on the Billing panel."
---

A service health alert tells you about Azure service issues, planned maintenance, health advisories and security advisories that affect your subscription or tenant directory. You create one from the Service Health blade, choose scope, services, regions and event types, and attach an action group. Resource Health alerts are a separate thing. This guide follows the Microsoft Learn page on creating service health alerts in the portal. That page only links to the Resource Health guide, which was not read for this guide.

## Basic steps

1. In the Azure portal, select **Service Health**.
2. In the **Service Issues** panel, select **Create service health alert**. A new window opens.
3. Set the values:
   - **Scope:** the scope level, by subscription.
   - **Condition:** **Services**, **Regions** and **Event types** from the drop-down menus.
   - **Details:** the **Resource group** and an **Alert rule name**.
   - **Notify me by:** an email address, **Email Azure Resource Manager Role**, and, if needed, **Azure mobile app notification**.
4. Select **Create**. To add more detail, select **Advanced Options** instead.

Learn's tip is to select all services and all regions, because Service Health triggers alerts only for events that affect regions where your services run.

## Advanced Options tabs

| Tab | What you set |
| --- | --- |
| Scope | Scope level and subscription |
| Condition | Services (Azure resource types), regions and event types |
| Actions | An existing action group or a new one. Actions include email, SMS, Azure app push notifications, and webhook, Logic Apps or ITSM integrations |
| Details | Subscription, resource group, alert rule name, optional description, and optional custom properties under Advanced settings |
| Tags | Tags and values |
| Review + create | Review and select Create |

## Basic or advanced (my reading)

This section is my reading of the page, which does not compare the two paths. The basic window is one panel. It covers scope, condition, details and the notification channels. It is the quickest way to get a first alert running. Select **Advanced Options** when you want more control. The advanced flow splits the same settings across the tabs above and adds an action group, tags and an optional description. It also allows custom properties under Advanced settings. The page says created alerts can be viewed on the **Health alerts** page. The page does not say that one path is better than the other, so pick by how much detail you need.

## Permissions

To create or edit a rule you need:

- Read permission on the alert rule's target resource.
- Write permission on the resource group where you create the rule.
- Read permission on any associated action group, if applicable.

## Caveats

- Service Health alerts are supported only in public clouds, within the global region.
- The action group's region must be **Global**.
- The option to create a Service Health alert is not available on the Billing panel.
- Tenant-level alerts are in preview and covered in a separate article.
- Created alerts appear on the **Health alerts** page.

## Resource Health alerts

Learn says Service Health notifications do not send alerts for Resource Health events. The page links to a Health alerts article for more information. This guide did not read it, so it does not describe how Resource Health alerts are created. My advice: if you need both kinds of signal, check that article and set up both.

## What the page does not cover

Pricing, how quickly notifications arrive, full lists of services, regions and event types, ARM template, CLI or PowerShell code (it links to an ARM template reference), Azure mobile app setup details, sovereign cloud support, action group creation steps, and how to edit or delete an alert.

## A setup checklist (my advice)

The checklist is my own suggestion built on the page.

1. Decide who should receive the alerts and create or pick an action group in the Global region.
2. Confirm you have read on the action group and write on the resource group where you create the rule.
3. Create one alert for all services and all regions on each subscription that matters.
4. Test that the email or webhook arrives. The page gives no test procedure, so use the action group's own testing.
5. Create separate Resource Health alerts for the resources you care most about.

## Typical mistakes (my advice)

- Choosing only a few regions and missing events that affect your services elsewhere.
- Creating the action group in a regional location instead of Global.
- Expecting Service Health alerts to report single-resource problems.
- Trying to create the alert from the Billing panel.

## Related

- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Azure Monitor Agent](https://www.m365.fm/entity/azure-monitor-agent/)
- [Azure Advisor](https://www.m365.fm/entity/azure-advisor/)

## Sources

- [Create Service Health alerts for Azure service notifications (Microsoft Learn)](https://learn.microsoft.com/azure/service-health/alerts-activity-log-service-notifications-portal)
