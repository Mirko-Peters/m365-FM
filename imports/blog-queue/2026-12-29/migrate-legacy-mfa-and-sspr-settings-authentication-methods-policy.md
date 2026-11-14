---
title: "Migrate Legacy MFA and SSPR Settings to the Authentication Methods Policy in Entra ID"
summary: "Move from legacy per-user MFA service settings and SSPR method settings to the Entra ID Authentication methods policy using Microsoft Learn: role, migration states, wizard and manual steps, method mapping tables, per-method guidance, what is not migrated and rollback."
status: review
publish: false
author: mirko-p
date: 2026-12-29
topics: [entra-id, mfa, microsoft-authenticator]
keypoints:
  - "Sign in as at least an Authentication Policy Administrator. The migration covers tenant policy settings only, and individual user settings are not migrated."
  - "Set Migration in progress under Authentication methods, Manage migration before you change anything. Migration Complete makes Entra follow only the new policy."
  - "The migration is fully reversible. You can switch from Migration Complete back to Migration in progress at any time."
  - "Legacy MFA settings are under Users, Per-user MFA, service settings. Legacy SSPR methods are under Users, Password reset, Authentication methods."
  - "Security questions stay in the legacy SSPR policy. The page gives no retirement deadline and no PowerShell or Graph examples."
faq:
  - q: "Which role do I need?"
    a: "According to Microsoft Learn, at least the Authentication Policy Administrator role."
  - q: "Can I undo the migration?"
    a: "Yes. Learn says the migration is fully reversible. Setting the status back to Migration in progress re-enables the legacy policies, although in Migration Complete only security questions can be changed in the legacy SSPR policy."
  - q: "How does the wizard decide which methods to enable?"
    a: "It enables a method in the Authentication methods policy if it is enabled in either legacy policy, so users keep signing in and resetting passwords the same way. It also recommends passkeys, Temporary Access Pass and Microsoft Authenticator."
  - q: "What does not migrate?"
    a: "Individual user settings and security questions. Methods that exist only in the new policy, such as FIDO2, Temporary Access Pass and certificate-based authentication, need no migration changes."
  - q: "Is there a deadline?"
    a: "The page does not give a retirement date or enforcement timeline for the legacy policies."
---

Microsoft Entra ID has kept multifactor authentication (MFA) and self-service password reset (SSPR) method settings in separate legacy policies. The Authentication methods policy manages them together. This guide follows the Microsoft Learn article on migrating to it.

## Before you start

Sign in as at least an Authentication Policy Administrator. Audit the MFA policy, the SSPR policy if you use it, and the Authentication methods policy if you use it. A new tenant has all methods Off by default, which simplifies migration. Two paths exist: an automated wizard and a manual process.

## Migration states

- **Migration in progress:** set under **Authentication methods**, **Policies**, **Manage migration**. Set it before making changes, because the new policy then applies to both sign-in and password reset.
- **Migration Complete:** Entra follows only the Authentication methods policy. Legacy policies cannot be changed, except security questions in SSPR.

The page names these two states, not a pre-migration state.

## Automated wizard

1. Open **Entra ID**, **Authentication methods**, **Policies** and start the wizard.
2. Review the explanation and links to each legacy policy.
3. Review the recommended configuration. The wizard enables a method if either legacy policy enabled it. It also recommends passkeys, Temporary Access Pass and Microsoft Authenticator. The pencil icon edits a method.
4. Select **Migrate** and confirm.

Legacy methods are then grayed out and the status becomes Migration Complete.

## Manual migration

Audit the legacy settings first:

- MFA: **Users**, **Per-user MFA**, service settings. They are tenant-wide.
- SSPR: **Users**, **Password reset**, **Authentication methods**. Security questions are under **Password reset**, **Properties**.

| Legacy MFA option | Authentication methods policy |
| --- | --- |
| Call to phone | Voice calls |
| Text message to phone | SMS |
| Notification through mobile app | Microsoft Authenticator |
| Verification code from app or hardware token | Third party software OATH tokens, Hardware OATH tokens, Microsoft Authenticator |

| Legacy SSPR option | Authentication methods policy |
| --- | --- |
| Mobile app notification | Microsoft Authenticator |
| Mobile app code | Microsoft Authenticator, Software OATH tokens |
| Email | Email OTP |
| Mobile phone | Voice calls, SMS |
| Office phone | Voice calls, Configure tab |
| Security questions | Not yet available |

Then set Migration in progress and review each method. If a method was enabled in both policies, enable it for all users. If it was off in both, leave it off. If it was enabled in only one, decide whether it should be available everywhere. You can target groups or exclude groups, and you need not match the legacy policy exactly.

## Per-method guidance

- **Microsoft Authenticator:** if app notifications were enabled, enable it for all users with mode Any. If verification codes were enabled, set Allow use of Microsoft Authenticator OTP to Yes. Users who registered it only for OTP through the different authenticator app option need Third-party software OATH tokens.
- **OATH tokens:** the new policy splits Microsoft Authenticator OTP, third-party software tokens and hardware tokens.
- **SMS and voice:** if SSPR used Mobile phone, enable both. If it used Office phone, enable Voice calls and Office phone on the Configure tab. SMS has Use for sign-in on by default, and users with it enabled are skipped from cross-tenant synchronization, so disable it if you use that or do not want SMS sign-in.
- **Email OTP:** enable for member users for password reset. Email OTP cannot be disabled while external users are allowed to use it.
- **Security questions:** leave them enabled in the legacy SSPR policy if you want to keep them. You can still finish migration.

## Finish and roll back

Update the new policy, remove legacy methods one at a time and test, then set Migration Complete. To roll back, set Migration in progress again.

## Audit the Authentication methods policy

Open **Entra ID**, **Authentication methods**, **Policies** and record what is already enabled. The page notes methods that exist only there, such as FIDO2 security keys, Temporary Access Pass and certificate-based authentication, and they are out of migration scope. Note the users, groups and configuration parameters, for example Microsoft Authenticator showing location in push notifications.

## Example of targeting

Learn gives an example of enabling Microsoft Authenticator for all users while limiting SMS and voice calls to a group of 20 users. Voice calls has a Configure tab where you allow office and mobile phones or mobile only. Disabling a method that users already use may require them to register new methods and stops them from using the previously registered ones, so plan communication first.

## Not covered

The page gives no deadlines, no licensing requirements, no staged rollout guidance and no commands, only a link to the Graph authentication methods overview.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multi-factor authentication](https://www.m365.fm/entity/mfa/)
- [Microsoft Authenticator](https://www.m365.fm/entity/microsoft-authenticator/)

## Sources

- [How to migrate MFA and SSPR policy settings to the Authentication methods policy](https://learn.microsoft.com/entra/identity/authentication/how-to-authentication-methods-manage)
