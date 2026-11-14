---
title: "Teams No Internet Connection: Fix Sign-In and Connection Problems"
summary: "Steps for Microsoft Teams that shows no internet connection or fails to sign in: run the diagnostics, read the error code, check firewall and proxy access, update, clear the cache or reinstall."
status: review
publish: false
author: mirko-p
date: 2026-11-22
topics: [teams, microsoft-365-admin-center]
keypoints:
  - "Learn says most Teams client issues trace back to firewall or proxy connectivity, so confirm that the required URLs, IP addresses and ports are reachable first."
  - "Admins can run the Teams Sign-in diagnostic or the Remote Connectivity Analyzer Teams Sign in test before changing anything on the client."
  - "Check the error code on the sign-in screen. 0xCAA82EE7 and 0xCAA82EE2 point to internet access, 0xCAA20004 to Conditional Access."
  - "Clearing the cache is a targeted step, not a general first fix. Do not use it for missing chats or wrong unread counts."
  - "Offline, Teams keeps unsent messages for existing chats for up to 24 hours and sends them after you reconnect."
faq:
  - q: "What does the error code 0xCAA82EE7 mean in Teams?"
    a: "According to Microsoft Learn, 0xCAA82EE7 and 0xCAA82EE2 mean you should confirm internet access. Learn suggests using the Network assessment tool to verify the network path to Microsoft, and notes that Teams calls need specific IP addresses and ports to be open."
  - q: "Should I clear the Teams cache whenever it misbehaves?"
    a: "No. Microsoft Learn says clearing the cache is a targeted step for a small number of local client problems, not a general first step. It does not fix missing messages, chat history that will not load or wrong unread counts, and it deletes diagnostic logs that are needed to find the cause."
  - q: "What happens to my messages when Teams loses its connection?"
    a: "Microsoft Learn says Teams keeps running when offline or on low bandwidth. Unsent messages in existing chats are saved for up to 24 hours and sent when you reconnect. After more than 24 hours offline you can resend or delete them. Learn says Microsoft is working on the same for new chats."
  - q: "Where do I find the sign-in diagnostic?"
    a: "Microsoft Learn describes the Teams Sign-in diagnostic as a Run Tests option for a Microsoft 365 administrator account. You enter the affected user's name or email and select Run Tests. It is not available for Microsoft 365 Government, 21Vianet or Germany."
---

When Teams reports no internet connection or will not sign in, start with the network path and the sign-in error code, not with the app. Microsoft Learn says most Teams client issues can be traced to firewall or proxy connectivity. The order below follows the Microsoft Learn sign-in and connectivity articles: diagnose, read the code, check the network, update, then clear the cache or reinstall.

## Step 1: Rule out the network path

Verify that the URLs, IP addresses and ports Teams needs are open in your firewall or proxy. Learn lists the scenarios that need specific entries: authentication, Teams client connectivity, collaboration, media, shared services and third-party integration. The entries are in the Microsoft 365 URLs and IP address ranges article.

For a home user this means checking that other websites and apps work. For an admin it means checking the firewall and proxy rules. A Microsoft Q&A answer from November 2025 for the same symptom (Teams says no internet while the connection is fine) gives the same order: restart or sign out and in, clear the cache, check firewall and security settings. The thread shows no confirmed fix, so treat it as a checklist, not a guarantee.

## Step 2: Run the diagnostics (admins)

Learn offers two diagnostics for sign-in problems:

1. **Teams Sign-in diagnostic.** Needs a Microsoft 365 administrator account. Select **Run Tests: Teams Sign-in**, enter the affected user's username or email and select **Run Tests**. Not available for Microsoft 365 Government, 21Vianet or Germany.
2. **Microsoft Remote Connectivity Analyzer.** Go to the Teams Sign in test, sign in with the user's credentials, enter the verification code and select **Verify**. Not supported for GCC or GCC High.

If a diagnostic finds an issue, follow its solution first.

## Step 3: Update the client

Select **Settings and more** next to your profile picture, then **Check for updates**. The desktop app normally updates itself. If an update is missing, install it and retry.

## Step 4: Read the error code

| Error code on the sign-in screen | Microsoft Learn's direction |
|---|---|
| 0xCAA82EE7 or 0xCAA82EE2 | Confirm internet access. Use the Network assessment tool to verify the network path. Teams needs specific IP addresses and ports. |
| 0xCAA20004 | A Conditional Access issue. See the Conditional Access policies for Teams article. |
| 0xCAA70004 or 0xCAA70007, or the same problem in other Office apps | See the article on sign-in connection issues after the Office 2016 build update. |
| Any other code | See "Why am I having trouble signing in to Microsoft Teams?" |

If the error occurs only in the Teams web client, Learn points to a separate article on the web login loop for browser-specific fixes.

## Step 5: Clear the cache, only for local client faults

Learn is explicit that cache clearing is not a general first step. Do not use it for missing messages, chat history that will not load, channels that do not appear or wrong notifications and unread counts, because it does not fix those and it deletes diagnostic logs.

**New Teams on Windows, method 1: reset the app.** Resetting deletes app data, including personalization settings.

1. Open **Settings** > **Apps** > **Installed apps** and search for Microsoft Teams.
2. For **New Microsoft Teams**, select **More options** (...) > **Advanced options**.
3. In **Reset**, select **Reset**.
4. Restart Teams.

**New Teams on Windows, method 2: delete the files.** Quit Teams, press Windows key + R, enter `%userprofile%\appdata\local\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams`, delete everything in that folder and restart.

**Classic Teams on Windows:** quit Teams, enter `%appdata%\Microsoft\Teams` in Run, delete the contents and restart.

Learn also gives macOS steps for both versions and says it has no cache steps for Teams on the web. The first start after clearing may take longer because the cache must be rebuilt.

## Step 6: Reinstall

If the sign-in error persists, Learn lists these steps: uninstall Teams, delete the **Teams** folder under `%appdata%\Microsoft`, then download and install Teams again, running the installer as administrator if possible.

## What Teams does while offline

Teams keeps running when offline or on low bandwidth. Unsent messages in existing chats are stored for up to 24 hours and sent after you reconnect. After more than 24 hours you can choose to resend or delete them.

## If nothing works

Create a support request. Learn asks you to include the debug logs and the error code shown on the sign-in screen. In the Microsoft 365 admin center, the Q&A answer mentions the route through **Support** > **Help & Support**.

## Common mistakes

- **Clearing the cache first.** It removes logs and does not help with chat or channel display issues.
- **Ignoring the error code.** Each code in the table points somewhere different.
- **Blaming the internet provider.** Firewall, proxy and Conditional Access rules often cause the same message.

## Limits of the sources

Several Microsoft Support pages on Teams sign-in were not retrievable while this article was prepared. The Learn connectivity page is short: it covers firewall and proxy causes and offline behavior but gives no ordered tool list. Teams crashes without an error code are not covered by the pages read here. Check service health in your tenant and collect logs before contacting support.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft 365 admin center](https://www.m365.fm/entity/microsoft-365-admin-center/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)

## Sources

- [Microsoft Learn: Resolve sign-in errors in Teams](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/teams-sign-in/resolve-sign-in-errors)
- [Microsoft Learn: Clear the Teams client cache](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/teams-administration/clear-teams-cache)
- [Microsoft Learn: Troubleshoot connectivity issues with the Microsoft Teams client](https://learn.microsoft.com/en-us/MicrosoftTeams/connectivity-issues)
- [Microsoft Q&A: Teams disconnects and reports no internet connection](https://learn.microsoft.com/en-us/answers/a/12373497)
