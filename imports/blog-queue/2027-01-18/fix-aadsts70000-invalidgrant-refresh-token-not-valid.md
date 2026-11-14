---
title: "Fix AADSTS70000: InvalidGrant, the Refresh Token Is Not Valid"
summary: "AADSTS70000 (InvalidGrant) means authentication failed because the refresh token is not valid, with two reasons in the reference: the token binding header is empty or its hash does not match. See how it differs from 70008 and 700082, and how token protection relates to bound tokens."
status: review
publish: false
author: mirko-p
date: 2027-01-18
topics: [entra-id, token-protection, access-token]
keypoints:
  - "The Entra error reference lists AADSTS70000 as InvalidGrant: authentication failed because the refresh token is not valid."
  - "Two reasons are named: the token binding header is empty, or the token binding hash does not match."
  - "AADSTS70008 and AADSTS700082 are different: those refresh tokens expired due to inactivity, which Learn calls an expected part of the token lifecycle."
  - "Learn's token protection page describes sign-in session tokens bound to a registered device, so a stolen token cannot be used from another device."
  - "The reference does not give a fix for 70000, so the steps here are my advice and start by checking which client and device made the request."
faq:
  - q: "What does AADSTS70000 mean?"
    a: "The Microsoft Entra error reference lists it as InvalidGrant: authentication failed and the refresh token is not valid. It names two possible reasons, an empty token binding header and a token binding hash that does not match."
  - q: "How is it different from AADSTS70008?"
    a: "70008 is ExpiredOrRevokedGrant: the refresh token expired due to inactivity. 70000 is about a token that is not valid for binding reasons, not about age."
  - q: "What is AADSTS700082?"
    a: "ExpiredOrRevokedGrantInactiveToken. The reference says the refresh token expired due to inactivity and that this is an expected part of the token lifecycle, because the user went an extended period without using the application."
  - q: "Is token binding the same as token protection?"
    a: "Learn does not say so on the pages I read. Its token protection page describes sign-in session tokens such as the Primary Refresh Token being bound to a device. Connecting that page to the 70000 row is my reading."
  - q: "Does the reference give a fix?"
    a: "No. The row lists the two reasons only. The first step in practice is to find out which client and device sent the request and whether it can bind its tokens."
---

AADSTS70000 is named InvalidGrant in the Microsoft Entra error reference: authentication failed because the refresh token is not valid. The reference gives two reasons: the token binding header is empty, or the token binding hash does not match. It gives no fix. This article sets that row next to the neighbouring refresh token codes and to Learn's description of token protection, and then lays out a practical order of checks that is my own advice.

## The row

The reference reads: InvalidGrant - Authentication failed. The refresh token isn't valid. Error might be due to the following reasons: Token binding header is empty; Token binding hash does not match.

Both reasons concern binding. Binding means that a token is tied to something about the client, so the service can check that the token is presented by the same client that received it. The reference does not explain the mechanism, so I use the token protection page below to describe the idea.

## Two neighbours that look similar

Two other refresh token rows are easy to confuse with this one:

- **AADSTS70008, ExpiredOrRevokedGrant:** the refresh token expired due to inactivity. The token was issued on a date and was inactive for a certain amount of time.
- **AADSTS700082, ExpiredOrRevokedGrantInactiveToken:** the refresh token expired due to inactivity, and the reference calls it an expected part of the token lifecycle: the user went an extended period without using the application, so the token was expired when the app attempted to refresh it.

Those two are about time. AADSTS70000 as described is about the token not being valid in terms of binding. If the message you see is 70000, inactivity is not the reason named by the row.

## What bound tokens are

Learn's page on token protection describes a Conditional Access session control that tries to reduce token replay attacks. It makes sure that only device-bound sign-in session tokens, such as Primary Refresh Tokens, are accepted by Microsoft Entra ID when applications request access to protected resources. When a user registers a supported device, a PRT is issued and cryptographically bound to that device, so a stolen token cannot be used from another device.

The page lists:

- **Native applications** on Windows, iOS/iPadOS and macOS as generally available, with browser-based support in preview for supported web apps that access Azure Resource Manager on Windows and macOS.
- **Resources** that can be protected: Exchange Online, SharePoint Online and Microsoft Teams, plus Azure Virtual Desktop and Windows 365 on Windows.
- **Supported devices**, such as Windows 10 or newer devices that are Microsoft Entra joined, hybrid joined or registered, and Apple devices with the Microsoft Enterprise SSO plug-in and MDM management.

That page does not mention AADSTS70000 or the token binding header. So linking a 70000 error to token protection is my reading of the word binding, not something Learn states. Treat it as a lead to check, not as a confirmed cause.

## Checks in a sensible order

This section is my advice, not a Microsoft statement.

1. **Get the sign-in log entry.** Find the failed request and note the application, the client app type, the device information and any Conditional Access policy that applied.
2. **Check whether a token protection policy applies.** If a Conditional Access policy with the token protection session control targets that app and user, the failure may be related. Learn recommends deploying such a policy first in report-only mode, with a pilot group, and capturing interactive and non-interactive sign-in logs, so the logs may already show the impact.
3. **Check the client.** Is it a supported native client on a supported device? A custom app, a script or an older client that stores and replays a refresh token on its own is more likely to fail a binding check.
4. **Check the device state.** For Windows, Learn lists Microsoft Entra joined, hybrid joined or registered devices. A device that lost its registration may behave differently.
5. **Do not copy tokens between environments.** If a developer copies a refresh token from one machine to another to test, a binding mismatch is the kind of failure you should expect.
6. **Request a fresh interactive sign-in.** For an app that holds an invalid refresh token, sending the user through a new interactive authentication issues a new token. This is the normal recovery pattern for invalid grants, but the row itself does not say so.

## For app developers

This section is my advice, not a Microsoft statement.

Do not retry a refresh with the same token after an InvalidGrant response. Treat 70000, 70008 and 700082 as signals to start an interactive sign-in. Separate the handling of inactivity codes from the handling of binding codes in your logs, so support can tell an unused app from a suspicious or misconfigured client. If you rely on brokered sign-in, such as the Microsoft Authentication Library with a broker on the device, keep the broker components current, because bound tokens depend on the device side of the exchange. Learn's pages that I read do not describe broker versions, so check your library documentation.

## When many users are affected at once

This section is my advice, not a Microsoft statement. A sudden rise in 70000 across many users points to a change in policy or in a client, not to individual users. Ask whether a token protection policy moved from report-only to enforced, whether a client update rolled out, or whether a group of devices lost registration. Report-only results from before the change help you decide whether to roll back or fix the clients.

## What the sources do not say

The reference page is long and I read the rows for this code and its neighbours, not the whole page. The token protection page is a concept page and does not cover error codes. Nothing I read states the exact cause of a given 70000 event. If the checks above do not explain it, open a support case with the correlation ID and timestamp from the sign-in log.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Token protection](https://www.m365.fm/entity/token-protection/)
- [Access token](https://www.m365.fm/entity/access-token/)

## Sources

- [Microsoft Entra authentication & authorization error codes - Microsoft identity platform (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [How Token Protection Enhances Conditional Access Policies - Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/concept-token-protection)
