---
title: "Designing workspaces for multiple teams and regions"
summary: "In Azure Virtual Desktop a workspace makes application groups visible to users, and Learn requires a workspace to be in the same location as the application groups it holds. This article sets out the rules that constrain the design and three layouts for several teams and regions."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-workspace, azure-virtual-desktop]
keypoints:
  - "An application group can be assigned to only one workspace, and users see desktops and apps only through the workspaces their application groups are registered to."
  - "A user can be assigned to application groups across several host pools, but Learn's FAQ requires a workspace to be in the same location as its application groups. Learn does not define \"location\" further; read as the Azure region of the host pool, it means one workspace per region, which Learn's multiregion article does not spell out for active-passive designs."
  - "Workspace and application group must also share a deployment scope. A regional workspace holds only regional application groups, and the scope cannot be changed afterwards. Regional host pools have been generally available since 30 September 2026."
  - "Service limits to design around: 1,300 workspaces per Microsoft Entra tenant, 400 host pools per workspace, 1,000 application groups per tenant and 200 role assignments per Azure Virtual Desktop object."
  - "Azure RBAC has separate roles for workspaces and application groups, and letting a team manage a workspace without owning host pools is a design inference from the role list. In an active-active multi-region design Microsoft advises separate, clearly named workspaces."
faq:
  - q: "How many workspaces should I create?"
    a: "The Azure service limits page sets only maximums, not a recommended number: 1,300 workspaces per Microsoft Entra tenant, 400 host pools per workspace and 1,000 application groups per tenant (more application groups by support ticket). The design rules decide the number sooner: each application group belongs to one workspace, a workspace must be in the same location as its application groups, scope must match, and users see only the workspaces of their assigned application groups. If \"location\" is read as the Azure region, you need at least one workspace per region, and a by-team layout multiplies that by the number of teams."
  - q: "Can an application group be in two workspaces?"
    a: "No. Microsoft Learn says an application group can only be assigned to a single workspace. A pooled host pool takes only one desktop application group but several RemoteApp groups, so showing the same applications in two workspaces means a second RemoteApp group, and for a desktop it would mean a second host pool. That follows from the terminology article and is not a pattern Learn documents."
  - q: "Does the workspace decide where a user's session runs?"
    a: "No. The workspace location and deployment scope decide where its service metadata is stored: in the geography of the region with Geographical scope, in the region itself with Regional scope. Learn says session hosts can run in any Azure region, and the multiregion BCDR article says metadata location is independent of session host location."
---

A workspace is a logical grouping of application groups, and users see a desktop or application only if the application group that publishes it is registered to a workspace. The number and layout of workspaces is therefore how you decide what each team sees in its feed. One rule limits it: Learn requires a workspace to be in the same location as its application groups.

The object model and portal steps are in "The Azure Virtual Desktop workspace: how users find their desktops and apps", and the wider multi-region choices are in "Designing a multi-region Azure Virtual Desktop deployment". This article covers the rules that constrain the layout, three layouts, a worked example, delegation and limits.

## The rules that shape the design

Microsoft Learn's terminology article gives the relationships:

- An **application group** controls access to a full desktop or a logical grouping of applications on session hosts in a single host pool.
- A **workspace** is a logical grouping of application groups, and an application group can only be assigned to a single workspace.
- Users can be assigned to several application groups across host pools.

On a pooled host pool you can assign one desktop application group and multiple RemoteApp groups. If a user has both types on the same pool, the host pool's preferred application group type decides what the user sees. See [workspaces](/entity/avd-workspace/) and [application groups](/entity/avd-application-group/).

**Location.** Learn's FAQ ("What are location restrictions?") says every service resource has a location, that the application group's location should be the same as the host pool's, and that workspaces must be in the same location as their application groups. It adds that the service requires all workspaces to be associated with application groups created in the same location. The deployment article adds that an application group takes its host pool's location, while a workspace has its own **Location** field. The FAQ does not define "location" further; the same section says a host pool's location determines the geography in which its service metadata is stored. This article reads it as the Azure region of the host pool, as the workspace's **Location** field suggests. On that reading a workspace publishes application groups from several host pools, but only pools in one region, so host pools in two regions need at least two workspaces however you divide teams. Learn's multiregion article is not consistent with this reading for active-passive designs (see "By region"), so treat the reading as a planning assumption. The rule concerns where the service objects live, not where the VMs run: Learn says the gateway service lets session hosts be in any region.

**Deployment scope.** Learn's deployment article says the scope is set at creation and cannot be changed, a regional host pool can join only a regional workspace, and application groups inherit the scope of their host pool. A workspace can hold only application groups with the same scope. The portal greys out incompatible objects, and PowerShell or REST requests that mix scopes fail. Visibility differs by source: Learn's deployment article says the **Deployment scope** field only appears where the Location supports regional workspaces; the Tech Community announcement says it is visible in any location. Check your portal. See [regional host pools](/entity/avd-regional-host-pools/).

Regional host pools have been generally available since 30 September 2026, per the Tech Community announcement, which lists 14 regions; What's new confirms it. Learn's data locations article lists the same 14 regions, and the Regional Host Pools article refers to that list and says availability is expanding in phases, so check it before choosing a scope. On that reading, a workspace for regional host pools sits in the same supported region as those pools.

## Three layouts

| Layout | Workspace per | Fits when | Watch for |
|---|---|---|---|
| By team | Department and location | Teams have separate apps and administrators | Teams times locations workspaces; users in two teams or two locations see several workspaces |
| By region | Azure region (location) | Regional host pools, regional data requirements | The same app in two workspaces needs a second RemoteApp group; a desktop group needs a second host pool |
| By purpose | Environment and location, such as production and pilot | Validation or phased rollouts | Needs clear names so pilot and production entries are not confused |

The table applies the rules above; it is not Microsoft guidance. If the location rule is read as one region per workspace, a layout with more than one region includes the region in the workspace key, and "by team" alone works only while all host pools are in one region.

**By team.** Each team gets a workspace for each location in which it has host pools, holding that team's application groups for those pools. Assign user groups rather than individual users, which Learn recommends for easier management.

**By region.** Create a workspace in each location that has host pools, with the same deployment scope as those pools. In Microsoft's multiregion article, an active-active design, with a live secondary host pool, gives users duplicate feed entries, so it advises separate workspaces with clear names and labels. In an active-passive design the secondary application groups are not assigned to users until failover, and the multiregion article says users keep the same workspace and the transition remains transparent. That article does not say in which region the workspace sits and does not mention the location rule, so the two statements are not reconciled on Learn. Clarify this with Microsoft or test it in a tenant before building an active-passive pair on a single workspace.

**By purpose.** A pilot host pool and a production pool can sit in different workspaces so pilot users see the pilot entries. This is not a documented pattern, and the location and scope rules still apply.

## Example: two teams in two regions

Take a finance team and an engineering team, each with a pooled host pool in East US 2 and in Central US, all with regional scope. Both regions are marked as supporting regional scope in Learn's data locations article. A pool in a region without regional support is geographical, and its application groups can only join a geographical workspace, so the workspace for that region would use geographical scope. Each pool has one desktop application group, so there are four desktop groups, two per location.

With the **by-region** layout you create two workspaces. The East US 2 workspace holds the finance and engineering groups for that region, and the Central US workspace holds the other two. A user assigned to the groups of one region sees one workspace.

With the **by-team** layout, and the region reading of the location rule, a workspace cannot hold both regional groups of a team. You need four workspaces: finance in East US 2, finance in Central US, engineering in East US 2 and engineering in Central US. If a finance user is assigned to both finance groups, two workspaces show up in that user's feed, and the user has to tell them apart by name. That is the situation the multiregion article describes for active-active designs, and clear names, for example "Finance East US 2" in the workspace name or friendly name, keep it readable. Assigning each user only to the group for their home region keeps the feed to one workspace per user; that is a design choice.

For a handful of teams, by-region keeps the object count lowest; by-team suits separately administered teams, and every region you add multiplies the workspaces.

## Naming and what users see

When you create a workspace in the portal you set a name, an optional **Friendly name**, which Learn describes as a display name for the workspace, an optional description and the **Location**. Putting a team and region name in these fields is a suggestion, in line with the multiregion article's advice on clear names and labels.

## Delegation

Azure RBAC has separate Desktop Virtualization roles for workspaces, application groups and host pools; the workspace roles are listed in the companion article. For layout design, three points matter:

- **Desktop Virtualization Workspace Contributor** manages all aspects of workspaces. It needs **Desktop Virtualization Application Group Reader** to see applications in a related application group. 
- **Desktop Virtualization Application Group Contributor** manages an application group apart from user or group assignment, which also needs User Access Administrator. Learn's FAQ says any application group action also needs related data access on the host pool, and the permission lists of the Application Group Contributor and Reader roles include reading host pools. A team that manages application groups needs related data access on the host pools.
- For portal deployments of host pools with new VMs, Learn says the Host Pool Contributor also needs Virtual Machine Contributor, plus Application Group Contributor and Workspace Contributor, or you can use Desktop Virtualization Contributor instead.

Splitting duties so that a team owns its workspace while a platform team owns the host pools is a design inference from these roles, not a pattern Learn documents. With 200 role assignments allowed per object, assign roles to groups.

## Checks before you roll it out

- List every host pool with its location and deployment scope. The host pool list in the portal has a Deployment scope column.
- Count the regions. Under the region reading of the location rule each needs its own workspace, and each team-and-region pair needs one in a by-team layout.
- Confirm that no application group needs to appear in two workspaces. If one does, a RemoteApp group can be duplicated; a desktop group on a pooled host pool cannot, because only one is allowed per pool, so that case needs a second host pool.
- Check that each workspace's location matches the location of every application group registered to it, and that an active-passive pair is clarified or tested first.
- Count what each user will see after assignment, including the number of workspaces.
- Test with a pilot group and a refreshed client before assigning large groups.

To register a group in a workspace, use the steps in the companion article: **Workspaces**, **Create**, then on the **Application groups** tab **Register application groups: Yes** and **+ Register application groups**, or **+ Add** on an existing workspace. Only groups that are not yet assigned to a workspace are listed.

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

For more than 1,000 application groups Microsoft asks you to raise a support ticket in the Azure portal. The table has no limit for application groups per workspace. In a large by-team layout the workspace count is teams times regions, and application groups and role assignments grow with it.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
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
