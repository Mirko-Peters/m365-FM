---
title: "Regional host pools in Azure Virtual Desktop: where host pool metadata is stored"
summary: "A regional host pool stores its metadata in a database inside the Azure region you choose, while a geographical host pool stores it in a database shared across the geography. This article explains the control plane behind that choice, how to create a regional host pool, and which limits apply."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-regional-host-pools, avd-host-pool]
keypoints:
  - "Deployment scope decides where metadata lives: Regional means a database in one Azure region, with replicas across availability zones and replication to a paired region where applicable. Geographical, the default, means a database that serves the whole geography. Learn says there are no functional differences."
  - "Scope is set when the object is created and cannot be changed. Host pools, workspaces, application groups and App Attach packages of different scopes cannot be associated with each other."
  - "Regional host pools have been generally available since 30 September 2026 and are offered in 14 regions, which Learn's data locations article lists. Some preview wording remains on Learn pages."
  - "Microsoft strongly recommends Regional for new host pools in a supported region, and recommends placing session host VMs in the same region as the regional metadata, although the metadata location is not technically tied to where VMs run."
  - "In PowerShell the scope is the -DeploymentScope parameter. If you omit it, the host pool becomes geographical."
faq:
  - q: "Are regional host pools generally available?"
    a: "Yes. A Microsoft Tech Community post from 30 September 2026 (last updated 13 November 2026) and the September 2026 entry of What's new announce general availability, with 14 regions. Learn's Regional Host Pools article says the service now supports regional host pools and refers to the Data locations article, which lists the same 14 regions. A few preview remnants remain on Learn, such as the module version 5.4.5-preview."
  - q: "Can I convert an existing geographical host pool to regional?"
    a: "Not in place. Learn says the scope cannot be changed after creation. The announcement says support for migrating existing geographical host pools is coming in a phased rollout, with no timeline. Until then, deploy a new regional host pool with the same configuration and move users over."
  - q: "Do regional host pools change how users connect?"
    a: "No. Learn states there are no functional differences between the two types for end users. Only the location of the metadata changes."
---

A regional host pool keeps its metadata in a database inside one Azure region, with replicas across availability zones and a copy replicated to a paired region where applicable. A geographical host pool, the default, keeps it in a database that serves every Azure region of the geography. Everything else about the host pool, including how users connect, stays the same, and the choice cannot be reversed after creation.

This article is about the mechanics: what the metadata is, where each scope stores it, how to create a regional host pool and what it restricts. What the choice means for compliance and outage scenarios is covered separately in "What regional host pools mean for data residency and resilience". Sources are listed at the end and were retrieved on 17 November 2026.

## What "metadata" means here

Azure Virtual Desktop splits into Microsoft-managed components and the parts you run. Microsoft Learn names the Microsoft-managed components as the web service, the broker service, the gateway service, a resource directory and the databases. Two kinds of database hold the data those services need, such as the `.rdp` files and icons that make up a user's feed:

- The **geographical database** serves host pools with Geographical scope. It serves all Azure regions in its geography.
- The **regional database** serves host pools with Regional scope. It is stored within a single region.

The resource directory tells the web service which database holds a given user's connection information. During feed discovery, Traffic Manager sends the user to the nearest web service instance, which asks the broker in the same region for the files and icons, and the broker queries the resource directory and the relevant database. Your own resources are not in this path: Learn says session hosts can be in any region, and the BCDR article says the metadata location is independent of session host VM locations. See also the entity pages for [regional host pools](/entity/avd-regional-host-pools/) and [host pools](/entity/avd-host-pool/).

## Deployment scope

The setting is called deployment scope and has two values:

| | Geographical | Regional |
|---|---|---|
| Where metadata is stored | In the geography of the Azure region you pick, with no dependency on one region; geo-redundant mirrors within the geography | Inside the single Azure region you pick, replicated across availability zones and to a paired region where applicable |
| Default | Yes | No, must be selected |
| Applies to | Host pools, workspaces, application groups, App Attach packages | Same objects |
| Can it be changed later | No | No |

Application groups inherit the scope of their host pool. A regional host pool can join only a regional workspace and contain only regional application groups, and the reverse applies to geographical objects. Learn adds that the portal greys out incompatible objects and that PowerShell or REST requests that mix scopes fail. Learn's Deploy Azure Virtual Desktop article says regional and geographical objects can coexist in the same subscription and region and are managed independently.

Learn gives the benefits as follows: more resilient connectivity, because cross-region dependencies are removed and an Azure region or database outage affects fewer host pools, and control over data sovereignty, because the metadata sits in a region you choose. On failover of the regional database there is a short period in which new connections fail, while existing connections are unaffected.

## Status and supported regions

Regional host pools are generally available. The Tech Community post "Now generally available: Regional resiliency for Azure Virtual Desktop" was published on 30 September 2026 and last updated on 13 November 2026, and the September 2026 entry of [What's new](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) says the same. The post lists 14 supported regions:

- East US 2 and Central US, the original preview regions
- Australia East, Canada Central, Canada East, Central India, East Asia, Japan East, Japan West, Korea Central, North Europe, South Africa North, Southeast Asia and West Europe, added in later updates

The post does not list a German region. A comment under it says the team is working on Germany West Central; that is not a date or a commitment. The preview announcement said regional databases are being deployed into every Azure region, and the service architecture article says Microsoft-managed components are located in around 40 Azure regions, but neither is a list of regions where regional scope works today.

Learn matches the announcement on the region count. The [Data locations article](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations), last updated on 16 November 2026, has a table with a Geographical and a Regional column, and the same 14 regions carry a check in the Regional column. The [Regional Host Pools article](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools) says Azure Virtual Desktop now supports regional host pools, refers to the Data locations article for available regions and adds that regional availability is expanding in phases. Some preview wording remains there: module version 5.4.5-preview for `-DeploymentScope`, a sentence that speaks of the service becoming generally available, and the OS disk row. The multiregion BCDR article on Learn still says regional host pools are in public preview, so status labels differ between Learn pages. The announcement and What's new say general availability.

In a region without regional support, Learn says the deployment scope is selected as geographical automatically, and the announcement says PowerShell calls with regional scope return "Not Supported".

## Create a regional host pool

In the Azure portal:

1. Sign in, search for **Azure Virtual Desktop** and select **Host pools**, then **Create**.
2. On the **Basics** tab, choose subscription, resource group, host pool name and **Location**.
3. Set **Deployment scope** to **Regional**. The value **Geographical** creates a standard host pool. Learn describes the drop-down as offering regional (recommended) and geographical (not recommended), and says the only available scope is selected automatically when a region supports one scope. The announcement says the field is shown for any location, that where both scopes are available you must choose explicitly, and that elsewhere only the supported scope can be selected.
4. Complete the remaining tabs as for any host pool. If you register a desktop application group on the Workspace tab, the workspace must be regional too.

In PowerShell, Learn documents the `-DeploymentScope` parameter, added in the 5.4.5-preview version of the `Az.DesktopVirtualization` module, and the announcement shows the same parameter:

```powershell
New-AzWvdHostPool -DeploymentScope Regional ...
```

The parameter is optional. If it is not set, the deployment defaults to `Geographical`. The module version in the Learn article is a preview build and the announcement names no version, so confirm that your installed module accepts the parameter before scripting this.

## Limits stated in the sources

Some statements on the Learn page date from the preview period, and the announcement neither confirms nor withdraws them.

- **Logging.** Learn says errors and checkpoints are not reported to Log Analytics for regional session hosts. This is still on the Learn page; the announcement does not mention it. If your monitoring depends on those records, test it before moving production users.
- **OS disk, preview wording.** Learn says that during preview only Standard SSD is supported and is selected automatically once ephemeral OS disks are configured. Whether this still holds after general availability is not stated in the sources.
- **Features supported during preview**, according to the preview Tech Community post: session host update, dynamic autoscaling, Private Link, App Attach packages and automated host pool creation. The announcement does not repeat this list, so verify each feature before relying on it.
- **Deprecation.** Learn says creating new geographical host pools will be deprecated at a future date. The announcement says Microsoft plans to deprecate it and will communicate the timeline separately. No dates are given.
- **Interoperability.** During coexistence the two types are not interoperable.

## Moving from geographical to regional

Because the scope cannot be changed, a move means building new objects. The announcement says existing geographical host pools need no action now and that support for migrating them is coming in a phased rollout. The Regional Host Pools article says Azure Virtual Desktop is working toward transitioning existing geographical host pool metadata to regional infrastructure, with more information to follow, and Learn's Deploy Azure Virtual Desktop article says the same as the announcement. The BCDR article is the outlier: it says Microsoft provides migration tooling. Until a migration path exists, the preview post describes deploying regional host pools manually with the same configuration and moving users over. A practical sequence follows from the scope rules:

1. Create a regional workspace first, because only regional application groups can join it.
2. Create the regional host pool and its application groups in a supported region.
3. Register session hosts, repeat the assignments and test with a pilot group.
4. Move users group by group, and keep the geographical objects until the pilot is stable.

The multiregion BCDR article notes that users assigned to host pools in two workspaces can see duplicate feed entries, and advises separate, clearly named workspaces.

## Checking what you already have

Learn says the host pool list in the portal has a **Deployment scope** column that shows each host pool's type. Creating host pools, workspaces and application groups needs **Desktop Virtualization Contributor** on the resource group or subscription, and assigning users additionally needs `Microsoft.Authorization/roleAssignments/write`, which User Access Administrator and Owner include. Nothing in the sources says a regional host pool needs a different role.

## Where this fits

For new host pools, Learn strongly recommends regional host pools in the regions you require, marks regional as recommended and geographical as not recommended in the portal drop-down, and suggests considering a move of existing geographical host pools. The announcement adds a placement recommendation: put session host VMs in the same region as the regional metadata, even though the BCDR article says metadata location is independent of VM location. The choice covers the metadata location only. It does not make session hosts or profile storage resilient: those remain your responsibility (our reading), and Learn's disaster recovery concepts article discusses profile management and user data as their own topics. Region pairing and multi-region layouts are covered in "Designing a multi-region Azure Virtual Desktop deployment", and the data residency side in "What regional host pools mean for data residency and resilience".

## Sources

All retrieved on 17 November 2026.

- [Microsoft Tech Community: Now generally available: Regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
- [Microsoft Learn: Regional Host Pools - Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Data locations for Azure Virtual Desktop (list of regions)](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Disaster recovery concepts for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/disaster-recovery-concepts)
- [Microsoft Learn: Multiregion BCDR for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Tech Community: Now in public preview: Azure Virtual Desktop regional host pools](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/-/4474598)
