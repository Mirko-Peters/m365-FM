---
title: "Fix AADSTS50057: The User Account Is Disabled"
summary: "AADSTS50057 (UserDisabled) means the user account is disabled, in Entra or in Active Directory for synced accounts. Find the event in the sign-in logs, check Account enabled and Enable-ADAccount, and verify why it was disabled before you re-enable it."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [entra-id, entra-connect, active-directory]
keypoints:
  - "AADSTS50057 is listed as UserDisabled: the user account is disabled. The user object in Active Directory backing the account has been disabled."
  - "The error code reference says an admin can re-enable the account through PowerShell, and links the Enable-ADAccount cmdlet."
  - "Start in Entra ID, Monitoring and health, Sign-in logs, filter by user and Failure, and note the correlation ID, error code and failure reason."
  - "In Entra the setting is Account enabled under Account status on the user. Disabling a user is also a normal step when access is revoked."
  - "Before you re-enable an account, find out why it was disabled, since offboarding and incident response both use the same switch."
faq:
  - q: "What does AADSTS50057 mean?"
    a: "The Microsoft Entra error code reference lists it as UserDisabled: the user account is disabled. It adds that the user object in Active Directory backing this account has been disabled, and that an admin can re-enable the account through PowerShell, with a link to the Enable-ADAccount cmdlet."
  - q: "Where do I find the failed sign-in?"
    a: "Sign in to the Microsoft Entra admin center as at least a Reports Reader, go to Entra ID, Monitoring and health, Sign-in logs, search by username and select Failure in the Status menu. Open the event and save the correlation ID, the sign-in error code, the failure reason and the user identifiers."
  - q: "How is a user disabled in Microsoft Entra ID?"
    a: "The Learn page about revoking access describes it: in the Entra admin center, browse to Entra ID, Users, All users, select the user, under Account status select Edit, clear Account enabled and save. With Graph PowerShell the same is done with Update-MgUser and AccountEnabled set to false."
  - q: "Why is a user disabled in a hybrid environment?"
    a: "For a hybrid environment, the revoke access page recommends that admins disable the user in on-premises Active Directory with Disable-ADAccount, and reset the password twice. So a disabled directory object can be part of a deliberate offboarding or incident process, and you should check that before you re-enable the account."
  - q: "Does re-enabling fix everything immediately?"
    a: "Learn says that after access is revoked, the user cannot get new tokens, and the time until access is lost depends on how each application grants access: access tokens expire after one hour by default, and session tokens end when they expire. The pages do not state the delay in the other direction, so test a sign-in after you re-enable and check the sign-in log."
---

AADSTS50057 is one of the simplest sign-in errors to read and one of the most important to handle with care. The Microsoft Entra error code reference lists it as UserDisabled: the user account is disabled. For a synchronized account, it adds that the user object in Active Directory backing the account has been disabled, and that an admin can re-enable the account through PowerShell. This article shows how to find where the account is disabled, how it is done, and what to check before you switch it back on.

## Step 1: Confirm in the sign-in log

The Learn page on troubleshooting sign-in errors gives the route:

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Search by username, and select **Failure** in the **Status** menu.
4. Open the failed sign-in and save the **Correlation ID**, the **Sign-in error code**, the **Failure reason**, and the user name, user ID and sign-in identifier.

The **Failure reason** and **Additional Details** can give next steps. You can also paste the error code into the error code lookup tool, or search the sign-in error codes reference. Any user can see their own sign-ins at mysignins.microsoft.com.

If the code is 50057, move to the next step. Other codes in the log need other fixes.

## Step 2: Find where the account is disabled

There are two places, and the reference row mentions both.

### In Microsoft Entra ID

The setting is **Account enabled** on the user. Per the Learn page on revoking user access, an admin with a suitable role does this:

1. Open **Entra ID** > **Users** > **All users**, and select the user.
2. Under **Account status**, select **Edit**.
3. In **Properties**, the **Account enabled** setting is the one that disables sign-in. Clearing it disables the user.

With Microsoft Graph PowerShell the same page shows `Update-MgUser -UserId $User.Id -AccountEnabled:$false` to disable. To check the current value, read the user's `AccountEnabled` property. The roles named on that page for disabling users are User Administrator for non-admin users and Privileged Authentication Administrator for admin accounts.

### In on-premises Active Directory

The error code row says the user object in Active Directory backing the account has been disabled, and links `Enable-ADAccount`. For a hybrid environment, the revoke access page describes the opposite action for emergencies: disable the user in Active Directory with `Disable-ADAccount`, and reset the password twice in Active Directory. So a disabled directory object is a standard part of an incident or offboarding process.

If the account is synchronized, the on-premises object is the one to check first. I did not read the Microsoft Entra Connect pages for this article, so I do not describe how long the change takes to appear in the cloud.

## Step 3: Decide whether to re-enable

Do this before you change anything:

1. Ask who disabled the account and why. Offboarding, a compromised account and a long absence all use the same switch.
2. For an employee who left, the right fix is that the account stays disabled, and the user needs to get a different account or a rehire process.
3. For a returning user, follow your joiner process, then re-enable.

The revoke access page also lists what disabling does not cover on its own: access tokens last one hour by default, apps that use session tokens control their own sessions, and Entra cannot revoke a session token an app issued. So the reverse is also true in practice: after an account is disabled, you might see leftover sessions or tokens in some apps for a while. That follows from the page, and is not a statement about re-enabling.

## Step 4: Re-enable and test

- In Active Directory, use `Enable-ADAccount`, as the error code row says. Check the documentation of the cmdlet for its parameters.
- In Entra ID, set **Account enabled** back on for the user.
- Ask the user to sign in again. Then check the sign-in log for a successful event with the same user and app.

If the error remains, compare both places again. A synchronized user can be enabled in one directory and disabled in the other.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Read the log event first, so you know it is really 50057 and which app the user tried.
2. Check both the cloud account and the on-premises object before you change either.
3. Look at the user's audit history to see who changed the account and when, if your retention covers it.
4. Never re-enable an account only because a user asked. Require a ticket or approval from the manager or the security team.
5. After re-enabling, also check that licenses, group memberships and MFA registration are intact, since offboarding processes often remove them.
6. For bulk disabled accounts, such as after an incident, work from a list and re-enable in small batches.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Entra Connect](https://www.m365.fm/entity/entra-connect/)
- [Active Directory](https://www.m365.fm/entity/active-directory/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [How to troubleshoot sign-in errors (Microsoft Learn)](https://learn.microsoft.com/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors)
- [Revoke user access in an emergency in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/users/users-revoke-access)
