---
title: "Turn On the Microsoft Entra Registration Campaign for Authenticator or Passkeys"
summary: "Enable the Microsoft Entra registration campaign using Microsoft Learn: role, prerequisites, Microsoft managed versus Enabled states, snooze settings, Graph properties, user experience and the documented limitations."
status: review
publish: false
author: mirko-p
date: 2026-12-27
topics: [microsoft-authenticator, mfa]
keypoints:
  - "A registration campaign nudges users during an interactive sign-in with MFA to set up a passkey (FIDO2) or Microsoft Authenticator. It can target one method at a time."
  - "Configure it under Entra ID, Authentication methods, Registration campaign, Edit, as at least an Authentication Policy Administrator."
  - "For Authenticator the authentication mode must be Any or Push. Passwordless users are not eligible."
  - "Snooze days range from 0 to 14. In Microsoft managed the default is 1 day and Authenticator users must register after 3 snoozes."
  - "No nudge appears if Conditional Access blocks the Register security information page, if terms of use appear, or on mobile for Authenticator."
faq:
  - q: "What does the registration campaign do?"
    a: "According to Microsoft Learn, it nudges users to set up a passkey (FIDO2) or Microsoft Authenticator during an interactive sign-in that uses multifactor authentication."
  - q: "What role do I need?"
    a: "At least the Authentication Policy Administrator role."
  - q: "What is the difference between Microsoft managed and Enabled?"
    a: "In Microsoft managed, Microsoft selects the method and settings and you define included users. In Enabled, you select the method, snooze settings and included users."
  - q: "How do I stop users from skipping?"
    a: "Learn says to set Days allowed to snooze to 0 and Limited number of snoozes to Enabled. Users still get up to three snoozes but are prompted on every MFA attempt until then, after which registration is required."
  - q: "Can I use Microsoft Graph?"
    a: "Yes. Learn shows a PATCH on policies/authenticationmethodspolicy that updates only the registrationEnforcement section. The permissions are Policy.Read.All and Policy.ReadWrite.AuthenticationMethod."
---

The registration campaign nudges users to register a stronger sign-in method while they sign in. It is a prompt, not a block, and users can postpone it. This guide follows the Microsoft Learn article on the registration campaign for a passkey or Microsoft Authenticator.

## Prerequisites

- **Authenticator campaign:** enable users for Authenticator in the authentication methods policy. The authentication mode must be **Any** or **Push**. If it is **Passwordless**, users are not eligible. Targeted users must be in scope for the method.
- **Passkey campaign:** enable passkey (FIDO2) in the policy and turn on **Allow self-service setup**.
- Optional: check registration counts in the authentication methods activity report.

## Enable it in the Entra admin center

1. Sign in to the Microsoft Entra admin center as at least an Authentication Policy Administrator.
2. Browse to **Entra ID**, **Authentication methods**, **Registration campaign**, and select **Edit**.
3. Set **State** to **Enabled** or **Microsoft managed**.
4. Set **Authentication method** to **Microsoft Authenticator** or **Passkey**.
5. Select users or groups to include or exclude, then **Save**.

## Campaign states

| State | Who configures |
| --- | --- |
| Microsoft managed | Microsoft selects the method and settings. You define included users. |
| Enabled | You choose the method, snooze settings and included users. |
| Disabled | The campaign is off. |

| Setting | Microsoft managed | Enabled |
| --- | --- | --- |
| Days allowed to snooze | Set by Microsoft (1) | 0 to 14 |
| Limited number of snoozes | Authenticator enabled, passkey disabled | On or off |
| Include and exclude | Configurable | Configurable |

In Microsoft managed, passkeys are targeted when included users are enabled for passkeys, otherwise Authenticator. Eligible Authenticator users do MFA by voice call or SMS and do not yet have Authenticator push set up. After 3 snoozes, registration is required.

## Snooze behavior

Users select **Skip for now**. A value of 3 days means a skipped user is not prompted for three days. A value of 0 prompts on every MFA attempt. The snooze count persists across restarts and configuration changes.

## Microsoft Graph

Retrieve the policy with GET on `policies/authenticationmethodspolicy`, then PATCH only `registrationEnforcement`. Properties on the page include `snoozeDurationInDays` (0 to 14, default 1), `enforceRegistrationAfterAllowedSnoozes` (default true), `state`, `includeTargets` and `excludeTargets`. A user in both an excluded and an included group is excluded. The page shows JSON examples for all users and for specific users and groups.

## What users see

For an Authenticator campaign, the user completes MFA and, if enabled for Authenticator push and not yet set up, is prompted to set it up. They select **Next** to continue or **Skip for now** to postpone. Users with free and trial subscriptions can snooze up to three times.

For a passkey campaign, the user completes MFA and, if no qualifying passkey is available for the current platform, is prompted to create one. The device or browser shows the creation prompt, the user verifies with face, fingerprint or PIN, names the passkey and selects **Done**. If registration errors occur, an error screen with a **Skip** option appears, and those skips do not count toward the snooze limit.

## Passkey eligibility under Microsoft managed

Learn says a user is nudged under Microsoft managed only if they are in at least one passkey profile that meets the page's criteria. Unrestricted, synced-only and device-bound-only profiles qualify, as do AAGUID-restricted profiles whose allow list contains at least one AAGUID for iCloud Keychain, Google Password Manager, the Microsoft Authenticator passkey or the Microsoft Entra passkey on Windows. Under Enabled, any passkey-enabled user in any profile can be nudged.

## Limitations

- One method at a time, and not both in one tenant simultaneously.
- Authenticator campaigns are not supported on mobile devices.
- Snooze duration is tenant-wide.
- The nudge works only for users doing MFA with Microsoft Entra MFA.
- Guests are nudged for Authenticator but not passkeys.
- Closing the browser counts as a snooze.
- No nudge if Conditional Access blocks the Register security information page, if a terms of use screen appears, or after a redirect from Conditional Access custom controls.
- Conditional Access policies that govern registration apply first.

## Suggestion for a pilot

This is a suggestion, not Microsoft guidance. Start with a pilot group, test with Conditional Access, then widen the scope.

## Not covered

The page does not describe other registration enforcement options.

## Related

- [Microsoft Authenticator](https://www.m365.fm/entity/microsoft-authenticator/)
- [MFA](https://www.m365.fm/entity/mfa/)

## Sources

- [Registration campaign for passkey or Microsoft Authenticator](https://learn.microsoft.com/entra/identity/authentication/how-to-mfa-registration-campaign)
