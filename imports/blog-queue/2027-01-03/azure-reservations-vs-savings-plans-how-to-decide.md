---
title: "Azure Reservations vs Savings Plans: How to Decide"
summary: "Azure reservations vs savings plans for compute: what each commits to, flexibility, when to choose each and the order Microsoft suggests for combining them, with gaps the Learn page leaves open."
status: review
publish: false
author: mirko-p
date: 2027-01-03
topics: [azure-reservations, azure-savings-plans]
keypoints:
  - "A reservation commits to a specific compute instance or family in a specific region. A savings plan commits to an hourly spend across regions."
  - "Choose a reservation for continuously running, stable workloads. Choose a savings plan for dynamic workloads, mixed families or changing regions."
  - "Microsoft suggests this order: right-size, exchange underused reservations, trade them for savings plans, then buy new reservations and plans."
  - "Savings plan purchases cannot be canceled or refunded. Reservations can be exchanged, and refunds are limited, according to the product pages."
  - "The decision page gives no discount percentages. Check the product pages for covered services, scope and eligibility before you buy."
faq:
  - q: "What is the main difference between a reservation and a savings plan?"
    a: "According to Microsoft Learn, a reservation commits to a specific compute instance or instance family in a specific Azure region. A savings plan commits to a specific hourly expenditure on eligible compute services across all Azure regions."
  - q: "When should I choose a reservation?"
    a: "Microsoft Learn says reservations suit workloads that run continuously and are highly stable, with no expected change to instance type, family or region. When fully utilized they provide the greatest savings."
  - q: "When should I choose a savings plan?"
    a: "Learn recommends savings plans for dynamic or evolving workloads, workloads using various instance families or compute services, and workloads running in or moving to different regions."
  - q: "Can I use both?"
    a: "Yes. Learn recommends using both, in an order that limits wasted commitments: right-size first, exchange underutilized reservations, trade in underutilized reservations for savings plans, then purchase new reservations for stable workloads and new savings plans for an optimized baseline."
  - q: "Can I cancel a savings plan or a reservation?"
    a: "Microsoft Learn's savings plan overview says savings plan purchases cannot be canceled or refunded. The reservations overview says you can exchange a reservation for another of the same type and refund it up to $50,000 USD in a 12-month rolling window."
  - q: "How much will I save?"
    a: "The decision page gives no discount percentages. The reservations overview says reservations can reduce costs by up to 72 percent from pay-as-you-go prices, and the savings plan overview says discounts vary by product and term. Use your own pricing for exact figures."
---

Choose an Azure reservation when a workload runs continuously on a known instance type or family in a known region. Choose a savings plan when usage varies across instance families, services or regions. Microsoft also describes using both, in a set order. This article follows the Microsoft Learn page that helps you decide, and it flags what that page does not cover.

## Two ways to commit

Learn says Azure offers two ways to save on usage by committing for one or three years. The page does not say whether every term applies to both options. Its examples are a one-year reservation and a three-year savings plan.

| | Reservation | Savings plan |
| --- | --- | --- |
| Commitment | A specific compute instance or instance family in a specific region | A specific hourly spend on eligible compute services |
| Scope of benefit | The specified compute service and region combination | All Azure regions, up to the hourly commitment |
| Example on Learn | A D2v4 VM in Japan East for one year | $5.00 per hour for three years |
| Flexibility | Fixed to instance type or family and region | Spend-based, applies across regions and participating compute services |

## When to choose a reservation

Learn says reservations fit workloads that:

- run continuously and are highly stable, and
- do not expect changes to instance type, instance family or region.

When fully utilized, reservations provide the greatest savings, according to the page.

## When to choose a savings plan

Learn says savings plans fit:

- dynamic or evolving workloads,
- workloads using various instance families or compute services, and
- workloads running in, or moving to, different regions.

The page describes savings plans as providing deep savings, flexible benefit application and automatic optimization.

## Using both: the order Microsoft suggests

To limit wasted commitments, Learn recommends this sequence:

1. **Right-size first.** Remove unused or oversized resources before buying any discount.
2. **Exchange underutilized reservations.** Reassign them to better-fitting configurations.
3. **Trade in underutilized reservations for savings plans.** Convert rigid reservations to spend-based plans when usage is variable.
4. **Purchase new reservations.** Only for stable, well-understood workloads.
5. **Purchase new savings plans.** Add flexible commitments sized to an optimized baseline.

The order matters because commitments sized before right-sizing can lock in waste. Azure Advisor's VM recommendations are one place to start right-sizing, but note that Advisor savings figures ignore reservations and savings plans, according to the Advisor cost page.

## A simple decision checklist

Ask these questions for each workload:

1. Will it run all the time for the commitment term?
2. Is the instance type or family fixed?
3. Is the region fixed?
4. Is there a chance of moving to other compute services?

If all answers are yes or fixed, a reservation fits the Learn guidance. If any answer is uncertain, the savings plan guidance fits better. For a mixed estate, split the workloads: stable core on reservations, variable remainder on a savings plan.

## Facts from the product pages

The decision page leaves details to the overview pages. These are the points those pages state.

**Savings plan for compute**

- You commit to a fixed hourly spend for one or three years. Discounts vary by product and commitment term, not by commitment amount.
- You can pay up front or monthly, and the total cost is the same.
- Covered services listed: Azure Virtual Machines, App Service, Functions premium plan, Container Instances, Dedicated Host, Container Apps and Azure Spring Apps for Enterprise. Software, networking and storage charges are not covered.
- The benefit applies automatically each hour, starting with the usage that receives the highest discount. Usage above the commitment is billed at pay-as-you-go rates, and unused commitment for an hour expires.
- Savings plan purchases cannot be canceled or refunded. You can trade in eligible reservations for a savings plan.
- Availability is for Enterprise Agreement, Microsoft Customer Agreement and Microsoft Partner Agreement customers, with offer type conditions for EA.

**Reservations**

- One-year or three-year plans, paid up front or monthly with the same total cost.
- Learn says they can reduce resource costs by up to 72 percent from pay-as-you-go prices.
- The discount applies automatically to usage that matches the SKU, region where applicable and scope selected at purchase. It applies hourly for all reservations except Azure Databricks.
- You can exchange a reservation for another of the same type, and refund one up to $50,000 USD in a 12-month rolling window.
- The list of services is broader than compute, including reserved capacity for Blob storage, Azure Files and Cosmos DB, SQL Database, Synapse, Databricks and others. For Windows VMs and SQL Database, software costs are not covered, and Azure Hybrid Benefit can cover licensing.

Both overview pages refer to a scope setting but do not list the scope options. Read the scope documentation before you buy, because scope decides which usage receives the benefit.

## What is still open

The decision page gives no discount percentages for savings plans, and the savings plan overview says only that discounts vary. For exchange and refund conditions beyond the statements above, read the current reservation and savings plan documentation, because a wrong assumption can turn a flexible plan into a fixed cost.

## Typical mistakes

- Buying commitments before right-sizing.
- Choosing a reservation for a workload that may change region.
- Choosing a savings plan for a stable workload and assuming it always saves as much as a fully used reservation. Learn says fully utilized reservations provide the greatest savings.
- Treating the example numbers on the page as prices.

## Related

- [Azure Reservations](https://www.m365.fm/entity/azure-reservations/)
- [Azure Savings Plans](https://www.m365.fm/entity/azure-savings-plans/)
- [Azure Advisor](https://www.m365.fm/entity/azure-advisor/)

## Sources

- [Decide between a savings plan and a reservation (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/savings-plan/decide-between-savings-plan-reservation)
- [What is Azure savings plan for compute (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/savings-plan/savings-plan-compute-overview)
- [What are Azure Reservations (Microsoft Learn)](https://learn.microsoft.com/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Cost recommendations in Azure Advisor (Microsoft Learn)](https://learn.microsoft.com/azure/advisor/advisor-cost-recommendations)
