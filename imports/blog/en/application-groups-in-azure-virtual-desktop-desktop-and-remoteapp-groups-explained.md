---
title: "Application groups in Azure Virtual Desktop: desktop and RemoteApp groups explained"
summary: "An application group controls which desktop or which set of applications in one host pool a user can open. Desktop groups publish the full desktop, RemoteApp groups publish individual apps on pooled host pools, and a workspace makes both visible to users."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-application-group, azure-virtual-desktop]
keypoints:
  - "An application group controls access to a full desktop or to a logical grouping of applications on session hosts in a single host pool. Users get access by being assigned to application groups."
  - "Desktop groups work with pooled and personal host pools. RemoteApp groups are available with pooled host pools only."
  - "A host pool can have only one desktop application group but several RemoteApp groups. A user assigned to several RemoteApp groups sees the combined set of their applications."
  - "If a user has both group types on the same pooled host pool, the host pool's preferred application group type decides what they see. The portal default is Desktop."
  - "Learn's service limits table lists 500 RemoteApps per application group, 1000 application groups per Microsoft Entra tenant and 200 role assignments per object, and has no row for application groups per host pool."
faq:
  - q: "Can a personal host pool have a RemoteApp application group?"
    a: "No. Microsoft Learn lists RemoteApp application groups as available with pooled host pools only. A personal host pool publishes desktops through a desktop application group."
  - q: "How many application groups can one host pool have?"
    a: "Learn states that a host pool can have one desktop application group and multiple RemoteApp application groups. Its service limits table has no row for application groups per host pool. It lists 1000 application groups per Microsoft Entra tenant (more through a support ticket) and 500 RemoteApps per application group."
  - q: "Why does a user with both a desktop group and a RemoteApp group only see one of them?"
    a: "Because of the preferred application group type on the pooled host pool. When a user has both types on the same host pool, only the preferred type is shown. The portal default is Desktop, and a user can still get a desktop from one host pool and RemoteApps from another."
---

An application group is the object that decides what a user can open in a host pool: either the full Windows desktop or a selected set of applications. Users are assigned to application groups, and a [workspace](/entity/avd-workspace/) then makes the groups visible in the client.

This article explains the two group types, the rules for combining them, the preferred-type setting, the service limits and how groups connect to host pools, workspaces and users. The click-by-click procedure is in "Publishing RemoteApps with application groups: a practical walkthrough", and the workspace side is in "The Azure Virtual Desktop workspace: how users find their desktops and apps".

## Where application groups sit

Microsoft Learn's [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) describes a chain of three objects:

- A **host pool** is a collection of Azure VMs registered as session hosts. You control what users can reach through application groups.
- An **application group** controls access to a full desktop or a logical grouping of applications available on session hosts in a single host pool.
- A **workspace** is a logical grouping of application groups. Each application group must be associated with a workspace for users to see what is published, and an application group can be assigned to only one workspace.

Learn adds that users can be assigned to multiple application groups across multiple host pools, which lets you vary the applications and desktops different users can reach. An application group cannot exist without a host pool, according to the [Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq), and the FAQ says the group's location should match the host pool's so that data does not move between locations. The [application group](/entity/avd-application-group/) entity page has a short definition.

## The two group types

| | Desktop | RemoteApp |
|---|---|---|
| What users get | The full Windows desktop from a session host | Individual applications you select and publish |
| Host pool types | Pooled and personal | Pooled only |
| Per host pool | One | Several |

A [RemoteApp](/entity/avd-remoteapp/) group publishes individual applications that you select, and the applications come from the session hosts of the host pool the group belongs to. Learn's [publishing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp) says applications are not assigned to individual users unless you use App Attach, so users get everything in the groups they belong to.

## Rules for combining groups

Learn states these rules in the terminology article:

- On pooled host pools you can assign both types to the same host pool at the same time.
- You can assign only a single desktop application group per host pool, but you can assign multiple RemoteApp groups.
- A user assigned to several RemoteApp groups on the same host pool has access to the aggregate of all applications in the groups they are assigned to.

A practical consequence: you can split applications by audience without splitting VMs. For example, one pooled pool could carry one desktop group for IT staff and two RemoteApp groups, "Finance apps" and "Sales apps". A finance user assigned only to the first RemoteApp group sees only those apps. A user in both RemoteApp groups sees both sets. An IT user who is also in a RemoteApp group sees only the desktop if the host pool's preferred type is Desktop (the portal default) or not set, and only the RemoteApp applications if it is RemoteApp; see the preferred-type rule below. This example applies the rules above and is not a Microsoft-recommended layout.

## The preferred application group type

When a user has both a desktop group and a RemoteApp group on the same pooled host pool, the host pool's **preferred application group type** setting decides what the client shows. Learn's [article on the setting](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type) gives this behavior:

| User is assigned to | Preferred type | What the user sees |
|---|---|---|
| Desktop and RemoteApp groups | Desktop | Desktop |
| Desktop and RemoteApp groups | RemoteApp | RemoteApp applications |
| Desktop and RemoteApp groups | Not set | Desktop |
| Desktop group only | Any | Desktop |
| RemoteApp groups only | Any | RemoteApp applications |

Points to note from the same article:

- The setting applies only to pooled host pools. You specify a value at creation, and in the Azure portal the default is Desktop. You can change it when you create the host pool or later.
- When you create a host pool in the portal, a desktop application group is created automatically, whichever type you prefer. Its name is the host pool name plus the suffix `-DAG`, for example `hp01-DAG`. Learn says you can remove it afterwards if you only want RemoteApp applications.
- Host pools created before the setting existed may have no value. For those, the Windows App and the Remote Desktop app now enforce Desktop, and Learn says this enforcement is rolling out to all Azure regions. The page gives no completion date.
- The rule applies within one host pool. Learn says it does not prevent a user from having the full desktop from one host pool and RemoteApp applications from another.
- It is still possible to connect to a desktop and a RemoteApp on the same pool at once through the `ms-avd:connect` URI scheme, but Microsoft does not recommend it. Learn lists overloaded session hosts, sign-in failures, black remote sessions and application crashes as possible problems.

To change the value, Learn's [how-to article](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-preferred-application-group-type) gives three routes. In the portal, open **Azure Virtual Desktop**, then **Host pools**, select the pooled pool, select **Properties**, choose **Desktop** or **RemoteApp** under **Preferred app group type**, and select **Save**. With Azure PowerShell, run `Update-AzWvdHostPool` with the `PreferredAppGroupType` parameter, and with the Azure CLI run `az desktopvirtualization hostpool update --preferred-app-group-type`. In PowerShell and the CLI the value for RemoteApp is `RailApplications`, and the listing output can also show `None`. You need the Desktop Virtualization Host Pool Contributor role.

## Limits that shape the design

Learn's [service limits page](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits) has a table for Azure Virtual Desktop objects:

| Object | Per | Limit |
|---|---|---|
| RemoteApp | Application group | 500 |
| Application group | Microsoft Entra tenant | 1000 (more through a support ticket in the Azure portal) |
| Workspace | Microsoft Entra tenant | 1300 |
| Host pool | Workspace | 400 |
| Role assignment | Any Azure Virtual Desktop object | 200 |
| Session host | Host pool | 10,000 |

Two readings follow, and both are our interpretation. First, one RemoteApp group is unlikely to run into its 500-app cap, so the audience decides how you split groups, not the cap. Second, a cap of 200 role assignments per object points toward assigning user groups instead of individual users. Learn recommends assigning user groups to application groups to make ongoing management simpler. The table has no row for application groups per host pool, so the host pool's own limit on that is not stated there. Limit pages change, so check the current table before you plan a large number of groups.

## Creating, assigning and registering

The click-by-click steps, the role list and the workspace registration path are in "Publishing RemoteApps with application groups: a practical walkthrough" and "The Azure Virtual Desktop workspace: how users find their desktops and apps". Four points matter for the design:

- The group inherits the host pool's deployment scope, so it can be registered only to a workspace with the same scope. Learn's [Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) page says you cannot change the scope of an existing host pool, workspace or application group, and that mixing scopes through PowerShell or the REST API fails. See [regional host pools](/entity/avd-regional-host-pools/) for the scope choice.
- On the Workspace tab of the creation wizard you can register a group only if it is a desktop group. A RemoteApp group is added to a workspace after it is created.
- The built-in Desktop Virtualization User role is the one that lets a user use an application from an application group as a non-administrator, according to Learn's [RBAC article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac). Learn recommends assigning user groups to application groups.
- To add applications to a RemoteApp group, at least one session host in the host pool must be powered on, according to Learn's [publishing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp). After you move a subscription between Microsoft Entra tenants, the troubleshooting article says you need to reassign users to the application groups.

## Choosing a design

1. List the audiences and whether each needs a full desktop or only specific apps.
2. For desktop users on a personal pool, use a desktop group. RemoteApp is not available there.
3. For app-only users on a pooled pool, create one RemoteApp group per audience.
4. If someone needs both on one pool, set the preferred type deliberately, or give each type its own pool.
5. Assign user groups, not individual users, and register every group with a workspace of the same scope.
6. Test with one user per group before assigning whole departments.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Preferred application group type behavior for pooled host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type)
- [Microsoft Learn: Set the preferred application group type for a pooled host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-preferred-application-group-type)
- [Microsoft Learn: Publish applications with RemoteApp in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Azure subscription and service limits, quotas, and constraints (Azure Virtual Desktop section)](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/azure-subscription-service-limits)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Azure Virtual Desktop environment host pool creation (troubleshooting)](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-issues)
