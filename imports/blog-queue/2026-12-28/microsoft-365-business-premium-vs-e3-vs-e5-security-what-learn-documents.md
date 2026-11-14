---
title: "Microsoft 365 Business Premium vs E3 vs E5: What Microsoft Learn Documents About Security"
summary: "What Microsoft Learn states about security in Business Premium, E3 and E5: the 300 user limit, Defender for Business, Entra ID P1 and P2 inclusion, the Defender Suite add-on and where the official plan comparison tables are. Learn has no single side-by-side security table."
status: review
publish: false
author: mirko-p
date: 2026-12-28
topics: [microsoft-365-business-premium, microsoft-365-e3, microsoft-365-e5]
keypoints:
  - "Learn says Business Premium plans are for organizations with up to 300 users. Larger organizations should consider the enterprise plans."
  - "Business Premium includes Microsoft Defender for Business, Defender for Office 365 Plan 1, Entra ID P1 and full Intune capabilities, according to the Learn FAQ pages."
  - "Entra ID P1 is included in Microsoft 365 E3 and E5. Entra ID P2 is included in Microsoft 365 E5, E7 and the Defender Suite."
  - "Microsoft Defender Suite is an add-on for Business Premium and includes Defender for Endpoint Plan 2. Defender for Business does not support mixed licensing."
  - "The security licensing guidance page only lists services and points to two plan comparison tables. It has no per-feature rows for these plans."
faq:
  - q: "Is there a Learn page that compares Business Premium, E3 and E5 security features?"
    a: "The pages I read do not contain one. The Microsoft 365 security licensing guidance page lists services and points to two downloadable comparison tables, one for Enterprise and Frontline Workers plans and one for Small and Medium Business plans."
  - q: "What is the user limit for Business Premium?"
    a: "According to Microsoft Learn, Microsoft 365 Business plans are designed for organizations with up to 300 users, and larger organizations should consider the enterprise plans."
  - q: "Which plans include Entra ID P1 and P2?"
    a: "Learn says P1 is included with Microsoft 365 E3, E5 and E7 and with Business Premium. P2 is included with Microsoft 365 E5 and E7, the Microsoft Defender Suite and the Defender Suite add-ons for Business Premium."
  - q: "What endpoint security does Business Premium include?"
    a: "Microsoft Defender for Business, which is built on Defender for Endpoint capabilities and designed for small and medium-sized business up to 300 users. Defender for Endpoint Plan 1 or 2 can be added."
  - q: "Can Defender for Business and Defender for Endpoint Plan 2 be mixed?"
    a: "No. Learn says Defender for Business does not support mixed licensing, and a tenant with both defaults to the Defender for Business experience unless all users are licensed for Plan 2 and Microsoft Support is contacted."
---

Searches for Business Premium versus E3 versus E5 expect a feature table. The Microsoft Learn pages I read do not contain one for security. This article collects what Learn does state, and says where the official comparison tables are.

## Where the comparison lives

The Microsoft 365 security licensing guidance page lists services under Microsoft Defender, Microsoft Entra, Microsoft Intune, Microsoft Priva and Microsoft Purview. It does not mention Business Premium and has no per-plan rows. It points to two downloadable tables: the Microsoft 365 Comparison table for Enterprise and Frontline Workers Plans, and the Microsoft 365 Comparison table for Small and Medium Business Plans. It also says some tenant services cannot limit benefits to specific users, and that licensing terms are governed by the Product Terms.

## What Learn says about Business Premium

- Plans for up to 300 users. Organizations with more than 300 users should consider enterprise plans.
- It includes everything in Business Standard, plus Microsoft Defender for Business and Microsoft Defender for Office 365 Plan 1.
- Defender for Business is built on Defender for Endpoint capabilities and designed for businesses with up to 300 users.
- Microsoft Entra ID P1 is included.
- Subscribers are licensed to use full Intune capabilities for iOS, Android, Mac and other cross-platform device management.
- Microsoft Defender Suite is available as an add-on and includes Defender for Endpoint Plan 2. You can also add Defender for Endpoint Plan 1 or Plan 2.

## Microsoft Entra ID inclusion

| Edition | Included in |
| --- | --- |
| Entra ID P1 | Microsoft 365 E3, E5 and E7, F1 and F3, Enterprise Mobility + Security E3, and Business Premium |
| Entra ID P2 | Microsoft 365 E5 and E7, Microsoft Defender Suite, Enterprise Mobility + Security E5, and the Defender Suite add-ons for Business Premium |

The Entra licensing page also compares authentication features by tier. For example, Conditional Access appears with P1 and P2, while risk-based Conditional Access appears only with P2. SSPR with writeback is listed for P1 and P2.

## The mixed licensing rule

Learn says Defender for Business does not support mixed licensing. A tenant with Defender for Business and Defender for Endpoint Plan 2 defaults to the Defender for Business experience. To switch, license all users for Defender for Endpoint Plan 2, standalone or through the Defender Suite, and contact Microsoft Support. Organizations with Defender for Business server licenses that move to the Defender Suite need to change the server plan to Defender for Endpoint for servers or Defender for Servers.

## Other points from the Business Premium FAQ pages

- Business Premium includes Intune and Defender for Business to help manage iOS, iPadOS and macOS devices.
- Windows Autopilot is described as using a supported version of Windows Semi-Annual Enterprise Channel to set up PCs with business critical apps, policies and features such as BitLocker before the PCs go to users.
- Microsoft Defender Suite is described as available as an add-on for the commercial and non-profit offerings of Business Premium.
- Learn also lists a separate FAQ on how Business Premium helps support personal devices, which this article does not summarize.

## What the pages do not say

The pages I read do not list the contents of Microsoft 365 E3 or E5 for Defender or Purview features, and the Business Premium pages do not mention E3 or E5. I cannot give a feature-by-feature table without inventing values, so use the two comparison tables the Learn page links.

## How to compare for your organization

This approach is a suggestion, not Microsoft guidance.

1. Count users. Above 300 users, Business Premium is not designed for you according to Learn.
2. Download the matching comparison table and list the security capabilities you need.
3. Check whether the Defender Suite add-on closes your gap on Business Premium.
4. Confirm the final licensing terms in the Product Terms or with your partner.

## Not covered

No prices, no Purview feature rows, and no E3 or E5 Defender detail. The licensing guidance page shows conflicting dates in its metadata, so check the current version.

## Related

- [Microsoft 365 Business Premium](https://www.m365.fm/entity/microsoft-365-business-premium/)
- [Microsoft 365 E3](https://www.m365.fm/entity/microsoft-365-e3/)
- [Microsoft 365 E5](https://www.m365.fm/entity/microsoft-365-e5/)

## Sources

- [Microsoft 365 security licensing guidance](https://learn.microsoft.com/office365/servicedescriptions/microsoft-365-service-descriptions/microsoft-365-tenantlevel-services-licensing-guidance/microsoft-365-security-compliance-licensing-guidance)
- [Microsoft 365 Business Premium security FAQ](https://learn.microsoft.com/microsoft-365/admin/security-and-compliance/m365bp-security-faq)
- [Microsoft 365 Business Premium FAQ](https://learn.microsoft.com/microsoft-365/business-premium/microsoft-365-business-faqs)
- [Microsoft Entra licensing](https://learn.microsoft.com/entra/fundamentals/licensing)
