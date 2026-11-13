---
title: "Passkey Option Missing in Security Info? Check These Entra Settings in Order"
summary: "Passkeys are enabled in Entra ID, but users see no Passkey option under Add sign-in method, or passkey sign-in fails with a policy error? Check scope, self-service setup, key restrictions and timing."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [entra-id, passkey, fido2, authentication-strength]
keypoints:
  - "Users register passkeys only if the Passkey (FIDO2) method is enabled, the user is in a target group, and 'Allow self-service set up' is Yes."
  - "An excluded group beats an included group, and an AAGUID allow list can keep a user's authenticator from being accepted."
  - "In one 2026 thread the option appeared only after the policy target was changed from a group to All users. Microsoft Learn does not describe this as a rule, so treat it as a test, not a fix."
  - "Guest users cannot register passkeys, and a user must have completed MFA in the last five minutes before registering."
  - "Authentication strength only decides what satisfies a sign-in. It does not make the registration option appear."
faq:
  - q: "Why is the Passkey option missing under Add sign-in method?"
    a: "The usual reasons are that the user is not in a group targeted by the Passkey (FIDO2) policy, the user is in an excluded group, self-service setup is set to No, or the user is a guest. Microsoft Learn lists all of these. A community thread also reported that the option appeared once the target was changed to All users."
  - q: "Does Conditional Access authentication strength control passkey registration?"
    a: "No. An authentication strength decides which methods satisfy a sign-in that a Conditional Access policy protects. Whether a user can register a method is controlled by the Authentication methods policy and, for passkeys, the self-service setup setting."
  - q: "Passkey sign-in fails with 'FIDO sign-in is disabled via policy'. What should I do?"
    a: "Check the Passkey (FIDO2) target and profile, and compare the AAGUID of the authenticator with your key restrictions. Two people in a community thread reported that sign-in worked again after about an hour, or after more than 10 minutes together with renaming a passkey profile. Those reports are not confirmed by Microsoft."
  - q: "Can guest users register a passkey in my tenant?"
    a: "No. Microsoft Learn lists passkey registration for internal and external guests, including B2B collaboration users in the resource tenant, as a known limitation."
---

You turned on passkeys in Microsoft Entra ID. A test user opens the security info page, selects **Add sign-in method**, and the **Passkey** entry is not in the list. The same person can add a passkey to a personal Microsoft account without trouble.

A Microsoft Tech Community thread from May and June 2026 describes this exact case. A second thread, from 2025 with replies into 2026, covers a related problem: enrollment works, but sign-in fails with the message "FIDO sign-in is disabled via policy". This article puts the advice from both threads in an order you can follow, and checks each point against Microsoft Learn. It is not an official Microsoft procedure.

## What the symptoms look like

- On `https://mysignins.microsoft.com/security-info`, the **Add sign-in method** list for a work account has no Passkey entry.
- The Passkey option is visible for other users, or for a personal account.
- Authentication strength is already in use in Conditional Access, and the user even sees it at the sign-in screen, but registration is still not possible.
- In the second thread, enrollment of a hardware key succeeded, and the sign-in log then showed error 135016 with a "disabled via policy" message.

## Step 1: Open the policy and check the basics

1. Sign in to the Microsoft Entra admin center as at least an Authentication Policy Administrator.
2. Go to **Entra ID**, then **Security**, then **Authentication methods**, then **Policies**.
3. Select **Passkey (FIDO2)**.
4. Check that the method is turned on, then open the **Enable and Target** tab.

The accepted answer in the first thread lists the same basics: the method is enabled, the user is in the target, self-service setup is allowed, and if passkey profiles are in use, the right profile is assigned.

## Step 2: Check "Allow self-service set up"

Open the **Configure** tab. Microsoft Learn says that **Allow self-service set up** must be **Yes** for users to register passkeys in security info. If it is **No**, users cannot register passkeys in security info, even when the method is enabled and targeted. This is a tenant-wide setting, not a per-profile setting.

## Step 3: Check who is targeted and who is excluded

On the **Enable and Target** tab, look at the targets.

- If the target is **Select targets**, confirm that the test user is in one of the listed groups.
- Look for excluded groups. Learn states that a user in an excluded group is blocked from passkey registration and sign-in, and that exclusion overrides inclusion.
- If you use passkey profiles, remember that a passkey is accepted when it fully meets at least one of the profiles assigned to the user. There is no order between profiles.

Now the odd part of the thread. The user did everything above and still saw no Passkey option. The poster then changed the target from a specific group to **All users**, and the option appeared. The thread was marked as solved with the settings list, but the poster's own resolution was the change of target.

Microsoft Learn does not say that group targeting breaks registration. So read this carefully. It is a report from one tenant, with no explanation. Possible reasons that you can check yourself include group membership that has not updated, a user missing from the group, or a conflict with an exclusion. A practical test is to add a single test account to a new, simple security group, assign it as the target, and wait. If the option only shows with All users, document it and ask Microsoft Support.

## Step 4: Review key restrictions

A reply in the first thread pointed to **Enforce key restrictions** as another reason for a hidden option. If you enforce an allow list, an authenticator whose AAGUID is not on the list is not accepted.

Learn confirms the core of this: key restrictions apply to both registration and sign-in, and each security key model or passkey provider has its own AAGUID. Two cautions from Learn:

- If you remove an AAGUID that you allowed before, users who registered that authenticator can no longer sign in with it.
- When attestation is not enforced, treat AAGUID lists as policy guidance, not as a hard security control.

Whether the registration entry itself disappears when the list does not match is a community statement. Learn describes the restriction but does not say how the entry is shown. To find the AAGUID of a passkey that a user has already registered, open the user's authentication method details in the admin center.

## Step 5: Rule out the known limitations

Microsoft Learn lists conditions that look like a missing option but are by design:

- **Guest users** cannot register passkeys, including B2B collaboration users in the resource tenant.
- Users must have completed **MFA within the last five minutes** before they register a passkey. Sign out and back in with MFA, then try again.
- The device must support FIDO2. For the best experience, Learn names Windows 10 version 1903 or later for Entra joined devices and requires Windows 10 version 2004 or later for hybrid joined devices. If a passkey profile for both device-bound and synced passkeys targets Microsoft Authenticator, Learn says users need Authenticator iOS version 6.8.37 or Android version 6.2507.4749.
- The Passkey (FIDO2) policy has a size limit of 20 KB. When you reach it, you cannot save new profiles.
- Opting in to passkey profiles cannot be undone. Your existing global settings move into a Default passkey profile, and the tenant allows up to three profiles in total.

Authentication strength does not belong on this list. A reply in the first thread made this point: strength decides what is accepted at sign-in. Seeing it on the lock screen says nothing about whether the registration option is available.

## Step 6: If sign-in fails with "FIDO sign-in is disabled via policy"

This is the second thread. The poster enabled FIDO2, added AAGUIDs for the Authenticator app and the hardware key, and could enroll. Sign-in then failed with error 135016. All Conditional Access policies were in report-only mode and security defaults were off.

Replies over the following year suggested:

1. Confirm the method is enabled and targeted as you intend, and that the AAGUIDs are typed exactly. A typo or extra character is an easy mistake.
2. Review Conditional Access and authentication strength for conflicts, and test with a clean browser session on an Entra joined device.
3. Turn the method off, wait at least five minutes, turn it on, and wait at least five minutes again. The idea is that the policy had not reached the authentication service.
4. Wait longer. One person reported that sign-in worked about an hour after the first passkey registration. Another, in a different tenant in May 2026, reported that it worked after more than ten minutes and after renaming a passkey profile, and suggested renaming a profile is gentler than switching passkeys off for all users.

None of these steps is marked as the accepted solution, and Microsoft Learn does not document a propagation time for passkey policy changes. Treat the waiting advice as a field report. Do not switch the whole method off in a production tenant just to test it.

## How to verify the result

1. Have the test user sign in to the security info page and complete MFA.
2. Select **Add sign-in method** and confirm that **Passkey** is listed.
3. Register a passkey, then sign out and sign in with it.
4. In **Entra ID**, **Monitoring & health**, **Sign-in logs**, open the event and check the authentication details for the method used.
5. Open the user in **Entra ID**, **Users**, then **Authentication methods**, and confirm the passkey is listed.

## Limits of this guide

- The threads do not give a root cause for the group-target case. Learn does not describe it either.
- Timing advice comes from users, not from Microsoft.
- Passkey features in Entra change often. The Learn page used here showed a last update in May 2026. Compare your admin center with the current page before you change production settings.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Passkey](https://www.m365.fm/entity/passkey/)
- [FIDO2](https://www.m365.fm/entity/fido2/)
- [Authentication strength (Conditional Access)](https://www.m365.fm/entity/authentication-strength/)
- [Phishing-resistant MFA](https://www.m365.fm/entity/phishing-resistant-mfa/)

## Sources

- [Microsoft Learn: Enable passkeys (FIDO2) in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-enable-passkey-fido2)
- [Microsoft Community Hub: Passkey sign in method (Entra account) missing in Security (May 2026)](https://techcommunity.microsoft.com/discussions/microsoft-security/passkey-sign-in-method-entra-account-missing-in-security/4522720)
- [Microsoft Community Hub: Fido passkeys blocked by policy (May 2025, replies to May 2026)](https://techcommunity.microsoft.com/discussions/microsoft-entra/fido-passkeys-blocked-by-policy/4416150)
