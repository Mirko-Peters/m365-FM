---
title: "What Azure Virtual Desktop really costs: the full cost model"
summary: "For session hosts in Azure, Azure Virtual Desktop cost is the sum of compute hours, disks, image and profile storage, networking, licensing, monitoring and identity. This article lists each line item, how Microsoft documents its billing, and a worked host-hour example."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, finops]
keypoints:
  - "For session hosts in Azure, Microsoft's pricing page lists user access rights (no additional cost with an eligible Windows or Microsoft 365 license) plus Azure infrastructure: virtual machines, storage and networking. No separate service fee is listed for this model."
  - "A deallocated VM is not billed for instance usage, but disks and networking can still incur charges. A VM that is only shut down inside the guest OS (Stopped, allocated) is still billed."
  - "Internal users are covered by eligible licenses such as Microsoft 365 E3, E5, A3, A5, F3 or Business Premium. External commercial users need per-user access pricing, which charges only users who connect at least once in the month."
  - "Reservations are use-it-or-lose-it, and compute savings plans expire for an unused hour. Neither covers Windows software, networking or storage charges."
  - "In a 30-day example, 10 always-on hosts are 7,200 host-hours, while an autoscale schedule with 2, 8 and 4 hosts across three weekday phases and no hosts at night or on weekends is 1,672 host-hours, about 23 percent."
faq:
  - q: "Does Azure Virtual Desktop have a service fee per host or per user?"
    a: "For session hosts in Azure, Microsoft's pricing page lists access rights at no additional cost with an eligible Windows or Microsoft 365 license, plus Azure infrastructure, and no separate service fee. Fees do appear for other models: a per-virtual-core hourly fee for Azure Local, a per-user monthly fee for Azure Virtual Desktop Hybrid, and per-user access pricing for external commercial users."
  - q: "Do I still pay for a VM that autoscale has turned off?"
    a: "Not for compute, if the VM is deallocated. Microsoft Learn says deallocated VMs are not billed for instance usage, but disks and networking can continue to incur charges. A VM in the Stopped (allocated) state is still billed."
  - q: "Where can I find actual prices?"
    a: "On the Azure Virtual Desktop pricing page and in the Azure pricing calculator. Rates depend on region, VM size and agreement, so this article gives host-hours instead of currency. Learn says the calculator's Azure Virtual Desktop module estimates session host VMs and the aggregate extra storage of optional features, so price licensing, monitoring and identity from their own pages."
---

Azure Virtual Desktop cost, for session hosts in Azure, is the sum of eight lines: compute, disks, image storage, profile storage, networking, licensing, monitoring, and identity with supporting services. Compute is the line your scaling settings control directly, because you pay for a VM only while it is allocated. This article walks through each line using [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing) and Microsoft's pricing page, then shows a host-hour example with stated assumptions.

It gives host-hours rather than currency amounts, because rates depend on region, VM size and agreement. Check Microsoft's [pricing page](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/) and the Azure pricing calculator for the rates that apply to you.

## The cost model at a glance

| Line item | Billed by | Effect of autoscale |
|---|---|---|
| Session host compute | Hours the VM is allocated | Direct: deallocated hours are not billed |
| OS and data disks | Provisioned size | None while deallocated: disks keep incurring charges |
| Image storage | Storage for operating system images, listed on the pricing page | None described |
| Profile storage ([FSLogix](/entity/fslogix/) share) | Depends on the storage service and billing model | None described |
| Networking | Azure networking charges, listed as a component on the pricing page | None described |
| Licensing | License entitlement or, for external users, per-user access pricing | None |
| Monitoring | Log Analytics ingestion and retention | Not described; depends on what you collect |
| Identity and supporting services | Entra ID tier, domain controller VMs if you use AD DS, App Attach and image-template storage | None described |

The pricing page splits the model into two parts: user access rights and Azure infrastructure. For session hosts in Azure it lists no separate Azure Virtual Desktop service fee. Learn says you run no gateway or broker servers yourself. See [Azure Virtual Desktop](/entity/azure-virtual-desktop/) and [FinOps](/entity/finops/) for background.

Other deployment models carry their own fees. The same page lists a per-virtual-core hourly service fee for Azure Local and a per-user monthly service fee for Azure Virtual Desktop Hybrid, and says Hybrid users are billed per user per month. Those are outside this article, as are services you attach yourself, such as backup or a firewall, which have their own pricing.

## Compute: the line you steer

Learn's page on VM power states says a VM is billed for instance usage while it is Starting, Running, Stopping or Stopped (allocated). It is not billed while Deallocating or Deallocated. A VM that you shut down from inside Windows lands in Stopped (allocated), which is still billed, so power management has to deallocate the VM, not just shut it down. Autoscale does this for you, and the autoscale FAQ says using it carries no extra charge.

Two design choices set the compute line:

- **Session host type.** Windows 11 Enterprise multi-session lets several users share one VM. Learn says multi-session, which is exclusive to Azure Virtual Desktop, or Windows Server, can greatly reduce the number of VMs and the operating system overhead. In a [personal host pool](/entity/avd-personal-host-pool/) each session host is assigned to an individual user, so the VM count follows the user count, while Learn says pooled pools offer lower costs and greater efficiency.
- **VM size and count.** Learn's sizing table lists maximum users per vCPU for multi-session hosts: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. These are generic guidelines for initial estimates. The same page names four cores as the lowest recommended size for a stable multi-session VM and says VMs can incur a 15 to 20 percent capacity cost compared with bare metal.

## Storage: disks, images and profiles

**Disks.** Learn says managed disks are billed according to their provisioned size, prorated hourly, regardless of how much data is written. The power-state page adds that disks keep incurring charges when the VM is deallocated. Learn lists Standard SSD for web servers, lightly used applications and development and test, and Premium SSD for production workloads that need high performance and low latency.

**Images.** The pricing page lists storage for operating system images, data disks and user profiles under infrastructure. Look up the pricing of the storage service you keep images in.

**Profile storage.** For [FSLogix](/entity/fslogix/) profile containers, Learn recommends Azure Files for most customers and lists [Azure NetApp Files](/entity/azure-netapp-files/) and Storage Spaces Direct as alternatives. Billing differs by option:

- Premium Azure Files shares use a provisioned model: you pay for the amount you provision regardless of use.
- Standard shares are described on the FSLogix page as pay-as-you-go: you pay for data stored and transactions. Learn's Azure Files billing page adds that pay-as-you-go is available only for HDD, and says to use the provisioned v2 model for all new Azure Files deployments, which bills provisioned storage, IOPS and throughput separately. HDD shares can use provisioned v2 as well.
- Azure NetApp Files performance is a function of tier times capacity, according to Learn, so more provisioned capacity can allow a lower tier.

Learn's tier guidance says standard shares for light workloads under 200 users and premium shares for medium, heavy and power workloads.

## Networking

Learn's cost page lists network bandwidth among session host costs and adds that the total may include egress network traffic to Microsoft 365 services, such as OneDrive for Business or Exchange Online. The power-state page notes that networking continues to incur charges for a deallocated VM. This article gives no figure for the line; check your own bill for data transfer and virtual network items.

## Licensing: who is entitled, and what that costs

Learn's licensing page splits the question by user type.

**Internal users.** Windows 11 or 10 Enterprise (single or multi-session) is covered by Microsoft 365 E3, E5, A3, A5, F3, Business Premium or Student Use Benefit, by Windows Enterprise E3 or E5, Windows Education A3 or A5, or Windows VDA per user. If your license entitles you, Learn's prerequisites page says you do not install a separate license. Windows Server session hosts need an RDS Client Access License with Software Assurance, or RDS User Subscription Licenses.

**External commercial users.** Per-user access pricing is the route for Windows 11 or 10 hosts, billed through an enrolled Azure subscription on top of VM, storage and other charges. Only users who connect at least once in a month incur the charge; there are two flat tiers (Apps and Desktops + apps), and a user is charged at most once per billing period. It is not available for Windows Server session hosts. Enrolling a subscription that also serves licensed internal users means you effectively pay twice, Learn warns. Per-user access rights do not include Microsoft Office, Microsoft Defender XDR or Universal Print.

## Monitoring: the line people forget

Azure Virtual Desktop Insights stores data in a Log Analytics workspace. Learn's cost page estimates 92 to 145 MB ingested per VM per day, or roughly 3 to 5 GB per VM per 31 days, and says performance counters should make up 80 to 99 percent of that. Learn stresses these are examples; actual cost depends on size, health, usage and pricing model. See [Azure Virtual Desktop Insights](/entity/avd-insights/) and [Log Analytics](/entity/log-analytics/).

## Identity and supporting services

Learn's cost page treats identity as its own component. Microsoft Entra ID has a free tier and licensed tiers for some features, such as conditional access. If you use Active Directory Domain Services, the domain controller VMs add their own compute, storage and networking cost. Microsoft Entra Domain Services is the managed alternative. The same page lists App Attach application storage (for example Azure Files or Azure NetApp Files) and storage and bandwidth for custom image templates as accompanying costs.

## Commitment discounts and Azure Hybrid Benefit

- **[Reservations](/entity/azure-reservations/).** One- or three-year commitments, with discounts of up to 72 percent from pay-as-you-go prices according to Learn. A VM reservation covers compute only, not Windows software, networking or storage. Learn calls a reservation discount use-it-or-lose-it: if you have no matching resource for an hour, you lose the reserved quantity for that hour and cannot carry it forward. If another matching resource exists in the scope, the discount applies to it.
- **[Savings plans](/entity/azure-savings-plans/).** An hourly spend commitment over one or three years. Learn says unused commitment for an hour expires and does not roll over, and that compute savings plans do not cover software, networking or storage.
- **[Azure Hybrid Benefit](/entity/azure-hybrid-benefit/).** Learn's page covers Windows Server: on-premises core licenses with active Software Assurance or qualifying subscription licenses, at least 8 core licenses per VM. It does not describe Windows client or multi-session eligibility; check your agreement.

Because unused hours are lost under both commitment types, they fit a stable baseline.

## Worked example: host-hours

The example uses invented numbers to show the shape, not a benchmark. Ten session hosts, a 30-day month with 22 weekdays and 8 weekend days, and a hypothetical rate of one currency unit per host-hour (use your own).

- **Always on:** 10 hosts x 24 hours x 30 days = 7,200 host-hours.
- **Autoscale:** on each weekday, ramp-up 07:00 to 09:00 with 2 hosts (4 host-hours), peak 09:00 to 17:00 with 8 hosts (64), ramp-down 17:00 to 19:00 with 4 hosts (8), and 0 hosts afterwards. That is 76 host-hours a day. The assumption is that weekends run 0 hosts, so the month is 76 x 22 = 1,672 host-hours.

At the hypothetical rate, that is 1,672 units against 7,200, about 23 percent of the always-on figure. Learn says autoscale can turn off all VMs if the minimum percentage of hosts is 0% and no user sessions remain, including disconnected ones. Disks, image and profile storage, licensing, monitoring and identity do not follow the host-hour count, so the total falls by less than the compute line alone.

## What to do with the model

1. List your session hosts by pool, size and expected running hours.
2. Price session host VMs and optional-feature storage in the Azure pricing calculator. Learn says its Azure Virtual Desktop module can only estimate consumption costs for session host VMs and the aggregate additional storage of optional features, and that other features can be added as separate modules on the same calculator page. Price licensing, monitoring, identity and Microsoft 365 egress from their own pages or from your bill.
3. Tag host pools with `cm-resource-parent` set to the host pool resource ID, so Cost Management can group costs by host pool. Learn says the tag does not affect billing, and the linked cost-analysis article is labelled preview.
4. Decide commitments only after you have a few weeks of actual running hours.

The sibling article "15 ways to cut Azure Virtual Desktop cost without hurting users" covers the levers one by one.

## Sources

Retrieved 17 November 2026.

- [Azure Virtual Desktop pricing](https://azure.microsoft.com/en-us/pricing/details/virtual-desktop/)
- [Microsoft Learn: Understand and estimate the costs of Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/understand-estimate-costs)
- [Microsoft Learn: Licensing Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: What is Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview)
- [Microsoft Learn: Virtual machine states and billing](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing)
- [Microsoft Learn: Autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Azure managed disk types](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types)
- [Microsoft Learn: Storage options for FSLogix profile containers](https://learn.microsoft.com/en-us/azure/virtual-desktop/store-fslogix-profile)
- [Microsoft Learn: Understand Azure Files billing](https://learn.microsoft.com/en-us/azure/storage/files/understanding-billing)
- [Microsoft Learn: Estimate Azure Virtual Desktop Insights costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-costs)
- [Microsoft Learn: What are Azure Reservations?](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Microsoft Learn: How an Azure reservation discount is applied](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/reservation-discount-application)
- [Microsoft Learn: Azure savings plan for compute](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-compute-overview)
- [Microsoft Learn: Azure Hybrid Benefit for Windows Server](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing)
- [Microsoft Learn: Tag Azure Virtual Desktop resources to manage costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
