---
title: "iOS Automated Device Enrollment: Company Portal Asks to Set Up Access Again After Setup Assistant"
summary: "An iPad enrolled with ADE and Setup Assistant with modern authentication still shows Company Portal prompts. Check what Microsoft Learn says is expected, and which settings to fix first."
status: approved
publish: false
author: mirko-p
date: 2026-11-13
topics: [intune, microsoft-entra, conditional-access, device-compliance]
keypoints:
  - "After Setup Assistant with modern authentication, the device is not fully registered in Microsoft Entra ID until the user signs in to Company Portal and selects Begin."
  - "Until then the device is not evaluated for compliance and has no access to resources protected by Conditional Access."
  - "Do not send a separate Company Portal app configuration policy to ADE devices enrolled this way. Microsoft Learn says it causes an error."
  - "Changes to an enrollment policy apply to a device only after it is reset to factory settings and activated again."
  - "Learn recommends Setup Assistant with modern authentication together with just-in-time (JIT) registration. Setup Assistant (legacy) support ended in the October 2026 (2610) release."
faq:
  - q: "Is it normal that Company Portal asks me to sign in after the device is already enrolled with ADE?"
    a: "Microsoft Learn says that after Setup Assistant the user reaches the home screen, but the device is not fully registered with Microsoft Entra ID until the user signs in to Company Portal and selects Begin. A prompt to download a management profile on an already enrolled device is a different matter: Learn's setup page says it can appear when a Company Portal app configuration is also deployed manually next to the one Intune sends at enrollment. The thread does not show whether that applied."
  - q: "Where is the 'Install Company Portal with VPP' setting?"
    a: "Microsoft Learn's authentication reference names the setting 'Install Company Portal with VPP' and recommends Yes. The enrollment setup page mentions 'Install Company Portal'. A poster in a July 2026 thread could not find an equivalent in the new policy experience. Check your own policy and Learn's pages."
  - q: "Can I still use Setup Assistant (legacy)?"
    a: "No. Learn says Intune ended support for it in the October 2026 (2610) service release. Existing profiles are updated to Setup Assistant with modern authentication, and enrolled devices stay enrolled."
  - q: "Does phishing-resistant MFA work during Setup Assistant enrollment?"
    a: "Not according to Learn. Users need an alternate MFA method available to complete enrollment."
---

You switch iOS or iPadOS Automated Device Enrollment (ADE) to the newer enrollment policy with user affinity and Setup Assistant with modern authentication. A test iPad enrolls. The Intune profile is visible on the device. Then the Company Portal opens, asks the user to set up company access and offers a management profile, although the device is already managed.

This is the report in a Microsoft Q&A thread from July 2026. The poster had deployed Company Portal as a required VPP app, and also noticed that the device first showed up as "iPad" and then got its real name, leaving two entries. The only answer in the thread was AI-generated and was not accepted. In October 2026 another user wrote that they had the same problem, and that they still use the older enrollment profiles because the new policies fail at registering in Microsoft Entra ID. That claim is not confirmed. No Microsoft employee replied.

So this article cannot give you a confirmed fix. It lists what Microsoft Learn says about this enrollment method, using pages last updated in October 2026, and the checks that follow from it. It is not an official Microsoft procedure.

## Symptoms

- The device is enrolled through ADE with user affinity.
- Company Portal asks the user to set up access and download a profile, or says the device must be managed before apps can be installed.
- Company Portal may list the device twice, once under the generic name "iPad" and once under its real name.

## Step 1: Know what is expected

Learn describes what happens after Setup Assistant with modern authentication. The user reaches the home screen and user affinity is set. But until the user signs in to Company Portal with Microsoft Entra credentials and selects **Begin**, the device:

- is not fully registered with Microsoft Entra ID,
- does not show in the user's device list in Microsoft Entra ID,
- has no access to resources protected by Conditional Access,
- is not evaluated for device compliance,
- is redirected to Company Portal when the user opens a managed app that Conditional Access protects.

So a Company Portal prompt after Setup Assistant is part of the documented flow. A prompt that offers a management profile on an already enrolled device is not part of it. Learn's setup page describes one cause: if a Company Portal app configuration is deployed manually as well, Intune incorrectly prompts users to sign in and download a management policy they already have (see step 4). Learn does not explain the duplicate "iPad" record.

## Step 2: Check the enrollment policy

In the Microsoft Intune admin center, go to **Devices**, expand **Device onboarding**, select **Enrollment**, open the **Apple mobile** tab, select **Enrollment program tokens**, choose the token, and select **Enrollment policies**. Open the policy and check:

- **User Affinity** is **Enroll with User Affinity**.
- The authentication method is **Setup Assistant with modern authentication**. Learn says Setup Assistant (legacy) ended in the October 2026 (2610) release and old profiles were updated automatically.

Learn requires iOS/iPadOS 13.0 or later for modern authentication, and an active ADE token from Apple Business Manager or Apple School Manager in Intune.

## Step 3: Check how Company Portal gets onto the device

Learn describes two ways to get Company Portal onto the device.

**Automatic install through the policy.** The authentication reference calls the setting **Install Company Portal with VPP** and recommends **Yes**. With VPP, the app installs during enrollment without user Apple IDs. Without VPP, the user must enter an Apple ID. In both cases the install option is hidden from the user and Company Portal becomes a required app. The setup page names the setting **Install Company Portal** in one note. The poster of the thread could not find an equivalent of the VPP setting in the new policies. Look at your policy and compare with both Learn pages.

**Manual deployment as a VPP app.** Learn says to deploy Company Portal as a required VPP app with device licensing, and to set **Automatic app updates** to **Yes** in the token settings. Do not use the App Store version, which is not compatible with ADE.

Pick one path. The poster did the manual one, so check that you do not also rely on the policy setting for the same device.

Also check the licenses. Learn warns that devices are blocked from enrolling when there are not enough Company Portal licenses for the VPP token or when the token expires.

## Step 4: Remove any Company Portal app configuration policy

Learn is clear on this: after enrolling with Setup Assistant with modern authentication, do not send a separate app configuration policy to Company Portal on iOS/iPadOS. It results in an error. The setup page adds that Intune pushes the app configuration itself at enrollment when the policy setting **Install Company Portal** is **Yes**. A manually deployed copy conflicts with it, and if both are deployed, Intune incorrectly prompts users to sign in to Company Portal and download a management policy they have already installed. That is close to the symptom in the thread, so look for such a policy first. The thread poster mentioned an app configuration XML from a blog post, but did not say it was deployed.

There are documented uses of app configuration for other cases, such as ADE devices without user affinity. Make sure those policies are not assigned to your user-affinity devices.

## Step 5: Reset the test device

Learn says that changes to an existing enrollment policy do not take effect on assigned devices until the devices are reset to factory settings and activated again. If you changed the policy after the test iPad enrolled, wipe it and enroll again before you judge the result. This may also explain odd duplicate records from a previous attempt, but Learn does not say that, so it is a guess.

## Step 6: Plan for MFA

Learn says phishing-resistant MFA is not supported in Setup Assistant on iOS/iPadOS. Users need another MFA method available. MFA is required if a Conditional Access policy requires it at enrollment or during Company Portal sign-in. If you use third-party MFA, test both the Microsoft Entra MFA screen and your MFA during enrollment before you deploy to all devices.

## Step 7: Consider just-in-time registration

Learn recommends Setup Assistant with modern authentication with JIT registration for ADE with user affinity. With JIT, Microsoft Entra registration and compliance happen in an app that uses the Apple SSO extension, not in Company Portal. Learn lists the setup:

1. Create an iOS/iPadOS device configuration policy under **Device features**, **Single sign-on app extension**, with **SSO app extension type** set to **Microsoft Entra ID**.
2. Under **Additional configuration** add the key `device_registration`, type String, value `{{DEVICEREGISTRATION}}`. Remove trailing spaces, because they break JIT registration.
3. Optionally add `browser_sso_interaction_enabled` as Integer with value `1`.
4. Assign the profile, and assign Microsoft Authenticator as a required app. Do not add Microsoft apps or Authenticator to the SSO policy.
5. Create or keep an enrollment policy for ADE with Setup Assistant with modern authentication.

For JIT, the user's first sign-in after the home screen must happen in a work or school app configured with the SSO extension. Learn suggests Microsoft Teams. It also says compliance policies must be assigned for compliance remediation.

## Verify

- After a clean reset, the device reaches the home screen and Company Portal opens once.
- After the user signs in and selects **Begin**, the device appears in the user's device list in Microsoft Entra ID.
- The device gets a compliance state and can open Conditional Access protected apps.

## Limits and open points

- The thread is unresolved and has no staff reply. The AI-generated answer is not a source.
- Learn does not explain the duplicate "iPad" record. It documents the management-profile prompt only as a result of a conflicting manual app configuration, which may or may not apply to the thread.
- The claim that new enrollment policies fail at registration in Microsoft Entra ID comes from one reporter and is not confirmed.
- Learn's troubleshooting page lists errors such as "Company Portal Temporarily Unavailable," which it fixes by removing the app, validating user credentials and reinstalling Company Portal. It is a different symptom, but check it if the app is old or corrupted.

## Related

- [Microsoft Intune](https://www.m365.fm/entity/intune/)
- [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Device compliance](https://www.m365.fm/entity/device-compliance/)

## Sources

- [Microsoft Learn: Authentication methods for Apple automated device enrollment](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/ref-automated-authentication-methods)
- [Microsoft Learn: Set up automated device enrollment (ADE) for iOS/iPadOS](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/setup-automated-ios)
- [Microsoft Learn: Set up just-in-time registration in Microsoft Intune](https://learn.microsoft.com/en-us/intune/device-enrollment/apple/setup-just-in-time-registration)
- [Microsoft Learn: Troubleshooting iOS/iPadOS device enrollment errors](https://learn.microsoft.com/en-us/troubleshoot/mem/intune/device-enrollment/troubleshoot-ios-enrollment-errors)
- [Microsoft Q&A: iOS Enrollment Policys - User affinity with modern auth, does not work with Company Portal VPP (July 2026)](https://learn.microsoft.com/en-us/answers/questions/5959130/ios-enrollment-policys-user-affinity-with-modern-a)
