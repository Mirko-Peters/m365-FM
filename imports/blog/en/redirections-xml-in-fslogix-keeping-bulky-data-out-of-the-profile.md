---
title: "redirections.xml in FSLogix: keeping bulky data out of the profile"
summary: "redirections.xml is an XML file that tells an FSLogix profile container which folders to keep out of the VHD(x) and redirect to a temporary local_ folder on the session host instead. It applies to profile containers only, is read at sign-in, and does not remove data that is already in a container."
status: review
publish: false
author: mirko-p
date: 2026-11-18
topics: [fslogix-redirections-xml, fslogix]
keypoints:
  - "FSLogix does not create redirections.xml. You write it, store it in the folder named by the RedirXMLSourceFolder setting, and FSLogix copies it into the user's profile container at sign-in when it differs from the existing copy."
  - "Excluded folders are redirected to C:\\Users\\local_%username% on the session host, and that folder is deleted at sign-out. Copy values 0 to 3 decide whether data is copied from or back into the container."
  - "The file applies to profile containers only and has no effect on ODFC containers. Changes are read at sign-in and sign-out, so a running session keeps the old rules."
  - "Removing an exclusion, or adding one for an existing profile, does not delete data already in the container. Microsoft's FAQ says to delete the container or run a cleanup script."
  - "Microsoft gives no recommended values and says to exclude data only when the application owner documents it as safe. Every file system request is checked against the list, so many statements reduce VM performance, and container size does not affect sign-in time."
faq:
  - q: "Does redirections.xml work with ODFC containers?"
    a: "No. Microsoft Learn states that redirections.xml is only applicable when used with profile containers and has no effect when using ODFC containers. If Office data is split into an Office container, the file does not reach it."
  - q: "Will excluding a folder shrink a container that already exists?"
    a: "Not by itself. The FAQ says that implementing redirections.xml for existing profiles does not remove the excluded content from the user's container. You need to delete the container or script a cleanup after sign-in, and Learn adds that removing an entry later does not remove what is already inside the VHD(x)."
  - q: "How do I see which redirections are active on a host?"
    a: "Run frx list-redirects, which Learn describes as listing the current active folder redirections. The Profile log under C:\\ProgramData\\FSLogix\\Logs\\Profile also records the copy of the file and each redirection that was added."
---

redirections.xml is the file that tells FSLogix which parts of a user's profile should not be stored in the profile container. FSLogix reads it at sign-in and redirects the listed folders to a temporary local folder on the session host, `local_%username%`, which it deletes at sign-out. Depending on the Copy value, data is first copied in from the container and copied back at sign-out; data that is already in the container is not removed. Practical exclusion examples follow in the next article of the series.

Microsoft is cautious about the file. Learn's page on [custom profile redirections.xml](https://learn.microsoft.com/en-us/fslogix/concepts-redirections-xml) says data in a profile is not designed to be removed or excluded, and that you should not exclude it unless you know the data or the application well. The FSLogix FAQ adds that FSLogix gives no recommended values; it relies on application owners to document what can be excluded.

## What the file is and where it lives

FSLogix does not create the file. You write it and place a copy where session hosts can read it. The [FSLogix redirections.xml](/entity/fslogix-redirections-xml/) entity has the short definition; the mechanics are these:

- **Source folder.** The registry value `RedirXMLSourceFolder` (REG_SZ, no default) under `HKEY_LOCAL_MACHINE\SOFTWARE\FSLogix\Profiles` holds a folder path, for example `\\<server-name>\<share-name>` or a local path such as `C:\Windows\System32`. Learn says to give the folder only, never the file name. A local path can make sense when the file is part of a gold image.
- **Copy at sign-in.** If FSLogix finds a file there that differs from the existing copy, it copies it into the profile container and processes it. The copy inside the container sits at `%userprofile%\AppData\Local\FSLogix\redirections.xml`.
- **Permissions.** Users need read access to the share, or they cannot copy the file at sign-in. When the file is stored next to the containers, Learn says users should have read permission only on it. The file name is not case sensitive.
- **Scope.** It applies to [profile containers](/entity/fslogix-profile-container/) and has no effect on ODFC containers. If you have split Office data into an [Office container](/entity/fslogix-office-container/), rules in this file do not reach it.

## What happens to an excluded folder

Learn's container types page describes the mechanism that redirections use. Content that cannot live in the VHD(x) is redirected from the native profile path to a folder under `C:\Users` that is prefixed with `local_` and the user's account name, for example `C:\Users\local_%username%`. FSLogix deletes that folder at sign-out. Four paths are redirected there automatically, without any XML: `AppData\Roaming\Microsoft\Protect`, `AppData\Roaming\Microsoft\Credentials`, `AppData\Local\Microsoft\Credentials` and `AppData\Local\Microsoft\Office\16.0\OfficeFileCache`.

Our reading, not a Learn statement: because the redirected folder sits on the session host's disk, every folder you exclude moves its write load and disk use from the file share to the VM for the length of the session. On a pooled host with many users, size the OS or temp disk with that in mind.

The container types page also lists nonroamable data that FSLogix deletes from the container at sign-out on its own: MSIX application data folders such as `AppData\Local\Packages\*\LocalCache` and `TempState`. The AppX troubleshooting page says the contents of those folders are deleted at sign-out regardless of any redirections.xml configuration. Learn's tutorial nevertheless excludes three Teams folders below `LocalCache`, and the pages do not reconcile the two statements, so test on a pilot host before relying on either; the next article returns to this.

## The structure of the file

The file has a standard XML declaration, one root element with an `Excludes` and an `Includes` collection, and two attributes. Learn's introduction counts "three (3) elements and two (2) attributes", but its list names five element names (`FrxProfileFolderRedirection`, `Excludes`, `Exclude`, `Includes`, `Include`) plus the attributes `ExcludeCommonFolders` and `Copy`, which is the structure the table follows:

| Part | Purpose |
|---|---|
| `FrxProfileFolderRedirection` | The first and only root element. Its attribute `ExcludeCommonFolders` is a bitmask of well-known folders |
| `Excludes` / `Exclude` | One entry per location to keep out of the container. The `Copy` attribute sets the behavior |
| `Includes` / `Include` | One entry per subfolder of an excluded path that should stay in the container |

Learn says paths must exist in `%userprofile%`, and they must not contain the `C:\Users\%username%` part. The file accepts any number of Include and Exclude elements.

### ExcludeCommonFolders

You add up the values of the folders to exclude. Learn's example: 7 excludes Contacts, Desktop and Documents.

| Value | Folder |
|---|---|
| 1 | Contacts |
| 2 | Desktop |
| 4 | Documents |
| 8 | Downloads |
| 16 | Links |
| 32 | Music |
| 64 | Pictures and Videos |
| 128 | Folders involved in Low Integrity Level processes, such as `AppData\LocalLow` |

A note on the same Learn page says that on Windows 8 and later, folders involved in Low Integrity Level processes are always redirected to the `local_%username%` directory.

### The Copy attribute

`Copy` decides what FSLogix does with data that is already in the container and with data written during the session. Leaving it out is the same as `0`.

| Copy | Behavior |
|---|---|
| 0 | Creates an empty folder in `local_%username%`. Nothing is copied. Existing container data is left where it is; new data exists only for the session. Learn calls this the most common value for reducing profile contents |
| 1 | Copies data from the container into `local_%username%` at sign-in. New data is written locally and lost at sign-out |
| 2 | Copies data from the local folder into the container at sign-out. Learn says not to use it unless a Microsoft support engineer directs you to |
| 3 | Combines 1 and 2: data is copied out at sign-in and everything is copied back at sign-out |

Learn says an exclude with copy moves the I/O to the local disk instead of the container, while the I/O to copy the data is still needed.

### Include: keep one subfolder of an excluded folder

An Include entry keeps a subdirectory of an excluded path in the container. The `Copy` attribute is not used. Learn names two requirements for an Include: the folder or data must already exist in the profile, and the parent folder of the included path must exist in the container. A separate note under Learn's example adds that if the same folder appears in both an Exclude and an Include, the Exclude takes precedence. The FAQ explains the usual failure: applications often create such folders only at first launch, so a new profile does not have them yet and the include does nothing. Its tip is not to include that kind of data.

## Learn's example file

Learn's own example file is marked as an illustration that must not be used in production. It sets `ExcludeCommonFolders="49"`, which is 32 (Music) plus 16 (Links) plus 1 (Contacts), excludes a fictional sales app folder with `Copy="3"`, excludes a fictional web app folder with `Copy="0"`, and includes back that web app's `Settings` subfolder. The [practical examples article](/community/u/mirko-p/blog/exclusions-that-shrink-fslogix-profiles-practical-examples/) in this series walks through patterns of this kind, with the Teams folders from Learn's tutorial.

## Behavior to plan for

- **Timing.** The file is processed at sign-in and sign-out. Changes made while a user is signed in take effect after the next sign-out and sign-in.
- **Existing data stays.** Learn says that if you remove entries, the contents remain in the VHD(x), and that anything added to the file goes to the `local_` folder while existing data is not removed. The FAQ repeats this for containers that stayed the same size or grew after rollout: delete the container, or script a cleanup of the content, because FSLogix will not do it.
- **Removing rules.** Deleting or renaming the source file does not remove it from users' containers. To withdraw all rules, empty the file's contents and save it at the source; the empty file is copied at the next sign-in.
- **Active rules.** `frx list-redirects` lists the current active folder redirections on a host.
- **Sign-in time.** The FAQ says container size does not affect sign-in times or performance, and points to the long sign-in troubleshooting page for the factors it calls much more important. Our reading: shrinking a container with exclusions is therefore not a way to speed up sign-in.
- **Statement count.** There is no technical limit, but the FAQ says less is more: every file system request is checked against the list, so many statements decrease the VM's performance, and redirections for small folders do not benefit the user experience.

## When it is worth using

Microsoft names two conditions. The concepts page says to exclude data only if you have intimate knowledge of the data in the profile or of the application. The FAQ says not to exclude user profile data for an application unless the application owner has documented that the data can be excluded. The FAQ points to the Teams guidance for classic and new Teams as examples. Learn's tutorial calls its five Teams folders the recommended ones for virtual desktop infrastructure, but the current [Teams for VDI page](https://learn.microsoft.com/en-us/microsoftteams/teams-client-vdi-requirements-deploy) lists only part of them under "Recommended for exclusion": its entries cover Logs and PerfLog, WebStorage, GPUCache and the Start menu host `TempState` folders, and `media-stack` and `meeting-addin\Cache` do not appear there. Check both pages before copying the tutorial's list. The tutorial also warns that redirections.xml files that do not come from Microsoft can exclude items that affect the operating system or applications, and asks you to use exclude and include statements sparingly. The corruption troubleshooting page adds a caution: it can be tempting to exclude data to conserve capacity on the storage provider, but the folders in a profile are not random, so restraint prevents unexpected results from a misconfigured file.

Our own checklist, not a Learn recommendation:

1. Is the data documented as safe to drop by the application's owner, rather than by habit? This follows the FAQ.
2. Is it large enough to matter against the container's `SizeInMBs` limit?
3. Will users miss it at the next sign-in? If yes, consider Copy 1 or 3, or keep it in the container.
4. Would raising `SizeInMBs`, which the FAQ says grows a dynamic disk at the next sign-in, or adding file share capacity solve the same capacity problem without touching profile data?

If the answer to the first question is no, leave the folder alone, and keep the file simple, as the corruption page advises.

### If the log shows no redirections.xml entries

The FAQ names three common causes: `RedirXMLSourceFolder` contains the full file path instead of the folder only, users have no read access to the file share, or the path to the share cannot be found (network, DNS or a wrong name).

For the product as a whole, see [FSLogix](/entity/fslogix/).

## Sources

- [Microsoft Learn: Custom profile redirections.xml](https://learn.microsoft.com/en-us/fslogix/concepts-redirections-xml)
- [Microsoft Learn: Tutorial: Create and implement redirections.xml](https://learn.microsoft.com/en-us/fslogix/tutorial-redirections-xml)
- [Microsoft Learn: FSLogix container types](https://learn.microsoft.com/en-us/fslogix/concepts-container-types)
- [Microsoft Learn: FSLogix configuration settings reference](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings?tabs=profiles)
- [Microsoft Learn: FSLogix FAQ](https://learn.microsoft.com/en-us/fslogix/overview-faq)
- [Microsoft Learn: Troubleshooting container corruption](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-corruption)
- [Microsoft Learn: Troubleshooting AppX issues](https://learn.microsoft.com/en-us/fslogix/troubleshooting-appx-issues)
- [Microsoft Learn: frx command-line utility](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Learn: Microsoft Teams for Virtualized Desktop Infrastructure (VDI)](https://learn.microsoft.com/en-us/microsoftteams/teams-client-vdi-requirements-deploy)
