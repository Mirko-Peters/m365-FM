---
title: "Azure AD vs Microsoft Entra ID: The Name Change Explained"
summary: "Azure Active Directory is now Microsoft Entra ID. See what was renamed, the key dates in 2023, what stayed the same, and which older terms were deliberately not renamed or are deprecated."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [entra-id, microsoft-entra, azure-ad-b2c]
keypoints:
  - "Azure Active Directory, Azure AD and AAD are now called Microsoft Entra ID. It is a rename, not a new product."
  - "Microsoft announced the Entra brand on July 11, 2023, started renaming on August 15, 2023 and changed license display names on October 1, 2023."
  - "Licensing, pricing, SLAs, login URLs and APIs did not change, and existing deployments keep working without action."
  - "Active Directory, AD FS and AD DS were not renamed, because they are Windows Server products and not part of Azure AD."
  - "Azure AD Graph and the Azure AD PowerShell for Graph module are deprecated, so use Microsoft Graph and Microsoft Graph PowerShell instead."
faq:
  - q: "Is Azure AD the same as Microsoft Entra ID?"
    a: "Yes. Microsoft Learn states that Azure Active Directory, Azure AD and AAD are now Microsoft Entra ID. The rename does not change features, licensing, pricing or login URLs."
  - q: "When did Azure AD become Microsoft Entra ID?"
    a: "Microsoft Learn gives July 11, 2023 as the announcement date and August 15, 2023 as the start of the rename. License and service plan display names changed on October 1, 2023."
  - q: "Do I need to change anything after the rename?"
    a: "According to Microsoft Learn, existing deployments, configurations and integrations keep working without action. Developer tooling such as MSAL is unchanged, but deprecated items like Azure AD Graph still need a migration."
  - q: "Was Active Directory renamed too?"
    a: "No. Microsoft Learn lists Windows Server Active Directory, AD FS and AD DS as terms that were not renamed. They are separate from Microsoft Entra ID."
  - q: "What does the name Entra mean for Azure AD B2C?"
    a: "Microsoft Learn says Azure AD B2C was not renamed. It stopped accepting new customers on May 1, 2025, and Microsoft Entra External ID is named as its next-generation solution."
---

Azure Active Directory, also written Azure AD or AAD, is now called Microsoft Entra ID. Microsoft announced the change on July 11, 2023. The product is the same cloud identity and access management service. Features, licensing, pricing, login URLs and APIs stayed as they were.

## What was renamed

Microsoft Learn lists the new names. Display names for licenses and service plans changed on October 1, 2023, with pricing and capabilities unchanged.

| Old name | New name |
|---|---|
| Azure Active Directory, Azure AD, AAD | Microsoft Entra ID |
| Azure AD Free | Microsoft Entra ID Free |
| Azure AD Premium P1 | Microsoft Entra ID P1 |
| Azure AD Premium P2 | Microsoft Entra ID P2 |
| Azure AD External Identities | Microsoft Entra External ID |
| Azure AD Identity Governance | Microsoft Entra ID Governance |
| Azure AD Verifiable Credentials | Microsoft Entra Verified ID |
| Azure AD Workload Identities | Microsoft Entra Workload ID |
| Azure AD Domain Services | Microsoft Entra Domain Services |
| Azure AD Connect | Microsoft Entra Connect |
| Hybrid Azure AD Join | Microsoft Entra hybrid join |
| Azure AD Conditional Access | Microsoft Entra Conditional Access |
| Azure AD tenant | Microsoft Entra tenant |

Microsoft says the acronym ME-ID is acceptable where space is limited. Microsoft Entra Internet Access and Microsoft Entra Private Access are listed as new products, not renames.

## Key dates

- **July 11, 2023:** public announcement as part of the Microsoft Entra announcement.
- **August 15, 2023:** the rename started across Microsoft experiences.
- **October 1, 2023:** display names for SKUs and service plans changed.
- **End of 2023:** most text string changes in Microsoft and partner experiences were completed.

## What did not change

Microsoft Learn is explicit about continuity:

- **Service and access:** existing deployments, configurations and integrations keep working without action.
- **Commercial terms:** licensing, pricing, terms, SLAs, product certifications and support are unchanged.
- **URLs and APIs:** login URLs and APIs stay the same.
- **PowerShell:** existing Azure AD PowerShell for Graph cmdlets keep names that include `AzureAD`.
- **Developer tooling:** MSAL and developer experiences are unchanged.
- **Admin portals:** you manage Microsoft Entra ID in the Microsoft Entra admin center or the Azure portal.

This matters for old documentation and scripts. A script that calls an `AzureAD` cmdlet is not broken by the rename. It may, however, depend on a module that is deprecated for other reasons, covered below.

## What was not renamed

Some names with "Azure AD" or "Active Directory" in them were left alone, and some are deprecated.

- **Active Directory:** Windows Server Active Directory, Active Directory Federation Services (AD FS), Active Directory Domain Services (AD DS) and related features keep their names.
- **Azure Active Directory B2C:** not renamed. Microsoft Learn says it is still supported but stopped accepting new customers on May 1, 2025. Microsoft Entra External ID is the next-generation solution.
- **Azure AD Authentication Library (ADAL):** deprecated. Existing apps still work, but Microsoft no longer releases security fixes. Migrate to MSAL.
- **Azure AD Graph:** deprecated, with no new investment and no SLA beyond security fixes. Use Microsoft Graph.
- **Azure AD PowerShell for Graph module:** the rename page lists it as planned for deprecation on March 30, 2024. Microsoft Graph PowerShell is the recommended module.
- **Azure AD Sync and DirSync:** not supported and no longer work. Upgrade to Microsoft Entra Connect.
- **Account types and platform:** Microsoft account, work or school account and the Microsoft identity platform keep their names.

## What Microsoft Entra ID is

Microsoft Learn describes Microsoft Entra ID as "the foundational product of Microsoft Entra": a cloud-based identity and access management service that provides authentication, policy enforcement and protection for users, devices, apps and resources. Every new directory includes an initial domain such as `contoso.onmicrosoft.com`, and you can add custom domains.

If you are a Microsoft 365, Azure or Dynamics CRM Online subscriber, you already use Microsoft Entra ID. Every tenant is automatically a Microsoft Entra tenant.

Microsoft Entra is also the name of a product family. Besides Entra ID, Learn lists Microsoft Entra External ID, ID Governance, ID Protection, Verified ID, Workload ID, Domain Services, Private Access and Internet Access, and Microsoft Entra Agent ID for AI agents. License editions named for Entra ID are Free, P1 and P2, and Microsoft Entra Suite is listed among the licensing options. Entra is also included in Microsoft 365 and Enterprise Mobility + Security licenses.

## Practical checklist

1. **Update names in documents and training.** Use Microsoft Entra ID, and use Microsoft Entra ID P1 or P2 for licenses.
2. **Search scripts for retired dependencies.** Look for Azure AD Graph calls, the AzureAD PowerShell module and ADAL. Plan moves to Microsoft Graph, Microsoft Graph PowerShell and MSAL.
3. **Keep on-premises terms separate.** AD DS and AD FS are not part of the rename.
4. **Check for old sync tools.** Azure AD Sync and DirSync no longer work.
5. **Treat B2C separately.** Azure AD B2C keeps its name and has its own support horizon.

## Common mistakes

- **Treating the rename as a migration.** Nothing has to be moved because of the name alone.
- **Mixing up Entra ID and Active Directory.** Entra ID is a cloud service. AD DS is the Windows Server directory.
- **Assuming old module names are safe.** Unchanged cmdlet names do not mean the module is supported.
- **Searching only for the old name.** Newer Microsoft articles use Entra terms, so search for both.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)
- [Azure AD B2C](https://www.m365.fm/entity/azure-ad-b2c/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)

## Sources

- [Microsoft Learn: New name for Azure Active Directory](https://learn.microsoft.com/en-us/entra/fundamentals/new-name)
- [Microsoft Learn: What is Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/fundamentals/whatis)
- [Microsoft Learn: Azure AD B2C FAQ](https://learn.microsoft.com/en-us/azure/active-directory-b2c/faq)
- [Microsoft Learn: External ID overview](https://learn.microsoft.com/en-us/entra/external-id/external-identities-overview)
