---
title: "Entra join vs hybrid join for AVD session hosts"
summary: "Join session hosts to Microsoft Entra ID when users are cloud or hybrid identities and nothing in the session needs Group Policy or machine authentication. Use Microsoft Entra hybrid join when session hosts must stay in Active Directory, and plan line of sight to a domain controller."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-entra-join, azure-virtual-desktop]
keypoints:
  - "Learn lets you join Azure Virtual Desktop session hosts to the same Microsoft Entra tenant or to an Active Directory domain. An Entra joined host needs no domain controller to deploy or access it, while a hybrid joined device needs periodic line of sight to one."
  - "Entra joined devices are managed through MDM such as Intune; Learn says Group Policy is not supported on them. Windows Server session hosts joined to Entra cannot be enrolled in Intune, and Learn points to hybrid join with Group Policy or to local Group Policy on each host."
  - "Learn supports cloud-only identities with Entra joined VMs. External identities also need an Entra joined session host. If users also exist in AD DS, their accounts must be hybrid identities with a matching UPN or SID."
  - "Keep one join type per host pool. Learn says Entra joined VMs should only be paired with other Entra joined VMs, and vice versa."
  - "Check three things before you choose: apps that rely on machine authentication, the profile storage and identity route for FSLogix, and how the host pool is created (standard management or session host configuration)."
faq:
  - q: "Do Entra joined session hosts need a domain controller?"
    a: "Not to deploy or access them, with one exception. Learn says you do not need an Active Directory to deploy or access Microsoft Entra joined VMs, but you need an Active Directory and line of sight to it to reach on-premises resources from those VMs. The exception is smart card and Windows Hello for Business sign-in to a session host: Learn says these use Kerberos, so the client needs line of sight to a domain controller, whichever join type the hosts use. For FSLogix profile access on Azure Files with Microsoft Entra Kerberos and hybrid identities, session hosts need no line of sight to a domain controller, although a system with line of sight is needed to configure share permissions. This does not remove the periodic line of sight that a hybrid joined host needs for the join itself."
  - q: "Can I mix Entra joined and hybrid joined session hosts in one host pool?"
    a: "Learn advises against it. Its Entra joined session hosts article says Entra joined VMs should only be paired with other Entra joined VMs, and vice versa. For session host update, Learn says the new VMs must use the same directory as the existing VMs and the directory cannot change during an update. Learn does not say whether switching between Entra join and domain join counts as a change of directory, and its portal step for updating session hosts offers both Microsoft Entra and Active Directory. Test a switch on a non-production pool before you rely on it."
  - q: "Is hybrid join still a supported option for Azure Virtual Desktop?"
    a: "Yes. Learn's deployment article names Microsoft Entra hybrid join and, for host pools with a session host configuration, lists the extra permissions needed to join hosts that way. For Azure Virtual Desktop on Azure Local, Learn says session hosts can only join an AD DS domain, which includes Microsoft Entra hybrid join."
---

Join session hosts to Microsoft Entra ID when your users are cloud or hybrid identities and nothing inside the session depends on Group Policy or machine authentication. Use Microsoft Entra hybrid join when the hosts must stay in Active Directory and you accept the line-of-sight requirement to a domain controller.

This guide compares the two options for [session hosts](/entity/avd-session-host/) in [Azure Virtual Desktop](/entity/azure-virtual-desktop/). Joining to [Microsoft Entra Domain Services](/entity/entra-domain-services/) is a third route that is not compared here.

## What each option means

Microsoft Learn's prerequisites page says session hosts must join the same Microsoft Entra tenant as the users, or an Active Directory domain (AD DS or Microsoft Entra Domain Services). Microsoft Entra ID always authenticates users for Azure Virtual Desktop, whichever join type you pick.

- **Microsoft Entra joined:** the host is joined only to [Microsoft Entra ID](/entity/entra-id/). Learn says this runs session hosts without line of sight to a domain controller or Domain Services, and in some cases without any domain controller.
- **Microsoft Entra hybrid joined:** the host is [joined to on-premises Active Directory](/entity/hybrid-entra-join/) and also registered in Entra ID. Learn says these devices require periodic network line of sight to your domain controllers, and that without this connection, "devices become unusable."

## Side-by-side comparison

| Question | Microsoft Entra joined | Microsoft Entra hybrid joined |
|---|---|---|
| Domain controller needed to deploy | No | Yes, the join is an Active Directory domain join |
| Line of sight to a domain controller at run time | Only for on-premises resources; smart card and Windows Hello for Business sign-in need it for the client | Required periodically |
| Cloud-only users | Supported | Learn's identity table lists synchronized accounts only |
| External identities | Supported when the host is Entra joined and SSO is configured | Learn requires an Entra joined host |
| Group Policy | Not supported; on Windows Server hosts Learn names local Group Policy as an option | Supported |
| Intune | Automatic enrolment option in the portal; Windows Server hosts cannot be enrolled | Enrol through Group Policy or Configuration Manager co-management |
| Apps relying on machine authentication | Not supported | Named by Learn as a reason to choose hybrid join |
| Azure Virtual Desktop on Azure Local | Not an option; Learn allows only AD DS join | Allowed; Learn says AD DS join includes hybrid join |
| SSO with Entra authentication | Supported | Supported, with a Kerberos server object |

## Decision checklist

1. **List the users.** Learn's authentication article says cloud-only identities are supported with Entra joined VMs. Learn's prerequisites say that where AD DS or Domain Services is part of the deployment, user accounts must be hybrid identities, meaning synchronized. External (B2B) identities also need an Entra joined host, running Windows 11 Enterprise 24H2 or later with KB5065789 (September 2025) or later, or Windows Server 2025 with KB5073379 (January 2026) or later, and single sign-on on the host pool.
2. **List the apps.** Learn says Entra joined devices do not support on-premises applications that rely on machine authentication, or RADIUS authentication with an on-premises computer object and certificate. If you cannot replace those apps, stay with hybrid join.
3. **List the policies and the operating system.** Learn says Group Policy is not supported on Entra joined devices and recommends evaluating GPO and MDM policy parity with Group Policy analytics in Intune. For each unsupported policy, Learn asks whether it is necessary for Entra joined devices or users and whether it applies in a cloud-driven deployment. Our reading is that a policy you need and cannot replace is a reason to stay with hybrid join. If the hosts run Windows Server, Learn says Entra joined hosts cannot be enrolled in Intune and points to Microsoft Entra hybrid join with Group Policy from Active Directory, or local Group Policy on each session host.
4. **Check the platform.** On Azure Local, only an AD DS join is possible, including hybrid join.
5. **Check the network.** If the hosts cannot reliably reach a domain controller, hybrid join carries the risk described above. Entra joined hosts do not have that dependency unless the session needs on-premises resources. Smart card and Windows Hello for Business sign-in is the exception for either join type: Learn says they use Kerberos and the client needs line of sight to a domain controller.
6. **Decide one join type per host pool** and keep it.

## Deployment differences

**Entra join.** In the portal's host pool creation flow, the Virtual machines tab lets you select Microsoft Entra ID or Active Directory. Selecting Microsoft Entra ID offers automatic Intune enrolment, and joins VMs only to the same tenant as the subscription. For host pools without a session host configuration, assign **Virtual Machine User Login** to users and **Virtual Machine Administrator Login** to administrators.

**Hybrid join.** For host pools with a session host configuration, Learn says joining an Active Directory domain or using hybrid join needs an account with more permissions than a typical domain join, because the new OS image reuses the existing computer object. The deployment article lists five permissions on the OU that holds the session hosts, including reset password and write account restrictions on descendant computer objects. For any domain join, Learn's prerequisites say the account cannot have multifactor authentication enabled. On the Entra side, Learn's hybrid join article lists Microsoft Entra Connect version 1.1.819.0 or later, the computer OUs in sync scope, Hybrid Identity Administrator credentials and Enterprise administrator credentials for each forest. In the setup wizard you also configure a service connection point for each forest. Devices must reach `enterpriseregistration.windows.net`, `login.microsoftonline.com` and `device.login.microsoftonline.com`.

**Session host configuration.** Learn's pages disagree. The deployment article's portal instructions for a session host configuration say to select Active Directory and a key vault that holds the domain join account secrets, with no Microsoft Entra option, while its standard flow offers both. The article on updating session hosts says to select either Microsoft Entra or Active Directory as the directory to join. The deployment article's Azure PowerShell example for `New-AzWvdSessionHostConfiguration` is introduced as joining Microsoft Entra ID and sets `DomainInfoJoinType = 'AzureActiveDirectory'`, and the Entra joined article says the extra role assignment is not required for host pools that use a session host configuration. Our reading is that Entra join works with a session host configuration, but check the creation flow in your portal before you design around it.

Session host configuration belongs to enhanced host pool management. Microsoft announced general availability of enhanced host pool management, including dynamic autoscaling, session host configuration and update, and ephemeral OS disks, in July 2026 (Tech Community). Some Learn pages, for example the scenarios and glossary pages and the module version 5.4.2-preview, still carry preview wording; check the current page before relying on a limit. The management approach cannot be changed after creation.

## Sign-in and single sign-on

Both join types support single sign-on with Microsoft Entra authentication. Learn's single sign-on page says session hosts must be Microsoft Entra joined or Microsoft Entra hybrid joined, and that hosts joined only to AD DS or only to Domain Services are not supported.

On **hybrid joined** hosts a Kerberos server object is needed to complete authentication to a domain controller; without it, Learn says you may see "the specific session doesn't exist". On **Entra joined** hosts in an environment with AD domain controllers, the same object is needed to reach on-premises resources such as SMB shares.

Without SSO, Learn sets conditions for connecting to Entra joined VMs only. From the Windows Desktop client, the local PC must be Entra joined or hybrid joined to the same tenant, or run Windows 11 or Windows 10 version 2004 or later and be Entra registered to it; otherwise add the RDP property `targetisaadjoined:i:1` to the host pool. Web, Android, macOS and iOS clients always need it. With the property, sign-in is restricted to username and password.

## Profiles with FSLogix

Both options work with [FSLogix](/entity/fslogix/) on Azure Files through [Microsoft Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/). What differs is which identities Learn lists as supported.

- **Hybrid identities:** Learn's FSLogix article names Entra joined or hybrid joined session hosts for this route and says it works "without requiring network line-of-sight to domain controllers". That covers access to the profile share only; a hybrid joined host still needs periodic line of sight to a domain controller.
- **Entra joined hosts, prerequisites page:** Learn says that when you join session hosts to Entra ID, you store profiles on Azure Files or Azure NetApp Files and your user accounts must be hybrid identities, created in AD DS and synchronized.

Learn's pages differ on cloud-only users. The prerequisites page says the accounts must be hybrid identities. The Entra joined article's introduction says Azure Files access for hybrid, cloud-only and external identities is fully supported, while its User profiles section mentions hybrid accounts only. Learn's FSLogix article on Azure Files with Microsoft Entra ID lists cloud-only and external identities as supported in the Azure cloud only; hybrid identities are also listed for Azure Government and Azure operated by 21Vianet. The same article adds the `kdc_enable_cloud_group_sids` tag in the app manifest for cloud-only identities. Learn does not say which text takes precedence. Our reading is that the FSLogix article is the more specific source; check the pages for your cloud.

A storage account cannot use Entra ID together with a second method such as AD DS or Domain Services. With Entra Kerberos, clients must be Entra joined or hybrid joined; AD-only and Domain Services joined clients are excluded.

## Management after the join

Entra joined Windows client hosts are managed through MDM. Learn's Intune multi-session page describes the Entra joined route as enabling "Enroll the VM with Intune" in the portal. For hybrid joined hosts, enrolment uses Active Directory Group Policy or Configuration Manager co-management. Multi-session VMs must be enrolled with device credentials, and the agent must be version 1.0.2944.1400 or later. Update ring policies and RemoteApp or MSIX app attach are not supported with Intune for multi-session. Learn's prerequisites add that Domain Services hosts cannot be managed with Intune.

## When to choose which

Choose **Entra join** when users are cloud-only or external, when the hosts have no reliable path to a domain controller, and when your configuration moves to Intune on Windows client hosts. Choose **hybrid join** when machine-authenticated apps, Group Policy, existing imaging, Windows Server hosts that need central policy or an Azure Local pool keep you tied to Active Directory. Learn's plan page for Entra join lists managing devices with a cloud device management solution among its reasons, and its hybrid join page lists Group Policy and existing imaging for that route.

## Sources

- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Session host update](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update)
- [Microsoft Learn: Update session hosts in a host pool with a session host configuration](https://learn.microsoft.com/en-us/azure/virtual-desktop/session-host-update-configure)
- [Microsoft Learn: Host pool management approaches](https://learn.microsoft.com/en-us/azure/virtual-desktop/host-pool-management-approaches)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Microsoft Learn: What is a Microsoft Entra hybrid joined device?](https://learn.microsoft.com/en-us/entra/identity/devices/concept-hybrid-join)
- [Microsoft Learn: Configure Microsoft Entra hybrid join](https://learn.microsoft.com/en-us/entra/identity/devices/how-to-hybrid-join)
- [Microsoft Learn: What is a Microsoft Entra joined device?](https://learn.microsoft.com/en-us/entra/identity/devices/concept-directory-join)
- [Microsoft Learn: Plan your Microsoft Entra join deployment](https://learn.microsoft.com/en-us/entra/identity/devices/device-join-plan)
- [Microsoft Learn: Using Azure Virtual Desktop multi-session with Microsoft Intune](https://learn.microsoft.com/en-us/intune/solutions/azure-virtual-desktop-multi-session)
- [Microsoft Learn: Microsoft Entra Kerberos Authentication for Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-hybrid-identities-enable)
- [Tech Community: Enhanced host pool management for Azure Virtual Desktop is now generally available](https://techcommunity.microsoft.com/blog/azurevirtualdesktopblog/enhanced-host-pool-management-for-azure-virtual-desktop-is-now-generally-availab/4534612)
