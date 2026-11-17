---
title: "What regional host pools mean for data residency and resilience"
summary: "Regional deployment scope stores host pool metadata in the single Azure region you choose and limits a metadata database problem to that region, with documented exceptions such as Azure Resource Manager paths, diagnostic data and a paired-region replica. It does not move session hosts, profile storage or identity, and Microsoft's pages do not yet use one status label for the feature."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-regional-host-pools, avd-host-pool]
keypoints:
  - "Regional scope stores customer input data and customer data for the host pool and its related objects within the single Azure region you choose. Geographical scope stores them in the geography of that region."
  - "Exceptions to the scope setting: Azure Resource Manager paths are organizational information stored outside the chosen geography, session diagnostic data goes to the location closest to the user and to the host pool's location, and service-generated data sent to the US geography includes scrubbed data. Learn says customer data is not aggregated."
  - "Regional metadata is replicated across availability zones in the region and, where applicable, to a paired region for disaster recovery. Learn does not say which paired region."
  - "The scope setting does not cover session hosts, applications, network connectivity or identities, which Learn lists as customer responsibilities. User and app data resides in the region you choose and is not managed by the service."
  - "Status labels differ between pages. What's new and a Tech Community post from 30 September 2026 describe general availability, while the multiregion BCDR article on Learn still says public preview and the Regional Host Pools article keeps a few preview remnants."
faq:
  - q: "Does a regional host pool keep all my users' data in one region?"
    a: "No. The scope setting applies to Azure Virtual Desktop service metadata such as host pool and application group names and user principal names. Microsoft Learn says user and app data resides in the region you choose and is not managed by the service, and that Microsoft does not control the regions from which you or your users access it."
  - q: "Does it protect me if my session hosts' region fails?"
    a: "No. It limits the impact of a metadata database problem to the affected region. Session host resilience, backup and recovery stay with you, according to Microsoft Learn."
  - q: "Is a regional host pool a compliance guarantee?"
    a: "The multiregion BCDR article lists data sovereignty as a benefit of regional host pools, but the sources give no compliance guarantee. They describe where data is stored and which categories are excluded. Whether that satisfies a specific legal requirement is a question for your legal and compliance teams."
---

Regional deployment scope stores the metadata of a host pool and its related objects in a database inside one Azure region you choose, so a metadata database problem is limited to that region. It covers the service's own records. It does not decide where session hosts run, where profiles are stored or who can sign in, and it has documented exceptions.

This article looks at what Microsoft Learn says about data locations and service architecture. How the control plane and the setting work is covered in "Regional host pools in Azure Virtual Desktop: where host pool metadata is stored". Sources were retrieved on 17 November 2026.

## Status

Microsoft's What's new page lists regional host pools as generally available in September 2026, and a Tech Community post dated 30 September 2026 names 14 regions in total. The Regional Host Pools article on Learn says Azure Virtual Desktop now supports regional host pools and sends readers to the Data locations article for available regions, which lists the same 14 regions in a Regional column. It keeps some preview wording: module version 5.4.5-preview for the `-DeploymentScope` parameter, a sentence about the service becoming generally available, and the ephemeral OS disk row. The multiregion BCDR article says regional host pools are in public preview. Confirm the Deployment scope field in your own portal before you commit a design to it, and see the article named above for the current state of the feature.

## The four categories of data

Learn's data locations article sorts what the service stores into four categories. The scope setting affects the first two directly.

| Category | What it is | Geographical scope | Regional scope |
|---|---|---|---|
| Customer input data | What you enter when creating host pools and other service objects, such as host pool and application group names | Geography associated with the region where the resource is created | Within the Azure region where the resource is created, not across the geography |
| Customer data | Data that is part of resource deployment, such as application names, VM names and user principal names | Same as above | Same as above |
| Diagnostic data | Troubleshooting, support and aggregate health. Examples: VM name and pool membership on registration, user principal name, client location, client IP address and target host pool at session launch | Registration data in the geography of the host pool's region | The page states no regional variant |
| Service-generated data | Traffic patterns and usage aggregated to check control plane health | Aggregated from all locations and sent to the US geography. The data sent to the US includes scrubbed data, and customer data is not aggregated | Same |

Two details matter for a residency review. First, session diagnostic data is sent to two places: the location closest to the user, where client traces, user traces and diagnostic data are present, and the location where the host pool is located. Diagnostic records can therefore sit in two locations for one session. Second, the Azure Resource Manager paths to service objects are treated as organizational information. Learn says data residency does not apply to them and that this data is stored outside the chosen geography.

## What the service does not hold

Learn states that Azure Virtual Desktop does not directly store user data or application data, such as Word documents, databases or configuration files. It stores what is part of resource deployment, such as application names, VM names and user principal names. User-created or app-related information, such as app settings and user data, resides in the Azure region you choose and is not managed by the service. Learn also says Microsoft does not control or limit the regions where you or your users can access that data. The multiregion article makes the same separation from the VM side: data locations are independent of session host VM locations, so you can place metadata in one supported region and deploy VMs in another.

In practice the residency of the data users care most about is decided by choices outside the scope setting:

- The region of the session host VMs. Metadata location is independent of where they run.
- The storage account for [FSLogix profile containers](/entity/fslogix-profile-container/), commonly [Azure Files](/entity/azure-files/).
- Where users keep documents, for example [OneDrive](/entity/onedrive/).
- Log Analytics and diagnostic settings that you configure yourself. The Regional Host Pools article also states that errors and checkpoints are not being reported into Log Analytics for regional session hosts.

## Resilience: what changes

Learn describes the resilience of the metadata store per scope:

- **Geographical:** stored information is encrypted at rest and geo-redundant mirrors are kept within the geography. Data generated by the service is replicated within the geography for disaster recovery.
- **Regional:** stored information is encrypted at rest, with replicas maintained across availability zones within the region. Metadata is replicated to a paired region, where applicable, for disaster recovery.

The paired-region copy deserves a question to your compliance team. The Data locations page says the replica goes to a paired region where applicable. It does not say which region that is or whether the copy stays inside your geography. Microsoft's multiregion article describes the benefit as host pool metadata remaining in the region you select, which sits alongside this replication statement. If your policy restricts replication targets, check the region pair for your chosen region before you rely on regional scope.

The failure behaviour comes from two articles. The multiregion BCDR article says that a problem in the region hosting the geographical database affects host pools across all regions in that geography, while with regional host pools a problem in one region affects only host pools in that region. The service architecture article says that during a database failover, new connections fail briefly while existing connections are unaffected, and that this applies to both the geographical and the regional database. If a gateway instance fails, RDP connections relayed through it drop, and users reconnect to the remaining instances and resume their sessions. The page says new connections can still be made when a region fails, because Azure Traffic Manager directs web service traffic and Azure Front Door directs gateway traffic to the next closest available instance. It does not state what happens to existing sessions in a full region outage, so do not assume anything beyond the text.

Everything below the service components stays your job. Learn lists session hosts, including operating system image customizations and applications, virtual network connectivity, the resiliency, backup and recovery of those session hosts, and user identities and access control as customer-managed. The disaster recovery overview adds that Azure Virtual Desktop has no native features for managing disaster recovery scenarios and points to availability zones, Azure Site Recovery and Azure Files data redundancy options for that layer.

## Example: one pooled host pool in East US 2

Suppose a team wants the host pool metadata for a pooled host pool kept in East US 2, a region that the Tech Community post and the Data locations article both list. They create the host pool, workspace and application group with Regional scope in East US 2, deploy the session hosts in East US 2, which the post recommends doing in the same region as the regional metadata, and put the profile share in an Azure Files account in the same region. Customer input data and customer data for those objects are then stored within East US 2. The remaining items on the review list still apply: the Azure Resource Manager paths sit outside the chosen geography, session diagnostic data also goes to the location closest to each user, service-generated data that includes scrubbed data goes to the US geography, and the metadata replica goes to a paired region where applicable. The profile share and the session hosts are in East US 2 only because the team placed them there.

## A short review procedure

1. **List the requirement in plain terms.** Is it about where names and user principal names are stored, where user documents are stored, or both? The scope setting addresses the first.
2. **Check region support.** The Data locations article, which is the current list, and the Tech Community post from 30 September 2026 both name East US 2, Central US, Australia East, Canada Central, Canada East, Central India, East Asia, Japan East, Japan West, Korea Central, North Europe, South Africa North, Southeast Asia and West Europe. Germany West Central is not on either list; a comment under the post says the team is working on it and calls it coming soon, which is not a commitment to a date. On the portal field, the Data locations article says that in a region without regional support the deployment scope is selected as geographical automatically, and the Regional Host Pools article says the only available scope is selected automatically. The Tech Community post adds that the field is visible when creating a host pool in any Azure Virtual Desktop location, that you must choose explicitly where both scopes exist, and that PowerShell calls with regional scope in an unsupported region return "Not Supported". Verify your region in the portal.
3. **Map the exceptions.** Note Azure Resource Manager paths, the second location for session diagnostic data and the scrubbed data sent to the US.
4. **Place the data you control.** Choose regions for session hosts, profile storage and Log Analytics to match the same requirement.
5. **Check the paired-region replica** for your region if replication targets are restricted.
6. **Create objects with matching scope.** Learn says scope also applies to workspaces, application groups and App Attach packages, that regional and geographical objects cannot be mixed, and that the scope cannot be changed after creation. The Tech Community post says support for migrating existing geographical host pools to regional is coming in a phased rollout, that existing host pools keep their current scope, and that creating new geographical host pools is planned to be deprecated, with no timeline given. The Regional Host Pools article strongly recommends creating all new host pools as regional host pools in the regions you require, labels regional as recommended and geographical as not recommended in the portal drop-down, and says Azure Virtual Desktop is working toward transitioning existing geographical host pool metadata. The multiregion article says Microsoft provides migration tooling and does not describe it.
7. **Record the decision.** Write down the status label and the page you relied on, because the Microsoft pages currently differ.

## What it does not solve

Regional scope reduces the blast radius for the metadata. It is not a disaster recovery design, and a host pool in one region with profiles in another still has two failure domains. For design choices on that layer, see the articles on multi-region deployments and disaster recovery in this series. For the object model, see [AVD host pool](/entity/avd-host-pool/) and [regional host pools](/entity/avd-regional-host-pools/).

## Sources

All retrieved on 17 November 2026.

- [Microsoft Tech Community: Now generally available: regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Data locations for Azure Virtual Desktop (list of regions with regional scope)](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Regional Host Pools - Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: Multiregion BCDR for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: Disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/disaster-recovery)
