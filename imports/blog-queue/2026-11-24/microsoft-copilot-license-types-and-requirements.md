---
title: "Microsoft 365 Copilot License Types Explained: Options, Base Plans and Requirements"
summary: "Copilot license types and requirements per Microsoft Learn: Microsoft 365 E7, the Copilot Business add-on, the standard add-on, eligible base plans, and the technical prerequisites."
status: review
publish: false
author: mirko-p
date: 2026-11-24
topics: [copilot, microsoft-365-e7, microsoft-365-admin-center, copilot-chat]
keypoints:
  - "Microsoft Learn lists three routes: Microsoft 365 E7, the Copilot Business add-on for up to 300 users, and the Copilot add-on for eligible plans."
  - "Users need a Copilot license plus a qualifying prerequisite license. Device-based licensing for Microsoft 365 Apps for enterprise isn't supported."
  - "Copilot Business needs an annual commitment and supports up to 300 licensed users per tenant."
  - "Users need a work or school account in Microsoft Entra ID. Copilot isn't available in group mailboxes."
  - "Prices aren't on the licensing page. Verify the current price on Microsoft's pricing page before budgeting."
faq:
  - q: "What are the Microsoft Copilot license types?"
    a: "Microsoft Learn lists Microsoft 365 E7, which includes Copilot, the Microsoft Copilot Business add-on for organizations with up to 300 users, and the Microsoft Copilot add-on for eligible commercial, US Government and education plans. All are assigned in the Microsoft 365 admin center."
  - q: "Do I need a base Microsoft 365 license for Copilot?"
    a: "Yes. The requirements page says users need a Microsoft Copilot license and a qualifying prerequisite license. Eligible base plans include Microsoft 365 E3, E5, F1, F3, Business Premium, Business Standard and Business Basic, among others."
  - q: "How much does Microsoft Copilot cost?"
    a: "The Microsoft Learn licensing page gives no prices and refers to Microsoft's Copilot pricing and plans page. The only billing term it states is that Copilot Business is available with an annual commitment."
  - q: "How do I check which Copilot service plans a user has?"
    a: "Sign in to the Microsoft 365 admin center as an AI administrator, select Support, then Help and support, and enter copilot missing to open the Copilot Service Plan Diagnostic. Select Run diagnostics, enter the email address or UPN and select Run tests."
---
Copilot licensing has three documented routes and one rule that applies to all of them: a user needs a Copilot license and a qualifying base license. This article lists the options and eligible base plans from Microsoft Learn, then covers the technical requirements and how to verify an assignment. Microsoft Learn now calls the product Microsoft Copilot. Older pages say Microsoft 365 Copilot.

## The license options

Microsoft Learn lists these options:

| Option | Who it is for | Notes from Microsoft |
|---|---|---|
| Microsoft 365 E7 | Enterprise customers | The page says Copilot is available with E7, and E7 includes Microsoft Copilot. |
| Microsoft Copilot Business (add-on) | Organizations with up to 300 users on eligible Microsoft 365 Business licenses | Same Copilot capabilities, with SMB purchasing options. Annual commitment, up to 300 licensed users per tenant. Larger organizations use the enterprise options. |
| Microsoft Copilot (add-on) | Eligible commercial, US Government and education plans | Requires an eligible base plan, listed below. |

The page adds that Education or Business subscriptions that don't include Teams can also purchase Copilot licenses.

## Eligible base plans

The commercial list on the licensing page is long. The main entries:

- **Microsoft 365:** E7, E5, E3, F1, F3, Business Premium, Business Standard, Business Basic, Apps for enterprise and Apps for business.
- **Office 365:** E5, E3, E1, F3.
- **Copilot Business:** Business Premium, Business Standard, Business Basic, Apps for business and Microsoft Teams Essentials.
- **Other qualifying plans:** Teams (Enterprise, EEA and Essentials), Exchange Online (Plan 1, Plan 2, Kiosk), SharePoint (Plan 1, Plan 2, Kiosk), OneDrive for work or school (Plan 1, Plan 2), Planner and Project plans, Visio (Plan 1, Plan 2) and Microsoft Clipchamp.

**US Government (GCC, GCC High and DoD):** the add-on applies to Microsoft 365 G5, G3 and F1, Office 365 G5, G3, G1 and F3, and certain Exchange, SharePoint, OneDrive and Visio plans.

**Education:** the offer is for faculty, staff and students aged 13 and older through Enrollment for Education Solutions or a Cloud Solution Provider. Eligible plans are Microsoft 365 A5, A3, A2 and A1, and Office 365 A5, A3 and A1.

Because licensing terms change, the page itself tells readers to confirm eligibility in the Microsoft Product Terms and the Copilot service description before buying.

## What the pages don't say

- **Prices.** The licensing page states no prices and points to Microsoft's pricing page. Only the Copilot Business annual commitment is mentioned.
- **Copilot Chat inclusion.** The page doesn't state what Copilot Chat is included with for commercial or government customers. For students aged 13 and older, it says Copilot Chat is available.
- **Pay-as-you-go agents.** The licensing page doesn't mention them. Microsoft's architecture page notes that users with Basic licenses don't have access to Microsoft Graph and can use a pay-as-you-go agent with organizational access to reach organizational content.

## Technical requirements

Having the license isn't enough. The requirements page lists:

- **Account.** A work or school account in Microsoft Entra ID.
- **Mailbox.** A primary mailbox hosted in Exchange Online. Copilot can also use content the user can access in archive, shared and delegate mailboxes. It isn't available in group mailboxes.
- **Apps.** Microsoft 365 Apps deployed to users who need Copilot in desktop apps. The Office Feature Updates task must run on schedule. Connected experience privacy controls can affect availability. Device-based licensing for Microsoft 365 Apps for enterprise isn't supported.
- **OneDrive.** Some features require the user to have a OneDrive account.
- **Teams.** Copilot in Teams runs on supported Windows, Mac, web, Android and iOS clients. To reference meeting content after a meeting ends, transcription or recording must be configured. For Copilot in PSTN calls, a Teams Phone license, a calling plan and a Copilot license are required.
- **Network.** Allow the worldwide Microsoft 365 URLs and IP ranges, add the Copilot endpoints, and allow `*.cloud.microsoft`. Microsoft doesn't support allowing only selected URLs within that domain. Verify WebSocket Secure connectivity to `*.office.com`, `*.cloud.microsoft` and `copilot.cloud.microsoft`.
- **Operating systems.** Windows 11, version 22H2 or later, with EdgeUpdate 1.3.253.25 or later; macOS 13 (Ventura) or later; iOS and iPadOS 16.0 or later; Android 10 or later.
- **Browsers.** Edge, Chrome, Firefox and Safari. Third-party cookies must be enabled for Copilot in Word, Excel and PowerPoint for the web.

## Assign the license and verify it

1. Sign in to the Microsoft 365 admin center and assign the Copilot license to the user, as described in Microsoft's assign-licenses article.
2. Review the app and network requirements.
3. Check the service plans with the diagnostic tool. It needs an AI administrator account. Go to **Support** > **Help and support**, enter `copilot missing`, select **Run diagnostics**, enter the email address or UPN and select **Run tests**.

If the admin center shows a plan as assigned but the diagnostic doesn't, Microsoft describes this fix for older accounts: open the user, clear the affected service plans, save, enable them again, save and rerun the tool. Service plans named in the table on that page include Copilot in Teams, Copilot in Microsoft 365 apps, Copilot in SharePoint, Copilot Studio, Graph Connectors and Microsoft Copilot Chat for work.

## Common mistakes

- Buying Copilot licenses for users who don't have an eligible base license.
- Using Copilot Business in an organization with more than 300 users.
- Assigning licenses to users with device-based Microsoft 365 Apps licensing.
- Expecting Copilot in group mailboxes.
- Treating a license assignment as proof of function. Check service plans and network access.

## Related

- [Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft 365 E7](https://www.m365.fm/entity/microsoft-365-e7/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Copilot Chat](https://www.m365.fm/entity/copilot-chat/)

## Sources

- [License options for Microsoft Copilot, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-licensing)
- [Microsoft Copilot requirements, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-requirements)
- [Microsoft Copilot service plan diagnostic tool, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-service-plans)
- [Microsoft Copilot architecture, Microsoft Learn](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-architecture)
