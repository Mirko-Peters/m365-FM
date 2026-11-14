---
title: "Teams Opens With a White Screen After a Symlink or Drive Map to C:\\Users"
summary: "Teams shows a white screen at startup when a Unix symlink or drive map points to C:\\users. The Microsoft Learn cause is a custom install location that blocks updates, the fix is the default location, and Teams on the web is the fallback."
status: review
publish: false
author: mirko-p
date: 2027-01-21
topics: [teams, intune]
keypoints:
  - "Symptom per Learn: a white screen appears when Teams starts after you use a Unix symlink or map a drive to C:\\users."
  - "Learn's cause: an installation script put Teams in Program Files instead of the default location, so the client does not update automatically."
  - "Learn's fix: install Teams in the default user AppData location. If the mapping must stay, use the web version of Teams."
  - "Clearing the Teams cache is not a general first step and is not listed as a fix for this symptom. It also deletes diagnostic logs."
  - "Microsoft's bulk installer is the teamsbootstrapper.exe, which installs the Teams MSIX package for all users on a computer."
faq:
  - q: "What exactly triggers the white screen?"
    a: "According to Microsoft Learn, the white screen appears when Teams starts after you use a Unix symlink or map a drive to C:\\users. The article is short and names no other trigger or error code."
  - q: "What is the cause?"
    a: "Learn says that when an installation script installs Teams to Program Files instead of the default location, the client will not update automatically when a new version is available. It calls this an expected limitation of Teams when a custom script changes the installation location."
  - q: "How do I fix it?"
    a: "Make sure the application is installed in the default location, user AppData, which Learn writes as user\\Appdata. If the mapping has to exist, Learn says to use the web version of Microsoft Teams instead."
  - q: "Should I clear the Teams cache?"
    a: "The Learn page on clearing the Teams cache calls it a targeted step for a small number of local client problems and not a general first step. It advises against it for missing messages or channels because clearing deletes diagnostic logs. The white screen article does not list cache clearing as its resolution."
  - q: "How does Microsoft deploy Teams in bulk?"
    a: "The bulk deployment page describes teamsbootstrapper.exe, a lightweight online installer with a headless command line. Run with the -p switch from an administrative prompt, it downloads the latest Teams MSIX package and installs it for all users on the computer, including users added later."
---

If Teams starts with a white screen after you pointed a Unix symlink or a mapped drive at `C:\users`, Microsoft Learn names one cause: a custom installation location, which stops the client from updating. The documented fix is to install Teams in its default location, and the fallback is Teams on the web. The Learn article is short, so this post adds context from two related pages.

## What Learn documents

The article describes the symptom like this: when you use a Unix symlink or map a drive to `C:\users`, a white screen appears when the Teams app starts.

The cause it gives: when an installation script installs Teams to Program Files instead of the default location, the client does not update automatically when a new version is available. Learn calls this an expected limitation if a custom script changes the installation location.

The resolution has two parts:

1. Make sure the application is installed in the default location, `user\Appdata`.
2. If the mapping must exist, use the web version of Microsoft Teams instead.

The page has no log locations, error codes or version numbers. I have not seen a documented explanation of why the stale client shows a white screen, so I do not offer one.

## A triage order

This order is mine, built from what the Learn text says:

| Step | Check | Why |
| --- | --- | --- |
| 1 | Is `C:\users` redirected by a symlink or drive map on this device? | That is the documented trigger |
| 2 | Where is Teams installed? Was a script used that targets Program Files? | That is the documented cause |
| 3 | Is a default-location install possible without removing the mapping? | That is the documented fix |
| 4 | If the mapping must stay, can the user work in Teams on the web for now? | That is the documented fallback |

Step 1 comes first because a device without the mapping points to a different problem, and this article does not cover it.

## How Microsoft installs Teams in bulk

The page on bulk deployment explains the supported installer path. It is useful when you review the script that put Teams in the wrong place.

- **TeamsBootstrapper** is a lightweight online installer with a headless command-line interface. It lets admins provision the app for all users on a computer.
- Running `teamsbootstrapper.exe` downloads the latest Teams MSIX package from Microsoft and installs the application for all users on the computer and for users added afterwards.
- If users previously installed a different Teams version, it is replaced with the provisioned version.
- The installer also modifies the registry so Teams works with Office and other applications.
- For a single computer, open an administrative Command Prompt and run `.\teamsbootstrapper.exe -p`. An offline option takes the MSIX with `-o` and a local path or UNC path.
- You can distribute the installer with Intune, Configuration Manager, Group Policy or third-party tools.
- Learn says to use the latest version of the bootstrapper, and to check Properties, Details, Product version if you downloaded it earlier.

The prerequisites table on that page lists Microsoft 365 Apps or Office LTSC 2021, the current WebView2, and Delivery Optimization, which powers Teams automatic updates. Download Mode 100 (Bypass) is not supported.

I am not claiming that the bootstrapper path fixes the symlink case. The white screen article only speaks about installation location and updates. The bulk page shows what a supported installation looks like, which helps when you compare it to a custom script.

## A word about clearing the cache

Clearing the cache is a common reflex for Teams problems. The Learn page on the Teams client cache is clear that it is a targeted step for a small number of local client problems, not a general first step. It also says that clearing the cache does not fix problems such as missing messages, chat history not loading or a missing channel, and that it deletes the diagnostic logs needed to find the cause.

Keep that in mind for the white screen. The white screen article does not list cache clearing as a resolution, so I would only try it as a deliberate test and after you have kept the logs you may need. The cache page lists these Windows paths for new Teams if you do decide to test it:

- Reset the app: **Settings** > **Apps** > **Installed apps** > Microsoft Teams > **Advanced options** > **Reset**. Learn warns that app data, including personalization, is deleted.
- Or delete the files in `%userprofile%\appdata\local\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams` after quitting Teams.

For classic Teams the page lists `%appdata%\Microsoft\Teams`. Restarting after a cache clear can take longer, since the files must be rebuilt.

## Notes for admins (my advice)

This section is my experience, not Microsoft guidance:

- Ask why the mapping exists. Folder redirection for profile data is often an older design, and the cleanest fix is to remove the need for it.
- Treat installation scripts that move apps to Program Files as technical debt. Compare them with the supported installer from the bulk deployment page.
- Give affected users the web version of Teams as a documented stopgap while you plan the change, so they can keep working.
- Record which devices carry the mapping, so you can check them after each change.

## What this article leaves open

Learn does not say how to repair an installation in place, how to find where a given device installed Teams, or which Teams versions are affected. I do not describe those steps here.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Intune](https://www.m365.fm/entity/intune/)

## Sources

- [Using a symlink or drive map causes Teams to open with white screen (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-sign-in/symlink-or-drivemap-causes-white-screen)
- [Bulk deploy the Microsoft Teams desktop client (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/teams-client-bulk-install)
- [Clear the Teams client cache (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-administration/clear-teams-cache)
