---
title: "OneDrive Not Syncing? Fixes for Stuck, Pending and Paused Sync"
summary: "OneDrive not syncing? Read the icon first, then check pause, sign-in, open files, names, path length and big files before you reset OneDrive as a last step."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [onedrive, onedrive-sync-engine, onedrive-selective-sync]
keypoints:
  - "Start with the OneDrive icon in the notification area. A paused icon, a gray line or a red cross each point to a different fix."
  - "A file that is open in another app, a hidden or temporary file, or a huge Outlook data file are common reasons for Processing changes and Sync pending."
  - "Names with characters such as * : < > ? / \\ | and paths that are too long can't sync. The cloud limit is 400 characters for the full path."
  - "Check the simple things in order: paused, signed in, internet connection, open files, then the file itself."
  - "Reset OneDrive only if nothing else works. Microsoft says a reset doesn't delete files, but it disconnects all sync connections and starts a full sync."
faq:
  - q: "Why is OneDrive stuck on Processing changes?"
    a: "Microsoft lists a few causes: a OneDrive file is open, many files were added, a very large file was added, you aren't signed in, or you just signed in or updated your PC. Close open files, give a large upload time and sign in again if OneDrive asks. Move Outlook data files out of OneDrive."
  - q: "What does the paused icon in OneDrive mean?"
    a: "Files aren't syncing right now. Select the OneDrive icon in the notification area and choose Resume syncing. OneDrive also pauses on its own when your PC is in battery saver mode or on a metered network, so check those two first if it keeps pausing."
  - q: "Does resetting OneDrive delete my files?"
    a: "No. Microsoft says you won't lose files or data by resetting OneDrive on your computer. A reset does disconnect all sync connections for personal and work or school accounts, then OneDrive performs a full sync. If you used selective sync, choose your folders again afterward."
---
When [OneDrive](https://www.m365.fm/entity/onedrive/) isn't syncing, look at the OneDrive icon in the notification area first, because its state tells you where to start. A paused icon needs one click, a gray line means you're not signed in, a red cross means one file or folder is blocking, and the rest is a matter of checking open files, names, path length and file size in that order. This article is for Windows users and help desk staff who need a fixed order of checks instead of ten forum tips. If nothing works, the last section shows the official reset.

## Read the icon before you change anything

Microsoft's page [What do the OneDrive icons mean?](https://support.microsoft.com/onedrive/what-do-the-onedrive-icons-mean) describes the states. These are the ones that matter for a stuck sync:

- **Cloud with a paused symbol.** Files aren't syncing. Select the icon and choose **Resume syncing**.
- **Cloud with a gray line through it.** You're not signed in, or setup isn't finished. Press the Windows key, search for OneDrive and open the desktop app. If you see "You're already syncing a personal OneDrive on this computer," unlink and link your account again.
- **Cloud with a red circle and white cross.** A file or folder can't be synced. Select the OneDrive icon for details.
- **Cloud with a yellow warning triangle or a brown exclamation circle.** The account needs attention. The warning is in the activity center.
- **Cloud with a red "no entry" circle.** The account is blocked.

Click the icon and read the message in the activity center. It often names the file. Write down the file name, because the next steps depend on it.

## Check the basics in this order

Most "not syncing" calls end here.

1. **Is sync paused?** You can pause for 2, 8 or 24 hours, and the sync resumes by itself afterward. OneDrive also pauses on its own when your PC is in battery saver mode or on a metered network. Charge the laptop or switch networks, then resume.
2. **Are you signed in?** If you changed your password, OneDrive asks you to sign in again. Do it, and wait a minute.
3. **Is the internet connection fine?** Microsoft suggests running an internet speed test when a large number of changes is slow to upload.
4. **Is the right account linked?** An error such as "You're syncing a different account" can show up after a password change on your Microsoft account.
5. **Is a file open?** A file that's open in another app can't be synced until you close it.

If you have both a personal OneDrive and one for work or school, they pause and resume separately. Check both clouds in the notification area.

## "Processing changes" that never ends

The page [Troubleshoot OneDrive sync issues: stuck on Processing changes](https://support.microsoft.com/onedrive/troubleshoot-onedrive-sync-issues-stuck-on-processing-changes) lists the causes and what to do:

- **A OneDrive file is open.** Close it after you finish editing.
- **Many files were added.** No action is needed. OneDrive uploads everything, which takes longer on a slow connection.
- **A very large file was added.** This includes compressed archives, long videos and Outlook data files (PST or OST). Move email data files out of your OneDrive folders, or don't sync folders with large videos. Log files named "aria-debug" can be deleted safely.
- **You aren't signed in.** Sign in when asked.
- **You just signed in or updated your computer.** No action is needed. OneDrive catches up, which can take a while after many changes.

For Outlook data files, one more detail from Microsoft: you can't remove them from sync when you use Files On-Demand, because Outlook needs them on your PC. Move them out of the OneDrive folder instead. If you suspect an unknown or hidden file, click the OneDrive icon to see which files are open, syncing and recently synced. Our overview of the [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/) explains how the client tracks these changes.

## "Sync pending" on one folder

A folder that says **Sync pending** for hours usually has one odd item inside. Microsoft's page "OneDrive is stuck on Sync pending" names four causes and a fix for each:

- **A hidden file.** In File Explorer, open **View** and check **Hidden items**, then find the file that causes the error.
- **An empty folder.** Create a new folder, copy all files from the stuck folder into it and delete the original "Sync pending" folder.
- **A temporary (.TMP) file.** A program creates these to hold data and they can get stuck. Upload the file manually at onedrive.com, rename it with a new extension, move it out of OneDrive, or delete it if you're sure it's no longer in use. If you can't rename it, the file is in use, so restart the computer and try again.
- **The Office Document Cache.** If the taskbar icon stays on "Sync pending," Microsoft says to delete your Office Document Cache. It links to a separate topic for the steps.

Two cautions from the page: moving, renaming or deleting a file may stop it from opening in its original program, and deleting a .TMP file that's still in use can cost you unsaved work. Close the app first.

## "This file can't be synced"

The red cross usually comes with this message. Microsoft's page [OneDrive shows "This file can't be synced"](https://support.microsoft.com/office/onedrive-shows-this-file-can-t-be-synced-54f6e0d2-41d3-496a-826e-964e59333d7e) lists three causes:

1. **Another app is using the file.** Save your work and close the app. OneDrive syncs the file when it's closed.
2. **OneDrive doesn't have permission to access the file.** In File Explorer, right-click the file, select **Properties**, then the **Security** tab. Select your name under **Groups or user names** and confirm that **Read** and **Write** are checked under **Allow**. If not, select **Edit** and add them.
3. **Sync is stuck on the file.** Microsoft's section is titled "Move the file out of OneDrive to restart sync." Close OneDrive from the cloud icon. In File Explorer, move the affected file outside your OneDrive folder, for example to the C: drive. Start OneDrive again from the Start menu, wait until it shows **Up to date** and copy the file back.

## Names, paths and sizes that block sync

If a specific file or folder keeps failing, check the rules. They come from Microsoft's pages "Restrictions and limitations in OneDrive and SharePoint" and "What are the file path length limits?".

- **Characters that aren't allowed:** `"` `*` `:` `<` `>` `?` `/` `\` `|`. A name can't start or end with a space.
- **Reserved names:** among others `CON`, `PRN`, `AUX`, `NUL`, `desktop.ini`, `.lock` and anything starting with `~$`.
- **File size:** the sync limit for a single file is 250 GB.
- **Path length:** OneDrive and SharePoint in the cloud allow 400 characters including the file name. For the local sync, Microsoft counts up to 520 characters: a path of up to 400 plus the OneDrive root folder of up to 120. Windows Office desktop apps open files only up to about 256 characters, and File Explorer works with 260. That is why a file can exist online and still not open or sync on the PC.
- **Items:** Microsoft recommends no more than 300,000 items in total across your cloud storage for standard sync. Performance can suffer above it, even if you don't sync everything.
- **Temporary files:** `.tmp` files aren't synced, and neither are local system files like `desktop.ini`.

For long paths, the fix is to shorten names, reduce the nesting or rename the item on the OneDrive website if File Explorer refuses. Admins can shorten the local OneDrive root folder with a Group Policy.

## Folder backup and folder choices

Sometimes the sync works as set up and the surprise is in the setup. Two checks:

- **Choose folders.** In OneDrive **Settings**, **Account**, **Choose folders**: a folder you cleared there is online only and doesn't appear on this PC. Microsoft says custom sync settings are unique to each computer and each account.
- **Backup of Desktop, Documents and Pictures.** When you turn a folder off in the backup settings, OneDrive asks whether to keep the files only in OneDrive or only on the PC. If some files are cloud-only, Microsoft says to download them first with **Always keep on this device**. OneNote notebooks can't be moved to the PC, because they are cloud-based files.

The error "The file or folder already exists on OneDrive" shows up after you deselect a synced folder. Microsoft says you can delete the folder from the PC, because its copy stays online, or move it outside the OneDrive folder, which deletes it from OneDrive.com.

## The last resort: reset OneDrive

If these steps didn't help, use the reset. Microsoft states that you won't lose files or data. A reset resets all OneDrive settings, disconnects all sync connections for personal and for work or school accounts, and OneDrive performs a full sync afterward. Use it from a quiet moment, not before a deadline.

1. Press **Windows + R**, enter `wsreset.exe` and select **OK**. This clears the Microsoft Store cache. Ignore the short Command Prompt window.
2. Press **Windows + R** again, enter `%localappdata%\Microsoft\OneDrive\onedrive.exe /reset` and select **OK**.
3. If Windows says it can't find the file, try `C:\Program Files\Microsoft OneDrive\onedrive.exe /reset`, then `C:\Program Files (x86)\Microsoft OneDrive\onedrive.exe /reset`.
4. Start OneDrive again: select **Start**, type OneDrive and open the desktop app.
5. If you used selective sync, choose your folders again after the sync is complete.

Microsoft's page [Reset OneDrive](https://support.microsoft.com/office/reset-onedrive-34701e00-bf7b-42db-b960-84905399050c) also describes resetting the Microsoft Store version of OneDrive (**Start**, enter `apps:onedrive`, **App settings**, **Reset**). It doesn't say how long a reset takes, so give a large library time.

## Common mistakes

- **Resetting first.** A reset forces a full sync. If the cause is one open file, you've created hours of work for nothing.
- **Deleting files to "clean up".** Deleting from the local folder sends the file to the Recycle Bin and removes it online as well. Move files out instead.
- **Ignoring the activity center.** It usually names the blocking file.
- **Syncing Outlook data files.** PST and OST files are large, change constantly and cause Processing changes.
- **Testing with a long path.** Paths near 260 characters work online and fail in Office on the PC.
- **Waiting for a stuck icon without checking pause.** Battery saver mode and metered networks pause OneDrive automatically.

## Related topics to explore

- **Resetting and unlinking.** If you need a clean start but not a full reset, unlinking the PC and signing in again is a milder step.
- **Which folders sync.** Selective sync and Files On-Demand decide what is on the disk. Read about [selective sync in OneDrive](https://www.m365.fm/entity/onedrive-selective-sync/) if the folder isn't there at all.
- **SharePoint library sync.** Microsoft publishes a separate page titled "Fix SharePoint Online sync problems" for libraries.
- **Error messages.** Microsoft's page "What do the OneDrive error codes mean?" covers sign-in, subscription and Files On-Demand messages.
- **Mac.** Microsoft has a separate page titled "Fix OneDrive sync problems on Mac". Use it instead of the Windows steps here.

## Next step

Open the activity center now, read what OneDrive says about the first stuck file and apply the matching fix from this page. If OneDrive still isn't syncing after you have checked pause, sign-in, open files, names and path length, run the reset once and select your folders again afterward.

## Sources

- [What do the OneDrive icons mean? (Microsoft Support)](https://support.microsoft.com/onedrive/what-do-the-onedrive-icons-mean)
- [Pause and resume sync in OneDrive (Microsoft Support)](https://support.microsoft.com/office/how-to-pause-and-resume-sync-in-onedrive-2152bfa4-a2a5-4d3a-ace8-92912fb4421e)
- [Troubleshoot OneDrive sync issues: stuck on Processing changes (Microsoft Support)](https://support.microsoft.com/onedrive/troubleshoot-onedrive-sync-issues-stuck-on-processing-changes)
- [OneDrive is stuck on Sync pending (Microsoft Support)](https://support.microsoft.com/office/onedrive-is-stuck-on-sync-pending-4aad2094-7cf2-4b04-9451-10f16144376c)
- [OneDrive shows This file can't be synced (Microsoft Support)](https://support.microsoft.com/office/onedrive-shows-this-file-can-t-be-synced-54f6e0d2-41d3-496a-826e-964e59333d7e)
- [Restrictions and limitations in OneDrive and SharePoint (Microsoft Support)](https://support.microsoft.com/office/restrictions-and-limitations-in-onedrive-and-sharepoint-64883a5d-228e-48f5-b3d2-eb39e07630fa)
- [What are the file path length limits? (Microsoft Support)](https://support.microsoft.com/onedrive/what-are-file-path-length-limits)
- [The file or folder already exists in OneDrive (Microsoft Support)](https://support.microsoft.com/office/the-file-or-folder-already-exists-in-onedrive-7b8044ad-438d-41db-bbbf-4f66b8890408)
- [What do the OneDrive error codes mean? (Microsoft Support)](https://support.microsoft.com/onedrive/what-do-the-onedrive-error-codes-mean)
- [Reset OneDrive (Microsoft Support)](https://support.microsoft.com/office/reset-onedrive-34701e00-bf7b-42db-b960-84905399050c)
