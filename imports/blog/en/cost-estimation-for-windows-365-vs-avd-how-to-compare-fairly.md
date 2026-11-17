---
title: "Cost estimation for Windows 365 vs AVD: how to compare fairly"
summary: "Windows 365 Enterprise is priced per user and month, while Azure Virtual Desktop is billed on consumption, so a fair comparison puts both on the same workload, the same hours and the same list of cost lines. This guide gives the steps, a break-even formula with invented example numbers, and the Nerdio Modeler and Platform TCO rules that can cross-check the result."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [nerdio-cost-estimator, nerdio-advisor]
keypoints:
  - "Microsoft describes Windows 365 as subscription-based at a fixed per-user cost regardless of usage, and Azure Virtual Desktop as consumption-based. Compare the matching pair: Windows 365 Enterprise (one Cloud PC per user) against an AVD personal host pool."
  - "A Windows 365 price is not the whole Windows 365 cost. Users also need licences for Windows E3, Intune and Microsoft Entra ID P1 on top of the plan, and a customer-managed Azure network adds Azure charges that a Microsoft-hosted network does not."
  - "For one user, AVD costs hours times the VM rate plus fixed monthly lines such as disk. The break-even hours are (Cloud PC price minus fixed lines) divided by the hourly rate. The example uses a real list price of 41 dollars and invented AVD rates."
  - "In-product, the Nerdio Modeler offers a Windows 365 Cloud PC desktop experience and a Windows 365 discount setting. The help page for the web Modeler documents four AVD desktop experiences and no Windows 365 discount, so check the tool itself. Two Nerdio Platform TCO rules work in each direction: one has Windows 365 Enterprise as its target platform, the other has AVD Personal."
  - "Windows 365 Flex (formerly Frontline, renamed in May 2026) is, per Learn, a licence for Cloud PCs used non-concurrently; in our reading it belongs in the comparison when users do not work at the same time."
faq:
  - q: "Is Windows 365 or Azure Virtual Desktop cheaper?"
    a: "Neither is cheaper in general. Microsoft's own comparison says the consumption pricing of AVD may be more efficient than Windows 365 in some cases and that the answer comes from planning and forecasting usage. In our reading, with a fixed Cloud PC price, the number of hours per month an AVD VM actually runs is the main lever, next to the fixed lines each side carries."
  - q: "Does the Windows 365 price include everything?"
    a: "No. Learn lists licences for Windows E3, Intune, Microsoft Entra ID P1 and Windows 365 as the requirement for Enterprise. The Windows 365 licence is the plan itself, so the other three come on top. A customer-managed Azure network connection brings Azure costs for the virtual network and egress. A Microsoft-hosted network needs no Azure subscription and adds no Azure network infrastructure cost, though the Windows 365 overview says additional costs may apply based on network usage."
  - q: "Can Nerdio compare the two for me?"
    a: "Partly. Nerdio Manager's Modeler can include a Windows 365 Cloud PC group, and its Platform TCO rules compare AVD personal desktops with Windows 365 Enterprise using preset cost values that you can overwrite. The Nerdio help pages cited here do not say which price source the Modeler uses for Cloud PCs, so check its Advanced details against Microsoft's price page."
---

To compare Windows 365 and Azure Virtual Desktop (AVD) fairly, put both on the same workload, the same working hours and the same list of cost lines, then compare cost per user and month. Windows 365 is priced per user, and AVD is billed on consumption. In our reading, that makes the hours a VM actually runs and the lines each price leaves out the two things to settle first.

This article gives a method with a worked break-even example. The choice between the services on technical grounds is covered in "AVD or Windows 365: how to choose between them", shift-work pricing in the article on Windows 365 Flex (formerly Frontline) against Windows 365 Enterprise, and the AVD cost lines in "What Azure Virtual Desktop really costs: the full cost model".

## Two pricing models, not two prices

Microsoft's training unit that compares the services puts the cost difference this way: the pricing model for AVD is consumption-based, so it varies with usage and service options, while Windows 365 is subscription-based with per-user licensing at a fixed cost that depends on the plan, regardless of usage. It adds that the flexibility of the AVD model may be more efficient in some cases, and that finding the most cost-effective option is a matter of planning and forecasting usage.

The Learn overview of [Windows 365](/entity/windows-365/) Enterprise says Cloud PCs are billed per user and month, so you do not manage the variability of compute and storage costs. For [Azure Virtual Desktop](/entity/azure-virtual-desktop/), Learn lists the charged components as the VM instance, managed disks and network bandwidth, plus identity, monitoring and storage for features such as FSLogix profiles.

## Step 1: choose the matching pair

Learn says that in Windows 365 Enterprise, Business and Government, users have a 1:1 relationship with their Cloud PC. In our reading, the like-for-like AVD design is therefore a [personal host pool](/entity/avd-personal-host-pool/), with one VM per user. A [pooled host pool](/entity/avd-pooled-host-pool/), where several users share a session host, is a different design with a different cost structure. Compare it as a third option, not as the equivalent of a Cloud PC.

For users who need a Cloud PC only part of the day, add [Windows 365 Flex](/entity/windows-365-frontline/) as a fourth. Learn's What's new page says Windows 365 Frontline was renamed Windows 365 Flex in the week of 4 May 2026, and that the product, licensing and capabilities are unchanged.

## Step 2: fix the workload before looking at prices

Write down per user: the hours per month the desktop must be available, the performance needed (vCPU, memory, storage), the region and the identity and network model. Then pick sizes that match. Microsoft's price page lists Enterprise plans by vCPU, memory and storage, for example 2 vCPU, 8 GB and 128 GB, or 4 vCPU, 16 GB and 128 GB. Learn's architecture page says Cloud PCs exist in a subscription owned by Microsoft and that Windows 365 sets the VM size and type from the licence you assign, so you choose a plan, not a VM. In our reading, a Cloud PC and an AVD VM of the same vCPU and memory are a reasonable starting pair on paper; confirm performance in a pilot.

## Step 3: list the cost lines on each side

| Cost line | Windows 365 Enterprise | AVD personal |
|---|---|---|
| Compute | In the per-user plan price | VM hours times the hourly rate |
| OS storage | In the plan (storage size is part of the plan) | Managed disk, charged by size and tier |
| Profile storage | Within the plan's storage size | Local by default for personal pools in Nerdio's Modeler; Azure Files or similar if you use FSLogix |
| Licences | Windows E3, Intune and Entra ID P1 on top of the plan (the Windows 365 licence is the plan price) | One eligible licence per user (see below); Intune only if you use it |
| Network | No Azure network infrastructure cost on a Microsoft-hosted network; Azure VNet and egress costs on a customer-managed network | Azure VNet, egress and outbound connectivity |
| Monitoring and identity | Intune and Entra ID P1 (see licences) | Azure Monitor data if Insights is used; identity provider costs |

The licence row needs care. For Windows client session hosts, Learn lists these eligible licences for internal commercial use in AVD: Microsoft 365 E3, E5, A3, A5, F3, Business Premium and Student Use Benefit, Windows Enterprise E3 and E5, Windows Education A3 and A5, and Windows VDA per user. For Windows 365 Enterprise, Learn says users must have licences for Windows E3, Intune, Microsoft Entra ID P1 and Windows 365. The Windows 365 licence is the plan whose price sits on the compute row, so only the other three are extra. If your users already hold a subscription that covers these, they drop out of both sides; if not, add what applies on each side.

The network row is easy to overlook. A Microsoft-hosted network needs no Azure subscription, and Learn says there are no additional costs for network infrastructure on the Azure side. The Windows 365 overview adds that additional costs may apply based on network usage. With a customer-managed Azure network connection, the VNet is in your own subscription, egress costs are incurred to it, and ExpressRoute or a site-to-site VPN adds cost and complexity.

## Step 4: put both on the same hours

For a personal desktop in AVD, per-user monthly cost is hours multiplied by the hourly VM rate, plus fixed monthly lines (disk, backup, a share of monitoring). The break-even is where that equals the Cloud PC price P:

break-even hours = (P minus fixed lines) divided by hourly rate

The Cloud PC price below is a real en-US list price from Microsoft's Windows 365 Enterprise price page as it stood in November 2026: 2 vCPU, 8 GB, 128 GB at 41.00 dollars per user and month. The page shows a dollar sign without a currency code and carries no tax note. The AVD numbers are invented for the example. The hourly rate stands for VM compute only, and licences are not part of the 8 dollars; they sit on the licence row above. Take your own rates from the Azure pricing calculator for your region and size.

| | Input |
|---|---|
| Hourly VM rate | 0.10 dollars (invented) |
| Fixed monthly lines per user | 8 dollars (invented) |
| Cloud PC price | 41 dollars (real list price) |

Break-even is (41 minus 8) divided by 0.10, which is 330 hours per month. That is 15 hours on each of 22 weekdays, or 46 percent of a 720-hour month.

| AVD running pattern | Hours | Monthly cost per user (invented rates) | Against 41 dollars |
|---|---|---|---|
| Always on | 720 | 80 dollars | Higher |
| Business hours, 10 h on 22 weekdays | 220 | 30 dollars | Lower |
| Extended, 16 h on 22 weekdays | 352 | 43.20 dollars | About equal, slightly higher |

With these invented rates, a desktop that is switched off outside working hours is cheaper on AVD, and an always-on one is not. A different VM rate moves break-even in inverse proportion: with the same fixed lines, a rate of 0.20 dollars gives (41 minus 8) divided by 0.20, which is 165 hours, and a lower rate lengthens the break-even. Fixed lines shift the numerator. AVD only realises the lower pattern if something stops the VMs, such as autoscale, Start VM on Connect or hibernation, which are covered in the series articles on those topics.

## Step 5: add operations and licences of the tooling

AVD requires someone to build images, patch and scale. Microsoft's service-model comparison describes Windows 365 as SaaS needing less technical expertise and AVD as PaaS with more administrative overhead. Windows 365 Enterprise is still managed in Intune and can use your own image, so in our reading it reduces some of that work rather than removing it. Estimate the hours either way and apply your own hourly rate. The in-product Nerdio Modeler has an Administrative step with per-task hours, a custom hourly rate and default figures that Nerdio says are based on Gartner figures with and without Nerdio Manager. Treat those defaults as vendor-supplied and replace them with your numbers.

If you manage AVD with Nerdio, include that cost consistently. Selecting a Nerdio Manager licence option in the Modeler adds a minimum of 1,000 dollars per month to the model, and the MSP Cost Estimator states a minimum Nerdio Manager licence cost of USD 60 per customer account. Do not include it on one side only.

## Step 6: cross-check with Nerdio tools

Three Nerdio features touch this comparison:

- **Modeler, in-product.** In Nerdio Manager for Enterprise, under Observability > Advisor > Models, the desktop experience list has five entries: Windows 365 Cloud PC and four AVD options (multi-user desktop, multi-user RemoteApp, single-user pooled and single-user personal). The settings include a Windows 365 discount for an Enterprise Agreement discount on Windows 365 spend. The help page for the web Modeler documents the four AVD experiences and no Windows 365 discount field. Nerdio's page for the free tool describes it as an Azure Virtual Desktop modeler, so check the tool itself before assuming it covers Windows 365.
- **Platform TCO rules.** In the same product, under Observability > Advisor > Rules, the Platform TCO (AVD personal) rule has Windows 365 Enterprise preset as target platform, and the Platform TCO (Cloud PC Enterprise) rule has AVD Personal. Each rule can include the Nerdio Manager licence and a section for features that affect total cost of ownership. Nerdio says the preset cost values come from industry sources and average research, and you can enter your own. The pages do not list which features the section contains, so open the rule to see them.
- **Where the Modeler gets its figures.** The Nerdio help pages cited here do not say which price source the Modeler uses for Cloud PCs. Open Advanced details and compare the Cloud PC line with Microsoft's price page.

See "Nerdio Advisor: modelling and optimising AVD cost" for the Modeler and Advisor in more depth, and "Estimating AVD cost before you deploy: how a cost estimator helps" for the estimators themselves.

## Pitfalls

- **Comparing list prices only.** The Cloud PC price omits the prerequisite licences (Windows E3, Intune, Entra ID P1) and, with a customer-managed network, Azure network costs.
- **Comparing always-on AVD with a Cloud PC, or the reverse.** State the running pattern for both.
- **Ignoring commitments.** Reservations and savings plans lower the AVD hourly rate and change the break-even. "Reservations or savings plans for AVD: which to buy" covers the purchase.
- **Mixing currencies and regions.** The Cloud PC price used here is from the en-US price page; check the price page for your own market and the Azure rate for your region.
- **One point estimate.** Run the break-even at low, expected and high hours, and re-test after a pilot.

## Sources

- [Microsoft Learn: Compare Windows 365 Cloud PCs to Azure Virtual Desktop (training unit)](https://learn.microsoft.com/en-us/training/modules/examine-windows-365/3-compare-windows-365-azure-virtual-desktop)
- [Microsoft Learn: What is Windows 365 Enterprise?](https://learn.microsoft.com/en-us/windows-365/enterprise/overview)
- [Microsoft Learn: Windows 365 requirements](https://learn.microsoft.com/en-us/windows-365/enterprise/requirements)
- [Microsoft Learn: Windows 365 architecture](https://learn.microsoft.com/en-us/windows-365/enterprise/architecture)
- [Microsoft Learn: What is Windows 365?](https://learn.microsoft.com/en-us/windows-365/overview)
- [Microsoft Learn: Windows 365 networking deployment options](https://learn.microsoft.com/windows-365/enterprise/deployment-options)
- [Microsoft Learn: Licensing Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing)
- [Microsoft Learn: Understand and estimate costs for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: What's new in Windows 365 Enterprise](https://learn.microsoft.com/en-us/windows-365/whats-new)
- [Microsoft: Windows 365 Enterprise pricing (en-US)](https://www.microsoft.com/en-us/windows-365/enterprise/all-pricing)
- [Nerdio help center (Enterprise): Modeler overview](https://nmehelp.getnerdio.com/hc/en-us/articles/26124356019981-Modeler-overview)
- [Nerdio help center (Enterprise): Web-based Nerdio Manager for Enterprise Modeler Help](https://nmehelp.getnerdio.com/hc/en-us/articles/26124326402189-Web-based-Nerdio-Manager-for-Enterprise-Modeler-Help)
- [Nerdio help center (Enterprise): Rules: Platform TCO (AVD personal)](https://nmehelp.getnerdio.com/hc/en-us/articles/35702669311373-Rules-Platform-TCO-AVD-personal)
- [Nerdio help center (Enterprise): Rules: Platform TCO (Cloud PC Enterprise)](https://nmehelp.getnerdio.com/hc/en-us/articles/35702684012557-Rules-Platform-TCO-Cloud-PC-Enterprise)
- [Nerdio: Free Modeler Tool](https://getnerdio.com/pricing/enterprise/free-avd-modeler-tool/)
- [Nerdio help center (MSP): Overview of the Cost Estimator](https://nmmhelp.getnerdio.com/hc/en-us/articles/26125608441357-Overview-of-the-Cost-Estimator)
