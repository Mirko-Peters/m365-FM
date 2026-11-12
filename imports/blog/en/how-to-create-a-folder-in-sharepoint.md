---
title: "How to Create a Folder in SharePoint: Steps, Rules and Tips"
summary: "How to create a folder in SharePoint: use + New, Folder in a document library, name it, then rename, move and share it. Plus fixes when New Folder is missing."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [sharepoint, sharepoint-document-libraries]
keypoints:
  - "Open the document library, select + New, then Folder, type a name in the Create a folder box and select Create."
  - "If Folder isn't on the + New menu, a library owner can turn it on under Library settings, Advanced settings, Make New Folder command available."
  - "Rename a folder from the ellipsis next to it. Move or copy files and folders with Move to and Copy to on the command bar."
  - "Names can't contain characters such as * : < > ? / \\ | and can't start or end with a space. Full paths in SharePoint are limited to 400 characters."
  - "Folders work best together with views. Microsoft says that for a large library, a combination of views and folders might work best."
faq:
  - q: "How do I create a folder in a SharePoint document library?"
    a: "Open the library, select + New on the menu bar and choose Folder. In the Create a folder dialog box, enter a name and select Create. If you don't see the new folder, refresh your browser. You can then add files or create subfolders inside it."
  - q: "Why is there no New Folder option in my SharePoint library?"
    a: "The Folder command may have been turned off. A library owner or a user with design permissions can turn it on: select Settings, Library settings, Advanced settings, and set Make New Folder command available to Yes. Then select OK. If you can't find the setting, ask your administrator."
  - q: "Can I create a folder in SharePoint from my computer?"
    a: "Yes. Sync the library with the OneDrive sync app and it appears in File Explorer under your organization's name. A folder you create there syncs back to the library, as the sync is two-way. You can also drag folders into the browser view of a library."
---
To create a folder in [SharePoint](https://www.m365.fm/entity/sharepoint/), open the document library, select **+ New** on the menu bar, choose **Folder**, type a name in the **Create a folder** box and select **Create**. If you don't see the new folder, refresh your browser. This article is for SharePoint users who want a clear answer without reading a manual, and it covers the whole life of a folder: create it, name it, rename it, move files into it and share it. It also explains what to do when the **Folder** command is missing and when a view is a better tool than another level of folders.

## Create a folder in a document library

These are the steps for the modern SharePoint experience, as Microsoft describes them in its page [Create a folder in a document library](https://support.microsoft.com/en-us/sharepoint/documents-and-library/create-a-folder-in-a-document-library).

1. Go to the SharePoint site and open the document library where you want the folder.
2. On the menu bar, select **+ New**, then select **Folder**.
3. In the **Create a folder** dialog box, enter a name in the **Name** box, then select **Create**.
4. If you don't see the new folder, refresh your browser.

After you create a folder, you can add files to it or create subfolders inside it. Open the folder, and the same **+ New** menu is there. You can also drag files into it, because a document library supports drag and drop for adding files and moving them between folders.

If your screen looks different from these steps, your SharePoint administrator might have set the Classic experience on the library. In that case, open the library, select the **Files** tab on the ribbon and, in the **New** group, select **New Folder**. The dialog is the same: enter a name and select **Create**.

### Where to click for a SharePoint list

A list is not a library. Microsoft has a separate page called "Create a folder in a list", which I haven't reproduced here. If you're in a document library, use the steps above. If you're in a list and can't find a folder command, ask the list owner.

## Rename a folder

To rename a folder later, select the ellipsis (**...**) next to the folder name, select **Rename**, enter the new name in the **Rename** dialog box and select **Update**. In the Classic dialog the button is **Save**. A rename doesn't move files. Keep in mind that a path is made of all folder names, so renaming a top-level folder changes the address of every file inside it. Links people saved earlier might not work afterward. Microsoft's page doesn't say how links behave after a rename, so test one link before you rename a folder that many people use.

## When New Folder is missing

Folders are on by default, so a missing command means someone turned it off. A library owner or a user with design permissions can turn it back on:

1. Open the library.
2. Select **Settings** (the gear icon), then **Library settings**.
3. Select **Advanced settings**.
4. In the **Folder** section, for **Make "New Folder" command available**, select **Yes**.
5. Select **OK** and return to the library.

In the Classic experience the path is the **Library** tab, **Library Settings**, **Advanced settings**. If you can't find a command, button or link, Microsoft's advice is to contact your admin, because designers can change a site's appearance and navigation significantly.

Our overview of [SharePoint document libraries](https://www.m365.fm/entity/sharepoint-document-libraries/) explains what a library is, and why one site can have several.

## Name folders so they keep working

A folder name is also part of every file path below it. Two sets of limits matter, and they come from Microsoft's pages on restrictions and path lengths:

- **Characters.** A name can't contain `" * : < > ? / \ |`. It can't start or end with a space. Some names are reserved, for example `CON`, `PRN`, `AUX`, `NUL` and `desktop.ini`.
- **Path length.** OneDrive and SharePoint in the cloud allow 400 characters for the full path, including the file name. Windows Office desktop apps open files only up to 256 characters, and File Explorer works with 260. A path that is fine online can fail to open from a synced folder.

So keep folder names short and the nesting shallow. Microsoft's advice for long paths is to shorten names, reduce the number of levels and keep frequently used files one or two levels from the root. A name such as `2026 Projects` beats `Final_Project_Documents_for_Review_Version_2_Approved`.

A simple pattern works for many teams: a few top-level folders that are stable (by department, client or year) and no more than three levels below. Everything else, such as status, owner or type, belongs in columns.

## Move, copy and organize what you have

You don't have to create the folder first and fill it by hand. Select files in the library and use the command bar. Microsoft's page [Move or copy files in SharePoint](https://support.microsoft.com/en-us/sharepoint/libraries/move-or-copy-files-in-sharepoint) describes it:

1. Select the files or folders you want to move or copy.
2. On the command bar, select **Move to** or **Copy to**. If you don't see them, select the **More** (ellipsis) icon first.
3. Pick a destination in the current library, in OneDrive or on another SharePoint site, then select **Move to** or **Copy to**.
4. To use a new folder, select the **new folder** icon in the top right corner, enter a name and select **Create**. Then select that folder and choose **Move to** or **Copy to**.

Some details save you from surprises. **Move to** keeps the document's version history, while **Copy to** copies only the latest version. A moved file stays in the source until the move finishes, then goes to the source site's Recycle Bin. Only properties that the destination supports are kept, and managed metadata values aren't retained. Microsoft doesn't recommend moving OneNote notebooks outside the OneNote app. **Move to** isn't available in the Site Pages library.

## Share a folder

Share the folder, not each file. Microsoft's page [Share SharePoint files or folders](https://support.microsoft.com/en-us/sharepoint/sharepoint-sharing-and-permissions/share-sharepoint-files-or-folders) explains it. You can share only one item at a time, so put multiple items in a folder and share that folder.

1. In the library, select the folder's circle icon.
2. Select the **Share** icon at the top of the page.
3. Choose **Share with specific people** or **Copy link**.
4. For specific people, enter names or email addresses, use the pencil icon to set **Can edit**, **Can view** or **Can't download**, add a message and select **Send**.
5. For a link, select the gear next to **Copy Link**, choose the link type and under **More settings** the permission, then select **Apply** and **Copy link**.

The link types are **Anyone**, **People in your organization with the link**, **People with existing access** and **People you choose**. Microsoft recommends avoiding **Anyone** links unless necessary. **Can edit** is on by default, and editors can copy, move, edit, rename, share and delete items in the folder. Your administrator may grey out some options. One note from the page: sharing from the modern experience breaks inheritance at the list or library level, which means the folder can end up with its own permissions. Keep a list of folders you share this way.

## Folders or views?

Folders are easy to understand, but every folder level adds a click and a longer path. Microsoft's page says views let you filter, group and sort files in several ways, and that for a large library, a combination of views and folders might work best. The page on document libraries also lists the other tools: columns that show details such as who created or last modified a file, views in List, Compact and Tiles form, and custom views you can save.

A practical rule: use folders for things that rarely change, like the client or the year, and use columns and views for everything that changes, like status or owner. Use folders when permissions differ. Use views when only the display differs.

## Common mistakes

- **Building a deep tree.** Six levels of folders make paths long and files hard to find. Keep it to two or three.
- **Stuffing the name with dates and status.** The name should say what's inside, not what stage it is in. Use a column.
- **Creating a folder when you wanted a library.** If the content needs its own permissions and settings, ask whether it should be a separate library.
- **Sharing files one by one.** Share the folder instead.
- **Looking in the wrong place.** If the Folder command is missing, check the library settings.
- **Renaming a shared top-level folder without warning.** The path changes for everyone.

## Related topics to explore

- **Using SharePoint as a beginner.** Sites, libraries, lists and pages work together. The next article explains how to use SharePoint from the first click.
- **Syncing a library to your PC.** The OneDrive sync app lets you work in File Explorer. Read about syncing OneDrive and SharePoint files if you prefer that.
- **Permissions on a folder.** Unique permissions on a folder are useful when it needs different access than the rest of the library. Microsoft's older page on subfolder permissions applies to SharePoint Server 2013 and 2016, so for Microsoft 365 use the sharing page.
- **Recycle Bin.** Deleted folders go to the site Recycle Bin. Restore from there when someone removes one by mistake.
- **Folders in lists.** Lists have their own folder command, covered on a separate Microsoft page.

## Next step

Open your library, create one test folder with **+ New** and **Folder**, and move two files into it with **Move to**. If you want to create a folder in SharePoint that your team will still use next year, write down the naming rule for the top two levels and put it in the library description.
