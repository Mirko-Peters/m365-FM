---
title: "Designing a multi-region Azure Virtual Desktop deployment"
summary: "A multi-region Azure Virtual Desktop design starts with the region choice: where users are, which regions can hold regional metadata, and whether the second region serves resilience or proximity. This article covers those decisions and the parts you repeat per region; recovery models and failover steps are in the disaster recovery article."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [azure-virtual-desktop, avd-regional-host-pools]
keypoints:
  - "Microsoft manages the control plane and its regional failover. Session hosts, networking, identity, images and profile storage in each region are your design."
  - "Regional host pools have been generally available since 30 September 2026 and are offered in 14 regions, which Learn's data locations page also lists. Learn's multiregion architecture article still says public preview, so the announcement and What's new are the current status."
  - "Primary and secondary host pools, workspaces and application groups must share one deployment scope. If a region does not support regional scope, host pools created there are geographical."
  - "Metadata location is independent of where session hosts run, according to Learn, but the announcement recommends placing session host VMs in the same region as the regional metadata."
  - "Network, identity, images, profiles and capacity per region are covered in the disaster recovery article. Regional session hosts do not report errors and checkpoints into Log Analytics, which matters for monitoring design."
faq:
  - q: "Do I need two regions just to get high availability?"
    a: "No. Microsoft's multiregion article describes availability zones as a high-availability feature that does not protect against a region-wide disaster. For pooled host pools, Microsoft's design table says spreading session hosts across zones can achieve a formal 99.99 percent high-availability SLA inside one region. A second region is for disaster recovery or for users who are far from the first region."
  - q: "Can I use one host pool across two regions?"
    a: "Yes, and it avoids duplicate definitions and assignments. The trade-offs in Microsoft's article: for pooled host pools you cannot enforce regional connection preferences, users may connect to a distant session host and see higher latency, and profile storage needs a complex configuration to manage assignments in both regions."
  - q: "Must both regions support regional host pools?"
    a: "Microsoft advises that primary and secondary host pools, workspaces and application groups use the same deployment scope, and a host pool created in a region without regional support is geographical. Reading those two rules together, a regional design needs both regions on the list of 14, for example West Europe with North Europe, or East US 2 with Central US."
---

A multi-region Azure Virtual Desktop design repeats the parts you own in a second region and decides how users reach them. Microsoft operates the control plane and fails it over, so the decisions that matter are the choice of regions, the deployment scope of the objects, where session hosts sit relative to the metadata, how the feed looks to users, and whether capacity is reserved. Recovery models such as active-active, active-passive and Azure Site Recovery are compared in "Disaster recovery for Azure Virtual Desktop: options and trade-offs", so this article stays with the design.

## Decide what the second region is for

Two different needs lead to a second region, and they point to different designs.

- **Resilience.** Availability zones protect against a datacenter or zone failure, not against a region-wide disaster. Microsoft's multiregion article says not to treat zones as a disaster recovery solution. For pooled host pools, Microsoft's design table says that spreading the session host fleet across availability zones within the region can achieve a formal 99.99 percent high-availability SLA; without zones an availability set is the fallback.
- **Proximity.** Users far from the only region see higher latency. The article suggests deploying test VMs in the candidate region and using `Test-NetConnection` or PsPing from client systems.

A layout built for latency alone may not meet a recovery target, and the reverse holds too. Write down which one you are solving before choosing regions.

## Choose the regions

Three inputs decide the pair.

1. **Latency to users and back ends.** In a disaster, users connect to session hosts in the secondary region, which may be farther from both users and back-end resources. Microsoft names real-time databases, voice over IP and interactive design tools as the workloads that suffer. For some region pairs, such as West Europe and North Europe, inter-region latency is low enough that failover causes little to no impact. Measure with the Azure network round-trip latency statistics and run user acceptance testing from the secondary region before relying on it.
2. **Pairing.** Using [paired regions](/entity/azure-region-pairs/) is recommended, but the article says Azure Virtual Desktop does not require it: any combination of regions works as long as network latency allows it.
3. **Regional metadata support.** Not every region can hold regional metadata; the next section covers the list.

## Deployment scope and the region list

A host pool stores its metadata either in a geographical database that serves a whole geography or, with Regional scope, in a database inside the single region you pick. The scope is set at creation. The multiregion article says primary and secondary host pools, workspaces and application groups must use the same deployment scope, because objects of different scopes do not associate with each other. See [regional host pools](/entity/avd-regional-host-pools/) for the mechanics.

Regional host pools were announced as generally available on 30 September 2026 in the Tech Community post "Now generally available: Regional resiliency for Azure Virtual Desktop", and the September 2026 entry of What's new says the same. The post, last updated on 13 November 2026, lists 14 regions: East US 2, Central US, Australia East, Canada Central, Canada East, Central India, East Asia, Japan East, Japan West, Korea Central, North Europe, South Africa North, Southeast Asia and West Europe. Learn's data locations page, updated on 16 November 2026, shows the same 14 in its Regional column, and the Regional Host Pools page sends readers there and says availability is expanding in phases. One Learn page has not caught up: the multiregion architecture article, last updated on 9 November 2026, still says "Regional host pools are in public preview". Use the announcement and What's new for the status and the data locations page for the current region list. A comment under the post says the team is working on Germany West Central; that is not a list entry or a date. The sibling article "Regional host pools in Azure Virtual Desktop: where host pool metadata is stored" covers status and limits in full.

The design consequence follows from the same-scope rule. For a regional design, both regions of the pair should be on the list. If either is missing, host pools created there are geographical, and to keep one scope across the pair the whole pair would have to be geographical. This is an inference from the rules, not a statement in the sources. On the portal side, the announcement says the Deployment scope field is now visible in every location and that, where Regional is not yet available, only the supported scope can be selected; the data locations page says such a region is set to geographical automatically. Either way, check the Deployment scope column of the host pool list after creation.

For new host pools in a supported region, the announcement strongly recommends Regional, labels Geographical as not recommended, and says Microsoft plans to stop allowing new Geographical host pools later, without a date. Learn's multiregion article also recommends Regional for new host pools and planning the transition of existing ones. Existing geographical host pools keep their scope. Migration is described as coming in a phased rollout, and the scope cannot be changed in place, so a move means new objects.

## Metadata region and session host region

According to Learn's multiregion article, the metadata location is independent of where session hosts run: you can place the metadata in one supported region and deploy VMs in a different region. The announcement's portal steps add a recommendation to place session host VMs in the same region as the regional metadata, and Learn's Regional Host Pools page says the session host region must be the region that contains the virtual network. For a two-region design, a reasonable design is one host pool per region, each with its metadata and session hosts together, so a problem in one region affects only that region's pool. Learn's multiregion article describes the same effect: a regional database problem affects only host pools in that region, and the secondary pool keeps working with its own control plane infrastructure.

The control plane itself is Microsoft's. Learn's service architecture article lists the web, broker and gateway services, the resource directory and the geographical and regional databases as Microsoft-managed, and says you manage session hosts, their images and applications, virtual network connectivity, session host resilience and recovery, and user identities and access.

## One host pool or two

Learn's multiregion article describes a single host pool spanning regions as an option for specific circumstances. The trade-offs are the ones in the FAQ above. Two host pools, one per region, cost more definitions but give you regional connection control and fit the placement recommendation above (an inference).

With two pools, the feed decides how users experience it:

- **Both pools in use (active-active).** Users assigned to application groups in both pools see duplicate entries in the client. The article advises separate workspaces with clear names and labels that reflect the purpose of each resource.
- **Secondary on standby (active-passive).** The client shows no duplicates and users keep one workspace.

Workspace layout across teams and regions, including the scope rule for workspaces, is the subject of "Designing workspaces for multiple teams and regions". For user groups with different continuity needs, Microsoft recommends separate host pools with different configurations: for example, users of a mission-critical application get a fully redundant host pool with geo-disaster recovery, while development and test users use a separate host pool with no DR. See [pooled host pools](/entity/avd-pooled-host-pool/) and [personal host pools](/entity/avd-personal-host-pool/).

## What to repeat in each region

Network, identity, images, profile storage and capacity follow the same checklist for any second region, and the disaster recovery article "Disaster recovery for Azure Virtual Desktop: options and trade-offs" works through it, including the Cloud Cache configuration, quota versus physical capacity and the 90-day start rule for standby hosts. Three points belong to the design itself:

1. **Pooled and personal pools differ.** Learn's multiregion table lists FSLogix Cloud Cache for pooled host pools, and for personal host pools no Cloud Cache, with Azure Site Recovery set up per VM. Decide per pool type before you count what the second region costs. See [pooled host pools](/entity/avd-pooled-host-pool/) and [personal host pools](/entity/avd-personal-host-pool/).
2. **Monitoring needs a decision.** One Log Analytics workspace for both regions gives a single view in [Azure Virtual Desktop Insights](/entity/avd-insights/), but the secondary region cannot use a workspace in an unavailable region. Use a workspace per region or test the workspace's replication and failover capabilities. Learn's Regional Host Pools page also notes that errors and checkpoints are not reported into Log Analytics for regional session hosts, so check what your dashboards and alerts still receive.
3. **Capacity is a per-region decision.** Quota alone does not guarantee that physical capacity is available during a regional disaster. For an active-passive pool, capacity is guaranteed only if VMs are running or on-demand capacity reservations exist, so decide per workload how much of the secondary to keep running or reserved.

## Putting the decisions together

| Decision | Choose | When |
|---|---|---|
| Region pair | Low-latency pair, preferably both on the regional list | Recovery must not degrade latency-sensitive apps |
| Scope (inferred from the same-scope rule) | Regional for both regions | Both regions are on the list; otherwise both geographical |
| Host pools | One per region, session hosts next to their metadata (announcement's recommendation) | Regional connection control matters |
| Single pool across regions | Only with the stated trade-offs | Duplicate definitions outweigh latency and profile complexity |
| Workspaces | Separate and clearly named when both pools are live | Users would otherwise see duplicates |
| Capacity | On-demand capacity reservations in the secondary | Startup must be guaranteed |

Whatever you choose, test failover from the secondary region with a dedicated test group. Microsoft warns against Site Recovery test failover on session hosts; the disaster recovery article covers the safe approach.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Tech Community: Now generally available: Regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
- [Microsoft Learn: Multiregion BCDR for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: Regional Host Pools - Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Azure Virtual Desktop data locations](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: Create a workspace and an application group](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
