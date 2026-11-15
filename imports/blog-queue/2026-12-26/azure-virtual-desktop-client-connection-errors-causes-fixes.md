---
title: "Azure Virtual Desktop Client Connection Errors: No Feed, Sign-In and Client Fixes"
summary: "Troubleshoot Azure Virtual Desktop client problems using Microsoft Learn: no feed, lost feed after a subscription move, Conditional Access blocks, client resets and log collection, with the age of the client page flagged."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [azure-virtual-desktop]
keypoints:
  - "For no feed, confirm the user's application group assignment, the credentials and that any Entra group is a security group, because distribution groups are not supported."
  - "After a subscription moves tenants or a CSP transfer, reassign users or re-register the Microsoft.DesktopVirtualization resource provider."
  - "A Conditional Access error can come from missing access to the Azure Virtual Desktop and Windows 365 apps or to the Windows Cloud Login app."
  - "The Remote Desktop client for Windows page is marked archived with a last update in 2022, so treat its fixes as older guidance."
  - "The pages list no numeric error codes. They give message text and fixes in a fixed order."
faq:
  - q: "What do I check first when users see no feed?"
    a: "According to Microsoft Learn, confirm the user is assigned to application groups, check the credentials and, for the web client, check for cached credential issues. If the user is in a Microsoft Entra group, it must be a security group because Azure Virtual Desktop does not support distribution groups."
  - q: "Why did a user lose their feed after a subscription change?"
    a: "Learn lists two causes: the subscription moved to another Microsoft Entra tenant, so assignments point to the old tenant and users must be reassigned, or a CSP created the subscription and transferred it, in which case you re-register Microsoft.DesktopVirtualization."
  - q: "Why does a user see a Conditional Access error when signing in?"
    a: "Learn lists two causes. The user signs in to the Windows App in a browser without access to both the Azure Virtual Desktop and Windows 365 apps, or uses Microsoft Entra single sign-on without access to the Windows Cloud Login app. Check the sign-in logs first."
  - q: "How do I reset the Windows client?"
    a: "From the app select the three dots, About, then Reset under Reset user data. From the command line run msrdcw.exe /reset in the install directory, with /f to skip confirmation. This restores default settings and unsubscribes you from all workspaces."
  - q: "Is the client troubleshooting page current?"
    a: "The Remote Desktop client for Windows page is marked archived with a last update of 2022-11-01, so check current guidance for the Windows App."
---

Most Azure Virtual Desktop client problems fall into a few groups: no feed, blocked sign-in and a misbehaving client. This article combines three Microsoft Learn pages, the troubleshooting overview, the service connections page and the Remote Desktop client for Windows page. The last one is marked archived, so its steps are older guidance.

## Start with the overview

The overview is a routing page. It lists problem areas such as networking, host pool creation, management, FSLogix and client issues, and it suggests checking the Azure status page and Azure Service Health first. It recommends Azure Virtual Desktop Insights and Log Analytics for diagnostics. It lists no error codes. Its table has symptom rows such as Remote desktop clients malfunction on start, Connected but no feed and Feed discovery problems due to the network, and points to other pages for each.

## Where else the overview points

The overview also covers help routes. It names the Azure Virtual Desktop Tech Community for reporting issues or suggesting features, and App Assure, a Microsoft service for application problems in Azure Virtual Desktop at no extra cost. For feed discovery problems caused by the network, it says users need to contact their network administrator. For virtual network and ExpressRoute settings of a session host pool, it says to open an Azure support request under the Networking category.

## No feed

Symptom: the user starts the client and signs in, but no icons appear. Fixes in the page's order:

1. Confirm the user is assigned to application groups, for example with `Get-AzRoleAssignment -SignInName <userupn>`.
2. Confirm the user signs in with the correct credentials.
3. If the web client is used, check for cached credential issues. The page gives no steps.
4. If the user is in a Microsoft Entra group, make sure it is a security group, not a distribution group.

### Feed lost after a change

- If the user's subscription moved between Microsoft Entra tenants, assignments still point to the old tenant. Reassign the users to their application groups.
- If a CSP created the subscription and transferred it to the customer, re-register the resource provider. In the Azure portal open the subscription, select **Resource provider**, find **Microsoft.DesktopVirtualization** and select **Re-register**.

## Conditional Access blocks

The page lists two causes. The user signs in to the Windows App in a browser without access to both the Azure Virtual Desktop and Windows 365 apps through Conditional Access, because the Windows App tries to authenticate to both even without a Cloud PC. Or the user signs in with Microsoft Entra single sign-on but lacks access to the Windows Cloud Login app. Check the user's Microsoft Entra sign-in logs, then follow the guide on enforcing multifactor authentication with Conditional Access for Azure Virtual Desktop.

## Windows client problems (archived page)

The Remote Desktop client for Windows page is marked archived with a last update of 2022-11-01. It covers:

- **Expected resources missing:** sign out and in with the correct account, use an InPrivate window with the web client, and confirm the application group is associated with a workspace.
- **Your account is configured to prevent you from using this device:** assign the **Virtual Machine User Login** role on the VMs.
- **The user name or password is incorrect:** check credentials, the same role, and that Conditional Access excludes MFA requirements for the **Azure Windows VM sign-in** cloud app. Per-user enabled or enforced Microsoft Entra MFA is not supported for VM sign-ins.
- **Client stops responding:** reset user data from the app, or run `msrdcw.exe /reset` in the install directory, with `/f` to skip confirmation. This unsubscribes you from all workspaces.
- **Administrator may have ended your session:** the policy **Allow users to connect remotely using Remote Desktop Services** is disabled. Enable it under Computer Configuration, Administrative Templates, Windows Components, Remote Desktop Services, Remote Desktop Session Host, Connections, using Group Policy or the Intune settings catalog.
- **Client logs:** disconnect all sessions, open `%temp%\DiagOutputDir\RdClientAutoTrace` and convert the ETL files with `tracerpt`.
- **TLS 1.2:** if it is not enabled on the local device, the page lists registry values to set.

## Not covered

The pages do not include numeric error codes, uninstall and reinstall steps, proxy checks, firewall or port requirements, session host or agent issues beyond links, or macOS, iOS, Android and web client behavior.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)

## Sources

- [Azure Virtual Desktop troubleshooting overview (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-desktop/troubleshoot-set-up-overview)
- [Troubleshoot Azure Virtual Desktop service connection (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/azure/virtual-desktop/troubleshoot-service-connection)
- [Troubleshoot the Remote Desktop client for Windows (Microsoft Learn)](https://learn.microsoft.com/previous-versions/remote-desktop-client/troubleshoot-client-windows)
