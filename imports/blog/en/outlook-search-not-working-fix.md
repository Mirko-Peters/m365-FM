---
title: "Outlook Search Not Working? Fixes That Actually Work"
summary: "Outlook search not working or showing no results? Check scope, indexing status and Windows Search, then rebuild the search catalog and repair damaged data."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [outlook, exchange-online]
keypoints:
  - "Start with the cheap checks: search scope, filters, a full restart and the indexing status, because most missing results come from one of these."
  - "In classic Outlook for Windows, open Search Tools, then Indexing Status. If the number of remaining items does not drop after a few minutes, indexing is stuck."
  - "Rebuild the search catalog through Control Panel, Indexing Options, Advanced. It deletes and recreates the Windows index, so searches stay incomplete until it finishes."
  - "Search across several accounts or shared mailboxes behaves differently: in new Outlook you search one account at a time, and All Mailboxes can return nothing for a shared mailbox."
  - "Run Inbox Repair only if Outlook has trouble opening a .pst file, and back up the file first. A new profile and an Office repair come before a reinstall."
faq:
  - q: "Why does Outlook search show no results?"
    a: "The usual causes are an incomplete search index, a search scope that is too narrow, an active filter, or a damaged profile or data file. Check the indexing status first. If items are still waiting, results stay incomplete until Outlook finishes. After that, clear filters and widen the scope."
  - q: "How do I rebuild the Outlook search index?"
    a: "Close Outlook, open Control Panel and select Indexing Options. Choose Advanced, go to the Index Settings tab, select Rebuild under Troubleshooting, then select OK. Windows deletes and recreates the index. Search stays incomplete while that runs, which can take a long time on a large mailbox."
  - q: "Why can't Outlook find old emails?"
    a: "Outlook only searches mail it has downloaded. In classic Outlook, raise the Download email for the past slider in the account settings, or choose All. In new Outlook, raise Days of email to save under Settings, General, Offline. Also check whether the mail sits in an archive folder."
---
If Outlook search is not working, check the basics in this order: the search scope and filters, a full restart, the indexing status, and the Windows Search service. If that doesn't help, rebuild the search catalog and then test a new profile. This article is for Outlook users and help desk staff who get empty or incomplete results, or a search box that never finishes. Most of it applies to [Outlook](https://www.m365.fm/entity/outlook/) on Windows, because that's where indexing problems live. Microsoft's own steps differ between classic Outlook and new Outlook, so each section tells you which one it's about.

To tell the two apart, look at the ribbon. If you see **Settings**, you're in new Outlook. If you don't, you're in classic Outlook. Microsoft uses the same test in its [guide to troubleshooting Outlook search issues](https://support.microsoft.com/en-us/outlook/troubleshooting-outlook-search-issues), which is the main source for the steps below.

## Find out what kind of search problem you have

Don't start by changing settings. Spend two minutes working out what exactly is wrong, because "search is broken" covers at least four different problems.

Type a word you know appears in a recent message. Then type a word from an old one. Then try a sender name. A few patterns come up again and again:

- Nothing is found at all, even for mail that arrived today. That points to the index or the Windows Search service.
- Recent mail is found, older mail isn't. That usually points to how much mail is downloaded to the PC, or to the search scope.
- Search works in the Inbox but not in an archive or a shared mailbox. That's a scope or design limit, not a fault.
- Search hangs or shows a message that results may be incomplete. Indexing is probably still running.

Also test the same search somewhere else. Sign in to Outlook on the web with the same account and run the query. If the web finds the message and the desktop app doesn't, the mailbox is fine and the problem sits in your local Outlook, profile or Windows index. If neither finds it, check whether the message was moved or deleted, and whether the search scope excludes the folder it's in.

If you use several accounts, test each one on its own. A problem that hits only one account tells you far more than "Outlook is broken".

## Quick fixes: scope, filters and a clean restart

These cost nothing and they solve more cases than you'd expect.

1. **Check the scope.** In classic Outlook, the search box offers scopes such as Current Folder, Current Mailbox and All Mailboxes. If you searched the Inbox only, a message in a subfolder won't appear. Widen the scope, or pick the folder you actually want.
2. **Clear filters.** An old filter, such as unread only or one sender, quietly narrows every search. Remove it and run the query again.
3. **Restart properly.** Close Outlook with **File** > **Exit**, not just the window's X. Open Task Manager and confirm no `OUTLOOK.EXE` process is left. If one is, end it. Wait a few seconds, then start Outlook again.
4. **Try a new, short query.** Search for a single distinctive word instead of a phrase. If that works, your original phrase simply didn't match.
5. **Disable add-ins for a test.** Start Outlook in safe mode by holding Ctrl while you click its icon. If search works there, an add-in is in the way. Turn add-ins off under **File** > **Options** > **Add-ins** and re-enable them one at a time.

In new Outlook the equivalent settings live under **Settings** > **General** > **Search**. Microsoft's article lists these checks for new Outlook on Windows:

1. Change the search scope to Current Folder if All Folders isn't returning what you want.
2. Use filters to narrow the query, since a very large result set can bury older items.
3. Select **Include deleted items** under Search results, then select **Save**.
4. Under **Settings** > **General** > **Offline**, raise **Days of email to save**, then select **Save**.

New Outlook doesn't search several accounts in one go. Select each account in turn and search in All Folders. It also searches Online Archives automatically, so there is nothing to switch on there.

## Check whether indexing is finished

Classic Outlook relies on the Windows search index. If that index is incomplete, results are incomplete, and the fix is often just waiting. This step doesn't apply to new Outlook, where Microsoft's article has no equivalent.

To see where the index stands:

1. Click into the search box in Outlook.
2. On the **Search** tab, select **Search Tools**, then **Indexing Status**.
3. Read the message. If it says items remain, note the number, wait five minutes and look again.

If the number goes down, indexing is working. It's simply busy. Large mailboxes, a newly added account or a freshly restored data file all keep it busy for a while, and a slow hard disk makes that worse. Leave the PC running and let it catch up, ideally overnight if the count is high. If the number stays the same or climbs, indexing is stuck and you should continue with the steps below.

One case deserves a special mention. After an upgrade to Windows 11, Outlook's search index is deleted and has to be built again. Microsoft calls this expected behavior and says searches return nothing until the rebuild completes. It affects accounts stored locally in PST or OST files, which includes POP and IMAP accounts and the offline copy of Exchange and Microsoft 365 mailboxes. The details are in Microsoft's note on [Outlook search not returning results after an upgrade to Windows 11](https://support.microsoft.com/en-us/office/outlook-search-does-not-return-results-after-upgrade-to-windows-11-cc54dfee-ee78-4123-a9af-7986748052ef). If you're in that situation, check the indexing status and give it time before you change anything.

Next, confirm that Outlook is actually part of the index.

1. In classic Outlook, select **Search Tools** > **Locations to Search** and make sure every data file in the list is ticked.
2. Close Outlook, open **Indexing Options** in Control Panel, and look for **Microsoft Outlook** under Included Locations. If it's missing, select **Modify**, tick it, then select **OK** and **Close**.
3. Open `services.msc`, find **Windows Search**, and check that the startup type is **Automatic (Delayed Start)** and the status is Running. If it's stopped, select **Start**.

Microsoft also suggests running the built-in indexer troubleshooter before any of this. On Windows 11 it's under **Start** > **Settings** > **Privacy & security** > **Searching Windows** > **Indexer troubleshooter**. On Windows 10 it's under **Settings** > **Update & Security** > **Troubleshoot** > **Search and Indexing**. It takes a minute and sometimes fixes the service for you.

## Rebuild the search catalog

If indexing is stuck or the index is damaged, rebuilding is the standard fix. It throws away the current index and builds a new one, so expect search to be incomplete for a while. Start it when you're done for the day.

Microsoft's article on [rebuilding your Instant Search catalog](https://support.microsoft.com/en-us/outlook/fix-search-issues-by-rebuilding-your-instant-search-catalog) gives these steps:

1. Close Outlook.
2. Open **Control Panel** and select **Indexing Options**. Typing "Indexing" in the Control Panel search box gets you there faster.
3. If you need to change which locations are indexed, tick the one you want under **Change selected locations** and select **OK**.
4. Select **Advanced**. On the **Index Settings** tab, under **Troubleshooting**, select **Rebuild**.
5. Select **OK** in the Rebuild Index dialog. The dialog warns that the index might take a long time to complete.

Don't reopen Outlook and judge the result five minutes later. Check the indexing status again after some time, and test a few searches only when the count has dropped to zero or close to it. This single step clears most long-standing cases.

There's one more setting Microsoft lists for classic Outlook, for people whose saved .msg files never turn up in Windows search. Close Outlook, go to **Indexing Options** > **Advanced** > **File Types**, select **msg**, and choose **Index Properties and File Contents**. The filter description should read Office Outlook MSG IFilter. If it doesn't, Microsoft says to contact support.

## Deeper fixes: profile, Office repair and data files

When a rebuild doesn't help, the damage is usually in the profile, the Office installation or a data file. Work through these in order, and stop when search works.

### Test with a new profile

A new profile shows quickly whether the old one is the problem.

1. In classic Outlook, select **File** > **Account Settings** > **Manage Profiles**. You can also open **Mail** in Control Panel.
2. Select **Show Profiles**, then **Add**, and give the profile a name.
3. Enter the account details and select **Finish**.
4. Set "Prompt for a profile to be used", restart Outlook, choose the new profile and wait for it to sync. Then test search.

If search works, the old profile is damaged. Make the new one the default and move over what you need. For an [Exchange Online](https://www.m365.fm/entity/exchange-online/) mailbox this is painless, because the mail is on the server and Outlook downloads it again.

### Repair Office

A repair replaces damaged program files and keeps your data. Right-click **Start**, open **Installed apps** on Windows 11 or **Apps and Features** on Windows 10, select your Office product and choose **Modify**. For a Click-to-Run installation you'll see Quick Repair and Online Repair. Quick Repair is faster but only replaces corrupted files, so use Online Repair if search is still broken. A repair applies to the whole Office suite, not to Outlook alone.

### Repair a damaged PST file

The Inbox Repair tool, `SCANPST.EXE`, is for a different problem than "search finds nothing". Microsoft describes it for cases where Outlook can't open a data file or its folders, or where the file may be damaged. Use it when you have symptoms like that.

Microsoft's [repair guide for Outlook data files](https://support.microsoft.com/en-us/outlook/repair-outlook-data-files-pst-and-ost) lists the folder for Outlook 2019 and 2016 as `C:\Program Files (x86)\Microsoft Office\root\Office16`. The page gives no path for other versions, so search your Program Files folders for `SCANPST.EXE` if it isn't there. The steps are:

1. Close Outlook and copy the .pst file somewhere safe. Microsoft recommends a backup before you run the tool.
2. Open `SCANPST.EXE` and browse to the file. If you don't know where it is, look under **File** > **Account Settings** > **Account Settings** > **Data Files**.
3. Select **Start**. If the tool finds errors, select **Repair**. You may need to run it more than once.
4. Open Outlook with the profile that uses the repaired file.

The page describes the steps for .pst files only. For an Exchange or Microsoft 365 account, it says you can delete the offline .ost file, and Outlook recreates it the next time you open the program. Do that only for a mailbox that lives on the server, because an .ost holds a copy, not the original.

### Last resort: reinstall

If nothing else works, Microsoft's final steps are to uninstall Office with its uninstall troubleshooter and install it again. This needs Windows 10 or later and can't remove Office 2024. Treat it as the end of the list, not the start.

## Search that fails only in some places

Some cases aren't faults. Microsoft documents them as limits, and knowing that saves hours.

### Old emails not found

Outlook can only search what it has stored locally. In classic Outlook, check these two settings:

1. Select **File** > **Options** > **Search**, tick the option to include messages from the Deleted Items folder when searching All Items, select **OK** and restart Outlook.
2. Select **File** > **Account Settings** > **Account Settings**, open the **Email** tab, select your account, choose **Change**, and move the **Download email for the past** slider to a longer period or to All. Select **Next** and **Done**, then restart Outlook.

Archive folders are a special case. Scopes such as All Mailboxes or All Outlook Items return limited archive results. Select the archive folder itself and search with Current Folder. Search the subfolders separately.

### Shared mailboxes

If you search with the All Mailboxes scope and a shared mailbox returns nothing, that is a design limitation according to Microsoft. Select the shared mailbox and search with Current Folder. If that isn't enough, Microsoft describes a workaround: remove the shared mailbox from the Exchange account's additional mailboxes, then add it back as its own account under **File** > **Add Account**. Enter the full mailbox address, choose **Sign in with another account** at the password prompt, and use credentials that have access to the mailbox.

### Several accounts in one profile

Each account has its own data file and its own index state, so check the indexing status after adding an account and confirm the new data file is ticked under Locations to Search. In new Outlook there is no cross-account search at all, as noted above.

### Slow or older PCs

Microsoft's article doesn't set hardware requirements for search, so there's no magic number to quote. What you can say from how indexing works: a large mailbox on a slow disk needs longer to index, and a PC that sleeps or shuts down every evening may never finish. If search is slow but correct, give the index time, keep the PC on, and archive mail you don't need. Reducing what has to be indexed is the only lever you control.

## Common mistakes

- Rebuilding the index and testing search ten minutes later. The rebuild takes a long time on a large mailbox, and results stay partial until it ends.
- Running the Inbox Repair tool because search is empty. It's meant for data files that are damaged or can't be opened, not for an index problem.
- Deleting an .ost file or a profile on a POP or IMAP account without checking where the mail is stored. With POP, the local file can hold mail that exists nowhere else.
- Searching a shared mailbox with All Mailboxes and concluding that the mailbox is empty. Search it with Current Folder.
- Skipping the web check. Ten seconds in Outlook on the web tells you whether the mailbox or the PC is the problem.
- Reinstalling Office as step one. A repair and a new profile come first and take far less time.

## Related topics to explore

- **Search on a low-spec PC.** Why a slow disk and a large mailbox delay indexing, and how an archive reduces the load. Start with the indexing status steps above.
- **Shared and delegated mailboxes.** Why the scope and the permissions decide what search can see in a team inbox on [Exchange Online](https://www.m365.fm/entity/exchange-online/).
- **Several accounts in one profile.** How to check the index per account and keep each data file in the list of locations to search.
- **Language and region settings.** Why a mismatch between Windows and Office language can change how search matches words. Check this if only some terms fail.

## Next step

If Outlook search is not working today, open the indexing status first and write down the number. Then work down this list one step at a time, and note which step fixed it, so you can fix the next case faster.
