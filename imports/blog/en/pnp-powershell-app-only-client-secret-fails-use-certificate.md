---
title: "PnP PowerShell App-Only Stops Working With a Client Secret: Switch to a Certificate"
summary: "App-only scripts that sign in with a client secret get 401 or Access Denied from SharePoint. Microsoft Learn says SharePoint accepts only certificates. Create one, upload it and reconnect."
status: review
publish: false
author: mirko-p
date: 2026-11-13
topics: [pnp-powershell, app-registration, client-secret, x509-certificate, sharepoint]
keypoints:
  - "Microsoft Learn says that for app-only access to the SharePoint CSOM and REST APIs through Entra ID you must use a certificate, and that all other options are blocked and give Access Denied."
  - "In Connect-PnPOnline, -ClientSecret belongs to the legacy Azure ACS parameter set. Learn says ACS for SharePoint Online stops working from April 2, 2026."
  - "Register-PnPEntraIDApp can create a self-signed certificate, upload it to the app and request permissions in one run."
  - "A July 2026 Q&A thread with about 20 broken apps got a certificate recommendation but no confirmed result. Treat the Graph 403 part of that case as unexplained."
faq:
  - q: "Can I use a client secret with PnP PowerShell for app-only access to SharePoint?"
    a: "Not for SharePoint CSOM and REST calls. The Microsoft Learn page on Entra ID app-only access says you must use a certificate and that other options are blocked and return Access Denied. The PnP authentication page says a client secret is not supported for non-interactive sign-in. In Connect-PnPOnline, -ClientSecret is the legacy Azure ACS option."
  - q: "When did Azure ACS stop working for SharePoint Online?"
    a: "Microsoft Learn says ACS for SharePoint Online was retired as of November 27, 2023 and stops working from April 2, 2026. The page was last updated in November 2025. It also says that for new tenants ACS app-only tokens are disabled by default."
  - q: "Does the certificate rule explain every 401 or 403 after the ACS retirement?"
    a: "No. Learn states the rule for the SharePoint CSOM and REST APIs. In the July 2026 thread, some of the failures came from Microsoft Graph file calls. Neither Learn nor the thread confirms why those returned 403, so test with a certificate and check the app's permissions as well."
  - q: "Do I have to buy a certificate?"
    a: "No. The Learn page says you can use a self-signed certificate, and Register-PnPEntraIDApp can create one and upload the public part to the app registration. Keep the private key (.pfx) safe, because Learn warns that anyone holding it can use the app and its permissions."
---

A set of scheduled SharePoint scripts runs for months. Then one day every job fails with 401 or Access Denied. Nobody changed the code. The scripts have one thing in common: they sign in with a client ID and a client secret.

This article uses a July 2026 Microsoft Q&A thread as its scenario. The asker reported that about 20 app-only registrations, recreated after the Azure ACS retirement and using client secrets, stopped working at about the same time. The article then checks the cause against current Microsoft Learn and PnP PowerShell documentation. It is a troubleshooting guide, not an official Microsoft procedure.

## What the symptoms look like

From the July 2026 thread:

- Azure Data Factory could not read the metadata of a SharePoint OData service. It reported an `Unauthorized` status and an `invalid_request` error.
- A Microsoft Graph call that uploaded or deleted a file version returned `403 Forbidden` with `AccessDenied`, although sign-in itself worked.
- Registrations, unexpired secrets, API permissions, admin consent and site grants had all been checked and looked fine.

A February 2026 GitHub issue shows the same pattern from the PnP side. The reporter tried to call a metered Microsoft Graph API (HTTP 402 Payment Required) and, judging by the maintainers' replies, had followed an example that uses a client secret.

## What the documentation says

**Microsoft Learn, Entra ID app-only access** (page updated November 2025). The page says that when you do app-only with Entra ID, you must use a certificate to request access to the SharePoint CSOM and REST APIs. Its FAQ asks whether other means besides certificates work. The answer is no: all other options are blocked by SharePoint Online and give an Access Denied message.

**Microsoft Learn, retired Azure ACS app-only access** (page updated November 2025). The page says ACS for SharePoint Online stops working from April 2, 2026, and that ACS app-only tokens are disabled by default for new tenants. It recommends the Entra ID application permission model.

**PnP PowerShell authentication page.** For non-interactive sign-in, the application registration must use a certificate. The page states that a client secret is not supported. The `Connect-PnPOnline` cmdlet page labels the `-ClientSecret` parameter set "SharePoint ACS (Legacy) App Only".

So a script that passes `-ClientSecret` to `Connect-PnPOnline` uses the path that Learn describes as stopping in April 2026. That is the most direct explanation for the SharePoint-side failures. It is documentation-based. It is not a confirmed diagnosis of the July 2026 tenants.

## Step 1: Find the scripts that use a secret

Search your script folders:

```powershell
Get-ChildItem -Path .\scripts -Filter *.ps1 -Recurse | Select-String -Pattern '-ClientSecret'
```

Note the client ID each script uses, the site or admin URL it connects to, and the permissions it needs. Also check tools that are not PowerShell, such as data integration jobs. They need the same change if they read SharePoint through app-only access.

## Step 2: Create the certificate and the registration

The simplest route is the PnP cmdlet. It creates an app registration, creates a self-signed certificate, uploads the public part and requests permissions. The cmdlet page gives this example for a certificate in the current user's store:

```powershell
Register-PnPEntraIDApp -ApplicationName "Reports App" -Tenant yourtenant.onmicrosoft.com -Store CurrentUser -GraphApplicationPermissions "User.Read.All" -SharePointApplicationPermissions "Sites.Read.All"
```

A browser window opens so you can sign in and complete the consent flow. Request only what the script needs. PnP's permission article names `Sites.Selected` as the lowest application permission for SharePoint. It then needs a per-site grant, which is covered in our article on Sites.Selected.

Other options from the cmdlet page:

- `-OutPath` exports the PFX and CER files. Add `-CertificatePassword` to lock the PFX.
- `-CertificatePath` uses a certificate you already have.
- `-ValidYears` sets how long a generated certificate is valid. Check the cmdlet page for the default and write the expiry date into your runbook notes.

If you prefer to do it by hand, Learn describes the portal steps: open the app registration, go to **Certificates & secrets**, select **Certificates**, then **Upload certificate**, and add the .cer file. Then select **Grant admin consent**.

## Step 3: Reconnect with the certificate

The PnP authentication page lists three variants. Each needs the client ID and the tenant:

```powershell
# Certificate file
Connect-PnPOnline yourtenant.sharepoint.com -ClientId <client-id> -Tenant yourtenant.onmicrosoft.com -CertificatePath <path-to.pfx>

# Certificate in the Windows certificate store
Connect-PnPOnline yourtenant.sharepoint.com -ClientId <client-id> -Tenant yourtenant.onmicrosoft.com -Thumbprint <thumbprint>

# Certificate as base64 text, for example in a hosted job
Connect-PnPOnline yourtenant.sharepoint.com -ClientId <client-id> -Tenant yourtenant.onmicrosoft.com -CertificateBase64Encoded <base64-pfx>
```

Add `-CertificatePassword` if the PFX has one. The page also shows how to turn a PFX into base64 with `Get-Content` and `[System.Convert]::ToBase64String`.

## Step 4: Check what the token holds

```powershell
Get-PnPWeb
Get-PnPAccessToken -ResourceTypeName SharePoint -Decoded
Test-PnPConnectionPermission -CommandName Get-PnPList
```

`Get-PnPWeb` proves that SharePoint accepts the connection. `Get-PnPAccessToken` with `-Decoded` shows the token content, so you can see which application roles it carries. `Test-PnPConnectionPermission` compares the token claims with what a cmdlet needs. The cmdlet page says it checks API permission claims only. It does not test a `Sites.Selected` grant on a site.

## Step 5: Look after the certificate

Learn warns that anyone who has the certificate and its private key can use the app and its permissions. Treat the PFX like a password.

The changelog for PnP PowerShell 3.4.0 lists three fixes that matter here, so update if you run an older build:

- `Disconnect-PnPOnline` now removes the private key container that a certificate sign-in leaves behind.
- `-CertificatePath` no longer keeps the certificate file open for the whole session.
- On Linux and macOS, PFX files written by `New-PnPAzureCertificate` and `Register-PnPEntraIDApp` are now readable only by their owner.

Once nothing uses the old client secret, delete it from the app registration. That is a hygiene recommendation, not something the sources require.

## Limits and open points

- The July 2026 thread has no accepted answer and no confirmation from the asker. The moderator recommended a certificate and hedged that tokens obtained with a secret might be rejected. The answer cited Learn but quoted no passage, so rely on the Learn pages above.
- In that thread, some calls were Microsoft Graph file operations. Learn's certificate rule is written for SharePoint CSOM and REST. Why the Graph calls returned 403 is not established. Check that the app holds the right Graph permission and, for `Sites.Selected`, a site grant.
- Another poster in the thread said a vendor told them a certificate is now required. That is second-hand and unverified.
- In the February 2026 GitHub issue, maintainers said a client ID with a client secret is not supported and recommended a certificate for app-only access. The reporter said a direct Graph request with the same app and a secret did succeed outside PnP. That fits Learn's rule being written for SharePoint CSOM and REST. No one confirmed a working PnP configuration, and the issue was closed for lack of response.
- An October 2025 Q&A answer, marked accepted by its asker, offered a client secret as an app-only alternative for `Connect-PnPOnline`. It conflicts with the Learn and PnP pages above, and the asker never reported a result.
- Learn's ACS page mentions a tenant setting, `-DisableCustomAppAuthentication`, that changes the ACS default. Because the same page says ACS stops working from April 2, 2026, do not plan around re-enabling it.

## Related

- [PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/)
- [Application registration](https://www.m365.fm/entity/app-registration/)
- [Client secret](https://www.m365.fm/entity/client-secret/)
- [X.509 certificate](https://www.m365.fm/entity/x509-certificate/)
- [SharePoint](https://www.m365.fm/entity/sharepoint/)

## Sources

- [Microsoft Learn: Granting access via Entra ID App-Only](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azuread)
- [Microsoft Learn: Granting access using SharePoint App-Only (retired Azure ACS)](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-apponly-azureacs)
- [PnP PowerShell: Authentication](https://pnp.github.io/powershell/articles/authentication.html)
- [PnP PowerShell: How to determine which permissions you need](https://pnp.github.io/powershell/articles/determinepermissions.html)
- [PnP PowerShell: Connect-PnPOnline](https://pnp.github.io/powershell/cmdlets/Connect-PnPOnline.html)
- [PnP PowerShell: Register-PnPEntraIDApp](https://pnp.github.io/powershell/cmdlets/Register-PnPEntraIDApp.html)
- [PnP PowerShell: Test-PnPConnectionPermission](https://pnp.github.io/powershell/cmdlets/Test-PnPConnectionPermission.html)
- [PnP PowerShell changelog](https://github.com/pnp/powershell/blob/dev/CHANGELOG.md)
- [Microsoft Q&A: SharePoint Access Issue (401 Unauthorized, 403 Forbidden, Failed to get metadata) with app registration (July 2026)](https://learn.microsoft.com/en-us/answers/questions/5941445/sharepoint-access-issue-(401-unauthorized-403-forb)
- [Microsoft Q&A: Export permissions using PNP (October 2025)](https://learn.microsoft.com/en-us/answers/questions/5571848/export-permissions-using-pnp)
- [GitHub: Unable to use metered APIs (issue 5245, February 2026)](https://github.com/pnp/powershell/issues/5245)
