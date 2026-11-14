---
title: "Set Up Remote Help in Intune for Helpdesk Support: Licenses, Settings, Roles"
summary: "How to turn on Remote Help in Intune: license requirement, the Tenant administration settings, deploying the app, the RBAC permissions helpers need, and how an attended session starts."
status: review
publish: false
author: mirko-p
date: 2026-12-22
topics: [intune]
keypoints:
  - "Remote Help is off by default. Turn it on under Tenant administration > Remote Help > Settings with Enable Remote Help set to Enabled."
  - "It needs a Remote Help license for helpers and sharers, in addition to Intune Plan 1 or Plan 2. Both sides sign in with an Entra account from your organization."
  - "A helper needs Remote Tasks - Offer remote assistance, Remote Assistance Connector - Read and at least one Remote Help app permission. Help Desk Operator covers most of them."
  - "Windows unattended control remote sign-in is not in Help Desk Operator. It needs a custom role and device scoping."
  - "Remote Help runs over port 443 and connects to remotehelp.microsoft.com, with TLS 1.2 encryption."
faq:
  - q: "Is Remote Help enabled by default?"
    a: "No. Microsoft Learn says it is not enabled by default for Intune tenants, and that if you turn it on, use is enabled tenant-wide. The setting is Enable Remote Help under Tenant administration > Remote Help."
  - q: "What license does Remote Help need?"
    a: "Learn lists a Remote Help license for everyone targeted to use the service, both helpers and sharers, and says the feature requires a subscription in addition to Intune Plan 1 or Plan 2. New or trial licenses can take between 30 minutes and 8 hours to become active."
  - q: "Can I help users who are not in my organization?"
    a: "No. Learn says both the helper and the sharer must sign in with a Microsoft Entra account from your organization, and you cannot use Remote Help to assist users who are not members of your organization."
  - q: "Which role should helpdesk staff get?"
    a: "The built-in Help Desk Operator role includes view screen, take full control, elevation, Android unattended control, Offer remote assistance and Remote Assistance Connector - Read. Learn says it does not include Windows unattended control remote sign-in, which needs a custom role."
  - q: "How do I start a session from the Intune admin center?"
    a: "Go to Devices > All devices, select the device, choose New remote assistance session > Remote Help > Continue, then select Initiate attended control. The user must accept the session."
---

Remote Help is Intune's built-in tool for helpdesk staff to view or control a user's device. It is not on by default. You need licenses, a tenant setting, the app on devices and the right Intune permissions for helpers. This guide follows Microsoft Learn's planning, deployment and session pages.

## Requirements

- **License.** Learn lists a Remote Help license for everyone targeted to use the service, both helpers and sharers. The feature requires a subscription in addition to Intune Plan 1 or Plan 2. New or trial licenses can take between 30 minutes and 8 hours to become active.
- **Identity.** Helper and sharer both sign in with a Microsoft Entra account from your organization. Remote Help can't assist people outside it.
- **Platforms.** For attended control, Learn lists Windows x86, x64 and ARM64, Windows 365 and Azure Virtual Desktop (desktop and RemoteApp sessions). Unattended control needs a physical, Intune-managed, corporate-owned Windows x64 device that is Entra joined or hybrid joined. Android unattended control is also supported, without a version stated in the page I read.
- **Network.** Both sides must reach Remote Help endpoints over port 443. Learn says Remote Help connects to `https://remotehelp.microsoft.com` using the Remote Desktop Protocol, encrypted with TLS 1.2.

## Task 1: Enable Remote Help

1. Sign in to the Microsoft Intune admin center and go to **Tenant administration** > **Remote Help**.
2. On the **Settings** tab, set **Enable Remote Help** to **Enabled**. It is disabled by default.
3. Optionally set **Allow Remote Help to unenrolled devices** to **Enabled**. It is also disabled by default. Learn notes that auditing for unenrolled devices is limited.
4. Optionally set **Disable chat** to **Yes** to remove chat from the app. Chat is on by default.
5. Select **Save**.

## Task 2: Deploy the app

Learn says Remote Help is available in the Enterprise App Catalog, and it can also be deployed as a Win32 app. For Win32, repackage the installer as `.intunewin` and use:

- Install: `remotehelpinstaller.exe /quiet acceptTerms=1`
- Uninstall: `remotehelpinstaller.exe /uninstall /quiet acceptTerms=1`
- Opt out of automatic updates by adding `enableAutoUpdates=0`

The options `acceptTerms` and `enableAutoUpdates` are case sensitive. Learn gives a file detection rule on `C:\Program Files\Remote Help\RemoteHelp.exe` using a version comparison, and says to assign the app to device groups, not user groups. Unattended support on Windows needs extra steps: deploy the Azure Virtual Desktop Agent first, then the Bootloader as a dependent app, and enable Remote Desktop with a Settings catalog policy.

## Task 3: Assign permissions

Remote Help uses Intune role-based access control. These are the permissions Learn lists:

| Permission | What it allows |
| --- | --- |
| Remote Help app - View screen | View the sharer's screen without control |
| Remote Help app - Take full control | Take full control of the device |
| Remote Help app - Elevation | Interact with UAC prompts on Windows |
| Remote Help app - Android unattended control | Connect to dedicated Android devices without acceptance each time |
| Remote Help app - Windows unattended control remote sign-in | Start an unattended sign-in session on a targeted corporate-owned Windows device |
| Remote Tasks - Offer remote assistance | Offer remote assistance |
| Remote Assistance Connector - Read | See whether Remote Help is configured for the tenant |

A helper needs Offer remote assistance, Connector - Read and at least one Remote Help permission. The built-in **Help Desk Operator** role covers view screen, full control, elevation, Android unattended control, Offer remote assistance and Connector - Read. Windows unattended control needs a custom role, and Learn says to scope unattended permissions to the specific devices that can receive such support.

## Start an attended session

From the Intune admin center:

1. Go to **Devices** > **All devices** and select the device.
2. In the remote actions bar, select **New remote assistance session** > **Remote Help** > **Continue**.
3. Sign in to the Remote Help app with the same credentials if prompted.
4. Select **Initiate attended control** to request view or full control. The user must accept.

The user gets a notification with **Open Remote Help**, can review the helper's name, job title, company, picture and verified domain, and then choose **Allow screen sharing or full control** or **Decline the request**. A helper can also give a session code that the user types into the app. Learn does not state how long a code is valid.

## Compliance, elevation and audit notes

- If a device is not compliant, helpers see a noncompliance warning before connecting.
- Elevation lets helpers enter local admin permissions on the shared device. Learn says the `EnableSecureCredentialPrompting` policy blocks elevation during sessions.
- When the sharer ends a session, a dialog warns they will be logged off if they continue. If the helper ends it, the sharer is not logged off.
- Session audit records appear under **Tenant administration** > **Audit Logs**.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Remote Help overview](https://learn.microsoft.com/intune/intune-service/fundamentals/remote-help)
- [Plan Remote Help](https://learn.microsoft.com/intune/remote-help/plan)
- [Deploy Remote Help](https://learn.microsoft.com/intune/remote-help/deploy)
- [Start a Remote Help session](https://learn.microsoft.com/intune/remote-help/start-session)
