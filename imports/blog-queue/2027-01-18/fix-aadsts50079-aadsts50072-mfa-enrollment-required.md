---
title: "Fix AADSTS50079 and AADSTS50072: MFA Enrollment Required at Sign-In"
summary: "AADSTS50079 and AADSTS50072 both mean the user must enroll in multifactor authentication: 50072 is the interactive interrupt, 50079 the required-enrollment error. Learn what triggers them, how combined registration works, and what managed and federated users each need to do."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [entra-id, mfa, conditional-access]
keypoints:
  - "AADSTS50072 is UserStrongAuthEnrollmentRequiredInterrupt: the user needs to enroll for second factor authentication, interactively."
  - "AADSTS50079 is UserStrongAuthEnrollmentRequired and names Conditional Access, per-user enforcement or a new location as triggers."
  - "A managed user registers security info; a federated user needs the multifactor claim from the federated identity provider."
  - "Combined registration has interrupt mode at sign-in and manage mode on the Security info page."
  - "Registration itself can be protected by Conditional Access, and authentication strength can conflict with the fresh-MFA requirements for managing security info."
faq:
  - q: "What is the difference between AADSTS50072 and AADSTS50079?"
    a: "The Entra error reference lists 50072 as UserStrongAuthEnrollmentRequiredInterrupt, where the user needs to enroll for second factor authentication interactively. 50079 is UserStrongAuthEnrollmentRequired, a configuration-driven requirement to use multifactor authentication."
  - q: "What can trigger AADSTS50079?"
    a: "The reference names a configuration change by the admin such as a Conditional Access policy or per-user enforcement, or a user moving to a new location, which makes the user required to use multifactor authentication."
  - q: "What must the user do?"
    a: "The reference says a managed user needs to register security info to complete multifactor authentication, while a federated user needs to get the multifactor claim from the federated identity provider."
  - q: "How does the user register?"
    a: "Through combined registration. Learn describes an interrupt mode that appears at sign-in as a wizard, and a manage mode on the Security info page of My Account."
  - q: "Can an admin control where registration happens?"
    a: "Yes. Learn says user actions in Conditional Access can secure when and how users register, for example from a trusted network location during onboarding."
---

AADSTS50072 and AADSTS50079 both tell you that a user has to get multifactor authentication in place before sign-in can finish. In the Microsoft Entra error reference, 50072 is UserStrongAuthEnrollmentRequiredInterrupt (the user needs to enroll for second factor authentication, interactively) and 50079 is UserStrongAuthEnrollmentRequired. For a managed user the remedy is to register security info. For a federated user it is to obtain the multifactor claim from the federated identity provider.

## The two rows

From the error reference:

- **AADSTS50072, UserStrongAuthEnrollmentRequiredInterrupt:** the user needs to enroll for second factor authentication (interactive).
- **AADSTS50079, UserStrongAuthEnrollmentRequired:** due to a configuration change made by the admin, such as a Conditional Access policy, per-user enforcement, or because the user moved to a new location, the user is required to use multifactor authentication. Either a managed user needs to register security info to complete multifactor authentication, or a federated user needs to get the multifactor claim from the federated identity provider.

The word interrupt in 50072 suggests that the sign-in is paused so that the user can enroll. That is my reading of the name. The reference gives only the short description above.

## Managed or federated

The 50079 row separates two cases, and the fix depends on which one applies:

1. **Managed user.** The user authenticates with Microsoft Entra ID and must register security info to complete multifactor authentication.
2. **Federated user.** The user authenticates through a federated identity provider and needs to obtain the multifactor claim from that provider. The row says the claim has to come from the federated identity provider; my reading is that registering methods in Entra ID is therefore not the fix for this group.

Check how the account signs in before you advise the user.

## How registration works

Learn's page on combined registration describes a single place to register for multifactor authentication and self-service password reset. It has two modes:

- **Interrupt mode:** a wizard-like experience shown when users register or refresh their security info at sign-in.
- **Manage mode:** part of the user profile, where users manage their security info.

The page gives sample scenarios in which users are asked to register during sign-in: registration enforced through Microsoft Entra ID Protection, through per-user multifactor authentication, or through Conditional Access or other policies. In the Conditional Access case, users are asked when they use a resource that requires multifactor authentication.

My reading: this lines up with the 50079 row, where a policy or per-user setting now requires MFA, the user has no registered method, and sign-in is interrupted to enroll. Learn does not link the combined registration page to the error code.

### What users see

In the interrupt flow, Learn says users are shown the minimum number of methods needed to be compliant with the policies, from most to least secure. They can choose **I want to set up a different method** when setting up Microsoft Authenticator, and the list of available methods comes from the tenant's Authentication methods policy.

If registration is not enforced, users can go to the Security info page in My Account, choose to add a method and follow the steps.

### Methods

The page lists methods that combined registration supports, with limits, for example Microsoft Authenticator (maximum of 5), phone (maximum of 2) and passkey (FIDO2) (maximum of 10). Some methods are tied to conditions: office phone in interrupt mode needs the Business phone property to be set, and app passwords are only for users enforced for per-user MFA.

## Protecting registration itself

Learn says admins can use user actions in Conditional Access to control when and how users register, for example to allow registration only from a trusted network location during onboarding. The page links to common policies for securing security info registration.

The page also warns about a conflict. By default, combined registration requires MFA-capable users to authenticate strongly before registering or managing security info. It names two requirements: adding or changing a passkey (FIDO2) needs strong authentication within the past 5 minutes, and starting August 25, 2025 users must complete MFA when managing credentials if they have not done so within the last 10 minutes of their session. Enforcing authentication strengths for security info registration can conflict with these requirements, and users might see an error that another sign-in method is required. Learn suggests changes at tenant level, such as Sign-in frequency Every time for the Register security info user action, or at user level.

## What an admin can do

This section is my advice, not a Microsoft statement.

1. **Find out why MFA is now required.** The row lists Conditional Access, per-user enforcement or a location change. Open the sign-in log entry for the failed attempt and look at which policy applied.
2. **Decide whether the user is meant to enroll.** If a new policy was just switched on for a group, many users will hit these errors on the same day. A heads-up message with a link to the Security info page prevents tickets.
3. **Provide a safe place to enroll.** Learn describes trusted locations for registration through Conditional Access. If your policy requires MFA everywhere, make sure users have a path to register that is not blocked by the same policy.
4. **Handle federated users separately.** Their fix lies with the federated identity provider, so involve whoever runs it.
5. **Test with a pilot account.** Remove all methods from a test user, sign in, and walk through the interrupt wizard yourself.
6. **Tell users to use a modern browser.** Learn says to use a modern browser such as Microsoft Edge for registration and notes that IE11 isn't officially supported.

## What the sources do not say

The reference rows give no step-by-step instructions, and Learn's combined registration page does not mention AADSTS50072 or AADSTS50079. The link between the two in this article rests on the row text, which names registering security info. Neither source explains how federation claims are configured, so that part is not covered here.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multifactor authentication](https://www.m365.fm/entity/mfa/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Authenticator](https://www.m365.fm/entity/microsoft-authenticator/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Combined registration for SSPR and Microsoft Entra multifactor authentication - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concept-registration-mfa-sspr-combined)
