---
title: "Microsoft Entra Authentication Methods Compared: Passkeys, Authenticator, FIDO2, TAP, SMS and Voice"
summary: "Which Microsoft Entra authentication methods work for primary sign-in, MFA, and SSPR or account recovery, based on the Microsoft Learn overview table. Which methods are phishing-resistant, what Verified ID is for, and a way to choose between them."
status: review
publish: false
author: mirko-p
date: 2027-01-25
topics: [entra-id, mfa, passkey, microsoft-authenticator, fido2, temporary-access-pass, windows-hello-for-business, phishing-resistant-mfa]
keypoints:
  - "Learn's overview table shows for each method whether it works as primary authentication, as a second factor for MFA, or for SSPR and account recovery."
  - "Passkey (FIDO2), passkey in Microsoft Authenticator, synced passkey, certificate-based authentication and Temporary Access Pass can serve as primary sign-in and MFA."
  - "SMS sign-in and voice call are not phishing-resistant. Voice call works only as MFA and SSPR, while SMS sign-in also works as primary authentication."
  - "Learn lists six phishing-resistant methods: Windows Hello for Business, Platform Credential for macOS, synced passkeys, FIDO2 security keys, passkeys in Authenticator and CBA."
  - "Verified ID is not an authentication method. It provides proof of identity for account recovery and cannot be used for sign-in, MFA or SSPR."
faq:
  - q: "Which methods can be used for primary sign-in?"
    a: "According to the Microsoft Learn table: certificate-based authentication, Microsoft Authenticator passwordless, passkey (FIDO2), passkey in Microsoft Authenticator, password, Platform Credential for macOS, QR code, SMS sign-in, synced passkey, Temporary Access Pass and Windows Hello for Business."
  - q: "Which methods are phishing-resistant?"
    a: "Learn lists Windows Hello for Business, Platform Credential for macOS, synced passkeys (FIDO2), FIDO2 security keys, passkeys in Microsoft Authenticator and certificate-based authentication. It says Microsoft recommends these because they provide the most secure sign-in experience, and that SMS, email OTP and authenticator app codes are prone to remote phishing."
  - q: "Can I use SMS or voice for password reset?"
    a: "The table shows SMS sign-in and voice call as available for SSPR. It also shows email OTP for SSPR, Authenticator push notifications, software OATH tokens and hardware OATH tokens (preview). Passkeys, Temporary Access Pass and Windows Hello for Business are not listed for SSPR."
  - q: "What is a Temporary Access Pass for?"
    a: "In the table, Temporary Access Pass can be used for primary authentication and for MFA, but not for SSPR. The overview page only lists it. For details such as lifetime and onboarding use the Learn page on Temporary Access Pass."
  - q: "Is Verified ID a way to sign in?"
    a: "No. Learn says it is an identity verification capability and not a traditional authentication method. It provides cryptographic proof of identity for account recovery when all authentication methods are lost, and it cannot satisfy sign-in, MFA or SSPR requirements."
---

Microsoft Entra ID supports many authentication methods, and they differ in what they can do. Some can replace the password, some only add a second factor, and some are only for password reset. This article puts the Microsoft Learn authentication overview into a comparison you can use when you plan a rollout. The page I read is the Learn overview of Microsoft Entra authentication, which holds the method table, and it does not give setup steps. I point to where setup details live and keep my own advice marked.

## The method table

The table shows when a method can be used for primary authentication (first factor), for secondary authentication with Microsoft Entra MFA, and for self-service password reset (SSPR) or account recovery.

| Method | Primary | Secondary | SSPR or recovery |
| --- | --- | --- | --- |
| Authenticator Lite | No | MFA | No |
| Certificate-based authentication | Yes | MFA | No |
| Email OTP | No | SSPR and sign-in (see note) | SSPR |
| External MFA | No | MFA | No |
| Hardware OATH tokens (preview) | No | MFA | SSPR |
| Microsoft Authenticator passwordless | Yes | No | No |
| Microsoft Authenticator push notifications | No | MFA | SSPR |
| Passkey (FIDO2) | Yes | MFA | No |
| Passkey in Microsoft Authenticator | Yes | MFA | No |
| Password | Yes | No | No |
| Platform Credential for macOS | Yes | MFA | No |
| QR code | Yes | No | No |
| SMS sign-in | Yes | MFA | SSPR |
| Software OATH tokens | No | MFA | SSPR |
| Synced passkey | Yes | MFA | No |
| Temporary Access Pass (TAP) | Yes | MFA | No |
| Verified ID | No | No | Account recovery |
| Voice call | No | MFA | SSPR |
| Windows Hello for Business | Yes | MFA (see note) | No |

Notes from the page:

- Windows Hello for Business can serve as a step-up MFA credential if the user is enabled for passkey (FIDO2) and has a passkey registered.
- Email OTP is available for tenant members for SSPR. You can also configure it for sign-in by guest users.
- Verified ID is an identity verification capability, not a traditional authentication method. It provides proof of identity for account recovery but cannot be used for sign-in, MFA or SSPR.

## Reading the table by goal

**You want to replace the password (primary authentication).** Candidates are Windows Hello for Business, passkeys (FIDO2, synced, or in Microsoft Authenticator), certificate-based authentication, Platform Credential for macOS, Microsoft Authenticator passwordless, SMS sign-in, QR code and Temporary Access Pass. Several of these are in the phishing-resistant list below.

**You want a second factor only.** Authenticator push notifications, Authenticator Lite, software and hardware OATH tokens, voice call, external MFA and the primary methods that also list MFA.

**You want self-service password reset.** Email OTP, Authenticator push, OATH tokens, SMS and voice. The table shows no SSPR role for passkeys, TAP or Windows Hello for Business.

**You want to help a user who lost every method.** Learn lists Verified ID for account recovery. Temporary Access Pass appears as primary authentication and MFA in the table, and its page covers how to use it. The overview does not call it a recovery tool, so check that page before you plan on it.

## Phishing-resistant methods

Learn says traditional MFA with SMS, email OTP or authenticator apps improves security over passwords alone, but adds friction, such as entering codes or approving notifications, and is prone to remote phishing attacks. In such an attack the attacker uses social engineering and AI-driven tools to steal credentials, such as passwords or one-time codes, without physical access to the device.

Microsoft recommends phishing-resistant methods because they provide the most secure sign-in experience. The list on the page:

- Windows Hello for Business
- Platform Credential for macOS
- Synced passkeys (FIDO2)
- FIDO2 security keys
- Passkeys in Microsoft Authenticator
- Certificate-based authentication (CBA)

Compare that list with the table: SMS sign-in, voice call, email OTP, push notifications and OATH codes are not on it.

## Verified ID and account recovery

Learn describes high-assurance account recovery as helping users who lost all their credentials. Instead of a help desk call with questions, Entra ID supports government-issued ID verification with biometric matching, which removes the need for help desk intervention. Organizations choose an identity verification provider through the Microsoft Security Store. The page says partners cover 192 countries and regions, and that Entra Verified ID Face Check, powered by Azure AI services, matches a real-time selfie to the photo on the identity document. Only the match result is shared. Admins set this up through the Account Recovery setup wizard in the Microsoft Entra admin center.

## Choosing methods (my advice)

This is my suggestion, not guidance from the page:

1. Pick one phishing-resistant method as your target for each user group, for example Windows Hello for Business on managed Windows devices and passkeys for other users.
2. Keep one fallback method per group, and decide in advance which one it is. A fallback that is weaker than the target should be limited to what the group needs.
3. Plan the day-one case, a new user with no method, and the lost-device case. Check the Temporary Access Pass page and the account recovery options for those cases.
4. Treat SMS and voice as transition methods, since they are not on the phishing-resistant list.
5. Decide which methods allow SSPR for each group, and compare the SSPR column with your policy.
6. Re-check the table now and then. Methods marked preview, such as hardware OATH tokens, can change.

## Where to go next

This overview page only compares. For setup of a single method, use the Learn pages that the table links, for example those on passkeys (FIDO2), the Authenticator app, Temporary Access Pass, certificate-based authentication, SMS sign-in and phone options.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multifactor authentication (MFA)](https://www.m365.fm/entity/mfa/)
- [Passkey](https://www.m365.fm/entity/passkey/)
- [Microsoft Authenticator](https://www.m365.fm/entity/microsoft-authenticator/)
- [FIDO2](https://www.m365.fm/entity/fido2/)
- [Temporary Access Pass](https://www.m365.fm/entity/temporary-access-pass/)
- [Windows Hello for Business](https://www.m365.fm/entity/windows-hello-for-business/)
- [Phishing-resistant MFA](https://www.m365.fm/entity/phishing-resistant-mfa/)

## Sources

- [Microsoft Entra authentication overview (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/overview-authentication)
