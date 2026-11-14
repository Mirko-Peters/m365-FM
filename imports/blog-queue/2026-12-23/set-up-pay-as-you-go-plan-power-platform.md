---
title: "Set Up a Pay-As-You-Go Plan for Power Platform: Billing Plans and Environments"
summary: "Set up a Power Platform pay-as-you-go plan: Azure subscription, billing plan, roles, the Licensing > Pay-as-you-go plans steps, linked environments, what is billed, Copilot Studio messages and how to unlink."
status: review
publish: false
author: mirko-p
date: 2026-12-23
topics: [power-platform-admin-center]
keypoints:
  - "Pay-as-you-go lets you pay for Power Apps and Power Automate through an Azure subscription with no license commitment or upfront purchase."
  - "You need an Azure subscription, a billing plan that links environments to it, and environments linked to that plan. One environment can be linked to only one billing plan."
  - "Creating a billing plan creates a Power Platform account resource in the Azure subscription, where charges appear."
  - "Copilot Studio messages have supported pay-as-you-go since December 1, 2024, billed for consumption at the end of each monthly billing period."
  - "You can unlink an environment at any time. Usage stops being billed and it works as a regular environment."
faq:
  - q: "What is the Power Platform pay-as-you-go plan?"
    a: "Microsoft Learn describes it as a way to pay for Power Apps and Power Automate through an Azure subscription, with no license commitment or upfront purchase. You can share apps and flows with any user in your organization and pay only when they are used."
  - q: "What do I need to set it up?"
    a: "An Azure subscription, a billing plan that links one or more environments to the subscription, and environments linked to the plan. Billing plans can be created in the Power Platform admin center or in Power Apps and Power Automate. Each environment links to one plan at a time."
  - q: "Where do the charges show up?"
    a: "Learn says that creating a billing plan creates a Power Platform account resource in the Azure subscription, and charges appear under that resource on the subscription bill. You can split costs across business units using Azure cost management reporting."
  - q: "Can I use it for Copilot Studio?"
    a: "Yes. Learn says pay-as-you-go has been supported for Copilot Studio messages since December 1, 2024, billed for the message capacity consumed at the end of each monthly billing period."
  - q: "Which environments can use it?"
    a: "The setup page says pay-as-you-go is available only for production and sandbox environments. The overview page lists no prices and links to separate pages for meters and pricing."
---

Pay-as-you-go lets an organization run Power Apps and Power Automate without buying per-user licenses first. Usage is billed through Azure. This article explains how the plan is built, using Microsoft Learn's overview and setup pages.

## What it is

Learn describes the plan as a way to pay for Power Apps and Power Automate through an Azure subscription, with no license commitment or upfront purchase. You can share apps and flows with any user in your organization and pay only when they're used. The plan includes Microsoft Dataverse storage and lets you buy more as needed. Usage is billed through Azure meters, and Azure cost management reporting lets you split costs across business units.

## The three building blocks

1. **An Azure subscription.** It is billed for the usage.
2. **A billing plan.** It links one or more environments to the subscription and holds the subscription details and the list of linked environments. Billing plans can be created in the Power Platform admin center or in Power Apps and Power Automate.
3. **Linked environments.** Each environment can be linked to only one billing plan at a time. A linked environment becomes a pay-as-you-go environment.

When a billing plan is created, a **Power Platform account resource** is created in the Azure subscription. Charges appear under that resource on the subscription's bill.

## Setup in the admin center

A second Learn page, Set up pay-as-you-go, has the steps.

**Azure prerequisites:** an active Azure subscription in your tenant, permission to create resources and register resource providers in it (Owners and Contributors usually have this), and a resource group.

**Power Platform roles:** Learn says Environment admin, Power Platform admin, Global admin and Dynamics 365 admin can all create billing plans. Environment admins can edit only plans they created and link only environments they administer. The other three roles can edit all plans and link all environments in the tenant.

**Steps:**

1. In the navigation pane, select **Licensing**.
2. Select **Pay-as-you-go plans** to open the **Billing plans** page.
3. Select **New billing plan**, then **Azure subscription**.
4. Enter a **Name**, choose the **Azure subscription** to bill and a **Resource group**. The Power Platform account resource is created in that group.
5. Choose the **Power Platform products** whose meters apply, then select **Next**.
6. In **Select environments**, pick a **Region** and the environments to link.
7. Select **Save**.

You can also start from Power Apps: open make.powerapps.com, select **Apps**, choose the app, then **Settings** > **Set up pay-as-you-go**, enter a name, pick subscription and resource group, and select **Connect subscription**. Learn says this turns on pay-as-you-go for all apps in that environment, and app passes already in the environment are ignored, not consumed.

**Restrictions:** pay-as-you-go is available only for production and sandbox environments. Creating a Microsoft 365 Copilot Chat billing plan automatically provisions a Microsoft 365 Copilot Chat environment, which admins cannot delete but can unlink.

## What is billed

- **Power Apps and Power Automate.** App usage, and Dataverse or Power Platform request usage above the included amounts, is billed through Azure meters. The overview does not break out per-user or per-app rates and points to a meters article.
- **Copilot Studio messages.** Pay-as-you-go has been supported for Copilot Studio messages since December 1, 2024. You pay for message capacity consumed at the end of each monthly billing period, with no upfront license commitment.
- **Dataverse storage.** Included capacity, with the option to add more as needed.

The page lists no prices and links to Microsoft's pricing information.

## When it fits

Learn lists these common uses:

- Apps with a large, infrequent or unpredictable user base.
- Measuring adoption of new apps before committing to prepaid licenses.
- Consolidating Power Platform costs with other Azure services.

## Turning it off

You can unlink an environment from its billing plan at any time. Its usage stops being billed and the environment works as a regular environment. In the admin center, edit the plan under **Billing policies** and remove the environment, or delete the environment's billing policy. Usage incurred up to that point is still billed. Deleting the billing plan does not delete its Power Platform account resource, which you remove separately in the Azure portal.

## Governance questions to settle first

These are practical questions, not statements from the page:

- Who owns the Azure subscription and its budget alerts?
- Which environments should be linked, for example one for a seasonal app?
- How will cost be reported back to business units?
- Which users already hold licenses, and how do those interact with pay-as-you-go usage?

The overview does not explain how pay-as-you-go interacts with existing per-user licenses, so check the licensing documentation before you mix models in one environment.

## Checklist

1. Choose the Azure subscription and confirm billing responsibility.
2. Read the setup, meters and pricing articles linked from the overview.
3. Create the billing plan and link one non-critical environment first.
4. Watch the Azure bill under the Power Platform account resource.
5. Link more environments, or unlink if the cost model does not fit.

## Related

- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)

## Sources

- [Pay-as-you-go plan overview](https://learn.microsoft.com/power-platform/admin/pay-as-you-go-overview)
- [Set up pay-as-you-go](https://learn.microsoft.com/power-platform/admin/pay-as-you-go-set-up)
