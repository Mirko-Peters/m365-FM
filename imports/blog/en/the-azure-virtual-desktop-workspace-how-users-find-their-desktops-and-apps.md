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
  - q: "Does a workspace store anything about users or sessions?"
    a: "Not user documents. Learn's data locations article says the service stores customer input data such as object names and settings, and customer data such as application and VM names and user principal names, in the geography or region of the resource. It does not store user documents or databases."
---

A workspace is the object that turns application groups into a list a user can open. If a user is assigned to an application group and that group is registered with a workspace, the group's desktops and apps appear in the client. If either link is missing, nothing appears.

This article explains that chain, what a workspace contains, how users get to it, and what to check when a resource is missing. Layouts for several teams and regions are in the sibling article "Designing workspaces for multiple teams and regions".

## The chain from user to resource

Microsoft Learn's [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) defines the objects:

- A **host pool** is a collection of Azure VMs registered as session hosts.
- An **application group** controls access to a full desktop or a logical grouping of applications on session hosts in a single host pool.
- A **workspace** is a logical grouping of application groups. Each application group must be associated with a workspace for users to see the desktops and applications published to them. An application group can only be assigned to a single workspace.

So the path for one user is: user, then assignment to an application group, then the group's registration with a workspace, then the host pool's session hosts. A workspace itself holds no VMs and no users. It holds references to application groups, and the users reach those groups through their assignments. See [workspaces](/entity/avd-workspace/), [application groups](/entity/avd-application-group/) and [host pools](/entity/avd-host-pool/).

Because users can be assigned to several application groups across several host pools, one user can see resources from several pools in one list, and several workspaces can show up for the same user if their groups sit in different workspaces. Learn describes this as a way to vary the applications and desktops users can reach.

## Creating a workspace and registering groups

Learn's [creation article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace) describes these portal choices for a workspace:

- **Deployment scope**: **Regional** or **Geographical**. The option appears only when the selected location supports regional workspaces. A workspace can only have application groups of the same scope registered to it, so create it with the same scope as the host pools whose groups it will publish.
- **Application groups** tab (optional): select **Yes**, then **+ Register application groups**, pick the groups and choose **Select**.
- **Advanced** tab (optional): **Enable diagnostics settings**, with destinations a Log Analytics workspace, a storage account or an event hub.

To register a group later: **Azure Virtual Desktop**, **Workspaces**, the workspace name, **Application groups**, **+ Add**, the plus icon next to the group, **Select**. Only groups not already assigned to a workspace are listed.

Learn's FAQ adds a location rule: workspaces must be in the same location as their application groups, and when a workspace updates, the related application groups update with it. For the group-to-host-pool link, the FAQ gives the reason that data should not be transferred between multiple locations.

## Deployment scope: where the workspace metadata lives

Learn's [service architecture article](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience) explains that scope decides where the metadata of host pools, workspaces, application groups and App Attach packages is stored. Geographical is the original behavior and the default. Metadata goes to the database serving the geography of the host pool's region. Regional writes it to a database in the host pool's own region. There are no functional differences between the two, only the storage location.

The rules that matter for workspaces:

- A regional host pool can only be a member of a regional workspace and can only contain regional application groups, and the reverse for geographical.
- Application groups created in a regional host pool are automatically regional.
- Scope is set at creation and cannot be changed afterwards. PowerShell or REST requests that mix scopes fail.

The [data locations](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations) page lists Central US and East US 2 as the regions where regional scope is supported. Learn's What's new page lists regional host pools as generally available in September 2026, while Microsoft's multiregion article still calls them public preview, so confirm the current status before you build on it. The sibling articles on regional host pools cover the choice in depth. See [regional host pools](/entity/avd-regional-host-pools/).

The same data locations page says the service stores customer input data, such as object names and settings, and customer data such as application names, VM names and user principal names, in the geography (geographical scope) or region (regional scope) of the resource. It states that the service does not store user documents, databases or config files.

## How users reach a workspace

**Windows App.** Learn's Windows App article says users sign in with their user account for Azure Virtual Desktop, and that a personal Microsoft account cannot be used. After sign-in the **Devices** and **Apps** tabs show remote resources from Azure Virtual Desktop and any other services the user has access to. A tab is hidden if the user has no resource of that type. Search and filters help find a resource, and favorites can be pinned. See [Windows App](/entity/windows-app/).

**Legacy Remote Desktop client.** An archived Learn article describes subscribing to a workspace in the Remote Desktop client for Windows. A user selects **Subscribe** and signs in with their account, and discovery finds the workspaces. If the message **No workspace is associated with this email address** appears, the admin might not have set up email discovery, or the environment is not Azure cloud. The alternative is **Subscribe with URL** with one of these addresses:

| Azure environment | Workspace URL |
|---|---|
| Azure cloud | `https://rdweb.wvd.microsoft.com` |
| Azure for US Government | `https://rdweb.wvd.azure.us/api/arm/feeddiscovery` |
| Azure operated by 21Vianet | `https://rdweb.wvd.azure.cn/api/arm/feeddiscovery` |

The same article states that support for the Remote Desktop client for Windows (MSI) and the web client ended on 27 March 2026 for customers in public cloud environments, and that users should migrate to Windows App. For this reason, give users the Windows App instructions unless you operate in an environment where the legacy client is still supported.

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

1. Is the user, or a group they belong to, assigned to the application group? After a subscription moves between Microsoft Entra tenants, Learn says assignments can be lost and you must reassign users.
2. Is the application group registered with a workspace, and do both share a location and a deployment scope?
3. If the user has both a desktop and a RemoteApp group on the same pooled pool, which type does the host pool prefer? Only the preferred type is shown.
4. For a RemoteApp, is a session host powered on, and is the application installed?
5. Has the client refreshed? Sign out and in, or restart it.
6. Is the user on a supported client?

## Workspaces and disaster recovery

The multiregion article notes that in an active-active design users see duplicate feed entries, so you create separate workspaces and name them clearly. In an active-passive design users stay in one workspace and failover moves their assignments between application groups.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Create a host pool, workspace and application group in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace)
- [Microsoft Learn: Azure Virtual Desktop service architecture and resilience](https://learn.microsoft.com/en-us/azure/virtual-desktop/service-architecture-resilience)
- [Microsoft Learn: Azure Virtual Desktop data locations](https://learn.microsoft.com/en-us/azure/virtual-desktop/data-locations)
- [Microsoft Learn: Get started with Windows App and connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Connect to Azure Virtual Desktop with the Remote Desktop client for Windows (archived)](https://learn.microsoft.com/en-us/azure/virtual-desktop/users/connect-windows)
- [Microsoft Learn: Customize the feed for Azure Virtual Desktop users](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-feed-for-virtual-desktop-users)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Preferred application group type behavior for pooled host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop set-up issues](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-set-up-issues)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Multiregion business continuity and disaster recovery for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/architecture/example-scenario/azure-virtual-desktop/azure-virtual-desktop-multi-region-bcdr)
