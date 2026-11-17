---
title: "Designing workspaces for multiple teams and regions"
summary: "In Azure Virtual Desktop a workspace makes application groups visible to users, and Learn requires a workspace and its application groups to be in the same region. This article sets out the rules that constrain the design and three layouts for several teams and regions."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-workspace, azure-virtual-desktop]
keypoints:
  - "An application group can be assigned to only one workspace, and users see desktops and apps only through the workspaces their application groups are registered to."
  - "A workspace and its application groups must be in the same region (Learn, \"Move Azure Virtual Desktop resources between regions\"; the workspace Location field is the Azure region). Host pools in two regions therefore need at least two workspaces. The multiregion BCDR article describes an active-passive design in which users keep the same workspace, but does not say how that fits the region rule."
  - "Workspace and application group must also share a deployment scope. A regional workspace holds only regional application groups, and the scope cannot be changed afterwards. Regional host pools have been generally available since 30 September 2026."
  - "Service limits to design around: 1,300 workspaces per Microsoft Entra tenant, 400 host pools per workspace, 1,000 application groups per tenant and 200 role assignments per Azure Virtual Desktop object."
  - "Azure RBAC has separate roles for workspaces and application groups, and letting a team manage a workspace without owning host pools is a design inference from the role list. In an active-active multi-region design Microsoft advises separate, clearly named workspaces."
faq:
  - q: "How many workspaces should I create?"
    a: "The Azure service limits page sets only maximums, not a recommended number: 1,300 workspaces per Microsoft Entra tenant, 400 host pools per workspace and 1,000 application groups per tenant (more application groups by support ticket). The design rules decide the number sooner: each application group belongs to one workspace, a workspace must be in the same region as its application groups, scope must match, and users see only the workspaces of their assigned application groups. You need at least one workspace per region with host pools, and a by-team layout multiplies that by the number of teams."
  - q: "Can an application group be in two workspaces?"
    a: "No. Microsoft Learn says an application group can only be assigned to a single workspace. A pooled host pool takes only one desktop application group but several RemoteApp groups, so showing the same applications in two workspaces means a second RemoteApp group, and for a desktop it would mean a second host pool. That follows from the terminology article and is not a pattern Learn documents."
  - q: "Does the workspace decide where a user's session runs?"
    a: "No. The workspace location and deployment scope decide where its service metadata is stored: in the geography of the region with Geographical scope, in the region itself with Regional scope. Learn says session hosts can run in any Azure region, and the multiregion BCDR article says metadata location is independent of session host location."
---

A workspace is a logical grouping of application groups, and users see a desktop or application only if the application group that publishes it is registered to a workspace. The number and layout of workspaces is therefore how you decide what each team sees in its feed. One rule limits it: a workspace and its application groups need to be in the same region.

The object model and portal steps are in "The Azure Virtual Desktop workspace: how users find their desktops and apps", and the wider multi-region choices are in "Designing a multi-region Azure Virtual Desktop deployment". This article covers the rules that constrain the layout, three layouts, a worked example, delegation and limits.

## The rules that shape the design

Microsoft Learn's terminology article gives the relationships:

- An **application group** controls access to a full desktop or a logical grouping of applications on session hosts in a single host pool.
- A **workspace** is a logical grouping of application groups, and an application group can only be assigned to a single workspace.
- Users can be assigned to several application groups across host pools.

On a pooled host pool you can assign one desktop application group and multiple RemoteApp groups. If a user has both types on the same pool, the host pool's preferred application group type decides what the user sees. See [workspaces](/entity/avd-workspace/) and [application groups](/entity/avd-application-group/).

**Region.** Two Learn pages state the rule. "Move Azure Virtual Desktop resources between regions" says a host pool and its associated application groups need to be in the same region, and that workspaces and their associated application groups also need to be in the same region. The FAQ entry "What are location restrictions?" says the same in terms of location: workspaces must be in the same location as their application groups, and the service requires all workspaces to be associated with application groups created in the same location. It also says a host pool's location determines the geography in which its service metadata is stored. "Deploy Azure Virtual Desktop" defines the terms: the workspace **Location** field is the Azure region where you deploy the workspace, and an application group's metadata is stored in the same location as its host pool.

It follows that a workspace publishes application groups from several host pools, but only pools in its own region, so host pools in two regions need at least two workspaces however you divide teams. The rule concerns where the service objects live, not where the VMs run: Learn says the gateway service lets session hosts be in any region.

One point is open. The multiregion BCDR article says that in an active-passive design users keep the same workspace after failover, that the transition stays transparent, and that you create the secondary host pool "in either the same workspace or a different workspace, depending on the model". It does not say in which region that workspace sits or how this fits the region rule, so the two statements are not reconciled on Learn (see "By region").

**Deployment scope.** Learn's deployment article says the scope is set at creation and cannot be changed, a regional host pool can join only a regional workspace, and application groups inherit the scope of their host pool. A workspace can hold only application groups with the same scope. The portal greys out incompatible objects, and PowerShell or REST requests that mix scopes fail. Visibility differs by source: the deployment article says the **Deployment scope** field only appears where the Location supports regional workspaces; the Tech Community announcement says it is visible in any location. Check your portal. See [regional host pools](/entity/avd-regional-host-pools/).

Regional host pools have been generally available since 30 September 2026, per the Tech Community announcement, and What's new confirms it. The Data locations article lists the 14 supported regions and the Regional Host Pools article says availability is expanding in phases, so check that list before choosing a scope. Your regional workspace sits in the same supported region as its regional host pools.

## Three layouts

| Layout | Workspace per | Fits when | Watch for |
|---|---|---|---|
| By team | Department and region | Teams have separate apps and administrators | Teams times regions workspaces; users in two teams or two regions see several workspaces |
| By region | Azure region | Regional host pools, regional data requirements | The same app in two workspaces needs a second RemoteApp group; a desktop group needs a second host pool |
| By purpose | Environment and region, such as production and pilot | Validation or phased rollouts | Needs clear names so pilot and production entries are not confused |

The table applies the rules above; the layouts themselves are not Microsoft guidance. Because of the region rule, any layout with more than one region includes the region in the workspace key, and "by team" alone works only while all host pools are in one region.

**By team.** Each team gets a workspace for each region in which it has host pools, holding that team's application groups for those pools. Assign user groups rather than individual users, which Learn recommends for easier management.

**By region.** Create a workspace in each region that has host pools, with the same deployment scope as those pools. In Microsoft's multiregion article, an active-active design, with a live secondary host pool, gives users duplicate feed entries, so it advises separate workspaces with clear names and labels. In an active-passive design the secondary application groups are not assigned to users until failover, and the article says users keep the same workspace. The same article says to create the secondary host pool in the same or a different workspace depending on the model, and lists the active-passive experience as a single workspace. Our reading: if the secondary host pool and its application groups are in another region than the primary ones, a single workspace would appear to conflict with the region rule as the FAQ words it. The article does not address that, so test an active-passive pair on one workspace in a tenant, or ask Microsoft, before you build it.

**By purpose.** A pilot host pool and a production pool can sit in different workspaces so pilot users see the pilot entries. This is not a documented pattern, and the region and scope rules still apply.

## Example: two teams in two regions

Take a finance team and an engineering team, each with a pooled host pool in East US 2 and in Central US, all with regional scope. Both regions are marked as supporting regional scope in Learn's data locations article. A pool in a region without regional support is geographical, and its application groups can only join a geographical workspace. Each pool has one desktop application group, so there are four desktop groups, two per region.

With the **by-region** layout you create two workspaces. The East US 2 workspace holds the finance and engineering groups for that region, and the Central US workspace holds the other two. A user assigned to the groups of one region sees one workspace.

With the **by-team** layout a workspace cannot hold both regional groups of a team, so you need four workspaces: finance in East US 2, finance in Central US, engineering in East US 2 and engineering in Central US. If a finance user is assigned to both finance groups, two workspaces show up in that user's feed and the user has to tell them apart by name. Clear names, for example "Finance East US 2" in the workspace name or friendly name, keep it readable, in line with the multiregion article's advice on clear names and labels. Assigning each user only to the group for their home region keeps the feed to one workspace per user; that is a design choice.

## Delegation

Azure RBAC has separate Desktop Virtualization roles for workspaces, application groups and host pools. For layout design, three points matter:

- **Desktop Virtualization Workspace Contributor** manages all aspects of workspaces. It needs **Desktop Virtualization Application Group Reader** to see applications in a related application group.
- **Desktop Virtualization Application Group Contributor** manages an application group apart from user or group assignment, which also needs User Access Administrator. Learn's FAQ says any application group action also needs related data access on the host pool, and the permission lists of the Application Group Contributor and Reader roles include reading host pools. A team that manages application groups needs related data access on the host pools.
- For portal deployments of host pools with new VMs, Learn says the Host Pool Contributor also needs Virtual Machine Contributor, plus Application Group Contributor and Workspace Contributor, or you can use Desktop Virtualization Contributor instead.

Splitting duties so that a team owns its workspace while a platform team owns the host pools is a design inference from these roles, not a pattern Learn documents. With 200 role assignments allowed per object, assign roles to groups.

## Checks before you roll it out

- List every host pool with its region and deployment scope. The host pool list in the portal has a Deployment scope column.
- Count the regions. Each needs its own workspace, and each team-and-region pair needs one in a by-team layout.
- Confirm that no application group needs to appear in two workspaces. If one does, a RemoteApp group can be duplicated; a desktop group on a pooled host pool cannot, because only one is allowed per pool, so that case needs a second host pool.
- Check that each workspace's region matches the region of every application group registered to it, and test an active-passive pair on a single workspace before relying on it.
- Count the workspaces each user will see after assignment, and test with a pilot group and a refreshed client before assigning large groups.

To register a group in a workspace, use the steps in the companion article: **Workspaces**, **Create**, then on the **Application groups** tab **Register application groups: Yes** and **+ Register application groups**, or **+ Add** on an existing workspace. On the **+ Add** path, only application groups that are not yet assigned to a workspace are listed.

## Service limits to design around

The Azure subscription and service limits page lists these maximums for Azure Virtual Desktop:

| Object | Per | Limit |
|---|---|---|
| Workspace | Microsoft Entra tenant | 1,300 |
| Host pool | Workspace | 400 |
| Application group | Microsoft Entra tenant | 1,000 |
| RemoteApp | Application group | 500 |
| Role assignment | Any Azure Virtual Desktop object | 200 |
| Session host | Host pool | 10,000 |

For more than 1,000 application groups Microsoft asks you to raise a support ticket in the Azure portal. The table has no limit for application groups per workspace. In a by-team layout the workspace count is teams times regions.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Move Azure Virtual Desktop resources between regions](https://learn.microsoft.com/en-us/azure/virtual-desktop/move-resources)
- [Microsoft Learn: Azure Virtual Desktop FAQ (What are location restrictions?)](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Deploy Azure Virtual Desktop (host pools, workspaces and application groups)](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Multiregion BCDR for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Data locations for Azure Virtual Desktop (list of regions)](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Tech Community: Now generally available: Regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
- [Microsoft Learn: Azure subscription and service limits, quotas, and constraints](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Microsoft Learn: Regional Host Pools - Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
