---
title: "Entra Domain Services vs Self-Managed AD DS vs Entra ID: Choosing a Directory Service"
summary: "Compare Microsoft Entra Domain Services, self-managed AD DS and Microsoft Entra ID using Microsoft Learn's comparison: what each service does, which protocols it supports and where each one fits."
status: review
publish: false
author: mirko-p
date: 2027-01-13
topics: [entra-domain-services, entra-id, active-directory]
keypoints:
  - "Learn describes three directory options: AD DS, Microsoft Entra ID and Microsoft Entra Domain Services, which share a name and technology but serve different needs."
  - "Entra Domain Services is a managed domain: Microsoft deploys and maintains the domain controllers, and you get Kerberos, NTLM, LDAP, domain join and Group Policy."
  - "Self-managed AD DS allows schema extensions and Domain or Enterprise admin rights, but you run the VMs, patching and security yourself."
  - "Entra joined devices use OAuth and OpenID Connect and MDM such as Intune; Domain Services-joined devices use Kerberos, NTLM and Group Policy."
  - "With AD FS federation there is no current password hash in Domain Services, so it cannot validate those users' credentials."
faq:
  - q: "What is the difference between Microsoft Entra Domain Services and Microsoft Entra ID?"
    a: "According to Microsoft Learn, Microsoft Entra ID is cloud-based identity and mobile device management for resources such as Microsoft 365 and SaaS apps. Microsoft Entra Domain Services provides managed domain services with a subset of AD DS features such as domain join, Group Policy, LDAP and Kerberos or NTLM authentication. Domain Services integrates with Entra ID."
  - q: "Does Entra Domain Services support schema extensions?"
    a: "No. The Learn comparison table marks schema extensions as not available for a managed domain and available for self-managed AD DS. The same table shows that Domain or Enterprise administrator privileges are also not available in a managed domain."
  - q: "Can I create trusts with Entra Domain Services?"
    a: "Yes. The Learn table shows AD domain and forest trusts as supported for a managed domain, with a note that this requires the Enterprise SKU. The article also states you can create forest trusts between Domain Services and on-premises environments."
  - q: "When does self-managed AD DS in Azure make sense?"
    a: "Learn says self-managed AD DS adds maintenance overhead but lets you do extra tasks such as extending the schema or creating forest trusts. It describes two common models: a standalone cloud-only AD DS on Azure VMs, or an on-premises domain extended to Azure over VPN or ExpressRoute."
  - q: "Why would Domain Services not validate passwords in a federated setup?"
    a: "Microsoft Learn explains that if on-premises AD DS and Microsoft Entra ID use federated authentication with AD FS, no current or valid password hash is available in Domain Services. Accounts created before federation may hold an old hash that likely does not match the on-premises password, so Domain Services cannot validate the credentials."
---

My short reading of the Learn comparison, not a Microsoft recommendation: if your workload needs Kerberos, NTLM, LDAP or Group Policy and you do not want to run domain controllers, Microsoft Entra Domain Services is the managed option. If you need full control, schema changes or Domain Admin rights, you run self-managed AD DS. If your users and devices live in the cloud and sign in over the internet, Microsoft Entra ID alone may be enough. This article follows the Microsoft Learn comparison page for these three services.

## The three options in one view

Learn describes them as three Active Directory-based identity solutions that share a common name and technology but are designed for different demands.

- **Active Directory Domain Services (AD DS):** an enterprise-ready LDAP server with identity and authentication, computer object management, Group Policy and trusts. Learn calls it a central component in many organizations with an on-premises IT environment.
- **Microsoft Entra ID:** cloud-based identity and mobile device management that provides user accounts and authentication for resources such as Microsoft 365, the Microsoft Entra admin center and SaaS applications. It can be synchronized with on-premises AD DS.
- **Microsoft Entra Domain Services:** managed domain services with a subset of fully compatible traditional AD DS features such as domain join, Group Policy, LDAP and Kerberos or NTLM authentication. It integrates with Microsoft Entra ID, which itself can synchronize with on-premises AD DS.

Learn gives an example of the first decision: if you mostly manage cloud-only users on mobile devices, it may not make sense to build and run your own AD DS. You could simply use Microsoft Entra ID.

## Managed domain vs self-managed AD DS

Both provide traditional authentication for apps that run in the cloud. The difference is who runs it.

With Domain Services, Microsoft deploys and maintains the core service components. You do not deploy, manage, patch and secure the VMs, the Windows Server OS or the domain controllers. The service offers a smaller feature subset, which reduces design and management complexity. Learn notes there are no AD forests, domains, sites or replication links to design and maintain, and you can still create forest trusts with on-premises environments.

With self-managed AD DS you maintain all the infrastructure and directory components. That is more work, but it allows extra tasks such as extending the schema.

Learn lists two common models for self-managed AD DS that serves cloud apps:

1. **Standalone cloud-only AD DS.** Azure VMs are domain controllers in a separate, cloud-only environment with no link to on-premises AD DS. A different set of credentials is used to sign in and administer the VMs.
2. **Extend the on-premises domain to Azure.** An Azure virtual network connects to the on-premises network over VPN or ExpressRoute, and Azure VMs domain-join to the on-premises domain. An alternative is to promote Azure VMs as replica domain controllers that replicate over that connection.

### Feature table from Learn

| Feature | Managed domain | Self-managed AD DS |
| --- | --- | --- |
| Managed service | Yes | No |
| Secure deployments | Yes | Administrator secures the deployment |
| DNS server | Yes (managed service) | Yes |
| Domain or Enterprise administrator privileges | No | Yes |
| Domain join, NTLM and Kerberos authentication | Yes | Yes |
| Kerberos constrained delegation | Resource-based | Resource-based and account-based |
| Custom OU structure, Group Policy | Yes | Yes |
| Schema extensions | No | Yes |
| AD domain or forest trusts | Yes (requires Enterprise SKU) | Yes |
| Secure LDAP (LDAPS), LDAP read | Yes | Yes |
| LDAP write | Yes (within the managed domain) | Yes |
| Geo-distributed deployments | Yes | Yes |

## Domain Services vs Microsoft Entra ID

Entra ID manages the identity of devices and controls access to corporate resources from them. Users can register personal devices, and organization-owned Windows devices can be Microsoft Entra joined or hybrid joined. Learn lists these benefits of Entra joined devices: single sign-on to apps secured by Entra ID, policy-compliant roaming of user settings, access to the Windows Store for Business with corporate credentials, Windows Hello for Business, and restricted access from devices that comply with corporate policy.

Learn's comparison of the two device models:

| Aspect | Microsoft Entra joined | Domain Services-joined |
| --- | --- | --- |
| Controlled by | Microsoft Entra ID | The managed domain |
| Representation | Device objects in the Entra directory | Computer objects in the managed domain |
| Authentication | OAuth and OpenID Connect | Kerberos and NTLM |
| Management | MDM such as Intune | Group Policy |
| Networking | Works over the internet | Must be connected to or peered with the virtual network of the managed domain |
| Good for | End-user mobile or desktop devices | Server VMs deployed in Azure |

Learn says Domain Services-joined devices let apps use Kerberos and NTLM, so legacy applications can run on Azure VMs as part of a lift-and-shift strategy.

## A decision path

This is my reading of the Learn comparison, not a Microsoft rule.

1. Are all your apps modern and cloud-based, using OAuth or OpenID Connect? Entra ID is the starting point.
2. Does a lifted-and-shifted app need Kerberos, NTLM, LDAP or domain join, and you want no domain controllers to patch? Look at Domain Services.
3. Do you need schema extensions or Domain or Enterprise administrator privileges? The table says a managed domain does not offer them, so plan self-managed AD DS.
4. Do you need account-based Kerberos constrained delegation? The table lists only resource-based delegation for a managed domain.

## Check this before choosing Domain Services

Learn ends the page with a warning about federation. If on-premises AD DS and Microsoft Entra ID are configured for federated authentication with AD FS, there is no current or valid password hash in Domain Services. Entra accounts created before federation might have an old hash that likely does not match the on-premises password. As a result, Domain Services cannot validate those users' credentials.

The comparison page ends with that sentence and gives no further detail on this case. The page links to a separate Learn article on how objects and credentials are synchronized in a managed domain. My advice, not a Microsoft statement: read it before you plan a federated setup.

## Related

- [Microsoft Entra Domain Services](https://www.m365.fm/entity/entra-domain-services/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Active Directory](https://www.m365.fm/entity/active-directory/)

## Sources

- [Compare Microsoft directory-based services - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/domain-services/compare-identity-solutions)
