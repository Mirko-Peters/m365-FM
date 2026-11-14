---
title: "Microsoft Entra Passkeys: Common Mistakes to Avoid When You Roll Them Out"
summary: "Seven passkey (FIDO2) rollout mistakes drawn from Microsoft Learn's documented warnings: profiles, self-service setup, attestation, AAGUID lists, synced passkeys, exclusions and lockout risk."
status: review
publish: false
author: mirko-p
date: 2026-12-04
topics: [microsoft-entra, entra-id, passkey, fido2]
keypoints:
  - "Opting in to passkey profiles is one-way, and your existing global settings move into the Default passkey profile, so plan that profile before you opt in."
  - "Allow self-service set up is a global setting. If it is No, users can't register passkeys in Security info, even when passkeys are enabled."
  - "Attestation is enforced only at registration, and synced passkeys don't support attestation. Removing an allowed AAGUID later breaks sign-in for users who registered it."
  - "Learn recommends device-bound passkeys, such as security keys or Microsoft Authenticator, for admins and highly privileged users instead of synced passkeys."
  - "Register phishing-resistant methods before you require them in Conditional Access, or you risk locking yourself out."
faq:
  - q: "Can I turn passkey profiles off after enabling them?"
    a: "No. Microsoft Learn states that after you opt in to passkey profiles you can't opt out. Existing global passkey settings transfer to the Default passkey profile, and up to three profiles, including the default, are supported."
  - q: "Why can't users register a passkey even though the policy is enabled?"
    a: "Learn says Allow self-service set up is a global setting rather than a profile setting. If it is No, users can't register passkeys through Security info even if the Authentication methods policy enables passkeys. Check also that the user isn't in an excluded group, because exclusion overrides inclusion."
  - q: "Does enforcing attestation affect passkeys users already registered?"
    a: "No. Learn says attestation enforcement governs only registration. Users who registered a passkey without attestation aren't blocked from sign-in if you later set Enforce attestation to Yes. Synced passkeys don't support attestation."
  - q: "Are synced passkeys suitable for administrators?"
    a: "Learn's synced passkeys page recommends device-bound passkeys, such as FIDO2 security keys or passkeys in Microsoft Authenticator, for admins and highly privileged users. It describes synced passkeys as a convenient, low-cost option for most users outside highly regulated environments."
  - q: "What happens to a passkey when a UPN changes?"
    a: "Learn says you can no longer modify passkeys to account for the change. The user needs to sign in to Security info, delete the old passkey and add a new one."
---

Passkeys in Microsoft Entra are included in every Entra ID edition, but a rollout can still go wrong in predictable ways. The mistakes below come straight from warnings and known issues on Microsoft Learn. The page itself says a few of them are easy to miss, so read them before you change the policy.

## 1. Opting in to profiles without planning the default

Passkey profiles are named rule sets, such as attestation, passkey types and AAGUID restrictions, applied to groups. Learn says that after you opt in you can't opt out, and that your existing global passkey settings move to the **Default passkey profile**. Up to three profiles are supported, including the default.

Plan the default first. If your global setting was permissive, the default profile starts permissive.

## 2. Leaving self-service setup off

To enable profiles, you go to **Entra ID** > **Security** > **Authentication methods** > **Policies** > **Passkey (FIDO2)**, then select the banner link. On the **Configure** tab, **Allow self-service set up** must be **Yes**. It is global, not per profile. If it is **No**, users can't register passkeys in Security info even when the policy enables passkeys.

## 3. Expecting attestation to do more than it does

Learn explains that with **Enforce attestation** set to **Yes**, Entra can verify the make and model of the authenticator against trusted metadata. With **No**, Entra can't guarantee any attribute, including whether the passkey is synced or device-bound.

Two limits catch teams out:

- Attestation is enforced only at registration. Passkeys registered earlier without attestation aren't blocked at sign-in if you switch it on later.
- Synced passkeys don't support attestation. Learn doesn't spell out the consequence, but combining enforced attestation with synced passkeys will likely stop synced passkey registration.

## 4. Treating AAGUID lists as a hard control, or editing them carelessly

**Enforce key restrictions** lets you allow or block authenticator models by AAGUID. Learn warns:

- Restrictions apply to registration and sign-in. If you remove an AAGUID you previously allowed, users who registered it can no longer sign in with it.
- When attestation is **No**, treat AAGUID lists as a policy guide, not a strict security control.

Before you remove an entry, find out who registered that authenticator.

## 5. Using synced passkeys for privileged accounts

Learn describes synced passkeys as phishing-resistant, with the same security posture as other unattested authenticators. For most users that is a convenient option. For admins and highly privileged users the page recommends device-bound passkeys, such as security keys or Microsoft Authenticator.

Learn's example design enforces attestation with device-bound passkeys only for IT admins, executives and engineering, and allows synced or device-bound passkeys for HR and sales. Also remember that disabling synced passkeys in a profile blocks targeted users from signing in with a synced passkey even if they already registered one.

## 6. Forgetting how exclusions and multiple profiles work

If a user is in several profiles, registration and sign-in work when the passkey fully satisfies at least one scoped profile, with no defined order. But if a user is in an excluded group in the Passkey (FIDO2) policy, they are blocked from registration and sign-in entirely. Exclusion beats inclusion.

You can delete a profile only after removing its targets in **Enable and target**. The policy also has a 20 KB size limit, after which you can't save more profiles.

## 7. Enforcing passkeys before people can register

Learn's phishing-resistant admin policy warns that administrators must register phishing-resistant methods before the Conditional Access policy is enabled, or they risk locking themselves out. Options include a Temporary Access Pass or registering a passkey with a security key. Run new policies in **Report-only** first, and exclude emergency access accounts.

To require passkeys, use the built-in **Phishing-resistant MFA** authentication strength or a custom one. To create a custom strength, go to **Entra ID** > **Authentication methods** > **Authentication strengths** > **New authentication strength** and select **Passkeys (FIDO2)**.

## Other documented gotchas

| Issue | What Learn says |
|---|---|
| Guests | Passkey registration isn't supported for internal or external guests, including B2B users in the resource tenant |
| UPN change | Delete the old passkey in Security info and add a new one |
| Recent MFA | Users must have completed MFA within the past five minutes before registering |
| Authenticator versions | Profiles mixing device-bound and synced types that target Microsoft Authenticator need iOS 6.8.37 or Android 6.2507.4749 |
| Devices | Entra-joined Windows works best on Windows 10 1903 or later. Hybrid-joined needs Windows 10 2004 or later |
| Synced provider support | For example macOS 13 or later and iOS 16 or later for Apple Passwords, Android 9 or later for Google Password Manager |

## A safer sequence

1. Decide which groups need device-bound only and which can use synced.
2. Opt in to profiles with a Default profile you have reviewed.
3. Pilot with one group, using the allow and block pattern Learn describes for Authenticator.
4. Confirm users can register, then require passkeys in Conditional Access in report-only mode.
5. Turn the policy on once the report shows the impact.

## Related

- [Passkey](https://www.m365.fm/entity/passkey/)
- [FIDO2](https://www.m365.fm/entity/fido2/)
- [Authentication strength](https://www.m365.fm/entity/authentication-strength/)
- [Microsoft Authenticator](https://www.m365.fm/entity/microsoft-authenticator/)

## Sources

- [Enable passkeys (FIDO2) for your organization (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-enable-passkey-fido2)
- [Passkey profiles (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-passkey-profiles)
- [Synced passkeys in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-synced-passkeys)
- [Require phishing-resistant MFA for administrators (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/how-to-policy-phish-resistant-admin-mfa)
