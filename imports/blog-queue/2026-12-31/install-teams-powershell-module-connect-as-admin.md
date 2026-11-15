---
title: "Install the Teams PowerShell Module and Connect as an Admin: Requirements and Updates"
summary: "How to install, connect, update and uninstall the MicrosoftTeams PowerShell module, based on the Microsoft Learn article: supported PowerShell versions, the install commands, the untrusted repository prompt, offline install, Connect-MicrosoftTeams and update behavior."
status: review
publish: false
author: mirko-p
date: 2026-12-31
topics: [powershell, teams-admin-center, teams]
keypoints:
  - "The module needs Windows PowerShell 5.1 or PowerShell 7.2 or later. The page's Windows PowerShell 5.1 steps also install .NET Framework 4.7.2 or later."
  - "Install PowerShellGet first with Install-Module -Name PowerShellGet -Force -AllowClobber, then install MicrosoftTeams the same way."
  - "Run Connect-MicrosoftTeams to sign in. The page does not describe roles, device code sign-in or certificate authentication."
  - "Update-Module MicrosoftTeams fails if the module is imported, so run the update in a new elevated session."
  - "Uninstall with Uninstall-Module MicrosoftTeams, and add -AllVersions to remove every installed version."
faq:
  - q: "Which PowerShell versions does the Teams module support?"
    a: "According to Microsoft Learn, Windows PowerShell 5.1 or PowerShell 7.2 or later on all platforms. The page's Windows PowerShell 5.1 example also installs .NET Framework 4.7.2 or later."
  - q: "How do I install the module?"
    a: "According to Microsoft Learn, run Install-Module -Name PowerShellGet -Force -AllowClobber, and then Install-Module -Name MicrosoftTeams -Force -AllowClobber."
  - q: "How do I sign in after installing?"
    a: "The Learn article uses the Connect-MicrosoftTeams cmdlet."
  - q: "Why does Update-Module fail?"
    a: "According to Microsoft Learn, the update fails if the module is currently imported. Open a new elevated PowerShell session and run Update-Module MicrosoftTeams there."
  - q: "Can I install without internet access on the machine?"
    a: "The Learn article points to a manual download from the PowerShell Gallery through aka.ms/psgallery-manualdownload for offline installation."
---

To manage Teams from PowerShell you install the MicrosoftTeams module from the PowerShell Gallery and sign in with Connect-MicrosoftTeams. This guide follows the Microsoft Learn article on installing Microsoft Teams PowerShell. It also lists what the article does not cover, such as roles and sign-in methods.

## Requirements

Learn says the Teams module requires Windows PowerShell 5.1 or PowerShell 7.2 or later on all platforms, and recommends installing the latest version of PowerShell available for your operating system. The worked example on the page uses Windows PowerShell 5.1, which needs .NET Framework 4.7.2 or later. If you are on Windows 10 version 1607 or higher, PowerShell 5.1 is already installed.

To check your PowerShell version, run:

```powershell
$PSVersionTable.PSVersion
```

Learn recommends using the `Install-Module` cmdlet to install the module.

## Install the module

The page lists these steps for Windows PowerShell 5.1:

1. Update to Windows PowerShell 5.1 if needed.
2. Install .NET Framework 4.7.2 or later.
3. Install the latest PowerShellGet.
4. Install the Teams module.

Steps 3 and 4 use these commands:

```powershell
Install-Module -Name PowerShellGet -Force -AllowClobber
Install-Module -Name MicrosoftTeams -Force -AllowClobber
```

The page gives no PowerShellGet version requirement beyond installing the latest one.

### The untrusted repository prompt

If the PowerShell Gallery is not configured as a trusted repository for PowerShellGet, the first use shows an Untrusted repository message. It says you are installing modules from an untrusted repository, and mentions that you can change the InstallationPolicy value with the `Set-PSRepository` cmdlet. The options are Yes, Yes to All, No, No to All, Suspend and Help, and the default is No. Learn says to answer **Yes** or **Yes to All** to continue. The page gives no example command for trusting the gallery.

### Offline install

Learn says that in some environments it is not possible to connect to the PowerShell Gallery. In that case follow the manual installation steps at `aka.ms/psgallery-manualdownload`. The steps themselves are not on the Teams page.

## Connect

Sign in with:

```powershell
Connect-MicrosoftTeams
```

Learn says to sign in with your Azure credentials to start working with the module. The page shows the cmdlet with no parameters. It does not describe which admin roles are needed, device code sign-in or certificate-based authentication. What you can do after you connect depends on your account and on each cmdlet, so check the reference for the cmdlet you plan to run.

## Update the module

Learn says to update a module with the same method you used to install it. For a module installed with `Install-Module`, run:

```powershell
Update-Module MicrosoftTeams
```

Learn warns that if Teams PowerShell is already imported into your session, the update fails. Close PowerShell and open a new elevated PowerShell session. The article does not describe a command to check which version is installed.

## Uninstall the module

```powershell
Uninstall-Module MicrosoftTeams
```

Open a new PowerShell session first. To remove all versions, run `Uninstall-Module MicrosoftTeams -AllVersions`.

## Page date

The version of the page I read has a content date of 2026-02-20 and no next-steps or related-topics section.

## Not the same as the Exchange Online module

This section is background that the Learn page does not state. Teams and Exchange Online use different PowerShell modules. If you need to manage mail flow or mailboxes, that is a separate module with its own install steps.

## Suggestion: a safe routine

This section is a practical suggestion and not a Microsoft statement.

1. Use one PowerShell version for your Teams admin scripts, so behavior is the same on every machine.
2. Run installs and updates in a fresh session, so the module is not already imported.
3. After an update, close all sessions and connect again.
4. Write down the module version in scripts that you share, so colleagues can match it.
5. Before you run a script that changes calling or policy settings, test it with a single test user.

## Not covered

The pages I read do not describe the following:

- Admin roles needed to run cmdlets.
- Device code, certificate or non-interactive authentication.
- A module version number or a minimum module version, and preview or prerelease versions.
- A command to check the installed module version.
- Setup for macOS or Linux beyond the statement that PowerShell 7.2 or later works on all platforms.
- Troubleshooting for failed installs.

## Related

- [PowerShell](https://www.m365.fm/entity/powershell/)
- [Teams admin center](https://www.m365.fm/entity/teams-admin-center/)
- [Microsoft Teams](https://www.m365.fm/entity/teams/)

## Sources

- [Install Microsoft Teams PowerShell (Microsoft Learn)](https://learn.microsoft.com/microsoftteams/teams-powershell-install)
