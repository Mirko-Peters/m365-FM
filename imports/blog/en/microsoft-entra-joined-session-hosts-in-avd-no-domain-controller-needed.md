---
title: "Microsoft Entra joined session hosts in AVD: no domain controller needed"
summary: "A Microsoft Entra joined session host needs no line of sight to a domain controller and no Entra Domain Services, and it can be enrolled in Intune automatically. This article lists what the domain controller used to do and what replaces it: roles, sign-in, profiles, management and the limits that remain."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [avd-entra-join, azure-virtual-desktop]
keypoints:
  - "Learn says Microsoft Entra joined VMs in Azure Virtual Desktop do not require line of sight to a domain controller and do not require Microsoft Entra Domain Services. Learn's wording is that in some cases no domain controller is needed at all."
  - "A host pool should contain session hosts of one join type only. The Microsoft Entra ID option joins VMs to the same tenant as the subscription you deploy in."
  - "For host pools without a session host configuration, users need the Virtual Machine User Login role (administrators the Virtual Machine Administrator Login role). Learn says host pools with a session host configuration do not need this extra assignment."
  - "FSLogix profiles on Azure Files work through Microsoft Entra Kerberos for hybrid, cloud-only and external identities. Cloud-only and external identities are supported in the Azure cloud only."
  - "Access to on-premises resources still needs an Active Directory and line of sight to it, and Windows Server session hosts cannot be enrolled in Intune."
faq:
  - q: "Can an Azure Virtual Desktop deployment run with no domain controller at all?"
    a: "Learn says Microsoft Entra joined session hosts do not need line of sight to a domain controller or Microsoft Entra Domain Services, and that in some cases no domain controller is needed. Whether that holds for you depends on what the session hosts must reach: Learn says an Active Directory and line of sight to it are needed to access on-premises resources from these VMs. For hybrid identities, setting Windows ACLs on an Azure Files share for FSLogix needs a system with connectivity to a domain controller."
  - q: "Can I mix Microsoft Entra joined and domain-joined session hosts in one host pool?"
    a: "No. Learn's note says host pools should only contain VMs of the same domain join type, so Microsoft Entra joined VMs belong with other Microsoft Entra joined VMs only. If both join types are needed, use separate host pools."
  - q: "Do I have to assign an Azure role so users can sign in to Microsoft Entra joined session hosts?"
    a: "For host pools without a session host configuration, yes: Learn says to assign Virtual Machine User Login to users, and Virtual Machine Administrator Login to administrators who need local administrative privileges. For host pools with a session host configuration, Learn says this extra role assignment is not required. Owner or Contributor alone does not grant sign-in."
---

A Microsoft Entra joined session host is joined directly to your Microsoft Entra tenant, so it needs no line of sight to a domain controller and no Microsoft Entra Domain Services. Learn says that in some cases no domain controller is needed at all, and that the VMs can be enrolled in Intune automatically. The sections below list what a domain controller used to provide and what takes its place. Learn calls this join type Microsoft Entra joined; older material says Azure AD joined.

## What the join type changes

With [Microsoft Entra joined session hosts](/entity/avd-entra-join/), the computer account lives in [Microsoft Entra ID](/entity/entra-id/) instead of [Active Directory](/entity/active-directory/). Learn's [prerequisites](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) state that Microsoft Entra ID is always used to authenticate users for [Azure Virtual Desktop](/entity/azure-virtual-desktop/). The join type only decides where the session host sits.

Learn's supported identity scenarios include "Microsoft Entra-only": session hosts joined to Microsoft Entra ID with user accounts in Microsoft Entra ID, including external identities. Entra joined hosts are also listed for users synchronized from AD DS or Entra Domain Services. Personal Microsoft accounts are not supported, and the user account must exist in the tenant you use for Azure Virtual Desktop.

## What the domain controller did, and what replaces it

| Function | With domain-joined hosts | With Microsoft Entra joined hosts |
|---|---|---|
| Computer account and join | Domain account that can join computers; optional OU | An account that can join computers to your tenant |
| Who may sign in to the VM | Domain membership and user rights | Azure role assignment (Virtual Machine User Login) unless the pool has a session host configuration |
| Sign-in to Windows | Kerberos or NTLM against the domain | Single sign-on with Microsoft Entra authentication, or legacy credential prompts |
| Profile share access | AD DS or Entra Domain Services identity on the share | Microsoft Entra Kerberos on Azure Files |
| Device settings | Group Policy | [Intune](/entity/intune/) (Windows client); local Group Policy for Windows Server |
| On-premises resources | Reachable through the domain | Needs Active Directory and line of sight |

The join-account row comes from the prerequisites page. The Group Policy cell for Windows Server is described under management below. The other rows follow in the sections below.

## Requirements and the join path

In the Azure portal, Learn's [Microsoft Entra joined session hosts](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts) page says to open the **Virtual Machines** tab when you create or expand a host pool and choose between **Active Directory** and **Microsoft Entra ID**. The Microsoft Entra ID option only joins VMs to the same tenant as the subscription you are in. Choosing it also lets you enroll the VMs in Intune automatically.

One caveat when you plan a pool with a [session host configuration](/entity/avd-session-host-configuration/): in the [deployment article](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop), the portal row for the session host configuration flow says to select **Active Directory** and a key vault holding the join account secrets, while the standard management row offers Microsoft Entra ID or Active Directory. The Entra joined page, however, says the extra role assignment is not needed for pools with a session host configuration. Check the portal for the option you need before you design around one path.

Further requirements and limits from Learn:

- **One join type per pool.** Host pools should only contain VMs of the same domain join type.
- **Operating systems.** For hybrid or cloud-only users, Windows 11 or Windows 10, single-session or multi-session, version 2004 or later, or Windows Server 2022 or 2019. External identities have stricter requirements: Windows 11 Enterprise 24H2 or later with KB5065789, or Windows Server 2025 with KB5073379 or later, plus single sign-on on the host pool. External identities are not available in Azure operated by 21Vianet.
- **Azure Local.** Session hosts on Azure Local can only join an AD DS domain, so this join type does not apply there.

## Roles and connecting

For a host pool without a session host configuration, the Entra joined page says to assign **Virtual Machine User Login** so users can sign in, and **Virtual Machine Administrator Login** for administrators who need local administrative privileges. Roles can be assigned on the VM, resource group or subscription. Learn recommends giving Virtual Machine User Login to the same user group as the application group, at the resource group level, so it covers every VM in the pool. The Entra sign-in article adds that Owner or Contributor alone does not grant sign-in rights. A missing role shows up as "Your account is configured to prevent you from using this device", according to Learn's troubleshooting page.

Learn recommends enabling [single sign-on](/entity/avd-single-sign-on/) with Microsoft Entra authentication. Without it, behavior depends on the client:

1. **Windows Desktop client.** The local PC must be Microsoft Entra joined or hybrid joined to the same tenant, or running Windows 11 or Windows 10 version 2004 or later and Microsoft Entra registered to the same tenant. Otherwise add the custom RDP property `targetisaadjoined:i:1` to the host pool.
2. **Web, Android, macOS and iOS clients.** Add `targetisaadjoined:i:1` to the host pool. Learn states that these connections are restricted to entering user name and password.

Per-user multifactor authentication must be disabled for these hosts; use Conditional Access instead. The [MFA article](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa) says to exclude the Azure Windows VM Sign-In app from the policy if you do not want to restrict sign-in to strong methods such as Windows Hello for Business. For symptom-by-symptom diagnosis, see the sign-in checklist for Entra-joined hosts in this series rather than this article.

Learn's [authentication article](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication) adds two rules. Signing in to Entra ID with one account and then to Windows with a separate account is not supported. And in the remote session phase, smart card and Windows Hello for Business can only use Kerberos, which requires line of sight to a domain controller (VPN, corporate network or a KDC Proxy server). Learn states this for remote session authentication in general, so check it against your chosen sign-in method.

## Profiles without a domain controller

[FSLogix](/entity/fslogix/) profile containers work on Entra joined hosts when stored on [Azure Files](/entity/azure-files/) with [Microsoft Entra Kerberos](/entity/entra-kerberos-azure-files/). Learn's [FSLogix article](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid) lists the supported combinations:

| Identity type | Session host | Clouds |
|---|---|---|
| Hybrid | Entra joined or hybrid joined | Azure, Azure Government, Azure operated by 21Vianet |
| Cloud-only | Entra joined | Azure cloud only |
| External | Entra joined | Azure cloud only |

The session hosts do not need line of sight to a domain controller. For hybrid identities, though, the Azure Files article says setting Windows ACLs and directory and file-level permissions needs unimpeded connectivity to the on-premises domain controller, and File Explorer permissions are not supported for cloud-only identities. Other points to plan for:

- **Device settings.** Enable cloud Kerberos ticket retrieval on the session hosts (Intune policy `Kerberos/CloudKerberosTicketRetrievalEnabled`, Group Policy or the registry value `CloudKerberosTicketRetrievalEnabled`), and set `LoadCredKeyFromProfile` as the FSLogix article describes.
- **One authentication method per storage account.** An account cannot use Microsoft Entra ID together with AD DS or Entra Domain Services.
- **No MFA on the storage account app.** Exclude the Entra app that represents the storage account from MFA Conditional Access policies that apply to all apps; otherwise `net use` can fail with system error 1327.
- **Group SID limit.** A Kerberos ticket can include at most 1,010 group SIDs; cloud-only identities also need the `kdc_enable_cloud_group_sids` manifest tag.
- **Encryption.** The Azure Files article says Entra Kerberos ticket encryption is always AES-256. The FSLogix page also carries a warning about the April 2026 Windows Server update, which changes the default Kerberos encryption type from RC4 to AES-SHA1.

One wording difference: the prerequisites page says that with Entra join, FSLogix profile storage needs hybrid identities. The Entra joined and FSLogix pages list cloud-only and external identities as supported on Azure Files with Entra Kerberos, in the Azure cloud only. The dedicated FSLogix page is the more specific source, so use it and check the current text.

## Management without Group Policy

Intune takes over device configuration. The [Intune multi-session article](https://learn.microsoft.com/en-us/mem/intune/fundamentals/azure-virtual-desktop-multi-session) says Intune management of Azure Virtual Desktop multi-session is generally available and requires:

- Pooled host pools deployed through Azure Resource Manager.
- The same tenant as Intune.
- Azure Virtual Desktop agent version 1.0.2944.1400 or later.
- For Entra joined VMs, **Enroll the VM with Intune** enabled in the Azure portal.

Learn lists limits that matter for planning: Windows Autopilot and the enrollment status page are not supported, Windows update ring policies are not supported, and RemoteApp and MSIX app attach are not supported in Intune. Device-based configuration cannot be assigned to users, and the reverse. Deleting a VM in Azure leaves an orphaned device record; Intune attempts to delete records for devices inactive for 60 days or more, and Learn says this is not guaranteed at 60 days.

Windows Server is the exception. Per the prerequisites, a Windows Server session host joined to Entra cannot be enrolled in Intune; Learn points to Microsoft Entra hybrid join with Group Policy from an Active Directory domain, or local Group Policy on each host. Session hosts joined to Entra Domain Services also cannot be managed with Intune; that route is covered in the Entra Domain Services article of this series.

## Limits to check before you commit

- **On-premises resources.** Learn says an Active Directory and line of sight to it are needed to reach on-premises resources from Entra joined VMs. File servers or applications that need Kerberos or NTLM from the host are the usual reason to look at hybrid join; the comparison belongs to the article on Entra join versus hybrid join.
- **External identities.** They cannot authenticate to on-premises resources with Kerberos or NTLM, and Intune device configuration policies assigned to the external identity are not applied; assign them to the device.
- **Cross-tenant access.** For external identities, Learn's troubleshooting page lists the applications to allow, including Azure Virtual Desktop, Windows Cloud Login and Azure Windows VM Sign-In.
- **Tenant Kerberos limits.** Microsoft Entra Kerberos does not currently support cross-tenant access, according to the Azure Files article.

## A short decision rule

This is our reading of the sources, not a Microsoft rule. Entra join fits when users are in Entra ID, the workload is a Windows client OS on pooled or personal hosts, profiles can sit on Azure Files, and nothing on the host needs Kerberos or NTLM to on-premises systems. Domain join or hybrid join fits when applications or file servers depend on the domain, when Windows Server session hosts need Intune-style management, or when the host pool runs on Azure Local.

## Related

- [Microsoft Entra joined session hosts (Azure Virtual Desktop)](/entity/avd-entra-join/)
- [Single sign-on (Azure Virtual Desktop)](/entity/avd-single-sign-on/)
- [Microsoft Entra hybrid join](/entity/hybrid-entra-join/)
- [Microsoft Entra Domain Services](/entity/entra-domain-services/)
- [Microsoft Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/)

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Microsoft Entra joined session hosts in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/azure-ad-joined-session-hosts)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Enforce Microsoft Entra multifactor authentication for Azure Virtual Desktop using Conditional Access](https://learn.microsoft.com/en-us/azure/virtual-desktop/set-up-mfa)
- [Microsoft Learn: Troubleshoot connections to Microsoft Entra joined VMs in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/troubleshoot-azure-ad-connections)
- [Microsoft Learn: Sign in to a Windows virtual machine in Azure by using Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/devices/howto-vm-sign-in-azure-ad-windows)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Microsoft Learn: Enable Microsoft Entra Kerberos authentication for hybrid identities on Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-hybrid-identities-enable)
- [Microsoft Learn: Intune management of Windows Enterprise multi-session session hosts](https://learn.microsoft.com/en-us/mem/intune/fundamentals/azure-virtual-desktop-multi-session)
