---
title: "What the new RemoteApp enhancements change for users and admins"
summary: "RemoteApp enhancements change how published apps behave on the client: window moving and resizing, Windows Snap, full-screen mode, multi-monitor handling and window appearance. This article lists the requirements, the registry value, how to verify the new mode and the known issues, and flags where Learn's status wording differs."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-remoteapp, avd-application-group]
keypoints:
  - "Learn lists improved Windows Snap and full-screen support, better multi-monitor handling and refined visuals such as borders, shadows and theme integration. The what's new page adds window moving and resizing and z-ordering."
  - "Status as of 17 November 2026: the what's new page says RemoteApp enhancements are generally available for Azure Virtual Desktop (November 2026). The enhancements article, dated 2 September 2026, still says preview, so check both before you plan the rollout."
  - "Both sides need updates: session hosts on Windows 11 Enterprise 24H2 or 25H2 (or multi-session) with KB5070311 or later, SxS Network Stack 1.0.2507.25750 or newer, and a Windows 11 24H2 or 25H2 device with Windows App 2.0.864.0 or newer."
  - "The opt-in is the registry value EnableRemoteAppV2 = 1 under HKLM\\Software\\Policies\\Microsoft\\Windows NT\\Terminal Services, followed by a reboot. You verify it in Connection information: Remote session type must show RemoteAppV2."
  - "Learn lists known issues: some enhancements do not apply to Microsoft Edge and Chrome, narrowing a window at minimum width can move it, and closing a window can change the foreground window."
faq:
  - q: "Do I have to enable the RemoteApp enhancements myself?"
    a: "It depends on the page you read. The enhancements article (dated 2 September 2026) says that production host pools keep the existing experience by default and administrators can opt in with the EnableRemoteAppV2 registry value. It also says that after general availability the enhancements are enabled by default on supported systems. The what's new page announced general availability in November 2026, so check the article's current text and verify the session type on a test connection."
  - q: "How do I know a connection uses the enhancements?"
    a: "Open Connection information during a RemoteApp session, select See details and read Remote session type. Learn says RemoteAppV2 means the enhancements are working and any other value means they are not."
  - q: "Do the enhancements also apply to Windows 365 Cloud Apps?"
    a: "Learn's enhancements article names Windows 365 Cloud Apps in its overview and prerequisites. The Windows 365 Cloud Apps article, last updated 15 October 2026, still labels enhanced user experiences for Cloud Apps as public preview, so check it before you promise the behavior to Cloud App users."
---

The RemoteApp enhancements make published applications in Azure Virtual Desktop behave more like local windows: moving and resizing, Windows Snap, full-screen mode, multi-monitor handling, borders, shadows and theme integration. They need updated session hosts and an updated Windows client, and administrators switch them on with one registry value. This article sets out what changes, what you must have in place, how to enable and verify the mode, and where Microsoft's own pages still disagree on the status.

If you are new to the topic, the sibling article "RemoteApp in Azure Virtual Desktop: single apps instead of a full desktop" explains what [RemoteApp](/entity/avd-remoteapp/) is. This one is about the rendering and integration changes.

## What changes for users

Learn's [RemoteApp enhancements article](https://learn.microsoft.com/en-us/azure/virtual-desktop/remoteapp-enhancements) lists three areas for Azure Virtual Desktop RemoteApps and Windows 365 Cloud Apps:

- Improved support for Windows Snap and full-screen mode.
- Better multi-monitor handling.
- Refined visuals such as borders, shadows and theme integration.

The November 2026 entry on Learn's [what's new page](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new) describes the approach as server-first with first-class support for RemoteApps in Windows. It says RemoteApps more closely behave like local applications, with improvements to moving and resizing windows, Windows Snap, window appearance, z-ordering and full-screen behavior.

For users this means fewer cases where a published app looks or acts differently from the app next to it on the local desktop. The what's new entry goes further than windowing: it says the enhancements "improve application functionality gaps" as well as addressing longstanding windowing and integration issues. The November 2025 entry also lists better DPI handling.

## Status: preview or generally available?

Learn's pages say different things on 17 November 2026. The what's new page covers Azure Virtual Desktop; for Windows 365 Cloud Apps the status differs, as the last row shows.

| Source | What it says |
|---|---|
| What's new, November 2025 | "Enhancements to RemoteApps (preview)": enhanced user experiences are rolling out to public preview |
| RemoteApp enhancements article (dated 2 September 2026) | Title and text say preview; during public preview the enhancements roll out in the validation environment, and once generally available they are enabled by default on supported systems |
| What's new, November 2026 | "RemoteApp enhancements are now generally available for Azure Virtual Desktop" |
| Windows 365 Cloud Apps article (dated 15 October 2026) | Lists enhanced user experiences for Cloud Apps among its public preview items |

The what's new entry is the newer statement, but Microsoft has not explained why the enhancements article still says preview. Practical consequence: do not assume the default has changed for production host pools. Test with a connection and read the session type (see "Verify the mode" below). For Cloud Apps, treat the behavior as preview until the Windows 365 article says otherwise.

## Requirements

Learn lists these prerequisites for the enhancements article's scenario:

- An Azure Virtual Desktop deployment with published RemoteApps, or a Windows 365 deployment with published Cloud Apps.
- A supported operating system on the session hosts or Cloud PCs:

| Session host or Cloud PC OS | Minimum version / required update |
|---|---|
| Windows 11 Enterprise, 24H2 | 26100.7309 (KB5070311) |
| Windows 11 Enterprise, 25H2 | 26200.7309 (KB5070311) |
| Windows 11 Enterprise, 25H2 (Preview) | 26220.7051 (KB5067115) |
| Windows 11 Enterprise multi-session, 24H2 | 26100.7309 (KB5070311) |
| Windows 11 Enterprise multi-session, 25H2 | 26200.7309 (KB5070311) |
| Windows 11 Enterprise multi-session, 25H2 (Preview) | 26220.7051 (KB5067115) |

- SxS Network Stack version 1.0.2507.25750 or newer on the session hosts or Cloud PCs.
- A local device running Windows 11, version 24H2 or 25H2.
- A supported client: Windows App for Windows 2.0.864.0 or newer, or Remote Desktop client for Windows 1.2.6760.0 or newer.

Learn's [SxS Network Stack page](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-sxs) shows that version 1.0.2507.25750 was published in November 2025 with the note "General improvements and bug fixes for RemoteApp". The same page lists 1.0.2507.25755 (December 2025), which "fixes a RemoteApp connection issue for Windows 11 KB5070311 or later updates", and gives 1.0.2607.31825 as the latest production version and 1.0.2610.08300 as the latest validation version, both published in October 2026. A host that meets only the minimum SxS version therefore misses a RemoteApp fix that Learn lists; aim for the current production version. The pages do not say which operating systems older than the table, or Windows Server, receive the enhancements, so do not promise them.

The requirement for a Windows 11 local device matters for planning. The article does not describe what users on other platforms get, so verify your macOS, web and mobile users separately with the platform documentation, such as the [Windows App connection article](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps).

## Enable the enhancements

Per Learn, enhancements are enabled by default for host pools in the [validation environment](/entity/avd-validation-environment/) as part of a staged rollout at a 75% chance. Production host pools keep the existing experience by default. Administrators can opt in with the registry value set to 1, or opt out in the validation environment by setting it to 0.

1. Set this value on the session hosts or Cloud PCs:
   - Key: `HKLM\Software\Policies\Microsoft\Windows NT\Terminal Services`
   - Type: REG_DWORD
   - Name: `EnableRemoteAppV2`
   - Data: `1`
2. Make sure neither of these Group Policy settings is disabled. Both are under Computer Configuration > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Remote Session Environment:
   - **Use advanced RemoteFX graphics for RemoteApp**
   - **Enable enhanced shell experience for RemoteApp**
3. Reboot the session hosts or Cloud PCs.

For Windows 365 Cloud Apps, Learn says you can deploy the registry value with [Remediations in Intune](https://learn.microsoft.com/en-us/mem/intune/fundamentals/remediations). For session hosts, the article does not name a deployment tool; your image, [Intune](/entity/intune/) or Group Policy process applies. If you build session hosts from a golden image, put the value in the image so that new hosts start with it. That is our suggestion, not a Learn step.

Because the setting is per host, apply it to every host in a pool. The article says nothing about pools with a mix of enabled and disabled hosts. Our reading: such a pool is likely to give users a different experience from one session to the next, so test it before you accept it.

## Verify the mode

1. Connect to a published RemoteApp or Cloud App with a supported client.
2. Open **Connection information**:
   - **Windows App:** press Ctrl-Alt-End, right-click the Windows Security title bar and select **Connection information**.
   - **Remote Desktop client:** right-click the system tray icon, hover over the active connection and select **Connection information**.
3. Select **See details**.
4. Read **Remote session type**. **RemoteAppV2** means the enhancements are working. Any other value means they are not; recheck the client and host prerequisites and the registry value.

Check this on at least one host per pool and one client of each supported type (Windows App and Remote Desktop client) before you tell users that the behavior has changed.

## Known issues and limits

Learn lists three known issues:

- Some RemoteApp enhancements are not applied to Microsoft Edge and Chrome.
- Narrowing a RemoteApp window that is already at minimum width sometimes moves the window instead.
- Closing a RemoteApp window sometimes changes the foreground window.

If your published apps include Edge or Chrome, tell users that part of the improved behavior will not apply to those two apps. The November 2026 what's new entry does not list them, so they come from the enhancements article, as dated 2 September 2026; check the current article for changes.

## A rollout plan for admins

1. **Inventory.** List host pools with RemoteApp groups, their operating system versions, and the clients your users have. Note which users are on Windows 11 24H2 or 25H2.
2. **Update.** Bring session hosts to the required Windows update and a current SxS Network Stack version through your normal image or update process.
3. **Pilot in validation.** Use a [validation host pool](/entity/avd-validation-environment/) or a small production pool with the registry value set to 1. Verify with Connection information.
4. **Collect feedback.** Ask pilot users about Snap, full-screen and multi-monitor behavior, and about Edge and Chrome if you publish them.
5. **Roll out per pool.** Set the value on the remaining pools, reboot, verify, and keep the opt-out value (0) in mind for the validation environment.
6. **Document the status.** Note the date on which you checked the Learn pages, because the preview and generally available wording differs between pages.

The same rollout applies to Cloud Apps, with the Intune Remediations route for the registry value and a note that the Cloud Apps article still shows the enhanced experience as preview.

## What these enhancements do not change

Learn's enhancements and what's new pages describe windowing, integration and visual behavior and mention no change to assignment, the preferred application group type or host pool settings. Our reading, not a Learn statement: those settings stay as they were, so check them in a pilot; the sibling article "Application groups in Azure Virtual Desktop: desktop and RemoteApp groups explained" covers them. Newer RemoteApp features on the what's new page are separate: pinning RemoteApp shortcuts to the local desktop (public preview, September 2026), RemoteApp support for context-based redirections (preview, October 2026, see [context-based redirections](/entity/avd-context-based-redirections/)) and Intune Remote Help in RemoteApp sessions (July 2026).

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: RemoteApp enhancements (preview)](https://learn.microsoft.com/en-us/azure/virtual-desktop/remoteapp-enhancements)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: What's new in the Azure Virtual Desktop SxS Network Stack](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new-sxs)
- [Microsoft Learn: Windows 365 Cloud Apps](https://learn.microsoft.com/en-us/windows-365/enterprise/cloud-apps)
- [Microsoft Learn: Publish applications with RemoteApp in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/publish-applications-stream-remoteapp)
- [Microsoft Learn: Get started with Windows App and connect to devices and apps](https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps)
