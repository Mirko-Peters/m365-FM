---
title: "Install the Exchange Online PowerShell Module (Step by Step)"
summary: "Install the Exchange Online PowerShell module with Install-Module ExchangeOnlineManagement: requirements, scope, version check, updates and error fixes."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [exchange-online-powershell, powershell]
keypoints:
  - "Install the Exchange Online PowerShell module with Install-Module -Name ExchangeOnlineManagement, in a PowerShell window run as administrator for all users."
  - "Use -Scope CurrentUser if you can't use administrator rights. Update the module later with the same scope you used to install it."
  - "Windows PowerShell 5.1 needs .NET Framework 4.7.2. PowerShell 7 support depends on the module version, and 3.10.0 or later needs PowerShell 7.6.0."
  - "Check the result with Get-InstalledModule, which shows the version and whether the module sits in the all-users or current-user location."
  - "The module no longer needs Basic authentication in WinRM, because its connections use REST."
faq:
  - q: "What is the command to install the Exchange Online PowerShell module?"
    a: "Run Install-Module -Name ExchangeOnlineManagement in a PowerShell window run as administrator to install it for all users. If you can't do that, add -Scope CurrentUser. Afterwards, Get-InstalledModule ExchangeOnlineManagement shows the installed version. The module comes from the PowerShell Gallery."
  - q: "Do I need admin rights to install ExchangeOnlineManagement?"
    a: "Only for an all-users install. Administrator rights are required when you install for all users, but not when you install with -Scope CurrentUser. Keep the scope consistent, because Microsoft says to update the module with the same scope you used to install it."
  - q: "How do I update or remove the Exchange Online PowerShell module?"
    a: "Update it with Update-Module -Name ExchangeOnlineManagement, adding -Scope CurrentUser if you installed it that way. Remove it with Uninstall-Module -Name ExchangeOnlineManagement, as administrator if it was installed for all users. Afterwards, Get-InstalledModule shows whether any copy of the module is left on the machine."
---
To install the Exchange Online PowerShell module, open PowerShell as administrator and run `Install-Module -Name ExchangeOnlineManagement`. That installs the module for all users on the computer. If you can't run it as administrator, add `-Scope CurrentUser` and it installs for your own account only. This article is for Exchange and Microsoft 365 admins who set up a new admin PC, a jump server or a build agent. It covers the requirements, the install and verification steps, updating and removing the module, and the errors people hit most often.

## What the module is and what you need first

The module is called `ExchangeOnlineManagement`. Microsoft's documentation calls it the Exchange Online PowerShell V3 module. It connects you to [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/), to Security & Compliance PowerShell and to PowerShell for the built-in security add-on for on-premises mailboxes. It uses modern authentication, so it works with or without multifactor authentication.

One change affects older scripts. Microsoft says that since October 2023, REST API connections have replaced the old remote PowerShell connections with Basic authentication. The module's connections don't need Basic authentication in WinRM, so there is nothing to switch on there.

Before you install, check these prerequisites:

- **PowerShell version and .NET.** Windows PowerShell 5.1 needs .NET Framework 4.7.2. Windows 11, Windows Server 2022 and Windows Server 2025 ship with 4.8.x, so you're fine there. PowerShell 7 works too, and the minimum version depends on the module version, which the next section explains.
- **Execution policy.** Microsoft's page says that without a suitable execution policy you get the error "Files cannot be loaded because running scripts is disabled on this system". Its documented fix is `Set-ExecutionPolicy RemoteSigned`, run as administrator. Read Microsoft's page on execution policies before you change it, and ask your security team first if the machine is managed.
- **PowerShellGet and PackageManagement.** REST connections on Windows need PowerShellGet, and PowerShellGet depends on PackageManagement. Without them you may see an error about a missing `Update-ModuleManifest` cmdlet. Microsoft also says that preview versions of these two modules can cause connection problems, and it gives a command to list the installed versions: `Get-InstalledModule PackageManagement -AllVersions; Get-InstalledModule PowerShellGet -AllVersions`.
- **TLS 1.2.** On Windows PowerShell 5.1 with an older Windows, the PowerShell Gallery requires TLS 1.2 or later. If the download fails with a connection error on an old server, this is the first thing to check.

A very old system is a dead end. Windows 7 SP1 and Windows Server 2008 R2 SP1 only get module version 2.0.3, and Microsoft says that version can't connect because it lacks REST support.

## Which PowerShell version fits which module version

Windows PowerShell 5.1 works with all module versions, with the .NET requirement above. For PowerShell 7, Microsoft lists this mapping:

- Module 3.10.0 or later needs PowerShell 7.6.0 or later, which uses .NET 10.
- Modules 3.5.0 to 3.9.2 need PowerShell 7.4.0 or later, which uses .NET 8.
- Modules 3.0.0 to 3.4.0 need PowerShell 7.2.0 or later, which uses .NET 6.
- Module 2.0.4 and later versions of the 2.x line need PowerShell 7.0.3.

So if you installed the latest module on a machine with PowerShell 7.4, expect trouble. Either update PowerShell, or install an older module version with `-RequiredVersion`. At the time of writing, Microsoft lists 3.10.1 as the current version. Check the module page for the number that applies when you read this.

Microsoft also supports the module on Linux and macOS. On Linux, connecting through a proxy needs module version 3.0.0 or later. On both systems, `Connect-IPPSSession`, and with it Security & Compliance PowerShell, isn't available in PowerShell 7. If you manage Exchange Online from a Mac, that's the one limit to know before you plan your tooling.

Windows 10 deserves a short note. Consumer editions reached end of support in October 2025, and Microsoft says they don't support .NET 8.0 or .NET 10.0. For module 3.5.0 and later with PowerShell 7.4 or later, only the Enterprise and IoT LTSC editions that are still in support work.

## Check your PowerShell version before you install

A two-minute check saves a lot of guessing later. In the window where you plan to work, run `$PSVersionTable.PSVersion` to see which [PowerShell](https://www.m365.fm/entity/powershell/) version you're using. Compare the result with the mapping above. On Windows PowerShell 5.1 you also want to know the PowerShellGet version, so run `Get-InstalledModule PowerShellGet -AllVersions`. If that command lists a preview version, remove it or update to a stable release before you go on. Microsoft's module page names preview builds of PowerShellGet and PackageManagement as a source of connection problems.

Write down the result next to the machine name if you manage more than a handful of servers. When a colleague reports a failed connection three months later, you can compare the versions in seconds.

## How to install the Exchange Online PowerShell module step by step

These steps work in Windows PowerShell 5.1 and in PowerShell 7.

1. Open PowerShell. Choose **Run as administrator** if you want to install for all users. Skip that if you plan to install for the current user only.
2. If this is the first module you install on the machine, update PowerShellGet first, then close and reopen PowerShell. Microsoft recommends this order before the first install.
3. Run `Install-Module -Name ExchangeOnlineManagement` for all users. For your own account only, run `Install-Module -Name ExchangeOnlineManagement -Scope CurrentUser`.
4. Answer any prompt PowerShell shows during the install. Your organization must allow access to the PowerShell Gallery for the download to work.
5. Verify the install with `Get-InstalledModule ExchangeOnlineManagement | Format-List Name,Version,InstalledLocation`.
6. Read the `InstalledLocation` line. A path under `%ProgramFiles%\WindowsPowerShell\Modules\` means the module is installed for all users. A path in your Documents folder means it's installed for the current user only.
7. Test it in a new window with `Connect-ExchangeOnline -UserPrincipalName admin@contoso.com`. For the connection details, see the [Connect to Exchange Online PowerShell](https://learn.microsoft.com/en-us/powershell/exchange/connect-to-exchange-online-powershell?view=exchange-ps) article.

Want a preview build? Add `-AllowPrerelease`. To pick a specific preview, combine it with `-RequiredVersion`. `Find-Module ExchangeOnlineManagement -AllVersions -AllowPrerelease` lists what's available, and leaving out `-AllowPrerelease` lists only the public versions. Don't put a preview build on a production admin server unless you have a reason. Test it on a spare machine first.

## Update and uninstall the module

Microsoft publishes new module versions regularly, and the release notes on its module page show what changed. Version 3.7.0, for example, stopped loading command-line help by default, and version 3.9.2 deprecated the `UseRpsSession` parameter. Updating is a one-liner: `Update-Module -Name ExchangeOnlineManagement`. For a current-user install, add `-Scope CurrentUser`. Microsoft says to use the same scope you used to install. A mismatch can leave you with an install in both locations and no clear idea which one PowerShell uses.

That's the reason the `Get-InstalledModule` check in step 5 is worth running before and after an update. If you see two versions, find out which scope each belongs to.

To remove the module, run `Uninstall-Module -Name ExchangeOnlineManagement`. If it was installed for all users, do that as administrator. Close your open PowerShell windows afterwards, because a module that's already loaded stays in memory until its session ends.

## Fix common install errors

Microsoft's module page lists a few specific errors and fixes.

- **"No match was found for the specified search criteria and module name 'ExchangeOnlineManagement'".** Run `Register-PSRepository -Default`, which registers the PowerShell Gallery as a repository again. Then try the install again.
- **Errors about PowerShellGetFormatVersion, or about being unable to download providers.** Update PowerShellGet and restart PowerShell.
- **Download fails on an older Windows PowerShell 5.1 machine.** The PowerShell Gallery needs TLS 1.2 or later. Microsoft links a blog post about the gallery's TLS support for the details.
- **"Files cannot be loaded because running scripts is disabled on this system".** Set the execution policy as described above, as administrator.
- **"Cannot find a cmdlet Update-Manifest" or a similar message about `Update-ModuleManifest` when you connect.** PowerShellGet or PackageManagement is missing. Install both and restart PowerShell.

If an install works but the connection later fails with an odd assembly error, the cause is usually another module in the same session. Open a new window and connect first.

## Common mistakes

- **Mixing scopes.** Installing for all users once and updating with `-Scope CurrentUser` later leaves two versions on the machine. Pick one scope and keep it.
- **Running the wrong PowerShell version for the module.** The newest module with an older PowerShell 7 fails in ways that look like connection errors. Compare your versions with the table above.
- **Installing a preview version on a production host.** Preview versions are for testing. Use the public version for daily work.
- **Ignoring PowerShellGet.** A missing or preview PowerShellGet can break REST connections, as Microsoft's page describes. Check it first when a fresh install won't connect.
- **Following old tutorials.** Guides that tell you to enable Basic authentication in WinRM describe the retired remote PowerShell method. You don't need it.

## Related topics to explore

- Connect with the module: once it's installed, the next question is how to sign in, with or without MFA, which the article on the [Exchange Online PowerShell module](https://learn.microsoft.com/en-us/powershell/exchange/exchange-online-powershell-v2?view=exchange-ps) and its connection companion cover.
- App-only authentication: scheduled scripts need a certificate or managed identity, not a typed password.
- Using the module in PowerShell 7 on Linux and macOS: the supported versions differ by operating system, so check the compatibility list first.
- Controlling who can use PowerShell: an Exchange admin can enable or disable access to Exchange Online PowerShell per user.
- Keeping modules current: set a regular reminder to check for new module versions, because Microsoft raises the minimum PowerShell version from time to time.

## Next step

To install the Exchange Online PowerShell module, run `Install-Module -Name ExchangeOnlineManagement`, verify it with `Get-InstalledModule`, and keep the scope the same for every later update. Then connect with `Connect-ExchangeOnline` in a fresh window and run `Get-AcceptedDomain` to prove the setup works.
