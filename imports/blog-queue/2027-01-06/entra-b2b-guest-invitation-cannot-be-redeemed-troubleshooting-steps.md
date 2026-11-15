---
title: "Entra B2B Guest Invitation Cannot Be Redeemed: Troubleshooting Steps"
summary: "Troubleshoot Microsoft Entra B2B invitation and redemption failures: permission and cross-tenant blocks, EmailVerified policy, proxyAddress conflicts, contact objects, missing invitation emails and viral tenants, per Microsoft Learn."
status: review
publish: false
author: mirko-p
date: 2027-01-06
topics: [entra-external-id, entra-id]
keypoints:
  - "If invitations are blocked, check external collaboration settings and cross-tenant access settings. Changes or a new Guest Inviter assignment can take 15 to 60 minutes."
  - "Redemption can fail when the invitee's home tenant disallows EmailVerified users or when the account is federated but missing from Entra ID."
  - "Conflicting proxyAddresses on a user, group or contact block the invitation. Remove the conflict, then invite again."
  - "If the invitation email does not arrive, the invitee should allow Invites@microsoft.com. Sovereign clouds use different sender addresses."
  - "The page has no dedicated entry for email one-time passcodes and no standalone resend procedure."
faq:
  - q: "Why do I get no permission to invite users?"
    a: "Learn says your account may not be authorized to invite external users, or a recent change may not have applied. Check Microsoft Entra ID > Users > User settings > External users > Manage external collaboration settings, and wait 15 to 60 minutes after changes or a Guest Inviter assignment."
  - q: "What does the cross-tenant access settings block mean?"
    a: "B2B collaboration is supported but blocked by cross-tenant access settings. Admins in both organizations must configure the settings to allow the invitation. For a tenant in a separate Azure cloud, use Microsoft cloud settings."
  - q: "Why does a federated user fail to redeem?"
    a: "Learn says that when federated authentication is used and the user does not exist in Entra ID, they cannot be invited. The external user's admin must sync the account to Entra ID."
  - q: "How do I fix a conflict in proxyAddresses?"
    a: "Learn lists removing the email from the conflicting user in the Microsoft 365 admin center, removing a matching contact under Users > Contacts, changing the email on a matching group under Teams & groups, and inviting again. The page says the email must be removed with the Microsoft Graph API."
  - q: "The invitee did not get the email. What now?"
    a: "The invitee should check the ISP or spam filter and allow Invites@microsoft.com. Azure China uses Invites@oe.21vianet.com and Microsoft Entra Government uses invites@azuread.us."
---

When a B2B invitation cannot be sent or redeemed, sort the symptom first: is the invitation blocked, does redemption fail, is the email missing, or is there an address conflict? This guide follows the Microsoft Learn B2B troubleshooting page, whose metadata date is February 2025. It lists symptoms, causes and fixes, and says what the page leaves out.

## Invitation is blocked or not allowed

| Symptom | Cause on Learn | Fix on Learn |
| --- | --- | --- |
| No permission to invite users | Your account is not authorized to invite external users, or a recent change has not applied | Check Microsoft Entra ID > Users > User settings > External users > Manage external collaboration settings. After changes or a Guest Inviter assignment, wait 15 to 60 minutes |
| Blocked by cross-tenant access settings | B2B collaboration is supported but blocked | Admins in both organizations must allow it. For a tenant in a separate Azure cloud, use Microsoft cloud settings |
| Blocked because cross-tenant settings are missing in your organization | The message says the invitation is blocked by cross-tenant access settings in your organization | Ask your administrator to check cross-tenant access settings |
| Microsoft B2B Cross Cloud Worker app disabled | The app is typically enabled, but an admin in the invitee's home tenant might have disabled it. Learn calls this rare | The home tenant admin re-enables it. Search for the app name in the admin center, or use PowerShell |
| Cannot invite in Azure US Government | The other tenant does not support B2B collaboration | B2B works only between Azure US Government tenants that both support it. Use Microsoft cloud settings for tenants outside the cloud |

## Redemption fails

- **Invitee's admin disallowed EmailVerified users.** The invitee's account does not exist in their Entra tenant and that tenant's policy prevents creating email-verified users. The user checks with their admin, who may need to allow Email Verified users with `Update-MgPolicyAuthorizationPolicy`.
- **External user does not exist in a federated domain.** Federated authentication is used and the user is not in Entra ID. The external user's admin must sync the account to Entra ID.
- **proxyAddress conflicts with an existing local user.** The redemption check found a collision, in the home tenant or among local users in your tenant. For an external B2B user the email is added to that user's proxyAddress. For a local user, ask them to sign in with the account they already have.
- **Email matches a Contact object.** Learn says earlier behavior searched only proxyAddresses and this is now fixed: both proxyAddresses and the invited email property are searched. To check for conflicts, connect with `Connect-MgGraph` as at least Directory Reader and run `Get-MgContact -All | ? {$_.Mail -match 'user@domain.com'}`.

## Cannot invite because of proxyAddresses

The message says the email address cannot be invited because of a conflict in proxyAddresses. Another user, group or Microsoft 365 contact has the same email as a proxyAddress. Learn's fix:

1. In the Microsoft 365 admin center, go to **Users** > **All users**, search for the email and remove it from the Graph user object.
2. Go to **Users** > **Contacts** and remove the associated contact object if one exists.
3. Go to **Teams & groups** > **Active teams & groups** and change the email if a group has it.
4. Invite the user again.

The page says you must remove the email with the Microsoft Graph API. A related case: a guest whose email matches a contact may have no populated proxyAddresses, and syncing contacts from on-premises AD can remove the conflicting proxyAddress from the guest.

## Email delivery and content

- **No redemption email.** The invitee checks the ISP or spam filter and allows `Invites@microsoft.com`. Azure China (21Vianet) uses `Invites@oe.21vianet.com`. Microsoft Entra Government uses `invites@azuread.us`.
- **Custom message missing.** For privacy, the API omits custom messages when the inviter has no email address in the inviting tenant or when a service principal sends the invite. Suppress the API email and send your own, and consult legal counsel for compliance.

## Viral or just-in-time tenants

If a guest in a viral tenant cannot reset a password, the identity tenant is unmanaged, so only the guest can reset it. After an organization takes over the tenant, only its admin can reset the password or enable SSPR. As the inviting organization you can remove the guest account from your directory and resend an invitation if needed.

## Other entries

- **AADSTS50020:** the page says there are several possible causes without listing them and links a separate article.
- **AADSTS65005 for an unmanaged tenant:** a sign-in issue, fixed by taking over the abandoned tenant and proving DNS control of the domain.

## What the page does not cover

A dedicated entry for email one-time passcode. A standalone resend-invitation procedure, since resend guidance appears only in the viral tenant section. Invitation expiration, status checking, and delivery timing.

## A triage order (my advice)

The order is my own suggestion, not taken from the page.

1. Did the invitation send? If not, check the invite permissions and the settings above.
2. Did it send but not arrive? Check spam and the sender address.
3. Did the user click but fail? Check the home tenant policy, federation and proxyAddress conflicts.
4. Run the contact check from the page when a contact may match.

## Typical mistakes (my advice)

- Retrying immediately after a settings change instead of waiting 15 to 60 minutes.
- Fixing only the user object and forgetting the matching contact or group.
- Assuming the invitee's tenant allows email-verified users.

## Related

- [Microsoft Entra External ID](https://www.m365.fm/entity/entra-external-id/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Cross-tenant access settings](https://www.m365.fm/entity/cross-tenant-access-settings/)
- [B2B collaboration](https://www.m365.fm/entity/b2b-collaboration/)

## Sources

- [Troubleshoot B2B issues (Microsoft Learn)](https://learn.microsoft.com/entra/external-id/troubleshoot)
