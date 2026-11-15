---
title: "Teams Meeting Add-in Missing in Classic Outlook: Fix Add-in Problems"
summary: "Fix a missing Teams Meeting add-in in classic Outlook: check Active and Disabled add-ins, re-register the Teams Addin Loader, verify LoadBehavior and the trusted add-ins policy, restore it after the move to new Teams and fix missing join details for delegates. New Outlook does not use this add-in."
status: review
publish: false
author: mirko-p
date: 2027-01-23
topics: [teams, outlook, exchange-online-powershell]
keypoints:
  - "The new Outlook for Windows does not support the Teams COM add-in. It has a native Teams meeting capability instead, so these steps are for classic Outlook."
  - "First check File, Options, Add-ins for Microsoft Teams Meeting Add-in for Microsoft Office in the active list, and enable it under COM Add-ins if it is disabled."
  - "Re-register Microsoft.Teams.AddinLoader.dll with regsvr32 from the TeamsMeetingAddin folder, with the 64-bit or 32-bit command that matches Office."
  - "Check that LoadBehavior under TeamsAddin.FastConnect is 3, and that the Outlook security policy promptoomaddressinformationaccess does not deny programmatic access."
  - "Missing join details for delegates come from a delegator mailbox hidden from the GAL. Unhide it with Set-Mailbox HiddenFromAddressListsEnabled false."
faq:
  - q: "Does this apply to new Outlook?"
    a: "No. Microsoft Learn says the new Outlook for Windows does not support the Teams COM add-in, also called the Teams add-in for Outlook. New Outlook has a native Teams meeting capability. If you do not see it there, Learn points to a separate Microsoft Support article about the Teams meeting add-in missing in new Outlook."
  - q: "Why is the add-in missing for some users only?"
    a: "Learn lists several causes for classic Outlook: a problematic installation of the add-in, a switch from classic Teams to new Teams, a disabled add-in, registry or policy settings, or a mailbox hidden from the Global Address List. Start with the add-in status in Outlook, then reregister the loader and check the registry."
  - q: "What are the prerequisites for the add-in to install?"
    a: "The page says users need the Teams desktop client, because the add-in cannot be installed if only the Teams web client is used. They need Outlook 2016 or later with all available Outlook updates, and Outlook must not run in Administrator mode when you restart it after re-registering the loader."
  - q: "Why did the add-in disappear after moving to new Teams?"
    a: "After classic Teams is uninstalled and new Teams is installed, the add-in does not load and is removed from Outlook. Learn describes uninstall options including the new Teams only policy. To reinstall in non-VDI environments, check the add-in version in Installed apps, run the matching uninstall script, start new Teams and wait for the add-in to appear before restarting Outlook."
  - q: "Why are the meeting URL and dial-in numbers missing for a delegate?"
    a: "When a delegate schedules a meeting in a delegated calendar and the delegator's mailbox is hidden from the global address list, the add-in cannot get the information to fill in the URL, the meeting ID and passcode, and the dial-in numbers. Unhide the mailbox with Set-Mailbox and HiddenFromAddressListsEnabled set to false, then have the delegate restart Outlook and create a new meeting request."
---

The Teams Meeting add-in puts the **New Teams Meeting** command into the classic Outlook calendar. When it is missing, Microsoft Learn offers a sequence of checks: add-in status, loader registration, registry and policy settings, the classic-to-new Teams transition, and a fix for delegate scenarios. The page's canonical title is "Fix Teams Meeting add-in problems in Classic Outlook". This article follows it.

## First: which Outlook?

Learn says the new Outlook for Windows does not support the Teams COM add-in. New Outlook has a native capability to schedule Teams meetings. If that capability is missing in new Outlook, Learn points to a Microsoft Support article for new Outlook. Everything below is about classic Outlook.

## Check 1: Is the add-in enabled?

1. In Outlook, select **File** > **Options** > **Add-ins**.
2. Look for **Microsoft Teams Meeting Add-in for Microsoft Office** under **Active Application Add-ins**.
3. If it is listed under **Disabled Application Add-ins** instead, choose **Manage** > **COM Add-ins**, then **Go**.
4. Select the check box next to the add-in, select **OK** on every dialog and restart Outlook.

## Check 2: Re-register the Teams Addin Loader

Prerequisites from the page:

- Users have the Teams desktop client. The add-in cannot be installed with only the Teams web client.
- Outlook 2016 or later, with all available updates.

Steps:

1. Exit Outlook and Teams.
2. In File Explorer, open `%LocalAppData%\Microsoft\TeamsMeetingAddin`. Pick the subfolder that matches the version number, or the highest build number if several share a version, and copy its path, for example `%LocalAppData%\Microsoft\TeamsMeetingAddin\1.0.23334.11`.
3. In an elevated Command Prompt run the command for your Office bitness:

```
%SystemRoot%\System32\regsvr32.exe /n /i:user <path>\x64\Microsoft.Teams.AddinLoader.dll
%SystemRoot%\SysWOW64\regsvr32.exe /n /i:user <path>\x86\Microsoft.Teams.AddinLoader.dll
```

The first line is for 64-bit Office and the second for 32-bit Office.

4. Restart the Teams desktop client, sign out and sign in again.
5. Restart Outlook, and make sure it is not running in Administrator mode.

## Check 3: Registry and policy

Learn warns that wrong registry entries can cause serious problems and says to back up the registry first.

**Load behavior.** In `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\Outlook\Addins\TeamsAddin.FastConnect` the `LoadBehavior` value should be **3**. If it is not, change it to 3 and restart Outlook.

**Object model prompt policy.** Look in `HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Office\16.0\Outlook\Security`, or, if you use Cloud Policy service, in `HKEY_CURRENT_USER\SOFTWARE\Policies\Microsoft\Cloud\Office\16.0\Outlook\Security`. Cloud Policy settings take precedence over Group Policy on Windows. If the `promptoomaddressinformationaccess` entry has value **0**, the policy is set to Automatically deny, and Outlook denies programmatic access requests from any program.

**Trusted add-ins policy.** If *Configure trusted add-ins* is configured, either disable or unconfigure it, or make sure `Microsoft.Teams.AddinLoader.dll` is in the trusted list with a correct hash. Compute the hash with `Get-FileHash`. The page notes that the DLL is updated automatically with the Teams client, so the hash must be kept up to date.

## Missing after the move to new Teams

Classic Teams can be uninstalled by the normal Windows uninstall options, by an administrative policy that removes classic Teams, or by the new Teams only policy setting, where new Teams removes classic Teams after a set time. After the upgrade, the add-in does not load and is removed from Outlook.

To reinstall in non-VDI environments:

1. Quit Teams and close Outlook.
2. Check the add-in version in **Start** > **Settings** > **Apps** > **Installed apps**, searching for Teams Meeting Add-in.
3. If nothing is found, or the version starts with 1.23, download and run `UninstallOldTMA.ps1` in an elevated PowerShell window.
4. If the version does not start with 1.23, download and run `UninstallTMA.ps1` in PowerShell.
5. Start new Teams and wait until the add-in appears in Installed apps.
6. Restart Outlook.

## Join details missing for delegates

When a delegate schedules a Teams meeting in a delegated calendar for the delegator, the meeting request lacks the URL, the meeting ID and passcode, and the dial-in numbers. Learn says this happens if the delegator's mailbox is hidden from the global address list (GAL), because the add-in cannot get the information it needs.

Run this in Exchange Online PowerShell:

```powershell
Set-Mailbox -Identity <delegator's email address> -HiddenFromAddressListsEnabled $false
```

Verify the mailbox is visible in the GAL, ask the delegate to restart Outlook and create a new meeting request.

## Order of work (my advice)

This is my suggestion, not a Microsoft procedure:

1. Confirm classic or new Outlook before anything else, since the checks do not apply to new Outlook.
2. Check the Disabled list and `LoadBehavior` first. They are quick and reversible.
3. Look for a policy that denies programmatic access when only some users are affected, since policies often target groups.
4. After a move to new Teams, handle the add-in as part of the rollout, not as a user ticket.
5. For delegates, check whether the executive mailbox is hidden from the address list on purpose, and decide before you unhide it.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Microsoft Outlook](https://www.m365.fm/entity/outlook/)
- [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/)

## Sources

- [Fix Teams Meeting add-in problems in Classic Outlook (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/meetings/resolve-teams-meeting-add-in-issues)
