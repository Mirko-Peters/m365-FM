---
title: "Audit Copilot Studio Billing Capacity and Governance Controls in Power Platform Admin Center"
summary: "A review routine for Copilot Studio costs: where capacity and consumption live in the admin center, how overage settings and per-agent limits work, which reports to download and how to read a spike."
status: review
publish: false
author: mirko-p
date: 2026-12-11
topics: [copilot-studio, power-platform-admin-center, power-platform]
keypoints:
  - "Open Power Platform admin center > Licensing > Products > Copilot Studio and use the Summary and Environments tabs."
  - "Purchased Copilot Credits are pooled across the tenant and must be assigned to an environment before agents there can use Copilot Studio features."
  - "Capacity overages are set per environment: draw from tenant capacity or bill to a pay-as-you-go plan. With neither, features can stop after the allocation is used."
  - "Per-agent monthly limits can notify admins and hard-stop an agent, but they are not applied instantly and do not stop the agent flows the agent calls."
  - "Consumption reports do not show single conversations or token counts. Azure Cost Management shows billed amounts but not environment or agent attribution."
faq:
  - q: "Where do I see Copilot Studio capacity and consumption?"
    a: "Per Microsoft Learn, sign in to the Power Platform admin center, select Licensing, then under Products select Copilot Studio and open the Summary or Environments tab. The Summary tab shows capacity cards for pay-as-you-go credits and prepaid capacity. The Copilot Credits capacity tab adds consumption by product, a three month daily trend and top environments by usage."
  - q: "What happens when an environment runs out of Copilot Credits?"
    a: "Learn says that with no overage source enabled, an environment can consume only its allocated prepaid credits and experiences that require credits can stop working. For agent flows, new runs are blocked while the parent agent continues with non-flow interactions."
  - q: "Can I cap what a single agent consumes?"
    a: "Yes. On the Summary tab select Manage Agents to see limits, month-to-date billed credits and status such as Nearing limit or Over limit. After you set a limit you can configure notifications and a hard stop that turns the agent off at the limit. Limits are not applied instantly, so leave a margin, and the limit does not stop the agent flows it calls."
  - q: "How do I investigate a sudden spike in credits?"
    a: "Microsoft Learn suggests downloading the detailed environment report for the period, filtering to billed credits and grouping by agent, Product or AI feature and LLM model. The reports do not show single-conversation usage, token counts or why a row was not billed."
  - q: "Where are pay-as-you-go charges visible?"
    a: "In Azure Cost Management, per Learn. Usage can take up to 24 hours to appear, and Cost Management cannot attribute costs to an environment, app or agent. Use the Billing plan page in the Power Platform admin center and Download reports for that detail."
---

An audit of Copilot Studio spending comes down to five checks: where capacity sits, which environments are allowed to overspend, which agents have limits, who can author, and whether reports explain the last spike. All of these live in the Power Platform admin center and, for pay-as-you-go, in Azure Cost Management.

## Step 1: Open the capacity view

1. Sign in to the Power Platform admin center.
2. Select **Licensing**.
3. Under **Products**, select **Copilot Studio**.
4. Open the **Summary** or **Environments** tab.

The Summary shows cards for pay-as-you-go credits (active billing plans with the Copilot Studio meter and month-to-date billed credits) and prepaid capacity (available, assigned and consumed). The Copilot Credits capacity tab shows consumption by product, a daily trend over the last three months and top environments by usage. Daily detail covers the current month and the last two full months, and monthly data covers 12 months.

## Step 2: Check environment allocation and overage

Purchased credits are pooled across the tenant. Select **Manage Capacity** on the prepaid card, choose an environment and enter the number of **Copilot Credits**. An environment needs an allocation before its agents can use Copilot Studio features.

Under **Capacity overages**, Learn offers two options for an environment that exhausts its allocation. The page does not say whether both can be enabled together:

- **Draw from the available capacity in my tenant**, the default for eligible environments with no allocation configuration.
- **Bill to my pay-as-you-go billing plan**.

Learn states that with no overage source enabled the environment consumes only its allocated credits and features can stop after that. When an environment has no credits, new agent flow runs are blocked while the parent agent keeps working for non-flow interactions. The licensing page adds that Copilot Studio enforces purchased capacity monthly and unused credits do not carry over.

## Step 3: Review per-agent limits

On the Summary tab select **Manage Agents**. You can search agents, see billed agents across the tenant, see limits and month-to-date billed credits, turn an agent off, and see status: **Within limit**, **Nearing limit** or **Over limit**.

- Prepaid environments: the agent must stay within the allocated pool.
- Pay-as-you-go environments: any limit can be set.
- After you set a limit, Learn describes two guardrails: notifications to admins at environment and tenant level as usage approaches the limit, and a hard stop that turns the agent off at the limit. The page does not state thresholds.

Caveats from Learn: limits are not applied instantly, so an agent can keep answering for a while, and the limit does not stop agent flows the agent calls, which are billed and checked separately.

## Step 4: Check who can author

For control over who builds agents, the capacity page's pay-as-you-go FAQ says to go to **Settings** in the Power Platform admin center, update the **Copilot Author** setting and assign a security group. Only members of that group have access to Copilot Studio. The licensing page describes the same pattern with an Entra security group for the Copilot Studio authors role.

## Step 5: Pull the reports

- **Tenant level**: on the Summary tab select **Download report** and choose environment, agent or user. Start with the environment report. Per Learn, the user report shows per-user consumption only for agents on the standard harness.
- **Environment level**: on **Environments**, select an environment, open **Copilot credit consumption details** on the **Copilot Credits capacity** tab, select **Download**, choose a timeframe and select **Start**.

Columns include agent name, product or AI feature, channel, LLM model, knowledge source or tool, and billed and non-billed credits.

To investigate a spike, filter to billed credits and group by agent, product or AI feature, and LLM model. For a reasoning model estimate, filter to **Text and generative AI tools (premium)**, group by agent and model, and multiply credits by 100 to estimate billed tokens, since reasoning models bill 10 credits per 1,000 tokens. Learn calls this approximate, because credits from prompt tools using the same model do not convert this way.

Report limits: no single conversation or message usage, no token counts, no reason a row was not billed. In the user report, usage from sessions without sign-in can appear under user ID `00000000-0000-0000-0000-000000000000`.

## Step 6: Reconcile with Azure billing

Pay-as-you-go charges appear in Azure Cost Management, with usage taking up to 24 hours to show. Each billing plan maps to a Power Platform account resource with the same name, so filter on it. Cost Management does not break usage down by environment, agent or user. Use **Billing plan** > **Download reports** for that, and set Azure budgets and alerts per billing policy or meter.

The licensing page says that when Microsoft 365 Copilot licensed users use agents in Copilot Chat, Teams or SharePoint, classic answers, generative answers and Microsoft Graph tenant grounding do not count against the Copilot Studio message pack or meter (zero-rated). My own inference: such usage may explain rows without billed credits in the reports. The pages do not state how zero-rated usage is labelled in the reports, so check before treating non-billed rows as an error.

## A repeatable monthly review

| Check | Where | Question to answer |
|---|---|---|
| Allocation | Summary, Manage Capacity | Does each environment have credits that match its use? |
| Overage | Capacity overages | Is every environment set deliberately, not by default? |
| Agent limits | Manage Agents | Is any agent Nearing limit or Over limit? |
| Authors | Copilot Author setting | Is the security group still correct? |
| Reports | Download report | Which agent, feature and model drove the top credits? |
| Azure | Cost Management | Do billed amounts match the admin center? |

The table is my own checklist, not a Microsoft list. Because purchased capacity is enforced monthly and unused credits do not carry over (licensing page), my suggestion is to run the review early in the month and again before month end. Document what you decided, so the next review can compare.

## What the pages do not cover

The pages I read describe no alert thresholds and no environment strategy or data policy settings. This article therefore covers billing capacity and the author setting, not DLP or environment design. An agent's Monitor page in Copilot Studio shows billed credits only, so it shows less than the reports.

## Related

- [Copilot Studio](https://www.m365.fm/entity/copilot-studio/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)
- [Power Platform](https://www.m365.fm/entity/power-platform/)

## Sources

- [Manage Copilot Credits and capacity for Copilot Studio](https://learn.microsoft.com/en-us/power-platform/admin/manage-copilot-studio-copilot-credits-capacity)
- [Standard harness licensing for Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing)
- [View usage and billing for pay-as-you-go plan](https://learn.microsoft.com/en-us/power-platform/admin/pay-as-you-go-usage-costs)
