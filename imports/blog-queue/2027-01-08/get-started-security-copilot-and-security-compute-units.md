---
title: "How to Get Started With Microsoft Security Copilot and Security Compute Units"
summary: "Get started with Microsoft Security Copilot: the E5 and E7 versus other customer paths, what eligibility does and does not enable, first steps with agents and chat, cloud limits, and what the page does not explain about SCUs and billing."
status: review
publish: false
author: mirko-p
date: 2027-01-08
topics: [microsoft-security-copilot, security-compute-unit]
keypoints:
  - "First identify your category. E5 and E7 customers have Security Copilot included but it must be rolled out in the tenant. Others provision Security Compute Units by manual onboarding."
  - "Eligibility alone does not enable access. Provisioning must complete before use."
  - "The documentation applies to commercial cloud customers only. It is not designed for GCC, GCC High, DoD or Azure Government."
  - "Start with agents from Home, or start a chat from New session. You can save prompts as a promptbook."
  - "The page does not define SCUs, give prices or describe provisioned and overage billing."
faq:
  - q: "Who gets Security Copilot included?"
    a: "Microsoft Learn says Microsoft 365 E5 or E7 customers have it included with the license. Eligibility alone does not enable access, so Security Copilot must be rolled out in the tenant."
  - q: "What do other customers do?"
    a: "Customers without E5 or E7 follow manual onboarding to provision Security Compute Units. The page links to a separate onboarding article."
  - q: "Does it work in government clouds?"
    a: "The page says the documentation applies only to commercial cloud customers and that Security Copilot is not designed for use in US government clouds, including GCC, GCC High, DoD and Azure Government."
  - q: "How do I start using it?"
    a: "Select Home, then an agent or Discover agents, and run it. Or go to All history, select New session and enter a prompt. You can save prompts as a promptbook."
  - q: "What does an SCU cost?"
    a: "The page does not say. It does not define SCUs, give pricing or describe provisioned and overage billing."
---

Security Copilot onboarding depends on one question: do you have Microsoft 365 E5 or E7? If yes, the product is included and Microsoft rolls it out in your tenant. If not, you provision Security Compute Units (SCUs) yourself. This guide follows the Microsoft Learn getting-started page. That page is short on SCU detail, and this guide says where.

## Scope

The documentation applies only to commercial cloud customers. Security Copilot is not designed for US government clouds, including GCC, GCC High, DoD and Azure Government.

## Step 1: identify your category

Do not begin onboarding until you know whether your organization has an E5 or E7 license.

- **Microsoft 365 E5 or E7.** Security Copilot is included with the license. Learn stresses that eligibility alone does not enable access. It must be rolled out in your tenant, and once provisioning completes it is ready to use. The inclusion details are on a separate page.
- **Everyone else.** Follow manual onboarding to provision SCUs. The page links to an onboarding article for non-E5 and non-E7 customers.

## Step 2: follow the matching path

E5 and E7 tenants are provisioned automatically as part of the rollout. Other tenants complete the manual onboarding. The page says that whether you need to buy capacity depends on your license status. It does not give the onboarding steps.

## Step 3: start using it

- **Agents.** The page recommends starting here. Select **Home**, then an agent or **Discover agents**, and run it.
- **Chat.** Go to **All history**, select **New session** and enter a prompt. A different section of the page says **History**, so labels may vary.
- **Promptbooks.** Save prompts as a promptbook to reuse them.

The page gives role-based pointers. Administrators assign access and roles, review usage and capacity, and set up agents. Security analysts set up an agent, browse the agent store and try an agent in Microsoft Defender.

## Two homepages during rollout

The page notes that, during rollout, you might see either an agents-first homepage or a chat-first homepage. In the agents-first experience, the page describes different starting points for different people. An administrator assigns access and roles, reviews usage and capacity, and discovers and sets up agents. A security analyst sets up an agent, browses the agent store and tries an agent in Microsoft Defender. In both experiences you can open a chat session, and in both you can save a prompt as a promptbook. If your tenant shows a different layout from the page, the steps still describe the same two ways to begin: agents or chat.

## Next steps named on the page

The page ends with a link to explore agents, plugins, connectors and promptbooks in your workflows. It gives no detail on any of them, so this guide does not describe plugins or connectors. Read those pages before you plan which data sources Security Copilot should use.

## Caveats

- Your experience may differ during rollout. You may see an agents-first homepage or a chat-first homepage.
- Navigation labels in the page are inconsistent, such as Home and homepage, or History and All history.

## What the page does not say

- What an SCU is, what it costs or how provisioned and overage capacity are billed.
- Capacity creation steps and sizing. Those are on the manual onboarding page.
- An Azure subscription requirement.
- Named roles or a permission model.
- Plugin details. They appear only in a link title.

Treat any statement about SCU pricing or billing as unconfirmed until you read the dedicated pricing and onboarding pages.

## A starting outline

This outline is practical advice built on the page.

1. Check your license: E5, E7 or neither.
2. If E5 or E7, check with your admin whether the tenant rollout has finished.
3. If neither, read the manual onboarding article and plan capacity before you start.
4. Run one agent from Home as a first test.
5. Try a chat session and save a useful prompt as a promptbook.

## Typical mistakes

- Assuming that an E5 or E7 license already gives users access.
- Starting onboarding before you know the license category.
- Planning use in a government cloud.
- Assuming the screens match the documented labels.

## Related

- [Microsoft Security Copilot](https://www.m365.fm/entity/microsoft-security-copilot/)
- [Security Compute Unit](https://www.m365.fm/entity/security-compute-unit/)
- [Microsoft Sentinel](https://www.m365.fm/entity/microsoft-sentinel/)

## Sources

- [Get started with Microsoft Security Copilot (Microsoft Learn)](https://learn.microsoft.com/copilot/security/get-started-security-copilot)
