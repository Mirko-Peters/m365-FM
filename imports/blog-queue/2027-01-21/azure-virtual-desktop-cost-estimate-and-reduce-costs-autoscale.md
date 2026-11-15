---
title: "Azure Virtual Desktop Costs: How to Estimate Them and Where Autoscale Saves Money"
summary: "AVD costs come from Azure resource consumption and licensing. What is billed for session hosts, identity and accompanying features, how licensing differs for internal and external users, how to use the pricing calculator, and how scaling plans reduce compute."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [azure-virtual-desktop, azure-monitor, entra-id]
keypoints:
  - "Learn says Azure Virtual Desktop costs come from two sources: underlying Azure resource consumption and licensing."
  - "Session host virtual machine instances usually cost the most. Autoscale, savings plans and reserved VM instances are the levers Learn names for compute."
  - "Accompanying features add cost: Insights log data in Azure Monitor, App Attach and FSLogix storage, and custom image template storage and network."
  - "Internal users need an eligible license each. For external commercial use, per-user access pricing is paid through an Azure subscription."
  - "A scaling plan works in its configured time zone, cannot be combined with other scaling tools on the same host pool, and applies schedules for ramp-up, peak, ramp-down and off-peak."
faq:
  - q: "What are the cost sources for Azure Virtual Desktop?"
    a: "Microsoft Learn names two: Azure resource consumption and licensing. Consumption covers session host virtual machines plus shared resources such as storage accounts, network data egress and identity systems. Some licensing charges must be paid in advance, while Azure meters track other licenses and resource usage based on your use."
  - q: "What is charged for a session host?"
    a: "Session hosts are VMs, so normal Azure Compute billing applies: the virtual machine instance, storage for managed disks for the operating system and any extra data disks, and network bandwidth. Learn says the VM instances usually cost the most."
  - q: "How do I estimate costs before deploying?"
    a: "Use the Azure Pricing Calculator: open the Compute tab, select Azure Virtual Desktop and enter compute, storage and networking usage, number of users, total hours and concurrency, per-user access pricing, savings plan or reserved instances, support level and optional features. The module only estimates session host consumption and the storage of optional features. Internal-user licenses must be added separately."
  - q: "How does licensing differ for internal and external users?"
    a: "For internal commercial purposes you must purchase an eligible license for each user who accesses Azure Virtual Desktop. For external commercial purposes, such as providing a SaaS application to customers, you must enroll in per-user access pricing, paid through an Azure subscription, to build a compliant deployment."
  - q: "Can I use autoscale together with another scaling tool?"
    a: "No. Learn says you cannot use autoscale and scaling session hosts with Azure Automation on the same host pool, and advises not combining autoscale with other Microsoft or third-party scaling tools. Disable those on the host pools where you apply scaling plans."
---

Azure Virtual Desktop (AVD) costs fall into two groups: Azure resource consumption and licensing. The Microsoft Learn page on understanding and estimating costs names the components in each, and the autoscale page explains one of the tools for lowering compute spend. This article puts them into one planning view.

## Who pays

Learn says AVD costs are charged to the organization that owns the deployment, not to the end users who access it. Some licensing charges must be paid in advance, and Azure meters track other licenses and the underlying resource consumption. The owner is also responsible for removing resources it no longer needs.

## Resource consumption costs

### Session hosts

Session hosts are virtual machines, so Azure Compute charges and billing apply. The components are:

- the virtual machine instance,
- managed disks for the operating system and any extra data disks,
- network bandwidth.

Learn says VM instances usually cost the most. To reduce compute spend, it names three options: autoscale, Azure savings plans and Azure reserved VM instances.

### Identity

| Identity provider | What is charged |
| --- | --- |
| Microsoft Entra ID only | Free tier available, licensed tiers for some features such as Conditional Access |
| Microsoft Entra ID + AD DS | Microsoft Entra ID and the domain controller VM costs: compute, storage and networking |
| Microsoft Entra ID + Microsoft Entra Domain Services | Microsoft Entra ID and Microsoft Entra Domain Services |

### Accompanying services

| Feature | Associated costs |
| --- | --- |
| AVD Insights | Log data in Azure Monitor |
| App Attach | Application storage such as Azure Files or Azure NetApp Files |
| FSLogix profile container | User profile storage such as Azure Files or Azure NetApp Files |
| Custom image templates | Storage and network costs for managed disks and bandwidth |

Learn also mentions that the total can include egress network traffic to Microsoft 365 services such as OneDrive for Business or Exchange Online.

## Licensing costs

Learn separates two cases:

- **Internal commercial purposes**: people who are members of your organization, such as employees or students, including external vendors or contractors. You must purchase an eligible license for each user who accesses AVD.
- **External commercial purposes**: your customers, for example when you provide a SaaS application using AVD. Per-user access pricing lets you pay for access rights on behalf of external users. You must enroll in it to build a compliant deployment, and you pay through an Azure subscription.

The page points to its License Azure Virtual Desktop article for the options. This article lists no license names.

## Estimate before you deploy

The page describes this path in the Azure Pricing Calculator:

1. Open the calculator in a browser.
2. Select the **Compute** tab.
3. Select **Azure Virtual Desktop**.
4. Enter expected compute, storage and networking usage, the number of users, total hours and concurrency, whether you use per-user access pricing, whether you use a savings plan or reserved instances, the support level and other components.

The note on the page matters: the AVD module only estimates consumption for session host VMs and the aggregate extra storage of optional features. If you license for internal commercial purposes, you add that license separately. You can add other features as separate modules on the same calculator page for a fuller estimate.

## View costs after deployment

Use Microsoft Cost Management and its cost analysis tools to follow monthly AVD consumption under your subscriptions, and tag AVD resources to manage costs. With per-user access pricing, charges appear on the Azure billing invoice of each enrolled subscription. AVD Insights can show how the deployment is used, which Learn says helps optimize it and reduce costs.

## Autoscale: one lever for compute costs

A scaling plan defines schedules for scaling session hosts in a host pool. What the autoscale page says:

- Two methods exist: **power management autoscaling**, which powers session hosts on and off, and **dynamic autoscaling**, which also creates and deletes session hosts and only works for pooled host pools with session host configuration. Dynamic autoscaling is only available in Azure, not Azure Government.
- You can assign one plan to several host pools of the same type, but each host pool can have only one plan.
- A plan works only in its configured time zone, and can have multiple schedules, for example weekdays versus the weekend.
- You schedule around ramp-up, peak hours, ramp-down and off-peak hours. Ramp-down is usually when you shut down VMs to save costs.
- The plan takes effect as soon as you enable it.
- Hibernate is available for personal host pools.

### Behavior to know before you enable it

- You cannot use autoscale and Azure Automation scaling on the same host pool. Learn also advises against other scaling tools.
- For pooled host pools, autoscale overwrites drain mode, so use exclusion tags when you update VMs. A VM with the exclusion tag is not turned on, off or changed in drain mode in any phase.
- For pooled host pools, autoscale ignores the load-balancing algorithm in the host pool settings and applies load balancing from the schedule.
- Autoscale turns on a session host when used host pool capacity exceeds the capacity threshold. It turns hosts off when used capacity is below the threshold, turning one off would not push it over the threshold, and a host has no sessions. Pooled autoscale does not turn hosts off in the ramp-up phase. In ramp-down with force logoff enabled, it can sign users out after a notification period.
- The minimum percentage of hosts keeps some hosts available. If all VMs carry the exclusion tag and are turned off, users can get a No resources available error, because autoscale cannot turn any on.

## A cost checklist (my advice)

This is my suggestion, not a Microsoft recommendation:

1. Estimate with the calculator using realistic concurrency, not the total user count.
2. Add the items the module does not cover, such as licenses for internal users, and check that identity infrastructure and profile storage are in your estimate.
3. Start a scaling plan with conservative ramp-down settings and review the effect in Cost Management before tightening.
4. Tag AVD resources by host pool or department, so cost analysis can split the bill.
5. Review reserved instances or a savings plan only after usage is stable.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Azure Monitor](https://www.m365.fm/entity/azure-monitor/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Understand and estimate costs for Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/understand-estimate-costs)
- [Autoscale scaling plans and example scenarios in Azure Virtual Desktop (Microsoft Learn)](https://learn.microsoft.com/azure/virtual-desktop/autoscale-scenarios)
