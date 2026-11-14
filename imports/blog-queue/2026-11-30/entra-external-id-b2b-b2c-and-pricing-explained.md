---
title: "Microsoft Entra External ID: B2B, B2C and Pricing Explained"
summary: "Entra External ID covers business guests (B2B) and customer sign-in (external tenants). Learn how it relates to Azure AD B2C, how monthly active user billing works and what Microsoft does not state publicly."
status: review
publish: false
author: mirko-p
date: 2026-11-30
topics: [entra-external-id, azure-ad-b2c, b2b-collaboration]
keypoints:
  - "Entra External ID has two tenant configurations: workforce tenants for B2B collaboration with business guests and external tenants for consumer and customer apps."
  - "Basic billing is based on monthly active users (MAU): unique external users who authenticate in a calendar month, counted across the tenants linked to a subscription."
  - "In workforce tenants only users with UserType Guest count toward MAU. In external tenants every user counts, including admins, regardless of UserType."
  - "Azure AD B2C is a legacy product. It has not been available to new customers since May 1, 2025, and Microsoft says it will support it until at least May 2030."
  - "Premium add-ons such as SMS phone authentication, M2M authentication and ID Governance are billed on top of the basic MAU charge."
faq:
  - q: "What is the difference between B2B and B2C in Microsoft Entra?"
    a: "B2B collaboration lets employees invite business guests into a workforce tenant so they sign in with their own credentials. B2C is the older customer identity service. According to Microsoft Learn, customer scenarios now belong in an external tenant of Entra External ID."
  - q: "Is Azure AD B2C still available?"
    a: "Existing customers can keep using it. Microsoft Learn states that since May 1, 2025 it is no longer available for purchase by new customers, and the Azure AD B2C FAQ says support continues until at least May 2030."
  - q: "How does Entra External ID billing work?"
    a: "Microsoft Learn describes basic billing by monthly active users, meaning unique external users who authenticate within a calendar month. Premium add-ons are billed on top, some per MAU and some per transaction."
  - q: "What is the free tier for External ID?"
    a: "The Microsoft Learn pricing article says you can get started for free, but it does not state the threshold. It refers readers to the official External ID pricing page for current rates, so check that page before you plan costs."
  - q: "Can I convert a workforce tenant into an external tenant?"
    a: "The Microsoft Learn article on tenant configurations does not describe a conversion. It says an external tenant is distinct and separate from your workforce tenant and that you create it in the Microsoft Entra admin center."
---

Microsoft Entra External ID is the product family for letting people outside your organization sign in to your apps and resources. It covers two cases. B2B collaboration brings business guests such as partners and suppliers into a workforce tenant. Customer scenarios use a separate external tenant. Billing for both is based on monthly active users (MAU), and Azure AD B2C is the legacy predecessor for customer sign-in.

## The two tenant configurations

Microsoft Learn describes two configurations, and the choice decides almost everything else.

| | Workforce tenant | External tenant |
|---|---|---|
| Purpose | Employees collaborate with business guests | Publish apps to consumers and business customers |
| Main scenario | B2B collaboration, plus B2B direct connect | Customer identity and access management (CIAM) |
| Directory | Guests live in the same directory as employees, typically as guest users | Separate directory of customer accounts |
| Apps | Microsoft apps such as Microsoft 365, plus your SaaS and custom apps | Your own SaaS or custom apps, not Microsoft apps |
| How it is created | Automatically with a Microsoft cloud subscription, or additionally in the admin center | In the Microsoft Entra admin center only, not the Azure portal |

A workforce tenant is created automatically when you sign up for a Microsoft cloud service such as Azure, Intune or Microsoft 365. An external tenant is a distinct tenant that follows the standard Entra tenant model but is configured for external scenarios. Microsoft Learn says the external tenant holds the directory of customer credentials and profile data, app registrations, user flows, extensions, sign-in methods and encryption keys.

The Learn articles read for this page do not describe converting one configuration into the other. Plan for two separate tenants if you need both.

## B2B collaboration in a workforce tenant

With B2B collaboration, guests sign in with their own work, school or social identity. You do not manage their passwords or accounts. They are represented in your directory as user objects, typically with the user type Guest and a user principal name that contains `#EXT#`.

Invitations can be sent from the admin center or PowerShell, through self-service sign-up user flows, or through Microsoft Graph. After a guest redeems the invitation, they appear in the directory. Access is then controlled with cross-tenant access settings, external collaboration settings and Conditional Access policies.

B2B direct connect is a related option. It creates a two-way trust between Entra organizations to enable Teams shared channels. Direct connect users are not added as guests to your directory.

## Customer sign-in in an external tenant

An external tenant lets you set up self-service sign-up and sign-in flows with email and password, one-time passcodes or social accounts such as Google or Facebook. You can apply custom branding and collect attributes during sign-up. SSO applies only to apps registered in the external tenant. It does not extend to Microsoft 365.

## Where Azure AD B2C fits

Azure AD B2C is described by Microsoft as a legacy CIAM solution with its own consumer directory. The dates that matter:

- **May 1, 2025:** no longer available for purchase by new customers.
- **March 15, 2026:** Azure AD B2C P2 discontinued, according to the B2C FAQ. A later section of the same FAQ says P2 tenants are switched to P1 on a rolling basis by the end of March 2026. The wording differs, so check your Azure billing for the exact timing.
- **May 2030:** the FAQ says Microsoft will continue supporting Azure AD B2C until at least this month.

Existing customers keep the product experience and the operational commitments such as SLAs and security updates. New tenants can only be created with B2C P1. Microsoft calls External ID the next-generation solution. The B2C FAQ page that was read does not give a migration timeline and tells readers to contact their account representative. The External ID overview points to a separate "Plan your migration from Azure AD B2C to External ID" article, which could not be read for this page.

## How External ID pricing works

The pricing article on Microsoft Learn explains the model but not the rates.

**Basic billing is per MAU.** A MAU is a unique external user who authenticates to your tenants within a calendar month. MAUs are totaled across all workforce and external tenants linked to a subscription.

**What counts depends on the tenant type:**

- **Workforce tenants:** only users with `UserType` set to Guest are counted. Users with `UserType` Member are not counted, even across your own tenants.
- **External tenants:** all users count, whether consumers, business guests or admins, regardless of `UserType`.

**Premium add-ons are billed on top of basic MAU:**

| Add-on | Tenant | Billing model |
|---|---|---|
| M2M authentication | External | Transaction-based |
| SMS phone authentication | Workforce and external | Transaction-based, text only |
| Go-Local | External | MAU-based, Australia and Japan only |
| ID Governance | Workforce | MAU-based |
| GSA for Guests | Workforce | MAU-based |

The only numeric example on the page is token refresh: one refresh per hour produces roughly 720 transactions per month, which matters for transaction-billed add-ons.

**What the page does not say.** It mentions a free tier but gives no threshold, no price per MAU and no price per transaction. It sends readers to the official External ID pricing page for current rates. Those numbers were not available in the pages read, so confirm them there before budgeting. Customers who bought B2B collaboration under an Azure AD External Identities P1 or P2 SKU are told to check the pricing page for current options and upgrade paths.

## How to choose

1. **Inviting partners, suppliers or vendors to Microsoft 365 resources?** Use a workforce tenant and B2B collaboration. Guests count toward MAU, members do not.
2. **Building an app for consumers or business customers?** Use an external tenant. Every user counts toward MAU, so estimate your active user base honestly.
3. **Already running Azure AD B2C?** Nothing forces a move today. Learn states support until at least May 2030, but new features are built on External ID.
4. **Need Teams shared channels with another organization?** Look at B2B direct connect, which is licensed and billed by MAU.

## Common mistakes

- **Assuming guests and members cost the same.** In workforce tenants only guests are counted.
- **Planning a customer app in a workforce tenant.** Customer scenarios belong in an external tenant, which has its own directory.
- **Ignoring add-ons.** SMS authentication and M2M are billed per transaction, so a high-volume app can cost more than its MAU suggests.
- **Treating the pricing article as a price list.** It explains the model. The rates sit on the separate pricing page.

## Related

- [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/)
- [Azure AD B2C](https://www.m365.fm/entity/azure-ad-b2c/)
- [B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [External tenant](https://www.m365.fm/entity/external-tenant/)

## Sources

- [Microsoft Learn: External ID overview](https://learn.microsoft.com/en-us/entra/external-id/external-identities-overview)
- [Microsoft Learn: External ID pricing and billing](https://learn.microsoft.com/en-us/entra/external-id/external-identities-pricing)
- [Microsoft Learn: B2B collaboration overview](https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b)
- [Microsoft Learn: Workforce and external tenant configurations](https://learn.microsoft.com/en-us/entra/external-id/tenant-configurations)
- [Microsoft Learn: External ID for customers overview](https://learn.microsoft.com/en-us/entra/external-id/customers/overview-customers-ciam)
- [Microsoft Learn: Azure AD B2C FAQ](https://learn.microsoft.com/en-us/azure/active-directory-b2c/faq)
