---
title: "Exclusions that shrink FSLogix profiles: practical examples"
summary: "Four redirections.xml patterns from Learn's tutorial and reference page, each with its trade-off, then how to deploy the file, verify it in the log and pilot it before a wider rollout."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-redirections-xml, fslogix]
keypoints:
  - "The tutorial on Learn is the real-world example: it excludes five Teams folders with Copy 0 (media-stack, the meeting-addin Cache, Logs, PerfLogs and WebStorage). The current Teams for VDI page covers only three of them and recommends no exclusions beyond its own tables, so test media-stack and meeting-addin Cache first. The reference page marks its own Contoso example as not for production."
  - "ExcludeCommonFolders adds up folder values: Downloads (8), Music (32) and Pictures and Videos (64) give 104 (our arithmetic). Learn does not say what happens to files in these folders. Our reading of the container types page is that new files are lost at sign-out, so test with an existing profile and announce it."
  - "Copy 1 copies container data to the local folder at sign-in and discards new data at sign-out. Copy 3 also copies it back. Copy 2 is not to be used unless Microsoft support asks for it."
  - "A new exclusion does not shrink an existing container. Delete the container or script a cleanup. Verify with the Profile log, which prints Redirections.xml copy success, and with frx list-redirects."
  - "The FAQ gives no recommended values, and many statements slow every file system request. Start with documented, large, disposable folders and test with a pilot group."
faq:
  - q: "Which folders does Microsoft actually show as exclusions?"
    a: "The tutorial on Learn shows five Teams folders: AppData\\Roaming\\Microsoft\\Teams\\media-stack, AppData\\Local\\Microsoft\\Teams\\meeting-addin\\Cache, and the Logs, PerfLogs and WebStorage folders under LocalCache\\Microsoft\\MSTeams in the MSTeams_8wekyb3d8bbwe package. The current Teams for VDI page recommends excluding Logs and PerfLog, WebStorage, GPUCache and Start menu TempState folders (StartMenuExperienceHost, plus ShellExperienceHost on Windows Server 2019 only). It does not list media-stack or meeting-addin\\Cache, and it says that other than the folders in its tables it does not recommend excluding additional directories."
  - q: "Can I exclude OneDrive data to save space?"
    a: "The FAQ gives no exclusion guidance for OneDrive. It says users should keep OneDrive at its default location so the data is saved in their container, and that OneDrive disk space policies check the FSLogix VHD. It also advises not to exclude application data unless the application owner has documented that it can be excluded."
  - q: "How many exclude statements are too many?"
    a: "The FAQ says there is no technical limitation, but less is more. It warns that numerous exclude or include statements cause a performance issue, because each file system request is checked against the list, and that redirections for small folders do not help the user experience."
---

Exclusions shrink an FSLogix profile when you point `redirections.xml` at folders that are large, rebuildable and documented as safe to drop. The tutorial on Learn builds one real-world file, for Teams, and the reference page adds a bitmask for well-known folders; everything else is your own decision and needs a pilot. This article focuses on patterns, trade-offs and a pilot routine. The field rules for the file are in [the explainer article](/community/u/mirko-p/blog/redirections-xml-in-fslogix-keeping-bulky-data-out-of-the-profile/), and the [FSLogix redirections.xml entity page](/entity/fslogix-redirections-xml/) gives a short overview.

Two rules from Microsoft frame all of it. The FAQ says FSLogix provides no recommended values for the file and relies on application owners to document what can be excluded. And Learn's tutorial warns that non-Microsoft redirections.xml files can exclude items that affect the operating system or applications, so exclude and include statements should be used sparingly.

## Before you write a rule

1. **Find what is large.** Take a test profile used for a few weeks and open its container with `frx edit-profile -filename <path to VHD(x)>`. Learn describes the command as attaching the VHD(x) and opening an Explorer window and Registry editor. Then check which folders under `AppData` and the user folders dominate. Which of them to exclude is our suggestion, not a Learn step.
2. **Find the owner's guidance.** Look for a statement from the application's vendor that the folder can be dropped, as the Teams page provides.
3. **Decide what happens to the data.** Excluded data lives in `C:\Users\local_%username%` for the session, and the container types page says that folder is deleted at sign-out. Choose the `Copy` value that matches what users expect.
4. **Remember the goal.** The FAQ says container size does not affect sign-in time, so exclusions serve capacity or data that should not persist, not a logon fix.

## Pattern 1: Teams folders from the tutorial

The [tutorial](https://learn.microsoft.com/en-us/fslogix/tutorial-redirections-xml) builds this file to exclude what it calls the recommended Microsoft Teams folders for virtual desktop infrastructure. This is its XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<FrxProfileFolderRedirection ExcludeCommonFolders="0">
<Excludes>
<Exclude Copy="0">AppData\Roaming\Microsoft\Teams\media-stack</Exclude>
<Exclude Copy="0">AppData\Local\Microsoft\Teams\meeting-addin\Cache</Exclude>
<Exclude Copy="0">AppData\Local\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams\Logs</Exclude>
<Exclude Copy="0">AppData\Local\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams\PerfLogs</Exclude>
<Exclude Copy="0">AppData\Local\Packages\MSTeams_8wekyb3d8bbwe\LocalCache\Microsoft\MSTeams\EBWebView\WV2Profile_tfw\WebStorage</Exclude>
</Excludes>
<Includes>
</Includes>
</FrxProfileFolderRedirection>
```

`ExcludeCommonFolders="0"` excludes no well-known folder, and `Copy="0"` creates empty folders locally without copying anything. The tutorial lists both the Classic Teams and the new Teams VDI pages as prerequisites. The current [Teams for VDI page](https://learn.microsoft.com/en-us/microsoftteams/teams-client-vdi-requirements-deploy) covers only some of these paths. It rates Logs and PerfLog as no impact and WebStorage as "could be slower" after clearing, because that folder holds storage for web apps loaded inside Teams, such as SharePoint and OneDrive. It does not list `media-stack` or `meeting-addin\Cache`. The page writes `PerfLog` where the tutorial XML, copied unchanged above, writes `PerfLogs`.

The same page recommends three more exclusions that the tutorial file lacks. One is `GPUCache` under `EBWebView\WV2Profile_tfw`. The other two are `TempState` folders of the Start menu packages: `AppData\Local\Packages\Microsoft.Windows.StartMenuExperienceHost_cw5n1h2txyewy\TempState`, and for Windows Server 2019 only the matching `Microsoft.Windows.ShellExperienceHost_cw5n1h2txyewy\TempState`. It rates both as no impact and recommends them to solve a missing Teams icon in the Start menu. Service Worker, IndexedDB and Cache appear as trade-offs that need testing.

The page also states that, other than the folders in its two tables, Microsoft does not recommend excluding additional directories. The tutorial's first two paths, `media-stack` and `meeting-addin\Cache`, are in neither table. Our reading: test them in the pilot or leave them out. The [new Teams article in this series](/community/u/mirko-p/blog/new-teams-on-avd-with-fslogix-what-to-know/) covers the folders from the Teams page's two tables.

Does this shrink the container? Three of the five paths sit under `LocalCache`. The Teams page says the package's folder structure, including `LocalCache`, must exist as directories and roam with the profile, and the FSLogix release notes list a fix in 2210 hotfix 4 for MSIX folders that shouldn't be backed up: they were removed at sign-out instead of only their contents. The AppX troubleshooting page says the contents of `AppData\Local\Packages\*\LocalCache` are deleted at sign-out regardless of any redirections.xml configuration. The pages do not say how these fit together. Our reading, not a Learn statement: for Logs, PerfLogs and WebStorage the exclusion may save little container space, because the contents are discarded at sign-out anyway. Compare container sizes with and without the file before you count on a saving.

## Pattern 2: well-known folders with the bitmask

`ExcludeCommonFolders` takes the sum of the folder values listed in the explainer. A file that keeps Downloads (8), Music (32) and Pictures and Videos (64) out of the container uses 8 + 32 + 64:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<FrxProfileFolderRedirection ExcludeCommonFolders="104">
<Excludes>
</Excludes>
<Includes>
</Includes>
</FrxProfileFolderRedirection>
```

The sum is our arithmetic; Learn's own example is 7 for Contacts, Desktop and Documents. Learn adds that on Windows 8 and later, folders involved in Low Integrity Level processes (bit 128) are always redirected.

Learn describes this attribute only as defining which well-known folders are "redirected out of the user's profile container". It does not state what happens to files a user saves in those folders. Our reading, based on the container types page saying the `local_%username%` folder is deleted at sign-out: new files in an excluded Downloads folder are lost at sign-out. For data already in the container, the reference page says generally that anything added to the file goes to the `local_` folder while what already exists in the VHD(x) is not removed, and says so for `Exclude` entries with Copy 0. It does not name the bitmask folders there. Our reading is that the same applies, so a user with an existing profile may see an empty folder while the old files stay in the VHD(x). Test this with an existing profile and tell users before rollout.

Our recommendation: do not set bit 2 or 4 (Desktop, Documents) unless users keep their documents somewhere else, since Learn says profile data is not designed to be excluded. For OneDrive, the FAQ gives no exclusion guidance.

## Pattern 3: choose a copy mode

When an application needs its data across sessions but you want its reads and writes off the file share, the reference page's illustration is an `Exclude` with `Copy="3"` for a fictional Contoso sales app. Learn marks that example as showing how the elements can be used and says it "should not be used in any production environment". Its note is that the I/O to copy the data is still needed. Our suggestion: Copy 3 when users need the data next session, Copy 1 for read-mostly data that you can afford to lose, Copy 0 for data that can be rebuilt. Copy 2 is only for use when Microsoft support tells you to.

## Pattern 4: exclude a folder, include one subfolder

Learn's illustration for this pattern excludes a fictional app folder with `Copy="0"` and includes back its `Settings` subfolder. Our suggestion: use it to drop disposable data but keep settings. Both paths are written relative to `%userprofile%`, without the `C:\Users\%username%` part, and must exist in the profile, and Learn says the parent folder of an included path must exist in the container. Use it only for a subfolder that already exists in every pilot profile: the FAQ says the include only works if the data exists before the statement, and that applications often create these folders at first launch, which can cause problems for new profiles. Its tip is not to include that kind of data. If the same path appears in both lists, the Exclude wins.

## Deploy the file

1. Write the XML in a text editor and save it as `redirections.xml` (the name is not case sensitive; choose the **All Files** type, as the tutorial says).
2. Save it to a file share. The tutorial says users without read access cannot copy it at sign-in, and the reference page says that on a central location users should have read permission only.
3. On the session host, add the value `RedirXMLSourceFolder` (REG_SZ) under `HKEY_LOCAL_MACHINE\SOFTWARE\FSLogix\Profiles` with the folder path, for example `\\<server-name>\<share-name>`. Leave out the file name. For a gold image, the path can be local.
4. Have a test user sign in, then open `C:\ProgramData\FSLogix\Logs\Profile\Profile-<date>.log` and find the section that starts with `===== Begin Session: StartShell`.
5. Look for `Redirections.xml copy success`, then one `Adding exclude rule for folder` line and one `Added redirection` line per entry, such as `C:\Users\%username%\AppData\Roaming\Microsoft\Teams\media-stack -> C:\Users\local_%username%\AppData\Roaming\Microsoft\Teams\media-stack`.
6. Run `frx list-redirects` on the host. Learn describes it as listing the current active folder redirections, and gives `C:\Program Files\FSLogix\Apps` as the location of the frx utility.
7. Sign out and back in after any edit to the file. Changes are read at sign-in and sign-out.

## Run a pilot

Our suggested routine, built on the steps above:

1. Pick a few users, including one with an old profile and one with a new profile.
2. Note each container's file size on the share and the sign-in time before the change.
3. Roll out the file to those hosts and check the log lines from step 5.
4. Check what users see: Teams starts, the Start menu icon is present, and excluded well-known folders behave as you told them.
5. After a week, compare container sizes. Existing containers stay as they are (see the next section), so a new profile shows the effect more clearly.
6. To withdraw all rules, clear the file's contents and save it at the source; Learn says deleting or renaming it does not remove the rules for users.

## Clean up existing containers

A new exclusion does not touch what a container already holds. The FAQ says to delete the profile container or create a script that deletes the content after or during sign-in; the FAQ gives no script. Deleting a container deletes that user's profile data, so announce it and back up containers you cannot rebuild.

## Common mistakes

| Mistake | Effect | Fix |
|---|---|---|
| File name in `RedirXMLSourceFolder` | No redirection entries in the log | Use the folder path only |
| No read access for users | File is not copied at sign-in | Give users read on the share |
| Share path not found (network, DNS, wrong name) | No redirection entries in the log | Check the path from the host |
| Include for a folder that may not exist yet | The include may not work as intended | Do not include data that may not exist yet, as the FAQ tip says |
| Expecting a smaller container after rollout | Size unchanged or larger | Delete the container or clean up by script |

For the product overview, see [FSLogix](/entity/fslogix/).

## Sources

Retrieved on 17 November 2026.

- [Microsoft Learn: Tutorial: Create and implement redirections.xml](https://learn.microsoft.com/en-us/fslogix/tutorial-redirections-xml)
- [Microsoft Learn: Custom profile redirections.xml](https://learn.microsoft.com/en-us/fslogix/concepts-redirections-xml)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: FSLogix release notes](https://learn.microsoft.com/en-us/fslogix/overview-release-notes)
- [Microsoft Learn: FSLogix container types](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: Troubleshooting AppX issues](https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues)
- [Microsoft Learn: Microsoft Teams for Virtualized Desktop Infrastructure (VDI)](https://learn.microsoft.com/en-us/microsoftteams/teams-client-vdi-requirements-deploy)
- [Microsoft Learn: frx command-line utility](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=profiles)
