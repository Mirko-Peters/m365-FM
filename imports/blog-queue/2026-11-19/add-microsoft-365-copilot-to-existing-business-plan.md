---
title: "How to Add Microsoft 365 Copilot to an Existing Business Plan (Licenses and Steps)"
summary: "How to add Copilot to a Microsoft 365 or Office 365 business plan: which base licenses qualify, the Copilot Business add-on for up to 300 users, and the admin center steps to assign it."
status: review
publish: false
author: mirko-p
date: 2026-11-19
topics: [copilot, microsoft-365-admin-center]
keypoints:
  - "Copilot is an add-on. It needs an eligible base license and is not sold standalone. Microsoft 365 E7 includes it."
  - "Microsoft Copilot Business is the add-on for organizations with up to 300 users and an annual commitment. Larger organizations use enterprise licensing."
  - "Assign it in the Microsoft 365 admin center under Billing, Licenses, then Microsoft Copilot. Check the result under Users, Active users."
  - "In some apps Copilot can take up to 24 hours to appear. Users may need to restart or refresh the app."
  - "Guests and cross-tenant users can't be assigned a Copilot license. Copilot Chat needs no Copilot license for eligible users."
faq:
  - q: "Do I need Microsoft 365 Copilot or Microsoft Copilot? What is the difference?"
    a: "Microsoft Learn's current requirements page says Microsoft Copilot was formerly named Microsoft 365 Copilot, and Microsoft Copilot Chat was formerly Microsoft 365 Copilot Chat. Older pages and URLs still use the old name. The license you assign in the admin center is the same product."
  - q: "Which business plans can I add Copilot to?"
    a: "According to Microsoft Learn, the Microsoft Copilot Business add-on is listed for Microsoft 365 Business Premium, Business Standard, Business Basic, Microsoft 365 Apps for Business and Microsoft Teams Essentials. The wider list also includes Microsoft 365 E3, E5, F1 and F3, Office 365 E1, E3, E5 and F3, and several single-service plans."
  - q: "Is there a user limit for Copilot Business?"
    a: "Yes. Microsoft Learn says Microsoft Copilot Business is for organizations with up to 300 users per tenant and is available with an annual commitment. Organizations with more than 300 users should use the enterprise licensing options."
  - q: "How long until users see Copilot after I assign the license?"
    a: "Microsoft Learn says that for some apps users might need to wait up to 24 hours for Copilot to appear and may need to restart or refresh the app. The page gives no timing for other apps."
  - q: "Do users need a Copilot license to use Copilot Chat?"
    a: "No. Microsoft Learn's requirements page says Copilot Chat is available to users with an eligible Microsoft 365 subscription and that no Copilot license is required for eligible users."
---
To add Copilot to an existing business plan, you buy the Copilot add-on that fits your plan and assign it to users in the Microsoft 365 admin center. Copilot is not sold on its own. Each option needs an eligible base license, and users get access after you assign the license, sometimes with a delay of up to 24 hours.

A note on names: Microsoft Learn now calls the paid product **Microsoft Copilot** and says it was formerly **Microsoft 365 Copilot**. Many search results and links still use the old name. Both refer to the license described here.

## Step 1: Check that your plan qualifies

Microsoft Learn says Copilot is available with Microsoft 365 E7 or as an add-on for eligible commercial, government and education plans. For commercial customers, the add-on options are:

- **Microsoft Copilot Business**, for organizations with up to 300 users. Listed base plans: Microsoft 365 Business Premium, Business Standard, Business Basic, Microsoft 365 Apps for Business and Microsoft Teams Essentials.
- **Microsoft 365 plans:** E7 (includes Copilot), E5, E3, F1, F3, Business Premium, Business Standard, Business Basic, Apps for enterprise and Apps for business.
- **Office 365 plans:** E5, E3, E1 and F3.
- **Other eligible plans:** Teams Enterprise, EEA and Essentials, plus eligible Exchange Online, SharePoint, OneDrive for work or school, Planner and Project, and Visio plans and Microsoft Clipchamp. Check the page for the exact plan names.

Government plans (GCC, GCC High and DoD) and education plans (A1, A3, A5 for faculty, staff and students aged 13 and older) have their own lists on the same page. The Business add-on is not listed for them. Microsoft says licensing can change, so confirm eligibility in the Product Terms and the service description before you buy.

## Step 2: Buy the add-on

The licensing page does not describe a click-by-click purchase path for commercial customers. It names Enrollment for Education Solutions (EES) or a Cloud Solution Provider (CSP) as the purchase channels for the education offer, so ask your Microsoft partner or account team how to buy for your plan. The licensing page notes Copilot Business needs an annual commitment, and that organizations above 300 users should use enterprise licensing.

You might need more licenses for Microsoft Purview and SharePoint Advanced Management, according to the setup article. Those are recommended foundations for governance, not requirements for the license itself.

## Step 3: Prepare users and apps

Before you assign licenses, Microsoft says to provision users and assign their Microsoft 365 licenses first. Then check these points:

1. **Account type.** Users need a work or school account in Microsoft Entra ID.
2. **Update channel.** Copilot is available in all update channels except Semi-Annual Enterprise Channel. Microsoft recommends Current Channel or Monthly Enterprise Channel for production.
3. **Licensing model.** Copilot isn't available with device-based licensing for Microsoft 365 Apps for enterprise.
4. **Mailbox.** Mailbox-based experiences need an Exchange Online mailbox. Copilot isn't available in group mailboxes.
5. **Network.** Allow the worldwide Microsoft 365 URLs and the Copilot endpoints, including `*.cloud.microsoft`.

Microsoft's readiness checklist in the setup article is short: set up a test environment, run a pilot, develop a communication plan, review Conditional Access policies, review SharePoint search and Advanced Management policies, and make sure the network complies. The pages I read don't define a pilot size, so choose a group that matches your risk and budget.

## Step 4: Assign the license

Microsoft Learn's setup article gives this path:

1. Sign in to the Microsoft 365 admin center and go to **Billing** > **Licenses**.
2. Select **Microsoft Copilot**.
3. On the product details page, assign licenses to users.
4. To confirm, go to **Users** > **Active users**.

You can also manage Copilot licenses from the Copilot page in the admin center. After you assign a license, the system sends the user a notification email. Guests and cross-tenant users can't be assigned Copilot licenses.

## Step 5: Wait, then verify

Microsoft says that in some apps users might wait up to 24 hours for Copilot to appear, and may need to restart or refresh the app. Users sign in with their work or school account.

To check a single account, use the **Copilot License Details** diagnostic that Microsoft links from its requirements page. It verifies whether a user account meets the access requirements.

## Which option fits

| Situation | Documented option |
|---|---|
| Up to 300 users on Business Basic, Standard, Premium, Apps for Business or Teams Essentials | Microsoft Copilot Business add-on |
| More than 300 users | Enterprise licensing options |
| Microsoft 365 E3, E5 or F plans | Copilot add-on for that plan, or E7 |
| Only chat access needed | Copilot Chat, no Copilot license for eligible users |

## Common mistakes

- Buying Copilot without checking the base plan.
- Assigning licenses to guests or cross-tenant users.
- Testing before the app has refreshed, or in a read-only file.
- Using Semi-Annual Enterprise Channel or device-based licensing.
- Mixing up the old and new product names when reading older guides.

## Related

- [Microsoft 365 Copilot](https://www.m365.fm/entity/copilot/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft 365 Copilot Chat](https://www.m365.fm/entity/copilot-chat/)
- [Licensing specialist](https://www.m365.fm/entity/licensing-specialist/)

## Sources

- [Microsoft Learn: License options for Microsoft Copilot](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-licensing)
- [Microsoft Learn: Microsoft Copilot setup](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-setup)
- [Microsoft Learn: Microsoft Copilot requirements](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-requirements)
- [Microsoft Learn: Welcome end users to Microsoft Copilot](https://learn.microsoft.com/en-us/microsoft-365-copilot/microsoft-365-copilot-enable-users)
