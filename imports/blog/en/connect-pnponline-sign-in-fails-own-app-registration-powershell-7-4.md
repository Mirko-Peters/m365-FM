---
title: "Connect-PnPOnline Sign-In Fails: Own App Registration, PowerShell 7.4 and the msalruntime Error"
summary: "Connect-PnPOnline reports no connection, asks for a client ID or throws an msalruntime error? Check the PowerShell version, register your own Entra app and pass its client ID."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [pnp-powershell, app-registration, entra-id, powershell]
keypoints:
  - "PnP PowerShell needs PowerShell 7.4.0 or later according to its installation page. A community reply that suggested Windows PowerShell 5.1 does not match the docs."
  - "Since September 9, 2024, -Interactive only works with your own Entra app registration and its client ID. Register one with Register-PnPEntraIDAppForInteractiveLogin."
  - "To avoid editing every script, set the ENTRAID_CLIENT_ID environment variable or store the ID per tenant with Set-PnPManagedAppId."
  - "-UseWebLogin was removed in 3.0.0. An msalruntime error on 3.1.0 with -OSLogin was reported fixed in a later build, so update the module first."
faq:
  - q: "Which PowerShell version does PnP PowerShell need?"
    a: "The PnP PowerShell installation page says PowerShell 7.4.0 or later. The project changelog shows that early 3.x releases asked for 7.4.6 and that this was changed to 7.4.0 later. Windows PowerShell 5.1 is not supported by the current 3.x line, even though one community reply suggested it."
  - q: "Why does Connect-PnPOnline -Interactive ask for a client ID?"
    a: "The PnP documentation says that since September 9, 2024, you cannot use -Interactive without your own Entra ID app registration passed with -ClientId. You can set a default through the ENTRAID_CLIENT_ID environment variable or with Set-PnPManagedAppId."
  - q: "Does Connect-PnPOnline -UseWebLogin still work?"
    a: "No. The changelog lists -UseWebLogin as removed in version 3.0.0. Use -Interactive with your own client ID. For a machine without a browser, use -DeviceLogin."
  - q: "What can I do about 'Unable to load DLL msalruntime'?"
    a: "It was reported in a December 2025 community thread on PnP.PowerShell 3.1.0 and in a January 2026 GitHub issue on 3.1.0 with -OSLogin. In the GitHub issue the reporter confirmed that build 3.1.275 fixed it. Update the module, and use -Interactive if you do not need the Windows sign-in broker."
---

A script that signed in without trouble last year now stops at the first line. Sometimes the next cmdlet says there is no connection. Sometimes the browser never opens. Sometimes PowerShell mentions a missing `msalruntime` library.

This article collects what four public sources agree on. They are a December 2024 Microsoft Q&A thread, a December 2025 Microsoft Community Hub discussion, and two GitHub issues from 2025 and 2026. It is a troubleshooting guide, not an official Microsoft procedure. PnP PowerShell is an open-source tool, and Microsoft Learn itself notes that Microsoft offers no SLA for its support.

## What the symptoms look like

- `Add-PnPFile` and `Set-PnPFileCheckedIn` fail with "There is currently no connection yet. Use Connect-PnPOnline to connect", although `Connect-PnPOnline -Interactive` ran first. This was the December 2024 Q&A thread.
- `Unable to load DLL 'msalruntime' or one of its dependencies`. The December 2025 discussion reported it with PnP.PowerShell 3.1.0 on PowerShell 7.5.3. A January 2026 GitHub issue reported the same text for `-OSLogin` on 3.1.0 and PowerShell 7.5.4.
- `-Interactive` asks for an app registration or a client ID.
- In Azure Cloud Shell, `-DeviceLogin` complained about a missing `xsel` tool and `-Interactive` about a missing `xdg-open` tool (GitHub issue, June 2025).

## Step 1: Check the PowerShell version

Run this in the session that runs your script:

```powershell
$PSVersionTable.PSVersion
```

The PnP PowerShell installation page says you need PowerShell 7.4.0 or later. The changelog adds history: 3.0.0 moved the module to .NET 8 and named 7.4.6 as the minimum, and the 3.2.0 entry later states 7.4.0 or newer.

In the December 2025 discussion, one reply suggested running the script in Windows PowerShell 5.1. That is not supported by the current docs, so treat that advice as a dead end. If you run on a platform that offers only older PowerShell, plan a move to 7.4 or later.

## Step 2: Update the module

```powershell
Update-Module PnP.PowerShell
Get-Module PnP.PowerShell -ListAvailable | Select-Object Name, Version
```

Open a new PowerShell window afterwards, because an old version stays loaded in a running session. Several of the problems below were reported against 3.1.0 and fixed in later builds, so this step alone solves some cases.

## Step 3: Register your own app registration

Since September 9, 2024, the PnP documentation says you must use your own Entra ID app registration to sign in with `-Interactive`. The accepted answer in the 2024 Q&A thread said the same, and the asker confirmed that it fixed the "no connection" error.

The module can create the registration for you:

```powershell
Register-PnPEntraIDAppForInteractiveLogin -ApplicationName "PnP Interactive" -Tenant yourtenant.onmicrosoft.com
```

According to the cmdlet page, a browser window opens so you can sign in. Without extra parameters it requests delegated permissions that include `AllSites.FullControl`, `Group.ReadWrite.All`, `User.ReadWrite.All` and `TermStore.ReadWrite.All`. That is broad. The cmdlet page shows how to request fewer permissions:

```powershell
Register-PnPEntraIDAppForInteractiveLogin -ApplicationName "PnP Interactive" -Tenant yourtenant.onmicrosoft.com -GraphDelegatePermissions "Group.Read.All" -SharePointDelegatePermissions "AllSites.FullControl"
```

For a script that only reads, the PnP permissions article names `AllSites.Read` as the lowest delegated SharePoint permission. The signed-in user must hold the matching rights on each site as well. Ask your Entra administrator who may create registrations and grant consent in your tenant. The cmdlet page does not spell out the roles.

## Step 4: Connect with the client ID

```powershell
Connect-PnPOnline -Url https://yourtenant.sharepoint.com -Interactive -ClientId <your-app-client-id>
```

You do not have to pass `-ClientId` in every script. The PnP docs describe two defaults:

1. Set an environment variable named `ENTRAID_APP_ID`, `ENTRAID_CLIENT_ID` or `AZURE_CLIENT_ID`. If you set more than one, the order in which they are listed here decides which is used.
2. Store an ID per tenant with `Set-PnPManagedAppId -Url https://yourtenant.sharepoint.com -AppId <id>`. The page marks this as available in versions newer than 2.12.0 and says it is useful for consultants with several customers.

Add `-Verbose` to `Connect-PnPOnline` to see which client ID was used.

Know what changed in the sign-in options. The 3.0.0 changelog says `-Interactive` became the default and now opens a browser flow. The popup window and `-LaunchBrowser` are gone. `-UseWebLogin` was removed too, with the advice to use `-Interactive`. If an old script still contains `-UseWebLogin`, replace it.

## Step 5: Pick the right option for the machine

- **No browser on the machine:** use `-DeviceLogin -ClientId <id>`. The documentation says you open the Microsoft device login page on any device and enter the code shown.
- **Windows sign-in broker:** `-OSLogin` uses Web Account Manager. The docs list Windows 10 (1703 or later) and Windows Server 2019 or later, and say it supports Windows Hello, FIDO keys and conditional access.
- **Unattended jobs:** interactive sign-in is not meant for them. The authentication page points to certificate-based app-only access.

For Azure Cloud Shell, the June 2025 issue ended without a confirmed fix for `-Interactive`. A maintainer said Cloud Shell offers no clipboard access, and that Microsoft had updated the base images and removed the packages the module used to open a browser. The maintainer was unsure whether the browser launch could be fixed. The reporter confirmed that `-DeviceLogin` worked in one test, although a later comment in the issue says that a problem persisted (the screenshot is not readable as text). The changelog for 3.2.0 lists a fix for `-DeviceLogin` in Cloud Shell. In that environment, use `-DeviceLogin`, copy the code from the shell and open the device login page by hand.

## Step 6: Deal with the msalruntime error

This message appeared on the Windows sign-in broker path. In the January 2026 GitHub issue, the module's `Core` folder did not contain the `msalruntime` files on 3.1.0. The reporter confirmed that build 3.1.275 worked and contained the files. A maintainer said the fix was likely in newer builds, asked for a test with the latest nightly build and closed the issue as fixed. No reply to that request is visible in the thread.

What to do:

1. Update to the current stable release (Step 2) and retest.
2. If you do not need the broker, use `-Interactive -ClientId <id>` instead of `-OSLogin`.
3. Do not copy DLL files between modules. The reporter described that workaround as a hack that worked on one machine. It is not documented anywhere.

The December 2025 discussion has a smaller lesson. The original poster used `-UseWebLogin`, saw the error, and tried `-Interactive`, which asked for an app registration. A reply suggested creating an Entra ID app registration. The poster then wrote that it worked and was easier than expected. The thread does not say which version fixed the DLL message, and it does not say how a removed switch reached the DLL. So the link between the error and the fix is only reported there.

## Verify

```powershell
Connect-PnPOnline -Url https://yourtenant.sharepoint.com -Interactive -ClientId <id> -ValidateConnection -Verbose
Get-PnPConnection
Get-PnPWeb
```

The PnP permissions article suggests `-ValidateConnection -Verbose` to test the connection once it is established. If `Get-PnPWeb` returns the site, the sign-in works. If a later cmdlet reports missing permissions, the next job is the permission set on the app registration, not the connection.

## Limits and open points

- The 2024 Q&A thread is older than most sources here, but the rule it confirms is still on the current PnP documentation pages.
- The December 2025 discussion has no marked solution. Only the original poster's statement says it worked.
- The Cloud Shell issue has no confirmed fix for `-Interactive`. It is also not clear from the sources whether Microsoft changed the Cloud Shell image again after 2025.
- The changelog gives 7.4.6 for 3.0.0 and 7.4.0 in the 3.2.0 entry. Do not assume that every 3.x build between them accepts 7.4.0, and check the installation page for the version you install.

## Related

- [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/)
- [Application registration](https://www.m365.fm/entity/app-registration/)
- [Microsoft Entra ID](https://www.m365.fm/entity/entra-id/)
- [PowerShell](https://www.m365.fm/entity/powershell/)

## Sources

- [PnP PowerShell: Authentication](https://pnp.github.io/powershell/articles/authentication.html)
- [PnP PowerShell: Installing PnP PowerShell](https://pnp.github.io/powershell/articles/installation.html)
- [PnP PowerShell: Set a default Client ID](https://pnp.github.io/powershell/articles/defaultclientid.html)
- [PnP PowerShell: How to determine which permissions you need](https://pnp.github.io/powershell/articles/determinepermissions.html)
- [PnP PowerShell: Connect-PnPOnline](https://pnp.github.io/powershell/cmdlets/Connect-PnPOnline.html)
- [PnP PowerShell: Register-PnPEntraIDAppForInteractiveLogin](https://pnp.github.io/powershell/cmdlets/Register-PnPEntraIDAppForInteractiveLogin.html)
- [PnP PowerShell changelog](https://github.com/pnp/powershell/blob/dev/CHANGELOG.md)
- [Microsoft Learn: Granting access via Entra ID App-Only](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azuread)
- [Microsoft Q&A: How to fix error: Add-PnPFile: There is currently no connection yet (December 2024)](https://learn.microsoft.com/en-us/answers/questions/2126848/how-to-fix-error-add-pnpfile-there-is-currently-no)
- [Microsoft Community Hub: Error trying to Connect-PnPOnline (December 2025)](https://techcommunity.microsoft.com/discussions/windowspowershell/error-trying-to-connect-pnponline/4478149)
- [GitHub: Connect-PnPOnline option OSLogin DLLs missing (issue 5208, January 2026)](https://github.com/pnp/powershell/issues/5208)
- [GitHub: Unable to connect to PNP with CloudShell (issue 4983, June 2025)](https://github.com/pnp/powershell/issues/4983)
