---
title: "Set Up Pay-As-You-Go Billing for Microsoft 365 Copilot Chat Agents"
summary: "Set up Microsoft Copilot pay-as-you-go for Copilot Chat and SharePoint agents: roles, the billing policy steps in the Microsoft 365 admin center, budgets, connecting services, disconnecting and what the pages do not say about meters."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [copilot-chat, copilot-control-system]
keypoints:
  - "Pay-as-you-go gives usage-based access to Copilot Chat, SharePoint agents and the Copilot Retrieval API (preview) without a full license."
  - "Setup is two steps: add a billing policy in Copilot > Billing & usage, then connect it to a service on the Pay-as-you-go services tab."
  - "You need Billing Administrator, AI Administrator or Global Administrator, plus an Azure subscription and resource group with Owner or Contributor rights."
  - "Budgets only send email notifications. They are not enforced, and usage continues after the budget is exceeded."
  - "Up to 50 billing policies can be created per tenant. After turning it off, users can take up to two hours to lose access."
faq:
  - q: "What does Microsoft Copilot pay-as-you-go cover?"
    a: "Microsoft Learn says it gives usage-based access to Copilot features without a full license and applies to Microsoft Copilot Chat, SharePoint agents and the Microsoft Copilot Retrieval API (preview). Copilot Cowork and Work IQ API billing are managed separately."
  - q: "Which admin roles can set it up?"
    a: "The setup page lists Billing Administrator, AI Administrator or Global Administrator, with a recommendation to limit Global Administrators. You also need an Azure subscription in the same tenant and Owner or Contributor rights on the subscription and resource group."
  - q: "Where do I find the settings?"
    a: "In the Microsoft 365 admin center go to Copilot > Billing & usage. Add a billing policy on the Billing policies tab, then open the Pay-as-you-go services tab, select Microsoft Copilot Chat or SharePoint agents and select your billing policy."
  - q: "Do budgets stop usage?"
    a: "No. Learn says budgets trigger email notifications only. They are not enforced and usage continues after the budget is exceeded."
  - q: "Can I be charged twice if the policy exists in two admin centers?"
    a: "Learn says pay-as-you-go can exist in both the Power Platform admin center and the Microsoft 365 admin center and that you are charged only once. It recommends managing all policies in one location."
---

Pay-as-you-go lets an organization offer Copilot Chat and SharePoint agents to users without buying a Copilot license for each of them first. Costs follow usage and are billed through an Azure subscription. This guide follows Microsoft Learn's overview and setup pages for Microsoft Copilot pay-as-you-go.

## What it covers

Learn describes the service as usage-based access to Copilot features without a full license. It applies to **Microsoft Copilot Chat**, **SharePoint agents** and the **Microsoft Copilot Retrieval API (Preview)**. Copilot Cowork and Work IQ API billing are managed separately in the Microsoft admin center.

It is aimed at admins who want to see adoption before deciding on prepaid licenses, and at organizations that want cost to scale with demand.

## Who can manage it

Admin roles that can view and manage it in the Microsoft 365 admin center: Global Administrator, Billing Administrator, AI Administrator and Global Reader (read-only). Microsoft recommends the role with the fewest permissions and limiting Global Administrator to emergencies.

## Prerequisites for setup

- One of the roles Billing Administrator, AI Administrator or Global Administrator.
- An Azure subscription in the same tenant as Microsoft 365. You can create one during billing policy setup.
- An Azure resource group in that subscription, which you can also create during setup.
- Owner or Contributor rights on the subscription and resource group. If you create them during setup, you get Owner automatically.

## Step 1: create a billing policy

A billing policy is a unique billing identifier that combines an Azure subscription and a set of users.

1. In the Microsoft 365 admin center, go to **Copilot** > **Billing & usage**.
2. On the **Billing policies** tab, select **Add a billing policy**.
3. Complete the tasks in order: create the policy and billing details, add users or groups, and optionally set a budget.
4. On **Review and finish**, check the details and select **Create policy**.

You can create up to 50 billing policies per tenant. If you need a new subscription during setup, the page notes you select **Create a new subscription** and the billing account must use a Microsoft Customer Agreement.

## Step 2: connect the policy to a service

1. Go to **Copilot** > **Billing & usage**.
2. Open the **Pay-as-you-go services** tab.
3. Select **Microsoft Copilot Chat** or **SharePoint agents**, then select your billing policy.

Rules: creating a policy alone doesn't complete setup, you connect or disconnect one policy at a time, and any existing all-users policy must be disconnected before connecting a user-specific policy.

## Budgets and monitoring

Budgets trigger email notifications at the percentage milestones you choose. They are not enforced, so usage continues after the budget is exceeded. For monitoring, the overview names the **Cost Management** page in the Microsoft 365 admin center for each pay-as-you-go service and the cost breakdown in the Azure portal. Microsoft announces new pay-as-you-go features in a message center post.

## Check that it works

Learn suggests having an eligible user test an agent such as Learning Coach, Writing Coach or Career Coach with a prompt like What can you do? That prompt uses about 12 credits. Then check usage in the Copilot Credits Report.

## Turning it off

- **Disconnect** a billing policy from a service. Linked users lose access to the metered agents in that service. Users can take up to two hours to lose access.
- **Delete** a billing policy to remove the billing infrastructure. All connected services are disconnected.
- **Disable the feature** entirely. A Global Administrator or subscription owner can do this in the Microsoft 365 admin center. It is disabled by default.

## Relation to the Power Platform

Pay-as-you-go can exist in both the Power Platform admin center and the Microsoft 365 admin center. Learn says you are charged only once and recommends managing all policies in one location. Copilot Studio has its own pay-as-you-go billing, and the overview does not describe how its meters relate to the Copilot Chat meters.

## What the pages do not say

The overview does not name the Azure meter for Copilot Chat and gives no prices. It links to a separate meters article, which I did not read. If you plan a budget, read that article first.

## Checklist (my advice)

1. Check your roles and Azure subscription rights.
2. Create a billing policy with the right users or groups.
3. Connect it to Copilot Chat or SharePoint agents.
4. Add a budget alert and remember it is only a notification.
5. Test with an eligible user and read the credits report.

## Related

- [Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Copilot Control System](https://www.m365.fm/entity/copilot-control-system/)

## Sources

- [Microsoft Copilot Pay-as-You-Go Service Overview (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/copilot/pay-as-you-go/pay-as-you-go-overview)
- [Set Up Microsoft Copilot Pay-as-You-Go Services (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/copilot/pay-as-you-go/setup)
