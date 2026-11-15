---
title: "Azure Reservations vs Savings Plans: How to Decide"
summary: "Azure reservations vs savings plans for compute: what each commits to, flexibility, when to choose each and the order Microsoft suggests for combining them, with gaps the Learn page leaves open."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [azure-reservations, azure-savings-plans]
keypoints:
  - "A reservation commits to a specific resource product or configuration. A savings plan commits to a fixed hourly spend on eligible services across Azure regions."
  - "Choose a reservation for continuously running, stable workloads. Choose a savings plan for dynamic or evolving workloads, especially across services or regions."
  - "Microsoft suggests this order: right-size, exchange underused reservations, trade them for savings plans, then buy new reservations and plans."
  - "Savings plan purchases cannot be canceled or refunded. Reservations can be exchanged, and refunds are limited, according to the product pages."
  - "The decision page gives no discount percentages. Check the product pages for covered services, scope and eligibility before you buy."
faq:
  - q: "What is the main difference between a reservation and a savings plan?"
    a: "According to Microsoft Learn, with a reservation you commit to a specific resource product or configuration for a set period, for example a D2v4 virtual machine in Japan East. With a savings plan you commit to a fixed hourly spend on eligible services across Azure regions."
  - q: "When should I choose a reservation?"
    a: "Microsoft Learn says to choose reservations for compute or database workloads that run continuously and are highly stable, with no anticipated change to attributes such as instance type, instance family or region. When fully utilized, they can provide greater savings than savings plans for these workloads."
  - q: "When should I choose a savings plan?"
    a: "Learn says to choose savings plans when compute or database workloads are dynamic or evolving, particularly if they use multiple eligible services or run in different Azure regions."
  - q: "Can I use both?"
    a: "Yes. Learn suggests a sequence for combining them that limits unused commitments: right-size first, exchange underutilized reservations, trade in underutilized reservations for savings plans, then purchase new reservations for stable workloads and new savings plans for an optimized baseline."
  - q: "Can I cancel a savings plan or a reservation?"
    a: "Microsoft Learn's savings plan overview says savings plan purchases cannot be canceled or refunded. The reservations overview says you can exchange a reservation for another of the same type and refund it up to $50,000 USD in a 12-month rolling window."
  - q: "How much will I save?"
    a: "The decision page gives no discount percentages. The reservations overview says reservations can reduce costs by up to 72 percent from pay-as-you-go prices, and the savings plan overview says discounts vary by product and term. Use your own pricing for exact figures."
---

Choose an Azure reservation when a workload runs continuously and its configuration, such as instance type, family or region, is unlikely to change. Choose a savings plan when workloads are dynamic or evolving, especially across services or regions. Microsoft also describes using both, in a set order. This article follows the Microsoft Learn page that helps you decide, and it flags what that page does not cover.

## Two ways to commit

Learn says Azure offers two ways to save on usage by committing for one or three years. The savings plan overview says both savings plan types are available with one-year or three-year commitments, and the reservations overview describes one-year or three-year plans. The decision page's examples are a one-year reservation and a three-year savings plan.

| | Reservation | Savings plan |
| --- | --- | --- |
| Commitment | A specific resource product or configuration; the attributes, such as instance family and region, depend on the reservation product | A fixed hourly spend on eligible services across Azure regions |
| Scope of benefit | Usage that matches the attributes and scope chosen at purchase | Eligible usage within the plan's benefit scope, up to the hourly commitment |
| Example on Learn | A D2v4 VM in Japan East for one year | $5.00 per hour for three years |
| Flexibility | Tied to the attributes the reservation product requires | Spend-based, applies across the eligible services and regions of the plan type |

## When to choose a reservation

Learn says to choose reservations for compute or database workloads that:

- run continuously and are highly stable, and
- have no anticipated changes to the attributes the reservation requires, such as instance type, instance family or region.

When fully utilized, reservations can provide greater savings than savings plans for these workloads, according to the page.

## When to choose a savings plan

Learn says to choose savings plans when compute or database workloads are dynamic or evolving, particularly if they use multiple eligible services or run in different Azure regions. Pick a compute savings plan for eligible compute usage or a database savings plan for eligible database usage.

The page says each plan provides flexible benefit application across the eligible services and regions for that plan type, with automatic optimization.

## Using both: the order Microsoft suggests

To improve savings and limit unused commitments, Learn suggests this sequence:

1. **Right-size first.** Remove unused or oversized resources before buying any discount.
2. **Exchange underutilized reservations.** Reassign them to better-fitting configurations.
3. **Trade in underutilized reservations for savings plans.** Convert rigid reservations to spend-based plans when usage is variable.
4. **Purchase new reservations.** Only for stable, well-understood workloads.
5. **Purchase new savings plans.** Add flexible commitments sized to an optimized baseline.

Learn puts it briefly: discounts reduce rates, not waste. Azure Advisor's VM recommendations are one place to start right-sizing, but note that Advisor savings figures ignore reservations and savings plans, according to the Advisor cost page.

## A simple decision checklist (my advice)

This checklist is my own reading of the Learn criteria, not a Microsoft procedure. Ask these questions for each workload:

1. Will it run all the time for the commitment term?
2. Is the instance type or family fixed?
3. Is the region fixed?
4. Is there a chance of moving to other compute services?

If all answers are yes or fixed, a reservation fits the Learn guidance. If any answer is uncertain, the savings plan guidance fits better. For a mixed estate, one option is to split the workloads: stable core on reservations, variable remainder on a savings plan.

## Facts from the product pages

The decision page leaves details to the overview pages. These are the points those pages state.

**Savings plans (compute and database)**

- You commit to a fixed hourly spend for one or three years. Discounts vary by product and commitment term, not by commitment amount.
- There are two types: savings plans for compute and savings plans for databases. The database type covers services such as Azure SQL Database, Azure SQL Managed Instance, Azure Database for PostgreSQL and MySQL and Azure Cosmos DB.
- You can pay up front or monthly, and the total cost is the same.
- Compute savings plan services listed: Azure Virtual Machines, App Service, Functions premium plan, Container Instances, Dedicated Host, Container Apps and Azure Spring Apps for Enterprise. Software, networking and storage charges are not covered.
- The benefit applies automatically each hour, starting with the usage that receives the highest discount. Usage above the commitment is billed at pay-as-you-go rates, and unused commitment for an hour expires.
- Savings plan purchases cannot be canceled or refunded. You can make a new commitment or trade in one or more eligible reservations for a savings plan.
- Availability is for Enterprise Agreement, Microsoft Customer Agreement and Microsoft Partner Agreement customers, with offer type conditions for EA.

**Reservations**

- One-year or three-year plans, paid up front or monthly with the same total cost.
- Learn says they can reduce resource costs by up to 72 percent from pay-as-you-go prices.
- The discount applies automatically to usage that matches the SKU, region where applicable and scope selected at purchase. It applies hourly for all reservations except Azure Databricks.
- You can exchange a reservation for another of the same type, and refund one up to $50,000 USD in a 12-month rolling window. The refund limit applies to all reservations in the scope of your agreement with Microsoft.
- The list of services is broader than compute, including reserved capacity for Blob storage, Azure Files and Cosmos DB, SQL Database, Synapse, Databricks and others. For Windows VMs and SQL Database, software costs are not covered, and Azure Hybrid Benefit can cover licensing.

Both overview pages refer to a scope setting but do not list the scope options. Read the scope documentation before you buy, because scope decides which usage receives the benefit.

## What is still open

The decision page gives no discount percentages for savings plans, and the savings plan overview says only that discounts vary. For exchange and refund conditions beyond the statements above, read the current reservation and savings plan documentation, because a wrong assumption can turn a flexible plan into a fixed cost.

## Typical mistakes (my advice)

- Buying commitments before right-sizing.
- Choosing a reservation for a workload that may change region.
- Choosing a savings plan for a stable workload and assuming it always saves as much as a fully used reservation. Learn says fully utilized reservations can provide greater savings than savings plans for stable workloads.
- Treating the example numbers on the page as prices.

## Related

- [Azure Reservations](https://www.m365.fm/entity/azure-reservations/)
- [Azure Savings Plans](https://www.m365.fm/entity/azure-savings-plans/)
- [Azure Advisor](https://www.m365.fm/entity/azure-advisor/)

## Sources

- [Decide between a savings plan and a reservation (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/savings-plan/decide-between-savings-plan-reservation)
- [What are savings plans? (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/savings-plan/savings-plan-overview)
- [What are Azure Reservations? (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Optimize virtual machine (VM) or virtual machine scale set (VMSS) spend by resizing or shutting down underutilized instances (Microsoft Learn)](https://learn.microsoft.com/azure/advisor/advisor-cost-recommendations)
