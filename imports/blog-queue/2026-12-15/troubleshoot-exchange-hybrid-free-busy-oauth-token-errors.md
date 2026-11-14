---
title: "Troubleshoot Exchange Hybrid Free/Busy Failures and OAuth Token Errors"
summary: "A checklist for hybrid free/busy that fails in one or both directions: confirm the direction, run the checker, read the error, then fix OAuth, certificate, Autodiscover or TLS causes as Microsoft Learn documents them."
status: review
publish: false
author: mirko-p
date: 2026-12-15
topics: [exchange-online, exchange-server, oauth, microsoft-365]
keypoints:
  - "Identify which direction fails first, then run the Hybrid Free/Busy Checker. It checks OAuth and DAuth settings and changes nothing."
  - "Use Test-OAuthConnectivity to find the error. Invalid signature, key not found and missing signing certificate each have a different fix."
  - "A 401 from a reverse proxy or firewall often means preauthentication is on. Autodiscover and EWS in hybrid do not support it."
  - "Misconfigured TLS 1.2 on any Exchange server can break free/busy and the Hybrid Configuration wizard steps."
  - "Microsoft's dedicated hybrid app replaces the shared service principal, and legacy DAuth stops working once EWS retires in Exchange Online."
faq:
  - q: "How do I tell whether my hybrid uses OAuth or DAuth?"
    a: "The Exchange team's troubleshooting article says an OAuth request path has no /WSSecurity suffix and the IIS entry shows a server-to-server identity for Autodiscover, while DAuth (organization relationship) requests end in /WSSecurity. The free/busy checker script also reports on whichever method is in use."
  - q: "What does 'The token has an invalid signature' mean?"
    a: "Per Microsoft Learn, the Microsoft authorization server settings are invalid. Refresh them with Set-AuthServer <name> -RefreshAuthMetadata, wait about 15 minutes or run iisreset /noforce on each Exchange server, then check Get-AuthServer. If the values are wrong, rerun the Hybrid Configuration wizard."
  - q: "Free/busy fails with HTTP 401 only through our reverse proxy. Why?"
    a: "Learn lists a perimeter device that preauthenticates requests as the cause. Autodiscover and EWS virtual directories in hybrid deployments do not support preauthentication, so disable it or pass the requests through, then retest with the Remote Connectivity Analyzer."
  - q: "Can TLS settings cause this?"
    a: "Yes. Learn says that when TLS 1.2 is not fully configured on all Exchange servers, free/busy can be intermittent or fail, shared calendars show 'Could not update' and MailTips do not display. Fix TLS on every server and retry."
  - q: "Does the OAuth configuration still use a certificate uploaded to the shared service principal?"
    a: "Microsoft's pages call that approach obsolete and recommend the dedicated Exchange hybrid application instead. Servers on older builds cannot use rich coexistence features because EWS access through the shared service principal was permanently blocked on October 31, 2025."
---

Start with the direction. Cloud users that cannot see on-premises free/busy and on-premises users that cannot see cloud free/busy are different problems with different logs. Run Microsoft's checker, capture the real error, and only then change settings. This article follows the order Microsoft's troubleshooting pages use.

## Step 1: Confirm symptom and direction

Hash marks in the Scheduling Assistant mean the lookup failed. Identify the requester and the target mailbox and which side hosts each. Test on-premises to on-premises free/busy first. If that fails, fix it before looking at hybrid.

## Step 2: Run the checks Microsoft recommends

- **Remote Connectivity Analyzer Free/Busy test.** Use Modern Authentication for the source mailbox and one target mailbox per test. Read the Additional details on failure.
- **Hybrid Free/Busy Checker** (CSS-Exchange). It collects availability settings for OAuth and DAuth in Exchange Server and Exchange Online and flags values that differ from standard. It is a beta, makes no changes, and a flagged value is not always wrong. Run it as administrator with the ActiveDirectory and ExchangeOnlineManagement modules. Connect with `Connect-ExchangeOnline -Prefix EO` first, or it reports on-premises only. Output is an HTML and a TXT report.
- **Autodiscover from PowerShell.** `Invoke-RestMethod` against `https://outlook.office365.com/autodiscover/autodiscover.json?Email=<address>&Protocol=EWS` for a cloud and an on-premises address.

Capture the exact error. Sources named on the Exchange team blog include Outlook logging, the OWA F12 Network tab (`GetSchedule` for a cloud source, `GetUserAvailabilityInternal` for on-premises) and Fiddler. Correlate with the ClientRequestID in the HttpProxy, EWS and IIS logs. In the Application log, source MSExchange Availability, Event ID 4002 is worth checking.

## Step 3: Use Test-OAuthConnectivity

From on-premises to Exchange Online:

`Test-OAuthConnectivity -Service EWS -TargetUri https://outlook.office365.com/ews/exchange.asmx -Mailbox <on-premises mailbox> -Verbose | Format-List`

From Exchange Online to on-premises, run it in Exchange Online PowerShell with your external EWS host name. A good result ends in `ResultType: Success`.

### Common OAuth errors and fixes from Learn

| Error | Cause | First fix |
|---|---|---|
| 401, token has an invalid signature | Authorization server settings invalid | `Set-AuthServer <name> -RefreshAuthMetadata`, wait about 15 minutes or `iisreset /noforce`, verify with `Get-AuthServer`, rerun the Hybrid Configuration wizard if wrong |
| 401, key was not found (AADSTS50012) | On-premises OAuth certificate missing in Exchange Online | Compare thumbprints, upload or replace the certificate, check the SPN with `Get-AuthConfig` |
| 401, missing signing certificate | Auth configuration points to an invalid certificate | Create and publish a new auth certificate with `Set-AuthConfig`, then clear the previous one |
| `invalid_user`, does not exist | On-premises mailbox and mail user not synced | Run Microsoft Entra Connect |
| `invalid_user`, ambiguous | UPN, SMTP or SIP address used by another object | Find the duplicate with an LDAP query, change or delete it |
| Object moved | TargetSharingEpr wrong | Correct it on the intra-organization connector and organization relationship |

Learn gives the exact commands per error. Copy them from the page, because several need your thumbprints or server names. The Learn text also uses the retired MSOnline cmdlets in places, so check for Graph equivalents.

## Step 4: Check the network path

A 401 that appears only through a reverse proxy, firewall or TMG often means preauthentication. Autodiscover and EWS virtual directories in hybrid do not support it. In the HttpProxy logs, look for `ASAutoDiscover/CrossForest/EmailDomain` and `ASProxy/CrossForest/EmailDomain` entries. If they are absent, requests are not reaching IIS and the problem is upstream.

Other network errors listed on Learn: unable to connect to the remote server (firewall blocks), connection forcibly closed (inbound blocked from Exchange Online IPs), request timed out, and could not create SSL/TLS secure channel.

## Step 5: Check TLS 1.2 on all servers

A separate Learn page says all of these come from TLS 1.2 not being fully configured on every Exchange server: intermittent free/busy, "Could not update" when adding a shared calendar, and MailTips not displaying. It also lists Hybrid Configuration wizard failures on Set-FederatedOrganizationIdentifier, Add-FederatedDomain, New-AuthServer and Test-OAuthConnectivity. Run the Hybrid Free/Busy Checker and the Exchange Health Checker, fix TLS per Microsoft's best-practice article, then retry.

## Step 6: Check permissions and organization settings

For the error "The caller does not have access to free/busy data", Learn says to check the Default user on the target calendar with `Get-MailboxFolderPermission <mailbox>:\Calendar`. It should be AvailabilityOnly or LimitedDetails, not None. Also confirm the organization relationship lists the requester's domain. For Autodiscover 404 or name-resolution errors, check TargetAutodiscoverEpr and TargetAddressDomains, and confirm the remote routing address uses the `.mail.onmicrosoft.com` domain.

## Step 7: Check the dedicated hybrid app status

Microsoft's dedicated Exchange hybrid application page explains the change. Rich coexistence (free/busy, MailTips, photos) now needs a dedicated Entra ID app, because Exchange Server previously used a shared first-party service principal and EWS access through it was permanently blocked on October 31, 2025. Supported builds are listed on the page. A Graph-based flow is available from the May 2026 Hotfix Update in Microsoft 365 Global only. The page also lists October 2026 for EWS retirement in Exchange Online and says legacy DAuth stops working once EWS retires, so check its current status and move to OAuth.

Verify with `Test-OAuthConnectivity -Service EWS -TargetUri https://outlook.office365.com -Mailbox <mailbox>`, then check Entra sign-in logs for service principal sign-ins. Configuration can take up to 60 minutes to be recognized.

## When to stop

If the checker, the connectivity test and the logs do not explain the failure, collect the ClientRequestID, the Test-FederationTrust or Test-OAuthConnectivity output and the checker report before opening a support case.

## Related

- [Exchange Online](https://www.m365.fm/entity/exchange-online/)
- [Exchange Server](https://www.m365.fm/entity/exchange-server/)
- [OAuth](https://www.m365.fm/entity/oauth/)

## Sources

- [Free/busy errors: causes and resolutions](https://learn.microsoft.com/en-us/outlook/troubleshoot/calendaring/resolve-free-busy-errors)
- [Resolve free/busy sharing issues in a hybrid Exchange environment (TLS 1.2)](https://learn.microsoft.com/en-us/exchange/troubleshoot/hybrid-configuration-wizard-errors/free-busy-sharing-issues-tls12)
- [Dedicated Exchange hybrid application](https://learn.microsoft.com/en-us/exchange/hybrid-deployment/deploy-dedicated-hybrid-app)
- [Configure OAuth authentication between Exchange and Exchange Online](https://learn.microsoft.com/en-us/exchange/configure-oauth-authentication-between-exchange-and-exchange-online-organizations-exchange-2013-help)
- [Hybrid Free/Busy Checker](https://microsoft.github.io/CSS-Exchange/Diagnostics/FreeBusyChecker/FreeBusyChecker/)
- [Demystifying hybrid free/busy (Exchange Team Blog)](https://techcommunity.microsoft.com/blog/exchange/demystifying-hybrid-freebusy-finding-errors-and-troubleshooting/607727)
- [Troubleshoot free/busy issues in Exchange hybrid](https://learn.microsoft.com/en-us/exchange/troubleshoot/calendars/troubleshoot-freebusy-issues-in-exchange-hybrid)
