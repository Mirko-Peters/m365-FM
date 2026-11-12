---
title: "How to Reset OneDrive on Windows: The Command and What Happens"
summary: "How to reset OneDrive on Windows with the onedrive.exe /reset command: when to use it, what it does to your files, what to do afterward and how to unlink."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [onedrive, onedrive-sync-engine, onedrive-selective-sync]
keypoints:
  - "To reset OneDrive, press Windows + R and run %localappdata%\\Microsoft\\OneDrive\\onedrive.exe /reset, then start OneDrive again from the Start menu."
  - "Microsoft says you won't lose files or data. The reset sets all OneDrive settings back and OneDrive runs a full sync afterward."
  - "A reset disconnects all sync connections, personal and work or school. If you used selective sync, choose your folders again once the sync finishes."
  - "If Windows says it can't find the file, try the two Program Files paths that Microsoft lists. If neither works, the sync app isn't installed."
  - "Unlinking the PC is the milder alternative: it removes the account from this computer without a full settings reset."
faq:
  - q: "How do I reset OneDrive on Windows?"
    a: "Press Windows + R, enter %localappdata%\\Microsoft\\OneDrive\\onedrive.exe /reset and select OK. If Windows can't find the file, use the Program Files path from Microsoft. Then open Start, type OneDrive and start the app again. Reselect your sync folders after the sync finishes."
  - q: "Will resetting OneDrive delete my files?"
    a: "No. Microsoft states that you won't lose files or data by resetting OneDrive on your computer. The reset disconnects your sync connections, resets the OneDrive settings and starts a full sync. Your files stay in the OneDrive folder and online. Selective sync choices have to be made again."
  - q: "What is the difference between resetting OneDrive and unlinking it?"
    a: "Unlinking removes one account from this PC through Settings, Account, Unlink this PC, and you sign in again afterward. A reset runs a command that resets all OneDrive settings and disconnects every sync connection on the PC, for personal and work or school accounts, before a full sync."
---
To reset OneDrive on Windows, press **Windows + R**, enter `%localappdata%\Microsoft\OneDrive\onedrive.exe /reset` and select **OK**. Then start OneDrive again from the Start menu. A reset sets all OneDrive settings back and makes OneDrive run a full sync, and Microsoft says you won't lose files or data. This article is for Windows users and help desk staff who have already tried the simple fixes and now need the reset command and an honest description of what it does. You'll also see when unlinking is the better choice.

## When a reset is the right step

A reset is a late step, not a first one. It forces a full sync, which can take hours on a large library. Before you use it, go through the cheap checks:

- Is the sync paused? A paused icon needs one click on **Resume syncing**.
- Are you signed in? A cloud icon with a gray line through it means you're not.
- Is one file open, hidden, or blocked by its name or path? The activity center usually names it.
- Did you recently change your password or switch accounts?

Our guide to fixing a [OneDrive](https://www.m365.fm/entity/onedrive/) that isn't syncing covers these checks in order. If the client still sits on "Processing changes" or "Sync pending" after that, or settings seem damaged, Microsoft's own advice for a case like this is to reset OneDrive. Its page [Reset OneDrive](https://support.microsoft.com/en-us/onedrive/reset-onedrive) says a reset can fix sync problems.

## What a reset does

Microsoft describes four effects:

- It resets all OneDrive settings.
- It disconnects your sync connections, personal and work or school, so every account on this PC is affected.
- OneDrive runs a full sync afterward.
- It doesn't delete files or data.

Internally, Microsoft explains, the reset deletes the DAT file, stores application logs in the registry and stores settings on disk. When OneDrive restarts, it checks the registry to confirm the reset happened, loads your settings and rebuilds the DAT file. That file belongs to the local state of the [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/), and rebuilding it is the point of the reset.

One consequence to plan for: because OneDrive runs a full sync, it compares every file again. Expect network and disk activity. Don't start a reset on a laptop with a weak connection right before a meeting.

## Reset the OneDrive sync app on Windows

The steps below follow Microsoft's page.

1. Press the **Windows key + R** to open the Run dialog.
2. Enter `wsreset.exe` and select **OK**. A Command Prompt window may flash briefly and the Microsoft Store opens. You can ignore both. If OneDrive still doesn't sync, continue.
3. Open the Run dialog again.
4. Enter `%localappdata%\Microsoft\OneDrive\onedrive.exe /reset` and select **OK**.
5. If Windows shows a "Windows cannot find" message, enter `C:\Program Files\Microsoft OneDrive\onedrive.exe /reset` instead.
6. If you still get that message, enter `C:\Program Files (x86)\Microsoft OneDrive\onedrive.exe /reset`.
7. Restart OneDrive: select **Start**, type OneDrive and open the OneDrive desktop app.

If none of the three paths works, Microsoft says the OneDrive sync app isn't installed on your computer, so check which OneDrive app you have. The page links to a "Find the right OneDrive app" article for that.

The command doesn't show a confirmation. Microsoft's page doesn't say what the OneDrive icon does during a reset or how long it takes, so don't rely on the icon. Give OneDrive a few minutes, then start it from the Start menu if it hasn't come back.

### Reset the Microsoft Store version

Some PCs have OneDrive as a Store app. Microsoft's steps for that case are short: select **Start**, enter `apps:onedrive`, select **App settings**, scroll down and select **Reset**. Use this only if you know your PC runs the Store app, and use the sync app steps above in all other cases.

### Mac and mobile

Microsoft's page has tabs for macOS, Android and iOS. I couldn't read the steps for those platforms in the text available to me, so I'm not guessing them here. On a Mac, the documented milder alternative is to unlink the Mac from the account and sign in again (see below).

## After the reset: set up the sync again

When OneDrive starts again, it asks you to sign in or reconnects, depending on the account. Then:

1. Let the full sync finish. Don't pause it midway.
2. If you used selective sync before, select your folders again. Microsoft says to do this for both your personal and your work or school account. Go to the OneDrive cloud icon, the gear, **Settings**, the **Account** tab and **Choose folders**. Our page on [selective sync](https://www.m365.fm/entity/onedrive-selective-sync/) explains the limits.
3. Check your backup settings. Open **Settings** and the **Sync and backup** tab to see whether Desktop, Documents and Pictures are still backed up.
4. Open the activity center and check that no file is flagged.

If you see a lot of "sync pending" files right after a reset, that's normal while OneDrive compares everything. Wait before you troubleshoot again.

## What a reset doesn't fix

A reset rebuilds the local state. It doesn't change the rules that the files themselves have to follow, so some problems come back right after the full sync. Check these if they do:

- **Names and characters.** Microsoft doesn't allow `" * : < > ? / \ |` in file and folder names, and a name can't start or end with a space. Names such as `CON`, `PRN`, `AUX`, `NUL` and `desktop.ini` are reserved.
- **Path length.** OneDrive and SharePoint in the cloud allow 400 characters including the file name. Windows Office desktop apps open files only up to 256 characters, and File Explorer works with 260. A file can sync and still fail to open from a deep folder.
- **File size.** The sync limit for a single file is 250 GB.
- **Files that other apps keep open.** Outlook data files (PST and OST) are the usual suspects. Move them out of OneDrive.
- **Blocked accounts.** A cloud icon with a red "no entry" circle means the account is blocked. That isn't a client problem, and Microsoft points to guidance for a frozen OneDrive account.

If the same file fails again after a reset, the file is the problem, not the client. Rename it, shorten its path or move it, and watch the activity center.

## A short plan for help desk staff

When a user says "OneDrive is broken," a fixed order saves time and avoids the unnecessary full sync:

1. Look at the icon and read the activity center message.
2. Resume sync if it's paused, and sign in if the icon has a gray line.
3. Close the apps that hold the named file open.
4. Check the file name and path length.
5. If several accounts or all folders misbehave, run the reset and tell the user that the first sync will take a while.
6. After the reset, ask the user to select their folders again and to confirm that the files they need are present.

Write down the folders the user had selected before the reset. Microsoft's page says to reselect them, and users rarely remember which ones they had.

## The milder alternative: unlink and link again

If you only need to reconnect one account, unlink it. This doesn't reset all settings.

1. Select the OneDrive cloud icon in the notification area.
2. Select the gear icon (Help and Settings), then **Settings**.
3. Open the **Account** tab.
4. Select **Unlink this PC**, then **Unlink account**.
5. Open OneDrive again and sign in.

Microsoft's page [How to remove an account in OneDrive](https://support.microsoft.com/en-us/onedrive/how-to-remove-an-account-in-onedrive) lists what happens to your files. They aren't deleted, and you can reach them on OneDrive on the web. Files marked "Available on this device" stay in your computer's OneDrive folders. Files marked "Available when online" are accessible only through OneDrive on the web. On iOS and Android, you tap your profile picture, then **Settings**, the arrow next to the account and **Sign out**.

When to prefer unlinking: one account is stuck or shows "You're syncing a different account," and the other accounts work. When to prefer the reset: several accounts misbehave, or settings look damaged.

## Common mistakes

- **Resetting before checking for a paused or signed-out client.** That costs you a full sync for a one-click fix.
- **Closing the Run dialog without trying the other paths.** The sync app might live in Program Files on your PC. Try all three in order.
- **Forgetting to reselect folders.** A selective sync setup is gone after the reset, so folders you cleared come back and download.
- **Resetting the Store app when you use the sync app.** They are different things.
- **Expecting an on-screen result.** There's no message after the command. Start OneDrive again from the Start menu.
- **Doing it on a limited connection.** The full sync uses bandwidth.

## Related topics to explore

- **Turning OneDrive off for good.** Pausing, quitting, unlinking and uninstalling do different things. Read the guide on how to disable OneDrive if a reset isn't what you want.
- **Syncing only the folders you need.** Choose folders and Files On-Demand reduce disk use and make later syncs faster.
- **Understanding error messages.** Microsoft's page "What do the OneDrive error codes mean?" explains messages such as "You're syncing a different account."
- **Reinstalling the sync app.** Microsoft has a page called "Reinstall OneDrive" for the case where the reset command finds no app.
- **Moving the OneDrive folder.** Microsoft has a page on changing the location of your OneDrive folder.

## Next step

Do the quick checks first: pause, sign-in, open files and file names. If they don't help, run the reset once and write down which folders you synced before, so you can select them again. That is all you need to reset OneDrive safely.
