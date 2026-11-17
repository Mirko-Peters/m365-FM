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
  - "An application group must be registered with exactly one workspace of the same deployment scope, or users will not see it."
faq:
  - q: "Can a personal host pool have a RemoteApp application group?"
    a: "No. Microsoft Learn lists RemoteApp application groups as available with pooled host pools only. A personal host pool publishes desktops through a desktop application group."
  - q: "How many application groups can one host pool have?"
    a: "Learn states that a host pool can have one desktop application group and multiple RemoteApp application groups. The pages used for this article give no maximum number of RemoteApp groups, so check the current service limits before planning a large number."
  - q: "Why does a user with both a desktop group and a RemoteApp group only see one of them?"
    a: "Because of the preferred application group type on the pooled host pool. When a user has both types on the same host pool, only the preferred type is shown. The portal default is Desktop, and a user can still get a desktop from one host pool and RemoteApps from another."
---

An application group is the object that decides what a user can open in a host pool: either the full Windows desktop or a selected set of applications. Users are assigned to application groups, and a [workspace](/entity/avd-workspace/) then makes the groups visible in the client.

This article explains the two group types, the rules that limit how you combine them, the preferred-type setting, and how groups connect to host pools, workspaces and users. The step-by-step publishing procedure is in the sibling article "Publishing RemoteApps with application groups: a practical walkthrough".

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

A [RemoteApp](/entity/avd-remoteapp/) group publishes individual applications that you select, and the applications come from the session hosts of the host pool the group belongs to. The sources used here do not say how many applications one group can hold.

## Rules for combining groups

Learn states these rules in the terminology article:

- On pooled host pools you can assign both types to the same host pool at the same time.
- You can assign only a single desktop application group per host pool, but you can assign multiple RemoteApp groups.
- A user assigned to several RemoteApp groups on the same host pool has access to the aggregate of all applications in the groups they are assigned to.

A practical consequence: you can split applications by audience without splitting VMs. For example, one pooled pool could carry one desktop group for IT staff and two RemoteApp groups, "Finance apps" and "Sales apps". A finance user assigned only to the first RemoteApp group sees only those apps. A user in both RemoteApp groups sees both sets. This example applies the rules above and is not a Microsoft-recommended layout.

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

- The setting applies only to pooled host pools. In the Azure portal the default is Desktop.
- Host pools created before the setting existed may have no value. For those, the Windows App and the Remote Desktop app now enforce Desktop, and Learn says this enforcement is rolling out to all Azure regions. The page gives no completion date.
- The rule applies within one host pool. A user can still get a desktop from one host pool and RemoteApps from another host pool.
- It is still possible to connect to a desktop and a RemoteApp on the same pool at once through the `ms-avd:connect` URI scheme, but Microsoft does not recommend it. Learn lists overloaded session hosts, sign-in failures, black remote sessions and application crashes as possible problems.

The article says the type must be set at creation but also says the portal default can be changed afterwards, so the two statements conflict. The [how-to article](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-preferred-application-group-type) gives portal steps for an existing pool: open **Azure Virtual Desktop**, then **Host pools**, select the pooled pool, select **Properties**, choose **Desktop** or **RemoteApp** under **Preferred app group type**, and select **Save**. You need the Desktop Virtualization Host Pool Contributor role.

## Creating an application group

Learn's [create article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace) lists these Basics fields for an application group in the portal: Subscription, Resource group, Host pool, Location, Application group type (**Desktop** or **RemoteApp**) and Application group name. Two details matter:

- The location is where metadata is stored, and it matches the host pool. The group also inherits the host pool's deployment scope, so it can be registered only to a workspace with the same scope. Learn says you cannot change the deployment scope of an existing host pool, workspace or application group, and that mixing scopes through PowerShell or the REST API fails. See [regional host pools](/entity/avd-regional-host-pools/) for the scope choice.
- When you create a host pool in the portal, a desktop application group is created automatically, whichever type you set as preferred.

The resource roles are listed in Learn's table: Desktop Virtualization Contributor on the resource group or subscription covers host pool, workspace and application group creation. To assign users you additionally need `Microsoft.Authorization/roleAssignments/write`, which User Access Administrator and Owner include.

## Assigning users

In the portal: **Azure Virtual Desktop**, then **Application groups**, select the group, select **Assignments**, select **+ Add**, search for the user or group, and choose **Select**. You can select users or groups.

For RemoteApps, Learn's [publishing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications) says applications are not assigned to individual users unless you use App Attach. Users get everything in the groups they belong to. The built-in Desktop Virtualization User role is the one that allows a user to use an application from an application group as a non-administrator, according to Learn's [RBAC article](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac). Learn also says that after you move a subscription between Microsoft Entra tenants, the portal can lose track of old assignments, and the fix is to reassign users.

## Registering with a workspace

A group does nothing for users until it is registered with a workspace. In the portal you can do that during creation on the Workspace tab, or afterwards: **Azure Virtual Desktop**, **Workspaces**, the workspace, **Application groups**, **+ Add**, then the plus icon next to the group and **Select**. Only groups that are not already assigned to a workspace are listed. The workspace and the group must share a location and a deployment scope. The companion article "The Azure Virtual Desktop workspace: how users find their desktops and apps" covers what happens next in the client.

## What the sources do not say

The Learn pages used for this article do not state a maximum number of RemoteApp groups per host pool, a maximum number of applications per group, or a maximum number of groups per workspace. Learn's publishing article states no limit on applications per group either. Do not plan around a figure you remember from older documentation; look up the current Azure Virtual Desktop service limits before you design a large number of groups.

## Choosing a design

1. List the audiences and whether each needs a full desktop or only specific apps.
2. For desktop users on a personal pool, use a desktop group. RemoteApp is not available there.
3. For app-only users on a pooled pool, create one RemoteApp group per audience.
4. If someone needs both on one pool, set the preferred type deliberately, or give each type its own pool.
5. Register every group with a workspace of the same scope.
6. Test with one user per group before assigning whole departments.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Preferred application group type behavior for pooled host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type)
- [Microsoft Learn: Set the preferred application group type for a pooled host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-preferred-application-group-type)
- [Microsoft Learn: Create a host pool, workspace and application group in Azure Virtual Desktop (portal, PowerShell and CLI tabs)](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace)
- [Microsoft Learn: Publish applications in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications)
- [Microsoft Learn: Built-in Azure RBAC roles for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/rbac)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop set-up issues](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-set-up-issues)
