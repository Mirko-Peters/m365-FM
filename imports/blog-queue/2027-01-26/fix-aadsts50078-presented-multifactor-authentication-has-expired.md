---
title: "Fix AADSTS50078: Presented Multifactor Authentication Has Expired"
summary: "AADSTS50078 (UserStrongAuthExpired) means MFA has expired due to administrator policies and must be refreshed. Which session lifetime settings (sign-in frequency, Remember MFA) can be behind it, how to read the sign-in log, and what to review."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [entra-id, mfa, conditional-access, sign-in-frequency, microsoft-entra-sign-in-logs]
keypoints:
  - "The reference lists AADSTS50078 as UserStrongAuthExpired: MFA has expired due to policies configured by your administrator and must be refreshed for the resource."
  - "For users the fix is to sign in again and complete MFA. For admins the cause sits in session lifetime settings such as Conditional Access sign-in frequency."
  - "The Entra default for user sign-in frequency is a rolling window of 90 days. The most restrictive session lifetime setting decides when users must reauthenticate."
  - "Remember multifactor authentication accepts 1 to 365 days. A value under 90 days shortens the default MFA prompts for Office clients."
  - "In each sign-in log entry, the Authentication Details tab shows Session Lifetime Policies Applied, which tells you which setting applied."
faq:
  - q: "What does AADSTS50078 mean?"
    a: "The Microsoft Entra reference lists it as UserStrongAuthExpired. The text says that the presented multifactor authentication has expired due to policies configured by your administrator, and that you must refresh your multifactor authentication to access the resource named in the message."
  - q: "How does the user fix it?"
    a: "The message says to refresh the multifactor authentication, which means signing in again and completing the MFA step for that resource. The reference row has no further steps for users, so this is the direct reading of the message."
  - q: "Which setting causes it?"
    a: "The message points to policies configured by the administrator. The pages do not tie this error code to one setting. The session lifetime pages describe these candidate settings: a Conditional Access Sign-in frequency policy, the Remember multifactor authentication setting, and the Stay signed in option. The sign-in log shows which session lifetime policy was applied."
  - q: "Why do users see the prompt more often than every 90 days?"
    a: "The Learn page says the default sign-in frequency is a rolling window of 90 days, and that the most restrictive session lifetime setting decides. A Sign-in frequency policy with a shorter period, or a Remember MFA value below 90 days, leads to more frequent prompts."
  - q: "Is Sign-in frequency set to Every time a problem?"
    a: "The Conditional Access page says the system accounts for five minutes of clock skew when Every time is selected, so users are not prompted more than once every five minutes. It also says to use Every time only when there are specific business needs, since too many prompts hurt productivity and can raise the risk of users approving requests they did not start."
---

AADSTS50078 sounds like a fault, but the reference points to a policy configured by your administrator. The Microsoft Entra error reference lists it as UserStrongAuthExpired: the presented multifactor authentication has expired due to policies configured by your administrator, and you must refresh it to access the named resource. This article starts from that row. The row is short, so the settings behind it come from two Learn pages on session lifetime. My own advice is marked.

## The reference row in plain words

- **Code:** UserStrongAuthExpired.
- **Meaning:** a previous MFA result is no longer accepted, because of a policy from your administrator.
- **Instruction:** refresh your multifactor authentication to access the resource.

My reading, not a statement of the reference: the error does not mean the user's second factor is broken, but that the earlier proof is too old for the rule that applies now.

## For users: what to do (my advice)

1. Sign in again to the app or site that showed the error.
2. Complete the MFA prompt when it appears.
3. If the prompt does not appear and the error repeats, tell your administrator the time, the app and the exact error text.

The reference gives no more steps for users than the instruction in the message.

## For admins: which setting applies

The Learn page on MFA prompts and session lifetime says Microsoft Entra ID has several settings that decide how often users reauthenticate. The ones that matter here:

| Setting | What the page says |
| --- | --- |
| Default sign-in frequency | A rolling window of 90 days |
| Conditional Access Sign-in frequency | Applies to first and second factor, in client and browser. Set periodic reauthentication in hours or days, or Every time |
| Remember multifactor authentication | A value of 1 to 365 days. Sets a persistent cookie when the user selects Don't ask again for X days |
| Show option to remain signed in | The Stay signed in? prompt sets a persistent cookie that remembers first and second factor, for the browser only |
| Persistent browser session (Conditional Access) | Lets users stay signed in after closing the browser, without the Stay signed in? choice |

The most restrictive session lifetime policy determines when the user must reauthenticate. The page gives an example: with **Show option to remain signed in** and **Remember multifactor authentication** set to 14 days, the user reauthenticates every 14 days.

## Step 1: Find the policy that applied

The page recommends starting with the sign-in logs:

1. Open the sign-in log entry of the failed attempt.
2. Go to the **Authentication Details** tab.
3. Read **Session Lifetime Policies Applied**.

This shows which session lifetime policy was applied at that sign-in. The page does not describe a field for the error itself here. My suggestion is to also note the correlation ID and time of the failure.

## Step 2: Review Conditional Access sign-in frequency

The Learn page on adaptive session lifetime describes the policy:

1. Sign in to the Microsoft Entra admin center as at least a Conditional Access Administrator.
2. Browse to **Entra ID** > **Conditional Access** > **Policies**.
3. Open the policy and check the target apps and users.
4. Under **Access controls** > **Session**, check **Sign-in frequency**. The options are **Periodic reauthentication** with hours or days, or **Every time**.

Two points from the page:

- It recommends equal authentication prompt frequency for key Microsoft 365 apps such as Exchange Online and SharePoint Online, for the best user experience.
- With **Every time**, the system allows for five minutes of clock skew. If the user completed MFA in the last 5 minutes, another policy that requires reauthentication does not prompt again. The page advises using Every time only for specific business needs.

The page adds a warning to disable **Remember MFA on trusted devices** before using Sign-in frequency, because using both might prompt users unexpectedly.

## Step 3: Review Remember multifactor authentication

The MFA prompts page gives the path to the setting: **Entra ID** > **Multifactor authentication**, then **Additional cloud-based MFA settings** under **Configure**, and **Remember multifactor authentication settings** on the service settings pane. The page notes that the setting reduces authentications on web apps but increases them for modern authentication clients such as Office clients, which normally prompt only after a password reset or 90 days of inactivity. A value under 90 days shortens that for Office clients.

If you have Microsoft Entra ID P1 or P2, the page suggests moving these settings to Conditional Access Sign-in frequency. Otherwise it suggests the Show option to remain signed in setting.

## Other things that end a session

The page says a violation of IT policies revokes the session, with examples such as a password change, a noncompliant device or an action that disables the account. Sessions can also be revoked explicitly with Microsoft Graph PowerShell. If the error appears right after one of these events, my inference is that a session revocation, not the sign-in frequency setting, is the more likely cause. The page does not link these events to 50078.

The page also says a user on a device without an identity in Microsoft Entra ID can see several MFA prompts, because each application has its own OAuth refresh token that is not shared with other client apps.

## Known issues on the Conditional Access page

- With sign-in frequency on mobile devices, authentication after each interval might be slow and can take 30 seconds on average.
- On iOS, an app that uses certificates as the first factor and has both sign-in frequency and Intune mobile application management policies applied can block the user when the policy triggers.
- Microsoft Entra Private Access does not support Every time.

## Recommendations from the page by license

| License | Page recommendation for reauthentication |
| --- | --- |
| Microsoft Entra ID P1 or P2 | Conditional Access Sign-in frequency and Persistent browser session |
| Microsoft 365 Apps or Entra ID Free | Show option to remain signed in |

The page says that if more than one setting is on, update the settings to match the license, so that you use only one of these approaches.

## Working order for admins (my advice)

This is my suggestion, not guidance from the reference:

1. Ask for one failed sign-in and read its Authentication Details tab. Do not change anything before you know which policy applied.
2. List all Conditional Access policies with a sign-in frequency control and note the target apps. A short interval on one app can cause prompts for that app only.
3. Check whether Remember MFA is also on. Two overlapping settings are the case the page warns about.
4. Change one setting, wait for a new sign-in, and read the log again.
5. Keep the Every time setting for the cases that need it, such as high user risk, and use a longer period elsewhere.
6. Tell users in advance when you shorten a period, so the new prompt does not look like an attack.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Multifactor authentication (MFA)](https://www.m365.fm/entity/mfa/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Sign-in frequency (Conditional Access)](https://www.m365.fm/entity/sign-in-frequency/)
- [Microsoft Entra sign-in logs](https://www.m365.fm/entity/microsoft-entra-sign-in-logs/)

## Sources

- [Microsoft Entra authentication & authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Microsoft Entra multifactor authentication prompts and session lifetime (Microsoft Learn)](https://learn.microsoft.com/entra/identity/authentication/concepts-azure-multi-factor-authentication-prompts-session-lifetime)
- [Configure adaptive session lifetime policies (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-session-lifetime)
