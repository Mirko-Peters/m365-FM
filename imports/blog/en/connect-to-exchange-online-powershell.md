---
title: "Connect to Exchange Online PowerShell: Step-by-Step Guide"
summary: "Connect to Exchange Online PowerShell with Connect-ExchangeOnline: requirements, interactive sign-in, MFA, partner and unattended options, and error fixes."
status: approved
publish: true
author: mirko-p
date: 2026-11-12
topics: [exchange-online-powershell, powershell]
keypoints:
  - "To connect to Exchange Online PowerShell, load the module and run Connect-ExchangeOnline with your admin account in UPN format."
  - "Interactive sign-in works with and without multifactor authentication, so you don't need a separate MFA workaround."
  - "Basic authentication and the old New-PSSession method are no longer supported, so scripts that rely on them need a rewrite."
  - "Use Get-AcceptedDomain as a quick test after connecting, and always end the session with Disconnect-ExchangeOnline."
  - "Unattended scripts should use app-only authentication or a managed identity instead of a stored password."
faq:
  - q: "What command connects to Exchange Online PowerShell?"
    a: "Run Connect-ExchangeOnline -UserPrincipalName admin@yourdomain.com after loading the ExchangeOnlineManagement module. A sign-in window opens, and you complete the password and any multifactor prompt there. When no error appears, you're connected. Test it with Get-AcceptedDomain and finish with Disconnect-ExchangeOnline."
  - q: "Does Connect-ExchangeOnline work with multifactor authentication?"
    a: "Yes. Interactive sign-in supports multifactor authentication, and the verification code arrives through whatever method the account uses, such as text message or Microsoft Authenticator. In PowerShell 7 the -Device parameter also supports MFA and suits computers without a browser. Basic authentication does not work with MFA and is no longer supported."
  - q: "How do I disconnect from Exchange Online PowerShell?"
    a: "Run Disconnect-ExchangeOnline, or Disconnect-ExchangeOnline -Confirm:$false to skip the confirmation prompt. Don't just close the window. Microsoft warns that doing so can use up your available sessions, and then you have to wait for them to expire before you can connect again."
---
To connect to Exchange Online PowerShell, load the `ExchangeOnlineManagement` module and run `Connect-ExchangeOnline -UserPrincipalName admin@yourdomain.com`. A sign-in window opens, you enter your password and approve the MFA prompt, and the shell is connected. This article is for Exchange and Microsoft 365 admins who need the exact steps, the options for partner and unattended access, and a short list of fixes when the connection fails. It follows the current [Microsoft documentation](https://learn.microsoft.com/en-us/powershell/exchange/connect-to-exchange-online-powershell?view=exchange-ps), so the commands here assume modern authentication and no remote PowerShell session.

## What you need before you connect

The connection command comes from the module, so the module has to be installed first. If you haven't done that yet, install it from the PowerShell Gallery with `Install-Module -Name ExchangeOnlineManagement`. The module is called the V3 module in Microsoft's documentation. Microsoft covers both Windows PowerShell 5.1 and PowerShell 7. For PowerShell 7 you need module version 2.0.4 or later.

Four other things decide whether the connection works:

- **Permissions.** Role-based access control decides which cmdlets you can run once you're in. Connecting is not the hard part, running the right cmdlet is. Microsoft has a page on finding the permissions a cmdlet needs, and it's worth bookmarking.
- **PowerShell access for the account.** The account must be allowed to use [Exchange Online PowerShell](https://www.m365.fm/entity/exchange-online-powershell/). If an admin has turned that off for your user, the sign-in succeeds but the connection doesn't.
- **Network.** TCP port 80 must be open between your computer and Microsoft 365.
- **A clean profile path.** Microsoft says connect commands can fail if your user profile path contains special PowerShell characters such as `$`. Use a different account if yours has one.

You also don't need to change anything about WinRM. Current connections use REST under the hood, so the old advice to enable Basic authentication in WinRM no longer applies.

## How to connect to Exchange Online PowerShell step by step

This is the standard interactive method. It works the same in Windows PowerShell 5.1 and PowerShell 7, with or without multifactor authentication.

1. Open a new PowerShell window. A fresh window avoids assembly conflicts with other modules that you may have loaded earlier in the session.
2. Load the module with `Import-Module ExchangeOnlineManagement`. If the module is already installed, Microsoft says you can usually skip this step and go straight to the connect command, because PowerShell loads the module automatically.
3. Run `Connect-ExchangeOnline -UserPrincipalName admin@contoso.com`, but with your own account in UPN format. In some organizations you can leave out `-UserPrincipalName` and get prompted instead. If that fails, add the parameter.
4. Enter your password in the sign-in window and select **Sign in**.
5. If your account uses MFA, enter the verification code and select **Verify**. The code is delivered by your configured method, for example a text message or Microsoft Authenticator. In PowerShell 7 the sign-in uses your browser by default.
6. Wait for the banner. No error means you're connected.

That's all of it. The same cmdlet connects you to [PowerShell](https://www.m365.fm/entity/powershell/) sessions for Microsoft 365 GCC without extra parameters. Only the other clouds need a setting, which comes next.

If you don't want the welcome banner in a script log, add `-ShowBanner:$false`. If you want `Get-Help` to show help for Exchange Online cmdlets, add `-LoadCmdletHelp`. Since module version 3.7.0 that help is no longer loaded by default, which surprises people who update the module and then find `Get-Help` returning almost nothing.

## Other ways to connect: PowerShell 7, partners and clouds

The documentation lists several variations. Pick the one that matches your situation.

**PowerShell 7 without a browser.** Run `Connect-ExchangeOnline -Device`. The command prints a message telling you to open `https://microsoft.com/devicelogin` and enter a code. You do that on any other device, sign in, confirm, and the original session finishes connecting. This works with and without MFA and is useful on servers or Linux machines without a desktop.

**PowerShell 7 with inline credentials.** `Connect-ExchangeOnline -UserPrincipalName admin@contoso.com -InlineCredential` works for accounts without MFA. Most organizations require MFA for admins, so you'll use this rarely.

**Windows PowerShell 5.1 with a credential object.** For accounts without MFA you can run `$Credential = Get-Credential` first and then `Connect-ExchangeOnline -Credential $Credential`. Microsoft notes that if this fails, you should use `-UserPrincipalName` instead.

**Customer tenants as a partner.** Cloud Solution Provider partners and guest admins add `-DelegatedOrganization`, for example `Connect-ExchangeOnline -UserPrincipalName admin@contoso.onmicrosoft.com -DelegatedOrganization adatum.onmicrosoft.com`. Microsoft's page refers to the Cloud Solution Provider program and granular delegated admin privileges (GDAP) for the permission side.

**Government and regional clouds.** `-ExchangeEnvironmentName` selects the environment. The default is `O365Default`, which covers Microsoft 365 and GCC. The documented values for the others are `O365USGovGCCHigh`, `O365USGovDoD`, `O365GermanyCloud` and `O365China`.

**Unattended scripts.** Don't store an admin password in a script. Microsoft documents two better options. A managed identity, for example `Connect-ExchangeOnline -ManagedIdentity -Organization "contoso.onmicrosoft.com"`, suits scripts that run in Azure. App-only authentication with a certificate suits everything else. The certificate thumbprint parameter is supported only on Windows. The setup involves an app registration in Microsoft Entra ID, the `Exchange.ManageAsApp` application permission with admin consent, a certificate, and a supported role such as Exchange Administrator for the app. Microsoft recommends least privilege, so don't hand the app Global Administrator unless there's no way around it. Follow Microsoft's separate article on [app-only authentication](https://learn.microsoft.com/en-us/powershell/exchange/app-only-auth-powershell-v2?view=exchange-ps) rather than a shortened version of it.

In a Windows service, add `-SkipLoadingFormatData` to avoid errors. If you see errors that mention the Web Account Manager, module version 3.7.2 or later has a `-DisableWAM` switch for that.

## Keep scripts lean: limit what you import

A connection normally imports the Exchange Online cmdlets you're allowed to use. That's fine for a quick look at a mailbox, but a script that needs three commands doesn't need all of them. Microsoft's module page gives a specific tip here. Frequent `Connect-ExchangeOnline` and `Disconnect-ExchangeOnline` calls in the same session can cause a memory leak. The fix is to connect once per script, and to use the `-CommandName` parameter to import only the cmdlets you need.

A script that only reads mailbox statistics, for example, needs just that one command. Name the few commands, connect once at the top, do the work, and disconnect once at the bottom. Scripts written this way are easier to review, because the connect line tells the reader which commands the script uses.

Two more habits help in team environments. First, keep the connection line in one place, such as a small function, so a change to the authentication method happens once and not in twenty scripts. Second, log the account or app name that ran the script, never its secret. When something unexpected changes in a mailbox, that log line saves you hours.

## Check the connection and disconnect cleanly

A connection without an error is a good sign, but test it with a harmless read command. `Get-AcceptedDomain` lists the domains of your organization and takes a second to run. If domains appear, your session works and your account has at least read access.

To see details about your connections, use `Get-ConnectionInformation`. Microsoft's module page points out that `Get-PSSession` doesn't return anything useful for these REST-based connections, so older scripts that check `Get-PSSession` need to change.

When you're done, run `Disconnect-ExchangeOnline`. Add `-Confirm:$false` in scripts to skip the prompt. Microsoft's connection article warns that closing the window without disconnecting can use up your available sessions, and then you wait until they expire.

## Fix the most common connection errors

Most failures come from a short list of causes. Work through them from top to bottom.

- **Wrong user name or password.** Run the steps again and check both. It sounds trivial, but check the UPN format first.
- **PowerShell access is off for the account.** An admin can enable it. Microsoft has a separate article on enabling or disabling access to Exchange Online PowerShell.
- **Port 80 is blocked.** Ask your network team to allow TCP port 80 to Microsoft 365.
- **Federated account with an unreachable identity provider.** If your IDP or STS isn't publicly available, Microsoft suggests using a non-federated account in Microsoft 365 for the connection.
- **"The term 'Update-ModuleManifest' is not recognized".** The connection needs PowerShellGet and its dependency PackageManagement. Update both and restart PowerShell.
- **"Could not load file or assembly 'System.IdentityModel.Tokens.Jwt'".** The module conflicts with another module in the same session. Connect in a fresh Windows PowerShell window before you import anything else.
- **Errors in a window opened by a service or a scheduled task.** Try `-SkipLoadingFormatData`.

If none of these apply, the module version is the next suspect. Run `Update-Module -Name ExchangeOnlineManagement` in the same scope you installed it with, and try again in a new window.

## Common mistakes

- **Using Basic authentication or `New-PSSession`.** Microsoft lists these only as historical reference and says they're no longer supported. A script that still builds a session this way needs to move to `Connect-ExchangeOnline`.
- **Closing the window instead of disconnecting.** It can exhaust your sessions. Make `Disconnect-ExchangeOnline` the last line of every script.
- **Putting a password in plain text into a script.** Use a managed identity or a certificate instead.
- **Importing other modules first.** A conflict with another module can break the sign-in. Connect to Exchange Online first, or use a new window.
- **Assuming connection means permission.** If a cmdlet is "not recognized" after you connect, your role doesn't include it. That's an RBAC question, not a connection problem.

## Related topics to explore

- Install and update the module: the connection depends on the right module and PowerShell version, so read the [Exchange Online PowerShell module](https://learn.microsoft.com/en-us/powershell/exchange/exchange-online-powershell-v2?view=exchange-ps) requirements before you roll it out to a team.
- Find the permissions for a cmdlet: Microsoft explains how to look up which role a specific Exchange cmdlet needs.
- Connect to Security & Compliance PowerShell: the same module offers `Connect-IPPSSession`, which isn't available in PowerShell 7 on Linux or macOS.
- Unattended automation: app-only authentication and managed identities are the way to run scheduled Exchange scripts safely.
- Large bulk jobs: REST-based cmdlets have a 15-minute timeout, so split big member updates into batches.

## Next step

To connect to Exchange Online PowerShell reliably, start with a fresh window, run `Connect-ExchangeOnline -UserPrincipalName` with your admin account, test with `Get-AcceptedDomain` and disconnect when you're done. Then plan your unattended scripts around a managed identity or a certificate, so nobody has to type or store a password.
