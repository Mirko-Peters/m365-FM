---
title: "Fix AADSTS70043: Refresh Token Expired Due to Sign-In Frequency"
summary: "AADSTS70043 (BadTokenDueToSignInFrequency) means a Conditional Access sign-in frequency check expired or invalidated the refresh token. Learn how sign-in frequency works, which defaults apply, how Every time differs, and what to review in the policy and the app."
status: review
publish: false
author: mirko-p
date: 2027-01-17
topics: [entra-id, conditional-access, sign-in-frequency]
keypoints:
  - "The Entra error reference describes AADSTS70043 BadTokenDueToSignInFrequency as an expired or invalid refresh token caused by sign-in frequency checks in Conditional Access."
  - "The message states when the token was issued and the maximum lifetime allowed for the request."
  - "Entra ID default sign-in frequency is a rolling window of 90 days, and a Conditional Access policy can shorten it."
  - "Every time requires full reauthentication when the session is evaluated, and Learn warns of sign-in loops without multifactor authentication."
  - "Learn says to disable Remember MFA on trusted devices before using sign-in frequency, because both together can prompt users unexpectedly."
faq:
  - q: "What does AADSTS70043 mean?"
    a: "The Microsoft Entra error code reference lists it as BadTokenDueToSignInFrequency: the refresh token has expired or is invalid due to sign-in frequency checks by Conditional Access, with the issue date and the maximum allowed lifetime in the message."
  - q: "Is this a failure or expected behaviour?"
    a: "It follows from a Conditional Access sign-in frequency setting. Learn describes sign-in frequency as how long a user can access a resource before being asked to sign in again, so a token older than the allowed period no longer qualifies."
  - q: "What is the default sign-in frequency?"
    a: "Learn says the Entra ID default configuration is a rolling window of 90 days, and that sessions are revoked on policy violations such as a password change, a noncompliant device or a disabled account."
  - q: "Why do some users get prompted more often than the policy says?"
    a: "Learn lists causes to check: Remember MFA on trusted devices enabled together with sign-in frequency, background tasks whose enforcement is deferred until the next interaction, and the Primary Refresh Token refresh cycle of four hours on joined devices."
  - q: "Which setting causes sign-in loops?"
    a: "Learn warns that using sign-in frequency to require reauthentication every time, without multifactor authentication, might result in sign-in looping."
---

AADSTS70043, named BadTokenDueToSignInFrequency in the Microsoft Entra error reference, means a refresh token has expired or is invalid because of a sign-in frequency check from Conditional Access. The message includes the date the token was issued and the maximum lifetime allowed for the request. The usual outcome is that the user, or the app on their behalf, has to sign in again. This guide uses the error code reference and Learn's page on Conditional Access adaptive session lifetime policies.

## What the reference says

The row for AADSTS70043 reads: BadTokenDueToSignInFrequency, the refresh token has expired or is invalid due to sign-in frequency checks by Conditional Access. The token was issued on {issueDate} and the maximum allowed lifetime for this request is {time}.

The reference row gives no fix. The explanation below comes from the session lifetime page, which describes sign-in frequency but does not mention AADSTS70043 itself. So the link between the two is my reading of the reference text.

## How sign-in frequency works

Learn defines sign-in frequency as how long a user can access a resource before being asked to sign in again. Facts from the page:

- The Entra ID default is a rolling window of 90 days.
- Any IT policy violation revokes the session. Examples: a password change, a noncompliant device, or a disabled account. You can also revoke sessions explicitly with Microsoft Graph PowerShell.
- The default idea is not to ask for credentials again if the security posture of the session has not changed.
- The setting works with apps that implement OAuth2 or OpenID Connect according to the standards. Learn lists most Microsoft native apps and web apps such as Office on the web, the Microsoft 365 admin portal, Exchange Online, SharePoint and OneDrive, the Teams web client and the Azure portal.
- It works with non-Microsoft SAML apps and OAuth2 or OIDC apps as long as they do not drop their own cookies and regularly redirect back to Entra ID.
- Sign-in frequency now applies to multifactor authentication as well as first-factor authentication.

When the policy shortens the window, a refresh token older than that window fails the check, and the platform reports AADSTS70043.

## Device behaviour that affects timing

Learn explains that on Entra joined and hybrid joined devices, unlocking the device or signing in interactively refreshes the Primary Refresh Token every four hours. The last PRT refresh time compared with now must be within the time set by the policy for the PRT to satisfy sign-in frequency. On Entra registered devices, unlocking or signing in does not satisfy the policy, though the Entra WAM plug-in can refresh a PRT during native app authentication.

Learn also says that if the client app is a browser, enforcement of events and policies on background services is deferred until the next user interaction. On confidential clients, enforcement on non-interactive sign-ins is deferred until the next interactive sign-in. In its examples, a user who locks the device while a background upload runs is prompted only when interacting again after the policy time.

## Every time and Every time strict

The page describes a setting called **Every time**. The policy then requires full reauthentication when the session is evaluated, so a user who closes and reopens the browser during the session lifetime might not be prompted. The policy factors in five minutes of clock skew so it does not prompt more often than once every five minutes. Learn warns that using this without multifactor authentication might cause sign-in looping. It advises limiting the number of apps that enforce it, to avoid MFA fatigue.

**Every time strict (preview)** uses a 10-second validity window for authentication freshness. Learn says it is meant for specific apps that request a new token for sensitive actions, and warns not to apply it to Office 365 applications.

## Review checklist for the administrator

1. **Find the policy.** Open the sign-in event in the sign-in logs and read the Conditional Access tab to see which policy applied.
2. **Compare the configured period with the message.** The error states the maximum allowed lifetime for the request, so check it against the policy value.
3. **Check overlapping settings.** Learn says to disable Remember MFA on trusted devices before using sign-in frequency, because both together might prompt users unexpectedly.
4. **Check for old token lifetime configuration.** Learn says the configurable token lifetime feature for refresh and session tokens was retired on January 30, 2021, and replaced by Conditional Access session management. Do not create two policies for the same user or app combination.
5. **Check license.** Learn says Conditional Access is a Microsoft Entra ID P1 or P2 capability.

## For the person or app seeing the error

This section is my advice, not a Microsoft statement. The documented behaviour is that the user is asked to sign in again, so:

1. An interactive sign-in normally restores access. An app that holds an old refresh token should send the user through an interactive request instead of retrying the token request.
2. Do not loop on silent retries. Repeating the same refresh gets the same result.
3. Make the app show a clear sign-in prompt when it receives this code, so users are not left with a blank state.
4. Ask the administrator whether the policy period changed recently if many users report it at once.

## Choosing a period

Learn warns that asking for credentials too often can backfire, because users who habitually enter credentials might unintentionally provide them to malicious prompts. The page also recommends time-based sign-in frequency for Microsoft 365 apps for a better experience, and for the Azure portal and Entra admin center suggests time-based frequency or reauthentication on PIM activation. In my experience, the shortest period that the business can accept is the one users stop noticing, because a very short one trades security for prompt fatigue.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Sign-in frequency](https://www.m365.fm/entity/sign-in-frequency/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Conditional Access adaptive session lifetime policies - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/concept-session-lifetime)
