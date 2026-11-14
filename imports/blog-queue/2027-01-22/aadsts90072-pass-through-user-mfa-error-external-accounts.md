---
title: "AADSTS90072 PassThroughUserMfaError: External Account Not in the Tenant, or an ImmutableID Mismatch"
summary: "AADSTS90072 means a user signed in with an external account that does not exist in the tenant, so MFA cannot be satisfied, or that synced users have mismatched ImmutableID values. Two branches to check, with B2B guest and sourceAnchor facts from Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-22
topics: [entra-id, mfa, entra-external-id, entra-connect]
keypoints:
  - "Learn names two situations: the external account does not exist in the tenant, or synced users have an ImmutableID (sourceAnchor) mismatch between Active Directory and Microsoft Entra ID."
  - "For the first, the account must be added as an external user in the tenant first. Or the user signs out and signs in with a different Microsoft Entra account."
  - "A B2B guest is represented as a user object after redeeming an invitation, typically with user type guest and a UPN that contains #EXT#."
  - "sourceAnchor, also called immutableId, cannot change after the object is created and synchronized. A changed value makes Entra Connect Sync throw an error for that object."
  - "Cross-tenant access settings can trust MFA claims from other Entra organizations. The pages do not tie this setting to AADSTS90072."
faq:
  - q: "What does AADSTS90072 mean?"
    a: "The Microsoft Entra error code reference lists it as PassThroughUserMfaError. The external account that the user signs in with does not exist on the tenant they signed into, so the user cannot satisfy the MFA requirements for the tenant. The same row says the error might also occur if users are synced but the ImmutableID (sourceAnchor) attribute differs between Active Directory and Microsoft Entra ID."
  - q: "How do I fix the external account case?"
    a: "The reference says the account must be added as an external user in the tenant first. The other documented action is to sign out and sign in with a different Microsoft Entra user account. The row links to the external identities overview for configuration."
  - q: "How does a guest appear in my directory?"
    a: "The B2B collaboration overview says that once the guest redeems the invitation or completes self-service sign-up, they are represented in your directory as a user object. The user type is typically guest and the user principal name contains the #EXT# identifier. Admins can create a guest in the Microsoft Entra admin center and send an invitation email with a redemption link."
  - q: "What is the ImmutableID and why can a mismatch cause trouble?"
    a: "Learn says sourceAnchor, also called immutableId, uniquely identifies an object as the same object on-premises and in Microsoft Entra ID, and cannot be changed after it is set. If the value changes after the object is exported, Entra Connect Sync throws an error and allows no more changes to that object until the value is changed back in the source directory."
  - q: "Can the resource tenant trust MFA done in the home tenant?"
    a: "The B2B overview says cross-tenant access settings let you trust multifactor authentication and device claims from other Microsoft Entra organizations. Settings can be a default for all organizations plus organization-specific entries. The pages do not tie this setting to AADSTS90072, so whether it applies to your case is your own check in the sign-in log."
---

AADSTS90072 is named PassThroughUserMfaError. The Microsoft Entra error code reference ties it to two situations: an external account that does not exist in the tenant the user signed into, and a mismatch of the ImmutableID (sourceAnchor) between Active Directory and Microsoft Entra ID for synced users. This article treats them as two branches and fills in what the one-line reference row leaves out, using the B2B collaboration overview and the Entra Connect design concepts page.

## What the reference says

The row reads, in short: the external account the user signs in with does not exist on the tenant they signed into, so the user cannot satisfy the MFA requirements for the tenant. The error also might occur if users are synced but the ImmutableID (sourceAnchor) attribute does not match between Active Directory and Microsoft Entra ID.

Two actions are listed: the account must be added as an external user in the tenant first, and the user should sign out and sign in with a different Microsoft Entra user account.

## Branch A: The external account is not in the tenant

### How a guest exists in your directory

From the B2B collaboration overview: after a guest redeems an invitation or completes self-service sign-up, the guest is represented in your directory as a user object. The user type is typically guest and the user principal name contains the `#EXT#` identifier. Guests use their own work, school or social identities.

You can add a guest in the Microsoft Entra admin center like a new user, assign guests to apps or groups, and send an invitation email with a redemption link or a direct link to an app.

### What to check

These steps are my suggestion, built on the two actions the reference lists.

1. Find the failed sign-in in the sign-in logs and note the account that was used and the tenant it signed into.
2. Check whether that account exists as a guest in the tenant that requires MFA. If it does not, the reference says to add it as an external user first.
3. If the user has more than one account, ask which one they intended to use. The reference suggests signing out and signing in with a different Microsoft Entra user account.
4. If a guest exists but sign-in still fails, review the settings that govern B2B between the two organizations, described next.

### Settings that affect B2B sign-in

The overview describes two groups of settings:

| Setting | What it controls |
| --- | --- |
| Cross-tenant access settings | Which users can authenticate with which resources, inbound and outbound. A default applies to all external organizations, with organization-specific entries as needed. They can also trust MFA and device claims from other Microsoft Entra organizations |
| External collaboration settings | Which users in your organization can invite guests, and which domains are allowed or blocked |

If settings conflict, Learn says the most restrictive one applies. For example, a blocked domain in external collaboration settings stops new invitations even when cross-tenant access allows B2B. The overview also says that since mid-2025 guests are redirected to their own organization's sign-in page and return to the resource tenant afterwards, with the rollout completed by the end of 2025. Conditional Access policies such as MFA can be enforced at tenant level, application level or for specific guests.

## Branch B: Synced users with an ImmutableID mismatch

The Entra Connect design concepts page explains the attribute:

- sourceAnchor, also called immutableId, is an attribute that is immutable during the lifetime of an object. It uniquely identifies an object as the same object on-premises and in Microsoft Entra ID.
- It is used when a sync server is built or rebuilt after a disaster, when moving from cloud-only to synchronized identities where it allows a hard match of existing cloud objects with on-premises ones, and with federation, where it is used in the claim with the userPrincipalName.
- Its value cannot be changed after the object is created in Microsoft Entra ID and synchronized.

### Rules that follow

- You can set the sourceAnchor attribute only during initial installation. Rerunning the wizard shows the option read-only, and changing it means uninstalling and reinstalling.
- If you install another Entra Connect server, select the same sourceAnchor attribute as before.
- If the value is changed after export, Entra Connect Sync throws an error and does not allow more changes on that object until the issue is fixed and the value is changed back in the source directory.
- Defaults: older versions (1.1.486.0 and older) use objectGUID. Newer versions (1.1.524.0 and after) can use ms-DS-ConsistencyGuid, and Learn describes how the wizard picks the attribute and writes objectGUID back when the attribute is empty.

For federation outside Entra Connect, Learn says you must update the ImmutableID claim rules yourself so they match the exported sourceAnchor values.

### What to check

1. Compare the user's ImmutableID in Microsoft Entra ID with the source attribute on-premises. The pages show no command for this, so none is given here.
2. Check Entra Connect Sync for errors on the object. Learn says a changed sourceAnchor produces an error.
3. If you rebuilt a sync server, confirm it uses the same sourceAnchor attribute as the original. The first two checks are my suggestion; the third follows Learn's rule above.

## Telling the branches apart (my advice)

This is my suggestion, not Microsoft guidance:

- If the user is a partner, contractor or someone with an account in another organization, start with branch A.
- If the user is a normal employee from your own synced directory, and the error appeared after a server rebuild, a domain migration or object recreation, start with branch B.
- Look at the full error text in the sign-in log. It says which account and tenant were involved.

## What the sources do not cover

The reference row is a single line, and the two supplementary pages do not describe a step-by-step repair for a mismatched ImmutableID. This article gives none. Before you change attributes, my advice is to look for Learn material on matching and on-premises synchronization errors, which these three pages do not cover.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)
- [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)

## Sources

- [Microsoft Entra authentication & authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [What is Microsoft Entra B2B collaboration? (Microsoft Learn)](https://learn.microsoft.com/entra/external-id/what-is-b2b)
- [Microsoft Entra Connect: Design concepts (Microsoft Learn)](https://learn.microsoft.com/entra/identity/hybrid/connect/plan-connect-design-concepts)
