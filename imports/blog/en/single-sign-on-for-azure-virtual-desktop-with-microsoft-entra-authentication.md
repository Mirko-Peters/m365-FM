---
title: "Single sign-on for Azure Virtual Desktop with Microsoft Entra authentication"
summary: "With single sign-on, Windows on an Azure Virtual Desktop session host signs the user in with a Microsoft Entra ID token instead of a second credential prompt. It needs Microsoft Entra joined or hybrid joined session hosts, a supported Windows build and a new Entra app, Windows Cloud Login, in your Conditional Access review."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-single-sign-on, azure-virtual-desktop]
keypoints:
  - "Learn describes three authentication phases: cloud service, remote session and in-session. Single sign-on affects only the second: it lets the connection skip the session host credential prompt and sign the user in to Windows through Microsoft Entra authentication."
  - "Session hosts must be Microsoft Entra joined or Microsoft Entra hybrid joined. Hosts joined only to Microsoft Entra Domain Services or only to Active Directory Domain Services are not supported."
  - "The single sign-on page lists Windows 11 or Windows 10 Enterprise, single or multi-session, and Windows Server 2022, each with the October 2022 cumulative update (KB5018418, KB5018410, KB5018421) or later. External identities have higher minimums, including Windows Server 2025."
  - "Single sign-on adds the Windows Cloud Login app to the sign-in path, so Conditional Access, the consent dialog and, for hosts that reach domain controllers, a Kerberos server object all need a decision before you switch it on."
  - "A locked remote session is disconnected by default with single sign-on, so Conditional Access is evaluated again on reconnect. External identities require single sign-on on the host pool."
faq:
  - q: "Does single sign-on mean users never see a prompt?"
    a: "No. Learn says single sign-on skips the session host credential prompt. Users can still be asked for MFA by Conditional Access when a new token is needed, and on the first connection to a session host they see a consent dialog. Entra remembers up to 15 hosts for 30 days, and the dialog can be hidden with up to 10 device groups on the Windows Cloud Login service principal."
  - q: "Do the user's local PC and the session host both have to be joined to Entra ID?"
    a: "The session host must be Microsoft Entra joined or hybrid joined. The local Windows PC does not need to be joined to Entra ID or a domain when single sign-on is used with the Windows App. Without single sign-on, Learn describes stricter client conditions for Entra joined hosts, for example a joined or registered Windows PC or the custom RDP property targetisaadjoined:i:1."
  - q: "Can I use single sign-on with session hosts that are only joined to Active Directory Domain Services?"
    a: "Not with Microsoft Entra authentication. Learn says session hosts joined to Microsoft Entra Domain Services or to Active Directory Domain Services only are not supported. Learn's authentication overview mentions Active Directory Federation Services as a separate single sign-on route for the Windows Desktop and web clients."
---

Single sign-on for Azure Virtual Desktop lets Windows on the session host sign the user in with a Microsoft Entra ID token, so the connection skips the second credential prompt. It requires Microsoft Entra joined or Microsoft Entra hybrid joined session hosts, a supported Windows build, Entra authentication for RDP on the Windows Cloud Login service principal, and the RDP property `enablerdsaadauth` set to `1` on the host pool. This article covers what the feature changes and what has to be true first; setup and passwordless sign-in are the subject of the next article in this series.

Learn's What's new lists single sign-on using Microsoft Entra authentication as generally available since November 2023.

## Two sign-ins, and which one single sign-on replaces

Learn's [authentication overview](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication) splits a connection into three phases:

- **Cloud service authentication** is to the Azure Virtual Desktop service itself: subscribing to resources, connecting to the gateway and sending diagnostic information. It runs against Microsoft Entra ID, and Learn says this is where you can enforce Conditional Access policies.
- **Remote session authentication** is to the session host. If you have not enabled single sign-on or saved credentials locally, the user must authenticate again when launching a connection.
- **In-session authentication** happens inside the remote desktop or RemoteApp, for example in a browser or an app.

Single sign-on works on the second phase only. Learn says it "allows the connection to skip the session host credential prompt and automatically sign the user in to Windows through Microsoft Entra authentication", and recommends enabling it for hosts that are Entra joined or hybrid joined. Without it, "the client prompts users for their session host credentials for every connection", and the only way to avoid that is to save credentials in the client, which Learn advises doing only on secure devices.

| | Without single sign-on | With Microsoft Entra single sign-on |
|---|---|---|
| Session host sign-in | Credential prompt on every connection, unless saved in the client | Windows signs the user in with a Microsoft Entra ID token |
| Methods usable at the session host | Smart card (including Windows Hello for Business certificate trust) or password | Any method that works for the cloud service phase, according to Learn's table, plus smart card and password |
| Local Windows PC | Windows Desktop client, Entra joined session host: the PC must be Entra joined, hybrid joined or registered, or the host pool needs `targetisaadjoined:i:1` | With the Windows App, does not need to be joined to Entra ID or a domain |

The "any method" row comes from Learn's per-phase credential table, which says the remote session phase supports any cloud service method when configured with single sign-on. Passwordless setup is covered in the next article.

## What a connection looks like with single sign-on

Single sign-on does not remove Entra authentication; the same Microsoft Entra identity is used for the session host sign-in. Learn says the token "enables the use of passwordless authentication and third-party identity providers that federate with Microsoft Entra ID when connecting to a session host" and also gives Entra-based resources inside the session a single sign-in experience.

Two behaviors are new to users:

1. **A consent dialog.** On the first connection to a session host, users see a dialog asking them to allow the Remote Desktop connection. Learn says Entra remembers up to 15 hosts for 30 days before prompting again. You can hide it by adding up to 10 device groups to the Windows Cloud Login service principal. Learn suggests a dynamic group of session hosts, which requires Microsoft Entra ID P1 or Intune for Education.
2. **Disconnect on lock.** With single sign-on, a locked remote session is disconnected by default. The user gets a dialog and can choose **Reconnect**. Learn lists the effect: Conditional Access, including multifactor authentication and sign-in frequency, is reevaluated at reconnect, and you can require multifactor authentication to return to the session, which prevents unlocking with a simple user name and password. Disconnecting is necessary for full support of passkeys and FIDO2 devices. For legacy authentication the default is the remote lock screen. Changing the behavior in Intune (**Disconnect remote session on lock for Microsoft identity platform authentication**) needs Windows 11 with KB5037770, Windows 10 21H2 or later with KB5039211, or Windows Server 2022 with KB5037782, or later; restart the session hosts after the policy applies.

## Requirements that decide whether you can use it

| Area | What the single sign-on page requires |
|---|---|
| Session host join | Microsoft Entra joined or Microsoft Entra hybrid joined. Hosts joined to Microsoft Entra Domain Services or to Active Directory Domain Services only are not supported |
| Windows 11 | Enterprise single or multi-session with the 2022-10 cumulative update (KB5018418) or later |
| Windows 10 | Enterprise single or multi-session with the 2022-10 cumulative update (KB5018410) or later |
| Windows Server | Windows Server 2022 with the 2022-10 cumulative update (KB5018421) or later |
| Service principal | Microsoft Entra authentication for RDP enabled on **Windows Cloud Login** (application ID `270efc09-cd0d-444b-a71f-39af4910ec45`) |
| Host pool | RDP property `enablerdsaadauth` set to `1`, or the portal setting **Microsoft Entra single sign-on** |
| Hybrid joined hosts in another domain | A two-way trust between the host's domain and the user's domain; without it, connections fall back to older authentication protocols |
| Clients | Windows App on Windows (all versions), macOS 10.9.10 or later, iOS and iPadOS 10.5.2 or later, and web browsers; Learn also lists the Remote Desktop client on several platforms |
| Admin role for setup | Application Administrator or Cloud Application Administrator, or equivalent |

The single sign-on page does not name Windows Server 2025. The authentication overview names it, with Windows 11 24H2, for external identities (see below).

The Entra joined host itself has its own prerequisites that single sign-on does not replace. For host pools without a session host configuration, Learn says to assign users the **Virtual Machine User Login** role, and administrators the **Virtual Machine Administrator Login** role, on the VMs, the resource group or the subscription; Learn recommends the resource group with a user group. For host pools that use a session host configuration, this additional role assignment is not required. See [Microsoft Entra joined session hosts](/entity/avd-entra-join/) for the join model.

## The Kerberos server object

Whether you need a Kerberos server object depends on what the hosts must reach. Learn says to create one if the session host is Microsoft Entra hybrid joined, because it is needed to authenticate to a domain controller, or if the host is Microsoft Entra joined and the environment has Active Directory domain controllers, because it is needed for SMB shares and Windows-integrated authentication to websites.

If you enable single sign-on on hybrid joined hosts without the object, Learn says one of two things can happen: an error that "the specific session doesn't exist", or the single sign-on step is skipped and a standard authentication dialog appears. The fix is to create the object and connect again. An Entra joined environment with no domain controllers falls under neither condition. For the background, see [Microsoft Entra Kerberos](/entity/microsoft-entra-kerberos/).

Learn adds a caution: the default Password Replication Policy on read-only domain controllers denies password replication for members of Domain Admins and Administrators. That can keep prompting those accounts for credentials and prevents them from reaching on-premises Kerberos resources from Entra joined hosts. Learn does not recommend connecting with a domain administrator account for security reasons; it suggests Run as administrator or `runas` instead.

## Conditional Access and the new app

Single sign-on adds the Windows Cloud Login app to the sign-in path. A Conditional Access policy that covers only the Azure Virtual Desktop app does not govern the session host sign-in. Learn's single sign-on page points to its MFA article for the recommended two-policy structure and the common misconfigurations, and to a troubleshooting page for repeated prompts. See [Conditional Access](/entity/conditional-access/) for the feature. The article "Conditional Access for Azure Virtual Desktop: policies that work" walks through the policy design; the point here is that the review is part of the prerequisites, and Learn lists it as one of five required tasks: enable Entra authentication for RDP, hide the consent dialog, create a Kerberos server object if Active Directory is part of the environment, review Conditional Access, and configure the host pool.

## Limits and neighbouring features

- **Not for Domain Services or AD DS-only hosts.** The join rule above excludes them. Learn's authentication overview names Active Directory Federation Services as a separate route: "Azure Virtual Desktop also supports SSO using Active Directory Federation Services (AD FS) for the Windows Desktop and web clients." Learn's overview links to a separate AD FS single sign-on page.
- **Windows Hello for Business and smart cards need Kerberos.** Learn says Azure Virtual Desktop supports NTLM and Kerberos for session host authentication, but smart card and Windows Hello for Business can only use Kerberos to sign in. To get tickets, the client needs line of sight to a domain controller through the corporate network, a VPN or a KDC Proxy server.
- **In-session passwordless is a separate switch.** Learn's default is that WebAuthn requests from the remote session are redirected to the local computer, controlled by the host pool setting WebAuthn redirection; the most restrictive setting wins if Intune or Group Policy also set it.
- **External identities.** Learn's single sign-on page says that if you provide resources to external identities, you must enable single sign-on for the host pool. Learn's authentication overview adds that the session host must be Entra joined and run Windows 11 Enterprise 24H2 or later with the 2025-09 update (KB5065789) or later, or Windows Server 2025 with the 2026-01 update (KB5073379) or later. External identities cannot use Kerberos or NTLM to reach on-premises resources.

## A quick check before you enable it

1. List the session hosts by join type. Anything joined only to Domain Services or AD DS needs another route or a change of join type.
2. Check build levels against KB5018418, KB5018410 or KB5018421, or later.
3. Decide whether hosts need domain controller access. If yes, plan the Kerberos server object.
4. Review every Conditional Access policy that targets All cloud apps, and plan one policy each for Azure Virtual Desktop and Windows Cloud Login, as Learn's MFA article recommends.
5. Decide how to handle the consent dialog and which device group will hold the session hosts.
6. Decide the lock behavior and plan the restart after applying the Intune policy.

When prompts appear is covered in "MFA for Azure Virtual Desktop users: what prompts when".

## Related

- [Single sign-on (Azure Virtual Desktop)](/entity/avd-single-sign-on/)
- [Azure Virtual Desktop](/entity/azure-virtual-desktop/)
- [Microsoft Entra ID](/entity/entra-id/)
- [Microsoft Entra hybrid join](/entity/hybrid-entra-join/)
- [Windows App](/entity/windows-app/)

## Sources

All retrieved on 17 November 2026.

- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts)
- [Microsoft Learn: Configure the session lock behavior](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-session-lock-behavior)
- [Microsoft Learn: Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Microsoft Learn: Troubleshoot single sign-on and Conditional Access for Azure Virtual Desktop](https://learn.microsoft.com/en-us/troubleshoot/azure/virtual-desktop/troubleshoot-sso-conditional-access)
- [Microsoft Learn: Configure WebAuthn redirection over the Remote Desktop Protocol](https://learn.microsoft.com/en-us/azure/virtual-desktop/redirection-configure-webauthn)
