---
title: "New Teams Installation Fails: Fix Installation Issues for the New Teams App"
summary: "Three symptoms from the Learn page: Due to org policy you cannot install, We have run into an issue on Windows 10, and the missing Try the new Teams toggle. Registry keys and policies to check, WebView2, logs and the toggle block codes."
status: review
publish: false
author: mirko-p
date: 2027-01-26
topics: [teams, group-policy]
keypoints:
  - "Due to org policy you cannot install the new Teams points to MSIX installation blocked by policy or registry keys such as BlockNonAdminUserInstall and AllowAllTrustedApps."
  - "In the Local Group Policy Editor, the two App package Deployment settings should be Not configured."
  - "On Windows 10, the message We have run into an issue is fixed by installing the WebView2 Runtime, then restarting Teams."
  - "The toggle can be hidden by sign-in restrictions, VDI, or a Teams for Life account. The log search term is appswitcher_appstateservice_check."
  - "Windows 11 version 21H1 SV1 (build 10.0.22000) stays blocked if Allow all trusted apps to install is disabled. Upgrade Windows."
faq:
  - q: "What does Due to org policy, you cannot install the new Teams mean?"
    a: "The Learn page says restrictions prevent the download and installation. The MSIX package installation can be blocked by registry keys set by Group Policy or a third-party tool. The keys it names are BlockNonAdminUserInstall, AllowAllTrustedApps and AllowDevelopmentWithoutDevLicense."
  - q: "Where are those registry keys?"
    a: "At either HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock or HKEY_LOCAL_MACHINE\\SOFTWARE\\Policies\\Microsoft\\Windows\\Appx, according to the page. The related Group Policy settings are Prevent non-admin users from installing packaged Windows apps and Allow all trusted apps to install."
  - q: "What do I do about We have run into an issue on Windows 10?"
    a: "Download and install the WebView2 Runtime from the Microsoft developer page that the article links, then restart the Teams desktop app and try again."
  - q: "Why is the Try the new Teams toggle missing?"
    a: "The page lists sign-in restrictions set by the admin, a virtual desktop infrastructure computer such as Citrix or VMware, and sign-in to classic Teams with a Teams for Life account, with or without a work account. It also says to confirm the minimum Windows and Teams versions."
  - q: "Can I install if Allow all trusted apps to install is disabled?"
    a: "The page says you can on Windows 10 or Windows 11 update version 10D or later. On Windows 11 version 21H1 SV1 (build 10.0.22000) you stay blocked and must upgrade to a newer Windows 11 version."
---

When users try to install the new Microsoft Teams client, three kinds of problems come up on the Microsoft Learn page for this topic: an organization policy message, a generic issue message on Windows 10, and a missing opt-in toggle. This article follows that page. The page starts with a pre-installation check script, and I do too, because it tests several of the points below at once. Own advice is marked.

## Start here: the pre-installation check

The page tells you to run the pre-installation check script for the new Teams and follow its suggested resolutions. I did not read the script page, so I cannot describe its output. Run it on an affected computer first, then use the sections below for what it finds.

## Symptom 1: Due to org policy, you can't install the new Teams

The full message is: Due to org policy, you can't install the new Teams. For more info, contact your IT admin.

The page says restrictions prevent the download and installation. The MSIX package installation might be blocked by registry keys set by Group Policy or a third-party tool. The keys that can block it:

- `BlockNonAdminUserInstall`
- `AllowAllTrustedApps`
- `AllowDevelopmentWithoutDevLicense`

They can be found at either of these locations:

- `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock`
- `Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Appx`

Known Group Policy settings that could prevent installation, per the page:

- Prevent non-admin users from installing packaged Windows apps
- Allow all trusted apps to install (disabled)

One fixed issue is worth knowing: the page says that when `AllowAllTrustedApps` is disabled, the new Teams (MSIX) installation fails, and that this was fixed in the optional October 2023 cumulative updates, KB5031445 for Windows 10 (OS build 19045.3636) and KB5031455 for Windows 11 (OS build 22621.2506). If the optional update is not available for your build, the page says the November security update includes the fix. Those updates date from 2023, so in my experience a computer that is far behind on Windows updates is the first candidate for this case.

### Check the policies on a computer

1. Search for **Edit Group Policy**, or run `gpedit.msc`, to open the Local Group Policy Editor.
2. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **App package Deployment**.
3. Check **Prevent non-admin users from installing packaged Windows apps** and **Allow all trusted apps to install**.
4. Both should be **Not configured**.

For many computers the page points to its article on bulk upgrade to the new Teams, which I did not read.

## Install even if the policy is disabled

The page says you might still install the new Teams when **Allow all trusted apps to install** is **Disabled**:

- On Windows 10 or Windows 11 update version 10D or later, you can still download and install it.
- On Windows 11 version 21H1 SV1 (build 10.0.22000) you stay blocked. Upgrade to a newer version of Windows 11.

## Symptom 2: We've run into an issue (Windows 10)

Windows 10 users can get this message when they download and install the new Teams. The page's fix: download and install the WebView2 Runtime, then restart the Teams desktop app and try again.

## Symptom 3: The Try the new Teams toggle is missing

Start with the basics from the page:

- Restart the current client before you turn the toggle on, and install pending Windows updates, including security updates, before you try to install.
- If the toggle is missing, make sure you run the minimum required versions of Windows and Teams. The page does not list the versions in this section.
- After you switch, if you cannot find the toggle at the top left to go back and forth between the new Teams and Teams classic, start the version you want from the Start menu or the taskbar.

### Conditions that can hide the toggle

- The admin set up sign-in restrictions.
- The user is on a virtual desktop infrastructure computer, such as Citrix or VMware.
- The user is signed in to classic Teams with a Teams for Life account together with a work account.
- The user is signed in to classic Teams with a Teams for Life account.

### Find out which condition applies

1. Open the logs in `%appdata%/Microsoft/Teams`.
2. Open `logs.txt`.
3. Search for `appswitcher_appstateservice_check`.
4. Read the `enggComplete` flag. True means Microsoft turned the setting on for you. False means it is not on yet, or the app needs a restart.
5. Read the `isAboveWin10Vibranium` flag. True means the OS version is high enough for the app switcher. False means it is older than supported.
6. Compare the code with this table from the page.

| Code | Meaning |
| --- | --- |
| TFLONLY | Signed in to only Teams for Life |
| TFLANDTFW | Signed in to Teams for Life and Teams for Work |
| SPECIALCLOUD | Signed in to a special cloud that is not supported |
| CROSSCLOUD | Signed in to a government cloud |
| VDI | On a VDI computer (VMware, Citrix, AVD/WV) |
| SIGNINRESTRICTED | Signed in to the specified tenant, but the toggle does not appear |

### If some people do not see the toggle

Check the minimum requirements for the Teams desktop app, then sign out and back in. If that fails, the page gives these steps:

1. Right-click the Teams icon in the taskbar and select **Quit**.
2. In File Explorer, go to `%appdata%/Microsoft/Teams`.
3. Delete all the folder contents. The page says the Teams app and custom settings are not deleted. If a file cannot be deleted, select **Skip**.
4. Start Teams, right-click the icon and select **Quit** again.
5. Start Teams once more. The toggle should now appear.

## The Update and restart message

After a user opts in, an **Update and restart** message can appear in the title bar. The page says this is expected. Select the link to restart.

## Checking order (my advice)

This is my suggestion, not the order of the page:

1. Run the pre-installation script and read its findings.
2. Match the message: org policy goes to the registry keys and Group Policy, "We've run into an issue" on Windows 10 goes to WebView2, a missing toggle goes to the log codes.
3. For a policy block, find out where the setting comes from before you change it. A key set by a third-party tool comes back after you change it by hand.
4. Keep Windows up to date before you test again, since the page names an update fix for one policy case.
5. For VDI and special clouds, expect the toggle to stay hidden, as the codes say, and plan around it.

## Related

- [Microsoft Teams](https://www.m365.fm/entity/teams/)
- [Group Policy](https://www.m365.fm/entity/group-policy/)

## Sources

- [Resolve the new Teams installation issues (Microsoft Learn)](https://learn.microsoft.com/troubleshoot/microsoftteams/teams-administration/fix-new-teams-installation-issues)
