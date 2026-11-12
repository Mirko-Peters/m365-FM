---
title: "How to Clear Teams Cache on Windows and Mac (and When Not To)"
summary: "Clear the Teams cache on Windows and Mac for new and classic Teams: what it fixes, what it does not, and which checks to run before you delete anything."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [teams]
keypoints:
  - "On Windows, new Teams can be reset under Settings, Apps, Installed apps, Advanced options, or you can quit Teams and delete the files in its LocalCache folder."
  - "Classic Teams on Windows uses the folder %appdata%\\Microsoft\\Teams. Quit Teams first, delete everything inside it and restart."
  - "Microsoft does not recommend clearing the cache for missing messages, chat history that won't load, missing teams or channels, or wrong notifications. It doesn't fix them and deletes diagnostic logs."
  - "Try the cheaper steps first: check your connection, sign out and back in, and test Teams in a browser at teams.microsoft.com."
  - "Reset deletes app data, including personalization settings, and the first start afterwards can be slow while the cache is rebuilt."
faq:
  - q: "How do I clear the Teams cache in Windows 11?"
    a: "For new Teams, open Settings, Apps, Installed apps, search for Microsoft Teams, select More options, Advanced options and then Reset. Alternatively, quit Teams, press Windows + R, open the LocalCache path under MSTeams_8wekyb3d8bbwe and delete everything inside the folder. Then restart Teams. The first start may take longer while the cache is rebuilt."
  - q: "Will clearing the Teams cache delete my chats?"
    a: "The cache is a local copy on the PC. Microsoft's reconnect guide says clearing it removes the web client cache, icons, thumbnails, local message history, display images and add-ons, and doesn't uninstall Teams. Microsoft advises against clearing for missing messages because it won't bring them back and removes diagnostic logs."
  - q: "When should I not clear the Teams cache?"
    a: "Microsoft does not recommend it for missing messages, chat history that doesn't load, a team or channel that doesn't appear, or wrong notifications and unread counts. It doesn't fix those problems and it deletes the diagnostic logs that help find the cause. Use it as a targeted step for a small number of local client problems."
---
To clear the Teams cache on Windows, quit Teams, then reset the app under **Settings**, **Apps**, **Installed apps** (for new Teams), or delete the contents of the Teams cache folder, and restart. On a Mac you delete the Teams folders in your Library with a short Terminal command. Before you do either, read the next section: Microsoft says clearing the cache is a targeted step for a few local client problems, and not a fix for missing chats. This article is for IT admins and help desk staff who get the "Teams is acting up" call, and it covers new and classic Teams on Windows and macOS.

## Should you clear the cache at all?

This is where most guides go wrong. Microsoft's Learn article [Clear the Teams client cache](https://learn.microsoft.com/en-us/troubleshoot/microsoftteams/teams-administration/clear-teams-cache) lists problems for which it does not recommend clearing the cache:

- Missing messages
- Chat history that isn't loading
- A channel or team that doesn't appear
- Wrong notifications or unread counts

Clearing doesn't fix these, and it deletes the diagnostic logs that are needed to find the cause. So for a user who says "my team has vanished", don't start with a cache clear. Check the Teams web app first. If the team shows up in the browser, the account and the service are fine, and the problem is local. If it doesn't, the cause is on the account or service side, and no amount of local cleanup will change that.

Microsoft's page calls the cache clear a targeted step for a small number of local client problems, not a general first step. Typical cases are a Teams app that won't start or sign in, or one that behaves oddly after an update. After clearing, restart Teams. The restart may take longer because the cache files have to be rebuilt.

## Try these steps first

Microsoft's support page [I can't reconnect to Microsoft Teams](https://support.microsoft.com/en-us/teams/troubleshooting/i-can-t-reconnect-to-microsoft-teams) lists a sequence, and the cache is only the third item:

1. Check your internet connection by opening any website in a browser.
2. Sign out and sign back in. Select your profile picture at the top right, choose **Sign out**, reopen Teams and sign in again.
3. Clear the Teams cache (steps below).
4. Uninstall and reinstall Teams.
5. If you use a VPN to reach Teams, turn it off and on again.
6. Try the web version at teams.microsoft.com. If you're using Teams on the web, turn off ad blocker extensions.
7. Restart your Wi-Fi modem.
8. Check for service incidents on Microsoft's official Microsoft 365 Status account.

For "Teams not loading" tickets, steps 1, 2, 5 and 6 are quick and cost nothing. They also tell you whether the app or the service is the problem.

## What clearing the cache removes

The same support page says clearing the cache doesn't uninstall Teams. It removes the web client cache, icons, thumbnails, local message history, display images and add-ons. The page doesn't say anything about the service side, so treat the cache as the local copy and keep in mind that you can't recover logs once they are gone. Expect a slower first launch.

Microsoft's Learn page doesn't say whether you must sign in again after clearing, so tell users it may happen. A reset of new Teams on Windows also deletes app data, including personalization settings, so a user may find their own preferences back at defaults.

## Clear the cache in new Teams on Windows

The Learn article describes two methods for new Teams.

### Method 1: reset the app

1. Type `settings` in the search box and open **Settings**.
2. Go to **Apps**, then **Installed apps**, and search for Microsoft Teams.
3. For new Microsoft Teams, select **More options** (the three dots), then **Advanced options**.
4. In the **Reset** section, select **Reset**.
5. Restart Teams.

### Method 2: delete the files

1. Quit Teams: right-click the taskbar icon and select **Quit**.
2. Press the Windows logo key + R.
3. Enter `%userprofile%\appdata\local\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams` and select **OK**.
4. Delete all files and folders in the directory.
5. Restart Teams.

Use the reset if you want the supported button. Use the file delete if you script it or can't open Settings for the app. In both cases, quit Teams first, as Microsoft's steps say.

## Clear the cache in classic Teams on Windows

Classic Teams uses a different folder. Microsoft's steps:

1. If Teams is running, right-click the taskbar icon and select **Quit**.
2. Press the Windows logo key + R.
3. Enter `%appdata%\Microsoft\Teams` and select **OK**.
4. Delete all files and folders in that directory.
5. Restart Teams.

If you're not sure which client a user has, look at the folder. A user on classic Teams has the folder under `%appdata%\Microsoft\Teams`. A user on new Teams has the MSTeams package folder under `LocalCache`.

## Clear the cache on a Mac

Quit Teams first: right-click the Dock icon and select **Quit**, or press Command-Q. Then open **Terminal** from `/Applications/Utilities`.

For classic Teams, Microsoft gives this command: `rm -r ~/Library/Application\ Support/Microsoft/Teams`.

For new Teams, Microsoft lists two commands, run one at a time with Return after each:

1. `rm -rf ~/Library/Group Containers/UBF8T346G9.com.microsoft.teams`
2. `rm -rf ~/Library/Containers/com.microsoft.teams2`

Copy the commands exactly as published. Microsoft warns that the `rm` commands are irreversible and delete folders without confirmation. The Group Containers path contains a space. If your shell stops at it, put the path in quotes, and compare against the current Learn page. Then restart Teams.

Microsoft's page does not cover Linux or virtual desktop environments, so check the documentation for your setup before you script a clean-up there.

## Which method should you pick?

Think of it as a ladder, from the lightest touch to the heaviest.

First, sign out and back in. It costs nothing and keeps everything on the PC as it is. Second, clear the cache with the method for your version. Use the Reset button for new Teams on Windows if the user is at the keyboard, because it's the path with the fewest typed commands, and remember that it also wipes personalization settings. Use the folder method if you're scripting or want to keep the app registered as it is. Third, uninstall and reinstall Teams, which Microsoft lists after the cache step. Last, if the web app also fails, stop working on the PC and look at the account or service side, such as the Microsoft 365 status account that Microsoft's guide points to.

A useful habit is to record which rung fixed the problem. If it's always the cache clear for one group of PCs, that pattern is worth investigating before you keep repeating the fix.

## After you clear the cache

Start Teams and give it time. Microsoft says the restart may take longer because the cache files have to be rebuilt, and a user who sees a blank window for a minute has not necessarily hit a new problem. Sign in if asked. Check that the problem you started with is gone, and test one meeting join and one chat message so you know the app works end to end. If the same problem comes back within days, don't clear the cache again and again. Move up the ladder to a reinstall, test the web app, and compare with a second user profile on the same PC.

## For admins: handle it without losing the evidence

When a problem hits several users, don't clear caches in bulk. Microsoft notes that clearing deletes diagnostic logs, and you want those logs while you are still looking for the cause. Collect what you need from one affected machine first. Then clear it and see if the problem goes away, which also tells you whether the cause was local at all.

If you deploy [Teams](https://www.m365.fm/entity/teams/) through Intune or a script, do not make cache clearing part of a daily or logon routine. Microsoft describes it as a targeted step for a small number of problems, and a routine that deletes the cache each time makes every start slow.

## Common mistakes

- Clearing the cache for missing chats or a missing team. Microsoft says it doesn't help.
- Deleting the folder while Teams is still running in the tray.
- Using the classic path for new Teams, or the other way round, and wondering why nothing changed.
- Running the Mac `rm` commands from the wrong folder or with a typo.
- Skipping the quick checks: connection, sign-out and sign-in, and the web app.
- Forgetting to tell the user that the first start will be slow.

## Related topics to explore

- What if a team or channel is missing? Check the Teams web app first. The cache is not the cause.
- What if Teams won't reconnect? Work through Microsoft's list: sign out, VPN, web version, modem, status page.
- What if the problem is on only one PC? Compare it with the web app and, if needed, with a second user profile.
- When should I reinstall? After the cache clear, as the fourth step on Microsoft's list.

## Next step

Before you delete anything, test the problem in the Teams web app and write down what you see. If it points to the local client, quit Teams and clear the cache with the reset or the folder method for your version. That is the sensible way to clear the Teams cache without throwing away the evidence you need.
