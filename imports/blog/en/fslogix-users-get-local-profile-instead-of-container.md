---
title: "FSLogix Users Get a Local or Temporary Profile: Why the Container Does Not Attach"
summary: "New Azure Virtual Desktop users land in a fresh local profile and the FSLogix container never mounts? Check the log, then the registry, the share, the lock and any existing local profile, in that order."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [fslogix, azure-virtual-desktop, avd-host-pool, azure-files]
keypoints:
  - "Start with the FSLogix profile log in C:\\ProgramData\\FSLogix\\Logs\\Profile. It tells you whether FSLogix tried to attach and why it failed."
  - "FSLogix honors an existing local profile by default. In one confirmed thread, setting DeleteLocalProfileWhenVHDShouldApply to 1 fixed a new host pool, but Learn warns that this setting permanently deletes the local profile."
  - "Most attach failures come from storage permissions, an unreachable VHDLocations path, a container locked by another session, or a full container."
  - "Changing a naming setting such as FlipFlopProfileDirectoryName after containers exist produces an empty profile. Learn says the old data is not lost."
faq:
  - q: "Why does a user get a local profile even though FSLogix is installed?"
    a: "Microsoft Learn lists several causes. The Profile Container feature may not be enabled, VHDLocations may be wrong or unreachable, storage permissions may block the user, the container may be locked by another session, or a local profile may already exist. Learn says FSLogix honors an existing local profile by default. Read the Profile log first to see which cause applies."
  - q: "Is it safe to set DeleteLocalProfileWhenVHDShouldApply to 1?"
    a: "It fixed the problem in one Microsoft Q&A thread where a new host pool had left-over local profiles. Learn describes the setting as deleting the local profile if it exists and matches the profile container, and warns that FSLogix permanently deletes that local profile. Review which local profiles exist and whether they hold data you need before you enable it."
  - q: "Can I block sign-in instead of giving the user a temporary profile?"
    a: "Yes, with PreventLoginWithFailure and PreventLoginWithTempProfile, both off by default. Learn says FSLogix then loads FRXShell, the user gets the default prompt to call support, and the only option is to sign out. An AI-labeled answer in a 2026 thread claimed these settings may not block RemoteApp sign-ins. The Learn pages used here do not confirm that, so test it with a RemoteApp user."
  - q: "What happens to a profile after I restore its VHDX from an Azure Files snapshot?"
    a: "One 2026 thread asked this and got no confirmed answer. A Microsoft moderator said FSLogix has no supported re-attach operation and pointed to access, permissions and the VHDLocations path. Learn does not describe a restore procedure on the pages used here. Test the restored file on a test VM and check the folder and file names before you rely on it."
---

A new Azure Virtual Desktop host pool goes live. Users sign in without an error, but they see a blank desktop, a new local profile and no sign of their Outlook cache. The FSLogix container was never attached.

Several Microsoft Q&A threads from 2025 and 2026 describe this pattern. Only one reached a confirmed fix, and that fix was a single registry value. The other threads ended without a reply from the asker. This article uses the threads as scenarios and takes the actual guidance from Microsoft Learn. It is a troubleshooting checklist, not an official Microsoft procedure.

## Symptoms

- A user signs in and gets a local profile. In one thread, five new Windows 11 multi-session hosts did this, although the registry looked correct.
- In another thread, some users saw a two-minute sign-in, an empty desktop and a disconnected Office suite, which looked like a temporary profile.
- In a third thread, Outlook started on one session host but would not load mail. Signing out and moving to a different host fixed it for that user.
- The Profile log contains `[WARN:xxxxxx]` and `[ERROR:xxxxxx]` lines. Learn says each of them has a matching error code.

## Step 1: Read the Profile log

Do not guess. Learn says the main log is `Profile_%date%.log` in `C:\ProgramData\FSLogix\Logs\Profile`. The Event Viewer path is **Applications and Services Logs**, then **FSLogix**.

1. Open the newest `Profile_*.log` on the host where the user signed in.
2. Search for `LoadProfile: %samaccountname%`, with the placeholder replaced by the user's account name.
3. Match the time to the failed sign-in and follow the same process ID through the sequence.
4. Look at the `[WARN:xxxxxx]` and `[ERROR:xxxxxx]` lines. Each carries an error code that Learn documents on its error codes page.

One anonymous answer in the September 2025 thread listed event ID ranges (26xx, 27xx, 33xx). The Learn diagnostics page does not list specific event IDs, so treat those ranges as reported in the thread, not confirmed in Microsoft Learn.

## Step 2: Check that the feature is enabled and the path is right

Learn names these as the first causes. All Profile container settings live in `HKEY_LOCAL_MACHINE\SOFTWARE\FSLogix\Profiles`.

1. `Enabled` must be `1`. After installation, FSLogix enables nothing by default.
2. `VHDLocations` must hold a valid SMB path. Learn says the value is REG_SZ (preferred) or REG_MULTI_SZ, and that several REG_SZ entries need semicolons between them.
3. Check for conflicting values from Intune or Group Policy. Learn's troubleshooting page also mentions `HKEY_LOCAL_MACHINE\SOFTWARE\Policies\FSLogix\ODFC` for Office containers. A community answer in the confirmed thread warned that a second source can overwrite your settings. That warning is reasonable, but the thread does not show it was the cause there.

Then check the local include and exclude groups. Learn says FSLogix has one include and one exclude local group per container type. Include groups contain `Everyone` by default and exclude groups are empty by default. Learn advises checking their members when a user gets a temporary or local profile.

## Step 3: Test the share as the user, not as an admin

Learn's attach and detach page gives a clear order:

1. Browse to the `VHDLocations` path and try to create a folder or file.
2. If the path opens but writing fails, fix storage permissions.
3. If the path cannot be reached, treat it as a network or DNS problem and run `Test-NetConnection -ComputerName <server-fully-qualified-domain-name> -CommonTCPPort SMB`.

For permissions, Learn recommends user-based access. On NTFS, CREATOR OWNER gets Modify on subfolders and files only, your admin group gets Full Control, and the users group gets Modify on this folder only, so users can create their own folder. For Azure Files, Learn recommends **Storage File Data SMB Share Contributor** as the default share-level role. Setting ACLs requires **Storage File Data SMB Share Elevated Contributor** or the storage account key.

In the confirmed thread, the accepted answer listed these share and NTFS checks too, but the thread does not say that any permission had to be changed. The fix there was the local profile setting in the next step.

## Step 4: Look for an existing local profile

This was the cause in the one confirmed thread. The accepted answer was posted anonymously under the name of Microsoft Q&A support. It pointed out that FSLogix does not attach a container when a standard local profile already exists for the user, and it suggested deleting that profile or setting `DeleteLocalProfileWhenVHDShouldApply = 1` under `HKLM\SOFTWARE\FSLogix\Profiles`. The asker wrote that adding the value made the FSLogix profile load. The thread does not say whether a local profile was also deleted by hand.

Learn agrees with the mechanism. It says FSLogix honors an existing local profile by default, so the user seems to get a new profile. The setting deletes the local profile at sign-in when it exists and matches the profile container. The reference page says FSLogix permanently deletes it.

Use this setting with care:

1. List the local profiles on the host (**System Properties**, **Advanced**, **User Profiles**). The accepted answer named this place for deleting a local profile.
2. Decide whether any of them hold data that is not in a container.
3. Either delete the profile by hand, or enable the setting.

The thread does not state the root cause of why local profiles existed on a brand-new host pool. A user who signed in once before FSLogix was configured would explain it, but the thread does not say so.

## Step 5: Check whether the container is locked or in use

By default, FSLogix holds an exclusive lock on a container while the user is connected. If the user did not sign out of the first session, a second sign-in gets a temporary profile. Learn lists the options: allow the temporary profile, tell users to sign out, enable concurrent connections, or block sign-in with `PreventLoginWithTempProfile`.

Two registry values control how long FSLogix waits for a locked file. Learn's configuration reference gives defaults of `LockedRetryCount` = 12 and `LockedRetryInterval` = 5 seconds. An anonymous, support-style answer in the April 2026 thread suggested `LockedRetryCount` = 3 and `LockedRetryInterval` = 15, plus `CleanupInvalidSessions` = 1. That thread has no accepted answer, and Learn does not recommend those retry values. Learn does describe `CleanupInvalidSessions` (under `HKLM\SOFTWARE\FSLogix\Apps`, default 0) as a way to clean up sessions that ended abruptly. Test before you adopt any of these values.

The September 2025 thread suggested deleting `.lock` files and running `frx list-attachments` and `frx detach-all`. Neither the Learn pages used here nor the Learn frx page mention `.lock` files or these two commands. Check them on a test host before you use them, and only touch a user's files when that user is signed out.

## Step 6: Check container size and storage capacity

Learn says a container needs more than 200 MB free to attach. Compare `SizeInMBs` (default 30000) with the VHD(x) file's size on disk. You can raise `SizeInMBs` but not lower it. If the storage provider itself is full, Learn says users may get temporary or local profiles, sessions may hang, and containers may fail to mount or detach.

An anonymous answer in the April 2026 thread said Standard (HDD) Azure Files throttles under concurrent sign-ins and recommended Premium for hosts with ten or more users. Learn does not state this on the pages used here, so check Azure Files performance for your account before you decide.

## Step 7: Rule out naming changes

If users suddenly get an empty profile after a configuration change, check whether `FlipFlopProfileDirectoryName`, `SIDDirNameMatch`, `SIDDirNamePattern`, `VHDNameMatch` or `VHDNamePattern` changed. Learn says FSLogix then looks for a folder format that does not exist and creates an empty container. It says the original data is not lost. Either revert the setting and restart the FSLogix service, or rename the folders with all affected users signed out.

A similar question came up in a May 2026 thread. An administrator restored a VHDX from an Azure snapshot, renamed it, and FSLogix ignored it and created a small new one. The error was `0x0000003B`, "An unexpected network error occurred". That thread has no accepted answer. A moderator said there is no supported way to force an attach and listed access, permissions and `VHDLocations` as the first checks, and advised mounting the file manually on a test VM and keeping only one valid VHDX per user. That is a sensible checklist, but it is not a confirmed fix.

## Verify the result

1. Sign in as a test user and open `frxtray.exe` under `C:\Program Files\FSLogix\Apps`. The accepted answer in the confirmed thread named a green status with a logged-in profile as the healthy state. The asker did not report this check, and the Learn pages used here do not mention frxtray.
2. Find the new `LoadProfile` entry in the Profile log and confirm there is no `[ERROR` line.
3. Check that the VHD(x) file in the share was used and not just created.

## Limits

- Only the local profile case has a confirmed fix. All other thread answers here were never confirmed by the asker.
- Learn's troubleshooting page for old, temporary or local profiles warns about the April 2026 Windows Server update, which changes the default Kerberos encryption type from RC4 to AES-SHA1. It says file shares hosting containers that were not upgraded to AES-SHA1 may have access problems, and that the upgrade should be done before the update. The page still words this as an upcoming change, so if attach failures started after patching, check it early.
- AI-generated answers in these threads are not evidence. Their claims were left out unless Learn confirmed them.

## Related

- [FSLogix](https://www.m365.fm/entity/fslogix/)
- [Azure Virtual Desktop](https://www.m365.fm/entity/azure-virtual-desktop/)
- [AVD host pool](https://www.m365.fm/entity/avd-host-pool/)
- [Azure Files](https://www.m365.fm/entity/azure-files/)

## Sources

- [Microsoft Learn: Troubleshooting old, temporary or local profiles](https://learn.microsoft.com/en-us/fslogix/troubleshooting-old-temp-local-profiles)
- [Microsoft Learn: Troubleshooting container attach or detach](https://learn.microsoft.com/en-us/fslogix/troubleshooting-container-attach-detach)
- [Microsoft Learn: Troubleshooting events, logs and diagnostics](https://learn.microsoft.com/en-us/fslogix/troubleshooting-events-logs-diagnostics)
- [Microsoft Learn: Profile container configuration settings](https://learn.microsoft.com/en-us/fslogix/reference-configuration-settings)
- [Microsoft Learn: Configure storage permissions](https://learn.microsoft.com/en-us/fslogix/how-to-configure-storage-permissions)
- [Microsoft Learn: Local include and exclude groups](https://learn.microsoft.com/en-us/fslogix/concepts-include-exclude-groups)
- [Microsoft Learn: frx command-line utility](https://learn.microsoft.com/en-us/fslogix/utilities/frx/frx)
- [Microsoft Q&A: FSlogix Profiles Not Loading (December 2025)](https://learn.microsoft.com/en-us/answers/questions/5651782/fslogix-profiles-not-loading)
- [Microsoft Q&A: Temporary FSLogix Profile Issue (September 2025)](https://learn.microsoft.com/en-us/answers/questions/5552219/temporary-fslogix-profile-issue)
- [Microsoft Q&A: 2 issues with Azure Virtual Desktops / RemoteApps (April 2026)](https://learn.microsoft.com/en-us/answers/questions/5863102/2-issues-with-azure-virtual-desktops-remoteapps)
- [Microsoft Q&A: FSLogix Profile Failed to Attach After Restoring VHDX from Azure Snapshot (May 2026)](https://learn.microsoft.com/en-us/answers/questions/5882382/fslogix-profile-failed-to-attach-after-restoring-v)
