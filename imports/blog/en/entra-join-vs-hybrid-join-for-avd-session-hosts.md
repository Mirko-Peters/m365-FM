---
title: "Entra join vs hybrid join for AVD session hosts"
summary: "Join session hosts to Microsoft Entra ID when users are cloud or hybrid identities and nothing in the session needs Group Policy or machine authentication. Use Microsoft Entra hybrid join when session hosts must stay in Active Directory, and plan line of sight to a domain controller."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-entra-join, azure-virtual-desktop]
keypoints:
  - "Learn lets you join Azure Virtual Desktop session hosts to the same Microsoft Entra tenant or to an Active Directory domain. An Entra joined host needs no domain controller to deploy or to sign in, while a hybrid joined device needs periodic line of sight to one."
  - "Entra joined devices are managed through MDM such as Intune; Learn says Group Policy is not supported on them. Hybrid joined devices can use Group Policy, Configuration Manager or Intune."
  - "Cloud-only users need Entra joined hosts. External identities also need an Entra joined session host. If users also exist in AD DS, their accounts must be hybrid identities with a matching UPN or SID."
  - "Keep one join type per host pool. Learn says Entra joined VMs should only be paired with other Entra joined VMs, and vice versa."
  - "Check three things before you choose: apps that rely on machine authentication, the profile storage and identity route for FSLogix, and how the host pool is created (standard management or session host configuration)."
faq:
  - q: "Do Entra joined session hosts need a domain controller?"
    a: "Not to deploy or to sign in. Learn says you do not need an Active Directory to deploy or access Microsoft Entra joined VMs, but you need an Active Directory and line of sight to it to reach on-premises resources from those VMs. For FSLogix on Azure Files with Microsoft Entra Kerberos, session hosts need no line of sight to a domain controller, although a system with line of sight is needed to configure share permissions."
  - q: "Can I mix Entra joined and hybrid joined session hosts in one host pool?"
    a: "Learn advises against it. Its Entra joined session hosts article says Entra joined VMs should only be paired with other Entra joined VMs, and vice versa. Learn's pages on this topic do not describe converting a host in place; our reading is that the clean route is new session hosts of the other join type, in a new host pool if you use session host configuration."
  - q: "Is hybrid join still a supported option for Azure Virtual Desktop?"
    a: "Yes. Learn's deployment article names Microsoft Entra hybrid join and gives the extra permissions needed to join hosts that way. For Azure Virtual Desktop on Azure Local, Learn says session hosts can only join an AD DS domain, which includes Microsoft Entra hybrid join."
---

Join session hosts to Microsoft Entra ID when your users are cloud or hybrid identities and nothing inside the session depends on Group Policy or machine authentication. Use Microsoft Entra hybrid join when the hosts must stay in Active Directory, accept the line-of-sight requirement to a domain controller, and manage the hosts the way you manage other domain members.

This guide compares the two options for [session hosts](/entity/avd-session-host/) in [Azure Virtual Desktop](/entity/azure-virtual-desktop/). It does not repeat the single sign-on setup or the sign-in checklist from neighbouring articles. Domain Services is covered in the [Entra Domain Services comparison](/entity/entra-domain-services/) and the Entra join basics under [Microsoft Entra joined session hosts](/entity/avd-entra-join/).

## What each option means

Microsoft Learn's prerequisites page says session hosts must join the same Microsoft Entra tenant as the users, or an Active Directory domain (AD DS or Microsoft Entra Domain Services). Microsoft Entra ID always authenticates users for Azure Virtual Desktop, whichever join type you pick.

- **Microsoft Entra joined:** the host is joined only to [Microsoft Entra ID](/entity/entra-id/). Learn says this runs session hosts without line of sight to a domain controller and without deploying Domain Services, and that in some cases no domain controller is needed at all.
- **Microsoft Entra hybrid joined:** the host is [joined to on-premises Active Directory](/entity/hybrid-entra-join/) and also registered in Entra ID. Learn says these devices require periodic network line of sight to your domain controllers, and "without this connection, devices become unusable."

Entra join does not cut the cord to Active Directory completely. Learn says that to reach on-premises resources from an Entra joined VM you still need an Active Directory and line of sight to it. SSO to on-premises network shares and legacy-protocol apps works "if the device has access to a domain controller."

## Side-by-side comparison

| Question | Microsoft Entra joined | Microsoft Entra hybrid joined |
|---|---|---|
| Domain controller needed to deploy | No | Yes, the join is an Active Directory domain join |
| Line of sight to a domain controller at run time | Only for on-premises resources | Required periodically |
| Cloud-only users | Supported | Users must be hybrid identities |
| External identities | Supported when the host is Entra joined and SSO is configured | Not supported |
| Group Policy | Not supported | Supported |
| Intune | Automatic enrolment option in the portal | Enrol through Group Policy or Configuration Manager co-management |
| Apps relying on machine authentication | Not supported | Named by Learn as a reason to choose hybrid join |
| Azure Virtual Desktop on Azure Local | Not an option; Learn allows only AD DS join | Allowed; Learn says AD DS join includes hybrid join |
| SSO with Entra authentication | Supported | Supported, with a Kerberos server object |

The Learn pages behind each row appear in Sources. The hybrid join page lists Win32 apps that rely on Active Directory machine authentication, and continued use of Group Policy and existing imaging, among its reasons to choose that route.

## Decision checklist

1. **List the users.** If any user exists only in Entra ID, the hosts must be Entra joined; Learn's authentication article says cloud-only identities are supported with Entra joined VMs. External (B2B) identities also need an Entra joined host, running Windows 11 Enterprise 24H2 or later with KB5065789 (September 2025) or later, or Windows Server 2025 with KB5073379 (January 2026) or later, and single sign-on on the host pool.
2. **List the apps.** Learn says Entra joined devices do not support on-premises applications that rely on machine authentication, or RADIUS authentication using an on-premises computer object and certificate. If you cannot retire or replace those apps, stay with hybrid join.
3. **List the policies.** Learn says Group Policy is not supported on Entra joined devices and recommends evaluating GPO and MDM policy parity with Group Policy analytics in Intune. Many settings have an Intune equivalent, but each unmatched setting is a reason to stay with hybrid join.
4. **Check the platform.** If the pool runs on Azure Local, Learn says session hosts can only join an AD DS domain, which includes Microsoft Entra hybrid join.
5. **Check the network.** If the hosts cannot reliably reach a domain controller, hybrid joined hosts "become unusable" per Learn. Entra joined hosts do not have that dependency unless the session needs on-premises resources.
6. **Decide one join type per host pool** and keep it.

## Deployment differences

**Entra join.** In the portal's host pool creation flow, the Virtual machines tab lets you select Microsoft Entra ID or Active Directory. Selecting Microsoft Entra ID offers automatic Intune enrolment, and joins VMs only to the same tenant as the subscription. For host pools without a session host configuration, assign **Virtual Machine User Login** to users and **Virtual Machine Administrator Login** to administrators who need local administrative rights. Learn recommends assigning the user role at resource group level, using the same user group as the application group.

**Hybrid join.** Joining to Active Directory or using hybrid join needs additional permissions. On the OU that holds the session hosts, the domain join account needs reset password, validated write to DNS host name, validated write to service principal name, read account restrictions and write account restrictions on descendant computer objects. The account cannot have multifactor authentication enabled. On the Entra side, Learn's hybrid join article lists Microsoft Entra Connect version 1.1.819.0 or later, default device attributes not excluded from sync, the computer OUs in sync scope, Hybrid Identity Administrator and Enterprise administrator credentials, and a service connection point configured per forest. Devices must reach `enterpriseregistration.windows.net`, `login.microsoftonline.com` and `device.login.microsoftonline.com`. Learn's hybrid join concept page adds that Microsoft Entra Cloud Sync can synchronize computer objects for hybrid join.

**Session host configuration.** There is a documented gap. The deployment article describes the Session hosts tab of a session host configuration with an Active Directory option and a key vault that holds the domain join account secrets, and does not describe a Microsoft Entra ID option there. The Entra joined article says the extra role assignment is not required for host pools that use a session host configuration. The two pages do not say outright whether Entra join is selectable in that flow. Check the portal in your tenant before you design around it. Session host configuration belongs to enhanced host pool management: Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. The management approach is chosen at host pool creation and cannot be changed afterwards.

## Sign-in and single sign-on

Both join types support single sign-on with Microsoft Entra authentication. Learn's single sign-on page lists "Microsoft Entra joined, or Microsoft Entra hybrid joined" and says hosts joined only to AD DS or only to Domain Services are not supported.

Two differences matter:

- On **hybrid joined** hosts a Kerberos server object is needed to complete authentication to a domain controller. Without it, Learn says you may see "the specific session doesn't exist" or a standard authentication dialog that skips SSO.
- On **Entra joined** hosts in an environment with AD domain controllers, the same object is needed to reach on-premises resources such as SMB shares or Windows-integrated websites.

If hybrid joined hosts sit in a different AD domain than the user accounts, Learn requires a two-way trust between the domains.

Without SSO, the client condition differs by join type of the local PC, not the host. When the local PC is not Entra joined, hybrid joined or registered, add the RDP property `targetisaadjoined:i:1` to the host pool, which limits sign-in to username and password. Web, Android, macOS and iOS clients need the same property.

## Profiles with FSLogix

Both options work with [FSLogix](/entity/fslogix/) on Azure Files, with different identity routes.

- **Hybrid joined hosts** use Azure Files with AD DS or Domain Services authentication, or Entra Kerberos with hybrid identities.
- **Entra joined hosts** use [Microsoft Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/). Learn's prerequisites page says that when you join session hosts to Entra ID, you store profiles on Azure Files or Azure NetApp Files and your user accounts must be hybrid identities, created in AD DS and synchronized.

Learn's pages differ on cloud-only users. The Entra joined article's introduction says Azure Files access for hybrid, cloud-only and external identities is fully supported, while its User profiles section mentions hybrid accounts only. The profile container article documents cloud-only identities with extra steps: the `kdc_enable_cloud_group_sids` tag in the app manifest, and support in the Azure public cloud only. It does not label that status as preview or GA. Plan for hybrid identities if you need certainty, and test cloud-only on a pilot pool.

Storage accounts cannot authenticate with both Entra ID and a second method such as AD DS or Domain Services. Pick one per storage account. With Entra Kerberos, clients must be Entra joined or hybrid joined; AD-only and Domain Services joined clients are excluded.

## Management after the join

Entra joined hosts are managed through MDM. Learn's Intune multi-session page describes the Entra joined route as enrolment by enabling "Enroll the VM with Intune" in the portal. For hybrid joined hosts, Intune enrolment uses Active Directory Group Policy or Configuration Manager co-management. Windows Enterprise multi-session VMs must be enrolled with device credentials, not user credentials, and the Azure Virtual Desktop agent must be version 1.0.2944.1400 or later. The page also lists limits: Windows update ring policies and RemoteApp or MSIX app attach are not supported with Intune for multi-session, and Intune supports only VMs provisioned as part of a host pool. If you join hosts to Domain Services, you cannot manage them with Intune.

## When to choose which

Choose **Entra join** when users are cloud-only or external, when the hosts have no reliable path to a domain controller, when you want to retire AD for these workloads, and when your configuration moves to Intune. Choose **hybrid join** when machine-authenticated apps, Group Policy, existing imaging or an Azure Local pool keep you tied to Active Directory. Learn's Entra join page lists reasons to consider Entra join, such as managing devices with a cloud solution; its hybrid join page lists keeping Group Policy and existing imaging among reasons to choose that route. Learn does not state a general preference for one over the other.

## Sources

All pages retrieved on 17 November 2026.

- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Create a profile container with Azure Files and Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-profile-container-azure-ad)
- [Microsoft Learn: Microsoft Entra hybrid joined devices](https://learn.microsoft.com/en-us/entra/identity/devices/concept-hybrid-join)
- [Microsoft Learn: Configure Microsoft Entra hybrid join](https://learn.microsoft.com/en-us/entra/identity/devices/how-to-hybrid-join)
- [Microsoft Learn: Microsoft Entra joined devices](https://learn.microsoft.com/en-us/entra/identity/devices/concept-directory-join)
- [Microsoft Learn: Plan your Microsoft Entra join implementation](https://learn.microsoft.com/en-us/entra/identity/devices/device-join-plan)
- [Microsoft Learn: Microsoft Intune with Azure Virtual Desktop multi-session](https://learn.microsoft.com/en-us/mem/intune/fundamentals/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Enable Microsoft Entra Kerberos for hybrid identities on Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-hybrid-identities-enable)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
