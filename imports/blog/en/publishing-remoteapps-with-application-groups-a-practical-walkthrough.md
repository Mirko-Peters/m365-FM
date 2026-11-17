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
  - "In the portal you add an application from one of three sources: App Attach, Start menu or File path. Azure CLI cannot publish applications; Azure PowerShell can, with New-AzWvdApplication."
  - "Users are assigned to the application group, not to individual applications, unless you use App Attach."
  - "If a user also has a desktop group on the same host pool, the preferred application group type decides whether they see the desktop or the apps."
  - "Pinning a RemoteApp shortcut to the local desktop is a preview option and needs extra Intune setup. Microsoft Store apps and Windows Sandbox need their own steps."
faq:
  - q: "Do I need a powered-on session host to add a RemoteApp?"
    a: "Yes. Microsoft Learn says at least one session host must be powered on in the host pool the application group is assigned to when you add applications. Learn's FAQ adds that a RemoteApp group needs a session host to determine the Start menu apps."
  - q: "Can I publish RemoteApps with the Azure CLI?"
    a: "No. Learn says you cannot publish applications using the Azure CLI, because the Azure CLI extension for Azure Virtual Desktop has no commands for applications. Use Azure PowerShell instead: the New-AzWvdApplication cmdlet in the Az.DesktopVirtualization module adds an application to a RemoteApp group."
  - q: "Why do my users see a desktop instead of the RemoteApps?"
    a: "They probably have both a desktop and a RemoteApp group on the same host pool, and the host pool's preferred application group type is Desktop, which is the portal default. Change the setting under the host pool's Properties or, as a design choice, give each type its own host pool."
---

To publish a RemoteApp, create a RemoteApp application group on a pooled host pool, add the application to it, assign users to the group, and make sure the group is registered with a workspace. Users then see the app in the client next to any desktops they have. The concepts behind this are in the sibling article "Application groups in Azure Virtual Desktop: desktop and RemoteApp groups explained"; this one is the procedure.

## Before you start

Learn's [publishing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp) lists these prerequisites:

- An Azure subscription and an existing [host pool](/entity/avd-host-pool/) with session hosts, a RemoteApp application group and a workspace.
- At least one session host powered on in the host pool the group is assigned to.
- The applications installed on the session hosts of that pool. With App Attach, add and assign an MSIX, Appx or App-V package to the host pool first. See [MSIX app attach](/entity/msix-app-attach/).
- To add applications to an existing group, at least the Desktop Virtualization Application Group Contributor role on the resource group or subscription. Creating the host pool, workspace and application group needs a different role, covered in Step 1.
- For the PowerShell route, an Azure session with the right subscription context. To publish App Attach applications with PowerShell the publishing article asks for version 4.2.0 or later of the `Az.DesktopVirtualization` module, while the App Attach article asks for 4.2.1 or later, so use 4.2.1 or later. For Microsoft Store applications you also need the `Appx` module, which is part of Windows.

RemoteApp application groups are available only on pooled host pools, according to Learn's terminology article. If your pool is personal, publish a desktop instead.

## Step 1: create the RemoteApp application group

Learn's [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop) gives the Basics fields in the portal: Subscription, Resource group, Host pool, Location, Application group type and Application group name. Choose **RemoteApp** as the application group type and select your pooled host pool.

The location follows the host pool, and the group inherits the host pool's deployment scope, so it can only join a workspace with the same scope. According to the deployment article, creating a host pool, workspace and application group together needs at least the Desktop Virtualization Contributor role on the resource group or subscription; Learn does not say whether the narrower Application Group Contributor role is enough to create a group on its own. Assigning users also needs `Microsoft.Authorization/roleAssignments/write`, included in User Access Administrator and Owner. A [RemoteApp](/entity/avd-remoteapp/) group is one kind of [application group](/entity/avd-application-group/).

The wizard also has an **Application groups** tab (**+ Add applications**, which needs at least one session host powered on) and an **Assignments** tab. Its **Workspace** tab, however, registers only the default desktop group of the host pool, according to Learn, so a RemoteApp group is registered after it exists: **Azure Virtual Desktop**, **Workspaces**, the workspace, **Application groups**, **+ Add**, the plus icon next to the group, **Select**. Only groups that are not yet assigned to a workspace appear in the list. Menu names can change, so compare with the live portal.

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

**The same step in Azure PowerShell.** Learn's publishing article shows the cmdlets for each source. For a Start menu application, list the available items and use the `AppAlias` value:

```powershell
$parameters = @{
    ApplicationGroupName = '<ApplicationGroupName>'
    ResourceGroupName    = '<ResourceGroupName>'
}
Get-AzWvdStartMenuItem @parameters | Select-Object Name, AppAlias

$parameters = @{
    Name               = 'WordPad'
    AppAlias           = 'wordpad'
    GroupName          = '<ApplicationGroupName>'
    ResourceGroupName  = '<ResourceGroupName>'
    CommandLineSetting = 'DoNotAllow'
}
New-AzWvdApplication @parameters
```

For a file path source, Learn's example publishes Excel with `FilePath`, `IconPath`, `IconIndex = '1'`, `CommandLineSetting = 'Require'`, a `CommandLineArgument` and `ShowInPortal = $true`. The cmdlet reference lists `GroupName`, `Name`, `ResourceGroupName` and `CommandLineSetting` as mandatory; `CommandLineSetting` controls whether the app can be launched with command line arguments from the client, with arguments set at publish time, or with none. For an App Attach application, read the package with `Get-AzWvdAppAttachPackage`, then call `New-AzWvdApplication` with `ApplicationType = 'MsixApplication'`, `MsixPackageFamilyName` and `MsixPackageApplicationId`. Check the result with `Get-AzWvdApplication -GroupName <ApplicationGroupName> -ResourceGroupName <ResourceGroupName>`.

## Step 3: set the icon

On the **Icon** tab the options depend on the source:

- **App Attach**: choose **Default**, or **File path** for a custom icon. You can browse Azure Files (select a storage account, then the icon file, such as `MyApp.ico`) or enter a UNC path in **Icon path**, such as `\\MyFileShare\MyApp.ico`. A `.png` file also works. Set **Icon index**, usually 0.
- **Start menu** or **File path**: enter a local path in **Icon path**, such as `C:\Program Files\MyApp\MyApp.exe`, with **Icon index** usually 0.

UNC paths work only for App Attach. For the other sources Learn allows only a local path, so the icon file has to exist at that path on the session hosts; the Store section says "on each session host".

Select **Review + add**, make sure validation passes, and select **Add**.

## Step 4: assign users

Learn says applications are not assigned individually unless you use App Attach. You assign users to the application group, and everyone in it gets all its applications. In the portal: **Azure Virtual Desktop**, **Application groups**, the group, **Assignments**, **+ Add**, then the user or group and **Select**.

Check the host pool's preferred application group type before you finish. When a user has a desktop group and a RemoteApp group on the same pooled pool, only the preferred type is shown, and the portal default is Desktop, according to Learn's [preferred type article](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type); the sibling application groups article covers the matrix. To change it: **Host pools**, the pool, **Properties**, **Preferred app group type**, **Save**, with the Desktop Virtualization Host Pool Contributor role.

## Step 5: test as a user

Sign in to Windows App with a test account in the group. Learn's Windows App page says that after sign-in you open the **Devices** or **Apps** tab to see your remote resources, and that a tab is hidden if you have no resource of that type. Use search and filters to find the app. Learn's page on changing display names says a changed display name appears once the client refreshes. See also [Windows App](/entity/windows-app/).

If the app does not appear, work through the list in the troubleshooting section below.

## Special cases

**Microsoft Store apps.** Learn gives this procedure. On a session host open `shell:appsFolder` in File Explorer, find the app, right-click it and select **Create a shortcut**, answer **Yes** to placing it on the desktop, and read the **Target** in the shortcut properties. The path format is `shell:AppsFolder\<PackageFamilyName>!<AppId>`. Publish it with the **File path** source and use the target as the application path. Provide an icon file on a local drive at a fixed path on every session host, because the icon is not picked up automatically. Using `shell:appsFolder` avoids the problem that the version number in a Store app's install path changes on update.

**Windows Sandbox.** Needs a VM size that supports nested virtualization. Learn recommends installing it in a custom image. Publish it with the file path `C:\Windows\System32\WindowsSandbox.exe`.

**Pinning a shortcut to the local desktop.** In the portal, Learn lists a **Create desktop shortcut (Preview)** toggle with the File path source fields, and for PowerShell it points to a script in preview. Either way, Learn says additional Intune setup is needed or the setting will not take effect. The What's new page lists pinning RemoteApp shortcuts as public preview in September 2026. Treat it as a preview feature.

**Window behavior.** What's new for November 2026 says RemoteApp enhancements, which change moving and resizing windows, Windows Snap, window appearance, z-ordering and full-screen behavior, are generally available. Learn's [RemoteApp enhancements](https://learn.microsoft.com/en-us/azure/virtual-desktop/remoteapp-enhancements) article still carries "preview" in its title and lists minimum Windows builds and client versions, so read it before you rely on the behavior.

**Scripting.** You cannot publish applications with the Azure CLI. Learn's CLI page says the Azure CLI extension has no commands for applications and points to Azure PowerShell. Use `New-AzWvdApplication` as shown in Step 2, and check the parameters against the current `Az.DesktopVirtualization` reference before you automate.

## Troubleshooting checklist

1. Is a session host powered on in the host pool? Without one you cannot add Start menu apps.
2. Is the application installed on every session host in the pool?
3. For App Attach, was the package added and assigned to the host pool first?
4. Is the group registered with a workspace of the same deployment scope?
5. Is the user in the group, directly or through a group? If you moved the subscription from one Microsoft Entra tenant to another and old assignments are still tied to the previous tenant, Learn says the Azure portal loses track of them, and you need to reassign users to application groups.
6. Does the user also have a desktop group on the same host pool with Desktop as preferred type?
7. Has the client refreshed?
8. For a Store app, did an update change the install path, or is the icon file missing on a host?

For application compatibility problems, a separate Learn page describes App Assure. It is part of the FastTrack benefit, which comes at no additional cost with eligible Microsoft 365 and Windows plans, and the page lists Azure Virtual Desktop among the supported technologies. The publishing article itself does not mention it.

## Sources

Retrieved 17 November 2026.

- [Microsoft Learn: Publish applications with RemoteApp in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp)
- [Microsoft Learn: New-AzWvdApplication (Az.DesktopVirtualization)](https://learn.microsoft.com/en-us/powershell/module/az.desktopvirtualization/new-azwvdapplication)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Add and manage App Attach applications in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-setup)
- [Microsoft Learn: RemoteApp enhancements (preview)](https://learn.microsoft.com/en-us/azure/virtual-desktop/remoteapp-enhancements)
- [Microsoft Learn: App Assure](https://learn.microsoft.com/en-us/windows/compatibility/app-assure)
- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Preferred application group type behavior for pooled host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type)
- [Microsoft Learn: Set the preferred application group type for a pooled host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-preferred-application-group-type)
- [Microsoft Learn: Customize the feed for Azure Virtual Desktop users](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-feed-for-virtual-desktop-users)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Use Azure PowerShell and Azure CLI with Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/cli-powershell)
- [Microsoft Learn: Get started with Windows App and connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Azure Virtual Desktop environment host pool creation](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-issues)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
