---
title: "Enable Hybrid Modern Authentication for Exchange On-Premises Without Breaking Legacy Outlook Clients"
summary: "Steps to turn on Hybrid Modern Authentication for on-premises Exchange, which clients and protocols support it, which keep using legacy authentication, and the OWA and ECP step that does remove other methods."
status: review
publish: false
author: mirko-p
date: 2026-12-17
topics: [exchange-server, outlook, entra-id, exchange-online]
keypoints:
  - "HMA is enabled with Set-AuthServer for the EvoSTS object and Set-OrganizationConfig. The core steps do not remove NTLM or Negotiate from the virtual directories."
  - "Clients and protocols that do not support modern authentication continue to use legacy authentication after HMA is enabled."
  - "MAPI over HTTP, EWS, ActiveSync, OAB and Autodiscover support HMA. Outlook Anywhere, IMAP and POP do not."
  - "Learn says Office 2010 and Office for Mac 2011 do not support modern authentication and can only use basic authentication."
  - "Enabling HMA for OWA and ECP is a separate, optional step that requires disabling every other authentication method on those virtual directories."
faq:
  - q: "Does enabling HMA turn off NTLM for Outlook?"
    a: "The Microsoft Learn configuration steps do not remove it. The example output for the MAPI virtual directory shows Ntlm, OAuth and Negotiate side by side, and Learn says clients that do not support modern authentication keep using legacy mechanisms. The exception is the optional OWA and ECP step, which requires disabling the other authentication methods on those two directories."
  - q: "Which protocols support Hybrid Modern Authentication?"
    a: "According to Microsoft Learn, MAPI over HTTP, Exchange ActiveSync, Exchange Web Services, Outlook on the web, the Exchange admin center, and the Offline Address Book support it. Outlook Anywhere (RPC/HTTP), IMAP and POP do not."
  - q: "Does HMA work for Outlook 2010?"
    a: "Microsoft Learn says legacy client apps such as Office 2010 and Office for Mac 2011 do not support modern authentication and can only be used with basic authentication. The Learn pages read do not describe how Outlook 2010 behaves against an HMA-enabled server, so test it with a pilot user."
  - q: "How do I check that a client uses modern authentication?"
    a: "Microsoft Learn says to hold the Ctrl key, right-click the Outlook icon in the notification area, select Connection Status, and look for the AuthN type Bearer for the client's SMTP address. A client uses the new flow at its next sign-in, and no new profile is needed."
  - q: "Which Exchange versions are supported for HMA?"
    a: "The Microsoft Learn configuration article lists Exchange Server 2016 CU8 or later and Exchange Server 2019 CU1 or later, with no end-of-life servers in the organization. It also requires classic hybrid, because modern hybrid does not support HMA, and no SSL offloading."
---

Hybrid Modern Authentication (HMA) lets Outlook and other clients get OAuth tokens from Microsoft Entra ID and present them to on-premises Exchange. The core steps add the service names, check that OAuth is on every virtual directory and set the EvoSTS auth server as the default. Microsoft Learn does not tell you to remove NTLM or Negotiate in these steps, and it says clients without modern authentication support keep using legacy authentication. The one place where other methods are removed is the optional OWA and ECP step.

## Check the prerequisites

The Learn configuration article lists these Exchange requirements:

- No end-of-life Exchange servers in the organization.
- Exchange Server 2016 CU8 or later, or Exchange Server 2019 CU1 or later. In a hybrid configuration, run the latest CU to stay supported.
- Servers can reach the internet, through a proxy if needed.
- A classic hybrid deployment. Modern hybrid does not support HMA, and the overview page adds that HMA is not supported with the Hybrid Agent.
- No SSL offloading. SSL bridging is supported.
- HMA configured uniformly on all Exchange servers. Partial implementation is not supported.

User identities must exist in Microsoft Entra ID. Learn warns that unsynchronized accounts, including the built-in Administrator, cannot sign in with OAuth once HMA is enabled.

## Know which clients and protocols work

| Protocol | HMA supported |
|---|---|
| MAPI over HTTP | Yes |
| Exchange ActiveSync | Yes |
| Exchange Web Services | Yes |
| Outlook on the web and ECP | Yes |
| Offline Address Book | Yes |
| Outlook Anywhere (RPC/HTTP) | No |
| IMAP and POP | No |

Learn lists Outlook 2013 and later on MAPI over HTTP, Outlook 2016 for Mac and later on Exchange Web Services, Outlook for iOS and Android, and Exchange ActiveSync clients that support modern authentication. For ActiveSync clients, the profile must be recreated to switch from basic to modern authentication. For Outlook 2013 and later, MAPI over HTTP must be enabled.

For everything else, Learn says clients and protocols that are not listed continue to use legacy authentication mechanisms after modern authentication is enabled. A separate Learn page states that Office 2010 and Office for Mac 2011 do not support modern authentication and can only be used with basic authentication.

## Register the URLs as service principal names

All internal and external URLs that clients might use must be registered as HTTPS SPNs for the Exchange Online application (`00000002-0000-0ff1-ce00-000000000000`). First list the URLs on the Exchange server with commands such as `Get-MapiVirtualDirectory -ADPropertiesOnly | fl server,*url*`, and the same for web services, OAB, Autodiscover and ActiveSync. Then, with the Microsoft Graph PowerShell module:

1. Connect with `Connect-MgGraph -Scopes Application.Read.All, Application.ReadWrite.All`.
2. List the existing names with `Get-MgServicePrincipal` for that application ID and expand `ServicePrincipalNames`.
3. Add missing URLs, including the generic `autodiscover` name, to `ServicePrincipalNames` and run `Update-MgServicePrincipal`.
4. List the names again and compare.

With several tenants in hybrid, add the names to each tenant.

## Verify OAuth on the virtual directories

Run `Get-MapiVirtualDirectory | fl server,*url*,*auth*` and the matching commands for web services, OAB, Autodiscover and ActiveSync. Learn says `OAuth` must be present for each. Its example shows `IISAuthenticationMethods : {Ntlm, OAuth, Negotiate}`. If OAuth is missing, add it with the relevant `Set-...VirtualDirectory` command, and keep the existing methods in place for clients that still need them.

## Check the EvoSTS auth server and the OAuth certificate

Run `Get-AuthServer | where {$_.Name -like "EvoSts*"} | ft name,enabled`. You should see `EvoSts - <GUID>` with `Enabled` True. If not, run the latest Hybrid Configuration Wizard. Also confirm the Exchange OAuth certificate is valid. Learn points to the MonitorExchangeAuthCertificate script for that.

## Enable HMA

Replace the GUID with your value:

```powershell
Set-AuthServer -Identity "EvoSTS - <GUID>" -IsDefaultAuthorizationEndpoint $true
Set-OrganizationConfig -OAuth2ClientProfileEnabled $true
```

For Exchange 2016 CU18 or later, or Exchange 2019 CU7 or later, with a Hybrid Configuration Wizard downloaded after September 2020, add `-DomainName` with the tenant domain to the first command. You can check the status later with `Get-OrganizationConfig | ft OAuth*`, where `OAuth2ClientProfileEnabled` False means modern authentication is disabled.

## Verify with a pilot user

Learn says a client uses the new flow at its next sign-in. Turning HMA on does not force reauthentication and does not need a new profile. Use the Outlook connection status check from the FAQ and look for the `Bearer` authentication type. Test one modern Outlook client, one legacy client and one ActiveSync device before you tell users.

## Treat OWA and ECP as a separate decision

Enabling HMA for OWA and ECP is a separate procedure with stricter prerequisites. Learn requires Exchange Server 2019 CU14 with the April 2024 HU or later on all servers, synchronized identities and a working OAuth setup. The steps add reply URLs and then require you to disable AD FS, Basic, Forms and Digest authentication on the OWA and ECP virtual directories before enabling OAuth. Users are then redirected to the Microsoft Entra sign-in page. Publishing OWA and ECP through Microsoft Entra application proxy is unsupported. Document the current OWA and ECP settings first so you can roll back.

Skip this step if the goal is to keep legacy access working, because it removes the other methods on those directories.

## Outlook for iOS and Android

Allow the AutoDetect service to reach Exchange on TCP 443. Learn lists `<email_domain>.outlookmobile.com`, `<email_domain>.outlookmobile.us`, `52.125.128.0/20` and `52.127.96.0/23`.

## Typical mistakes

- Enabling HMA on only some servers.
- Leaving out internal or external URLs in the SPN list, or the generic Autodiscover name.
- Using an administrator account that is not synchronized to Entra ID.
- Running the OWA and ECP step and expecting other methods to remain.
- Assuming Outlook Anywhere clients will switch to OAuth.

## What the sources do not say

The Learn pages read do not describe how Outlook 2010 or other unsupported clients behave against a server with HMA enabled, beyond saying they keep using legacy authentication. They also do not state a timeline for ending legacy authentication for on-premises Exchange. Test your own client mix with a pilot group.

## Related

- [Exchange Server](https://www.m365.fm/entity/exchange-server/)
- [Outlook](https://www.m365.fm/entity/outlook/)
- [Entra ID](https://www.m365.fm/entity/entra-id/)
- [Exchange Online](https://www.m365.fm/entity/exchange-online/)

## Sources

- [Configure Exchange Server to use Hybrid Modern Authentication](https://learn.microsoft.com/en-us/microsoft-365/enterprise/configure-exchange-server-for-hybrid-modern-authentication)
- [Hybrid Modern Authentication overview and prerequisites](https://learn.microsoft.com/en-us/microsoft-365/enterprise/hybrid-modern-auth-overview)
- [How modern authentication works for Office 2016 and Office 2019 client apps](https://learn.microsoft.com/en-us/microsoft-365/enterprise/modern-auth-for-office-2013-and-2016)
