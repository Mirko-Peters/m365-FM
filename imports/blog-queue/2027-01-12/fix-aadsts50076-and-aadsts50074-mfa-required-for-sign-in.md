---
title: "Fix AADSTS50076 and AADSTS50074: MFA Is Required for the Sign-In"
summary: "What AADSTS50076 and AADSTS50074 mean according to the Microsoft Entra error code reference, how they relate to AADSTS50072 and AADSTS50079, the one documented client action and a practical checking order for admins, with the gaps in the reference."
status: review
publish: false
author: mirko-p
date: 2027-01-12
topics: [entra-id, mfa]
keypoints:
  - "AADSTS50076 means MFA is now required, for example because of Conditional Access, per-user enforcement or a new location. The documented action is a new authorize request."
  - "AADSTS50074 means strong authentication is required and the user did not pass the MFA challenge. The reference gives no action for it."
  - "AADSTS50072 means the user needs to enroll for a second factor. AADSTS50079 means security info must be registered, or a federated user needs the MFA claim."
  - "The reference gives no remediation steps for 50076 and 50074 beyond the retry. This guide labels its own admin checks as practical advice."
  - "Error text can change. The page points to the login.microsoftonline.com error lookup for current guidance."
faq:
  - q: "What does AADSTS50076 mean?"
    a: "Microsoft Learn says that due to a configuration change made by the admin, such as a Conditional Access policy, per-user enforcement, or because the user moved to a new location, the user must use multifactor authentication to access the resource. Its action is to retry with a new authorize request for the resource."
  - q: "What does AADSTS50074 mean?"
    a: "Strong authentication is required and the user did not pass the MFA challenge. The reference describes it and gives no recommended action."
  - q: "How is AADSTS50079 different?"
    a: "It says the user is required to use MFA because of a configuration change. Either a managed user needs to register security info, or a federated user needs to get the multifactor claim from the federated identity provider."
  - q: "What is AADSTS50072?"
    a: "The user needs to enroll for second factor authentication, in an interactive flow. The reference gives no action for it."
  - q: "Where can I look up the current text?"
    a: "The page says error text can change and points to login.microsoftonline.com/error with the code number for current guidance."
---

AADSTS50076 and AADSTS50074 appear when a sign-in needs multifactor authentication and the client cannot or does not complete it. The Microsoft Entra error code reference describes them in one or two sentences. This guide reports exactly what the reference says, then adds an admin checking order that is labeled as practical advice.

## What the reference says

| Code | Name | Description on the page | Action on the page |
| --- | --- | --- | --- |
| AADSTS50072 | UserStrongAuthEnrollmentRequiredInterrupt | The user needs to enroll for second factor authentication (interactive) | None stated |
| AADSTS50074 | UserStrongAuthClientAuthNRequiredInterrupt | Strong authentication is required and the user did not pass the MFA challenge | None stated |
| AADSTS50076 | UserStrongAuthClientAuthNRequired | Due to a configuration change made by the admin such as a Conditional Access policy, per-user enforcement, or because you moved to a new location, the user must use multifactor authentication to access the resource | Retry with a new authorize request for the resource |
| AADSTS50079 | UserStrongAuthEnrollmentRequired | Same cause as 50076, and either a managed user needs to register security info or a federated user needs to get the multifactor claim from the federated identity provider | The two paths in the description |

## Reading the two codes

- **AADSTS50076** says the requirement came from a configuration change or a new location. The sign-in needs MFA that it did not have yet. The reference's action is for the application to start a new authorize request so the user can complete MFA.
- **AADSTS50074** says the user was asked for MFA and did not pass the challenge. The reference does not say why, for example whether the user cancelled, timed out or failed.

## What the reference does not say

- Any remediation steps for 50076 and 50074 besides the retry.
- Links to MFA registration or Conditional Access troubleshooting in these rows.
- A client action column for these codes. The generic OAuth error table does not map to them.
- Whether the codes are always shown to the user.

## A checking order

This order is practical advice and is not from the reference.

1. Read the exact code and the correlation details in the Entra sign-in log for the failed attempt.
2. Look at which Conditional Access policies applied to that sign-in and whether one requires MFA.
3. Check whether per-user MFA enforcement is on for the account.
4. Ask whether the user signed in from a new location or device.
5. For 50074, ask the user whether they saw the MFA prompt and what they did with it.
6. For application developers, make sure the app can handle an interactive request and starts a new authorize request when it receives 50076.

## Related codes

If the user has not registered a second factor, 50072 or 50079 fits better. For 50079 the reference names registering security info for managed users and getting the multifactor claim for federated users.

## Typical mistakes

- Treating AADSTS50076 as a bug in the application when the tenant policy changed.
- Retrying a silent token request instead of an interactive one.
- Expecting the reference to list admin remediation steps.
- Forgetting that the text of error messages can change.

## Quick reference

- 50072 and 50079 relate to enrollment: the user must enroll for a second factor or register security info.
- 50076 and 50074 relate to the challenge itself: MFA is required, or the user did not pass it.
- Only 50076 and 50079 carry an action on the page. The action for 50076 is a new authorize request. For 50079 it depends on whether the user is managed or federated.
- Federated users get the multifactor claim from the federated identity provider, not from Entra ID.
- The page shows error text that can change. Use the error lookup it names when wording differs from what you see.

## How to use this in a support case

This is practical advice. Collect the exact code, the time of the attempt and the application name from the user. Then match the code to the table above before you open policies. If the code is 50072 or 50079, the question is about registration. If it is 50076 or 50074, the question is about the challenge and the policies that triggered it.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
