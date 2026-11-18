---
title: "Showback vs chargeback: allocating cloud cost to teams"
summary: "Showback shows each team the cloud cost attributed to it without moving money; chargeback posts that cost to the team's budget through finance. Microsoft's FinOps guidance generally recommends starting with showback, then cost allocation, then chargeback."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [showback, chargeback, finops]
keypoints:
  - "The FinOps Foundation says the difference is formality: chargeback posts expenses to official budgets, showback does not. Neither should be considered more mature than the other."
  - "Microsoft Learn says the three pieces can be implemented in any order, but generally recommends starting with showback, then cost allocation, and lastly chargeback based on that allocation strategy."
  - "Both need cost tied to an owner through accounts and tags. Showback can start at cloud-scope level; Learn bases chargeback on a cost allocation strategy and expects several tagging cycles."
  - "Shared costs need a documented rule. The FinOps Foundation names fixed, proportional and even-split models; Learn says not every shared cost needs to be redistributed."
  - "Cost allocation rules move cost between subscriptions, resource groups or tags in cost views, but do not change the invoice or support reservations and savings plans."
faq:
  - q: "Do I need chargeback if I already run showback?"
    a: "Not necessarily. The FinOps Foundation says showback is required in every FinOps practice, while chargeback depends on organisational accounting policy and may be unwarranted when technology costs go to a single cost center or an easily allocated set of cost centers. Our reading: add chargeback when finance wants each P&L owner to pay for what it consumes."
  - q: "Does an Azure cost allocation rule change what I am billed?"
    a: "No. Learn says cost allocation does not affect your billing invoice and billing responsibilities do not change; the chargeback process itself happens in your organization outside Azure. Rules also support only Enterprise Agreement and Microsoft Customer Agreement customers."
  - q: "Should teams see actual or amortized cost?"
    a: "Learn's showback guidance says to use actual costs for invoice reconciliation and amortized costs for cost allocation, because amortized cost smooths large purchases that would otherwise look like usage spikes. Say in each report which one you show."
---

Showback shows each team the cloud cost attributed to it, without moving money. Chargeback goes one step further and bills the team for that cost through the organisation's finance process. The FinOps Foundation puts the difference this way: "the primary difference between showback and chargeback is the formality" of posting expenses to official accounting budgets.

This article explains the two models, what they depend on, how shared cost is handled and how to choose. The sibling article "Implementing showback for Azure Virtual Desktop host pools" applies the same ideas to a concrete workload.

## Definitions

Microsoft Learn's page on data analysis and showback defines showback as "enabling cost visibility throughout an organization": transparency into cloud usage and cost across departments, teams and projects. Its page on invoicing and chargeback describes chargeback as receiving, reconciling and paying provider invoices, and then billing internal teams for their cloud costs "using existing internal finance tools and processes". Both belong to [FinOps](https://www.m365.fm/entity/finops/), and the entity pages on [showback](https://www.m365.fm/entity/showback/) and [chargeback](https://www.m365.fm/entity/chargeback/) give the short version.

| | Showback | Chargeback |
|---|---|---|
| What the team gets | A report of the cost attributed to it | A charge posted to its budget |
| Does money move? | No | Yes, inside the organisation |
| Who must agree | Engineering and the FinOps or cloud team | Engineering, finance and business owners |
| Data quality needed | Good enough to start conversations | Good enough to defend in a budget review |
| FinOps Foundation view | Required in every practice; showback can be used at any granularity | Depends on accounting policy; not needed everywhere |

The last row comes from the FinOps Foundation's capability page for invoicing and chargeback. The earlier rows are our reading of the two definitions. The Foundation adds that neither type of reporting should be considered more mature than the other, so a team that runs showback only is not behind.

## Both need cost tied to an owner

Both models need a way to tie each cost to an owner. Showback can start at the cloud scope level, for example per subscription, and Learn recommends basing chargeback on a cost allocation strategy. Learn's allocation page defines it as "the process of attributing, assigning, and redistributing shared cost and usage using accounts, tags, and other metadata to establish accountability among teams and projects". It lists the questions your metadata should answer: which cost center, which level of the organisational hierarchy, who is accountable, which project or application, and what the engineering purpose is.

In Azure, that metadata comes from scopes (subscriptions, resource groups) and [Azure resource tags](https://www.m365.fm/entity/azure-resource-tags/), reported in [Microsoft Cost Management](https://www.m365.fm/entity/microsoft-cost-management/). The allocation page says that once resources are tagged or organised into the right resource groups and subscriptions, you can report against that data as part of showback. It also says to use [Azure Policy](https://www.m365.fm/entity/azure-policy/) to enforce the tagging strategy and to use compliance as a KPI. The article "A tagging strategy for AVD cost allocation" covers the tagging mechanics.

Plan for iteration. Learn's allocation page says tagging "takes time to apply, review, and clean up" and to expect multiple tagging cycles after everyone has visibility into the cost data, because many people only notice a problem once they can see it.

## Which one to choose

Learn's invoicing page says the components can be implemented in any order, but "we generally recommend most organizations start with showback to ensure each team has visibility of the charges they're responsible for", then implement cost allocation to align costs with reporting hierarchies, and lastly chargeback based on that strategy.

Our reading of when each fits:

- **Showback only** suits organisations where cloud cost goes to a single cost center or an easily allocated set of them, where teams are still learning their usage, or where tags are not yet reliable. The FinOps Foundation says that when technology costs go to a single cost center or an easily allocated set of cost centers, the additional cost and burden of official chargeback reporting may be unwarranted.
- **Chargeback** suits organisations where finance requires each owner to pay for what it consumes. The Foundation describes this as ensuring each P&L owner pays for the resources or services it consumes.
- **Showback first, chargeback later** is the path Learn recommends, and it gives teams time to correct tags and challenge numbers before a charge is attached.

If you do move to chargeback, Learn says to collaborate with finance, business and technology stakeholders, document how chargeback works and be prepared for questions. Use the organisational allocation strategy; if you have none, it suggests simpler chargeback models that are fair and agreed by all stakeholders.

## Handling shared cost

Shared cost needs its own rule. Learn's allocation page lists shared services such as application hosting (including Azure Virtual Desktop), observability (Azure Monitor, [Log Analytics](https://www.m365.fm/entity/log-analytics/)), management and security, networking, databases and collaboration. It recommends a plan with "rules and methods for dividing the shared costs fairly and equitably" and notes that not all shared costs need to be redistributed. The FinOps Foundation says some early practices fund shared items centrally rather than allocating them to cost centers.

The Foundation's allocation page names three families of rules: fixed amounts, proportional splits, and proxy metrics for variable splits. Its Walk level lists the models as proportional, fixed and even-split.

An illustration with invented figures. Three teams run workloads, and 3,000 currency units of shared network and monitoring cost must be divided. Their direct compute cost is 6,000 (team A), 3,000 (team B) and 1,000 (team C).

| Rule | Team A | Team B | Team C |
|---|---|---|---|
| Even split | 1,000 | 1,000 | 1,000 |
| Proportional to compute | 1,800 | 900 | 300 |
| Fixed 50/30/20 | 1,500 | 900 | 600 |

The rule moves team C's share from 300 to 1,000. None is the right answer for every organisation; the point is that the rule must be written down and agreed before anyone is charged.

### What Azure can do for you

Microsoft Cost Management has cost allocation rules. Learn says they let you reassign or distribute the costs of shared services: costs from subscriptions, resource groups or tags are assigned to other subscriptions, resource groups or tags. Key conditions:

- Support is limited to Enterprise Agreement customers and Microsoft Customer Agreement customers, bought through a Microsoft representative or the Azure website.
- Creating a rule needs the Enterprise Administrator role (EA) or Billing account owner (MCA).
- Split options are distribute evenly, total cost, compute cost, storage cost, network cost, or custom percentages that total 100%.
- Rules are processed in the order created and can take up to 24 hours to take effect; changes can take up to two hours to reprocess.
- Cost allocation does not support purchases, including reservations and savings plans, and does not change the invoice. Learn says its primary purpose is to help you charge back costs, and that the chargeback process happens in your organisation outside Azure.
- Allocated cost appears in cost analysis, budgets and forecast views, and in exports through a `costAllocationRuleName` column. The Cost Management Power BI app and the Power BI Desktop connector do not support it.

Our reading: if these limits do not fit, the same rules can be applied in a spreadsheet or data pipeline built on exported data.

## Commitments and amortization

Discounts from reservations and savings plans complicate allocation. Learn's allocation page says it does not cover commitment discounts and refers to rate optimization for showback and chargeback handling. The FinOps Foundation's maturity description for chargeback says that at Walk level most commitment-based purchases are charged based on consumption.

Learn's showback page gives a simple rule: use actual cost for invoice reconciliation and amortized cost for cost allocation, because amortization smooths large purchases that would look like usage spikes. Show teams one of the two and label it, otherwise two reports of the same month will disagree. Learn also notes that a stopped VM keeps charging unless it is deallocated, so cost reports can show spend for resources users believe are off.

## Common failure points

- **Invoice timing.** The Foundation says invoices can arrive 3 to 12 days after month-end, so month-end chargeback may use estimates later reconciled to final invoices through journal entries.
- **Unowned cost.** Learn's allocation page suggests tracking the percentage of unallocated shared cost as a KPI. The Foundation lists the percentage of technology cost allocated directly to organisational units, and tagging compliance above 90% appears among its reporting measures.
- **Unclear audience.** Learn's showback page says reports should give each stakeholder an appropriate level of detail. Use the built-in cost analysis views that fit the question, such as subscriptions and resource groups to see which teams cost the most, and avoid the most detailed view for every question.
- **No feedback loop.** Learn recommends noting questions you cannot answer from the cost data and feeding them back into the allocation strategy so more metadata is added.

## A starting plan

1. Choose the allocation unit: team, cost center or workload.
2. Fix the tag schema and enforce it with policy.
3. Publish a showback view per team in Cost Management and agree who owns each tag value.
4. Write the shared-cost rule, including which costs stay central.
5. Review the unallocated percentage monthly and correct tags.
6. Decide with finance whether chargeback is justified; if so, document the process and the actual versus amortized choice.

## Sources

- [Microsoft Learn: Invoicing and chargeback (FinOps Framework)](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/manage/invoicing-chargeback)
- [Microsoft Learn: Allocation (FinOps Framework)](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/understand/allocation)
- [Microsoft Learn: Data analysis and showback](https://learn.microsoft.com/en-us/cloud-computing/finops/capabilities-analysis-showback)
- [Microsoft Learn: Create and manage Azure cost allocation rules](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/allocate-costs)
- [FinOps Foundation: Invoicing and chargeback](https://www.finops.org/framework/capabilities/invoicing-chargeback/)
- [FinOps Foundation: Allocation](https://www.finops.org/framework/capabilities/allocation/)
- [FinOps Foundation: Reporting and analytics](https://www.finops.org/framework/capabilities/reporting-analytics/)
