---
title: "Power Apps Will Not Start or Load: Fix Startup and Sign-In Issues"
summary: "When Power Apps halts at sign-in, shows thirdPartyCookiesBlocked, Sign in required with AADSTS50058, or WebAuthoring abnormal termination, the first cause Learn points to is blocked cookies or storage. Follow Learn's six steps for Edge, Chrome, Safari, iOS and Firefox."
status: review
publish: false
author: mirko-p
date: 2027-01-15
topics: [power-apps, power-apps-maker-portal, entra-id]
keypoints:
  - "Learn lists symptoms including repeated sign-in prompts for embedded apps, thirdPartyCookiesBlocked, Sign in required with AADSTS50058, We could not sign you in and WebAuthoring abnormal termination."
  - "The first resolution step is to enable third-party cookies and local data, because Power Apps stores identity and preferences in the browser."
  - "Other steps: clear cache and cookies, try another browser, check the network, handle Entra errors with your IT department, and check Third-party Storage Partitioning."
  - "Sites to unblock include make.powerapps.com, apps.powerapps.com, create.powerapps.com and login.microsoftonline.com; or allow powerapps.com as an exception."
  - "Firefox needs an Enhanced Tracking Protection exception for the site that embeds the app, such as SharePoint."
faq:
  - q: "What are the common symptoms?"
    a: "Microsoft Learn lists: sign-in prompts every time an app is embedded in SharePoint or Teams, a cookie error with thirdPartyCookiesBlocked, a Sign in required message with AADSTS50058, We couldn't sign you in, WebAuthoring abnormal termination, and codes beginning UserInterventionNeeded such as CookiesBlocked, StorageBlocked, NavigateToAadTimeout, NavigateToAadDenied and StorageLost, or AadError."
  - q: "Why do cookies matter?"
    a: "Learn says Power Apps stores some data locally, such as user identity and preferences, using browser capabilities. Problems occur if the browser blocks that local data or the third-party cookies set by Power Apps."
  - q: "Which sites should not be blocked?"
    a: "In Edge and Chrome site-specific lists, Learn names create.powerapps.com, wildcard create.powerapps.com, make.powerapps.com, make wildcard powerapps.com, login.microsoftonline.com, apps.powerapps.com and apps wildcard powerapps.com, plus the US Government URLs for sovereign clouds. As an alternative, add powerapps.com as an allowed site."
  - q: "When should I check Third-party Storage Partitioning?"
    a: "Only for sign-in or sign-out problems when you use a device with several Entra identity sign-ins, use multiple Entra apps across tabs and sign-out in one tab does not sign out the other, open Power Apps embedded by iframe in a third-party site, or open a canvas app embedded in a model-driven form. Learn gives edge://flags and chrome://flags addresses to check it."
  - q: "What about the iOS apps?"
    a: "For the Power Apps and Dynamics 365 mobile apps on iOS, change the iOS settings linked to the app rather than the browser settings. Toggle on Allow Cross-Website Tracking under the Power Apps, Dynamics 365 or Edge entry in iOS Settings."
---

When Power Apps will not start or sign in, the first thing to check is whether the browser or app blocks third-party cookies and local data. Microsoft Learn says Power Apps stores data such as user identity and preferences in the browser, and problems occur if that storage or the cookies Power Apps sets are blocked. Learn gives six resolution steps, with browser-specific settings. This guide follows that page.

## Symptoms

Learn lists these common issues and errors when you start up or sign in at make.powerapps.com:

- You are prompted to sign in every time an app is embedded in another client such as SharePoint or Microsoft Teams. The opening experience halts until you sign in.
- A cookie error: "Something went wrong. thirdPartyCookiesBlocked Please enable third party-cookies and site data in your browser settings." For Chrome Incognito mode, uncheck **Block third-party cookies** on the Incognito landing page.
- "Sign in required" with `AADSTS50058: A silent sign-in request was sent but no user is signed in`. The text says the session cookies were not sent to Microsoft Entra ID. It mentions Internet Explorer or Edge and a different IE security zone as one way this happens. Learn says this appears especially in InPrivate or incognito mode.
- "We couldn't sign you in."
- "WebAuthoring abnormal termination" with a script error.
- Codes: `UserInterventionNeeded_CookiesBlocked`, `UserInterventionNeeded_StorageBlocked`, `UserInterventionNeeded_NavigateToAadTimeout`, `UserInterventionNeeded_NavigateToAadDenied`, `UserInterventionNeeded_StorageLost` and `AadError`.

## The six steps

1. **Enable third-party cookies and local data** in your browser or app. Details below.
2. **Clear the browser cache and cookies** and try again. Learn says cached data can prevent sign-in.
3. **Try a different browser.** Learn links the supported browsers in the Power Apps system requirements.
4. **Check the network connection** for stability.
5. **Microsoft Entra errors** usually relate to authentication and authorization. The error page might have more information, and fixing them might need your IT department.
6. **Check Third-party Storage Partitioning** and make sure it is disabled, but only under the conditions below.

### When step 6 applies

Learn says to consider it only for sign-in or sign-out issues when:

- A device has multiple Microsoft Entra identity sign-ins used for different applications.
- You use several Entra applications in more than one tab, and signing out of one tab does not sign you out of the other.
- You use a Power Apps app embedded in a third-party website through an iframe.
- You use a canvas app embedded in a model-driven app form.

Check the flag at `edge://flags/#third-party-storage-partitioning` in Edge or `chrome://flags/#third-party-storage-partitioning` in Chrome.

## Enable cookies and local data by browser

Most browsers apply the setting immediately. Learn says you might need to close all browser windows and reopen them.

### Microsoft Edge

**Option 1, for all sites.** Select **Settings** > **Cookies and site permissions**, expand **Cookies and data stored**, and make sure **Block third-party cookies** is off. Under **Block** and **Clear on exit**, remove these if present:

- `https://create.powerapps.com` and `https://*.create.powerapps.com`
- `https://make.*.powerapps.com` and `https://make.powerapps.com`
- `https://login.microsoftonline.com`
- `https://apps.*.powerapps.com` and `https://apps.powerapps.com`
- For sovereign clouds, the US Government service URLs.

**Option 2, exceptions.** This needs Edge version 87 or above. Under **Allow**, select **Add** and enter `[*.]powerapps.com`. Then select **Clear browsing data on close** and make sure **Cookies and other site data** is disabled, or if you want it on, add `[*.]powerapps.com` there too.

### Google Chrome

**Option 1.** Select **Settings** > **Privacy and security**, expand **Cookies and other site data**, and make sure **Block third-party cookies** or **Block all cookies** is not selected. Remove the same sites from **Sites that can always use cookies** and **Always clear cookies when windows are closed**.

**Option 2.** Under **Sites that can always use cookies**, select **Add**, enter `[*.]powerapps.com` and select **Including third-party cookies on this site**.

### Safari on iOS

In the Safari app select **Safari** > **Preferences** > **Privacy**. Make sure **Block all cookies** and **Prevent cross-site tracking** are not selected.

### iOS apps

For the Dynamics 365 phone or tablet app, the Power Apps app and Edge on iOS, go to iOS **Settings**, scroll to the app (**Dynamics 365**, **Power Apps** or **Edge**) and toggle on **Allow Cross-Website Tracking**. Learn says that for the mobile apps you must use the iOS settings linked to the app rather than the browser settings.

### Mozilla Firefox

To allow apps to use cookies when embedded in another client such as SharePoint, go to **Settings** > **Privacy & security**, find **Enhanced Tracking Protection**, select **Manage Exceptions** and add the URL of the website that embeds the app, for example your SharePoint URL.

## Clear the cache

Learn explains that the cache stores downloaded site information on your device's drive, and that some Power Apps features use it for speed. Clearing it can help sign-in. It links instructions for Edge, Chrome and Safari on Mac.

## Match the symptom to the step

This is my own mapping, not a Microsoft statement.

| Symptom | Start with |
| --- | --- |
| thirdPartyCookiesBlocked, CookiesBlocked, StorageBlocked | Step 1, cookies and local data |
| Sign in required with AADSTS50058 in InPrivate | Step 1, and test in a normal window |
| Repeated sign-in prompts for apps embedded in SharePoint or Teams | Step 1, and for Firefox the tracking exception |
| Problems only with several tabs or identities | Step 6, storage partitioning |
| AadError or other Entra messages | Step 5, with IT |
| WebAuthoring abnormal termination | Steps 2 and 3, cache and another browser |

My advice, not Learn's: work through the steps in the order Learn lists them and retest after each one, so you know which step helped. If only one user has the problem, a managed browser policy that blocks cookies is a possible reason, which is another point to raise with IT.

## Related

- [Power Apps](https://www.m365.fm/entity/power-apps/)
- [Power Apps maker portal](https://www.m365.fm/entity/power-apps-maker-portal/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Troubleshoot startup or sign-in issues for Power Apps - Power Apps (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/power-platform/power-apps/sign-in/troubleshooting-startup-issues)
