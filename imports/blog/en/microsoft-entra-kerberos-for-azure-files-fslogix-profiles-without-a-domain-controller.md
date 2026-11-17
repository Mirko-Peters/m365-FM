---
title: "Microsoft Entra Kerberos for Azure Files: FSLogix profiles without a domain controller"
summary: "Microsoft Entra Kerberos lets Microsoft Entra ID issue the Kerberos tickets that session hosts use to open an Azure Files share over SMB, so the hosts need no line of sight to a domain controller. This article explains the ticket flow, what a domain controller is still needed for, and the settings and limits that decide whether it works for FSLogix."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [entra-kerberos-azure-files, azure-files]
keypoints:
  - "With Microsoft Entra Kerberos, Microsoft Entra ID issues the Kerberos tickets for SMB access to Azure Files. Learn says that for cloud-only users the file shares no longer need a domain controller for authentication or authorization."
  - "The session hosts need no line of sight to a domain controller. For setting Windows ACLs, Learn's pages differ: icacls and File Explorer (hybrid identities only) need a device with unimpeded connectivity to Active Directory, while the Azure portal and the RestSetAcls module have no domain controller dependency for hybrid and cloud-only identities when Entra Kerberos is the identity source."
  - "Clients must be Microsoft Entra joined or hybrid joined. For cloud-only identities the Azure Files article lists Windows 11 Enterprise or Pro and Windows Server 2025; hybrid adds Windows 10 and Windows Server 2022. Cloud-only identities are supported in the public cloud only."
  - "Learn's prerequisites include one identity source per storage account, Kerberos allowed in the SMB security settings, no MFA on the storage account app, an app management policy exception where policies block service principal keys, a client policy to retrieve the cloud Kerberos ticket, and, for cloud-only groups, the kdc_enable_cloud_group_sids manifest tag."
  - "Learn's pages differ on status: Azure Virtual Desktop what's new announced FSLogix support for cloud-only and external identities as generally available in May 2026, while the Microsoft Entra Kerberos page still labels its cloud-only sections Preview."
faq:
  - q: "Do I need a domain controller at all for FSLogix profiles on Azure Files with Entra Kerberos?"
    a: "Not for the session hosts. Learn says that when used for FSLogix profiles in Azure Virtual Desktop, session hosts do not need network line of sight to the domain controller. Setting permissions is where Learn's pages differ: icacls and File Explorer for hybrid identities need a device with unimpeded connectivity to Active Directory, while the Azure portal and the RestSetAcls module have no domain controller dependency when Entra Kerberos is the identity source."
  - q: "Can the same storage account use Microsoft Entra Kerberos and AD DS together?"
    a: "No. Learn says a storage account can use only one identity source for file access authentication, and that it applies to all file shares in the account. Changing it temporarily interrupts identity-based access to all file shares in the account. A client can, however, reach AD DS storage accounts and Entra Kerberos storage accounts if you add Kerberos realm mappings for the AD DS ones."
  - q: "Why does the share fail with system error 1327 after I turned Entra Kerberos on?"
    a: "Learn names MFA as one documented cause. Microsoft Entra Kerberos does not support MFA for access to the share, and a Conditional Access policy that requires MFA for all apps applies to the Entra app that represents the storage account. The Azure Files article says that without an exclusion, mapping the share with net use returns 'System error 1327: Account restrictions are preventing this user from signing in'. Exclude the app named after the storage account's file endpoint from that policy. The Entra Kerberos article adds that generic SMB errors such as 86 or 1327 can also come from other policy conflicts, so if the error remains, check other Conditional Access policies and the Entra sign-in log, where error 140011 marks an exceeded group SID limit."
---

Microsoft Entra Kerberos lets [Microsoft Entra ID](/entity/entra-id/) issue the Kerberos tickets that clients use to open an [Azure Files](/entity/azure-files/) share over SMB, so a session host holding an [FSLogix](/entity/fslogix/) profile container does not need to reach a domain controller. Learn says that for cloud-only users the share no longer needs a domain controller for authentication or authorization, while for hybrid identities Learn ties a domain controller connection to setting Windows ACLs with icacls or File Explorer.

## How the ticket flow differs

Learn describes [Microsoft Entra Kerberos](/entity/microsoft-entra-kerberos/) as turning Microsoft Entra ID into a cloud-based Key Distribution Center. When a user signs in to a Microsoft Entra joined or hybrid joined Windows device, the device receives a Primary Refresh Token and Entra ID issues a Cloud TGT for the realm `KERBEROS.MICROSOFTONLINE.COM`. Learn says the Cloud TGT enables access to cloud resources such as Azure Files, has no dependency on domain controllers, and does not replace the on-premises TGT. It names Windows Hello for Business and FIDO2 as supported credentials; the client policy `CloudKerberosTicketRetrievalEnabled`, covered below, lets the client retrieve a cloud TGT during logon.

A separate partial TGT for on-premises resources is issued only when the environment supports it, for example after a passwordless sign-in with a Kerberos server object in Active Directory. Only on-premises Active Directory recognizes it, and in our reading it plays no part in reaching Azure Files.

For Azure Files the client sends a service ticket request to Entra ID, not a domain controller, for `cifs/<storageaccount>.file.core.windows.net`. The KDC Proxy protocol carries the Kerberos traffic over the internet. Entra ID returns a service ticket, the Kerberos stack passes it to SMB, and Azure Files decrypts it. The Azure Files overview says the service receives only the Kerberos ticket, not the user's credentials. [Microsoft Entra Kerberos for Azure Files](/entity/entra-kerberos-azure-files/) applies to SMB shares; Learn says identity-based authentication is not supported for NFS.

## What a domain controller still does

Hybrid identities are AD DS identities synced to Entra ID with [Microsoft Entra Connect](/entity/entra-connect/) Sync or [Cloud Sync](/entity/entra-cloud-sync/). Cloud-only identities exist only in Entra ID.

| Question | Hybrid identities | Cloud-only identities |
|---|---|---|
| Domain controller needed for sign-in to the share? | No, for FSLogix on Azure Virtual Desktop session hosts | No |
| Domain controller needed to set ACLs? | Only for icacls or File Explorer (a device with unimpeded connectivity to Active Directory); not for the Azure portal or RestSetAcls | No: Azure portal or the RestSetAcls PowerShell module; icacls and File Explorer do not work |
| Accounts and groups | Created in AD DS and synced to Entra ID | Created in Entra ID |
| Clouds | Public, US Government, 21Vianet | Public cloud only |
| Operating systems (Azure Files article) | Windows 11 and Windows 10 (Enterprise or Pro; Windows 10 2004 or later), Windows Server 2025 and 2022 | Windows 11 Enterprise or Pro, Windows Server 2025 |

On the ACL row, Learn's pages do not agree. The FSLogix page requires network line of sight to the domain controller for hybrid identities, and the Entra Kerberos article lists ACL configuration under network connectivity requirements. The Azure Files page words it two ways: its introduction ties ACLs for hybrid identities to domain controller connectivity without naming a tool, while its permissions section limits that to icacls and File Explorer. The file-level permissions page says the Azure portal and RestSetAcls have no domain controller dependency for hybrid and cloud-only identities when Entra Kerberos is the identity source; hybrid identities must be synced to Entra ID, or their ACLs are not enforced. The Entra article adds that Entra Kerberos reduces, and in some cases eliminates, domain controller connectivity, and recommends enough domain controllers close to Azure Virtual Desktop environments. Our reading: the session hosts need no line of sight to a domain controller for the share, the on-premises directory stays in use for hybrid identities, and an Active Directory-connected device stays available for icacls or File Explorer.

The Azure Files article lists Windows 11 Enterprise or Pro and recommends at least 24H2 or 25H2 with KB5079391 (builds 26100.8116 and 26200.8116 or later) or 26H1 with KB5079489 (build 28000.1764 or later). Windows Server 2025 needs the latest updates. Learn says clients that do not meet these prerequisites can still use Entra Kerberos with a [cloud Kerberos trust](/entity/cloud-kerberos-trust/).

The Entra Kerberos article words cloud-only support more broadly, as an Entra joined Windows 10 or 11 device. Our reading is to plan with the narrower Azure Files list.

Clients must be [Microsoft Entra joined or hybrid joined](/entity/avd-entra-join/). Learn says they cannot be joined to [Microsoft Entra Domain Services](/entity/entra-domain-services/) or to AD only.

## Permissions: two layers, set in two places

Access to a file needs both a share-level permission and a file or directory permission.

1. **Share level, through Azure RBAC.** Built-in roles include Storage File Data SMB Share Reader, Contributor and Elevated Contributor. The default share-level permission is None at initialization; a default set on the storage account applies to all its shares and all authenticated identities. Changes usually take effect within 30 minutes. For cloud-only identities, specific assignments work only with Entra Kerberos; in an unsupported region, use a default permission.
2. **File and directory level, through Windows ACLs.** With Entra Kerberos as the identity source, the Azure portal (the **Manage access** option) and RestSetAcls, which needs a Windows client, work for hybrid and cloud-only identities. Learn says File Explorer and icacls do not work for cloud-only identities. An identity with the Full Control ACL and the Storage File Data SMB Share Elevated Contributor role can change ACLs without the storage account key.

For FSLogix, Learn recommends Storage File Data SMB Share Contributor for all authenticated identities as the default permission, and Elevated Contributor for those who set ACLs. For ACLs it recommends CREATOR OWNER with Modify on subfolders and files only, an admin group with Full Control, and a user group with Modify on "this folder only"; substitute your own groups for its domain example. On first sign-in a `<user SID>_<username>` directory should appear.

## The settings that decide success

The Azure Files and FSLogix articles together list the settings below.

- **SMB security settings.** Learn says the storage account's SMB security settings must allow Kerberos. With a custom SMB security profile, **Kerberos** must be selected under **Authentication methods**. Learn lists this under "Minimum prerequisites": without them you cannot authenticate with Entra ID.
- **App management policies.** If policies block symmetric key addition on service principals, or limit their key lifetime to under 366 days, adjust the policy or grant an exception for the "Storage Resource Provider" service (app ID `a6aa9161-5291-40bb-8c5c-923b567bee3b`). In the Entra admin center these are "Block password addition" and "Restrict max password lifetime".
- **One identity source.** Only one works per storage account; disable another before enabling Entra Kerberos.
- **Admin consent.** Enabling the feature creates an Entra application named after the storage account's file endpoint. Grant admin consent for its three permissions (openid, profile, User.Read). Do not edit that service principal beyond what Learn documents.
- **No MFA on that app.** Exclude the app from Conditional Access policies that require MFA for all apps; the FSLogix article says there is no interface for step-up authentication during sign-in.
- **Client policy.** Set `Kerberos/CloudKerberosTicketRetrievalEnabled` to 1 on every client that mounts the share: through the Intune settings catalog, through Group Policy, or with `reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\Kerberos\Parameters /v CloudKerberosTicketRetrievalEnabled /t REG_DWORD /d 1`. The OMA-URI method does not work on Azure Virtual Desktop multi-session devices, so use the settings catalog there.
- **Credential keys.** The FSLogix article also sets `LoadCredKeyFromProfile` to 1 under `HKLM\Software\Policies\Microsoft\AzureADAccount`, so profiles can load on many VMs.
- **Cloud-only groups.** Add the tag `kdc_enable_cloud_group_sids` to the storage account application's manifest. Learn says authentication fails without it for cloud-only identities. In the Entra admin center: Entra ID, App registrations, the application, Manage, Manifest; add the tag to `tags` and save.
- **Coexistence.** After the client policy is on, clients cannot reach AD DS-joined storage accounts without Kerberos realm mappings (`Kerberos/HostToRealm`, or `ksetup /addhosttorealmmap`). Realm names are uppercase.
- **Services and private endpoints.** The WinHTTP Web Proxy Auto-Discovery service, which handles KDC Proxy requests, and the IP Helper service must be running. With a private endpoint, add the private link FQDN to the storage account's Entra application.

The FSLogix pages carry an April 2026 notice that the default Kerberos encryption type changes from RC4 to AES-SHA1. The linked FSLogix blog names Azure Files with AD DS, not Entra Kerberos, and the Azure Files article says Entra Kerberos ticket encryption is always AES-256.

## Limits and status to check before committing

- **Group SID limit.** A Kerberos ticket can include at most 1,010 group SIDs, counting on-premises and cloud groups. The Azure Files article and the Entra article's group SID section say that above this the ticket cannot be issued, while the Entra article's limitations section says only the first 1,010 are included. The Entra sign-in log shows error 140011, KerberosUsersGroupNumberExceeded; Learn says to reduce group memberships, especially nested and dynamic groups, and that heavily grouped users can fail intermittently while others succeed.
- **Ticket lifetime.** FSLogix 26.08 (31 August 2026) added a background refresh of the Cloud Kerberos ticket for Entra joined devices. The ticket lifetime stays at 10 hours; the refresh mitigates sessions longer than that.
- **No cross-tenant.** Cross-tenant access is not supported. External identities (B2B guests) are limited to FSLogix on Azure Virtual Desktop in the public cloud; guests invited from Azure Government or 21Vianet are excluded.
- **Status wording.** Azure Virtual Desktop what's new lists FSLogix support for cloud-only and external identities as "now generally available" in May 2026, after a November 2025 preview entry. The Azure Files and FSLogix articles carry no preview label, but the Entra Kerberos article still labels its cloud-only and group SID sections Preview. Check the pages you rely on.
- **Older limited-preview setups.** With the manual limited preview setup, Learn warns, the service principal password expires every six months and users then cannot get tickets.

## When it fits, and when another source fits better

Learn suggests Entra Kerberos for cloud-first or hybrid environments with Entra-joined clients, FSLogix profiles, or clients without domain-controller connectivity. AD DS fits organizations whose clients reach their domain controllers; Entra Domain Services fits those that need a managed domain and can join clients to it.

Before you start, list the user identity types, session host operating systems, the storage account's identity source, and any Conditional Access or app management policies that apply. If any session host runs Windows Server 2022 or Windows 10 and the users are cloud-only, the feature is outside the Azure Files article's list. If the storage account serves AD DS, plan the identity source change first. The client settings above apply to each [session host](/entity/avd-session-host/) in an [Azure Virtual Desktop](/entity/azure-virtual-desktop/) host pool, so put them in the image, Intune or Group Policy.

## Sources

- [Microsoft Learn: Microsoft Entra Kerberos authentication for Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-hybrid-identities-enable)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
- [Microsoft Learn: Overview of Azure Files identity-based authentication options for SMB access](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-overview)
- [Microsoft Learn: Assign share-level permissions to an identity](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-assign-share-level-permissions)
- [Microsoft Learn: Configure directory and file-level permissions over SMB](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-configure-file-level-permissions)
- [Microsoft Learn: Configure storage permissions for FSLogix profile containers](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions)
- [Microsoft Learn: Microsoft Entra Kerberos](https://learn.microsoft.com/en-us/entra/identity/authentication/kerberos)
- [Microsoft Learn: FSLogix release notes](https://learn.microsoft.com/en-us/fslogix/overview-release-notes)
- [Microsoft Learn: What's new in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/whats-new)
- [Tech Community FSLogix blog: Action required, Windows Kerberos hardening (RC4) may affect FSLogix profiles on SMB storage](https://techcommunity.microsoft.com/blog/fslogix-blog/action-required-windows-kerberos-hardening-rc4-may-affect-fslogix-profiles-on-sm/4506378)
