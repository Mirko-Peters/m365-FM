---
title: "Designing workspaces for multiple teams and regions"
summary: "In Azure Virtual Desktop a workspace is the grouping that makes application groups visible to users, so the number of workspaces decides what each team sees. This article sets out the rules that constrain the design and three layouts for several teams and regions."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-workspace, azure-virtual-desktop]
keypoints:
  - "An application group can be assigned to only one workspace, and users see desktops and apps only through the workspaces their application groups are registered to."
  - "A user can be assigned to application groups across several host pools, so one workspace can combine resources from different pools and regions."
  - "Workspace and application group must share a deployment scope. A regional workspace holds only regional application groups, and the scope cannot be changed afterwards. Regional host pools have been generally available since 30 September 2026, and the announcement now lists 14 regions."
  - "Service limits to design around: 1,300 workspaces per Microsoft Entra tenant, 400 host pools per workspace, 1,000 application groups per tenant and 200 role assignments per Azure Virtual Desktop object."
  - "Azure RBAC has separate roles for workspaces and application groups, which lets one team manage its own workspace without owning host pools. In an active-active multi-region design Microsoft advises separate, clearly named workspaces."
faq:
  - q: "How many workspaces should I create?"
    a: "Microsoft Learn gives no recommended number. The hard limits are 1,300 workspaces per Microsoft Entra tenant, 400 host pools per workspace and 1,000 application groups per tenant (more application groups by support ticket). The design rules that usually decide the number sooner: each application group belongs to one workspace, scope must match, and users see only the workspaces of their assigned application groups."
  - q: "Can an application group be in two workspaces?"
    a: "No. Microsoft Learn says an application group can only be assigned to a single workspace. To show the same host pool resources in two workspaces you need two application groups, subject to the pool rules for desktop groups."
  - q: "Does the workspace decide where a user's session runs?"
    a: "No. The workspace location is where its metadata is stored, in the geography of that region with Geographical scope or in the region itself with Regional scope. Learn says session hosts can run in any Azure region, and the multiregion BCDR article says metadata location is independent of session host location."
---

A workspace is a logical grouping of application groups, and users see a desktop or application only if the application group that publishes it is registered to a workspace. The number and layout of workspaces is therefore the way you decide what each team sees in its feed, and it interacts with host pool regions and with deployment scope.

This article covers the design rules, three layouts for several teams and regions, and the portal steps. The object model itself is explained in the companion article on how users find their desktops and apps. Sources were retrieved on 17 November 2026.

## The rules that shape the design

Microsoft Learn's terminology article defines the objects and their relationships:

- A **host pool** is a collection of Azure VMs registered as session hosts. You control what is published through application groups.
- An **application group** controls access to a full desktop or a logical grouping of applications on session hosts in a single host pool.
- A **workspace** is a logical grouping of application groups. Each application group must be associated with a workspace for users to see the desktops and applications published to them.
- An application group can only be assigned to a single workspace.
- Users can be assigned to multiple application groups across multiple host pools.

On a pooled host pool you can assign both group types, but only one desktop application group, with any number of RemoteApp groups. If a user has both on the same host pool, the host pool's preferred application group type decides what the user sees. See [workspaces](/entity/avd-workspace/) and [application groups](/entity/avd-application-group/).

The deployment scope adds a third rule. Learn's article on creating workspaces says the scope is set at creation and cannot be changed, a regional host pool can join only a regional workspace, and application groups inherit the scope of their host pool. A workspace can hold only application groups with the same scope, so match it to the host pools you publish. The portal greys out incompatible objects, and PowerShell or REST requests that mix scopes fail. See [regional host pools](/entity/avd-regional-host-pools/).

Regional host pools have been generally available since 30 September 2026, according to the Tech Community announcement and the September 2026 entry of What's new. The announcement, last updated on 13 November 2026, lists 14 regions: East US 2, Central US, Australia East, Canada Central, Canada East, Central India, East Asia, Japan East, Japan West, Korea Central, North Europe, South Africa North, Southeast Asia and West Europe. The Regional Host Pools article on Learn still carries preview wording and names only East US 2 and Central US, so it is behind the announcement. Two consequences for layouts: **Deployment scope** only appears when the region you select for Location supports regional scope, and a workspace created in a region without support is geographical, so it cannot take regional application groups. Pick the workspace region from the supported list if you publish regional host pools.

## Three layouts

| Layout | Workspace per | Fits when | Watch for |
|---|---|---|---|
| By team | Department or business unit | Teams have separate apps and administrators | Users in two teams see two workspaces |
| By region | Azure region or user location | Regional host pools, regional data requirements | Same app in several workspaces needs several application groups; the region must support regional scope |
| By purpose | Environment, such as production and pilot | Validation or phased rollouts | Needs clear names so pilot and production entries are not confused |

The sources do not prescribe a layout, so treat the table as a way to apply the rules rather than as Microsoft guidance.

**By team.** Each team gets a workspace and the application groups for its pools. The feed shows each user the resources of the groups they are assigned to, and because one user can be assigned to groups across pools, a person who works for two teams can reach both. Assign user groups rather than individual users, which Learn recommends for easier management.

**By region.** Create a workspace in each region that has host pools, using the same deployment scope as those pools. For regional scope, that region must be one of the supported regions. Microsoft's multiregion article advises that in an active-active design, with a live secondary host pool, users see duplicate feed entries, so use separate, clearly named workspaces and tell users which to open. In an active-passive design the secondary application groups are not assigned to users until failover, and the article says users see one transparent workspace.

**By purpose.** A pilot host pool and a production pool can sit in different workspaces so pilot users see the pilot entries. This is a use of the rules above, not a documented pattern, and the scope rule still applies.

## Example: two teams in two regions

Take a finance team and an engineering team, each with a pooled host pool in East US 2 and in Central US, all with regional scope. Both regions are on the supported list; in a region that is not, the same layout would have to use geographical scope throughout. Per team and region you need one desktop application group on the host pool, so four desktop groups. If you choose the by-team layout, you create two workspaces, one per team, and register both regional groups of a team to its workspace. A finance user who is assigned to both regional groups then sees two desktop entries and has to tell them apart by name, which resembles the duplicate-feed situation the multiregion article describes. Assigning each user to one region's group avoids it. If you choose the by-region layout instead, you create two workspaces, one per region, each holding the groups of both teams, and assign each user only to the groups of the region they should use.

## Naming and what users see

When you create a workspace in the portal you set a name and, optionally, a **Friendly name** that is a display name for users, and a description. Use the friendly name to make the feed readable, for example a team or region name. Learn's feed customization page describes display names for desktops and RemoteApps: you edit them on the application group and users see the new name once their client refreshes.

## Delegation

Azure RBAC gives you built-in Desktop Virtualization roles at each level. The relevant ones for workspace design, under their full names in the role list (the short forms are used below after that):

- **Desktop Virtualization Workspace Contributor** manages all aspects of workspaces. **Desktop Virtualization Workspace Reader** views them.
- **Desktop Virtualization Application Group Contributor** manages all aspects of an application group except user or group assignment. **Desktop Virtualization Application Group Reader** views an application group without allowing changes.
- **Desktop Virtualization Host Pool Contributor** manages all aspects of a host pool.
- **Desktop Virtualization Contributor** manages all Azure Virtual Desktop resources except user or group assignment.
- Assigning users or groups needs User Access Administrator in addition.
- A Workspace Contributor needs Application Group Reader to see the applications of a related application group.
- For portal deployments of host pools with new VMs, Learn says the Host Pool Contributor also needs Virtual Machine Contributor to create the VMs, plus Application Group Contributor and Workspace Contributor, or you can use Desktop Virtualization Contributor instead.

A team can then own its workspace and application groups while a platform team owns the host pools. The service limits allow 200 role assignments per Azure Virtual Desktop object, so assign roles to groups rather than to individuals, or a delegation model with many people per workspace will run into that ceiling. For user session roles, Learn advises assigning them to specific host pools, because at resource group scope the role grants read access to all host pools in that group.

## Steps to create a workspace and register application groups

1. In the Azure portal, open **Azure Virtual Desktop**, select **Workspaces**, then **Create**.
2. On **Basics**, choose subscription and resource group, enter a workspace name, an optional friendly name and description, and the **Location**.
3. If the region supports it, set **Deployment Scope** to match the host pools you will publish.
4. On **Application groups**, set **Register application groups** to **Yes**, select **+ Register application groups**, choose the groups and select **Select**.
5. On **Advanced**, optionally enable diagnostic settings with a Log Analytics workspace, storage account or event hub as destination.
6. Select **Review + create**, then **Create**.

To add a group later, open the workspace, select **Application groups**, then **+ Add**. Only groups not already assigned to a workspace are listed. A group needs a workspace and user assignments before users can access it, and a RemoteApp group also needs published applications.

## Checks before you roll it out

- List every host pool with its deployment scope. The host pool list in the portal has a Deployment scope column.
- Confirm that no application group needs to appear in two workspaces. If it does, create a second group instead.
- Count what each user will see after assignment, including preferred application group type effects.
- Test with a pilot group and a refreshed client before assigning large groups.

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

For more than 1,000 application groups Microsoft asks you to raise a support ticket in the Azure portal. The table has no limit for application groups per workspace. The numbers rarely bind a layout of a few teams; the 1,000 application groups per tenant and the 200 role assignments are the ones a large delegation model reaches first.

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Create a workspace and an application group (create-application-group-workspace page)](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Customize the feed for Azure Virtual Desktop users](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-feed-for-virtual-desktop-users)
- [Microsoft Learn: Multiregion BCDR for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Tech Community: Now generally available: Regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
- [Microsoft Learn: Azure subscription and service limits, quotas, and constraints](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Microsoft Learn: Regional Host Pools - Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
