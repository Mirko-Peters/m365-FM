---
title: "15 ways to cut Azure Virtual Desktop cost without hurting users"
summary: "Fifteen levers for lowering Azure Virtual Desktop cost, grouped into compute hours, compute rate, storage, monitoring and licensing, each with its user-facing trade-off and source. Item 14 has no documented saving, item 15 only avoids paying twice, and some features still carry preview wording on Learn."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, finops, avd-scaling-plan]
keypoints:
  - "Compute hours are the line autoscale changes directly: autoscale, Start VM on Connect, depth-first consolidation and a disconnected-session time limit all reduce the hours a VM is allocated."
  - "Each hour lever has a user-facing price. Start VM on Connect makes the first user wait for a VM to power on, and forced sign-out ends sessions after a wait time."
  - "Reserved VM instances and compute savings plans lower the compute rate only, and an unused savings plan hour expires. Storage has separate reservations, such as Azure Files reserved capacity and Premium SSD reservations from P30."
  - "Disks and profile storage keep billing when VMs are deallocated, so size and tier them on purpose. Insights data can be trimmed, but Learn recommends keeping the Windows event logs."
  - "Microsoft announced general availability of dynamic autoscaling and ephemeral OS disks in July 2026. The announcement describes dynamic autoscaling as able to reduce cost when demand is low, but makes no cost claim for ephemeral OS disks."
faq:
  - q: "Which saving is the quickest to apply?"
    a: "Usually a power management scaling plan, because it needs no new infrastructure. Microsoft Learn says autoscale carries no extra charge, and a scaling plan takes effect as soon as you enable it. It needs a custom maximum session limit and a role assignment first."
  - q: "Can I combine reservations with aggressive autoscale?"
    a: "You can, but size the commitment from measured running hours, not from the maximum fleet size. Learn says a savings plan's unused hourly commitment expires and does not roll over."
  - q: "Do these changes affect user experience?"
    a: "Some do. Start VM on Connect adds a wait while a VM powers on, forced sign-out ends sessions after a wait time, and consolidation can mean fewer hosts for the same sessions. Each item below names its user-facing cost so you can pilot it."
---

The fifteen items below follow five groups: the hours session hosts stay allocated, the rate you pay per hour, storage, monitoring and licensing. Hours come first because autoscale changes them directly. Each names what [Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq) documents, the user-facing trade-off and any status caveat. Item 14 has no documented saving and item 15 applies to one licensing setup only, so read the count as fifteen levers, not fifteen proven savings. For what each cost line contains, and the detail behind items 10 to 13 and 15, read "What Azure Virtual Desktop really costs: the full cost model" first.

Before you change anything, make cost visible. Learn describes a `cm-resource-parent` tag whose value is a host pool resource ID, so Microsoft Cost Management can group costs by host pool. The tag does not affect billing, and the related cost-analysis article is labelled preview.

## Compute hours

**1. Schedule power management autoscaling.** Autoscale starts and deallocates pooled hosts by phase. Learn's FAQ says it costs nothing extra. A VM is not billed for compute when deallocated, while disks and networking still are. Requirements: a custom maximum session limit and the Desktop Virtualization Power On Off Contributor role. The create article says to assign it at subscription scope, while the troubleshooting article also lists host pool and resource group scope. User cost: sessions are consolidated, and hosts start when [capacity](/entity/avd-capacity-threshold/) runs short. See [scaling plans](/entity/avd-scaling-plan/).

**2. Use Start VM on Connect so hosts can stay off until needed.** For pooled pools it powers on a VM only when none are on, and turns on more only when the first reaches the session limit. It starts a VM every five minutes at most: users who sign in meanwhile, with no resources yet available, get a "No resources available" error and should retry after a few minutes. Setup needs the Desktop Virtualization Power On Contributor role for the host pools and session host VMs. User cost: a longer first connection while the VM powers on, and that error for some pooled sign-ins. Details: [Start VM on Connect](/entity/avd-start-vm-on-connect/).

**3. Consolidate with depth-first in ramp-down and off-peak.** The FAQ gives, as an example, breadth-first for ramp-up and peak and depth-first for ramp-down and off-peak, so autoscale can consolidate sessions onto the fewest hosts and deallocate the rest. User cost: busier hosts late in the day. See [depth-first](/entity/avd-depth-first-load-balancing/).

**4. Sign out disconnected sessions and allow zero hosts overnight.** Disconnected sessions count as used capacity, so a few of them keep a host running. The FAQ recommends signing out disconnected sessions after 15 to 30 minutes with the Group Policy setting **Set time limit for disconnected sessions** (Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Session Time Limits), and a 0 percent minimum in off-peak, to reach zero hosts. The timeout must complete before ramp-down ends. In a domain, link the GPO to the OU of the session hosts rather than using Local Computer Policy, as the troubleshooting article advises. For Intune, the scaling plan article describes a configuration profile for Windows 10 and later with the Session Time Limits profile type, the same setting, and a restart of the hosts afterwards. User cost: people who disconnect and return after the limit start a fresh session.

**5. Use force sign-out in ramp-down where the work pattern allows.** Autoscale drains the host with the fewest sessions, notifies users and signs them out after the wait time. Learn says it works only in ramp-down. User cost: forced sign-out, so reserve it for pools where sessions can be reopened. See [force sign-out](/entity/avd-force-logoff/).

**6. Deallocate or hibernate personal desktops.** Personal schedules have Disconnect settings and Sign out settings: after 0 to 360 minutes disconnected or signed out, autoscale deallocates the VM, hibernates the desktop or does nothing. The FAQ says autoscale cannot force a personal user to sign out and deallocates only after sign-out; the disconnect action looks like the exception (our reading), so pilot it. Autoscale with hibernation became generally available in May 2024 per What's new. Hibernation must be enabled on the hosts, or autoscale neither hibernates nor deallocates, and Learn says not to enable hibernate with FSLogix or App Attach. The troubleshooting article names a known limitation: after a resume the RD Agent can fail to re-register, and the host stays unavailable if the agent services are not running within about 5 minutes. It advises deallocate if resume is unstable. User cost: a returning user waits for the desktop to start, so pair this with Start VM on Connect. See [hibernate](/entity/avd-hibernation/).

**7. Consider dynamic autoscaling to delete hosts.** It adds, starts, deallocates or deletes hosts based on demand, and the Tech Community announcement says this can reduce costs when demand is low. Status: Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026. Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. It needs pooled pools with session host configuration, and Learn lists it as not available in Azure Government. User cost: new hosts take time to be created. See [dynamic autoscaling](/entity/avd-dynamic-autoscaling/).

## Compute rate

**8. Share VMs with multi-session.** Learn's overview says Windows 11 or 10 Enterprise multi-session, or Windows Server, can greatly reduce the number of VMs and operating system overhead while still providing the same resources to users. User cost: slower sessions if you pack hosts too tightly. See [Windows Enterprise multi-session](/entity/windows-enterprise-multi-session/).

**9. Right-size VMs and users per host.** Learn's sizing table gives maximum users per vCPU of 6, 4, 2 and 1 for light, medium, heavy and power workloads, and advises 6 to 24 vCPUs per multi-session VM, although the same page later recommends 4 to 24 cores. Azure Advisor's resize recommendations target, for user-facing workloads, P95 of CPU and outbound network at 40 percent or lower and P99 of memory at 60 percent or lower on the recommended size. Its page does not mention Azure Virtual Desktop, so treat the output as a prompt. User cost: too small a host slows everyone.

**10. Commit to a baseline with reservations or a savings plan.** Learn says [reservations](/entity/azure-reservations/) offer up to 72 percent off pay-as-you-go over one or three years, while a [savings plan](/entity/azure-savings-plans/) is an hourly commitment with discounts varying by product and term. The reservations page says a reserved VM instance covers only virtual machine and cloud services compute, not additional software, Windows, networking or storage, and the savings plan page says compute savings plans do not cover software, networking or storage. Savings plan purchases cannot be canceled or refunded, so commit only to the hours you always run. Users notice nothing.

**11. Apply Azure Hybrid Benefit where it applies.** Learn's page covers Windows Server only: core licenses with active Software Assurance or qualifying subscription licenses, at least 8 core licenses per VM. It does not establish eligibility for Windows client or multi-session hosts, so this lever is documented here only for Windows Server session hosts; for Windows 11 multi-session, check your agreement with Microsoft. Users notice nothing. See [Azure Hybrid Benefit](/entity/azure-hybrid-benefit/).

## Storage and monitoring

**12. Choose disks and profile storage on purpose.** Learn bills managed disks by provisioned size, prorated hourly, and says disks keep charging when VMs are deallocated. It lists Standard SSD for development and test and Premium SSD for production workloads that need low latency. For profiles, Learn recommends Azure Files for most customers and says to use the provisioned v2 model for new deployments. Provisioned shares bill what you provision regardless of use, so size them from real profile data. Storage has its own commitments: the reservations page lists Azure Files reserved capacity, and the disk page describes one-year Premium SSD reservations from P30 to P80. Size first, then commit. User cost: slow logons if undersized. See [Azure Files](/entity/azure-files/) and [Azure NetApp Files](/entity/azure-netapp-files/).

**13. Trim Insights data.** Performance counters make up 80 to 99 percent of Insights ingestion, per Learn's cost page, whose example gives 92 to 145 MB per VM per day. You can reduce counter frequency or remove counters, and Learn advises keeping the Windows events and the diagnostics. User cost: fewer data points in some Insights visuals.

**14. Consider ephemeral OS disks for stateless pooled hosts (no documented saving).** Microsoft announced public preview on 15 October 2025 for pooled pools with session host configuration, and general availability as part of enhanced host pool management in July 2026. Neither announcement makes a cost claim, so this item is an operating choice, not a documented saving. Hosts need a VM size whose cache or temporary storage fits the OS image, suit stateless workloads and cannot be deallocated, only restarted, reimaged or deleted. For these pools Learn recommends dynamic autoscaling with the minimum percentage of active hosts at 100 in every phase, so autoscale only creates and deletes hosts. The Prerequisites page still lists ephemeral OS disks under items not supported for session hosts, which contradicts the announcement and the AVD ephemeral page, and that page keeps preview limits: Standard SSD only, no NVMe or premium SSD, not in Azure Government. Check both pages before relying on it. User cost: the OS disk returns to its original state on reimage, so keep user data in profile storage. See [ephemeral OS disks](/entity/avd-ephemeral-os-disks/).

## Licensing

**15. Avoid paying twice.** This lever applies only if you use per-user access pricing, which is for external commercial users. Learn warns that enrolling a subscription that also serves internal users with entitled licenses effectively means paying twice, and suggests a separate subscription for them. In an Azure Dev/Test subscription, end users may connect without separate license entitlement for acceptance tests or feedback. Users notice nothing.

## Measuring the result

Compare host-hours before and after each change, not only the invoice. For pooled pools, Learn's Insights page provides queries over `WVDAutoscaleEvaluationPooled`: one sums `BeganStartVmCount`, `BeganDeallocateVmCount` and `BeganForceLogoffOnSessionHostCount` per day, schedule and phase, and another reports peak occupancy and active host counts. Check peak occupancy so savings do not come from running hosts too full, and allow a full week per change.

## Where a management tool fits

Learn's autoscale FAQ says autoscale does not currently support ramping down on specific dates. Nerdio's help page for Nerdio Manager describes alternative schedules for specific dates, multiple scale-out triggers and a scale-in aggressiveness setting that defaults to High. It states that multiple auto-scale triggers are available only in the Premium edition and marks auto-scale profiles as Premium only, so check your edition first. It also notes that the monthly cost estimate counts only the Default schedule. It makes no comparison with native autoscale, so test any tool against the same measured hours. See [Nerdio auto-scaling](/entity/nerdio-auto-scaling/).

## Order of work

Start with 1, 2 and 4: they need role assignments and a Group Policy or Intune setting, not new infrastructure. Then 9 and 12, which need measurement, and 10 and 11 last, once running hours are stable. Items 7 and 14 are newly generally available and some Learn pages still show preview wording, so pilot them away from production pools.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop autoscale FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-faq)
- [Microsoft Learn: Create and assign an autoscale scaling plan](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-create-assign-scaling-plan)
- [Microsoft Learn: Autoscale scaling plans and example scenarios](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-scenarios)
- [Microsoft Learn: Monitor autoscale operations with Insights](https://learn.microsoft.com/en-us/azure/virtual-desktop/autoscale-monitor-operations-insights)
- [Microsoft Learn: What is Azure Virtual Desktop?](https://learn.microsoft.com/en-us/azure/virtual-desktop/overview)
- [Microsoft Learn: Start VM on Connect](https://learn.microsoft.com/en-us/azure/virtual-desktop/start-virtual-machine-connect)
- [Microsoft Learn: Virtual machine states and billing](https://learn.microsoft.com/en-us/azure/virtual-machines/states-billing)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Azure Advisor cost recommendations for virtual machines](https://learn.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations)
- [Microsoft Learn: What are Azure Reservations?](https://learn.microsoft.com/en-us/azure/cost-management-billing/reservations/save-compute-costs-reservations)
- [Microsoft Learn: What are savings plans?](https://learn.microsoft.com/en-us/azure/cost-management-billing/savings-plan/savings-plan-overview)
- [Microsoft Learn: Azure Hybrid Benefit for Windows Server](https://learn.microsoft.com/en-us/azure/virtual-machines/windows/hybrid-use-benefit-licensing)
- [Microsoft Learn: Azure managed disk types](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types)
- [Microsoft Learn: Storage options for FSLogix profile containers](https://learn.microsoft.com/en-us/azure/virtual-desktop/store-fslogix-profile)
- [Microsoft Learn: Understand Azure Files billing](https://learn.microsoft.com/en-us/azure/storage/files/understanding-billing)
- [Microsoft Learn: Estimate Azure Virtual Desktop Insights costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-costs)
- [Microsoft Learn: Licensing Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/licensing)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Tag Azure Virtual Desktop resources to manage costs](https://learn.microsoft.com/en-us/azure/virtual-desktop/tag-virtual-desktop-resources)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Troubleshoot autoscale issues in Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-autoscale)
- [Microsoft Learn: Ephemeral OS disks on Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy/session-hosts/ephemeral-os-disks)
- [Microsoft Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
- [Microsoft Tech Community: Now in public preview, ephemeral OS disk support on Azure Virtual Desktop](https://techcommunity.microsoft.com/t5/azure-virtual-desktop-blog/now-in-public-preview-ephemeral-os-disk-support-on-azure-virtual/ba-p/4460172)
- [Nerdio: Enable dynamic host pool auto-scaling](https://nmehelp.getnerdio.com/hc/en-us/articles/26124304193037-Enable-Dynamic-Host-Pool-Auto-scaling)
