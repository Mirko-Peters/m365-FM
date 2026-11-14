---
title: "Enable Microsoft Entra Kerberos for Azure Files Hybrid Identities"
summary: "Enable Microsoft Entra Kerberos authentication for Azure Files SMB shares: prerequisites, portal steps, admin consent, client settings, MFA exclusion, mounting, limitations and troubleshooting with Debug-AzStorageAccountAuth."
status: review
publish: false
author: mirko-p
date: 2026-12-24
topics: [microsoft-entra-kerberos, azure-files]
keypoints:
  - "Entra Kerberos works for hybrid and cloud-only identities on SMB shares. Only one identity source can be enabled per storage account."
  - "In the portal use Data storage > Classic file shares > Identity-based access > Microsoft Entra Kerberos > Set up, then grant admin consent to the generated service principal."
  - "Clients must be Entra joined or hybrid joined, and need Kerberos/CloudKerberosTicketRetrievalEnabled set to 1. Entra Domain Services or AD-only joined clients do not qualify."
  - "Exclude the storage account application from MFA Conditional Access policies that target all apps, or net use fails with System error 1327. MFA is not supported on these shares."
  - "Cross-tenant access is not supported, and cloud-only identities are not supported in Azure US Gov or Azure China 21Vianet."
faq:
  - q: "Which identities does Entra Kerberos support for Azure Files?"
    a: "Microsoft Learn says it enables Kerberos authentication through Microsoft Entra ID for hybrid identities, where AD DS is synced to Entra, and for cloud-only identities. You can enable only one identity source per storage account, so AD DS or Entra Domain Services must be disabled first."
  - q: "Which client operating systems are supported?"
    a: "The page lists Windows 11 with specific updates, Windows 10 2004 or later with the latest updates, Windows Server 2022 and Windows Server 2025. Clients must be Microsoft Entra joined or hybrid joined. Clients that do not meet the requirements need a cloud trust configuration instead."
  - q: "Why does net use fail with System error 1327?"
    a: "Learn says that if an MFA Conditional Access policy applies to all apps, the storage account application must be excluded from it. Otherwise net use fails with System error 1327. MFA is not supported on shares that use Entra Kerberos."
  - q: "What client setting is required?"
    a: "Enable Kerberos/CloudKerberosTicketRetrievalEnabled and set it to 1 on every client, using Intune, Group Policy or a registry key. In Intune use the Settings Catalog, not OMA-URI, because OMA-URI does not work on Azure Virtual Desktop multisession devices."
  - q: "How do I check my configuration?"
    a: "Run Debug-AzStorageAccountAuth from AzFilesHybrid module version 0.3.0 or later. Learn says it supports Entra Kerberos and AD DS, but not Entra Domain Services."
---

Microsoft Entra Kerberos lets users on Entra joined or hybrid joined Windows devices mount Azure file shares with their Entra identity, without line of sight to a domain controller for the ticket. This guide follows the Microsoft Learn article for enabling it on SMB file shares.

## What you get

Learn says Entra Kerberos enables Kerberos authentication through Microsoft Entra ID for hybrid identities (AD DS synced to Entra) and cloud-only identities. Only one identity source can be enabled per storage account. Kerberos tickets always use AES-256, and you choose SMB channel encryption separately.

## Prerequisites

- If you use a custom SMB security profile, **Kerberos** must be selected under **Authentication methods**.
- No other identity source. Disable AD DS or Entra Domain Services first. Learn points to a separate article for changing the identity source.
- For hybrid identities: AD DS plus Entra Connect Sync or Cloud Sync. Users and groups used for RBAC must be synced.
- The services `WinHttpAutoProxySvc` and `iphlpsvc` must be running.
- Client operating systems: Windows 11 (24H2 with KB5079391 or later, 25H2 with KB5079391, or 26H1 and later with KB5079489), Windows 10 2004 or later with the latest updates (KB5007253 recommended), Windows Server 2022 (KB5007254 recommended) or Windows Server 2025.
- Clients must be Entra joined or hybrid joined, not Entra Domain Services or AD-only joined. Clients that don't meet these requirements need a cloud trust configuration.

## Enable it in the portal

1. In the Azure portal, open the storage account.
2. Under **Data storage**, select **Classic file shares**.
3. Next to **Identity-based access**, select the configuration status, for example **Not configured**.
4. Under **Microsoft Entra Kerberos**, select **Set up** and tick the **Microsoft Entra Kerberos** checkbox.
5. Optional for hybrid identities that use File Explorer permissions: enter the on-premises domain name and domain GUID. `Get-ADDomain` gives `DNSRoot` and `ObjectGUID`. Skip this if you use icacls. File Explorer permissions are not supported for cloud-only identities.
6. Select **Save**.

## Grant admin consent

1. Open **Microsoft Entra ID** > **App registrations** > **All Applications**.
2. Select the application named like **[Storage Account] your-account.file.core.windows.net**.
3. Under **Manage**, select **API permissions**.
4. Select **Grant admin consent for [Directory Name]**, then **Yes**. This covers openid, profile and User.Read.

Don't edit this generated service principal beyond the documented steps.

## Required configuration

- **Cloud-only groups:** update the group tags in the application manifest to avoid authentication failures. Tickets are limited to 1,010 group SIDs.
- **MFA exclusion:** exclude the storage account application from MFA Conditional Access policies that apply to all apps, or `net use` fails with System error 1327.
- **Private endpoints:** add the private link FQDN to the storage account's Entra application.

## Permissions

Assign share-level permissions to an identity, and set directory and file-level permissions with Windows ACLs over SMB. For hybrid identities using icacls or File Explorer, the device needs network connectivity to Active Directory.

## Configure clients

Enable `Kerberos/CloudKerberosTicketRetrievalEnabled` and set it to 1 on every client with Intune, Group Policy or a registry key. In Intune use the **Settings Catalog**. Changes need a policy refresh or reboot.

If AD DS backed storage accounts must stay reachable, Learn says clients can't reach them after enabling this unless you add `Kerberos/HostToRealm` entries for each account. Realm names are case-sensitive and uppercase.

## Mount the share

```powershell
net use Z: \\<storage-account-name>.file.core.windows.net\<share-name>
```

## Disable it

Go to **Classic file shares** > **Identity-based access** > **Microsoft Entra Kerberos** > **Configure**, clear the checkbox and select **Save**. Until you configure another identity source, the shares have no identity-based access.

## Limitations

- Cloud-only identities aren't supported in Azure US Gov or Azure China 21Vianet. Hybrid identities are supported in all three clouds.
- Cross-tenant access isn't supported.
- External (B2B) users are supported only for FSLogix on Azure Virtual Desktop in the public cloud.
- MFA isn't supported on shares using Entra Kerberos.

## Troubleshooting

Run `Debug-AzStorageAccountAuth` from AzFilesHybrid module 0.3.0 or later. It supports Entra Kerberos and AD DS but not Entra Domain Services.

## Order of work

1. Check that no other identity source is enabled on the storage account, and that the SMB security profile allows Kerberos.
2. Confirm client operating systems, join state and the two required services.
3. Enable Entra Kerberos in the portal and grant admin consent.
4. Fix the MFA Conditional Access exclusion before the first mount test.
5. Set the client policy through the Settings Catalog and refresh policy or reboot.
6. Assign share-level and file-level permissions, then mount and test.

The page also says that if you have private endpoints, you add the private link FQDN to the application, so do that before testing from a private network.

## Related

- [Microsoft Entra Kerberos](https://www.m365.fm/entity/microsoft-entra-kerberos/)
- [Azure Files](https://www.m365.fm/entity/azure-files/)

## Sources

- [Enable Microsoft Entra Kerberos authentication for hybrid identities on Azure Files](https://learn.microsoft.com/azure/storage/files/storage-files-identity-auth-hybrid-identities-enable)
