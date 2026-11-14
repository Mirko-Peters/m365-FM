---
title: "Passkeys in Microsoft 365: Admin Setup Guide for Microsoft Entra ID"
summary: "How admins enable passkeys (FIDO2) in Microsoft Entra ID for Microsoft 365: roles, passkey profiles, attestation, key restrictions, Authenticator, Conditional Access and the documented limits."
status: review
publish: false
author: mirko-p
date: 2026-12-02
topics: [passkey, entra-id, microsoft-authenticator, conditional-access]
keypoints:
  - "Passkeys (FIDO2) are included in all Microsoft Entra ID editions, including Free. The Authentication Policy Administrator role is enough to configure them."
  - "Enable passkey profiles under Entra ID > Security > Authentication methods > Policies > Passkey (FIDO2). Opting in cannot be reversed."
  - "A tenant can have up to three passkey profiles including the Default profile. Each profile sets attestation, passkey types and key restrictions."
  - "Synced passkeys do not support attestation, so enforcing attestation excludes them."
  - "Users must complete MFA within the past five minutes to register a passkey, and guest users cannot register passkeys."
faq:
  - q: "Do passkeys in Microsoft Entra ID need extra licenses?"
    a: "Microsoft Learn states that passkeys (FIDO2) are included in all Microsoft Entra ID editions, including Free, and need no extra licenses."
  - q: "Which admin role configures passkeys?"
    a: "Microsoft Learn lists Authentication Policy Administrator as the minimum role to enable passkey profiles, create profiles and enable synced passkeys. Creating a custom authentication strength needs Conditional Access Administrator."
  - q: "Can I turn passkey profiles off again?"
    a: "No. Microsoft Learn says you cannot opt out after opting in to passkey profiles. Existing global passkey settings move to a Default passkey profile."
  - q: "What is the difference between device-bound and synced passkeys?"
    a: "Per Microsoft Learn, a device-bound passkey is created and stored on one physical device, such as Microsoft Authenticator or a security key, and supports attestation. A synced passkey is synced to a cloud passkey provider and does not support attestation."
  - q: "Why can users not register a passkey even though the method is enabled?"
    a: "Microsoft Learn names several causes: Allow self-service set up is set to No, the user did not complete MFA in the last five minutes, the user is a guest, or the user is in an excluded group, which blocks registration and sign-in."
---

Passkeys let people sign in to Microsoft 365 without a password. For admins, setup happens in the Microsoft Entra admin center under the Passkey (FIDO2) authentication method. In short: opt in to passkey profiles, set Allow self-service set up to Yes, create up to three profiles, target them at groups, and optionally enforce passkey sign-in with Conditional Access. This guide follows Microsoft Learn and flags the settings that are hard to undo.

## What Microsoft Entra ID supports

Microsoft Learn describes two types of passkey:

| Type | Where the private key lives | Examples | Attestation |
|---|---|---|---|
| Device-bound | One physical device, never leaves it | Microsoft Authenticator on iOS or Android, security keys | Supported |
| Synced | Encrypted and synced to a cloud passkey provider | Apple Passwords (iCloud Keychain), Google Password Manager | Not supported |

Microsoft's guidance is to treat synced passkeys as phishing-resistant, with the same security posture as other unattested authenticators. Passkeys are included in all Entra ID editions and need no extra licenses.

## Prerequisites

- **Roles:** Authentication Policy Administrator to enable profiles, create profiles and enable synced passkeys. Conditional Access Administrator to create a custom authentication strength.
- **Windows:** Entra joined devices on Windows 10 version 1903 or later. Hybrid joined devices need version 2004 or later.
- **Authenticator in a combined profile:** iOS 6.8.37 or later, or Android 6.2507.4749 or later.
- **User step:** Users must complete MFA within the past five minutes before registering a passkey.

For synced passkeys, Microsoft Learn lists minimum OS versions per provider. Examples: Apple Passwords needs macOS 13 or iOS 16 and later, and Google Password Manager needs Chrome, or Android 9 and later.

## Step 1: Enable passkey profiles

1. Sign in to the Microsoft Entra admin center as an Authentication Policy Administrator.
2. Go to **Entra ID > Security > Authentication methods > Policies**.
3. Select **Passkey (FIDO2)**, then select the banner link to opt in.

Microsoft Learn is explicit that you cannot opt out after opting in. Your existing global passkey settings move to a **Default passkey profile**.

## Step 2: Set global options

On the **Configure** tab, set **Allow self-service set up** to **Yes**. If it is **No**, users cannot register passkeys in Security info, even when the method is enabled. This setting is global, not per profile. Then open the Default passkey profile, choose the allowed passkey types and save.

## Step 3: Create profiles

Select **+ Add passkey profile**, set the options and save. Up to three profiles are supported, including the Default. Each profile has three settings:

- **Enforce attestation:** With Yes, Entra ID verifies make and model at registration. With No, Entra ID cannot guarantee any attribute of the passkey, including whether it is synced or device-bound. Attestation applies only at registration. Users who registered earlier are not blocked if you later enable it.
- **Passkey types:** Device-bound, synced, or both.
- **Key restrictions:** Allow or block specific models or providers by AAGUID, a 128-bit identifier for the key type.

Key restrictions govern both registration and sign-in. If you remove a previously allowed AAGUID, users who registered it can no longer sign in with it. When attestation is off, treat AAGUID lists as a policy guide, not a strict control.

Microsoft's example for high-privilege accounts is a profile with device-bound passkeys only, attestation enforced, targeted at IT admins, executives and engineering. A second profile that allows synced and device-bound passkeys without attestation can cover groups such as HR and Sales.

## Step 4: Target the profiles

Select **Enable and Target**, then **Add target**. Choose **All users** or **Select targets**, and pick the profile for each target. Rules from Microsoft Learn:

- A group can be scoped to several profiles. Registration and sign-in succeed if the passkey fully meets at least one scoped profile. Order does not matter.
- Excluded groups in the Passkeys (FIDO2) method policy are blocked from registration and sign-in. Exclusion overrides inclusion.
- A profile can be deleted only when no group targets it.

## Microsoft Authenticator passkeys

The separate Learn article for Authenticator adds these admin steps: under **Passkey (FIDO2) > Configure**, add a profile, set **Passkey types** to **Device-bound**, choose **Target specific AAGUIDs**, set **Behavior** to **Allow**, and add **Microsoft Authenticator**. Then enable and target the profile.

It lists Android 14 or later and iOS 17 or later as requirements. It also documents Conditional Access traps. A policy on **All resources** that requires an authentication strength with a passkey in Authenticator can block users from adding that passkey, because they must already have one to reach Authenticator. Suggested workarounds include scoping the policy to specific apps, splitting policies by device platform and using a Temporary Access Pass for registration. Microsoft also describes excluding the Microsoft Authenticator Credential Registration resource, available in November 2026, which must be provisioned first.

## Enforce passkeys with Conditional Access

You can use a built-in phishing-resistant authentication strength or create a custom one. As a Conditional Access Administrator, go to **Entra ID > Authentication methods > Authentication strengths**, select **New authentication strength**, name it and select **Passkeys (FIDO2)**. Under **Advanced options**, **Add AAGUID** restricts it to specific authenticators. Apply the strength in a Conditional Access policy for the resources you want to protect.

## Known limits and caveats

- Guest users, internal or external, cannot register passkeys.
- After a UPN change, a passkey cannot be updated. The user must delete the old one and add a new one in Security info.
- Disabling synced passkeys in a profile blocks targeted users from signing in with synced passkeys they already registered.
- The Passkey (FIDO2) policy size is limited to 20 KB. Learn lists 0.23 KB per profile target as a reference size.
- Provisioning FIDO2 credentials on a user's behalf through Microsoft Graph is in preview.

## Related

- [Passkey](https://www.m365.fm/entity/passkey/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Microsoft Authenticator](https://www.m365.fm/entity/microsoft-authenticator/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Microsoft Learn: Enable passkeys (FIDO2) for your organization](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-enable-passkey-fido2)
- [Microsoft Learn: Passkey profiles in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-passkey-profiles)
- [Microsoft Learn: Enable passkeys in Microsoft Authenticator](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-enable-authenticator-passkey)
