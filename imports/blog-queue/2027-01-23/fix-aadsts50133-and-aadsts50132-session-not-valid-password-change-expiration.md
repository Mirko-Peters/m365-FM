---
title: "Fix AADSTS50133 and AADSTS50132: Session Is Not Valid After a Password Change or Expiration"
summary: "AADSTS50133 (SsoArtifactRevoked) and AADSTS50132 (SsoArtifactInvalidOrExpired) share one description: the session is not valid due to password expiration or recent password change. What the two names suggest, how to read the sign-in log, and what the Entra password policy and token pages say."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [entra-id, self-service-password-reset, password-hash-synchronization]
keypoints:
  - "Both codes carry the same description: the session is not valid due to password expiration or recent password change. Only the short names differ."
  - "AADSTS50133 is listed as SsoArtifactRevoked and AADSTS50132 as SsoArtifactInvalidOrExpired in the Microsoft Entra error code reference."
  - "The error code reference gives no further fix steps for these two codes. This article builds the checks from the password policy and token pages."
  - "Entra password expiry default is no expiration. Tenants created before 2021 have a 90 day default, and per user and domain values can be checked with Graph PowerShell."
  - "Access tokens last one hour by default. Session tokens in an app are controlled by the app, so a user may need a fresh sign-in after a password change."
faq:
  - q: "What do AADSTS50133 and AADSTS50132 mean?"
    a: "The Microsoft Entra authentication and authorization error code reference lists both with the description that the session is not valid due to password expiration or recent password change. AADSTS50133 has the short name SsoArtifactRevoked, and AADSTS50132 has SsoArtifactInvalidOrExpired."
  - q: "Does the error code reference tell me how to fix them?"
    a: "The reference lists only the short name and the description for these two codes, as far as the entries in the table go. So the fix has to start from the cause named in the description: check whether the password recently changed or expired, then have the user sign in again."
  - q: "How can I check whether a password expires?"
    a: "Learn says the Entra default for password expiry is no expiration, and a tenant created before 2021 has a 90 day expiration value by default. You can check the policy with Get-MgDomain and a single user's setting with Get-MgUser and the PasswordPolicies property. DisablePasswordExpiration in PasswordPolicies means the password never expires."
  - q: "Why would a session stop working right after a password change?"
    a: "The error description names a recent password change as a cause. Learn explains that apps use access tokens, which last one hour by default, refresh tokens to silently renew them, or their own session tokens. Entra ID reevaluates its policies when the app sends the user back, so a user with an old session might need to sign in again."
  - q: "What is different for synchronized hybrid users?"
    a: "By default only passwords of accounts that are not synchronized through Microsoft Entra Connect can be configured not to expire. Learn also notes that a password change that passes on-premises requirements may fail the cloud requirements, for example with a Unicode character, and that the user then sees no error."
---

AADSTS50133 and AADSTS50132 are twins. In the Microsoft Entra error code reference, both have the same description: the session is not valid due to password expiration or recent password change. They differ in the short name only. This article is honest about how much the reference says, then fills in the checks with the Entra password policy and token pages.

## What the reference lists

| Code | Short name | Description |
| --- | --- | --- |
| AADSTS50133 | SsoArtifactRevoked | The session is not valid due to password expiration or recent password change |
| AADSTS50132 | SsoArtifactInvalidOrExpired | The session is not valid due to password expiration or recent password change |

The table rows contain no further steps. Everything below that goes beyond the table comes from other Learn pages, and I mark my own advice as such.

My reading of the names, which is an interpretation: SsoArtifactRevoked suggests an existing single sign-on artifact was revoked, and SsoArtifactInvalidOrExpired suggests it was invalid or expired. Both point to a session or token that no longer matches the account's password state.

## Check 1: Did the password just change?

Start with the cause named in the description. Ask the user and read the sign-in log:

1. In the Microsoft Entra admin center, open the sign-in log entry for the failed sign-in and note the error code and the application.
2. Check when the password last changed or was reset.
3. Ask which device and app the user was in. An app that held an old session is the typical place where the message appears. That is my experience, not a statement of the reference.

If the change was recent, the user needs a new sign-in. The token pages explain why.

## Check 2: How sessions and tokens behave

The Learn page on revoking user access describes the token patterns:

- After authorization, Entra ID issues an access token and a refresh token. By default access tokens last 1 hour.
- When the access token expires, the app can silently reauthenticate with the refresh token. Entra ID then reevaluates its authorization policies, and issues new tokens if the user is still authorized.
- Browser apps often use session tokens. The user gets one from Entra ID and one from the app. Entra ID policies are reevaluated whenever the app sends the user back, and the frequency depends on how the app is configured. Entra ID cannot directly revoke a session token that an app issued.
- Continuous access evaluation allows admins to revoke session and access tokens for CAE-capable apps.

So a password change does not take effect at the same moment in every app. Some apps notice at the next token renewal, and others when their own session ends. The page does not give a per-code explanation for 50133 or 50132, and I do not claim one.

## Check 3: Did the password expire?

The self-service password reset policy page gives these facts:

| Item | From the page |
| --- | --- |
| Password expiry duration | Default is no expiration. A tenant created before 2021 has 90 days by default. Check with `Get-MgDomain`, change with `Update-MgDomain` |
| Let passwords never expire | Default false. Configure per user with `Update-MgUser` |
| Password change history | The last password cannot be used again when the user changes a password |
| Password reset history | The last password can be used again when the user resets a forgotten one |

To see whether a user's password is set to never expire:

```powershell
Get-MgUser -UserId <user ID> -Property UserPrincipalName, PasswordPolicies | Select-Object @{N="PasswordNeverExpires";E={$_.PasswordPolicies -contains "DisablePasswordExpiration"}}
```

A warning on that page: passwords with `DisablePasswordExpiration` still age based on `LastPasswordChangeDateTime`. If you switch the value to `None`, all passwords whose last change is older than 90 days require a change at the next sign-in, which can affect many users at once. Be careful with bulk changes.

## Check 4: Hybrid users

For accounts synchronized with Microsoft Entra Connect, the page says:

- By default only passwords of accounts not synchronized through Entra Connect can be configured not to expire.
- If `EnforceCloudPasswordPolicyForPasswordSyncedUsers` is enabled, the Entra password policy applies to synchronized accounts.
- A password change can succeed on-premises but not in the cloud, for example when it contains a Unicode character. With password hash synchronization, the user can still get an access token, may be asked to change the password again, and sees no error or notice that the chosen password failed the cloud requirements.

In a hybrid case, compare the password change time on-premises with what the cloud shows, before you reset anything.

## What to tell the user

The fix with the strongest support is a fresh sign-in after the password change: sign out of the app, close the browser session if needed, and sign in with the current password. The error description names the password change or expiry as the cause, and the token pages explain that apps hold sessions and tokens that Entra ID reevaluates later. If the error comes back right after a fresh sign-in, the user's password state or the account is the next thing to check.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Read the sign-in log entry, with the app, device and time.
2. Compare the time with the last password change.
3. Ask the user to sign out everywhere they use the account, then sign in once with the current password.
4. If it keeps happening for one app, check whether that app keeps its own session.
5. For synchronized users, check the on-premises and cloud password state side by side.
6. If many users get it at once, check whether someone changed the expiry policy in bulk.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Self-service password reset](https://www.m365.fm/entity/self-service-password-reset/)
- [Password hash synchronization (PHS)](https://www.m365.fm/entity/password-hash-synchronization/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Self-service password reset policies (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concept-sspr-policy)
- [Revoke user access in an emergency in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/users/users-revoke-access)
