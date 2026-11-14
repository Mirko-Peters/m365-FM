---
title: "AADSTS50140 KmsiInterrupt: Why the Keep Me Signed In Prompt Shows Up as an Error in Entra Sign-In Logs"
summary: "AADSTS50140 is not a failure of your sign-in setup. It records the Stay signed in prompt, an expected part of the flow. What the log entry means, when the prompt is not shown, and how to turn it off for everyone or for a group."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [entra-id, conditional-access]
keypoints:
  - "Learn calls AADSTS50140 KmsiInterrupt: the Keep me signed in prompt interrupted the sign-in, which is an expected part of the flow."
  - "A log entry with this code usually means the user saw the Stay signed in prompt and left the sign-in attempt without answering it."
  - "Answering Yes sets a persistent cookie. Without KMSI, the cookie is non-persistent and lasts 24 hours or until the browser closes."
  - "Turn the prompt off for the whole directory in User settings, or for selected users with persistent browser session controls in Conditional Access."
  - "The prompt is not shown for seamless SSO, guests, high-risk sign-ins, consent flows or when a persistent browser session control is configured."
faq:
  - q: "Is AADSTS50140 a real error I need to fix?"
    a: "According to the Microsoft Entra error code reference, it is an expected part of the sign-in flow. The user is asked whether to stay signed in to the current browser to make later logins easier. The reference page still offers a support ticket with the correlation ID, request ID and error code if you need more details."
  - q: "Why does it appear in my sign-in logs?"
    a: "The Stay signed in page says that if a user does not act on the prompt but abandons the sign-in attempt, a sign-in log entry appears. The prompt is called an interrupt. The entry shows sign in error code 50140 and the failure reason about the Keep me signed in interrupt."
  - q: "How do I stop users from seeing the prompt?"
    a: "Learn gives two ways. Set the Show option to remain signed in setting to No in User settings, which disables the prompt for all users in the directory. Or use the persistent browser session controls in Conditional Access to disable it for a select group without changing sign-in behavior for everyone else."
  - q: "When is the prompt intentionally not shown?"
    a: "Learn lists these cases: seamless SSO with integrated Windows authentication, Active Directory Federation Services with IWA, guest users, a high user risk score, user or admin consent flows, and sign-ins where a persistent browser session control is configured in a Conditional Access policy."
  - q: "What happens if KMSI is not enabled?"
    a: "The page says a non-persistent cookie is issued and lasts for 24 hours or until the browser is closed. If a user answers Yes to the prompt, a persistent authentication cookie is set instead. The cookie must be stored in session for KMSI to work, and KMSI does not work with locally stored cookies."
---

AADSTS50140 looks like an error in the sign-in logs, but Microsoft Learn describes it as an expected part of the sign-in flow. The code is named KmsiInterrupt, and it records the Keep me signed in (KMSI) prompt. Nothing is misconfigured when you see it. This article explains what the entry means, when users do not get the prompt, and the two documented ways to hide it.

## What Learn says about the code

The reference of error codes says that AADSTS50140 occurs because of the Keep me signed in interrupt while the user was signing in. A user is asked if they want to remain signed in to their current browser, so that later logins are easier. The page also says you can open a support ticket with the correlation ID, request ID and error code to get more details.

The separate page on the Stay signed in prompt adds the practical detail. If a user does not act on the prompt but abandons the sign-in attempt, a sign-in log entry appears. Learn calls the prompt an interrupt. In the sign-in logs, select the user and look in the **Basic info** section for:

- **Sign in error code**: 50140
- **Failure reason**: the error occurred due to the Keep me signed in interrupt when the user was signing in

Read that as: the user got far enough to see the prompt, and the session then stopped there. My reading, not a Microsoft statement: if you see a few of these per day across many users, that is normal browser behavior such as closing a tab on that page.

## What the prompt does

The **Stay signed in?** prompt appears after a user signs in successfully. Learn explains the effect of the answer:

| Situation | Cookie |
| --- | --- |
| User answers Yes | A persistent authentication cookie is set |
| KMSI is not enabled | A non-persistent cookie is issued. It lasts 24 hours or until the browser is closed |

The cookie must be stored in session for KMSI to work, and KMSI does not work with locally stored cookies. For federated tenants, the prompt shows after the user authenticates with the federated identity service.

Two details from the page are easy to miss:

- The **Do not show this again** checkbox works separately from the Stay signed in flow.
- Some features of SharePoint Online and Office 2010 depend on users being able to choose to stay signed in. If you turn the option off, users might see other unexpected prompts during sign-in.

## When the prompt is not shown

The page says KMSI is deliberately not shown when it cannot help the user. The listed cases:

1. The user signed in through seamless SSO and integrated Windows authentication (IWA).
2. The user signed in through Active Directory Federation Services and IWA.
3. The user is a guest in the tenant.
4. The user's risk score is high.
5. The sign-in occurs during a user or admin consent flow.
6. A persistent browser session control is configured in a Conditional Access policy.

In addition, the page notes that some Conditional Access policies and authentication configurations stop the Keep me signed in flow from appearing, and that its smart logic hides the option for a high-risk sign-in or a shared device detected by the machine learning system.

## Option 1: Turn the prompt off for everyone

The KMSI setting lives in **User settings**. Learn's enable steps are:

1. Sign in to the Microsoft Entra admin center as a Global Administrator.
2. Go to **Entra ID** > **Users** > **User settings**.
3. Set the **Show keep user signed in** toggle to **Yes** to enable it.

To stop the interrupt, the troubleshooting section says to set **Show option to remain signed in** to **No**. The page uses both wordings for what is clearly the same setting, so match the label you actually see in your tenant. Setting it to No disables the prompt for all users in your directory. You need the Global Administrator role to change it.

## Option 2: Hide it only for selected users

Use the persistent browser session controls in Conditional Access. Learn says this lets you disable the KMSI prompt for a select group of users without affecting sign-in behavior for everyone else. It also fits the list above: once a persistent browser session control is configured in a policy, the prompt is not shown.

If you take this route, the session lifetime article it links to is the place for the exact control settings. I did not read that page for this article, so I do not describe its options here.

## Licensing

The page lists these licenses for configuring KMSI: Microsoft Entra ID Free, Office 365 (for Office apps) and Microsoft 365.

## How I would handle it (my advice)

This list is my experience and suggestion, not a Microsoft procedure:

1. Filter your sign-in log noise. If you build alerts or reports from failed sign-ins, exclude 50140 so that expected interrupts do not look like attacks or outages.
2. Decide on purpose whether you want persistent cookies. On shared or kiosk-style devices, a persistent session can be unwanted. Choose Option 2 for those groups instead of switching it off for everyone.
3. Test with a pilot group first, because turning the prompt off can change how often people see other prompts.
4. Check the correlation ID only if a user says they were blocked. A user who is truly stuck usually has a different code in the log.

## Related Learn pages

The error code row links to a Microsoft Tech Community post about the new sign-in and Keep me signed in experiences. For the sign-in log fields and the persistent session settings, use the Learn pages for Microsoft Entra sign-in logs and Conditional Access session lifetime.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Manage the 'Stay signed in' prompt in Microsoft Entra ID (Microsoft Learn)](https://learn.microsoft.com/entra/fundamentals/how-to-manage-stay-signed-in-prompt)
