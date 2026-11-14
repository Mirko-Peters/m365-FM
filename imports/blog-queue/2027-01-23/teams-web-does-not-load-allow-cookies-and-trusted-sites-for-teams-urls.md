---
title: "Teams on the Web Does Not Load: Allow Cookies and Trusted Sites for Teams URLs"
summary: "When Teams does not load in Edge, Chrome, Firefox or Safari, including from Outlook on the web, Microsoft Learn ties it to the Trusted Sites feature and cookie settings. The seven domains to allow, the steps per browser and how admins push them with Group Policy."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [teams, group-policy]
keypoints:
  - "Teams might not load in Edge, Chrome, Firefox or Safari, including when opened from Outlook on the web, if browser settings do not allow the sites or cookies Teams needs."
  - "Learn says the issue occurs if you use the Trusted Sites feature and do not add the Teams URLs to the trusted list."
  - "Seven domains are listed: microsoft.com, cloud.microsoft, microsoftonline.com, teams.skype.com, teams.microsoft.com, sfbassets.com and skypeforbusiness.com."
  - "In Edge and Chrome, either allow cookies in general or add the seven domains to the allow list. Firefox uses Manage Exceptions."
  - "Admins can push the same list through Group Policy with CookiesAllowedForUrls in Edge and Chrome or the allowed sites list in Firefox."
faq:
  - q: "Why does Teams not load in my browser?"
    a: "Microsoft Learn says Teams might not load in Microsoft Edge, Google Chrome, Mozilla Firefox or Safari, also when opened from Outlook on the web, if the browser settings do not allow the sites or cookies Teams needs. The page names the Trusted Sites feature: if you use it and do not add the Teams URLs to the trusted list, the Teams client cannot load."
  - q: "Which URLs must I allow?"
    a: "The page lists seven: microsoft.com, cloud.microsoft, microsoftonline.com, teams.skype.com, teams.microsoft.com, sfbassets.com and skypeforbusiness.com. In Edge and Chrome they are written with a leading [*.] wildcard. In Firefox they are entered as https addresses."
  - q: "Do I have to allow all third-party cookies?"
    a: "No. In Edge the page offers an alternative: if you must keep third-party cookies blocked, add the seven sites under Allow. In Chrome you add them under Sites that can always use cookies with the including third-party cookies option. Learn also says Microsoft recommends blocking third-party cookies and explicitly allowing specific cookies from domains you trust."
  - q: "Who can change these settings?"
    a: "The page says you need administrative rights to make the updates. If you are the administrator, you can use a Group Policy Object to update all users at once."
  - q: "What about Safari?"
    a: "The page says Teams support for Safari is currently in preview. It tells you to clear Prevent cross-site tracking under Preferences and Privacy, close and reopen Safari, then go to teams.microsoft.com."
---

When the Teams web client does not load, or the page loads and stops, the Microsoft Learn page "Teams doesn't load" points to browser settings. It covers Microsoft Edge, Google Chrome, Mozilla Firefox and Safari, and also the case where Teams is opened from an app such as Outlook on the web. This article follows that page and adds a short order of work.

## What the page says causes it

The issue occurs if you use the **Trusted Sites** feature in your browser and you did not add the URLs for Microsoft Teams to the list of sites your browser should trust. Teams then cannot load. The fix is to update the browser settings, and you need administrative rights to do it. An administrator can use a Group Policy Object (GPO) to update all users at once.

Learn also says Microsoft recommends blocking third-party cookies, because they can put privacy and security at risk, and explicitly allowing specific cookies from domains you trust. That is why the steps below favor an allow list.

## The seven sites

| Site |
| --- |
| `[*.]microsoft.com` |
| `[*.]cloud.microsoft` |
| `[*.]microsoftonline.com` |
| `[*.]teams.skype.com` |
| `[*.]teams.microsoft.com` |
| `[*.]sfbassets.com` |
| `[*.]skypeforbusiness.com` |

In Firefox the same sites are entered as `https://` addresses.

## Microsoft Edge

1. In Edge **Settings**, go to **Cookies and site permissions** > **Cookies and data stored** > **Manage and delete cookies and site data**.
2. Turn on **Allow sites to save and read cookie data (recommended)**, and make sure **Block third-party cookies** is off.

If you have to keep third-party cookies blocked, use this alternative in the same window: under **Allow**, select **Add** and add the seven sites.

### Edge with Group Policy

1. Download the Microsoft Edge policy templates from the Edge Enterprise landing page and extract them.
2. Add the sites to **Content settings** > **CookiesAllowedForUrls**, as a mandatory or recommended policy.

The page links the Edge articles on configuring policy settings on Windows, adding the administrative template to Active Directory, mandatory or recommended policies, and the `CookiesAllowedForUrls` reference.

## Google Chrome

1. In Chrome **Settings**, open **Privacy and security** and select **Cookies and other site data**.
2. Under **Sites that can always use cookies**, select **Add**, and select **Including third-party cookies on this site**.
3. Add the seven sites.

### Chrome with Group Policy

The page explains that Chrome uses ADM and ADMX templates, which show the registry keys that configure Chrome. In short, download the Chrome administrative template, add it in the Group Policy editor under **Computer Configuration** > **Administrative Templates**, then add the seven sites to the **Content settings** > **CookiesAllowedForUrls** setting, and apply the policy to the target computers. Depending on the network, a policy may take time to propagate. The page links Google's documentation for managed PCs.

## Mozilla Firefox

1. In Firefox **Settings**, open **Privacy & Security**.
2. Under **Cookies and Site Data**, select **Manage Exceptions**.
3. Enter each of the seven sites as an `https://` address and select **Allow**.
4. Select **Save Changes**.

For a GPO, download and install the Firefox administrative template and add the sites under **Cookies** > **Allowed Sites**.

## Safari

The page says Teams support for Safari is currently in preview. To try again:

1. Select **Preferences** > **Privacy**.
2. Clear **Prevent cross-site tracking**.
3. Close Safari, reopen it, and go to teams.microsoft.com.

The page points to the Teams limits and specifications article for supported browsers.

## What the page does not cover

The page assumes the Trusted Sites or cookie blocking setting is the cause. It gives no steps for other reasons a Teams client may not load, such as a damaged desktop cache or a network block. For those, see other Teams troubleshooting pages.

## A short order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Check whether the problem is limited to the browser. If the desktop app opens normally, the browser settings are the first suspect.
2. Test in a private or InPrivate window with extensions off. If Teams loads there, a setting or extension in the normal profile blocks it.
3. Ask whether the user or a policy uses Trusted Sites or blocks third-party cookies, and compare the allow list with the seven sites.
4. Prefer the allow list over turning off third-party cookie blocking for everything, in line with the page's note.
5. For a company-wide issue, add the sites through Group Policy and test with a pilot group first.
6. Keep the list of sites in your own documentation, so you can compare it with the Learn page when it changes.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)

## Sources

- [Teams doesn't load (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-sign-in/sign-in-loop)
