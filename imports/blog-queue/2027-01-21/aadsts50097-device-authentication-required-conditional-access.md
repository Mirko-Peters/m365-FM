---
title: "AADSTS50097 Device Authentication Is Required: What the Conditional Access Policy Wants From the Client"
summary: "AADSTS50097 means a Conditional Access policy needs the device to be managed and the client has to prove its identity. Read the sign-in log, then use WAM, the system browser or a broker, per Microsoft Learn. A question-led walkthrough."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [entra-id, conditional-access, microsoft-edge]
keypoints:
  - "The error reference lists AADSTS50097 as DeviceAuthenticationRequired: device authentication is required."
  - "Per the MSAL.NET page, a Conditional Access policy requires the token-requesting device to be managed and the client has to prove that identity."
  - "Fix for apps: use WAM on Windows or the system browser, and on iOS and Android enable the brokers Microsoft Authenticator and Company Portal."
  - "In a browser, Learn says you need one that can talk to WAM: Edge on Chromium, or Chrome with the Microsoft Entra extensions."
  - "Find the policy in Entra ID, Monitoring and health, Sign-in logs, on the Conditional Access tab of the failed event."
faq:
  - q: "What does AADSTS50097 mean?"
    a: "The Microsoft Entra error code reference lists it as DeviceAuthenticationRequired with the text Device authentication is required. The MSAL.NET troubleshooting page explains that a Conditional Access policy on the resource requires the device that gets the token to be managed by the organization, and that the client has to prove this identity."
  - q: "How do I fix it in an app I wrote?"
    a: "According to Learn, use WAM on Windows or the system browser. On mobile platforms, enable the brokers Microsoft Authenticator and Company Portal. The page links to the WAM integration for desktop apps and to guidance on enabling the authentication broker on iOS and Android."
  - q: "Which browsers work for web apps?"
    a: "The MSAL.NET page says that for web applications you must use a browser that can talk to WAM, which it names as Edge on Chromium or Chrome with the Microsoft Entra extensions. It links to the Conditional Access conditions article for the Chrome support details."
  - q: "How do I find out which policy caused it?"
    a: "Sign in to the Microsoft Entra admin center as at least a Reports Reader, go to Entra ID, Monitoring and health, Sign-in logs, find the failed event and open its Conditional Access tab. It shows the policies that interrupted the sign-in, and the Troubleshooting and support tab may give a reason such as a device that did not meet compliance requirements."
  - q: "Is this the same as AADSTS53000 or 53001?"
    a: "No. The Conditional Access troubleshooting page lists 53000 as DeviceNotCompliant and 53001 as DeviceNotDomainJoined as separate common error codes. 50097 is listed separately as DeviceAuthenticationRequired. Check the exact code in the sign-in log before choosing a fix."
---

AADSTS50097, DeviceAuthenticationRequired, means a Conditional Access policy needs proof that the sign-in comes from a device the organization manages, and the client did not deliver that proof. This article walks through it as a set of questions, in the order I would ask them, using the Microsoft Learn error reference, the MSAL.NET page for this code and the Conditional Access troubleshooting article.

## Question 1: What does the code say?

The error code reference lists AADSTS50097 as *DeviceAuthenticationRequired - Device authentication is required.* That row is one line. The MSAL.NET page for device authentication errors gives the explanation: the error happens when a Conditional Access policy applies to the resource you are accessing, and the policy requires that the device the token is acquired from is managed by the organization, and that MSAL.NET proves this identity. It is a policy applied by the tenant admin.

So the cause is not a broken password or a damaged account. The policy asks for a device identity, and the client did not present one.

## Question 2: Which policy is it?

Use the sign-in log. The Conditional Access troubleshooting page gives these steps:

1. Sign in to the Microsoft Entra admin center as at least a Reports Reader.
2. Go to **Entra ID** > **Monitoring & health** > **Sign-in logs**.
3. Find the event. Useful filters are **Correlation ID**, **Conditional Access** (scoped to failures), **Username**, **Date** and **Resource**.
4. Open the event and select the **Conditional Access** tab to see the policy or policies that interrupted the sign-in.

The **Troubleshooting and support** tab may give a clear reason, and the device details used for the evaluation appear in the **Device Info** and other tabs of the event. If the user saw an error page in the browser, selecting **More Details** reveals information that you can use to search the log or to open a support incident.

If the event does not explain the result, the page points to the sign-in diagnostic under **Basic info** > **Troubleshoot Event**, and to the What If tool. For a support incident, include the request ID, time and date.

## Question 3: Which client is signing in?

This decides the fix. The MSAL.NET page says that to satisfy the requirement, you have to use WAM on Windows or the system browser, and on mobile platforms enable the brokers.

| Client | What Learn says |
| --- | --- |
| Desktop app on Windows | Use WAM. The page links to WAM integration for desktop applications |
| iOS and Android app | Enable the authentication broker. Learn names Microsoft Authenticator and Company Portal |
| Web application in a browser | Use a browser that can talk to WAM: Edge on Chromium, or Chrome with the Microsoft Entra extensions |

For a web application, the page links to the Conditional Access conditions article for the Chrome details. I did not read that article for this post, so I leave the extension specifics to it.

## Question 4: Is it the right error?

Learn lists several device-related codes in the Conditional Access troubleshooting article:

| Code | String |
| --- | --- |
| 53000 | DeviceNotCompliant |
| 53001 | DeviceNotDomainJoined |
| 53002 | ApplicationUsedIsNotAnApprovedApp |
| 53003 | BlockedByConditionalAccess |
| 53009 | Application needs to enforce Intune protection policies |

Those appear with the prefix AADSTS, for example AADSTS53002. They are different from 50097. If the log shows 53000, the string says the device is not compliant, which is a different finding than a client that did not present a device identity. In my experience it pays not to mix the two.

## Question 5: Is the policy too broad?

The troubleshooting page warns about policies that cover all users and all resources, and lists these as configurations to avoid in that scope:

- Require device to be marked as compliant. For users who have not enrolled their devices yet, it blocks all access, including the Intune portal, and an admin without an enrolled device could be locked out.
- Require Hybrid Microsoft Entra domain joined device, which can block everyone without a hybrid joined device.
- Require app protection policy, which can block everyone if no Intune policy exists.

The page also notes that apps depend on other resources. A policy that targets one service can block a sign-in because of a resource the app calls, which is why the sign-in log shows the **Audience** list of requested resources.

If you are locked out by a policy, the page says to ask another admin who is not blocked to disable the policy. If no admin can, submit a support request, and Microsoft support reviews the policy and updates it after confirming.

## Order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Get the exact code and the correlation ID from the user or the log.
2. Identify the client: custom app, Microsoft app, or plain browser.
3. For a browser, check the browser first. A browser that cannot pass device identity is a frequent reason a managed device still fails. This is my experience, not a Learn statement.
4. For a custom app, check whether it uses WAM or a broker.
5. Only change the policy after you know the client cannot be fixed.

## Limits of the sources

The error reference row is one line and the MSAL.NET page is short. Neither explains how to register a device or what makes a device count as managed beyond the sentence quoted above. For that, the Learn article on requiring managed devices for cloud app access, which the MSAL.NET page links, is the next page to read.

## Related

- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [Conditional Access](https://www.m365.fm/entity/conditional-access/)
- [Microsoft Edge](https://www.m365.fm/entity/microsoft-edge/)

## Sources

- [Microsoft Entra authentication and authorization error codes (Microsoft Learn)](https://learn.microsoft.com/entra/identity-platform/reference-error-codes)
- [Device authentication errors (Microsoft Learn)](https://learn.microsoft.com/entra/msal/dotnet/advanced/exceptions/device-authentication-errors)
- [Troubleshooting sign-in problems with Conditional Access (Microsoft Learn)](https://learn.microsoft.com/entra/identity/conditional-access/troubleshoot-conditional-access)
