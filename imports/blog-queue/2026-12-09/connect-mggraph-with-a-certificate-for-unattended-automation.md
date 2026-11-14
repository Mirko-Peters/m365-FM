---
title: "Connect-MgGraph With a Certificate: App-Only Authentication for Automation, Step by Step"
summary: "Authenticate Microsoft Graph PowerShell unattended with a certificate and an Entra app registration: create the app, grant admin consent, call Connect-MgGraph, verify AppOnly, and avoid the common certificate store and tenant ID errors."
status: review
publish: false
author: mirko-p
date: 2026-12-09
topics: [microsoft-graph-powershell, service-principal, app-registration, powershell]
keypoints:
  - "App-only access needs an Entra app registration with application permissions, a service principal and admin consent. The certificate public key is uploaded to the app."
  - "Connect-MgGraph takes -ClientId, -TenantId and one of -CertificateThumbprint, -CertificateName or -Certificate."
  - "The certificate must exist in Cert:\\CurrentUser\\My or Cert:\\LocalMachine\\My on the machine that runs the script."
  - "Get-MgContext should show AuthType AppOnly. Scopes then reflect the application permissions you consented to."
  - "For Azure-hosted automation, Learn also documents Connect-MgGraph -Identity, which needs no secret or certificate to rotate."
faq:
  - q: "What values does Connect-MgGraph need for certificate authentication?"
    a: "Microsoft Learn lists three: the application (client) ID, the tenant ID and the certificate, identified by thumbprint, subject name or a certificate object. The call looks like Connect-MgGraph -ClientId and -TenantId with -CertificateThumbprint."
  - q: "Where must the certificate be stored?"
    a: "According to Microsoft Learn, Connect-MgGraph can load the certificate from Cert:\\CurrentUser\\My or Cert:\\LocalMachine\\My when you use the thumbprint or name parameters. The certificate has to be present in one of those stores before the call."
  - q: "Why does the browser show Not Found after I grant admin consent?"
    a: "Microsoft Learn says the redirect to http://localhost shows a Not Found error after consent and that you can ignore it as long as the URL contains admin_consent=True."
  - q: "Do I need a certificate, or is there an option without credentials to manage?"
    a: "Microsoft Learn documents a client secret credential option and a managed identity option. It says the managed identity needs no secrets to provision or rotate. Connect-MgGraph -Identity uses the system-assigned identity, and -ClientId selects a user-assigned one."
---

To run Microsoft Graph PowerShell without a person signing in, register an app in Microsoft Entra ID, add a certificate to it, grant admin consent for the application permissions, and connect with `Connect-MgGraph -ClientId <app id> -TenantId <tenant id> -CertificateThumbprint <thumbprint>`. The certificate must be in a certificate store the script can read. This guide follows the app-only tutorial and the `Connect-MgGraph` documentation on Microsoft Learn.

## What app-only means

Microsoft Learn says app-only access grants permissions directly to an application and requires an administrator to consent to the required permission scopes. No user context exists, so the app's permissions decide what the script can do. The tutorial page does not discuss least privilege, so choose application permissions deliberately and keep them as narrow as your script needs. Its sample requests only two read permissions, `User.Read.All` and `Group.Read.All`.

## Prerequisites

- The Microsoft Graph PowerShell SDK is installed.
- An X.509 certificate, self-signed or from a certificate authority, installed in the user's trusted store on the machine that runs the script.
- The certificate's public key exported as `.cer`, `.pem` or `.crt`.
- The certificate subject or thumbprint.

## Step 1: Register the application

Learn's tutorial uses a script that connects with `Application.ReadWrite.All`, creates the app registration with the public key as a key credential, creates the service principal and prints an admin consent URL. In outline:

1. Load the certificate from the `.cer` file.
2. Run `New-MgApplication` with the required application permissions (the sample requests `User.Read.All` and `Group.Read.All`) and the certificate key.
3. Run `New-MgServicePrincipal -AppId <app id>`.
4. Open the admin consent URL, `https://login.microsoftonline.com/<tenant id>/adminconsent?client_id=<app id>`, and sign in as an administrator.

The pages read for this article show only the script route, not the portal clicks.

Two notes from the tutorial:

- After consent the browser redirects to `http://localhost` and shows **Not Found**. Ignore it if the URL contains `admin_consent=True`.
- If `New-MgServicePrincipal` fails with "Unable to find target address", rerun the script with the `-TenantId` parameter.

## Step 2: Connect with the certificate

You need the application (client) ID, the tenant ID and the certificate. Learn lists three ways to pass it:

```powershell
# By thumbprint
Connect-MgGraph -ClientId "YOUR_APP_ID" -TenantId "YOUR_TENANT_ID" -CertificateThumbprint "YOUR_CERT_THUMBPRINT"

# By subject name
Connect-MgGraph -ClientId "YOUR_APP_ID" -TenantId "YOUR_TENANT_ID" -CertificateName "YOUR_CERT_SUBJECT"

# By certificate object
$Cert = Get-ChildItem Cert:\LocalMachine\My\$CertThumbprint
Connect-MgGraph -ClientId "YOUR_APP_ID" -TenantId "YOUR_TENANT_ID" -Certificate $Cert
```

Learn states that the certificate can be loaded from `Cert:\CurrentUser\My` or `Cert:\LocalMachine\My` and must be present in one of them before the call. The cmdlet reference describes the thumbprint and subject name parameters as retrieving the certificate from the current user's store, and shows the certificate object route for `LocalMachine`. Because the lookup depends on the store of the account that runs the script, test the connection under the same account that your automation uses, not only under your own sign-in.

## Step 3: Verify the session

Run `Get-MgContext`. The output should show `AuthType : AppOnly` and the consented scopes, such as `Group.Read.All` and `User.Read.All` in the tutorial. Then run your commands, for example `Get-MgUser -Property "id,displayName" -PageSize 50`. End the session with `Disconnect-MgGraph`, which clears the cached token for the current context scope.

## Step 4: Make it safe for unattended runs

A script that works in your own session can still fail when it runs unattended, so check these points from Learn's documentation before you schedule it.

- Run `Connect-MgGraph` before any command that calls Graph.
- Use `-ContextScope Process` if you want the sign-in limited to the current PowerShell session instead of persisting for the user. Learn describes the default `CurrentUser` scope as caching the token securely across sessions.
- Use `-NoWelcome` to hide the welcome message in logs.
- Learn recommends PowerShell 7 and above for client secret credentials.

## Alternatives that Learn documents

| Option | How it works | Note |
|---|---|---|
| Certificate | `-CertificateThumbprint`, `-CertificateName` or `-Certificate` | You manage certificate lifetime and storage |
| Client secret | `-ClientSecretCredential` with a PSCredential | Learn says it suits background work without a user |
| Managed identity | `Connect-MgGraph -Identity`, or `-Identity -ClientId <id>` for user-assigned | Learn says it needs no secrets to provision or rotate |

For scripts that run in Azure, the managed identity option removes the certificate handling entirely. Whether it fits depends on where the script runs.

## Common errors and checks (own checklist, partly from the tutorial notes)

1. **Connection fails with the certificate not found.** Check the store and the thumbprint on the machine and account that run the script.
2. **Authenticated, but commands return insufficient privileges.** The application permissions were not granted or not consented. Check the app's API permissions and admin consent. Learn does not describe how the app-only session derives its scopes, so compare `Get-MgContext` output with the permission each cmdlet documents.
3. **Service principal creation fails.** Rerun with `-TenantId`.
4. **Wrong cloud.** `Connect-MgGraph` targets the global cloud by default. Learn lists the `-Environment` values, such as `USGov`, for other clouds.

## What the pages read do not cover

They do not describe cleaning up the app registration or certificate, certificate renewal, or how to store certificates safely on Azure-hosted runners. Check Microsoft's current guidance before you choose how to deploy certificates to your automation host.

## Related

- [Microsoft Graph PowerShell](https://www.m365.fm/entity/microsoft-graph-powershell/)
- [Service principal](https://www.m365.fm/entity/service-principal/)
- [App registration](https://www.m365.fm/entity/app-registration/)
- [X.509 certificate](https://www.m365.fm/entity/x509-certificate/)

## Sources

- [Microsoft Learn: Use app-only authentication with the Microsoft Graph PowerShell SDK](https://learn.microsoft.com/en-us/powershell/microsoftgraph/app-only?view=graph-powershell-1.0)
- [Microsoft Learn: Microsoft Graph PowerShell authentication commands](https://learn.microsoft.com/en-us/powershell/microsoftgraph/authentication-commands?view=graph-powershell-1.0)
- [Microsoft Learn: Connect-MgGraph reference](https://learn.microsoft.com/en-us/powershell/module/microsoft.graph.authentication/connect-mggraph?view=graph-powershell-1.0)
