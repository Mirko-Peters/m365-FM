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
  - "Regional host pools have been generally available since 30 September 2026 and are offered in 14 regions. The Learn multiregion page still says public preview, so the Tech Community announcement and What's new are the current status."
  - "Primary and secondary host pools, workspaces and application groups must share one deployment scope. If a region does not support regional scope, host pools created there are geographical."
  - "Metadata location is independent of where session hosts run, but Microsoft recommends placing session host VMs in the same region as the regional metadata."
  - "Quota does not guarantee capacity. Compute capacity is guaranteed only for resources already allocated and active, and on-demand capacity reservations reserve it in advance."
faq:
  - q: "Do I need two regions just to get high availability?"
    a: "No. Microsoft's multiregion article describes availability zones as a high-availability feature that does not protect against a region-wide disaster. Spreading session hosts across zones gives a 99.99 percent availability SLA inside one region. A second region is for disaster recovery or for users who are far from the first region."
  - q: "Can I use one host pool across two regions?"
    a: "Yes, and it avoids duplicate definitions and assignments. The trade-offs in Microsoft's article: for pooled host pools you cannot enforce regional connection preferences, users may connect to a distant session host and see higher latency, and profile storage needs a complex configuration to manage assignments in both regions."
  - q: "Must both regions support regional host pools?"
    a: "For a regional design, yes. Microsoft advises that primary and secondary host pools, workspaces and application groups use the same deployment scope, and a host pool created in a region without regional support is geographical. The announced list has 14 regions, for example West Europe with North Europe, or East US 2 with Central US."
---

A multi-region Azure Virtual Desktop design repeats the parts you own in a second region and decides how users reach them. Microsoft operates the control plane and fails it over, so the decisions that matter are the choice of regions, the deployment scope of the objects, where session hosts sit relative to the metadata, how the feed looks to users, and whether capacity is reserved. Recovery models such as active-active, active-passive and Azure Site Recovery are compared in "Disaster recovery for Azure Virtual Desktop: options and trade-offs", so this article stays with the design.

## Decide what the second region is for

Two different needs lead to a second region, and they point to different designs.

- **Resilience.** Availability zones protect against a datacenter or zone failure, not against a region-wide disaster. Microsoft's multiregion article says not to treat zones as a disaster recovery solution. Spreading session hosts across zones within a region gives a formal 99.99 percent high-availability SLA, and without zones an availability set is the fallback.
- **Proximity.** Users far from the only region see higher latency. The article suggests deploying test VMs in the candidate region and using `Test-NetConnection` or PsPing from client systems.

A layout built for latency alone may not meet a recovery target, and the reverse holds too. Write down which one you are solving before choosing regions.

## Choose the regions

Three inputs decide the pair.

1. **Latency to users and back ends.** In a disaster, users connect to session hosts in the secondary region, which may be farther from both users and back-end resources. Microsoft names real-time databases, voice over IP and interactive design tools as the workloads that suffer. For some region pairs, such as West Europe and North Europe, inter-region latency is low enough that failover causes little to no impact. Measure with the Azure network round-trip latency statistics and run user acceptance testing from the secondary region before relying on it.
2. **Pairing.** Using [paired regions](/entity/azure-region-pairs/) is recommended, but the article says Azure Virtual Desktop does not require it: any combination of regions works as long as network latency allows it.
3. **Regional metadata support.** This is the constraint most designs run into, covered in the next section.

## Deployment scope and the region list

A host pool stores its metadata either in a geographical database that serves a whole geography or, with Regional scope, in a database inside the single region you pick. The scope is set at creation. The multiregion article says primary and secondary host pools, workspaces and application groups must use the same deployment scope, because objects of different scopes do not associate with each other. See [regional host pools](/entity/avd-regional-host-pools/) for the mechanics.

Regional host pools were announced as generally available on 30 September 2026 in the Tech Community post "Now generally available: Regional resiliency for Azure Virtual Desktop", and the September 2026 entry of What's new says the same. The post, last updated on 13 November 2026, lists these regions: East US 2, Central US, Australia East, Canada Central, Canada East, Central India, East Asia, Japan East, Japan West, Korea Central, North Europe, South Africa North, Southeast Asia and West Europe. Two Learn pages lag behind: the multiregion article still says "Regional host pools are in public preview", and the Regional Host Pools article still names only East US 2 and Central US. The post points to that Learn page as the current region list, so expect it to be updated. A comment under the post says the team is working on Germany West Central; that is not a list entry or a date.

The design consequence is simple. For a regional design, both regions of the pair should be on the list, and workspaces and application groups follow the host pool's scope. If either region is missing, host pools created there are geographical, and by the same-scope rule the pair is geographical as well. Learn's page on creating host pools says the Deployment scope field is not shown for such a region, while the announcement says the portal now shows the field in every location and lets you pick only the supported scope. Either way, check the Deployment scope column of the host pool list after creation.

For new host pools in a supported region Microsoft "strongly recommend[s] Regional". Existing geographical host pools keep their scope. Migration is announced as "coming in a phased rollout", and the scope cannot be changed in place, so a move means new objects.

## Metadata region and session host region

The metadata location is independent of where session hosts run. The multiregion article says you can place the metadata in one supported region and deploy VMs in a different region. That freedom is what lets a second region host session hosts for a pool, but the announcement adds a recommendation: place session host VMs in the same region as the regional metadata. For a two-region design this suggests one host pool per region, each with its metadata and session hosts together, so a problem in one region affects only that region's pool. The article describes the same effect: a regional database problem affects only host pools in that region, and the secondary pool keeps working with its own control plane infrastructure.

The control plane itself is Microsoft's. Learn's service architecture article lists the web, broker and gateway services, the resource directory and the geographical and regional databases as Microsoft-managed, and says you manage session hosts, their images and applications, virtual network connectivity, session host resilience and recovery, and user identities and access.

## One host pool or two

A single host pool can span regions, but Microsoft treats that as a choice for specific circumstances. The trade-offs are the ones in the FAQ above. Two host pools, one per region, cost more definitions but give you regional connection control and match the metadata recommendation.

With two pools, the feed decides how users experience it:

- **Both pools in use (active-active).** Users assigned to application groups in both pools see duplicate entries in the client. The article advises separate workspaces with clear names and labels that reflect the purpose of each resource.
- **Secondary on standby (active-passive).** The client shows no duplicates and users keep one workspace.

Workspace layout across teams and regions, including the scope rule for workspaces, is the subject of "Designing workspaces for multiple teams and regions". Use separate host pools for user groups with different continuity needs, for instance a live secondary for a critical application and a standby for the rest. See [pooled host pools](/entity/avd-pooled-host-pool/) and [personal host pools](/entity/avd-personal-host-pool/).

## What to repeat in each region

The multiregion article's design areas reduce to this checklist.

1. **Network.** Put the primary and the secondary environment in separate spoke virtual networks, each connected to a hub in its own region, with connectivity between the hubs. Each hub needs hybrid connectivity, firewall services, identity and management resources. Without redundant hybrid connectivity such as ExpressRoute or VPN gateways in the secondary region, session hosts start there but users cannot reach applications and data. Confirm that line-of-business applications and dependencies exist in the secondary region.
2. **Identity.** Microsoft Entra ID is a global, resilient service and needs no extra work. With AD DS, run at least two domain controllers in the primary region and at least one with global catalog and DNS roles in the secondary. Microsoft Entra Connect needs a second instance in the secondary region in staging mode, and Microsoft Entra Domain Services can add a replica set there.
3. **Images.** Use the same golden image in both regions. [Azure Compute Gallery](/entity/azure-compute-gallery/) is a regional resource, so create a gallery, image definition and image version in each region; the secondary version can be copied from the primary. Each image replica supports a maximum number of parallel VM deployments, so plan replica counts for your batch size.
4. **Profiles.** Profile storage is the part that does not fail over by itself. For pooled pools the article uses [FSLogix Cloud Cache](/entity/fslogix-cloud-cache/) across regions; its setup is in the disaster recovery article.
5. **Monitoring.** One Log Analytics workspace for both regions gives a single view in [Azure Virtual Desktop Insights](/entity/avd-insights/), but the secondary region cannot use a workspace in an unavailable region. Use a workspace per region or test the workspace's replication and failover capabilities.

## Quota and capacity per region

Quota and capacity are different things, and the multiregion article is explicit. During a regional disaster, deallocated VMs and newly deployed session hosts compete for capacity in the secondary region, and quota alone does not guarantee that physical capacity is available. On-demand capacity reservations reserve compute capacity in advance and guarantee VM startup. Azure reservations (reserved instances) lower cost but do not reserve capacity. The same limit applies to keeping session hosts deallocated and to deploying hosts on demand: compute capacity is guaranteed only if the related resources are already allocated and active.

For an active-passive pool, capacity is therefore not guaranteed unless VMs are running or capacity reservations exist. Check VM quota and Azure RBAC in both subscriptions, then decide per workload how much of the secondary to keep running or reserved.

## Putting the decisions together

| Decision | Choose | When |
|---|---|---|
| Region pair | Low-latency pair, preferably both on the regional list | Recovery must not degrade latency-sensitive apps |
| Scope | Regional for both regions | Both regions are supported; otherwise both geographical |
| Host pools | One per region, session hosts next to their metadata | Regional connection control matters |
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
