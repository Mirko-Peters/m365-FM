---
title: "Temporary Access Pass (TAP) Not Working? Setup and Troubleshooting in Microsoft Entra ID"
summary: "Temporary Access Pass not offered or rejected at sign-in? Check policy scope, one-time use, start time, guest type, registration policies and the 10-minute rule, in the order Microsoft Learn describes."
status: review
publish: false
author: mirko-p
date: 2026-11-29
topics: [temporary-access-pass, microsoft-entra, entra-id]
keypoints:
  - "A TAP can be created for any user, but only users included in the Temporary Access Pass authentication methods policy can sign in with it."
  - "If the TAP prompt does not appear, check policy scope first, then whether the user has a valid TAP and whether a one-time TAP was already used."
  - "A TAP can't be added to an external guest. Only internal guests can get one, and the error says so."
  - "A one-time TAP used to register a passwordless method must finish within 10 minutes of sign-in. Multiuse TAPs are not affected."
  - "Changes take a few minutes to replicate, so the prompt can appear late or linger after a TAP expires."
faq:
  - q: "Why does the user not see a Temporary Access Pass prompt?"
    a: "Microsoft Learn lists two checks. The user must be in scope for TAP in the Authentication methods policy, and the user must have a valid TAP. If the TAP is one-time use, make sure it was not already used. Replication can also take a few minutes."
  - q: "What does 'Temporary Access Pass sign in was blocked due to User Credential Policy' mean?"
    a: "Microsoft Learn names three causes to check: the user is not in scope for the TAP policy, the user has a multiuse TAP while the policy requires one-time TAPs, or a one-time TAP was already used."
  - q: "Can I create a TAP for a guest user?"
    a: "Only for an internal guest, meaning a user object with UserType Guest whose authentication methods are registered in Entra ID. For an external guest, Microsoft Learn says the admin center and Graph return the error that a TAP cannot be added to an external guest user."
  - q: "How long does a Temporary Access Pass last?"
    a: "According to Microsoft Learn, the policy allows 10 to 43,200 minutes (30 days) for minimum, maximum and default lifetime. The listed defaults are 1 hour minimum, 8 hours maximum and 1 hour default lifetime. Individual passes can override the default within the minimum and maximum."
  - q: "Does a TAP replace the user's password?"
    a: "No. Microsoft Learn says a TAP doesn't replace the password, so users can still sign in with their password. A TAP is meant for onboarding passwordless methods and for recovery."
---

When a Temporary Access Pass (TAP) does not work and no clear error appears, the cause is usually one of a short list: the user is outside the policy scope, the TAP is one-time and already used, the start time is in the future, or the account is an external guest. This guide covers setup first, then the checks in the order Microsoft Learn gives them.

Licensing is not stated on the Microsoft Learn page I read, so confirm your tenant's entitlements separately.

## What a TAP is

Microsoft describes a TAP as a time-limited passcode that can be configured for single use or multiple sign-ins. Users sign in with it to onboard other passwordless methods, such as a FIDO2 security key, and it makes recovery easier when a strong authentication method is lost. It does not replace the password.

## Set up the policy

You need at least the **Authentication Policy Administrator** role.

1. In the Microsoft Entra admin center, go to **Entra ID** > **Authentication methods** > **Policies**.
2. Select **Temporary Access Pass**.
3. Select **Enable**, then select the users or groups to include or exclude.
4. Optionally select **Configure** to change the default settings, then **Update**.
5. Select **Save**.

| Setting | Default | Allowed values |
|---|---|---|
| Minimum lifetime | 1 hour | 10 to 43,200 minutes (30 days) |
| Maximum lifetime | 8 hours | 10 to 43,200 minutes (30 days) |
| Default lifetime | 1 hour | 10 to 43,200 minutes (30 days) |
| One-time use | False | True or False |
| Length | 8 | 8 to 48 characters |

If one-time use is enforced in the policy, all passes in the tenant are one-time use. Only users included in the policy can sign in with a TAP, even though a TAP can be created for any user.

## Create a TAP

You need at least the **Authentication Administrator** role. Privileged Authentication Administrators can create TAPs for admins and members. Authentication Administrators can create them for members. Neither role can create one for themselves.

1. Go to **Entra ID** > **Users** and select the user.
2. Select **Authentication methods**, then **Add authentication method**.
3. Select **Temporary Access Pass**.
4. Set a custom activation time or duration and select **Add**.
5. Write down the TAP value. Microsoft says you can't view it after you select **OK**.

Each user can have only one TAP. A new TAP overrides an existing valid or expired one.

## Use the TAP

The user opens **Security info** at `https://mysignins.microsoft.com/security-info`, enters the user principal name and, if in scope of the policy, sees a prompt for the TAP. For federated domains, a TAP is preferred over federation, so the user is not redirected to the federated identity provider.

## Troubleshooting checklist

Work through these in order.

### 1. The TAP prompt is not offered

Microsoft lists two checks:

- The user is in scope for TAP in the Authentication methods policy.
- The user has a valid TAP. If it is one-time use, it must not have been used already.

Also consider timing. A TAP with a future start time is not yet usable (the PowerShell sample output shows the usability reason as `NotYetValid`). An expired or deleted TAP can't be used for interactive or non-interactive authentication. Changes take a few minutes to replicate, so the prompt may take a while to appear after you add a TAP, and users may still see it for a while after it expires.

### 2. "Sign in was blocked due to User Credential Policy"

Check that the user is in scope, that the user does not hold a multiuse TAP while the policy requires one-time TAPs, and that a one-time TAP was not already used.

### 3. "Temporary Access Pass cannot be added to an external guest user"

The account is an external guest. Only internal guest accounts can get a TAP, although both types show the option in the admin center and in Graph. External guests can sign in to a resource tenant with a TAP from their home tenant only if it meets home tenant requirements and cross-tenant access settings trust MFA from the home tenant.

### 4. Registration fails or the session ends early

- A one-time TAP used to register a passwordless method (FIDO2 key or phone sign-in) must be completed within 10 minutes of sign-in. This does not apply to multiuse TAPs.
- Users in scope for the SSPR registration policy or the Microsoft Entra ID Protection MFA registration policy must register after signing in with a TAP in a browser. They are redirected to the interrupt mode of combined registration, which currently does not support FIDO2 and phone sign-in registration.
- A TAP can't be used with the Network Policy Server (NPS) extension or the AD FS adapter.

### 5. Windows setup behaves differently

- **Entra joined during setup:** a TAP works without a password, including for Windows Hello for Business registration.
- **Already joined or hybrid joined:** the user must first authenticate with another method, such as a password, smartcard or FIDO2 key, before using a TAP for Windows Hello for Business.
- **Web sign-in enabled:** the user can sign in with a TAP. Microsoft says this is intended only for initial device setup or recovery.
- **Federated domains:** with `enforceMfaByFederatedIdp` the user is redirected to the federated provider for MFA and gets no TAP prompt for Windows Hello for Business. With `acceptIfMfaDoneByFederatedIdp` the user sees the TAP prompt.

If device enrollment takes longer than 10 minutes with a single-use TAP, a second TAP is needed for the passwordless step. One multiuse TAP avoids this.

## Fix and prevent

- Issue the TAP with a start time that has already begun, or tell the user when it starts.
- Use a multiuse TAP when enrollment and Windows Hello setup happen in one sitting, and monitor its use.
- Delete expired TAPs under **Authentication methods** by selecting **Delete** on the TAP row, or use `Remove-MgUserAuthenticationTemporaryAccessPassMethod`.
- Remember that tokens issued during a TAP sign-in are capped at the TAP expiration, but existing sessions are not invalidated. Use Conditional Access sign-in frequency to limit session length.

## Related

- [Temporary Access Pass](https://www.m365.fm/entity/temporary-access-pass/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Windows Hello for Business](https://www.m365.fm/entity/windows-hello-for-business/)
- [FIDO2](https://www.m365.fm/entity/fido2/)

## Sources

- [Configure a Temporary Access Pass in Microsoft Entra ID to register passwordless authentication methods, Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/authentication/howto-authentication-temporary-access-pass)
