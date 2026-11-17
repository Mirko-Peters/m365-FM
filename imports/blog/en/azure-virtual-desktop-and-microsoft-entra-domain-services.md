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
  - "A managed domain is largely read-only: no domain or enterprise administrator privileges, no schema extensions, no sign-in to the domain controllers. Administer it from a domain-joined management VM."
  - "For FSLogix profiles on Azure Files, Entra Domain Services is one of three identity sources; a storage account can use only one."
faq:
  - q: "Do I need Microsoft Entra Domain Services to run Azure Virtual Desktop?"
    a: "No. Microsoft Learn says session hosts can be joined to the same Microsoft Entra tenant, or to an Active Directory domain using AD DS or Microsoft Entra Domain Services. Microsoft Entra ID is always used to authenticate users. Entra Domain Services is one of the options, not a requirement."
  - q: "Can I use single sign-on with Microsoft Entra authentication on session hosts joined to Entra Domain Services?"
    a: "Not according to Learn. The single sign-on prerequisites say session hosts must be Microsoft Entra joined or Microsoft Entra hybrid joined, and that session hosts joined to Microsoft Entra Domain Services or to Active Directory Domain Services only are not supported. Check the current page before you decide, because it may change."
  - q: "Why can a new cloud-only user not sign in to a session host joined to the managed domain?"
    a: "Learn says a user created in Microsoft Entra ID is not synchronized to Domain Services until the user changes their password in Microsoft Entra ID, which generates the Kerberos and NTLM password hashes. The tutorial adds that the tenant must be configured for self-service password reset before a user can reset a password, and that it takes a few minutes after the change before the new password works in Domain Services."
---

Microsoft Entra Domain Services gives Azure Virtual Desktop session hosts a managed Active Directory-style domain without domain controllers that you run yourself. It is a supported join option, but Learn lists clear limits: no single sign-on with Microsoft Entra authentication and no Intune management for session hosts joined to it.

## What Entra Domain Services provides

Learn's [overview](https://learn.microsoft.com/en-us/entra/identity/domain-services/overview) says Domain Services provides managed domain services such as domain join, group policy, LDAP and Kerberos/NTLM authentication, without deploying, managing or patching domain controllers in the cloud. It is aimed at legacy applications that depend on AD DS protocols and cannot easily use modern authentication.

Three properties matter for [Azure Virtual Desktop](/entity/azure-virtual-desktop/):

- **One-way synchronization.** Users, groups and credential hashes flow from [Microsoft Entra ID](/entity/entra-id/) to the managed domain. Nothing is synchronized back.
- **Stand-alone domain.** Learn says a managed domain is not an extension of an on-premises domain. Forest trusts to on-premises AD DS are possible if you need hybrid access.
- **Managed domain controllers.** Two Windows Server domain controllers are deployed into the selected Azure region as a replica set, and Microsoft manages them. You cannot sign in to them.

Learn also describes Domain Services as a transitional capability for Azure-hosted workloads that need legacy authentication, rather than a general replacement for on-premises Active Directory or for cloud-native identity services. See also the entity page for [Entra Domain Services](/entity/entra-domain-services/).

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

Learn adds that if you also use AD DS or Entra Domain Services, the accounts need to be hybrid identities. User identities that exist only in AD DS are not supported, because users must be discoverable through Microsoft Entra ID.

## Comparison: three ways to join session hosts

| Aspect | Entra Domain Services-joined | Microsoft Entra joined | AD DS-joined |
|---|---|---|---|
| Device object | Computer object in the managed domain | Device object in the Entra directory | Computer object in AD DS |
| Authentication between device and resources | Kerberos and NTLM | OAuth / OpenID Connect based protocols | Kerberos and NTLM |
| Management | Group Policy; Intune is not supported for these session hosts | MDM such as [Intune](/entity/intune/) | Group Policy |
| Single sign-on with Entra authentication | Not supported on its own (see below) | Supported | Not supported on its own; supported for Entra hybrid joined hosts |
| Domain controllers | Managed by Microsoft, no sign-in | None needed | Run by you |
| Schema extensions | Not supported | Not applicable | Possible |

The device-object, authentication and management rows for Entra Domain Services and Entra joined come from Learn's [identity comparison](https://learn.microsoft.com/en-us/entra/identity/domain-services/compare-identity-solutions). The AD DS column follows Learn's table for self-managed AD DS and the Azure Virtual Desktop articles. The single sign-on row comes from the [single sign-on article](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on).

Learn's comparison of a managed domain with self-managed AD DS shows the same pattern. Both support domain join, NTLM and Kerberos, custom OU structure and Group Policy. A managed domain does not give Domain or Enterprise administrator privileges and does not allow schema extensions. Domain and forest trusts are listed as possible for a managed domain but require the Enterprise SKU.

See also [Microsoft Entra joined](/entity/avd-entra-join/) and [hybrid joined](/entity/hybrid-entra-join/) session hosts.

## Setup order for Entra Domain Services-joined session hosts

1. **Create the managed domain.** The [tutorial](https://learn.microsoft.com/en-us/entra/identity/domain-services/tutorial-create-instance) requires the Application Administrator and Groups Administrator Microsoft Entra roles and the Domain Services Contributor Azure role. The domain name prefix cannot be longer than 15 characters, and Learn recommends avoiding non-routable suffixes such as `contoso.local`. You cannot move the managed domain to another subscription, resource group or region after creation. Provisioning can take up to an hour.
2. **Plan the network.** Per the [network considerations](https://learn.microsoft.com/en-us/entra/identity/domain-services/network-considerations), the managed domain must be deployed in its own subnet in the same region as the virtual network, and needs three to five IP addresses. Peering a second virtual network connects it but does not configure name resolution for it, so set the virtual network's DNS servers to the managed domain's addresses. After a DNS change, VMs on an existing network only pick up the new settings after a restart.
3. **Allow the required traffic.** The managed domain's subnet needs an inbound network security group rule from the AzureActiveDirectoryDomainServices service tag on TCP 5986 (WinRM). Learn says not to edit or delete these rules.
4. **Make the credentials available.** Cloud-only users must change their password in Microsoft Entra ID before they are synchronized. The initial synchronization may take a few hours to a couple of days, depending on the number of objects. For hybrid users, [configure Microsoft Entra Connect](/entity/entra-connect/) to synchronize password hashes in the NTLM and Kerberos compatible formats. A federated directory without hashes in Entra ID does not work with Domain Services, according to Learn's FAQ.
5. **Prepare the join account.** For Entra Domain Services you need to be a member of the *AAD DC Administrators* group, and the account used to join a domain cannot have multifactor authentication enabled.
6. **Deploy session hosts.** Learn lists the domain name, the credentials to join the domain and an optional organizational unit as parameters for session host deployment, and requires that the virtual network can reach the domain controllers and DNS servers. In the portal's host pool creation, the directory field offers Microsoft Entra ID or Active Directory. Our reading: the managed domain is entered through the Active Directory option with its domain name; check the portal wording in your tenant.
7. **Sign in with the UPN.** Learn recommends the UPN format (for example `driley@aaddscontoso.com`), because the auto-generated SAMAccountName may differ from the UPN prefix.

## FSLogix profiles with Entra Domain Services

For [FSLogix](/entity/fslogix/) profile containers on [Azure Files](/entity/azure-files/), Learn's storage overview names three identity sources: on-premises AD DS, Entra Domain Services and [Microsoft Entra Kerberos](/entity/entra-kerberos-azure-files/). You can use only one per storage account, and it applies to all file shares in the account. For Entra Domain Services it lists cloud-only or hybrid identities, and says Kerberos authentication requires the client to be joined to the managed domain.

The [Azure Files article](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-domain-services-enable) describes the portal path: storage account, **Data storage**, **Classic file shares**, then **Identity-based access**, **Microsoft Entra Domain Services**, **Set up**, select the checkbox and **Save**. It requires that the managed domain shows a Running health status with password hash synchronization enabled. Setting the property domain-joins the storage account to the managed domain. Share-level permissions still have to be assigned afterwards.

Microsoft Entra Kerberos is the alternative: Learn says clients must be Microsoft Entra joined or hybrid joined, and for FSLogix the session hosts need no line of sight to a domain controller. Learn's prerequisites page says Entra-joined session hosts with FSLogix need hybrid identities, while the Entra Kerberos article lists cloud-only identities as supported in the Azure cloud; verify which applies to your design.

## Limits and failure points

- **Single sign-on.** Learn's single sign-on prerequisites say session hosts must be Entra joined or hybrid joined, and that hosts joined only to Entra Domain Services or AD DS are not supported. Users of managed-domain hosts therefore sign in with credentials.
- **Intune.** Session hosts joined to Entra Domain Services cannot be managed with Intune; Group Policy is the management route.
- **No privileged access.** The managed domain's domain controllers are not reachable. Learn describes a management VM joined to the managed domain with the usual AD DS tools such as Active Directory Administrative Center and the DNS and Group Policy snap-ins. Members of the *AAD DC Administrators* group get remote desktop access to machines joined to the managed domain.
- **Mostly read-only.** You cannot change user attributes, passwords or group memberships in a managed domain, apart from custom OUs. The OU structure is flat, and users and groups sit in the *AADDC Users* container.
- **No on-premises GPOs.** Group Policies, Sysvol contents, computer objects and OUs from on-premises AD DS are not synchronized, and schema extensions are not supported.
- **One managed domain per directory.** Learn's FAQ says a single Entra directory can have only one managed domain.
- **Passwords.** The default password lifetime is 90 days. Five invalid attempts within 2 minutes lock the account for 30 minutes in the managed domain; this does not lock the account in Microsoft Entra ID.
- **Hybrid identity matching.** For hybrid identities, Learn says the UPN or the SID must match between AD and Microsoft Entra ID.

## SKU and sizing guidance

Learn's [administration concepts](https://learn.microsoft.com/en-us/entra/identity/domain-services/administration-concepts) page describes three SKUs. The values are recommended capacity guidance, not enforced limits.

| SKU | Recommended object count | Recommended authentications | Backup frequency |
|---|---|---|---|
| Standard | Up to 25,000 | Up to 3,000 per hour | Every five days |
| Enterprise | 25,001 to 100,000 | 3,001 to 10,000 per hour | Every three days |
| Premium | 100,001 to 500,000 | 10,001 to 70,000 per hour | Daily; kept seven days, every third backup kept 30 days |

You can change the SKU after creation. Learn's replica-sets article says additional replica sets, up to five including the first, need Enterprise or Premium.

## When a managed domain fits

Our reading, based on the limits above:

- **It fits** when session hosts must run applications that need Kerberos or NTLM, you want Group Policy rather than Intune, and you do not want to operate domain controllers.
- **It is a poor fit** when you want single sign-on with Microsoft Entra authentication, Intune management of session hosts, schema changes or privileged domain administration.
- **If a user population is cloud-only** and no application needs NTLM or Kerberos, the Entra-joined route removes the managed domain and the password-hash step, but then FSLogix needs a profile-storage identity option that works with Entra-joined clients.

A pilot host pool shows the sign-in experience and the password-hash timing before you commit.

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Microsoft Entra Domain Services overview](https://learn.microsoft.com/en-us/entra/identity/domain-services/overview)
- [Microsoft Learn: Compare self-managed AD DS, Microsoft Entra Domain Services and Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/domain-services/compare-identity-solutions)
- [Microsoft Learn: Prerequisites for Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/prerequisites)
- [Microsoft Learn: Authentication in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/authentication)
- [Microsoft Learn: Configure single sign-on for Azure Virtual Desktop using Microsoft Entra authentication](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
- [Microsoft Learn: Create a host pool in Azure Virtual Desktop](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-host-pool)
- [Microsoft Learn: How objects and credentials are synchronized in a managed domain](https://learn.microsoft.com/en-us/entra/identity/domain-services/synchronization)
- [Microsoft Learn: Tutorial: Create and configure a managed domain](https://learn.microsoft.com/en-us/entra/identity/domain-services/tutorial-create-instance)
- [Microsoft Learn: Network considerations for Microsoft Entra Domain Services](https://learn.microsoft.com/en-us/entra/identity/domain-services/network-considerations)
- [Microsoft Learn: Management concepts for managed domains](https://learn.microsoft.com/en-us/entra/identity/domain-services/administration-concepts)
- [Microsoft Learn: Replica sets in Microsoft Entra Domain Services](https://learn.microsoft.com/en-us/entra/identity/domain-services/concepts-replica-sets)
- [Microsoft Learn: Microsoft Entra Domain Services FAQ](https://learn.microsoft.com/en-us/entra/identity/domain-services/faqs)
- [Microsoft Learn: Join a Windows Server VM to a managed domain](https://learn.microsoft.com/en-us/entra/identity/domain-services/join-windows-vm)
- [Microsoft Learn: Enable Microsoft Entra Domain Services authentication for Azure Files](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-identity-auth-domain-services-enable)
- [Microsoft Learn: Overview of Azure Files identity-based authentication for SMB](https://learn.microsoft.com/en-us/azure/storage/files/storage-files-active-directory-overview)
- [Microsoft Learn: Create a profile container with Azure Files and Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-profile-container-azure-ad)
