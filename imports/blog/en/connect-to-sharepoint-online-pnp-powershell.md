---
title: "Connect to SharePoint Online with PnP PowerShell: sign-in options"
summary: "Connect to SharePoint Online with PnP PowerShell: register your own Entra app, then pick interactive, device, certificate or managed identity sign-in per job."
status: approved
publish: true
author: mirko-p
date: 2026-11-11
topics: [pnp-powershell, microsoft-entra, powershell, sharepoint]
keypoints:
  - "Since September 9, 2024, Connect-PnPOnline needs a -ClientId, so every admin must first register an app in Microsoft Entra ID that the module can sign in with."
  - "Interactive sign-in is the right choice for a person at a keyboard, because it supports multi-factor authentication and needs no stored secret."
  - "Unattended jobs should use certificate sign-in or a managed identity, not a typed password and not a client secret stored in a script."
  - "The legacy client secret method only works for SharePoint cmdlets, so any command that calls Microsoft Graph will fail with it."
  - "Register the app with only the delegated permissions you need, because the default registration asks for broad rights such as AllSites.FullControl."
faq:
  - q: "Why does Connect-PnPOnline ask for a ClientId?"
    a: "The PnP PowerShell documentation says you must provide -ClientId starting September 9, 2024. You register your own app in Microsoft Entra ID once, then pass its application ID, or set the ENTRAID_APP_ID or ENTRAID_CLIENT_ID environment variable, on every connection."
  - q: "How do I connect to SharePoint Online with MFA?"
    a: "Use interactive sign-in. Run Connect-PnPOnline with your site URL, the -Interactive switch and your -ClientId. A browser window opens and you sign in as usual, including the multi-factor prompt. If a browser is not available on that machine, the -DeviceLogin switch works with a code instead."
  - q: "Which sign-in option is best for scheduled scripts?"
    a: "Use an option that needs no person. Certificate-based app-only sign-in works on any machine where the certificate is installed, and a managed identity works inside Azure services such as Automation runbooks. Both avoid storing a password. Give the app only the permissions the job needs, and rotate or renew the certificate on a calendar."
---

To connect to SharePoint Online with PnP PowerShell today, you register your own app in Microsoft Entra ID once. Then you call `Connect-PnPOnline` with your site URL and that app's client ID, plus one sign-in method: interactive, device login, certificate, managed identity or legacy credentials. This guide is for [SharePoint](https://www.m365.fm/entity/sharepoint/) admins who run scripts by hand or on a schedule. It explains what each option does, when to use it and which mistakes break a connection. It also shows how to choose one option per job so a script does not need more access than its task.

## Getting started: why every connection needs your own app

[PnP PowerShell](https://www.m365.fm/entity/pnp-powershell/) is a community-maintained module. It does not carry special rights of its own. Each sign-in goes through an app registration in [Microsoft Entra](https://www.m365.fm/entity/microsoft-entra/), and that app decides what the script may do.

The [Connect-PnPOnline reference](https://pnp.github.io/powershell/cmdlets/Connect-PnPOnline.html) says you must provide the `-ClientId` parameter starting September 9, 2024. It also says you have to register your own app first. You can set the `ENTRAID_APP_ID` or `ENTRAID_CLIENT_ID` environment variable instead of typing the ID each time.

This changed older scripts. If a script from 2023 calls `Connect-PnPOnline -Url ... -Interactive` and nothing else, it will now fail or prompt for a missing client ID. The fix is not in the script's logic. You need an app and an ID.

Two other values come up in every example:

- **`-Url`** is the address of the site you want to work on, such as `https://contoso.sharepoint.com/sites/finance`. It is required for most methods.
- **`-Tenant`** is the tenant name, such as `contoso.onmicrosoft.com`. The reference lists it as required for the certificate and thumbprint methods. It is optional for interactive and device login.

If a command needs the SharePoint admin center, you can pass `-TenantAdminUrl`. When you leave it out, the cmdlets assume the form `https://[tenantname]-admin.sharepoint.com` where it applies.

## Step 1: complete the app registration in Microsoft Entra

This getting started step assumes the PnP.PowerShell module is already installed on your machine. PnP ships a helper for the first setup. The cmdlet page for [Register-PnPEntraIDAppForInteractiveLogin](https://pnp.github.io/powershell/cmdlets/Register-PnPEntraIDAppForInteractiveLogin.html) shows the shortest form:

`Register-PnPEntraIDAppForInteractiveLogin -ApplicationName TestApp -Tenant yourtenant.onmicrosoft.com`

A browser window opens so you can sign in, and the cmdlet creates the app. It also prints the application ID that you will use as `-ClientId`. Add `-DeviceLogin` if you cannot open a browser on the machine. The page says this switches to a device login flow that supports multi-factor authentication.

Pay attention to the permissions. With the plain example, the app requests these delegated permissions for consent: AllSites.FullControl, Group.ReadWrite.All, User.ReadWrite.All and TermStore.ReadWrite.All. The second example on the same page narrows this with `-GraphDelegatePermissions "Group.Read.All"` and `-SharePointDelegatePermissions "AllSites.FullControl"`.

That matters for least privilege. A report script that only reads does not need write rights on users and groups. Decide what your scripts need, and ask only for that.

Keep a note of each app registration: its name, its client ID, its owner and the permissions it holds. Review the app registration once a year, and delete it when no script uses it any more.

Two limits to know. The reference page does not say which Entra role you need to register an app, so ask your identity admin before you start. And the `-SignInAudience` parameter controls which account types the app supports, so check that it matches your tenant.

## How to connect to SharePoint Online with PnP PowerShell: the five options

All five examples use the `Connect-PnPOnline` reference as their source. Replace the values in angle brackets.

### Interactive sign-in

`Connect-PnPOnline -Url "https://contoso.sharepoint.com" -Interactive -ClientId <appId>`

This is the default choice for a person. The reference says it is designed to support multi-factor authentication. Add `-ForceAuthentication` to clear stored authentication and sign in with a different account. Use it when you switch between a test and a production tenant.

### Device login

`Connect-PnPOnline -Url "https://contoso.sharepoint.com" -DeviceLogin -ClientId <appId>`

A browser opens and the code is copied to your clipboard. Choose it when the shell runs in a remote session where an interactive window does not work well.

### Certificate sign-in (app-only)

`Connect-PnPOnline -Url "https://contoso.sharepoint.com" -ClientId <appId> -Tenant 'contoso.onmicrosoft.com' -Thumbprint <thumbprint>`

No person signs in. The app acts on its own, with the application permissions you gave it. You can pass `-CertificatePath` with `-CertificatePassword`, a `-CertificateBase64Encoded` value, or a `-Thumbprint`. The thumbprint method needs the certificate in the Windows certificate store. This is the standard choice for unattended scripts on a server.

### Managed identity

`Connect-PnPOnline -Url "https://contoso.sharepoint.com" -ManagedIdentity`

The reference says this works only in environments that support managed identities, such as Azure Functions, Automation runbooks and Cloud Shell. You store no secret at all. For a user-assigned identity, add one of `-UserAssignedManagedIdentityClientId`, `-UserAssignedManagedIdentityObjectId` or `-UserAssignedManagedIdentityAzureResourceId`. The `-Url` parameter is optional with this method.

### Credentials and client secrets

Two older methods remain, and both come with warnings.

- **`-Credentials`** takes a PSCredential, for example `(Get-Credential)`, or the name of a Generic Credential in Windows Credential Manager. The reference lists multi-factor support for interactive and device login, but does not make that claim here. Treat it as an option for accounts without a prompt, and test before you rely on it.
- **`-ClientSecret`** with `-ClientId` is the legacy ACS method. The reference says that with it, "only cmdlets that are connecting to SharePoint Online will work." Cmdlets that use Microsoft Graph will fail.

Avoid both for anything new. A password in a script is a risk, and a client secret expires without warning.

## Example: choosing a sign-in option for four jobs

The numbers and names below are made up for illustration.

An admin team at a fictional company runs four jobs. They want one app per risk level, not one app for everything.

1. **Ad-hoc checks by an admin at a laptop.** Use `-Interactive` with an app that has narrow delegated permissions. The admin signs in with MFA. Nothing is stored.
2. **A one-time cleanup run on a remote jump server.** Use `-DeviceLogin`. The admin completes the sign-in on a phone or laptop and the run starts.
3. **A nightly inventory on a Windows server.** Use a certificate with `-Thumbprint`. The app has read-only application permissions. The certificate is valid for 12 months, and the team puts the renewal date into a shared calendar.
4. **A weekly job in an Automation runbook.** Use `-ManagedIdentity`. There is no certificate or secret to rotate.

The result: only job 1 and job 2 depend on a person. Jobs 3 and 4 run without anyone present, and neither stores a password. If job 3's server is stolen, the team revokes one certificate. They do not have to reset an admin password.

## Common mistakes

- **Forgetting `-ClientId`.** The connection fails or prompts for it. Save the ID in the `ENTRAID_APP_ID` environment variable on machines where you run scripts often.
- **Using one all-powerful app for everything.** The default registration asks for AllSites.FullControl and write access to users and groups. Register a second, read-only app for reports.
- **Using a client secret with Graph-based cmdlets.** The legacy method only works for SharePoint cmdlets. If a command calls Graph, it will fail, and the error message can be confusing.
- **Putting a password or secret into the script file.** Anyone with read access to the file has the credential. Use a certificate store or a managed identity.
- **Not testing the sign-in in the final environment.** A script that works on your laptop with `-Interactive` can fail on a server with no browser. Test with the method the job will really use.
- **Staying signed in to the wrong tenant.** Use `-ForceAuthentication` when you switch accounts, and print the connection details at the start of each script.

## How software can help

Start with what you already have. The PnP module and the Microsoft Graph PowerShell SDK cover most admin scripting. Azure Automation runs scripts on a schedule with a managed identity, and the SharePoint admin center shows sites and settings without code. For secrets, a certificate store or a key vault is safer than a script file.

Add reporting on top. A script that connects correctly is only the first step. Teams also need a clear log of what each script changed and which app identity it used, so the next admin can follow it. Keep that log in a place everyone can read, such as a shared list or a ticket system.

## Next step

Register one app today with the smallest set of delegated permissions your scripts need. Then test that you can connect to SharePoint Online with PnP PowerShell using `-Interactive`, and write down which sign-in option each of your scheduled jobs will use.
