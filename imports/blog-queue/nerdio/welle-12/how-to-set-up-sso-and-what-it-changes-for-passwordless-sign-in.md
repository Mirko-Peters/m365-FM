---
title: "How to set up SSO and what it changes for passwordless sign-in"
summary: "Setting up Microsoft Entra single sign-on for Azure Virtual Desktop takes five tasks. Afterwards, passwordless methods used at cloud sign-in carry into the session; in-session passkeys depend on WebAuthn redirection."
status: review
publish: false
author: mirko-p
date: 2026-11-18
render: v2
topics: [avd-single-sign-on, azure-virtual-desktop]
keypoints:
  - "Five tasks: enable Entra authentication for RDP on Windows Cloud Login, hide the consent dialog, create a Kerberos server object if AD is involved, review Conditional Access, set enablerdsaadauth:i:1."
  - "With single sign-on, the remote session phase accepts any method that works for cloud sign-in, including passwordless ones. Without it, Learn's table lists only smart card and password for that phase."
  - "Passkeys and FIDO2 devices need the session to disconnect on lock. The remote lock screen does not support them, and with single sign-on disconnect is the default."
  - "Passwordless sign-in inside the session is separate: WebAuthn requests are redirected to the local device (redirectwebauthn, default 1). Windows App on macOS, iOS and Android is in preview."
  - "Use Conditional Access, not per-user MFA, with a separate Windows Cloud Login policy. Use the same sign-in frequency on both, or equal or longer on Windows Cloud Login, to avoid repeated prompts."
faq:
  - q: "Do I need to change anything for users to use passkeys or Windows Hello for Business after I enable single sign-on?"
    a: "For signing in to the session host, no separate switch: Learn says the remote session phase accepts any cloud-service method when single sign-on is configured. For signing in to apps and sites inside the session, WebAuthn requests must be redirected to the local device, which is the host pool default, and the user must be on a client that supports it."
  - q: "Why do users get prompted again after locking the session?"
    a: "Learn's troubleshooting page names a host pool that is not set to disconnect on lock as the cause. With single sign-on the default is to disconnect, so check whether the Intune setting Disconnect remote session on lock for Microsoft identity platform authentication was set to Disabled, and restart the hosts after a change."
  - q: "Is single sign-on generally available?"
    a: "Yes. Learn's What's new lists single sign-on using Microsoft Entra authentication, and in-session passwordless authentication, as generally available in November 2023. In-session passwordless on the Windows App for macOS, iOS and Android is listed as preview in 2026 entries."
---

Setting up single sign-on for Azure Virtual Desktop means completing five tasks: enable Microsoft Entra authentication for RDP on the Windows Cloud Login app, hide the consent dialog, create a Kerberos server object if Active Directory is part of the environment, review Conditional Access, and set the host pool to use Microsoft Entra single sign-on. After that, any method a user can use to sign in to the cloud service, including passwordless ones, also signs them in to the session host. Passkeys and Windows Hello for Business inside the session are a separate path that depends on WebAuthn redirection.

[Single sign-on](https://www.m365.fm/entity/avd-single-sign-on/) is generally available; Learn's What's new dates this to November 2023. This article is the how-to. The concept, the supported join types and the minimum Windows builds are in "Single sign-on for Azure Virtual Desktop with Microsoft Entra authentication", and the Conditional Access policy design is in "Conditional Access for Azure Virtual Desktop: policies that work".

## What you need first

- An Entra role of Application Administrator or Cloud Application Administrator, or equivalent.
- Session hosts that are Microsoft Entra joined or hybrid joined, on a supported build (companion article).
- A decision on session lock behavior (step 5), because it affects passkeys.

Learn advises against connecting with domain administrator accounts, because the default Password Replication Policy on read-only domain controllers denies their replication and can cause repeated prompts. Use a non-administrator account with **Run as administrator** or `runas`.

## Setup steps

1. **Enable Microsoft Entra authentication for RDP.** In the Azure portal, open **Microsoft Entra ID**, select **Devices**, then **Remote connection configuration**, and select **Windows Cloud Login** (application ID `270efc09-cd0d-444b-a71f-39af4910ec45`). Choose the option to enable the Microsoft Entra ID authentication protocol to authenticate users to remote devices, and select **Save**. In Graph terms, this sets `isRemoteDesktopProtocolEnabled` to `true` on the service principal's `remoteDesktopSecurityConfiguration`.

2. **Hide the consent dialog.** By default, users see a dialog to allow the Remote Desktop connection when they connect to a new session host, and Entra remembers up to 15 hosts for 30 days. To hide it, create a dynamic device group that contains your session hosts. On the same **Windows Cloud Login** page, select the link under **Target device groups to enable SSO** and add the group; you can add up to 10 groups. Learn notes that dynamic groups usually update within 5 to 10 minutes, up to 24 hours in large tenants, and need Microsoft Entra ID P1 or Intune for Education.

3. **Create a Kerberos server object if you have domain controllers.** You need it for hybrid joined hosts, and for Entra joined hosts when the environment has domain controllers and users reach SMB shares or Windows-integrated websites. Learn points to the passwordless security key article for the procedure. It uses the `AzureADHybridAuthenticationManagement` module, run as administrator on the Microsoft Entra Connect server or a server with the required dependency, in each domain and forest that contains Entra users:

   ```powershell
   Install-Module -Name AzureADHybridAuthenticationManagement -AllowClobber
   $domain = $env:USERDNSDOMAIN
   $userPrincipalName = "administrator@contoso.onmicrosoft.com"
   $domainCred = Get-Credential
   Set-AzureADKerberosServer -Domain $domain -UserPrincipalName $userPrincipalName -DomainCredential $domainCred
   ```

   The cloud account needs the Hybrid Identity Administrator role, and the domain account must be in Domain Admins and Enterprise Admins. Without it on hybrid joined hosts, users may see an error that the specific session does not exist, or get a standard credential dialog instead of single sign-on. See [Microsoft Entra Kerberos](https://www.m365.fm/entity/microsoft-entra-kerberos/).

4. **Review Conditional Access.** Single sign-on adds Windows Cloud Login to the sign-in path. Learn recommends two policies: one for **Azure Virtual Desktop** (`9cdead84-a844-4324-93f2-b2e6bb768d07`) and one for **Windows Cloud Login**, both requiring MFA. Do not add the Azure Virtual Desktop Azure Resource Manager Provider app, and do not block the Windows 365 app, which the Windows App uses. Set sign-in frequency to the same value on both, or set the Windows Cloud Login policy to match or exceed the Azure Virtual Desktop one. The option **Every time** is supported only on Windows Cloud Login; on the Azure Virtual Desktop app it causes constant prompts on feed refresh and diagnostics upload. Disable per-user MFA for these users and enforce MFA through [Conditional Access](https://www.m365.fm/entity/conditional-access/) only. For Entra joined hosts, connections require the legacy per-user MFA sign-in method to be off, and if you do not want to limit sign-in to strong methods such as Windows Hello for Business, exclude the **Azure Windows VM Sign-In** app from the policy.

5. **Choose the lock behavior.** With single sign-on, a locked session disconnects by default. To change it in Intune, create a **Settings catalog** profile for Windows 10 and later, browse to **Administrative templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Security**, and set **Disconnect remote session on lock for Microsoft identity platform authentication** (Enabled disconnects, Disabled shows the remote lock screen). The setting needs Windows 11 with KB5037770, Windows 10 21H2 or later with KB5039211, or Windows Server 2022 with KB5037782, or later. Restart the session hosts after the policy applies.

6. **Turn it on for the host pool.** In the Azure portal, open the host pool and set **Microsoft Entra single sign-on** to the option stating that connections will use Microsoft Entra authentication to provide single sign-on. This corresponds to the RDP property `enablerdsaadauth:i:1`; its default is `0`. Learn's property list says it replaces `targetisaadjoined`. After a change, users need to refresh their resources to receive it.

7. **Test.** Connect with the Windows App. Then open **Identity > Monitoring & health > Sign-in logs** in Entra and confirm that the Azure Virtual Desktop and Windows Cloud Login entries both show **Success** with the expected policies applied.

For Entra joined hosts in host pools without a session host configuration, users also need the **Virtual Machine User Login** role (or **Virtual Machine Administrator Login** for local admin rights) on the VMs, resource group or subscription. Host pools that use a session host configuration do not need this assignment. See [Microsoft Entra joined session hosts](https://www.m365.fm/entity/avd-entra-join/).

## What changes for passwordless sign-in

Learn splits authentication into three phases. Single sign-on changes the second.

| Phase | Methods Learn lists |
|---|---|
| Cloud service (to the Azure Virtual Desktop service) | Passwordless, including FIDO security keys and Windows Hello for Business with Cloud Kerberos or Key trust; federation to a third-party identity provider; smart card; password |
| Remote session (to the session host) | Any cloud-service method when configured with single sign-on; smart card; password |
| In-session (to apps and sites inside the session) | Passwordless when configured for in-session passwordless; smart card; password |

Without single sign-on, the remote session column offers only smart card and password, and the client prompts for session host credentials on every connection unless the user saves them. Learn's Windows App comparison shows the same for passkeys: with single sign-on disabled, passkeys and Microsoft Authenticator are not available for remote session sign-in on any listed platform, while the cloud service phase supports them.

A user who signs in to the service with a passkey, [Windows Hello for Business](https://www.m365.fm/entity/windows-hello-for-business/) or Authenticator is carried through to Windows on the session host with the Entra token, with no second password.

### Disconnect on lock is what keeps passkeys working

Learn says disconnecting on lock is required for full support of passkeys and [FIDO2](https://www.m365.fm/entity/fido2/) devices, because the remote lock screen does not support them. The same default re-evaluates Conditional Access, including MFA and sign-in frequency, when the user reconnects. If users are asked for full credentials after a manual or idle lock, Learn's troubleshooting page names a host pool that is not configured to disconnect on lock as the cause.

### In-session passwordless is a separate setting

Passkeys, Windows Hello for Business or a security key used to sign in to a site or app inside the remote session travel through WebAuthn redirection, which sends WebAuthn requests from the session to the local device.

- **Default:** the host pool RDP property `redirectwebauthn:i:1` redirects requests. Set it to `0` to keep them in the session. In the portal, the setting is **WebAuthn redirection** under **RDP Properties > Device redirection**.
- **Session host policy:** the Intune setting is **Do not allow WebAuthn redirection** under **Administrative templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Device and Resource Redirection**, where Enabled disables redirection. Restart the machines afterwards. The most restrictive setting wins: disabling it on the host overrides the host pool property.
- **Client:** Learn says in-session passwordless works with the [Windows App](https://www.m365.fm/entity/windows-app/), and enables automatically on session hosts and local PCs with Windows 11 KB5018418, Windows 10 KB5018410 or Windows Server 2022 KB5018421, or later.
- **Entra side:** to use Windows Hello for Business or security devices with Microsoft Entra resources, Learn says to enable the FIDO2 security key method for users.
- **Test:** in the session, open a WebAuthn-enabled site such as `https://windows.cloud.microsoft/` in an InPrivate window and look for a Windows Security prompt on the local device.

| Client | WebAuthn redirection (Windows App), per Learn's comparison |
|---|---|
| Windows | Supported |
| macOS | Preview, version 11.4.2 or later |
| iOS | Preview, version 11.3.7 or later |
| Android | Preview, version 11.0.0.119 or later; passkeys must be in a software provider such as Microsoft Authenticator, no physical keys or QR codes |
| Web browser | Not supported |

On the preview platforms, Learn limits redirection to Windows 365 and Azure Virtual Desktop connections and to passkey sign-ins to Entra ID. Check the comparison page before a rollout.

### Kerberos still matters for smart cards and Windows Hello

Learn says session host authentication supports NTLM and Kerberos, but smart card and Windows Hello for Business can only use Kerberos to sign in. The client then needs line of sight to a domain controller through the corporate network, a VPN or a KDC Proxy server.

## Errors to expect after enabling

| Symptom | Cause and fix, per Learn |
|---|---|
| Repeated prompts | Sign-in frequency differs between the two apps, or **Every time** is set on the Azure Virtual Desktop app. Use the same value on both, or an equal or longer value on Windows Cloud Login; use **Every time** on Windows Cloud Login only |
| AADSTS65001 | The user or admin has not consented to the app. Hide the consent dialog or grant admin consent for Windows Cloud Login |
| AADSTS530002 | A policy requires a compliant device and it is not. For connection-time policies the requirement applies to the client device |
| AADSTS530032 | A tenant-level control blocks sign-in, such as Security Defaults or a block policy |
| Credential prompt on hybrid joined hosts | Missing Kerberos server object. Create it and reconnect |

Start in the sign-in logs: filter by user, find the Azure Virtual Desktop and Windows Cloud Login entries, then read the Conditional Access and Authentication Details tabs.

## Related

- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources


- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Configure WebAuthn redirection over the Remote Desktop Protocol](https://learn.microsoft.com/en-us/azure/virtual-desktop/redirection-configure-webauthn)
- [Microsoft Learn: Configure the session lock behavior](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-session-lock-behavior)
- [Microsoft Learn: Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa)
- [Microsoft Learn: Troubleshoot single sign-on and Conditional Access for Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-sso-conditional-access)
- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts)
- [Microsoft Learn: Supported RDP properties](https://learn.microsoft.com/en-us/azure/virtual-desktop/rdp-properties)
- [Microsoft Learn: Customize RDP properties for a host pool](https://learn.microsoft.com/en-us/azure/virtual-desktop/customize-rdp-properties)
- [Microsoft Learn: Enable passwordless security key sign-in to on-premises resources by using Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-passwordless-security-key-on-premises)
- [Microsoft Learn: Compare Windows App features across platforms and devices](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features?pivots=azure-virtual-desktop)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
