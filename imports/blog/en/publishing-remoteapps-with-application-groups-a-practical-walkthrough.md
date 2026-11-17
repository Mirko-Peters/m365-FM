---
title: "Publishing RemoteApps with application groups: a practical walkthrough"
summary: "To publish a RemoteApp you create a RemoteApp application group on a pooled host pool, add applications from App Attach, the Start menu or a file path, assign users, and register the group with a workspace. This walkthrough gives the portal steps and the pitfalls Microsoft Learn documents."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-application-group, azure-virtual-desktop]
keypoints:
  - "RemoteApp groups need a pooled host pool, at least one powered-on session host, and the applications installed on the session hosts, or an App Attach package added and assigned to the host pool."
  - "In the portal you add an application from one of three sources: App Attach, Start menu or File path. Azure CLI cannot publish applications."
  - "Users are assigned to the application group, not to individual applications, unless you use App Attach."
  - "If a user also has a desktop group on the same host pool, the preferred application group type decides whether they see the desktop or the apps."
  - "Pinning a RemoteApp shortcut to the local desktop is a preview option and needs extra Intune setup. Microsoft Store apps and Windows Sandbox need their own steps."
faq:
  - q: "Do I need a powered-on session host to add a RemoteApp?"
    a: "Yes. Microsoft Learn says at least one session host must be powered on in the host pool the application group is assigned to when you add applications. Learn's FAQ adds that a RemoteApp group needs a session host to determine the Start menu apps."
  - q: "Can I publish RemoteApps with the Azure CLI?"
    a: "No. Learn says you cannot publish applications using the Azure CLI. The Azure PowerShell tab exists on the publishing page, but the page text used here shows no cmdlets, so check the Az.DesktopVirtualization reference for the current commands."
  - q: "Why do my users see a desktop instead of the RemoteApps?"
    a: "They probably have both a desktop and a RemoteApp group on the same host pool, and the host pool's preferred application group type is Desktop, which is the portal default. Change the setting under the host pool's Properties or give each type its own host pool."
---

To publish a RemoteApp, create a RemoteApp application group on a pooled host pool, add the application to it, assign users to the group, and make sure the group is registered with a workspace. Users then see the app in the client next to any desktops they have. The concepts behind this are in the sibling article "Application groups in Azure Virtual Desktop: desktop and RemoteApp groups explained"; this one is the procedure.

All steps come from Microsoft Learn pages retrieved on 17 November 2026. Menu names can change, so compare with the live portal.

## Before you start

Learn's [publishing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications) lists these prerequisites:

- An Azure subscription and an existing [host pool](/entity/avd-host-pool/) with session hosts, a RemoteApp application group and a workspace.
- At least one session host powered on in the host pool the group is assigned to.
- The applications installed on the session hosts of that pool. With App Attach, add and assign an MSIX, Appx or App-V package to the host pool first. See [MSIX app attach](/entity/msix-app-attach/).
- At least the Desktop Virtualization Application Group Contributor role on the resource group or subscription.

RemoteApp application groups are available only on pooled host pools, according to Learn's terminology article. If your pool is personal, publish a desktop instead.

## Step 1: create the RemoteApp application group

Learn's [create article](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace) gives the Basics fields in the portal: Subscription, Resource group, Host pool, Location, Application group type and Application group name. Choose **RemoteApp** as the application group type and select your pooled host pool.

The location follows the host pool, and the group inherits the host pool's deployment scope, so it can only join a workspace with the same scope. To create groups you need the Desktop Virtualization Contributor role on the resource group or subscription. Assigning users also needs `Microsoft.Authorization/roleAssignments/write`, included in User Access Administrator and Owner. A [RemoteApp](/entity/avd-remoteapp/) group is one kind of [application group](/entity/avd-application-group/).

On the Workspace tab you can register the group with a workspace right away. You can also do it later: **Azure Virtual Desktop**, **Workspaces**, the workspace, **Application groups**, **+ Add**, the plus icon next to the group, **Select**. Only groups that are not yet assigned to a workspace appear in the list.

## Step 2: add an application

1. Sign in to the Azure portal and search for **Azure Virtual Desktop**.
2. Select **Application groups**, then the RemoteApp group.
3. Select **Applications**, then **+ Add**. Keep at least one session host powered on.
4. On the **Basics** tab choose the **Application source**: **App Attach**, **Start menu** or **File path**. The other fields depend on the source.
5. Select **Next**.

What each source asks for:

| Source | Fields |
|---|---|
| App Attach | Package, Application, Application identifier, Display name, Description. The MSIX package must already be added and assigned to the host pool. |
| Start menu | Application (from a drop-down), Display name, Description, Application path (check the `.exe` path), Require command line (if Yes, enter the command line). |
| File path | Application path (the `.exe`), Application identifier, Display name, Description, Require command line. |

Learn's FAQ explains why Start menu needs a running host: for a RemoteApp group the service needs a session host to determine the Start menu apps.

## Step 3: set the icon

On the **Icon** tab the options depend on the source:

- **App Attach**: choose **Default**, or **File path** for a custom icon. You can browse Azure Files (select a storage account, then the icon file, such as `MyApp.ico`) or enter a UNC path in **Icon path**, such as `\\MyFileShare\MyApp.ico`. A `.png` file also works. Set **Icon index**, usually 0.
- **Start menu** or **File path**: enter a local path in **Icon path**, such as `C:\Program Files\MyApp\MyApp.exe`, with **Icon index** usually 0.

UNC paths work only for App Attach. For the other sources the icon file must be local to each session host.

Select **Review + add**, make sure validation passes, and select **Add**.

## Step 4: assign users

Learn says applications are not assigned individually unless you use App Attach. You assign users to the application group, and everyone in it gets all its applications. In the portal: **Azure Virtual Desktop**, **Application groups**, the group, **Assignments**, **+ Add**, then the user or group and **Select**.

Check the host pool's preferred application group type before you finish. When a user has a desktop group and a RemoteApp group on the same pooled pool, only the preferred type is shown, and the portal default is Desktop, according to Learn's [preferred type article](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type). To change it: **Host pools**, the pool, **Properties**, **Preferred app group type**, **Save**, with the Desktop Virtualization Host Pool Contributor role.

## Step 5: test as a user

Sign in to Windows App with a test account in the group. Learn's Windows App page says that after sign-in you open the **Devices** or **Apps** tab to see your remote resources, and that a tab is hidden if you have no resource of that type. Use search and filters to find the app. Learn's page on changing display names says a changed display name appears once the client refreshes. See also [Windows App](/entity/windows-app/).

If the app does not appear, work through the list in the troubleshooting section below.

## Special cases

**Microsoft Store apps.** Learn gives this procedure. On a session host open `shell:appsFolder` in File Explorer, find the app, right-click it and select **Create a shortcut**, answer **Yes** to placing it on the desktop, and read the **Target** in the shortcut properties. The path format is `shell:AppsFolder\<PackageFamilyName>!<AppId>`. Publish it with the **File path** source and use the target as the application path. Provide an icon file on a local drive at a fixed path on every session host, because the icon is not picked up automatically. Using `shell:appsFolder` avoids the problem that the version number in a Store app's install path changes on update.

**Windows Sandbox.** Needs a VM size that supports nested virtualization. Learn recommends installing it in a custom image. Publish it with the file path `C:\Windows\System32\WindowsSandbox.exe`.

**Pinning a shortcut to the local desktop.** For the File path source there is a **Create desktop shortcut (Preview)** toggle. Learn says additional Intune setup is needed or the setting will not take effect. The What's new page lists pinning RemoteApp shortcuts as public preview in September 2026. Treat it as a preview feature.

**Scripting.** You cannot publish applications with the Azure CLI. Learn's CLI page says the Azure CLI extension has no commands for applications and points to Azure PowerShell, and the page text used for this article shows no cmdlets. Look up the current `Az.DesktopVirtualization` reference before you automate.

## Troubleshooting checklist

1. Is a session host powered on in the host pool? Without one you cannot add Start menu apps.
2. Is the application installed on every session host in the pool?
3. For App Attach, was the package added and assigned to the host pool first?
4. Is the group registered with a workspace of the same deployment scope?
5. Is the user in the group, directly or through a group? After a subscription moves between Microsoft Entra tenants, Learn says assignments can be lost and must be redone.
6. Does the user also have a desktop group on the same host pool with Desktop as preferred type?
7. Has the client refreshed?
8. For a Store app, did an update change the install path, or is the icon file missing on a host?

Microsoft also points to App Assure, a service designed to help resolve application issues at no extra cost, for compatibility problems.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Publish applications in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications)
- [Microsoft Learn: Create a host pool, workspace and application group in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-application-group-workspace)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Preferred application group type behavior for pooled host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type)
- [Microsoft Learn: Set the preferred application group type for a pooled host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-preferred-application-group-type)
- [Microsoft Learn: Customize the feed for Azure Virtual Desktop users](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-feed-for-virtual-desktop-users)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Use Azure PowerShell and Azure CLI with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/cli-powershell)
- [Microsoft Learn: Get started with Windows App and connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Troubleshoot Azure Virtual Desktop set-up issues](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-set-up-issues)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
