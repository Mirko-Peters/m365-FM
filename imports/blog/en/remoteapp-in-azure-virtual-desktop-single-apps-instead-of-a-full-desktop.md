---
title: "RemoteApp in Azure Virtual Desktop: single apps instead of a full desktop"
summary: "RemoteApp publishes individual applications from a pooled host pool, so users open an app in Windows App instead of a full Windows desktop. This article explains what RemoteApp is, where the apps come from, what it does not isolate, and how to decide between apps and a desktop."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-remoteapp, avd-application-group]
keypoints:
  - "RemoteApp lets users open individual published applications from a session host in a pooled host pool. Learn lists RemoteApp as available with pooled host pools only; personal host pools publish desktops."
  - "Apps come from three sources in the portal: App Attach, the Start menu or a file path. Learn says apps installed locally or delivered with App Attach both work in a RemoteApp group."
  - "Users are assigned to the application group and can open every app in it. Apps are not assigned one by one, except with App Attach."
  - "A RemoteApp group does not turn the session host into a locked-down appliance. Learn's Cloud Apps page says a published app can open other apps on the Cloud PC and recommends Application Control for Windows to control access fully; check whether the same applies to your session hosts."
  - "Status as of 17 November 2026: Learn's what's new page says RemoteApp enhancements are generally available for Azure Virtual Desktop, while the enhancements page still has 'preview' in its title. Pinning RemoteApp shortcuts to the local desktop and RemoteApp support for context-based redirections are preview features."
faq:
  - q: "Can I publish single apps from a personal host pool?"
    a: "No. Microsoft Learn's terminology article says RemoteApp application groups are available with pooled host pools only. A personal host pool publishes a full desktop through a desktop application group."
  - q: "Do users need to install anything to open a RemoteApp?"
    a: "They need a client. Learn describes apps appearing in Windows App, on the Apps tab, and lists Windows, macOS, iOS/iPadOS, Android/ChromeOS, a web browser and Meta Quest (marked as preview in the page's introductory list) as platforms for Azure Virtual Desktop. The applications themselves are installed on the session hosts or attached with App Attach, not on the user's device."
  - q: "Is RemoteApp the same as Windows 365 Cloud Apps?"
    a: "They deliver the same kind of experience, individual apps in Windows App, but the back end differs. Cloud Apps run on Windows 365 Flex Cloud PCs in shared mode and need a Windows 365 Flex license, while RemoteApp runs on Azure Virtual Desktop session hosts in a pooled host pool that you manage."
---

RemoteApp is the Azure Virtual Desktop option for publishing individual applications instead of a full Windows desktop. Users see the apps you select in Windows App, open them like local programs, and the apps run on a session host in a pooled [host pool](/entity/avd-host-pool/). This article is the concept and decision guide; the sibling articles cover [application groups](/entity/avd-application-group/) in detail and the step-by-step publishing procedure.

## What RemoteApp is

Learn's [terminology article](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology) defines two application group types:

- **Desktop**: users access the full Windows desktop from a session host. Available with pooled or personal host pools.
- **RemoteApp**: users access individual applications you select and publish to the application group. Available with pooled host pools only.

[RemoteApp](/entity/avd-remoteapp/) is therefore a way of publishing, not a separate product. The same pooled [session hosts](/entity/avd-session-host/) that can serve desktops can serve apps. What changes is what the user is given: a window for one application instead of a desktop with a Start menu and taskbar.

Learn's [publishing article](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp) adds that the applications in a RemoteApp group are either installed locally on the session hosts or delivered dynamically with App Attach.

## What users see

In Windows App, users select the **Apps** tab (or **Devices** for desktops) after they sign in, then select an app to connect. Learn's [Windows App article](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps) says the tabs are hidden if you have no resources of that type assigned, and that you can pin favorites to the **Favorites** tab. It lists Azure Virtual Desktop as available in Windows App on Windows, macOS, iOS/iPadOS, Android/ChromeOS, a web browser and Meta Quest, which its introductory list marks as preview.

You control the names. Learn's [feed customization article](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-feed-for-virtual-desktop-users) says to open the application group, select **Applications**, select the application and change **Display name**; users see the new name once their client refreshes. The role needed is Desktop Virtualization Application Group Contributor.

## Where the applications come from

In the portal, you add an application from one of three sources according to the publishing article: **App Attach** (a package already added and assigned to the host pool), **Start menu** (an application picked from the session host's Start menu) or **File path** (the path to the `.exe` on the session hosts). The sibling article "Publishing RemoteApps with application groups: a practical walkthrough" covers the fields and the procedure, so this article does not repeat them.

Two details matter for planning. First, Learn's FAQ says that when you add apps to a RemoteApp application group you need a session host to determine the Start menu apps, and the publishing article says at least one session host must be powered on. Second, [App Attach](/entity/msix-app-attach/) packages come in MSIX, Appx and App-V formats according to Learn's [App Attach overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview). That page says user configuration files are supported only on desktop connections, not on remote app connections, so check whether an App-V package depends on them before you publish it as a RemoteApp.

## How assignment works

Users are not assigned to individual apps, except with App Attach. They are assigned to the application group and can open every app in it. If a user is in several RemoteApp groups on the same host pool, they get the aggregate of the apps in those groups (terminology article). Each group must be associated with a [workspace](/entity/avd-workspace/) for users to see the apps.

The one conflict to design around is a user who holds both a desktop group and a RemoteApp group on the same host pool. Learn's [preferred application group type article](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type) says the host pool's preferred type decides what Windows App shows, and that the Azure portal also creates a desktop group with the suffix `-DAG`, even when you choose RemoteApp, which you can remove after creation. The sibling article on desktop and RemoteApp groups covers the matrix and the `ms-avd:connect` caveat.

A simple design that avoids all of this: give app users and desktop users different host pools, or make sure no user holds both group types on one pool.

## What RemoteApp does not do

RemoteApp changes what the user sees, not what the session host is. The session host is still a Windows machine with a full operating system, and two points are easy to miss.

- **It is not application isolation.** Learn's [Windows 365 Cloud Apps article](https://learn.microsoft.com/en-us/windows-365/enterprise/cloud-apps) says a published app can open other apps on the Cloud PC: Outlook published as a Cloud App can launch Microsoft Edge from email links even if Edge is not published. It says to use Application Control for Windows to control app access fully. The Azure Virtual Desktop publishing article does not repeat this statement, so treat it as a likely behavior of any RemoteApp session and test it on your own session hosts.
- **Pooled hosts are shared.** RemoteApp runs on the same pooled session hosts as desktops, so host pool load balancing and sizing still apply. Our reading, not a Learn statement: test how much memory and CPU your heaviest app needs in a pilot before you size the pool.

For apps that do not run well in a remote session, Learn's [App Assure page](https://learn.microsoft.com/en-us/windows/compatibility/app-assure) lists Azure Virtual Desktop among the platforms where App Assure engineers help with compatibility issues; check the page's date and your plan's eligibility.

## RemoteApp or a desktop: how to decide

The table sets out the differences that Learn documents.

| Question | Desktop group | RemoteApp group |
|---|---|---|
| Host pool type | Pooled or personal | Pooled only |
| Groups per host pool | One desktop group | Several RemoteApp groups |
| What the user opens | Full Windows desktop | The published apps |
| Where you add content | Not applicable | Applications under the group, from App Attach, Start menu or file path |
| Assignment | To the group | To the group (to the app with App Attach) |

Choose RemoteApp when users need a small set of line-of-business applications next to their local desktop, when you want to give different teams different app sets from the same image, or when you want to hand out applications to users who already have a managed device. Choose a desktop when users need a full workspace, a personal host pool, or applications that depend on the full shell. This is a design judgment, not a Microsoft rule; a pilot group will show whether the apps behave well in app mode.

Windows 365 offers the same app-streaming model for Cloud PCs. Learn says Cloud Apps run on Windows 365 Flex Cloud PCs in shared mode, need a Windows 365 Flex license, and that the maximum number of active Cloud App sessions for a provisioning policy equals the number of Flex licenses assigned to it. Windows 365 Flex was formerly called Windows 365 Frontline. If you do not want to run session hosts yourself, Cloud Apps are the Windows 365 alternative. Learn's Cloud Apps page does not compare the two models, so compare image management, networking and scaling in the Windows 365 and Azure Virtual Desktop documentation before you decide.

## Status of related features

Check these before you promise them to users, because Learn marks several as preview:

- **RemoteApp enhancements.** The what's new page and the enhancements article differ on preview or general availability; the sibling article "What the new RemoteApp enhancements change for users and admins" sets out the status and the requirements.
- **Pin RemoteApp shortcuts to the local desktop.** Public preview, according to the September 2026 what's new entry. The publishing article says the **Create desktop shortcut (Preview)** option also needs additional Intune setup.
- **Context-based redirections for RemoteApp.** Preview, according to the October 2026 what's new entry. See [context-based redirections](/entity/avd-context-based-redirections/).
- **Remote assistance in RemoteApp sessions.** The July 2026 what's new entry says Intune Remote Help now supports remote assistance within RemoteApp sessions.

## A short checklist before you publish

1. Confirm the target is a pooled host pool and that no user holds both group types on it, or set the preferred application group type on purpose.
2. Decide the source per app: image-installed (Start menu or file path) or App Attach.
3. Check Microsoft Store apps and Windows Sandbox: the publishing article gives special paths and says Windows Sandbox needs a VM size with nested virtualization.
4. Assign users to the group, and register the group with a workspace.
5. Decide how you will control what else a user can start in the session.
6. Test with a pilot group on the client platforms you support.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Azure Virtual Desktop terminology](https://learn.microsoft.com/en-us/azure/virtual-desktop/terminology)
- [Microsoft Learn: Publish applications with RemoteApp in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp)
- [Microsoft Learn: Preferred application group type behavior for pooled host pools](https://learn.microsoft.com/en-us/azure/virtual-desktop/preferred-application-group-type)
- [Microsoft Learn: Get started with Windows App and connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
- [Microsoft Learn: Customize the feed for Azure Virtual Desktop users](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-feed-for-virtual-desktop-users)
- [Microsoft Learn: App Attach and MSIX App Attach overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/app-attach-overview)
- [Microsoft Learn: Azure Virtual Desktop FAQ](https://learn.microsoft.com/en-us/azure/virtual-desktop/faq)
- [Microsoft Learn: Windows 365 Cloud Apps](https://learn.microsoft.com/en-us/windows-365/enterprise/cloud-apps)
- [Microsoft Learn: App Assure](https://learn.microsoft.com/en-us/windows/compatibility/app-assure)
- [Microsoft Learn: RemoteApp enhancements (preview)](https://learn.microsoft.com/en-us/azure/virtual-desktop/remoteapp-enhancements)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
