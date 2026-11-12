---
title: "How to Disable OneDrive on Windows: Pause, Unlink, Uninstall"
summary: "How to disable OneDrive on Windows: pause, quit, unlink or stop folder backup first, then hide or uninstall it, plus the policy admins use to turn it off."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [onedrive, onedrive-sync-engine]
keypoints:
  - "To disable OneDrive on a PC, open the OneDrive icon, go to Settings > Account and select Unlink this PC. Your files stay at OneDrive.com."
  - "Pause syncing for 2, 8 or 24 hours if you only need a break. Sync resumes on its own when the time is up."
  - "If OneDrive backs up Desktop, Documents or Pictures, turn that backup off first and choose where the files should stay."
  - "Windows lets you uninstall Microsoft OneDrive from the list of installed apps. On Windows versions where it's built in, you can hide it instead."
  - "Admins can block OneDrive file sync on managed Windows PCs with the policy Prevent the usage of OneDrive for file storage."
faq:
  - q: "How do I turn off OneDrive without losing files?"
    a: "Unlink the PC. Select the OneDrive cloud icon, then the gear, choose Settings, open the Account tab and select Unlink this PC. Microsoft says unlinking doesn't delete your files, and you can still reach them at OneDrive.com. Check your folders first if Desktop and Documents were backed up."
  - q: "Can I uninstall OneDrive on Windows 11?"
    a: "Yes. Open Settings, go to the list of installed apps, find Microsoft OneDrive and select Uninstall. Microsoft says uninstalling doesn't delete your files and you can still reach them at OneDrive.com. On Windows versions where OneDrive is built in and can't be removed, Microsoft's alternative is to hide it."
  - q: "How do I stop OneDrive from backing up Desktop and Documents?"
    a: "Open OneDrive Settings, go to Sync and backup and select Manage backup. Turn off the toggle for the folder, then choose to keep the files only in OneDrive or only on your PC. Open or cloud-only files may need to be closed or downloaded first."
---
To disable OneDrive on a Windows PC, click the OneDrive cloud icon in the notification area, select the gear icon and **Settings**, open the **Account** tab and select **Unlink this PC**. That stops the sync on this computer and leaves your files online. This article is for Windows users who are tired of the sync, and for admins who get the question "can we just switch this off?" You'll find the options from mildest to strongest: pause, quit, stop folder backup, unlink, hide, uninstall and, for managed PCs, a policy.

## Pick the right option first

"Disable OneDrive" can mean five different things. The right choice depends on what you want to happen to your files:

- **I need a break.** Pause syncing. Nothing changes except that sync stops for a while.
- **I don't want OneDrive to start with Windows.** Quit it and unlink the PC.
- **I want Desktop and Documents to stay on my PC only.** Stop folder backup before you do anything else.
- **I want it gone from File Explorer.** Unlink, then hide the folder, or uninstall the app.
- **I manage many PCs and want it off for everyone.** Use the policy described at the end.

Microsoft's own page [Turn off, disable, or uninstall OneDrive](https://support.microsoft.com/en-us/onedrive/turn-off-disable-or-uninstall-onedrive) says the same thing about the easiest way: unlink the computer. You don't lose files or data, and you can still reach them at OneDrive.com.

## Pause syncing for a few hours

This is the right choice if OneDrive slows down a video call or a big upload.

1. Right-click the OneDrive icon in the taskbar (on a Mac, Control-click the icon in the menu bar).
2. Select **Pause syncing** and pick 2, 8 or 24 hours.
3. Check that the OneDrive cloud icon in the notification area shows Paused.

Sync resumes automatically when the time is over. To resume sooner, select the paused icon and use the pause button in the activity center. OneDrive also pauses by itself when your PC is in battery saver mode or on a metered network. If you have both a personal OneDrive and OneDrive for work or school, you can pause and resume each one separately.

To exit the app for the current session, open the same menu and select **Pause syncing**, then **Quit OneDrive**. You can start it again from the Start menu (press the Windows key, type OneDrive and open the app), so quitting isn't a permanent fix.

## Stop folder backup before you unlink

This step catches people out. If OneDrive was set up to protect your Desktop, Documents and Pictures folders, the files in those folders are in OneDrive. Unlinking without a plan can leave you wondering where your desktop went. Do this first:

1. Click the OneDrive cloud icon, then the gear icon, and select **Settings**.
2. Open the **Sync and backup** tab.
3. Select **Manage backup**.
4. Turn off the toggle for the folder.
5. Choose what happens to the files: keep them **only in OneDrive** (they are removed from your computer) or **only on my PC** (they are removed from OneDrive).

Microsoft lists three situations in which stopping can fail:

- **Cloud-only files.** Some files can't be moved until you download them. Set them to **Always keep on this device** first.
- **OneNote notebooks.** Stopping backup fails because notebooks live in the cloud and can't be moved to your computer.
- **Open files.** Save and close them, then try again.

If you want everything back on the PC, choose **only on my PC**, make sure the files finish moving, and only then unlink. Microsoft's page [Back up your folders with OneDrive](https://support.microsoft.com/en-us/office/back-up-your-folders-with-onedrive-d61a7930-a6fb-4b95-b28a-6552e77c3057) has the full list of limits.

## Unlink this PC

Unlinking removes the connection between this computer and your account. It's the cleanest way to turn OneDrive off without uninstalling anything.

1. Click the OneDrive cloud icon in the notification area.
2. Click the gear icon (Help and Settings) and choose **Settings**.
3. Open the **Account** tab.
4. Select **Unlink this PC**, then **Unlink account**.

On a Mac, the equivalent is the menu bar icon, **Preferences**, the **Account** tab and **Unlink this Mac**. Microsoft's page treats Microsoft accounts and work or school accounts alike here and doesn't describe separate steps for each.

What happens to your files? Microsoft says you won't lose files or data by unlinking, and you can still reach them at OneDrive.com. The sync stops, so changes you make on the PC no longer reach the cloud. If you later delete a file from the local OneDrive folder, it goes to the Recycle Bin (Mac: Trash), and deleting on OneDrive.com sends it to the OneDrive recycle bin. Because the two copies no longer talk to each other, you'd have two diverging sets of files if you keep editing both. Pick one place to work.

Before you unlink a work or school account, ask your IT team. They might rely on the sync client for backup or for shared libraries.

## Stop syncing only some folders

Sometimes "disable OneDrive" really means "stop copying my 80 GB photo folder onto this laptop". For that, don't unlink. Choose the folders instead:

1. Select the OneDrive cloud icon, then the gear and **Settings**.
2. Open the **Account** tab.
3. Select **Choose folders**.
4. Clear the checkbox for each folder you want to keep online only, then select **OK**.

The folder is removed from your computer and stays in OneDrive online. Microsoft's page [Choose which OneDrive folders you want to sync](https://support.microsoft.com/en-us/onedrive/choose-which-onedrive-folders-you-want-to-sync-on-windows-or-macos) adds two limits: you can only pick folders that are already in your OneDrive, and on Windows you can't clear Documents, Desktop, Pictures or the Personal Vault. The web and mobile apps always show all your folders.

## Hide or uninstall OneDrive

If you want OneDrive out of sight, you have two official routes.

### Uninstall the app

On Windows 10 and Windows 11, Microsoft describes it like this:

1. Select **Start**, type "Programs" and select **Add or remove programs** (or open the installed apps list in **Settings**).
2. Find **Microsoft OneDrive** and select **Uninstall**.
3. Enter an administrator password or confirm if prompted.

Uninstalling doesn't delete your files, and you can still reach them at OneDrive.com. On a Mac, you drag the OneDrive app to the Trash. On Android and iOS you remove the app as you do any other. If you change your mind, Microsoft has a separate page on reinstalling OneDrive.

### Hide it where it can't be uninstalled

Microsoft notes that OneDrive is built into some Windows versions and can't be uninstalled on them. In that case it suggests hiding it and making sure it doesn't sync:

1. Unlink the PC as described above.
2. In File Explorer, right-click **OneDrive** and choose **Properties**.
3. On the **General** tab, next to **Attributes**, check **Hidden**.
4. Click the OneDrive gear icon again and choose **Quit OneDrive**. That removes the notification-area icon.

The folder is hidden, not deleted. I couldn't find a Microsoft page that says whether OneDrive stays hidden or uninstalled after every Windows feature update, so check again after the next one. On a managed PC, use the policy below.

## For admins: block OneDrive with a policy

On managed PCs, don't ask 200 people to click through the steps. Windows has a policy for this. Microsoft documents it as **Prevent the usage of OneDrive for file storage** in Group Policy, under **Computer Configuration** > **Windows Components** > **OneDrive**. In Intune and other MDM tools, the setting is `System/DisableOneDriveFileSync`.

When you enable it, Microsoft says:

- Users can't access OneDrive from the OneDrive app and the file picker.
- Packaged Microsoft Store apps can't use OneDrive through the WinRT API.
- OneDrive doesn't appear in the navigation pane in File Explorer.
- OneDrive files aren't kept in sync with the cloud.
- Users can't automatically upload photos and videos from the camera roll folder.

The policy applies to the device (not per user) and to Windows 10 version 1703 and later in the Pro, Enterprise, Education and IoT Enterprise editions. Note the effect: it blocks sync and access, it doesn't move data. Plan the files of users first. If you back up Desktop and Documents with OneDrive, stop that backup and let the files return to local folders before you enable the policy, and tell people what's going on. Our overview of [OneDrive](https://www.m365.fm/entity/onedrive/) explains what lives where in a tenant.

## Common mistakes

- **Unlinking before stopping folder backup.** Your Desktop and Documents might be in OneDrive. Stop backup first and choose where the files stay.
- **Dragging the OneDrive folder to the Recycle Bin.** Deleting files from the local folder deletes them in the cloud as long as sync is on. Unlink first.
- **Thinking quitting is disabling.** Quit OneDrive ends the session. It starts again later.
- **Hiding and forgetting.** A hidden folder that is still synced keeps uploading. Unlink first.
- **Switching it off on a work PC without asking.** Your admin might depend on it for backup or compliance.
- **Looking for files in the wrong place.** After unlinking, the online copy is at OneDrive.com. The local copy stays in the folder.

## Related topics to explore

- **Sync problems instead of switching it off.** If OneDrive annoys you because it's stuck, read about the [OneDrive sync engine](https://www.m365.fm/entity/onedrive-sync-engine/) and try a reset before you give up on it.
- **Saving disk space.** Files On-Demand keeps files online until you open them, which is often what people really want.
- **Backing up your PC without OneDrive.** Windows Backup is a separate feature with its own page on Microsoft Support.
- **Deleting your whole OneDrive.** That is a different step from disabling the app on one PC, and it's covered on its own Microsoft page.
- **Cancelling a subscription.** Storage plans are managed in your Microsoft account, not in the sync app.

## Next step

Decide whether you want a break, a clean unlink or a managed block. For most people at home, the answer to how to disable OneDrive is to stop folder backup, unlink the PC and, if you like, uninstall the app. Do a test with one folder before you touch the rest.
