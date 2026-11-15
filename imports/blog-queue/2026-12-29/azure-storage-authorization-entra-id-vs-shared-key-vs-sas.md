---
title: "Azure Storage Authorization: Entra ID vs Shared Key vs SAS, and What Microsoft Recommends"
summary: "Choose how clients authorize to Azure Storage using Microsoft Learn: Entra ID with managed identities, Shared Key, SAS types, anonymous read, local users and Purview policies, with the recommendations, Conditional Access requirement and key protection advice."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [azure-storage-account, azure-blob-storage, azure-rbac]
keypoints:
  - "Microsoft recommends Microsoft Entra ID with managed identities for blob, queue and table data, because it is more secure and easier to use than Shared Key."
  - "Microsoft recommends disallowing Shared Key authorization for storage accounts, and disabling anonymous read access."
  - "When SAS is needed, Learn recommends a user delegation SAS, which is signed with Entra credentials and applies to blobs only."
  - "To protect a storage account with Conditional Access, you must disallow Shared Key authorization for it."
  - "Shared Key entries in diagnostic logs while it is disabled indicate trusted access. Manage account keys in Azure Key Vault."
faq:
  - q: "What does Microsoft recommend?"
    a: "According to Microsoft Learn, use Entra ID with managed identities for blob, queue and table data whenever possible, disallow Shared Key, use a user delegation SAS where SAS is needed, and disable anonymous access."
  - q: "What is the difference between SAS types?"
    a: "A service SAS or account SAS is signed with the account key. A user delegation SAS is signed with Entra credentials and applies to blobs only."
  - q: "What happens when Shared Key is disallowed?"
    a: "Clients must use Entra ID or a user delegation SAS."
  - q: "Which services does Shared Key cover?"
    a: "Blobs, files, queues and tables."
  - q: "How does Azure Files authorize over SMB?"
    a: "Learn describes identity-based authentication through Microsoft Entra Domain Services, Microsoft Entra Kerberos for hybrid identities or on-premises Active Directory Domain Services. With AD DS, Azure RBAC controls share-level access and NTFS DACLs enforce directory and file permissions."
---

Every request to Azure Storage must be authorized, and the right option depends on the service and the client. This guide follows the Microsoft Learn overview of authorization, which has separate tables for Blobs, Files (SMB), Files (REST), Queues and Tables.

## What Microsoft recommends

Learn says to use Microsoft Entra ID with managed identities for blob, queue and table data whenever possible, because it offers better security and ease of use than Shared Key. For apps outside Azure, managed identities are available through Azure Arc. Where SAS is needed, use a user delegation SAS.

## Blob options

| Option | Recommendation |
| --- | --- |
| Microsoft Entra ID | Recommended, with managed identities |
| Shared Key | Disallow it for your storage accounts |
| Shared access signature | Use user delegation SAS when necessary |
| Anonymous read access | Disable for all storage accounts |
| Storage Local Users | Supported for SFTP |
| Microsoft Purview protection policies | Preview, for Blob Storage and Data Lake Storage |

## Files, queues and tables

- **Files (SMB):** Entra ID is supported with Microsoft Entra Domain Services for cloud-only identities or Microsoft Entra Kerberos for hybrid identities. Shared Key is listed with the advice to disallow it. On-premises AD DS is supported, and its credentials must be synced to Entra ID.
- **Files (REST):** Entra ID with managed identities is recommended and Shared Key should be disallowed. User delegation SAS is not supported for Azure Files, and Learn does not recommend SAS tokens secured by the account key.
- **Queues:** Entra ID with managed identities is recommended and Shared Key should be disallowed. User delegation SAS is not supported for Queue Storage, and SAS tokens secured by the account key are not recommended.
- **Tables:** the same pattern as queues, with Entra ID with managed identities recommended and no user delegation SAS for Table Storage.

## How the options work

- **Shared Key:** applies to blobs, files, queues and tables. Each request carries a header signed with the account access key. Anyone holding the key effectively has access to all data.
- **SAS:** a signed URL that specifies permissions and a validity interval. A service SAS or account SAS is signed with the account key. A user delegation SAS is signed with Entra credentials and applies to blobs only.
- **Entra ID:** applies to blob, queue and table resources. Azure RBAC manages permissions, and Azure ABAC can add conditions to role assignments for blobs.
- **Anonymous read:** applies to blobs and is not recommended.
- **Storage Local Users:** SFTP for blobs and SMB for files, with container-level permissions.
- **Purview:** protection policies built on sensitivity labels can allow or deny access for Blob Storage and Data Lake Storage.
- **Azure Files over SMB:** Entra Domain Services or on-premises AD DS authentication. Azure RBAC controls access to Azure Files resources with Domain Services. With AD DS it covers share-level access and NTFS DACLs enforce directory and file permissions. SAS tokens can be used for Azure Files over REST.

## Protect account keys

Keys grant full data access and the ability to create SAS tokens. Learn advises using Azure Key Vault to manage and rotate keys, limiting and monitoring access, never hard-coding keys, rotating them if compromise is suspected and using a limited user delegation SAS where Entra authorization is not possible.

## Conditional Access and trusted access

To protect a storage account with Entra Conditional Access, you must disallow Shared Key authorization for it. If Shared Key is disabled but diagnostic logs still show Shared Key authorization, Learn says this indicates trusted access.

## Choosing

This section is a suggestion. For new workloads, start with managed identity and RBAC. Keep SAS for external, time-limited sharing, and plan a test before disallowing Shared Key because older tools may depend on it.

## Why disallow Shared Key

Learn's warning is that disallowing Shared Key prevents inadvertent use, and it recommends least-privilege access and disabling shared key access when it is not required. When Shared Key is disallowed, clients must use Entra ID or a user delegation SAS. Anyone holding an account key effectively has access to all data in the account.

## Per-service summary

- **Blobs:** Shared Key, SAS, Entra ID with RBAC and ABAC, anonymous read, Storage Local Users and Purview protection policies.
- **Files over SMB:** Entra ID (Domain Services or Entra Kerberos), on-premises AD DS, Shared Key and Storage Local Users.
- **Files over REST:** Entra ID, Shared Key and SAS, without user delegation SAS.
- **Queues and tables:** Shared Key, SAS and Entra ID with RBAC.

Learn also gives guidance by method: Entra ID with managed identities for OAuth-capable scenarios, Kerberos for Azure Files over SMB, and SAS for Azure Files over REST.

## Not covered

The page does not give role names, SAS token construction or Conditional Access steps. It links separate articles for those and for each Entra ID integration.

## Related

- [Azure Storage account](https://www.m365.fm/entity/azure-storage-account/)
- [Azure Blob Storage](https://www.m365.fm/entity/azure-blob-storage/)
- [Azure RBAC](https://www.m365.fm/entity/azure-rbac/)

## Sources

- [Authorize operations for data access (Microsoft Learn)](https://learn.microsoft.com/azure/storage/common/authorize-data-access)
