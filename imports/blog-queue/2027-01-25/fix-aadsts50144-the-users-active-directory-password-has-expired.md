---
title: "Fix AADSTS50144: The User's Active Directory Password Has Expired"
summary: "AADSTS50144 (InvalidPasswordExpiredOnPremPassword) means the on-premises Active Directory password has expired. Generate a new password or let the user reset it with SSPR. Plus what Learn says about password expiration for synchronized and cloud users and how to check it with PowerShell."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [entra-id, active-directory, self-service-password-reset, password-hash-synchronization, password-writeback]
keypoints:
  - "The reference says the user's Active Directory password has expired. Generate a new password for the user or have the user reset it with the self-service reset tool."
  - "The code name, InvalidPasswordExpiredOnPremPassword, refers to the on-premises password. My reading: check the on-premises password policy first."
  - "Entra password policy defaults: no expiration, but tenants created before 2021 have a 90 day value by default. Check it with Get-MgDomain."
  - "By default only passwords of accounts that are not synchronized through Microsoft Entra Connect can be configured to not expire."
  - "Changing DisablePasswordExpiration to None can force users with a LastPasswordChangeDateTime older than 90 days to change the password at next sign-in."
faq:
  - q: "What does AADSTS50144 mean?"
    a: "The code is InvalidPasswordExpiredOnPremPassword. The Microsoft Entra reference says the user's Active Directory password has expired. It tells you to generate a new password for the user or have the user use the self-service reset tool to reset their password."
  - q: "How does the user fix it?"
    a: "With self-service password reset, if it is enabled for them, or by getting a new password from an administrator. The reference lists both. The Learn page on password policies adds that password change history applies to password writeback. My reading is that the reset path for synchronized users therefore depends on writeback being set up. The page does not say this directly."
  - q: "Is the Entra password policy the cause?"
    a: "In my reading, not directly. The error name refers to the on-premises password. Learn says the Entra password policy applies to accounts created and managed in Entra ID, and applies to synchronized accounts only if EnforceCloudPasswordPolicyForPasswordSyncedUsers is enabled. My advice: check the on-premises policy first."
  - q: "How do I see whether a cloud user's password can expire?"
    a: "Connect to Microsoft Graph PowerShell as at least a User Administrator and run Get-MgUser with the PasswordPolicies property for the user, then test whether it contains DisablePasswordExpiration. The Learn page gives the full command for one user and for all users."
  - q: "Can I set all passwords to expire again?"
    a: "Learn warns that passwords set to DisablePasswordExpiration still age based on LastPasswordChangeDateTime. If you change them to PasswordPolicies None, all passwords with a LastPasswordChangeDateTime older than 90 days require a change at the next sign-in. This can affect many users."
---

AADSTS50144 means the user's password has expired, and the reference names the Active Directory password. The Microsoft Entra error reference gives one line on it. This article adds the context from the Learn page on password policies, so you can decide what to do for one user and what to check for many. The reference line covers only the meaning and the two fixes, and the details of policy come from the policy page. My own advice is marked.

## What the reference says

The row reads: InvalidPasswordExpiredOnPremPassword. The user's Active Directory password has expired. Generate a new password for the user or have the user use the self-service reset tool to reset their password.

So there are two ways out:

1. An administrator generates a new password for the user.
2. The user resets the password with the self-service reset tool.

## Which policy applies

The error name says OnPrem, so the expired password is the on-premises one. The Learn policy page explains how Entra ID and on-premises policy relate:

- A password policy is applied to all user accounts that are created and managed directly in Microsoft Entra ID.
- For accounts synchronized from on-premises with Microsoft Entra Connect, the Entra password policy applies only if you enable `EnforceCloudPasswordPolicyForPasswordSyncedUsers`.
- Learn says that by default only passwords for user accounts that are not synchronized through Microsoft Entra Connect can be configured to not expire.

The page gives these Entra policy values:

| Property | Value on the page |
| --- | --- |
| Password expiry duration (maximum password age) | Default: no expiration. A tenant created before 2021 has a 90 day value by default. Check with `Get-MgDomain`, change with `Update-MgDomain` |
| Let passwords never expire | Default: false, so passwords have an expiration date. Configurable per user with `Update-MgUser` |
| Password change history | The last password cannot be reused when the user changes a password |
| Password reset history | The last password can be reused when the user resets a forgotten password |

The page adds that password change history applies to password writeback. For cloud-only users, a reset does not have the old password and cannot check for reuse.

## Fix for one user

1. Confirm in the sign-in log or the error text that the code is AADSTS50144.
2. Choose the path:
   - Administrator: generate a new password for the user, as the reference says. Doing this in Active Directory is my reading, since that is the expired password.
   - User: use the self-service reset tool. For synchronized users this depends on your setup. Learn's policy page mentions password writeback in the context of change history, and the reference does not describe the setup, so my advice is to check that SSPR and writeback are configured before you point users to it.
3. Ask the user to sign in again with the new password.

## Checks for many users

If many users hit the error at once, my advice is to think of a policy change or of a date that passes for a whole group. Questions to ask, drawing on the policy page:

- Did someone change the on-premises maximum password age, or the Entra setting for synchronized users (`EnforceCloudPasswordPolicyForPasswordSyncedUsers`)?
- Was a "password never expires" setting removed? Learn warns that accounts with `DisablePasswordExpiration` still age based on `LastPasswordChangeDateTime`. If you change to `PasswordPolicies None`, every password with a `LastPasswordChangeDateTime` older than 90 days requires a change at the next sign-in, which can affect a large number of users.

## PowerShell checks on the policy page

Connect to Microsoft Graph PowerShell as at least a User Administrator.

Check one user:

```powershell
Get-MgUser -UserId <user ID> -Property UserPrincipalName, PasswordPolicies | Select-Object @{N="PasswordNeverExpires";E={$_.PasswordPolicies -contains "DisablePasswordExpiration"}}
```

Check all users:

```powershell
Get-MgUser -All -Property UserPrincipalName, PasswordPolicies | Select-Object UserPrincipalName, @{N="PasswordNeverExpires";E={$_.PasswordPolicies -contains "DisablePasswordExpiration"}}
```

To make one user's password expire, use `Update-MgUser -UserId <user ID> -PasswordPolicies None`. To make it never expire, use `-PasswordPolicies DisablePasswordExpiration`. The page applies the same guidance to Intune and Microsoft 365 and says password expiration is the only part of the policy you can change.

These commands read and change the Entra side. For a synchronized user the expired password in this error is the on-premises one, so check the Active Directory side too.

## Related behaviors from the page

- By default an account is locked out after 10 unsuccessful sign-in attempts with the wrong password, for one minute at first, and the lockout grows with further wrong attempts. Smart lockout tracks the last three bad password hashes. This can matter if users try old passwords again and again after an expiry. That link is my reading, not the page's.
- If a password change meets on-premises rules but not cloud rules, for example because it contains a Unicode character, it can succeed on-premises and fail in the cloud when the cloud policy is enforced. The page describes the user then being prompted again.

## Prevention (my advice)

This is my suggestion, not guidance from the page:

1. Send expiry reminders before the date, and make the self-service route easy to find.
2. Make sure SSPR and password writeback are working for synchronized users before the first wave of expiries.
3. Keep a record of the on-premises password age and of the Entra settings, so a change in either shows up quickly.
4. Do not switch policies for the whole tenant in one step. Use a test group first, in light of the 90-day warning.
5. For service accounts, decide on purpose how their passwords are managed, and keep them out of the normal expiry cycle only through a documented exception.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Active Directory](https://www.m365.fm/entity/active-directory/)
- [Self-service password reset (SSPR)](https://www.m365.fm/entity/self-service-password-reset/)
- [Password hash synchronization (PHS)](https://www.m365.fm/entity/password-hash-synchronization/)
- [Password writeback](https://www.m365.fm/entity/password-writeback/)

## Sources

- [Microsoft Entra authentication & authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Self-service password reset policies (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concept-sspr-policy)
