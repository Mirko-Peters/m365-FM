---
title: "The Azure Virtual Desktop workspace: how users find their desktops and apps"
summary: "A workspace is the logical grouping of application groups that forms the list of desktops and apps a user sees in the client. A resource appears for a user only when they are assigned to its application group and that group is registered with a workspace."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-workspace, azure-virtual-desktop]
keypoints:
  - "A workspace is a logical grouping of application groups. An application group must be associated with a workspace for users to see its desktops and apps, and it can belong to only one."
  - "A user sees a resource when two links exist: the user is assigned to the application group, and the group is registered with a workspace."
  - "A workspace and its application groups must share a location and a deployment scope, regional or geographical, and the scope cannot be changed after creation."
  - "Users reach the workspace by signing in to Windows App, or by subscribing in the older Remote Desktop client with an email address or a feed URL. Learn says the content then refreshes regularly and at client start."
  - "Workspace management has its own built-in roles. Workspace Contributor manages workspaces, and seeing the applications of a related group also needs Application Group Reader."
faq:
  - q: "Why does a user not see a desktop that I published?"
    a: "Check the two links first: the user, or one of their groups, must be assigned to the application group, and the application group must be registered with a workspace. Then check that the client has refreshed and that the host pool's preferred application group type is not hiding the resource."
  - q: "Can an application group be in more than one workspace?"
    a: "No. Microsoft Learn says an application group can only be assigned to a single workspace. One workspace can hold several application groups."
  - q: "Does a workspace store anything about users?"
    a: "Not user documents. Learn's data locations article says the service stores customer input data such as object names, and customer data such as application and VM names and user principal names, in the geography or region of the resource. It does not directly store user-created documents, databases or configuration files."
---

A workspace is the object that turns application groups into a list a user can open. If a user is assigned to an application group and that group is registered with a workspace, the group's desktops and apps appear in the client. If either link is missing, nothing appears.

This article explains that chain, what a workspace contains, how users get to it, and what to check when a resource is missing. Layouts for several teams and regions are in the sibling article "Designing workspaces for multiple teams and regions".

## The chain from user to resource

Microsoft Learn's [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) defines the objects:

- A **host pool** is a collection of Azure VMs registered as session hosts.
- An **application group** controls access to a full desktop or a logical grouping of applications on session hosts in a single host pool.
- A **workspace** is a logical grouping of application groups. Each application group must be associated with a workspace for users to see the desktops and applications published to them. An application group can only be assigned to a single workspace.

So the path for one user is: user, then assignment to an application group, then the group's registration with a workspace, then the host pool's session hosts. Read together, these definitions mean that a workspace holds no VMs and no users itself: it references application groups, and users reach those groups through their assignments. See [workspaces](/entity/avd-workspace/), [application groups](/entity/avd-application-group/) and [host pools](/entity/avd-host-pool/).

Because users can be assigned to several application groups across several host pools, one user can see resources from several pools in one list, and several workspaces can show up for the same user if their groups sit in different workspaces. This follows from the definitions above rather than from a separate Learn statement.

## Creating a workspace and registering groups

Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) describes these portal choices for a workspace:

- **Deployment scope**: **Regional** or **Geographical**. Learn says the option appears only when the selected location supports regional workspaces; the Tech Community announcement says the field is now visible in every location, with only the supported scope selectable where Regional is not yet available. A workspace can only have application groups of the same scope registered to it, so create it with the same scope as the host pools whose groups it will publish.
- **Application groups** tab (optional): select **Yes**, then **+ Register application groups**, pick the groups and choose **Select**.
- **Advanced** tab (optional): **Enable diagnostics settings**, with destinations a Log Analytics workspace, a storage account or an event hub.

To register a group later: **Azure Virtual Desktop**, **Workspaces**, the workspace name, **Application groups**, **+ Add**, the plus icon next to the group, **Select**. Only groups not already assigned to a workspace are listed.

Learn's FAQ adds a location rule: workspaces must be in the same location as their application groups, and when a workspace updates, the related application groups update with it. For the group-to-host-pool link, the FAQ gives the reason that data should not be transferred between multiple locations.

## Deployment scope: where the workspace metadata lives

Learn's [service architecture article](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience) explains that scope decides where the metadata of host pools, workspaces, application groups and App Attach packages is stored. Geographical is the original behavior and the default. Metadata goes to the database serving the geography of the host pool's region. Regional writes it to a database in the host pool's own region. There are no functional differences between the two, only the storage location.

The rules that matter for workspaces:

- A regional host pool can only be a member of a regional workspace and can only contain regional application groups, and the reverse for geographical.
- Application groups created in a regional host pool are automatically regional.
- Scope is set at creation and cannot be changed afterwards.

Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) adds how mixing shows up: in the Azure portal, objects with an incompatible scope are greyed out in the lists you select from, and a PowerShell or REST request that associates objects of different scopes fails.

Regional host pools have been generally available since 30 September 2026, according to the Tech Community announcement, and the September 2026 entry of What's new confirms it. The announcement, last updated on 13 November 2026, names East US 2 and Central US as the first regions and 12 more, 14 in total, and Learn's [data locations](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations) page shows the same 14 in its Regional column. The [Regional Host Pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools) page says availability is expanding in phases, so check the current list. Some Learn pages still carry preview wording, for example the multiregion architecture article, so rely on the announcement and What's new for the status. The announcement calls Regional the recommended scope for new host pools and says Microsoft plans to stop offering new Geographical host pools at a later date, without a date. For a new workspace, match the scope of the host pools it will publish. The full treatment is in "Regional host pools in Azure Virtual Desktop: where host pool metadata is stored". See [regional host pools](/entity/avd-regional-host-pools/).

## How users reach a workspace

**Windows App.** Learn's Windows App article says users sign in with their user account for Azure Virtual Desktop, and that a personal Microsoft account cannot be used. After sign-in the **Devices** and **Apps** tabs show remote resources from Azure Virtual Desktop and any other services the user has access to. A tab is hidden if the user has no resource of that type. Search and filters help find a resource, and favorites can be pinned. See [Windows App](/entity/windows-app/).

**Legacy Remote Desktop client.** An archived Learn article describes subscribing to a workspace in the Remote Desktop client for Windows. A user selects **Subscribe** and signs in with their account, and discovery finds the workspaces. If the message **No workspace is associated with this email address** appears, the admin might not have set up email discovery, or the environment is not Azure cloud. The alternative is **Subscribe with URL** with one of these addresses:

| Azure environment | Workspace URL |
|---|---|
| Azure cloud | `https://rdweb.wvd.microsoft.com` |
| Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
| Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

The same article states that, as of 27 March 2026, the Remote Desktop client for Windows (MSI) and the Remote Desktop web client are no longer supported for customers in public cloud environments, and that users should migrate to Windows App. Support for the MSI client was extended until 28 September 2026 for Azure Government, Azure operated by 21Vianet and AVD Classic. That date has passed, and the page does not say what applies afterwards. For the web client in Azure Government and Azure operated by 21Vianet, the page says no end-of-support date has been announced. The Remote Desktop app from the Microsoft Store reached end of support in September 2025. In practice, give users the Windows App instructions, and treat the URL table above as a reference for clients you still have to support.

**Refresh.** Learn says that once a user has subscribed, the content updates automatically and regularly, and each time the client starts. Resources can be added, changed or removed based on admin changes. A new display name for an app or desktop, set on the application group under **Applications**, appears after the client refreshes. For personal pools, a session host friendly name can be set only with PowerShell (`Update-AzWvdSessionHost` with `FriendlyName`), not in the portal.

## Who can manage what

Learn's [RBAC article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac) lists the roles relevant to workspaces:

| Role | What it allows |
|---|---|
| Desktop Virtualization Workspace Contributor | Managing all aspects of workspaces. To see applications in a related application group it also needs Application Group Reader. |
| Desktop Virtualization Workspace Reader | Viewing all aspects of a workspace without changes. |
| Desktop Virtualization Application Group Contributor | Managing an application group, apart from user or group assignment. |
| Desktop Virtualization User | Using an application from an application group as a non-administrative user. |

Assigning users needs `Microsoft.Authorization/roleAssignments/write`, which User Access Administrator and Owner include.

## When a resource is missing

Work through these in order:

1. Is the user, or a group they belong to, assigned to the application group? If the subscription moved from one Microsoft Entra tenant to another and old assignments are still tied to the previous tenant, Learn says the Azure portal loses track of them, and you need to reassign users to application groups.
2. Is the application group registered with a workspace, and do both share a location and a deployment scope?
3. If the user has both a desktop and a RemoteApp group on the same pooled pool, which type does the host pool prefer? Only the preferred type is shown.
4. For a RemoteApp, is a session host powered on, and is the application installed?
5. Has the client refreshed? Learn says the legacy client updates regularly and each time it starts, so signing out and in or restarting it is a reasonable first test (a suggestion, not a Learn step).
6. Is the user on Windows App? In public cloud the legacy clients are past their end-of-support dates, as described above.

## Workspaces and disaster recovery

The multiregion article notes that in an active-active design users see duplicate feed entries, so you create separate workspaces and name them clearly. In an active-passive design users stay in one workspace and failover moves their assignments between application groups. Region choice and failover steps are in "Designing a multi-region Azure Virtual Desktop deployment" and "Disaster recovery for Azure Virtual Desktop: options and trade-offs".

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Azure Virtual Desktop data locations](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: Regional Host Pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/regional-host-pools)
- [Microsoft Learn: Get started with Windows App and connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Use the Remote Desktop client to connect to Azure Virtual Desktop (archived)](https://learn.microsoft.com/en-us/previous-versions/remote-desktop-client/connect-windows-cloud-services)
- [Microsoft Learn: Customize the feed for Azure Virtual Desktop users](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-feed-for-virtual-desktop-users)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Preferred application group type behavior for pooled host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type)
- [Microsoft Learn: Azure Virtual Desktop environment host pool creation](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-issues)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Multiregion business continuity and disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
- [Microsoft Tech Community: Now generally available: Regional resiliency for Azure Virtual Desktop](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/now-generally-available-regional-resiliency-for-azure-virtual-desktop/4540458)
