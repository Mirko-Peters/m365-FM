---
title: "Common AVD design mistakes and how to avoid them"
summary: "Several Azure Virtual Desktop design choices are hard or impossible to change after deployment, and several others fail only under load or at scale. This article lists seven mistakes that Microsoft Learn's own statements make avoidable, with the check that catches each one."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop]
keypoints:
  - "The host pool type and the management approach (standard or session host configuration) cannot be changed after creation, and a session host configuration works with pooled host pools only. Decide both before the first deployment."
  - "Treat Learn's sizing table as an initial estimate: 6, 4, 2 or 1 users per vCPU for light, medium, heavy and power multi-session workloads, VM sizes between 6 and 24 vCPUs, and several smaller VMs once 20 or more users share one."
  - "Place session hosts so round-trip time from the client network to the Azure region stays under 150 ms, which Learn gives as a target. For new host pools, Learn recommends the regional deployment scope where it is available."
  - "Check identity prerequisites early: the domain-join account cannot use MFA, Entra Domain Services hosts cannot be managed with Intune, and Learn's pages differ on whether FSLogix on Entra-joined hosts needs hybrid identities."
  - "Learn's limits differ by page: about 132 VMs per template run in the FAQ, 400 or 500 per portal deployment, quota per region and per VM series, and fixed AVD object limits such as 400 host pools per workspace."
faq:
  - q: "Can I change a pooled host pool to personal later?"
    a: "No. Learn's FAQ says that once you create a host pool you cannot change its type, although you can move VMs you registered to a host pool of a different type. The management approach is also fixed at creation, and a host pool created without a session host configuration cannot get one later."
  - q: "How many users can one session host take?"
    a: "Learn gives starting ratios for multi-session hosts: 6 users per vCPU for light workloads, 4 for medium, 2 for heavy and 1 for power. The page calls them generic guidelines for initial estimates and describes a pilot approach and a simulation approach for finding the real capacity, because logon peaks and workload mix change the result."
  - q: "Does the latency limit apply to session hosts or to users?"
    a: "Learn's prerequisites page says round-trip time from the client's network to the Azure region that contains the host pools should be less than 150 ms, and recommends creating session hosts in the region closest to users. It is a target for the path between user and region, so measure from real client networks."
---

The costly Azure Virtual Desktop design mistakes are the ones fixed at creation or found only under load: the host pool type and management approach, host size, region and network, identity, exposure of the session hosts, profile storage, and quota and limits. Microsoft Learn states a rule or a limit for each of them, so a short review before the first deployment can check each against Learn's wording. This article covers these seven, starting with the two choices Learn says cannot be changed after creation.

The deep dives (autoscale, drain mode, security, multi-region design, cost, monitoring) sit in other articles on the site.

## 1. Choosing the host pool type and management approach by habit

Learn's [host pool management approaches page](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches) carries a caution: the approach is set when you create the host pool and cannot be changed later, and a host pool created without a [session host configuration](/entity/avd-session-host-configuration/) cannot get one afterwards. The session host configuration approach works with pooled host pools only, and with it you cannot create, update or scale session hosts outside the Azure Virtual Desktop service using tools built for standard management.

The [AVD FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq) adds that a host pool's type, [pooled](/entity/avd-pooled-host-pool/) or [personal](/entity/avd-personal-host-pool/), cannot be changed after creation. It also says in-place upgrade of the operating system is supported for personal host pools but not for pooled ones. In our reading, that means a pooled pool needs another route for operating system version changes, such as redeploying hosts from an updated image.

Learn's [what's new page](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) adds a dependency. Its September 2025 entry says that creating a new host pool with a session host configuration in the Azure portal requires assigning a managed identity. Its September 2026 entry says that in a future service update, host pools with a session host configuration will require a managed identity to add session hosts. The [deployment page](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) still says you can choose whether to assign one at creation. Plan for a managed identity either way; the article on managed identity in Azure Virtual Desktop covers the setup.

**How to avoid it.** Write down three answers before you create the pool: shared or dedicated desktops, whether you want Azure Virtual Desktop to create and update hosts or your own tooling to do it, and how pooled hosts will get operating system updates. Then pick the type and approach to match.

## 2. Sizing hosts from a table of ratios instead of a workload

Learn's [VM sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs) say plainly that they are generic guidelines for initial estimates. For multi-session hosts they give maximum users per vCPU: 6 for light, 4 for medium, 2 for heavy and 1 for power workloads. They also set shape rules: keep VMs between 6 and 24 vCPUs, never above 32 cores, and with 20 or more users on one VM prefer several smaller VMs. Later the same page gives a recommended range of 4 to 24 cores, so its own figures differ at the low end. Doubling cores does not double capacity (a typical factor of 1.5 to 1.9), and logon is CPU-intensive, so a host can struggle at 9 AM.

Our arithmetic: 100 medium users at 4 per vCPU need at least 25 vCPUs, so four 8-vCPU hosts. That is a floor from a table, not a design.

**How to avoid it.** Learn describes a pilot approach (one test host, rising load, watching CPU, paging, disk, network and user feedback) and a simulation approach, and says piloting suits smaller deployments and simulation larger ones. The same page says you can also use breadth-first load balancing to spread users, and that many smaller VMs are easier to shut down when idle. The sizing article in this series has the full numbers.

## 3. Ignoring latency, region and the network next to the hosts

Learn's [prerequisites page](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) says round-trip time from the client's network to the Azure region holding the host pools should be less than 150 ms and recommends creating session hosts in the region closest to users. The virtual network must be in the same Azure region as the session host. If the hosts use AD DS or Microsoft Entra Domain Services, the network must reach the domain controllers and DNS servers, because hosts join the domain. [FSLogix](/entity/fslogix/)'s own prerequisites say network latency, bandwidth and proximity to the storage provider are pivotal to the user's experience.

Region choice also covers where service metadata lives. Learn's [data locations page](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations) describes a deployment scope of either Geographical or Regional, and says that in a region without regional support the scope is set to geographical automatically. Microsoft announced general availability of regional host pools on 30 September 2026 (Tech Community) and recommends Regional for new host pools where it is available. Learn's [regional host pools page](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools) labels regional "recommended" and geographical "not recommended" in the portal, and says that in PowerShell a deployment without the scope parameter defaults to Geographical. It also says only objects of the same deployment scope can be associated, so a regional application group cannot join a geographical workspace or the reverse, and that errors and checkpoints are not reported into Log Analytics for regional session hosts.

**How to avoid it.** Measure round-trip time from real client networks, deploy in the closest region, and keep the host subnet, the profile share and the identity service in the same region or well connected to it. Set the deployment scope deliberately before you create the workspace.

## 4. Leaving identity prerequisites for deployment day

The prerequisites page lists several rules that surface late if nobody reads them:

- The account used to join a domain cannot have MFA enabled.
- Users need accounts in Microsoft Entra ID, and personal Microsoft accounts are not supported. With hybrid identities, the UPN or the SID must match across AD DS and Entra ID.
- For FSLogix profile containers on Entra-joined session hosts, the prerequisites page says to use Azure Files or Azure NetApp Files with hybrid identities created in AD DS and synchronized. Learn's [FSLogix page on Azure Files with Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid) is broader: it covers hybrid identities and, in the Azure cloud only, cloud-only or external identities. What's new lists that support as generally available in May 2026. The two pages disagree, so check both.
- Hosts joined to Microsoft Entra Domain Services cannot be managed with Intune, and Entra-joined Windows Server hosts cannot be enrolled in Intune because Intune does not support Windows Server.

**How to avoid it.** Choose the identity model first, then check the management tool, the profile storage and the join account against the table of supported scenarios on that page.

## 5. Exposing session hosts that need no exposure

Users connect through a reverse connection, so Learn says no inbound ports are needed. It recommends not opening inbound port 3389, not assigning public IP addresses to session hosts, and using just-in-time VM access if 3389 must be opened for troubleshooting. Two traps appear on the same page: the required URLs must not be blocked by filtering or firewalls, and no policy may disable Windows Installer, because the service then cannot install agent updates.

**How to avoid it.** Put the URL list and the Windows Installer rule into your network and Group Policy reviews. The security checklist on the site covers the rest.

## 6. Treating profile storage as an afterthought

In our reading, pooled users need their profile outside the VM, because a user can be sent to a different host at the next sign-in. Learn's FSLogix [prerequisites page](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites) says FSLogix does not provide storage architecture or design guidance and that you design storage for your workload. Its [storage options page](https://learn.microsoft.com/en-us/fslogix/concepts-container-storage-options) gives an example of 10 steady-state IOPS and 50 sign-in or sign-out IOPS per user, or about 1,000 IOPS for 100 users and about 5,000 while they sign in and out.

**How to avoid it.** Size the share for the sign-in peak, not the average, and set container size and locking deliberately (see the article on profile container settings).

## 7. Meeting quota and limits at go-live

Learn's pages give different limits for large deployments, and they do not reconcile them. The AVD FAQ says an Azure template is limited to 800 objects and each VM creates about six, so around 132 VMs per template run. The [deployment page](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) says you can deploy up to 400 session hosts at once with standard management and up to 500 session host VMs with a session host configuration, depending on subscription quota. The service-limits page lists 800 resources per template including copy count and says some template limits can be exceeded with a nested template.

vCPU quota applies per region and per VM series. The [service-limits page](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits) says virtual machine cores have a regional total limit and a separate limit per size series such as Dv2 and F, and the two are enforced separately. Its table shows 20 per region for both. A footnote says defaults vary by offer category, that an Enterprise Agreement subscription defaults to 350, and that other subscriptions default to 20 cores. A quota for 30 vCPUs in West Europe does not raise any other region. 

The same page lists Azure Virtual Desktop object limits: 1,300 workspaces per Microsoft Entra tenant, 400 host pools per workspace, 1,000 application groups per tenant (a support ticket beyond that), 500 RemoteApps per application group, 200 role assignments per object and 10,000 session hosts per host pool.

**How to avoid it.** Multiply hosts by vCPUs per host, for example 20 hosts of 8 vCPUs is 160 vCPUs, and compare that with both the regional total and the quota of the VM series in the target region. Request increases before the deployment window, and check planned workspaces, host pools and role assignments against the object limits.

## Check the unsupported list

The prerequisites page lists configurations that are not supported for session hosts: 32-bit operating systems, N, KN and LTSC editions, ultra disks as the OS disk, Virtual Machine Scale Sets and Arm64-based VMs. It also still lists ephemeral OS disks for Azure VMs as unsupported. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). That post says these features need a host pool with a session host configuration, and that ephemeral OS disks need a VM size with enough local storage; the prerequisites page does not yet reflect this. Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit.

For Windows Server session hosts, licensing differs: Learn lists RDS CAL with Software Assurance or RDS user subscription licenses, and says per-user access pricing is not available for Windows Server.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Azure Virtual Desktop prerequisites](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Session host virtual machine sizing guidelines](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/virtual-machine-recs)
- [Microsoft Learn: Data locations for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: Regional host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: FSLogix prerequisites](https://learn.microsoft.com/en-us/fslogix/overview-prerequisites)
- [Microsoft Learn: FSLogix container storage options](https://learn.microsoft.com/en-us/fslogix/concepts-container-storage-options)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Microsoft Learn: Azure subscription and service limits](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Tech Community: Now generally available, regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
