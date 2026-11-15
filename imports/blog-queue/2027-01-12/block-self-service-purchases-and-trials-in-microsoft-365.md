---
title: "How to Block Self-Service Purchases and Trials in Microsoft 365"
summary: "Control self-service purchases and trials in the Microsoft 365 admin center: the path, the three policy options, roles, defaults, the 72-hour delay, billing roles and data processed, and what the page leaves out such as PowerShell cmdlet details."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [microsoft-365-admin-center]
keypoints:
  - "Path: Settings > Org settings > Services tab > Self-service trials and purchases. Select a product, choose an option and select Save changes."
  - "Options are Allow, Allow for trials only and Do not allow. The Global Administrator role is needed."
  - "Only eligible products listed in the admin center can be controlled. No single command turns it off tenant-wide, so set each product. New products allow purchase by default."
  - "The MSCommerce PowerShell module and the AllowSelfServicePurchase policy are named, but the page gives no cmdlets, syntax or product IDs."
  - "When the policy is enabled, Microsoft Commerce processes directory data from an access token: name, email, IP address, tenant and user GUIDs."
faq:
  - q: "Where do I turn self-service purchases off?"
    a: "In the Microsoft 365 admin center go to Settings > Org settings > Services tab > Self-service trials and purchases, select the product, choose Do not allow and select Save changes."
  - q: "What options exist?"
    a: "Allow, Allow for trials only and Do not allow."
  - q: "Is there one switch for all products?"
    a: "No. The page says purchases and trials cannot be completely turned off at tenant level with a single command. You set the policy for each product, and by default new products allow self-service purchase."
  - q: "Which role do I need?"
    a: "The admin center steps say Global Administrator. Partners acting with admin-on-behalf-of access need a role set to Global Administrator. The Before you begin list also names billing roles, and the page does not reconcile the two."
  - q: "Can I use PowerShell?"
    a: "The page names the MSCommerce PowerShell module and the AllowSelfServicePurchase policy ID and links to a separate article. It gives no cmdlets or product IDs, so check that article."
---

Users in a tenant can sometimes buy a product or start a trial on their own. Admins can limit this per product. This guide follows the Microsoft Learn page on managing self-service purchases and trials as an admin. The page is short on detail for some parts, and the gaps are listed below.

## Steps in the admin center

1. Go to **Settings** > **Org settings** > **Services** tab > **Self-service trials and purchases**.
2. Select a product.
3. Choose **Allow**, **Allow for trials only** or **Do not allow**.
4. Select **Save changes**.

The admin center steps say you must be a Global Administrator. Partners who act with admin-on-behalf-of access need a role set to Global Administrator. The page recommends limiting the number of Global Administrators. It can take up to 72 hours for the policy to be disabled and changes to occur. For self-serve trials in Microsoft Teams, close and restart the app so the change is reflected.

## What the options mean (my reading)

The page names the three options and does not define them. The descriptions below read the names. The page adds that the policy controls both purchases and trials.

- **Allow.** Users can buy and start trials.
- **Allow for trials only.** Users can start trials but not buy.
- **Do not allow.** Users can do neither for that product.

## Scope and defaults

- Only products eligible for self-service can be controlled. The Self-service trials and purchases page in the admin center lists them, and the page links a PowerShell article with a product list.
- The page says self-service purchases and trials cannot be completely turned off at tenant level with a single command. Each product is turned off individually.
- By default new products allow self-service purchase.

## Billing roles

Under Before you begin the page names these billing roles for the tasks in the article. The admin center steps separately say Global Administrator, and the page does not reconcile the two:

- Microsoft Customer Agreement: billing account owner or contributor, or billing profile owner or contributor.
- Microsoft Online Services Agreement: at least Billing Administrator.

## Data and terms

- Users are shown the personal data processed and the terms before a purchase or trial.
- When the AllowSelfServicePurchase policy is enabled, Microsoft's Commerce service processes directory data outside the boundaries of the Microsoft 365 tenant. It collects a Microsoft Entra ID v1.0 access token with first and last name, email address, IP address, and tenant and user GUID. The data is used to provide the user with a license and to send email about the subscription.
- Self-service purchases need a payment method and auto-renew.
- Some trials need a payment method and convert to paid subscriptions. Others need no payment method and do not renew. Trials without a payment method are only available to select customers with an existing subscription agreement.

## PowerShell

The page names the MSCommerce PowerShell module and the AllowSelfServicePurchase policy ID. It links to a separate article. The page says the module can also show the default state of the policy for each product. It gives no cmdlets, syntax or product IDs, so this guide does not either.

## Other tasks on the page

- View self-service subscriptions under **Billing** > **Your products** on the **Self-service trials** tab.
- Admins cannot assign or unassign licenses for a subscription bought by a user, but they can take over the subscription and then manage licenses.
- When you take over a subscription, you can move users to a different subscription, which cancels the old one, or cancel the subscription so licensed users lose access.

## What the page does not say

- A product list. The page lists no products and points to the admin center and the PowerShell article.
- What a user sees when a product is blocked.
- Cmdlet details.
- A tenant-wide setting. The page states that there is none.

## A review outline

This outline is my advice, built on the page.

1. Open the Self-service trials and purchases list and note the current policy of each product.
2. Decide per product: allow, trials only or block.
3. Save the change and test with a standard user account, allowing for the delay of up to 72 hours that the page mentions.
4. Review the list again from time to time, because new products allow purchase by default.
5. Tell users who to ask for licenses, so blocked purchases do not lead to shadow workarounds.

## Typical mistakes (my advice)

- Expecting one switch to stop all self-service purchases.
- Assuming a product added later is blocked.
- Using an account without the Global Administrator role.
- Forgetting that some trials convert to paid subscriptions.

## Quick reference

| Question | Answer on the page |
| --- | --- |
| Where | Settings > Org settings > Services tab > Self-service trials and purchases |
| Options | Allow, Allow for trials only, Do not allow |
| Role | Global Administrator (admin center steps) |
| Scope | Eligible products, one at a time |
| Default for new products | Self-service purchase allowed |
| Payment | Purchases need a payment method and auto-renew |
| Delay | Up to 72 hours |
| Data sent | Name, email, IP address, tenant GUID, user GUID |

## Questions to settle before you block

This section is my advice. The page does not say how to decide.

- Who in your organization currently buys or tries products on their own, and which products?
- Is a trial acceptable if purchase is not? If yes, Allow for trials only fits the product.
- Who handles license requests once purchases are blocked, and how do users reach them?
- Does your organization accept that directory data goes to Microsoft Commerce when the policy is enabled?
- Who checks the list when new products appear, since the default for them is to allow purchase?

Write the answers down once. They also serve as the record of why each product has its setting.

## Related

- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Power Platform admin center](https://www.m365.fm/entity/power-platform-admin-center/)

## Sources

- [Manage self-service purchases and trials (for admins) (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/commerce/subscriptions/manage-self-service-purchases-admins)
