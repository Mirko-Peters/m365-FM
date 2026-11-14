---
title: "Entra B2B Collaboration and Guest Users: How They Work and How to Manage Them"
summary: "What Microsoft Entra B2B collaboration is, how guests are invited and redeem access, what a guest user object looks like, which settings control who can invite whom, and how guests are billed."
status: review
publish: false
author: mirko-p
date: 2026-11-17
topics: [b2b-collaboration, guest-access, entra-external-id, cross-tenant-access-settings]
keypoints:
  - "B2B collaboration lets partners sign in with their own identities. You do not manage their passwords or account lifecycle."
  - "Invite a guest in the Microsoft Entra admin center under Entra ID > Users > Invite external user. The guest is created with UserType Guest and shows Pending acceptance until redemption."
  - "A guest UPN contains #EXT#. By default guests have restricted directory permissions."
  - "Cross-tenant access settings and external collaboration settings both apply. The most restrictive one wins."
  - "Billing uses monthly active users (MAU) of external guests. The page read here does not state the free allowance or prices."
faq:
  - q: "What is Microsoft Entra B2B collaboration?"
    a: "According to Microsoft Learn, B2B collaboration is a feature of Microsoft Entra External ID that lets your workforce share applications and services with business partners and guests while keeping control of corporate data. Partners use their own identities and do not need Microsoft Entra ID or an IT department."
  - q: "How do I invite a guest user?"
    a: "Microsoft Learn describes signing in to the Microsoft Entra admin center as at least a User Administrator, going to Entra ID > Users, selecting Invite external user, entering the email and display name, and selecting Review and invite and then Invite. The guest receives an email with an invitation link."
  - q: "What does a guest account look like in the directory?"
    a: "Microsoft Learn says the guest appears as a user object with UserType Guest and a user principal name that contains #EXT#. For john@contoso.com in the fabrikam directory, the example is john_contoso.com#EXT#@fabrikam.onmicrosoft.com. Before redemption the invitation state is Pending acceptance."
  - q: "What can guests see in my directory?"
    a: "Microsoft Learn states that guests have default restricted directory permissions. They can manage their own profile and retrieve some information about other users, groups and apps, but they cannot read all directory information. Admins can relax these restrictions deliberately under External users in user settings."
  - q: "How are B2B guests billed?"
    a: "Microsoft Learn describes a monthly active users model for external guests with UserType Guest, with a free tier and pay-for-what-you-use pricing. The billing page read for this article does not give the free threshold or per-user prices and points to the External ID pricing page for current figures."
---

Microsoft Entra B2B collaboration lets people from other organizations sign in to your apps with their own identities. You invite them, they appear in your directory as guest users, and you control what they can reach with groups, apps, Conditional Access and cross-tenant settings. You do not manage their passwords or account lifecycle.

## What B2B collaboration is

Microsoft Learn describes B2B collaboration as part of Microsoft Entra External ID. It is meant for workforce tenants. Your workforce shares applications and services with partners and guests while keeping control of corporate data. Partners do not need Microsoft Entra ID or their own IT department.

Guests can sign in with work, school or social identities. Microsoft lists providers such as Microsoft accounts, Google and Facebook, plus enterprise identity providers through federation. Email one-time passcode is on by default for new tenants and for existing tenants that have not turned it off. If it is off, the fallback is to ask invitees to create a Microsoft account.

## Four ways guests get in

Per Microsoft Learn:

1. **Admin invitation.** In the Microsoft Entra admin center you create a guest and send an invitation email with a redemption link or a direct link to an app.
2. **Self-service sign-up.** A user flow lets guests sign up for apps or resources themselves. API connectors can add approval workflows or identity verification.
3. **Delegated invitation.** App and group owners add guests from the Access Panel at myapps.microsoft.com once an admin sets up self-service app and group management.
4. **Developer APIs.** The B2B invitation APIs let you customize invitations or build sign-up portals.

## How to invite a guest in the admin center

1. Sign in to the Microsoft Entra admin center at entra.microsoft.com as at least a User Administrator. Microsoft's quickstart names Guest Inviter as the minimum role for inviting.
2. Browse to **Entra ID** > **Users**.
3. Select **Invite external user**.
4. On the **Basics** tab, enter the **Email** and **Display name**. An invitation message is optional.
5. Select **Review and invite**, check the details and select **Invite**.

An email goes out and the guest account is added to the directory. Invitation alone does not give access to apps. To make an app appear in the guest's My Apps page, add the guest to the app. Invitation emails from the default onmicrosoft.com domain are subject to Exchange Online sending limits, and Microsoft suggests a custom domain for higher limits.

The guest then opens the email from Microsoft Invitations, selects **Accept invitation**, accepts the **Permission requested by** page and lands on My Apps.

## What the guest object looks like

According to Microsoft Learn's page on guest user properties:

- **UserType** is `Guest` by default for invited B2B users. `Member` means an employee of the host organization. UserType says nothing about how the user signs in or their directory role.
- **User principal name** contains `#EXT#`.
- **Identities** shows the sign-in provider, for example `ExternalAzureAD`, `Microsoft account`, `google.com` or `mail` for email one-time passcode. It is independent of UserType.
- **Before redemption**, the account has no credentials, the invitation state is **Pending acceptance** and the inviter is set as the default **Sponsor**.

Microsoft says phone sign-in is not supported for external users. If a guest changes their email address after accepting, the new address does not sync automatically to the guest object, so the `mail` property must be updated.

## Default permissions

Guests have restricted directory permissions by default. They can manage their own profile and password and retrieve some information about other users, groups and apps, but they cannot read all directory information. Guests are hidden from the Exchange Global Address List by default. Microsoft's page on guest properties also says guests are not supported in Teams shared channels and points to B2B direct connect for that scenario.

You can relax the restrictions under the **External users** option in user settings, but Microsoft frames this as a deliberate choice.

## The two settings that decide who can collaborate

**Cross-tenant access settings** control whether users can authenticate with other Microsoft Entra organizations, inbound and outbound. B2B collaboration is enabled by default. You can scope by users, groups and applications, set a default for all organizations and add organization-specific settings. You can also trust MFA and device claims from other Entra organizations.

**External collaboration settings** control who in your organization can send invitations. By default all users, including guests, can invite external users. You can switch invitations off, limit them to roles, allow or block domains, and restrict guest access to the directory.

When both apply, the most restrictive setting wins. Microsoft's example: if a domain is on the blocked list in external collaboration settings, users cannot invite it even if cross-tenant access allows all Entra organizations. Existing guests from a blocked domain keep access.

## Managing guests over time

Microsoft Learn names these controls:

- **Conditional Access**, for example multifactor authentication, at tenant, application or guest level.
- **Entitlement management**, to manage external user access.
- **SharePoint and OneDrive integration**, to share files, libraries and sites with guests. Permissions work the same for guests as for internal users.

You can filter the **Users** list by user type to show only guests. The guest properties page does not describe removing guests. For a test guest, the quickstart says to select the user and choose **Delete user**.

## Licensing and billing

Microsoft Learn describes billing by monthly active users (MAU): unique external users who authenticate within a calendar month. It applies to external guests in workforce tenants with UserType `Guest`, and members from within your own organization do not count. There is a free tier. The pages read here do not give the threshold or prices, so check the External ID pricing page. A workforce tenant must be linked to a subscription for billing, under **Entra ID** > **External Identities** > **Overview** > **Subscriptions** > **Linked subscriptions**.

## Related

- [B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)
- [Guest access](https://www.m365.fm/entity/guest-access/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [Entra External ID](https://www.m365.fm/entity/entra-external-id/)

## Sources

- [Microsoft Learn: B2B collaboration overview](https://learn.microsoft.com/en-us/entra/external-id/what-is-b2b)
- [Microsoft Learn: Properties of a B2B guest user](https://learn.microsoft.com/en-us/entra/external-id/user-properties)
- [Microsoft Learn: Quickstart, add guest users in the portal](https://learn.microsoft.com/en-us/entra/external-id/b2b-quickstart-add-guest-users-portal)
- [Microsoft Learn: Billing model for Microsoft Entra External ID](https://learn.microsoft.com/en-us/entra/external-id/external-identities-pricing)
