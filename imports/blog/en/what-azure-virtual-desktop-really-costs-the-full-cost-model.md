---
title: "What Azure Virtual Desktop really costs: the full cost model"
summary: "Azure Virtual Desktop cost is the sum of session host compute hours, disks, profile storage, networking, licensing and monitoring, and compute hours are the part you can steer most. This article lays out each line item, what Microsoft Learn says about how it is billed, and a worked host-hour example."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, finops]
keypoints:
  - "The Learn pages used here describe no per-host service charge. The bill is made of Azure resources in your subscription (VMs, disks, storage, networking, monitoring) plus the license that entitles users to connect. Confirm on the pricing page."
  - "A deallocated VM is not billed for compute, but its disks and networking keep incurring charges. A VM that is only stopped inside the guest OS (Stopped, allocated) is still billed."
  - "Internal users are covered by eligible licenses such as Microsoft 365 E3, E5, A3, A5, F3 or Business Premium. External commercial users need per-user access pricing, which charges only users who connect at least once in the month."
  - "Reservations and savings plans discount compute only. Neither covers Windows software, networking or storage charges, and a savings plan commitment for an unused hour expires."
  - "In a 30-day example, 10 always-on hosts are 7,200 host-hours, while an autoscale schedule with 2, 8 and 4 hosts across three weekday phases is 1,672 host-hours, about 23 percent."
faq:
  - q: "Does Azure Virtual Desktop have a service fee per host or per user?"
    a: "For internal users, Microsoft Learn describes access rights through eligible licenses and says no separate license has to be installed. The Learn pages used here describe no per-host service charge, but they do not state that none exists, so confirm on the pricing page. For external commercial users, per-user access pricing is billed through an Azure subscription."
  - q: "Do I still pay for a VM that autoscale has turned off?"
    a: "Not for compute, if the VM is deallocated. Microsoft Learn says deallocated VMs are not billed for instance usage, but disks and networking continue to incur charges. A VM in the Stopped (allocated) state is still billed."
  - q: "Where can I find actual prices?"
    a: "Not in this article. It gives no prices because the pricing page could not be retrieved for it. Use the Azure Virtual Desktop pricing page and the Azure pricing calculator, which Learn says includes storage, networking and cost-per-user sections."
---

Azure Virtual Desktop cost is the sum of six lines: session host compute, disks, profile storage, networking, licensing and monitoring. Compute hours usually move the most, because you pay for them only while a VM is allocated, which makes them the line your scaling settings control. This article walks through each line using [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing), then shows a host-hour example with stated assumptions.

It gives no prices. The Azure pricing page could not be retrieved while writing, and rates vary by region, VM size and agreement. The model below tells you which meters to look for, so you can fill in your own numbers.

## The cost model at a glance

| Line item | Billed by | Can scaling reduce it? |
|---|---|---|
| Session host compute | Hours the VM is allocated | Yes, directly |
| OS and data disks | Provisioned size, with disks charged even when a VM is deallocated | Only by fewer or smaller disks |
| Profile storage ([FSLogix](/entity/fslogix/) share) | Depends on the storage service and billing model | Not by autoscale |
| Networking | Per Azure networking meters | Indirectly |
| Licensing | License entitlement or, for external users, per-user access pricing | Not by autoscale |
| Monitoring | Log Analytics ingestion and retention | Yes, by what you collect |

Learn describes the architecture as one where you run no gateway or broker servers yourself: you manage only the image and the VMs you use for sessions. The cost model therefore starts with your own subscription resources. See [Azure Virtual Desktop](/entity/azure-virtual-desktop/) and [FinOps](/entity/finops/) for background.

## Compute: the line you steer

Learn's page on VM power states says a VM is billed for instance usage while it is Starting, Running, Stopping or Stopped (allocated). It is not billed while Deallocating or Deallocated. A VM that you shut down from inside Windows lands in Stopped (allocated), which is still billed, so power management has to deallocate the VM, not just shut it down. Autoscale does this for you, and the autoscale FAQ says using it carries no extra charge.

Two design choices set the compute line:

- **Session host type.** Windows 11 Enterprise multi-session lets several users share one VM. Learn says multi-session, which is exclusive to Azure Virtual Desktop, or Windows Server, can greatly reduce the number of VMs and the operating system overhead. In a [personal host pool](/entity/avd-personal-host-pool/) each session host is assigned to an individual user, so the VM count follows the user count, while Learn says pooled pools offer lower costs and greater efficiency. The decision itself is covered in "Pooled or personal host pools: a decision guide".
- **VM size and count.** Learn's sizing table lists maximum users per vCPU for multi-session hosts: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. It calls these generic guidelines for initial estimates, so pilot with real users. Learn also says to keep multi-session VMs between 6 and 24 vCPUs, and that VMs can incur a 15 to 20 percent capacity cost compared with bare metal.

## Storage: disks and profiles

**Disks.** Learn says managed disks are billed according to their provisioned size, prorated hourly, regardless of how much data is written. The power-state page adds that disks keep incurring charges when the VM is deallocated. For disk types, Learn lists Standard SSD for web servers, lightly used enterprise applications and development and test, and Premium SSD for production workloads that need high performance and low latency. Which fits a session host depends on your workload, so test it.

**Profile storage.** For [FSLogix](/entity/fslogix/) profile containers, Learn recommends Azure Files for most customers and lists [Azure NetApp Files](/entity/azure-netapp-files/) and Storage Spaces Direct as alternatives. Billing differs by option:

- Premium Azure Files shares use a provisioned model: you pay for the amount you provision regardless of use.
- Standard shares use pay-as-you-go: you pay for data stored and transactions.
- Learn's Azure Files billing page says to use the provisioned v2 model for all new deployments, which bills provisioned storage, IOPS and throughput separately.
- Azure NetApp Files performance is a function of tier times capacity, according to Learn, so more provisioned capacity can allow a lower tier.

Learn's tier guidance by workload says standard shares for light workloads under 200 users and premium shares for medium, heavy and power workloads. The profile storage decision has its own comparison in "Azure Files or Azure NetApp Files for FSLogix: cost and performance compared".

## Licensing: who is entitled, and what that costs

Learn's licensing page splits the question by user type.

**Internal users.** Windows 11 or 10 Enterprise (single or multi-session) is covered by Microsoft 365 E3, E5, A3, A5, F3, Business Premium or Student Use Benefit, by Windows Enterprise E3 or E5, Windows Education A3 or A5, or Windows VDA per user. If your license entitles you, Learn says you do not install a separate license. Windows Server session hosts need an RDS Client Access License with Software Assurance, or RDS User Subscription Licenses.

**External commercial users.** Per-user access pricing is the route for Windows 11 or 10 hosts, billed through an enrolled Azure subscription on top of VM, storage and other charges. Learn says only users who connect at least once in a month incur the charge, there are two flat tiers (Apps and Desktops + apps), and a user is charged at most once per billing period. It is not available for Windows Server session hosts. If you enrol a subscription that also serves licensed internal users, Learn warns that you effectively pay twice, and suggests a separate subscription for internal users.

**Test environments.** Learn says that in an Azure Dev/Test subscription, end users may connect without separate license entitlement for acceptance tests or feedback.

Per-user access rights do not include Microsoft Office, Microsoft Defender XDR or Universal Print, so budget for those separately if external users need them.

## Monitoring: the line people forget

Azure Virtual Desktop Insights stores data in a Log Analytics workspace. Learn's cost page estimates 92 to 145 MB ingested per VM per day, or roughly 3 to 5 GB per VM per 31 days, and says performance counters should make up 80 to 99 percent of that. Learn stresses these are examples, not a quote: actual cost depends on your size, health and usage, and on the Azure Monitor pricing model you pick. See [Azure Virtual Desktop Insights](/entity/avd-insights/) and [Log Analytics](/entity/log-analytics/).

## Commitment discounts and Azure Hybrid Benefit

- **[Reservations](/entity/azure-reservations/).** One- or three-year commitments, with discounts of up to 72 percent from pay-as-you-go prices according to Learn. A VM reservation covers compute only, not Windows software, networking or storage. The page does not say how a reservation behaves for deallocated hours, so confirm that before you combine one with aggressive autoscale.
- **[Savings plans](/entity/azure-savings-plans/).** An hourly spend commitment over one or three years. Learn says unused commitment for an hour expires and does not roll over, and that compute savings plans do not cover software, networking or storage.
- **[Azure Hybrid Benefit](/entity/azure-hybrid-benefit/).** Learn's page covers Windows Server: you need on-premises core licenses with active Software Assurance or qualifying subscription licenses, at least 8 core licenses per VM. The page does not describe Windows client or multi-session eligibility, so those cases need a separate check against your agreement.

Both commitment types fit a stable baseline. The more aggressively you scale down, the more careful the commitment size needs to be.

## Worked example: host-hours

The example uses invented numbers to show the shape, not a benchmark. Ten session hosts, a 30-day month, a hypothetical rate of one currency unit per host-hour (use your own).

- **Always on:** 10 hosts x 24 hours x 30 days = 7,200 host-hours.
- **Autoscale on 22 weekdays:** ramp-up 07:00 to 09:00 with 2 hosts (4 host-hours), peak 09:00 to 17:00 with 8 hosts (64), ramp-down 17:00 to 19:00 with 4 hosts (8), off-peak with 0 hosts. That is 76 host-hours a day, or 1,672 for 22 days.

The scheduled version runs about 23 percent of the always-on host-hours. Learn says autoscale can reach zero running hosts only if the minimum percentage of hosts is 0 and no user sessions remain, including disconnected ones. Disks, profile storage, licensing and monitoring do not shrink with that schedule. This is why the compute line shrinks the most while the total shrinks less.

## What to do with the model

1. List your session hosts by pool, size and expected running hours.
2. Price each line in the Azure pricing calculator. Learn's What's new notes that the Azure Virtual Desktop calculator includes storage and networking costs and a cost-per-user section.
3. Tag host pools with `cm-resource-parent` set to the host pool resource ID, so Cost Management can group costs by host pool. Learn says the tag does not affect billing, and the linked cost-analysis article is labelled preview.
4. Decide commitments only after you have a few weeks of actual running hours.

The sibling article "15 ways to cut Azure Virtual Desktop cost without hurting users" covers the levers one by one.

## Sources

Retrieved 17 November 2026.

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
- [Microsoft Learn: Azure savings plan for compute](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-compute-overview)
- [Microsoft Learn: Azure Hybrid Benefit for Windows Server](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing)
- [Microsoft Learn: Tag Azure Virtual Desktop resources to manage costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
