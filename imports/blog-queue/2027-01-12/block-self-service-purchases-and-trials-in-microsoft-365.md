---
title: "How to Block Self-Service Purchases and Trials in Microsoft 365"
summary: "Control self-service purchases and trials in the Microsoft 365 admin center: the path, the three policy options, required roles, what the page says about defaults, billing roles and data sent, and what it leaves out such as a tenant-wide switch and PowerShell details."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [microsoft-365-admin-center]
keypoints:
  - "Path: Settings > Org settings > Services tab > Self-service trials and purchases. Select a product, choose an option and select Save changes."
  - "Options are Allow, Allow for trials only and Do not allow. The Global Administrator role is needed."
  - "Only products listed on the page can be controlled. There is no tenant-wide switch, so each product is set individually. New products allow self-service purchase by default."
  - "The MSCommerce PowerShell module and the AllowSelfServicePurchase policy are named, but the page gives no cmdlets, syntax or product IDs."
  - "Directory data such as name, email, IP address, tenant and user GUIDs is sent to Microsoft Commerce when the policy is enabled."
faq:
  - q: "Where do I turn self-service purchases off?"
    a: "In the Microsoft 365 admin center go to Settings > Org settings > Services tab > Self-service trials and purchases, select the product, choose Do not allow and select Save changes."
  - q: "What options exist?"
    a: "Allow, Allow for trials only and Do not allow."
  - q: "Is there one switch for all products?"
    a: "The page describes none. You set the policy for each listed product, and by default new products allow self-service purchase."
  - q: "Which role do I need?"
    a: "Global Administrator. Partners acting with admin-on-behalf-of access also need it."
  - q: "Can I use PowerShell?"
    a: "The page names the MSCommerce PowerShell module and the AllowSelfServicePurchase policy ID and links to a separate article. It gives no cmdlets or product IDs, so check that article."
---

Users in a tenant can sometimes buy a product or start a trial on their own. Admins can limit this per product. This guide follows the Microsoft Learn page on managing self-service purchases and trials as an admin. The page is short on detail for some parts, and the gaps are listed below.

## Steps in the admin center

1. Go to **Settings** > **Org settings** > **Services** tab > **Self-service trials and purchases**.
2. Select a product.
3. Choose **Allow**, **Allow for trials only** or **Do not allow**.
4. Select **Save changes**.

The Global Administrator role is needed. Partners who act with admin-on-behalf-of access also need it.

## What the options mean

- **Allow.** Users can buy and start trials.
- **Allow for trials only.** Users can start trials but not buy.
- **Do not allow.** Users can do neither for that product.

## Scope and defaults

- Only the products listed on the page can be controlled.
- There is no tenant-wide switch described. Each product is turned off individually.
- By default new products allow self-service purchase.

## Billing roles

The page notes billing roles for purchases:

- Microsoft Customer Agreement: billing account owner or contributor, or billing profile owner or contributor.
- Microsoft Online Subscription Agreement: at least Billing Administrator.

## Data and terms

- Users are shown the personal data processed and the terms before a purchase or trial.
- When the policy is enabled, directory data is sent to Microsoft Commerce: name, email, IP address, tenant GUID and user GUID.
- Self-service purchases need a payment method and auto-renew.
- Some trials need a payment method and convert to paid subscriptions. Others need no payment method and do not renew.

## PowerShell

The page names the MSCommerce PowerShell module and the AllowSelfServicePurchase policy ID. It links to a separate article. It gives no cmdlets, syntax or product IDs, so this guide does not either.

## What the page does not say

- A list of products on the page in the form of an overview here.
- What a user sees when a product is blocked.
- Cmdlet details.
- A tenant-wide setting.

## A review outline

This outline is practical advice built on the page.

1. Open the Self-service trials and purchases list and note the current policy of each product.
2. Decide per product: allow, trials only or block.
3. Save the change and test with a standard user account.
4. Review the list again from time to time, because new products allow purchase by default.
5. Tell users who to ask for licenses, so blocked purchases do not lead to shadow workarounds.

## Typical mistakes

- Expecting one switch to stop all self-service purchases.
- Assuming a product added later is blocked.
- Using an account without the Global Administrator role.
- Forgetting that some trials convert to paid subscriptions.

## Quick reference

| Question | Answer on the page |
| --- | --- |
| Where | Settings > Org settings > Services tab > Self-service trials and purchases |
| Options | Allow, Allow for trials only, Do not allow |
| Role | Global Administrator |
| Scope | Only listed products, one at a time |
| Default for new products | Self-service purchase allowed |
| Payment | Purchases need a payment method and auto-renew |
| Data sent | Name, email, IP address, tenant GUID, user GUID |

## Questions to settle before you block

This is practical advice. The page does not say how to decide. These questions help.

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

- [Manage self-service purchases and trials as an admin (Microsoft Learn)](https://learn.microsoft.com/microsoft-365/commerce/subscriptions/manage-self-service-purchases-admins)
