---
title: "Azure Virtual Desktop Client Connection Errors: No Feed, Sign-In and Client Fixes"
summary: "Troubleshoot Azure Virtual Desktop client problems using Microsoft Learn: no feed, lost feed after a subscription move, Conditional Access blocks, AD FS sign-in failures, client resets and log collection, with the age of the client page flagged."
status: review
publish: false
author: mirko-p
date: 2026-12-26
topics: [azure-virtual-desktop]
keypoints:
  - "For no feed, confirm the user's application group assignment, the credentials and that any Entra group is a security group, because distribution groups are not supported."
  - "After a subscription moves tenants or a CSP transfer, reassign users or re-register the Microsoft.DesktopVirtualization resource provider."
  - "For AD FS sign-in failures, the page says to set PromptLoginBehavior to nativeSupport for the federated domain."
  - "The Remote Desktop client for Windows page is marked archived with a last update in 2022, so treat its fixes as older guidance."
  - "The pages list no numeric error codes. They give message text and fixes in a fixed order."
faq:
  - q: "What do I check first when users see no feed?"
    a: "According to Microsoft Learn, confirm the user is assigned to application groups, check the credentials and, for the web client, check for cached credential issues. If the user is in a Microsoft Entra group, it must be a security group because Azure Virtual Desktop does not support distribution groups."
  - q: "Why did a user lose their feed after a subscription change?"
    a: "Learn lists two causes: the subscription moved to another Microsoft Entra tenant, so assignments point to the old tenant and users must be reassigned, or a CSP created the subscription and transferred it, in which case you re-register Microsoft.DesktopVirtualization."
  - q: "How do I fix AD FS sign-in failures with the Windows App?"
    a: "Learn says the Windows App sends prompt=login and that, if PromptLoginBehavior is unset on the federated domain, sign-in can fail with MSIS7102. Set PromptLoginBehavior to nativeSupport in the domain federation configuration."
  - q: "How do I reset the Windows client?"
    a: "From the app select the three dots, About, then Reset under Reset user data. From the command line run msrdcw.exe /reset in the install directory, with /f to skip confirmation. This restores default settings and unsubscribes you from all workspaces."
  - q: "Is the client troubleshooting page current?"
    a: "The Remote Desktop client for Windows page is marked archived with a last update of 2022-11-01, so check current guidance for the Windows App."
---

Most Azure Virtual Desktop client problems fall into a few groups: no feed, blocked sign-in and a misbehaving client. This article combines three Microsoft Learn pages, the troubleshooting overview, the service connections page and the Remote Desktop client for Windows page. The last one is marked archived, so its steps are older guidance.

## Start with the overview

The overview is a routing page. It lists problem areas such as networking, host pool creation, management, FSLogix and client issues, and it suggests checking the Azure status page and Azure Service Health first. It recommends Azure Virtual Desktop Insights and Log Analytics for diagnostics. It lists no error codes. The only symptom it names explicitly is Connected but no feed.

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

## AD FS sign-in fails

Symptom: sign-in fails after the redirect to AD FS, and AD FS event logs may show `MSIS7102: Requested Authentication Method is not supported on the STS`. The Windows App sends `prompt=login`, and if the federated domain's `PromptLoginBehavior` is unset, Microsoft Entra ID may translate it into a password authentication request the AD FS environment does not support. Set `PromptLoginBehavior` to `nativeSupport` in the domain federation configuration. The page gives no command and no list of supported AD FS versions.

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

- [Troubleshoot Azure Virtual Desktop](https://learn.microsoft.com/azure/virtual-desktop/troubleshoot-set-up-overview)
- [Troubleshoot Azure Virtual Desktop service connections](https://learn.microsoft.com/troubleshoot/azure/virtual-desktop/troubleshoot-service-connection)
- [Troubleshoot the Remote Desktop client for Windows](https://learn.microsoft.com/azure/virtual-desktop/troubleshoot-client-windows)
