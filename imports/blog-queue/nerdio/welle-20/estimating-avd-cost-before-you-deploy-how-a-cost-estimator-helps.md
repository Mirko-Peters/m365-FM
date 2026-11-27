---
title: "Estimating AVD cost before you deploy: how a cost estimator helps"
summary: "A cost estimator turns assumptions such as users, working hours, VM size and profile storage into a monthly figure before deployment. Compared here: the Azure pricing calculator, the Nerdio Modeler and the Nerdio Cost Estimator."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [nerdio-cost-estimator, nerdio-advisor]
keypoints:
  - "Microsoft's calculator module for AVD estimates session host VMs and extra storage of optional features. Internal licensing is added separately; other features have their own modules."
  - "Nerdio has two estimators: the Modeler (Observability > Advisor > Models, also free on the web) for own environments, and the Cost Estimator (Tools > Azure Cost Estimator) for MSPs pricing customers."
  - "Nerdio says working hours have the largest impact on a Modeler prediction, and its review compares the model with an 'always on' deployment, so judge savings against your own baseline."
  - "Both Nerdio tools only generate estimates. The Modeler leaves out Log Analytics costs, and a Nerdio licence option adds at least USD 1,000 per month, so state which options a figure includes."
  - "Record each input with its source and re-test it after a pilot; after go-live, compare the estimate with actual cost in Microsoft Cost Management."
faq:
  - q: "Which estimator should I use first?"
    a: "Start with the Azure pricing calculator if you want Microsoft's own price list for session host VMs and storage. Use the Nerdio Modeler if you want a wizard that asks for working hours, absence and profile size, and use the Nerdio Cost Estimator if you are an MSP pricing customers. The tools answer different questions, so a pilot with real users is the check for all three."
  - q: "Can an estimator tell me what my invoice will be?"
    a: "No. Nerdio states that its Modeler and Cost Estimator only generate estimates and that actual costs vary with usage, price changes and other factors. Microsoft's calculator likewise covers only the parts it models, and internal licensing has to be added separately."
  - q: "Do I need Nerdio Manager to estimate an AVD deployment?"
    a: "No. The Azure pricing calculator has an Azure Virtual Desktop module, and Nerdio publishes a free web Modeler that is described as needing no purchase commitment. The Cost Estimator is documented as a tool in Nerdio Manager for MSP, opened at MSP level; Nerdio's public page also presents it as a free estimator for MSPs with no commitment required."
---

A cost estimator turns a list of assumptions (users, working hours, VM size, profile storage) into a monthly figure before any Azure resource exists. Used well, it shows which assumption moves the number most and where the estimate stops. Used badly, it produces a precise-looking figure that nobody can reconcile with the first invoice.

This article looks at three tools for planning [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/) (AVD): the AVD module in the Azure pricing calculator, the Modeler in [Nerdio Manager for Enterprise](https://www.m365.fm/entity/nerdio-manager-for-enterprise/) (with a free web version), and the [Nerdio Cost Estimator](https://www.m365.fm/entity/nerdio-cost-estimator/) in [Nerdio Manager for MSP](https://www.m365.fm/entity/nerdio-manager-for-msp/). It explains what each takes in, what each leaves out and how to use an estimate to decide. The Modeler walk-through and the recommendations for deployed pools are covered in "Nerdio Advisor: modelling and optimising AVD cost", and the cost lines themselves in "What Azure Virtual Desktop really costs: the full cost model".

## What an estimate is for

A pre-deployment estimate answers three questions: which design is cheaper on paper, what range the budget should cover, and which assumption the result depends on most. It does not answer what the invoice will say. Both Nerdio help pages carry a warning to that effect: the tool only generates estimates, and actual costs may vary with usage, price changes and other factors.

Microsoft frames AVD cost as two sources: Azure resource consumption and licensing. The calculator can see only part of that, which is the reason to know each tool's boundary before you trust a total.

## The three tools side by side

| | Azure pricing calculator, AVD module | Nerdio Modeler (Enterprise) | Nerdio Cost Estimator (MSP) |
|---|---|---|---|
| Where | azure.microsoft.com/pricing/calculator, Compute tab, Azure Virtual Desktop | Observability > Advisor > Models in Nerdio Manager; free web version on getnerdio.com | Tools > Azure Cost Estimator at MSP level |
| Audience (our reading) | Anyone planning AVD | An organisation running its own environment | A partner pricing customer environments; Nerdio's help speaks of estimating "your customers' costs" |
| Inputs named in the sources | Compute, storage and networking usage; users, total hours and concurrency; savings plan or reserved instances; support level | Users, desktop experience, region, workload type, VM size, work hours, absent users, FSLogix profile size, reserved instances, discounts | Personal, pooled and GPU desktops, servers with data disks, licensing, backup, VPN, hosting costs, Entra Domain Services, storage, discounts, markups |
| Stated limits | Estimates session host VMs and the aggregate extra storage of optional features | In-product help: excludes Log Analytics workspace costs | Estimates only, according to Nerdio's warning |
| Output | A monthly estimate | Predicted cost per pool and per user, plus a comparison with an 'always on' deployment | A cost breakdown, with saved estimates, PDF print, CSV and JSON export |

### The Azure pricing calculator

Microsoft's Learn page on estimating AVD cost tells you to open the calculator, select the Compute tab and choose Azure Virtual Desktop. The module takes expected compute, storage and networking usage, the number of users, total hours and concurrency, whether you use per-user access pricing for external commercial purposes, whether you use a savings plan or reserved instances, and the level of support.

Learn is explicit about the gaps. The module can only estimate consumption costs for session host VMs and the aggregate additional storage of optional features that need storage. If you license for internal commercial purposes, you add that licence to the total separately. Egress to Microsoft 365 services such as OneDrive for Business or Exchange Online may add to the total, and other AVD features can be estimated in separate modules on the same calculator page. Treat the module as the VM-and-storage core of the estimate, not the whole of it.

### The Nerdio Modeler

The Modeler builds a model through a guided flow: general settings, compute, image, work hours, FSLogix and, in the in-product version, administrative tasks. Nerdio says work hours, when configured in the most economical way, have the single largest impact on the cost prediction, because auto-scaling removes the cost of desktops that are shut down. The web version asks you to pick a currency and a percentage Enterprise Agreement discount; the in-product settings add a Windows 365 discount and an Azure Government option. In the web version, Nerdio's help says the full review details appear after you enter contact information and reply to a confirmation email.

The review step shows the predicted cost per host pool and per user and compares it with a standard 'always on' deployment. That comparison illustrates the effect of Nerdio's own scaling. If you would use native autoscale or a schedule anyway, your baseline is not 'always on', so compare the model against the pool design you would build without Nerdio. The article "Nerdio auto-scaling vs native AVD autoscale: a fair comparison" covers that question.

Two settings change the total without changing the desktops. Choosing a Nerdio Manager licence option (Standard, Premium or Custom in the help text) adds a minimum of USD 1,000 per month to the model, and the resource-cost option offers Automatic, Small (1 to 100 users), Medium (101 to 500), Large (501 to 1,000) or Extra Large (1,001 and more). Leave them off to see the Azure cost alone, and state which setting you used when you share a figure.

### The Nerdio Cost Estimator for MSPs

The Cost Estimator is a calculator that asks a series of questions and returns an estimate with a detailed breakdown. Beyond desktops it takes servers with data disks, Microsoft 365 or Defender for Endpoint licences, Azure Hybrid Benefit, in-region backup of up to 10 years (the default is 1 year), a site-to-site VPN, hosting for the Nerdio Manager portal, Entra Domain Services, additional storage and cost assumptions such as FSLogix profile size, outbound connectivity, bandwidth, storage operations and Log Analytics. Discounts can be hidden when you share the estimate, and markups are added to the per-user per-month cost. Nerdio's help also states a minimum Nerdio Manager licence cost of USD 60 per customer account, whatever the deployment type, which is part of the price rather than a limit of the estimate.

Two features suit planning work. An estimate can be imported from an existing customer account, and Nerdio's tip is to clone the imported estimate to show the difference between the existing and the proposed environment. Saved estimates sit in a library visible to the roles MSP Admin, MSP Billing Admin and MSP Sales, and can be exported as CSV or JSON or printed as PDF.

## The inputs that move the number

In our reading, these are the inputs worth the most effort. Two of them have direct support in the sources: Learn says VM instances usually cost the most of the session host components, and Nerdio says work hours have the single largest impact on a Modeler prediction.

- **Hours the VMs run.** Compute is where hours turn into cost.
- **Users per host and VM size.** A wrong concurrency or users-per-vCPU assumption changes the number of hosts, and the Modeler lets you edit users per vCPU only for the Custom workload type.
- **Profile storage.** The Modeler's default FSLogix profile size is 30 GiB, and shared pools default to Azure Files while dedicated pools default to local storage.
- **Stopped disk type.** Nerdio notes that switching to a Standard HDD while a VM is stopped can provide significant savings, so the default matters.
- **Commitments and discounts.** The Modeler accepts a number of reserved instances and a one- or three-year term, and the MSP tool takes discounts. Which commitment to buy is covered in "Reservations or savings plans for AVD: which to buy".

## A routine for using an estimate

1. **Write the assumptions down first.** Users, expected concurrency, working days and hours, VM size, profile size and region.
2. **Run the lowest-effort tool first.** A calculator estimate takes minutes and shows the order of magnitude.
3. **Run a second tool with the same inputs.** A gap between tools can come from an input one of them does not have, such as backup in the Cost Estimator or the Nerdio licence option in the Modeler.
4. **Change one input at a time.** Record the change in total. The input with the largest change is the one to verify in a pilot.
5. **Add the lines the tool omits, tool by tool.** Azure calculator: internal licensing is added separately, and Learn lists identity provider costs and Insights log data in Azure Monitor as their own cost lines, while the module note mentions only session host VMs and optional-feature storage. Modeler: Log Analytics, which Nerdio says it excludes; the help pages do not say whether identity costs are included. Cost Estimator: its inputs already include Entra Domain Services and a Log Analytics workspace, so check those fields instead of adding them again.
6. **Share the range, not a point.** Give the low, expected and high figures, and say which tool and options produced them.

An assumption register makes step 1 and step 4 checkable. The values below are invented for illustration.

| Assumption | Value used | Where the value came from | Re-test after pilot |
|---|---|---|---|
| Users with access | 150 | HR headcount for the department | No |
| Working hours | Mon to Fri, 8:00 to 18:00 | Shift roster | Yes |
| Users working outside those hours | 10% | Manager estimate | Yes |
| Profile size | 30 GiB (tool default) | Not measured | Yes |
| VM size | Tool's default for the workload type | Not measured | Yes |

Rows marked 'not measured' are the ones a pilot should replace with data.

## Where estimators mislead

- **Precision without accuracy.** A result to the cent reflects the inputs, not the future. A wrong working-hours assumption gives a wrong answer at any precision.
- **Vendor baselines.** A saving shown against an 'always on' deployment is a saving against one design. Check it against your own alternative.
- **Missing lines.** Each tool's gaps are listed in step 5 of the routine. Nerdio's Cost Estimator page also points to Microsoft's requirement for an explicit method of outbound internet connectivity, typically a NAT Gateway or Azure Firewall, which belongs in the network lines.
- **Different audiences.** In our reading, the Cost Estimator is aimed at partners: Nerdio's help describes estimating customers' costs, hiding discounts when sharing, and adding markups to the per-user price. An in-house team may get more from the Modeler or the calculator.

## After you deploy

Compare the estimate with actual cost. Microsoft Cost Management shows billing invoices and lets billing administrators track monthly consumption under each subscription, and Learn points to tagging AVD resources to manage costs and to AVD Insights for usage detail. Where the actual figure differs from the estimate, go back to the assumption register and find the input that was wrong; that is the most useful output of the exercise. The related articles on tagging for cost allocation and on user cost attribution in Nerdio cover the allocation side.

## Sources

- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Licensing Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing)
- [Nerdio help center (MSP): Overview of the Cost Estimator](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608441357-Overview-of-the-Cost-Estimator)
- [Nerdio help center (Enterprise): Modeler overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356019981-Modeler-overview)
- [Nerdio help center (Enterprise): Web-based Nerdio Manager for Enterprise Modeler Help](https://nmehelp.getnerdio.com/hc/en-us/articles/26124326402189-Web-based-Nerdio-Manager-for-Enterprise-Modeler-Help)
- [Nerdio: Free Modeler Tool](https://getnerdio.com/pricing/enterprise/free-avd-modeler-tool/)
- [Nerdio: Free Azure cost estimator for MSPs](https://getnerdio.com/pricing/msp/nerdio-cost-estimator/)
