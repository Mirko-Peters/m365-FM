---
title: "Azure Virtual Desktop and Microsoft Entra Domain Services"
summary: "Session hosts can be joined to a Microsoft Entra Domain Services managed domain, but then single sign-on with Microsoft Entra authentication and Intune management are not available. This guide compares the join options, lists the setup steps and the limits that matter for Azure Virtual Desktop."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [entra-domain-services, azure-virtual-desktop]
keypoints:
  - "Azure Virtual Desktop supports joining session hosts to a Microsoft Entra Domain Services domain, with users synchronized one way from Microsoft Entra ID. Microsoft Entra ID still authenticates users for Azure Virtual Desktop."
  - "Learn says session hosts joined only to Microsoft Entra Domain Services or Active Directory Domain Services are not supported for single sign-on with Microsoft Entra authentication, and that Entra Domain Services-joined session hosts cannot be managed with Intune."
  - "Cloud-only users are not synchronized to the managed domain until they change their password in Microsoft Entra ID; hybrid users need password hash sync in NTLM and Kerberos compatible formats."
  - "Users and groups synchronized from Microsoft Entra ID cannot be modified in a managed domain. There are no domain or enterprise administrator privileges, no schema extensions and no sign-in to the domain controllers; Learn describes a domain-joined management VM for administration."
  - "For FSLogix profiles on Azure Files, Entra Domain Services is one of three identity sources; a storage account can use only one."
faq:
  - q: "Do I need Microsoft Entra Domain Services to run Azure Virtual Desktop?"
    a: "No. Microsoft Learn says session hosts can be joined to the same Microsoft Entra tenant, or to an Active Directory domain using AD DS or Microsoft Entra Domain Services. Microsoft Entra ID is always used to authenticate users. Entra Domain Services is one of the options, not a requirement."
  - q: "Can I use single sign-on with Microsoft Entra authentication on session hosts joined to Entra Domain Services?"
    a: "Not according to Learn. The single sign-on prerequisites say session hosts must be Microsoft Entra joined or Microsoft Entra hybrid joined, and that session hosts joined to Microsoft Entra Domain Services or to Active Directory Domain Services only are not supported."
  - q: "Why can a new cloud-only user not sign in to a session host joined to the managed domain?"
    a: "Learn says a user created in Microsoft Entra ID is not synchronized to Domain Services until the user changes their password in Microsoft Entra ID, which generates the Kerberos and NTLM password hashes. The tutorial notes that self-service password reset is recommended but not required for Domain Services, and that it takes a few minutes after the change before the new password works in Domain Services."
---

Microsoft Entra Domain Services gives Azure Virtual Desktop session hosts a managed Active Directory-style domain without domain controllers that you run yourself. It is a supported join option, but Learn lists clear limits: no single sign-on with Microsoft Entra authentication and no Intune management for session hosts joined to it.

## What Entra Domain Services provides

Learn's [overview](https://learn.microsoft.com/en-us/entra/identity/domain-services/overview) says [Entra Domain Services](/entity/entra-domain-services/) provides managed domain services such as domain join, group policy, LDAP and Kerberos/NTLM authentication, without deploying, managing or patching domain controllers in the cloud. Learn describes it as a transitional capability for legacy applications, not a replacement for on-premises Active Directory.

Three properties matter for [Azure Virtual Desktop](/entity/azure-virtual-desktop/):

- **One-way synchronization.** Users, groups and credential hashes flow from [Microsoft Entra ID](/entity/entra-id/) to the managed domain. Nothing is synchronized back.
- **Stand-alone domain.** A managed domain is not an extension of an on-premises domain. Forest trusts to on-premises AD DS are possible for hybrid access.
- **Managed domain controllers.** Two Windows Server domain controllers run as a replica set in the selected region. Microsoft manages them, and you cannot sign in to them.

## Where it fits in Azure Virtual Desktop

The [Azure Virtual Desktop prerequisites](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) state that Microsoft Entra ID is always used to authenticate users. Session hosts can be joined to the same Microsoft Entra tenant, or to an Active Directory domain using AD DS or Microsoft Entra Domain Services. The supported identity scenarios include:

| Identity scenario | Session hosts | User accounts |
|---|---|---|
| Entra ID + AD DS | Joined to AD DS | In Entra ID and AD DS, synchronized |
| Entra ID + AD DS | Joined to Entra ID | In Entra ID and AD DS, synchronized |
| Entra ID + Entra Domain Services | Joined to Entra Domain Services | In Entra ID and Entra Domain Services, synchronized |
| Entra ID + Entra Domain Services + AD DS | Joined to Entra Domain Services | In Entra ID and AD DS, synchronized |
| Entra ID + Entra Domain Services | Joined to Entra ID | In Entra ID and Entra Domain Services, synchronized |
| Entra-only | Joined to Entra ID | In Entra ID (including external identities) |

Learn's [prerequisites](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites) say that if you also use AD DS or Entra Domain Services, the accounts need to be hybrid identities, which means the user accounts are synchronized. The [authentication article](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication) adds that identities that exist only in AD DS are not supported, because users must be discoverable through Microsoft Entra ID.

## Comparison: Entra Domain Services-joined and Microsoft Entra joined

| Aspect | Entra Domain Services-joined | Microsoft Entra joined |
|---|---|---|
| Device object | Computer object in the managed domain | Device object in the Entra directory |
| Authentication | Kerberos and NTLM | OAuth / OpenID Connect based protocols |
| Management | Group Policy; Intune is not supported for these session hosts | MDM such as [Intune](/entity/intune/) |
| Single sign-on with Entra authentication | Not supported (hosts must be Entra joined or hybrid joined) | Supported |

Sources: Learn's [identity comparison](https://learn.microsoft.com/en-us/entra/identity/domain-services/compare-identity-solutions) for the first three rows, the Azure Virtual Desktop prerequisites for Intune, and the [single sign-on article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on) for the last row.

Compared with self-managed AD DS, a managed domain supports domain join, NTLM, Kerberos, custom OUs and Group Policy, but gives no Domain or Enterprise administrator privileges and no schema extensions. Learn's table lists forest trusts as possible with the Enterprise SKU; the FAQ says Domain Services supports forest trusts only, not external domain trusts.

See also [Microsoft Entra joined](/entity/avd-entra-join/) and [hybrid joined](/entity/hybrid-entra-join/) session hosts.

## Setup order for Entra Domain Services-joined session hosts

1. **Create the managed domain.** The [tutorial](https://learn.microsoft.com/en-us/entra/identity/domain-services/tutorial-create-instance) requires the Application Administrator and Groups Administrator Microsoft Entra roles and the Domain Services Contributor Azure role. The domain name prefix cannot exceed 15 characters, and Learn recommends avoiding non-routable suffixes such as `contoso.local`. Subscription, resource group and region cannot be changed afterwards. Provisioning can take up to an hour.
2. **Plan the network.** Per the [network considerations](https://learn.microsoft.com/en-us/entra/identity/domain-services/network-considerations), the managed domain needs its own subnet in the same region as the virtual network, with three to five IP addresses. Learn describes a separate application subnet for a management VM or light workloads and a peered virtual network for larger ones. Session hosts are not mentioned; our reading is that they stay out of the managed domain's subnet. Learn says the virtual network must use the DNS service addresses of the managed domain. Peering does not configure name resolution: use conditional DNS forwarders or the managed domain's DNS IP addresses. The tutorial adds that VMs connected to an existing virtual network only get new DNS settings after a restart.
3. **Check the network security group; don't rebuild it.** The service creates a network security group with the required rules, including an inbound rule from the AzureActiveDirectoryDomainServices service tag on TCP 5986 (WinRM). Learn says not to use an NSG with your own custom rules and not to edit or delete these rules. If you restrict outbound traffic, allow TCP 443 to the AzureActiveDirectoryDomainServices, AzureMonitor, Storage, AzureActiveDirectory and GuestAndHybridManagement service tags; if you use Log Analytics, add EventHub to the outbound destinations. With route tables, leave the 0.0.0.0 route unchanged. A misconfigured NSG or user-defined route can break synchronization, patching and management, and the Azure SLA then does not apply.
4. **Make the credentials available.** Cloud-only users must change their password in Microsoft Entra ID before they are synchronized. For hybrid users, [configure Microsoft Entra Connect](/entity/entra-connect/) to synchronize password hashes in NTLM and Kerberos compatible formats. The tutorial says Microsoft Entra Cloud Sync isn't supported with Domain Services and that on-premises users need to be synced with Microsoft Entra Connect sync.
5. **Prepare the join account.** For Entra Domain Services you need to be a member of the *AAD DC Administrators* group (the FAQ calls it *Microsoft Entra DC Administrators*), and the prerequisites say the account used for joining a domain can't have multifactor authentication (MFA) enabled.
6. **Deploy session hosts.** Learn lists the domain name, the join credentials and an optional organizational unit as parameters, and requires that the virtual network can reach the domain controllers and DNS servers. In the portal's [host pool deployment](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop), the directory field offers Microsoft Entra ID or Active Directory. For a host pool with a session host configuration, Learn says to select Active Directory, then the key vault holding the secrets for the join account's username and password; a domain name and OU path are optional. The prerequisites list the domain name "if using AD DS or Microsoft Entra Domain Services"; our reading is that the managed domain is joined through the Active Directory option.
7. **Sign in with the UPN.** Learn's [troubleshooting page](https://learn.microsoft.com/en-us/entra/identity/domain-services/troubleshoot) recommends the UPN format, such as `dee@aaddscontoso.onmicrosoft.com`. A SAMAccountName such as `AADDSCONTOSO\driley` may be autogenerated if several users share a UPN prefix or the prefix is overly long.

## FSLogix profiles with Entra Domain Services

For [FSLogix](/entity/fslogix/) profile containers on [Azure Files](/entity/azure-files/), Learn's storage overview names three identity sources: on-premises AD DS, Entra Domain Services and [Microsoft Entra Kerberos](/entity/entra-kerberos-azure-files/). You can use only one per storage account. For Entra Domain Services, Kerberos authentication requires the client to be joined to the managed domain.

The [Azure Files article](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-domain-services-enable) describes the portal path: storage account, **Data storage**, **Classic file shares**, then **Identity-based access**, **Microsoft Entra Domain Services**, **Set up**, select the checkbox and **Save**. The managed domain must show a Running health status with password hash synchronization enabled. Setting the property domain-joins the storage account.

Learn's [FSLogix article for AD DS and Entra Domain Services](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-azure-files-active-directory) then assigns the *Storage File Data SMB Share Contributor* role to the users' security group. It sets NTFS permissions from a session host with `net use` and the storage account key, then `icacls`: grant the group Modify and Creator Owner, and remove Authenticated Users and Builtin\Users.

**Kerberos encryption.** The FSLogix articles describe an upcoming change in the April 2026 Windows Server update: the default Kerberos encryption type changes from RC4 to AES-SHA1, and file shares hosting FSLogix containers that are not upgraded might have access issues. Learn still words this as upcoming although April 2026 has passed; check whether your hosts and shares already use AES-SHA1. For Entra Domain Services, the Azure Files article recommends AES-256: run `Set-ADUser` with `-KerberosEncryptionType AES256` on the storage account's service account, from a domain-joined client in Windows PowerShell 5.1 (not PowerShell 7 or Cloud Shell).

Microsoft Entra Kerberos is the alternative. Learn's [FSLogix article for it](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid) supports hybrid identities from Entra joined or hybrid joined session hosts without line of sight to domain controllers, and cloud-only or external identities in the Azure cloud only.

## Limits and failure points

- **Guest users.** B2B guests are synchronized into the managed domain, but Learn's FAQ says they cannot sign in or join computers to it, because their NTLM and Kerberos hashes cannot be synchronized.
- **No privileged access.** The domain controllers are not reachable. Learn describes a management VM joined to the managed domain, with the usual AD DS tools.
- **Synchronized objects are read-only.** Learn's FAQ says users and groups synchronized from Microsoft Entra ID can't be modified in the managed domain, while any user or group originating in the managed domain may be modified. The synchronization article calls a managed domain largely read-only except for custom OUs, and lists Group Policies, Sysvol, computer objects and OUs from on-premises AD DS as not synchronized.
- **Passwords.** The default password lifetime is 90 days. Five invalid attempts within 2 minutes lock the account for 30 minutes in the managed domain, not in Microsoft Entra ID.

## SKU and sizing guidance

Learn's [administration concepts](https://learn.microsoft.com/en-us/entra/identity/domain-services/administration-concepts) page describes three SKUs. The values are recommended capacity guidance, not enforced limits, and you can change the SKU after creation.

| SKU | Recommended object count | Recommended authentications | Backup frequency |
|---|---|---|---|
| Standard | Up to 25,000 | Up to 3,000 per hour | Every five days |
| Enterprise | 25,001 to 100,000 | 3,001 to 10,000 per hour | Every three days |
| Premium | 100,001 to 500,000 | 10,001 to 70,000 per hour | Daily; kept seven days, every third backup kept 30 days |

## When a managed domain fits

Our reading, based on the limits above:

- **It fits** when session hosts must run applications that need Kerberos or NTLM, you want Group Policy rather than Intune, and you do not want to operate domain controllers.
- **It is a poor fit** when you want single sign-on with Microsoft Entra authentication, Intune management of session hosts, guest users, schema changes or privileged domain administration.
- **If a user population is cloud-only** and no application needs NTLM or Kerberos, the Entra-joined route removes the managed domain and the password-hash step.

## Sources

- [Microsoft Learn: Microsoft Entra Domain Services overview](https://learn.microsoft.com/en-us/entra/identity/domain-services/overview)
- [Microsoft Learn: Compare self-managed AD DS, Microsoft Entra Domain Services and Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/domain-services/compare-identity-solutions)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra authentication](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Deploy Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/deploy-azure-virtual-desktop)
- [Microsoft Learn: How objects and credentials are synchronized in a managed domain](https://learn.microsoft.com/en-us/entra/identity/domain-services/synchronization)
- [Microsoft Learn: Tutorial: Create and configure a managed domain](https://learn.microsoft.com/en-us/entra/identity/domain-services/tutorial-create-instance)
- [Microsoft Learn: Network considerations for Microsoft Entra Domain Services](https://learn.microsoft.com/en-us/entra/identity/domain-services/network-considerations)
- [Microsoft Learn: Management concepts for managed domains](https://learn.microsoft.com/en-us/entra/identity/domain-services/administration-concepts)
- [Microsoft Learn: Replica sets in Microsoft Entra Domain Services](https://learn.microsoft.com/en-us/entra/identity/domain-services/concepts-replica-sets)
- [Microsoft Learn: Microsoft Entra Domain Services FAQ](https://learn.microsoft.com/en-us/entra/identity/domain-services/faqs)
- [Microsoft Learn: Microsoft Entra Domain Services troubleshooting](https://learn.microsoft.com/en-us/entra/identity/domain-services/troubleshoot)
- [Microsoft Learn: Enable Microsoft Entra Domain Services authentication for Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-domain-services-enable)
- [Microsoft Learn: Overview of Azure Files identity-based authentication for SMB](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-overview)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files and AD DS or Microsoft Entra Domain Services](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-azure-files-active-directory)
- [Microsoft Learn: Store FSLogix profile containers on Azure Files using Microsoft Entra ID](https://learn.microsoft.com/en-us/fslogix/how-to-configure-profile-container-entra-id-hybrid)
